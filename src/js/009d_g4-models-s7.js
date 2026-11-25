/* g4-models-s7.js - Stop 7, Triangles and symmetry: the geometry is WORKED OUT here, never typed in by hand.

   MX.s7 (the geometry, also used by the pictures in 047g_g4-pics-s7.js):
     reflect(cells, line)        the cells [col,row] reflected in line = { k: 'v' | 'h', at }   (at = the grid line: 'v' at 4
                                 is the line between columns 3 and 4)
     symAbout(cells, line)       is the cell set its own reflection in that line?
     symLines(cells)             ALL lines of symmetry of the shape: a list of 'v', 'h', 'd1' (\), 'd2' (/)
     tri(spec)                   a triangle from spec = { pts: [[x,y] x 3] } (square dot grid), { g: 'iso', pts } (isometric dot
                                 grid: point [i,j] is at x = i + j/2, y = j x 0.866), { sides: [a,b,c] } or { angs: [A,B,C] }
                                 -> { type: 'equilateral' | 'isosceles' | 'scalene', lines: 3 | 1 | 0, right, P, eq, ang }
                                 (squared side lengths are compared: whole numbers on both dot grids)
     An equilateral triangle cannot have all its corners on a square dot grid, so equilateral triangles come from
     marked sides, marked angles or the isometric dot grid.

   Models (all tick-a-picture or typed; the right option is found in code and every wrong option is proved wrong):
     s7tri      which triangle is isosceles / scalene / equilateral?   { want, tris: [spec x 3 or 4], show: { ticks, lens, deg, arcs } }
     s7name     what type is this triangle?   { tri: spec, show, text: 'Sides 5 cm, 5 cm, 8 cm' (no picture) }
     s7why      what makes it that type?      { tri: spec, show, at, label: 'A' }
     s7lines    typed: how many lines of symmetry?   { tri: spec | name: 'equilateral' | cells, w, h }
     s7pick     which shape has exactly `want` lines of symmetry (or: in which picture is the dashed line a line of
                symmetry, with a line per shape)?   { w, h, shapes: [cells | { cells, line }], want }
     s7shade    shade `n` more squares so the shape has exactly `want` lines of symmetry: which picture?   { w, h, cells, adds: [[cell, cell] x 4], want }
     s7reflect  which picture shows the reflection (or the finished pattern)?   { w, h, cells, line | lines: [v, h], wrong: ['far', 'slide', 'turn', 'near', 'cell', 'half', 'half2'], at, pattern, who }
     s7mistake  a child's wrong reflection: tick what went wrong   { who, he, w, h, cells, line, err: 'far' | 'slide' | 'near', far: 2, at }
   claim with s7fact: [{ tri, type, lines, right }, { cells, lines }]   the facts a claim's reasons use are checked before the claim is made. */
