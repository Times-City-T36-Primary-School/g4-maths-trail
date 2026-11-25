/* tools/keys.js - checks the content of the stops in a built page.  node tools/keys.js dist/s3.html 3   (no numbers: all 9)
   Every question is made by its model, answered with its own key (must be right) and with a wrong answer (must be wrong,
   with feedback). `ans` keys are worked out again from chk; `ring` keys from rule. Structure, DOK mix, objectives, TWM,
   pictures, notes, lightning, self-check, words and the item-security blocklist are checked too. */
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const file = path.resolve(process.argv[2] || 'dist/index.html');
  const stops = process.argv.slice(3).map(Number); 
  const b = await chromium.launch(); const p = await b.newPage();
  const perr = []; p.on('pageerror', e => perr.push(String(e)));
  await p.goto('file://' + file); await p.waitForTimeout(600);
  const out = await p.evaluate((stops) => {
    const T = window.T, MX = window.MX, res = [];
    const BLOCK = (() => { try { return require('./blocklist.local.js'); } catch (e) { return []; } })();   // the exam-security list stays off GitHub (tools/blocklist.local.js, not committed)
    const safe = s => /^[-+*/(). 0-9]+$/.test(s);
    (stops.length ? stops : [1,2,3,4,5,6,7,8,9]).forEach(n => {
      const E = [], W = [], pack = T.packs[n], stop = T.stops[n - 1]; let nq = 0, nchk = 0, nans = 0;
      const err = (w, m) => E.push(w + ': ' + m), warn = (w, m) => W.push(w + ': ' + m);
      if (!pack) { res.push({ n, E: ['no pack'], W, nq }); return; }
      const src = JSON.stringify(pack); BLOCK.forEach(rx => { if (rx.test(src)) err('security', 'live-paper item or name found: ' + rx); });
      const pic = (w, f) => { if (!f) return; try { if (!T.tools.pic(f)) err(w, 'picture kind not drawn: ' + JSON.stringify(f).slice(0, 80)); } catch (e) { err(w, 'picture throws: ' + e.message); } };
      function one(w, def, mode) {
        nq++; let t;
        try { t = MX.make(def, mode || 'your'); } catch (e) { err(w, 'model ' + def.type + ' throws: ' + e.message); return; }
        if (!t.q || typeof t.q !== 'string') err(w, 'no question text');
        if (/undefined|NaN|\[object/.test([t.q, t.yes, t.key, t.worked && t.worked.text, t.hint && t.hint.step, (t.lines || []).join(' ')].join(' '))) err(w, 'undefined/NaN in the text');
        if (!t.worked || !t.worked.text) warn(w, 'no worked answer');
        if (!t.hint || !t.hint.step) warn(w, 'no hint');
        pic(w, t.fig); if (t.hint) [].concat(t.hint.pic || []).forEach(f => pic(w + ' hint', f)); (t.opts || []).forEach(o => pic(w + ' option', o.fig));
        if (def.type === 'ans') {
          nans++;
          def.ans.forEach((a, i) => {
            if (typeof a === 'number') { if (!Number.isInteger(a) && !def.dec) err(w, 'decimal answer needs dec: true'); if (a < 0 && !def.neg) err(w, 'negative answer needs neg: true'); }
            const c = (def.chk || [])[i];
            if (c == null) { if (typeof a === 'number') warn(w, 'no chk for box ' + (i + 1)); return; }
            if (!safe(c)) { err(w, 'chk is not plain arithmetic: ' + c); return; }
            nchk++; const v = Function('"use strict";return (' + c + ')')(); if (!MX.eq(v, a)) err(w, 'KEY WRONG: chk ' + c + ' = ' + v + ' but ans = ' + a);
          });
          if ((def.lines || []).join(' ').split('{').length - 1 !== def.ans.length) err(w, 'boxes in lines do not match ans');
        }
        if (def.type === 'ring') { const f = MX.ruleFn(def.rule); if (f) { const g = def.nums.filter(f).sort((x, y) => x - y), h = def.good.slice().sort((x, y) => x - y); if (g.join() !== h.join()) err(w, 'KEY WRONG: rule gives ' + g + ' but good = ' + h); } else warn(w, 'ring without a rule'); if (def.good.some(v => def.nums.indexOf(v) < 0)) err(w, 'good not in nums'); }
        try {
          const claim = t.verdict !== undefined && t.opts;
          if (claim) { const i = t.opts.findIndex(o => o.ok); if (!t.check({ dec: t.verdict ? 'correct' : 'incorrect', pick: i, v: [] }).ok) err(w, 'claim key not accepted');
            const bad = t.check({ dec: t.verdict ? 'incorrect' : 'correct', pick: (i + 1) % t.opts.length, v: [] }); if (bad.ok || !bad.msg) err(w, 'wrong claim accepted or no feedback');
            if (t.opts.filter(o => o.ok).length !== 1) err(w, 'claim needs exactly one right reason'); }
          else if (t.opts) { const oks = t.opts.filter(o => o.ok).length; if (oks !== 1) err(w, 'needs exactly one right option, has ' + oks);
            t.opts.forEach((o, i) => { const r = t.check({ pick: i, v: [], picks: [] }); if (!!r.ok !== !!o.ok) err(w, 'option ' + i + ' marked wrongly'); if (!o.ok && !r.msg) warn(w, 'wrong option ' + i + ' has no feedback'); });
            if (new Set(t.opts.map(o => o.html + JSON.stringify(o.fig || ''))).size !== t.opts.length) err(w, 'two options are the same'); }
          else if (t.ui && t.right && t.ui.k !== 'pickall') { const r = t.check(Object.assign({ v: t.fill || [], pick: -1 }, t.right)); if (!r || !r.ok) err(w, 'tool key (task.right) not accepted'); }
          else if (t.ui && t.ui.k === 'pickall') { if (!t.check({ picks: t.right.picks }).ok) err(w, 'ring key not accepted'); if (t.check({ picks: [] }).ok) err(w, 'empty rings accepted'); }
          else if (t.blanks && t.fill) { if (!t.check({ v: t.fill, pick: -1 }).ok) err(w, 'own key not accepted: ' + t.fill);
            const bad = t.check({ v: t.fill.map(x => (/^[<>=]$/.test(x) ? (x === '<' ? '>' : '<') : '987653')), pick: -1 }); if (bad.ok) err(w, 'a wrong answer is accepted'); else if (!bad.msg) warn(w, 'no feedback for a wrong answer'); }
          else if (!t.ui) err(w, 'no way to answer (no blanks, opts or tool)');
        } catch (e) { err(w, 'check throws: ' + e.message); }
      }
      function rounds(w, list, wantLo) {
        (list || []).forEach((r, i) => { const ww = w + ' round ' + (i + 1);
          if (!r.v || r.v.length !== 3) err(ww, 'needs 3 sets of numbers (v)');
          (r.lo || []).forEach(c => { if (!T.OBJECTIVES[c]) err(ww, 'unknown objective ' + c); else if (stop.los.indexOf(c) < 0) err(ww, 'objective ' + c + ' is not in this stop'); });
          if (!r.lo || !r.lo.length) err(ww, 'no lo'); if (!r.twm || !r.twm.length || r.twm.some(x => !T.TWM[x])) err(ww, 'bad twm');
          (r.v || []).forEach((d, k) => one(ww + ' v' + (k + 1) + ' (' + d.type + ')', d, r.mode)); });
      }
      ((pack.see || {}).scenes || []).forEach(s => { if (s.challenge) rounds('see challenge', s.challenge.rounds); });
      (pack.practise || []).forEach(g => { if (!g.levels || !g.levels.length) err('practise ' + g.id, 'no levels'); (g.levels || []).forEach((l, i) => { if (!l.title || !l.title.vi) err('practise ' + g.id, 'level title needs en and vi'); rounds('practise ' + g.id + ' level ' + (i + 1), l.rounds); }); });
      if (!pack.practise) warn('practise', 'missing');
      if (pack.test) { const it = pack.test.items || []; if (it.length !== 10) err('test', 'needs 10 questions, has ' + it.length);
        if (it.map(x => x.dok).join() !== T.DOK_MIX.join()) err('test', 'DOK order must be ' + T.DOK_MIX.join() + ' but is ' + it.map(x => x.dok).join());
        rounds('test', it); const cover = new Set(); it.forEach(x => (x.lo || []).forEach(c => cover.add(c))); stop.los.forEach(c => { if (!cover.has(c)) err('test', 'objective ' + c + ' is not tested'); }); } else warn('test', 'missing');
      const wordKeys = {}; Object.keys(T.packs).forEach(k => Object.keys(((T.packs[k] || {}).words || {}).items || {}).forEach(x => { wordKeys[x] = 1; }));
      const links = s => { (String(s).match(/\[\[[^\]]+\]\]/g) || []).forEach(m => { const k = m.slice(2, -2).split('|').pop(); if (!wordKeys[k]) err('word link', m + ' has no word card'); }); };
      if (pack.notes) { const it = pack.notes.items || [], ck = pack.notes.check || []; if (it.length < 4 || it.length > 6) err('notes', '4 to 6 notes, has ' + it.length); if (ck.length !== it.length) err('notes', 'one check per note');
        it.forEach((x, i) => { if (!x.en || !x.vi) err('note ' + (i + 1), 'needs en and vi'); if (!x.example || !x.example.length) err('note ' + (i + 1), 'needs an example'); links(x.en); pic('note ' + (i + 1), x.pic); });
        ck.forEach((c, i) => { const m = /\{([^}]+)\}/.exec(c.sentence || ''); if (!m) err('notes check ' + (i + 1), 'needs one {a|b|c}'); else { const o = m[1].split('|'); if (o.indexOf(c.answer) < 0) err('notes check ' + (i + 1), 'answer is not one of the choices'); if (new Set(o).size !== o.length) err('notes check ' + (i + 1), 'two choices are the same'); } }); } else warn('notes', 'missing');
      if (pack.lightning) { const it = pack.lightning.items || []; if (it.length < 36) err('lightning', 'at least 36 questions, has ' + it.length);
        it.forEach((x, i) => { if (!x[0] || !x[1] || x[1].length !== 3 || new Set(x[1]).size !== 3) err('lightning ' + (i + 1), 'needs [question, [right, wrong, wrong]] all different'); });
        if (new Set(it.map(x => x[0])).size !== it.length) err('lightning', 'a question is there twice'); } else warn('lightning', 'missing');
      if (pack.selfcheck) { const g = pack.selfcheck.goals || [], a = pack.selfcheck.again || []; if (g.length < 3 || g.length > 5 || a.length !== g.length || a.some(x => 'cra'.indexOf(x) < 0)) err('selfcheck', '3 to 5 goals, one again letter (c, r or a) each'); } else warn('selfcheck', 'missing');
      if (pack.words) { const it = pack.words.items || {}; (pack.words.sets || []).forEach(s => { if (!s.title || !s.title.vi) err('words set ' + s.id, 'title needs en and vi'); (s.keys || []).forEach(k => { if (!it[k]) err('words', 'no item for ' + k); }); });
        Object.keys(it).forEach(k => { const x = it[k]; if (!x.vi || !x.def) err('word ' + k, 'needs vi and def'); if (!x.art || !(window.T_ART || {})[x.art]) err('word ' + k, 'picture ' + x.art + ' is not drawn'); if ((x.def || '').split(/\s+/).length > 24) warn('word ' + k, 'def is long'); }); } else warn('words', 'missing');
      if (!pack.blurb || !pack.blurb.vi) err('pack', 'blurb needs en and vi'); if (pack.title !== stop.title) err('pack', 'title must be ' + stop.title);
      if (!pack.los || pack.los.join() !== stop.los.join()) warn('pack', 'los should be ' + JSON.stringify(stop.los));
      res.push({ n, E, W, nq, nchk, nans });
    });
    return res;
  }, stops);
  let bad = perr.length;
  if (perr.length) console.log('PAGE ERRORS:', perr.slice(0, 5));
  out.forEach(r => { bad += r.E.length; console.log(`Stop ${r.n}: ${r.nq} questions (${r.nans} typed, ${r.nchk} keys re-worked) · ${r.E.length} errors · ${r.W.length} warnings`); r.E.forEach(e => console.log('  ERROR ' + e)); r.W.slice(0, 40).forEach(e => console.log('  warn  ' + e)); });
  await b.close(); process.exit(bad ? 1 : 0);
})();
