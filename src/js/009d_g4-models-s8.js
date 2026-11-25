/* g4-models-s8.js - Stop 8 (3D shapes and nets): the geometry, the drawings and the question models.
   No answer of this stop is written by hand: every key is WORKED OUT here from the data.

   MX.s8 (the geometry, no page code):
     nets      a net is a list of unit squares [col, row].
               parse(rows)          ['.#..', '####', '.#..'] -> { cells, marks: { '#': [[c, r], ...], 'A': [...] } }
               fold(cells)          really folds the shape: a cube ROLLS over the squares (breadth-first over the squares
                                    that share an edge) and stamps the face it stands on. -> { ok, connected, rigid,
                                    faces: [face of each square], clash: [i, j] }; faces 0..5, f ^ 1 is the opposite face.
                                    ok = joined edge to edge, no 2 × 2 block (it cannot fold) and all faces different.
               isNet(cells)         6 squares that fold into a cube;  isOpen(cells)  5 squares: a cube with no lid
               completions(cells)   every place where one more square makes a net (6) or an open net (5)
               opposite(cells, i)   the square that lands opposite square i (or -1)
               census()             counts the free hexominoes (35) that fold (must be 11) and the free pentominoes (12)
                                    that fold into an open cube (8): the check of fold() against the known facts
     cubes     a building is a list of unit cubes [x, y, z] (z is up). spin(cubes, 'zx') quarter turns, same(a, b) the
               same shape after any of the 24 turns, views(cubes) -> { top, front, side } as squares [col, row],
               seen(cubes) which cubes the isometric drawing shows (worked out per triangle of the dotty paper).
     solids    solid(name) -> a mesh { V, E, F, verts, faces }; the numbers of faces, edges and vertices are COUNTED
               from the mesh (and checked against the prism and pyramid rules).
     drawings  svgNet(spec), svgIso(spec), svgSolid(spec) -> an SVG string (used by 047g_g4-pics-s8.js and the word cards).

   Models (MX.M): s8isnet, s8where, s8place (tap the grid: tool 's8tap'), s8opp, s8cubes, s8same, s8view, s8count,
   s8solid. Claims: MX.s8.claim(d) makes the data of a `claim` question and checks the statement in code first. */
(function () {
"use strict";
const M = MX.M, LET = MX.LET, arrange = MX.arrange;
const S = MX.s8 = {};
const fail = m => { throw new Error("s8: " + m); };

/* ================= nets ================= */
const ck = c => c[0] + "," + c[1];
const sortCells = cells => cells.slice().sort((a, b) => a[1] - b[1] || a[0] - b[0]);
function parse(rows) {
  const marks = {}, cells = [];
  rows.forEach((row, r) => row.split("").forEach((ch, c) => { if (ch !== "." && ch !== " ") { (marks[ch] = marks[ch] || []).push([c, r]); cells.push([c, r]); } }));
  return { cells: cells, marks: marks };
}
const sq = rows => (Array.isArray(rows) && typeof rows[0] === "string" ? parse(rows).cells : rows);

/* the cube stands on a square: o = [bottom, top, north, south, east, west]; it rolls to the next square */
const ROLL = [
  [1, 0, o => [o[4], o[5], o[2], o[3], o[1], o[0]]],
  [-1, 0, o => [o[5], o[4], o[2], o[3], o[0], o[1]]],
  [0, 1, o => [o[3], o[2], o[0], o[1], o[4], o[5]]],
  [0, -1, o => [o[2], o[3], o[1], o[0], o[4], o[5]]]
];
function fold(cells) {
  const n = cells.length, at = new Map(cells.map((c, i) => [ck(c), i])), ori = new Array(n).fill(null);
  let rigid = false; const queue = [0]; ori[0] = [0, 1, 2, 3, 4, 5];
  while (queue.length) {
    const i = queue.shift(), c = cells[i];
    ROLL.forEach(m => {
      const j = at.get(ck([c[0] + m[0], c[1] + m[1]])); if (j == null) return;
      const o = m[2](ori[i]);
      if (!ori[j]) { ori[j] = o; queue.push(j); } else if (ori[j].join() !== o.join()) rigid = true;   /* two ways round give two answers: a 2 × 2 block */
    });
  }
  const connected = ori.every(Boolean), faces = ori.map(o => (o ? o[0] : -1));
  let clash = null;
  for (let i = 0; i < n && !clash; i++) for (let j = i + 1; j < n; j++) if (faces[i] >= 0 && faces[i] === faces[j]) { clash = [i, j]; break; }
  return { ok: connected && !rigid && !clash && at.size === n, connected: connected, rigid: rigid, faces: faces, clash: clash };
}
const isNet = cells => cells.length === 6 && fold(cells).ok;
const isOpen = cells => cells.length === 5 && fold(cells).ok;
const fits = (cells, open) => (open ? isOpen(cells) : isNet(cells));
function around(cells) {                      /* the empty squares that share an edge with the shape */
  const has = new Set(cells.map(ck)), out = new Map();
  cells.forEach(c => ROLL.forEach(m => { const d = [c[0] + m[0], c[1] + m[1]]; if (!has.has(ck(d))) out.set(ck(d), d); }));
  return sortCells(Array.from(out.values()));
}
const completions = cells => around(cells).filter(d => fold(cells.concat([d])).ok);
function opposite(cells, i) { const f = fold(cells); return f.ok ? f.faces.indexOf(f.faces[i] ^ 1) : -1; }
function block(cells) {                        /* the four squares of a 2 × 2 block, if there is one */
  const has = new Set(cells.map(ck));
  for (const c of cells) { const b = [c, [c[0] + 1, c[1]], [c[0], c[1] + 1], [c[0] + 1, c[1] + 1]]; if (b.every(x => has.has(ck(x)))) return b; }
  return null;
}
function longRow(cells) {                      /* the longest straight row of squares */
  const has = new Set(cells.map(ck)); let best = 0;
  cells.forEach(c => [[1, 0], [0, 1]].forEach(d => { let k = 0; while (has.has(ck([c[0] + d[0] * k, c[1] + d[1] * k]))) k++; best = Math.max(best, k); }));
  return best;
}
/* why a shape is not a net, in a child's words, and the squares to colour */
function whyNot(cells, open) {
  const f = fold(cells), want = open ? 5 : 6;
  if (cells.length !== want) return { t: "It has " + cells.length + " squares. " + (open ? "An open cube has 5 faces." : "A cube has 6 faces."), bad: [] };
  if (!f.connected) return { t: "The squares are not all joined edge to edge.", bad: [] };
  const b = block(cells);
  if (b) return { t: "Four squares meet at one corner, in a 2 × 2 block. They cannot fold up.", bad: b };
  if (f.clash) return { t: "Two squares fold onto the same face, so the " + (open ? "box" : "cube") + " has a gap.", bad: f.clash.map(i => cells[i]) };
  return { t: "", bad: [] };
}

/* free polyominoes of n squares (turns and flips count as the same shape) */
const SYM = [c => [c[0], c[1]], c => [-c[1], c[0]], c => [-c[0], -c[1]], c => [c[1], -c[0]], c => [-c[0], c[1]], c => [c[1], c[0]], c => [c[0], -c[1]], c => [-c[1], -c[0]]];
function shift(cells) { const mx = Math.min.apply(null, cells.map(c => c[0])), my = Math.min.apply(null, cells.map(c => c[1])); return sortCells(cells.map(c => [c[0] - mx, c[1] - my])); }
const canon = cells => SYM.map(f => shift(cells.map(f)).map(ck).join(";")).sort()[0];
function free(n) {
  let level = new Map([[canon([[0, 0]]), [[0, 0]]]]);
  for (let k = 1; k < n; k++) {
    const next = new Map();
    level.forEach(cells => around(cells).forEach(d => { const g = cells.concat([d]), key = canon(g); if (!next.has(key)) next.set(key, shift(g)); }));
    level = next;
  }
  return Array.from(level.values());
}
let CENSUS = null;
function census() {
  if (!CENSUS) { const hex = free(6), pent = free(5), nets = hex.filter(isNet), open = pent.filter(isOpen);
    CENSUS = { hexominoes: hex.length, nets: nets.length, pentominoes: pent.length, open: open.length, allNets: nets, allHex: hex, allOpen: open }; }
  return CENSUS;
}
Object.assign(S, { parse: parse, sq: sq, fold: fold, isNet: isNet, isOpen: isOpen, around: around, completions: completions, opposite: opposite, longRow: longRow, whyNot: whyNot, canon: canon, free: free, census: census, block: block });

/* ================= cube buildings ================= */
const k3 = c => c[0] + "," + c[1] + "," + c[2];
function norm3(cubes) {
  const m = [0, 1, 2].map(i => Math.min.apply(null, cubes.map(c => c[i])));
  return cubes.map(c => [c[0] - m[0], c[1] - m[1], c[2] - m[2]]).sort((a, b) => a[2] - b[2] || a[0] - b[0] || a[1] - b[1]);
}
const TURN = { z: c => [-c[1], c[0], c[2]], x: c => [c[0], -c[2], c[1]], y: c => [c[2], c[1], -c[0]] };
const spin = (cubes, how) => norm3(String(how || "").split("").reduce((cs, t) => cs.map(TURN[t] || fail("turn " + t)), cubes));
const str3 = cubes => norm3(cubes).map(k3).join(";");
let ALL24 = null;
function turns24() {                           /* the 24 ways to turn a cube, as words of quarter turns */
  if (ALL24) return ALL24;
  const seen = new Map(), probe = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 2], [0, 0, 3]];
  const words = [""];
  for (let i = 0; i < words.length && seen.size < 24; i++) {
    const w = words[i], key = w.split("").reduce((cs, t) => cs.map(TURN[t]), probe).map(k3).join(";");
    if (!seen.has(key)) { seen.set(key, w); ["x", "y", "z"].forEach(t => words.push(w + t)); }
  }
  return (ALL24 = Array.from(seen.values()));
}
const canon3 = cubes => turns24().map(w => str3(spin(cubes, w))).sort()[0];
const same = (a, b) => a.length === b.length && canon3(a) === canon3(b);
const mirror = cubes => norm3(cubes.map(c => [-c[0], c[1], c[2]]));
function longLine(cubes) { const has = new Set(cubes.map(k3)); let best = 0;
  cubes.forEach(c => [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(d => { let k = 0; while (has.has(k3([c[0] + d[0] * k, c[1] + d[1] * k, c[2] + d[2] * k]))) k++; best = Math.max(best, k); }));
  return best; }
/* the three views, as flat squares [col, row]. The drawing looks from the corner where x, y and z are biggest:
   the FRONT is the left face of the drawing (you look along x), the SIDE is the right face (you look along y). */
function views(cubes) {
  const cs = norm3(cubes), X = Math.max.apply(null, cs.map(c => c[0])), Z = Math.max.apply(null, cs.map(c => c[2]));
  const uniq = list => { const m = new Map(); list.forEach(c => m.set(ck(c), c)); return sortCells(Array.from(m.values())); };
  return { top: uniq(cs.map(c => [c[1], c[0]])), front: uniq(cs.map(c => [c[1], Z - c[2]])), side: uniq(cs.map(c => [X - c[0], Z - c[2]])) };
}
/* the faces of a cube the drawing can show, as corner points on the dotty paper: p(x, y, z) -> [u, v] (whole numbers),
   on screen (u × √3 / 2, v / 2). Each face is 2 small triangles of the paper. */
const P = (x, y, z) => [y - x, x + y - 2 * z];
function faces3(c) {
  const x = c[0], y = c[1], z = c[2];
  return [
    { f: "top", n: [0, 0, 1], q: [P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)] },
    { f: "left", n: [1, 0, 0], q: [P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)] },
    { f: "right", n: [0, 1, 0], q: [P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)] }
  ];
}
const tri = (a, b, c) => (a[0] + b[0] + c[0]) + "," + (a[1] + b[1] + c[1]);
function painted(cubes) {                      /* painter's order: far cubes first; faces that touch another cube are left out */
  const cs = norm3(cubes).sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]) || a[2] - b[2]), has = new Set(cs.map(k3)), list = [];
  cs.forEach((c, i) => faces3(c).forEach(fc => { if (!has.has(k3([c[0] + fc.n[0], c[1] + fc.n[1], c[2] + fc.n[2]]))) list.push({ i: i, c: c, f: fc.f, q: fc.q }); }));
  return { cubes: cs, faces: list };
}
/* which cubes can be seen: full = a whole face shows, part = only a piece shows, none = hidden */
function seen(cubes) {
  const p = painted(cubes), own = new Map();
  p.faces.forEach((fc, k) => { const q = fc.q; own.set(tri(q[0], q[1], q[2]), k); own.set(tri(q[0], q[2], q[3]), k); });
  const count = p.faces.map(() => 0); own.forEach(k => { count[k]++; });
  const best = p.cubes.map(() => 0); p.faces.forEach((fc, k) => { best[fc.i] = Math.max(best[fc.i], count[k]); });
  const has = new Set(p.cubes.map(k3));
  return p.cubes.map((c, i) => ({ c: c, see: best[i] === 2 ? "full" : best[i] === 1 ? "part" : "none", held: has.has(k3([c[0], c[1], c[2] + 1])) }));
}
const allSeen = cubes => seen(cubes).every(s => s.see === "full");
/* every cube stands on the table or on another cube: no cube hangs in the air (in a drawing it could be read as a cube further back) */
const grounded = cubes => { const cs = norm3(cubes), has = new Set(cs.map(k3)); return cs.every(c => c[2] === 0 || has.has(k3([c[0], c[1], c[2] - 1]))); };
Object.assign(S, { norm3: norm3, spin: spin, same: same, canon3: canon3, mirror: mirror, views: views, seen: seen, allSeen: allSeen, grounded: grounded, longLine: longLine, painted: painted, turns24: turns24 });