(function () {
"use strict";
const M = MX.M, LET = MX.LET;

/* ---------- cells ---------- */
const key = c => c[0] + "," + c[1];
const norm = cells => cells.map(c => [c[0], c[1]]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
const sig = cells => norm(cells).map(key).join(" ");
const same = (a, b) => sig(a) === sig(b);
const uniq = cells => { const s = {}; return cells.filter(c => (s[key(c)] ? false : (s[key(c)] = 1))); };
const shift = (cells, dx, dy) => cells.map(c => [c[0] + dx, c[1] + dy]);
function box(cells) {
  const xs = cells.map(c => c[0]), ys = cells.map(c => c[1]);
  return { x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs), y0: Math.min.apply(null, ys), y1: Math.max.apply(null, ys) };
}
function reflect(cells, line) {
  return cells.map(c => (line.k === "v" ? [2 * line.at - 1 - c[0], c[1]] : [c[0], 2 * line.at - 1 - c[1]]));
}
const symAbout = (cells, line) => same(cells, reflect(cells, line));
/* the four flips of a shape about the middle of its own box */
function flip(cells, k) {
  const b = box(cells), w = b.x1 - b.x0, h = b.y1 - b.y0;
  if (k === "v") return cells.map(c => [b.x0 + b.x1 - c[0], c[1]]);
  if (k === "h") return cells.map(c => [c[0], b.y0 + b.y1 - c[1]]);
  if (w !== h) return null;                                   /* a diagonal line needs a square box */
  if (k === "d1") return cells.map(c => [b.x0 + (c[1] - b.y0), b.y0 + (c[0] - b.x0)]);
  return cells.map(c => [b.x1 - (c[1] - b.y0), b.y1 - (c[0] - b.x0)]);
}
function symLines(cells) {
  return ["v", "h", "d1", "d2"].filter(k => { const f = flip(cells, k); return !!f && same(cells, f); });
}
const inGrid = (cells, w, h) => cells.every(c => c[0] >= 0 && c[1] >= 0 && c[0] < w && c[1] < h);
/* how many squares between the shape and the line (0 = it touches the line), and which side (-1 before, 1 after, 0 across) */
function gap(cells, line) {
  const i = line.k === "v" ? 0 : 1, vs = cells.map(c => c[i]);
  const lo = Math.min.apply(null, vs), hi = Math.max.apply(null, vs);
  if (hi < line.at) return { side: -1, gap: line.at - 1 - hi };
  if (lo >= line.at) return { side: 1, gap: lo - line.at };
  return { side: 0, gap: 0 };
}
const along = (line, n) => (line.k === "v" ? [n, 0] : [0, n]);
/* what is this attempt at a reflection? 'ok', 'far' / 'near' (flipped, but k squares out of place), 'slide' (a copy, not flipped), 'turn', '?' */
function diagnose(cells, line, att) {
  const R = reflect(cells, line), g = gap(R, line);
  if (same(att, R)) return { k: "ok", n: 0 };
  const i = line.k === "v" ? 0 : 1, bR = box(R), bA = box(att), d = (i ? bA.y0 - bR.y0 : bA.x0 - bR.x0);
  const flipped = d !== 0 && same(att, shift(R, along(line, d)[0], along(line, d)[1]));
  const bC = box(cells), slid = same(att, shift(cells, bA.x0 - bC.x0, bA.y0 - bC.y0));
  if (flipped && slid) return { k: "?", n: 0 };                 /* the shape is symmetrical: nobody could tell */
  if (flipped) return { k: d * g.side > 0 ? "far" : "near", n: Math.abs(d) };
  if (slid) return { k: "slide", n: 0 };
  if (same(att, flip(R, line.k === "v" ? "h" : "v"))) return { k: "turn", n: 0 };
  return { k: "?", n: 0 };
}
/* a wrong reflection of a given kind, made from the data */
function wrongOne(cells, line, kind, n) {
  const R = reflect(cells, line), g = gap(R, line), s = g.side || 1;
  if (kind === "far") { const d = along(line, s * (n || 1)); return shift(R, d[0], d[1]); }
  if (kind === "near") { const d = along(line, -s * (n || 1)); return shift(R, d[0], d[1]); }
  if (kind === "slide") { const a = box(cells), b = box(R); return shift(cells, b.x0 - a.x0, b.y0 - a.y0); }
  if (kind === "turn") return flip(R, line.k === "v" ? "h" : "v");
  if (kind === "cell") {                                        /* one square of the reflection is in the wrong place */
    const list = norm(R), has = {}; list.forEach(c => { has[key(c)] = 1; });
    const far = list.slice().sort((p, q) => (line.k === "v" ? (q[0] - p[0]) * s || p[1] - q[1] : (q[1] - p[1]) * s || p[0] - q[0]))[0];
    const tries = line.k === "v" ? [[0, 1], [0, -1], [s, 0]] : [[1, 0], [-1, 0], [0, s]];
    for (let t = 0; t < tries.length; t++) {
      const to = [far[0] + tries[t][0], far[1] + tries[t][1]];
      if (!has[key(to)] && to[0] >= 0 && to[1] >= 0 && gap([to], line).side === s) return list.filter(c => c !== far).concat([to]);
    }
    return null;
  }
  return null;
}

/* ---------- triangles ---------- */
const TYPES = ["equilateral", "isosceles", "scalene"];
const AN = { equilateral: "an equilateral", isosceles: "an isosceles", scalene: "a scalene" };
const PROP = {
  equilateral: "It has 3 equal sides and 3 equal angles.",
  isosceles: "It has 2 equal sides and 2 equal angles.",
  scalene: "It has no equal sides and no equal angles."
};
const close = (a, b) => Math.abs(a - b) < 1e-9;
function tri(spec) {
  let P, s2, exact = true;
  if (spec.pts) {
    if (spec.pts.length !== 3) throw new Error("a triangle needs 3 points");
    const iso = spec.g === "iso";
    s2 = [0, 1, 2].map(i => { const a = spec.pts[i], b = spec.pts[(i + 1) % 3], dx = b[0] - a[0], dy = b[1] - a[1]; return iso ? dx * dx + dx * dy + dy * dy : dx * dx + dy * dy; });
    P = spec.pts.map(p => (iso ? [p[0] + p[1] / 2, p[1] * Math.sqrt(3) / 2] : [p[0], p[1]]));
    const a = spec.pts;
    if ((a[1][0] - a[0][0]) * (a[2][1] - a[0][1]) === (a[2][0] - a[0][0]) * (a[1][1] - a[0][1])) throw new Error("the 3 points are in a line");
  } else {
    let s = spec.sides;
    if (spec.angs) {
      if (spec.angs.reduce((x, y) => x + y, 0) !== 180 || spec.angs.some(x => x <= 0)) throw new Error("the angles of a triangle add to 180");
      /* side i joins corner i and corner i + 1, so it is opposite corner i + 2 */
      s = [0, 1, 2].map(i => Math.sin(spec.angs[(i + 2) % 3] * Math.PI / 180)); exact = false;
    }
    if (!s || s.length !== 3 || s.some(x => x <= 0)) throw new Error("a triangle needs 3 sides");
    const big = Math.max.apply(null, s);
    if (big * 2 >= s[0] + s[1] + s[2] - 1e-9) throw new Error("these sides do not make a triangle: " + s);
    s2 = s.map(x => x * x);
    const x = (s[0] * s[0] + s[2] * s[2] - s[1] * s[1]) / (2 * s[0]);
    P = [[0, 0], [s[0], 0], [x, -Math.sqrt(Math.max(0, s[2] * s[2] - x * x))]];
  }
  const e = (i, j) => (exact && !spec.sides ? s2[i] === s2[j] : close(s2[i], s2[j]));
  /* eq[i]: the two sides that meet at corner i (side i and side i + 2) are equal -> a line of symmetry goes through corner i */
  const eq = [0, 1, 2].map(i => e(i, (i + 2) % 3));
  const lines = eq.filter(Boolean).length;
  const type = lines === 3 ? "equilateral" : lines === 1 ? "isosceles" : "scalene";
  if (lines === 2) throw new Error("impossible triangle");
  const ang = [0, 1, 2].map(i => {
    const a = P[i], b = P[(i + 1) % 3], c = P[(i + 2) % 3], ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - a[0], vy = c[1] - a[1];
    return Math.acos((ux * vx + uy * vy) / Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy))) * 180 / Math.PI;
  });
  const srt = s2.slice().sort((x, y) => x - y);
  const right = spec.angs ? spec.angs.indexOf(90) >= 0 : close(srt[0] + srt[1], srt[2]);
  /* which sides are equal to another side (for the tick marks), which corners have an angle equal to another */
  const eqSide = [0, 1, 2].map(i => e(i, (i + 1) % 3) || e(i, (i + 2) % 3));
  const eqAng = [0, 1, 2].map(i => lines === 3 || (lines === 1 && !eq[i]));
  return { type: type, lines: lines, right: right, P: P, eq: eq, eqSide: eqSide, eqAng: eqAng, ang: ang, s2: s2 };
}
const NAMED = { equilateral: { sides: [6, 6, 6] }, isosceles: { sides: [7, 7, 4] }, scalene: { sides: [4, 6, 7] } };
const LINES_WORD = n => (n === 0 ? "no lines of symmetry" : n === 1 ? "1 line of symmetry" : n + " lines of symmetry");
const whyNot = (t, want) => "This triangle is " + t.type + ", not " + want + ". " + PROP[t.type];

