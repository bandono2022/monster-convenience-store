# UI Gameplay Final Copy Plan - 2026-07-02

目标：在用户确认的 Figma 权威资源恢复精读后，把可用资源从候选 / probe 路径整理到最终 runtime namespace。本文是复制计划草案，不执行复制、不改代码、不归档旧资源。

目标 namespace：

```text
assets/resources/ui_gameplay_final_v1/
```

## Owner / Brief / Review / Record

- Owner：Development/testing 负责最终资源命名、Cocos import、runtime 引用迁移、构建和截图 QA。
- Brief：将用户 Figma 权威画板内使用 / 收录的 final 资源整理到稳定 runtime 路径，避免继续从 `final-candidates` 或 `ui_probe_*` 路径加载。
- Review：Art/UI 复核复制清单仍对应权威目标图；Product 复核状态命名和功能语义；Coordination 记录阻塞和批准顺序。
- Record：本文、`docs/FIGMA_TO_RUNTIME_RESOURCE_MANIFEST_2026_07_02.md`、`docs/FINAL_RESOURCE_LOCAL_PREFLIGHT_2026_07_02.md`、`docs/LOCAL_TASK_BOARD.md`。

## Copy Rules

- 复制 PNG 本体，不复制旧 `.meta`，避免 Cocos GUID 重复。
- 复制后由 Cocos Creator 导入生成新的 `.meta`。
- final namespace 生成后，Development/testing 再改 runtime resource path。
- 旧 `ui_probe_*`、`ui_p0`、`ui_formal_v2`、`game-art` 不在同一轮归档；必须等 final path 接入、截图和构建通过后再处理。
- Figma MCP 未恢复前，本计划保持 `draft / pending-figma-node-confirmation`。

## Manual Export Update

用户已手动导出一批 Figma 资源，并已整理到：

- `manual-figma-export-2026-07-02-normalized/`

该整理区应优先作为后续 `ui_gameplay_final_v1` 复制来源，但仍需用户先检查总览图：

- `output/manual-figma-export-2026-07-02/manual_figma_export_normalized_contact_sheet_2026_07_02.png`

注意：

- `order/order_ready_badge_baked_ready.png` 带有 baked `READY` 字样，不是 empty capsule。
- 完整 `PLACEMENT_CANVAS__390x844 01/02` QA 图已补齐到 `qa/`。
- 独立背景图已补齐到 `background/background_store.png`，尺寸为 `390x844`。
- 用户确认底部 nav 底板 / slot 不需要单独导图，由 runtime 按 Figma 间距、层级和底部安全区绘制。
- 用户确认 timer track / fill 不需要单独导图，由 runtime 绘制并动态控制。
- 本文下方的旧候选源路径仍保留作 fallback；最终复制时应以用户确认后的 normalized export 为准。

## Proposed Mapping

### Background

| Source | Target | Status |
| --- | --- | --- |
| `manual-figma-export-2026-07-02-normalized/background/background_store.png` | `assets/resources/ui_gameplay_final_v1/background/store_background.png` | `copy-after-user-review` |
| `assets/resources/ui_probe_gameplay_v1/background/current_customer_halo.png` | `assets/resources/ui_gameplay_final_v1/background/current_customer_halo.png` | `optional / pending-figma-confirm` |

### Products

| Source | Target | Status |
| --- | --- | --- |
| `manual-figma-export-2026-07-02-normalized/products/product_snack_bag.png` | `assets/resources/ui_gameplay_final_v1/products/snack_bag.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/products/product_lemon_drink.png` | `assets/resources/ui_gameplay_final_v1/products/lemon_drink.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/products/product_rice_ball.png` | `assets/resources/ui_gameplay_final_v1/products/rice_ball.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/products/product_pudding_cup.png` | `assets/resources/ui_gameplay_final_v1/products/pudding_cup.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/products/product_chocolate_milk.png` | `assets/resources/ui_gameplay_final_v1/products/chocolate_milk.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/products/product_candy_bag.png` | `assets/resources/ui_gameplay_final_v1/products/candy_bag.png` | `copy-after-user-review` |

