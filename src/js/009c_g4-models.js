/* g4-models.js - Grade 4 (Stage 5): the shared question models. Loaded after the Maths v2 models (MX).

   Three generic models carry most Grade 4 questions; a stop adds its own models in 009d_g4-models-sN.js
   when a question needs its numbers worked out in code (MX.M.name = function (d, mode) { return task; }).

   ans    typed answers (the number pad). The answers are in the data AND are worked out again by tools/keys.js
          from chk (an arithmetic string per box), so a wrong key cannot ship.
          { type: 'ans', q, lines: ['3.4 + 2.7 = {0}'], ans: [6.1], chk: ['3.4+2.7'],
            dec: true (the pad gets a decimal point), neg: true (a minus sign), len: 6, w: 'big' | 'box',
            fig: PIC, tip: 'the hint in words', pic: PIC (the hint picture), worked: 'the worked answer',
            yes: 'one sentence that says the right answer', slips: [[wrong value, 'what went wrong', box index (optional)], ...] }
          An answer '<', '>' or '=' gives a sign box. marks = the number of boxes (or d.marks).
   tick   tick one box. The FIRST option in the data is the right one; `at` says where it is shown (0 to n - 1).
          { type: 'tick', q, sub, opts: [{ t: 'text', fig: PIC, why: 'why this wrong option is wrong' }], at: 2,
            letters: true, fig, tip, pic, worked, yes }
   ring   put a ring around ALL the numbers that fit. good = the right ones (checked by tools/keys.js with rule).
          { type: 'ring', q, nums: [..], good: [..], rule: 'square' | 'prime' | 'composite' | 'triangular' | 'even' | 'odd'
            | { mult: 7 } | { factorOf: 24 } (optional but wanted), why: { 15: '15 = 3 × 5' }, tip, pic, worked }
   Also ready from Maths v2 and good for Grade 4 as they are: claim (correct or incorrect, then the reason), chain
   (a flow diagram of operations), eqbox (a box in a calculation), seqnext, seqgap, seqrule, seqnth, sqnth, sqval,
   sqtick, jump, temp, thermoread, cmp, order (also below zero). Read them in 009b_06-models.js before writing a new one.

   G4 helpers: MX.dp(n, places) "3.40"; MX.num('3.4') 3.4; MX.eq(a, b) equal as numbers; MX.dfmt(n) "1,204.5" / "−3.2". */
