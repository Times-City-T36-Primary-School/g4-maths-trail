/* g4-shared.js - Grade 4: small fixes that belong to no single stop.
   The level pill of a game ("Level 1 of 2", 50-practise.js) floats over the top right of the level. When the question
   scrolls under it, it would cover words of the question, so it fades out while the level is scrolled (CSS in
   037_g4-shared.css) and comes back at the top. */
(function () {
  'use strict';
  document.addEventListener('scroll', function (e) {
    const box = e.target && e.target.nodeType === 1 ? e.target : null;
    if (!box || !box.closest) return;
    const level = box.closest('.gm-level') || (box.querySelector && box.querySelector('.gm-level'));
    if (level) level.classList.toggle('is-scrolled', box.scrollTop > 8);
  }, true);
})();
