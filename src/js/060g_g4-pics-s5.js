/* g4-pics-s5.js - Stop 5 (Fractions, decimals and percentages): the pictures, two small tools and the fraction painter.
   Styles: src/css/030g_g4-s5.css (every class starts with g4s5-). Values are strings as in the models: '3/10', '0.7', '70%'.

   Picture kinds (T.tools.pic(spec)):
     { k: 's5grid', n, b, style, cols, size, cap }   a shape of 100 equal squares, n shaded (blue) and then b more (gold: a second shading).
          style: 'rows' (default) | 'cols' | 'block' (blocks 5 wide) | 'scatter'; cols: 10 (default) | 20 | 25 (a 5 x 20 or 4 x 25 shape);
          size: 's' (an option tile) | 'm' (a hint) | 'l' (default, a question figure); cap: a caption ('1/4 = 25%' shows a real fraction)
     { k: 's5line', marks: ['0.6', '35%'], flags, blank: { row: 'f' | 'd' | 'p', i: 6 }, cap }   the equivalence strip: one bar from 0 to 1 in
          tenths, with the fractions above and the decimals and the percentages below. marks: a tenth lights its column; any other value
          (or every mark with flags: true) gets a pin with its own label. One mark fills the bar up to it. blank: a "?" in place of a label.
     { k: 's5bars', den, nums: [4, 7], cap }          fraction bars with the same denominator, one under the other, to compare

   Tools (a question's task.ui.k):
     T.tools.s5shade(host, { n })       the hundred square to shade: tap a square, or -10 -1 +1 +10. get() -> { shaded }
     T.tools.s5order(host, { items: [{ html, txt }], from, to })   tiles with fractions, decimals and percentages to put in order.
                                        get() -> { order: [item number | null], placed }; mark(parts); solve({ order })

   The fraction painter: Notes, Lightning and the word cards show plain text only (textContent). On the screens of Stop 5 every
   "3/10" in a text node is redrawn as a real fraction (numerator over denominator, class g4s5-frac). Its plain text stays "3/10". */
