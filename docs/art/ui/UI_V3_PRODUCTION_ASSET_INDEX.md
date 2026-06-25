# UI V3 Production Asset Index

Preview:

- `assets/reference/ui_samples/v3_production_review/production_preview_sheet.png`

Production folder:

- `assets/resources/ui_generated_v3/`

## Status

This batch is generated from the user-approved reference image.

No gameplay code, scene, prefab, or core logic was changed.

## Generated Assets

| File | Source | Size | Transparent | Suggested Use | Nine-slice |
|---|---|---:|---|---|---|
| `assets/resources/ui_generated_v3/topbar/top_hud_panel_ref.png` | Reference crop | 911x194 | Yes | Top HUD shell / visual standard | Not direct; split later if dynamic layout needs scaling |
| `assets/resources/ui_generated_v3/order/order_bubble_selected_ref.png` | Reference crop | 447x322 | Yes | Current customer order bubble | Yes, after separating tail and item slots if needed |
| `assets/resources/ui_generated_v3/order/order_bubble_normal_ref.png` | Reference crop | 466x322 | Yes | Non-current customer order bubble | Yes, after separating tail and item slots if needed |
| `assets/resources/ui_generated_v3/product_card/product_card_heat_ref.png` | Reference crop | 303x376 | Yes | Product card with heat badge | Prefer fixed size first |
| `assets/resources/ui_generated_v3/product_card/product_card_star_ref.png` | Reference crop | 301x376 | Yes | Product card with star badge | Prefer fixed size first |
| `assets/resources/ui_generated_v3/product_card/product_card_leaf_ref.png` | Reference crop | 304x376 | Yes | Product card with leaf badge | Prefer fixed size first |
| `assets/resources/ui_generated_v3/common/badge_inventory_ref.png` | Reference crop | 169x147 | Yes | Inventory / stock badge | No |
| `assets/resources/ui_generated_v3/common/badge_heat_ref.png` | Reference crop | 141x153 | Yes | Heating-required badge | No |
| `assets/resources/ui_generated_v3/common/badge_empty_slot_ref.png` | Reference crop | 184x153 | Yes | Empty slot / placeholder badge | No |
| `assets/resources/ui_generated_v3/common/badge_warning_ref.png` | Reference crop | 157x151 | Yes | Warning / wrong operation badge | No |
| `assets/resources/ui_generated_v3/common/badge_complete_ref.png` | Reference crop | 133x153 | Yes | Completed / check badge | No |

## Held Back

The feedback plaques were extracted for review but not kept in `assets/resources/ui_generated_v3/`.

Reason:

- Their inner cream panels are visually too close to the source background.
- Automatic background removal damages the interior fill.
- They should be manually rebuilt or generated as dedicated transparent assets.

Held-back files:

- `assets/reference/ui_samples/v3_production_review/needs_rebuild_feedback/feedback_plaque_purple_ref.png`
- `assets/reference/ui_samples/v3_production_review/needs_rebuild_feedback/feedback_plaque_gold_ref.png`
- `assets/reference/ui_samples/v3_production_review/needs_rebuild_feedback/feedback_plaque_teal_ref.png`

## Integration Notes

- Product cards can be tested first because they are fixed-size UI buttons.
- Order bubbles need careful positioning with customer heads before integration.
- HUD panel likely needs either separate panel pieces or a fixed-size topbar sprite, depending on the final responsive layout.
- Cocos text should remain dynamic; do not bake Chinese labels into these images.
- These assets preserve reference-image shadows. If the scene already adds shadow via code, avoid double shadows.

## Recommended Next Step

After visual approval:

1. Integrate product card sprites first.
2. Then integrate order bubble sprites.
3. Then test HUD panel replacement.
4. Rebuild feedback plaques separately.
