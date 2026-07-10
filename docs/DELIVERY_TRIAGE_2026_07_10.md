# Delivery Triage 2026-07-10

## Owner / Brief / Review / Record

- Owner: Coordination.
- Brief: One bounded delivery-triage round after P1-027. Separate the current
  playable gameplay candidate from local evidence, source art candidates, old
  deletion cleanup, and environment-generated noise.
- Review: This document does not claim new Product, Art/UI, or
  Development/testing acceptance. It only records routing. Any future staging,
  commit, deletion acceptance, or final art integration still needs the owning
  role checks from `AGENTS.md`.
- Record: This file and `docs/LOCAL_TASK_BOARD.md`.

## Scope Lock

- No runtime code was changed in this round.
- No art asset was generated, edited, moved, or promoted.
- No tracked deletion was staged or reverted.
- No git staging, commit, push, or cleanup was performed.
- Current target remains
  `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`.
- Current playable candidate remains `index.html?qaFlow=first-test-live&qaInteractive=1`.

## Current Snapshot

- Latest gameplay state: P1-027 passed. Occupied microwave drag release no
  longer opens a toast; it uses status text plus microwave shake.
- Latest automated QA recorded in project docs:
  - TypeScript check passed.
  - `git diff --check` passed for the P1-027 touched files.
  - Cocos web-mobile build succeeded; CLI still has the known historical `36`
    noise code.
  - `tmp/p1_drag_error_detext_qa.mjs` passed with console/pageerror `0`.
  - `tmp/p1_first_test_candidate_refresh_qa.mjs` passed with console/pageerror
    `0`.
- Current git shape from `git status --short`:
  - Modified tracked entries: `9`.
  - Deleted tracked entries: `361`.
  - Untracked top-level/status entries: `80`.
- Current untracked file count from
  `git ls-files --others --exclude-standard | wc -l`: `1119`.
- Note: `?? 80` is the number of top-level/status entries shown by git status,
  not the total number of untracked files.

## Bundle A: Current Gameplay Candidate

This is the likely future candidate bundle if the user later asks for staging
or delivery. It should be verified again before staging.

- Coordination / project guidance:
  - `AGENTS.md`
  - `docs/LOCAL_TASK_BOARD.md`
  - `docs/P1_FIRST_TEST_OBSERVATION_CARD_2026_07_03.md`
  - `docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md`
  - `docs/GIT_WORKTREE_TRIAGE_2026_07_09.md`
  - `docs/DELIVERY_TRIAGE_2026_07_10.md`
- Runtime and config:
  - `assets/scenes/Game.scene`
  - `assets/scripts/presentation/MonsterStorePrototype.ts`
  - `assets/scripts/data/EconomyConfig.ts`
  - `assets/scripts/data/ProcessingConfig.ts`
  - `assets/scripts/data/ProductCatalog.ts`
  - `assets/scripts/data/VerticalSliceConfig.ts`
- Current final runtime namespace:
  - `assets/resources/ui_gameplay_final_v1/`
- Current target image:
  - `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`
- Useful source utilities that may be needed for reproducibility:
  - `tools/prepare_customer_candidate.py`
  - `tools/probe_cutout_flow.py`
  - `tools/split_customer_animation_sheet.py`
  - `tools/split_customer_layer_sheet.py`

Do not automatically include local QA output in this bundle. `output/` and
`tmp/` are ignored local evidence areas. If a future delivery needs portable QA
proof, promote only a small selected contact sheet / summary into a tracked docs
asset folder in a separate reviewed step.

## Bundle B: Local Evidence And Source Candidates

These are useful for traceability and future final-art work, but should not be
mixed blindly into the gameplay candidate bundle.

- Manual exports:
  - `manual-figma-export-2026-07-02/`
  - `manual-figma-export-2026-07-02-normalized/`
- Runtime probe / P0 resource namespaces:
  - `assets/resources/ui_p0/`
  - `assets/resources/ui_probe_gameplay_v1/`
  - `assets/resources/ui_probe_gameplay_v2/`
  - `assets/resources/ui_probe_gameplay_v3/`
