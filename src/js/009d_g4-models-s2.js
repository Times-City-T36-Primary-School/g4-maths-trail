/* g4-models-s2.js - Stop 2 (Grade 4, Stage 5): multiply and divide by 10, 100 and 1,000 (5Np.02, 5Np.03).

   One model, `s2pow`, with a `kind`. Every answer is WORKED OUT here from the data (start number, operation, power
   of ten). The arithmetic is exact: a number is held as a whole number of millionths (MX.s2.parse / show / apply),
   never as a float, so 0.07 × 100 is 7 and not 7.000000000000001.

   An operation is ['x' | 'd', 10 | 100 | 1000]. A number in the data may be a number (0.47) or a string ('0.47').

   kind 'calc'   { items: [[n, op, p], ...] (1 or 2), show: 'ask' | 'full' (a slider picture for the first item) }
                 "Calculate."  0.47 × 100 = [ ]
   kind 'read'   { n, op, p, at }                     the slider picture is shown: tick the calculation it shows
   kind 'op'     { n, op, p, at, show: true }         3.6 [ ] = 360: tick the missing operation (× 100)
   kind 'miss'   { items: [[null, op, p, result] | [n, op, null, result], ...] }   a missing number, worked backwards
   kind 'flow'   { start, ops: [[op, p], [op, p]], hide: ['op', i] | ['box', i], mid: false (the middle box is empty) }
                 a flow diagram (picture s2flow) with one empty box or one empty multiplier
   kind 'bal'    { a, lops: [[op, p], [op, p]], rop: [op, p] }      a × 100 ÷ 10 = [ ] ÷ 100
   kind 'story'  { text, n, ops: [[op, p], ...] (1 or 2), unit, tip, mid: 'what the first step gives' }
   Feedback names the mistake: moved the wrong way, moved too few or too many places, wrote a zero at the end of a
   decimal, moved only the whole-number part, added or subtracted the power of ten, went forwards instead of backwards. */
