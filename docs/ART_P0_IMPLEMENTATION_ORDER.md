# P0 资源接入优先级

更新时间：2026-06-26

角色：美术 / UX（Goodall）

状态：review

目标：给开发一个硬排序。只服务“订单气泡 READY 交付”，不做大而全美术计划。

依据：

- `docs/UX_INFORMATION_HIERARCHY_V1.md`
- `docs/ART_TARGET_RESOURCE_BREAKDOWN.md`
- `docs/ART_P0_ASSET_BACKLOG.md`
- `archive/art-legacy-2026-06-27/assets/ui/derived/gameplay-v2/manifest.json`（已归档，只作参考）

## 硬排序

| 排名 | 资源组 | 先做原因 | 解决的可玩性问题 | 建议格式 |
| ---: | --- | --- | --- | --- |
| 1 | 订单气泡状态 | 当前订单气泡是备餐进度和交付入口 | 玩家知道缺什么、已放什么、能不能交付 | 气泡底板用 9-slice PNG；槽位可先程序绘制；商品 icon 和数量用动态节点 |
| 2 | READY badge | READY 是唯一交付确认信号 | 玩家知道现在该点订单气泡 / 当前顾客完成交付 | 透明 PNG 或 9-slice；READY 文案可先动态 Label；发光用程序 tween |
| 3 | 商品卡状态 | 玩家每秒都在点商品 | 玩家知道哪些该点、哪些热食、哪些售罄、点错在哪里 | 卡底 9-slice 或透明 PNG；库存动态 Label；角标透明 PNG；错误 / 售罄用程序遮罩 |
| 4 | 微波炉三态 | 热食流程如果不清楚，会破坏订单判断 | 玩家知道热食是否在加热、是否完成、是否可取 | idle/heating/ready 透明 PNG；进度条程序绘制；倒计时动态 Label |
| 5 | 收银反馈 | 交付成功后需要看到钱为什么增加 | 玩家把 READY 交付和收入增长联系起来 | 收银台可先复用；`+金币` 动态 Label；金币 / 闪光透明 PNG 或粒子 |
| 6 | HUD 基础面板 | 重要但不是当前点击入口 | 玩家持续看到钱、时间、暂停；不阻塞订单闭环 | 面板 9-slice PNG；金币/时钟/暂停透明 PNG；数字动态 Label |

不进入第一批：新顾客全套、完整店铺背景、底部导航、商品 icon 全量重画、Spine/DragonBones、高级粒子。

## 每项最小接入要求

### 1. 订单气泡状态

必须包含：

- `missing`：未填槽。
- `partial`：部分填完。
- `ready`：全部填完。
- `done`：刚交付。
- `error`：点错或未 READY 尝试交付。

为什么最先做：

- 订单气泡是当前玩法核心；没有它，玩家会继续以为有托盘或收银台交付。
- 多品订单的可读性取决于槽位状态，不取决于背景有多精致。

建议格式：

- `order_bubble_base_current_9slice.png`
- `order_bubble_base_waiting_9slice.png`
- `order_slot_empty` 可程序绘制。
- `order_slot_filled_overlay.png` 可透明 PNG。
- `order_slot_error_overlay` 可程序红闪。
- 商品图标、勾、数量用动态节点。

临时资源：

- `reference_slice_current_customer_ready_bubble.png` 只能做重绘参考，不能直接 QA 接入为正式节点。
- `reference_slice_waiting_customer_order_bubble.png` 只能做非当前气泡比例参考。

### 2. READY badge

必须包含：

- READY 胶囊。
- 点击提示箭头或呼吸光。
- pressed / delivered 后的短暂消失规则。

为什么第二：

- 订单气泡状态告诉玩家“完成了什么”，READY badge 告诉玩家“现在能交付”。
- READY 不能只靠小字，否则 390 宽下会错过交付入口。

建议格式：

- `order_ready_badge.png`：透明 PNG 或 9-slice。
- READY 文案：先动态 Label，后续可烘焙成图标字。
- `order_ready_glow`：程序描边 / tween 优先。
- `order_click_arrow.png`：透明 PNG，可后做。

临时资源：

- `reference_slice_ready_badge.png` 只做颜色、厚度、圆角参考，不能直接商用。

### 3. 商品卡状态

必须包含：

- normal。
- needed。
- heat-required。
- soldout。
- wrong/error。

为什么第三：

- 玩家点击来源在商品区；商品卡状态不清楚，订单气泡再清楚也会点错。
- 库存和热食角标必须能在 390 宽下读到。

