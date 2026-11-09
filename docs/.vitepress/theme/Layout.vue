<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { VPNavBarSearch } from 'vitepress/theme'
import NoteIcon from './components/NoteIcon.vue'

const { frontmatter, page, isDark } = useData()
const route = useRoute()
const menuOpen = ref(false)
const articlePath = '/rl/policy_gradient_reinforce.html'
watch(() => route.path, () => { menuOpen.value = false })
const isArticle = computed(() => page.value.relativePath === 'rl/policy_gradient_reinforce.md')
const headings = computed(() => page.value.headers.flatMap(header => [header, ...header.children]))
const breadcrumb = computed(() => isArticle.value ? '强化学习' : '学习手记')
const formatDate = (date: string) => {
  const [year, month, day] = date.split('-')
  return `${year}年${Number(month)}月${Number(day)}日`
}
</script>

<template>
  <a class="skip-link" href="#main-content">跳转到内容</a>
  <button v-if="menuOpen" class="nav-scrim" aria-label="关闭导航" @click="menuOpen = false" />
  <aside class="sidebar" :class="{ 'is-open': menuOpen }" aria-label="主导航">
    <a class="brand" :href="withBase('/')" aria-label="plog 学习手记首页">
      <span class="brand-mark"><NoteIcon name="book" /></span>
      <span class="brand-word">plog<span class="brand-dot">.</span><small>学习手记</small></span>
    </a>
    <div class="sidebar-caption">一个持续生长的个人知识库</div>
    <nav class="nav-group primary-nav">
      <a :href="withBase(articlePath)" :class="{ active: isArticle }" :aria-current="isArticle ? 'page' : undefined"><NoteIcon name="rl" /><span>策略梯度与 REINFORCE</span></a>
    </nav>
    <div class="sidebar-bottom"><span class="growing-dot" /><span>慢慢学，认真记。</span><small>GROW A LITTLE EVERY DAY</small></div>
  </aside>

  <div class="workspace">
    <header class="topbar">
      <div class="breadcrumbs"><button class="mobile-menu icon-button" :aria-expanded="menuOpen" aria-label="展开导航" @click="menuOpen = !menuOpen"><NoteIcon name="menu" /></button><span class="breadcrumb-root">学习手记</span><span class="breadcrumb-slash">/</span><span>{{ breadcrumb }}</span></div>
      <div class="topbar-actions"><VPNavBarSearch /><span class="action-divider" /><button class="icon-button theme-toggle" :aria-label="isDark ? '切换浅色模式' : '切换深色模式'" @click="isDark = !isDark"><NoteIcon :name="isDark ? 'sun' : 'moon'" /></button></div>
    </header>
    <main id="main-content" class="main-content document-main" tabindex="-1">
      <div v-if="page.isNotFound" class="not-found"><span class="eyebrow">404 · LOST IN THE GARDEN</span><h1>这一页还没有长出来</h1><p>回到学习手记，继续阅读。</p><a class="writing-link" :href="withBase('/')">返回学习手记 <NoteIcon name="arrow" /></a></div>
      <template v-else>
        <div v-if="isArticle" class="document-header"><span class="eyebrow">REINFORCEMENT LEARNING</span></div>
        <div class="document-grid">
          <article class="document-article">
            <Content class="vp-doc" />
            <div v-if="frontmatter.tags?.length" class="article-tags"><span v-for="tag in frontmatter.tags" :key="tag"># {{ tag }}</span></div>
            <div class="article-end">
              <time v-if="frontmatter.updated" :datetime="frontmatter.updated">更新于 {{ formatDate(frontmatter.updated) }}</time>
              <a :href="withBase('/')">学习手记 <NoteIcon name="arrow" /></a>
            </div>
          </article>
          <aside v-if="headings.length" class="document-toc" aria-label="文章目录"><div class="toc-inner"><h2>本页目录</h2><a v-for="heading in headings" :key="heading.slug" :href="`#${heading.slug}`" :class="{ 'toc-child': heading.level > 2 }">{{ heading.title }}</a></div></aside>
        </div>
      </template>
    </main>
  </div>
</template>
