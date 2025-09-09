// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Types.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract IDOToken is ERC20, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  constructor(string memory name_, string memory symbol_, address admin) ERC20(name_, symbol_) {
    _grantRole(DEFAULT_ADMIN_ROLE, admin);
  }

  // function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
  //   _mint(to, amount);
  // }


  //edit by @kafka
  // 仅MINTER_ROLE可铸造代币
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert Types.ZeroAddress();
        if (amount == 0) revert Types.ZeroValue();
        
        _mint(to, amount);
    }

    // 禁止燃烧（除特殊情况可添加）
    function burn(uint256 amount) external {
        revert("IDOToken: burning not allowed");
    }
}


