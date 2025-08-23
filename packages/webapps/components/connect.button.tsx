"use client";
import { blo } from "blo";
import { useState } from "react";
import {
  ConnectButton as RainbowConnectButton,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { usePostHog } from "@/lib/hooks/usePostHog";
import { POSTHOG_EVENTS } from "@/lib/posthog-constants";
import { Button } from "@/components/retroui/Button";
import { useUserAuth } from "@/lib/hooks/useUserAuth";
import { useETHBalance } from "@/lib/hooks/useBalance";
import { formatAddress } from "@/lib/utils";
import Image from "next/image";
import { Loader2, Wallet } from "lucide-react";
import { DisconnectWalletDialog } from "./disconnect-wallet.dialog";

export function ConnectButton() {
  const { openConnectModal } = useConnectModal();
  const { track } = usePostHog();
  const { isAuthenticated, isWalletConnected, address, isLoading } =
    useUserAuth();
  const { balance, isLoading: isBalanceLoading } = useETHBalance(
    address as `0x${string}`
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConnectClick = () => {
    track(POSTHOG_EVENTS.CONNECT_WALLET_CLICKED);
    openConnectModal?.();
  };

  const handleWalletClick = () => {
    setIsDialogOpen(true);
  };

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <Button disabled className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        加载中...
      </Button>
    );
  }

  // 如果已认证，显示地址和ETH余额
  if (isAuthenticated && isWalletConnected && address) {
    return (
      <>
        <Button
          onClick={handleWalletClick}
          variant="outline"
          className="flex bg-white items-center gap-3 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <div className="font-mono text-sm font-black font-medium">
              {isBalanceLoading ? (
                <Loader2 className="h-3 w-3 animate-spin inline" />
              ) : (
                balance
              )}
              <span className="ml-1 text-xs text-gray-500 self-baseline">
                ETH
              </span>
            </div>
          </div>
          <div className="w-6 h-6 overflow-clip bg-accent border-2 border-foreground rounded-full flex items-center justify-center text-lg">
            <Image
              src={blo(address)}
              alt={address}
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>
        </Button>

        <DisconnectWalletDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          address={address}
          balance={balance}
        />
      </>
    );
  }

  // 如果只是钱包连接但未认证（需要签名）
  if (isWalletConnected && !isAuthenticated) {
    return (
      <Button onClick={handleConnectClick} className="flex items-center gap-2">
        <Wallet className="h-4 w-4" />
        完成登录
      </Button>
    );
  }

  // 默认状态：未连接钱包
  return (
    <Button onClick={handleConnectClick} className="flex items-center gap-2">
      <Wallet className="h-4 w-4" />
      连接钱包
    </Button>
  );
}
