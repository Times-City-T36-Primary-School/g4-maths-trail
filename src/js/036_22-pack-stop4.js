/* 22-pack-stop4.js - ALL the content of Stop 4, Fractions (Grade 4, Stage 5: 5Nf.01, 5Nf.02, 5Nf.03).
   Parts: words, see, practise, notes, test, lightning, selfcheck.
   The models (s4of, s4left, s4div, s4whole, s4mix, s4pick, s4which) are in 009d_g4-models-s4.js: they work out every
   answer from the numbers here. The pictures (s4bar, s4share, s4mixed, s4line, s4say) are in 047g_g4-pics-s4.js, the
   word card pictures in 017w_g4-art-s4.js. Fractions are typed here as 3/4 and 1 3/4; they are shown as real fractions
   (MX.s4deep at the end of this file for the questions; the watcher in 047g for notes, lightning and Zip's lines).
   Every claim carries a `fact`; C() works the fact out and stops the build if `ok` does not agree with it. */
(function (T) {
  'use strict';
  const MX = window.MX;

  // a claim: `ok` must agree with the fact, worked out in code (MX.s4fact)
  const C = function (d) {
    if (MX.s4fact(d.fact) !== d.ok) throw new Error('Stop 4: the claim of ' + d.who + ' has the wrong verdict');
    d.type = 'claim';
    return d;
  };
  const R = function (mode, lo, twm, v) { return { mode: mode, lo: lo, twm: twm, v: v }; };
  const Q = function (dok, lo, twm, v) { return { dok: dok, lo: lo, twm: twm, v: v }; };

  const pack = T.packs[4] = {
    n: 4,
    title: "Fractions",
    los: ["5Nf.01", "5Nf.02", "5Nf.03"],
    blurb: {
      en: "A *fraction* is a division. Find a fraction of an amount. Change *mixed numbers*.",
      vi: "*Phân số* là một phép chia. Tìm phân số của một số. Đổi *hỗn số*."
    },

    /* ---------- Words: 9 picture cards in 3 sets ---------- */
    words: {
      sets: [
        { id: 'A', title: { en: 'Parts of a fraction', vi: 'Các phần của phân số' }, keys: ['numerator', 'denominator', 'unit fraction'] },
        { id: 'B', title: { en: 'Less than 1, more than 1', vi: 'Bé hơn 1, lớn hơn 1' }, keys: ['proper fraction', 'improper fraction', 'mixed number'] },
        { id: 'C', title: { en: 'Fractions at work', vi: 'Dùng phân số' }, keys: ['share equally', 'operator', 'equivalent'] }
      ],
      items: {
        'numerator': { art: 'w-s4-numerator', vi: 'tử số', def: 'The top number of a fraction. It tells how many parts you have. In 3/4 the numerator is 3.' },
        'denominator': { art: 'w-s4-denominator', vi: 'mẫu số', def: 'The bottom number of a fraction. It tells how many equal parts make one whole. In 3/4 it is 4.' },
        'unit fraction': { art: 'w-s4-unit-fraction', vi: 'phân số đơn vị (tử số là 1)', def: 'A fraction with 1 on top. It is one equal part of a whole. 1/5 is one fifth.' },
        'proper fraction': { art: 'w-s4-proper-fraction', vi: 'phân số bé hơn 1', def: 'A fraction that is less than 1. The top number is smaller than the bottom number, like 3/4.' },
        'improper fraction': { art: 'w-s4-improper-fraction', vi: 'phân số lớn hơn hoặc bằng 1', def: 'A fraction that is 1 whole or more. The top number is not smaller than the bottom number, like 7/4.' },
        'mixed number': { art: 'w-s4-mixed-number', vi: 'hỗn số', def: 'A whole number and a fraction together. 1 3/4 is 1 whole and 3 quarters.' },
        'share equally': { art: 'w-s4-share-equally', vi: 'chia đều', def: 'To give everyone the same amount. 3 cakes shared equally among 4 children: each child gets 3/4 of a cake.' },
        'operator': { art: 'w-s4-operator', vi: 'phân số của một số (toán tử)', def: 'A fraction that works on a number. To find 3/4 of 20, divide by 4, then multiply by 3.' },
        'equivalent': { art: 'w-s4-equivalent', vi: 'tương đương (có giá trị bằng nhau)', def: 'Equal in value, but written in a different way. 7/4 and 1 3/4 are equivalent.' }
      }
    },

    /* ---------- See it: five picture-led questions (two together, three alone) ---------- */
    see: {
      scenes: [
        { id: 'challenge', title: { en: 'Look and answer', vi: 'Nhìn và trả lời' },
          challenge: {
            end: { en: 'You did it! You can see fractions in pictures.', vi: 'Em làm được rồi! Em nhìn thấy phân số trong hình vẽ.' },
            result: 'You shared whole things, shaded a strip and read numbers bigger than 1 whole.',
            rounds: [
              R("our", ["5Nf.01"], ["TWM.05"], [
                { type: 's4div', a: 3, b: 4, one: 'pizza', many: 'pizzas' },
                { type: 's4div', a: 1, b: 5, one: 'rice cake', many: 'rice cakes', kind: 'cake', who: 'friends', each: 'friend' },
                { type: 's4div', a: 1, b: 6, one: 'pancake', many: 'pancakes' }]),
              R("our", ["5Nf.02"], ["TWM.05"], [
                { type: 's4of', n: 3, d: 4, of: 20, bar: true },
                { type: 's4of', n: 2, d: 5, of: 30, bar: true },
                { type: 's4of', n: 2, d: 3, of: 18, bar: true }]),
              R("your", ["5Nf.03"], ["TWM.05"], [
                { type: 's4mix', n: 7, d: 4, to: 'mixed', show: 'circles' },
                { type: 's4mix', n: 5, d: 3, to: 'mixed', show: 'bars' },
                { type: 's4mix', n: 11, d: 4, to: 'mixed', show: 'circles' }]),
              R("your", ["5Nf.03"], ["TWM.05"], [
                { type: 's4mix', n: 9, d: 4, to: 'improper', show: 'line', max: 3 },
                { type: 's4mix', n: 3, d: 2, to: 'improper', show: 'line', max: 3 },
                { type: 's4mix', n: 5, d: 3, to: 'improper', show: 'line', max: 3 }]),
              R("your", ["5Nf.02"], ["TWM.01"], [
                { type: 's4whole', n: 3, d: 5, part: 12, bar: true },
                { type: 's4whole', n: 2, d: 3, part: 14, bar: true },
                { type: 's4whole', n: 3, d: 4, part: 18, bar: true }])
            ] } }]
    },

    /* ---------- Practise: Draw it (pictures) and Solve it (like the test) ---------- */
    practise: [
      { id: 's4r', kit: 'model', game: 'r', surface: 'board', art: 'icon-step-practise',
        title: 'Draw it', blurb: { en: 'Sharing pictures, fraction strips and number lines.', vi: 'Hình chia đều, băng phân số và tia số.' },
        levels: [
          { title: { en: "Share and find", vi: "Chia đều và tìm phần" }, rounds: [
            R("our", ["5Nf.01"], ["TWM.05"], [
              { type: 's4div', a: 1, b: 8, one: 'watermelon', many: 'watermelons' },
              { type: 's4div', a: 3, b: 4, one: 'rice cake', many: 'rice cakes', kind: 'cake', who: 'friends', each: 'friend' },
              { type: 's4div', a: 3, b: 10, one: 'cake', many: 'cakes', kind: 'cake', who: 'guests', each: 'guest' }]),
            R("your", ["5Nf.02"], ["TWM.05"], [
              { type: 's4of', n: 5, d: 6, of: 30, bar: true },
              { type: 's4of', n: 3, d: 8, of: 40, bar: true },
              { type: 's4of', n: 7, d: 10, of: 50, bar: true }]),
            R("your", ["5Nf.02"], ["TWM.01"], [
              { type: 's4whole', n: 2, d: 5, part: 16, bar: true },
              { type: 's4whole', n: 3, d: 4, part: 27, bar: true },
              { type: 's4whole', n: 5, d: 6, part: 35, bar: true }])] },
          { title: { en: "More than one whole", vi: "Lớn hơn một đơn vị" }, rounds: [
            R("your", ["5Nf.03"], ["TWM.05"], [
              { type: 's4pick', ask: 'pic', n: 5, d: 3, as: 'mixed', kind: 'circles', wrong: [[4, 3], [7, 4]], at: 1 },
              { type: 's4pick', ask: 'pic', n: 9, d: 4, as: 'mixed', kind: 'bars', wrong: [[7, 4], [9, 5]], at: 2 },
              { type: 's4pick', ask: 'pic', n: 7, d: 2, as: 'improper', kind: 'circles', wrong: [[5, 2], [7, 3]], at: 0 }]),
            R("your", ["5Nf.03"], ["TWM.05"], [
              { type: 's4mix', n: 11, d: 4, to: 'mixed', show: 'line', max: 3 },
              { type: 's4mix', n: 8, d: 3, to: 'mixed', show: 'line', max: 3 },
              { type: 's4mix', n: 13, d: 5, to: 'mixed', show: 'line', max: 3 }])] }] },
      { id: 's4a', kit: 'model', game: 'a', surface: 'paper', art: 'icon-step-test',
        title: 'Solve it', blurb: { en: 'Answer questions like the test.', vi: 'Trả lời câu hỏi giống bài kiểm tra.' },
        levels: [
          { title: { en: "Calculate", vi: "Tính" }, rounds: [
            R("your", ["5Nf.02"], ["TWM.05"], [
              { type: 's4of', items: [[3, 5, 35], [5, 8, 48]] },
              { type: 's4of', items: [[2, 7, 42], [5, 6, 54]] },
              { type: 's4of', items: [[3, 4, 36], [4, 9, 63]] }]),
            R("your", ["5Nf.01"], ["TWM.05"], [
              { type: 's4div', form: 'frac', a: 9, b: 10 },
              { type: 's4div', form: 'frac', a: 3, b: 4 },
              { type: 's4div', form: 'frac', a: 23, b: 100 }]),
            R("your", ["5Nf.03"], ["TWM.05"], [
              { type: 's4mix', n: 13, d: 5, to: 'mixed' },
              { type: 's4mix', n: 17, d: 6, to: 'mixed' },
              { type: 's4mix', n: 19, d: 8, to: 'mixed' }])] },
          { title: { en: "Stories and claims", vi: "Bài toán và nhận định" }, rounds: [
            R("your", ["5Nf.02"], ["TWM.01"], [
              { type: 's4left', ask: 'who', at: 1, unit: 'marbles', gone: 'gave away',
                text: "Khoa has <b>32</b> marbles. He gives 5/8 of them to his brother. Vy has <b>24</b> marbles. She gives 1/3 of them to her friend.",
                a: { who: 'Khoa', of: 32, n: 5, d: 8 }, b: { who: 'Vy', of: 24, n: 1, d: 3 } },
              { type: 's4left', ask: 'who', at: 0, unit: 'lychees', gone: 'gave away',
                text: "Tam has <b>40</b> lychees. She gives 3/5 of them to her grandma. Duy has <b>28</b> lychees. He gives 2/7 of them to his sister.",
                a: { who: 'Tam', of: 40, n: 3, d: 5 }, b: { who: 'Duy', of: 28, n: 2, d: 7 } },
              { type: 's4left', ask: 'who', at: 2, unit: 'beads', gone: 'used',
                text: "Truc has <b>45</b> beads. She uses 5/9 of them for a necklace. Yen has <b>36</b> beads. She uses 1/3 of them for a bracelet.",
                a: { who: 'Truc', of: 45, n: 5, d: 9 }, b: { who: 'Yen', of: 36, n: 1, d: 3 } }]),
            R("your", ["5Nf.03"], ["TWM.04", "TWM.07"], [
              C({ who: "Hieu", ok: false, at: 1, fact: { l: [7, 4], rel: '<', r: 1 },
                says: "7/4 is less than 1 because 4 is less than 7.",
                reasons: [
                  { t: "7/4 is 7 quarters. 4 quarters make 1 whole, so 7/4 is more than 1." },
                  { t: "4 is less than 7, so the fraction is small.", why: "The bottom number 4 tells the size of the parts. You have 7 of them. How many quarters make 1 whole?" },
                  { t: "7/4 is equal to 1.", why: "4/4 is equal to 1. 7/4 has 3 more quarters." }],
                hint: { pic: { k: 's4mixed', n: 7, d: 4, kind: 'circles' }, step: "4 quarters make 1 whole. Count the quarters in 7/4." },
                worked: "7 ÷ 4 = 1 remainder 3, so 7/4 = 1 3/4. That is more than 1.",
                model: "Hieu is incorrect because 4 quarters make 1 whole, so 7/4 is more than 1." }),
              C({ who: "Nhi", ok: true, at: 0, fact: { l: [9, 5], rel: '>', r: 1 },
                says: "9/5 is more than 1 because 9 fifths are more than 5 fifths.",
                reasons: [
                  { t: "5 fifths make 1 whole, and 9 fifths are 4 fifths more." },
                  { t: "9 is a big number.", why: "A big top number is not enough. Compare it with the bottom number: 5 fifths make 1 whole." },
                  { t: "9/5 = 9 − 5 = 4.", why: "The fraction bar means divide, not subtract. 9 ÷ 5 = 1 remainder 4." }],
                hint: { pic: { k: 's4mixed', n: 9, d: 5, kind: 'bars' }, step: "5 fifths make 1 whole. Count the fifths in 9/5." },
                worked: "9 ÷ 5 = 1 remainder 4, so 9/5 = 1 4/5. That is more than 1.",
                model: "Nhi is correct because 5 fifths make 1 whole, and 9 fifths are more." }),
              C({ who: "Luan", ok: false, at: 2, fact: { l: [8, 3], rel: '=', r: { mix: [3, 2, 3] } },
                says: "8/3 = 3 2/3 because the 3 at the bottom is the number of wholes.",
                reasons: [
                  { t: "8 ÷ 3 = 2 remainder 2, so 8/3 = 2 2/3." },
                  { t: "3 2/3 is right because 3 + 2 + 3 = 8.", why: "Do not add the digits. 3 wholes are 9 thirds already. That is more than 8 thirds." },
                  { t: "8/3 is less than 1.", why: "3 thirds make 1 whole. 8 thirds are more than that." }],
                hint: { pic: { k: 's4mixed', n: 8, d: 3, kind: 'circles' }, step: "The bottom number tells how many parts make 1 whole. How many wholes can 8 thirds make?" },
                worked: "3 thirds make 1 whole. 8 ÷ 3 = 2 remainder 2, so 8/3 = 2 2/3, not 3 2/3.",
                model: "Luan is incorrect because 8 ÷ 3 = 2 remainder 2, so 8/3 = 2 2/3." })])] }] }
    ],

    /* ---------- Notes: how to do it, each with a worked example and a picture; then one gap sentence per note ---------- */
    notes: {
      items: [
        { en: 'A fraction is a division: [[numerator]] ÷ [[denominator]]. 3 cakes [[shared equally|share equally]] among 4 children is 3/4 each.',
          vi: 'Phân số là một phép chia: tử số ÷ mẫu số. 3 cái bánh chia đều cho 4 bạn thì mỗi bạn được 3/4 cái bánh.',
          example: ['3 mooncakes for 4 children: 3 ÷ 4.', 'Each child gets *3/4* of a mooncake.', 'In the same way, 1 ÷ 5 = *1/5*, 9 ÷ 10 = *9/10* and 1 ÷ 100 = *1/100*.'],
          pic: { k: 's4share', wholes: 3, people: 4, each: true } },
        { en: 'A [[proper fraction]] can be an [[operator]]. Divide by the denominator to find one part. Then multiply by the numerator.',
          vi: 'Phân số bé hơn 1 có thể dùng để tìm phân số của một số. Chia cho mẫu số để tìm một phần. Sau đó nhân với tử số.',
          example: ['3/4 of 20: 20 ÷ 4 = 5. That is one quarter.', '5 × 3 = *15*. That is three quarters.'],
          pic: { k: 's4bar', parts: 4, shade: 3, whole: 20, each: 5, part: 15 } },
        { en: 'To find what is left, subtract the part from the whole.',
          vi: 'Để tìm phần còn lại, lấy tất cả trừ đi phần đã cho hoặc đã dùng.',
          example: ['Vy has 24 beads. She uses 1/3 of them.', '1/3 of 24 = 8, and 24 − 8 = *16* beads are left.', 'Check: 2/3 are left, and 2/3 of 24 = 16.'],
          pic: { k: 's4bar', parts: 3, shade: 2, from: 'end', whole: 24, each: 8, part: 16 } },
        { en: 'When you know a part, find one equal part first. Then build the whole.',
          vi: 'Khi biết giá trị của mấy phần, hãy tìm giá trị của một phần trước. Sau đó tìm cả số.',
          example: ['2/3 of a number is 12.', 'One third is 12 ÷ 2 = 6.', 'The whole is three thirds: 6 × 3 = *18*.'],
          pic: { k: 's4bar', parts: 3, shade: 2, whole: 18, each: 6, part: 12 } },
        { en: 'An [[improper fraction]] is 1 whole or more. Divide to write it as a [[mixed number]].',
          vi: 'Phân số có tử số lớn hơn hoặc bằng mẫu số thì lớn hơn hoặc bằng 1. Chia tử số cho mẫu số để viết thành hỗn số.',
          example: ['7/4: 7 ÷ 4 = 1 remainder 3.', 'So 7/4 = *1 3/4*: 1 whole and 3 quarters.'],
          pic: { k: 's4mixed', n: 7, d: 4, kind: 'circles', label: 'both' } },
        { en: 'To change a mixed number to an improper fraction, change the wholes into parts. Then add. The two numbers are [[equivalent]].',
          vi: 'Để đổi hỗn số thành phân số, đổi phần nguyên thành các phần bằng nhau, rồi cộng thêm tử số. Hai số có giá trị bằng nhau.',
          example: ['2 1/3: 2 wholes are 2 × 3 = 6 thirds.', '6 + 1 = 7 thirds. So 2 1/3 = *7/3*.'],
          pic: { k: 's4line', max: 3, d: 3, at: 7, label: 'both', count: true } }
      ],
      check: [
        { sentence: '7 ÷ 10 = {7/10|10/7|1/10}.', answer: '7/10' },
        { sentence: '2/5 of 30 = {12|6|15}.', answer: '12' },
        { sentence: 'An has 20 marbles. He gives away 1/4 of them. He has {15|5|16} marbles left.', answer: '15' },
        { sentence: '3/4 of a number is 9. The number is {12|27|36}.', answer: '12' },
        { sentence: '9/4 = {2 1/4|1 1/4|4 1/2}.', answer: '2 1/4' },
        { sentence: '1 2/5 = {7/5|3/5|12/5}.', answer: '7/5' }
      ]
    },

    /* ---------- Mini Practice test: 10 questions, DOK 1, 1, 1, 1, 2, 2, 2, 2, 2, 3; three sets of numbers ---------- */
    test: {
      items: [
        Q(1, ["5Nf.01"], ["TWM.05"], [
          { type: 's4div', form: 'frac', a: 3, b: 10 },
          { type: 's4div', form: 'frac', a: 41, b: 100 },
          { type: 's4div', form: 'frac', a: 7, b: 100 }]),
        Q(1, ["5Nf.02"], ["TWM.05"], [
          { type: 's4of', items: [[3, 4, 28], [2, 5, 45]] },
          { type: 's4of', items: [[2, 3, 27], [3, 8, 56]] },
          { type: 's4of', items: [[5, 6, 42], [3, 7, 35]] }]),
        Q(1, ["5Nf.03"], ["TWM.05"], [
          { type: 's4mix', n: 9, d: 4, to: 'mixed' },
          { type: 's4mix', n: 11, d: 3, to: 'mixed' },
          { type: 's4mix', n: 13, d: 6, to: 'mixed' }]),
        Q(1, ["5Nf.03"], ["TWM.05"], [
          { type: 's4mix', n: 13, d: 5, to: 'improper' },
          { type: 's4mix', n: 13, d: 4, to: 'improper' },
          { type: 's4mix', n: 9, d: 2, to: 'improper' }]),
        Q(2, ["5Nf.01"], ["TWM.01"], [
          { type: 's4div', a: 3, b: 4, one: 'mooncake', many: 'mooncakes',
            text: "Grandma shares <b>3</b> mooncakes equally among <b>4</b> children. What fraction of a mooncake does each child get?" },
          { type: 's4div', a: 3, b: 10, one: 'pancake', many: 'pancakes', who: 'friends', each: 'friend',
            text: "<b>3</b> pancakes are shared equally among <b>10</b> friends. What fraction of a pancake does each friend get?" },
          { type: 's4div', a: 7, b: 10, one: 'rice cake', many: 'rice cakes', kind: 'cake', who: 'people', each: 'person',
            text: "At Tet, <b>7</b> rice cakes are shared equally among <b>10</b> people. What fraction of a rice cake does each person get?" }]),
        Q(2, ["5Nf.03"], ["TWM.05"], [
          { type: 's4mix', n: 7, d: 3, to: 'mixed', show: 'line', max: 3 },
          { type: 's4mix', n: 11, d: 5, to: 'mixed', show: 'line', max: 3 },
          { type: 's4mix', n: 5, d: 2, to: 'mixed', show: 'line', max: 3 }]),
        Q(2, ["5Nf.02"], ["TWM.01"], [
          { type: 's4whole', n: 3, d: 4, part: 36, line: "The book has {0} pages.",
            text: "Binh has read <b>36</b> pages of his book. That is 3/4 of the book. How many pages does the whole book have?" },
          { type: 's4whole', n: 2, d: 5, part: 18, line: "The bus has {0} seats.",
            text: "<b>18</b> seats on a bus are taken. That is 2/5 of all the seats. How many seats does the bus have?" },
          { type: 's4whole', n: 4, d: 7, part: 28, line: "The class has {0} children.",
            text: "<b>28</b> children in a class walk to school. That is 4/7 of the class. How many children are in the class?" }]),
        Q(2, ["5Nf.02"], ["TWM.01"], [
          { type: 's4left', unit: 'marbles', gone: 'gave away',
            text: "Quan has <b>42</b> marbles. He gives 2/7 of them to his cousin. Trang has <b>36</b> marbles. She gives 4/9 of them to her cousin.",
            a: { who: 'Quan', of: 42, n: 2, d: 7 }, b: { who: 'Trang', of: 36, n: 4, d: 9 } },
          { type: 's4left', unit: 'pages', gone: 'has read', left: 'left to read',
            text: "Phong's book has <b>60</b> pages. He has read 7/10 of them. Giang's book has <b>72</b> pages. She has read 5/8 of them.",
            a: { who: 'Phong', of: 60, n: 7, d: 10 }, b: { who: 'Giang', of: 72, n: 5, d: 8 } },
          { type: 's4left', unit: 'lychees', gone: 'gave away',
            text: "Kha picks <b>56</b> lychees. He gives 3/8 of them to his neighbour. Bich picks <b>50</b> lychees. She gives 3/5 of them to her aunt.",
            a: { who: 'Kha', of: 56, n: 3, d: 8 }, b: { who: 'Bich', of: 50, n: 3, d: 5 } }]),
        Q(2, ["5Nf.02"], ["TWM.07"], [
          { type: 's4left', ask: 'who', at: 0, unit: 'beads', gone: 'used',
            text: "Hoa has <b>54</b> beads. She uses 2/3 of them for a bracelet. Tu has <b>40</b> beads. He uses 3/8 of them for a key ring.",
            a: { who: 'Hoa', of: 54, n: 2, d: 3 }, b: { who: 'Tu', of: 40, n: 3, d: 8 } },
          { type: 's4left', ask: 'who', at: 2, unit: 'football cards', gone: 'gave away',
            text: "An has <b>63</b> football cards. He gives 4/7 of them to his cousin. Dung has <b>50</b> football cards. She gives 2/5 of them to her brother.",
            a: { who: 'An', of: 63, n: 4, d: 7 }, b: { who: 'Dung', of: 50, n: 2, d: 5 } },
          { type: 's4left', ask: 'who', at: 1, unit: 'toy cars', gone: 'gave away',
            text: "Thinh has <b>64</b> toy cars. He gives 5/8 of them to a school fair. Khoi has <b>35</b> toy cars. He gives 1/5 of them to the fair.",
            a: { who: 'Thinh', of: 64, n: 5, d: 8 }, b: { who: 'Khoi', of: 35, n: 1, d: 5 } }]),
        Q(3, ["5Nf.03", "5Nf.02"], ["TWM.04", "TWM.07"], [
          C({ who: "Toan", ok: false, at: 1, ctx: "Toan looks at the fractions 3/4, 2/5 and 9/8.",
            fact: { all: [{ l: [3, 4], rel: '<', r: 1 }, { l: [2, 5], rel: '<', r: 1 }, { l: [9, 8], rel: '<', r: 1 }] },
            says: "A fraction is always less than 1 whole.",
            reasons: [
              { t: "9/8 is 9 eighths. 8 eighths make 1 whole, so 9/8 is more than 1." },
              { t: "3/4 is less than 1.", why: "That is true for 3/4. Now check 9/8." },
              { t: "a fraction is a part of a whole, so it is always small.", why: "Some fractions have more parts than 1 whole has. How many eighths make 1 whole?" }],
            hint: { pic: { k: 's4mixed', n: 9, d: 8, kind: 'circles' }, step: "Check each fraction. Compare the top number with the bottom number." },
            worked: "3/4 and 2/5 are less than 1. But 9 ÷ 8 = 1 remainder 1, so 9/8 = 1 1/8. That is more than 1.",
            model: "Toan is incorrect because 9/8 = 1 1/8, and that is more than 1 whole." }),
          C({ who: "Yen", ok: true, at: 0, ctx: "Yen finds 2/3 of <b>12</b>, of <b>30</b> and of <b>45</b>.",
            fact: { all: [{ l: { of: [2, 3, 12] }, rel: '<', r: 12 }, { l: { of: [2, 3, 30] }, rel: '<', r: 30 }, { l: { of: [2, 3, 45] }, rel: '<', r: 45 }] },
            says: "2/3 of an amount is always less than the whole amount.",
            reasons: [
              { t: "2/3 means 2 of 3 equal parts, so 1 part is always left out. For example, 2/3 of 30 is 20." },
              { t: "2 is less than 3, so 2/3 of 30 is 2.", why: "2/3 of 30 is not 2. Divide 30 by 3, then multiply by 2." },
              { t: "you only divide, and dividing makes a number smaller.", why: "You divide by 3 and then you multiply by 2. Check with 2/3 of 12." }],
            hint: { pic: { k: 's4bar', parts: 3, shade: 2, whole: 30, each: '?', part: '?' }, step: "Work out 2/3 of each number. Compare each answer with the number." },
            worked: "2/3 of 12 = 8, 2/3 of 30 = 20 and 2/3 of 45 = 30. Each answer is less than the number, because only 2 of the 3 equal parts are taken.",
            model: "Yen is correct because 2/3 means 2 of 3 equal parts, so 1 part is always left out." }),
          C({ who: "Son", ok: false, at: 2, ctx: "Son changes a mixed number to an improper fraction.",
            fact: { l: { mix: [2, 1, 3] }, rel: '=', r: [3, 3] },
            says: "You just add the whole number to the top number. So 2 1/3 = 3/3.",
            reasons: [
              { t: "1 whole is 3 thirds, so 2 wholes are 6 thirds. 6 + 1 = 7, so 2 1/3 = 7/3." },
              { t: "3/3 is equal to 1, and 2 1/3 is equal to 1 too.", why: "2 1/3 is more than 2. It cannot be equal to 1." },
              { t: "you must multiply 2 × 1 = 2, so 2 1/3 = 2/3.", why: "2/3 is less than 1, but 2 1/3 is more than 2. Change each whole into 3 thirds." }],
            hint: { pic: { k: 's4mixed', n: 7, d: 3, kind: 'circles' }, step: "3/3 is exactly 1 whole. Is 2 1/3 equal to 1 whole? Count the thirds." },
            worked: "3/3 = 1 whole, but 2 1/3 is more than 2. Each whole is 3 thirds: 2 × 3 = 6 thirds, and 1 more makes 7 thirds. So 2 1/3 = 7/3.",
            model: "Son is incorrect because 2 wholes are 6 thirds, and 6 + 1 = 7, so 2 1/3 = 7/3." })])
      ]
    },

    /* ---------- Lightning round: quick questions, the first answer is the right one (made and checked by a script) ---------- */
    lightning: {
      secs: 60,
      items: [
        ["3/4 of 20", ["15", "5", "20"]],["2/3 of 12", ["8", "4", "12"]],["2/5 of 20", ["8", "4", "12"]],
        ["3/5 of 30", ["18", "6", "12"]],["5/6 of 18", ["15", "3", "18"]],["3/8 of 16", ["6", "2", "10"]],
        ["2/7 of 21", ["6", "3", "15"]],["4/5 of 40", ["32", "8", "40"]],["3/10 of 50", ["15", "5", "35"]],
        ["7/10 of 30", ["21", "3", "9"]],["5/8 of 40", ["25", "5", "15"]],["2/9 of 27", ["6", "3", "21"]],
        ["3/4 of 32", ["24", "8", "32"]],["5/6 of 60", ["50", "10", "60"]],["4/7 of 28", ["16", "4", "12"]],
        ["2/3 of 33", ["22", "11", "33"]],["7/8 of 24", ["21", "3", "24"]],["9/10 of 100", ["90", "10", "100"]],
        ["1/5 of 45", ["9", "36", "14"]],["1/8 of 72", ["9", "63", "17"]],["1 ÷ 8 = ?", ["1/8", "8", "7/8"]],
        ["3 ÷ 4 = ?", ["3/4", "4/3", "1/4"]],["1 ÷ 5 = ?", ["1/5", "5", "4/5"]],["9 ÷ 10 = ?", ["9/10", "10/9", "1/10"]],
        ["7 ÷ 10 = ?", ["7/10", "10/7", "1/10"]],["3 ÷ 100 = ?", ["3/100", "100/3", "1/100"]],["37 ÷ 100 = ?", ["37/100", "100/37", "37/10"]],
        ["1 ÷ 3 = ?", ["1/3", "3", "2/3"]],["3/4 means", ["3 ÷ 4", "4 ÷ 3", "3 × 4"]],["9/10 means", ["9 ÷ 10", "10 ÷ 9", "9 × 10"]],
        ["1/6 means", ["1 ÷ 6", "6 ÷ 1", "1 × 6"]],["7/100 means", ["7 ÷ 100", "100 ÷ 7", "7 × 100"]],["7/4 as a mixed number", ["1 3/4", "2 3/4", "1 2/4"]],
        ["5/3 as a mixed number", ["1 2/3", "2 2/3", "1 1/3"]],["9/2 as a mixed number", ["4 1/2", "5 1/2", "9 1/2"]],["11/4 as a mixed number", ["2 3/4", "3 3/4", "2 2/4"]],
        ["8/5 as a mixed number", ["1 3/5", "2 3/5", "1 4/5"]],["13/6 as a mixed number", ["2 1/6", "3 1/6", "2 2/6"]],["10/3 as a mixed number", ["3 1/3", "4 1/3", "3 2/3"]],
        ["17/8 as a mixed number", ["2 1/8", "3 1/8", "2 2/8"]],["7/2 as a mixed number", ["3 1/2", "4 1/2", "7 1/2"]],["23/10 as a mixed number", ["2 3/10", "3 3/10", "2 4/10"]],
        ["1 1/2 as an improper fraction", ["3/2", "2/2", "11/2"]],["2 1/3 as an improper fraction", ["7/3", "3/3", "21/3"]],["1 3/4 as an improper fraction", ["7/4", "4/4", "13/4"]],
        ["3 1/2 as an improper fraction", ["7/2", "4/2", "31/2"]],["2 3/5 as an improper fraction", ["13/5", "5/5", "23/5"]],["1 5/6 as an improper fraction", ["11/6", "6/6", "15/6"]],
        ["4 1/3 as an improper fraction", ["13/3", "5/3", "41/3"]],["2 5/8 as an improper fraction", ["21/8", "7/8", "25/8"]],["3 3/4 as an improper fraction", ["15/4", "6/4", "33/4"]],
        ["1 7/10 as an improper fraction", ["17/10", "8/10", "27/10"]],["1/4 of a number is 5. The number is", ["20", "9", "24"]],["1/3 of a number is 8. The number is", ["24", "11", "27"]],
        ["1/5 of a number is 6. The number is", ["30", "11", "35"]],["1/2 of a number is 15. The number is", ["30", "17", "32"]],["1/10 of a number is 7. The number is", ["70", "17", "80"]],
        ["1/6 of a number is 4. The number is", ["24", "10", "30"]],["9/7 is", ["more than 1", "less than 1", "equal to 1"]],["4/9 is", ["less than 1", "more than 1", "equal to 1"]],
        ["6/6 is", ["equal to 1", "more than 1", "less than 1"]],["11/10 is", ["more than 1", "less than 1", "equal to 1"]],["7/8 is", ["less than 1", "more than 1", "equal to 1"]],
        ["10/10 is", ["equal to 1", "more than 1", "less than 1"]],["How many quarters make 2 wholes?", ["8", "6", "4"]],["How many halves make 3 wholes?", ["6", "5", "2"]],
        ["How many fifths make 2 wholes?", ["10", "7", "5"]],["How many thirds make 3 wholes?", ["9", "6", "3"]]
      ]
    },

    /* ---------- My self-check ---------- */
    selfcheck: {
      goals: ["write a division as a fraction, like 3 ÷ 4 = 3/4", "find a fraction of an amount, like 3/4 of 20",
        "work out what is left and say who has more", "change between improper fractions and mixed numbers"],
      again: ["c", "r", "a", "r"]
    }
  };

  // the questions: every a/b in their texts becomes a real fraction (numerator over denominator)
  MX.s4deep(pack.see); MX.s4deep(pack.practise); MX.s4deep(pack.test);
})(window.T = window.T || {});
