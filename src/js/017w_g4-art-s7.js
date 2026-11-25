/* g4-art-s7.js - the Stop 7 word card pictures (Triangles and symmetry), flat style, viewBox 400 x 300, no words inside.

   w-equilateral, w-isosceles, w-scalene                 Set A: triangles (red tick marks = equal sides, red arcs = equal angles)
   w-line-of-symmetry, w-symmetrical, w-mirror-line      Set B: symmetry (the red dashed line is always the mirror line)
   w-reflection, w-horizontal, w-vertical                Set C: reflect (blue = the shape, orange = its reflection) */
(function () {
  'use strict';
  const ART = window.T_ART = window.T_ART || {};
  const INK = '#2A2F3A', BLUE = '#2F7FD4', BLUE_D = '#1D62AE', SOFT = '#D5E6F8', OR = '#F5A623', OR_D = '#B36B00', RED = '#D22630', GOLD_S = '#FFF1CF', GREEN = '#1E9E6A';

  function word(id, label, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="art" data-art="' + id +
      '" role="img" aria-label="' + label + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' + body + '</svg>';
  }
  const poly = function (pts, fill, stroke, sw) {
    return '<polygon points="' + pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '" fill="' + fill + '" stroke="' + (stroke || INK) + '" stroke-width="' + (sw || 6) + '"/>';
  };
  const line = function (a, b, col, sw, dashed) {
    return '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + col + '" stroke-width="' + sw + '"' + (dashed ? ' stroke-dasharray="' + dashed + '"' : '') + '/>';
  };
  /* n small marks across the middle of side a-b */
  function ticks(a, b, n) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len, nx = -uy, ny = ux;
    let s = '';
    for (let i = 0; i < n; i++) {
      const o = (i - (n - 1) / 2) * 12, mx = (a[0] + b[0]) / 2 + ux * o, my = (a[1] + b[1]) / 2 + uy * o;
      s += line([(mx - nx * 14).toFixed(1), (my - ny * 14).toFixed(1)], [(mx + nx * 14).toFixed(1), (my + ny * 14).toFixed(1)], RED, 6);
    }
    return s;
  }
  /* an arc inside corner a, between the sides to b and c */
  function arc(a, b, c, r) {
    const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - a[0], c[1] - a[1]], lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]);
    const p1 = [a[0] + u[0] / lu * r, a[1] + u[1] / lu * r], p2 = [a[0] + v[0] / lv * r, a[1] + v[1] / lv * r];
    return '<path d="M' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 0 ' + (u[0] * v[1] - u[1] * v[0] > 0 ? 1 : 0) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + '" stroke="' + RED + '" stroke-width="5"/>';
  }
  const mirror = function (a, b) { return line(a, b, RED, 6, '16 12'); };
  const sq = function (x, y, s, fill, edge) { return '<rect x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" rx="3" fill="' + fill + '" stroke="' + edge + '" stroke-width="3"/>'; };
  function grid(x, y, cols, rows, s) {
    let o = '<rect x="' + x + '" y="' + y + '" width="' + cols * s + '" height="' + rows * s + '" fill="#FFFFFF" stroke="#8FA5C0" stroke-width="3"/>';
    for (let i = 1; i < cols; i++) o += line([x + i * s, y], [x + i * s, y + rows * s], '#B8C8DB', 2);
    for (let j = 1; j < rows; j++) o += line([x, y + j * s], [x + cols * s, y + j * s], '#B8C8DB', 2);
    return o;
  }
  const cells = function (x, y, s, list, fill, edge) { return list.map(function (c) { return sq(x + c[0] * s + 2, y + c[1] * s + 2, s - 4, fill, edge); }).join(''); };

  /* Set A: triangles */
  (function () {
    const A = [200, 42], B = [326, 260], C = [74, 260];
    ART['w-equilateral'] = word('w-equilateral', 'A triangle with three equal sides and three equal angles.',
      poly([A, B, C], SOFT, INK) + arc(A, B, C, 34) + arc(B, C, A, 34) + arc(C, A, B, 34) + ticks(A, B, 1) + ticks(B, C, 1) + ticks(C, A, 1));
    const D = [200, 30], E = [282, 264], F = [118, 264];
    ART['w-isosceles'] = word('w-isosceles', 'A tall triangle with two equal sides and two equal angles.',
      poly([D, E, F], GOLD_S, INK) + arc(E, F, D, 34) + arc(F, D, E, 34) + ticks(D, E, 1) + ticks(F, D, 1));
    const G = [50, 250], H = [360, 250], I = [154, 91];          /* sides 310, 260 and 190: clearly different */
    ART['w-scalene'] = word('w-scalene', 'A triangle with three sides of different lengths, each in a different colour.',
      poly([G, H, I], '#EEF3F8', 'none', 0) + line(G, H, BLUE, 9) + line(H, I, OR, 9) + line(I, G, GREEN, 9) +
      [G, H, I].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" fill="' + INK + '"/>'; }).join(''));
  })();

  /* Set B: symmetry */
  ART['w-line-of-symmetry'] = word('w-line-of-symmetry', 'A heart with a dashed line down the middle. The two halves match.',
    '<path d="M200 262 C120 200 62 150 62 100 C62 58 96 36 130 36 C162 36 188 56 200 84 C212 56 238 36 270 36 C304 36 338 58 338 100 C338 150 280 200 200 262 Z" fill="#F7B8BE" stroke="' + INK + '" stroke-width="6"/>' +
    mirror([200, 14], [200, 288]));

  ART['w-symmetrical'] = word('w-symmetrical', 'A butterfly. Its left wing and right wing match exactly.',
    '<ellipse cx="122" cy="110" rx="78" ry="62" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="6"/><ellipse cx="278" cy="110" rx="78" ry="62" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<ellipse cx="138" cy="206" rx="56" ry="46" fill="' + OR + '" stroke="' + INK + '" stroke-width="6"/><ellipse cx="262" cy="206" rx="56" ry="46" fill="' + OR + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="116" cy="106" r="20" fill="#FFFFFF"/><circle cx="284" cy="106" r="20" fill="#FFFFFF"/><circle cx="140" cy="208" r="13" fill="#FFFFFF"/><circle cx="260" cy="208" r="13" fill="#FFFFFF"/>' +
    '<rect x="188" y="62" width="24" height="196" rx="12" fill="' + INK + '"/>' +
    '<path d="M196 66 C188 40 176 28 160 24 M204 66 C212 40 224 28 240 24" stroke="' + INK + '" stroke-width="5"/>');

  ART['w-mirror-line'] = word('w-mirror-line', 'A grid. A red dashed line runs down the middle. The shapes on both sides match.',
    grid(40, 50, 8, 5, 40) + cells(40, 50, 40, [[1, 1], [2, 1], [2, 2], [2, 3]], BLUE, BLUE_D) + cells(40, 50, 40, [[6, 1], [5, 1], [5, 2], [5, 3]], '#BFD8F2', '#8FB4DD') +
    '<rect x="186" y="22" width="28" height="256" rx="14" fill="' + GOLD_S + '" stroke="' + OR + '" stroke-width="3"/>' + mirror([200, 34], [200, 268]));

  ART['w-reflection'] = word('w-reflection', 'A house and a tree beside a lake. The water shows them upside down.',
    '<rect x="0" y="150" width="400" height="150" fill="#CFE6F7"/>' +
    /* the house and the tree */
    '<rect x="96" y="92" width="92" height="58" fill="#FFE2B0" stroke="' + INK + '" stroke-width="5"/>' + poly([[84, 92], [142, 44], [200, 92]], '#E5404A', INK, 5) +
    '<rect x="128" y="112" width="26" height="38" fill="' + BLUE_D + '"/>' +
    '<rect x="282" y="104" width="14" height="46" fill="#8A5A2B"/>' + poly([[250, 110], [289, 34], [328, 110]], GREEN, INK, 5) +
    /* their reflections, paler */
    '<g opacity=".5"><rect x="96" y="150" width="92" height="58" fill="#FFE2B0" stroke="' + INK + '" stroke-width="5"/>' + poly([[84, 208], [142, 256], [200, 208]], '#E5404A', INK, 5) +
    '<rect x="128" y="150" width="26" height="38" fill="' + BLUE_D + '"/>' +
    '<rect x="282" y="150" width="14" height="46" fill="#8A5A2B"/>' + poly([[250, 190], [289, 266], [328, 190]], GREEN, INK, 5) + '</g>' +
    mirror([10, 150], [390, 150]));

  const arrow = function (a, b) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len, h = 20;
    const head = function (p, sx) { return poly([[p[0], p[1]], [p[0] - sx * (ux * h) - uy * 12, p[1] - sx * (uy * h) + ux * 12], [p[0] - sx * (ux * h) + uy * 12, p[1] - sx * (uy * h) - ux * 12]], INK, INK, 3); };
    return line(a, b, INK, 7) + head(b, 1) + head(a, -1);
  };
  ART['w-horizontal'] = word('w-horizontal', 'A flat line that goes from left to right, like the top of a lake, with an arrow along it.',
    '<circle cx="290" cy="96" r="44" fill="' + OR + '"/>' + '<rect x="20" y="150" width="360" height="100" rx="10" fill="#CFE6F7"/>' +
    line([20, 150], [380, 150], BLUE_D, 10) + arrow([70, 206], [330, 206]));
  ART['w-vertical'] = word('w-vertical', 'A flag pole that stands straight up, with an arrow that points up and down.',
    '<rect x="60" y="256" width="150" height="20" rx="8" fill="#8FA5C0"/>' + line([134, 258], [134, 36], BLUE_D, 10) +
    poly([[140, 44], [236, 72], [140, 104]], '#E5404A', INK, 5) + arrow([300, 60], [300, 250]));
})();
