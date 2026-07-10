# Bundle A Pathspec Staging Prep 2026-07-10

## Owner / Brief / Review / Record

- Owner: Coordination owns the pathspec prep document.
- Brief: Prepare exact Bundle A pathspecs for a future reviewed staging round.
  This round does not run `git add`, does not delete files, does not modify
  runtime code, and does not generate art.
- Review: Product, Art/UI, and Development/testing reviewed the pathspec
  direction. All three returned `Go for Bundle A pathspec prep`; Development
  explicitly added `No-go for real staging yet`.
- Record: This file and `docs/LOCAL_TASK_BOARD.md`.

## Scope Lock

- This is a staging preparation document, not a staging action.
- Do not use `git add .`.
- Do not stage the `361` tracked deletions with Bundle A.
- Do not stage `assets/ui/final-candidates/**` as runtime-final resources.
- Do not stage `output/` or `tmp/` wholesale.
- Current candidate remains `first-test-live` / P1-027.

## Current Git Shape

Observed during this round:

- Modified tracked files: `9`.
- Tracked deletions: `361`.
- Untracked files: `1121`.
- Candidate untracked paths covered by the Bundle A draft pathspecs: `112`.
- `assets/resources/ui_gameplay_final_v1/` contains `98` files:
  - `44` PNG files.
  - `54` Cocos `.meta` files.
  - `0` other files.
- `git diff --check` on the tracked Bundle A draft files returned no output.

## Team Verdict

### Product

Verdict: `Go for Bundle A pathspec prep`.

- Bundle A expresses the current first-test gameplay candidate, not final art
  completion and not cleanup acceptance.
- Runtime/config, `ui_gameplay_final_v1`, the target image, current scope docs,
  and triage docs must not be missed.
- `docs/art/ART_GUIDE.md` may travel with Bundle A as guidance, but the P1-027
  observation/backlog docs remain the gameplay source of truth.
- Product-later issues do not block pathspec prep: end-of-day unsold heated rice
  ball handling, late inventory pressure, and whether no-text error feedback is
  enough in the next human-feel test.

### Art/UI

Verdict: `Go for Bundle A pathspec prep only`.

- Include only the current runtime visual namespace and the one current target
  image.
- `assets/resources/ui_gameplay_final_v1/` has no `_qa`, `_sources`, previews,
  candidate manifests, or deprecated/source files in this check.
- `assets/ui/final-candidates/**`, manual exports, probe/P0/formal/layered
  resources, archive, `output/`, and `tmp/` stay out of Bundle A.
- Bundle A is not the commercial final art pass. READY, patience, coin, and
  state cues still contain low-fi / baked placeholder limitations.

### Development/testing

Verdict: `Go for Bundle A pathspec prep / No-go for real staging yet`.

- Bundle A can be prepared as explicit pathspecs.
- Real staging still needs a dry-run add preview, TypeScript, Cocos build, QA
  scripts, and 390x844 smoke.
- Biggest engineering risk: `MonsterStorePrototype.ts` still contains fallback
  references to `ui_p0`, `ui_probe_gameplay_*`, `ui_formal_v2`, `ui_layered`,
  and some `game-art` paths. Those directories are intentionally excluded from
  Bundle A, so real staging must prove the current final namespace covers the
  main path without fatal fallback failures or unacceptable 404 noise.

## Bundle A Exact Pathspec Draft

Use these exact pathspecs for a future dry-run, not broad parent directories.

```bash
AGENTS.md
docs/LOCAL_TASK_BOARD.md
docs/P1_FIRST_TEST_OBSERVATION_CARD_2026_07_03.md
docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md
docs/GIT_WORKTREE_TRIAGE_2026_07_09.md
docs/DELIVERY_TRIAGE_2026_07_10.md
docs/STAGING_DRY_RUN_2026_07_10.md
docs/BUNDLE_A_PATHSPEC_STAGING_PREP_2026_07_10.md
docs/art/ART_GUIDE.md
assets/scenes/Game.scene
assets/scripts/presentation/MonsterStorePrototype.ts
assets/scripts/data/EconomyConfig.ts
assets/scripts/data/ProcessingConfig.ts
assets/scripts/data/ProductCatalog.ts
assets/scripts/data/VerticalSliceConfig.ts
assets/resources/ui_gameplay_final_v1.meta
assets/resources/ui_gameplay_final_v1/
assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png
assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png.meta
tools/prepare_customer_candidate.py
tools/probe_cutout_flow.py
tools/split_customer_animation_sheet.py
tools/split_customer_layer_sheet.py
```