/* ================= solids ================= */
const ngon = (n, r, rot) => Array.from({ length: n }, (x, i) => [r * Math.cos(rot + 2 * Math.PI * i / n), r * Math.sin(rot + 2 * Math.PI * i / n)]);
function prism(pts, h) {
  const n = pts.length, verts = pts.map(p => [p[0], -h / 2, p[1]]).concat(pts.map(p => [p[0], h / 2, p[1]])), faces = [];
  faces.push({ v: pts.map((p, i) => i), kind: "end" }); faces.push({ v: pts.map((p, i) => n + i), kind: "end" });
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; faces.push({ v: [i, j, n + j, n + i], kind: "side" }); }
  return { verts: verts, faces: faces };
}
function pyramid(pts, h) {
  const n = pts.length, verts = pts.map(p => [p[0], -h * 0.42, p[1]]).concat([[0, h * 0.58, 0]]), faces = [{ v: pts.map((p, i) => i), kind: "end" }];
  for (let i = 0; i < n; i++) faces.push({ v: [i, (i + 1) % n, n], kind: "side" });
  return { verts: verts, faces: faces };
}
const SHAPE = ["", "", "", "triangle", "square", "pentagon", "hexagon"];
/* name, family, the mesh, and the turns it is drawn in (degrees about x, y, z) */
const SOLIDS = {
  cube: { name: "cube", a: "a", fam: "prism", n: 4, mesh: () => prism(ngon(4, 1.06, Math.PI / 4), 1.5), o: [[0, 0, 0], [10, -10, 20], [38, 0, 22]] },
  cuboid: { name: "cuboid", a: "a", fam: "prism", n: 4, mesh: () => prism([[1.2, 0.62], [-1.2, 0.62], [-1.2, -0.62], [1.2, -0.62]].reverse(), 1.0), o: [[0, 0, 0], [0, 0, 90], [90, 55, 0]] },
  triprism: { name: "triangular prism", a: "a", fam: "prism", n: 3, mesh: () => prism(ngon(3, 0.92, Math.PI / 2), 2.1), o: [[-90, 80, 0], [0, 15, 0], [-90, -30, 0], [-90, -30, 30]] },
  pentprism: { name: "pentagonal prism", a: "a", fam: "prism", n: 5, mesh: () => prism(ngon(5, 0.95, Math.PI / 2), 1.7), o: [[0, 0, 0], [90, 35, 0], [0, 0, 90]] },
  hexprism: { name: "hexagonal prism", a: "a", fam: "prism", n: 6, mesh: () => prism(ngon(6, 0.95, 0), 1.7), o: [[0, 0, 0], [90, 35, 0], [0, 0, 90]] },
  sqpyramid: { name: "square-based pyramid", a: "a", fam: "pyramid", n: 4, mesh: () => pyramid(ngon(4, 1.2, Math.PI / 4), 1.9), o: [[0, 0, 0], [180, 20, 0], [30, 20, 0], [180, -25, 0]] },
  tripyramid: { name: "triangular-based pyramid", a: "a", fam: "pyramid", n: 3, mesh: () => pyramid(ngon(3, 1.25, Math.PI / 2), 1.8), o: [[0, 0, 0], [0, 0, 105], [170, 30, 0]] },
  cylinder: { name: "cylinder", a: "a", fam: "round", n: 40, round: true, flat: 2, curved: 1, edges: 2, vertices: 0, mesh: () => prism(ngon(40, 0.85, 0), 1.9), o: [[0, 0, 0], [0, 0, 90], [90, 40, 0], [0, 0, 55]] },
  cone: { name: "cone", a: "a", fam: "round", n: 40, round: true, flat: 1, curved: 1, edges: 1, vertices: 1, mesh: () => pyramid(ngon(40, 0.95, 0), 2.0), o: [[0, 0, 0], [0, 0, 100], [172, 0, 0], [0, 0, -60]] }
};
const MESH = {};
function solid(name) {
  if (MESH[name]) return MESH[name];
  const def = SOLIDS[name] || fail("no solid " + name), m = def.mesh(), edges = new Map();
  m.faces.forEach((f, k) => f.v.forEach((a, i) => { const b = f.v[(i + 1) % f.v.length], key = Math.min(a, b) + "-" + Math.max(a, b); if (!edges.has(key)) edges.set(key, { a: a, b: b, f: [] }); edges.get(key).f.push(k); }));
  const out = Object.assign({ id: name }, def, { verts: m.verts, faces: m.faces, edgeList: Array.from(edges.values()) });
  if (def.round) { out.F = def.flat + def.curved; out.E = def.edges; out.V = def.vertices; }
  else {
    out.F = m.faces.length; out.E = edges.size; out.V = m.verts.length;        /* counted from the mesh */
    const n = def.n, rule = def.fam === "prism" ? [n + 2, 3 * n, 2 * n] : [n + 1, 2 * n, n + 1];
    if (out.F !== rule[0] || out.E !== rule[1] || out.V !== rule[2] || out.V - out.E + out.F !== 2) fail("mesh of " + name + " does not fit its rule");
    out.tri = m.faces.filter(f => f.v.length === 3).length; out.quad = m.faces.filter(f => f.v.length === 4).length;
  }
  out.base = SHAPE[def.n] || "circle";
  return (MESH[name] = out);
}
/* how to count, in words (the numbers come from the mesh) */
function countWords(s, what) {
  const n = s.n, b = s.base;
  if (s.id === "cube" || s.id === "cuboid") {
    if (what === "faces") return "The top, the bottom and 4 faces round the sides: 2 + 4 = " + s.F + " faces.";
    if (what === "edges") return "4 edges on the top, 4 on the bottom and 4 that join them: 4 + 4 + 4 = " + s.E + " edges.";
    return "4 vertices on the top and 4 on the bottom: 4 + 4 = " + s.V + " vertices.";
  }
  if (s.fam === "prism") {
    const ends = s.id === "cube" ? "2 square ends" : s.id === "cuboid" ? "2 rectangle ends" : "2 " + b + " ends";
    if (what === "faces") return ends + " and " + n + " faces round the middle: 2 + " + n + " = " + s.F + " faces.";
    if (what === "edges") return n + " edges on each end and " + n + " edges that join the ends: " + n + " + " + n + " + " + n + " = " + s.E + " edges.";
    return n + " vertices on each end: " + n + " + " + n + " = " + s.V + " vertices.";
  }
  if (what === "faces") return "1 " + b + " base and " + n + " triangle faces: 1 + " + n + " = " + s.F + " faces.";
  if (what === "edges") return n + " edges round the base and " + n + " edges up to the top: " + n + " + " + n + " = " + s.E + " edges.";
  return n + " vertices on the base and 1 at the top: " + n + " + 1 = " + s.V + " vertices.";
}
/* what a solid looks like, in one sentence */
function trait(s) {
  const A = MX.cap(s.a) + " " + s.name;
  if (s.id === "cube") return A + " has 6 square faces.";
  if (s.id === "cuboid") return A + " has 6 rectangle faces.";
  if (s.id === "cylinder") return A + " has 2 circle faces and a curved surface.";
  if (s.id === "cone") return A + " has 1 circle face, a curved surface and a point.";
  if (s.fam === "prism") return A + " has 2 " + s.base + " ends and " + s.n + " rectangle faces.";
  return A + " has 1 " + s.base + " base and " + s.n + " triangle faces that meet at a point.";
}
S.trait = trait;
S.solid = solid; S.solidNames = Object.keys(SOLIDS); S.countWords = countWords;

