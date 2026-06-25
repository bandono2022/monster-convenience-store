# UI Art Export Index

本轮 P0 资源以 SVG 源文件输出，均为透明背景。面板类资源确认后可批量转 PNG 并在 Cocos 中设置九宫格。

| 文件路径 | 资源用途 | 尺寸 | 格式 | 是否透明 | 九宫格建议 | 使用位置 |
|---|---|---|---|---|---|---|
| assets/resources/ui_generated/customer/customer_select_glow.svg | 当前顾客选择高亮光圈 | 360x92 | SVG | 是 | 否 | 顾客脚下/背后 |
| assets/resources/ui_generated/order/order_bubble_normal.svg | 非当前顾客订单气泡 | 360x168 | SVG | 是 | 是，建议 24px |  |
| assets/resources/ui_generated/order/order_bubble_selected.svg | 当前顾客订单气泡 | 360x168 | SVG | 是 | 是，建议 24px |  |
| assets/resources/ui_generated/order/order_bubble_warning.svg | 警告订单气泡 | 360x168 | SVG | 是 | 是，建议 24px |  |
| assets/resources/ui_generated/order/customer_label_normal.svg | 普通顾客标签底板 | 148x44 | SVG | 是 | 是，建议 18px | 订单气泡顶部 |
| assets/resources/ui_generated/order/customer_label_impatient.svg | 急性顾客标签底板 | 148x44 | SVG | 是 | 是，建议 18px | 订单气泡顶部 |
| assets/resources/ui_generated/order/order_item_slot.svg | 订单 item 底板 | 74x74 | SVG | 是 | 否 | 订单气泡内商品图标底 |
| assets/resources/ui_generated/order/check_icon.svg | 订单完成勾选 icon | 48x48 | SVG | 是 | 否 | 订单 item 完成态 |
| assets/resources/ui_generated/order/heart_icon.svg | 耐心爱心 icon | 48x48 | SVG | 是 | 否 | 耐心条左侧 |
| assets/resources/ui_generated/order/patience_track.svg | 耐心条底板 | 220x28 | SVG | 是 | 是，建议 12px | 订单气泡底部 |
| assets/resources/ui_generated/order/patience_fill.svg | 耐心条填充 | 210x18 | SVG | 是 | 是，建议 8px | 耐心条缩放填充 |
| assets/resources/ui_generated/order/low_patience_alert.svg | 低耐心红边闪烁资源 | 376x184 | SVG | 是 | 是，建议 28px | 订单气泡外层 |
| assets/resources/ui_generated/order/done_stamp.svg | DONE 盖章底板/图形 | 128x56 | SVG | 是 | 否 | 整单完成时盖章 |
| assets/resources/ui_generated/product_card/card_normal.svg | 商品卡普通态 | 240x240 | SVG | 是 | 是，建议 24px | 商品区货架格 |
| assets/resources/ui_generated/product_card/card_selected.svg | 商品卡选中态 | 240x240 | SVG | 是 | 是，建议 24px | 商品区货架格 |
| assets/resources/ui_generated/product_card/card_highlighted.svg | 商品卡高亮态 | 240x240 | SVG | 是 | 是，建议 24px | 商品区货架格 |
| assets/resources/ui_generated/product_card/card_disabled.svg | 商品卡售罄/禁用态 | 240x240 | SVG | 是 | 是，建议 24px | 商品区货架格 |
| assets/resources/ui_generated/product_card/card_wrong.svg | 商品卡错误态 | 240x240 | SVG | 是 | 是，建议 24px | 商品区货架格 |
| assets/resources/ui_generated/product_card/inventory_pill.svg | 价格/库存胶囊底板 | 132x42 | SVG | 是 | 是，建议 16px | 商品卡底部 |
| assets/resources/ui_generated/product_card/stock_badge.svg | 商品库存角标 | 96x42 | SVG | 是 | 是，建议 16px | 商品卡右上角 |
| assets/resources/ui_generated/product_card/heat_badge.svg | 加工需求角标 | 88x42 | SVG | 是 | 是，建议 16px | 商品卡左上角 |
| assets/resources/ui_generated/device/microwave_progress_ring.svg | 微波炉加工进度环 | 92x92 | SVG | 是 | 否 | 微波炉加工中 |
| assets/resources/ui_generated/device/microwave_ready_badge.svg | 微波炉完成提示 | 58x58 | SVG | 是 | 否 | 微波炉 ready 状态 |
| assets/resources/ui_generated/feedback/income_float_bg.svg | 收入 +xx 飘字底板 | 150x58 | SVG | 是 | 是，建议 18px | 收款浮字 |
| assets/resources/ui_generated/feedback/combo_badge.svg | Combo 牌底板 | 170x62 | SVG | 是 | 是，建议 18px | 连击提示 |
| assets/resources/ui_generated/feedback/perfect_badge.svg | Perfect 评价牌底板 | 160x62 | SVG | 是 | 是，建议 18px | 完美服务评价 |
| assets/resources/ui_generated/feedback/good_badge.svg | Good 评价牌底板 | 140x58 | SVG | 是 | 是，建议 18px | 普通成功评价 |
| assets/resources/ui_generated/feedback/rush_badge.svg | Rush 评价牌底板 | 140x58 | SVG | 是 | 是，建议 18px | 紧急完成评价 |
| assets/resources/ui_generated/feedback/coin_sprite.svg | 金币飞行 sprite | 48x48 | SVG | 是 | 否 | 金币飞行动画 |
| assets/resources/ui_generated/feedback/error_toast_bg.svg | 错误轻提示底板 | 300x64 | SVG | 是 | 是，建议 22px | 错误 toast |
| assets/resources/ui_generated/common/flame_icon.svg | 火焰 icon | 48x48 | SVG | 是 | 否 | 加热角标/设备按钮 |

## Formal V2 Integrated Assets

| 文件路径 | 资源用途 | 尺寸 | 格式 | 是否透明 | 九宫格建议 | 使用位置 |
|---|---|---|---|---|---|---|
| assets/resources/ui_formal_v2/production/common/icon_heart.png | 满意度与耐心图标 | 96x96 | PNG | 是 | 否 | HUD、订单耐心条 |
| assets/resources/ui_formal_v2/production/common/icon_pause.png | 暂停按钮 | 96x96 | PNG | 是 | 否 | 主游戏 HUD 右上角 |
