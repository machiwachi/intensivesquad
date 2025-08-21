"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import {
  useReadTeamEconomyTeamWedoBalance,
  useReadTeamEconomyGetTeamL,
  useReadTeamEconomyPendingIdo,
  useReadTeamEconomyUserAccrued,
  useReadTeamEconomyUserShares,
  useReadTeamEconomyGetStageScalar,
  useReadTeamEconomyLMin,
  useReadTeamEconomyLMax,
  useReadIdoTokenBalanceOf,
  useReadWedoTokenBalanceOf,
} from "../contracts/generated";

export interface TeamEconomyData {
  teamId: number;
  teamWedoBalance: number;
  teamLeverage: number;
  userPendingIdo: number;
  userAccrued: number;
  userShares: number;
  stageScalar: number;
  lMin: number;
  lMax: number;
}

export interface UserTokenBalances {
  idoBalance: number;
  wedoBalance: number;
}

// Hook to get team economy data
export function useTeamEconomy(teamId: number) {
  const { address } = useAccount();

  const { data: teamWedoBalance } = useReadTeamEconomyTeamWedoBalance({
    args: [BigInt(teamId)],
  });

  const { data: teamL } = useReadTeamEconomyGetTeamL({
    args: [BigInt(teamId)],
  });

  const { data: pendingIdo } = useReadTeamEconomyPendingIdo({
    args: [
      BigInt(teamId),
      address ?? "0x0000000000000000000000000000000000000000",
    ],
  });

  const { data: userAccrued } = useReadTeamEconomyUserAccrued({
    args: [
      BigInt(teamId),
      address ?? "0x0000000000000000000000000000000000000000",
    ],
  });

  const { data: userShares } = useReadTeamEconomyUserShares({
    args: [
      BigInt(teamId),
      address ?? "0x0000000000000000000000000000000000000000",
    ],
  });

  const { data: stageScalar } = useReadTeamEconomyGetStageScalar();
  const { data: lMin } = useReadTeamEconomyLMin();
  const { data: lMax } = useReadTeamEconomyLMax();

  return useMemo(() => {
    if (teamWedoBalance === undefined || !teamL) {
      return null;
    }

    const economy: TeamEconomyData = {
      teamId,
      teamWedoBalance: Number(teamWedoBalance) / 10 ** 18,
      teamLeverage: Number(teamL) / 10 ** 18,
      userPendingIdo: pendingIdo ? Number(pendingIdo) / 10 ** 18 : 0,
      userAccrued: userAccrued ? Number(userAccrued) / 10 ** 18 : 0,
      userShares: userShares ? Number(userShares) : 0,
      stageScalar: stageScalar ? Number(stageScalar) / 10 ** 18 : 1,
      lMin: lMin ? Number(lMin) / 10 ** 18 : 1,
      lMax: lMax ? Number(lMax) / 10 ** 18 : 1.5,
    };

    return economy;
  }, [
    teamId,
    teamWedoBalance,
    teamL,
    pendingIdo,
    userAccrued,
    userShares,
    stageScalar,
    lMin,
    lMax,
  ]);
}

// Hook to get user's token balances
export function useUserTokenBalances() {
  const { address } = useAccount();

  const { data: idoBalance } = useReadIdoTokenBalanceOf({
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  const { data: wedoBalance } = useReadWedoTokenBalanceOf({
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  return useMemo(() => {
    const balances: UserTokenBalances = {
      idoBalance: idoBalance ? Number(idoBalance) / 10 ** 18 : 0,
      wedoBalance: wedoBalance ? Number(wedoBalance) / 10 ** 18 : 0,
    };

    return balances;
  }, [idoBalance, wedoBalance]);
}

// Hook to get global economy parameters
export function useGlobalEconomyParams() {
  const { data: stageScalar } = useReadTeamEconomyGetStageScalar();
  const { data: lMin } = useReadTeamEconomyLMin();
  const { data: lMax } = useReadTeamEconomyLMax();

  return useMemo(() => {
    return {
      stageScalar: stageScalar ? Number(stageScalar) / 10 ** 18 : 1,
      lMin: lMin ? Number(lMin) / 10 ** 18 : 1,
      lMax: lMax ? Number(lMax) / 10 ** 18 : 1.5,
    };
  }, [stageScalar, lMin, lMax]);
}

// Hook to calculate estimated rewards for a user in a team
export function useEstimatedRewards(teamId: number) {
  const economy = useTeamEconomy(teamId);
  const { address } = useAccount();

  return useMemo(() => {
    if (!economy || !address) return null;

    // Calculate potential rewards if team WEDO was withdrawn now
    const potentialIdoFromTeam = economy.teamWedoBalance * economy.teamLeverage;

    // User's share would depend on the current sharing mechanism
    // For now, assume equal distribution among active members
    // This is a simplified calculation - actual sharing may be more complex
    const estimatedShare = potentialIdoFromTeam; // Will need team size to calculate proper share

    return {
      currentClaimable: economy.userPendingIdo + economy.userAccrued,
      potentialFromTeamPool: estimatedShare,
      totalPotential:
        economy.userPendingIdo + economy.userAccrued + estimatedShare,
    };
  }, [economy, address]);
}
