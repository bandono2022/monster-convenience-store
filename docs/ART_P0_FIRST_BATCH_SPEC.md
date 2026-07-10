# 第一批 final art 候选资源包

更新时间：2026-06-27

角色：主线程统筹 + 美术 / UI + 产品策划 + 开发 / 测试

状态：review

## 目标

本文件从旧的“P0 小修资源”升级为第一批 final art 候选包规格。

目标不是继续补临时 UI，而是用一批风格一致的候选资源验证整屏商业化方向：

```text
顾客订单 -> 商品准备 -> READY -> 交付 -> 收银反馈
```

仍然使用 Ponytail：第一批只做能验证整屏风格和核心链路的最小包，不一次性铺满所有最终资源。

## 统筹自检

本轮不是无用功，因为：

- 继续只审“差距在哪里”已经不会产生新结论。
- 继续修 READY baked 占位、加 QA bridge、加非冻结 QA 入口都会制造临时债。
- 产出第一批 final art 候选包，能直接决定后续是否进入资源替换验证。

本轮不做：

- 不拆、盖、重绘当前 baked READY 占位。
- 不新增运行时代码系统。
- 不把整张目标图或整区截图当正式资源接入。
- 不把“非 READY 区域”单独拆成孤立任务。

## 第一批资源

| 排名 | 文件名建议 | 用途 | 尺寸建议 | 格式 | 做法 |
| ---: | --- | --- | --- | --- | --- |
| 1 | `customer_active_body.png` / `customer_active_hands.png` | 当前顾客上半身、表情和柜台接触 | 420x520 / 320x180 | 透明 PNG | 候选出图 |
| 2 | `customer_waiting_body.png` | 次要顾客等待态 | 420x520 | 透明 PNG | 候选出图 |
| 3 | `order_bubble_current_9slice.png` | 当前顾客订单气泡底板 | 360x220 源图 | PNG 9-slice | 必须出图 |
| 4 | `order_bubble_waiting_9slice.png` | 非当前顾客订单气泡底板 | 320x200 源图 | PNG 9-slice | 必须出图 |
| 5 | `order_slot_filled_overlay.png` / `order_check.png` | 已填槽高亮与完成勾 | 80x80 / 44x44 | 透明 PNG | 必须出图 |
| 6 | `order_ready_badge_9slice.png` / `order_ready_glow.png` | READY 胶囊与呼吸光 | 168x54 / 380x240 | PNG 9-slice + 透明 PNG | 候选出图，当前 runtime 占位先不动 |
| 7 | `product_card_base_9slice.png` / `product_card_needed_glow.png` | 商品卡底板与需要态 | 304x376 | PNG 9-slice + 透明 PNG | 必须出图 |
| 8 | `product_badge_heat.png` | 热食角标 | 72x72 | 透明 PNG | 必须出图 |
| 9 | `product_icons_first_six.png` 或 6 张独立 PNG | 6 个首批商品统一风格 icon | 每个 128x128 | 透明 PNG | 候选出图 |
| 10 | `microwave_idle.png` / `microwave_heating.png` / `microwave_ready.png` | 微波炉三态 | 每态 260x190 | 透明 PNG | 必须出图 |
| 11 | `cash_register_idle.png` / `cash_register_pay.png` / `cash_coin_particle.png` | 收银机与付款反馈 | 280x220 / 48x48 | 透明 PNG | 候选出图 |
| 12 | `counter_foreground.png` / `store_bg_playfield.png` | 柜台前景与店铺背景候选 | 750x260 / 750x1334 | 透明 PNG + 背景 PNG | 候选出图，先用于整屏风格验证 |

## 状态拆分

### 订单气泡

| 状态 | 最小表现 |
| --- | --- |
| missing | 底板 + 空槽，空槽可程序绘制 |
| partial | 已填槽叠 `order_slot_filled_overlay.png` |
| ready | 底板 + filled overlay + `order_ready_badge_9slice.png` + glow |
| error | 对应槽叠 `order_slot_error_overlay.png`，气泡 shake |
| done | READY badge 消失，短暂 DONE 动态 Label 即可 |

### READY badge

- normal：绿色/青绿色胶囊。
- pulse：程序 tween 缩放和透明度。
- pressed：可先不出图，点击后直接进入 done。
- 当前 runtime 的 `ready_badge_compact.png` 是 baked 占位，继续冻结；本包产出的是后续统一替换候选。

### 商品卡

| 状态 | 最小表现 |
| --- | --- |
| normal | `product_card_base_9slice.png` + 商品 icon + 动态库存 |
| needed | 叠 `product_card_needed_glow.png` 或程序描边 |
| heat | 叠 `product_badge_heat.png` |
| soldout | 叠 `product_overlay_soldout.png` + 动态“售罄” |
| wrong | 程序红闪 + shake，不单独出图 |

### 微波炉

- `microwave_idle.png`：空炉。
- `microwave_heating.png`：炉内发光，进度条程序绘制。
- `microwave_ready.png`：完成灯 / 蒸汽，READY 文案动态 Label。

## 程序绘制优先

- 空订单槽。
- 进度条。
- 库存数字。
- READY / DONE / 售罄文字。
- 错误红闪。
- 点击缩放、shake、呼吸光动画。

