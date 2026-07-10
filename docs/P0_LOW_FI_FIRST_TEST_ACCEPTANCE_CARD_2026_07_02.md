# P0 Low-Fi First-Test Acceptance Card

日期：2026-07-02

> 2026-07-03 更新：本卡的“备餐位 / 暂存位”设定已被用户后续决策取代。首测前最新口径见 `docs/P1_FIRST_TEST_OBSERVATION_CARD_2026_07_03.md`：不加备餐位，只靠微波炉 ready 占用作为热食缓冲。

## Owner / Brief / Review / Record

- Owner：Coordination 负责把 Round 12-13 三方脑暴收成验收卡；Product 负责首测玩法指标；Art/UI 负责首测 cue / layout 门槛；Development/testing 负责首测流程、手记和输入可信度。
- Brief：本卡只定义 P0 低保真首测如何判断“调度真的爽”。不改 runtime、不生成图、不做垂直切片。
- Review：Product、Art/UI、Development/testing 已完成交叉复核，同意可收成验收卡。
- Record：本文件；`docs/P0_LOW_FI_FIRST_TEST_DISCUSSION_2026_07_02.md`；`docs/LOCAL_TASK_BOARD.md`。

## Test Purpose

验证玩家是否理解并享受：

`自由服务两位顾客 -> 判断先后顺序 -> 用微波炉和备餐位缓冲 -> 在 READY 窗口前完成节奏决策`

首测不以完成率为主指标。第二局更快不够；第二局更有计划才算调度成立。

## Fixed Scope

固定：

1. 2 位顾客。
2. 3 个商品。
3. 1 个热食。
4. 1 台微波炉。
5. 1 个备餐位。
6. 自由服务任一订单，不固定当前顾客。
7. READY 超时自动成交，但触发低奖励反馈。

不测：

1. 第二备餐位。
2. 微波炉升级。
3. 急客。
4. 库存 / 补货经济。
5. 多设备链、复杂配方、自由布局、长文本订单。

## First-Test Flow

1. 30 秒自由练习：拖普通商品到订单、拖生热食到微波炉、拿熟热食。
2. 正式第 1 局：同一 preset，主要记录学习成本、输入问题、视觉误读。
3. 正式第 2 局：同一 preset，主要记录策略变化。

如果第 2 局仍卡在拿起 / 放下 / 看不懂，先返工输入或 cue，不加功能。

## Primary Signals

第二局“好转”指标：

- 主指标：服务顺序语言。玩家说出或表现出计划，例如“先热饭团”“先收 READY”“先腾炉再做右边”。
- 辅指标 1：主动腾微波炉。微波炉 ready 后主动取出熟热食，释放设备。
- 辅指标 2：主动使用备餐位。把备餐位用于腾炉或下一步计划，而不是误放缓冲。

输入熟练不等于调度成立：

- 误放减少、拖得更快、更准，只能说明手熟。
- 主动腾炉、规划备餐位、说出先后顺序，才说明策略改变。

## Hand Notes

每局手记最少记录：

- `局次`：练习 / 第 1 局 / 第 2 局。
- `误放次数`。
- `卡手原因`：拿不起 / 放不准 / 遮挡 / 看不懂 / 规则不懂 / 数值太紧。
- `主动腾炉`：是 / 否。
- `主动用备餐位`：误放 / 临时乱放 / 为腾炉 / 为下一步计划。
- `服务顺序语言`：原话或无。
- `第二局变化`：更快更准 / 更有计划 / 没变化 / 更困惑。

不需要遥测平台。

## QA Preset Order

按顺序测试，不能先上压力项：

1. 基础拖拽：单普通商品到订单。
2. 非法热食：生热食拖订单红闪 / 弹回。
3. 微波炉链路：生热食进炉、ready、取出、交付。
4. 微波炉占机：ready 未取时放新热食。
5. 备餐位腾炉：熟热食放备餐位后继续用炉。
6. 双顾客压力、READY 超时、耐心流失。

