# Patience Bar Low-Fi Spec

日期：2026-07-03

## Owner / Brief / Review / Record

- Owner：Art/UI 负责低保真耐心条位置、颜色、层级和可读性；Product 负责玩法目标和失败语义；Development/testing 负责最小实现路径与 QA。
- Brief：当前没有生图能力，耐心条先走 runtime 低保真实现，不等待最终美术。目标是让 P0 首测能判断两位顾客谁快等不及，并区分“耐心归零流失”和“READY 超时低奖励”。
- Review：Product、Art/UI、Development/testing 已在耐心条专项 Round 15 给出判断。
- Record：本文件；`docs/LOCAL_TASK_BOARD.md`。

## Product Goal

耐心条在 P0 首测中必须支持 3 个玩家判断：

1. 先救谁：两位顾客同时等待时，玩家能立刻判断哪个更危险。
2. 还能不能先做别的事：玩家能判断是否有时间先取微波炉、先收 READY、先拖另一个商品。
3. 这是流失风险，不是低奖励风险：耐心条表达“订单没完成前顾客会走”；READY 超时表达“已完成但低奖励 / 断连击”。

真正危险：未完成订单 + 红耐心 / 快归零。
READY countdown 很重要，但它不是顾客流失。

## State Language

低保真只做 3 档，不显示秒数：

- Green：安全，可以处理别的事。
- Yellow：注意，开始考虑优先级。
- Red：危险，马上处理，否则流失。

建议初值：

- Green：`> 60%`
- Yellow：`30% - 60%`
- Red：`< 30%`
- Danger pulse：仅红区允许，且只 pulse 耐心条本身。

不要先做：

- 秒数显示。
- 顾客复杂耐心模型。
- 急客特殊耐心规则。
- 耐心恢复 / 道具加耐心。
- READY 后继续扣普通耐心的混合规则。

## 390x844 Placement

推荐：

- 竖向条，贴每位顾客外侧。
- 左顾客条在左顾客外侧；右顾客条在右顾客外侧。
- 视觉上属于顾客，不属于订单 bubble 或 HUD。
- 高度从上身 / 肩部附近延伸到柜台边缘附近，但不穿过订单 bubble 或手。
- 宽度窄而可读，像 status rail，不像大面板。

安全边界：

- 不遮脸、眼睛、订单 bubble tail、READY badge、drag target rim、顾客手、微波炉、备餐位、商品 grid。
- 如果顾客外侧空间不足，可以略微贴近身体内侧，但不能覆盖脸或订单 bubble。

## Color And Priority

颜色区分：

- Patience green：平静、不发光，区别于订单 READY 的 action green。
- Patience yellow：偏 warning，不要太接近微波炉 ready 的 amber。
- Patience red：危险，可 pulse。
- Invalid drop red：短闪；patience red：持续 danger。用持续时间区分。

两顾客同时显示：

1. 两位顾客都始终显示耐心条。
2. 只有最低耐心且红区的那条可以强 pulse。
3. 如果两条都红，剩余更低者 pulse，另一条红但 steady。
4. 若无红区，两条都 steady，不 pulse。

与其他 cue 的优先级：

- 非拖拽：red patience > READY countdown > microwave ready > demand highlight。
- 拖拽：drag ghost > valid target > invalid flash > red patience > READY countdown > microwave ready。
- Red patience 与 READY 同时出现时，两者可作为两个强 cue；其他高亮降级静态。

## Runtime Implementation Direction

Development/testing 建议：优先 runtime 绘制，不用 PNG。

原因：

- 现有脚本已有 `CustomerState.patience` / `maxPatience`。
- 已有耐心递减 / 流失逻辑。
- 已有 `patienceFillNodes` 更新通道。
- 可最小补 track + fill 节点，不引入新资源或新系统。

最小节点：

- 每位顾客一个 `track`。
- 每位顾客一个 `fill`。
- `fill` 根据 `customer.patience / customer.maxPatience` 更新比例和颜色。

实现约束：

- 耐心条不绑定触控事件。
- 不抢订单 bubble、商品、微波炉、备餐位、drag/drop 的触控路径。
- 不引入动画系统；红区 pulse 可复用现有轻量 tween / pulse 机制。
- 不破坏当前 390x844 静态还原布局。

## Parameters

需要：

- `maxPatience`
- green / yellow / red 阈值
- danger pulse 阈值
- 归零后顾客流失时序
- pause / ready-window 下是否继续扣耐心的规则

首测建议：

- 未完成订单才扣普通耐心。
- READY 进入短交付窗口后，用 READY countdown 表示低奖励风险，不再用耐心条表达同一件事。

## QA Presets

必须分开验证：

1. 未完成订单耐心归零：
   - 让订单未完成，耐心从 green -> yellow -> red -> empty。
   - 观察顾客离开 / 订单清理 / 流失归因。
   - 玩家应能说出“我没来得及完成订单”。

2. READY 超时：
   - 订单已 READY，等待 short-window 超时。
   - 观察自动成交 + 低奖励 / 断连击。
   - 顾客不应表现为流失。
   - 玩家应能区分这是“慢收，少奖励”，不是“没做完，顾客走”。

3. 混合压力：
   - 一位顾客 READY countdown。
   - 另一位顾客红耐心。
   - 观察玩家是否能区分“收 READY”与“救快流失顾客”。

## Pass / Rework

可进入首测：

- 玩家能识别哪位顾客耐心更低。
- 玩家能在红区前后改变服务顺序。
- 玩家能区分红耐心流失风险和 READY 低奖励风险。
- 耐心条不遮挡顾客、订单、READY、手、drag/drop。
- 两条耐心条不会同时强 pulse 造成噪音。

必须返工：

- 玩家不把耐心条归属到正确顾客。
- 玩家把耐心条误解成健康、得分、设备进度或订单完成度。
- 玩家混淆 patience green/yellow 与 READY / microwave ready。
- 玩家错过红区，顾客离开后觉得系统突然惩罚。
- 耐心条抢触控、挡订单 bubble、挡拖拽目标。

## Next Step

由 Development/testing 基于本 spec 复核最小代码触点。只有触点确认后，才进入 runtime 低保真接入；不需要 imagegen，也不需要新 PNG。
