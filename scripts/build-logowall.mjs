#!/usr/bin/env node
/**
 * logo 墙构建：浏览器渲染 → 截图 → assets/logowall-{light,dark}.png
 *
 * 为什么用截图而不是生成 SVG：
 *   logo 要「原样」，而任何转码都会改变它。踩过的坑：
 *   1. 剥掉外层 <svg> 壳会丢掉根元素上的 fill="none" 等 presentation 属性，
 *      子元素不再继承，path 默认 fill=black —— scorecard 的评分环直接糊成实心黑块；
 *   2. currentColor 内嵌后没有继承环境，浏览器回落成黑色；
 *   3. 把 logo 交给 AI 重画，形状必然变形，那就不是「他们的 logo」了。
 *   浏览器渲染原图是唯一不会走样的路径。
 *
 * 用法：node scripts/build-logowall.mjs
 * 依赖：ego-browser（已在 PATH）+ 仓库根目录起 http 服务
 */

import { execFileSync, spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8766;

// 截图脚本：与本文件同目录的 render-logowall.mjs，用 ego-browser nodejs 跑
const SCRIPT = join(root, 'scripts', 'render-logowall.mjs');

/** 起一个只服务仓库根目录的静态服务 */
function serve() {
  const proc = spawn('python3', ['-m', 'http.server', String(PORT)], {
    cwd: root,
    stdio: 'ignore',
    detached: false,
  });
  return proc;
}

async function waitForServer(ms = 5000) {
  const t = Date.now();
  while (Date.now() - t < ms) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/scripts/profile/logowall-template.html`);
      if (r.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

const server = serve();
try {
  if (!(await waitForServer())) throw new Error('本地静态服务没起来');
  execFileSync('ego-browser', ['nodejs'], {
    input: readFileSync(SCRIPT, 'utf8'),
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  const line = 'SHOTS ' + JSON.stringify(['light', 'dark'].map((theme) => ({ theme, path: `/tmp/logowall-${theme}.png` })));
  const paths = JSON.parse(line.slice(6));
  for (const { theme, path } of paths) {
    const dest = join(root, 'assets', `logowall-${theme}.png`);
    writeFileSync(dest, readFileSync(path));
    console.log(`assets/logowall-${theme}.png  ${(readFileSync(dest).length / 1024).toFixed(1)} KB`);
  }
} finally {
  server.kill();
}
