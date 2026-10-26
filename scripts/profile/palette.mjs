// Bloom 色板：六个莫兰迪原色先直接当文字色量一次，不达标的保留色相与彩度、只解亮度。
// 浅色底上六个都要解；深色底上多数原色本身就可读——如实呈现，不为动效造假。
// 视觉：点阵底纹 + 双光晕 + 渐变高光色卡 + 刻度滑轨；数字全程常显，减弱动效时停在终态。
// 每列都有动作：浅色底指针带过冲地落到解出位，深色底指针轻点确认「本来就达标」——
// 两版关键帧组数对称，减弱动效后仍是一张完整可读的表。

import { MORANDI, css, FONT_SANS, FONT_MONO } from './tokens.mjs';
import { contrast, ratioText, solveLightness, rgbToOklch, oklchToRgb, hex } from './color.mjs';
import { frame, keyframes, esc, r1 } from './svg.mjs';

const W = 1200;
const H = 448;
const COL = { x: 56, w: 168, gap: 16 };
const LOOP = 9;
const EASE = 'cubic-bezier(.2,.8,.2,1)';
const DAMP = 'cubic-bezier(.45,.05,.55,.95)';

// 列内竖向节奏
// 字号下限受 GitHub 实际渲染宽度约束：README 内容区 846px / viewBox 1200 = 0.705 缩放，
// 要让最小标签在真实页面上不小于 12px，viewBox 里至少要 17px。
const CARD = { y: 116, h: 72, r: 14 };
const RAW_TY = 208; // 「原色 / 当字 x:1」行
const CHIP = { y: 222, h: 16, r: 8 };
const CHIP_TY = 236; // 「解出 / x:1 ✓」行
const NAME_Y = 268;
const AA_Y = 306;
const TRACK_Y = 330;
const EP_Y = 352;
const HEX_Y = 378;

const colX = (i) => COL.x + i * (COL.w + COL.gap);
const knobX = (L) => r1(((Math.min(0.9, Math.max(0.4, L)) - 0.4) / 0.5) * COL.w);

/** 同色相微调明度与彩度：色卡的高光端与暗端都从原色推出来，不另造颜色 */
const shade = (rgb, dL, kC = 1) => {
  const { L, C, H } = rgbToOklch(rgb);
  return oklchToRgb(Math.min(0.99, Math.max(0.03, L + dL)), Math.max(0, C * kC), H);
};

export function measure(t) {
  return MORANDI.map((m) => {
    const solved = solveLightness(m.rgb, t.bg);
    return {
      ...m,
      raw: contrast(m.rgb, t.bg),
      fixed: contrast(solved.rgb, t.bg),
      solved: solved.rgb,
      changed: solved.changed,
      rawL: rgbToOklch(m.rgb).L,
      solvedL: solved.L,
    };
  });
}

/** 底纹与光晕：点阵压极淡，双光晕在深色底明显、浅色底只留一线温度 */
function backdrop(t) {
  return `
<g clip-path="url(#pc)">
  <g class="g1"><rect x="-160" y="-160" width="${W + 320}" height="${H + 320}" fill="url(#gh0)"/></g>
  <g class="g2"><rect x="-160" y="-160" width="${W + 320}" height="${H + 320}" fill="url(#gh1)"/></g>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
</g>`;
}

