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

const PETAL = 'M0 0C-36-24-42-72 0-100C42-72 36-24 0 0Z';
const atRatio = (r) => r1(RULER.x + ((Math.min(r, 21) - 1) / 20) * RULER.w);

function bloom(t) {
  const petals = MORANDI.map(
    (m, i) =>
      `<g transform="translate(${C.x} ${C.y}) rotate(${i * 60})"><path class="pt" style="animation-delay:${(i * 0.1).toFixed(2)}s" d="${PETAL}" fill="${css(m.rgb)}"/></g>`,
  ).join('');
  const ticks = [0, 90, 180, 270]
    .map((a) => `<line transform="translate(${C.x} ${C.y}) rotate(${a})" x1="0" y1="-150" x2="0" y2="-140"/>`)
    .join('');
  return `
<g class="ring" fill="none" stroke="${css(t.textSemi, 0.45)}">
  <circle cx="${C.x}" cy="${C.y}" r="132" stroke-dasharray="1 7"/>
  <circle cx="${C.x}" cy="${C.y}" r="146" stroke-opacity=".5"/>
</g>
<g stroke="${css(t.textSemi, 0.6)}" stroke-width="1.5">${ticks}</g>
<g class="bloom">${petals}</g>
<circle class="halo" cx="${C.x}" cy="${C.y}" r="15" fill="none" stroke="${css(t.accent)}" stroke-width="1.5"/>
<circle cx="${C.x}" cy="${C.y}" r="5" fill="${css(t.accent)}"/>`;
}

function wordmark() {
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
<g transform="translate(${atRatio(ink)} ${RULER.y})"><g class="mark">
  <path d="M-6-14h12l-6 9z" fill="${css(t.accent)}"/>
  <text class="small lb-raw" y="-22" text-anchor="middle">原色当字 ${ratioText(raw)}</text>
  <text class="small lb-ink" y="-22" text-anchor="middle">落墨 ${ratioText(ink)}</text>
</g></g>`;
}

function style(t, raw, ink) {
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const from = `transform:translateX(${r1(atRatio(raw) - atRatio(ink))}px)`;
  return `
text{font-family:${FONT_SANS}}
.small{font-size:13px;fill:${css(t.textSemi)}}
.word{font-size:88px;font-weight:600;letter-spacing:-2px;fill:${css(t.text)}}
.ink{animation:ink 1.4s ease-out both}
.pt{opacity:.78;mix-blend-mode:${t.blend};transform-box:fill-box;transform-origin:50% 100%;animation:unfurl 1.3s ${ease} both}
.bloom{transform-origin:${C.x}px ${C.y}px;animation:spin 140s linear 1.6s infinite}
.ring{transform-origin:${C.x}px ${C.y}px;animation:spin 90s linear infinite reverse}
.halo{transform-box:fill-box;transform-origin:center;animation:breathe 4.8s ease-in-out 1.6s infinite}
.rule{stroke-dasharray:1;animation:draw 1.1s ${ease} 1.1s both}
.ticks{animation:fade .6s ease-out 1.8s both}
.mark{animation:slide 1.5s ${ease} 2.1s both}
.lb-raw{opacity:0;animation:raw 2.4s linear 1.5s both}
.lb-ink{animation:fade .5s ease-out 3.5s both}
.tag{animation:fade .9s ease-out 2.6s both}
.tag2{animation:fade .9s ease-out 3s both}
${keyframes('unfurl', { from: 'opacity:0;transform:scale(.12) rotate(-28deg)', to: 'opacity:.78;transform:none' })}
${keyframes('ink', { '0%': `fill:${css(t.petal)};opacity:0`, '15%': `fill:${css(t.petal)};opacity:1`, '55%': `fill:${css(t.petal)}`, '100%': `fill:${css(t.text)}` })}
${keyframes('spin', { to: 'transform:rotate(360deg)' })}
${keyframes('breathe', { '0%,100%': 'transform:scale(1);opacity:1', '50%': 'transform:scale(1.6);opacity:.25' })}
${keyframes('draw', { from: 'stroke-dashoffset:1', to: 'stroke-dashoffset:0' })}
${keyframes('fade', { from: 'opacity:0' })}
${keyframes('slide', { from: `${from};opacity:0`, '12%': `${from};opacity:1`, to: 'transform:none' })}
${keyframes('raw', { '0%,25%': 'opacity:0', '35%,70%': 'opacity:1', '85%,100%': 'opacity:0' })}`;
}

export function hero(t) {
  const ink = contrast(t.text, t.bg);
  const raw = contrast(t.petal, t.bg);
  const body = `
<rect width="${W}" height="${H}" rx="24" fill="${css(t.bg)}"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="23.5" fill="none" stroke="${css(t.line)}"/>
${bloom(t)}
${wordmark()}
${ruler(t, raw, ink)}
<text class="tag" x="${RULER.x}" y="270" font-size="26" font-weight="500" fill="${css(t.text)}">把审美做成可验证的工程</text>
<text class="tag2" x="${RULER.x}" y="304" font-size="18" fill="${css(t.textSemi)}">Taste, made testable.</text>`;
  return frame({
    width: W,
    height: H,
    title: 'webkubor：把审美做成可验证的工程',
    desc: `六片 Bloom 莫兰迪花瓣在量环中展开；字标先以原色写出（对比度 ${ratioText(raw)}），再沉为墨色（${ratioText(ink)}），标尺标出 WCAG AA 与 AAA 门槛。`,
    style: style(t, raw, ink),
    body,
  });
}
