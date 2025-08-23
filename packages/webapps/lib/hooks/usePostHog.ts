"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  trackEvent,
  updateUserProperties,
  setUserGroup,
  trackPageView,
  getFeatureFlag,
  isFeatureEnabled,
} from "@/lib/posthog-utils";
import type { PostHogEvent, UserProperty } from "@/lib/posthog-constants";

export function usePostHog() {
  const { data: session } = useSession();

  const track = useCallback(
    (event: PostHogEvent, properties?: Record<string, any>) => {
      trackEvent(event, {
        user_address: session?.user?.address,
        ...properties,
      });
    },
    [session?.user?.address]
  );

  const identify = useCallback(
    (properties: Partial<Record<UserProperty, any>>) => {
      updateUserProperties(properties);
    },
    []
  );

  const setGroup = useCallback((teamId: string, teamName?: string) => {
    setUserGroup(teamId, teamName);
  }, []);

  const pageView = useCallback(
    (pageName: string, properties?: Record<string, any>) => {
      trackPageView(pageName, {
        user_address: session?.user?.address,
        ...properties,
      });
    },
    [session?.user?.address]
  );

  const flag = useCallback((flagKey: string) => {
    return getFeatureFlag(flagKey);
  }, []);

  const isEnabled = useCallback((flagKey: string) => {
    return isFeatureEnabled(flagKey);
  }, []);

  return {
    // 事件追踪
    track,

    // 用户识别
    identify,

    // 组管理
    setGroup,

    // 页面浏览
    pageView,

    // 功能标志
    flag,
    isEnabled,

    // 用户信息
    user: session?.user,
    isAuthenticated: !!session?.user,
  };
}
