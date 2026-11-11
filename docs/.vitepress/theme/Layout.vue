<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { VPNavBarSearch } from 'vitepress/theme'
import { data as notes } from './notes.data'
import { rlSeries } from './series'
import HomeDashboard from './components/HomeDashboard.vue'
import NotesArchive from './components/NotesArchive.vue'
import NoteIcon from './components/NoteIcon.vue'

const { frontmatter, page, isDark } = useData()
const route = useRoute()
const menuOpen = ref(false)
watch(() => route.path, () => { menuOpen.value = false })
const topics = [
  { key: 'rl', title: '强化学习', english: 'Reinforcement Learning' },
  { key: 'infra', title: '模型推理 Infra', english: 'Inference Infrastructure' },
  { key: 'papers', title: '论文阅读', english: 'Paper Notes' }
]
const activeTopic = computed(() => topics.find(topic => page.value.relativePath.startsWith(`${topic.key}/`)))
const isHome = computed(() => frontmatter.value.layout === 'home')
const isArchive = computed(() => frontmatter.value.layout === 'archive')
const headings = computed(() => page.value.headers.flatMap(header => [header, ...header.children]))
const currentChapter = computed(() => rlSeries.findIndex(chapter => page.value.relativePath === `rl/${chapter.slug}.md`))
const previousChapter = computed(() => currentChapter.value > 0 ? rlSeries[currentChapter.value - 1] : undefined)
const nextChapter = computed(() => currentChapter.value >= 0 ? rlSeries[currentChapter.value + 1] : undefined)
const breadcrumb = computed(() => isHome.value ? '知识库概览' : isArchive.value ? '全部笔记' : activeTopic.value?.title || '学习手记')
const isActive = (path: string) => page.value.relativePath === path
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
    <nav>
      <div class="nav-group primary-nav">
        <a :href="withBase('/')" :class="{ active: isHome }" :aria-current="isHome ? 'page' : undefined"><NoteIcon name="home" /><span>知识库概览</span></a>
        <a :href="withBase('/notes/')" :class="{ active: isArchive }" :aria-current="isArchive ? 'page' : undefined"><NoteIcon name="notes" /><span>全部笔记</span><small>{{ notes.length.toString().padStart(2, '0') }}</small></a>
      </div>
      <div class="nav-label">知识专栏 <span>COLLECTIONS</span></div>
      <div class="nav-group topic-nav">
        <a v-for="topic in topics" :key="topic.key" :href="withBase(`/${topic.key}/`)" :class="{ active: activeTopic?.key === topic.key }" :aria-current="isActive(`${topic.key}/index.md`) ? 'page' : undefined"><NoteIcon :name="topic.key" /><span>{{ topic.title }}</span><small>{{ notes.filter(note => note.category === topic.key).length.toString().padStart(2, '0') }}</small></a>
      </div>
      <template v-if="activeTopic?.key === 'rl'">
        <div class="nav-label">策略梯度系列 <span>READING ORDER</span></div>
        <div class="nav-group series-nav">
          <a v-for="(chapter, index) in rlSeries" :key="chapter.slug" :href="withBase(`/rl/${chapter.slug}.html`)" :class="{ active: currentChapter === index }" :aria-current="currentChapter === index ? 'page' : undefined"><small>{{ (index + 1).toString().padStart(2, '0') }}</small><span>{{ chapter.title }}</span></a>
        </div>
      </template>
    </nav>
    <div class="sidebar-bottom"><span class="growing-dot" /><span>慢慢学，认真记。</span><small>GROW A LITTLE EVERY DAY</small></div>
  </aside>

  <div class="workspace">
    <header class="topbar">
      <div class="breadcrumbs"><button class="mobile-menu icon-button" :aria-expanded="menuOpen" aria-label="展开导航" @click="menuOpen = !menuOpen"><NoteIcon name="menu" /></button><span class="breadcrumb-root">学习手记</span><span class="breadcrumb-slash">/</span><span>{{ breadcrumb }}</span></div>
      <div class="topbar-actions"><VPNavBarSearch /><span class="action-divider" /><button class="icon-button theme-toggle" :aria-label="isDark ? '切换浅色模式' : '切换深色模式'" @click="isDark = !isDark"><NoteIcon :name="isDark ? 'sun' : 'moon'" /></button></div>
    </header>
    <main id="main-content" :class="['main-content', { 'document-main': !isHome && !isArchive }]" tabindex="-1">
      <HomeDashboard v-if="isHome" />
      <NotesArchive v-else-if="isArchive" :key="route.path" />
      <div v-else-if="page.isNotFound" class="not-found"><span class="eyebrow">404 · LOST IN THE GARDEN</span><h1>这一页还没有长出来</h1><p>回到学习手记，继续阅读。</p><a class="writing-link" :href="withBase('/')">返回首页 <NoteIcon name="arrow" /></a></div>
      <template v-else>
        <div v-if="activeTopic" class="document-header"><a :href="withBase(`/${activeTopic.key}/`)" class="eyebrow">{{ activeTopic.english }}</a></div>
        <div class="document-grid">
          <article class="document-article">
            <Content class="vp-doc" />
            <nav v-if="currentChapter >= 0" class="series-navigation" aria-label="章节阅读顺序">
              <a v-if="previousChapter" :href="withBase(`/rl/${previousChapter.slug}.html`)"><span>上一篇</span>{{ previousChapter.title }}</a>
              <a v-if="nextChapter" class="next-chapter" :href="withBase(`/rl/${nextChapter.slug}.html`)"><span>下一篇</span>{{ nextChapter.title }}</a>
            </nav>
            <div v-if="frontmatter.tags?.length" class="article-tags"><a v-for="tag in frontmatter.tags" :key="tag" :href="withBase(`/notes/?tag=${encodeURIComponent(tag)}`)"># {{ tag }}</a></div>
            <div class="article-end">
              <time v-if="frontmatter.updated" :datetime="frontmatter.updated">更新于 {{ formatDate(frontmatter.updated) }}</time>
              <a v-if="activeTopic" :href="withBase(`/${activeTopic.key}/`)">{{ activeTopic.title }}专栏 <NoteIcon name="arrow" /></a>
              <a v-else :href="withBase('/notes/')">全部笔记 <NoteIcon name="arrow" /></a>
            </div>
          </article>
          <aside v-if="headings.length" class="document-toc" aria-label="文章目录"><div class="toc-inner"><h2>本页目录</h2><a v-for="heading in headings" :key="heading.slug" :href="`#${heading.slug}`" :class="{ 'toc-child': heading.level > 2 }">{{ heading.title }}</a></div></aside>
        </div>
      </template>
    </main>
  </div>
</template>
