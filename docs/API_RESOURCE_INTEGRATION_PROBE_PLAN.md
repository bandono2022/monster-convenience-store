# API 阶段美术资源接入探针方案

更新时间：2026-06-29

角色：当前 API 主线程统筹 + 产品 / 美术UI / 开发测试门禁

状态：runtime-screenshots-complete / rework-tasks-dispatched

## 目标

在当前 API 登录无法继续 `imagegen` 的前提下，验证现有
`assets/ui/final-candidates/**` 候选资源能否真实接入 runtime，并通过
运行截图判断：

- 玩家是否更容易读懂经营闭环。
- 接入后是否更接近
  `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`。
- 哪些资源可继续推进，哪些需要返工。
- 返工需要注意哪些边界，避免下一轮美术生成浪费。

本方案不是 final art 接入，不覆盖现有 runtime 资源。

## 目标口径更新

2026-06-29 用户补充确认：项目目标是把静态目标图一比一还原成可游玩的运行时页面。

因此，本探针的判定边界调整为：

- `integration-candidate` 只表示资源可接入、可验证，不表示接近 final。
- `target-pass` 必须同时满足目标图构图、比例、层级、质感、主次关系和触摸安全。
- 任何偏离目标图的 runtime 表现都必须归因到动态状态、触摸安全、屏幕适配、资源缺失、实现偏差或已批准产品变化。
- API 登录阶段不生成新美术；只负责接入、截图、对比、QA 和返工 brief。
- GPT 登录 / imagegen 团队恢复后，按 `docs/RUNTIME_SCREENSHOT_REWORK_TASKS_2026_06_29.md` 生产 final art 候选。

## 角色门禁

```text
Owner: Development/testing
Brief: 制定并执行最小安全接入探针，验证资源能否接入代码和触摸链路。
Review: Product 检查玩家语义；Art/UI 检查目标图还原度与返工点。
Record: 本文档、聊天每轮汇报、后续截图/QA 记录。
```

## 第一轮接入优先级

### 必须验证核心闭环

1. 商品 icon
   - 目的：订单槽、商品卡、点击来源使用同一批商品语义。
   - 候选：
     - `gameplay-retry-v1/products/product_rice_ball_v1.png`
     - `gameplay-retry-v1/products/product_lemon_drink_v4.png`
     - `gameplay-retry-v1/products/product_snack_bag_v2.png`
     - `gameplay-retry-v1/products/product_pudding_cup_v2.png`
     - `gameplay-products-v2/products/product_strawberry_milk_v1.png`
     - `gameplay-products-v2/products/product_star_candy_v1.png`

2. 订单 / READY
   - 目的：验证商品进入订单气泡、READY 后交付入口是否清楚。
   - 候选：
     - `gameplay-retry-v1/order/order_bubble_current_base_no_slots_v2.png`
     - `gameplay-retry-v1/order/order_bubble_waiting_9slice_v3.png`
     - `gameplay-retry-v1/order/order_check_v2.png`
     - `gameplay-retry-v1/order/order_ready_capsule_empty.png`
   - 注意：`ready_badge_compact.png` 仍冻结，不拆、不盖、不调字。

3. 微波炉 / 收银机
   - 目的：验证热食路径和收银反馈是否不靠文字也能读懂。
   - 候选：
     - `gameplay-equipment-v1/equipment/microwave_idle_v1.png`
     - `gameplay-equipment-v1/equipment/microwave_heating_v1.png`
     - `gameplay-equipment-v1/equipment/microwave_ready_v1.png`
     - `gameplay-equipment-v1/equipment/cashier_idle_v1.png`
     - `gameplay-equipment-v1/equipment/cashier_pay_v1.png`

4. teal regular body + hands v2
   - 目的：验证 current 顾客 hands、waiting 隐藏 hands 是否能在运行层级成立。
   - 候选：
     - `gameplay-customers-v2/teal_regular/customer_teal_regular_body_*_v2.png`
     - `gameplay-customers-v2/teal_regular/customer_teal_regular_hands_*_v2.png`
   - 只先接 `normal` 顾客，作为 current 顾客验证；其他顾客 fallback 旧整图。

