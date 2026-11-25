/* g4-pics-s4.js - the pictures of Stop 4, Fractions (Grade 4, Stage 5). Every picture is drawn from its numbers.

   T.tools.pic({ k: 's4bar', parts: 4, shade: 3, whole: 20, each: 5, part: 15 })
       a fraction strip: `parts` equal boxes, the first `shade` are shaded. A bracket on top shows the whole and a
       bracket below shows the shaded part. whole / each / part: a number, '?' (to find) or left out (not shown).
       from: 'end' shades the LAST boxes (the part that is left); unit: a word after the numbers of the brackets.
   T.tools.pic({ k: 's4share', wholes: 3, people: 4, kind: 'pizza' | 'cake', each: true })
       `wholes` whole things, each cut into `people` equal parts, one colour per child. each: true also shows
       one child's share put together, with its fraction.
   T.tools.pic({ k: 's4mixed', n: 7, d: 4, kind: 'circles' | 'bars', label: 'improper' | 'mixed' | 'both', wholes: 2 })
       n parts of size 1/d shaded in whole shapes (1 whole and 3 quarters). label: what is written under it.
   T.tools.pic({ k: 's4line', max: 3, d: 4, at: 7, label: '?' | 'improper' | 'mixed' | 'both', count: true })
       a number line from 0 to max with small marks every 1/d and an arrow at at/d. count: true numbers the jumps.
   T.tools.pic({ k: 's4say', html: '3 ÷ 4 = 3/4' })   one big line of maths; a/b is written as a real fraction.

   Also here: MX.s4frac(text) writes every a/b in a text as a real fraction (numerator over denominator), and a small
   watcher that does the same for the plain-text parts of this stop (notes, lightning, Zip's lines, word cards), which the
   engines print as text only. It runs on the screens of Stop 4 only. */
