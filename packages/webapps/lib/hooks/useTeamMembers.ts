"use client";

import { useMemo } from "react";
import { useReadTeamManagerMembers } from "../contracts/generated";

export interface TeamMember {
  address: string;
  id: number;
  name: string;
  avatar: string;
  status: "active" | "eliminated" | "cooldown";
  joinedAt: number;
  eliminatedAt: number;
  cooldownEndsAt: number;
}

// Member status enum from contract
const MEMBER_STATUS = {
  NONE: 0,
  ACTIVE: 1,
  ELIMINATED: 2,
  COOLDOWN: 3,
} as const;

// Mock avatars for members
const MEMBER_AVATARS = [
  "/pixel-warrior.png",
  "/pixel-mage.png",
  "/pixel-archer.png",
  "/pixel-knight.png",
  "/pixel-rogue.png",
  "/pixel-paladin.png",
];

// Hook to get a single team member's data
export function useTeamMember(teamId: number, memberAddress: string) {
  const { data: memberData } = useReadTeamManagerMembers({
    args: [BigInt(teamId), memberAddress as `0x${string}`],
  });

  return useMemo(() => {
    if (!memberData) return null;

    const [status, joinedAt, eliminatedAt, cooldownEndsAt] = memberData;

    // Convert status number to string
    const getStatusString = (statusNum: number): TeamMember["status"] => {
      switch (statusNum) {
        case MEMBER_STATUS.ACTIVE:
          return "active";
        case MEMBER_STATUS.ELIMINATED:
          return "eliminated";
        case MEMBER_STATUS.COOLDOWN:
          return "cooldown";
        default:
          return "eliminated";
      }
    };

    const member: TeamMember = {
      address: memberAddress,
      id: Math.abs(
        memberAddress
          .slice(-8)
          .split("")
          .reduce((a, b) => a + b.charCodeAt(0), 0)
      ), // Generate pseudo-ID from address
      name: `User ${memberAddress.slice(0, 6)}...${memberAddress.slice(-4)}`, // Default name format
      avatar:
        MEMBER_AVATARS[
          Math.abs(memberAddress.charCodeAt(2)) % MEMBER_AVATARS.length
        ], // Deterministic avatar
      status: getStatusString(Number(status)),
      joinedAt: Number(joinedAt),
      eliminatedAt: Number(eliminatedAt),
      cooldownEndsAt: Number(cooldownEndsAt),
    };

    return member;
  }, [memberData, memberAddress]);
}

// Hook to get all members for a team
// Note: Since we don't have a way to enumerate all members from the contract,
// this hook expects a list of member addresses to be provided
export function useTeamMembers(teamId: number, memberAddresses: string[] = []) {
  const memberResults = memberAddresses.map((address) =>
    useTeamMember(teamId, address)
  );

  return useMemo(() => {
    const validMembers = memberResults.filter(Boolean) as TeamMember[];

    // Sort by status and join time
    const sortedMembers = validMembers.sort((a, b) => {
      // Active members first
      if (a.status === "active" && b.status !== "active") return -1;
      if (b.status === "active" && a.status !== "active") return 1;

      // Then by join time (earlier first)
      return a.joinedAt - b.joinedAt;
    });

    return {
      members: sortedMembers,
      activeCount: sortedMembers.filter((m) => m.status === "active").length,
      eliminatedCount: sortedMembers.filter((m) => m.status === "eliminated")
        .length,
      cooldownCount: sortedMembers.filter((m) => m.status === "cooldown")
        .length,
      totalCount: sortedMembers.length,
    };
  }, [memberResults]);
}

// Hook to check if a user is a member of a team
export function useIsTeamMember(teamId: number, userAddress?: string) {
  const member = useTeamMember(teamId, userAddress || "");

  return useMemo(() => {
    return member && member.status !== "eliminated";
  }, [member]);
}
