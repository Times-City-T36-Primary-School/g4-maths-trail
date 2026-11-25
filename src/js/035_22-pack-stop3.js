/* 22-pack-stop3.js - ALL the content of Stop 3, Add and subtract decimals and negatives (Grade 4, Stage 5).
   Parts: words, see, practise, notes, test, lightning, selfcheck.
   Objectives: 5Nf.09 (estimate, add and subtract numbers with the same number of decimal places), 5Ni.01 (estimate, add
   and subtract integers, also where one is negative), 5Nc.02 (shapes or symbols for two unknown quantities).
   The models (s3col, s3est, s3story, s3int, s3temp, s3tbig, s3unk, s3mistake, s3align) are in 009d_g4-models-s3.js: they
   work out every answer from the numbers here, in whole units (never floats). The pictures (s3col, s3line, s3bar, s3eq,
   s3set) are in 047g_g4-pics-s3.js, the word card pictures in 017w_g4-art-s3.js. A claim is the model `claim`, made with
   CLAIM(def): {0} is a calculation of def.eg with its answer, {=0} the answer only, both worked out in code.
   Every question is written fresh for this trail (docs/authoring.md, item security). */
(function (T) {
  'use strict';

  const S = window.MX.s3, CLAIM = S.claim;
  const TR = S.sh('T'), CI = S.sh('C');          // the shapes ▲ and ● inside a sentence

  T.packs[3] = {
    n: 3,
    title: "Add and subtract decimals and negatives",
    los: ["5Nf.09", "5Ni.01", "5Nc.02"],
    blurb: {
      en: "Add and subtract *decimals*. Work with *negative numbers*. Find the *unknown*.",
      vi: "Cộng và trừ *số thập phân*. Tính với *số âm*. Tìm *số chưa biết*."
    },
    words: {
      sets: [
        { id: 'A', title: { en: 'Decimals in columns', vi: 'Số thập phân theo cột' }, keys: ['column method', 'line up', 'regroup'] },
        { id: 'B', title: { en: 'Below zero', vi: 'Dưới số 0' }, keys: ['negative number', 'integer', 'difference'] },
        { id: 'C', title: { en: 'Check and find', vi: 'Kiểm tra và tìm số' }, keys: ['estimate', 'unknown', 'symbol'] }
      ],
      items: {
        'column method': { art: 'w-column-method', vi: 'đặt tính theo cột', def: 'A written way to add or subtract. Write the numbers one under the other, place under place.' },
        'line up': { art: 'w-line-up', vi: 'đặt thẳng cột', def: 'To put things in one straight line. Line up the decimal points: 12.4 above 3.5.' },
        'regroup': { art: 'w-s3-regroup', vi: 'đổi hàng (nhớ, mượn)', def: 'To change 10 of one place for 1 of the next place. 10 tenths make 1 one.' },
        'negative number': { art: 'w-negative-number', vi: 'số âm', def: 'A number below zero. It has a minus sign: −3 is 3 less than 0.' },
        'integer': { art: 'w-integer', vi: 'số nguyên', def: 'A whole number. It can be positive, negative or zero: −3, 0 and 4 are integers.' },
        'difference': { art: 'w-difference', vi: 'hiệu (độ chênh lệch)', def: 'How far apart two numbers are. The difference between −2 and 4 is 6.' },
        'estimate': { art: 'w-estimate', vi: 'ước lượng', def: 'A sensible guess you get by rounding. 4.8 + 3.1 is about 5 + 3 = 8.' },
        'unknown': { art: 'w-unknown', vi: 'số chưa biết', def: 'A number you must find. In ? + 4 = 9 the unknown is 5.' },
        'symbol': { art: 'w-symbol', vi: 'kí hiệu', def: 'A sign or shape that stands for something. In ▲ + ● = 12, ▲ and ● stand for numbers.' }
      }
    },
    // See it: one challenge scene, 5 picture-led rounds (2 done together, then 3 alone): the column layout, a jump on a
    // number line through zero, two thermometers, the bar model of a story, equation cards with shapes.
    see: {
      scenes: [
        { id: 'challenge', title: { en: 'Look and work it out', vi: 'Nhìn và tính' },
          challenge: {
            end: { en: 'You did it! You can add and subtract with pictures.', vi: 'Em làm được rồi! Em biết cộng và trừ bằng hình vẽ.' },
            result: 'You lined up decimal points, jumped across zero and found unknown numbers.',
            rounds: [
              { mode: "our", lo: ["5Nf.09"], twm: ["TWM.07"], v: [
                { type: "s3align", a: "12.4", b: "3.5", op: "+", at: 0 },
                { type: "s3align", a: "24.6", b: "5.3", op: "+", at: 1 },
                { type: "s3align", a: "18.25", b: "3.40", op: "+", at: 2 }] },
              { mode: "our", lo: ["5Ni.01"], twm: ["TWM.05"], v: [
                { type: "s3int", items: [[-4, "+", 9]], fig: true, text: "Look at the jump on the number line. Work out." },
                { type: "s3int", items: [[3, "-", 7]], fig: true, text: "Look at the jump on the number line. Work out." },
                { type: "s3int", items: [[-2, "-", 4]], fig: true, text: "Look at the jump on the number line. Work out." }] },
              { mode: "your", lo: ["5Ni.01"], twm: ["TWM.01"], v: [
                { type: "s3temp", kind: "diff", from: -4, to: 5, fig: "thermo", caps: ["Morning", "Midday"], text: "The thermometers show the temperature in Sa Pa in the <b>morning</b> and at <b>midday</b>. How many degrees warmer is it at midday?" },
                { type: "s3temp", kind: "diff", from: 4, to: -3, fig: "thermo", caps: ["Evening", "Night"], text: "The thermometers show the temperature on a mountain in the <b>evening</b> and at <b>night</b>. How many degrees colder is it at night?" },
                { type: "s3temp", kind: "diff", from: -6, to: 2, fig: "thermo", caps: ["Monday", "Friday"], text: "The thermometers show the temperature in a cold room on <b>Monday</b> and on <b>Friday</b>. How many degrees warmer is it on Friday?" }] },
              { mode: "your", lo: ["5Nf.09"], twm: ["TWM.01"], v: [
                { type: "s3story", fig: true, start: "12.5", steps: [["-", "4.8"], ["+", "3.6"]], unit: "kg", text: "A seller has <b>12.5 kg</b> of rice. She sells <b>4.8 kg</b>. Then she adds <b>3.6 kg</b>. How much rice does she have now?" },
                { type: "s3story", fig: true, start: "2.75", steps: [["-", "1.40"], ["+", "0.85"]], unit: "litres", text: "A jug holds <b>2.75 litres</b> of lemon tea. Khoa pours out <b>1.40 litres</b>. Then he adds <b>0.85 litres</b>. How much tea is in the jug now?" },
                { type: "s3story", fig: true, start: "15.2", steps: [["-", "6.7"], ["+", "2.9"]], unit: "m", text: "A roll has <b>15.2 m</b> of ribbon. Tu cuts off <b>6.7 m</b>. Then she joins on <b>2.9 m</b> more. How long is the ribbon now?" }] },
              { mode: "your", lo: ["5Nc.02"], twm: ["TWM.01"], v: [
                { type: "s3unk", kind: "pick", eqs: [["T", "+", "C", 10], ["T", "-", "C", 2]], pairs: [[6, 4], [4, 6], [7, 3]], at: 1 },
                { type: "s3unk", kind: "pick", eqs: [["T", "+", "C", 14], ["T", "-", "C", 4]], pairs: [[9, 5], [10, 4], [5, 9]], at: 2 },
                { type: "s3unk", kind: "pick", eqs: [["S", "+", "D", 11], ["S", "-", "D", 3]], pairs: [[7, 4], [8, 3], [4, 7]], at: 0 }] }] } }]
    },
    // Practise: Draw it (pictures: the squared paper, the bar model, the number line, the cards) then Solve it (like the test).
    practise: [
      { id: 's3r', kit: 'model', game: 'r', surface: 'board', art: 'icon-step-practise',
        title: 'Draw it', blurb: { en: 'Columns, bar models, number lines and shapes.', vi: 'Đặt tính theo cột, sơ đồ đoạn thẳng, trục số và hình.' },
        levels: [
          { title: { en: "Decimals in columns", vi: "Số thập phân theo cột" }, rounds: [
            { mode: "our", lo: ["5Nf.09"], twm: ["TWM.05"], v: [
              { type: "s3col", fig: true, a: "4.75", b: "2.68", op: "+" },
              { type: "s3col", fig: true, a: "16.8", b: "7.5", op: "+" },
              { type: "s3col", fig: true, a: "3.59", b: "5.64", op: "+" }] },
            { mode: "your", lo: ["5Nf.09"], twm: ["TWM.05"], v: [
              { type: "s3col", fig: true, a: "9.32", b: "4.57", op: "-" },
              { type: "s3col", fig: true, a: "23.4", b: "8.7", op: "-" },
              { type: "s3col", fig: true, a: "7.05", b: "2.48", op: "-" }] },
            { mode: "your", lo: ["5Nf.09"], twm: ["TWM.01"], v: [
              { type: "s3story", fig: true, start: "6.50", steps: [["+", "2.75"], ["-", "4.80"]], unit: "litres", text: "A pot holds <b>6.50 litres</b> of pho broth. The cook adds <b>2.75 litres</b>. Then she serves <b>4.80 litres</b>. How much broth is left?" },
              { type: "s3story", fig: true, start: "8.4", steps: [["-", "3.9"], ["+", "2.6"]], unit: "kg", text: "A basket holds <b>8.4 kg</b> of mangoes. The seller sells <b>3.9 kg</b>. Then she adds <b>2.6 kg</b>. How many kilograms are in the basket now?" },
              { type: "s3story", fig: true, start: "42.5", steps: [["-", "17.8"], ["+", "12.6"]], unit: "litres", text: "A bus has <b>42.5 litres</b> of fuel. It uses <b>17.8 litres</b>. Then the driver adds <b>12.6 litres</b>. How much fuel is in the bus now?" }] }] },
          { title: { en: "Below zero and unknowns", vi: "Dưới số 0 và số chưa biết" }, rounds: [
            { mode: "your", lo: ["5Ni.01"], twm: ["TWM.05"], v: [
              { type: "s3int", items: [[2, "-", 6]], fig: "open", text: "Start at the dot. Follow the jump. Work out." },
              { type: "s3int", items: [[-7, "+", 4]], fig: "open", text: "Start at the dot. Follow the jump. Work out." },
              { type: "s3int", items: [[-3, "-", 5]], fig: "open", text: "Start at the dot. Follow the jump. Work out." }] },
            { mode: "your", lo: ["5Nc.02"], twm: ["TWM.01"], v: [
              { type: "s3unk", kind: "table", eq: ["T", "+", "C", 9], given: [2, 5, 9] },
              { type: "s3unk", kind: "table", eq: ["T", "-", "C", 4], given: [4, 7, 10] },
              { type: "s3unk", kind: "table", eq: ["S", "+", "D", 12], given: [0, 6, 11] }] }] }] },
      { id: 's3a', kit: 'model', game: 'a', surface: 'paper', art: 'icon-step-test',
        title: 'Solve it', blurb: { en: 'Answer questions like the test.', vi: 'Trả lời câu hỏi giống bài kiểm tra.' },
        levels: [
          { title: { en: "Calculate and check", vi: "Tính và kiểm tra" }, rounds: [
            { mode: "your", lo: ["5Ni.01"], twm: ["TWM.05"], v: [
              { type: "s3int", items: [[346, "+", 275, "-", 198]] },
              { type: "s3int", items: [[502, "-", 167, "+", 249]] },
              { type: "s3int", items: [[728, "-", 359, "+", 85]] }] },
            { mode: "your", lo: ["5Nf.09"], twm: ["TWM.02"], v: [
              { type: "s3est", a: "18.72", b: "6.39", op: "-" },
              { type: "s3est", a: "7.6", b: "14.8", op: "+" },
              { type: "s3est", a: "25.18", b: "9.67", op: "+" }] },
            { mode: "your", lo: ["5Nf.09"], twm: ["TWM.07", "TWM.08"], v: [
              { type: "s3mistake", who: "Truc", a: "12.4", b: "3.5", op: "+", slip: "left", at: 1 },
              { type: "s3mistake", who: "Thinh", he: true, a: "6.47", b: "2.85", op: "+", slip: "noregroup", at: 0 },
              { type: "s3mistake", who: "Yen", a: "8.31", b: "5.17", op: "-", slip: "swap", at: 2 }] }] },
          { title: { en: "Stories and reasons", vi: "Bài toán và lí do" }, rounds: [
            { mode: "your", lo: ["5Ni.01"], twm: ["TWM.01"], v: [
              { type: "s3temp", kind: "start", end: 3, change: 7, text: "In Sa Pa the temperature rises by <b>7 degrees</b> from night to midday. At midday it is <b>3 °C</b>. What was the temperature at night?" },
              { type: "s3temp", kind: "start", end: -5, change: -8, text: "In the evening the temperature falls by <b>8 degrees</b>. Now it is <b>−5 °C</b>. What was the temperature before?" },
              { type: "s3temp", kind: "start", end: 2, change: 9, text: "The door of a cold room is left open. The temperature inside rises by <b>9 degrees</b>. Now it is <b>2 °C</b>. What was the temperature at the start?" }] },
            { mode: "your", lo: ["5Ni.01", "5Nc.02"], twm: ["TWM.04", "TWM.07"], v: [
              CLAIM({ who: "Luan", ok: false, at: 1, eg: ["3-8", "8-3", "3+8"], ctx: "Luan works out <b>3 − 8</b> and <b>8 − 3</b>.",
                says: "You can swap the two numbers in a subtraction. The answer stays the same.",
                reasons: [
                  { t: "{0}, but {1}. The two answers are different." },
                  { t: "{2}, and 8 + 3 is 11 too.", why: "That is addition. In an addition you can swap. Now check the subtraction." },
                  { t: "both answers have the digit 5.", why: "{=0} is below zero and {=1} is above zero. They are different numbers." }],
                hint: { pic: { k: "s3line", from: 3, to: -5 }, step: "Work out both subtractions on a number line. Are the answers the same number?" },
                worked: "{0}: you go past zero. {1}: you stay above zero. {=0} and {=1} are different numbers, so you cannot swap.",
                model: "Luan is incorrect because {0}, but {1}." }),
              CLAIM({ who: "Nhi", ok: true, at: 0, eg: ["-2-5", "-1-3", "9-4"], ctx: "Nhi works out <b>−2 − 5</b> and <b>−1 − 3</b>.",
                says: "When you start below zero and subtract a positive number, the answer is always below zero.",
                reasons: [
                  { t: "subtracting is a jump to the left, so you move further below zero. For example, {0}." },
                  { t: "every subtraction gives a negative answer.", why: "{2}. That answer is positive." },
                  { t: "−2 − 5 = 3, and 3 is above zero.", why: "Start at −2 and jump 5 to the left: {0}." }],
                hint: { pic: { k: "s3line", from: -2, to: -7 }, step: "Start below zero on a number line. Which way is the jump when you subtract?" },
                worked: "{0} and {1}. A subtraction is a jump to the left. If you start below zero, you move further below zero.",
                model: "Nhi is correct because subtracting is a jump to the left, away from zero: {0}." }),
              CLAIM({ who: "Son", ok: false, at: 2, eg: ["7+3", "5+5", "3+7"], ctx: TR + " and " + CI + " stand for whole numbers. " + TR + " + " + CI + " = 10.",
                says: TR + " must be 5.",
                reasons: [
                  { t: "many pairs add to 10. For example, {0}, so " + TR + " can be 7." },
                  { t: "{1}, so " + TR + " is 5.", why: "5 and 5 is one pair that fits. Are there other pairs?" },
                  { t: TR + " comes first, so it is the bigger number.", why: "The order does not tell us. {2} fits too." }],
                hint: { pic: { k: "s3eq", lines: [["T", "+", "C", 10]] }, step: "Find more than one pair of numbers that add to 10." },
                worked: "{1}, but also {0} and {2}. With two unknowns and one calculation, many pairs fit.",
                model: "Son is incorrect because other pairs fit too: {0}." })] }] }] }
    ],
    // Notes: how to do it, one idea per note with a worked example and a picture; then one gap sentence per note.
    notes: {
      items: [
        { en: 'To add decimals, use the [[column method]]. [[Line up|line up]] the decimal points. Add from the right and [[regroup]].',
          vi: 'Để cộng số thập phân, hãy đặt tính theo cột. Đặt các dấu phẩy (dấu thập phân) thẳng cột. Cộng từ phải sang trái, nhớ sang hàng bên trái khi cần.',
          example: ['4.75 + 2.68: hundredths 5 + 8 = 13. Write 3, regroup 1 tenth.', 'Tenths 7 + 6 + 1 = 14. Write 4, regroup 1 one.', 'Ones 4 + 2 + 1 = 7. The answer is *7.43*.'],
          pic: { k: 's3col', a: '4.75', b: '2.68', op: '+', show: 'work' } },
        { en: 'To subtract decimals, start from the right too. When the top digit is smaller, [[regroup]]: take 1 from the next column to the left.',
          vi: 'Để trừ số thập phân, cũng bắt đầu từ bên phải. Khi chữ số ở trên bé hơn, hãy mượn 1 ở cột bên trái.',
          example: ['9.32 − 4.57: hundredths 2 is less than 7. Regroup: 12 − 7 = 5.', 'Tenths: now 2 is less than 5. Regroup: 12 − 5 = 7.', 'Ones 8 − 4 = 4. The answer is *4.75*.'],
          pic: { k: 's3col', a: '9.32', b: '4.57', op: '-', show: 'work' } },
        { en: 'In a story with two steps, do one step at a time. [[Estimate|estimate]] first, then check your answer.',
          vi: 'Với bài toán có hai bước, hãy làm từng bước một. Ước lượng trước, rồi kiểm tra đáp án.',
          example: ['12.5 kg of rice. Sell 4.8 kg, then add 3.6 kg.', 'Estimate: 13 − 5 + 4 = 12.', '12.5 − 4.8 = 7.7. Then 7.7 + 3.6 = *11.3 kg*. It is near 12.'],
          pic: { k: 's3bar', start: '12.5', steps: [['-', '4.8'], ['+', '3.6']], unit: 'kg', show: 2 } },
        { en: 'A [[negative number]] is below zero. On a number line, adding is a jump to the right. Subtracting is a jump to the left.',
          vi: 'Số âm nằm dưới số 0. Trên trục số, cộng là nhảy sang phải. Trừ là nhảy sang trái.',
          example: ['3 − 7: start at 3 and jump 7 to the left.', '3 jumps take you to 0. 4 more take you to *−4*.', '−4 + 6: start at −4 and jump 6 to the right. You land on *2*.'],
          pic: { k: 's3line', from: 3, to: -4 } },
        { en: 'To find the [[difference]] between a temperature below zero and one above zero, go in two jumps: to zero, then from zero. Add the two jumps.',
          vi: 'Để tìm độ chênh lệch giữa một nhiệt độ dưới 0 và một nhiệt độ trên 0, hãy nhảy hai bước: đến số 0, rồi từ số 0. Cộng hai bước nhảy lại.',
          example: ['From −4 °C to 5 °C:', '−4 to 0 is 4 degrees. 0 to 5 is 5 degrees.', '4 + 5 = *9 degrees*. Do not work out 5 − 4.'],
          pic: { k: 's3line', from: -4, to: 5, via0: true } },
        { en: 'A shape or [[symbol]] can stand for an [[unknown]] number. With two unknowns, test pairs of numbers.',
          vi: 'Một hình hoặc kí hiệu có thể thay cho một số chưa biết. Khi có hai số chưa biết, hãy thử các cặp số.',
          example: ['▲ + ● = 10 and ▲ − ● = 2.', 'Pairs that add to 10: 5 and 5, 6 and 4, 7 and 3 ...', 'Only 6 and 4 have a difference of 2. So *▲ = 6 and ● = 4*.'],
          pic: { k: 's3eq', lines: [['T', '+', 'C', 10], ['T', '-', 'C', 2]], vals: { T: 6, C: 4 } } }
      ],
      check: [
        { sentence: '3.45 + 2.38 = {5.83|5.73|58.3}.', answer: '5.83' },
        { sentence: '7.24 − 3.58 = {3.66|4.34|4.76}.', answer: '3.66' },
        { sentence: 'Round to estimate: 18.7 − 6.2 is about {13|12|25}.', answer: '13' },
        { sentence: '2 − 6 = {−4|4|−8}.', answer: '−4' },
        { sentence: 'From −3 °C to 4 °C is {7|1|−7} degrees.', answer: '7' },
        { sentence: '▲ + ● = 9 and ▲ − ● = 1, so ▲ = {5|4|8}.', answer: '5' }
      ]
    },
    // Mini Practice test: 10 questions, easy to hard: DOK 1, 1, 1, 1, 2, 2, 2, 2, 2, 3. Three sets of numbers each.
    // 1 a three-term whole-number calculation; 2 a written addition of decimals; 3 calculations below zero; 4 one shape is
    // given, find the other (DOK 1: one standard step). 5 estimate, then the exact answer; 6 a measure story in two steps;
    // 7 a temperature difference across zero; 8 which change is bigger; 9 two shapes from their sum and difference
    // (DOK 2). 10 a general claim about adding or subtracting, judged with an example or a counterexample (DOK 3).
    test: {
      items: [
        { dok: 1, lo: ["5Ni.01"], twm: ["TWM.05"], v: [
          { type: "s3int", items: [[457, "+", 268, "+", 134]] },
          { type: "s3int", items: [[613, "-", 248, "+", 176]] },
          { type: "s3int", items: [[385, "+", 296, "-", 147]] }] },
        { dok: 1, lo: ["5Nf.09"], twm: ["TWM.05"], v: [
          { type: "s3col", a: "5.38", b: "2.47", op: "+" },
          { type: "s3col", a: "14.6", b: "8.9", op: "+" },
          { type: "s3col", a: "6.74", b: "3.58", op: "+" }] },
        { dok: 1, lo: ["5Ni.01"], twm: ["TWM.05"], v: [
          { type: "s3int", items: [[3, "-", 8], [-6, "+", 9], [-4, "-", 3]] },
          { type: "s3int", items: [[2, "-", 9], [-7, "+", 3], [-5, "-", 5]] },
          { type: "s3int", items: [[5, "-", 11], [-3, "+", 10], [-1, "-", 8]] }] },
        { dok: 1, lo: ["5Nc.02"], twm: ["TWM.01"], v: [
          { type: "s3unk", kind: "given", eq: ["T", "+", "C", 17], give: ["C", 8] },
          { type: "s3unk", kind: "given", eq: ["T", "-", "C", 6], give: ["C", 7] },
          { type: "s3unk", kind: "given", eq: ["S", "+", "D", 20], give: ["S", 12] }] },
        { dok: 2, lo: ["5Nf.09"], twm: ["TWM.02"], v: [
          { type: "s3est", a: "12.84", b: "6.29", op: "+" },
          { type: "s3est", a: "20.3", b: "7.8", op: "-" },
          { type: "s3est", a: "9.56", b: "4.71", op: "-" }] },
        { dok: 2, lo: ["5Nf.09"], twm: ["TWM.01"], v: [
          { type: "s3story", start: "24.5", steps: [["-", "9.8"], ["+", "12.6"]], unit: "kg", text: "A stall has <b>24.5 kg</b> of oranges. It sells <b>9.8 kg</b>. Then <b>12.6 kg</b> more arrive. How many kilograms does the stall have now?" },
          { type: "s3story", start: "8.25", steps: [["-", "3.60"], ["+", "2.75"]], unit: "litres", text: "A stall has <b>8.25 litres</b> of sugar cane juice. It sells <b>3.60 litres</b>. Then the seller makes <b>2.75 litres</b> more. How much juice is there now?" },
          { type: "s3story", start: "10.4", steps: [["-", "3.7"], ["+", "5.5"]], unit: "m", text: "Dung has <b>10.4 m</b> of kite string. He uses <b>3.7 m</b>. Then his father gives him <b>5.5 m</b> more. How much string does Dung have now?" }] },
        { dok: 2, lo: ["5Ni.01"], twm: ["TWM.01"], v: [
          { type: "s3temp", kind: "diff", from: -5, to: 4, text: "Early in the morning the temperature in Sa Pa is <b>−5 °C</b>. At midday it is <b>4 °C</b>. How many degrees warmer is it at midday?" },
          { type: "s3temp", kind: "diff", from: 6, to: -2, text: "The temperature in a cold room goes from <b>6 °C</b> to <b>−2 °C</b>. How many degrees colder is it now?" },
          { type: "s3temp", kind: "diff", from: -7, to: 5, text: "On a mountain the temperature at night is <b>−7 °C</b>. In the afternoon it is <b>5 °C</b>. What is the difference between the two temperatures?" }] },
        { dok: 2, lo: ["5Ni.01"], twm: ["TWM.07"], v: [
          { type: "s3tbig", a: { name: "Monday", from: -2, to: 7 }, b: { name: "Tuesday", from: 1, to: 9 } },
          { type: "s3tbig", a: { name: "Sa Pa", from: 4, to: -3 }, b: { name: "Da Lat", from: 12, to: 6 }, what: "town" },
          { type: "s3tbig", a: { name: "Saturday", from: -1, to: 5 }, b: { name: "Sunday", from: 9, to: 2 } }] },
        { dok: 2, lo: ["5Nc.02"], twm: ["TWM.01"], v: [
          { type: "s3unk", kind: "sumdiff", sum: 13, diff: 3 },
          { type: "s3unk", kind: "sumdiff", sum: 16, diff: 6 },
          { type: "s3unk", kind: "sumdiff", sum: 15, diff: 7, sh: ["S", "D"] }] },
        { dok: 3, lo: ["5Ni.01"], twm: ["TWM.04", "TWM.07"], v: [
          CLAIM({ who: "Khoi", ok: false, at: 1, eg: ["4+7", "7-4"], ctx: "Khoi looks at <b>−4 °C</b> and <b>7 °C</b>.",
            says: "For a temperature below zero, ignore the minus sign. Then subtract to find the difference.",
            reasons: [
              { t: "from −4 to 0 is 4 degrees and from 0 to 7 is 7 degrees. {0}, so the difference is {=0} degrees, not {=1}." },
              { t: "{1}, so the difference is {=1} degrees.", why: "{=1} degrees is the difference between 4 °C and 7 °C. But −4 °C is on the other side of zero." },
              { t: "you always subtract to find a difference.", why: "Count on a number line from −4 to 7. You pass zero, so you add the two jumps." }],
            hint: { pic: { k: "s3line", from: -4, to: 7, ask: true }, step: "Count the degrees from −4 to 7 on a number line. Compare with {1}." },
            worked: "−4 and 7 are on different sides of zero. From −4 to 0 is 4 degrees. From 0 to 7 is 7 degrees. {0}. Subtracting gives only {=1}.",
            model: "Khoi is incorrect because from −4 °C to 7 °C you pass zero: {0} degrees, not {=1}." }),
          CLAIM({ who: "Bich", ok: true, at: 0, eg: ["3-8", "5-6", "10-25", "8-3"], ctx: "Bich works out <b>3 − 8</b> and <b>5 − 6</b>.",
            says: "If you subtract a bigger number from a smaller number, the answer is always negative.",
            reasons: [
              { t: "you jump back more than the number you start with, so you go past zero. For example, {0}." },
              { t: "every subtraction gives a negative answer.", why: "{3}. That answer is positive." },
              { t: "5 − 6 = 1, and 1 is positive.", why: "Start at 5 and jump 6 to the left. You go 1 below zero: {1}." }],
            hint: { pic: { k: "s3line", from: 3, to: -5 }, step: "Work out each calculation on a number line. Where do you land: above or below zero?" },
            worked: "{0}, {1} and {2}. Each time you jump back more than the number you start with, so you pass zero.",
            model: "Bich is correct because you jump back past zero each time: {0}." }),
          CLAIM({ who: "Toan", ok: false, at: 2, eg: ["6+3", "-5+3", "-2+9"], ctx: "Toan works out <b>6 + 3</b>, <b>−5 + 3</b> and <b>−2 + 9</b>.",
            says: "When you add two numbers, the answer is always bigger than both numbers.",
            reasons: [
              { t: "{1}, and {=1} is smaller than 3." },
              { t: "{0}, and {=0} is bigger than 6 and 3.", why: "That is true for 6 + 3. Now check −5 + 3." },
              { t: "adding always makes a number bigger.", why: "{1}. That is bigger than −5, but it is smaller than 3." }],
            hint: { pic: { k: "s3line", from: -5, to: -2 }, step: "Work out each addition. Compare the answer with both numbers you added." },
            worked: "{0}: bigger than both. But {1}, and {=1} is smaller than 3. One example that does not fit shows the rule is wrong.",
            model: "Toan is incorrect because {1}, and {=1} is smaller than 3." })] }
      ]
    },
    // Lightning round: 60 seconds of quick mental questions, three answers each (the first is right). Made and checked
    // by a script (exact fractions): decimals, calculations below zero, temperature differences, shapes, estimates.
    lightning: {
      secs: 60,
      items: [
        ["0.3 + 0.4",["0.7","0.07","7"]],["0.6 + 0.7",["1.3","0.13","1.2"]],["1.5 + 2.5",["4","3","4.1"]],
        ["2.4 + 1.6",["4","3.1","4.1"]],["3.7 + 0.5",["4.2","3.12","4.3"]],["0.8 + 0.9",["1.7","0.17","1.6"]],
        ["4.2 + 3.3",["7.5","7.6","0.9"]],["5.5 + 0.6",["6.1","5.11","6.2"]],["2.9 + 2.2",["5.1","4.11","5.2"]],
        ["6.4 + 1.8",["8.2","7.12","7.2"]],["0.9 − 0.4",["0.5","1.3","0.05"]],["1.2 − 0.5",["0.7","1.3","0.6"]],
        ["3.5 − 1.5",["2","5","2.5"]],["4.3 − 0.7",["3.6","4.4","3.4"]],["7.6 − 2.4",["5.2","5.4","10"]],
        ["6.1 − 0.3",["5.8","6.2","5.9"]],["9.4 − 4.6",["4.8","5.2","5.8"]],["8.2 − 7.9",["0.3","1.3","1.7"]],
        ["3.3 − 1.8",["1.5","2.5","2.1"]],["10.5 − 0.8",["9.7","10.3","9.3"]],["0.25 + 0.25",["0.5","0.05","0.4"]],
        ["0.75 − 0.25",["0.5","0.05","1"]],["1.50 + 0.25",["1.75","1.25","1.3"]],["0.45 + 0.05",["0.5","0.4","0.05"]],
        ["0.99 + 0.01",["1","0.1","0.991"]],["2.30 − 0.10",["2.2","2.29","1.3"]],["3 − 7",["−4","4","−10"]],
        ["2 − 9",["−7","7","−11"]],["0 − 5",["−5","5","6"]],["6 − 10",["−4","4","−16"]],
        ["1 − 8",["−7","7","−9"]],["5 − 12",["−7","7","−17"]],["4 − 6",["−2","2","−10"]],
        ["10 − 15",["−5","5","−25"]],["−4 + 6",["2","−2","10"]],["−7 + 3",["−4","4","10"]],
        ["−2 + 9",["7","−7","11"]],["−8 + 2",["−6","6","10"]],["−1 + 4",["3","−3","5"]],
        ["−6 + 10",["4","−4","16"]],["−9 + 5",["−4","4","14"]],["−3 + 8",["5","−5","11"]],
        ["−5 + 5",["0","10","−10"]],["−2 − 5",["−7","3","7"]],["−1 − 1",["−2","1","2"]],
        ["−4 − 6",["−10","2","10"]],["−3 − 3",["−6","1","6"]],["−5 − 2",["−7","−3","7"]],
        ["−7 − 4",["−11","−3","11"]],["From −2 °C to 5 °C: how many degrees?",["7","3","−7"]],["From −6 °C to 1 °C: how many degrees?",["7","5","−7"]],
        ["From −3 °C to 3 °C: how many degrees?",["6","7","0"]],["From 4 °C to −4 °C: how many degrees?",["8","9","0"]],["From −1 °C to 9 °C: how many degrees?",["10","8","−10"]],
        ["From 2 °C to −7 °C: how many degrees?",["9","5","−9"]],["▲ + 6 = 15. ▲ = ?",["9","21","8"]],["▲ − 4 = 9. ▲ = ?",["13","5","12"]],
        ["12 − ● = 5. ● = ?",["7","17","6"]],["● + ● = 14. ● = ?",["7","14","28"]],["▲ + ● = 10 and ▲ = 7. ● = ?",["3","17","4"]],
        ["▲ − ● = 3 and ● = 6. ▲ = ?",["9","3","2"]],["Estimate: 4.8 + 3.1",["8","7","10"]],["Estimate: 9.7 − 2.1",["8","7","12"]],
        ["Estimate: 6.9 + 7.8",["15","13","17"]],["Estimate: 12.4 − 5.2",["7","6","17"]],["Estimate: 19.6 + 10.3",["30","29","32"]],
        ["Estimate: 15.2 − 8.9",["6","7","8"]]
      ]
    },
    selfcheck: {
      goals: ["add and subtract decimals in columns, with the decimal points lined up", "estimate first, to check my answer", "add and subtract with numbers below zero",
        "find the difference between two temperatures, also across zero", "find the numbers that two shapes stand for"],
      again: ["r", "a", "c", "a", "r"]
    }
  };
})(window.T = window.T || {});
