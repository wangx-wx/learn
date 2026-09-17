# Repository Guidelines

本仓库是**学习工作区**，不是应用代码库：用 Markdown 记录目标与状态，用静态 HTML 交付课程。当前主题为 Kafka。

## 学习方法

学习方法与路径**全部由 `$teach` skill 指导**（`grill-me` 插件，`~/.codex/plugins/cache/wx-cc-plugins/grill-me/*/skills/teach/`）。该 skill 及其 `*-FORMAT.md` 是权威规范——`MISSION.md`、`RESOURCES.md`、术语表、学习记录的格式与写入时机都以它为准，改动前先读对应文件。本节只记录落地约定：

- 教学工作区是 `kafka/` 目录，上述文件均相对该目录。
- 每课聚焦一个点，短到能快速完成，落在用户的最近发展区；必须含检索练习，并推荐一个一手资料。
- 课程按 `0001-slug.html` 递增编号；术语表建立后，所有课程遵守它的用词。
- 不轻信模型记忆，资料以 `RESOURCES.md` 中的高信任来源为准。
- 用户偏好与授课决策记录在 `NOTES.md`。

## 目录结构

顶层一个主题一个目录（当前 `kafka/`），每个目录是独立的 `$teach` 工作区：

- `MISSION.md` / `NOTES.md` / `RESOURCES.md` — 使命、教学笔记、资料清单。
- `lessons/NNNN-slug.html` — 课程正文；`reference/*.html` — 参考文档，打印友好。
- `assets/` — 共享样式与脚本：`course.css`（设计变量）、`components.css`（内容组件）、`quiz.js`、`log-viewer.js`。
- `learning-records/NNNN-slug.md` — 学习记录，惰性创建。

新增主题时另建顶层目录并配齐上述文件。

## 本地运行

无构建步骤、无依赖。直接打开 HTML；需要本地服务时：`cd kafka && python3 -m http.server 8000`

## 代码风格

- HTML 声明 `lang="zh-CN"`，缩进 2 空格；CSS / JS 同样。
- 复用 `course.css` 的 CSS 变量，不硬编码颜色；可复用组件写入 `components.css`，不要内联。
- JS 用 IIFE + `"use strict"`，通过 `data-*` 挂行为（`data-quiz`、`data-correct`、`data-scoreboard`、`data-log-viewer`、`data-act`），不引入框架。
- 类名 kebab-case；正文与注释用中文。

## 交付前自查

无自动化测试，交付前手动确认：样式表路径（`../assets/...`）无误；quiz 判分、解析与计分正常；术语表状态标记未被越级升级；打印预览无截断。

## 提交规范

提交信息一律用 `type(scope): description`，单行、无句号。

| type | 归类 | 用途 |
| --- | --- | --- |
| `feat` | Production | 新增功能 |
| `fix` | Production | Bug 修复 |
| `refactor` | Production | 重构代码（结构调整、改类名/函数名等），不改功能逻辑 |
| `test` | Development | 增删改测试用例 |
| `docs` | Development | 修改文档，如 README、API 文档 |

- `scope` 用小写，取改动所在的目录或模块：`kafka`、`lessons`、`reference`、`assets`、`agents`。
- 一次提交只覆盖一课或一类文档；跨 scope 时拆成多次提交。
- 代为提交时按上述格式生成信息，不要用 `Add ...`、`update ...` 这类旧式写法；先跑「交付前自查」，只提交本次涉及的文件，不夹带无关改动，推送目标为 `origin/main`。

## 面向 AI 助手

- 教学决策以 `$teach` skill 为准，本仓库文件是它的状态载体；冲突时以 skill 为准。
- 全程中文；用户已有 Java / Spring 与 Kafka 客户端经验，不要从「什么是消息队列」讲起。
- 每课约 1 小时；实操默认在用户服务器上以 `docker exec` 执行（本机无 Docker）。
- 开课前先读 `MISSION.md` 与 `learning-records/` 判断进度，不要凭记忆猜。
