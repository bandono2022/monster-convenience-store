# 目标图资源拆解 V1

更新时间：2026-06-25

角色：美术 / UX

状态：draft

目标图：

`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

输出目录已归档：

`archive/art-legacy-2026-06-27/assets/ui/derived/gameplay-v2/`

manifest 已归档：

`archive/art-legacy-2026-06-27/assets/ui/derived/gameplay-v2/manifest.json`

## 重要声明

本目录中的资源全部来自目标图裁切，只能作为开发占位、布局对齐或重绘参考。当前已从 active assets 归档，不作为 final art 候选或 runtime 接入资源。

- `reference_slice_*`：参考切片，不建议直接接入正式运行 UI。
- `placeholder_*`：可用于原型或 QA 临时占位，但最终必须重画。
- 所有动态文字、库存、价格、倒计时、订单内容都不应烘焙进最终图片。
- 当前目标图尺寸为 `941 x 1672`，接近 `750 x 1334` 的竖屏比例；390 宽适配应按 `docs/UX_INFORMATION_HIERARCHY_V1.md` 重新排布。

## 输出方法

使用 `sips` 从目标图进行矩形裁切，并人工抽查关键切片：

- 当前顾客 READY 气泡。
- 商品区整区。
- 工作台整区。
- 单张商品卡。
- HUD 顶栏。
- 底部导航。

没有创建长期脚本，没有改动代码文件。

## 接入优先级定义

| 优先级 | 含义 |
| --- | --- |
| P0 | 影响“订单气泡 READY 交付”闭环，开发应优先接入或按其重画 |
| P1 | 影响商业化画面完整度，但不阻塞核心闭环 |
| P2 | 可等核心经营页稳定后再处理 |

## 整区参考切片

| 文件 | 用途 | 可直接临时使用 | 必须最终重绘 | 建议尺寸 / 格式 | 接入优先级 |
| --- | --- | --- | --- | --- | --- |
| `reference_slice_hud_top.png` | 顶部 HUD 整体布局、面板厚度、图标和数字比例参考 | 否，仅参考 | 是 | 最终拆成 9-slice 面板 PNG、独立 icon PNG、动态 Label；750 宽下全宽 HUD 约 750 x 108 | P0 |
| `reference_slice_hud_coin_panel.png` | 金币 / 营业额面板参考 | 否，仅参考 | 是 | 透明或 9-slice 面板 + 金币 icon；数字动态 | P0 |
| `reference_slice_hud_timer_panel.png` | 倒计时面板参考 | 否，仅参考 | 是 | 透明或 9-slice 面板 + 时钟 icon + 进度条；时间动态 | P0 |
| `reference_slice_hud_combo_panel.png` | 星级 / 连击面板参考 | 否，仅参考 | 是 | 星星 icon、进度条、数字分层导出 | P1 |
| `reference_slice_pause_button.png` | 暂停按钮形状和厚度参考 | 可作为按钮占位，但有背景边缘 | 是 | 透明 PNG，建议 96 x 96 或 128 x 128 源图，运行时缩放 | P0 |
| `reference_slice_customer_order_zone.png` | 顾客、订单气泡、耐心条整体构图参考 | 否，仅参考 | 是 | 不建议做整区大图；最终拆背景、顾客、气泡、耐心条 | P0 |
| `reference_slice_workstation_full.png` | 微波炉、柜台、收银台服务动线参考 | 否，仅参考 | 是 | 最终拆工作台背景、微波炉、收银台、装饰道具 | P0 |
| `reference_slice_product_grid_full.png` | 6 宫格商品区布局、卡片间距、需要态发光参考 | 否，仅参考 | 是 | 最终拆商品区底板、商品卡底板、状态 overlay、商品 icon | P0 |
| `reference_slice_bottom_nav.png` | 底部经营入口 / meta 导航参考 | 否，仅参考 | 是 | 单个 icon + 底栏面板分层；营业核心可先不接 | P2 |

## 订单与顾客切片

| 文件 | 用途 | 可直接临时使用 | 必须最终重绘 | 建议尺寸 / 格式 | 接入优先级 |
| --- | --- | --- | --- | --- | --- |
| `reference_slice_current_customer_ready_bubble.png` | 当前顾客 READY 订单气泡参考，含已填槽、READY 胶囊、点击箭头 | 否，含背景和顾客头部 | 是 | 最终拆 `order_bubble_base`、槽位、check、READY badge、glow、arrow；透明 PNG + Cocos 动态内容 | P0 |
| `reference_slice_waiting_customer_order_bubble.png` | 非当前顾客订单气泡参考 | 否，含背景 | 是 | 非当前气泡应弱一档，槽位与商品 icon 动态渲染 | P0 |
| `reference_slice_current_customer_stage.png` | 当前顾客高亮、表情、耐心条位置参考 | 否，仅参考 | 是 | 顾客最终独立透明 PNG / Spine 试点；高亮和耐心条程序叠加 | P0 |
| `reference_slice_secondary_customer_stage.png` | 次要顾客等待 / 低耐心视觉参考 | 否，仅参考 | 是 | 次要顾客可先复用现有怪兽，最终统一重画 | P1 |
| `reference_slice_ready_badge.png` | READY 胶囊视觉参考 | 否，背景不透明且不完整 | 是 | 透明 PNG 或 9-slice，建议含 normal / pulse / pressed 三态；文字可烘焙为 icon 风格或动态 Label | P0 |

## 工作台切片

| 文件 | 用途 | 可直接临时使用 | 必须最终重绘 | 建议尺寸 / 格式 | 接入优先级 |
| --- | --- | --- | --- | --- | --- |
| `reference_slice_microwave_workstation.png` | 微波炉 heating / ready 状态参考 | 可作为原型背景占位，不适合正式交互 | 是 | 微波炉透明 PNG，至少 idle / heating / ready；进度条和数字动态 | P0 |
| `reference_slice_cash_register_payment.png` | 收银台付款反馈参考 | 可作为原型背景占位，不适合正式交互 | 是 | 收银台透明 PNG + 屏幕面板 + 金币粒子 + 动态收入数字 | P0 |

## 商品卡占位切片

这些切片比整区参考更接近可接入占位，但仍然不是最终商用资源。它们烘焙了商品、库存和状态，后续必须按 `docs/PRODUCT_CARD_LAYERING_SPEC.md` 拆成底板、角标、商品 icon、库存 Label 和状态 overlay。

| 文件 | 用途 | 可直接临时使用 | 必须最终重绘 | 建议尺寸 / 格式 | 接入优先级 |
| --- | --- | --- | --- | --- | --- |
| `placeholder_product_card_onigiri_heat.png` | 热食饭团商品卡占位 | 可，用于布局和热食流程 QA | 是 | 最终商品卡遵循 304 x 376 源尺寸或当前运行时 228 x 264；热食角标分层 | P0 |
| `placeholder_product_card_snack_needed.png` | 当前订单需要的零食卡占位 | 可，用于 needed 高亮 QA | 是 | 底板、星标、发光、商品 icon、库存数字分层 | P0 |
| `placeholder_product_card_drink_needed.png` | 当前订单需要的饮料卡占位 | 可，用于 needed 高亮 QA | 是 | 同上，饮料 icon 独立透明 PNG | P0 |
| `placeholder_product_card_pudding.png` | 普通布丁商品卡占位 | 可，用于普通卡视觉密度 QA | 是 | 普通卡底板 + 商品 icon + 库存 Label | P1 |
| `placeholder_product_card_chocolate_milk.png` | 普通巧克力奶商品卡占位 | 可，用于普通卡视觉密度 QA | 是 | 普通卡底板 + 商品 icon + 库存 Label | P1 |
| `placeholder_product_card_candy.png` | 普通糖果商品卡占位 | 可，用于普通卡视觉密度 QA | 是 | 普通卡底板 + 商品 icon + 库存 Label | P1 |

## 推荐最终资源拆分

### HUD

最终不应使用整条 HUD 截图。建议拆为：

| 资源 | 格式 | 说明 |
| --- | --- | --- |
| `hud_panel_coin_9slice.png` | PNG 9-slice | 金币面板底板 |
| `hud_panel_timer_9slice.png` | PNG 9-slice | 时间面板底板 |
| `hud_panel_combo_9slice.png` | PNG 9-slice | 连击 / 星级面板底板 |
| `icon_coin.png` | 透明 PNG | 金币图标 |
| `icon_clock.png` | 透明 PNG | 时钟图标 |
| `icon_star.png` | 透明 PNG | 星星图标 |
| `button_pause_normal.png` / `button_pause_pressed.png` | 透明 PNG | 暂停按钮 |

### 订单气泡

订单气泡是 P0 最高优先级。建议拆为：

| 资源 | 格式 | 说明 |
| --- | --- | --- |
| `order_bubble_base_current_9slice.png` | PNG 9-slice | 当前顾客气泡底板 |
| `order_bubble_base_waiting_9slice.png` | PNG 9-slice | 非当前顾客气泡底板 |
| `order_slot_empty.png` | 透明 PNG 或程序绘制 | 缺失槽 |
| `order_slot_filled_overlay.png` | 透明 PNG | 已填槽高亮 / 勾 |
| `order_slot_error_overlay.png` | 透明 PNG | 错误红闪 |
| `order_ready_badge.png` | 透明 PNG / 9-slice | READY 胶囊 |
| `order_ready_glow.png` | 透明 PNG | READY 呼吸光 |
| `order_click_arrow.png` | 透明 PNG | 点击提示箭头 |

### 商品卡

最终按既有商品卡分层规范接入，不直接使用目标图整卡截图。

| 层级 | 格式 | 说明 |
| --- | --- | --- |
| 商品卡底板 | PNG 9-slice 或透明 PNG | normal / needed / soldout 共用结构 |
| 分类角标 | 透明 PNG | 热食、热门、普通 |
| 商品 icon | 透明 PNG | 可临时复用现有商品，最终统一重画 |
| 库存角标底 | 透明 PNG 或程序绘制 | 数字动态 |
| 需要态发光 | 透明 PNG / shader / 程序描边 | 不烘焙到商品图 |
| 错误 / 售罄遮罩 | 程序遮罩 + icon | 不为每个商品单独出图 |

### 微波炉与收银台

| 资源 | 格式 | 说明 |
| --- | --- | --- |
| `microwave_idle.png` | 透明 PNG | 空炉 |
| `microwave_heating.png` | 透明 PNG | 炉内发光，可分层 |
| `microwave_ready.png` | 透明 PNG | 完成态，带 ready 灯或蒸汽 |
| `microwave_progress_bar.png` | 透明 PNG / 程序绘制 | 进度条，数值动态 |
| `cash_register_idle.png` | 透明 PNG | 收银台常态 |
| `cash_register_screen.png` | 透明 PNG / 9-slice | 屏幕底板，收入动态 |
| `coin_particle.png` | 透明 PNG | 付款粒子 |
| `payment_sparkle.png` | 透明 PNG | 付款闪光 |

## 可暂用资源

可以临时接入原型或 QA 的资源：

- `placeholder_product_card_onigiri_heat.png`
- `placeholder_product_card_snack_needed.png`
- `placeholder_product_card_drink_needed.png`
- `placeholder_product_card_pudding.png`
- `placeholder_product_card_chocolate_milk.png`
- `placeholder_product_card_candy.png`
- `reference_slice_microwave_workstation.png`，仅限整区占位或视觉对齐。
- `reference_slice_cash_register_payment.png`，仅限整区占位或付款反馈对齐。
- `reference_slice_pause_button.png`，仅限按钮尺寸占位。

这些资源都不能作为最终商用美术。

## 必须重绘资源

必须重绘或重新分层的资源：

- HUD 所有面板、icon、暂停按钮。
- 订单气泡所有状态：missing、partial、ready、done、error。
- READY 胶囊、点击箭头、READY 呼吸光。
- 商品卡底板、状态高亮、售罄 / 错误遮罩。
- 商品 icon 统一风格版本。
- 微波炉 idle / heating / ready 三态。
- 收银台 idle / collecting 两态与付款粒子。
- 顾客角色、表情、低耐心状态。
- 店铺背景、柜台、底部导航。

## 开发接入建议

1. 先用 `manifest.json` 和整区参考切片对齐经营页大分区。
2. P0 先做订单气泡状态、商品卡状态、微波炉状态、付款反馈。
3. 商品卡可以短期用 `placeholder_*` 做布局和交互 QA，但要尽快切到分层资源。
4. 不要把整张目标图或整区截图作为正式 UI 背景接入，否则动态文字、点击区域和适配都会被锁死。
5. 390 宽适配优先保护订单气泡、商品区、当前顾客脸、微波炉状态和 HUD 数字。
