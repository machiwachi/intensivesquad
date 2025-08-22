'use client';

import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/retroui/Button';
import { Wallet, LogOut } from 'lucide-react';
import { useState } from 'react';

export const ConnectWalletButton = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      if (connectors.length === 0) {
        alert('没有检测到钱包连接器，请确保已安装MetaMask或其他支持的钱包');
        return;
      }

      // 优先选择MetaMask连接器，否则选择第一个可用的
      const connector =
        connectors.find(c => c.name.toLowerCase().includes('metamask')) ||
        connectors[0];

      await connect({ connector });
    } catch (error) {
      console.error('连接失败:', error);
      alert(`连接失败: ${error instanceof Error ? error.message : '未知错误'}`);
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
          className="pixel-border pixel-font">
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
      className="pixel-border pixel-font flex items-center gap-2">
      <Wallet className="w-4 h-4" />
      {isConnecting ? '连接中...' : '连接钱包'}
    </Button>
  );
};
