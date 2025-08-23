"use client";

import { useActivities } from "@/lib/hooks/useActivities";
import { Badge } from "@/components/ui/badge";

/**
 * 示例组件：展示更新后的活动提供者功能
 *
 * 新功能：
 * 1. 团队名称显示：通知中显示团队名称而不是ID
 * 2. 自动更新团队数据：当有IDO相关活动时，自动让团队数据失效
 */
export function ActivitiesProviderExample() {
  const { activities, hasNewActivities, newActivityIds, markAsViewed } =
    useActivities();

  const recentActivities = activities.slice(0, 5);

  const handleMarkAsViewed = () => {
    const allIds = Array.from(newActivityIds);
    markAsViewed(allIds);
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">最新活动</h3>
        <div className="flex items-center gap-2">
          {hasNewActivities && (
            <Badge variant="destructive">{newActivityIds.size} 个新活动</Badge>
          )}
          <button
            onClick={handleMarkAsViewed}
            className="text-sm text-blue-600 hover:underline"
            disabled={!hasNewActivities}
          >
            标记已读
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className={`p-3 border rounded ${
              activity.isNew ? "bg-blue-50 border-blue-200" : "bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.action}</span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                  <span>用户: {activity.user.slice(0, 8)}...</span>
                  <span>团队ID: {activity.teamId}</span>
                  {activity.idoAmount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      +{activity.idoAmount} IDO
                    </Badge>
                  )}
                  {activity.wedoAmount !== 0 && (
                    <Badge
                      variant={
                        activity.wedoAmount > 0 ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {activity.wedoAmount > 0 ? "+" : ""}
                      {activity.wedoAmount} WEDO
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
        <h4 className="font-medium mb-2">新功能演示：</h4>
        <ul className="space-y-1 text-gray-600">
          <li>
            • 🏷️ <strong>团队名称显示</strong>：通知现在显示团队名称而不是ID
          </li>
          <li>
            • 🔄 <strong>自动数据更新</strong>
            ：IDO相关活动会自动触发团队数据刷新
          </li>
          <li>
            • ⚡ <strong>智能失效</strong>：只在必要时更新团队数据，提高性能
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * 使用说明：
 *
 * 1. 在 ActivitiesProvider 中：
 *    - 通过 useTeams() 获取团队数据
 *    - getTeamName() 函数根据teamId返回团队名称
 *    - 通知消息格式："{团队名称} 的 {用户地址} {操作}"
 *
 * 2. IDO变化检测：
 *    - 监听"获得学习积分"、"领取奖励"、"转换团队WEDO"等活动
 *    - 检查 idoAmount > 0 或 wedoAmount !== 0
 *    - 自动调用 queryClient.invalidateQueries({ queryKey: ["teams"] })
 *
 * 3. 性能优化：
 *    - 只在检测到IDO相关变化时才让团队数据失效
 *    - 避免不必要的网络请求
 *    - 保持团队数据与活动数据的同步
 */
