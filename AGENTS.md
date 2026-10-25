# AGENTS.md — AI 助手工作守则

## 这是什么

webkubor 的 GitHub 个人主页仓（profile README）：展示 AI agent 工具、设计系统、
无障碍工程与创意工具项目。**内容仓** —— 没有应用代码，只有生成主页动效 SVG 的零依赖脚本。

## 关键文件

- `README.md` / `README.en.md`：主页内容本体。
- `assets/*-{light,dark}.svg`：头图、Agent 面板、Bloom 色板三张动效图，**由脚本生成，不要手改**。
- `scripts/profile/`：生成器源码（色彩计算、设计令牌、三个面板）；令牌取自 typora-Bloom-theme 的 Petal 主题。

## 改动效图

```bash
node scripts/build-profile.mjs   # 重新生成 assets/*.svg
node scripts/check-profile.mjs   # 验收：产物与源码一致、无脚本/外链、带减弱动效、文字对比度 ≥ 4.5:1、双语引用一致
```

- GitHub 只认 SVG 内联 CSS 动画：不能有 `<script>`、`foreignObject`、外部字体或外链资源。
- 元素的静止样式就是动画终态，`prefers-reduced-motion` 时直接停在终态。
- 图里出现的对比度数字都由 `scripts/profile/color.mjs` 现算，不手填。

## 约定

- 主页的每个项目卡片必须与对应仓库现状一致（star 量级、定位一句话）—— 项目改名 / 归档时同步更新。
- 双语 README 同步维护。
- 图片走 assets/ 或 picx-images-hosting CDN，不外链不可控图床。
