# Figma To Runtime Resource Manifest - 2026-07-02

目标：把用户在 Figma 权威画板里确认使用 / 收录的资源整理成 runtime 接入前的白名单。本文是 `blocked-by-figma-mcp` 状态下的本地草案：本地路径和尺寸已整理，Figma 节点明细仍需 MCP 恢复后补读。

权威目标图仍为：

- `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

## Owner / Brief / Review / Record

- Owner：Development/testing 负责最终 runtime resource manifest、路径映射、Cocos 引用风险和后续接入顺序。
- Brief：用户确认 5 个 Figma 权威画板内使用 / 收录的资源可进入项目；其余美术资源可归档到项目外。5 个画板为 `PLACEMENT_CANVAS__390x844 01`、`PLACEMENT_CANVAS__390x844 02`、`商品`、`设备`、`顾客`。
- Review：Art/UI 复核资源仍服务目标图一比一还原；Product 复核状态语义；Development/testing 复核导出图 / runtime shape / 动态控制边界。
- Record：本文、`docs/FINAL_RESOURCE_LOCAL_PREFLIGHT_2026_07_02.md`、`docs/ART_ARCHIVE_CANDIDATES_2026_07_02.md`、`docs/LOCAL_TASK_BOARD.md`。

## Current Figma Status

已定位的 Figma 画板：

| Board | Node id | Purpose | Status |
| --- | --- | --- | --- |
| `PLACEMENT_CANVAS__390x844 01` | `98:61` | 左侧顾客 current 的 390x844 runtime 布局 | 需补读最新节点明细 |
| `PLACEMENT_CANVAS__390x844 02` | `100:372` | 右侧顾客 current 的 390x844 runtime 布局 | 用户已修正，需补读确认 |
| `商品` | `108:463` | 商品 icon 白名单 | 需补读节点明细 |
| `设备` | `108:464` | 设备多态 icon 白名单 | 需补读节点明细 |
| `顾客` | `108:492` | 顾客多表情分层白名单 | 需补读节点明细 |

当前阻塞：

- Figma MCP `use_figma` / metadata 接口连续返回 `failed to get client` / `timed out handshaking with MCP server`。
- 因此本文不能声明“已完整读取 Figma 白名单节点”，只能作为本地资源整理草案。
- 本轮没有移动、删除、归档任何文件，也没有改 runtime 代码。

本地预检：

- `docs/FINAL_RESOURCE_LOCAL_PREFLIGHT_2026_07_02.md` 已确认白名单草案中的核心本地 PNG 均存在，尺寸与本文记录一致。
- 当前剩余阻塞集中在 Figma 节点确认与 runtime 路径迁移，而不是本地文件缺失。

## Runtime Render Policy

静态皮肤优先导图，动态状态保留 runtime 控制。

| Element | Runtime policy | Reason |
| --- | --- | --- |
| `headbar` | export bitmap or exact vector asset | 顶部轮廓 / 凹口 / 抗锯齿需要贴近 Figma。 |
| `hud_base_coin` / `hud_base_time` | export bitmap, fixed display size | 容器质感稳定；数字和 icon 分层叠加。 |
| HUD numbers / timer text | runtime text | 金币、倒计时会变化，不能烘焙。 |
| Timer progress track | bitmap or runtime rounded rect | 若只是纯色可代码画；若有内凹质感则导图。 |
| Timer progress fill | runtime controlled width | 动态变化，不能烘焙整条。 |
| `product_card_base` | export bitmap, repeated card | 商品卡是目标图显著 UI 质感，导图更稳。 |
| Product stock badge base | runtime shape or exported small bitmap | 数字 runtime；底板可画。 |
| Product stock text | runtime text | 库存变化。 |
| Order bubble base | bitmap state assets | 选中 / 未选中外形质感要贴近 Figma。 |
| Order slots | runtime shapes unless Figma exports final slot asset | 槽位状态和商品动态。 |
| Order product icons | product sprites scaled to slot size | 和商品区同源。 |
| READY capsule | bitmap base + runtime text | 可动态显示 / 隐藏，避免 baked placeholder。 |
| Background / lower purple areas | bitmap or responsive shape split | 需要适配不同屏幕尺寸，不能单纯整屏拉伸。 |

## Whitelist Draft

状态说明：

- `keep-final`: 用户确认范围内，建议作为最终 runtime 资源保留。
- `keep-layout-source`: Figma / layout 用到，但可能由 runtime shape 重绘。
- `pending-figma-node`: 等 Figma MCP 恢复后补 node id / exact name / exact localPath metadata。
- `pending-user-export`: 用户会从 Figma 再导出统一视觉资源，开发暂不锁死缩放。

### Products

Figma board：`商品` / node `108:463`。该画板 child count 上次定位为 `6`，本地草案按当前 6 个商品卡商品整理。

| Semantic id | Local path | Size | Status | Notes |
| --- | --- | ---: | --- | --- |
| `snack_bag` | `assets/ui/final-candidates/gameplay-retry-v1/products/product_snack_bag_v2.png` | `1254x1254` | `keep-final / pending-figma-node` | Placement top-left and order slot item. |
| `lemon_drink` | `assets/ui/final-candidates/gameplay-retry-v1/products/product_lemon_drink_v4.png` | `1254x1254` | `keep-final / pending-figma-node` | Placement top-middle and order slot item. |
| `rice_ball` | `assets/ui/final-candidates/gameplay-products-target-v2/products/product_rice_ball_target_v2.png` | `1254x1254` | `keep-final / pending-figma-node / pending-user-export` | User noted product icon normalization will be handled in Figma. |
| `pudding_cup` | `assets/ui/final-candidates/gameplay-retry-v1/products/product_pudding_cup_v2.png` | `1254x1254` | `keep-final / pending-figma-node` | Placement bottom-left. |
| `chocolate_milk` | `assets/ui/final-candidates/gameplay-products-target-v2/products/product_chocolate_milk_target_v2.png` | `1254x1254` | `keep-final / pending-figma-node` | Placement bottom-middle. |
| `candy_bag` | `assets/ui/final-candidates/gameplay-products-target-v2/products/product_candy_bag_target_v2.png` | `1254x1254` | `keep-final / pending-figma-node` | Placement bottom-right. |

Not in current six-slot placement unless Figma `商品` board proves otherwise:

- `assets/ui/final-candidates/gameplay-products-v2/products/product_strawberry_milk_v1.png`
- `assets/ui/final-candidates/gameplay-products-v2/products/product_star_candy_v1.png`

These two should stay `archive-candidate / pending-figma-confirmation`.

### Equipment

Figma board：`设备` / node `108:464`。该画板 child count 上次定位为 `5`，本地草案按微波炉三态 + 收银机两态整理。

| Semantic id | Local path | Size | Status | Notes |
| --- | --- | ---: | --- | --- |
| `microwave_idle` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/microwave_idle_v1.png` | `640x420` | `keep-final / pending-figma-node` | 空闲态。 |
| `microwave_heating` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/microwave_heating_v1.png` | `640x420` | `keep-final / pending-figma-node` | 加热态。 |
| `microwave_ready` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/microwave_ready_v1.png` | `640x420` | `keep-final / pending-figma-node` | 可取态。 |
| `cashier_idle` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/cashier_idle_v1.png` | `640x420` | `keep-final / pending-figma-node` | 空闲态。 |
| `cashier_pay` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/cashier_pay_v1.png` | `640x420` | `keep-final / pending-figma-node` | 付款反馈态。 |

