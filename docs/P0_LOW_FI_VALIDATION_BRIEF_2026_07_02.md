# P0 Low-Fi Validation Brief

日期：2026-07-02

## Owner / Brief / Review / Record

- Owner：Coordination 负责记录三方共识；Product 负责玩法目标和判定信号；Art/UI 负责状态可读性和视觉硬门槛；Development/testing 负责低保真验证边界和观察项。
- Brief：把连续脑暴 Round 8-10 收束为 P0 低保真玩法验证 brief。本 brief 不是代码实现规格、不是页面资产清单、不是完整垂直切片。
- Review：Product、Art/UI、Development/testing 已分别在 Round 10 同意下一步产出应是一页 P0 low-fi validation brief；Round 11 已完成最终 review，并合入少量验收措辞修正。
- Record：本文件；`docs/LOCAL_TASK_BOARD.md`。

## 验证目标

验证 `统一拖拽 + 微波炉 ready 占机 + 1 个备餐位 + 两顾客压力` 是否能形成“手忙脚乱但爽”的调度服务，并观察玩家是否愿意再来一局及原因。

P0 只验证 60-90 秒服务调度，不验证长期经济、完整留存、最终美术、完整升级树或多日商业化内容。

## P0 Baseline

不可变规则：

1. 固定 2 位顾客、3 个商品、1 个热食、1 台微波炉、1 个备餐位。
2. 统一拖拽，所有商品都通过“拿起 -> 放到目标”完成服务。
3. 每个 slot 最多 1 个 item，不做队列、叠放、自动匹配。
4. 生热食进订单非法；热食必须经历 `raw -> microwave cooking -> ready-cooked`。
5. 熟热食可进订单或备餐位。
6. 微波炉 READY 后占机，直到玩家取走熟热食。
7. READY 超时自动成交，但少小费 / 断连击。
8. 只有未完成订单耐心归零才顾客流失。
9. 误放弹回，不扣库存，不做复杂库存回滚。
10. 不做烤糊、品质等级、复杂配方、多设备链、三顾客、第二备餐位、急客、局外库存经济。

## Live Service State Grammar

最小状态模型：

- `Item`：`source`、`held`、`in-slot`、`cooking`、`ready-cooked`、`served`。
- `Slot`：`empty`、`occupied`、`valid-hover`、`invalid-hover`、`locked`。
- `CustomerOrder`：`waiting`、`partial`、`ready-window`、`auto-served-low-tip`、`failed-left`、`served`。
- `MicrowaveJob`：`idle`、`cooking`、`ready-blocking`。

普通商品：

- 来源：低保真可用固定库存 / disabled preset 表达缺货 cue，不验证库存经济；可用时商品卡明亮，缺货 preset 时灰掉 / disabled。
- 拖拽：ghost 上浮并偏离手指，来源卡 dim。
- 合法目标：匹配订单最强绿；备餐位弱绿。
- 非法目标：微波炉、错误订单红闪 / 弹回。
- 放置后：订单 slot 填入 item / check；或备餐位显示 item。
- 结果：订单满足后进入 READY；交付产生金币 / 小费 / 连击反馈。

生热食：

- 来源：商品卡带 raw hot / 火焰角标。
- 拖拽：ghost 带轻微 amber 边缘；微波炉是主要合法目标。
- 合法目标：空闲微波炉。
- 非法目标：订单不发光，drop 后红闪 / 弹回；忙碌微波炉给 busy reject。
- 放置后：微波炉显示 item 和 progress。
- 结果：变成 cooked hot food，微波炉进入 ready-blocking。

熟热食：

- 来源：微波炉 ready 或备餐位，带 steam / warm cue。
- 拖拽：ghost 保留 cooked marker。
- 合法目标：匹配订单最强绿；空备餐位可接收。
- 非法目标：错误订单拒绝；微波炉不接收。
- 放置后：订单 slot 填入 / check；若来自微波炉，设备释放。
- 结果：订单满足后进入 READY；交付产生反馈。

