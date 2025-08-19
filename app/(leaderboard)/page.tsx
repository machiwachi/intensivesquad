"use client";

import type React from "react";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Trophy,
  Zap,
  Shield,
  Crown,
  Star,
  UserPlus,
  Coins,
  Gift,
  Plus,
  BarChart3,
  Skull,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SCORE_TOKEN, VAULT_TOKEN, type Clan, type User } from "@/lib/data";
import { UserRankingsChart } from "./user-rankings-chart";
import { formatTokenAmount } from "@/lib/utils";
import { MemberRing } from "./member-ring";
import { RankIcon } from "./rank";
import { RankChange } from "./rank";
import { ClanRankingsChart } from "./clan-rankings-chart";
import { DividendVaultWidget } from "./dividend-vault-widget";

export default function ClansLeaderboard() {
  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
  });

  const { data: clans } = useQuery<Clan[]>({
    queryKey: ["clans"],
    queryFn: () => fetch("/api/clans").then((res) => res.json()),
  });

  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [selectedClan, setSelectedClan] = useState<Clan | null>(null);
  const [userClanId, setUserClanId] = useState<number | null>(1); // Mock: user is in Code Crusaders
  const [joinedClans, setJoinedClans] = useState<Set<number>>(new Set([1])); // Mock: already joined clan 1
  const [claimedRewards, setClaimedRewards] = useState<Set<number>>(new Set()); // Track claimed rewards
  const [showCreateClan, setShowCreateClan] = useState(false);
  const [showRankings, setShowRankings] = useState(false);
  const [newClanForm, setNewClanForm] = useState({
    name: "",
    flag: "",
    description: "",
    initialLeverage: "1.0",
  });

  const totalClans = clans?.length ?? 0;
  const avgScore =
    clans && totalClans > 0
      ? Math.round(
          clans.reduce((sum, clan) => sum + clan.totalScore, 0) / totalClans
        )
      : 0;

  const handleJoinClan = (clanId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening clan details
    if (isWalletConnected && !joinedClans.has(clanId)) {
      setJoinedClans((prev) => new Set([...prev, clanId]));
      // If user doesn't have a primary clan, make this their primary
      if (!userClanId) {
        setUserClanId(clanId);
      }
    }
  };

  const handleCreateClan = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isWalletConnected) return;

    // In a real app, this would create the clan on the blockchain
    console.log("[v0] Creating new clan:", newClanForm);

    // Reset form and close dialog
    setNewClanForm({
      name: "",
      flag: "",
      description: "",
      initialLeverage: "1.0",
    });
    setShowCreateClan(false);

    // Show success feedback (in a real app, this would be after blockchain confirmation)
    alert(`Clan "${newClanForm.name}" created successfully!`);
  };

  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="flex items-end h-8 gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-primary/60 w-2 pixel-border"
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: "2px",
            }}
          />
        ))}
      </div>
    );
  };

  const isUserClan = (clanId: number) => {
    return userClanId === clanId;
  };

  const canJoinClan = (clanId: number) => {
    return isWalletConnected && !joinedClans.has(clanId);
  };

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
          <Card
            key={clan.id}
            className={`pixel-border hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group ${
              isUserClan(clan.id)
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={() => setSelectedClan(clan)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{clan.flag}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold pixel-font text-lg group-hover:text-primary transition-colors">
                        {clan.name}
                      </h3>
                      {isUserClan(clan.id) && (
                        <Badge
                          variant="default"
                          className="pixel-font text-xs bg-primary"
                        >
                          MY CLAN
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <RankIcon rank={clan.rank} />
                      <span className="pixel-font text-sm">
                        排名 #{clan.rank}
                      </span>
                      <RankChange
                        current={clan.rank}
                        previous={clan.previousRank}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="pixel-font text-xs">
                    {
                      formatTokenAmount(
                        clan.totalScore * Math.pow(10, SCORE_TOKEN.decimals),
                        SCORE_TOKEN
                      ).split(" ")[0]
                    }
                  </Badge>
                  {canJoinClan(clan.id) && (
                    <Button
                      size="sm"
                      onClick={(e) => handleJoinClan(clan.id, e)}
                      className="pixel-border pixel-font text-xs"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      加入
                    </Button>
                  )}
                  {joinedClans.has(clan.id) && !isUserClan(clan.id) && (
                    <Badge variant="outline" className="pixel-font text-xs">
                      已加入
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <MemberRing members={clan.members} />

              <div className="flex justify-between items-center text-sm">
                <div className="pixel-font">
                  <span className="text-primary font-bold">
                    {clan.remainingMembers}
                  </span>
                  <span className="text-muted-foreground">
                    /{clan.totalMembers}
                  </span>
                  <span className="ml-2 text-muted-foreground">剩余</span>
                </div>
                <div className="pixel-font">
                  <span className="text-accent font-bold">
                    L{clan.leverage}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground pixel-font">
                  分数趋势
                </span>
                <Sparkline data={clan.scoreHistory} />
              </div>

              {/* Dividend Vault Widget */}
              <DividendVaultWidget clan={clan} isCompact={true} />
            </CardContent>
          </Card>
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

      {/* Create Clan Dialog */}
      <Dialog open={showCreateClan} onOpenChange={setShowCreateClan}>
        <DialogContent className="max-w-lg pixel-border">
          <DialogHeader>
            <DialogTitle className="pixel-font text-2xl flex items-center gap-2">
              <Plus className="w-6 h-6" />
              创建新部落
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateClan} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clan-name" className="pixel-font">
                部落名称
              </Label>
              <Input
                id="clan-name"
                value={newClanForm.name}
                onChange={(e) =>
                  setNewClanForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="输入部落名称"
                className="pixel-border pixel-font"
                required
                maxLength={30}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clan-flag" className="pixel-font">
                部落旗帜（Emoji）
              </Label>
              <Input
                id="clan-flag"
                value={newClanForm.flag}
                onChange={(e) =>
                  setNewClanForm((prev) => ({ ...prev, flag: e.target.value }))
                }
                placeholder="🏴‍☠️"
                className="pixel-border pixel-font text-center text-2xl"
                required
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground pixel-font">
                选择一个表情符号作为部落旗帜
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clan-description" className="pixel-font">
                描述（可选）
              </Label>
              <Textarea
                id="clan-description"
                value={newClanForm.description}
                onChange={(e) =>
                  setNewClanForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="描述你们部落的使命与价值观..."
                className="pixel-border pixel-font resize-none"
                rows={3}
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-leverage" className="pixel-font">
                初始杠杆
              </Label>
              <Select
                value={newClanForm.initialLeverage}
                onValueChange={(value) =>
                  setNewClanForm((prev) => ({
                    ...prev,
                    initialLeverage: value,
                  }))
                }
              >
                <SelectTrigger className="pixel-border pixel-font">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">1.0x（保守）</SelectItem>
                  <SelectItem value="1.5">1.5x（均衡）</SelectItem>
                  <SelectItem value="2.0">2.0x（激进）</SelectItem>
                  <SelectItem value="2.5">2.5x（高风险）</SelectItem>
                  <SelectItem value="3.0">3.0x（最大）</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground pixel-font">
                杠杆越高 = 奖励越高，但被淘汰的风险也越大
              </p>
            </div>

            <div className="bg-muted/20 p-3 rounded pixel-border">
              <h4 className="pixel-font font-bold text-sm mb-2">创建成本</h4>
              <div className="flex items-center justify-between text-sm pixel-font">
                <span>平台费用：</span>
                <span className="font-bold">0.1 ETH</span>
              </div>
              <div className="flex items-center justify-between text-sm pixel-font">
                <span>初始金库存入：</span>
                <span className="font-bold">0.5 ETH</span>
              </div>
              <hr className="my-2 border-muted" />
              <div className="flex items-center justify-between text-sm pixel-font font-bold">
                <span>合计：</span>
                <span>0.6 ETH</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateClan(false)}
                className="flex-1 pixel-border pixel-font"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={!newClanForm.name || !newClanForm.flag}
                className="flex-1 pixel-border pixel-font"
              >
                创建部落
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Clan Detail Dialog */}
      <Dialog open={!!selectedClan} onOpenChange={() => setSelectedClan(null)}>
        <DialogContent className="max-w-2xl pixel-border">
          {selectedClan && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 pixel-font text-2xl">
                  <span className="text-3xl">{selectedClan.flag}</span>
                  {selectedClan.name}
                  <Badge variant="secondary" className="pixel-font">
                    排名 #{selectedClan.rank}
                  </Badge>
                  {isUserClan(selectedClan.id) && (
                    <Badge variant="default" className="pixel-font bg-primary">
                      我的部落
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>

              {canJoinClan(selectedClan.id) && (
                <Button
                  onClick={(e) => handleJoinClan(selectedClan.id, e)}
                  className="w-full pixel-border pixel-font"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  加入 {selectedClan.name}
                </Button>
              )}

              <div className="space-y-6">
                {/* Dividend Vault Widget */}
                <DividendVaultWidget clan={selectedClan} />

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="pixel-border">
                    <CardContent className="p-4">
                      <h4 className="pixel-font font-bold mb-2">
                        总计 {SCORE_TOKEN.symbol}
                      </h4>
                      <p className="text-2xl font-bold text-primary pixel-font">
                        {formatTokenAmount(
                          selectedClan.totalScore *
                            Math.pow(10, SCORE_TOKEN.decimals),
                          SCORE_TOKEN
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="pixel-border">
                    <CardContent className="p-4">
                      <h4 className="pixel-font font-bold mb-2">杠杆</h4>
                      <p className="text-2xl font-bold text-accent pixel-font">
                        {selectedClan.leverage}x
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Members */}
                <div>
                  <h4 className="pixel-font font-bold mb-3">部落成员</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedClan.members.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 p-2 rounded pixel-border ${
                          member.status === "eliminated"
                            ? "eliminated bg-muted/50"
                            : "bg-card"
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                          />
                          <AvatarFallback className="pixel-font text-xs">
                            {member.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="pixel-font text-sm">
                          {member.name}
                        </span>
                        <Badge
                          variant={
                            member.status === "active" ? "default" : "secondary"
                          }
                          className="pixel-font text-xs ml-auto"
                        >
                          {member.status === "active" ? "活跃" : "已淘汰"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 className="pixel-font font-bold mb-3">最近活动</h4>
                  <div className="space-y-2">
                    {selectedClan.activities.map((activity, index) => {
                      const dividendContribution = activity.points * 0.1;
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-muted/30 rounded pixel-border"
                          onClick={() =>
                            window.open(
                              "https://sepolia.etherscan.io/tx/0x7509932b2c6e522df9757ea82a269548fce2a7f2eb4bf1856553a6c387fab02b",
                              "_blank"
                            )
                          }
                        >
                          <div>
                            <p className="pixel-font text-sm font-medium">
                              {activity.user}
                            </p>
                            <p className="pixel-font text-xs text-muted-foreground">
                              {activity.action}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="pixel-font text-sm font-bold text-accent">
                              +
                              {formatTokenAmount(
                                activity.points *
                                  Math.pow(10, SCORE_TOKEN.decimals),
                                SCORE_TOKEN
                              )}
                            </p>
                            <p className="pixel-font text-xs text-muted-foreground">
                              金库：+
                              {formatTokenAmount(
                                dividendContribution *
                                  Math.pow(10, VAULT_TOKEN.decimals),
                                VAULT_TOKEN
                              )}
                            </p>
                            <p className="pixel-font text-xs text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