/* ================= drawings (SVG strings) ================= */
const r1 = v => Math.round(v * 10) / 10;
const FONT = 'font-family="Arial, Helvetica, sans-serif" font-weight="700"';
const svgOpen = (w, h, cls, label) => '<svg xmlns="http://www.w3.org/2000/svg" width="' + Math.round(w * 3) + '" height="' + Math.round(h * 3) + '" viewBox="0 0 ' + r1(w) + " " + r1(h) + '" class="g4s8-svg ' + cls + '" role="img" aria-label="' + String(label || "").replace(/"/g, "") + '" fill="none" stroke-linejoin="round" stroke-linecap="round">';
const INK = "#3B2A0A", PAPER = "#F7FBFF", GRID = "#CFDDEC";

/* a net (or a flat view) on squared paper
   spec = { cells, shade: [[c, r]], good: [[c, r]], bad: [[c, r]], labels: [{ c: [c, r], t: 'A' }], cands: [{ c, t }],
            taps: [[c, r]] (tool), pick: [c, r], box: [cols, rows], flat: true (a view: no fold lines), U } */
function svgNet(spec) {
  const U = spec.U || 36, cells = spec.cells || [], extra = (spec.cands || []).map(x => x.c).concat(spec.taps || []), all = cells.concat(extra);
  const xs = all.map(c => c[0]), ys = all.map(c => c[1]);
  const x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs) + 1, y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys) + 1;
  const bw = Math.max(x1 - x0, (spec.box || [0, 0])[0]), bh = Math.max(y1 - y0, (spec.box || [0, 0])[1]), pad = spec.pad == null ? 0.5 : spec.pad;
  const ox = spec.org ? spec.org[0] - pad : (x0 + x1) / 2 - bw / 2 - pad, oy = spec.org ? spec.org[1] - pad : (y0 + y1) / 2 - bh / 2 - pad, W = (bw + 2 * pad) * U, H = (bh + 2 * pad) * U;
  const X = c => r1((c - ox) * U), Y = r => r1((r - oy) * U);
  const has = new Set(cells.map(ck)), inSet = (list, c) => (list || []).some(d => d[0] === c[0] && d[1] === c[1]);
  let s = svgOpen(W, H, spec.flat ? "g4s8-svg--view" : "g4s8-svg--net", spec.alt || (spec.flat ? "A flat view made of " + cells.length + " squares." : "A shape made of " + cells.length + " squares on squared paper."));
  if (!spec.bare) s += '<rect width="' + r1(W) + '" height="' + r1(H) + '" rx="8" fill="' + PAPER + '"/>';
  let g = ""; for (let c = Math.ceil(ox); c <= ox + bw + 2 * pad; c++) g += "M" + X(c) + " 0V" + r1(H); for (let r = Math.ceil(oy); r <= oy + bh + 2 * pad; r++) g += "M0 " + Y(r) + "H" + r1(W);
  s += '<path d="' + g + '" stroke="' + GRID + '" stroke-width="1.5"/>';
  const face = spec.flat ? "#CFE0F5" : "#FFE3A3", line = spec.flat ? "#1F3F6E" : "#6B4100";
  (spec.taps || []).forEach(c => { const on = spec.pick && spec.pick[0] === c[0] && spec.pick[1] === c[1];
    s += '<rect class="g4s8-tapcell' + (on ? " is-on" : "") + '" data-c="' + c[0] + '" data-r="' + c[1] + '" x="' + r1(X(c[0]) + 2) + '" y="' + r1(Y(c[1]) + 2) + '" width="' + (U - 4) + '" height="' + (U - 4) + '" rx="4" fill="' + (on ? "#BFD9F7" : "#FFFFFF") + '" fill-opacity="' + (on ? 1 : 0.01) + '" stroke="' + (on ? "#1F5CA0" : "none") + '" stroke-width="3"' + (on ? ' stroke-dasharray="6 5"' : "") + "/>"; });
  cells.forEach(c => { const f = inSet(spec.good, c) ? "#A9E2BF" : inSet(spec.bad, c) ? "#F7B9B2" : inSet(spec.shade, c) ? "#3B82D6" : face;
    s += '<rect x="' + X(c[0]) + '" y="' + Y(c[1]) + '" width="' + U + '" height="' + U + '" fill="' + f + '"/>'; });
  let inner = "", outer = "";
  cells.forEach(c => {
    if (has.has(ck([c[0] + 1, c[1]]))) inner += "M" + X(c[0] + 1) + " " + Y(c[1]) + "V" + Y(c[1] + 1); else outer += "M" + X(c[0] + 1) + " " + Y(c[1]) + "V" + Y(c[1] + 1);
    if (has.has(ck([c[0], c[1] + 1]))) inner += "M" + X(c[0]) + " " + Y(c[1] + 1) + "H" + X(c[0] + 1); else outer += "M" + X(c[0]) + " " + Y(c[1] + 1) + "H" + X(c[0] + 1);
    if (!has.has(ck([c[0] - 1, c[1]]))) outer += "M" + X(c[0]) + " " + Y(c[1]) + "V" + Y(c[1] + 1);
    if (!has.has(ck([c[0], c[1] - 1]))) outer += "M" + X(c[0]) + " " + Y(c[1]) + "H" + X(c[0] + 1);
  });
  if (inner) s += '<path d="' + inner + '" stroke="' + line + '" stroke-width="' + (spec.flat ? 2 : 1.8) + '"' + (spec.flat ? "" : ' stroke-dasharray="5 4" opacity=".75"') + "/>";
  if (outer) s += '<path d="' + outer + '" stroke="' + line + '" stroke-width="3"/>';
  (spec.cands || []).forEach(x => { const c = x.c, ok = inSet(spec.good, c);
    s += '<rect x="' + r1(X(c[0]) + 3) + '" y="' + r1(Y(c[1]) + 3) + '" width="' + (U - 6) + '" height="' + (U - 6) + '" rx="4" fill="' + (ok ? "#A9E2BF" : "#FFFFFF") + '" stroke="#1F5CA0" stroke-width="2.5" stroke-dasharray="5 4"/>' +
      '<text x="' + r1(X(c[0]) + U / 2) + '" y="' + r1(Y(c[1]) + U / 2 + U * 0.19) + '" ' + FONT + ' font-size="' + r1(U * 0.52) + '" text-anchor="middle" fill="#1F5CA0">' + x.t + "</text>"; });
  (spec.labels || []).forEach(x => { const c = x.c, dark = inSet(spec.shade, c) && !inSet(spec.good, c) && !inSet(spec.bad, c);
    s += '<text x="' + r1(X(c[0]) + U / 2) + '" y="' + r1(Y(c[1]) + U / 2 + U * 0.19) + '" ' + FONT + ' font-size="' + r1(U * 0.52) + '" text-anchor="middle" fill="' + (dark ? "#FFFFFF" : INK) + '">' + x.t + "</text>"; });
  return s + "</svg>";
}

/* a cube building on isometric dotty paper
   spec = { cubes, hl: [[x, y, z]] (cubes in blue), arrows: ['top', 'front', 'side'], fit: [w, h] (units, for one scale
            in a row of options), dots: false (no paper), U } */
