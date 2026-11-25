/* g4-models-s5.js - Stop 5 (Fractions, decimals and percentages): the question models. Loaded after 009c.
   No page code here. Every answer is WORKED OUT from the data, in whole numbers:
     a value is written in the data as a string: '3/10' (a fraction), '0.7' (one decimal place), '70%' (a percentage);
     V(s) reads it as num / den (3/10, 7/10, 70/100); hund(v) = its number of hundredths when that is a whole number;
     two values are compared by cross-multiplying (a.num × b.den against b.num × a.den), never with floats.

   MX.s5 = { F(n, d), V(s), hund(v), sym(a, b), rich(text) }   (F: a fraction with a bar, class g4s5-frac; plain text "3/10")

   s5conv      write a number in another form (typed).
               { type: 's5conv', rows: [['3/10', 'pct'], ['70%', 'dec'], ['43%', 'f100'], ['0.3', 'n10'], ['1/4', 'n100']], fig, pic }
               (or from, to for one row). to: pct "{0} %", dec, f100 = numerator and denominator boxes, n10 / n100 = the numerator.
   s5grid      a shape made of 100 squares: what percentage is shaded? { n, style: 'rows' | 'cols' | 'block' | 'scatter', cols: 10 | 20 | 25,
               ask: 'pct' | 'not' (not shaded) | 'frac' (n over 100) | 'pf' (percentage and fraction) | 'pd' (percentage and decimal) }
   s5pickgrid  tick the shape that shows a value: { show: '30%' | '3/10' | '0.3', wrong: [3, 13, 70], style, styles: [per option], at }
   s5shade     shade a value on the hundred square (the tap-to-shade tool s5shade): { want: '2/5' }
   s5two       two shadings, two steps, 2 marks: { who, he, first: '1/4', more: 15, show: 'none' | 'first' | 'both' }  total percentage
               or { who, first: '1/2', total: 64, ask: 'more' }  how many more squares
   s5cmp       <, > or = : { rows: [['0.8', '75%'], ['2/5', '0.4'], ['5/7', '3/7']], pic: 'bars' | 'line' (a figure for row 1) }
   s5order     order a mixed set, smallest first (the tile tool s5order): { vals: ['0.5', '2/5', '45%', '7/10'], text }
   s5pick      tick the greatest or the smallest: { vals: [...], ask: 'greatest' | 'smallest', at, text }
   s5same      tick the one that is equal (or, with not: true, not equal): { of: '3/5', opts: ['60%', '35%', '6%'], at, not }
               the FIRST option must be the right one: the model checks it and throws when the data is wrong.
   claim       (the shared model) with s5: [['0.3', '=', '30%'], ...] = facts the reasons use (each must be TRUE, checked here) and
               s5says: ['0.3', '=', '3%'] = the statement itself (its truth must match ok). A wrong key throws, so keys.js fails. */
