/* g4-models-s1.js - Stop 1 (Decimals and place value): the models that work their answers out in code.
   All arithmetic is done in whole hundredths, so there is no float dust. A model throws when its data is wrong
   (a digit that is there twice, a "wrong" option that is really right): tools/keys.js then fails the pack.

   s1val    the value of one digit.   { n: '4.72', d: 7, as: 'words' | 'num', at, chart: true (show the chart), text }
            words: tick "seven tenths" among the other places; num: type 0.7
   s1read   read a number from a picture.   { c: [tens, ones, tenths, hundredths], pic: 'chart' | 'grid', text }
            a count may be more than 9 (2 ones and 14 tenths): the child regroups. The answer is the sum.
   s1build  draw counters in the chart (tool T.tools.s1build).   { n: '2.35', fix: { O: 1 }, text }
            fix: that place is given and locked, so the others must be regrouped (2.35 with only 1 one: 13 tenths)
   s1way    which is another way to make n?   { n: '3.52', right: [T, O, t, h], wrong: [[..], [..]], at }   tick
   s1near   tap the nearer whole number on the line (tool T.tools.s1near).   { n: '3.7', unit: 'kg', text }
   s1round  round to the nearest whole number, typed.   { n: '6.3', unit: 'cm', text, line: true (show the line) }
   s1ring   ring all the numbers that round to a whole number.   { to: 6, nums: [5.4, 5.5, ...], line: true }
   s1ends   the smallest and the largest one-decimal number that rounds to n.   { to: 7, want: 'both' | 'smallest' | 'largest', line: true } */
