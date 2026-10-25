<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/hero-dark.svg" />
    <img src="./assets/hero-light.svg" width="100%" alt="webkubor：把审美做成可验证的工程。六片莫兰迪花瓣在量环中展开，字标从原色沉成可读的墨色。" />
  </picture>
</p>

<p align="center">
  我做两类东西：让 AI 编码过程更安全、可观察；让设计与无障碍标准能被工程验证。<br/>
  <sub>Design-minded engineer · Agent infrastructure · Testable design systems</sub>
</p>

<p align="center">
  <a href="https://webkubor.online">个人站</a> ·
  <a href="https://github.com/webkubor?tab=repositories">全部项目</a> ·
  <a href="https://x.com/webkuborDev">X</a> ·
  <a href="./README.en.md">English</a>
</p>

## 代表作

### Agent 工具：从“让 AI 写代码”到“让它看得见、守得住”

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/agent-dark.svg" />
    <img src="./assets/agent-light.svg" width="100%" alt="一次 401 的修复过程：Agent Eyes 收集脱敏证据，agent 按证据定位到本地 cookie 过期，自修复后用同一请求复验为 200。" />
  </picture>
</p>

- **[👀 Agent Eyes](https://github.com/webkubor/vite-plugin-agent-eyes)** — 给 coding agent 的 Vite 运行时遥测层。把 API 错误、浏览器状态与代理信息整理成 agent 可读的证据，让它自己定位、自己验证。<br/><sub>MIT · [npm](https://www.npmjs.com/package/vite-plugin-agent-eyes) · <img src="https://img.shields.io/github/stars/webkubor/vite-plugin-agent-eyes?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[🔐 Kyvault](https://github.com/webkubor/kyvault)** — 为 AI 工作流设计的本地密钥库：加密保存在本机，工具通过别名取用，agent 不接触密钥明文。<br/><sub>Rust · MIT · [crates.io](https://crates.io/crates/kyvault) · <img src="https://img.shields.io/github/stars/webkubor/kyvault?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[🖥️ DSH Env Inspector](https://github.com/webkubor/dsh-env-inspector)** — 检查开发环境、CLI、插件与端口状态；在不暴露密钥明文的前提下，让环境问题可见、可处理。<br/><sub>[npm](https://www.npmjs.com/package/@dsh-plugins/dsh-env-inspector) · <img src="https://img.shields.io/github/stars/webkubor/dsh-env-inspector?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[🔄 Vite Refresh Guard](https://github.com/webkubor/vite-plugin-refresh-guard)** — 解决网页部署更新后用户仍停留在旧版本的问题。静默刷新、提示后刷新或阻断等待，一行配置选择策略，核心逻辑兼容 Vue 与 React。<br/><sub>MIT · [npm](https://www.npmjs.com/package/vite-plugin-refresh-guard) · <img src="https://img.shields.io/github/stars/webkubor/vite-plugin-refresh-guard?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

### Bloom：把视觉判断做成可检验的设计系统

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/bloom-dark.svg" />
    <img src="./assets/bloom-light.svg" width="100%" alt="Bloom 六个莫兰迪原色直接当文字时对比度只有 2.3 到 3.3:1；保持色相与彩度，只解亮度到 4.5:1。" />
  </picture>
</p>

- **[Bloom for Typora](https://github.com/webkubor/typora-Bloom-theme)** — 24 套主题，为长文写作和沉浸阅读设计；获 [Typora 官方主题库收录](https://theme.typora.io/theme/Bloom/)。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/typora-Bloom-theme?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[Bloom for DSH](https://github.com/webkubor/dsh-bloom-theme)** — 把同一套莫兰迪视觉语言带进 DeepSeek Harness，提供明暗主题与 OKLCH 配色。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/dsh-bloom-theme?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[contrast-guard](https://github.com/webkubor/contrast-guard)** — 在 CI 检查色彩对比度，支持 OKLCH；失败时给出可执行的调色方向。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/contrast-guard?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

**不是只把颜色做得好看**：每套配色都有两条轨，莫兰迪原色只铺大面积气氛，文字和按钮用解过亮度的版本；用 WCAG 对比度约束校准，让设计选择能被自动检查。*Taste, made testable.*

## 其他在做的事

- **[Scorecard](https://scorecard.webkubor.online)** — 对 GitHub 仓库、npm 包和网站做公开质量检查，生成证据、雷达图与整改建议。免登录体验：[scorecard.webkubor.online](https://scorecard.webkubor.online)，[源码](https://github.com/webkubor/scorecard)。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/scorecard?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[VoxFlow](https://github.com/webkubor/voxflow)** — Apple Silicon 本地 AI 音频工作台，覆盖中文语音、音色设计、播客与 BGM；私密音频留在本机。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/voxflow?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[dsh-llm-hub](https://github.com/webkubor/dsh-llm-hub)** — 为 DSH 补上模型网关探测、目录发现与余额信息。<br/><sub>[npm](https://www.npmjs.com/package/@dsh-plugins/dsh-llm-hub) · <img src="https://img.shields.io/github/stars/webkubor/dsh-llm-hub?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[dsh-mirror](https://github.com/webkubor/dsh-mirror)** — 让 AI 跨会话记住人的判断依据，而不是堆积聊天记录。<br/><sub>[npm](https://www.npmjs.com/package/@dsh-plugins/dsh-user-mirror) · <img src="https://img.shields.io/github/stars/webkubor/dsh-mirror?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[reel-kit](https://github.com/webkubor/reel-kit)** — 用素材、逐句文案、配音和模板在本地合成竖版短视频。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/reel-kit?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

## Skills：给 Agent 装上的表达规范

写文档、提单、发帖之前先想「这话怎么说才对」的规范集合，一行命令接入 Claude Code / Codex / DSH / Antigravity：

- **[writing-standard-skills](https://github.com/webkubor/writing-standard-skills)** — 6 个表达 skill + 5D 原子矩阵：搭骨架 → 定读者 → 调语气 → 当读者通读自检。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/writing-standard-skills?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[deadcode-reaper-skill](https://github.com/webkubor/deadcode-reaper-skill)** — 让死代码与废弃 skill 真正入土为安，晒出减法战绩。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/deadcode-reaper-skill?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

- **[charmoji-sticker-skill](https://github.com/webkubor/charmoji-sticker-skill)** — 一张 IP 正面照 → 整套可提交的微信表情素材，全流程脚本化。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/charmoji-sticker-skill?style=flat-square&label=%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>

<details>
<summary>更多工具</summary>

- [ai-sse-kit](https://github.com/webkubor/ai-sse-kit) — 框架无关的 AI 流式对话工具包，带 React / Vue 绑定。
- [facet](https://github.com/webkubor/facet) — 一份 Markdown 生成演讲页、PDF 与长图。
- [ai-orb](https://github.com/webkubor/ai-orb) — 4KB 零依赖 SVG，表达 AI 助手当前状态。
- [mlx-vlm-kit](https://github.com/webkubor/mlx-vlm-kit) — Apple Silicon 本地离线图片理解。

</details>

<p align="center">
  <sub>每个项目都从真实工作流里的问题出发：能用、能验证，也尽量让别人接得上。<br/>
  Built in public · Open source · Practical tools for people and agents</sub>
</p>