(function () {
"use strict";
const M = MX.M, arrange = MX.arrange, LET = MX.LET, eq = MX.eq, num = MX.num;
const SYMH = { "<": "&lt;", ">": "&gt;", "=": "=" };
const DIV = "÷", X = "×";
const NAMES = { 2: "half", 3: "third", 4: "quarter", 5: "fifth", 6: "sixth", 7: "seventh", 8: "eighth", 9: "ninth", 10: "tenth", 12: "twelfth", 20: "twentieth", 25: "twenty-fifth", 50: "fiftieth", 100: "hundredth" };
const plural = d => (d === 2 ? "halves" : NAMES[d] + "s");
const cnt = (n, d) => n + " " + (n === 1 ? NAMES[d] : plural(d));

/* a fraction the way it is written on paper: numerator over denominator with a bar. The hidden slash keeps the plain text "3/10". */
const F = (n, d) => '<span class="g4s5-frac"><span class="g4s5-frac__n">' + n + '</span><span class="g4s5-frac__s">/</span><span class="g4s5-frac__d">' + d + "</span></span>";
/* a fraction with an answer box as numerator (FB) or two answer boxes (FB2) */
const FB = (i, d) => '<span class="g4s5-frac g4s5-frac--ask">{' + i + '}<span class="g4s5-frac__s">/</span><span class="g4s5-frac__d">' + d + "</span></span>";
const FB2 = (i, j) => '<span class="g4s5-frac g4s5-frac--ask"><span class="g4s5-frac__n">{' + i + '}</span><span class="g4s5-frac__s">/</span><span class="g4s5-frac__d">{' + j + "}</span></span>";
/* plain text with 3/10 in it -> HTML with real fractions (captions, labels) */
const rich = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/(^|[^\d\/.,])(\d{1,3})\/(\d{1,3})(?![\d\/])/g, (m, pre, n, d) => pre + F(n, d));

/* read a value */
function V(s) {
  s = String(s).trim(); let m;
  if ((m = /^(\d+)\/(\d+)$/.exec(s))) { const n = +m[1], d = +m[2]; if (!d) throw new Error("s5: bad fraction " + s); return { k: "f", n: n, d: d, num: n, den: d, html: F(n, d), txt: n + "/" + d }; }
  if ((m = /^(\d+)%$/.exec(s))) return { k: "p", p: +m[1], num: +m[1], den: 100, html: m[1] + "%", txt: s };
  if ((m = /^(\d+)\.(\d)$/.exec(s))) return { k: "d", t: +m[1] * 10 + +m[2], num: +m[1] * 10 + +m[2], den: 10, html: s, txt: s };
  if (/^\d+$/.test(s)) return { k: "w", num: +s, den: 1, html: s, txt: s };
  throw new Error("s5: cannot read the value " + s);
}
const hund = v => ((v.num * 100) % v.den === 0 ? v.num * 100 / v.den : null);
const cmpV = (a, b) => a.num * b.den - b.num * a.den;
const sym = (a, b) => { const c = cmpV(a, b); return c < 0 ? "<" : c > 0 ? ">" : "="; };
const holds = (a, rel, b) => { const s = sym(V(a), V(b)); return rel === "=" ? s === "=" : rel === "<" ? s === "<" : rel === ">" ? s === ">" : rel === "!=" ? s !== "=" : false; };
const decS = h => (h % 10 === 0 ? (h / 100).toFixed(1) : (h / 100).toFixed(2));
const hs = h => h + (h === 1 ? " hundredth" : " hundredths");
const need = (v, what) => { const h = hund(v); if (h == null) throw new Error("s5: " + v.txt + " is not a whole number of hundredths (" + what + ")"); return h; };

/* Stage 5 limits (5Nf.08): two fractions are compared only when they have the SAME denominator; a fraction compared with a
   decimal or a percentage must be one whose percentage the child knows (halves, quarters, fifths, tenths, hundredths). */
const KNOWN = { 2: 1, 4: 1, 5: 1, 10: 1, 100: 1 };
function fair(vs, what) {
  const fr = vs.filter(v => v.k === "f");
  if (fr.some(f => f.d !== fr[0].d)) throw new Error(what + ": fractions with different denominators (" + fr.map(f => f.txt).join(", ") + ") are not compared at Stage 5");
  if (fr.length < vs.length && fr.some(f => !KNOWN[f.d])) throw new Error(what + ": " + fr.map(f => f.txt).join(", ") + " cannot be compared with a decimal or a percentage at Stage 5");
  if (fr.some(f => f.n >= f.d)) throw new Error(what + ": only proper fractions");
}

/* one sentence: how many hundredths a value is */
function why100(v) {
  const h = hund(v);
  if (v.k === "p") return v.html + " means " + hs(h) + ".";
  if (v.k === "d") return v.html + " is " + v.t + (v.t === 1 ? " tenth" : " tenths") + ". That is " + hs(h) + ".";
  if (v.k === "w") return v.html + (v.num === 1 ? " whole is " : " is ") + hs(h) + ".";
  if (v.d === 100) return v.html + " is " + hs(h) + ".";
  if (v.d === 10) return v.html + " is " + v.n + (v.n === 1 ? " tenth" : " tenths") + ". That is " + hs(h) + ".";
  const u = 100 / v.d;
  return v.n === 1 ? "One " + NAMES[v.d] + " of 100 is 100 " + DIV + " " + v.d + " = " + u + ". So " + v.html + " is " + hs(h) + "."
    : "One " + NAMES[v.d] + " of 100 is 100 " + DIV + " " + v.d + " = " + u + ". So " + v.html + " is " + v.n + " " + X + " " + u + " = " + hs(h) + ".";
}
/* the classic mix-ups between two forms; null when the pair is not one of them */
function mixup(a, b) {
  const pick = k => (a.k === k ? a : b.k === k ? b : null), d = pick("d"), p = pick("p"), f = pick("f");
  if (d && p && p.p === d.t) return d.html + " is " + d.t + " tenths, but " + p.html + " is " + p.p + " hundredths. " + d.t + " tenths = " + d.t * 10 + " hundredths, so " + d.html + " = " + d.t * 10 + "%.";
  if (f && p && f.d === 10 && p.p === f.n) return f.html + " is " + cnt(f.n, 10) + ", but " + p.html + " is " + hs(p.p) + ". " + f.html + " = " + f.n * 10 + "%.";
  if (f && p && p.p === f.d && hund(f) != null) return "The " + f.d + " in " + f.html + " is the denominator: the whole is cut into " + f.d + " equal parts. " + why100(f) + " That is " + hund(f) + "%, not " + p.html + ".";
  if (f && d && d.t === f.n * 10 + f.d) return d.html + " is more than 1 whole. " + f.html + " is less than 1 whole.";
  return null;
}
const blank = (len, dec, w) => ({ len: len, w: w || "g4s5", dec: !!dec });
const got = x => x !== "" && x != null;
const gridPic = (h, size, style) => ({ k: "s5grid", n: h, style: style || (h % 10 === 0 ? "rows" : h % 5 === 0 ? "block" : "rows"), size: size || "m" });
const linePic = vals => ({ k: "s5line", marks: vals });

/* ---------- write a number in another form ---------- */
M.s5conv = function (d) {
  const rows = (d.rows || [[d.from, d.to]]).map(r => { const v = V(r[0]); return { v: v, to: r[1], h: need(v, "s5conv") }; });
  const lines = [], blanks = [], ans = [], says = [], keys = [], works = [];
  let lastWhy = "";
  const why1 = v => { const w = why100(v); if (w === lastWhy) return ""; lastWhy = w; return w + " "; };
  rows.forEach(rw => {
    const i = ans.length, v = rw.v, h = rw.h;
    rw.at = i;
    if (rw.to === "pct") {
      lines.push(v.html + " = {" + i + "} %"); blanks.push(blank(3)); ans.push(h); says.push(v.html + " = " + h + "%"); keys.push(h + "%");
      works.push(why1(v) + "So " + v.html + " = " + h + "%.");
    } else if (rw.to === "dec") {
      if (h % 10) throw new Error("s5conv: " + v.txt + " is not a decimal with one decimal place");
      lines.push(v.html + " = {" + i + "}"); blanks.push(blank(4, true)); ans.push(h / 100); says.push(v.html + " = " + decS(h)); keys.push(decS(h));
      works.push(why1(v) + hs(h) + " = " + h / 10 + (h === 10 ? " tenth" : " tenths") + " = " + decS(h) + ".");
    } else if (rw.to === "n10") {
      if (h % 10) throw new Error("s5conv: " + v.txt + " is not a whole number of tenths");
      lines.push(v.html + " = " + FB(i, 10)); blanks.push(blank(2, false, "g4s5f")); ans.push(h / 10); says.push(v.html + " = " + F(h / 10, 10)); keys.push(h / 10 + "/10");
      works.push(why1(v) + hs(h) + " = " + cnt(h / 10, 10) + " = " + F(h / 10, 10) + ".");
    } else if (rw.to === "n100") {
      lines.push(v.html + " = " + FB(i, 100)); blanks.push(blank(3, false, "g4s5f")); ans.push(h); says.push(v.html + " = " + F(h, 100)); keys.push(h + "/100");
      works.push(why100(v) + " So " + v.html + " = " + F(h, 100) + ".");
    } else if (rw.to === "f100") {
      lines.push(v.html + " = " + FB2(i, i + 1)); blanks.push(blank(3, false, "g4s5f"), blank(3, false, "g4s5f")); ans.push(h, 100); says.push(v.html + " = " + F(h, 100)); keys.push(h + "/100");
      works.push((v.k === "p" ? "Per cent means out of 100. " : why100(v) + " ") + "So " + v.html + " = " + F(h, 100) + ".");
    } else throw new Error("s5conv: unknown form " + rw.to);
  });
  const tos = rows.map(r => r.to), same = tos.every(t => t === tos[0]), one = rows.length === 1, r0 = rows[0], allP = rows.every(r => r.v.k === "p");
  const q = d.q || (!same || tos[0] === "n10" || tos[0] === "n100" ? "Write the missing " + (ans.length > 1 ? "numbers." : "number.")
    : tos[0] === "pct" ? (one ? "Write " + r0.v.html + " as a [[percentage]]." : "Write each number as a [[percentage]].")
    : tos[0] === "dec" ? (one ? "Write " + r0.v.html + " as a decimal." : "Write each " + (allP ? "[[percentage]]" : "number") + " as a decimal.")
    : (one ? "Write " + r0.v.html + " as a fraction with denominator 100." : "Write each " + (allP ? "[[percentage]]" : "number") + " as a fraction with denominator 100."));
  function slip(rw, i, x) {
    const v = rw.v, h = rw.h;
    if (rw.to === "f100" && i === rw.at + 1) return "Per cent means out of 100. The denominator is 100.";
    if (rw.to === "pct" || rw.to === "n100" || rw.to === "f100") {
      const m = rw.to === "pct" && Number.isInteger(x) && x >= 0 ? mixup(v, V(x + "%")) : null;
      if (m) return m;
      if (v.k === "f" && x === v.n * 10 + v.d && v.n < 10) return "You wrote the digits of the fraction. " + why100(v);
      if (v.k === "f" && x === v.n && v.d !== 100) return v.n + " is the numerator. " + why100(v);
      if (v.k === "f" && x === v.d && v.d !== 100) return v.d + " is the denominator. " + why100(v);
      if (v.k === "d" && x === v.t) return v.html + " is " + v.t + " tenths, not " + v.t + " hundredths. 1 tenth = 10 hundredths.";
      if (rw.to !== "pct" && v.k === "p") return "The numerator is the number of hundredths. " + why100(v);
      return why100(v);
    }
    if (rw.to === "dec") {
      if (eq(x, h)) return h + "% is less than 1 whole. " + hs(h) + " = " + h / 10 + " tenths. Write the tenths after the decimal point.";
      if (eq(x, h / 10)) return h / 10 + " would be " + h / 10 + " wholes. " + v.html + " is less than 1 whole: write 0 ones, then the tenths.";
      if (eq(x, h / 1000)) return decS(h / 10) + " is " + hs(h / 10) + ". " + v.html + " is " + hs(h) + " = " + h / 10 + " tenths.";
      if (v.k === "f" && eq(x, v.n + v.d / 10)) return "Do not write the numerator and the denominator as digits. " + why100(v);
      return why100(v) + " How many tenths is that?";
    }
    if (rw.to === "n10") return x === h ? "That is the number of hundredths. The denominator here is 10: how many tenths?" : why100(v) + " 10 hundredths = 1 tenth.";
    return why100(v);
  }
  const f0 = r0.v.k, tip = d.tip || (tos[0] === "pct" ? (f0 === "d" ? "Tenths are not hundredths. 1 tenth = 10 hundredths = 10%." : "Per cent means out of 100. Find the equal fraction with denominator 100.")
    : tos[0] === "dec" ? "Per cent means hundredths. 10 hundredths = 1 tenth = 0.1." : tos[0] === "n10" ? "The first place after the decimal point is tenths." : "Per cent means out of 100.");
  return {
    q: q, marks: d.marks || rows.length, lines: lines, blanks: blanks, fig: d.fig || null,
    check(r) {
      const vals = r.v || [], parts = ans.map((a, i) => got(vals[i]) && eq(a, vals[i]));
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      const i = parts.indexOf(false), rw = rows.filter(x => x.at <= i).pop();
      return { ok: false, msg: (rows.length > 1 ? "Look at line " + (rows.indexOf(rw) + 1) + ". " : "") + slip(rw, i, num(vals[i])), parts: parts };
    },
    hint: { pic: d.pic || (r0.h % 10 === 0 ? linePic([r0.v.txt]) : gridPic(r0.h)), step: tip },
    worked: { text: works.join(" ") },
    yes: says.join(" and ") + ".", key: keys.join(" ; "), fill: ans.map(a => String(Math.round(a * 100) / 100))
  };
};

/* ---------- a shape made of 100 squares: what percentage is shaded? ---------- */
M.s5grid = function (d) {
  const n = d.n, cols = d.cols || 10, style = d.style || "rows", ask = d.ask || "pct";
  if (!(n >= 0 && n <= 100) || 100 % cols) throw new Error("s5grid: bad grid");
  const fig = { k: "s5grid", n: n, style: style, cols: cols };
  const full = Math.floor(n / 10), rest = n % 10, lineName = style === "cols" ? "column" : "row";
  const count = (style === "rows" || style === "cols") && cols === 10
    ? (full ? full + " full " + lineName + (full === 1 ? "" : "s") + " of 10 " + (full === 1 ? "is" : "are") + " " + full * 10 + " squares" + (rest ? ", and " + rest + " more" : "") + ". " : "")
    : "";
  const base = "The shape has 100 equal squares, so each square is 1%. " + count + "<b>" + n + "</b> squares are shaded.";
  const lines = [], blanks = [], ans = [], keys = [];
  let q, yes;
  if (ask === "not") { q = "What [[percentage]] of the shape is <b>not</b> shaded?"; lines.push("{0} %"); blanks.push(blank(3)); ans.push(100 - n); keys.push(100 - n + "%"); yes = (100 - n) + "% of the shape is not shaded."; }
  else if (ask === "frac") { q = "What fraction of the shape is shaded?"; lines.push(FB2(0, 1)); blanks.push(blank(3, false, "g4s5f"), blank(3, false, "g4s5f")); ans.push(n, 100); keys.push(n + "/100"); yes = F(n, 100) + " of the shape is shaded."; }
  else if (ask === "pf") { q = "Write the part that is shaded as a [[percentage]] and as a fraction."; lines.push("{0} %", FB(1, 100)); blanks.push(blank(3), blank(3, false, "g4s5f")); ans.push(n, n); keys.push(n + "%", n + "/100"); yes = n + "% = " + F(n, 100) + " of the shape is shaded."; }
  else if (ask === "pd") { if (n % 10) throw new Error("s5grid: pd needs tens"); q = "Write the part that is shaded as a [[percentage]] and as a decimal."; lines.push("{0} %", "{1}"); blanks.push(blank(3), blank(4, true)); ans.push(n, n / 100); keys.push(n + "%", decS(n)); yes = n + "% = " + decS(n) + " of the shape is shaded."; }
  else { q = "What [[percentage]] of the shape is shaded?"; lines.push("{0} %"); blanks.push(blank(3)); ans.push(n); keys.push(n + "%"); yes = n + "% of the shape is shaded."; }
  const worked = ask === "not" ? base + " 100 − " + n + " = " + (100 - n) + " squares are not shaded. That is " + (100 - n) + "%."
    : base + " " + n + " out of 100 is " + F(n, 100) + " = " + n + "%." + (ask === "pd" ? " " + hs(n) + " = " + n / 10 + " tenths = " + decS(n) + "." : "");
  return {
    q: "This shape is made of <b>100</b> equal squares. " + q, marks: d.marks || lines.length, lines: lines, blanks: blanks, fig: fig,
    check(r) {
      const vals = r.v || [], parts = ans.map((a, i) => got(vals[i]) && eq(a, vals[i]));
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      const i = parts.indexOf(false), x = num(vals[i]), pre = ans.length > 1 ? "Look at box " + (i + 1) + ". " : "";
      let msg;
      if (ask === "frac" && i === 1) msg = "The shape has 100 equal squares. The denominator is 100.";
      else if (ask === "pf" && i === 1) msg = "The fraction is the number of shaded squares out of 100. Count the shaded squares: the numerator is the same number as the percentage.";
      else if (ask === "pd" && i === 1) msg = eq(x, n) || eq(x, n / 10) ? n + "% is less than 1 whole. " + hs(n) + " = " + n / 10 + " tenths = 0 ones and " + n / 10 + " tenths." : hs(n) + " = " + n / 10 + " tenths. Write the tenths after the decimal point.";
      else if (ask !== "not" && x === 100 - n && n !== 50) msg = "You counted the squares that are <b>not</b> shaded. Count the shaded squares.";
      else if (ask === "not" && x === n && n !== 50) msg = "That is the shaded part. The question asks for the part that is <b>not</b> shaded: 100 − " + n + ".";
      else if (count && full && x === full) msg = "You counted the " + lineName + "s. Each " + lineName + " has 10 squares: " + full + " " + lineName + (full === 1 ? "" : "s") + " = " + full * 10 + " squares.";
      else if (count && rest && x === full + rest) msg = "A full " + lineName + " is 10 squares, not 1. Count " + full * 10 + " for the full " + lineName + "s, then add " + rest + ".";
      else msg = "Count again. Count the full rows or columns of 10 first, then the extra squares. Each square is 1%.";
      return { ok: false, msg: pre + msg, parts: parts };
    },
    hint: { step: d.tip || "Each small square is 1 out of 100. That is 1%. Count in tens first." },
    worked: { text: worked },
    yes: yes, key: keys.join(" ; "), fill: ans.map(a => String(Math.round(a * 100) / 100))
  };
};

/* ---------- tick the shape that shows a value ---------- */
M.s5pickgrid = function (d) {
  const v = V(d.show), h = need(v, "s5pickgrid"), styles = d.styles || [], cols = d.cols || 10;
  if (d.wrong.indexOf(h) >= 0 || new Set(d.wrong).size !== d.wrong.length) throw new Error("s5pickgrid: bad wrong options");
  const why = n => {
    const base = "This shape has " + n + " shaded " + (n === 1 ? "square" : "squares") + " out of 100. That is " + n + "%. ";
    if (v.k === "f" && n === v.d) return base + "The " + v.d + " in " + v.html + " is the denominator. " + why100(v);
    if (n * 10 === h) return base + (v.k === "p" ? v.html + " is " + h + " squares, not " + n + "." : why100(v));
    if (n === 100 - h) return "Here " + h + " squares are <b>not</b> shaded. Look at the shaded squares: " + n + ".";
    return base + (v.k === "p" ? "You need " + h + " shaded squares." : why100(v));
  };
  const opts = arrange([h].concat(d.wrong).map((n, i) => ({ html: "", fig: { k: "s5grid", n: n, style: styles[i] || d.style || "rows", cols: cols, size: "s" }, alt: "A shape with " + n + " of 100 squares shaded", ok: i === 0, why: i ? why(n) : "" })), d.at);
  const good = opts.findIndex(o => o.ok);
  return {
    q: "Each shape is made of <b>100</b> equal squares. Which shape has <b>" + v.html + "</b> shaded?", sub: "Tick (✓) one box.", letters: true, opts: opts,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || "Count the shaded squares in each shape." }; },
    hint: { step: d.tip || (v.k === "p" ? "Per cent means out of 100. " + v.html + " is " + h + " squares out of 100." : "First change " + v.html + " to hundredths. Then count the shaded squares.") },
    worked: { text: why100(v) + " So " + h + " of the 100 squares are shaded: shape " + LET[good] + ".", pic: { k: "s5grid", n: h, style: styles[0] || d.style || "rows", cols: cols, size: "m" } },
    yes: (v.k === "p" ? v.html : v.html + " = " + h + "%") + " is " + h + " squares out of 100. Shape " + LET[good] + " shows it.", key: LET[good] + ": " + h + " squares shaded"
  };
};