## Optional Tooling Note

The four `tools/*.py` files are not runtime dependencies. Include them only if
the delivery needs reproducibility for how customer/source assets were prepared.
If the future handoff is runtime-only, they can be split into a small tooling
bundle instead.

## Explicit Excludes

Do not include these in Bundle A:

- `.gitignore` unless a separate housekeeping bundle is approved.
- `settings/v2/packages/information.json`.
- `output/`.
- `tmp/`.
- `assets/ui/final-candidates/**`.
- `manual-figma-export-2026-07-02/`.
- `manual-figma-export-2026-07-02-normalized/`.
- `assets/resources/ui_p0/`.
- `assets/resources/ui_probe_gameplay_v1/`.
- `assets/resources/ui_probe_gameplay_v2/`.
- `assets/resources/ui_probe_gameplay_v3/`.
- `assets/resources/ui_formal_v2/`.
- `assets/resources/ui_layered/`.
- `assets/resources/game-art/` as a new Bundle A visual dependency.
- `archive/`.
- The `361` tracked deletions.

Do not use broad pathspecs such as:

- `docs/`
- `assets/resources/`
- `assets/ui/mockups/`
- `assets/scripts/`
- `assets/`

## Future Dry-Run Commands

Only run these when the user explicitly asks for real staging preparation.

```bash
git status --short -- \
  AGENTS.md \
  docs/LOCAL_TASK_BOARD.md \
  docs/P1_FIRST_TEST_OBSERVATION_CARD_2026_07_03.md \
  docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md \
  docs/GIT_WORKTREE_TRIAGE_2026_07_09.md \
  docs/DELIVERY_TRIAGE_2026_07_10.md \
  docs/STAGING_DRY_RUN_2026_07_10.md \
  docs/BUNDLE_A_PATHSPEC_STAGING_PREP_2026_07_10.md \
  docs/art/ART_GUIDE.md \
  assets/scenes/Game.scene \
  assets/scripts/presentation/MonsterStorePrototype.ts \
  assets/scripts/data/EconomyConfig.ts \
  assets/scripts/data/ProcessingConfig.ts \
  assets/scripts/data/ProductCatalog.ts \
  assets/scripts/data/VerticalSliceConfig.ts \
  assets/resources/ui_gameplay_final_v1.meta \
  assets/resources/ui_gameplay_final_v1 \
  assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png \
  assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png.meta \
  tools/prepare_customer_candidate.py \
  tools/probe_cutout_flow.py \
  tools/split_customer_animation_sheet.py \
  tools/split_customer_layer_sheet.py
```

```bash
git add --dry-run -- \
  AGENTS.md \
  docs/LOCAL_TASK_BOARD.md \
  docs/P1_FIRST_TEST_OBSERVATION_CARD_2026_07_03.md \
  docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md \
  docs/GIT_WORKTREE_TRIAGE_2026_07_09.md \
  docs/DELIVERY_TRIAGE_2026_07_10.md \
  docs/STAGING_DRY_RUN_2026_07_10.md \
  docs/BUNDLE_A_PATHSPEC_STAGING_PREP_2026_07_10.md \
  docs/art/ART_GUIDE.md \
  assets/scenes/Game.scene \
  assets/scripts/presentation/MonsterStorePrototype.ts \
  assets/scripts/data/EconomyConfig.ts \
  assets/scripts/data/ProcessingConfig.ts \
  assets/scripts/data/ProductCatalog.ts \
  assets/scripts/data/VerticalSliceConfig.ts \
  assets/resources/ui_gameplay_final_v1.meta \
  assets/resources/ui_gameplay_final_v1 \
  assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png \
  assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png.meta \
  tools/prepare_customer_candidate.py \
  tools/probe_cutout_flow.py \
  tools/split_customer_animation_sheet.py \
  tools/split_customer_layer_sheet.py
```

