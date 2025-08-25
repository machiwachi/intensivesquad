"use client";

import { useUserTokenBalances } from "@/lib/hooks/useTeamEconomy";
import { formatTokenAmount } from "@/lib/utils";
import { IDO_TOKEN, WEDO_TOKEN } from "@/lib/constant";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserAuth } from "@/lib/hooks/useUserAuth";

export default function BalanceWidget({
  className,
}: React.ComponentProps<"div">) {
  const { isAuthenticated } = useUserAuth();
  const {
    idoBalance,
    wedoBalance,
    isIdoBalanceLoading,
    isWedoBalanceLoading,
    isIdoBalanceRefetching,
    isWedoBalanceRefetching,
  } = useUserTokenBalances();

  // 未登录时不显示余额组件
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={cn(
        "min-w-[190px] font-semibold flex flex-col place-items-end",
        className
      )}
    >
      <div className="w-full flex items-center gap-2 justify-between">
        个人余额{" "}
        {isIdoBalanceLoading ? (
          <Skeleton className="w-10 h-4" />
        ) : (
          <div
            className={cn(
              "tabular-nums font-mono flex items-center gap-2",
              isIdoBalanceRefetching && "animate-pulse"
            )}
          >
            {isIdoBalanceRefetching && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {formatTokenAmount(idoBalance ?? 0, IDO_TOKEN, {
              styleSymbols: "w-7 self-center text-muted-foreground text-right",
            })}
          </div>
        )}
      </div>
      <div className="w-full flex items-center gap-2 justify-between">
        小队余额{" "}
        {isWedoBalanceLoading ? (
          <Skeleton className="w-10 h-4" />
        ) : (
          <div
            className={cn(
              "tabular-nums font-mono flex items-center gap-2",
              isWedoBalanceRefetching && "animate-pulse"
            )}
          >
            {isWedoBalanceRefetching && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {formatTokenAmount(wedoBalance ?? 0, WEDO_TOKEN, {
              styleSymbols: "self-center",
            })}
          </div>
        )}
      </div>
    </div>
  );
}
