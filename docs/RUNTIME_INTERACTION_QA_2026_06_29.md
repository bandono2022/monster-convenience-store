# Runtime 交互 QA 记录 2026-06-29

更新时间：2026-06-29

目标：验证现有 probe 接入资源在 Cocos Web Preview 中是否能支持“目标图一比一可游玩化”的基本触摸安全。

## 角色门禁

```text
Owner: Development/testing
Brief: 验证运行时点击、状态流转、触摸遮挡和 QA 工具边界。
Review: Product 复核玩家是否能理解；Art/UI 复核视觉层级是否仍贴近目标图。
Record: 本文档、docs/LOCAL_TASK_BOARD.md、docs/API_RESOURCE_INTEGRATION_PROBE_PLAN.md。
```

## 测试环境

- Cocos Creator Web Preview: `http://127.0.0.1:7456/`
- 测试日期：2026-06-29
- 视口：`390x844`
- 目标图：`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`
- 关键截图输出：`output/runtime-qa-2026-06-29/`

## 已完成截图证据

| 证据 | 路径 | 结论 |
| --- | --- | --- |
| 默认 READY 前置截图 | `output/runtime-qa-2026-06-29/default-390-before-ready-click.png` | 目标图式 READY 快照可显示。 |
| READY 点击后截图尝试 1 | `output/runtime-qa-2026-06-29/default-390-after-ready-click.png` | 未观察到付款变化，不能判 pass。 |
| READY 点击后截图尝试 2 | `output/runtime-qa-2026-06-29/default-390-after-ready-click-corrected.png` | 未观察到付款变化，不能判 pass。 |
| READY 点击后截图尝试 3 | `output/runtime-qa-2026-06-29/default-390-after-ready-click-canvas-mapped.png` | 未观察到付款变化，不能判 pass。 |
| 390 状态 contact sheet | `output/runtime-probe-2026-06-29/contact-390x844-compiled-with-waiting-switch.png` | READY、heating、microwave-ready、waiting-switch 截图证据已齐。 |

## 自动化点击发现

Playwright CLI 可以打开页面、调整视口、截图；页面中 Cocos canvas 边界为：

```text
{x: 0, y: 48, w: 390, h: 796}
```

尝试点击 READY 区域后，截图未出现交付成功、收入变化或付款反馈。

当前不将此判定为交互失败，原因：

- Playwright 鼠标事件可能没有可靠触发 Cocos touch 路径。
- 坐标受 Cocos 预览工具栏、canvas 缩放、设备模拟栏影响，手点坐标可能仍有偏差。
- 默认无参数入口存在 `START_DIRECTLY_IN_GAMEPLAY && !paymentBurst` 时持续 `maintainDirectGameplaySnapshotState()` 的展示快照逻辑，可能不适合完整交互流 QA。
- `probeState` URL 状态会在 update 中持续重置，更不适合验证点击后的自然状态变化。

当前结论：

```text
自动化点击 QA = inconclusive。
截图层级证据 = usable。
运行时交互 pass/fail 仍需真实 Cocos 手点或专门 QA gate。
```

## 代码级触点观察

代码阅读显示：

- READY 订单气泡和 READY tap surface 都绑定 `handleOrderBubbleTap(customer.id)`。
- 点击当前顾客且订单 READY 时，会调用 `attemptDeliverPreparedOrder(customer.id)`。
- 微波炉点击走 `handleMicrowaveTap()`，ready 时会回填当前顾客订单。
- 错误商品点击会触发 `setFeedback(..., 'error')` 和 `setErrorFx(...)`，不会进入收银。
- `probeState` 是 URL QA-only 状态，默认无参数不会进入这些状态。

这说明代码路径看起来可验证，但自动化点击未能提供可靠运行证据。

## 风险分类

