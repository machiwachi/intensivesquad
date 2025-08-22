'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/retroui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SCORE_TOKEN } from '@/lib/data';
import { formatTokenAmount } from '@/lib/utils';
import { UserPlus, UserMinus } from 'lucide-react';
import { DividendVaultWidget } from './dividend-vault-widget';
import { MemberRing } from './member-ring';
import { RankChange, RankIcon } from './rank';
import { type Clan } from '@/lib/data';
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
} from 'wagmi';

import { Sparkline } from './sparkline';
import {
  useReadTeamManagerAccountTeam,
  useReadTeamManagerMembers,
  useWriteTeamManagerJoin,
  useWriteTeamManagerLeave,
} from '@/lib/contracts';
import { toast } from 'sonner';

export function ClanCard({
  clan,
  onClick,
}: {
  clan: Clan;
  onClick: (clan: Clan) => void;
}) {
  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();
  const { data: userTeamId } = useReadTeamManagerAccountTeam({
    args: [walletAddress ?? '0x0000000000000000000000000000000000000000'],
  });

  // Get user's member info to check cooldown status
  const { data: memberInfo } = useReadTeamManagerMembers({
    args: [
      BigInt(clan.id),
      walletAddress ?? '0x0000000000000000000000000000000000000000',
    ],
  });

  const publicClient = usePublicClient();

  // Join team hooks
  const {
    data: joinHash,
    writeContractAsync: joinAsync,
    reset: resetJoin,
  } = useWriteTeamManagerJoin();

  // Leave team hooks
  const {
    data: leaveHash,
    writeContractAsync: leaveAsync,
    reset: resetLeave,
  } = useWriteTeamManagerLeave();

  const { isLoading: isJoining } = useWaitForTransactionReceipt({
    hash: joinHash,
  });

  const { isLoading: isLeaving } = useWaitForTransactionReceipt({
    hash: leaveHash,
  });

  // Calculate cooldown info
  const cooldownInfo = memberInfo
    ? {
        status: Number(memberInfo[0]),
        cooldownEndsAt: Number(memberInfo[3]),
        isInCooldown:
          Number(memberInfo[0]) === 2 &&
          Number(memberInfo[3]) > Math.floor(Date.now() / 1000),
        cooldownRemainingSeconds: Math.max(
          0,
          Number(memberInfo[3]) - Math.floor(Date.now() / 1000)
        ),
      }
    : null;

  const handleJoinClan = async (clanId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening clan details

    if (!publicClient || !isWalletConnected) {
      toast.error('请先连接钱包');
      return;
    }

    // Check for cooldown
    if (cooldownInfo?.isInCooldown) {
      const days = Math.ceil(
        cooldownInfo.cooldownRemainingSeconds / (24 * 60 * 60)
      );
      toast.error(`冷却时间未结束，还需等待 ${days} 天`);
      return;
    }

    try {
      const joinTx = await joinAsync({
        args: [BigInt(clanId)],
      });

      toast.success('正在加入部落...', {
        description: '请等待交易确认',
      });

      await publicClient.waitForTransactionReceipt({
        hash: joinTx,
      });

      toast.success('成功加入部落！');
    } catch (error) {
      console.error('加入部落失败:', error);
      toast.error('加入部落失败，请重试');
      resetJoin();
    }
  };

  const handleLeaveClan = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening clan details

    if (!publicClient || !isWalletConnected) {
      toast.error('请先连接钱包');
      return;
    }

    try {
      // 30天的冷却期（30 * 24 * 60 * 60 秒）
      const cooldownSeconds = 30 * 24 * 60 * 60;

      const leaveTx = await leaveAsync({
        args: [BigInt(cooldownSeconds)],
      });

      toast.success('正在退出部落...', {
        description: '请等待交易确认',
      });

      await publicClient.waitForTransactionReceipt({
        hash: leaveTx,
      });

      toast.success('已成功退出部落！', {
        description: '30天后可以加入新的部落',
      });
    } catch (error) {
      console.error('退出部落失败:', error);
      toast.error('退出部落失败，请重试');
      resetLeave();
    }
  };

  return (
    <Card
      key={clan.id}
      className={`pixel-border hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group ${
        clan.isUserTeam
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          : ''
      }`}
      onClick={() => onClick(clan)}>
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
                    className="pixel-font text-xs bg-primary">
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
                ).split(' ')[0]
              }
            </Badge>
            {!userTeamId && !cooldownInfo?.isInCooldown && (
              <Button
                size="sm"
                onClick={e => handleJoinClan(clan.id, e)}
                disabled={isJoining}
                className="pixel-border pixel-font text-xs">
                <UserPlus className="w-3 h-3 mr-1" />
                {isJoining ? '加入中...' : '加入'}
              </Button>
            )}
            {!userTeamId && cooldownInfo?.isInCooldown && (
              <Button
                size="sm"
                disabled={true}
                variant="outline"
                className="pixel-border pixel-font text-xs cursor-not-allowed"
                title={`冷却中，还需等待 ${Math.ceil(
                  cooldownInfo.cooldownRemainingSeconds / (24 * 60 * 60)
                )} 天`}>
                冷却中 (
                {Math.ceil(
                  cooldownInfo.cooldownRemainingSeconds / (24 * 60 * 60)
                )}
                天)
              </Button>
            )}
            {userTeamId != null && Number(userTeamId) === clan.id && (
              <Button
                size="sm"
                variant="outline"
                onClick={e => handleLeaveClan(e)}
                disabled={isLeaving}
                className="pixel-border pixel-font text-xs">
                <UserMinus className="w-3 h-3 mr-1" />
                {isLeaving ? '退出中...' : '退出'}
              </Button>
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
