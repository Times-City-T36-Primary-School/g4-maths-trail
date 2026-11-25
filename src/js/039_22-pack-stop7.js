/* 22-pack-stop7.js - ALL the content of Stop 7, Triangles and symmetry (Grade 4, Stage 5).
   Parts: words, see, practise, notes, test, lightning, selfcheck.
   The pictures (s7tri, s7grid, s7card) are in 047g_g4-pics-s7.js; the models (s7tri, s7name, s7why, s7lines, s7pick, s7shade,
   s7reflect, s7mistake, and claim with s7fact) are in 009d_g4-models-s7.js. NO answer key is typed here for a question
   about a picture: the data is only points [x,y] and squares [col,row]; the model works out the type of each triangle,
   every reflection, every wrong picture and every count of lines of symmetry (tools/keys.js fails if one does not hold).
   An equilateral triangle cannot sit on a square dot grid, so equilateral triangles are drawn from marked sides or angles,
   or on an isometric dot grid (g: 'iso'). */
(function (T) {
  'use strict';
  const S7 = window.MX.s7;

  /* small shapes of squares, moved to where a question needs them */
  const at = (shape, dx, dy) => shape.map(c => [c[0] + dx, c[1] + dy]);
  const L4 = [[0, 0], [1, 0], [1, 1], [1, 2]], J4 = [[0, 0], [0, 1], [0, 2], [1, 2]], P5 = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]];
  const F5 = [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], FLAG = [[0, 0], [1, 0], [2, 0], [0, 1]], PL = [[0, 0], [1, 0], [2, 0], [1, 1], [2, 1]];
  const PLUS = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], RECT = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], TEE = [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]];
  const ZED = [[0, 0], [1, 0], [1, 1], [2, 1]], ELL = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], RING = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
  const AITCH = [[0, 0], [0, 1], [0, 2], [1, 1], [2, 0], [2, 1], [2, 2]], DIAG = [[0, 0], [1, 1], [2, 2]], YOU = [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]];
  const V = n => ({ k: 'v', at: n }), H = n => ({ k: 'h', at: n });

  /* triangles on the square dot grid (5 x 5 dots) */
  const SQ = { ticks: true, w: 4, h: 4 }, DOTS = { w: 4, h: 4 }, ISO = { w: 4, h: 3 };
  const p = (a, b, c) => ({ pts: [a, b, c] }), iso = (a, b, c) => ({ g: 'iso', pts: [a, b, c] });
  const sd = (a, b, c, rot) => ({ sides: [a, b, c], rot: rot || 0 }), an = (a, b, c, rot) => ({ angs: [a, b, c], rot: rot || 0 });

  /* Lightning: the answers are worked out here from the numbers (the type of a triangle from its sides or angles, the
     lines of symmetry of a capital letter from its squares) */
  const others = t => S7.TYPES.filter(x => x !== t);
  const typeQ = (label, spec) => { const t = S7.tri(spec).type; return [label, [t].concat(others(t))]; };
  const three = (n, pool) => [String(n)].concat(pool.filter(x => x !== n).slice(0, 2).map(String));
  const sqs = n => n + (n === 1 ? ' square' : ' squares');
  const bits = rows => { const out = []; rows.forEach((r, j) => r.split('').forEach((ch, i) => { if (ch === '#') out.push([i, j]); })); return out; };
  const LETTERS = {
    A: ['.#.', '#.#', '###', '#.#', '#.#'], H: ['#.#', '#.#', '###', '#.#', '#.#'], T: ['###', '.#.', '.#.', '.#.', '.#.'],
    Z: ['###', '..#', '.#.', '#..', '###'], E: ['###', '#..', '###', '#..', '###'], C: ['###', '#..', '#..', '#..', '###'],
    M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#'], S: ['###', '#..', '###', '..#', '###'], F: ['###', '#..', '###', '#..', '#..'],
    L: ['#..', '#..', '#..', '#..', '###'], U: ['#.#', '#.#', '#.#', '#.#', '###'], Y: ['#.#', '#.#', '.#.', '.#.', '.#.'], I: ['###', '.#.', '.#.', '.#.', '###']
  };
  const SIDES = [[5, 5, 8, 'cm'], [6, 6, 6, 'cm'], [3, 4, 5, 'cm'], [7, 7, 7, 'm'], [4, 6, 4, 'cm'], [5, 6, 7, 'm'], [9, 9, 4, 'cm'], [10, 10, 10, 'mm'], [6, 8, 10, 'cm'],
    [3, 5, 3, 'm'], [8, 8, 8, 'cm'], [5, 7, 9, 'cm'], [12, 7, 12, 'cm'], [4, 5, 6, 'm'], [9, 9, 9, 'cm'], [7, 10, 7, 'mm'], [6, 9, 11, 'cm'], [2, 2, 2, 'm']];
  const ANGS = [[60, 60, 60], [70, 70, 40], [50, 60, 70], [45, 45, 90], [30, 60, 90], [80, 50, 50], [100, 40, 40], [20, 70, 90], [65, 50, 65], [35, 55, 90]];
  const lightning = [].concat(
    SIDES.map(s => typeQ('Sides ' + s[0] + ' ' + s[3] + ', ' + s[1] + ' ' + s[3] + ', ' + s[2] + ' ' + s[3], { sides: s.slice(0, 3) })),
    ANGS.map(a => typeQ('Angles ' + a.join('°, ') + '°', { angs: a })),
    S7.TYPES.map(n => ['Lines of symmetry: ' + n + ' triangle', three(S7.tri(n === 'equilateral' ? { sides: [6, 6, 6] } : n === 'isosceles' ? { sides: [5, 5, 8] } : { sides: [4, 5, 6] }).lines, [3, 1, 0])]),
    [['Lines of symmetry: a square', three(S7.symLines(bits(['###', '###', '###'])).length, [4, 2, 1])],
      ['Lines of symmetry: a rectangle (not a square)', three(S7.symLines(bits(['####', '####'])).length, [2, 4, 0])]],
    Object.keys(LETTERS).map(ch => ['Lines of symmetry: the capital letter ' + ch, three(S7.symLines(bits(LETTERS[ch])).length, [0, 1, 2])]),
    [['Equal sides in an isosceles triangle', ['2', '3', '0']], ['Equal sides in an equilateral triangle', ['3', '2', '0']], ['Equal sides in a scalene triangle', ['0', '2', '3']],
      ['Equal angles in an isosceles triangle', ['2', '0', '3']], ['Equal angles in an equilateral triangle', ['3', '1', '2']], ['Equal angles in a scalene triangle', ['0', '3', '2']],
      ['A triangle with 3 lines of symmetry is', ['equilateral', 'isosceles', 'scalene']], ['A triangle with exactly 1 line of symmetry is', ['isosceles', 'scalene', 'equilateral']],
      ['A triangle with no lines of symmetry is', ['scalene', 'equilateral', 'isosceles']]],
    [2, 3, 5, 1].map(n => ['A dot is ' + sqs(n) + ' above a horizontal mirror line. Its reflection is', [sqs(n) + ' below', sqs(n) + ' above', sqs(2 * n) + ' below']]),
    [4, 1, 6, 3].map(n => ['A dot is ' + sqs(n) + ' to the left of a vertical mirror line. Its reflection is', [sqs(n) + ' to the right', sqs(n) + ' to the left', sqs(2 * n) + ' to the right']])
  );

  T.packs[7] = {
    n: 7,
    title: "Triangles and symmetry",
    los: ["5Gg.01", "5Gg.06", "5Gp.04"],
    blurb: {
      en: "Name *triangles*. Find lines of *symmetry*. *Reflect* shapes in a mirror line.",
      vi: "Gọi tên *tam giác*. Tìm trục *đối xứng*. *Lấy đối xứng* hình qua trục."
    },
    words: {
      sets: [
        { id: 'A', title: { en: 'Triangles', vi: 'Tam giác' }, keys: ['equilateral', 'isosceles', 'scalene'] },
        { id: 'B', title: { en: 'Symmetry', vi: 'Đối xứng' }, keys: ['line of symmetry', 'symmetrical', 'mirror line'] },
        { id: 'C', title: { en: 'Reflect', vi: 'Lấy đối xứng' }, keys: ['reflection', 'horizontal', 'vertical'] }
      ],
      items: {
        'equilateral': { art: 'w-equilateral', vi: 'tam giác đều', def: 'A triangle with 3 equal sides and 3 equal angles. Its sides can be 6 cm, 6 cm and 6 cm.' },
        'isosceles': { art: 'w-isosceles', vi: 'tam giác cân', def: 'A triangle with 2 equal sides and 2 equal angles. Its sides can be 5 cm, 5 cm and 8 cm.' },
        'scalene': { art: 'w-scalene', vi: 'tam giác thường (ba cạnh khác nhau)', def: 'A triangle with no equal sides and no equal angles. Its sides can be 4 cm, 5 cm and 6 cm.' },
        'line of symmetry': { art: 'w-line-of-symmetry', vi: 'trục đối xứng', def: 'A line that cuts a shape into two matching halves. Fold on it: one half fits on the other.' },
        'symmetrical': { art: 'w-symmetrical', vi: 'đối xứng', def: 'A symmetrical shape has two halves that match exactly. A butterfly is symmetrical.' },
        'mirror line': { art: 'w-mirror-line', vi: 'trục đối xứng (đường phản chiếu như mặt gương)', def: 'The line you reflect a shape in. The shape and its reflection are the same distance from it.' },
        'reflection': { art: 'w-reflection', vi: 'hình đối xứng (ảnh phản chiếu)', def: 'What you see in a mirror. A reflection is flipped, like a house in the water of a lake.' },
        'horizontal': { art: 'w-horizontal', vi: 'nằm ngang', def: 'Flat, from left to right, like the top of the water in a lake.' },
        'vertical': { art: 'w-vertical', vi: 'thẳng đứng', def: 'Straight up and down, like a flag pole.' }
      }
    },
    see: {
      scenes: [
        { id: 'challenge', title: { en: 'Look, fold and flip', vi: 'Nhìn, gấp và lật' },
          challenge: {
            end: { en: 'You did it! You can spot triangles and mirror lines.', vi: 'Em làm được rồi! Em nhận ra tam giác và trục đối xứng.' },
            result: 'You named triangles, found lines of symmetry and reflected a shape.',
            rounds: [
              { mode: "our", lo: ["5Gg.01"], twm: ["TWM.06"], v: [
                { type: 's7tri', want: 'isosceles', show: SQ, tris: [p([0, 4], [4, 4], [1, 0]), p([0, 4], [4, 4], [2, 0]), p([0, 0], [4, 0], [0, 3]), p([0, 1], [4, 0], [2, 4])] },
                { type: 's7tri', want: 'isosceles', show: SQ, tris: [p([0, 2], [4, 0], [4, 4]), p([0, 4], [3, 4], [4, 0]), p([0, 2], [4, 4], [3, 0]), p([1, 0], [4, 2], [0, 4])] },
                { type: 's7tri', want: 'isosceles', show: SQ, tris: [p([0, 0], [4, 0], [0, 3]), p([0, 4], [4, 4], [1, 0]), p([0, 1], [4, 0], [2, 4]), p([0, 3], [2, 0], [4, 3])] }] },
              { mode: "our", lo: ["5Gg.06"], twm: ["TWM.05"], v: [
                { type: 's7pick', w: 6, h: 4, shapes: [
                  { cells: [[0, 1], [1, 1], [2, 1], [3, 1], [2, 2], [3, 2]], line: V(3) }, { cells: [[1, 1], [2, 1], [2, 2], [3, 1], [4, 1], [3, 2]], line: V(3) },
                  { cells: [[1, 1], [2, 1], [2, 2], [3, 2], [4, 2], [3, 1]], line: V(3) }, { cells: [[1, 0], [2, 1], [3, 1], [4, 2], [2, 2], [3, 2]], line: V(3) }] },
                { type: 's7pick', w: 4, h: 6, shapes: [
                  { cells: [[1, 1], [1, 2], [2, 2], [1, 3], [2, 3], [1, 4]], line: H(3) }, { cells: [[1, 1], [1, 2], [2, 2], [1, 3], [1, 4], [2, 4]], line: H(3) },
                  { cells: [[0, 1], [1, 2], [2, 2], [1, 3], [2, 3], [3, 4]], line: H(3) }, { cells: [[1, 0], [1, 1], [1, 2], [2, 2], [2, 3], [1, 3]], line: H(3) }] },
                { type: 's7pick', w: 6, h: 4, shapes: [
                  { cells: [[1, 0], [2, 0], [2, 1], [3, 1], [3, 2], [4, 2]], line: V(3) }, { cells: [[0, 1], [1, 1], [2, 2], [3, 2], [3, 1], [4, 1]], line: V(3) },
                  { cells: [[1, 2], [2, 1], [3, 1], [5, 2], [2, 2], [3, 2]], line: V(3) }, { cells: [[0, 2], [1, 1], [2, 1], [3, 1], [4, 1], [5, 2]], line: V(3) }] }] },
              { mode: "your", lo: ["5Gg.01"], twm: ["TWM.05"], v: [
                { type: 's7lines', tri: sd(6, 6, 6), show: { ticks: true, lens: 'cm' } },
                { type: 's7lines', tri: sd(4, 7, 7), show: { ticks: true, lens: 'cm' } },
                { type: 's7lines', tri: sd(7, 4, 5, 20), show: { ticks: true, lens: 'cm' } }] },
              { mode: "your", lo: ["5Gp.04"], twm: ["TWM.05"], v: [
                { type: 's7reflect', w: 8, h: 5, cells: at(L4, 1, 1), line: V(4), wrong: ['far', 'slide', 'turn'], at: 2 },
                { type: 's7reflect', w: 5, h: 8, cells: at(P5, 1, 1), line: H(4), wrong: ['far', 'slide', 'turn'], at: 0 },
                { type: 's7reflect', w: 8, h: 5, cells: at(F5, 1, 1), line: V(4), wrong: ['slide', 'far', 'turn'], at: 3 }] },
              { mode: "your", lo: ["5Gg.06"], twm: ["TWM.01"], v: [
                { type: 's7pick', w: 5, h: 5, want: 2, shapes: [at(TEE, 1, 1), at(ZED, 1, 1), at(RECT, 1, 1), at(PLUS, 1, 1)] },
                { type: 's7pick', w: 5, h: 5, want: 1, shapes: [at(ZED, 1, 1), at(YOU, 1, 1), at(AITCH, 1, 1), at(RING, 1, 1)] },
                { type: 's7pick', w: 5, h: 5, want: 4, shapes: [at(RECT, 1, 1), at(PLUS, 1, 1), at(ELL, 1, 1), at(L4, 1, 1)] }] }] } }]
    },
    practise: [
      { id: 's7r', kit: 'model', game: 'r', surface: 'board', art: 'icon-step-practise',
        title: 'Draw it', blurb: { en: 'Triangles, mirror lines and patterns in pictures.', vi: 'Tam giác, trục đối xứng và hoạ tiết qua hình vẽ.' },
        levels: [
          { title: { en: "Types of triangle", vi: "Các loại tam giác" }, rounds: [
            { mode: "our", lo: ["5Gg.01"], twm: ["TWM.06"], v: [
              { type: 's7name', tri: sd(5, 8, 5), show: { lens: 'cm' } },
              { type: 's7name', tri: sd(7, 5, 6, 15), show: { lens: 'cm' } },
              { type: 's7name', tri: sd(6, 6, 6, 180), show: { lens: 'm' } }] },
            { mode: "your", lo: ["5Gg.01"], twm: ["TWM.05"], v: [
              { type: 's7why', tri: p([0, 4], [4, 4], [2, 0]), show: SQ, label: 'A', at: 1 },
              { type: 's7why', tri: iso([0, 0], [3, 0], [0, 3]), show: { ticks: true, w: 3, h: 3 }, label: 'B', at: 2 },
              { type: 's7why', tri: p([0, 4], [3, 4], [4, 0]), show: SQ, label: 'C', at: 0 }] },
            { mode: "your", lo: ["5Gg.01"], twm: ["TWM.06"], v: [
              { type: 's7tri', want: 'scalene', show: { deg: true }, tris: [an(70, 70, 40), an(60, 60, 60), an(50, 60, 70), an(45, 90, 45)] },
              { type: 's7tri', want: 'equilateral', show: { deg: true }, tris: [an(60, 60, 60, 180), an(50, 80, 50), an(30, 60, 90), an(65, 65, 50)] },
              { type: 's7tri', want: 'isosceles', show: { deg: true }, tris: [an(40, 60, 80), an(25, 65, 90), an(30, 60, 90), an(35, 35, 110)] }] }] },
          { title: { en: "Mirror lines", vi: "Trục đối xứng" }, rounds: [
            { mode: "your", lo: ["5Gg.06"], twm: ["TWM.05"], v: [
              { type: 's7reflect', pattern: true, w: 8, h: 5, cells: [[3, 0], [2, 1], [3, 1], [1, 2], [3, 3], [2, 4]], line: V(4), wrong: ['slide', 'cell', 'far'], at: 1 },
              { type: 's7reflect', pattern: true, w: 5, h: 8, cells: [[0, 3], [1, 3], [1, 2], [2, 1], [4, 3], [3, 2]], line: H(4), wrong: ['cell', 'slide', 'far'], at: 3 },
              { type: 's7reflect', pattern: true, w: 8, h: 5, cells: [[3, 1], [3, 2], [2, 2], [1, 3], [3, 4], [2, 0]], line: V(4), wrong: ['far', 'slide', 'cell'], at: 0 }] },
            { mode: "your", lo: ["5Gp.04"], twm: ["TWM.05"], v: [
              { type: 's7reflect', w: 6, h: 6, cells: at(FLAG, 1, 1), line: H(3), wrong: ['slide', 'far', 'turn'], at: 1 },
              { type: 's7reflect', w: 8, h: 5, cells: at(J4, 1, 1), line: V(4), wrong: ['near', 'slide', 'turn'], at: 2 },
              { type: 's7reflect', w: 6, h: 6, cells: at(PL, 2, 1), line: H(3), wrong: ['far', 'turn', 'slide'], at: 0 }] }] }] },
      { id: 's7a', kit: 'model', game: 'a', surface: 'paper', art: 'icon-step-test',
        title: 'Solve it', blurb: { en: 'Answer questions like the test.', vi: 'Trả lời câu hỏi giống bài kiểm tra.' },
        levels: [
          { title: { en: "Triangles and symmetry", vi: "Tam giác và đối xứng" }, rounds: [
            { mode: "your", lo: ["5Gg.01"], twm: ["TWM.05"], v: [
              { type: 's7lines', name: 'isosceles' },
              { type: 's7lines', name: 'equilateral' },
              { type: 's7lines', name: 'scalene' }] },
            { mode: "your", lo: ["5Gg.06"], twm: ["TWM.01"], v: [
              { type: 's7shade', w: 5, h: 5, cells: [[1, 1], [2, 1], [3, 1], [1, 2]], adds: [[[2, 2], [3, 2]], [[1, 3], [3, 2]], [[3, 2], [2, 0]], [[0, 1], [4, 1]]] },
              { type: 's7shade', w: 5, h: 5, who: 'Lan', cells: [[2, 1], [2, 2], [2, 3], [3, 3]], adds: [[[1, 3], [2, 0]], [[3, 1], [3, 2]], [[1, 1], [3, 2]], [[1, 3], [3, 1]]] },
              { type: 's7shade', w: 5, h: 5, cells: [[1, 2], [2, 2], [3, 2], [3, 1]], adds: [[[1, 3], [2, 3]], [[1, 1], [2, 1]], [[0, 2], [4, 2]], [[1, 1], [2, 3]]] }] },
            { mode: "your", lo: ["5Gp.04"], twm: ["TWM.07"], v: [
              { type: 's7mistake', who: 'Binh', he: true, w: 8, h: 5, cells: at(L4, 1, 1), line: V(4), err: 'far', at: 1 },
              { type: 's7mistake', who: 'Chi', w: 5, h: 8, cells: at(P5, 1, 1), line: H(4), err: 'slide', at: 0 },
              { type: 's7mistake', who: 'Khoa', he: true, w: 6, h: 7, cells: at(FLAG, 1, 1), line: H(3), err: 'far', far: 2, at: 2 }] }] },
          { title: { en: "Reflect and reason", vi: "Lấy đối xứng và lập luận" }, rounds: [
            { mode: "your", lo: ["5Gp.04"], twm: ["TWM.05"], v: [
              { type: 's7reflect', w: 6, h: 6, cells: [[0, 0], [1, 0], [1, 1], [2, 2]], lines: [V(3), H(3)], at: 2 },
              { type: 's7reflect', w: 6, h: 6, cells: [[2, 0], [2, 1], [1, 1], [0, 2]], lines: [V(3), H(3)], at: 0 },
              { type: 's7reflect', w: 6, h: 6, cells: [[1, 0], [2, 0], [0, 1], [2, 2]], lines: [V(3), H(3)], at: 3 }] },
            { mode: "your", lo: ["5Gg.01", "5Gg.06"], twm: ["TWM.04", "TWM.07"], v: [
              { type: "claim", who: "Trang", ok: false, at: 1, says: "An equilateral triangle has more lines of symmetry than a square.",
                s7fact: [{ tri: { sides: [6, 6, 6] }, type: 'equilateral', lines: 3 }, { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], lines: 4 }],
                reasons: [
                  { t: "an equilateral triangle has 3 lines of symmetry and a square has 4." },
                  { t: "a square has only 2 lines of symmetry, so 3 lines is more.", why: "A square has 4 lines: down, across and 2 from corner to corner." },
                  { t: "both shapes have 4 lines of symmetry.", why: "An equilateral triangle has one line through each corner. That is 3 lines." }],
                hint: { pic: { k: 's7tri', sides: [6, 6, 6], ticks: true, sym: true }, step: "Count the lines of symmetry of each shape. Then compare." },
                worked: "An equilateral triangle has 3 lines of symmetry. A square has 4. 3 is less than 4.",
                model: "Trang is incorrect because an equilateral triangle has 3 lines of symmetry and a square has 4." },
              { type: "claim", who: "Phong", ok: true, at: 0, says: "A rectangle that is not a square has fewer lines of symmetry than a square.",
                fig: { k: 's7grid', w: 5, h: 4, cells: at(RECT, 1, 1) },
                s7fact: [{ cells: at(RECT, 1, 1), lines: 2 }, { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], lines: 4 }],
                reasons: [
                  { t: "the rectangle folds down the middle and across the middle, but not from corner to corner. That is 2 lines. A square has 4." },
                  { t: "a rectangle and a square both have 4 sides, so they have the same number of lines.", why: "Count the folds, not the sides. Fold the rectangle from corner to corner: the halves do not match." },
                  { t: "a rectangle has no lines of symmetry.", why: "Fold the rectangle down the middle. The two halves match." }],
                hint: { step: "Fold the rectangle down the middle, across the middle and from corner to corner. Which folds make matching halves?" },
                worked: "The rectangle folds down the middle and across the middle, but not corner to corner. So it has 2 lines of symmetry. A square has 4. 2 is fewer than 4.",
                model: "Phong is correct because a rectangle that is not a square has 2 lines of symmetry and a square has 4." },
              { type: "claim", who: "Yen", ok: false, at: 2, says: "A shape with a vertical line of symmetry always has a horizontal line of symmetry too.",
                fig: { k: 's7grid', w: 5, h: 5, cells: at(TEE, 1, 1) },
                s7fact: [{ cells: at(TEE, 1, 1), lines: 1 }],
                reasons: [
                  { t: "this T shape has a vertical line of symmetry, but the top half and the bottom half do not match." },
                  { t: "all shapes on a grid have 2 lines of symmetry.", why: "Fold the T shape across the middle. Do the two halves match?" },
                  { t: "the T shape has no lines of symmetry.", why: "Fold the T shape down the middle. The left half and the right half match." }],
                hint: { pic: { k: 's7grid', w: 5, h: 5, cells: at(TEE, 1, 1), sym: true }, step: "Look at the T shape. Fold it down the middle. Then fold it across the middle." },
                worked: "The T shape has a vertical line of symmetry. Fold it across the middle: the halves do not match. So it has only 1 line.",
                model: "Yen is incorrect because the T shape has a vertical line of symmetry but no horizontal line of symmetry." }] }] }] }
    ],
    notes: {
      items: [
        { en: 'An [[equilateral]] triangle has 3 equal sides and 3 equal angles.',
          vi: 'Tam giác đều có 3 cạnh bằng nhau và 3 góc bằng nhau.',
          example: ['Sides 6 cm, 6 cm and 6 cm: all equal.', 'The small marks show equal sides. The triangle is *equilateral*.'],
          pic: { k: 's7tri', sides: [6, 6, 6], ticks: true, arcs: true, lens: 'cm' } },
        { en: 'An [[isosceles]] triangle has 2 equal sides and 2 equal angles. A [[scalene]] triangle has none.',
          vi: 'Tam giác cân có 2 cạnh bằng nhau và 2 góc bằng nhau. Tam giác thường không có cạnh nào bằng nhau và không có góc nào bằng nhau.',
          example: ['Sides 5 cm, 5 cm and 8 cm: 2 are equal, so it is *isosceles*.', 'Sides 4 cm, 5 cm and 6 cm: none are equal, so it is *scalene*.'],
          pic: { k: 's7card' } },
        { en: 'Count the [[lines of symmetry|line of symmetry]] of a triangle: equilateral 3, isosceles 1, scalene 0.',
          vi: 'Đếm số trục đối xứng của tam giác: tam giác đều có 3, tam giác cân có 1, tam giác thường có 0.',
          example: ['A line of symmetry goes through a corner where two equal sides meet.', 'An isosceles triangle has one corner like that: *1 line*.'],
          pic: { k: 's7card', sym: true } },
        { en: 'A shape is [[symmetrical]] when a fold makes two matching halves. Try folds down, across and corner to corner.',
          vi: 'Một hình là hình đối xứng khi gấp lại thì hai nửa trùng khít nhau. Hãy thử gấp dọc, gấp ngang và gấp chéo từ góc này sang góc kia.',
          example: ['This cross folds down, across and on both diagonals.', 'It has *4* lines of symmetry.'],
          pic: { k: 's7grid', w: 5, h: 5, cells: at(PLUS, 1, 1), sym: true } },
        { en: 'To reflect a shape, take one square at a time. Its partner is the same distance from the [[mirror line]], on the other side.',
          vi: 'Để lấy đối xứng một hình, xét từng ô vuông. Ô tương ứng cách trục đối xứng một khoảng bằng nhau, ở phía bên kia.',
          example: ['The blue shape is 1 square from the mirror line.', 'The [[reflection]] is *1 square* from the line too. It is flipped, not slid.'],
          pic: { k: 's7grid', w: 8, h: 5, cells: at(L4, 1, 1), cells2: S7.reflect(at(L4, 1, 1), V(4)), c2: 'refl', line: V(4), lab: true } },
        { en: 'A mirror line can be [[vertical]] or [[horizontal]]. Reflect in both lines to make a pattern.',
          vi: 'Trục đối xứng có thể thẳng đứng hoặc nằm ngang. Lấy đối xứng qua cả hai trục để tạo thành hoạ tiết.',
          example: ['Flip the pattern across the vertical line. Then flip both parts across the horizontal line.', 'The pattern now has *2* lines of symmetry.'],
          pic: { k: 's7grid', w: 6, h: 6, cells: [[0, 0], [1, 0], [1, 1], [2, 2]],
            cells2: S7.reflect([[0, 0], [1, 0], [1, 1], [2, 2]], V(3)).concat(S7.reflect([[0, 0], [1, 0], [1, 1], [2, 2]], H(3)), S7.reflect(S7.reflect([[0, 0], [1, 0], [1, 1], [2, 2]], V(3)), H(3))),
            c2: 'refl', lines: [V(3), H(3)], lab: true } }
      ],
      check: [
        { sentence: 'A triangle with sides 7 cm, 7 cm and 7 cm is {equilateral|isosceles|scalene}.', answer: 'equilateral' },
        { sentence: 'A triangle with sides 5 cm, 9 cm and 5 cm is {isosceles|scalene|equilateral}.', answer: 'isosceles' },
        { sentence: 'A scalene triangle has {0|1|3} lines of symmetry.', answer: '0' },
        { sentence: 'A square has {4|2|1} lines of symmetry.', answer: '4' },
        { sentence: 'A shape is 3 squares from the mirror line. Its reflection is {3|6|0} squares from the line.', answer: '3' },
        { sentence: 'A horizontal mirror line goes {from left to right|up and down|corner to corner}.', answer: 'from left to right' }
      ]
    },
    test: {
      items: [
        { dok: 1, lo: ["5Gg.01"], twm: ["TWM.06"], v: [
          { type: 's7tri', want: 'isosceles', show: SQ, tris: [p([0, 4], [3, 4], [4, 0]), p([0, 2], [4, 4], [3, 0]), p([0, 0], [4, 1], [1, 4]), p([0, 0], [4, 0], [0, 3])] },
          { type: 's7tri', want: 'scalene', show: SQ, tris: [p([0, 3], [2, 0], [4, 3]), p([0, 1], [4, 0], [2, 4]), p([0, 0], [3, 0], [0, 3]), p([1, 4], [4, 3], [0, 1])] },
          { type: 's7tri', want: 'equilateral', show: { ticks: true, w: 4, h: 3 }, tris: [iso([0, 0], [4, 0], [1, 2]), iso([0, 0], [3, 0], [-1, 3]), iso([1, 0], [3, 1], [0, 3]), iso([0, 0], [4, 0], [-1, 3])] }] },
        { dok: 1, lo: ["5Gg.01"], twm: ["TWM.05"], v: [
          { type: 's7lines', name: 'equilateral' },
          { type: 's7lines', name: 'scalene' },
          { type: 's7lines', name: 'isosceles' }] },
        { dok: 1, lo: ["5Gg.06"], twm: ["TWM.05"], v: [
          { type: 's7pick', w: 6, h: 4, shapes: [
            { cells: [[0, 0], [1, 1], [2, 1], [3, 1], [4, 0], [2, 2]], line: V(3) }, { cells: [[1, 0], [1, 1], [2, 1], [3, 1], [4, 2], [4, 1]], line: V(3) },
            { cells: [[0, 1], [1, 1], [2, 2], [3, 2], [4, 1], [5, 1]], line: V(3) }, { cells: [[1, 1], [2, 1], [2, 2], [4, 2], [5, 1], [4, 1]], line: V(3) }] },
          { type: 's7pick', w: 4, h: 6, shapes: [
            { cells: [[1, 0], [1, 1], [2, 2], [2, 3], [1, 4], [1, 5]], line: H(3) }, { cells: [[1, 1], [2, 1], [2, 2], [1, 3], [1, 4], [2, 4]], line: H(3) },
            { cells: [[0, 1], [1, 2], [2, 2], [2, 3], [1, 4], [0, 4]], line: H(3) }, { cells: [[1, 0], [2, 1], [2, 2], [2, 3], [1, 4], [2, 4]], line: H(3) }] },
          { type: 's7pick', w: 6, h: 4, shapes: [
            { cells: [[1, 0], [2, 1], [3, 1], [4, 1], [1, 2], [4, 2]], line: V(3) }, { cells: [[0, 2], [1, 1], [2, 0], [3, 1], [4, 2], [5, 2]], line: V(3) },
            { cells: [[1, 1], [2, 2], [3, 2], [4, 1], [1, 3], [4, 3]], line: V(3) }, { cells: [[0, 1], [2, 1], [2, 2], [3, 1], [4, 2], [5, 1]], line: V(3) }] }] },
        { dok: 1, lo: ["5Gp.04"], twm: ["TWM.05"], v: [
          { type: 's7reflect', w: 8, h: 5, cells: at(P5, 1, 1), line: V(4), wrong: ['slide', 'near', 'turn'], at: 1 },
          { type: 's7reflect', w: 6, h: 6, cells: at(PL, 1, 1), line: H(3), wrong: ['far', 'slide', 'turn'], at: 3 },
          { type: 's7reflect', w: 8, h: 5, cells: at(FLAG, 1, 2), line: V(4), wrong: ['turn', 'far', 'slide'], at: 0 }] },
        { dok: 2, lo: ["5Gg.01"], twm: ["TWM.05"], v: [
          { type: 's7why', tri: p([0, 2], [4, 0], [4, 4]), show: SQ, label: 'P', at: 2 },
          { type: 's7why', tri: p([0, 1], [4, 0], [2, 4]), show: SQ, label: 'Q', at: 0 },
          { type: 's7why', tri: iso([1, 0], [3, 1], [0, 3]), show: { ticks: true, w: 4, h: 3 }, label: 'R', at: 3 }] },
        { dok: 2, lo: ["5Gg.06"], twm: ["TWM.01"], v: [
          { type: 's7shade', w: 5, h: 5, cells: [[1, 1], [1, 2], [1, 3], [2, 3]], adds: [[[2, 1], [2, 2]], [[3, 3], [2, 1]], [[0, 3], [1, 0]], [[3, 3], [0, 2]]] },
          { type: 's7shade', w: 5, h: 5, cells: [[1, 1], [2, 1], [2, 2], [2, 3]], adds: [[[3, 1], [1, 3]], [[1, 2], [1, 3]], [[3, 1], [2, 0]], [[0, 1], [3, 3]]] },
          { type: 's7shade', w: 5, h: 5, cells: [[1, 2], [2, 2], [3, 2], [1, 1]], adds: [[[2, 1], [3, 1]], [[3, 1], [2, 3]], [[1, 3], [3, 3]], [[3, 3], [2, 1]]] }] },
        { dok: 2, lo: ["5Gg.06"], twm: ["TWM.05"], v: [
          { type: 's7lines', w: 5, h: 5, cells: at(AITCH, 1, 1) },
          { type: 's7lines', w: 5, h: 5, cells: at(ELL, 1, 1) },
          { type: 's7lines', w: 5, h: 5, cells: at(RING, 1, 1) }] },
        { dok: 2, lo: ["5Gp.04"], twm: ["TWM.07"], v: [
          { type: 's7mistake', who: 'Giang', w: 8, h: 5, cells: at(F5, 1, 1), line: V(4), err: 'slide', at: 1 },
          { type: 's7mistake', who: 'Quan', he: true, w: 6, h: 7, cells: at(PL, 1, 1), line: H(3), err: 'far', far: 2, at: 0 },
          { type: 's7mistake', who: 'Vy', w: 9, h: 5, cells: at(J4, 2, 1), line: V(4), err: 'far', far: 2, at: 2 }] },
        { dok: 2, lo: ["5Gp.04"], twm: ["TWM.05"], v: [
          { type: 's7reflect', w: 6, h: 6, cells: [[2, 0], [1, 1], [2, 1], [0, 2]], lines: [V(3), H(3)], at: 1 },
          { type: 's7reflect', w: 6, h: 6, cells: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]], lines: [V(3), H(3)], wrong: ['half', 'slide', 'half2'], at: 3 },
          { type: 's7reflect', w: 6, h: 6, cells: [[1, 0], [1, 1], [2, 1], [0, 2]], lines: [V(3), H(3)], wrong: ['half2', 'half', 'slide'], at: 0 }] },
        { dok: 3, lo: ["5Gg.01", "5Gg.06"], twm: ["TWM.04", "TWM.07"], v: [
          { type: "claim", who: "Hieu", ok: false, at: 1, says: "Every triangle that has a line of symmetry is equilateral.",
            fig: { k: 's7tri', sides: [8, 5, 5], lens: 'cm' },
            s7fact: [{ tri: { sides: [8, 5, 5] }, type: 'isosceles', lines: 1 }],
            reasons: [
              { t: "a triangle with sides 5 cm, 5 cm and 8 cm has 1 line of symmetry, and it is isosceles, not equilateral." },
              { t: "an equilateral triangle has 3 lines of symmetry, so only equilateral triangles have a line of symmetry.", why: "An equilateral triangle does have 3 lines. But other triangles can have a line of symmetry too. Look at the picture." },
              { t: "no triangle has a line of symmetry, so the triangle in the picture has none.", why: "Fold the triangle in the picture down the middle. The two halves match." }],
            hint: { pic: { k: 's7tri', sides: [8, 5, 5], lens: 'cm', ticks: true, sym: true }, step: "Look at the triangle in the picture. What type is it? Does it have a line of symmetry?" },
            worked: "The triangle has sides 5 cm, 5 cm and 8 cm. It is isosceles. It has 1 line of symmetry, but it is not equilateral.",
            model: "Hieu is incorrect because an isosceles triangle has 1 line of symmetry and it is not equilateral." },
          { type: "claim", who: "Nhi", ok: true, at: 2, says: "A scalene triangle never has a line of symmetry.",
            fig: { k: 's7tri', sides: [7, 4, 5], lens: 'cm' },
            s7fact: [{ tri: { sides: [7, 4, 5] }, type: 'scalene', lines: 0 }],
            reasons: [
              { t: "a line of symmetry needs two equal sides, one on each side of the fold. A scalene triangle has no equal sides." },
              { t: "a scalene triangle has 3 sides, so it has 3 lines of symmetry, one for each side.", why: "That is an equilateral triangle. A scalene triangle has no equal sides." },
              { t: "scalene triangles are too small to fold, so you cannot find a line of symmetry.", why: "Size does not matter. Think about the sides: are any two equal?" }],
            hint: { pic: { k: 's7card', sym: true }, step: "Try to fold the triangle so that two sides match. Are any two sides equal?" },
            worked: "A fold on a line of symmetry puts one side exactly on another. So two sides must be equal. A scalene triangle has no equal sides.",
            model: "Nhi is correct because a line of symmetry needs two equal sides and a scalene triangle has none." },
          { type: "claim", who: "Duy", ok: false, at: 0, says: "A triangle with a right angle is never isosceles.",
            fig: { k: 's7tri', pts: [[0, 0], [3, 0], [0, 3]], w: 3, h: 3, rt: true },
            s7fact: [{ tri: { pts: [[0, 0], [3, 0], [0, 3]] }, type: 'isosceles', right: true, lines: 1 }],
            reasons: [
              { t: "the triangle in the picture has a right angle and two sides that are each 3 units long, so it is isosceles." },
              { t: "a right angle is 90°, so the three sides are all different.", why: "Count the units along the two short sides in the picture. They are both 3 units." },
              { t: "the triangle in the picture has three equal sides.", why: "The long side is longer than the other two. Only two sides are equal." }],
            hint: { pic: { k: 's7tri', pts: [[0, 0], [3, 0], [0, 3]], w: 3, h: 3, rt: true, ticks: true, sym: true }, step: "Count the units along each short side of the triangle in the picture." },
            worked: "The triangle has a right angle. Its two short sides are both 3 units long. Two equal sides make it isosceles.",
            model: "Duy is incorrect because this triangle has a right angle and two equal sides, so it is isosceles." }
        ] }
      ]
    },
    lightning: { secs: 60, items: lightning },
    selfcheck: {
      goals: ["name a triangle: equilateral, isosceles or scalene", "say how many lines of symmetry a triangle or a shape has", "complete a symmetrical pattern", "reflect a shape in a vertical or horizontal mirror line"],
      again: ["r", "c", "r", "a"]
    }
  };
})(window.T = window.T || {});
