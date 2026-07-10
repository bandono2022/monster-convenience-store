# Gameplay Page Bug And Polish Backlog

日期：2026-07-03

## Owner / Brief / Review / Record

- Owner：Development/testing 负责当前 gameplay 页 bug / 残缺盘点、修复顺序、构建和截图 QA。
- Brief：用户确认当前 gameplay 页还有很多 bug 和残缺，要求先补当前页，不急着扩张新页面或生成新 UI 图。
- Review：Product 复核问题是否影响“手忙脚乱但爽的调度服务”；Art/UI 复核问题是否影响目标图 fidelity 和商业发布观感。
- Record：本文件；`docs/LOCAL_TASK_BOARD.md`；后续每轮修复截图进 `output/runtime-qa-2026-07-03/`。

## Current Status

当前 gameplay 页已经完成若干点状修复：

- final resource namespace 已接入主要 390x844 静态布局。
- 顾客旧 layered 资源污染已归档。
- 柜台 / 设备 / 商品 / 订单 icon 的主要拉伸问题已修过一轮。
- 低保真耐心条已进入 runtime。
- 顾客表情 face 拉伸和眼睛锚点跳位已修过一轮。

P0-001 / P0-002 / P0-003 / P0-004 已在 2026-07-03 通过截图和交互 QA。当前 gameplay 页进入“可玩主链路已通，继续补入口状态和 polish”的阶段。

## QA Note

本轮尝试用 in-app browser 在 `390x844` 下跑 `?qaInteractive=1` 自动化截图。页面在该浏览器会多次截到 Cocos 启动画面，导致新截图证据不可用：

- `output/runtime-qa-2026-07-03/gameplay-page-backlog/01_interactive_initial.png`
- `output/runtime-qa-2026-07-03/gameplay-page-backlog/02_after_ready_click.png`

这两张不能作为 gameplay 画面验收证据，只记录为 QA tooling 风险。后续修复轮应优先使用：

- Cocos build 后稳定 reload，再截图。
- `qaInteractive=1` 自然流。
- 必要时增加小型 QA preset，而不是依赖每帧重置的展示快照。

## P0 Must Fix Before Expanding New Pages

### P0-001：当前 gameplay 页缺少稳定自然流 QA 入口

- Owner：Development/testing
- Symptom：默认入口会维持目标图 READY 展示快照，`probeState` 会重置状态；`qaInteractive=1` 可用但自动截图加载时机不稳定。
- Why it matters：没有稳定 QA 入口，就很难判断下一次代码改动是否破坏 READY、商品、微波炉、顾客切换和收银。
- Minimal fix：新增或整理一个明确的 `qaFlow` 参数，直接进入非重置自然流：`ready-left`、`right-current-empty`、`heating`、`microwave-ready`、`low-stock`、`red-patience`。
- Acceptance：390x844 下每个 preset 都能稳定截图，非 Cocos splash；console error 为 0。

### P0-002：顶部金币显示仍是硬编码 `1,258`

- Owner：Development/testing
- Symptom：final HUD 渲染中金币 label 写死为 `1,258`，不跟 `revenue` / `paymentBurst` 更新。
- Why it matters：玩家完成订单后无法可靠理解“收钱”和顶部收入的关系，削弱核心爽点。
- Minimal fix：把 final HUD 金币文本绑定到当前营业收入或可确认的货币字段；付款后通过 `updateLiveUi()` 或 render 刷新。
- Acceptance：READY 交付后顶部收入增加；截图能看到收入变化与收银反馈一致。

### P0-003：完整热食自然流重新通过

- Owner：Development/testing
- Symptom：历史 QA 只验证过 `probeState=microwave-ready` 的 ready 回填短窗口，未验证从“点热食商品 -> 加热等待 -> 点击微波炉 -> 订单 READY -> 交付”的完整自然流。
- Why it matters：热食是调度玩法的第一个真正 game 点；如果不稳，玩法会退化成点商品收钱。
- Result：`pass on 2026-07-03`。新增 `qaFlow=hot-food-natural`，并通过真实点击验证“饭团商品卡 -> 微波炉加热 -> 微波炉 ready -> 点击设备回填 -> 订单 READY -> 点击气泡交付 -> 收入 +21”。
- Evidence：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p003_hot_food_natural_contact_sheet_2026_07_03.png`，console error `0`。

### P0-004：缺货 / 补货 / 售罄反馈通过

- Owner：Product + Development/testing
- Symptom：代码存在缺货、补货和售罄分支，但当前 final gameplay QA 没有稳定截图或手点记录证明玩家能看懂。
- Why it matters：库存/升级策略是用户指定的第二核心；如果营业页不表达库存后果，策略层没有意义。
- Result：`pass on 2026-07-03`。final 商品卡显示 `补货中` / `售罄` overlay；新增 `qaFlow=sold-out-needed` 并验证当前订单商品售罄后不入账、订单无法完成、顾客被替换。
- Evidence：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p004_stock_feedback_contact_sheet_2026_07_03.png`，console error `0`。

### P0-005：底部五入口 P0 状态通过

