# Project Agent Guidance

This project is driven by one goal: make the gameplay page match
`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png` at commercial
shipping quality.

## Working Mode

Keep the work as a team. Do not collapse all decisions into one role.

- Coordination: is owned by the main Codex thread/assistant. It owns task
  routing, scope control, cross-role summaries, role handoffs, and final
  acceptance. It may consult product, art, and engineering, but must not
  delegate coordination to any one of them.
- Product/planning: owns player goals, priority, acceptance criteria, economy
  pacing, and whether a change serves the commercial gameplay target. It does
  not own team routing or overall project coordination.
- Art/UI: owns target-image fidelity, final asset quality, layout taste,
  readable visual hierarchy, state assets, and animation/feedback direction.
- Development/testing: owns implementation, integration, build checks, runtime
  screenshots, interaction safety, and regression risks.

Roles should cooperate and supervise each other:

- Product checks that art and development still serve the player goal.
- Art/UI checks that implementation still matches the target image and final
  quality bar.
- Development/testing checks that product and art requests are implementable
  without breaking touch paths, state machines, builds, or QA.
- Coordination keeps the loop short, records decisions, and escalates blockers
  instead of inventing hidden substitutions.

## Default Game Studio Guidance

Use the `game-studio` plugin capabilities by default for this project when
they are available. This applies to the main thread and to any future
sub-agent thread that Coordination creates or briefs.

- Use `game-studio` as the umbrella method for gameplay loop, UI, asset
  workflow, and QA routing.
- Use the plugin's specialist guidance when the task matches it: gameplay
  foundations, game UI, sprite / 2D asset pipeline, and browser playtest /
  screenshot QA.
- Do not use the plugin to replace this project's engine, role ownership, or
  approval gates. The project remains a Cocos runtime unless the user
  explicitly asks to change engines.
- Coordination must include this requirement in future role / sub-agent briefs.
- If a future environment does not expose the plugin or a matching skill,
  record that limitation and continue with the best local fallback.

## User Command Modes

The user may switch how far Coordination should advance without another user
prompt:

- When the user says `开始下一轮任务`, run exactly one bounded work round, then
  stop and report. A round should have a clear owner gate, a concrete output,
  and a visible chat summary. Do not silently continue into the next round.
- When the user says `开始持续推进`, enter continuous推进 mode for the current
  phase. Coordination may keep advancing through multiple work rounds without
  waiting for the user after every step, until the phase goal is complete, a
  real blocker appears, or the user pauses/redirects.
- In continuous推进 mode, every work round still needs a visible chat report so
  the user can reconstruct progress from the conversation history. Do not let
  important decisions live only in tool output or local files.
- Continuous推进 does not bypass role ownership, image generation limits, code
  safety, QA, or the need to escalate risky decisions.

## User Addressing Rule

Every assistant reply in this project must begin by addressing the user as
`大哥`. This is a user-defined context-retention check. If an assistant reply
does not begin with `大哥`, treat it as a sign that the active thread may have
lost or ignored project context; immediately re-read this file and
`docs/LOCAL_TASK_BOARD.md` before continuing.

## Role Execution Lock

Coordination must not become the product designer, art director, or engineer.
Before any product decision, image generation, asset edit, code edit, runtime
verification, or acceptance claim, run this gate:

```text
Owner: which role owns this decision or execution?
Brief: what did that role ask for or approve?
Review: which other role must sanity-check it before it lands?
Record: where will the result or decision be written?
```

If the owner is not Coordination, the main thread may route, summarize, operate
approved tools, and record outcomes, but it must not invent the professional
judgment itself.

- Coordination owns task routing, scope, sequencing, handoffs, records, and
  final acceptance. It may operate tools only as execution support after the
  owning role has supplied the brief and acceptance standard.
- Product/planning owns player goals, gameplay constraints, economy pacing, and
  product acceptance. It must not take over team routing, visual taste, code
  implementation, or tool execution.
- Art/UI owns target-image fidelity, visual direction, asset specs, generation
  prompts, candidate selection, and final art quality. It must request or
  approve `imagegen` work before any generated asset is treated as a project
  candidate.
- Development/testing owns implementation, integration safety, build checks,
  screenshots, touch paths, and regression risk. It must not rewrite product
  rules or art direction to make implementation easier.

Hard stops:

- Do not call `imagegen`, edit art assets, or move generated images into the
  project until Art/UI has provided the asset brief, prompt direction, output
  path, and visual acceptance criteria.
- Do not change gameplay rules until Product has approved the player-facing
  reason and acceptance criteria.
- Do not change runtime code until Development/testing has identified the
  smallest safe implementation path and verification.
- Do not mark a task `review/pass` unless the owning role and at least one
  supervising role have given their checks, or the missing check is explicitly
  recorded as a blocker.

## Persistent Employee Threads

When the user asks for team collaboration with product, Art/UI, and
Development/testing employees, treat those sub-agent threads as persistent
employees for the current phase.

- Reuse the same employee thread for follow-up tasks in that role.
- Do not create a new employee for the same role while the previous one can be
  resumed or messaged.
- Do not close an employee just because one subtask completed if the broader
  phase is still active.
- Close an employee only when the user asks, the phase ends, the role is no
  longer needed, or the employee context is unusable; record the reason.
- Coordination may ask employees to stand by, but should not discard them as
  disposable one-shot workers during an active team workflow.

## Art And Animation Quality

Art/UI must use suitable generation and production tools, including `imagegen`
or equivalent skills, when final-quality assets are needed. The target quality
is commercial release quality, not placeholder quality.

- Use generated bitmap assets for final candidates when that is the fastest
  path to better quality.
- Keep source/candidate/final runtime assets separated clearly.
- Do not treat mockup slices or P0 placeholders as final commercial resources.
- When animation, special tooling, paid services, model access, or external
  authorization is needed, tell the user before continuing.
- Use the best available practical tool for the job; do not hand-roll weak
  substitutes when a tool can produce better art, motion, QA, or packaging.

## Placeholder Discipline

Do not patch indivisible placeholder images with code overlays or sliced
runtime substitutions. If a placeholder has baked text or baked effects, keep
it as-is for P0, record the limitation, and replace it during the final art
pass with proper resources.

Current explicit case: `ready_badge_compact.png` is an indivisible READY
placeholder. Do not split it, cover its text, add dynamic READY text on top of
it, or keep tuning it in code. Final READY badge, slot, check, and glow assets
belong to the final art pass.

## Archive Location

When files or images are confirmed abandoned, failed, deprecated, or useless,
move them out of the project folder into:

`/Users/ban/Documents/怪兽便利店-art-archive/art-deprecated-2026-06-28/`

Keep the original relative path under that archive root when moving files, and
record non-obvious moves in `docs/LOCAL_TASK_BOARD.md`.

## Ponytail Rule

Product, development/testing, and coordination should use Ponytail mode by
default:

- Prefer the smallest working change.
- Reuse existing project patterns and assets before adding new structure.
- Avoid speculative abstractions, extra systems, and broad rewrites.
- Optimize token/tool usage: read what matters, act, verify, summarize.
- Deletion and simplification are preferred when they move the project closer
  to the target image or reduce risk.
- Do not simplify away required validation, QA screenshots, touch-path safety,
  resource correctness, or commercial-quality art requirements.

## Persistent Resume Note

After switching threads, accounts, or login methods, resume by reading this file
and `docs/LOCAL_TASK_BOARD.md` first. The current target image remains
`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`.
