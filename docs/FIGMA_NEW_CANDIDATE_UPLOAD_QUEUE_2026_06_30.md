# Figma New Candidate Upload Queue 2026-06-30

Status: `product-card-ready / product-icons-v2-waiting-overview-review / counter-hand-ledge-waiting-overview-review / counter-scene-removed / figma-upload-blocked-by-usage-limit`

Figma file:

- `https://www.figma.com/design/Q8wMVbJYaJ6QDR4ggrHZGo`

Upload target:

- Page: `Monster Store Art Placement`
- Place near the existing resource board, not inside `PLACEMENT_CANVAS__390x844 01/02`.
- Suggested section name: `NEW_CANDIDATES__2026_06_30`

## Assets To Upload

Do not upload anything from the 2026-06-30 v2 art batch until the user passes
the overview gate:

- `assets/ui/final-candidates/gameplay-art-round-2026-06-30/_qa/next_round_art_overview_2026_06_30.png`

### Product Card

- Node name: `ART__product-card__product_card_base_target_v1`
- Local path: `assets/ui/final-candidates/gameplay-product-card-target-v1/product_card_base_target_v1.png`
- Category: `product-card`
- Status: `candidate_needs_placement_review`
- Note: `205x180 transparent card body only; no stock badge, no number, no icon, no selected glow.`

## Pending User Overview Review

These assets have Product, Art/UI, and Development/testing `conditional pass`
for showing to the user, but they are not upload-approved and not runtime final:

### Product Icons V2

- Future node name: `ART__product__product_rice_ball_target_v2`
  - Local path: `assets/ui/final-candidates/gameplay-products-target-v2/products/product_rice_ball_target_v2.png`
  - Category: `product`
  - Status: `candidate_waiting_user_overview_review`
  - Note: `1254x1254 transparent icon; check card-scale body size against target.`
- Future node name: `ART__product__product_chocolate_milk_target_v2`
  - Local path: `assets/ui/final-candidates/gameplay-products-target-v2/products/product_chocolate_milk_target_v2.png`
  - Category: `product`
  - Status: `candidate_waiting_user_overview_review`
  - Note: `1254x1254 transparent icon; Art/Product flagged slightly narrow/weak in card scale.`
- Future node name: `ART__product__product_candy_bag_target_v2`
  - Local path: `assets/ui/final-candidates/gameplay-products-target-v2/products/product_candy_bag_target_v2.png`
  - Category: `product`
  - Status: `candidate_waiting_user_overview_review`
  - Note: `1254x1254 transparent icon; Art/UI flagged slightly neon/bright.`

### Counter Hand Ledge

- Future node name: `ART__counter__counter_hand_ledge_v1`
  - Local path: `assets/ui/final-candidates/gameplay-counter-hand-ledge-v1/counter/counter_hand_ledge_v1.png`
  - Category: `counter`
  - Status: `candidate_waiting_user_overview_review`
  - Note: `390x90 transparent horizontal hand ledge only; not a full counter scene. Art/UI flagged slightly orange and regular segment rhythm.`

## Required Shared Plugin Data

Namespace: `monster_store_art`

Keys:

- `localPath`
- `category`
- `status`
- `note`
- `sourceName`
- `originalWidth`
- `originalHeight`

## Follow-Up Gate

Before upload:

1. Produce one overview image / QA contact sheet for the current art batch.
2. User, Art/UI, and Product review the overview image first.
3. Only assets that pass this overview review may be uploaded to Figma.

After passed assets are placed in Figma and the user replaces stale nodes:

1. Development/testing reads `PLACEMENT_CANVAS__390x844 01/02`.
2. Block any `localPath` pointing to archived old product cards, archived old attention border, or archived old rice ball.
3. Check all `localPath` files exist locally.
4. Check duplicate product nodes, especially overlapping snack bag nodes.
5. Output `ready_manifest` / `blocked_manifest` before any runtime work.

## Do Not Upload

- `assets/ui/final-candidates/gameplay-products-target-v1/products/product_rice_ball_square_v1.png`
- `assets/ui/final-candidates/gameplay-products-target-v1/products/product_chocolate_milk_v1.png`
- `assets/ui/final-candidates/gameplay-products-target-v1/products/product_candy_bag_v1.png`
- `assets/ui/final-candidates/gameplay-counter-scene-v1/counter_scene_base_390x844_v1.png`

Reason:

- User and Art/UI rejected the newly generated product icons as target-mismatch: rice ball is too realistic/textured, chocolate milk is too tall/narrow, candy bag is too tall/complex and color-noisy.
- User rejected the full-canvas counter scene direction.
- It is not suitable for multi-size runtime adaptation.
- Counter-area solid/simple shapes will be drawn in Figma and restored by Development/testing in Cocos runtime.
- Existing device shelf / placement board resources should be reused.
- `counter_hand_ledge_v1` now exists as a pending overview-review candidate; it is not upload-approved until the user passes the overview gate.
