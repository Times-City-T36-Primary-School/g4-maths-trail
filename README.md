# EOS 1 – G4 Maths Revision Trail

A revision app for Grade 4 (Cambridge Primary Mathematics Stage 5), End of Semester 1, Times City T36 Primary School.
Created by Mr Jovan.

**Open the app:** https://times-city-t36-primary-school.github.io/g4-maths-trail/

## What is in it
- 9 stops, one topic each: Words, See it, Practise, Notes and a 10-question Mini Practice test, plus a Lightning round and
  My self-check. English with Vietnamese on every line.
- The Summit: a two-paper final test (14 questions and 20 marks each), a big Lightning round and a certificate.
- The map button at the top of every page goes to the trail map or any stop in one tap.
- Stars are saved on the device. A progress code moves them to another device. No names or scores are sent anywhere.

## For teachers who edit it
`index.html` is the whole app (built). Its source is in `src/` (`src/js/0NN_22-pack-stopN.js` holds all the content of
stop N). Rebuild with `python3 tools/build.py index.html`. Checks (need Node and Playwright):
`node tools/keys.js index.html` (every answer key), `node tools/tour.js` (every screen).
