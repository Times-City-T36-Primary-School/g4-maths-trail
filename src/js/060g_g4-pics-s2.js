/* g4-pics-s2.js - the Stop 2 pictures (Grade 4, Stage 5): multiply and divide by 10, 100 and 1,000.

   { k: 's2slide', n: '0.47', op: 'x' | 'd', p: 10 | 100 | 1000, ask: false, arrows: true, cap: undefined | false | 'text' }
       the decimal place value "slider": the columns the two numbers need (at least Tens, Ones, the decimal point and
       tenths; Thousands, Hundreds, hundredths ... are added when a number needs them), the digits of n in the top row, the digits of
       the answer in the bottom row and one arrow for each digit that moves (1, 2 or 3 places left or right).
       ask: true leaves the bottom row empty (with arrows: the empty places the digits land in are marked).
       arrows: false draws no arrows (the child counts the places). cap: false draws no line of words under it.
       The answer is worked out here with the exact arithmetic of the model (MX.s2).
   { k: 's2flow', boxes: ['3.6', '', null, ...], ops: ['× 10', '× ?'], ask: { box: i } | { op: i }, hl: { box: i } | { op: i } }
       a flow diagram: boxes joined by arrows with an operation on each arrow. A box that is null is the one to find
       (gold, with ?), a box '' is empty and not asked for; an operation that ends in ? has an empty gold box.
       hl marks the box or the arrow that was found (green) in a worked answer. */
