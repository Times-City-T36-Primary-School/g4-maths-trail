/* 22-pack-stop9.js - ALL the content of Stop 9, Mode and median (Grade 4, Stage 5; objective 5Ss.03).
   Parts: words, see, practise, notes, test, lightning, selfcheck.
   Every answer is worked out in code from the data of the question: the models are in 009d_g4-models-s9.js (s9mode,
   s9median, s9both, s9table2, s9freq, s9say, s9kind, s9best, s9pickpic, s9missing and the claims with s9: {...}); the
   pictures (data cards, a data table, a tally / frequency table, a bar chart, a dot plot) are in 047g_g4-pics-s9.js;
   the word card pictures are in 017w_g4-art-s9.js. A question here is only its data: a list or a frequency table, a
   context sentence (ctx) and a unit. */
(function (T) {
  'use strict';

  const LO = ["5Ss.03"];
  const R = (mode, twm, v) => ({ mode: mode, lo: LO, twm: twm, v: v });
  const Q = (dok, twm, v) => ({ dok: dok, lo: LO, twm: twm, v: v });
  const KIDS = 'Number of children';

  /* Lightning round: the lists are data, the three answers are worked out here (the first one is right). */
  function lightning() {
    const S9 = window.MX.s9, out = [], say = a => a.join(', ');
    const pick2 = (right, cands) => { const w = []; cands.forEach(c => { const s = String(c); if (s !== String(right) && w.indexOf(s) < 0 && w.length < 2) w.push(s); }); return w; };
    // one mode
    [[3, 5, 5, 7], [2, 2, 6, 9], [4, 8, 8, 1], [7, 7, 3, 5], [1, 9, 4, 9], [6, 2, 6, 8], [10, 12, 10, 15], [5, 3, 5, 5, 8], [9, 4, 4, 7, 4], [2, 6, 2, 7, 6, 2],
      [20, 30, 20, 50], [11, 14, 14, 18], [0, 1, 0, 3, 0], [8, 6, 9, 6, 3], [15, 25, 15, 35], [1, 1, 2, 3, 1, 2], [7, 9, 9, 9, 7], [40, 60, 60, 80], [3, 0, 3, 5, 0, 3], [12, 16, 12, 19],
      [5, 9, 6, 9, 2], [13, 10, 13, 17]].forEach(a => {
      const m = S9.modes(a); if (m.length !== 1) throw new Error('lightning: one mode wanted in ' + a);
      const s = S9.asc(a), others = s.filter(v => v !== m[0]);
      out.push(['Mode: ' + say(a), [String(m[0])].concat(pick2(m[0], [others[others.length - 1], others[0], a.filter(v => v === m[0]).length, a.length]))]);
    });
    // the median: the lists are NOT in order
    [[2, 9, 4], [7, 1, 5], [8, 3, 6], [10, 4, 7], [5, 12, 9], [6, 2, 11], [20, 50, 30], [15, 5, 10], [3, 8, 1, 6, 4], [9, 2, 7, 5, 3],
      [4, 10, 6, 1, 8], [12, 7, 15, 9, 11], [1, 9, 5, 3, 7], [6, 8, 2, 4, 10], [30, 10, 50, 20, 40], [5, 5, 9, 2, 7], [13, 18, 11, 16, 14], [8, 1, 8, 3, 6], [25, 15, 35, 5, 45], [7, 2, 9, 4, 2],
      [14, 6, 10], [19, 12, 16, 11, 17]].forEach(a => {
      const med = S9.median(a), s = S9.asc(a);
      out.push(['Median: ' + say(a), [String(med)].concat(pick2(med, [S9.midRaw(a), s[s.length - 1], s[0], a[0]]))]);
    });
    // no mode, and two modes
    [[1, 2, 3, 4], [5, 7, 9], [2, 4, 6, 8, 10], [3, 6, 1, 8]].forEach(a => {
      if (S9.modes(a).length) throw new Error('lightning: no mode wanted in ' + a);
      const s = S9.asc(a); out.push(['Mode: ' + say(a), ['no mode', String(s[s.length - 1]), String(s[0])]]);
    });
    [[2, 2, 5, 5, 9], [4, 7, 4, 7, 1], [1, 3, 3, 6, 6], [8, 8, 2, 5, 5]].forEach(a => {
      const m = S9.modes(a); if (m.length !== 2) throw new Error('lightning: two modes wanted in ' + a);
      out.push(['Mode: ' + say(a), [m[0] + ' and ' + m[1], m[0] + ' only', 'no mode']]);
    });
    // the place of the median in an odd number of values
    [[3, '2nd', ['1st', '3rd']], [5, '3rd', ['2nd', '5th']], [7, '4th', ['3rd', '7th']], [9, '5th', ['4th', '9th']], [11, '6th', ['5th', '11th']]].forEach(x => {
      if ((x[0] + 1) / 2 !== parseInt(x[1], 10)) throw new Error('lightning: place of the median');
      out.push([x[0] + ' values in order: the median is the', [x[1]].concat(x[2])]);
    });
    // the words
    return out.concat([
      ['The value you see most often', ['mode', 'median', 'middle']],
      ['The middle value, in order', ['median', 'mode', 'frequency']],
      ['How many times a value comes', ['frequency', 'median', 'order']],
      ['Favourite colours: which average?', ['mode', 'median', 'both']],
      ['The tallest bar shows the', ['mode', 'median', 'smallest value']],
      ['First step to find the median', ['order the values', 'add the values', 'count the bars']],
      ['Most children chose mango. Mango is the', ['mode', 'median', 'frequency']],
      ['2, 3, 4, 5, 90. Change 90 to 900. The median', ['stays 4', 'goes up', 'is 900']],
      ['Pet names: can you find a median?', ['no', 'yes', 'only with a chart']],
      ['The column with the most dots shows the', ['mode', 'median', 'biggest value']]
    ]);
  }

  T.packs[9] = {
    n: 9,
    title: "Mode and median",
    los: LO,
    blurb: {
      en: "Find the *mode* and the *median*. Choose the best one for the data.",
      vi: "Tìm *mốt* và *trung vị*. Chọn giá trị phù hợp nhất với dữ liệu."
    },

    /* ---------------- Words: 9 picture cards in 3 sets ---------------- */
    words: {
      sets: [
        { id: 'A', title: { en: 'Collect data', vi: 'Thu thập dữ liệu' }, keys: ['data', 'value', 'tally'] },
        { id: 'B', title: { en: 'The mode', vi: 'Mốt' }, keys: ['frequency', 'mode', 'average'] },
        { id: 'C', title: { en: 'The median', vi: 'Trung vị' }, keys: ['order', 'middle', 'median'] }
      ],
      items: {
        'data': { art: 'w-s9-data', vi: 'dữ liệu', def: 'Facts or numbers that you collect. The marks of a class are data.' },
        'value': { art: 'w-s9-value', vi: 'giá trị', def: 'One number or answer in the data. In 3, 8, 5 the values are 3, 8 and 5.' },
        'tally': { art: 'w-s9-tally', vi: 'vạch kiểm đếm', def: 'Marks that help you count in fives. Four lines and one line across make 5.' },
        'frequency': { art: 'w-s9-frequency', vi: 'tần số', def: 'How many times a value comes. In 5, 2, 5, 5 the frequency of 5 is 3.' },
        'mode': { art: 'w-s9-mode', vi: 'mốt', def: 'The value that comes most often. The mode of 4, 7, 7, 9 is 7.' },
        'average': { art: 'w-s9-average', vi: 'giá trị đại diện', def: 'One value that describes a whole set of data. The mode and the median are averages.' },
        'order': { art: 'w-s9-order', vi: 'sắp xếp theo thứ tự', def: 'To put values from smallest to biggest. 7, 2, 5 in order is 2, 5, 7.' },
        'middle': { art: 'w-s9-middle', vi: 'ở giữa', def: 'The place with the same number of things on each side. In 2, 5, 7 the middle is 5.' },
        'median': { art: 'w-s9-median', vi: 'trung vị', def: 'The middle value when the values are in order. The median of 1, 3, 6, 8, 9 is 6.' }
      }
    },

    /* ---------------- See it: one challenge scene, 5 picture-led rounds ---------------- */
    see: {
      scenes: [
        { id: 'challenge', title: { en: 'Cards, bars and dots', vi: 'Thẻ số, cột và chấm' },
          challenge: {
            end: { en: 'You did it! You can see the mode and the median in a picture.', vi: 'Em làm được rồi! Em nhìn hình và tìm được mốt và trung vị.' },
            result: 'You found the mode on cards, bars and dots, and the median with cards in order.',
            rounds: [
              R("our", ["TWM.05"], [
                { type: 's9mode', ctx: "Khoa's team plays <b>7</b> football matches. Each card shows the goals in one match.", data: [2, 0, 4, 2, 1, 2, 4], unit: 'goals' },
                { type: 's9mode', ctx: "Lan asks <b>7</b> friends how many books they read in June.", data: [4, 6, 3, 6, 5, 6, 1], unit: 'books' },
                { type: 's9mode', ctx: "Each card shows the temperature at noon on one of <b>7</b> days.", data: [28, 31, 29, 31, 30, 27, 31], unit: '°C' }]),
              R("our", ["TWM.05"], [
                { type: 's9median', ctx: "<b>5</b> children measure their heights.", data: [132, 127, 140, 135, 129], unit: 'cm' },
                { type: 's9median', ctx: "<b>5</b> buses wait at the station. Each card shows the passengers on one bus.", data: [18, 25, 12, 30, 21], unit: 'passengers' },
                { type: 's9median', ctx: "<b>5</b> bags of rice are on the scales.", data: [45, 35, 50, 40, 55], unit: 'kg' }]),
              R("your", ["TWM.05"], [
                { type: 's9freq', show: 'bar', ctx: "Class 4B votes for a favourite fruit.", head: ['Fruit', KIDS], cats: ['mango', 'banana', 'lychee', 'guava', 'orange'], freq: [7, 4, 9, 3, 5], at: 2 },
                { type: 's9freq', show: 'bar', ctx: "Children say how they come to school.", head: ['How they come', KIDS], cats: ['walk', 'bike', 'bus', 'car', 'scooter'], freq: [6, 8, 5, 2, 11], at: 0 },
                { type: 's9freq', show: 'bar', ctx: "A stall at the Tet market counts the flowers it sells in one hour.", head: ['Flower', 'Number sold'], cats: ['peach', 'apricot', 'daisy', 'rose', 'lily'], freq: [8, 10, 4, 6, 3], at: 3 }]),
              R("your", ["TWM.05"], [
                { type: 's9freq', show: 'dot', ctx: "The dot plot shows how many pets each child has.", head: ['Number of pets'], cats: [0, 1, 2, 3, 4], freq: [3, 6, 4, 1, 1] },
                { type: 's9freq', show: 'dot', ctx: "The dot plot shows the goals in each match of a school cup.", head: ['Goals in a match'], cats: [0, 1, 2, 3, 4, 5], freq: [2, 3, 5, 2, 1, 1], unit: 'goals' },
                { type: 's9freq', show: 'dot', ctx: "The dot plot shows how many brothers and sisters each child has.", head: ['Number of brothers and sisters'], cats: [0, 1, 2, 3, 4], freq: [4, 5, 7, 2, 1] }]),
              R("your", ["TWM.07"], [
                { type: 's9pickpic', ctx: "Yen wants the median of these marks.", data: [8, 3, 9, 1, 6], at: 1 },
                { type: 's9pickpic', ctx: "Son wants the median of these ages.", data: [15, 11, 19, 12, 17], at: 2 },
                { type: 's9pickpic', ctx: "Vy wants the median of these prices.", data: [40, 70, 20, 50, 30], at: 0 }])
            ] } }]
    },

    /* ---------------- Practise: Draw it (pictures) and Solve it (like the test) ---------------- */
    practise: [
      { id: 's9r', kit: 'model', game: 'r', surface: 'board', art: 'icon-step-practise',
        title: 'Draw it', blurb: { en: 'Tally charts, tables, dot plots and data cards.', vi: 'Bảng kiểm đếm, bảng số liệu, biểu đồ chấm và thẻ số.' },
        levels: [
          { title: { en: "Charts and tables", vi: "Biểu đồ và bảng" }, rounds: [
            R("our", ["TWM.05"], [
              { type: 's9freq', show: 'tally', ctx: "Trang asks her class about their favourite Tet food.", head: ['Food'], cats: ['banh chung', 'spring rolls', 'sticky rice', 'candied fruit'], freq: [9, 12, 6, 4], at: 1 },
              { type: 's9freq', show: 'tally', ctx: "Son counts what passes the school gate in ten minutes.", head: ['What passes'], cats: ['bike', 'car', 'bus', 'motorbike'], freq: [7, 5, 3, 14], at: 3 },
              { type: 's9freq', show: 'tally', ctx: "Chi counts the birds at the lake.", head: ['Bird'], cats: ['duck', 'heron', 'sparrow', 'swallow'], freq: [6, 2, 11, 8], at: 0 }]),
            R("your", ["TWM.05"], [
              { type: 's9freq', show: 'table', ctx: "The table shows the marks of class 4B in a spelling quiz.", head: ['Mark', KIDS], cats: [6, 7, 8, 9, 10], freq: [3, 5, 9, 6, 2], unit: 'marks' },
              { type: 's9freq', show: 'table', ctx: "The table shows how many books each child borrows in a week.", head: ['Books', KIDS], cats: [0, 1, 2, 3, 4], freq: [2, 7, 10, 4, 1], unit: 'books' },
              { type: 's9freq', show: 'table', ctx: "The table shows how many hours of sport each child plays in a week.", head: ['Hours', KIDS], cats: [1, 2, 3, 4, 5], freq: [4, 6, 3, 8, 2], unit: 'hours' }]),
            R("your", ["TWM.05"], [
              { type: 's9freq', show: 'dot', ask: ['mode', 'median'], ctx: "The dot plot shows the goals each of <b>11</b> players scores.", head: ['Goals'], cats: [0, 1, 2, 3, 4], freq: [1, 4, 2, 3, 1], unit: 'goals' },
              { type: 's9freq', show: 'dot', ask: ['mode', 'median'], ctx: "The dot plot shows the ages of the <b>11</b> children in a chess club.", head: ['Age in years'], cats: [8, 9, 10, 11, 12], freq: [2, 3, 1, 4, 1], unit: 'years' },
              { type: 's9freq', show: 'dot', ask: ['mode', 'median'], ctx: "The dot plot shows the number of rainy days in each of <b>9</b> weeks.", head: ['Rainy days in a week'], cats: [1, 2, 3, 4, 5], freq: [1, 3, 2, 2, 1], unit: 'days' }])] },
          { title: { en: "Find the median", vi: "Tìm trung vị" }, rounds: [
            R("your", ["TWM.05"], [
              { type: 's9median', ctx: "Class 4A grows <b>7</b> sunflowers. Each card shows a height.", data: [62, 48, 75, 53, 69, 48, 57], unit: 'cm' },
              { type: 's9median', ctx: "<b>7</b> children run 60 m. Each card shows a time.", data: [12, 15, 11, 14, 13, 16, 12], unit: 'seconds' },
              { type: 's9median', ctx: "A baker counts the loaves she sells on each of <b>7</b> days.", data: [34, 29, 41, 38, 25, 45, 31], unit: 'loaves' }]),
            R("your", ["TWM.05"], [
              { type: 's9table2', ctx: "The table shows the ages and heights of <b>5</b> children.", head: 'Child', cols: ['An', 'Chi', 'Duy', 'Lan', 'Son'],
                rows: [{ name: 'Age (years)', unit: 'years', of: 'ages', data: [9, 10, 9, 9, 10] }, { name: 'Height (cm)', unit: 'cm', of: 'heights', data: [131, 138, 127, 134, 129] }] },
              { type: 's9table2', ctx: "The table shows the weather at the lake for <b>7</b> days.", head: 'Day', cols: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                rows: [{ name: 'Temperature (°C)', unit: '°C', of: 'temperatures', data: [24, 26, 24, 27, 25, 24, 28] }, { name: 'Rain (mm)', unit: 'mm', of: 'amounts of rain', data: [5, 0, 12, 3, 8, 20, 1] }] },
              { type: 's9table2', ctx: "The table shows the lengths and speeds of <b>5</b> boats.", head: 'Boat', cols: ['A', 'B', 'C', 'D', 'E'],
                rows: [{ name: 'Length (m)', unit: 'm', of: 'lengths', data: [8, 12, 8, 15, 8] }, { name: 'Speed (km/h)', unit: 'km/h', of: 'speeds', data: [22, 35, 18, 27, 30] }] }])] }] },
      { id: 's9a', kit: 'model', game: 'a', surface: 'paper', art: 'icon-step-test',
        title: 'Solve it', blurb: { en: 'Answer questions like the test.', vi: 'Trả lời câu hỏi giống bài kiểm tra.' },
        levels: [
          { title: { en: "Mode or median?", vi: "Mốt hay trung vị?" }, rounds: [
            R("your", ["TWM.05"], [
              { type: 's9both', show: 'list', ctx: "Here are Binh's scores in <b>7</b> maths quizzes.", data: [7, 9, 6, 9, 8, 10, 5] },
              { type: 's9both', show: 'list', ctx: "Here is how many spring rolls each of <b>7</b> children eats at a party.", data: [3, 5, 2, 3, 6, 4, 7] },
              { type: 's9both', show: 'list', ctx: "Here are the times, in minutes, that <b>9</b> children take to walk to school.", data: [12, 8, 15, 20, 8, 10, 25, 8, 18], unit: 'minutes' }]),
            R("your", ["TWM.06"], [
              { type: 's9kind', ctx: "Vy asks <b>7</b> friends for their favourite colour.", data: ['red', 'blue', 'red', 'green', 'yellow', 'red', 'blue'], at: 1 },
              { type: 's9kind', ctx: "Giang asks <b>7</b> friends how many pets they have.", data: [1, 0, 2, 1, 3, 1, 0], at: 2 },
              { type: 's9kind', ctx: "Phong asks <b>7</b> friends which pet they like best.", data: ['cat', 'dog', 'fish', 'dog', 'bird', 'dog', 'cat'], at: 0 }]),
            R("your", ["TWM.07"], [
              { type: 's9best', goal: 'most', ctx: "A shop sells school T-shirts. The cards show the sizes it sells in one morning.", ask: "Which value tells the shop which size to order most?", data: [6, 10, 6, 8, 6, 14, 10, 6, 12], at: 1 },
              { type: 's9best', goal: 'middle', ctx: "<b>7</b> children measure their heights. Truc is <b>134 cm</b> tall.", ask: "Which value tells Truc if she is in the taller half of the group?", data: [128, 135, 131, 140, 128, 133, 137], unit: 'cm', own: 134, who: 'Truc', words: ['taller', 'shorter'], at: 0 },
              { type: 's9best', goal: 'most', ctx: "A bakery sells boxes of 2, 4, 6, 8 or 12 cakes. The cards show the boxes it sells today.", ask: "Which value tells the baker which box to make most?", data: [4, 6, 4, 12, 2, 4, 8, 6, 12], unit: 'cakes', at: 2 }])] },
          { title: { en: "Work backwards and explain", vi: "Tính ngược và giải thích" }, rounds: [
            R("your", ["TWM.01"], [
              { type: 's9missing', who: 'Hieu', what: 'spelling scores', one: 'score', shown: [6, 9, 9], blanks: 2, med: 7, mode: 9, max: 10 },
              { type: 's9missing', who: 'Nhi', what: 'quiz scores', one: 'score', shown: [15, 15, 10], blanks: 2, med: 12, mode: 15, max: 20 },
              { type: 's9missing', who: 'Toan', what: 'scores', one: 'score', shown: [4, 4, 6, 7], blanks: 3, med: 6, mode: 4, max: 10 }]),
            R("your", ["TWM.04", "TWM.07"], [
              { type: 'claim', who: 'Dung', at: 1, s9: { kind: 'noorder', data: [9, 4, 7, 2, 6] } },
              { type: 'claim', who: 'Tam', at: 0, s9: { kind: 'modein', data: [3, 8, 3, 5, 3, 10, 6] } },
              { type: 'claim', who: 'Bich', at: 2, s9: { kind: 'hasmode', data: [12, 5, 9, 20, 7] } }])] }] }
    ],

    /* ---------------- Notes: 6 notes, each with a worked example and a picture, then one check each ---------------- */
    notes: {
      items: [
        { en: 'The [[mode]] is the [[value]] you see most often. Count how often each value comes.',
          vi: 'Mốt là giá trị xuất hiện nhiều lần nhất. Hãy đếm xem mỗi giá trị xuất hiện bao nhiêu lần.',
          example: ['3, 5, 5, 7, 5, 2', '5 is there 3 times. No other value comes so often.', 'The mode is *5*.'],
          pic: { k: 's9cards', data: [2, 3, 5, 5, 5, 7], hl: [2, 3, 4], cap: 'The mode is 5' } },
        { en: 'The [[median]] is the [[middle]] value. First put the values in [[order]].',
          vi: 'Trung vị là giá trị ở giữa. Trước hết, hãy sắp xếp các giá trị theo thứ tự.',
          example: ['8, 3, 9, 1, 6 in order: 1, 3, 6, 8, 9.', 'Cross off pairs from both ends: 1 and 9, then 3 and 8.', 'The median is *6*.'],
          pic: { k: 's9cards', data: [1, 3, 6, 8, 9], hl: [2], cross: 2, cap: 'In order. The middle card is the median.' } },
        { en: 'In a chart, the mode has the tallest bar or the most dots. In a table, it has the highest [[frequency]].',
          vi: 'Trên biểu đồ, mốt có cột cao nhất hoặc nhiều chấm nhất. Trong bảng, mốt có tần số lớn nhất.',
          example: ['Lychee has the tallest bar: 9 children.', 'The mode is *lychee*.', 'It is not 9: 9 is the frequency.'],
          pic: { k: 's9bar', cats: ['mango', 'banana', 'lychee', 'guava'], freq: [7, 4, 9, 3], ylab: 'Children', ph: 90, vals: true, hl: true } },
        { en: 'Some [[data]] has two modes. Some data has no mode.',
          vi: 'Có bộ dữ liệu có hai mốt. Có bộ dữ liệu không có mốt.',
          example: ['2, 4, 4, 6, 6, 9: 4 and 6 are each there twice. There are *two modes*.', '1, 3, 5, 8: every value comes once. There is *no mode*.'],
          pic: { k: 's9cards', data: [2, 4, 4, 6, 6, 9], hl: [1, 2, 3, 4], cap: 'Two modes: 4 and 6' } },
        { en: 'For data that is not numbers, use the mode. Words have no middle value.',
          vi: 'Với dữ liệu không phải là số, hãy dùng mốt. Các từ không có giá trị ở giữa.',
          example: ['Favourite colours: red, blue, red, green, red.', 'The mode is *red*. Colours have no median.'],
          pic: { k: 's9tally', head: ['Colour', 'Frequency'], cats: ['red', 'blue', 'green'], freq: [7, 4, 2], tally: true, showFreq: true, hl: true } },
        { en: 'Mode and median are [[averages|average]]. The mode shows the most common value. If the biggest value gets much bigger, the median stays the same.',
          vi: 'Mốt và trung vị đều là giá trị đại diện cho dữ liệu. Mốt cho biết giá trị hay gặp nhất. Nếu giá trị lớn nhất tăng lên rất nhiều, trung vị vẫn giữ nguyên.',
          example: ['2, 3, 4, 5, 90: the median is *4*.', 'Change 90 to 900: the median is still *4*.'],
          pic: { k: 's9cards', data: [2, 3, 4, 5, 900], hl: [2], cross: 2, cap: 'The median is still 4' } }
      ],
      check: [
        { sentence: 'The mode of 4, 7, 7, 9 is {7|4|9}.', answer: '7' },
        { sentence: 'The median of 5, 1, 9 is {5|1|9}.', answer: '5' },
        { sentence: 'In a bar chart, the mode has the {tallest|shortest|first} bar.', answer: 'tallest' },
        { sentence: 'The data 2, 2, 5, 8, 8 has {two modes|no mode|one mode}.', answer: 'two modes' },
        { sentence: 'For favourite colours we can find the {mode|median|middle value}.', answer: 'mode' },
        { sentence: 'The median of 1, 2, 3, 4, 80 is {3|80|4}.', answer: '3' }
      ]
    },

    /* ---------------- Mini Practice test: 10 questions, DOK 1 1 1 1 2 2 2 2 2 3, three sets of data each ---------------- */
    test: {
      items: [
        Q(1, ["TWM.05"], [
          { type: 's9mode', show: 'list', ctx: "Here are the numbers of goals a team scores in <b>9</b> matches.", data: [1, 2, 0, 2, 3, 1, 2, 4, 2], unit: 'goals' },
          { type: 's9mode', show: 'list', ctx: "Here are the marks of <b>8</b> children in a quiz.", data: [7, 5, 8, 7, 9, 6, 7, 10], unit: 'marks' },
          { type: 's9mode', show: 'list', ctx: "Here is the rice, in kilograms, that <b>8</b> people buy.", data: [5, 10, 2, 5, 25, 10, 5, 3], unit: 'kg' }]),
        Q(1, ["TWM.05"], [
          { type: 's9median', show: 'list', ctx: "Here are the masses of <b>5</b> watermelons, in kilograms.", data: [6, 3, 8, 4, 5], unit: 'kg' },
          { type: 's9median', show: 'list', ctx: "Here are the lengths of <b>5</b> fish, in centimetres.", data: [23, 31, 18, 27, 35], unit: 'cm' },
          { type: 's9median', show: 'list', ctx: "Here are <b>5</b> long jumps, in centimetres.", data: [112, 98, 120, 105, 101], unit: 'cm' }]),
        Q(1, ["TWM.05"], [
          { type: 's9freq', show: 'bar', ctx: "Class 4C votes for a favourite sport.", head: ['Sport', KIDS], cats: ['football', 'swimming', 'chess', 'running', 'karate'], freq: [5, 8, 3, 6, 4], at: 2 },
          { type: 's9freq', show: 'bar', ctx: "A class sells drinks at the school fair.", head: ['Drink', 'Cups sold'], cats: ['milk', 'juice', 'water', 'tea', 'soya'], freq: [9, 6, 12, 3, 7], at: 1 },
          { type: 's9freq', show: 'bar', ctx: "Class 4D votes for a favourite season.", head: ['Season', KIDS], cats: ['spring', 'summer', 'autumn', 'winter'], freq: [10, 7, 8, 4], at: 3 }]),
        Q(1, ["TWM.06"], [
          { type: 's9kind', ctx: "Hoa writes down the favourite drink of <b>7</b> friends.", data: ['milk', 'juice', 'milk', 'tea', 'water', 'milk', 'juice'], at: 2 },
          { type: 's9kind', ctx: "Quan writes down the weather on <b>7</b> days.", data: ['sunny', 'rain', 'cloudy', 'rain', 'sunny', 'rain', 'windy'], at: 0 },
          { type: 's9kind', ctx: "An writes down the number of rainy days in each of <b>5</b> weeks.", data: [2, 4, 2, 5, 1], at: 1 }]),
        Q(2, ["TWM.05"], [
          { type: 's9table2', ctx: "The table shows the ages and times of <b>5</b> swimmers.", head: 'Swimmer', cols: ['Khoi', 'Truc', 'Quan', 'Nhi', 'Tu'],
            rows: [{ name: 'Age (years)', unit: 'years', of: 'ages', data: [10, 11, 10, 9, 10] }, { name: 'Time for 50 m (s)', unit: 'seconds', of: 'times', data: [48, 55, 43, 51, 46] }] },
          { type: 's9table2', ctx: "A park keeper measures <b>7</b> trees.", head: 'Tree', cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            rows: [{ name: 'Height (m)', unit: 'm', of: 'heights', data: [4, 6, 4, 5, 7, 4, 6] }, { name: 'Age (years)', unit: 'years', of: 'ages', data: [12, 20, 9, 15, 25, 11, 18] }] },
          { type: 's9table2', ctx: "The table shows <b>5</b> parcels at the post office.", head: 'Parcel', cols: ['A', 'B', 'C', 'D', 'E'], ask: [['median', 1], ['mode', 0]],
            rows: [{ name: 'Mass (kg)', unit: 'kg', of: 'masses', data: [3, 7, 3, 2, 3] }, { name: 'Price (thousand dong)', unit: 'thousand dong', of: 'prices', data: [30, 65, 28, 22, 35] }] }]),
        Q(2, ["TWM.06"], [
          { type: 's9say', show: 'list', ctx: "Here are the numbers of pencils in <b>7</b> pencil cases.", data: [5, 8, 6, 8, 5, 9, 7], at: 1 },
          { type: 's9say', show: 'list', ctx: "Here are the times, in minutes, that <b>5</b> children read last night.", data: [20, 45, 15, 30, 25], unit: 'minutes', at: 2 },
          { type: 's9say', show: 'list', ctx: "Here are the numbers of eggs that <b>7</b> hens lay in a week.", data: [3, 1, 4, 1, 3, 2, 6], at: 0 }]),
        Q(2, ["TWM.07"], [
          { type: 's9best', goal: 'most', ctx: "A stall sells caps. The cards show the sizes it sells today.", ask: "Which value tells the stall which size to order most?", data: [52, 56, 52, 54, 52, 60, 56, 52, 58], at: 2 },
          { type: 's9best', goal: 'middle', ctx: "<b>7</b> children run a race. The cards show their times. Quan's time is <b>14 seconds</b>.", ask: "Which value tells Quan if he is in the faster half of the group?", data: [12, 16, 13, 18, 15, 13, 17], unit: 'seconds', own: 14, who: 'Quan', words: ['slower', 'faster'], at: 0 },
          { type: 's9best', goal: 'most', ctx: "The cards show how many spring rolls each child orders at lunch.", ask: "Which value tells the cook how many spring rolls to put on most plates?", data: [2, 3, 2, 4, 2, 6, 3, 2, 5], unit: 'spring rolls', at: 1 }]),
        Q(2, ["TWM.05"], [
          { type: 's9freq', show: 'dot', ask: 'median', ctx: "The dot plot shows the marks of <b>9</b> children in a quiz.", head: ['Mark'], cats: [5, 6, 7, 8, 9, 10], freq: [1, 3, 1, 2, 1, 1], unit: 'marks' },
          { type: 's9freq', show: 'table', ask: 'median', ctx: "The table shows the people in each of <b>11</b> families.", head: ['People in the family', 'Number of families'], cats: [2, 3, 4, 5, 6], freq: [1, 4, 2, 3, 1], unit: 'people' },
          { type: 's9freq', show: 'tally', ask: 'median', ctx: "The tally chart shows the eggs each of <b>9</b> hens lays in a week.", head: ['Eggs'], cats: [3, 4, 5, 6, 7], freq: [3, 1, 2, 2, 1], unit: 'eggs' }]),
        Q(2, ["TWM.01"], [
          { type: 's9missing', who: 'Kha', what: 'test scores', one: 'score', shown: [6, 6, 9], blanks: 2, med: 8, mode: 6, max: 20 },
          { type: 's9missing', who: 'Luan', what: 'scores', one: 'score', shown: [3, 3, 5, 8], blanks: 3, med: 5, mode: 3, max: 10 },
          { type: 's9missing', who: 'Yen', what: 'quiz scores', one: 'score', shown: [12, 12, 7], blanks: 2, med: 10, mode: 12, max: 20 }]),
        Q(3, ["TWM.04", "TWM.07"], [
          { type: 'claim', who: 'Thinh', at: 1, s9: { kind: 'medmode', data: [5, 2, 9, 2, 7], data2: [6, 4, 6, 8, 6] } },
          { type: 'claim', who: 'Trang', at: 0, s9: { kind: 'swapmedian', data: [14, 9, 21, 12, 17], to: 95 } },
          { type: 'claim', who: 'Duy', at: 2, s9: { kind: 'bigmode', data: [4, 7, 4, 9, 4, 6], add: 250 } }])
      ]
    },

    /* ---------------- Lightning round: 67 quick questions; the answers are worked out by lightning() above ---------------- */
    lightning: { secs: 60, items: lightning() },

    /* ---------------- My self-check ---------------- */
    selfcheck: {
      goals: ["find the mode of a list, a table or a chart", "put data in order and find the median", "say when data has no mode or two modes", "choose the mode or the median to fit the question"],
      again: ["r", "c", "a", "a"]
    }
  };
})(window.T = window.T || {});
