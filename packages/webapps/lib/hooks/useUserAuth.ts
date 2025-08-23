"use client";

import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { useReadTeamManagerAccountTeam } from "../contracts/generated";

/**
 * Hook to check user authentication and team membership status
 */
export function useUserAuth() {
  const { data: session, status } = useSession();
  const { address, isConnected } = useAccount();

  // Get user's team ID
  const { data: userTeamId, isLoading: isLoadingTeamId } =
    useReadTeamManagerAccountTeam({
      args: [address ?? "0x0000000000000000000000000000000000000000"],
    });

  const isAuthenticated =
    status === "authenticated" && !!session?.user?.address;
  const isWalletConnected = isConnected && !!address;
  const hasTeam = !!userTeamId && Number(userTeamId) > 0;
  const isLoading = status === "loading" || isLoadingTeamId;

  return {
    // 认证状态
    isAuthenticated,
    isWalletConnected,

    // 团队状态
    hasTeam,
    userTeamId: userTeamId ? Number(userTeamId) : 0,

    // 用户信息
    user: session?.user,
    address,

    // 加载状态
    isLoading,

    // 组合状态检查
    canUseFaucet: isAuthenticated && hasTeam,
    needsLogin: !isAuthenticated,
    needsTeam: isAuthenticated && !hasTeam,
  };
}
