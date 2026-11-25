// 产物清单：主页只保留 1 张 Hero 头图（明暗两套），保持首屏克制聚焦。
import { theme } from './tokens.mjs';
import { hero } from './hero.mjs';

const PANELS = { hero };

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
