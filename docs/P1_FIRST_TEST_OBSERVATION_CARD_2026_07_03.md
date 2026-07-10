# P1 First-Test Observation Card

日期：2026-07-03

## Owner / Brief / Review / Record

- Owner：Coordination 负责首测范围冻结；Product/planning 负责玩家目标、观察点和通过 / 返工口径；Development/testing 负责可重复试玩路径、截图证据和风险记录；Art/UI 负责低保真状态语法是否妨碍理解。
- Brief：基于 P1-018 / P1-019 / P1-020 / P1-021 / P1-022 / P1-023 更新首测卡。不新增 gameplay 系统，不启动最终美术，不加入备餐位 / 暂存位。首测只验证“拖拽服务 + 微波炉占用 + 订单完成金币收款”是否足够形成手忙脚乱但爽的调度。
- Review：Product `Go with notes`，核心观察从“是否主动使用备餐位”改为“是否理解并管理微波炉占用、顾客耐心和完成金币”；Development/testing `Go with notes`，P1-022 已有 390x844 完整 live 候选基线截图证据且相关 console/pageerror 为 `0`；Art/UI `Go with notes`，低保真画面够测理解，不把 final art 当首测 blocker。
- Record：本文件；`docs/LOCAL_TASK_BOARD.md`；`docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md`。

## Test Purpose

验证玩家是否理解并享受：

`看订单 -> 拖商品 -> 热食先进微波炉 -> 取出热饭团 -> 交给需要热食的订单 -> 订单完成后点击柜台金币收款`

首测不看美术最终质量，也不以完成率为主指标。第二局更快不够；第二局更有计划才算调度成立。

## Fixed Scope

固定：

1. 2 位顾客。
2. 商品区保持当前低保真商品卡。
3. 1 个热食：饭团可冷食 / 热食区分。
4. 1 台微波炉。
5. 不加备餐位 / 暂存位；微波炉 ready 占用就是唯一热食缓冲。
6. 玩家可拖拽商品到任一合法订单，不需要指定当前服务顾客。
7. 订单完成后顾客在柜台放金币，玩家点击金币收款。
8. 金币已出现但顾客耐心归零时，自动慢收成交。

不测：

1. 独立备餐位、多格暂存、柜台放置系统。
2. 微波炉升级、第二台设备、多设备链。
3. 库存经济、采购页、升级页、图鉴页。
4. 最终美术、字体、金币 final asset、订单完成 final 拆件。
5. 长局数值、商业化任务、广告 / IAP。

## Test Flow

1. 30 秒自由练习：拖普通商品到订单、拖饭团进微波炉、点击 / 拖出 ready 热饭团、点击金币收款。
2. 正式第 1 局：记录学习成本、输入问题、视觉误读。
3. 正式第 2 局：使用同一 preset，观察是否出现策略语言和提前规划。
4. 可选分支：让金币待收时顾客耐心归零一次，确认玩家是否理解为慢收成交，而不是未服务流失。

如果第 2 局仍卡在拿起 / 放下 / 看不懂，先返工输入或 cue，不加功能。

## Primary Signals

第二局“好转”主指标：

- 玩家说出或表现出服务顺序计划，例如“先把饭团放炉子”“先收金币”“微波炉占着要先取出来”“右边快急了先救右边”。

辅指标：

- 玩家主动提前加热饭团，而不是等订单快结束才反应。
- 玩家理解微波炉 ready 后仍被占用，并会先取走热饭团。
- 玩家看到订单完成金币后点击收款，不再拖拽到收银台。
- 玩家能区分订单完成金币、微波炉 ready、顾客耐心压力。

输入熟练不等于调度成立：

- 误放减少、拖得更快，只能说明手熟。
- 能提前热饭团、管理微波炉占用、优先收金币或救低耐心顾客，才说明策略改变。

## Rework Triggers

需要返工输入 / cue：

- 玩家把合法 / 非法 drop 误解成 bug。
- 玩家看不出微波炉正在占用或 ready 持有热饭团。
- 玩家不知道订单完成后要点柜台金币。
- 玩家把金币待收时耐心归零的慢收误读成普通未服务流失。
- 玩家第二局仍只是在“拖得更准”，没有任何服务顺序计划。

需要 Product 重新判断规则：

- 玩家反复想把热饭团放到柜台上，并明确表达“我想腾微波炉但还没顾客要这份热食”。
- 玩家觉得只靠微波炉占位太堵，不是紧张而是烦。
- 玩家觉得点击金币太轻，READY 后缺少收款爽感。

需要 Art/UI 后续补美术：

