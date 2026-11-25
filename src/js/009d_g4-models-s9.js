/* g4-models-s9.js - the question models of Stop 9, Mode and median (Grade 4, Stage 5; objective 5Ss.03).

   Every answer is WORKED OUT HERE from the data (sort, middle value, most frequent value, ties). No key is written
   by hand in the pack; a model throws when its data does not fit the question (keys.js then fails the pack).

   MX.s9 = { asc, counts, modes, median, expand, midRaw }   the maths (also used by the pack for the lightning round)

   s9mode    { data: [..], unit, show: 'cards' | 'list' }     "What is the mode?"  (one typed box; exactly one mode)
   s9median  { data, unit, show }                             "What is the median?" (an odd number of values)
   s9both    { data, unit, show }                             mode and median, two boxes
   s9table2  { head, cols: [..], rows: [{ name, unit, of: 'temperatures', data }, { .. }], ask: [['mode', 0], ['median', 1]] }
             a table with two rows of data: the mode of one row and the median of the other, with units
   s9freq    { show: 'tally' | 'table' | 'bar' | 'dot', cats: [..], freq: [..], head: ['Fruit', 'Number of children'],
               ask: 'mode' | 'median' | ['mode', 'median'], unit, at }
             words in cats -> tick the mode (options made here: the mode, the highest frequency, two other answers);
             numbers in cats -> typed boxes (the list is written out from the frequencies)
   s9say     { data (numbers or words), unit, show, at }     no mode, one mode or two modes: tick what we can say
   s9kind    { data (numbers or words), at }                 which can you find: the mode only, the median only, both
   s9best    { data, unit, goal: 'most' | 'middle', ask: 'the question', own, who, words: ['taller', 'shorter'], at }
             which value answers the question: the mode (the most common) or the median (the middle)
   s9pickpic { data, at }                                    tick the picture that finds the median the right way
   s9missing { who, what: 'scores', one: 'score', shown: [..], blanks: 2 | 3, med, mode, min, max }
             open answer: the child writes the missing values; the check works out the median and the mode of the
             COMPLETED list again, so every right set is accepted and a set with two modes is not
   claim + s9 { type: 'claim', who, at, s9: { kind, data, data2, add, to } }
             a DOK 3 statement judged with a worked example: the verdict, the reasons and the worked answer are built
             here from the data (kinds: noorder, modein, hasmode, medmode, swapmedian, bigmode). M.claim is wrapped
             so that the type stays 'claim' (the engines draw a claim by its type). */