## Visual Hard Gates

低保真测试前必须有：

1. 每位顾客的耐心条和 danger state。
2. drag ghost：手指偏移、来源 dim、item identity 保留。
3. 合法 / 非法 drop feedback，包含生热食进订单的非法反馈。
4. 微波炉 idle / heating / ready / occupied 与 progress。
5. 订单 READY short-window countdown，附着在订单上。
6. 备餐位 empty / occupied。
7. 缺货 disabled state。
8. 当前需求高亮。

硬性区分：

- 订单 READY：绿色，附着在订单气泡 / 订单槽上，使用 countdown ring / underline。
- 微波炉 ready：amber，限制在设备边界内，使用设备 glow / progress-complete / steam cue。
- 备餐位：必须位于玩家工作台区域，不进入商品 grid、订单气泡、顾客身体或底部 nav 区。

视觉优先级原则：

- 拖拽时优先：drag ghost -> 当前 valid target -> invalid feedback -> red patience danger -> READY countdown -> microwave ready。
- 非拖拽时优先：red patience danger -> READY countdown -> microwave ready / occupied -> 当前订单需求 -> 缺货 disabled。
- 中段柜台最多保留 2 个强高亮；其他 cue 降级为静态 rim、progress 或 dim。

## Continue Signals

看到这些信号，说明值得继续投入：

1. 玩家自然使用备餐位 / 微波炉缓冲，尤其是主动取出熟热食腾微波炉。
2. 玩家在双顾客压力下产生服务顺序语言，例如“先收 READY”“先取热食”“先救左边”。
3. 玩家误放后能立刻理解并纠正，没有停下来困惑。
4. 玩家能区分订单 READY 和微波炉 ready。
5. 玩家愿意再来一局，并归因到“我下次能更快 / 更顺”。

## Rework Signals

看到这些信号，不能继续堆功能，必须返工：

1. 玩家看不懂状态链：商品、拖拽、微波炉、备餐位、订单、READY。
2. 玩家觉得拖拽本身烦：挡视线、误触、吸附差、操作慢。
3. 玩家把合法 / 非法 drop 误解成 bug。
4. 微波炉 ready 占机不可感知，玩家觉得设备失灵。
5. READY 超时或耐心流失归因不清，玩家不知道为什么少钱、断连击或流失。
6. 玩家不用备餐位也能轻松过，或用了也没有收益。

## QA Hand Notes

低保真阶段不需要遥测平台，手点 / 手记即可记录：

- 备餐位使用次数，以及是否用于腾微波炉。
- 微波炉 ready 堵住的次数 / 大概时长。
- 玩家是否尝试把第二个 item 找地方暂存。
- 误放次数，以及误放后是否立刻纠正。
- READY 超时次数，以及玩家是否理解少小费 / 断连击。
- 卡住原因归类：看不懂、手感差、规则不懂、数值太紧。
- 玩家是否说出服务顺序计划。
- 玩家是否主动表达想再来一局，以及原因是“我下次能更快 / 更顺”还是只想看新内容。

## Conditional Expansion Rule

P0 baseline 不加入第二备餐位、微波炉升级、急客、库存 / 补货。P0 之后不固定扩展顺序，用测试结果触发：

- 玩家抱怨等待 / 堵炉，但已经会腾微波炉：优先测试微波炉升级。
- 玩家主动想多暂存一件，且 1 个备餐位明显限制预判：优先测试第二备餐位。
- 玩家基础节奏偏轻松，且状态语法已清楚：再考虑急客。
- 玩家已经掌握短局调度，需要局后规划影响下一局：再考虑库存 / 补货。
- 玩家还看不懂状态链或拖拽手感差：两个扩展都不加，先返工 state grammar / input feel。

## Next Step

下一步仍不是代码实现。建议先把这份 brief 交给三方作为共同基准，再决定是否进入低保真实现准备。
