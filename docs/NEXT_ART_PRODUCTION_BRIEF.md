# 下一轮美术生产 Brief

更新时间：2026-06-29

权威目标图：`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

分层指导：`docs/GAMEPLAY_ART_LAYERING_GUIDE.md`

## 团队决议

当前目标不是自由重设计经营页，也不是把已有资源勉强接入 runtime。所有 Product / Art/UI / Development/testing 判断都必须服务同一个目标：

```text
还原权威目标图，并把权威目标图可游玩化。
```

验收时优先比较权威目标图的构图、比例、层级、商品识别、顾客手部关系、HUD / 底部按钮结构和可点击路径。任何局部更好看但偏离目标图的资源、工程方便替代、placeholder 修补或仅通过 probe 的候选，都不能作为 final pass。

## 美术输出总览门禁

每批美术资源产出后，先输出一张总览图 / QA contact sheet 给用户检查，再进入任何 Figma 摆位或 runtime 接入。

必须满足：

- 总览图包含本批全部资源、权威目标图参考、关键缩放预览或 390 商品 / 柜台局部组合预览。
- Art/UI 基于总览图检查目标图 fidelity：风格、比例、描边、光影、材质、层级是否贴近权威目标图。
- Product 基于总览图检查玩家可读性和可玩化路径：商品识别、点击目标、订单到商品的路径是否清楚。
- 未通过用户 + Art/UI + Product 复核前，资源只能留在 `assets/ui/final-candidates/**`，不得上传 Figma，不得交给 Development/testing 接入 runtime。

## 2026-06-30 本轮执行结果

状态：`candidate-produced / conditional-pass / waiting-user-overview-review`

本轮按团队门禁只产出最小美术候选包：

- 商品 icon v2：
  - `assets/ui/final-candidates/gameplay-products-target-v2/products/product_rice_ball_target_v2.png`
  - `assets/ui/final-candidates/gameplay-products-target-v2/products/product_chocolate_milk_target_v2.png`
  - `assets/ui/final-candidates/gameplay-products-target-v2/products/product_candy_bag_target_v2.png`
- 顾客手扒柜台横条：
  - `assets/ui/final-candidates/gameplay-counter-hand-ledge-v1/counter/counter_hand_ledge_v1.png`
- 总览图：
  - `assets/ui/final-candidates/gameplay-art-round-2026-06-30/_qa/next_round_art_overview_2026_06_30.png`

角色复核：

- Product：`conditional pass`。商品区可读性和点击链路基础成立；但总览未包含订单气泡同屏验证，所以不能宣称完整“看订单 -> 找商品”final pass。
- Art/UI：`conditional pass`。三件商品已明显接近目标图商品语言，可交给用户检查；巧克力奶略窄弱、糖果袋略霓虹、木条略偏橙且分段偏规律。
- Development/testing：`conditional pass`。资源隔离、尺寸、alpha 通过；未进入 Figma 或 runtime。后续 manifest 必须用新路径，并阻断旧商品卡 / 旧 attention / 旧饭团 stale path。

当前硬门禁：

- 等用户检查总览图并给出通过 / 返修。
- 用户确认前，不上传 Figma，不接 runtime，不把这些候选写为 final art。
- 若返修，优先只改失败项，不扩大到 HUD、底部按钮、蓝色顾客或 READY。

## 2026-06-30 HUD / Nav 生产前置 brief

状态：`candidate-produced / user-confirmed-semantics / waiting-user-overview-review / art-dev-readable-review / product-thread-missing`

详细 brief：

- `docs/HUD_NAV_PRODUCTION_BRIEF_2026_06_30.md`

当前边界：

- 商品 icon 暂由用户在 Figma 统一视觉效果和尺寸后导出替换；本 brief 不继续追商品 icon。
- 本阶段目标仍是还原权威目标图并可游玩化；HUD/Nav 不做自由重设计。
- 用户已确认 HUD/Nav 语义；HUD/Nav target v1 候选已产出。
- 本 brief 不批准 Figma 上传或 runtime 接入；候选仍需总览图检查。

Product 推荐五入口顺序：

```text
任务 / 采购 / 库存 / 升级 / 图鉴
```

对应 semantic id：

- `nav_task`
- `nav_procurement`
- `nav_inventory`
- `nav_upgrade`
- `nav_catalog`

顶部 HUD 语义：

- 金币 / 营业额显示位：营业中主值按 `currentShiftRevenue`，数字由 runtime 绘制。
- 倒计时：时间文本和进度由 runtime 绘制。
- 星级目标 / 评价进度：星星素材和面板由美术提供，`x3` 等文本由 runtime 绘制。
- 暂停：独立 icon-only 按钮。

Art/UI 本批已输出的候选范围：

- `hud_top_frame_base_390w_v1.png`
- `hud_coin_icon_v2.png`
- `hud_clock_icon_v2.png`
- `hud_star_full_v1.png`
- `hud_star_empty_v1.png`
- `hud_timer_progress_track_v1.png`
- `hud_timer_progress_fill_v1.png`
- `hud_pause_button_v2.png`
- `nav_bottom_bar_base_390w_v1.png`
- `nav_slot_base_v1.png`
- `nav_slot_active_v1.png`
- `nav_icon_task_v2.png`
- `nav_icon_procurement_v2.png`
- `nav_icon_inventory_v2.png`
- `nav_icon_upgrade_v2.png`
- `nav_icon_catalog_v2.png`
- `nav_alert_badge_v1.png`

必须排除：

- 动态数字、倒计时文本、`x3` 文本、入口文字标签、badge 数字。
- 整屏 HUD/Nav 烘焙图。
- READY baked 占位相关任何修改。
- 商品 icon。

总览 QA：

- 已生成 `390x844` 目标图对照总览：`assets/ui/final-candidates/gameplay-hud-nav-target-v1/_qa/hud_nav_target_v1_overview_2026_06_30.png`。
- 候选包 manifest 已生成：`assets/ui/final-candidates/gameplay-hud-nav-target-v1/MANIFEST.md`。
- Product 检查玩家能否读懂钱、时间、目标、暂停和五入口。
- Art/UI 检查深紫顶部壳、底部五槽、图标风格是否贴目标图。
- Development/testing 只在总览通过后做 Figma/runtime 路径和触控预检。
- 第一轮 Product、Art/UI、Development/testing 子线程复核返回空 completion。
- 2026-07-01 追加复核后，Art/UI 给 `pass-for-user-review`，Development/testing 给 `pass-for-preflight`。
- 当前环境没有 Product 员工线程可复核，且用户尚未审总览；因此当前只能标记为 `overview-ready`，不能标记三方 pass。

## 2026-06-30 Figma 摆位后更新

状态：`placement-informed / product-area-first / art-brief-ready`

Owner / Brief / Review / Record：

- Owner：Art/UI 负责下一批美术候选规格与质量；Product 负责玩家路径优先级；Development/testing 负责接入前置条件和 QA 标准；Coordination 负责汇总与记录。
- Brief：用户已在 Figma `PLACEMENT_CANVAS__390x844 01/02` 摆出两个顾客 / 两个状态。旧商品卡、旧 attention 边框、旧饭团已经退场；商品区还有空商品位，非当前气泡暂未摆商品，顶部 HUD 和底部按钮暂缺。顾客手部继续按左右手独立层处理，左右手对称且一致。
- Review：Product 判定下一轮先做商品区闭环；Art/UI 给出商品卡和商品 pack 规格；Development/testing 判定当前 Figma 不能直接接入，必须等替换旧路径后先做 stale-path 预检。
- Record：本节、`docs/LOCAL_TASK_BOARD.md`、`docs/CURRENT_USABLE_ART_RESOURCES.md`。

### 新优先级

1. 商品区闭环：`product_card_base_target_v1`、新正方形饭团、至少两个补位商品。
2. 柜台分层重定：下半屏纯色 / 简单背景由用户在 Figma 用 shape 摆位，后续由 Development/testing 还原；设备置物板沿用之前可用资源；手扒柜台木板 / 前沿条单独评估。
3. 顶部 HUD / 底部按钮 final 候选。

Product 复核结论：

- 商品区是“看订单 -> 找商品 -> 点击交付”的核心可玩路径；空卡、旧卡退场、饭团比例不统一会直接破坏可玩化。
- 柜台区域决定整页空间感和目标图匹配度，但不应烘焙成 `390x844` full-canvas 大图；多尺寸适配优先用 Figma/runtime shape、已有置物板资源，以及必要时单独的手扒柜台前沿条。
- HUD / 底部按钮影响商业完整度，但当前不如商品区阻塞玩家操作。

Development/testing 接入门槛：

- 当前 Figma 中任何旧商品卡 / attention 边框 / 旧饭团路径都只能当“待替换位置参考”，不得接入 runtime。
- 新资源替换进 Figma 后，先读取 `PLACEMENT_CANVAS__390x844 01/02` 输出可接入 / blocked manifest。
- 预检必须阻断 archived path，确认所有 `localPath` 仍存在且不在归档目录，并检查重复商品节点。
- 预检通过后再做最小静态 runtime probe；库存数字底板用 runtime shape 绘制，不需要 bitmap。

推荐叠层：

```text
背景 -> 顾客身体 -> Figma/runtime shape 背板 -> 手扒柜台木板/前沿条（如需要） -> 顾客左右手 -> 设备 / 既有置物板 / 商品卡 / 商品图标 -> 订单气泡 -> HUD / 底部按钮
```

### 第一优先：商品卡底板

资源名：

- `assets/ui/final-candidates/gameplay-product-card-target-v1/product_card_base_target_v1.png`

规格：

- 画布：沿用旧卡接入 footprint，`205x180` 透明 PNG；如先高分辨率绘制，可保留 2x source，但候选导出必须有 `205x180`。
- 透明：卡片外透明；卡片内部为暖白 / 奶油底。
- 包含：目标图商品区卡片本体、暖白内底、浅米色边框、圆角、轻微内阴影、底部轻压暗角。
- 排除：商品图标、库存数字、库存数字底板、火焰 / 星标 / 高亮描边、绿色选中光、任何文字。
- 验收：6 张并排成 3x2 时边距一致；整体读作厚实、干净、可点击库存格；库存底板由 runtime shape 后续叠加。

### 第二优先：商品补齐与统一

资源目录：

- `assets/ui/final-candidates/gameplay-products-target-v1/products/`

失败候选，不上传、不接 runtime：

- `product_rice_ball_square_v1.png`
- `product_chocolate_milk_v1.png`
- `product_candy_bag_v1.png`

必须重新产出：

- `product_rice_ball_target_v2.png`
- `product_chocolate_milk_target_v2.png`
- `product_candy_bag_target_v2.png`

规格：

- 每个商品统一正方形透明 PNG，建议 `1254x1254`，与现有 lemon / pudding / snack 源规格一致。
- 可包含极轻的产品自身接触阴影；不能包含商品卡阴影。
- 风格为目标图同类商业手游食品 icon：黑描边、饱和但不脏、顶部偏左受光、形体夸张清楚。
- 排除：商品卡、库存数字、库存底板、热量火焰 badge、星标、选中光、订单气泡用小号背景。
- 验收：六个商品放进同款卡片时主体高度、视觉重量和透明边界一致；饭团不能再有横纵比例不一致问题。
- 纠偏：饭团不要写实米粒密集纹理；巧克力奶不要偏瘦偏高；糖果袋不要色彩过跳或细节过密。

### 第三优先：柜台分层重定

废弃候选：

- `assets/ui/final-candidates/gameplay-counter-scene-v1/counter_scene_base_390x844_v1.png`

判定：

- `failed direction / do not upload / do not runtime integrate`。
- 原因：`390x844` full-canvas 柜台底景把屏幕比例、顾客手线、设备区、商品区和底部区域烘焙在一张图里，多尺寸适配差；宽屏、窄屏或不同安全区下会出现拉伸、裁切、空洞或位置锁死。

新规格：

- 下半屏大面积深紫背景：用户在 Figma 用纯色 / 简单 shape 摆位，后续由 Development/testing 在 Cocos runtime 还原，不出 bitmap。
- 设备置物板：沿用之前已有置物板资源，不在当前批次重做。
- 顾客手扒区域：当前木板和目标图差距大；如目标图需要木质厚边、描边、阴影或遮挡顾客下半身，单独出 `counter_hand_ledge` 横向条；如果只是纯色背景或简单分割线，则不出图，用 runtime shape。
- 柜台前沿 / 装饰 panel：如需要美术质感，做成可横向拉伸的窄条或 9-slice，而不是整屏大图。

### 暂缓

- 顶部 HUD / 底部按钮：等商品区和柜台底景稳定后再补。
- 旧商品卡 / 旧 attention border / 旧饭团：已归档，不得恢复接入。
- 当前 Figma 旧路径：只当位置参考，不当接入资源。

## 2026-07-01 顾客动画表情候选包 v1

状态：`candidate-produced / pass-for-user-overview / pass-for-preflight / waiting-user-overview-review`

Owner / Brief / Review / Record：

- Owner：Art/UI 负责目标图 fidelity、分层质量和表情动画方向；Product 负责玩家可读性和服务状态语义；Development/testing 负责透明度、尺寸、路径隔离、Figma/runtime 预检风险。
- Brief：用户通过两张 raw 生成稿后，只做后处理：去色键、拆成 `body_base`、`face_neutral`、`face_happy`、`face_impatient`、`left_hand`、`right_hand`，并输出总览图。目标仍是还原权威目标图并可游玩化，不上传 Figma，不接 runtime。
- Review：Product 与 Art/UI 均给 `pass-for-user-overview`；Development/testing 给 `pass-for-preflight`。
- Record：本节、`docs/CURRENT_USABLE_ART_RESOURCES.md`、`docs/LOCAL_TASK_BOARD.md`、`assets/ui/final-candidates/gameplay-customers-animation-v1/MANIFEST.md`。

产出：

- 候选包：`assets/ui/final-candidates/gameplay-customers-animation-v1/`
- 总览图：`assets/ui/final-candidates/gameplay-customers-animation-v1/_qa/customer_animation_rig_v1_overview_2026_07_01.png`
- Manifest：`assets/ui/final-candidates/gameplay-customers-animation-v1/MANIFEST.md`
- 后处理工具：`tools/split_customer_animation_sheet.py`

候选层：

- Purple hoodie：`body_base`、`face_neutral`、`face_happy`、`face_impatient`、`left_hand`、`right_hand`。
- Blue teal：`body_base`、`face_neutral`、`face_happy`、`face_impatient`、`left_hand`、`right_hand`。
- `placement/` 为 tight PNG，适合给用户后续 Figma 摆位复核。
- `rig_canvas/` 为 `1024x1024 RGBA` rough anchor 预检层，不是最终 runtime 对齐证明。

复核结论：

- Product：三态玩家可读，happy / impatient 可服务订单成功、等待焦虑、耐心下降等反馈；但最终服务对象清晰度仍依赖订单气泡、halo、READY、耐心条和 hands 显隐同屏摆位。
- Art/UI：目标图方向成立；body-only 基本完整；face rig 支持第一阶段表情切换；blue teal hands 为裸 teal 爪；purple hoodie 短袖口合理。
- Development/testing：路径隔离、RGBA、`1024x1024` rig_canvas 均通过预检；后续如果没有 Figma 坐标或 anchor metadata，runtime 直接拼装会漂移。

硬门禁：

- 等用户基于总览图确认通过 / 返修。
- 用户通过前，不上传 Figma，不复制进 `assets/resources/**`，不接 Cocos runtime。
- 若用户通过，下一步才把通过项加入 Figma 上传队列，并要求每个节点写入 `localPath`、`customerId`、`state`、`part`、`originalWidth`、`originalHeight`。

## 当前判断

- 背景、6 个商品、订单/READY、设备、商品卡可进入最小接入评估。
- 顾客 3x3 和 teal body + hands v2 只可用于接入评估，不是最终目标图还原级；其中 teal body / hands 分离本身已判定失败。
- 顾客 runtime 被拉伸主要是代码接入比例问题，不能让美术通过反向变形来适配；但顾客手身分离和目标图相似度仍需美术重做。
- 订单气泡不规则和内部黑边是资源规格与代码 9-slice 接入共同问题：下一批必须出干净无槽底板、独立 slot / check / READY，并给出明确 inset。
- HUD v1 工程可用，但产品语义未通过，必须做 v2。
- 下一阶段不扩新装饰，先修目标图最关键的顾客遮挡和 HUD 语义。
- 所有现有美术资源需要按目标图重新复核风格和质感；旧 `pass` 只代表可用候选，不自动等于最终商业化资源。

## 2026-06-29 目标图复核结论

| 资源组 | 评级 | 处理 |
| --- | --- | --- |
| 顾客 3x3 / teal body + hands v2 | `integration-candidate only` | 可接入评估；final 必须重做原生 body + hands，不能沿用当前手身拆分小修。 |
| 柜台 / 设备 | `integration-candidate` | 设备可用；柜台随新手部微调。 |
| 背景 / 光影 | `target-pass` | 可进 final 候选。 |
| 商品 / 商品卡 | 商品 `target-pass`；商品卡 `integration-candidate` | 商品稳定；商品卡待最终排版/库存区确认。 |
| 订单 / READY | `integration-candidate` | waiting bubble 槽位和 READY 文本/动效仍需规格化。 |
| HUD v1 | `revise` | 目标/耐心语义冲突，走 HUD v2。 |

最大差距：顾客体积与表情张力、顾客手扒柜台遮挡关系、body / hands 原生连接关系、HUD 目标/耐心语义。

## 开工前复核

下一轮美术生产前，先对现有资源做目标图复核：

1. 顾客 3x3：重点看体积、手部、表情张力、目标图贴近度。
2. 柜台 / 设备：重点看整屏融合、遮挡、台面空间感。
3. 商品 / 商品卡 / 订单：重点看描边、材质、目标图 UI 统一性。
4. 背景 / 光影：重点看是否支撑目标图而不抢焦点。
5. HUD v1：已知语义 revise，继续走 v2。

## 下一批优先级

1. 顾客 body + hands 分层重做。
2. HUD v2 返修。
3. 柜台台面中景 + 静态小件合并图。
4. 柜台前景遮挡层 v2。
5. 反馈/状态包。

## 第一优先：顾客 Body + Hands

先做 teal regular 和 purple hoodie，不急着重做 blue shopper。

2026-07-01 用户纠偏覆盖本段旧优先级：

- 橙色 / purple hoodie 顾客现有资源可用，不再重新生成。
- 已中止的 `gameplay-customers-states-v1` 批次 rejected：误重做橙色顾客，且新 teal / blue 仍有 body-only 断手问题。
- 下一次若继续输出顾客，只做蓝色 / teal 顾客纠偏候选。
- 纠偏目标不是把手简单拆成贴片，而是让 body-only 本身完整自然，左右手 overlay 显示时能和 body 的上臂 / 袖口连上。
- 硬规则：body 隐藏 hands 时必须仍是完整角色；hands 只是“扒柜台姿势替换层”，不能承担修补断手 / 缺手的职责。橙色顾客能用的原因正是 body-only 已经完整。
- 新增硬规则：body 负责完整胳膊结构；hands 层只允许手掌 / 爪子 + 极短 wrist/cuff cap，不能带完整前臂、上臂或第二套胳膊。
- 服装结构约束：wrist/cuff cap 只适用于橙色 hoodie 这类长袖角色；蓝色 / teal 背带角色 hands 层必须是裸 teal 手掌 / 爪子，不能带袖口、肩带、背带、黑紫环或任何衣服结构。
- 生成流程硬规则：imagegen 原始生成图必须先给用户过目；用户通过前，不做去背、拆层、裁切、归一化、候选包整理、Figma 上传或 runtime 接入。
- 表情动画硬规则：后续要做表情动画的角色必须预留 face rig。第一阶段优先交付同画布同 anchor 的 `face_neutral`、`face_happy`、`face_impatient` / `face_angry` 表情组；需要更细动画时再拆 `eye_base`、`pupil`、`eyelid`、`mouth_*`、`emotion_mark_*`。
- 不允许从已烘焙完整脸的 body 上再覆盖眼嘴贴片；可动画角色的 `body_base` 必须为 face 层预留干净区域，或提供明确的 neutral fallback 与完全对齐的 face overlay。
- 新顾客候选通过原始图检查后，才允许进入 overview / contact sheet；overview 通过前不得上传 Figma 或接 runtime。

当前纠偏：现有 `teal regular` body + hands v2 只证明 runtime 可以分层接入，不证明手身资源本身可进入 final。它不能作为继续小修的 final 基础。

现有分层问题：

- hands 更像贴上的前景爪子，不像目标图中自然扒在柜台上的手。
- body 与 hands 的腕部 / 下臂衔接弱，不像同一角色原画原生拆层。
- body-only 隐藏 hands 时姿态容易残缺。
- hands 层没有按目标图原生处理柜台接触、遮挡、READY 和订单气泡空间关系。
- 同一 teal 复用左右顾客会破坏目标图 current / waiting 角色差异。

生产节奏改为：重新做原生分层角色。先出 `teal current` 与 `purple hoodie waiting` 的 neutral body + hands，用目标图同屏对照确认手身关系，再扩三态。

每个角色 3 状态：

- `neutral`
- `impatient`
- `happy`

每个状态拆两层：

- `body`
- `hands`

推荐命名：

- `customer_teal_regular_body_neutral_v2.png`
- `customer_teal_regular_hands_neutral_v2.png`
- `customer_teal_regular_body_impatient_v2.png`
- `customer_teal_regular_hands_impatient_v2.png`
- `customer_teal_regular_body_happy_v2.png`
- `customer_teal_regular_hands_happy_v2.png`
- `customer_purple_hoodie_body_neutral_v2.png`
- `customer_purple_hoodie_hands_neutral_v2.png`
- `customer_purple_hoodie_body_impatient_v2.png`
- `customer_purple_hoodie_hands_impatient_v2.png`
- `customer_purple_hoodie_body_happy_v2.png`
- `customer_purple_hoodie_hands_happy_v2.png`

验收：

- body 和 hands 同画布、同 anchor。
- body 不含压台手掌；hands 不含柜台边缘。
- current 顾客显示 hands；waiting 顾客默认隐藏 hands 或只显示低权重小手。
- 风格更接近目标图：体积更饱满、光影更商业化、当前顾客扒柜台姿态更明确。
- 手部必须像从身体自然伸出并压在柜台上，不能漂浮、断腕、像临时贴片。
- body-only 隐藏 hands 时必须仍是完整角色，不得依赖 hands 才成立。
- `neutral` 读作正常等待/可服务；`impatient` 读作耐心低但未失败；`happy` 读作交付成功。
- waiting 隐藏 hands 后不能残缺；hands 不能漂浮、挡订单、READY、商品卡、微波炉或收银机。
- 资源建议 `1024x1024 RGBA` 同画布；同角色三态水平中心和底线稳定。

## 第二优先：HUD v2

只返修语义冲突项：

- `hud_panel_goal_v2.png`
- `hud_icon_star_v1.png`
- `patience_bar_track_v2.png`
- `patience_bar_fill_v2.png`

不重做：

- 金币面板
- 时间面板
- 暂停按钮
- 底部导航 slot 和已通过图标

## 第三优先：柜台台面中景 + 静态小件

可合并烘焙：

- `counter_worktop_midground_with_props_v1.png`

可包含纸杯、菜单牌、低对比小植物、纸巾筒、弱台面光影。

不能包含微波炉、收银机、顾客手、订单、商品、HUD、任何动态反馈。

## 暂缓

- blue shopper body/hands final pass。
- 复杂底部 tabbar 状态。
- 柜台小件独立动画。
- 金币大特效、长序列帧。
- 新商品、新顾客、新玩法入口。
