---
title: REINFORCE 的局限
description: 从采样梯度的波动、交互数据的成本与长期奖励的归因，理解 REINFORCE 的训练困难。
category: rl
tags:
  - 策略梯度
  - REINFORCE
  - 梯度估计
created: "2026-11-11"
updated: "2026-11-11"
---

# REINFORCE 的局限

<div class="note-lead">

REINFORCE 将期望回报的梯度写成可以通过轨迹采样估计的形式。可靠地执行一次更新，还取决于采样信号的波动、获得这些信号的成本，以及动作与后续奖励之间的关系。

</div>

## 梯度估计的高方差

沿用[上一章的期望回报目标](./policy_gradient_reinforce.md#eq-reinforce-objective)，记一条轨迹对梯度估计的贡献为 $X(\tau)$。固定策略参数 $\theta$，独立采样 $N$ 条轨迹后，得到：

$$
\begin{aligned}
X(\tau)
&=\sum_{t=0}^{T-1}\gamma^tG_t
\nabla_\theta\log\pi_\theta(a_t\mid s_t),\\
\hat g_N
&=\frac1N\sum_{i=1}^{N}X(\tau_i).
\end{aligned}
\label{eq-limits-gradient-estimate}
$$

其中，$G_t$ 为 Reward-to-go，$\tau_i\sim p_\theta$。时间权重与上一章的目标保持一致，因此这是一种无偏梯度估计。

**无偏性是对所有可能的采样结果取期望后的性质，并不保证某一批轨迹给出的方向接近真实梯度。** 当 $X(\tau)$ 的波动较大时，不同批次可能产生差别显著的更新方向；在真实梯度已经很小的区域，采样噪声还可能掩盖改进信号。

### 后续回报中的随机性

即使当前状态和动作相同，后续动作、环境转移与奖励仍可能不同，因而 $G_t$ 只是当前策略 $\pi=\pi_\theta$ 的动作价值 $Q^\pi(s_t,a_t)$ 的一次带噪声观测。

考虑一个只需决策一次的任务：动作 A 的期望奖励为 2，动作 B 为 1，实际奖励还会叠加一个与动作独立、以相同概率取 $+10$ 或 $-10$ 的随机扰动。分别对 A、B 采样一次，可能得到奖励 $-8$ 和 $11$，与两个动作的期望表现恰好相反。这个扰动没有改变哪个动作更好，却让单次回报难以可靠地评价动作。

在多步任务中，某个动作的后续回报还包含后续策略决策带来的结果。一次幸运的转移可能使许多较早时间步的回报同时升高；一次失败也可能同时影响多个梯度项。式 \eqref{eq-limits-gradient-estimate} 中这些项的波动因此具有相关性。

### 轨迹长度与梯度波动

较长的决策链通常包含更多随机因素，也使动作与最终奖励的关系更难观察。但梯度方差并不必然随轨迹长度单调增加：它还取决于奖励分布、折扣权重、策略的对数概率梯度，以及各时间步之间的相关性。

因此，回报波动只是梯度噪声的一部分。判断更新是否可靠，需要关注整个 $X(\tau)$，而不能仅凭奖励的绝对大小或轨迹长度作出结论。

## 样本效率与更新时机

### 更多轨迹的成本

增加独立轨迹数能够减小采样误差。设梯度贡献的二阶矩有限，$\mathbb E_{\mathcal D}$ 表示固定策略下，对 $N$ 条独立轨迹组成的批次 $\mathcal D$ 取期望。式 \eqref{eq-limits-gradient-estimate} 满足：

$$
\begin{aligned}
\mathbb E_{\mathcal D}[\hat g_N]
&=\nabla_\theta J(\theta),\\
\mathbb E_{\mathcal D}\!\left[
\|\hat g_N-\nabla_\theta J(\theta)\|^2\right]
&=\frac1N\mathbb E_{\tau\sim p_\theta}\!\left[
\|X(\tau)-\nabla_\theta J(\theta)\|^2\right].
\end{aligned}
\label{eq-limits-sampling-error}
$$

这里用平方欧氏范数衡量梯度估计的均方误差。式 \eqref{eq-limits-sampling-error} 表明，误差的均方根按 $1/\sqrt N$ 缩小：将其减半，需要 4 倍的独立轨迹。推导见[附录 A](#附录-a-独立轨迹平均的采样误差)。

<aside class="note-aside">

独立采样的单位是轨迹。同一条轨迹中的状态、动作和回报相互关联，不能把 $N$ 条长度为 $T$ 的轨迹直接当成 $NT$ 个独立的梯度样本。

</aside>

当环境交互昂贵、轨迹较长或有效奖励稀少时，获得足够多的轨迹就会成为主要成本。增加计算资源并不等于减少所需交互样本；并行采样可以缩短收集时间，但不自动改变采样估计的统计效率。

### 等待完整后续回报

计算每个时间步的 Monte Carlo 回报，需要观察该步之后直到任务终止或任务时域结束的奖励。对于长轨迹，更新必须等待较久；纯粹持续运行、没有有限终点的任务，还需要另外定义采样与回报估计方式。

任意截取一段轨迹，并把段尾之后的奖励直接置零，会改变较早时间步所使用的回报。用价值预测补充尚未观察到的未来奖励，是 [Actor-Critic](./actor_critic_td.md) 中 Bootstrapping 的出发点；预测误差也由此进入估计。

### 当前策略的数据要求

式 \eqref{eq-limits-gradient-estimate} 的采样分布是当前策略诱导的 $p_\theta$。策略更新后，旧轨迹仍来自更新前的策略，不能直接把它们当作新策略的样本重复使用。

因此，样本效率的限制不只来自高方差，还来自基本 on-policy 更新对新交互数据的需求。使用旧策略数据进行额外更新，需要考虑分布差异与相应的目标设计；[PPO](./ppo_clipped_surrogate.md) 会进一步讨论这一问题。

## 长期奖励的信用分配

信用分配关心的是：一段决策过程获得奖励后，应如何评价其中不同时间步的动作。

Full-Return 形式让同一条轨迹中各时间步的对数概率梯度共享完整回报 $R(\tau)$。某个动作即使与最后的成功关系不大，它所在的梯度项仍会受到这次成功的回报加权。策略梯度在期望上仍然成立，但单条轨迹并没有给出各动作贡献的清晰分解。

Reward-to-go 排除了当前动作之前的奖励，使更新只依赖当前及之后的结果。然而，后续回报仍包含环境随机性与后续动作的影响。在只有终点奖励的迷宫中，一条成功轨迹上的许多动作都会关联到同一个终点奖励；仅凭这一次成功，仍难判断哪些决策是关键，哪些只是偶然伴随成功发生。

从回报中减去状态相关的参考水平，可以把动作评价转向相对表现，这是 [Baseline](./baseline_variance_reduction.md) 的动机。合适的参考值能够降低梯度估计的方差，但不会自动消除不可预测的未来扰动，也不等于完成了长期奖励的因果归因。

## 改进方向

| 训练中的困难 | 改进思路 | 相关笔记 |
| --- | --- | --- |
| 采样回报带来较大的更新噪声 | 引入与当前动作无关的参考值，调整梯度权重 | [Baseline：无偏性与方差控制](./baseline_variance_reduction.md) |
| 必须等待完整后续回报 | 用价值预测构造一步或多步回报估计 | [Actor-Critic：从 Monte Carlo 到 TD](./actor_critic_td.md) |
| 多步估计存在偏差与方差的取舍 | 组合不同时间尺度的优势估计 | [GAE：多步优势估计与偏差方差权衡](./generalized_advantage_estimation.md) |

这些方法改善的是不同环节。引入价值模型并不自动保证更新更稳定，效果仍取决于估计质量、数据依赖关系与策略更新方式。

---

## 附录

### 附录 A：独立轨迹平均的采样误差

**命题**  固定策略参数 $\theta$，设 $\tau_1,\ldots,\tau_N$ 为从 $p_\theta$ 独立采样的轨迹。单条轨迹的梯度贡献为：

$$
X(\tau)=\sum_{t=0}^{T-1}\gamma^tG_t
\nabla_\theta\log\pi_\theta(a_t\mid s_t).
$$

假设 $X$ 的二阶矩有限，并满足 Reward-to-go 策略梯度恒等式：

$$
\mu=\mathbb E_{\tau\sim p_\theta}[X(\tau)]
=\nabla_\theta J(\theta).
$$

令 $\hat g_N=N^{-1}\sum_{i=1}^NX(\tau_i)$，$\mathbb E_{\mathcal D}$ 表示对上述独立采样批次取期望，则：

$$
\mathbb E_{\mathcal D}[\hat g_N]=\mu,
\qquad
\mathbb E_{\mathcal D}[\|\hat g_N-\mu\|^2]
=\frac1N\mathbb E_{\tau\sim p_\theta}[\|X(\tau)-\mu\|^2].
$$

**证明**  由期望的线性性：

$$
\mathbb E_{\mathcal D}[\hat g_N]
=\frac1N\sum_{i=1}^N
\mathbb E_{\tau_i\sim p_\theta}[X(\tau_i)]
=\mu.
$$

记 $Y_i=X(\tau_i)-\mu$。各 $Y_i$ 相互独立且均值为零，所以当 $i\ne j$ 时，$\mathbb E_{\mathcal D}[Y_i^\top Y_j]=0$。展开平方欧氏范数，得到：

$$
\begin{aligned}
\mathbb E_{\mathcal D}[\|\hat g_N-\mu\|^2]
&=\frac1{N^2}\sum_{i=1}^N\sum_{j=1}^N
  \mathbb E_{\mathcal D}[Y_i^\top Y_j]\\
&=\frac1{N^2}\sum_{i=1}^N
  \mathbb E_{\tau_i\sim p_\theta}[\|X(\tau_i)-\mu\|^2]\\
&=\frac1N\mathbb E_{\tau\sim p_\theta}[\|X(\tau)-\mu\|^2].
\end{aligned}
$$

## 参考文献

- [ApX：基本策略梯度面临的挑战](https://apxml.com/zh/courses/advanced-reinforcement-learning/chapter-3-advanced-policy-gradients-actor-critic/policy-gradient-challenges)：高方差、样本效率与信用分配的问题组织。
- [Spinning Up：策略优化入门](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html#dont-let-the-past-distract-you)：Reward-to-go、Baseline 与动作价值的关系。
- [Spinning Up：Vanilla Policy Gradient](https://spinningup.openai.com/en/latest/algorithms/vpg.html)：on-policy 采样与策略更新流程。
