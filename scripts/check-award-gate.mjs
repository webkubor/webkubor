#!/usr/bin/env node
/**
 * 获奖级创意 UI 门禁（award-creative-ui 规则的可执行部分）：node scripts/check-award-gate.mjs
 *
 * 规则来源：~/.agents/skills/award-creative-ui/SKILL.md
 * 只落地「能机械判定」的四条，纯主观的设计评分不写成门禁（避免假绿）：
 *
 *   1. 动效赋义与物理真实性 —— 缓动必须是自然阻尼，禁机械 linear
 *   2. 前庭神经安全 —— 减弱动效必须 100% 覆盖，且不能有无限自转/漂浮位移
 *   3. 性能预算 —— 动画属性限 transform/opacity/fill/stroke-dashoffset（SVG 内无盒模型重排）
 *   4. 渲染后可读性 —— 按 GitHub README 内容区实际宽度折算后，最小字号不得低于 12px
 *
 * 不落地（需要人眼判断，写成门禁只会假绿）：
 *   - 叙事聚焦（5 秒法则）、留白比例、视觉秩序、克制度
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const fail = (msg) => failures.push(msg);

// GitHub README 内容区在 1280 宽视口下约 846px；SVG 以 viewBox 1200 铺满 → 缩放系数
const GITHUB_CONTENT_WIDTH = 846;
const VIEWBOX_WIDTH = 1200;
const SCALE = GITHUB_CONTENT_WIDTH / VIEWBOX_WIDTH;
const MIN_RENDERED_PX = 12; // 折算后的最小可读字号

// 允许的动画属性：SVG 内这些都不会触发 layout reflow
const ALLOWED_PROPS = new Set([
  'transform',
  'opacity',
  'fill',
  'stop-color',
  'stroke',
  'stroke-dashoffset',
  'stroke-width',
]);

/** 一路动画都必须用的自然阻尼缓动 */
const NATURAL_EASINGS = /cubic-bezier\([^)]*\)|ease-in-out|ease-out|ease-in-out-back/;

const files = ['hero', 'agent', 'bloom'];

for (const name of files) {
  for (const mode of ['light', 'dark']) {
    const file = `assets/${name}-${mode}.svg`;
    const svg = readFileSync(join(root, file), 'utf8');

    // ── 1. 物理真实性：入场动画不能用 linear ─────────────────────────
    //    循环动画（infinite）用 linear 是合理的（匀速自转/扫描），只查一次性动画。
    //    注意 `animation:l0 16s linear infinite both` 里 infinite 在 both 之前，
    //    所以必须先把 infinite 的动画整条排除，再谈 both/forwards。
    const oneShot = [...svg.matchAll(/animation:\s*([\w-]+)\s+([\d.]+s)\s+([^;}]*)/g)].filter(
      ([, , , timing]) => !/\binfinite\b/.test(timing),
    );
    for (const [, animName, , timing] of oneShot) {
      const easing = timing.trim().split(/\s+/)[0] || '';
      if (easing === 'linear') {
        fail(`${file}: 一次性动画 ${animName} 用了 linear 机械过渡，应换自然阻尼缓动`);
      }
    }

    // ── 2. 前庭神经安全：减弱动效必须 100% 覆盖 ──────────────────────
    if (!svg.includes('prefers-reduced-motion:reduce')) {
      fail(`${file}: 缺 prefers-reduced-motion 规则`);
    }
    const reducedRule = svg.match(/@media\s*\(prefers-reduced-motion:reduce\)\s*\{([^}]*)\}/);
    if (reducedRule && !/animation:\s*none\s*!important/.test(reducedRule[1])) {
      fail(`${file}: 减弱动效规则没有把 animation 置 none!important`);
    }

    // 无限自转 / 漂浮位移：减弱动效必须能停掉
    const infiniteSpin = [...svg.matchAll(/animation:\s*[\w-]+[^;}]*infinite/g)];
    if (infiniteSpin.length && (!reducedRule || !/animation:\s*none\s*!important/.test(reducedRule[1]))) {
      fail(`${file}: 有 ${infiniteSpin.length} 条无限动画但减弱动效没有停掉它们`);
    }

    // ── 3. 性能预算：动画属性白名单 ────────────────────────────────
    const keyframeBlocks = [...svg.matchAll(/@keyframes\s+[\w-]+\s*\{([^}]*)\}/g)];
    for (const [, block] of keyframeBlocks) {
      for (const m of block.matchAll(/([a-z-]+)\s*:/g)) {
        const prop = m[1];
        if (!ALLOWED_PROPS.has(prop)) {
          fail(`${file}: 关键帧里出现不在白名单的动画属性 ${prop}（只允许 ${[...ALLOWED_PROPS].join('/')}）`);
        }
      }
    }

    // ── 4. 渲染后可读性：折算后的最小字号 ───────────────────────────
    //    font-size 有两种写法（CSS 声明 / 元素属性），必须都查，
    //    否则写在属性上的小字会整个漏过门禁。
    const cssSizes = [...svg.matchAll(/font-size:\s*([\d.]+)px/g)].map((m) => Number(m[1]));
    const attrSizes = [...svg.matchAll(/font-size="([\d.]+)"/g)].map((m) => Number(m[1]));
    const sizes = [...cssSizes, ...attrSizes];
    if (!sizes.length) {
      fail(`${file}: 没有任何字号声明，无法保证可读性`);
    }
    const min = Math.min(...sizes);
    const rendered = min * SCALE;
    if (rendered < MIN_RENDERED_PX) {
      const where = attrSizes.length && Math.min(...attrSizes) === min ? '（写在元素属性上）' : '';
      fail(
        `${file}: 最小字号 ${min}px${where} 在 GitHub 实际渲染（${GITHUB_CONTENT_WIDTH}px 宽，缩放 ${SCALE.toFixed(3)}）下只有 ${rendered.toFixed(1)}px，低于 ${MIN_RENDERED_PX}px 可读下限`,
      );
    }
  }
}

if (failures.length) {
  console.error(failures.map((f) => `✗ ${f}`).join('\n'));
  process.exit(1);
}
console.log(
  `✓ 获奖级门禁通过：${files.length * 2} 张面板的缓动、减弱动效覆盖、动画属性白名单与渲染后字号全部达标`,
);
