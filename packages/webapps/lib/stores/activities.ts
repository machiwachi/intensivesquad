"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Activity } from "@/lib/typings";

interface NewActivitiesState {
  /** 新活动ID列表，用于跟踪哪些是新的 */
  newActivityIds: Set<string>;
  /** 上次检查的时间戳 */
  lastCheckTime: number;
  /** 临时存储新活动用于显示通知 */
  pendingNotifications: Activity[];
}

interface NewActivitiesActions {
  /** 标记活动为新活动 */
  markAsNew: (activityIds: string[]) => void;
  /** 标记活动为已查看 */
  markAsViewed: (activityIds: string[]) => void;
  /** 更新上次检查时间 */
  updateLastCheckTime: (timestamp: number) => void;
  /** 添加待通知的活动 */
  addPendingNotifications: (activities: Activity[]) => void;
  /** 清除待通知的活动 */
  clearPendingNotifications: () => void;
  /** 重置所有状态 */
  reset: () => void;
}

interface NewActivitiesStore extends NewActivitiesState, NewActivitiesActions {}

export const useNewActivitiesStore = create<NewActivitiesStore>()(
  devtools(
    (set, get) => ({
      // State
      newActivityIds: new Set<string>(),
      lastCheckTime: 0,
      pendingNotifications: [],

      // Actions
      markAsNew: (activityIds: string[]) => {
        set((state) => ({
          newActivityIds: new Set([...state.newActivityIds, ...activityIds]),
        }));
      },

      markAsViewed: (activityIds: string[]) => {
        set((state) => {
          const newSet = new Set(state.newActivityIds);
          activityIds.forEach((id) => newSet.delete(id));
          return { newActivityIds: newSet };
        });
      },

      updateLastCheckTime: (timestamp: number) => {
        set({ lastCheckTime: timestamp });
      },

      addPendingNotifications: (activities: Activity[]) => {
        set((state) => ({
          pendingNotifications: [...state.pendingNotifications, ...activities],
        }));
      },

      clearPendingNotifications: () => {
        set({ pendingNotifications: [] });
      },

      reset: () => {
        set({
          newActivityIds: new Set<string>(),
          lastCheckTime: 0,
          pendingNotifications: [],
        });
      },
    }),
    {
      name: "new-activities-store", // devtools 中的存储名称
    }
  )
);

// 选择器函数，用于优化性能
export const selectNewActivityIds = (state: NewActivitiesStore) =>
  state.newActivityIds;
export const selectLastCheckTime = (state: NewActivitiesStore) =>
  state.lastCheckTime;
export const selectPendingNotifications = (state: NewActivitiesStore) =>
  state.pendingNotifications;
