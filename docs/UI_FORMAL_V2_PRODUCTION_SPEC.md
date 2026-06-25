# UI Formal V2 Production Spec

## Source And Output

- ImageGen high-resolution masters remain in `assets/resources/ui_formal_v2/hud/` and `assets/resources/ui_formal_v2/order/`.
- Cocos-ready copies are exported to `assets/resources/ui_formal_v2/production/`.
- Production copies use transparent PNG and retain a small safety margin for outlines and shadows.
- No production asset is currently bound to a scene or prefab.

## Production Sizes

| Asset | Output size | Display role | Sprite type |
|---|---:|---|---|
| `hud_panel_teal.png` | 256 x 80 | Revenue / currency HUD base | Sliced |
| `hud_panel_timer.png` | 256 x 80 | Countdown HUD base | Sliced |
| `icon_coin.png` | 96 x 96 | Revenue icon | Simple |
| `icon_clock.png` | 96 x 96 | Time icon | Simple |
| `icon_star.png` | 96 x 96 | Currency icon | Simple |
| `icon_heart.png` | 96 x 96 | Satisfaction / patience icon | Simple |
| `icon_pause.png` | 96 x 96 | Pause menu trigger | Simple |
| `order_bubble_selected.png` | 320 x 224 | Active customer order | Sliced |
| `order_bubble_normal.png` | 320 x 224 | Secondary customer order | Sliced |

## Nine-Slice Insets

Insets are measured in production-image pixels.

| Asset | Left | Right | Top | Bottom | Notes |
|---|---:|---:|---:|---:|---|
| HUD panels | 64 | 28 | 20 | 20 | Protects the rounded left cap and right edge; only the recessed center stretches. |
| Selected bubble | 112 | 40 | 40 | 62 | Protects the outline, shadow, and lower-left speech tail. |
| Normal bubble | 112 | 40 | 40 | 62 | Uses the same binding contract as the selected state. |

## Binding Rules

- Keep icons, labels, numbers, order items, hearts, and patience fills as separate nodes.
- Do not bake dynamic text or order content into these PNGs.
- The bubble tail belongs to the background asset; customer-order content must remain inside the central safe area.
- The order bubble has no dashed item slots. Item layout is controlled by Cocos nodes.
- Use the production copies for integration. Keep the masters as regeneration and high-resolution archive sources.