## Future Verification Before Real Staging

Development/testing minimum:

1. Confirm `git status --short -- <Bundle A pathspecs>` shows only expected
   `M` and `??`, with no `D`.
2. Run `git add --dry-run -- <Bundle A pathspecs>` and inspect the exact list.
3. Run `git diff --check -- <tracked Bundle A files>`.
4. Run TypeScript:
   `tsc --noEmit --pretty false --skipLibCheck --lib ES2017,DOM`.
5. Run Cocos `web-mobile` build. The historical CLI `36` noise is acceptable
   only if the build log ends in success.
6. Run:
   - `node tmp/p1_drag_error_detext_qa.mjs`
   - `node tmp/p1_first_test_candidate_refresh_qa.mjs`
7. Run a 390x844 smoke on
   `index.html?qaFlow=first-test-live&qaInteractive=1`, covering ordinary order
   service, rice ball into microwave, microwave ready, hot rice order, coin
   click, natural settlement, and return to business center.

## Dry-Run Execution Result 2026-07-10

Development/testing executed the first two dry-run checks only. No real staging
was performed.

- `git status --short -- <Bundle A pathspecs>`:
  - `M`: `7`.
  - `??`: `16` status entries.
  - `D`: `0`.
- `git add --dry-run -- <Bundle A pathspecs>`:
  - output lines: `120`.
  - includes the expected tracked runtime/config/doc updates and untracked
    Bundle A files.
  - does not include the `361` tracked deletions.
- Exclusion grep over dry-run output found no matches for:
  - `settings/v2`
  - `final-candidates`
  - `output/`
  - `tmp/`
  - `manual-figma`
  - `archive/`
  - `ui_p0`
  - `ui_probe`
  - `ui_formal_v2`
  - `ui_layered`
  - delete/remove lines.
- Total untracked files in the whole repo at this moment: `1122`.

Verdict: the exact Bundle A pathspecs pass the first dry-run safety check. This
does not make real staging safe yet; TypeScript, Cocos build, QA scripts, and
390x844 smoke remain required before any actual `git add`.

## Verification Gate Execution Result 2026-07-10

Development/testing executed the remaining verification gate for Bundle A. No
real staging, commit, code change, asset edit, or deletion was performed.

- TypeScript:
  - Command:
    `node /Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/node_modules/typescript/bin/tsc --project tsconfig.json --noEmit --pretty false --skipLibCheck --lib ES2017,DOM`
  - Result: passed with no compiler output.
- Cocos `web-mobile` build:
  - Command:
    `CocosCreator --project /Users/ban/Documents/怪兽便利店 --build "platform=web-mobile;debug=false;outputName=web-mobile;buildPath=project://build;md5Cache=false;skipCompressTexture=true"`
  - CLI exit: `36`, matching the project's historical noisy CLI behavior.
  - Build log:
    `temp/builder/log/web-mobile7-10-2026 13-43.log`.
  - Log tail verdict:
    `build Task (web-mobile) Finished in (41 s)ms`.
- QA scripts on `http://127.0.0.1:4174/index.html?qaFlow=first-test-live&qaInteractive=1`:
  - `QA_PORT=4174 node tmp/p1_drag_error_detext_qa.mjs`: passed,
    `passed: true`, `consoleErrorCount: 0`, `relevantErrors: []`.
  - `QA_PORT=4174 node tmp/p1_first_test_candidate_refresh_qa.mjs`: passed,
    `consoleErrorCount: 0`, `relevantErrors: []`.