(function () {
"use strict";
const M = MX.M, arrange = MX.arrange;

const PK = ["T", "O", "t", "h"], UNIT = [1000, 100, 10, 1];
const NAME = ["tens", "ones", "tenths", "hundredths"], ONE = ["ten", "one", "tenth", "hundredth"];
const WORD = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* '4.72' -> 472 hundredths; 472 -> '4.72'; 340 -> '3.4'; 500 -> '5' */
const toH = n => Math.round(Number(n) * 100);
function fmtH(h, places) {
  const s = (h / 100).toFixed(2);
  if (places != null) return (h / 100).toFixed(places);
  return s.replace(/0$/, "").replace(/\.0$/, "");
}
/* '4.72' -> { d: [0, 4, 7, 2], has: [false, true, true, true] } (which places are written) */
function parts(n) {
  const s = String(n), at = s.indexOf("."), whole = at < 0 ? s : s.slice(0, at), frac = at < 0 ? "" : s.slice(at + 1);
  if (!/^\d{1,2}$/.test(whole) || !/^\d{0,2}$/.test(frac)) throw new Error("s1: bad number " + n);
  const w = ("00" + whole).slice(-2), f = (frac + "00").slice(0, 2);
  return { d: [+w[0], +w[1], +f[0], +f[1]], has: [whole.length > 1, true, frac.length > 0, frac.length > 1] };
}
const sum = c => c.reduce((a, v, i) => a + v * UNIT[i], 0);
/* [0, 2, 14, 7] -> "2 ones, 14 tenths and 7 hundredths" */
function sayParts(c) {
  const out = [];
  c.forEach((v, i) => { if (v) out.push(v + " " + (v === 1 ? ONE[i] : NAME[i])); });
  return out.join(", ").replace(/, ([^,]*)$/, " and $1");
}
/* the value of count v in place i, as a number: 14 tenths -> "1.4" */
const valOf = (v, i) => fmtH(v * UNIT[i]);
/* round a number of tenths to a whole number (halfway goes up) */
const roundT = t => Math.floor((t + 5) / 10);
const tOf = n => Math.round(Number(n) * 10);
const one = t => (t / 10).toFixed(1);

/* a typed task with one or more boxes (the same shape as M.ans gives) */
function typed(o) {
  const ans = o.ans, n = ans.length;
  return {
    q: o.q, sub: o.sub || "", marks: o.marks || n, lines: o.lines, fig: o.fig || null,
    blanks: ans.map(() => ({ len: o.len || 5, w: "mid", dec: true, neg: false })),   // 'mid': a short line, so a line with a box fits a phone
    check(r) {
      const v = r.v || [], ok = ans.map((a, i) => v[i] != null && v[i] !== "" && MX.eq(a, v[i]));
      if (ok.every(Boolean)) return { ok: true, parts: ok };
      const i = ok.indexOf(false), pre = n > 1 ? "Look at box " + (i + 1) + ". " : "";
      const slip = (o.slips || []).find(s => (s[2] == null || s[2] === i) && v[i] !== "" && v[i] != null && MX.eq(s[0], v[i]));
      return { ok: false, msg: pre + (slip ? slip[1] : o.tip), parts: ok };
    },
    hint: { pic: o.pic || null, step: o.tip },
    worked: { text: o.worked, pic: o.wpic || null },
    yes: o.yes || o.worked, key: ans.join(" ; "), fill: ans.map(String)
  };
}

/* ---------- the value of one digit ---------- */

M.s1val = function (d) {
  const p = parts(d.n), n = String(d.n);
  const at = p.d.map((x, i) => (p.has[i] && x === d.d ? i : -1)).filter(i => i >= 0);
  if (at.length !== 1) throw new Error("s1val: the digit " + d.d + " must be in " + n + " exactly once");
  const i = at[0], word = WORD[d.d] + " " + (d.d === 1 ? ONE[i] : NAME[i]), val = fmtH(d.d * UNIT[i]);
  const where = i < 2 ? "The " + d.d + " is to the left of the decimal point. Is it in the ones place or the tens place?"
    : "Start at the decimal point. The first place after it is tenths. The second place is hundredths.";
  const worked = "In " + n + " the " + d.d + " is in the " + NAME[i] + " place. Its value is " + word + ", or " + val + ".";
  const hl = { k: "s1chart", n: n, hl: PK[i] };
  const fig = d.chart ? { k: "s1chart", n: n } : null;
  if (d.as === "num") {
    const slips = [];
    if (i !== 1) slips.push([d.d, d.d + " is the digit. It is in the " + NAME[i] + " place, so its value is not " + d.d + "."]);
    [0, 1, 2, 3].forEach(j => { if (j !== i) slips.push([fmtH(d.d * UNIT[j]), "That is " + d.d + " " + (d.d === 1 ? ONE[j] : NAME[j]) + ". Look again: which place is the " + d.d + " in?"]); });
    return typed({
      q: d.text || "Write the value of the digit <b>" + d.d + "</b> in <b>" + n + "</b> as a number.",
      lines: ["The value of the " + d.d + " is {0}"], ans: [val], fig: fig, pic: hl, tip: where, worked: worked, slips: slips,
      yes: "The " + d.d + " is " + word + ". As a number that is " + val + "."
    });
  }
  const order = [i].concat([0, 1, 2, 3].filter(j => j !== i));
  const opts = arrange(order.map((j, k) => ({
    html: WORD[d.d] + " " + (d.d === 1 ? ONE[j] : NAME[j]), fig: null, ok: k === 0,
    why: k === 0 ? "" : p.has[j] ? "The " + NAME[j] + " digit of " + n + " is " + p.d[j] + ", not " + d.d + "." : n + " has no " + NAME[j] + " digit."
  })), d.at);
  return {
    q: d.text || "What is the value of the digit <b>" + d.d + "</b> in <b>" + n + "</b>?", sub: "Tick (✓) one box.", fig: fig, opts: opts,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || where }; },
    hint: { pic: hl, step: where }, worked: { text: worked }, yes: worked, key: word
  };
};

/* ---------- read a number from a picture ---------- */