MX.s7 = { reflect: reflect, symAbout: symAbout, symLines: symLines, flip: flip, tri: tri, box: box, gap: gap, same: same, shift: shift,
  diagnose: diagnose, wrongOne: wrongOne, norm: norm, uniq: uniq, PROP: PROP, TYPES: TYPES };

/* ---------- pictures as data ---------- */
const triPic = (spec, show, more) => Object.assign({ k: "s7tri" }, spec, show || {}, more || {});
const gridPic = (d, more) => Object.assign({ k: "s7grid", w: d.w, h: d.h }, more || {});
const tickTask = (d, o) => {
  const opts = o.opts, good = opts.findIndex(x => x.ok);
  return {
    q: o.q, sub: d.sub || o.sub || "Tick (✓) one box.", letters: !!o.letters, fig: o.fig || null, opts: opts,
    check(r) { const p = opts[r.pick]; return p && p.ok ? { ok: true } : { ok: false, msg: (p && p.why) || o.tip }; },
    hint: { pic: d.pic || o.pic || null, step: d.tip || o.tip },
    worked: { text: d.worked || o.worked, pic: o.wpic || null },
    yes: d.yes || o.yes || o.worked, key: (o.letters ? LET[good] + (opts[good].html ? ": " : "") : "") + (opts[good].html || "")
  };
};
const one = (opts, w) => { const n = opts.filter(o => o.ok).length; if (n !== 1) throw new Error(w + ": exactly one option must be right, but " + n + " are"); };
const typed = (d, o) => {
  const ans = o.ans;
  return {
    q: o.q, sub: d.sub || "", lines: o.lines, blanks: [{ len: 2, w: "big" }], fig: o.fig || null,
    check(r) {
      const v = (r.v || [])[0];
      if (v !== "" && v != null && Number(v) === ans) return { ok: true, parts: [true] };
      const s = (o.slips || []).find(x => Number(v) === x[0]);
      return { ok: false, msg: s ? s[1] : o.tip, parts: [false] };
    },
    hint: { pic: d.pic || o.pic || null, step: d.tip || o.tip },
    worked: { text: d.worked || o.worked, pic: o.wpic || null },
    yes: o.worked, key: String(ans), fill: [String(ans)]
  };
};