### 可一起验证但不作为 final 判定

5. 背景 / 光影
   - `store_background_clean_750x1334_v1.png`
   - `back_shelves_v1.png`
   - `window_sky_v1.png`
   - `soft_light_overlay_v1.png`
   - `current_customer_warm_halo_v1.png`
   - 第一轮可以先只接背景底图；分层光影可先静态合成或后续接入。

6. 商品卡
   - `product_card_base_205x180_v3.png`
   - `product_card_attention_border_205x180_v2.png`
   - 可接入验证商品区观感，但库存、商品名、售罄仍 runtime 绘制。

### 暂不接入

- HUD v1 目标 / 耐心相关资源：产品已判定 `revise`。
- purple hoodie body + hands：当前 API 阶段不能继续生成，资源未完成。
- `counter_foreground_v1_revise_tall_wall.png`：已记录不用于正式候选。
- `_sources/`、`_qa/`、`_cutout_probe/`：不接入 runtime。
- READY glow bitmap：已决定用 runtime glow / pulse / sparkle。

## 目标 runtime 目录

第一轮探针使用独立目录，避免覆盖已接入 P0 资源：

```text
assets/resources/ui_probe_gameplay_v1/
```

建议结构：

```text
assets/resources/ui_probe_gameplay_v1/background/
assets/resources/ui_probe_gameplay_v1/products/
assets/resources/ui_probe_gameplay_v1/order/
assets/resources/ui_probe_gameplay_v1/equipment/
assets/resources/ui_probe_gameplay_v1/customers/teal_regular/
assets/resources/ui_probe_gameplay_v1/product_card/
```

命名建议：

- `products/rice_ball.png`
- `products/lemon_drink.png`
- `products/snack_bag.png`
- `products/pudding_cup.png`
- `products/strawberry_milk.png`
- `products/star_candy.png`
- `order/bubble_current.png`
- `order/bubble_waiting.png`
- `order/check.png`
- `order/ready_capsule.png`
- `equipment/microwave_idle.png`
- `equipment/microwave_heating.png`
- `equipment/microwave_ready.png`
- `equipment/cashier_idle.png`
- `equipment/cashier_pay.png`
- `customers/teal_regular/body_neutral.png`
- `customers/teal_regular/body_impatient.png`
- `customers/teal_regular/body_happy.png`
- `customers/teal_regular/hands_neutral.png`
- `customers/teal_regular/hands_impatient.png`
- `customers/teal_regular/hands_happy.png`

## 导入与尺寸注意

- Cocos 需要 `.meta`。若复制 PNG 后没有 `.meta`，必须用 Cocos 导入或接受首次打开自动生成。
- 大尺寸候选不要覆盖原图，可先原样复制，runtime 用 `CUSTOM` size 缩放。
- 9-slice 候选接入时必须设置 inset；若 inset 不稳定，第一轮只做图片观感，不判定 final。
- 禁止 auto-trim 破坏 full-canvas anchor，尤其顾客 body/hands。
- body/hands 必须保持 `1024x1024 RGBA` 同画布同 anchor。

## 代码触点

目标文件：

```text
assets/scripts/presentation/MonsterStorePrototype.ts
```

最小触点：

- `P0_PRODUCT_RESOURCE_PATHS`
  - 先让商品 icon 优先加载 `ui_probe_gameplay_v1/products/**`。
  - 失败时 fallback 到现有 `ui_p0` / `game-art/items-transparent`。

- `loadLayeredCustomerFrames()`
  - 增加 `normal-waiting / normal-urgent / normal-happy` 对 teal v2 的 probe 加载。
  - mood 映射：
    - `waiting` -> `body_neutral` / `hands_neutral`
    - `urgent` -> `body_impatient` / `hands_impatient`
    - `happy` -> `body_happy` / `hands_happy`
    - `angry` 暂时 fallback 旧整图或复用 impatient，不能冒充 final。

