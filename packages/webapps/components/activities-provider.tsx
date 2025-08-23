"use client";

import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAllActivities } from "@/lib/hooks/useActivitiesQuery";
import { useNewActivitiesStore } from "@/lib/stores/activities";
import { useTeams } from "@/lib/hooks/useTeams";
import type { Activity } from "@/lib/typings";
import { formatAddress } from "@/lib/utils";

interface ActivitiesProviderProps {
  children: React.ReactNode;
  /** 轮询间隔，单位毫秒，默认 30 秒 */
  pollInterval?: number;
  /** 是否启用活动通知，默认 true */
  enableNotifications?: boolean;
}

export function ActivitiesProvider({
  children,
  pollInterval = 5_000, // 30 秒
  enableNotifications = true,
}: ActivitiesProviderProps) {
  // 使用 TanStack Query 管理活动数据
  const {
    data: activities = [],
    isLoading,
    error,
    refetch,
  } = useAllActivities({
    refetchInterval: pollInterval,
    enabled: true,
  });

  // 获取团队数据以显示团队名称
  const { teams } = useTeams();
  const queryClient = useQueryClient();

  // 使用 Zustand 管理新活动状态
  const {
    markAsNew,
    updateLastCheckTime,
    addPendingNotifications,
    clearPendingNotifications,
  } = useNewActivitiesStore();

  const lastCheckTimeRef = useRef(0);
  const isInitialFetchRef = useRef(true);
  const previousActivitiesRef = useRef<Activity[]>([]);

  // 获取团队名称的辅助函数
  const getTeamName = useCallback(
    (teamId: number): string => {
      const team = teams.find((t) => t.id === teamId);
      return team?.name || `团队 ${teamId}`;
    },
    [teams]
  );

  // 格式化活动描述用于 toast 显示
  const formatActivityMessage = useCallback(
    (activity: Activity) => {
      const userAddr = formatAddress(activity.user);
      const teamName = getTeamName(activity.teamId);

      switch (activity.action) {
        case "领取奖励":
          return `${teamName} 的 ${userAddr} 领取了 ${activity.idoAmount} IDO 奖励！`;
        case "转换团队WEDO":
          return `${teamName} 的 ${userAddr} 转换了 ${Math.abs(
            activity.wedoAmount
          )} WEDO!`;
        default:
          return (
            <>
              <p>{`${teamName} 的 ${userAddr} `}</p>
              <p>
                执行了{" "}
                <span className="font-bold text-xl inline-block rotate-2 bg-neo-purple ">
                  {activity.action}
                </span>
              </p>
              <p>
                获得了{" "}
                <span className="font-bold text-xl inline-block -rotate-3 bg-retro-lime">
                  {activity.idoAmount} IDO
                </span>{" "}
              </p>
              {activity.wedoAmount > 0 && (
                <p>
                  为团队贡献了
                  <span className="font-bold text-xl inline-block rotate-1 bg-neo-pink">
                    {activity.wedoAmount} WEDO
                  </span>
                  !
                </p>
              )}
            </>
          );
      }
    },
    [getTeamName]
  );

  // 显示新活动的 toast 通知
  const showActivityNotification = useCallback(
    (activity: Activity) => {
      if (!enableNotifications) return;

      const message = formatActivityMessage(activity);
      const teamName = getTeamName(activity.teamId);

      // 根据活动类型选择不同的 toast 样式
      if (activity.action === "获得学习积分") {
        toast.success(message, {
          description: teamName,
          duration: 4000,
        });
      } else if (activity.action === "领取奖励") {
        toast.info(message, {
          description: teamName,
          duration: 4000,
        });
      } else if (activity.action === "转换团队WEDO") {
        toast.warning(message, {
          description: teamName,
          duration: 4000,
        });
      } else {
        toast(message, {
          description: teamName,
          duration: 4000,
        });
      }
    },
    [enableNotifications, formatActivityMessage, getTeamName]
  );

  // 检测新活动并处理通知
  const detectAndNotifyNewActivities = useCallback(() => {
    // 如果是初次加载，只记录当前状态
    if (isInitialFetchRef.current) {
      isInitialFetchRef.current = false;
      previousActivitiesRef.current = activities;
      lastCheckTimeRef.current = Date.now();
      updateLastCheckTime(Date.now());
      return;
    }

    const previousActivities = previousActivitiesRef.current;
    const previousActivityIds = new Set(previousActivities.map((a) => a.id));

    // 找出新活动
    const newActivities = activities.filter(
      (activity) => !previousActivityIds.has(activity.id)
    );

    if (newActivities.length > 0) {
      console.log(
        `[ActivitiesProvider] 检测到 ${newActivities.length} 个新活动`
      );

      // 标记为新活动
      const newActivityIds = newActivities.map((a) => a.id);
      markAsNew(newActivityIds);

      // 显示通知
      if (enableNotifications) {
        // 为每个新活动显示通知（最多显示前5个，避免过多通知）
        newActivities.slice(0, 5).forEach((activity: Activity) => {
          showActivityNotification(activity);
        });

        // 如果有超过5个新活动，显示汇总通知
        if (newActivities.length > 5) {
          toast.info(`还有 ${newActivities.length - 5} 个新活动`, {
            description: "查看活动页面了解更多",
            duration: 3000,
          });
        }
      }

      // 添加到待通知队列
      addPendingNotifications(newActivities);

      // 检查是否有IDO相关的活动变化，如果有则让团队数据失效
      const hasIdoChanges = newActivities.some(
        (activity) =>
          activity.action === "获得学习积分" ||
          activity.action === "领取奖励" ||
          activity.action === "转换团队WEDO" ||
          activity.idoAmount > 0 ||
          activity.wedoAmount !== 0
      );

      if (hasIdoChanges) {
        console.log("[ActivitiesProvider] 检测到IDO相关变化，让团队数据失效");
        queryClient.invalidateQueries({
          queryKey: ["teams"],
        });
      }
    }

    // 更新引用
    previousActivitiesRef.current = activities;
    lastCheckTimeRef.current = Date.now();
    updateLastCheckTime(Date.now());
  }, [
    activities,
    markAsNew,
    updateLastCheckTime,
    addPendingNotifications,
    enableNotifications,
    showActivityNotification,
    queryClient,
  ]);

  // 监听活动数据变化，检测新活动
  useEffect(() => {
    if (activities.length > 0) {
      detectAndNotifyNewActivities();
    }
  }, [activities, detectAndNotifyNewActivities]);

  // 当页面获得焦点时，重新获取活动
  useEffect(() => {
    const handleFocus = () => {
      if (!isLoading) {
        refetch();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isLoading) {
        refetch();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetch, isLoading]);

  // 可选：在控制台显示错误日志和错误通知
  useEffect(() => {
    if (error) {
      console.error("[ActivitiesProvider] Query error:", error);

      // 显示错误通知（但不要太频繁）
      if (enableNotifications && !isInitialFetchRef.current) {
        toast.error("获取最新活动失败", {
          description: "请检查网络连接",
          duration: 3000,
        });
      }
    }
  }, [error, enableNotifications]);

  return <>{children}</>;
}
