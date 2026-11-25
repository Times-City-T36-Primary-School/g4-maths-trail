/* g4-models-s4.js - the question models of Stop 4, Fractions (Grade 4, Stage 5). Every answer is worked out here from
   the numbers in the data; a model throws when its data cannot be right (a fraction of an amount that is not whole).

   s4of     a proper fraction of an amount.   { n: 3, d: 4, of: 20, unit, text, line, bar: true }  or "Calculate." with
            { items: [[n, d, of], [n, d, of]] }
   s4left   two children each give away (use, read ...) a fraction of their things; what is LEFT?
            { text, unit: 'marbles', gone: 'gave away', left: 'left', a: { who, of, n, d }, b: { who, of, n, d },
              ask: 'left' (two boxes) | 'who' (who has more left? tick), at }
   s4div    a fraction is a division.  form 'share': { a: 3, b: 4, one: 'pizza', many: 'pizzas', kind: 'pizza' | 'cake', text }
            form 'frac': 7 ÷ 10 = [ ]/[ ]     form 'div': 1/4 = [ ] ÷ [ ]
   s4whole  find the whole from a part.  { n: 3, d: 4, part: 15, text, line, bar: true }
   s4mix    improper fraction <-> mixed number.  { n: 7, d: 4, to: 'mixed' | 'improper',
              show: 'num' (default) | 'circles' | 'bars' | 'line' (the number is only in the picture), max: 3, pic: true }
   s4pick   tick the picture of a number, or the number of a picture.
            { n: 7, d: 4, ask: 'pic' | 'num', kind: 'circles' | 'bars' | 'line', as: 'mixed' | 'improper',
              wrong: [[5, 4], [7, 3]] (for 'num' also [n, d, 'mixed' | 'improper']), max, at }
   s4which  tick the one fraction that fits.  { ask: 'gt1' | 'lt1' | 'eq1' | 'whole', fracs: [[5, 3], [3, 5], [2, 7]], at }

   Helpers for the pack: MX.s4F(n, d) a real fraction in HTML; MX.s4frac(text) every a/b in a text as a real fraction;
   MX.s4deep(object) the same for every string of a part of the pack; MX.s4fact(fact) is a claim's fact true?
   fact = { l, rel: '<' | '>' | '=', r } or { all: [facts] }; a value is a number, [n, d], { of: [n, d, amount] },
   { left: [n, d, amount] } (what is left after n/d is taken), { mix: [w, n, d] } or { div: [a, b] }. */