/** 标题块：竖棒 + 主标题 + WCAG 门槛标签 + 一行副标题 + 渐变细分隔线 */
function header(t, cols) {
  const light = t.mode === 'light';
  const raws = cols.map((c) => c.raw);
  const span = `${ratioText(Math.min(...raws))}–${ratioText(Math.max(...raws))}`;
  const need = cols.filter((c) => c.changed).length;
  const sub = light
    ? `莫兰迪原色直接当字只有 ${span}，色相与彩度不动，只把亮度解到刚好达标`
    : `深色底上多数原色本就够读；不到 4.5:1 的，色相与彩度不动，只解亮度`;
  const stat = `${light ? '浅色底' : '深色底'} ${need}/6 需解亮度`;
  return `
<rect x="${COL.x}" y="24" width="4" height="34" rx="2" fill="url(#bg1)"/>
<text class="h1" x="${COL.x + 16}" y="52">原色铺气氛，文字只解亮度</text>
<rect x="392" y="28" width="212" height="26" rx="13" fill="${css(t.surface)}" stroke="${css(t.line)}"/>
<text class="chip" x="404" y="46">WCAG 门槛：文字 4.5:1 / 图形 3:1</text>
<text class="sub" x="${COL.x + 16}" y="84">${esc(sub)}</text>
<text class="stat" x="${W - COL.x}" y="84" text-anchor="end">${esc(stat)}</text>
<path d="M${COL.x} 104H${W - COL.x}" stroke="url(#rg)" stroke-width="1.5"/>`;
}

/** 滑轨：刻度 + 两端亮度标注 + 原色空心标记 + 指针 */
function rail(c, t) {
  let ticks = '';
  for (let x = 0; x <= COL.w; x += 21) {
    ticks += `<path d="M${x} ${TRACK_Y}v${x % 42 === 0 ? 8 : 4}"/>`;
  }
  const rawMark = c.changed
    ? `<circle cx="${knobX(c.rawL)}" cy="${TRACK_Y}" r="5" fill="${css(t.bg)}" stroke="${css(t.textSemi)}" stroke-width="1.5"/>`
    : '';
  return `
<path class="tk" d="M0 ${TRACK_Y}h${COL.w}"/>
<g class="tk" stroke-width="1.2">${ticks}</g>
<text class="ep" x="0" y="${EP_Y}">0.40</text>
<text class="ep" x="${COL.w}" y="${EP_Y}" text-anchor="end">0.90</text>
${rawMark}`;
}

/** 一列：原色卡（原色）→ 解出小条（解出）→ 名字 → Aa 文字 → 滑轨 → 色值 */
function column(c, i, t) {
  const x = colX(i);
  const delay = (i * 0.3).toFixed(1);
  const kx = knobX(c.solvedL);
  const dx = r1(knobX(c.rawL) - kx);
  const changed = c.changed;
  // 色值分两行：解出的才需要「原色→解出色」对照，一行在 168px 列宽里放不下 18px 的 13 个字符
  const hexLines = changed
    ? `<text class="hx" x="0" y="${HEX_Y}">${esc(hex(c.rgb))}</text><text class="hx" x="0" y="${HEX_Y + 21}">→ ${esc(hex(c.solved))}</text>`
    : `<text class="hx" x="0" y="${HEX_Y}">${esc(hex(c.rgb))}</text>`;
  return `
<g transform="translate(${x} 0)">
  <g filter="url(#sd)">
    <rect x="0" y="${CARD.y}" width="${COL.w}" height="${CARD.h}" rx="${CARD.r}" fill="url(#cg${i})"/>
    <rect x="0" y="${CARD.y}" width="${COL.w}" height="${CARD.h}" rx="${CARD.r}" fill="url(#hl)"/>
  </g>
  <g clip-path="url(#cc${i})"><g class="sw" style="animation-delay:${delay}s"><rect x="-96" y="${CARD.y}" width="96" height="${CARD.h}" fill="url(#swg)"/></g></g>
  <text class="lb" x="0" y="${RAW_TY}">原色</text>
  <text class="lb" x="${COL.w}" y="${RAW_TY}" text-anchor="end">当字 ${ratioText(c.raw)}</text>
  <g class="kf c${i}" fill="${css(c.solved)}" style="animation-delay:${delay}s">
    <rect x="0" y="${CHIP.y}" width="44" height="${CHIP.h}" rx="${CHIP.r}"/>
    <rect x="0" y="${CHIP.y}" width="44" height="${CHIP.h}" rx="${CHIP.r}" fill="url(#shi)"/>
    <text class="lb" x="52" y="${CHIP_TY}" fill="${css(t.textSemi)}">${changed ? '解出' : '已达标'}</text>
    <text class="rr" x="${COL.w}" y="${CHIP_TY}" text-anchor="end" fill="${css(t.text)}">${ratioText(c.fixed)}<tspan fill="${css(t.ok)}"> ✓</tspan></text>
  </g>
  <text class="aa" x="0" y="${AA_Y}" fill="${css(c.solved)}">Aa 文字</text>
  <g class="kg k${i}" style="transform-origin:${kx}px ${TRACK_Y}px">
    <circle cx="${kx}" cy="${TRACK_Y}" r="7" fill="${css(c.solved)}" stroke="${css(t.bg)}" stroke-width="2.5"/>
  </g>
  <text class="nm" x="0" y="${NAME_Y}">${esc(c.name)} ${esc(c.zh)}</text>
  ${rail(c, t)}
  ${hexLines}
</g>`;
}

