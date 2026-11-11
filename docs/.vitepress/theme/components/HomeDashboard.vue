<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as notes } from '../notes.data'

const topics = [
  {
    id: 'rl', number: '01', title: '强化学习', english: 'REINFORCEMENT LEARNING',
    description: '从基本概念到算法推导，逐步建立决策与学习的知识体系。',
    tags: ['基础概念', '算法脉络'], href: '/rl/',
    icon: 'M5 8h5v5H5z M19 19h5v5h-5z M19 3h5v5h-5z M10 10.5h4a7.5 7.5 0 0 0 7.5-2.5 M10 10.5h4a7.5 7.5 0 0 1 7.5 8.5',
  },
  {
    id: 'infra', number: '02', title: '模型推理 Infra', english: 'INFERENCE INFRASTRUCTURE',
    description: '沿着模型推理的执行链路，理解框架设计与系统优化。',
    tags: ['推理框架', '系统设计'], href: '/infra/',
    icon: 'M4 7l10-5 10 5-10 5z M4 13l10 5 10-5 M4 19l10 5 10-5 M4 7v5 M24 7v5',
  },
  {
    id: 'papers', number: '03', title: '论文阅读', english: 'PAPERS & READING',
    description: '留下论文的核心问题、方法与思考，让阅读有所沉淀。',
    tags: ['阅读笔记', '问题与启发'], href: '/papers/',
    icon: 'M7 3h10l5 5v17H7z M17 3v6h5 M11 14h7 M11 18h7 M11 22h4',
  },
]
const recentNotes = computed(() => [...notes].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 3))
const countFor = (category: string) => {
  const categoryNotes = notes.filter(note => note.category === category)
  return categoryNotes.length ? `${categoryNotes.length} 篇笔记` : '专栏目录'
}
const categoryName = (category: string) => topics.find(topic => topic.id === category)?.title
const tagLink = (tag: string) => withBase(`/notes/?tag=${encodeURIComponent(tag)}`)
</script>