- Owner：Product + Development/testing
- Symptom：底部 nav 点击只提示“入口稍后开放”。
- Why it matters：如果当前目标是 playable probe，这可以保留；如果目标是商业版规划，需要明确哪些入口 P0 可点、哪些禁用。
- Result：`pass on 2026-07-03`。底部五入口保留当前营业页入口，采购 / 库存 / 升级 / 图鉴统一显示 dim + `即将`，点击即时反馈“X即将开放”。
- Evidence：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p005_bottom_nav_cdp_contact_sheet_2026_07_03.png`、`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p005_bottom_nav_cdp_single_procurement_after_render_2026_07_03.png`；Cocos build log `temp/builder/log/web-mobile7-3-2026 15-39.log` 末尾成功。

## P1 Fix After P0 Stabilizes

### P1-001：READY 后低奖励窗口未与普通耐心条分离表达

- Owner：Product + Development/testing + Art/UI
- Symptom：耐心条已显示，但 READY 后应表达“慢收少奖励 / 断连击”，不是普通未完成订单流失风险。
- Why it matters：玩家需要区分“救快走的顾客”和“收已完成订单”。
- Result：`pass on 2026-07-03 / low-fi runtime`。READY 后进入 5 秒领取窗口，普通耐心不继续扣；窗口超时自动低奖励成交，无小费、combo reset、不算顾客流失；窗口内点击仍给及时奖励。
- Evidence：`output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1001_ready_window_contact_sheet_2026_07_03.png`、`runtime_390x844_p1001_ready_window_mixed_final_2026_07_03.png`、`runtime_390x844_p1001_ready_window_timeout_after_2026_07_03.png`、`runtime_390x844_p1001_ready_window_click_timely_2026_07_03.png`。

### P1-002：订单 item 状态还不够完整

- Owner：Development/testing + Art/UI
- Symptom：当前订单槽主要有 missing / check；processing、ready_from_device、error 的局部状态仍弱。
- Why it matters：多商品和热食订单需要玩家知道“还缺什么、什么在加工、什么可取”。
- Minimal fix：用 runtime 小角标 / tint / pulse 先补状态，不等 final PNG。
- Acceptance：partial、heating、microwave-ready 三态截图能一眼区分。
- Result：`pass on 2026-07-03 / low-fi runtime`。订单槽现在用轻微 tint、顶部状态条、进度条和金色 ready rim 区分 partial、heating、microwave-ready；不新增图片、不改 READY baked 资源、不改玩法状态机。
- Evidence：`output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1002_order_item_partial_2026_07_03.png`、`runtime_390x844_p1002_order_item_heating_2026_07_03.png`、`runtime_390x844_p1002_order_item_microwave_ready_2026_07_03.png`；Cocos build log `temp/builder/log/web-mobile7-3-2026 17-03.log` 末尾成功，CLI 仍返回历史噪音码 `36`。
- Follow-up Result：`pass on 2026-07-03 / P1-002.1`。用户指出订单商品上的进度条语义不清；已移除 partial / heating 的横条和加热进度比例，改为绿色角标、热色角标 / 热气点和金色可取 rim。
- Follow-up Evidence：`output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p10021_order_item_partial_no_progress_2026_07_03.png`、`runtime_390x844_p10021_order_item_heating_no_progress_2026_07_03.png`、`runtime_390x844_p10021_order_item_microwave_ready_no_progress_2026_07_03.png`；Cocos build log `temp/builder/log/web-mobile7-3-2026 17-19.log` 末尾成功，CLI 仍返回历史噪音码 `36`。

### P1-003：当前顾客选择状态依赖订单气泡和手部，缺少独立清晰 cue

- Owner：Art/UI + Development/testing
- Symptom：当前顾客主要靠 bubble selected 和 hands；切换顾客时如果订单相似，玩家可能不确定当前服务对象。
- Why it matters：双顾客调度要求玩家快速判断当前服务对象。
- Minimal fix：低保真 current rim / shadow / floor glow，只加在顾客周围，不遮订单。
- Acceptance：390x844 截图中不读文字也能判断当前顾客。
- Status：`frozen on 2026-07-03 by user direction`。用户可能将核心交互改为拖拽商品到顾客 / 订单；若采用拖拽，当前服务对象选择态可能不再成立。不要继续投入 current selection cue，除非 Product 重新确认需要选择态。

### P1-004：表情切换已去拉伸，但 happy 源图仍显著放大

- Owner：Art/UI
- Symptom：runtime 已按眼睛锚点对齐，但 happy 源图本身眼睛 / 嘴更大，切换仍略跳。
- Why it matters：影响 polish，不阻塞玩法。
- Minimal fix：若追商业最终态，重新导出同透明画布、同眼睛锚点、同脸部占比表情组。
- Acceptance：waiting / happy / urgent 局部 contact sheet 中脸部占比稳定。

### P1-005：字体仍未 final 接入

- Owner：Art/UI + Development/testing
- Symptom：Baloo 2 字体未接入，动态数字 / 库存 / 倒计时不能 final pass。
- Why it matters：目标图商业质感依赖圆润粗体数字。
- Minimal fix：用户提供字体后接入；没有字体时保持 blocker，不默认为通过。
- Acceptance：HUD、库存、倒计时字体匹配目标方向。

### P1-006：拖拽服务交互低保真验证

- Owner：Product + Development/testing + Art/UI
- Symptom：如果核心交互从点击 / 选择顾客转为拖拽交付，需要重新验证商品、订单、微波炉之间的投放路径。
- Why it matters：拖拽会改变玩家关注点：不再是“当前选中谁”，而是“我拖着什么、哪里能放、错了会怎样、热食先去哪”。
- Minimal fix：先做最小可玩验证，不生成新图、不做完整拖拽系统大重写；定义拖拽目标、高亮、错误反馈、热食微波炉路径和 390x844 手指遮挡风险。
- Acceptance：能用低保真交互验证商品拖到正确订单 / 错误订单 / 微波炉 / 微波炉完成回交的关键路径，并输出截图或短 QA 证据。
- Brief Result：`brief-ready on 2026-07-03`。已新增 `docs/P1_DRAG_SERVICE_INTERACTION_BRIEF_2026_07_03.md`，明确第一轮 probe 不做 P1-003 当前选择态、不生成美术、不改 READY 交付，先验证 product-to-order、product-to-microwave 与 microwave-ready-to-order。
- Product Update：`updated on 2026-07-03`。用户确认热食拖拽逻辑应为“商品先进微波炉预热，再把热饭团给需要热饭团的顾客”；微波炉处理商品准备状态，不绑定服务顾客。冷饭团和热饭团是不同需求状态。
- Implementation Result：`probe-pass on 2026-07-03 / low-fi runtime`。已接入最小 product-to-order、product-to-microwave、microwave-ready-to-order 拖拽；保留点击 fallback，READY 交付仍为点击订单气泡；未生成新图，未改 final art namespace，未拆 / 覆盖 `ready_badge_compact.png`。
- Evidence：`output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1006a_drag_service_contact_sheet_2026_07_03.png`。关键单图包括 `runtime_390x844_p1006a_drag_normal_correct_2026_07_03.png`、`runtime_390x844_p1006a_drag_normal_wrong_2026_07_03.png`、`runtime_390x844_p1006a_drag_ghost_microwave_target_2026_07_03.png`、`runtime_390x844_p1006a_drag_rice_to_microwave_heating_2026_07_03.png`、`runtime_390x844_p1006a_drag_hot_to_matching_order_2026_07_03.png`、`runtime_390x844_p1006a_drag_hot_wrong_cold_order_2026_07_03.png`、`runtime_390x844_p1006a_tap_fallback_rice_starts_microwave_2026_07_03.png`、`runtime_390x844_p1006a_ready_window_regression_2026_07_03.png`。
- Verification：TypeScript `tsc --noEmit` 通过；Cocos build log `temp/builder/log/web-mobile7-3-2026 18-21.log` 末尾显示成功，CLI 仍返回历史噪音码 `36`；QA console 仅剩一个静态资源 `404 File not found` 噪音，无 pageerror。
- Follow-up Result：`polish-pass on 2026-07-03 / P1-006B`。拖拽 ghost 缩小、上移并侧偏，微波炉 drop target 略放宽；热饭团需求增加低保真 tint / 小角标 / spark；toast 宽度收窄，错误和成功反馈更像局部提示。点击 fallback 与 READY 后 5 秒奖励窗口均保留，未生成新图，未改 final art namespace，未拆 / 覆盖 `ready_badge_compact.png`。
- Follow-up Evidence：`output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1006b_drag_polish_contact_sheet_2026_07_03.png`。关键单图包括 `runtime_390x844_p1006b_drag_normal_correct_2026_07_03.png`、`runtime_390x844_p1006b_drag_normal_wrong_2026_07_03.png`、`runtime_390x844_p1006b_drag_ghost_microwave_target_2026_07_03.png`、`runtime_390x844_p1006b_drag_rice_to_microwave_heating_2026_07_03.png`、`runtime_390x844_p1006b_drag_hot_to_matching_order_2026_07_03.png`、`runtime_390x844_p1006b_drag_hot_wrong_cold_order_2026_07_03.png`、`runtime_390x844_p1006b_tap_fallback_rice_starts_microwave_2026_07_03.png`、`runtime_390x844_p1006b_ready_window_regression_2026_07_03.png`；Cocos build log `temp/builder/log/web-mobile7-3-2026 23-16.log` 末尾成功，CLI 仍返回历史噪音码 `36`，QA console 仅剩一个静态资源 `404 File not found` 噪音，无 pageerror。
- P1-006C Brief Result：`brief-ready on 2026-07-03`。用户确认 READY 后不做拖拽到收银台，改为顾客把金币放在柜台上，玩家点击金币收款；金币堆按订单标价分档：`sale < 15` 为 2 枚，`15 <= sale < 30` 为 4 枚，`sale >= 30` 为 8 枚。已新增 `docs/P1_READY_COIN_COLLECTION_BRIEF_2026_07_03.md`；低保真阶段不生成新图，复用现有金币 icon 或 runtime 圆形金币。
- P1-006C Implementation Result：`probe-pass on 2026-07-03 / low-fi runtime`。READY 后在对应顾客一侧柜台显示 2 / 4 / 8 枚低保真金币堆；点击金币触发及时收款，HUD 收入、顾客 happy、收银反馈联动；READY timeout 仍自动低奖励成交，无小费、combo reset、不算顾客流失。旧点击订单气泡收款暂时保留为 fallback / QA 对照；未生成新图，未改 final art namespace，未拆 / 覆盖 `ready_badge_compact.png`。
- P1-006C Evidence：`output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1006c_ready_coin_collection_contact_sheet_2026_07_03.png`。关键单图包括 `runtime_390x844_p1006c_ready_coin_small_2coins_2026_07_03.png`、`runtime_390x844_p1006c_ready_coin_medium_4coins_2026_07_03.png`、`runtime_390x844_p1006c_ready_coin_large_8coins_2026_07_03.png`、`runtime_390x844_p1006c_ready_coin_click_collect_2026_07_03.png`、`runtime_390x844_p1006c_ready_coin_timeout_low_reward_2026_07_03.png`；Cocos build log `temp/builder/log/web-mobile7-3-2026 23-36.log` 末尾成功，CLI 仍返回历史噪音码 `36`，QA console 仅剩一个静态资源 `404 File not found` 噪音，无 pageerror。
- P1-006D Product Decision：`decided on 2026-07-03 / no-code`。用户确认首测前不加备餐位 / 暂存位，只靠微波炉占位。热饭团可以提前做好，但只能留在微波炉里等待被拖给订单；微波炉 ready 状态就是热食暂存状态，未取走时微波炉保持占用。若后续测试中玩家明确想“腾微波炉但保留热饭团”，再把备餐位作为扩展。
- P1-007 First-Test Runtime Regression：`qa-pass on 2026-07-03 / no runtime code change`。已用 390x844 自动截图验证一条完整低保真体验链：饭团拖进微波炉、加热中点击反馈、微波炉占用阻挡、微波炉 ready 持有热饭团、热饭团拖回订单、READY 后点击柜台金币收款、READY timeout 低奖励。QA console 只有一个历史静态资源 `404 File not found` 噪音，无 pageerror；本轮未改 runtime 代码，复用最新 web-mobile 构建。
- P1-007 Evidence：`output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1007_first_test_runtime_regression_contact_sheet_2026_07_03.png`。关键单图包括 `runtime_390x844_p1007_full_chain_microwave_heating_tap_feedback_2026_07_03.png`、`runtime_390x844_p1007_full_chain_microwave_occupied_blocker_2026_07_03.png`、`runtime_390x844_p1007_full_chain_microwave_ready_holding_2026_07_03.png`、`runtime_390x844_p1007_full_chain_hot_rice_order_ready_coin_2026_07_03.png`、`runtime_390x844_p1007_full_chain_coin_collect_success_2026_07_03.png`、`runtime_390x844_p1007_full_chain_timeout_low_reward_2026_07_03.png`。
- P1-008 First-Test Observation Card：`ready on 2026-07-03 / no runtime code change`。已新增 `docs/P1_FIRST_TEST_OBSERVATION_CARD_2026_07_03.md`，把首测口径更新为无备餐位 / 暂存位，只测拖拽服务、微波炉占用、READY 点击金币和 READY timeout 低奖励；旧 `docs/P0_LOW_FI_FIRST_TEST_ACCEPTANCE_CARD_2026_07_02.md` 已标注备餐位设定过期。首测主指标改为第二局是否出现服务顺序计划；玩家若明确想“腾微波炉但保留热饭团”，记录为 Product 后续判断信号，不在首测前直接实现。
- P1-009 Completion-State Freeze Fix：`qa-pass on 2026-07-04`。用户手测录屏显示完成订单后画面停留在 completed / happy / 收款态。根因是 `transitionRemaining` 结束后 `replaceCustomer(index)` 只替换数据，没有当帧重绘，旧 Cocos 节点会继续留在屏幕上。已在 `replaceCustomer(index)` 后补 `this.render()`；不改奖励、换客、READY 金币或微波炉规则。TypeScript 通过；Cocos build log `temp/builder/log/web-mobile7-4-2026 07-47.log` 末尾成功，CLI 仍返回历史噪音码 `36`；P1-009 QA console 仅 1 个历史静态资源 `404 File not found` 噪音。Evidence：`output/runtime-qa-2026-07-04/gameplay-bugs/runtime_390x844_p1009_completion_replace_contact_sheet_2026_07_04.png`。
- P1-010 First-Test Live Entry：`qa-pass on 2026-07-04`。新增 `qaFlow=first-test-live`，把真人首测入口从截图 QA preset 中分离出来。开局为 2 位未完成顾客，左侧热饭团、右侧普通商品；营业倒计时和耐心自然递减；关闭教程式商品高亮；READY 后点击柜台金币收款，收款后新顾客 / 新订单当帧刷新。Evidence：`output/runtime-qa-2026-07-04/gameplay-live-entry/runtime_390x844_p1010_first_test_live_contact_sheet_2026_07_04.png`。推荐首测 URL：`http://127.0.0.1:4174/index.html?qaFlow=first-test-live&qaInteractive=1`。
- P1-011 Preview Freeze Decoupling：`qa-pass on 2026-07-04`。用户指出当前构建预览仍像旧交付测试冻结态。确认代码里有两条冻结路径：默认 direct gameplay 会持续 `maintainDirectGameplaySnapshotState()`，旧 `probeState=payment` 会把完成态停 `999` 秒。已改为只有显式 `qaSnapshot=1` / `qaStatic=1` 才维持静态截图；默认构建预览不再冻结，`probeState=payment` 未带截图 flag 时只停 `0.85` 秒。TypeScript 通过；Cocos web-mobile 构建日志 `2026-07-04 13:08` 末尾成功，CLI 仍返回历史噪音码 `36`。Evidence：`output/runtime-qa-2026-07-04/freeze-unlock-check/`；`tmp/p1_freeze_unlock_qa.mjs` 验证默认入口、旧 payment 探针、首测入口在 2.5s -> 5.5s 均有画面变化。
- P1-012 Drag-To-Customer Body Polish：`qa-pass on 2026-07-04`。用户录屏反馈拖拽不顺滑、交付判定区域奇怪、应拖到顾客身上、拖拽容易断、提示太多、画面闪烁。已做最小 runtime 修复：顾客身体 + 订单气泡作为优先 drop 区，slot 保留 fallback；拖拽 ghost / target rim 复用以减少闪烁；无目标释放和普通部分完成减少 toast；微波炉不再吞掉路过的商品拖拽，非热食经过微波炉不再给红色 drop target；商品完成后直接记入顾客 `served`，避免 READY 收金币等待时全局 tray 锁住其它顾客；拖拽中禁止整屏 `render()` 清空 `dragState`，全屏拖拽捕手改为透明 surface 并补 cancel，开始拖拽时收掉旧 toast。TypeScript 与 diff check 通过；Cocos build log `temp/builder/log/web-mobile7-4-2026 18-20.log` 末尾成功，CLI 仍返回历史噪音码 `36`；`tmp/p1_drag_customer_target_qa.mjs` 通过，console 仅 1 个历史静态资源 `404 File not found` 噪音。Evidence：`output/runtime-qa-2026-07-04/drag-customer-target/`，关键图 `runtime_390x844_drag_customer_02_slow_hold_over_customer.png`、`runtime_390x844_drag_customer_03_snack_body_drop_added.png`、`runtime_390x844_drag_customer_04_right_ready_coin.png`、`runtime_390x844_drag_customer_06_left_ready_after_body_drop_right_still_ready.png`。
- P1-013 READY / Payment Prompt Obstruction：`qa-pass on 2026-07-06 / low-fi runtime`。用户真人录屏 `20260706095213_rec_.mp4` 显示核心链路可跑通，但 READY / 收款 / 慢收横幅过大且重复出现，遮挡顾客脸、订单气泡、金币堆和拖拽路径；支付反馈右侧金币块也贴边半露，像错层。已做最小 runtime 修复：READY 完成后只首次显示 `点金币收款` 小 toast，后续靠柜台金币堆 pulse；收款 / 慢收反馈改为短小 toast 并移到收银机附近；支付飞字缩进 390 安全区，不再使用右侧半露的大 P0 收款图；拖拽中仍清掉中心 toast。未改玩法规则、收入公式、READY baked 资源或 final art namespace。TypeScript 通过；Cocos build log `temp/builder/log/web-mobile7-6-2026 13-57.log` 末尾成功，CLI 仍返回历史噪音码 `36`；P1-013 QA console 相关错误 `0`。Evidence：`output/runtime-qa-2026-07-06/prompt-slim/runtime_390x844_p1013_prompt_slim_contact_sheet_2026_07_06.png`，关键图 `runtime_390x844_p1013_ready_coin_no_large_prompt_2026_07_06.png`、`runtime_390x844_p1013_drag_hold_no_center_prompt_2026_07_06.png`、`runtime_390x844_p1013_ready_first_compact_hint_2026_07_06.png`、`runtime_390x844_p1013_ready_coin_pulse_after_hint_2026_07_06.png`、`runtime_390x844_p1013_coin_collect_compact_feedback_2026_07_06.png`、`runtime_390x844_p1013_timeout_low_reward_compact_2026_07_06.png`。
- P1-014 Post-Shift Upgrade Page 390 Layout：`qa-pass on 2026-07-06 / low-fi runtime`。用户真人录屏 85s 进入经营升级页后，页面仍像旧宽布局，左右内容被裁切，返回按钮也被裁到右侧。已做最小 runtime 修复：结算 / 升级页改为 390x844 安全布局，本轮完成/流失、营业额/成本/净利、资金/星级/口碑、4 张升级卡、3 张经营策略卡和返回按钮均在首屏内完整可读；新增 `qaFlow=post-shift-upgrade` 验收入口并补白名单。返回按钮命中可用；按现有规则未选策略时提示，选策略后可返回经营中心。未生成新图、未改玩法收入规则或 final art namespace。TypeScript 通过；Cocos build log `temp/builder/log/web-mobile7-6-2026 16-23.log` 末尾成功，CLI 仍返回历史噪音码 `36`；P1-014 QA console 相关错误 `0`。Evidence：`output/runtime-qa-2026-07-06/post-shift-upgrade/runtime_390x844_p1014_post_shift_upgrade_contact_sheet_2026_07_06.png`，关键图 `runtime_390x844_p1014_post_shift_upgrade_initial_2026_07_06.png`、`runtime_390x844_p1014_post_shift_upgrade_return_click_2026_07_06.png`、`runtime_390x844_p1014_post_shift_upgrade_after_strategy_return_2026_07_06.png`。
- P1-015 First-Test Live Combined Regression：`qa-pass on 2026-07-06 / no runtime code change`。在 P1-013、P1-014、P2-004 后重新跑 `qaFlow=first-test-live&qaInteractive=1` 合并回归：真实开局、饭团进微波炉、右侧普通订单拖拽完成并点击金币、微波炉 ready 后左侧热饭团交付并点击金币、自然倒计时进入经营升级页、选策略后返回经营中心。相关 console/pageerror 为 `0`；所有截图为 `390x844`。本轮未改玩法规则、runtime 代码或美术资源。Evidence：`output/runtime-qa-2026-07-06/first-test-live-regression/runtime_390x844_first_test_live_regression_contact_sheet_2026_07_06.png`，summary：`output/runtime-qa-2026-07-06/first-test-live-regression/runtime_390x844_first_test_live_regression_summary_2026_07_06.json`。
- P1-016 Hot Ready Sold-Out Availability：`qa-pass on 2026-07-07 / low-fi runtime`。用户录屏 / 反馈 `20260707102559_rec_.mp4` 指出微波炉里已有 ready 热饭团，但饭团货架售罄后，热饭团订单顾客会被自动判定售罄离开。根因是 `canStillFulfillItem()` 只承认顾客绑定的微波炉加工品，漏算 P1-006D 后的“无归属微波炉 ready 热食暂存”。已做最小 runtime 修复：新增 `canMicrowaveServeOrderItem()`，允许无归属且商品匹配的 heating / ready 热食使热食订单保持可完成；`handleSoldOut()` 在炉内热食可完成当前订单时不再赶客；订单槽 heating / ready cue 复用同一判断。新增 `qaFlow=hot-ready-sold-out` 复现饭团货架 `x00`、仓库 `0`、炉内 ready 热饭团、顾客要热饭团，并在 preset 中主动跑售罄可服务性检查。未改库存、收益、顾客生成、微波炉占用规则或美术资源。TypeScript 通过；Cocos build log `temp/builder/log/web-mobile7-7-2026 10-36.log` 末尾成功，CLI 仍返回历史噪音码 `36`；目标 QA console/pageerror `0`；`tmp/p2_stock_overlay_slim_qa.mjs` 回归通过；`tmp/p1_drag_customer_target_qa.mjs` 回归通过，仅 1 个历史静态资源 `404 File not found` 噪音。Evidence：`output/runtime-qa-2026-07-07/hot-ready-sold-out/runtime_390x844_hot_ready_sold_out_contact_sheet_2026_07_07.png`，summary：`output/runtime-qa-2026-07-07/hot-ready-sold-out/runtime_390x844_hot_ready_sold_out_summary_2026_07_07.json`。
- P1-017 Patience Bar Flicker：`qa-pass on 2026-07-07 / low-fi runtime`。用户反馈耐心值减少时“一闪一闪”。根因是 `updateLiveUi()` 更新 final 耐心条时，`updateFinalPatienceFill()` 每次 destroy 旧 `Graphics` 再 add 新 `Graphics`，可能出现一帧空绘制。已做最小 runtime 修复：复用已有 `Graphics` 组件并 `clear()` 后重画 track + fill。未改耐心扣减、顾客流失、READY 低奖励、低耐心 pulse、布局或美术资源。TypeScript 通过；Cocos build log `temp/builder/log/web-mobile7-7-2026 10-56.log` 末尾成功，CLI 仍返回历史噪音码 `36`；目标 QA console/pageerror `0`，6 帧 390x844 contact sheet 未见空条重绘。Evidence：`output/runtime-qa-2026-07-07/patience-no-flicker/runtime_390x844_patience_no_flicker_contact_sheet_2026_07_07.png`，summary：`output/runtime-qa-2026-07-07/patience-no-flicker/runtime_390x844_patience_no_flicker_summary_2026_07_07.json`。
- P1-018 Ready Window Removed / Patience Unified：`qa-pass on 2026-07-07 / low-fi runtime`。用户确认不需要独立 `5 秒及时收款 / 超时低奖励`，也不需要单独等待收款耐心；订单完成后的收款压力统一并入现有顾客耐心。已做最小 runtime 修复：订单完成后只出现柜台金币，顾客耐心继续下降；点击金币按当前耐心结算，红耐心视为慢收；金币已出现但耐心归零时自动慢收并换客；未完成订单耐心归零仍按顾客流失处理。final gameplay 不再渲染 READY badge、READY 下方进度条或明显 selected order bubble。未改拖拽交付、库存、商品价格、顾客生成、微波炉占用或 final art namespace。TypeScript 通过；Cocos build log `temp/builder/log/web-mobile7-7-2026 12-35.log` 末尾成功，CLI 仍返回历史噪音码 `36`；`tmp/p1_ready_patience_unified_qa.mjs` 目标 QA console/pageerror `0`；`tmp/p1_hot_ready_sold_out_qa.mjs` 回归通过；`tmp/p1_drag_customer_target_qa.mjs` 回归通过，仅 1 个历史静态资源 `404 File not found` 噪音。Evidence：`output/runtime-qa-2026-07-07/ready-patience-unified/runtime_390x844_p1018_ready_patience_unified_contact_sheet_2026_07_07.png`，summary：`output/runtime-qa-2026-07-07/ready-patience-unified/runtime_390x844_p1018_ready_patience_unified_summary_2026_07_07.json`。
- P1-019 Microwave Ready Prompt Slim：`qa-pass on 2026-07-07 / low-fi runtime`。上一轮观察中，微波炉加热完成提示仍偏像中心横幅，可能抢顾客脸、订单气泡和拖拽路径。已做最小 runtime 修复：`heating -> ready` 完成反馈复用现有 compact toast，位置贴近微波炉，文案缩短为 `微笑饭团好了` / `微笑饭团好了，拖给顾客`。未改热食规则、加热时长、微波炉占用、拖拽交付、库存、顾客耐心、金币收款或美术资源。TypeScript 通过；Cocos build log `temp/builder/log/web-mobile7-7-2026 13-54.log` 末尾成功，CLI 仍返回历史噪音码 `36`；`tmp/p1_microwave_prompt_slim_qa.mjs` 目标 QA console/pageerror `0`；`tmp/p1_hot_ready_sold_out_qa.mjs` 回归通过；`tmp/p1_drag_customer_target_qa.mjs` 回归通过，仅 1 个历史静态资源 `404 File not found` 噪音。Evidence：`output/runtime-qa-2026-07-07/microwave-prompt-slim/runtime_390x844_p1019_microwave_prompt_slim_contact_sheet_2026_07_07.png`，summary：`output/runtime-qa-2026-07-07/microwave-prompt-slim/runtime_390x844_p1019_microwave_prompt_slim_summary_2026_07_07.json`。
- P1-020 First-Test Candidate Baseline：`qa-pass on 2026-07-07 / no runtime rule change`。用户暂时不真人测试，本轮把 P1-018 / P1-019 后的 `first-test-live` 跑成新的首测候选基线。自动链路覆盖真实开局、饭团进微波炉、右侧普通订单完成金币、点击金币收款、微波炉 ready、左侧热饭团交付、点击金币收款、自然倒计时进入经营升级页、选策略后返回经营中心。未改 runtime 规则、经济、美术或交互。Cocos build log `temp/builder/log/web-mobile7-7-2026 17-24.log` 末尾成功，CLI 仍返回历史噪音码 `36`；`tmp/p1_first_test_candidate_baseline_qa.mjs` 目标 QA console/pageerror `0`。首测观察卡已把旧 `READY 金币` 测试语言改为“订单完成金币”。Evidence：`output/runtime-qa-2026-07-07/first-test-candidate-baseline/runtime_390x844_p1020_first_test_candidate_contact_sheet_2026_07_07.png`，summary：`output/runtime-qa-2026-07-07/first-test-candidate-baseline/runtime_390x844_p1020_first_test_candidate_summary_2026_07_07.json`。
- P1-021 Prep / Business Center 390 Layout After Return：`qa-pass on 2026-07-07 / low-fi runtime`。P1-020 自动回归发现，经营升级页本身已适配 390x844，但选策略后返回经营中心 / 备货页仍是旧宽布局，左右内容裁切明显。已做最小 runtime 修复：经营中心 / 备货页改为 390x844 安全布局，标题、资金 / 目标摘要、6 张商品库存卡、6 张采购卡、`经营前准备`、`补至基础库存`、`确认采购并营业`、`返回经营中心` 均完整可读可点。未改采购规则、库存经济、营业页玩法或美术资源。TypeScript 与 diff check 通过；Cocos build log `temp/builder/log/web-mobile7-7-2026 18-29.log` 末尾成功，CLI 仍返回历史噪音码 `36`；`tmp/p1_business_center_390_qa.mjs` 目标 QA console error `0`。Evidence：`output/runtime-qa-2026-07-07/business-center-390/runtime_390x844_p1021_business_center_390_contact_sheet_2026_07_07.png`。
- P1-022 First-Test Candidate Refresh After P1-021：`qa-pass on 2026-07-08 / no runtime code change`。在 P1-021 后重新刷新 `first-test-live` 首测候选基线，完整自动链路覆盖真实开局、饭团进微波炉、右侧订单完成金币、右侧收款、微波炉 ready、左侧热饭团完成金币、左侧收款换客、自然进入升级页、选策略返回经营中心、进入经营前准备、补至基础库存。未改 runtime 规则、经济、美术或交互；只新增 P1-022 QA 脚本和 contact sheet。`tmp/p1_first_test_candidate_refresh_qa.mjs` 目标 QA console/pageerror `0`。Evidence：`output/runtime-qa-2026-07-08/first-test-candidate-refresh/runtime_390x844_p1022_first_test_candidate_contact_sheet_2026_07_08.png`，summary：`output/runtime-qa-2026-07-08/first-test-candidate-refresh/runtime_390x844_p1022_first_test_candidate_summary_2026_07_08.json`。
- P1-023 Pre-Test Team Review：`Go with notes on 2026-07-08 / no runtime code change`。按用户建议建立 Product/planning、Art/UI、Development/testing 子智能体做团队复核。三方结论均为 `Go with notes`，无 blocker。Product 确认首测只验证拖拽服务、微波炉占用、订单完成金币收款是否形成调度感；Art/UI 确认无首测级遮挡或裁切阻断，金币偏小、微波炉 ready 误读、热 / 冷饭团差异偏细作为观察项，final art 后置；Development/testing 确认入口可达、P1-022 summary 相关 console/pageerror 为 `0`、P1-021 构建日志成功。首测前冻结 gameplay / 美术 / 经济追加。Evidence：`output/runtime-qa-2026-07-08/first-test-candidate-refresh/runtime_390x844_p1022_first_test_candidate_contact_sheet_2026_07_08.png`。
- P1-024 Payment Burst Blocks Ready Coin Tap：`qa-pass on 2026-07-08 / low-fi runtime`。用户真人录屏 `/Users/ban/Library/Application Support/LarkShell/screenshot/20260708103220_rec_.mp4` 显示收银金币动画 / 金额牌会挡住右侧待收金币点击区域，导致必须等动画跑完才能点。已做最小 runtime 修复：`PaymentBurst` 从右侧收银机 / 右侧金币热区移到左上营业额 HUD 附近；`finishCustomerOrder()` 不再额外生成收款 compact toast，只保留状态文案和 HUD 附近金额反馈。未改收入公式、combo、低奖励判断、顾客耐心、订单完成、金币点击、微波炉、库存或美术资源。TypeScript 与 diff check 通过；Cocos build log `temp/builder/log/web-mobile7-8-2026 11-41.log` 末尾成功，CLI 仍返回历史噪音码 `36`；`tmp/p1_payment_burst_no_block_qa.mjs` 目标 QA console/pageerror `0`，断言覆盖上一笔 `PaymentBurst` 播放中右侧金币可点；`tmp/p1_first_test_candidate_refresh_qa.mjs` 完整首测候选回归 console/pageerror `0`。Evidence：`output/runtime-qa-2026-07-08/payment-burst-no-block/runtime_390x844_p1024_payment_burst_no_block_contact_sheet_2026_07_08.png`，summary：`output/runtime-qa-2026-07-08/payment-burst-no-block/runtime_390x844_p1024_payment_burst_no_block_summary_2026_07_08.json`。
- P1-025 Sold-Out Auto-Close Prompt Slim：`qa-pass on 2026-07-08 / low-fi runtime`。P1-024 录屏复核中 73s 附近可见 `商品已全部售空，自动停止接客；处理完店内顾客后结算` 中心大横幅重新遮挡顾客脸、订单区、金币区和拖拽路径。已做最小 runtime 修复：`beginAutoClose()` 改为复用现有库存 compact toast，文案缩短为 `库存售空，服务店内顾客后结算`，位置保持在下方安全区；不再弹中心大横幅。未改库存、补货、售罄离开、自动停客、结算、收入、顾客耐心、微波炉、金币收款或美术资源。TypeScript 与 diff check 通过；Cocos build log `temp/builder/log/web-mobile7-8-2026 18-02.log` 末尾成功，CLI 仍返回历史噪音码 `36`；`tmp/p1_sold_out_autoclose_prompt_qa.mjs` 目标 QA console/pageerror `0`；`tmp/p1_first_test_candidate_refresh_qa.mjs` 完整首测候选回归 console/pageerror `0`。Evidence：`output/runtime-qa-2026-07-08/sold-out-autoclose-prompt/runtime_390x844_p1025_sold_out_autoclose_prompt_contact_sheet_2026_07_08.png`，summary：`output/runtime-qa-2026-07-08/sold-out-autoclose-prompt/runtime_390x844_p1025_sold_out_autoclose_prompt_summary_2026_07_08.json`。
- P1-026 Drag Error Feedback De-Text：`qa-pass on 2026-07-09 / low-fi runtime`。用户真人测试录屏 `/Users/ban/Library/Application Support/LarkShell/screenshot/20260709102533_rec_.mp4` 和文字反馈确认：拖拽服务可玩，但错误反馈仍有提示感，用户希望改成其他方式。已做最小 runtime 修复：`rejectWrongProductForCustomer()` 不再弹出拖错文字 toast，拖错仍断 combo、扣耐心、触发订单错误态、顾客 angry 和 shake；微波炉占用 / tray 锁提示改为 compact。未改商品交付判定、订单规则、库存、微波炉、收入、顾客耐心规则或美术资源。TypeScript 与 diff check 通过；Cocos build log `temp/builder/log/web-mobile7-9-2026 11-43.log` 末尾成功，CLI 仍返回历史噪音码 `36`；`tmp/p1_drag_error_detext_qa.mjs` 目标 QA console/pageerror `0`，断言覆盖拖错顾客释放后无 `Toast` / `ToastNode`、微波炉占用提示为 compact；`tmp/p1_drag_customer_target_qa.mjs` 拖拽主链路回归通过，仅保留历史静态资源 `404 File not found` 噪音；`tmp/p1_first_test_candidate_refresh_qa.mjs` 完整首测候选回归 console/pageerror `0`。Evidence：`output/runtime-qa-2026-07-09/drag-error-detext/runtime_390x844_p1026_drag_error_detext_contact_sheet_2026_07_09.png`，summary：`output/runtime-qa-2026-07-09/drag-error-detext/runtime_390x844_p1026_drag_error_detext_summary_2026_07_09.json`。
- P1-027 Occupied Microwave Drag Feedback De-Text：`qa-pass on 2026-07-09 / low-fi runtime`。在 P1-026 后继续处理设备占用仍像说明文字的问题。本轮只取消“拖拽释放到占用微波炉”时的 compact toast，改为状态消息 `微波炉占用中` + 微波炉 shake；拖拽悬停的红色 no-drop rim、点击 / 点卡 fallback 的必要教学文案仍保留。未改微波炉占用规则、热食暂存规则、库存、订单、收入、顾客耐心或美术资源。TypeScript 与 diff check 通过；Cocos build log `temp/builder/log/web-mobile7-9-2026 15-55.log` 末尾成功，CLI 仍返回历史噪音码 `36`；`tmp/p1_drag_error_detext_qa.mjs` 目标 QA `passed: true`，console/pageerror `0`，断言覆盖拖错顾客无 toast、占用微波炉无 toast；`tmp/p1_first_test_candidate_refresh_qa.mjs` 完整首测候选回归 console/pageerror `0`。Evidence：`output/runtime-qa-2026-07-09/drag-error-detext/runtime_390x844_p1026_drag_error_detext_contact_sheet_2026_07_09.png`，summary：`output/runtime-qa-2026-07-09/drag-error-detext/runtime_390x844_p1026_drag_error_detext_summary_2026_07_09.json`。

