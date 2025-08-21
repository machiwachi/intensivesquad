"use client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { client } from "@/lib/hooks/useTeams";
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
} from "wagmi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUserTokenBalances } from "@/lib/hooks";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useWatchTeamEconomyTeamWithdrawEvent } from "@/lib/contracts";
import { useEffect } from "react";

const getBlockchainExplorerUrl = (hash: `0x${string}`) => {
  return `https://sepolia.etherscan.io/tx/${hash}`;
};

export default function Kiosk() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [txs, setTxs] = useState<`0x${string}`[]>([]);
  const { data: idoReceipt, isSuccess: isIdoSuccess } =
    useWaitForTransactionReceipt({
      hash: txs[0],
    });
  const { data: wedoReceipt, isSuccess: isWedoSuccess } =
    useWaitForTransactionReceipt({
      hash: txs[1],
    });

  useEffect(() => {
    if (isIdoSuccess && isWedoSuccess) {
      toast.success("发放成功");
      queryClient.invalidateQueries({
        queryKey: ["readContract", { functionName: "balanceOf" }],
      });
    }
  }, [isIdoSuccess, isWedoSuccess]);

  console.log(idoReceipt, wedoReceipt);

  const handleClick = async () => {
    if (!address || !publicClient) {
      toast.error("请连接钱包");
      return;
    }

    setTxs([]);

    try {
      setIsLoading(true);
      const response = await client.credit.$post({
        json: {
          amount: 10,
          account: address,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setTxs((prev) => [data.idoTx, data.wedoTx]);
    } catch (error) {
      console.error(error);
      toast.error("发放失败");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center py-48 gap-2">
      <div className="flex items-center gap-2">
        给我一点点
        <Button
          variant="outline"
          size="icon"
          className="pixel-border pixel-font rounded-full size-14"
          onClick={handleClick}
          disabled={isLoading}
        >
          <Heart
            className={cn(
              "size-10 fill-red-500 stroke-0",
              isLoading && "animate-ping animate-infinite"
            )}
          />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {txs[0] && (
          <div>
            IDO 上链{isIdoSuccess ? "成功" : "发送中"}:{" "}
            <a href={getBlockchainExplorerUrl(txs[0])} target="_blank">
              {txs[0]}
            </a>
          </div>
        )}
        {txs[1] && (
          <div>
            WEDO 上链{isWedoSuccess ? "成功" : "发送中"}:{" "}
            <a href={getBlockchainExplorerUrl(txs[1])} target="_blank">
              {txs[1]}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