/* ---------- shade a value on the hundred square (tap-to-shade) ---------- */
M.s5shade = function (d, mode) {
  const v = V(d.want), h = need(v, "s5shade");
  return {
    q: "Shade <b>" + v.html + "</b> of the hundred square.",
    how: mode === "our" ? "Tap <b>+10</b> to shade a row of 10. Tap <b>+1</b> or a square to shade one square." : "Tap a square to shade it. The buttons shade 1 or 10 squares.",
    ui: { k: "s5shade", n: d.start || 0 }, right: { shaded: h },
    ready: r => r.shaded > 0,
    given: r => String(r.shaded),
    check(r) {
      const x = r.shaded;
      if (x === h) return { ok: true };
      let msg;
      if (v.k === "f" && x === v.d) msg = "The " + v.d + " in " + v.html + " is the denominator, not the number of squares. " + why100(v);
      else if (v.k === "f" && v.d !== 10 && x === v.n * 10) msg = "That would be " + cnt(v.n, 10) + ". " + why100(v);
      else if (x * 10 === h) msg = (v.k === "p" ? v.html + " is " + h + " out of 100: " + h + " squares, not " + x + "." : why100(v) + " You shaded only " + x + ".");
      else if (x === 100 - h) msg = "You shaded " + x + " squares. Now " + h + " squares are <b>not</b> shaded. Shade " + h + " squares.";
      else msg = "You shaded " + x + (x === 1 ? " square" : " squares") + ". That is " + x + "%. " + (v.k === "p" ? "You need " + v.html + "." : why100(v));
      return { ok: false, msg: msg };
    },
    hint: { pic: v.k === "f" && v.d !== 10 && v.d !== 100 ? { k: "s5bars", den: v.d, nums: [v.n] } : linePic([v.txt]), step: v.k === "p" ? "Per cent means out of 100. One square is 1%." : "Change " + v.html + " to hundredths first. " + (v.k === "f" && v.d !== 10 ? "Share the 100 squares into " + v.d + " equal parts." : "1 tenth is 10 squares.") },
    worked: { text: why100(v) + " Shade " + h + " squares: " + (h % 10 === 0 ? h / 10 + " rows of 10." : Math.floor(h / 10) + " rows of 10 and " + h % 10 + " more.") },
    yes: v.html + " of 100 squares is " + h + " squares" + (v.k === "p" ? "." : ". That is " + h + "%."), key: h + " squares shaded"
  };
};

