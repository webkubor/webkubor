// 头图：六片莫兰迪花瓣在量具下展开；字标先以原色落笔，再沉成可读的墨色，
// 标尺把这一步的对比度变化量出来。入场只播一次，之后只留量环与花心的慢呼吸。

import { MORANDI, css, FONT_SANS } from './tokens.mjs';
import { contrast, ratioText } from './color.mjs';
import { frame, keyframes, r1 } from './svg.mjs';

const W = 1200;
const H = 340;
const C = { x: 212, y: 170 };
const RULER = { x: 420, w: 700, y: 198 };
const WORD = 'webkubor';

// 花瓣从内圈 r=26 起画，让中心留出空腔给花心，不再六瓣在圆心糊成一团
const PETAL = 'M0 -26C-33-48-40-78 0-102C40-78 33-48 0-26Z';
const atRatio = (r) => r1(RULER.x + ((Math.min(r, 21) - 1) / 20) * RULER.w);

/** 把颜色朝目标色混合，用于花瓣的渐变端点 */
const mix = (rgb, target, k) => rgb.map((c, i) => Math.round(c + (target[i] - c) * k));

/** 背景：径向光晕 + 两圈刻度弧，让画面有纵深而不是一块平色 */
function backdrop(t) {
  const arcs = [172, 196]
    .map(
      (r, i) =>
        `<circle cx="${C.x}" cy="${C.y}" r="${r}" fill="none" stroke="${css(t.textSemi, 0.16 - i * 0.05)}" stroke-width="1" stroke-dasharray="${3 + i * 5} ${9 + i * 7}"/>`,
    )
    .join('');
  return `
<defs>
  <radialGradient id="hg" cx="16%" cy="32%" r="72%">
    <stop offset="0" stop-color="${css(t.petal, t.mode === 'light' ? 0.18 : 0.16)}"/>
    <stop offset=".5" stop-color="${css(t.petal, 0.05)}"/>
    <stop offset="1" stop-color="${css(t.petal, 0)}"/>
  </radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#hg)"/>
<g class="arcs">${arcs}</g>`;
}

/** 六片花瓣：每片一个自己的渐变，根部深、瓣尖浅，做出玻璃质感 */
function bloom(t) {
  const toward = t.mode === 'light' ? [255, 255, 255] : [255, 255, 255];
  const grads = MORANDI.map(
    (m, i) =>
      `<linearGradient id="pg${i}" x1="0" y1="1" x2="0" y2="0">
  <stop offset="0" stop-color="${css(mix(m.rgb, toward, 0.12))}"/>
  <stop offset="1" stop-color="${css(mix(m.rgb, toward, 0.42))}"/>
</linearGradient>`,
  ).join('\n');

  const petals = MORANDI.map(
    (m, i) =>
      `<g transform="translate(${C.x} ${C.y}) rotate(${i * 60})"><path class="pt" style="animation-delay:${(i * 0.1).toFixed(2)}s" d="${PETAL}" fill="url(#pg${i})"/></g>`,
  ).join('');

  const ticks = [0, 90, 180, 270]
    .map((a) => `<line transform="translate(${C.x} ${C.y}) rotate(${a})" x1="0" y1="-150" x2="0" y2="-140"/>`)
    .join('');

  return `
<defs>${grads}</defs>
<g class="ring" fill="none" stroke="${css(t.textSemi, 0.45)}">
  <circle cx="${C.x}" cy="${C.y}" r="132" stroke-dasharray="1 7"/>
  <circle cx="${C.x}" cy="${C.y}" r="146" stroke-opacity=".5"/>
</g>
<g stroke="${css(t.textSemi, 0.6)}" stroke-width="1.5">${ticks}</g>
<g class="bloom">${petals}</g>
<circle class="halo" cx="${C.x}" cy="${C.y}" r="15" fill="none" stroke="${css(t.accent)}" stroke-width="1.5"/>
<circle cx="${C.x}" cy="${C.y}" r="5" fill="${css(t.accent)}"/>`;
}

function wordmark(t) {
  const letters = [...WORD]
    .map((ch, i) => `<tspan class="ink" style="animation-delay:${(0.5 + i * 0.08).toFixed(2)}s">${ch}</tspan>`)
    .join('');
  return `<text class="word" x="${RULER.x - 4}" y="150">${letters}</text>`;
}

function ruler(t, raw, ink) {
  const marks = [
    [1, '1'],
    [4.5, '4.5 AA'],
    [7, '7 AAA'],
    [21, '21'],
  ];
  const minor = Array.from({ length: 21 }, (_, i) => {
    const x = atRatio(i + 1);
    return `M${x} ${RULER.y}v${i % 5 === 0 ? 8 : 4}`;
  }).join('');
  const labels = marks
    .map(([r, s]) => `<text x="${atRatio(r)}" y="${RULER.y + 26}" text-anchor="middle">${s}</text>`)
    .join('');
  return `
<path class="rule" d="M${RULER.x} ${RULER.y}h${RULER.w}" stroke="${css(t.textSemi)}" stroke-width="1.5" pathLength="1"/>
<path class="ticks" d="${minor}" stroke="${css(t.textSemi)}"/>
<g class="ticks small">${labels}</g>
<g class="scan"><path d="M${RULER.x} ${RULER.y - 34}v46" stroke="${css(t.accent)}" stroke-width="1.5" opacity="0"/></g>
<g transform="translate(${atRatio(ink)} ${RULER.y})"><g class="mark">
  <path d="M-6-14h12l-6 9z" fill="${css(t.accent)}"/>
  <text class="small lb-raw" y="-42" text-anchor="middle">原色当字 ${ratioText(raw)}</text>
  <text class="small lb-ink" y="-22" text-anchor="middle">落墨 ${ratioText(ink)}</text></g></g>`;
}

