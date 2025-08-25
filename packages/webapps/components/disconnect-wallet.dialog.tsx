"use client";

import { useState } from "react";
import { useDisconnect } from "wagmi";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/retroui/Dialog";
import { Button } from "@/components/retroui/Button";
import { usePostHog } from "@/lib/hooks/usePostHog";
import { POSTHOG_EVENTS } from "@/lib/posthog-constants";
import { formatAddress } from "@/lib/utils";
import { Copy, ExternalLink, LogOut } from "lucide-react";

interface DisconnectWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  balance?: string;
}

export function DisconnectWalletDialog({
  isOpen,
  onClose,
  address,
  balance,
}: DisconnectWalletDialogProps) {
  const { disconnect } = useDisconnect();
  const { track } = usePostHog();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);

      // 记录断开连接事件
      track(POSTHOG_EVENTS.WALLET_DISCONNECTED);

      // 断开钱包连接
      disconnect();

      // 登出NextAuth会话
      await signOut({ redirect: false });

      // 关闭弹窗
      onClose();
    } catch (error) {
      console.error("Error disconnecting:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      track(POSTHOG_EVENTS.EXTERNAL_LINK_CLICKED, {
        action: "copy_wallet_address",
      });
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  const handleViewOnExplorer = () => {
    const explorerUrl = `https://sepolia.etherscan.io/address/${address}`;
    window.open(explorerUrl, "_blank");
    track(POSTHOG_EVENTS.EXTERNAL_LINK_CLICKED, {
      action: "view_on_explorer",
      url: explorerUrl,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="sm">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">钱包信息</h2>

          {/* 钱包地址 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">钱包地址</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <span className="font-mono text-sm flex-1">
                {formatAddress(address)}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyAddress}
                className="h-8 w-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleViewOnExplorer}
                className="h-8 w-8"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ETH余额 */}
          {balance && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">ETH余额</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="font-mono text-lg font-semibold">
                  {balance} ETH
                </span>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="flex-1 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isDisconnecting ? "断开中..." : "断开连接"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
