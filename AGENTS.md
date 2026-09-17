# Repository Guidelines

本仓库是**学习工作区**，不是应用代码库：用 Markdown 记录目标与状态，用静态 HTML 交付课程。当前唯一主题是 Kafka。

## 目录结构

- `kafka/MISSION.md` — 学习目标、边界与成功标准；调整方向前先读它。
- `kafka/NOTES.md` — 教学笔记：用户偏好、授课决策、待办。
- `kafka/RESOURCES.md` — 资源清单；顶部「待核验」提示须逐条验证链接后才可移除。
- `kafka/lessons/NNNN-slug.html` — 课程正文，四位数序号，如 `0001-kafka-is-a-log.html`。
- `kafka/reference/*.html` — 参考文档（术语表、速查表），打印友好。
- `kafka/assets/` — 共享样式与脚本：`course.css`（设计变量）、`components.css`（内容组件）、`quiz.js`（检索练习）、`log-viewer.js`。
- `learning-records/` — 计划中的学习记录，命名 `NNNN-*.md`。

## 本地运行

无构建步骤、无依赖。直接打开 HTML 即可；需要本地服务时：

```bash
cd kafka && python3 -m http.server 8000
```

## 代码风格

- HTML 声明 `lang="zh-CN"`，缩进 2 空格；CSS / JS 同样 2 空格。
- 课程页复用 `course.css` 的 CSS 变量，不硬编码颜色；新组件写入 `components.css`。
- JS 用 IIFE + `"use strict"`，通过 `data-*` 挂行为（`data-quiz`、`data-correct`、`data-scoreboard`、`data-log-viewer`、`data-act`），不引入框架。
- 类名 kebab-case；正文与注释用中文。

## 交付前自查

本仓库无自动化测试，交付前手动确认：

- 页面正常渲染，样式表路径（`../assets/...`）无误。
- quiz 点选后判分、显示解析、计分板数字正确。
- 术语表的 `已掌握` / `待验证` 状态未被越级升级。
- 打印预览无截断。

## 提交规范

提交信息一律用 `type(scope): description`，单行、无句号，如 `docs(agents): 补充提交规范`。

| type | 归类 | 用途 |
| --- | --- | --- |
| `feat` | Production | 新增功能 |
| `fix` | Production | Bug 修复 |
| `refactor` | Production | 重构代码（结构调整、改类名/函数名等），不改功能逻辑 |
| `test` | Development | 增删改测试用例 |
| `docs` | Development | 修改文档，如 README、API 文档 |

- `scope` 用小写，取改动所在的目录或模块：`kafka`、`lessons`、`reference`、`assets`、`agents`。
- `description` 用祈使句、简明中文，不加首字母大写之外的修饰。
- 一次提交只覆盖一课或一类文档；改动跨越多个 scope 时拆成多次提交。

## 自动提交

- 需要代为提交时，按上一节的 `type(scope): description` 生成信息，不要使用 `Add ...`、`update ...` 这类旧式写法。
- 提交前先跑「交付前自查」，确认无 `.DS_Store` 等忽略文件混入。
- 只提交本次改动涉及的文件，不夹带无关修改；推送目标为 `origin/main`。

## Pull Request

- PR 说明新增或修改的课程、关联的 MISSION 目标，以及新增的一手资料链接。
- `.DS_Store` 已被 `.gitignore` 忽略，不要提交。

## 面向 AI 助手

- 全程中文讲解；用户已有 Java / Spring 与 Kafka 客户端经验，不要从「什么是消息队列」讲起。
- 每课约 1 小时，必须含检索练习（先回忆再看答案）并附一手资料链接。
- 实操默认在用户服务器上以 `docker exec` 执行（本机无 Docker）。
