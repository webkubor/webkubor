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
const data = JSON.parse(readFileSync(join(root, 'data', 'projects.json'), 'utf8'));
const OWNER = 'webkubor';
// 项目可能已经迁到组织名下（supercli-site / cortexos-dev），主页要显示它们的真实 star 与推送时间，
// 所以采集范围是「本人 + 主页引用到的组织仓库」，key 统一写成 owner/repo 全名。
const OWNERS = data.owners || [OWNER];
const PROFILE_OWNER = data.profileOwner || OWNER;
const PROFILE_REPO = 'webkubor';

/** 主页真正露脸的项目全名（组内 + 代表作 + skills + 清单），组织仓只收这些 */
function referencedRepos() {
  const names = new Set();
  const ownerOf = (name) => data.projects?.[name]?.owner || OWNER;
  const listed = [
    ...data.groups.flatMap((g) => g.projects),
    ...data.featured.projects,
    ...data.skills.projects,
  ];
  for (const name of listed) names.add(`${ownerOf(name)}/${name}`);
  for (const entry of data.extras?.projects || []) {
    names.add(`${entry.owner || OWNER}/${entry.repo}`);
  }
  return names;
}

/** 调 gh CLI 拿 JSON；失败时把 stderr 原样抛出，不做静默兜底 */
function gh(args) {
  const out = execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  return JSON.parse(out);
}

/** 外部组织仓逐个读公开接口：CI 的 GITHUB_TOKEN 只装了本仓，list 不了别人的组织 */
function ghRepo(owner, name) {
  const r = gh(['api', `repos/${owner}/${name}`]);
  return {
    name: r.name,
    stargazerCount: r.stargazer_count,
    pushedAt: r.pushed_at,
    description: r.description || '',
    isArchived: !!r.archived,
    isFork: !!r.fork,
  };
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
  const referenced = referencedRepos();
  const stars = {};
  const live = [];
  const personal = [];

  for (const owner of OWNERS) {
    const repos = owner === PROFILE_OWNER
      ? gh([
        'repo', 'list', owner, '--limit', '200',
        '--json', 'name,stargazerCount,pushedAt,description,isArchived,isFork',
      ])
      : [...referenced]
        .filter((full) => full.startsWith(`${owner}/`))
        .map((full) => ghRepo(owner, full.slice(owner.length + 1)));
    // 归档与 fork 不进主页数据：fork 的 star 不代表本人作品
    for (const r of repos.filter((x) => !x.isArchived && !x.isFork)) {
      const full = `${owner}/${r.name}`;
      // 组织仓只收主页引用到的：同组织里别人的仓库不算本人的项目
      if (owner !== PROFILE_OWNER && !referenced.has(full)) continue;
      stars[full] = r.stargazerCount;
      const entry = {
        owner,
        name: r.name,
        stars: r.stargazerCount,
        pushedAt: r.pushedAt,
        description: r.description || '',
      };
      live.push(entry);
      if (owner === PROFILE_OWNER) personal.push(entry);
    }
  }

  const recent = live
    .filter((r) => r.pushedAt)
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))
    .slice(0, 8)
    .map((r) => ({ ...r, pushedAt: r.pushedAt.slice(0, 10) }));

  const lastCommit = gh(['api', `repos/${OWNER}/${PROFILE_REPO}/commits?per_page=1`])[0];

  const payload = {
    // syncedAt 只用于本地排查，不写进产物：它每次都变，会让 CI 推完又触发自己，无限循环
    totals: {
      publicRepos: personal.length,
      stars: personal.reduce((s, r) => s + r.stars, 0),
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
