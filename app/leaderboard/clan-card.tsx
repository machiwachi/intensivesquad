"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SCORE_TOKEN } from "@/lib/data";
import { formatTokenAmount } from "@/lib/utils";
import { UserPlus } from "lucide-react";
import { DividendVaultWidget } from "./dividend-vault-widget";
import { MemberRing } from "./member-ring";
import { RankChange, RankIcon } from "./rank";
import { Clan } from "@/lib/data";
import { useAccount } from "wagmi";
import { useState } from "react";
import { Sparkline } from "./sparkline";

export function ClanCard({
  clan,
  onClick,
}: {
  clan: Clan;
  onClick: (clan: Clan) => void;
}) {
  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();
  const [joinedClans, setJoinedClans] = useState<Set<number>>(new Set([1])); // Mock: already joined clan 1
  const [userClanId, setUserClanId] = useState<number | null>(null);

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
  return (
    <Card
      key={clan.id}
      className={`pixel-border hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group ${
        clan.isUserClan
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
                {clan.isUserClan && (
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
              {
                formatTokenAmount(
                  clan.totalScore * Math.pow(10, SCORE_TOKEN.decimals),
                  SCORE_TOKEN
                ).split(" ")[0]
              }
            </Badge>
            {!clan.isUserClan && (
              <Button
                size="sm"
                onClick={(e) => handleJoinClan(clan.id, e)}
                className="pixel-border pixel-font text-xs"
              >
                <UserPlus className="w-3 h-3 mr-1" />
                加入
              </Button>
            )}
            {clan.isUserClan && (
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
            <span className="text-muted-foreground">/{clan.totalMembers}</span>
            <span className="ml-2 text-muted-foreground">剩余</span>
          </div>
          <div className="pixel-font">
            <span className="text-accent font-bold">L{clan.leverage}</span>
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
  );
}
