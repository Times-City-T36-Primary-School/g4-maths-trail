const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = [];
  async function child(name) { const c = await b.newContext(); const p = await c.newPage(); p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + path.resolve('dist/index.html')); await p.waitForTimeout(600);
    await p.getByText('4B05', { exact: true }).click(); await p.locator('input').first().fill(name); await p.getByText('Start my trail').click(); await p.waitForTimeout(1200); return p; }
  const a = await child('Code Child A');
  const before = await a.evaluate(() => { const set = (n, step, frac) => T.progress.units(n, step).forEach(id => { const m = 10; T.progress.saveUnit(n, step, id, Math.round(m * frac), m); });
    for (let n = 1; n <= 9; n++) { set(n, 'words', 1); set(n, 'notes', n % 2 ? 0.8 : 0.5); if (n < 8) set(n, 'practise', 0.95); if (n === 4) set(n, 'see', 1); T.progress.saveUnit(n, 'test', 'paper', n, 10); }
    const s = []; for (let n = 1; n <= 9; n++) s.push(T.STEPS.map(x => T.progress.stepStars(n, x.id)).join('') + '/' + (T.progress.unit(n, 'test', 'paper') || {}).score); return { code: T.progressCode.make(), s: s.join(' ') }; });
  const bb = await child('Code Child A');                // another device, the same name
  const after = await bb.evaluate(c => { const r = T.progressCode.apply(c); const s = []; for (let n = 1; n <= 9; n++) s.push(T.STEPS.map(x => T.progress.stepStars(n, x.id)).join('') + '/' + (T.progress.unit(n, 'test', 'paper') || {}).score); return { ok: r.ok, s: s.join(' ') }; }, before.code);
  console.log('code', before.code); console.log('before', before.s); console.log('after ', after.s, after.ok); console.log('same:', before.s === after.s, 'errors', errs); await b.close(); })();
