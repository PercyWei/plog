# plog

个人学习知识库，由 GitHub 保存源码，GitHub Actions 自动构建并发布到 GitHub Pages。

- [知识库首页](https://percywei.github.io/plog/)
- [强化学习专栏](https://percywei.github.io/plog/rl/)
- [模型推理 Infra](https://percywei.github.io/plog/infra/)
- [论文阅读](https://percywei.github.io/plog/papers/)

## 编辑与发布

在 GitHub 网页打开对应 Markdown，编辑后提交到 `main`。日常更新不需要本地服务；发布结果可在 [Actions](https://github.com/PercyWei/plog/actions) 查看。

目前已有正文：

1. [策略梯度与 REINFORCE](docs/rl/policy_gradient_reinforce.md)
2. [REINFORCE 的局限](docs/rl/reinforce_limitations.md)

其他策略梯度章节提供待完善的提纲。三个专栏及全部笔记页用于组织内容，不将计划中的笔记计作已有正文。

## 内容组织

- `docs/index.md`：知识库首页。
- `docs/rl/`、`docs/infra/`、`docs/papers/`：专栏目录与主题笔记。
- `docs/.vitepress/theme/series.ts`：策略梯度系列的统一阅读顺序，供目录、侧栏和上一篇／下一篇导航使用。
- `docs/.vitepress/theme/notes.data.ts`：按正文元数据生成笔记列表。

正文使用稳定的主题文件名，frontmatter 包含 `title`、`description`、`category`、`tags`、`created`、`updated`。`category` 取 `rl`、`infra` 或 `papers`，日期使用带引号的 `YYYY-MM-DD`。栏目与提纲页不填写 `category`；提纲页设置 `search: false`，正文完成后再加入元数据及搜索。

完整笔记统一按“正文 → 附录 → 参考资料”组织。推导放入附录，正文保留相应链接；参考资料集中放在全文最后，条目仅保留作者或机构、标题、必要出版信息和链接，并简短标明资料类型。

关键公式使用 `\label{eq-topic-name}` 编号，文字通过 `\eqref{eq-topic-name}` 引用，编号按篇生成。

## 本地预览（可选）

```sh
npm ci
npm run docs:dev
```

提交前可运行 `npm run docs:build` 检查构建，产物位于 `dist/`。
