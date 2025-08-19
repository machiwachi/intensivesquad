"use client";

import { BarChart3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { SCORE_TOKEN } from "@/lib/data";
import { formatTokenAmount } from "@/lib/utils";
import type { Clan, User } from "@/lib/data";

export const UserRankingsChart = () => {
  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
  });

  const { data: clans } = useQuery<Clan[]>({
    queryKey: ["clans"],
    queryFn: () => fetch("/api/clans").then((res) => res.json()),
  });

  if (!users) return null;
  if (!clans) return null;

  const sortedUsers = [...users].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...sortedUsers.map((u) => u.score));

  return (
    <div className="space-y-3">
      <h3 className="pixel-font font-bold text-lg flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        用户排行榜（{SCORE_TOKEN.symbol}）
      </h3>
      <div className="space-y-2">
        {sortedUsers.slice(0, 10).map((user, index) => {
          const clan = clans.find((c) => c.id === user.clanId);
          const barWidth = (user.score / maxScore) * 100;

          return (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 bg-muted/20 rounded pixel-border"
            >
              <div className="flex items-center gap-2 w-20">
                <span className="pixel-font text-sm font-bold">
                  #{index + 1}
                </span>
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="pixel-font text-xs">
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="pixel-font text-sm font-medium">
                      {user.name}
                    </span>
                    <span className="pixel-font text-xs text-muted-foreground">
                      {clan?.flag} {clan?.name}
                    </span>
                  </div>
                  <span className="pixel-font text-sm font-bold text-primary">
                    {formatTokenAmount(
                      user.score * Math.pow(10, SCORE_TOKEN.decimals),
                      SCORE_TOKEN
                    )}
                  </span>
                </div>

                <div className="w-full bg-muted/30 h-3 rounded pixel-border overflow-hidden">
                  <div
                    className="h-full bg-primary/80 transition-all duration-500 pixel-border"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
