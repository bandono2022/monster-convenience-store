# D-004 编辑器验收报告

更新时间：2026-06-26

角色：开发 / 测试

状态：review / partial

## 结论

D-004 / D-005 本轮完成了命令级检查、资源/manifest 检查和代码静态路径验收；未完成 Cocos Creator 手点，所以不能判定为编辑器通过。

当前未发现 READY 订单气泡交付、热食微波炉回填、收银反馈三条主路径的明显代码断线。下一步仍是用户在 Cocos 编辑器内按本文“用户手动验收步骤”勾选。

## 已执行

- [x] `git diff --check -- assets/scripts/presentation/MonsterStorePrototype.ts docs/D004_EDITOR_QA_REPORT.md docs/LOCAL_TASK_BOARD.md docs/LOCAL_ACCEPTANCE_CHECKLIST.md`
  - 结果：通过。
- [x] Cocos 自带 TypeScript 检查：
  - 命令：`node /Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/app.asar.unpacked/node_modules/typescript/lib/tsc.js --noEmit --pretty false --skipLibCheck --lib ES2017,DOM`
  - 结果：通过，无输出。
  - 判定：`assets/scripts/data/ProcessingConfig.ts:32` 已不再阻塞当前可用 TypeScript 检查。
- [x] 资源/manifest 检查：
  - `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png` 存在。
  - `assets/ui/derived/gameplay-v2/manifest.json` 当时可解析；该参考切片目录现已归档到 `archive/art-legacy-2026-06-27/assets/ui/derived/gameplay-v2/`。
  - manifest 内引用缺失数：0。
- [x] 静态阅读 D-004 代码路径：
  - `getOrderBubbleVisualState()` / `getOrderItemVisualState()` 覆盖 `missing / partial / ready / done / error`。
  - `isOrderBubbleReadyFor()` 仍用内部 `TrayState` 判断同一顾客订单备齐。
  - `handleOrderBubbleTap()` 未 READY 时提示缺失并抖动订单气泡。
  - `attemptDeliverPreparedOrder()` READY 时把准备项并入 `customer.served`，再走 `checkCompletionForIndex()`。
  - `finishCustomerOrder()` 负责收入、`paymentBurst`、顾客开心和收银/HUD反馈。
- [x] D-005 一行修复：
  - `assets/scripts/presentation/MonsterStorePrototype.ts` 营业中 HUD 主数值从 `economy.wallet` 改为本轮 `revenue`。
  - 原因：`docs/PRODUCT_DECISIONS_V1.md` 已确认营业中 HUD 主数值应显示 `currentShiftRevenue`。

## 静态验收结果

| 路径 | 静态结果 | 依据 |
| --- | --- | --- |
| READY 气泡点击交付 | 未见明显断线 | READY 状态走 `handleOrderBubbleTap()` -> `attemptDeliverPreparedOrder()` -> `checkCompletionForIndex()` |
| 普通商品进入订单气泡，不直接收钱 | 未见明显断线 | 普通商品走 `addTrayItem()`，只在 READY 交付后进入 `finishCustomerOrder()` |
| 热食进入微波炉，完成后回所属气泡 | 未见明显断线 | 热食先设置 `microwave.customerId/productId`；点击 ready 微波炉时校验当前顾客，再 `addTrayItem()` |
| 热食不能混给 B 顾客 | 未见明显断线 | `handleMicrowaveTap()` 要求 `this.microwave.customerId === customer.id` |
| 未 READY 点击不交付且提示缺失 | 未见明显断线 | `handleOrderBubbleTap()` / `attemptDeliverPreparedOrder()` 未 READY 分支只提示并 `return false` |
| 错误商品反馈 | 未见明显断线 | 错误商品扣耐心、清 combo、`setErrorFx(..., 'both')`、顾客 angry |
| 售罄反馈 | 未见明显断线 | `handleSoldOut()` 区分当前订单是否需要，必要时走不可完成结算 |
| 补货中反馈 | 未见明显断线 | `restocking.has(productId)` 时提示补货中并返回 |
| 收银入账和 HUD 数字反馈 | 静态路径已对齐；仍需手点确认 | `finishCustomerOrder()` 增加 `revenue` 和 `paymentBurst`；营业中 HUD 主数值已显示本轮 `revenue`，收银台也显示 `revenue` |
| 托盘降级 | 未见明显断线 | `renderTrayContents()` 只显示“备餐台”，不绑定点击交付 |

## 未执行

- [ ] 未在 Cocos Creator 3.8.8 中完成 `assets/scenes/Game.scene` 手点验收。
- [ ] 未实际手点 READY 订单气泡交付。
- [ ] 未实际手点普通商品进入订单气泡且不直接收钱。
- [ ] 未实际手点热食进入微波炉、完成后回到所属订单气泡。
- [ ] 未实际手点未 READY 气泡 / 顾客不交付路径。
- [ ] 未实际手点错误商品、售罄、补货中反馈。
- [ ] 未实际观察收银台入账和 HUD 本轮营业额数字变化。
- [ ] 未实际验证 390x844 遮挡和可点击性。
- [ ] 未跑 Day 1、Day 3、Day 7 冒烟路径。

## 编辑器手点优先级

1. Day 1：普通商品 -> 订单气泡 partial/READY -> 点击 READY 气泡 -> 顾客开心 -> 收银反馈 -> HUD 本轮营业额增加。
2. Day 1/3：未 READY 点击气泡和当前顾客，确认不收钱且提示缺失。
3. Day 3：热食 -> 微波炉 heating/ready -> 回填所属订单气泡 -> 交付。
4. 混单保护：A 顾客热食完成后切 B，点击微波炉不能给 B。
5. 错误路径：错误商品、售罄、补货中都不误完成订单。
6. 390x844：HUD、当前订单气泡、顾客脸、微波炉、商品卡不遮挡且可点击。
7. Day 7：至少完成一单含设备或多商品压力的订单，确认没有状态串单。

## 用户手动验收步骤

1. 用 Cocos Creator 3.8.8 打开项目 `/Users/ban/Documents/怪兽便利店`。
2. 打开并运行 `assets/scenes/Game.scene`。
3. Day 1：点击当前订单需要的普通商品，确认进入订单气泡而不是直接收钱。
4. Day 1：订单气泡 READY 后点击气泡，确认顾客开心、收银台营业额变化、出现 `+收入` 动效、HUD 本轮营业额增加。
5. Day 1：未 READY 时点击气泡或顾客，确认只提示缺失，不完成订单。
6. Day 3：做一单热饭团，确认商品先进入微波炉，ready 后点击微波炉回到所属顾客订单气泡。
7. Day 3：A 顾客热食完成后切 B 顾客，点击微波炉，确认不能错给 B。
8. 390x844：确认 HUD、订单气泡、顾客、微波炉、商品卡不遮挡且可点击。

## 阻塞与风险

- Cocos 编辑器未完成手点，D-004 不能进入 `done`。
- 营业内 HUD 口径已由产品确认：主数值显示本轮营业额 `currentShiftRevenue`；`wallet` 是可花金币，主要用于经营准备、升级和结算。本轮已做静态对齐，仍需编辑器手点确认显示效果。
- 390x844 只能靠编辑器/截图确认，静态代码无法证明不遮挡。

## 判定

QA-002 / D-005 维持 `review / partial`：报告已补齐命令检查和静态路径验收；真实编辑器手点仍未执行。
