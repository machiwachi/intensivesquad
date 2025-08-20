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
        IDOToken: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
        TeamManager: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
        WEDOToken: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        TeamEconomy: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
      },
    }),
  ],
});
