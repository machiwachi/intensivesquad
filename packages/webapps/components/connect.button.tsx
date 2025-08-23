"use client";
import posthog from "posthog-js";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
export function ConnectButton() {
  return (
    <div onClick={() => posthog.capture('connect-wallet-clicked')}>
      <RainbowConnectButton
        chainStatus={{
          smallScreen: "none",
          largeScreen: "none",
        }}
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "avatar",
        }}
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
      />
    </div>
  );
}
