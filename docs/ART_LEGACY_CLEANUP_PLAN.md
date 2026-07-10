# 美术旧目标与旧资源清理计划

更新时间：2026-06-27

角色：主线程统筹 + 美术 / UI + 产品策划 + 开发 / 测试

状态：review / archived

## 目的

当前经营页已转向整屏 final art 重构。旧目标图、旧 P0 占位、旧订单气泡候选和托盘交付文档容易误导后续美术生成与开发接入。

本文件只列清理边界，不执行删除。实际删除或归档必须由用户确认。

## 唯一保留为当前目标

当前经营页唯一权威目标图：

`assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

不能删除、改名或移动，除非同步更新所有引用。

## 不能直接删除

以下仍被 runtime 或当前文档依赖，不能按目录一刀切删除：

| 路径 | 原因 |
| --- | --- |
| `assets/resources/ui_p0/gameplay-fix-pack/ready_badge_compact.png` | 当前 runtime READY 占位加载路径，frozen baked placeholder |
| `assets/resources/ui_p0/gameplay-first-pack/order_bubble_active.png` | 当前 runtime P0 气泡 fallback |
| `assets/resources/ui_p0/gameplay-first-pack/order_bubble_normal.png` | 当前 runtime P0 气泡 fallback |
| `assets/resources/ui_p0/gameplay-first-pack/order_bubble_partial.png` | 当前 runtime P0 气泡 fallback |
| `assets/resources/ui_formal_v2/production/order/order_bubble_selected.png` | 当前 runtime formal order bubble fallback |
| `assets/resources/ui_formal_v2/production/order/order_bubble_normal.png` | 当前 runtime formal order bubble fallback |
| `assets/resources/ui_p0/**` | 多个资源仍由 `MonsterStorePrototype.ts` 动态加载 |
| `assets/resources/ui_layered/product_card_v1/**` | 当前商品卡分层 runtime 结构可复用 |
| `assets/resources/game-art/**` | 当前角色、背景、设备和商品 fallback |

这些资源可以在 final art 接入完成后逐个替换，但现在不能整包删除。

## 可列为待归档

以下不应继续作为 active final art 目标或生产依据，已归档到：

`archive/art-legacy-2026-06-27/`

| 路径 | 建议 | 原因 |
| --- | --- | --- |
| `assets/ui/mockups/gameplay-main-v1.png` | archive | 旧经营页目标 |
| `assets/ui/mockups/gameplay-main-dual-customer-v2.png` | archive/reference | 旧双顾客目标，已被 READY 订单气泡 V2 取代 |
| `docs/art/concepts/monster-store-v3-gameplay.png` | archive/reference | 旧概念图 |
| `docs/art/concepts/monster-store-v3.1-gameplay.png` | archive/reference | 旧概念图 |
| `docs/art/concepts/monster-store-v3.1-gameplay-final.png` | archive/reference | 旧 V3.1 基准，不再是当前权威目标 |
| `docs/art/targets/gameplay-layout-target-v2.png` | archive/reference | 旧布局目标 |
| `docs/art/ui/UI_STYLE_TARGET_V3.md` | archive/reference | 旧 UI V3 生产方向 |
| `docs/art/V3_1_VISUAL_SPEC.md` | archive/reference | 旧 V3.1 视觉规范 |
| `docs/UI_ART_P0_GENERATION_PLAN.md` | archive/reference | 旧 SVG / P0 生成计划 |
| `docs/UI_ART_EXPORT_INDEX.md` | archive/reference | 指向已删除 `ui_generated` 资源 |
| `docs/DELIVERY_AND_FEEDBACK_PLAN.md` | archive/reference | 旧托盘交付方案 |
| `docs/DELIVERY_FEEDBACK_TODO.md` | archive/reference | 旧托盘交付 TODO |
| `docs/M1_VERTICAL_SLICE_ACCEPTANCE.md` | archive/reference | 旧托盘验收口径 |

归档前需保留“为什么废弃”的记录，避免未来误用。

## 可列为待删除或待重建

以下不是 runtime 入口，已归档到：

`archive/art-legacy-2026-06-27/`

| 路径 | 建议 | 原因 |
| --- | --- | --- |
| `assets/ui/final-candidates/order-bubble/` | delete or archive | manifest 标注 `candidate-not-final`，旧订单气泡候选不再作为 final pack |
| `assets/ui/derived/gameplay-v2/` | archive | 目标图切片，只能 reference / placeholder，不是 final art |
| `assets/ui/p0/gameplay-first-pack/` | archive | P0 源输出副本，不是 runtime resources 路径 |
| `assets/ui/p0/gameplay-fix-pack/` | archive | P0 源输出副本，runtime 副本在 `assets/resources/ui_p0` |
| `assets/ui/p0/gameplay-product-pack/` | archive | P0 商品源输出副本 |
| `assets/ui/p0/gameplay-feedback-pack/` | archive | P0 反馈源输出副本 |

注意：`assets/ui/p0/**` 是源 / 记录副本；`assets/resources/ui_p0/**` 是 runtime 路径，不能混删。

## 旧订单气泡处理口径

当前旧订单气泡状态：

- `assets/ui/final-candidates/order-bubble/` 仅为旧候选记录。
- 当前 runtime 没有引用 `assets/ui/final-candidates/order-bubble/*`。
- 当前 runtime 没有引用 `order_bubble_ready` / `p0-bubble-ready`。
- 当前 runtime READY badge 使用 `assets/resources/ui_p0/gameplay-fix-pack/ready_badge_compact.png`，它继续冻结。

后续 final art 应重新生产：

- `order_bubble_current_9slice.png`
- `order_bubble_waiting_9slice.png`
- `order_slot_filled_overlay.png`
- `order_check.png`
- `order_ready_badge_9slice.png`
- `order_ready_glow.png`

旧候选不作为新版 final art 基础。

## 建议清理顺序

1. 更新 Art Guide 和任务板，先锁权威目标。
2. 标记旧文档为 archived/reference，不立即删除。
3. 归档旧 mockup、旧 concepts、旧 UI V3 文档和旧托盘方案。
4. 归档 `assets/ui/p0/**` 与 `assets/ui/derived/**` 源/参考资源。
5. 删除或归档 `assets/ui/final-candidates/order-bubble/`。
6. 等 final art runtime 接入完成后，再逐个替换 `assets/resources/ui_p0/**`。

## 最小验证命令

实际删除或移动前后至少执行：

```bash
rg -n "ui_p0/|ui_formal_v2/production/order|order_bubble|ready_badge|gameplay-main-order-bubble-ready-v2|final-candidates/order-bubble|assets/ui/p0|assets/ui/derived" assets/scripts assets/scenes docs
npx --yes -p typescript@5.6.3 tsc --noEmit --project tsconfig.json --skipLibCheck --lib ES2017,DOM
```

若涉及 `assets/resources/**`，还需要用 Cocos Creator 3.8.8 打开 `assets/scenes/Game.scene`，手点 READY 气泡、商品卡、微波炉、收银反馈。

## 待用户确认

本轮已执行归档，不执行删除。

已执行项：

- 已将旧目标图和旧 UI V3 文档统一移动到 archive。
- 已归档 `assets/ui/p0/**` 与 `assets/ui/derived/**`。
- 已归档旧 `assets/ui/final-candidates/order-bubble/`。
- 已将旧托盘方案文档移动到 archive 作为历史记录。
