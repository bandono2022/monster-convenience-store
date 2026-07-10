# 当前可用美术资源清单

更新时间：2026-06-28

用途：线程 / 账号 / API 登录切换后，快速理解当前经营页哪些美术资源已经可用，哪些还只是候选，哪些不能用。

一屏缩略图检查页：

- `docs/USABLE_ART_ONE_SCREEN_CHECK.md`

权威目标图仍是：

- `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

团队决议：

- 所有资源判断都以还原权威目标图并将权威目标图可游玩化为目标。
- 资源局部更精致、工程更方便、或可以跑通 probe，不等于通过。
- 与权威目标图风格、比例、层级或可玩化结构不一致的候选，必须标记为 revise / failed，不得接入 runtime final。
- 新美术资源每批必须先配一张总览图 / QA contact sheet。用户、Art/UI、Product 先看总览图确认；未确认前，资源只能留在 `final-candidates`，不得上传 Figma 或接入 runtime。

候选资源目录：

- `assets/ui/final-candidates/gameplay-retry-v1/`
- `assets/ui/final-candidates/gameplay-customers-v1/`
- `assets/ui/final-candidates/gameplay-equipment-v1/`
- `assets/ui/final-candidates/gameplay-background-v1/`
- `assets/ui/final-candidates/gameplay-products-v2/`
- `assets/ui/final-candidates/gameplay-hud-v1/`

注意：

- 本清单里的资源仍是候选 / 最小接入评估资源，尚未复制到 `assets/resources/**`。
- 接入 runtime 前必须由开发/测试确认路径、Cocos meta、缩放、9-slice、触摸区域和 390x844 截图。
- 第一批旧坏图已移出项目目录，归档到 `/Users/ban/Documents/怪兽便利店-art-archive/art-deprecated-2026-06-28/`。
- `_sources/` 和 `_cutout_probe/` 暂时保留在候选目录里，用于记录生成来源和新抠图流程；它们不是 runtime 候选。

## 已可用：商品 Icon

这些商品图标已通过美术、产品、开发/测试复核，可进入最小接入评估。

| 资源 | 状态 | 备注 |
| --- | --- | --- |
| `products/product_rice_ball_v1.png` | pass | 饭团；已通过美术 / 产品 / 开发复核。 |
| `products/product_lemon_drink_v4.png` | pass | 柠檬饮料；由 flood-fill 新抠图流程转正。纸盒形态可用，订单槽和商品栏必须用同一图标。 |
| `products/product_snack_bag_v2.png` | pass | 零食袋；由 flood-fill 新抠图流程转正。 |
| `products/product_pudding_cup_v2.png` | pass | 布丁；由 flood-fill 新抠图流程转正。 |

QA：

- `_qa/products_formal_candidates_v2_contact_sheet.png`

## 已可用：商品补充

这些商品已通过美术/UI、产品和开发/测试复核，可进入最小接入评估。

| 资源 | 状态 | 备注 |
| --- | --- | --- |
| `products/product_strawberry_milk_v1.png` | pass | 草莓牛奶；商品卡和订单槽都清楚。 |
| `products/product_star_candy_v1.png` | pass | 星星糖；整袋图可用，不误读为 UI 星级 / 奖励图标。 |

QA：

- `assets/ui/final-candidates/gameplay-products-v2/_qa/products_v2_new_items_qa.png`
- `assets/ui/final-candidates/gameplay-products-v2/_qa/products_v2_six_item_comparison.png`

## 已可用：商品卡 UI

| 资源 | 状态 | 使用边界 |
| --- | --- | --- |
| `products/product_card_base_205x180_v3.png` | pass | 普通未选中商品卡底。不得用于订单槽或 READY。 |
| `products/product_card_attention_border_205x180_v2.png` | pass | 仅用于商品卡“可关注 / 可操作”。不得用于订单完成、READY、check 后完成态或收银成功态。 |

开发注意：

- 两张都是 205:180 比例，可按商品卡目标尺寸评估。
- `product_card_base_205x180_v3.png` 有 baked 底部区域，可能压商品名 / 库存，需要 Cocos 截图确认。
- `product_card_attention_border_205x180_v2.png` 可作为 `productCardSelectedFrame` 候选，但需确认 auto-trim 后 pivot / offset 不偏。

QA：

- `_qa/product_card_base_205x180_v3_qa.png`
- `_qa/product_card_attention_border_205x180_v2_qa.png`

## 已可用：订单气泡 / READY

| 资源 | 状态 | 使用边界 |
| --- | --- | --- |
| `order/order_bubble_current_base_no_slots_v2.png` | pass | 当前订单无槽底图。比旧 current bubble 更适合接入，因为不烘焙槽位。 |
| `order/order_bubble_waiting_9slice_v3.png` | pass | 等待订单气泡。产品 pass；开发可评估，但仍有烘焙 3 槽风险。 |
| `order/order_check_v2.png` | pass | 订单项完成勾。低风险，可评估。 |
| `order/order_ready_capsule_empty.png` | pass | READY 空胶囊。需要 runtime 单独绘制 READY 文本层。 |

开发注意：

- `order_bubble_current_base_no_slots_v2.png` 仍需 raw / trim 后 9-slice inset、目标尺寸、anchor/pivot、槽位中心点确认。
- 如果接入后 current 金边 / 高亮被削弱，可能和 waiting bubble v3 主次不明显。
- `order_bubble_waiting_9slice_v3.png` 有烘焙槽位，直接接入时注意不要和 runtime 动态槽位重影。

QA：

- `_qa/order_bubble_current_base_no_slots_v2_qa.png`
- `_qa/order_ready_batch_v2_contact_sheet.png`

## 可谨慎评估：槽位状态

| 资源 | 状态 | 风险 |
| --- | --- | --- |
| `order/order_slot_filled_overlay_v2.png` | art pass / product revise | 可能被误读成商品卡选中框。若接入，只能谨慎用于订单槽已填状态，不得用于商品卡。 |

## 已可用：顾客角色

这些顾客图已通过美术/UI 样式复核，可进入最小接入评估。当前顾客和等待顾客不分死角色，运行时应按服务对象切换复用不同顾客状态。

| 资源 | 状态 | 备注 |
| --- | --- | --- |
| `characters/customer_teal_regular_neutral.png` | pass | 青绿色常客，普通状态。 |
| `characters/customer_teal_regular_impatient.png` | pass | 青绿色常客，急躁状态。 |
| `characters/customer_teal_regular_happy.png` | pass | 青绿色常客，满意状态。 |
| `characters/customer_purple_hoodie_neutral_v2.png` | pass | 紫色连帽顾客，普通状态。 |
| `characters/customer_purple_hoodie_impatient_v3.png` | pass | 紫色连帽顾客，急躁状态。 |
| `characters/customer_purple_hoodie_happy_v2.png` | pass | 紫色连帽顾客，满意状态。 |
| `characters/customer_blue_shopper_neutral.png` | pass | 蓝色购物顾客，普通状态。 |
| `characters/customer_blue_shopper_impatient.png` | pass | 蓝色购物顾客，急躁状态。 |
| `characters/customer_blue_shopper_happy.png` | pass | 蓝色购物顾客，满意状态。 |

QA：

- `assets/ui/final-candidates/gameplay-customers-v1/_qa/gameplay_customers_v1_9state_contact_sheet.png`

## 已可用：柜台 / 设备

这些设备图已通过美术/UI 本轮复核，可进入产品和开发/测试的最小接入评估。

| 资源 | 状态 | 使用边界 |
| --- | --- | --- |
| `equipment/counter_foreground_v1.png` | art pass | 柜台前景遮挡层；不能挡住顾客脸、订单气泡、READY 或商品卡。 |
| `equipment/counter_worktop_midground_v1.png` | art pass | 工作台中景；用于托住微波炉、收银机和商品操作区。 |
| `equipment/microwave_idle_v1.png` | art pass | 微波炉空闲态；不能有 READY 或奖励语义。 |
| `equipment/microwave_heating_v1.png` | art pass | 微波炉加热态；不能像已完成或故障。 |
| `equipment/microwave_ready_v1.png` | art pass | 微波炉可取态；不能误读为订单 READY。 |
| `equipment/cashier_idle_v1.png` | art pass | 收银机空闲态；不是交付入口。 |
| `equipment/cashier_pay_v1.png` | art pass | 收银成功反馈态；不能烘焙金额或收入数字。 |

废弃：

- `equipment/counter_foreground_v1_revise_tall_wall.png`：太像红色高墙，抢画面并可能遮挡设备，不用于正式候选。

QA：

- `assets/ui/final-candidates/gameplay-equipment-v1/_qa/equipment_pack_contact_sheet.png`
- `assets/ui/final-candidates/gameplay-equipment-v1/_qa/equipment_overlay_390x844_check.png`

## 已可用：背景 / 光影

这些资源已通过美术/UI、产品和开发/测试复核，可进入最小接入评估。

| 资源 | 状态 | 使用边界 |
| --- | --- | --- |
| `background/store_background_clean_750x1334_v1.png` | pass | 750x1334 背景底图；不可含 UI、顾客、设备或动态状态。 |
| `background/back_shelves_v1.png` | pass | 750x1334 透明全画布货架层；不能像可点击商品货架。 |
| `background/window_sky_v1.png` | pass | 750x1334 透明全画布窗景层；只提供营业氛围。 |
| `background/soft_light_overlay_v1.png` | pass | 750x1334 透明柔光层；不能像金币、READY 或收银成功光。接入时透明度需可调。 |
| `background/current_customer_warm_halo_v1.png` | pass | 512x512 当前顾客聚焦 halo；独立跟随当前服务槽位，不绑定某个固定顾客。 |

QA：

- `assets/ui/final-candidates/gameplay-background-v1/_qa/background_layers_contact_sheet.png`
- `assets/ui/final-candidates/gameplay-background-v1/_qa/background_full_layer_composite_390x844.png`
- `assets/ui/final-candidates/gameplay-background-v1/_qa/background_with_customer_counter_390x844.png`
- `assets/ui/final-candidates/gameplay-background-v1/_qa/halo_customer_overlay_qa.png`

## 返修中：HUD

这些资源已通过美术/UI 和开发/测试复核，但产品复核要求返修目标/耐心语义，暂不进入可用候选池。

| 资源 | 状态 | 备注 |
| --- | --- | --- |
| `hud/hud_panel_coin_v1.png` | dev pass / product ok | 营业额/金币面板，数字 runtime。 |
| `hud/hud_panel_timer_v1.png` | dev pass / product ok | 倒计时面板，数字 runtime。 |
| `hud/hud_panel_reputation_v1.png` | revise | 当前目标语义像红心/生命，需要改成星级/目标。 |
| `hud/hud_icon_coin_v1.png` | dev pass / product ok | 金币 icon。 |
| `hud/hud_icon_clock_v1.png` | dev pass / product ok | 时间 icon。 |
| `hud/hud_icon_heart_v1.png` | revise | 不能同时承担顶部目标和耐心语义。 |
| `hud/hud_pause_button_v1.png` | dev pass / product ok | 暂停按钮，无文字。 |
| `hud/patience_bar_track_v1.png` | revise | 需要更贴近顾客局部，不像玩家生命槽。 |
| `hud/patience_bar_fill_v1.png` | revise | 需要更贴近顾客局部，不和顶部目标红心冲突。 |
| `hud/bottom_nav_slot_v1.png` | dev pass / product ok | 底部导航普通槽。 |
| `hud/bottom_nav_slot_active_v1.png` | dev pass / product ok | 底部导航选中槽。 |
| `hud/nav_clipboard_icon_v1.png` | dev pass / product ok | 底部入口 icon。 |
| `hud/nav_basket_icon_v1.png` | dev pass / product ok | 底部入口 icon。 |
| `hud/nav_fridge_icon_v1.png` | dev pass / product ok | 底部入口 icon。 |
| `hud/nav_upgrade_icon_v1.png` | dev pass / product note | 绿色较亮，实装时应低亮/禁用，避免营业中误点。 |
| `hud/nav_book_icon_v1.png` | dev pass / product ok | 底部入口 icon。 |

QA：

- `assets/ui/final-candidates/gameplay-hud-v1/_qa/hud_assets_white_dark_checker_contact_sheet.png`
- `assets/ui/final-candidates/gameplay-hud-v1/_qa/hud_top_composite_390x844.png`
- `assets/ui/final-candidates/gameplay-hud-v1/_qa/hud_bottom_nav_composite_390x844.png`
- `assets/ui/final-candidates/gameplay-hud-v1/_qa/hud_patience_customer_order_local_390x844.png`

## 新候选：READY 金币堆 / 顾客局部耐心条

状态：`candidate-produced / pending Art/UI + user review`

候选目录：

- `assets/ui/final-candidates/gameplay-ready-coin-patience-v1/`

候选资源：

- `feedback/coin_stack_small_2.png`
- `feedback/coin_stack_medium_4.png`
- `feedback/coin_stack_large_8.png`
- `feedback/coin_collect_spark.png`
- `patience/patience_track_local.png`
- `patience/patience_fill_green.png`
- `patience/patience_fill_yellow.png`
- `patience/patience_fill_red.png`

QA：

- `assets/ui/final-candidates/gameplay-ready-coin-patience-v1/_qa/ready_coin_patience_asset_contact_sheet.png`
- `assets/ui/final-candidates/gameplay-ready-coin-patience-v1/_qa/integration_preview_390x844.png`

注意：

- 这批资源只补当前 runtime 最明显的低保真绘制件：柜台金币堆和顾客局部耐心条。
- READY baked badge 继续冻结，未生成、未拆、未覆盖。
- 资源未接入 `assets/resources/ui_gameplay_final_v1/`，需要用户 / Art/UI 评审后再决定是否 runtime 接入。

## 新候选：订单槽状态 cue / 拖拽局部 cue

状态：`candidate-produced / pending Art/UI + user review`

候选目录：

- `assets/ui/final-candidates/gameplay-order-state-cues-v1/`

候选资源：

- `order/hot_required_flame_badge.png`
- `order/item_filled_check_badge.png`
- `order/heating_steam_cue.png`
- `order/microwave_ready_spark_cue.png`
- `drag/drop_target_valid_rim.png`
- `drag/drop_target_invalid_x.png`

QA：

- `assets/ui/final-candidates/gameplay-order-state-cues-v1/_qa/order_state_cues_asset_contact_sheet.png`
- `assets/ui/final-candidates/gameplay-order-state-cues-v1/_qa/integration_preview_order_state_cues_390x844.png`
- `assets/ui/final-candidates/gameplay-order-state-cues-v1/_qa/integration_preview_order_state_cues_ready_390x844.png`

注意：

- 这批资源只补订单槽 / 拖拽状态贴片，不替换商品 icon，不替换订单气泡。
- READY baked badge 继续冻结，未生成、未拆、未覆盖。
- 资源未接入 `assets/resources/ui_gameplay_final_v1/`，需要用户 / Art/UI 评审后再决定是否 runtime 接入。

## 新候选：收银成功反馈

状态：`candidate-produced / pending Art/UI + user review`

候选目录：

- `assets/ui/final-candidates/gameplay-payment-feedback-v1/`

候选资源：

- `payment/payment_burst_capsule_empty.png`
- `payment/payment_coin_token.png`
- `payment/payment_sparkle_cluster.png`
- `payment/cashier_success_glow.png`

QA：

- `assets/ui/final-candidates/gameplay-payment-feedback-v1/_qa/payment_feedback_asset_contact_sheet.png`
- `assets/ui/final-candidates/gameplay-payment-feedback-v1/_qa/integration_preview_payment_feedback_390x844.png`

注意：

- 这批资源修正旧 P0 收银反馈 baked amount 问题；单独 PNG 不含金额、加号或文字。
- 接入预览里的 `+25` 只是 runtime 动态文字示意，不属于资产。
- 资源未接入 `assets/resources/ui_gameplay_final_v1/`，需要用户 / Art/UI 评审后再决定是否 runtime 接入。

### 2026-06-30 HUD / Nav 生产前置更新

状态：`candidate-produced / user-confirmed-semantics / waiting-user-overview-review / art-dev-readable-review / product-thread-missing`

详细 brief：

- `docs/HUD_NAV_PRODUCTION_BRIEF_2026_06_30.md`

Product 推荐底部五入口：

| semantic id | 语义 | 图标方向 | 状态 |
| --- | --- | --- | --- |
| `nav_task` | 任务 / 订单记录 | 剪贴板 + 可选红色感叹号 | 用户已确认语义 |
| `nav_procurement` | 进货 / 采购篮 | 购物篮 | 用户已确认语义 |
| `nav_inventory` | 库存 / 货架管理 | 冰柜 / 货架 | 用户已确认语义 |
| `nav_upgrade` | 升级 | 绿色上箭头 | 用户已确认语义；QA 可做 active sample |
| `nav_catalog` | 图鉴 / 配方书 | 红色书册 | 用户已确认语义 |

顶部 HUD 语义：

- 营业中主数值仍按 `docs/PRODUCT_DECISIONS_V1.md` 显示本轮营业额 `currentShiftRevenue`，数字不烘焙。
- 倒计时文本和进度不烘焙。
- 星级目标 / 评价进度不烘焙 `x3` 或计数文本。
- 暂停按钮只做 icon-only。

可作为下一批候选的参考资源：

- `hud_icon_coin_v1.png`
- `hud_icon_clock_v1.png`
- `hud_pause_button_v1.png`
- `nav_clipboard_icon_v1.png`
- `nav_basket_icon_v1.png`
- `nav_fridge_icon_v1.png`
- `nav_upgrade_icon_v1.png`
- `nav_book_icon_v1.png`

不应直接当 final 的旧资源：

- `hud_panel_coin_v1.png`
- `hud_panel_timer_v1.png`
- `hud_panel_reputation_v1.png`
- `bottom_nav_slot_v1.png`
- `bottom_nav_slot_active_v1.png`

原因：

- 目标图顶部 HUD 是深紫一体化厚框，不是旧 v1 的浅色分散面板。
- 目标图底部是整条深紫底座内嵌五入口，不是孤立单槽。
- Runtime 当前底栏仍是临时符号，后续必须做 `semanticId -> icon -> click function -> active/disabled state` 预检，避免图标与真实功能错位。

#### HUD/Nav target v1 候选

状态：`overview-ready / not-figma-approved / not-runtime-final`

总览：

- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/_qa/hud_nav_target_v1_overview_2026_06_30.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/_qa/hud_nav_target_v1_390x844_preview.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/_qa/hud_nav_target_v1_assets_contact.png`

候选包 manifest：

- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/MANIFEST.md`

顶部 HUD 候选：

- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_top_frame_base_390w_v1.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_coin_icon_v2.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_clock_icon_v2.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_pause_button_v2.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_star_full_v1.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_star_empty_v1.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_timer_progress_track_v1.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_timer_progress_fill_v1.png`

底部 Nav 候选：

- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_bottom_bar_base_390w_v1.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_slot_base_v1.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_slot_active_v1.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_task_v2.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_procurement_v2.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_inventory_v2.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_upgrade_v2.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_catalog_v2.png`
- `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_alert_badge_v1.png`

使用限制：

- 用户检查总览图前，不上传 Figma、不进入 `assets/resources/**`、不接 runtime。
- Art/UI 已给出 `pass-for-user-review`，Development/testing 已给出 `pass-for-preflight`。
- 当前环境没有 Product 员工线程可复核，且用户尚未审总览；因此不能标记三方 pass。
- 总览图里的数字、倒计时、`x3` 只是预览占位，最终候选资源本身不烘焙动态文字。

## READY 动效决策

## 2026-07-01 顾客资源纠偏

状态：`blue-teal-customer-rework-needed / orange-purple-customer-keep-existing / aborted-batch-rejected`

- 橙色 / purple hoodie 顾客现有资源继续可用于 Figma 摆位复核，不再重新生成。
- 蓝色 / teal 顾客的无手 body-only 状态不可用：隐藏手部时会读成断臂或残缺。
- 已中止批次：`assets/ui/final-candidates/gameplay-customers-states-v1/`。
- 中止原因：误重做橙色顾客，且新 teal / blue 方向仍未解决 body-only 断手问题。
- 后续若继续产顾客，只允许做蓝色 / teal 顾客纠偏候选；body 单独显示必须完整自然，左右手只作为可摆放 overlay，且需要能和 body 的上臂 / 袖口衔接。
- 所有新角色共享硬规则：body 隐藏 hands 时必须仍是完整角色；hands 只是扒柜台姿势替换层，不能负责修补 body 的断手 / 缺手问题。
- 手部分层硬规则：body 负责完整胳膊结构；hands 层只允许手掌 / 爪子 + 极短 wrist/cuff cap，不能带完整前臂、上臂或第二套胳膊。
- 服装结构规则：wrist/cuff cap 只适用于橙色 hoodie 这类长袖角色；蓝色 / teal 背带角色 hands 层必须是裸 teal 手掌 / 爪子，不能带袖口、肩带、背带、黑紫环或任何衣服结构。
- 生成流程硬规则：imagegen 原始生成图必须先给用户过目；用户通过前，不做去背、拆层、裁切、归一化、候选包整理、Figma 上传或 runtime 接入。
- 表情动画硬规则：后续要做表情动画的角色必须预留 face rig。第一阶段优先使用同画布同 anchor 的表情组 `face_neutral`、`face_happy`、`face_impatient` / `face_angry`；需要眨眼、瞳孔、口型时再拆更细的 eye / mouth 层。
- 不允许从已烘焙完整脸的 body 上再覆盖眼嘴贴片；可动画角色的 `body_base` 必须为 face 层预留干净区域，或提供明确 neutral fallback 与完全对齐的 face overlay。
- 新候选总览通过前，不上传 Figma，不接 runtime。

### 2026-07-01 顾客动画表情候选包 v1

状态：`candidate-produced / pass-for-user-overview / pass-for-preflight / not-figma-uploaded / not-runtime-final`

候选包：

- `assets/ui/final-candidates/gameplay-customers-animation-v1/`
- Manifest：`assets/ui/final-candidates/gameplay-customers-animation-v1/MANIFEST.md`
- 总览图：`assets/ui/final-candidates/gameplay-customers-animation-v1/_qa/customer_animation_rig_v1_overview_2026_07_01.png`

新增角色层：

- `characters/purple_hoodie/placement/body_base_v1.png`
- `characters/purple_hoodie/placement/face_neutral_v1.png`
- `characters/purple_hoodie/placement/face_happy_v1.png`
- `characters/purple_hoodie/placement/face_impatient_v1.png`
- `characters/purple_hoodie/placement/left_hand_v1.png`
- `characters/purple_hoodie/placement/right_hand_v1.png`
- `characters/blue_teal/placement/body_base_v1.png`
- `characters/blue_teal/placement/face_neutral_v1.png`
- `characters/blue_teal/placement/face_happy_v1.png`
- `characters/blue_teal/placement/face_impatient_v1.png`
- `characters/blue_teal/placement/left_hand_v1.png`
- `characters/blue_teal/placement/right_hand_v1.png`

预检层：

- `characters/*/rig_canvas/*.png` 为 `1024x1024 RGBA`，只用于 anchor / rough composite 预检，不是最终 runtime 对齐证明。

角色复核：

- Product/planning：`pass-for-user-overview`。三态对玩家可读，能服务成功 / 等待焦虑反馈；但最终当前 / 等待顾客清晰度仍依赖订单气泡、halo、READY、耐心条和 hands 显隐同屏摆位。
- Art/UI：`pass-for-user-overview`。目标图方向成立，face rig 支持第一阶段表情切换；blue teal hands 为裸 teal 爪，未违反裸手规则；purple hoodie 短袖口可接受。
- Development/testing：`pass-for-preflight`。placement 图层为 RGBA，`rig_canvas` 为 `1024x1024 RGBA`，路径隔离正确；后续 Figma/runtime 预检必须依赖用户摆位或明确 anchor metadata。

使用限制：

- 这批只允许交给用户检查总览。
- 用户通过前，不上传 Figma，不复制进 `assets/resources/**`，不接 Cocos runtime。
- cropped `placement/` 图层尺寸不统一；没有 Figma 坐标或 anchor metadata 时，runtime 直接拼装会漂移。

不再继续做 READY glow bitmap。

原因：

- 柔光类 bitmap 依赖半透明渐变，当前 chroma-key / 去背流程容易硬切、脏边或失去柔边。

已通过的方案：

- READY glow / pulse / sparkle 改为 runtime 程序动效。
- 不新增位图资源。
- 只绑定订单完成后的 READY 胶囊和当前订单区域。
- 不放到收银机、商品卡 attention 或单个商品槽上。
- sparkle 强度不能像金币结算，避免误读为“已收银成功”。

开发已有可复用基础：

- `OrderReadyOuterHalo`
- `OrderReadyGlow`
- `OrderReadyGoldRim`
- `GameTweenFx`

建议实现时机：

- 不单独只做 glow。
- 等 READY 胶囊、check、slot overlay 最小接入时一起实现，位置和尺寸一次对齐。

## 工具：新抠图流程

脚本：

- `tools/probe_cutout_flow.py`

验证输出：

- `_qa/cutout_flood_probe_contact_sheet.png`
- `_qa/cutout_flood_probe_report.md`
- `_cutout_probe/*_flood.png`

结论：

- flood-fill from connected border background 比旧 chroma-key 更适合当前候选生产。
- 它解决了柠檬饮料、零食袋、布丁旧透明图在深色底发黑 / 洗白的问题。
- 当前仍是 probe，不是正式 pipeline；正式化前需要参数化 tolerance、修边 / 去 spill、缩放预览和更完整 QA。

## 不要使用 / 废弃

以下资源已归档到 `/Users/ban/Documents/怪兽便利店-art-archive/art-deprecated-2026-06-28/`，不要当作当前可用资源：

- `products/product_lemon_drink_v1.png`
- `products/product_lemon_drink_v2.png`
- `products/product_lemon_drink_v3.png`
- `products/product_snack_bag_v1.png`
- `products/product_pudding_cup_v1.png`
- `products/product_card_base_v1.png`
- `products/product_card_base_205x180_v2.png`
- `products/product_card_attention_border_v1.png`
- `products/product_card_attention_border_205x180_v1.png`
- `order/order_bubble_current_9slice_v2.png` 直接接入版本
- `order/order_bubble_current_base_no_slots_v1.png`
- `order/order_bubble_waiting_9slice_v2.png`
- `order/order_ready_glow_v2.png`
- `order/order_ready_glow_v3.png`

原因：

- 旧商品图存在 chroma-key 发黑 / 洗白问题。
- 旧商品卡和 attention 边框存在比例、语义或残影问题。
- 旧 current bubble 烘焙了 3 个槽位，直接接入会和 runtime 动态槽位冲突。
- READY glow bitmap 不再走位图路线。

## 仍缺的经营页美术资源

当前只完成第一轮核心闭环资源，整张经营页还没完成。

还缺：

- HUD：金币、时间、暂停 / 设置等。
- 错误 / 缺货 / 收银成功 / 金币反馈 / 耐心下降提示。
- 订单气泡精确 9-slice inset、槽位中心点等工程规格。
- 可选小件：收银机空显示屏、票据打印纸、零钱罐、杯子、菜单牌。

## 下一步

用量恢复 / 新线程继续时：

1. 先读 `AGENTS.md`。
2. 再读 `docs/LOCAL_TASK_BOARD.md`。
3. 再读本文件。
4. 按需重新派发开发/测试角色，收束第一轮最小接入包。
5. 若开发确认可以开始，主线程再做最小接入实现；不要直接扩大到整页。

当前员工线程状态：

- 产品/玩法：Bernoulli，`019f0d62-f4fa-71c0-a4e4-7069a98801b2`。
- 美术/UI：Bacon，`019f0d63-5505-7210-9dca-98f8f2652e45`。
- 开发/测试：Darwin，`019f0d63-559a-77d2-bcbe-c173b247f36d`。
- 旧员工线程只作为历史记录，不再作为新线程恢复依赖。

当前阻塞：

- 暂无硬阻塞；当前主攻美术资源，开发接入暂缓。

## 2026-06-29 顾客 v2 候选状态

状态：`probe-worthy / not final / build-screenshot pending`

当前候选：

- `assets/ui/final-candidates/gameplay-customers-final-v1/characters/customer_teal_regular_body_neutral_v3.png`
- `assets/ui/final-candidates/gameplay-customers-final-v1/characters/customer_teal_regular_hands_neutral_v3.png`
- `assets/ui/final-candidates/gameplay-customers-final-v1/characters/customer_purple_hoodie_body_neutral_v4.png`
- `assets/ui/final-candidates/gameplay-customers-final-v1/characters/customer_purple_hoodie_hands_neutral_v4.png`
- `assets/ui/final-candidates/gameplay-customers-final-v1/_qa/customer_layers_current_contact_sheet.png`

Runtime probe 副本：

- `assets/resources/ui_probe_gameplay_v2/customers/teal_regular/body_neutral.png`
- `assets/resources/ui_probe_gameplay_v2/customers/teal_regular/hands_neutral.png`
- `assets/resources/ui_probe_gameplay_v2/customers/purple_hoodie/body_neutral.png`
- `assets/resources/ui_probe_gameplay_v2/customers/purple_hoodie/hands_neutral.png`

复核结论：

- Product：语义可测，但非最终通过；必须用 390 runtime 截图确认遮挡与可读性。
- Art/UI：`revise / probe-worthy / not final`；teal hands/身体仍需看 runtime 是否足够扒柜台，purple 表情 final 前仍建议更等待焦虑。
- Development-testing：静态规格允许进入 runtime probe build-check；非 final pass。

使用边界：

- 只用于 v2 runtime probe 与截图复核。
- 不要覆盖 v1 probe，不要当作 runtime final。
- Cocos build / resources.load / runtime 截图尚未通过；下一轮必须先补构建核查。

### 2026-06-29 顾客 v2 runtime 补证

状态：`integration verified / not final`

补证结果：

- Cocos `web-mobile` build 已完成。
- `390x844` 六状态 runtime 截图有效：
  - `output/runtime-probe-2026-06-29-v2/contact-390x844.png`
- `750` 辅助截图因内置浏览器高度限制实际为 `750x1067`：
  - `output/runtime-probe-2026-06-29-v2/contact-750x1067-actual.png`
- target 对照：
  - `output/runtime-probe-2026-06-29-v2/target-vs-runtime-ready.png`

更新判定：

- v2 teal / purple 顾客可作为 runtime probe 继续验证。
- 不可作为 final commercial resource。
- purple waiting 默认态需要返工：目标图右侧顾客应有更明确的手、橙色袖、搭柜台姿态。
- teal current 也需在下一轮候选中继续检查手掌接柜台、头身比例和目标图相似度。

## 订单气泡 / READY 候选 v1

状态：`revise / partial pass-to-probe / not final`

目录：

- `assets/ui/final-candidates/gameplay-order-ready-final-v1/`

可进入后续 isolated probe 的资源：

- `order/order_bubble_current_base_v1.png`
- `order/order_bubble_waiting_base_v1.png`
- `order/order_slot_empty_v1.png`
- `order/order_slot_missing_dotted_v1.png`
- `order/order_item_check_badge_v1.png`
- `order/order_question_badge_v1.png`
- `order/ready_badge_base_empty_v1.png`

暂停资源：

- `order/ready_badge_glow_v1.png`

QA：

- `_qa/order_ready_split_contact_v1.png`
- `_qa/order_ready_target_contact_v1.png`
- `_qa/order_ready_composed_390_v1.png`

使用边界：

- 只作为 final-candidates 评审与后续 probe 候选。
- 不覆盖 runtime final。
- 不覆盖、不拆、不盖字修补 `ready_badge_compact.png`。
- `ready_badge_base_empty_v1.png` 无文字；Product 验收必须看到独立 READY 文本或 runtime composition 后才能确认交付语义。
- 气泡 base 内含尾巴和 slots，后续 runtime probe 首选 fixed-aspect，不要直接用 9-slice 拉伸。

### v3 runtime probe 状态

状态：`runtime probe baseline / not final`

已进入 runtime probe：

- `assets/resources/ui_probe_gameplay_v3/order_ready/order_bubble_current_base_v1.png`
- `assets/resources/ui_probe_gameplay_v3/order_ready/order_bubble_waiting_base_v1.png`
- `assets/resources/ui_probe_gameplay_v3/order_ready/ready_badge_base_empty_v1.png`

证据：

- `output/runtime-probe-2026-06-30-order-ready-v3-polish/contact-390x844-order-ready-v3-polish.png`
- `output/runtime-probe-2026-06-30-order-ready-v3-polish/target-vs-v3-polish-ready-crop.png`

当前口径：

- Product 和 Development/testing 允许作为下一步 probe baseline。
- Art/UI 仍要求最终小坐标微调：READY badge 右移、上移少量。
- 不是 commercial final。

## Figma 摆位协作板

状态：`created / waiting-for-user-placement / not runtime integration`

Figma 文件：

- `https://www.figma.com/design/Q8wMVbJYaJ6QDR4ggrHZGo`

已放入：

- 权威目标图：`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`
- Order / READY：v3 probe baseline、v1 probe 候选、旧 pass / revise 对照、暂停 glow。
- Products / Product Cards：6 个商品 icon、商品卡 base、attention border。
- Customers：v2 body / hands probe 资源、v1 三顾客九状态资源。
- Background：背景底图、货架层、窗景层、柔光层、当前顾客 halo。
- Equipment：柜台前景、工作台、微波炉三态、收银机两态。
- HUD / Nav：顶部面板、icon、暂停、耐心条、底部导航槽和入口 icon；其中 HUD 仍是 mixed pass + revise 口径。

Figma 节点规则：

- 资源图像节点统一命名为 `ART__<category>__<sourceName>`。
- 每个 `ART__*` 节点写入 `monster_store_art` metadata：`localPath`、`category`、`status`、`note`、`sourceName`、`originalWidth`、`originalHeight`。
- `PLACEMENT_CANVAS__390x844` 是后续读取摆位和层级的唯一目标 Frame。
- 资源池中的摆放位置不代表 runtime 接入位置；只有用户移动 / 复制到 `PLACEMENT_CANVAS__390x844` 并确认后，才作为接入依据。
- 顾客手部后续按左右手独立层处理：左手、右手分别可摆放，要求对称、一致；间距和遮挡以 Figma 摆位为准，不把手部强行合回顾客 body。

边界：

- 该 Figma 文件是 Art/UI 摆位协作入口，不是 commercial final 验收。
- `ready_badge_compact.png` 继续冻结；不在 Figma 里作为可修补 / 可覆盖资源。
- `ready_badge_glow_v1.png` 在 Figma 中标记为 `PAUSED_DO_NOT_USE`。

## 2026-06-30 摆位后资源口径更新

状态：`current-placement-reviewed / partial-archive-done / missing-assets-open`

已实际退场并归档：

- `assets/ui/final-candidates/gameplay-retry-v1/products/product_card_base_205x180_v3.png`
- `assets/ui/final-candidates/gameplay-retry-v1/products/product_card_attention_border_205x180_v2.png`
- `assets/ui/final-candidates/gameplay-retry-v1/products/product_rice_ball_v1.png`
- 对应 `.meta`、`_qa`、`_sources`、饭团 cutout probe 已移动到 `/Users/ban/Documents/怪兽便利店-art-archive/art-deprecated-2026-06-28/`。

不要再使用：

- 旧商品卡 base / attention border。商品区底部卡片必须按目标图重做，只做卡片本体。
- 旧饭团图标。它与其他商品源比例不一致，不能作为最终商品组的一员。
- Figma 里仍引用上述路径的旧节点视为 stale placement reference，只能用于说明“这里要替换”，不能接入 runtime。

当前 Figma 摆位仍可作为参考的资源：

- 背景：`assets/ui/final-candidates/gameplay-background-v1/background/store_background_clean_750x1334_v1.png`
- 顾客：`customer_teal_regular_body_neutral_v3.png`、`customer_teal_regular_hands_neutral_v3.png`、`customer_purple_hoodie_body_neutral_v4.png`、`customer_purple_hoodie_hands_neutral_v4.png`
- 订单：`order_bubble_current_base_no_slots_v2.png`、`order_bubble_waiting_9slice_v3.png`、`order_check_v2.png`、`order_ready_capsule_empty.png`
- 商品：`product_lemon_drink_v4.png`、`product_pudding_cup_v2.png`、`product_snack_bag_v2.png`
- 设备 / 柜台参考：`cashier_pay_v1.png`、`microwave_idle_v1.png`、`counter_foreground_v1.png`、`counter_worktop_midground_v1.png`

待确认归档候选：

- `gameplay-hud-v1/`、`gameplay-products-v2/`、`gameplay-customers-v1/`、`gameplay-customers-v2/`、`gameplay-first-batch-v1/`。
- `gameplay-order-ready-final-v1/` 当前未被用户摆位采用；但 `assets/resources/ui_probe_gameplay_v3/` 的 runtime probe 副本继续保留。
- 未摆入画板的背景 overlay / halo、设备备用状态、旧 order slot overlay / glow sources。

当前缺失素材：

- 柜台区：不再需要完整 `390x844` 柜台景 bitmap。下半屏纯色 / 简单背景由用户在 Figma 用 shape 摆位，后续由 Development/testing 在 runtime 还原；设备置物板沿用之前已有资源；只单独评估顾客手扒的柜台木板 / 前沿条。
- 目标图风格商品卡 `product_card_base_target_v1`：不含库存数字底板，库存数字底板用 runtime shape。
- 新饭团正方形候选与至少两个补位商品仍需重新输出；`product_rice_ball_square_v1`、`product_chocolate_milk_v1`、`product_candy_bag_v1` 已判定目标图方向不通过。
- 顶部 HUD final 候选与底部按钮 final 候选。
- 非当前订单气泡是否显示商品的摆位决策。
- 顾客左右手 final 化：按用户 Figma 方法保持左右手独立层、对称且一致；蓝色顾客无手状态不可用。

### 2026-06-30 新增商品区与柜台候选

状态：`product-card-candidate / product-icons-failed / counter-scene-failed / not runtime final`

Owner / Brief / Review / Record：

- Owner：Art/UI 负责候选质量与目标图相似度。
- Brief：先补商品区闭环和完整柜台底景；新资源只进 final-candidates，不接 runtime。
- Review：Product 需在 390 Figma 摆位中确认商品区可玩路径；Development/testing 后续只在 stale-path 预检通过后接入。
- Record：本节、`docs/LOCAL_TASK_BOARD.md`、`docs/NEXT_ART_PRODUCTION_BRIEF.md`。

新增商品卡：

- `assets/ui/final-candidates/gameplay-product-card-target-v1/product_card_base_target_v1.png`
- Source：
  - `assets/ui/final-candidates/gameplay-product-card-target-v1/_sources/product_card_base_target_v1_chroma.png`
  - `assets/ui/final-candidates/gameplay-product-card-target-v1/_sources/product_card_base_target_v1_alpha_raw.png`
- QA：
  - `assets/ui/final-candidates/gameplay-product-card-target-v1/_qa/product_card_base_target_v1_qa.png`

口径：

- `205x180` 透明 PNG，只包含商品卡本体。
- 不含商品图标、库存数字、库存数字底板、文字、火焰 badge、选中光。
- 当前判定：`candidate / Figma placement needed`。单卡干净；六卡密度需在用户 Figma 画板内确认。

新增商品：

- `assets/ui/final-candidates/gameplay-products-target-v1/products/product_rice_ball_square_v1.png`
- `assets/ui/final-candidates/gameplay-products-target-v1/products/product_chocolate_milk_v1.png`
- `assets/ui/final-candidates/gameplay-products-target-v1/products/product_candy_bag_v1.png`
- Source：
  - `assets/ui/final-candidates/gameplay-products-target-v1/_sources/product_rice_ball_square_v1_chroma.png`
  - `assets/ui/final-candidates/gameplay-products-target-v1/_sources/product_rice_ball_square_v1_alpha_raw.png`
  - `assets/ui/final-candidates/gameplay-products-target-v1/_sources/product_chocolate_milk_v1_chroma.png`
  - `assets/ui/final-candidates/gameplay-products-target-v1/_sources/product_chocolate_milk_v1_alpha_raw.png`
  - `assets/ui/final-candidates/gameplay-products-target-v1/_sources/product_candy_bag_v1_chroma.png`
  - `assets/ui/final-candidates/gameplay-products-target-v1/_sources/product_candy_bag_v1_alpha_raw.png`
- QA：
  - `assets/ui/final-candidates/gameplay-products-target-v1/_qa/products_target_unified_pack_v1_qa.png`

口径：

- 三张均为 `1254x1254` 透明 PNG。
- 当前判定：`failed direction / reference only / do not upload / do not runtime integrate`。
- 新饭团虽然解决旧版横纵比例不一致问题，但米粒纹理过多、偏写实，不像目标图手游 icon。
- 巧克力奶偏瘦偏高，视觉重量不足。
- 糖果袋偏高、色彩过跳、细节复杂，和目标图右下商品图标不统一。
- 后续仍需重新输出目标图风格商品 icon：少纹理、更圆润、更粗描边、更统一视觉体积。

废弃柜台底景候选：

- `assets/ui/final-candidates/gameplay-counter-scene-v1/counter_scene_base_390x844_v1.png`
- Source：
  - `assets/ui/final-candidates/gameplay-counter-scene-v1/_sources/counter_scene_base_390x844_v1_chroma.png`
  - `assets/ui/final-candidates/gameplay-counter-scene-v1/_sources/counter_scene_base_390x844_v1_alpha_raw.png`
- QA：
  - `assets/ui/final-candidates/gameplay-counter-scene-v1/_qa/counter_scene_base_390x844_v1_qa.png`

口径：

- `390x844` 透明 PNG；alpha bbox 从约 `y=409` 开始。
- 包含双层木质柜台、深紫工作区、下半屏柜台基底。
- 不含顾客、手、订单、READY、商品、设备、置物板、HUD、底部按钮。
- 当前判定：`failed direction / do not upload / do not runtime integrate`。
- 原因：整屏 `390x844` 柜台景不利于多尺寸适配，且把设备区、商品区、手部遮挡线和下半屏背景锁死；用户改为在 Figma 中用纯色 / 简单 shape 摆放柜台区域，由 Development/testing 后续还原。
- 后续：设备置物板沿用之前资源；如果目标图需要木质厚边和手部遮挡，只单独做 `counter_hand_ledge` 横向条或 9-slice 前沿条。

## 2026-06-30 仍需重新输出资源清单

状态：`open / art-output-needed / product-icons-v2-under-overview-review`

P0：

- 商品图标补齐包：`product_rice_ball_target_v2`、`product_chocolate_milk_target_v2`、`product_candy_bag_target_v2` 已输出候选并进入总览图门禁；等待用户检查，不上传 Figma、不接 runtime。如未通过，再做 v3。
- 顾客手扒柜台木板 / 前沿条：`counter_hand_ledge_v1` 已输出独立横条候选并进入总览图门禁；等待用户检查。如 Figma/runtime shape 能还原目标图前沿，则可不用该 bitmap。
- 顶部 HUD final 候选：金币、时间、目标 / 星级、暂停按钮与顶部深紫壳仍缺目标图匹配版本。
- 底部按钮 final 候选：底部导航槽、激活态、五个入口 icon 仍缺目标图匹配版本。

P1：

- 顾客 final 化：蓝色 / teal 顾客无手 body-only 状态不可用；如后续需要无手或多状态，必须重新输出可独立成立的 body + 左右手分层。橙色 / purple 顾客目前可摆位，但仍需在 runtime 截图里确认手部、胳膊和柜台遮挡。
- 非当前订单气泡商品策略：如果 waiting bubble 也要显示商品，需要等商品补齐后输出 / 复用合适的小号商品摆位；当前不新出 bubble 底图。
- 商品卡状态件：`product_card_base_target_v1` 只是不含库存底板的卡片本体；选中高亮、火焰 / 热食角标、禁用层是否需要 bitmap，待 Figma 摆位确认。库存数字底板走 runtime shape，不出图。

不需要重新输出 / 暂停：

- 完整 `390x844` 柜台景 bitmap：不需要，已判失败方向。
- 设备置物板：沿用之前已有资源。
- 下半屏纯色 / 简单柜台背景：用户用 Figma shape 摆位，Development/testing 后续还原。
- `ready_badge_compact.png`：继续冻结，不拆、不盖字、不继续代码修补。

## 2026-06-30 商品 icon v2 / 柜台前沿条候选

状态：`candidate / conditional-pass / overview-review-needed / not-runtime-final`

总览图门禁：

- `assets/ui/final-candidates/gameplay-art-round-2026-06-30/_qa/next_round_art_overview_2026_06_30.png`

新增商品 icon v2：

- `assets/ui/final-candidates/gameplay-products-target-v2/products/product_rice_ball_target_v2.png`
  - Source：`assets/ui/final-candidates/gameplay-products-target-v2/_sources/product_rice_ball_target_v2_chroma.png`
  - 规格：`1254x1254 RGBA`。
  - 口径：候选；比 v1 更接近目标图，仍需用户看卡内体量是否偏大。
- `assets/ui/final-candidates/gameplay-products-target-v2/products/product_chocolate_milk_target_v2.png`
  - Source：`assets/ui/final-candidates/gameplay-products-target-v2/_sources/product_chocolate_milk_target_v2_chroma.png`
  - 规格：`1254x1254 RGBA`。
  - 口径：候选；方向接近目标图奶瓶，但 Art/UI 和 Product 均标记“略窄弱”，需用户检查。
- `assets/ui/final-candidates/gameplay-products-target-v2/products/product_candy_bag_target_v2.png`
  - Source：`assets/ui/final-candidates/gameplay-products-target-v2/_sources/product_candy_bag_target_v2_chroma.png`
  - 规格：`1254x1254 RGBA`。
  - 口径：候选；可读性强，但颜色略霓虹，需用户检查是否抢 READY / 订单气泡。
- QA：`assets/ui/final-candidates/gameplay-products-target-v2/_qa/products_target_v2_overview.png`

新增柜台前沿条：

- `assets/ui/final-candidates/gameplay-counter-hand-ledge-v1/counter/counter_hand_ledge_v1.png`
  - Source：
    - `assets/ui/final-candidates/gameplay-counter-hand-ledge-v1/_sources/counter_hand_ledge_v1_chroma.png`
    - `assets/ui/final-candidates/gameplay-counter-hand-ledge-v1/counter/counter_hand_ledge_v1_alpha_raw.png`
  - QA：`assets/ui/final-candidates/gameplay-counter-hand-ledge-v1/_qa/counter_hand_ledge_v1_qa.png`
  - 规格：`390x90 RGBA`。
  - 口径：候选；独立横条，不是整屏柜台景。Art/UI 标记“橙色偏重、分段线略规律”，需用户检查。

角色结论：

- Product：`conditional pass`。商品区可读性和点击链路基础成立；缺订单气泡同屏验证，不能宣称完整 final pass。
- Art/UI：`conditional pass`。可给用户检查；巧克力奶、糖果袋、木条仍有小返修风险。
- Development/testing：`conditional pass`。资源隔离、尺寸、alpha 通过；后续不得接旧商品卡、旧 attention、旧饭团 stale path。

使用限制：

- 用户通过总览图前，不上传 Figma。
- 用户通过总览图前，不进入 `assets/resources/**`。
- 不用这些候选修补或覆盖 `ready_badge_compact.png`。
