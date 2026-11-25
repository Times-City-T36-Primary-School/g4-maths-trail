/* the shared parts: sign-in, guide, trophies, progress code, the Summit (final test filled with the keys), certificate */
const { chromium } = require('playwright'); const path = require('path');
(async () => { const W = +(process.env.W || 390), H = +(process.env.H || 800), S = process.env.SHOTS || 'shots/shared';
  require('fs').mkdirSync(S, { recursive: true });
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: H }, colorScheme: process.env.DARK ? 'dark' : 'light' }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const shot = async n => p.screenshot({ path: S + '/' + n + '.png' });
  const txt = async () => (await p.evaluate(() => document.body.innerText)).replace(/\n+/g, ' | ');
  await p.goto('file://' + path.resolve('dist/index.html')); await p.waitForTimeout(700); await shot('01-start');
  // the guide card on the start screen
  const g = p.getByText(/Teachers and families/).first(); if (await g.count()) { await g.click(); await p.waitForTimeout(500); await shot('02-guide-teachers'); console.log('GUIDE', (await txt()).slice(0, 500)); await p.keyboard.press('Escape'); await p.waitForTimeout(300); const c = p.locator('[aria-label="Close"], .sheet__close, .dialog__close').first(); if (await c.count()) await c.click().catch(() => {}); await p.waitForTimeout(300); }
  await p.getByText('4B05', { exact: true }).click(); await p.locator('input').first().fill('Test Child A'); await p.getByText('Start my trail').click(); await p.waitForTimeout(1500);
  await shot('03-map');
  for (const h of ['how-to', 'trophies']) { await p.evaluate(x => { location.hash = x; }, h); await p.waitForTimeout(1200); await shot('04-' + h); console.log(h.toUpperCase(), (await txt()).slice(0, 400)); }
  // a finished step and a test mark, then the progress code round trip
  const code = await p.evaluate(() => { T.progress.saveUnit(3, 'words', 'A', 3, 3); return T.progressCode.make(); }).catch(e => 'ERR ' + e.message);
  console.log('CODE', code, JSON.stringify(await p.evaluate(c => T.progressCode.read(c), code).catch(e => 'ERR ' + e.message)).slice(0, 200));
  // the Summit, opened by finishing 7 Mini tests (the store, as the test step saves it)
  await p.evaluate(() => { for (let n = 1; n <= 7; n++) { T.store.set(['stops', String(n), 'test'], { best: 8, plays: 1 }); T.progress.saveUnit(n, 'test', 'paper', 8, 10); } });
  await p.evaluate(() => { location.hash = 'summit'; }); await p.waitForTimeout(1300); await shot('05-summit'); console.log('SUMMIT', (await txt()).slice(0, 350));
  await p.evaluate(() => { location.hash = 'summit-test'; }); await p.waitForTimeout(1300); await shot('06-summit-intro');
  await p.locator('.actionbar .btn--primary').first().click(); await p.waitForTimeout(1500);
  for (let paper = 1; paper <= 2; paper++) {
    // answer every question with its key through the engine's own fill (blanks), picks and claims
    const filled = await p.evaluate(() => { let n = 0; document.querySelectorAll('.tp-q, .tp__q, [data-q]').forEach(() => n++); return n; });
    await shot('07-paper' + paper + '-blank'); console.log('PAPER', paper, 'question nodes', filled, (await txt()).slice(0, 200));
    for (let i = 0; i < 3; i++) { const btn = p.locator('.actionbar .btn--primary').first(); const l = (await btn.innerText()).trim(); if (!/Mark/.test(l)) break; await btn.click(); await p.waitForTimeout(1600); }
    await shot('08-paper' + paper + '-marked'); console.log('MARKED', paper, (await txt()).slice(0, 220));
    const nx = p.locator('.actionbar .btn--primary').first(); const l = (await nx.innerText()).trim(); console.log('next button:', l); await nx.click(); await p.waitForTimeout(1800);
  }
  await shot('09-summit-result'); console.log('RESULT', (await txt()).slice(0, 400));
  // the trophy and the certificate
  await p.evaluate(() => { T.store.set(['summit', 'test'], { best: 33, total: 40, won: true, plays: 1 }); T.store.set(['summit', 'trophy', 'on'], T.rewards.today()); location.hash = 'summit-cert'; }); await p.waitForTimeout(1500);
  await shot('10-cert'); console.log('CERT', (await txt()).slice(0, 400));
  await p.evaluate(() => { location.hash = 'summit-lightning'; }); await p.waitForTimeout(1000); await p.locator('.actionbar .btn--primary').first().click(); await p.waitForTimeout(4500); await shot('11-big-lightning'); console.log('BIG', (await txt()).slice(0, 250));
  console.log('ERRORS', errs.length, errs.slice(0, 6)); await b.close(); })();
