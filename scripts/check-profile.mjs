#!/usr/bin/env node
// 主页动效验收：node scripts/check-profile.mjs
// 查四件事：产物与生成器一致、SVG 守 GitHub 渲染边界、文字对比度达标、双语 README 引用一致。

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAll } from './profile/render.mjs';
import { theme } from './profile/tokens.mjs';
import { measure } from './profile/palette.mjs';
import { contrast, ratioText } from './profile/color.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const fail = (msg) => failures.push(msg);
const MAX_KB = 40;

// 渲染边界查磁盘上的文件——GitHub 拿到的是它，不是内存里的渲染结果
function checkSvg(file, rendered) {
  const onDisk = join(root, file);
  if (!existsSync(onDisk)) return fail(`${file} 缺失，先跑 build-profile.mjs`);
  const svg = readFileSync(onDisk, 'utf8');
  if (svg !== rendered) fail(`${file} 与生成器不一致，重跑 build-profile.mjs`);
  if (!/<title[^>]*>[^<]+<\/title>/.test(svg)) fail(`${file} 缺 <title>`);
  if (!svg.includes('prefers-reduced-motion:reduce')) fail(`${file} 缺减弱动效规则`);
  if (/<script|foreignObject|@import|@font-face|\bon[a-z]+=/i.test(svg)) fail(`${file} 含 GitHub 会剥掉或拦截的内容`);
  if (/(href|src)="(?!#)/.test(svg)) fail(`${file} 引用了外部资源`);
  if (Buffer.byteLength(svg) / 1024 > MAX_KB) fail(`${file} 超过 ${MAX_KB} KB`);
  const opens = (svg.match(/<(?!\/|\?|!)[a-zA-Z]+[^>]*[^/]>|<[a-zA-Z]+>/g) || []).length;
  const closes = (svg.match(/<\/[a-zA-Z]+>/g) || []).length;
  if (opens !== closes) fail(`${file} 标签不配对（开 ${opens} / 闭 ${closes}）`);
}

/** 所有真正当文字用的颜色对都要 ≥ 4.5:1；面板里刻意演示的「原色当字」不在此列 */
function checkContrast() {
  for (const mode of ['light', 'dark']) {
    const t = theme(mode);
    const pairs = {
      'text/bg': [t.text, t.bg],
      'textSemi/bg': [t.textSemi, t.bg],
      'accent/bg': [t.accent, t.bg],
      'ok/bg': [t.ok, t.bg],
      'text/surface': [t.text, t.surface],
      'textSemi/surface': [t.textSemi, t.surface],
      ...Object.fromEntries(['ok', 'err', 'info', 'hot'].map((k) => [`${k}/surface`, [t[k], t.surface]])),
      ...Object.fromEntries(measure(t).map((c) => [`${c.id}/bg`, [c.solved, t.bg]])),
    };
    for (const [name, [fg, bg]] of Object.entries(pairs)) {
      const r = contrast(fg, bg);
      if (r < 4.5) fail(`${mode} ${name} 对比度 ${ratioText(r)} < 4.5:1`);
    }
  }
}

function checkReadmes(files) {
  const refs = (md) => [...md.matchAll(/\.\/(assets\/[\w-]+\.svg)/g)].map((m) => m[1]).sort();
  const zh = refs(readFileSync(join(root, 'README.md'), 'utf8'));
  const en = refs(readFileSync(join(root, 'README.en.md'), 'utf8'));
  if (zh.join() !== en.join()) fail('README.md 与 README.en.md 引用的 SVG 不一致');
  for (const f of files) if (!zh.includes(f)) fail(`README 未引用 ${f}`);
}

const outputs = renderAll();
outputs.forEach(({ file, svg }) => checkSvg(file, svg));
checkContrast();
checkReadmes(outputs.map((o) => o.file));

if (failures.length) {
  console.error(failures.map((f) => `✗ ${f}`).join('\n'));
  process.exit(1);
}
console.log(`✓ ${outputs.length} 个 SVG 与生成器一致，渲染边界、对比度与双语引用全部通过`);
