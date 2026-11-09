---
title: 策略梯度与 REINFORCE
description: 从策略梯度与 Reward-to-go 出发，说明 REINFORCE 的梯度估计、采样损失与完整训练流程。
category: rl
tags:
  - 策略梯度
  - REINFORCE
created: "2026-11-02"
updated: "2026-11-10"
---

# 策略梯度与 REINFORCE

<div class="note-lead">

策略梯度方法直接对策略进行参数化，然后通过调整参数来最大化期望回报。

</div>

将策略记为 $\pi_\theta(a\mid s)$，由该策略生成的轨迹分布记为 $p_\theta(\tau)$。固定折扣因子 $0<\gamma\leq1$，**期望回报**为：

$$
J(\theta)=\mathbb E_{\tau\sim p_\theta}[\sum_{t=0}^{T-1}\gamma^t r(s_t,a_t)]
\label{eq-reinforce-objective}
$$

这里，$\tau=(s_0,a_0,r_0,s_1,a_1,r_1,\ldots,r_{T-1},s_T)$ 是遵循策略生成的轨迹。有限时域下，将时刻包含在状态中，因此不同时刻到达的同一环境状态被视为不同状态。

假设初始状态分布、环境转移和奖励函数不显式依赖 $\theta$，我们的目标是计算目标函数 \eqref{eq-reinforce-objective} 关于策略参数的梯度 $\nabla_\theta J(\theta)$，难点在于处理轨迹分布对参数的依赖。

## 策略梯度的基本形式

Log-derivative 恒等式将概率的导数改写为概率与对数概率梯度的乘积：

$$
\nabla_\theta p_\theta(\tau)
=p_\theta(\tau)\nabla_\theta\log p_\theta(\tau).
$$

将轨迹概率展开为初始分布、策略与环境转移的乘积，再利用上述恒等式，可得策略梯度的基本形式，即 **Full-Return**（完整回报）形式的策略梯度：

$$
\nabla_\theta J(\theta)
=\mathbb E_{\tau\sim p_\theta}\left[
R(\tau)\sum_{t=0}^{T-1}
\nabla_\theta\log\pi_\theta(a_t\mid s_t)
\right]
\label{eq-full-return-gradient}
$$

其中，对数概率梯度 $\nabla_\theta\log\pi_\theta(a_t\mid s_t)$ 也称 **score function**（得分函数），给出提高采样动作对数概率的局部方向，$R(\tau)$ 则以整条轨迹的回报为这些方向加权。