<template>
  <div class="knowledge-home">
    <section class="home-intro" aria-labelledby="home-title">
      <div class="intro-copy">
        <p class="eyebrow"><span></span> PERSONAL KNOWLEDGE GARDEN</p>
        <h1 id="home-title">让学过的知识，<br>慢慢连成体系。</h1>
        <p class="intro-description">这里是我的学习笔记与思考存档。<br>从一个概念、一段代码、一篇论文开始，持续积累，反复连接。</p>
        <a class="intro-link" :href="withBase('/notes/')">翻开我的笔记 <span aria-hidden="true">↗</span></a>
      </div>
      <div class="knowledge-drawing" aria-hidden="true">
        <svg viewBox="0 0 290 225" fill="none">
          <circle cx="147" cy="113" r="82" class="orbit" />
          <circle cx="147" cy="113" r="54" class="inner-orbit" />
          <path d="M84 73L211 89L145 179Z" class="connections" />
          <path d="M84 73L147 113L211 89M147 113L145 179" class="connections faint" />
          <circle cx="147" cy="113" r="5" class="center-dot" />
          <rect x="60" y="49" width="48" height="48" rx="13" class="node" />
          <path d="M73 73H95M84 62V84M76 65L92 81M76 81L92 65" class="node-icon" />
          <rect x="187" y="65" width="48" height="48" rx="13" class="node" />
          <path d="M200 82L211 76L222 82L211 88L200 82ZM200 89L211 95L222 89M200 96L211 102L222 96" class="node-icon" />
          <rect x="121" y="155" width="48" height="48" rx="13" class="node" />
          <path d="M137 167H148L154 173V191H137V167ZM148 167V173H154M141 179H150M141 184H148" class="node-icon" />
          <text x="84" y="36" text-anchor="middle">RL</text>
          <text x="251" y="93">INFRA</text>
          <text x="145" y="222" text-anchor="middle">PAPERS</text>
          <path d="M40 119H48M44 115V123M229 154H237M233 150V158" class="little-cross" />
          <circle cx="179" cy="33" r="2.5" class="little-dot" />
          <circle cx="88" cy="183" r="2" class="little-dot" />
        </svg>
        <span class="drawing-caption">LEARN. CONNECT. REVISIT.</span>
      </div>
    </section>

    <section class="topic-section" aria-labelledby="topics-title">
      <div class="section-heading">
        <div class="heading-with-index"><span class="section-index">01 /</span><h2 id="topics-title">我的知识版图</h2></div>
        <span class="section-description">三个方向，持续生长</span>
      </div>
      <div class="topic-grid">
        <a v-for="topic in topics" :key="topic.id" class="topic-card" :href="withBase(topic.href)">
          <div class="topic-card-top">
            <div class="topic-icon"><svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path :d="topic.icon" /></svg></div>
            <span class="topic-number">{{ topic.number }}</span>
          </div>
          <p class="topic-english">{{ topic.english }}</p>
          <h3>{{ topic.title }}</h3>
          <p class="topic-description">{{ topic.description }}</p>
          <div class="topic-tags"><span v-for="tag in topic.tags" :key="tag">{{ tag }}</span></div>
          <div class="topic-card-bottom"><span>{{ countFor(topic.id) }}</span><span class="card-arrow" aria-hidden="true">↗</span></div>
        </a>
      </div>
    </section>

    <div class="home-bottom-grid">
      <section class="recent-section" aria-labelledby="recent-title">
        <div class="section-heading recent-heading">
          <div class="heading-with-index"><span class="section-index">02 /</span><h2 id="recent-title">最近整理</h2></div>
          <a class="all-notes-link" :href="withBase('/notes/')">全部笔记 <span aria-hidden="true">→</span></a>
        </div>
        <div class="recent-list">
          <article v-for="note in recentNotes" :key="note.url" class="recent-note">
            <div class="recent-meta"><span class="category-label">{{ categoryName(note.category) }}</span><time :datetime="note.updated">{{ note.updated.replaceAll('-', '.') }}</time></div>
            <a class="recent-note-title" :href="withBase(note.url)">{{ note.title }}<span aria-hidden="true">↗</span></a>
            <div class="recent-note-tags"><a v-for="tag in note.tags.slice(0, 2)" :key="tag" :href="tagLink(tag)"># {{ tag }}</a></div>
          </article>
          <p v-if="recentNotes.length === 0" class="empty-notes">第一篇笔记，从一个想弄懂的问题开始。</p>
        </div>
      </section>

      <aside class="writing-note">
        <span class="note-corner" aria-hidden="true">✳</span>
        <p class="writing-eyebrow">POLICY GRADIENTS</p>
        <h2>REINFORCE 的局限</h2>
        <p>梯度公式成立之后，训练还面临什么困难？<br>从采样波动、交互成本与信用分配，<br>理解后续方法的出发点。</p>
        <div class="writing-links">
          <a :href="withBase('/rl/reinforce_limitations.html')">阅读这一章 <span aria-hidden="true">↗</span></a>
          <a :href="withBase('/rl/')">查看策略梯度系列 <span aria-hidden="true">↗</span></a>
        </div>
        <div class="writing-rule"></div>
        <span class="writing-footnote">沿着问题，连接不同方法。</span>
      </aside>
    </div>

    <footer class="home-footer"><span>记录是理解的开始。</span><span>PLOG <span class="footer-dot">·</span> 持续积累，常看常新</span></footer>
  </div>
</template>

