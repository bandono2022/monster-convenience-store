# Final Art Brief: Payment Feedback Pack

Date: 2026-07-04

## Owner / Brief / Review / Record

- Owner: Art/UI owns payment feedback style, prompt direction, candidate selection, and visual acceptance. Product owns the collection feedback goal: clicking coins should feel rewarding and clearly increase revenue. Development/testing owns candidate packaging, alpha cleanup, integration-preview composition, and later runtime safety. Coordination owns scope and records.
- Brief: produce a small final-art candidate pack for cashier/payment feedback. The current P0 cashier burst assets contain baked amounts, which conflicts with runtime dynamic values. This pack must provide empty, reusable visual parts only.
- Review: Art/UI checks readability, target-image compatibility, and no baked number/text; Product checks reward clarity; Development/testing checks transparent PNG quality and preview placement near the cashier.
- Record: this file, `docs/LOCAL_TASK_BOARD.md`, `docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md`, and `assets/ui/final-candidates/gameplay-payment-feedback-v1/`.

## Scope

Standalone PNG candidates:

- `payment/payment_burst_capsule_empty.png`: empty cashier income pill with space for runtime amount text.
- `payment/payment_coin_token.png`: small shiny coin token for fly / burst animation.
- `payment/payment_sparkle_cluster.png`: small sparkle cluster for successful collection.
- `payment/cashier_success_glow.png`: soft local glow that can sit behind or near the cashier screen.

QA:

- `_qa/payment_feedback_asset_contact_sheet.png`
- `_qa/integration_preview_payment_feedback_390x844.png`

Out of scope:

- No baked numbers, no `+24`, no `+48`, no currency text.
- No cashier redraw.
- No gameplay or economy rule change.
- No runtime code integration before review.

## Prompt Direction

```text
Create a clean mobile game UI sprite sheet on a flat pure magenta chroma-key background (#ff00ff). Four isolated payment feedback assets arranged in a 2x2 grid with generous empty space: 1) an empty rounded dark teal cashier income capsule with a small gold coin medallion on the left and blank space on the right for runtime amount text, 2) a single shiny gold coin token, 3) a small golden sparkle cluster, 4) a soft warm yellow-green local glow for behind a cashier screen. Cute polished 2D casual mobile game UI, thick dark purple outline, soft cream highlights, matching a cozy monster convenience store game. No text, no numbers, no plus sign, no full cashier, no full scene.
```

## Visual Acceptance

- The capsule must contain no baked amount, no plus sign, and no text.
- Capsule should remain readable when placed near the cashier in 390x844.
- Coin and sparkle assets should be usable separately for fly/burst feedback.
- Preview must show that the capsule can sit near the cashier without being clipped by the right edge.

## Candidate Path

`assets/ui/final-candidates/gameplay-payment-feedback-v1/`