M.s1read = function (d) {
  const c = d.c.slice(), total = sum(c), ans = fmtH(total), grid = d.pic === "grid";
  if (grid && (c[0] || c[1] > 3 || c[2] > 9 || c[3] > 9)) throw new Error("s1read: the grid shows at most 3 ones and single digits");
  const regroup = c.some(v => v > 9);
  const fig = grid ? { k: "s1grid", c: c.slice(1) } : { k: "s1chart", c: c, counters: true, tens: c[0] > 0, counts: regroup };
  const said = sayParts(c);
  const list = c.map((v, i) => (v ? v + " " + (v === 1 ? ONE[i] : NAME[i]) + " = " + valOf(v, i) : null)).filter(Boolean);
  const worked = (grid ? "A whole square is 1. A full column is 1 tenth. A small square is 1 hundredth. " : "") +
    cap(list.join(", ")) + ". " + (list.length > 1 ? list.map(x => x.split(" = ")[1]).join(" + ") + " = " + ans + "." : "The number is " + ans + ".");
  const slips = [];
  if (regroup) {
    const side = String(c[0] ? c[0] : "") + String(c[1]) + "." + String(c[2]) + (c[3] ? String(c[3]) : "");
    if (!MX.eq(side, ans)) slips.push([side, "You wrote the counts side by side. 10 " + (c[2] > 9 ? "tenths make 1 one" : "hundredths make 1 tenth") + ". Regroup first."]);
  }
  if (c[2] === 0 && c[3] > 0) slips.push([fmtH(c[0] * 1000 + c[1] * 100 + c[3] * 10), "There are no tenths. Write 0 in the tenths place."]);
  if (c[3] === 0 && c[2] > 0 && c[2] < 10) slips.push([fmtH(c[0] * 1000 + c[1] * 100 + c[2]), "These are tenths, not hundredths. Tenths come straight after the decimal point."]);
  if (c[2] > 0 && c[3] > 0 && c[2] < 10 && c[3] < 10) slips.push([fmtH(c[0] * 1000 + c[1] * 100 + c[3] * 10 + c[2]), "You swapped the tenths and the hundredths. Tenths come first."]);
  const tip = regroup ? "Count each place. 10 tenths make 1 one, and 10 hundredths make 1 tenth. Regroup, then write the number."
    : grid ? "A whole square is 1. Count the full columns: they are tenths. Count the small squares: they are hundredths."
    : "Count the counters in each place. Write one digit for each place. Do not forget the decimal point.";
  return typed({
    q: d.text || (grid ? "One whole square is <b>1</b>. How much is shaded? Write the decimal." : regroup ? "Look at the counters. Regroup, then write the number." : "What number does the place value chart show?"),
    lines: ["{0}"], ans: [ans], fig: fig, tip: tip, worked: worked, slips: slips, len: 6,
    pic: grid ? { k: "s1chart", c: c, counters: true, counts: true } : regroup ? null : { k: "s1chart", c: c, counters: true, counts: true, tens: c[0] > 0 },
    wpic: { k: "s1chart", n: fmtH(total, total % 10 ? 2 : total % 100 ? 1 : 0), tens: total >= 1000 },
    yes: cap(said) + " make " + ans + "."
  });
};

/* ---------- draw counters in the chart ---------- */

