"use client";

import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/retroui/Button";
import { Wallet, LogOut } from "lucide-react";
import { useState } from "react";

export const ConnectWalletButton = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // 尝试连接第一个可用的连接器（通常是MetaMask）
      const connector = connectors[0];
      if (connector.ready) {
        await connect({ connector });
      }
    } catch (error) {
      console.error("连接失败:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm pixel-font text-muted-foreground">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
          className="pixel-border pixel-font"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      variant="outline"
      disabled={isConnecting}
      className="pixel-border pixel-font flex items-center gap-2"
    >
      <Wallet className="w-4 h-4" />
      {isConnecting ? "连接中..." : "连接钱包"}
    </Button>
  );
};
