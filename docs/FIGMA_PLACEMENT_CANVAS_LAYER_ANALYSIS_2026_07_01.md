# Figma Placement Canvas Layer Analysis - 2026-07-01

目标：把 Figma 中已接入的两个 390x844 UI 画板读取成开发可用的层级、坐标和资源映射参考。本文只记录读取与分析结果，不改代码、不改美术、不把候选资源升级为 runtime final。

权威目标图仍为：

- `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png`

Figma 来源：

- File: `Q8wMVbJYaJ6QDR4ggrHZGo`
- Page: `Monster Store Art Placement`
- Frame 01: `PLACEMENT_CANVAS__390x844 01`, node `98:61`
- Frame 02: `PLACEMENT_CANVAS__390x844 02`, node `100:372`

## Owner / Brief / Review / Record

- Owner: Development/testing owns the runtime translation path; Art/UI owns fidelity and visual layer judgment.
- Brief: read the two user-placed Figma canvases and turn them into a development layer map. Do not modify Figma, do not reorganize assets, do not start Cocos integration.
- Review: Art/UI reviews whether Figma placement matches the authoritative target image; Development/testing reviews whether the mapping is safe to implement without guessing asset ownership.
- Record: this document and `docs/LOCAL_TASK_BOARD.md`.

## Coordinate Convention

Figma frames are `390 x 844`, with origin at top-left.

Runtime conversion for a Cocos node centered in the frame:

```text
cocosX = figmaX + width / 2 - 195
cocosY = 422 - (figmaY + height / 2)
```

Figma child order is used as visual z-order: later children draw above earlier children. Because the two frames have a few inconsistent z-order placements, runtime should use named layer containers rather than blindly copying child index order.

## High-Level Findings

- Both frames are the same 390x844 playable composition: top HUD, two customers, two order bubbles, counter/equipment, 6 product cards, and 5 bottom nav entries.
- Frame 01 and 02 are not fully different gameplay states. The primary difference is hand visibility/position:
  - Frame 01 shows blue/teal current hands on the left customer.
  - Frame 02 shows purple hoodie hands on the right customer.
- User clarification after this read: resources used in these two placement canvases may be treated as final runtime resources. Frame 02 is intended to represent the right customer as current; its selected order bubble should be on the right. The correction is to swap/replace only the selected/unselected bubble base state, not to rebuild the full slot/product/check layout.
- Most image nodes do not contain `monster_store_art.localPath` metadata. Only a small subset, such as `order_check_v2`, has usable local path metadata. Development must not infer exact local files solely from generic Figma names like ` 18`, ` 19`, or `image 1`.
- Figma currently uses `counter_foreground_v1_revise_tall_wall 2`; earlier docs had marked this resource risky, but the user has now clarified that resources actually used in these placement canvases may be final runtime resources. Treat the old risk as a historical note, not an automatic blocker; Development still must map the exact local source path before coding.
- Product cards, stock badge bases, top HUD panels, progress track/fill, and the lower product area are drawn as shapes in Figma. Runtime should reproduce these as Cocos shapes or controlled UI primitives, not necessarily import them as bitmaps.

## Runtime Layer Plan

Use this as the implementation order, not the raw Figma index order:

1. `background`
   - Full 390x844 store background.
2. `customers/body`
   - Left and right customer body bases.
3. `hud/base`
   - Top dark bar and HUD backing panels.
4. `counter/base`
   - Counter ledge/worktop and equipment shelf placement.
5. `customers/face`
   - Face overlays above bodies.
6. `customers/hands`
   - Current customer's separated hands only.
   - Keep hands above body/counter ledge but below order bubbles and top HUD.
7. `equipment`
   - Microwave and cashier.
8. `orders`
   - Selected/unselected order bubble bases, slot shapes, product icons, checks, READY capsule/text.
9. `product-area`
   - Lower purple area, card panel, product cards, product icons, stock badges, stock text.
10. `nav`
   - Bottom five entries, icon-only unless labels are later added.
11. `hud/dynamic`
   - Runtime text and timer progress.

This order is slightly normalized versus Figma because frame 01 and 02 place hands at different raw z-indices.

## Frame Shared Layout

### Background

| Node | Box | Cocos center | Notes |
| --- | ---: | ---: | --- |
| `PLACEMENT_CANVAS__390x844` | `0,0,390,844` | `0,0` | Background image fill plus white fill. Figma metadata has `role=placement_canvas`, but no local path. |

Current local background situation:

