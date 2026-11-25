/* g4-models-s6.js - the question models of Stop 6, Sequences and special numbers (Grade 4, Stage 5).
   Every answer is WORKED OUT here from the numbers in the data; a model throws when its data cannot be right
   (tools/keys.js then reports it), so a wrong key cannot ship.

   s6nth    the nth term of a linear sequence            { a, d, n, show (4), strip (true: the strip picture), jumps }
   s6first  the first term past a border                 { a, d, kind: '3digit' | 'neg', who, strip, line }
            '3digit': the smallest 3-digit number in the sequence; 'neg': the first negative number when counting back
   s6two    two children count, two parts                { A: { who, a, d (< 0) }, B: { who, a, d (> 0) } }
            (a) the first negative number A says, (b) a number both say (any common number is right)
   s6tri    dots in a triangular pattern                 { asks: [5] or [5, 6], shown: [1, 2, 3, 4] }
   s6why    prime or composite, with the reason          { n, at, who (a child says "n is not prime": n composite), fig, tryd }
   s6pair   a factor pair that shows n is composite      { n, fig (true: the arrays without labels) }
   claim    with s6: a general statement to judge (DOK 3) { type: 'claim', who, ok, at, s6: { k, ... }, wrong: [{ t, why }, { t, why }], tip, pic }
            the statement, the right reason and the worked answer are written by the code from the fact s6;
            fact kinds (each one is tested in code; ok in the data must agree with the code, or the model throws):
              sqsum { says: 'even' | 'odd', eg: [1, 4] }   primesum { eg: [2, 3] }   primeodd {}   oddprime { eg: 9 }
              trisum { ks: [1, 2, 3] }   tripar {}   sqcomp { eg: 25 }   nthdouble { a, d, n } */