const C30 = Math.sqrt(3) / 2;
function isoSize(cubes, arrows) {
  const p = painted(cubes), us = [], vs = [];
  p.cubes.forEach(c => { for (let i = 0; i < 8; i++) { const q = P(c[0] + (i & 1), c[1] + ((i >> 1) & 1), c[2] + ((i >> 2) & 1)); us.push(q[0]); vs.push(q[1]); } });
  const b = { u0: Math.min.apply(null, us), u1: Math.max.apply(null, us), v0: Math.min.apply(null, vs), v1: Math.max.apply(null, vs) };
  if (arrows && arrows.length) { if (arrows.indexOf("top") >= 0) b.v0 -= 3; if (arrows.indexOf("front") >= 0 || arrows.indexOf("side") >= 0) b.v1 += 2; if (arrows.indexOf("front") >= 0) b.u0 -= 2; if (arrows.indexOf("side") >= 0) b.u1 += 2; }
  b.w = (b.u1 - b.u0) * C30; b.h = (b.v1 - b.v0) / 2;
  return b;
}
function svgIso(spec) {
  const U = spec.U || 34, p = painted(spec.cubes), b = isoSize(spec.cubes, spec.arrows), pad = 0.85;
  const fw = Math.max(b.w, (spec.fit || [0, 0])[0]), fh = Math.max(b.h, (spec.fit || [0, 0])[1]);
  const W = (fw + 2 * pad) * U, H = (fh + 2 * pad) * U;
  /* the paper's dots stay on the cubes' corners: move by whole dots only */
  let du = Math.round(((fw - b.w) / 2) / C30), dv = Math.round((fh - b.h) / 2 * 2); if ((du + dv) % 2) dv += (dv > 0 ? -1 : 1);
  const X = u => r1((pad + (u - b.u0 + du) * C30) * U), Y = v => r1((pad + (v - b.v0 + dv) / 2) * U);
  const hl = new Set((spec.hl || []).map(k3));
  const n = p.cubes.length;
  let s = svgOpen(W, H, "g4s8-svg--iso", spec.alt || "A shape made of " + n + " cubes, drawn on isometric dotty paper.");
  if (!spec.bare) s += '<rect width="' + r1(W) + '" height="' + r1(H) + '" rx="8" fill="' + PAPER + '"/>';
  if (spec.dots !== false) { let d = "";
    for (let u = b.u0 - du - 2; (pad + (u - b.u0 + du) * C30) * U < W; u++) for (let v = b.v0 - dv - 3; (pad + (v - b.v0 + dv) / 2) * U < H; v++) {
      if ((((u + v) % 2) + 2) % 2) continue; const x = X(u), y = Y(v); if (x < 3 || y < 3 || x > W - 3 || y > H - 3) continue; d += "M" + x + " " + y + "h.01"; }
    s += '<path d="' + d + '" stroke="#8FA6C0" stroke-width="3"/>'; }
  const TONE = { top: "#FFEFC4", left: "#F7C766", right: "#E3A03A" }, BLUE = { top: "#D4E6FB", left: "#8DBAF0", right: "#5A93DB" };
  const lookF = { top: "top", front: "left", side: "right" }[spec.look];        /* the faces you look at from the arrow are blue */
  p.faces.forEach(fc => { const blue = hl.has(k3(fc.c)) || fc.f === lookF, t = blue ? BLUE : TONE;
    s += '<path d="M' + fc.q.map(q => X(q[0]) + " " + Y(q[1])).join("L") + 'Z" fill="' + t[fc.f] + '" stroke="' + (blue ? "#1F3F6E" : "#6B4100") + '" stroke-width="2"/>'; });
  const arrow = (x, y, dx, dy, text, tx, ty) => { const L = 1.15 * U, ex = x + dx * L, ey = y + dy * L, a = Math.atan2(dy, dx), h = 10;
    return '<path d="M' + r1(x) + " " + r1(y) + "L" + r1(ex) + " " + r1(ey) + "M" + r1(ex - h * Math.cos(a - 0.5)) + " " + r1(ey - h * Math.sin(a - 0.5)) + "L" + r1(ex) + " " + r1(ey) + "L" + r1(ex - h * Math.cos(a + 0.5)) + " " + r1(ey - h * Math.sin(a + 0.5)) + '" stroke="#1F5CA0" stroke-width="4"/>' +
      '<text x="' + r1(x + tx) + '" y="' + r1(y + ty) + '" ' + FONT + ' font-size="' + r1(U * 0.5) + '" text-anchor="middle" fill="#1F5CA0">' + text + "</text>"; };
  const ar = spec.arrows || [], cs = p.cubes, mx = k => Math.max.apply(null, cs.map(c => c[k])) + 1;
  if (ar.indexOf("top") >= 0) { const q = P(mx(0) / 2, mx(1) / 2, mx(2)); s += arrow(+X(q[0]), +Y(q[1]) - 1.45 * U, 0, 1, "top", 0, -6); }
  if (ar.indexOf("front") >= 0) { const q = P(mx(0), mx(1) / 2, 0.5); s += arrow(+X(q[0]) - 1.45 * C30 * U, +Y(q[1]) + 0.62 * U, C30, -0.5, "front", -6, 20); }
  if (ar.indexOf("side") >= 0) { const q = P(mx(0) / 2, mx(1), 0.5); s += arrow(+X(q[0]) + 1.45 * C30 * U, +Y(q[1]) + 0.62 * U, -C30, -0.5, "side", 6, 20); }
  return s + "</svg>";
}
S.isoSize = isoSize;

/* a named solid, turned. spec = { s: 'triprism', o: 0 | 1 | 2 (one of its turns) or rot: [x, y, z] degrees, tone } */
const rad = d => d * Math.PI / 180;
const rot = { x: (p, a) => [p[0], p[1] * Math.cos(a) - p[2] * Math.sin(a), p[1] * Math.sin(a) + p[2] * Math.cos(a)],
  y: (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)],
  z: (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]] };
const mixHex = (a, b, t) => "#" + [1, 3, 5].map(i => { const x = parseInt(a.substr(i, 2), 16), y = parseInt(b.substr(i, 2), 16); return ("0" + Math.round(x + (y - x) * t).toString(16)).slice(-2); }).join("");
const TONES = { sand: ["#D98E24", "#FFF0C8", "#6B4100"], blue: ["#3F7FD0", "#DCEBFC", "#1F3F6E"], green: ["#2E9E6B", "#DDF5E7", "#14553A"], red: ["#D9534A", "#FFE1DC", "#7A1F18"] };
function svgSolid(spec) {
  const s0 = solid(spec.s), o = spec.rot || s0.o[(spec.o || 0) % s0.o.length], tone = TONES[spec.tone] || TONES.sand, U = spec.U || 50;
  const turn = p => rot.x(rot.y(rot.z(rot.y(rot.x(p, rad(o[0])), rad(o[1])), rad(o[2])), rad(-28)), rad(22));
  const v = s0.verts.map(turn), W = 3.2 * U, H = 3.15 * U;
  const xs = v.map(p => p[0]), ys = v.map(p => p[1]), cx = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2, cy = (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2;
  const X = p => r1(W / 2 + (p[0] - cx) * U), Y = p => r1(H / 2 - (p[1] - cy) * U);
  const cen = [0, 1, 2].map(i => v.reduce((a, p) => a + p[i], 0) / v.length), L = [-0.42, 0.72, 0.55];
  const fs = s0.faces.map(f => { const pts = f.v.map(i => v[i]); let n = [0, 0, 0];
    pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; n[0] += (p[1] - q[1]) * (p[2] + q[2]); n[1] += (p[2] - q[2]) * (p[0] + q[0]); n[2] += (p[0] - q[0]) * (p[1] + q[1]); });
    const len = Math.hypot(n[0], n[1], n[2]) || 1; n = n.map(x => x / len);
    const fc = [0, 1, 2].map(i => pts.reduce((a, p) => a + p[i], 0) / pts.length);
    if (n[0] * (fc[0] - cen[0]) + n[1] * (fc[1] - cen[1]) + n[2] * (fc[2] - cen[2]) < 0) n = n.map(x => -x);
    return { pts: pts, n: n, front: n[2] > 1e-6, kind: f.kind }; });
  let s = svgOpen(W, H, "g4s8-svg--solid", spec.alt || "A 3D shape.");
  if (!spec.bare) s += '<rect width="' + r1(W) + '" height="' + r1(H) + '" rx="8" fill="' + PAPER + '"/>';
  const mk = spec.mark || {}, HOT = "#2F7FD4";
  const hotFace = mk.face === "auto" ? fs.indexOf(fs.filter(f => f.front).sort((a, b) => b.n[2] - a.n[2])[0]) : mk.face;
  fs.forEach((f, k) => { if (k === hotFace && f.front) { s += '<path d="M' + f.pts.map(p => X(p) + " " + Y(p)).join("L") + 'Z" fill="#7FB4EE"/>'; return; } if (!f.front) return; const t = Math.max(0, Math.min(1, 0.18 + 0.82 * Math.max(0, f.n[0] * L[0] + f.n[1] * L[1] + f.n[2] * L[2]))), fill = mixHex(tone[0], tone[1], t);
    s += '<path d="M' + f.pts.map(p => X(p) + " " + Y(p)).join("L") + 'Z" fill="' + fill + '" stroke="' + fill + '" stroke-width="' + (s0.round && f.kind === "side" ? 1 : 0.4) + '"/>'; });
  let hid = "", vis = "";
  s0.edgeList.forEach(e => { const a = fs[e.f[0]], b = fs[e.f[1]], d = "M" + X(v[e.a]) + " " + Y(v[e.a]) + "L" + X(v[e.b]) + " " + Y(v[e.b]);
    const smooth = s0.round && a.kind === "side" && b.kind === "side";
    if (smooth) { if (a.front !== b.front) vis += d; return; }
    if (a.front || b.front) vis += d; else hid += d; });
  if (hid) s += '<path d="' + hid + '" stroke="' + tone[2] + '" stroke-width="1.8" stroke-dasharray="' + (s0.round ? "4 4" : "5 5") + '" opacity=".55"/>';
  s += '<path d="' + vis + '" stroke="' + tone[2] + '" stroke-width="2.6"/>';
  if (mk.edge != null) { const vs = s0.edgeList.filter(e => fs[e.f[0]].front && fs[e.f[1]].front), len = e => Math.hypot(v[e.a][0] - v[e.b][0], v[e.a][1] - v[e.b][1]);
    (mk.edge === "all" ? s0.edgeList.filter(e => !(s0.round && fs[e.f[0]].kind === "side" && fs[e.f[1]].kind === "side")) : [mk.edge === "auto" ? vs.sort((a, b) => len(b) - len(a))[0] : s0.edgeList[mk.edge]]).forEach(e => {
      const seenE = fs[e.f[0]].front || fs[e.f[1]].front;
      s += '<path d="M' + X(v[e.a]) + " " + Y(v[e.a]) + "L" + X(v[e.b]) + " " + Y(v[e.b]) + '" stroke="' + HOT + '" stroke-width="' + (mk.edge === "all" ? 4 : 7) + '"' + (seenE ? "" : ' opacity=".45"') + "/>"; }); }
  if (mk.vertex != null) { const order = v.map((p, i) => i).sort((a, b) => v[b][2] - v[a][2]);
    (mk.vertex === "all" ? order : [mk.vertex === "auto" ? order[0] : mk.vertex]).forEach(i => { const seenV = s0.faces.some((f, k) => f.v.indexOf(i) >= 0 && fs[k].front);
      s += '<circle cx="' + X(v[i]) + '" cy="' + Y(v[i]) + '" r="' + (mk.vertex === "all" ? 6 : 9) + '" fill="' + HOT + '" stroke="#FFFFFF" stroke-width="2"' + (seenV ? "" : ' opacity=".5"') + "/>"; }); }
  return s + "</svg>";
}
Object.assign(S, { svgNet: svgNet, svgIso: svgIso, svgSolid: svgSolid });

