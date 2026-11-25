/* g4-pics-s7.js - the pictures of Stop 7, Triangles and symmetry (styles: src/css/030g_g4-s7.css). SVG on the light art plate.
   Every mark is worked out from the data by MX.s7 (009d_g4-models-s7.js): which sides get a tick mark, which angles an
   arc, where the lines of symmetry are.

   { k: 's7tri', pts: [[x,y] x 3], g: 'iso' (isometric dots; default: square dots), w, h (the size of the dot grid)
                 or sides: [a, b, c] or angs: [A, B, C] (drawn to scale, no dots), rot: degrees,
     ticks: true (tick marks on equal sides), lens: 'cm' (side lengths, with sides), deg: true (the angles in degrees),
     arcs: true (arcs in equal angles), sym: true (dashed lines of symmetry), rt: true (the right-angle mark), label: 'A' }
   { k: 's7grid', w, h, cells: [[col,row]], cells2: [[col,row]], c2: 'refl' | 'bad' | 'new' (orange) | 'same' (blue),
     line: { k: 'v' | 'h', at } or lines: [line, line], lab: true (the key "mirror line" under the grid),
     sym: true (dashed: every line of symmetry of all the shaded squares), cap: 'words under the picture' }
   { k: 's7card', sym: true, only: ['isosceles'] }   the three types of triangle with their marks and names */
