// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contracts/IDOToken.sol";

contract IDOTokenTest is Test {
    IDOToken public ido;
    address public admin = address(1);
    address public minter = address(2);
    address public user = address(3);

    // 假设IDOToken构造函数需要三个参数：名称、符号和初始供应
    // 根据实际合约定义调整参数
    function setUp() public {
        vm.prank(admin);
        // 传入构造函数所需的3个参数（根据实际合约定义修改参数值）
        ido = new IDOToken("IDO Token", "IDO", 0);
        
        vm.prank(admin);
        ido.grantRole(ido.MINTER_ROLE(), minter);
    }

    function testMint() public {
        uint256 amount = 100 ether;
        
        vm.prank(minter);
        ido.mint(user, amount);
        
        assertEq(ido.balanceOf(user), amount);
    }

    function testRevertNonMinterMint() public {
        vm.prank(user);
        vm.expectRevert();
        ido.mint(user, 100 ether);
    }

    function testRevertBurn() public {
        vm.prank(admin);
        ido.mint(user, 100 ether);
        
        vm.prank(user);
        vm.expectRevert("IDOToken: burning not allowed");
        ido.burn(50 ether);
    }
}
    