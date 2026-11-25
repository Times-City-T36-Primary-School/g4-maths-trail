const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.resolve('dist/index.html')); await p.waitForTimeout(500);
  console.log(await p.evaluate(() => { let ok = 0, fail = 0, bad = []; const los = {}; let strands = { N: 0, G: 0, S: 0 }, tot = 0;
    for (let s = 1; s <= 200; s++) { const pl = T.summit.plan(T.packs, { seed: s * 2654435761 >>> 0 }); if (!pl) { fail++; continue; }
      const why = T.summit.check ? T.summit.check(pl) : ''; if (why) { bad.push(why); continue; } ok++;
      pl.papers.forEach(pp => pp.forEach(q => { strands[q.strand] += q.marks; tot += q.marks; q.lo.forEach(c => los[c] = 1); }));
      pl.papers.forEach(pp => pp.forEach(q => { MX.make(T.packs[q.s].test.items[q.i].v[q.v], 'your'); })); }
    return 'plans ok ' + ok + ', failed ' + fail + ', broke rules ' + bad.length + ' ' + bad.slice(0, 3) + ' | objectives seen ' + Object.keys(los).length + '/' + Object.keys(T.OBJECTIVES).length +
      ' | strand % N ' + (100 * strands.N / tot).toFixed(1) + ' G ' + (100 * strands.G / tot).toFixed(1) + ' S ' + (100 * strands.S / tot).toFixed(1); }));
  console.log('errors', errs); await b.close(); })();
