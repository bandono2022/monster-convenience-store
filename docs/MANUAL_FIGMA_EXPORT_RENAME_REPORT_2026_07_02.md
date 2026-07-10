# Manual Figma Export Rename Report - 2026-07-02

目标：把用户手动从 Figma 导出的资源复制到整理区并规范命名，作为进入 `ui_gameplay_final_v1` 前的 review/staging 包。

## Owner / Brief / Review / Record

- Owner：Development/testing 负责文件盘点、命名、尺寸和后续接入风险。
- Brief：用户已手动导出 Figma 资源，要求协助改名；本轮只整理文件，不改 runtime，不归档旧资源。
- Review：Art/UI 基于总览图复核资源是否与权威目标图一致；Product 复核 READY、订单、HUD、库存等动态语义不被错误烘焙。
- Record：本文、`manual-figma-export-2026-07-02-normalized/MANIFEST.md`、`docs/LOCAL_TASK_BOARD.md`。

## Output

- 原始导出：`manual-figma-export-2026-07-02/`
- 规范命名整理区：`manual-figma-export-2026-07-02-normalized/`
- 规范命名 manifest：`manual-figma-export-2026-07-02-normalized/MANIFEST.md`
- 原始导出总览：`output/manual-figma-export-2026-07-02/manual_figma_export_contact_sheet_2026_07_02.png`
- 规范命名总览：`output/manual-figma-export-2026-07-02/manual_figma_export_normalized_contact_sheet_2026_07_02.png`

本轮复制并改名 46 张 PNG。原始导出文件未被修改。

## Mapping Summary

已识别并规范命名：

- 2 个顾客，每个 6 层：body、neutral face、happy face、impatient face、left hand、right hand。
- 6 个商品：snack bag、lemon drink、rice ball、pudding cup、chocolate milk、candy bag。
- 5 个设备状态：cashier idle/pay、microwave idle/heating/ready。
- 2 个柜台/台面资源：counter foreground、counter worktop midground。
- 2 个订单气泡状态：selected base、unselected base。
- 订单 check、订单 slot base、READY baked badge。
- HUD top frame、coin/time bases、coin/clock/pause icons。
- 5 个底部入口 icon。
- Product card base 与 stock badge base。
- 完整 `390x844` QA 画板两张。
- 独立背景图一张。

## Review Risks

- `order/order_ready_badge_baked_ready.png` 带有 baked `READY` 字样，不是 empty capsule。若最终要 runtime 动态文字，应使用另一个空胶囊资源或从 Figma 重新导出 empty base。
- 完整 `PLACEMENT_CANVAS__390x844 01/02` QA 截图已补齐。
- 独立 `background_store.png` 已补齐，尺寸为 `390x844`。
- 用户确认 `nav_bottom_bar_base`、`nav_slot_base` 不需要单独导图；底部纯色基底和 slot 由 runtime 按 Figma 间距 / 层级 / 安全区绘制。
- 用户确认 `hud_timer_progress_track`、`hud_timer_progress_fill` 也由 runtime 绘制和动态控制，不再作为缺失素材。
- 多数导出尺寸是 Figma 当前摆放尺寸，例如 `order_check.png` 为 `48x48`、READY badge 为 `164x60`，这对 runtime 精准摆位有利，但不应再当作原始高分资源。

## Current Gate

状态：`review / normalized-ready / user-visual-check-needed`

下一步不应直接接入代码。先由用户检查规范命名总览图，确认没有错名、错态或缺图；通过后再把规范命名包复制到 `assets/resources/ui_gameplay_final_v1/` 并让 Cocos 生成新的 `.meta`。
