/* g4-pics-s3.js - the pictures of Stop 3 (add and subtract decimals and negatives), for T.tools.pic(spec).

   s3col   the column method on squared paper, the decimal points in one column
           { a: '14.75', b: '8.60', op: '+' | '-', show: 'q' (no answer) | 'ans' | 'work' (the answer and the regrouping marks),
             ans: '47.4' (the answer to show, e.g. a child's wrong one), left: true (both numbers start at the left: a mistake;
             'dig': a child's work with the digits started at the left and the points on the grid lines),
             shift: 1 (the second number moved k squares to the right: a mistake), uni: true (no gold column for the points), cap }
   s3line  a number line through zero with a jump from one number to another and its size
           { from, to, min, max, ask: true (the size is a "?"), via0: true (two jumps, to zero and on), open: true (only the
             start and the direction: the child finds where it lands), marks: [numbers], cap }
   s3bar   a bar model of a measure story in two steps
           { start: '12.50', steps: [['-', '3.75'], ['+', '2.50']], unit: 'kg', show: 0 | 1 | 2 (how many results are written in) }
   s3eq    equation cards with shapes for unknowns: T ▲, C ●, S ■, D ◆
           { lines: [['T', '+', 'C', 12], ['T', '-', 'C', 4]], vals: { T: 8, C: 4 } (the number written inside a shape), cap }
   s3set   some pictures side by side (dir: 'col': one under the other) { list: [specs], dir, cls }
   The numbers are worked out with MX.s3 (009d_g4-models-s3.js): whole units, never floats. */