/* ---------- two shadings: a fraction of the shape, then some more squares (2 marks) ---------- */
M.s5two = function (d) {
  const v = V(d.first), a = need(v, "s5two"), more = d.ask === "more", total = more ? d.total : a + d.more, k = total - a;
  if (!(k > 0) || total > 100) throw new Error("s5two: bad numbers");
  const she = d.he ? "he" : "she", show = d.show || "none";
  const fig = { k: "s5grid", n: show === "none" ? 0 : a, b: show === "both" ? k : 0, style: d.style || "rows", size: show === "none" ? "m" : "l" };
  const both = { k: "s5grid", n: a, b: k, style: d.style || "rows", size: "m" };
  const ans = [a, more ? k : total];
  const q = d.who + " shades <b>" + v.html + "</b> of a shape of <b>100</b> equal squares. " + (more
    ? "Then " + she + " shades more. Now <b>" + total + "%</b> is shaded. How many more squares did " + she + " shade?"
    : "Then " + she + " shades <b>" + k + "</b> more squares. What [[percentage]] is shaded now?");
  return {
    q: q, marks: 2, fig: fig,
    lines: [v.html + " of 100 = {0} squares", more ? "More squares: {1}" : "Shaded now: {1} %"], blanks: [blank(3), blank(3)],
    check(r) {
      const vals = r.v || [], parts = ans.map((x, i) => got(vals[i]) && eq(x, vals[i]));
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      const x0 = num(vals[0]), x1 = num(vals[1]);
      let msg;
      if (!parts[0]) {
        msg = "Look at box 1. " + (v.k === "f" && x0 === v.d ? "The " + v.d + " in " + v.html + " is the denominator. It is not the number of squares. " + why100(v)
          : v.k === "f" && x0 === v.n * 10 + v.d ? "You wrote the digits of the fraction. " + why100(v)
          : v.k === "f" && v.d !== 10 && x0 === v.n * 10 ? "That would be " + cnt(v.n, 10) + ". " + why100(v)
          : why100(v));
      } else if (more) {
        msg = "Look at box 2. " + (x1 === total ? total + " squares are shaded in all. " + a + " of them were there at the start. Subtract." : x1 === total + a ? "Do not add. Find the difference between " + total + " and " + a + "." : total + "% is " + total + " squares. " + d.who + " started with " + a + ". How many more is that?");
      } else {
        msg = "Look at box 2. " + (x1 === a ? "That is only the first part. Add the " + k + " more squares." : x1 === k ? "That is only the extra squares. Add them to the " + a + " squares." : x1 === 100 - total ? "That is the part that is not shaded. Add " + a + " and " + k + "." : "Add the two parts: " + a + " + " + k + ". Each square is 1%.");
      }
      return { ok: false, msg: msg, parts: parts };
    },
    hint: { pic: show === "none" ? { k: "s5grid", n: a, style: d.style || "rows", size: "m" } : null, step: "Step 1: change " + v.html + " to squares out of 100. Step 2: " + (more ? "find how many more squares make " + total + "." : "add the " + k + " more squares.") },
    worked: { text: why100(v) + " " + (more ? total + "% is " + total + " squares. " + total + " − " + a + " = " + k + " more squares." : a + " + " + k + " = " + total + " squares out of 100. That is " + total + "%."), pic: both },
    yes: more ? v.html + " is " + a + " squares, and " + total + " − " + a + " = " + k + " more squares." : v.html + " is " + a + " squares, and " + a + " + " + k + " = " + total + ". So " + total + "% is shaded.",
    key: a + " ; " + (more ? k : total + "%"), fill: ans.map(String)
  };
};

