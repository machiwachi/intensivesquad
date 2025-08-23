# PostHog 身份识别集成指南

本项目已完成 PostHog 与 NextAuth 的身份识别集成，支持用户在登录时自动识别身份，并在整个应用中追踪用户行为。

## 🚀 集成功能

### 1. 自动用户身份识别

- 用户通过 SIWE (Sign-In with Ethereum) 登录时自动识别身份
- 客户端和服务器端双重身份识别
- 自动追踪登录/登出事件

### 2. 用户属性追踪

- 钱包地址
- 认证方法
- 登录时间戳
- 最后活跃时间
- 团队信息
- 用户角色和积分

### 3. 事件追踪

- 认证相关事件（登录、登出、钱包连接）
- 用户交互事件（点击、浏览、购买等）
- 团队相关事件（加入、离开团队等）

## 📁 文件结构

```
lib/
├── posthog-constants.ts    # PostHog 常量定义
├── posthog-server.ts       # 服务器端 PostHog 客户端
├── posthog-utils.ts        # 客户端工具函数
└── hooks/
    └── usePostHog.ts       # React Hook

components/
└── posthog-provider.tsx    # PostHog Provider 组件
```

## 🔧 使用方法

### 在组件中使用 PostHog Hook

```typescript
import { usePostHog } from "@/lib/hooks/usePostHog";
import { POSTHOG_EVENTS } from "@/lib/posthog-constants";

function MyComponent() {
  const { track, identify, setGroup } = usePostHog();

  const handleButtonClick = () => {
    track(POSTHOG_EVENTS.CTA_CLICKED, {
      button_text: "Join Team",
      page: "homepage",
    });
  };

  return <button onClick={handleButtonClick}>Join Team</button>;
}
```

### 追踪事件

```typescript
// 使用 Hook（推荐）
const { track } = usePostHog();
track(POSTHOG_EVENTS.STORE_ITEM_PURCHASED, {
  item_id: "sword_001",
  price: 100,
  currency: "WEDO",
});

// 直接使用工具函数
import { trackEvent } from "@/lib/posthog-utils";
trackEvent(POSTHOG_EVENTS.CLAN_JOINED, {
  clan_id: "warriors",
  clan_name: "Study Warriors",
});
```

### 更新用户属性

```typescript
import { USER_PROPERTIES } from "@/lib/posthog-constants";

const { identify } = usePostHog();
identify({
  [USER_PROPERTIES.TOTAL_SCORE]: 1500,
  [USER_PROPERTIES.RANK]: 42,
  [USER_PROPERTIES.USER_ROLE]: "leader",
});
```

### 设置用户组（团队）

```typescript
const { setGroup } = usePostHog();
setGroup("team_123", "Intensive Squad");
```

### 功能标志

```typescript
const { flag, isEnabled } = usePostHog();

// 获取功能标志值
const featureVariant = flag("new_ui_design");

// 检查功能是否启用
if (isEnabled("beta_features")) {
  // 显示 beta 功能
}
```

## 🏗️ 架构说明

### Provider 层级结构

```
<WagmiProvider>
  <SessionProvider>
    <QueryClientProvider>
      <PostHogProvider>  ← PostHog 集成层
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </PostHogProvider>
    </QueryClientProvider>
  </SessionProvider>
</WagmiProvider>
```

### 身份识别流程

1. 用户通过 SIWE 登录
2. NextAuth 验证签名并创建会话
3. 在 NextAuth 的 `jwt` 回调中触发服务器端身份识别
4. PostHogProvider 监听会话变化并触发客户端身份识别
5. 用户在应用中的所有行为都会与其身份关联

## 📊 常量和类型

### 用户属性 (USER_PROPERTIES)

- `WALLET_ADDRESS`: 钱包地址
- `AUTH_METHOD`: 认证方法
- `LOGIN_TIMESTAMP`: 登录时间
- `LAST_ACTIVE`: 最后活跃时间
- `TEAM_ID`: 团队 ID
- `TEAM_NAME`: 团队名称
- `USER_ROLE`: 用户角色
- `TOTAL_SCORE`: 总积分
- `RANK`: 排名

### 事件类型 (POSTHOG_EVENTS)

- 认证事件：`USER_SIGNED_IN`, `USER_SIGNED_OUT`, `WALLET_CONNECTED`
- 交互事件：`CTA_CLICKED`, `LEADERBOARD_OPENED`, `STORE_ITEM_PURCHASED`
- 团队事件：`CLAN_JOINED`, `CLAN_LEFT`, `CLAN_CREATION_SUBMITTED`

### 认证方法 (AUTH_METHODS)

- `SIWE`: Sign-In with Ethereum
- `EMAIL`: 邮箱登录
- `SOCIAL`: 社交媒体登录

### 用户角色 (USER_ROLES)

- `MEMBER`: 普通成员
- `LEADER`: 团队领袖
- `ADMIN`: 管理员

## 🔒 隐私和安全

- 只追踪必要的用户信息
- 钱包地址作为唯一标识符
- 敏感信息不会发送到 PostHog
- 支持用户数据删除和重置

## 🚨 注意事项

1. **环境变量**: 确保设置了 `NEXT_PUBLIC_POSTHOG_KEY`
2. **功能标志**: 在使用功能标志时应检查返回值的有效性
3. **服务器端**: 服务器端 PostHog 客户端会自动处理错误，不会影响应用功能
4. **开发模式**: 在开发环境中启用了调试模式

## 📈 监控和分析

集成完成后，你可以在 PostHog 仪表板中查看：

- 用户注册和活跃度趋势
- 功能使用情况分析
- 团队参与度统计
- 转化漏斗分析
- 用户留存分析

## 🔧 自定义配置

如需自定义 PostHog 配置，可修改 `components/posthog-provider.tsx` 中的初始化参数：

```typescript
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2025-05-24",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
  // 添加其他配置选项
});
```