| 风险 | 分类 | 严重度 | 处理 |
| --- | --- | --- | --- |
| Playwright 点击无反馈 | QA tooling / input automation | P1 | 不判玩法失败；改用真实手点或 QA gate。 |
| 默认入口维持 READY 快照 | QA design / snapshot mode | P1 | 记录为展示模式，不作为完整手点 QA 入口。 |
| `probeState` 持续重置 | QA-only code risk | P1 | 用于截图，不用于交互流；发布前 gated 或移除。 |
| 390 商品区拥挤 | Layout / touch safety | P0/P1 | 需要后续真实手点确认是否误触。 |

## 建议下一步

1. Development/testing 复核自动化点击未触发的归因。
2. 若继续 API-login 验证，优先新增或临时启用 QA-only interaction harness，使点击后不被 snapshot/probe 逻辑重置。
3. 或在 Cocos Creator Web Preview 中进行人工手点，记录结果：READY 交付、微波炉 ready 回填、错误商品不收钱、未 READY 不收钱。
4. 不应把当前 Playwright 自动化结果标记为 pass，也不应标记为 fail。

## READY 短间隔连拍补证

Dev/Test 复核建议后，追加点击后短间隔连拍：

```text
output/runtime-qa-2026-06-29/ready-burst-sequence/ready-burst-sequence-contact.png
```

连拍结果：

- 50ms：出现付款反馈，HUD 营业额变为 `42`，顾客 happy，收银机显示收入反馈。
- 100ms：付款反馈仍可见。
- 150ms：付款反馈仍可见。
- 300ms：默认 READY 快照维持逻辑把画面拉回初始 READY 状态，HUD 营业额回到 `0`。

更新判定：

```text
READY 点击路径短窗口验证通过。
默认目标图快照入口会在付款反馈后重置，不能用于完整自然状态流 QA。
```

仍待验证：

- 微波炉 ready 回填的真实点击流。
- 错误商品点击不收钱。
- 未 READY 点击不收钱。
- 390 宽度商品区、订单气泡、hands、底部导航的真实触摸遮挡。

## Microwave-ready 短间隔连拍补证

追加 `probeState=microwave-ready` 下的短间隔连拍：

```text
output/runtime-qa-2026-06-29/microwave-ready-sequence/microwave-ready-sequence-contact.png
```

连拍结果：

- before-click：微波炉处于 ready，订单为 `1/2`，饭团尚未回填。
- 点击后 50ms：微波炉回到 idle，饭团回填订单槽，订单气泡 READY，出现“订单气泡已 READY，点击顾客上方气泡交付”反馈。
- 100ms / 150ms / 300ms：READY 状态和反馈仍可见。

更新判定：

```text
微波炉 ready 回填路径短窗口验证通过。
probeState 会持续重置状态，因此该证据只证明点击处理路径可触发，不代表完整自然流 QA 已完成。
```

## Partial 未 READY 点击补证

追加 `probeState=partial` 下的订单气泡点击短间隔连拍：

```text
output/runtime-qa-2026-06-29/partial-order-click-sequence/partial-order-click-sequence-contact.png
```

连拍结果：

- before-click：当前订单 `1/3`，营业额 `0`。
- 点击后 50ms / 100ms / 150ms / 300ms：出现“订单气泡还缺：怪兽薯片、柠檬汽水”警告反馈。
- 营业额保持 `0`，未出现收银反馈或付款 burst。

更新判定：

```text
未 READY 点击不收钱验证通过。
```

## 错误商品点击补证

追加 `probeState=partial` 下点击非当前订单商品“草莓牛奶”的短间隔连拍：

```text
output/runtime-qa-2026-06-29/wrong-product-click-sequence/wrong-product-click-sequence-contact.png
```

连拍结果：

- before-click：当前订单为饭团、怪兽薯片、柠檬汽水；营业额 `0`。
- 点击后 50ms / 100ms / 150ms / 300ms：顾客出现 angry 状态，订单区域出现缺少 / 错误反馈，底部提示“选错了：草莓牛奶 不在当前订单中”。
- 营业额保持 `0`，未出现收银反馈或付款 burst。

更新判定：

```text
错误商品点击不收钱验证通过。
```

## 当前交互 QA 汇总