(function () {
"use strict";
const M = MX.M, LET = MX.LET, arrange = MX.arrange;
const fmt = x => MX.fmt(x);
const X = "×", D = "÷", MINUS = "−";
const NAMES = { 2: "half", 3: "third", 4: "quarter", 5: "fifth", 6: "sixth", 7: "seventh", 8: "eighth", 9: "ninth", 10: "tenth", 12: "twelfth", 100: "hundredth" };
const plural = d => (d === 2 ? "halves" : (NAMES[d] || d + "th") + "s");
const some = (k, d) => k + " " + (k === 1 ? (NAMES[d] || d + "th") : plural(d));
const need = (ok, msg) => { if (!ok) throw new Error("Stop 4 data: " + msg); return true; };
const int = s => (s === "" || s == null || !/^\d+$/.test(String(s)) ? NaN : Number(s));

/* ---------- fractions on screen ---------- */
const F = (n, d) => '<span class="g4s4-frac"><span class="g4s4-n">' + n + '</span><span class="g4s4-sl">/</span><span class="g4s4-d">' + d + "</span></span>";
const MIX = (w, n, d) => '<span class="g4s4-mix">' + w + " " + F(n, d) + "</span>";   /* the space keeps "1 3/4" right in plain text */
const NUM = (n, d, as) => (as === "mixed" && n > d && n % d ? MIX(Math.floor(n / d), n % d, d) : F(n, d));
const TXT = (n, d, as) => (as === "mixed" && n > d && n % d ? Math.floor(n / d) + " " + (n % d) + "/" + d : n + "/" + d);
const FB = (i, j) => '<span class="g4s4-fbox">{' + i + '}<span class="g4s4-fline"></span>{' + j + "}</span>";      /* two answer boxes, one over the other */
const MB = (i, j, k) => '<span class="g4s4-mbox">{' + i + "}" + FB(j, k) + "</span>";                                  /* a whole number, then a fraction */
const BOX = { len: 3, w: "fr" };
const RX = /(\d+) (\d+)\/(\d+)|(\d+)\/(\d+)/g;
function s4frac(s) {
  return String(s).split(/(<[^>]*>)/).map(part => (part.charAt(0) === "<" ? part
    : part.replace(RX, (m, w, a, b, c, d) => (w != null ? MIX(w, a, b) : F(c, d))))).join("");
}
const SKIP = { type: 1, chk: 1, fact: 1, k: 1, who: 1, kind: 1, rule: 1, art: 1, id: 1 };
function s4deep(o) {
  if (Array.isArray(o)) { o.forEach((x, i) => { if (typeof x === "string") o[i] = s4frac(x); else s4deep(x); }); return o; }
  if (o && typeof o === "object") Object.keys(o).forEach(k => { if (SKIP[k]) return; if (typeof o[k] === "string") o[k] = s4frac(o[k]); else s4deep(o[k]); });
  return o;
}
MX.s4F = F; MX.s4frac = s4frac; MX.s4deep = s4deep;

/* ---------- is a fact true? (exact, with whole numbers) ---------- */
function val(e) {
  if (typeof e === "number") return [e, 1];
  if (Array.isArray(e)) return [e[0], e[1]];
  if (e && e.of) return [e.of[0] * e.of[2], e.of[1]];
  if (e && e.left) return [(e.left[1] - e.left[0]) * e.left[2], e.left[1]];
  if (e && e.mix) return [e.mix[0] * e.mix[2] + e.mix[1], e.mix[2]];
  if (e && e.div) return [e.div[0], e.div[1]];
  need(false, "a fact needs values"); return null;
}
function s4fact(f) {
  need(f, "a claim needs a fact");
  if (f.all) return f.all.every(s4fact);
  const a = val(f.l), b = val(f.r), x = a[0] * b[1], y = b[0] * a[1];
  need(a[1] > 0 && b[1] > 0 && /^[<>=]$/.test(f.rel), "bad fact");
  return f.rel === "<" ? x < y : f.rel === ">" ? x > y : x === y;
}
MX.s4fact = s4fact;

/* ---------- a proper fraction of an amount ---------- */
M.s4of = function (dd) {
  const items = dd.items || [[dd.n, dd.d, dd.of]], many = items.length > 1, unit = dd.unit ? " " + dd.unit : "";
  items.forEach(it => need(it[0] > 0 && it[0] < it[1] && it[2] % it[1] === 0, "s4of " + it.join("/")));
  const ans = items.map(it => it[2] / it[1] * it[0]);
  const n0 = items[0][0], d0 = items[0][1], N0 = items[0][2];
  const slip = (it, v) => {
    const n = it[0], d = it[1], N = it[2], one = N / d, a = one * n;
    if (n > 1 && v === one) return "You found one part: " + fmt(N) + " " + D + " " + d + " = " + fmt(one) + ". You need " + n + " parts. Now multiply by " + n + ".";
    if (n > 1 && N % n === 0 && v === N / n) return "You divided by the top number. Divide by the bottom number, " + d + ". Then multiply by " + n + ".";
    if (v === N - a) return "That is the other part. " + F(n, d) + " means " + n + " of the " + d + " equal parts.";
    if (v === N * n) return "You multiplied by " + n + ", but you did not divide. First divide " + fmt(N) + " by " + d + ".";
    if (v >= N) return F(n, d) + " of " + fmt(N) + " is less than " + fmt(N) + ". Divide by " + d + " first.";
    return n === 1 ? "The bottom number tells you to divide. Divide " + fmt(N) + " by " + d + "." : "Divide " + fmt(N) + " by " + d + " to find one part. Then multiply by " + n + ".";
  };
  const work = it => { const one = it[2] / it[1]; return fmt(it[2]) + " " + D + " " + it[1] + " = " + fmt(one) + (it[0] > 1 ? ". " + fmt(one) + " " + X + " " + it[0] + " = " + fmt(one * it[0]) : ""); };
  return {
    q: dd.text ? s4frac(dd.text) : many ? "Calculate." : "Calculate " + F(n0, d0) + " of <b>" + fmt(N0) + "</b>.", marks: items.length,
    fig: dd.bar ? { k: "s4bar", parts: d0, shade: n0, whole: N0, part: "?" } : null,
    lines: items.map((it, i) => (many ? "<i>(" + "abc"[i] + ")</i> " : "") + (dd.line && !many ? s4frac(dd.line) : F(it[0], it[1]) + " of " + fmt(it[2]) + " = {" + i + "}" + unit)),
    blanks: items.map(() => ({ len: 5, w: "mid" })),
    check(r) {
      const v = items.map((it, i) => int((r.v || [])[i])), pt = v.map((x, i) => x === ans[i]);
      if (pt.every(Boolean)) return { ok: true, parts: pt };
      const i = pt.indexOf(false);
      return { ok: false, msg: (many ? "Look at (" + "abc"[i] + "). " : "") + slip(items[i], v[i]), parts: pt };
    },
    hint: { pic: { k: "s4bar", parts: d0, shade: n0, whole: N0, each: "?", part: "?" },
      step: n0 === 1 ? "The bottom number tells you to divide. " + fmt(N0) + " " + D + " " + d0 + "." : "Divide by the bottom number to find one part. Then multiply by the top number." },
    worked: { text: items.map((it, i) => (many ? "(" + "abc"[i] + ") " : "") + work(it)).join(". ") + ".", pic: { k: "s4bar", parts: d0, shade: n0, whole: N0, each: N0 / d0, part: ans[0] } },
    yes: items.map((it, i) => F(it[0], it[1]) + " of " + fmt(it[2]) + " = " + fmt(ans[i])).join(" and ") + ".",
    key: ans.map(fmt).join(" ; "), fill: ans.map(String)
  };
};

/* ---------- two children: what is left, and who has more left? ---------- */
M.s4left = function (dd) {
  const kids = [dd.a, dd.b].map(k => {
    need(k.n > 0 && k.n < k.d && k.of % k.d === 0, "s4left " + k.who);
    const gone = k.of / k.d * k.n;
    return { who: k.who, of: k.of, n: k.n, d: k.d, one: k.of / k.d, gone: gone, left: k.of - gone };
  });
  const unit = dd.unit, gone = dd.gone || "gave away", leftW = dd.left || "left";
  const work = k => k.who + ": " + F(k.n, k.d) + " of " + k.of + " is " + k.gone + ". " + k.of + " " + MINUS + " " + k.gone + " = " + k.left + ".";
  const bars = full => kids.map(k => ({ k: "s4bar", parts: k.d, shade: k.d - k.n, from: "end", whole: k.of, each: full ? k.one : "?", part: full ? k.left : "?", frac: false }));
  const tip = "First find the part each child " + gone + ". Then subtract it from the whole.";
  if (dd.ask === "who") {
    need(kids[0].left !== kids[1].left, "s4left: the two children have the same left");
    const win = kids[0].left > kids[1].left ? kids[0] : kids[1], lose = win === kids[0] ? kids[1] : kids[0];
    const opts = arrange([
      { html: win.who, ok: true, why: "" },
      { html: lose.who, ok: false, why: "Check " + lose.who + ": " + F(lose.n, lose.d) + " of " + lose.of + " is " + lose.gone + ", so " + lose.left + " are " + leftW + ". Now work out " + win.who + "'s." },
      { html: "They have the same.", ok: false, why: lose.who + " has " + lose.left + " " + leftW + ". Now work out how many " + win.who + " has." }], dd.at);
    return {
      q: s4frac(dd.text) + " Who has more " + unit + " " + leftW + "?", sub: "Tick (✓) one box.", opts: opts,
      check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || tip }; },
      hint: { pic: bars(false), step: tip + " Compare the two answers." },
      worked: { text: work(kids[0]) + " " + work(kids[1]) + " " + win.left + " is more than " + lose.left + ", so " + win.who + " has more " + leftW + ".", pic: bars(true) },
      yes: win.who + " has " + win.left + " " + leftW + " and " + lose.who + " has " + lose.left + ".", key: win.who
    };
  }
  const slip = (k, v) => {
    if (v === k.gone) return "That is how many " + unit + " " + k.who + " " + gone + ". Subtract it from " + k.of + " to find how many are " + leftW + ".";
    if (v === k.one) return "That is one part: " + k.of + " " + D + " " + k.d + " = " + k.one + ". " + k.who + " " + gone + " " + k.n + (k.n === 1 ? " part." : " parts.") + " How many parts are " + leftW + "?";
    if (v === k.of) return k.who + " started with " + k.of + ". Some are gone now. " + tip;
    return "Find " + F(k.n, k.d) + " of " + k.of + ". Then subtract it from " + k.of + ".";
  };
  return {
    q: s4frac(dd.text) + " How many " + unit + " does each child have " + leftW + "?", marks: 2,
    lines: kids.map((k, i) => k.who + " has {" + i + "} " + unit + " " + leftW + "."), blanks: kids.map(() => ({ len: 4, w: "mid" })),
    check(r) {
      const v = kids.map((k, i) => int((r.v || [])[i])), pt = v.map((x, i) => x === kids[i].left);
      if (pt.every(Boolean)) return { ok: true, parts: pt };
      const i = pt.indexOf(false);
      return { ok: false, msg: slip(kids[i], v[i]), parts: pt };
    },
    hint: { pic: bars(false), step: tip },
    worked: { text: work(kids[0]) + " " + work(kids[1]), pic: bars(true) },
    yes: kids[0].who + " has " + kids[0].left + " " + leftW + " and " + kids[1].who + " has " + kids[1].left + ".",
    key: kids.map(k => k.left).join(" ; "), fill: kids.map(k => String(k.left))
  };
};

