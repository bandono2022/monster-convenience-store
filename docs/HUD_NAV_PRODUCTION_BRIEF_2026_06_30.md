# HUD / Nav Production Brief 2026-06-30

Status: `candidate-produced / user-confirmed-semantics / waiting-user-overview-review / art-dev-readable-review / product-thread-missing`

Authoritative target:

- `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

This brief locks the HUD / bottom navigation art direction and records the
first candidate batch. It does not approve Figma upload or runtime integration
by itself.

## Owner / Brief / Review / Record

- Owner: Product/planning owns the player-facing HUD and five-entry navigation
  semantics.
- Brief: Product recommends the bottom nav order as `tasks / procurement /
  inventory / upgrade / catalog`, and top HUD as revenue, countdown, star
  goal/progress, and pause.
- Review: Art/UI gave `conditional pass to production brief` for HUD/Nav
  candidate generation after the user confirms the semantic order.
  Development/testing gave `conditional pass` for brief only, with generation,
  Figma, and runtime still gated.
- Record: This file, `docs/LOCAL_TASK_BOARD.md`,
  `docs/NEXT_ART_PRODUCTION_BRIEF.md`, and
  `docs/CURRENT_USABLE_ART_RESOURCES.md`.

## Product Semantic Table

Bottom nav order, left to right:

| Nav id | Player-facing meaning | Target-style icon | Intended click function | Default state |
| --- | --- | --- | --- | --- |
| `nav_task` | 任务 / 订单记录 | Clipboard with small alert badge | Open task / order-log surface when available; during active shift may be disabled or show a short hint. | Normal + optional alert badge |
| `nav_procurement` | 进货 / 采购篮 | Shopping basket | Open procurement / restock surface outside active shift; during active shift avoid stealing the service loop. | Normal |
| `nav_inventory` | 库存 / 货架管理 | Fridge / shelf cabinet | Open inventory / shelf-management surface when available. | Normal |
| `nav_upgrade` | 升级 | Green upward arrow | Open upgrade surface when available. For target-image visual matching, this can be the active/highlighted sample state in QA. | Active sample |
| `nav_catalog` | 图鉴 / 配方书 | Red book with star | Open catalog / recipe / product book. | Normal |

Top HUD semantics:

| HUD area | Meaning | Runtime content rule |
| --- | --- | --- |
| Coin / revenue panel | 营业额 / 金币显示位 | Do not bake numbers. In active gameplay, text should follow `PRODUCT_DECISIONS_V1.md`: main value is current shift revenue, not wallet. |
| Timer panel | 本局倒计时 | Do not bake time text. Runtime draws countdown text and optional progress fill. |
| Star panel | 星级目标 / 评价进度 | Do not bake `x3` or star count text. Runtime draws text/counts; art provides stars/panel visual. |
| Pause button | 暂停入口 | Icon-only button; no baked text. |

## Art/UI Output Scope

Output into a new isolated candidate folder, suggested:

- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/`

Top HUD candidate assets:

- `hud_top_frame_base_390w_v1.png`
- `hud_coin_icon_v2.png`
- `hud_clock_icon_v2.png`
- `hud_star_full_v1.png`
- `hud_star_empty_v1.png`
- `hud_timer_progress_track_v1.png`
- `hud_timer_progress_fill_v1.png`
- `hud_pause_button_v2.png`

Bottom nav candidate assets:

- `nav_bottom_bar_base_390w_v1.png`
- `nav_slot_base_v1.png`
- `nav_slot_active_v1.png`
- `nav_icon_task_v2.png`
- `nav_icon_procurement_v2.png`
- `nav_icon_inventory_v2.png`
- `nav_icon_upgrade_v2.png`
- `nav_icon_catalog_v2.png`
- `nav_alert_badge_v1.png`

Do not output:

- Gold amount text, countdown text, `x3`, entry labels, badge numbers, or any
  dynamic gameplay numbers.
- A single baked full-screen HUD/Nav bitmap.
- Any READY replacement or overlay. `ready_badge_compact.png` remains frozen.
- Product icons. The user will normalize and export those from Figma.

## Existing HUD v1 Reuse

Can be reused as style or subject reference before deciding to redraw:

- `hud_icon_coin_v1.png`
- `hud_icon_clock_v1.png`
- `hud_pause_button_v1.png`
- `nav_clipboard_icon_v1.png`
- `nav_basket_icon_v1.png`
- `nav_fridge_icon_v1.png`
- `nav_upgrade_icon_v1.png`
- `nav_book_icon_v1.png`

