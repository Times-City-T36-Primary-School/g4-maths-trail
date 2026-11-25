/* g4-art-s5.js - the Stop 5 word card pictures (Fractions, decimals and percentages), in the flat style of the other
   word pictures (viewBox 400 x 300).

   w-s5-percentage, w-s5-hundred-square, w-s5-whole            Set A: percentages
   w-s5-equivalent, w-s5-convert, w-s5-quarter                 Set B: the same value
   w-s5-compare, w-s5-order, w-s5-greatest                     Set C: compare and order

   Meaning in colour, the same as the Stop 5 pictures (030g_g4-s5.css): shaded squares are blue, a second part is gold,
   percentages are green. No word is written in a picture (the Words quiz asks for the word): only numbers and signs. */
(function () {
  'use strict';

  const INK = '#2A2F3A';
  const FONT = 'font-family="Arial, Helvetica, sans-serif" font-weight="700"';
  const GOLD = '#F5A623', GOLD_D = '#A86A00', SOFT = '#FFF1CF', BLUE = '#3F8FE0', BLUE_D = '#1D5FA8', BLUE_SOFT = '#DCEBFA';
  const GREEN = '#1E9E6A', GREEN_D = '#0B6641', GREEN_SOFT = '#DDF4E8', LINE = '#8796AC';

  function word(id, label, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="art" data-art="' + id +
      '" role="img" aria-label="' + label + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' + body + '</svg>';
  }
  function txt(x, y, size, text, fill, anchor) {
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + size + '" text-anchor="' + (anchor || 'middle') +
      '" fill="' + (fill || INK) + '">' + text + '</text>';
  }
  // a fraction: numerator, bar, denominator, centred at x; y is the bar
  function frac(x, y, n, d, size, fill) {
    const w = Math.max(String(n).length, String(d).length) * size * 0.34 + size * 0.14;
    return txt(x, y - size * 0.24, size, n, fill) + '<path d="M' + (x - w) + ' ' + y + 'h' + 2 * w + '" stroke="' + (fill || INK) + '" stroke-width="' + Math.max(3, size * 0.09) + '"/>' +
      txt(x, y + size * 0.94, size, d, fill);
  }
  // a 10 x 10 square of side `side`: the first n squares (down the columns, or along the rows) are blue, then b gold
  function grid(x, y, side, n, byCols, b) {
    const u = side / 10;
    let s = '<rect x="' + x + '" y="' + y + '" width="' + side + '" height="' + side + '" fill="#FFFFFF"/>';
    for (let i = 0; i < n + (b || 0); i++) {
      const c = byCols ? Math.floor(i / 10) : i % 10, r = byCols ? i % 10 : Math.floor(i / 10);
      s += '<rect x="' + (x + c * u) + '" y="' + (y + r * u) + '" width="' + u + '" height="' + u + '" fill="' + (i < n ? BLUE : GOLD) + '"/>';
    }
    let d = '';
    for (let i = 1; i < 10; i++) d += 'M' + (x + i * u) + ' ' + y + 'v' + side + 'M' + x + ' ' + (y + i * u) + 'h' + side;
    return s + '<path d="' + d + '" stroke="' + LINE + '" stroke-width="1.5"/><rect x="' + x + '" y="' + y + '" width="' + side + '" height="' + side + '" stroke="' + INK + '" stroke-width="4"/>';
  }
  function chip(x, y, w, h, fill, stroke) {
    return '<rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="14" fill="' + fill + '" stroke="' + stroke + '" stroke-width="4"/>';
  }
  const star = function (x, y, r) {
    let d = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (x + rr * Math.cos(a)).toFixed(1) + ' ' + (y + rr * Math.sin(a)).toFixed(1); }
    return '<path d="' + d + 'Z" fill="' + GOLD + '" stroke="' + GOLD_D + '" stroke-width="4"/>';
  };

  const ART = window.T_ART = window.T_ART || {};

  /* ---------- Set A: percentages ---------- */
  // 30 of 100 squares are shaded: the per cent sign
  ART['w-s5-percentage'] = word('w-s5-percentage', 'A hundred square with 30 squares shaded, and a per cent sign',
    grid(28, 50, 200, 30, true) +
    '<circle cx="316" cy="150" r="64" fill="' + GREEN_SOFT + '" stroke="' + GREEN + '" stroke-width="5"/>' + txt(316, 180, 84, '%', GREEN_D));

  // 10 rows of 10 squares make 100; one small square is gold
  ART['w-s5-hundred-square'] = word('w-s5-hundred-square', 'A square made of 10 rows of 10 small squares, 100 in all',
    grid(120, 56, 190, 0, false, 1) +
    '<path d="M120 40h190M120 32v16M310 32v16" stroke="' + BLUE_D + '" stroke-width="4"/>' + txt(215, 30, 26, '10', BLUE_D) +
    '<path d="M104 56v190M96 56h16M96 246h16" stroke="' + BLUE_D + '" stroke-width="4"/>' + txt(72, 160, 26, '10', BLUE_D) +
    txt(215, 284, 28, '10 × 10 = 100'));

  // every square is shaded: the whole, 100%
  ART['w-s5-whole'] = word('w-s5-whole', 'A hundred square with every square shaded: one hundred per cent',
    grid(24, 50, 200, 100, false) +
    chip(314, 150, 136, 84, GREEN_SOFT, GREEN) + txt(314, 166, 44, '100%', GREEN_D));

  /* ---------- Set B: the same value ---------- */
  // one half, 0.5 and 50% are equal
  ART['w-s5-equivalent'] = word('w-s5-equivalent', 'One half, zero point five and fifty per cent with equals signs between them',
    chip(58, 150, 88, 124, BLUE_SOFT, BLUE_D) + frac(58, 148, 1, 2, 44) +
    txt(124, 163, 38, '=') +
    chip(196, 150, 92, 124, SOFT, GOLD_D) + txt(196, 164, 38, '0.5') +
    txt(264, 163, 38, '=') +
    chip(338, 150, 100, 124, GREEN_SOFT, GREEN) + txt(338, 164, 36, '50%', GREEN_D));

  // 0.7 changes into 70%
  ART['w-s5-convert'] = word('w-s5-convert', 'An arrow changes zero point seven into seventy per cent',
    chip(96, 170, 130, 96, SOFT, GOLD_D) + txt(96, 188, 50, '0.7') +
    chip(304, 170, 130, 96, GREEN_SOFT, GREEN) + txt(304, 188, 48, '70%', GREEN_D) +
    '<path d="M100 104C150 40 250 40 296 100" stroke="' + BLUE_D + '" stroke-width="8"/>' +
    '<path d="M300 106l-30-6M300 106l-2-31" stroke="' + BLUE_D + '" stroke-width="8"/>');

  // one of four equal parts of a circle, and 25 of 100
  ART['w-s5-quarter'] = word('w-s5-quarter', 'A circle cut into four equal parts with one part shaded: one quarter, twenty-five per cent',
    '<circle cx="125" cy="150" r="96" fill="#FFFFFF" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M125 150V54A96 96 0 0 1 221 150Z" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M125 54v192M29 150h192" stroke="' + INK + '" stroke-width="5"/>' +
    frac(310, 100, 1, 4, 54) + txt(310, 190, 40, '=') +
    txt(310, 250, 46, '25%', GREEN_D));

  /* ---------- Set C: compare and order ---------- */
  // 0.6 is greater than 45%: two strips show how much
  const strip = function (x, part, fill) {
    return '<rect x="' + x + '" y="196" width="150" height="34" rx="6" fill="#FFFFFF"/><rect x="' + x + '" y="196" width="' + part * 1.5 + '" height="34" rx="6" fill="' + fill + '"/>' +
      '<rect x="' + x + '" y="196" width="150" height="34" rx="6" stroke="' + INK + '" stroke-width="4"/>';
  };
  ART['w-s5-compare'] = word('w-s5-compare', 'Zero point six is greater than forty-five per cent: two strips to compare',
    chip(95, 104, 130, 88, SOFT, GOLD_D) + txt(95, 121, 48, '0.6') +
    chip(305, 104, 130, 88, GREEN_SOFT, GREEN) + txt(305, 121, 44, '45%', GREEN_D) +
    '<path d="M180 76l42 28-42 28" stroke="#C2252E" stroke-width="10"/>' +
    strip(20, 60, BLUE) + strip(230, 45, BLUE));

  // three numbers on rising steps, the smallest first
  const tile = function (x, y) { return '<rect x="' + (x - 44) + '" y="' + (y - 34) + '" width="88" height="68" rx="12" fill="#FFFFFF" stroke="' + INK + '" stroke-width="4"/>'; };
  ART['w-s5-order'] = word('w-s5-order', 'Twenty per cent, zero point five and three quarters on rising steps, smallest first',
    '<path d="M24 276V230h116V176h116V122h120v154Z" fill="' + BLUE_SOFT + '" stroke="' + BLUE_D + '" stroke-width="4"/>' +
    tile(82, 190) + txt(82, 202, 30, '20%', GREEN_D) +
    tile(198, 136) + txt(198, 148, 32, '0.5') +
    tile(316, 82) + frac(316, 80, 3, 4, 26) +
    '<path d="M30 110L150 40" stroke="#C2252E" stroke-width="7"/><path d="M150 40l-26 2M150 40l-12 23" stroke="#C2252E" stroke-width="7"/>');

  // three bars: the tallest has a star
  const bar = function (x, h, fill, line) { return '<rect x="' + x + '" y="' + (214 - h) + '" width="64" height="' + h + '" rx="6" fill="' + fill + '" stroke="' + line + '" stroke-width="4"/>'; };
  ART['w-s5-greatest'] = word('w-s5-greatest', 'Three bars for zero point three, one half and eighty per cent: a star above the tallest bar',
    '<path d="M30 216h340" stroke="' + INK + '" stroke-width="5"/>' +
    bar(58, 54, BLUE_SOFT, BLUE_D) + bar(168, 90, BLUE_SOFT, BLUE_D) + bar(278, 144, GOLD, GOLD_D) +
    txt(90, 258, 30, '0.3') + frac(200, 250, 1, 2, 24) + txt(310, 258, 30, '80%', GREEN_D) +
    star(310, 36, 26));
})();
