"use client";

import { useUserTokenBalances } from "@/lib/hooks/useTeamEconomy";
import { useAccount } from "wagmi";
import {
  useReadTeamEconomyTeamWedoBalance,
  useReadTeamManagerAccountTeam,
} from "@/lib/contracts";

export default function BalanceWidget() {
  const { idoBalance } = useUserTokenBalances();
  const { address: walletAddress } = useAccount();
  const { data: userTeamId } = useReadTeamManagerAccountTeam({
    args: [walletAddress ?? "0x0000000000000000000000000000000000000000"],
  });
  const { data: wedoBalance } = useReadTeamEconomyTeamWedoBalance({
    args: [BigInt(userTeamId ?? 0)],
  });

  return (
    <div className="flex flex-col place-items-end">
      <div>个人余额 {idoBalance.toFixed(2)} IDO</div>
      <div>部落余额 {Number(wedoBalance).toFixed(2)} WEDO</div>
    </div>
  );
}
