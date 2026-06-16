# Muscle + Conditioning Training App

Open `index.html` directly in a browser, or run a simple local server from this folder.

## Edit Workouts

Most changes happen in `workouts.js`.

- Strength progressions: edit `PROGRAM.progressions`.
- Daily cardio options: edit `PROGRAM.cardio.daily`.
- Warm-ups, accessories, and lifting day structure: edit `PROGRAM.warmups`, `PROGRAM.accessories`, and `app.js`.
- Week tabs and layout behavior: edit `app.js`.
- Colors, spacing, and responsive design: edit `app.css`.

The app saves completed workouts, cardio scores, lifting logs, and notes in browser `localStorage`.
Use the Reset Progress button to clear saved local data.

## Plan Structure

- Day 1: Glute focus, hip thrust and upper pull
- Day 2: Full body, push/pull/legs
- Day 3: Glute focus, squat and shape
- Day 4: Full body, hinge and upper
- Day 5: Glute focus, posterior chain
- Day 6: Full body, pump and athletic work
- Day 7: Rest or active recovery

Every day includes a 30-45 minute cardio target, with running, StairMaster,
HIIT, EMOM, incline walk, machine mix, interval, and recovery options rotated
through the week. Lifting is designed to take about 30-40 minutes after cardio.
Weeks 1-4 restart consistency and Weeks 5-8 build load, reps, and density.
