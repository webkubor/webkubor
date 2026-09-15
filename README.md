<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/webkubor/picx-images-hosting@master/projects/webkubor/profile-banner.png" width="100%" alt="webkubor — 把审美做成可验证的工程" />
</p>

<p align="center">
  <strong>把审美做成可验证的工程，把一次性经验做成可复用的 Agent 工具。</strong><br/>
  <sub>Design-minded engineer — turning taste into systems you can test.</sub>
</p>

- **[🌸 Bloom for Typora](https://github.com/webkubor/typora-Bloom-theme)** <img src="https://img.shields.io/github/stars/webkubor/typora-Bloom-theme?style=flat-square&label=&color=A873C4" align="center" /> — 24 套主题矩阵，12 浅 × 12 深。每组配色按 WCAG AA 反推校准，CI 里有回归测试，改坏直接红
- **[🔐 Kyvault](https://github.com/webkubor/kyvault)** <img src="https://img.shields.io/github/stars/webkubor/kyvault?style=flat-square&label=&color=5fa8b2" align="center" /> — 存一次密钥，AI 永远看不到明文。AES-256-GCM 纯本地加密，Agent 只拿到别名注入
- **[🎙 VoxFlow 声流](https://github.com/webkubor/voxflow)** <img src="https://img.shields.io/github/stars/webkubor/voxflow?style=flat-square&label=&color=6a9955" align="center" /> — AI 声音到 AI 音乐，一套工作流做到自动上架。本地优先，跑在你自己的电脑上

做能用的 AI 工具，不做一次性 demo。

- **Agent 基建** — 密钥安全、运行时可观测、技能包，让 Agent 更安全、更看得见、更能干
- **创作流水线** — 声音、短视频、出图、文档，本地优先，跑在你自己的电脑上
- **公开构建** — 每个工具都来自真实生产踩坑，用证据说话

<sub>AI tools that fit into real workflows, not one-off demos. Agent infrastructure · creative pipelines · build in public.</sub>

---

<details>
<summary><b>🌸 Bloom — 审美工程系列</b> &nbsp;·&nbsp; <sub>3 个项目 · 145★ · 同一套莫兰迪设计语言，两个宿主加一把护栏</sub></summary>

<br/>

同一套莫兰迪设计语言，两个宿主，外加一把护栏。不是「换个颜色」，是一整套可验证的色彩系统。

*One Morandi design language, two hosts — plus the guardrail that keeps it honest. Not a recolor, a color system you can test.*

<table>
  <tr>
    <td width="33%" align="center">
      <a href="https://github.com/webkubor/typora-Bloom-theme">
        <img src="https://cdn.jsdelivr.net/gh/webkubor/typora-Bloom-theme@main/website/assets/screenshots/petal.png" alt="Bloom for Typora" />
      </a>
      <p><a href="https://github.com/webkubor/typora-Bloom-theme"><b>Bloom for Typora</b></a> <img src="https://img.shields.io/github/stars/webkubor/typora-Bloom-theme?style=flat-square&label=&color=A873C4" alt="stars" /></p>
      <p><sub>24 套主题矩阵（12 浅 × 12 深），为长文写作与沉浸阅读打磨<br/>24 themes for long-form writing</sub></p>
    </td>
    <td width="33%" align="center">
      <a href="https://github.com/webkubor/dsh-bloom-theme">
        <img src="https://cdn.jsdelivr.net/gh/webkubor/picx-images-hosting@master/projects/dsh-bloom-theme/ui-mist-dark-43.png" alt="Bloom for DSH" />
      </a>
      <p><a href="https://github.com/webkubor/dsh-bloom-theme"><b>Bloom for DSH</b></a> <img src="https://img.shields.io/github/stars/webkubor/dsh-bloom-theme?style=flat-square&label=&color=5fa8b2" alt="stars" /></p>
      <p><sub>移植到 DeepSeek Harness，9 套莫兰迪变体，OKLCH 调色，顶栏一键切换<br/>Ported to DeepSeek Harness: 9 Morandi palettes, light &amp; dark</sub></p>
    </td>
    <td width="33%" align="center">
      <a href="https://github.com/webkubor/contrast-guard">
        <img src="https://img.shields.io/badge/OKLCH-WCAG%20AA%20verified-6a9955?style=for-the-badge" alt="contrast-guard" />
      </a>
      <p><a href="https://github.com/webkubor/contrast-guard"><b>contrast-guard</b></a> <img src="https://img.shields.io/github/stars/webkubor/contrast-guard?style=flat-square&label=&color=6a9955" alt="stars" /></p>
      <p><sub>配色护栏：对比度不达标时直接反推该改成多少，改坏直接红<br/>Contrast as a CI guardrail — it tells you the exact fix when you fail</sub></p>
    </td>
  </tr>
</table>

> **设计上的一个发现：** 每套配色其实有两轨色。`--accent` 是为过对比度刻意加深的版本，
> 用于文字与按钮；真正的莫兰迪色在 `--accent-rgb`，只用于大面积氛围渐变。
> 移植时只搬前者，藕粉会变成荧光洋红 —— 色相是对的，气质没了。
>
> 8 组「主色 + 底色」全部按 WCAG AA 反推校准，CI 里有回归测试，改坏直接红。
> <sub>Taste, made testable.</sub>

<div align="center">

**装上就能用 / Get it running**

</div>

```bash
# Typora：下载主题包，丢进 Typora 主题文件夹
# https://github.com/webkubor/typora-Bloom-theme/releases/latest

# DSH：两条命令
dsh plugin add @kubor/dsh-bloom-theme
dsh plugin enable @kubor/dsh-bloom-theme

# 对比度护栏：进任何前端项目
npm i -D contrast-guard
npx contrast-guard --init
```

</details>

<details>
<summary><b>🧰 Agent 工具箱</b> &nbsp;·&nbsp; <sub>7 个项目 · 遥测 / 密钥 / MCP / 技能包</sub></summary>

<br/>

### 👀 Agent Eyes — 核心主线

Runtime observability for coding agents — see API errors, cookie state, and proxy headers before they ship.

让写代码的 Agent 看见运行时 —— API 报错、Cookie 状态、代理头，再动手改。

<div align="center">
  <table>
    <tr>
      <td width="90%" align="center">
        <h3><a href="https://github.com/webkubor/vite-plugin-agent-eyes">👀 Agent Eyes — Vite 自愈遥测</a></h3>
        <p>给 coding agent 一双"看运行时"的眼睛：API/错误/交互/代理 header 结构化遥测 + 登录态画像 + 提交前风险门禁。</p>
        <p><sub>Runtime telemetry, interaction traces, auth profile hints, and a pre-commit guard for Vite dev.</sub></p>
        <p><code>Agent Eyes</code> <code>Vite</code> <code>TypeScript</code> <code>Observability</code> <code>MIT</code></p>
      </td>
    </tr>
  </table>
</div>

**配套基建 / Infrastructure:**

<table>
  <tr>
    <td width="33%" valign="top">
      <h3><a href="https://github.com/webkubor/kyvault">🔐 Kyvault — 密钥台账</a></h3>
      <p>Store secrets once, agents never see plaintext. AES-256-GCM, pure local vault, alias-only injection.</p>
      <p><sub>存一次密钥，AI 永远看不到明文。AES-256-GCM 纯本地加密，Agent 只拿到别名注入。</sub></p>
      <p><code>Rust</code> <code>Security</code> <code>AES-256-GCM</code></p>
    </td>
    <td width="33%" valign="top">
      <h3><a href="https://github.com/webkubor/ai-orb">🟠 ai-orb — 状态球</a></h3>
      <p>A 4KB zero-dependency SVG orb that shows what your AI assistant is doing.</p>
      <p><sub>一颗会表态的 AI 助手状态球：在想 / 在干活 / 等你回话 / 好了。零依赖 4KB，npm 一装就用。</sub></p>
      <p><code>SVG</code> <code>4KB</code> <code>零依赖</code></p>
    </td>
    <td width="33%" valign="top">
      <h3><a href="https://github.com/webkubor/museav-mcp">🔌 museav-mcp — 创作中台入口</a></h3>
      <p>One MCP service that hands museav-cli and satellite tools (music, reel, facet) to any agent.</p>
      <p><sub>把 museav-cli 和卫星工具（音乐 / reel / facet）打包成一个 MCP 服务，Agent 直连创作能力。</sub></p>
      <p><code>MCP</code> <code>Agent</code> <code>创作中台</code></p>
    </td>
  </tr>
</table>

**技能包 / Skills:**

<table>
  <tr>
    <td width="33%" valign="top">
      <h3><a href="https://github.com/webkubor/talk-skills">🗣 talk-skills — 把话说对</a></h3>
      <p>A four-step expression spec shared by AI agents and humans.</p>
      <p><sub>搭骨架（金字塔/SCQA/MECE）→ 定读者 → 调语气 → 当读者读一遍。给 Agent 和人共用的表达规范。</sub></p>
      <p><code>Skill</code> <code>表达</code> <code>规范</code></p>
    </td>
    <td width="33%" valign="top">
      <h3><a href="https://github.com/webkubor/guofeng-portrait-skill">🎨 国风人像 Skill — 提示词库</a></h3>
      <p>Guofeng portrait prompt library: 3 rendering styles × 3 dynasties, freely combinable.</p>
      <p><sub>画法（3D 写实 / 水墨 / 氛围胶片）× 朝代（唐 / 宋 / 魏晋）自由组合，生成角色立绘、头像、人物海报。</sub></p>
      <p><code>Skill</code> <code>提示词</code> <code>出图</code></p>
    </td>
    <td width="33%" valign="top">
      <h3><a href="https://github.com/webkubor/wechat-sticker-submit">🐶 微信表情包流水线</a></h3>
      <p>One IP portrait → a full submittable WeChat sticker pack, fully scripted.</p>
      <p><sub>一张 IP 正面照 → 整套可提交的微信表情素材：出图、切图、机检、文案校验、提交清单全脚本化。</sub></p>
      <p><code>Claude Code</code> <code>Skill</code> <code>表情包</code></p>
    </td>
  </tr>
</table>

</details>

<details>
<summary><b>🎨 创作工作流</b> &nbsp;·&nbsp; <sub>6 个项目 · 声音、视频、出图、人像、文档，本地优先</sub></summary>

<br/>

Local-first creative tools that run on your machine, not someone else's cloud.

本地优先的创作流水线 —— 跑在你自己的电脑上，不依赖别人的云。

<div align="center">
  <a href="https://github.com/webkubor/guofeng-portrait-skill">
    <img src="https://img.webkubor.online/refs/45d47835-cde2-4022-bd4d-5bc729ff8f1f/d851afe2-b72.jpg" alt="古风氛围胶片人像 · 风格总览九宫格" width="68%" />
  </a>
  <br/>
  <sub><b>古风氛围胶片人像</b> · <a href="https://github.com/webkubor/guofeng-portrait-skill">guofeng-portrait-skill</a> —— 画法 × 朝代自由组合的古风人像提示词库</sub><br/>
  <sub>花影柔光 · 雪落庭院 · 竹影清茶 · 灯下夜读 · 绿意回眸 · 湖畔逆光 · 江湖冷调 · 落英慵卧 · 提灯夜行</sub><br/>
  <sub><i>同一套提示词体系下的九种气质 —— 低饱和青绿、侧逆光斑驳树影、胶片颗粒、真人抓拍感</i></sub>
</div>

<table>
  <tr>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/webkubor/voxflow">🎙 VoxFlow 声流 — 声音到上架</a></h3>
      <p>From AI voice to AI music — one pipeline all the way to publishing.</p>
      <p><sub>AI 声音到 AI 音乐，一套工作流做到自动上架。</sub></p>
      <p><code>Python</code> <code>AI Audio</code> <code>Workflow</code></p>
    </td>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/webkubor/reel-kit">🎬 reel-kit — 竖版短视频工作台</a></h3>
      <p>Vertical short-video workbench: materials, line-by-line copy, TTS/BGM, HTML templates — UI + CLI.</p>
      <p><sub>素材 + 逐句文案 + 配音/BGM，套 HTML 模板出片。Studio 工作台 + 20 套手绘风格模板，本地 TTS 零成本。</sub></p>
      <p><code>UI + CLI</code> <code>TTS</code> <code>模板</code></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/webkubor/museav-cli">🖌 museav-cli — 出图中台</a></h3>
      <p>Image generation, reading, template conversion, asset upload — one apiKey away.</p>
      <p><sub>出图、读图、图片转模板、素材上传。一个 apiKey 就有出图能力。</sub></p>
      <p><code>CLI</code> <code>出图</code> <code>中台</code></p>
    </td>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/webkubor/facet">📄 facet — 一份 Markdown，多种形态</a></h3>
      <p>One Markdown source, multiple facets: talk slides for presenting, PDF and long images for sharing.</p>
      <p><sub>同一份 Markdown，讲稿 slides、分享 PDF、长图一次生成。</sub></p>
      <p><code>TypeScript</code> <code>Markdown</code> <code>PDF</code></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/webkubor/cn-chat-style-gen">💬 微信氛围图生成器</a></h3>
      <p>High-fidelity WeChat-style chat images: chat / Moments / list / group-invite, corpus + batch export.</p>
      <p><sub>对话 / 朋友圈 / 列表 / 拉人四模式，语料库与批量导出。在线体验：<a href="https://wechat.webkubor.online">wechat.webkubor.online</a></sub></p>
      <p><code>前端</code> <code>截图</code> <code>语料库</code></p>
    </td>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/webkubor/wallpaper-generator">🖼 氛围壁纸工坊</a></h3>
      <p>Ambient Wallpaper Studio — browser-local, privacy-first, multi-device wallpapers.</p>
      <p><sub>纯前端在线壁纸制作，适配 iPhone / iPad / Mac / 车载等多设备，浏览器本地处理、隐私优先。</sub></p>
      <p><code>前端</code> <code>壁纸</code> <code>隐私</code></p>
    </td>
  </tr>
</table>

</details>

<details>
<summary><b>🔧 开发者工具</b> &nbsp;·&nbsp; <sub>9 个项目 · 质检 / SSE / 图床 / 状态栏 / 通知</sub></summary>

<br/>

| Project / 项目 | What it does / 做什么 |
|---------|-------------|
| [scorecard](https://github.com/webkubor/scorecard) | 开源项目九维度质检 — 粘一个 GitHub URL，拿雷达图 + 整改清单 + 可喂给 AI 的 Markdown 报告。免登录 → [scorecard.webkubor.online](https://scorecard.webkubor.online) |
| [ai-sse-kit](https://github.com/webkubor/ai-sse-kit) | 渐进式 AI 流式对话工具包：SSE 传输、协议适配、消息不可变 patch，框架无关核心 + React / Vue 双绑定 |
| [vite-plugin-refresh-guard](https://github.com/webkubor/vite-plugin-refresh-guard) | Vite 版本更新检测 + 刷新：静默 / 提示 / 弹窗三种策略，核心框架无关，附 Vue / React 适配层 |
| [path-guard](https://github.com/webkubor/path-guard) | 查出你敲的命令实际跑的是哪一个副本、被谁遮蔽、以及更新到底生效没有 |
| [claude-usage-statusline](https://github.com/webkubor/claude-usage-statusline) | Claude Code 状态栏：花费、上下文占用、5h/7d 限额，单文件 Python 零依赖零配置 |
| [im-notify-kit](https://github.com/webkubor/im-notify-kit) | 飞书 / 企微群机器人通知的发送层：业务码校验、重试、超时、去重，零依赖跨 Node / Workers / Deno |
| [picx-images-hosting](https://github.com/webkubor/picx-images-hosting) | GitHub + Cloudflare R2 统一图床 |
| [mlx-vlm-kit](https://github.com/webkubor/mlx-vlm-kit) | Mac 本地看图理解引擎 — Qwen3-VL（MLX），免费、离线、任何项目可调 |
| [dsh-llm-hub](https://github.com/webkubor/dsh-llm-hub) | DSH 插件：模型发现 + DeepSeek 余额与可用性，补齐官方 LLM 适配器留白，零依赖 |

</details>

---

<p align="center">
  <a href="https://webkubor.online"><img src="https://img.shields.io/badge/Website-webkubor.online-EAB308?style=flat-square" alt="Website" /></a>
  <a href="https://x.com/doctorDacker"><img src="https://img.shields.io/badge/X-@doctorDacker-111827?style=flat-square&logo=x" alt="X / Twitter" /></a>
  <a href="https://weibo.com/u/5452906452"><img src="https://img.shields.io/badge/微博-@webkubor-E6162D?style=flat-square&logo=sinaweibo" alt="微博" /></a>
  <a href="https://juejin.cn/user/2119514149631870"><img src="https://img.shields.io/badge/掘金-@webkubor-1E80FF?style=flat-square&logo=juejin" alt="掘金" /></a>
  <a href="https://music.163.com/#/user/home?id=116974627"><img src="https://img.shields.io/badge/网易云-月栖洲-E60026?style=flat-square&logo=neteasecloudmusic" alt="网易云" /></a>
  <a href="https://www.xiaohongshu.com/user/profile/webkubor"><img src="https://img.shields.io/badge/小红书-@webkubor-FF2442?style=flat-square" alt="小红书" /></a>
  <a href="mailto:hi@webkubor.online"><img src="https://img.shields.io/badge/Email-hi%40webkubor.online-111827?style=flat-square" alt="Email" /></a>
</p>

> 公众号「[苏梦城](https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzAwNTU1NjE4Mg==)」/ 视频号「山鬼映画」— 微信内搜索关注。

---

<p align="center">
  <sub>Turn one-off experience into reusable, auditable agent tools. Build in public.</sub><br/>
  <sub>把一次性经验变成可复用、可审计的 Agent 工具。公开构建。</sub>
</p>
