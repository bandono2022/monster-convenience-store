# 怪兽便利店素材生成模板

所有正式素材生成都必须引用：

- `assets/reference/style-exploration-flat-cartoon-v1.png`
- `docs/art/ART_GUIDE.md`

## 通用风格尾缀

```text
Style: polished flat 2D casual mobile game illustration, bold consistent
dark-plum outlines, clean vector-like shapes, simple color blocks, bright and
friendly, highly readable at phone size.

Palette: coral red #FF6254, mint green #67C7A5, sunny yellow #FFC247,
cream #FFF3D6, dark plum #33213E, teal #369EAA.

Constraints: consistent front or slightly top-down view, light from upper left,
simple shapes, no readable text, no logo, no watermark, no copyrighted
character, no 3D clay, no realistic rendering, no complex texture.
```

## 怪兽部件模板

```text
Create one modular monster component for Monster Convenience Store:
{PART_DESCRIPTION}. Match Monster 01 exactly in outline thickness, palette,
lighting, scale, and front-view perspective. Keep the component isolated with
generous padding and suitable for pivot-based animation.
```

## 商品模板

```text
Create one product icon for Monster Convenience Store: {PRODUCT_DESCRIPTION}.
Use a square composition. The product occupies about 80% of the canvas.
Packaging uses simple decorative shapes without readable text. It must remain
instantly recognizable when displayed as a small order icon.
```

## 场景模板

```text
Create one convenience-store environment asset: {SCENE_DESCRIPTION}.
Use the same slightly top-down perspective as the gameplay mockup. Keep the
central interaction area uncluttered and preserve strong visual separation
between customer, counter, and product areas.
```

## 动效贴图模板

```text
Create a small reusable game-effect sprite: {EFFECT_DESCRIPTION}. Use a simple
silhouette, high contrast, and no background. The effect must work with scale,
rotation, fade, and color-tint animation.
```

## 验收问题

- 缩小到实际游戏尺寸后还能辨认吗？
- 描边、光源和色板与母版一致吗？
- 是否包含不需要的文字或品牌信息？
- 是否可以通过简单的缩放、旋转和替换完成动画？
- 是否值得作为正式资产继续清理和拆分？
