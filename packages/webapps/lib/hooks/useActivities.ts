"use client";

import { useMemo } from "react";
import { useAllActivities, useActivitiesUtils } from "./useActivitiesQuery";
import {
  useNewActivitiesStore,
  selectNewActivityIds,
  selectPendingNotifications,
} from "@/lib/stores/activities";
import type { Activity } from "@/lib/typings";

/**
 * 活动相关的主要 hook，结合 TanStack Query 和 Zustand
 * - TanStack Query 管理服务端状态（活动数据）
 * - Zustand 管理客户端状态（新活动标记）
 */
export function useActivities() {
  // 使用 TanStack Query 获取活动数据
  const {
    data: activities = [],
    isLoading,
    error,
    refetch,
  } = useAllActivities();

  // 使用 Zustand 获取新活动状态
  const newActivityIds = useNewActivitiesStore(selectNewActivityIds);
  const pendingNotifications = useNewActivitiesStore(
    selectPendingNotifications
  );
  const {
    markAsNew,
    markAsViewed,
    updateLastCheckTime,
    addPendingNotifications,
    clearPendingNotifications,
    reset,
  } = useNewActivitiesStore();

  const utils = useActivitiesUtils();

  // 计算带有新活动标记的活动列表
  const activitiesWithNewFlag = useMemo(() => {
    return activities.map((activity) => ({
      ...activity,
      isNew: newActivityIds.has(activity.id),
    }));
  }, [activities, newActivityIds]);

  return {
    // 数据状态
    activities: activitiesWithNewFlag,
    rawActivities: activities, // 原始数据，不带 isNew 标记
    isLoading,
    error: error?.message || null,

    // 新活动相关
    newActivityIds,
    pendingNotifications,
    hasNewActivities: newActivityIds.size > 0,

    // 操作方法
    refetch,
    markAsNew,
    markAsViewed,
    updateLastCheckTime,
    addPendingNotifications,
    clearPendingNotifications,
    reset,

    // 工具方法
    ...utils,
  };
}

/**
 * 获取最近的活动
 */
export function useRecentActivities(limit: number = 10) {
  const { data: activities = [] } = useAllActivities();

  return useMemo(() => {
    return activities.slice(0, limit);
  }, [activities, limit]);
}

/**
 * 根据团队ID过滤活动
 */
export function useTeamActivities(teamId: number) {
  const { data: activities = [] } = useAllActivities();

  return useMemo(() => {
    return activities.filter((activity) => activity.teamId === teamId);
  }, [activities, teamId]);
}

/**
 * 根据用户地址过滤活动
 */
export function useUserActivities(userAddress: `0x${string}`) {
  const { data: activities = [] } = useAllActivities();

  return useMemo(() => {
    return activities.filter(
      (activity) => activity.user.toLowerCase() === userAddress.toLowerCase()
    );
  }, [activities, userAddress]);
}

/**
 * 获取活动统计信息
 */
export function useActivitiesStats() {
  const { data: activities = [] } = useAllActivities();

  return useMemo(() => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    return {
      total: activities.length,
      lastHour: activities.filter((activity) => activity.timestamp > oneHourAgo)
        .length,
      lastDay: activities.filter((activity) => activity.timestamp > oneDayAgo)
        .length,
      uniqueUsers: new Set(activities.map((activity) => activity.user)).size,
      uniqueTeams: new Set(activities.map((activity) => activity.teamId)).size,
    };
  }, [activities]);
}
