# 运行时素材清单 V1

## 角色

| id | 状态 | 文件 | 尺寸 | 透明底 | 建议 |
| --- | --- | --- | --- | --- | --- |
| normal | waiting | `assets/resources/game-art/characters/normal/waiting.png` | 512x512 | 是 | 保留 |
| normal | urgent | `assets/resources/game-art/characters/normal/urgent.png` | 512x512 | 是 | 保留 |
| normal | happy | `assets/resources/game-art/characters/normal/happy.png` | 512x512 | 是 | 保留 |
| normal | angry | `assets/resources/game-art/characters/normal/angry.png` | 512x512 | 是 | 保留 |
| impatient | waiting | `assets/resources/game-art/characters/impatient/waiting.png` | 512x512 | 是 | 保留 |
| impatient | urgent | `assets/resources/game-art/characters/impatient/urgent.png` | 512x512 | 是 | 保留 |
| impatient | happy | `assets/resources/game-art/characters/impatient/happy.png` | 512x512 | 是 | 保留 |
| impatient | angry | `assets/resources/game-art/characters/impatient/angry.png` | 512x512 | 是 | 保留 |
| bulk-shopper | waiting | `assets/resources/game-art/characters/bulk-shopper/waiting.png` | 512x512 | 是 | 保留 |
| bulk-shopper | urgent | `assets/resources/game-art/characters/bulk-shopper/urgent.png` | 512x512 | 是 | 保留 |
| bulk-shopper | happy | `assets/resources/game-art/characters/bulk-shopper/happy.png` | 512x512 | 是 | 保留 |
| bulk-shopper | angry | `assets/resources/game-art/characters/bulk-shopper/angry.png` | 512x512 | 是 | 保留 |

## 商品

| id | 类型 | 文件 | 尺寸 | 透明底 | 建议 |
| --- | --- | --- | --- | --- | --- |
| snack-bag | 零食 | `assets/resources/game-art/items-transparent/snack-bag.png` | 512x512 | 是 | 已接入运行时 |
| lemon-drink | 饮料 | `assets/resources/game-art/items-transparent/lemon-drink.png` | 512x512 | 是 | 已接入运行时 |
| rice-ball | 热食 | `assets/resources/game-art/items-transparent/rice-ball.png` | 512x512 | 是 | 已接入运行时 |
| strawberry-milk | 饮料 | `assets/resources/game-art/items-transparent/strawberry-milk.png` | 512x512 | 是 | 已接入运行时 |
| pudding-cup | 甜品 | `assets/resources/game-art/items-transparent/pudding-cup.png` | 512x512 | 是 | 已接入运行时 |
| star-candy | 糖果 | `assets/resources/game-art/items-transparent/star-candy.png` | 512x512 | 是 | 已接入运行时 |

## 设备与场景

| id | 状态 | 文件 | 尺寸 | 透明底 | 建议 |
| --- | --- | --- | --- | --- | --- |
| microwave | idle | `assets/resources/game-art/equipment/microwave/idle.png` | 640x420 | 是 | 暂停运行时使用，视角需统一 |
| microwave | heating | `assets/resources/game-art/equipment/microwave/heating.png` | 640x420 | 是 | 暂停运行时使用，视角需统一 |
| microwave | ready | `assets/resources/game-art/equipment/microwave/ready.png` | 640x420 | 是 | 暂停运行时使用，视角需统一 |
| cashier | default | `assets/resources/game-art/equipment/cashier/default.png` | 640x420 | 是 | 暂停运行时使用，视角需统一 |
| delivery-tray | default | `assets/resources/game-art/equipment/delivery-tray/default.png` | 640x260 | 是 | 暂停运行时使用，改为交付垫方向 |
| unified-microwave | runtime | `assets/resources/game-art/equipment/unified/microwave.png` | 589x473 | 是 | 已接入运行时 |
| unified-delivery-pad | runtime | `assets/resources/game-art/equipment/unified/delivery-pad.png` | 637x314 | 是 | 已接入运行时，替代传送带语义 |
| unified-cashier | runtime | `assets/resources/game-art/equipment/unified/cashier.png` | 662x513 | 是 | 已接入运行时 |
| store-background | scene | `assets/resources/game-art/environment/store-background.png` | 750x1334 | 否 | 保留，作为背景层 |
| counter-front | foreground | `assets/resources/game-art/environment/foreground/counter-front.png` | 750x260 | 是 | 已停用，遮挡过高，需重做低矮柜台前缘 |
| equipment-strip | source | `docs/art/targets/equipment-strip-unified-v1.png` | 1922x818 | 是 | 统一设备组源图，已拆分接入 |

## 缺口清单

| id | 名称 | 优先级 | 用途 | 建议规格 |
| --- | --- | --- | --- | --- |
| ui-status-icons | 需要/加热/售罄/已交付图标 | P0 | 替换文字徽章 | 128x128，透明底 |
| fx-correct-spark | 正确交付星光 | P1 | 点击正确反馈 | 256x256 序列或单图 |
| fx-coin-fly | 金币飞行动效图 | P1 | 收益反馈 | 128x128，透明底 |
