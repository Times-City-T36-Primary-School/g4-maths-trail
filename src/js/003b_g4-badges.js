/* g4-badges.js - Grade 4: the round badges of the three worlds that are new in this trail (viewBox 200, the same
   recipe as 02-art-maths.js): badge-g7 Mirror Lake, badge-g8 Box Workshop, badge-g9 Data Fair. */
(function () {
  'use strict';
  const INK = '#2A2F3A', o = 'stroke="' + INK + '" stroke-width="3"';
  function badge(id, label, bg, ring, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="art" data-art="' + id +
      '" data-shape="circle" role="img" aria-label="' + label + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' +
      '<circle cx="100" cy="100" r="100" fill="' + bg + '"/>' +
      '<circle cx="100" cy="100" r="92" fill="none" stroke="' + ring + '" stroke-width="4" opacity=".35"/>' + body + '</svg>';
  }
  const ART = {};
  // Mirror Lake: an isosceles mountain and its reflection in the lake; the water line is the mirror line
  ART['badge-g7'] = badge('badge-g7', 'Mirror Lake: a triangle mountain and its reflection in the water.', '#D9F0DC', '#2D7C3A',
    '<path d="M22 104h156v40a78 60 0 0 1-156 0z" fill="#9FD3E8" opacity=".9"/>' +
    '<path d="M100 44l46 60H54z" fill="#43A852" ' + o + '/><path d="M100 44l12 16-12 8-12-8z" fill="#FFFFFF" ' + o + '/>' +
    '<path d="M100 164l46-60H54z" fill="#43A852" opacity=".45" stroke="' + INK + '" stroke-width="3" stroke-opacity=".45"/>' +
    '<path d="M26 104h148" stroke="' + INK + '" stroke-width="4" stroke-dasharray="9 8"/>' +
    '<path d="M100 30v-8M92 26h16" stroke="#E5533D" stroke-width="4"/>');
  // Box Workshop: the cross net of a cube and the cube it folds into
  ART['badge-g8'] = badge('badge-g8', 'Box Workshop: the net of a cube and a cube.', '#DCE8EF', '#3C6880',
    '<g fill="#F5C24A" ' + o + '><rect x="62" y="40" width="30" height="30"/><rect x="32" y="70" width="30" height="30"/>' +
    '<rect x="62" y="70" width="30" height="30" fill="#E5533D"/><rect x="92" y="70" width="30" height="30"/>' +
    '<rect x="62" y="100" width="30" height="30"/><rect x="62" y="130" width="30" height="30"/></g>' +
    '<g ' + o + '><path d="M124 118l22-12 22 12-22 12z" fill="#8FC1DE"/><path d="M124 118v26l22 12v-26z" fill="#5B8CA8"/>' +
    '<path d="M168 118v26l-22 12v-26z" fill="#3C6880"/></g>');
  // Data Fair: a bar chart; the tallest bar (the mode) is gold, with a flag
  ART['badge-g9'] = badge('badge-g9', 'Data Fair: a bar chart with one tallest bar.', '#F6D9EE', '#92367E',
    '<path d="M44 46v108h116" ' + o + '/>' +
    '<g ' + o + '><rect x="56" y="112" width="20" height="42" fill="#2F7FD4"/><rect x="82" y="64" width="20" height="90" fill="#F5C24A"/>' +
    '<rect x="108" y="94" width="20" height="60" fill="#43A852"/><rect x="134" y="124" width="20" height="30" fill="#E5533D"/></g>' +
    '<path d="M92 64V42" ' + o + '/><path d="M92 42l18 7-18 7z" fill="#C050A8" ' + o + '/>');
  window.T_ART = Object.assign(window.T_ART || {}, ART);
})();
