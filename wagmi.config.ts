import { defineConfig } from "@wagmi/cli";
import { erc20Abi } from "viem";
import { hardhat, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "packages/webapps/lib/contracts/generated.ts",
  plugins: [
    react(),
    hardhat({
      // include: ["TeamEconomy.sol/*.json"],
      artifacts: "ignition/deployments/chain-31337/artifacts",
      project: "./packages/contracts",
      deployments: {
        // IDOToken: "0x0000000000000000000000000000000000000000",
        // WEDOToken: "0x0000000000000000000000000000000000000000",
        IDOToken: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
        TeamManager: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
        WEDOToken: "0x9A676e781A523b5d0C0e43731313A708CB607508",
        TeamEconomy: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
      },
    }),
  ],
});
