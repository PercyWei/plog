import { createContentLoader } from 'vitepress'

export interface Note {
  url: string
  title: string
  description: string
  category: 'rl' | 'infra' | 'papers'
  tags: string[]
  created: string
  updated: string
}

declare const data: Note[]
export { data }

export default createContentLoader(['rl/**/*.md', 'infra/**/*.md', 'papers/**/*.md'], {
  transform(pages) {
    return pages.filter(page => page.frontmatter.category !== undefined).map(({ url, frontmatter: f }) => {
      if (!['rl', 'infra', 'papers'].includes(f.category)
        || !['title', 'description'].every(key => typeof f[key] === 'string' && f[key].trim())
        || !['created', 'updated'].every(key => typeof f[key] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(f[key]))
        || !Array.isArray(f.tags) || !f.tags.every((tag: unknown) => typeof tag === 'string')) {
        throw new Error(`笔记元数据不符合约定：${url}`)
      }
      return { url, title: f.title, description: f.description, category: f.category,
        tags: f.tags, created: f.created, updated: f.updated } as Note
    }).sort((a, b) => b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title, 'zh-CN'))
  }
})
