/* g4-art-s2.js - the Stop 2 word card pictures (Grade 4), in the flat style of 10-art-words-6.js (viewBox 400 x 300).

   w-s2-multiply, w-s2-divide, w-s2-inverse          Set A: the operations
   w-s2-column, w-s2-left, w-s2-right                Set B: moving digits
   w-s2-placeholder, w-s2-flow, w-s2-identical       Set C: zeros, diagrams and stories

   Meaning in colour, the same as the Stop 2 pictures (047g_g4-pics-s2.js): whole-number columns are blue, decimal
   columns amber, the arrows that move a digit are red, what you must find or look at is gold. No word is written in a
   picture (the Words quiz asks for the word): only digits and the signs × ÷. */
(function () {
  'use strict';

  const INK = '#10305E', BLUE = '#2F7FD4', BLUE_SOFT = '#D5E6F8', BLUE_MID = '#BBD7F5', AMBER = '#FBD98A', AMBER_SOFT = '#FFF3D6';
  const GOLD = '#F5A623', GOLD_D = '#A86A00', RED = '#D8472B', GREEN = '#1E9E6A', GREEN_SOFT = '#DDF4E8', GREY = '#8A9BB3';
  const FONT = 'font-family="Arial, Helvetica, sans-serif" font-weight="700"';

  function word(id, label, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="art" data-art="' + id +
      '" role="img" aria-label="' + label + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' + body + '</svg>';
  }
  function txt(x, y, size, text, fill, anchor) {
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + size + '" text-anchor="' + (anchor || 'middle') + '" fill="' + (fill || INK) + '" stroke="none">' + text + '</text>';
  }
  function box(x, y, w, h, fill, stroke, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + (fill || '#FFFFFF') + '" stroke="' + (stroke || INK) + '" stroke-width="4"' + (extra || '') + '/>';
  }
  // a box with a number in it, centred at cx, cy
  function num(cx, cy, w, h, t, size, fill, stroke, extra) {
    return box(cx - w / 2, cy - h / 2, w, h, fill, stroke, extra) + txt(cx, cy + size * 0.35, size, t);
  }
  // a straight arrow from x1, y1 to x2, y2
  function arrow(x1, y1, x2, y2, col, wd) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy), ux = dx / len, uy = dy / len, s = (wd || 7) * 2.2, hx = x2 - ux * s, hy = y2 - uy * s;
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + hx.toFixed(1) + '" y2="' + hy.toFixed(1) + '" stroke="' + (col || RED) + '" stroke-width="' + (wd || 7) + '"/>' +
      '<polygon points="' + x2 + ',' + y2 + ' ' + (hx - uy * s * 0.6).toFixed(1) + ',' + (hy + ux * s * 0.6).toFixed(1) + ' ' + (hx + uy * s * 0.6).toFixed(1) + ',' + (hy - ux * s * 0.6).toFixed(1) + '" fill="' + (col || RED) + '" stroke="' + (col || RED) + '" stroke-width="2"/>';
  }
  // a curved arrow (an arc over or under) from x1 to x2 at height y, bending by b
  function curve(x1, x2, y, b, col) {
    const mx = (x1 + x2) / 2, back = x2 < x1 ? -1 : 1, up = b < 0 ? -1 : 1;
    return '<path d="M' + x1 + ' ' + y + ' Q' + mx + ' ' + (y + b) + ' ' + x2 + ' ' + y + '" stroke="' + col + '" stroke-width="7"/>' +
      '<polygon points="' + x2 + ',' + (y - up * 3) + ' ' + (x2 - back * 22) + ',' + (y + up * 4) + ' ' + (x2 - back * 8) + ',' + (y + up * 24) + '" fill="' + col + '" stroke="' + col + '" stroke-width="2"/>';
  }
  // a round sign with × or ÷
  function sign(cx, cy, r, ch, col) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + col + '" stroke="' + INK + '" stroke-width="4"/>' + txt(cx, cy + r * 0.38, r * 1.25, ch, '#FFFFFF');
  }
  // a row of n small squares starting at x, y
  function cubes(x, y, n, sz, fill) {
    let s = '';
    for (let i = 0; i < n; i++) s += '<rect x="' + (x + i * (sz + 3)) + '" y="' + y + '" width="' + sz + '" height="' + sz + '" rx="4" fill="' + fill + '" stroke="' + INK + '" stroke-width="3"/>';
    return s;
  }
  // a small place value chart: cols = [[fill, head fill], ...], at x, y, each w wide and h high
  function chart(x, y, w, h, cols, hl) {
    let s = '';
    cols.forEach(function (c, i) {
      s += '<rect x="' + (x + i * w) + '" y="' + y + '" width="' + (w - 6) + '" height="' + h + '" rx="10" fill="' + c[0] + '" stroke="' + (hl === i ? GOLD : 'none') + '" stroke-width="' + (hl === i ? 7 : 0) + '"/>';
      s += '<rect x="' + (x + i * w) + '" y="' + y + '" width="' + (w - 6) + '" height="40" rx="10" fill="' + c[1] + '"/>';
    });
    return s;
  }
  const W = [BLUE_SOFT, BLUE_MID], D = [AMBER_SOFT, AMBER];
  // a bottle, centred at cx, standing on y
  function bottle(cx, y) {
    return '<path d="M' + (cx - 12) + ' ' + (y - 150) + ' h24 v26 q22 14 22 44 v70 q0 10 -10 10 h-48 q-10 0 -10 -10 v-70 q0 -30 22 -44 z" fill="#CFE8FA" stroke="' + INK + '" stroke-width="4"/>' +
      '<rect x="' + (cx - 15) + '" y="' + (y - 164) + '" width="30" height="16" rx="4" fill="' + RED + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<rect x="' + (cx - 34) + '" y="' + (y - 76) + '" width="68" height="40" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<circle cx="' + cx + '" cy="' + (y - 56) + '" r="10" fill="#FFFFFF" stroke="' + INK + '" stroke-width="3"/>';
  }

  window.T_ART = window.T_ART || {};
  Object.assign(window.T_ART, {
    // multiply: one cube becomes ten cubes, 3 × 10 = 30
    'w-s2-multiply': word('w-s2-multiply', 'One cube becomes ten cubes. 3 times 10 is 30.',
      cubes(34, 62, 1, 30, BLUE) + arrow(84, 77, 132, 77, RED, 6) + cubes(146, 62, 7, 30, BLUE) + cubes(146, 98, 3, 30, BLUE) +
      num(58, 208, 72, 76, '3', 46) + sign(136, 208, 32, '×', RED) + txt(200, 224, 44, '10') + txt(250, 222, 44, '=') + num(332, 208, 92, 76, '30', 46, GREEN_SOFT, GREEN)),
    // divide: ten cubes become one cube, 30 ÷ 10 = 3
    'w-s2-divide': word('w-s2-divide', 'Ten cubes become one cube. 30 divided by 10 is 3.',
      cubes(34, 62, 7, 30, GOLD) + cubes(34, 98, 3, 30, GOLD) + arrow(276, 77, 324, 77, RED, 6) + cubes(338, 62, 1, 30, GOLD) +
      num(64, 208, 92, 76, '30', 46) + sign(150, 208, 32, '÷', BLUE) + txt(216, 224, 44, '10') + txt(268, 222, 44, '=') + num(340, 208, 72, 76, '3', 46, GREEN_SOFT, GREEN)),
    // inverse: × 10 goes there, ÷ 10 comes back
    'w-s2-inverse': word('w-s2-inverse', 'Times 10 takes 6 to 60. Divide by 10 takes 60 back to 6.',
      num(84, 150, 96, 80, '6', 48) + num(316, 150, 96, 80, '60', 48) +
      curve(100, 300, 96, -70, RED) + curve(300, 100, 204, 70, BLUE) +
      txt(200, 52, 34, '× 10', RED) + txt(200, 272, 34, '÷ 10', BLUE)),
    // column: one column of the place value chart is marked
    'w-s2-column': word('w-s2-column', 'A place value chart. One column is marked in gold.',
      chart(26, 30, 88, 240, [W, W, W, D], 1) +
      num(67, 118, 54, 56, '4', 38) + num(155, 118, 54, 56, '7', 38) + num(243, 118, 54, 56, '2', 38) + num(331, 118, 54, 56, '5', 38) +
      num(67, 208, 54, 56, '1', 38) + num(155, 208, 54, 56, '3', 38) + num(243, 208, 54, 56, '8', 38) + num(331, 208, 54, 56, '6', 38) +
      '<circle cx="286" cy="140" r="7" fill="' + INK + '"/><circle cx="286" cy="230" r="7" fill="' + INK + '"/>'),
    // left: a digit moves to the left
    'w-s2-left': word('w-s2-left', 'A digit moves one place to the left.',
      chart(40, 40, 108, 220, [W, W, W]) +
      num(309, 170, 70, 72, '5', 48, '#FFFFFF', GREY, ' stroke-dasharray="8 7"') + num(93, 170, 70, 72, '5', 48, '#FFFFFF', BLUE) +
      arrow(262, 170, 142, 170, RED, 12)),
    // right: a digit moves to the right
    'w-s2-right': word('w-s2-right', 'A digit moves one place to the right.',
      chart(40, 40, 108, 220, [W, D, D]) +
      num(93, 170, 70, 72, '5', 48, '#FFFFFF', GREY, ' stroke-dasharray="8 7"') + num(309, 170, 70, 72, '5', 48, '#FFFFFF', BLUE) +
      arrow(140, 170, 260, 170, RED, 12) + '<circle cx="145" cy="232" r="7" fill="' + INK + '"/>'),
    // placeholder: the zero keeps the 4 in the hundreds place
    'w-s2-placeholder': word('w-s2-placeholder', 'The number 407. The zero holds the tens place.',
      chart(44, 40, 106, 220, [W, W, W]) +
      num(94, 170, 72, 80, '4', 52) + num(200, 170, 72, 80, '0', 52, '#FFF8E3', GOLD, ' stroke-dasharray="9 7"') + num(306, 170, 72, 80, '7', 52) +
      '<path d="M200 96 l-12 -22 h24 z" fill="' + GOLD + '" stroke="' + GOLD_D + '" stroke-width="3"/>'),
    // flow diagram: boxes joined by arrows
    'w-s2-flow': word('w-s2-flow', 'Three boxes joined by arrows, with an operation on each arrow.',
      num(62, 170, 88, 72, '4', 44) + num(200, 170, 88, 72, '40', 44) + num(338, 170, 88, 72, '4', 44, GREEN_SOFT, GREEN) +
      arrow(110, 170, 152, 170, RED, 7) + arrow(248, 170, 290, 170, RED, 7) +
      txt(131, 118, 28, '× 10', INK) + txt(269, 118, 28, '÷ 10', INK)),
    // identical: three bottles that are exactly the same
    'w-s2-identical': word('w-s2-identical', 'Three bottles that are exactly the same.',
      '<rect x="30" y="248" width="340" height="16" rx="8" fill="#C9A26B" stroke="' + INK + '" stroke-width="4"/>' +
      bottle(100, 248) + bottle(200, 248) + bottle(300, 248) + txt(150, 60, 40, '=', GREEN) + txt(250, 60, 40, '=', GREEN))
  });
})();
