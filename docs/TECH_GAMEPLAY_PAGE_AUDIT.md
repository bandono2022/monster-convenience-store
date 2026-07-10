# 经营页代码与改造路径审计

更新时间：2026-06-25

角色：开发 / 测试

状态：review

任务：D-001A

## 当前结论

本审计已经按 `docs/GAMEPLAY_PAGE_SPEC_V1.md` 的最新方向修订：经营页后续采用“订单气泡 READY 交付”，不再把独立交付托盘作为目标入口。

目标流程：

```text
点击商品
-> 普通商品进入当前顾客订单气泡
-> 热食进入微波炉
-> 微波炉完成后回到所属顾客订单气泡
-> 订单气泡 READY
-> 点击 READY 订单气泡或当前顾客完成交付
-> 顾客反馈
-> 收银台和 HUD 入账反馈
```

技术结论：

- P0 不建议立刻删除现有 `TrayState`。
- 现有 `TrayState` 当前同时承担“准备中商品缓存”和“服务锁”，可以先作为内部实现保留。
- 玩家可见的交付入口、READY 状态、商品飞行动效落点，需要从独立托盘迁移到当前顾客订单气泡。
- 下一步 D-004 应做小步改造：先加 helper，再改视觉和点击入口，最后再考虑重命名或拆文件。

## 输入依据

- `docs/GAMEPLAY_PAGE_SPEC_V1.md`
- `docs/ART_P0_ASSET_BACKLOG.md`
- `docs/ART_UI_TARGET_BOARD.md`
- `docs/LOCAL_TASK_BOARD.md`
- `assets/scripts/presentation/MonsterStorePrototype.ts`

## 当前代码事实

经营页主代码仍集中在：

`assets/scripts/presentation/MonsterStorePrototype.ts`

本次正常版审计核对了核心函数，结论如下：

| 代码位置 | 当前事实 | D-001A 判断 |
| --- | --- | --- |
| `CustomerState` | 顾客有 `order`、`served`、`mood`、`pendingOutcome` | 可继续复用 |
| `OrderItem` | 只有 `productId` 和 `heated` | P0 够用，P1 再扩展准备状态 |
| `MicrowaveState` | 已记录 `customerId`、`productId`、`mode` | 很适合订单归属规则 |
| `TrayState` | 记录 `customerId` 和 `items` | 先作为内部 `PreparedOrder` 使用，不急删 |
| `renderOrderIcons()` | 已渲染订单气泡、商品槽、加热状态、完成勾、耐心条 | 是订单气泡 READY 改造的主落点 |
| `renderWorkstation()` | 仍创建 `DeliveryTray` 并绑定 `handleTrayTap()` | 需要迁移视觉入口 |
| `renderTrayContents()` | 托盘里显示 READY、归属顾客和商品 | P0 应停止作为玩家主视觉 |
| `handleProductTap()` | 普通商品 `addTrayItem()`，热食进入微波炉 | 逻辑可保留，反馈和动效落点要改 |
| `handleMicrowaveTap()` | 校验成品所属顾客，再 `addTrayItem()` | 归属规则正确，落点要改为订单气泡 |
| `handleTrayTap()` | 完成 READY 交付、写入 `served`、触发收银 | 可抽成内部交付函数 |
| `getRenderedOrderItemNode()` | 能拿到订单气泡里的具体商品节点 | 商品飞入订单气泡已有基础 |
| `playOrderItemCompleteFx()` | 现在同时 pulse 订单项和托盘，飞行动效落到托盘 | 改成飞到订单项或订单气泡 |
| `playMicrowaveToTrayFx()` | 微波炉成品飞向托盘 | 改成 `playMicrowaveToOrderFx()` |
| `playPaymentFx()` | 收银台闪光，金币飞向 HUD | 可继续复用 |

## 现有可复用能力

| 能力 | 当前状态 | 处理建议 |
| --- | --- | --- |
| 双顾客等待 | 已有 | 保留 |
| 顾客切换 | 已有 | 保留，补当前顾客高亮 |
| 订单气泡 | 已有 | 强化为主操作反馈区 |
| 订单 item 槽 | 已有 | 增加状态 helper 和 READY 表达 |
| 微波炉归属 | 已有 | 保留并强化提示 |
| 服务锁 | 已有，挂在 `TrayState.customerId` 上 | P0 内部复用 |
| 商品卡 | 已有 | 后续加状态 helper |
| 收银反馈 | 已有 | 保留，和订单交付联动 |
| 错误反馈 | 已有 | 从 `tray` 目标迁移到 `order` 或 `both` |

## 主要技术风险

