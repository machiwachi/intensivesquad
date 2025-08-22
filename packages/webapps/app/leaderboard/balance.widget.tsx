'use client';

import { useUserTokenBalances } from '@/lib/hooks/useTeamEconomy';

export default function BalanceWidget() {
  const { idoBalance, wedoBalance } = useUserTokenBalances();

  // 处理显示值，如果是 "-" 则显示 "0"
  const displayIdoBalance = idoBalance === '-' ? '0' : idoBalance;
  const displayWedoBalance = wedoBalance === '-' ? '0' : wedoBalance;

  return (
    <div className="flex flex-col place-items-end">
      <div>
        个人余额 -{' '}
        <span className="text-black font-medium">{displayIdoBalance}</span> IDO
      </div>
      <div>
        小队余额 -{' '}
        <span className="text-black font-medium">{displayWedoBalance}</span>{' '}
        WEDO
      </div>
    </div>
  );
}
