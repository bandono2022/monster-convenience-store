# Final Art Brief: Order State Cues Pack

Date: 2026-07-04

## Owner / Brief / Review / Record

- Owner: Art/UI owns state-cue style, prompt direction, candidate selection, and visual acceptance. Product owns semantic priority: the cue must help players understand hot demand, partial completion, heating, ready-to-pickup, valid drop, and invalid drop. Development/testing owns candidate packaging, alpha cleanup, integration-preview composition, and later runtime safety. Coordination owns scope and records.
- Brief: produce a small final-art candidate pack for order-slot and drag/drop status cues currently represented by low-fi runtime tint, dots, and outlines. Do not redraw product icons. Do not generate READY badge parts. Do not change gameplay rules.
- Review: Art/UI checks that cues are readable at order-slot scale without covering product icons; Product checks that cue meaning is not confused with price, stock, or top HUD goals; Development/testing checks transparent PNG quality and preview placement.
- Record: this file, `docs/LOCAL_TASK_BOARD.md`, `docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md`, and `assets/ui/final-candidates/gameplay-order-state-cues-v1/`.

## Scope

Standalone PNG candidates:

- `order/hot_required_flame_badge.png`: tiny flame badge for hot-food demand.
- `order/item_filled_check_badge.png`: mini completed/filled badge for a slot item.
- `order/heating_steam_cue.png`: small orange steam wisps for an item currently heating.
- `order/microwave_ready_spark_cue.png`: small gold sparkle cue for microwave-ready / ready-to-pickup.
- `drag/drop_target_valid_rim.png`: rounded slot rim for a valid drag target.
- `drag/drop_target_invalid_x.png`: compact red invalid drop mark.

QA:

- `_qa/order_state_cues_asset_contact_sheet.png`
- `_qa/integration_preview_order_state_cues_390x844.png`

Out of scope:

- No product icon redraw.
- No full order bubble redraw.
- No READY badge generation or patching.
- No runtime code integration before review.

## Prompt Direction

```text
Create a clean mobile game UI sprite sheet on a flat pure blue chroma-key background (#0000ff). Six isolated small overlay assets arranged in a 3x2 grid with generous empty space: 1) a tiny round orange flame badge for hot-food required, 2) a small green check badge for completed item slot, 3) three soft orange steam wisps for heating-in-progress, 4) a small golden sparkle corner cue for microwave-ready pickup, 5) a rounded square valid drop target rim with warm yellow-green glow and transparent center, 6) a compact red invalid drop X mark with tiny shake accents. Cute polished 2D casual mobile game UI, thick dark purple outline, soft cream highlights, readable at 40-60px order-slot scale, matching a cozy monster convenience store game. No text, no numbers, no product icons, no full order bubble, no full scene.
```

## Visual Acceptance

- All assets must remain legible when downscaled to current order-slot scale.
- Cues must not hide the product icon: badges should sit in a corner or around the slot, and rim should have a transparent center.
- Hot-food cue must not look like an inventory warning or bottom nav icon.
- Invalid mark must be small and local, not a modal/error panel.
- Integration preview must show partial, heating, and microwave-ready contexts without claiming runtime integration.

## Candidate Path

`assets/ui/final-candidates/gameplay-order-state-cues-v1/`