| 风险 | 影响 | 处理建议 |
| --- | --- | --- |
| `TrayState` 名称和新玩法冲突 | 开发容易继续按托盘视觉实现 | P0 先在文档和 helper 中称为 `PreparedOrder`，代码可暂不大改名 |
| 独立托盘仍是点击入口 | 玩家会继续认为托盘是交付按钮 | D-004 必须把点击入口迁移到订单气泡或当前顾客 |
| 商品飞行动效仍落到托盘 | 画面会违背 V2 目标图 | 改 `playOrderItemCompleteFx()` 和 `playMicrowaveToTrayFx()` |
| `render()` 会整屏重建 | 长循环动效容易被打断 | P0 使用短促 Tween，长期状态靠数据重绘 |
| 直接大重构 | 容易破坏已有闭环 | 先保留行为主干，只迁移表现和入口 |
| 旧反馈文案 | 玩家和开发都会继续看到“托盘” | D-004 必须同时改提示文字 |

## D-004 推荐改造路线

### Step 1：增加只读 helper，不改行为

先加 helper，把旧内部状态映射成新玩法状态。

建议新增：

```ts
type OrderBubbleVisualState = 'empty' | 'partial' | 'ready' | 'blocked' | 'done';
type OrderItemVisualState = 'missing' | 'filled' | 'processing' | 'ready_from_device' | 'delivered' | 'error';
type ServiceLockVisualState = 'none' | 'customer_locked' | 'microwave_locked';
```

建议 helper：

```ts
getOrderBubbleVisualState(customer: CustomerState): OrderBubbleVisualState
getOrderItemVisualState(customer: CustomerState, item: OrderItem): OrderItemVisualState
isOrderBubbleReadyFor(customer: CustomerState): boolean
getRenderedOrderBubbleNode(customerId: number | undefined): Node | undefined
```

实现原则：

- `isOrderBubbleReadyFor()` P0 可以先包一层 `isTrayReadyFor()`。
- `getOrderItemVisualState()` 可以复用 `isItemPrepared()`、`microwave.customerId`、`microwave.mode`。
- 先不改订单完成、收入、库存等玩法逻辑。

验收：

- helper 接入后，普通商品、热食、错误、READY 的判断不变。
- 代码中 UI 渲染开始读 helper，而不是到处手写判断。

### Step 2：订单气泡显示 READY 和 partial

改造 `renderOrderIcons()`。

需要做到：

- 当前顾客订单气泡根据 `OrderBubbleVisualState` 显示 `empty / partial / ready / done`。
- READY 时订单气泡发光、出现 READY 标识或点击提示。
- partial 时已填商品亮起，缺失商品保持未完成状态。
- blocked/error 时只在对应顾客订单气泡上红闪。

验收：

- 多商品订单可以只看订单气泡判断还缺什么。
- READY 订单气泡明显比普通订单气泡更像可点击目标。
- 不需要看独立托盘也能理解备餐进度。

### Step 3：迁移交付点击入口

新增或改造点击入口：

```ts
handleOrderBubbleTap(customerId: number)
attemptDeliverPreparedOrder(customerId: number)
```

推荐做法：

- 从 `handleTrayTap()` 抽出交付核心逻辑到 `attemptDeliverPreparedOrder(customerId)`。
- `handleOrderBubbleTap()` 调用这个交付函数。
- 当前顾客区域也可以在 READY 时调用同一个交付函数。
- `handleTrayTap()` 可以暂时保留为内部兼容，但不再作为主要玩家入口。

验收：

- 点击 READY 订单气泡能交付并收钱。
- 点击未 READY 订单气泡只提示缺失商品。
- 点击非当前但 READY 的顾客订单，行为需要明确：建议自动切到该顾客并交付，或只允许当前顾客交付。P0 推荐只允许当前顾客交付，降低混乱。

### Step 4：商品和微波炉动效落点迁移

当前函数：

- `playOrderItemCompleteFx()` 会把商品飞向托盘。
- `playMicrowaveToTrayFx()` 会把热食飞向托盘。

建议改为：

```ts
playProductToOrderFx(productId, customerId)
playMicrowaveToOrderFx(productId, customerId)
```

落点优先级：

1. 对应订单 item 节点。
2. 当前顾客订单气泡节点。
3. 当前顾客节点。

验收：

- 普通商品从商品卡飞到订单气泡。
- 热食从微波炉飞到所属顾客订单气泡。
- 任何商品都不再飞到独立托盘。

### Step 5：隐藏或降级独立托盘视觉

当前 `renderWorkstation()` 会创建：

- `DeliveryPadGroundShadow`
- `drawDeliveryTray()`
- `renderTrayContents()`
- `tray.on(...handleTrayTap)`

P0 推荐：

