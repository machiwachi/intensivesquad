"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import {
  useReadTeamEconomyGetTeamL,
  useReadTeamEconomyPendingIdo,
  useReadTeamEconomyTeamWedoBalance,
  useReadTeamManagerAccountTeam,
  useReadTeamManagerGetTeamSize,
  useReadTeamManagerNextTeamId,
  useReadTeamManagerTeams,
} from "../contracts/generated";

import { apiClient } from "../api";
import type { Team } from "../typings";

// Hook to get a single team's datas
export function useTeam(teamId: number) {
  const { data: teamInfo } = useReadTeamManagerTeams({
    args: [BigInt(teamId)],
  });

  const { data: teamSize } = useReadTeamManagerGetTeamSize({
    args: [BigInt(teamId)],
  });

  const { data: wedoBalance } = useReadTeamEconomyTeamWedoBalance({
    args: [BigInt(teamId)],
  });

  const { data: teamL } = useReadTeamEconomyGetTeamL({
    args: [BigInt(teamId)],
  });

  return useMemo(() => {
    if (!teamInfo || !teamSize || wedoBalance === undefined || !teamL) {
      return null;
    }

    // Convert contract data to our Team interface
    const team: Team = {
      id: teamId,
      name: teamInfo[0] || `Team ${teamId}`,
      flag: "⚔️", // Default flag, could be stored in contract later
      rank: 1, // Will be calculated based on scores
      previousRank: 1,
      totalScore: Number(wedoBalance) / 10 ** 18, // Convert from wei
      remainingMembers: Number(teamSize),
      totalMembers: Number(teamInfo[1]) || Number(teamSize), // activeMemberCount
      leverage: Number(teamL) / 10 ** 18, // Convert from contract precision
      isUserTeam: false, // Will be set by parent hook
      dividendVault: {
        totalBalance: Number(wedoBalance) / 10 ** 18,
        userClaimable: 0, // Will be calculated per user
        lastDistribution: "N/A",
        totalDistributed: 0,
      },
      members: [], // Will be populated separately
      scoreHistory: [],
      activities: [],
    };

    return team;
  }, [teamId, teamInfo, teamSize, wedoBalance, teamL]);
}

// Hook to get all teams
export function useTeams() {
  const { address } = useAccount();
  const { data } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await apiClient.teams.$get();
      return res.json();
    },
  });
  const { data: userTeamId } = useReadTeamManagerAccountTeam({
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });
  const { data: nextTeamId } = useReadTeamManagerNextTeamId();

  const rankedTeams = useMemo(() => {
    if (!data) return [];
    return data.map((team) => {
      return {
        ...team,
        isUserTeam: Number(userTeamId) === team.id,
      };
    });
  }, [data, userTeamId]);

  return {
    teams: rankedTeams,
    isLoading: !nextTeamId,
    nextTeamId: Number(nextTeamId),
  };
}

// Hook to get user's pending rewards for a specific team
export function useUserPendingRewards(teamId: number) {
  const { address } = useAccount();

  const { data: pendingIdo } = useReadTeamEconomyPendingIdo({
    args: [
      BigInt(teamId),
      address ?? "0x0000000000000000000000000000000000000000",
    ],
  });

  return useMemo(() => {
    if (!pendingIdo) return 0;
    return Number(pendingIdo) / 10 ** 18; // Convert from wei
  }, [pendingIdo]);
}
