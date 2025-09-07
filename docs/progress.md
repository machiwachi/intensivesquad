### 项目进度（Progress）

此文档用于跟踪基于 `docs/tokenomics-v2.md` 的实施进展。采用里程碑 + 任务清单 + 周报的结构，作为唯一事实来源（SSOT）。

---

### 里程碑状态

- M0 需求冻结：已完成
- M1 合约骨架：已完成
- M2 经济逻辑：已完成
- M3 测试与安全：未开始
- M4 脚本与前端：进行中
- M5 试运行与上链：未开始

---

### 任务清单（看板）

#### 合约

- [x] `IDOToken`
- [x] `WEDOToken`
- [x] `TeamManager`
- [x] `TeamEconomy`（含 `S` 延迟生效）
- [ ] 单元/属性测试

#### 脚本/部署

- [ ] Ignition 模块
- [ ] 角色授予与样例数据

#### 前端

- [ ] 团队列表/详情/成员页
- [ ] `withdraw/claim` 交互
- [ ] 管理操作（受限显示）
- [x] Kiosk 按钮 UI 优化（2025-01-16）
  - [x] 统一 IDO/WEDO 按钮设计
  - [x] 水平布局排列优化
  - [x] 积分获取提示集成

#### 文档与运营

- [x] 参数与公式说明（对齐 `tokenomics-v2`）
- [ ] 运营流程与应急预案（Runbook）
- [ ] 事件订阅与指标（可选子图）
- [x] UI/UX 改进文档（2025-01-16）
  - [x] Kiosk 按钮更新文档 (`KIOSK_UI_UPDATE.md`)
- [x] `ACTIVITY_TRACKING.md` 更新 (最新日期)
- [x] `IDO_POOL_DESIGN.md` 更新 (最新日期)

---

### 关键指标（滚动记录）

- 覆盖率（目标 ≥90%）：N/A
- Gas 报告（主要路径对比基线）：N/A
- 关键事件审计（触发/字段完整性）：N/A

---

### 变更日志（Changelog）

- v0.1.2（2025-07-26）
  - 更新 `ACTIVITY_TRACKING.md` 以反映最新代码实现
  - 更新 `IDO_POOL_DESIGN.md` 以反映最新代码实现（移除 ETH 质押，聚焦 WEDO 转换 IDO）
- v0.1.1（2025-01-16）

  - 完成 Kiosk 按钮 UI 重构
  - 统一 IDO/WEDO 展示设计
  - 优化用户交互体验
  - 新增 `docs/KIOSK_UI_UPDATE.md` 详细文档

- v0.1.0（筹备中）
  - 新增 `docs/planning.md` 规划文档
  - 新增 `docs/progress.md` 进度文档

---

### 周报模板

- 周期：YYYY-WW
- 完成：
  - ...
- 进行中：
  - ...
- 下周计划：
  - ...
- 风险与阻塞：
  - ...
