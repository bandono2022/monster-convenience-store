# P0 Customer Layered Asset Spec

Date: 2026-06-26

Owner roles:

- Boyle: product acceptance
- Hume: art/UI asset production
- James: development/test integration

## Goal

Make the gameplay first screen read like the target mockup: the left customer is the active service subject, with visible upper body and hands resting on the counter. The right customer is a secondary waiting subject. This task stays limited to the gameplay first screen.

Out of scope: HUD final polish, product card final art, bottom navigation, economy values, order rules, new gameplay, new employees.

## Required Assets

Minimum required transparent PNGs:

- `assets/resources/game-art/characters-layered/normal/waiting/body.png`
- `assets/resources/game-art/characters-layered/normal/waiting/hands.png`

Optional later asset:

- `assets/resources/game-art/characters-layered/normal/waiting/ready_glow.png`

## Body Asset

File:

- `body.png`

Canvas:

- Recommended: `420 x 520px`
- Transparent background
- Anchor expectation: `anchorX 0.5`, `anchorY 0`

Content:

- Red one-eyed horned monster matching the current normal customer.
- Head, horns, upper chest/body, shoulders, and enough torso to be hidden by the counter.
- Do not bake the counter into the image.
- Do not draw hands that must appear above the counter foreground in this layer.

Transparent margin:

- Left/right: `28-36px`
- Top: `20-28px`
- Bottom: `20px`

Placement intent:

- Character center aligns with the current customer center.
- Body bottom sits below the counter top so `renderCounterForeground()` hides the lower body.

## Hands Asset

File:

- `hands.png`

Canvas:

- Recommended: `420 x 180px`
- Transparent background
- Anchor expectation: `anchorX 0.5`, `anchorY 0.5`

Content:

- Two hands or forearms resting on the counter front edge.
- Same red skin, thick dark outline, simple flat shading.
- Must be visually separate enough from body to sit above `CounterLip`.
- Do not include the body or counter surface.

Transparent margin:

- Left/right: `24-32px`
- Top/bottom: `16-24px`

Placement intent:

- Hands are drawn after `renderCounterForeground()`.
- Palm center sits near the counter lip, approximately `counterTop - 8px` to `counterTop - 12px` visually.

## Right Customer

For P0, the right customer can reuse `body.png` at `0.72-0.78` of the left customer scale.

The right customer should not draw `hands.png` in P0, so it remains a secondary waiting customer and does not compete with the left READY customer.

## Prompt For Generated Draft Art

Use this prompt when producing the draft PNGs:

```text
Create a transparent-background 2D mobile game character asset in a cute monster convenience store style. The character is a red one-eyed horned monster matching an existing red round monster: one large glossy black-and-white eye, two yellow striped horns, teal hair tuft, soft cheek spots, thick dark outline, flat clean colors, playful mobile game UI art.

Asset A body.png: upper-body only, including head, horns, teal hair tuft, shoulders, upper torso and rounded body volume. The lower body should continue downward enough to be hidden behind a counter. Do not include hands resting on the counter, do not include any background or counter. Centered composition, transparent background, 420x520.

Asset B hands.png: two red monster hands/forearms resting on a counter edge, same thick dark outline and flat color style. No body, no counter, transparent background, 420x180. Hands should look like they can be placed above a counter lip in front of the body.
```

## Product Acceptance

P0 pass after integration requires:

- Left customer clearly reads as the active service subject with upper body, hands, and counter occlusion relationship.
- Right customer clearly reads as a secondary waiting subject and is not just a duplicate exposed head.
- In a `750x1334` full screenshot, left READY bubble, two customers, counter layering, microwave/cashier, and two product rows remain visible and coherent.
