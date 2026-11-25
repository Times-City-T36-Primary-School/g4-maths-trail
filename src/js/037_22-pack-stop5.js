/* 22-pack-stop5.js - ALL the content of Stop 5, Fractions, decimals and percentages (Grade 4, Stage 5; world: Percent Garden).
   Parts: words, see, practise, notes, test, lightning, selfcheck.
   The models (s5conv, s5grid, s5pickgrid, s5shade, s5two, s5cmp, s5order, s5pick, s5same, and the checked facts of a claim)
   are in 009d_g4-models-s5.js: they work every answer out from the values in the data ('3/10', '0.7', '70%').
   The pictures (s5grid, s5line, s5bars) and the tools (s5shade, s5order) are in 047g_g4-pics-s5.js, the word pictures in
   017w_g4-art-s5.js. In plain text (words, notes, lightning) a fraction is written 3/10; on the screens of this stop it is
   drawn as a real fraction with a bar (the fraction painter in 047g). */
(function (T) {
  'use strict';

  const S = window.MX.s5, F = S.F;
  /* a notes check: the right option is worked out (exactly one option may pass the test) */
  const REL = { '>': 'greater than', '<': 'less than', '=': 'equal to' };
  const NC = (sentence, test) => {
    const opts = /\{([^}]*)\}/.exec(sentence)[1].split('|'), good = opts.filter(o => { try { return test(o); } catch (e) { return false; } });
    if (good.length !== 1) throw new Error('Stop 5 notes check: ' + good.length + ' right options in "' + sentence + '"');
    return { sentence: sentence, answer: good[0] };
  };
  const A = (q, lines, ans, chk, more) => Object.assign({ type: 'ans', q: q, lines: lines, ans: ans, chk: chk }, more || {});

  /* ---------- Lightning: quick questions, made from lists so that every key is worked out (the first answer is right) ---------- */
  const L = [];
  const add = (q, right, w1, w2) => L.push([q, [String(right), String(w1), String(w2)]]);
  const h = s => S.hund(S.V(s));
  // tenths as a percentage
  ['1/10', '3/10', '7/10', '9/10'].forEach(f => add(f + ' as a percentage', h(f) + '%', h(f) / 10 + '%', h(f) / 100 + '%'));
  // halves, quarters and fifths as a percentage (the wrong answers: the digits read as a number)
  [['1/2', 2, 12], ['1/4', 4, 14], ['3/4', 34, 43], ['1/5', 5, 15], ['2/5', 25, 52], ['3/5', 35, 53], ['4/5', 45, 54]].forEach(x => add(x[0] + ' as a percentage', h(x[0]) + '%', x[1] + '%', x[2] + '%'));
  // a percentage as a decimal
  [10, 20, 40, 60, 70, 90].forEach(p => add(p + '% as a decimal', (p / 100).toFixed(1), p / 10, (p / 1000).toFixed(2)));
  // a decimal as a percentage
  ['0.2', '0.3', '0.5', '0.6', '0.8', '0.9'].forEach(d => add(d + ' as a percentage', h(d) + '%', h(d) / 10 + '%', d + '%'));
  // a percentage as a fraction with denominator 100
  [43, 9, 61, 17, 83, 51].forEach(p => add(p + '% as a fraction', p + '/100', p + '/10', '100/' + p));
  // squares shaded on a hundred square
  [64, 38, 5, 92, 71].forEach(n => add(n + ' of 100 squares are shaded. What percentage?', n + '%', n / 10 + '%', 100 - n + '%'));
  // the greater of two (the third answer says they are equal)
  const EQ = 'They are equal';
  [['0.6', '55%'], ['35%', '0.4'], ['0.2', '15%'], ['3/10', '25%'], ['1/2', '0.4'], ['70%', '3/4'], ['0.9', '95%'], ['1/5', '0.3'], ['1/2', '50%'], ['0.8', '4/5']].forEach(p => {
    const s = S.sym(S.V(p[0]), S.V(p[1]));
    add('Which is greater: ' + p[0] + ' or ' + p[1] + '?', s === '=' ? EQ : s === '>' ? p[0] : p[1], s === '=' ? p[0] : s === '>' ? p[1] : p[0], s === '=' ? p[1] : EQ);
  });
  // the smaller of two fractions with the same denominator
  [['3/8', '5/8'], ['7/9', '4/9'], ['2/7', '5/7'], ['5/6', '1/6'], ['9/12', '11/12']].forEach(p => {
    const s = S.sym(S.V(p[0]), S.V(p[1]));
    add('Which is smaller: ' + p[0] + ' or ' + p[1] + '?', s === '<' ? p[0] : p[1], s === '<' ? p[1] : p[0], EQ);
  });
  // the sign that fits
  [['0.4', '40%'], ['0.5', '5%'], ['1/4', '25%'], ['1/5', '5%'], ['7/10', '0.7'], ['0.1', '1%'], ['3/4', '70%'], ['9/10', '99%'], ['2/5', '0.5']].forEach(p => {
    const s = S.sym(S.V(p[0]), S.V(p[1])), rest = ['<', '>', '='].filter(x => x !== s);
    add(p[0] + ' ▢ ' + p[1], s, rest[0], rest[1]);
  });
  // a fraction of the hundred square, in squares
  [['1/4', 4, 40], ['1/5', 5, 50], ['1/2', 2, 20], ['1/10', 1, 100], ['3/10', 3, 13]].forEach(x => add('How many squares is ' + x[0] + ' of a hundred square?', h(x[0]), x[1], x[2]));
  // the part that is not shaded
  [30, 45, 80, 62].forEach(p => add(p + '% is shaded. What is not shaded?', 100 - p + '%', p + '%', 110 - p + '%'));

  T.packs[5] = {
    n: 5,
    title: "Fractions, decimals and percentages",
    los: ["5Nf.04", "5Nf.07", "5Nf.08"],
    blurb: {
      en: "Match *fractions*, *decimals* and *percentages*. Compare and order them.",
      vi: "Tìm *phân số*, *số thập phân* và *tỉ số phần trăm* bằng nhau. So sánh và sắp xếp các số đó."
    },
    // Words: 9 picture cards in 3 sets (pictures: 017w_g4-art-s5.js).
    words: {
      sets: [
        { id: 'A', title: { en: 'Percentages', vi: 'Tỉ số phần trăm' }, keys: ['percentage', 'hundred square', 'whole'] },
        { id: 'B', title: { en: 'The same value', vi: 'Cùng một giá trị' }, keys: ['equivalent', 'convert', 'quarter'] },
        { id: 'C', title: { en: 'Compare and order', vi: 'So sánh và sắp xếp' }, keys: ['compare', 'order', 'greatest'] }
      ],
      items: {
        'percentage': { art: 'w-s5-percentage', vi: 'tỉ số phần trăm (%)', def: 'A number of parts out of 100. 30% means 30 out of 100.' },
        'hundred square': { art: 'w-s5-hundred-square', vi: 'bảng 100 ô vuông', def: 'A square made of 100 equal small squares. One small square is 1%.' },
        'whole': { art: 'w-s5-whole', vi: 'toàn bộ, cả hình', def: 'All of something. The whole shape is 100 out of 100, or 100%.' },
        'equivalent': { art: 'w-s5-equivalent', vi: 'tương đương (có giá trị bằng nhau)', def: 'Equal in value. 1/2, 0.5 and 50% are equivalent.' },
        'convert': { art: 'w-s5-convert', vi: 'đổi', def: 'To change a number to another form. Convert 0.7 to a percentage: 70%.' },
        'quarter': { art: 'w-s5-quarter', vi: 'một phần tư', def: 'One of 4 equal parts of a whole. One quarter is 1/4, or 25%.' },
        'compare': { art: 'w-s5-compare', vi: 'so sánh', def: 'To find which number is greater. Compare 0.6 and 45%: 0.6 is greater.' },
        'order': { art: 'w-s5-order', vi: 'sắp xếp theo thứ tự', def: 'To put numbers in a line by size. In order: 20%, 0.5, 3/4.' },
        'greatest': { art: 'w-s5-greatest', vi: 'lớn nhất', def: 'The biggest in value. The greatest of 0.3, 1/2 and 80% is 80%.' }
      }
    },
    // See it: one challenge scene, 5 picture-led questions (hundred squares, the equivalence strip, fraction bars).
    see: {
      scenes: [
        { id: 'challenge', title: { en: 'Look and answer', vi: 'Nhìn và trả lời' },
          challenge: {
            end: { en: 'You did it! You can see percentages in pictures.', vi: 'Em làm được rồi! Em đã nhận ra tỉ số phần trăm trên hình.' },
            result: 'You read and shaded hundred squares, and matched fractions, decimals and percentages.',
            rounds: [
              { mode: "our", lo: ["5Nf.07"], twm: ["TWM.05"], v: [
                { type: 's5grid', n: 40, style: 'rows' }, { type: 's5grid', n: 70, style: 'cols' }, { type: 's5grid', n: 20, style: 'rows' }] },
              { mode: "our", lo: ["5Nf.04"], twm: ["TWM.05"], v: [
                { type: 's5shade', want: '3/10' }, { type: 's5shade', want: '7/10' }, { type: 's5shade', want: '1/2' }] },
              { mode: "your", lo: ["5Nf.07"], twm: ["TWM.05"], v: [
                { type: 's5grid', n: 45, style: 'block', ask: 'pf' }, { type: 's5grid', n: 62, style: 'rows', ask: 'pf' }, { type: 's5grid', n: 38, style: 'cols', ask: 'pf' }] },
              { mode: "your", lo: ["5Nf.04"], twm: ["TWM.02"], v: [
                { type: 's5conv', q: "Look at the number line. Write the missing numbers.", rows: [['0.6', 'pct'], ['0.6', 'n10']], fig: { k: 's5line' } },
                { type: 's5conv', q: "Look at the number line. Write the missing numbers.", rows: [['0.9', 'pct'], ['0.9', 'n10']], fig: { k: 's5line' } },
                { type: 's5conv', q: "Look at the number line. Write the missing numbers.", rows: [['0.2', 'pct'], ['0.2', 'n10']], fig: { k: 's5line' } }] },
              { mode: "your", lo: ["5Nf.08"], twm: ["TWM.04"], v: [
                { type: 's5cmp', rows: [['3/8', '5/8'], ['0.4', '30%']], pic: true },
                { type: 's5cmp', rows: [['5/6', '4/6'], ['0.5', '60%']], pic: true },
                { type: 's5cmp', rows: [['2/7', '6/7'], ['0.8', '70%']], pic: true }] }] } }]
    },
    // Practise: Draw it (pictures: choose the grid, shade, two shadings, the number line, tiles in order), then Solve it (like the test).
    practise: [
      { id: 's5r', kit: 'model', game: 'r', surface: 'board', art: 'icon-step-practise',
        title: 'Draw it', blurb: { en: 'Hundred squares, number lines and tiles in order.', vi: 'Bảng 100 ô vuông, tia số và xếp thẻ số theo thứ tự.' },
        levels: [
          { title: { en: "Hundred squares", vi: "Bảng 100 ô vuông" }, rounds: [
            { mode: "our", lo: ["5Nf.07"], twm: ["TWM.05"], v: [
              { type: 's5pickgrid', show: '30%', wrong: [3, 13, 70], at: 2 },
              { type: 's5pickgrid', show: '45%', wrong: [54, 5, 40], styles: ['block', 'rows', 'rows', 'block'], at: 0 },
              { type: 's5pickgrid', show: '8%', wrong: [80, 18, 92], at: 3 }] },
            { mode: "your", lo: ["5Nf.04"], twm: ["TWM.05"], v: [
              { type: 's5shade', want: '1/4' }, { type: 's5shade', want: '2/5' }, { type: 's5shade', want: '3/4' }] },
            { mode: "your", lo: ["5Nf.07", "5Nf.04"], twm: ["TWM.01"], v: [
              { type: 's5two', who: 'Vy', first: '1/5', more: 12, show: 'first' },
              { type: 's5two', who: 'Khoa', he: true, first: '1/2', more: 8, show: 'first' },
              { type: 's5two', who: 'Trang', first: '3/10', more: 25, show: 'first' }] }] },
          { title: { en: "Lines and tiles", vi: "Tia số và thẻ số" }, rounds: [
            { mode: "your", lo: ["5Nf.04"], twm: ["TWM.02"], v: [
              { type: 's5conv', q: "Use the number line. Write " + F(4, 5) + " as a [[percentage]] and as a decimal.", rows: [['4/5', 'pct'], ['4/5', 'dec']], fig: { k: 's5line' }, tip: "One fifth is the same as two tenths. Find " + F(8, 10) + " on the line." },
              { type: 's5conv', q: "Use the number line. Write " + F(1, 5) + " as a [[percentage]] and as a decimal.", rows: [['1/5', 'pct'], ['1/5', 'dec']], fig: { k: 's5line' }, tip: "One fifth is the same as two tenths. Find " + F(2, 10) + " on the line." },
              { type: 's5conv', q: "Use the number line. Write " + F(3, 5) + " as a [[percentage]] and as a decimal.", rows: [['3/5', 'pct'], ['3/5', 'dec']], fig: { k: 's5line' }, tip: "One fifth is the same as two tenths. Find " + F(6, 10) + " on the line." }] },
            { mode: "your", lo: ["5Nf.08"], twm: ["TWM.05"], v: [
              { type: 's5order', vals: ['0.6', '1/2', '45%', '0.7'] },
              { type: 's5order', vals: ['30%', '0.2', '2/5', '15%'] },
              { type: 's5order', vals: ['0.9', '3/4', '80%', '0.7'] }] }] }] },
      { id: 's5a', kit: 'model', game: 'a', surface: 'paper', art: 'icon-step-test',
        title: 'Solve it', blurb: { en: 'Answer questions like the test.', vi: 'Trả lời câu hỏi giống bài kiểm tra.' },
        levels: [
          { title: { en: "Change the form", vi: "Đổi dạng của số" }, rounds: [
            { mode: "your", lo: ["5Nf.04"], twm: ["TWM.05"], v: [
              { type: 's5conv', rows: [['7/10', 'pct'], ['1/4', 'pct']] },
              { type: 's5conv', rows: [['3/10', 'pct'], ['1/5', 'pct']] },
              { type: 's5conv', rows: [['9/10', 'pct'], ['3/4', 'pct']] }] },
            { mode: "your", lo: ["5Nf.04", "5Nf.07"], twm: ["TWM.05"], v: [
              { type: 's5conv', q: "Write <b>60%</b> as a decimal. Write <b>43%</b> as a fraction with denominator 100.", rows: [['60%', 'dec'], ['43%', 'f100']] },
              { type: 's5conv', q: "Write <b>20%</b> as a decimal. Write <b>9%</b> as a fraction with denominator 100.", rows: [['20%', 'dec'], ['9%', 'f100']] },
              { type: 's5conv', q: "Write <b>90%</b> as a decimal. Write <b>71%</b> as a fraction with denominator 100.", rows: [['90%', 'dec'], ['71%', 'f100']] }] },
            { mode: "your", lo: ["5Nf.07", "5Nf.04"], twm: ["TWM.01"], v: [
              { type: 's5two', who: 'Khoi', he: true, first: '1/4', more: 15 },
              { type: 's5two', who: 'Yen', first: '1/5', more: 9 },
              { type: 's5two', who: 'Phong', he: true, first: '1/2', more: 16 }] }] },
          { title: { en: "Compare and decide", vi: "So sánh và nhận xét" }, rounds: [
            { mode: "your", lo: ["5Nf.08"], twm: ["TWM.05"], v: [
              { type: 's5cmp', rows: [['0.9', '85%'], ['1/2', '0.5'], ['3/5', '4/5']] },
              { type: 's5cmp', rows: [['0.2', '25%'], ['3/4', '75%'], ['8/9', '5/9']] },
              { type: 's5cmp', rows: [['40%', '0.3'], ['1/10', '0.1'], ['2/6', '5/6']] }] },
            { mode: "your", lo: ["5Nf.04"], twm: ["TWM.07", "TWM.04"], v: [
              { type: "claim", who: "Hieu", ok: false, at: 1, s5says: ['0.3', '=', '3%'], s5: [['0.3', '=', '30%']],
                says: "0.3 is the same as 3%.",
                reasons: [
                  { t: "0.3 is 3 tenths. That is 30 hundredths, so 0.3 = 30%." },
                  { t: "0.3 and 3% both have the digit 3.", why: "The digit is the same, but the place is not. 3 tenths is not 3 hundredths." },
                  { t: "3% means 3 out of 10.", why: "Per cent means out of 100. 3% is 3 out of 100." }],
                hint: { pic: { k: 's5line', marks: ['0.3'] }, step: "0.3 is 3 tenths. How many hundredths is that?" },
                worked: "0.3 is 3 tenths. 3 tenths = 30 hundredths = 30%. 3% is only 3 hundredths.",
                model: "Hieu is incorrect because 0.3 is 3 tenths, which is 30 hundredths. So 0.3 = 30%." },
              { type: "claim", who: "Nhi", ok: true, at: 0, s5says: ['3/4', '=', '75%'], s5: [['1/4', '=', '25%'], ['1/2', '=', '50%']],
                says: F(3, 4) + " is the same as 75%.",
                reasons: [
                  { t: "one quarter of 100 is 25, so three quarters is 3 × 25 = 75 hundredths." },
                  { t: "3 + 4 = 7, and 75 starts with 7.", why: "Do not add the digits. Find three quarters of 100." },
                  { t: "every fraction is the same as 75%.", why: "No: " + F(1, 2) + " is 50%. Work out three quarters of 100." }],
                hint: { pic: { k: 's5grid', n: 75, style: 'block', size: 'm' }, step: "Find one quarter of 100 first. Then find three quarters." },
                worked: "One quarter of 100 is 100 ÷ 4 = 25. Three quarters is 3 × 25 = 75. So " + F(3, 4) + " = " + F(75, 100) + " = 75%.",
                model: "Nhi is correct because one quarter of 100 is 25, so three quarters is 75 out of 100." },
              { type: "claim", who: "Son", ok: false, at: 2, s5says: ['1/5', '=', '5%'], s5: [['1/5', '=', '20%']],
                says: F(1, 5) + " is the same as 5%.",
                reasons: [
                  { t: "one fifth of 100 is 100 ÷ 5 = 20, so " + F(1, 5) + " = 20%." },
                  { t: "the denominator 5 tells you the percentage.", why: "The denominator tells you how many equal parts make the whole. 100 ÷ 5 = 20." },
                  { t: F(1, 5) + " is 15%.", why: "Do not join the digits 1 and 5. Share 100 into 5 equal parts." }],
                hint: { pic: { k: 's5grid', n: 20, style: 'cols', size: 'm' }, step: "Share 100 squares into 5 equal parts. How many squares are in one part?" },
                worked: "One fifth means 1 of 5 equal parts. 100 ÷ 5 = 20, so " + F(1, 5) + " = " + F(20, 100) + " = 20%. 5% is only 5 out of 100.",
                model: "Son is incorrect because one fifth of 100 is 20, so one fifth is 20%, not 5%." }] }] }] }
    ],
    // Notes: how to do it, each with a worked example and a picture; then one gap sentence per note, in the same order.
    notes: {
      items: [
        { en: 'A [[percentage]] is a number of parts out of 100. On a [[hundred square]], one small square is 1%.',
          vi: 'Tỉ số phần trăm cho biết có bao nhiêu phần trong 100 phần bằng nhau. Trên bảng 100 ô vuông, mỗi ô nhỏ là 1%.',
          example: ['35 squares out of 100 are shaded.', '35 out of 100 = 35/100 = *35%*.', 'The [[whole]] square is 100%.'],
          pic: { k: 's5grid', n: 35, style: 'rows' } },
        { en: 'A fraction, a decimal and a percentage can be [[equivalent]]: the same value, written in three ways.',
          vi: 'Phân số, số thập phân và tỉ số phần trăm có thể bằng nhau: cùng một giá trị, viết theo ba cách.',
          example: ['1/10 = 0.1 = 10%', '7/10 = 0.7 = *70%*', '1/2 = 0.5 = 50%'],
          pic: { k: 's5line', marks: ['7/10'] } },
        { en: 'To [[convert]] a fraction to a percentage, find the equal fraction with denominator 100.',
          vi: 'Để đổi phân số sang tỉ số phần trăm, hãy tìm phân số bằng nó có mẫu số là 100.',
          example: ['100 ÷ 4 = 25, so 1/4 = 25/100 = 25%.', '100 ÷ 5 = 20, so 1/5 = 20/100 = 20%.', '3/5 = 3 × 20% = *60%*.'],
          pic: [{ k: 's5grid', n: 25, style: 'block', size: 'm', cap: '1/4 = 25%' }, { k: 's5grid', n: 20, style: 'cols', size: 'm', cap: '1/5 = 20%' }] },
        { en: 'Be careful: 0.5 is 5 tenths, not 5%. One tenth is 10 hundredths, so multiply the tenths by 10.',
          vi: 'Cẩn thận: 0.5 là 5 phần mười, không phải 5%. Một phần mười bằng mười phần trăm (10/100), nên em nhân số phần mười với 10.',
          example: ['0.5 = 5/10 = 50/100 = *50%*.', '5% = 5/100. That is much smaller.', '30% = 30/100 = 3/10 = 0.3'],
          pic: [{ k: 's5grid', n: 50, style: 'rows', size: 'm', cap: '0.5 = 50%' }, { k: 's5grid', n: 5, style: 'rows', size: 'm', cap: '5%' }] },
        { en: 'To [[compare]] fractions with the same denominator, compare the numerators.',
          vi: 'Để so sánh hai phân số có cùng mẫu số, hãy so sánh các tử số.',
          example: ['4/7 and 6/7 are both sevenths: the parts are the same size.', '4 is less than 6, so 4/7 *<* 6/7.'],
          pic: { k: 's5bars', den: 7, nums: [4, 6] } },
        { en: 'To [[order]] fractions, decimals and percentages, change every number to a percentage first.',
          vi: 'Để sắp xếp phân số, số thập phân và tỉ số phần trăm, trước hết hãy đổi tất cả sang tỉ số phần trăm.',
          example: ['Order 0.4, 1/2 and 35%.', '0.4 = 40% and 1/2 = 50%.', 'Smallest first: *35%, 0.4, 1/2*.'],
          pic: [{ k: 's5grid', n: 35, style: 'rows', size: 'm', cap: '35%' }, { k: 's5grid', n: 40, style: 'rows', size: 'm', cap: '0.4 = 40%' }, { k: 's5grid', n: 50, style: 'rows', size: 'm', cap: '1/2 = 50%' }] }
      ],
      check: [
        NC('48 squares of a hundred square are shaded. That is {48%|4.8%|52%}.', o => S.sym(S.V(o), S.V('48/100')) === '='),
        NC('9/10 = 0.9 = {90%|9%|19%}.', o => S.sym(S.V(o), S.V('9/10')) === '=' && S.sym(S.V(o), S.V('0.9')) === '='),
        NC('2/5 = {40%|25%|20%}.', o => S.sym(S.V(o), S.V('2/5')) === '='),
        NC('0.3 = {30%|3%|13%}.', o => S.sym(S.V(o), S.V('0.3')) === '='),
        NC('5/8 is {greater than|less than|equal to} 3/8.', o => o === REL[S.sym(S.V('5/8'), S.V('3/8'))]),
        NC('The greatest of 0.6, 1/2 and 65% is {65%|0.6|1/2}.', o => ['0.6', '1/2', '65%'].every(x => S.sym(S.V(o), S.V(x)) !== '<'))
      ]
    },
    // Mini Practice test: 10 questions, easy to hard, DOK 1, 1, 1, 1, 2, 2, 2, 2, 2, 3; three sets of numbers each.
    test: {
      items: [
        { dok: 1, lo: ["5Nf.04"], twm: ["TWM.05"], v: [
          { type: 's5conv', rows: [['3/10', 'pct'], ['1/2', 'pct']] },
          { type: 's5conv', rows: [['7/10', 'pct'], ['1/4', 'pct']] },
          { type: 's5conv', rows: [['9/10', 'pct'], ['1/5', 'pct']] }
        ] },
        { dok: 1, lo: ["5Nf.04"], twm: ["TWM.05"], v: [
          { type: 's5conv', rows: [['40%', 'dec'], ['90%', 'dec']] },
          { type: 's5conv', rows: [['20%', 'dec'], ['50%', 'dec']] },
          { type: 's5conv', rows: [['80%', 'dec'], ['10%', 'dec']] }
        ] },
        { dok: 1, lo: ["5Nf.07"], twm: ["TWM.05"], v: [
          { type: 's5grid', n: 56, style: 'rows' },
          { type: 's5grid', n: 43, style: 'cols' },
          { type: 's5grid', n: 68, style: 'rows' }
        ] },
        { dok: 1, lo: ["5Nf.07"], twm: ["TWM.05"], v: [
          { type: 's5conv', rows: [['37%', 'f100']] },
          { type: 's5conv', rows: [['61%', 'f100']] },
          { type: 's5conv', rows: [['9%', 'f100']] }
        ] },
        { dok: 2, lo: ["5Nf.08"], twm: ["TWM.05"], v: [
          { type: 's5cmp', rows: [['0.8', '75%'], ['2/5', '0.4'], ['5/7', '3/7']] },
          { type: 's5cmp', rows: [['0.3', '35%'], ['1/2', '0.5'], ['2/9', '5/9']] },
          { type: 's5cmp', rows: [['60%', '0.9'], ['3/4', '75%'], ['7/8', '3/8']] }
        ] },
        { dok: 2, lo: ["5Nf.07", "5Nf.04"], twm: ["TWM.01"], v: [
          { type: 's5pickgrid', show: '1/5', wrong: [5, 15, 50], at: 1 },
          { type: 's5pickgrid', show: '3/4', wrong: [34, 43, 25], styles: ['block', 'rows', 'rows', 'block'], at: 3 },
          { type: 's5pickgrid', show: '2/5', wrong: [25, 20, 4], at: 0 }
        ] },
        { dok: 2, lo: ["5Nf.07", "5Nf.04"], twm: ["TWM.01"], v: [
          { type: 's5two', who: 'Chi', first: '1/4', more: 12 },
          { type: 's5two', who: 'Duy', he: true, first: '1/5', more: 14 },
          { type: 's5two', who: 'Lan', first: '3/10', more: 18 }
        ] },
        { dok: 2, lo: ["5Nf.08"], twm: ["TWM.05"], v: [
          { type: 's5order', vals: ['0.5', '2/5', '45%', '0.7'] },
          { type: 's5order', vals: ['1/4', '0.3', '20%', '0.6'] },
          { type: 's5order', vals: ['3/10', '0.8', '7/10', '75%'] }
        ] },
        { dok: 2, lo: ["5Nf.04"], twm: ["TWM.01"], v: [
          A("At a pho shop, <b>" + F(3, 5) + "</b> of the bowls are beef pho. The rest are chicken pho. What [[percentage]] of the bowls are chicken pho?", ["{0} %"], [40], ["100-3*100/5"],
            { tip: "First write " + F(3, 5) + " as a percentage. The whole is 100%.", pic: { k: 's5grid', n: 60, style: 'cols', size: 'm' },
              worked: "One fifth is 20%, so " + F(3, 5) + " = 60% are beef pho. The whole is 100%. 100% − 60% = 40% are chicken pho.",
              slips: [[60, "60% is the beef pho. The question asks for the rest: 100% − 60%."], [35, "Do not write the digits 3 and 5. One fifth of 100 is 20."], [97, "Change the fraction to a percentage first: one fifth is 20%."]] }),
          A("On a bus, <b>0.7</b> of the seats are full. The other seats are empty. What [[percentage]] of the seats are empty?", ["{0} %"], [30], ["100-0.7*100"],
            { tip: "First write 0.7 as a percentage. The whole is 100%.", pic: { k: 's5line', marks: ['0.7'] },
              worked: "0.7 is 7 tenths = 70 hundredths, so 70% of the seats are full. 100% − 70% = 30% are empty.",
              slips: [[70, "70% is the part that is full. The question asks for the empty seats: 100% − 70%."], [93, "0.7 is not 7%. It is 7 tenths, so it is 70%."], [3, "0.3 of the seats are empty. Write 0.3 as a percentage: 3 tenths = 30 hundredths."]] }),
          A("A football team scores with <b>" + F(1, 4) + "</b> of its shots. What [[percentage]] of its shots do <b>not</b> score?", ["{0} %"], [75], ["100-100/4"],
            { tip: "First write " + F(1, 4) + " as a percentage. The whole is 100%.", pic: { k: 's5grid', n: 25, style: 'block', size: 'm' },
              worked: "One quarter of 100 is 25, so " + F(1, 4) + " = 25% of the shots score. 100% − 25% = 75% do not score.",
              slips: [[25, "25% is the part that scores. The question asks for the shots that do not score: 100% − 25%."], [96, "One quarter is not 4%. One quarter of 100 is 100 ÷ 4 = 25."], [86, "Do not write the digits 1 and 4. One quarter of 100 is 25."]] })
        ] },
        { dok: 3, lo: ["5Nf.04", "5Nf.08"], twm: ["TWM.07", "TWM.04"], v: [
          { type: "claim", who: "Tu", ok: false, at: 1, s5rule: 'digitPct', s5: [['0.3', '=', '30%'], ['0.3', '!=', '3%'], ['0.5', '=', '50%']],
            ctx: "Tu writes decimals as percentages.",
            says: "To write a decimal as a percentage, just write % after its digit. So 0.3 is 3%.",
            reasons: [
              { t: "0.3 is 3 tenths. That is 30 hundredths, so 0.3 is 30%, not 3%." },
              { t: "0.3 and 3% both have the digit 3.", why: "The digit is the same, but the place is not. 3 tenths is not 3 hundredths." },
              { t: "a decimal can never be written as a percentage.", why: "It can: 0.5 is 50%. Change the tenths to hundredths." }],
            hint: { pic: { k: 's5line', marks: ['0.3'] }, step: "Try the rule with 0.3. How many hundredths is 3 tenths?" },
            worked: "0.3 is 3 tenths = 30 hundredths = 30%. The rule gives 3%, which is only 3 hundredths. So the rule is wrong: multiply the tenths by 10.",
            model: "Tu is incorrect because 0.3 is 3 tenths, which is 30 hundredths. So 0.3 = 30%, not 3%." },
          { type: "claim", who: "Truc", ok: true, at: 0, s5rule: 'sameDen', s5: [['7/9', '>', '5/9'], ['5/9', '>', '2/9']],
            ctx: "Truc compares " + F(2, 9) + ", " + F(5, 9) + " and " + F(7, 9) + ".",
            says: "When two fractions have the same denominator, the one with the greater numerator is greater.",
            reasons: [
              { t: "the parts are the same size, so more parts make a greater fraction. For example, " + F(7, 9) + " is greater than " + F(5, 9) + "." },
              { t: "a greater numerator makes a greater fraction with any denominators.", why: "Truc's rule is only for fractions with the same denominator. Then the parts are the same size, so more parts is more." },
              { t: "9 is the greatest digit.", why: "The 9 only tells you that the parts are ninths. Compare how many parts each fraction has." }],
            hint: { pic: { k: 's5bars', den: 9, nums: [2, 5, 7] }, step: "Ninths are all the same size. Which fraction has the most ninths?" },
            worked: "All three fractions are ninths, so the parts are the same size. 2 parts < 5 parts < 7 parts, so " + F(2, 9) + " < " + F(5, 9) + " < " + F(7, 9) + ". More parts of the same size is always more.",
            model: "Truc is correct because the parts are the same size, so more parts make a greater fraction." },
          { type: "claim", who: "Thinh", ok: false, at: 2, s5rule: 'pctOverDec', s5: [['0.9', '>', '60%'], ['0.9', '=', '90%']],
            ctx: "Thinh compares <b>60%</b> and <b>0.9</b>.",
            says: "A percentage is always greater than a decimal, because its number is bigger: 60 is more than 0.9.",
            reasons: [
              { t: "0.9 is 90 hundredths and 60% is 60 hundredths, so 0.9 is greater than 60%." },
              { t: "60 is greater than 0.9, so 60% is greater than 0.9.", why: "60% is not 60. It is 60 hundredths. Change 0.9 to hundredths too." },
              { t: "a percentage and a decimal can never be compared.", why: "They can. Change both to hundredths: 0.9 = 90 hundredths." }],
            hint: { pic: { k: 's5line', marks: ['0.9', '60%'] }, step: "Change both numbers to hundredths. Then compare." },
            worked: "60% is 60 hundredths. 0.9 is 9 tenths = 90 hundredths = 90%. 90 is more than 60, so 0.9 is greater than 60%. One example is enough to show the rule is wrong.",
            model: "Thinh is incorrect because 0.9 is 90 hundredths and 60% is only 60 hundredths, so 0.9 is greater." }
        ] }
      ]
    },
    // Lightning round: 60 seconds of quick questions with three answers (the first is right); the list is made above.
    lightning: { secs: 60, items: L },
    // My self-check: "I can ..." goals; again = the step to practise again (c = See it, r = Draw it, a = Solve it).
    selfcheck: {
      goals: ["write a fraction or a decimal as a percentage", "say what percentage of a 100-square shape is shaded", "write a percentage as a fraction with denominator 100", "compare and order fractions, decimals and percentages"],
      again: ["a", "c", "a", "r"]
    }
  };
})(window.T = window.T || {});
