/* g4-models-s3.js - the question models of Stop 3 (add and subtract decimals and negatives; two unknowns).
   Every answer is WORKED OUT here from the numbers in the data. Decimals are never floats: a value is a whole
   number of units (tenths, hundredths or thousandths: 10^dp units make 1), so 0.1 + 0.2 is exactly 0.3.

   MX.s3   helpers shared with the pictures (047g_g4-pics-s3.js): dp, toU, fU, round, colwork, slips, calc, sh, claim

   s3col      a written addition or subtraction of two decimals with the same number of places
              { a: '14.75', b: '8.60', op: '+' | '-', fig: true (the column layout on squared paper), text, unit }
   s3est      estimate by rounding to the nearest whole number, then the exact answer
              { a, b, op, exact: false (only the estimate), text, unit }
   s3story    a measure story in two steps { text, start: '12.50', steps: [['-', '3.75'], ['+', '2.50']], unit: 'kg', fig: true }
   s3int      whole-number calculations, also below zero, each worked from left to right
              { items: [[4, '-', 9], [-5, '+', 8], [345, '+', 278, '-', 196]], fig: true (a number line for the first one) }
   s3temp     a temperature story across zero { kind: 'diff' | 'end' | 'start', from, to, change, end, text, fig: 'line' | 'thermo', caps }
   s3tbig     which of two changes of temperature is bigger { a: { name, from, to }, b: { name, from, to }, text, same: true }
   s3unk      two unknowns shown as shapes (T ▲, C ●, S ■, D ◆)
              { kind: 'sumdiff', sum, diff, sh: ['T', 'C'] }          ▲ + ● = sum and ▲ − ● = diff
              { kind: 'given', eq: ['T', '+', 'C', 15], give: ['C', 5] }   if ● is 5, what is ▲?
              { kind: 'table', eq: ['T', '+', 'C', 7], given: [0, 3, 5] }  the pairs: ▲ is given, write ●
              { kind: 'pick', eqs: [[...], [...]], pairs: [[8, 4], [4, 8], [6, 6]], at }   tick the pair that fits (the model checks: only the first fits)
   s3mistake  a child's written calculation with one mistake: tick what went wrong
              { who, he, a, b, op, slip: 'left' | 'noregroup' | 'swap' | 'nopay' | 'op', at }
   s3align    tick the correct way to write a calculation in columns (picture options) { a, b, op, at }
   A claim (DOK 3) stays the model `claim`: MX.s3.claim(def) fills {0} (the calculation with its answer) and {=0}
   (the answer only) from def.eg = ['4-9', '9-4'], so no result in a claim is typed by hand. */