- Figma image hash: `6cc1c686...`
- Documented final-candidate path `assets/ui/final-candidates/gameplay-background-v1/background/store_background_clean_750x1334_v1.png` is not present in the current worktree.
- Existing local candidates found:
  - `assets/resources/ui_probe_gameplay_v1/background/store_background.png` (`750x1334`)
  - `assets/resources/game-art/environment/store-background.png` (`750x1334`)
  - `assets/art-source/environment/store-background-source-v1.png` (`941x1672`)
  - `assets/ui/final-candidates/gameplay-first-batch-v1/environment/store_bg_playfield.png` (`941x1672`)

Development should require a resource整理 step before final runtime integration, so the background does not silently come from a probe/runtime directory.

### Customers

| Purpose | Node(s) | Box | Cocos center | Suggested local candidate |
| --- | --- | ---: | ---: | --- |
| Left body | `customer_blue_teal_animation_rig_v1_chroma 1` | `25,168,161,178` | `-89.5,165` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/blue_teal/placement/body_base_v1.png` |
| Right body | ` 1` | `205,168,161,178` | `90.5,165` | `assets/ui/final-candidates/gameplay-customers-animation-v1/characters/purple_hoodie/placement/body_base_v1.png` |
| Left face | `face_neutral_v1 2` | `82,209,47,59` | `-89.5,183.5` | `.../blue_teal/placement/face_neutral_v1.png` |
| Right face | `face_neutral_v1 3` | `260,209,47,59` | `88.5,183.5` | `.../purple_hoodie/placement/face_neutral_v1.png` |

Customer candidate source dimensions:

- Blue body: `676x668`
- Blue face neutral: `236x257`
- Blue hands: `175x163` and `178x164`
- Purple body: `620x685`
- Purple face neutral: `221x277`
- Purple hands: `194x154` each

Runtime should not stretch all customer parts by the same display rectangle unless the part anchors are reconstructed. Figma placement uses independent tight PNG rectangles for body, face, and hands.

### Current Hands State

| Frame | Customer | Node | Box | Cocos center |
| --- | --- | --- | ---: | ---: |
| 01 | left blue/teal | `left_hand_v1 2` | `23,292,42,39.12` | `-151,110.44` |
| 01 | left blue/teal | `right_hand_v1 2` | `145,292,42.33,39` | `-28.84,110.5` |
| 02 | right purple | `left_hand_v1 2` | `206,295,44,35` | `33,109.5` |
| 02 | right purple | `right_hand_v1 2` | `320,294.5,44,35` | `147,110` |

Development note:

- The current hand state should follow the current customer. Frame 02 is right-current; runtime should render the right order bubble as selected and the left order bubble as unselected.
- Frame 01 hands are lower in z-order than order bubbles; frame 02 hands are the last two children and therefore above order bubbles. Runtime should normalize this: hands above body/counter ledge, below order bubbles.

### Top HUD

| Element | Box | Color / asset | Runtime note |
| --- | ---: | --- | --- |
| Top bar vector | `0,0,390,76.1` | `#292046` | Shape/vector. Local `hud_top_frame_base_390w_v1.png` is `390x68`, so confirm before substituting bitmap. |
| Coin panel | `7,13,116,38` | fill `#1f1833`, stroke `#100a21`, radius `12`, inner shadow `#594876` | Shape. |
| Timer panel | `137,13,116,54` | same style | Shape. |
| Coin icon | `15,17,30,30` | image | Local final candidate: `assets/ui/final-candidates/gameplay-hud-nav-target-v1/hud/hud_coin_icon_v2.png` (`128x128`). |
| Clock icon | `145,17,30,30` | image | Local final candidate: `.../hud_clock_icon_v2.png` (`128x128`). |
| Pause icon | `340,14,36,36` | image | Local final candidate: `.../hud_pause_button_v2.png` (`128x128`). |
| Money text | `53,12,54,40` | `1,258`, white, Baloo 24 | Runtime text. |
| Timer text | `179,12,58,40` | `01:20`, white, Baloo 24 | Runtime text. |
| Timer track | `145,53,100,8` | `#0c091e`, radius `10` | Runtime shape. |
| Timer fill | `146,54,68,6` | `#fca716` | Runtime shape or fill sprite. |

### Counter And Equipment

