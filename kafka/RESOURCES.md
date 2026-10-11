# Kafka 学习资源

> ✅ **已核验**（2026-09-19）：所有链接已逐条实测。修正了三处失效链接：
> The Log 原文（`engineering.linkedin.com` 已 404）、Effective Kafka 的 Amazon ASIN、
> Kafka Summit 的 YouTube 频道。详见各条目下的说明。

## Knowledge（知识来源）

### 一手权威
- [Apache Kafka 官方文档](https://kafka.apache.org/documentation/)
  唯一的权威规格说明。Use for：配置项含义、协议行为、版本变更。**遇到任何冲突，以它为准。**
  注：`/documentation/` 现在是 JS 重定向页，真实内容在版本化路径下（如 `/43/getting-started/introduction`）。
- [Kafka 设计文档（官方 Design 章节）](https://kafka.apache.org/43/design/design)
  解释「为什么这样设计」而非「怎么用」。Use for：复制机制、消息投递语义、压缩。
- [消费者配置项速查（官方生成页）](https://kafka.apache.org/43/generated/consumer_config.html)
  所有 `consumer.*` 配置的默认值，**精确实时**，不依赖记忆。Use for：核对任何配置默认值。
- [KIP 列表（Kafka Improvement Proposals）](https://cwiki.apache.org/confluence/display/KAFKA/Kafka+Improvement+Proposals)
  每个特性的原始设计讨论。Use for：查某个特性是哪版引入的、设计权衡是什么。

### 建立心智模型（最重要的一篇）
- [The Log: What every software engineer should know about real-time data's unifying abstraction — Jay Kreps](https://www.linkedin.com/blog/engineering/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)
  Kafka 联合创始人对「日志」这一抽象的系统性论述。**第 1 课的一手资料。**
  Use for：理解 Kafka 为什么长这样、为什么它是"日志"而不是"队列"。
  注：原 `engineering.linkedin.com` 地址已 404，此为迁移后的新地址（2026-09-19 实测可读全文）。

### 书
- [Book: _Kafka: The Definitive Guide_（O'Reilly，第 2 版）](https://www.oreilly.com/library/view/kafka-the-definitive/9781492043072/)
  最均衡的入门到进阶读物，作者含 Kafka 核心维护者。Use for：章节式系统学习、运维章节。
- [Book: _Effective Kafka_ — Emil Koutanov](https://www.amazon.com/Effective-Kafka-Hands-Event-Driven-Applications/dp/B0863R7MKG)
  偏工程实践与反模式。Use for：设计决策、常见坑。
  注：原 ASIN `1838556435` 不存在（ISBN 查询无此号），此为正确地址（2026-09-19 实测）。

### 深度技术分析
- [Jack Vanlightly 的博客](https://jack-vanlightly.com/)
  对复制协议、一致性、性能的严谨分析，含大量实验数据。Use for：ISR、HW、事务的深挖。
- [Confluent Blog](https://www.confluent.io/blog/)
  厂商博客但技术质量高，常有内部机制长文。Use for：新特性解读、内部实现。

## Wisdom（社区 / 真实反馈）

- [r/apachekafka](https://www.reddit.com/r/apachekafka/)
  Use for：运维问题、方案对比、招聘市场风向。
- [Stack Overflow `apache-kafka` 标签](https://stackoverflow.com/questions/tagged/apache-kafka)
  Use for：具体报错、配置疑难。
- [Kafka 官方邮件列表（users@kafka.apache.org）](https://kafka.apache.org/contact)
  Use for：疑难问题，核心开发者在场，信噪比高。
- [Kafka 官方视频合集（Kafka Summit 演讲）](https://kafka.apache.org/community/videos/)
  各届 Kafka Summit 的精选演讲，含视频与幻灯片链接。Use for：真实公司的架构案例、事故复盘。
  注：`@KafkaSummitTalks` 频道不存在；演讲实际由 Confluent 频道发布（https://www.youtube.com/@Confluent），
  官方精选列表比翻频道更高效（2026-09-19 实测）。

## Gaps（缺口）

- 缺少**中文**高质量一手资料。官方文档中文版更新滞后，建议直接读英文原文。
- 缺少针对「Java / Spring 技术栈下的 Kafka 实践」的权威资源 —— 需要时再定向搜索。
- 用户的**具体业务场景**尚未锁定（见 [MISSION.md](./MISSION.md)），锁定后应补充针对性资源。