M.s1build = function (d) {
  const p = parts(d.n), n = String(d.n), total = toH(d.n), fix = d.fix || null;
  const lock = [false, false, false, false], right = p.d.slice(), start = [0, 0, 0, 0];
  let q, tip, worked;
  if (fix) {
    const k = Object.keys(fix)[0], i = PK.indexOf(k), have = fix[k];
    if (i < 0 || i > 2 || have < 0 || have >= p.d[i]) throw new Error("s1build: fix must be a smaller count of tens, ones or tenths");
    const moved = right[i] - have;                    // how many of place i go to the next place
    if (moved <= 0 || moved * 10 + right[i + 1] > 20) throw new Error("s1build: the regrouped count must fit in the chart (20)");
    right[i] = have; right[i + 1] += moved * 10; lock[i] = true; start[i] = have;
    for (let j = 0; j < i; j++) { lock[j] = true; start[j] = right[j]; }
    q = d.text || "Show <b>" + n + "</b> with only <b>" + have + "</b> " + (have === 1 ? ONE[i] : NAME[i]) + ". Draw the other counters.";
    tip = "1 " + ONE[i] + " is the same as 10 " + NAME[i + 1] + ". You have " + moved + " " + (moved === 1 ? ONE[i] : NAME[i]) + " fewer, so draw " + (moved * 10) + " more " + NAME[i + 1] + ".";
    worked = n + " is " + sayParts(p.d) + ". Regroup " + moved + " " + (moved === 1 ? ONE[i] : NAME[i]) + " as " + (moved * 10) + " " + NAME[i + 1] + ": " + sayParts(right) + ".";
  } else {
    q = d.text || "Draw counters to show <b>" + n + "</b> in the place value chart.";
    tip = "Look at each digit of " + n + ". Draw that many counters in its place.";
    worked = n + " is " + sayParts(p.d) + ".";
  }
  if (sum(right) !== total) throw new Error("s1build: key does not make " + n);
  return {
    q: q, sub: "Tap <b>+</b> to draw a counter. Tap <b>−</b> to rub one out.",
    ui: { k: "s1build", start: start, lock: lock, tens: p.d[0] > 0 }, right: { b: right },
    doLine: { en: "Tap *+* to draw counters. Then tap *Check*.", vi: "Bấm *+* để vẽ hạt tính. Rồi bấm *Check* (Kiểm tra)." },
    check(r) {
      const b = r.b || [0, 0, 0, 0], got = sum(b);
      if (got === total) return { ok: true, note: cap(sayParts(b)) + " make " + n + "." };
      return { ok: false, msg: "Your chart shows " + sayParts(b) + ". That makes " + fmtH(got) + (got < total ? ". You need more." : ". That is too much.") + " " + (fix ? tip : "Check each place.") };
    },
    hint: { pic: fix ? null : { k: "s1chart", n: n }, step: tip },
    worked: { text: worked }, yes: worked, key: right.join("-"),
    given: r => (r.b || []).join("-")
  };
};

/* ---------- which is another way to make n? ---------- */

M.s1way = function (d) {
  const total = toH(d.n), n = String(d.n), four = c => { c = c.slice(); while (c.length < 4) c.unshift(0); return c; };
  const good = four(d.right), bad = d.wrong.map(four);
  if (sum(good) !== total) throw new Error("s1way: the right option makes " + fmtH(sum(good)) + ", not " + n);
  bad.forEach(c => { if (sum(c) === total) throw new Error("s1way: a wrong option also makes " + n); });
  const opts = arrange([good].concat(bad).map((c, k) => ({
    html: sayParts(c), fig: null, ok: k === 0,
    why: k === 0 ? "" : cap(sayParts(c)) + " make " + fmtH(sum(c)) + ", not " + n + "."
  })), d.at);
  const list = good.map((v, i) => (v ? valOf(v, i) : null)).filter(Boolean);
  const worked = cap(good.map((v, i) => (v ? v + " " + (v === 1 ? ONE[i] : NAME[i]) + " = " + valOf(v, i) : null)).filter(Boolean).join(", ")) + ". " + list.join(" + ") + " = " + n + ".";
  const tip = "Work out each part as a number. 10 tenths make 1 one. 10 hundredths make 1 tenth. Then add the parts.";
  return {
    q: d.text || "Which is another way to make <b>" + n + "</b>?", sub: "Tick (✓) one box.", opts: opts,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || tip }; },
    hint: { pic: { k: "s1chart", c: good, counters: true, counts: true, tens: good[0] > 0 }, step: tip },
    worked: { text: worked }, yes: worked, key: sayParts(good)
  };
};

/* ---------- rounding ---------- */

