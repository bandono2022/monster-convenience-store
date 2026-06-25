# UI Style Target V3

Reference image:

- `assets/reference/ui_samples/ui_style_target_v3.png`

## Decision

Use this image as the current UI art target for the main gameplay screen.

The previous `ui_generated` SVG batch is kept as structure and naming reference only. It should not be treated as final visual quality.

## Why This Direction Works

- Components feel like one commercial mobile game UI set, not separate placeholders.
- Thick dark outlines are consistent across HUD, order bubbles, cards, badges, and feedback plaques.
- Panels have soft volume without becoming too realistic.
- Cream card surfaces, teal frames, coral warning red, and gold reward accents match the existing monster convenience store tone.
- Placeholder slots are clear, which is good for Cocos-rendered products and labels.
- Product cards read more like shelf inventory than purchase buttons.
- Feedback plaques have stronger reward emotion and can support combo / perfect / good moments.

## Style Rules

- Keep Cocos text dynamic. Do not bake Chinese UI text into generated art unless it is a special stamp.
- Use thick outlines and soft shadows, but avoid excessive glossy effects.
- Prefer warm cream inner panels with teal frames.
- Use coral red only for urgency, warning, or current selection.
- Use purple for secondary customer/order state.
- Use gold for reward, currency, star, and positive result.
- Product cards should reserve a large centered product area and a small bottom inventory/status pill.
- Order bubbles should reserve clear item slots and patience bar space.

## First Assets To Produce

Only produce a small approved batch first:

1. `top_hud_panel`
2. `order_bubble_selected`
3. `order_bubble_normal`
4. `product_card_normal`
5. `product_card_selected`
6. `inventory_pill`
7. `heat_badge`
8. `complete_badge`
9. `warning_badge`
10. `feedback_badge_perfect`

## Do Not Produce Yet

- Full background replacement
- Full decorative set
- All feedback plaques
- All product card categories
- New product icons
- New device art
- Final PNG atlas packing

## Next Step

Generate or draw the first 3-5 production-sized sample assets from this style, save them in a review folder, and wait for confirmation before integrating them into Cocos.