(function () {
"use strict";
const M = MX.M, sg = MX.sg, fmt = MX.fmt, LET = MX.LET;
const P10 = [1, 10, 100, 1000];
const MINUS = "−";

/* ---------- exact decimals ---------- */
function dpOf(s) { s = String(s); const i = s.indexOf("."); return i < 0 ? 0 : s.length - i - 1; }
function toU(s, dp) {
  s = String(s).replace(MINUS, "-").replace(/,/g, "");
  const neg = s[0] === "-"; if (neg) s = s.slice(1);
  const p = s.split("."), frac = ((p[1] || "") + "000").slice(0, dp);
  const u = Number(p[0] || 0) * P10[dp] + Number(frac || 0);
  return neg ? -u : u;
}
/* units -> "1,204.50" (plain: "-1204.50", for the number pad) */
function fU(u, dp, plain) {
  const neg = u < 0, x = Math.abs(u), w = Math.floor(x / P10[dp]), f = dp ? "." + String(x % P10[dp]).padStart(dp, "0") : "";
  return (neg ? (plain ? "-" : MINUS) : "") + (plain ? String(w) : fmt(w)) + f;
}
const roundU = (u, dp) => Math.floor((u + P10[dp] / 2) / P10[dp]);      /* to the nearest whole number, halfway goes up */
/* what the child typed -> units (NaN when it is not a number with at most dp places) */
function typedU(v, dp) {
  if (v == null || v === "") return NaN;
  const s = String(v).replace(MINUS, "-").replace(/,/g, "");
  if (!/^-?\d*\.?\d*$/.test(s) || !/\d/.test(s)) return NaN;
  if (dpOf(s) > dp) { const extra = s.slice(s.indexOf(".") + 1 + dp); if (/[1-9]/.test(extra)) return NaN; }
  return toU(s, dp);
}
const digs = (u, n) => String(u).padStart(n, "0").split("").map(Number);
const SYM = { "+": "+", "-": MINUS };
const PLACE = dp => ["ones", "tenths", "hundredths", "thousandths"][dp];

/* the column method, digit by digit (a and b in units, a >= b for a subtraction) */
function colwork(a, b, op, dp) {
  const res = op === "+" ? a + b : a - b;
  const n = Math.max(String(a).length, String(b).length, String(Math.abs(res)).length, dp + 1);
  const A = digs(a, n), B = digs(b, n), R = digs(Math.abs(res), n), mk = A.map(() => null), top = A.slice();
  let regroup = 0;
  if (op === "+") {
    let c = 0;
    for (let i = n - 1; i >= 0; i--) { const s = A[i] + B[i] + c; c = s > 9 ? 1 : 0; if (c && i > 0) { mk[i - 1] = 1; regroup++; } }
  } else {
    for (let i = n - 1; i >= 0; i--) {
      if (top[i] >= B[i]) continue;
      let j = i - 1; while (j >= 0 && top[j] === 0) j--;
      if (j < 0) break;
      top[j]--; for (let k = j + 1; k < i; k++) top[k] = 9; top[i] += 10; regroup += i - j;   /* across a zero: one regroup per place */
    }
  }
  return { n: n, A: A, B: B, R: R, mk: mk, top: top, res: res, regroup: regroup };
}
const fromDigs = ds => Number(ds.join(""));

/* the wrong answers of the usual mistakes (in units), each with its name */
function slipU(a, b, op, dp, kind) {
  const w = colwork(a, b, op, dp), la = String(a).length, lb = String(b).length;
  if (kind === "noregroup" && op === "+") return fromDigs(w.A.map((x, i) => (x + w.B[i]) % 10));
  if (kind === "swap" && op === "-") return fromDigs(w.A.map((x, i) => Math.abs(x - w.B[i])));
  if (kind === "nopay" && op === "-") return fromDigs(w.A.map((x, i) => (x - w.B[i] + 10) % 10));
  if (kind === "left" && la !== lb) { const k = P10[Math.abs(la - lb)] || 0, x = la > lb ? a : a * k, y = la > lb ? b * k : b, r = op === "+" ? x + y : x - y; return r > 0 ? r : null; }
  if (kind === "op") return op === "+" ? a - b : a + b;
  return null;
}
function colSlips(a, b, op, dp) {
  const res = op === "+" ? a + b : a - b, out = [], f = u => fU(u, dp), col = PLACE(dp);
  const add = (u, msg) => { if (u != null && u !== res && !out.some(x => x[0] === u)) out.push([u, msg]); };
  add(slipU(a, b, op, dp, "noregroup"), "You did not regroup. When a column makes 10 or more, write the last digit and carry 1 to the next column.");
  add(slipU(a, b, op, dp, "swap"), "In one column you subtracted the top digit from the bottom digit. Always top take away bottom: regroup when the top digit is smaller.");
  add(slipU(a, b, op, dp, "nopay"), "You regrouped, but the next digit must get 1 smaller. Cross it out and write the new digit.");
  add(slipU(a, b, op, dp, "left"), "The decimal points are not lined up. Write " + col + " under " + col + ", so the points are in one column.");
  add(slipU(a, b, op, dp, "op"), op === "+" ? "You subtracted. This calculation is an addition." : "You added. This calculation is a subtraction.");
  if (dp) { add(res * 10, "The digits are right. Now check the decimal point: it stays in its column."); if (res % 10 === 0) add(res / 10, "Check the decimal point: it stays in its column."); }
  return out;
}
/* feedback for a typed answer to a op b (v as typed) */
function colMsg(a, b, op, dp, v, tip) {
  const res = op === "+" ? a + b : a - b, raw = String(v == null ? "" : v);
  if (dp && raw !== "" && raw.indexOf(".") < 0 && Number(raw) === res) return "The digits are right, but the decimal point is missing. Put it under the other decimal points.";
  const u = typedU(v, dp), s = colSlips(a, b, op, dp).find(x => x[0] === u);
  return s ? s[1] : tip;
}
const estOf = (a, b, op, dp) => { const ra = roundU(a, dp), rb = roundU(b, dp); return { ra: ra, rb: rb, e: op === "+" ? ra + rb : ra - rb }; };
const estText = (a, b, op, dp) => { const e = estOf(a, b, op, dp); return fmt(e.ra) + " " + SYM[op] + " " + fmt(e.rb) + " = " + sg(e.e); };

function pair(d) {
  const dp = Math.max(dpOf(d.a), dpOf(d.b));
  if (dpOf(d.a) !== dpOf(d.b)) throw new Error("s3: " + d.a + " and " + d.b + " need the same number of decimal places");
  const a = toU(d.a, dp), b = toU(d.b, dp);
  if (d.op === "-" && a < b) throw new Error("s3: " + d.a + " - " + d.b + " is below zero");
  return { dp: dp, a: a, b: b, res: d.op === "+" ? a + b : a - b };
}

/* ---------- shapes for unknowns ---------- */
const SHAPE = { T: ["▲", "triangle"], C: ["●", "circle"], S: ["■", "square"], D: ["◆", "diamond"] };
const sh = c => '<span class="g4s3-sh g4s3-sh--' + c.toLowerCase() + '">' + SHAPE[c][0] + "</span>";
const eqText = e => sh(e[0]) + " " + SYM[e[1]] + " " + sh(e[2]) + " = " + sg(e[3]);
const eqVal = (e, v) => (e[1] === "+" ? v[e[0]] + v[e[2]] : v[e[0]] - v[e[2]]);

/* ---------- s3col ---------- */
M.s3col = function (d) {
  const p = pair(d), dp = p.dp, f = u => fU(u, dp), w = colwork(p.a, p.b, d.op, dp), unit = d.unit ? " " + d.unit : "";
  const calc = f(p.a) + " " + SYM[d.op] + " " + f(p.b), pic = { k: "s3col", a: String(d.a), b: String(d.b), op: d.op };
  const tip = "Line up the decimal points. Start from the right, with the " + PLACE(dp) + "." + (w.regroup ? " Regroup when you need to." : "");
  const t = {
    q: d.text || (d.fig ? "Use the column method. Work out <b>" + calc + "</b>." : "Work out."),
    lines: [(d.text ? "" : calc + " = ") + "{0}" + unit], blanks: [{ len: 7, w: "big", dec: dp > 0 }],
    check(r) {
      const v = (r.v || [])[0];
      if (typedU(v, dp) === p.res) return { ok: true, parts: [true] };
      return { ok: false, msg: colMsg(p.a, p.b, d.op, dp, v, tip), parts: [false] };
    },
    hint: { pic: d.fig ? null : Object.assign({ show: "q" }, pic), step: "Estimate first: " + estText(p.a, p.b, d.op, dp) + ". " + tip },
    worked: { text: "Estimate: " + estText(p.a, p.b, d.op, dp) + ". Write the numbers in columns with the decimal points lined up. " + (d.op === "+" ? "Add" : "Subtract") + " each column from the right" +
      (w.regroup ? " and regroup " + (w.regroup === 1 ? "once" : w.regroup === 2 ? "twice" : w.regroup + " times") : "") + ". " + calc + " = " + f(p.res) + unit + ".", pic: Object.assign({ show: "work" }, pic) },
    yes: calc + " = " + f(p.res) + unit + ".", key: f(p.res), fill: [fU(p.res, dp, true)]
  };
  if (d.fig) t.fig = Object.assign({ show: "q" }, pic);
  return t;
};

/* ---------- s3est ---------- */
M.s3est = function (d) {
  const p = pair(d), dp = p.dp, f = u => fU(u, dp), e = estOf(p.a, p.b, d.op, dp), exact = d.exact !== false, unit = d.unit ? " " + d.unit : "";
  const calc = f(p.a) + " " + SYM[d.op] + " " + f(p.b), want = [e.ra, e.rb, e.e].concat(exact ? [p.res] : []);
  const rtip = u => f(u) + " is between " + fmt(Math.floor(u / P10[dp])) + " and " + fmt(Math.floor(u / P10[dp]) + 1) + ". Look at the tenths digit: 5 or more rounds up.";
  const lines = [f(p.a) + " is about {0}", f(p.b) + " is about {1}", "Estimate: {2}" + unit];
  if (exact) lines.push("Exact: " + calc + " = {3}" + unit);
  return {
    q: d.text || (exact ? "Round each number to the nearest whole number to <b>estimate</b>. Then work out the exact answer." : "Round each number to the nearest whole number. Write the <b>estimate</b> for <b>" + calc + "</b>."),
    marks: exact ? 2 : 1, lines: lines,
    blanks: want.map((x, i) => ({ len: i === 3 ? 7 : 4, w: i === 3 ? "big" : "box", dec: i === 3 && dp > 0 })),
    check(r) {
      const v = r.v || [], parts = want.map((x, i) => (i === 3 ? typedU(v[i], dp) === x : v[i] !== "" && v[i] != null && Number(v[i]) === x));
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      const i = parts.indexOf(false); let msg;
      if (i < 2) msg = rtip(i ? p.b : p.a);
      else if (i === 2) msg = "Now " + (d.op === "+" ? "add" : "subtract") + " your two rounded numbers: " + fmt(e.ra) + " " + SYM[d.op] + " " + fmt(e.rb) + ".";
      else msg = colMsg(p.a, p.b, d.op, dp, v[3], "Your estimate is " + sg(e.e) + ". The exact answer is near it. Line up the decimal points and work from the right.");
      return { ok: false, msg: "Look at box " + (i + 1) + ". " + msg, parts: parts };
    },
    hint: { pic: exact ? { k: "s3col", a: String(d.a), b: String(d.b), op: d.op, show: "q" } : null,
      step: "Round first: " + f(p.a) + " is about " + fmt(e.ra) + ". What is " + f(p.b) + " to the nearest whole number?" },
    worked: { text: f(p.a) + " is about " + fmt(e.ra) + " and " + f(p.b) + " is about " + fmt(e.rb) + ". Estimate: " + fmt(e.ra) + " " + SYM[d.op] + " " + fmt(e.rb) + " = " + sg(e.e) + "." +
      (exact ? " Exact: " + calc + " = " + f(p.res) + ". " + f(p.res) + " is near " + sg(e.e) + ", so the answer is sensible." : ""),
      pic: exact ? { k: "s3col", a: String(d.a), b: String(d.b), op: d.op, show: "work" } : null },
    yes: "The estimate is " + sg(e.e) + (exact ? " and the exact answer is " + f(p.res) : "") + unit + ".",
    key: want.map((x, i) => (i === 3 ? f(x) : sg(x))).join(" ; "), fill: want.map((x, i) => (i === 3 ? fU(x, dp, true) : String(x)))
  };
};

/* ---------- s3story ---------- */
M.s3story = function (d) {
  const all = [d.start].concat(d.steps.map(s => s[1])), dp = dpOf(d.start);
  if (all.some(x => dpOf(x) !== dp)) throw new Error("s3story: every amount needs " + dp + " decimal places");
  const f = u => fU(u, dp), s0 = toU(d.start, dp), st = d.steps.map(s => [s[0], toU(s[1], dp)]), unit = " " + d.unit;
  const go = (x, s) => (s[0] === "+" ? x + s[1] : x - s[1]), r1 = go(s0, st[0]), r2 = go(r1, st[1]);
  if (r1 < 0 || r2 < 0) throw new Error("s3story: the amount goes below zero");
  const verb = s => (s[0] === "+" ? "add" : "subtract"), bar = { k: "s3bar", start: String(d.start), steps: d.steps, unit: d.unit };
  const one = "First " + verb(st[0]) + " " + f(st[0][1]) + ". Then " + verb(st[1]) + " " + f(st[1][1]) + ".";
  const flip = s => [s[0] === "+" ? "-" : "+", s[1]];
  const t = {
    q: d.text, marks: 2, sub: "Show your method: write the amount after each step.",
    lines: ["After the first step: {0}" + unit, "Answer: {1}" + unit], blanks: [{ len: 7, w: "big", dec: dp > 0 }, { len: 7, w: "big", dec: dp > 0 }],
    check(r) {
      const v = r.v || [], u = [typedU(v[0], dp), typedU(v[1], dp)], parts = [u[0] === r1, u[1] === r2];
      if (parts[0] && parts[1]) return { ok: true, parts: parts };
      let msg;
      if (!parts[0]) {
        if (u[0] === go(s0, flip(st[0]))) msg = "Read the story again. In the first step the amount gets " + (st[0][0] === "+" ? "bigger, so add." : "smaller, so subtract.");
        else msg = "Look at box 1. " + colMsg(s0, st[0][1], st[0][0], dp, v[0], "Work out " + f(s0) + " " + SYM[st[0][0]] + " " + f(st[0][1]) + ". Line up the decimal points.");
      } else if (u[1] === r1) msg = "Look at box 2. That is the amount after the first step. Now " + verb(st[1]) + " " + f(st[1][1]) + ".";
      else if (u[1] === go(r1, flip(st[1]))) msg = "Look at box 2. In the second step the amount gets " + (st[1][0] === "+" ? "bigger, so add." : "smaller, so subtract.");
      else msg = "Look at box 2. " + colMsg(r1, st[1][1], st[1][0], dp, v[1], "Work out " + f(r1) + " " + SYM[st[1][0]] + " " + f(st[1][1]) + ". Line up the decimal points.");
      return { ok: false, msg: msg, parts: parts };
    },
    hint: { pic: d.fig ? null : bar, step: "Do one step at a time. " + one + " Line up the decimal points each time." },
    worked: { text: "First step: " + f(s0) + " " + SYM[st[0][0]] + " " + f(st[0][1]) + " = " + f(r1) + ". Second step: " + f(r1) + " " + SYM[st[1][0]] + " " + f(st[1][1]) + " = " + f(r2) + ". The answer is " + f(r2) + unit + ".",
      pic: { k: "s3set", list: [{ k: "s3col", a: fU(s0, dp, true), b: fU(st[0][1], dp, true), op: st[0][0], show: "work" }, { k: "s3col", a: fU(r1, dp, true), b: fU(st[1][1], dp, true), op: st[1][0], show: "work" }] } },
    yes: f(s0) + " " + SYM[st[0][0]] + " " + f(st[0][1]) + " = " + f(r1) + ", and " + f(r1) + " " + SYM[st[1][0]] + " " + f(st[1][1]) + " = " + f(r2) + unit + ".",
    key: f(r1) + " ; " + f(r2), fill: [fU(r1, dp, true), fU(r2, dp, true)]
  };
  if (d.fig) t.fig = bar;
  return t;
};

/* ---------- s3int ---------- */
const exprText = it => it.map((x, i) => (i % 2 ? SYM[x] : sg(x))).join(" ");
function evalItem(it) { let v = it[0]; const steps = [v]; for (let i = 1; i < it.length; i += 2) { v = it[i] === "+" ? v + it[i + 1] : v - it[i + 1]; steps.push(v); } return steps; }
function intMsg(it, v) {
  const st = evalItem(it), ans = st[st.length - 1], a = it[0], op = it[1], b = it[2];
  if (it.length === 5) {
    const c = it[4], op2 = it[3];
    if (v === st[1]) return "That is the first step: " + exprText(it.slice(0, 3)) + ". Now " + (op2 === "+" ? "add " : "subtract ") + fmt(c) + ".";
    if (op === "-" && op2 === "+" && v === a - (b + c)) return "Work from left to right. First " + exprText(it.slice(0, 3)) + ". Then add " + fmt(c) + " to your answer.";
    if (op === "-" && op2 === "-" && v === a - (b - c)) return "Work from left to right. First " + exprText(it.slice(0, 3)) + ". Then subtract " + fmt(c) + ".";
    if (v === (op === "+" ? a + b : a - b) + (op2 === "+" ? -c : c)) return "Look at the last sign. " + SYM[op2] + " " + fmt(c) + " means " + (op2 === "+" ? "add " : "subtract ") + fmt(c) + ".";
    if (v === (op === "+" ? a - b : a + b) + (op2 === "+" ? c : -c)) return "Look at the first sign. " + SYM[op] + " " + fmt(b) + " means " + (op === "+" ? "add " : "subtract ") + fmt(b) + ".";
    return "Work from left to right, one step at a time. Check each column.";
  }
  const dir = op === "+" ? "to the right" : "to the left";
  if (v === -ans) return ans < 0 ? "Your number is right, but the answer is below zero. Write a minus sign in front." : "The answer is above zero. It has no minus sign.";
  if (a < 0 && (v === -a + b || v === -(-a + b)) && op === "+") return "You ignored the minus sign. Start at " + sg(a) + ", not at " + fmt(-a) + ". Then jump " + b + " to the right.";
  if (a < 0 && op === "-" && (v === -a - b || v === b + a)) return "Start at " + sg(a) + " and jump " + b + " to the left. You go further below zero.";
  if (v === (op === "+" ? a - b : a + b)) return "Look at the sign. " + SYM[op] + " " + b + " is a jump of " + b + " " + dir + ".";
  return "Start at " + sg(a) + " on the number line. Jump " + b + " " + dir + "." + ((a < 0) !== (ans < 0) && ans !== 0 ? " You cross zero." : "");
}
function intWork(it) {
  const st = evalItem(it), ans = st[st.length - 1];
  if (it.length === 5) return exprText(it.slice(0, 3)) + " = " + sg(st[1]) + ". Then " + sg(st[1]) + " " + SYM[it[3]] + " " + fmt(it[4]) + " = " + sg(ans) + ".";
  const a = it[0], op = it[1], b = it[2], cross = (a < 0) !== (ans < 0) && a !== 0 && ans !== 0;
  if (cross) return "Start at " + sg(a) + ". Jump " + Math.abs(a) + " to reach 0. Then jump " + (b - Math.abs(a)) + " more to reach " + sg(ans) + ". " + exprText(it) + " = " + sg(ans) + ".";
  return "Start at " + sg(a) + " and jump " + b + (op === "+" ? " to the right" : " to the left") + ". " + exprText(it) + " = " + sg(ans) + ".";
}
const linePic = (it, more) => { const st = evalItem(it); return Object.assign({ k: "s3line", from: it[0], to: st[1] }, more || {}); };
M.s3int = function (d) {
  const items = d.items, ans = items.map(it => { const s = evalItem(it); return s[s.length - 1]; });
  const neg = items.some((it, i) => ans[i] < 0 || it.some(x => typeof x === "number" && x < 0));
  const big = items.some(it => it.some(x => typeof x === "number" && Math.abs(x) > 20)), two = items.filter(it => it.length === 3 && !big);
  const first = two[0];
  const t = {
    q: d.text || (items.length > 1 ? "Work out each calculation." : "Work out."), marks: items.length,
    lines: items.map((it, i) => exprText(it) + " = {" + i + "}"), blanks: items.map(() => ({ len: big ? 6 : 3, w: "big", neg: neg })),
    check(r) {
      const v = r.v || [], parts = ans.map((x, i) => v[i] !== "" && v[i] != null && Number(String(v[i]).replace(MINUS, "-")) === x);
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      const i = parts.indexOf(false);
      return { ok: false, msg: (items.length > 1 ? "Look at box " + (i + 1) + ". " : "") + intMsg(items[i], Number(String(v[i]).replace(MINUS, "-"))), parts: parts };
    },
    hint: { pic: first && !d.fig ? linePic(first, { open: true }) : null,
      step: first ? "Use a number line. Start at the first number. + is a jump to the right, " + MINUS + " is a jump to the left." : "Work from left to right. Do the first two numbers, then the third." },
    worked: { text: items.map(intWork).join(" "), pic: two.length ? { k: "s3set", dir: "col", list: two.slice(0, 2).map(it => linePic(it, { cap: exprText(it) + " = " + sg(evalItem(it)[1]) })) } : null },
    yes: items.map((it, i) => exprText(it) + " = " + sg(ans[i])).join(", ") + ".",
    key: ans.map(sg).join(" ; "), fill: ans.map(String)
  };
  /* a whole-number calculation in two steps: both steps written in columns */
  const long = items.length === 1 && items[0].length === 5 ? items[0] : null;
  if (long && long.every(x => typeof x !== "number" || x >= 0)) {
    const st = evalItem(long);
    if (st.every(x => x >= 0) && (long[1] === "+" || long[0] >= long[2]) && (long[3] === "+" || st[1] >= long[4]))
      t.worked.pic = { k: "s3set", list: [{ k: "s3col", a: String(long[0]), b: String(long[2]), op: long[1], show: "work" }, { k: "s3col", a: String(st[1]), b: String(long[4]), op: long[3], show: "work" }] };
  }
  if (d.fig && first) t.fig = linePic(first, d.fig === "open" ? { open: true } : {});
  return t;
};

/* ---------- s3temp ---------- */
M.s3temp = function (d) {
  const kind = d.kind || "diff", deg = " °C";
  let from, to, ans, q, lines, check, tip, work, key;
  const num = v => Number(String(v == null ? "" : v).replace(MINUS, "-"));
  if (kind === "diff") {
    from = d.from; to = d.to; ans = Math.abs(to - from);
    const up = to > from, cross = (from < 0) !== (to < 0) && from !== 0 && to !== 0, wrong = Math.abs(Math.abs(from) - Math.abs(to));
    q = d.text || "The temperature goes from <b>" + sg(from) + deg + "</b> to <b>" + sg(to) + deg + "</b>. How many degrees " + (up ? "warmer" : "colder") + " is it now?";
    lines = ["{0} degrees"];
    tip = cross ? "Go in two jumps: from " + sg(from) + " to 0, then from 0 to " + sg(to) + ". Add the two jumps." : "Count the degrees from " + sg(from) + " to " + sg(to) + " on a number line.";
    work = cross ? "From " + sg(from) + " to 0 is " + Math.abs(from) + " degrees. From 0 to " + sg(to) + " is " + Math.abs(to) + " degrees. " + Math.abs(from) + " + " + Math.abs(to) + " = " + ans + " degrees."
      : "From " + sg(from) + " to " + sg(to) + " is " + ans + " degrees: the two temperatures are on the same side of zero.";
    check = v => {
      if (v === ans) return null;
      if (cross && v === wrong) return "You subtracted the numbers without their signs. " + sg(from) + " and " + sg(to) + " are on different sides of zero, so add: " + Math.abs(from) + " + " + Math.abs(to) + ".";
      if (!cross && v === Math.abs(from) + Math.abs(to)) return "Both temperatures are on the same side of zero. Count from " + sg(from) + " to " + sg(to) + ": do not add them.";
      if (v === -ans) return "A difference says how far apart. It has no minus sign.";
      if (v === Math.abs(to) || v === Math.abs(from)) return "That is how far one temperature is from zero. Count all the way from " + sg(from) + " to " + sg(to) + ".";
      return tip;
    };
    key = String(ans);
  } else if (kind === "end") {
    from = d.from; to = d.from + d.change; ans = to;
    const up = d.change > 0, n = Math.abs(d.change);
    q = d.text || "The temperature is <b>" + sg(from) + deg + "</b>. It " + (up ? "rises" : "falls") + " by <b>" + n + " degrees</b>. What is the temperature now?";
    lines = ["{0}" + deg];
    tip = "Start at " + sg(from) + ". Count " + n + " degrees " + (up ? "up" : "down") + "." + ((from < 0) !== (to < 0) && to !== 0 && from !== 0 ? " You cross zero." : "");
    work = intWork([from, up ? "+" : "-", n]) + " The temperature is " + sg(to) + deg + ".";
    check = v => (v === ans ? null : v === -ans ? (ans < 0 ? "The temperature is below zero. Write a minus sign in front." : "The temperature is above zero now. It has no minus sign.")
      : v === from - d.change ? "The temperature " + (up ? "rises, so count up." : "falls, so count down.") : (from < 0 && (v === -from + d.change || v === -(-from + d.change))) ? "You ignored the minus sign. Start at " + sg(from) + ", below zero." : tip);
    key = sg(ans);
  } else {
    to = d.end; from = d.end - d.change; ans = from;
    const up = d.change > 0, n = Math.abs(d.change);
    q = d.text || "The temperature " + (up ? "rises" : "falls") + " by <b>" + n + " degrees</b>. Now it is <b>" + sg(to) + deg + "</b>. What was the temperature at the start?";
    lines = ["{0}" + deg];
    tip = "Work backwards. The temperature " + (up ? "rose" : "fell") + " by " + n + " degrees, so start at " + sg(to) + " and count " + n + (up ? " down." : " up.");
    work = "Work backwards from " + sg(to) + deg + ": " + sg(to) + " " + (up ? MINUS : "+") + " " + n + " = " + sg(from) + ". The temperature was " + sg(from) + deg + ". Check: " + sg(from) + " " + (up ? "+" : MINUS) + " " + n + " = " + sg(to) + ".";
    check = v => (v === ans ? null : v === to + d.change ? "You went on from " + sg(to) + ". To find the start, work backwards: do the opposite."
      : v === -ans ? (ans < 0 ? "The start is below zero. Write a minus sign in front." : "The start is above zero. It has no minus sign.") : tip);
    key = sg(ans);
  }
  const lo = Math.min(from, to, 0), hi = Math.max(from, to, 0), line = { k: "s3line", from: from, to: to, via0: kind === "diff" };
  const t = {
    q: q, lines: lines, blanks: [{ len: 3, w: "big", neg: kind !== "diff" || true }],
    check(r) { const raw = (r.v || [])[0], m = raw === "" || raw == null ? tip : check(num(raw)); return m == null ? { ok: true, parts: [true] } : { ok: false, msg: m, parts: [false] }; },
    hint: { pic: d.fig === "line" ? null : (kind === "diff" ? { k: "s3line", from: from, to: to, ask: true } : kind === "end" ? { k: "s3line", from: from, to: to, open: true } : { k: "s3line", min: lo - 1, max: hi + 1, marks: [to] }), step: tip },
    worked: { text: work, pic: line },
    yes: kind === "diff" ? "From " + sg(from) + deg + " to " + sg(to) + deg + " is " + ans + " degrees." : "The temperature " + (kind === "end" ? "is " : "was ") + sg(ans) + deg + ".",
    key: key, fill: [String(ans)]
  };
  if (d.fig === "line") t.fig = kind === "diff" ? { k: "s3line", from: from, to: to, ask: true } : kind === "end" ? { k: "s3line", from: from, to: to, open: true } : { k: "s3line", min: lo - 1, max: hi + 1, marks: [to] };
  if (d.fig === "thermo") {
    const min = Math.floor((lo - 1) / 5) * 5, max = Math.ceil((hi + 1) / 5) * 5, caps = d.caps || ["Before", "After"];
    t.fig = { k: "s3set", cls: "thermo", list: [{ k: "thermo", t: from, min: min, max: max, cap: caps[0] }, { k: "thermo", t: to, min: min, max: max, cap: caps[1] }] };
  }
  return t;
};

/* ---------- s3tbig ---------- */
M.s3tbig = function (d) {
  const A = d.a, B = d.b, ca = Math.abs(A.to - A.from), cb = Math.abs(B.to - B.from), deg = " °C";
  if (ca === cb && !d.same) throw new Error("s3tbig: the two changes are the same");
  const say = x => "from " + sg(x.from) + deg + " to " + sg(x.to) + deg;
  const how = (x, c) => ((x.from < 0) !== (x.to < 0) && x.from !== 0 && x.to !== 0 ? Math.abs(x.from) + " + " + Math.abs(x.to) + " = " + c : "from " + sg(x.from) + " to " + sg(x.to) + " is " + c);
  const sum = A.name + ": " + how(A, ca) + " degrees. " + B.name + ": " + how(B, cb) + " degrees.";
  const fool = x => ((x.from < 0) !== (x.to < 0) ? " " + sg(x.from) + " and " + sg(x.to) + " are on different sides of zero, so add the two jumps." : "");
  const opts = [{ html: A.name, ok: ca > cb, why: sum + fool(B) }, { html: B.name, ok: cb > ca, why: sum + fool(A) }, { html: "The changes are the same", ok: ca === cb, why: sum }];
  const win = ca > cb ? A : B;
  return {
    q: d.text || "<b>" + A.name + ":</b> the temperature goes " + say(A) + ". <b>" + B.name + ":</b> it goes " + say(B) + ". Which " + (d.what || "day") + " has the <b>bigger change</b> in temperature?",
    sub: "Tick (✓) one box.", opts: opts,
    fig: d.fig ? { k: "s3set", dir: "col", list: [{ k: "s3line", from: A.from, to: A.to, ask: true, cap: A.name }, { k: "s3line", from: B.from, to: B.to, ask: true, cap: B.name }] } : null,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: "Work out each change. " + ((o && o.why) || "") }; },
    hint: { pic: d.fig ? null : { k: "s3line", from: A.from, to: A.to, ask: true, cap: A.name }, step: "Find the size of each change first. When a change crosses zero, add the jump to zero and the jump from zero." },
    worked: { text: sum + (ca === cb ? " The changes are the same." : " " + Math.max(ca, cb) + " is more than " + Math.min(ca, cb) + ", so " + win.name + " has the bigger change."),
      pic: { k: "s3set", dir: "col", list: [{ k: "s3line", from: A.from, to: A.to, via0: true, cap: A.name + ": " + ca + " degrees" }, { k: "s3line", from: B.from, to: B.to, via0: true, cap: B.name + ": " + cb + " degrees" }] } },
    yes: ca === cb ? "Both changes are " + ca + " degrees." : win.name + " has the bigger change: " + Math.max(ca, cb) + " degrees, not " + Math.min(ca, cb) + ".",
    key: ca === cb ? "The changes are the same" : win.name
  };
};

