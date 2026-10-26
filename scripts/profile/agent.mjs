// Agent 面板：一次 401 从出现到被验证修好的全过程——Agent Eyes 收证据，agent 按证据修，
// 同一请求重放验证。右侧的状态球借 ai-orb 的表情语言，跟着终端走「在看 / 在想 / 在修 / 验证通过」，
// 终端下方的证据链时间轴把这四步的推进显性化。

import { css, FONT_SANS, FONT_MONO } from './tokens.mjs';
import { frame, keyframes, esc, r1 } from './svg.mjs';

const W = 1200;
const H = 420;
const LOOP = 16;
const TERM = { x: 40, y: 40, w: 780, h: 340 };
const ORB = { x: 1010, y: 180, r: 64 };
const TRACK = { x: TERM.x + 28, y: 348, w: TERM.w - 56 };
const pct = (s) => `${r1((s / LOOP) * 100)}%`;

// [角色, 正文, 结尾状态码或标记]
const LINES = [
  ['dev', 'GET /api/orders', ['err', '401']],
  ['eyes', '收到证据：请求、响应头、控制台、脱敏后的登录态'],
  ['agent', '读证据定位：本地登录 cookie 过期，代码没问题'],
  ['eyes', '本地 cookie 自修复完成，代码一行没动'],
  ['dev', 'GET /api/orders', ['ok', '200']],
  ['agent', '用同一请求复验通过，全程没靠猜', ['ok', '✓'], true],
];
const STEP = 1.6;
const lineAt = (i) => 0.4 + i * STEP;
const END = 14.8;

const PHASES = [
  ['在看', 0, lineAt(2)],
  ['在想', lineAt(2), lineAt(3)],
  ['在修', lineAt(3), lineAt(5)],
  ['验证通过', lineAt(5), END],
];

/** 在 [start, end) 秒内可见的透明度关键帧；end 等于 END 时随整轮淡出 */
function windowFrames(name, start, end) {
  const fade = 0.3;
  const stops = { '0%': 'opacity:0', [pct(start)]: 'opacity:0', [pct(start + fade)]: 'opacity:1', [pct(end)]: 'opacity:1', [pct(end + fade)]: 'opacity:0', '100%': 'opacity:0' };
  if (start === 0) Object.assign(stops, { '0%': 'opacity:1', [pct(start)]: 'opacity:1' });
  return keyframes(name, stops);
}

function terminal(t) {
  const dots = [t.petal, [180, 160, 155], [138, 154, 91]]
    .map((c, i) => `<circle cx="${TERM.x + 26 + i * 20}" cy="${TERM.y + 24}" r="5.5" fill="${css(c)}"/>`)
    .join('');
  const roleFill = { dev: t.textSemi, eyes: t.hot, agent: t.info };
  const rows = LINES.map(([role, msg, tail, lead], i) => {
    const mark = tail ? `<tspan fill="${css(t[tail[0]])}" font-weight="700">${esc(tail[1])}</tspan>` : '';
    const text = lead ? `${mark} ${esc(msg)}` : `${esc(msg)}${mark ? `  ${mark}` : ''}`;
    const y = TERM.y + 84 + i * 34;
    return `<g class="ln l${i}"><rect class="cur" x="${TERM.x + 14}" y="${y - 15}" width="2.5" height="19" rx="1.2" fill="${css(t.accent)}"/><text x="${TERM.x + 28}" y="${y}" fill="${css(roleFill[role])}" font-weight="600">${role}</text><text x="${TERM.x + 104}" y="${y}" xml:space="preserve">${text}</text></g>`;
  }).join('');
  return `
<defs>
  <filter id="tshadow" x="-6%" y="-10%" width="112%" height="126%">
    <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="${css(t.mode === 'light' ? [90, 70, 80] : [0, 0, 0], t.mode === 'light' ? 0.14 : 0.5)}"/>
  </filter>
</defs>
<rect x="${TERM.x}" y="${TERM.y}" width="${TERM.w}" height="${TERM.h}" rx="16" fill="${css(t.surface)}" stroke="${css(t.line)}" filter="url(#tshadow)"/>
${dots}
<text class="mono" x="${TERM.x + TERM.w / 2}" y="${TERM.y + 29}" text-anchor="middle" fill="${css(t.textSemi)}" font-size="18">localhost:5173  vite + agent-eyes</text>
<path d="M${TERM.x} ${TERM.y + 48}h${TERM.w}" stroke="${css(t.line)}"/>
<g class="mono" font-size="18" fill="${css(t.text)}">${rows}</g>`;
}

