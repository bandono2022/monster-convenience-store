# Runtime Figma Stretch / Layer Review - 2026-07-02

目标：整理当前 runtime 预览仍然拉伸、层级不贴合的问题，形成下一轮最小修复 brief。本文只做专业会审和任务边界，不改代码、不生成图片、不移动资源。

权威目标仍为：

- `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`
- Figma placement frames:
  - `PLACEMENT_CANVAS__390x844 01` / node `98:61`
  - `PLACEMENT_CANVAS__390x844 02` / node `100:372`

## Owner / Brief / Review / Record

- Owner：Art/UI 负责判断目标图 fidelity、层级、比例和裁切语义；Development/testing 负责 runtime 还原路径、截图 QA 和触控安全；Product 负责玩家是否仍能一眼读懂当前顾客、订单、READY、商品与设备。
- Brief：用户指出当前预览仍有蓝色顾客拉长、手不在柜台上、柜台和设备比例不对、收银机偏宽、商品图铺满底板、底部 icon 大小和距离不对。本轮只整理原因和下一步最小方案。
- Review：Coordination 已读取 Figma metadata / design context、normalized manifest、本地资源尺寸、runtime 截图和用户预览尺寸；结论需由 Art/UI 与 Development/testing 在下一轮实现前共同采用。
- Record：本文、`docs/LOCAL_TASK_BOARD.md`。

## Current Evidence

截图与对照：

- Figma QA 01：`manual-figma-export-2026-07-02-normalized/qa/qa_placement_canvas_390x844_01.png`，`390x844`
- Figma QA 02：`manual-figma-export-2026-07-02-normalized/qa/qa_placement_canvas_390x844_02.png`，`390x844`
- Runtime QA 01：`output/runtime-qa-2026-07-02/runtime_390x844_left_ready_2026_07_02.png`，`390x844`
- Runtime QA 02：`output/runtime-qa-2026-07-02/runtime_390x844_right_selected_2026_07_02.png`，`390x844`
- 用户预览截图：聊天附件，实测 `390x830`；需要下一轮固定为 `390x844` 再做最终像素比对。

Figma 关键节点：

| Area | Figma rect / behavior | Runtime risk |
| --- | --- | --- |
| Blue customer body | `25,168,161,178`，image fill `FILL` | 本地 body 宽高比接近，不应通过反向变形修美术；主要检查 source 映射和层级。 |
| Left hands | `23,292,42,39.12`、`145,292,42.33,39`，image fill `FILL` | 当前手在 runtime 层级中过早绘制，后续柜台/设备可能压住手。 |
| Counter foreground | `-143,308,676,158`，image fill `FILL` | 本地 normalized 图 `780x316`，直接拉进 `676x158` 会把宽高比从约 `2.47` 拉到约 `4.28`，这是柜台变扁/变宽主因。 |
| Counter worktop | `-120,422,630,124`，image fill `FILL` | 本地 `780x248`，直接拉进 `630x124` 同样改变比例。 |
| Cashier | `187,333.1206,244,160`，image fill `FILL` | 本地 `835x548` 和目标框宽高比接近；偏宽感更可能来自源图透明边界、裁切或和柜台比例联动。 |
| Microwave | `0,368.1206,187,123`，image fill `FILL` | 本地 `640x420` 和目标框宽高比接近；优先检查是否被柜台层级和 worktop 比例影响。 |
| Product icons | `80x80`，部分为 `FILL`，pudding/candy 为 `CROP` | 不能全部按 `80x80` 直接拉伸；pudding 约 `94.3%` 缩放，candy 约 `117.65%` 放大裁切。 |
| HUD small icons | coin/clock/pause 为 `CROP` with imageTransform | 不能简单把 60/72/128 PNG 缩到外框；需要 crop/offset 或重新导 placed slice。 |
| READY badge | Figma empty capsule uses `CROP` + text；normalized 当前是 baked READY | 当前 baked READY 不得再叠文字。若未来改 empty capsule，必须按 Figma crop/text 语义接入。 |
| Bottom nav icons | Figma `62x62` at x `16/90/164/238/312`, y `770` | 本地 124x124 半尺寸逻辑成立；用户预览为 `390x830`，底部口径需先统一到 `390x844`。 |

## Root Cause

当前接入已完成一部分坐标还原，但还没有完整还原 Figma 图片填充语义。

Development/testing 诊断：

- `addFigmaArtwork()` 当前把 `SpriteFrame` 设为 `Sprite.SizeMode.CUSTOM`，再把节点强制设为 Figma 外框宽高。
- 这等同于“把原图拉伸到外框”，没有表达 Figma 的 `FILL`、`CROP`、内部 `imageTransform`、overflow mask。
- 因此会出现“坐标像了，但商品、柜台、HUD 小图标和 READY 胶囊质感不像”的问题。

Art/UI 诊断：

- 柜台、worktop、产品 icon、HUD 小图标属于视觉比例敏感层，不允许继续手调外框来掩盖拉伸。
- 手部“不在柜台上”首先是层级问题：Figma 中手应该压在柜台前沿关系上，runtime 需要按视觉层级重排。
- 收银机和微波炉暂不判定为资源失败；先修柜台比例和 layer order，再复核设备观感。