function roundFacts(n) {
  const t = tOf(n), lo = Math.floor(t / 10), dig = t - lo * 10, to = roundT(t);
  if (dig === 0) throw new Error("s1: " + n + " is already a whole number");
  const why = dig === 5 ? one(t) + " is exactly halfway between " + lo + " and " + (lo + 1) + ". Halfway numbers round up."
    : "The tenths digit is " + dig + ". " + (dig < 5 ? dig + " is less than 5, so round down." : dig + " is 5 or more, so round up.");
  const far = dig === 5 ? "" : " It is " + Math.min(dig, 10 - dig) + " " + (Math.min(dig, 10 - dig) === 1 ? "tenth" : "tenths") + " from " + to + " and " + Math.max(dig, 10 - dig) + " tenths from " + (to === lo ? lo + 1 : lo) + ".";
  return { t: t, lo: lo, dig: dig, to: to, other: to === lo ? lo + 1 : lo, why: why, far: far, s: one(t) };
}

M.s1near = function (d) {
  const f = roundFacts(d.n), u = d.unit ? " " + d.unit : "";
  const worked = f.s + u + " rounds to " + f.to + u + ". " + f.why + f.far;
  return {
    q: d.text || (f.dig === 5 ? "<b>" + f.s + "</b> is halfway. Which whole number does it round to?" : "Which whole number is <b>" + f.s + "</b> nearer to?"),
    sub: "Tap the whole number it rounds to.",
    ui: { k: "s1near", lo: f.lo, n: f.s }, right: { choice: f.to },
    doLine: { en: "Tap the whole number it rounds to. Then tap *Check*.", vi: "Bấm vào số tự nhiên là kết quả làm tròn. Rồi bấm *Check* (Kiểm tra)." },
    check(r) { return r.choice === f.to ? { ok: true, note: worked } : { ok: false, msg: f.why + (f.dig === 5 ? "" : " Look at the line: which end is nearer?") }; },
    hint: { pic: null, step: "Look at the tenths digit of " + f.s + ". 0, 1, 2, 3, 4 round down. 5, 6, 7, 8, 9 round up." },
    worked: { text: worked }, yes: worked, key: String(f.to),
    given: r => String(r.choice)
  };
};

M.s1round = function (d) {
  const f = roundFacts(d.n), u = d.unit ? " " + d.unit : "";
  const worked = f.s + u + " rounds to " + f.to + u + ". " + f.why;
  return typed({
    q: d.text || "Round <b>" + f.s + "</b> to the nearest whole number.",
    lines: ["{0}" + u], ans: [String(f.to)], fig: d.line ? { k: "s1line", lo: f.lo, n: f.s } : null,
    pic: { k: "s1line", lo: f.lo, n: f.s, show: true },
    tip: "Look at the tenths digit of " + f.s + ". 0, 1, 2, 3, 4 round down. 5, 6, 7, 8, 9 round up.",
    worked: worked, yes: worked, len: 4,
    slips: [[f.other, f.why + " " + f.s + " does not round to " + f.other + "."], [f.s, "That is the number itself. A whole number has no tenths: choose " + f.lo + " or " + (f.lo + 1) + "."],
      [f.dig, "That is the tenths digit. Use it to decide: " + f.lo + " or " + (f.lo + 1) + "?"]]
  });
};

