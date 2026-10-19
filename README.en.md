# webkubor

> **Design-minded engineer — turning taste into systems you can test.**
> 把审美做成可验证的工程，把一次性经验做成可复用的 Agent 工具。

[中文](./README.md) · [Website](https://webkubor.online) · [Email](mailto:hi@webkubor.online)

---

## What I build

### 🌸 Bloom — Aesthetic engineering series

One Morandi design language, two hosts, plus the guardrail that keeps it honest. Not a recolor — a color system you can test.

- **[Bloom for Typora](https://github.com/webkubor/typora-Bloom-theme)** — 24-theme matrix (12 light × 12 dark) for long-form writing. Each palette calibrated to WCAG AA by reverse-solving lightness, with regression tests in CI — change a color, fail the build.
- **[Bloom for DSH](https://github.com/webkubor/dsh-bloom-theme)** — Ported to DeepSeek Harness. 10 Morandi palettes (light & dark), OKLCH-tuned, one-click switch in the top bar.
- **[contrast-guard](https://github.com/webkubor/contrast-guard)** — Contrast as a CI guardrail. When a pair fails, it tells you the *exact fix* — keep hue and chroma, solve the lightness that crosses the threshold.

> **A discovery that shaped everything:** every palette actually has two rails. `--accent` is the deliberately darkened version tuned for contrast (used by text and buttons); the true Morandi color lives in `--accent-rgb`, used only for large-area atmospheric gradients. When porting, if you only ship the first one, lotus-pink turns into fluorescent magenta — the hue is right, the *temperament* is gone.
>
> *Taste, made testable.*

---

### 🔐 Kyvault — Secrets without plaintext

- **[kyvault](https://github.com/webkubor/kyvault)** — Store once, AI never sees plaintext. AES-256-GCM, fully local, agents only get alias injection.

---

### 🎙 VoxFlow — Voice to music pipeline

- **[voxflow](https://github.com/webkubor/voxflow)** — From AI voice to AI music, one workflow that ships to Suno. Local-first, runs on your own machine.

---

## Three lines of work

- **Agent infrastructure** — Secrets, runtime observability, skill packages. Agents that are safer, more visible, more capable.
- **Creative pipelines** — Voice, short video, image generation, docs. Local-first, runs on your own machine.
- **Build in public** — Every tool comes from a real production pothole. Evidence, not slogans.

AI tools that fit into real workflows, not one-off demos.

---

## Featured repos (recent)

| | | |
|---|---|---|
| [🌸 Bloom for Typora](https://github.com/webkubor/typora-Bloom-theme) | 24-theme matrix, WCAG AA, CI regression | `★` |
| [🌊 Bloom for DSH](https://github.com/webkubor/dsh-bloom-theme) | Morandi for DeepSeek Harness, OKLCH | `★` |
| [🛡️ contrast-guard](https://github.com/webkubor/contrast-guard) | Contrast CI with the fix attached | `★` |
| [🔐 kyvault](https://github.com/webkubor/kyvault) | Local AES-256-GCM secrets, agent alias injection | `★` |
| [🎙 voxflow](https://github.com/webkubor/voxflow) | TTS + Suno pipeline, Apple MLX 8-bit | `★` |
| [🤖 dsh-mirror](https://github.com/webkubor/dsh-mirror) | Make the AI remember *how* you think, not *what* you said | `★` |
| [🤖 dsh-llm-hub](https://github.com/webkubor/dsh-llm-hub) | Add model catalog, gateway health, balance cards to DSH | `★` |
| [📊 scorecard](https://github.com/webkubor/scorecard) | 9-dimension quality check, GitHub URL → radar | `★` |
| [💬 talk-skills](https://github.com/webkubor/talk-skills) | 6 expression skills + 5D atomic matrix, one-line install | `★` |
| [🪦 tombstone-reaper-skill](https://github.com/webkubor/tombstone-reaper-skill) | Retire dead code and stale skills, publish the subtractive wins | `★` |
| [😌 charmoji](https://github.com/webkubor/charmoji) | One character portrait → a submittable WeChat sticker set | `★` |

(See [README.md](./README.md) for the full bilingual list with badges and grouped sections.)

---

## Channels

- [Website](https://webkubor.online)
- [X / Twitter](https://x.com/webkuborDev)
- Email: hi@webkubor.online

---

> Turn one-off experience into reusable, auditable agent tools. Build in public.