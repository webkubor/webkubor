// Bloom 色板：六个莫兰迪原色先直接当文字色量一次，不达标的保留色相与彩度、只解亮度。
// 浅色底上六个都要解；深色底上多数原色本身就可读——如实呈现，不为动效造假。

import { MORANDI, css, FONT_SANS, FONT_MONO } from './tokens.mjs';
import { contrast, ratioText, solveLightness, rgbToOklch, hex } from './color.mjs';
import { frame, keyframes, esc, r1 } from './svg.mjs';

const W = 1200;
const H = 400;
const COL = { x: 56, w: 168, gap: 16 };
const LOOP = 10;

const colX = (i) => COL.x + i * (COL.w + COL.gap);
const knobX = (L) => r1(((Math.min(0.9, Math.max(0.4, L)) - 0.4) / 0.5) * COL.w);

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

function labels(c, t) {
  const check = `<tspan fill="${css(t.ok)}">✓</tspan>`;
  if (!c.changed) {
    return `<text class="lb" y="0">原色可读 ${ratioText(c.raw)} ${check}</text>
<text class="hx" y="24">${hex(c.rgb)}</text>`;
  }
  return `<text class="lb raw" y="0">原色当字 ${ratioText(c.raw)}</text>
<text class="lb fix" y="0">解出 ${ratioText(c.fixed)} ${check}</text>
<text class="hx raw" y="24">${hex(c.rgb)}</text>
<text class="hx fix" y="24">${hex(c.solved)}</text>`;
}

function column(c, i, t) {
  const x = colX(i);
  const delay = `style="animation-delay:${(i * 0.3).toFixed(1)}s"`;
  const anim = c.changed ? ` ${delay}` : '';
  return `
<g transform="translate(${x} 0)">
  <rect y="116" width="${COL.w}" height="72" rx="14" fill="${css(c.rgb)}"/>
  <text class="nm" y="216">${esc(c.name)} ${esc(c.zh)}</text>
  <text class="aa${c.changed ? ` s${i}` : ''}" y="264" fill="${css(c.solved)}"${anim}>Aa 文字</text>
  <path d="M0 290h${COL.w}" stroke="${css(t.line)}" stroke-width="2" stroke-linecap="round"/>
  <circle class="${c.changed ? `k${i}` : ''}" cx="${knobX(c.solvedL)}" cy="290" r="6" fill="${css(c.solved)}" stroke="${css(t.bg)}" stroke-width="2"${anim}/>
  <g transform="translate(0 328)"${c.changed ? ` class="cyc c${i}"` : ''}>${labels(c, t)}</g>
</g>`;
}

function perColumn(c, i) {
  if (!c.changed) return '';
  const dx = r1(knobX(c.rawL) - knobX(c.solvedL));
  const raw = (decl) => ({ '0%,22%': decl, '96%,100%': decl });
  const fill = `fill:${css(c.solved)}`;
  return [
    keyframes(`s${i}`, { ...raw(`fill:${css(c.rgb)}`), '34%,86%': fill }),
    keyframes(`k${i}`, { ...raw(`transform:translateX(${dx}px);fill:${css(c.rgb)}`), '34%,86%': `transform:none;${fill}` }),
    `.s${i}{animation:s${i} ${LOOP}s ease-in-out infinite both}`,
    `.k${i}{animation:k${i} ${LOOP}s ease-in-out infinite both}`,
    `.c${i} .raw,.c${i} .fix{animation-delay:${(i * 0.3).toFixed(1)}s}`,
  ].join('');
}

function style(t, cols) {
  return `
text{font-family:${FONT_SANS}}
.h1{font-size:21px;font-weight:600;fill:${css(t.text)}}
.sub{font-size:15px;fill:${css(t.textSemi)}}
.nm{font-size:15px;font-weight:600;fill:${css(t.text)}}
.aa{font-size:34px;font-weight:600}
.lb{font-size:14px;fill:${css(t.textSemi)}}
.hx{font-family:${FONT_MONO};font-size:13px;fill:${css(t.textSemi)}}
.raw{opacity:0}
.cyc .raw{animation:out ${LOOP}s ease-in-out infinite both}
.cyc .fix{animation:in ${LOOP}s ease-in-out infinite both}
${keyframes('out', { '0%,22%': 'opacity:1', '30%,90%': 'opacity:0', '97%,100%': 'opacity:1' })}
${keyframes('in', { '0%,26%': 'opacity:0', '34%,86%': 'opacity:1', '94%,100%': 'opacity:0' })}
${cols.map(perColumn).join('')}`;
}

export function palette(t) {
  const cols = measure(t);
  const fixedCount = cols.filter((c) => c.changed).length;
  const body = `
<rect width="${W}" height="${H}" rx="24" fill="${css(t.bg)}"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="23.5" fill="none" stroke="${css(t.line)}"/>
<text class="h1" x="${COL.x}" y="58">原色铺气氛，文字只解亮度</text>
<text class="sub" x="${COL.x}" y="86">莫兰迪原色直接当文字先量一次；不到 4.5:1 的，色相和彩度不动，只把亮度解到刚好达标。</text>
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
