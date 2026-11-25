/* g4-art-s9.js - the Stop 9 word card pictures (Mode and median), in the flat style of 10-art-words-6.js (viewBox 400 x 300).

   w-s9-data, w-s9-value, w-s9-tally              Set A: collect data
   w-s9-frequency, w-s9-mode, w-s9-average        Set B: the mode
   w-s9-order, w-s9-middle, w-s9-median           Set C: the median

   Meaning in colour, the same as the Stop 9 pictures (047g_g4-pics-s9.js): data cards are white, the card or bar we talk
   about is gold, bars and dots are blue, a crossed-off card has a coral line. No word is written in a picture (the Words
   quiz asks for the word); numbers are fine. */
(function () {
  'use strict';

  const INK = '#10305E', INK2 = '#3D5A85', LINE = '#B8C8DB', GOLD = '#F5A623', GOLD_E = '#C17B08', SOFT = '#FFF1CF';
  const BLUE = '#2F7FD4', BLUE_E = '#1D62AE', NO = '#D0503F', GO = '#1E9E6A', RED = '#E5404A', RED_D = '#A31A22';
  const FONT = 'font-family="Arial, Helvetica, sans-serif" font-weight="700"';

  function word(id, label, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="art" data-art="' + id +
      '" role="img" aria-label="' + label + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' + body + '</svg>';
  }
  function txt(x, y, size, text, fill, anchor) {
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + size + '" text-anchor="' + (anchor || 'middle') + '" fill="' + (fill || INK) + '">' + text + '</text>';
  }
  // a data card centred at x, y; on = gold (the one we talk about); off = crossed off
  function card(x, y, v, on, off, w, h) {
    w = w || 58; h = h || 68;
    return '<g' + (off ? ' opacity=".55"' : '') + '><rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="10" fill="' + (on ? SOFT : '#FFFFFF') +
      '" stroke="' + (on ? GOLD_E : LINE) + '" stroke-width="' + (on ? 5 : 3.5) + '"/>' + txt(x, y + 12, 34, v) + '</g>' +
      (off ? '<path d="M' + (x - w / 2 + 8) + ' ' + (y + h / 2 - 8) + 'L' + (x + w / 2 - 8) + ' ' + (y - h / 2 + 8) + '" stroke="' + NO + '" stroke-width="5"/>' : '');
  }
  function row(vals, y, on, off, gap, x0) {
    gap = gap || 70; x0 = x0 == null ? 200 - (vals.length - 1) * gap / 2 : x0;
    return vals.map(function (v, i) { return card(x0 + i * gap, y, v, (on || []).indexOf(i) >= 0, (off || []).indexOf(i) >= 0); }).join('');
  }
  // tally marks: n marks in groups of five, starting at x, baseline y
  function tally(x, y, n, h, col) {
    let s = ''; h = h || 44;
    for (let g = 0; g * 5 < n; g++) {
      const k = Math.min(5, n - g * 5), x0 = x + g * 62;
      for (let i = 0; i < Math.min(4, k); i++) s += '<path d="M' + (x0 + i * 12) + ' ' + (y - h) + 'V' + y + '"/>';
      if (k === 5) s += '<path d="M' + (x0 - 8) + ' ' + (y - 6) + 'L' + (x0 + 44) + ' ' + (y - h + 6) + '"/>';
    }
    return '<g stroke="' + (col || INK) + '" stroke-width="5">' + s + '</g>';
  }
  const arrow = function (x1, y1, x2, y2, col) {
    const a = Math.atan2(y2 - y1, x2 - x1), p = function (d) { return (x2 - 14 * Math.cos(a + d)).toFixed(1) + ' ' + (y2 - 14 * Math.sin(a + d)).toFixed(1); };
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + 'M' + p(0.5) + 'L' + x2 + ' ' + y2 + 'L' + p(-0.5) + '" stroke="' + (col || INK) + '" stroke-width="5"/>';
  };
  const fruit = function (x, y, col, edge) { return '<circle cx="' + x + '" cy="' + y + '" r="15" fill="' + col + '" stroke="' + edge + '" stroke-width="3.5"/><path d="M' + x + ' ' + (y - 15) + 'q4 -10 12 -10" stroke="' + GO + '" stroke-width="4"/>'; };

  const ART = window.T_ART = window.T_ART || {};

  /* ---------- Set A: collect data ---------- */
  // a clipboard: three kinds of fruit, each with its tally marks
  // numbers, not tally marks, beside the fruit: the Words quiz of set A also offers "tally"
  ART['w-s9-data'] = word('w-s9-data', 'A clipboard with a list: three kinds of fruit, each with a number beside it: 7, 4 and 9.',
    '<rect x="92" y="40" width="216" height="236" rx="16" fill="#FFFFFF" stroke="' + INK2 + '" stroke-width="5"/>' +
    '<rect x="158" y="24" width="84" height="34" rx="10" fill="' + GOLD + '" stroke="' + GOLD_E + '" stroke-width="4"/>' +
    fruit(130, 108, RED, RED_D) + txt(230, 124, 44, '7') +
    '<path d="M108 148H292" stroke="' + LINE + '" stroke-width="3"/>' +
    fruit(130, 180, GOLD, GOLD_E) + txt(230, 196, 44, '4') +
    '<path d="M108 220H292" stroke="' + LINE + '" stroke-width="3"/>' +
    fruit(130, 250, '#8BC34A', '#4E7D1E') + txt(230, 266, 44, '9'));

  // one card lifted out of a row of data cards
  ART['w-s9-value'] = word('w-s9-value', 'A row of data cards: 3, 8, 5, 2. The card 8 is lifted up and lit.',
    card(95, 190, 3) + card(165, 120, 8, true) + card(235, 190, 5) + card(305, 190, 2) +
    '<rect x="136" y="156" width="58" height="68" rx="10" stroke="' + LINE + '" stroke-width="3.5" stroke-dasharray="8 7"/>' +
    arrow(165, 62, 165, 78, GOLD_E) + '<path d="M165 40V62" stroke="' + GOLD_E + '" stroke-width="5"/>');

  // tally marks for 7, and the number 7
  ART['w-s9-tally'] = word('w-s9-tally', 'Tally marks: one group of five with a line across, and two more. They make 7.',
    '<g stroke="' + INK + '" stroke-width="9">' +
    '<path d="M70 86V196M100 86V196M130 86V196M160 86V196M48 182L182 100"/><path d="M222 86V196M252 86V196"/></g>' +
    txt(330, 172, 84, '7', GOLD_E) + '<path d="M56 232H266" stroke="' + LINE + '" stroke-width="5"/>');

  /* ---------- Set B: the mode ---------- */
  // how many times: the three 5s are ringed, an arrow to "3"
  ART['w-s9-frequency'] = word('w-s9-frequency', 'Data cards 5, 2, 5, 5. The three cards with 5 are lit. An arrow points to the number 3: 5 comes 3 times.',
    row([5, 2, 5, 5], 100, [0, 2, 3], [], 80) +
    '<path d="M80 150v16h240v-16M200 166v20" stroke="' + INK2 + '" stroke-width="5"/>' + arrow(200, 186, 200, 206, INK2) +
    '<circle cx="200" cy="246" r="36" fill="' + GOLD + '" stroke="' + GOLD_E + '" stroke-width="5"/>' + txt(200, 262, 46, '3', '#3A2600'));

  // a bar chart: the tallest bar is gold, with a star
  ART['w-s9-mode'] = word('w-s9-mode', 'A bar chart with four bars. The tallest bar is gold and has a star on top.',
    '<path d="M70 40V250H350" stroke="' + INK + '" stroke-width="5"/>' +
    '<rect x="92" y="170" width="46" height="80" fill="' + BLUE + '" stroke="' + BLUE_E + '" stroke-width="4"/>' +
    '<rect x="156" y="90" width="46" height="160" fill="' + GOLD + '" stroke="' + GOLD_E + '" stroke-width="5"/>' +
    '<rect x="220" y="140" width="46" height="110" fill="' + BLUE + '" stroke="' + BLUE_E + '" stroke-width="4"/>' +
    '<rect x="284" y="200" width="46" height="50" fill="' + BLUE + '" stroke="' + BLUE_E + '" stroke-width="4"/>' +
    '<path d="M179 26l8 17 19 2-14 13 4 19-17-10-17 10 4-19-14-13 19-2z" fill="' + GOLD + '" stroke="' + GOLD_E + '" stroke-width="4"/>');

  // many values, one value that stands for them all
  // every value is different, so the one value that sums them up cannot be read as the mode (the quiz offers mode too)
  ART['w-s9-average'] = word('w-s9-average', 'Five small data cards: 2, 4, 6, 7, 9. A bracket gathers them and an arrow points to one big gold card with 6.',
    [2, 4, 6, 7, 9].map(function (v, i) { return card(72 + i * 64, 64, v, false, false, 52, 60); }).join('') +
    '<path d="M46 108v18h308v-18M200 126v22" stroke="' + INK2 + '" stroke-width="5"/>' + arrow(200, 148, 200, 170, INK2) +
    '<rect x="150" y="182" width="100" height="100" rx="16" fill="' + SOFT + '" stroke="' + GOLD_E + '" stroke-width="6"/>' + txt(200, 254, 64, '6'));

  /* ---------- Set C: the median ---------- */
  // mixed-up cards, then the same cards on steps from smallest to biggest
  ART['w-s9-order'] = word('w-s9-order', 'Cards 7, 2, 5 are mixed up. An arrow points down to the same cards in order on steps: 2, 5, 7.',
    card(110, 60, 7, false, false, 52, 60) + card(200, 60, 2, false, false, 52, 60) + card(290, 60, 5, false, false, 52, 60) +
    arrow(200, 102, 200, 132, INK2) +
    '<path d="M70 280V240H160V210H250V180H340V280Z" fill="#E4F0FC" stroke="' + BLUE_E + '" stroke-width="4"/>' +
    card(115, 204, 2, false, false, 52, 60) + card(205, 174, 5, false, false, 52, 60) + card(295, 144, 7, false, false, 52, 60));

  // five counters in a line: the one in the middle is gold, two on each side
  ART['w-s9-middle'] = word('w-s9-middle', 'Five counters in a line. The counter in the middle is gold. There are two counters on each side of it.',
    [0, 1, 2, 3, 4].map(function (i) {
      const on = i === 2;
      return '<circle cx="' + (64 + i * 68) + '" cy="150" r="' + (on ? 30 : 24) + '" fill="' + (on ? GOLD : BLUE) + '" stroke="' + (on ? GOLD_E : BLUE_E) + '" stroke-width="5"/>';
    }).join('') +
    '<path d="M40 204v14h116v-14M244 204v14h116v-14" stroke="' + INK2 + '" stroke-width="5"/>' + txt(98, 262, 38, '2', INK2) + txt(302, 262, 38, '2', INK2) +
    arrow(200, 56, 200, 104, GOLD_E));

  // cards in order, pairs crossed off from both ends, the middle card lit
  ART['w-s9-median'] = word('w-s9-median', 'Data cards in order: 1, 3, 6, 8, 9. The cards 1, 3, 8 and 9 are crossed off. The middle card, 6, is lit.',
    row([1, 3, 6, 8, 9], 160, [2], [0, 1, 3, 4], 72) +
    '<path d="M56 96V76H344V96" stroke="' + NO + '" stroke-width="4" stroke-dasharray="2 10"/>' +
    '<path d="M128 106V92H272V106" stroke="' + NO + '" stroke-width="4" stroke-dasharray="2 10"/>' +
    arrow(200, 252, 200, 210, GOLD_E));
})();
