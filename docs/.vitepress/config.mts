import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import equationNumbers from './equations.ts'

export default defineConfig({
  lang: 'zh-CN',
  title: 'plog · 学习手记',
  description: '强化学习、模型推理 Infra 与论文阅读的个人知识库。',
  outDir: fileURLToPath(new URL('../../dist', import.meta.url)),
  base: '/plog/',
  cleanUrls: false,
  markdown: {
    math: true,
    headers: true,
    config: equationNumbers
  },
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/plog/favicon.svg' }]],
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章内容' },
              modal: {
                displayDetails: '显示详细内容',
                resetButtonTitle: '清除搜索',
                backButtonTitle: '返回',
                noResultsText: '没有找到相关笔记',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        }
      }
    }
  }
})
