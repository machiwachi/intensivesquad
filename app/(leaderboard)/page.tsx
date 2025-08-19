"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCORE_TOKEN, type Clan } from "@/lib/data";
import { formatTokenAmount } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Plus, Skull, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ClanCard } from "./clan-card";
import { ClanDetailDialog } from "./clan-detail.dialog";
import { ClanRankingsChart } from "./clan-rankings-chart";
import { CreateClanDialog } from "./create-clan.dialog";
import { UserRankingsChart } from "./user-rankings-chart";

export default function ClansLeaderboard() {
  const { data: clans } = useQuery<Clan[]>({
    queryKey: ["clans"],
    queryFn: () => fetch("/api/clans").then((res) => res.json()),
  });

  const [selectedClan, setSelectedClan] = useState<Clan | null>(null);

  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [showCreateClan, setShowCreateClan] = useState(false);
  const [showRankings, setShowRankings] = useState(false);

  const totalClans = clans?.length ?? 0;
  const avgScore =
    clans && totalClans > 0
      ? Math.round(
          clans.reduce((sum, clan) => sum + clan.totalScore, 0) / totalClans
        )
      : 0;

  if (!clans) return null;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold pixel-font text-primary mb-2">
              残酷学分！
            </h1>
            <p className="text-muted-foreground pixel-font">为了部落！⛺️</p>
            <Link
              href="/auth-test"
              className="text-sm text-blue-500 hover:text-blue-700 underline"
            >
              🔐 测试 SIWE 身份验证
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={selectedTimeframe}
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger className="w-48 pixel-border pixel-font">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="all">全部时间</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setShowRankings(true)}
              variant="outline"
              className="pixel-border pixel-font flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              排行榜
            </Button>

            {isWalletConnected && (
              <Button
                onClick={() => setShowCreateClan(true)}
                variant="outline"
                className="pixel-border pixel-font flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                创建部落
              </Button>
            )}

            <div className="pixel-border rounded-lg overflow-hidden">
              <Button
                onClick={() => {
                  fetch("/api/hello");
                }}
              >
                Try
              </Button>
              <ConnectButton
                chainStatus="icon"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      avgScore * Math.pow(10, SCORE_TOKEN.decimals),
                      SCORE_TOKEN
                    ).split(" ")[0]
                  }
                </p>
                <p className="text-sm text-muted-foreground pixel-font">
                  平均 {SCORE_TOKEN.symbol}
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
      </header>

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

      <Dialog open={showRankings} onOpenChange={setShowRankings}>
        <DialogContent className="max-w-4xl pixel-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pixel-font text-2xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              排行榜
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserRankingsChart />
            <ClanRankingsChart />
          </div>
        </DialogContent>
      </Dialog>

      <CreateClanDialog
        open={showCreateClan}
        onOpenChange={setShowCreateClan}
      />

      {/* Clan Detail Dialog */}
      <ClanDetailDialog
        open={!!selectedClan}
        onOpenChange={() => setSelectedClan(null)}
        clan={selectedClan}
      />
    </div>
  );
}
