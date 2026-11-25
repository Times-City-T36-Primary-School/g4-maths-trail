/* 20-stops.js - the nine stops of the Grade 4 Maths trail: what the map and the hubs know about each one.

   T.stops[i] = { n, title, world, place, badge, unit, los, status, quick, dataWorld, badgeArt, sceneArt }
     n         the stop number, 1 to 9 (T.stops[n - 1]); a Number
     title     the maths topic (the same as the pack's title; the nine topics of docs/01-brief.md)
     world     the name of the stop's world (shown on the map, the hub, the big button)
     place     the world as a sentence says it: 'the Number Factory' ("Visit ...", "Try Stop N now: ...",
               "You finished every step of ...")
     badge     the badge that all five steps win
     unit      the unit of the course, for teachers (as in Maths v2)
     los       the learning objective codes of the stop (Cambridge Primary Mathematics Stage 5, as in Maths v2)
     status    'open' (it can be opened; a stop whose pack has not arrived yet shows a "coming soon" hub) or 'soon'
     quick     true for a quick-practice stop: only its Practise games are ready. Its hub says so ("Quick practice")
     hue       the world colour of the stop on the map and the hub (1 to 9; Grade 4 reuses the drawn worlds in a new order)
     dataWorld the value of data-world on #app inside the stop ('1' to '9'): it switches the world tokens
     badgeArt  the id of the round map picture, 'badge-N' (src/art/02-art-maths.js)
     sceneArt  the id of the world scene for the hub header (until it is drawn, the hub shows the badge on
               the world's own sky and hills)

   Also here: T.OBJECTIVES (code -> skill), T.TWM (the 8 TWM characteristics), T.DOK (the 3 DOK levels) and
   T.DOK_MIX (the DOK of the 10 Mini Practice test questions, in order).

   Session 1: all nine stops are open and every pack holds only its title and blurb, so every step
   says "Coming soon". The steps arrive stop by stop (docs/03-build-plan.md). */