(function (T) {
  'use strict';

  const el = T.util.el;
  const INK = '#2A2F3A', GOLD = '#F7B733', GOLD_D = '#B97700', SOFT = '#FFF6DE', BLUE = '#1F5CA0', PAPER = '#FFFFFF', GREY = '#8A94A6';
  const KIDS = ['#F7B733', '#5AA9E6', '#7BC96F', '#F28B82', '#B39DDB', '#4DB6AC', '#FF8A65', '#90A4AE', '#F48FB1', '#AED581'];
  const NAMES = { 2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth', 12: 'twelfth', 100: 'hundredth' };
  const plural = function (d) { return d === 2 ? 'halves' : (NAMES[d] || d + 'th') + 's'; };
  const some = function (k, d) { return k + ' ' + (k === 1 ? (NAMES[d] || d + 'th') : plural(d)); };
  const fmt = function (x) { return typeof x === 'number' ? (window.MX ? window.MX.fmt(x) : String(x)) : String(x); };

  /* ---------- fractions in HTML text (made in 009d_g4-models-s4.js: MX.s4frac, MX.s4F) ---------- */
  const fracText = function (s) { return window.MX.s4frac(s); };

  /* ---------- SVG helpers ---------- */
  const r1 = function (x) { return Math.round(x * 10) / 10; };
  function svg(w, h, body, label, cls) {
    return el('div', { class: ['g4s4-pic', cls], role: 'img', 'aria-label': label || 'Picture',
      html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" style="max-width:' + r1(w * 1.25) + 'px" aria-hidden="true">' + body + '</svg>' });
  }
  function text(x, y, t, size, fill, anchor) {
    return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + size + '" fill="' + (fill || INK) + '" text-anchor="' + (anchor || 'middle') + '">' + t + '</text>';
  }
  // a fraction drawn in SVG, centred on x, its bar at y. Returns [markup, width]
  function sfrac(x, y, n, d, size, fill) {
    const w = Math.max(String(n).length, String(d).length) * size * 0.62 + 4;
    return [text(x, y - size * 0.22, n, size, fill) + '<line x1="' + r1(x - w / 2) + '" y1="' + r1(y) + '" x2="' + r1(x + w / 2) + '" y2="' + r1(y) + '" stroke="' + (fill || INK) + '" stroke-width="' + r1(Math.max(1.6, size / 9)) + '" stroke-linecap="round"/>' +
      text(x, y + size * 0.92, d, size, fill), w];
  }
  // a row of maths: strings and fractions ([n, d]) set side by side, centred on x; the middle of the text is on y
  function mathRow(x, y, items, size, fill) {
    const ws = items.map(function (it) { return Array.isArray(it) ? Math.max(String(it[0]).length, String(it[1]).length) * size * 0.62 + 8 : String(it).length * size * 0.58 + 6; });
    const tot = ws.reduce(function (s, v) { return s + v; }, 0);
    let at = x - tot / 2, out = '';
    items.forEach(function (it, i) {
      const cx = at + ws[i] / 2;
      out += Array.isArray(it) ? sfrac(cx, y, it[0], it[1], size * 0.86, fill)[0] : text(cx, y + size * 0.34, it, size, fill);
      at += ws[i];
    });
    return out;
  }
  const mixedItems = function (n, d) { const w = Math.floor(n / d), r = n % d; return r ? (w ? [String(w), [r, d]] : [[r, d]]) : [String(w)]; };
  // a bracket: a line from x1 to x2 at y with small ends towards `dir` (1 = down, -1 = up)
  function bracket(x1, x2, y, dir, col) {
    return '<path d="M' + r1(x1) + ' ' + r1(y + 7 * dir) + ' V' + r1(y) + ' H' + r1(x2) + ' V' + r1(y + 7 * dir) + '" fill="none" stroke="' + (col || INK) + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function sector(cx, cy, r, i, d, fill, stroke) {
    if (d === 1) return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" stroke="' + (stroke || INK) + '" stroke-width="2"/>';
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / d;
    return '<path d="M' + r1(cx) + ' ' + r1(cy) + ' L' + r1(cx + r * Math.cos(a0)) + ' ' + r1(cy + r * Math.sin(a0)) + ' A' + r + ' ' + r + ' 0 ' + (d === 1 ? 1 : 0) + ' 1 ' +
      r1(cx + r * Math.cos(a1)) + ' ' + r1(cy + r * Math.sin(a1)) + ' Z" fill="' + fill + '" stroke="' + (stroke || INK) + '" stroke-width="2" stroke-linejoin="round"/>';
  }

  /* ---------- s4bar: a fraction of an amount ---------- */
  function bar(spec) {
    const d = spec.parts, n = spec.shade || 0, W = 360, x0 = 16, x1 = 344, bw = (x1 - x0) / d, top = spec.whole != null ? 44 : 12, bh = 46;
    const fromEnd = spec.from === 'end', unit = spec.unit ? ' ' + spec.unit : '';
    const lit = function (i) { return fromEnd ? i >= d - n : i < n; };
    let b = '';
    if (spec.whole != null) b += bracket(x0 + 2, x1 - 2, 30, 1) + '<rect x="' + (W / 2 - 46) + '" y="6" width="92" height="26" rx="6" fill="' + PAPER + '"/>' +
      text(W / 2, 27, (spec.whole === '?' ? '?' : fmt(spec.whole)) + (spec.whole === '?' ? '' : unit), 20, spec.whole === '?' ? BLUE : INK);
    for (let i = 0; i < d; i++) {
      b += '<rect x="' + r1(x0 + i * bw) + '" y="' + top + '" width="' + r1(bw) + '" height="' + bh + '" fill="' + (lit(i) ? GOLD : PAPER) + '" stroke="' + INK + '" stroke-width="2.2"/>';
      if (spec.each != null && bw >= 22) b += text(x0 + (i + 0.5) * bw, top + bh / 2 + 7, spec.each === '?' ? '?' : fmt(spec.each), bw < 34 ? 13 : 19, spec.each === '?' ? BLUE : INK);
    }
    let h = top + bh + 10;
    if (n > 0 && (spec.part != null || spec.frac !== false)) {
      const a = x0 + (fromEnd ? d - n : 0) * bw + 2, z = x0 + (fromEnd ? d : n) * bw - 2, mid = (a + z) / 2, y = top + bh + 16;
      b += bracket(a, z, y, -1, GOLD_D);
      const items = [];
      if (spec.frac !== false) items.push([n, d]);
      if (spec.part != null) { if (items.length) items.push(spec.of ? 'of ' + fmt(spec.of) + ' =' : '='); items.push((spec.part === '?' ? '?' : fmt(spec.part)) + (spec.part === '?' ? '' : unit)); }
      const need = items.reduce(function (s, it) { return s + (Array.isArray(it) ? 34 : String(it).length * 13 + 6); }, 0);
      b += mathRow(Math.min(Math.max(mid, need / 2 + 4), W - need / 2 - 4), y + 30, items, 22, INK);
      h = y + 56;
    }
    return svg(W, h, b, 'A strip cut into ' + d + ' equal parts. ' + n + (n === 1 ? ' part is' : ' parts are') + ' shaded.' + (spec.whole != null && spec.whole !== '?' ? ' The whole strip is ' + spec.whole + '.' : ''), 'g4s4-pic--bar');
  }

  /* ---------- s4share: whole things cut and shared ---------- */
  function cake(x, y, s, d, colours) {            // a square cake cut into d strips
    let out = '';
    for (let i = 0; i < d; i++) out += '<rect x="' + r1(x + i * s / d) + '" y="' + r1(y) + '" width="' + r1(s / d) + '" height="' + s + '" fill="' + colours(i) + '" stroke="' + INK + '" stroke-width="2"/>';
    return out;
  }
  function share(spec) {
    const a = spec.wholes, p = spec.people, isCake = spec.kind === 'cake', W = 360;
    // more than 4 wholes: two rows, so that every whole stays big enough to see its parts
    const rows = a > 4 ? 2 : 1, perRow = Math.ceil(a / rows);
    const R = Math.min(38, (W - 24) / perRow / 2 - 5), cy = R + 10;
    // up to 6 children: one colour each; more: only one child's parts are gold (many colours are hard to read)
    const col = function (i) { return p > 6 ? (i === 0 ? GOLD : PAPER) : KIDS[i % KIDS.length]; };
    let b = '';
    for (let k = 0; k < a; k++) {
      const row = Math.floor(k / perRow), inRow = row ? a - perRow : perRow, g = (W - inRow * 2 * R) / (inRow + 1);
      const cx = g + R + (k % perRow) * (2 * R + g), y = cy + row * (2 * R + 12);
      if (isCake) b += cake(cx - R, y - R, 2 * R, p, col);
      else for (let i = 0; i < p; i++) b += sector(cx, y, R, i, p, col(i));
    }
    let h = cy + (rows - 1) * (2 * R + 12) + R + 10;
    if (spec.each) {
      // one child's share: the gold parts, put together
      const y = h + 16 + R, wholesNeeded = Math.ceil(a / p), tot = wholesNeeded * 2 * R + (wholesNeeded - 1) * 10, start = W / 2 - tot / 2 - 34;
      b += '<path d="M' + (W / 2) + ' ' + (h + 1) + ' v10 m-6 -6 l6 7 l6 -7" fill="none" stroke="' + GREY + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
      let left = a;
      for (let k = 0; k < wholesNeeded; k++) {
        const cx = start + R + k * (2 * R + 10), take = Math.min(left, p);
        if (isCake) b += cake(cx - R, y - R, 2 * R, p, function (i) { return i < take ? GOLD : PAPER; });
        else for (let i = 0; i < p; i++) b += sector(cx, y, R, i, p, i < take ? GOLD : PAPER, i < take ? INK : '#B8C0CC');
        left -= take;
      }
      b += mathRow(start + tot + 44, y, [[a, p]], 26, INK);
      h = y + R + 10;
    }
    return svg(W, h, b, a + (isCake ? ' cakes' : ' round things') + ', each cut into ' + p + ' equal parts. ' + (p > 6 ? 'One part of each is gold: one share.' : 'Each colour is one share.'), 'g4s4-pic--share');
  }

  /* ---------- s4mixed: wholes and parts ---------- */
  function mixed(spec) {
    const n = spec.n, d = spec.d, count = Math.max(Math.ceil(n / d), spec.wholes || 0, 1), bars = spec.kind === 'bars', W = 360;
    let b = '', h;
    if (bars) {
      const perRow = count > 3 ? 2 : count, rows = Math.ceil(count / perRow), bw = Math.min(150, (W - 16 - (perRow - 1) * 14) / perRow), bh = 34;
      const rowW = perRow * bw + (perRow - 1) * 14;
      for (let k = 0; k < count; k++) {
        const x = (W - rowW) / 2 + (k % perRow) * (bw + 14), y = 8 + Math.floor(k / perRow) * (bh + 12);
        for (let i = 0; i < d; i++) b += '<rect x="' + r1(x + i * bw / d) + '" y="' + y + '" width="' + r1(bw / d) + '" height="' + bh + '" fill="' + (k * d + i < n ? GOLD : PAPER) + '" stroke="' + INK + '" stroke-width="2"/>';
      }
      h = 8 + rows * (bh + 12);
    } else {
      const R = Math.min(40, (W - 16) / count / 2 - 6), gap = Math.min(18, (W - count * 2 * R) / (count + 1)), tot = count * 2 * R + (count - 1) * gap;
      for (let k = 0; k < count; k++) {
        const cx = (W - tot) / 2 + R + k * (2 * R + gap);
        for (let i = 0; i < d; i++) b += sector(cx, R + 8, R, i, d, k * d + i < n ? GOLD : PAPER);
      }
      h = 2 * R + 18;
    }
    if (spec.label) {
      const items = spec.label === 'improper' ? [[n, d]] : spec.label === 'mixed' ? mixedItems(n, d) : [[n, d], '='].concat(mixedItems(n, d));
      b += mathRow(W / 2, h + 24, items, 24, INK);
      h += 52;
    }
    return svg(W, h, b, some(n, d) + ' are shaded. Each ' + (bars ? 'bar' : 'circle') + ' is 1 whole, cut into ' + plural(d) + '.', 'g4s4-pic--mixed');
  }

  /* ---------- s4line: a number line in halves, thirds, quarters ---------- */
  function line(spec) {
    const max = spec.max, d = spec.d, W = 360, x0 = 22, x1 = 338, y = spec.label || spec.at != null ? 66 : 30, px = function (k) { return x0 + (x1 - x0) * k / (max * d); };
    let b = '<line x1="' + (x0 - 8) + '" y1="' + y + '" x2="' + (x1 + 8) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
    for (let k = 0; k <= max * d; k++) {
      const big = k % d === 0;
      b += '<line x1="' + r1(px(k)) + '" y1="' + (y - (big ? 12 : 7)) + '" x2="' + r1(px(k)) + '" y2="' + (y + (big ? 12 : 7)) + '" stroke="' + INK + '" stroke-width="' + (big ? 2.6 : 1.8) + '" stroke-linecap="round"/>';
      if (big) b += text(px(k), y + 34, k / d, 20, INK);
    }
    if (spec.count && spec.at != null) {
      for (let k = 1; k <= spec.at; k++) b += '<path d="M' + r1(px(k - 1)) + ' ' + (y - 14) + ' Q' + r1(px(k - 0.5)) + ' ' + (y - 30) + ' ' + r1(px(k)) + ' ' + (y - 14) + '" fill="none" stroke="' + GOLD_D + '" stroke-width="1.8"/>';
    }
    if (spec.at != null) {
      const x = px(spec.at), lab = spec.label || '?', ty = spec.count ? 4 : 8;
      b += '<circle cx="' + r1(x) + '" cy="' + y + '" r="5.5" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="2"/>';
      b += '<path d="M' + r1(x) + ' ' + (y - 34) + ' V' + (y - 13) + ' m-5.5 -7 l5.5 8 l5.5 -8" fill="none" stroke="' + BLUE + '" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>';
      if (lab === '?') b += '<rect x="' + r1(x - 14) + '" y="' + ty + '" width="28" height="24" rx="6" fill="' + SOFT + '" stroke="' + BLUE + '" stroke-width="2"/>' + text(x, ty + 19, '?', 19, BLUE);
      else {
        const items = lab === 'improper' ? [[spec.at, d]] : lab === 'mixed' ? mixedItems(spec.at, d) : [[spec.at, d], '='].concat(mixedItems(spec.at, d));
        const need = items.reduce(function (s, it) { return s + (Array.isArray(it) ? 24 : String(it).length * 10 + 6); }, 0);
        b += mathRow(Math.min(Math.max(x, need / 2 + 4), W - need / 2 - 4), 15, items, 16, BLUE);
      }
    }
    return svg(W, y + 44, b, 'A number line from 0 to ' + max + '. Each whole is cut into ' + plural(d) + '.' + (spec.at != null ? ' An arrow points to a mark ' + spec.at + ' small steps after 0.' : ''), 'g4s4-pic--line');
  }

  /* ---------- s4say: one line of maths ---------- */
  function say(spec) {
    return el('div', { class: 'g4s4-pic g4s4-say', html: '<p>' + fracText(spec.html || '') + '</p>' + (spec.sub ? '<p class="g4s4-say__sub">' + fracText(spec.sub) + '</p>' : '') });
  }

  const kinds = T.tools.picKinds = T.tools.picKinds || {};
  kinds.s4bar = bar;
  kinds.s4share = share;
  kinds.s4mixed = mixed;
  kinds.s4line = line;
  kinds.s4say = say;

  /* ---------- the watcher: a/b in plain text becomes a real fraction (Stop 4 screens only) ----------
     Only a fraction standing on its own is changed: "3/4", "1 3/4", "(3/4)". Dates (24/11/2026), a/b inside a word or a
     code (A1/2, x3/4y), decimals (0.5/2), longer chains (1/2/3) and the engines' own marks and scores are left alone. */
  const NOT = '.g4s4-frac, .fr, svg, script, style, textarea, input, select, option, title, kbd, code, pre, [contenteditable], .npad, .tp-mk__got, .pcx-cell, [data-nofrac]';
  const RXT = /(^|[^\w\/.,:\-])(?:(\d{1,3}) (\d{1,3})\/(\d{1,3})|(\d{1,3})\/(\d{1,3}))(?![\w\/]|[.,:]\d)/g;
  const esc = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  function paint(t) {
    let out = '', at = 0, m;
    RXT.lastIndex = 0;
    while ((m = RXT.exec(t))) {
      const start = m.index + m[1].length;
      out += esc(t.slice(at, start)) + (m[2] != null ? MX.s4frac(m[2] + ' ' + m[3] + '/' + m[4]) : MX.s4F(m[5], m[6]));
      at = m.index + m[0].length;
      RXT.lastIndex = at;
    }
    return at ? out + esc(t.slice(at)) : null;
  }
  const MX = window.MX;
  function onStop4() { return /^#?\/?stop-4(?![\w])/.test(String(location.hash || '')); }
  function fix(node) {
    if (!node) return;
    if (node.nodeType === 3) {
      const p = node.parentNode;
      if (!p || p.nodeType !== 1 || !/\d\/\d/.test(node.nodeValue)) return;
      if (p.closest && p.closest(NOT)) return;
      const html = paint(node.nodeValue);
      if (html == null) return;
      const span = document.createElement('span');
      span.innerHTML = html;
      const frag = document.createDocumentFragment();
      while (span.firstChild) frag.appendChild(span.firstChild);
      p.replaceChild(frag, node);
      return;
    }
    if (node.nodeType !== 1 || (node.closest && node.closest(NOT))) return;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null), list = [];
    while (walker.nextNode()) if (/\d\/\d/.test(walker.currentNode.nodeValue)) list.push(walker.currentNode);
    list.forEach(fix);
  }
  function watch() {
    if (!window.MutationObserver || !document.body) return;
    new MutationObserver(function (muts) {
      if (!onStop4()) return;
      try {
        muts.forEach(function (m) {
          if (m.type === 'characterData') fix(m.target);
          else for (let i = 0; i < m.addedNodes.length; i++) fix(m.addedNodes[i]);
        });
      } catch (e) { /* a plain "3/4" is still right */ }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  T.tools.s4paint = paint;
  if (document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);
})(window.T = window.T || {});
