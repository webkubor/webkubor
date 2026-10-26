// 产物清单：每个面板 × 明暗两套，文件名即 README 里引用的路径。

import { theme } from './tokens.mjs';
import { hero } from './hero.mjs';
import { palette } from './palette.mjs';
import { agent } from './agent.mjs';
import { logowall } from './logowall.mjs';

const PANELS = { hero, logowall, bloom: palette, agent };

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
