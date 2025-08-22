'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/retroui/Button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SCORE_TOKEN, type Clan } from '@/lib/data';
import { formatTokenAmount } from '@/lib/utils';
import { UserPlus, UserMinus } from 'lucide-react';
import { DividendVaultWidget } from './dividend-vault-widget';
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
} from 'wagmi';

import {
  useReadTeamManagerAccountTeam,
  useReadTeamManagerMembers,
  useWriteTeamManagerJoin,
  useWriteTeamManagerLeave,
} from '@/lib/contracts';
import { toast } from 'sonner';

export function ClanDetailDialog({
  open,
  onOpenChange,
  clan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clan: Clan | null;
}) {
  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();

  const { data: userTeamId } = useReadTeamManagerAccountTeam({
    args: [walletAddress ?? '0x0000000000000000000000000000000000000000'],
  });

  // Get user's member info to check cooldown status for current clan
  const { data: memberInfo } = useReadTeamManagerMembers({
    args: [
      BigInt(clan?.id || 0),
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

  const canJoinClan = (_clanId: number) => {
    return isWalletConnected && !userTeamId && !cooldownInfo?.isInCooldown;
  };

  const isInCooldown = () => {
    return cooldownInfo?.isInCooldown;
  };

  const isUserTeam = (clanId: number) => {
    return userTeamId && Number(userTeamId) === clanId;
  };

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

            {canJoinClan(clan.id) && (
              <Button
                onClick={e => handleJoinClan(clan.id, e)}
                disabled={isJoining}
                className="w-full pixel-border pixel-font">
                <UserPlus className="w-4 h-4 mr-2" />
                {isJoining ? '加入中...' : `加入 ${clan.name}`}
              </Button>
            )}

            {isInCooldown() && !userTeamId && (
              <Button
                disabled={true}
                variant="outline"
                className="w-full pixel-border pixel-font cursor-not-allowed">
                冷却中 - 还需等待{' '}
                {Math.ceil(
                  (cooldownInfo?.cooldownRemainingSeconds || 0) / (24 * 60 * 60)
                )}{' '}
                天
              </Button>
            )}

            {isUserTeam(clan.id) && (
              <Button
                onClick={e => handleLeaveClan(e)}
                disabled={isLeaving}
                variant="outline"
                className="w-full pixel-border pixel-font">
                <UserMinus className="w-4 h-4 mr-2" />
                {isLeaving ? '退出中...' : `退出 ${clan.name}`}
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
                  {clan.members.map(member => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-3 p-2 rounded pixel-border ${
                        member.status === 'eliminated'
                          ? 'eliminated bg-muted/50'
                          : 'bg-card'
                      }`}>
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={member.avatar || '/placeholder.svg'}
                          alt={member.name}
                        />
                        <AvatarFallback className="pixel-font text-xs">
                          {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="pixel-font text-sm">{member.name}</span>
                      <Badge
                        variant={
                          member.status === 'active' ? 'default' : 'secondary'
                        }
                        className="pixel-font text-xs ml-auto">
                        {member.status === 'active' ? '活跃' : '已淘汰'}
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
                            'https://sepolia.etherscan.io/tx/0x7509932b2c6e522df9757ea82a269548fce2a7f2eb4bf1856553a6c387fab02b',
                            '_blank'
                          )
                        }>
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