| 验证项 | 结果 | 证据 |
| --- | --- | --- |
| READY 点击交付 | pass / short-window | `ready-burst-sequence-contact.png` |
| 微波炉 ready 回填订单 | pass / short-window | `microwave-ready-sequence-contact.png` |
| 未 READY 点击不收钱 | pass / short-window | `partial-order-click-sequence-contact.png` |
| 错误商品点击不收钱 | pass / short-window | `wrong-product-click-sequence-contact.png` |
| 完整自然流 | not-tested | 默认快照和 `probeState` 都会重置状态，需要 QA gate 或真实手点。 |
| 390 触摸遮挡 | needs-review | 关键点击可触发，但仍需人工确认手指尺寸与误触风险。 |

结论：

```text
核心点击路径在短窗口证据下成立。
当前仍不能声明完整自然玩法流已 QA pass。
```

## QA Interactive Gate 补证

已在 `MonsterStorePrototype.ts` 增加 QA-only URL gate：

```text
?qaInteractive=1
?qaDisableSnapshotReset=1
```

用途：关闭默认目标图快照 / probe 每帧重置，让点击后的状态可以持续观察。默认无参数行为不变。

验证截图：

```text
output/runtime-qa-2026-06-29/qa-interactive-ready-sequence/qa-interactive-ready-sequence-contact.png
```

验证结果：

- before-click：默认 READY 快照可显示。
- 点击后 50ms / 250ms：付款反馈、顾客 happy、收银收入反馈出现。
- 700ms / 1200ms：不再回到初始 READY 快照；营业额保持 `42`，右侧顾客成为当前服务对象。

更新判定：

```text
QA interactive gate 可作为后续完整自然流 / 触摸路径验证入口。
默认无参数截图入口保持不变。
```

## QA Interactive 两单连续流试跑

追加 `qaInteractive=1` 下的两单连续流试跑：

```text
output/runtime-qa-2026-06-29/qa-interactive-two-order-flow/qa-interactive-two-order-flow-contact.png
```

试跑步骤：

1. 第一单 READY 状态。
2. 点击 READY 完成第一单。
3. 右侧顾客成为 current，尝试点击怪兽薯片商品卡。
4. 尝试点击右侧顾客 / 订单交付第二单。

结果：

- 第一单交付成功，营业额变为 `42`。
- 右侧顾客成为 current，hands 跟随右侧顾客。
- 第二单没有完成，截图未显示右侧订单 READY 或第二次付款反馈。

当前归因：

```text
二单连续自然流仍需复核。
目前不能归类为交互硬阻塞；可能是自动化坐标、当前顾客选择、商品卡点击位置或连续流脚本步骤问题。
```

下一步建议：

- 使用 `qaInteractive=1` 真实手点第二单：先点右侧顾客 / 订单确认 current，再点怪兽薯片商品卡，再点右侧 READY / 顾客。
- 或增加更明确的 QA state，直接从“右侧 current + 右侧订单未填”开始验证。

## QA Interactive 两单连续流复核通过

修正商品卡点击坐标后，追加 `qaInteractive=1` 下两单连续流 v2：

```text
output/runtime-qa-2026-06-29/qa-interactive-two-order-flow-v2/qa-interactive-two-order-flow-v2-contact.png
```

验证步骤与结果：

1. 第一单 READY，营业额 `0`。
2. 点击 READY，第一单交付成功，营业额变为 `42`，右侧顾客成为 current。
3. 点击怪兽薯片商品卡，右侧订单变 READY，商品库存从 `x3` 变为 `x2`。
4. 点击右侧订单 / 顾客，第二单交付成功，营业额变为 `57`，右侧订单出现 DONE 与付款反馈。

更新判定：

```text
两单连续服务闭环验证通过。
现有 probe 接入资源可支撑：READY 交付 -> current 切换 -> 商品填单 -> 第二次 READY -> 第二次收银反馈。
```

仍待验证：

- 390 手指尺寸误触风险需要人工复核。
- 完整热食自然流从商品卡点击到等待完成再取出，仍需要非重置 QA state 或真实手点。

## 顾客 v2 Probe QA 待测记录

