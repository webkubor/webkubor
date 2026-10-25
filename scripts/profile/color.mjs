// OKLCH ↔ sRGB 与 WCAG 对比度计算。
// 主页动效里出现的每个对比度数字都由这里算出，不手填。

const toLinear = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const toGamma = (v) => {
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, c)) * 255);
};

/** oklch(L 0..1, C, H 度) → [r, g, b]，超出色域时逐通道裁切 */
export function oklchToRgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** [r, g, b] → { L, C, H } */
export function rgbToOklch([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const H = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { L, C: Math.hypot(A, B), H };
}

export const hex = (rgb) => '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');

export function luminance(rgb) {
  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** 截断而不是四舍五入：4.49 不能显示成 4.5 */
export const ratioText = (r) => `${Math.floor(r * 10) / 10}:1`;

/**
 * 保留色相与彩度，只解亮度，直到对已有背景的对比度 ≥ target。
 * 浅底往暗处找最亮的解，深底往亮处找最暗的解——离原色最近。
 */
export function solveLightness(rgb, bg, target = 4.5) {
  const { L, C, H } = rgbToOklch(rgb);
  if (contrast(rgb, bg) >= target) return { rgb, L, changed: false };
  const darken = luminance(bg) > 0.18;
  let [lo, hi] = darken ? [0, L] : [L, 1];
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const ok = contrast(oklchToRgb(mid, C, H), bg) >= target;
    if (darken === ok) lo = mid;
    else hi = mid;
  }
  const solvedL = darken ? lo : hi;
  return { rgb: oklchToRgb(solvedL, C, H), L: solvedL, changed: true };
}
