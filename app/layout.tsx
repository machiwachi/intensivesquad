import type React from "react";
import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Providers } from "@/components/providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Clans Leaderboard - Study Warriors",
  description: "Gamified study app clan rankings and member status",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${orbitron.variable} antialiased`} suppressHydrationWarning>
      <body className="scanlines">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
