/* g4-art-s4.js - the Stop 4 (Fractions) word card pictures, in the flat style of 10-art-words-6.js (viewBox 400 x 300).

   w-s4-numerator, w-s4-denominator, w-s4-unit-fraction                  Set A: the parts of a fraction
   w-s4-proper-fraction, w-s4-improper-fraction, w-s4-mixed-number       Set B: less than 1, more than 1
   w-s4-share-equally, w-s4-operator, w-s4-equivalent                    Set C: fractions at work

   Meaning in colour: shaded parts are gold, the number a card is about sits in a gold ring, wholes have a dark outline.
   No word is written in a picture (the Words quiz asks for the word); numbers and signs only. */
(function () {
  'use strict';

  const INK = '#2A2F3A';
  const FONT = 'font-family="Arial, Helvetica, sans-serif" font-weight="700"';
  const GOLD = '#F7B733', GOLD_D = '#B97700', SOFT = '#FFF1CF', BLUE = '#1F5CA0', BLUE_SOFT = '#D5E6F8', PAPER = '#FFFFFF', GREY = '#8796AC';
  const KIDS = ['#F7B733', '#5AA9E6', '#7BC96F', '#F28B82'];
  const r1 = function (x) { return Math.round(x * 10) / 10; };

  function word(id, label, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="art" data-art="' + id +
      '" role="img" aria-label="' + label + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' + body + '</svg>';
  }
  function txt(x, y, size, text, fill, anchor) {
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + size + '" text-anchor="' + (anchor || 'middle') +
      '" fill="' + (fill || INK) + '">' + text + '</text>';
  }
  // a fraction centred on x with its bar at y
  function frac(x, y, n, d, size, fill) {
    const w = Math.max(String(n).length, String(d).length) * size * 0.6 + 14;
    return txt(x, y - size * 0.24, size, n, fill) + '<path d="M' + r1(x - w / 2) + ' ' + y + 'h' + r1(w) + '" stroke="' + (fill || INK) + '" stroke-width="' + r1(size / 9) + '"/>' + txt(x, y + size * 0.96, size, d, fill);
  }
  function sector(cx, cy, r, i, d, fill, stroke) {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / d;
    return '<path d="M' + cx + ' ' + cy + ' L' + r1(cx + r * Math.cos(a0)) + ' ' + r1(cy + r * Math.sin(a0)) + ' A' + r + ' ' + r + ' 0 0 1 ' + r1(cx + r * Math.cos(a1)) + ' ' + r1(cy + r * Math.sin(a1)) +
      ' Z" fill="' + fill + '" stroke="' + (stroke || INK) + '" stroke-width="3"/>';
  }
  // a circle cut into d equal parts, the first n shaded
  function pie(cx, cy, r, n, d, colours) {
    let s = '';
    for (let i = 0; i < d; i++) s += sector(cx, cy, r, i, d, colours ? colours[i % colours.length] : i < n ? GOLD : PAPER);
    return s;
  }
  // a strip cut into d equal parts, the first n shaded
  function strip(x, y, w, h, n, d) {
    let s = '';
    for (let i = 0; i < d; i++) s += '<rect x="' + r1(x + i * w / d) + '" y="' + y + '" width="' + r1(w / d) + '" height="' + h + '" fill="' + (i < n ? GOLD : PAPER) + '" stroke="' + INK + '" stroke-width="3"/>';
    return s;
  }
  const ring = function (x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + SOFT + '" stroke="' + GOLD + '" stroke-width="6"/>'; };
  const arrow = function (x1, y1, x2, y2, col) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 13;
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + 'M' + r1(x2 - h * Math.cos(a - 0.5)) + ' ' + r1(y2 - h * Math.sin(a - 0.5)) + 'L' + x2 + ' ' + y2 + 'L' + r1(x2 - h * Math.cos(a + 0.5)) + ' ' + r1(y2 - h * Math.sin(a + 0.5)) + '" stroke="' + (col || BLUE) + '" stroke-width="5"/>';
  };

  const ART = window.T_ART = window.T_ART || {};

  /* ---------- Set A: the parts of a fraction ---------- */
  ART['w-s4-numerator'] = word('w-s4-numerator', 'The fraction 3 over 4. The top number 3 is in a gold ring. A circle has 3 of its 4 parts shaded.',
    ring(96, 96, 50) + frac(96, 150, 3, 4, 84) + arrow(156, 96, 206, 118) + pie(296, 150, 76, 3, 4));

  ART['w-s4-denominator'] = word('w-s4-denominator', 'The fraction 3 over 4. The bottom number 4 is in a gold ring. A circle is cut into 4 equal parts.',
    ring(96, 204, 50) + frac(96, 150, 3, 4, 84) + arrow(156, 204, 206, 182) +
    pie(296, 150, 76, 0, 4) + txt(268, 132, 26, '1', GREY) + txt(324, 132, 26, '2', GREY) + txt(324, 188, 26, '3', GREY) + txt(268, 188, 26, '4', GREY));

  ART['w-s4-unit-fraction'] = word('w-s4-unit-fraction', 'A strip cut into 5 equal parts with 1 part shaded. Under it the fraction 1 over 5, with the 1 in a gold ring.',
    strip(40, 44, 320, 72, 1, 5) + '<path d="M44 132h56" stroke="' + GOLD_D + '" stroke-width="5"/>' + ring(200, 176, 34) + frac(200, 214, 1, 5, 58));

  /* ---------- Set B: less than 1, more than 1 ---------- */
  ART['w-s4-proper-fraction'] = word('w-s4-proper-fraction', 'One circle with 3 of 4 parts shaded. The fraction 3 over 4 is less than 1.',
    pie(108, 150, 84, 3, 4) + frac(250, 150, 3, 4, 70) + txt(308, 172, 60, '&lt;', BLUE) + txt(354, 174, 66, '1'));

  ART['w-s4-improper-fraction'] = word('w-s4-improper-fraction', 'Two circles cut into quarters: 7 quarters are shaded. The fraction 7 over 4 is greater than 1.',
    pie(124, 92, 70, 4, 4) + pie(276, 92, 70, 3, 4) + frac(156, 226, 7, 4, 52) + txt(212, 244, 50, '&gt;', BLUE) + txt(256, 246, 54, '1'));

  ART['w-s4-mixed-number'] = word('w-s4-mixed-number', 'One whole circle and a circle with 3 of 4 parts shaded. Under them: 1 and 3 over 4.',
    '<circle cx="110" cy="96" r="70" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="3"/>' + pie(280, 96, 70, 3, 4) +
    txt(172, 262, 76, '1') + frac(228, 236, 3, 4, 46) + txt(194, 112, 46, '+', GREY));

  /* ---------- Set C: fractions at work ---------- */
  // a child: a round head on small shoulders, in the colour of the child's share
  const kid = function (x, y, col) {
    return '<path d="M' + (x - 26) + ' ' + (y + 46) + 'q0 -26 26 -26q26 0 26 26z" fill="' + col + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="19" fill="#FFE2C2" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M' + (x - 7) + ' ' + (y + 5) + 'q7 7 14 0" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<circle cx="' + (x - 7) + '" cy="' + (y - 4) + '" r="2.4" fill="' + INK + '"/><circle cx="' + (x + 7) + '" cy="' + (y - 4) + '" r="2.4" fill="' + INK + '"/>';
  };
  ART['w-s4-share-equally'] = word('w-s4-share-equally', '3 round cakes, each cut into 4 equal parts in 4 colours. Under them 4 children, one for each colour.',
    pie(80, 84, 56, 0, 4, KIDS) + pie(200, 84, 56, 0, 4, KIDS) + pie(320, 84, 56, 0, 4, KIDS) +
    kid(74, 196, KIDS[0]) + kid(158, 196, KIDS[1]) + kid(242, 196, KIDS[2]) + kid(326, 196, KIDS[3]) +
    '<path d="M36 268h328" stroke="#DCE8F3" stroke-width="6"/>');

  ART['w-s4-operator'] = word('w-s4-operator', 'A machine: the number 20 goes in, the machine is marked with 3 over 4, and 15 comes out.',
    txt(52, 170, 60, '20') + arrow(96, 150, 132, 150) +
    '<rect x="142" y="70" width="124" height="160" rx="22" fill="' + BLUE_SOFT + '" stroke="' + BLUE + '" stroke-width="6"/>' +
    '<circle cx="168" cy="92" r="6" fill="' + BLUE + '"/><circle cx="240" cy="92" r="6" fill="' + BLUE + '"/>' +
    ring(204, 152, 52) + frac(204, 152, 3, 4, 46) +
    arrow(276, 150, 312, 150) + txt(350, 170, 60, '15'));

  ART['w-s4-equivalent'] = word('w-s4-equivalent', '7 quarter pieces in a row are as long as 1 whole and 3 quarter pieces. 7 over 4 equals 1 and 3 over 4.',
    strip(24, 30, 196, 44, 4, 4) + strip(220, 30, 147, 44, 3, 3) +
    '<rect x="24" y="96" width="196" height="44" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="3"/>' + strip(220, 96, 147, 44, 3, 3) +
    '<path d="M24 82v6M367 82v6" stroke="' + GREY + '" stroke-width="4"/>' +
    frac(110, 222, 7, 4, 54) + txt(190, 242, 56, '=', BLUE) + txt(254, 244, 66, '1') + frac(308, 222, 3, 4, 46));
})();
