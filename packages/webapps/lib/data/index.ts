import {
  getTeamMemberAddress,
  redisClient,
  teamMemberKey,
  userLeaderboardIDOKey,
} from "../redis";
import type { TeamMember } from "../typings";

export const SCORE_TOKEN = {
  symbol: "STUDY",
  name: "StudyPoints",
  decimals: 18,
  address: "0x1234...5678",
};

type TeamMemberStatus = "active" | "eliminated" | "cooldown";

// Mock data for clans

export async function getTeamMembers(teamId: number) {
  try {
    const keys = await redisClient.keys(teamMemberKey(teamId, "*"));

    console.log(keys);
    const pipeline = redisClient.pipeline();
    for (const key of keys) {
      pipeline.get(key);
    }
    const results: TeamMemberStatus[] = await pipeline.exec<
      TeamMemberStatus[]
    >();

    return results.map((result, index) => ({
      address: getTeamMemberAddress(keys[index]),
      status: result,
    }));
  } catch (error) {
    return [];
  }
}

export async function getAllTeamMembers(): Promise<
  {
    teamId: number;
    address: `0x${string}`;
    status: TeamMemberStatus;
  }[]
> {
  try {
    const keys = await redisClient.keys(teamMemberKey("*", "*"));
    const pipeline = redisClient.pipeline();
    for (const key of keys) {
      pipeline.get(key);
    }
    const results = await pipeline.exec<TeamMemberStatus[]>();

    return results.map((result, index) => {
      console.log({ result });
      const parts = keys[index].split(":");
      return {
        teamId: Number(parts[1]),
        address: parts[3] as `0x${string}`,
        status: result,
      };
    });
  } catch (error) {
    return [];
  }
}

export async function getTeamLeaderboardIDO() {
  // 获取所有团队成员的 Redis key
  const keys = await redisClient.keys(teamMemberKey("*", "*"));

  // 解析出所有成员地址和团队ID
  const memberInfo: { teamId: number; address: `0x${string}` }[] = keys.map(
    (key: string) => {
      // key 形如 team:1:member:0xabc...
      const parts = key.split(":");
      return {
        teamId: Number(parts[1]),
        address: parts[3] as `0x${string}`,
      };
    }
  );

  // 获取所有用户的 IDO 排行分数
  const idoBalances = await redisClient.zrange(userLeaderboardIDOKey, 0, -1, {
    withScores: true,
  });
  // idoBalances: [address1, score1, address2, score2, ...]
  const addressToScore: Record<string, number> = {};
  for (let i = 0; i < idoBalances.length; i += 2) {
    addressToScore[idoBalances[i] as string] = Number(idoBalances[i + 1]);
  }

  // 聚合每个团队的总分
  const teamScores: Record<
    number,
    {
      teamId: number;
      score: number;
      members: { address: `0x${string}`; score: number }[];
    }
  > = {};

  for (const { teamId, address } of memberInfo) {
    const score = addressToScore[address] ?? 0;
    if (!teamScores[teamId]) {
      teamScores[teamId] = { teamId, score: 0, members: [] };
    }
    teamScores[teamId].score += score;
    teamScores[teamId].members.push({ address, score });
  }

  // 转为数组并按分数降序排序
  const leaderboard = Object.values(teamScores).sort(
    (a, b) => b.score - a.score
  );

  return leaderboard;
}
