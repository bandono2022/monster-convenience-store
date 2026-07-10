# Final Art Brief: Ready Coin + Patience Pack

Date: 2026-07-04

## Owner / Brief / Review / Record

- Owner: Art/UI owns final asset style, prompt direction, candidate selection, and visual acceptance. Development/testing owns candidate packaging, alpha cleanup, integration-preview composition, and later runtime safety. Product owns priority: these assets must serve collection clarity and customer pressure, not add new mechanics. Coordination owns scope and records.
- Brief: produce the first small final-art candidate batch for two currently low-fi runtime-drawn areas: READY coin stacks on the counter and customer-local patience bars. Do not generate or replace READY badge parts. Do not generate a full-screen-only mockup. Deliver standalone PNG resources plus an integrated preview using the generated assets in the current gameplay context.
- Review: Art/UI checks style, scale, readable hierarchy, and target-image compatibility; Product checks collection and patience semantics; Development/testing checks transparent PNG quality, predictable placement, and no runtime rule dependency.
- Record: this file, `docs/LOCAL_TASK_BOARD.md`, `docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md`, and `assets/ui/final-candidates/gameplay-ready-coin-patience-v1/`.

## Scope

First candidate batch:

- `feedback/coin_stack_small_2.png`: 2-coin stack for sale `< 15`.
- `feedback/coin_stack_medium_4.png`: 4-coin stack for `15 <= sale < 30`.
- `feedback/coin_stack_large_8.png`: 8-coin stack for sale `>= 30`.
- `feedback/coin_collect_spark.png`: small optional collection sparkle, no text, no amount.
- `patience/patience_track_local.png`: vertical customer-local track.
- `patience/patience_fill_green.png`: calm/high patience fill.
- `patience/patience_fill_yellow.png`: warning/mid patience fill.
- `patience/patience_fill_red.png`: danger/low patience fill.
- `_qa/integration_preview_390x844.png`: preview showing generated assets placed into the current gameplay screen.

Out of scope:

- No READY badge generation or patching.
- No runtime code integration before candidate review.
- No Figma-authored rough drawing as final asset.
- No new gameplay rules, economy numbers, or touch-path changes.

## Art Direction

- Match the current target image: rounded mobile casual game UI, warm convenience-store palette, chunky readable forms, soft highlights, clean dark outline, no photorealism.
- Coin stacks should feel collectible and clickable on the counter, but must not cover the customer face, order bubble, microwave, cashier screen, or product cards.
- Patience bars should feel attached to each customer, not like player HP or top-goal progress. Keep them narrow, vertical, readable at 390x844, and clearly separate green/yellow/red states.
- Assets should be transparent PNG candidates after cleanup. If generation requires a chroma-key background, use it only as source material and remove it before candidate export.

## Prompt Direction

Coin sheet prompt:

```text
Create a clean mobile game UI sprite sheet on a flat pure green chroma-key background (#00ff00). Four isolated assets arranged in a 2x2 grid with generous empty space: top-left a small stack of exactly two shiny gold coins, top-right a medium stack of exactly four shiny gold coins, bottom-left a larger pile of exactly eight shiny gold coins, bottom-right a small golden collection sparkle burst. Style: cute polished 2D casual game art, warm gold coins, thick dark purple outline, soft cream highlights, matching a cozy monster convenience store game UI. No text, no numbers, no dollar signs, no shadows outside the asset, no full scene, no UI panels.
```

Patience sheet prompt:

```text
Create a clean mobile game UI sprite sheet on a flat pure magenta chroma-key background (#ff00ff). Four isolated vertical customer patience bar assets arranged side by side with generous empty space: a narrow rounded dark track with cream rim, a green fill segment, a yellow fill segment, and a red fill segment. Style: cute polished 2D casual game UI, thick dark purple outline, soft inner highlight, compact vertical bar that belongs beside a character. No heart icon, no text, no numbers, no top HUD progress bar, no full scene.
```

## Visual Acceptance

- Standalone PNGs must have clean alpha and no visible chroma-key halo at normal gameplay scale.
- Coin stacks must still read as 2 / 4 / 8 coin piles after downscaling into the current counter area.
- Patience track and fills must read as customer-local pressure indicators, not top HUD goal / HP.
- Integrated preview must show both left and right customer zones at 390x844 and demonstrate that the assets do not obscure orders, faces, equipment, or product cards.

## Candidate Path

`assets/ui/final-candidates/gameplay-ready-coin-patience-v1/`
