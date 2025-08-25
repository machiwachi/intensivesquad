# 活动监控系统 (Activities Monitoring System)

这个系统提供了一个完整的活动监控解决方案，使用 **TanStack Query** 进行服务端状态管理，**Zustand** 进行客户端状态管理，并在有新活动时通过 Sonner 显示 toast 通知。

## 🏗️ 架构设计

### 数据管理分离

- **TanStack Query**: 管理活动数据的获取、缓存、同步
- **Zustand**: 管理新活动标记、通知状态等客户端状态

这种设计充分利用了两个库的优势：

- TanStack Query 处理复杂的服务端状态同步
- Zustand 处理简单的客户端状态管理

## 功能特性

- ✅ 实时获取所有团队的活动数据（TanStack Query）
- ✅ 自动检测新活动并显示 toast 通知（Zustand + Provider）
- ✅ 智能缓存和数据同步（TanStack Query）
- ✅ 定期轮询更新（默认 30 秒）
- ✅ 页面焦点/可见性变化时自动刷新
- ✅ 提供便捷的 hooks 和组件

## 组件架构

### 1. 核心组件

- `useAllActivities` - TanStack Query hook，管理活动数据获取
- `useNewActivitiesStore` - Zustand store，管理新活动标记
- `ActivitiesProvider` - 提供者组件，负责数据监听和通知
- `useActivities` - 复合 hook，整合 Query 和 Store

### 2. 辅助组件

- `useActivitiesQuery.ts` - TanStack Query 相关的 hooks
- `useRecentActivities` - 获取最近活动的 hook
- `useTeamActivities` - 按团队过滤活动的 hook
- `useUserActivities` - 按用户过滤活动的 hook
- `useActivitiesStats` - 获取活动统计的 hook
- `ActivitiesMonitor` - 示例监控组件

## 使用方法

### 基础使用

系统已经集成到应用的根级别，无需额外配置。只需在组件中使用相关 hooks：

```tsx
import { useActivities } from "@/lib/hooks/useActivities";

function MyComponent() {
  const {
    activities, // 带有 isNew 标记的活动列表
    rawActivities, // 原始活动数据
    isLoading,
    error,
    hasNewActivities, // 是否有新活动
  } = useActivities();

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      {hasNewActivities && <div>🔴 有新活动</div>}
      {activities.map((activity) => (
        <div key={activity.id} className={activity.isNew ? "new" : ""}>
          {activity.user} {activity.action}
        </div>
      ))}
    </div>
  );
}
```

### 直接使用 TanStack Query

```tsx
import { useAllActivities } from "@/lib/hooks/useActivitiesQuery";

function DirectQueryComponent() {
  const {
    data: activities = [],
    isLoading,
    error,
    refetch,
  } = useAllActivities({
    refetchInterval: 10000, // 自定义轮询间隔
  });

  return (
    <div>
      <button onClick={() => refetch()}>刷新</button>
      {activities.map((activity) => (
        <div key={activity.id}>{activity.action}</div>
      ))}
    </div>
  );
}
```

### 管理新活动状态

```tsx
import { useNewActivitiesStore } from "@/lib/stores/activities";

function NewActivitiesManager() {
  const { markAsViewed, newActivityIds, clearPendingNotifications } =
    useNewActivitiesStore();

  const handleMarkAllAsViewed = () => {
    const allIds = Array.from(newActivityIds);
    markAsViewed(allIds);
  };

  return (
    <div>
      <p>新活动数量: {newActivityIds.size}</p>
      <button onClick={handleMarkAllAsViewed}>标记所有为已查看</button>
    </div>
  );
}
```

### 获取特定团队的活动

```tsx
import { useTeamActivities } from "@/lib/hooks/useActivities";

function TeamActivities({ teamId }: { teamId: number }) {
  const teamActivities = useTeamActivities(teamId);

  return (
    <div>
      <h3>团队 {teamId} 的活动</h3>
      {teamActivities.map((activity) => (
        <div key={activity.id}>{activity.action}</div>
      ))}
    </div>
  );
}
```

### 获取活动统计

```tsx
import { useActivitiesStats } from "@/lib/hooks/useActivities";

function ActivityStats() {
  const stats = useActivitiesStats();

  return (
    <div>
      <p>总活动数: {stats.total}</p>
      <p>最近1小时: {stats.lastHour}</p>
      <p>活跃用户: {stats.uniqueUsers}</p>
      <p>参与团队: {stats.uniqueTeams}</p>
    </div>
  );
}
```

### 使用监控组件

```tsx
import { ActivitiesMonitor } from "@/components/activities-monitor";

function Dashboard() {
  return (
    <div>
      <h2>活动监控</h2>
      <ActivitiesMonitor limit={10} showStats={true} className="mb-4" />
    </div>
  );
}
```

## 配置选项

### ActivitiesProvider 配置

可以在 `components/providers.tsx` 中调整 `ActivitiesProvider` 的配置：

```tsx
<ActivitiesProvider
  pollInterval={30000} // 轮询间隔（毫秒）
  enableNotifications={true} // 是否启用通知
>
  {children}
</ActivitiesProvider>
```

### TanStack Query 配置

可以在 `useAllActivities` 中传入选项：

```tsx
const { data } = useAllActivities({
  refetchInterval: 15000, // 自定义轮询间隔
  enabled: isUserActive, // 条件性启用
});
```

### Toast 通知类型

系统会根据活动类型显示不同样式的 toast：

- `获得学习积分` - 成功通知（绿色）
- `领取奖励` - 信息通知（蓝色）
- `转换团队WEDO` - 警告通知（黄色）
- 其他活动 - 默认通知

## API 接口

系统使用现有的 `/api/teams/*/activities` 接口获取所有团队的活动数据。

## 性能优化

### TanStack Query 优化

- 自动缓存和背景更新
- 智能重复请求合并
- 过期数据管理
- 预取和无限查询支持

### Zustand 优化

- 选择器优化重渲染
- 最小状态存储
- 高效的 Set 操作

### 组件优化

- 使用 useMemo 缓存计算结果
- 只在检测到新活动时显示通知
- 页面不可见时减少不必要的更新

## 注意事项

1. **架构分离**: TanStack Query 管理服务端状态，Zustand 管理客户端状态
2. **自动同步**: 活动数据会在页面焦点变化时自动刷新
3. **错误处理**: 包含完整的错误处理，不会因 API 失败而崩溃
4. **通知限制**: 新活动通知最多显示前 5 个，避免屏幕被通知淹没
5. **内存管理**: TanStack Query 自动处理缓存清理
6. **类型安全**: 完整的 TypeScript 类型定义

## 迁移指南

如果您从旧版本迁移，主要变化：

1. `useActivitiesStore` → `useNewActivitiesStore` (只管理新活动标记)
2. `fetchActivities()` → `useAllActivities()` (使用 TanStack Query)
3. 活动数据现在通过 TanStack Query 自动管理
4. 新增 `rawActivities` 和 `activities` (带 isNew 标记) 的区分