Product 诊断：

- 当前问题会削弱玩家对“顾客在柜台前等待、商品可点击、设备在操作台上”的空间理解。
- 不允许为了工程方便改变 Figma 目标图布局、商品大小、顾客站位或底部入口顺序。

## Do Not Continue

- 不要继续逐项手调 x/y/w/h 来抵消拉伸。
- 不要把所有 PNG 统一按外框 `CUSTOM` 拉伸。
- 不要给 baked `order_ready_badge_baked_ready.png` 额外叠 READY 文本。
- 不要为了修手部位置改顾客 body 美术比例。
- 不要在 `390x830` 预览上做最终验收；最终视觉 QA 固定 `390x844`。

## Next Minimal Development Brief

下一轮如果用户批准进入实现，Development/testing 只做一个最小修复 round：

1. 新增或改造一个最小图片放置 helper，支持至少三种策略：
   - `stretch`：只给纯 shape-like、已确认可拉伸的层使用。
   - `figma-fill`：按 Figma `FILL` 语义 cover 裁切，保留视觉比例。
   - `figma-crop`：按已读到的 `imageTransform` scale/offset 还原。
2. 首批只接入高影响节点：
   - product icons：snack/lemon/rice/pudding/chocolate/candy，其中 pudding/candy 必须按 crop 参数处理。
   - HUD coin/clock/pause icon：按 crop 参数处理。
   - counter foreground / worktop：先禁止直接非等比拉伸；采用 Figma fill/crop 或改用 placed-slice 策略。
3. 调整视觉层级顺序：
   - background
   - customer body + face
   - order bubbles
   - counter/worktop relation
   - active hands at the Figma visual layer
   - equipment
   - product panel/cards/nav/HUD
   具体层级需以 Figma 截图为准，修后以手是否自然压在柜台边缘为验收点。
4. 固定截图 QA：
   - `390x844` left selected/READY vs QA 01
   - `390x844` right selected vs QA 02
   - 必要时再做 `750x1334` 适配截图
5. 保持触控路径不变：
   - 商品卡
   - 顾客切换 / 订单气泡
   - 微波炉
   - 收银机反馈
   - 底部五入口

## Asset Pipeline Alternative

如果 Cocos 内实现 Figma crop/fill 过重，则 Art/UI 和 Development/testing 可改用更懒、更稳的方案：

- 从 Figma 导出 runtime-ready placed slices，特别是柜台前沿、worktop、HUD 小图标、READY capsule、product icon placed variants。
- runtime 只按 `390x844` 坐标 1:1 放置这些已裁切切片。
- 该方案必须保持可交互层分离：点击热区、动态数字、倒计时、库存、READY 状态仍由 runtime 控制。

## Acceptance For Next Code Round

下一轮不能只说“看起来好了”，必须用证据收口：

- TypeScript check 或等效 Cocos build/import 检查通过。
- 截图文件落到 `output/runtime-qa-2026-07-02/` 或新日期目录。
- 聊天报告必须包含：
  - 修复前/后的关键区域：商品、柜台/手、设备、底部 nav。
  - 哪些节点用了 `fill/crop`，哪些仍允许 `stretch`。
  - 若字体仍缺 Baloo 2，则记录为 text fidelity blocker，不把默认字体当 pass。

## Implementation Round Result - 2026-07-02

Owner / Brief / Review / Record：

- Owner：Development/testing 负责最小代码修复、构建、截图和触控冒烟；Art/UI 负责按 Figma QA 图复核柜台 / 设备 / 商品 / nav fidelity；Product 负责确认可玩触控和信息层级不被破坏。
- Brief：用户追加指出柜台和设备台也要修。本轮目标是修 runtime 中的拉伸、层级下缘、设备比例和商品图标铺满问题，不生成新美术、不改原始导出资源。
- Review：对比 Figma QA 01/02、Figma metadata、runtime 截图和关键区域 MAE；触控冒烟覆盖订单、商品、微波炉、收银机、底部五入口。
- Record：本文、`docs/LOCAL_TASK_BOARD.md`、`assets/scripts/presentation/MonsterStorePrototype.ts`。

代码结论：

- `addFigmaArtwork()` 的 `stretch` 分支显式设置 `sprite.trim = false`，避免 Cocos auto-trim 后把带透明边的 placed PNG 放大。
- `fill/crop` 分支仍保留，但按 `frame.rect` 计算实际 sprite 内容比例；目前仅订单小商品等需要裁切语义的节点使用。
- 主商品卡 icon 改用 Figma placed 外框放置，不再 cover 填满卡片底板。
- 柜台、worktop、微波炉、收银机改为 placed PNG 外框放置；不再用 cover fill 裁切。
- 底部 panel 在柜台 / 设备之后重画，并补 `y=528` 顶部暗线与 `y=538` 商品面板阴影，遮住柜台下缘溢出。
- active hands 保持在柜台 / 设备与底部 panel 之后绘制，使当前顾客手部自然压到柜台关系上。