/* ================= the question models ================= */
const boxOf = list => [Math.max.apply(null, list.map(cs => Math.max.apply(null, cs.map(c => c[0])) - Math.min.apply(null, cs.map(c => c[0])) + 1)),
  Math.max.apply(null, list.map(cs => Math.max.apply(null, cs.map(c => c[1])) - Math.min.apply(null, cs.map(c => c[1])) + 1))];
const one = (list, what) => (list.length === 1 ? list[0] : fail(what + ": needs exactly one right answer, the data has " + list.length));
const NETTIP = "Fold the squares up in your head. Every square must land on a different face.";
function tickTask(d, opts, more) {
  const good = opts.findIndex(o => o.ok);
  return Object.assign({
    sub: "Tick (✓) one box.", letters: true, opts: opts,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || d.tip || "Look again at each one." }; },
    key: LET[good]
  }, more);
}

/* which shape is (not) a net of a cube / of an open cube?   { shapes: [rows × 4], want: 'net' | 'not', open } */
M.s8isnet = function (d) {
  const open = !!d.open, want = d.want || "net", shapes = d.shapes.map(sq), box = boxOf(shapes), thing = open ? "an open cube" : "a cube";
  const oks = shapes.map(cs => fits(cs, open)), right = one(oks.map((ok, i) => i).filter(i => (want === "net") === oks[i]), "s8isnet");
  const opts = shapes.map((cs, i) => { const w = whyNot(cs, open);
    return { html: "", fig: { k: "s8net", cells: cs, box: box }, ok: i === right, alt: "Shape " + LET[i],
      why: i === right ? "" : want === "net" ? "Shape " + LET[i] + " does not work. " + w.t : "Shape " + LET[i] + " does fold into " + thing + ". Every square lands on a different face." }; });
  const w = whyNot(shapes[right], open), tip = d.tip || NETTIP + (open ? " An open cube has 5 faces: the top is missing." : " A cube has 6 faces.");
  const text = shapes.map((cs, i) => LET[i] + ": " + (oks[i] ? "it folds into " + thing + "." : "no. " + whyNot(cs, open).t)).join(" ");
  return tickTask(d, opts, {
    q: d.q || (want === "net" ? "Which shape is a net of " + thing + "?" : "Which shape is <b>not</b> a net of " + thing + "?"),
    hint: { pic: d.pic || null, step: tip },
    worked: { text: text, pic: { k: "s8net", cells: shapes[right], good: want === "net" ? shapes[right] : [], bad: w.bad } },
    yes: want === "net" ? "Shape " + LET[right] + " folds into " + thing + "." : "Shape " + LET[right] + " is not a net. " + w.t
  });
};

/* a net with one square missing: where can the last square go?
   { rows: ['.A..', '###B', ...] (# = a square, A to D = the places to choose from), open, pics: true (the options are pictures) } */
M.s8where = function (d) {
  const p = parse(d.rows), open = !!d.open, cells = p.marks["#"] || [], names = Object.keys(p.marks).filter(k => /[A-E]/.test(k)).sort();
  const cands = names.map(t => ({ c: p.marks[t][0], t: t })), full = cands.map(x => cells.concat([x.c]));
  const oks = full.map(cs => fits(cs, open)), right = one(oks.map((ok, i) => i).filter(i => oks[i]), "s8where"), thing = open ? "an open cube" : "a cube";
  const box = boxOf([cells.concat(cands.map(x => x.c))]);
  const opts = cands.map((x, i) => ({ html: d.pics ? "" : x.t, fig: d.pics ? { k: "s8net", cells: full[i], shade: [x.c], box: box } : null, ok: i === right,
    why: i === right ? "" : "With the square at " + x.t + ": " + whyNot(full[i], open).t.replace(/^T/, "t").replace(/^F/, "f") }));
  const nth = open ? "fifth" : "sixth";
  return tickTask(d, opts, {
    letters: !!d.pics,
    q: d.q || (d.pics ? "The net of " + thing + " has one square missing. Which picture shows a correct place for the blue square?"
      : "One more square makes this shape a net of " + thing + ". Where can the " + nth + " square go?"),
    fig: d.pics ? { k: "s8net", cells: cells, box: box } : { k: "s8net", cells: cells, cands: cands },
    hint: { pic: null, step: d.tip || NETTIP },
    worked: { text: "The square goes at " + cands[right].t + ". Then all " + (open ? 5 : 6) + " squares fold onto different faces. " + cands.filter((x, i) => i !== right).map((x, i) => "At " + x.t + ": " + whyNot(cells.concat([x.c]), open).t.replace(/^T/, "t").replace(/^F/, "f")).join(" "),
      pic: { k: "s8net", cells: full[right], good: [cands[right].c] } },
    yes: "With the square at " + cands[right].t + ", the shape folds into " + thing + ".",
    key: cands[right].t
  });
};

/* tap the grid to add the last square (any place that works is right)   { rows: 5 squares (or 4 for an open cube), open } */
M.s8place = function (d) {
  const cells = sq(d.rows), open = !!d.open, good = completions(cells).filter(c => fits(cells.concat([c]), open)), near = around(cells);
  if (!good.length) fail("s8place: no square completes this shape");
  const thing = open ? "an open cube" : "a cube", isIn = (list, c) => list.some(x => x[0] === c[0] && x[1] === c[1]);
  return {
    q: d.q || "Finish the net of " + thing + ". Add <b>one</b> more square.",
    sub: "Tap an empty square on the grid. Tap another to change it.",
    ui: { k: "s8tap", cells: cells }, right: { cell: good[0], all: good },
    doLine: { en: "Tap a square to add it. Then tap *Check*.", vi: "Chạm vào một ô để thêm ô vuông. Rồi bấm *Check* (Kiểm tra)." },
    ready: r => !!r.cell,
    check(r) {
      const c = r.cell; if (!c) return { ok: false, msg: "Tap an empty square first." };
      if (isIn(good, c)) return { ok: true };
      if (!isIn(near, c)) return { ok: false, msg: "The new square must share a whole edge with the net." };
      return { ok: false, msg: whyNot(cells.concat([c]), open).t };
    },
    given: r => (r.cell ? r.cell.join(",") : ""),
    hint: { pic: null, step: d.tip || NETTIP },
    worked: { text: (good.length === 1 ? "Only 1 place works." : good.length + " places work.") + " One is green. Now all " + (open ? 5 : 6) + " squares fold onto different faces." },
    yes: "Now all " + (open ? 5 : 6) + " squares fold onto different faces.",
    key: good.map(c => "(" + c + ")").join(" or ")
  };
};

/* opposite faces.  { rows: ['.A..', 'B*CD', '.E..'] }  * = the shaded square, letters = tick one (4 or 5 options);
   with digits ('.1..', '2345', '.6..') and of: 3 the child types the number opposite 3;
   open: true with digits and ask: 'base': a box with no lid, which square is the bottom? */
