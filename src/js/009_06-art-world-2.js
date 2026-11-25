/* 06-art-world-2.js - the Pattern Canyon, the world scene of Stop 2 (window.T_ART['world-pattern-canyon']).

   The hub header of Stop 2 (35-hub.js buildScene), drawn with the recipe of every world scene (docs/02-architecture.md):
     viewBox 0 0 800 500, preserveAspectRatio xMidYMid slice, data-view, data-safe (x, y, w, h: what must show at every
     size) and data-band (top, bottom: the heart, clear of the floating buttons and the sheet). The heart's main part,
     the staircase, carries data-heart (test/scene.mjs checks it stays clear of the buttons).
     Layers, back to front: sky (sun or moon, stars, clouds, birds), far (striped mesas: a pattern of colours), cliffs
     (the left cliff with a thermometer rock, the right cliff), floor (the sand, the river at sea level), things: a
     staircase cut into the cliff that counts back in 2s, 6, 4, 2, 0 at the water, then -2 and -4 under the water,
     with a jump arc and "- 2" over each step; Zip ready on the 6; stepping stones in the river with square number dots
     1, 4, 9 and a "?".
     Maths meaning: counting back past zero (the steps), negative numbers below sea level (blue, under the water),
     a temperature (the thermometer rock: 5 °C by day, -3 °C at night), patterns (the stripes, the square stones).
     Palette: CSS variables on .art (--pc-*), redefined by the class world-pattern-canyon-night (the dark theme):
       a dark sky with stars and the moon, deeper rock and water, the camp fire glows, the thermometer drops below 0.
     Motion: only under .art.is-live (35-hub.js adds it when motion is allowed), transform and opacity only, slow
       loops: the clouds drift, the birds glide, the river's ripples slide, the flags sway, Zip hops on the step now and then, the
       fire flickers. Still under reduced motion and on the lowest effects tier (html[data-fx="1"]).
   Class names start with the id, so many copies on one page never clash; ids are renamed per copy by T.ui.art. */
