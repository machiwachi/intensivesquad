# 钱包连接使用指南

## 概述

本项目已集成完整的以太坊钱包连接功能，使用 RainbowKit + SIWE (Sign-In with Ethereum) 认证流程。

## 功能特性

### ✅ 已实现的功能

1. **钱包连接**: 支持多种以太坊钱包连接
2. **SIWE 认证**: 使用以太坊签名进行身份验证
3. **会话管理**: 自动管理用户登录状态
4. **断开连接**: 完整的登出流程
5. **状态管理**: 智能的连接状态检测
6. **PostHog 集成**: 自动追踪连接事件

### 🔧 技术栈

- **RainbowKit**: 钱包连接 UI 和逻辑
- **Wagmi**: 以太坊交互库
- **NextAuth.js**: 会话管理
- **SIWE**: 以太坊签名认证
- **PostHog**: 用户行为分析

## 使用方法

### 1. 连接钱包

用户点击"连接钱包"按钮：

- 显示支持的钱包列表
- 选择钱包并连接
- 自动弹出签名请求
- 签名成功后完成认证

### 2. 查看连接状态

组件会根据用户状态显示不同内容：

- **未连接**: "连接钱包"按钮（带钱包图标）
- **已连接但未认证**: "完成登录"按钮（带钱包图标）
- **已认证**: 显示钱包地址和 ETH 余额的按钮
- **加载中**: "加载中..."状态（带旋转图标）

### 3. 钱包信息显示

当用户已认证时，按钮会显示：

- 左侧：钱包图标 + 格式化的钱包地址
- 右侧：ETH 余额（实时更新，每 10 秒刷新）

### 4. 断开连接弹窗

点击已连接的钱包按钮会打开弹窗，显示：

- **钱包地址**: 完整地址，支持复制和在区块链浏览器中查看
- **ETH 余额**: 当前账户的 ETH 余额
- **操作按钮**: 取消或断开连接

断开连接功能：

- 断开钱包连接
- 清除 NextAuth 会话
- 记录断开连接事件
- 返回初始状态

## 在代码中使用

### 使用 ConnectButton 组件

```tsx
import { ConnectButton } from "@/components/connect.button";

function MyComponent() {
  return <ConnectButton />;
}
```

### 检查认证状态

```tsx
import { useUserAuth } from "@/lib/hooks/useUserAuth";

function MyComponent() {
  const { isAuthenticated, isWalletConnected, address, isLoading } =
    useUserAuth();

  if (isLoading) return <div>加载中...</div>;
  if (!isAuthenticated) return <div>请先登录</div>;

  return <div>欢迎！地址: {address}</div>;
}
```

### 使用 NextAuth 会话

```tsx
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>加载中...</div>;
  if (!session) return <div>请先登录</div>;

  return <div>用户地址: {session.address}</div>;
}
```

## 环境变量配置

需要设置以下环境变量：

```bash
# NextAuth配置
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# WalletConnect项目ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id

# PostHog配置（可选）
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## 支持的钱包

通过 RainbowKit 支持的钱包包括：

- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow Wallet
- 其他兼容钱包

## 网络支持

当前配置支持：

- Sepolia 测试网
- Hardhat 本地网络

可以在 `lib/wagmi.ts` 中添加更多网络。

## 故障排除

### 常见问题

1. **连接失败**: 检查 WalletConnect 项目 ID 是否正确
2. **签名失败**: 确保 NEXTAUTH_URL 配置正确
3. **会话丢失**: 检查 NEXTAUTH_SECRET 是否设置

### 调试信息

- 控制台会输出 SIWE 认证的详细信息
- PostHog 会记录所有钱包连接事件
- 使用浏览器开发者工具查看网络请求

## 安全考虑

1. **域名验证**: SIWE 消息会验证域名匹配
2. **随机数验证**: 防止重放攻击
3. **签名验证**: 确保钱包所有权
4. **会话管理**: 安全的 JWT token 管理

## 更新日志

### v2.0 (当前版本)

- ✅ 添加了 ETH 余额实时显示功能
- ✅ 实现了断开连接弹窗界面
- ✅ 优化了按钮布局和视觉设计
- ✅ 添加了复制地址和查看区块链浏览器功能
- ✅ 改进了加载状态和错误处理

### v1.0

- ✅ 修复了连接按钮的逻辑错误
- ✅ 添加了完整的断开连接流程
- ✅ 改进了状态管理和 UI 反馈
- ✅ 优化了 SIWE 域名处理
- ✅ 集成了 PostHog 事件追踪
