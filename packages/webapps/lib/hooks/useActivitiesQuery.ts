"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Activity } from "@/lib/typings";

/**
 * TanStack Query hooks for managing activities data
 */

// Query Keys
export const activitiesQueryKeys = {
  all: ["activities"] as const,
  allTeams: () => [...activitiesQueryKeys.all, "all-teams"] as const,
  team: (teamId: number) =>
    [...activitiesQueryKeys.all, "team", teamId] as const,
  user: (userAddress: string) =>
    [...activitiesQueryKeys.all, "user", userAddress] as const,
} as const;

/**
 * 获取所有团队的活动数据
 */
export function useAllActivities(options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: activitiesQueryKeys.allTeams(),
    queryFn: async (): Promise<Activity[]> => {
      const response = await apiClient.teams[":teamId"].activities.$get({
        param: { teamId: "*" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.status}`);
      }

      const activities = await response.json();

      // 解析JSON字符串为Activity对象（如果需要）
      return activities.map((activity: any) => {
        if (typeof activity === "string") {
          return JSON.parse(activity) as Activity;
        }
        return activity as Activity;
      });
    },
    refetchInterval: options?.refetchInterval ?? 30000, // 默认30秒
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 2, // 2分钟内认为数据是新鲜的
    gcTime: 1000 * 60 * 10, // 缓存10分钟
    refetchIntervalInBackground: true,
  });
}

/**
 * 获取特定团队的活动数据
 */
export function useTeamActivities(
  teamId: number,
  options?: {
    refetchInterval?: number;
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: activitiesQueryKeys.team(teamId),
    queryFn: async (): Promise<Activity[]> => {
      const response = await apiClient.teams[":teamId"].activities.$get({
        param: { teamId: teamId.toString() },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch team ${teamId} activities: ${response.status}`
        );
      }

      const activities = await response.json();

      return activities.map((activity: any) => {
        if (typeof activity === "string") {
          return JSON.parse(activity) as Activity;
        }
        return activity as Activity;
      });
    },
    refetchInterval: options?.refetchInterval ?? 30000,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * 获取活动数据的工具函数
 */
export function useActivitiesUtils() {
  const queryClient = useQueryClient();

  return {
    // 手动刷新所有活动
    refetchAllActivities: () => {
      return queryClient.invalidateQueries({
        queryKey: activitiesQueryKeys.all,
      });
    },

    // 手动刷新特定团队活动
    refetchTeamActivities: (teamId: number) => {
      return queryClient.invalidateQueries({
        queryKey: activitiesQueryKeys.team(teamId),
      });
    },

    // 预取团队活动数据
    prefetchTeamActivities: async (teamId: number) => {
      return queryClient.prefetchQuery({
        queryKey: activitiesQueryKeys.team(teamId),
        queryFn: async () => {
          const response = await apiClient.teams[":teamId"].activities.$get({
            param: { teamId: teamId.toString() },
          });

          if (!response.ok) {
            throw new Error(`Failed to prefetch team ${teamId} activities`);
          }

          return response.json();
        },
        staleTime: 1000 * 60 * 2,
      });
    },

    // 获取缓存的活动数据
    getCachedActivities: () => {
      return queryClient.getQueryData(activitiesQueryKeys.allTeams()) as
        | Activity[]
        | undefined;
    },

    // 设置活动数据到缓存
    setActivitiesCache: (activities: Activity[]) => {
      queryClient.setQueryData(activitiesQueryKeys.allTeams(), activities);
    },

    // 清除所有活动缓存
    clearActivitiesCache: () => {
      queryClient.removeQueries({
        queryKey: activitiesQueryKeys.all,
      });
    },
  };
}
