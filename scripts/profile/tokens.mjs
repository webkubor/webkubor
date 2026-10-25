// 主页 SVG 的设计令牌：取自 typora-Bloom-theme 的 Petal 明暗主题（theme-src/root-petal*.css）。
// 规则沿用 Bloom 的「两条轨」：原色（--accent-rgb）只铺气氛，文字用解过亮度的色。

import { oklchToRgb, hex, solveLightness } from './color.mjs';

const ok = (L, C, H) => oklchToRgb(L / 100, C, H);

// 六套浅色主题的莫兰迪原色（--accent-rgb），按主题源码原样摘录
export const MORANDI = [
  { id: 'petal', name: 'Petal', zh: '花瓣', rgb: [232, 133, 155] },
  { id: 'sage', name: 'Sage', zh: '橄榄', rgb: [138, 154, 91] },
  { id: 'mist', name: 'Mist', zh: '雾蓝', rgb: [146, 168, 179] },
  { id: 'spring', name: 'Spring', zh: '薰衣草', rgb: [160, 115, 215] },
  { id: 'ripple', name: 'Ripple', zh: '湖青', rgb: [95, 168, 178] },
  { id: 'stone', name: 'Stone', zh: '岩灰', rgb: [180, 160, 155] },
];

const BASE = {
  light: {
    bg: ok(98, 0.01, 350),
    surface: ok(96, 0.015, 350),
    line: ok(90, 0.02, 350),
    text: ok(25, 0.02, 354),
    textSemi: ok(45, 0.02, 354),
    accent: ok(58, 0.22, 350),
    petal: [232, 133, 155],
    blend: 'multiply',
  },
  dark: {
    bg: ok(28, 0.02, 350),
    surface: ok(24, 0.02, 350),
    line: ok(40, 0.02, 350),
    text: ok(98, 0.01, 350),
    textSemi: ok(86, 0.02, 350),
    accent: ok(75, 0.18, 350),
    petal: [255, 170, 200],
    // screen 会把重叠处冲成奶白，深底上用普通叠加保住莫兰迪的灰度
    blend: 'normal',
  },
};

/** 在给定底色上为某个原色解出可读的文字色 */
const readable = (rgb, bg) => solveLightness(rgb, bg).rgb;

export function theme(mode) {
  const t = BASE[mode];
  const onSurface = (rgb) => readable(rgb, t.surface);
  return {
    mode,
    ...t,
    // 终端里的语义色：同样从莫兰迪原色出发、对终端底解亮度
    ok: onSurface(MORANDI[1].rgb),
    err: onSurface([215, 75, 75]),
    info: onSurface(MORANDI[4].rgb),
    hot: onSurface(t.petal),
  };
}

export const css = (rgb, alpha) =>
  alpha === undefined ? hex(rgb) : `rgba(${rgb.join(',')},${alpha})`;

export const FONT_SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";
export const FONT_MONO =
  "ui-monospace,'SF Mono',Menlo,Consolas,'PingFang SC','Microsoft YaHei',monospace";
