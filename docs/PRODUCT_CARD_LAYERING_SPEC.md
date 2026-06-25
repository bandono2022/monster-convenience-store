# 商品卡分层规范

本文档用于固定《怪兽便利店》商品卡的正式资源拆分方式。目标是让商品卡具备上线游戏所需的质感，同时避免每新增一个商品、分类或状态都重新生成整张卡。

## 分层原则

商品卡按“是否随玩法变化”拆分：

| 层级 | 内容 | 实现方式 | 是否动态 | 说明 |
|---|---|---|---|---|
| 1 | 商品卡底板 | PNG | 否 | 保留圆角、描边、奶油底色、名称槽、库存胶囊。 |
| 2 | 分类角标 | PNG | 是 | 热食、热门、普通/自然等类型独立叠加。 |
| 3 | 商品图标 | PNG Sprite | 是 | 使用现有透明商品图。 |
| 4 | 商品名称 | Cocos Label | 是 | 不烘焙进图片，方便多语言和数值调整。 |
| 5 | 库存数量 | Cocos Label | 是 | 不烘焙进图片，随库存变化。 |
| 6 | 选中/需要高亮 | 程序描边或 PNG Overlay | 是 | P0 可用 PNG 高亮框；后续可改粒子/发光。 |
| 7 | 售罄/锁定/错误状态 | 程序遮罩 + Label | 是 | 不单独为每个商品导出状态图。 |

## 当前 V1 拆分范围

V1 先拆到“底板 + 分类角标 + 动态内容”这一级。

暂时仍合并到底板的内容：

- 商品名称槽
- 库存胶囊底板
- 货箱小图标

原因：

- 这些元素短期在所有商品卡上保持一致。
- 分得太碎会增加 Cocos 节点数和布局复杂度。
- 当前最需要解决的是分类角标和商品内容复用，而不是库存胶囊换皮。

后续如果要做价格、稀有度、促销、不同货架类型，再把名称槽和库存胶囊继续拆成独立层。

## 资源路径

正式分层预览资源放在：

`assets/resources/ui_layered/product_card_v1/`

| 文件 | 用途 | 尺寸 | 透明 | 备注 |
|---|---|---:|---|---|
| `product_card_base_slots.png` | 商品卡底板 | 304 x 376 | 是 | 无分类角标、无商品图、无文字。 |
| `badge_heat_corner.png` | 热食角标紧凑资源 | 96 x 94 | 是 | 用于图集或设计预览。 |
| `badge_star_corner.png` | 热门角标紧凑资源 | 97 x 94 | 是 | 用于图集或设计预览。 |
| `badge_leaf_corner.png` | 普通/轻食角标紧凑资源 | 100 x 92 | 是 | 用于图集或设计预览。 |
| `badge_heat_overlay.png` | 热食角标全尺寸叠层 | 304 x 376 | 是 | 可直接与底板同坐标叠加。 |
| `badge_star_overlay.png` | 热门角标全尺寸叠层 | 304 x 376 | 是 | 可直接与底板同坐标叠加。 |
| `badge_leaf_overlay.png` | 普通/轻食角标全尺寸叠层 | 304 x 376 | 是 | 可直接与底板同坐标叠加。 |
| `state_selected_glow.png` | 选中/需要商品高亮 | 304 x 376 | 是 | 可选，P0 也可继续用程序描边。 |
| `state_disabled_overlay.png` | 锁定/售罄半透明遮罩 | 304 x 376 | 是 | 可选，P0 也可继续用程序遮罩。 |
| `product_card_star_clean_full.png` | 已清理星星卡整卡候选 | 304 x 376 | 是 | 仅作为回退或对比，不作为正式分层基础。 |

预览图：

`assets/reference/ui_samples/v9_product_card_layering/product_card_layering_v1_review.png`

## Cocos 节点建议

商品卡推荐节点结构：

```text
ProductCardRoot
  ProductCardBaseSprite
  ProductCardBadgeSprite
  ProductNeedGlowSprite / ProductNeedGlowNode
  ProductIconSprite
  ProductNameLabel
  ProductStockLabel
  ProductStateOverlay
  ProductStateLabel
```

建议渲染顺序：

1. 底板
2. 分类角标
3. 高亮/选中状态
4. 商品图
5. 商品名
6. 库存文字
7. 售罄/锁定/错误遮罩

注意：商品图、商品名、库存文字必须始终在底板上方，不能烘焙进商品卡 PNG。

## 当前游戏坐标参考

当前代码中的商品卡逻辑位于：

`assets/scripts/presentation/MonsterStorePrototype.ts`

当前尺寸与锚点：

| 项目 | 当前值 |
|---|---:|
| 商品卡节点尺寸 | `228 x 264` |
| 原始资源尺寸 | `304 x 376` |
| 商品图中心 | `y = 44` |
| 商品名称 | `y = -38` |
| 库存文字 | `x = 22, y = -91` |

后续接入分层资源时，优先保持这些运行时坐标不变，只替换底板和角标资源，避免再次大范围调整布局。

## 接入优先级

P0：

- `product_card_base_slots.png`
- `badge_heat_overlay.png`
- `badge_star_overlay.png`
- `badge_leaf_overlay.png`
- 商品图、商品名、库存文字继续由现有逻辑渲染

P1：

- `state_selected_glow.png`
- `state_disabled_overlay.png`
- 售罄/锁定状态统一成更清楚的状态牌

P2：

- 名称槽独立资源
- 库存胶囊独立资源
- 价格胶囊
- 稀有度、促销、货架类型角标

## 验收标准

- 新增商品时只需要替换商品图和商品名，不需要重新生成整张商品卡。
- 热食、热门、普通分类能通过角标切换实现。
- 商品名、库存数字清晰，且不被底图遮挡。
- 选中、售罄、锁定状态不会破坏商品卡本身质感。
- 资源在 `750 x 1334` 游戏实际尺寸下仍然清楚。

