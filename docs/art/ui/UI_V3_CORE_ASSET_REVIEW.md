# UI V3 Core Asset Review

Review folder:

- `assets/reference/ui_samples/v3_core_review/`

## Files

| File | Purpose | Status |
|---|---|---|
| `top_hud_panel_v3.svg` | Top gameplay HUD style sample | Review |
| `order_bubble_selected_v3.svg` | Current customer order bubble | Review |
| `order_bubble_normal_v3.svg` | Non-current / secondary customer order bubble | Review |
| `product_card_normal_v3.svg` | Product shelf card normal state | Review |
| `product_card_selected_v3.svg` | Product shelf card selected / actionable state | Review |
| `badges_v3.svg` | Inventory, heat, warning, complete badge direction | Review |
| `feedback_badge_perfect_v3.svg` | Perfect / reward plaque direction | Review |
| `ui_v3_core_review_sheet.svg` | Combined review sheet | Review |

## Notes

- These are not integrated into the scene.
- These do not replace existing `assets/resources/ui_generated/` files.
- Text areas are mostly blank so Cocos can render Chinese labels dynamically.
- The shapes are designed to be converted later into PNG / nine-slice-friendly assets.

## Review Questions

- Is the stroke weight close enough to the target image?
- Are the order bubbles too large, too soft, or just right?
- Does the product card read as shelf inventory instead of purchase UI?
- Are heat / warning / complete badges clear enough for small phone screens?
- Does the feedback badge have enough reward feeling?

## Suggested Next Step After Approval

Convert only approved assets into production resources:

- PNG preview with transparent background
- Nine-slice recommendations
- Cocos import path under `assets/resources/ui_generated_v3/`
- Presentation-layer integration plan
