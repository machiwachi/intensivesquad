"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import {
  useReadTeamManagerNextTeamId,
  useReadTeamManagerTeams,
  useReadTeamManagerGetTeamSize,
  useReadTeamManagerAccountTeam,
  useReadTeamEconomyTeamWedoBalance,
  useReadTeamEconomyGetTeamL,
} from "../contracts/generated";

export interface Team {
  id: number;
  name: string;
  flag: string;
  rank: number;
  previousRank: number;
  totalScore: number;
  remainingMembers: number;
  totalMembers: number;
  leverage: number;
  isUserTeam: boolean;
  dividendVault: {
    totalBalance: number;
    userClaimable: number;
    lastDistribution: string;
    totalDistributed: number;
  };
  members: any[];
  scoreHistory: number[];
  activities: any[];
}

// Simplified hook that fetches mock data with real contract calls for existing teams
export function useTeams() {
  const { address } = useAccount();

  const { data: userTeamId } = useReadTeamManagerAccountTeam({
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  // Try to fetch data for team 1 (if it exists)
  const { data: team1Info } = useReadTeamManagerTeams({ args: [BigInt(1)] });
  const { data: team1Size } = useReadTeamManagerGetTeamSize({
    args: [BigInt(1)],
  });
  const { data: team1WedoBalance } = useReadTeamEconomyTeamWedoBalance({
    args: [BigInt(1)],
  });
  const { data: team1L } = useReadTeamEconomyGetTeamL({ args: [BigInt(1)] });

  const teams = useMemo(() => {
    const mockTeams: Team[] = [
      {
        id: 1,
        name: team1Info?.[0] || "Code Crusaders",
        flag: "⚔️",
        rank: 1,
        previousRank: 2,
        totalScore: team1WedoBalance
          ? Number(team1WedoBalance) / 10 ** 18
          : 15420,
        remainingMembers: team1Size ? Number(team1Size) : 5,
        totalMembers: team1Info?.[1] ? Number(team1Info[1]) : 6,
        leverage: team1L ? Number(team1L) / 10 ** 18 : 2.4,
        isUserTeam: userTeamId ? Number(userTeamId) === 1 : true,
        dividendVault: {
          totalBalance: team1WedoBalance
            ? Number(team1WedoBalance) / 10 ** 18
            : 2450.75,
          userClaimable: 408.46,
          lastDistribution: "2 days ago",
          totalDistributed: 12340.5,
        },
        members: [
          {
            id: 1,
            name: "Alex",
            avatar: "/pixel-warrior.png",
            status: "active",
          },
          { id: 2, name: "Sam", avatar: "/pixel-mage.png", status: "active" },
          {
            id: 3,
            name: "Jordan",
            avatar: "/pixel-archer.png",
            status: "active",
          },
          {
            id: 4,
            name: "Casey",
            avatar: "/pixel-knight.png",
            status: "active",
          },
          {
            id: 5,
            name: "Riley",
            avatar: "/pixel-rogue.png",
            status: "active",
          },
          {
            id: 6,
            name: "Morgan",
            avatar: "/pixel-paladin.png",
            status: "eliminated",
          },
        ],
        scoreHistory: [12000, 13500, 14200, 15420],
        activities: [
          {
            user: "Alex",
            action: "Completed Math Quiz",
            points: 150,
            time: "2 hours ago",
          },
          {
            user: "Sam",
            action: "Study Session",
            points: 200,
            time: "4 hours ago",
          },
          {
            user: "Jordan",
            action: "Flashcard Review",
            points: 100,
            time: "6 hours ago",
          },
        ],
      },
      {
        id: 2,
        name: "Study Spartans",
        flag: "🛡️",
        rank: 2,
        previousRank: 1,
        totalScore: 14890,
        remainingMembers: 4,
        totalMembers: 6,
        leverage: 2.2,
        isUserTeam: userTeamId ? Number(userTeamId) === 2 : false,
        dividendVault: {
          totalBalance: 1980.25,
          userClaimable: 0,
          lastDistribution: "1 day ago",
          totalDistributed: 9870.3,
        },
        members: [
          {
            id: 7,
            name: "Taylor",
            avatar: "/placeholder-4jpab.png",
            status: "active",
          },
          {
            id: 8,
            name: "Blake",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "active",
          },
          {
            id: 9,
            name: "Avery",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "active",
          },
          {
            id: 10,
            name: "Quinn",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "active",
          },
          {
            id: 11,
            name: "Sage",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "eliminated",
          },
          {
            id: 12,
            name: "River",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "eliminated",
          },
        ],
        scoreHistory: [11500, 12800, 13900, 14890],
        activities: [
          {
            user: "Taylor",
            action: "Project Submission",
            points: 250,
            time: "1 hour ago",
          },
          {
            user: "Blake",
            action: "Peer Review",
            points: 75,
            time: "3 hours ago",
          },
          {
            user: "Avery",
            action: "Weekly Challenge",
            points: 180,
            time: "5 hours ago",
          },
        ],
      },
      {
        id: 3,
        name: "Learning Legion",
        flag: "🏆",
        rank: 3,
        previousRank: 3,
        totalScore: 13560,
        remainingMembers: 6,
        totalMembers: 6,
        leverage: 2.8,
        isUserTeam: userTeamId ? Number(userTeamId) === 3 : false,
        dividendVault: {
          totalBalance: 2890.5,
          userClaimable: 0,
          lastDistribution: "3 days ago",
          totalDistributed: 15670.8,
        },
        members: [
          {
            id: 13,
            name: "Phoenix",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "active",
          },
          {
            id: 14,
            name: "Ember",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "active",
          },
          {
            id: 15,
            name: "Nova",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "active",
          },
          {
            id: 16,
            name: "Zara",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "active",
          },
          {
            id: 17,
            name: "Kai",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "active",
          },
          {
            id: 18,
            name: "Luna",
            avatar: "/placeholder.svg?height=32&width=32",
            status: "active",
          },
        ],
        scoreHistory: [10200, 11800, 12700, 13560],
        activities: [
          {
            user: "Phoenix",
            action: "Research Paper",
            points: 300,
            time: "30 minutes ago",
          },
          {
            user: "Ember",
            action: "Group Discussion",
            points: 50,
            time: "2 hours ago",
          },
          {
            user: "Nova",
            action: "Code Review",
            points: 120,
            time: "4 hours ago",
          },
        ],
      },
    ];

    return mockTeams;
  }, [team1Info, team1Size, team1WedoBalance, team1L, userTeamId]);

  return {
    teams,
    userTeamId: userTeamId ? Number(userTeamId) : null,
    isLoading: false,
  };
}
