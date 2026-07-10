# Runtime 截图返工任务单 2026-06-29

更新时间：2026-06-29

权威目标图：`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

运行时截图：

- `output/runtime-probe-2026-06-29/contact-750x1334-compiled.png`
- `output/runtime-probe-2026-06-29/contact-390x844-compiled.png`

## 用户补充目标

本项目目标不是“做一个大致同风格的可玩页面”，而是把静态目标图一比一还原成可游玩的运行时页面。

执行口径：

- 目标图是最终画面构图、比例、层级、色彩、质感、UI 密度和主次关系的硬标准。
- 当前 runtime 只证明现有资源可以接入代码，不证明美术还原已经通过。
- 任何和目标图不同的地方，都必须归类为：动态状态必要变化、触摸安全必要变化、屏幕适配必要变化、资源缺失、或实现偏差。
- 动态状态可以扩展目标图，但不能改掉目标图的核心布局：顾客、订单气泡、READY、设备、商品卡、HUD 的相对关系必须贴近目标图。
- API 登录阶段不做新图生成；只做接入、截图、对比、文档和最小安全工程验证。
- GPT 登录 / imagegen 团队恢复后，按本文 brief 产出一比一还原所需的 final art 候选。

## 角色门禁

```text
Owner: Coordination
Brief: 将 runtime 截图结论拆成 Product、Art/UI、Development/testing 三线任务，并区分 GPT 登录与 API 登录能力边界。
Review: Product 确认可玩目标；Art/UI 确认目标图还原规格；Development/testing 确认可接入与验证路径。
Record: 本文档、docs/LOCAL_TASK_BOARD.md、docs/API_RESOURCE_INTEGRATION_PROBE_PLAN.md。
```

三线 verdict：

| 角色 | 结论 | 含义 |
| --- | --- | --- |
| Product/planning | `integration-candidate` | 玩家能读懂核心闭环，但 390 宽度第一眼判断成本偏高。 |
| Art/UI | `integration-candidate / revise for final` | 资源能表达语义，但 HUD、订单/READY、商品卡、顾客体积和整体质感未达到目标图。 |
| Development/testing | `pass for probe` | 资源加载、fallback、Cocos meta、截图链路成立；未见硬阻塞。 |

总判定：

```text
现有资源可以继续用于工程接入验证。
现有 runtime 不通过 target-pass。
下一阶段必须按“一比一可游玩化目标图”拆返工与验证。
```

## 截图结论

已证明：

- 商品 icon、订单气泡、READY capsule、微波炉、收银机、商品卡底图能进入 runtime。
- teal regular body + hands v2 能接入 current 顾客；750 waiting-switch 已证明 hands 会跟随当前顾客。
- 750x1334 已覆盖 READY、partial、heating、microwave-ready、payment、waiting-switch。
- 390x844 已覆盖 READY、heating、microwave-ready；waiting-switch 仍需正式补拍或整理现有单张证据。
- `probeState` URL 开关对 QA 截图有价值，默认无参数路径不依赖它。

未通过：

- HUD 与目标图差距明显，不能转 final。
- 商品卡 390 宽下拥挤，商品名、库存、状态层级需要重新规格化。
- 订单气泡 / READY 目前能读懂，但厚度、槽位、check、外圈高光和目标图质感不足。
- 顾客目前主要验证 teal，缺 purple hoodie / blue shopper 同规格 body + hands；teal 的姿态和体积也仍弱于目标图。
- 设备和背景可读，但整体光源、描边、体积统一度还不是 final。

## 一比一还原差距清单

| 画面模块 | 目标图要求 | 当前 runtime 问题 | 下一步归属 |
| --- | --- | --- | --- |
| HUD | 深紫商业顶栏，金币/时间/星级/暂停清晰成组 | 偏工程拼装，目标/星级语义和质感不足 | GPT-login Art/UI 产 HUD v2；API-login 后续接入验证 |
| 当前顾客 | 体积饱满，表情强，手扒柜台，高亮/订单共同指向 current | teal hands 成立但姿态、体积、表情张力弱；顾客差异不足 | GPT-login Art/UI 产 body + hands final |
| 订单气泡 | current 气泡厚描边、高光、槽位实体感、READY 主焦点 | 语义可读但 final 质感不足；waiting bubble 槽位烘焙风险 | GPT-login Art/UI 产订单 final 包；API-login 验证 9-slice / slot 叠层 |
| READY | 像可点击交付入口，并和 current 订单绑定 | 当前 capsule 可用但不是商业 final；glow 需 runtime 程序化 | Art/UI 产空 capsule；Dev/Test 接 runtime 文本与 glow |
| 商品卡 | 商品图最大，库存/角标辅助，当前需要强高亮 | 390 宽下文字和库存拥挤；底板偏工程化 | GPT-login Art/UI 产分层商品卡；API-login 维持动态文字/库存 |
| 微波炉 | heating/ready 一眼可辨，和台面同光源 | 状态可读但体积/描边/光源需统一 | GPT-login Art/UI 后续修色；API-login 验证热食流程 |
| 收银机 | 收款反馈归因明确，不像交付按钮 | 可读，但和整屏质感需统一 | GPT-login Art/UI 后续修色；API-login 验证付款路径 |
| 390 适配 | 保持目标图结构，不等比硬缩导致拥挤 | 商品区、订单和底部导航密度偏高 | Product 锁定可降级文字；Art/UI 给窄屏规格；Dev/Test 小步截图验证 |

## Product 任务

Owner: Product/planning

状态：`todo`

目的：把“一比一目标图可游玩化”转成玩家验收口径，避免只凭工程可运行就误判通过。

任务：

1. 锁定首屏 1 秒判断链路：看顾客 -> 看订单 -> 点商品/微波炉 -> READY -> 收钱。
2. 明确 390 宽度下哪些文字可以降权或隐藏，但商品图、库存、热食角标、READY、当前订单槽不能降权。
3. 明确只允许当前订单需要商品强高亮，避免非当前顾客需求抢焦点。
4. 明确收银台只做结果反馈，不成为独立交付按钮。
5. 明确 P0 只有饭团是热食；其他商品不借火焰/星星制造误读。

验收：

- 不读长文案也能判断下一步操作。
- READY 必须像当前订单的交付入口，不像普通标签。
- 390 宽度下仍能看懂当前服务对象和订单缺口。
- 任何偏离目标图核心布局的产品理由必须写入任务板。

## GPT-login Art/UI 任务

Owner: Art/UI

状态：`todo / blocked-by-login-capability`

目的：生产一比一可游玩化所需 final art 候选。当前 API 登录不执行 imagegen，只写 brief。

优先级 1：HUD v2

- `hud_top_bar_shell_v2.png`：深紫顶栏整壳，透明 PNG，不含数字、金额、时间、星级数量。
- `hud_panel_coin_v2.png`：九宫格面板或固定面板，不烘焙金额。
- `hud_panel_timer_v2.png`：不烘焙倒计时。
- `hud_panel_goal_v2.png`：星级 / 目标面板，不使用红心生命语义。
- `hud_icon_coin_v2.png`、`hud_icon_clock_v2.png`、`hud_icon_star_v2.png`、`hud_pause_button_v2.png`：透明 PNG，和目标图顶栏统一。

优先级 2：订单气泡 + READY final 包

- `order_bubble_current_base_no_slots_v3.png`：无商品、无槽、无 check、无 READY 文本；附 9-slice inset。
- `order_bubble_waiting_base_no_slots_v4.png`：等待态弱于 current；不烘焙槽位。
- `order_slot_empty_v1.png`：独立空槽。
- `order_slot_filled_overlay_v3.png`：只表达订单槽完成，不能像商品卡选中框。
- `order_check_v3.png`：独立勾。
- `order_ready_capsule_empty_v2.png`：空 READY 胶囊，不烘焙 READY 字。
- `order_missing_question_v1.png`：缺失/未知商品提示。

优先级 3：顾客 body + hands final

- teal regular：`neutral / impatient / happy` 的 body + hands v3。
- purple hoodie：`neutral / impatient / happy` 的 body + hands v1。
- blue shopper：可后置，但最终同屏多顾客需要同规格补齐。
- 每张建议 `1024x1024 RGBA`，同画布、同 anchor、同底线。
- body 不含压台手掌；hands 不含柜台边缘；不能烘焙 current/waiting 身份。

优先级 4：商品卡 final 分层

- `product_card_base_v2.png`：不含商品图、商品名、库存数字。
- `product_card_badge_heat_overlay_v2.png`：饭团热食角标。
- `product_card_badge_star_overlay_v2.png`：若保留，不能和 HUD 星目标混淆。
- `product_card_selected_glow_v2.png`：只用于商品卡关注态，不用于 READY/订单完成。
- `product_card_disabled_overlay_v1.png`：售罄/锁定遮罩，不烘焙具体文字。

优先级 5：柜台 / 设备统一修色

- `counter_worktop_midground_with_props_v1.png`：可烘静态杯子、菜单牌、小植物；不能含设备、手、订单、反馈。
- `counter_foreground_v2.png`：只负责遮挡手部/设备下缘，不挡脸、READY、商品卡。
- `microwave_idle_v2.png` / `microwave_heating_v2.png` / `microwave_ready_v2.png`：三态同尺寸同 pivot。
- `cashier_idle_v2.png` / `cashier_pay_v2.png`：不烘焙金额数字。

美术交付硬规则：

- 所有动态数字、商品名、库存、倒计时、READY 文本、金额都由 runtime 绘制。
- 柔光类 READY glow / sparkle 继续走 runtime 程序动效，不产柔光 bitmap 作为 final。
- 候选先进入 `assets/ui/final-candidates/**`，不直接覆盖 `assets/resources/**`。
- 每批必须带 QA contact sheet 和目标图同屏对照。

## API-login Dev/Test 任务

Owner: Development/testing

状态：`todo`

目的：继续验证“目标图可游玩化”是否能安全落到 Cocos runtime，而不是扩大玩法或用代码遮盖美术缺口。

下一轮最小任务：

1. 补拍或整理 `390x844 waiting-switch` 证据，证明移动端 hands 跟随 current。
2. 手点 QA：商品点击、READY 点击、微波炉 ready 回填、错误商品、未 READY 点击不误收钱。
3. 复查 390 宽度商品卡、底部导航、订单气泡、顾客 hands 是否触摸遮挡。
4. 保持 `assets/resources/ui_probe_gameplay_v1/` probe 路径和旧资源 fallback，不把 probe 改名为 final。
5. 暂不做大布局重构；若调 390 拥挤，只允许小范围常量调整，并先截图对比。
6. `probeState` 继续标记 QA-only；发布前必须加显式 QA gate 或移除。

验收：

- 默认无 URL 参数路径不依赖 `probeState`。
- 热食流程完整：商品卡 -> 微波炉 heating -> microwave-ready -> 回填订单槽 -> READY。
- 错误点击、未 READY 点击、微波炉未完成点击不会触发收钱。
- 付款反馈只在成功交付后出现，HUD 金币变化与收银反馈一致。
- 390 宽度下商品图、库存、热食角标、当前需要高亮不被遮挡。

## 偏离目标图记录规则

任何 runtime 与目标图不同，必须在后续 QA 表里标注一类：

- `dynamic-state`：目标图是静态 READY，runtime 需要 partial/heating/payment 等状态。
- `touch-safety`：为确保可点击区域和手指尺寸做的最小偏移。
- `responsive`：390 宽度为保持可读做的压缩或重排。
- `asset-missing`：缺少 final art，只能用候选或 fallback。
- `implementation-gap`：代码布局/层级尚未贴合目标图，需修。
- `product-change`：产品已批准的目标调整，必须有文档依据。

未分类偏离默认视为 `implementation-gap` 或 `asset-missing`，不能默认为通过。

## 本轮下一步

2026-06-29 用户与三线门禁已纠偏：当前最大问题不是工程 QA，而是 runtime 一眼看上去不还原目标图。

新的下一步：

1. GPT-login Art/UI：在具备 imagegen 能力后，先做 HUD v2 整壳包与订单 / READY final 包。
2. GPT-login Art/UI：随后做 teal current + purple hoodie waiting 的 body / hands final 首批。
3. GPT-login Art/UI：再做商品卡 final 分层包。
4. API-login Dev/Test：暂停新增热食自然流 / 390 误触 QA；等新 final art 候选回来后做最小接入与截图对照。
5. Coordination：以 `docs/VISUAL_TARGET_MATCH_FAILURE_REVIEW_2026_06_29.md` 作为后续 P0 美术返工依据。
