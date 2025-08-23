import BalanceWidget from "@/components/balance.widget";
import { ConnectButton } from "@/components/connect.button";
import { KioskButton } from "@/components/kiosk.button";
import { Button } from "@/components/retroui/Button";
import Image from "next/image";
import Link from "next/link";
import { GiGreekTemple, GiWarAxe } from "react-icons/gi";
import Header from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 gap-2">
      {/* Header */}
      <Header />
      {children}
    </div>
  );
}
