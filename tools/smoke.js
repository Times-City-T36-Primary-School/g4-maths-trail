const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + process.argv[2] + (process.argv[3] || '')); await p.waitForTimeout(1500);
  await p.screenshot({ path: process.argv[4] || '/tmp/claude-0/-home-user/06a7b5e7-9956-5cd4-8b1a-4427ed171f28/scratchpad/shot.png' });
  console.log('errors:', errs.length, errs.slice(0, 5)); console.log((await p.evaluate(() => document.body.innerText)).slice(0, 400));
  await b.close();
})();
