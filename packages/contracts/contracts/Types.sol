// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library Types {
    // 成员状态枚举
    enum Status {
        Inactive,    // 未加入
        Active,      // 在籍
        Eliminated,  // 已淘汰
        Cooldown     // 冷却中
    }

    // 自定义错误
    error TeamExists();
    error TeamNotFound();
    error MemberAlreadyInTeam();
    error MemberNotInTeam();
    error TeamFull();
    error InvalidStatus();
    error CooldownActive();
    error NotAuthorized();
    error ZeroAddress();
    error ZeroValue();
    error InvalidDelay();
    error NotEffectiveYet();
    error NoMembersInTeam();
}
