# 经营页美术分层工作指导

更新时间：2026-06-29

目标：按 `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png` 还原经营页，不再用整屏大图或大块合成图硬贴。

## 当前结论

- 用户提出的分层方案成立，产品和美术/UI均认可。
- 现有资源可支持最小接入评估，但顾客资源只是候选，不是最终目标图还原级。
- 下一轮美术优先修“顾客 body + hands 分层”和 HUD v2，不继续扩新物件。
- 所有美术风格和质感都必须向权威目标图靠近；现有资源即使曾经 pass，也需要按目标图重新复核一遍。

## 目标图复核规则

每个候选资源进入 final art 前，都要对照 `assets/ui/mockups/gameplay-main-order-bubble-ready-v2.png` 复核：

- 轮廓粗细、深紫黑描边是否一致。
- 体积、高光、阴影是否接近目标图商业手游质感。
- 饱和度、明度、材质是否和整屏统一。
- 视角是否保持正面略俯视。
- 是否支持目标图的遮挡关系和焦点层级。
- 是否存在“单张可用但整屏不像目标图”的问题。

复核结果应明确标记：

- `target-pass`：可按目标图进入 final art 候选。
- `integration-candidate`：可用于最小接入评估，但不是最终目标图还原级。
- `revise`：需要修订。
- `archive`：不再作为当前方向参考。

## 推荐层级

从后到前：

1. `store_background_clean`
2. `back_shelves / window_sky / soft_light_overlay`
3. 等待顾客身体
4. 当前顾客 `warm_halo`
5. 当前顾客身体
6. 订单气泡和耐心条
7. `counter_worktop_midground_with_props`
8. 微波炉 / 收银机
9. 顾客手部 overlay
10. `counter_foreground`
11. 商品卡区
12. 顶部 HUD / 底部 tabbar / pause

## 顾客分层

顾客 final pass 应拆成 body 和 hands。

- body：身体、头、服装、上臂到可被遮挡处；不包含压台手掌。
- hands：手掌和小段手腕；不包含柜台边缘。
- body 和 hands 使用同画布、同 anchor，避免状态切换漂移。
- waiting 顾客默认隐藏 hands，或只用低权重小手。
- current 顾客显示 hands，并配合订单气泡、halo、READY 状态表达当前服务对象。

角色分层硬规则：

- body 隐藏 hands 时必须仍是完整角色，不能像断臂、缺手或残缺姿势。
- body 需要自带自然成立的肩膀、上臂、袖口或低权重默认手部；hands 只是“扒柜台姿势替换层”，不能承担修补 body 的职责。
- body 负责完整胳膊结构；hands 层只允许手掌 / 爪子 + 极短 wrist/cuff cap，不能带完整前臂、上臂或第二套胳膊。
- wrist/cuff cap 只允许在角色 body 本身穿长袖、且 hands 层的 cuff 与 body 袖口一致时使用。蓝色 / teal 背带角色没有长袖，hands 层必须是裸露的 teal 手掌 / 爪子，不能带袖口、肩带、背带、黑紫环或衣服结构。
- hands 叠加后必须像从 body 的袖口自然露出的柜台前手掌，不能像后贴贴片、漂浮手、双套胳膊或错位前臂。
- 橙色 / purple hoodie 顾客能用的原因是 body-only 已完整；后续蓝色 / teal 或任何新角色都按同一标准验收。

生成流程硬规则：

- 角色资源使用 imagegen 或等效工具后，必须先把原始生成图给用户过目。
- 用户过目通过前，不做去背、拆层、裁切、归一化、候选包整理、Figma 上传或 runtime 接入。
- 原始生成图未通过时，只能作为 rejected / audit 记录，不得进入可用候选池。
- 失败原图不得继续自动做透明、切分或 QA；下一次生成必须先修 prompt，再重新给用户看原图。

表情动画硬规则：

- 后续需要表情动画的角色，不再只交付静态 `neutral / happy / impatient` 整体 body。
- 角色包必须预留 face rig：`body_base` 负责身体、头型、服装、胳膊和默认手；face 层负责眼睛、眼皮 / 眉形、嘴巴和表情符号。
- 第一阶段优先使用“表情组”而不是把所有眼嘴拆成大量小碎片：`face_neutral`、`face_happy`、`face_impatient` / `face_angry` 使用同画布同 anchor，可整体替换或做轻微缩放 / 眨眼 / 抖动。
- 只有需要眨眼、瞳孔看向、口型或更细动画时，再进一步拆 `eye_base`、`pupil`、`eyelid`、`mouth_*`、`emotion_mark_*`。
- 不允许从已烘焙完整脸的 body 上再覆盖眼嘴贴片。可动画角色的 `body_base` 必须为 face 层预留干净区域，或提供明确的 neutral fallback 与完全对齐的 face overlay。
- 新角色原始生成图必须先展示 body / face / hands 的分层逻辑，用户过目后才进入去背和切分。

最小下一批：

- 蓝色 / teal 顾客纠偏候选：先出可动画原始层表，至少包含 `body_base`、`face_neutral`、`face_happy`、`face_impatient`、`left_hand`、`right_hand`；确认 body-only、face overlay 和裸手规则后再切分。
- 橙色 / purple hoodie 顾客：现有资源可继续用于 Figma 摆位复核，不再重新生成。
- blue shopper / 第三顾客：后置，除非需要第三顾客 final pass。

## 柜台与小件

`counter_worktop_midground` 可以和非交互、非状态、非遮挡关键的小件合并烘焙。

推荐：

- `counter_worktop_midground_with_props_v1.png`
- 保留 fallback：`counter_worktop_midground_v1.png`

可烘进台面中景：

- 纸杯 / 吸管杯
- 菜单牌 / 小立牌
- 低对比小植物
- 静态纸巾筒 / 餐巾盒
- 少量台面阴影和固定光影
- 台面后沿、低矮挡板
- 不可点击收纳盒 / 小托盘

必须独立：

- 微波炉三态
- 收银机 idle / pay
- 顾客手部
- 柜台前景遮挡层
- 商品 icon / 商品卡 / 商品槽
- 订单气泡、READY、check、缺失问号
- 金币、收入、收银 sparkle、付款反馈
- 耐心条、HUD、底部 tabbar
- 可点击按钮、进度条、倒计时、金额数字
- 会随天数、升级、状态变化的小件

## HUD

HUD v1 不能转正，产品要求返修：

- 顶部目标不能使用红心，改为星级 / 目标进度语义。
- 顾客耐心条要贴近顾客局部，不能像玩家生命槽。
- 数字、时间、金额、进度长度、闪烁和红点都由 runtime 绘制。

## 当前优先级

1. 顾客 body + hands 分层重做：teal regular 和 purple hoodie。
2. HUD v2：目标星级、星级 icon、顾客耐心条返修。
3. `counter_worktop_midground_with_props_v1`：在新手部方案明确后制作。
4. `counter_foreground_v2`：只在新手部方案确定后微调遮挡高度。
5. 反馈/状态包：错误、缺货、订单项疑问、收银 sparkle、成功小反馈。
