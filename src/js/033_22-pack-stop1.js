/* 22-pack-stop1.js - ALL the content of Stop 1, Decimals and place value (Grade 4, Stage 5).
   Parts: words, see, practise, notes, test, lightning, selfcheck.
   Objectives: 5Np.01 (the value of each digit: tenths and hundredths), 5Np.04 (compose, decompose and regroup),
   5Np.05 (round a number with one decimal place to the nearest whole number).
   The models that work their answers out in code are in 009d_g4-models-s1.js (s1val, s1read, s1build, s1way, s1near,
   s1round, s1ring, s1ends); the pictures (s1chart, s1line, s1grid) and the two tools in 047g_g4-pics-s1.js; the word
   card pictures in 017w_g4-art-s1.js. Typed `ans` questions carry chk, so tools/keys.js works each key out again. */
(function (T) {
  'use strict';

  const A = (q, lines, ans, chk, more) => Object.assign({ type: 'ans', q: q, lines: lines, ans: ans, chk: chk, dec: true, w: 'mid' }, more || {});   // 'mid': short lines that fit a phone
  const TIP_REGROUP = '10 tenths make 1 one. 10 hundredths make 1 tenth. You can also change 1 one into 10 tenths.';

  /* ---- Lightning round: made from short lists, so every key is worked out, never typed by hand ---- */
  const PLACE = ['tens', 'ones', 'tenths', 'hundredths'];
  const light = [];
  // the value of a digit: [number, digit, its place (0 tens, 1 ones, 2 tenths, 3 hundredths), two wrong places]
  [['4.72', 7, 2, 1, 3], ['6.19', 9, 3, 2, 1], ['8.35', 8, 1, 2, 0], ['2.64', 6, 2, 3, 1], ['5.08', 8, 3, 2, 1], ['31.6', 3, 0, 1, 2],
    ['9.27', 2, 2, 3, 1], ['7.53', 3, 3, 2, 1], ['14.9', 4, 1, 0, 2], ['3.81', 8, 2, 1, 3], ['6.45', 5, 3, 2, 1], ['52.3', 5, 0, 1, 2],
    ['1.96', 9, 2, 3, 1], ['4.07', 7, 3, 2, 1]].forEach(function (x) {
    const s = String(x[0]).replace('.', ''), at = s.length === 3 && String(x[0]).indexOf('.') === 1 ? 1 : 0;   // the place of the first digit
    if (+s[x[2] - at] !== x[1]) throw new Error('lightning: the ' + x[1] + ' in ' + x[0] + ' is not in the ' + PLACE[x[2]]);
    light.push(['Value of the ' + x[1] + ' in ' + x[0], [x[1] + ' ' + PLACE[x[2]], x[1] + ' ' + PLACE[x[3]], x[1] + ' ' + PLACE[x[4]]]]);
  });
  // round to the nearest whole number
  [6.3, 2.8, 9.5, 4.1, 7.6, 3.4, 8.9, 5.5, 1.2, 12.7, 10.4, 6.5, 15.8, 2.3, 19.6, 4.9].forEach(function (n) {
    const t = Math.round(n * 10), lo = Math.floor(t / 10), to = Math.floor((t + 5) / 10), other = to === lo ? lo + 1 : lo;
    light.push(['Round ' + n.toFixed(1) + ' to the nearest whole number', [String(to), String(other), String(to === lo ? lo - 1 : lo + 2)]]);
  });
  // compose: ones + tenths + hundredths
  [[5, 6, 2], [3, 1, 8], [7, 4, 5], [2, 9, 3], [6, 2, 7], [9, 5, 1], [4, 3, 6], [8, 7, 4], [1, 8, 9], [3, 6, 5]].forEach(function (p) {
    const h = p[0] * 100 + p[1] * 10 + p[2];
    light.push([p[0] + ' + 0.' + p[1] + ' + 0.0' + p[2], [(h / 100).toFixed(2), String((p[0] * 10 + p[1] + p[2]) / 10), (h / 10).toFixed(1)]]);
  });
  // regroup: tenths and hundredths as a decimal
  [14, 23, 31, 45, 52, 68, 76, 19].forEach(function (n) { light.push([n + ' tenths', [(n / 10).toFixed(1), String(n), (n / 100).toFixed(2)]]); });
  [23, 41, 57, 86].forEach(function (n) { light.push([n + ' hundredths', [(n / 100).toFixed(2), (n / 10).toFixed(1), String(n)]]); });
  // which digit is in a place?
  [['8.25', 2, 5, 8], ['3.94', 9, 4, 3], ['6.07', 0, 7, 6], ['1.58', 5, 8, 1]].forEach(function (x) { light.push(['Tenths digit of ' + x[0], [String(x[1]), String(x[2]), String(x[3])]]); });
  [['7.31', 1, 3, 7], ['2.86', 6, 8, 2], ['9.40', 0, 4, 9], ['5.13', 3, 1, 5]].forEach(function (x) { light.push(['Hundredths digit of ' + x[0], [String(x[1]), String(x[2]), String(x[3])]]); });

  T.packs[1] = {
    n: 1,
    title: "Decimals and place value",
    los: ["5Np.01", "5Np.04", "5Np.05"],
    blurb: {
      en: "Say the value of each *digit* in a decimal. Regroup and *round* decimals.",
      vi: "Nói giá trị của từng *chữ số* trong số thập phân. Đổi hàng và *làm tròn* số thập phân."
    },
    // Words: 9 picture cards in three sets (the pictures: 017w_g4-art-s1.js).
    words: {
      sets: [
        { id: 'A', title: { en: 'Decimal places', vi: 'Các hàng thập phân' }, keys: ['decimal point', 'tenth', 'hundredth'] },
        { id: 'B', title: { en: 'Value and parts', vi: 'Giá trị và các phần' }, keys: ['place value', 'decompose', 'regroup'] },
        { id: 'C', title: { en: 'Rounding', vi: 'Làm tròn số' }, keys: ['whole number', 'round', 'nearest'] }
      ],
      items: {
        'decimal point': { art: 'w-decimal-point', vi: 'dấu thập phân', def: 'The dot in a decimal. It sits between the ones and the tenths: 4.7.' },
        'tenth': { art: 'w-tenth', vi: 'một phần mười', def: 'One of 10 equal parts of one whole. One tenth is 0.1. In 4.7 the digit 7 is 7 tenths.' },
        'hundredth': { art: 'w-hundredth', vi: 'một phần trăm', def: 'One of 100 equal parts of one whole. One hundredth is 0.01. 10 hundredths make 1 tenth.' },
        'place value': { art: 'w-place-value', vi: 'giá trị theo hàng', def: 'The value a digit has because of its place. In 2.58 the 5 is 5 tenths, or 0.5.' },
        'decompose': { art: 'w-decompose', vi: 'tách số', def: 'To split a number into parts. 6.29 = 6 + 0.2 + 0.09.' },
        'regroup': { art: 'w-regroup', vi: 'gộp nhóm, đổi hàng', def: 'To swap 10 of one place for 1 of the next. 10 tenths make 1 one, so 13 tenths = 1.3.' },
        'whole number': { art: 'w-whole-number', vi: 'số tự nhiên', def: 'A number with no decimal part and no fraction. 7 and 12 are whole numbers. 3.5 is not.' },
        'round': { art: 'w-round', vi: 'làm tròn', def: 'To change a number to a simpler number that is near it. 6.8 rounds to 7.' },
        'nearest': { art: 'w-nearest', vi: 'gần nhất', def: 'The closest. 2.3 is between 2 and 3. The nearest whole number is 2.' }
      }
    },
    // See it: one challenge scene, 5 picture-led rounds (the chart, the hundred squares, counters to regroup, the line).
    see: {
      scenes: [
        { id: 'challenge', title: { en: 'Look and answer', vi: 'Nhìn và trả lời' },
          challenge: {
            end: { en: 'You did it! You can read and round decimals.', vi: 'Em làm được rồi! Em đọc và làm tròn được số thập phân.' },
            result: 'You read tenths and hundredths in pictures and rounded on a number line.',
            rounds: [
              { mode: "our", lo: ["5Np.01"], twm: ["TWM.05"], v: [
                { type: 's1val', n: '5.38', d: 8, as: 'words', chart: true, at: 1 },
                { type: 's1val', n: '2.61', d: 6, as: 'words', chart: true, at: 0 },
                { type: 's1val', n: '9.04', d: 4, as: 'words', chart: true, at: 3 }] },
              { mode: "our", lo: ["5Np.04"], twm: ["TWM.05"], v: [
                { type: 's1read', pic: 'grid', c: [0, 1, 2, 6] },
                { type: 's1read', pic: 'grid', c: [0, 0, 5, 3] },
                { type: 's1read', pic: 'grid', c: [0, 1, 0, 7] }] },
              { mode: "your", lo: ["5Np.04"], twm: ["TWM.05"], v: [
                { type: 's1read', pic: 'chart', c: [0, 1, 13, 0] },
                { type: 's1read', pic: 'chart', c: [0, 3, 12, 0] },
                { type: 's1read', pic: 'chart', c: [0, 2, 4, 15] }] },
              { mode: "your", lo: ["5Np.05"], twm: ["TWM.05"], v: [
                { type: 's1near', n: '3.7', unit: 'kg', text: "A bag of rice weighs <b>3.7</b> kg. Which whole number of kilograms is it nearer to?" },
                { type: 's1near', n: '8.2', unit: 'cm', text: "A leaf is <b>8.2</b> cm long. Which whole number of centimetres is it nearer to?" },
                { type: 's1near', n: '5.5', unit: 'litres', text: "A bucket holds <b>5.5</b> litres. That is halfway. Which whole number does it round to?" }] },
              { mode: "your", lo: ["5Np.05"], twm: ["TWM.06"], v: [
                { type: 's1ring', to: 6, nums: [5.3, 5.5, 6.4, 6.5, 5.8], line: true },
                { type: 's1ring', to: 3, nums: [2.4, 2.6, 3.5, 3.2, 2.5], line: true },
                { type: 's1ring', to: 9, nums: [8.5, 9.4, 9.6, 8.1, 9.1], line: true }] }] } }]
    },
    // Practise: Draw it (counters in the chart, the rounding line) then Solve it (like the test).
    practise: [
      { id: 's1r', kit: 'model', game: 'r', surface: 'board', art: 'icon-step-practise',
        title: 'Draw it', blurb: { en: 'Draw counters in the chart. Round on a number line.', vi: 'Vẽ hạt tính vào bảng. Làm tròn trên trục số.' },
        levels: [
          { title: { en: "Counters in the chart", vi: "Hạt tính trong bảng" }, rounds: [
            { mode: "our", lo: ["5Np.01"], twm: ["TWM.05"], v: [
              { type: 's1build', n: '2.35' }, { type: 's1build', n: '1.62' }, { type: 's1build', n: '3.08' }] },
            { mode: "your", lo: ["5Np.04"], twm: ["TWM.05"], v: [
              { type: 's1build', n: '3.2', fix: { O: 2 } }, { type: 's1build', n: '4.5', fix: { O: 3 } }, { type: 's1build', n: '1.43', fix: { t: 3 } }] },
            { mode: "your", lo: ["5Np.01"], twm: ["TWM.05"], v: [
              { type: 's1val', n: '6.47', d: 7, as: 'num', chart: true },
              { type: 's1val', n: '8.93', d: 9, as: 'num', chart: true },
              { type: 's1val', n: '15.2', d: 1, as: 'num', chart: true }] }] },
          { title: { en: "Round on the line", vi: "Làm tròn trên trục số" }, rounds: [
            { mode: "your", lo: ["5Np.05"], twm: ["TWM.05"], v: [
              { type: 's1near', n: '6.4', unit: 'kg', text: "A watermelon weighs <b>6.4</b> kg. Round its mass to the nearest kilogram." },
              { type: 's1near', n: '12.6', unit: 'cm', text: "A pencil is <b>12.6</b> cm long. Round its length to the nearest centimetre." },
              { type: 's1near', n: '9.5', unit: 'litres', text: "A fish bowl holds <b>9.5</b> litres. That is halfway. Round it to the nearest litre." }] },
            { mode: "your", lo: ["5Np.05"], twm: ["TWM.02"], v: [
              { type: 's1ends', to: 7, want: 'both', line: true }, { type: 's1ends', to: 4, want: 'both', line: true }, { type: 's1ends', to: 12, want: 'both', line: true }] }] }] },
      { id: 's1a', kit: 'model', game: 'a', surface: 'paper', art: 'icon-step-test',
        title: 'Solve it', blurb: { en: 'Answer questions like the test.', vi: 'Trả lời câu hỏi giống bài kiểm tra.' },
        levels: [
          { title: { en: "Value and parts", vi: "Giá trị và các phần" }, rounds: [
            { mode: "your", lo: ["5Np.01"], twm: ["TWM.05"], v: [
              { type: 's1val', n: '18.64', d: 6, as: 'words', at: 2 },
              { type: 's1val', n: '40.27', d: 7, as: 'words', at: 0 },
              { type: 's1val', n: '3.95', d: 3, as: 'words', at: 1 }] },
            { mode: "your", lo: ["5Np.04"], twm: ["TWM.05"], v: [
              A("Write the missing numbers.", ["5 + 0.6 + 0.02 = {0}", "7.48 = 7 + {1} + 0.08"], [5.62, 0.4], ["5+0.6+0.02", "7.48-7-0.08"], {
                tip: "Each part has its own place: ones, then tenths, then hundredths.",
                worked: "5 ones, 6 tenths and 2 hundredths make 5.62. In 7.48 the 4 is 4 tenths, so the missing part is 0.4.",
                slips: [[5.8, "0.6 is 6 tenths and 0.02 is 2 hundredths. Do not add the 6 and the 2: they go in different places."], [4, "The 4 is in the tenths place. Its value is 4 tenths. Write that as a decimal."], [0.04, "0.04 is 4 hundredths. In 7.48 the 4 is in the tenths place."]] }),
              A("Write the missing numbers.", ["8 + 0.1 + 0.05 = {0}", "2.93 = 2 + 0.9 + {1}"], [8.15, 0.03], ["8+0.1+0.05", "2.93-2-0.9"], {
                tip: "Each part has its own place: ones, then tenths, then hundredths.",
                worked: "8 ones, 1 tenth and 5 hundredths make 8.15. In 2.93 the 3 is 3 hundredths, so the missing part is 0.03.",
                slips: [[8.6, "0.1 is 1 tenth and 0.05 is 5 hundredths. Do not add the 1 and the 5: they go in different places."], [3, "The 3 is in the hundredths place. Its value is 3 hundredths. Write that as a decimal."], [0.3, "0.3 is 3 tenths. In 2.93 the 3 is in the hundredths place."]] }),
              A("Write the missing numbers.", ["4 + 0.07 = {0}", "6.51 = {1} + 0.5 + 0.01"], [4.07, 6], ["4+0.07", "6.51-0.5-0.01"], {
                tip: "Each part has its own place. When a place has no part, write 0 there.",
                worked: "4 ones, no tenths and 7 hundredths make 4.07. In 6.51 the 6 is 6 ones, so the missing part is 6.",
                slips: [[4.7, "0.07 is 7 hundredths. There are no tenths, so write 0 in the tenths place."], [0.6, "0.6 is 6 tenths. In 6.51 the 6 is in the ones place."]] })] },
            { mode: "your", lo: ["5Np.04"], twm: ["TWM.01"], v: [
              { type: 's1way', n: '4.52', right: [3, 15, 2], wrong: [[4, 2, 5], [3, 5, 2], [4, 5, 20]], at: 1 },
              { type: 's1way', n: '2.74', right: [2, 6, 14], wrong: [[2, 4, 7], [1, 7, 4], [2, 7, 40]], at: 2 },
              { type: 's1way', n: '5.3', right: [4, 13, 0], wrong: [[5, 0, 3], [4, 3, 0], [5, 13, 0]], at: 0 }] }] },
          { title: { en: "Round and reason", vi: "Làm tròn và lập luận" }, rounds: [
            { mode: "your", lo: ["5Np.05"], twm: ["TWM.06"], v: [
              { type: 's1ring', to: 8, nums: [7.4, 7.5, 8.4, 8.5, 7.9] },
              { type: 's1ring', to: 15, nums: [14.4, 15.5, 14.6, 15.3, 14.5] },
              { type: 's1ring', to: 1, nums: [0.4, 0.5, 1.4, 1.5, 0.9] }] },
            { mode: "your", lo: ["5Np.01", "5Np.04"], twm: ["TWM.04"], v: [
              { type: "claim", who: "Son", ok: false, at: 1, ctx: "Son looks at the digits <b>7</b> and <b>2</b> in <b>2.07</b>.",
                says: "In a decimal, a bigger digit always has a bigger value.",
                reasons: [
                  { t: "in 2.07 the 7 is only 7 hundredths, but the 2 is 2 ones." },
                  { t: "7 is bigger than 2, so the 7 has the bigger value.", why: "The value depends on the place. Which place is the 7 in?" },
                  { t: "in 2.07 the 7 is 7 tenths.", why: "The tenths digit of 2.07 is 0. The 7 is in the hundredths place." }],
                hint: { pic: { k: 's1chart', n: '2.07' }, step: "Find the place of each digit. What is the 7 worth? What is the 2 worth?" },
                worked: "In 2.07 the 2 is 2 ones and the 7 is 7 hundredths, or 0.07. 2 is much more than 0.07. So a bigger digit can have a smaller value.",
                model: "Son is incorrect because in 2.07 the 7 is only 7 hundredths, but the 2 is 2 ones." },
              { type: "claim", who: "Toan", ok: false, at: 2, says: "In 3.08, the digit 8 is worth 8 tenths.",
                reasons: [
                  { t: "the 8 is in the second place after the decimal point, so it is 8 hundredths." },
                  { t: "the 8 is the last digit, so it is 8 ones.", why: "The ones digit of 3.08 is 3. It is to the left of the decimal point." },
                  { t: "the 8 comes after the decimal point, so it is 8 tenths.", why: "Only the first place after the point is tenths. In 3.08 that digit is 0." }],
                hint: { pic: { k: 's1chart', n: '3.08' }, step: "Put 3.08 in a place value chart. Which place is the 8 in?" },
                worked: "In 3.08 the tenths digit is 0. The 8 is in the hundredths place, so it is worth 8 hundredths, or 0.08.",
                model: "Toan is incorrect because the 8 is in the hundredths place: it is worth 8 hundredths." },
              { type: "claim", who: "Yen", ok: true, at: 0, says: "26 tenths is the same as 2.6.",
                reasons: [
                  { t: "20 tenths make 2 ones, and 6 more tenths make 2.6." },
                  { t: "26 tenths is 0.26.", why: "0.26 is 26 hundredths. Tenths are bigger: 10 tenths make 1 one." },
                  { t: "26 has two digits, so it is 26 ones.", why: "A tenth is smaller than a one. 10 tenths make 1 one." }],
                hint: { pic: { k: 's1chart', c: [0, 0, 26, 0], counters: true, counts: true }, step: "10 tenths make 1 one. How many ones can you make from 26 tenths?" },
                worked: "10 tenths make 1 one, so 20 tenths make 2 ones. 6 tenths are left. 2 ones and 6 tenths is 2.6.",
                model: "Yen is correct because 20 tenths make 2 ones, and 6 more tenths make 2.6." }] }] }] }
    ],
    // Notes: how to do it, each with a worked example and a picture; then one gap sentence per note, in the same order.
    notes: {
      items: [
        { en: 'A decimal has a [[decimal point]]. The first place after it is for [[tenths|tenth]]. The second place is for [[hundredths|hundredth]].',
          vi: 'Số thập phân có dấu thập phân. Chữ số đầu tiên sau dấu thập phân ở hàng phần mười. Chữ số thứ hai ở hàng phần trăm.',
          example: ['In 4.72 the 4 is in the ones place.', 'The 7 is in the *tenths* place. The 2 is in the *hundredths* place.'],
          pic: { k: 's1chart', n: '4.72' } },
        { en: 'The [[place value]] of a digit tells you its value. The same digit has a different value in a different place.',
          vi: 'Giá trị theo hàng cho biết giá trị của một chữ số. Cùng một chữ số, ở hàng khác thì có giá trị khác.',
          example: ['In 5.38 the 3 is 3 tenths. Its value is *0.3*.', 'In 5.83 the 3 is 3 hundredths. Its value is *0.03*.'],
          pic: { k: 's1chart', n: '5.38', hl: 't' } },
        { en: 'You can [[decompose]] a decimal into ones, tenths and hundredths. Add the parts to make the number again.',
          vi: 'Em có thể tách một số thập phân thành đơn vị, phần mười và phần trăm. Cộng các phần lại để được số ban đầu.',
          example: ['1.36 = 1 + 0.3 + 0.06', '8 + 0.5 + 0.04 = *8.54*', 'No tenths? Write 0 in that place: 2 + 0.09 = *2.09*.'],
          pic: { k: 's1grid', n: '1.36' } },
        { en: '[[Regroup|regroup]] to make a number in another way. 10 tenths make 1 one. 10 hundredths make 1 tenth.',
          vi: 'Đổi hàng để viết một số theo cách khác. 10 phần mười bằng 1 đơn vị. 10 phần trăm bằng 1 phần mười.',
          example: ['2 ones and 13 tenths: 13 tenths = 1.3.', '2 + 1.3 = *3.3*.', '3.3 is also *33 tenths*.'],
          pic: { k: 's1chart', c: [0, 2, 13, 0], counters: true, counts: true } },
        { en: 'To [[round]] to the [[nearest]] [[whole number]], look at the tenths digit. 0 to 4: round down. 5 to 9: round up.',
          vi: 'Để làm tròn đến số tự nhiên gần nhất, hãy nhìn chữ số hàng phần mười. Từ 0 đến 4: làm tròn xuống. Từ 5 đến 9: làm tròn lên.',
          example: ['6.8 kg: the tenths digit is 8. Round up to *7 kg*.', '6.3 kg: the tenths digit is 3. Round down to *6 kg*.'],
          pic: { k: 's1line', lo: 6, n: '6.8', show: true } },
        { en: '6.5 is halfway between 6 and 7. Halfway numbers round up. So the numbers with one decimal place from 6.5 to 7.4 all round to 7.',
          vi: '6.5 nằm chính giữa 6 và 7. Số nằm chính giữa thì làm tròn lên. Vì vậy các số có một chữ số ở phần thập phân từ 6.5 đến 7.4 đều làm tròn thành 7.',
          example: ['6.5 rounds up to 7. It is the *smallest*.', '7.4 rounds down to 7. It is the *largest*.', '7.5 rounds up to *8*.'],
          pic: { k: 's1line', lo: 6, hi: 8, zone: 7, ends: true } }
      ],
      check: [
        { sentence: 'In 6.53 the digit 3 is in the {hundredths|tenths|ones} place.', answer: 'hundredths' },
        { sentence: 'The value of the 9 in 2.94 is {0.9|9|0.09}.', answer: '0.9' },
        { sentence: '4 + 0.2 + 0.07 = {4.27|4.9|42.7}.', answer: '4.27' },
        { sentence: '3 ones and 12 tenths make {4.2|3.12|15}.', answer: '4.2' },
        { sentence: '9.4 cm rounded to the nearest centimetre is {9|10|4} cm.', answer: '9' },
        { sentence: 'The smallest number with one decimal place that rounds to 4 is {3.5|3.4|4.5}.', answer: '3.5' }
      ]
    },
    // Mini Practice test: 10 questions, easy to hard: DOK 1, 1, 1, 1, 2, 2, 2, 2, 2, 3. Three sets of numbers each.
    test: {
      items: [
        { dok: 1, lo: ["5Np.01"], twm: ["TWM.05"], v: [
          { type: 's1val', n: '7.25', d: 2, as: 'words', at: 2 },
          { type: 's1val', n: '4.83', d: 3, as: 'words', at: 1 },
          { type: 's1val', n: '9.16', d: 9, as: 'words', at: 3 }] },
        { dok: 1, lo: ["5Np.01"], twm: ["TWM.05"], v: [
          { type: 's1val', n: '3.59', d: 9, as: 'num' },
          { type: 's1val', n: '6.71', d: 7, as: 'num' },
          { type: 's1val', n: '24.8', d: 2, as: 'num' }] },
        { dok: 1, lo: ["5Np.04"], twm: ["TWM.05"], v: [
          A("Write the missing numbers.", ["9 + 0.3 + 0.04 = {0}", "5.17 = 5 + {1} + 0.07"], [9.34, 0.1], ["9+0.3+0.04", "5.17-5-0.07"], {
            tip: "Each part has its own place: ones, then tenths, then hundredths.",
            worked: "9 ones, 3 tenths and 4 hundredths make 9.34. In 5.17 the 1 is 1 tenth, so the missing part is 0.1.",
            slips: [[9.7, "0.3 is 3 tenths and 0.04 is 4 hundredths. Do not add the 3 and the 4: they go in different places."], [1, "The 1 is in the tenths place. Its value is 1 tenth. Write that as a decimal."], [0.01, "0.01 is 1 hundredth. In 5.17 the 1 is in the tenths place."]] }),
          A("Write the missing numbers.", ["2 + 0.8 + 0.06 = {0}", "8.45 = 8 + 0.4 + {1}"], [2.86, 0.05], ["2+0.8+0.06", "8.45-8-0.4"], {
            tip: "Each part has its own place: ones, then tenths, then hundredths.",
            worked: "2 ones, 8 tenths and 6 hundredths make 2.86. In 8.45 the 5 is 5 hundredths, so the missing part is 0.05.",
            slips: [[3.4, "0.8 is 8 tenths and 0.06 is 6 hundredths. Do not add the 8 and the 6: they go in different places."], [5, "The 5 is in the hundredths place. Its value is 5 hundredths. Write that as a decimal."], [0.5, "0.5 is 5 tenths. In 8.45 the 5 is in the hundredths place."]] }),
          A("Write the missing numbers.", ["7 + 0.5 + 0.03 = {0}", "1.92 = 1 + {1} + 0.02"], [7.53, 0.9], ["7+0.5+0.03", "1.92-1-0.02"], {
            tip: "Each part has its own place: ones, then tenths, then hundredths.",
            worked: "7 ones, 5 tenths and 3 hundredths make 7.53. In 1.92 the 9 is 9 tenths, so the missing part is 0.9.",
            slips: [[7.8, "0.5 is 5 tenths and 0.03 is 3 hundredths. Do not add the 5 and the 3: they go in different places."], [9, "The 9 is in the tenths place. Its value is 9 tenths. Write that as a decimal."], [0.09, "0.09 is 9 hundredths. In 1.92 the 9 is in the tenths place."]] })] },
        { dok: 1, lo: ["5Np.05"], twm: ["TWM.05"], v: [
          { type: 's1round', n: '7.8', unit: 'cm', text: "A crayon is <b>7.8</b> cm long. Round its length to the nearest centimetre." },
          { type: 's1round', n: '4.3', unit: 'kg', text: "A bag of oranges weighs <b>4.3</b> kg. Round its mass to the nearest kilogram." },
          { type: 's1round', n: '9.6', unit: 'litres', text: "A watering can holds <b>9.6</b> litres of water. Round this to the nearest litre." }] },
        { dok: 2, lo: ["5Np.04"], twm: ["TWM.05"], v: [
          A("<b>Regroup</b>. Write the missing numbers.", ["26 tenths + 5 hundredths", "= {0}", "4.9 = 3 ones + {1} tenths"], [2.65, 19], ["26*0.1+5*0.01", "(4.9-3)*10"], {
            tip: TIP_REGROUP,
            worked: "26 tenths = 2.6, and 5 hundredths = 0.05, so the number is 2.65. 4.9 is 4 ones and 9 tenths. Regroup 1 one as 10 tenths: 3 ones and 19 tenths.",
            slips: [[26.05, "26 tenths is not 26 ones. 10 tenths make 1 one, so 26 tenths = 2.6."], [26.5, "26 tenths = 2.6. Then add 5 hundredths: 0.05."], [3.1, "Do not add 26 and 5. They are in different places: 2.6 and 0.05."], [9, "3 ones and 9 tenths make 3.9. You need 1 more one: that is 10 more tenths."], [1.9, "4.9 − 3 = 1.9 is right. Now write 1.9 as tenths: 1 one is 10 tenths."]] }),
          A("<b>Regroup</b>. Write the missing numbers.", ["41 tenths + 8 hundredths", "= {0}", "6.3 = 5 ones + {1} tenths"], [4.18, 13], ["41*0.1+8*0.01", "(6.3-5)*10"], {
            tip: TIP_REGROUP,
            worked: "41 tenths = 4.1, and 8 hundredths = 0.08, so the number is 4.18. 6.3 is 6 ones and 3 tenths. Regroup 1 one as 10 tenths: 5 ones and 13 tenths.",
            slips: [[41.08, "41 tenths is not 41 ones. 10 tenths make 1 one, so 41 tenths = 4.1."], [41.8, "41 tenths = 4.1. Then add 8 hundredths: 0.08."], [4.9, "Do not add 41 and 8. They are in different places: 4.1 and 0.08."], [3, "5 ones and 3 tenths make 5.3. You need 1 more one: that is 10 more tenths."], [1.3, "6.3 − 5 = 1.3 is right. Now write 1.3 as tenths: 1 one is 10 tenths."]] }),
          A("<b>Regroup</b>. Write the missing numbers.", ["17 tenths + 9 hundredths", "= {0}", "8.2 = 7 ones + {1} tenths"], [1.79, 12], ["17*0.1+9*0.01", "(8.2-7)*10"], {
            tip: TIP_REGROUP,
            worked: "17 tenths = 1.7, and 9 hundredths = 0.09, so the number is 1.79. 8.2 is 8 ones and 2 tenths. Regroup 1 one as 10 tenths: 7 ones and 12 tenths.",
            slips: [[17.09, "17 tenths is not 17 ones. 10 tenths make 1 one, so 17 tenths = 1.7."], [17.9, "17 tenths = 1.7. Then add 9 hundredths: 0.09."], [2.6, "Do not add 17 and 9. They are in different places: 1.7 and 0.09."], [2, "7 ones and 2 tenths make 7.2. You need 1 more one: that is 10 more tenths."], [1.2, "8.2 − 7 = 1.2 is right. Now write 1.2 as tenths: 1 one is 10 tenths."]] })] },
        { dok: 2, lo: ["5Np.04"], twm: ["TWM.01"], v: [
          { type: 's1way', n: '3.61', right: [2, 16, 1], wrong: [[3, 1, 6], [2, 6, 1], [3, 6, 10]], at: 2 },
          { type: 's1way', n: '6.08', right: [5, 10, 8], wrong: [[6, 8, 0], [5, 0, 18], [6, 1, 8]], at: 0 },
          { type: 's1way', n: '8.35', right: [8, 2, 15], wrong: [[8, 5, 3], [7, 3, 5], [8, 3, 50]], at: 3 }] },
        { dok: 2, lo: ["5Np.05"], twm: ["TWM.06"], v: [
          { type: 's1ring', to: 5, nums: [4.4, 4.5, 5.4, 5.5, 4.9, 5.1] },
          { type: 's1ring', to: 10, nums: [9.4, 9.5, 10.4, 10.5, 9.8, 10.1] },
          { type: 's1ring', to: 2, nums: [1.4, 1.5, 2.4, 2.5, 1.7, 2.2] }] },
        { dok: 2, lo: ["5Np.05"], twm: ["TWM.02"], v: [
          { type: 's1ends', to: 6, want: 'both' }, { type: 's1ends', to: 13, want: 'both' }, { type: 's1ends', to: 9, want: 'both' }] },
        { dok: 2, lo: ["5Np.01", "5Np.04"], twm: ["TWM.05"], v: [
          A("Nhi makes a number. It has <b>4</b> tenths, <b>3</b> tens, <b>9</b> hundredths and <b>5</b> ones.", ["Nhi's number is {0}", "The value of the 4 is {1}"], [35.49, 0.4], ["3*10+5+4*0.1+9*0.01", "4*0.1"], {
            tip: "Put each digit in its place: tens, ones, then tenths and hundredths after the decimal point.",
            pic: { k: 's1chart', c: [3, 5, 4, 9], counters: true, counts: true, tens: true },
            worked: "3 tens, 5 ones, 4 tenths and 9 hundredths: 30 + 5 + 0.4 + 0.09 = 35.49. The 4 is in the tenths place, so its value is 0.4.",
            slips: [[43.95, "The parts are not in order. Put the tens first, then the ones, the tenths and the hundredths."], [4, "4 is the digit. It is in the tenths place. Write its value as a decimal."], [0.04, "0.04 is 4 hundredths. The 4 is in the tenths place."]] }),
          A("Tu makes a number. It has <b>6</b> hundredths, <b>8</b> ones, <b>1</b> ten and <b>3</b> tenths.", ["Tu's number is {0}", "The value of the 6 is {1}"], [18.36, 0.06], ["1*10+8+3*0.1+6*0.01", "6*0.01"], {
            tip: "Put each digit in its place: tens, ones, then tenths and hundredths after the decimal point.",
            pic: { k: 's1chart', c: [1, 8, 3, 6], counters: true, counts: true, tens: true },
            worked: "1 ten, 8 ones, 3 tenths and 6 hundredths: 10 + 8 + 0.3 + 0.06 = 18.36. The 6 is in the hundredths place, so its value is 0.06.",
            slips: [[68.13, "The parts are not in order. Put the tens first, then the ones, the tenths and the hundredths."], [6, "6 is the digit. It is in the hundredths place. Write its value as a decimal."], [0.6, "0.6 is 6 tenths. The 6 is in the hundredths place."]] }),
          A("Lan makes a number. It has <b>9</b> ones, <b>4</b> tens, <b>1</b> hundredth and <b>6</b> tenths.", ["Lan's number is {0}", "The value of the 1 is {1}"], [49.61, 0.01], ["4*10+9+6*0.1+1*0.01", "1*0.01"], {
            tip: "Put each digit in its place: tens, ones, then tenths and hundredths after the decimal point.",
            pic: { k: 's1chart', c: [4, 9, 6, 1], counters: true, counts: true, tens: true },
            worked: "4 tens, 9 ones, 6 tenths and 1 hundredth: 40 + 9 + 0.6 + 0.01 = 49.61. The 1 is in the hundredths place, so its value is 0.01.",
            slips: [[94.16, "The parts are not in order. Put the tens first, then the ones, the tenths and the hundredths."], [1, "1 is the digit. It is in the hundredths place. Write its value as a decimal."], [0.1, "0.1 is 1 tenth. The 1 is in the hundredths place."]] })] },
        { dok: 3, lo: ["5Np.05"], twm: ["TWM.04", "TWM.07"], v: [
          { type: "claim", who: "Khoa", ok: false, at: 1, ctx: "Khoa rounds <b>6.2</b>, <b>6.5</b> and <b>6.9</b> to the nearest whole number.",
            says: "A number with one decimal place always rounds up to the next whole number.",
            reasons: [
              { t: "6.2 rounds down to 6: its tenths digit is less than 5." },
              { t: "6.9 rounds up to 7.", why: "That is true for 6.9. Now round 6.2. Does it go up?" },
              { t: "6.5 rounds down to 6.", why: "6.5 is halfway, and halfway numbers round up to 7." }],
            hint: { pic: { k: 's1line', lo: 6, n: '6.2' }, step: "Round each number. Does every one of them go up?" },
            worked: "6.5 rounds up to 7 and 6.9 rounds up to 7. But 6.2 rounds down to 6. So the rule does not always work.",
            model: "Khoa is incorrect because 6.2 rounds down to 6: its tenths digit is less than 5." },
          { type: "claim", who: "Trang", ok: true, at: 0, ctx: "Trang looks at all the numbers with one decimal place from <b>8.5</b> to <b>9.4</b>.",
            says: "Every one of these numbers rounds to 9.",
            reasons: [
              { t: "8.5 to 8.9 round up to 9, 9.0 is 9, and 9.1 to 9.4 round down to 9." },
              { t: "8.5 rounds down to 8.", why: "8.5 is halfway, and halfway numbers round up to 9." },
              { t: "every one of the numbers has the digit 9.", why: "8.5 has no digit 9. Look at the tenths digit to round." }],
            hint: { pic: { k: 's1line', lo: 8, hi: 10 }, step: "Round the smallest number, 8.5. Round the largest number, 9.4. What about the ones between?" },
            worked: "8.5, 8.6, 8.7, 8.8 and 8.9 have a tenths digit of 5 or more: they round up to 9. 9.0 is 9. 9.1, 9.2, 9.3 and 9.4 have a tenths digit less than 5: they round down to 9. So every one rounds to 9.",
            model: "Trang is correct because 8.5 to 8.9 round up to 9, 9.0 is 9, and 9.1 to 9.4 round down to 9." },
          { type: "claim", who: "Bich", ok: false, at: 2, ctx: "Bich rounds <b>4.6</b>, <b>5.2</b> and <b>5.4</b> to the nearest whole number.",
            says: "Every number that rounds to 5 has the digit 5 in it.",
            reasons: [
              { t: "4.6 rounds up to 5, but it has no digit 5." },
              { t: "5.2 and 5.4 round to 5, and they have the digit 5.", why: "That is true for 5.2 and 5.4. Now round 4.6. Does it have the digit 5?" },
              { t: "4.6 rounds down to 4.", why: "The tenths digit of 4.6 is 6. 6 is 5 or more, so 4.6 rounds up to 5." }],
            hint: { pic: { k: 's1line', lo: 4, hi: 6 }, step: "Round each number. Then look at its digits. Does every one have the digit 5?" },
            worked: "5.2 and 5.4 round down to 5. 4.6 rounds up to 5, but it has no digit 5. So the rule does not always work.",
            model: "Bich is incorrect because 4.6 rounds up to 5, but it has no digit 5." }] }
      ]
    },
    // Lightning round: 60 quick questions (made at the top of this file), the first answer is the right one.
    lightning: { secs: 60, items: light },
    // My self-check: again = the step to practise again for each goal (c = See it, r = Draw it, a = Solve it).
    selfcheck: {
      goals: ["say the value of each digit in a decimal", "write a decimal in parts and regroup it", "round a decimal to the nearest whole number", "explain why a claim about decimals is correct or incorrect"],
      again: ["c", "r", "r", "a"]
    }
  };
})(window.T = window.T || {});