Placement-only equipment / counter resources:

| Semantic id | Local path | Size | Status | Notes |
| --- | --- | ---: | --- | --- |
| `counter_foreground_or_ledge` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/counter_foreground_v1_revise_tall_wall.png` | `1536x360` | `keep-final / placement-used / pending-figma-node` | Earlier risk downgraded by user clarification: if used in placement, it may be final. |
| `counter_worktop_midground` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/counter_worktop_midground_v1.png` | `1536x300` | `keep-final / placement-used / pending-figma-node` | Equipment shelf / worktop. |

### Customers

Figma board：`顾客` / node `108:492`。该画板 child count 上次定位为 `12`，对应两个顾客各 6 层：body、3 face states、left hand、right hand。

Blue teal:

| Part | Local path | Size | Status |
| --- | --- | ---: | --- |
| `body_base` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/blue_teal/placement/body_base_v1.png` | `676x668` | `keep-final / pending-figma-node` |
| `face_neutral` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/blue_teal/placement/face_neutral_v1.png` | `236x257` | `keep-final / pending-figma-node` |
| `face_happy` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/blue_teal/placement/face_happy_v1.png` | `263x289` | `keep-final / pending-figma-node` |
| `face_impatient` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/blue_teal/placement/face_impatient_v1.png` | `281x234` | `keep-final / pending-figma-node` |
| `left_hand` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/blue_teal/placement/left_hand_v1.png` | `175x163` | `keep-final / pending-figma-node` |
| `right_hand` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/blue_teal/placement/right_hand_v1.png` | `178x164` | `keep-final / pending-figma-node` |

