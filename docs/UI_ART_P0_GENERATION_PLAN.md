# UI Art P0 Generation Plan

本计划只生成 P0 必需 UI 资源。当前环境缺少可靠 PNG 透明导出工具，因此本轮先输出透明背景 SVG 源文件到 `assets/resources/ui_generated/`。若后续接入 Cocos 需要 PNG，可按本命名和尺寸批量转出 PNG，并设置九宫格边距。

## 命名规范

- 文件名使用小写英文 + 下划线，例如 `order_bubble_selected.svg`。
- 路径按模块分组：`order/`、`customer/`、`product_card/`、`device/`、`feedback/`、`common/`。
- 状态后缀固定：`normal`、`selected`、`highlighted`、`disabled`、`wrong`、`warning`、`completed`、`processing`、`ready`。
- 可缩放面板资源预留 12-24px 安全边，接入 PNG 后按文档设置九宫格。

## P0 资源生成列表

| 资源 | 视觉描述 | 尺寸 | 透明背景 | 九宫格 | 导出路径 | Prompt / 绘制说明 |
|---|---|---:|---|---|---|---|
| 当前顾客高亮光圈 | 半透明薄荷绿椭圆光圈，深紫描边弱化 | 360x92 | 是 | 否 | `assets/resources/ui_generated/customer/customer_select_glow.svg` | cute monster convenience store UI, mint oval selection glow, thick dark purple outline, flat cartoon |
| 订单气泡 normal | 奶油白圆角气泡，紫色描边，左下小尾巴 | 360x168 | 是 | 是 | `assets/resources/ui_generated/order/order_bubble_normal.svg` | cream speech bubble, purple stroke, rounded, mobile game UI |
| 订单气泡 selected | 奶油白气泡，珊瑚红粗描边 | 360x168 | 是 | 是 | `assets/resources/ui_generated/order/order_bubble_selected.svg` | selected order bubble, coral outline, cute flat UI |
| 订单气泡 warning | 奶油白气泡，红橙双层警告描边 | 360x168 | 是 | 是 | `assets/resources/ui_generated/order/order_bubble_warning.svg` | warning order bubble, red/orange outline, readable small screen |
| 普通顾客标签 | 珊瑚红胶囊标签 | 148x44 | 是 | 是 | `assets/resources/ui_generated/order/customer_label_normal.svg` | coral pill tab for normal customer |
| 急性顾客标签 | 紫色胶囊标签，橙色小强调 | 148x44 | 是 | 是 | `assets/resources/ui_generated/order/customer_label_impatient.svg` | purple pill tab for impatient customer |
| 耐心条底板 | 深紫圆角进度条轨道 | 220x28 | 是 | 是 | `assets/resources/ui_generated/order/patience_track.svg` | dark purple rounded progress track |
| 耐心条填充 | 薄荷绿圆角填充条，可代码染色 | 210x18 | 是 | 是 | `assets/resources/ui_generated/order/patience_fill.svg` | mint rounded progress fill |
| 爱心 icon | 红色圆形底 + 白色心形 | 48x48 | 是 | 否 | `assets/resources/ui_generated/order/heart_icon.svg` | heart patience icon, thick outline |
| 订单完成勾选 icon | 绿色圆形勾 | 48x48 | 是 | 否 | `assets/resources/ui_generated/order/check_icon.svg` | completed check icon, mint green |
| DONE 盖章 | 绿色倾斜盖章牌 | 128x56 | 是 | 否 | `assets/resources/ui_generated/order/done_stamp.svg` | DONE stamp, playful rounded badge |
| 商品卡 normal | 奶油白卡片，青绿描边，浅阴影 | 240x240 | 是 | 是 | `assets/resources/ui_generated/product_card/card_normal.svg` | product shelf card normal, cream fill, teal stroke |
| 商品卡 selected | 奶油白卡片，青绿加粗描边，高光 | 240x240 | 是 | 是 | `assets/resources/ui_generated/product_card/card_selected.svg` | selected product card, teal bold outline |
| 商品卡 highlighted | 奶油白卡片，阳光黄描边 | 240x240 | 是 | 是 | `assets/resources/ui_generated/product_card/card_highlighted.svg` | highlighted product card, yellow outline |
| 商品卡 disabled | 灰奶油卡片，低饱和描边 | 240x240 | 是 | 是 | `assets/resources/ui_generated/product_card/card_disabled.svg` | disabled shelf card, greyed out |
| 商品卡 wrong | 淡红卡片，珊瑚红粗描边 | 240x240 | 是 | 是 | `assets/resources/ui_generated/product_card/card_wrong.svg` | wrong product card, red warning outline |
| 库存胶囊底板 | 青绿色库存胶囊，深紫描边 | 132x42 | 是 | 是 | `assets/resources/ui_generated/product_card/inventory_pill.svg` | teal inventory pill |
| 商品库存角标 | 青绿色小角标 | 96x42 | 是 | 是 | `assets/resources/ui_generated/product_card/stock_badge.svg` | stock corner badge |
| 加工需求角标 | 紫色/红橙火焰角标 | 88x42 | 是 | 是 | `assets/resources/ui_generated/product_card/heat_badge.svg` | heat requirement badge |
| 微波炉加工进度环 | 红橙圆环，中心火焰 | 92x92 | 是 | 否 | `assets/resources/ui_generated/device/microwave_progress_ring.svg` | microwave processing ring, flame center |
| 微波炉完成提示 | 绿色完成勾，黄色光点 | 58x58 | 是 | 否 | `assets/resources/ui_generated/device/microwave_ready_badge.svg` | ready check badge with small sparkle |
| 收入飘字底板 | 金黄色小圆角牌 | 150x58 | 是 | 是 | `assets/resources/ui_generated/feedback/income_float_bg.svg` | income floating text background |
| Combo 牌 | 紫色/黄色连击牌 | 170x62 | 是 | 是 | `assets/resources/ui_generated/feedback/combo_badge.svg` | combo badge, playful arcade UI |
| Perfect 评价牌 | 黄色高光评价牌 | 160x62 | 是 | 是 | `assets/resources/ui_generated/feedback/perfect_badge.svg` | PERFECT rating badge |
| Good 评价牌 | 薄荷绿评价牌 | 140x58 | 是 | 是 | `assets/resources/ui_generated/feedback/good_badge.svg` | GOOD rating badge |
| Rush 评价牌 | 红橙评价牌 | 140x58 | 是 | 是 | `assets/resources/ui_generated/feedback/rush_badge.svg` | RUSH rating badge |
| 金币飞行 sprite | 圆形金币，深紫描边，中心 `$` | 48x48 | 是 | 否 | `assets/resources/ui_generated/feedback/coin_sprite.svg` | coin sprite for fly animation |
| 错误轻提示底板 | 红色圆角 toast 底板 | 300x64 | 是 | 是 | `assets/resources/ui_generated/feedback/error_toast_bg.svg` | error toast background |
| 火焰 icon | 红橙火焰，深紫描边 | 48x48 | 是 | 否 | `assets/resources/ui_generated/common/flame_icon.svg` | flame icon for heating |

## 转 PNG 建议

- 面板/气泡/卡片类：按原始尺寸导出 PNG，Cocos SpriteFrame 设置 `SLICED`，建议九宫格边距 24px。
- 胶囊/标签类：建议九宫格边距 18px。
- Icon 类：保持 SVG 或导出同尺寸 PNG，不需要九宫格。
- 粒子和飞行动效：优先使用单张 sprite + Tween/粒子，不做帧动画。