/* ---------- triangles: the models ---------- */
M.s7tri = function (d) {
  const want = d.want, infos = d.tris.map(tri);
  const opts = d.tris.map((s, i) => ({ html: "", alt: "Triangle " + LET[i], fig: triPic(s, d.show), ok: infos[i].type === want, why: infos[i].type === want ? "" : whyNot(infos[i], want) }));
  one(opts, "s7tri");
  const g = opts.findIndex(o => o.ok);
  const what = d.show && d.show.deg ? "angles" : "sides";      /* angle pictures show no side lengths: talk about the angles */
  const how = want === "isosceles" ? "Look for exactly 2 equal " + what + "." : want === "equilateral" ? "Look for 3 equal " + what + "." : "Look for 3 different " + what + ".";
  const marks = d.show && d.show.ticks ? " The small marks show equal sides." : d.show && d.show.deg ? " Equal angles mean equal sides." : "";
  return tickTask(d, {
    q: d.q || "Which triangle is <b>" + want + "</b>?", letters: true, opts: opts,
    tip: how + marks, pic: { k: "s7card" },
    worked: "Triangle " + LET[g] + " is " + want + ". " + PROP[want], wpic: triPic(d.tris[g], d.show, { sym: true })
  });
};

M.s7name = function (d) {
  const t = tri(d.tri);
  const opts = TYPES.map(n => ({ html: n, ok: n === t.type, why: n === t.type ? "" : "Not " + n + ". " + AN[n].replace(/^a/, "A") + " triangle has " + PROP[n].replace("It has ", "") }));
  one(opts, "s7name");
  const eqs = t.lines === 3 ? "All 3 sides are equal" : t.lines === 1 ? "2 sides are equal" : "No sides are equal";
  const eqa = t.lines === 3 ? "All 3 angles are equal" : t.lines === 1 ? "2 angles are equal" : "No angles are equal";
  return tickTask(d, {
    q: d.q || (d.text ? d.text + "<br>What type of triangle is it?" : "What type of triangle is this?"), fig: d.text && !d.fig ? null : triPic(d.tri, d.show),
    opts: opts, tip: d.tri.angs ? "Count the equal angles: 3, 2 or none." : "Count the equal sides: 3, 2 or none.", pic: { k: "s7card" },
    worked: (d.tri.angs ? eqa : eqs) + ". So the triangle is " + t.type + "."
  });
};