(function (T) {
  'use strict';

  const el = T.util.el;
  const kinds = T.tools.picKinds = T.tools.picKinds || {};
  const NAVY = '#10305E', BLUE = '#2F7FD4', GREEN = '#1E9E6A', GOLD = '#F5A623', GOLD_D = '#8A5800', GREY = '#8A9BB3', ARROW = '#D8472B';
  const COLS = {
    6: ['M', 'Millions'], 5: ['HTh', '100,000s'], 4: ['TTh', '10,000s'], 3: ['Th', 'Thousands'], 2: ['H', 'Hundreds'], 1: ['T', 'Tens'], 0: ['O', 'Ones'],
    '-1': ['t', 'tenths'], '-2': ['h', 'hundredths'], '-3': ['th', 'thousandths'], '-4': ['', ''], '-5': ['', ''], '-6': ['', '']
  };
  const PL = { 10: 1, 100: 2, 1000: 3 }, SYM = { x: '×', d: '÷' };
  /* the width of a column name in em (bold display font, measured), for names that must be squeezed to fit */
  const EM = { Thousands: 4.92, Hundreds: 4.29, Tens: 2.08, Ones: 2.28, tenths: 2.97, hundredths: 5.19, '10,000s': 3.32, '100,000s': 3.88, Millions: 3.49, thousandths: 5.7 };
  const nameW = function (w) { return EM[w] || w.length * 0.6; };

  function wrap(cls, label, svg, cap) {
    const box = el('div', { class: cls, role: 'img', 'aria-label': label });
    const pic = el('div', { class: 'g4s2-svg' });
    pic.innerHTML = svg;
    box.appendChild(pic);
    if (cap) box.appendChild(el('p', { class: 'g4s2-cap', html: cap }));
    return box;
  }

  /* the digits of a number (millionths), by place: { 2: 4, 1: 7 } for 470, with the highest and lowest place that is not 0 */
  function digitsOf(u) {
    const s = String(u).padStart(13, '0'), map = {};
    let hi = null, lo = null;
    for (let i = 0; i < s.length; i++) {
      const e = s.length - 1 - i - 6, dg = +s[i];
      map[e] = dg;
      if (dg) { if (hi == null) hi = e; lo = e; }
    }
    return { map: map, hi: hi == null ? 0 : hi, lo: lo == null ? 0 : lo, zero: hi == null };
  }

  function slide(spec) {
    const S = window.MX.s2, n = S.parse(spec.n), op = spec.op, p = spec.p, k = PL[p];
    if (isNaN(n) || !k || !S.can(n, op, p)) return null;
    const ans = S.apply(n, op, p), A = digitsOf(n), B = digitsOf(ans), shift = op === 'x' ? k : -k;
    // only the columns the two numbers need (at least tens, ones and tenths), so the columns stay wide on a phone
    const top = Math.max(1, A.hi, B.hi), bot = Math.min(-1, A.lo, B.lo);
    const CW = 60, PW = 20, X0 = 4, TH = 44;
    const x = function (e) { return X0 + (top - e) * CW + (e < 0 ? PW : 0); };          // the left edge of a column
    const W = x(bot) + CW + X0;
    // the column names must be readable on a phone (about 11 px or more): the picture is about 320 px wide there and
    // never drawn bigger than 1.15 x its size, so the name size grows when the chart has many columns; a long name is
    // squeezed a little to fit its column
    const NF = Math.round(Math.max(11, Math.min(17, 11.5 / Math.min(1.15, 320 / W))) * 10) / 10;
    const HD = 30 + NF, R1 = HD + 8, R2 = R1 + 100, H = R2 + TH + 8;
    const arrows = spec.arrows !== false, ask = !!spec.ask;
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" class="g4s2-slide__svg">';
    // the columns: whole numbers blue, decimals amber, and their names
    for (let e = top; e >= bot; e--) {
      const dec = e < 0, c = COLS[e] || ['', ''];
      s += '<rect x="' + (x(e) + 1) + '" y="0" width="' + (CW - 2) + '" height="' + H + '" rx="8" fill="' + (dec ? '#FFF3D6' : '#E6F0FB') + '"/>';
      s += '<rect x="' + (x(e) + 1) + '" y="0" width="' + (CW - 2) + '" height="' + HD + '" rx="8" fill="' + (dec ? '#FBD98A' : '#BBD7F5') + '"/>';
      s += '<text x="' + (x(e) + CW / 2) + '" y="22" font-size="20" font-weight="800" text-anchor="middle" fill="' + NAVY + '">' + c[0] + '</text>';
      s += '<text x="' + (x(e) + CW / 2) + '" y="' + (HD - 7) + '" font-size="' + NF + '" font-weight="700" text-anchor="middle"' + (nameW(c[1]) * NF > CW - 4 ? ' textLength="' + (CW - 4) + '" lengthAdjust="spacingAndGlyphs"' : '') + ' fill="' + NAVY + '">' + c[1] + '</text>';
      [R1, R2].forEach(function (y) { s += '<rect x="' + (x(e) + 6) + '" y="' + y + '" width="' + (CW - 12) + '" height="' + TH + '" rx="7" fill="#FFFFFF" fill-opacity=".75"/>'; });
    }
    // the decimal point: it never moves
    const px = x(0) + CW + PW / 2;
    s += '<line x1="' + px + '" y1="' + (HD + 4) + '" x2="' + px + '" y2="' + (H - 4) + '" stroke="' + NAVY + '" stroke-opacity=".25" stroke-width="2" stroke-dasharray="3 5"/>';
    [R1, R2].forEach(function (y) { s += '<circle cx="' + px + '" cy="' + (y + TH - 9) + '" r="5" fill="' + NAVY + '"/>'; });
    s += '<circle cx="' + px + '" cy="20" r="4" fill="' + NAVY + '"/>';
    const tile = function (e, y, dg, col, kind) {
      const cx = x(e) + CW / 2;
      if (kind === 'zero') return '<rect x="' + (x(e) + 6) + '" y="' + y + '" width="' + (CW - 12) + '" height="' + TH + '" rx="7" fill="#FFFFFF" stroke="' + GREY + '" stroke-width="2" stroke-dasharray="4 4"/>' +
        '<text x="' + cx + '" y="' + (y + 32) + '" font-size="28" font-weight="800" text-anchor="middle" fill="' + GREY + '">0</text>';
      if (kind === 'slot') return '<rect x="' + (x(e) + 6) + '" y="' + y + '" width="' + (CW - 12) + '" height="' + TH + '" rx="7" fill="#FFF8E3" stroke="' + GOLD + '" stroke-width="2.5" stroke-dasharray="5 4"/>';
      return '<rect x="' + (x(e) + 6) + '" y="' + y + '" width="' + (CW - 12) + '" height="' + TH + '" rx="7" fill="#FFFFFF" stroke="' + col + '" stroke-width="3"/>' +
        '<text x="' + cx + '" y="' + (y + 32) + '" font-size="28" font-weight="800" text-anchor="middle" fill="' + NAVY + '">' + dg + '</text>';
    };
    // zeros that only hold a place (0.47, 47,000): from the ones down to the first digit, and from the last digit down to the ones
    const holders = function (D) { const out = []; if (D.zero) return [0]; for (let e = 0; e > D.hi; e--) out.push(e); for (let e = D.lo - 1; e >= 0; e--) out.push(e); return out; };
    holders(A).forEach(function (e) { s += tile(e, R1, 0, '', 'zero'); });
    if (!A.zero) for (let e = A.hi; e >= A.lo; e--) s += tile(e, R1, A.map[e], BLUE);
    if (!ask) {
      holders(B).forEach(function (e) { s += tile(e, R2, 0, '', 'zero'); });
      if (!B.zero) for (let e = B.hi; e >= B.lo; e--) s += tile(e, R2, B.map[e], GREEN);
    } else if (arrows && !A.zero) {
      for (let e = A.hi; e >= A.lo; e--) s += tile(e + shift, R2, '', '', 'slot');
    }
    if (arrows && !A.zero) {
      for (let e = A.hi; e >= A.lo; e--) {
        const x1 = x(e) + CW / 2, x2 = x(e + shift) + CW / 2, y1 = R1 + TH + 4, y2 = R2 - 5;
        const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy), ux = dx / len, uy = dy / len, hx = x2 - ux * 11, hy = y2 - uy * 11;
        s += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + hx.toFixed(1) + '" y2="' + hy.toFixed(1) + '" stroke="' + ARROW + '" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<polygon points="' + x2 + ',' + y2 + ' ' + (hx - uy * 6).toFixed(1) + ',' + (hy + ux * 6).toFixed(1) + ' ' + (hx + uy * 6).toFixed(1) + ',' + (hy - ux * 6).toFixed(1) + '" fill="' + ARROW + '"/>';
      }
    }
    s += '</svg>';
    const calc = S.show(n) + ' ' + SYM[op] + ' ' + window.MX.fmt(p), moves = 'Each digit moves ' + k + (k === 1 ? ' place' : ' places') + ' to the ' + (op === 'x' ? 'left' : 'right') + '.';
    const cap = spec.cap === false ? '' : typeof spec.cap === 'string' ? spec.cap
      : '<b>' + calc + ' = ' + (ask ? '?' : S.show(ans)) + '</b>' + (arrows ? ' <span>' + moves + '</span>' : '');
    const label = 'Place value chart. Top row: ' + S.show(n) + '.' + (ask ? '' : ' Bottom row: ' + S.show(ans) + '.') + (arrows ? ' ' + moves : '');
    const box = wrap('g4s2-slide', label, s, cap);
    box.style.setProperty('--g4s2-w', W);
    return box;
  }

  function flow(spec) {
    const boxes = spec.boxes || [], ops = spec.ops || [], ask = spec.ask || {}, hl = spec.hl || {};
    const BW = 96, BH = 54, GAP = 88, X0 = 4, Y = 34, n = boxes.length;
    const W = X0 * 2 + n * BW + (n - 1) * GAP, H = Y + BH + 6;
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" class="g4s2-flow__svg">';
    boxes.forEach(function (b, i) {
      const x = X0 + i * (BW + GAP), cx = x + BW / 2, cy = Y + BH / 2, asked = b == null, empty = b === '', found = hl.box === i;
      s += '<rect x="' + x + '" y="' + Y + '" width="' + BW + '" height="' + BH + '" rx="10" fill="' + (asked ? '#FFF8E3' : found ? '#DDF4E8' : '#FFFFFF') + '" stroke="' +
        (asked ? GOLD : found ? GREEN : empty ? GREY : NAVY) + '" stroke-width="' + (asked || found ? 3.5 : 2.5) + '"' + (asked || empty ? ' stroke-dasharray="6 5"' : '') + '/>';
      const t = asked ? '?' : String(b);
      if (t) s += '<text x="' + cx + '" y="' + (cy + 8) + '" font-size="' + Math.min(26, Math.round(165 / Math.max(t.length, 1))) + '" font-weight="800" text-anchor="middle" fill="' + (asked ? GOLD_D : NAVY) + '">' + t + '</text>';
      if (i < n - 1) {
        const x1 = x + BW + 7, x2 = x + BW + GAP - 7, ay = cy + 4, lab = String(ops[i] == null ? '' : ops[i]), q = /\?$/.test(lab), found2 = hl.op === i, mx = (x1 + x2) / 2;
        s += '<line x1="' + x1 + '" y1="' + ay + '" x2="' + (x2 - 9) + '" y2="' + ay + '" stroke="' + ARROW + '" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<polygon points="' + x2 + ',' + ay + ' ' + (x2 - 12) + ',' + (ay - 7) + ' ' + (x2 - 12) + ',' + (ay + 7) + '" fill="' + ARROW + '"/>';
        if (q) {
          s += '<text x="' + (mx - 24) + '" y="' + (ay - 14) + '" font-size="23" font-weight="800" text-anchor="middle" fill="' + NAVY + '">' + lab.replace(/\s*\?$/, '') + '</text>';
          s += '<rect x="' + (mx - 8) + '" y="' + (ay - 36) + '" width="36" height="28" rx="6" fill="#FFF8E3" stroke="' + GOLD + '" stroke-width="3" stroke-dasharray="5 4"/>';
          s += '<text x="' + (mx + 10) + '" y="' + (ay - 15) + '" font-size="18" font-weight="800" text-anchor="middle" fill="' + GOLD_D + '">?</text>';
        } else {
          if (found2) s += '<rect x="' + (mx - 42) + '" y="' + (ay - 37) + '" width="84" height="30" rx="6" fill="#DDF4E8" stroke="' + GREEN + '" stroke-width="2.5"/>';
          s += '<text x="' + mx + '" y="' + (ay - 15) + '" font-size="' + (lab.length > 6 ? 21 : 23) + '" font-weight="800" text-anchor="middle" fill="' + NAVY + '">' + lab + '</text>';
        }
      }
    });
    s += '</svg>';
    const say = boxes.map(function (b, i) { return (b == null ? 'an empty box to fill' : b === '' ? 'an empty box' : b) + (i < n - 1 ? ', then ' + String(ops[i]).replace('?', 'an empty box') + ', ' : ''); }).join('');
    const box = wrap('g4s2-flow', 'Flow diagram: ' + say + '.', s, spec.cap || '');
    box.style.setProperty('--g4s2-w', W);
    return box;
  }

  kinds.s2slide = slide;
  kinds.s2flow = flow;
})(window.T = window.T || {});
