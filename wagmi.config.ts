import { defineConfig } from "@wagmi/cli";
import { erc20Abi } from "viem";
import { react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "packages/webapps/lib/contracts/generated.ts",
  contracts: [
    {
      name: "IDOToken",
      address: "0x0000000000000000000000000000000000000000",
      abi: erc20Abi,
    },
    {
      name: "WEDOToken",
      address: "0x0000000000000000000000000000000000000000",
      abi: erc20Abi,
    },
  ],
  plugins: [react()],
});
