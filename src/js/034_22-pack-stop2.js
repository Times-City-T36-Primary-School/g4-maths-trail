/* 22-pack-stop2.js - ALL the content of Stop 2, Multiply and divide by 10, 100 and 1,000 (Grade 4, Stage 5).
   Parts: words, see, practise, notes, test, lightning, selfcheck.
   Objectives: 5Np.02 (whole numbers × ÷ 10, 100, 1,000) and 5Np.03 (decimals × ÷ 10 and 100).
   Tagging rule (the same everywhere): a step that multiplies or divides a WHOLE number is 5Np.02, even when the answer is
   a decimal (63 ÷ 100 = 0.63); a step that multiplies or divides a DECIMAL is 5Np.03, and only by 10 or 100 (never a
   decimal × or ÷ 1,000). A round or test item carries every code that one of its three sets of numbers uses.
   Every calculation question is the model `s2pow` (009d_g4-models-s2.js): the pack gives the start number, the
   operation and the power of ten, and the model works out the answer with exact arithmetic. The pictures are the
   place value slider `s2slide` and the flow diagram `s2flow` (047g_g4-pics-s2.js). The claims carry `s2fact`: every
   calculation they use, as [n, op, p, result], worked out again by the author's check. */
(function (T) {
  'use strict';

  const P = (kind, more) => Object.assign({ type: 's2pow', kind: kind }, more || {});
  const calc = (items, more) => P('calc', Object.assign({ items: items }, more || {}));
  const X = 'x', D = 'd';

  /* Lightning: [n, op, p] -> the question, the right answer and two wrong ones, all worked out by the model's exact
     arithmetic. Every wrong answer is a mistake a child makes and has at most 2 decimal places (Stage 5 numbers):
     - a whole number: the same operation with the other powers of ten (the wrong way when that needs 3 decimal places)
     - a decimal × 10: × 100, and a zero written at the end (2.7 × 10 -> 2.70)
     - a decimal × 100: × 10 and × 1,000
     - a decimal ÷ 10: the wrong way (× 10), and a zero put after the point (5.2 -> 5.02; 0.8 -> 0.80) */
  const S = window.MX.s2, SYM = { x: '×', d: '÷' }, OTHER = { 10: [100, 1000], 100: [10, 1000], 1000: [100, 10] };
  const nice = u => u % 10000 === 0;
  function quick(t) {
    const n = S.parse(t[0]), op = t[1], p = t[2], right = S.apply(n, op, p), dec = n % S.U !== 0;
    let wrong;
    if (dec && op === X && p === 10) wrong = [S.show(S.apply(n, X, 100)), S.raw(n) + '0'];
    else if (dec && op === X) wrong = OTHER[p].map(q => S.show(S.apply(n, X, q)));
    else if (dec) {
      const w = Math.floor(n / S.U), f = S.raw(n).split('.')[1];
      wrong = [S.show(S.apply(n, X, p)), w > 0 ? window.MX.fmt(w) + '.0' + f : S.raw(n) + '0'];
    } else {
      wrong = OTHER[p].filter(q => S.can(n, op, q) && nice(S.apply(n, op, q))).map(q => S.show(S.apply(n, op, q)));
      if (wrong.length < 2) wrong.push(S.show(S.apply(n, op === X ? D : X, p)));
      wrong = wrong.slice(0, 2);
    }
    return [S.show(n) + ' ' + SYM[op] + ' ' + window.MX.fmt(p), [S.show(right)].concat(wrong)];
  }
  const QUICK = [
    [7, X, 10], [23, X, 100], [5, X, 1000], [18, X, 1000], [40, X, 100], [305, X, 10], [9, X, 100], [64, X, 1000], [120, X, 10], [3, X, 1000],
    [800, D, 100], [5000, D, 1000], [340, D, 10], [72000, D, 1000], [6000, D, 100], [90, D, 10], [15000, D, 1000], [2700, D, 100],
    [7, D, 10], [45, D, 10], [9, D, 100], [38, D, 100], [125, D, 100], [6, D, 100], [203, D, 10], [51, D, 100],
    [0.4, X, 10], [2.7, X, 10], [0.15, X, 10], [3.08, X, 10], [0.6, X, 100], [1.9, X, 100], [0.05, X, 100], [4.32, X, 100], [0.75, X, 100], [12.5, X, 10], [0.9, X, 100], [6.1, X, 10],
    [5.2, D, 10], [0.8, D, 10], [14.3, D, 10], [0.3, D, 10], [60.5, D, 10], [9.9, D, 10], [2.4, D, 10], [70.1, D, 10], [0.5, D, 10], [33.3, D, 10]
  ].map(quick);

  T.packs[2] = {
    n: 2,
    title: "Multiply and divide by 10, 100 and 1,000",
    los: ["5Np.02", "5Np.03"],
    blurb: {
      en: "*Multiply* and *divide* by 10, 100 and 1,000. Watch the digits move.",
      vi: "*Nhân* và *chia* cho 10, 100 và 1.000. Xem các chữ số dịch chuyển."
    },
    // Words: 9 picture cards in 3 sets (the pictures are in 017w_g4-art-s2.js).
    words: {
      sets: [
        { id: 'A', title: { en: 'The operations', vi: 'Các phép tính' }, keys: ['multiply', 'divide', 'inverse'] },
        { id: 'B', title: { en: 'Moving digits', vi: 'Dịch chuyển chữ số' }, keys: ['column', 'left', 'right'] },
        { id: 'C', title: { en: 'Zeros, diagrams and stories', vi: 'Số 0, sơ đồ và bài toán' }, keys: ['placeholder', 'flow diagram', 'identical'] }
      ],
      items: {
        'multiply': { art: 'w-s2-multiply', vi: 'nhân', def: 'To make a number many times bigger. 3 × 10 = 30.' },
        'divide': { art: 'w-s2-divide', vi: 'chia', def: 'To make a number many times smaller. 30 ÷ 10 = 3.' },
        'inverse': { art: 'w-s2-inverse', vi: 'phép tính ngược', def: 'The opposite operation. It takes you back. ÷ 10 is the inverse of × 10.' },
        'column': { art: 'w-s2-column', vi: 'cột', def: 'A line of boxes going down in a place value chart. Each place has its own column.' },
        'left': { art: 'w-s2-left', vi: 'bên trái', def: 'The side where the places get bigger. To multiply by 10, move each digit 1 place to the left.' },
        'right': { art: 'w-s2-right', vi: 'bên phải', def: 'The side where the places get smaller. To divide by 10, move each digit 1 place to the right.' },
        'placeholder': { art: 'w-s2-placeholder', vi: 'chữ số 0 giữ chỗ', def: 'A zero that holds an empty place. In 407 the zero holds the tens place.' },
        'flow diagram': { art: 'w-s2-flow', vi: 'sơ đồ mũi tên', def: 'Boxes joined by arrows. Each arrow shows an operation: 4 → × 10 → 40.' },
        'identical': { art: 'w-s2-identical', vi: 'giống hệt nhau', def: 'Exactly the same. 100 identical nails all have the same mass.' }
      }
    },
    // See it: one challenge scene, picture-led: read the slider, use it to multiply and divide, a flow diagram, a
    // missing operation.
    see: {
      scenes: [
        { id: 'challenge', title: { en: 'Watch the digits move', vi: 'Xem các chữ số dịch chuyển' },
          challenge: {
            end: { en: 'You did it! You can move digits left and right.', vi: 'Em làm được rồi! Em biết dịch chuyển chữ số sang trái và sang phải.' },
            result: 'You moved digits left and right in the place value chart.',
            rounds: [
              { mode: "our", lo: ["5Np.03"], twm: ["TWM.05"], v: [
                P('read', { n: 3.4, op: X, p: 10, at: 1 }), P('read', { n: 52.7, op: D, p: 10, at: 0 }), P('read', { n: 0.68, op: X, p: 100, at: 2 })] },
              { mode: "our", lo: ["5Np.03"], twm: ["TWM.02"], v: [
                calc([[0.47, X, 100]], { show: 'full' }), calc([[2.9, X, 10]], { show: 'full' }), calc([[0.06, X, 100]], { show: 'full' })] },
              { mode: "your", lo: ["5Np.03"], twm: ["TWM.05"], v: [
                calc([[6.3, D, 10]], { show: 'full' }), calc([[8.4, D, 10]], { show: 'full' }), calc([[70.5, D, 10]], { show: 'full' })] },
              { mode: "your", lo: ["5Np.02"], twm: ["TWM.02"], v: [
                P('flow', { start: 38, ops: [[X, 10], [X, 100]], hide: ['box', 2] }),
                P('flow', { start: 52000, ops: [[D, 10], [D, 100]], hide: ['box', 2] }),
                P('flow', { start: 7, ops: [[X, 100], [X, 10]], hide: ['box', 2] })] },
              { mode: "your", lo: ["5Np.03"], twm: ["TWM.01"], v: [
                P('op', { n: 1.5, op: X, p: 100, at: 2, show: true }), P('op', { n: 9.4, op: D, p: 10, at: 0, show: true }), P('op', { n: 0.8, op: X, p: 10, at: 3, show: true })] }] } }]
    },
    // Practise: Draw it (the slider and flow diagrams), then Solve it (like the test).
    practise: [
      { id: 's2r', kit: 'model', game: 'r', surface: 'board', art: 'icon-step-practise',
        title: 'Draw it', blurb: { en: 'Slide the digits. Follow the arrows.', vi: 'Dịch chuyển chữ số. Đi theo mũi tên.' },
        levels: [
          { title: { en: "Slide the digits", vi: "Dịch chuyển chữ số" }, rounds: [
            { mode: "our", lo: ["5Np.02"], twm: ["TWM.05"], v: [
              calc([[26, X, 1000]], { show: 'full' }), calc([[53000, D, 1000]], { show: 'full' }), calc([[408, X, 100]], { show: 'full' })] },
            { mode: "your", lo: ["5Np.03"], twm: ["TWM.05"], v: [
              calc([[7.3, D, 10]], { show: 'ask' }), calc([[0.59, X, 10]], { show: 'ask' }), calc([[16.2, D, 10]], { show: 'ask' })] },
            { mode: "your", lo: ["5Np.03"], twm: ["TWM.01"], v: [
              P('op', { n: 0.25, op: X, p: 100, at: 1, show: true }), P('op', { n: 3.1, op: D, p: 10, at: 3, show: true }), P('op', { n: 60.4, op: X, p: 10, at: 0, show: true })] }] },
          { title: { en: "Flow diagrams", vi: "Sơ đồ mũi tên" }, rounds: [
            { mode: "your", lo: ["5Np.02", "5Np.03"], twm: ["TWM.02"], v: [
              P('flow', { start: 6.5, ops: [[X, 10], [X, 10]], hide: ['op', 1] }),
              P('flow', { start: 56, ops: [[D, 10], [D, 10]], hide: ['op', 1] }),
              P('flow', { start: 0.72, ops: [[X, 100], [X, 10]], hide: ['op', 0] })] },
            { mode: "your", lo: ["5Np.02", "5Np.03"], twm: ["TWM.02"], v: [
              P('flow', { start: 4.8, ops: [[X, 100], [D, 10]], hide: ['box', 0] }),
              P('flow', { start: 350, ops: [[D, 100], [X, 10]], hide: ['box', 0] }),
              P('flow', { start: 0.9, ops: [[X, 10], [X, 100]], hide: ['box', 0] })] }] }] },
      { id: 's2a', kit: 'model', game: 'a', surface: 'paper', art: 'icon-step-test',
        title: 'Solve it', blurb: { en: 'Answer questions like the test.', vi: 'Trả lời câu hỏi giống bài kiểm tra.' },
        levels: [
          { title: { en: "Calculate and balance", vi: "Tính và cân bằng" }, rounds: [
            { mode: "your", lo: ["5Np.03"], twm: ["TWM.05"], v: [
              calc([[37.5, D, 10], [0.82, X, 100]]), calc([[9.4, D, 10], [6.07, X, 100]]), calc([[50.8, D, 10], [0.3, X, 100]])] },
            { mode: "your", lo: ["5Np.02", "5Np.03"], twm: ["TWM.02"], v: [
              P('miss', { items: [[null, X, 100, 250], [84, D, null, 0.84]] }),
              P('miss', { items: [[null, D, 10, 7.9], [0.5, X, null, 50]] }),
              P('miss', { items: [[null, X, 1000, 61000], [0.32, X, null, 32]] })] },
            { mode: "your", lo: ["5Np.02", "5Np.03"], twm: ["TWM.02"], v: [
              P('bal', { a: 0.6, lops: [[X, 100], [D, 10]], rop: [D, 100] }),
              P('bal', { a: 45, lops: [[D, 10], [X, 100]], rop: [D, 10] }),
              P('bal', { a: 1.9, lops: [[X, 100], [D, 10]], rop: [X, 10] })] }] },
          { title: { en: "Stories and claims", vi: "Bài toán và nhận định" }, rounds: [
            { mode: "your", lo: ["5Np.03"], twm: ["TWM.01"], v: [
              P('story', { n: 37.5, ops: [[D, 10]], unit: 'g', tip: "The 10 nails are identical. To find one nail, divide by 10.",
                text: "A bag holds <b>10</b> identical nails. Their mass is <b>37.5</b> g altogether. What is the mass of <b>1</b> nail?" }),
              P('story', { n: 0.15, ops: [[X, 100]], unit: 'kg', tip: "Every bowl needs the same. For 100 bowls, multiply by 100.",
                text: "One bowl of pho needs <b>0.15</b> kg of noodles. How many kilograms of noodles do <b>100</b> bowls need?" }),
              P('story', { n: 72.5, ops: [[D, 10]], unit: 'm', tip: "The 10 boats are identical. To find one boat, divide by 10.",
                text: "<b>10</b> identical boats are in a line on the lake, with no gaps. The line is <b>72.5</b> m long. How long is <b>1</b> boat?" })] },
            { mode: "your", lo: ["5Np.03"], twm: ["TWM.04", "TWM.07"], v: [
              { type: "claim", who: "Khoa", ok: false, at: 1, s2fact: [[3.5, X, 10, 35]],
                says: "3.5 × 10 = 3.50, because you write a zero at the end.",
                reasons: [
                  { t: "every digit moves 1 place to the left, so 3.5 × 10 = 35." },
                  { t: "3.50 is bigger than 3.5, so the answer is right.", why: "3.50 and 3.5 are the same number. Nothing changed." },
                  { t: "you must write two zeros: 3.500.", why: "3.500 is still 3.5. A zero at the end of a decimal does not change it." }],
                hint: { pic: { k: 's2slide', n: '3.5', op: X, p: 10, ask: true }, step: "Is 3.50 bigger than 3.5? Move each digit 1 place to the left." },
                worked: "3.50 is the same as 3.5. To multiply by 10, every digit moves 1 place to the left: 3.5 × 10 = 35.",
                model: "Khoa is incorrect because every digit moves 1 place to the left, so 3.5 × 10 = 35." },
              { type: "claim", who: "Vy", ok: true, at: 0, s2fact: [[6.2, D, 10, 0.62]],
                says: "6.2 ÷ 10 = 0.62",
                reasons: [
                  { t: "every digit moves 1 place to the right: 6 tenths and 2 hundredths." },
                  { t: "dividing by 10 takes away a zero.", why: "6.2 has no zero to take away. Move the digits." },
                  { t: "0.62 is bigger than 6.2.", why: "0.62 is smaller than 6.2. Dividing by 10 makes a number smaller." }],
                hint: { pic: { k: 's2slide', n: '6.2', op: D, p: 10, ask: true }, step: "÷ 10 moves every digit 1 place to the right. Where do the 6 and the 2 land?" },
                worked: "÷ 10 moves every digit 1 place to the right. The 6 ones become 6 tenths and the 2 tenths become 2 hundredths: 0.62.",
                model: "Vy is correct because every digit moves 1 place to the right: 6 tenths and 2 hundredths." },
              { type: "claim", who: "Quan", ok: false, at: 2, s2fact: [[0.4, X, 100, 40], [0.4, X, 10, 4]],
                says: "0.4 × 100 = 0.400, because you write two zeros at the end.",
                reasons: [
                  { t: "every digit moves 2 places to the left, so 0.4 × 100 = 40." },
                  { t: "0.400 is 100 times bigger than 0.4.", why: "0.400 and 0.4 are the same number. Nothing changed." },
                  { t: "the answer is 4, not 0.400.", why: "4 is 0.4 × 10. For × 100 the digits move 2 places." }],
                hint: { pic: { k: 's2slide', n: '0.4', op: X, p: 100, ask: true }, step: "Is 0.400 bigger than 0.4? Move each digit 2 places to the left." },
                worked: "0.400 is the same as 0.4. To multiply by 100, every digit moves 2 places to the left: 0.4 × 100 = 40.",
                model: "Quan is incorrect because every digit moves 2 places to the left, so 0.4 × 100 = 40." }] }] }] }
    ],
    // Notes: how to do it, each with a worked example and a picture, then one gap sentence per note.
    notes: {
      items: [
        { en: 'To [[multiply]] by 10, 100 or 1,000, move every digit 1, 2 or 3 places to the [[left]].',
          vi: 'Để nhân với 10, 100 hoặc 1.000, hãy dịch mỗi chữ số sang trái 1, 2 hoặc 3 hàng.',
          example: ['26 × 1,000: every digit moves 3 places to the left.', 'Write zeros in the empty places: *26,000*.'],
          pic: { k: 's2slide', n: '26', op: X, p: 1000 } },
        { en: 'To [[divide]] by 10, 100 or 1,000, move every digit 1, 2 or 3 places to the [[right]].',
          vi: 'Để chia cho 10, 100 hoặc 1.000, hãy dịch mỗi chữ số sang phải 1, 2 hoặc 3 hàng.',
          example: ['63 ÷ 100: every digit moves 2 places to the right.', '6 tens become 6 tenths. 3 ones become 3 hundredths: *0.63*.'],
          pic: { k: 's2slide', n: '63', op: D, p: 100 } },
        { en: 'The decimal point never moves. Each digit moves to a new [[column]]. Do not just write a zero at the end!',
          vi: 'Dấu thập phân không bao giờ dịch chuyển. Mỗi chữ số chuyển sang một cột mới. Đừng chỉ viết thêm số 0 vào cuối!',
          example: ['2.5 × 10 is not 2.50. That is the same number as 2.5!', 'Move each digit 1 place to the left: 2.5 × 10 = *25*.'],
          pic: { k: 's2slide', n: '2.5', op: X, p: 10 } },
        { en: 'A zero can be a [[placeholder]]. It keeps the other digits in the right places.',
          vi: 'Chữ số 0 có thể giữ chỗ. Nó giữ cho các chữ số khác ở đúng hàng.',
          example: ['0.7 ÷ 10: the 7 moves to the hundredths place.', 'Write 0 in the tenths place to hold it: *0.07*.'],
          pic: { k: 's2slide', n: '0.7', op: D, p: 10 } },
        { en: 'Multiplying and dividing are [[inverse]] operations. To find a missing start number, work backwards.',
          vi: 'Nhân và chia là hai phép tính ngược nhau. Để tìm số ban đầu còn thiếu, hãy tính ngược lại.',
          example: ['☐ × 100 = 480. Work backwards: 480 ÷ 100 = *4.8*.', 'Check: 4.8 × 100 = 480.'],
          pic: { k: 's2flow', boxes: ['4.8', '480'], ops: ['× 100'], hl: { box: 0 }, cap: 'Backwards: 480 ÷ 100 = 4.8' } },
        { en: 'In a [[flow diagram]], two moves make one move. Count the places.',
          vi: 'Trong sơ đồ mũi tên, hai lần dịch chuyển gộp thành một. Hãy đếm số hàng.',
          example: ['3.6 × 10 × 10: 1 place and 1 place make 2 places.', 'So × 10 × 10 is the same as × 100: *360*.', '× 100 then ÷ 10 is the same as × 10.'],
          pic: { k: 's2flow', boxes: ['3.6', '36', '360'], ops: ['× 10', '× 10'], cap: '× 10 × 10 = × 100' } }
      ],
      check: [
        { sentence: '45 × 1,000 = {45,000|4,500|450,000}.', answer: '45,000' },
        { sentence: '920 ÷ 100 = {92|9.2|0.92}.', answer: '9.2' },
        { sentence: '1.6 × 10 = {1.60|160|16}.', answer: '16' },
        { sentence: '0.3 ÷ 10 = {0.03|0.3|3}.', answer: '0.03' },
        { sentence: '☐ ÷ 10 = 5.7, so ☐ = {0.57|57|570}.', answer: '57' },
        { sentence: '× 10 and then × 100 is the same as {× 110|× 1,000|× 100}.', answer: '× 1,000' }
      ]
    },
    // Mini Practice test: 10 questions, easy to hard, DOK 1, 1, 1, 1, 2, 2, 2, 2, 2, 3; 3 sets of numbers each.
    test: {
      items: [
        { dok: 1, lo: ["5Np.02"], twm: ["TWM.05"], v: [
          calc([[73, X, 1000], [58000, D, 1000]]), calc([[19, X, 1000], [240000, D, 1000]]), calc([[605, X, 1000], [91000, D, 1000]])] },
        { dok: 1, lo: ["5Np.03"], twm: ["TWM.05"], v: [
          calc([[29.4, D, 10], [0.57, X, 100]]), calc([[81.3, D, 10], [0.09, X, 100]]), calc([[6.2, D, 10], [4.15, X, 100]])] },
        { dok: 1, lo: ["5Np.03"], twm: ["TWM.01"], v: [
          P('op', { n: 0.9, op: X, p: 100, at: 1 }), P('op', { n: 7.5, op: D, p: 10, at: 3 }), P('op', { n: 1.08, op: X, p: 100, at: 0 })] },
        { dok: 1, lo: ["5Np.02", "5Np.03"], twm: ["TWM.02"], v: [
          P('miss', { items: [[5.3, X, null, 530], [8000, D, null, 8]] }),
          P('miss', { items: [[0.71, X, null, 7.1], [26000, D, null, 260]] }),
          P('miss', { items: [[8.6, D, null, 0.86], [12, X, null, 12000]] })] },
        { dok: 2, lo: ["5Np.02"], twm: ["TWM.02"], v: [
          P('flow', { start: 25, ops: [[X, 10], [X, 100]], hide: ['op', 1], mid: false }),
          P('flow', { start: 4, ops: [[X, 100], [X, 10]], hide: ['op', 0], mid: false }),
          P('flow', { start: 90000, ops: [[D, 10], [D, 100]], hide: ['op', 1], mid: false })] },
        { dok: 2, lo: ["5Np.03"], twm: ["TWM.02"], v: [
          P('miss', { items: [[null, D, 10, 0.38], [null, X, 10, 4.5]] }),
          P('miss', { items: [[null, D, 10, 2.06], [null, X, 100, 170]] }),
          P('miss', { items: [[null, D, 10, 0.05], [null, X, 10, 93.1]] })] },
        { dok: 2, lo: ["5Np.02", "5Np.03"], twm: ["TWM.02"], v: [
          P('bal', { a: 0.8, lops: [[X, 100], [D, 10]], rop: [D, 100] }),
          P('bal', { a: 2.3, lops: [[X, 10], [X, 10]], rop: [D, 10] }),
          P('bal', { a: 540, lops: [[D, 100], [X, 10]], rop: [X, 10] })] },
        { dok: 2, lo: ["5Np.02", "5Np.03"], twm: ["TWM.01"], v: [
          P('story', { n: 450, ops: [[D, 100], [X, 10]], unit: 'g', mid: "the mass of 1 marble", tip: "First find the mass of 1 marble: divide by 100. Then find 10 marbles: multiply by 10.",
            text: "<b>100</b> identical marbles have a mass of <b>450</b> g. What is the mass of <b>10</b> of these marbles?" }),
          P('story', { n: 7.5, ops: [[D, 10], [X, 100]], unit: 'litres', mid: "what 1 bottle holds", tip: "First find what 1 bottle holds: divide by 10. Then find 100 bottles: multiply by 100.",
            text: "<b>10</b> identical bottles hold <b>7.5</b> litres of fish sauce altogether. How much do <b>100</b> of these bottles hold?" }),
          P('story', { n: 3, ops: [[D, 100], [X, 10]], unit: 'cm', mid: "how thick 1 sheet is", tip: "First find how thick 1 sheet is: divide by 100. Then find 10 sheets: multiply by 10.",
            text: "A pile of <b>100</b> identical sheets of card is <b>3</b> cm high. How high is a pile of <b>10</b> of these sheets?" })] },
        { dok: 2, lo: ["5Np.02"], twm: ["TWM.01"], v: [
          P('story', { n: 38, ops: [[X, 1000], [D, 100]], unit: 'boxes', mid: "the number of pencils", tip: "First find all the pencils: multiply by 1,000. Then put them in hundreds: divide by 100.",
            text: "A crate holds <b>1,000</b> pencils. A factory fills <b>38</b> crates. Then it puts all the pencils into boxes of <b>100</b>. How many boxes?" }),
          P('story', { n: 24000, ops: [[D, 1000], [D, 10]], unit: 'kg', mid: "the mass of all the flour in kilograms", tip: "First change grams to kilograms: divide by 1,000. Then share among 10 bags: divide by 10.",
            text: "A baker has <b>24,000</b> g of flour in <b>10</b> equal bags. 1 kg is <b>1,000</b> g. How many kilograms are in each bag?" }),
          P('story', { n: 15, ops: [[X, 1000], [D, 10]], unit: 'books', mid: "the number of tickets", tip: "First find all the tickets: multiply by 1,000. Then put them in tens: divide by 10.",
            text: "A football club prints <b>15</b> blocks of <b>1,000</b> tickets. The tickets go into books of <b>10</b>. How many books are there?" })] },
        { dok: 3, lo: ["5Np.02", "5Np.03"], twm: ["TWM.04", "TWM.07"], v: [
          { type: "claim", who: "Dung", ok: false, at: 1, ctx: "Dung divides these numbers by 10: <b>30, 120, 45</b>.", s2fact: [[30, D, 10, 3], [120, D, 10, 12], [45, D, 10, 4.5]],
            says: "When you divide a whole number by 10, the answer is always a whole number.",
            reasons: [
              { t: "45 ÷ 10 = 4.5, and 4.5 is not a whole number." },
              { t: "30 ÷ 10 = 3, and 3 is a whole number.", why: "That is true for 30. Now work out 45 ÷ 10." },
              { t: "dividing always makes a whole number.", why: "Check every number in the list. Where does the 5 of 45 go?" }],
            hint: { pic: { k: 's2slide', n: '45', op: D, p: 10, ask: true }, step: "Work out each division. In 45 ÷ 10, where does the 5 go?" },
            worked: "30 ÷ 10 = 3 and 120 ÷ 10 = 12. But 45 ÷ 10 = 4.5: the 5 moves to the tenths place. One example is enough to show the rule is wrong.",
            model: "Dung is incorrect because 45 ÷ 10 = 4.5, and 4.5 is not a whole number." },
          { type: "claim", who: "Trang", ok: true, at: 2, ctx: "Trang tries it with <b>7</b> and with <b>25</b>.", s2fact: [[7, X, 10, 70], [70, X, 100, 7000], [7, X, 1000, 7000], [25, X, 10, 250], [250, X, 100, 25000], [25, X, 1000, 25000]],
            says: "Multiplying by 10 and then by 100 is always the same as multiplying by 1,000.",
            reasons: [
              { t: "the digits move 1 place, then 2 more places. That is 3 places, the same as × 1,000." },
              { t: "10 + 100 = 110, so it is the same as × 110.", why: "Count the places: 1 place and 2 places make 3 places. That is × 1,000, not × 110." },
              { t: "it works for 7, but not for a bigger number like 25.", why: "Try it: 25 × 10 = 250 and 250 × 100 = 25,000. Also 25 × 1,000 = 25,000." }],
            hint: { pic: { k: 's2flow', boxes: ['7', '70', ''], ops: ['× 10', '× 100'] }, step: "Try both numbers. How many places do the digits move in all?" },
            worked: "7 × 10 = 70 and 70 × 100 = 7,000. Also 7 × 1,000 = 7,000. With 25: 25 × 10 = 250 and 250 × 100 = 25,000. Also 25 × 1,000 = 25,000. 1 place and 2 places always make 3 places.",
            model: "Trang is correct because the digits move 1 place, then 2 more places. That is 3 places, the same as × 1,000." },
          { type: "claim", who: "Phong", ok: false, at: 0, ctx: "Phong works out <b>8 × 100</b>, <b>15 × 100</b> and <b>1.2 × 100</b>.", s2fact: [[8, X, 100, 800], [15, X, 100, 1500], [1.2, X, 100, 120]],
            says: "To multiply any number by 100, you write two zeros at the end.",
            reasons: [
              { t: "1.2 × 100 = 120, but two zeros at the end give 1.200, which is still 1.2." },
              { t: "15 × 100 = 1,500, and 1,500 ends in two zeros.", why: "That is true for 15. Now work out 1.2 × 100." },
              { t: "1.2 × 100 = 1.200, so the rule works.", why: "1.200 and 1.2 are the same number. Move the digits 2 places to the left." }],
            hint: { pic: { k: 's2slide', n: '1.2', op: X, p: 100, ask: true }, step: "Work out each one. Is 1.200 bigger than 1.2?" },
            worked: "8 × 100 = 800 and 15 × 100 = 1,500. But 1.2 × 100 = 120. Writing two zeros gives 1.200, which is the same as 1.2. The rule fails for decimals.",
            model: "Phong is incorrect because 1.2 × 100 = 120, but two zeros at the end give 1.200, which is still 1.2." }] }
      ]
    },
    // Lightning round: 60 seconds of quick mental questions; the first answer is the right one.
    lightning: {
      secs: 60,
      items: QUICK.concat([
        ["Digits move 2 places left. That is", ["× 100", "÷ 100", "× 10"]],
        ["Digits move 1 place right. That is", ["÷ 10", "× 10", "÷ 100"]],
        ["Digits move 3 places left. That is", ["× 1,000", "× 100", "÷ 1,000"]],
        ["Digits move 2 places right. That is", ["÷ 100", "× 100", "÷ 10"]],
        ["× 10 then × 10 is the same as", ["× 100", "× 20", "× 10"]],
        ["× 100 then ÷ 10 is the same as", ["× 10", "× 1,000", "÷ 10"]],
        ["× 10 then × 100 is the same as", ["× 1,000", "× 110", "× 100"]],
        ["The inverse of × 100 is", ["÷ 100", "× 100", "÷ 10"]],
        ["The inverse of ÷ 10 is", ["× 10", "÷ 10", "× 100"]],
        ["3.6 × ? = 360", ["100", "10", "1,000"]],
        ["520 ÷ ? = 5.2", ["100", "10", "1,000"]],
        ["8 × ? = 8,000", ["1,000", "100", "10"]],
        ["? × 10 = 4.7", ["0.47", "47", "4.07"]],
        ["? ÷ 100 = 0.09", ["9", "0.9", "90"]]
      ])
    },
    // My self-check: again = the step to practise again for each goal (c = See it, r = Draw it, a = Solve it).
    selfcheck: {
      goals: ["multiply and divide whole numbers by 10, 100 and 1,000", "multiply and divide decimals by 10 and 100", "find a missing number or operation by working backwards", "explain why writing a zero does not multiply a decimal by 10"],
      again: ["r", "c", "a", "a"]
    }
  };
})(window.T = window.T || {});
