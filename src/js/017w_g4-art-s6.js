/* g4-art-s6.js - the nine word card pictures of Stop 6, Sequences and special numbers (viewBox 400 x 300, flat style,
   as src/js/016_10-art-words-6.js). No word is written in a picture: only numbers and signs.

   w-s6-sequence, w-s6-rule, w-s6-term                       Set A: sequences
   w-s6-negative, w-s6-square, w-s6-triangular               Set B: below zero and dot patterns
   w-s6-factor, w-s6-prime, w-s6-composite                   Set C: factors

   Meaning in colour, the same as the Stop 6 pictures (030g_g4-s6.css): a jump is orange, dots of a pattern are blue
   (the newest row gold), arrays of a factor pair are red, the lonely row 1 × n is grey, below zero is cold blue. */
(function () {
  'use strict';
  const ART = window.T_ART = window.T_ART || {};
  const INK = '#2A2F3A', GOLD = '#F5A623', GOLD_D = '#A86A00', SOFT = '#FFF1CF', RED = '#E5404A', RED_D = '#A31A22';
  const BLUE = '#2F7FD4', BLUE_D = '#1D62AE', COLD = '#DCEBFB', JUMP = '#C76A0E', GREY = '#8FA3BC', GREY_D = '#5B6F8A', GO = '#1E7A4C';
  const FONT = 'font-family="Arial, Helvetica, sans-serif" font-weight="700"';
  const o = 'stroke="' + INK + '" stroke-width="3"';
  const M = '−';

  function word(id, label, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="art" data-art="' + id +
      '" role="img" aria-label="' + label + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' + body + '</svg>';
  }
  function txt(x, y, size, text, fill, anchor) {
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + size + '" text-anchor="' + (anchor || 'middle') + '" fill="' + (fill || INK) + '">' + text + '</text>';
  }
  function dot(x, y, r, fill, edge) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" stroke="' + edge + '" stroke-width="3"/>'; }
  function grid(rows, cols, x, y, gap, r, fill, edge) {      // rows of dots, centred at x, y
    let s = '';
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) s += dot(x - (cols - 1) * gap / 2 + j * gap, y - (rows - 1) * gap / 2 + i * gap, r, fill, edge);
    return s;
  }
  function tile(x, y, w, h, t, fill, size, ink) {
    return '<rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="12" fill="' + (fill || '#FFFFFF') + '" ' + o + '/>' + txt(x, y + (size || 30) * 0.36, size || 30, t, ink);
  }
  function arc(x1, x2, y, up, col) {
    return '<path d="M' + x1 + ' ' + y + ' Q' + (x1 + x2) / 2 + ' ' + (y - up) + ' ' + x2 + ' ' + y + '" stroke="' + (col || JUMP) + '" stroke-width="5"/>' +
      '<path d="M' + (x2 - 13) + ' ' + (y - 5) + ' L' + x2 + ' ' + y + ' L' + (x2 - 3) + ' ' + (y - 14) + '" stroke="' + (col || JUMP) + '" stroke-width="5"/>';
  }
  const bg = function (fill) { return '<rect x="14" y="14" width="372" height="272" rx="24" fill="' + fill + '"/>'; };
  const XS = [62, 154, 246, 338];

  /* ---------- Set A ---------- */
  (function () {
    let s = bg('#FFF6E5');
    [4, 9, 14, 19].forEach(function (v, i) { s += tile(XS[i], 170, 72, 64, v, '#FFFFFF', 32); if (i < 3) s += arc(XS[i] + 10, XS[i + 1] - 10, 128, 44); });
    s += dot(170, 244, 6, INK, INK) + dot(200, 244, 6, INK, INK) + dot(230, 244, 6, INK, INK);
    ART['w-s6-sequence'] = word('w-s6-sequence', 'Four numbers in a row: 4, 9, 14, 19. An arrow jumps from each number to the next. Three dots show that it goes on.', s);
  })();
  (function () {
    let s = bg('#EAF5EE');
    s += tile(92, 196, 92, 76, 9, '#FFFFFF', 38) + tile(308, 196, 92, 76, 14, '#FFFFFF', 38);
    s += '<path d="M100 150 Q200 28 300 150" stroke="' + JUMP + '" stroke-width="8"/><path d="M276 140 L300 150 L296 124" stroke="' + JUMP + '" stroke-width="8"/>';
    s += '<rect x="146" y="52" width="108" height="62" rx="31" fill="' + GOLD + '" stroke="' + GOLD_D + '" stroke-width="4"/>' + txt(200, 96, 38, '+ 5');
    ART['w-s6-rule'] = word('w-s6-rule', 'A big jump from 9 to 14. A gold label on the jump says plus 5.', s);
  })();
  (function () {
    let s = bg('#EEF3FB');
    [4, 9, 14, 19].forEach(function (v, i) {
      // one term stands out: the other numbers are pale, so the card does not look like the 'sequence' card
      s += '<g opacity="' + (i === 2 ? 1 : 0.4) + '">' + tile(XS[i], 132, 72, 64, v, i === 2 ? GOLD : '#FFFFFF', 32);
      s += '<circle cx="' + XS[i] + '" cy="222" r="19" fill="' + (i === 2 ? INK : '#FFFFFF') + '" ' + o + '/>' + txt(XS[i], 230, 22, i + 1, i === 2 ? '#FFFFFF' : INK) + '</g>';
    });
    s += '<path d="M246 196 V172" stroke="' + INK + '" stroke-width="5"/><path d="M236 182 L246 170 L256 182" stroke="' + INK + '" stroke-width="5"/>';
    s += '<rect x="204" y="88" width="84" height="88" rx="18" stroke="' + GOLD_D + '" stroke-width="5" stroke-dasharray="10 8"/>';
    ART['w-s6-term'] = word('w-s6-term', 'The numbers 4, 9, 14, 19 with their places 1, 2, 3, 4 under them. Only the number in place 3, 14, stands out in gold.', s);
  })();

  /* ---------- Set B ---------- */
  (function () {
    const X = function (v) { return 200 + v * 44; };
    let s = bg('#FFF6E5') + '<path d="M38 14H200V286H38a24 24 0 0 1-24-24V38a24 24 0 0 1 24-24z" fill="' + COLD + '"/>';
    s += '<path d="M30 168H370" stroke="' + INK + '" stroke-width="5"/>';
    for (let v = -3; v <= 3; v++) {
      s += '<path d="M' + X(v) + ' ' + (v === 0 ? 146 : 154) + 'V' + (v === 0 ? 190 : 182) + '" stroke="' + INK + '" stroke-width="' + (v === 0 ? 6 : 4) + '"/>' +
        txt(X(v), 224, v < 0 ? 26 : 24, v < 0 ? M + (-v) : v, v < 0 ? BLUE_D : INK);
    }
    s += arc(X(1), X(-1), 142, 56, BLUE_D) + arc(X(-1), X(-3), 142, 56, BLUE_D);
    s += dot(X(-3), 168, 13, BLUE, BLUE_D);
    s += '<path d="M200 40V118" stroke="' + INK + '" stroke-width="3" stroke-dasharray="7 7"/>';
    ART['w-s6-negative'] = word('w-s6-negative', 'A number line from ' + M + '3 to 3. The side below 0 is cold blue. Jumps go back from 1 to ' + M + '1 and ' + M + '3.', s);
  })();
  (function () {
    let s = bg('#EEF3FB') + '<rect x="56" y="40" width="188" height="188" rx="16" fill="#FFFFFF" stroke="' + BLUE_D + '" stroke-width="3" stroke-dasharray="9 7"/>';
    s += grid(4, 4, 150, 134, 42, 15, BLUE, BLUE_D);
    s += txt(150, 268, 26, '4 × 4') + '<circle cx="320" cy="140" r="46" fill="' + GOLD + '" stroke="' + GOLD_D + '" stroke-width="4"/>' + txt(320, 154, 40, '16');
    ART['w-s6-square'] = word('w-s6-square', 'Sixteen dots in a square: 4 rows of 4. 4 times 4 is 16.', s);
  })();
  (function () {
    let s = bg('#EAF5EE');
    function tri(k, x, y, gap, r) {
      let t = '';
      for (let i = 0; i < k; i++) for (let j = 0; j <= i; j++) t += dot(x - i * gap / 2 + j * gap, y - (k - 1 - i) * gap * 0.9, r, i === k - 1 ? GOLD : BLUE, i === k - 1 ? GOLD_D : BLUE_D);
      return t;
    }
    s += tri(1, 52, 196, 30, 12) + tri(2, 116, 196, 30, 12) + tri(3, 204, 196, 30, 12) + tri(4, 318, 196, 30, 12);
    [[52, 1], [116, 3], [204, 6], [318, 10]].forEach(function (p) { s += txt(p[0], 254, 28, p[1]); });
    ART['w-s6-triangular'] = word('w-s6-triangular', 'Four triangles of dots that grow: 1 dot, 3 dots, 6 dots, 10 dots. Each new bottom row is gold.', s);
  })();

  /* ---------- Set C ---------- */
  (function () {
    let s = bg('#FFF6E5') + grid(3, 4, 186, 138, 48, 17, RED, RED_D);
    s += '<path d="M92 76 q-16 0 -16 16 v92 q0 16 16 16" stroke="' + INK + '" stroke-width="4"/>' + '<circle cx="50" cy="138" r="26" fill="' + GOLD + '" stroke="' + GOLD_D + '" stroke-width="4"/>' + txt(50, 149, 30, '3');
    s += '<path d="M106 62 q0 -16 16 -16 h128 q16 0 16 16" stroke="' + INK + '" stroke-width="4"/>';
    s += '<circle cx="330" cy="66" r="26" fill="' + GOLD + '" stroke="' + GOLD_D + '" stroke-width="4"/>' + txt(330, 77, 30, '4') + '<path d="M270 52 H298" stroke="' + INK + '" stroke-width="4"/>';
    s += txt(200, 262, 30, '3 × 4 = 12');
    ART['w-s6-factor'] = word('w-s6-factor', 'Twelve dots in 3 rows of 4. The numbers 3 and 4 are gold: 3 times 4 is 12.', s);
  })();
  (function () {
    let s = bg('#EEF3FB');
    s += '<circle cx="200" cy="74" r="44" fill="' + GOLD + '" stroke="' + GOLD_D + '" stroke-width="4"/>' + txt(200, 90, 46, '7');
    s += grid(1, 7, 200, 172, 46, 16, BLUE, BLUE_D);
    s += txt(200, 250, 30, '1 × 7');
    ART['w-s6-prime'] = word('w-s6-prime', 'The number 7. Seven dots can only make one row: 1 times 7.', s);
  })();
  (function () {
    let s = bg('#EAF5EE');
    s += '<circle cx="200" cy="58" r="38" fill="' + GOLD + '" stroke="' + GOLD_D + '" stroke-width="4"/>' + txt(200, 72, 38, '12');
    s += grid(2, 6, 112, 164, 30, 11, RED, RED_D) + grid(3, 4, 300, 164, 30, 11, RED, RED_D);
    s += txt(112, 252, 28, '2 × 6') + txt(300, 252, 28, '3 × 4');
    ART['w-s6-composite'] = word('w-s6-composite', 'The number 12. Twelve dots make 2 rows of 6, and also 3 rows of 4.', s);
  })();
})();
