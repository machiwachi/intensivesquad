import { mockClans, SCORE_TOKEN } from "@/lib/data";
import { BarChart3 } from "lucide-react";
import { formatTokenAmount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RankIcon } from "./rank";

export const ClanRankingsChart = () => {
  const sortedClans = [...mockClans].sort(
    (a, b) => b.totalScore - a.totalScore
  );
  const maxScore = Math.max(...sortedClans.map((c) => c.totalScore));

  return (
    <div className="space-y-3">
      <h3 className="pixel-font font-bold text-lg flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        部落总分排行榜（{SCORE_TOKEN.symbol}）
      </h3>
      <div className="space-y-2">
        {sortedClans.map((clan, index) => {
          const barWidth = (clan.totalScore / maxScore) * 100;

          return (
            <div
              key={clan.id}
              className="flex items-center gap-3 p-3 bg-muted/20 rounded pixel-border"
            >
              <div className="flex items-center gap-2 w-16">
                <RankIcon rank={index + 1} />
                <span className="pixel-font text-sm font-bold">
                  #{index + 1}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{clan.flag}</span>
                    <span className="pixel-font text-sm font-medium">
                      {clan.name}
                    </span>
                    <Badge variant="outline" className="pixel-font text-xs">
                      {clan.remainingMembers}/{clan.totalMembers} active
                    </Badge>
                  </div>
                  <span className="pixel-font text-sm font-bold text-primary">
                    {formatTokenAmount(
                      clan.totalScore * Math.pow(10, SCORE_TOKEN.decimals),
                      SCORE_TOKEN
                    )}
                  </span>
                </div>

                <div className="w-full bg-muted/30 h-4 rounded pixel-border overflow-hidden">
                  <div
                    className="h-full bg-accent/80 transition-all duration-500 pixel-border"
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
