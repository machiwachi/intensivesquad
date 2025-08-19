import type React from "react";
import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Providers } from "@/components/providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} antialiased`}>
      <body className="scanlines">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