/* ---------- a fraction is a division ---------- */
M.s4div = function (dd) {
  const a = dd.a, b = dd.b, form = dd.form || "share";
  need(a > 0 && b > 1 && a !== b, "s4div " + a + "/" + b);
  const same = "A fraction is a division. " + a + " " + D + " " + b + " and " + F(a, b) + " mean the same: " + a + " shared into " + b + " equal parts.";
  if (form === "div") {
    return {
      q: "Write the [[fraction]] as a division.", marks: 1,
      lines: [F(a, b) + " = {0} " + D + " {1}"], blanks: [BOX, BOX],
      check(r) {
        const v = (r.v || []).map(int), pt = [v[0] === a, v[1] === b];
        if (pt.every(Boolean)) return { ok: true, parts: pt };
        if (v[0] > 0 && v[1] > 0 && v[0] * b === a * v[1]) return { ok: true, parts: [true, true], note: v[0] + " " + D + " " + v[1] + " is equal to " + a + "/" + b + "." };
        return { ok: false, msg: v[0] === b && v[1] === a ? "The other way round. The top number is the number you share. It goes first." : "The top number goes first. The bottom number is the number you divide by.", parts: pt };
      },
      hint: { step: "The line in a fraction means divide: top " + D + " bottom." },
      worked: { text: same }, yes: F(a, b) + " = " + a + " " + D + " " + b + ".", key: a + " ; " + b, fill: [String(a), String(b)]
    };
  }
  const share = form === "share";
  if (share) need(a < b, "s4div share needs fewer things than children");
  const each = dd.each || "child", who = dd.who || "children", things = a === 1 ? "1 " + dd.one : a + " " + dd.many;
  const check = r => {
    const v = (r.v || []).map(int), pt = [v[0] === a, v[1] === b];
    if (pt.every(Boolean)) return { ok: true, parts: pt };
    if (v[1] > 0 && v[0] * b === a * v[1]) return { ok: true, parts: [true, true], note: v[0] + "/" + v[1] + " is equal to " + a + "/" + b + "." };
    if (v[0] === b && v[1] === a) return { ok: false, msg: share ? "You have the two numbers, but the other way round. The number of " + who + " goes at the bottom." : "The other way round. The number you share goes on top. The number you divide by goes at the bottom.", parts: [false, false] };
    return { ok: false, msg: share ? (!pt[1] ? (a === 1 ? "The " : "Each ") + dd.one + " is cut into " + b + " equal parts, one for each " + each + ". That is the bottom number." : (a === 1 ? "There is only 1 " + dd.one + ". Each " + each + " gets one part of it." : "Each " + each + " gets one part from every " + dd.one + ". There are " + things + "."))
      : (!pt[1] ? "The number you divide by goes at the bottom." : "The number you share goes on top."), parts: pt };
  };
  if (!share) {
    return {
      q: "Write the division as a [[fraction]].", marks: 1,
      lines: [a + " " + D + " " + b + " = " + FB(0, 1)], blanks: [BOX, BOX], check: check,
      hint: { step: "The number you share goes on top. The number you divide by goes at the bottom." },
      worked: { text: same }, yes: a + " " + D + " " + b + " = " + F(a, b) + ".", key: a + "/" + b, fill: [String(a), String(b)]
    };
  }
  return {
    q: dd.text ? s4frac(dd.text) : "<b>" + a + "</b> " + (a === 1 ? dd.one + " is" : dd.many + " are") + " shared equally among <b>" + b + "</b> " + who + ". What [[fraction]] of " + (a === 1 ? "the " : "a ") + dd.one + " does each " + each + " get?", marks: 1,
    fig: dd.pic === false ? null : { k: "s4share", wholes: a, people: b, kind: dd.kind || "pizza" },
    lines: ["Each " + each + " gets " + FB(0, 1) + " of " + (a === 1 ? "the " : "a ") + dd.one + "."], blanks: [BOX, BOX], check: check,
    hint: { step: a + " shared among " + b + " is " + a + " " + D + " " + b + ". Write " + a + " on top and " + b + " at the bottom." },
    worked: { text: (a === 1 ? "Cut the " + dd.one + " into " + b + " equal parts. Each " + each + " gets 1 part: that is " + some(1, b) + "."
      : "Cut each " + dd.one + " into " + b + " equal parts. Each " + each + " gets 1 part from each of the " + things + ": that is " + some(a, b) + ".") + " So " + a + " " + D + " " + b + " = " + F(a, b) + ".",
      pic: { k: "s4share", wholes: a, people: b, kind: dd.kind || "pizza", each: true } },
    yes: a + " " + D + " " + b + " = " + F(a, b) + ".", key: a + "/" + b, fill: [String(a), String(b)]
  };
};

