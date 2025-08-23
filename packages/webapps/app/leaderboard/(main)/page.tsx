"use client";

import posthog from "posthog-js";
import { Card, CardContent } from "@/components/retroui/Card";
import { useTeams } from "@/lib/hooks/useTeams";
import { type Team } from "@/lib/typings";
import { Skull, Trophy, Users, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { ClanCard, ClanCardSkeleton } from "../clan-card";
import { ClanDetailDialog } from "../clan-detail.dialog";
import { useReadIdoTokenTotalSupply } from "@/lib/contracts";
import { formatEther } from "viem";
import * as R from "remeda";

import { CreateButton } from "@/components/create.button";
import { formatTokenAmount, generateSeries } from "@/lib/utils";
import { IDO_TOKEN } from "@/lib/constant";
import { BarChart } from "@/components/retroui/charts/BarChart";
import { Badge } from "@/components/retroui/Badge";
import { GiTombstone } from "react-icons/gi";

export default function ClansLeaderboard() {
  const { teams, isLoading } = useTeams();
  const {
    data: idoTokenTotalSupply,
    isLoading: isLoadingIDO,
    isError: isErrorIDO,
  } = useReadIdoTokenTotalSupply();

  const [selectedClan, setSelectedClan] = useState<Team | null>(null);

  if (!teams) return null;

  const totalClans = teams.length;

  const retentionByDays = useMemo(
    () => generateSeries(31, new Date("2025-08-01")),
    []
  );

  return (
    <div className="">
      {/* Header */}
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 grid-flow-row">
        <Card className="p-4">
          <h1 className="text-2xl font-bold">残酷统计</h1>
          <CardContent className="h-full grid grid-cols-2 items-center gap-3 place-items-start justify-items-start">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold ">{totalClans}</p>
                <p className="text-sm text-muted-foreground ">部落总数</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold ">
                  {isLoadingIDO
                    ? "Loading..."
                    : isErrorIDO || !idoTokenTotalSupply
                    ? "--"
                    : formatTokenAmount(idoTokenTotalSupply, {
                        ...IDO_TOKEN,
                        symbol: "",
                      })}
                </p>
                <p className="text-sm text-muted-foreground ">IDO 总计流通量</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold ">
                  {teams.reduce((sum, team) => sum + team.remainingMembers, 0)}
                </p>
                <p className="text-sm text-muted-foreground ">现役战士</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GiTombstone className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold  text-red-500">
                  {teams.reduce(
                    (sum, team) =>
                      sum + (team.totalMembers - team.remainingMembers),
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground ">已淘汰</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 p-4">
          <h1 className="text-2xl font-bold">每日战报</h1>
          <CardContent className="">
            {/* Mini retention chart */}

            <BarChart
              data={retentionByDays}
              index="日期"
              categories={["活跃用户数"]}
              className="h-60"
            />
            <p className="text-sm text-center text-muted-foreground ">
              每日用户留存
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clan Ladder */}
      <Card className="w-full p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">部落天梯</h1>
        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full transform -translate-y-1/2" />

          {/* Team badges positioned by IDO value */}
          <div className="relative h-16 w-full">
            {teams &&
              teams.length > 0 &&
              (() => {
                // Sort teams by totalScore descending
                const sortedTeams = [...teams].sort(
                  (a, b) => b.totalScore - a.totalScore
                );
                const maxScore = sortedTeams[0]?.totalScore || 1;
                const minScore =
                  sortedTeams[sortedTeams.length - 1]?.totalScore || 0;
                const scoreRange = maxScore - minScore || 1;

                const infScore = maxScore / 0.8;

                return sortedTeams.map((team, index) => {
                  // Calculate position: first place at 80%, others distributed proportionally
                  let position;
                  const scoreRatio = team.totalScore / infScore;
                  position = scoreRatio * 100; // 5% to 75% range

                  return (
                    <div
                      key={team.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 top-6 transition-all duration-200 ease-in-out "
                      style={{ left: `${position}%` }}
                    >
                      <Badge
                        variant="surface"
                        size="sm"
                        className={`
                        cursor-pointer  whitespace-nowrap hover:shadow-md
                        ${index === 0 ? "animate-wiggle" : ""}
                        ${index === 0 ? "ring-2 ring-yellow-400" : ""}
                      `}
                        onClick={() => {
                          posthog.capture("leaderboard_ladder_clan_clicked", {
                            clan_id: team.id,
                            rank: index + 1,
                          });
                          setSelectedClan(team);
                        }}
                      >
                        {team.flag} {team.name}
                      </Badge>

                      {/* Score display below badge */}
                      <div className="text-xs text-center mt-1 text-muted-foreground">
                        {team.totalScore.toLocaleString()}
                      </div>
                    </div>
                  );
                });
              })()}
          </div>

          {/* Scale markers */}
          <div className="flex justify-between mt-8 text-xs text-muted-foreground">
            <span>弱鸡</span>
            <span>普通</span>
            <span>强者</span>
            <span className="text-yellow-600 font-semibold">王者</span>
          </div>
        </div>
      </Card>

      {/* Clans Grid */}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">所有部落</h1>

          <CreateButton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ClanCardSkeleton key={index} />
              ))
            : teams.map((team) => (
                <ClanCard
                  key={team.id}
                  clan={team}
                  onClick={() => {
                    posthog.capture("leaderboard_clan_viewed", {
                      clan_id: team.id,
                    });
                    setSelectedClan(team);
                  }}
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
    </div>
  );
}
