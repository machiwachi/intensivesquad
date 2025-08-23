"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import {
  USER_PROPERTIES,
  POSTHOG_EVENTS,
  AUTH_METHODS,
} from "@/lib/posthog-constants";

// 确保 PostHog 只在客户端初始化一次
if (typeof window !== "undefined" && !posthog.__loaded) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 当用户登录时，识别用户身份
    if (status === "authenticated" && session?.user?.address) {
      posthog.identify(session.user.address, {
        [USER_PROPERTIES.WALLET_ADDRESS]: session.user.address,
        [USER_PROPERTIES.AUTH_METHOD]: AUTH_METHODS.SIWE,
        [USER_PROPERTIES.LOGIN_TIMESTAMP]: new Date().toISOString(),
        [USER_PROPERTIES.LAST_ACTIVE]: new Date().toISOString(),
      });

      // 触发登录事件
      posthog.capture(POSTHOG_EVENTS.USER_SIGNED_IN, {
        [USER_PROPERTIES.WALLET_ADDRESS]: session.user.address,
        [USER_PROPERTIES.AUTH_METHOD]: AUTH_METHODS.SIWE,
      });
    }

    // 当用户登出时，重置身份
    if (status === "unauthenticated") {
      // 在重置之前触发登出事件
      posthog.capture(POSTHOG_EVENTS.USER_SIGNED_OUT);
      posthog.reset();
    }
  }, [session, status]);

  return <>{children}</>;
}

// 导出 PostHog 实例供其他组件使用
export { posthog };
