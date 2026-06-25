# 怪兽便利店

竖屏、单指操作的快速配货经营小游戏。

## 当前阶段

项目正在制作首个垂直切片，用于验证：

- 玩家是否能立即理解订单与商品操作。
- 扁平粗描边美术在手机尺寸下是否清晰。
- 模块化怪兽能否通过程序动画获得足够表现力。
- 多顾客、库存和加工设备能否形成有意义的调度压力。
- 一轮约 90 秒的营业流程是否同时具备爽感与技巧上限。

详细范围见 `docs/PROJECT_SCOPE.md`，玩法难度见
`docs/GAMEPLAY_AND_DIFFICULTY.md`，美术规则见 `docs/art/ART_GUIDE.md`。

## 开发环境

- Cocos Creator `3.8.8`
- TypeScript
- 竖屏设计基准 `750 x 1334`
- 微信开发者工具

## 启动与验证

本项目目前没有 npm 脚本；用 Cocos Creator 打开项目根目录运行。

```bash
open -a "/Applications/Cocos/Creator/3.8.8/CocosCreator.app" .
```

在 Cocos Creator 中打开 `assets/scenes/Game.scene`，点击 Preview 验证主流程。

可用下面命令确认本机安装的是 Cocos Creator 3.8.8：

```bash
"/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator" --help
```

## 目录

```text
assets/
  characters/       角色母版与后续拆分资源
  reference/        正式风格参考
  resources/        Cocos 动态加载资源
  scenes/           游戏场景
  scripts/
    core/           与引擎表现解耦的玩法规则
    data/           商品、顾客与难度配置
    presentation/   Cocos 节点、动画与界面表现
  ui/mockups/       玩法界面母版
docs/
  art/              美术规范、生成模板与资源计划
```

## 下一里程碑

实现双顾客切换、下一订单预览、有限库存和单加工设备的基础营业场景，
然后接入怪兽等待、开心与生气三类程序动画。
