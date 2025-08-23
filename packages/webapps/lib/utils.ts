import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TokenType } from "./typings";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTokenAmount = (
  amount: number | bigint,
  token: TokenType
) => {
  const formatted = (
    typeof amount === "bigint"
      ? Number(amount) / Math.pow(10, token.decimals)
      : amount
  ).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${token.symbol}`;
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getBlockchainExplorerUrl = (hash: `0x${string}`) => {
  return `https://sepolia.etherscan.io/tx/${hash}`;
};

// 根据函数签名实现：生成长度为 n 的数组，每个元素包含 name（日期字符串）和 userActiveCount（活跃用户数，模拟数据）
export const generateSeries = (
  n: number,
  startDate: Date
): {
  日期: string;
  活跃用户数: number;
}[] => {
  const result: { 日期: string; 活跃用户数: number }[] = [];
  let currentDate = new Date(startDate);
  let baseCount = 466;
  for (let i = 0; i < n; i++) {
    // 生成日期字符串，格式为 MM-DD
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const name = `${month}-${day}`;
    // 模拟活跃用户数，递减并带有一定随机性
    const userActiveCount = Math.max(
      66,
      Math.floor(baseCount - i * ((baseCount - 66) / n) - Math.random() * 10)
    );
    result.push({ 日期: name, 活跃用户数: userActiveCount });
    // 日期递增一天
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return result;
};
