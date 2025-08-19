"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { CreateClanDialog } from "./create-clan.dialog";

export const CreateButton = () => {
  const [showCreateClan, setShowCreateClan] = useState(false);
  const { isConnected: isWalletConnected } = useAccount();
  if (!isWalletConnected) return null;

  return (
    <>
      <Button
        onClick={() => setShowCreateClan(true)}
        variant="outline"
        className="pixel-border pixel-font flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        创建部落
      </Button>

      <CreateClanDialog
        open={showCreateClan}
        onOpenChange={setShowCreateClan}
      />
    </>
  );
};
