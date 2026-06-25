# UI Art Asset Breakdown

本清单基于目标图拆解主游戏界面 UI。原则：P0 只补“玩法理解和反馈清晰”必需资源；可用代码、Tween、九宫格解决的，不拆成大量静态图；现有商品、角色、背景、设备资源优先复用。

| 模块 | 资源名 | 文件名建议 | 尺寸建议 | 格式 | 九宫格 | 状态 | 用途 | 实现方式 | 优先级 | 是否已有类似资源 | 备注 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 顶部状态栏 | 营业额面板 | topbar/revenue_panel | 220x80 | PNG/SVG | 是 | normal | 显示营业额或满意度 | 九宫格资源 | P1 | 代码绘制 | 目标图质感增强项 |
| 顶部状态栏 | 金币/营业额 icon | topbar/coin_icon | 64x64 | SVG | 否 | normal | 金币/营业额识别 | SVG icon | P1 | 代码圆形 icon | 可与金币飞行共用风格 |
| 顶部状态栏 | 时间倒计时面板 | topbar/timer_panel | 230x84 | PNG/SVG | 是 | warning | 显示时间压力 | 九宫格资源 | P1 | 代码绘制 | 时间红色更醒目 |
| 顶部状态栏 | 时钟 icon | topbar/clock_icon | 64x64 | SVG | 否 | normal | 倒计时识别 | SVG icon | P1 | 字符 icon | 后续替换字符 |
| 顶部状态栏 | 金币面板 | topbar/wallet_panel | 210x80 | PNG/SVG | 是 | normal | 长期资产 | 九宫格资源 | P1 | 代码绘制 | 保持青绿色 |
| 顶部状态栏 | 星星/金币 icon | topbar/star_coin_icon | 64x64 | SVG | 否 | normal | 钱包/奖励识别 | SVG icon | P1 | 字符 icon | 可复用评价星形 |
| 顶部状态栏 | 加号按钮 | topbar/add_button | 58x58 | SVG/PNG | 否 | normal | 后续商店入口 | SVG icon | P2 | 无 | 当前不需要 |
| 顶部状态栏 | 暂停按钮 | topbar/pause_button | 68x68 | SVG/PNG | 否 | normal | 暂停菜单 | SVG icon | P1 | 代码绘制 | 可后续统一 |
| 顾客与订单区 | 当前顾客订单气泡 | order/order_bubble_selected | 360x168 | PNG/SVG | 是 | selected | 当前顾客订单主容器 | 九宫格资源 | P0 | 代码绘制 | 带尾巴、红色描边 |
| 顾客与订单区 | 非当前顾客订单气泡 | order/order_bubble_normal | 360x168 | PNG/SVG | 是 | normal | 非当前顾客订单容器 | 九宫格资源 | P0 | 代码绘制 | 紫色描边 |
| 顾客与订单区 | 警告订单气泡 | order/order_bubble_warning | 360x168 | PNG/SVG | 是 | warning | 低耐心/错误强调 | 九宫格资源 | P0 | 代码绘制 | 红黄警告描边 |
| 顾客与订单区 | 普通顾客标签 | order/customer_label_normal | 148x44 | PNG/SVG | 是 | normal | 顾客类型识别 | 九宫格资源 | P0 | 代码文字 | 目标图顶部小标签 |
| 顾客与订单区 | 急性顾客标签 | order/customer_label_impatient | 148x44 | PNG/SVG | 是 | warning | 急客识别 | 九宫格资源 | P0 | 代码文字 | 紫色/橙色区分 |
| 顾客与订单区 | 顾客选择高亮光圈 | customer/customer_select_glow | 360x92 | PNG/SVG | 否 | selected | 当前服务目标 | 程序动画 + 半透明资源 | P0 | 无 | 放在怪兽脚下/背后 |
| 顾客与订单区 | 订单 item 底板 | order/order_item_slot | 74x74 | PNG/SVG | 否 | normal | 订单图标底板 | SVG/代码绘制 | P0 | 代码绘制 | 白底紫描边 |
| 顾客与订单区 | 订单完成勾选 icon | order/check_icon | 48x48 | SVG | 否 | completed | item 完成反馈 | SVG icon | P0 | 代码绘制 | 绿色圆形勾 |
| 顾客与订单区 | 订单缺失状态 | order/missing_badge | 64x32 | PNG/SVG | 是 | warning | 缺货/未完成提示 | 代码或九宫格 | P1 | 无 | 避免提示过多，非 P0 |
| 顾客与订单区 | DONE 盖章 | order/done_stamp | 128x56 | PNG/SVG | 否 | completed | 整单完成爽感 | SVG/PNG | P0 | 代码绘制 | 轻微旋转使用 |
| 顾客与订单区 | 耐心条底板 | order/patience_track | 220x28 | PNG/SVG | 是 | normal | 耐心条容器 | 九宫格资源 | P0 | 代码绘制 | 深紫底 |
| 顾客与订单区 | 耐心条填充 | order/patience_fill | 210x18 | PNG/SVG | 是 | normal/warning | 耐心进度 | 九宫格/代码缩放 | P0 | 代码绘制 | 颜色可代码染色 |
| 顾客与订单区 | 爱心 icon | order/heart_icon | 48x48 | SVG | 否 | normal | 耐心识别 | SVG icon | P0 | 字符 icon | 替换字符心 |
| 顾客与订单区 | 低耐心红边/闪烁资源 | order/low_patience_alert | 376x184 | PNG/SVG | 是 | warning | 低耐心强调 | 程序动画 + 资源 | P0 | 动效已有 | 可套气泡外圈 |
| 柜台与设备区 | 微波炉底图 | device/microwave | 已有 589x473 | PNG | 否 | idle/processing/ready | 加工设备 | 复用已有 PNG | P0 | 已有 | 不重画 |
| 柜台与设备区 | 微波炉火焰 icon | device/flame_icon | 48x48 | SVG | 否 | processing | 加热需求/按钮 | SVG icon | P0 | 字符 icon | 可复用商品卡角标 |
| 柜台与设备区 | 微波炉加工进度条/环 | device/microwave_progress_ring | 92x92 | SVG/PNG | 否 | processing | 加工进行中 | SVG + Tween 旋转/缩放 | P0 | 代码进度条 | 后续替代闪烁进度条 |
| 柜台与设备区 | 微波炉完成提示 | device/microwave_ready_badge | 58x58 | SVG | 否 | ready | 加工完成可取 | SVG icon | P0 | 代码勾 | 绿色勾/发光 |
| 柜台与设备区 | 柜台/托盘底图 | device/delivery_pad | 已有 637x314 | PNG | 否 | normal | 商品飞行动画中转 | 复用已有 PNG | P0 | 已有 | 不恢复手动交付 |
| 柜台与设备区 | 打包完成勾选 icon | device/pack_done_check | 52x52 | SVG | 否 | completed | 托盘/柜台反馈 | SVG icon | P1 | 代码勾 | 可复用 check_icon |
| 柜台与设备区 | 收银机底图 | device/cashier | 已有 662x513 | PNG | 否 | normal | 收款设备 | 复用已有 PNG | P0 | 已有 | 不重画 |
| 柜台与设备区 | 收银机屏幕 | device/cashier_screen | 128x70 | PNG/SVG | 是 | normal/flash | 显示营业额 | 九宫格资源 | P1 | 代码覆盖 | 后续统一 |
| 柜台与设备区 | 小票机/票据 icon | device/receipt_icon | 44x56 | SVG | 否 | normal | 装饰反馈 | 暂时不需要 | P2 | 收银机图内已有 | 非 P0 |
| 柜台与设备区 | 金币飞行动画 coin | feedback/coin_sprite | 48x48 | SVG/PNG | 否 | normal | 收款飞币 | SVG/程序动画 | P0 | 程序绘制 | 单张即可 |
| 商品卡片区 | 商品卡普通态 | product_card/card_normal | 240x240 | PNG/SVG | 是 | normal | 商品货架格 | 九宫格资源 | P0 | 代码绘制 | 奶油底、粗描边 |
| 商品卡片区 | 商品卡选中态 | product_card/card_selected | 240x240 | PNG/SVG | 是 | selected | 当前需要/点击反馈 | 九宫格资源 | P0 | 代码绘制 | 青绿描边 |
| 商品卡片区 | 商品卡高亮态 | product_card/card_highlighted | 240x240 | PNG/SVG | 是 | highlighted | 教学/需求提示 | 九宫格资源 | P0 | 代码绘制 | 黄色描边 |
| 商品卡片区 | 商品卡错误态 | product_card/card_wrong | 240x240 | PNG/SVG | 是 | wrong | 点错反馈 | 九宫格资源 | P0 | 代码绘制 | 红描边/淡红底 |
| 商品卡片区 | 商品卡售罄态 | product_card/card_disabled | 240x240 | PNG/SVG | 是 | disabled | 售罄不可用 | 九宫格资源 | P0 | 代码绘制 | 灰底 |
| 商品卡片区 | 商品库存角标 | product_card/stock_badge | 96x42 | PNG/SVG | 是 | normal | 货架/仓库数量 | 九宫格资源 | P0 | 代码绘制 | 现显示货架 |
| 商品卡片区 | 加工需求角标 | product_card/heat_badge | 88x42 | PNG/SVG | 是 | processing | 需加热/热食 | 九宫格资源 | P0 | 代码绘制 | 火焰小标 |
| 商品卡片区 | 商品分类角标 | product_card/category_badge_* | 48x48 | SVG | 否 | normal | 星星/叶子/糖果分类 | SVG icon | P1 | 无 | 暂无玩法意义 |
| 商品卡片区 | 价格/库存胶囊底板 | product_card/inventory_pill | 132x42 | PNG/SVG | 是 | normal | 库存显示 | 九宫格资源 | P0 | 代码绘制 | 不做购买价格主视觉 |
| 商品卡片区 | 商品名称文字底板 | product_card/name_plate | 180x36 | PNG/SVG | 是 | normal | 名称可读性 | 代码/九宫格 | P1 | 无 | 现可直接文字 |
| 反馈与结算 | Perfect 评价牌 | feedback/perfect_badge | 160x62 | PNG/SVG | 是 | completed | 完美服务反馈 | 九宫格资源 | P0 | 无 | 可先英语/后中文 |
| 反馈与结算 | Good 评价牌 | feedback/good_badge | 140x58 | PNG/SVG | 是 | completed | 普通成功反馈 | 九宫格资源 | P0 | 无 | |
| 反馈与结算 | Rush 评价牌 | feedback/rush_badge | 140x58 | PNG/SVG | 是 | warning | 快超时完成 | 九宫格资源 | P0 | 无 | |
| 反馈与结算 | Combo 牌 | feedback/combo_badge | 170x62 | PNG/SVG | 是 | highlighted | 连击反馈 | 九宫格资源 | P0 | 无 | 后续接入 |
| 反馈与结算 | 收入 +xx 飘字底板 | feedback/income_float_bg | 150x58 | PNG/SVG | 是 | completed | 收款数字浮动 | 九宫格资源 | P0 | 程序文字 | 可配合 GameTweenFx |
| 反馈与结算 | 错误轻提示底板 | feedback/error_toast_bg | 300x64 | PNG/SVG | 是 | wrong | 点错提示 | 九宫格资源 | P0 | 代码绘制 | 避免大面积遮挡 |
| 反馈与结算 | 小星星/闪光粒子 | feedback/sparkle | 32x32 | SVG | 否 | highlighted | 爽感点缀 | 程序粒子/SVG | P1 | 无 | P0 可不接 |
| 反馈与结算 | 红色警告闪光 | feedback/warning_flash | 96x96 | SVG/PNG | 否 | warning | 低耐心/错误 | 程序动画 | P1 | 动效已有 | |
| 反馈与结算 | 结算面板底图 | feedback/settlement_panel | 620x760 | PNG/SVG | 是 | normal | 结算页 | 九宫格资源 | P2 | 代码绘制 | 非主营业 P0 |
| 反馈与结算 | 继续按钮/重玩按钮 | common/primary_button | 320x72 | PNG/SVG | 是 | normal | 页面按钮 | 九宫格资源 | P2 | 代码绘制 | 后续统一 |
| 背景与装饰 | 店铺背景 | game-art/environment/store-background | 已有 750x1334 | PNG | 否 | normal | 店内空间 | 复用已有 PNG | P0 | 已有 | 不重画 |
| 背景与装饰 | 左右货架 | background/shelf_left_right | 已在背景内 | PNG | 否 | normal | 空间感 | 暂时不拆 | P2 | 已有 | 等正式背景分层 |
| 背景与装饰 | 墙面装饰牌 | background/wall_signs | 已在背景内 | PNG | 否 | normal | 装饰 | 暂时不需要 | P2 | 已有 | |
| 背景与装饰 | 植物/小装饰 | background/plants | 已在背景内 | PNG | 否 | normal | 装饰 | 暂时不需要 | P2 | 已有 | |
| 背景与装饰 | 顶灯 | background/ceiling_lamp | 已在背景内 | PNG | 否 | normal | 空间焦点 | 暂时不拆 | P1 | 已有 | 后续做轻微发光 |
| 背景与装饰 | 窗户背景 | background/window_view | 已在背景内 | PNG | 否 | normal | 空间深度 | 暂时不拆 | P2 | 已有 | |

## P0 结论

P0 不重画商品 icon、怪兽、设备和背景。当前最需要输出的是：订单气泡、顾客标签、商品卡状态、耐心条、关键 icon、反馈牌、金币 sprite、提示底板。它们直接影响玩家是否看懂订单、库存、加热、成功和错误反馈。