(function (T) {
  'use strict';

  const el = T.util.el;
  const S = window.MX.s5;
  const kinds = T.tools.picKinds = T.tools.picKinds || {};
  const sfx = function (name) { try { if (T.fx && T.fx.sfx) T.fx.sfx(name); } catch (e) { /* sound is a nicety */ } };
  const mount = function (host, node) { if (host) host.appendChild(node); return node; };

  /* ---------- the shape of 100 squares ---------- */

  // the order in which the squares are shaded
  function gridOrder(style, cols) {
    const rows = 100 / cols, out = [];
    if (style === 'cols') { for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) out.push(r * cols + c); }
    else if (style === 'scatter') { for (let i = 0; i < 100; i++) out.push((i * 37 + 11) % 100); }
    else if (style === 'block') { for (let c0 = 0; c0 < cols; c0 += 5) for (let r = 0; r < rows; r++) for (let c = c0; c < c0 + 5; c++) out.push(r * cols + c); }
    else { for (let i = 0; i < 100; i++) out.push(i); }
    return out;
  }
  function gridState(n, b, style, cols) {
    const st = new Array(100).fill(0), order = gridOrder(style, cols);
    order.slice(0, n).forEach(function (i) { st[i] = 1; });
    order.slice(n, n + (b || 0)).forEach(function (i) { st[i] = 2; });
    return st;
  }
  function gridSvg(st, cols) {
    const rows = 100 / cols;
    let s = '<svg xmlns="http://www.w3.org/2000/svg" class="g4s5-grid__svg" viewBox="0 0 ' + (cols * 10 + 2) + ' ' + (rows * 10 + 2) + '" aria-hidden="true" focusable="false">';
    st.forEach(function (v, i) {
      s += '<rect x="' + (1 + (i % cols) * 10) + '" y="' + (1 + Math.floor(i / cols) * 10) + '" width="10" height="10" class="g4s5-grid__c' + (v ? ' is-' + (v === 1 ? 'a' : 'b') : '') + '"/>';
    });
    return s + '<rect x="1" y="1" width="' + cols * 10 + '" height="' + rows * 10 + '" class="g4s5-grid__edge"/></svg>';
  }
  kinds.s5grid = function (spec) {
    const cols = spec.cols || 10, n = spec.n || 0, b = spec.b || 0;
    const fig = el('figure', { class: ['g4s5-pic', 'g4s5-grid', 'g4s5-grid--' + (spec.size || 'l'), cols !== 10 && 'g4s5-grid--wide'], role: 'img',
      'aria-label': 'A shape made of 100 equal squares. ' + (b ? n + ' squares are blue and ' + b + ' are gold.' : n + (n === 1 ? ' square is' : ' squares are') + ' shaded.') });
    fig.innerHTML = gridSvg(gridState(n, b, spec.style, cols), cols);
    if (spec.cap) fig.appendChild(el('figcaption', { class: 'g4s5-cap', html: S.rich(spec.cap) }));
    return fig;
  };

  /* ---------- the equivalence strip: fractions, decimals and percentages on one line ---------- */

  const X0 = 30, STEP = 54, LW = X0 * 2 + STEP * 10;
  const lx = function (h) { return X0 + h / 100 * STEP * 10; };
  const txt = function (x, y, cls, t) { return '<text x="' + x + '" y="' + y + '" class="' + cls + '">' + t + '</text>'; };
  // a fraction drawn in an SVG: numerator, bar, denominator, centred at x; y = the bar
  function svgFrac(x, y, n, d, cls) {
    const w = Math.max(String(n).length, String(d).length) * 7.5 + 4;
    return txt(x, y - 6, cls, n) + '<path d="M' + (x - w) + ' ' + y + 'h' + 2 * w + '" class="g4s5-line__fb"/>' + txt(x, y + 21, cls, d);
  }
  function svgVal(x, y, v, cls) { return v.k === 'f' ? svgFrac(x, y, v.n, v.d, cls) : txt(x, y + 8, cls, v.txt); }
  const FLAG_H = 56, LEVEL = 62;
  const flagW = function (v) { return v.k === 'f' ? 44 : Math.max(50, v.txt.length * 14 + 14); };
  kinds.s5line = function (spec) {
    const marks = (spec.marks || []).map(S.V).map(function (v) { return { v: v, h: S.hund(v) }; }).filter(function (m) { return m.h != null && m.h >= 0 && m.h <= 100; })
      .sort(function (a, b) { return a.h - b.h; });
    const blank = spec.blank || null, flags = !!spec.flags;
    const pins = marks.filter(function (m) { return flags || m.h % 10 !== 0; });
    const bands = flags ? [] : marks.filter(function (m) { return m.h % 10 === 0; });
    // a flag goes on the first level where it does not touch a flag already there
    const placed = [];
    pins.forEach(function (m) {
      m.w = flagW(m.v);
      let lv = 0;
      while (placed.some(function (o) { return o.lv === lv && Math.abs(lx(o.h) - lx(m.h)) < (o.w + m.w) / 2 + 6; })) lv++;
      m.lv = lv; placed.push(m);
    });
    const levels = pins.length ? Math.max.apply(null, pins.map(function (m) { return m.lv; })) + 1 : 0;
    const H = 160 + (levels ? (levels - 1) * LEVEL + FLAG_H + 6 : 0);
    let s = '<svg xmlns="http://www.w3.org/2000/svg" class="g4s5-line__svg" viewBox="0 0 ' + LW + ' ' + H + '" aria-hidden="true" focusable="false">';
    bands.forEach(function (m) { s += '<rect x="' + (lx(m.h) - 25) + '" y="2" width="50" height="154" rx="10" class="g4s5-line__band"/>'; });
    const fillTo = marks.length === 1 && !flags ? marks[0].h : 0;
    for (let i = 0; i < 10; i++) s += '<rect x="' + lx(i * 10) + '" y="66" width="' + STEP + '" height="26" class="g4s5-line__seg' + (i % 2 ? ' is-odd' : '') + '"/>';
    if (fillTo) s += '<rect x="' + lx(0) + '" y="66" width="' + (lx(fillTo) - lx(0)) + '" height="26" class="g4s5-line__fill"/>';
    s += '<rect x="' + lx(0) + '" y="66" width="' + STEP * 10 + '" height="26" class="g4s5-line__edge"/>';
    // the pins go behind the labels, so a pin never hides a label
    pins.forEach(function (m) { s += '<path d="M' + lx(m.h) + ' 56V' + (160 + m.lv * LEVEL + 2) + '" class="g4s5-line__pin"/>'; });
    for (let i = 0; i <= 10; i++) {
      const x = lx(i * 10);
      s += '<path d="M' + x + ' 60v38" class="g4s5-line__tick"/>';
      const ask = function (row) { return blank && blank.row === row && blank.i === i; };
      const q = function (y) { return '<rect x="' + (x - 22) + '" y="' + (y - 22) + '" width="44" height="30" rx="6" class="g4s5-line__ask"/>' + txt(x, y, 'g4s5-line__t is-ask', '?'); };
      if (ask('f')) s += q(40); else s += i === 0 ? txt(x, 40, 'g4s5-line__t', '0') : i === 10 ? txt(x, 40, 'g4s5-line__t', '1') : svgFrac(x, 30, i, 10, 'g4s5-line__t is-f');
      if (ask('d')) s += q(122); else s += txt(x, 122, 'g4s5-line__t is-d', i === 0 ? '0' : i === 10 ? '1.0' : '0.' + i);
      if (ask('p')) s += q(150); else s += txt(x, 150, 'g4s5-line__t is-p', i * 10 + '%');
    }
    pins.forEach(function (m) {
      const x = lx(m.h), y = 160 + m.lv * LEVEL;
      s += '<circle cx="' + x + '" cy="79" r="5.5" class="g4s5-line__dot"/>' +
        '<rect x="' + (x - m.w / 2) + '" y="' + (y + 2) + '" width="' + m.w + '" height="' + FLAG_H + '" rx="8" class="g4s5-line__flag"/>' + svgVal(x, y + 30, m.v, 'g4s5-line__t is-flag');
    });
    s += '</svg>';
    const fig = el('figure', { class: ['g4s5-pic', 'g4s5-line'], role: 'img',
      'aria-label': 'A number line from 0 to 1 in tenths. Each tenth is shown as a fraction, a decimal and a percentage.' + (marks.length ? ' Marked: ' + marks.map(function (m) { return m.v.txt; }).join(', ') + '.' : '') });
    fig.innerHTML = s;
    if (spec.cap) fig.appendChild(el('figcaption', { class: 'g4s5-cap', html: S.rich(spec.cap) }));
    return fig;
  };

  /* ---------- fraction bars with the same denominator ---------- */

  kinds.s5bars = function (spec) {
    const den = spec.den, nums = spec.nums || [];
    const fig = el('figure', { class: ['g4s5-pic', 'g4s5-bars'], role: 'img',
      'aria-label': 'Fraction bars cut into ' + den + ' equal parts: ' + nums.map(function (n) { return n + ' of ' + den + ' parts shaded'; }).join('; ') + '.' });
    nums.forEach(function (n, k) {
      const bar = el('span', { class: ['g4s5-bars__bar', 'g4s5-bars__bar--' + (k % 3)] });
      for (let i = 0; i < den; i++) bar.appendChild(el('i', { class: i < n ? 'is-on' : null }));
      fig.appendChild(el('div', { class: 'g4s5-bars__row' }, el('span', { class: 'g4s5-bars__lab', html: S.F(n, den) }), bar));
    });
    if (spec.cap) fig.appendChild(el('figcaption', { class: 'g4s5-cap', html: S.rich(spec.cap) }));
    return fig;
  };

  /* ---------- Zip's first line for the two tools (added when a tool is first made: the kit loads after this file) ---------- */

  function doLines() {
    const DO = T.zipLines && T.zipLines.model && T.zipLines.model.doLines;
    if (!DO || DO.s5shade) return;
    DO.s5shade = { en: 'Tap squares to *shade* them.', vi: 'Bấm vào các ô vuông để *tô màu*.' };
    DO.s5order = { en: 'Tap the numbers in order, *smallest* first.', vi: 'Bấm các số theo thứ tự, số *bé nhất* trước.' };
  }

  /* ---------- the tool: shade the hundred square ---------- */

  function s5shade(host, spec) {
    spec = spec || {};
    doLines();
    const ev = T.tools.emitter(), on = new Array(100).fill(false);
    for (let i = 0; i < Math.min(100, spec.n || 0); i++) on[i] = true;
    let locked = !!spec.fixed;
    const count = function () { return on.filter(Boolean).length; };
    const grid = el('div', { class: 'g4s5-shade__grid', role: 'group', 'aria-label': 'A hundred square. Tap a square to shade it.' });
    const cells = on.map(function (x, i) {
      const c = el('button', { type: 'button', class: 'g4s5-shade__c', tabindex: '-1', 'aria-label': 'Square ' + (i + 1) });
      c.addEventListener('click', function () { if (locked) return; on[i] = !on[i]; sfx(on[i] ? 'snap' : 'pop'); paint(); ev.emit('change', get()); });
      grid.appendChild(c);
      return c;
    });
    const info = el('p', { class: 'g4s5-shade__info', 'aria-live': 'polite' });
    function step(d) {
      if (locked) return;
      let left = Math.abs(d);
      while (left-- > 0) {
        const i = d > 0 ? on.indexOf(false) : on.lastIndexOf(true);
        if (i < 0) break;
        on[i] = d > 0;
      }
      sfx(d > 0 ? 'snap' : 'pop'); paint(); ev.emit('change', get());
    }
    const btn = function (label, d, aria) {
      const b = el('button', { type: 'button', class: ['g4s5-shade__b', d > 0 && 'is-plus'], 'aria-label': aria }, label);
      b.addEventListener('click', function () { step(d); });
      return b;
    };
    const minus10 = btn('−10', -10, 'Rub out 10 squares'), minus1 = btn('−1', -1, 'Rub out 1 square');
    const plus1 = btn('+1', 1, 'Shade 1 square'), plus10 = btn('+10', 10, 'Shade 10 squares');
    const ctl = el('div', { class: 'g4s5-shade__ctl' }, minus10, minus1, info, plus1, plus10);
    const root = el('div', { class: 'g4s5-shade' }, grid, ctl);
    function get() { return { shaded: count() }; }
    function paint() {
      const n = count();
      cells.forEach(function (c, i) { c.classList.toggle('is-on', on[i]); c.disabled = locked; c.setAttribute('aria-pressed', on[i] ? 'true' : 'false'); });
      T.ui.empty(info); info.appendChild(el('b', String(n))); info.appendChild(document.createTextNode(n === 1 ? ' square' : ' squares'));
      minus10.disabled = minus1.disabled = locked || n === 0;
      plus1.disabled = plus10.disabled = locked || n === 100;
    }
    paint();
    mount(host, root);
    return {
      el: root, get: get, on: ev.on,
      set: function (v) { const n = v && v.shaded != null ? v.shaded : +v || 0; on.fill(false); for (let i = 0; i < n; i++) on[i] = true; paint(); },
      solve: function (r) { if (!r || r.shaded == null) return; on.fill(false); for (let i = 0; i < r.shaded; i++) on[i] = true; root.classList.add('is-shown'); paint(); },
      ready: function () { return count() > 0; },
      lock: function () { locked = true; paint(); },
      tip: function () { return plus10.disabled ? null : plus10; },
      destroy: function () { if (root.parentNode) root.parentNode.removeChild(root); }
    };
  }

  /* ---------- the tool: tiles to put in order (the look of the number tiles of 39-tools-order.css) ---------- */

  function s5order(host, spec) {
    spec = spec || {};
    doLines();
    const items = (spec.items || []).slice(), ev = T.tools.emitter();
    const slots = items.map(function () { return null; }), used = items.map(function () { return -1; });
    let locked = !!spec.fixed, bad = null;
    const wide = Math.max.apply(null, items.map(function (x) { return /\//.test(x.txt) ? 2 : x.txt.length; }).concat([2]));
    const root = el('div', { class: 'ord g4s5-ord', role: 'group', 'aria-label': 'Put the numbers in order, ' + (spec.from || 'smallest') + ' first', style: '--ch:' + wide });
    const row = el('div', { class: 'ord__row' });
    const slotEls = slots.map(function (x, i) {
      const s = el('button', { type: 'button', class: 'ord__slot', dataset: { i: String(i) } });
      s.addEventListener('click', function () { takeBack(i); });
      row.appendChild(s);
      return s;
    });
    const ends = el('p', { class: 'ord__ends', 'aria-hidden': 'true' }, el('span', spec.from || 'smallest'), el('i', { class: 'ord__arrow' }), el('span', spec.to || 'greatest'));
    const pool = el('div', { class: 'ord__pool' });
    const tiles = items.map(function (it, j) {
      const t = el('button', { type: 'button', class: 'ord__tile', dataset: { j: String(j) }, 'aria-label': it.txt, html: it.html });
      t.addEventListener('click', function () { place(j); });
      pool.appendChild(t);
      return t;
    });
    root.appendChild(row); root.appendChild(ends); root.appendChild(pool);
    const placed = function () { return slots.filter(function (j) { return j != null; }).length; };
    function get() { return { order: slots.slice(), placed: placed() }; }
    function paint(fresh) {
      slotEls.forEach(function (s, i) {
        const j = slots[i];
        s.textContent = '';
        if (j != null) s.appendChild(el('span', { class: ['ord__tile', 'is-in', fresh === i && 'is-new'], html: items[j].html }));
        s.classList.toggle('is-full', j != null);
        s.classList.toggle('is-bad', !!bad && bad[i] === false && j != null);
        s.disabled = locked || j == null;
        s.setAttribute('aria-label', 'Place ' + (i + 1) + (j == null ? ', empty' : ': ' + items[j].txt + (locked ? '' : '. Tap to take it back')));
      });
      tiles.forEach(function (t, j) { t.classList.toggle('is-gone', used[j] >= 0); t.disabled = locked || used[j] >= 0; });
    }
    function place(j) {
      if (locked || used[j] >= 0) return false;
      const i = slots.indexOf(null);
      if (i < 0) return false;
      slots[i] = j; used[j] = i; bad = null;
      sfx('snap'); paint(i); ev.emit('change', get());
      return true;
    }
    function takeBack(i) {
      if (locked || slots[i] == null) return;
      used[slots[i]] = -1; slots[i] = null; bad = null;
      sfx('pop'); paint(-1); ev.emit('change', get());
    }
    function solve(r) {
      if (!r || !Array.isArray(r.order)) return;
      slots.fill(null); used.fill(-1);
      r.order.forEach(function (j, i) { if (j != null && items[j] && used[j] < 0 && i < slots.length) { slots[i] = j; used[j] = i; } });
      bad = null; paint(-1);
    }
    paint(-1);
    mount(host, root);
    return {
      el: root, get: get, on: ev.on, solve: solve, set: solve,
      ready: function () { return slots.every(function (j) { return j != null; }); },
      lock: function () { locked = true; paint(-1); },
      mark: function (parts) { bad = Array.isArray(parts) ? parts : null; paint(-1); },
      tip: function () { return tiles.filter(function (t) { return !t.disabled; })[0] || null; },
      destroy: function () { if (root.parentNode) root.parentNode.removeChild(root); }
    };
  }

  T.tools.s5shade = s5shade;
  T.tools.s5order = s5order;

  /* ---------- the fraction painter (Stop 5 screens only) ---------- */

  const RX = /(^|[^\d\/.,])(\d{1,3})\/(\d{1,3})(?![\d\/])/g;
  // never painted: scores and marks ("1/2" marks is not one half), form fields, pictures, the number pad
  const SKIP = '.g4s5-frac, script, style, textarea, input, select, svg, title, [contenteditable], .npad, .tp-mk__got, .tp-got, .pcx-cell, .wd-set__num, [data-no-frac]';
  const onStop5 = function () { return /stop-5(?!\d)/.test(String(location.hash || '')); };
  function paintText(node) {
    const text = node.nodeValue, parent = node.parentNode;
    if (!parent || !text || text.indexOf('/') < 0 || (parent.closest && parent.closest(SKIP))) return;
    RX.lastIndex = 0;
    if (!RX.test(text)) return;
    RX.lastIndex = 0;
    const frag = document.createDocumentFragment(), holder = document.createElement('span');
    let at = 0, m;
    while ((m = RX.exec(text))) {
      const start = m.index + m[1].length;
      if (start > at) frag.appendChild(document.createTextNode(text.slice(at, start)));
      holder.innerHTML = S.F(m[2], m[3]);
      frag.appendChild(holder.firstChild);
      at = m.index + m[0].length;
    }
    if (at < text.length) frag.appendChild(document.createTextNode(text.slice(at)));
    parent.replaceChild(frag, node);
  }
  function paintIn(root) {
    if (!root) return;
    if (root.nodeType === 3) { paintText(root); return; }
    if (root.nodeType !== 1 || (root.closest && root.closest(SKIP))) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), list = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.indexOf('/') >= 0) list.push(walker.currentNode);
    list.forEach(paintText);
  }
  function startPainter() {
    if (typeof MutationObserver === 'undefined' || !document.body) return;
    try {
      new MutationObserver(function (muts) {
        if (!onStop5()) return;
        try {
          muts.forEach(function (mu) {
            if (mu.type === 'characterData') paintIn(mu.target);
            else for (let i = 0; i < mu.addedNodes.length; i++) paintIn(mu.addedNodes[i]);
          });
        } catch (e) { /* a plain "3/10" is still right */ }
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    } catch (e) { /* no painter: fractions stay as plain text */ }
  }
  if (document.body) startPainter(); else document.addEventListener('DOMContentLoaded', startPainter);
  T.tools.s5paint = paintIn;
})(window.T = window.T || {});