/* ---------- compare with <, > or = ---------- */
function rowWhy(a, b) {
  const s = sym(a, b), word = s === "<" ? "less than" : s === ">" ? "greater than" : "equal to";
  if (a.k === "f" && b.k === "f" && a.d === b.d) return "Both fractions are " + plural(a.d) + ", so the parts are the same size. Compare the numerators: " + a.n + " is " + word + " " + b.n + ".";
  const ha = need(a, "s5cmp"), hb = need(b, "s5cmp");
  return "Change both to hundredths. " + why100(a) + " " + why100(b) + " " + ha + " is " + word + " " + hb + ".";
}
/* the same, short, for the feedback after a first miss (it does not give the sign away) */
function rowTip(a, b) {
  if (a.k === "f" && b.k === "f" && a.d === b.d) return "Both fractions are " + plural(a.d) + ". Compare the numerators " + a.n + " and " + b.n + ".";
  return "Change both to hundredths: " + a.html + " = " + hs(hund(a)) + " and " + b.html + " = " + hs(hund(b)) + ". Now compare.";
}
const face = v => (v.k === "d" ? v.t / 10 : v.k === "p" ? v.p : null);
function cmpPic(a, b) {
  if (a.k === "f" && b.k === "f" && a.d === b.d) return { k: "s5bars", den: a.d, nums: [a.n, b.n] };
  return hund(a) != null && hund(b) != null ? linePic([a.txt, b.txt]) : null;
}
M.s5cmp = function (d) {
  const rows = d.rows.map(r => ({ a: V(r[0]), b: V(r[1]) })), ans = rows.map(r => sym(r.a, r.b)), two = rows.length > 1;
  rows.forEach(r => { fair([r.a, r.b], "s5cmp"); if (!(r.a.k === "f" && r.b.k === "f" && r.a.d === r.b.d)) { need(r.a, "s5cmp"); need(r.b, "s5cmp"); } });
  const r0 = rows[0], rh = d.pic && rows[1] ? rows[1] : r0;   // with a figure for row 1, the hint pictures row 2
  return {
    q: "Write <b>&lt;</b>, <b>&gt;</b> or <b>=</b> in " + (two ? "each box." : "the box."), marks: rows.length,
    fig: d.pic ? cmpPic(r0.a, r0.b) : null,
    lines: rows.map((r, i) => r.a.html + " {" + i + "} " + r.b.html), blanks: rows.map(() => ({ len: 1, w: "box", sym: true })),
    given: r => (r.v || []).join(" "),
    check(r) {
      const vals = r.v || [], parts = rows.map((x, i) => vals[i] === ans[i]);
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      const i = parts.indexOf(false), a = rows[i].a, b = rows[i].b, fa = face(a), fb = face(b), pre = two ? "Look at line " + (i + 1) + ". " : "";
      let msg = null;
      if (vals[i] === "=") msg = mixup(a, b);
      if (!msg && a.k !== b.k && fa != null && fb != null && vals[i] === (fa < fb ? "<" : fa > fb ? ">" : "=")) {
        const dv = a.k === "d" ? a : b, pv = a.k === "p" ? a : b;
        msg = "Do not compare " + dv.html + " with " + pv.p + ". " + rowTip(a, b);
      }
      if (!msg && a.k === "f" && b.k === "f" && a.d === b.d && ans[i] !== "=" && vals[i] === "=") msg = "The denominators are the same, but the numerators are not. " + rowTip(a, b);
      return { ok: false, msg: pre + (msg || rowTip(a, b)), parts: parts };
    },
    hint: { pic: cmpPic(rh.a, rh.b), step: d.tip || (rh.a.k === "f" && rh.b.k === "f" ? "Same denominator: compare the numerators. " : "Change both numbers to hundredths (or to percentages). ") + "The open side of the sign points to the greater number." },
    worked: { text: rows.map((r, i) => rowWhy(r.a, r.b) + " So " + r.a.html + " " + SYMH[ans[i]] + " " + r.b.html + ".").join(" ") },
    yes: rows.map((r, i) => r.a.html + " " + SYMH[ans[i]] + " " + r.b.html).join(" and ") + ".",
    key: ans.map(x => SYMH[x]).join(" ; "), fill: ans
  };
};