<style scoped>
.knowledge-home { max-width: 1060px; margin: 0 auto; padding: 0 0 8px; color: var(--kb-text); }
.home-intro { min-height: 326px; display: flex; align-items: center; justify-content: space-between; gap: 32px; padding: 15px 8px 42px 0; }
.eyebrow { display: flex; gap: 9px; align-items: center; margin: 0 0 23px; color: var(--kb-green); font-size: 10px; font-weight: 650; letter-spacing: 2px; }
.eyebrow > span { width: 6px; height: 6px; border-radius: 50%; background: var(--kb-green); }
.intro-copy h1 { margin: 0 0 20px; font-size: clamp(32px, 3.4vw, 43px); font-weight: 650; line-height: 1.45; letter-spacing: -1.7px; }
.intro-description { margin: 0; color: var(--kb-muted); font-size: 13px; line-height: 1.95; }
.intro-link { display: inline-flex; gap: 25px; align-items: center; margin-top: 21px; font-size: 12px; font-weight: 600; color: var(--kb-green); }
.intro-link:hover { text-decoration: underline; text-underline-offset: 5px; }
.intro-link span { font-size: 19px; }
.knowledge-drawing { width: 286px; flex-shrink: 0; margin-right: 8px; padding-top: 4px; text-align: center; }
.knowledge-drawing svg { display: block; width: 100%; overflow: visible; }
.orbit { stroke: var(--kb-line); stroke-dasharray: 2 5; }
.inner-orbit { stroke: var(--kb-line); opacity: .55; }
.connections { stroke: var(--kb-green); stroke-width: 1; opacity: .43; }
.connections.faint { opacity: .2; }
.center-dot, .little-dot { fill: var(--kb-green); opacity: .6; }
.node { fill: var(--kb-bg); stroke: var(--kb-green); stroke-opacity: .42; }
.node-icon { stroke: var(--kb-green); stroke-width: 1.2; stroke-linejoin: round; stroke-linecap: round; }
.knowledge-drawing text { fill: var(--kb-muted); font-family: ui-monospace, monospace; font-size: 9px; letter-spacing: 1.3px; }
.little-cross { stroke: var(--kb-green); opacity: .38; }
.drawing-caption { display: block; margin-top: 17px; color: var(--kb-muted); font-family: ui-monospace, monospace; font-size: 8px; letter-spacing: 2px; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 19px; }
.heading-with-index { display: flex; align-items: center; gap: 13px; }
.section-index { font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: .5px; color: var(--kb-muted); }
.section-heading h2 { margin: 0; font-size: 17px; letter-spacing: -.4px; font-weight: 600; }
.section-description { color: var(--kb-muted); font-size: 11px; }
.topic-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 17px; }
.topic-card { display: flex; flex-direction: column; min-width: 0; padding: 22px 24px 0; border: 1px solid var(--kb-line); border-radius: 9px; background: var(--kb-panel); color: inherit; transition: border-color .2s, transform .2s, box-shadow .2s; }
.topic-card:hover { transform: translateY(-3px); border-color: var(--kb-green); box-shadow: 0 7px 18px rgb(35 62 45 / 4%); }
.topic-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 21px; }
.topic-icon { width: 37px; height: 37px; display: grid; place-items: center; color: var(--kb-green); }
.topic-icon svg { width: 28px; height: 28px; }
.topic-icon path { stroke: currentColor; stroke-width: 1.25; stroke-linecap: round; stroke-linejoin: round; }
.topic-number { font-family: ui-monospace, monospace; color: var(--kb-muted); opacity: .55; font-size: 12px; }
.topic-english { margin: 0 0 9px; font-size: 8px; line-height: 1.5; font-weight: 500; letter-spacing: 1px; color: var(--kb-muted); }
.topic-card h3 { margin: 0 0 12px; font-size: 21px; line-height: 1.4; font-weight: 600; letter-spacing: -.7px; }
.topic-description { flex: 1; margin: 0; color: var(--kb-muted); font-size: 12px; line-height: 1.9; }
.topic-tags { display: flex; gap: 7px; flex-wrap: wrap; margin: 19px 0 21px; }
.topic-tags span { padding: 3px 7px; color: var(--kb-muted); background: var(--kb-bg); border: 1px solid var(--kb-line); border-radius: 4px; font-size: 9px; line-height: 1.6; }
.topic-card-bottom { display: flex; align-items: center; justify-content: space-between; min-height: 49px; border-top: 1px solid var(--kb-line); color: var(--kb-muted); font-size: 10px; }
.card-arrow { color: var(--kb-green); font-size: 20px; font-weight: 400; }
.home-bottom-grid { display: grid; grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr); align-items: start; gap: 33px; margin-top: 39px; }
.recent-heading { min-height: 26px; margin-bottom: 13px; }
.all-notes-link { display: flex; align-items: center; gap: 10px; color: var(--kb-muted); font-size: 10px; }
.all-notes-link:hover { color: var(--kb-green); }
.recent-note { padding: 16px 1px 17px; border-bottom: 1px solid var(--kb-line); }
.recent-note:first-child { border-top: 1px solid var(--kb-line); }
.recent-meta { display: flex; align-items: center; gap: 8px; font-size: 9px; line-height: 1.6; }
.category-label { color: var(--kb-green); }
.note-state { color: var(--kb-muted); padding-left: 8px; border-left: 1px solid var(--kb-line); }
.recent-meta time { margin-left: auto; color: var(--kb-muted); font-family: ui-monospace, monospace; font-size: 9px; }
.recent-note-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 9px 0 8px; color: var(--kb-text); font-size: 14px; font-weight: 550; line-height: 1.65; }
.recent-note-title > span { color: var(--kb-muted); font-size: 16px; font-weight: 400; }
.recent-note-title:hover, .recent-note-title:hover > span { color: var(--kb-green); }
.recent-note-tags { display: flex; flex-wrap: wrap; gap: 13px; color: var(--kb-muted); font-size: 9px; }
.recent-note-tags a:hover { color: var(--kb-green); }
.empty-notes { padding: 24px 0; color: var(--kb-muted); font-size: 13px; }
.writing-note { position: relative; margin-top: 1px; padding: 25px 25px 22px; border: 1px solid color-mix(in srgb, var(--kb-green) 12%, var(--kb-line)); border-radius: 7px; background: color-mix(in srgb, var(--kb-green) 5%, var(--kb-bg)); }
.note-corner { position: absolute; top: 20px; right: 20px; color: var(--kb-green); opacity: .55; font-size: 28px; font-weight: 300; }
.writing-eyebrow { margin: 0 0 23px; color: var(--kb-green); font-family: ui-monospace, monospace; font-size: 8px; letter-spacing: 1.3px; }
.writing-note h2 { margin: 0 0 14px; font-size: 21px; font-weight: 550; letter-spacing: -.6px; }
.writing-note > p:not(.writing-eyebrow) { margin: 0; color: var(--kb-muted); font-size: 11px; line-height: 2; }
.writing-links { display: grid; gap: 11px; margin-top: 23px; color: var(--kb-green); font-size: 11px; }
.writing-links a { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.writing-links a:hover { text-decoration: underline; text-underline-offset: 4px; }
.writing-rule { height: 1px; margin: 24px 0 15px; background: color-mix(in srgb, var(--kb-green) 13%, transparent); }
.writing-footnote { color: var(--kb-muted); font-size: 9px; }
.home-footer { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 35px; padding-top: 19px; border-top: 1px solid var(--kb-line); color: var(--kb-muted); font-size: 9px; letter-spacing: .2px; }
.footer-dot { padding: 0 7px; }
@media (max-width: 1100px) {
  .knowledge-drawing { width: 235px; margin-right: 0; }
  .intro-copy h1 { font-size: 36px; }
  .topic-card { padding: 20px 18px 0; }
  .topic-card h3 { font-size: 19px; }
  .home-bottom-grid { gap: 23px; }
  .writing-note { padding: 24px 20px 22px; }
}
@media (max-width: 900px) {
  .home-intro { min-height: 300px; }
  .knowledge-drawing { width: 205px; }
  .topic-grid { grid-template-columns: 1fr; gap: 14px; }
  .topic-card { padding: 20px 22px 0; }
  .topic-card-top { margin-bottom: 12px; }
  .topic-description { max-width: 440px; }
  .topic-tags { margin: 14px 0 17px; }
  .topic-card h3 { font-size: 22px; }
  .topic-card-bottom { min-height: 43px; }
  .home-bottom-grid { grid-template-columns: 1fr; gap: 28px; }
  .writing-note { padding: 25px; }
}
@media (max-width: 600px) {
  .home-intro { min-height: 0; padding: 14px 0 32px; }
  .eyebrow { font-size: 8px; letter-spacing: 1.6px; margin-bottom: 18px; }
  .intro-copy h1 { font-size: 32px; letter-spacing: -1px; margin-bottom: 16px; }
  .intro-description { font-size: 12px; }
  .knowledge-drawing { display: none; }
  .section-heading h2 { font-size: 16px; }
  .section-description { font-size: 9px; }
  .heading-with-index { gap: 9px; }
  .home-bottom-grid { margin-top: 30px; }
  .home-footer { align-items: flex-start; flex-direction: column; gap: 8px; margin-top: 25px; font-size: 8px; }
}
@media (prefers-reduced-motion: reduce) { .topic-card { transition: none; } .topic-card:hover { transform: none; } }
</style>
