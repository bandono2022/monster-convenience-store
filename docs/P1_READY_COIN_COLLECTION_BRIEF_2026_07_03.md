# P1-006C READY Coin Collection Brief

日期：2026-07-03

## Owner / Brief / Review / Record

- Owner：Product/planning 负责 READY 后收款动词与奖励节奏；Art/UI 负责金币堆可读性、层级和最终资产需求；Development/testing 负责最小 runtime 实现路径、触控安全和 QA。
- Brief：用户提出 READY 后不做拖拽到收银台。顾客把金币放在柜台上，金币堆按订单费用分档显示，玩家点击金币完成收款。
- Review：Product 通过为下一轮低保真方向；Art/UI 通过为 low-fi 状态语法，不生成新图；Development/testing 通过为最小实现候选，可复用现有收入、READY window 和点击路径。
- Record：本文件、`docs/LOCAL_TASK_BOARD.md`、`docs/GAMEPLAY_PAGE_BUG_AND_POLISH_BACKLOG_2026_07_03.md`。

## Product Decision

采用“READY 后点击柜台金币收款”作为下一轮低保真验证方向。

- 商品 / 热食服务继续使用拖拽。
- READY 后不追加拖拽到收银台。
- 订单 READY 后，顾客在自己一侧的柜台位置放下金币堆。
- 玩家点击金币堆完成及时收款；READY reward window 仍保留。
- 超过 READY window 未点击时，沿用 P1-001：自动低奖励成交、无小费、combo reset、不算顾客流失。

理由：

- 交互更短：准备商品已经需要拖拽，收款再拖一次会拖慢节奏。
- 奖励更物理：金币出现在柜台，比抽象点击 READY 更接近“顾客付款”。
- 可读性更强：玩家下一步目标从 READY 气泡转移到金币堆，不需要猜是否要拖到收银台。
- 实现更小：复用现有点击、收入、payment burst、READY timeout，不新增复杂系统。

## Coin Stack Rule

金币堆按订单标价 `sale = getOrderSale(customer.order)` 分档，不按最终 `income = sale + tip` 分档。

原因：同一订单的标价稳定；小费/低奖励由点击时机决定，不应该让同一订单金币堆数量在 READY 后突然改变。

低保真分档：

- `sale < 15`：2 枚金币。
- `15 <= sale < 30`：4 枚金币。
- `sale >= 30`：8 枚金币。

点击金币后，最终入账仍走现有规则：

- 及时点击：`sale + tip`。
- 超时自动低奖励：`sale`，无小费，combo reset。

## Low-Fi Visual Grammar

- 金币堆附着在对应顾客一侧的柜台区域，不放到商品卡、微波炉或底部 nav 上。
- 两个顾客都 READY 时，各自有自己的金币堆；点击哪个金币堆就收哪个顾客的钱。
- 金币堆是 READY 后的主要点击目标；订单气泡仍表达“订单已完成 / 倒计时”。
- READY countdown 暂时继续附着订单气泡，避免把倒计时、金币数量、点击目标都挤在同一个小区域。
- 低保真阶段可用现有金币 icon 或 runtime 圆形金币，不生成新图。
- 最终美术后续再拆：金币单体、2/4/8 堆叠组合、柜台投影、点击闪光、飞向 HUD 动效帧或粒子。

## Development / Testing Scope

下一轮如果进入实现，只做最小 P1-006C probe：

- READY 后渲染可点击金币堆。
- 点击金币堆触发现有 `finishCustomerOrder(index, false)` 及时收款。
- READY window 超时仍触发现有低奖励成交。
- 旧的点击订单气泡收款暂时保留为 fallback 或 QA 对照，直到截图和手点确认金币点击足够清楚。
- 不改商品拖拽、不改热食微波炉路径、不改经济公式、不生成新资产。

验收截图：

- `<15` 订单：2 枚金币堆。
- `15-30` 订单：4 枚金币堆。
- `>=30` 订单：8 枚金币堆。
- 点击金币后 HUD 收入增加、顾客 happy / 离开、付款反馈出现。
- READY window 超时后仍自动低奖励成交，且不算顾客流失。

## Art/UI Follow-Up Later

低保真验证通过后，再交给 Art/UI 拆最终资产 brief。最终交付仍需要：

- 单独透明资源。
- 接入当前生成美术资源后的预览图。
- 不用整屏预览图替代单独资产。
- 不使用 Codex/Figma 临时绘制件冒充 final asset。
