"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { UserMinus, UserPlus } from "lucide-react";
import { DividendVaultWidget } from "./dividend-vault-widget";
import { useAccount } from "wagmi";
import React, { useState, type MouseEvent } from "react";
import {
  useWriteTeamManagerLeave,
  useWriteTeamManagerJoin,
} from "@/lib/contracts";
import { apiClient } from "@/lib/hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useReadTeamManagerAccountTeam } from "@/lib/contracts/generated";
import { blo } from "blo";

export function ClanDetailDialog({
  open,
  onOpenChange,
  clan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clan: Clan | null;
}) {
  const { address, isConnected: isWalletConnected } = useAccount();
  const { isPending: isLeavePending, writeContractAsync: leaveClanAsync } =
    useWriteTeamManagerLeave();
  const { isPending: isJoinPending, writeContractAsync: joinClanAsync } =
    useWriteTeamManagerJoin();
  const queryClient = useQueryClient();

  const { data: userTeamId, refetch: refetchUserTeamId } =
    useReadTeamManagerAccountTeam({
      args: [address ?? "0x0000000000000000000000000000000000000000"],
    });

  async function handleJoinClan(id: number, e: React.MouseEvent) {
    e.stopPropagation();

    console.log("尝试加入部落，部落ID:", id);

    try {
      const tx = await joinClanAsync({
        args: [BigInt(id)],
      });
      console.log("加入部落交易已发送，交易哈希:", tx);

      const verifyRes = await apiClient.members.events.$post({
        json: {
          txHash: tx,
        },
      });

      console.log("后端校验结果:", verifyRes);

      if (!verifyRes.ok) {
        console.error("加入部落失败，后端返回非OK:", verifyRes);
        throw new Error("加入部落失败");
      }

      toast.success("加入部落成功");
      console.log("加入部落成功");

      queryClient.invalidateQueries({ queryKey: ["teams"] });
      refetchUserTeamId();
    } catch (err) {
      console.error("加入部落失败:", err);
      toast.error("加入部落失败");
    }
  }

  async function handleLeaveClan(id: number, e: React.MouseEvent) {
    e.stopPropagation();

    console.log("尝试离开部落，部落ID:", id);

    try {
      const tx = await leaveClanAsync({
        args: [BigInt(0)],
      });
      console.log("离开部落交易已发送，交易哈希:", tx);

      const verifyRes = await apiClient.members.events.$post({
        json: {
          txHash: tx,
        },
      });

      console.log("后端校验结果:", verifyRes);

      if (!verifyRes.ok) {
        console.error("离开部落失败，后端返回非OK:", verifyRes);
        throw new Error("离开部落失败");
      }

      toast.success("离开部落成功");
      console.log("离开部落成功");

      queryClient.invalidateQueries({ queryKey: ["teams"] });
      refetchUserTeamId();
    } catch (err) {
      console.error("离开部落失败:", err);
      toast.error("离开部落失败");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl pixel-border">
        {clan && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 pixel-font text-2xl">
                <span className="text-3xl">{clan.flag}</span>
                {clan.name}
                <Badge variant="secondary" className="pixel-font">
                  排名 #{clan.rank}
                </Badge>
                {clan.isUserTeam && (
                  <Badge variant="default" className="pixel-font bg-primary">
                    我的部落
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            {!userTeamId && (
              <Button
                onClick={(e) => handleJoinClan(clan.id, e)}
                className="w-full pixel-border pixel-font"
                disabled={isJoinPending}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isJoinPending ? "加入中..." : `加入 ${clan.name}`}
              </Button>
            )}

            {Number(userTeamId ?? 0) === clan.id && (
              <Button
                onClick={(e) => handleLeaveClan(clan.id, e)}
                className="w-full pixel-border pixel-font"
                disabled={isLeavePending}
              >
                <UserMinus className="w-4 h-4 mr-2" />
                {isLeavePending ? "离开中..." : `离开 ${clan.name}`}
              </Button>
            )}

            <div className="space-y-6">
              {/* Dividend Vault Widget */}
              <DividendVaultWidget clan={clan} />

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="pixel-border">
                  <CardContent className="p-4">
                    <h4 className="pixel-font font-bold mb-2">
                      总计 {SCORE_TOKEN.symbol}
                    </h4>
                    <p className="text-2xl font-bold text-primary pixel-font">
                      {formatTokenAmount(
                        clan.totalScore * Math.pow(10, SCORE_TOKEN.decimals),
                        SCORE_TOKEN
                      )}
                    </p>
                  </CardContent>
                </Card>

                <Card className="pixel-border">
                  <CardContent className="p-4">
                    <h4 className="pixel-font font-bold mb-2">杠杆</h4>
                    <p className="text-2xl font-bold text-accent pixel-font">
                      {clan.leverage}x
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Members */}
              <div>
                <h4 className="pixel-font font-bold mb-3">部落成员</h4>
                <div className="grid grid-cols-2 gap-2">
                  {clan.members.map((member) => (
                    <div
                      key={member.address}
                      className={`flex items-center gap-3 p-2 rounded pixel-border ${
                        member.status === "eliminated"
                          ? "eliminated bg-muted/50"
                          : "bg-card"
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={blo(member.address)}
                          alt={member.address}
                        />
                        <AvatarFallback className="pixel-font text-xs">
                          {member.address.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="pixel-font text-sm">
                        {member.address}
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
                  {clan.activities.map((activity, index) => {
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
                                Math.pow(10, SCORE_TOKEN.decimals),
                              SCORE_TOKEN
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
  );
}
