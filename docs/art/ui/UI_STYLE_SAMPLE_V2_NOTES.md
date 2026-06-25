# UI Style Sample V2 Notes

This sample is a visual direction check, not a production integration.

## Intent

- Move away from basic placeholder SVGs.
- Match the target image direction more closely: thick outline, cream panels, teal UI, coral warning color, gold reward accents.
- Keep text areas mostly blank so Cocos `Label` nodes render Chinese text cleanly.
- Validate component quality before splitting into individual resources.

## Included Components

- Top HUD panel direction
- Order bubble direction
- Product shelf card direction
- Inventory / heat / complete / warning badge direction
- Feedback plaque direction

## Not Done Yet

- No scene code changes
- No Cocos resource binding
- No final nine-slice slicing
- No transparent PNG export
- No full batch replacement of the previous generated SVGs

## Suggested Review

Check whether the following feel close enough before asset splitting:

- Stroke weight
- Color palette
- Warm cream panel material
- Product card as shelf inventory instead of purchase card
- Order bubble readability
- Feedback plaque energy

If approved, the next step is to split only 3-5 confirmed assets into production-sized files first: product card, selected product card, order bubble, HUD panel, and core badges.