M.s1ring = function (d) {
  const to = d.to, nums = d.nums.slice(), good = nums.filter(v => roundT(tOf(v)) === to).sort((a, b) => a - b);
  if (!good.length || good.length === nums.length) throw new Error("s1ring: some numbers, not all, must round to " + to);
  if (d.good && d.good.slice().sort((a, b) => a - b).join() !== good.join()) throw new Error("s1ring: good in the data is not what the rule gives: " + good);
  const say = v => (Number.isInteger(v) ? String(v) : one(tOf(v)));
  const list = good.map(say).join(", ").replace(/, ([^,]*)$/, " and $1");
  const tip = "Round each number. Look at its tenths digit: 5 or more rounds up, less than 5 rounds down.";
  const worked = "The numbers that round to " + to + " are " + list + ". " + nums.filter(v => good.indexOf(v) < 0).map(v => say(v) + " rounds to " + roundT(tOf(v))).join(". ") + ".";
  return {
    q: d.text || "Put a ring around <b>all</b> the numbers that round to <b>" + to + "</b>, to the nearest whole number.",
    sub: "Tap a number to put a ring around it. Tap it again to rub the ring out.",
    ui: { k: "pickall", nums: nums }, right: { picks: good }, fig: d.line ? { k: "s1line", lo: to - 1, hi: to + 1 } : null,
    check(r) {
      const picks = r.picks || [], bad = picks.filter(v => good.indexOf(v) < 0), miss = good.filter(v => picks.indexOf(v) < 0);
      if (!bad.length && !miss.length) return { ok: true };
      if (bad.length) return { ok: false, msg: say(bad[0]) + " does not fit: it rounds to " + roundT(tOf(bad[0])) + ".", parts: bad };
      return { ok: false, msg: "Your " + (picks.length === 1 ? "ring is" : "rings are") + " right. But there are more. Round every number.", parts: [] };
    },
    hint: { pic: { k: "s1line", lo: to - 1, hi: to + 1, zone: to }, step: tip },
    worked: { text: worked }, yes: "The numbers that round to " + to + " are " + list + ".", key: good.map(say).join(" ; ")
  };
};

M.s1ends = function (d) {
  const to = d.to, small = to * 10 - 5, large = to * 10 + 4, want = d.want || "both";
  if (roundT(small) !== to || roundT(small - 1) === to || roundT(large) !== to || roundT(large + 1) === to) throw new Error("s1ends: key");
  const both = want === "both", ans = both ? [one(small), one(large)] : [one(want === "smallest" ? small : large)];
  const sSlips = i => [[one(small - 1), one(small - 1) + " rounds down to " + (to - 1) + ". Halfway numbers round up: try the next tenth.", i],
    [to, to + " does round to " + to + ". But smaller numbers do too: " + one(to * 10 - 1) + ", " + one(to * 10 - 2) + " ... Where do they stop?", i],
    [one(to * 10 - 9), one(to * 10 - 9) + " rounds down to " + (to - 1) + ". Its tenths digit is 1.", i],
    [one(large), "That is the largest one. Now find the smallest.", i]];
  const lSlips = i => [[one(large + 1), one(large + 1) + " is halfway to " + (to + 1) + ". Halfway numbers round up to " + (to + 1) + ".", i],
    [one(large + 5), one(large + 5) + " rounds up to " + (to + 1) + ". Its tenths digit is 9.", i],
    [to, to + " does round to " + to + ". But larger numbers do too: " + one(to * 10 + 1) + ", " + one(to * 10 + 2) + " ... Where do they stop?", i],
    [one(small), "That is the smallest one. Now find the largest.", i]];
  const worked = "The numbers with one decimal place that round to " + to + " go from " + one(small) + " to " + one(large) + ". " + one(small) + " is halfway, so it rounds up to " + to + ". " + one(large + 1) + " is halfway too, but it rounds up to " + (to + 1) + ".";
  return typed({
    q: d.text || (both ? "A number with one decimal place rounds to <b>" + to + "</b>. Write the <b>smallest</b> and the <b>largest</b> number it can be."
      : "What is the <b>" + want + "</b> number with one decimal place that rounds to <b>" + to + "</b>?"),
    lines: both ? ["smallest: {0}", "largest: {1}"] : ["{0}"], ans: ans,
    fig: d.line ? { k: "s1line", lo: to - 1, hi: to + 1 } : null,
    pic: { k: "s1line", lo: to - 1, hi: to + 1, zone: to },
    wpic: { k: "s1line", lo: to - 1, hi: to + 1, zone: to, ends: true },
    tip: "Halfway numbers round up. Which tenths digits round up to " + to + "? Which round down to " + to + "?",
    worked: worked, slips: both ? sSlips(0).concat(lSlips(1)) : want === "smallest" ? sSlips(0) : lSlips(0),
    yes: both ? "The smallest is " + one(small) + " and the largest is " + one(large) + "." : "The " + want + " number is " + ans[0] + "."
  });
};
})();
