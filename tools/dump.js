/* tools/dump.js - every word a child sees in one stop, as plain text, with the answer keys: for a human or agent review.
   node tools/dump.js dist/index.html N > review/sN.txt */
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const file = path.resolve(process.argv[2] || 'dist/index.html'), n = Number(process.argv[3]);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + file); await p.waitForTimeout(500);
  const out = await p.evaluate((n) => {
    const T = window.T, MX = window.MX, pack = T.packs[n], L = [];
    const txt = h => { const d = document.createElement('div'); d.innerHTML = String(h == null ? '' : h); return d.textContent.replace(/\s+/g, ' ').trim(); };
    const figs = f => f ? ' [picture: ' + JSON.stringify(f).slice(0, 220) + ']' : '';
    function q(label, def, mode, meta) {
      let t; try { t = MX.make(def, mode || 'your'); } catch (e) { L.push(label + ' !! MODEL ERROR ' + e.message); return; }
      L.push(''); L.push('### ' + label + (meta ? '  ' + meta : '') + '  (type ' + def.type + ', marks ' + (t.marks || 1) + ')');
      L.push('Q: ' + txt(t.q) + (t.says ? ' SAYS: "' + txt(t.says) + '" ' + txt(t.ask) : '') + (t.sub ? '  (' + txt(t.sub) + ')' : '') + figs(t.fig));
      (t.lines || []).forEach(l => L.push('   line: ' + txt(String(l).replace(/\{(\d+)\}/g, '[box$1]'))));
      if (t.ui) L.push('   tool: ' + JSON.stringify(t.ui).slice(0, 300) + (t.right ? '  RIGHT: ' + JSON.stringify(t.right).slice(0, 200) : ''));
      (t.opts || []).forEach((o, i) => L.push('   ' + (o.ok ? '[RIGHT] ' : '[wrong] ') + String.fromCharCode(65 + i) + ': ' + txt(o.html) + figs(o.fig) + (o.why ? '   -> feedback: ' + txt(o.why) : '')));
      if (t.verdict !== undefined) L.push('   VERDICT: ' + (t.verdict ? 'correct' : 'incorrect'));
      L.push('   KEY: ' + txt(t.key) + (t.fill ? '   fill: ' + JSON.stringify(t.fill) : ''));
      if (t.hint) L.push('   HINT: ' + txt(t.hint.step) + figs(t.hint.pic));
      if (t.worked) L.push('   WORKED: ' + txt(t.worked.text) + figs(t.worked.pic));
      if (t.yes) L.push('   YES-LINE: ' + txt(t.yes));
      if (t.blanks && t.fill) { try { const r = t.check({ v: t.fill.map(x => /^[<>=]$/.test(x) ? (x === '<' ? '>' : '<') : '7'), pick: -1 }); L.push('   FEEDBACK for a wrong answer "7": ' + txt(r.msg)); } catch (e) { L.push('   !! check throws ' + e.message); } }
    }
    function rounds(label, list) { (list || []).forEach((r, i) => (r.v || []).forEach((d, k) => q(label + ' R' + (i + 1) + ' set' + (k + 1), d, r.mode, 'lo ' + (r.lo || []).join(',') + (r.dok ? ' DOK ' + r.dok : '') + ' twm ' + (r.twm || []).join(',') + ' mode ' + (r.mode || '')))); }
    L.push('# STOP ' + n + ': ' + pack.title + '   objectives ' + T.stops[n - 1].los.map(c => c + ' ' + T.OBJECTIVES[c]).join(' | '));
    L.push('BLURB: ' + pack.blurb.en + ' || VI: ' + pack.blurb.vi);
    L.push('\n## WORDS'); (pack.words.sets || []).forEach(s => L.push('set ' + s.id + ' ' + s.title.en + ' / ' + s.title.vi + ': ' + s.keys.join(', ')));
    Object.keys(pack.words.items).forEach(k => { const w = pack.words.items[k]; L.push('- ' + k + ' | VI: ' + w.vi + ' | ' + w.def + ' | picture: ' + ((window.T_ART[w.art] || '').match(/aria-label="([^"]*)"/) || [, '?'])[1]); });
    L.push('\n## SEE IT'); ((pack.see || {}).scenes || []).forEach(s => { L.push('scene ' + s.id + ': ' + (s.title || {}).en + ' / ' + (s.title || {}).vi); if (s.challenge) { L.push('end: ' + JSON.stringify(s.challenge.end) + ' result: ' + s.challenge.result); rounds('SEE', s.challenge.rounds); } });
    L.push('\n## PRACTISE'); (pack.practise || []).forEach(g => { L.push('\ngame ' + g.id + ' ' + g.title + ': ' + JSON.stringify(g.blurb)); (g.levels || []).forEach((l, i) => { L.push('level ' + (i + 1) + ': ' + JSON.stringify(l.title)); rounds(g.id + ' L' + (i + 1), l.rounds); }); });
    L.push('\n## NOTES'); (pack.notes.items || []).forEach((x, i) => L.push('note ' + (i + 1) + ': ' + x.en + '\n   VI: ' + x.vi + '\n   example: ' + (x.example || []).join(' / ') + figs(x.pic)));
    (pack.notes.check || []).forEach((c, i) => L.push('check ' + (i + 1) + ': ' + c.sentence + '  ANSWER: ' + c.answer));
    L.push('\n## MINI PRACTICE TEST'); (pack.test.items || []).forEach((it, i) => (it.v || []).forEach((d, k) => q('TEST Q' + (i + 1) + ' set' + (k + 1), d, 'your', 'DOK ' + it.dok + ' lo ' + it.lo.join(',') + ' twm ' + (it.twm || []).join(','))));
    L.push('\n## LIGHTNING (first answer is the right one)'); (pack.lightning.items || []).forEach((x, i) => L.push((i + 1) + '. ' + txt(x[0]) + '  ->  ' + x[1].join('  |  ')));
    L.push('\n## SELF-CHECK'); L.push(JSON.stringify(pack.selfcheck));
    return L.join('\n');
  }, n);
  console.log(out); if (errs.length) console.log('PAGE ERRORS', errs); await b.close();
})();
