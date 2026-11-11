<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { data as notes } from '../notes.data'
import NoteIcon from './NoteIcon.vue'

const route = useRoute()
const category = ref('all')
const selectedTag = ref('')
const query = ref('')
const categories = [{ key: 'all', title: '全部' }, { key: 'rl', title: '强化学习' }, { key: 'infra', title: '模型推理 Infra' }, { key: 'papers', title: '论文阅读' }]
const tags = [...new Set(notes.flatMap(note => note.tags))]
const categoryNames = Object.fromEntries(categories.map(item => [item.key, item.title]))
const filtered = computed(() => notes.filter(note => (category.value === 'all' || note.category === category.value)
  && (!selectedTag.value || note.tags.includes(selectedTag.value))
  && `${note.title} ${note.description} ${note.tags.join(' ')}`.toLowerCase().includes(query.value.toLowerCase().trim())))
function readQuery() { selectedTag.value = new URLSearchParams(window.location.search).get('tag') || '' }
function chooseTag(tag: string) {
  selectedTag.value = selectedTag.value === tag ? '' : tag
  const url = new URL(window.location.href)
  if (selectedTag.value) url.searchParams.set('tag', selectedTag.value)
  else url.searchParams.delete('tag')
  window.history.replaceState({}, '', url)
}
function reset() { category.value = 'all'; query.value = ''; chooseTag(selectedTag.value) }
onMounted(readQuery)
watch(() => route.path, readQuery)
</script>

<template>
  <section class="archive">
    <span class="eyebrow">THE NOTEBOOK</span>
    <div class="archive-title"><h1>所有记录，都在这里。</h1><span>{{ notes.length.toString().padStart(2, '0') }} 篇笔记</span></div>
    <p class="archive-description">沿着主题寻找知识，也可以从一个关键词重新出发。</p>
    <div class="archive-controls"><div class="category-tabs" aria-label="按主题筛选"><button v-for="item in categories" :key="item.key" :class="{ selected: category === item.key }" :aria-pressed="category === item.key" @click="category = item.key">{{ item.title }}<small>{{ item.key === 'all' ? notes.length : notes.filter(n => n.category === item.key).length }}</small></button></div><input v-model="query" type="search" aria-label="筛选笔记标题、描述和标签" placeholder="筛选标题或关键词…" /></div>
    <div class="tag-filters"><NoteIcon name="tag" /><button v-for="tag in tags" :key="tag" :class="{ selected: selectedTag === tag }" :aria-pressed="selectedTag === tag" @click="chooseTag(tag)">{{ tag }}</button><button v-if="selectedTag && !tags.includes(selectedTag)" class="selected" @click="chooseTag(selectedTag)">{{ selectedTag }} ×</button></div>
    <div class="archive-result-count">{{ filtered.length }} 条记录<span v-if="selectedTag"> · 标签：{{ selectedTag }}</span><button v-if="category !== 'all' || selectedTag || query" @click="reset">清除筛选</button></div>
    <div class="note-list"><a v-for="note in filtered" :key="note.url" class="archive-note" :href="withBase(note.url)"><div class="archive-note-icon" :class="note.category"><NoteIcon :name="note.category" /></div><div class="archive-note-content"><div class="archive-note-meta">{{ categoryNames[note.category] }}<span>·</span>{{ note.updated }}</div><h2>{{ note.title }}</h2><p>{{ note.description }}</p><div class="archive-note-tags"><span v-for="tag in note.tags" :key="tag"># {{ tag }}</span></div></div><NoteIcon class="note-arrow" name="arrow" /></a></div>
    <div v-if="!filtered.length" class="empty-state"><NoteIcon name="notes" /><h2>这里还没有对应的笔记</h2><p>试试其他关键词，或清除筛选查看全部记录。</p><button @click="reset">查看全部笔记</button></div>
    <p class="archive-footnote">笔记正文在此汇总，各专栏目录保留后续的学习路径。</p>
  </section>
</template>
