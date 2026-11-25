/* opens the Mini Practice test of each stop, presses "Mark my paper" until the paper is marked, reports page errors */
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const stops = process.argv.slice(2).map(Number); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.resolve('dist/index.html')); await p.waitForTimeout(600);
  await p.getByText('4B05', { exact: true }).click(); await p.locator('input').first().fill('Test Child A'); await p.getByText('Start my trail').click(); await p.waitForTimeout(1200);
  for (const n of stops) {
    const before = errs.length; await p.evaluate(x => { location.hash = 'stop-' + x + '-test'; }, n); await p.waitForTimeout(1200);
    let label = '';
    for (let i = 0; i < 4; i++) { const btn = p.locator('.actionbar .btn--primary').first(); label = (await btn.innerText().catch(() => '')).trim(); if (!/Mark/.test(label)) break; await btn.click(); await p.waitForTimeout(1500); }
    await p.waitForTimeout(2500);
    const txt = await p.evaluate(() => document.querySelector('.screen').innerText);
    await p.screenshot({ path: 'shots/marked-' + n + '.png', fullPage: false });
    console.log('stop', n, '| button now:', JSON.stringify(label), '| marks:', (txt.match(/Marks[\s\S]{0,14}/) || [''])[0].replace(/\s+/g, ' '), '| new errors:', errs.slice(before).slice(0, 2));
  }
  await b.close();
})();
