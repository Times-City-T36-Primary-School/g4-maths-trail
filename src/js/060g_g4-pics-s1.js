/* g4-pics-s1.js - Stop 1 (Decimals and place value): the pictures and the two small tools (styles: 030g_g4-s1.css).

   Pictures, T.tools.pic(spec):
   { k: 's1chart', n: '4.72' | c: [tens, ones, tenths, hundredths], tens: true, digits: true | false, counters: true,
     counts: true, hl: 'T' | 'O' | 't' | 'h' }
       the decimal place value chart: Tens (only when needed), Ones, a clear decimal point, tenths, hundredths.
       n shows one digit per place; c gives counts (a count may be more than 9: 14 tenths, for regrouping);
       counters draws a counter for each one; counts writes how many under them; hl lights one place.
   { k: 's1line', lo: 3, hi: 4 (lo + 1, or lo + 2), n: '3.7', show: true, zone: 7, ends: true }
       a number line from one whole number to the next with the tenths marked. n is the point; show lights the nearer
       whole number and draws the jump to it; zone shades every one-decimal number that rounds to that whole number
       (ends: also write the first and the last one).
   { k: 's1grid', n: '1.36' | c: [ones, tenths, hundredths] }
       hundred squares: a whole square is 1, a column is one tenth, a small square is one hundredth.

   Tools (Draw it and See it; the kit picks them by task.ui.k, and Zip's line by the same name):
   T.tools.s1build(host, { cols, start: [T, O, t, h], lock: [bool x 4], max })   draw counters in the chart with + and −;
       get() -> { b: [T, O, t, h] }
   T.tools.s1near(host, { lo, n })    the line with its two whole numbers as buttons; get() -> { choice } */