- 删除独立托盘点击绑定。
- 不再渲染 `renderTrayContents()`。
- 工作台视觉可以先保留一个不承担交付功能的柜台/操作台占位，但不要显示 READY、商品堆放或交付按钮语义。
- 更理想的小步做法是把 `DeliveryPad` 区域变成“柜台装饰/收银动线”，后续由新美术资源替换。

验收：

- 玩家不会把独立托盘当作唯一交付按钮。
- READY、partial、missing 都在订单气泡中完成表达。

### Step 6：替换反馈文案

必须替换当前代码里的旧文案：

| 旧文案方向 | 新文案方向 |
| --- | --- |
| 托盘正在准备某顾客订单 | 正在准备某顾客订单，请先完成这份订单 |
| 已放入托盘 | 已加入订单 |
| 托盘已备齐，点击 READY 托盘交付 | 订单已备齐，点击 READY 订单交付 |
| 托盘还是空的 | 订单还没有准备商品 |
| 托盘还缺 | 订单还缺 |
| 托盘交付成功 | 订单交付成功 |

验收：

- 营业页正常流程中不再出现“托盘”作为操作指引。

### Step 7：测试路径更新

手动必测：

1. 第一单普通商品：点击商品后飞向订单气泡，不直接收钱。
2. 多商品订单：第一件后订单气泡 partial，第二件后 READY。
3. 未 READY 点击订单气泡：提示缺失商品，不完成订单。
4. READY 点击订单气泡：顾客开心、收银台闪光、HUD 加钱。
5. 热食订单：商品进微波炉，完成后飞回所属订单气泡。
6. 微波炉成品属于 A 顾客时，切到 B 顾客点击微波炉不能混单。
7. 点错商品：商品卡或订单气泡红闪，顾客扣耐心。
8. 顾客超时：该顾客的内部准备状态和微波炉归属被清理。
9. 缺货：已准备商品可进入 partial 结算，缺失商品导致顾客离开。
10. 90 秒营业结束：结算正常，收入、完成数、流失数合理。

截图验收：

- `390 x 844`：订单气泡 READY、商品区、微波炉、收银台不遮挡。
- `750 x 1334`：接近 V2 目标图的信息结构。
- 至少保留三张对照图：开始营业、订单 partial/READY、交付成功后。

## D-004 建议实施顺序

| 顺序 | 任务 | 主要代码位置 | 风险 |
| --- | --- | --- | --- |
| 1 | 增加订单气泡和订单 item helper | `MonsterStorePrototype.ts` | 低 |
| 2 | `renderOrderIcons()` 接入 READY/partial/done 状态 | `renderOrderIcons()` | 中 |
| 3 | 抽出 `attemptDeliverPreparedOrder(customerId)` | `handleTrayTap()` 周边 | 中 |
| 4 | 给订单气泡或当前顾客绑定 READY 交付入口 | `renderOrderIcons()`、`renderCustomers()` | 中 |
| 5 | 商品和微波炉飞行动效改落到订单气泡 | `playOrderItemCompleteFx()`、`playMicrowaveToTrayFx()` | 低 |
| 6 | 独立托盘视觉降级为非交互装饰或移除 | `renderWorkstation()` | 中 |
| 7 | 替换旧托盘文案 | `handleProductTap()`、`handleMicrowaveTap()`、交付函数 | 低 |
| 8 | 手机尺寸截图验收 | Cocos Preview | 中 |

不要反过来先拆大文件。现在更重要的是让玩家看到正确经营流程。

## 暂不做

- 不新增三名顾客。
- 不新增多备餐位。
- 不加入拖拽摆放。
- 不重写订单生成系统。
- 不重写经济系统。
- 不拆 Cocos 场景 prefab。
- 不接后端、排行、广告或 IAP。
- 不在 D-004 阶段引入 Spine/DragonBones。
- 不一次性替换全部美术资源。

## 给后续重构的备注

P0 以后可以把内部命名逐步从 `TrayState` 改为更贴近玩法的名字：

```text
TrayState
-> PreparedOrderState
-> CustomerOrderPrepState
```

但这不是 D-004 的首要目标。D-004 的首要目标是：

```text
不破坏现有玩法闭环
把 READY 表达迁移到订单气泡
把交付点击入口迁移到订单气泡或当前顾客
把商品飞行动效落点迁移到订单气泡
完成手机截图验收
```

## D-001A 结论

经营页下一步最稳的技术路线是：

```text
保留现有内部准备状态
新增订单气泡视觉 helper
订单气泡显示 missing / partial / ready / done / error
READY 点击入口迁移到订单气泡或当前顾客
商品和热食动效飞向订单气泡
收银台和 HUD 继续承接付款反馈
最后截图验收
```

做完这一步后，可以进入 `D-004：经营页视觉状态小步改造`。
