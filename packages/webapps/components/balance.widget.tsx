"use client";

import { useUserTokenBalances } from "@/lib/hooks/useTeamEconomy";
import { formatTokenAmount } from "@/lib/utils";
import { IDO_TOKEN, WEDO_TOKEN } from "@/lib/constant";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BalanceWidget({
  className,
}: React.ComponentProps<"div">) {
  const {
    idoBalance,
    wedoBalance,
    isIdoBalanceLoading,
    isWedoBalanceLoading,
    isIdoBalanceRefetching,
    isWedoBalanceRefetching,
  } = useUserTokenBalances();

  return (
    <div
      className={cn("font-semibold flex flex-col place-items-end", className)}
    >
      <div className="flex items-center gap-2">
        个人余额{" "}
        {isIdoBalanceLoading ? (
          <Skeleton className="w-10 h-4" />
        ) : (
          <>
            {formatTokenAmount(idoBalance ?? 0, IDO_TOKEN)}

            {isIdoBalanceRefetching && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        小队余额{" "}
        {isWedoBalanceLoading ? (
          <Skeleton className="w-10 h-4" />
        ) : (
          <>
            {formatTokenAmount(wedoBalance ?? 0, WEDO_TOKEN)}
            {isWedoBalanceRefetching && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
