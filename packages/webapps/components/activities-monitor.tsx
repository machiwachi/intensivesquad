"use client";

import { useActivities, useActivitiesStats } from "@/lib/hooks/useActivities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAddress, getBlockchainExplorerUrl } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

interface ActivitiesMonitorProps {
  /** 显示的活动数量限制 */
  limit?: number;
  /** 是否显示统计信息 */
  showStats?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 活动监控组件 - 显示最新的活动和统计信息
 * 可以用作示例或实际的活动展示组件
 */
export function ActivitiesMonitor({
  limit = 5,
  showStats = true,
  className,
}: ActivitiesMonitorProps) {
  const { rawActivities: activities, isLoading, error } = useActivities();
  const stats = useActivitiesStats();

  const displayActivities = activities.slice(0, limit);

  if (error) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-red-500">
          <h3 className="font-semibold mb-2">活动加载失败</h3>
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* 标题和统计 */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">最新活动</h3>
          {showStats && (
            <div className="flex gap-2">
              <Badge variant="secondary">总计: {stats.total}</Badge>
              <Badge variant="outline">最近1小时: {stats.lastHour}</Badge>
            </div>
          )}
        </div>

        {/* 活动列表 */}
        <div className="space-y-3">
          {isLoading ? (
            // 加载状态
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))
          ) : displayActivities.length === 0 ? (
            // 空状态
            <div className="text-center py-8 text-gray-500">
              <p>暂无活动记录</p>
            </div>
          ) : (
            // 活动列表
            displayActivities.map((activity) => (
              <div
                key={activity.id}
                className="border-l-2 border-blue-200 pl-4 py-2 bg-gray-50 rounded-r-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {formatAddress(activity.user)} {activity.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <span>团队 {activity.teamId}</span>
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
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                    {activity.txHash && (
                      <Link
                        href={getBlockchainExplorerUrl(
                          activity.txHash as `0x${string}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        <ExternalLinkIcon className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 更多活动链接 */}
        {activities.length > limit && (
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
              还有 {activities.length - limit} 个活动...
            </p>
          </div>
        )}

        {/* 详细统计（可选） */}
        {showStats && stats.total > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div>
                <span className="font-medium">活跃用户:</span>{" "}
                {stats.uniqueUsers}
              </div>
              <div>
                <span className="font-medium">参与团队:</span>{" "}
                {stats.uniqueTeams}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