状态：`not-run / blocked-by-cocos-cli`

本轮新增顾客 v2 资源和代码优先加载后，尚未完成 runtime 截图和交互 QA。

待测截图：

- 750x1334：READY/default、partial、heating、microwave-ready、payment、waiting-switch。
- 390x844：READY/default、heating、microwave-ready、waiting-switch，重点看顾客手、订单气泡、READY、耐心条和设备点击区。

待测交互：

- READY 交付。
- 未 READY 不收钱。
- 错商品不收钱。
- 微波炉 ready 回填。
- 两单连续流。
- current hands 跟随当前顾客；右侧 purple 成为 current 时 hands 不漂浮、不误挡订单。

阻塞：

- Cocos CLI 提升权限被系统拒绝，提示当前用量限制已触发。
- 因此本轮只能记录为 probe-ready，不能记录为 build/pass 或 QA/pass。

## 顾客 v2 Probe Cocos 构建与截图补证

状态：`build-pass / screenshot-done / visual-revise`

补证范围：

- Cocos Creator 3.8.8 `web-mobile` build 已完成。
- 运行 `build/web-mobile` 并输出顾客 v2 probe 截图。
- 截图状态：READY/default、partial、heating、microwave-ready、payment、waiting-switch。

证据：

- `output/runtime-probe-2026-06-29-v2/contact-390x844.png`
- `output/runtime-probe-2026-06-29-v2/contact-750x1067-actual.png`
- `output/runtime-probe-2026-06-29-v2/target-vs-runtime-ready.png`
- 单张截图：`output/runtime-probe-2026-06-29-v2/390x844/*.png`
- 单张截图：`output/runtime-probe-2026-06-29-v2/750x1334/*.png`

尺寸说明：

- `390x844` 组为完整有效截图。
- `750x1334` 组因内置浏览器高度限制实际为 `750x1067`，仅作为辅助证据，不作为严格 750x1334 pass。

核查结论：

- v2 teal / purple 顾客已真实进入 runtime，不再是文件层面的 probe-ready。
- payment 与 waiting-switch 能看到右侧 current hands 跟随，说明 current hands 路径未被 v2 接入破坏。
- 默认等待态 purple 缺少手/橙色袖的目标图信号；Art/UI 不通过 final 视觉验收。
- 本节只补 runtime 截图证据，不等价于完整自然流重新 QA；此前交互 QA 结论仍以 `qaInteractive=1` 记录为准。

## 订单气泡 / READY v3 Fixed-Aspect Runtime Probe

状态：`runtime-screenshot-done / pass-to-review / not final`

验证范围：

- Cocos `web-mobile` 构建完成，日志末尾显示 build task finished；CLI 返回码为 36，按日志与产物时间判断构建产物已刷新。
- 390x844 六态截图完成：READY/default、partial、heating、microwave-ready、payment、waiting-switch。

证据：

- `output/runtime-probe-2026-06-30-order-ready-v3/contact-390x844-order-ready-v3.png`
- `output/runtime-probe-2026-06-30-order-ready-v3-polish/contact-390x844-order-ready-v3-polish.png`
- `output/runtime-probe-2026-06-30-order-ready-v3-polish/target-vs-v3-polish-ready-crop.png`

结果：

- v3 current/waiting order bubble 已进入 runtime。
- v3 READY empty base + runtime READY 文本已进入 runtime。
- 未见 9-slice 尾巴变形，未见明显双 slot。
- 未见商品卡、微波炉、收银机被新气泡遮挡。
- 仍未重新跑手点交互；现有交互 QA 结论仍以前文 `qaInteractive=1` 结果为准。

复核：

- Product：可进入下一步 probe，READY 已读作可交付。
- Development/testing：pass with watch，建议停止尺寸微调。
- Art/UI：very close，但建议 READY badge 再右移/上移少量。

阻塞：

- 最后一版 READY 小坐标微调未能构建，原因是 Cocos 构建提权被用量限制拒绝。
- 代码已退回已截图 baseline，避免未验证改动留在 runtime。