M.s7why = function (d) {
  const t = tri(d.tri), lab = d.label ? "Triangle " + d.label : "This triangle";
  const others = TYPES.filter(n => n !== t.type);
  const opts = MX.arrange([
    { html: PROP[t.type], ok: true, why: "" },
    { html: PROP[others[0]], ok: false, why: "That describes " + AN[others[0]] + " triangle. Count the equal sides here." },
    { html: PROP[others[1]], ok: false, why: "That describes " + AN[others[1]] + " triangle. Count the equal sides here." }
  ], d.at);
  return tickTask(d, {
    q: lab + " is <b>" + t.type + "</b>. What makes it " + t.type + "?", fig: triPic(d.tri, d.show, d.label ? { label: d.label } : null), opts: opts,
    tip: "Count the equal sides. Then count the equal angles.", pic: { k: "s7card" },
    worked: lab + " is " + t.type + ". " + PROP[t.type], wpic: triPic(d.tri, d.show, { sym: true, ticks: true })
  });
};

M.s7lines = function (d) {
  if (d.cells) {
    const ls = symLines(d.cells), n = ls.length;
    const nm = { v: "a vertical line", h: "a horizontal line", d1: "a diagonal line", d2: "a diagonal line" };
    return typed(d, {
      q: d.q || "How many lines of symmetry does this shape have?", lines: ["Lines of symmetry: {0}"], ans: n,
      fig: gridPic(d, { cells: d.cells }),
      tip: "Try to fold the shape: down the middle, across the middle and corner to corner. Do the two halves match?",
      slips: [[n + 1, "One of your lines does not work. Fold on it: the halves must match exactly."], [n - 1, "There is one more. Try a fold across, a fold down and a fold corner to corner."]].filter(s => s[0] >= 0),
      worked: n ? "The shape has " + LINES_WORD(n) + ": " + ls.map(k => nm[k]).join(", ").replace(/, ([^,]*)$/, " and $1") + "." : "The shape has no lines of symmetry. No fold makes two matching halves.",
      wpic: gridPic(d, { cells: d.cells, sym: true })
    });
  }
  const spec = d.tri || NAMED[d.name], t = tri(spec);
  if (d.name && t.type !== d.name) throw new Error("s7lines: the example triangle is not " + d.name);
  const what = d.name ? AN[d.name].replace(/^a/, "A") + " triangle" : "This triangle";
  return typed(d, {
    q: d.q || (d.name ? "How many lines of symmetry does <b>" + AN[d.name] + "</b> triangle have?" : "How many lines of symmetry does this triangle have?"),
    lines: ["Lines of symmetry: {0}"], ans: t.lines,
    fig: d.name && !d.fig ? null : triPic(spec, d.show || { ticks: true }),
    tip: "A line of symmetry goes through a corner where two equal sides meet. Count those corners.", pic: { k: "s7card", sym: true },
    slips: [[3, "Only an equilateral triangle has 3. This one is " + t.type + "."], [1, "Only an isosceles triangle has 1. This one is " + t.type + "."], [0, "Only a scalene triangle has 0. This one is " + t.type + "."], [2, "No triangle has exactly 2 lines of symmetry. This one is " + t.type + "."]].filter(s => s[0] !== t.lines),
    worked: (d.name ? what + " has " + PROP[t.type].replace("It has ", "") : what + " is " + t.type + ": " + PROP[t.type].replace("It has ", "")) + " It has " + LINES_WORD(t.lines) + ".",
    wpic: triPic(spec, { ticks: true, sym: true })
  });
};

