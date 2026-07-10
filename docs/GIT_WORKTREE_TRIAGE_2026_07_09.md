# Git Worktree Triage 2026-07-09

## Owner / Brief / Review / Record

- Owner: Coordination + Development/testing.
- Brief: Reduce Git noise and separate current gameplay work from local QA artifacts, raw exports, resource migration, and old deletion records.
- Review: Product and Art/UI must confirm before old art/docs deletions are treated as final cleanup.
- Record: This file and `.gitignore`.

## Safe Change Already Done

`.gitignore` now ignores local-only agent and QA artifacts:

- `.codex/`
- `.listenhub/`
- `.playwright-cli/`
- `output/`

No files were deleted. These directories remain on disk but no longer pollute `git status`.

## Current Git Shape After Noise Reduction

- Modified tracked files: 9.
- Deleted tracked files: 361.
- Untracked path groups: 79 top-level status entries.

Modified tracked files:

- `.gitignore`
- `assets/scenes/Game.scene`
- `assets/scripts/data/EconomyConfig.ts`
- `assets/scripts/data/ProcessingConfig.ts`
- `assets/scripts/data/ProductCatalog.ts`
- `assets/scripts/data/VerticalSliceConfig.ts`
- `assets/scripts/presentation/MonsterStorePrototype.ts`
- `docs/art/ART_GUIDE.md`
- `settings/v2/packages/information.json`

## Likely Commit Candidates

These appear to be real current-phase work and should be kept together for a gameplay candidate commit after verification:

- Runtime gameplay implementation:
  - `assets/scripts/presentation/MonsterStorePrototype.ts`
  - `assets/scripts/data/EconomyConfig.ts`
  - `assets/scripts/data/ProcessingConfig.ts`
  - `assets/scripts/data/ProductCatalog.ts`
  - `assets/scripts/data/VerticalSliceConfig.ts`
  - `assets/scenes/Game.scene`
- Current final runtime namespace:
  - `assets/resources/ui_gameplay_final_v1/`
- Current target and project guidance:
  - `AGENTS.md`
  - `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`
  - current `docs/*.md` planning, QA, brief, and backlog files.
- Utility scripts that created or checked current resources:
  - `tools/prepare_customer_candidate.py`
  - `tools/probe_cutout_flow.py`
  - `tools/split_customer_animation_sheet.py`
  - `tools/split_customer_layer_sheet.py`

## Local Evidence / Source Candidates

These are useful locally, but should not be mixed blindly into the gameplay commit:

- `manual-figma-export-2026-07-02/`
- `manual-figma-export-2026-07-02-normalized/`
- `assets/ui/final-candidates/`
- `assets/resources/ui_probe_gameplay_v1/`
- `assets/resources/ui_probe_gameplay_v2/`
- `assets/resources/ui_probe_gameplay_v3/`
- `assets/resources/ui_p0/`
- `archive/art-legacy-2026-06-27/`

Recommended handling:

- Keep them on disk for traceability.
- Commit only if Product / Art/UI / Development/testing agree they are required source inputs.
- Otherwise leave untracked or move confirmed deprecated assets to the external archive path required by `AGENTS.md`.

## Deletion Blocker

There are 361 tracked deletions.

Deletion groups:

- 153 files under `assets/reference/ui_samples`.
- 68 files under `assets/resources/ui_generated`.
- 34 files under `assets/resources/ui_generated_v3`.
- 21 files under `assets/resources/ui_generated_v4`.
- 30 files under `assets/resources/ui_formal_v1`.
- 34 files under `docs/art/ui`.
- Smaller groups under old mockups, old art concepts / targets, and old planning docs.

Archive check:

- External archive path required by `AGENTS.md`: `/Users/ban/Documents/怪兽便利店-art-archive/art-deprecated-2026-06-28/`
- Initial matching files found there: 0 / 361.
- Initial matching files found in project-local `archive/art-legacy-2026-06-27/`: 51 / 361.
- Initial missing from both checked archive locations: 310 / 361.

2026-07-09 archive completion:

- Exported 310 missing deleted paths from Git `HEAD:path` into the external archive.
- Copied the 51 project-local archive matches into the external archive as well.
- Final verification: 361 / 361 deleted paths now exist under `/Users/ban/Documents/怪兽便利店-art-archive/art-deprecated-2026-06-28/`.

Verdict:

- The archive safety net is now complete.
- Do not stage these deletions blindly; the next decision is whether Product / Art/UI / Development/testing accept these deletion groups as final cleanup.
- If accepted, the deletion records can be staged as the old-resource cleanup bundle.

## Suspicious / Needs Decision

- `settings/v2/packages/information.json` only changes Cocos form sid URLs. This looks environment-generated. Prefer not committing unless Cocos requires it.
- `archive/art-legacy-2026-06-27/` is inside the project, while current `AGENTS.md` says confirmed abandoned files should move outside the project to `/Users/ban/Documents/怪兽便利店-art-archive/art-deprecated-2026-06-28/`.
- `output/` is ignored now, but many docs reference screenshots inside it. That is acceptable for local QA history, but not enough for a portable repository unless selected evidence images are promoted into a tracked docs asset folder.

## Recommended Next Action

One bounded cleanup round:

1. Review the 361 deletion records by group now that all have external archive backups.
2. Keep `.gitignore` change.
3. Split work into at least three future commits or bundles:
   - gameplay runtime + final runtime resources + current docs,
   - optional source / candidate art inputs,
   - old resource deletion / archive cleanup after explicit confirmation.
4. Exclude `settings/v2/packages/information.json` unless verified as intentional.
