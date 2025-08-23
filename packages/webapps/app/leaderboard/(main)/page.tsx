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
        <Card className="shadow-none hover:shadow-md p-4">
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
              <Skull className="w-8 h-8 text-red-500" />
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

        <Card className="shadow-none hover:shadow-md md:col-span-2 p-4">
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
