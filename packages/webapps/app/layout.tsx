import type React from "react";
import { Toaster } from "@/components/retroui/Sonner";
import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Providers } from "@/components/providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { Archivo_Black, Space_Grotesk } from "next/font/google";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "残酷小队 | IntensiveSquad",
  description:
    "为高强度共学社群打造游戏化链上激励系统，采用“个人贡献+团队荣誉”双代币机制与动态博弈设计，彻底解决团队协作中的动力不均与成员退出难题，实现团队与个人利益的深度绑定。",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${space.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="scanlines">
        <Providers session={session}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