## 必须出图

- 当前顾客 body / hands。
- 次要顾客等待态 body。
- 订单气泡底板。
- READY 胶囊底和 glow 候选。
- 商品卡底板和需要态。
- 6 个首批商品 icon 候选。
- 热食角标。
- 微波炉三态。
- 收银机 idle / pay 候选。
- 柜台前景候选。

## 可先候选，不立刻接入

- 店铺背景。
- 底部 dock / navigation。
- 高级粒子。
- 顾客全套所有情绪。
- Spine / DragonBones。

## 接入验收

- 390x844 下 READY badge 可读。
- 390x844 下订单槽不低于 44px 可读高度。
- 商品库存数字不被 needed glow、heat badge、soldout overlay 遮挡。
- 微波炉 idle/heating/ready 三态不用读文字也能区分。
- 点击目标仍由动态节点承担，不把整区截图当按钮。

## imagegen / 生成工具要求

- 美术/UI 可以使用 `imagegen` 或等效工具产出 bitmap 候选。
- 生成必须围绕目标图风格：厚描边、高饱和、圆润可爱、便利店空间感、清晰移动端可读性。
- 候选资源先放入 final-candidate 目录，不直接覆盖 runtime 资源。
- 若需要付费服务、外部授权、特殊动效工具或模型权限，先告知用户。
- 文案、库存、倒计时、收入、订单内容不要烘焙进图片。

## 第一批生成提示词

共同风格约束：

```text
Use case: stylized-concept
Asset type: mobile game final art candidate for a cute monster convenience-store time-management game
Style/medium: polished 2D mobile game illustration, thick clean outlines, rounded shapes, high-saturation cheerful colors, soft cel shading, commercial casual-game quality
Composition/framing: clean silhouette, readable at small mobile UI size, generous transparent padding for runtime placement
Constraints: no logos, no watermark, no extra text, no numbers, no baked inventory, no baked timer, no baked revenue, no background unless requested
Avoid: realistic photo style, dark horror style, thin line art, muddy colors, tiny unreadable details
```

### 顾客候选

```text
Primary request: two friendly red one-eyed monster customers for a cute convenience-store counter scene
Subject: active customer with visible upper body and separate hands resting on the counter; secondary waiting customer with matching scale but calmer pose
Scene/backdrop: no background, transparent-friendly cutout composition
Style/medium: polished 2D mobile game character art, thick outline, cute commercial casual-game style
Constraints: active and waiting customer must share the same art style and body scale; hands must work as separate overlay assets; no text; no watermark
Output assets: customer_active_body.png, customer_active_hands.png, customer_waiting_body.png
```

### 订单气泡与 READY 候选

```text
Primary request: speech-bubble order UI for a mobile game customer order, current and waiting states
Subject: rounded cream order bubble with bold colored outline, tail pointing to customer, item slots, filled-state check mark, READY badge base, soft ready glow
Style/medium: polished 2D game UI, thick outline, cute convenience-store theme
Constraints: no baked product icons, no baked words except if separately generating READY badge; keep item slots empty and reusable; transparent background; no watermark
Output assets: order_bubble_current_9slice.png, order_bubble_waiting_9slice.png, order_slot_filled_overlay.png, order_check.png, order_ready_badge_9slice.png, order_ready_glow.png
```

### 商品卡与商品 icon 候选

```text
Primary request: reusable product card UI and six cute convenience-store product icons
Subject: rounded product card base with cream interior, bold dark outline, inventory pill area, needed-state glow overlay, heat badge; separate icons for rice ball, monster chips bag, lemon drink, strawberry milk carton, pudding cup, star candy
Style/medium: polished 2D mobile game UI and item icons, unified thick-outline cute style
Constraints: product card must not include item art, item name, inventory number, price, or text; product icons must have transparent-friendly cutout composition; no watermark
Output assets: product_card_base_9slice.png, product_card_needed_glow.png, product_badge_heat.png, product_rice_ball.png, product_snack_bag.png, product_lemon_drink.png, product_strawberry_milk.png, product_pudding_cup.png, product_star_candy.png
```

### 工作台、收银与背景候选

```text
Primary request: convenience-store workstation assets for a cute monster shop mobile game
Subject: microwave in idle, heating, and ready states; cash register idle and payment states; counter foreground; warm store background with shelves and soft depth
Style/medium: polished 2D casual-game environment props, thick outlines, rounded toy-like shapes, consistent perspective and color palette
Constraints: no readable text, no baked numbers, no logos, no watermark; equipment and counter foreground should be transparent-friendly cutouts; background is a separate full-screen playfield candidate
Output assets: microwave_idle.png, microwave_heating.png, microwave_ready.png, cash_register_idle.png, cash_register_pay.png, cash_coin_particle.png, counter_foreground.png, store_bg_playfield.png
```

## 开发接入边界

- 开发/测试在资源候选到位前不改代码。
- 接入时优先保持现有节点名、触摸路径和玩法状态机不变。
- 只做加载路径、尺寸常量、九宫格 inset 和必要截图验证。
- 每批接入后验 `750x1334` 与 `390x844`，并手点 READY、商品卡、微波炉、收银反馈。