/* ---------- symmetry on a square grid ---------- */
M.s7pick = function (d) {
  const byLine = d.shapes.some(s => s.line);
  const opts = d.shapes.map((s, i) => {
    const cells = s.cells || s;
    if (!inGrid(cells, d.w, d.h)) throw new Error("s7pick: shape " + i + " is off the grid");
    if (byLine) {
      const ok = symAbout(cells, s.line);
      return { html: "", alt: "Picture " + LET[i], fig: gridPic(d, { cells: cells, line: s.line }), ok: ok, why: ok ? "" : "Fold on the dashed line. The two halves do not match." };
    }
    const n = symLines(cells).length;
    return { html: "", alt: "Shape " + LET[i], fig: gridPic(d, { cells: cells }), ok: n === d.want, why: n === d.want ? "" : "This shape has " + LINES_WORD(n) + "." };
  });
  one(opts, "s7pick");
  const g = opts.findIndex(o => o.ok), cells = d.shapes[g].cells || d.shapes[g];
  return tickTask(d, {
    q: d.q || (byLine ? "In which picture is the dashed line a <b>line of symmetry</b>?" : "Which shape has <b>exactly " + d.want + "</b> line" + (d.want === 1 ? "" : "s") + " of symmetry?"),
    letters: true, opts: opts,
    tip: byLine ? "Fold on the dashed line in your head. Every square needs a partner on the other side." : "Try each fold: down, across and corner to corner. Count the folds that work.",
    worked: byLine ? "In picture " + LET[g] + " every square has a partner the same distance from the dashed line." : "Shape " + LET[g] + " has " + LINES_WORD(d.want) + ".",
    wpic: byLine ? gridPic(d, { cells: cells, line: d.shapes[g].line }) : gridPic(d, { cells: cells, sym: true })
  });
};

M.s7shade = function (d) {
  const want = d.want == null ? 1 : d.want, base = d.cells, has = {}; base.forEach(c => { has[key(c)] = 1; });
  const n0 = symLines(base).length, k = d.adds[0].length;
  const opts = d.adds.map((add, i) => {
    if (add.length !== k || add.some(c => has[key(c)]) || uniq(add).length !== k || !inGrid(add, d.w, d.h)) throw new Error("s7shade: bad new squares in option " + i);
    const n = symLines(base.concat(add)).length;
    return { html: "", alt: "Picture " + LET[i], fig: gridPic(d, { cells: base, cells2: add, c2: "new" }), ok: n === want,
      why: n === want ? "" : n === 0 ? "This shape has no line of symmetry. Fold it in your head: the halves do not match." : "This shape has " + LINES_WORD(n) + ". The question says exactly " + want + "." };
  });
  one(opts, "s7shade");
  const g = opts.findIndex(o => o.ok), full = base.concat(d.adds[g]), nm = { v: "vertical", h: "horizontal", d1: "diagonal", d2: "diagonal" };
  const num = ["no", "one", "two", "three", "four"];
  return tickTask(d, {
    q: (d.who ? d.who + " shades <b>" + num[k] + "</b> more squares" : "Shade <b>" + num[k] + "</b> more squares") + " so the shape has <b>exactly " + num[want] + "</b> line" + (want === 1 ? "" : "s") + " of symmetry. Which picture is right?",
    sub: "The new squares are orange. Tick (✓) one box.", letters: true, fig: gridPic(d, { cells: base }), opts: opts,
    tip: "Look at each picture as one whole shape. Count the folds that make matching halves.",
    worked: "Picture " + LET[g] + " has exactly " + num[want] + " line" + (want === 1 ? "" : "s") + " of symmetry: a " + symLines(full).map(x => nm[x]).join(" and a ") + " line." + (n0 ? "" : " Every square has a partner across the line."),
    wpic: gridPic(d, { cells: base, cells2: d.adds[g], c2: "new", sym: true })
  });
};