- 玩家能理解规则，但抱怨金币、微波炉 ready、订单完成态或热食需求不够好看 / 不够像正式游戏。
- 玩家能玩懂，但目标图还原度、字体、最终状态件、动效质感不足。

这些不是首测前 blocker；它们进入 final art / polish backlog。

## Hand Notes

每局手记最少记录：

- `局次`：练习 / 第 1 局 / 第 2 局。
- `误放次数`：大概即可。
- `卡手原因`：拿不起 / 放不准 / 手指遮挡 / 看不懂订单 / 看不懂微波炉 / 不知道点金币 / 数值太紧。
- `微波炉占用理解`：否 / 被提醒后懂 / 主动理解。
- `金币收款理解`：否 / 被提醒后点 / 主动点击。
- `服务顺序语言`：原话或无。
- `是否想要暂存位`：无 / 误放式需求 / 明确想腾炉。
- `第二局变化`：更快更准 / 更有计划 / 没变化 / 更困惑。

不需要遥测平台。当前阶段手记比数据面板更重要。

## Current QA Evidence

- 当前首测候选基线：`output/runtime-qa-2026-07-08/first-test-candidate-refresh/runtime_390x844_p1022_first_test_candidate_contact_sheet_2026_07_08.png`
- 当前候选基线 summary：`output/runtime-qa-2026-07-08/first-test-candidate-refresh/runtime_390x844_p1022_first_test_candidate_summary_2026_07_08.json`
- 当前推荐手测入口：`index.html?qaFlow=first-test-live&qaInteractive=1`
- 返回经营中心 / 备货页 390 证据已纳入当前首测候选基线。
- P1-023 团队复核：Product / Art/UI / Development/testing 均为 `Go with notes`，无 blocker。
- P1-024 已修复：收银反馈移到左上营业额 HUD 附近，上一笔 `PaymentBurst` 播放中右侧金币仍可点。证据：`output/runtime-qa-2026-07-08/payment-burst-no-block/runtime_390x844_p1024_payment_burst_no_block_contact_sheet_2026_07_08.png`
- P1-025 已修复：售罄自动停客提示从中心大横幅降为下方库存 compact toast，不再长期压住顾客 / 订单 / 金币区。证据：`output/runtime-qa-2026-07-08/sold-out-autoclose-prompt/runtime_390x844_p1025_sold_out_autoclose_prompt_contact_sheet_2026_07_08.png`
- 2026-07-09 真人测试复核：`20260709102533_rec_.mp4` 里收入 `0 -> 725`，倒计时自然结束并进入第 29 轮营业结算页；抽帧证据：`output/runtime-qa-2026-07-09/user-rec-review-20260709102533/user_rec_20260709102533_contact_sheet.png`
- P1-026 已修复：拖错顾客不再弹文字 toast，改用局部红框 / 订单错误态 / 顾客 angry 和 shake；设备占用提示为 compact。证据：`output/runtime-qa-2026-07-09/drag-error-detext/runtime_390x844_p1026_drag_error_detext_contact_sheet_2026_07_09.png`
- 当前 live 入口证据：`output/runtime-qa-2026-07-04/gameplay-live-entry/runtime_390x844_p1010_first_test_live_contact_sheet_2026_07_04.png`
- 完成态换客回归：`output/runtime-qa-2026-07-04/gameplay-bugs/runtime_390x844_p1009_completion_replace_contact_sheet_2026_07_04.png`
- 金币待收耐心归零分支：`index.html?qaFlow=ready-patience-timeout&qaInteractive=1`
- 历史完整链路 contact sheet：`output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1007_first_test_runtime_regression_contact_sheet_2026_07_03.png`

## Current Verdict

当前 `first-test-live` 仍是首测候选基线，但近期验证默认先由 Codex 自动 / 半自动 playtest QA 执行；用户真人测试暂不作为推进前置条件。后续用户只需要在候选稳定后判断手感、爽感和是否想再来一局。真人首测若恢复，仍使用 `first-test-live`，旧 `hot-food-natural` 只作为单路径 QA preset。

P1-022 已把 P1-021 后的返回经营中心 / 备货页 390x844 画面纳入完整候选基线。P1-024 已解除上一笔收银反馈遮挡 / 干扰右侧金币点击的 blocker；P1-025 已把售罄自动停客提示降为 compact toast；P1-026 已把拖拽错误反馈去文字化；P1-027 已把占用微波炉的拖拽释放反馈去 toast 化。2026-07-09 真人测试确认核心链路可跑通，390x844 结算页未见裁切回归。

下一轮 Codex playtest QA 重点确认：拖错 / 占用设备是否能通过局部红框、设备 shake、顾客反应理解错误，而不再依赖文字提示；后半局库存压力和局末炉内热食是否需要 Product 决策。