(function (T) {
  'use strict';

  // the Cambridge Primary Mathematics Stage 5 objectives of the test (codes and wording as in the public test
  // specification, legacy/maths-v2/spec_grade3.txt): shown with every Practise question (code + skill)
  T.OBJECTIVES = {
    "5Np.01": "Understand and explain the value of each digit in decimals (tenths and hundredths)",
    "5Np.02": "Use knowledge of place value to multiply and divide numbers by 10, 100 and 1,000",
    "5Np.03": "Use knowledge of place value to multiply and divide decimals by 10 and 100",
    "5Np.04": "Compose, decompose and regroup numbers, including decimals (tenths and hundredths)",
    "5Np.05": "Round numbers with one decimal place to the nearest whole number",
    "5Nc.01": "Count on and count back in steps of constant size, and extend beyond zero to include negative numbers",
    "5Nc.02": "Recognise the use of objects, shapes or symbols to represent two unknown quantities in addition and subtraction calculations",
    "5Nc.03": "Use the relationship between repeated addition of a constant and multiplication to find any term of a linear sequence",
    "5Nc.04": "Recognise and extend the spatial patterns of square and triangular numbers",
    "5Ni.01": "Estimate, add and subtract integers, including where one integer is negative",
    "5Ni.06": "Understand and explain the difference between prime and composite numbers",
    "5Ni.08": "Use knowledge of multiplication to recognise square numbers (from 1 to 100)",
    "5Nf.01": "Understand that a fraction can be represented as a division of the numerator by the denominator",
    "5Nf.02": "Understand that proper fractions can act as operators",
    "5Nf.03": "Recognise that improper fractions and mixed numbers can have an equivalent value",
    "5Nf.04": "Recognise that proper fractions, decimals (one decimal place) and percentages can have equivalent values",
    "5Nf.07": "Recognise percentages of shapes, and write percentages as a fraction with denominator 100",
    "5Nf.08": "Compare and order numbers with one decimal place, proper fractions with the same denominator and percentages, using =, > and <",
    "5Nf.09": "Estimate, add and subtract numbers with the same number of decimal places",
    "5Gg.01": "Identify, describe, classify and sketch isosceles, equilateral or scalene triangles, including reference to angles and symmetrical properties",
    "5Gg.04": "Identify, describe and sketch 3D shapes in different orientations",
    "5Gg.05": "Identify and sketch different nets for a cube",
    "5Gg.06": "Use knowledge of reflective symmetry to identify and complete symmetrical patterns",
    "5Gp.04": "Reflect 2D shapes in both horizontal and vertical mirror lines to create patterns on square grids",
    "5Ss.03": "Find and interpret the mode and the median, and consider their appropriateness for the context"
  };

  // Thinking and Working Mathematically: the 8 characteristics of the Cambridge Primary Mathematics curriculum
  // framework (0096). Every Mini Practice test question and every Practise round names 1 (at most 2) of them
  // (twm: ['TWM.04']); the tagging rule is in docs/05-content-rules.md. Shown as "TWM.04 Convincing".
  T.TWM = {
    "TWM.01": { name: "Specialising", what: "Choosing an example and checking whether it meets given criteria" },
    "TWM.02": { name: "Generalising", what: "Spotting a pattern or rule that works for many examples" },
    "TWM.03": { name: "Conjecturing", what: "Forming a mathematical idea or question that might be true" },
    "TWM.04": { name: "Convincing", what: "Giving evidence to justify or challenge an idea or answer" },
    "TWM.05": { name: "Characterising", what: "Describing the mathematical properties of an object" },
    "TWM.06": { name: "Classifying", what: "Sorting objects into groups by their properties" },
    "TWM.07": { name: "Critiquing", what: "Comparing and judging ideas, methods or answers" },
    "TWM.08": { name: "Improving", what: "Refining an idea or method to make it better" }
  };

  // Depth of Knowledge (Webb), as in the public test specification: every Mini Practice test question has
  // dok 1, 2 or 3 (Grade 3: DOK 1 30-45%, DOK 2 40-55%, DOK 3 10-15%; a Mini test is 4, 5 and 1, easy to hard).
  // Shown on the test paper as "DOK 2 Skill and concept".
  T.DOK = {
    1: { name: "Recall", what: "Recall facts and use simple skills: recall, recognise, locate, identify" },
    2: { name: "Skill and concept", what: "Process beyond recall: interpret, classify, organise, compare, use a skill in a new way" },
    3: { name: "Strategic thinking", what: "Reason with a plan or several steps: explain, generalise, support thinking with evidence" }
  };
  T.DOK_MIX = [1, 1, 1, 1, 2, 2, 2, 2, 2, 3];   // the 10 questions of a Mini Practice test, in order

  T.stops = [
    { n: 1, title: 'Decimals and place value', world: 'Number Factory', place: 'the Number Factory', badge: 'Decimal Pro', unit: 'Unit 1', los: ['5Np.01', '5Np.04', '5Np.05'], status: 'open', hue: 1, dataWorld: '1', badgeArt: 'badge-1', sceneArt: 'world-number-factory' },
    { n: 2, title: 'Multiply and divide by 10, 100 and 1,000', world: 'Times Table Tower', place: 'the Times Table Tower', badge: 'Place Shifter', unit: 'Unit 1', los: ['5Np.02', '5Np.03'], status: 'open', hue: 5, dataWorld: '5', badgeArt: 'badge-5', sceneArt: 'world-times-table-tower' },
    { n: 3, title: 'Add and subtract decimals and negatives', world: 'Market Square', place: 'the Market Square', badge: 'Sum Star', unit: 'Unit 5', los: ['5Nf.09', '5Ni.01', '5Nc.02'], status: 'open', hue: 4, dataWorld: '4', badgeArt: 'badge-4', sceneArt: 'world-market-square' },
    { n: 4, title: 'Fractions', world: 'Sharing Harbour', place: 'the Sharing Harbour', badge: 'Fraction Hero', unit: 'Unit 7', los: ['5Nf.01', '5Nf.02', '5Nf.03'], status: 'open', hue: 6, dataWorld: '6', badgeArt: 'badge-6', sceneArt: 'world-sharing-harbour' },
    { n: 5, title: 'Fractions, decimals and percentages', world: 'Percent Garden', place: 'the Percent Garden', badge: 'Percent Pro', unit: 'Unit 7', los: ['5Nf.04', '5Nf.07', '5Nf.08'], status: 'open', hue: 7, dataWorld: '7', badgeArt: 'badge-7', sceneArt: 'world-fraction-garden' },
    { n: 6, title: 'Sequences and special numbers', world: 'Pattern Canyon', place: 'the Pattern Canyon', badge: 'Pattern Spotter', unit: 'Unit 3', los: ['5Nc.01', '5Nc.03', '5Nc.04', '5Ni.08', '5Ni.06'], status: 'open', hue: 2, dataWorld: '2', badgeArt: 'badge-2', sceneArt: 'world-pattern-canyon' },
    { n: 7, title: 'Triangles and symmetry', world: 'Mirror Lake', place: 'the Mirror Lake', badge: 'Symmetry Star', unit: 'Unit 2', los: ['5Gg.01', '5Gg.06', '5Gp.04'], status: 'open', hue: 3, dataWorld: '3', badgeArt: 'badge-g7', sceneArt: 'world-mirror-lake' },
    { n: 8, title: '3D shapes and nets', world: 'Box Workshop', place: 'the Box Workshop', badge: 'Net Builder', unit: 'Unit 6', los: ['5Gg.04', '5Gg.05'], status: 'open', hue: 8, dataWorld: '8', badgeArt: 'badge-g8', sceneArt: 'world-box-workshop' },
    { n: 9, title: 'Mode and median', world: 'Data Fair', place: 'the Data Fair', badge: 'Data Detective', unit: 'Unit 4', los: ['5Ss.03'], status: 'open', hue: 9, dataWorld: '9', badgeArt: 'badge-g9', sceneArt: 'world-chance-fair' }
  ];
})(window.T = window.T || {});