Should not be treated as final without target-image review:

- `hud_panel_coin_v1.png`
- `hud_panel_timer_v1.png`
- `hud_panel_reputation_v1.png`
- `bottom_nav_slot_v1.png`
- `bottom_nav_slot_active_v1.png`

Reason: old top panels read as separate light capsules, while the target image
uses a unified deep-purple top shell; old bottom slots are isolated, while the
target reads as one deep-purple bottom dock with embedded entries.

## Overview QA Gate

Every generated HUD/Nav batch must first output one overview image:

- `390x844` candidate composition next to the authoritative target image.
- Individual asset checks on transparent checkerboard and dark game background.
- Top HUD preview with placeholder runtime text only for scale, not baked into
  assets.
- Bottom nav preview with all five icons, active/highlight state, and alert
  badge sample.

Pass criteria:

- First glance matches target-image HUD/Nav structure: deep-purple top frame,
  coin/time/star/pause proportions, and deep-purple five-entry bottom dock.
- HUD/Nav does not steal focus from order bubble, customers, and product area.
- Five icons remain readable without text labels.
- Reused v1 icons, if any, do not look like a different asset batch.
- Product and Art/UI may approve the overview for Figma upload; Development/testing
  still performs path and interaction preflight before runtime.

## Development / Testing Preflight

Before Figma or runtime integration:

- Every Figma node needs `localPath`, `semanticId`, `state`, design size, and
  target coordinates.
- Block stale paths for old HUD, old bottom nav, old product card, old rice ball,
  and any archive path.
- Verify `semanticId -> icon -> click function -> active/disabled state`.
- Check alpha, dimensions, and hit areas; shadows must not enlarge touch blockers.
- Runtime screenshot requirements remain `390x844` target-vs-runtime and state
  contact sheets before any final acceptance.

## Current Gate

User has confirmed:

- Bottom nav order: `任务 / 采购 / 库存 / 升级 / 图鉴`.
- Top HUD meaning: `营业额/金币显示位 / 倒计时 / 星级目标 / 暂停`.
- Product icons remain outside this batch and will be supplied by the user from
  Figma.

## 2026-06-30 Candidate Output

Status: `candidate / overview-ready / not-figma-approved / not-runtime-final`

Output folder:

- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/`

Overview:

- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/_qa/hud_nav_target_v1_overview_2026_06_30.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/_qa/hud_nav_target_v1_390x844_preview.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/_qa/hud_nav_target_v1_assets_contact.png`

Package manifest:

- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/MANIFEST.md`

HUD assets:

- `hud/hud_top_frame_base_390w_v1.png`
- `hud/hud_coin_icon_v2.png`
- `hud/hud_clock_icon_v2.png`
- `hud/hud_pause_button_v2.png`
- `hud/hud_star_full_v1.png`
- `hud/hud_star_empty_v1.png`
- `hud/hud_timer_progress_track_v1.png`
- `hud/hud_timer_progress_fill_v1.png`

Nav assets:

- `nav/nav_bottom_bar_base_390w_v1.png`
- `nav/nav_slot_base_v1.png`
- `nav/nav_slot_active_v1.png`
- `nav/nav_icon_task_v2.png`
- `nav/nav_icon_procurement_v2.png`
- `nav/nav_icon_inventory_v2.png`
- `nav/nav_icon_upgrade_v2.png`
- `nav/nav_icon_catalog_v2.png`
- `nav/nav_alert_badge_v1.png`

Mechanical checks:

- All final candidate assets are RGBA PNGs.
- Final candidate asset count: 17.
- Alpha ranges are `0..255` for every final candidate asset.
- Generated icon sources remain in `_sources/`.
- Dynamic values are not baked into final candidate assets; any numbers or text
  in the overview are preview-only runtime placeholders.

Review note:

- First review request to Product, Art/UI, and Development/testing returned
  empty completion text.
- Follow-up readable Art/UI review: `pass-for-user-review`. Top HUD and bottom
  dock are close enough to the authoritative target to show the user; main
  risks are HUD crowding, spacing between coin/time/star, and a possible
  new-batch feel on inventory / upgrade icons.
- Follow-up readable Development/testing review: `pass-for-preflight`. The
  package is isolated, 17 final PNGs are mechanically valid, and the next
  preflight must only read `hud/` and `nav/`; `_qa/` and `_sources/` must not
  enter Figma/runtime.
- Product employee review is not available in the current environment. Do not
  mark this batch as Product / Art/UI / Development pass until Product/user
  review is complete.
