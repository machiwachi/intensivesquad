import { formatTokenAmount } from "@/lib/utils";
import { Coins, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clan, VAULT_TOKEN } from "@/lib/data";
import { useAccount } from "wagmi";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const DividendVaultWidget = ({
  clan,
  isCompact = false,
}: {
  clan: Clan;
  isCompact?: boolean;
}) => {
  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();
  const { data: clans } = useQuery<Clan[]>({
    queryKey: ["clans"],
    queryFn: () => fetch("/api/clans").then((res) => res.json()),
  });

  if (!clans) return null;

  const [joinedClans, setJoinedClans] = useState<Set<number>>(new Set([1])); // Mock: already joined clan 1
  const [claimedRewards, setClaimedRewards] = useState<Set<number>>(new Set()); // Track claimed rewards

  const handleClaimRewards = (clanId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening clan details
    if (isWalletConnected && joinedClans.has(clanId)) {
      setClaimedRewards((prev) => new Set([...prev, clanId]));
      // In a real app, this would trigger a blockchain transaction
      console.log(`[v0] Claiming rewards for clan ${clanId}`);
    }
  };

  const canClaimRewards = (clanId: number) => {
    const clan = clans.find((c) => c.id === clanId);
    return (
      isWalletConnected &&
      joinedClans.has(clanId) &&
      clan &&
      clan.dividendVault.userClaimable > 0 &&
      !claimedRewards.has(clanId)
    );
  };

  const hasClaimableRewards = canClaimRewards(clan.id);
  const isMember = joinedClans.has(clan.id);

  if (isCompact) {
    return (
      <div className="flex items-center justify-between p-2 bg-muted/20 rounded pixel-border">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="pixel-font text-xs text-muted-foreground">
            奖励金库：
          </span>
          <span className="pixel-font text-xs font-bold">
            {formatTokenAmount(
              clan.dividendVault.totalBalance *
                Math.pow(10, VAULT_TOKEN.decimals),
              VAULT_TOKEN
            )}
          </span>
        </div>
        {hasClaimableRewards && (
          <Button
            size="sm"
            onClick={(e) => handleClaimRewards(clan.id, e)}
            className="pixel-border pixel-font text-xs h-6 px-2"
          >
            <Gift className="w-3 h-3 mr-1" />
            领取
          </Button>
        )}
        {isMember &&
          clan.dividendVault.userClaimable > 0 &&
          claimedRewards.has(clan.id) && (
            <Badge variant="outline" className="pixel-font text-xs">
              已领取
            </Badge>
          )}
      </div>
    );
  }

  return (
    <Card className="pixel-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <h4 className="pixel-font font-bold">分红金库</h4>
          <Badge variant="outline" className="pixel-font text-xs">
            {VAULT_TOKEN.symbol}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="pixel-font text-xs text-muted-foreground">金库总额</p>
            <p className="pixel-font text-lg font-bold text-primary pixel-font">
              {formatTokenAmount(
                clan.dividendVault.totalBalance *
                  Math.pow(10, VAULT_TOKEN.decimals),
                VAULT_TOKEN
              )}
            </p>
          </div>
          <div>
            <p className="pixel-font text-xs text-muted-foreground">你的份额</p>
            <p className="pixel-font text-lg font-bold text-accent pixel-font">
              {isMember
                ? formatTokenAmount(
                    clan.dividendVault.userClaimable *
                      Math.pow(10, VAULT_TOKEN.decimals),
                    VAULT_TOKEN
                  )
                : `0.00 ${VAULT_TOKEN.symbol}`}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="pixel-font text-sm font-bold text-muted-foreground">
            成员贡献
          </h5>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {clan.members.map((member, index) => {
              const contribution = Math.random() * 50 + 10; // Mock contribution amount
              const isCurrentUser = member.name === "You" && isMember;
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded pixel-border text-xs ${
                    isCurrentUser
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/10"
                  } ${
                    member.status === "eliminated" ? "opacity-50 grayscale" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                    <span
                      className={`pixel-font ${
                        isCurrentUser ? "font-bold text-primary" : ""
                      }`}
                    >
                      {member.name}
                    </span>
                    {member.status === "eliminated" && (
                      <Badge variant="outline" className="pixel-font text-xs">
                        已淘汰
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="pixel-font font-bold">
                      {formatTokenAmount(
                        contribution * Math.pow(10, VAULT_TOKEN.decimals),
                        VAULT_TOKEN
                      )}
                    </p>
                    <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                        style={{ width: `${(contribution / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-xs pixel-font text-muted-foreground">
          <p>上次分发：{clan.dividendVault.lastDistribution}</p>
          <p>
            已累计分发：{" "}
            {formatTokenAmount(
              clan.dividendVault.totalDistributed *
                Math.pow(10, VAULT_TOKEN.decimals),
              VAULT_TOKEN
            )}
          </p>
        </div>

        {hasClaimableRewards && (
          <Button
            onClick={(e) => handleClaimRewards(clan.id, e)}
            className="w-full pixel-border pixel-font"
          >
            <Gift className="w-4 h-4 mr-2" />
            领取{" "}
            {formatTokenAmount(
              clan.dividendVault.userClaimable *
                Math.pow(10, VAULT_TOKEN.decimals),
              VAULT_TOKEN
            )}
          </Button>
        )}

        {isMember &&
          clan.dividendVault.userClaimable > 0 &&
          claimedRewards.has(clan.id) && (
            <div className="text-center">
              <Badge variant="outline" className="pixel-font">
                奖励领取成功
              </Badge>
            </div>
          )}

        {!isMember && (
          <div className="text-center text-xs pixel-font text-muted-foreground">
            加入部落以获取分红奖励
          </div>
        )}
      </CardContent>
    </Card>
  );
};
