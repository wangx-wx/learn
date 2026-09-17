# Repository Guidelines

本仓库是**学习工作区**，不是应用代码库：用 Markdown 记录目标与状态，用静态 HTML 交付课程。当前唯一主题是 Kafka。

## 学习方法

本仓库的学习方法与路径**全部由 `$teach` skill 指导**（`grill-me` 插件内，位于 `~/.codex/plugins/cache/wx-cc-plugins/grill-me/*/skills/teach/`）。该 skill 是这里的教学规范来源，本文件只记录它的落地约定。

当前的教学工作区是 `kafka/` 目录：`$teach` 约定中的 `MISSION.md`、`RESOURCES.md`、`NOTES.md`、`lessons/`、`reference/`、`assets/`、`learning-records/` 都相对该目录。本节及下文的相对路径均指 `kafka/` 内。

- 三种学习要素：**Knowledge**（来自高信任度一手资料）、**Skills**（交互式课程）、**Wisdom**（真实社区实践）。缺 Wisdom 时优先引导用户进入社区。
- 区分 **fluency strength**（当下能想起来）与 **storage strength**（长期留存），后者才是目标。靠 desirable difficulty 达成：检索练习、间隔重复、技能练习时交错混合。
- 每课只教一个**紧密聚焦**的点，短到能快速完成，落在用户的**最近发展区**内；必须给出一个可感知的小胜利，并推荐一个一手资料。
- 课程按 `0001-<dash-case-name>.html` 递增编号；参考文档是课程被压缩后的精华，课程很少回看，参考文档会。
- 术语表一旦建立，**所有课程都必须遵守它的用词**。
- 认知类内容（Knowledge）要降低难度，技能类内容（Skills）要用难度当工具，通过尽可能紧的反馈回路练习。
- quiz 的各个选项应**字数、字符数尽量相同**，不要用排版泄露答案。
- `RESOURCES.md` 未充实前，先集中找高质量资料；**不要相信模型自身的记忆**。
- 用户的偏好、授课决策记录在 `NOTES.md`。
- 用户明确表示不想加入社区时，尊重该选择。

### 各文件的格式约束

`$teach` skill 用 `*-FORMAT.md` 规定下列文件的格式，改动前先读对应文件：

- `MISSION.md` → `MISSION-FORMAT.md`；使命变化时**先与用户确认**，再更新并补一条学习记录。
- `RESOURCES.md` → `RESOURCES-FORMAT.md`。
- `reference/` 下的术语表 → `GLOSSARY-FORMAT.md`。
- `learning-records/0001-<slug>.md` → `LEARNING-RECORD-FORMAT.md`；该目录**惰性创建**，只在写第一条记录时建。

### 学习记录的写入时机

只在下列情况写记录：用户展示了非平凡的真实理解、用户声明了既有知识、某个误解被纠正、使命因学习而转移。**仅仅「讲过」不算学习**，不要写；也不是逐次会话的流水账。

## 目录结构

顶层按主题划分，一个主题一个目录（当前为 `kafka/`），每个目录都是一个独立的 `$teach` 工作区：

- `kafka/MISSION.md` — 学习目标、边界与成功标准；调整方向前先读它。
- `kafka/NOTES.md` — 教学笔记：用户偏好、授课决策、待办。
- `kafka/RESOURCES.md` — 资源清单；顶部「待核验」提示须逐条验证链接后才可移除。
- `kafka/lessons/NNNN-slug.html` — 课程正文，四位数序号，如 `0001-kafka-is-a-log.html`。
- `kafka/reference/*.html` — 参考文档（术语表、速查表），打印友好。
- `kafka/assets/` — 共享样式与脚本：`course.css`（设计变量）、`components.css`（内容组件）、`quiz.js`（检索练习）、`log-viewer.js`。
- `kafka/learning-records/NNNN-slug.md` — 学习记录；惰性创建，只在写第一条时建目录。

新增主题时另建顶层目录并配齐上述文件，不要把不同主题混进同一个工作区。

## 本地运行

无构建步骤、无依赖。直接打开 HTML 即可；需要本地服务时：

```bash
cd kafka && python3 -m http.server 8000
```

## 代码风格

- HTML 声明 `lang="zh-CN"`，缩进 2 空格；CSS / JS 同样 2 空格。
- 课程页复用 `course.css` 的 CSS 变量，不硬编码颜色；可复用的新组件写入 `components.css`，不要内联课程里未来会被重复用到的代码。
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

- 教学决策以 `$teach` skill 为准，本仓库文件是它的状态载体；两者冲突时以 skill 为准。
- 全程中文讲解；用户已有 Java / Spring 与 Kafka 客户端经验，不要从「什么是消息队列」讲起。
- 每课约 1 小时，必须含检索练习（先回忆再看答案）并附一手资料链接。
- 实操默认在用户服务器上以 `docker exec` 执行（本机无 Docker）。
- 每次开课先读 `MISSION.md` 与 `learning-records/`，据此判断最近发展区，不要凭记忆猜进度。
- 课程文件写好后，尽量用 CLI 命令替用户打开。
