# plog

强化学习学习笔记，目前公开《策略梯度与 REINFORCE》。

[网站入口](https://percywei.github.io/plog/)

## 编辑与发布

1. 在 GitHub 网页上[编辑文章](https://github.com/PercyWei/plog/edit/main/docs/rl/policy_gradient_reinforce.md)，对应文件为 `docs/rl/policy_gradient_reinforce.md`。
2. 修改 Markdown 后，将提交保存到 `main` 分支。
3. GitHub Actions 自动构建并发布到 GitHub Pages，可在 [Actions](https://github.com/PercyWei/plog/actions) 查看 `Deploy site` 的发布状态。

日常更新只需在 GitHub 网页操作。当前展示范围由 `docs/.vitepress/config.mts` 中的 `displayedPages` 指定；新增页面时，将路径加入该集合，并补充首页和导航链接。

## 本地预览（可选）

```sh
npm ci
npm run docs:dev
```