(function () {
"use strict";
const M = MX.M, dfmt = MX.dfmt, arrange = MX.arrange, cap = MX.cap, ORD = MX.ORD;

/* ---------- the maths ---------- */
const isNum = v => typeof v === "number";
const asc = a => a.slice().sort((x, y) => x - y);
/* [[value, how many times], ...] in the order the values are first seen */
function counts(a) {
  const keys = [], n = {};
  a.forEach(v => { const k = String(v); if (!(k in n)) { n[k] = 0; keys.push(v); } n[k]++; });
  return keys.map(v => [v, n[String(v)]]);
}
const countOf = (a, v) => a.filter(x => x === v).length;
/* every value with the highest frequency; none when all the (different) values come equally often */
function modes(a) {
  const c = counts(a), top = Math.max.apply(null, c.map(x => x[1])), w = c.filter(x => x[1] === top).map(x => x[0]);
  if (c.length > 1 && w.length === c.length) return [];
  return isNum(w[0]) ? asc(w) : w;
}
function median(a) {
  if (a.length % 2 === 0) throw new Error("s9: the median needs an odd number of values (Stage 5)");
  return asc(a)[(a.length - 1) / 2];
}
const midRaw = a => a[(a.length - 1) / 2];
function expand(cats, freq) { const out = []; cats.forEach((c, i) => { for (let k = 0; k < freq[i]; k++) out.push(c); }); return out; }
MX.s9 = { asc: asc, counts: counts, modes: modes, median: median, expand: expand, midRaw: midRaw };

const sh = v => (isNum(v) ? dfmt(v) : String(v));
const list = a => a.map(sh).join(", ");
const and = a => (a.length < 2 ? a.map(sh).join("") : a.slice(0, -1).map(sh).join(", ") + " and " + sh(a[a.length - 1]));
const times = c => (c === 1 ? "once" : c === 2 ? "twice" : c + " times");
/* " goals", and " goal" for the value 1 */
const ONE = { loaves: "loaf", people: "person" };
const un = (u, v) => (!u ? "" : " " + (v === 1 && ONE[u] ? ONE[u] : v === 1 && /[a-z]s$/.test(u) ? u.slice(0, -1) : u));
const need = (ok, msg) => { if (!ok) throw new Error("s9: " + msg); };
const oneMode = a => { const m = modes(a); need(m.length === 1, "this question needs exactly one mode: " + list(a)); return m[0]; };
const idxOf = (a, v) => a.map((x, i) => (x === v ? i : -1)).filter(i => i >= 0);
const cards = (data, more) => Object.assign({ k: "s9cards", data: data }, more || {});
const sortedCards = (a, more) => cards(isNum(a[0]) ? asc(a) : a.slice().sort(), more);
/* the cards in order with pairs crossed off from both ends and the middle card lit */
const medianCards = (a, more) => cards(asc(a), Object.assign({ cross: (a.length - 1) / 2, hl: [(a.length - 1) / 2] }, more || {}));
const modeCards = (a, more) => { const s = isNum(a[0]) ? asc(a) : a.slice().sort(), m = modes(a); return cards(s, Object.assign({ hl: s.map((v, i) => (m.indexOf(v) >= 0 ? i : -1)).filter(i => i >= 0) }, more || {})); };

/* ---------- feedback for a wrong mode or median ---------- */
function slipMode(a, v) {
  const m = oneMode(a), top = countOf(a, m), n = Number(v), s = asc(a), k = countOf(a, n);
  if (n === top && n !== m) return sh(m) + " is there " + times(top) + ". " + top + " is how many times, not the value. The mode is the value itself.";
  if (k > 0 && a.length % 2 === 1 && n === median(a)) return sh(n) + " is the middle value: that is the median. The mode is the value you see most often.";
  if (k > 0 && n === s[s.length - 1]) return sh(n) + " is the biggest value, but it is there only " + times(k) + ". The mode is the value you see most often.";
  if (k > 0) return sh(n) + " is there " + times(k) + ". Another value is there more often. Count each value.";
  if (n === s[s.length - 1] - s[0]) return "That is the biggest value take away the smallest. For the mode, count how often each value comes.";
  if (n === a.length) return "That is how many values there are. The mode is the value you see most often.";
  return sh(n) + " is not one of the values. The mode is always one of the values.";
}
function slipMedian(a, v) {
  const med = median(a), n = Number(v), s = asc(a), raw = midRaw(a), ms = modes(a), place = (a.length + 1) / 2;
  if (n === raw && raw !== med && a.join() !== s.join()) return sh(n) + " is in the middle of the list as it is written. Put the values in order first: " + list(s) + ".";
  if (ms.length === 1 && n === ms[0]) return sh(n) + " is the mode: the value you see most often. The median is the middle value when the values are in order.";
  if (n === s[s.length - 1]) return sh(n) + " is the biggest value. The median is the middle value when the values are in order.";
  if (n === s[0]) return sh(n) + " is the smallest value. The median is the middle value when the values are in order.";
  if (a.indexOf(n) >= 0) return "In order: " + list(s) + ". " + sh(n) + " is not in the middle. Cross off one value from each end until one is left.";
  if (n === s[s.length - 1] - s[0]) return "That is the biggest value take away the smallest. For the median, put the values in order and find the middle one.";
  if (n === place) return place + " is the place of the middle value: it is the " + ORD[place] + " value. Write the value that is there.";
  if (n === a.length) return "That is how many values there are. Put them in order and find the middle one.";
  return sh(n) + " is not one of the values. With an odd number of values, the median is one of the values.";
}
const workMode = (a, u) => { const m = oneMode(a); return sh(m) + " is there " + times(countOf(a, m)) + ", more often than any other value. The mode is " + sh(m) + un(u, m) + "."; };
const workMedian = (a, u, sortedAlready) => { const p = (a.length + 1) / 2; return (sortedAlready ? "The " + a.length + " values in order: " : "In order: ") + list(asc(a)) + ". The middle value is the " + ORD[p] + " one. The median is " + sh(median(a)) + un(u) + "."; };

/* ---------- typed answers: one box for each part { want: 'mode' | 'median', data, unit, label, name, slips, note } ---------- */
function partsTask(d, parts) {
  const ans = parts.map(p => (p.want === "mode" ? oneMode(p.data) : median(p.data)));
  parts.forEach(p => need(p.data.every(v => isNum(v) && v >= 0 && Number.isInteger(v)), "typed answers need whole numbers"));
  const worked = parts.map((p, i) => p.work || (p.want === "mode" ? workMode(p.data, p.unit) : workMedian(p.data, p.unit, p.inOrder))).join(" ");
  return {
    marks: parts.length,
    lines: parts.map((p, i) => p.label + ' = <span class="g4s9-nw">{' + i + "}" + un(p.unit) + "</span>"),
    blanks: parts.map((p, i) => ({ len: Math.max(2, String(ans[i]).length + 1), w: "big" })),
    check(r) {
      const v = r.v || [], ok = ans.map((a, i) => v[i] != null && v[i] !== "" && Number(v[i]) === a);
      if (ok.every(Boolean)) return { ok: true, parts: ok };
      const i = ok.indexOf(false), p = parts[i], x = v[i];
      if (x == null || x === "") return { ok: false, msg: "Write a number in " + (parts.length > 1 ? "each box." : "the box."), parts: ok };
      const own = (p.slips || []).find(s => Number(x) === s[0]);
      const msg = own ? own[1] : p.want === "mode" ? slipMode(p.data, x) : slipMedian(p.data, x);
      return { ok: false, msg: (parts.length > 1 ? "Look at the " + (p.name || p.want) + ". " : "") + msg, parts: ok };
    },
    worked: { text: worked },
    yes: parts.map((p, i) => "The " + (p.name || p.want) + " is " + sh(ans[i]) + un(p.unit, ans[i]) + ".").join(" "),
    key: ans.map(sh).join(" ; "), fill: ans.map(String), answers: ans
  };
}

const TIP = {
  mode: "The mode is the value you see most often. Count how often each value comes.",
  median: "Put the values in order, from smallest to biggest. Then find the middle one.",
  both: "Mode: the value you see most often. Median: put the values in order and find the middle one."
};
function listModel(wants) {
  return function (d, mode) {
    const a = d.data, u = d.unit || "";
    const t = partsTask(d, wants.map(w => ({ want: w, data: a, unit: u, label: cap(w) })));
    t.q = wants.length === 2 ? "<b>Find</b> the mode and the median." : "What is the " + wants[0] + "?";
    if (d.show === "list") t.sum = list(a); else t.fig = cards(a);
    const med = wants.indexOf("median") >= 0;
    t.hint = { step: wants.length === 2 ? TIP.both : TIP[wants[0]],
      pic: med ? cards(asc(a), { cross: mode === "our" ? 1 : 0, cap: mode === "our" ? "In order. Cross off pairs from both ends." : "The values in order" })
        : cards(asc(a), { cap: "Equal values side by side" }) };
    t.worked.pic = wants.length === 2 ? [modeCards(a, { cap: "Mode" }), medianCards(a, { cap: "Median" })] : med ? medianCards(a) : modeCards(a);
    return t;
  };
}
M.s9mode = listModel(["mode"]);
M.s9median = listModel(["median"]);
M.s9both = listModel(["mode", "median"]);

/* a table with two rows of data: the mode of one row, the median of the other */
M.s9table2 = function (d) {
  const ask = d.ask || [["mode", 0], ["median", 1]];
  const parts = ask.map(x => {
    const row = d.rows[x[1]], other = d.rows[1 - x[1]], slips = [];
    let wrongRow = null;
    try { wrongRow = x[0] === "mode" ? (modes(other.data).length === 1 ? modes(other.data)[0] : null) : median(other.data); } catch (e) { wrongRow = null; }
    const right = x[0] === "mode" ? oneMode(row.data) : median(row.data);
    if (wrongRow != null && wrongRow !== right) slips.push([wrongRow, "That is the " + x[0] + " of the " + other.of + ". Look at the row for the " + row.of + "."]);
    return { want: x[0], data: row.data, unit: row.unit, label: cap(x[0]) + " of the " + row.of, name: x[0] + " of the " + row.of, slips: slips };
  });
  const t = partsTask(d, parts);
  t.q = "Look at the table. <b>Write</b> the " + ask.map(x => x[0] + " of the " + d.rows[x[1]].of).join(" and the ") + ".";
  t.fig = { k: "s9table", head: d.head, cols: d.cols, rows: d.rows.map(r => ({ name: r.name, vals: r.data })) };
  const mi = ask.findIndex(x => x[0] === "median"), mrow = d.rows[ask[mi][1]];
  t.hint = { step: "Use one row at a time. Mode: the value you see most often. Median: write the row in order, then find the middle value.",
    pic: cards(asc(mrow.data), { cap: "The " + mrow.of + " in order" }) };
  t.worked.pic = ask.map(x => (x[0] === "mode" ? modeCards(d.rows[x[1]].data, { cap: cap(d.rows[x[1]].of) + ": mode" }) : medianCards(d.rows[x[1]].data, { cap: cap(d.rows[x[1]].of) + ": median" })));
  return t;
};

/* a tally chart, a frequency table, a bar chart or a dot plot */
function freqFig(d, more) {
  const head = d.head || ["", "Frequency"], m = more || {};
  if (d.show === "bar") return Object.assign({ k: "s9bar", cats: d.cats, freq: d.freq, xlab: head[0], ylab: head[1] }, m);
  if (d.show === "dot") return Object.assign({ k: "s9dot", cats: d.cats, freq: d.freq, xlab: head[0] }, m);
  if (d.show === "tally") return Object.assign({ k: "s9tally", head: head, cats: d.cats, freq: d.freq, tally: true, showFreq: !!m.vals }, m);
  return Object.assign({ k: "s9tally", head: head, cats: d.cats, freq: d.freq, tally: false, showFreq: true }, m);
}
const FREQ = {
  bar: { name: "bar chart", freqIs: "the height of its bar", tip: "The mode has the tallest bar. Read the name under that bar.", see: "the tallest bar", read: "Read the value under the tallest bar." },
  dot: { name: "dot plot", freqIs: "its number of dots", tip: "The mode has the most dots. Read the value under that column.", see: "the most dots", read: "Read the value under the column with the most dots." },
  tally: { name: "tally chart", freqIs: "its number of tally marks", tip: "The mode has the most tally marks. Count in fives.", see: "the most tally marks", read: "Read the value beside the most tally marks." },
  table: { name: "table", freqIs: "the number beside it", tip: "The mode has the highest frequency. Read the value beside that number.", see: "the highest frequency", read: "Read the value beside the highest frequency." }
};
M.s9freq = function (d, mode) {
  const cats = d.cats, freq = d.freq, F = FREQ[d.show] || FREQ.table, all = expand(cats, freq);
  need(cats.length === freq.length, "cats and freq must match");
  const m = oneMode(all), mi = cats.indexOf(m), top = freq[mi];
  /* the hint picture shows the frequencies as numbers (or, for a table, as bars); it does not light the answer */
  const hintPic = d.show === "table" ? { k: "s9bar", cats: cats, freq: freq, xlab: (d.head || [])[0], ylab: (d.head || [])[1], vals: true } : freqFig(d, { vals: true });
  if (!cats.every(isNum)) {
    /* words: tick the mode. The other answers: the highest frequency (a number, not a value), the next one, the least one */
    need(d.ask == null || d.ask === "mode", "words have a mode only");
    const order = cats.map((c, i) => i).filter(i => i !== mi).sort((x, y) => freq[y] - freq[x]), second = order[0], least = order[order.length - 1];
    const opts = [{ t: sh(m) },
      { t: String(top), why: top + " is the frequency of " + sh(m) + " (" + F.freqIs + "). The mode is not a number here: it is " + sh(m) + "." },
      { t: sh(cats[second]), why: cap(sh(cats[second])) + " has " + freq[second] + ". Look for " + F.see + "." },
      { t: sh(cats[least]), why: cap(sh(cats[least])) + " has the fewest: " + freq[least] + ". The mode is the one with the most." }];
    const t = M.tick({ q: "Look at the " + F.name + ". What is the mode?", opts: opts, at: d.at, tip: F.tip,
      worked: cap(sh(m)) + " has " + F.see + ": " + top + ". So the mode is " + sh(m) + ". " + top + " is its frequency, not the mode." });
    t.fig = freqFig(d); t.hint.pic = hintPic; t.worked.pic = freqFig(d, { hl: true });
    t.yes = "The mode is " + sh(m) + ": it has " + F.see + ".";
    return t;
  }
  const wants = Array.isArray(d.ask) ? d.ask : [d.ask || "mode"], u = d.unit || "", n = all.length;
  const parts = wants.map(w => {
    if (w === "mode") return { want: "mode", data: all, unit: u, label: "Mode", slips: top !== m ? [[top, top + " is how many times the mode comes. It is not the value. " + F.read]] : [],
      work: sh(m) + " has " + F.see + ": " + top + ". No other value comes so often. The mode is " + sh(m) + un(u, m) + (top !== m ? ", not " + top : "") + "." };
    const med = median(all), midCat = cats[(cats.length - 1) / 2], slips = [];
    if (cats.length % 2 === 1 && midCat !== med) slips.push([midCat, sh(midCat) + " is in the middle of the " + F.name + ". But some values come more often. There are " + n + " values: find the " + ORD[(n + 1) / 2] + " one."]);
    if (slips.every(s => s[0] !== n) && n !== med) slips.push([n, n + " is how many values there are. Find the " + ORD[(n + 1) / 2] + " value."]);
    return { want: "median", data: all, unit: u, label: "Median", slips: slips, inOrder: true };
  });
  const t = partsTask(d, parts);
  t.q = "Look at the " + F.name + ". " + (wants.length === 2 ? "<b>Find</b> the mode and the median." : "What is the " + wants[0] + "?");
  t.fig = freqFig(d);
  const medTip = "For the median: there are " + n + " values, so the middle one is the " + ORD[(n + 1) / 2] + ". Count along from the smallest value.";
  t.hint = { step: wants.length === 2 ? F.tip + " " + medTip : wants[0] === "mode" ? F.tip : medTip, pic: hintPic };
  t.worked.pic = wants.length === 2 ? [freqFig(d, { hl: true }), medianCards(all, { cap: "The " + n + " values in order: the median is " + sh(median(all)) })]
    : wants[0] === "mode" ? freqFig(d, { hl: true }) : medianCards(all);
  return t;
};

/* no mode, one mode or two modes: what can we say? */
M.s9say = function (d) {
  const a = d.data, u = d.unit || "", ms = modes(a), num = isNum(a[0]), c = counts(a);
  need(ms.length <= 2, "at most two modes");
  let opts, worked;
  const there = v => sh(v) + " is there " + times(countOf(a, v));
  if (!ms.length) {
    need(num && a.length % 2 === 1, "the no-mode question needs an odd list of numbers");
    const s = asc(a), max = s[s.length - 1], med = median(a);
    opts = [{ t: "There is no mode." },
      { t: "The mode is " + sh(max) + un(u, max) + ".", why: sh(max) + " is the biggest value. It is there only once, like every other value." },
      { t: "The mode is " + sh(med) + un(u, med) + ".", why: sh(med) + " is the middle value: the median. It is there only once." }];
    worked = "Every value is there only once. No value comes more often than the others, so there is no mode.";
  } else if (ms.length === 2) {
    const k = countOf(a, ms[0]);
    opts = [{ t: "There are two modes: " + sh(ms[0]) + " and " + sh(ms[1]) + "." },
      { t: "The mode is " + sh(ms[1]) + " only.", why: cap(there(ms[1])) + ". But " + there(ms[0]) + " too. Both are modes." },
      { t: "There is no mode.", why: cap(sh(ms[0])) + " and " + sh(ms[1]) + " are each there " + times(k) + ", more often than the other values. So there are two modes." }];
    worked = cap(there(ms[0])) + " and " + there(ms[1]) + ". No other value comes so often. There are two modes: " + sh(ms[0]) + " and " + sh(ms[1]) + ".";
  } else {
    const rest = c.filter(x => x[0] !== ms[0]).sort((x, y) => y[1] - x[1])[0];
    need(!!rest, "more than one value");
    opts = [{ t: "The mode is " + sh(ms[0]) + un(u, ms[0]) + "." },
      { t: "There are two modes: " + sh(ms[0]) + " and " + sh(rest[0]) + ".", why: cap(there(rest[0])) + ", but " + there(ms[0]) + ". Only " + sh(ms[0]) + " is the mode." },
      { t: "There is no mode.", why: cap(there(ms[0])) + ", more often than any other value. So " + sh(ms[0]) + " is the mode." }];
    worked = cap(there(ms[0])) + ", more often than any other value. The mode is " + sh(ms[0]) + un(u, ms[0]) + ".";
  }
  const t = M.tick({ q: "What can we say about the mode?", opts: opts, at: d.at, worked: worked,
    tip: "Count how often each value comes. Is one value there more often than all the others?" });
  if (d.show === "list") t.sum = list(a); else t.fig = cards(a);
  t.hint.pic = sortedCards(a, { cap: "Equal values side by side" });
  t.worked.pic = ms.length ? modeCards(a) : sortedCards(a);
  return t;
};

/* numbers or words: which can you find, the mode, the median or both? */
M.s9kind = function (d) {
  const a = d.data, num = a.every(isNum), m = oneMode(a);
  let opts, worked;
  if (!num) {
    const two = counts(a).slice(0, 2).map(x => "“" + x[0] + "”").join(" and ");
    opts = [{ t: "The mode only" },
      { t: "The median only", why: two + " are words, not numbers. You cannot put words in order of size, so there is no middle value." },
      { t: "The mode and the median", why: "The mode is fine: count the words. But words have no order of size, so there is no median." }];
    worked = "The data is words, not numbers. You can count the words: " + sh(m) + " is there " + times(countOf(a, m)) + ", so the mode is " + sh(m) + ". Words have no order of size, so there is no median.";
  } else {
    opts = [{ t: "The mode and the median" },
      { t: "The mode only", why: "These are numbers. You can put them in order, so you can find the middle value too." },
      { t: "The median only", why: "You can also count the values: " + sh(m) + " is there " + times(countOf(a, m)) + ", so there is a mode too." }];
    worked = "The data is numbers. The mode is " + sh(m) + " (it is there " + times(countOf(a, m)) + "). In order: " + list(asc(a)) + ", so the median is " + sh(median(a)) + ". You can find both.";
  }
  const t = M.tick({ q: "Which can you find for this data?", opts: opts, at: d.at, worked: worked,
    tip: "Mode: the value you see most often. Median: the middle value when the values are in order. Can you put this data in order of size?" });
  t.fig = cards(a);
  t.worked.pic = modeCards(a, { cap: "The mode: " + sh(m) });
  return t;
};

/* which value answers the question: the most common value (mode) or the middle value (median)? */
M.s9best = function (d) {
  const a = d.data, u = d.unit || "", s = asc(a), m = oneMode(a), med = median(a), max = s[s.length - 1];
  need(m !== med && med !== max && m !== max, "s9best needs a different mode, median and biggest value");
  const cm = countOf(a, m), val = v => "<b>" + sh(v) + un(u, v) + "</b>";
  let opts, worked;
  if (d.goal === "most") {
    opts = [{ t: "The mode: " + val(m) },
      { t: "The median: " + val(med), why: sh(med) + " is the middle value. It does not tell you which value comes most often." },
      { t: "The biggest value: " + val(max), why: sh(max) + " is the biggest value, but it is there only " + times(countOf(a, max)) + ". Which value comes most often?" }];
    worked = "The mode is the value that comes most often. " + sh(m) + " is there " + times(cm) + ", more than any other value. So the mode, " + sh(m) + un(u, m) + ", answers the question.";
  } else {
    opts = [{ t: "The median: " + val(med) },
      { t: "The mode: " + val(m), why: sh(m) + " is the most common value. It does not tell you where the middle of the group is." },
      { t: "The biggest value: " + val(max), why: "Every other value is below " + sh(max) + ". It does not show the middle of the group." }];
    worked = "In order: " + list(s) + ". The median is the middle value, " + sh(med) + un(u, med) + ". Half of the other values are below it and half are above it.";
    if (d.own != null) {
      need(d.own !== med, "own value must not be the median");
      worked += " " + sh(d.own) + " is " + (d.own > med ? "more" : "less") + " than " + sh(med) + ", so " + d.who + " is in the " + (d.own > med ? d.words[0] : d.words[1]) + " half.";
    }
  }
  const t = M.tick({ q: d.ask, opts: opts, at: d.at, worked: worked,
    tip: "The mode tells you the most common value. The median tells you the middle value. Which one does the question ask for?" });
  t.fig = cards(a); t.key = t.key.replace(/<[^>]+>/g, "");
  t.hint.pic = cards(s, { cap: "The values in order" });
  t.worked.pic = d.goal === "most" ? modeCards(a) : medianCards(a);
  return t;
};

/* tick the picture that finds the median the right way */
M.s9pickpic = function (d) {
  const a = d.data, s = asc(a), mid = (a.length - 1) / 2, med = median(a), raw = midRaw(a);
  need(raw !== med && a.join() !== s.join() && s[s.length - 1] !== med, "the list must be out of order, with another number in the middle");
  const opts = [
    { fig: cards(s, { hl: [mid], cross: mid }), key: "the cards in order, the middle card lit" },
    { fig: cards(a, { hl: [mid] }), why: "These cards are not in order. " + sh(raw) + " is only in the middle of the list as it is written. Put the cards in order first." },
    { fig: cards(s, { hl: [s.length - 1] }), why: "The cards are in order, but " + sh(s[s.length - 1]) + " is the biggest value. The median is the middle card." }];
  const t = M.tick({ q: "Which picture shows the right way to find the median?", opts: opts, at: d.at,
    tip: "First put the cards in order. Then cross off pairs from both ends until one card is left.",
    worked: "Put the cards in order: " + list(s) + ". Cross off pairs from both ends. The middle card is " + sh(med) + ", so the median is " + sh(med) + "." });
  t.sum = list(a);
  t.yes = "In order: " + list(s) + ". The median is the middle card: " + sh(med) + ".";
  return t;
};

/* open answer: write possible missing values so that the list has the given median and mode */
M.s9missing = function (d) {
  const shown = d.shown, nb = d.blanks || 2, n = shown.length + nb, lo = d.min || 0, hi = d.max, what = d.what || "scores", one = d.one || "score";
  need(n % 2 === 1 && nb >= 2 && nb <= 3, "an odd number of values and 2 or 3 boxes");
  const fits = full => { const ms = modes(full); return ms.length === 1 && ms[0] === d.mode && median(full) === d.med; };
  /* every right answer (as sets in order), found by trying them all */
  const sols = [];
  (function walk(from, got) {
    if (got.length === nb) { if (fits(shown.concat(got))) sols.push(got.slice()); return; }
    for (let v = from; v <= hi; v++) { got.push(v); walk(v, got); got.pop(); }
  })(lo, []);
  need(sols.length > 0, "no possible answer for the missing " + what);
  const eg = sols[Math.floor((sols.length - 1) / 2)], full0 = shown.concat(eg);
  const slots = []; for (let i = 0; i < n; i++) slots.push(i === (n - 1) / 2 ? d.med : "?");
  const egText = "One answer: " + and(eg) + ". In order the list is " + list(asc(full0)) + ". The middle value is " + sh(d.med) + " and " + sh(d.mode) + " is there most often." + (sols.length > 1 ? " Other answers are right too." : "");
  return {
    q: d.who + " has <b>" + n + "</b> " + what + ". The median is <b>" + sh(d.med) + "</b>. The mode is <b>" + sh(d.mode) + "</b>, and there is only one mode. <b>Write</b> possible missing " + what + ".",
    sub: "Each " + one + " is a whole number from " + lo + " to " + hi + ".",
    marks: 1,
    lines: [list(shown) + ", " + eg.map((x, i) => "{" + i + "}").join(", ")],
    blanks: eg.map(() => ({ len: String(hi).length, w: "big" })),
    check(r) {
      const v = (r.v || []).slice(0, nb), none = eg.map(() => false);
      if (v.length < nb || v.some(x => x == null || x === "")) return { ok: false, msg: "Write a " + one + " in every box.", parts: none };
      const vals = v.map(Number);
      if (vals.some(x => !Number.isInteger(x) || x < lo || x > hi)) return { ok: false, msg: "Each " + one + " is a whole number from " + lo + " to " + hi + ".", parts: none };
      const full = shown.concat(vals), ms = modes(full), md = median(full), s = asc(full);
      if (!ms.length) return { ok: false, msg: "In your list no value comes more often than the others, so there is no mode. " + sh(d.mode) + " must be there most often.", parts: none };
      if (ms.length > 1) return { ok: false, msg: "Your list has " + (ms.length === 2 ? "two" : ms.length) + " modes: " + and(ms) + ". Only " + sh(d.mode) + " can be there most often. Change one number.", parts: none };
      if (ms[0] !== d.mode) return { ok: false, msg: "In your list the mode is " + sh(ms[0]) + ", not " + sh(d.mode) + ". " + sh(d.mode) + " must be there more often than any other number.", parts: none };
      if (md !== d.med) return { ok: false, msg: "Put your list in order: " + list(s) + ". The middle value is " + sh(md) + ", but the median must be " + sh(d.med) + ". Try a " + (md > d.med ? "smaller" : "bigger") + " number.", parts: none };
      return { ok: true, parts: eg.map(() => true), note: "In order: " + list(s) + ". The middle value is " + sh(md) + " and " + sh(d.mode) + " is there most often." };
    },
    hint: { pic: cards(slots, { hl: [(n - 1) / 2], cap: "In order, the middle card is " + sh(d.med) }),
      step: "The mode is " + sh(d.mode) + ", so " + sh(d.mode) + " must be there more often than any other number. The median is " + sh(d.med) + ", so " + sh(d.med) + " must be in the middle when the list is in order." },
    worked: { text: egText, pic: medianCards(full0) },
    yes: egText, key: "for example " + eg.map(sh).join(" ; "), fill: eg.map(String), solutions: sols
  };
};

/* ---------- DOK 3: a statement to judge with a worked example (the claim model, built from the data) ---------- */
const CLAIMS = {
  /* "take the middle of the list as it is written": false, shown with a list that is not in order */
  noorder(d, who) {
    const a = d.data, s = asc(a), med = median(a), raw = midRaw(a);
    need(raw !== med, "the middle of the written list must not be the median");
    return { ok: false, says: "To find the median, I take the middle number of the list as it is written.",
      ctx: who + " looks at this list: <b>" + list(a) + "</b>.", fig: cards(a),
      reasons: [
        { t: "the numbers must be in order first: " + list(s) + ". The median is " + sh(med) + ", not " + sh(raw) + "." },
        { t: sh(raw) + " is in the middle of the list, so " + sh(raw) + " is the median.", why: "The list is not in order yet. Put the numbers in order first. Then find the middle one." },
        { t: "the median is the number you see most often.", why: "That is the mode. The median is the middle value when the values are in order." }],
      hint: { pic: cards(s, { cap: "The list in order" }), step: "Put the numbers in order, from smallest to biggest. Then find the middle one." },
      workPic: medianCards(a, { cap: "In order, the middle number is " + sh(med) }),
      worked: "In order: " + list(s) + ". The middle number is " + sh(med) + ". In the list as it is written, the middle number is " + sh(raw) + ". They are not the same.",
      model: who + " is incorrect because the numbers must be in order first: the median is " + sh(med) + ", not " + sh(raw) + "." };
  },
  /* "the mode is always one of the values": true */
  modein(d, who) {
    const a = d.data, s = asc(a), m = oneMode(a), max = s[s.length - 1], half = (s[0] + max) / 2;
    need(m !== max && a.indexOf(half) < 0, "the mode must not be the biggest value, and halfway must not be in the list");
    return { ok: true, says: "The mode is always one of the values in the data.",
      ctx: who + " looks at this list: <b>" + list(a) + "</b>.", fig: cards(a),
      reasons: [
        { t: "the mode is the value that comes most often, so it must be in the data. Here it is " + sh(m) + "." },
        { t: "the mode is the biggest value, and the biggest value is in the data.", why: "The mode is the most frequent value, not the biggest. Here the biggest value is " + sh(max) + ", but the mode is " + sh(m) + "." },
        { t: "the mode is halfway between the smallest and the biggest value: " + sh(half) + ".", why: sh(half) + " is not in the list. Count how often each value comes: " + sh(m) + " is there " + times(countOf(a, m)) + "." }],
      hint: { pic: cards(s, { cap: "Equal values side by side" }), step: "Find the mode of the list. Can a value that is not in the data come most often?" },
      workPic: modeCards(a, { cap: "The mode is " + sh(m) }),
      worked: sh(m) + " is there " + times(countOf(a, m)) + ", so the mode is " + sh(m) + ". A value that is not in the data comes 0 times, so it can never be the mode.",
      model: who + " is correct because the mode is the value that comes most often, so it is always one of the values." };
  },
  /* "every list has a mode": false, shown with a list where every number comes once */
  hasmode(d, who) {
    const a = d.data, s = asc(a), max = s[s.length - 1], med = median(a);
    need(modes(a).length === 0 && counts(a).length === a.length, "every number must come once");
    return { ok: false, says: "Every list of numbers has a mode.",
      ctx: who + " looks at this list: <b>" + list(a) + "</b>.", fig: cards(a),
      reasons: [
        { t: "in this list every number comes only once, so there is no mode." },
        { t: "the mode of this list is " + sh(max) + ", the biggest number.", why: sh(max) + " comes only once, like every other number. The biggest number is not the mode." },
        { t: "the mode of this list is " + sh(med) + ", the middle number.", why: sh(med) + " is the median. It comes only once, so it is not the mode." }],
      hint: { pic: cards(s, { cap: "The list in order" }), step: "Count how often each number comes. Does one number come more often than the others?" },
      worked: "In " + list(a) + " every number comes once. No number comes more often than the others, so this list has no mode.",
      model: who + " is incorrect because in this list every number comes only once, so there is no mode." };
  },
  /* "the median is one of the numbers, so it is also the mode": false. List A is the counterexample, list B agrees */
  medmode(d, who) {
    const a = d.data, b = d.data2, ma = oneMode(a), mb = oneMode(b), da = median(a), db = median(b);
    need(ma !== da && mb === db, "list A needs a different median and mode; list B the same");
    return { ok: false, says: "The median and the mode of a list are always the same number.",
      ctx: who + " looks at two lists.", fig: [cards(a, { cap: "List A" }), cards(b, { cap: "List B" })],
      reasons: [
        { t: "in list A the median is " + sh(da) + ", but the mode is " + sh(ma) + ". They are not the same." },
        { t: "in list B the median and the mode are both " + sh(db) + ".", why: "That is true for list B. But one example does not make it always true. Check list A." },
        { t: "the middle number in order is always the number you see most often.", why: "Check list A: in order, the middle number is " + sh(da) + ", but " + sh(ma) + " is there most often." }],
      hint: { pic: [cards(asc(a), { cap: "List A in order" }), cards(asc(b), { cap: "List B in order" })], step: "Find the median and the mode of each list. Are they the same in both lists?" },
      workPic: [medianCards(a, { cap: "List A: median " + sh(da) + ", mode " + sh(ma) }), medianCards(b, { cap: "List B: median " + sh(db) + ", mode " + sh(mb) })],
      worked: "List A in order: " + list(asc(a)) + ". The median is " + sh(da) + " and the mode is " + sh(ma) + ". List B in order: " + list(asc(b)) + ". The median and the mode are both " + sh(db) + ". So it is true for some lists, but not always.",
      model: who + " is incorrect because in list A the median is " + sh(da) + " but the mode is " + sh(ma) + "." };
  },
  /* "if the biggest number gets much bigger, the median stays the same": true */
  swapmedian(d, who) {
    const a = d.data, s = asc(a), max = s[s.length - 1], med = median(a), b = a.map(v => (v === max ? d.to : v)), s2 = asc(b);
    need(countOf(a, max) === 1 && d.to > max * 3 && median(b) === med && med !== max, "one biggest number, changed to a much bigger one");
    return { ok: true, says: "If the biggest number in a list gets much bigger, the median stays the same.",
      ctx: who + " changes the biggest number in this list from <b>" + sh(max) + "</b> to <b>" + sh(d.to) + "</b>.", fig: [cards(a, { cap: "Before" }), cards(b, { cap: "After" })],
      reasons: [
        { t: "in order, the list is now " + list(s2) + ". " + sh(d.to) + " is still last, so the middle number is still " + sh(med) + "." },
        { t: sh(d.to) + " is far from the other numbers, so it pulls the middle up.", why: "Put the new list in order: " + list(s2) + ". Which number is in the middle now?" },
        { t: "the median never changes when a number in the list changes.", why: "Not always: change the middle number and the median changes. Here it stays because only the biggest number changes." }],
      hint: { pic: [cards(s, { cap: "Before, in order" }), cards(s2, { cap: "After, in order" })], step: "Put each list in order. Find the middle number before and after." },
      workPic: [medianCards(a, { cap: "Before: the median is " + sh(med) }), medianCards(b, { cap: "After: the median is " + sh(med) })],
      worked: "Before: " + list(s) + ". The median is " + sh(med) + ". After: " + list(s2) + ". The median is still " + sh(med) + ". The biggest number stays at the end of the list, so the middle does not move.",
      model: who + " is correct because " + sh(d.to) + " is still the last number in order, so the middle number is still " + sh(med) + "." };
  },
  /* "if I add a very large number, the mode changes": false */
  bigmode(d, who) {
    const a = d.data, m = oneMode(a), b = a.concat([d.add]), s2 = asc(b);
    need(a.indexOf(d.add) < 0 && d.add > Math.max.apply(null, a) * 3 && oneMode(b) === m && countOf(a, m) > 1, "a new, very large number that leaves the mode as it is");
    return { ok: false, says: "If I add a very large number to a list, the mode changes.",
      ctx: who + " adds <b>" + sh(d.add) + "</b> to this list: <b>" + list(a) + "</b>.", fig: cards(b, { hl: [b.length - 1], cap: "The list with " + sh(d.add) }),
      reasons: [
        { t: "with " + sh(d.add) + " in the list, the mode is still " + sh(m) + ": " + sh(d.add) + " is there only once." },
        { t: sh(d.add) + " is the biggest number, so it is the new mode.", why: "The mode is the most frequent value, not the biggest. " + sh(d.add) + " is there only once." },
        { t: "every new number changes the mode.", why: "Count again: " + sh(m) + " is there " + times(countOf(a, m)) + " and " + sh(d.add) + " only once. The mode is still " + sh(m) + "." }],
      hint: { pic: cards(s2, { cap: "The new list in order" }), step: "Find the mode before. Then count again with " + sh(d.add) + " in the list." },
      workPic: modeCards(b, { cap: "The mode is still " + sh(m) }),
      worked: "Before: " + sh(m) + " is there " + times(countOf(a, m)) + ", so the mode is " + sh(m) + ". After: " + sh(d.add) + " is there only once, and " + sh(m) + " is still there " + times(countOf(a, m)) + ". The mode is still " + sh(m) + ".",
      model: who + " is incorrect because " + sh(d.add) + " is there only once, so the mode is still " + sh(m) + "." };
  }
};
const baseClaim = M.claim;
M.claim = function (d, mode) {
  if (!d.s9) return baseClaim(d, mode);
  const make = CLAIMS[d.s9.kind]; need(!!make, "unknown claim kind " + d.s9.kind);
  const c = make(d.s9, d.who), t = baseClaim(Object.assign({ who: d.who, at: d.at }, c), mode);
  t.q = c.ctx + " " + t.q; t.fig = c.fig;
  t.worked.pic = c.workPic || c.hint.pic;
  return t;
};
})();
