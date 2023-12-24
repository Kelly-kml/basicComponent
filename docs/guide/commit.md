---
title: 代码提交
order: 3
nav:
  path: /guide
---

# 代码提交规范

在项目开发过程中，代码提交请遵循以下规范，因为项目上线发版本的时候，会自动根据您提交的信息生成 `版本日志`

## 提交前缀

采用 _angular_ 的 _commit_ 前缀标准，[查看](https://github.com/conventional-changelog/commitlint)

**特别注意，提交时格式为 `fix: 修复xxx` 注意前缀后面必须有两个空格**

可用前缀如下

| 前缀     | 使用场景                                           |
| :------- | :------------------------------------------------- |
| build    | 编译处理                                           |
| ci       | 持续构建，自动构建                                 |
| doc      | 仅仅修改了文档                                     |
| feat     | 新功能                                             |
| fix      | 修复 bug                                           |
| perf     | 优化相关，比如提升性能、体验                       |
| refactor | 代码重构，没有加新功能                             |
| revert   | 回滚                                               |
| style    | 仅仅修改了空格、格式缩进、都好等等，不改变代码逻辑 |
| test     | 测试用例，包括单元测试、集成测试等                 |

## emoji 表情

建议您在提交信息中添加表情，既生动形象又有趣

提交示例：

```shell script
git commit -m "feat: :tada: init commit"
```

### emoji 指南 😊

| emoji                     | emoji 代码                    | commit 说明           |
| :------------------------ | :---------------------------- | :-------------------- |
| 🎉 (庆祝)                 | `:tada:`                      | 初次提交              |
| 🆕 (全新)                 | `:new:`                       | 引入新功能            |
| 🔖 (书签)                 | `:bookmark:`                  | 发行/版本标签         |
| 🐛 (bug)                  | `:bug:`                       | 修复 bug              |
| 🚑 (急救车)               | `:ambulance:`                 | 重要补丁              |
| 🌐 (地球)                 | `:globe_with_meridians:`      | 国际化与本地化        |
| 💄 (口红)                 | `:lipstick:`                  | 更新 UI 和样式文件    |
| 🎬 (场记板)               | `:clapper:`                   | 更新演示/示例         |
| 🚨 (警车灯)               | `:rotating_light:`            | 移除 linter 警告      |
| 🔧 (扳手)                 | `:wrench:`                    | 修改配置文件          |
| ➕ (加号)                 | `:heavy_plus_sign:`           | 增加一个依赖          |
| ➖ (减号)                 | `:heavy_minus_sign:`          | 减少一个依赖          |
| ⬆️ (上升箭头)             | `:arrow_up:`                  | 升级依赖              |
| ⬇️ (下降箭头)             | `:arrow_down:`                | 降级依赖              |
| ⚡️ (闪电) <br> 🐎 (赛马) | `:zap:`<br>`:racehorse:`      | 提升性能              |
| 📈 (上升趋势图)           | `:chart_with_upwards_trend:`  | 添加分析或跟踪代码    |
| 🚀 (火箭)                 | `:rocket:`                    | 部署功能              |
| ✅ (白色复选框)           | `:white_check_mark:`          | 增加测试              |
| 📝 (备忘录)<br> 📖 (书)   | `:memo:`<br>`:book:`          | 撰写文档              |
| 🔨 (锤子)                 | `:hammer:`                    | 重大重构              |
| 🎨 (调色板)               | `:art:`                       | 改进代码结构/代码格式 |
| 🔥 (火焰)                 | `:fire:`                      | 移除代码或文件        |
| ✏️ (铅笔)                 | `:pencil2:`                   | 修复 typo             |
| 🚧 (施工)                 | `:construction:`              | 工作进行中            |
| 🗑 (垃圾桶)                | `:wastebasket:`               | 废弃或删除            |
| ♿️ (轮椅)                | `:wheelchair:`                | 可访问性              |
| 👷 (工人)                 | `:construction_worker:`       | 添加 CI 构建系统      |
| 💚 (绿心)                 | `:green_heart:`               | 修复 CI 构建问题      |
| 🔒 (锁)                   | `:lock:`                      | 修复安全问题          |
| 🐳 (鲸鱼)                 | `:whale:`                     | Docker 相关工作       |
| 🍎 (苹果)                 | `:apple:`                     | 修复 macOS 下的问题   |
| 🐧 (企鹅)                 | `:penguin:`                   | 修复 Linux 下的问题   |
| 🏁 (旗帜)                 | `:checkered_flag:`            | 修复 Windows 下的问题 |
| 🔀 (交叉箭头)             | `:twisted_rightwards_arrows:` | 分支合并              |

### 如何在命令行中显示 emoji

默认情况下，在命令行中并不会显示出 emoji, 仅显示 emoji 代码。不过可以使用 [emojify](https://github.com/mrowa44/emojify) 使得在命令行也可显示 emoji, 它是一个 shell 脚本，安装与使用都很简单，在 [这里](https://github.com/mrowa44/emojify) 查看如何安装与使用。