## P2 Polish / Later

### P2-004：售罄 / 补货 overlay 降噪

- Owner：Development/testing + Art/UI
- Status：`qa-pass on 2026-07-06 / low-fi runtime`
- Symptom：用户真人录屏后半局中售罄 / 补货状态能表达库存压力，但红色块过抢，容易和主订单目标、商品区、拖拽路径抢注意力。
- Minimal fix：已把 gameplay 商品卡中心大售罄 / 补货提示改为小角标；库存相关 toast 改为下方 compact feedback，落在收银台与商品区之间，不再压住顾客脸和订单气泡。新增 `qaFlow=stock-noise` 复现多商品售罄 / 补货视觉状态。本轮未改库存、补货、售罄离开、收入、READY 或热食规则，未生成新图。
- Verification：TypeScript 通过；`git diff --check` 通过；Cocos build log `temp/builder/log/web-mobile7-6-2026 17-05.log` 末尾成功，CLI 仍返回历史噪音码 `36`；`tmp/p2_stock_overlay_slim_qa.mjs` 390x844 QA console 相关错误 `0`。
- Evidence：`output/runtime-qa-2026-07-06/stock-overlay-slim/runtime_390x844_p2_stock_overlay_slim_contact_sheet_2026_07_06.png`，关键图 `runtime_390x844_p2_stock_noise_compact_chips_2026_07_06.png`、`runtime_390x844_p2_sold_out_needed_before_drag_2026_07_06.png`、`runtime_390x844_p2_sold_out_needed_after_drag_feedback_2026_07_06.png`。

