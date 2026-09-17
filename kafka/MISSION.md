# Mission: Kafka

## Why
在工作中把 Kafka 真正用起来 —— 不只是会调 producer / consumer API，而是理解它背后的分布式机制，
从而在生产环境里能定位问题（积压、重复消费、乱序、rebalance）、能做设计决策（分区数、key 策略、副本数），
而不是照抄别人的配置。深层动机是：借 Kafka 这个具体系统，建立对分布式系统的通用直觉。

## Success looks like
- 能完整讲清一条消息从 producer 发出到 consumer 处理的生命周期，包括分区选择、副本同步、位点提交
- 能针对一个真实业务场景设计 topic 的分区数与 key 策略，并说清吞吐 / 顺序 / 并行度之间的取舍
- 遇到消息积压、重复消费、消息乱序、频繁 rebalance 时，能提出假设并用命令行工具验证
- 能在服务器上用 Docker 搭起多 broker 集群，并完成扩分区、查消费位点、改保留策略等基本运维
- 能解释 ISR、HW / LEO、幂等生产者、事务 的机制，以及它们各自的边界

## Constraints
- 每次投入约 1 小时
- 已有基础：Java / Spring，用过 Kafka 客户端 API（「会用但不懂原理」）
- 有可部署 Docker 的服务器；本机 Mac 无 Docker，但有 Java 21
- 要求「理念 + 实操」并重，且要记得牢 → 每课必须含检索练习，并做间隔重复
- 中文授课

## Out of scope（暂不深入，保持最近发展区）
- Kafka Streams / ksqlDB 的开发实践
- 与 Flink / Spark 的集成
- Schema Registry 与 Avro / Protobuf 生态
- 云厂商托管 Kafka（MSK / Confluent Cloud）的具体运维

## Open questions
- 具体业务场景还没锁定。上面 Success 里的「订单事件流」是我按常见场景填的假设。
  一旦你告诉我实际要解决的问题（哪个系统、什么数据、当前痛点），我会用真实场景替换它。
