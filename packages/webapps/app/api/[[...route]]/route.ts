import { teamManagerConfig } from "@/lib/contracts/generated";
import { getUsers } from "@/lib/data";
import type { TeamMember } from "@/lib/hooks";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { handle } from "hono/vercel";
import { decode } from "next-auth/jwt";
import { createPublicClient, getContract, http } from "viem";
import { readContract } from "viem/actions";
import { sepolia } from "viem/chains";

export type Activity = {
  user: string;
  action: string;
  points: number;
  time: string;
};

const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const teamManager = getContract({
  ...teamManagerConfig,
  client,
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

const app = new Hono()
  .basePath("api")
  .use(jwt)
  .get("/hello", async (c) => {
    const address = c.var.address;

    return c.json({ message: "hello", address });
  })
  .get("/users", async (c) => {
    const users = await getUsers();

    return c.json(users);
  })
  .get("/teams", async (c) => {
    const teamCount = Number(await teamManager.read.nextTeamId());
    const teams = await Promise.all(
      Array.from({ length: teamCount }, async (_, i) => {
        const teamId = i + 1;
        return readContract(client, {
          ...teamManager,
          functionName: "teams",
          args: [BigInt(teamId)],
        }).then((res) => {
          return {
            id: teamId,
            name: res[0],
            remainingMembers: Number(res[1]),
          };
        });
      })
    );

    const members: TeamMember[] = [];
    const activities: Activity[] = [];

    const rankedTeams = teams.map((t) => {
      return {
        ...t,
        totalScore: 0,
        totalMembers: 6,
        members,
        isUserTeam: false,
        rank: 0,
        leverage: 1.2,
        scoreHistory: [1, 2, 3],
        activities,
        dividendVault: {
          totalBalance: 0,
          userClaimable: 0,
          lastDistribution: "",
          totalDistributed: 12340.5,
        },
        flag: "🔥",
        previousRank: 9,
      };
    });

    return c.json(rankedTeams);
  });

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;