### P2-001：底部 nav 最终功能页尚未规划到可开发粒度

- Owner：Product
- Symptom：采购、库存、升级、图鉴等页面还没有完整交互蓝图。
- Why it matters：商业版需要，但不应阻塞当前 gameplay 页稳定化。
- Minimal fix：当前页 P0 清完后，再做 UI flow 文档。

### P2-002：音效和强反馈缺失

- Owner：Product + Art/UI + Development/testing
- Symptom：完成订单、错误、低耐心、微波炉 ready 等主要靠视觉和 toast。
- Why it matters：商业发布手感需要声音和更强动效。
- Minimal fix：先列 sound cue，不急着接资源。

### P2-003：最终美术候选仍需替换低保真 runtime 绘制件

- Owner：Art/UI
- Symptom：耐心条、READY final parts、部分状态 overlay 仍是低保真或 baked placeholder。
- Why it matters：影响商业最终质量，但不应压过 P0 可玩稳定性。
- Minimal fix：等 gameplay 状态稳定后按状态清单生产 final art。
- Generation Rule：`frozen until requested`。后续需要最终美术时，Coordination 先拆成单独资产包 brief，再交给 Art/UI 员工生成；生成交付以单独透明 PNG / 可分层资源为主，放入 `assets/ui/final-candidates/**`。每个生成批次还需要提供“接入当前生成美术资源后的预览图”，用于用户在 Figma / runtime 里判断层级关系、遮挡和整体效果；预览图不能替代单独透明资源，也不能用 Codex/Figma 临时绘制件冒充 final asset。
- P2-003A Ready Coin + Patience Pack：`brief-ready on 2026-07-04`。第一批最终美术候选限定为柜台 READY 金币堆和顾客局部耐心条，路径为 `assets/ui/final-candidates/gameplay-ready-coin-patience-v1/`，brief 为 `docs/FINAL_ART_READY_COIN_PATIENCE_BRIEF_2026_07_04.md`。本批必须同时交付单独 PNG 和 390x844 接入预览图；READY baked badge 继续冻结，不生成、不拆、不覆盖。
- P2-003A Candidate Result：`candidate-produced / pending Art/UI + user review on 2026-07-04`。已生成独立 PNG：2 / 4 / 8 金币堆、收款 sparkle、耐心 track、green / yellow / red fill；已生成候选 contact sheet 和 390x844 接入预览图。资源仍留在 `final-candidates`，未接入 runtime final namespace。Evidence：`assets/ui/final-candidates/gameplay-ready-coin-patience-v1/_qa/ready_coin_patience_asset_contact_sheet.png`、`assets/ui/final-candidates/gameplay-ready-coin-patience-v1/_qa/integration_preview_390x844.png`。
- P2-003B Order State Cues Pack：`brief-ready on 2026-07-04`。第二批最终美术候选限定为订单槽和拖拽局部状态贴片：hot-required、filled-check、heating-steam、microwave-ready-spark、valid drop rim、invalid drop mark。路径为 `assets/ui/final-candidates/gameplay-order-state-cues-v1/`，brief 为 `docs/FINAL_ART_ORDER_STATE_CUES_BRIEF_2026_07_04.md`。不重绘商品 icon，不重绘订单气泡，不碰 READY baked badge。
- P2-003B Candidate Result：`candidate-produced / pending Art/UI + user review on 2026-07-04`。已生成独立 PNG：hot-required flame、filled check、heating steam、microwave-ready spark、valid drop rim、invalid drop X；已生成候选 contact sheet 和两张 390x844 接入预览图。资源仍留在 `final-candidates`，未接入 runtime final namespace。Evidence：`assets/ui/final-candidates/gameplay-order-state-cues-v1/_qa/order_state_cues_asset_contact_sheet.png`、`assets/ui/final-candidates/gameplay-order-state-cues-v1/_qa/integration_preview_order_state_cues_390x844.png`、`assets/ui/final-candidates/gameplay-order-state-cues-v1/_qa/integration_preview_order_state_cues_ready_390x844.png`。
- P2-003C Payment Feedback Pack：`brief-ready on 2026-07-04`。第三批最终美术候选限定为收银成功反馈空胶囊、金币 token、sparkle 和 cashier glow。旧 P0 收银反馈图包含 baked amount，本批明确不烘焙金额、不改收银机、不改经济规则。路径为 `assets/ui/final-candidates/gameplay-payment-feedback-v1/`，brief 为 `docs/FINAL_ART_PAYMENT_FEEDBACK_BRIEF_2026_07_04.md`。
- P2-003C Candidate Result：`candidate-produced / pending Art/UI + user review on 2026-07-04`。已生成独立 PNG：empty payment capsule、coin token、sparkle cluster、cashier success glow；已生成候选 contact sheet 和 390x844 接入预览图。预览里的 `+25` 是 runtime 动态文字示意，不在单独 PNG 内。资源仍留在 `final-candidates`，未接入 runtime final namespace。Evidence：`assets/ui/final-candidates/gameplay-payment-feedback-v1/_qa/payment_feedback_asset_contact_sheet.png`、`assets/ui/final-candidates/gameplay-payment-feedback-v1/_qa/integration_preview_payment_feedback_390x844.png`。

