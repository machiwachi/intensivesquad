import { apiClient, type InferResponseType } from "@/lib/api";
import { SCORE_TOKEN } from "@/lib/data";

export type User = {
  address: `0x${string}`;
};
export type Clan = InferResponseType<typeof apiClient.teams.$get>[number];

export type TokenType = typeof SCORE_TOKEN;

export interface Team {
  id: number;
  name: string;
  flag: string;
  rank: number;
  previousRank: number;
  totalScore: number;
  remainingMembers: number;
  totalMembers: number;
  leverage: number;
  isUserTeam: boolean;
  dividendVault: {
    totalBalance: number;
    userClaimable: number;
    lastDistribution: string;
    totalDistributed: number;
  };
  members: TeamMember[];
  scoreHistory: number[];
  activities: Array<Activity>;
}

export interface TeamMember {
  address: `0x${string}`;
  status: "active" | "eliminated" | "cooldown";
}

export type Activity = {
  user: string;
  action: string;
  points: number;
  time: string;
};