Purple hoodie:

| Part | Local path | Size | Status |
| --- | --- | ---: | --- |
| `body_base` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/purple_hoodie/placement/body_base_v1.png` | `620x685` | `keep-final / pending-figma-node` |
| `face_neutral` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/purple_hoodie/placement/face_neutral_v1.png` | `221x277` | `keep-final / pending-figma-node` |
| `face_happy` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/purple_hoodie/placement/face_happy_v1.png` | `262x300` | `keep-final / pending-figma-node` |
| `face_impatient` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/purple_hoodie/placement/face_impatient_v1.png` | `277x243` | `keep-final / pending-figma-node` |
| `left_hand` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/purple_hoodie/placement/left_hand_v1.png` | `194x154` | `keep-final / pending-figma-node` |
| `right_hand` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/purple_hoodie/placement/right_hand_v1.png` | `194x154` | `keep-final / pending-figma-node` |

Rig canvas / rough composite files are not runtime final. They should move to archive after manifest review:

- `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/**/rig_canvas/`
- `assets/ui/final-candidates/gameplay-customers-animation-v1/_sources/`
- `assets/ui/final-candidates/gameplay-customers-animation-v1/_qa/`

### Order Bubble / READY

Source：placement canvases `98:61` and `100:372` plus prior user-approved unselected variant.

| Semantic id | Local path | Size | Status | Runtime note |
| --- | --- | ---: | --- | --- |
| `order_bubble_selected_base` | `assets/ui/final-candidates/gameplay-retry-v1/order/order_bubble_current_base_no_slots_v2.png` | `1727x910` | `keep-final / pending-figma-node` | Current selected bubble base; if final selected state is overlay-based, use with selected overlay. |
| `order_bubble_unselected_base` | `assets/ui/final-candidates/gameplay-order-bubble-states-v1/order/order_bubble_unselected_no_yellow_outline_v3.png` | `1727x910` | `keep-final / pending-figma-node` | User requested same size, no yellow outline. |
| `order_bubble_selected_yellow_overlay` | `assets/ui/final-candidates/gameplay-order-bubble-states-v1/order/order_bubble_selected_yellow_outline_overlay_v3.png` | `1727x910` | `keep-final / optional state overlay` | Preferred state model if Development wants base + overlay. |
| `order_check` | `assets/ui/final-candidates/gameplay-retry-v1/order/order_check_v2.png` | `1254x1254` | `keep-final / has earlier Figma localPath` | Completed slot check. |
| `ready_capsule_empty` | `assets/ui/final-candidates/gameplay-retry-v1/order/order_ready_capsule_empty.png` | `1774x887` | `keep-final / pending-figma-node` | READY text should remain runtime text. |

Frame state rule:

- Frame 01：left bubble selected / READY.
- Frame 02：right bubble selected / READY. User has already fixed Figma; MCP must re-read once available.
- Development correction from old read: if a stale frame still has left selected in 02, only swap selected/unselected bubble state; do not rebuild slots/products/checks.

### Product Cards

| Semantic id | Local path | Size | Status | Runtime note |
| --- | --- | ---: | --- | --- |
| `product_card_base` | `assets/ui/final-candidates/gameplay-product-card-target-v1/product_card_base_target_v1.png` | `205x180` | `keep-final / pending-figma-node` | Exported card base is preferred over code-drawn approximation if it matches current Figma. |

Runtime dynamic elements:

- Product sprites should be layered over card base.
- Stock badge base may be runtime shape unless user exports it as a bitmap.
- Stock numbers are runtime text.

### HUD / Nav

Placement canvases include HUD and nav icons not represented by the three resource boards. User confirmed placement-used resources are allowed.

HUD:

| Semantic id | Local path | Size | Status | Runtime note |
| --- | --- | ---: | --- | --- |
| `headbar` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_top_frame_base_390w_v1.png` | `390x68` | `keep-final / pending-figma-node` | Verify against Figma headbar height; previous read saw `76.1` high shape. |
| `hud_coin_icon` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_coin_icon_v2.png` | `128x128` | `keep-final / placement-used` | Display at Figma size, text runtime. |
| `hud_clock_icon` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_clock_icon_v2.png` | `128x128` | `keep-final / placement-used` | Display at Figma size, text runtime. |
| `hud_pause_button` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_pause_button_v2.png` | `128x128` | `keep-final / placement-used` | Icon-only. |
| `hud_timer_progress_track` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_timer_progress_track_v1.png` | `116x12` | `keep-final-or-runtime-shape / placement-used` | Use bitmap if Figma texture matters. |
| `hud_timer_progress_fill` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_timer_progress_fill_v1.png` | `116x12` | `keep-final / dynamic-width` | Runtime clips or scales horizontally. |

Nav:

| Semantic id | Local path | Size | Status |
| --- | --- | ---: | --- |
| `nav_task` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_task_v2.png` | `128x128` | `keep-final / placement-used` |
| `nav_procurement` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_procurement_v2.png` | `128x128` | `keep-final / placement-used` |
| `nav_inventory` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_inventory_v2.png` | `128x128` | `keep-final / placement-used` |
| `nav_upgrade` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_upgrade_v2.png` | `128x128` | `keep-final / placement-used` |
| `nav_catalog` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_catalog_v2.png` | `128x128` | `keep-final / placement-used` |
| `nav_bottom_bar_base` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_bottom_bar_base_390w_v1.png` | `390x78` | `keep-final-or-runtime-shape / placement-used` |
| `nav_slot_base` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_slot_base_v1.png` | `66x56` | `keep-if-used / pending-figma-node` |

Additional local HUD/Nav assets awaiting Figma confirmation:

- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_star_full_v1.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_star_empty_v1.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_alert_badge_v1.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_slot_active_v1.png`

### Background / Playfield Base

Placement canvases include a full background image but Figma localPath metadata was missing in the earlier read.

| Semantic id | Local path | Size | Status | Notes |
| --- | --- | ---: | --- | --- |
| `store_background` | `assets/resources/ui_probe_gameplay_v1/background/store_background.png` | `750x1334` | `keep-final-candidate / needs promotion from probe path` | Current local final-candidates background folder is missing. |
| `current_customer_halo` | `assets/resources/ui_probe_gameplay_v1/background/current_customer_halo.png` | `512x512` | `optional / needs Figma confirmation` | Use only if visible in final placement. |
| `store_background_source` | `assets/art-source/environment/store-background-source-v1.png` | `941x1672` | `source / archive-or-source-hold` | Source, not runtime. |

Development should not leave final runtime loading from a `ui_probe_*` path. Before code integration, copy/promote chosen final assets into a final runtime namespace such as `assets/resources/ui_gameplay_final_v1/`.

## Adaptation Rule

The runtime should use `390x844` as the authoritative design coordinate system and adapt by anchors / safe areas, not by stretching the whole screen.

- `390x844`: exact Figma layout.
- Wider screens: 390 gameplay column centered; background / top / bottom bands extend.
- Taller screens: HUD top-anchored, product/nav bottom-anchored, middle spacing grows carefully.
- Narrower screens: scale the gameplay column only as needed; preserve product-card and nav touch targets.

## Next Required Figma Pass

When Figma MCP recovers:

1. Re-read `商品` / `设备` / `顾客` and fill `figmaNodeId`, exact node name, image hash, and `monster_store_art.localPath` where available.
2. Re-read `PLACEMENT_CANVAS__390x844 02` and verify right-side selected bubble state.
3. Mark this manifest as `review-ready`.
4. Only then generate final copy plan for `assets/resources/ui_gameplay_final_v1/`.
