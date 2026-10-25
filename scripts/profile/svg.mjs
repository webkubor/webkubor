// SVG 外壳：GitHub 以 <img> 渲染主页 SVG，只认内联 CSS 动画，不跑脚本、不加载外部字体。
// 约定：元素的「静止样式」就是动画终态，减弱动效时直接停在终态。

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const REDUCED = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}';

export function frame({ width, height, title, desc, style, body }) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t d">`,
    `<title id="t">${esc(title)}</title>`,
    `<desc id="d">${esc(desc)}</desc>`,
    `<style>${style.trim().replace(/\s*\n\s*/g, '')}${REDUCED}</style>`,
    body.trim(),
    '</svg>',
    '',
  ].join('\n');
}

/** 一段关键帧：stops 形如 { '0%,20%': 'opacity:0', '30%,100%': 'opacity:1' } */
export const keyframes = (name, stops) =>
  `@keyframes ${name}{${Object.entries(stops)
    .map(([at, decl]) => `${at}{${decl}}`)
    .join('')}}`;

export const r1 = (n) => Math.round(n * 10) / 10;
