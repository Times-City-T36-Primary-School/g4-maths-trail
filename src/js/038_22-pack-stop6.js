/* 22-pack-stop6.js - ALL the content of Stop 6, Sequences and special numbers (Grade 4, Stage 5).
   Parts: words, see, practise, notes, test, lightning, selfcheck.
   Models: src/js/009d_g4-models-s6.js (s6nth, s6first, s6two, s6tri, s6why, s6pair and claims with s6: every answer is worked out
   in code from the numbers here) and the older seqnext, sqnth, jump, ring. Pictures: src/js/047g_g4-pics-s6.js
   (s6tri, s6arr, s6strip, s6trisq) and dotseq, frain, hops, nline. Word pictures: src/js/017w_g4-art-s6.js.
   The ring keys and the lightning answers are worked out below from the rule, never typed by hand. */
(function (T) {
  'use strict';
  const MX = window.MX, S6 = MX.s6;

  /* ring: the right numbers come from the rule; a wrong ring gets its own reason */
  const sqWhy = v => { const lo = Math.floor(Math.sqrt(v)); return lo + ' × ' + lo + ' = ' + lo * lo + ' and ' + (lo + 1) + ' × ' + (lo + 1) + ' = ' + (lo + 1) * (lo + 1) + ', so ' + v + ' is between two square numbers'; };
  const prWhy = v => { const p = S6.pairs(v)[1]; return v + ' = ' + p[0] + ' × ' + p[1] + ', so it has more than two factors'; };
  function RING(rule, nums) {
    const f = MX.ruleFn(rule), good = nums.filter(f), why = {};
    nums.filter(v => !f(v)).forEach(v => { why[v] = rule === 'square' ? sqWhy(v) : prWhy(v); });
    const sq = rule === 'square';
    return { type: 'ring', rule: rule, nums: nums, good: good, why: why,
      q: sq ? 'Put a ring around <b>all</b> the [[square numbers|square number]].' : 'Here are five numbers in a row. Put a ring around <b>all</b> the [[prime numbers|prime number]].',
      tip: sq ? 'You get a square number when you multiply a number by itself. Say them: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.' : 'A prime number has exactly two factors. Try to divide each number by 2, 3, 5 and 7.',
      pic: sq ? { k: 'dotseq', ks: [1, 2, 3, 4] } : null,
      yes: (sq ? 'The square numbers are ' : good.length === 1 ? 'The only prime number is ' : 'The prime numbers are ') + good.join(', ').replace(/, (\d+)$/, ' and $1') + '.',
      worked: sq ? good.map(v => Math.sqrt(v) + ' × ' + Math.sqrt(v) + ' = ' + v).join(', ') + '. No number multiplied by itself makes the other numbers.'
        : nums.map(v => (f(v) ? v + ' is prime' : prWhy(v).split(',')[0])).join('. ') + '.' };
  }
  const two = (wa, a, da, wb, b, db) => ({ type: 's6two', A: { who: wa, a: a, d: -da }, B: { who: wb, a: b, d: db } });

  /* lightning: quick questions, the right answer first, each one worked out here */
  const sg = MX.sg;
  const L = [];
  [[9, 4], [7, 3], [10, 4], [8, 5], [11, 6], [5, 2], [13, 7], [6, 4]].forEach(p => { const a = p[0], d = p[1], x = a - 3 * d; L.push([[a, a - d, a - 2 * d].map(sg).join(', ') + ', ?', [sg(x), String(-x), sg(x - 1)]]); });
  [[3, 5, 10], [2, 4, 10], [5, 3, 10], [1, 6, 10], [4, 10, 10], [7, 2, 10], [6, 5, 20], [3, 2, 20], [10, 3, 20], [5, 4, 20]].forEach(p => {
    const a = p[0], d = p[1], n = p[2]; L.push([a + ', ' + (a + d) + ', ' + (a + 2 * d) + ', ... The ' + n + 'th term?', [String(a + (n - 1) * d), String(a + n * d), String(n * d)]]); });
  [4, 5, 6, 7, 8, 9, 10].forEach(k => L.push([k + ' × ' + k + ' = ?', [String(k * k), String(2 * k), String(k * (k + 1))]]));
  [[48, 49, 50], [34, 35, 36], [63, 64, 65], [80, 81, 82], [24, 25, 26], [14, 15, 16]].forEach(t => { const r = t.filter(S6.isSq); L.push(['Which is a square number: ' + t.join(', ').replace(/, (\d+)$/, ' or $1') + '?', r.concat(t.filter(v => !S6.isSq(v))).map(String)]); });
  [3, 4, 5, 6, 7, 8].forEach(k => L.push(['The ' + S6.ord(k) + ' triangular number?', [String(S6.tri(k)), String(k * k), String(S6.tri(k - 1))]]));
  [3, 4, 5].forEach(k => L.push([[S6.tri(k - 1), S6.tri(k), S6.tri(k + 1)].join(', ') + ', ? (triangular numbers)', [String(S6.tri(k + 2)), String(S6.tri(k + 2) - 1), String(S6.tri(k + 2) + 1)]]));
  [[21, 23, 25], [27, 29, 33], [35, 37, 39], [15, 17, 21], [45, 47, 49], [9, 11, 15], [51, 53, 55], [39, 41, 45]].forEach(t => { const r = t.filter(S6.isPrime); L.push(['Which is a prime number: ' + t.join(', ').replace(/, (\d+)$/, ' or $1') + '?', r.concat(t.filter(v => !S6.isPrime(v))).map(String)]); });
  [17, 21, 31, 39, 43, 51, 57, 61].forEach(n => L.push(['Prime or composite: ' + n + '?', S6.isPrime(n) ? ['prime', 'composite', 'neither'] : ['composite', 'prime', 'neither']]));
  [[7, 1, 7], [9, 2, 9], [13, 1, 13], [4, 2, 4], [25, 2, 5]].forEach(p => L.push(['How many factors does ' + p[0] + ' have?', [String(S6.factors(p[0]).length), String(p[1]), String(p[2])]]));
  [[10, 4], [7, 3], [11, 5], [9, 2], [13, 6]].forEach(p => { let v = p[0]; while (v >= 0) v -= p[1]; L.push(['Count back in ' + p[1] + 's from ' + p[0] + '. The first negative number?', [sg(v), sg(-p[1]), String(-v)]]); });

  T.packs[6] = {
    n: 6,
    title: "Sequences and special numbers",
    los: ["5Nc.01", "5Nc.03", "5Nc.04", "5Ni.08", "5Ni.06"],
    blurb: {
      en: "Continue *sequences*. Spot *square*, *triangular* and *prime* numbers.",
      vi: "Viết tiếp *dãy số*. Nhận ra số *chính phương*, số *tam giác* và số *nguyên tố*."
    },
    words: {
      sets: [
        { id: 'A', title: { en: 'Sequences', vi: 'Dãy số' }, keys: ['sequence', 'rule', 'term'] },
        { id: 'B', title: { en: 'Below zero and dot patterns', vi: 'Dưới số 0 và mẫu hình chấm' }, keys: ['negative number', 'square number', 'triangular number'] },
        { id: 'C', title: { en: 'Factors', vi: 'Ước số' }, keys: ['factor', 'prime number', 'composite number'] }
      ],
      items: {
        'sequence': { art: 'w-s6-sequence', vi: 'dãy số', def: 'A list of numbers that follows a rule. 4, 9, 14, 19 is a sequence.' },
        'rule': { art: 'w-s6-rule', vi: 'quy luật', def: 'What you do to get the next number. In 4, 9, 14, 19 the rule is add 5.' },
        'term': { art: 'w-s6-term', vi: 'số hạng (của dãy số)', def: 'One number in a sequence. In 4, 9, 14, 19 the 3rd term is 14.' },
        'negative number': { art: 'w-s6-negative', vi: 'số âm', def: 'A number less than zero. We write it with a minus sign: −3.' },
        'square number': { art: 'w-s6-square', vi: 'số chính phương', def: 'The answer when you multiply a number by itself. 4 × 4 = 16, so 16 is a square number.' },
        'triangular number': { art: 'w-s6-triangular', vi: 'số tam giác', def: 'A number whose dots make a triangle: 1, 3, 6, 10. You add 2, then 3, then 4.' },
        'factor': { art: 'w-s6-factor', vi: 'ước số', def: 'A number that divides another number exactly. 3 is a factor of 12, because 3 × 4 = 12.' },
        'prime number': { art: 'w-s6-prime', vi: 'số nguyên tố', def: 'A number with exactly two factors: 1 and itself. 7 is prime. 1 is not prime.' },
        'composite number': { art: 'w-s6-composite', vi: 'hợp số', def: 'A number with more than two factors. 12 = 3 × 4, so 12 is composite. 1 is not composite.' }
      }
    },
    // See it: one challenge scene, every question led by a picture (dot patterns, the number track, arrays, the strip).
    see: {
      scenes: [
        { id: 'challenge', title: { en: 'Look and answer', vi: 'Nhìn và trả lời' },
          challenge: {
            end: { en: 'You did it! You can see how patterns grow.', vi: 'Em làm được rồi! Em thấy được các mẫu hình lớn dần như thế nào.' },
            result: 'You read dot patterns, jumped past zero and found a far term.',
            rounds: [
              { mode: "our", lo: ["5Nc.04"], twm: ["TWM.02"], v: [
                { type: "s6tri", asks: [4], shown: [1, 2, 3] },
                { type: "s6tri", asks: [5], shown: [1, 2, 3, 4] },
                { type: "s6tri", asks: [6], shown: [3, 4, 5] }] },
              { mode: "our", lo: ["5Nc.01"], twm: ["TWM.02"], v: [
                { type: "jump", start: 7, step: 3, n: 4, dir: "back", min: -8, max: 10 },
                { type: "jump", start: 9, step: 4, n: 4, dir: "back", min: -8, max: 10 },
                { type: "jump", start: 6, step: 5, n: 3, dir: "back", min: -10, max: 7 }] },
              { mode: "your", lo: ["5Nc.04", "5Ni.08"], twm: ["TWM.02"], v: [{ type: "sqnth", k: 6 }, { type: "sqnth", k: 8 }, { type: "sqnth", k: 7 }] },
              { mode: "your", lo: ["5Ni.06"], twm: ["TWM.06"], v: [
                { type: "s6why", n: 12, fig: true, at: 1 },
                { type: "s6why", n: 7, fig: true, at: 0, tryd: 2 },
                { type: "s6why", n: 15, fig: true, at: 2 }] },
              { mode: "your", lo: ["5Nc.03"], twm: ["TWM.02"], v: [
                { type: "s6nth", a: 3, d: 4, n: 10, strip: true, jumps: true },
                { type: "s6nth", a: 5, d: 3, n: 10, strip: true, jumps: true },
                { type: "s6nth", a: 2, d: 6, n: 10, strip: true, jumps: true }] }] } }]
    },
    // Practise: Draw it (pictures: the strip, the number track, dot patterns, arrays), then Solve it (like the test).
    practise: [
      { id: 's6r', kit: 'model', game: 'r', surface: 'board', art: 'icon-step-practise',
        title: 'Draw it', blurb: { en: 'Jumps, far terms, dot patterns and arrays.', vi: 'Bước nhảy, số hạng ở xa, mẫu hình chấm và các hàng chấm.' },
        levels: [
          { title: { en: "Jumps and far terms", vi: "Bước nhảy và số hạng ở xa" }, rounds: [
            { mode: "our", lo: ["5Nc.03"], twm: ["TWM.02"], v: [
              { type: "s6nth", a: 4, d: 5, n: 20, strip: true },
              { type: "s6nth", a: 7, d: 3, n: 20, strip: true },
              { type: "s6nth", a: 2, d: 8, n: 20, strip: true }] },
            { mode: "your", lo: ["5Nc.01"], twm: ["TWM.02"], v: [
              { type: "s6first", kind: "neg", who: "Binh", a: 14, d: -4, line: true },
              { type: "s6first", kind: "neg", who: "Trang", a: 17, d: -5, line: true },
              { type: "s6first", kind: "neg", who: "Khoa", a: 10, d: -3, line: true }] },
            { mode: "your", lo: ["5Nc.03"], twm: ["TWM.01"], v: [
              { type: "s6first", kind: "3digit", a: 8, d: 9, strip: true },
              { type: "s6first", kind: "3digit", a: 15, d: 12, strip: true },
              { type: "s6first", kind: "3digit", a: 6, d: 11, strip: true }] }] },
          { title: { en: "Dot patterns and arrays", vi: "Mẫu hình chấm và các hàng chấm" }, rounds: [
            { mode: "your", lo: ["5Nc.04"], twm: ["TWM.02"], v: [
              { type: "s6tri", asks: [5, 6], shown: [1, 2, 3, 4] },
              { type: "s6tri", asks: [4, 5], shown: [1, 2, 3] },
              { type: "s6tri", asks: [5, 7], shown: [2, 3, 4] }] },
            { mode: "your", lo: ["5Ni.06"], twm: ["TWM.05"], v: [
              { type: "s6pair", n: 21, fig: true },
              { type: "s6pair", n: 18, fig: true },
              { type: "s6pair", n: 35, fig: true }] }] }] },
      { id: 's6a', kit: 'model', game: 'a', surface: 'paper', art: 'icon-step-test',
        title: 'Solve it', blurb: { en: 'Answer questions like the test.', vi: 'Trả lời câu hỏi giống bài kiểm tra.' },
        levels: [
          { title: { en: "Counting and square numbers", vi: "Đếm và số chính phương" }, rounds: [
            { mode: "your", lo: ["5Nc.01"], twm: ["TWM.01"], v: [
              two("Binh", 26, 4, "Chi", 3, 5),
              two("Quan", 31, 6, "Lan", 2, 5),
              two("Tu", 22, 5, "Vy", 3, 7)] },
            { mode: "your", lo: ["5Ni.08"], twm: ["TWM.06"], v: [
              RING('square', [9, 18, 25, 40, 64, 80]),
              RING('square', [4, 14, 36, 48, 81, 90]),
              RING('square', [16, 24, 49, 50, 99, 100])] }] },
          { title: { en: "Prime or composite?", vi: "Số nguyên tố hay hợp số?" }, rounds: [
            { mode: "your", lo: ["5Ni.06"], twm: ["TWM.06"], v: [
              RING('prime', [11, 12, 13, 14, 15]),
              RING('prime', [27, 28, 29, 30, 31]),
              RING('prime', [41, 42, 43, 44, 45])] },
            { mode: "your", lo: ["5Ni.06"], twm: ["TWM.04"], v: [
              { type: "s6why", n: 27, at: 0 },
              { type: "s6why", n: 23, at: 2 },
              { type: "s6why", n: 33, at: 1 }] },
            { mode: "your", lo: ["5Nc.03", "5Ni.08", "5Ni.06"], twm: ["TWM.07", "TWM.04"], v: [
              { type: "claim", who: "Khoa", ok: false, at: 0, s6: { k: "nthdouble", a: 4, d: 3, n: 5 },
                wrong: [
                  { t: "10 is double 5, so the 10th term is double the 5th term.", why: "That only works when the sequence starts with its own jump, like 3, 6, 9. This one starts at 4. Work out both terms." },
                  { t: "the 10th term is 34.", why: "That is 10 jumps. From the 1st term to the 10th term there are only 9 jumps: 4 + 9 × 3." }],
                tip: "Work out the 5th term and the 10th term. Then double the 5th term." },
              { type: "claim", who: "Yen", ok: true, at: 2, s6: { k: "sqcomp", eg: 25 },
                wrong: [
                  { t: "square numbers are always even.", why: "9 and 25 are square numbers, and they are odd. Think about the factors of a square number." },
                  { t: "4 is a square number, and 4 is a prime number.", why: "4 = 2 × 2, so 4 has three factors: 1, 2 and 4. It is composite." }],
                tip: "A square number is a number multiplied by itself. What does that tell you about its factors?" },
              { type: "claim", who: "Tam", ok: false, at: 1, s6: { k: "primesum", eg: [2, 3] },
                wrong: [
                  { t: "3 + 5 = 8 and 5 + 7 = 12, and both answers are even.", why: "These two work. But one example that fails shows the claim is wrong. Try 2 + 3." },
                  { t: "prime numbers are always odd, and odd + odd is even.", why: "Not all prime numbers are odd: 2 is prime. Try 2 + 3." }],
                tip: "Try different pairs of prime numbers. Do not forget the prime number 2." }] }] }] }
    ],
    // Notes: how to do it, each with a worked example and a picture; then one gap sentence per note, in the same order.
    notes: {
      items: [
        { en: 'To count back past zero, keep the same jump. After 0 come the [[negative numbers|negative number]].',
          vi: 'Để đếm lùi qua số 0, hãy giữ nguyên bước nhảy. Sau số 0 là các số âm.',
          example: ['Count back in 4s from 10:', '10, 6, 2, *−2, −6*'],
          pic: { k: 'nline', mode: 'jump', skin: 'board', min: -8, max: 12, start: 10, jump: 4, to: -6, lab: 2 } },
        { en: 'To find a far [[term]] of a [[sequence]], do not count every jump. Multiply. The 20th term is 19 jumps from the 1st term.',
          vi: 'Để tìm một số hạng ở xa của dãy số, đừng đếm từng bước nhảy. Hãy nhân. Số hạng thứ 20 cách số hạng thứ nhất 19 bước nhảy.',
          example: ['5, 9, 13, 17, ... The [[rule]] is add 4.', '19 jumps of 4 = 19 × 4 = 76.', 'The 20th term is 5 + 76 = *81*.'],
          pic: { k: 's6strip', a: 5, d: 4, show: 4, n: 20, jumps: true, reveal: true } },
        { en: 'When you multiply a number by itself, you get a [[square number]]. Its dots make a square.',
          vi: 'Khi nhân một số với chính nó, ta được một số chính phương. Các chấm của nó xếp thành hình vuông.',
          example: ['1, 4, 9, 16, 25, 36, 49, 64, 81, 100', '7 × 7 = *49*, so 49 is a square number.'],
          pic: { k: 'dotseq', ks: [1, 2, 3, 4] } },
        { en: 'The dots of a [[triangular number]] make a triangle. Each new pattern adds one more row.',
          vi: 'Các chấm của số tam giác xếp thành hình tam giác. Mỗi hình mới thêm một hàng nữa.',
          example: ['1, 3, 6, 10: you add 2, then 3, then 4.', 'Pattern 5: 10 + 5 = *15*. Pattern 6: 15 + 6 = *21*.'],
          pic: { k: 's6tri', ks: [1, 2, 3, 4], ask: 5 } },
        { en: 'A [[prime number]] has exactly two [[factors|factor]]: 1 and itself. Its dots make only one row. 1 is not prime.',
          vi: 'Số nguyên tố có đúng hai ước số: 1 và chính nó. Các chấm của nó chỉ xếp được một hàng. Số 1 không phải là số nguyên tố.',
          example: ['7 = 1 × 7 only. So *7 is prime*.', 'The prime numbers to 20: 2, 3, 5, 7, 11, 13, 17, 19.'],
          pic: { k: 's6arr', n: 7 } },
        { en: 'A [[composite number]] has more than two factors. To show it, find a factor pair without 1. The number 1 is not prime and not composite.',
          vi: 'Hợp số có nhiều hơn hai ước số. Để chỉ ra điều đó, hãy tìm một cặp ước số không có số 1. Số 1 không phải là số nguyên tố, cũng không phải là hợp số.',
          example: ['12 = 2 × 6 = 3 × 4.', 'The factors of 12 are 1, 2, 3, 4, 6, 12. So *12 is composite*.'],
          pic: { k: 's6arr', n: 12 } }
      ],
      check: [
        { sentence: 'Count back in 5s: 12, 7, 2, {−3|3|−5}.', answer: '−3' },
        { sentence: '2, 5, 8, 11, ... The 10th term is 2 + 9 × 3 = {29|32|30}.', answer: '29' },
        { sentence: 'The square number between 60 and 70 is {64|66|69}.', answer: '64' },
        { sentence: '1, 3, 6, 10, 15: the next triangular number is {21|20|25}.', answer: '21' },
        { sentence: 'Of 9, 11 and 15, the prime number is {11|9|15}.', answer: '11' },
        { sentence: '21 is composite because 21 = {3 × 7|1 × 21|2 × 10}.', answer: '3 × 7' }
      ]
    },
    // Mini Practice test: 10 questions, easy to hard, DOK 1, 1, 1, 1, 2, 2, 2, 2, 2, 3; every objective is tested.
    test: {
      items: [
        { dok: 1, lo: ["5Nc.01"], twm: ["TWM.02"], v: [
          { type: "seqnext", a: 13, d: -4, shown: 4, ask: 2 },
          { type: "seqnext", a: 11, d: -3, shown: 4, ask: 2 },
          { type: "seqnext", a: 14, d: -5, shown: 3, ask: 2 }] },
        { dok: 1, lo: ["5Ni.08"], twm: ["TWM.06"], v: [
          RING('square', [8, 16, 27, 36, 45, 81]),
          RING('square', [1, 12, 25, 44, 49, 60]),
          RING('square', [9, 10, 20, 64, 72, 100])] },
        { dok: 1, lo: ["5Nc.04"], twm: ["TWM.02"], v: [
          { type: "s6tri", asks: [5], shown: [1, 2, 3, 4] },
          { type: "s6tri", asks: [4], shown: [1, 2, 3] },
          { type: "s6tri", asks: [6], shown: [3, 4, 5] }] },
        { dok: 1, lo: ["5Ni.06"], twm: ["TWM.06"], v: [
          RING('prime', [17, 18, 19, 20, 21]),
          RING('prime', [35, 36, 37, 38, 39]),
          RING('prime', [57, 58, 59, 60, 61])] },
        { dok: 2, lo: ["5Nc.03"], twm: ["TWM.02"], v: [
          { type: "s6nth", a: 9, d: 4, n: 20 },
          { type: "s6nth", a: 6, d: 7, n: 20 },
          { type: "s6nth", a: 11, d: 6, n: 20 }] },
        { dok: 2, lo: ["5Nc.03"], twm: ["TWM.01"], v: [
          { type: "s6first", kind: "3digit", a: 13, d: 8 },
          { type: "s6first", kind: "3digit", a: 5, d: 9 },
          { type: "s6first", kind: "3digit", a: 18, d: 7 }] },
        { dok: 2, lo: ["5Nc.01"], twm: ["TWM.01"], v: [
          two("Hoa", 30, 7, "Duy", 4, 6),
          two("Nhi", 25, 4, "Son", 3, 9),
          two("Khoi", 33, 8, "Yen", 5, 6)] },
        { dok: 2, lo: ["5Ni.06"], twm: ["TWM.04"], v: [
          { type: "s6why", who: "Lan", n: 15, at: 1, ctx: "Lan looks at the numbers <b>13, 14, 15, 16, 17</b>." },
          { type: "s6why", who: "Phong", n: 21, at: 2, ctx: "Phong looks at the numbers <b>19, 20, 21, 22, 23</b>." },
          { type: "s6why", who: "Giang", n: 39, at: 0, ctx: "Giang looks at the numbers <b>37, 38, 39, 40, 41</b>." }] },
        { dok: 2, lo: ["5Nc.04"], twm: ["TWM.02"], v: [
          { type: "s6tri", asks: [6, 7], shown: [1, 2, 3] },
          { type: "s6tri", asks: [7, 8], shown: [1, 2, 3] },
          { type: "s6tri", asks: [6, 8], shown: [1, 2, 3] }] },
        { dok: 3, lo: ["5Nc.04", "5Ni.08", "5Ni.06"], twm: ["TWM.07", "TWM.04"], v: [
          { type: "claim", who: "Dung", ok: false, at: 1, s6: { k: "sqsum", says: "even", eg: [1, 4] },
            wrong: [
              { t: "4 + 16 = 20, and 20 is even.", why: "That example works. But one example does not show always. Try 1 + 4." },
              { t: "square numbers are always even.", why: "9 = 3 × 3 is a square number, and 9 is odd. Try 1 + 4." }],
            pic: { k: "dotseq", ks: [1, 2, 3, 4] },
            tip: "Write the square numbers: 1, 4, 9, 16, 25. Add different pairs. Is the answer always even?" },
          { type: "claim", who: "Trang", ok: true, at: 0, s6: { k: "trisum", ks: [1, 2, 3] },
            wrong: [
              { t: "1 + 3 = 4, and 4 is an even number.", why: "Even is not the same as square. Check more pairs: 3 + 6 and 6 + 10. Are the answers square numbers?" },
              { t: "3 + 6 = 9, but 6 + 10 = 16 is not a square number.", why: "16 = 4 × 4, so 16 is a square number." }],
            pic: { k: "s6tri", ks: [1, 2, 3, 4], cap: true },
            tip: "Write the triangular numbers: 1, 3, 6, 10, 15. Add pairs that are next to each other." },
          { type: "claim", who: "Hieu", ok: false, at: 2, s6: { k: "primeodd" },
            wrong: [
              { t: "3, 5, 7 and 11 are prime numbers, and they are all odd.", why: "These are odd. But check the smallest prime number. Is it odd?" },
              { t: "9 is an odd number, but 9 is not prime.", why: "That is true, but it does not test the claim. Find a prime number that is not odd." }],
            tip: "Write the first prime numbers: 2, 3, 5, 7. Are they all odd?" }] }
      ]
    },
    lightning: { secs: 60, items: L },
    selfcheck: {
      goals: ["count on and count back in steps, also below zero", "find a far term of a sequence with multiplication", "continue the dot patterns of square and triangular numbers", "spot the square numbers from 1 to 100", "say why a number is prime or composite"],
      again: ["c", "r", "r", "a", "a"]
    }
  };
})(window.T = window.T || {});