- `loadUiGeneratedFrames()`
  - 增加 probe 订单、READY、微波炉、收银机 frame。
  - 失败时继续用现有 `ui_p0` 和 `ui_formal_v2`。

- `drawMicrowaveFace()`
  - 仍按现有 `getP0MicrowaveFrame()` 路径拿 frame；只替换 frame 来源，不改状态机。

- `renderOrderIcons()`
  - 第一轮可只替换气泡/READY/check 资源来源。
  - 不改变点击路径：READY 仍由订单气泡 / 当前顾客区域交付。

- `renderCustomerHandsForeground()`
  - 当前代码只给 `index === 0 && activeCustomerIndex === 0` 显示 hands。
  - 第一轮必须修正为“当前顾客显示 hands”，否则无法验证切换顾客。
  - 这是本轮唯一允许的行为修正，属于显示层 bug，不改变玩法规则。

## QA 截图与手点

### 750x1334

- 默认 Day 1 当前顾客订单。
- 商品点击后订单气泡 partial。
- READY 气泡。
- 点击 READY 后顾客 happy、收银反馈出现。

### 390x844

- READY 大气泡 + teal body/hands + 柜台/设备：hands 不挡 READY、订单槽、微波炉、收银机。
- Day 3 热食：饭团进入微波炉 heating。
- 微波炉 ready：点击微波炉回填所属订单气泡。
- 当前/等待顾客切换：hands 跟随 current，不固定在左侧顾客。
- 商品卡两排：商品 icon、库存、热食角标可读，触摸不被底部栏或柜台遮挡。
- 错误商品 / 未 READY 点击：不误收钱，反馈能被看见。

## 产品验收标准

- 第一眼能读懂：当前服务谁、对方要什么、还缺什么、何时 READY、点哪里交付。
- 普通商品和热食路径明显不同。
- 收银反馈只在交付成功后出现。
- waiting 顾客不抢 current 顾客焦点。
- 若玩家仍需要读长文字才知道下一步，判定 `revise`。

## 美术/UI验收标准

- 与目标图的粗描边、饱满体积、移动端高饱和可读性更接近。
- 当前顾客 body/hands/订单气泡/柜台遮挡关系成立。
- 商品、订单、设备不像来自不同游戏。
- 390x844 下 READY 和商品图标仍是强焦点。
- HUD v1 不因工程能接入而转正。

## 失败归因

- 资源问题：脏边、尺寸不一致、body/hands 锚点不一致、图像含 baked 文案或动态状态。
- 导入/meta 问题：resources.load 失败、SpriteFrame 缺失、auto-trim 后 pivot/尺寸错。
- 布局问题：资源可加载但遮挡 READY、商品卡、微波炉、收银机或触摸区。
- 代码状态机问题：商品、微波炉、READY、收银反馈路径和旧资源下行为不同。
- 产品语义问题：能运行但玩家不知道当前服务对象、READY 入口或热食归属。

## 第一轮判定

- `target-pass`：接入截图已经接近目标图，语义清楚，可进入 final 候选。
- `integration-candidate`：可继续用于工程验证，但 final 仍需美术返工。
- `revise`：资源或布局影响玩家理解，需要返工或调整接入。
- `block`：接入破坏点击路径、状态机、构建或无法恢复 fallback。

## 推荐执行顺序

1. 复制候选 PNG 到 `assets/resources/ui_probe_gameplay_v1/`。已完成。
2. 不覆盖旧资源；保留所有旧路径 fallback。已完成。
3. 小改 `MonsterStorePrototype.ts` 增加 probe path 优先加载。已完成。
4. 修正 current hands 显示条件。已完成。
5. 跑 TypeScript 检查。已通过。
6. 打开 Cocos 生成 `.meta` / 截图 / 手点。已完成。
7. 汇总截图：玩家语义、美术还原、开发风险三栏判断。已完成第一轮。

## 2026-06-29 实施记录