(function (T) {
  'use strict';
  const kinds = T.tools.picKinds = T.tools.picKinds || {};
  const el = T.util.el;
  const INK = '#10305E', BLUE = '#2F7FD4', BLUE_D = '#1D62AE', SOFT = '#D5E6F8', OR = '#F5A623', OR_D = '#B36B00', RED = '#D22630', GRID = '#AFC1D6';
  const f1 = function (v) { return (Math.round(v * 10) / 10).toString(); };

  function figure(svg, w, cls, cap, label) {
    const fig = el('figure', { class: ['g4s7-pic', cls], style: '--g4s7-w:' + (w / 16 * 1.5).toFixed(3) + 'rem' });
    const box = el('div', { class: 'g4s7-pic__svg' });
    box.innerHTML = svg;
    if (label) box.firstChild.setAttribute('aria-label', label);
    fig.appendChild(box);
    if (cap) fig.appendChild(cap);
    return fig;
  }
  const dash = function (x1, y1, x2, y2, cls) {
    return '<line class="' + (cls || 'g4s7-mirror') + '" x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" stroke="' + RED + '" stroke-width="3" stroke-dasharray="7 5" stroke-linecap="round"/>';
  };
  function key(text) {
    return el('figcaption', { class: 'g4s7-key' }, el('span', { class: 'g4s7-key__dash', 'aria-hidden': 'true' }), el('span', text));
  }

  /* ---------- a triangle ---------- */
  function triSvg(spec) {
    const S = window.MX.s7, t = S.tri(spec), grid = !!spec.pts, iso = spec.g === 'iso';
    let P = t.P.map(function (p) { return [p[0], p[1]]; }), dots = [], W, H, U, ox, oy;
    const labels = !!(spec.lens || spec.deg);
    if (grid) {
      U = 30;
      const xs = P.map(function (p) { return p[0]; }), ys = spec.pts.map(function (p) { return p[1]; });
      const gh = spec.h != null ? spec.h : Math.max.apply(null, ys), k = iso ? Math.sqrt(3) / 2 : 1;
      const gw = spec.w != null ? spec.w : Math.ceil(Math.max.apply(null, xs));
      for (let j = 0; j <= gh; j++) for (let i = -gh; i <= gw; i++) {
        const x = iso ? i + j / 2 : i, y = j * k;
        if (x >= -0.01 && x <= gw + 0.01) dots.push([x, y]);
      }
      const pad = 14, padL = spec.label ? 36 : pad;            /* room for the letter, clear of the dots */
      W = gw * U + pad + padL; H = gh * k * U + 2 * pad; ox = padL; oy = pad;
    } else {
      const rot = (spec.rot || 0) * Math.PI / 180, c = Math.cos(rot), s = Math.sin(rot);
      P = P.map(function (p) { return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; });
      const xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; });
      const x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      W = 180; H = 150;
      const pad = labels ? 34 : 18, padX = spec.lens ? 50 : spec.deg ? 42 : pad;
      U = Math.min((W - 2 * padX) / (x1 - x0), (H - 2 * pad) / (y1 - y0));
      ox = (W - (x1 - x0) * U) / 2 - x0 * U; oy = (H - (y1 - y0) * U) / 2 - y0 * U;
    }
    const X = function (p) { return [ox + p[0] * U, oy + p[1] * U]; };
    const Q = P.map(X), cx = (Q[0][0] + Q[1][0] + Q[2][0]) / 3, cy = (Q[0][1] + Q[1][1] + Q[2][1]) / 3;
    let s = '';
    dots.forEach(function (d) { const q = X(d); s += '<circle cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="2.4" fill="#8FA5C0"/>'; });
    s += '<polygon points="' + Q.map(function (q) { return f1(q[0]) + ',' + f1(q[1]); }).join(' ') + '" fill="' + SOFT + '" fill-opacity=".75" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
    if (spec.arcs || spec.deg) {
      [0, 1, 2].forEach(function (i) {
        if (!spec.deg && !t.eqAng[i]) return;
        if (spec.deg && Math.abs(t.ang[i] - 90) < 0.01) return;  /* a right angle gets the square mark below */
        const a = Q[i], b = Q[(i + 1) % 3], c = Q[(i + 2) % 3], r = 17;
        const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - a[0], c[1] - a[1]], lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]);
        const p1 = [a[0] + u[0] / lu * r, a[1] + u[1] / lu * r], p2 = [a[0] + v[0] / lv * r, a[1] + v[1] / lv * r];
        const sweep = u[0] * v[1] - u[1] * v[0] > 0 ? 1 : 0;
        s += '<path d="M' + f1(p1[0]) + ' ' + f1(p1[1]) + ' A' + r + ' ' + r + ' 0 0 ' + sweep + ' ' + f1(p2[0]) + ' ' + f1(p2[1]) + '" fill="none" stroke="' + (t.eqAng[i] ? RED : '#6A83A6') + '" stroke-width="2.4"/>';
      });
    }
    if ((spec.rt || spec.deg) && t.right) {
      const i = t.ang.findIndex(function (a) { return Math.abs(a - 90) < 0.01; });
      if (i >= 0) {
        const a = Q[i], b = Q[(i + 1) % 3], c = Q[(i + 2) % 3], r = 11;
        const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - a[0], c[1] - a[1]], lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]);
        const p1 = [a[0] + u[0] / lu * r, a[1] + u[1] / lu * r], p2 = [a[0] + v[0] / lv * r, a[1] + v[1] / lv * r];
        s += '<path d="M' + f1(p1[0]) + ' ' + f1(p1[1]) + ' L' + f1(p1[0] + p2[0] - a[0]) + ' ' + f1(p1[1] + p2[1] - a[1]) + ' L' + f1(p2[0]) + ' ' + f1(p2[1]) + '" fill="none" stroke="' + INK + '" stroke-width="2"/>';
      }
    }
    [0, 1, 2].forEach(function (i) {
      const a = Q[i], b = Q[(i + 1) % 3], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len, out = (mx - cx) * nx + (my - cy) * ny > 0 ? 1 : -1;
      if (spec.ticks && t.eqSide[i]) s += '<line x1="' + f1(mx - nx * 6.5) + '" y1="' + f1(my - ny * 6.5) + '" x2="' + f1(mx + nx * 6.5) + '" y2="' + f1(my + ny * 6.5) + '" stroke="' + RED + '" stroke-width="3" stroke-linecap="round"/>';
      if (spec.lens && spec.sides) {
        const ex = nx * out, ey = ny * out, d = (spec.ticks && t.eqSide[i] ? 13 : 9) + Math.abs(ey) * 6;
        const anchor = ex > 0.35 ? 'start' : ex < -0.35 ? 'end' : 'middle';
        s += '<text x="' + f1(mx + ex * d) + '" y="' + f1(my + ey * d + 5.5) + '" text-anchor="' + anchor + '" class="g4s7-t">' + spec.sides[i] + ' ' + spec.lens + '</text>';
      }
      if (spec.deg) {
        const q = Q[i], dx = q[0] - cx, dy = q[1] - cy, l = Math.hypot(dx, dy), v = spec.angs ? spec.angs[i] : Math.round(t.ang[i]);
        s += '<text x="' + f1(q[0] + dx / l * 19) + '" y="' + f1(q[1] + dy / l * 17 + 6.5) + '" text-anchor="middle" class="g4s7-t g4s7-t--deg">' + v + '°</text>';
      }
    });
    if (spec.sym) {
      [0, 1, 2].forEach(function (i) {
        if (!t.eq[i]) return;
        const a = Q[i], b = Q[(i + 1) % 3], c = Q[(i + 2) % 3], m = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2], l = Math.hypot(m[0] - a[0], m[1] - a[1]), e = 11, e0 = spec.deg ? 0 : e;
        s += dash(a[0] - (m[0] - a[0]) / l * e0, a[1] - (m[1] - a[1]) / l * e0, m[0] + (m[0] - a[0]) / l * e, m[1] + (m[1] - a[1]) / l * e, 'g4s7-sym');
      });
    }
    if (spec.label) s += '<text x="8" y="20" class="g4s7-t g4s7-t--lab">' + spec.label + '</text>';
    return { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + f1(W) + ' ' + f1(H) + '" role="img">' + s + '</svg>', w: W, t: t };
  }
  kinds.s7tri = function (spec) {
    const r = triSvg(spec);
    return figure(r.svg, r.w, 'g4s7-pic--tri', spec.cap ? el('figcaption', { class: 'g4s7-cap' }, spec.cap) : null, 'A triangle' + (spec.label ? ' ' + spec.label : ''));
  };

  /* ---------- a square grid with shaded squares ---------- */
  kinds.s7grid = function (spec) {
    const S = window.MX.s7, C = 24, pad = 8, w = spec.w, h = spec.h, W = w * C + 2 * pad, H = h * C + 2 * pad;
    let s = '<rect x="' + pad + '" y="' + pad + '" width="' + w * C + '" height="' + h * C + '" fill="#FFFFFF"/>';
    const sq = function (c, fill, edge, mark) {
      const x = pad + c[0] * C, y = pad + c[1] * C;
      let o = '<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="' + (C - 2) + '" height="' + (C - 2) + '" rx="2" fill="' + fill + '" stroke="' + edge + '" stroke-width="2"/>';
      if (mark) o += '<circle cx="' + (x + C / 2) + '" cy="' + (y + C / 2) + '" r="3.2" fill="#FFFFFF"/>';
      return o;
    };
    for (let i = 0; i <= w; i++) s += '<line x1="' + (pad + i * C) + '" y1="' + pad + '" x2="' + (pad + i * C) + '" y2="' + (pad + h * C) + '" stroke="' + GRID + '" stroke-width="' + (i % w ? 1.2 : 2) + '"/>';
    for (let j = 0; j <= h; j++) s += '<line x1="' + pad + '" y1="' + (pad + j * C) + '" x2="' + (pad + w * C) + '" y2="' + (pad + j * C) + '" stroke="' + GRID + '" stroke-width="' + (j % h ? 1.2 : 2) + '"/>';
    (spec.cells || []).forEach(function (c) { s += sq(c, BLUE, BLUE_D, false); });
    const orange = spec.c2 !== 'same';
    (spec.cells2 || []).forEach(function (c) { s += orange ? sq(c, OR, OR_D, true) : sq(c, BLUE, BLUE_D, false); });
    const lines = (spec.lines || (spec.line ? [spec.line] : []));
    lines.forEach(function (l) {
      if (l.k === 'v') s += dash(pad + l.at * C, 2, pad + l.at * C, H - 2);
      else s += dash(2, pad + l.at * C, W - 2, pad + l.at * C);
    });
    let nsym = 0;
    if (spec.sym) {
      const all = (spec.cells || []).concat(spec.cells2 || []), b = S.box(all), ls = S.symLines(all);
      const x0 = pad + b.x0 * C, x1 = pad + (b.x1 + 1) * C, y0 = pad + b.y0 * C, y1 = pad + (b.y1 + 1) * C, e = 7;
      nsym = ls.length;
      ls.forEach(function (k) {
        if (k === 'v') s += dash((x0 + x1) / 2, Math.max(2, y0 - e - 6), (x0 + x1) / 2, Math.min(H - 2, y1 + e + 6), 'g4s7-sym');
        else if (k === 'h') s += dash(Math.max(2, x0 - e - 6), (y0 + y1) / 2, Math.min(W - 2, x1 + e + 6), (y0 + y1) / 2, 'g4s7-sym');
        else if (k === 'd1') s += dash(x0 - e, y0 - e, x1 + e, y1 + e, 'g4s7-sym');
        else s += dash(x1 + e, y0 - e, x0 - e, y1 + e, 'g4s7-sym');
      });
    }
    const cap = spec.cap ? el('figcaption', { class: 'g4s7-cap' }, spec.cap) : spec.lab && lines.length ? key(lines.length > 1 ? 'mirror lines' : 'mirror line')
      : spec.sym && nsym ? key(nsym > 1 ? 'lines of symmetry' : 'line of symmetry') : null;
    return figure('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img">' + s + '</svg>', W, 'g4s7-pic--grid', cap,
      'A square grid with shaded squares' + (lines.length ? ' and a dashed mirror line' : ''));
  };

  /* ---------- the three types of triangle ---------- */
  const CARD = {
    equilateral: { sides: [6, 6, 6], n: '3 lines' },
    isosceles: { sides: [4, 7, 7], n: '1 line' },
    scalene: { sides: [7, 4.2, 5.4], n: '0 lines' }
  };
  kinds.s7card = function (spec) {
    const row = el('div', { class: 'g4s7-card' });
    (spec.only || ['equilateral', 'isosceles', 'scalene']).forEach(function (name) {
      const r = triSvg({ sides: CARD[name].sides, ticks: true, arcs: true, sym: !!spec.sym });
      if (r.t.type !== name) throw new Error('s7card: ' + name);
      row.appendChild(figure(r.svg, r.w * 0.8, 'g4s7-pic--tri', el('figcaption', { class: 'g4s7-cap' }, el('b', name), spec.sym ? el('span', CARD[name].n) : null), 'An ' + name + ' triangle'));
    });
    return row;
  };
})(window.T = window.T || {});
