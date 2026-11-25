/* 027b_g4-nav.js - Grade 4: "Go to" - one tap from any screen to the trail map, any stop or the Summit.

   Children kept pressing the back arrow again and again to climb out of an activity (a game -> its menu -> the stop ->
   the map). This adds ONE more button, with the map icon, beside the back arrow:
     - in the top bar of every activity (16-stage.js: Words, See it, Practise, Notes, the Mini Practice test, Lightning,
       Self-check, the Summit's final test, big Lightning round and certificate)
     - on every stop hub, the locked hub and the Summit (35-hub.js, 79-summit.js), floating over the scene
   It opens a sheet: the trail map first, then the nine stops (badge, world, topic, stars, "You are here"), then the
   Summit. One tap goes there. Leaving works exactly as the back arrow does (the router tears the activity down; the
   Summit's Paper 1 is kept as before).
   T.nav.button(kind)  -> the button ('band' on the dark top bar, 'float' over a scene)
   T.nav.open()        -> the sheet
   The first time a child opens an activity, a toast says what the button does (once per device). */
(function (T) {
  'use strict';

  const el = function () { return T.util.el.apply(null, arguments); };
  const TIP_KEY = 'g4-maths-trail-nav-tip';

  const TXT = {
    button: 'Go to the trail map or another stop',
    title: 'Where do you want to go?',
    titleVi: 'Em muốn đi đâu?',
    map: 'The trail map',
    mapVi: 'Bản đồ hành trình',
    mapLine: 'See all the stops',
    stops: 'Stops',
    here: 'You are here',
    summit: 'The Summit',
    summitLine: 'Final test, big Lightning round, certificate',
    tip: 'Tap the *map* button at the top to go to the map or any stop.'
  };

  function here() {
    try {
      const cur = T.router && T.router.current ? T.router.current() : null;
      if (!cur) return { stop: null, route: '' };
      const n = cur.params && cur.params.n != null ? Number(cur.params.n) : null;
      return { stop: n, route: String(cur.route || '') };
    } catch (e) { return { stop: null, route: '' }; }
  }

  function stars(n) {
    try { return T.progress.stopStars(n); } catch (e) { return 0; }
  }

  function go(route, handle) {
    if (handle) handle.close();
    try { T.fx.sfx('tap'); } catch (e) { /* sound is a nicety */ }
    T.router.go(route);
  }

  function row(opts, handle) {
    const b = el('button', { type: 'button', class: ['g4nav__row', opts.here && 'is-here', opts.cls], 'aria-current': opts.here ? 'page' : null },
      el('span', { class: 'g4nav__pic', 'aria-hidden': 'true' }, opts.pic),
      el('span', { class: 'g4nav__text' },
        opts.over ? el('span', { class: 'g4nav__over' }, opts.over) : null,
        el('span', { class: 'g4nav__name' }, opts.name),
        opts.line ? el('span', { class: 'g4nav__line' }, opts.line) : null),
      el('span', { class: 'g4nav__end' },
        opts.here ? el('span', { class: 'g4nav__here' }, TXT.here) : null,
        opts.stars != null ? el('span', { class: 'g4nav__stars', 'aria-label': opts.stars + ' of 15 stars' }, T.ui.icon('star'), opts.stars + '/15') : null));
    b.addEventListener('click', function () { go(opts.route, handle); });
    return b;
  }

  function badge(id) {
    return T.ui.plate(T.ui.art(id, { decorative: true }), { shape: 'round bleed', replay: false });
  }

  function open() {
    T.ui.closeOverlays();
    const now = here();
    const body = el('div', { class: 'g4nav' });
    const dlg = T.ui.dialog({ title: TXT.title, body: body, sheet: true, cls: 'dialog--g4nav' });
    const sub = el('p', { class: 'g4nav__vi', lang: 'vi' }, TXT.titleVi);
    body.appendChild(sub);
    body.appendChild(row({ pic: el('span', { class: 'g4nav__mapicon' }, T.ui.icon('map')), name: TXT.map, line: TXT.mapLine + ' · ' + TXT.mapVi,
      route: 'home', cls: 'g4nav__row--map', here: now.route === 'home' }, dlg));
    body.appendChild(el('h3', { class: 'g4nav__head' }, TXT.stops));
    const list = el('div', { class: 'g4nav__list' });
    (T.stops || []).forEach(function (info) {
      list.appendChild(row({ pic: badge(info.badgeArt), over: 'Stop ' + info.n + ' · ' + info.world, name: info.title,
        stars: stars(info.n), route: 'stop-' + info.n, here: now.stop === info.n }, dlg));
    });
    body.appendChild(list);
    if (window.T_ART && window.T_ART['badge-summit'] && T.summit) {
      body.appendChild(row({ pic: badge('badge-summit'), over: 'After Stop 9', name: TXT.summit, line: TXT.summitLine,
        route: 'summit', cls: 'g4nav__row--summit', here: /^summit/.test(now.route) }, dlg));
    }
    // the current place comes into view (a long list on a phone)
    setTimeout(function () { const cur = body.querySelector('.is-here'); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' }); }, 40);
    return dlg;
  }

  function button(kind) {
    const b = T.ui.iconButton({ icon: 'map', label: TXT.button, kind: kind || 'band', cls: 'g4nav-btn', onClick: function () { open(); } });
    b.setAttribute('title', TXT.button);
    return b;
  }

  // once per device: say what the new button does
  function tipOnce() {
    let seen = false;
    try { seen = window.localStorage.getItem(TIP_KEY) === '1'; } catch (e) { seen = true; }
    if (seen) return;
    try { window.localStorage.setItem(TIP_KEY, '1'); } catch (e) { /* private window: the tip may come again */ }
    setTimeout(function () { try { T.ui.toast(TXT.tip, { ms: 4200 }); } catch (e) { /* no toast */ } }, 900);
  }

  T.nav = { button: button, open: open, tipOnce: tipOnce, TXT: TXT };
})(window.T = window.T || {});