M.s8opp = function (d) {
  const p = parse(d.rows), cells = p.cells, f = fold(cells), open = !!d.open;
  if (!f.ok || cells.length !== (open ? 5 : 6)) fail("s8opp: the shape is not a net");
  const labels = Object.keys(p.marks).filter(k => k !== "#" && k !== "*").map(t => ({ c: p.marks[t][0], t: t })).sort((a, b) => (a.t < b.t ? -1 : 1));
  const idx = c => cells.findIndex(x => x[0] === c[0] && x[1] === c[1]), touch = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
  const inLine = (a, b) => (a[0] === b[0] && Math.abs(a[1] - b[1]) === 2 && idx([a[0], (a[1] + b[1]) / 2]) >= 0) || (a[1] === b[1] && Math.abs(a[0] - b[0]) === 2 && idx([(a[0] + b[0]) / 2, a[1]]) >= 0);
  const TIP = "In a straight row, skip one square: the next square but one is opposite. Squares that touch are never opposite.";
  if (open) {                                  /* the face that is missing is the top: its opposite is the bottom */
    const miss = [0, 1, 2, 3, 4, 5].find(x => f.faces.indexOf(x) < 0), base = cells[f.faces.indexOf(miss ^ 1)], lab = labels.find(x => x.c[0] === base[0] && x.c[1] === base[1]) || fail("s8opp: the bottom has no label");
    const walls = labels.filter(x => x !== lab), n = cells.filter(c => touch(c, base)).length;
    return {
      q: d.q || "This net folds to make a box with no lid. Which square is the <b>bottom</b> of the box?",
      fig: { k: "s8net", cells: cells, labels: labels }, lines: ["square {0}"], blanks: [{ len: 1, w: "box" }],
      check(r) { const v = String((r.v || [])[0] || ""); if (v === lab.t) return { ok: true, parts: [true] };
        return { ok: false, parts: [false], msg: walls.some(x => x.t === v) ? "Square " + v + " folds up to be a wall. The bottom is opposite the open top." : "Type the number of one square in the net." }; },
      hint: { pic: null, step: d.tip || "The 4 walls fold up around the bottom. Which square do the walls stand around?" },
      worked: { text: "Square " + lab.t + " is the bottom. " + (n >= 3 ? n + " squares join it and fold up as walls." : "The other 4 squares fold up around it as walls.") + " No square lands opposite it: that is the open top.", pic: { k: "s8net", cells: cells, labels: labels, good: [base] } },
      yes: "Square " + lab.t + " is the bottom of the box.", key: lab.t, fill: [lab.t]
    };
  }
  const from = d.of != null ? (labels.find(x => x.t === String(d.of)) || fail("s8opp: no square " + d.of)).c : (p.marks["*"] || fail("s8opp: no shaded square"))[0];
  const opp = cells[opposite(cells, idx(from))], lab = labels.find(x => x.c[0] === opp[0] && x.c[1] === opp[1]) || fail("s8opp: the opposite square has no label");
  const fromName = d.of != null ? "square " + d.of : "the shaded square", how = inLine(from, opp)
    ? "Count along the straight row from " + fromName + ": skip one square. The next one is " + lab.t + "."
    : "Fold the net in your head. The squares that touch " + fromName + " fold up around it. " + lab.t + " closes the cube on the far side.";
  const why = x => (touch(x.c, from) ? x.t + " touches " + fromName + " in the net. Squares that touch are never opposite." : "When the net folds, " + x.t + " meets " + fromName + " along an edge. Opposite faces never meet.");
  const fig = { k: "s8net", cells: cells, labels: labels, shade: d.of != null ? [] : [from] };
  const workedPic = { k: "s8net", cells: cells, labels: labels, shade: [from], good: [opp] };
  if (/^\d$/.test(lab.t)) {
    return {
      q: d.q || "This net folds to make a number cube. Which number is opposite <b>" + d.of + "</b>?", fig: fig,
      lines: ["{0}"], blanks: [{ len: 1, w: "box" }],
      check(r) { const v = String((r.v || [])[0] || ""); if (v === lab.t) return { ok: true, parts: [true] };
        const x = labels.find(y => y.t === v); return { ok: false, parts: [false], msg: v === String(d.of) ? "That is the square itself. Find the face on the other side of the cube." : x ? why(x) : d.tip || TIP }; },
      hint: { pic: null, step: d.tip || TIP }, worked: { text: how + " So " + lab.t + " is opposite " + d.of + ".", pic: workedPic },
      yes: lab.t + " is opposite " + d.of + ".", key: lab.t, fill: [lab.t]
    };
  }
  const opts = labels.map(x => ({ html: x.t, fig: null, ok: x === lab, why: x === lab ? "" : why(x) }));
  return tickTask(d, opts, {
    letters: false, q: d.q || "This net folds to make a cube. Which face is <b>opposite</b> the shaded face?", fig: fig,
    hint: { pic: null, step: d.tip || TIP }, worked: { text: how + " So " + lab.t + " is opposite the shaded face.", pic: workedPic },
    yes: lab.t + " is opposite the shaded face.", key: lab.t
  });
};

/* how many cubes?  { cubes }  Every cube must show a whole face: the answer never depends on a cube the child cannot see. */
M.s8cubes = function (d) {
  const cs = norm3(d.cubes), n = cs.length, sn = seen(cs);
  if (sn.some(s => s.see !== "full")) fail("s8cubes: a cube is hidden or only half shows");
  if (cs.some(c => c[2] > 0 && !cs.some(b => b[0] === c[0] && b[1] === c[1] && b[2] === c[2] - 1))) fail("s8cubes: a cube floats");
  const hidden = sn.filter(s => s.see === "none").length, zs = Array.from(new Set(cs.map(c => c[2]))).sort(), per = zs.map(z => cs.filter(c => c[2] === z).length);
  const lay = per.map((k, i) => (i === 0 ? "Bottom" : i === per.length - 1 ? "Top" : "Next") + " layer: " + k + (k === 1 ? " cube" : " cubes")).join(". ");
  const X0 = Math.max.apply(null, cs.map(c => c[1])) + 1, Y0 = Math.max.apply(null, cs.map(c => c[0])) + 1;
  const tip = d.tip || "Count one layer at a time. Start with the bottom layer." + (hidden ? " A cube you cannot see holds up the cube above it." : "");
  return {
    q: d.q || "This shape is made of cubes. Each cube stands on the table or on another cube. How many cubes are there?",
    fig: { k: "s8iso", cubes: cs }, lines: ["{0} cubes"], blanks: [{ len: 2, w: "big" }],
    check(r) { const v = +(r.v || [])[0];
      if ((r.v || [])[0] !== "" && v === n) return { ok: true, parts: [true] };
      return { ok: false, parts: [false], msg: hidden && v === n - hidden ? "You counted the cubes you can see. " + (hidden === 1 ? "One more cube is" : hidden + " more cubes are") + " hidden under a top cube." : v === per[0] && per.length > 1 ? "That is the bottom layer. Count the cubes on top too." : tip }; },
    hint: { pic: per.length > 1 ? { k: "s8row", list: zs.map((z, i) => ({ k: "s8view", cells: cs.filter(c => c[2] === z).map(c => [c[1], c[0]]), cap: "layer " + (i + 1), box: [X0, Y0], org: [0, 0] })) } : null, step: tip },
    worked: { text: lay + ". " + (per.length > 1 ? per.join(" + ") + " = " + n + " cubes." : "There are " + n + " cubes.") + (hidden ? " " + (hidden === 1 ? "One cube is" : hidden + " cubes are") + " hidden: " + (hidden === 1 ? "it holds" : "they hold") + " up a cube on top." : "") },
    yes: "There are " + n + " cubes.", key: String(n), fill: [String(n)]
  };
};

/* the same shape, turned round.  { cubes, turn: 'zx', others: [cubes, cubes, cubes], at } */
M.s8same = function (d) {
  const base = norm3(d.cubes), n = base.length, right = spin(base, d.turn || "z");
  if (!same(base, right)) fail("s8same: the turn changed the shape");
  if (str3(base) === str3(right)) fail("s8same: the turned picture looks the same as the first");
  const all = [right].concat(d.others.map(norm3));
  d.others.forEach((o, i) => { if (same(base, o)) fail("s8same: other " + i + " is the same shape"); });
  [base].concat(all).forEach((c, i) => { if (!allSeen(c)) fail("s8same: picture " + i + " hides a cube"); if (!grounded(c)) fail("s8same: picture " + i + " has a cube in the air"); });
  const sizes = all.map(c => isoSize(c)), fit = [Math.max.apply(null, sizes.map(b => b.w)), Math.max.apply(null, sizes.map(b => b.h))];
  const L = longLine(base), why = o => (o.length !== n ? "This shape has " + o.length + " cubes, not " + n + "."
    : longLine(o) !== L ? "The longest row here has " + longLine(o) + " cubes. In the first shape it has " + L + "."
    : same(mirror(base), o) ? "This is the mirror image. You cannot turn the first shape to get it."
    : "One cube is in a different place here. Look where it joins the long row.");
  const opts = arrange(all.map((c, i) => ({ html: "", fig: { k: "s8iso", cubes: c, fit: fit }, ok: i === 0, why: i === 0 ? "" : why(c) })), d.at);
  const tip = d.tip || "Count the cubes in the longest row. Then look where the other cubes join it.";
  return tickTask(d, opts, {
    q: d.q || "This shape is made of <b>" + n + "</b> cubes. Which picture shows the <b>same</b> shape, turned round?",
    fig: { k: "s8iso", cubes: base },
    hint: { pic: null, step: tip },
    worked: { text: "Picture " + LET[opts.findIndex(o => o.ok)] + " is the same shape. It has " + n + " cubes and its longest row has " + L + ", just like the first shape. The other cubes join in the same places.", pic: [{ k: "s8iso", cubes: base }, { k: "s8iso", cubes: right }] },
    yes: "Picture " + LET[opts.findIndex(o => o.ok)] + " is the same shape, turned round."
  });
};

