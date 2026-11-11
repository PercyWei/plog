---
title: Actor-Critic：从 Monte Carlo 到 TD
description: 内容提纲：价值估计、Bootstrapping 与一步及多步 Actor-Critic。
search: false
---

# Actor-Critic：从 Monte Carlo 到 TD

内容待完善。本篇围绕价值估计与策略更新的配合，连接 Monte Carlo 回报和 TD 方法。

## Actor 与 Critic

说明策略模型与价值模型的职责，以及价值预测如何参与动作评价。

## 从完整回报到 Bootstrapping

对比实际采样的后续奖励与后继状态价值预测，分析估计误差的来源。

## 一步与多步更新

整理一步 TD、n-step 回报的目标构造、终止边界及参数更新顺序。