/* the four quarters of a pattern made with two mirror lines; each wrong pattern slides where it should flip */
function quads(d, kind) {
  const V = d.lines.find(l => l.k === "v"), H = d.lines.find(l => l.k === "h"), c = d.cells;
  const sV = x => wrongOne(x, V, "slide"), sH = x => wrongOne(x, H, "slide"), rV = x => reflect(x, V), rH = x => reflect(x, H);
  if (kind === "right") return rV(c).concat(rH(c), rH(rV(c)));
  if (kind === "slide") return sV(c).concat(sH(c), sH(sV(c)));
  if (kind === "half") return rV(c).concat(sH(c), sH(rV(c)));       /* flipped across, but slid down */
  if (kind === "half2") return sV(c).concat(rH(c), rH(sV(c)));      /* slid across, but flipped down */
  if (kind === "turn") return rV(c).concat(rH(c), sH(sV(c)));       /* the last quarter is a plain copy */
  return null;
}
const WHY = {
  far: "This shape is too far from the mirror line. It must be the same distance away as the first shape.",
  near: "This shape is too near the mirror line. It must be the same distance away as the first shape.",
  slide: "This shape slid across. It did not flip over. A reflection faces the other way.",
  turn: "This shape was turned round, not flipped. Check each square against its partner.",
  cell: "One square is in the wrong place. Check every square against its partner.",
  half: "Look at the bottom half. It slid down. It did not flip in the horizontal mirror line.",
  half2: "Look at the right half. It slid across. It did not flip in the vertical mirror line."
};
M.s7reflect = function (d) {
  const two = !!d.lines, line = d.line, w = d.w, h = d.h, cells = d.cells;
  if (!inGrid(cells, w, h)) throw new Error("s7reflect: the shape is off the grid");
  const lines = two ? d.lines : [line];
  if (lines.some(l => gap(cells, l).side === 0)) throw new Error("s7reflect: the shape crosses a mirror line");
  const R = two ? quads(d, "right") : reflect(cells, line);
  const kinds = d.wrong || (two ? ["slide", "half", "half2"] : ["far", "slide", "turn"]);
  const sets = [{ k: "right", cells: R }].concat(kinds.map(k => ({ k: k, cells: two ? quads(d, k) : wrongOne(cells, line, k, d.far) })));
  sets.forEach((s, i) => {
    if (!s.cells || !inGrid(s.cells, w, h)) throw new Error("s7reflect: option '" + s.k + "' does not fit on the grid");
    if (uniq(s.cells.concat(cells)).length !== s.cells.length + cells.length) throw new Error("s7reflect: option '" + s.k + "' overlaps");
    if (i > 0 && same(s.cells, R)) throw new Error("s7reflect: the wrong option '" + s.k + "' is the same as the right one");
    if (!two && i > 0) { const dg = diagnose(cells, line, s.cells).k; if (dg === "ok" || (dg !== s.k && s.k !== "cell")) throw new Error("s7reflect: option '" + s.k + "' looks like '" + dg + "'"); }
    for (let j = 0; j < i; j++) if (same(sets[j].cells, s.cells)) throw new Error("s7reflect: two options are the same (" + sets[j].k + ", " + s.k + ")");
  });
  /* the right picture must really be symmetrical about every mirror line, the wrong ones must not be */
  sets.forEach((s, i) => { const all = cells.concat(s.cells), ok = lines.every(l => symAbout(all, l)); if (ok !== (i === 0)) throw new Error("s7reflect: symmetry check fails for '" + s.k + "'"); });
  const pat = !!d.pattern || two;
  const opts = MX.arrange(sets.map((s, i) => ({ html: "", alt: "Picture " + LET[i], fig: gridPic(d, { cells: cells, cells2: s.cells, c2: pat ? "same" : "refl", line: two ? null : line, lines: two ? lines : null }), ok: i === 0, why: i ? WHY[s.k] : "", kind: s.k })), d.at);
  opts.forEach((o, i) => { o.alt = "Picture " + LET[i]; });
  const g = opts.findIndex(o => o.ok), dir = two ? "" : line.k === "v" ? "vertical" : "horizontal", gp = two ? 0 : gap(cells, line).gap;
  const q = d.q || (two ? "The pattern is reflected in <b>both</b> mirror lines. Which picture shows the finished pattern?"
    : pat ? "Complete the pattern so the dashed line is a <b>line of symmetry</b>. Which picture is right?"
      : "Which picture shows the blue shape <b>reflected</b> in the " + dir + " mirror line?");
  return tickTask(d, {
    q: q, sub: pat ? "Tick (✓) one box." : "The reflection is orange. Tick (✓) one box.", letters: true,
    fig: gridPic(d, { cells: cells, line: two ? null : line, lines: two ? lines : null, lab: true }), opts: opts,
    tip: two ? "Flip the pattern across the vertical line. Then flip both parts across the horizontal line." : "Take one square at a time. Count how far it is from the mirror line. Its partner is the same distance on the other side.",
    worked: "Picture " + LET[g] + " is right. " + (two ? "Each quarter is a flip of the quarter next to it." : "Every square and its partner are the same distance from the mirror line" + (gp ? ": the shape is " + gp + " square" + (gp === 1 ? "" : "s") + " away on both sides." : ".")),
    wpic: gridPic(d, { cells: cells, cells2: R, c2: pat ? "same" : "refl", line: two ? null : line, lines: two ? lines : null, lab: true })
  });
};

