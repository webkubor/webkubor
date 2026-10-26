// 产物清单：每个面板 × 明暗两套，文件名即 README 里引用的路径。
// logo 墙不在这里 —— 它是浏览器截图产物（scripts/build-logowall.mjs），
// 不是 SVG 面板：logo 原图直接进浏览器渲染，转 SVG 会丢 fill="none" 等
// 根元素继承属性，描边型 logo 会糊成实心黑块。

import { theme } from './tokens.mjs';
import { hero } from './hero.mjs';
import { palette } from './palette.mjs';
import { agent } from './agent.mjs';

const PANELS = { hero, bloom: palette, agent };

/** @returns {Array<{ file: string, svg: string }>} */
export function renderAll() {
  return ['light', 'dark'].flatMap((mode) => {
    const t = theme(mode);
    return Object.entries(PANELS).map(([name, draw]) => ({
      file: `assets/${name}-${mode}.svg`,
      svg: draw(t),
    }));
  });
}
