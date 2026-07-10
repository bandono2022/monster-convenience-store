# Art Archive Candidates - 2026-07-02

目标：基于用户确认的 Figma 权威画板，整理“可以后续归档到项目外”的美术资源候选。本文只列建议，不执行移动、不删除文件、不改 Cocos 引用。

归档位置仍按 `AGENTS.md`：

- `/Users/ban/Documents/怪兽便利店-art-archive/art-deprecated-2026-06-28/`

归档原则：

- 保留 Figma 5 个权威画板使用 / 收录的资源。
- 保留当前 runtime 仍引用的资源，直到代码切到最终资源命名空间。
- 白名单外的旧候选、失败图、`_sources`、`_qa`、probe 包，在 manifest 复核后可按原相对路径移出项目。
- 不直接硬删，避免 Cocos `.meta`、fallback、QA 链路和历史记录断裂。

## Owner / Brief / Review / Record

- Owner：Development/testing 负责避免归档当前代码仍引用的资源；Art/UI 负责确认白名单外资源不再服务目标图一比一可游玩化。
- Brief：用户希望项目不要过于臃肿，除 Figma 权威画板资源外，其他美术资源可以删除或归档到项目外。
- Review：Product 确认不影响当前玩法/语义；Art/UI 确认不误归档 final 资源；Development/testing 确认不破坏当前 Cocos 运行。
- Record：本文、`docs/FIGMA_TO_RUNTIME_RESOURCE_MANIFEST_2026_07_02.md`、`docs/LOCAL_TASK_BOARD.md`。

## Hard Stop

当前不要移动以下路径，因为 `assets/scripts/presentation/MonsterStorePrototype.ts` 仍引用它们或它们仍是当前 runtime fallback：

- `assets/resources/ui_probe_gameplay_v1/`
- `assets/resources/ui_probe_gameplay_v2/`
- `assets/resources/ui_probe_gameplay_v3/`
- `assets/resources/ui_formal_v2/`
- `assets/resources/game-art/`
- `assets/resources/ui_p0/`

这些路径应在 Cocos 接入 `ui_gameplay_final_v1` 后，再进入第二轮归档。

## Keep Until Final Runtime Copy

以下是当前白名单草案中的保留资源。它们可先留在 `assets/ui/final-candidates/**`，后续复制/整理到最终 runtime namespace。

Products:

- `assets/ui/final-candidates/gameplay-retry-v1/products/product_snack_bag_v2.png`
- `assets/ui/final-candidates/gameplay-retry-v1/products/product_lemon_drink_v4.png`
- `assets/ui/final-candidates/gameplay-products-target-v2/products/product_rice_ball_target_v2.png`
- `assets/ui/final-candidates/gameplay-retry-v1/products/product_pudding_cup_v2.png`
- `assets/ui/final-candidates/gameplay-products-target-v2/products/product_chocolate_milk_target_v2.png`
- `assets/ui/final-candidates/gameplay-products-target-v2/products/product_candy_bag_target_v2.png`

Equipment / counter:

- `assets/ui/final-candidates/gameplay-equipment-v1/equipment/microwave_idle_v1.png`
- `assets/ui/final-candidates/gameplay-equipment-v1/equipment/microwave_heating_v1.png`
- `assets/ui/final-candidates/gameplay-equipment-v1/equipment/microwave_ready_v1.png`
- `assets/ui/final-candidates/gameplay-equipment-v1/equipment/cashier_idle_v1.png`
- `assets/ui/final-candidates/gameplay-equipment-v1/equipment/cashier_pay_v1.png`
- `assets/ui/final-candidates/gameplay-equipment-v1/equipment/counter_foreground_v1_revise_tall_wall.png`
- `assets/ui/final-candidates/gameplay-equipment-v1/equipment/counter_worktop_midground_v1.png`

Customers:

- `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/blue_teal/placement/`
- `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/purple_hoodie/placement/`
- `assets/ui/final-candidates/gameplay-customers-animation-v1/MANIFEST.md`

Order / READY:

