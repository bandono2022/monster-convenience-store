# Patience Bar Minimum Code Touchpoints

日期：2026-07-03

## Owner / Brief / Review / Record

- Owner：Development/testing 负责最小代码触点、实现风险和 QA 口径。
- Brief：基于 `docs/PATIENCE_BAR_LOW_FI_SPEC_2026_07_03.md`，确认 runtime 低保真耐心条接入应改哪些函数，不改玩法规则、不生成图片、不引入 PNG。
- Review：Product 已确认耐心条表达顾客流失风险，READY countdown 表达低奖励 / 断连击风险；Art/UI 已确认竖向条贴顾客外侧、两条都显示、只允许最低红条强 pulse。
- Record：本文件；`docs/LOCAL_TASK_BOARD.md`。

## Verdict

Development/testing 批准下一步进入 runtime 低保真代码实现。

限制：

- 只做 runtime 绘制的两条竖向耐心条。
- 不引入新 PNG。
- 不改顾客 / 订单 / READY / 微波炉规则。
- 不新增动画系统。
- 不覆盖或拆改任何 READY baked 资源。

## Existing Reusable State

`assets/scripts/presentation/MonsterStorePrototype.ts` 已有可复用基础：

- `CustomerState.patience`
- `CustomerState.maxPatience`
- `CustomerState.lowPatienceFxPlayed`
- update loop 中的耐心扣减、顾客流失、低耐心触发
- `patienceFillNodes`
- `updateLiveUi()`
- `playLowPatienceFx()`
- final canvas 的 Figma 坐标 helper：`addFigmaSurface()` / `createFigmaNode()` / `figmaCenterX()` / `figmaCenterY()`

因此不需要新资源系统或新状态机。

## Minimum Code Touchpoints

### 1. Constants

新增少量 final patience 常量：

- 左右耐心条 `FigmaRect`
- track / fill 宽高
- green / yellow / red 阈值
- final 低保真颜色
- red danger pulse 阈值沿用 `< 0.3`

建议不要先做可配置表。P0 首测只需要一组清楚可读的低保真参数。

### 2. `renderFinalGameplayCanvas()`

在 `renderFinalCustomers()` 之后、`renderFinalOrders()` 之前调用：

```text
renderFinalCustomers()
renderFinalPatienceBars()
renderFinalHud()
renderFinalOrders()
```

原因：

- 耐心条视觉上属于顾客。
- 订单 bubble、READY badge 和订单触控仍在耐心条上方。
- 不影响柜台、设备、商品、底部 nav 的触控路径。

### 3. `renderFinalPatienceBars()`

新增函数，只负责 final gameplay canvas：

- 每位顾客画一个 track。
- 每位顾客画一个 fill。
- fill 注册进 `patienceFillNodes`。
- 节点不绑定任何 `TOUCH_*`。
- 节点命名使用 `FinalPatienceTrack-*` / `FinalPatienceFill-*`，让 `updateLiveUi()` 能区分 final 竖向条和旧 horizontal 条。

推荐位置原则：

- 左条贴左顾客外侧。
- 右条贴右顾客外侧。
- 不遮脸、订单、READY、手、柜台设备、商品 grid、底部 nav。

### 4. `updateLiveUi()`

小改现有 `patienceFillNodes` 更新逻辑：

- 如果 fill 是 `FinalPatienceFill-*`，走竖向更新。
- 其他旧 fill 继续走现有横向 X 缩放。

final 竖向更新负责：

- 根据 `customer.patience / customer.maxPatience` 调整 fill 高度或 Y 缩放。
- 根据阈值换色：green / yellow / red。
- 保持底部锚定感，表现“剩余耐心”。

不要做：

- 每帧 pulse。
- 秒数文本。
- 复杂耐心恢复 / 急客模型。
- READY 后继续混合扣普通耐心的规则变化。

### 5. `playLowPatienceFx()`

小改查找路径：

- 优先查找 `FinalPatienceFill-*` 或其父级 final patience 节点。
- 找不到再回退旧路径 `Customer -> Order -> Patience`。

保持现有触发点：只在首次进入 `< 0.3` 且 `lowPatienceFxPlayed` 为 false 时触发。

## Layer And Touch Safety

耐心条不应成为触控目标。

必须保持可点：

- 两个订单 bubble。
- 商品卡。
- 微波炉。
- 收银机相关路径。
- 底部五入口。

如果视觉上和订单 bubble / hand / valid drop rim 发生重叠，应优先移动耐心条，不应通过扩大层级或盖住其他节点解决。

## QA Minimum

实现后最少验收：

1. 390x844 截图：两条耐心条都显示，且不遮脸、订单、READY、手、设备、商品、nav。
2. 未完成订单耐心归零：green -> yellow -> red -> empty -> 顾客离开 / 连击中断。
3. READY 超时低奖励：订单 READY 后超时，表现为自动成交 / 低奖励或断连击，不表现为顾客流失。
4. 混合压力：一位 READY countdown，另一位红耐心，玩家应能区分“收 READY”和“救快流失顾客”。
5. 触控冒烟：订单 bubble、商品卡、微波炉、底部 nav 不被耐心条影响。

## Next Step

下一轮可进入 runtime 低保真实现。实现完成后必须截图自检，并把 QA 截图路径和触控检查结果记录回 `docs/LOCAL_TASK_BOARD.md`。
