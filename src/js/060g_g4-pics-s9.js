/* g4-pics-s9.js - the pictures of Stop 9, Mode and median (Grade 4, Stage 5). Styles: src/css/030g_g4-s9.css.

   T.tools.pic(spec) kinds (all return one <figure class="g4s9-pic ...">):
   s9cards  data cards in a row      { k: 's9cards', data: [3, 5, 5, '?'], hl: [1, 2] (card numbers to light up),
                                       cross: 2 (pairs crossed off from both ends), cap: 'a caption' }
            The cards are drawn in the order of data (the models sort it when they want it sorted). Words make wider
            cards and wrap onto more rows. '?' is a card to find. 8 or more number cards are drawn twice, in one row and in
            two rows; CSS (a container query) shows the two rows where the place is narrow.
   s9table  a data table in rows     { k: 's9table', head: 'Day', cols: ['Mon', 'Tue'], rows: [{ name: 'Rain (mm)', vals: [5, 0] }], hl: 0 (a row) }
            Drawn twice, across (as on the paper) and turned (one line for each thing): CSS shows the turned table where
            the place is narrow (a container query), so 7 columns never overflow a phone.
   s9tally  a tally / frequency table { k: 's9tally', head: ['Fruit', 'Number of children'], cats: [..], freq: [..],
                                       tally: true (a column of tally marks), showFreq: true (a column of numbers), hl: true (light the mode row) }
   s9bar    a simple bar chart        { k: 's9bar', cats: [..], freq: [..], xlab, ylab, vals: true (the number on each bar), hl: true (light the mode bar),
                                       ph: 90 (a lower plot for a short place, e.g. a note; default 160) }
   s9dot    a dot plot                { k: 's9dot', cats: [..], freq: [..], xlab, vals: true, hl: true }
   hl: true lights every column or row with the highest frequency (worked out here, never in the data). */