## Recommended Next Fix Round

P1-013 / P1-014 / P2-004 已完成，并已通过一次 `first-test-live` 合并回归。P1-016 已修复“炉内 ready 热饭团被售罄误判”首测 bug。P1-017 已修复低保真耐心条更新时的闪烁感。P1-018 已删除 READY 独立收款窗口，金币 + 顾客耐心成为完成 / 收款的唯一主语义。P1-019 已把微波炉完成提示从中心横幅降为设备附近的小 toast。P1-021 已修复返回经营中心 / 备货页的 390x844 裁切。P1-022 已刷新当前首测候选基线，自动链路 console/pageerror 为 `0`。P1-023 团队复核曾为 `Go with notes`。用户 2026-07-08 真人录屏新增的 P1-024 收银金币动画遮挡右侧待收金币点击、P1-025 售罄自动停客大横幅遮挡，均已修复并刷新首测候选回归。用户 2026-07-09 真人测试确认核心链路可跑通，P1-026 拖拽错误反馈去文字化和 P1-027 占用微波炉拖拽反馈去文字化均已完成并通过自动回归。

原因：

- P0-001 / P0-002 / P0-003 / P0-004 / P0-005 已在 2026-07-03 实现并通过截图 / 交互验收。
- P1-001 已在 2026-07-03 完成低保真 runtime 验证：READY 低奖励窗口已与普通耐心条分离表达。
- P1-002 / P1-002.1 已在 2026-07-03 完成低保真 runtime 验证：订单内 partial、heating、microwave-ready 三态已有可截图复核的局部 cue，且已移除容易误解为进度条的横条。
- P1-003 已冻结：用户可能改成拖拽交付，当前顾客选择态可能不再需要。
- P1-006 brief 已完成：`docs/P1_DRAG_SERVICE_INTERACTION_BRIEF_2026_07_03.md`。
- P1-006A / P1-006B 已完成：拖拽主链路、热食微波炉路径、错误反馈、手指遮挡和热食需求可读性均已有低保真截图证据。
- READY 收款模型已定为点击柜台金币，并已通过低保真 runtime 截图 QA。
- 首测前不加备餐位 / 暂存位；微波炉 ready 占用就是热食暂存。
- P1-007 已完成完整链路回归：拖拽热食、微波炉占用、ready 持有、拖回订单、点击金币收款、READY timeout 低奖励均有 390x844 截图证据。
- P1-008 已完成首测观察卡：`docs/P1_FIRST_TEST_OBSERVATION_CARD_2026_07_03.md`。
- P1-009 已通过复验：顾客替换后立即重绘，不再停留在完成态。
- P1-010 已新增首测 live 入口：倒计时 / 耐心会动，初始订单未完成，首测不再依赖截图冻结 preset。
- P1-011 已解除默认构建预览冻结：静态快照维持只保留给显式截图 flag，旧 `probeState=payment` 误打开也不会 999 秒卡住。
- P1-013 已把 READY / 收款 / 慢收提示从大横幅降为小反馈，避免长期挡订单和拖拽路径。
- P1-014 已把经营升级页压进 390x844 首屏，返回按钮可点。
- P2-004 已把售罄 / 补货 overlay 降噪为商品卡小角标和下方 compact feedback。
- P1-015 已通过 `first-test-live` 合并回归：首测主链路可自然跑到经营升级页。
- P1-016 已修复微波炉无归属 ready 热食未计入可服务性的问题：饭团货架售罄时，炉内热饭团仍可完成热饭团订单，不会自动售罄离开。
- P1-017 已修复耐心条更新时反复重建 `Graphics` 导致的闪烁感，未改耐心规则。
- P1-018 已把 READY 独立窗口合并进顾客耐心：金币出现表示订单完成，顾客耐心决定收款质量。
- P1-019 已把微波炉完成提示局部化，热食完成时不再弹中心大横幅。
- P1-021 已完成：返回经营中心 / 备货页已有 390x844 最小可用布局，证据为 `output/runtime-qa-2026-07-07/business-center-390/runtime_390x844_p1021_business_center_390_contact_sheet_2026_07_07.png`。
- P1-022 已刷新当前首测候选基线：`output/runtime-qa-2026-07-08/first-test-candidate-refresh/runtime_390x844_p1022_first_test_candidate_contact_sheet_2026_07_08.png`。
- P1-023 已完成首测前团队复核：Product / Art/UI / Development/testing 均为 `Go with notes`，首测前冻结 gameplay / 美术 / 经济追加。
- P1-024 已完成：收银反馈移到左上营业额 HUD 附近，收款 compact toast 不再额外生成；目标 QA 确认上一笔 `PaymentBurst` 播放中仍能点击右侧金币。
- P1-025 已完成：售罄自动停客提示从中心大横幅降为下方库存 compact toast；目标 QA 确认不再占用订单完成金币和顾客区。
- 2026-07-09 真人测试复核：收入 `0 -> 725`，第 29 轮结算页在 390x844 内完整可见；无收款遮挡、耐心闪烁、完成态卡死或金币收不了。用户明确反馈拖拽错误提示仍应换成更局部的反馈方式。
- P1-026 已完成：拖错顾客不再弹文字 toast，改由局部红框、订单错误态、顾客 angry / shake 表达；设备占用提示降为 compact。

