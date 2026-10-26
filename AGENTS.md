# AGENTS.md — AI 助手工作守则

## 这是什么

webkubor 的 GitHub 个人主页仓（profile README）：展示 AI agent 工具、设计系统、
无障碍工程与创意工具项目。**内容仓** —— 没有应用代码，只有生成主页动效 SVG 的零依赖脚本，
以及一套把 README 从「手写 HTML」变成「数据驱动 + 自动同步」的生成器。

## 关键文件

- `data/projects.json`：主页内容的**唯一真源**——分组、项目名、中英一句话、徽章。
  改文案只改这里，不改 README。
- `data/recent.json`：GitHub 实时状态快照（项目数 / 总 star / 最近推送 / 每个仓库的 star）。
  由 `scripts/sync-data.mjs` 从 GitHub 拉，**不手改**。
- `README.md` / `README.en.md`：**生成物**，由 `scripts/build-readme.mjs` 渲染，不要手改。
- `assets/*-{light,dark}.svg`：头图、Agent 面板、Bloom 色板三张动效图，**由脚本生成，不要手改**。
- `scripts/profile/`：生成器源码（色彩计算、设计令牌、三个面板）；令牌取自 typora-Bloom-theme 的 Petal 主题。

## 改内容（文案 / 项目清单）

```bash
node scripts/build-readme.mjs   # 从 data/projects.json 重新生成双语 README
node scripts/check-readme.mjs    # 验收：与生成器一致、双语对称、链接有效、长度预算、star 徽章与实时数据一致
```

- 改 `data/projects.json` → 跑 build-readme → 跑 check-readme。
- 手改 README 会被 `check-readme.mjs` 发现（生成标记 + 逐字节比对）。
- `check-readme.mjs` 在 `gh` 可用时用**一次全量仓库列表**判定链接是否 404
  （逐仓库调 `gh repo view` 会触发 GraphQL 握手超时，是已踩过的坑）。
- 长度预算按**访客真实要滚过的量**算：折叠前的大图数与项目卡数，不是行数。
  折叠块（`<details>`）里的内容默认不计入版面。

## 改效图

```bash
node scripts/build-profile.mjs   # 重新生成 assets/*.svg
node scripts/check-profile.mjs   # 验收：产物与源码一致、无脚本/外链、带减弱动效、文字对比度 ≥ 4.5:1、双语引用一致、减弱动效终态不丢信息
```

- 动画只能写在 **.svg 文件内部的 `<style>`** 里，并用 `<picture>`/`<img>` 引用；直接写进 README 的 `<svg>` 会被 GitHub 整段删掉。
  文件里不能有 `<script>`、`foreignObject`、外部字体或外链资源；`offset-path` 动画在三大引擎都冻结，别用。
  GitHub 官方文档并不承诺 SVG 动画（"SVGs don't currently support inline scripting or animation"），Chromium/Firefox 实测能动、Safari 未验证——所以终态必须自洽。
- 元素的静止样式就是动画终态，`prefers-reduced-motion` 时直接停在终态。
  **关键帧不能以 `opacity:0` 收尾**，文字 class 也不能在静止样式里钉 `opacity:0`——
  否则减弱动效下信息直接消失（`check-profile.mjs` 会拦）。
- 图里出现的对比度数字都由 `scripts/profile/color.mjs` 现算，不手填。
- 明暗两版的动效密度要对齐：不要因为「深色底上某色本来就达标」就让那一列完全静止。
- **背景矩形 `<rect width=… height=… rx=24 fill=bg>` 不能漏**——浅色底看不出来，
  漏了深色版就是透明底 + 白字，GitHub 深色模式下完全不可读。

## 维护主页数据

```bash
node scripts/sync-data.mjs   # 拉 GitHub 实时状态 → data/recent.json
```

- GitHub 元数据一律走 `gh` CLI，不手写 HTTP 请求。
- `.github/workflows/sync-profile.yml` 每天自动跑：拉数据 → 重生成 README → 跑门禁 → 有变化才提交。
- 手动触发：`gh workflow run sync-profile.yml`。

## 约定

- 主页的每个项目卡片必须与对应仓库现状一致（star 量级、定位一句话）—— 项目改名 / 归档时同步更新。
- 仓库改名或归档后，主页链接必须跟着改；`check-readme.mjs` 会用 404 判定拦住。
- 双语 README 同步维护，且由同一份数据派生（不允许两边各写一遍文案）。
- 图片走 assets/ 或 picx-images-hosting CDN，不外链不可控图床。
