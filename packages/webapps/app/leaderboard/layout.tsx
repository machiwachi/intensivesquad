import { CreateButton } from "./create.button";
import { RankButton } from "./rank.button";
import { ConnectWalletButton } from "./connect-wallet.button";
import { Button } from "@/components/retroui/Button";
import { Text } from "@/components/retroui/Text";
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
                <Text as="h1">
                  残酷学分！
                </Text>
              </Link>
              <Link href="/leaderboard/kiosk">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <Heart className="w-4 h-4 fill-red-500 stroke-0" />
                </Button>
              </Link>
            </div>
            <p className="text-muted-foreground pixel-font">为了部落！⛺️</p>
          </div>

          <div className="flex items-center gap-4">
            <BalanceWidget />
            <RankButton />
            <CreateButton />

            <ConnectWalletButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
