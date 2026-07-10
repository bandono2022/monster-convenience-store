# Staging Dry-Run 2026-07-10

## Owner / Brief / Review / Record

- Owner: Coordination.
- Brief: Convert the delivery triage into a role-reviewed staging dry-run plan.
  Do not stage, delete, move, or edit runtime/art assets.
- Review: Product, Art/UI, and Development/testing all returned `Go for
  staging dry-run only` / equivalent. All three rejected `stage all`.
- Record: This file and `docs/LOCAL_TASK_BOARD.md`.

## Team Gate

Owner gate for this round:

```text
Owner: Coordination owns the staging dry-run plan.
Brief: Product, Art/UI, and Development/testing reviewed what can be grouped.
Review: Product checks player/scope value; Art/UI checks visual/source value;
Development/testing checks runtime dependency and verification.
Record: docs/STAGING_DRY_RUN_2026_07_10.md.
```

Persistent employee note: this round used temporary read-only sub-agents because
the previous persistent employee thread ids were not available in the current
context. No sub-agent edited files.

## Shared Verdict

- Do not run `git add .`.
- Do not stage the `361` deletions with gameplay candidate work.
- Do not stage `assets/ui/final-candidates/**` as runtime-final resources.
- Do not commit `output/` or `tmp/` wholesale.
- Keep `first-test-live` / P1-027 as the current gameplay candidate.
- Stop runtime polish unless a new reproducible blocker appears.

## Bundle A: Gameplay Candidate

These paths are the likely candidate for a future reviewed gameplay staging
round. They still need one last verification pass before any real staging.

### Runtime / Config

- `assets/scenes/Game.scene`
- `assets/scripts/presentation/MonsterStorePrototype.ts`
- `assets/scripts/data/EconomyConfig.ts`
- `assets/scripts/data/ProcessingConfig.ts`
- `assets/scripts/data/ProductCatalog.ts`
- `assets/scripts/data/VerticalSliceConfig.ts`

### Current Runtime Visual Namespace

- `assets/resources/ui_gameplay_final_v1.meta`
- `assets/resources/ui_gameplay_final_v1/`

This directory should include both PNG files and Cocos `.meta` files. Art/UI
and Development/testing both treat it as the current runtime namespace.

### Target Image

- `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`
- `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png.meta`

This is the only current gameplay target image.

### Current Coordination / QA Docs

- `AGENTS.md`
- `docs/LOCAL_TASK_BOARD.md`
- `docs/P1_FIRST_TEST_OBSERVATION_CARD_2026_07_03.md`
- `docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md`
- `docs/GIT_WORKTREE_TRIAGE_2026_07_09.md`
- `docs/DELIVERY_TRIAGE_2026_07_10.md`
- `docs/STAGING_DRY_RUN_2026_07_10.md`

### Current Guidance, Not Runtime Dependency

- `docs/art/ART_GUIDE.md`

Product wants this retained as current guidance. Development/testing notes it is
not a runtime dependency. Treat it as a document/guidance decision, not as proof
that runtime staging is safe.

### Optional Reproducibility Tools

- `tools/prepare_customer_candidate.py`
- `tools/probe_cutout_flow.py`
- `tools/split_customer_animation_sheet.py`
- `tools/split_customer_layer_sheet.py`

These can be included if the delivery needs to preserve how customer candidate
assets were prepared. They are not runtime dependencies.

## Bundle B: Art Source / Candidate Bundle

Keep separate from Bundle A unless Art/UI explicitly asks for a source-art
handoff.

- `manual-figma-export-2026-07-02/`
- `manual-figma-export-2026-07-02-normalized/`
- `assets/ui/final-candidates/**`
- `assets/resources/ui_p0/`
- `assets/resources/ui_probe_gameplay_v1/`
- `assets/resources/ui_probe_gameplay_v2/`
- `assets/resources/ui_probe_gameplay_v3/`
- `assets/resources/ui_formal_v2/`
- `assets/resources/ui_layered/`
- `archive/art-legacy-2026-06-27/`

Art/UI verdict:

- `assets/ui/final-candidates/**` are source/candidate resources, not current
  runtime-final resources.
