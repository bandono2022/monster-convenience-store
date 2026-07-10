# 视觉一比一还原失败复盘 2026-06-29

更新时间：2026-06-29

权威目标图：`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

对照截图：

- `output/runtime-probe-2026-06-29/contact-750x1334-compiled.png`
- `output/runtime-probe-2026-06-29/contact-390x844-compiled-with-waiting-switch.png`

## 角色门禁

```text
Owner: Art/UI
Brief: 判断当前 runtime 是否一眼还原目标图，并列出 final art 重做范围。
Review: Product 复核可玩化偏离边界；Development/testing 复核资源接入规格。
Record: 本文档、docs/LOCAL_TASK_BOARD.md、后续 GPT-login 美术生产 brief。
```

## 总 Verdict

```text
visual-fail / not-target-match
```

当前 runtime 不是“差一点商业质感”，而是整屏第一眼没有还原目标图。Dev/Test 已证明资源能接、关键点击路径能跑，但这只证明工程可验证，不证明画面像目标图。

特别补充：顾客资源的失败不只是“角色不够像”或“还缺 purple hoodie”。现有顾客 body / hands 分离方式本身也失败，手部像后贴前景件，身体和手腕 / 下臂连接不像同一张目标图角色原生拆层。该问题必须进入 P0 final art 重做范围，不能作为代码调参、小修 PNG 或继续沿用 teal v2 的问题处理。

当前 P0 必须从工程 QA 切回视觉一比一还原：整屏构图、比例、层级、质感、角色、订单、HUD、商品卡按目标图重做。

## Product 口径

目标图是可游玩 runtime 的静态 READY 态标准帧。

不接受用“可玩化”解释一眼偏离目标图。允许偏离的前提只有：偏离是运行时必须存在的动态变化，并且不破坏目标图的构图、比例、层级和视觉识别。

必须一比一保留：

- 顶部深紫商业 HUD：金币、倒计时、星级 / 连击、暂停按钮。
- 双顾客同屏：左侧当前顾客强高亮，右侧等待顾客弱焦点。
- 当前订单气泡：位置、大小、圆角厚度、商品槽、完成勾、金色描边和 READY 绑定关系。
- READY：在当前订单气泡下方，作为当前订单交付入口。
- 顾客耐心条：贴近顾客，情绪归属清楚。
- 工作台结构：左微波炉、右收银机、中间小道具 / 台面层次。
- 商品区：2x3 六商品卡，大商品图、库存角标、饭团火焰角标、当前需要高亮。
- 底部导航：深紫底栏和五个入口图标结构。

可接受但必须最小化：

- partial、heating、microwave-ready、payment 等动态状态。
- 点击热区扩大，但视觉元素不能因此变形或移位。
- 390 适配可以压缩或裁切次要装饰，但不能重排核心五段结构。
- 动态数字和文字由 runtime 绘制，但字体、描边、阴影、位置必须贴近目标图。

## 分区失败清单

| 区域 | 目标图是什么样 | 当前 runtime 为什么不像 | 必须重做什么 |
| --- | --- | --- | --- |
| HUD | 厚重深紫商业手游顶栏，金币、时间、星级、暂停四组信息大、亮、圆润，像完整 UI 壳 | 顶栏变薄、变碎，信息块像工程条；星级 / 满意度语义不像目标图星级进度 | P0 重做整套 HUD shell、金币面板、时间面板、星级进度、暂停按钮 |
| 顾客 | 左侧 current 顾客体积大、正面饱满、表情有张力，手扒柜台；右侧等待顾客明显不同角色 | 两个顾客几乎同款，体积偏小 / 偏扁，姿态弱；body / hands 分离像后贴前景爪子，手腕和身体连接不自然；current/waiting 主要靠高亮和气泡 | P0 重新做 teal current 与 purple hoodie waiting 的原生分层 body + hands，按目标图体积、头身比例、表情、扒柜台姿态、手身连接和柜台接触关系做 |
| 订单 / READY | 当前订单气泡巨大、厚描边、奶油底、金色外光；槽位有实体感；READY 是强按钮级主焦点 | 气泡小、薄、扁，slot 像临时 UI；READY 像小标签，不像目标图中心交付入口 | P0 重做 current bubble、waiting bubble、slot、check、READY capsule、missing question |
| 商品卡 | 深紫容器内 2x3 大卡，圆角、奶油底、厚描边，商品 icon 很大；库存小而清楚 | 商品卡像工程列表，文字、标签、库存抢空间；390 下拥挤，商品 icon 主角感不足 | P0 重做商品卡底板、选中光、热食角标、库存底牌，商品名降权 |
| 设备 / 工作台 | 微波炉、收银机、台面、小道具同一光源和厚描边体系；设备大、稳、可读 | 设备能读，但体积、描边、色光不统一；台面过空、层次弱 | P1 但必须入整屏规格：微波炉 / 收银机同光源重修，台面中景和前景遮挡贴目标图 |
| 背景 / 色光 | 明亮便利店，背景柔焦、蓝天窗、暖光、货架丰富但不抢前景 | 背景方向接近但整体平，前景和背景融合弱，资源不像同一张图拆出 | 暂不最高优先，但新 HUD / 顾客 / 设备必须按目标图色光统一 |
| 布局密度 | HUD、顾客订单、设备、商品区、底栏边界清楚，比例稳定 | 750 上中下割裂，390 像硬缩放后塞满 | P0 重新定目标图可游玩化布局比例；390 先给窄屏构图方案，再测误触 |

## 顾客 body / hands 分层失败补充

现有 `teal regular` body + hands v2 只能证明 runtime 支持“身体层 + 手部层”的技术路径，不能证明当前手身资源可作为 final 分层基础。

当前问题不是“还缺 purple hoodie”这么简单，而是现有 body / hands 拆分本身也不合格：

- 手部姿势没有目标图里“自然扒在柜台上”的受力和接触感，更像贴上去的前景爪子。
- body 与 hands 的造型衔接弱，手腕 / 下臂和身体结构不像同一张角色原画拆出来。
- body-only 在 waiting 或隐藏 hands 时容易显得残缺或姿态不完整。
- hands 层对柜台边缘、订单气泡、READY、设备的空间关系没有按目标图原生设计。
- 当前同一 teal 复用成左右顾客，会直接破坏目标图里 current 与 waiting 的角色差异。
- 现有拆分是“候选图后拆 / 接入验证拆法”，不是 final art 的原生分层设计。

因此，GPT-login 后续不能沿用当前 teal body/hands v2 做小修。必须重新生成或重绘原生分层角色：

- 从同一角色设计中同时产出 body 与 hands，而不是先有整身再临时切手。
- current teal 的 body/hands 要按目标图左侧服务姿态设计，手自然压在柜台前沿。
- waiting purple hoodie 要按目标图右侧等待姿态设计，不能继续用 teal 换色或复用。
- body 隐藏 hands 时必须仍是完整可看的等待角色；hands 显示时必须无漂浮、无断腕、无错位。
- 资源仍需同画布、同 anchor、同底线，但这只是接入底线，不是美术通过标准。

## GPT-login 美术 P0 生产优先级

当前 API 登录不生成图片。以下任务应在 GPT-login / imagegen 能力恢复后执行。

### 1. HUD v2 整壳包

目标：第一眼像目标图顶部 UI。

必须包含：

- `hud_top_bar_shell_v2.png`
- `hud_panel_coin_v2.png`
- `hud_panel_timer_v2.png`
- `hud_panel_goal_v2.png`
- `hud_pause_button_v2.png`
- `hud_icon_coin_v2.png`
- `hud_icon_clock_v2.png`
- `hud_icon_star_v2.png`

禁止烘焙：金额、倒计时、星级数量、进度长度。

### 2. 当前订单 + READY final 包

目标：当前订单区域成为目标图同级主焦点。

必须包含：

- `order_bubble_current_base_no_slots_v3.png`
- `order_bubble_waiting_base_no_slots_v4.png`
- `order_slot_empty_v1.png`
- `order_slot_filled_overlay_v3.png`
- `order_check_v3.png`
- `order_ready_capsule_empty_v2.png`
- `order_missing_question_v1.png`

禁止烘焙：商品、READY 文字、动态勾选状态。

### 3. 顾客 body + hands final 首批

目标：当前 teal 和等待 purple 一眼接近目标图，不再用两个 teal 替代。

必须包含：

- teal current 风格 body / hands。
- purple hoodie waiting 风格 body / hands。
- 至少 neutral；若时间允许再补 impatient / happy。

规格：同画布、同 anchor、同底线；body 不含压台手；hands 不含柜台。

### 4. 商品卡 final 分层包

目标：商品区像目标图大卡片，不像工程格子。

必须包含：

- `product_card_base_v2.png`
- `product_card_selected_glow_v2.png`
- `product_card_badge_heat_overlay_v2.png`
- `product_card_stock_badge_v1.png`
- `product_card_disabled_overlay_v1.png`

禁止烘焙：商品名、库存数字、售罄文字。

## API-login Dev/Test 降级口径

当前不继续把热食自然流或 390 误触当 P0。

Dev/Test verdict：

- 工程侧已经证明 probe 资源能接入、关键点击路径短窗口成立、`qaInteractive=1` 可支撑后续交互验证。
- 当前最大阻塞是视觉一眼不像目标图，所以 Dev/Test 降级为接入约束和后续验收支持。

保留任务：

- 等新 final art 候选回来后做最小接入。
- 保留 `probeState` 和 `qaInteractive` 作为 QA 工具，但发布前必须 gated 或移除。
- 接入时要求动态文本 runtime 绘制。
- 气泡、HUD、商品卡需要 9-slice inset；工程不得猜。
- 顾客 body / hands 必须同尺寸同 pivot，禁止 auto-trim。
- 设备三态必须同尺寸同 anchor。

GPT-login 资源硬规格：

- 所有 final art 先放 `assets/ui/final-candidates/**`，不要直接覆盖 `assets/resources/**`。
- PNG 必须是 RGBA / transparent background，不要白底、脏边、半透明残边。
- 每批资源必须带目标图同屏对照和 contact sheet，否则 Dev/Test 只能判接入可行，不能判 target-pass。
- 顾客每个状态至少成对交付 `neutral / impatient / happy` 的 body + hands。
- 订单气泡必须交付无槽底板；槽位、完成 overlay、check、缺失问号、READY 空胶囊必须独立资源。
- 微波炉 `idle / heating / ready` 必须同尺寸、同 pivot、同设备外轮廓，切换不能跳。
- 收银机 `idle / pay` 不烘焙金额数字，付款 sparkle 可以独立或 runtime 动效。

禁止动作：

- 不要继续用代码微调现有候选资源追目标图。
- 不要用 runtime 色块、文字、遮罩去补 final art。
- 不要用 probe 资源通过状态机测试来证明画面通过。
- 不要为了实现方便移动 READY、订单气泡、商品区、顾客位置。
- 不要把 placeholder 调参成 final。

## 下一步

1. 主线程更新任务板：P0 改为视觉一比一还原失败 -> GPT-login final art 重做。
2. GPT-login Art/UI 能力恢复后，先产 HUD v2 整壳包和订单 / READY final 包。
3. API-login 暂停新增工程 QA，保留接入验证能力等待新资源。