/* ---------- s3unk ---------- */
M.s3unk = function (d) {
  const kind = d.kind;
  if (kind === "sumdiff") {
    const s = d.sh || ["T", "C"], X = s[0], Y = s[1];
    if ((d.sum + d.diff) % 2 || d.diff > d.sum || d.diff < 0) throw new Error("s3unk: no whole-number answer");
    const x = (d.sum + d.diff) / 2, y = (d.sum - d.diff) / 2, e1 = [X, "+", Y, d.sum], e2 = [X, "-", Y, d.diff], card = { k: "s3eq", lines: [e1, e2] };
    const tip = "Try pairs that add to " + d.sum + ". Then check the difference: it must be " + d.diff + ".";
    return {
      q: d.text || "Each shape stands for a whole number. " + eqText(e1) + " and " + eqText(e2) + ". Find the value of each shape.",
      marks: 2, fig: card, lines: [sh(X) + " = {0}", sh(Y) + " = {1}"], blanks: [{ len: 3, w: "big" }, { len: 3, w: "big" }],
      check(r) {
        const v = r.v || [], a = v[0] === "" || v[0] == null ? NaN : Number(v[0]), b = v[1] === "" || v[1] == null ? NaN : Number(v[1]);
        if (a === x && b === y) return { ok: true, parts: [true, true] };
        const parts = [a === x, b === y]; let msg = tip;
        if (a === y && b === x) msg = sh(X) + " " + MINUS + " " + sh(Y) + " = " + d.diff + ", so " + sh(X) + " is the bigger number. Swap your two numbers.";
        else if (a + b === d.sum) msg = "Your numbers add to " + d.sum + ". Good. But " + a + " " + MINUS + " " + b + " = " + sg(a - b) + ", not " + d.diff + ". Try another pair.";
        else if (a - b === d.diff) msg = "Your numbers have a difference of " + d.diff + ". Good. But " + a + " + " + b + " = " + (a + b) + ", not " + d.sum + ". Try another pair.";
        return { ok: false, msg: msg, parts: parts };
      },
      hint: { step: tip + " " + sh(X) + " is the bigger number." },
      worked: { text: "Pairs that add to " + d.sum + ": " + [x + 1, x, x - 1].filter(k => k <= d.sum && d.sum - k >= 0).map(k => k + " and " + (d.sum - k)).join(", ") + " ... Only " + x + " and " + y + " have a difference of " + d.diff + ": " + x + " + " + y + " = " + d.sum + " and " + x + " " + MINUS + " " + y + " = " + d.diff + ".",
        pic: { k: "s3eq", lines: [e1, e2], vals: { [X]: x, [Y]: y } } },
      yes: sh(X) + " = " + x + " and " + sh(Y) + " = " + y + ".", key: x + " ; " + y, fill: [String(x), String(y)]
    };
  }
  if (kind === "given") {
    const e = d.eq, g = d.give, other = g[0] === e[0] ? e[2] : e[0], n = e[3], v = g[1];
    const ans = e[1] === "+" ? n - v : g[0] === e[2] ? n + v : v - n, wrong = e[1] === "+" ? n + v : g[0] === e[2] ? n - v : v + n;
    if (ans < 0) throw new Error("s3unk: the answer is below zero");
    const put = e[1] === "+" ? (g[0] === e[0] ? v + " + " + sh(other) + " = " + n : sh(other) + " + " + v + " = " + n) : (g[0] === e[2] ? sh(other) + " " + MINUS + " " + v + " = " + n : v + " " + MINUS + " " + sh(other) + " = " + n);
    const calc = e[1] === "+" ? n + " " + MINUS + " " + v : g[0] === e[2] ? n + " + " + v : v + " " + MINUS + " " + n;
    return {
      q: d.text || eqText(e) + ". If " + sh(g[0]) + " is <b>" + v + "</b>, what is " + sh(other) + "?",
      fig: { k: "s3eq", lines: [e], vals: { [g[0]]: v } }, lines: [sh(other) + " = {0}"], blanks: [{ len: 3, w: "big" }],
      check(r) {
        const a = (r.v || [])[0], x = a === "" || a == null ? NaN : Number(a);
        if (x === ans) return { ok: true, parts: [true] };
        if (x === wrong && wrong !== ans) return { ok: false, msg: "Put " + v + " in place of " + sh(g[0]) + ": " + put + ". Check your number in the calculation.", parts: [false] };
        if (x === v) return { ok: false, msg: "That is the value of " + sh(g[0]) + ". Now find " + sh(other) + ".", parts: [false] };
        return { ok: false, msg: "Put " + v + " in place of " + sh(g[0]) + ": " + put + ". Which number fits?", parts: [false] };
      },
      hint: { step: "Put " + v + " in place of " + sh(g[0]) + ": " + put + "." },
      worked: { text: put + ". So " + sh(other) + " = " + calc + " = " + ans + ".", pic: { k: "s3eq", lines: [e], vals: { [g[0]]: v, [other]: ans } } },
      yes: put.replace(sh(other), String(ans)) + ", so " + sh(other) + " = " + ans + ".", key: String(ans), fill: [String(ans)]
    };
  }
  if (kind === "table") {
    const e = d.eq, n = e[3], X = e[0], Y = e[2], ans = d.given.map(x => (e[1] === "+" ? n - x : x - n));
    if (ans.some(y => y < 0)) throw new Error("s3unk: a pair goes below zero");
    return {
      q: d.text || eqText(e) + ". The shapes stand for whole numbers. Complete each pair.",
      marks: ans.length, fig: { k: "s3eq", lines: [e] },
      lines: d.given.map((x, i) => "If " + sh(X) + " = " + x + ", then " + sh(Y) + " = {" + i + "}"), blanks: ans.map(() => ({ len: 3, w: "box" })),
      check(r) {
        const v = r.v || [], parts = ans.map((y, i) => v[i] !== "" && v[i] != null && Number(v[i]) === y);
        if (parts.every(Boolean)) return { ok: true, parts: parts };
        const i = parts.indexOf(false), x = d.given[i], got = Number(v[i]);
        const test = e[1] === "+" ? x + " + " + got + " = " + (x + got) : x + " " + MINUS + " " + got + " = " + sg(x - got);
        return { ok: false, msg: "Look at box " + (i + 1) + ". " + (v[i] === "" || v[i] == null ? "" : "Check: " + test + ", not " + n + ". ") + (e[1] === "+" ? "The two numbers must add to " + n + "." : "The difference must be " + n + "."), parts: parts };
      },
      hint: { step: e[1] === "+" ? "The two shapes add to " + n + ". Ask: " + d.given[0] + " + what = " + n + "?" : "The difference is " + n + ". Ask: " + d.given[0] + " " + MINUS + " what = " + n + "?" },
      worked: { text: d.given.map((x, i) => (e[1] === "+" ? x + " + " + ans[i] : x + " " + MINUS + " " + ans[i]) + " = " + n).join(". ") + ". Many pairs fit, because there are two unknowns.",
        pic: { k: "s3eq", lines: [e], vals: { [X]: d.given[0], [Y]: ans[0] } } },
      yes: d.given.map((x, i) => (e[1] === "+" ? x + " + " + ans[i] : x + " " + MINUS + " " + ans[i]) + " = " + n).join(", ") + ".",
      key: ans.join(" ; "), fill: ans.map(String)
    };
  }
  /* pick: which pair fits every calculation? */
  const eqs = d.eqs, X = eqs[0][0], Y = eqs[0][2];
  const fits = pr => eqs.every(e => eqVal(e, { [X]: pr[0], [Y]: pr[1] }) === e[3]);
  if (!fits(d.pairs[0]) || d.pairs.slice(1).some(fits)) throw new Error("s3unk pick: only the first pair may fit");
  const whyNot = pr => { const e = eqs.find(q => eqVal(q, { [X]: pr[0], [Y]: pr[1] }) !== q[3]), v = eqVal(e, { [X]: pr[0], [Y]: pr[1] }); return pr[0] + " " + SYM[e[1]] + " " + pr[1] + " = " + sg(v) + ", not " + e[3] + "."; };
  const opts = MX.arrange(d.pairs.map((pr, i) => ({ html: sh(X) + " = " + pr[0] + " and " + sh(Y) + " = " + pr[1], ok: i === 0, why: i ? whyNot(pr) : "" })), d.at), good = d.pairs[0];
  return {
    q: d.text || (eqs.length > 1 ? "Which pair of numbers fits <b>both</b> calculations?" : "Which pair of numbers fits the calculation?"), sub: "Tick (✓) one box.", fig: { k: "s3eq", lines: eqs }, opts: opts,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) + " Put the numbers in place of the shapes and check." }; },
    hint: { step: "Put each pair in place of the shapes. Check " + (eqs.length > 1 ? "both calculations." : "the calculation.") },
    worked: { text: eqs.map(e => good[0] + " " + SYM[e[1]] + " " + good[1] + " = " + e[3]).join(" and ") + ". So " + sh(X) + " = " + good[0] + " and " + sh(Y) + " = " + good[1] + ".", pic: { k: "s3eq", lines: eqs, vals: { [X]: good[0], [Y]: good[1] } } },
    yes: sh(X) + " = " + good[0] + " and " + sh(Y) + " = " + good[1] + ".", key: LET[opts.findIndex(o => o.ok)] + ": " + good[0] + " and " + good[1]
  };
};