/* ---------- order a mixed set, smallest first ---------- */
const listOf = (vs, how) => vs.map(how).join(", ");
const asPct = vs => vs.map(v => (v.k === "p" ? v.html : v.html + " = " + need(v, "order") + "%")).join(", ");
function sortVals(vals) {
  const vs = vals.map(V); fair(vs, "s5order/s5pick");
  const idx = vs.map((v, i) => i).sort((i, j) => cmpV(vs[i], vs[j]));
  for (let i = 1; i < idx.length; i++) if (cmpV(vs[idx[i - 1]], vs[idx[i]]) === 0) throw new Error("s5: two equal values in " + vals.join(", "));
  return { vs: vs, idx: idx };
}
M.s5order = function (d, mode) {
  const s = sortVals(d.vals), vs = s.vs, idx = s.idx, sorted = idx.map(i => vs[i]);
  const sameDen = vs.every(v => v.k === "f" && v.d === vs[0].d);
  if (!sameDen) vs.forEach(v => need(v, "s5order"));
  return {
    q: (d.text ? d.text + " " : "") + "Put the numbers in order. Start with the <b>smallest</b>.",
    how: mode === "our" ? "Change every number to a percentage. Then tap the smallest first." : "Tap the numbers in order, smallest first. Tap a placed number to take it back.",
    ui: { k: "s5order", items: vs.map(v => ({ html: v.html, txt: v.txt })), from: "smallest", to: "greatest" }, right: { order: idx },
    ready: r => Array.isArray(r.order) && r.order.every(x => x != null),
    given: r => (r.order || []).map(i => (i == null ? "_" : vs[i].txt)).join(", "),
    check(r) {
      const o = r.order || [], parts = idx.map((j, i) => o[i] != null && cmpV(vs[o[i]], vs[j]) === 0);
      if (parts.every(Boolean)) return { ok: true, parts: parts };
      if (o.every((x, i) => x === idx[idx.length - 1 - i])) return { ok: false, msg: "This is greatest first. Start with the smallest number.", parts: parts };
      const i = parts.indexOf(false);
      return { ok: false, msg: "Look at place " + (i + 1) + ". " + (sameDen ? "The denominators are the same. Compare the numerators." : "Change every number to a percentage: " + asPct(vs) + "."), parts: parts };
    },
    hint: { pic: sameDen ? { k: "s5bars", den: vs[0].d, nums: vs.map(v => v.n) } : { k: "s5line", marks: vs.map(v => v.txt), flags: true }, step: sameDen ? "Same denominator: the smaller numerator is the smaller fraction." : "Change every number to hundredths or to a percentage. Then compare." },
    worked: { text: (sameDen ? "The denominators are the same, so compare the numerators. " : "As percentages: " + asPct(vs) + ". ") + "From smallest to greatest: " + listOf(sorted, v => v.html) + "." },
    yes: "From smallest to greatest: " + listOf(sorted, v => v.html) + ".", key: listOf(sorted, v => v.txt)
  };
};