/* which view?  { cubes, view: 'top' | 'front' | 'side', wrong: ['front', 'side', { cubes, view }, { cells }], at } */
M.s8view = function (d) {
  const cs = norm3(d.cubes), vw = views(cs), want = d.view;
  if (!allSeen(cs)) fail("s8view: the picture hides a cube");
  if (!grounded(cs)) fail("s8view: a cube is in the air");
  const cellsOf = w => (typeof w === "string" ? vw[w] : w.rows ? sq(w.rows) : w.cells ? sortCells(w.cells) : views(w.cubes)[w.view || want]);
  const list = [vw[want]].concat(d.wrong.map(cellsOf)), keys = list.map(c => shift(c).map(ck).join(";"));
  if (new Set(keys).size !== keys.length) fail("s8view: two options are the same picture (" + keys.join(" | ") + ")");
  if (list.slice(1).some(c => canon(c) === canon(list[0]))) fail("s8view: a wrong option is the right view, turned or flipped");
  const box = boxOf(list), n = vw[want].length;
  const LOOK = "Look along the arrow, at the blue faces.";
  const why = (w, cells) => (typeof w === "string" ? (w === "top" ? "That is the view from the top. " : "That is what you see from a different side. ") + LOOK
    : cells.length !== n ? "Along the arrow you see " + n + " squares. This picture has " + cells.length + "." : "The squares are in the wrong places. " + LOOK);
  const opts = arrange(list.map((cells, i) => ({ html: "", fig: { k: "s8view", cells: cells, box: box }, ok: i === 0, why: i === 0 ? "" : why(d.wrong[i - 1], cells) })), d.at);
  const cols = []; vw[want].forEach(c => { cols[c[0]] = (cols[c[0]] || 0) + 1; });
  const how = want === "top" ? "Look down along the arrow. Each stack of cubes looks like one square. You see " + n + " squares."
    : "Look along the arrow, at the blue faces. You see how tall the shape is. From left to right the heights are " + cols.join(", ") + ".";
  return tickTask(d, opts, {
    q: d.q || (want === "top" ? "Look down on the shape from the <b>top</b>, along the arrow. The top faces are blue. Which picture shows what you see?"
      : "Look at the shape from the <b>" + want + "</b>, along the arrow. The faces you look at are blue. Which picture shows what you see?"),
    fig: { k: "s8iso", cubes: cs, arrows: [want], look: want },
    hint: { pic: null, step: d.tip || (want === "top" ? "Look down along the arrow. You cannot see how tall a stack is: each stack looks like one square." : "Look along the arrow, at the blue faces. Look at how tall each part is. Cubes behind each other look like one square.") },
    worked: { text: how + " That is picture " + LET[opts.findIndex(o => o.ok)] + ".", pic: { k: "s8view", cells: vw[want] } },
    yes: "Picture " + LET[opts.findIndex(o => o.ok)] + " is the view from the " + want + ", along the arrow."
  });
};

/* faces, edges, vertices of a solid (counted from the mesh).  { s: 'triprism', o: 1, ask: 'faces' | 'edges' | 'vertices' | 'all' } */
M.s8count = function (d) {
  const s = solid(d.s); if (s.round) fail("s8count: use a shape with flat faces");
  const all = { faces: s.F, edges: s.E, vertices: s.V }, asks = d.ask === "all" ? ["faces", "edges", "vertices"] : [d.ask], ans = asks.map(a => all[a]);
  const say = { faces: "A face is a flat surface.", edges: "An edge is a line where two faces meet.", vertices: "A vertex is a corner, where edges meet." };
  const tip = d.tip || (asks.length === 1 ? say[asks[0]] + " Some are at the back: the dashed lines show them." : "Count the faces, then the edges, then the vertices. The dashed lines show the back of the shape.");
  return {
    q: d.q || "Here is " + s.a + " <b>" + s.name + "</b>. " + (asks.length === 1 ? "How many <b>" + asks[0] + "</b> does it have?" : "How many faces, edges and vertices does it have?"),
    fig: { k: "s8solid", s: d.s, o: d.o || 0 }, marks: asks.length,
    lines: asks.map((a, i) => (asks.length === 1 ? "{0} " + a : a + ": {" + i + "}")), blanks: asks.map(() => ({ len: 2, w: "big" })),
    check(r) {
      const parts = ans.map((a, i) => (r.v || [])[i] !== "" && (r.v || [])[i] != null && +r.v[i] === a);
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      const i = parts.indexOf(false), v = +r.v[i], other = Object.keys(all).find(k => k !== asks[i] && all[k] === v);
      return { ok: false, parts: parts, msg: (asks.length > 1 ? "Look at the " + asks[i] + ". " : "") + (other ? v + " is the number of " + other + ". " + say[asks[i]] : say[asks[i]] + " Count the ones at the back too.") };
    },
    hint: { pic: { k: "s8solid", s: d.s, o: (d.o || 0) + 1 }, step: tip },
    worked: { text: asks.map(a => countWords(s, a)).join(" ").replace(/^(\d)/, "$1") },
    yes: MX.cap(s.a) + " " + s.name + " has " + asks.map((a, i) => ans[i] + " " + a).join(", ").replace(/, ([^,]*)$/, " and $1") + ".",
    key: ans.join(" ; "), fill: ans.map(String)
  };
};

/* named solids.  ask: 'same'  { s, o, o2, others: [[name, o], ...] }   the same solid, turned round (picture options)
                  ask: 'name'  { s, o, others: [names] }               tick its name
                  ask: 'props' { s, others: [[name, o], ...] }         "5 faces, 9 edges, 6 vertices": tick the picture
                  ask: 'face'  { shape: 'triangle', want: 'no', list: [[name, o] × 4] }   which shape has no triangle face? */
M.s8solid = function (d) {
  const pair = x => (Array.isArray(x) ? x : [x, 0]), tip0 = "Look at the shapes of the faces. Count the faces if you need to.";
  if (d.ask === "name") {
    const s = solid(d.s), names = [d.s].concat(d.others); if (new Set(names).size !== names.length) fail("s8solid: a name is there twice");
    const opts = arrange(names.map((nm, i) => { const o = solid(nm);
      return { html: MX.cap(o.name), ok: i === 0, why: i === 0 ? "" : trait(o) + " Look at the faces of this shape again." }; }), d.at);
    return tickTask(d, opts, { letters: false, q: d.q || "What is the name of this 3D shape?", fig: { k: "s8solid", s: d.s, o: d.o || 0 },
      hint: { pic: { k: "s8solid", s: d.s, o: (d.o || 0) + 1 }, step: d.tip || (s.fam === "prism" ? "A prism has two ends that are the same shape. Look at the shape of the ends." : s.fam === "pyramid" ? "A pyramid has one base. Its other faces are triangles that meet at a point." : "Look for a curved surface and for flat circle faces.") },
      worked: { text: "It is " + s.a + " " + s.name + ". " + trait(s) },
      yes: "It is " + s.a + " " + s.name + ".", key: MX.cap(s.name) });
  }
  if (d.ask === "face") {
    const list = d.list.map(pair), has = list.map(x => { const s = solid(x[0]); return d.shape === "triangle" ? !s.round && s.tri > 0 : d.shape === "circle" ? !!s.round : d.shape === "curved" ? !!s.round : fail("s8solid: shape " + d.shape); });
    const want = d.want !== "no", right = one(list.map((x, i) => i).filter(i => has[i] === want), "s8solid face"), what = d.shape === "curved" ? "a curved surface" : "a " + d.shape + " face";
    const opts = list.map((x, i) => { const s = solid(x[0]); return { html: "", fig: { k: "s8solid", s: x[0], o: x[1] }, ok: i === right, alt: "Shape " + LET[i],
      why: i === right ? "" : "Shape " + LET[i] + " is " + s.a + " " + s.name + ". It " + (has[i] ? "has " : "does not have ") + what + "." }; });
    const rs = solid(list[right][0]);
    return tickTask(d, opts, { q: d.q || "Which 3D shape has " + (want ? "" : "<b>no</b> ") + what.replace(/^a /, want ? "a " : "") + "?",
      hint: { pic: null, step: d.tip || "Look at every face of each shape. The dashed lines show the faces at the back." },
      worked: { text: "Shape " + LET[right] + " is " + rs.a + " " + rs.name + ". It " + (want ? "has " : "has no ") + what.replace(/^a /, want ? "a " : "") + "." },
      yes: "Shape " + LET[right] + ", the " + rs.name + "." });
  }
  const s = solid(d.s), list = [[d.s, d.o2 == null ? 1 : d.o2]].concat(d.others.map(pair));
  if (new Set(list.map(x => x[0])).size !== list.length) fail("s8solid: a shape is there twice");
  const propsEq = o => o.F === s.F && o.E === s.E && o.V === s.V;
  if (d.ask === "props" && (s.round || list.slice(1).some(x => propsEq(solid(x[0]))))) fail("s8solid: the numbers fit two shapes");
  const opts = arrange(list.map((x, i) => { const o = solid(x[0]);
    return { html: "", fig: { k: "s8solid", s: x[0], o: x[1] }, ok: i === 0, alt: "A 3D shape",
      why: i === 0 ? "" : "This is " + o.a + " " + o.name + ". " + (d.ask === "props" && !o.round ? "It has " + o.F + " faces, " + o.E + " edges and " + o.V + " vertices." : trait(o)) }; }), d.at);
  const letter = LET[opts.findIndex(o => o.ok)];
  if (d.ask === "props") {
    return tickTask(d, opts, { q: d.q || "A 3D shape has <b>" + s.F + "</b> faces, <b>" + s.E + "</b> edges and <b>" + s.V + "</b> vertices. Which shape is it?",
      hint: { pic: null, step: d.tip || "Count the faces of each shape first. The dashed lines show the back." },
      worked: { text: "Shape " + letter + " is " + s.a + " " + s.name + ". " + MX.cap(countWords(s, "faces")) + " " + MX.cap(countWords(s, "edges")) + " " + MX.cap(countWords(s, "vertices")) },
      yes: "Shape " + letter + ", the " + s.name + ", has " + s.F + " faces, " + s.E + " edges and " + s.V + " vertices." });
  }
  return tickTask(d, opts, { q: d.q || "Here is " + s.a + " <b>" + s.name + "</b>. Which picture shows the <b>same</b> shape, turned round?", fig: { k: "s8solid", s: d.s, o: d.o || 0 },
    hint: { pic: null, step: d.tip || tip0 },
    worked: { text: "Picture " + letter + " is " + s.a + " " + s.name + " too. " + trait(s) + " Turning a shape does not change its faces." },
    yes: "Picture " + letter + " is the same shape, turned round." });
};

