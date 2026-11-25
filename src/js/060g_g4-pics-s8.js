/* g4-pics-s8.js - Stop 8 (3D shapes and nets): the picture kinds and the tap tool. The drawing itself (SVG) and all the
   geometry are in 009d_g4-models-s8.js (MX.s8); here the drawings become elements for T.tools.pic.

   { k: 's8net', cells: [[c, r], ...], shade, good, bad: [[c, r]], labels: [{ c: [c, r], t: 'A' }], cands: [{ c, t }],
     box: [cols, rows], cap: 'A' }       a net on faint squared paper (fold lines dashed, a shaded square, lettered places)
     rows: ['.#.', '###', ...] may be given in place of cells
   { k: 's8view', cells, box, cap }      a flat view (top, front, side) on squared paper
   { k: 's8iso', cubes: [[x, y, z], ...], hl: [[x, y, z]], arrows: ['top' | 'front' | 'side'], fit, cap }
                                         a cube building on isometric dotty paper (hidden faces are not drawn)
   { k: 's8solid', s: 'cube' | 'cuboid' | 'triprism' | 'pentprism' | 'hexprism' | 'sqpyramid' | 'tripyramid' | 'cylinder'
     | 'cone', o: 0 | 1 | 2 (a turn) or rot: [x, y, z], tone, cap }     a named solid, turned; back edges are dashed
   { k: 's8row', list: [spec, ...] }     small pictures side by side, each with its caption (cap)
   T.tools.s8tap(host, { cells })        the net on a grid: the child taps an empty square to add it.
                                         get() -> { cell: [c, r] | null }; solve({ cell }) shows a right square in green. */
(function (T) {
  'use strict';
  const el = T.util.el, kinds = T.tools.picKinds = T.tools.picKinds || {};
  const S = function () { return window.MX.s8; };

  function fig(cls, svg, cap) {
    const f = el('figure', { class: 'g4s8-pic ' + cls });
    const box = el('div', { class: 'g4s8-pic__art' });
    box.innerHTML = svg;
    f.appendChild(box);
    if (cap) f.appendChild(el('figcaption', { class: 'g4s8-pic__cap' }, cap));
    return f;
  }
  const cellsOf = function (spec) { return spec.cells || S().sq(spec.rows); };

  kinds.s8net = function (spec) { return fig('g4s8-pic--net', S().svgNet(Object.assign({}, spec, { cells: cellsOf(spec) })), spec.cap); };
  kinds.s8view = function (spec) { return fig('g4s8-pic--view', S().svgNet(Object.assign({}, spec, { cells: cellsOf(spec), flat: true })), spec.cap); };
  kinds.s8iso = function (spec) { return fig('g4s8-pic--iso', S().svgIso(spec), spec.cap); };
  kinds.s8solid = function (spec) { return fig('g4s8-pic--solid', S().svgSolid(spec), spec.cap); };
  kinds.s8row = function (spec) {
    const row = el('div', { class: 'g4s8-row' });
    (spec.list || []).forEach(function (s) { const p = T.tools.pic(s); if (p) row.appendChild(p); });
    return row.children.length ? row : null;
  };

  // the tap tool: the net on a grid one square bigger on every side; an empty square can be tapped
  T.tools.s8tap = function (host, spec) {
    const ev = T.tools.emitter(), cells = spec.cells;
    const xs = cells.map(function (c) { return c[0]; }), ys = cells.map(function (c) { return c[1]; });
    const x0 = Math.min.apply(null, xs) - 1, x1 = Math.max.apply(null, xs) + 1, y0 = Math.min.apply(null, ys) - 1, y1 = Math.max.apply(null, ys) + 1;
    const taps = [];
    for (let r = y0; r <= y1; r++) for (let c = x0; c <= x1; c++) if (!cells.some(function (k) { return k[0] === c && k[1] === r; })) taps.push([c, r]);
    let cell = null, locked = false, shown = null;
    const root = el('div', { class: 'g4s8-tap', role: 'group', 'aria-label': 'The net on a grid. Tap an empty square to add it.' });
    function draw() {
      const all = cell ? cells.concat([cell]) : cells;
      root.innerHTML = S().svgNet({ cells: shown ? cells.concat([shown]) : all, taps: locked ? [] : taps.filter(function (t) { return !cell || t[0] !== cell[0] || t[1] !== cell[1]; }),
        shade: cell && !shown ? [cell] : [], good: shown ? [shown] : [], box: [x1 - x0 + 1, y1 - y0 + 1], pad: 0.15, U: 40,
        alt: 'A net of ' + cells.length + ' squares' + (cell ? ' and your new square.' : '.') });
      // keep the frame of the whole grid, also when the taps are not drawn
      const svg = root.firstChild, U = 40, pad = 0.15;
      svg.setAttribute('viewBox', '0 0 ' + (x1 - x0 + 1 + 2 * pad) * U + ' ' + (y1 - y0 + 1 + 2 * pad) * U);
      svg.removeAttribute('width'); svg.removeAttribute('height');
      T.util.$$('.g4s8-tapcell', root).forEach(function (n) {
        n.setAttribute('tabindex', '0'); n.setAttribute('role', 'button');
        n.setAttribute('aria-label', 'Empty square, column ' + (n.dataset.c - x0 + 1) + ', row ' + (n.dataset.r - y0 + 1));
      });
    }
    function tap(e) {
      const n = e.target && e.target.closest ? e.target.closest('.g4s8-tapcell') : null;
      if (!n || locked) return;
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      cell = [+n.dataset.c, +n.dataset.r];
      try { if (T.fx && T.fx.sfx) T.fx.sfx('pick'); } catch (x) { /* sound is a nicety */ }
      draw(); ev.emit('change');
    }
    root.addEventListener('click', tap); root.addEventListener('keydown', tap);
    draw();
    if (host) host.appendChild(root);
    return { el: root, on: ev.on, get: function () { return { cell: cell }; }, set: function (v) { cell = v && v.cell ? v.cell : null; draw(); },
      ready: function () { return !!cell; }, lock: function () { locked = true; draw(); },
      solve: function (right) { shown = right && right.cell; locked = true; cell = null; draw(); }, destroy: function () { root.remove(); } };
  };
})(window.T = window.T || {});