(function () {
"use strict";
const M = MX.M, fmt = MX.fmt, sg = MX.sg;
const ord = n => { const t = n % 100; return n + (t >= 11 && t <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th"); };
const tri = k => k * (k + 1) / 2;
const isPrime = v => { if (v < 2) return false; for (let k = 2; k * k <= v; k++) if (v % k === 0) return false; return true; };
const isSq = v => v > 0 && Number.isInteger(Math.sqrt(v));
const factors = n => { const f = []; for (let a = 1; a <= n; a++) if (n % a === 0) f.push(a); return f; };
const pairs = n => factors(n).filter(a => a * a <= n).map(a => [a, n / a]);
const list = a => a.map(sg).join(", ");
const andList = a => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);
const need = (ok, msg) => { if (!ok) throw new Error("s6 data: " + msg); };
const stepTxt = d => (d > 0 ? "+ " : "− ") + fmt(Math.abs(d));
const terms = (a, d, n) => Array.from({ length: n }, (x, i) => a + i * d);
MX.s6 = { ord: ord, tri: tri, isPrime: isPrime, isSq: isSq, factors: factors, pairs: pairs };

/* the nth term: (n − 1) jumps of d from the 1st term */
M.s6nth = function (d, mode) {
  const a = d.a, st = d.d, n = d.n, show = d.show || 4, ad = Math.abs(st), up = st > 0, ans = a + (n - 1) * st, t = terms(a, st, show);
  need(n > show && st !== 0, "s6nth needs n beyond the terms shown");
  const strip = { k: "s6strip", a: a, d: st, show: show, n: n }, big = Object.assign({}, strip, { jumps: true });
  return {
    q: "This [[sequence]] continues in the same way. Write the <b>" + ord(n) + "</b> [[term]].",
    sum: list(t) + ", ...", fig: d.strip ? (d.jumps || mode === "our" ? big : strip) : null,
    how: mode === "our" ? "Count the jumps from the 1st term to the " + ord(n) + " term. Then use multiplication." : "",
    lines: ["{0}"], blanks: [{ len: 5, w: "big", neg: true }],
    check(r) {
      const v = MX.num(r.v[0]);
      if (v === ans) return { ok: true, parts: [true] };
      let msg = "From the 1st term to the " + ord(n) + " term there are " + (n - 1) + " jumps of " + fmt(ad) + ". Work out " + (n - 1) + " × " + fmt(ad) + " first.";
      if (v === a + n * st) msg = "You made " + n + " jumps. The 1st term is already " + sg(a) + ", so the " + ord(n) + " term is only " + (n - 1) + " jumps away.";
      else if (v === (n - 1) * st) msg = "That is only the jumps. The sequence starts at " + sg(a) + ", so " + (up ? "add the jumps to " : "take the jumps away from ") + sg(a) + ".";
      else if (v === n * st) msg = "You worked out " + n + " × " + fmt(ad) + ". There are only " + (n - 1) + " jumps, and the sequence starts at " + sg(a) + ". Work out " + (n - 1) + " × " + fmt(ad) + ", then " + (up ? "add " : "take it away from ") + sg(a) + ".";
      else if (v === a + (n - 2) * st) msg = "That is the " + ord(n - 1) + " term. Make one more jump of " + fmt(ad) + ".";
      else if (v === a + show * st) msg = "That is the next term, the " + ord(show + 1) + ". The question asks for the " + ord(n) + " term.";
      return { ok: false, msg: msg, parts: [false] };
    },
    hint: { pic: big, step: "Each jump is " + stepTxt(st) + ". From the 1st term to the " + ord(n) + " term there are " + (n - 1) + " jumps. Work out " + (n - 1) + " × " + fmt(ad) + "." },
    worked: { text: "The jump is " + stepTxt(st) + ". The " + ord(n) + " term is " + (n - 1) + " jumps from the 1st term. " + (n - 1) + " × " + fmt(ad) + " = " + fmt((n - 1) * ad) + ". " +
      sg(a) + (up ? " + " : " − ") + fmt((n - 1) * ad) + " = " + sg(ans) + ".", pic: Object.assign({}, big, { reveal: true }) },
    yes: "The " + ord(n) + " term is " + sg(ans) + ": " + (n - 1) + " jumps of " + fmt(ad) + " from " + sg(a) + ".",
    key: sg(ans), fill: [String(ans)]
  };
};

/* the first negative number when you count back from a in steps of |d| */
function firstNeg(a, d) { need(d < 0 && a >= 0, "count back from a number that is not negative"); let v = a; const said = [a]; while (v >= 0) { v += d; said.push(v); } return { ans: v, said: said, last: v - d }; }
function negMsg(v, o, d, a) {
  if (v === -o.ans) return "This number is below zero. It needs a minus sign.";
  if (v === 0 && o.last === 0) return "0 is not a negative number. Make one more jump back.";
  if (v === o.last) return sg(o.last) + " is not below zero yet. Make one more jump of " + fmt(-d) + ".";
  if (v < o.ans && (o.ans - v) % d === 0) return sg(v) + " is negative, but it is not the first one. Which number comes just after you pass zero?";
  if (v === d) return "Do not start again at 0. From " + sg(o.last) + ", one jump of " + fmt(-d) + " lands on " + sg(o.ans) + ".";
  return "Count back in " + fmt(-d) + "s from " + sg(a) + ": " + list(o.said.slice(0, 3)) + " ... Stop at the first number below zero.";
}

M.s6first = function (d) {
  const a = d.a, st = d.d, ad = Math.abs(st);
  if (d.kind === "neg") {
    const o = firstNeg(a, st), who = d.who || "A child";
    need(o.said.length <= 11, "too many jumps to zero");
    const lo = Math.floor((o.ans - 1) / 2) * 2, hi = Math.ceil((a + 1) / 2) * 2;   /* a label on every number only when they fit (12 steps at most) */
    const line = d.line ? { k: "nline", mode: "jump", skin: "board", min: lo, max: hi, start: a, jump: ad, lab: hi - lo > 12 ? 2 : 1 } : null;
    return {
      q: "<b>" + who + "</b> counts back from <b>" + sg(a) + "</b> in steps of <b>" + fmt(ad) + "</b>. Write the first [[negative number]] " + who + " says.",
      fig: line, lines: ["{0}"], blanks: [{ len: 4, w: "big", neg: true }],
      check(r) { const v = MX.num(r.v[0]); return v === o.ans ? { ok: true, parts: [true] } : { ok: false, msg: negMsg(v, o, st, a), parts: [false] }; },
      hint: { pic: d.line ? null : { k: "hops", terms: o.said.slice(0, 3), blanks: 1, labs: ["− " + ad, "− " + ad, "− " + ad] }, step: "Count back in " + fmt(ad) + "s: " + list(o.said.slice(0, 3)) + " ... Keep the same jump when you pass zero." },
      worked: { text: "Count back in " + fmt(ad) + "s: " + list(o.said) + ". The first number below zero is " + sg(o.ans) + ".",
        pic: d.line ? Object.assign({}, line, { to: o.ans }) : null },
      yes: list(o.said) + ". The first negative number is " + sg(o.ans) + ".", key: sg(o.ans), fill: [String(o.ans)]
    };
  }
  need(st > 0 && a < 100 && a >= 0, "s6first 3digit needs a rising sequence that starts under 100");
  const k = Math.ceil((100 - a) / st), ans = a + k * st, last = ans - st, show = d.show || 4, t = terms(a, st, show);
  const inSeq = v => v >= a && (v - a) % st === 0;
  const near = last === 99 || ans === 100 ? "" : " 100 is between " + last + " and " + ans + ".";
  return {
    q: "This [[sequence]] continues in the same way. Write the <b>smallest 3-digit number</b> in the sequence.",
    sum: list(t) + ", ...", fig: d.strip ? { k: "s6strip", a: a, d: st, show: show } : null,
    lines: ["{0}"], blanks: [{ len: 5, w: "big" }],
    check(r) {
      const v = MX.num(r.v[0]);
      if (v === ans) return { ok: true, parts: [true] };
      let msg = "The jump is + " + st + ". Find a [[term]] just under 100. Then make one more jump.";
      if (v === 100) msg = "100 is the smallest 3-digit number, but it is not in this sequence. The terms jump from " + last + " to " + ans + ".";
      else if (v === last) msg = last + " is in the sequence, but it has only 2 digits. Make one more jump of " + st + ".";
      else if (inSeq(v) && v > ans) msg = fmt(v) + " is in the sequence, but there is a smaller 3-digit term. Go back in jumps of " + st + ".";
      else if (inSeq(v)) msg = v + " is in the sequence, but it has fewer than 3 digits. Carry on past 99.";
      else if (v >= 100 && v < 100 + st) msg = fmt(v) + " is not in the sequence. Every term is " + a + " plus some jumps of " + st + ". The terms near 100 are " + last + " and " + ans + ".";
      return { ok: false, msg: msg, parts: [false] };
    },
    hint: { pic: d.strip ? null : { k: "s6strip", a: a, d: st, show: show }, step: "The jump is + " + st + ". Use multiplication to get near 100: " + (k - 1) + " jumps make " + (k - 1) * st + ". Where do you land?" },
    worked: { text: "The jump is + " + st + ". " + (k - 1) + " jumps make " + (k - 1) + " × " + st + " = " + (k - 1) * st + ", and " + a + " + " + (k - 1) * st + " = " + last + ". That has 2 digits. One more jump: " +
      last + " + " + st + " = " + ans + "." + near },
    yes: "The smallest 3-digit number in the sequence is " + ans + ": the term before it is " + last + ".", key: String(ans), fill: [String(ans)]
  };
};

/* two children count: one back past zero, one on. Any number that both say is right. */
M.s6two = function (d) {
  const A = d.A, B = d.B, o = firstNeg(A.a, A.d), ad = -A.d;
  need(B.d > 0, "B counts on");
  const inA = v => v <= A.a && (A.a - v) % ad === 0, inB = v => v >= B.a && (v - B.a) % B.d === 0;
  const both = []; for (let v = B.a; v <= A.a; v += B.d) if (inA(v)) both.push(v);
  need(both.length >= 1 && both.length <= 2, "s6two needs one or two numbers that both children say, has " + both.length);
  const top = both[both.length - 1], saidB = terms(B.a, B.d, Math.floor((Math.max(top, B.a + 3 * B.d) - B.a) / B.d) + 2);
  const saidA = o.said;
  return {
    q: "<b>" + A.who + "</b> counts back from <b>" + sg(A.a) + "</b> in steps of <b>" + ad + "</b>. <b>" + B.who + "</b> counts on from <b>" + sg(B.a) + "</b> in steps of <b>" + B.d + "</b>.",
    sub: "(a) Write the first [[negative number]] " + A.who + " says.<br>(b) Write a number that both children say.", marks: 2,
    lines: ["(a) {0}", "(b) {1}"],
    blanks: [{ len: 4, w: "mid", neg: true }, { len: 4, w: "mid", neg: true }],
    check(r) {
      const va = MX.num(r.v[0]), vb = MX.num(r.v[1]), parts = [va === o.ans, both.indexOf(vb) >= 0];
      if (parts[0] && parts[1]) return { ok: true, parts: parts };
      if (!parts[0]) return { ok: false, msg: "Look at (a). " + negMsg(va, o, A.d, A.a), parts: parts };
      let msg = "Write the numbers each child says. Look for a number that is in both lists.";
      if (inA(vb) && !inB(vb)) msg = A.who + " says " + sg(vb) + ", but " + B.who + " does not. " + B.who + " says " + list(saidB.slice(0, 3)) + " ...";
      else if (inB(vb) && !inA(vb)) msg = B.who + " says " + sg(vb) + ", but " + A.who + " does not. " + A.who + " says " + list(saidA.slice(0, 3)) + " ...";
      return { ok: false, msg: "Look at (b). " + msg, parts: parts };
    },
    hint: { step: "Write both lists. " + A.who + ": " + list(saidA.slice(0, 3)) + " ... " + B.who + ": " + list(saidB.slice(0, 3)) + " ...",
      pic: [{ k: "hops", terms: saidA.slice(0, 3), blanks: 1, labs: ["− " + ad, "− " + ad, "− " + ad] }, { k: "hops", terms: saidB.slice(0, 3), blanks: 1, labs: ["+ " + B.d, "+ " + B.d, "+ " + B.d] }] },
    worked: { text: A.who + ": " + list(saidA) + ". The first negative number is " + sg(o.ans) + ". " + B.who + ": " + list(saidB) + " ... Both say " + andList(both.map(sg)) + "." },
    yes: "(a) " + sg(o.ans) + ". (b) Both children say " + andList(both.map(sg)) + ".",
    key: sg(o.ans) + " ; " + both.map(sg).join(" or "), fill: [String(o.ans), String(both[0])]
  };
};

/* triangular numbers as dot patterns: pattern k has rows of 1, 2, ... k dots */
M.s6tri = function (d, mode) {
  const asks = d.asks || [d.k], shown = d.shown || [1, 2, 3], one = asks.length === 1, top = Math.max.apply(null, shown);
  need(asks.every(k => k >= 2 && k <= 12 && shown.indexOf(k) < 0), "s6tri asks for patterns that are not shown");
  const sum = k => Array.from({ length: k }, (x, i) => i + 1).join(" + ");
  const rows = k => andList(Array.from({ length: k }, (x, i) => String(i + 1)));
  const why = (k, v) => {
    if (v === k * k) return "Pattern " + k + " is a triangle, not a square. Its rows have " + rows(k) + " dots.";
    if (v === tri(k - 1)) return "That is pattern " + (k - 1) + ". Pattern " + k + " has one more row, with " + k + " dots.";
    if (v === tri(k + 1)) return "That is pattern " + (k + 1) + ". Pattern " + k + " stops at the row with " + k + " dots.";
    if (v === tri(k - 1) + k - 1) return "The new row is longer each time. Pattern " + k + " is pattern " + (k - 1) + " plus a row of " + k + " dots.";
    if (k > top && v === tri(top) + (k - top) * top) return "The jump is not always + " + top + ". The jumps grow: + 2, + 3, + 4, and so on.";
    if (v === k || v === 2 * k) return "Count every dot. Pattern " + k + " has " + k + " rows: " + sum(k) + ".";
    return "Pattern " + k + " has rows of " + rows(k) + " dots. Add them.";
  };
  const fig = { k: "s6tri", ks: shown, ask: asks };
  return {
    q: "These dot patterns show [[triangular numbers|triangular number]]. How many dots are in " + (one ? "<b>pattern " + asks[0] + "</b>?" : "<b>pattern " + asks.join("</b> and <b>pattern ") + "</b>?"),
    fig: fig, how: mode === "our" ? "Look at the bottom row of each pattern. How does the pattern grow?" : "",
    lines: asks.map((k, i) => "Pattern " + k + ": {" + i + "} dots"), blanks: asks.map(() => ({ len: 3, w: "mid" })), marks: asks.length,
    check(r) {
      const parts = asks.map((k, i) => MX.num(r.v[i]) === tri(k));
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      const i = parts.indexOf(false);
      return { ok: false, msg: (one ? "" : "Look at pattern " + asks[i] + ". ") + why(asks[i], MX.num(r.v[i])), parts: parts };
    },
    hint: { step: "Each pattern adds one more row. Pattern " + (top + 1) + " is pattern " + top + " plus a row of " + (top + 1) + " dots: " + tri(top) + " + " + (top + 1) + "." },
    worked: { text: asks.map(k => "Pattern " + k + " has rows of " + rows(k) + " dots: " + sum(k) + " = " + tri(k) + ".").join(" "), pic: { k: "s6tri", ks: asks.slice(0, 2), cap: true } },
    yes: asks.map(k => "Pattern " + k + " has " + tri(k) + " dots").join(". ") + ".",
    key: asks.map(k => String(tri(k))).join(" ; "), fill: asks.map(k => String(tri(k)))
  };
};

/* prime or composite: tick the answer with the right reason. The factor pairs are found here. */
M.s6why = function (d) {
  const n = d.n, prime = isPrime(n), f = factors(n), ps = pairs(n);
  need(n >= 2 && n <= 100, "s6why: n from 2 to 100");
  let o, q, worked;
  if (d.who) {
    need(!prime, d.who + " says " + n + " is not prime, but it is prime");
    const p = ps[1];
    q = "<b>" + d.who + "</b> says, “<b>" + n + "</b> is <b>not</b> a [[prime number]].” Which reason shows that " + d.who + " is correct?";
    o = [{ html: n + " = " + p[0] + " × " + p[1] + ", so it has more than two factors.", ok: true },
      n % 2 ? { html: n + " is an odd number.", why: "Odd numbers can be prime: 3, 5 and 7 are odd and prime. Look for a factor pair of " + n + " without 1." }
        : { html: n + " is greater than 10.", why: "Big numbers can be prime: 11 and 13 are prime. Look for a factor pair of " + n + " without 1." },
      { html: n + " has exactly two factors.", why: "A number with exactly two factors IS prime. " + n + " has " + f.length + " factors: " + andList(f) + "." }];
  } else if (!prime) {
    const p = ps[1];
    q = "Is <b>" + n + "</b> a [[prime number]] or a [[composite number]]? Tick the answer with the best reason.";
    o = [{ html: "Composite: " + n + " = " + p[0] + " × " + p[1] + ", so it has more than two factors.", ok: true },
      { html: "Prime: its only factors are 1 and " + n + ".", why: p[0] + " × " + p[1] + " = " + n + ", so " + (p[0] === p[1] ? p[0] + " is a factor" : p[0] + " and " + p[1] + " are factors") + " of " + n + " too." },
      n % 2 ? { html: "Prime: it is an odd number.", why: "Odd numbers can be composite. Try " + p[0] + " × " + p[1] + "." }
        : { html: "Composite: it has exactly two factors.", why: "A number with exactly two factors is prime. " + n + " has " + f.length + " factors: " + andList(f) + "." }];
  } else {
    const t = d.tryd || 3, lo = Math.floor(n / t) * t;
    need(n % t !== 0 && n > t, "s6why: tryd must not divide n");
    q = "Is <b>" + n + "</b> a [[prime number]] or a [[composite number]]? Tick the answer with the best reason.";
    o = [{ html: "Prime: its only factors are 1 and " + n + ".", ok: true },
      { html: "Composite: it is in the " + t + " times table.", why: t + " × " + lo / t + " = " + lo + " and " + t + " × " + (lo / t + 1) + " = " + (lo + t) + ". " + n + " is not in the " + t + " times table." },
      { html: "Prime: every odd number is prime.", why: "Not every odd number is prime: 9 = 3 × 3. The reason is the factors of " + n + ": only 1 and " + n + "." }];
  }
  worked = prime ? "The only factor pair of " + n + " is 1 × " + n + ". It has exactly two factors, so " + n + " is a prime number."
    : n + " = " + ps.map(p => p[0] + " × " + p[1]).join(" = ") + ". Its factors are " + andList(f) + ": more than two. So " + n + " is a composite number.";
  const opts = MX.arrange(o.map(x => ({ html: x.html, ok: !!x.ok, why: x.why || "" })), d.at);
  return {
    q: q, sub: "Tick (✓) one box.", opts: opts, fig: d.fig ? { k: "s6arr", n: n, nocap: true } : null,
    check(r) { const x = opts[r.pick]; return x && x.ok ? { ok: true } : { ok: false, msg: (x && x.why) || "Look for the factor pairs of " + n + "." }; },
    hint: { pic: d.fig ? null : { k: "frain", n: n }, step: "A prime number has exactly two factors: 1 and itself. Try to divide " + n + " by 2, 3, 5 and 7." },
    worked: { text: worked, pic: { k: "s6arr", n: n } },
    yes: worked, key: o[0].html.replace(/\[\[([^|\]]*)(\|[^\]]*)?\]\]/g, "$1")
  };
};

/* a factor pair without 1 shows that a number is composite (any right pair is accepted) */
M.s6pair = function (d) {
  const n = d.n, ps = pairs(n).slice(1);
  need(ps.length >= 1 && n <= 100, "s6pair: " + n + " is not composite");
  const all = ps.map(p => p[0] + " × " + p[1]).join(" or ");
  return {
    q: "<b>" + n + "</b> is a [[composite number]]. Write a [[factor]] pair that shows it. Do not use 1.",
    fig: d.fig ? { k: "s6arr", n: n, nocap: true, skip1: true } : null,
    how: d.fig ? "The " + n + " dots make equal rows. Count the rows. Then count the dots in one row." : "",
    lines: [n + " = {0} × {1}"], blanks: [{ len: 2, w: "mid" }, { len: 2, w: "mid" }], marks: 1,
    check(r) {
      const x = MX.num(r.v[0]), y = MX.num(r.v[1]);
      if (x * y === n && x > 1 && y > 1) return { ok: true, parts: [true, true] };
      if (x * y === n) return { ok: false, msg: "1 × " + n + " works for every number, also for prime numbers. Find a pair without 1.", parts: [x > 1, y > 1] };
      if (x > 1 && n % x === 0) return { ok: false, msg: x + " is a factor of " + n + ". Now work out " + n + " ÷ " + x + " for the other box.", parts: [true, false] };
      if (y > 1 && n % y === 0) return { ok: false, msg: y + " is a factor of " + n + ". Now work out " + n + " ÷ " + y + " for the other box.", parts: [false, true] };
      return { ok: false, msg: (x > 0 && y > 0 ? x + " × " + y + " = " + fmt(x * y) + ", not " + n + ". " : "") + "Which times tables is " + n + " in? Try 2, 3, 5 and 7.", parts: [false, false] };
    },
    hint: { pic: d.fig ? null : { k: "s6arr", n: n, nocap: true, skip1: true }, step: "Which times tables is " + n + " in? Try to divide " + n + " by 2, 3, 5 and 7." },
    worked: { text: n + " = " + all + ". So " + n + " has more factors than 1 and " + n + ". It is a composite number.", pic: { k: "s6arr", n: n } },
    yes: n + " = " + all + ".", key: ps.map(p => p[0] + " × " + p[1]).join(" or "), fill: [String(ps[0][0]), String(ps[0][1])]
  };
};

/* DOK 3 claims: the code tests the statement (or the counterexample), so the verdict cannot be wrong */
const par = v => (v % 2 ? "odd" : "even");
const FACTS = {
  sqsum(f) {            /* "two square numbers added always make an even (odd) number" */
    const a = f.eg[0], b = f.eg[1], s = a + b; need(isSq(a) && isSq(b) && par(s) !== f.says, "sqsum counterexample");
    return { ok: false, says: "If you add two square numbers, the answer is always " + f.says + ".",
      t: a + " + " + b + " = " + s + ", and " + s + " is " + par(s) + ".",
      worked: a + " and " + b + " are square numbers. " + a + " + " + b + " = " + s + ", and " + s + " is " + par(s) + ". So the answer is not always " + f.says + ".", pic: { k: "dotseq", ks: [Math.sqrt(a), Math.sqrt(b)] } };
  },
  primesum(f) {         /* "two prime numbers added always make an even number" */
    const a = f.eg[0], b = f.eg[1], s = a + b; need(isPrime(a) && isPrime(b) && s % 2 === 1, "primesum counterexample");
    return { ok: false, says: "If you add two prime numbers, the answer is always even.",
      t: a + " + " + b + " = " + s + ", and " + s + " is odd.",
      worked: a + " and " + b + " are prime numbers. " + a + " + " + b + " = " + s + ", and " + s + " is odd. So the answer is not always even." };
  },
  primeodd() {          /* "all prime numbers are odd": look for an even prime */
    let eg = 0; for (let v = 2; v <= 100 && !eg; v += 2) if (isPrime(v)) eg = v;
    return { ok: !eg, says: "All prime numbers are odd numbers.",
      t: eg + " is a prime number, and " + eg + " is even.",
      worked: "The factors of " + eg + " are 1 and " + eg + " only, so " + eg + " is a prime number. But " + eg + " is even. So not all prime numbers are odd.", pic: { k: "s6arr", n: eg } };
  },
  oddprime(f) {         /* "all odd numbers are prime" */
    const p = pairs(f.eg)[1]; need(f.eg % 2 === 1 && !isPrime(f.eg) && f.eg > 1, "oddprime counterexample");
    return { ok: false, says: "All odd numbers greater than 1 are prime numbers.",
      t: f.eg + " is odd, but " + f.eg + " = " + p[0] + " × " + p[1] + ". It is composite.",
      worked: f.eg + " is an odd number. But " + f.eg + " = " + p[0] + " × " + p[1] + ", so it has more than two factors. " + f.eg + " is odd and composite.", pic: { k: "s6arr", n: f.eg } };
  },
  trisum(f) {           /* "two triangular numbers next to each other add to a square number" */
    let ok = true; for (let k = 1; k <= 40; k++) if (!isSq(tri(k) + tri(k + 1))) ok = false;
    const egs = f.ks.map(k => tri(k) + " + " + tri(k + 1) + " = " + (tri(k) + tri(k + 1)));
    const k2 = f.ks[f.ks.length - 1], m2 = k2 + 1;
    return { ok: ok, says: "If you add two triangular numbers that are next to each other, you always get a square number.",
      t: "the two triangles always fit together to make a square, like " + tri(k2) + " + " + tri(m2) + " = " + m2 + " × " + m2 + ".",
      worked: "The triangular numbers are " + [1, 2, 3, 4, 5].map(tri).join(", ") + " ... " + egs.join(", ") + ". The answers " + andList(f.ks.map(k => String((k + 1) * (k + 1)))) +
        " are square numbers. Pattern " + k2 + " and pattern " + m2 + " fit together to make a square of " + m2 + " rows of " + m2 + ". This works for every pair next to each other.", pic: { k: "s6trisq", k2: k2 } };
  },
  tripar() {            /* "the triangular numbers go odd, odd, even, even" */
    const want = ["odd", "odd", "even", "even"]; let ok = true; for (let k = 1; k <= 40; k++) if (par(tri(k)) !== want[(k - 1) % 4]) ok = false;
    const t8 = [1, 2, 3, 4, 5, 6, 7, 8].map(tri);
    return { ok: ok, says: "The triangular numbers go odd, odd, even, even, and so on.",
      t: t8.join(", ") + " go " + t8.map(par).join(", ") + ".",
      worked: "The triangular numbers are " + t8.join(", ") + ". They go " + t8.map(par).join(", ") + ". The pattern repeats.", pic: { k: "s6tri", ks: [1, 2, 3, 4], cap: true } };
  },
  sqcomp(f) {           /* "a square number greater than 1 is never prime" */
    let ok = true; for (let k = 2; k <= 10; k++) if (isPrime(k * k)) ok = false;
    const r = Math.sqrt(f.eg); need(isSq(f.eg) && r > 1, "sqcomp example");
    return { ok: ok, says: "A square number greater than 1 is never a prime number.",
      t: "a square number is a number multiplied by itself, like " + f.eg + " = " + r + " × " + r + ". So it has a factor that is not 1 or itself.",
      worked: "4 = 2 × 2, 9 = 3 × 3, " + f.eg + " = " + r + " × " + r + ". Every square number greater than 1 has a factor that is not 1 or itself. So it has more than two factors: it is composite.", pic: { k: "s6arr", n: f.eg } };
  },
  nthdouble(f) {        /* "the (2n)th term is double the nth term" */
    const x = f.a + (f.n - 1) * f.d, y = f.a + (2 * f.n - 1) * f.d;
    return { ok: y === 2 * x, says: "My sequence is " + list(terms(f.a, f.d, 4)) + ", ... The " + ord(2 * f.n) + " term is double the " + ord(f.n) + " term.",
      t: "the " + ord(f.n) + " term is " + x + " and the " + ord(2 * f.n) + " term is " + y + ". Double " + x + " is " + 2 * x + (y === 2 * x ? "." : ", not " + y + "."),
      worked: "The " + ord(f.n) + " term is " + f.a + " + " + (f.n - 1) + " × " + f.d + " = " + x + ". The " + ord(2 * f.n) + " term is " + f.a + " + " + (2 * f.n - 1) + " × " + f.d + " = " + y + ". Double " + x + " is " + 2 * x + ".",
      pic: { k: "s6strip", a: f.a, d: f.d, show: 4, n: 2 * f.n, jumps: true, reveal: true } };
  }
};

/* A claim keeps the type 'claim' (the board and the test paper draw a claim by its type), so the code-checked claims of
   this stop go through M.claim: a claim with s6: { k, ... } is built and checked here, every other claim is untouched. */
const claim0 = M.claim;
M.claim = function (d) {
  if (!d.s6) return claim0(d);
  need(FACTS[d.s6.k], "unknown fact " + d.s6.k);
  const F = FACTS[d.s6.k](d.s6);
  need(F.ok === d.ok, "the claim of " + d.who + " is " + (F.ok ? "correct" : "incorrect") + " by the code, but the data says ok: " + d.ok);
  need(d.wrong && d.wrong.length === 2, "an s6 claim needs two wrong reasons");
  const model = d.who + " is " + (F.ok ? "correct" : "incorrect") + " because " + F.t;
  const t = claim0({ who: d.who, ok: F.ok, at: d.at, says: F.says, reasons: [{ t: F.t }].concat(d.wrong),
    hint: { pic: d.pic || null, step: d.tip }, worked: F.worked, model: model });
  t.worked.pic = F.pic || null;
  return t;
};
})();