- `gameplay-ready-coin-patience-v1/`,
  `gameplay-order-state-cues-v1/`, and
  `gameplay-payment-feedback-v1/` remain pending Art/UI plus user review.
- `_sources/`, `_qa/`, integration previews, and contact sheets are review
  evidence, not runtime proof.

## Bundle C: Deletion Cleanup Bundle

There are `361` tracked deletions. They must be staged only in a separate
cleanup round after explicit role acceptance.

Known deletion groups:

- `assets/reference/ui_samples*`
- `assets/resources/ui_generated*`
- `assets/resources/ui_generated_v3*`
- `assets/resources/ui_generated_v4*`
- `assets/resources/ui_formal_v1*`
- old mockups under `assets/ui/mockups/`, excluding
  `gameplay-main-order-bubble-ready-v2.png`
- old delivery / P0 planning docs under `docs/`
- old concepts, targets, and UI screenshots under `docs/art/`

Cleanup acceptance gates:

- Product: confirms these old resources/docs no longer serve the current player
  goal or required scope history.
- Art/UI: confirms they are no longer active references, targets, final
  candidates, or needed source art.
- Development/testing: confirms `first-test-live`, `ui_gameplay_final_v1`,
  fallback paths, and Cocos asset references no longer depend on them.
- Coordination: confirms every staged deletion has an external archive copy.

Current archive note from prior triage: all `361` deleted paths were recorded as
present under
`/Users/ban/Documents/怪兽便利店-art-archive/art-deprecated-2026-06-28/`.
Re-check this before real deletion staging.

Product-specific caution: some deleted old docs still contain reusable lessons
even if their target is obsolete. In particular:

- `docs/M1_VERTICAL_SLICE_ACCEPTANCE.md`
- `docs/DELIVERY_AND_FEEDBACK_PLAN.md`
- `docs/DELIVERY_FEEDBACK_TODO.md`
- `docs/art/V3_1_VISUAL_SPEC.md`
- `docs/art/ui/UI_STYLE_TARGET_V3.md`
- `docs/art/ui/UI_V3_REFERENCE_EXTRACTS.md`
- `docs/art/ui/UI_V3_CORE_ASSET_REVIEW.md`
- `docs/art/ui/UI_V3_PRODUCTION_ASSET_INDEX.md`

If cleanup proceeds, confirm whether the external archive is enough or whether a
small lesson summary should be promoted into current docs first.

## Bundle D: Housekeeping / Exclude

- `.gitignore`: likely useful housekeeping because it ignores local agent and
  QA noise. Keep separate from runtime gameplay staging.
- `settings/v2/packages/information.json`: exclude by default. The current diff
  only changes Cocos form sid URLs and looks environment-generated.
- `output/`: ignored local QA evidence. Do not commit wholesale.
- `tmp/`: ignored temporary QA scripts / helpers. Do not commit wholesale.
- `.DS_Store` or editor/system files: exclude.

If portable QA proof is needed, do a separate tiny round that promotes only
selected contact sheets or summaries from `output/` into a tracked docs evidence
folder.

## Future Verification Before Real Staging

Run only when the user asks to actually prepare staging or handoff.

1. `git diff --check` on the selected pathspecs.
2. TypeScript check:
   `tsc --noEmit --pretty false --skipLibCheck --lib ES2017,DOM`.
3. Cocos `web-mobile` build. The historical CLI `36` noise is acceptable only
   when the build log ends in success.
4. `node tmp/p1_drag_error_detext_qa.mjs`.
5. `node tmp/p1_first_test_candidate_refresh_qa.mjs`.
6. 390x844 smoke on `index.html?qaFlow=first-test-live&qaInteractive=1`:
   normal order, rice ball into microwave, microwave ready, hot rice order,
   coin click, natural settlement / business-center return.

## Product Later, Not Staging Blockers

- End-of-day unsold heated rice ball handling.
- Late-game inventory pressure tuning.
- Whether selected QA evidence should become portable tracked docs.

These should not block the dry-run unless the user explicitly promotes one to a
candidate blocker.

## Round Verdict

The next safe action after this document is still not `stage all`. If the user
asks for real delivery, run a reviewed pathspec-based staging preparation using
Bundle A first, then handle Bundle B and Bundle C as separate decisions.