下一轮门禁：

- Owner：Coordination + Product 判断是否恢复真人首测；Development/testing 只处理新录屏里的明确可复现 bug；Art/UI 继续把 final 收银动画、金币层级、错误反馈动效和售罄提示留到单独 brief。
- Brief：P1-024 / P1-025 / P1-026 已解除，下一步优先恢复真人首测；不继续主动扩系统。
- Review：真人首测继续观察拖错时是否能通过局部红框 / 顾客反应理解错误、微波炉占用是否仍可理解、后半局库存压力和局末炉内热食是否需要 Product 决策。
- Record：继续更新本 backlog、`docs/LOCAL_TASK_BOARD.md` 和 `docs/P1_FIRST_TEST_OBSERVATION_CARD_2026_07_03.md`。

## 2026-07-03 Fix Result: P0-001 / P0-002

Owner / Brief / Review / Record：

- Owner：Development/testing 负责稳定 QA flow、动态收入绑定、构建和截图 QA。
- Brief：建立 `qaFlow` 自然流入口，并把顶部金币从硬编码 `1,258` 改为 `revenue` 动态显示。
- Review：Product 复核交付收钱是否更清楚；Art/UI 复核 HUD 数字与状态截图不破坏目标图层级。
- Record：本节、`docs/LOCAL_TASK_BOARD.md`、`assets/scripts/presentation/MonsterStorePrototype.ts`、`output/runtime-qa-2026-07-03/gameplay-flow-p0/`。

