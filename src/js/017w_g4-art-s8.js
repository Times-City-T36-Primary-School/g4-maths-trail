/* g4-art-s8.js - the Stop 8 word card pictures (viewBox 400 x 300, flat style, no words inside a picture).

   w-s8-face, w-s8-edge, w-s8-vertex                  Set A: the parts of a 3D shape (the part is blue)
   w-s8-cuboid, w-s8-prism, w-s8-pyramid              Set B: 3D shapes
   w-s8-cube, w-s8-net, w-s8-orientation              Set C: cubes, nets and turning

   The solids, the net and the cubes are drawn by the same code as the question pictures (MX.s8 in
   009d_g4-models-s8.js), so a word card shows a shape exactly as the questions do. */
(function () {
  'use strict';
  const S = window.MX.s8, ART = window.T_ART = window.T_ART || {};

  function word(id, label, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="art" data-art="' + id +
      '" role="img" aria-label="' + label + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' + body + '</svg>';
  }
  // a drawing of MX.s8 placed inside the card: centred at cx, cy and h high
  function put(svg, cx, cy, h) {
    const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg), w = h * vb[1] / vb[2];
    return svg.replace(/^<svg [^>]*>/, '<svg x="' + (cx - w / 2).toFixed(1) + '" y="' + (cy - h / 2).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h +
      '" viewBox="0 0 ' + vb[1] + ' ' + vb[2] + '" fill="none" stroke-linejoin="round" stroke-linecap="round">');
  }
  const solid = function (s, o, tone, mark) { return S.svgSolid({ s: s, o: o, tone: tone, mark: mark, bare: true }); };
  const turnArrow = function (x, y) {
    return '<path d="M' + (x - 20) + ' ' + (y + 6) + 'c8 -20 32 -20 40 0" stroke="#1F5CA0" stroke-width="5"/><path d="M' + (x + 8) + ' ' + (y + 2) + 'l12 5 4 -13" stroke="#1F5CA0" stroke-width="5"/>';
  };

  /* ---------- Set A: the parts of a 3D shape ---------- */
  ART['w-s8-face'] = word('w-s8-face', 'A cube. One flat face is coloured blue.', put(solid('cube', 0, 'sand', { face: 'auto' }), 200, 150, 380));
  ART['w-s8-edge'] = word('w-s8-edge', 'A cube. One edge, the line where two faces meet, is a thick blue line.', put(solid('cube', 0, 'sand', { edge: 'auto' }), 200, 150, 380));
  ART['w-s8-vertex'] = word('w-s8-vertex', 'A cube. One vertex, a corner where edges meet, has a big blue dot.', put(solid('cube', 0, 'sand', { vertex: 'auto' }), 200, 150, 380));

  /* ---------- Set B: 3D shapes ---------- */
  ART['w-s8-cuboid'] = word('w-s8-cuboid', 'A cuboid: a box with 6 rectangle faces.', put(solid('cuboid', 0, 'blue'), 200, 150, 360));
  ART['w-s8-prism'] = word('w-s8-prism', 'Two prisms: a triangular prism and a hexagonal prism. Each has two ends that are the same.',
    put(solid('triprism', 0, 'green'), 135, 150, 300) + put(solid('hexprism', 0, 'green'), 315, 160, 210));
  ART['w-s8-pyramid'] = word('w-s8-pyramid', 'A square-based pyramid: triangle faces meet at a point.', put(solid('sqpyramid', 0, 'red'), 200, 150, 350));

  /* ---------- Set C: cubes, nets and turning ---------- */
  ART['w-s8-cube'] = word('w-s8-cube', 'A cube: 6 square faces, all the same size.', put(solid('cube', 0, 'red'), 200, 150, 380));
  ART['w-s8-net'] = word('w-s8-net', 'A flat shape of 6 squares, a net. An arrow shows that it folds up into a cube.',
    put(S.svgNet({ cells: S.sq(['.#.', '###', '.#.', '.#.']), bare: true, pad: 0.3 }), 110, 150, 270) +
    '<path d="M214 150h46M244 134l18 16 -18 16" stroke="#1F5CA0" stroke-width="7"/>' +
    put(solid('cube', 0, 'sand'), 330, 150, 190));
  ART['w-s8-orientation'] = word('w-s8-orientation', 'The same triangular prism three times, turned a different way each time.',
    put(solid('triprism', 0, 'blue'), 72, 175, 190) + put(solid('triprism', 1, 'blue'), 200, 175, 190) + put(solid('triprism', 3, 'blue'), 328, 175, 190) +
    turnArrow(136, 62) + turnArrow(264, 62));
})();
