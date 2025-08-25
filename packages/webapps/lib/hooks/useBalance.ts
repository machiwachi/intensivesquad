"use client";

import { useBalance } from "wagmi";
import { formatEther } from "viem";

/**
 * Hook to get formatted ETH balance for a wallet address
 */
export function useETHBalance(address?: `0x${string}`) {
  const {
    data: balance,
    isLoading,
    error,
  } = useBalance({
    address,
    query: {
      enabled: !!address,
      refetchInterval: 10000, // 每10秒刷新一次
    },
  });

  const formattedBalance = balance
    ? parseFloat(formatEther(balance.value)).toFixed(4)
    : "0.0000";

  return {
    balance: formattedBalance,
    isLoading,
    error,
    raw: balance,
  };
}
