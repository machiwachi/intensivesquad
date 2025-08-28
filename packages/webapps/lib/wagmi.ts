import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, hardhat } from "wagmi/chains";
import { http } from "wagmi";

export const config = getDefaultConfig({
  appName: 'intensivesquad',
  projectId: 'temporary-test-project-id-12345', // 临时测试ID
  chains: [sepolia, hardhat],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