建议格式：

- 卡底：9-slice PNG 或透明 PNG。
- 商品 icon：先复用现有透明商品，最终统一重画。
- 热食 / 需要角标：透明 PNG。
- 库存：动态 Label。
- soldout / wrong：程序遮罩 + icon，避免为每个商品出状态图。

临时资源：

- 可 QA 暂用：`placeholder_product_card_onigiri_heat.png`
- 可 QA 暂用：`placeholder_product_card_snack_needed.png`
- 可 QA 暂用：`placeholder_product_card_drink_needed.png`
- 可 QA 暂用：`placeholder_product_card_pudding.png`
- 可 QA 暂用：`placeholder_product_card_chocolate_milk.png`
- 可 QA 暂用：`placeholder_product_card_candy.png`

限制：

- 这些 placeholder 烘焙了商品、库存和状态，只能用于布局 / 交互 QA，不能作为最终商用资源。

### 4. 微波炉三态

必须包含：

- idle：空闲。
- heating：加热中。
- ready：完成可取。

为什么第四：

- 热食路径是唯一中间流程；不清楚会让玩家误以为热食已经进订单。
- 微波炉只有 heating/ready 时升层，idle 不抢订单和商品区。

建议格式：

- `microwave_idle.png`：透明 PNG。
- `microwave_heating.png`：透明 PNG，可叠加炉内光。
- `microwave_ready.png`：透明 PNG，可叠加勾 / 蒸汽。
- 进度条：程序绘制。
- 倒计时：动态 Label。

临时资源：

- `reference_slice_microwave_workstation.png` 可用于整区视觉对齐或原型占位。
- 不能直接商用；里面包含背景、柜台和烘焙数字。

### 5. 收银反馈

必须包含：

- 交付成功后 `+金币`。
- 金币飞向 HUD 或 HUD 金币数字 bump。
- 收银台反馈自动回 idle。

为什么第五：

- 收银台不是备餐入口，只是结果反馈；做早了会误导交付位置。
- 但付款反馈必须存在，否则玩家不理解收入变化。

建议格式：

- 收银机常态：可先复用现有资源。
- `+金币`：动态 Label。
- 金币 / 闪光：透明 PNG 或 Cocos 粒子。
- 屏幕底板：9-slice 或程序绘制。

临时资源：

- `reference_slice_cash_register_payment.png` 可用于付款动效位置参考。
- 不能直接商用；它是整区截图，包含背景和静态数字。

### 6. HUD 基础面板

必须包含：

- 金币 / 营业额。
- 倒计时。
- 暂停。

可后做：

- 连击 / 星级精细面板。
- 复杂进度条和星星装饰。

为什么第六：

- HUD 是常驻保护区，但当前交互闭环先看订单和商品。
- 先保证数字可读即可，不需要第一批做完商业化质感。

建议格式：

- 面板：9-slice PNG。
- 金币、时钟、暂停：透明 PNG。
- 数字：动态 Label。
- 时间条：程序绘制或 9-slice 条。

临时资源：

- `reference_slice_hud_top.png`、`reference_slice_hud_coin_panel.png`、`reference_slice_hud_timer_panel.png` 只做比例和风格参考。
- `reference_slice_pause_button.png` 可短期做按钮尺寸占位，但不能商用。

## 开发接入顺序

1. 接订单气泡 `missing / partial / ready / done / error`。
2. 接 READY badge 和点击反馈。
3. 接商品卡 `needed / heat-required / soldout / wrong`。
4. 接微波炉 `idle / heating / ready`。
5. 接收银 `+金币`、金币飞行或 HUD 数字 bump。
6. 接 HUD 基础面板和图标替换。

验收只看两档尺寸：

- `390 x 844`：订单槽、READY、商品库存、微波炉状态、金币/时间不能被挡。
- `750 x 1334`：目标图分区成立，反馈不穿过 READY 中心或商品库存数字。

## 绝对不能直接商用

- 任何 `reference_slice_*`。
- 任何 `placeholder_product_card_*`。
- 整张目标图。
- 整区截图作为正式背景。
- 烘焙了库存、倒计时、收入、订单内容的图片。

## 暂时可以跳过

- 新店铺背景。
- 新怪兽全套表情。
- 底部导航。
- 商品 icon 全量重画。
- 高级评价牌。
- Spine / DragonBones。

这些会提升截图，但不先解决“玩家下一步该点哪里”。
