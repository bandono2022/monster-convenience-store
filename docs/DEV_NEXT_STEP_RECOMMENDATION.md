# 开发接班校准

更新时间：2026-06-26

角色：开发 / 测试

## 结论

下一步顺序：

1. 先做 `D-004` 编辑器手点。
2. 手点通过后，再做 `D-002` 数值接入。
3. 若手点失败，先修 `D-004` 暴露的真实 bug，再回到手点。

原因很短：`D-004` 已经静态验收到 `review / partial`，但还没有在 Cocos Creator 里跑过；不先手点，就不知道当前主循环是否真的可玩。`D-002` 会改配置和订单权重，应该等主循环手点确认后再接，避免把数值问题和交互问题混在一起。

## ProcessingConfig.ts:32

应该先修，而且已做最小修复。

- 文件：`assets/scripts/data/ProcessingConfig.ts`
- 改动：只把 legacy `heated` 字段读取改成先判断字段存在。
- 目的：清掉已知的 `ProcessingConfig.ts:32` 类型阻塞，不改变运行口径。

当前无法用本地 `npx tsc` 复验，因为项目没有安装 TypeScript，`npx tsc` 命中的是占位包提示；需要在 Cocos Creator 或带 TypeScript 的环境里复跑。

## D-002 能否不打开 Cocos 继续

能，但不推荐现在做。

`D-002` 本质上主要是配置接入，可以先不打开 Cocos 改 `EconomyConfig.ts`、`ProcessingConfig.ts`、`VerticalSliceConfig.ts`、`OrderGenerator.ts`。但现在最短上线路径不是继续堆配置，而是先确认 `D-004` 的 READY 气泡、热食回填、收银反馈和手机尺寸点击都真实可用。

## D-004 手点前最少确认路径

只确认这些，不扩范围：

1. Cocos Creator 3.8.8 打开 `assets/scenes/Game.scene` 能运行。
2. Day 1 普通商品进入订单气泡，READY 后点击气泡交付，顾客开心，收银反馈出现。
3. 未 READY 点击气泡或顾客，不收钱，只提示缺失。
4. Day 3 热饭团进入微波炉，完成后回填所属订单气泡，再交付。
5. A 顾客热食完成后切到 B 顾客，不能错给 B。
6. 错误商品、售罄、补货中都不误完成订单。
7. 390x844 下 HUD、订单气泡、顾客、微波炉、商品卡不遮挡且可点击。

## 如果还要改代码

最小文件范围：

1. `assets/scripts/data/ProcessingConfig.ts`：已完成一行类型安全修复。
2. 若 `D-004` 手点发现真实 bug，只改 `assets/scripts/presentation/MonsterStorePrototype.ts`。
3. 若进入 `D-002`，只改 `assets/scripts/data/EconomyConfig.ts`、`assets/scripts/data/ProcessingConfig.ts`、`assets/scripts/data/VerticalSliceConfig.ts`，必要时再碰 `assets/scripts/core/OrderGenerator.ts`。

不需要新增抽象，不需要拆文件，不需要现在提交。
