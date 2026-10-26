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
  checkReducedMotion(file, svg);
}

/**
 * 减弱动效终态自检：浏览器在 prefers-reduced-motion 下把 animation:none 生效，
 * 所有由动画控制的属性回落到元素的静态 CSS 值。于是终态 = 静态样式。
 *
 * 两条机械可判的规则：
 *   ① 挂在 <text> 上的 class，若静态 opacity:0 且它不在任何 @keyframes 名单里
 *      → 说明这行字永远不出现（动画也没接管它），信息丢失；
 *   ② 某组关键帧以 opacity:0 收尾，但对应 class 在静态样式里没有显式 opacity:0
 *      → 减弱动效下它会回落成可见，出现「本该隐形的没隐形」。
 */
function checkReducedMotion(file, svg) {
  const staticSvg = svg.replace(/animation:[^;}]+;?/g, '');

  // 所有被动画接管的 class 名（keyframes 名 = class 名）
  const animated = new Set([...staticSvg.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)].map((m) => m[1]));

  // 静态样式里每个 class 声明的 opacity
  const classOpacity = new Map();
  for (const m of staticSvg.matchAll(/\.([\w-]+)\s*\{([^}]*)\}/g)) {
    const op = m[2].match(/opacity:\s*([\d.]+)/);
    if (op) classOpacity.set(m[1], op[1]);
  }

  // ① 文字 class 静态 opacity:0 且没被动画接管
  const deadText = new Set();
  for (const m of staticSvg.matchAll(/<text[^>]*class="([^"]*)"/g)) {
    for (const cls of m[1].split(/\s+/).filter(Boolean)) {
      if (classOpacity.get(cls) === '0' && !animated.has(cls)) deadText.add(cls);
    }
  }
  if (deadText.size) {
    fail(
      `${file} 文字 class ${[...deadText].join('、')} 静态 opacity:0 且无动画接管，减弱动效下这些字永远不出现`,
    );
  }

  // ② 关键帧以 opacity:0 收尾，但 class 没显式声明 opacity:0
  for (const m of staticSvg.matchAll(/@keyframes\s+([\w-]+)\s*\{([^}]*)\}/g)) {
    const [, name, body] = m;
    const stops = [...body.matchAll(/(\d+(?:\.\d+)?%)\{([^}]*)\}/g)];
    if (!stops.length) continue;
    const last = stops[stops.length - 1][2].trim();
    if (!/opacity:\s*0\s*$/.test(last)) continue;
    if (classOpacity.get(name) === '0') continue; // 作者已显式声明它该隐形
    fail(`${file} 关键帧 ${name} 以 opacity:0 收尾，但 class 未显式声明 opacity:0，减弱动效下会回落成可见`);
  }
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
