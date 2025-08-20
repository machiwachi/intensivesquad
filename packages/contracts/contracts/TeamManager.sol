// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

interface ITeamEconomyHooks {
  function onJoin(uint256 teamId, address account) external;
  function onLeave(uint256 teamId, address account) external;
}

contract TeamManager is AccessControl {
  bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

  struct TeamMeta {
    uint256 n0; // 初始容量
    uint256 lMin; // 最小 L
    uint256 lMax; // 最大 L
    string flagURI;
    uint256 currentR; // 当前存活人数 R
  }

  struct MemberMeta {
    uint8 status; // 0 未加入, 1 已加入, 2 淘汰/离队
    uint64 joinedAt;
    uint64 eliminatedAt;
    uint64 cooldownEndsAt;
  }

  event TeamCreated(uint256 indexed teamId, uint256 n0, uint256 lMin, uint256 lMax, string flagURI);
  event MemberJoined(uint256 indexed teamId, address indexed account);
  event MemberEliminated(uint256 indexed teamId, address indexed account);
  event MemberLeft(uint256 indexed teamId, address indexed account);

  mapping(uint256 => TeamMeta) public teams;
  mapping(uint256 => mapping(address => MemberMeta)) public members;
  mapping(address => uint256) public accountTeam; // 0 表示未加入

  ITeamEconomyHooks public economy;

  event EconomySet(address indexed economy);

  constructor(address admin) {
    _grantRole(ADMIN_ROLE, admin);
  }

  function setEconomy(address economy_) external onlyRole(ADMIN_ROLE) {
    economy = ITeamEconomyHooks(economy_);
    emit EconomySet(economy_);
  }

  function createTeam(
    uint256 teamId,
    uint256 n0,
    uint256 lMin,
    uint256 lMax,
    string calldata flagURI
  ) external onlyRole(ADMIN_ROLE) {
    require(teams[teamId].n0 == 0, "team exists");
    require(lMin <= lMax, "lMin>lMax");
    teams[teamId] = TeamMeta({n0: n0, lMin: lMin, lMax: lMax, flagURI: flagURI, currentR: 0});
    emit TeamCreated(teamId, n0, lMin, lMax, flagURI);
  }

  function join(uint256 teamId) external {
    require(accountTeam[msg.sender] == 0, "already in team");
    TeamMeta storage t = teams[teamId];
    require(t.n0 != 0, "team not exist");
    MemberMeta storage m = members[teamId][msg.sender];
    require(m.status == 0 || (m.status == 2 && block.timestamp >= m.cooldownEndsAt), "cooldown");
    m.status = 1;
    m.joinedAt = uint64(block.timestamp);
    m.eliminatedAt = 0;
    accountTeam[msg.sender] = teamId;
    t.currentR += 1;
    emit MemberJoined(teamId, msg.sender);
    if (address(economy) != address(0)) {
      economy.onJoin(teamId, msg.sender);
    }
  }

  function eliminate(uint256 teamId, address account, uint64 cooldownSeconds) external onlyRole(ADMIN_ROLE) {
    require(accountTeam[account] == teamId, "not member");
    TeamMeta storage t = teams[teamId];
    MemberMeta storage m = members[teamId][account];
    require(m.status == 1, "not active");
    m.status = 2;
    m.eliminatedAt = uint64(block.timestamp);
    m.cooldownEndsAt = uint64(uint64(block.timestamp) + cooldownSeconds);
    accountTeam[account] = 0;
    t.currentR -= 1;
    emit MemberEliminated(teamId, account);
    if (address(economy) != address(0)) {
      economy.onLeave(teamId, account);
    }
  }

  function leave(uint256 cooldownSeconds) external {
    uint256 teamId = accountTeam[msg.sender];
    require(teamId != 0, "not in team");
    TeamMeta storage t = teams[teamId];
    MemberMeta storage m = members[teamId][msg.sender];
    require(m.status == 1, "not active");
    m.status = 2;
    m.eliminatedAt = uint64(block.timestamp);
    m.cooldownEndsAt = uint64(uint64(block.timestamp) + cooldownSeconds);
    accountTeam[msg.sender] = 0;
    t.currentR -= 1;
    emit MemberLeft(teamId, msg.sender);
    if (address(economy) != address(0)) {
      economy.onLeave(teamId, msg.sender);
    }
  }
}