/* ---------- s3mistake ---------- */
const MISTAKE = {
  left: (P) => P + " did not line up the decimal points.",
  noregroup: (P) => P + " did not regroup when a column made 10 or more.",
  swap: (P) => P + " took the top digit away from the bottom digit in one column.",
  nopay: (P) => P + " regrouped, but did not make the next digit 1 smaller.",
  op: (P, op) => P + (op === "+" ? " subtracted, but the calculation is an addition." : " added, but the calculation is a subtraction.")
};
M.s3mistake = function (d) {
  const p = pair(d), dp = p.dp, f = u => fU(u, dp), he = !!d.he, P = he ? "He" : "She", calc = f(p.a) + " " + SYM[d.op] + " " + f(p.b);
  const kinds = d.op === "+" ? ["left", "noregroup", "op"] : ["swap", "nopay", "left"];
  if (kinds.indexOf(d.slip) < 0) throw new Error("s3mistake: " + d.slip + " does not fit " + d.op);
  const shown = slipU(p.a, p.b, d.op, dp, d.slip);
  if (shown == null || shown === p.res) throw new Error("s3mistake: the mistake " + d.slip + " gives no wrong answer for " + calc);
  let others = kinds.filter(k => k !== d.slip);
  if (d.slip !== "left" && others.indexOf("left") >= 0 && d.op === "-") others = others.filter(k => k !== "left").concat(["op"]).slice(0, 2);
  others.forEach(k => { if (slipU(p.a, p.b, d.op, dp, k) === shown) throw new Error("s3mistake: " + k + " gives the same wrong answer"); });
  const w0 = colwork(p.a, p.b, d.op, dp), pr = he ? "he" : "she";
  const whyNot = k => (k === "left" ? "Look again: the decimal points are in one column." :
    k === "noregroup" ? (w0.regroup ? "Check each column. Where a column makes 10 or more, the 1 was carried." : "No column makes 10 or more, so there is nothing to regroup. Look at the decimal points.") :
    k === "swap" ? "Check each column: top digit take away bottom digit." :
    k === "nopay" ? (d.slip === "swap" ? P + " did not regroup at all. Look at each column: is it the top digit take away the bottom digit?" : "Look at the digits next to a regrouped column. That is not what went wrong.") :
    (d.op === "+" ? "The answer is bigger than " + f(p.a) + ", so " + pr + " did add." : "The answer is smaller than " + f(p.a) + ", so " + pr + " did subtract."));
  const opts = MX.arrange([{ html: MISTAKE[d.slip](P, d.op), ok: true, why: "" }].concat(others.map(k => ({ html: MISTAKE[k](P, d.op), ok: false, why: whyNot(k) }))), d.at);
  const pic = { k: "s3col", a: String(d.a), b: String(d.b), op: d.op };
  return {
    q: d.who + " works out <b>" + calc + "</b>. " + (he ? "His" : "Her") + " answer is wrong. What is " + (he ? "his" : "her") + " mistake?", sub: "Tick (✓) one box.",
    fig: Object.assign({ show: "ans", ans: f(shown), bad: true, left: d.slip === "left" ? "dig" : false }, pic), opts: opts,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || "Look at each column in turn." }; },
    hint: { step: "Estimate: " + estText(p.a, p.b, d.op, dp) + ". Then look at each column, from the right. " + (d.slip === "left" ? "Are the decimal points in one column?" : "Is each digit of the answer right?") },
    worked: { text: MISTAKE[d.slip](P, d.op) + " " + d.who + " wrote " + f(shown) + ". The correct answer is " + calc + " = " + f(p.res) + ".", pic: Object.assign({ show: "work" }, pic) },
    yes: MISTAKE[d.slip](P, d.op) + " The correct answer is " + f(p.res) + ".", key: LET[opts.findIndex(o => o.ok)] + ": " + MISTAKE[d.slip](P, d.op)
  };
};