- Final art candidate workspace:
  - `assets/ui/final-candidates/gameplay-customers-animation-v1/`
  - `assets/ui/final-candidates/gameplay-customers-states-v1/`
  - `assets/ui/final-candidates/gameplay-equipment-v1/`
  - `assets/ui/final-candidates/gameplay-first-batch-v1/`
  - `assets/ui/final-candidates/gameplay-hud-nav-target-v1/`
  - `assets/ui/final-candidates/gameplay-order-bubble-states-v1/`
  - `assets/ui/final-candidates/gameplay-order-state-cues-v1/`
  - `assets/ui/final-candidates/gameplay-payment-feedback-v1/`
  - `assets/ui/final-candidates/gameplay-product-card-target-v1/`
  - `assets/ui/final-candidates/gameplay-products-target-v2/`
  - `assets/ui/final-candidates/gameplay-products-v2/`
  - `assets/ui/final-candidates/gameplay-ready-coin-patience-v1/`
  - `assets/ui/final-candidates/gameplay-retry-v1/`
- Project-local archive reference:
  - `archive/art-legacy-2026-06-27/`

Current Art/UI note from the backlog: the ready coin / patience, order state
cues, and payment feedback candidate packs are produced but pending Art/UI plus
user review. They are not runtime-final resources yet.

## Bundle C: Old Deletion Cleanup

There are `361` tracked deletions. Previous triage recorded that all deleted
paths now have an external archive copy under:

`/Users/ban/Documents/怪兽便利店-art-archive/art-deprecated-2026-06-28/`

Main deletion groups:

- `assets/reference/ui_samples*`
- `assets/resources/ui_generated*`
- `assets/resources/ui_generated_v3*`
- `assets/resources/ui_generated_v4*`
- `assets/resources/ui_formal_v1*`
- old gameplay mockups under `assets/ui/mockups/`
- old delivery / P0 planning docs under `docs/`
- old art concepts, targets, and UI screenshots under `docs/art/`

Do not stage these deletions blindly. They need a separate cleanup decision:
Product confirms they are not needed for player / scope history, Art/UI confirms
they are not needed as active references, and Development/testing confirms the
runtime no longer depends on them.

## Exclude Or Decide Separately

- `.gitignore`: likely keep as a small housekeeping change because it ignores
  local agent / QA noise, but do not hide it inside a runtime gameplay commit
  without review.
- `settings/v2/packages/information.json`: likely Cocos environment-generated
  form sid data. Prefer excluding unless Cocos requires it.
- `output/`: ignored local QA evidence. Keep on disk, do not commit wholesale.
- `tmp/`: ignored local QA scripts and one-off evidence helpers. Keep local
  unless a script becomes a maintained QA tool.
- `assets/resources/ui_formal_v2/` and `assets/resources/ui_layered/`: tracked
  existing resource namespaces, not part of this round's current gameplay
  candidate decision.
- `archive/art-legacy-2026-06-27/`: useful local reference, but current project
  archive policy points confirmed deprecated assets to the external archive
  path, not this in-project archive.

## Priority Task List

1. Keep `first-test-live` as the current candidate and stop adding runtime
   polish unless a new reproducible blocker appears.
2. If the user asks for a commit or handoff, do a staging dry-run first:
   candidate bundle, optional art/source bundle, and deletion-cleanup bundle
   must stay separate.
3. Before staging the `361` deletions, get explicit Product + Art/UI +
   Development/testing cleanup acceptance.
4. Before integrating final art candidates, run a separate Art/UI-owned brief
   and Development/testing-owned runtime integration path.
5. If portable QA evidence is needed, promote only selected contact sheets /
   summaries from ignored `output/` into a tracked docs evidence folder.

## Round Verdict

This round ends at documentation. The project is organized enough to decide a
future delivery path, but it is not yet safe to stage everything. The safest
next bounded task, if requested, is a staging dry-run plan, not cleanup.