/** 证据链时间轴：四段推进 + 一个跑动的指针，把「在看→在想→在修→验证通过」显性化 */
function timeline(t) {
  const seg = TRACK.w / PHASES.length;
  const segs = PHASES.map(([label], i) => {
    const x = TRACK.x + i * seg;
    return `<g class="seg"><rect x="${r1(x + 3)}" y="${TRACK.y}" width="${r1(seg - 6)}" height="4" rx="2" fill="${css(t.textSemi, 0.22)}"/><text x="${r1(x + seg / 2)}" y="${TRACK.y + 20}" text-anchor="middle" font-size="18" fill="${css(t.textSemi)}">${label}</text></g>`;
  }).join('');
  return `
<g class="tl">
  ${segs}
  <rect class="fill" x="${TRACK.x}" y="${TRACK.y}" width="${TRACK.w}" height="4" rx="2" fill="${css(t.accent)}" opacity=".55"/>
  <circle class="head" cx="${TRACK.x + TRACK.w}" cy="${TRACK.y + 2}" r="5" fill="${css(t.accent)}"/>
</g>`;
}

function orb(t) {
  const eye = t.mode === 'light' ? t.text : t.bg;
  const state = PHASES.map(
    ([label], i) => `<text class="st p${i}" x="${ORB.x}" y="${ORB.y + 126}" text-anchor="middle">${label}</text>`,
  ).join('');
  return `
<defs>
  <radialGradient id="g" cx="38%" cy="32%" r="75%">
    <stop offset="0" stop-color="${css([255, 236, 241])}"/>
    <stop offset=".55" stop-color="${css(t.petal)}"/>
    <stop offset="1" stop-color="${css(t.hot)}"/>
  </radialGradient>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="${css(t.petal, 0.32)}"/>
    <stop offset=".6" stop-color="${css(t.petal, 0.1)}"/>
    <stop offset="1" stop-color="${css(t.petal, 0)}"/>
  </radialGradient>
</defs>
<circle cx="${ORB.x}" cy="${ORB.y}" r="${ORB.r + 62}" fill="url(#glow)"/>
<circle class="ring" cx="${ORB.x}" cy="${ORB.y}" r="${ORB.r + 18}" fill="none" stroke="${css(t.petal)}" stroke-width="2" stroke-dasharray="3 9"/>
<g class="bob">
  <circle cx="${ORB.x}" cy="${ORB.y}" r="${ORB.r}" fill="url(#g)"/>
  <g class="eyes" fill="${css(eye)}"><ellipse cx="${ORB.x - 20}" cy="${ORB.y - 4}" rx="6.5" ry="10"/><ellipse cx="${ORB.x + 20}" cy="${ORB.y - 4}" rx="6.5" ry="10"/></g>
</g>
<g class="badge"><circle cx="${ORB.x + 50}" cy="${ORB.y - 48}" r="15" fill="${css(t.ok)}"/><path d="M${ORB.x + 43} ${ORB.y - 48}l5 5 9-10" fill="none" stroke="${css(t.bg)}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>
${state}
<text x="${ORB.x}" y="${ORB.y + 170}" text-anchor="middle" font-size="18" fill="${css(t.textSemi)}">状态球来自 ai-orb</text>`;
}

