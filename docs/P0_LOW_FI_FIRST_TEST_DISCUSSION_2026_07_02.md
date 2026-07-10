# P0 Low-Fi First Test Discussion

日期：2026-07-02

## Owner / Brief / Review / Record

- Owner：Coordination 负责把 Round 12 三方脑暴收成首测讨论稿；Product 负责商业参考取舍和玩法观察问题；Art/UI 负责 390x844 cue / layout 可读性；Development/testing 负责首测可信度、输入命中区和 QA preset。
- Brief：继续三方持续脑暴，目标是判断《怪兽便利店》怎样做成好玩的商业游戏。本轮不改代码、不生成图、不进入垂直切片，只定义 P0 低保真首测如何避免误测。
- Review：Product、Art/UI、Development/testing 已完成 Round 12 初步判断；本文件供下一轮交叉复核。
- Record：本文件；`docs/LOCAL_TASK_BOARD.md`。

## Commercial Reference Takeaways

P0 首测可以学习：

1. Overcooked：简单动作叠压力。只保留拿、放、加工、交付；复杂来自两顾客、微波炉占机、READY 窗口。
2. Cooking Fever：设备节奏。微波炉必须制造等待、占机、ready 提醒，而不是普通按钮。
3. Diner Dash 类服务顺序压力：玩家要判断先救谁、先收谁、先腾哪个设备。
4. Good Pizza, Great Pizza：顾客需求必须一眼懂，不能让玩家猜订单。
5. PlateUp：观察玩家是否自然说出“我想让炉子更快 / 想多一个备餐位”，但不在首测做升级树。

P0 首测不要做：

1. 大量商品和菜谱。
2. 自由装修 / 自由布局。
3. 多设备链。
4. 长文本订单 / 顾客谜题。
5. 广告、IAP、任务运营壳。

## First-Test Core Questions

首测不以完成率作为主指标。完成率可以靠数值调，调度理解调不出来。

核心观察问题：

1. 玩家是否在微波炉 READY 后主动腾炉。
2. 玩家是否为了下一步主动使用备餐位，而不是只把它当误放区。
3. 玩家第二局是否产生明确服务顺序计划，例如“先把饭团热上”“右边快急了先救右边”“READY 先收再拿热食”。

区分“手熟了”和“理解调度”：

- 手熟了：拖得更准、更快、误放少，但仍按眼前订单反应，不提前做决策，不主动使用备餐位，说不出下局策略。
- 理解调度：提前把热食放进微波炉，微波炉 ready 后主动取出腾炉，用备餐位为下一步留空间，在两顾客之间说明优先级。

判定口径：第二局更快不够；第二局更有计划才算调度成立。

## Test Flow

Development/testing 建议采用“两局同配置重复观察”，不上遥测平台：

1. 30 秒自由练习：拖普通商品到订单、拖生热食到微波炉、拿熟热食；练习不计成绩。
2. 正式跑第 1 局同一 preset：主要看学习成本、输入问题、视觉误读。
3. 正式跑第 2 局同一 preset：主要看是否出现主动腾炉、主动用备餐位、服务顺序语言。

如果第二局仍卡在拿起 / 放下 / 看不懂，先返工输入或 cue；不要加功能。

## QA Preset Order

首测情境必须由浅入深，先排除输入和状态污染，再测压力：

1. 基础拖拽：单普通商品到订单，排除手感问题。
2. 非法热食：生热食拖订单红闪 / 弹回，排除规则反馈问题。
3. 微波炉链路：生热食进炉、ready、取出、交付，排除状态链问题。
4. 微波炉占机：ready 未取时放新热食，排除占机可读性问题。
5. 备餐位腾炉：熟热食放备餐位后继续用炉，观察是否产生收益。
6. 双顾客压力、READY 超时、耐心流失最后测。

## 390x844 Layout Guardrails

- 耐心条：贴每位顾客外侧，竖向，不遮脸、订单气泡、READY badge 或手。
- 订单气泡：保持在顾客上方；当前顾客气泡更强；READY countdown 不覆盖商品 icon。
- 备餐位：在玩家工作台带，位于微波炉和收银之间且更靠近微波炉；读作小托盘 / 暂存点，不进入商品 grid、订单气泡、顾客身体、底部 nav 或收银屏幕区域。
- 微波炉 progress：只在设备内部，使用 amber door / panel / device-local bar，不画外部大面板。
- READY countdown：附着 ready 订单 / READY badge，用 ring 或 underline；前段绿色，临近超时变暖 / 加快。
- Drag ghost：始终在手指上方并略向屏幕中心偏移，层级最高但不盖 pause/menu；来源商品卡 dim；不被商品栏或柜台边缘裁切。

## Cue Budget

首测每个状态只给 1 个主 cue：

- `patience danger`：红色竖向耐心条 pulse。
- `order READY`：绿色 READY countdown ring / underline，附着订单。
- `microwave ready-blocking`：设备内部 amber glow / progress-complete。
- `valid drop`：拖拽时目标上的单一 green / yellow rim。
- `invalid drop`：红闪 + 弹回。
- `prep occupied`：item icon 静置在安静托盘上。
- `stock disabled`：商品卡灰 / dim + disabled overlay。

中段柜台最多 2 个强高亮；如果一个 cue 不够清楚，先改这个 cue，不叠第二个 cue。

## Input Trust Minimum

- 可拖源命中区不能小于商品卡可视面积，建议最低约 `56x56`。
- 订单、微波炉、备餐位 drop 区应大于视觉图形，hover 时只显示一个主目标。
- Drag ghost 必须偏离手指向上 / 向中心，不能遮住目标 slot，且 item identity 可辨。
- 释放点在目标附近时应吸附，不要求像素级精准。
- 非法 drop 必须在约 `0.2s` 内红闪 / 弹回。

## Next Cross-Review Questions

Product 需要回答：

1. 首测第二局的“好转”主指标选哪个：误放减少、主动腾微波炉、服务顺序语言？
2. READY 自动成交低奖励在低保真中必须同时表现为少小费和断连击，还是先选一个？

Art/UI 需要回答：

1. 当前顾客是由游戏固定高亮，还是允许玩家通过服务任一订单自然选择？
2. Drag ghost 偏移方向和距离是否能固定一版，保证左右两侧拖拽都不遮挡目标？

Development/testing 需要回答：

1. 首测是否能强制一状态一主 cue、同屏最多两个强高亮，避免效果叠加。
2. 第二局表现更好时，手记如何区分输入熟练提升和策略改变。

## Current Coordination Verdict

P0 首测应该验证“调度理解”而不是“拖拽熟练”。下一轮继续脑暴应收成一张首测验收卡：固定 preset、两局观察流程、三项核心信号、布局 / cue / 命中区硬门槛。仍不进入 runtime 实现。