截图与验证：

- Left runtime：`output/runtime-qa-2026-07-02/runtime_390x844_left_ready_final_placement_fix_2026_07_02.png`
- Right runtime：`output/runtime-qa-2026-07-02/runtime_390x844_right_selected_final_placement_fix_2026_07_02.png`
- Cocos build log：`temp/builder/log/web-mobile7-2-2026 17-15.log`，末尾为 `build Task (web-mobile) Finished in (7 s)ms`；CLI 仍返回历史噪音码 `36`。
- TypeScript：`tsc --noEmit --project tsconfig.json --skipLibCheck --lib ES2017,DOM` 通过。
- 触控冒烟：订单、微波炉、收银机、商品卡、底部五入口均可点击，无 JS pageerror。

关键 MAE 对比（越低越接近 QA）：

| Area | Before | Final |
| --- | ---: | ---: |
| left / whole | 未记录 | `5.14` |
| left / counter_equipment | `30.57` | `3.59` |
| left / counter_lower_edge | `72.04` | `1.79` |
| left / cashier | `20.14` | `3.78` |
| left / microwave | `5.84` | `5.00` |
| left / customers | `31.95` | `3.92` |
| left / products | `5.99` | `6.69` |
| left / nav | `31.50` | `0.70` |
| right / whole | 未记录 | `6.01` |
| right / counter_equipment | 未记录 | `3.72` |
| right / counter_lower_edge | 未记录 | `1.80` |
| right / customers | 未记录 | `6.65` |
| right / products | 未记录 | `6.68` |
| right / nav | 未记录 | `0.70` |

Review 结论：

- Development/testing：`pass for this round`。构建、截图、触控冒烟通过；柜台 / 设备 / nav / 顾客拉伸问题已显著收敛。
- Art/UI：`conditional pass / still not final acceptance`。柜台与设备比例已接近 QA；剩余差异集中在字体 fidelity、部分商品库存数字与具体视觉 polish。
- Product：`pass for playable probe`。当前顾客、订单、商品、设备和底部入口均保持可读且可点击。

剩余 blocker：

- Baloo 2 字体仍未接入；不能把默认字体当作最终 typography pass。
- 视觉最终验收仍需用户 / Art/UI 对最新两张 runtime 截图确认。

## Order Bubble Icon Scale Fix - 2026-07-02

Owner / Brief / Review / Record：

- Owner：Development/testing 负责最小 runtime 修复、构建、截图和触控冒烟；Art/UI 负责订单气泡商品比例复核；Product 负责订单信息可读性复核。
- Brief：用户指出最新截图里订单气泡内部分商品 icon 仍有拉伸。本轮只修订单气泡商品 icon 的放置语义，不生成新美术、不改 Figma 导出资源、不继续调整柜台 / 设备坐标。
- Review：对比 QA 01/02、上一轮 runtime 截图和本轮 390x844 runtime 截图；重点检查订单气泡 40x40 icon slot。
- Record：本文、`docs/LOCAL_TASK_BOARD.md`、`assets/scripts/presentation/MonsterStorePrototype.ts`。

本轮改动：

- `renderFinalOrders()` 中 `FinalOrderProduct-*` 调用 `addFigmaProductSprite(..., true)`。
- 订单气泡 icon 与主商品卡 icon 共用 placed PNG 等比放置，不再走 fill/crop 铺满槽位。
- READY baked badge、勾选图层、slot 底板、柜台 / 设备 / nav 坐标均未改动。

验证：

- Cocos `web-mobile` build 日志：`temp/builder/log/web-mobile7-2-2026 17-32.log`，末尾显示 `build Task (web-mobile) Finished in (6 s)ms`；CLI 仍返回历史噪音码 `36`。
- TypeScript CLI：当前会话 `tsc` 不在 PATH，`npx tsc` 命中占位包提示，记录为工具不可用；以 Cocos build 作为本轮等效构建检查。
- Runtime 截图：
  - `output/runtime-qa-2026-07-02/runtime_390x844_left_ready_order_icon_scale_fix_2026_07_02.png`
  - `output/runtime-qa-2026-07-02/runtime_390x844_right_selected_order_icon_scale_fix_2026_07_02.png`
  - `output/runtime-qa-2026-07-02/order_icon_scale_fix_review_2026_07_02.png`
- 订单 icon slot MAE：
  - left average：`19.84 -> 13.85`
  - right average：`20.15 -> 12.31`
- 触控冒烟：左 / 右订单气泡、微波炉、收银机、三张商品卡、底部五入口均可点击；浏览器 console error 为 `0`。

Review 结论：

- Development/testing：`pass for this round`。订单气泡商品 icon 拉伸漏口已关闭，构建和触控冒烟通过。
- Art/UI：`conditional pass`。snack / drink / rice-ball 在订单气泡内已恢复各自比例；仍需用户对整屏商业质量做最终视觉确认。
- Product：`pass for playable probe`。订单槽位、READY、勾选状态和商品识别没有被破坏。

剩余 blocker：

- Baloo 2 字体仍未接入；字体 fidelity 不能最终通过。
