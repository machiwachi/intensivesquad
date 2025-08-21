import {
  getTeamMemberAddress,
  redisClient,
  teamMemberKey,
  userLeaderboardIDOKey,
} from "../redis";

export const SCORE_TOKEN = {
  symbol: "STUDY",
  name: "StudyPoints",
  decimals: 18,
  address: "0x1234...5678",
};

// Mock data for clans

export async function getUsers() {
  const mockUsers = [
    {
      id: 1,
      name: "Alex",
      score: 3420,
      clanId: 1,
      avatar: "/pixel-warrior.png",
    },
    { id: 2, name: "Sam", score: 3200, clanId: 1, avatar: "/pixel-mage.png" },
    {
      id: 7,
      name: "Taylor",
      score: 3100,
      clanId: 2,
      avatar: "/placeholder-4jpab.png",
    },
    {
      id: 13,
      name: "Phoenix",
      score: 2980,
      clanId: 3,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      name: "Jordan",
      score: 2850,
      clanId: 1,
      avatar: "/pixel-archer.png",
    },
    {
      id: 8,
      name: "Blake",
      score: 2750,
      clanId: 2,
      avatar: "/pixel-warrior.png",
    },
    {
      id: 19,
      name: "Echo",
      score: 2650,
      clanId: 4,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 25,
      name: "Orion",
      score: 2580,
      clanId: 5,
      avatar: "/pixel-knight.png",
    },
    {
      id: 4,
      name: "Casey",
      score: 2450,
      clanId: 1,
      avatar: "/pixel-knight.png",
    },
    {
      id: 14,
      name: "Sage",
      score: 2380,
      clanId: 3,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 9,
      name: "Avery",
      score: 2320,
      clanId: 2,
      avatar: "/pixel-shield.png",
    },
    {
      id: 20,
      name: "Storm",
      score: 2280,
      clanId: 4,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 31,
      name: "Sage",
      score: 2150,
      clanId: 6,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 5,
      name: "Riley",
      score: 2100,
      clanId: 1,
      avatar: "/pixel-rogue.png",
    },
    {
      id: 26,
      name: "Vega",
      score: 2050,
      clanId: 5,
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];
  return mockUsers;
}

type Member = {
  address: `0x${string}`;
  status: "active" | "eliminated" | "cooldown";
};

export async function getTeamMembers(teamId: number): Promise<Member[]> {
  try {
    const keys = await redisClient.keys(teamMemberKey(teamId, "*"));

    console.log(keys);
    const pipeline = redisClient.pipeline();
    for (const key of keys) {
      pipeline.get(key);
    }
    const results: string[] = await pipeline.exec<string[]>();

    return results.map((result, index) => ({
      address: getTeamMemberAddress(keys[index]),
      status: result[1] as "active" | "eliminated" | "cooldown",
    }));
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
