#!/usr/bin/env node
/**
 * 主页数据同步：把 GitHub 实时状态拉进 data/recent.json。
 *
 * 职责：主页「最近在做什么」与每个项目的 star / 最近更新时间的唯一真源。
 * 只读 GitHub，不改任何远端状态；用 gh CLI 拉数据（不手写 HTTP 请求）。
 *
 * 产物：data/recent.json
 *   totals  — 公开项目数 / 总 star / 近 30 天提交数 / 最近一次提交时间
 *   recent  — 最近有推送的项目（按 pushedAt 倒序）
 *   stars   — 每个仓库的 star 数
 *
 * 用法：node scripts/sync-data.mjs
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'data', 'recent.json');
const OWNER = 'webkubor';
const PROFILE_REPO = 'webkubor';

/** 调 gh CLI 拿 JSON；失败时把 stderr 原样抛出，不做静默兜底 */
function gh(args) {
  const out = execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  return JSON.parse(out);
}

/** 近 30 天内的提交数（只看自己的主页仓，与仓库简介口径一致） */
function commits30d() {
  const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const out = execFileSync(
    'gh',
    ['api', `repos/${OWNER}/${PROFILE_REPO}/commits?author=${OWNER}&since=${since}&per_page=100`],
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
  );
  return JSON.parse(out).length;
}

function main() {
  const repos = gh(['repo', 'list', OWNER, '--limit', '100', '--json', 'name,stargazerCount,pushedAt,description,isArchived,isFork']);

  // 归档与 fork 不进主页数据：fork 的 star 不代表本人作品
  const live = repos.filter((r) => !r.isArchived && !r.isFork);

  const stars = {};
  for (const r of live) stars[r.name] = r.stargazerCount;

  const recent = [...live]
    .filter((r) => r.pushedAt)
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))
    .slice(0, 8)
    .map((r) => ({
      name: r.name,
      stars: r.stargazerCount,
      pushedAt: r.pushedAt.slice(0, 10),
      description: r.description || '',
    }));

  const lastCommit = gh(['api', `repos/${OWNER}/${PROFILE_REPO}/commits?per_page=1`])[0];

  const payload = {
    // syncedAt 只用于本地排查，不写进产物：它每次都变，会让 CI 推完又触发自己，无限循环
    totals: {
      publicRepos: live.length,
      stars: live.reduce((s, r) => s + r.stargazerCount, 0),
      commits30d: commits30d(),
      lastCommit: lastCommit?.commit?.committer?.date?.slice(0, 10) || null,
    },
    recent,
    stars,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(
    `data/recent.json 已更新：${payload.totals.publicRepos} 个项目 / ${payload.totals.stars} star / 近 30 天 ${payload.totals.commits30d} 次提交`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error('同步失败：', err.stderr?.toString?.() || err.message);
    if (existsSync(OUT)) console.error('（保留现有 data/recent.json 未动）');
    process.exit(1);
  }
}