/* ---------- s3align ---------- */
M.s3align = function (d) {
  const p = pair(d), dp = p.dp, f = u => fU(u, dp), calc = f(p.a) + " " + SYM[d.op] + " " + f(p.b);
  if (String(p.a).length === String(p.b).length) throw new Error("s3align: the two numbers need a different number of digits");
  const pic = { k: "s3col", a: String(d.a), b: String(d.b), op: d.op, show: "q" };
  const why = "The decimal points are not in one column. Tenths must be under tenths.";
  const opts = MX.arrange([{ fig: Object.assign({ uni: true }, pic), alt: "The decimal points are lined up", ok: true, why: "" }, { fig: Object.assign({ left: true }, pic), alt: "The numbers start at the left", ok: false, why: why },
    { fig: Object.assign({ shift: 1 }, pic), alt: "The second number is one square to the right", ok: false, why: why }], d.at);
  opts.forEach(o => { o.html = ""; });
  const good = opts.findIndex(o => o.ok);
  return {
    q: "Which is the correct way to write <b>" + calc + "</b> in columns?", sub: "Tick (✓) one box.", letters: true, opts: opts,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || why }; },
    hint: { step: "Look at the decimal points. In the right layout they are in one column, one under the other." },
    worked: { text: "In " + LET[good] + " the decimal points are lined up: ones under ones and " + PLACE(dp) + " under " + PLACE(dp) + ". Then " + calc + " = " + f(p.res) + ".", pic: Object.assign({}, pic, { show: "work" }) },
    yes: LET[good] + " is right: the decimal points are in one column.", key: LET[good]
  };
};

