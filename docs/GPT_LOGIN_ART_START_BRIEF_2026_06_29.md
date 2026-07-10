# GPT 登录美术开工 Brief 2026-06-29

权威目标图：`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

先读：

- `AGENTS.md`
- `docs/LOCAL_TASK_BOARD.md`
- `docs/VISUAL_TARGET_MATCH_FAILURE_REVIEW_2026_06_29.md`
- `docs/NEXT_ART_PRODUCTION_BRIEF.md`

## 当前总目标

把目标图 `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png` 一比一还原成可游玩的 runtime 页面。

当前 runtime verdict：

```text
visual-fail / not-target-match
```

现有资源能接入代码，只证明工程路径成立，不证明画面通过。下一阶段 GPT 登录团队的核心任务是产出 final art 候选，不是继续证明 probe 资源能跑。

## 问题归因边界

### 1. 顾客被拉伸

归因：主要是代码接入问题。

当前 probe 顾客是 `1024x1024` 画布，Cocos auto trim 后有效 body 比例约 `956x871`。代码仍按旧临时资源比例把 body 画成约 `324.9x402.3`，会把角色压窄拉高。

美术团队不要为这个问题反向画一个变形角色。后续 API / Dev/Test 应修为等比显示、按同画布 pivot 接入、禁止 auto-trim 或明确用 raw canvas 对齐。

但注意：拉伸不是美术问题，不代表顾客美术通过。顾客的手身分离、体积、表情、扒柜台姿态和目标图相似度仍然是 P0 美术问题。

### 2. 顾客 body / hands 分离失败

归因：美术资源问题。

现有 `teal regular body + hands v2` 只证明 runtime 支持身体层和手部层，不是 final 基础。

失败点：

- hands 像后贴前景爪子，不像自然扒在柜台上。
- 手腕 / 下臂和 body 连接弱，不像同一张角色原画原生拆层。
- body-only 隐藏 hands 时容易残缺。
- hands 没有原生处理柜台接触、遮挡、READY、订单气泡空间关系。
- 同一 teal 复用左右顾客会破坏目标图 current / waiting 角色差异。

结论：不要沿用 teal v2 小修。必须重新做原生分层角色。

### 3. 订单气泡不规则、内部黑边

归因：资源规格和代码接入共同问题。

代码问题：

- runtime 强制 `Sprite.Type.SLICED`。
- 代码用统一猜测的 9-slice inset。
- 内部商品槽当前由程序矩形和粗描边绘制，会制造黑边和工程感。

资源问题：

- 当前 probe 气泡不是 final 级干净 `no-slots 9-slice` 底板。
- PNG 本身有深色描边 / 阴影 / 不规则边缘。
- `.meta` 没有可靠 9-slice border。

结论：订单气泡需要重新出干净 final 分层包；后续 API / Dev/Test 按明确 inset 接入，不能再让代码猜。

## GPT 登录本轮优先级

### P0-1：顾客原生 body + hands 首批

Owner：Art/UI

Review：Product 复核目标图 current / waiting 角色差异；Development/testing 复核尺寸、pivot、透明边和接入规格。

先做：

- `teal current` neutral body + hands。
- `purple hoodie waiting` neutral body + hands。

通过后再扩：

- `neutral`
- `impatient`
- `happy`

验收：

- 同角色 body / hands 来自同一原生设计，不是后拆补丁。
- body 和 hands 同画布、同 anchor、同底线，建议 `1024x1024 RGBA`。
- body 不含压台手掌；hands 不含柜台边缘。
- body-only 必须仍是完整角色。
- hands 显示时必须自然连接手腕 / 下臂并压在柜台上。
- current teal 与 waiting purple hoodie 必须一眼不同。
- 不要用当前 teal v2 小修冒充 final。

输出目录：

`assets/ui/final-candidates/gameplay-customers-final-v1/`

### P0-2：订单 + READY final 分层包

Owner：Art/UI

Review：Product 复核 READY 作为交付主入口；Development/testing 复核 9-slice inset 和动态内容边界。

必须产出：

- `order_bubble_current_base_no_slots_v3.png`
- `order_bubble_waiting_base_no_slots_v4.png`
- `order_slot_empty_v1.png`
- `order_slot_filled_overlay_v3.png`
- `order_check_v3.png`
- `order_ready_capsule_empty_v2.png`
- `order_missing_question_v1.png`

禁止烘焙：

- 商品图标
- READY 文字
- 动态勾选状态
- 库存 / 金额 / 数字

验收：

- 气泡底板必须干净、规则、无内部黑边、无槽位烘焙。
- current / waiting 两种气泡层级明显。
- READY capsule 是强按钮级主焦点，形状、厚度、描边接近目标图。
- 必须提供 9-slice inset 建议，不能让开发猜。

输出目录：

`assets/ui/final-candidates/gameplay-order-ready-final-v1/`

### P0-3：HUD v2 整壳包

Owner：Art/UI

Review：Product 复核金币、时间、星级 / 目标语义；Development/testing 复核动态文字和 9-slice。

目标：第一眼像目标图顶部深紫商业 HUD。

必须包含：

- `hud_top_bar_shell_v2.png`
- `hud_panel_coin_v2.png`
- `hud_panel_timer_v2.png`
- `hud_panel_goal_v2.png`
- `hud_pause_button_v2.png`
- `hud_icon_coin_v2.png`
- `hud_icon_clock_v2.png`
- `hud_icon_star_v2.png`

禁止烘焙：

- 金额
- 倒计时
- 星级数量
- 进度长度

输出目录：

`assets/ui/final-candidates/gameplay-hud-final-v2/`

### P0-4：商品卡 final 分层包

Owner：Art/UI

Review：Product 复核商品区识别；Development/testing 复核动态库存和商品名边界。

必须包含：

- `product_card_base_v2.png`
- `product_card_selected_glow_v2.png`
- `product_card_badge_heat_overlay_v2.png`
- `product_card_stock_badge_v1.png`
- `product_card_disabled_overlay_v1.png`

禁止烘焙：

- 商品名
- 库存数字
- 售罄文字

输出目录：

`assets/ui/final-candidates/gameplay-product-card-final-v1/`

## 禁止方向

- 不要把顾客拉伸问题当成美术返工点；那是代码接入修正。
- 不要用反向变形的美术去适配现有代码。
- 不要沿用当前 teal body/hands v2 做小修。
- 不要把当前 probe 订单气泡当 final。
- 不要在订单气泡底板里烘焙商品槽、商品图标、READY 文字或动态状态。
- 不要用 runtime 色块、遮罩、文字覆盖去修 final art。
- 不要为了实现方便移动 READY、订单气泡、商品区、顾客位置。

## 每轮汇报格式

每轮必须在聊天里汇报：

```text
Owner:
Brief:
Review:
Record:
产出:
结论:
下一步:
```

每批资源必须带：

- 目标图同屏对照。
- contact sheet。
- 输出路径。
- 接入规格：画布尺寸、anchor / pivot、9-slice inset、禁止烘焙项。