/** 每列的关键帧：填充（解出色）与指针位移一一对齐，解出瞬间到位并轻微过冲回弹 */
function perColumn(c, i) {
  const dx = r1(knobX(c.rawL) - knobX(c.solvedL));
  const dir = -Math.sign(dx) || 1;
  const over = r1(dir * 5);
  const back = r1(dir * 1.8);
  const fill = c.changed
    ? {
        '0%,14%': `fill:${css(c.rgb)}`,
        '30%,88%': `fill:${css(c.solved)}`,
        '100%': `fill:${css(c.rgb)}`,
      }
    : {
        '0%,14%': `fill:${css(c.solved)}`,
        '30%,88%': `fill:${css(c.solved)}`,
        '100%': `fill:${css(c.solved)}`,
      };
  const move = c.changed
    ? {
        '0%,14%': `transform:translateX(${dx}px)`,
        '30%': `transform:translateX(${over}px)`,
        '38%': `transform:translateX(${back}px)`,
        '44%,88%': 'transform:translateX(0px)',
        '100%': `transform:translateX(${dx}px)`,
      }
    : {
        '0%,26%': 'transform:translateX(0px) scale(1)',
        '30%': 'transform:translateX(0px) scale(1.22)',
        '38%,88%': 'transform:translateX(0px) scale(1)',
        '100%': 'transform:translateX(0px) scale(1)',
      };
  return [
    keyframes(`c${i}`, fill),
    keyframes(`k${i}`, move),
    `.c${i}{animation:c${i} ${LOOP}s ${EASE} infinite both}`,
    `.k${i}{animation:k${i} ${LOOP}s ${EASE} infinite both}`,
  ].join('');
}

