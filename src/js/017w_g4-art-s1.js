/* g4-art-s1.js - the Stop 1 word card pictures (Decimals and place value), flat style, viewBox 400 x 300.

   w-decimal-point, w-tenth, w-hundredth          Set A: the decimal places
   w-place-value, w-decompose, w-regroup          Set B: value and parts
   w-whole-number, w-round, w-nearest             Set C: rounding

   Meaning in colour, the same as the Stop 1 pictures (047g_g4-pics-s1.js): ones amber, tenths green, hundredths purple,
   the decimal point red. No word is written in a picture (the Words quiz asks for the word); numbers are. */
(function () {
  'use strict';

  const INK = '#2A2F3A', LINE = '#8796AC', RED = '#D22630', GOLD = '#F5A623', SOFT = '#FFF1CF';
  const O = ['#E89B12', '#8A5800', '#FDEFD2'], TN = ['#1E9E6A', '#147A51', '#DDF4E8'], HU = ['#8A5BD6', '#5E35A8', '#EBE2FA'], BL = ['#2F7FD4', '#1D62AE', '#DCEBFA'];
  const GO = '#1E7A4C', NO = '#C2252E';
  const FONT = 'font-family="Arial, Helvetica, sans-serif" font-weight="700"';

  function word(id, label, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="art" data-art="' + id +
      '" role="img" aria-label="' + label + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' + body + '</svg>';
  }
  function txt(x, y, size, text, fill, anchor) {
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + size + '" text-anchor="' + (anchor || 'middle') +
      '" fill="' + (fill || INK) + '" stroke="none">' + text + '</text>';
  }
  function chip(x, y, w, h, text, c, size) {
    return '<rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="14" fill="' + c[2] + '" stroke="' + c[0] + '" stroke-width="4"/>' +
      txt(x, y + (size || 34) * 0.36, size || 34, text, c[1]);
  }
  function arrow(x1, y1, x2, y2, col) {
    const a = Math.atan2(y2 - y1, x2 - x1), L = 14;
    const p = function (da) { return (x2 - L * Math.cos(a + da)).toFixed(1) + ' ' + (y2 - L * Math.sin(a + da)).toFixed(1); };
    return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + p(0.5) + ' L' + x2 + ' ' + y2 + ' L' + p(-0.5) + '" stroke="' + (col || INK) + '" stroke-width="5"/>';
  }
  // a square of 10 x 10 small squares at x, y with side s; cols full columns and cells small squares are shaded
  function square(x, y, s, cols, cells, full) {
    const u = s / 10;
    let b = '<rect x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" fill="' + (full ? O[0] : '#FFFFFF') + '"' + (full ? ' opacity=".6"' : '') + ' stroke="none"/>';
    if (cols) b += '<rect x="' + x + '" y="' + y + '" width="' + cols * u + '" height="' + s + '" fill="' + TN[0] + '" opacity=".8" stroke="none"/>';
    if (cells) b += '<rect x="' + (x + cols * u) + '" y="' + y + '" width="' + u + '" height="' + cells * u + '" fill="' + HU[0] + '" stroke="none"/>';
    for (let k = 1; k < 10; k++) {
      b += '<path d="M' + (x + k * u) + ' ' + y + ' V' + (y + s) + ' M' + x + ' ' + (y + k * u) + ' H' + (x + s) + '" stroke="' + LINE + '" stroke-width="1.2"/>';
    }
    return b + '<rect x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" stroke="' + INK + '" stroke-width="4"/>';
  }
  // a number line from x1 to x2 at y with n + 1 ticks; big = the indexes of the long ticks
  function line(x1, x2, y, n, big) {
    let b = '<path d="M' + (x1 - 16) + ' ' + y + ' H' + (x2 + 16) + '" stroke="' + INK + '" stroke-width="5"/>';
    for (let k = 0; k <= n; k++) {
      const x = x1 + k * (x2 - x1) / n, L = big.indexOf(k) >= 0 ? 16 : 8;
      b += '<path d="M' + x + ' ' + (y - L) + ' V' + (y + L) + '" stroke="' + INK + '" stroke-width="' + (L > 8 ? 5 : 3) + '"/>';
    }
    return b;
  }
  const dot = function (x, y, r, fill, edge) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" stroke="' + (edge || '#FFFFFF') + '" stroke-width="4"/>'; };

  const A = window.T_ART = window.T_ART || {};

  // the decimal point: 4 . 7 with the point big and red, in a gold ring, and an arrow to it
  A['w-decimal-point'] = word('w-decimal-point', 'The number 4.7 with its point in a ring',
    txt(118, 205, 150, '4', O[1]) + txt(292, 205, 150, '7', TN[1]) +
    '<circle cx="205" cy="190" r="34" fill="' + SOFT + '" stroke="' + GOLD + '" stroke-width="6"/>' + dot(205, 190, 16, RED, '#8E141C') +
    arrow(205, 52, 205, 138, RED));

  // one tenth: a bar cut into 10 equal parts, one part shaded
  A['w-tenth'] = word('w-tenth', 'A bar in 10 equal parts with 1 part shaded, and 0.1',
    (function () {
      let b = '<rect x="40" y="70" width="320" height="76" fill="#FFFFFF" stroke="none"/><rect x="40" y="70" width="32" height="76" fill="' + TN[0] + '" stroke="none"/>';
      for (let k = 1; k < 10; k++) b += '<path d="M' + (40 + k * 32) + ' 70 V146" stroke="' + INK + '" stroke-width="3"/>';
      return b + '<rect x="40" y="70" width="320" height="76" rx="4" stroke="' + INK + '" stroke-width="5"/>';
    })() + arrow(56, 196, 56, 160, TN[1]) + chip(110, 226, 120, 62, '0.1', TN, 40) + txt(268, 240, 34, '1 ÷ 10', INK));

  // one hundredth: a hundred square, one small square shaded
  A['w-hundredth'] = word('w-hundredth', 'A hundred square with 1 small square shaded, and 0.01',
    square(40, 40, 220, 0, 1) + arrow(300, 96, 70, 54, HU[1]) + chip(322, 130, 132, 60, '0.01', HU, 36) + txt(322, 214, 28, '1 ÷ 100', INK));

  // place value: a chart with coloured places, a number in it, one place lit
  A['w-place-value'] = word('w-place-value', 'A chart with the places 1, 0.1 and 0.01 and the number 2.58',
    (function () {
      const cols = [[40, O, '1', '2'], [160, TN, '0.1', '5'], [270, HU, '0.01', '8']];
      let b = '<rect x="150" y="34" width="112" height="232" rx="12" fill="' + SOFT + '" stroke="' + GOLD + '" stroke-width="6"/>';
      cols.forEach(function (c) {
        b += '<rect x="' + c[0] + '" y="46" width="92" height="56" rx="10" fill="' + c[1][2] + '" stroke="' + c[1][0] + '" stroke-width="4"/>' + txt(c[0] + 46, 86, 30, c[2], c[1][1]) +
          txt(c[0] + 46, 220, 104, c[3], INK);
      });
      return b + dot(146, 212, 11, RED, '#8E141C');
    })());

  // decompose: one number split into its parts
  A['w-decompose'] = word('w-decompose', '6.29 split into 6, 0.2 and 0.09',
    '<rect x="120" y="26" width="160" height="72" rx="16" fill="#FFFFFF" stroke="' + INK + '" stroke-width="5"/>' + txt(200, 78, 48, '6.29', INK) +
    arrow(170, 106, 72, 176, O[1]) + arrow(196, 106, 190, 176, TN[1]) + arrow(230, 106, 316, 176, HU[1]) +
    chip(60, 220, 84, 68, '6', O, 40) + chip(188, 220, 104, 68, '0.2', TN, 38) + chip(326, 220, 116, 68, '0.09', HU, 34) +
    txt(119, 232, 34, '+', INK) + txt(254, 232, 34, '+', INK));

  // regroup: ten tenth strips are swapped for one whole square
  A['w-regroup'] = word('w-regroup', '10 tenth strips change into 1 whole square',
    (function () {
      let b = '';
      for (let k = 0; k < 10; k++) b += '<rect x="' + (24 + k * 16) + '" y="70" width="12" height="150" rx="3" fill="' + TN[0] + '" stroke="' + TN[1] + '" stroke-width="2.5"/>';
      return b;
    })() + txt(102, 262, 30, '10 × 0.1', TN[1]) + arrow(196, 132, 236, 132, INK) + arrow(236, 162, 196, 162, INK) +
    square(250, 76, 130, 0, 0, true) + txt(315, 262, 34, '1', O[1]));

  // whole number: numbers with no decimal part get a tick, a decimal gets a cross
  A['w-whole-number'] = word('w-whole-number', 'The numbers 7 and 12 with ticks, and 3.5 with a cross',
    chip(70, 110, 96, 84, '7', BL, 52) + chip(196, 110, 116, 84, '12', BL, 52) + chip(326, 110, 104, 84, '3.5', ['#B6C2D2', '#6A7890', '#EEF2F7'], 40) +
    '<path d="M46 206 L66 228 L98 184" stroke="' + GO + '" stroke-width="10"/><path d="M172 206 L192 228 L224 184" stroke="' + GO + '" stroke-width="10"/>' +
    '<path d="M306 186 L346 228 M346 186 L306 228" stroke="' + NO + '" stroke-width="10"/>');

  // round: a point on the line jumps to the whole number
  A['w-round'] = word('w-round', 'On a number line from 6 to 7, the point 6.8 jumps to 7',
    line(40, 330, 190, 10, [0, 5, 10]) + txt(40, 250, 44, '6', INK) + txt(330, 250, 44, '7', GO) +
    '<circle cx="330" cy="234" r="34" stroke="' + GO + '" stroke-width="6"/>' +
    '<path d="M272 168 Q296 104 326 150" stroke="' + GO + '" stroke-width="6" stroke-dasharray="2 12"/>' + '<path d="M306 150 L330 162 L336 136" stroke="' + GO + '" stroke-width="6"/>' +
    dot(272, 190, 14, RED) + '<rect x="196" y="50" width="92" height="50" rx="25" fill="#FFFFFF" stroke="' + RED + '" stroke-width="4"/>' + txt(242, 87, 32, '6.8', INK) +
    '<path d="M250 102 L268 172" stroke="' + RED + '" stroke-width="4"/>');

  // nearest: one end is a short way off, the other a long way
  A['w-nearest'] = word('w-nearest', 'A point between 2 and 3: a short way to 2 and a long way to 3',
    line(50, 350, 150, 10, [0, 10]) + txt(50, 110, 44, '2', GO) + txt(350, 110, 44, '3', INK) +
    '<path d="M50 196 V216 H140 V196" stroke="' + GO + '" stroke-width="7"/><path d="M140 196 V216 H350 V196" stroke="' + LINE + '" stroke-width="7" stroke-dasharray="3 13"/>' +
    '<path d="M70 250 L92 272 L126 232" stroke="' + GO + '" stroke-width="10"/>' + dot(140, 150, 14, RED) + '<circle cx="50" cy="96" r="34" stroke="' + GO + '" stroke-width="6"/>');
})();
