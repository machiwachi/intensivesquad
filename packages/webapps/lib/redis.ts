import { Redis } from "@upstash/redis";

// Initialize Redis
export const redisClient = Redis.fromEnv();

export const teamMemberKey = (teamId: number, memberAddress: string) =>
  `team:${teamId}:member:${memberAddress}`;
export const teamKey = (teamId: number) => `team:${teamId}`;
