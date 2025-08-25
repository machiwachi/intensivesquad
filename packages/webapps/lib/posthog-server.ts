import { PostHog } from "posthog-node";

// 服务器端 PostHog 客户端实例
let posthogServerClient: PostHog | null = null;

export function getPostHogServerClient(): PostHog {
  if (!posthogServerClient) {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      throw new Error("NEXT_PUBLIC_POSTHOG_KEY is not set");
    }

    posthogServerClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: "https://us.i.posthog.com",
      flushAt: 1, // 立即发送事件，适用于服务器端
      flushInterval: 0, // 禁用定时刷新
    });
  }

  return posthogServerClient;
}

// 服务器端用户身份识别
export function identifyUserServer(
  userId: string,
  properties: Record<string, any>
) {
  const client = getPostHogServerClient();
  client.identify({
    distinctId: userId,
    properties,
  });
}

// 服务器端事件追踪
export function captureEventServer(
  userId: string,
  event: string,
  properties?: Record<string, any>
) {
  const client = getPostHogServerClient();
  client.capture({
    distinctId: userId,
    event,
    properties,
  });
}

// 优雅关闭
export async function shutdownPostHogServer() {
  if (posthogServerClient) {
    await posthogServerClient.shutdown();
    posthogServerClient = null;
  }
}
