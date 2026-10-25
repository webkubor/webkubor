#!/usr/bin/env node
// 生成主页动效 SVG：node scripts/build-profile.mjs
// 改了 scripts/profile/ 下任何东西都要重跑，再用 check-profile.mjs 验收。

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAll } from './profile/render.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

for (const { file, svg } of renderAll()) {
  writeFileSync(join(root, file), svg);
  console.log(`${file}  ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
}
