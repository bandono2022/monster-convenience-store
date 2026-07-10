# Final Resource Local Preflight - 2026-07-02

目标：在 Figma MCP 暂时无法握手时，先完成本地资源白名单的存在性、尺寸和接入风险预检。本文不代表 Figma 节点已最终确认，也不触发归档、删除或 runtime 接入。

权威目标图仍为：

- `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

## Owner / Brief / Review / Record

- Owner：Development/testing 负责本地文件、尺寸、runtime 引用和接入风险预检。
- Brief：基于用户确认的 Figma 5 个权威画板范围，检查本地白名单草案是否已有可复制进最终 runtime namespace 的资源基础。
- Review：Art/UI 后续在 Figma 节点恢复后复核画板 fidelity；Product 复核状态语义；Coordination 只负责记录和下一步路由。
- Record：本文、`docs/FIGMA_TO_RUNTIME_RESOURCE_MANIFEST_2026_07_02.md`、`docs/ART_ARCHIVE_CANDIDATES_2026_07_02.md`、`docs/LOCAL_TASK_BOARD.md`。

## Preflight Result

状态：`local-pass / figma-node-blocked`

- 本地白名单草案中的核心 PNG 均存在。
- 已检查的尺寸与 `docs/FIGMA_TO_RUNTIME_RESOURCE_MANIFEST_2026_07_02.md` 记录一致。
- 当前不能声明 `review-ready`，因为 Figma MCP 仍返回 `failed to get client` / handshake timeout，无法补齐最新 node id、image hash、layer name 和 localPath metadata。
- 本轮没有移动、删除、归档任何文件，也没有改 runtime 代码。

## Size Checks

Products:

- 6 个当前商品图标均为 `1254x1254`：零食包、柠檬饮料、饭团、布丁杯、巧克力牛奶、糖果袋。
- `product_strawberry_milk_v1.png`、`product_star_candy_v1.png` 也存在且为 `1254x1254`，但当前只能保持 `archive-candidate / pending-figma-confirmation`。

Equipment / counter:

- 微波炉三态、收银机两态均为 `640x420`。
- `counter_foreground_v1_revise_tall_wall.png` 为 `1536x360`。
- `counter_worktop_midground_v1.png` 为 `1536x300`。
- 旧 `counter_foreground_v1.png` 也存在，为 `1536x260`，除非 Figma 证明被使用，否则保持 archive candidate。

Customers:

- Blue teal placement 拆层均存在：body `676x668`，三张 face 分别为 `236x257`、`263x289`、`281x234`，左右手分别为 `175x163`、`178x164`。
- Purple hoodie placement 拆层均存在：body `620x685`，三张 face 分别为 `221x277`、`262x300`、`277x243`，左右手均为 `194x154`。
- `rig_canvas/`、`_sources/`、`_qa/` 是生产 / 预检材料，不是 runtime final。

Order / READY:

- Selected base、unselected base、selected yellow overlay 均为 `1727x910`，尺寸一致，适合做状态替换或 base + overlay 模型。
- `order_check_v2.png` 为 `1254x1254`。
- `order_ready_capsule_empty.png` 为 `1774x887`，READY 文本应由 runtime 控制。

Product card:

- `product_card_base_target_v1.png` 为 `205x180`。

HUD / Nav:

- `hud_top_frame_base_390w_v1.png` 为 `390x68`；早前 Figma 读取曾看到 headbar 高约 `76.1`，需等 Figma 精读确认当前画板是否缩放或是否用的是 Figma 形状。
- HUD coin / clock / pause icon 均为 `128x128`。
- Timer track / fill 均为 `116x12`。
- 5 个底部入口 icon 均为 `128x128`。
- `nav_bottom_bar_base_390w_v1.png` 为 `390x78`，`nav_slot_base_v1.png` 为 `66x56`。
- 同包中还存在 `hud_star_full_v1.png`、`hud_star_empty_v1.png`、`nav_alert_badge_v1.png`、`nav_slot_active_v1.png` 等备用图；当前未纳入 final whitelist，等待 Figma 节点确认。

Background:

- 当前可定位 runtime 背景为 `assets/resources/ui_probe_gameplay_v1/background/store_background.png`，尺寸 `750x1334`。
- `current_customer_halo.png` 为 `512x512`，是否使用等待 Figma 精读。
- `assets/art-source/environment/store-background-source-v1.png` 为 `941x1672`，属于源图，不应作为 runtime final 直接引用。

## Runtime Reference Risk

当前 `assets/scripts/presentation/MonsterStorePrototype.ts` 和 `ProductCatalog.ts` 仍引用：

- `assets/resources/ui_probe_gameplay_v1/`
- `assets/resources/ui_probe_gameplay_v2/`
- `assets/resources/ui_probe_gameplay_v3/`
- `assets/resources/ui_formal_v2/`
- `assets/resources/ui_p0/`
- `assets/resources/game-art/`

当前没有 `ui_gameplay_final_v1` runtime 引用。因此：

- 以上 runtime 目录现在不能归档。
- 最终接入前应先创建或复制到 `assets/resources/ui_gameplay_final_v1/`，再由 Development/testing 进行最小代码迁移和构建 / 截图 QA。
- 只有 runtime 迁移通过后，旧 probe / generated / p0 包才能进入第二轮归档。

## Development Recommendation

Figma MCP 恢复前，最高价值的下一步不是改代码，而是保持本地白名单稳定：

1. 等 Figma MCP 恢复后补齐 5 个权威画板的节点明细。
2. 将本文和 manifest 合并成 `ui_gameplay_final_v1` 复制计划。
3. 用户确认复制计划后，再创建最终 runtime namespace。
4. 最后才进入 Cocos 接入：路径映射、390x844 截图、750x1334 截图、触控路径和构建检查。
