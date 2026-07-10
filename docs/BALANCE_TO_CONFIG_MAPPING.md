# 数值表到配置接入清单

更新时间：2026-06-26

角色：产品 / 玩法

状态：review

## 目标

把 `docs/BALANCE_TABLE_V1.md` 的 V1 数值接到现有配置，供 `D-002` 小步实现。

只接前 7 天垂直切片需要的数值，不做长期经济模型。

## 映射表

| 数值类别 | 来源 | 建议落点 | 当前状态 | D-002 做法 |
| --- | --- | --- | --- | --- |
| 商品售价、成本、解锁价 | `BALANCE_TABLE_V1.md` 商品数值 | `assets/scripts/data/EconomyConfig.ts` | 已有商品经济配置 | 替换为 V1 可跑值 |
| 商品显示名、分类 | 商品数值备注 | `assets/scripts/data/ProductCatalog.ts` | 已有商品目录 | 只核对布丁 V1 不加工 |
| 初始库存、每日建议库存 | 货架与初始库存 | `assets/scripts/data/VerticalSliceConfig.ts` | 可能已有垂直切片配置 | 先做 Day 1/3/7 脚本库存 |
| 货架容量、补货时间、仓库容量 | 货架与初始库存 | `EconomyConfig.ts` | 已有升级相关 helper | 改 `getStockCap()`、`getRestockSeconds()`、仓库容量表 |
| Day 1-7 达标/优秀目标 | 前 7 天目标 | `VerticalSliceConfig.ts` | 需要按天读取 | 加 day target 表，先供结算和 QA 使用 |
| 顾客耐心 | 顾客耐心 | `VerticalSliceConfig.ts` | 已有顾客生成逻辑 | 加按 day/kind 的耐心表 |
| Day 1/3/7 订单权重 | 订单权重 | `VerticalSliceConfig.ts` 或 `OrderGenerator.ts` | 当前生成逻辑需核对 | 先只接 Day 1/3/7，其他天沿用邻近配置 |
| 热食加工奖励、微波炉时长 | 热食与微波炉 | `ProcessingConfig.ts` + `EconomyConfig.ts` | 已有 processing 配置 | 时长按微波炉等级，奖励保留在经济配置 |
| 微波炉升级价 | 热食与微波炉 | `EconomyConfig.ts` | 已有升级价 | 替换 Lv.1/2/3 为 60/120/220 |
| 货架升级价 | 升级价格 V1 | `EconomyConfig.ts` | 已有升级价 | 替换 Lv.2/3 为 90/170 |
| 店铺升级价 / 仓库容量 | 升级价格 V1 | `EconomyConfig.ts` | 已有 store level | 替换 Lv.2/3 为 140/240，仓库 24/36/48 |
| 经营策略 | 经营策略 | `EconomyConfig.ts` | 已有策略名和规则 | 对齐推广、优质服务、延长营业的 V1 数值 |
| 经营资金结算 | `PRODUCT_DECISIONS_V1.md` 决策 4 | `MonsterStorePrototype.ts:settleShift()` | 采购时已扣成本，结算加营业额 | P0 保持现金流口径，不改成 `wallet += netProfit`，避免重复扣成本 |

## 缺字段

| 缺口 | 最小处理 |
| --- | --- |
| 按天目标表 | 新增 `DAY_TARGETS`，包含达标/优秀单数和营业额 |
| 按天顾客耐心表 | 新增 `DAY_CUSTOMER_PATIENCE`，按 day + kind 取值 |
| Day 1/3/7 订单权重 | 新增 `DAY_ORDER_WEIGHTS`，先覆盖 1/3/7 |
| 热食订单不连续限制 | 先在订单生成器加简单计数，不做复杂 director |
| 前 7 天最多 2 件订单 | 订单生成器硬限制，店铺 Lv.3 也不开放 3 件 |
| HUD 第三位语义 | final HUD 资源按“服务星级 / 连击质量”做；当前满意度百分比只作临时显示 |
| 商品卡状态优先级 | 当前需要、热食、库存、售罄 / 补货 / 未解锁分开表达；星星不表示当前需要 |

## 暂不接

- 30 天经济。
- 通胀、贷款、广告、IAP、离线收益。
- 3 件订单、三顾客、多微波炉、多备餐位。
- 布丁加工规则。
- 精确需求预测。
- 为下一位顾客提前备餐的独立队列。

## D-002 最小顺序

1. 改 `EconomyConfig.ts`：商品经济、升级价格、货架/仓库/补货、策略数值。
2. 改 `ProcessingConfig.ts`：微波炉等级时长和饭团加工奖励口径。
3. 改 `VerticalSliceConfig.ts`：Day 1/3/7 库存、目标、顾客耐心、订单权重。
4. 核对 `OrderGenerator.ts`：只接 Day 1/3/7 权重，保留最多 2 件订单。
5. 核对 `settleShift()`：采购已扣成本时，结算继续加营业额；不要改为结算加净利润。
6. 跑一遍 TypeScript 检查；若仍只剩既有 `ProcessingConfig.ts:32`，再单独修这个类型问题。
7. 用 `docs/LOCAL_ACCEPTANCE_CHECKLIST.md` 走 Day 1 / Day 3 / Day 7 冒烟。

## 验收

- Day 1 不生成热食、急客、售罄惩罚。
- Day 3 能稳定出现首个热饭团订单。
- Day 7 仍最多 2 顾客、最多 2 件订单。
- 解锁价允许玩家在前 7 天买到饭团、微波炉、布丁、星星糖果。
- 调数值主要改配置，不改表现逻辑。
- 经营资金现金流不重复扣成本：采购扣款，结算加营业额，净利润用于复盘和长期指标。