(function () {
"use strict";
const M = MX.M, fmt = MX.fmt, LET = MX.LET;

const num = s => (s === "" || s == null ? NaN : Number(String(s).replace(/,/g, "").replace("−", "-")));
const eq = (a, b) => Math.abs(num(a) - num(b)) < 1e-9;
const dp = (n, k) => Number(n).toFixed(k);
/* a number the way the paper prints it: a thousands comma, a real minus sign, no float dust (0.1 + 0.2) */
function dfmt(n) {
  if (typeof n === "string" && /^[<>=]$/.test(n)) return n;
  const x = Math.round(Number(n) * 1e6) / 1e6, neg = x < 0, s = String(Math.abs(x)), at = s.indexOf(".");
  const whole = at < 0 ? s : s.slice(0, at), rest = at < 0 ? "" : s.slice(at);
  return (neg ? "−" : "") + fmt(whole) + rest;
}
MX.num = num; MX.eq = eq; MX.dp = dp; MX.dfmt = dfmt;

const isSym = a => typeof a === "string" && /^[<>=]$/.test(a);
const show = (a, d) => (isSym(a) ? a : typeof a === "string" ? a : dfmt(a));

M.ans = function (d) {
  const ans = d.ans, n = ans.length;
  const blanks = ans.map((a, i) => (isSym(a) ? { sym: true, len: 1, w: "box" }
    : { len: (d.lens && d.lens[i]) || d.len || 6, w: d.w || "big", neg: !!d.neg, dec: !!d.dec }));
  const right = (a, v) => (isSym(a) ? v === a : v !== "" && eq(a, v));
  const fill = ans.map(a => (isSym(a) ? a : String(typeof a === "string" ? a : Math.round(a * 1e6) / 1e6)));
  const said = d.yes || d.worked || ("The answer is " + ans.map(a => show(a)).join(" and ") + ".");
  return {
    q: d.q, sub: d.sub || "", marks: d.marks || n,
    lines: d.lines, blanks: blanks, fig: d.fig || null,
    check(r) {
      const parts = ans.map((a, i) => right(a, (r.v || [])[i] == null ? "" : r.v[i]));
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      const i = parts.indexOf(false), v = (r.v || [])[i], pre = n > 1 ? "Look at box " + (i + 1) + ". " : "";
      const slip = (d.slips || []).find(s => (s[2] == null || s[2] === i) && (isSym(s[0]) ? v === s[0] : eq(s[0], v)));   /* s[2]: the box it is for (optional) */
      return { ok: false, msg: pre + (slip ? slip[1] : d.tip || "Check your working, one step at a time."), parts: parts };
    },
    hint: { pic: d.pic || null, step: d.tip || "Work it out one step at a time." },
    worked: { text: d.worked || said },
    yes: said, key: ans.map(a => show(a)).join(" ; "), fill: fill
  };
};

M.tick = function (d) {
  const opts = MX.arrange(d.opts.map((o, i) => ({ html: o.t || "", fig: o.fig || null, ok: i === 0, why: o.why || "" })), d.at);
  const good = opts.findIndex(o => o.ok);
  const said = d.yes || d.worked || "";
  return {
    q: d.q, sub: d.sub || "Tick (✓) one box.", letters: !!d.letters, fig: d.fig || null,
    opts: opts,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || d.tip || "Look again at each one." }; },
    hint: { pic: d.pic || null, step: d.tip || "Check each one in turn." },
    worked: { text: d.worked || said },
    yes: said, key: (d.letters ? LET[good] + ": " : "") + (d.opts[0].t || d.opts[0].key || "the picture")
  };
};

/* the rules tools/keys.js (and this model, for its feedback) can work out again */
const isPrime = v => { if (v < 2) return false; for (let k = 2; k * k <= v; k++) if (v % k === 0) return false; return true; };
const RULES = {
  square: v => v > 0 && Number.isInteger(Math.sqrt(v)),
  prime: isPrime,
  composite: v => v > 3 && !isPrime(v),
  triangular: v => v > 0 && Number.isInteger((Math.sqrt(8 * v + 1) - 1) / 2),
  even: v => v % 2 === 0,
  odd: v => Math.abs(v % 2) === 1
};
function ruleFn(rule) {
  if (!rule) return null;
  if (typeof rule === "string") return RULES[rule] || null;
  if (rule.mult) return v => v % rule.mult === 0;
  if (rule.factorOf) return v => v > 0 && rule.factorOf % v === 0;
  return null;
}
MX.ruleFn = ruleFn; MX.isPrime = isPrime;

M.ring = function (d) {
  const good = d.good.slice().sort((x, y) => x - y), why = d.why || {};
  const list = good.map(v => dfmt(v)).join(", ").replace(/, ([^,]*)$/, " and $1");
  return {
    q: d.q, sub: d.sub || "Tap a number to put a ring around it. Tap it again to rub the ring out.",
    ui: { k: "pickall", nums: d.nums }, right: { picks: good }, fig: d.fig || null,
    check(r) {
      const picks = r.picks || [], bad = picks.filter(v => good.indexOf(v) < 0), miss = good.filter(v => picks.indexOf(v) < 0);
      if (!bad.length && !miss.length) return { ok: true };
      if (bad.length) return { ok: false, msg: why[bad[0]] ? dfmt(bad[0]) + " does not fit: " + why[bad[0]] + "." : dfmt(bad[0]) + " does not fit. " + (d.tip || "Check it again."), parts: bad };
      return { ok: false, msg: "Your " + (picks.length === 1 ? "ring is" : "rings are") + " right. But there are more. Check every number.", parts: [] };
    },
    hint: { pic: d.pic || null, step: d.tip || "Check every number in turn." },
    worked: { text: d.worked || ("The numbers that fit are " + list + ".") },
    yes: d.yes || ("The numbers that fit are " + list + "."), key: good.map(v => dfmt(v)).join(" ; ")
  };
};
})();