已新增 probe runtime 目录：

```text
assets/resources/ui_probe_gameplay_v1/
```

已复制资源：

- 背景：`background/store_background.png`、`background/current_customer_halo.png`
- 商品：6 个商品 icon
- 订单：current / waiting bubble、check、ready capsule
- 设备：microwave idle / heating / ready、cashier idle / pay
- 顾客：teal regular body / hands 三态
- 商品卡：base、attention border

已改代码：

- `assets/scripts/presentation/MonsterStorePrototype.ts`
- 新增 probe 商品 icon 优先加载，旧 `ui_p0` 和 `game-art/items-transparent` fallback 保留。
- 新增 teal regular `normal-waiting / normal-urgent / normal-happy` body + hands probe 加载。
- 新增 probe 背景、订单、READY、微波炉、收银机、商品卡资源加载。
- current 顾客 hands 显示条件从“必须左侧且 active”修正为“active 顾客显示”。
- READY probe capsule 使用 runtime `READY` 文本，不烘焙动态文案。

已执行检查：

- `git diff --check -- assets/scripts/presentation/MonsterStorePrototype.ts docs/API_RESOURCE_INTEGRATION_PROBE_PLAN.md docs/LOCAL_TASK_BOARD.md AGENTS.md`：通过。
- `node /Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/app.asar.unpacked/node_modules/typescript/lib/tsc.js --noEmit --pretty false --skipLibCheck --lib ES2017,DOM`：通过。
- probe 路径引用数量：24；对应 PNG 缺失：0。

已取得 runtime 截图：

- `output/runtime-probe-2026-06-29/contact-750x1334-compiled.png`
- `output/runtime-probe-2026-06-29/contact-390x844-compiled.png`
- `output/runtime-probe-2026-06-29/contact-390x844-compiled-with-waiting-switch.png`
- 750x1334：READY、partial、heating、microwave-ready、payment、waiting-switch。
- 390x844：READY、heating、microwave-ready、waiting-switch。

第一轮判定：

- 总判定：`integration-candidate`。
- Development/testing：资源 meta、resources.load、fallback、Cocos 预览、750/390 canvas 截图链路均成立；未见构建或运行时加载阻断。
- Product：READY、订单缺口、热食加工、微波炉完成、收银反馈、current / waiting 切换在截图中可读，玩家不再完全依赖长文字。
- Art/UI：比旧 P0 更接近目标图，但尚未达到 target-pass；HUD、整体排版密度、商品卡文字层、订单气泡/READY final 质感、顾客多样性仍需返工。

重要观察：

- 现有候选资源可以真实接入代码，不是只停留在文件层面。
- teal regular body + hands v2 能在 current 顾客上成立；waiting-switch 750 截图显示 hands 已跟随右侧 current 顾客。
- 商品 icon、订单气泡、READY capsule、微波炉、收银机、商品卡底均能进入 runtime。
- 390x844 下核心链路仍能读，但底部商品区和导航区拥挤，商业完成度不足。
- 本轮 `probeState` URL 截图开关仅用于 QA 截图，默认 READY 快照不变，不作为正式玩法规则。

返工注意点：

- HUD 需要 final art pass；当前 HUD 仍是工程拼装 / 旧资源混合，不应转正。
- 商品卡需要重新处理运行时文字、库存、锁定态和图标层级，避免 390 宽度下显得拥挤。
- READY 胶囊与订单气泡可继续作为接入候选，但 final 仍要统一粗描边、厚度、插槽和发光规范。
- 微波炉/收银机可继续工程验证；final pass 需保证与背景、柜台同一光源和描边体系。
- purple hoodie、blue shopper 仍缺 body + hands final 资源；teal regular 不能代表全部顾客 final。
- 390x844 waiting-switch 单张证据已整理进 `contact-390x844-compiled-with-waiting-switch.png`；移动端 hands 跟随 current 的截图证据已补齐。

## 2026-06-29 返工任务派发

已新增任务单：