本轮结果：

- P0-001：`pass`。新增并验证 `qaFlow=ready-left|right-current-empty|heating|microwave-ready|low-stock|red-patience`。
- P0-002：`pass`。`ready-left` 初始截图顶部金币为 `0`；点击左侧 READY 订单后变为 `42`，收银反馈与收入同步。
- QA 专用修补：`qaFlow=heating` 的剩余加热时间拉长到 30 秒，只影响 QA preset，不改变正式玩法和普通 `probeState=heating`。
- 构建：`temp/builder/log/web-mobile7-3-2026 14-12.log` 末尾为 `build Task (web-mobile) Finished in (18 s)ms`；CLI 仍返回项目历史噪音码 `36`。

截图证据：

- Contact sheet：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_qaflow_contact_sheet_2026_07_03.png`
- READY 前：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_qaflow_ready_left_before_cdp_wait16_2026_07_03.png`
- READY 点击后：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_qaflow_ready_left_after_click_cdp_2026_07_03.png`
- Heating 稳定截图：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_qaflow_heating_window_fix_cdp_2026_07_03.png`
- 批量 preset console：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_qaflow_batch_console_2026_07_03.json`

QA 注意：

- 普通 Chrome headless 会截到纯 `#333333`，不能作为 Cocos runtime 验收证据；本轮改用可视 Chrome + CDP，截图像素和画面有效。
- `ready-left` 首次 8.5 秒截图曾出现资源未完全重绘的画面；16 秒后稳定。后续 CDP 截图应等待资源完整渲染后再判定。
- P0-003 当时未完成：`qaFlow=heating` 只是稳定“正在加热”的截图入口，不等于完整热食自然流通过。后续已在 P0-003 轮补齐。

## 2026-07-03 Art Input Check: Updated Face Export

Owner / Brief / Review / Record：

- Owner：Art/UI 负责判断新表情资源是否同画布、同眼睛锚点、同脸部占比；Development/testing 负责只读盘点和接入风险判断。
- Brief：用户说明 `/Users/ban/Documents/怪兽便利店/manual-figma-export-2026-07-02` 内表情资源已更新。
- Review：若资源和 runtime 不一致，再走 normalized -> runtime 的最小复制；若一致，不做无意义覆盖。
- Record：本节、`output/runtime-qa-2026-07-03/customer_face_update_check_2026_07_03.png`。

检查结论：

- 仅发现 `manual-figma-export-2026-07-02/face_happy_v1 3.png` 在 `2026-07-03 14:03:08` 更新。
- 该文件 MD5 为 `93275a15eb9f7a7bfd585604cfbde9ba`，与 normalized 蓝色 happy、runtime 蓝色 happy 完全一致。
- 紫色 happy MD5 为 `82313d422060c9811e58465b51ee7980`，raw / normalized / runtime 也一致。
- 因此本轮不复制 PNG、不碰 `.meta`、不触发 Cocos GUID 风险。
- Art/UI 仍需最终判断 happy 表情是否在商业质量上足够自然；Development/testing 结论是“当前 runtime 已使用这批资源”。

## 2026-07-03 Art Input Check: Updated Face Export Round 2

Owner / Brief / Review / Record：

- Owner：Art/UI 负责表情切换自然度判断；Development/testing 负责同步状态、构建和截图 QA。
- Brief：用户再次更新 `manual-figma-export-2026-07-02` 内表情资源，要求复查。
- Review：检查 raw / normalized / runtime MD5，截图 `qaFaceMood=waiting|happy|urgent`，判断是否还需要代码修 placement。
- Record：本节、`docs/LOCAL_TASK_BOARD.md`、`output/runtime-qa-2026-07-03/runtime_390x844_face_mood_round2_contact_sheet_2026_07_03.png`。

检查结论：

- 6 张 raw face PNG 均更新为 `2026-07-03 14:19:18`，且统一透明画布 `263x289`。
- raw / normalized / runtime 三处 MD5 完全一致；本轮未复制 `.meta`，未产生 Cocos GUID 风险。
- Cocos 构建：`temp/builder/log/web-mobile7-3-2026 14-23.log` 末尾为 `build Task (web-mobile) Finished in (11 s)ms`。
- runtime 截图：
  - `output/runtime-qa-2026-07-03/runtime_390x844_face_mood_waiting_round2_2026_07_03.png`
  - `output/runtime-qa-2026-07-03/runtime_390x844_face_mood_happy_round2_2026_07_03.png`
  - `output/runtime-qa-2026-07-03/runtime_390x844_face_mood_urgent_round2_2026_07_03.png`
  - `output/runtime-qa-2026-07-03/runtime_390x844_face_mood_round2_contact_sheet_2026_07_03.png`

P0 判断：

- 表情切换已经不再呈现明显整脸拉伸或画布跳动，当前可通过 P0。
- urgent 的眼睛更窄、位置略有表演差异；若后续要达到 final polish，应由 Art/UI 继续要求同眼睛锚点、同脸部占比的最终表情套图，而不是先改 runtime 逻辑。
- P0-003 已在后续 gameplay flow 轮通过；当时下一项是 P0-004，现已通过。

## 2026-07-03 Fix Result: P0-003 Hot Food Natural Flow

Owner / Brief / Review / Record：

- Owner：Development/testing 负责最小 QA 入口、构建、真实点击、截图和 console 检查。
- Brief：跑完整热食自然流，确认商品进入微波炉、加热中、完成提示、点击回填、订单 READY、交付入账。
- Review：Product 检查热食是否形成“手忙脚乱但爽”的调度点；Art/UI 检查 heating / ready / order item 状态是否一眼可读。
- Record：本节、`docs/LOCAL_TASK_BOARD.md`、`assets/scripts/presentation/MonsterStorePrototype.ts`、`output/runtime-qa-2026-07-03/gameplay-flow-p0/`。

本轮改动：

- 新增 QA-only `qaFlow=hot-food-natural`。
- 该 flow 只在 URL 参数下生效：左侧顾客只点热饭团订单，微波炉解锁且空闲，饭团库存充足，班次和耐心延长到 180 秒，避免 QA 截图过程中跳结算。
- 正式 gameplay 规则、热食加热时间、商品价格、订单奖励均未改动。

验证结果：

- Cocos build：`temp/builder/log/web-mobile7-3-2026 14-40.log` 末尾为 `build Task (web-mobile) Finished in (6 s)ms`；CLI 仍返回项目历史噪音码 `36`。
- 真实点击链路通过：饭团商品卡 -> 微波炉加热 -> 微波炉 ready -> 点击设备回填 -> 订单 READY -> 点击订单气泡交付。
- 交付后顶部收入从 `0` 增加到 `21`。
- 浏览器 console error：`0`。

截图证据：

- Contact sheet：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p003_hot_food_natural_contact_sheet_2026_07_03.png`
- 初始：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p003_hot_food_run2_01_initial_2026_07_03.png`
- 加热中：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p003_hot_food_run2_02_after_rice_click_2026_07_03.png`
- 微波炉 ready：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p003_hot_food_run2_03_microwave_ready_2026_07_03.png`
- 订单 READY：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p003_hot_food_run2_04_after_microwave_click_2026_07_03.png`
- 交付后：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p003_hot_food_run2_05_after_order_delivery_2026_07_03.png`

角色结论：

- Development/testing：`pass for P0-003`。
- Product：`pass for core verb`，热食形成了第一个“先放设备、再取回、再交付”的调度点；后续应继续用双顾客和库存压力放大手忙脚乱的爽点。
- Art/UI：`conditional pass`，heating / microwave ready / order READY 可读；ready_from_device 的局部强调仍可在 P1-002 做 polish。

## 2026-07-03 Fix Result: P0-004 Stock Feedback

Owner / Brief / Review / Record：

- Owner：Product + Development/testing 负责库存反馈是否服务策略核心、最小实现、真实点击 QA 和 console 检查。
- Brief：验证缺货 / 补货 / 售罄路径，确认玩家能理解库存后果，不误扣库存，不破坏当前订单流。
- Review：Product 检查库存反馈是否支撑“库存 / 升级规划”；Art/UI 检查商品卡状态是否一眼可读。
- Record：本节、`docs/LOCAL_TASK_BOARD.md`、`assets/scripts/presentation/MonsterStorePrototype.ts`、`output/runtime-qa-2026-07-03/gameplay-flow-p0/`。