/* ---------- tick the greatest or the smallest ---------- */
M.s5pick = function (d) {
  const s = sortVals(d.vals), vs = s.vs, big = d.ask !== "smallest", want = big ? s.idx[s.idx.length - 1] : s.idx[0], ask = big ? "greatest" : "smallest";
  const sameDen = vs.every(v => v.k === "f" && v.d === vs[0].d);
  if (!sameDen) vs.forEach(v => need(v, "s5pick"));
  const w = vs[want], say = v => (sameDen ? v.html : v.html + " = " + hund(v) + "%");
  const rest = vs.filter((v, i) => i !== want);
  const opts = arrange([w].concat(rest).map((v, i) => ({ html: v.html, alt: v.txt, ok: i === 0, why: i ? (sameDen ? "The denominators are the same. Compare the numerators: " + w.n + " is " + (big ? "greater" : "less") + " than " + v.n + "." : say(v) + ", but " + say(w) + ". " + (big ? "That is greater." : "That is less.")) : "" })), d.at);
  return {
    q: (d.text ? d.text + " " : "") + "Which is the <b>" + ask + "</b>?", sub: "Tick (✓) one box.", letters: true, opts: opts, fig: d.fig || null,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || "Compare them one by one." }; },
    hint: { pic: sameDen ? { k: "s5bars", den: vs[0].d, nums: vs.map(v => v.n) } : { k: "s5line", marks: vs.map(v => v.txt), flags: true }, step: sameDen ? "Same denominator: compare the numerators." : "Change every number to a percentage. Then compare." },
    worked: { text: (sameDen ? "The denominators are the same, so compare the numerators. " : "As percentages: " + asPct(vs) + ". ") + "The " + ask + " is " + w.html + "." },
    yes: "The " + ask + " is " + w.html + ".", key: LET[opts.findIndex(o => o.ok)] + ": " + w.txt
  };
};