- `assets/ui/final-candidates/gameplay-retry-v1/order/order_bubble_current_base_no_slots_v2.png`
- `assets/ui/final-candidates/gameplay-order-bubble-states-v1/order/order_bubble_unselected_no_yellow_outline_v3.png`
- `assets/ui/final-candidates/gameplay-order-bubble-states-v1/order/order_bubble_selected_yellow_outline_overlay_v3.png`
- `assets/ui/final-candidates/gameplay-retry-v1/order/order_check_v2.png`
- `assets/ui/final-candidates/gameplay-retry-v1/order/order_ready_capsule_empty.png`

HUD / Nav:

- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/MANIFEST.md`

Product card:

- `assets/ui/final-candidates/gameplay-product-card-target-v1/product_card_base_target_v1.png`

Target / background:

- `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`
- `assets/resources/ui_probe_gameplay_v1/background/store_background.png` until promoted to final namespace.

## Archive Candidates After Figma Manifest Review

These are likely safe to archive after Figma MCP confirms they are not present in `商品` / `设备` / `顾客` / placement canvases.

Old generated / failed / non-final candidate batches:

- `assets/ui/final-candidates/gameplay-first-batch-v1/`
- `assets/ui/final-candidates/gameplay-customers-states-v1/`
- `assets/ui/final-candidates/gameplay-products-target-v1/` if present in worktree.
- `assets/ui/final-candidates/gameplay-counter-scene-v1/` if present in worktree.
- `assets/ui/final-candidates/gameplay-blue-teal-customer-rework-v1/` if present in worktree.

Source and QA folders once final copy exists:

- `assets/ui/final-candidates/**/_sources/`
- `assets/ui/final-candidates/**/_qa/`
- `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/**/rig_canvas/`

Older alternate order bubble variants:

- `assets/ui/final-candidates/gameplay-order-bubble-states-v1/order/order_bubble_unselected_no_yellow_outline_v1.png`
- `assets/ui/final-candidates/gameplay-order-bubble-states-v1/order/order_bubble_unselected_no_yellow_outline_v2.png`
- `assets/ui/final-candidates/gameplay-order-bubble-states-v1/order/order_bubble_selected_yellow_outline_overlay_v1.png`
- `assets/ui/final-candidates/gameplay-order-bubble-states-v1/order/order_bubble_selected_yellow_outline_overlay_v2.png`
- older matching QA files under `assets/ui/final-candidates/gameplay-order-bubble-states-v1/_qa/`

Products not in the current six-slot Figma layout unless Figma `商品` board confirms otherwise:

- `assets/ui/final-candidates/gameplay-products-v2/products/product_strawberry_milk_v1.png`
- `assets/ui/final-candidates/gameplay-products-v2/products/product_star_candy_v1.png`

Equipment alternates not used by current placement unless Figma confirms:

- `assets/ui/final-candidates/gameplay-equipment-v1/equipment/counter_foreground_v1.png`

## Runtime Reference Cleanup Candidates

These are not safe to archive now, but should be targeted after final runtime resources are copied and code is updated:

- `assets/resources/ui_probe_gameplay_v1/`
- `assets/resources/ui_probe_gameplay_v2/`
- `assets/resources/ui_probe_gameplay_v3/`
- `assets/resources/ui_p0/`
- `assets/resources/ui_layered/`
- `assets/resources/ui_formal_v2/`
- older unused subfolders under `assets/resources/game-art/`

Development/testing must first update `MonsterStorePrototype.ts` references and run Cocos import/build checks before moving these.

## Proposed Final Runtime Namespace

Create after Figma manifest review, not in this round:

```text
assets/resources/ui_gameplay_final_v1/
  background/
  hud/
  nav/
  order/
  products/
  product_card/
  equipment/
  customers/
```

This lets the project keep final resources separate from probes and historical candidates.

## Current Blockers

- Figma MCP handshaking currently fails; exact resource board node details are not available.
- Current code still references probe and old runtime assets.
- Final runtime namespace does not exist yet.
- No archive action should happen until the manifest is reviewed and code migration order is approved.
