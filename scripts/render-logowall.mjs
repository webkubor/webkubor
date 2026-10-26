// logo 墙渲染脚本（由 scripts/build-logowall.mjs 通过 ego-browser nodejs 执行）。
// 把 logowall-template.html 按明暗两套渲染并截图，输出路径以 SHOTS 开头打印。

const task = await taskSpace('logowall-render');
const page = task.page('p1');

const shots = [];
for (const theme of ['light', 'dark']) {
  await page.goto('http://127.0.0.1:8766/scripts/profile/logowall-template.html');
  await page.waitForTimeout(600);
  await page.evaluate((t) => {
    document.body.classList.toggle('theme-dark', t === 'dark');
  }, theme);
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.cell img')].every((i) => i.complete && i.naturalWidth > 0),
  );
  await page.waitForTimeout(300);
  const path = `/tmp/logowall-${theme}.png`;
  await page.screenshot({ path, clip: { x: 0, y: 0, width: 1200, height: 380 } });
  shots.push({ theme, path });
}

console.log('SHOTS ' + JSON.stringify(shots));
