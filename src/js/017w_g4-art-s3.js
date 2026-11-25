/* g4-art-s3.js - the Stop 3 word card pictures (viewBox 400 x 300, flat style, no words inside a picture).

   w-column-method, w-line-up, w-regroup            Set A: decimals in columns
   w-negative-number, w-integer, w-difference       Set B: below zero
   w-estimate, w-unknown, w-symbol                  Set C: check and find

   Meaning in colour, the same as the Stop 3 pictures (030g_g4-s3.css): the decimal point column is gold, numbers below
   zero are blue, a jump is orange, the triangle is orange and the circle is blue. */
(function () {
  'use strict';

  const INK = '#10305E', GOLD = '#F5A623', SOFT = '#FFF1CF', BLUE = '#2F7FD4', BLUE_D = '#1D62AE', BLUE_SOFT = '#D5E6F8';
  const ORANGE = '#F28C28', ORANGE_D = '#9A4A06', JUMP = '#C2410C', GO = '#1E7A4C', NO = '#C2252E', GRID = '#E3EBF6', GREEN = '#1E9E6A';
  const FONT = 'font-family="Arial, Helvetica, sans-serif" font-weight="700"';
  const M = '−';

  function word(id, label, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="art" data-art="' + id +
      '" role="img" aria-label="' + label + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' + body + '</svg>';
  }
  function txt(x, y, size, text, fill, anchor) {
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + size + '" text-anchor="' + (anchor || 'middle') +
      '" fill="' + (fill || INK) + '">' + text + '</text>';
  }
  const tick = function (x, y) { return '<path d="M' + (x - 14) + ' ' + y + 'l10 11 20-24" stroke="' + GO + '" stroke-width="7"/>'; };
  const cross = function (x, y) { return '<path d="M' + (x - 12) + ' ' + (y - 12) + 'l24 24M' + (x + 12) + ' ' + (y - 12) + 'l-24 24" stroke="' + NO + '" stroke-width="7"/>'; };
  // squared paper
  function paper(x, y, w, h, step) {
    let s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14" fill="#FFFFFF" stroke="#C9D6E5" stroke-width="3"/>';
    for (let gx = x + step; gx < x + w - 2; gx += step) s += '<path d="M' + gx + ' ' + (y + 4) + 'V' + (y + h - 4) + '" stroke="' + GRID + '" stroke-width="2"/>';
    for (let gy = y + step; gy < y + h - 2; gy += step) s += '<path d="M' + (x + 4) + ' ' + gy + 'H' + (x + w - 4) + '" stroke="' + GRID + '" stroke-width="2"/>';
    return s;
  }
  // one row of a written calculation: chars at x0, x0 + step ...; a point is a dot
  function row(chars, x0, y, step, fill, size) {
    return chars.split('').map(function (ch, i) {
      const x = x0 + i * step;
      if (ch === ' ') return '';
      if (ch === '.') return '<circle cx="' + x + '" cy="' + (y - 4) + '" r="5.5" fill="' + (fill || INK) + '"/>';
      return txt(x, y, size || 44, ch === '-' ? M : ch, fill);
    }).join('');
  }
  // a number line: ticks from a to b, numbers under them
  function line(a, b, x0, x1, y, opt) {
    opt = opt || {};
    const u = (x1 - x0) / (b - a);
    let s = '';
    if (a < 0) s += '<rect x="' + (x0 - 12) + '" y="' + (y - 20) + '" width="' + (-a * u + 12) + '" height="62" rx="10" fill="' + BLUE_SOFT + '"/>';
    s += '<path d="M' + (x0 - 16) + ' ' + y + 'H' + (x1 + 16) + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M' + (x0 - 8) + ' ' + (y - 8) + 'l-9 8l9 8M' + (x1 + 8) + ' ' + (y - 8) + 'l9 8l-9 8" stroke="' + INK + '" stroke-width="5"/>';
    for (let v = a; v <= b; v++) {
      const x = x0 + (v - a) * u, zero = v === 0;
      s += '<path d="M' + x + ' ' + (y - (zero ? 15 : 10)) + 'V' + (y + (zero ? 15 : 10)) + '" stroke="' + INK + '" stroke-width="' + (zero ? 6 : 4) + '"/>';
      if (!opt.only || opt.only.indexOf(v) >= 0) s += txt(x, y + 38, zero ? 24 : 20, v < 0 ? M + (-v) : String(v), v < 0 ? BLUE_D : INK);
    }
    return s;
  }
  const xOn = function (v, a, b, x0, x1) { return x0 + (v - a) * (x1 - x0) / (b - a); };
  const tri = function (x, y, r) { return '<path d="M' + x + ' ' + (y - r) + 'L' + (x + r) + ' ' + (y + r * 0.8) + 'H' + (x - r) + 'Z" fill="' + ORANGE + '" stroke="' + ORANGE_D + '" stroke-width="4"/>'; };
  const circ = function (x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + BLUE + '" stroke="#174E8C" stroke-width="4"/>'; };

  const ART = window.T_ART = window.T_ART || {};

  /* ---------- Set A: decimals in columns ---------- */
  // 3.45 + 2.31 = 5.76 on squared paper, the decimal points in a gold column
  ART['w-column-method'] = word('w-column-method', '3.45 plus 2.31 written in columns on squared paper. The answer is 5.76.',
    paper(70, 34, 260, 232, 52) + '<rect x="186" y="44" width="28" height="212" rx="10" fill="' + SOFT + '"/>' +
    row('3.45', 148, 96, 52) + row('2.31', 148, 152, 52) + txt(98, 152, 44, '+') +
    '<path d="M84 176H316" stroke="' + INK + '" stroke-width="6"/>' + row('5.76', 148, 232, 52, GO));

  // 12.4 and 3.5: the points on one dashed gold line, with arrows
  ART['w-line-up'] = word('w-line-up', '12.4 above 3.5. The two decimal points are on one line, one under the other.',
    '<path d="M226 30V270" stroke="' + GOLD + '" stroke-width="6" stroke-dasharray="4 14"/>' +
    '<rect x="60" y="62" width="280" height="76" rx="14" fill="#FFFFFF" stroke="#C9D6E5" stroke-width="3"/>' +
    '<rect x="60" y="158" width="280" height="76" rx="14" fill="#FFFFFF" stroke="#C9D6E5" stroke-width="3"/>' +
    row('12.4', 106, 118, 60, INK, 52) + row(' 3.5', 106, 214, 60, INK, 52) +
    '<circle cx="226" cy="114" r="15" stroke="' + GOLD + '" stroke-width="5"/><circle cx="226" cy="210" r="15" stroke="' + GOLD + '" stroke-width="5"/>');

  // ten tenths become one whole
  ART['w-s3-regroup'] = word('w-s3-regroup', 'Ten small counters of one tenth each change into one block of 1.',
    (function () {
      let s = '<rect x="24" y="76" width="170" height="148" rx="18" fill="#F7FBFF" stroke="#DCE8F3" stroke-width="3"/>';
      for (let i = 0; i < 10; i++) s += '<circle cx="' + (50 + (i % 5) * 30) + '" cy="' + (124 + Math.floor(i / 5) * 52) + '" r="12" fill="' + GOLD + '" stroke="#A86A00" stroke-width="3"/>';
      s += '<path d="M210 150H262M244 132l20 18l-20 18" stroke="' + INK + '" stroke-width="7"/>';
      s += '<rect x="284" y="102" width="96" height="96" rx="14" fill="' + GREEN + '" stroke="#0E5C3C" stroke-width="4"/>' + txt(332, 168, 56, '1', '#FFFFFF');
      return s + txt(109, 262, 26, '10 × 0.1') ;
    })());

  /* ---------- Set B: below zero ---------- */
  ART['w-negative-number'] = word('w-negative-number', 'A number line from negative 4 to 4. The numbers below zero are in a blue box. Negative 3 has a ring.',
    line(-4, 4, 50, 350, 150) + '<circle cx="' + xOn(-3, -4, 4, 50, 350) + '" cy="181" r="24" stroke="' + JUMP + '" stroke-width="5"/>' +
    '<path d="M' + xOn(-3, -4, 4, 50, 350) + ' 76v40M' + (xOn(-3, -4, 4, 50, 350) - 12) + ' 104l12 14l12-14" stroke="' + JUMP + '" stroke-width="6"/>');

  // whole numbers with ticks, a decimal with a cross
  const tile = function (x, v, fill, line, col) { return '<rect x="' + (x - 40) + '" y="84" width="80" height="80" rx="14" fill="' + fill + '" stroke="' + line + '" stroke-width="4"/>' + txt(x, 138, 36, v, col); };
  ART['w-integer'] = word('w-integer', 'Number tiles: negative 3, 0 and 4 have a green tick. 2.5 has a red cross.',
    tile(62, M + '3', BLUE_SOFT, BLUE_D, BLUE_D) + tile(154, '0', '#FFFFFF', INK) + tile(246, '4', '#FFFFFF', INK) + tile(338, '2.5', '#FBE4E6', NO) +
    tick(62, 212) + tick(154, 212) + tick(246, 212) + cross(338, 216));

  // how far apart: from -2 to 4 is 6
  ART['w-difference'] = word('w-difference', 'A number line. A jump goes from negative 2 to 4. The jump is 6.',
    line(-3, 5, 50, 350, 190, { only: [-2, 0, 4] }) +
    '<path d="M' + xOn(-2, -3, 5, 50, 350) + ' 166Q' + xOn(1, -3, 5, 50, 350) + ' 40 ' + xOn(4, -3, 5, 50, 350) + ' 166" stroke="' + JUMP + '" stroke-width="6"/>' +
    '<path d="M' + (xOn(4, -3, 5, 50, 350) - 20) + ' 150l20 16l2-24" stroke="' + JUMP + '" stroke-width="6"/>' +
    '<circle cx="' + xOn(-2, -3, 5, 50, 350) + '" cy="190" r="10" fill="#FFFFFF" stroke="' + JUMP + '" stroke-width="5"/>' +
    '<circle cx="' + xOn(4, -3, 5, 50, 350) + '" cy="190" r="10" fill="' + JUMP + '" stroke="#7C2D12" stroke-width="3"/>' +
    '<circle cx="' + xOn(1, -3, 5, 50, 350) + '" cy="74" r="30" fill="' + SOFT + '" stroke="' + GOLD + '" stroke-width="5"/>' + txt(xOn(1, -3, 5, 50, 350), 88, 40, '6'));

  /* ---------- Set C: check and find ---------- */
  // 4.8 + 3.1 is about 5 + 3
  ART['w-estimate'] = word('w-estimate', '4.8 plus 3.1. Arrows go down to the round numbers 5 and 3. 5 plus 3 equals 8.',
    txt(118, 78, 50, '4.8') + txt(200, 78, 50, '+') + txt(282, 78, 50, '3.1') +
    '<path d="M118 96v44M106 126l12 16l12-16M282 96v44M270 126l12 16l12-16" stroke="' + JUMP + '" stroke-width="6"/>' +
    '<circle cx="118" cy="188" r="38" fill="' + SOFT + '" stroke="' + GOLD + '" stroke-width="5"/>' + txt(118, 206, 50, '5') + txt(200, 206, 50, '+') +
    '<circle cx="282" cy="188" r="38" fill="' + SOFT + '" stroke="' + GOLD + '" stroke-width="5"/>' + txt(282, 206, 50, '3') +
    txt(200, 278, 34, '≈ 8', '#5C6472'));

  // a covered number: box + 4 = 9
  ART['w-unknown'] = word('w-unknown', 'A calculation: a gold box with a question mark, plus 4, equals 9.',
    '<rect x="42" y="96" width="104" height="104" rx="18" fill="' + SOFT + '" stroke="' + GOLD + '" stroke-width="6" stroke-dasharray="14 10"/>' + txt(94, 172, 68, '?', '#7B4E00') +
    txt(186, 170, 60, '+') + txt(244, 170, 60, '4') + txt(300, 170, 60, '=') + txt(354, 170, 60, '9'));

  // shapes that stand for numbers
  ART['w-symbol'] = word('w-symbol', 'A triangle plus a circle equals 12. Under them, the triangle stands for 8 and the circle stands for 4.',
    tri(84, 92, 44) + txt(160, 112, 56, '+') + circ(228, 96, 40) + txt(288, 110, 50, '=') + txt(346, 110, 50, '12') +
    '<path d="M84 150v36M228 150v36" stroke="#8796AC" stroke-width="5" stroke-dasharray="2 11"/>' +
    '<rect x="44" y="198" width="80" height="62" rx="14" fill="#FFFFFF" stroke="' + ORANGE_D + '" stroke-width="4"/>' + txt(84, 244, 40, '8') +
    '<rect x="188" y="198" width="80" height="62" rx="14" fill="#FFFFFF" stroke="#174E8C" stroke-width="4"/>' + txt(228, 244, 40, '4'));
})();
