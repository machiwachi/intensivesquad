import { defineConfig } from "@wagmi/cli";
import { erc20Abi } from "viem";
import { hardhat, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "packages/webapps/lib/contracts/generated.ts",
  plugins: [
    react(),
    hardhat({
      // include: ["TeamEconomy.sol/*.json"],
      artifacts: "ignition/deployments/chain-11155111/artifacts",
      project: "./packages/contracts",
      deployments: {
        // IDOToken: "0x0000000000000000000000000000000000000000",
        // WEDOToken: "0x0000000000000000000000000000000000000000",
        IDOToken: "0xfa32948220D3F4E6401491cf88636a7E1e38F3cE",
        TeamManager: "0xb757719939fC8D21fbbe9bd24c91E1288F7f7018",
        WEDOToken: "0xD14DF4ff6B468410A43fDAFf959EE30d6e4f5E41",
        TeamEconomy: "0x7fC80105C7F1a0a55fceF85D78e1A306eBA9A81a",
      },
    }),
  ],
});