/* ---------- find the whole from a part ---------- */
M.s4whole = function (dd) {
  const n = dd.n, d = dd.d, part = dd.part;
  need(n > 0 && n < d && part % n === 0, "s4whole " + n + "/" + d + " of ? = " + part);
  const one = part / n, whole = one * d, unit = dd.unit ? " " + dd.unit : "";
  return {
    q: dd.text ? s4frac(dd.text) : F(n, d) + " of a number is <b>" + fmt(part) + "</b>. What is the number?", marks: 1,
    fig: dd.bar ? { k: "s4bar", parts: d, shade: n, whole: "?", part: part } : null,
    lines: [dd.line ? s4frac(dd.line) : "The number is {0}" + unit], blanks: [{ len: 5, w: "mid" }],
    check(r) {
      const v = int((r.v || [])[0]);
      if (v === whole) return { ok: true, parts: [true] };
      let msg = n === 1 ? "One part is " + fmt(part) + ". The whole has " + d + " equal parts. Multiply." : "First find one part: " + fmt(part) + " " + D + " " + n + ". The whole has " + d + " parts.";
      if (n > 1 && v === one) msg = "That is one part. The whole has " + d + " equal parts. Multiply by " + d + ".";
      else if (n > 1 && v === part * d) msg = fmt(part) + " is " + n + " parts, not one part. First divide " + fmt(part) + " by " + n + ".";
      else if (v === part * n / d) msg = "You found " + F(n, d) + " of " + fmt(part) + ". But " + fmt(part) + " is already the part. Work backwards to the whole.";
      else if (v <= part) msg = "The whole is bigger than the part. " + fmt(part) + " is only " + some(n, d) + " of it.";
      return { ok: false, msg: msg, parts: [false] };
    },
    hint: { pic: { k: "s4bar", parts: d, shade: n, whole: "?", each: "?", part: part }, step: n === 1 ? "One part is " + fmt(part) + ". How many equal parts make the whole?" : "The " + n + " shaded parts make " + fmt(part) + ". Find one part first." },
    worked: { text: (n > 1 ? some(n, d).replace(/^./, c => c.toUpperCase()) + " are " + fmt(part) + ", so one " + NAMES[d] + " is " + fmt(part) + " " + D + " " + n + " = " + fmt(one) + ". " : "One " + NAMES[d] + " is " + fmt(one) + ". ") +
      "The whole is " + some(d, d) + ": " + fmt(one) + " " + X + " " + d + " = " + fmt(whole) + ".", pic: { k: "s4bar", parts: d, shade: n, whole: whole, each: one, part: part } },
    yes: F(n, d) + " of " + fmt(whole) + " is " + fmt(part) + ".", key: fmt(whole), fill: [String(whole)]
  };
};

