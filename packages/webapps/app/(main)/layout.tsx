"use client";

import Header from "@/components/header";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "min-h-screen bg-background p-4 lg:p-8 gap-2",
        pathname === "/leaderboard" &&
          "bg-[url('/bg-leaderboard.png')] bg-cover bg-center"
      )}
    >
      {/* Header */}
      <Header />
      {children}
    </div>
  );
}
