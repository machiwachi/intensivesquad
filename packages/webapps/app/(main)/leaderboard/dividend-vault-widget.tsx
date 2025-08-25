import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/retroui/Button";
import { Card, CardContent, CardHeader } from "@/components/retroui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from "@/components/retroui/Dialog";
import { apiClient } from "@/lib/api";
import { getBlockchainExplorerUrl } from "@/lib/utils";
import { IDO_TOKEN, WEDO_TOKEN } from "@/lib/constant";
import {
  useReadTeamManagerAccountTeam,
  useReadIdoTokenBalanceOf,
  useSimulateTeamEconomyClaim,
  useSimulateTeamEconomyWithdrawAll,
  useWriteTeamEconomyClaim,
  useWriteTeamEconomyWithdrawAll,
} from "@/lib/contracts";
import { useTeamEconomy } from "@/lib/hooks/useTeamEconomy";
import { type Team } from "@/lib/typings";
import { formatTokenAmount } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRightIcon,
  Coins,
  Download,
  ExternalLinkIcon,
  Gift,
  Heart,
  Loader2,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/posthog-utils";
import { KioskButton } from "@/components/kiosk.button";

export const DividendVaultWidget = ({ clan }: { clan: Team }) => {
  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();
  const { refetch, data: economyData } = useTeamEconomy(clan.id);
  const { data: userTeamId } = useReadTeamManagerAccountTeam({
    args: [walletAddress ?? "0x0000000000000000000000000000000000000000"],
  });

  const queryClient = useQueryClient();

  const showContributionButtonHint = isFeatureEnabled(
    "show_contribution_button_hint"
  );

  console.log({ economyData });

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showContributionDialog, setShowContributionDialog] = useState(false);
  const [showContributionButton, setShowContributionButton] = useState(false);
  const [contributionAmount, setContributionAmount] = useState(0);
  const [isContributing, setIsContributing] = useState(false);

  const isMember = Number(userTeamId) === clan.id;

  // 获取用户的 IDO 余额
  const { data: userIdoBalance } = useReadIdoTokenBalanceOf({
    args: [walletAddress ?? "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!walletAddress,
    },
  });

  const maxContributionAmount = userIdoBalance
    ? Number(formatUnits(userIdoBalance, IDO_TOKEN.decimals))
    : 0;

  // Withdraw functionality
  const { data: simulateWithdrawAll } = useSimulateTeamEconomyWithdrawAll({
    args: [BigInt(clan.id)],
    query: {
      enabled: !!economyData?.teamWedoBalance && isMember,
    },
  });

  const {
    data: withdrawHash,
    writeContract: writeWithdrawAll,
    isPending: isWithdrawPending,
  } = useWriteTeamEconomyWithdrawAll();

  const { isLoading: isWithdrawConfirming } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  // Claim functionality
  const { data: simulateClaim } = useSimulateTeamEconomyClaim({
    args: [BigInt(clan.id)],
    query: {
      enabled: !!economyData && economyData.userPendingIdo > 0 && isMember,
    },
  });

  const {
    data: claimHash,
    writeContract: writeClaim,
    isPending: isClaimPending,
  } = useWriteTeamEconomyClaim();

  const { isLoading: isClaimConfirming } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  // Reset withdrawing state when transaction is confirmed
  useEffect(() => {
    if (withdrawHash && !isWithdrawConfirming && !isWithdrawPending) {
      setIsWithdrawing(false);
    }
  }, [withdrawHash, isWithdrawConfirming, isWithdrawPending]);

  // Cmd+K 监听器
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        if (isMember && isWalletConnected) {
          setShowContributionButton(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMember, isWalletConnected]);

  // 计算基于团队 L 值和人数的 IDO 到 WEDO 转换率
  const calculateIdoToWedoConversion = useCallback(
    (idoAmount: number) => {
      if (!economyData) return 0;

      // 基于团队杠杆和成员数量计算转换率
      // 确保没有套利空间，不会增发 IDO
      const teamLeverage = Number(formatUnits(economyData.teamLeverage, 3));
      const activeMemberCount = clan.members.filter(
        (m) => m.status !== "eliminated"
      ).length;

      // 转换公式：IDO * (1 / (L * sqrt(memberCount))) = WEDO
      // 这确保了随着杠杆和人数增加，转换率降低，防止套利
      const conversionRate =
        1 / (teamLeverage * Math.sqrt(Math.max(activeMemberCount, 1)));

      return idoAmount * conversionRate;
    },
    [economyData, clan.members]
  );

  const expectedWedoFromContribution =
    calculateIdoToWedoConversion(contributionAmount);

  if (!economyData) return null;

  const handleClaimRewards = async (
    clanId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent opening clan details
    if (!isWalletConnected || !isMember || !simulateClaim || !walletAddress)
      return;

    writeClaim(simulateClaim.request, {
      onSuccess: async (hash) => {
        toast.success("交易已提交，正在确认中...");

        try {
          // 调用API端点来跟踪交易并更新活动记录
          const response = await apiClient.claim.track.$post({
            json: {
              txHash: hash,
              teamId: clanId,
              account: walletAddress,
            },
          });

          if (response.ok) {
            const result = await response.json();
            toast.success(
              `奖励领取成功！获得 ${result.claimedAmount.toFixed(2)} IDO`
            );
            refetch();
          } else {
            console.error("API跟踪失败");
            toast.warning("奖励领取成功，但活动记录更新失败");
          }

          queryClient.invalidateQueries({
            queryKey: ["teams"],
          });
        } catch (error) {
          console.error("跟踪Claim交易时出错:", error);
          toast.warning("奖励领取成功，但活动记录更新失败");
        }
      },
      onError: (error) => {
        console.error("Claim交易失败:", error);
        toast.error("奖励领取失败");
      },
    });
  };

  const handleWithdraw = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening clan details
    if (
      !isWalletConnected ||
      !isMember ||
      !simulateWithdrawAll ||
      !walletAddress
    )
      return;

    setIsWithdrawing(true);
    writeWithdrawAll(simulateWithdrawAll.request, {
      onSuccess: async (hash) => {
        toast.success("转换交易已提交，正在确认中...");

        try {
          // 调用API端点来跟踪交易并更新活动记录
          const response = await apiClient.withdraw.track.$post({
            json: {
              txHash: hash,
              teamId: clan.id,
              account: walletAddress,
            },
          });

          if (response.ok) {
            const result = await response.json();
            toast.success(
              `WEDO转换成功！${result.withdrawnWedoAmount.toFixed(
                2
              )} WEDO → ${result.mintedIdoAmount.toFixed(
                2
              )} IDO (杠杆: ${result.leverageRatio.toFixed(2)}x)`
            );
          } else {
            console.error("Withdraw API跟踪失败");
            toast.warning("WEDO转换成功，但活动记录更新失败");
          }
          refetch();
          queryClient.invalidateQueries({
            queryKey: ["teams"],
          });
        } catch (error) {
          console.error("跟踪Withdraw交易时出错:", error);
          toast.warning("WEDO转换成功，但活动记录更新失败");
        }
      },
      onError: (error) => {
        console.error("Withdraw交易失败:", error);
        toast.error("WEDO转换失败");
        setIsWithdrawing(false);
      },
    });
  };

  const handleContribution = async () => {
    if (
      !isWalletConnected ||
      !isMember ||
      !walletAddress ||
      contributionAmount <= 0
    ) {
      return;
    }

    if (contributionAmount > maxContributionAmount) {
      toast.error("贡献金额不能超过您的 IDO 余额");
      return;
    }

    setIsContributing(true);

    try {
      // 这里应该调用合约方法来执行 IDO 到 WEDO 的贡献
      // 暂时模拟一个成功的交易
      const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66);

      // 调用API端点来跟踪贡献交易
      // 注意：需要在后端添加 contribute.track 端点
      // const response = await apiClient.contribute?.track?.$post({
      //   json: {
      //     txHash: mockTxHash,
      //     teamId: clan.id,
      //     account: walletAddress,
      //     idoAmount: contributionAmount,
      //     wedoAmount: expectedWedoFromContribution,
      //   },
      // });

      // 模拟成功响应
      const response = { ok: true };

      if (response?.ok) {
        toast.success(
          `贡献成功！您贡献了 ${contributionAmount.toFixed(
            2
          )} IDO，为团队金库增加了 ${expectedWedoFromContribution.toFixed(
            2
          )} WEDO`
        );
        setShowContributionDialog(false);
        setShowContributionButton(false); // 贡献成功后隐藏按钮
        setContributionAmount(0);
        refetch();
        queryClient.invalidateQueries({
          queryKey: ["teams"],
        });
      } else {
        toast.error("贡献失败，请重试");
      }
    } catch (error) {
      console.error("贡献交易时出错:", error);
      toast.error("贡献失败，请重试");
    } finally {
      setIsContributing(false);
    }
  };

  const canClaimRewards = (clanId: number) => {
    return (
      isWalletConnected &&
      isMember &&
      economyData.userPendingIdo > 0 &&
      !!simulateClaim
    );
  };

  const hasClaimableRewards = canClaimRewards(clan.id);

  return (
    <Card className="w-full hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <h4 className=" font-bold">分红金库</h4>
          <KioskButton />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className=" text-xs text-muted-foreground">金库总额</p>
            <div className=" text-lg font-bold text flex items-center gap-2">
              {formatTokenAmount(economyData.teamWedoBalance, WEDO_TOKEN)}
              {isMember && (
                <Button
                  onClick={handleWithdraw}
                  disabled={
                    isWithdrawPending ||
                    isWithdrawConfirming ||
                    !simulateWithdrawAll ||
                    economyData.teamWedoBalance <= 0
                  }
                  size="sm"
                  className="gap-1"
                >
                  {isWithdrawPending || isWithdrawConfirming ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRightIcon className="w-4 h-4" />
                  )}
                  {isWithdrawPending || isWithdrawConfirming
                    ? "转换中..."
                    : "提取"}
                </Button>
              )}
            </div>
            <div>
              <p className=" text-xs text-muted-foreground">兑换率</p>
              <p className=" text-lg font-bold text-green-800">
                {formatTokenAmount(economyData.teamLeverage, {
                  symbol: "IDO/WEDO",
                  decimals: 3,
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center">
            {/* Withdraw Button */}
            {/* Withdraw success indicator */}
            {withdrawHash && !isWithdrawPending && !isWithdrawConfirming && (
              <Link
                className=" text-sm mb-2 text-emerald-600 flex items-center gap-2"
                href={getBlockchainExplorerUrl(withdrawHash)}
                target="_blank"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                WEDO转换成功！
              </Link>
            )}

            {/* Claim success indicator */}
            {claimHash && !isClaimPending && !isClaimConfirming && (
              <Link
                className=" text-sm mb-2 text-emerald-600 flex items-center gap-2"
                href={getBlockchainExplorerUrl(claimHash)}
                target="_blank"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                IDO领取成功
              </Link>
            )}
          </div>

          <div>
            <p className=" text-xs text-muted-foreground">待领取份额</p>
            <div className=" text-lg font-bold text-muted-foreground flex items-center gap-2">
              {isMember
                ? formatTokenAmount(economyData.userPendingIdo, IDO_TOKEN)
                : "加入部落以获取分红奖励"}

              {/* 领取按钮 */}
              {(hasClaimableRewards || isClaimPending || isClaimConfirming) && (
                <Button
                  onClick={(e) => handleClaimRewards(clan.id, e)}
                  disabled={
                    isClaimPending || isClaimConfirming || !simulateClaim
                  }
                  className=""
                  size="sm"
                >
                  {isClaimPending || isClaimConfirming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Gift className="w-4 h-4" />
                  )}
                  {isClaimPending || isClaimConfirming ? "领取中" : "领取"}
                </Button>
              )}

              {/* 我为人人贡献按钮 (Cmd+K 激活后显示) */}
              {showContributionButton && isMember && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowContributionDialog(true);
                  }}
                  size="sm"
                  className="gap-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Heart className="w-4 h-4" />
                  我为人人！
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className=" text-sm font-bold text-muted-foreground">成员贡献</h5>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {clan.members.map((member, index) => {
              const contribution = Math.random() * 50 + 10; // Mock contribution amount
              const isCurrentUser =
                member.address === walletAddress && isMember;
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded  text-xs ${
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
                      className={` ${
                        isCurrentUser ? "font-bold text-primary" : ""
                      }`}
                    >
                      {member.address}
                    </span>
                    {member.status === "eliminated" && (
                      <Badge variant="outline" className=" text-xs">
                        已淘汰
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className=" font-bold">
                      {formatTokenAmount(contribution, WEDO_TOKEN)}
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

        <div className="text-xs  text-muted-foreground">
          <p>
            已累计分发：{" "}
            {formatTokenAmount(clan.dividendVault.totalDistributed, IDO_TOKEN)}
          </p>
        </div>

        {/* Cmd+K 激活提示 */}
        {showContributionButtonHint &&
          isMember &&
          isWalletConnected &&
          !showContributionButton && (
            <div className="text-xs text-center text-muted-foreground opacity-60">
              按 Cmd+K 激活 "我为人人！" 功能
            </div>
          )}

        {/* 激活后的提示 */}
        {showContributionButton && isMember && (
          <div className="text-xs text-center text-emerald-600 opacity-80">
            ✨ "我为人人！" 功能已激活，请在待领取份额旁点击按钮
          </div>
        )}
      </CardContent>

      {/* 贡献对话框 */}
      <Dialog
        open={showContributionDialog}
        onOpenChange={(open) => {
          setShowContributionDialog(open);
          if (!open) {
            setShowContributionButton(false); // 关闭对话框时隐藏按钮
          }
        }}
      >
        <DialogContent size="md" className="p-0">
          <DialogHeader className="text-lg font-bold">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              我为人人！IDO 贡献
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="text-sm text-muted-foreground">
              <p>将您的 IDO 贡献给团队金库，转换为 WEDO 增强团队实力！</p>
              <p className="mt-2">
                转换率基于团队杠杆值 (
                {formatTokenAmount(economyData?.teamLeverage || BigInt(0), {
                  symbol: "x",
                  decimals: 3,
                })}
                ) 和活跃成员数 (
                {clan.members.filter((m) => m.status !== "eliminated").length}{" "}
                人)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">贡献金额 (IDO)</label>
                  <span className="text-xs text-muted-foreground">
                    余额:{" "}
                    {formatTokenAmount(userIdoBalance || BigInt(0), IDO_TOKEN)}
                  </span>
                </div>

                {/* 滑动条 */}
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max={maxContributionAmount}
                    step="0.01"
                    value={contributionAmount}
                    onChange={(e) =>
                      setContributionAmount(Number(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                        (contributionAmount / maxContributionAmount) * 100
                      }%, #e5e7eb ${
                        (contributionAmount / maxContributionAmount) * 100
                      }%, #e5e7eb 100%)`,
                    }}
                  />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span className="font-semibold text-lg">
                      {contributionAmount.toFixed(2)} IDO
                    </span>
                    <span>{maxContributionAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* 手动输入 */}
                <div className="mt-3">
                  <input
                    type="number"
                    min="0"
                    max={maxContributionAmount}
                    step="0.01"
                    value={contributionAmount}
                    onChange={(e) => {
                      const value = Math.min(
                        Number(e.target.value),
                        maxContributionAmount
                      );
                      setContributionAmount(Math.max(0, value));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="输入贡献金额"
                  />
                </div>
              </div>

              {/* 转换预览 */}
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">预计获得 WEDO:</span>
                  <span className="font-bold text-green-600">
                    {expectedWedoFromContribution.toFixed(4)} WEDO
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  转换率: 1 IDO ={" "}
                  {(
                    expectedWedoFromContribution /
                    Math.max(contributionAmount, 0.0001)
                  ).toFixed(4)}{" "}
                  WEDO
                </div>
              </div>

              {/* 风险提示 */}
              {contributionAmount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-yellow-800">
                      <p className="font-medium">贡献提醒</p>
                      <p>
                        贡献的 IDO 将被永久转换为团队金库中的
                        WEDO，该操作不可逆转。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowContributionDialog(false);
                setShowContributionButton(false); // 取消时隐藏按钮
              }}
              disabled={isContributing}
            >
              取消
            </Button>
            <Button
              onClick={handleContribution}
              disabled={
                isContributing ||
                contributionAmount <= 0 ||
                contributionAmount > maxContributionAmount
              }
              className="gap-2"
            >
              {isContributing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
              {isContributing
                ? "贡献中..."
                : `贡献 ${contributionAmount.toFixed(2)} IDO`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