/* ---------- improper fraction <-> mixed number ---------- */
M.s4mix = function (dd) {
  const n = dd.n, d = dd.d, w = Math.floor(n / d), r = n % d, show = dd.show || "num", toMixed = dd.to !== "improper";
  need(d > 1 && n > d && r > 0, "s4mix " + n + "/" + d);
  const max = dd.max || w + 1, shape = show === "circles" || show === "bars";
  const figAsk = show === "line" ? { k: "s4line", max: max, d: d, at: n, label: "?" } : shape ? { k: "s4mixed", n: n, d: d, kind: show } : dd.pic ? { k: "s4mixed", n: n, d: d, kind: "circles" } : null;
  const figDone = show === "line" ? { k: "s4line", max: max, d: d, at: n, label: "both", count: n <= 12 } : { k: "s4mixed", n: n, d: d, kind: show === "bars" ? "bars" : "circles", label: "both" };
  const one = show === "bars" ? "bar" : "circle";
  const lead = show === "line" ? "What number does the arrow point to? " : shape ? "Each " + one + " is 1 whole. How much is shaded? " : "";
  const wholes = w + (w === 1 ? " whole" : " wholes");
  const botMsg = show === "line" ? "Look at one whole on the line: from 0 to 1. How many equal steps is it cut into? That is the bottom number."
    : shape ? "Each " + one + " is cut into equal parts. How many parts make one " + one + "? That is the bottom number."
    : "The bottom number stays the same. The parts are still " + plural(d) + ".";
  let t;
  if (toMixed) {
    t = {
      q: show === "num" ? "Write " + F(n, d) + " as a [[mixed number]]." : lead + "Write it as a [[mixed number]].",
      lines: [(show === "num" ? F(n, d) + " = " : "") + MB(0, 1, 2)], blanks: [BOX, BOX, BOX],
      check(res) {
        const v = (res.v || []).map(int), W = v[0], N = v[1], Dn = v[2], pt = [W === w, N === r, Dn === d];
        if (pt.every(Boolean)) return { ok: true, parts: pt };
        if (W === w && Dn > 0 && N < Dn && N * d === r * Dn) return { ok: true, parts: [true, true, true], note: W + " " + N + "/" + Dn + " is equal to " + w + " " + r + "/" + d + "." };
        let msg;
        if (Dn !== d && !(Dn > 0 && N * d === r * Dn)) msg = botMsg;
        else if (W !== w) msg = show === "line" ? "The whole number is the last whole number before the arrow. Look at the big marks." : shape ? "Count the " + one + "s that are shaded all over. That is the whole number."
          : d + " " + plural(d) + " make 1 whole. How many wholes can you make from " + some(n, d) + "? " + n + " " + D + " " + d + ".";
        else if (N >= Dn) msg = "The fraction part must be less than 1 whole.";
        else msg = show === "line" ? "Count the small steps from " + w + " to the arrow." : shape ? "Count the shaded parts of the last " + one + "."
          : wholes.replace(/^./, c => c.toUpperCase()) + " " + (w === 1 ? "uses " : "use ") + some(w * d, d) + ". How many " + plural(d) + " are left over from " + n + "?";
        return { ok: false, msg: msg, parts: pt };
      },
      hint: { step: show === "line" ? "Count the whole numbers before the arrow. Then count the small steps after the last whole number." : shape ? "Count the full " + one + "s. Then count the shaded parts of the last " + one + "." : "Divide the top by the bottom: " + n + " " + D + " " + d + ". The answer is the wholes. The remainder is the top of the fraction." },
      worked: { text: n + " " + D + " " + d + " = " + w + " remainder " + r + ". That is " + wholes + " and " + some(r, d) + ". So " + F(n, d) + " = " + MIX(w, r, d) + "." },
      key: TXT(n, d, "mixed"), fill: [String(w), String(r), String(d)]
    };
  } else {
    t = {
      q: show === "num" ? "Write " + MIX(w, r, d) + " as an [[improper fraction]]." : lead + "Write it as an [[improper fraction]].",
      lines: [(show === "num" ? MIX(w, r, d) + " = " : "") + FB(0, 1)], blanks: [BOX, BOX],
      check(res) {
        const v = (res.v || []).map(int), N = v[0], Dn = v[1], pt = [N === n, Dn === d];
        if (pt.every(Boolean)) return { ok: true, parts: pt };
        if (Dn > 0 && N * d === n * Dn && N > Dn) return { ok: true, parts: [true, true], note: N + "/" + Dn + " is equal to " + n + "/" + d + "." };
        let msg;
        if (Dn !== d) msg = botMsg;
        else if (N === w * d) msg = "Good: " + wholes + " " + (w === 1 ? "is " : "are ") + some(w * d, d) + ". Now add the " + some(r, d) + " more.";
        else if (N === w + r) msg = "You added the whole number to the top number. But 1 whole is " + some(d, d) + ". Work out " + w + " " + X + " " + d + " first, then add " + r + ".";
        else if (N === r) msg = "Do not forget the " + wholes + ". 1 whole is " + some(d, d) + ".";
        else if (N === Number(String(w) + String(r))) msg = "Do not write the digits side by side. Change the " + wholes + " into " + plural(d) + " first: " + w + " " + X + " " + d + ".";
        else if (N === w * r) msg = "Multiply the whole number by the bottom number: " + w + " " + X + " " + d + ". Then add " + r + ".";
        else msg = show === "num" ? "1 whole is " + some(d, d) + ". Work out " + w + " " + X + " " + d + ", then add " + r + "." : "Count all the " + plural(d) + (show === "line" ? " from 0 to the arrow." : " that are shaded.");
        return { ok: false, msg: msg, parts: pt };
      },
      hint: { step: show === "line" ? "Count the small steps from 0 to the arrow. Each step is one " + NAMES[d] + "." : shape ? "Each " + one + " has " + d + " equal parts. Count all the shaded parts." : "1 whole is " + some(d, d) + ". Change the wholes into " + plural(d) + ". Then add the other " + plural(d) + "." },
      worked: { text: wholes.replace(/^./, c => c.toUpperCase()) + " " + (w === 1 ? "is " : "are ") + w + " " + X + " " + d + " = " + some(w * d, d) + ". " + (w * d) + " + " + r + " = " + n + ". So " + MIX(w, r, d) + " = " + F(n, d) + "." },
      key: TXT(n, d), fill: [String(n), String(d)]
    };
  }
  t.marks = 1; t.fig = figAsk; t.worked.pic = figDone;
  t.hint.pic = show === "num" && !dd.pic ? { k: "s4mixed", n: n, d: d, kind: "circles" } : null;
  t.yes = F(n, d) + " = " + MIX(w, r, d) + ".";
  return t;
};