| Element | Node | Box | Cocos center | Suggested local candidate | Status |
| --- | --- | ---: | ---: | --- | --- |
| Counter foreground / ledge | `counter_foreground_v1_revise_tall_wall 2` | `-143,308,676,158` | `0,35` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/counter_foreground_v1_revise_tall_wall.png` | Risk: previously deprecated. |
| Worktop / shelf | ` 4` | `-120,422,630,124` | `0,-62` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/counter_worktop_midground_v1.png` | Usable candidate. |
| Cashier idle | ` 18` | `187,333.12,244,160` | `114,8.88` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/cashier_idle_v1.png` | Match by visual placement; no Figma localPath. |
| Microwave idle | ` 19` | `0,368.12,187,123` | `-101.5,-7.62` | `assets/ui/final-candidates/gameplay-equipment-v1/equipment/microwave_idle_v1.png` | Match by visual placement; no Figma localPath. |

Equipment source dimensions:

- `counter_foreground_v1.png`: `1536x260`
- `counter_foreground_v1_revise_tall_wall.png`: `1536x360`
- `counter_worktop_midground_v1.png`: `1536x300`
- `microwave_idle_v1.png`: `640x420`
- `cashier_idle_v1.png`: `640x420`

Art/UI note:

- The user has said the large counter scene is not needed and can be drawn with pure Figma/runtime shapes for now. Therefore the foreground wall node is a placement warning, not an automatic implementation target.

### Order Bubbles

| Element | Box | Cocos center | Notes |
| --- | ---: | ---: | --- |
| Left bubble image | `0,77.25,196.44,103.51` | `-96.78,293` | Selected/current-looking bubble with yellow outline. No localPath metadata. |
| Right bubble image | `193.56,77.25,196.44,103.51` | `96.78,293` | Waiting/unselected-looking bubble. No localPath metadata. |
| Left slot bases | x `28.65`, `77.63`, `126.61`; y `101.27`; size approx `42.5-43.4 x 48.98` | centers `-144.63`, `-96.11`, `-47.13` / y `296.24` | Runtime shapes: fill `#eed7b5`, stroke `#c8b194`, radius `6.47`. |
| Right slot bases | x `220.88`, `269.86`, `317.92`; y `101.27`; size approx `42.5-43.4 x 48.98` | centers `47.13`, `96.12`, `144.64` / y `296.24` | Same runtime shapes. |
| Order product icons | 40x40 at x `30`, `78`, `128`, `223`, `271`, `321`; y `106` | y center `296` | Use the same product sprites as product cards, scaled to 40. |
| Checks | 24x24 at `54,133`, `103,133`, `152,133` | centers `-129`, `-80`, `-31` / y `277` | Figma localPath exists: `assets/ui/final-candidates/gameplay-retry-v1/order/order_check_v2.png`. |
| READY capsule | `58,161,82,30` | `-96,246` | Group uses image capsule plus runtime/text layer `ready`. |

Existing local order resources:

- `assets/ui/final-candidates/gameplay-retry-v1/order/order_bubble_current_base_no_slots_v2.png` (`1727x910`)
- `assets/ui/final-candidates/gameplay-order-bubble-states-v1/order/order_bubble_unselected_no_yellow_outline_v3.png` (`1727x910`)
- `assets/ui/final-candidates/gameplay-order-bubble-states-v1/order/order_bubble_selected_yellow_outline_overlay_v3.png`
- `assets/ui/final-candidates/gameplay-retry-v1/order/order_check_v2.png` (`1254x1254`)
- `assets/ui/final-candidates/gameplay-retry-v1/order/order_ready_capsule_empty.png` (`1774x887`)

Implementation recommendation:

- Use unselected base + selected yellow outline overlay if Art/UI confirms this as the final state model.
- Do not use the old baked READY placeholder behavior for this Figma state. READY text is visible as a separate Figma text layer here, unlike the frozen `ready_badge_compact.png` placeholder rule.

### Product Area

Lower area:

- `Rectangle 1`: `0,528,390,316`, fill `#3b2c4f`
- `Group 2 > Rectangle 2`: `16,540,358,218`, fill `#56527c`, stroke `#110d24` weight `2`, radius `9`

Product card grid:

| Slot | Card box | Icon box | Stock badge | Stock text |
| --- | ---: | ---: | ---: | --- |
| top-left | `25,555,110,91` | `40,560,80,80` | `95,620,30,16` | `x04` at `100,619` |
| top-mid | `140,555,110,91` | `155,560,80,80` | `210,620,30,16` | `x02` at `215,619` |
| top-right | `255,555,110,91` | `270,560,80,80` | `325,620,30,16` | `x01` at `331,619` |
| bottom-left | `25,651,110,91` | `40,656,80,80` | `95,716,30,16` | `x03` at `100,715` |
| bottom-mid | `140,651,110,91` | `155,656,80,80` | `210,716,30,16` | `x05` at `215,715` |
| bottom-right | `255,651,110,91` | `270,656,80,80` | `325,716,30,16` | `x06` at `330,715` |

Card shape:

