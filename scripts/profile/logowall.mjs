// Logo 墙：把开源项目「透明底纯图形」的真 logo 收进一张面板。
// 素材纪律（owner 2026-10-26 定）：
//   1. 只收各仓库里现成的 logo，不用首字母标记凑数——宁缺毋滥；
//   2. 只收透明底纯图形；自带底色方块的 app icon 不进墙，避免白底墙上贴深色补丁；
//   3. PNG 需先量化到 ≤64 色、≤80px（scripts/fetch-logos 产物），SVG 剥壳内嵌。
// 排版：网格 + 呼吸间距；logo 居中、项目名在下；明暗两套各自适配。

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { css, FONT_SANS } from './tokens.mjs';
import { frame, keyframes, esc } from './svg.mjs';

const W = 1200;
const H = 340;

// 网格：6 个纯图形 logo，3 列 × 2 行
const COLS = 3;
const TOP = 110;
const GAP_X = 80;
const CELL_W = (W - 2 * 72 - (COLS - 1) * GAP_X) / COLS;
const ROW_H = 118;
const ICON = 64;

const here = dirname(fileURLToPath(import.meta.url));

/** logo 清单：file = assets/logos/ 下素材，label = 图上显示名 */
const LOGOS = [
  { name: 'typora-Bloom-theme', file: 'typora-Bloom-theme.svg', kind: 'svg', label: 'Bloom' },
  { name: 'scorecard', file: 'scorecard.svg', kind: 'svg', label: 'Scorecard' },
  { name: 'reel-kit', file: 'reel-kit.svg', kind: 'svg', label: 'reel-kit' },
  { name: 'chat-mood-gen', file: 'chat-mood-gen.svg', kind: 'svg', label: 'chat-mood-gen' },
  { name: 'meridian', file: 'meridian-q.png', kind: 'png', label: 'Meridian' },
  { name: 'wallpaper-generator', file: 'wallpaper-generator-q.png', kind: 'png', label: '壁纸编辑器' },
];

/** 剥掉外层 svg 壳，只留内部内容与 viewBox，便于按格缩放 */
function inlineSvg(file) {
  const raw = readFileSync(join(here, '../../assets/logos', file), 'utf8');
  const vb = raw.match(/viewBox="([^"]+)"/)?.[1] || '0 0 64 64';
  const body = raw
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?svg[^>]*>/g, '')
    .trim();
  return { vb, body };
}

/** PNG → data URI（素材已量化，这里只做编码） */
function dataUri(file) {
  const buf = readFileSync(join(here, '../../assets/logos', file));
  return `data:image/png;base64,${buf.toString('base64')}`;
}

/** 一个 logo 单元：图形 + 项目名，带入场动画（reduced-motion 停在终态） */
function cell(logo, i, t) {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const x = 72 + col * (CELL_W + GAP_X);
  const y = TOP + row * ROW_H;
  const cx = x + CELL_W / 2;

  const art =
    logo.kind === 'svg'
      ? (() => {
          const { vb, body } = inlineSvg(logo.file);
          const [vx, vy, vw, vh] = vb.split(/\s+/).map(Number);
          // 横版 logo 按宽度撑满，正方形按大边缩放
          const wide = vw / vh > 2;
          const s = wide ? (ICON * 1.6) / vw : ICON / Math.max(vw, vh);
          const w = vw * s;
          const h = vh * s;
          return `<svg x="${cx - w / 2}" y="${y + (ICON - h) / 2}" width="${w}" height="${h}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
        })()
      : `<image x="${cx - ICON / 2}" y="${y}" width="${ICON}" height="${ICON}" href="${dataUri(logo.file)}" />`;

  return `<g class="cell" style="animation-delay:${(i * 0.09).toFixed(2)}s">
  ${art}
  <text class="nm" x="${cx}" y="${y + ICON + 32}" text-anchor="middle">${esc(logo.label)}</text>
</g>`;
}

function style(t) {
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  return `
text{font-family:${FONT_SANS}}
.nm{font-size:18px;font-weight:500;fill:${css(t.textSemi)}}
.h1{font-size:30px;font-weight:600;fill:${css(t.text)}}
.sub{font-size:19px;fill:${css(t.textSemi)}}
.cell{animation:pop .6s ${ease} both}
${keyframes('pop', { from: 'opacity:0;transform:translateY(10px)', to: 'opacity:1;transform:none' })}`;
}

export function logowall(t) {
  const body = `
<rect width="${W}" height="${H}" rx="24" fill="${css(t.bg)}"/>
<text class="h1" x="72" y="58">开源项目的脸面</text>
<text class="sub" x="72" y="88">只收各仓库现成的透明底 logo，共 ${LOGOS.length} 个；没有正式 logo 的项目不凑数</text>
${LOGOS.map((l, i) => cell(l, i, t)).join('')}`;
  return frame({
    width: W,
    height: H,
    title: 'webkubor 开源项目 logo 墙',
    desc: `${LOGOS.map((l) => l.label).join('、')}，共 ${LOGOS.length} 个项目的透明底 logo。`,
    style: style(t),
    body,
  });
}
