"use client";
import posthog from "posthog-js";
import { Button } from "@/components/retroui/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/retroui/Dialog";
import { apiClient } from "@/lib/api";
import { cn, getBlockchainExplorerUrl } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckIcon,
  ExternalLinkIcon,
  Heart,
  Loader2,
  UserPlus,
  Users,
} from "lucide-react";
import { GiSaloonDoors } from "react-icons/gi";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
} from "wagmi";
import { GiGalaxy } from "react-icons/gi";
import { useUserAuth } from "@/lib/hooks/useUserAuth";
import { signIn } from "next-auth/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function KioskButton() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
  const {
    isAuthenticated,
    hasTeam,
    needsLogin,
    needsTeam,
    canUseFaucet,
    isLoading: isAuthLoading,
  } = useUserAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [txs, setTxs] = useState<`0x${string}`[]>([]);
  const [open, setOpen] = useState(false);
  const [creditData, setCreditData] = useState<{
    idoAmount: number;
    wedoAmount: number;
    eventName: string;
  } | null>(null);
  const [loadingText, setLoadingText] = useState("");
  const { openConnectModal } = useConnectModal();

  const { data: idoReceipt, isSuccess: isIdoSuccess } =
    useWaitForTransactionReceipt({
      hash: txs[0],
    });
  const { data: wedoReceipt, isSuccess: isWedoSuccess } =
    useWaitForTransactionReceipt({
      hash: txs[1],
    });

  useEffect(() => {
    if (isIdoSuccess && isWedoSuccess) {
      toast.success("发放成功");
      queryClient.invalidateQueries({
        queryKey: ["readContract", { functionName: "balanceOf" }],
      });
      queryClient.invalidateQueries({
        queryKey: ["readContract", { functionName: "teamWedoBalance" }],
      });
    }
  }, [isIdoSuccess, isWedoSuccess]);

  // 加载时的有趣文字
  const loadingTexts = [
    "🎲 正在掷骰子...",
    "✨ 命运女神在眷顾你...",
    "🎯 瞄准幸运靶心...",
    "🎪 转动幸运转盘...",
    "🎁 正在打开神秘礼盒...",
    "🌟 收集星辰之力...",
    "🎨 绘制专属奖励...",
    "🎵 演奏幸运乐章...",
    "🔮 水晶球显示未来...",
    "🎊 准备惊喜时刻...",
  ];

  // 文字淡入淡出效果
  useEffect(() => {
    if (!isLoading) {
      setLoadingText("");
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      setLoadingText(loadingTexts[index]);
      index = (index + 1) % loadingTexts.length;
    }, 1500);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleLoginClick = async () => {
    try {
      openConnectModal?.();
    } catch (error) {
      console.error("登录失败:", error);
      toast.error("登录失败，请重试");
    }
  };

  const handleTeamClick = () => {
    // 导航到创建或加入团队的页面
    window.location.href = "/leaderboard";
    toast.info("请在战场页面创建或加入一个团队");
  };

  const handleClick = async () => {
    // 检查认证状态
    if (needsLogin) {
      toast.error("请先登录");
      return;
    }

    // 检查团队状态
    if (needsTeam) {
      toast.error("请先创建或加入一个团队");
      return;
    }

    if (!address || !publicClient) {
      toast.error("请连接钱包");
      return;
    }

    posthog.capture("kiosk_credit_requested", {
      user_address: address,
    });

    setTxs([]);
    setCreditData(null);

    try {
      setIsLoading(true);
      const response = await apiClient.credit.$post({
        json: {
          account: address,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setCreditData({
        idoAmount: data.idoAmount,
        wedoAmount: data.wedoAmount,
        eventName: data.eventName,
      });

      posthog.capture("kiosk_credit_transactions_received", {
        user_address: address,
        ido_amount: data.idoAmount,
        wedo_amount: data.wedoAmount,
        event_name: data.eventName,
        ido_tx: data.idoTx,
        wedo_tx: data.wedoTx,
      });

      setTxs((prev) => [data.idoTx, data.wedoTx]);
    } catch (error) {
      console.error(error);
      toast.error("发放失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white rounded-full">
          <Heart className="w-4 h-4 fill-red-500 stroke-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          {/* 显示不同状态的内容 */}
          {needsLogin ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <GiSaloonDoors className="w-12 h-12 " />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">需要登录</h3>
                  <p className="text-sm text-gray-600">
                    请先登录才能使用水龙头
                  </p>
                </div>
                <Button onClick={handleLoginClick} className="w-full">
                  立即登录
                </Button>
              </div>
            </>
          ) : needsTeam ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <Users className="w-12 h-12 text-gray-400" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">需要加入团队</h3>
                  <p className="text-sm text-gray-600">
                    请先创建或加入一个团队才能使用水龙头功能
                  </p>
                </div>
                <Button onClick={handleTeamClick} className="w-full">
                  前往战场
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                给我一点点
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full size-14"
                  onClick={handleClick}
                  disabled={isLoading || isAuthLoading}
                >
                  <Heart
                    className={cn(
                      "size-10 fill-red-500 stroke-0",
                      isLoading && "animate-ping animate-infinite"
                    )}
                  />
                </Button>
              </div>
            </>
          )}

          {/* 只在可以使用水龙头时显示加载动画和结果 */}
          {canUseFaucet && (
            <>
              {/* 加载动画文字 */}
              {isLoading && (
                <div className="text-center min-h-[24px]">
                  <p className="text-sm text-gray-600 animate-pulse transition-opacity duration-1000">
                    {loadingText}
                  </p>
                </div>
              )}

              {/* 显示获得的事件名称 */}
              {creditData && !isLoading && (
                <div className="flex mx-auto w-full items-center justify-center gap-2 text-lg font-semibold text-green-700">
                  <GiGalaxy className="w-4 h-4" />
                  {creditData.eventName}！
                </div>
              )}

              <div className="flex flex-col gap-2 p-2">
                {/* IDO 按钮 - 合并积分显示和交易链接 */}
                <div className="flex flex-row gap-2">
                  {txs[0] && (
                    <Link
                      href={getBlockchainExplorerUrl(txs[0])}
                      target="_blank"
                    >
                      <Button
                        variant="outline"
                        className="flex-1 shadow-blue-900  bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <ExternalLinkIcon className="w-4 h-4" />
                            {creditData && `获得 ${creditData.idoAmount} IDO`}
                          </div>
                          {isIdoSuccess ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                        </div>
                      </Button>
                    </Link>
                  )}
                  {/* WEDO 按钮 - 合并积分显示和交易链接 */}
                  {txs[1] && (
                    <Link
                      href={getBlockchainExplorerUrl(txs[1])}
                      target="_blank"
                    >
                      <Button
                        variant="outline"
                        className="w-full shadow-purple-900 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                      >
                        <div className="flex items-center justify-between w-full gap-2">
                          <div className="flex items-center gap-2">
                            <ExternalLinkIcon className="w-4 h-4" />
                            {creditData &&
                              `获得 ${creditData.wedoAmount.toFixed(2)} WEDO`}
                          </div>
                          {isWedoSuccess ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                        </div>
                      </Button>
                    </Link>
                  )}
                </div>

                <p className="text-sm text-gray-600 text-center mt-2">
                  获得 20 IDO 可额外获得 1 WEDO
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
