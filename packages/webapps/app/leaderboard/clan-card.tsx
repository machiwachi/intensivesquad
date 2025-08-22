"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type Team } from "@/lib/typings";
import { formatEther } from "viem";
import { DividendVaultBlock } from "./dividend-vault.block";
import { MemberRing } from "./member-ring";
import { RankChange, RankIcon } from "./rank";
import { Sparkline } from "./sparkline";

export function ClanCard({
  clan,
  onClick,
}: {
  clan: Team;
  onClick: (clan: Team) => void;
}) {
  console.log(clan);
  return (
    <Card
      key={clan.id}
      className={`pixel-border hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group ${
        clan.isUserTeam
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : ""
      }`}
      onClick={() => onClick(clan)}
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
                {clan.isUserTeam && (
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
                <span className="pixel-font text-sm">排名 #{clan.rank}</span>
                <RankChange current={clan.rank} previous={clan.previousRank} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="pixel-font text-xs">
              {clan.totalScore} IDO
            </Badge>
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
            <span className="text-muted-foreground">/{clan.totalMembers}</span>
            <span className="ml-2 text-muted-foreground">剩余</span>
          </div>
          <div className="pixel-font">
            <span className="text-accent font-bold">
              L={formatEther(clan.leverage)}
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
        <DividendVaultBlock wedoBalance={clan.dividendVault.totalBalance} />
      </CardContent>
    </Card>
  );
}
