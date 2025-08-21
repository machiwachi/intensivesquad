import * as R from "ramda";
import {
  teamEconomyConfig,
  teamManagerConfig,
} from "@/lib/contracts/generated";
import { getTeamLeaderboardIDO, getTeamMembers, getUsers } from "@/lib/data";
import { redisClient, teamMemberKey, userLeaderboardIDOKey } from "@/lib/redis";
import type { Activity } from "@/lib/typings";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { handle } from "hono/vercel";
import { decode } from "next-auth/jwt";
import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  parseEther,
  parseEventLogs,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { multicall, readContract } from "viem/actions";
import { sepolia } from "viem/chains";
import { z } from "zod";

const zeroxSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]+$/)
  .transform((val) => {
    return val as `0x${string}`;
  });

const chainConfig = {
  chain: sepolia,
  transport: http(),
};

const publicClient = createPublicClient(chainConfig);

const adminClient = createWalletClient({
  ...chainConfig,
  account: privateKeyToAccount(
    zeroxSchema.parse(process.env.ADMIN_PRIVATE_KEY)
  ),
});

const teamManager = getContract({
  ...teamManagerConfig,
  client: publicClient,
});
const teamEconomy = getContract({
  ...teamEconomyConfig,
  client: adminClient,
});

const jwt = createMiddleware<{
  Variables: {
    address?: `0x${string}`;
  };
}>(async (c, next) => {
  const token = await decode({
    token: getCookie(c, "next-auth.session-token"),
    secret: process.env.NEXTAUTH_SECRET!,
  });

  c.set("address", token?.address as `0x${string}`);
  await next();
});

const testRouter = new Hono()
  .get("/redis/set", async (c) => {
    const v = c.req.queries("v");
    const res = await redisClient.incr("test");
    return c.json({ message: "redis-set", res });
  })
  .get("/redis/get", async (c) => {
    const res = await redisClient.get("test");
    return c.json({ message: "redis-get", res });
  });

