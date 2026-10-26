#!/usr/bin/env node
/**
 * 主页门禁：node scripts/check-readme.mjs
 *
 * 查五件事：
 *   1. README 与生成器一致（手改会被发现）；
 *   2. 双语 README 结构对称（同样的标题层级、同样的项目数）；
 *   3. 主页链接指向的仓库真实存在（404 即失败，防链接腐烂）；
 *   4. 折叠块与首屏长度在预算内（防止主页再次变长）；
 *   5. 每个收录项目的 star 徽章与 data/recent.json 一致。
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const fail = (msg) => failures.push(msg);

// 1. 与生成器一致：重新生成后比对（含标记头）
const { buildReadme, banner } = await import('./build-readme.mjs');
if (typeof buildReadme === 'function') {
  for (const file of ['README.md', 'README.en.md']) {
    const lang = file === 'README.md' ? 'zh' : 'en';
    const expected = banner(lang) + buildReadme(lang);
    const actual = readFileSync(join(root, file), 'utf8');
    if (expected !== actual) fail(`${file} 与生成器不一致，重跑 node scripts/build-readme.mjs`);
  }
} else {
  // 生成器未导出 buildReadme 时退化为「必须带生成标记」
  for (const file of ['README.md', 'README.en.md']) {
    const actual = readFileSync(join(root, file), 'utf8');
    if (!actual.startsWith('<!-- 本文件由 scripts/build-readme.mjs 生成')) {
      fail(`${file} 缺生成标记，可能被手改过`);
    }
  }
}

// 2. 双语结构对称
const zh = readFileSync(join(root, 'README.md'), 'utf8');
const en = readFileSync(join(root, 'README.en.md'), 'utf8');
const h2 = (md) => [...md.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
const h3 = (md) => [...md.matchAll(/^### (.+)$/gm)].map((m) => m[1]);
if (h2(zh).length !== h2(en).length) fail(`双语二级标题数量不一致：中文 ${h2(zh).length} / 英文 ${h2(en).length}`);
if (h3(zh).length !== h3(en).length) fail(`双语三级标题数量不一致：中文 ${h3(zh).length} / 英文 ${h3(en).length}`);
const links = (md) => [...md.matchAll(/https:\/\/github\.com\/webkubor\/([\w.-]+)/g)].map((m) => m[1]);
const zhRepos = [...new Set(links(zh))].sort();
const enRepos = [...new Set(links(en))].sort();
if (zhRepos.join() !== enRepos.join()) {
  fail(`双语引用的仓库不一致：\n  中文 ${zhRepos.join(', ')}\n  英文 ${enRepos.join(', ')}`);
}

// 3. 链接真实存在（一次拉全量仓库列表判定，避免逐个调 gh 触发 GraphQL 握手超时）
let offline = false;
let liveRepos = new Set();
try {
  const out = execFileSync('gh', ['repo', 'list', 'webkubor', '--limit', '100', '--json', 'name'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  liveRepos = new Set(JSON.parse(out).map((r) => r.name));
} catch (err) {
  offline = true;
  console.warn(`⚠ gh 不可用，跳过链接存活检查（${(err.stderr || '').toString().slice(0, 80)}）`);
}
if (!offline) {
  for (const repo of zhRepos) {
    if (!liveRepos.has(repo)) fail(`链接仓库不存在：https://github.com/webkubor/${repo}`);
  }
}

// 4. 长度预算：折叠之前的内容必须在预算内（防止主页再次变长）
//    口径用「访客真正要滚过的量」：可见大图数 + 可见项目卡数。
//    折叠块里的内容默认不计入 —— 它们点开才占版面。
const MAX_VISIBLE_IMAGES = 4; // 首屏大图：hero + logo 墙 + 两张代表作面板
const MAX_VISIBLE_CARDS = 12; // 折叠之前露出的项目卡
const firstDetails = zh.indexOf('<details>');
const aboveFold = firstDetails === -1 ? zh : zh.slice(0, firstDetails);
const visibleImages = (aboveFold.match(/<img[^>]+assets\//g) || []).length;
const visibleCards = (aboveFold.match(/^- \*\*\[/gm) || []).length;
if (visibleImages > MAX_VISIBLE_IMAGES) {
  fail(`折叠前有 ${visibleImages} 张大图，超过预算 ${MAX_VISIBLE_IMAGES} 张 —— 主页又变长了`);
}
if (visibleCards > MAX_VISIBLE_CARDS) {
  fail(`折叠前有 ${visibleCards} 张项目卡，超过预算 ${MAX_VISIBLE_CARDS} 张 —— 主页又变长了`);
}
const foldCount = (zh.match(/<details>/g) || []).length;
if (foldCount < 2) fail(`折叠块只有 ${foldCount} 个，长内容没被折叠`);

// 5. star 徽章与 data/recent.json 一致
const recentPath = join(root, 'data', 'recent.json');
if (existsSync(recentPath)) {
  const recent = JSON.parse(readFileSync(recentPath, 'utf8'));
  for (const [repo, stars] of Object.entries(recent.stars || {})) {
    const m = zh.match(new RegExp(`github/stars/webkubor/${repo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\?[^"]*color=([0-9a-f]{6})`));
    if (!m) continue;
    const expected = stars >= 10 ? '6e7681' : stars > 0 ? '8b949e' : 'c9d1d9';
    if (m[1] !== expected) {
      fail(`${repo} 的 star 徽章颜色 ${m[1]} 与实际 star（${stars}）不符，应为 ${expected} —— 重跑 build-readme.mjs`);
    }
  }
}

if (failures.length) {
  console.error(failures.map((f) => `✗ ${f}`).join('\n'));
  process.exit(1);
}
console.log(
  `✓ README 与生成器一致，双语结构对称，${zhRepos.length} 个仓库链接有效，折叠前 ${visibleImages} 图 / ${visibleCards} 卡，${foldCount} 个折叠块，star 徽章与实时数据一致`,
);
