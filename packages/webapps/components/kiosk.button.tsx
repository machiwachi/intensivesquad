"use client";
import posthog from "posthog-js";
import { Button } from "@/components/retroui/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/retroui/Dialog";
import { apiClient } from "@/lib/api";
import { cn, getBlockchainExplorerUrl } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, ExternalLinkIcon, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
} from "wagmi";

export function KioskButton() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [txs, setTxs] = useState<`0x${string}`[]>([]);
  const [open, setOpen] = useState(false);

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
      queryClient.invalidateQueries({
        queryKey: ["readContract", { functionName: "teamWedoBalance" }],
      });
    }
  }, [isIdoSuccess, isWedoSuccess]);

  const handleClick = async () => {
    if (!address || !publicClient) {
      toast.error("请连接钱包");
      return;
    }

    posthog.capture("kiosk_credit_requested", {
      user_address: address,
      amount: 10,
    });

    setTxs([]);

    try {
      setIsLoading(true);
      const response = await apiClient.credit.$post({
        json: {
          amount: 10,
          account: address,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      posthog.capture("kiosk_credit_transactions_received", {
        user_address: address,
        ido_tx: data.idoTx,
        wedo_tx: data.wedoTx,
      });

      setTxs((prev) => [data.idoTx, data.wedoTx]);
    } catch (error) {
      console.error(error);
      toast.error("发放失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="icon" className="bg-white rounded-full">
          <Heart className="w-4 h-4 fill-red-500 stroke-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="flex items-center gap-2">
            给我一点点
            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-14"
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
              <Link href={getBlockchainExplorerUrl(txs[0])} target="_blank">
                <div className="flex gap-2 items-center">
                  <ExternalLinkIcon className="w-4 h-4" />
                  发放 IDO
                  {isIdoSuccess ? (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </div>
              </Link>
            )}
            {txs[1] && (
              <Link href={getBlockchainExplorerUrl(txs[1])} target="_blank">
                <div className="flex gap-2 items-center justify-between">
                  <ExternalLinkIcon className="w-4 h-4" />
                  发放 WEDO
                  {isWedoSuccess ? (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
