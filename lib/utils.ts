import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TokenType } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTokenAmount = (amount: number, token: TokenType) => {
  const formatted = (amount / Math.pow(10, token.decimals)).toFixed(2);
  return `${formatted} ${token.symbol}`;
};