/* ================= claims: the statement is checked in code, then the data of a `claim` question is made =================
   kind 'onlyone'  { who, nets: [rows A, rows B, rows C], at }   "There is only one net of a cube" (A is the child's net)
        'row4'     { who, nets: [A, B, C] }   "Every net of a cube has 4 squares in a straight row."
        'any6'     { who, nets: [A, B, C] }   "Every shape made of 6 squares joined edge to edge is a net of a cube."
        'row5'     { who, nets: [A, B, C] }   "A net of a cube never has 5 squares in a straight row."   (true: all 11 nets are checked)
        'touch'    { who, rows }              "Squares that touch in a net are never opposite faces of the cube."   (true)
        'tri'      { who, list: [[solid, o] × 3] }   "Every 3D shape with a triangle face is a pyramid." */
S.claim = function (d) {
  const out = (ok, says, reasons, fig, step, worked, model) => ({ type: "claim", who: d.who, ok: ok, at: d.at || 0, says: says, fig: fig, reasons: reasons,
    hint: { step: step }, worked: worked, model: d.who + " is " + (ok ? "correct" : "incorrect") + " because " + model });
  if (d.kind === "tri") {
    const list = d.list.map(x => ({ s: solid(x[0]), o: x[1] })), cex = list.findIndex(x => !x.s.round && x.s.tri > 0 && x.s.fam !== "pyramid"), pyr = list.findIndex(x => x.s.fam === "pyramid"), no = list.findIndex(x => x.s.round || !x.s.tri);
    if (cex < 0 || pyr < 0 || no < 0) fail("claim tri: needs a prism with triangles, a pyramid and a shape with no triangle");
    const c = list[cex].s, p = list[pyr].s, z = list[no].s;
    return out(false, "Every 3D shape with a triangle face is a pyramid.", [
      { t: "shape " + LET[cex] + " has " + c.tri + " triangle faces, but it is a prism." },
      { t: "shape " + LET[pyr] + " has triangle faces and it is a pyramid.", why: "That is one shape that fits. Check the others. One example cannot prove 'every'." },
      { t: "shape " + LET[no] + " is not a pyramid.", why: "Shape " + LET[no] + " has no triangle face, so it does not test what " + d.who + " says." }],
      { k: "s8row", list: list.map((x, i) => ({ k: "s8solid", s: x.s.id, o: x.o, cap: LET[i] })) },
      "Look for a shape with a triangle face that is NOT a pyramid.",
      "Shape " + LET[cex] + " is " + c.a + " " + c.name + ". It has " + c.tri + " triangle faces and " + c.quad + " rectangle faces. Its triangles do not meet at one point, so it is not a pyramid.",
      "shape " + LET[cex] + ", " + c.a + " " + c.name + ", has triangle faces but it is a prism.");
  }
  if (d.kind === "touch") {
    const cells = sq(d.rows), p = parse(d.rows), f = fold(cells); if (!isNet(cells)) fail("claim touch: not a net");
    census().allNets.forEach(net => { const g = fold(net); net.forEach((a, i) => net.forEach((b, j) => { if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1 && g.faces[i] === (g.faces[j] ^ 1)) fail("claim touch is false"); })); });
    const labels = Object.keys(p.marks).filter(k => /[A-F]/.test(k)).sort().map(t => ({ c: p.marks[t][0], t: t }));
    const A = labels[0], oppA = labels.find(x => f.faces[cells.findIndex(c => c[0] === x.c[0] && c[1] === x.c[1])] === (f.faces[cells.findIndex(c => c[0] === A.c[0] && c[1] === A.c[1])] ^ 1));
    if (Math.abs(A.c[0] - oppA.c[0]) + Math.abs(A.c[1] - oppA.c[1]) === 1) fail("claim touch: data");
    return out(true, "Two squares that touch in a net are never opposite faces of the cube.", [
      { t: "squares that touch share an edge, so they fold into faces that meet along that edge." },
      { t: "a cube has 6 faces and a net has 6 squares.", why: "That is true, but it does not say which faces are opposite." },
      { t: A.t + " and " + oppA.t + " are opposite, and they touch.", why: A.t + " and " + oppA.t + " are opposite, but they do not touch in the net. Look again." }],
      { k: "s8net", cells: cells, labels: labels },
      "Find two squares that touch. They stay joined along one edge when you fold. Can opposite faces share an edge?",
      "Squares that touch stay joined along a fold line. So they become faces that meet at an edge. Opposite faces never meet. Here " + A.t + " is opposite " + oppA.t + ", and they do not touch.",
      "squares that touch share an edge, and opposite faces of a cube never share an edge.");
  }
  const nets = d.nets.map(sq), ok = nets.map(isNet), fig = { k: "s8row", list: nets.map((c, i) => ({ k: "s8net", cells: c, cap: LET[i], box: boxOf(nets), U: 30 })) };
  const pick = (test, what) => { const i = nets.findIndex(test); return i < 0 ? fail("claim " + d.kind + ": no " + what) : i; };
  if (d.kind === "onlyone") {
    if (!ok[0]) fail("claim onlyone: A must be a net");
    const b = pick((c, i) => i > 0 && ok[i] && canon(c) !== canon(nets[0]), "second net"), c = pick((x, i) => !ok[i], "shape that is not a net");
    return out(false, "There is only one net of a cube. It is shape A.", [
      { t: "shape " + LET[b] + " is a different net, and it folds into a cube too." },
      { t: "shape " + LET[c] + " is a different net, and it folds into a cube too.", why: "Shape " + LET[c] + " does not fold into a cube. " + whyNot(nets[c]).t },
      { t: "a cube has 6 faces, so only one shape of 6 squares can make it.", why: "Many shapes have 6 squares. Fold shape " + LET[b] + " in your head." }], fig,
      "Shape A is a net. Is another shape here a net of a cube too?",
      "Shape A folds into a cube. Shape " + LET[b] + " is a different shape and it folds into a cube too. So there is more than one net. (There are 11 different nets of a cube.)",
      "shape " + LET[b] + " is a different net of a cube.");
  }
  if (d.kind === "row4") {
    const cex = pick((c, i) => ok[i] && longRow(c) < 4, "net without a row of 4"), yes = pick((c, i) => ok[i] && longRow(c) === 4, "net with a row of 4"), no = pick((c, i) => !ok[i], "shape that is not a net");
    return out(false, "Every net of a cube has 4 squares in a straight row.", [
      { t: "shape " + LET[cex] + " is a net of a cube, and its longest row has only " + longRow(nets[cex]) + " squares." },
      { t: "shape " + LET[yes] + " is a net of a cube with 4 squares in a row.", why: "That is one net that fits. One example cannot prove 'every'. Check shape " + LET[cex] + "." },
      { t: "shape " + LET[no] + " has no row of 4 squares.", why: "Shape " + LET[no] + " is not a net of a cube. " + whyNot(nets[no]).t }], fig,
      "Look for a net of a cube with no row of 4 squares.",
      "Shape " + LET[cex] + " folds into a cube. Its longest straight row has " + longRow(nets[cex]) + " squares, not 4. One net that does not fit is enough.",
      "shape " + LET[cex] + " is a net of a cube with no row of 4 squares.");
  }
  if (d.kind === "any6") {
    if (nets.some(c => c.length !== 6 || !fold(c).connected)) fail("claim any6: every shape needs 6 joined squares");
    const cex = pick((c, i) => !ok[i], "shape that is not a net"), yes = pick((c, i) => ok[i], "net");
    return out(false, "Every shape made of 6 squares joined edge to edge is a net of a cube.", [
      { t: "shape " + LET[cex] + " has 6 joined squares, but it does not fold into a cube." },
      { t: "shape " + LET[yes] + " has 6 squares and it folds into a cube.", why: "That is one shape that works. One example cannot prove 'every'. Check shape " + LET[cex] + "." },
      { t: "a cube has 6 faces and each shape has 6 squares.", why: "6 squares are needed, but they must also fold onto 6 different faces. Fold shape " + LET[cex] + "." }], fig,
      "Fold each shape in your head. Does every one close up into a cube?",
      "Shape " + LET[cex] + " has 6 squares joined edge to edge. " + whyNot(nets[cex]).t + " So not every shape of 6 squares is a net.",
      "shape " + LET[cex] + " has 6 joined squares but does not fold into a cube.");
  }
  if (d.kind === "row5") {
    census().allNets.forEach(c => { if (longRow(c) > 4) fail("claim row5 is false"); });           /* all 11 nets: no row of 5 */
    const five = pick((c, i) => !ok[i] && longRow(c) >= 5, "shape with a row of 5"), yes = pick((c, i) => ok[i], "net");
    return out(true, "A net of a cube never has 5 squares in a straight row.", [
      { t: "4 squares in a row fold all the way round the cube, so a fifth square lands on top of the first." },
      { t: "a cube has 6 faces, so 5 squares are too few.", why: "Each shape here has 6 squares. The problem is where the fifth square in the row lands." },
      { t: "shape " + LET[yes] + " is a net and has a row of 5 squares.", why: "Count again: the longest row of shape " + LET[yes] + " has " + longRow(nets[yes]) + " squares." }], fig,
      "Fold a straight row round a cube. How many squares go all the way round?",
      "A row of 4 squares wraps all the way round a cube. A fifth square in the same row folds onto the first one. Shape " + LET[five] + " shows this: " + whyNot(nets[five]).t.replace(/^T/, "t"),
      "a row of 4 squares already goes all the way round the cube.");
  }
  return fail("claim kind " + d.kind);
};
})();
