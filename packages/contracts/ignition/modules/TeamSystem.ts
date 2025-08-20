import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TeamSystem = buildModule("TeamSystem", (m) => {
  const admin = m.getAccount(0);

  const ido = m.contract("IDOToken", ["IDO Token", "IDO", admin]);
  const wedo = m.contract("WEDOToken", ["WEDO Token", "WEDO", admin]);
  const manager = m.contract("TeamManager", [admin]);
  const economy = m.contract("TeamEconomy", [
    ido,
    wedo,
    manager,
    m.getParameter("initialS", 10n ** 18n),
    m.getParameter("sDelay", 0n),
    admin,
  ]);

  m.call(manager, "setEconomy", [economy]);

  return { ido, wedo, manager, economy };
});

export default TeamSystem;
