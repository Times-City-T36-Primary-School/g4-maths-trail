const { chromium } = require('playwright');
const path=require('path');const FILE=path.resolve(process.env.FILE||'dist/index.html');const S=(process.env.SHOTS||path.resolve('shots'))+'/';require('fs').mkdirSync(S,{recursive:true});const W=+(process.env.W||390),H=+(process.env.H||800);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: H } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://'+FILE); await p.waitForTimeout(800);
  await p.getByText('4B05', { exact: true }).click(); await p.locator('input').first().fill('Test Child A'); await p.getByText('Start my trail').click();
  await p.waitForTimeout(1800); await p.screenshot({ path: S + 'home.png' });
  for (const h of (process.argv.slice(2).length ? process.argv.slice(2) : ['stop-1'])) {
    await p.evaluate(x => { location.hash = x; }, h); await p.waitForTimeout(1500);
    await p.screenshot({ path: S + h + '.png' });
    console.log('---', h, (await p.evaluate(() => document.body.innerText)).replace(/\n+/g, ' | ').slice(0, 500));
  }
  console.log('errors:', errs.length, errs.slice(0, 6)); await b.close();
})();