/* ---------- tick the one that is equal (or not equal) ---------- */
M.s5same = function (d) {
  const v = V(d.of), h = need(v, "s5same"), os = d.opts.map(V), not = !!d.not;
  os.forEach((o, i) => { const same = cmpV(o, v) === 0; if ((i === 0) === (not ? same : !same)) throw new Error("s5same: option " + o.txt + " is in the wrong place for " + v.txt); });
  const opts = arrange(os.map((o, i) => ({ html: o.html, alt: o.txt, ok: i === 0,
    why: i ? (not ? o.html + " is equal to " + v.html + ": both are " + hs(h) + "." : (mixup(v, o) || why100(o) + " But " + v.html + " is " + hs(h) + ".")) : "" })), d.at);
  const good = os[0];
  return {
    q: (d.text ? d.text + " " : "") + "Which is <b>" + (not ? "not " : "") + "equal</b> to <b>" + v.html + "</b>?", sub: "Tick (✓) one box.", letters: true, opts: opts, fig: d.fig || null,
    check(r) { const o = opts[r.pick]; return o && o.ok ? { ok: true } : { ok: false, msg: (o && o.why) || "Change each one to hundredths." }; },
    hint: { pic: d.pic || (h % 10 === 0 ? linePic([v.txt]) : gridPic(h)), step: d.tip || "Change " + v.html + " to hundredths. Then change each answer to hundredths." },
    worked: { text: not ? why100(v) + " " + why100(good) + " So " + good.html + " is not equal to " + v.html + "." : why100(v) + " " + why100(good) + " So " + v.html + " = " + good.html + "." },
    yes: not ? good.html + " is not equal to " + v.html + "." : v.html + " = " + good.html + ".", key: LET[opts.findIndex(o => o.ok)] + ": " + good.txt
  };
};

/* ---------- claims of this stop: the facts in the data are checked before the shared model runs ---------- */
const baseClaim = M.claim;
/* a general claim: its truth is worked out over every case of Stage 5 (s5rule), so the verdict is never keyed by hand */
const TENTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => "0." + t), PCTS = Array.from({ length: 99 }, (x, i) => i + 1 + "%");
const RULES = {
  // "write % after the digit of a decimal": 0.t = t% for every tenth?
  digitPct: () => TENTHS.every(t => holds(t, "=", t.slice(2) + "%")),
  // "same denominator: the greater numerator is the greater fraction", for every denominator 2 to 12
  sameDen: () => { for (let dd = 2; dd <= 12; dd++) for (let a = 1; a < dd; a++) for (let b = 1; b < dd; b++) if (a > b && !holds(a + "/" + dd, ">", b + "/" + dd)) return false; return true; },
  // "a percentage is always greater than a decimal (one decimal place)"
  pctOverDec: () => PCTS.every(p => TENTHS.every(t => holds(p, ">", t)))
};
M.claim = function (d) {
  if (d.s5rule) { if (!RULES[d.s5rule]) throw new Error("claim: unknown rule " + d.s5rule); if (RULES[d.s5rule]() !== !!d.ok) throw new Error("claim: ok does not match the rule " + d.s5rule); }
  if (d.s5) d.s5.forEach(f => { if (!holds(f[0], f[1], f[2])) throw new Error("claim: the fact " + f.join(" ") + " is not true"); });
  if (d.s5says && holds(d.s5says[0], d.s5says[1], d.s5says[2]) !== !!d.ok) throw new Error("claim: ok does not match " + d.s5says.join(" "));
  return baseClaim(d);
};

MX.s5 = { F: F, V: V, hund: hund, sym: sym, holds: holds, rich: rich, why100: why100, fair: fair };
})();
