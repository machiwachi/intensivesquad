"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SCORE_TOKEN, type Clan } from "@/lib/data";
import { formatTokenAmount } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Plus, Skull, Trophy, Users, Zap } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ClanCard } from "../clan-card";
import { ClanDetailDialog } from "../clan-detail.dialog";
import { ClanRankingsChart } from "../clan-rankings-chart";
import { CreateClanDialog } from "../create-clan.dialog";
import { UserRankingsChart } from "../user-rankings-chart";
import { RankButton } from "../rank.button";

export default function ClansLeaderboard() {
  const { data: clans } = useQuery<Clan[]>({
    queryKey: ["clans"],
    queryFn: () => fetch("/api/clans").then((res) => res.json()),
  });

  const [selectedClan, setSelectedClan] = useState<Clan | null>(null);

  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();

  if (!clans) return null;

  const totalClans = clans.length;
  const totalScore = clans.reduce((sum, clan) => sum + clan.totalScore, 0);

  return (
    <div className="">
      {/* Header */}

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="pixel-border">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold pixel-font">{totalClans}</p>
              <p className="text-sm text-muted-foreground pixel-font">
                部落总数
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="pixel-border">
          <CardContent className="p-4 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent" />
            <div>
              <p className="text-2xl font-bold pixel-font">
                {
                  formatTokenAmount(
                    totalScore * Math.pow(10, SCORE_TOKEN.decimals),
                    SCORE_TOKEN
                  ).split(" ")[0]
                }
              </p>
              <p className="text-sm text-muted-foreground pixel-font">
                总计流通量 {SCORE_TOKEN.symbol}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="pixel-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold pixel-font">
                    {clans.reduce(
                      (sum, clan) => sum + clan.remainingMembers,
                      0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground pixel-font">
                    现役战士
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Skull className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold pixel-font text-red-500">
                    {clans.reduce(
                      (sum, clan) =>
                        sum + (clan.totalMembers - clan.remainingMembers),
                      0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground pixel-font">
                    已淘汰
                  </p>
                </div>
              </div>
            </div>

            {/* Mini retention chart */}
            <div className="mt-4 pt-3 border-t border-muted">
              <p className="text-xs text-muted-foreground pixel-font mb-2">
                每日留存（近7天）
              </p>
              <div className="flex items-end gap-1 h-8">
                {[95, 89, 84, 78, 71, 65, 58].map((percentage, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-emerald-400 rounded-sm pixel-border"
                      style={{ height: `${(percentage / 100) * 100}%` }}
                    />
                    <span className="text-xs pixel-font text-muted-foreground mt-1">
                      {percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {clans.map((clan) => (
          <ClanCard
            key={clan.id}
            clan={clan}
            onClick={() => setSelectedClan(clan)}
          />
        ))}
      </div>

      {/* Clan Detail Dialog */}
      <ClanDetailDialog
        open={!!selectedClan}
        onOpenChange={() => setSelectedClan(null)}
        clan={selectedClan}
      />
    </div>
  );
}
