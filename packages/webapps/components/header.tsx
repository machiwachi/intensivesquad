"use client";
import Link from "next/link";
import { ConnectButton } from "@/components/connect.button";
import { GiftIcon, Heart } from "lucide-react";
import Image from "next/image";
import BalanceWidget from "@/components/balance.widget";
import { RankButton } from "@/app/(main)/leaderboard/rank.button";
import { Button } from "@/components/retroui/Button";
import { GiGreekTemple, GiWarAxe } from "react-icons/gi";
import { KioskButton } from "./kiosk.button";
import { usePathname } from "next/navigation";

const config = {
  "/shrine": {
    title: "商店",
    description: "使用 WEDO 代币购买强化道具，提升团队实力",
  },
  "/leaderboard": {
    title: "战场",
    description: "为了部落，努力打卡！",
  },
  "/pool": {
    title: "IDO 奖池",
    description: "质押 ETH 参与活动，按持有的 IDO 比例分配奖池。",
  },
} as const;

export default function Header() {
  const pathname = usePathname() as keyof typeof config;
  const { title, description } = config[pathname] ?? {
    title: "部落排行榜",
    description: "游戏化学习应用的部落排名与成员状态",
  };

  return (
    <header className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/pixel-archer.png"
                  alt="logo"
                  width={60}
                  height={60}
                />
                <h1 className="text-4xl lg:text-5xl font-bold">{title}</h1>
              </Link>
              <KioskButton />
            </div>
            <p className="text-muted-foreground ">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <BalanceWidget />

          {pathname !== "/leaderboard" && (
            <Link href="/leaderboard">
              <Button variant="outline" className="gap-2 bg-white">
                <GiWarAxe className="w-4 h-4" />
                战场
              </Button>
            </Link>
          )}

          {pathname !== "/shrine" && (
            <Link href="/shrine">
              <Button variant="outline" className="gap-2 bg-white">
                <GiGreekTemple className="w-4 h-4" />
                商店
              </Button>
            </Link>
          )}

          {pathname !== "/pool" && (
            <Link href="/pool">
              <Button variant="outline" className="gap-2 bg-white">
                <GiftIcon className="w-4 h-4" />
                奖池
              </Button>
            </Link>
          )}

          <div className="">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