```text
docs/RUNTIME_SCREENSHOT_REWORK_TASKS_2026_06_29.md
```

派发结论：

- Product：锁定“一眼读懂”的玩家链路，并明确 390 宽度下哪些文字可降权，哪些核心信息不能降权。
- GPT-login Art/UI：具备 imagegen 能力后，优先生产 HUD v2、订单气泡 / READY final 包、顾客 body + hands final、商品卡分层 final。
- API-login Dev/Test：继续补截图证据、手点 QA、触摸遮挡检查和 `probeState` QA-only 边界管理。

本阶段禁止把 probe 截图的可玩性误判为 final 美术通过；目标图一比一可游玩化仍是后续验收门槛。

## 2026-06-29 顾客 v2 Probe 接入记录

状态：`probe-ready / screenshot-blocked`

新增候选来源：

- `assets/ui/final-candidates/gameplay-customers-final-v1/characters/customer_teal_regular_body_neutral_v3.png`
- `assets/ui/final-candidates/gameplay-customers-final-v1/characters/customer_teal_regular_hands_neutral_v3.png`
- `assets/ui/final-candidates/gameplay-customers-final-v1/characters/customer_purple_hoodie_body_neutral_v4.png`
- `assets/ui/final-candidates/gameplay-customers-final-v1/characters/customer_purple_hoodie_hands_neutral_v4.png`

新增 runtime probe 资源：

- `assets/resources/ui_probe_gameplay_v2/customers/teal_regular/body_neutral.png`
- `assets/resources/ui_probe_gameplay_v2/customers/teal_regular/hands_neutral.png`
- `assets/resources/ui_probe_gameplay_v2/customers/purple_hoodie/body_neutral.png`
- `assets/resources/ui_probe_gameplay_v2/customers/purple_hoodie/hands_neutral.png`

代码接入：

- `MonsterStorePrototype.ts` 的 `loadLayeredCustomerFrames()` 增加 v2 优先加载。
- `normal-waiting` 使用 teal v2；`impatient-waiting` 使用 purple hoodie v2。
- v1 teal 三态保留为 fallback。
- Direct gameplay / probe 右侧预览顾客使用 `impatient`，用于目标图 purple waiting 对照；普通顾客生成规则未改。

已通过：

- PNG 规格：四张 probe v2 均为 `1024x1024`、RGBA、有 alpha。
- Cocos `.meta`：已为 v2 目录和四张 PNG 生成。
- `git diff --check`：通过。

未通过 / 未执行：

- Cocos build、resources.load 实测、750/390 runtime 截图未完成。
- 阻塞原因：Cocos CLI 提升权限被系统拒绝，提示用量限制已触发。

下一步：

- 用 Cocos Creator 导入并重新 build / Preview。
- 输出 `output/runtime-probe-2026-06-29-v2/` 截图 contact sheet。
- 只有 Art/UI + Product + Dev/Test 对 runtime 截图复核后，才可判定是否继续修图或进入下一包资源。

### 顾客 v2 截图补证更新

状态：`build-pass / integration verified / final-art revise`

已完成：

- Cocos Creator 3.8.8 `web-mobile` build 完成。
- `ui_probe_gameplay_v2/customers/**` 已通过 runtime 截图验证进入画面。
- 输出：
  - `output/runtime-probe-2026-06-29-v2/contact-390x844.png`
  - `output/runtime-probe-2026-06-29-v2/contact-750x1067-actual.png`
  - `output/runtime-probe-2026-06-29-v2/target-vs-runtime-ready.png`

判定：

- Development-testing：接入路径成立，可继续作为 probe 验证基础。
- Product：current / waiting 顾客可区分，但目标图首屏完成度仍不足。
- Art/UI：purple waiting 默认态缺目标图右侧手/袖/搭柜台信号，teal 仍需看手掌与柜台接触，不能转 final。

下一步：

- 回到 Art/UI final-candidates 修订顾客层，不在代码里继续硬调 placeholder。
- 重新生产候选后，再按同样路径进入 `ui_probe_gameplay_v2` 或后续 v3 probe。

