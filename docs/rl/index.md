---
title: 强化学习
description: 策略梯度系列的阅读顺序与主题目录。
search: false
---

<script setup>
import { withBase } from 'vitepress'
import { rlSeries } from '../.vitepress/theme/series'
import { data as notes } from '../.vitepress/theme/notes.data'

const articleUrls = new Set(notes.map(note => note.url))
</script>

# 强化学习

沿着梯度估计、方差控制、价值估计与策略更新，逐步理解策略梯度方法。

## 策略梯度系列

<ol>
  <li v-for="chapter in rlSeries" :key="chapter.slug">
    <a :href="withBase(`/rl/${chapter.slug}.html`)">{{ chapter.title }}</a>
    <span v-if="!articleUrls.has(`/rl/${chapter.slug}.html`)"> · 内容待完善</span>
  </li>
</ol>

标为“内容待完善”的页面保留主题提纲，随学习进度逐篇补充。

## 相关专栏

- [模型推理 Infra](../infra/index.md)
- [论文阅读](../papers/index.md)