M.s7mistake = function (d) {
  const line = d.line, cells = d.cells, att = wrongOne(cells, line, d.err, d.far), R = reflect(cells, line);
  if (!att || !inGrid(att, d.w, d.h) || !inGrid(R, d.w, d.h) || !inGrid(cells, d.w, d.h)) throw new Error("s7mistake: does not fit on the grid");
  if (gap(cells, line).side === 0 || gap(att, line).side !== -gap(cells, line).side) throw new Error("s7mistake: the attempt must be on the other side of the line");
  const dg = diagnose(cells, line, att);
  if (dg.k !== d.err) throw new Error("s7mistake: the attempt looks like '" + dg.k + "', not '" + d.err + "'");
  if (symAbout(cells.concat(att), line)) throw new Error("s7mistake: the attempt is right");
  const g0 = gap(cells, line).gap, g1 = gap(att, line).gap, sq = n => n + " square" + (n === 1 ? "" : "s");
  const he = d.he ? "He" : "She", his = d.he ? "His" : "Her", dir = line.k === "v" ? "vertical" : "horizontal";
  const T = {
    far: { t: his + " shape is too far from the mirror line.", why: "Count the squares to the mirror line on both sides. They are the same. Now look which way the shape faces." },
    near: { t: his + " shape is too near the mirror line.", why: "Count the squares to the mirror line on both sides. They are the same. Now look which way the shape faces." },
    slide: { t: he + " slid the shape across. " + he + " did not flip it.", why: "The shape did flip: it faces the other way. Now count the squares to the mirror line." },
    size: { t: his + " shape has the wrong number of squares.", why: "Count them: both shapes have " + cells.length + " squares. Look at where the new shape is." },
    side: { t: his + " shape is on the wrong side of the mirror line.", why: "A reflection is on the other side of the mirror line. That part is right." }
  };
  const other = d.err === "slide" ? (g0 === g1 ? "far" : "side") : "slide";
  const opts = MX.arrange([d.err, other, "size"].map((k, i) => ({ html: T[k].t, ok: i === 0, why: i ? T[k].why : "" })), d.at);
  const worked = d.err === "slide" ? "The orange shape is a copy that slid across. A reflection is flipped: it faces the other way."
    : g0 === 0 ? "The blue shape touches the mirror line. The orange shape is " + sq(g1) + " away. A reflection is the same distance away, so it touches the mirror line too."
      : "The blue shape is " + sq(g0) + " from the mirror line. The orange shape is " + sq(g1) + " away. A reflection is the same distance away: " + sq(g0) + ".";
  return tickTask(d, {
    q: d.who + " reflects the blue shape in the " + dir + " mirror line. " + his + " answer is orange. It is <b>not correct</b>. What is the mistake?",
    fig: gridPic(d, { cells: cells, cells2: att, c2: "bad", line: line, lab: true }), opts: opts,
    tip: "Check two things. Is the new shape the same distance from the mirror line? Is it flipped?",
    worked: worked, wpic: gridPic(d, { cells: cells, cells2: R, c2: "refl", line: line, lab: true })
  });
};

/* a claim whose reasons use facts about shapes: the facts are checked here before the claim is made */
const baseClaim = M.claim;
M.claim = function (d, mode) {
  (d.s7fact || []).forEach((f, i) => {
    const bad = m => { throw new Error("claim: s7fact " + i + " is not true: " + m); };
    if (f.tri) {
      const t = tri(f.tri);
      if (f.type && t.type !== f.type) bad("the triangle is " + t.type);
      if (f.lines != null && t.lines !== f.lines) bad("the triangle has " + t.lines + " lines");
      if (f.right != null && t.right !== f.right) bad("right angle is " + t.right);
    } else if (f.cells) {
      if (f.lines != null && symLines(f.cells).length !== f.lines) bad("the shape has " + symLines(f.cells).length + " lines");
      if (f.line && f.sameGap) { const R = reflect(f.cells, f.line); if (gap(R, f.line).gap !== gap(f.cells, f.line).gap || !symAbout(f.cells.concat(R), f.line)) bad("the gaps differ"); }
    }
  });
  return baseClaim(d, mode);
};
})();