Do not copy unless Figma `商品` confirms use:

- `assets/ui/final-candidates/gameplay-products-v2/products/product_strawberry_milk_v1.png`
- `assets/ui/final-candidates/gameplay-products-v2/products/product_star_candy_v1.png`

### Product Card

| Source | Target | Status |
| --- | --- | --- |
| `manual-figma-export-2026-07-02-normalized/product_card/product_card_base.png` | `assets/resources/ui_gameplay_final_v1/product_card/card_base.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/product_card/product_card_stock_badge_base.png` | `assets/resources/ui_gameplay_final_v1/product_card/stock_badge_base.png` | `copy-after-user-review` |

Stock badge base and stock number stay runtime controlled unless Figma exports a final bitmap.

### Order / READY

| Source | Target | Status |
| --- | --- | --- |
| `manual-figma-export-2026-07-02-normalized/order/order_bubble_selected_base.png` | `assets/resources/ui_gameplay_final_v1/order/bubble_selected_base.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/order/order_bubble_unselected_base.png` | `assets/resources/ui_gameplay_final_v1/order/bubble_unselected_base.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/order/order_check.png` | `assets/resources/ui_gameplay_final_v1/order/check.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/order/order_slot_base.png` | `assets/resources/ui_gameplay_final_v1/order/slot_base.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/order/order_ready_badge_baked_ready.png` | `assets/resources/ui_gameplay_final_v1/order/ready_badge_baked_ready.png` | `copy-after-user-review / baked-text` |

READY label remains runtime text if an empty capsule is supplied later. Current manual export is a baked READY badge, so Development/testing must not overlay duplicate READY text on it. Frozen placeholder `ready_badge_compact.png` is not part of this final namespace.

### Equipment / Counter

| Source | Target | Status |
| --- | --- | --- |
| `manual-figma-export-2026-07-02-normalized/equipment/equipment_microwave_idle.png` | `assets/resources/ui_gameplay_final_v1/equipment/microwave_idle.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/equipment/equipment_microwave_heating.png` | `assets/resources/ui_gameplay_final_v1/equipment/microwave_heating.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/equipment/equipment_microwave_ready.png` | `assets/resources/ui_gameplay_final_v1/equipment/microwave_ready.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/equipment/equipment_cashier_idle.png` | `assets/resources/ui_gameplay_final_v1/equipment/cashier_idle.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/equipment/equipment_cashier_pay.png` | `assets/resources/ui_gameplay_final_v1/equipment/cashier_pay.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/equipment/equipment_counter_foreground.png` | `assets/resources/ui_gameplay_final_v1/equipment/counter_foreground.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/equipment/equipment_counter_worktop_midground.png` | `assets/resources/ui_gameplay_final_v1/equipment/counter_worktop_midground.png` | `copy-after-user-review` |

Do not copy `counter_foreground_v1.png` unless Figma proves the older shorter version is used.

### Customers

Blue teal:

| Source | Target | Status |
| --- | --- | --- |
| `manual-figma-export-2026-07-02-normalized/customers/blue_teal/customer_blue_teal_body_base.png` | `assets/resources/ui_gameplay_final_v1/customers/blue_teal/body_base.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/customers/blue_teal/customer_blue_teal_face_neutral.png` | `assets/resources/ui_gameplay_final_v1/customers/blue_teal/face_neutral.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/customers/blue_teal/customer_blue_teal_face_happy.png` | `assets/resources/ui_gameplay_final_v1/customers/blue_teal/face_happy.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/customers/blue_teal/customer_blue_teal_face_impatient.png` | `assets/resources/ui_gameplay_final_v1/customers/blue_teal/face_impatient.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/customers/blue_teal/customer_blue_teal_left_hand.png` | `assets/resources/ui_gameplay_final_v1/customers/blue_teal/left_hand.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/customers/blue_teal/customer_blue_teal_right_hand.png` | `assets/resources/ui_gameplay_final_v1/customers/blue_teal/right_hand.png` | `copy-after-user-review` |

Purple hoodie:

| Source | Target | Status |
| --- | --- | --- |
| `manual-figma-export-2026-07-02-normalized/customers/purple_hoodie/customer_purple_hoodie_body_base.png` | `assets/resources/ui_gameplay_final_v1/customers/purple_hoodie/body_base.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/customers/purple_hoodie/customer_purple_hoodie_face_neutral.png` | `assets/resources/ui_gameplay_final_v1/customers/purple_hoodie/face_neutral.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/customers/purple_hoodie/customer_purple_hoodie_face_happy.png` | `assets/resources/ui_gameplay_final_v1/customers/purple_hoodie/face_happy.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/customers/purple_hoodie/customer_purple_hoodie_face_impatient.png` | `assets/resources/ui_gameplay_final_v1/customers/purple_hoodie/face_impatient.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/customers/purple_hoodie/customer_purple_hoodie_left_hand.png` | `assets/resources/ui_gameplay_final_v1/customers/purple_hoodie/left_hand.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/customers/purple_hoodie/customer_purple_hoodie_right_hand.png` | `assets/resources/ui_gameplay_final_v1/customers/purple_hoodie/right_hand.png` | `copy-after-user-review` |

Do not copy `rig_canvas/`, `_sources/`, `_qa/`, or rough composite files into runtime.

### HUD

| Source | Target | Status |
| --- | --- | --- |
| `manual-figma-export-2026-07-02-normalized/hud/hud_top_frame_base.png` | `assets/resources/ui_gameplay_final_v1/hud/top_frame_base.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/hud/hud_base_coin.png` | `assets/resources/ui_gameplay_final_v1/hud/base_coin.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/hud/hud_base_time.png` | `assets/resources/ui_gameplay_final_v1/hud/base_time.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/hud/hud_coin_icon.png` | `assets/resources/ui_gameplay_final_v1/hud/coin_icon.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/hud/hud_clock_icon.png` | `assets/resources/ui_gameplay_final_v1/hud/clock_icon.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/hud/hud_pause_button.png` | `assets/resources/ui_gameplay_final_v1/hud/pause_button.png` | `copy-after-user-review` |

Timer track / fill:

- No standalone bitmap required.
- Runtime draws the track and fill and controls progress width dynamically.

Pending Figma confirmation:

- `hud_star_full_v1.png`
- `hud_star_empty_v1.png`

### Nav

Bottom nav base / slot:

- No standalone bitmap required.
- Runtime draws the solid bottom base and per-entry spacing / touch regions according to the Figma layout.
- Five nav icon PNGs remain bitmap assets.

| Source | Target | Status |
| --- | --- | --- |
| `manual-figma-export-2026-07-02-normalized/nav/nav_icon_task.png` | `assets/resources/ui_gameplay_final_v1/nav/icon_task.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/nav/nav_icon_procurement.png` | `assets/resources/ui_gameplay_final_v1/nav/icon_procurement.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/nav/nav_icon_inventory.png` | `assets/resources/ui_gameplay_final_v1/nav/icon_inventory.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/nav/nav_icon_upgrade.png` | `assets/resources/ui_gameplay_final_v1/nav/icon_upgrade.png` | `copy-after-user-review` |
| `manual-figma-export-2026-07-02-normalized/nav/nav_icon_catalog.png` | `assets/resources/ui_gameplay_final_v1/nav/icon_catalog.png` | `copy-after-user-review` |

Pending Figma confirmation:

- `nav_slot_active_v1.png`
- `nav_alert_badge_v1.png`

## Runtime Path Shape

After Cocos import, expected load paths should use extensionless spriteFrame paths, for example:

```text
ui_gameplay_final_v1/products/snack_bag/spriteFrame
ui_gameplay_final_v1/order/bubble_selected_base/spriteFrame
ui_gameplay_final_v1/customers/blue_teal/body_base/spriteFrame
```

## Blockers Before Execution

- Figma MCP must recover so the 5 authoritative boards can be re-read.
- Frame 02 must be verified as right customer selected.
- User must confirm the copy plan before files are created under final namespace.
- Cocos import/build and runtime screenshots must happen before any old runtime path is archived.
