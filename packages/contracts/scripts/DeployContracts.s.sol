// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/IDOToken.sol";
import "../contracts/WEDOToken.sol";
import "../contracts/TeamManager.sol";
import "../contracts/TeamEconomy.sol" as Econ;

contract DeployContracts is Script {
    address public deployer;
    address public multisig = 0x1234567890123456789012345678901234567890;
    address public distributor = 0x0987654321098765432109876543210987654321;

    function run() external {
        deployer = msg.sender;
        
        vm.startBroadcast(deployer);
        
        // 1. 部署代币合约
        IDOToken ido = new IDOToken();
        require(address(ido) != address(0), "IDOToken deployment failed");
        
        WEDOToken wedo = new WEDOToken();
        require(address(wedo) != address(0), "WEDOToken deployment failed");
        
        // 2. 部署团队管理合约
        TeamManager teamManager = new TeamManager();
        require(address(teamManager) != address(0), "TeamManager deployment failed");
        
        // 3. 部署经济合约 - 显式指定参数名称
        Econ.TeamEconomy teamEconomy = new Econ.TeamEconomy({
            idoToken: address(ido),
            wedoToken: address(wedo),
            teamManagerContract: address(teamManager)
        });
        require(address(teamEconomy) != address(0), "TeamEconomy deployment failed");
        
        // 4. 设置权限
        // 为TeamEconomy授予IDO的铸造权限
        bytes32 idoMinterRole = ido.MINTER_ROLE();
        ido.grantRole(idoMinterRole, address(teamEconomy));
        
        // 为记账服务授予WEDO的铸造权限
        bytes32 wedoMinterRole = wedo.MINTER_ROLE();
        wedo.grantRole(wedoMinterRole, distributor);
        
        // 转移管理员权限到多签
        bytes32 defaultAdminRole = 0x00; // DEFAULT_ADMIN_ROLE的标准值
        
        // 转移IDO的管理员权限
        ido.grantRole(defaultAdminRole, multisig);
        ido.revokeRole(defaultAdminRole, deployer);
        
        // 转移WEDO的管理员权限
        wedo.grantRole(defaultAdminRole, multisig);
        wedo.revokeRole(defaultAdminRole, deployer);
        
        // 转移TeamManager的管理员权限
        teamManager.grantRole(defaultAdminRole, multisig);
        teamManager.revokeRole(defaultAdminRole, deployer);
        
        // 转移TeamEconomy的管理员权限
        teamEconomy.grantRole(defaultAdminRole, multisig);
        teamEconomy.revokeRole(defaultAdminRole, deployer);
        
        vm.stopBroadcast();
        
        // 输出部署地址
        console.log("IDOToken deployed to:", address(ido));
        console.log("WEDOToken deployed to:", address(wedo));
        console.log("TeamManager deployed to:", address(teamManager));
        console.log("TeamEconomy deployed to:", address(teamEconomy));
    }
}
    