(function (T) {
  'use strict';

  const el = T.util.el;
  const kinds = T.tools.picKinds = T.tools.picKinds || {};
  const MINUS = '−';
  const sg = function (v) { return v < 0 ? MINUS + (-v) : String(v); };

  function svgNode(markup) {
    const box = document.createElement('div');
    box.innerHTML = markup;
    return box.firstChild;
  }
  function figure(cls, node, cap) {
    const f = el('figure', { class: ['g4s3-fig', cls] }, node);
    if (cap) f.appendChild(el('figcaption', { class: 'g4s3-cap', html: String(cap) }));
    return f;
  }

  /* ---------- the column method ---------- */

  /* left: 'dig' - a child's written work with the digits started at the left (3.5 written like 35 under 12.4): one digit
     per square, each decimal point drawn on the grid line after its ones digit, so the answer shown matches the columns */
  function colDig(spec) {
    const op = spec.op === '-' ? '-' : '+';
    const rows = [String(spec.a), String(spec.b), String(spec.ans != null ? spec.ans : '')].map(function (x) { return x.replace(/,/g, '').replace(MINUS, '-'); });
    const dg = rows.map(function (x) { return x.replace('.', ''); }), ip = rows.map(function (x) { const i = x.indexOf('.'); return i < 0 ? x.length : i; });
    const N = Math.max(dg[0].length, dg[1].length, dg[2].length), CW = 32, SIGN = 30, PAD = 8, MK = 6, RH = 40;
    const st = [0, 0, Math.max(dg[0].length, dg[1].length) - dg[2].length];    // the two numbers start at the left; the answer sits under their digits
    const W = SIGN + N * CW + PAD, yA = MK + RH / 2, yB = yA + RH, yLine = MK + 2 * RH + 3, yR = yLine + 4 + RH / 2, H = yLine + RH + 10, ys = [yA, yB, yR];
    let s = '<rect class="g4s3-col__paper" x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10"/>';
    for (let c = 0; c <= N; c++) s += '<path class="g4s3-col__g" d="M' + (SIGN + c * CW) + ' 4V' + (H - 4) + '"/>';
    [MK, MK + RH, MK + 2 * RH].forEach(function (gy) { s += '<path class="g4s3-col__g" d="M4 ' + gy + 'H' + (W - 4) + '"/>'; });
    rows.forEach(function (x, r) {
      if (!dg[r]) return;
      const cls = r === 2 ? 'is-shown' : '';
      dg[r].split('').forEach(function (ch, i) { s += '<text class="g4s3-col__d ' + cls + '" x="' + (SIGN + (st[r] + i) * CW + CW / 2) + '" y="' + (ys[r] + 10) + '">' + (ch === '-' ? MINUS : ch) + '</text>'; });
      if (ip[r] < dg[r].length) s += '<circle class="g4s3-col__dot ' + cls + '" cx="' + (SIGN + (st[r] + ip[r]) * CW) + '" cy="' + (ys[r] + 9) + '" r="3.6"/>';
    });
    s += '<text class="g4s3-col__d" x="' + (SIGN / 2 + 2) + '" y="' + (yB + 10) + '">' + (op === '+' ? '+' : MINUS) + '</text>';
    s += '<path class="g4s3-col__line" d="M6 ' + yLine + 'H' + (W - 6) + '"/>';
    const say = rows[0] + (op === '+' ? ' plus ' : ' take away ') + rows[1] + ' written with the digits started at the left, the decimal points not lined up' + (rows[2] ? '. Answer shown: ' + rows[2] : '');
    return figure('g4s3-fig--col', svgNode('<svg class="g4s3-col" viewBox="0 0 ' + W + ' ' + H + '" style="width:' + (W / 16).toFixed(3) + 'rem" role="img" aria-label="' + say + '">' + s + '</svg>'), spec.cap);
  }

  kinds.s3col = function (spec) {
    if (spec.left === 'dig') return colDig(spec);
    const S = window.MX.s3, dp = Math.max(S.dpOf(spec.a), S.dpOf(spec.b));
    const a = S.toU(spec.a, dp), b = S.toU(spec.b, dp), op = spec.op === '-' ? '-' : '+';
    const res = op === '+' ? a + b : a - b, show = spec.show || 'q';
    const sa = S.fU(a, dp, true), sb = S.fU(b, dp, true);
    const sr = show === 'q' ? '' : String(spec.ans != null ? spec.ans : S.fU(res, dp, true)).replace(/,/g, '').replace(MINUS, '-');
    const aligned = !spec.left && !spec.shift;
    // where each row starts, counted in squares from the right edge of the first number
    let stA = -sa.length, stB = -sb.length + (spec.shift || 0);
    if (spec.left) { if (sa.length >= sb.length) stB = stA; else stA = stB; }
    const stR = spec.left ? Math.max(stA + sa.length, stB + sb.length) - sr.length : -sr.length;
    const lo = Math.min(stA, stB, sr ? stR : 0), hi = Math.max(stA + sa.length, stB + sb.length, sr ? stR + sr.length : -99);
    const N = hi - lo, CW = 32, PW = 16, SIGN = 30, PAD = 8;
    const pointCol = aligned && dp && !spec.uni ? N - dp - 1 : -1;      // uni: every square the same, no gold column (an option to choose)
    const wOf = function (c) { return c === pointCol ? PW : CW; };
    const xs = []; let x = SIGN;
    for (let c = 0; c < N; c++) { xs.push(x); x += wOf(c); }
    const W = x + PAD, cx = function (c) { return xs[c] + wOf(c) / 2; };
    const work = show === 'work' && aligned ? S.colwork(a, b, op, dp) : null;
    const hasMk = !!work && (op === '+' ? work.mk.some(Boolean) : work.top.some(function (t, i) { return t !== work.A[i] && t !== work.A[i] + 10; }));
    const MK = hasMk ? 22 : 6, RH = 40, yA = MK + RH / 2, yB = yA + RH, yLine = MK + 2 * RH + 3, yR = yLine + 4 + RH / 2, H = yLine + RH + 10;
    let s = '';
    // squared paper
    s += '<rect class="g4s3-col__paper" x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10"/>';
    if (pointCol >= 0) s += '<rect class="g4s3-col__pt" x="' + xs[pointCol] + '" y="' + (MK - 2) + '" width="' + PW + '" height="' + (H - MK - 4) + '" rx="6"/>';
    for (let c = 0; c <= N; c++) { const gx = c < N ? xs[c] : xs[N - 1] + wOf(N - 1); s += '<path class="g4s3-col__g" d="M' + gx + ' 4V' + (H - 4) + '"/>'; }
    [MK, MK + RH, MK + 2 * RH].forEach(function (gy) { s += '<path class="g4s3-col__g" d="M4 ' + gy + 'H' + (W - 4) + '"/>'; });
    const put = function (str, st, y, cls) {
      str.split('').forEach(function (ch, i) {
        const c = st - lo + i;
        if (ch === '.') s += '<circle class="g4s3-col__dot ' + (cls || '') + '" cx="' + cx(c) + '" cy="' + (y + 9) + '" r="3.6"/>';
        else s += '<text class="g4s3-col__d ' + (cls || '') + '" x="' + cx(c) + '" y="' + (y + 10) + '">' + (ch === '-' ? MINUS : ch) + '</text>';
      });
    };
    put(sa, stA, yA); put(sb, stB, yB);
    s += '<text class="g4s3-col__d" x="' + (SIGN / 2 + 2) + '" y="' + (yB + 10) + '">' + (op === '+' ? '+' : MINUS) + '</text>';
    s += '<path class="g4s3-col__line" d="M6 ' + yLine + 'H' + (W - 6) + '"/>';
    if (sr) put(sr, stR, yR, spec.ans != null ? 'is-shown' : 'is-ans');
    if (work) {
      // digit i of the working (no point) -> its column
      const colOf = function (i) { const fromRight = work.n - 1 - i; return N - 1 - fromRight - (dp && fromRight >= dp ? 1 : 0); };
      for (let i = 0; i < work.n; i++) {
        const c = colOf(i); if (c < 0) continue;
        if (op === '+') { if (work.mk[i]) s += '<text class="g4s3-col__mk" x="' + cx(c) + '" y="' + (MK - 3) + '">1</text>'; continue; }
        const t = work.top[i], o = work.A[i];
        if (t === o) continue;
        if (t === o + 10) { s += '<text class="g4s3-col__mk is-ten" x="' + (cx(c) - 12) + '" y="' + (yA - 6) + '">1</text>'; continue; }
        s += '<path class="g4s3-col__x" d="M' + (cx(c) - 9) + ' ' + (yA + 12) + 'L' + (cx(c) + 9) + ' ' + (yA - 12) + '"/>';
        s += '<text class="g4s3-col__mk" x="' + cx(c) + '" y="' + (MK - 3) + '">' + t + '</text>';
      }
    }
    const say = S.fU(a, dp) + (op === '+' ? ' plus ' : ' take away ') + S.fU(b, dp) + ' written in columns' + (aligned ? ', the decimal points lined up' : ', the decimal points not lined up') + (sr ? '. Answer shown: ' + sr : '');
    const svg = svgNode('<svg class="g4s3-col" viewBox="0 0 ' + W + ' ' + H + '" style="width:' + (W / 16).toFixed(3) + 'rem" role="img" aria-label="' + say + '">' + s + '</svg>');
    return figure('g4s3-fig--col', svg, spec.cap);
  };

  /* ---------- a number line through zero ---------- */

  kinds.s3line = function (spec) {
    const from = spec.from, to = spec.to, has = from != null && to != null, marks = spec.marks || [];
    const all = (has ? [from, to] : []).concat(marks, [0]);
    let min = spec.min != null ? spec.min : Math.min.apply(null, all) - 1, max = spec.max != null ? spec.max : Math.max.apply(null, all) + 1;
    while (max - min < 8) { max++; if (max - min < 8) min--; }
    const range = max - min, W = 360, PAD = 22, u = (W - 2 * PAD) / range, X = function (v) { return PAD + (v - min) * u; };
    const every = range <= 16 ? 1 : range <= 32 ? 2 : 5, AX = 92, H = 126;
    let s = '';
    if (min < 0) s += '<rect class="g4s3-nl__cold" x="' + (X(min) - 12) + '" y="' + (AX - 16) + '" width="' + (X(0) - X(min) + 12) + '" height="44" rx="8"/>';
    s += '<path class="g4s3-nl__ax" d="M' + (X(min) - 14) + ' ' + AX + 'H' + (X(max) + 14) + '"/>' +
      '<path class="g4s3-nl__ah" d="M' + (X(min) - 8) + ' ' + (AX - 6) + 'l-8 6l8 6M' + (X(max) + 8) + ' ' + (AX - 6) + 'l8 6l-8 6"/>';
    for (let v = min; v <= max; v++) {
      const zero = v === 0, lab = v % every === 0 || (has && (v === from || v === to)) || marks.indexOf(v) >= 0;
      s += '<path class="g4s3-nl__t' + (zero ? ' is-zero' : '') + '" d="M' + X(v) + ' ' + (AX - (zero ? 11 : 7)) + 'V' + (AX + (zero ? 11 : 7)) + '"/>';
      if (lab) s += '<text class="g4s3-nl__n' + (zero ? ' is-zero' : v < 0 ? ' is-neg' : '') + (has && (v === from || (v === to && !spec.open)) ? ' is-on' : '') + '" x="' + X(v) + '" y="' + (AX + 27) + '">' + sg(v) + '</text>';
    }
    const arc = function (p, q, label, cls) {
      const x1 = X(p), x2 = X(q), d = Math.abs(x2 - x1), h = Math.min(44, 18 + d * 0.2), dir = x2 > x1 ? 1 : -1, y0 = AX - 14;
      return '<path class="g4s3-nl__arc ' + (cls || '') + '" d="M' + x1 + ' ' + y0 + ' Q' + ((x1 + x2) / 2) + ' ' + (y0 - 2 * h) + ' ' + x2 + ' ' + y0 + '"/>' +
        '<path class="g4s3-nl__head ' + (cls || '') + '" d="M' + (x2 - dir * 9) + ' ' + (y0 - 11) + 'L' + x2 + ' ' + y0 + 'L' + (x2 - dir * 12) + ' ' + (y0 - 1) + '"/>' +
        '<text class="g4s3-nl__l ' + (cls || '') + '" x="' + ((x1 + x2) / 2) + '" y="' + (y0 - h - 6) + '">' + label + '</text>';
    };
    if (has) {
      const dist = Math.abs(to - from), sign = to > from ? '+' : MINUS, cross = (from < 0) !== (to < 0) && from !== 0 && to !== 0;
      if (spec.open) {
        const dir = to > from ? 1 : -1, x1 = X(from), y0 = AX - 14;
        s += '<path class="g4s3-nl__arc is-open" d="M' + x1 + ' ' + y0 + ' q' + (dir * 14) + ' -26 ' + (dir * 34) + ' -26"/>' +
          '<path class="g4s3-nl__head" d="M' + (x1 + dir * 26) + ' ' + (y0 - 33) + 'l' + (dir * 9) + ' 7l' + (-dir * 9) + ' 7"/>' +
          '<text class="g4s3-nl__l" x="' + (x1 + dir * 58) + '" y="' + (y0 - 20) + '">' + sign + ' ' + dist + '</text>';
      } else if (spec.via0 && cross) {
        s += arc(from, 0, spec.ask ? '?' : String(Math.abs(from)), 'is-a') + arc(0, to, spec.ask ? '?' : String(Math.abs(to)), 'is-b');
      } else s += arc(from, to, spec.ask ? '?' : (spec.via0 ? String(dist) : sign + ' ' + dist));
      s += '<circle class="g4s3-nl__dot is-from" cx="' + X(from) + '" cy="' + AX + '" r="6.5"/>';
      if (!spec.open) s += '<circle class="g4s3-nl__dot is-to" cx="' + X(to) + '" cy="' + AX + '" r="6.5"/>';
    }
    marks.forEach(function (v) { s += '<circle class="g4s3-nl__dot is-to" cx="' + X(v) + '" cy="' + AX + '" r="6.5"/>'; });
    const say = 'A number line from ' + sg(min) + ' to ' + sg(max) + (has ? (spec.open ? '. Start at ' + sg(from) + ' and jump ' + Math.abs(to - from) + (to > from ? ' to the right' : ' to the left') : '. A jump from ' + sg(from) + ' to ' + sg(to)) : '');
    return figure('g4s3-fig--line', svgNode('<svg class="g4s3-nl" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + say + '">' + s + '</svg>'), spec.cap);
  };

  /* ---------- the bar model of a story in two steps ---------- */

  kinds.s3bar = function (spec) {
    const S = window.MX.s3, dp = S.dpOf(spec.start), f = function (v) { return S.fU(v, dp); }, unit = spec.unit ? ' ' + spec.unit : '';
    const s0 = S.toU(spec.start, dp), steps = (spec.steps || []).map(function (st) { return [st[0], S.toU(st[1], dp)]; });
    const show = spec.show || 0, vals = [s0];
    steps.forEach(function (st) { vals.push(st[0] === '+' ? vals[vals.length - 1] + st[1] : vals[vals.length - 1] - st[1]); });
    const top = Math.max.apply(null, vals), pct = function (v) { return (v / top * 100).toFixed(2) + '%'; };
    const seg = function (cls, label, grow) { return el('span', { class: ['g4s3-bar__s', cls], style: 'flex:' + Math.max(grow, top * 0.2) + ' 1 0' }, el('b', label)); };
    const res = function (i) { return show >= i ? f(vals[i]) : '?'; };
    const box = el('div', { class: 'g4s3-bar', role: 'img', 'aria-label': 'Bar model. Start: ' + f(s0) + unit + '. ' + steps.map(function (st) { return (st[0] === '+' ? 'Add ' : 'Take away ') + f(st[1]) + unit; }).join('. ') + '.' });
    box.appendChild(el('div', { class: 'g4s3-bar__row' }, el('div', { class: 'g4s3-bar__track', style: 'width:' + pct(s0) }, seg('is-start', f(s0) + unit, s0))));
    steps.forEach(function (st, k) {
      const i = k + 1, prev = vals[k], now = vals[i], last = i === steps.length;
      const row = el('div', { class: 'g4s3-bar__row' });
      if (st[0] === '-') {
        row.appendChild(el('div', { class: 'g4s3-bar__track', style: 'width:' + pct(prev) },
          seg(show >= i ? 'is-known' : 'is-ask', res(i), now), seg('is-out', MINUS + ' ' + f(st[1]), st[1])));
      } else {
        const track = el('div', { class: 'g4s3-bar__track', style: 'width:' + pct(now) },
          seg(show >= k || k === 0 ? 'is-known' : 'is-ask', k === 0 ? f(prev) : res(k), prev), seg('is-in', '+ ' + f(st[1]), st[1]));
        const wrap = el('div', { class: 'g4s3-bar__sum', style: 'width:' + pct(now) }, el('i', { class: 'g4s3-bar__brace' }), el('b', { class: show >= i ? null : 'is-ask' }, res(i) + (show >= i ? unit : '')));
        row.appendChild(track); row.appendChild(wrap);
      }
      box.appendChild(row);
      if (last) row.classList.add('is-last');
    });
    return figure('g4s3-fig--bar', box, spec.cap);
  };

  /* ---------- shapes for unknowns ---------- */

  const SH = {
    T: '<path d="M22 4L41 39H3Z"/>', C: '<circle cx="22" cy="22" r="18.5"/>',
    S: '<rect x="4.5" y="4.5" width="35" height="35" rx="5"/>', D: '<path d="M22 2L41 22L22 42L3 22Z"/>'
  };
  const NAME = { T: 'triangle', C: 'circle', S: 'square', D: 'diamond' };
  function shape(code, val) {
    const wrap = el('span', { class: 'g4s3-eq__sh g4s3-eq__sh--' + code.toLowerCase() });
    wrap.appendChild(svgNode('<svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">' + SH[code] + '</svg>'));
    if (val != null) wrap.appendChild(el('b', { class: code === 'T' ? 'is-low' : null }, String(val)));
    return wrap;
  }
  kinds.s3eq = function (spec) {
    const vals = spec.vals || {}, box = el('div', { class: 'g4s3-eq' });
    const said = [];
    (spec.lines || []).forEach(function (ln) {
      const card = el('div', { class: 'g4s3-eq__card' });
      const tok = function (t) {
        if (typeof t === 'string' && SH[t]) return shape(t, vals[t]);
        if (t === '+' || t === '-') return el('span', { class: 'g4s3-eq__op' }, t === '+' ? '+' : MINUS);
        return el('span', { class: 'g4s3-eq__n' }, typeof t === 'number' ? sg(t) : String(t));
      };
      ln.slice(0, -1).forEach(function (t) { card.appendChild(tok(t)); });
      card.appendChild(el('span', { class: 'g4s3-eq__op' }, '='));
      card.appendChild(tok(ln[ln.length - 1]));
      box.appendChild(card);
      said.push(ln.slice(0, -1).map(function (t) { return SH[t] ? NAME[t] + (vals[t] != null ? ' (' + vals[t] + ')' : '') : t === '+' ? 'plus' : t === '-' ? 'minus' : t; }).join(' ') + ' equals ' + ln[ln.length - 1]);
    });
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', said.join('. '));
    return figure('g4s3-fig--eq', box, spec.cap);
  };

  /* ---------- some pictures together ---------- */

  kinds.s3set = function (spec) {
    const box = el('div', { class: ['g4s3-set', spec.dir === 'col' && 'g4s3-set--col', spec.cls && 'g4s3-set--' + spec.cls] });
    (spec.list || []).forEach(function (x) { const p = T.tools.pic(x); if (p) box.appendChild(p); });
    return box.children.length ? box : null;
  };
})(window.T = window.T || {});