(function (T) {
  'use strict';

  const el = T.util.el;
  const kinds = T.tools.picKinds = T.tools.picKinds || {};
  const INK = '#10305E', INK2 = '#3D5A85', LINE = '#B8C8DB', GOLD = '#F5A623', GOLD_E = '#C17B08', SOFT = '#FFF1CF', BLUE = '#2F7FD4', BLUE_E = '#1D62AE', NO = '#D0503F';

  const isNum = function (v) { return typeof v === 'number'; };
  const show = function (v) { return isNum(v) && window.MX && window.MX.dfmt ? window.MX.dfmt(v) : String(v); };
  const esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  function svgNode(s) { const d = document.createElement('div'); d.innerHTML = s; return d.firstChild; }
  function figure(cls, svg, cap, maxW) {
    const f = el('figure', { class: 'g4s9-pic ' + cls });
    if (maxW) f.style.maxWidth = maxW + 'px';
    if (svg) f.appendChild(typeof svg === 'string' ? svgNode(svg) : svg);
    if (cap) f.appendChild(el('figcaption', { class: 'g4s9-cap', html: String(cap) }));
    return f;
  }
  // which places hold the highest number (all of them when there is a tie; none when every number is the same)
  function tops(freq) {
    const top = Math.max.apply(null, freq), at = [];
    freq.forEach(function (f, i) { if (f === top) at.push(i); });
    return at.length === freq.length && freq.length > 1 ? [] : at;
  }

  /* ---------- data cards ---------- */
  kinds.s9cards = function (spec) {
    const data = spec.data || [], hl = spec.hl || [], n = data.length, cross = spec.cross || 0;
    const words = data.some(function (v) { return !isNum(v) && v !== '?'; });
    const fs = words ? 19 : 26, H = 56, gap = 8, rowGap = 10;
    const ws = data.map(function (v) { return Math.max(words ? 56 : 48, Math.round(show(v).length * fs * 0.6) + 22); });
    const sum = ws.reduce(function (x, y) { return x + y + gap; }, 0);
    // one drawing of the cards, broken into rows no wider than maxRow (the cards keep their order: row 1, then row 2)
    function draw(maxRow) {
      const rows = [[]]; let w = 0;
      ws.forEach(function (cw, i) {
        const r = rows[rows.length - 1];
        if (r.length && w + cw + gap > maxRow) { rows.push([i]); w = cw + gap; } else { r.push(i); w += cw + gap; }
      });
      const rowW = rows.map(function (r) { return r.reduce(function (s2, i) { return s2 + ws[i] + gap; }, -gap); });
      const W = Math.max.apply(null, rowW) + 8, HH = rows.length * (H + rowGap) - rowGap + 8;
      let s = '';
      rows.forEach(function (r, k) {
        let x = (W - rowW[k]) / 2; const y = 4 + k * (H + rowGap);
        r.forEach(function (i) {
          const on = hl.indexOf(i) >= 0, off = i < cross || i >= n - cross, ask = data[i] === '?';
          s += '<g' + (off ? ' opacity=".5"' : '') + '><rect x="' + x + '" y="' + y + '" width="' + ws[i] + '" height="' + H + '" rx="9" fill="' + (on ? SOFT : '#FFFFFF') +
            '" stroke="' + (on ? GOLD_E : ask ? INK2 : LINE) + '" stroke-width="' + (on ? 4 : 2.5) + '"' + (ask ? ' stroke-dasharray="6 5"' : '') + '/>' +
            '<text x="' + (x + ws[i] / 2) + '" y="' + (y + H / 2 + fs * 0.36) + '" font-size="' + fs + '" text-anchor="middle" fill="' + (ask ? INK2 : INK) + '">' + esc(show(data[i])) + '</text></g>';
          if (off) s += '<path d="M' + (x + 7) + ' ' + (y + H - 7) + 'L' + (x + ws[i] - 7) + ' ' + (y + 7) + '" stroke="' + NO + '" stroke-width="4" stroke-linecap="round"/>';
          x += ws[i] + gap;
        });
      });
      return { W: W, svg: function (cls) { return '<svg class="g4s9-svg' + (cls ? ' ' + cls : '') + '" viewBox="0 0 ' + W + ' ' + HH + '" role="img" aria-label="' + esc(say) + '">' + s + '</svg>'; } };
    }
    const say = 'Data cards: ' + data.map(show).join(', ') + (hl.length ? '. Lit: ' + hl.map(function (i) { return show(data[i]); }).join(', ') : '') + (cross ? '. ' + cross + ' crossed off at each end' : '');
    if (words) { const d = draw(430); return figure('g4s9-cards', d.svg(), spec.cap, Math.round(d.W * 1.05)); }
    if (n < 8) { const d = draw(1e9); return figure('g4s9-cards', d.svg(), spec.cap, Math.round(d.W * 1.05)); }
    // 8 or more number cards: one row where there is room, two rows in a narrow place (a phone). Both are drawn; a container
    // query in the CSS shows one of them, so the numbers never get too small to read and a wide screen keeps one row.
    const one = draw(1e9), two = draw(Math.ceil(sum / 2) + 30);
    // the one row shows only where it is at least 72% of its drawn size (numbers about 19 px high): CSS has a class for
    // each 20 px step from 300 px to 500 px
    const step = Math.min(25, Math.max(15, Math.ceil(one.W * 0.72 / 20)));
    const f = figure('g4s9-cards g4s9-cards--many g4s9-cards--b' + step, null, spec.cap, Math.round(one.W * 1.05));
    const box = document.createElement('div'); box.className = 'g4s9-cards__box';
    box.innerHTML = one.svg('g4s9-cards__one') + two.svg('g4s9-cards__two');
    f.insertBefore(box, f.firstChild);
    return f;
  };

  /* ---------- a data table in rows ---------- */
  kinds.s9table = function (spec) {
    const cols = spec.cols || [], rows = spec.rows || [];
    // across: one row for each kind of data (as on the paper)
    const tbl = el('table', { class: 'g4s9-tbl g4s9-tbl--across' });
    const head = el('tr', {}, el('th', { scope: 'col', class: 'g4s9-tbl__name' }, spec.head || ''));
    cols.forEach(function (c) { head.appendChild(el('th', { scope: 'col' }, String(c))); });
    tbl.appendChild(head);
    rows.forEach(function (r, k) {
      const tr = el('tr', { class: spec.hl === k ? 'is-hl' : '' }, el('th', { scope: 'row', class: 'g4s9-tbl__name' }, r.name));
      r.vals.forEach(function (v) { tr.appendChild(el('td', {}, show(v))); });
      tbl.appendChild(tr);
    });
    // down: the same table turned, for a narrow place (a phone, the test paper); CSS shows one of the two
    const down = el('table', { class: 'g4s9-tbl g4s9-tbl--down' });
    const h2 = el('tr', {}, el('th', { scope: 'col' }, spec.head || ''));
    rows.forEach(function (r) { h2.appendChild(el('th', { scope: 'col' }, r.name)); });
    down.appendChild(h2);
    cols.forEach(function (c, i) {
      const tr = el('tr', {}, el('th', { scope: 'row' }, String(c)));
      rows.forEach(function (r) { tr.appendChild(el('td', {}, show(r.vals[i]))); });
      down.appendChild(tr);
    });
    const f = figure('g4s9-table g4s9-table--c' + (cols.length > 5 ? 'many' : 'few'), null, spec.cap, cols.length > 5 ? 600 : 480);
    f.insertBefore(el('div', { class: 'g4s9-table__box' }, tbl, down), f.firstChild);
    return f;
  };

  /* ---------- a tally chart / frequency table ---------- */
  // one small drawing for each group of five, so a long row of marks wraps in a narrow cell instead of shrinking
  function tallyMarks(n) {
    const groups = Math.ceil(n / 5) || 1; let out = '';
    for (let g = 0; g < groups; g++) {
      const k = Math.min(5, n - g * 5); let s = '';
      for (let i = 0; i < Math.min(4, k); i++) s += '<path d="M' + (5 + i * 7) + ' 4V22"/>';
      if (k === 5) s += '<path d="M1 20L30 6"/>';
      out += '<svg class="g4s9-tally__g" viewBox="0 0 40 26" style="width:2.5rem" aria-hidden="true" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round">' + s + '</svg>';
    }
    return '<span class="g4s9-tally__marks" role="img" aria-label="' + n + ' tally marks">' + out + '</span>';
  }
  kinds.s9tally = function (spec) {
    const cats = spec.cats || [], freq = spec.freq || [], lit = spec.hl ? tops(freq) : [];
    const tally = spec.tally !== false && !!spec.tally, nums = spec.showFreq !== false;
    const tbl = el('table', { class: 'g4s9-tbl g4s9-tbl--freq' });
    const head = el('tr', {}, el('th', { scope: 'col' }, (spec.head || [])[0] || ''));
    if (tally) head.appendChild(el('th', { scope: 'col' }, 'Tally'));
    if (nums) head.appendChild(el('th', { scope: 'col' }, (spec.head || [])[1] || 'Frequency'));
    tbl.appendChild(head);
    cats.forEach(function (c, i) {
      const tr = el('tr', { class: lit.indexOf(i) >= 0 ? 'is-hl' : '' }, el('th', { scope: 'row' }, show(c)));
      if (tally) tr.appendChild(el('td', { class: 'g4s9-tally__cell', html: tallyMarks(freq[i]) }));
      if (nums) tr.appendChild(el('td', {}, String(freq[i])));
      tbl.appendChild(tr);
    });
    const f = figure('g4s9-tally', null, spec.cap, 400);
    f.insertBefore(tbl, f.firstChild);
    return f;
  };

  /* ---------- a bar chart ---------- */
  function axisStep(max) { return max <= 6 ? 1 : max <= 14 ? 2 : max <= 30 ? 5 : 10; }
  kinds.s9bar = function (spec) {
    const cats = spec.cats || [], freq = spec.freq || [], n = cats.length, lit = spec.hl ? tops(freq) : [];
    const max = Math.max.apply(null, freq), step = axisStep(max), top = Math.ceil(max / step) * step;
    const L = 52, bw = n <= 4 ? 70 : n === 5 ? 62 : 52, PH = spec.ph || 160, T0 = spec.vals ? 22 : 12, W = L + n * bw + 10, H = T0 + PH + (spec.xlab ? 50 : 28);
    const y = function (v) { return T0 + PH - v / top * PH; };
    let s = '';
    for (let v = 0; v <= top; v += step) {
      s += '<path d="M' + L + ' ' + y(v) + 'H' + (W - 6) + '" stroke="' + (v ? '#DCE8F3' : INK) + '" stroke-width="' + (v ? 1.5 : 2.5) + '"/>' +
        '<text x="' + (L - 7) + '" y="' + (y(v) + 4.5) + '" font-size="13" text-anchor="end" fill="' + INK2 + '">' + v + '</text>';
    }
    s += '<path d="M' + L + ' ' + T0 + 'V' + (T0 + PH) + '" stroke="' + INK + '" stroke-width="2.5"/>';
    cats.forEach(function (c, i) {
      const on = lit.indexOf(i) >= 0, x = L + i * bw + 9, w = bw - 18, lab = show(c);
      s += '<rect x="' + x + '" y="' + y(freq[i]) + '" width="' + w + '" height="' + (T0 + PH - y(freq[i])) + '" fill="' + (on ? GOLD : BLUE) + '" stroke="' + (on ? GOLD_E : BLUE_E) + '" stroke-width="2.5"/>';
      if (spec.vals) s += '<text x="' + (x + w / 2) + '" y="' + (y(freq[i]) - 6) + '" font-size="14" text-anchor="middle" fill="' + INK + '">' + freq[i] + '</text>';
      s += '<text x="' + (x + w / 2) + '" y="' + (T0 + PH + 18) + '" font-size="' + (lab.length > 8 ? 11 : lab.length > 6 ? 12.5 : 14) + '" text-anchor="middle" fill="' + INK + '">' + esc(lab) + '</text>';
    });
    if (spec.xlab) s += '<text x="' + (L + n * bw / 2) + '" y="' + (H - 8) + '" font-size="13.5" text-anchor="middle" fill="' + INK2 + '">' + esc(spec.xlab) + '</text>';
    if (spec.ylab) s += '<text transform="translate(13 ' + (T0 + PH / 2) + ') rotate(-90)" font-size="13.5" text-anchor="middle" fill="' + INK2 + '">' + esc(spec.ylab) + '</text>';
    const say = 'Bar chart. ' + cats.map(function (c, i) { return show(c) + ': ' + freq[i]; }).join(', ');
    return figure('g4s9-bar', '<svg class="g4s9-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(say) + '">' + s + '</svg>', spec.cap, Math.round(W * 1.15));
  };

  /* ---------- a dot plot ---------- */
  kinds.s9dot = function (spec) {
    const cats = spec.cats || [], freq = spec.freq || [], n = cats.length, lit = spec.hl ? tops(freq) : [];
    const max = Math.max.apply(null, freq), cw = n <= 5 ? 56 : 48, dy = 22, r = 8.5, T0 = spec.vals ? 24 : 8;
    const PH = Math.max(3, max) * dy + 6, W = n * cw + 16, H = T0 + PH + (spec.xlab ? 48 : 26), base = T0 + PH;
    let s = '';
    cats.forEach(function (c, i) {
      const on = lit.indexOf(i) >= 0, x = 8 + i * cw + cw / 2;
      if (on) s += '<rect x="' + (x - cw / 2 + 4) + '" y="' + (T0 - (spec.vals ? 20 : 4)) + '" width="' + (cw - 8) + '" height="' + (PH + (spec.vals ? 20 : 4)) + '" rx="8" fill="' + SOFT + '"/>';
      for (let k = 0; k < freq[i]; k++) s += '<circle cx="' + x + '" cy="' + (base - 12 - k * dy) + '" r="' + r + '" fill="' + (on ? GOLD : BLUE) + '" stroke="' + (on ? GOLD_E : BLUE_E) + '" stroke-width="2.5"/>';
      if (spec.vals) s += '<text x="' + x + '" y="' + (base - 12 - freq[i] * dy + 8) + '" font-size="14" text-anchor="middle" fill="' + INK + '">' + freq[i] + '</text>';
      s += '<path d="M' + x + ' ' + base + 'v6" stroke="' + INK + '" stroke-width="2"/>' +
        '<text x="' + x + '" y="' + (base + 21) + '" font-size="' + (show(c).length > 6 ? 12 : 15) + '" text-anchor="middle" fill="' + INK + '">' + esc(show(c)) + '</text>';
    });
    s += '<path d="M6 ' + base + 'H' + (W - 6) + '" stroke="' + INK + '" stroke-width="2.5"/>';
    if (spec.xlab) s += '<text x="' + (W / 2) + '" y="' + (H - 7) + '" font-size="13.5" text-anchor="middle" fill="' + INK2 + '">' + esc(spec.xlab) + '</text>';
    const say = 'Dot plot. ' + cats.map(function (c, i) { return show(c) + ': ' + freq[i] + (freq[i] === 1 ? ' dot' : ' dots'); }).join(', ');
    return figure('g4s9-dot', '<svg class="g4s9-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(say) + '">' + s + '</svg>', spec.cap, Math.round(W * 1.2));
  };
})(window.T = window.T || {});