/* ---------- tick the picture of a number, or the number of a picture ---------- */
M.s4pick = function (dd) {
  const n = dd.n, d = dd.d, kind = dd.kind || "circles", as = dd.as || "mixed", askPic = dd.ask === "pic";
  const all = [[n, d, as]].concat(dd.wrong.map(x => [x[0], x[1], x[2] || as]));
  all.slice(1).forEach(x => need(x[0] * d !== n * x[1], "s4pick: a wrong option is equal to the right one"));
  const maxW = Math.max.apply(null, all.map(x => Math.ceil(x[0] / x[1])));
  const max = dd.max || Math.max(maxW, Math.floor(n / d) + 1);
  const figOf = x => (kind === "line" ? { k: "s4line", max: max, d: x[1], at: x[0], label: "?" } : { k: "s4mixed", n: x[0], d: x[1], kind: kind, wholes: askPic ? maxW : 0 });
  const say = x => { const w = Math.floor(x[0] / x[1]), r = x[0] % x[1]; return some(x[0], x[1]) + (w && r ? " (" + w + (w === 1 ? " whole" : " wholes") + " and " + some(r, x[1]) + ")" : w && !r ? " (" + w + (w === 1 ? " whole" : " wholes") + ")" : ""); };
  const part = kind === "line" ? "small steps from 0 to the arrow" : "shaded parts";
  const opts = arrange(all.map((x, i) => ({
    html: askPic ? "" : NUM(x[0], x[1], x[2]), fig: askPic ? figOf(x) : null, alt: askPic ? "Picture of " + say(x) : TXT(x[0], x[1], x[2]), ok: i === 0,
    why: i === 0 ? "" : askPic ? "This picture shows " + say(x) + "." + (x[1] !== d ? " Look at the number of equal parts in one whole." : " Count the " + part + " again.")
      : TXT(x[0], x[1], x[2]) + " is " + say(x) + ". " + (x[1] !== d ? "Here one whole has " + d + " equal parts." : "Count the " + part + ".")
  })), dd.at);
  const good = opts.findIndex(o => o.ok), w = Math.floor(n / d), r = n % d;
  return {
    q: askPic ? "Which picture shows " + NUM(n, d, as) + "?" : (kind === "line" ? "What number does the arrow point to?" : "Each " + (kind === "bars" ? "bar" : "circle") + " is 1 whole. What number is shaded?"),
    sub: "Tick (✓) one box.", letters: true, marks: 1, fig: askPic ? null : figOf([n, d]), opts: opts,
    check(res) { const o = opts[res.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || "Count the parts." }; },
    hint: { step: askPic ? "The bottom number says how many equal parts make 1 whole. The top number says how many parts are shaded." + (as === "mixed" ? " " + NUM(n, d, as) + " is " + say([n, d]) + "." : "")
      : "One whole has " + d + " equal parts, so each part is one " + NAMES[d] + ". Count the " + part + "." },
    worked: { text: (askPic ? NUM(n, d, as) + " is " + say([n, d]) + "." : "There are " + n + " " + part + ". Each part is one " + NAMES[d] + ". That is " + say([n, d]) + ".") + (w && r ? " " + F(n, d) + " = " + MIX(w, r, d) + "." : ""),
      pic: kind === "line" ? { k: "s4line", max: max, d: d, at: n, label: "both", count: n <= 12 } : { k: "s4mixed", n: n, d: d, kind: kind, label: "both" } },
    yes: (askPic ? "Picture " + LET[good] + " shows " : "The picture shows ") + say([n, d]) + ".", key: LET[good] + (askPic ? "" : ": " + TXT(n, d, as))
  };
};

