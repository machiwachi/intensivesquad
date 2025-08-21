"use client";

import { useUserTokenBalances } from "@/lib/hooks/useTeamEconomy";
import { useAccount } from "wagmi";
import {
  useReadTeamEconomyTeamWedoBalance,
  useReadTeamManagerAccountTeam,
} from "@/lib/contracts";

export default function BalanceWidget() {
  const { idoBalance, wedoBalance } = useUserTokenBalances();

  return (
    <div className="flex flex-col place-items-end">
      <div>个人余额 {idoBalance} IDO</div>
      <div>小队余额 {wedoBalance} WEDO</div>
    </div>
  );
}
