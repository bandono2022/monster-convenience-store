# UI V3 Reference Extracts

Source:

- `assets/reference/ui_samples/ui_style_target_v3.png`

Review folder:

- `assets/reference/ui_samples/v3_reference_extract/`

## Purpose

The user confirmed that the approved reference image should be the UI art direction.

These extracted images are source standards. They are used to lock the target shape, color, stroke weight, shadow style, and component proportions.

They are not final Cocos production assets yet because the source image is a flattened PNG with baked background and shadows.

## Extracted Files

| File | Purpose | Notes |
|---|---|---|
| `reference_extract_sheet.png` | Combined review sheet | Main review image |
| `ref_top_hud_panel.png` | HUD source standard | Needs production rebuild for dynamic labels |
| `ref_order_bubble_selected.png` | Current order bubble source standard | Needs transparent / nine-slice version |
| `ref_order_bubble_normal.png` | Secondary order bubble source standard | Needs transparent / nine-slice version |
| `ref_product_card_heat.png` | Product card with heat badge | Source standard |
| `ref_product_card_star.png` | Product card with star badge | Source standard |
| `ref_product_card_leaf.png` | Product card with category badge | Source standard |
| `ref_core_badges.png` | Core badge source standards | Can be split after approval |
| `ref_feedback_badges.png` | Feedback plaque source standards | Can be split after approval |

## Next Production Step

Rebuild the approved pieces as production assets:

- Transparent PNG
- Nine-slice-friendly panels where needed
- No baked Chinese text
- No source-sheet numbers
- Keep Cocos labels dynamic
- Save to `assets/resources/ui_generated_v3/` only after confirmation

## Production Priority

1. Product card normal / heat / selected
2. Order bubble selected / normal
3. HUD panel pieces
4. Core badges: inventory, heat, complete, warning
5. Feedback plaque
