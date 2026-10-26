<!-- 本文件由 scripts/build-readme.mjs 生成，请勿手改。
     改内容请改 data/projects.json，然后跑 node scripts/build-readme.mjs。
     语言：zh -->

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

<p align="center">
  <img src="https://img.shields.io/badge/35_projects-8b949e?style=flat-square" alt="项目数" height="20" />
  <img src="https://img.shields.io/badge/214_stars-8b949e?style=flat-square" alt="总 star" height="20" />
  <img src="https://img.shields.io/badge/9_commits%20in%2030d-8b949e?style=flat-square" alt="近 30 天提交" height="20" />
  <img src="https://img.shields.io/github/last-commit/webkubor/webkubor?style=flat-square&label=last%20commit&color=8b949e" alt="最近提交" height="20" />
</p>
<p align="center">
  <sub>最近更新：[📋 Scorecard](https://github.com/webkubor/scorecard) <sub>10-26</sub> · [🔐 Kyvault](https://github.com/webkubor/kyvault) <sub>10-26</sub> · [✍️ writing-standard-skills](https://github.com/webkubor/writing-standard-skills) <sub>10-26</sub> · [🧭 dsh-llm-hub](https://github.com/webkubor/dsh-llm-hub) <sub>10-25</sub></sub>
</p>

### Agent 工具

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/agent-dark.svg" />
    <img src="./assets/agent-light.svg" width="100%" alt="一次 401 的修复过程：Agent Eyes 收集脱敏证据，agent 按证据定位到本地 cookie 过期，自修复后用同一请求复验为 200。" />
  </picture>
</p>

从「让 AI 写代码」到「让它看得见、守得住」。

- **[👀 Agent Eyes](https://github.com/webkubor/vite-plugin-agent-eyes)** — 给 coding agent 的 Vite 运行时遥测层。把 API 错误、浏览器状态与代理信息整理成 agent 可读的证据，让它自己定位、自己验证。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/vite-plugin-agent-eyes?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /> · MIT · [npm](https://www.npmjs.com/package/vite-plugin-agent-eyes)</sub>
- **[🔐 Kyvault](https://github.com/webkubor/kyvault)** — 为 AI 工作流设计的本地密钥库：加密保存在本机，工具通过别名取用，agent 不接触密钥明文。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/kyvault?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /> · Rust · MIT · [crates.io](https://crates.io/crates/kyvault)</sub>
- **[🖥️ DSH Env Inspector](https://github.com/webkubor/dsh-env-inspector)** — 检查开发环境、CLI、插件与端口状态；在不暴露密钥明文的前提下，让环境问题可见、可处理。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/dsh-env-inspector?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /> · [npm](https://www.npmjs.com/package/@dsh-plugins/dsh-env-inspector)</sub>
- **[🔄 Vite Refresh Guard](https://github.com/webkubor/vite-plugin-refresh-guard)** — 解决网页部署更新后用户仍停留在旧版本的问题。静默刷新、提示后刷新或阻断等待，一行配置选择策略，核心逻辑兼容 Vue 与 React。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/vite-plugin-refresh-guard?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /> · MIT · [npm](https://www.npmjs.com/package/vite-plugin-refresh-guard)</sub>

### Bloom：把视觉判断做成可检验的设计系统

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/bloom-dark.svg" />
    <img src="./assets/bloom-light.svg" width="100%" alt="Bloom 六个莫兰迪原色直接当文字时对比度只有 2.3 到 3.3:1；保持色相与彩度，只解亮度到 4.5:1。" />
  </picture>
</p>

不是只把颜色做得好看——每套配色都有两条轨，让设计选择能被自动检查。

- **[🌸 Bloom for Typora](https://github.com/webkubor/typora-Bloom-theme)** — 24 套主题，为长文写作和沉浸阅读设计；获 Typora 官方主题库收录。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/typora-Bloom-theme?style=flat&label=%20%E2%98%85&color=6e7681" alt="stars" height="14" /> · [Typora 官方收录](https://theme.typora.io/theme/Bloom/)</sub>
- **[🎛️ Bloom for DSH](https://github.com/webkubor/dsh-bloom-theme)** — 把同一套莫兰迪视觉语言带进 DeepSeek Harness，提供明暗主题与 OKLCH 配色。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/dsh-bloom-theme?style=flat&label=%20%E2%98%85&color=6e7681" alt="stars" height="14" /></sub>
- **[🛡️ contrast-guard](https://github.com/webkubor/contrast-guard)** — 在 CI 检查色彩对比度，支持 OKLCH；失败时给出可执行的调色方向。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/contrast-guard?style=flat&label=%20%E2%98%85&color=c9d1d9" alt="stars" height="14" /></sub>

### Skills：给 Agent 装上的表达规范

写文档、提单、发帖之前先想「这话怎么说才对」的规范集合，一行命令接入 Claude Code / Codex / DSH / Antigravity。

- **[✍️ writing-standard-skills](https://github.com/webkubor/writing-standard-skills)** — 6 个表达 skill + 5D 原子矩阵：搭骨架 → 定读者 → 调语气 → 当读者通读自检。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/writing-standard-skills?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /></sub>
- **[🪦 deadcode-reaper-skill](https://github.com/webkubor/deadcode-reaper-skill)** — 让死代码与废弃 skill 真正入土为安，晒出减法战绩。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/deadcode-reaper-skill?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /></sub>
- **[🩹 charmoji-sticker-skill](https://github.com/webkubor/charmoji-sticker-skill)** — 一张 IP 正面照 → 整套可提交的微信表情素材，全流程脚本化。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/charmoji-sticker-skill?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /></sub>

<details>
<summary>还在做</summary>

- **[📋 Scorecard](https://github.com/webkubor/scorecard)** — 对 GitHub 仓库、npm 包和网站做公开质量检查，生成证据、雷达图与整改建议。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/scorecard?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /> · [在线体验](https://scorecard.webkubor.online) · [源码](https://github.com/webkubor/scorecard)</sub>
- **[🎙️ VoxFlow](https://github.com/webkubor/voxflow)** — Apple Silicon 本地 AI 音频工作台，覆盖中文语音、音色设计、播客与 BGM；私密音频留在本机。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/voxflow?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /></sub>
- **[🧭 dsh-llm-hub](https://github.com/webkubor/dsh-llm-hub)** — 为 DSH 补上模型网关探测、目录发现与余额信息。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/dsh-llm-hub?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /> · [npm](https://www.npmjs.com/package/@dsh-plugins/dsh-llm-hub)</sub>
- **[🎞️ reel-kit](https://github.com/webkubor/reel-kit)** — 用素材、逐句文案、配音和模板在本地合成竖版短视频。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/reel-kit?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /></sub>
- **[💬 chat-mood-gen](https://github.com/webkubor/chat-mood-gen)** — 仿微信与小红书的聊天氛围图生成器：对话 / 拉人 / 列表 / 朋友圈 / 小红书五模式。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/chat-mood-gen?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /></sub>
- **[🎨 museav-cli](https://github.com/webkubor/museav-cli)** — MUSE AV 图像与视频生成 CLI：支持模板、素材上传及本地图像处理，供人和 Agent 从终端调用。<br/><sub><img src="https://img.shields.io/github/stars/webkubor/museav-cli?style=flat&label=%20%E2%98%85&color=8b949e" alt="stars" height="14" /></sub>

</details>

<details>
<summary>最近在做什么（按推送时间）</summary>

- **[📋 Scorecard](https://github.com/webkubor/scorecard)** <sub>2026-10-26 · 1 ★</sub><br/>对 GitHub 仓库、npm 包和网站做公开质量检查，生成证据、雷达图与整改建议。
- **[🔐 Kyvault](https://github.com/webkubor/kyvault)** <sub>2026-10-26 · 4 ★</sub><br/>为 AI 工作流设计的本地密钥库：加密保存在本机，工具通过别名取用，agent 不接触密钥明文。
- **[✍️ writing-standard-skills](https://github.com/webkubor/writing-standard-skills)** <sub>2026-10-26 · 6 ★</sub><br/>6 个表达 skill + 5D 原子矩阵：搭骨架 → 定读者 → 调语气 → 当读者通读自检。
- **[🧭 dsh-llm-hub](https://github.com/webkubor/dsh-llm-hub)** <sub>2026-10-25 · 2 ★</sub><br/>为 DSH 补上模型网关探测、目录发现与余额信息。
- **[🖥️ DSH Env Inspector](https://github.com/webkubor/dsh-env-inspector)** <sub>2026-10-25 · 3 ★</sub><br/>检查开发环境、CLI、插件与端口状态；在不暴露密钥明文的前提下，让环境问题可见、可处理。

</details>

<details>
<summary>更多工具</summary>

- **[ai-sse-kit](https://github.com/webkubor/ai-sse-kit)** — 框架无关的 AI 流式对话工具包，带 React / Vue 绑定。
- **[facet](https://github.com/webkubor/facet)** — 一份 Markdown 生成演讲页、PDF 与长图。
- **[ai-orb](https://github.com/webkubor/ai-orb)** — 4KB 零依赖 SVG，表达 AI 助手当前状态。
- **[mlx-vlm-kit](https://github.com/webkubor/mlx-vlm-kit)** — Apple Silicon 本地离线图片理解。
- **[im-notify-kit](https://github.com/webkubor/im-notify-kit)** — 飞书 / 企业微信通知库，带重试与去重。
- **[path-guard](https://github.com/webkubor/path-guard)** — PATH 命令诊断 CLI：定位实际执行的副本与版本漂移。
- **[supercli](https://github.com/webkubor/supercli)** — CLI 工具目录与发现站，按用途与 Stars 快照排名。
- **[meridian](https://github.com/webkubor/meridian)** — 一个安静的 macOS Git 客户端。Tauri 2 + Vue 3 + git2。
- **[wallpaper-generator](https://github.com/webkubor/wallpaper-generator)** — 浏览器壁纸编辑器：多设备预设、水印与导出 PNG。
- **[xiaobai-kanban](https://github.com/webkubor/xiaobai-kanban)** — 中文 AI 编程助手入门教程，含 AGENTS.md 协作指南。
- **[cs-mcp](https://github.com/webkubor/cs-mcp)** — 把个人开源工具链接进 AI Agent 的 MCP 服务，按能力分组。
- **[lite-browser](https://github.com/webkubor/lite-browser)** — AI Agent 浏览器自动化 CLI：CDP 操控、会话复用与人工接管。
- **[device-passport](https://github.com/webkubor/device-passport)** — 确定性的浏览器 / 设备画像，用于自动化与测试。
- **[picx-images-hosting](https://github.com/webkubor/picx-images-hosting)** — 图床素材仓库：个人项目的图片经 GitHub raw 与 jsDelivr 分发。
- **[dsh-museav-assets](https://github.com/webkubor/dsh-museav-assets)** — DSH 素材浏览插件：按工作区查看出图记录与素材直链。
- **[release-sync-skill](https://github.com/webkubor/release-sync-skill)** — 发版时自动把版本号同步到台账与 SKILL.md。
- **[suno-publisher](https://github.com/webkubor/suno-publisher)** — 音乐发行管理工作台：上架台账与填表辅助。
- **[claude-usage-statusline](https://github.com/webkubor/claude-usage-statusline)** — Claude Code 状态栏：会话花费与额度预警。

</details>

<p align="center">
  <sub>每个项目都从真实工作流里的问题出发：能用、能验证，也尽量让别人接得上。<br/>Built in public · Open source · Practical tools for people and agents</sub>
</p>
