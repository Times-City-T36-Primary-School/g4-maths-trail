/* the "Go to" button: every screen has it, the sheet lists the map, 9 stops and the Summit, and each jump lands right */
const { chromium } = require('playwright'); const path = require('path');
(async () => { const W = +(process.env.W || 390), H = +(process.env.H || 800), S = process.env.SHOTS || 'shots/nav'; require('fs').mkdirSync(S, { recursive: true });
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: H }, colorScheme: process.env.DARK ? 'dark' : 'light' }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve('dist/index.html')); await p.waitForTimeout(600);
  await p.getByText('4B05', { exact: true }).click(); await p.locator('input').first().fill('Nav Child'); await p.getByText('Start my trail').click(); await p.waitForTimeout(1200);
  const routes = []; for (let n = 1; n <= 9; n++) ['', '-words', '-see', '-practise', '-notes', '-test', '-lightning', '-selfcheck'].forEach(s => routes.push('stop-' + n + s));
  routes.push('summit', 'summit-test', 'summit-lightning', 'how-to', 'trophies');
  const missing = [];
  for (const r of routes) { await p.evaluate(x => { location.hash = x; }, r); await p.waitForTimeout(450); const n = await p.locator('.g4nav-btn:visible').count(); if (n !== 1) missing.push(r + ':' + n); }
  console.log('screens checked', routes.length, '| without exactly one button:', missing.join(' ') || 'none');
  // deep inside a game: open Practise, start a game, then jump to Stop 7
  const hop = async (from, pickText, expect, shot) => {
    await p.evaluate(x => { location.hash = x; }, from); await p.waitForTimeout(900);
    if (from.endsWith('practise')) { await p.locator('.actionbar .btn--primary').first().click(); await p.waitForTimeout(1500); }
    await p.locator('.g4nav-btn:visible').first().click(); await p.waitForTimeout(600);
    if (shot) await p.screenshot({ path: S + '/' + shot + '.png' });
    const rows = await p.locator('.g4nav__row').count(); const here = (await p.locator('.g4nav__row.is-here').allInnerTexts()).join(' / ').replace(/\n/g, ' ');
    await p.locator('.g4nav__row', { hasText: pickText }).first().click(); await p.waitForTimeout(1200);
    const at = await p.evaluate(() => location.hash); const leftover = await p.locator('.overlay, .stage').count();
    console.log(from, '→', pickText, '| rows', rows, '| here:', here.slice(0, 60), '| landed', at, at === '#' + expect ? 'OK' : 'WRONG', '| stage/overlay left:', leftover);
  };
  await hop('stop-3-practise', 'Triangles and symmetry', 'stop-7', 'sheet-from-game');
  await hop('stop-5-test', 'The trail map', 'home', 'sheet-from-test');
  await hop('stop-8-see', 'The Summit', 'summit', null);
  await hop('stop-2', 'Mode and median', 'stop-9', 'sheet-from-hub');
  await hop('summit', 'Decimals and place value', 'stop-1', null);
  await p.evaluate(() => { location.hash = 'stop-6-practise'; }); await p.waitForTimeout(800); await p.screenshot({ path: S + '/topbar.png' });
  console.log('ERRORS', errs.length, errs.slice(0, 4)); await b.close(); })();
