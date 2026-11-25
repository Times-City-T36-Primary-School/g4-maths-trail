/* g4-pics-s6.js - the pictures of Stop 6, Sequences and special numbers (styles: src/css/030g_g4-s6.css).

   s6tri    { ks: [1, 2, 3], ask: 4 | [4, 5], cap: true }   triangular dot patterns side by side, the pattern number
            under each; each asked pattern is a "?" card. cap: a second line with the number of dots of each pattern.
   s6arr    { n, nocap, skip1 }    every array (rectangle of dots) that n dots can make, one per factor pair, labelled
            "3 × 4". A prime number makes one row only. nocap: no labels; skip1: without the single row 1 × n.
   s6strip  { a, d, show: 4, n: 20, jumps, reveal }   a sequence strip: the first terms with jump arcs "+ d", then "..."
            and (with n) the far term marked "20th" as "?" (reveal: its value). jumps: one long arc "19 jumps of 4".
   s6trisq  { k2: 3 }   two triangular patterns next to each other (k2 and k2 + 1) fitted into one square of dots.
   Also used from the older tools: dotseq (square patterns), frain (factor rainbow), hops, nline (the number track). */
(function (T) {
  'use strict';
  const el = T.util.el;
  const kinds = T.tools.picKinds = T.tools.picKinds || {};
  const MXs = function () { return window.MX; };
  const sg = function (v) { return MXs().sg(v); };
  const ord = function (n) { return MXs().s6.ord(n); };
  const tri = function (k) { return k * (k + 1) / 2; };
  const rem = function (px) { return (px / 16).toFixed(3) + 'rem'; };

  function svgFig(cls, w, h, body, label, cap, scale) {
    const fig = el('figure', { class: 'g4s6-fig ' + cls });
    const box = document.createElement('div');
    box.innerHTML = '<svg class="g4s6-svg" viewBox="0 0 ' + w + ' ' + h + '" style="width:' + rem(w * (scale || 1)) + '" role="img" aria-label="' + label + '">' + body + '</svg>';
    fig.appendChild(box.firstChild);
    if (cap) fig.appendChild(el('figcaption', { class: 'g4s6-cap', html: cap }));
    return fig;
  }
  function row(cls) { return el('div', { class: 'g4s6-row ' + (cls || '') }); }
  function ask(cap, label) {
    return el('figure', { class: 'g4s6-fig g4s6-fig--ask' }, el('span', { class: 'g4s6-q', role: 'img', 'aria-label': label }, '?'), el('figcaption', { class: 'g4s6-cap' }, cap));
  }

  // one triangle of dots: rows of 1, 2, ... k
  function triBody(k, s, g, cls) {
    const w = k * (s + g) + g; let b = '';
    for (let i = 0; i < k; i++) for (let j = 0; j <= i; j++) {
      b += '<circle class="' + (cls || 'g4s6-d') + (i === k - 1 ? ' is-last' : '') + '" cx="' + (w / 2 - i * (s + g) / 2 + j * (s + g)).toFixed(1) + '" cy="' + (g + i * (s + g) + s / 2) + '" r="' + (s / 2 - 0.75) + '"/>';
    }
    return { w: w, h: w, b: b };
  }
  // one drawing that scales with the width, so the row of patterns never breaks: the patterns stand on one line,
  // under each its number ("Pattern 1 2 3 4"), and with cap a second line "Dots 1 3 6 10"
  kinds.s6tri = function (spec) {
    // labels are drawn large (19 px in the drawing) because the drawing shrinks to about 0.7 on a phone test paper;
    // when the patterns skip a number (1, 2, 3, then 6), a "…" column shows that patterns are missing
    const asks = [].concat(spec.ask || []), ks = spec.ks || [1, 2, 3], s = 11, g = 3, gap = 9, head = 80, qs = 38;
    const cols = [];
    ks.map(function (k) { return { k: k, t: triBody(k, s, g) }; }).concat(asks.map(function (k) { return { k: k, ask: true }; })).forEach(function (c) {
      const prev = cols.length ? cols[cols.length - 1].k : null;
      if (prev != null && c.k > prev + 1) cols.push({ gap: true });
      cols.push(c);
    });
    const tall = cols.filter(function (c) { return !c.gap; }).map(function (c) { return c.ask ? qs : c.t.h; });
    const top = Math.max.apply(null, tall), yl = top + 25, H = yl + 7 + (spec.cap ? 26 : 0);
    let x = head, b = '<text class="g4s6-th" x="0" y="' + yl + '">Pattern</text>' + (spec.cap ? '<text class="g4s6-th" x="0" y="' + (yl + 26) + '">Dots</text>' : '');
    cols.forEach(function (c) {
      if (c.gap) { b += '<text class="g4s6-tgap" x="' + (x + 11) + '" y="' + (top - 6) + '">…</text>'; x += 22 + gap; return; }
      const w = Math.max(c.ask ? qs : c.t.w, 26), cx = x + w / 2;
      if (c.ask) b += '<rect class="g4s6-box is-far" x="' + (cx - qs / 2 + 1) + '" y="' + (top - qs + 1) + '" width="' + (qs - 2) + '" height="' + (qs - 2) + '" rx="7"/><text class="g4s6-qt" x="' + cx + '" y="' + (top - qs / 2 + 9) + '">?</text>';
      else b += '<g transform="translate(' + (cx - c.t.w / 2).toFixed(1) + ' ' + (top - c.t.h) + ')">' + c.t.b + '</g>';
      b += '<text class="g4s6-tn' + (c.ask ? ' is-far' : '') + '" x="' + cx + '" y="' + yl + '">' + c.k + '</text>';
      if (spec.cap) b += '<text class="g4s6-tn is-dots" x="' + cx + '" y="' + (yl + 26) + '">' + (c.ask ? '?' : tri(c.k)) + '</text>';
      x += w + gap;
    });
    const W = x - gap + 4;
    const say = 'Triangles of dots. ' + ks.map(function (k) { return 'Pattern ' + k + ' has ' + k + (k === 1 ? ' row' : ' rows'); }).join('. ') + '.' +
      (asks.length ? ' Pattern ' + asks.join(' and pattern ') + (asks.length > 1 ? ' are' : ' is') + ' not shown.' : '');
    const box = el('div', { class: 'hops g4s6-tri' });
    box.innerHTML = '<svg class="hops__svg" viewBox="0 0 ' + W + ' ' + H + '" style="max-width:' + Math.round(W * 1.2) + 'px" role="img" aria-label="' + say + '">' + b + '</svg>';
    return box;
  };

  // every rectangle of dots that n dots can make
  kinds.s6arr = function (spec) {
    const n = spec.n, box = row('g4s6-row--arr'), s = 11, g = 3;
    for (let a = 1; a * a <= n; a++) {
      if (n % a) continue;
      const b = n / a;
      if (a === 1 && spec.skip1 && hasOther(n)) continue;
      const w = b * (s + g) + g, h = a * (s + g) + g; let body = '';
      for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) body += '<circle class="g4s6-d' + (a === 1 ? ' is-one' : '') + '" cx="' + (g + j * (s + g) + s / 2) + '" cy="' + (g + i * (s + g) + s / 2) + '" r="' + (s / 2 - 0.75) + '"/>';
      box.appendChild(svgFig('g4s6-arr', w, h, body, a + (a === 1 ? ' row of ' : ' rows of ') + b + ' dots', spec.nocap ? '' : a + ' × ' + b));
    }
    return box;
  };
  function hasOther(n) { for (let a = 2; a * a <= n; a++) if (n % a === 0) return true; return false; }

  // a sequence strip with jump arcs, and a far term
  kinds.s6strip = function (spec) {
    const a = spec.a, d = spec.d, show = spec.show || 4, far = spec.n || 0, cw = 74, bw = 58, bh = 42;
    const cells = show + 1 + (far ? 1 : 0), W = cells * cw, big = far && spec.jumps, top = big ? 96 : 44, cy = top + 4 + bh / 2, H = cy + bh / 2 + 28;
    const lab = (d > 0 ? '+ ' : '− ') + Math.abs(d), X = function (i) { return i * cw + cw / 2; };
    let s = '';
    if (big) {
      const x1 = X(0), x2 = X(cells - 1);
      s += '<path class="g4s6-long" d="M' + x1 + ' ' + (top - 42) + ' Q' + (x1 + x2) / 2 + ' ' + (top - 118) + ' ' + x2 + ' ' + (top - 4) + '"/>' +
        '<path class="g4s6-long is-tip" d="M' + (x2 - 14) + ' ' + (top - 9) + ' L' + x2 + ' ' + (top - 4) + ' L' + (x2 - 4) + ' ' + (top - 18) + '"/>' +
        '<rect class="g4s6-longb" x="' + ((x1 + x2) / 2 - 98) + '" y="' + (top - 87) + '" width="196" height="32" rx="16"/>' +
        '<text class="g4s6-longt" x="' + (x1 + x2) / 2 + '" y="' + (top - 64) + '">' + (far - 1) + ' jumps of ' + Math.abs(d) + '</text>';
    }
    for (let i = 0; i < show; i++) {
      const x = X(i);
      const x1 = x + 8, x2 = x + cw - 8, xm = x + cw / 2;
      s += '<path class="g4s6-arc" d="M' + x1 + ' ' + top + ' Q' + xm + ' ' + (top - 30) + ' ' + x2 + ' ' + top + '"/>' +
        '<path class="g4s6-arc" d="M' + (x2 - 9) + ' ' + (top - 3) + ' L' + x2 + ' ' + top + ' L' + (x2 - 2) + ' ' + (top - 10) + '"/>';
      s += '<text class="g4s6-lab" x="' + xm + '" y="' + (top - 20) + '">' + lab + '</text>';
      s += '<rect class="g4s6-box" x="' + (x - bw / 2) + '" y="' + (cy - bh / 2) + '" width="' + bw + '" height="' + bh + '" rx="10"/>' +
        '<text class="g4s6-num" x="' + x + '" y="' + (cy + 8) + '">' + sg(a + i * d) + '</text>' +
        '<text class="g4s6-ord" x="' + x + '" y="' + (H - 6) + '">' + ord(i + 1) + '</text>';
    }
    s += '<text class="g4s6-dots" x="' + X(show) + '" y="' + (cy + 6) + '">…</text>';
    if (far) {
      const x = X(show + 1), v = a + (far - 1) * d;
      s += '<rect class="g4s6-box is-far' + (spec.reveal ? ' is-on' : '') + '" x="' + (x - bw / 2 - 3) + '" y="' + (cy - bh / 2) + '" width="' + (bw + 6) + '" height="' + bh + '" rx="10"/>' +
        '<text class="g4s6-num is-far" x="' + x + '" y="' + (cy + 8) + '">' + (spec.reveal ? sg(v) : '?') + '</text>' +
        '<text class="g4s6-ord is-far" x="' + x + '" y="' + (H - 6) + '">' + ord(far) + '</text>';
    }
    const say = 'A sequence: ' + Array.from({ length: show }, function (x, i) { return sg(a + i * d); }).join(', ') + ' and so on. Each jump is ' + lab +
      (far ? '. The ' + ord(far) + ' term is ' + (spec.reveal ? sg(a + (far - 1) * d) : 'to find') : '') + '.';
    const box = el('div', { class: 'hops g4s6-strip' });
    box.innerHTML = '<svg class="hops__svg" viewBox="0 0 ' + W + ' ' + H + '" style="max-width:' + Math.round(W * 1.15) + 'px" role="img" aria-label="' + say + '">' + s + '</svg>';
    return box;
  };

  // two triangular numbers next to each other make a square
  kinds.s6trisq = function (spec) {
    const k = spec.k2 || 3, m = k + 1, s = 15, g = 11, step = s + g, w = m * step + g; let b = '';
    for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) {
      b += '<circle class="g4s6-d' + (j > i ? ' is-two' : '') + '" cx="' + (g + j * step + s / 2) + '" cy="' + (g + i * step + s / 2) + '" r="' + (s / 2 - 0.75) + '"/>';
    }
    // the cut: a staircase in the gutters, between the dots above the diagonal (gold) and the dots on and below it (blue)
    const mid = function (i) { return (i + 1) * step + g / 2; };
    let path = 'M' + mid(0) + ' 1';
    for (let i = 0; i < m - 1; i++) path += ' V' + mid(i) + ' H' + (i === m - 2 ? w - 1 : mid(i + 1));
    b += '<rect class="g4s6-sqf" x="1" y="1" width="' + (w - 2) + '" height="' + (w - 2) + '" rx="6"/><path class="g4s6-cut" d="' + path + '"/>';
    const box = row('g4s6-row--trisq');
    box.appendChild(svgFig('g4s6-trisq', w, w, b, 'A square of ' + m + ' rows of ' + m + ' dots, cut into two triangles of ' + tri(k) + ' and ' + tri(m) + ' dots',
      '<span class="g4s6-two">' + tri(k) + '</span> + <span class="g4s6-one">' + tri(m) + '</span> = ' + m * m + ' = ' + m + ' × ' + m, 1.25));
    return box;
  };
})(window.T = window.T || {});