- 390x844 smoke:
  - Covered initial gameplay, ordinary order service, rice ball into microwave,
    microwave ready, hot rice order delivery, coin click, natural settlement,
    strategy return to business center, and preparation page.
  - Key screenshots were confirmed at `390 x 844` and visually checked for
    correct entry / nonblank state:
    - `output/runtime-qa-2026-07-08/first-test-candidate-refresh/runtime_390x844_p1022_first_test_candidate_01_initial_2026_07_08.png`
    - `output/runtime-qa-2026-07-08/first-test-candidate-refresh/runtime_390x844_p1022_first_test_candidate_05_microwave_ready_after_right_collect_2026_07_08.png`
    - `output/runtime-qa-2026-07-08/first-test-candidate-refresh/runtime_390x844_p1022_first_test_candidate_09_strategy_return_center_2026_07_08.png`
- Local process cleanup:
  - QA browser processes exited.
  - Static server was temporary only and should not be committed or treated as
    a project dependency.
- Git safety note:
  - `settings/v2/packages/information.json` remains excluded as likely Cocos
    environment noise.
  - No `git add` was run.

Verdict: Bundle A now passes the documented Development/testing verification
gate for a future reviewed staging action. This still does not authorize
`git add`; it only removes the prior verification blocker.

## Team Staging Authorization Review 2026-07-10

Coordination asked Product, Art/UI, and Development/testing for a read-only
review of whether Bundle A may proceed to a separate real staging action. No
real staging, commit, code change, asset edit, or deletion was performed in
this review.

Latest local checks during this review:

- `git diff --cached --name-only`: empty.
- `git status --short -- <Bundle A exact pathspecs>`: expected Bundle A
  `M` / `??` entries only; no `D`.
- `git add --dry-run -- <Bundle A exact pathspecs>`:
  - output lines: `120`.
  - no matches for `settings/v2`, `final-candidates`, `output/`, `tmp/`,
    `manual-figma`, `archive/`, `ui_p0`, `ui_probe`, `ui_formal_v2`, or
    `ui_layered`.
  - no delete / remove lines.
- `git diff --check -- <tracked Bundle A files>`: no output.

Team verdicts:

- Product: `Conditional Go`.
  Bundle A may be staged only as the current `first-test-live` / P1-027
  first-test gameplay candidate. It is not final art acceptance, cleanup
  acceptance, or gameplay expansion.
- Art/UI: `Conditional Go`.
  Bundle A may be staged only if it stays limited to the current runtime
  visual namespace, the current target image, and necessary docs / runtime
  files. It must not include final-candidates, manual exports, old resource
  namespaces, archive, `output/`, or `tmp/`.
- Development/testing: `Conditional Go`.
  The previous `No-go for real staging yet` is removed because TypeScript,
  Cocos build, QA scripts, 390x844 smoke, dry-run, empty index, and diff check
  have passed. The staging action must be a single exact-pathspec `git add`,
  followed immediately by staged diff review.

Allowed next action:

1. Reconfirm `git diff --cached --name-status` is empty.
2. Reconfirm `git status --short -- <Bundle A exact pathspecs>` has no `D`.
3. Reconfirm `git diff --check -- <tracked Bundle A files>` has no output.
4. Run exactly one real staging command:
   `git add -- <Bundle A exact pathspecs>`.
5. Immediately stop and inspect `git diff --cached --name-status`.

Hard stop after staging:

- Do not commit in the same step.
- If staged output includes any `D`, `settings/v2`, `output/`, `tmp/`,
  `final-candidates`, manual export, old resource namespace, `archive/`, or
  any non-Bundle A path, treat staging as failed and do not continue.

## Unresolved Issues

- Bundle A is a first-test gameplay candidate, not commercial final art.
- `MonsterStorePrototype.ts` is a large accumulated diff and needs the full
  verification gate result reviewed before real staging.
- Runtime fallback strings still reference excluded old resource namespaces.
- QA evidence is mostly local under ignored `output/`; portable QA evidence
  would need a separate tiny promotion round.
- `361` tracked deletions remain a separate cleanup decision.
- `settings/v2/packages/information.json` remains excluded as likely Cocos
  environment noise.

## Round Verdict

Bundle A pathspec preparation, Development/testing verification, and team
authorization review are ready as a document. The next safe action, if the user
explicitly asks for it, is one separate real staging round using only the exact
Bundle A pathspecs above; do not use `git add .`, do not include the tracked
deletions, and do not include environment noise or ignored QA output wholesale.
