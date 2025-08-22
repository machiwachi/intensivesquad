import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CreateButton } from "./create.button";
import { RankButton } from "./rank.button";
import { Button } from "@/components/ui/button";
import { Plus, Heart } from "lucide-react";
import Link from "next/link";
import BalanceWidget from "./balance.widget";
export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 gap-2">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/leaderboard">
                <h1 className="text-4xl lg:text-5xl font-bold  text-primary mb-2">
                  残酷学分！
                </h1>
              </Link>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild
              >
                <Link href="/leaderboard/kiosk">
                  <Heart className="w-4 h-4 fill-red-500 stroke-0" />
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground ">为了部落！⛺️</p>
          </div>

          <div className="flex items-center gap-4">
            <BalanceWidget />
            <RankButton />
            <CreateButton />

            <div className="rounded-lg">
              <ConnectButton
                chainStatus="icon"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