这样便能用采样轨迹估计梯度，无需对环境的状态转移过程求导。完整推导见[附录 A](#附录-a-策略梯度的基本形式)。

## 从 Full-Return 到 Reward-to-go

Full-Return 形式的策略梯度为同一条轨迹的所有动作分配相同的分数，其中包含当前动作发生之前的奖励。当前动作无法改变过去，把这部分奖励计入权重，会让过去经历的随机性参与当前动作的更新。

**Reward-to-go**（后续累积回报）只保留当前动作及其之后的奖励。以第 $t$ 步为折扣起点，定义：

$$
G_t=\sum_{k=t}^{T-1}\gamma^{k-t}r_k.
$$

当前动作无法改变已作出动作的奖励，因此过去奖励并不反映该动作带来的结果。虽然将它们计入回报会影响单条轨迹上的梯度估计，但这些奖励对应的梯度项在取期望后为零。**因此，可以去掉过去奖励，改用从当前时间步开始的后续累积回报，而不改变梯度的期望。**相应的策略梯度为：

$$
\nabla_\theta J(\theta)
=\mathbb E_{\tau\sim p_\theta}\left[
\sum_{t=0}^{T-1}\gamma^tG_t
\nabla_\theta\log\pi_\theta(a_t\mid s_t)
\right]
\label{eq-reward-to-go-gradient}
$$

其中，$G_t$ 从当前时刻 $t$ 计算折扣，目标函数则从时刻 $0$ 计算折扣。两者通过外层的 $\gamma^t$ 对齐：

$$
\gamma^tG_t=\sum_{k=t}^{T-1}\gamma^k r_k.
$$

这样，每项奖励仍保留目标函数中的权重 $\gamma^k$。完整推导见[附录 B](#附录-b-reward-to-go-形式的策略梯度)。

## 动作价值函数与策略梯度

给定当前状态和动作，对 Reward-to-go 取条件期望，得到当前策略 $\pi=\pi_\theta$ 的**动作价值函数**：

$$
Q^\pi(s,a)
=\mathbb E_{\tau\sim p_\theta}[G_t\mid s_t=s,a_t=a].
$$

将 Reward-to-go 形式的策略梯度中的后续回报替换为上述条件期望，可得到**动作价值形式的策略梯度定理**：

$$
\nabla_\theta J(\theta)
=\mathbb E_{\tau\sim p_\theta}\left[
\sum_{t=0}^{T-1}\gamma^t
Q^\pi(s_t,a_t)
\nabla_\theta\log\pi_\theta(a_t\mid s_t)
\right]
\label{eq-q-policy-gradient}
$$

完整推导见[附录 C](#附录-c-动作价值形式的策略梯度)。

也可以把轨迹求和改写为状态和动作上的期望。定义**状态访问分布**：

$$
d_\theta(s)=\frac1Z\sum_{t=0}^{T-1}\gamma^t\Pr_\theta(s_t=s),
\qquad Z=\sum_{t=0}^{T-1}\gamma^t.
$$

其中，$\Pr_\theta(s_t=s)$ 表示当前策略下第 $t$ 步处于状态 $s$ 的概率，$Z$ 为归一化常数。$d_\theta$ 描述按时间权重 $\gamma^t$ 汇总后，策略访问各状态的相对频率。

任务提前终止后，将后续状态视为零奖励的吸收状态，使每个时刻的状态分布总质量保持为 1；实际采样仍在任务终止时停止。

相应的梯度为：

$$
\nabla_\theta J(\theta)
=Z\,
\mathbb E_{s\sim d_\theta,\,a\sim\pi_\theta(\cdot\mid s)}\left[
Q^\pi(s,a)\nabla_\theta\log\pi_\theta(a\mid s)
\right]
\label{eq-state-visitation-gradient}
$$

式 \eqref{eq-state-visitation-gradient} 将时间权重 $\gamma^t$ 纳入 $d_\theta$，归一化系数 $Z$ 则保留在期望之外。完整推导见[附录 D](#附录-d-状态访问分布形式的策略梯度)。

## REINFORCE 算法

策略梯度定理提供了梯度的形式，但我们仍然需要 $Q^\pi(s_t,a_t)$，这通常是未知的。**REINFORCE** 算法（也称为蒙特卡洛策略梯度）提供了一种使用采样轨迹来估计此梯度的简单方法，其使用完整轨迹的采样回报构造 Monte Carlo 梯度估计，并据此更新策略参数。换句话说，$G_t$ 为动作价值 $Q^\pi(s_t,a_t)$ 提供一次采样估计。

### 采样梯度的计算

从当前策略采样 $N$ 条完整轨迹，将式 \eqref{eq-reward-to-go-gradient} 中的轨迹期望替换为样本均值，即得到 Monte Carlo 梯度估计。保留每步权重 $\gamma^tG_{i,t}$ 时，采样梯度的期望等于目标函数 \eqref{eq-reinforce-objective} 的梯度。实际实现常省略外层的 $\gamma^t$，直接使用 Reward-to-go 加权，得到如下采样更新：

$$
\hat g_{\mathrm{practice}}
=\frac1N\sum_{i=1}^{N}\sum_t
G_{i,t}
\nabla_\theta\log\pi_\theta(a_{i,t}\mid s_{i,t}).
\label{eq-practical-policy-update}
$$

<aside class="note-aside">

省略 $\gamma^t$ 会改变不同时刻贡献的相对权重，因此上式一般不再是目标函数的无偏梯度估计。

</aside>

关于这一省略的影响，可参见 Nota 与 Thomas 的论文 [Is the Policy Gradient a Gradient?](https://arxiv.org/abs/1906.07073)。[Hugging Face 课程的 issue #285](https://github.com/huggingface/deep-rl-class/issues/285) 也讨论了教材推导与常见实现之间的差异，但尚未给出进一步解释或对应的修正记录。后续训练部分沿用省略 $\gamma^t$ 的形式。

### 损失函数与训练流程

记第 $i$ 条轨迹的实际长度为 $T_i$，为实现式 \eqref{eq-practical-policy-update} 给出的采样更新，将回报视为固定权重，构造如下采样损失：

$$
\hat{\mathcal L}
=-\frac1N\sum_{i=1}^{N}\sum_{t=0}^{T_i-1}
G_{i,t}\log\pi_\theta(a_{i,t}\mid s_{i,t})
\label{eq-reinforce-loss}
$$

对上述损失做梯度下降，等同于沿采样梯度 $\hat g_{\mathrm{practice}}$ 上升的方向更新策略。

我们在实际计算 $G_{i,t}$ 时无须每次都累加奖励，因为 Reward-to-go 有如下递推关系：

$$
G_{i,t}=r_{i,t}+\gamma G_{i,t+1},
\qquad G_{i,T_i}=0.
$$

利用这一递推关系，可以从轨迹末尾向前计算各时间步的回报，每一步都复用已计算出的下一时间步的回报。

<figure class="algorithm-panel" aria-labelledby="algorithm-reinforce-title">
<figcaption id="algorithm-reinforce-title">Algorithm 1　REINFORCE</figcaption>

**输入：** 初始策略 $\pi_\theta$，每轮轨迹采样数 $N$，学习率 $\alpha$，折扣因子 $\gamma$。

1. **重复**以下训练轮次：
   1. 固定 $\theta$，采样 $N$ 条完整轨迹，保存各步的状态、动作和奖励。
   2. **对于**每条轨迹 $i=1,\ldots,N$：
      1. $G\gets0$。
      2. **对于** $t=T_i-1,T_i-2,\ldots,0$：
         1. $G\gets r_{i,t}+\gamma G$。
         2. $G_{i,t}\gets G$。
   3. 在同一组参数下重算各步的 $\log\pi_\theta(a_{i,t}\mid s_{i,t})$。
   4. 按式 \eqref{eq-reinforce-loss} 计算采样损失 $\hat{\mathcal L}$。
   5. $\theta\gets\theta-\alpha\nabla_\theta\hat{\mathcal L}$。

</figure>

---

## 附录

### 附录 A：策略梯度的基本形式

**命题**  对前述有限时域任务，假设初始状态分布、环境动力学与奖励函数不显式依赖策略参数 $\theta$，策略在与参数无关的支持集上可微，且允许交换求导与求和，则期望回报的梯度为：

$$
\nabla_\theta J(\theta) = \mathbb E_{\tau\sim p_\theta} \left[R(\tau)\sum_t \nabla_\theta\log\pi_\theta(a_t\mid s_t)\right]
$$

**证明**  将期望回报展开为轨迹求和：

$$
J(\theta)=\sum_\tau p_\theta(\tau)R(\tau)
$$

其中，轨迹概率可分解为：

$$
p_\theta(\tau) = \rho_0(s_0) \prod_t \pi_\theta(a_t\mid s_t) P(s_{t+1}\mid s_t,a_t)
$$

$\rho_0$ 为初始状态分布，$P(s_{t+1}\mid s_t,a_t)$ 为环境的状态转移概率。二者不显式依赖 $\theta$，因此：

$$
\nabla_\theta\log p_\theta(\tau) = \sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)
$$

对轨迹求和形式下的 $J(\theta)$ 求导：

$$
\begin{aligned}
\nabla_\theta J(\theta)
&=\sum_\tau R(\tau)\nabla_\theta p_\theta(\tau)\\
&=\sum_\tau p_\theta(\tau)R(\tau)
  \nabla_\theta\log p_\theta(\tau)\\
&=\sum_\tau p_\theta(\tau)R(\tau)
  \sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\\
&=\mathbb E_{\tau\sim p_\theta}\left[
  R(\tau)\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)
  \right].
\end{aligned}
$$

### 附录 B：Reward-to-go 形式的策略梯度

**命题**  在附录 A 的条件下，令：

$$
G_t=\sum_{k=t}^{T-1}\gamma^{k-t}r_k.
$$

则期望回报的梯度为：

$$
\nabla_\theta J(\theta)
=\mathbb E_{\tau\sim p_\theta}\left[
\sum_{t=0}^{T-1}\gamma^tG_t
\nabla_\theta\log\pi_\theta(a_t\mid s_t)
\right].
$$

**证明**  完整回报可以分解为过去奖励与后续回报：

$$
R(\tau)=H_t+\gamma^tG_t,\qquad
H_t=\sum_{k=0}^{t-1}\gamma^kr_k.
$$

记 $g_t=\nabla_\theta\log\pi_\theta(a_t\mid s_t)$，我们将完整回报的分解代入时间步 $t$ 的梯度项：

$$
\mathbb E_{\tau\sim p_\theta}[R(\tau)g_t]
=\mathbb E_{\tau\sim p_\theta}[H_t g_t]
+\mathbb E_{\tau\sim p_\theta}[\gamma^tG_t g_t].
$$

记动作 $a_t$ 采样前的完整历史为 $\mathcal H_t$，我们可以用全期望公式改写过去奖励对应的梯度项：

$$
\begin{aligned}
\mathbb E_{\tau\sim p_\theta}[H_t g_t]
&=\mathbb E_{\tau\sim p_\theta}\!\left[
  \mathbb E_{\tau\sim p_\theta}[H_t g_t\mid\mathcal H_t]\right].
\end{aligned}
$$

给定 $\mathcal H_t$ 后，过去奖励 $H_t$ 与当前状态 $s_t$ 已确定，可将 $H_t$ 提出条件期望，而 $g_t$ 仅随当前动作变化，进一步展开上式可得：

$$
\begin{aligned}
\mathbb E_{\tau\sim p_\theta}[H_t g_t]
&=\mathbb E_{\tau\sim p_\theta}\!\left[
  H_t
  \mathbb E_{\tau\sim p_\theta}[g_t\mid\mathcal H_t]\right]\\
&=\mathbb E_{\tau\sim p_\theta}\!\left[
  H_t
  \sum_a\pi_\theta(a\mid s_t)
  \nabla_\theta\log\pi_\theta(a\mid s_t)\right]\\
&=\mathbb E_{\tau\sim p_\theta}\!\left[
  H_t
  \nabla_\theta\sum_a\pi_\theta(a\mid s_t)\right]\\
&=0.
\end{aligned}
$$

过去奖励对该时间步梯度的期望贡献为零，因此：

$$
\mathbb E_{\tau\sim p_\theta}[R(\tau)g_t]
=\mathbb E_{\tau\sim p_\theta}[\gamma^tG_t g_t].
$$

将上述结果代入 Full-Return 形式的策略梯度，可以得到 Reward-to-go 形式的策略梯度：

$$
\begin{aligned}
\nabla_\theta J(\theta)
&=\sum_{t=0}^{T-1}\mathbb E_{\tau\sim p_\theta}[R(\tau)g_t]\\
&=\mathbb E_{\tau\sim p_\theta}\left[
  \sum_{t=0}^{T-1}\gamma^tG_t
  \nabla_\theta\log\pi_\theta(a_t\mid s_t)
  \right].
\end{aligned}
$$

### 附录 C：动作价值形式的策略梯度

**命题**  在附录 A 的条件下，记 $\pi=\pi_\theta$，令：

$$
Q^\pi(s,a)=\mathbb E_{\tau\sim p_\theta}[G_t\mid s_t=s,a_t=a].
$$

则期望回报的梯度为：

$$
\nabla_\theta J(\theta)
=\mathbb E_{\tau\sim p_\theta}\left[
\sum_{t=0}^{T-1}\gamma^t
Q^\pi(s_t,a_t)
\nabla_\theta\log\pi_\theta(a_t\mid s_t)
\right]
$$

**证明**  从 Reward-to-go 形式的策略梯度出发，记 $g_t=\nabla_\theta\log\pi_\theta(a_t\mid s_t)$，对其中的期望项 $\mathbb E_{\tau\sim p_\theta}[G_t g_t]$ 应用全期望公式，可得：

$$
\begin{aligned}
\mathbb E_{\tau\sim p_\theta}[G_t g_t]
&=\mathbb E_{\tau\sim p_\theta}\!\left[
  \mathbb E_{\tau\sim p_\theta}[G_t g_t \mid s_t,a_t]\right].
\end{aligned}
$$

给定 $s_t,a_t$ 后，$g_t$ 已确定，可将其提出条件期望，再根据动作价值的定义，进一步展开上式可得：

$$
\begin{aligned}
\mathbb E_{\tau\sim p_\theta}[G_t g_t]
&=\mathbb E_{\tau\sim p_\theta}\!\left[
  g_t\mathbb E_{\tau\sim p_\theta}[G_t\mid s_t,a_t]\right]\\
&=\mathbb E_{\tau\sim p_\theta}[g_tQ^\pi(s_t,a_t)].
\end{aligned}
$$

将上述结果代入 Reward-to-go 形式的策略梯度，可以得到动作价值形式的策略梯度：

$$
\begin{aligned}
\nabla_\theta J(\theta)
&=\sum_{t=0}^{T-1}\gamma^t\mathbb E_{\tau\sim p_\theta}[G_t g_t]\\
&=\sum_{t=0}^{T-1}\gamma^t
  \mathbb E_{\tau\sim p_\theta}[Q^\pi(s_t,a_t) g_t]\\
&=\mathbb E_{\tau\sim p_\theta}\left[
  \sum_{t=0}^{T-1}\gamma^t
  Q^\pi(s_t,a_t)
  \nabla_\theta\log\pi_\theta(a_t\mid s_t)
  \right].
\end{aligned}
$$

### 附录 D：状态访问分布形式的策略梯度

**命题**  在附录 C 的条件下，状态包含时刻，先考虑离散状态和动作。若任务提前终止，则在后续时刻处于零奖励的吸收状态，并只执行与 $\theta$ 无关的虚拟动作，直至固定时域 $T$。令：

$$
Z=\sum_{t=0}^{T-1}\gamma^t,\qquad
d_\theta(s)=\frac1Z\sum_{t=0}^{T-1}\gamma^t\Pr_\theta(s_t=s).
$$

其中，$\Pr_\theta(s_t=s)$ 表示当前策略下第 $t$ 步处于状态 $s$ 的概率。$d_\theta$ 是归一化概率分布，策略梯度可表示为：

$$
\nabla_\theta J(\theta)
=Z\,\mathbb E_{s\sim d_\theta,\,a\sim\pi_\theta(\cdot\mid s)}\left[
Q^\pi(s,a)\nabla_\theta\log\pi_\theta(a\mid s)
\right].
$$

**证明**  每个时刻的状态分布总质量为 1，因此：

$$
\sum_s d_\theta(s)
=\sum_s\left[
  \frac1Z\sum_{t=0}^{T-1}\gamma^t
  \Pr_\theta(s_t=s)\right]
=\frac1Z\sum_{t=0}^{T-1}\gamma^t
  \sum_s\Pr_\theta(s_t=s)
=1.
$$

若省略终止后的吸收状态，设实际轨迹长度为 $L\leq T$，则剩余状态的概率总质量为 $\Pr_\theta(L>t)$，不再恒为 1，不能直接沿用 $Z$ 作为归一化常数。引入吸收状态正是为了补足这部分概率质量；终止后的 $Q^\pi=0$，因而不产生额外的梯度贡献。终止转移本身获得的奖励仍计入回报，只有终止之后的奖励为零。

记 $F(s,a)=Q^\pi(s,a)\nabla_\theta\log\pi_\theta(a\mid s)$。将动作价值形式的策略梯度按各时刻的状态分布展开，再合并时间求和：

$$
\begin{aligned}
\nabla_\theta J(\theta)
&=\sum_{t=0}^{T-1}\gamma^t
  \sum_s\Pr_\theta(s_t=s)
  \sum_a\pi_\theta(a\mid s)F(s,a)\\
&=\sum_s\left[\sum_{t=0}^{T-1}\gamma^t\Pr_\theta(s_t=s)\right]
  \sum_a\pi_\theta(a\mid s)F(s,a)\\
&=Z\sum_s d_\theta(s)
  \sum_a\pi_\theta(a\mid s)F(s,a)\\
&=Z\,\mathbb E_{s\sim d_\theta,\,a\sim\pi_\theta(\cdot\mid s)}\left[
  Q^\pi(s,a)\nabla_\theta\log\pi_\theta(a\mid s)
  \right].
\end{aligned}
$$

连续情形应将状态点概率改为状态分布测度；有密度时可使用密度，并将状态、动作求和换成相应积分。

若以归一化回报 $J(\theta)/Z$ 为目标，其梯度便没有前置系数 $Z$。无限时域且 $0<\gamma<1$ 时，$Z=1/(1-\gamma)$，对应 [Harvard 讲义中的状态访问分布形式](https://hankyang.seas.harvard.edu/OptimalControlReinforcementLearning/policy-gradient.html#the-policy-gradient-lemma)。