function style(t) {
  const lines = LINES.map((_, i) => windowFrames(`l${i}`, lineAt(i), END) + `.l${i}{animation:l${i} ${LOOP}s linear infinite both}`);
  const phases = PHASES.map(([, a, b], i) => windowFrames(`p${i}`, a, b) + `.p${i}{animation:p${i} ${LOOP}s linear infinite both}`);
  return `
text{font-family:${FONT_SANS}}
.mono,.mono text{font-family:${FONT_MONO}}
.st{font-size:20px;font-weight:600;fill:${css(t.text)}}
.p0,.p1,.p2{opacity:0}
.p3{opacity:1}
.ring{transform-origin:${ORB.x}px ${ORB.y}px;animation:spin 6s linear infinite,work ${LOOP}s linear infinite both}
.bob{animation:bob 3.2s ease-in-out infinite}
.eyes ellipse{transform-box:fill-box;transform-origin:center;animation:blink 4s ease-in-out infinite}
.badge{transform-box:fill-box;transform-origin:center;animation:badge ${LOOP}s ease-out infinite both}
.cur{opacity:1;animation:caret 1.05s steps(2,end) infinite}
.tl .fill{transform-box:fill-box;transform-origin:left center;animation:fill ${LOOP}s linear infinite both}
.tl .head{transform-box:fill-box;transform-origin:center;animation:head ${LOOP}s linear infinite both}
.tl .seg text{opacity:.75}
${lines.join('')}
${phases.join('')}
${keyframes('spin', { to: 'transform:rotate(360deg)' })}
${keyframes('work', { '0%': 'opacity:0', [pct(lineAt(2))]: 'opacity:0', [pct(lineAt(2) + 0.4)]: 'opacity:1', [pct(lineAt(5))]: 'opacity:1', [pct(lineAt(5) + 0.4)]: 'opacity:0', '100%': 'opacity:0' })}
${keyframes('bob', { '0%,100%': 'transform:translateY(0)', '50%': 'transform:translateY(-6px)' })}
${keyframes('blink', { '0%,44%,52%,100%': 'transform:scaleY(1)', '48%': 'transform:scaleY(.1)' })}
${keyframes('caret', { '0%,49%': 'opacity:1', '50%,100%': 'opacity:.15' })}
${keyframes('fill', { '0%': 'transform:scaleX(0)', [pct(lineAt(5) + 0.6)]: 'transform:scaleX(1)', '100%': 'transform:scaleX(1)' })}
${keyframes('head', { '0%': `transform:translateX(${-TRACK.w}px);opacity:0`, '3%': 'opacity:1', [pct(lineAt(5) + 0.6)]: 'transform:translateX(0);opacity:1', [pct(lineAt(5) + 0.8)]: 'opacity:0', '100%': 'transform:translateX(0);opacity:0' })}
${keyframes('badge', { '0%': 'opacity:0;transform:scale(.4)', [pct(lineAt(5))]: 'opacity:0;transform:scale(.4)', [pct(lineAt(5) + 0.35)]: 'opacity:1;transform:scale(1.12)', [pct(lineAt(5) + 0.6)]: 'opacity:1;transform:none', [pct(END)]: 'opacity:1;transform:none', [pct(END + 0.3)]: 'opacity:0;transform:none', '100%': 'opacity:0' })}`;
}

export function agent(t) {
  const body = `
<rect width="${W}" height="${H}" rx="24" fill="${css(t.bg)}"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="23.5" fill="none" stroke="${css(t.line)}"/>
${terminal(t)}
${timeline(t)}
${orb(t)}`;
  return frame({
    width: W,
    height: H,
    title: 'Agent Eyes：一次 401 从出现到被验证修好',
    desc: `终端依次出现：${LINES.map(([role, msg, tail]) => `${role} ${msg}${tail ? ` ${tail[1]}` : ''}`).join('；')}。右侧状态球依次显示在看、在想、在修、验证通过；下方时间轴显示这四步的推进。`,
    style: style(t),
    body,
  });
}
