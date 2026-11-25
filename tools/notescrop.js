const { chromium } = require('playwright'); const path = require('path');
(async () => { const W = +(process.env.W || 390), H = +(process.env.H || 800);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.resolve('dist/index.html')); await p.waitForTimeout(500);
  await p.getByText('4B05', { exact: true }).click(); await p.locator('input').first().fill('Test Child A'); await p.getByText('Start my trail').click(); await p.waitForTimeout(1000);
  for (let n = 1; n <= 9; n++) { await p.evaluate(x => { location.hash = 'stop-' + x + '-notes'; }, n); await p.waitForTimeout(900); const out = [];
    for (let i = 0; i < 6; i++) {
      const m = await p.evaluate(() => { const box = document.querySelector('.nt-pic--tool'); if (!box) return 'nopic'; const r = box.getBoundingClientRect(); let over = 0; box.querySelectorAll(':scope > *').forEach(c => { const q = c.getBoundingClientRect(); over = Math.max(over, r.top - q.top, q.bottom - r.bottom, r.left - q.left, q.right - r.right); }); return Math.round(over) + '/' + Math.round(r.height); });
      out.push(m); if (typeof m === 'string' && parseInt(m) > 6) await p.screenshot({ path: 'shots/crop-' + n + '-' + (i + 1) + '-' + W + '.png' });
      const btn = p.locator('.actionbar .btn--primary').first(); if (!/Next/.test(await btn.innerText().catch(() => ''))) break; await btn.click(); await p.waitForTimeout(500); }
    console.log('stop', n, out.join('  ')); }
  console.log('errors', errs.length); await b.close(); })();