(function () {
  'use strict';

  const ID = 'world-pattern-canyon';
  const c = function (name) { return 'class="' + ID + '-' + name.split(' ').join(' ' + ID + '-') + '"'; };
  const r1 = function (v) { return Math.round(v * 10) / 10; };
  const M = '−';

  /* ---------- palette: day, then night ---------- */
  const DAY = {
    sk1: '#FBD3A6', sk2: '#FFF3E2', fa1: '#F2B98A', fa2: '#E9A472', fa3: '#F7CDA5',
    c1: '#E58A4E', c2: '#D2703A', c3: '#F0A465', c4: '#C25E2C', cl: '#B44F22', top: '#F6B77D',
    sd: '#F3C98E', sd2: '#E6B274', wa: '#5DB6E8', wa2: '#3E97D1', wt: '#BFE6FA', st: '#FFFFFF', stl: '#8A4A1E',
    pl: '#FFFFFF', pli: '#7A3A12', uw: '#E4F3FC', uwi: '#1D62AE', gr: '#7DBA5A', gr2: '#4E8F3A', rk: '#C98E5E', rk2: '#A8703F',
    sh: 'rgba(120,56,18,.16)', cld: '#FFFFFF', bd: '#7A3A12', arc: '#1D62AE',
    su: '1', mo: '0', sr: '0', fire: '0', cso: '.85', lq: '0px'
  };
  const NIGHT = {
    sk1: '#120E2E', sk2: '#33295A', fa1: '#3E2C4E', fa2: '#352545', fa3: '#47335A',
    c1: '#6A3A3A', c2: '#5A3034', c3: '#7A4640', c4: '#4C282E', cl: '#2E1820', top: '#7E4C44',
    sd: '#5E4A4E', sd2: '#4E3C42', wa: '#1F4E7A', wa2: '#173E64', wt: '#5C8DB8', st: '#E6DCEB', stl: '#2E1820',
    pl: '#F3ECF4', pli: '#4A2418', uw: '#B9D3EA', uwi: '#123E70', gr: '#3E6A3A', gr2: '#2C5030', rk: '#6E5050', rk2: '#553C40',
    sh: 'rgba(6,4,24,.34)', cld: '#5A4C82', bd: '#D9CCE6', arc: '#9CC8F2',
    su: '0', mo: '1', sr: '1', fire: '1', cso: '.4', lq: '36px'
  };
  const vars = function (p) { return Object.keys(p).map(function (k) { return '--pc-' + k + ':' + p[k]; }).join(';'); };
  const fill = function (names) { return names.map(function (n) { return '.' + ID + '-' + n + '{fill:var(--pc-' + n + ')}'; }).join(''); };

  const S = '.' + ID + '-';
  const live = '.art.is-live ' + S;
  const FONT = 'var(--font-display,Arial,Helvetica,sans-serif)';
  const css =
    '.art{' + vars(DAY) + '}.art.' + ID + '-night{' + vars(NIGHT) + '}' +
    fill(['fa1', 'fa2', 'fa3', 'c1', 'c2', 'c3', 'c4', 'top', 'sd', 'sd2', 'wa', 'wa2', 'st', 'pl', 'uw', 'gr', 'gr2', 'rk', 'rk2', 'sh', 'cld']) +
    S + 'o{stroke:var(--pc-cl);stroke-width:2.5}' + S + 'o2{stroke:var(--pc-cl);stroke-width:1.6}' +
    S + 'stl{stroke:var(--pc-stl);stroke-width:2.2}' +
    S + 'wt{stroke:var(--pc-wt);stroke-width:3;fill:none}' +
    S + 'arc{stroke:var(--pc-arc);stroke-width:3.2;fill:none}' +
    S + 'arct{fill:var(--pc-arc);font:800 15px/1 ' + FONT + ';text-anchor:middle}' +
    S + 'su{fill:#FFE08A;opacity:var(--pc-su)}' + S + 'sun-ray{stroke:#FFD05A;stroke-width:5;opacity:var(--pc-su)}' +
    S + 'mo{fill:#FFF4CF;opacity:var(--pc-mo)}' + S + 'stars{fill:#FFF4CF;opacity:var(--pc-sr)}' +
    S + 'clouds{opacity:var(--pc-cso)}' + S + 'birds{stroke:var(--pc-bd);stroke-width:2.5;fill:none}' +
    S + 'fire{opacity:var(--pc-fire)}' +
    S + 'n{fill:var(--pc-pli);font:800 21px/1 ' + FONT + ';text-anchor:middle}' +
    S + 'n-uw{fill:var(--pc-uwi)}' + S + 'pl-uw{fill:var(--pc-uw)}' +
    S + 'dot{fill:#2F7FD4}' + S + 'q{fill:#7B4E00;font:800 18px/1 ' + FONT + ';text-anchor:middle}' +
    S + 'tglass{fill:#FFFFFF;stroke:var(--pc-cl);stroke-width:2.5}' + S + 'tred{fill:#E5404A}' + S + 'tbulb{fill:#E5404A;stroke:#A31A22;stroke-width:2.5}' +
    S + 'tick{stroke:#2A2F3A;stroke-width:2}' + S + 'tz{stroke:#2A2F3A;stroke-width:3.5}' +
    S + 'tn{fill:#2A2F3A;font:800 12px/1 ' + FONT + ';text-anchor:start}' +
    S + 'liq{transform:translateY(var(--pc-lq));transition:transform .4s}' +
    S + 'cold{fill:rgba(47,127,212,.16)}' +
    // what moves: each part slides or turns around its own box
    S + 'zipbox,' + S + 'flame{transform-box:fill-box}' + S + 'zipbox{transform-origin:50% 100%}' + S + 'flame{transform-origin:50% 100%}' +
    live + 'cloud-a{animation:' + ID + '-drift 26s ease-in-out infinite alternate}' +
    live + 'cloud-b{animation:' + ID + '-drift 34s ease-in-out -9s infinite alternate-reverse}' +
    live + 'birds{animation:' + ID + '-glide 18s ease-in-out infinite alternate}' +
    live + 'ripple{animation:' + ID + '-ripple 5s linear infinite}' +
    live + 'zipbox{animation:' + ID + '-hop 4.8s ease-in-out infinite}' +
    live + 'flame{animation:' + ID + '-flicker 1.4s ease-in-out infinite alternate}' +
    S + 'flags{transform-box:view-box;transform-origin:434px 150px}' + live + 'flags{animation:' + ID + '-sway 6s ease-in-out infinite alternate}' +
    live + 'stars{animation:' + ID + '-tw 3.2s ease-in-out infinite alternate}' +
    '@keyframes ' + ID + '-drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}' +
    '@keyframes ' + ID + '-glide{0%{transform:translate(-10px,4px)}100%{transform:translate(16px,-6px)}}' +
    '@keyframes ' + ID + '-ripple{to{transform:translateX(-40px)}}' +
    '@keyframes ' + ID + '-hop{0%,70%,100%{transform:translateY(0)}76%{transform:translateY(-14px)}82%{transform:translateY(0)}88%{transform:translateY(-7px)}94%{transform:translateY(0)}}' +
    '@keyframes ' + ID + '-flicker{0%{transform:scale(1,1);opacity:.85}100%{transform:scale(.88,1.12);opacity:1}}' +
    '@keyframes ' + ID + '-sway{0%{transform:rotate(-.6deg)}100%{transform:rotate(.6deg)}}' +
    '@keyframes ' + ID + '-tw{0%{opacity:1}100%{opacity:.35}}' +
    '@media (prefers-reduced-motion:reduce){.art.is-live *{animation:none!important;transition:none!important}}' +
    'html[data-fx="1"] .art.is-live *{animation:none!important}';

  /* ---------- small drawing helpers ---------- */
  const rect = function (x, y, w, h, cls, extra) {
    return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '"' + (cls ? ' ' + c(cls) : '') + (extra ? ' ' + extra : '') + '/>';
  };
  const path = function (d, cls, extra) { return '<path d="' + d + '"' + (cls ? ' ' + c(cls) : '') + (extra ? ' ' + extra : '') + '/>'; };
  const use = function (id, x, y, extra) { return '<use href="#' + id + '" x="' + r1(x) + '" y="' + r1(y) + '"' + (extra ? ' ' + extra : '') + '/>'; };
  const text = function (x, y, t, cls) { return '<text x="' + r1(x) + '" y="' + r1(y) + '" ' + c(cls) + '>' + t + '</text>'; };

  /* ---------- reusable shapes (defs) ---------- */
  const LEFT = 'M0 500V168l40-6 26 8 40-4 34 10 44-6 30 14 22 8 V500Z';           // the left cliff (to x 236)
  const RIGHT = 'M800 500V176l-36-6-30 10-38-2-26 12-20 18-22 4 2 64V500Z';       // the right cliff (from x 628)
  const defs = '<defs>' +
    '<linearGradient id="pc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--pc-sk1)"/><stop offset="1" style="stop-color:var(--pc-sk2)"/></linearGradient>' +
    '<linearGradient id="pc-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--pc-wa)" stop-opacity=".78"/><stop offset="1" style="stop-color:var(--pc-wa2)" stop-opacity=".92"/></linearGradient>' +
    '<clipPath id="pc-left"><path d="' + LEFT + '"/></clipPath>' +
    '<clipPath id="pc-right"><path d="' + RIGHT + '"/></clipPath>' +
    '<clipPath id="pc-river"><rect x="392" y="276" width="408" height="224"/></clipPath>' +
    '<path id="pc-cloud" d="M0 0h70c10 0 13-13 3-17 1-11-12-16-19-10-5-11-22-12-26-1-9-4-18 2-16 11-9 1-10 17 0 17z"/>' +
    '<path id="pc-tuft" d="M0 0c-2-8-8-12-12-12 6 2 8 6 8 10M0 0c0-10 2-16 6-20-1 8-2 14-2 20M2 0c2-7 7-10 12-10-5 3-7 6-8 10"/>' +
    '<g id="pc-rock"><path d="M0 0c2-12 12-18 22-16 8-6 20-2 22 8 6 2 8 6 6 8z"/></g>' +
    '</defs>';

  /* ---------- sky: the sun or the moon, stars, clouds, birds ---------- */
  let rays = '';
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2;
    rays += 'M' + r1(660 + Math.cos(a) * 48) + ' ' + r1(86 + Math.sin(a) * 48) + 'L' + r1(660 + Math.cos(a) * 62) + ' ' + r1(86 + Math.sin(a) * 62);
  }
  let stars = '';
  [[60, 40], [140, 92], [232, 30], [318, 70], [412, 24], [498, 84], [560, 36], [742, 52], [770, 128], [92, 132], [372, 120], [612, 150]].forEach(function (p, i) {
    stars += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 ? 1.6 : 2.4) + '"/>';
  });
  const sky = rect(0, 0, 800, 500, '', 'fill="url(#pc-sky)"') +
    '<g ' + c('stars') + '>' + stars + '</g>' +
    path(rays, 'sun-ray') + '<circle cx="660" cy="86" r="36" ' + c('su') + '/>' +
    '<path d="M676 60a30 30 0 1 0 8 50 26 26 0 1 1-8-50z" ' + c('mo') + '/>' +
    '<g ' + c('clouds') + '><g ' + c('cloud-a') + '>' + use('pc-cloud', 120, 82, c('cld')) + '</g>' +
    '<g ' + c('cloud-b') + '>' + use('pc-cloud', 460, 58, c('cld') + ' transform="translate(460 58) scale(.8) translate(-460 -58)"') + '</g></g>' +
    '<g ' + c('birds') + '><path d="M420 120q8-8 14 0q6-8 14 0"/><path d="M452 104q6-6 11 0q5-6 11 0"/></g>';

  /* ---------- far: striped mesas (a pattern of colours: light, dark, light, dark) ---------- */
  const far = path('M0 270V214l30-4 10-22h96l12 24 40 2 14-30h120l10 26 50 4 18-16h70l16 18 46-2 10-28h112l16 30 40 2 12-14h88l10 20 30 2V270Z', 'fa1') +
    path('M0 270V238h140l20 8h120l14-10h150l18 10h146l16-8h176v30Z', 'fa2') +
    path('M40 188h96M188 182h120M512 196h112M688 190h88', '', 'stroke="var(--pc-fa3)" stroke-width="6"') +
    path('M44 200h88M190 196h116M516 208h104M690 202h82', '', 'stroke="var(--pc-fa3)" stroke-width="4" opacity=".7"');

  /* ---------- cliffs: stripes in a repeating pattern, a top edge, cracks ---------- */
  function stripes(clip, x0, x1) {
    let s = '<g clip-path="url(#' + clip + ')">' + rect(x0, 150, x1 - x0, 360, 'c1');
    const cols = ['c2', 'c3', 'c4', 'c3'];
    for (let i = 0; i < 8; i++) s += rect(x0, 196 + i * 30, x1 - x0, i % 2 ? 9 : 13, cols[i % 4]);
    return s + '</g>';
  }
  // the thermometer rock on the left cliff: 5 °C by day; at night the red line drops to -3 °C (the --pc-lq slide)
  const TY = function (v) { return 238 + (10 - v) * 4.5; };                   // 10 at 238, -10 at 328
  let tticks = '';
  for (let v = -10; v <= 10; v++) {
    const big = v % 5 === 0;
    tticks += path('M198 ' + r1(TY(v)) + 'h' + (v === 0 ? 14 : big ? 10 : 5), v === 0 ? 'tz' : 'tick');
    if (big) tticks += text(214, TY(v) + 4.5, v < 0 ? M + (-v) : String(v), 'tn');
  }
  const thermo = '<g>' + path('M160 352c-6-40-4-96 4-124 8-20 40-22 50-2 10 30 14 86 8 126z', 'rk', c('o')) +
    rect(166, 236, 70, 100, 'cold', 'rx="10"') +
    path('M178 ' + r1(TY(-10) + 4) + 'V' + r1(TY(10) - 6) + 'a8 8 0 0 1 16 0V' + r1(TY(-10) + 4), 'tglass') +
    '<g clip-path="url(#pc-tube)"><g ' + c('liq') + '>' + rect(182, TY(5), 8, TY(-10) - TY(5) + 10, 'tred') + '</g></g>' +
    '<circle cx="186" cy="' + r1(TY(-10) + 14) + '" r="11" ' + c('tbulb') + '/>' + tticks +
    text(186, 228, '°C', 'tn') + '</g>';
  const tubeClip = '<clipPath id="pc-tube"><rect x="180" y="' + r1(TY(10) - 6) + '" width="12" height="' + r1(TY(-10) - TY(10) + 12) + '"/></clipPath>';

  const cliffs = stripes('pc-left', 0, 240) + path(LEFT, '', c('o') + ' fill="none"') +
    path('M0 168l40-6 26 8 40-4 34 10 44-6 30 14 22 8', '', 'stroke="var(--pc-top)" stroke-width="7"') +
    stripes('pc-right', 600, 800) + path(RIGHT, '', c('o') + ' fill="none"') +
    path('M800 176l-36-6-30 10-38-2-26 12-20 18-22 4', '', 'stroke="var(--pc-top)" stroke-width="7"') +
    path('M60 230l8 22-6 18M112 300l10 16M700 236l-8 20 6 14M748 300l-10 18', '', c('o2')) +
    // plants on the tops
    '<g ' + c('gr2') + ' stroke="var(--pc-gr2)" stroke-width="3">' + use('pc-tuft', 70, 166) + use('pc-tuft', 150, 168) + use('pc-tuft', 712, 172) + use('pc-tuft', 768, 172) + '</g>' +
    // a cactus on the right cliff
    path('M664 196v-40a8 8 0 0 1 16 0v40z', 'gr', c('o2')) + path('M664 178h-8a6 6 0 0 1-6-6v-10a5 5 0 0 1 10 0v8h4M680 172h6v-14a5 5 0 0 1 10 0v12a8 8 0 0 1-8 8h-8', 'gr', c('o2')) +
    // rock art on the right cliff: a growing pattern of dots, 1, 2, 3, 4 (painted in white)
    (function () { let d = ''; for (let k = 1; k <= 4; k++) for (let j = 0; j < k; j++) d += '<circle cx="' + (690 + (k - 1) * 24) + '" cy="' + (268 - j * 11) + '" r="3.6"/>'; return '<g fill="var(--pc-st)" opacity=".85">' + d + '</g>'; })() +
    thermo;

  /* ---------- a line of flags across the canyon: a colour pattern (orange, blue, yellow, again and again) ---------- */
  const FLAG = ['#E58A4E', '#2F7FD4', '#F5C142'];
  let flags = path('M228 150Q434 222 640 160', '', 'stroke="var(--pc-cl)" stroke-width="2"');
  for (let i = 0; i < 12; i++) {
    const t = (i + 0.5) / 12, x = (1 - t) * (1 - t) * 228 + 2 * (1 - t) * t * 434 + t * t * 640, y = (1 - t) * (1 - t) * 150 + 2 * (1 - t) * t * 222 + t * t * 160;
    flags += '<path d="M' + r1(x - 9) + ' ' + r1(y - 1) + 'h18l-9 17z" fill="' + FLAG[i % 3] + '" ' + c('o2') + '/>';
  }
  const bunting = '<g ' + c('flags') + '>' + flags + '</g>';

  /* ---------- floor: the sand on the left, the river at sea level (0, y = 286) ---------- */
  const SEA = 286;
  let ripples = '';
  for (let i = 0; i < 12; i++) ripples += 'M' + (392 + i * 40) + ' ' + (SEA + 2) + 'q10-6 20 0t20 0';
  const floor = path('M0 500V352c40-10 90-8 130-2 40-6 80-4 110 0l60 2 92 0V500Z', 'sd') +
    path('M20 380c30-4 60-2 84 2M150 404c40-4 70-2 96 4M40 440c40-6 90-4 120 2', '', 'stroke="var(--pc-sd2)" stroke-width="4"') +
    use('pc-rock', 40, 368, c('rk2') + ' ' + c('o2')) + use('pc-rock', 260, 392, c('rk') + ' ' + c('o2') + ' transform="translate(260 392) scale(.8) translate(-260 -392)"') +
    // the camp fire (it glows at night)
    path('M92 350l26-8M94 342l24 8', '', 'stroke="#8A4A1E" stroke-width="5"') +
    '<g ' + c('fire') + '><g ' + c('flame') + '>' + path('M105 340c-10-8-6-20 0-28 2 8 8 8 8 0 8 8 10 22-8 28z', '', 'fill="#FFB23E"') + path('M106 340c-4-4-2-10 1-13 1 4 4 4 4 0 3 4 3 10-5 13z', '', 'fill="#FFE38A"') + '</g></g>';
  // the river: in front of the steps that are under the water
  const river = '<g ' + c('river') + '>' + rect(392, SEA, 408, 500 - SEA, '', 'fill="url(#pc-water)"') +
    '<g clip-path="url(#pc-river)"><g ' + c('ripple') + '>' + path(ripples, 'wt') + path(ripples.replace(new RegExp(' ' + (SEA + 2) + 'q', 'g'), ' ' + (SEA + 60) + 'q'), 'wt', 'opacity=".5" transform="translate(-14 0)"') + '</g></g>' +
    path('M392 ' + SEA + 'H800', '', 'stroke="var(--pc-wt)" stroke-width="3"') + '</g>';

  /* ---------- things: the staircase that counts back in 2s past zero, Zip ready on the 6 ---------- */
  const STEP = { x: 236, y: SEA - 60, w: 52, h: 20 };                          // step 0 (the 4th) is at sea level
  const vals = [6, 4, 2, 0, -2, -4];
  let bodies = '', wet = '', outer = '', heart = '';
  vals.forEach(function (v, i) {
    const x = STEP.x + i * STEP.w, y = STEP.y + i * STEP.h, uw = v < 0;
    bodies += rect(x, y, STEP.w, 500 - y, i % 2 ? 'c3' : 'c1', c('o'));
    let step = '';
    if (uw) wet += rect(x, y, STEP.w, 6, 'top'); else step += rect(x + 1.5, y + 1.5, STEP.w - 3, 6, 'top');
    const lab = v < 0 ? M + (-v) : String(v);
    step += rect(x + 9, y + 10, STEP.w - 18, 24, uw ? 'pl-uw' : 'pl', 'rx="8" ' + c('o2')) + text(x + STEP.w / 2, y + 29, lab, uw ? 'n n-uw' : 'n');
    if (i >= 2 && i <= 4) heart += step; else outer += step;
    if (i < vals.length - 1) {
      const x1 = x + STEP.w / 2, x2 = x1 + STEP.w, y1 = y - 3, y2 = y + STEP.h - 3;
      const jump = path('M' + (x1 + 5) + ' ' + y1 + 'Q' + (x1 + STEP.w / 2 + 2) + ' ' + (y1 - 30) + ' ' + (x2 - 2) + ' ' + (y2 - 3), 'arc') +
        path('M' + (x2 - 12) + ' ' + (y2 - 11) + 'L' + (x2 - 2) + ' ' + (y2 - 3) + 'L' + (x2 - 1) + ' ' + (y2 - 16), 'arc');
      if (i === 2 || i === 3) heart += jump;              // the jumps over zero: 2 to 0, then 0 to -2
      else outer += jump + text(x1 + STEP.w / 2 + 8, y1 - 19, M + ' 2', 'arct');
    }
  });
  // the heart: the steps 2, 0 and -2 and the jumps over zero (the bodies go down under the sheet)
  const staircase = bodies + wet + river + outer + '<g data-heart="steps">' + heart + '</g>';

  // Zip on the step "6", ready to count back, hopping now and then
  const zip = '<g ' + c('zipbox') + '><g transform="translate(238 177) scale(.4)">' +
    '<line x1="60" y1="24" x2="60" y2="13" stroke="#0E2B58" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="11" r="6" fill="#F7B53C" stroke="#B8770E" stroke-width="2.5"/>' +
    '<rect x="9" y="46" width="12" height="22" rx="6" fill="#F7B53C" stroke="#B8770E" stroke-width="2.5"/><rect x="99" y="46" width="12" height="22" rx="6" fill="#F7B53C" stroke="#B8770E" stroke-width="2.5"/>' +
    '<rect x="34" y="92" width="52" height="30" rx="13" fill="#5AB4EE" stroke="#1E5D9F" stroke-width="3"/><circle cx="60" cy="107" r="6" fill="#E5404A"/>' +
    '<path d="M36 100Q13 103 6 75" fill="none" stroke="#1E5D9F" stroke-width="7" stroke-linecap="round"/><circle cx="6" cy="72" r="6.5" fill="#5AB4EE" stroke="#1E5D9F" stroke-width="3"/>' +
    '<path d="M84 100Q107 103 114 75" fill="none" stroke="#1E5D9F" stroke-width="7" stroke-linecap="round"/><circle cx="114" cy="72" r="6.5" fill="#5AB4EE" stroke="#1E5D9F" stroke-width="3"/>' +
    '<rect x="17" y="22" width="86" height="68" rx="24" fill="#1D4F9C" stroke="#0E2B58" stroke-width="3"/>' +
    '<rect x="27" y="33" width="66" height="46" rx="16" fill="#EAF6FF"/>' +
    '<ellipse cx="46" cy="52" rx="6" ry="7.5" fill="#0E2B58"/><ellipse cx="74" cy="52" rx="6" ry="7.5" fill="#0E2B58"/>' +
    '<circle cx="48" cy="49" r="2" fill="#FFFFFF"/><circle cx="76" cy="49" r="2" fill="#FFFFFF"/>' +
    '<circle cx="36" cy="66" r="4.5" fill="#FF9AA2"/><circle cx="84" cy="66" r="4.5" fill="#FF9AA2"/>' +
    '<path d="M47 63Q60 74 73 63" fill="none" stroke="#0E2B58" stroke-width="3" stroke-linecap="round"/></g></g>';

  // stepping stones in the river: the square numbers as dots, 1, 4, 9, then a "?"
  function stone(x, y, k) {
    let s = '<ellipse cx="' + x + '" cy="' + (y + 6) + '" rx="34" ry="13" ' + c('rk2') + '/>' + '<ellipse cx="' + x + '" cy="' + y + '" rx="34" ry="13" ' + c('st') + ' ' + c('stl') + '/>';
    if (k) {
      const g = 9, x0 = x - (k - 1) * g / 2, y0 = y - (k - 1) * g * 0.45 / 2;
      for (let r = 0; r < k; r++) for (let q = 0; q < k; q++) s += '<circle cx="' + r1(x0 + q * g) + '" cy="' + r1(y0 + r * g * 0.45) + '" r="3.2" ' + c('dot') + '/>';
    } else s += '<text x="' + x + '" y="' + (y + 6) + '" ' + c('q') + '>?</text>';
    return s;
  }
  const stones = stone(604, 336, 1) + stone(670, 360, 2) + stone(736, 386, 3) + stone(792, 414, 0);

  const label = 'The Pattern Canyon: steps cut into the cliff count back in 2s, 6, 4, 2, 0 at the water, then ' + M + '2 and ' + M +
    '4 under the water. Zip stands on the 6. A thermometer rock and stepping stones with square number dots 1, 4 and 9.';

  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" class="art" data-art="' + ID +
    '" data-view="0 0 800 500" data-safe="150,150,500,210" data-band="224,338" role="img" aria-label="' + label +
    '" fill="none" stroke-linejoin="round" stroke-linecap="round"><style>' + css + '</style>' + defs.replace('</defs>', tubeClip + '</defs>') +
    '<g data-layer="sky">' + sky + '</g>' +
    '<g data-layer="far">' + far + '</g>' +
    '<g data-layer="cliffs">' + cliffs + bunting + '</g>' +
    '<g data-layer="floor">' + floor + '</g>' +
    '<g data-layer="things">' + staircase + zip + stones + '</g>' +
    '</svg>';

  window.T_ART = window.T_ART || {};
  window.T_ART[ID] = svg;
})();
