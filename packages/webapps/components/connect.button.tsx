"use client";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { usePostHog } from "@/lib/hooks/usePostHog";
import { POSTHOG_EVENTS } from "@/lib/posthog-constants";

export function ConnectButton() {
  const { track } = usePostHog();

  const handleConnectClick = () => {
    track(POSTHOG_EVENTS.CONNECT_WALLET_CLICKED);
  };

  return (
    <div onClick={handleConnectClick}>
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