const app = new Hono()
  .basePath("api")
  .use(jwt)
  .route("/test", testRouter)
  .get("/hello", async (c) => {
    const address = c.var.address;

    return c.json({ message: "hello", address });
  })
  .get("/users", async (c) => {
    const users = await getUsers();

    return c.json(users);
  })
  .get("/teams", async (c) => {
    // 获取团队排行榜（包含总分和成员信息）
    const leaderboard = await getTeamLeaderboardIDO();

    // 使用 multicall 批量获取团队 WEDO 余额
    const teamWedoBalances = await multicall(publicClient, {
      contracts: leaderboard.map((team) => ({
        ...teamEconomyConfig,
        functionName: "teamWedoBalance",
        args: [BigInt(team.teamId)],
      })),
    });

    // 使用 multicall 批量获取团队杠杆（L值）
    const teamLeverages = await multicall(publicClient, {
      contracts: leaderboard.map((team) => ({
        ...teamEconomyConfig,
        functionName: "getTeamL",
        args: [BigInt(team.teamId)],
      })),
    });

    // 使用 multicall 批量获取团队元数据
    const teamMetadatas = await multicall(publicClient, {
      contracts: leaderboard.map((team) => ({
        ...teamManagerConfig,
        functionName: "teams",
        args: [BigInt(team.teamId)],
      })),
    });

    // 组装返回数据
    const rankedTeams = leaderboard.map((team, idx) => {
      // 获取对应的 WEDO 余额和杠杆
      const wedoBalanceResult = teamWedoBalances[idx];
      const leverageResult = teamLeverages[idx];
      const metadataResult = teamMetadatas[idx];

      // 处理 multicall 返回值
      const wedoBalance =
        wedoBalanceResult.status === "success" ? wedoBalanceResult.result : 0;
      const leverageRaw =
        leverageResult.status === "success"
          ? BigInt(leverageResult.result)
          : BigInt(0);
      const leverage = String(leverageRaw * BigInt(10));

      console.log({ wedoBalance, leverage, metadataResult });

      // 处理团队元数据
      const teamMetadata: [string, bigint] =
        metadataResult.status === "success"
          ? (metadataResult.result as unknown as [string, bigint])
          : ["", BigInt(0)];

      return {
        id: team.teamId,
        name: teamMetadata[0] as string,
        remainingMembers: Number(teamMetadata[1]),
        members: team.members,
        totalScore: team.score,
        totalMembers: 6, // TODO: 可根据实际情况调整
        isUserTeam: false,
        rank: idx + 1,
        leverage,
        scoreHistory: [1, 2, 3],
        dividendVault: {
          totalBalance: String(wedoBalance), // 这里填充真实的 WEDO 余额
          userClaimable: 0,
          totalDistributed: 12340.5,
        },
        flag: "🔥",
        previousRank: 9,
      };
    });

    return c.json(rankedTeams);
  })
  .post(
    "/credit",
    zValidator(
      "json",
      z.object({
        amount: z.number(),
        account: zeroxSchema,
      })
    ),
    async (c) => {
      const { amount: idoAmount, account } = c.req.valid("json");

      console.log("收到请求 /credit，参数：", { idoAmount, account });

      try {
        const teamId = await teamManager.read.accountTeam([account]);
        console.log("查询到 teamId：", teamId);

        const dividendRate = 20;
        const wedoAmount = idoAmount / dividendRate;

        console.log("计算 wedoAmount：", wedoAmount);

        const idoTx = await teamEconomy.write.creditPersonalIDO([
          account,
          parseEther(idoAmount.toString()),
        ]);
        console.log("已发送 creditPersonalIDO 交易，hash：", idoTx);

        await redisClient.zadd(
          userLeaderboardIDOKey,
          { incr: true },
          {
            score: idoAmount,
            member: account,
          }
        );

        const wedoTx = await teamEconomy.write.creditTeamWEDO([
          teamId,
          parseEther(wedoAmount.toString()),
        ]);
        console.log("已发送 creditTeamWEDO 交易，hash：", wedoTx);

        return c.json({
          message: "credited",
          wedoAmount,
          idoAmount,
          account,
          idoTx,
          wedoTx,
        });
      } catch (error) {
        console.error("处理 /credit 时发生错误：", error);
        return c.json(
          {
            message: "error",
          },
          500
        );
      }
    }
  )
  .post(
    "/members/events",
    zValidator("json", z.object({ txHash: zeroxSchema })),
    async (c) => {
      const { txHash } = c.req.valid("json");

      console.log("收到 /members/events 请求，参数：", { txHash });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log("交易回执：", receipt);
      if (receipt.status !== "success") {
        console.warn("交易回执状态非 success：", receipt.status);
        return c.json({ message: "tx reverted" }, 400);
      }
      const logs = parseEventLogs({
        logs: receipt.logs,
        abi: teamManagerConfig.abi,
      });
      console.log("解析到的事件日志：", logs);
      let persisted = 0;
      for (const log of logs) {
        if (log.eventName === "MemberJoined") {
          const { teamId, account } = log.args;
          // 可选：仅允许当前登录地址的事件（提升数据可信度）
          // const caller = c.var.address?.toLowerCase();
          // if (caller && caller !== account.toLowerCase()) continue;
          const key = teamMemberKey(Number(teamId), account);
          console.log(
            `检测到 MemberJoined 事件，teamId: ${teamId}, account: ${account}, redis key: ${key}`
          );
          await redisClient.set(key, "active");
          persisted++;
        } else if (log.eventName === "MemberLeft") {
          const { teamId, account } = log.args;
          const key = teamMemberKey(Number(teamId), account);
          console.log(
            `检测到 MemberLeft 事件，teamId: ${teamId}, account: ${account}, redis key: ${key}`
          );
          await redisClient.del(key);
        }
      }
      console.log("处理完成，返回响应");
      return c.json({ message: "processed", persisted });
    }
  )
  .get("/leaderboard/ido/user", async (c) => {
    const flatRank = await redisClient.zrange(userLeaderboardIDOKey, 0, -1, {
      withScores: true,
    });
    const createMemberScores = R.pipe(
      R.splitEvery(2),
      R.map(R.zipObj(["address", "score"]))
    );
    const sortedUsers: { address: `0x${string}`; score: number }[] =
      createMemberScores(flatRank);
    return c.json(sortedUsers);
  })
  .get("/leaderboard/ido/team", async (c) => {
    const teamLeaderboard = await getTeamLeaderboardIDO();
    return c.json(teamLeaderboard);
  })
  .get("/teamEconomy", async (c) => {
    const leaderboard = await getTeamLeaderboardIDO();

    const teamWedoBalances = await multicall(publicClient, {
      contracts: leaderboard.map((team) => ({
        ...teamEconomyConfig,
        functionName: "teamWedoBalance",
        args: [BigInt(team.teamId)],
      })),
    });
    const teamLeverages = await multicall(publicClient, {
      contracts: leaderboard.map((team) => ({
        ...teamEconomyConfig,
        functionName: "getTeamL",
        args: [BigInt(team.teamId)],
      })),
    });

    console.log(teamWedoBalances, teamLeverages);
    // const res = await teamEconomy.read.stageScalar();
    return c.json({});
  });

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;