- Outer: fill `#fef7e9`, stroke `#341939`, stroke weight `2`, radius `16`
- Inner: inset `6`, fill `#fbebd4`, stroke `#f2d9b5`, stroke weight `1`, radius `10`
- Stock badge: fill `#665356`, stroke `#4a3840`, stroke weight `1`, radius `6`
- Stock text: white, `Baloo_2 SemiBold`, size `12`

Product icon mapping by visual position:

| Product | Product-card position | Order-slot position | Suggested local path |
| --- | --- | --- | --- |
| Snack bag | top-left | left slot 1 and right slot 1 | `assets/ui/final-candidates/gameplay-retry-v1/products/product_snack_bag_v2.png` |
| Lemon drink | top-mid | left slot 2 and right slot 2 | `assets/ui/final-candidates/gameplay-retry-v1/products/product_lemon_drink_v4.png` |
| Rice ball | top-right | left slot 3 and right slot 3 | `assets/ui/final-candidates/gameplay-products-target-v2/products/product_rice_ball_target_v2.png` |
| Pudding | bottom-left | not in active bubbles | `assets/ui/final-candidates/gameplay-retry-v1/products/product_pudding_cup_v2.png` |
| Chocolate milk | bottom-mid | not in active bubbles | `assets/ui/final-candidates/gameplay-products-target-v2/products/product_chocolate_milk_target_v2.png` |
| Candy bag | bottom-right | not in active bubbles | `assets/ui/final-candidates/gameplay-products-target-v2/products/product_candy_bag_target_v2.png` |

Product sprites above are all currently `1254x1254`. Figma scales them to `80x80` in product cards and `40x40` in order slots. User has said product icon visual normalization will be handled separately in Figma; Development should not overfit the current icon crop/scaling until the user exports the normalized group.

### Bottom Nav

| Semantic | Box | Cocos center | Local candidate |
| --- | ---: | ---: | --- |
| task / order record | `16,770,62,62` | `-148,-379` | `assets/ui/final-candidates/gameplay-hud-nav-target-v1/nav/nav_icon_task_v2.png` |
| procurement | `90,770,62,62` | `-74,-379` | `.../nav_icon_procurement_v2.png` |
| inventory | `164,770,62,62` | `0,-379` | `.../nav_icon_inventory_v2.png` |
| upgrade | `238,770,62,62` | `74,-379` | `.../nav_icon_upgrade_v2.png` |
| catalog / recipe book | `312,770,62,62` | `148,-379` | `.../nav_icon_catalog_v2.png` |

All local final nav icons are `128x128`; Figma displays them at `62x62`.

## State Differences Between Frame 01 And Frame 02

| Area | Frame 01 | Frame 02 | Dev implication |
| --- | --- | --- | --- |
| Left hands | visible at `23,292` and `145,292` | absent | current-left candidate. |
| Right hands | absent | visible at `206,295` and `320,294.5` | current-right candidate. |
| Selected/READY order bubble | left side | should be right side | User clarified: only swap/replace the selected bubble base state for frame 02; keep slot/product/check placement model. |
| Product area, HUD, nav, equipment | same | same | Can share one layout configuration. |
| Hand z-order | before equipment/order group | last two children | Normalize in runtime layer containers. |

## Development Resource Decisions For The Next Step

Development/testing may use this Figma read as a final-resource placement reference, with the following constraints:

1. Resource metadata gap:
   - Most Figma image nodes have no local path metadata.
   - Create a small explicit manifest before coding: `figmaNodeId`, `semanticId`, `displayBox`, `localPath`, `status`.
2. Frame 02 order bubble correction:
   - Treat frame 02 as right-current.
   - Replace/swap only the selected/unselected bubble base state so the right bubble is selected and the left bubble is unselected.
   - Do not rebuild all slots/products/checks for this correction unless later Figma placement changes.
3. Counter foreground:
   - The user clarified that resources used in the Figma placement may be final runtime resources.
   - Development may therefore preserve the placed counter/ledge look when translating the canvas, while still recording the exact local source path in the manifest.
4. Background final-candidate gap:
   - Restore or re-export the final-candidates background pack, or explicitly promote a probe background into a named candidate after review.
5. Product icon normalization:
   - Wait for the user-exported normalized Figma product group before final icon scaling.

## Minimal Safe Next Development Task

Do not start runtime visual rewrite yet. The next smallest useful task is:

- Create `docs/FIGMA_TO_RUNTIME_RESOURCE_MANIFEST_2026_07_01.md`.
- Fill it with only the semantically confirmed resources from this analysis.
- Mark ambiguous resources as `blocked`, especially background path, counter foreground, order bubble selected/unselected ownership, and frame 02 current state.

After that manifest is reviewed, Development/testing can implement a small Cocos placement probe using the normalized layer containers above.