## READY Low-Reward Feedback

首测最小反馈：

- READY 超时后自动成交。
- 连击断开 / 归零作为最小低奖励反馈。
- 可附轻微数字 / 结果提示。

不要先做顾客大情绪动画，避免误读成顾客流失或严重失败。

## Visual Rules

自由服务任一订单：

- 不使用固定当前顾客硬高亮。
- 两个订单都可以是 drop target。
- 拖拽时只高亮 held item 的合法目标。
- 若两个订单都可接同一商品，允许玩家选择 drop 到哪个订单。
- 优先级由耐心 danger、READY countdown、held item valid target 表达。

Drag ghost：

- 从左侧拖拽：上移并向右。
- 从右侧拖拽：上移并向左。
- 从中心拖拽：直线上移。
- 距离约一枚小商品半径，保证目标不被手指遮住，也不让 ghost 脱节。
- 规模约 `1.1x`，有清晰 outline / shadow，保持 item identity。

一状态一主 cue：

- `patience danger`：红色竖向耐心条 pulse。
- `order READY`：绿色 READY countdown ring / underline，附着订单。
- `microwave ready-blocking`：设备内部 amber glow / progress-complete。
- `valid drop`：拖拽时目标上的单一 green / yellow rim。
- `invalid drop`：红闪 + 弹回。
- `prep occupied`：item icon 静置在安静托盘上。
- `stock disabled`：商品卡灰 / dim + disabled overlay。

强高亮定义：

- 动态、高饱和、发光、脉冲、震动、明显放大的提示都算强高亮。
- 同一状态只能有一个强提示；其余只能是静态 dim / rim / progress。

同屏最多两个强高亮：

- 拖拽时优先级：drag ghost -> single strongest valid target -> invalid flash -> red patience danger -> READY countdown -> microwave ready-blocking。
- 非拖拽时优先级：red patience danger -> READY countdown -> microwave ready-blocking -> urgent order emphasis -> demand highlight -> disabled stock。
- READY 与微波炉 ready 同时出现：READY 强，微波炉保持设备内 amber。
- Red patience 与 READY 同时出现：两者可作为两个强 cue，其他需求高亮降级静态。

## 390x844 Layout Minimum

- 耐心条贴顾客外侧竖向，不遮脸、订单气泡、READY badge 或手。
- 订单气泡在顾客上方，READY countdown 不覆盖商品 icon。
- 备餐位在工作台带，位于微波炉和收银之间且更靠近微波炉，不进入商品 grid、订单气泡、顾客身体、底部 nav 或收银屏幕区域。
- 微波炉 progress 只在设备内部，不画外部大面板。
- READY countdown 附着 ready 订单 / READY badge。

## Input Trust Minimum

- 可拖源命中区不小于商品卡可视面积，建议最低约 `56x56`。
- 订单、微波炉、备餐位 drop 区应大于视觉图形。
- Hover 时只显示一个主目标。
- 释放点在目标附近时应吸附，不要求像素级精准。
- 非法 drop 必须在约 `0.2s` 内红闪 / 弹回。

## Pass / Rework

Pass signals：

1. 第 2 局出现服务顺序语言。
2. 玩家主动腾微波炉。
3. 玩家主动用备餐位做下一步计划。
4. 玩家能区分订单 READY 和微波炉 ready。
5. 玩家愿意再来一局，并归因到“我下次能更快 / 更顺”。

Rework signals：

1. 第 2 局仍主要是输入熟练提升，没有策略语言。
2. 玩家把合法 / 非法 drop 误解成 bug。
3. 玩家看不懂微波炉 ready 占机。
4. 玩家不用备餐位，或只当误放区。
5. READY 超时被误读成顾客流失或系统惩罚不明。

## Current Verdict

这张卡可以作为 P0 低保真首测准备的共同验收标准。下一步仍应先由三方讨论“首测之后的分支决策”：通过、返工视觉 / 输入、返工规则 / 数值、或进入最小实现准备。
