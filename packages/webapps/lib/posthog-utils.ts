"use client";

import posthog from "posthog-js";
import { POSTHOG_EVENTS, USER_PROPERTIES } from "@/lib/posthog-constants";
import type { PostHogEvent, UserProperty } from "@/lib/posthog-constants";

// 便捷的事件追踪函数
export function trackEvent(
  event: PostHogEvent,
  properties?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  posthog.capture(event, properties);
}

// 更新用户属性
export function updateUserProperties(
  properties: Partial<Record<UserProperty, any>>
) {
  if (typeof window === "undefined") return;

  posthog.setPersonProperties(properties);
}

// 设置用户组（团队）
export function setUserGroup(teamId: string, teamName?: string) {
  if (typeof window === "undefined") return;

  posthog.group("team", teamId, {
    name: teamName,
  });

  // 同时更新用户属性
  const properties: Partial<Record<UserProperty, any>> = {
    [USER_PROPERTIES.TEAM_ID]: teamId,
  };

  if (teamName) {
    properties[USER_PROPERTIES.TEAM_NAME] = teamName;
  }

  updateUserProperties(properties);
}

// 追踪页面浏览
export function trackPageView(
  pageName: string,
  properties?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  posthog.capture("$pageview", {
    page_name: pageName,
    ...properties,
  });
}

// 功能标志相关
export function getFeatureFlag(flagKey: string): boolean | string | undefined {
  if (typeof window === "undefined") return undefined;

  return posthog.getFeatureFlag(flagKey);
}

export function isFeatureEnabled(flagKey: string): boolean {
  if (typeof window === "undefined") return false;

  return Boolean(posthog.isFeatureEnabled(flagKey));
}

// PostHog 实例
export { posthog };