(function (T) {
  'use strict';

  const el = T.util.el;
  const sfx = function (name) { if (T.fx && T.fx.sfx) T.fx.sfx(name); };
  const mount = function (host, node) { if (host) host.appendChild(node); return node; };
  function svgNode(markup) { const box = document.createElement('div'); box.innerHTML = markup; return box.firstChild; }
  const FONT = 'font-family="Arial, Helvetica, sans-serif"';
  const INK = '#10305E', INK2 = '#3D5A85', LINE = '#B8C8DB', PLATE = '#F7FBFF', GOLD = '#F5A623', GOLD_SOFT = '#FFF1CF', RED = '#D22630', GO = '#1E9E6A', GO_SOFT = '#DDF4E8';

  // the four places: key, name, value, colours (fill, edge, soft)
  const PL = [
    { k: 'T', name: 'Tens', one: 'ten', many: 'tens', val: '10', w: 62, c: ['#2F7FD4', '#1D62AE', '#DCEBFA'] },
    { k: 'O', name: 'Ones', one: 'one', many: 'ones', val: '1', w: 62, c: ['#E89B12', '#8A5800', '#FDEFD2'] },
    { k: 't', name: 'tenths', one: 'tenth', many: 'tenths', val: '0.1', w: 66, c: ['#1E9E6A', '#147A51', '#DDF4E8'] },
    { k: 'h', name: 'hundredths', one: 'hundredth', many: 'hundredths', val: '0.01', w: 84, c: ['#8A5BD6', '#5E35A8', '#EBE2FA'] }
  ];
  const PTW = 20;      // the width of the decimal point's own narrow column

  // '4.72' -> [0, 4, 7, 2] (tens, ones, tenths, hundredths)
  function digitsOf(n) {
    const s = String(n), at = s.indexOf('.'), whole = at < 0 ? s : s.slice(0, at), frac = (at < 0 ? '' : s.slice(at + 1) + '00').slice(0, 2);
    const w = ('00' + whole).slice(-2);
    return [+w[0], +w[1], +(frac[0] || 0), +(frac[1] || 0)];
  }
  function sayCounts(c) {
    const parts = [];
    c.forEach(function (v, i) { if (v) parts.push(v + ' ' + (v === 1 ? PL[i].one : PL[i].many)); });
    return parts.join(', ') || 'nothing';
  }

  /* ---------- the decimal place value chart ---------- */

  // -> { svg (markup), cols: [{ i, x, w }], W, H, px (the x of the point column) }
  function chartMarkup(spec) {
    const c = spec.c ? spec.c.slice() : digitsOf(spec.n);
    while (c.length < 4) c.unshift(0);
    const showT = !!spec.tens || c[0] > 0;
    const digits = spec.digits != null ? !!spec.digits : !spec.c;
    const counters = !!spec.counters, counts = !!spec.counts;
    const frac = spec.n != null ? (String(spec.n).split('.')[1] || '').length : 2;
    const pad = 5, headH = 44, digH = digits ? 46 : 0;
    const per = 5, gap = 12, r = 4.6;
    const rowsMax = counters ? Math.max(spec.rows || 2, Math.ceil(Math.max.apply(null, c) / per)) : 0;
    const cntH = counters ? rowsMax * gap + 12 + (counts ? 20 : 0) : 0;
    const cols = [];
    let x = pad;
    PL.forEach(function (p, i) {
      if (i === 0 && !showT) return;
      if (i === 2) { cols.px = x; x += PTW; }
      cols.push({ i: i, x: x, w: p.w });
      x += p.w;
    });
    const W = x + pad, H = pad + headH + digH + cntH + pad;
    let s = '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10" fill="' + PLATE + '" stroke="' + LINE + '" stroke-width="2"/>';
    cols.forEach(function (col) {
      const p = PL[col.i], lit = spec.hl === p.k;
      // the lit place: a gold column from top to bottom
      if (lit) s += '<rect x="' + (col.x + 1) + '" y="' + (pad + 1) + '" width="' + (col.w - 2) + '" height="' + (H - 2 * pad - 2) + '" rx="7" fill="' + GOLD_SOFT + '" stroke="' + GOLD + '" stroke-width="3"/>';
      s += '<rect x="' + (col.x + 3) + '" y="' + (pad + 3) + '" width="' + (col.w - 6) + '" height="' + (headH - 8) + '" rx="6" fill="' + p.c[2] + '" stroke="' + p.c[0] + '" stroke-width="2"/>' +
        '<text x="' + (col.x + col.w / 2) + '" y="' + (pad + 19) + '" ' + FONT + ' font-size="' + (p.k === 'h' ? 13 : 14) + '" font-weight="700" text-anchor="middle" fill="' + INK + '">' + p.name + '</text>' +
        '<text x="' + (col.x + col.w / 2) + '" y="' + (pad + 33) + '" ' + FONT + ' font-size="12" font-weight="700" text-anchor="middle" fill="' + p.c[1] + '">' + p.val + '</text>';
      const top = pad + headH;
      if (digits) {
        const blank = (p.k === 'T' && c[0] === 0) || (p.k === 't' && frac < 1) || (p.k === 'h' && frac < 2);
        if (!blank) s += '<text x="' + (col.x + col.w / 2) + '" y="' + (top + 35) + '" ' + FONT + ' font-size="34" font-weight="700" text-anchor="middle" fill="' + (lit ? '#7B4E00' : INK) + '">' + (c[col.i] % 10) + '</text>';
      }
      if (counters) {
        const y0 = top + digH + 10, n = c[col.i], x0 = col.x + col.w / 2 - (per - 1) * gap / 2;
        for (let k = 0; k < n; k++) {
          s += '<circle cx="' + (x0 + (k % per) * gap) + '" cy="' + (y0 + Math.floor(k / per) * gap) + '" r="' + r + '" fill="' + p.c[0] + '" stroke="' + p.c[1] + '" stroke-width="1.5"/>';
        }
        if (counts) s += '<text x="' + (col.x + col.w / 2) + '" y="' + (H - pad - 6) + '" ' + FONT + ' font-size="14" font-weight="700" text-anchor="middle" fill="' + p.c[1] + '">' + n + '</text>';
      }
      // thin lines between the places
      if (col !== cols[0] && col.i !== 2) s += '<line x1="' + col.x + '" y1="' + (pad + headH) + '" x2="' + col.x + '" y2="' + (H - pad - 2) + '" stroke="' + LINE + '" stroke-width="1.5"/>';
    });
    // the decimal point: its own column, a big red dot on the digit line (or under the headings when there are no digits)
    const py = digits ? pad + headH + 33 : pad + headH + (counters ? 10 + ((rowsMax - 1) * gap) / 2 : -14);
    s += '<line x1="' + (cols.px + PTW / 2) + '" y1="' + (pad + headH) + '" x2="' + (cols.px + PTW / 2) + '" y2="' + (H - pad - 2) + '" stroke="' + LINE + '" stroke-width="1.5" stroke-dasharray="3 4"/>' +
      '<circle cx="' + (cols.px + PTW / 2) + '" cy="' + py + '" r="5.5" fill="' + RED + '" stroke="#FFFFFF" stroke-width="2"/>';
    const say = 'Place value chart with a decimal point: ' + (digits && !counters && spec.n != null ? 'the number ' + spec.n : sayCounts(c)) + (spec.hl ? '. One place is lit.' : '');
    return { svg: '<svg class="g4s1-svg" viewBox="0 0 ' + W + ' ' + H + '" style="max-width:' + Math.round(W * 1.55) + 'px" role="img" aria-label="' + say + '">' + s + '</svg>', cols: cols, W: W, H: H, pad: pad };
  }

  function chartPic(spec) {
    const box = el('div', { class: 'g4s1-pic g4s1-chart' });
    box.appendChild(svgNode(chartMarkup(spec).svg));
    return box;
  }

  /* ---------- the number line with tenths ---------- */

  const tenths = function (n) { return Math.round(Number(n) * 10); };
  const one = function (t) { return (t / 10).toFixed(1); };

  function lineMarkup(spec) {
    const lo = spec.lo, hi = spec.hi != null ? spec.hi : lo + 1, span = (hi - lo) * 10;
    const W = 340, x0 = 24, x1 = 316, y = spec.n != null || spec.zone != null ? 58 : 30, H = y + 44;
    const X = function (t) { return x0 + (t - lo * 10) * (x1 - x0) / span; };
    const wide = span > 10;
    let s = '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10" fill="' + PLATE + '" stroke="' + LINE + '" stroke-width="2"/>';
    let near = null;
    if (spec.n != null && spec.show) { const t = tenths(spec.n), base = Math.floor(t / 10) * 10; near = t - base >= 5 ? base + 10 : base; }
    // every number that rounds to zone: from zone − 0.5 to zone + 0.4
    if (spec.zone != null) {
      const a = spec.zone * 10 - 5, b = spec.zone * 10 + 4;
      s += '<rect x="' + (X(a) - 7) + '" y="' + (y - 13) + '" width="' + (X(b) - X(a) + 14) + '" height="26" rx="13" fill="' + GO_SOFT + '" stroke="' + GO + '" stroke-width="2"/>';
      if (spec.ends) {
        [a, b].forEach(function (t) {
          s += '<text x="' + X(t) + '" y="' + (y - 22) + '" ' + FONT + ' font-size="15" font-weight="700" text-anchor="middle" fill="#0D6943">' + one(t) + '</text>';
        });
      }
    }
    s += '<line x1="' + (x0 - 10) + '" y1="' + y + '" x2="' + (x1 + 10) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
    for (let t = lo * 10; t <= hi * 10; t++) {
      const whole = t % 10 === 0, half = Math.abs(t % 10) === 5, len = whole ? 13 : half ? 10 : 6;
      const lit = near === t, inZone = spec.zone != null && t >= spec.zone * 10 - 5 && t <= spec.zone * 10 + 4;
      s += '<line x1="' + X(t) + '" y1="' + (y - len) + '" x2="' + X(t) + '" y2="' + (y + len) + '" stroke="' + (inZone ? '#0D6943' : INK) + '" stroke-width="' + (whole ? 3 : 2) + '" stroke-linecap="round"/>';
      if (whole) {
        if (lit) s += '<circle cx="' + X(t) + '" cy="' + (y + 29) + '" r="14" fill="' + GO_SOFT + '" stroke="' + GO + '" stroke-width="3"/>';
        s += '<text x="' + X(t) + '" y="' + (y + 35) + '" ' + FONT + ' font-size="18" font-weight="700" text-anchor="middle" fill="' + INK + '">' + (t / 10) + '</text>';
      } else if (!wide || half) {
        s += '<text x="' + X(t) + '" y="' + (y + 27) + '" ' + FONT + ' font-size="' + (wide ? 11 : 10.5) + '" font-weight="' + (half ? 700 : 400) + '" text-anchor="middle" fill="' + INK2 + '">' + one(t) + '</text>';
      }
    }
    if (spec.n != null) {
      const t = tenths(spec.n), px = X(t);
      if (near != null) {
        // the jump to the nearer whole number
        const ex = X(near), mid = (px + ex) / 2;
        s += '<path d="M' + px + ' ' + (y - 9) + ' Q' + mid + ' ' + (y - 46) + ' ' + ex + ' ' + (y - 15) + '" fill="none" stroke="' + GO + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 6"/>' +
          '<path d="M' + (ex + (ex > px ? -9 : 9)) + ' ' + (y - 24) + ' L' + ex + ' ' + (y - 15) + ' L' + (ex + (ex > px ? -11 : 11)) + ' ' + (y - 11) + '" fill="none" stroke="' + GO + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
      }
      const lx = Math.max(26, Math.min(W - 26, near == null ? px : px + (near > t ? -16 : near < t ? 16 : 0)));
      s += '<circle cx="' + px + '" cy="' + y + '" r="7" fill="' + RED + '" stroke="#FFFFFF" stroke-width="2.5"/>';
      if (spec.label !== false) s += '<rect x="' + (lx - 21) + '" y="' + (y - 47) + '" width="42" height="22" rx="11" fill="#FFFFFF" stroke="' + RED + '" stroke-width="2"/>' +
        '<text x="' + lx + '" y="' + (y - 31) + '" ' + FONT + ' font-size="14" font-weight="700" text-anchor="middle" fill="' + INK + '">' + one(t) + '</text>' +
        (near == null || lx === px ? '<line x1="' + px + '" y1="' + (y - 25) + '" x2="' + px + '" y2="' + (y - 9) + '" stroke="' + RED + '" stroke-width="2"/>' : '');
    }
    const say = 'Number line from ' + lo + ' to ' + hi + ' in tenths' + (spec.n != null ? ', with a point at ' + one(tenths(spec.n)) : '') +
      (near != null ? '. It is nearer to ' + (near / 10) : '') + (spec.zone != null ? '. The numbers that round to ' + spec.zone + ' are shaded' : '');
    return '<svg class="g4s1-svg" viewBox="0 0 ' + W + ' ' + H + '" style="max-width:' + Math.round(W * 1.4) + 'px" role="img" aria-label="' + say + '">' + s + '</svg>';
  }

  function linePic(spec) {
    const box = el('div', { class: 'g4s1-pic g4s1-line' });
    box.appendChild(svgNode(lineMarkup(spec)));
    return box;
  }

  /* ---------- hundred squares: ones, tenths (columns) and hundredths (small squares) ---------- */

  function gridPic(spec) {
    let c = spec.c ? spec.c.slice() : digitsOf(spec.n).slice(1);
    while (c.length < 3) c.unshift(0);
    const ones = c[0], t = c[1], h = c[2], part = t > 0 || h > 0 || ones === 0;
    const u = 10, S = 10 * u, gap = 14, pad = 8, nsq = ones + (part ? 1 : 0);
    const W = pad * 2 + nsq * S + (nsq - 1) * gap, H = pad * 2 + S;
    let s = '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10" fill="' + PLATE + '" stroke="' + LINE + '" stroke-width="2"/>';
    for (let q = 0; q < nsq; q++) {
      const x = pad + q * (S + gap), y = pad, full = q < ones;
      s += '<rect x="' + x + '" y="' + y + '" width="' + S + '" height="' + S + '" fill="' + (full ? PL[1].c[2] : '#FFFFFF') + '"/>';
      if (full) s += '<rect x="' + x + '" y="' + y + '" width="' + S + '" height="' + S + '" fill="' + PL[1].c[0] + '" opacity=".55"/>';
      else {
        if (t) s += '<rect x="' + x + '" y="' + y + '" width="' + (t * u) + '" height="' + S + '" fill="' + PL[2].c[0] + '" opacity=".75"/>';
        if (h) s += '<rect x="' + (x + t * u) + '" y="' + y + '" width="' + u + '" height="' + (h * u) + '" fill="' + PL[3].c[0] + '" opacity=".8"/>';
      }
      for (let k = 1; k < 10; k++) {
        s += '<line x1="' + (x + k * u) + '" y1="' + y + '" x2="' + (x + k * u) + '" y2="' + (y + S) + '" stroke="' + INK2 + '" stroke-width="' + (full || k <= t ? 1.4 : .8) + '" opacity="' + (full || k <= t ? .9 : .55) + '"/>' +
          '<line x1="' + x + '" y1="' + (y + k * u) + '" x2="' + (x + S) + '" y2="' + (y + k * u) + '" stroke="' + INK2 + '" stroke-width=".8" opacity=".55"/>';
      }
      s += '<rect x="' + x + '" y="' + y + '" width="' + S + '" height="' + S + '" fill="none" stroke="' + INK + '" stroke-width="2.5"/>';
    }
    const say = 'Hundred squares: ' + (ones ? ones + (ones === 1 ? ' whole square' : ' whole squares') + ', ' : '') + t + ' full columns and ' + h + ' small squares are shaded';
    const box = el('div', { class: 'g4s1-pic g4s1-grid' });
    box.appendChild(svgNode('<svg class="g4s1-svg" viewBox="0 0 ' + W + ' ' + H + '" style="max-width:' + Math.round(W * 1.15) + 'px" role="img" aria-label="' + say + '">' + s + '</svg>'));
    return box;
  }

  const kinds = T.tools.picKinds = T.tools.picKinds || {};
  kinds.s1chart = chartPic;
  kinds.s1line = linePic;
  kinds.s1grid = gridPic;

  /* ---------- tool: draw counters in the chart ---------- */

  function build(host, spec) {
    spec = spec || {};
    const ev = T.tools.emitter(), max = spec.max || 20;
    const b = (spec.start || [0, 0, 0, 0]).slice(), lock = spec.lock || [false, false, false, false];
    let locked = !!spec.fixed, shown = false;
    const root = el('div', { class: 'g4s1-build', role: 'group', 'aria-label': 'Place value chart. Draw counters with the plus and minus buttons.' });
    const pic = el('div', { class: 'g4s1-build__pic' }), ctl = el('div', { class: 'g4s1-build__ctl' });
    root.appendChild(pic); root.appendChild(ctl);
    const btns = [];
    function draw() {
      const m = chartMarkup({ c: b, tens: !!spec.tens, digits: false, counters: true, counts: true, rows: 4 });
      pic.innerHTML = m.svg;
      if (!ctl.children.length) {
        // the buttons sit under their own place: the same widths as the chart, as parts of its whole width
        const widths = [m.pad];
        let x = m.pad;
        m.cols.forEach(function (col) { if (col.x > x) { widths.push(col.x - x); } widths.push(col.w); x = col.x + col.w; });
        widths.push(m.pad);
        ctl.style.gridTemplateColumns = widths.map(function (w) { return w + 'fr'; }).join(' ');
        ctl.style.maxWidth = Math.round(m.W * 1.55) + 'px';
        ctl.appendChild(el('span'));
        x = m.pad;
        m.cols.forEach(function (col) {
          if (col.x > x) ctl.appendChild(el('span'));
          const p = PL[col.i], cell = el('span', { class: 'g4s1-build__cell' });
          if (lock[col.i]) cell.appendChild(el('span', { class: 'g4s1-build__fixed' }, 'fixed'));
          else [-1, 1].forEach(function (d) {
            const bt = el('button', { type: 'button', class: 'g4s1-step', dataset: { i: String(col.i), d: String(d) },
              'aria-label': (d > 0 ? 'Draw one more counter in the ' : 'Rub out one counter in the ') + p.many }, d > 0 ? '+' : '−');
            bt.addEventListener('click', function () { step(col.i, d); });
            btns.push(bt); cell.appendChild(bt);
          });
          ctl.appendChild(cell);
          x = col.x + col.w;
        });
        ctl.appendChild(el('span'));
      }
      btns.forEach(function (bt) { const i = +bt.dataset.i, d = +bt.dataset.d; bt.disabled = locked || (d < 0 ? b[i] <= 0 : b[i] >= max); });
      root.classList.toggle('is-shown', shown);
    }
    function step(i, d) {
      if (locked || lock[i]) return;
      const v = b[i] + d;
      if (v < 0 || v > max) return;
      b[i] = v;
      sfx(d > 0 ? 'pick' : 'pop');
      draw();
      ev.emit('change', { b: b.slice() });
    }
    draw();
    mount(host, root);
    return {
      el: root, on: ev.on, get: function () { return { b: b.slice() }; },
      ready: function () { return b.some(function (v, i) { return v > 0 && !lock[i]; }); },
      lock: function () { locked = true; draw(); },
      solve: function (r) { if (r && Array.isArray(r.b)) { r.b.forEach(function (v, i) { b[i] = v; }); shown = true; draw(); } },
      set: function (r) { if (r && Array.isArray(r.b)) { r.b.forEach(function (v, i) { b[i] = v; }); draw(); } },
      tip: function () { return btns.filter(function (bt) { return !bt.disabled && +bt.dataset.d > 0; })[0] || null; },
      destroy: function () { if (root.parentNode) root.parentNode.removeChild(root); }
    };
  }

  /* ---------- tool: tap the nearer whole number ---------- */

  function round(host, spec) {
    spec = spec || {};
    const ev = T.tools.emitter(), lo = spec.lo, hi = lo + 1;
    let choice = null, locked = !!spec.fixed, done = false;
    const root = el('div', { class: 'g4s1-near', role: 'group', 'aria-label': 'Number line from ' + lo + ' to ' + hi + '. Tap the nearer whole number.' });
    const pic = el('div', { class: 'g4s1-near__pic' }), row = el('div', { class: 'g4s1-near__row' });
    const btns = [lo, hi].map(function (v) {
      const bt = el('button', { type: 'button', class: 'g4s1-near__btn', dataset: { v: String(v) }, 'aria-pressed': 'false' }, String(v));
      bt.addEventListener('click', function () { if (locked) return; choice = v; sfx('pick'); draw(); ev.emit('change', { choice: v }); });
      row.appendChild(bt);
      return bt;
    });
    function draw() {
      pic.innerHTML = lineMarkup({ lo: lo, n: spec.n, show: done });
      btns.forEach(function (bt) {
        const on = +bt.dataset.v === choice;
        bt.classList.toggle('is-on', on); bt.setAttribute('aria-pressed', on ? 'true' : 'false'); bt.disabled = locked;
      });
    }
    root.appendChild(pic); root.appendChild(row);
    draw();
    mount(host, root);
    return {
      el: root, on: ev.on, get: function () { return { choice: choice }; },
      ready: function () { return choice != null; },
      lock: function () { locked = true; draw(); },
      solve: function (r) { if (r && typeof r.choice === 'number') { choice = r.choice; done = true; draw(); } },
      set: function (r) { if (r && typeof r.choice === 'number') { choice = r.choice; draw(); } },
      tip: function () { return btns[0]; },
      destroy: function () { if (root.parentNode) root.parentNode.removeChild(root); }
    };
  }

  T.tools.s1build = build;      // stop-prefixed names, so no other stop's tool can clash
  T.tools.s1near = round;
})(window.T = window.T || {});