(function () {
"use strict";
const M = MX.M, fmt = MX.fmt, arrange = MX.arrange;
const U = 1000000, SYM = { x: "×", d: "÷" }, INV = { x: "d", d: "x" }, POW = [10, 100, 1000], PL = { 10: 1, 100: 2, 1000: 3 };

/* "0.47" -> 470000 millionths; NaN when it is not a plain number */
function parse(s) {
  const m = /^(\d*)(?:\.(\d*))?$/.exec(String(s == null ? "" : s).replace(/,/g, "").trim());
  if (!m || (m[1] === "" && !(m[2] || "")) || (m[2] || "").length > 6) return NaN;
  return Number(m[1] || 0) * U + Number(((m[2] || "") + "000000").slice(0, 6));
}
function raw(u) { const w = Math.floor(u / U), f = String(u % U).padStart(6, "0").replace(/0+$/, ""); return String(w) + (f ? "." + f : ""); }
function show(u) { const s = raw(u), at = s.indexOf("."); return at < 0 ? fmt(s) : fmt(s.slice(0, at)) + s.slice(at); }
function can(u, op, p) { return op === "x" || u % p === 0; }
function apply(u, op, p) {
  if (POW.indexOf(p) < 0) throw new Error("s2pow: the power must be 10, 100 or 1000, not " + p);
  if (op === "x") return u * p;
  if (u % p !== 0) throw new Error("s2pow: " + raw(u) + " ÷ " + p + " has too many decimal places");
  return u / p;
}
const need = (x, what) => { const u = parse(x); if (isNaN(u)) throw new Error("s2pow: bad number for " + what + ": " + x); return u; };
const places = k => k + (k === 1 ? " place" : " places");
const dir = op => (op === "x" ? "left" : "right");
const opt = o => SYM[o[0]] + " " + fmt(o[1]);
const rule = (op, p) => SYM[op] + " " + fmt(p) + " moves every digit " + places(PL[p]) + " to the " + dir(op) + ".";
const sum = (n, op, p) => show(n) + " " + SYM[op] + " " + fmt(p) + " = " + show(apply(n, op, p));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const sayList = a => a.join(", ").replace(/, ([^,]*)$/, " and $1");

/* what went wrong in n op p = v? "" when the mistake is not one we know */
function slip(n, op, p, typed) {
  const v = parse(typed), t = String(typed == null ? "" : typed);
  if (isNaN(v)) return "";
  if (v === n) {
    if (op === "x" && n % U !== 0 && /\.\d*0$/.test(t)) return "You wrote a zero at the end. But " + t + " is the same as " + show(n) + "! " + rule(op, p);
    return "The number must change. " + rule(op, p);
  }
  if (op === "x" && n % U !== 0 && v === Math.floor(n / U) * U * p + (n % U)) return "You moved only the whole-number part. Every digit moves, the digits after the decimal point too.";
  if (can(n, INV[op], p) && v === apply(n, INV[op], p)) return (op === "x" ? "That is dividing. Multiplying makes the number bigger: the digits move to the left." : "That is multiplying. Dividing makes the number smaller: the digits move to the right.");
  for (let i = 0; i < POW.length; i++) {
    const q = POW[i];
    if (q !== p && can(n, op, q) && v === apply(n, op, q)) return "You moved the digits " + places(PL[q]) + ". " + rule(op, p);
  }
  if (op === "x" && v === n + p * U) return SYM.x + " " + fmt(p) + " is not + " + fmt(p) + ". " + rule(op, p);
  if (op === "d" && v === n - p * U) return SYM.d + " " + fmt(p) + " is not − " + fmt(p) + ". " + rule(op, p);
  return "";
}

const slide = (n, op, p, more) => Object.assign({ k: "s2slide", n: raw(n), op: op, p: p }, more || {});

/* a task with typed answers: answers = millionths */
function typed(o) {
  const ans = o.answers, n = ans.length;
  return {
    q: o.q, sub: o.sub || "", marks: o.marks || n, lines: o.lines, fig: o.fig || null,
    blanks: ans.map(() => ({ len: 7, w: "mid", dec: true })),
    check(r) {
      const vs = ans.map((a, i) => ((r.v || [])[i] == null ? "" : String(r.v[i])));
      const parts = ans.map((a, i) => vs[i] !== "" && parse(vs[i]) === a);
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      const i = parts.indexOf(false), pre = n > 1 ? "Look at box " + (i + 1) + ". " : "";
      return { ok: false, msg: pre + (o.slip(i, vs[i]) || o.tips[i] || o.tip), parts: parts };
    },
    hint: { pic: o.hintPic || null, step: o.tip },
    worked: { text: o.worked, pic: o.workedPic || null },
    yes: o.yes || o.worked, key: ans.map(show).join(" ; "), fill: ans.map(raw)
  };
}

const K = {};

/* Calculate: one or two calculations */
K.calc = function (d) {
  const its = d.items.map(it => ({ n: need(it[0], "calc"), op: it[1], p: it[2] }));
  its.forEach(it => { it.ans = apply(it.n, it.op, it.p); });
  const f = its[0], many = its.length > 1;
  return typed({
    q: d.q || "Calculate.", sub: d.show ? "Use the place value picture to help you." : "",
    lines: its.map((it, i) => show(it.n) + " " + SYM[it.op] + " " + fmt(it.p) + " = {" + i + "}"),
    answers: its.map(it => it.ans),
    fig: d.show ? slide(f.n, f.op, f.p, { ask: true, arrows: d.show === "full" }) : null,
    slip: (i, v) => slip(its[i].n, its[i].op, its[i].p, v),
    tips: its.map(it => cap(rule(it.op, it.p)) + " The decimal point stays where it is."),
    tip: many ? its.map(it => cap(rule(it.op, it.p))).filter((x, i, a) => a.indexOf(x) === i).join(" ") + " The decimal point does not move."
      : cap(rule(f.op, f.p)) + " The decimal point does not move.",
    hintPic: slide(f.n, f.op, f.p, { ask: true, arrows: true }),
    worked: its.map(it => cap(rule(it.op, it.p)) + " " + sum(it.n, it.op, it.p) + ".").join(" "),
    workedPic: slide(f.n, f.op, f.p),
    yes: its.map(it => sum(it.n, it.op, it.p)).join(" and ") + "."
  });
};

/* the slider picture shows a move: which calculation is it? */
K.read = function (d) {
  const n = need(d.n, "read"), op = d.op, p = d.p, ans = apply(n, op, p), q = p === 10 ? 100 : 10;
  const o = (op2, p2, why) => ({ html: show(n) + " " + SYM[op2] + " " + fmt(p2), ok: !why, why: why || "" });
  const opts = arrange([
    o(op, p),
    o(op, q, "Count the places each digit moves: " + PL[p] + ", not " + PL[q] + "."),
    o(INV[op], p, "Look at the arrows. The digits move to the " + dir(op) + ", so the number gets " + (op === "x" ? "bigger" : "smaller") + "."),
    o(INV[op], q, "The digits move " + places(PL[p]) + " to the " + dir(op) + ". That is " + SYM[op] + " " + fmt(p) + ".")], d.at);
  return {
    q: "Look at the place value picture. Which calculation does it show?", sub: "Tick (✓) one box.",
    fig: slide(n, op, p, { cap: false }), opts: opts,
    check(r) { const x = opts[r.pick]; return x && x.ok ? { ok: true } : { ok: false, msg: (x && x.why) || "Count how many places each digit moves, and which way." }; },
    hint: { pic: null, step: "Follow one arrow. Which way does the digit move? How many places? Left is ×, right is ÷." },
    worked: { text: "Every digit moves " + places(PL[p]) + " to the " + dir(op) + ". That is " + SYM[op] + " " + fmt(p) + ": " + sum(n, op, p) + "." },
    yes: "The picture shows " + sum(n, op, p) + ".", key: show(n) + " " + SYM[op] + " " + fmt(p)
  };
};

/* a missing operation: 3.6 [ ] = 360 */
K.op = function (d) {
  const n = need(d.n, "op"), op = d.op, p = d.p, ans = apply(n, op, p), q = p === 10 ? 100 : p === 100 ? (d.other || 10) : 100;
  /* a wrong option: show its answer only when that answer has at most 2 decimal places (Stage 5 numbers); otherwise
     say which way or how far the digits move */
  const why = (op2, p2) => (can(n, op2, p2) && apply(n, op2, p2) % 10000 === 0 ? sum(n, op2, p2) + ", not " + show(ans) + "."
    : op2 !== op ? show(ans) + " is " + (op === "x" ? "bigger" : "smaller") + " than " + show(n) + ". " + (op2 === "x" ? "Multiplying makes a number bigger." : "Dividing makes a number smaller.")
      : opt([op2, p2]) + " moves every digit " + places(PL[p2]) + ". From " + show(n) + " to " + show(ans) + " each digit moves " + places(PL[p]) + ".");
  const opts = arrange([[op, p], [INV[op], p], [op, q], [INV[op], q]].map((o, i) => ({ html: opt(o), ok: i === 0, why: i ? why(o[0], o[1]) : "" })), d.at);
  return {
    q: "Which operation goes in the box?<br><b>" + show(n) + " ☐ = " + show(ans) + "</b>", sub: "Tick (✓) one box.",
    fig: d.show ? slide(n, op, p, { arrows: false, cap: false }) : null, opts: opts,
    check(r) { const x = opts[r.pick]; return x && x.ok ? { ok: true } : { ok: false, msg: (x && x.why) || "Is the answer bigger or smaller? How many places do the digits move?" }; },
    hint: { pic: slide(n, op, p, { arrows: false, cap: false }), step: "Is " + show(ans) + " bigger or smaller than " + show(n) + "? Then count how many places each digit moves." },
    worked: { text: show(ans) + " is " + (op === "x" ? "bigger" : "smaller") + " than " + show(n) + ", so the digits move to the " + dir(op) + ". They move " + places(PL[p]) + ": " + sum(n, op, p) + ".", pic: slide(n, op, p) },
    yes: sum(n, op, p) + ".", key: opt([op, p])
  };
};

/* a missing number: the start number (work backwards) or the power of ten */
K.miss = function (d) {
  const its = d.items.map(it => {
    const res = need(it[3], "miss result"), op = it[1];
    if (it[0] == null) {
      const p = it[2], n = apply(res, INV[op], p);
      return { ans: n, line: i => "{" + i + "} " + SYM[op] + " " + fmt(p) + " = " + show(res),
        tip: "Work backwards from " + show(res) + ". The inverse of " + SYM[op] + " " + fmt(p) + " is " + SYM[INV[op]] + " " + fmt(p) + ".",
        work: "Work backwards: " + sum(res, INV[op], p) + ". Check: " + sum(n, op, p) + ".",
        slip: v => (can(res, op, p) && parse(v) === apply(res, op, p) ? "You went forwards. Work backwards from " + show(res) + ": do the inverse, " + SYM[INV[op]] + " " + fmt(p) + "."
          : parse(v) === res ? "That is the answer of the calculation. Which number do you start with?" : slip(res, INV[op], p, v)) };
    }
    const n = need(it[0], "miss"), p = POW.find(q => can(n, op, q) && apply(n, op, q) === res);
    if (!p) throw new Error("s2pow miss: no power of ten takes " + it[0] + " to " + it[3]);
    return { ans: p * U, line: i => show(n) + " " + SYM[op] + " {" + i + "} = " + show(res),
      tip: "Count how many places each digit moves from " + show(n) + " to " + show(res) + ". 1 place is 10, 2 places is 100, 3 places is 1,000.",
      work: "Each digit moves " + places(PL[p]) + " to the " + dir(op) + ". So the missing number is " + fmt(p) + ": " + sum(n, op, p) + ".",
      slip: v => { const q = parse(v) / U; return POW.indexOf(q) >= 0 ? fmt(q) + " moves the digits " + places(PL[q]) + ". Here each digit moves " + places(PL[p]) + "." : "The missing number is 10, 100 or 1,000. Count the places the digits move."; } };
  });
  const many = its.length > 1;
  return typed({
    q: many ? "Write the missing numbers." : "Write the missing number.",
    lines: its.map((it, i) => it.line(i)), answers: its.map(it => it.ans),
    slip: (i, v) => its[i].slip(v), tips: its.map(it => it.tip), tip: its.map(it => it.tip).filter((x, i, a) => a.indexOf(x) === i).join(" "),
    hintPic: d.pic || null,
    worked: its.map(it => it.work).join(" "), yes: its.map(it => it.work).join(" ")
  });
};

/* a flow diagram with one empty box or one empty multiplier */
function flowVals(start, ops) { const v = [start]; ops.forEach(o => v.push(apply(v[v.length - 1], o[0], o[1]))); return v; }
K.flow = function (d) {
  const ops = d.ops, vals = flowVals(need(d.start, "flow"), ops), what = d.hide[0], at = d.hide[1], last = vals.length - 1;
  const midOpen = d.mid === false && vals.length === 3;
  const boxes = vals.map((v, i) => (what === "box" && i === at ? null : midOpen && i === 1 ? "" : show(v)));
  const labs = ops.map((o, i) => (what === "op" && i === at ? SYM[o[0]] + " ?" : opt(o)));
  const fig = { k: "s2flow", boxes: boxes, ops: labs, ask: what === "op" ? { op: at } : { box: at } };
  const full = { k: "s2flow", boxes: vals.map(show), ops: ops.map(opt), hl: what === "op" ? { op: at } : { box: at } };
  const chainText = vals.slice(1).map((v, i) => sum(vals[i], ops[i][0], ops[i][1])).join(". ") + ".";
  if (what === "op") {
    if (ops.length !== 2) throw new Error("s2pow flow: an empty arrow needs a diagram with 2 arrows");
    const o = ops[at], other = ops[1 - at];
    /* the two arrows together */
    const net = (() => { let e = 0; ops.forEach(x => { e += (x[0] === "x" ? 1 : -1) * PL[x[1]]; }); return e; })();
    const tip = midOpen ? (at === 1 ? "First fill the middle box in your head: " + show(vals[0]) + " " + opt(other) + ". Then count the places from the middle box to the last box."
      : "Work backwards from the last box to find the middle box: do the inverse of " + opt(other) + ". Then count the places from the first box.")
      : "Look at the two boxes on each side of the empty arrow. Count how many places each digit moves.";
    return typed({
      q: "Complete the flow diagram. Write the missing number on the arrow.", sub: "Follow the arrows from left to right.",
      lines: ["Missing number: {0}"], answers: [o[1] * U], fig: fig,
      slip: (i, v) => {
        const q = parse(v) / U;
        if (net !== 0 && POW[Math.abs(net) - 1] === q && q !== o[1]) return fmt(q) + " is for the whole diagram, from the first box to the last box. The other arrow already does " + opt(other) + ".";
        if (q === other[1] && q !== o[1]) return "That is the number on the other arrow. Find the number for the empty arrow.";
        if (POW.indexOf(q) >= 0) return SYM[o[0]] + " " + fmt(q) + " moves the digits " + places(PL[q]) + ". From " + show(vals[at]) + " to " + show(vals[at + 1]) + " each digit moves " + places(PL[o[1]]) + ".";
        return "The missing number is 10, 100 or 1,000.";
      },
      tips: [tip], tip: tip,
      hintPic: midOpen ? { k: "s2flow", boxes: vals.map((v, i) => (i === 1 ? show(v) : boxes[i])), ops: labs, ask: { op: at }, hl: { box: 1 } } : slide(vals[at], o[0], o[1], { arrows: false, cap: false }),
      worked: (midOpen ? "The middle box is " + show(vals[1]) + ". " : "") + "From " + show(vals[at]) + " to " + show(vals[at + 1]) + " each digit moves " + places(PL[o[1]]) + " to the " + dir(o[0]) + ". The arrow is " + opt(o) + ".",
      workedPic: full, yes: chainText
    });
  }
  /* an empty box: forwards from the box before it, or backwards from the box after it */
  if (midOpen && at !== last) throw new Error("s2pow flow: with mid: false, hide the last box or an arrow");
  const back = at === 0;
  const fromI = back ? at + 1 : at - 1, o = back ? ops[at] : ops[at - 1], doOp = back ? INV[o[0]] : o[0];
  const twoStep = midOpen && at === last;
  const tip = twoStep ? "Do one arrow at a time. First " + show(vals[0]) + " " + opt(ops[0]) + ". Then " + opt(ops[1]) + "."
    : back ? "Work backwards from " + show(vals[fromI]) + ". The inverse of " + opt(o) + " is " + SYM[doOp] + " " + fmt(o[1]) + "."
      : "Follow the arrow: " + show(vals[fromI]) + " " + opt(o) + ". " + cap(rule(o[0], o[1]));
  return typed({
    q: "Complete the flow diagram. Write the missing number in the box.", sub: "Follow the arrows from left to right.",
    lines: ["Missing number: {0}"], answers: [vals[at]], fig: fig,
    slip: (i, v) => {
      const u = parse(v);
      if (twoStep && u === vals[1]) return "That is the middle box. Now do the second arrow: " + opt(ops[1]) + ".";
      if (back && u === vals[fromI]) return show(u) + " is the next box. Go backwards from it: do the inverse, " + SYM[doOp] + " " + fmt(o[1]) + ".";
      if (back && can(vals[fromI], o[0], o[1]) && u === apply(vals[fromI], o[0], o[1])) return "You went forwards. To go backwards along an arrow, do the inverse: " + SYM[doOp] + " " + fmt(o[1]) + ".";
      return slip(vals[fromI], doOp, o[1], v);
    },
    tips: [tip], tip: tip,
    hintPic: twoStep ? slide(vals[0], ops[0][0], ops[0][1], { ask: true, arrows: true }) : slide(vals[fromI], doOp, o[1], { ask: true, arrows: true }),
    worked: (twoStep ? chainText : back ? "Work backwards: " + sum(vals[fromI], doOp, o[1]) + ". Check: " + sum(vals[at], o[0], o[1]) + "." : sum(vals[fromI], o[0], o[1]) + ".") + " The missing number is " + show(vals[at]) + ".",
    workedPic: full, yes: chainText
  });
};

/* a balance: a × 100 ÷ 10 = [ ] ÷ 100 */
K.bal = function (d) {
  const a = need(d.a, "bal"), lv = flowVals(a, d.lops), L = lv[lv.length - 1], ro = d.rop, box = apply(L, INV[ro[0]], ro[1]);
  const left = show(a) + " " + d.lops.map(opt).join(" "), leftWork = lv.slice(1).map((v, i) => sum(lv[i], d.lops[i][0], d.lops[i][1])).join(", then ");
  const tip = "Work out the left side first. Both sides must be equal. Then work backwards: the inverse of " + opt(ro) + " is " + SYM[INV[ro[0]]] + " " + fmt(ro[1]) + ".";
  return typed({
    q: "Write the missing number to make this correct.", sub: "Both sides of = must have the same value.",
    /* "[ ] ÷ 100" (and the left side) stay together on a narrow phone (g4s2-nw, 036g css): the line breaks only after = */
    lines: ['<span class="g4s2-nw">' + left + ' =</span> <span class="g4s2-nw">{0} ' + opt(ro) + '</span>'], answers: [box],
    slip: (i, v) => {
      const u = parse(v);
      if (u === L) return show(L) + " is the value of the left side. The box " + opt(ro) + " must equal " + show(L) + ". Work backwards: " + show(L) + " " + SYM[INV[ro[0]]] + " " + fmt(ro[1]) + ".";
      if (can(L, ro[0], ro[1]) && u === apply(L, ro[0], ro[1])) return "You did " + show(L) + " " + opt(ro) + ". But the box comes before " + opt(ro) + ". Do the inverse: " + SYM[INV[ro[0]]] + " " + fmt(ro[1]) + ".";
      if (u === a) return "Check: is " + show(a) + " " + opt(ro) + " equal to " + show(L) + "? Work out the left side first.";
      return slip(L, INV[ro[0]], ro[1], v);
    },
    tips: [tip], tip: tip,
    hintPic: { k: "s2flow", boxes: [show(a)].concat(lv.slice(1).map(() => "")), ops: d.lops.map(opt) },
    worked: "Left side: " + leftWork + ". So the box " + opt(ro) + " = " + show(L) + ". Work backwards: " + sum(L, INV[ro[0]], ro[1]) + ".",
    workedPic: { k: "s2flow", boxes: lv.map(show), ops: d.lops.map(opt) },
    yes: left + " = " + show(L) + " and " + show(box) + " " + opt(ro) + " = " + show(L) + "."
  });
};

/* a short story in one or two steps */
K.story = function (d) {
  const vals = flowVals(need(d.n, "story"), d.ops), last = vals.length - 1, ans = vals[last], two = d.ops.length > 1, lo = d.ops[last - 1];
  const work = vals.slice(1).map((v, i) => sum(vals[i], d.ops[i][0], d.ops[i][1])).join(". Then ");
  const unit = d.unit ? " " + d.unit : "", pre = d.pre || "";
  return typed({
    q: d.text, lines: [pre + "{0}" + unit], answers: [ans], fig: d.fig || null, marks: two ? 2 : 1,
    slip: (i, v) => {
      const u = parse(v);
      if (two && u === vals[1]) return "That is " + (d.mid || "the first step") + ". Now do the second step: " + opt(d.ops[1]) + ".";
      if (two && u === vals[0]) return "The number must change. " + d.tip;
      if (two && can(vals[0], d.ops[1][0], d.ops[1][1]) && u === apply(vals[0], d.ops[1][0], d.ops[1][1])) return "You did only the second step, " + opt(d.ops[1]) + ". First do " + opt(d.ops[0]) + " to find " + (d.mid || "the first step") + ".";
      return slip(vals[last - 1], lo[0], lo[1], v) || (two ? slip(vals[0], d.ops[0][0], d.ops[0][1], v) : "");
    },
    tips: [d.tip], tip: d.tip,
    hintPic: d.pic || slide(vals[0], d.ops[0][0], d.ops[0][1], { ask: true, arrows: true }),
    worked: work + ". The answer is " + pre + show(ans) + unit + ".",
    workedPic: two ? { k: "s2flow", boxes: vals.map(show), ops: d.ops.map(opt) } : slide(vals[0], d.ops[0][0], d.ops[0][1]),
    yes: work + "."
  });
};

M.s2pow = function (d, mode) {
  const f = K[d.kind || "calc"];
  if (!f) throw new Error("s2pow: unknown kind " + d.kind);
  return f(d, mode);
};

/* for the pictures (047g), the pack (lightning questions) and the checks */
MX.s2 = { parse: parse, raw: raw, show: show, apply: apply, can: can, slip: slip, U: U };
})();
