"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BarChart3 } from "lucide-react";
import { useState } from "react";
import { ClanRankingsChart } from "./clan-rankings-chart";
import { UserRankingsChart } from "./user-rankings-chart";

export const RankButton = () => {
  const [showRankings, setShowRankings] = useState(false);
  return (
    <>
      <Button
        onClick={() => setShowRankings(true)}
        variant="outline"
        className="  flex items-center gap-2"
      >
        <BarChart3 className="w-4 h-4" />
        排行榜
      </Button>
      <Dialog open={showRankings} onOpenChange={setShowRankings}>
        <DialogContent className="max-w-4xl sm:max-w-6xl  max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className=" text-2xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              排行榜
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserRankingsChart />
            <ClanRankingsChart />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
