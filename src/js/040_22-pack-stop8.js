/* 22-pack-stop8.js - ALL the content of Stop 8, 3D shapes and nets (Grade 4, Stage 5).
   Parts: words, see, practise, notes, test, lightning, selfcheck.

   No key in this file is written by hand. A net is rows of squares ('.#..', '####', '.#..'), a cube building is a list
   of cubes [x, y, z], a solid is a name. The models of 009d_g4-models-s8.js (MX.s8) FOLD each net, turn each building,
   count each solid and then find the right answer; they stop the page with an error when the data of a question does
   not give exactly one right answer. The claims (MX.s8.claim) are checked in code before the question is made.
   Pictures: 047g_g4-pics-s8.js (s8net, s8view, s8iso, s8solid, s8row and the tap tool s8tap). */
(function (T) {
  'use strict';
  const S = window.MX.s8;
  const G4 = '5Gg.04', G5 = '5Gg.05';
  const R = function (mode, lo, twm, v) { return { mode: mode, lo: lo, twm: twm, v: v }; };
  const Q = function (dok, lo, twm, v) { return { dok: dok, lo: lo, twm: twm, v: v }; };

  // the cube buildings of this stop: [x, y, z], z is up (the drawing looks from the corner where x, y and z are biggest)
  const B = {
    L4: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0]],
    T4: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 1, 0]],
    S4: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [2, 1, 0]],
    I4: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]],
    L5: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [0, 1, 0]],
    Y5: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [1, 1, 0]],
    P5: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0]],
    V5: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [0, 2, 0]],
    T5: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 1, 0], [1, 2, 0]],
    W5: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [2, 1, 0], [2, 2, 0]],
    N5: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0], [3, 1, 0]],
    X5: [[1, 0, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0], [1, 2, 0]],
    chair5: [[0, 1, 0], [1, 0, 0], [1, 1, 0], [2, 1, 0], [0, 1, 1]],       // a T on the table with a cube on the back
    key5: [[0, 1, 0], [0, 2, 0], [1, 0, 0], [1, 1, 0], [1, 0, 1]],         // an S on the table with a cube on one end
    tee5: [[0, 1, 0], [1, 0, 0], [1, 1, 0], [1, 2, 0], [1, 0, 1]],
    six1: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [1, 1, 0], [2, 1, 0], [2, 1, 1]],
    six2: [[0, 1, 0], [1, 0, 0], [1, 1, 0], [2, 0, 0], [2, 1, 0], [0, 1, 1]],
    flag5: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0], [0, 0, 1]],        // an L with a cube on the far end
    post5: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [2, 0, 1]],        // an L with a cube on the near end
    hid5: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [0, 0, 1]],         // an L with a cube on the corner (only turned, never counted: the corner cube is hidden)
    hook5: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [1, 0, 0], [0, 2, 1]],        // every cube shows a whole face
    hook6: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [0, 2, 0], [0, 2, 1]],
    two5: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 0, 1], [1, 2, 0]],
    stair6: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 0, 1], [0, 1, 1], [0, 0, 2]]
  };

  /* ---------- Lightning: the numbers of faces, edges and vertices are counted from the solids' meshes ---------- */
  const quick = [];
  ['cube', 'cuboid', 'triprism', 'sqpyramid', 'tripyramid', 'pentprism', 'hexprism'].forEach(function (id) {
    const s = S.solid(id), all = { Faces: s.F, Edges: s.E, Vertices: s.V };
    Object.keys(all).forEach(function (k) {
      const a = all[k], wrong = [];
      [s.F, s.E, s.V, a + 1, a - 1, a + 2].forEach(function (x) { if (x !== a && x > 0 && wrong.indexOf(x) < 0 && wrong.length < 2) wrong.push(x); });
      quick.push([k + ' of ' + s.a + ' ' + s.name, [String(a), String(wrong[0]), String(wrong[1])]]);
    });
  });
  const cyl = S.solid('cylinder'), cone = S.solid('cone'), nNets = S.census().nets;
  const facts = [
    ['Squares in a net of a cube', ['6', '5', '4']], ['Squares in a net of an open cube', ['5', '6', '4']],
    ['How many different nets does a cube have?', [String(nNets), '6', '1']], ['Shape of each face of a cube', ['square', 'rectangle', 'triangle']],
    ['Faces that meet at one vertex of a cube', ['3', '4', '2']], ['Edges that meet at one vertex of a cube', ['3', '4', '6']],
    ['Pairs of opposite faces on a cube', ['3', '6', '2']], ['Faces of a cube that share an edge with one face', ['4', '5', '3']],
    ['Flat faces of a cylinder', [String(cyl.flat), '1', '3']], ['Flat faces of a cone', [String(cone.flat), '2', '0']],
    ['Curved surfaces of a cylinder', [String(cyl.curved), '2', '0']],
    ['Shape of the flat faces of a cylinder', ['circle', 'square', 'triangle']],
    ['6 square faces. Which shape?', ['cube', 'cuboid', 'pyramid']], ['6 rectangle faces. Which shape?', ['cuboid', 'cube', 'cone']],
    ['2 triangle ends and 3 rectangles. Which shape?', ['triangular prism', 'pyramid', 'cuboid']],
    ['1 square base and 4 triangles. Which shape?', ['square-based pyramid', 'triangular prism', 'cube']],
    ['4 triangle faces. Which shape?', ['triangular-based pyramid', 'triangular prism', 'cone']],
    ['2 circle faces and 1 curved surface. Which shape?', ['cylinder', 'cone', 'sphere']],
    ['1 circle face and a point. Which shape?', ['cone', 'cylinder', 'pyramid']],
    ['A ball is the shape of a ...', ['sphere', 'circle', 'cylinder']],
    ['Where two faces meet', ['edge', 'vertex', 'net']], ['Where edges meet', ['vertex', 'face', 'net']],
    ['A flat surface of a 3D shape', ['face', 'edge', 'vertex']], ['A flat shape that folds into a 3D shape', ['net', 'face', 'prism']],
    ['One vertex, two ...', ['vertices', 'vertice', 'verticles']],
    ['A can of milk is shaped like a ...', ['cylinder', 'cone', 'cube']], ['A dice is shaped like a ...', ['cube', 'cone', 'pyramid']],
    ['A brick is shaped like a ...', ['cuboid', 'cylinder', 'pyramid']], ['A party hat is shaped like a ...', ['cone', 'cube', 'cuboid']],
    ['A tent can be shaped like a ...', ['triangular prism', 'cylinder', 'cube']],
    ['6 squares in one straight row. A net of a cube?', ['no', 'yes', 'sometimes']],
    ['Can a net of a cube have a 2 × 2 block of squares?', ['no', 'yes', 'only one']],
    ['Most squares in one straight row of a cube net', ['4', '5', '6']],
    ['A net has a row of squares A B C D. Opposite A?', ['C', 'B', 'D']], ['A net has a row of squares A B C D. Opposite B?', ['D', 'A', 'C']],
    ['In a net, can squares that touch be opposite faces?', ['no', 'yes', 'sometimes']],
    ['Faces of a cube with no lid', ['5', '6', '4']], ['Faces + vertices of a cube', ['14', '12', '20']],
    ['Turn a cone upside down. It is a ...', ['cone', 'cylinder', 'pyramid']],
    ['Small cubes in a 2 × 2 × 2 cube', ['8', '4', '6']], ['A row of 3 cubes with 1 cube on top. Cubes?', ['4', '3', '5']],
    ['2 layers of 3 cubes. Cubes?', ['6', '5', '3']], ['Top view of a tower of 3 cubes: squares?', ['1', '3', '2']],
    ['Front view of a tower of 3 cubes: squares?', ['3', '1', '2']], ['Top view of a row of 4 cubes: squares?', ['4', '1', '2']],
    ['A prism has ... ends that are the same', ['2', '1', '3']], ['The faces round a prism are ...', ['rectangles', 'triangles', 'circles']],
    ['The faces that meet at the top of a pyramid are ...', ['triangles', 'rectangles', 'squares']]
  ];

  /* ---------- Notes: the coloured squares of two pictures are worked out too ---------- */
  const rowNet = S.parse(['.A..', 'BCDE', '.F..']), rowLabels = Object.keys(rowNet.marks).sort().map(function (t) { return { c: rowNet.marks[t][0], t: t }; });
  const cOf = function (t) { return rowNet.marks[t][0]; }, idxOf = function (c) { return rowNet.cells.findIndex(function (x) { return x[0] === c[0] && x[1] === c[1]; }); };
  const oppB = rowLabels.find(function (x) { return idxOf(x.c) === S.opposite(rowNet.cells, idxOf(cOf('B'))); }).t;     // 'D'
  const oppA = rowLabels.find(function (x) { return idxOf(x.c) === S.opposite(rowNet.cells, idxOf(cOf('A'))); }).t;     // 'F'
  const noNet = S.sq(['#.#.', '####']), blockNet = S.sq(['##..', '####']);

  T.packs[8] = {
    n: 8,
    title: "3D shapes and nets",
    los: [G4, G5],
    blurb: {
      en: "Look at *3D shapes* from different sides. Find the *nets* of a cube.",
      vi: "Quan sát *hình khối* từ nhiều phía. Tìm *hình khai triển* của hình lập phương."
    },
    words: {
      sets: [
        { id: 'A', title: { en: 'Parts of a 3D shape', vi: 'Các phần của hình khối' }, keys: ['face', 'edge', 'vertex'] },
        { id: 'B', title: { en: '3D shapes', vi: 'Các hình khối' }, keys: ['cuboid', 'prism', 'pyramid'] },
        { id: 'C', title: { en: 'Cubes and nets', vi: 'Hình lập phương và hình khai triển' }, keys: ['cube', 'net', 'orientation'] }
      ],
      items: {
        'face': { art: 'w-s8-face', vi: 'mặt', def: 'A flat surface of a 3D shape. A cube has 6 square faces.' },
        'edge': { art: 'w-s8-edge', vi: 'cạnh', def: 'A line where two faces meet. A cube has 12 edges.' },
        'vertex': { art: 'w-s8-vertex', vi: 'đỉnh', def: 'A corner where edges meet. A cube has 8 vertices.' },
        'cuboid': { art: 'w-s8-cuboid', vi: 'hình hộp chữ nhật', def: 'A box shape with 6 rectangle faces. A brick is a cuboid.' },
        'prism': { art: 'w-s8-prism', vi: 'hình lăng trụ', def: 'A 3D shape with two ends that are the same. A triangular prism has 2 triangle ends.' },
        'pyramid': { art: 'w-s8-pyramid', vi: 'hình chóp', def: 'A 3D shape with one base. Its other faces are triangles that meet at a point.' },
        'cube': { art: 'w-s8-cube', vi: 'hình lập phương', def: 'A 3D shape with 6 square faces, all the same size. A dice is a cube.' },
        'net': { art: 'w-s8-net', vi: 'hình khai triển', def: 'A flat shape that folds up to make a 3D shape. A net of a cube has 6 squares.' },
        'orientation': { art: 'w-s8-orientation', vi: 'hướng đặt của hình', def: 'The way a shape is turned. A cone on its side is still a cone.' }
      }
    },
    // See it: one challenge scene, picture-led. Rounds 1 and 2 are done together (the hint is open).
    see: {
      scenes: [
        { id: 'challenge', title: { en: 'Fold it and turn it', vi: 'Gấp hình và xoay hình' },
          challenge: {
            end: { en: 'You did it! You can fold nets in your head.', vi: 'Em làm được rồi! Em biết gấp hình khai triển trong đầu.' },
            result: 'You found nets of a cube, counted cubes and turned 3D shapes.',
            rounds: [
              R('our', [G5], ['TWM.01'], [
                { type: 's8isnet', ctx: 'Each shape is made of <b>6</b> squares.', shapes: [['##..', '####'], ['.#..', '####', '.#..'], ['#.#.', '####'], ['###', '###']] },
                { type: 's8isnet', ctx: 'Each shape is made of <b>6</b> squares.', shapes: [['#..#', '####'], ['###', '#..', '##.'], ['#...', '####', '..#.'], ['##.', '.##', '.##']] },
                { type: 's8isnet', ctx: 'Each shape is made of <b>6</b> squares.', shapes: [['##..', '.###', '.#..'], ['.#.#', '####'], ['###.', '.###'], ['###', '.#.', '.##']] }]),
              R('our', [G4], ['TWM.05'], [
                { type: 's8cubes', cubes: B.chair5 },
                { type: 's8cubes', cubes: B.hook5 },
                { type: 's8cubes', cubes: B.hook6 }]),
              R('your', [G5], ['TWM.01'], [
                { type: 's8place', rows: ['.#..', '####'] },
                { type: 's8place', rows: ['##..', '.###'] },
                { type: 's8place', rows: ['###', '.#.', '.#.'] }]),
              R('your', [G4], ['TWM.06'], [
                { type: 's8solid', ask: 'same', s: 'triprism', o: 0, o2: 3, others: [['sqpyramid', 1], ['cuboid', 2], ['tripyramid', 0]], at: 2 },
                { type: 's8solid', ask: 'same', s: 'sqpyramid', o: 0, o2: 1, others: [['triprism', 1], ['cone', 2], ['tripyramid', 1]], at: 0 },
                { type: 's8solid', ask: 'same', s: 'cylinder', o: 0, o2: 1, others: [['cone', 1], ['hexprism', 2], ['cuboid', 1]], at: 3 }]),
              R('your', [G5], ['TWM.05'], [
                { type: 's8opp', rows: ['.A..', '#*BC', '.D..'] },
                { type: 's8opp', rows: ['*...', 'AB#C', '..D.'] },
                { type: 's8opp', rows: ['A*..', '.B#C', '.D..'] }])
            ] } }]
    },
    practise: [
      { id: 's8r', kit: 'model', game: 'r', surface: 'board', art: 'icon-step-practise',
        title: 'Draw it', blurb: { en: 'Finish nets, find opposite faces and turn cube shapes.', vi: 'Hoàn thành hình khai triển, tìm mặt đối diện và xoay các hình ghép từ khối lập phương.' },
        levels: [
          { title: { en: 'Nets of a cube', vi: 'Hình khai triển của hình lập phương' }, rounds: [
            R('our', [G5], ['TWM.01'], [
              { type: 's8place', rows: ['#...', '####'] },
              { type: 's8place', rows: ['##.', '.##', '..#'] },
              { type: 's8place', rows: ['.#.', '###', '.#.'] }]),
            R('your', [G5], ['TWM.01'], [
              { type: 's8where', rows: ['A#.B.', '####D', '..C..'] },
              { type: 's8where', rows: ['##A..', 'B###D', '.C...'] },
              { type: 's8where', rows: ['###C', 'B#..', '.#D.', '.A..'] }]),
            R('your', [G5], ['TWM.05'], [
              { type: 's8opp', rows: ['.1..', '2345', '.6..'], of: 2 },
              { type: 's8opp', rows: ['1...', '2345', '...6'], of: 1 },
              { type: 's8opp', rows: ['12..', '.34.', '..56'], of: 3 }])] },
          { title: { en: 'Cubes and views', vi: 'Khối lập phương và hình nhìn từ các phía' }, rounds: [
            R('your', [G4], ['TWM.05'], [
              { type: 's8view', cubes: B.flag5, view: 'top', wrong: ['front', { rows: ['###', '.#.'] }, { rows: ['##', '##', '#.'] }], at: 1 },
              { type: 's8view', cubes: B.key5, view: 'front', wrong: ['top', 'side', { rows: ['.#.', '###'] }], at: 3 },
              { type: 's8view', cubes: B.post5, view: 'side', wrong: ['front', { rows: ['.#.', '###'] }, { rows: ['##', '##'] }], at: 0 }]),
            R('your', [G4], ['TWM.01'], [
              { type: 's8same', cubes: B.L5, turn: 'x', others: [S.spin(B.Y5, 'z'), B.N5, S.spin(B.P5, 'z')], at: 2 },
              { type: 's8same', cubes: B.flag5, turn: 'z', others: [S.spin(B.hid5, 'zx'), B.L5, S.spin(B.T5, 'x')], at: 0 },
              { type: 's8same', cubes: B.T5, turn: 'x', others: [S.spin(B.Y5, 'x'), B.X5, S.spin(B.V5, 'z')], at: 3 }])] }] },
      { id: 's8a', kit: 'model', game: 'a', surface: 'paper', art: 'icon-step-test',
        title: 'Solve it', blurb: { en: 'Answer questions like the test.', vi: 'Trả lời câu hỏi giống bài kiểm tra.' },
        levels: [
          { title: { en: 'Shapes and nets', vi: 'Hình khối và hình khai triển' }, rounds: [
            R('your', [G4], ['TWM.05'], [
              { type: 's8count', s: 'triprism', o: 0, ask: 'all' },
              { type: 's8count', s: 'sqpyramid', o: 0, ask: 'all' },
              { type: 's8count', s: 'hexprism', o: 0, ask: 'all' }]),
            R('your', [G5], ['TWM.01'], [
              { type: 's8isnet', want: 'not', ctx: 'Chi draws four shapes on squared paper.', shapes: [['#...', '####', '#...'], ['##..', '.##.', '..##'], ['#..', '###', '#.#'], ['.#..', '####', '..#.']] },
              { type: 's8isnet', want: 'not', ctx: 'Phong draws four shapes on squared paper.', shapes: [['.#.', '###', '#.#'], ['#...', '####', '...#'], ['##..', '.###', '..#.'], ['.#.', '.#.', '###', '.#.']] },
              { type: 's8isnet', want: 'not', ctx: 'Yen draws four shapes on squared paper.', shapes: [['##..', '.###', '...#'], ['#...', '####', '.#..'], ['.##', '.#.', '##.', '#..'], ['#.##', '###.']] }]),
            R('your', [G5], ['TWM.05'], [
              { type: 's8opp', open: true, rows: ['.1.', '234', '.5.'] },
              { type: 's8opp', open: true, rows: ['1...', '2345'] },
              { type: 's8opp', open: true, rows: ['12.', '.34', '..5'] }])] },
          { title: { en: 'Think and explain', vi: 'Suy nghĩ và giải thích' }, rounds: [
            R('your', [G4], ['TWM.06'], [
              { type: 's8solid', ask: 'props', s: 'triprism', o2: 0, others: [['sqpyramid', 0], ['cuboid', 0], ['tripyramid', 0]], at: 1 },
              { type: 's8solid', ask: 'props', s: 'hexprism', o2: 0, others: [['cube', 0], ['pentprism', 0], ['triprism', 1]], at: 3 },
              { type: 's8solid', ask: 'props', s: 'tripyramid', o2: 0, others: [['triprism', 0], ['sqpyramid', 0], ['cube', 2]], at: 0 }]),
            R('your', [G5, G4], ['TWM.04', 'TWM.07'], [
              S.claim({ kind: 'any6', who: 'Quan', at: 1, nets: [['.#..', '####', '.#..'], ['##..', '####'], ['#...', '####', '..#.']] }),
              S.claim({ kind: 'tri', who: 'Trang', at: 2, list: [['sqpyramid', 0], ['cube', 0], ['triprism', 0]] }),
              S.claim({ kind: 'touch', who: 'Binh', at: 0, rows: ['.A..', 'BCDE', '.F..'] })])] }] }
    ],
    notes: {
      items: [
        { en: 'A 3D shape has [[faces|face]], [[edges|edge]] and [[vertices|vertex]]. Count the ones at the back too.',
          vi: 'Hình khối có các mặt, các cạnh và các đỉnh. Nhớ đếm cả những phần ở phía sau.',
          example: ['A [[cuboid]] has 6 faces and 12 edges.', 'Count the corners: 4 on top and 4 below. It has *8 vertices*.'],
          pic: { k: 's8solid', s: 'cuboid', o: 0, mark: { vertex: 'all' } } },
        { en: 'A [[prism]] has two ends that are the same. A [[pyramid]] has one base and triangle faces that meet at a point.',
          vi: 'Hình lăng trụ có hai đáy giống nhau. Hình chóp có một đáy và các mặt tam giác chụm lại ở một đỉnh.',
          example: ['Triangular prism: 2 triangles + 3 rectangles = *5 faces*.', 'Square-based pyramid: 1 square + 4 triangles = *5 faces*.'],
          pic: { k: 's8row', list: [{ k: 's8solid', s: 'triprism', o: 0, cap: 'prism' }, { k: 's8solid', s: 'sqpyramid', o: 0, cap: 'pyramid' }] } },
        { en: 'Turn a 3D shape and it is still the same shape. A new [[orientation]] does not change its faces, edges or vertices.',
          vi: 'Xoay một hình khối thì nó vẫn là hình đó. Hướng đặt mới không làm thay đổi số mặt, số cạnh hay số đỉnh.',
          example: ['A triangular prism on its end is *still a triangular prism*.', 'It still has 5 faces, 9 edges and 6 vertices.'],
          pic: { k: 's8row', list: [{ k: 's8solid', s: 'triprism', o: 0 }, { k: 's8solid', s: 'triprism', o: 1 }, { k: 's8solid', s: 'triprism', o: 3 }] } },
        { en: 'Count cubes one layer at a time. From the top, each stack of cubes looks like one square.',
          vi: 'Đếm các khối lập phương theo từng tầng. Nhìn từ trên xuống, mỗi chồng khối trông như một ô vuông.',
          example: ['Bottom layer: 4 cubes. Top layer: 1 cube. 4 + 1 = *5 cubes*.', 'From the top you see only *4 squares*.'],
          pic: { k: 's8row', list: [{ k: 's8iso', cubes: B.flag5, arrows: ['top'], look: 'top' }, { k: 's8view', cells: S.views(B.flag5).top, cap: 'from the top' }] } },
        { en: 'A [[net]] is a flat shape that folds into a 3D shape. A net of a [[cube]] has 6 squares that fold onto 6 different faces.',
          vi: 'Hình khai triển là hình phẳng gấp lại được thành hình khối. Hình khai triển của hình lập phương có 6 ô vuông, gấp thành 6 mặt khác nhau.',
          example: ['A cube has *' + nNets + '* different nets. An open cube (no lid) has nets of *5* squares.', 'Not a net: two squares fold onto the same face (red), or 4 squares make a 2 × 2 block.'],
          pic: { k: 's8row', list: [{ k: 's8net', rows: ['.#..', '####', '.#..'], good: S.sq(['.#..', '####', '.#..']), cap: 'a net', U: 30 },
            { k: 's8net', cells: noNet, bad: S.whyNot(noNet).bad, cap: 'not a net', U: 30, box: [4, 3] }, { k: 's8net', cells: blockNet, bad: S.whyNot(blockNet).bad, cap: 'not a net', U: 30, box: [4, 3] }] } },
        { en: 'Squares that touch in a net are never opposite [[faces|face]]. In a straight row, skip one square to find the opposite face.',
          vi: 'Hai ô vuông kề nhau (chung một cạnh) trong hình khai triển không bao giờ là hai mặt đối diện. Trong một hàng thẳng, bỏ qua một ô để tìm mặt đối diện.',
          example: ['Row B, C, D, E: B is opposite *' + oppB + '* (skip C).', 'A and ' + oppA + ' fold up and down. They are opposite too.'],
          pic: { k: 's8net', cells: rowNet.cells, labels: rowLabels, shade: [cOf('B')], good: [cOf(oppB)] } }
      ],
      check: [
        { sentence: 'A cube has {12|8|6} edges.', answer: String(S.solid('cube').E) },
        { sentence: 'A triangular prism has {5|6|3} faces.', answer: String(S.solid('triprism').F) },
        { sentence: 'Turn a pyramid upside down. It is {still a pyramid|now a prism|now a cone}.', answer: 'still a pyramid' },
        { sentence: 'A tower of 3 cubes. From the top you see {1 square|3 squares|2 squares}.', answer: S.views([[0, 0, 0], [0, 0, 1], [0, 0, 2]]).top.length + ' square' },
        { sentence: 'A net of a cube has {6|5|4} squares.', answer: String(S.census().allNets[0].length) },
        { sentence: 'In a row of squares B, C, D, E, the face opposite B is {D|C|E}.', answer: oppB }
      ]
    },
    // Mini Practice test: DOK 1, 1, 1, 1, 2, 2, 2, 2, 2, 3. Both objectives are tested. Question 10 is a claim.
    test: {
      items: [
        Q(1, [G4], ['TWM.05'], [
          { type: 's8solid', ask: 'name', s: 'triprism', o: 2, others: ['cuboid', 'sqpyramid', 'tripyramid'], at: 1 },
          { type: 's8solid', ask: 'name', s: 'sqpyramid', o: 2, others: ['tripyramid', 'triprism', 'cone'], at: 3 },
          { type: 's8solid', ask: 'name', s: 'cylinder', o: 1, others: ['cone', 'cuboid', 'hexprism'], at: 0 }]),
        Q(1, [G4], ['TWM.05'], [
          { type: 's8count', s: 'cube', o: 1, ask: 'edges' },
          { type: 's8count', s: 'sqpyramid', o: 3, ask: 'vertices' },
          { type: 's8count', s: 'triprism', o: 1, ask: 'faces' }]),
        Q(1, [G5], ['TWM.01'], [
          { type: 's8isnet', shapes: [['###', '###'], ['#..#', '####'], ['#...', '####', '#...'], ['##..', '####']] },
          { type: 's8isnet', shapes: [['##..', '.##.', '..##'], ['#.#.', '####'], ['.#.', '###', '#.#'], ['###.', '.###']] },
          { type: 's8isnet', shapes: [['.#.#', '####'], ['##.', '.##', '.##'], ['###', '#..', '##.'], ['#...', '####', '...#']] }]),
        Q(1, [G4], ['TWM.05'], [
          { type: 's8cubes', cubes: B.two5 },
          { type: 's8cubes', cubes: B.post5 },
          { type: 's8cubes', cubes: B.stair6 }]),
        Q(2, [G5], ['TWM.01'], [
          { type: 's8where', ctx: 'Tu cuts out <b>5</b> squares joined together.', rows: ['.A..', '####B', 'C#.D'] },
          { type: 's8where', ctx: 'Lan cuts out <b>5</b> squares joined together.', rows: ['A##.', '.B##C', '..#D'] },
          { type: 's8where', ctx: 'Khoi cuts out <b>5</b> squares joined together.', rows: ['#A..', '##B.', '.##C', '.D..'] }]),
        Q(2, [G5], ['TWM.05'], [
          { type: 's8opp', rows: ['A...', '*BC#', '..D.'] },
          { type: 's8opp', rows: ['A#..', '.B*.', '..CD'] },
          { type: 's8opp', rows: ['*AB..', '..C#D'] }]),
        Q(2, [G4], ['TWM.05'], [
          { type: 's8view', cubes: B.tee5, view: 'front', wrong: ['top', 'side', { rows: ['###'] }], at: 2 },
          { type: 's8view', cubes: B.six1, view: 'side', wrong: ['top', 'front', { rows: ['##', '##'] }], at: 0 },
          { type: 's8view', cubes: B.six2, view: 'top', wrong: ['front', 'side', { rows: ['##', '##', '##'] }], at: 3 }]),
        Q(2, [G5], ['TWM.06'], [
          { type: 's8isnet', open: true, ctx: 'Each shape is made of <b>5</b> squares.', shapes: [['#####'], ['##.', '###'], ['.#..', '####'], ['#.#', '###']] },
          { type: 's8isnet', open: true, ctx: 'Each shape is made of <b>5</b> squares.', shapes: [['#..', '#..', '###'], ['.#.', '###', '.#.'], ['###', '#.#'], ['##', '##', '#.']] },
          { type: 's8isnet', open: true, ctx: 'Each shape is made of <b>5</b> squares.', shapes: [['##.', '.#.', '.##'], ['##.', '###'], ['#.#', '###'], ['#####']] }]),
        Q(2, [G4], ['TWM.01'], [
          { type: 's8same', cubes: B.L4, turn: 'x', others: [S.spin(B.T4, 'z'), B.S4, S.spin(B.I4, 'z')], at: 1 },
          { type: 's8same', cubes: B.V5, turn: 'x', others: [S.spin(B.L5, 'z'), B.W5, S.spin(B.P5, 'x')], at: 3 },
          { type: 's8same', cubes: B.Y5, turn: 'xz', others: [S.spin(B.L5, 'x'), B.N5, S.spin(B.T5, 'z')], at: 0 }]),
        Q(3, [G5], ['TWM.04', 'TWM.07'], [
          S.claim({ kind: 'onlyone', who: 'Khoa', at: 1, nets: [['.#..', '####', '.#..'], ['#.#.', '####'], ['##..', '.###', '.#..']] }),
          S.claim({ kind: 'row5', who: 'Vy', at: 0, nets: [['#...', '####', '..#.'], ['..#..', '#####'], ['##..', '.##.', '..##']] }),
          S.claim({ kind: 'row4', who: 'Dung', at: 2, nets: [['#...', '####', '.#..'], ['###', '###'], ['###..', '..###']] })])
      ]
    },
    lightning: { secs: 60, items: quick.concat(facts) },
    selfcheck: {
      goals: ["name a 3D shape and count its faces, edges and vertices", "spot the same shape when it is turned round", "count the cubes in a shape and choose its top, front or side view",
        "tell if a shape of squares is a net of a cube or of an open cube", "find opposite faces in a net of a cube"],
      again: ['a', 'c', 'r', 'r', 'c']
    }
  };
})(window.T = window.T || {});