## 2026-06-29 交互 QA 边界

已新增记录：

```text
docs/RUNTIME_INTERACTION_QA_2026_06_29.md
```

结论：

- Playwright CLI 可用于打开页面、设置视口和截图。
- 初始稳定截图未观察到 READY 点击反馈；Dev/Test 复核后改用短间隔连拍，已捕捉到付款反馈、HUD 营业额变化、happy 顾客和收银机收入反馈。
- READY 点击路径短窗口验证通过。
- 微波炉 ready 回填订单短窗口验证通过。
- 未 READY 点击不收钱短窗口验证通过。
- 错误商品点击不收钱短窗口验证通过。
- 默认无参数入口存在目标图 READY 快照维持逻辑，适合截图展示，不适合完整自然状态流 QA。
- `probeState` 在 update 中持续重置状态，适合稳定中间态截图，不适合点击后状态流验证。
- 已新增 QA-only URL gate：`qaInteractive=1` / `qaDisableSnapshotReset=1`，用于关闭快照重置并观察点击后的持续状态。
- `qaInteractive=1` 下 READY 点击持续状态验证通过；付款后营业额保持 `42`，不会回到初始 READY。
- 完整自然流和 390 手指尺寸误触风险仍需继续用 QA gate 或真实 Cocos 手点验证。
- QA gate 发布前必须保留显式门禁或移除。

## 2026-06-29 订单气泡 / READY v1 probe 边界

候选目录：

```text
assets/ui/final-candidates/gameplay-order-ready-final-v1/
```

当前判定：

```text
revise / partial pass-to-probe / not final
```

可进入后续 isolated probe 的 7 张资源：

- `order_bubble_current_base_v1.png`
- `order_bubble_waiting_base_v1.png`
- `order_slot_empty_v1.png`
- `order_slot_missing_dotted_v1.png`
- `order_item_check_badge_v1.png`
- `order_question_badge_v1.png`
- `ready_badge_base_empty_v1.png`

暂停：

- `ready_badge_glow_v1.png`

开发接入边界：

- 不覆盖现有 runtime final。
- 不覆盖、不拆、不盖字修补冻结的 `ready_badge_compact.png`。
- 由于 bubble base 已包含尾巴和 slots，后续 probe 必须先选择 fixed-aspect sprite 方案，或重做为真正分层资源；不要直接 9-slice 拉伸。
- 若使用独立 `slot/check/question`，必须避免 runtime 同时绘制旧 slot/check 造成双层状态。
- Product 验收必须看到 READY 完整语义；仅接入空绿牌不能判 pass。

### v3 fixed-aspect 接入结果

状态：`runtime-probe-pass-to-review / not final`

已接入 runtime probe：

- `ui_probe_gameplay_v3/order_ready/order_bubble_current_base_v1`
- `ui_probe_gameplay_v3/order_ready/order_bubble_waiting_base_v1`
- `ui_probe_gameplay_v3/order_ready/ready_badge_base_empty_v1`

未接入：

- `ready_badge_glow_v1.png`
- `order_slot_empty_v1.png`
- `order_slot_missing_dotted_v1.png`
- `order_item_check_badge_v1.png`
- `order_question_badge_v1.png`

实现结果：

- fixed-aspect SIMPLE sprite 成立，未走 9-slice。
- 旧 slot 背景在 v3 bubble 下已跳过，商品 icon 仍由 runtime 绘制。
- READY 文字仍由 runtime 绘制在空底座上。
- `ready_badge_compact.png` 冻结规则未破坏。

截图证据：

- `output/runtime-probe-2026-06-30-order-ready-v3-polish/contact-390x844-order-ready-v3-polish.png`
- `output/runtime-probe-2026-06-30-order-ready-v3-polish/target-vs-v3-polish-ready-crop.png`

下一步：

- Art/UI 只建议 READY badge 小坐标微调；当前因用量限制未能重建，代码保持在已截图 baseline。
