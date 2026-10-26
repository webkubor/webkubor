#!/usr/bin/env node
/**
 * 主页 README 生成器：把 data/projects.json + data/recent.json 渲染成 README.md / README.en.md。
 *
 * 职责：
 *   1. 目录与卡片文案只维护一份（data/projects.json），中英双语由同一份数据派生；
 *   2. star 数、项目数、最近更新时间从 data/recent.json 取，不写死；
 *   3. 长度可控：首屏只留「代表作 + Skills」，其余清单全部收进 <details> 折叠；
 *   4. 最近动态在首屏以一行可见，其余进折叠块；
 *   5. 生成物带标记头，README 手改会被门禁发现并要求重跑生成器。
 *
 * 用法：node scripts/build-readme.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'data', 'projects.json'), 'utf8'));
const recentPath = join(root, 'data', 'recent.json');

let recent = { totals: { publicRepos: 0, stars: 0, commits30d: 0, lastCommit: null }, recent: [], stars: {} };
try {
  recent = JSON.parse(readFileSync(recentPath, 'utf8'));
} catch {
  console.warn('⚠ 未找到 data/recent.json，star 与统计按 0 占位（先跑 node scripts/sync-data.mjs）');
}

const OWNER = 'webkubor';
const repoUrl = (name) => `https://github.com/${OWNER}/${name}`;
const starOf = (name) => recent.stars?.[name] ?? null;

/** star 徽章：有真实 star 才亮，0 star 显示为灰色 0，不假装 */
function starBadge(name, style) {
  const s = starOf(name);
  if (s === null) return '';
  const color = s >= 10 ? '6e7681' : s > 0 ? '8b949e' : 'c9d1d9';
  return `<img src="https://img.shields.io/github/stars/${OWNER}/${name}?style=${style}&label=%20%E2%98%85&color=${color}" alt="stars" height="14" />`;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** 一个项目条目：标题行 + 一句话 + 元信息行 */
function projectLine(name, lang, style) {
  const p = data.projects[name];
  if (!p) throw new Error(`data/projects.json 缺少项目 ${name}`);
  const desc = lang === 'zh' ? p.zh : p.en;
  const badges = (p.badges || [])
    .map((b) => (b.href ? `[${b.label}](${b.href})` : b.label))
    .join(' · ');
  const meta = [starBadge(name, style), badges].filter(Boolean).join(' · ');
  return `- **[${p.emoji} ${esc(p.name)}](${repoUrl(name)})** — ${desc}<br/><sub>${meta}</sub>`;
}

function picture(asset, alt) {
  return `<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/${asset}-dark.svg" />
    <img src="./assets/${asset}-light.svg" width="100%" alt="${esc(alt)}" />
  </picture>
</p>`;
}

/** 折叠块：标题 + 内容 */
function details(summary, body) {
  return `<details>
<summary>${summary}</summary>

${body}

</details>`;
}

/** 主页收录的项目集合（用于过滤最近动态） */
const knownRepos = new Set([
  ...data.groups.flatMap((g) => g.projects),
  ...data.featured.projects,
  ...data.skills.projects,
]);

export function buildReadme(lang) {
  const zh = lang === 'zh';
  const T = (a, b) => (zh ? a : b);

  const totals = recent.totals || {};
  const statRow = `<p align="center">
  <img src="https://img.shields.io/badge/${totals.publicRepos ?? 0}_projects-8b949e?style=flat-square" alt="项目数" height="20" />
  <img src="https://img.shields.io/badge/${totals.stars ?? 0}_stars-8b949e?style=flat-square" alt="总 star" height="20" />
  <img src="https://img.shields.io/badge/${totals.commits30d ?? 0}_commits%20in%2030d-8b949e?style=flat-square" alt="近 30 天提交" height="20" />
  <img src="https://img.shields.io/github/last-commit/${OWNER}/${OWNER}?style=flat-square&label=last%20commit&color=8b949e" alt="最近提交" height="20" />
</p>`;

  // 最近动态：首屏一行（最近 4 个有推送的收录项目），完整列表进折叠块
  const recentKnown = (recent.recent || []).filter((r) => knownRepos.has(r.name));
  const recentStrip = recentKnown.length
    ? `<p align="center">
  <sub>${T('最近更新', 'Recently updated')}：${recentKnown
      .slice(0, 4)
      .map((r) => {
        const p = data.projects[r.name];
        return `[${p?.emoji || ''} ${esc(p?.name || r.name)}](${repoUrl(r.name)}) <sub>${r.pushedAt.slice(5)}</sub>`;
      })
      .join(' · ')}</sub>
</p>`
    : '';

  const heroAlt = T(
    'webkubor：把审美做成可验证的工程。六片莫兰迪花瓣在量环中展开，字标从原色沉成可读的墨色。',
    'webkubor: taste, made testable. Six Morandi petals unfold inside a measuring ring while the wordmark settles from raw color into readable ink.',
  );

  const logowallAlt = T(
    '6 个开源项目的透明底 logo：Bloom、Scorecard、reel-kit、chat-mood-gen、Meridian、壁纸编辑器。',
    'Transparent-background logos of 6 open-source projects: Bloom, Scorecard, reel-kit, chat-mood-gen, Meridian, wallpaper editor.',
  );

  // logo 墙：只收透明底纯图形 logo（带底色方块的不进墙），没有正式 logo 的项目不凑数
  const wallNames = [
    'typora-Bloom-theme', 'scorecard', 'reel-kit',
    'chat-mood-gen', 'meridian', 'wallpaper-generator',
  ];
  const wallStrip = `<p align="center"><sub>${wallNames
    .map((n) => `[${esc(data.projects[n]?.name || n)}](${repoUrl(n)})`)
    .join(' · ')}</sub></p>`;

  const groups = data.groups
    .map((g) => {
      const title = T(g.title, g.titleEn);
      const lede = T(g.lede, g.ledeEn);
      const alt = T(g.assetAlt, g.assetAltEn);
      const lines = g.projects.map((n) => projectLine(n, lang, 'flat')).join('\n');
      return `### ${title}

${picture(g.asset, alt)}

${lede}

${lines}`;
    })
    .join('\n\n');

  const featTitle = T(data.featured.title, data.featured.titleEn);
  const featLines = data.featured.projects.map((n) => projectLine(n, lang, 'flat')).join('\n');

  const skillTitle = T(data.skills.title, data.skills.titleEn);
  const skillLede = T(data.skills.lede, data.skills.ledeEn);
  const skillLines = data.skills.projects.map((n) => projectLine(n, lang, 'flat')).join('\n');

  const extraTitle = T(data.extras.title, data.extras.titleEn);
  const extraLines = data.extras.projects
    .map((e) => `- **[${esc(e.repo)}](${repoUrl(e.repo)})** — ${T(e.zh, e.en)}`)
    .join('\n');

  const recentDetail = recentKnown.length
    ? details(
        T('最近在做什么（按推送时间）', 'Recently shipped (by push time)'),
        recentKnown
          .map((r) => {
            const p = data.projects[r.name];
            const desc = T(p?.zh || '', p?.en || '');
            return `- **[${p?.emoji || ''} ${esc(p?.name || r.name)}](${repoUrl(r.name)})** <sub>${r.pushedAt} · ${r.stars} ★</sub><br/>${desc}`;
          })
          .join('\n'),
      )
    : '';

  const tagline = T(
    '我做两类东西：让 AI 编码过程更安全、可观察；让设计与无障碍标准能被工程验证。',
    'I build two kinds of things: tools that make AI-assisted coding safer and observable, and design systems whose standards can be checked by code.',
  );

  const links = T(
    `<a href="https://webkubor.online">个人站</a> ·\n  <a href="https://github.com/webkubor?tab=repositories">全部项目</a> ·\n  <a href="https://x.com/webkuborDev">X</a> ·\n  <a href="./README.en.md">English</a>`,
    `<a href="https://webkubor.online">Website</a> ·\n  <a href="https://github.com/webkubor?tab=repositories">All repos</a> ·\n  <a href="https://x.com/webkuborDev">X</a> ·\n  <a href="./README.md">中文</a>`,
  );

  const footer = T(
    '每个项目都从真实工作流里的问题出发：能用、能验证，也尽量让别人接得上。<br/>Built in public · Open source · Practical tools for people and agents',
    'Every project starts from a real problem in a real workflow: it works, it can be verified, and others can pick it up.<br/>Built in public · Open source · Practical tools for people and agents',
  );

  return `${picture('hero', heroAlt)}

<p align="center">
  ${tagline}<br/>
  <sub>Design-minded engineer · Agent infrastructure · Testable design systems</sub>
</p>

<p align="center">
  ${links}
</p>

${statRow}
${recentStrip}

${picture('logowall', logowallAlt)}
${wallStrip}

${groups}

### ${skillTitle}

${skillLede}

${skillLines}

${details(featTitle, featLines)}

${recentDetail}

${details(extraTitle, extraLines)}

<p align="center">
  <sub>${footer}</sub>
</p>
`;
}

export const banner = (lang) =>
  `<!-- 本文件由 scripts/build-readme.mjs 生成，请勿手改。\n     改内容请改 data/projects.json，然后跑 node scripts/build-readme.mjs。\n     语言：${lang} -->\n\n`;

// 被 check-readme.mjs import 时只取纯函数，不落盘；直接执行才写文件
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const outputs = [
    { file: 'README.md', content: banner('zh') + buildReadme('zh') },
    { file: 'README.en.md', content: banner('en') + buildReadme('en') },
  ];

  for (const { file, content } of outputs) {
    writeFileSync(join(root, file), content);
    console.log(`${file}  ${content.split('\n').length} 行 / ${(Buffer.byteLength(content) / 1024).toFixed(1)} KB`);
  }
}