function defs(t, cols) {
  const light = t.mode === 'light';
  const card = cols
    .map(
      (c, i) =>
        `<linearGradient id="cg${i}" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${css(shade(c.rgb, 0.1, 0.92))}"/><stop offset="1" stop-color="${css(shade(c.rgb, -0.06, 1.03))}"/></linearGradient>`,
    )
    .join('');
  const clip = cols
    .map(
      (c, i) =>
        `<clipPath id="cc${i}"><rect x="0" y="${CARD.y}" width="${COL.w}" height="${CARD.h}" rx="${CARD.r}"/></clipPath>`,
    )
    .join('');
  return `
<defs>
  <clipPath id="pc"><rect width="${W}" height="${H}" rx="24"/></clipPath>
  ${clip}
  ${card}
  <radialGradient id="hl" cx="24%" cy="14%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity="${light ? 0.2 : 0.3}"/><stop offset=".5" stop-color="#fff" stop-opacity="${light ? 0.05 : 0.08}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <linearGradient id="shi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${light ? 0.3 : 0.26}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="swg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="gh0" cx="76%" cy="2%" r="60%"><stop offset="0" stop-color="${css(t.petal, light ? 0.2 : 0.26)}"/><stop offset="1" stop-color="${css(t.petal, 0)}"/></radialGradient>
  <radialGradient id="gh1" cx="12%" cy="100%" r="58%"><stop offset="0" stop-color="${css(t.info, light ? 0.12 : 0.2)}"/><stop offset="1" stop-color="${css(t.info, 0)}"/></radialGradient>
  <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${css(t.accent, 0.95)}"/><stop offset="1" stop-color="${css(t.accent, 0.15)}"/></linearGradient>
  <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${css(t.accent, 0.6)}"/><stop offset=".45" stop-color="${css(t.line)}"/><stop offset="1" stop-color="${css(t.line, 0)}"/></linearGradient>
  <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.3" cy="1.3" r="1.1" fill="${css(t.textSemi, light ? 0.17 : 0.13)}"/></pattern>
  <filter id="sd" x="-20%" y="-40%" width="140%" height="200%"><feDropShadow dx="0" dy="${light ? 3 : 6}" stdDeviation="${light ? 5 : 8}" flood-color="#000" flood-opacity="${light ? 0.1 : 0.45}"/></filter>
</defs>`;
}

function style(t, cols) {
  return `
text{font-family:${FONT_SANS}}
.h1{font-size:26px;font-weight:600;fill:${css(t.text)}}
.chip{font-size:18px;fill:${css(t.textSemi)}}
.sub{font-size:19px;fill:${css(t.textSemi)}}
.stat{font-size:18px;fill:${css(t.textSemi)}}
.nm{font-size:19px;font-weight:600;fill:${css(t.text)}}
.aa{font-size:34px;font-weight:600}
.lb{font-size:18px;fill:${css(t.textSemi)}}
.rr{font-size:19px;font-weight:600}
.hx{font-family:${FONT_MONO};font-size:18px;fill:${css(t.textSemi)}}
.tk{stroke:${css(t.line)};fill:none}
.ep{font-family:${FONT_MONO};font-size:18px;fill:${css(t.textSemi)}}
.ep.mid{font-family:${FONT_SANS};opacity:.75}
.sw{opacity:0}
.g1{animation:drift 26s ${DAMP} infinite}
.g2{animation:drift2 32s ${DAMP} infinite}
${keyframes('drift', { '0%,100%': 'transform:translate(0px,0px)', '50%': 'transform:translate(30px,-16px)' })}
${keyframes('drift2', { '0%,100%': 'transform:translate(0px,0px)', '50%': 'transform:translate(-26px,12px)' })}
${keyframes('sw', { '0%,11%': 'opacity:0;transform:translateX(0px)', '13%': 'opacity:.5;transform:translateX(0px)', '28%': 'opacity:.5;transform:translateX(300px)', '31%,100%': 'opacity:0;transform:translateX(300px)' })}
${cols.map(perColumn).join('')}`;
}

export function palette(t) {
  const cols = measure(t);
  const fixedCount = cols.filter((c) => c.changed).length;
  const body = `
<rect width="${W}" height="${H}" rx="24" fill="${css(t.bg)}"/>
${defs(t, cols)}
${backdrop(t)}
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="23.5" fill="none" stroke="${css(t.line)}"/>
${header(t, cols)}
${cols.map((c, i) => column(c, i, t)).join('')}`;
  return frame({
    width: W,
    height: H,
    title: 'Bloom 色板：同一色相，只解亮度',
    desc: `六个 Bloom 莫兰迪原色在${t.mode === 'light' ? '浅色' : '深色'}底上的对比度：${cols
      .map((c) => `${c.name} ${ratioText(c.raw)}${c.changed ? ` 解为 ${ratioText(c.fixed)}` : ' 直接可读'}`)
      .join('，')}。共 ${fixedCount} 个需要调整亮度。`,
    style: style(t, cols),
    body,
  });
}