function style(t, raw, ink) {
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const from = `transform:translateX(${r1(atRatio(raw) - atRatio(ink))}px)`;
  return `
text{font-family:${FONT_SANS}}
.small{font-size:13px;fill:${css(t.textSemi)}}
.word{font-size:88px;font-weight:600;letter-spacing:-2px;fill:${css(t.text)}}
.ink{animation:ink 1.4s ease-out both}
.pt{opacity:.8;mix-blend-mode:${t.blend};transform-box:fill-box;transform-origin:50% 100%;animation:unfurl 1.3s ${ease} both}
.bloom{transform-origin:${C.x}px ${C.y}px;animation:spin 140s linear 1.6s infinite}
.ring{transform-origin:${C.x}px ${C.y}px;animation:spin 90s linear infinite reverse}
.arcs{transform-origin:${C.x}px ${C.y}px;animation:spin 220s linear infinite}
.halo{transform-box:fill-box;transform-origin:center;animation:breathe 4.8s ease-in-out 1.6s infinite}
.rule{stroke-dasharray:1;animation:draw 1.1s ${ease} 1.1s both}
.ticks{animation:fade .6s ease-out 1.8s both}
.mark{animation:slide 1.5s ${ease} 2.1s both}
.scan{animation:scan 9s ${ease} 3.6s infinite}
.lb-raw{opacity:1;animation:rawFinal 2.4s linear 1.5s both}
.lb-ink{opacity:1;animation:fade .5s ease-out 3.5s both}.tag{animation:fade .9s ease-out 2.6s both}
.tag2{animation:fade .9s ease-out 3s both}
.sig{animation:fade .9s ease-out 3.4s both}
${keyframes('unfurl', { from: 'opacity:0;transform:scale(.12) rotate(-28deg)', to: 'opacity:.8;transform:none' })}
${keyframes('ink', { '0%': `fill:${css(t.petal)};opacity:0`, '15%': `fill:${css(t.petal)};opacity:1`, '55%': `fill:${css(t.petal)}`, '100%': `fill:${css(t.text)}` })}
${keyframes('spin', { to: 'transform:rotate(360deg)' })}
${keyframes('breathe', { '0%,100%': 'transform:scale(1);opacity:1', '50%': 'transform:scale(1.6);opacity:.25' })}
${keyframes('draw', { from: 'stroke-dashoffset:1', to: 'stroke-dashoffset:0' })}
${keyframes('fade', { from: 'opacity:0' })}
${keyframes('slide', { from: `${from};opacity:0`, '12%': `${from};opacity:1`, to: 'transform:none' })}
${keyframes('scan', { '0%': `transform:translateX(0);opacity:0`, '8%': 'opacity:.9', '92%': 'opacity:.9', '100%': `transform:translateX(${RULER.w}px);opacity:0` })}
${keyframes('raw', { '0%,25%': 'opacity:0', '35%,70%': 'opacity:1', '85%,100%': 'opacity:0' })}
${keyframes('rawFinal', { '0%,25%': 'opacity:0', '35%,100%': 'opacity:1' })}`;
}

export function hero(t) {
  const ink = contrast(t.text, t.bg);
  const raw = contrast(t.petal, t.bg);
  const body = `
<rect width="${W}" height="${H}" rx="24" fill="${css(t.bg)}"/>
${backdrop(t)}
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="23.5" fill="none" stroke="${css(t.line)}"/>
${bloom(t)}
${wordmark(t)}
${ruler(t, raw, ink)}
<text class="tag" x="${RULER.x}" y="270" font-size="26" font-weight="500" fill="${css(t.text)}">把审美做成可验证的工程</text>
<text class="tag2" x="${RULER.x}" y="304" font-size="18" fill="${css(t.textSemi)}">Taste, made testable.</text>
<text class="sig" x="${RULER.x + RULER.w}" y="304" font-size="13" fill="${css(t.textSemi)}" text-anchor="end">webkubor.online</text>`;
  return frame({
    width: W,
    height: H,
    title: 'webkubor：把审美做成可验证的工程',
    desc: `六片 Bloom 莫兰迪花瓣在量环中展开；字标先以原色写出（对比度 ${ratioText(raw)}），再沉为墨色（${ratioText(ink)}），标尺标出 WCAG AA 与 AAA 门槛。`,
    style: style(t, raw, ink),
    body,
  });
}