/* ---------- tick the one fraction that fits ---------- */
const WHICH = {
  gt1: { q: "greater than 1", test: (n, d) => n > d },
  lt1: { q: "less than 1", test: (n, d) => n < d },
  eq1: { q: "equal to 1", test: (n, d) => n === d },
  whole: { q: "equal to a whole number", test: (n, d) => n % d === 0 }
};
M.s4which = function (dd) {
  const rule = WHICH[dd.ask]; need(rule, "s4which ask");
  const fits = dd.fracs.filter(x => rule.test(x[0], x[1]));
  need(fits.length === 1, "s4which needs exactly one fraction that fits, has " + fits.length);
  const tell = x => { const n = x[0], d = x[1]; return n % d === 0 ? F(n, d) + " = " + n + " " + D + " " + d + " = " + n / d + "." : n < d ? "In " + F(n, d) + " the top number is smaller than the bottom number. It is less than 1 whole." : F(n, d) + " is " + some(n, d) + ". " + some(d, d).replace(/^./, c => c.toUpperCase()) + " make 1 whole, so it is more than 1."; };
  const right = fits[0], opts = arrange([right].concat(dd.fracs.filter(x => x !== right)).map((x, i) => ({ html: F(x[0], x[1]), alt: x[0] + "/" + x[1], ok: i === 0, why: i === 0 ? "" : tell(x) })), dd.at);
  return {
    q: "Which [[fraction]] is <b>" + rule.q + "</b>?", sub: "Tick (✓) one box.", letters: true, marks: 1, opts: opts,
    check(res) { const o = opts[res.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || "Compare the top number with the bottom number." }; },
    hint: { step: "Compare the top number with the bottom number. When they are the same, the fraction is exactly 1 whole." },
    worked: { text: tell(right) + " The other fractions are not " + rule.q + "." },
    yes: tell(right), key: LET[opts.findIndex(o => o.ok)] + ": " + right[0] + "/" + right[1]
  };
};
})();