本轮改动：

- final 商品卡在 `stock <= 0` 时显示 overlay：仓库有货为 `补货中`，仓库无货为 `售罄`。
- 新增 QA-only `qaFlow=sold-out-needed`，复现当前订单商品货架和仓库都为 0 的售罄路径。
- 正式库存、补货、售价、订单规则未改动。

验证结果：

- Cocos build：`temp/builder/log/web-mobile7-3-2026 15-04.log` 末尾为 `build Task (web-mobile) Finished in (7 s)ms`；CLI 仍返回项目历史噪音码 `36`。
- `qaFlow=low-stock`：初始商品卡显示 `x00 + 补货中`；点击后保持补货反馈，不误完成订单；补货计时后库存恢复到 `x02`。
- `qaFlow=sold-out-needed`：商品卡显示 `x00 + 售罄`；点击当前订单所需售罄商品后收入保持 `0`，订单无法完成，后续出现新订单。
- 浏览器 console error：`0`。

截图证据：

- Contact sheet：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p004_stock_feedback_contact_sheet_2026_07_03.png`
- Low stock 初始：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p004_low_stock_01_initial_2026_07_03.png`
- Low stock 点击：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p004_low_stock_02_after_click_2026_07_03.png`
- Low stock 补货后：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p004_low_stock_03_restocking_2026_07_03.png`
- Sold out 初始：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p004_sold_out_needed_01_initial_2026_07_03.png`
- Sold out 点击：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p004_sold_out_needed_02b_toast_fast_2026_07_03.png`
- Sold out 结果：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p004_sold_out_needed_03_after_outcome_2026_07_03.png`

角色结论：

- Product：`pass for P0 strategy feedback`，玩家能看到库存短缺的直接后果。
- Development/testing：`pass for P0-004`。
- Art/UI：`conditional pass`，商品卡 overlay 可读；toast / 顾客离开原因的更强演出留到 P1/P2 polish。

## 2026-07-03 Fix Result: P0-005 Bottom Nav P0 State

Owner / Brief / Review / Record：

- Owner：Product + Development/testing 负责底部五入口 P0 状态、最小实现、截图和触控 QA。
- Brief：当前只完成营业页 playable probe；底部采购 / 库存 / 升级 / 图鉴不能被玩家误解为已完成页面。
- Review：Product 检查入口语义是否符合商业版规划；Art/UI 检查 disabled / coming-soon 表达是否不抢主 gameplay 视线。
- Record：本节、`docs/LOCAL_TASK_BOARD.md`、`assets/scripts/presentation/MonsterStorePrototype.ts`、`output/runtime-qa-2026-07-03/gameplay-flow-p0/`。

本轮结果：

- 底部入口标签明确为 `营业 / 采购 / 库存 / 升级 / 图鉴`。
- `营业` 点击反馈 `当前营业页`。
- 其他四个入口显示半透明 dim 和 `即将` 小标，点击反馈 `采购即将开放` 等对应提示。
- 点击反馈后立即 `render()`，toast 不再等下一帧状态刷新。

验证结果：

- TypeScript check：`tsc --noEmit --pretty false --skipLibCheck --lib ES2017,DOM` 通过。
- Cocos build：`temp/builder/log/web-mobile7-3-2026 15-39.log` 末尾为 `build Task (web-mobile) Finished in (6 s)ms`；CLI 仍返回历史噪音码 `36`。
- CDP 390x844 五入口点击截图已落盘；console 只有 favicon 404 和 Cocos scene load `timeEnd`，无 runtime exception。
- 单点采购截图确认点击后立即出现 `采购即将开放` 反馈。

截图证据：

- 五入口 contact sheet：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p005_bottom_nav_cdp_contact_sheet_2026_07_03.png`
- 采购点击后：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p005_bottom_nav_cdp_single_procurement_after_render_2026_07_03.png`
- 五入口截图组：`output/runtime-qa-2026-07-03/gameplay-flow-p0/runtime_390x844_p005_bottom_nav_cdp_five_01_initial_2026_07_03.png` 到 `runtime_390x844_p005_bottom_nav_cdp_five_06_tap_4_2026_07_03.png`

角色结论：

- Product：`pass for P0 roadmap clarity`，当前只承诺营业页；其他入口表达为后续商业版页面。
- Development/testing：`pass for P0-005`。
- Art/UI：`conditional pass`，`即将` 小标可读且不抢核心服务调度；最终 nav 美术和页面状态留到 P2-001。

## 2026-07-03 Fix Result: P1-001 READY Low-Reward Window

Owner / Brief / Review / Record：

- Owner：Product + Development/testing + Art/UI 共同负责 READY 后低奖励窗口的玩法语义、状态机安全和低保真视觉表达。
- Brief：区分“已完成订单慢收少奖励 / 断连击”和“未完成订单普通耐心流失”。本轮不生成新图、不拆 READY baked 资源、不覆盖 `ready_badge_compact.png`。
- Review：Product 复核低奖励惩罚语义服务调度优先级；Art/UI 复核 READY countdown 附着订单且不遮 baked READY 和商品 icon；Development/testing 复核状态机、自动成交、收入、combo 和截图 QA。
- Record：本节、`docs/LOCAL_TASK_BOARD.md`、`assets/scripts/presentation/MonsterStorePrototype.ts`、`output/runtime-qa-2026-07-03/gameplay-flow-p1/`。

本轮结果：

- READY 后进入 5 秒领取窗口；READY 状态下普通耐心不继续扣。
- 窗口超时自动低奖励成交：无小费、combo reset、不算顾客流失。
- 窗口内点击仍给及时奖励。
- 新增低保真 READY 倒计时下划线，附着订单，不遮 baked READY 和商品 icon。
- 新增 / 验证 `qaFlow=ready-window-mixed` 与 `qaFlow=ready-window-timeout`。

验证结果：

- TypeScript check：`tsc --noEmit` 通过。
- Cocos build：`temp/builder/log/web-mobile7-3-2026 16-19.log` 末尾显示成功；CLI 仍返回历史噪音码 `36`。
- 390x844 截图证据：
  - `output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1001_ready_window_contact_sheet_2026_07_03.png`
  - `output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1001_ready_window_mixed_final_2026_07_03.png`
  - `output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1001_ready_window_timeout_after_2026_07_03.png`
  - `output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1001_ready_window_click_timely_2026_07_03.png`

角色结论：

- Product：`pass for P1-001 gameplay semantics`，玩家可区分“收 READY 争及时奖励”和“救红耐心避免流失”。
- Development/testing：`pass for P1-001`，状态机、自动低奖励、及时点击和 QA preset 已验证。
- Art/UI：`conditional pass for low-fi`，倒计时下划线不遮 baked READY / 商品 icon；READY final badge、slot、check、glow 仍属于后续 final art pass。

## 2026-07-03 Fix Result: P1-002 Order Item State Clarity

Owner / Brief / Review / Record：

- Owner：Development/testing + Art/UI 负责订单 item 局部状态表达；Product 复核它是否服务调度判断。
- Brief：不生成新图、不新增系统、不拆 READY baked 资源；只用 runtime 小 cue 区分未开始、已拿取部分、加热中、微波炉完成可交付、READY。
- Review：Product 复核玩家能看懂“还缺什么 / 什么在加工 / 什么可取”；Art/UI 复核 cue 附着订单槽且不遮商品 icon；Development/testing 复核类型检查、构建和 390x844 截图。
- Record：本节、`docs/LOCAL_TASK_BOARD.md`、`assets/scripts/presentation/MonsterStorePrototype.ts`、`output/runtime-qa-2026-07-03/gameplay-flow-p1/`。

本轮结果：

- partial：已拿取的订单 item 增加绿色 tint、顶部短条和角点，和未开始 item 区分。
- heating：正在微波炉加工的热食 item 增加热色 tint 和顶部进度条。
- microwave-ready：微波炉完成可取的 item 增加金色 tint、rim 和角点。
- 保持 READY baked 资源冻结；不覆盖 `ready_badge_compact.png`，不新增动态 READY 字。

验证结果：

- TypeScript check：`tsc --noEmit` 通过。
- Cocos build：`temp/builder/log/web-mobile7-3-2026 17-03.log` 末尾显示成功；CLI 仍返回历史噪音码 `36`。
- Browser console error check：当前 QA tab 无 error log。
- 390x844 截图证据：
  - `output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1002_order_item_partial_2026_07_03.png`
  - `output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1002_order_item_heating_2026_07_03.png`
  - `output/runtime-qa-2026-07-03/gameplay-flow-p1/runtime_390x844_p1002_order_item_microwave_ready_2026_07_03.png`

角色结论：

- Product：`pass for P1-002 gameplay readability`，玩家能区分“已拿到 / 正在加工 / 可以去微波炉取”。
- Development/testing：`pass for P1-002`，实现只触碰订单槽视觉 cue，未改收入、READY、微波炉状态机。
- Art/UI：`conditional pass for low-fi`，当前 cue 可用于继续推进玩法；商业最终仍需正式状态资源、动效节奏和与 final slot/check/glow 的整套替换。
