# Glute + Engine Training App

Open `index.html` directly in a browser, or run a simple local server from this folder.

## Edit Workouts

Most changes happen in `workouts.js`.

- Strength progressions: edit `PROGRAM.progressions`.
- Conditioning workouts: edit `PROGRAM.metcons.snatch`, `PROGRAM.metcons.cleanJerk`, or `PROGRAM.metcons.long`.
- Warm-ups and accessories: edit `PROGRAM.warmups` and `PROGRAM.accessories`.
- Week tabs and layout behavior: edit `app.js`.
- Colors, spacing, and responsive design: edit `app.css`.

The app saves completed workouts, selected tiers, and notes in browser `localStorage`.
Use the Reset Progress button to clear saved local data.

## Plan Structure

- Day 1: Glute full-body, hip thrust focus
- Day 2: Snatch progression and metcon
- Day 3: Glute full-body, squat focus
- Day 4: Clean and jerk progression and metcon
- Day 5: Glute full-body, RDL/deadlift focus
- Day 6: Push press and longer metcon
- Day 7: Rest or active recovery

Weeks 4 and 8 are test/retest weeks.