/* ---------- a claim with its calculations worked out ---------- */
function calcStr(s) {
  const m = /^(-?[\d.]+)([+-])([\d.]+)$/.exec(String(s).replace(/\s/g, ""));
  if (!m) throw new Error("s3 claim: cannot read " + s);
  const dp = Math.max(dpOf(m[1]), dpOf(m[3])), a = toU(m[1], dp), b = toU(m[3], dp), r = m[2] === "+" ? a + b : a - b;
  /* an answer is written the short way (6, not 6.0): a claim may be about that */
  let rs = fU(r, dp); if (dp && /\.0+$/.test(rs)) rs = rs.replace(/\.0+$/, "");
  return { text: fU(a, dp) + " " + SYM[m[2]] + " " + fU(b, dp) + " = " + rs, res: rs };
}
function claim(def) {
  const eg = (def.eg || []).map(calcStr);
  const fill = s => (typeof s !== "string" ? s : s.replace(/\{(=?)(\d)\}/g, (m, only, i) => { if (!eg[+i]) throw new Error("s3 claim: no calculation " + i); return only ? eg[+i].res : eg[+i].text; }));
  const out = Object.assign({}, def, { type: "claim", says: fill(def.says), worked: fill(def.worked), model: fill(def.model) });
  if (def.ctx) out.ctx = fill(def.ctx);
  out.reasons = def.reasons.map(x => Object.assign({}, x, { t: fill(x.t), why: fill(x.why) }));
  if (def.hint) out.hint = Object.assign({}, def.hint, { step: fill(def.hint.step) });
  delete out.eg;
  return out;
}

MX.s3 = { dpOf: dpOf, toU: toU, fU: fU, roundU: roundU, typedU: typedU, colwork: colwork, slipU: slipU, colSlips: colSlips, evalItem: evalItem, sh: sh, SHAPE: SHAPE, claim: claim, calcStr: calcStr, SYM: SYM };
})();
