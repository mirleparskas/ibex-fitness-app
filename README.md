# Glute Recomp Training App

Open `index.html` directly in a browser, or run a simple local server from this folder.

## Edit Workouts

Most changes happen in `workouts.js`.

- Strength progressions: edit `PROGRAM.progressions`.
- Daily cardio options: edit `PROGRAM.cardio.daily`.
- Weekly exercise variations: edit `PROGRAM.weekVariations`.
- Warm-ups, accessories, and lifting day structure: edit `PROGRAM.warmups`, `PROGRAM.accessories`, and `app.js`.
- Week tabs and layout behavior: edit `app.js`.
- Colors, spacing, and responsive design: edit `app.css`.

The app saves completed workouts, cardio scores, lifting logs, and notes in browser `localStorage`.
Use the Reset Progress button to clear saved local data.

## Plan Structure

- Day 1: Glute build, thrust strength and Zone 2
- Day 2: CrossFit strength, power cleans, T2B, and conditioning
- Day 3: Glute build, squat/lunge pattern and StairMaster/incline
- Day 4: Upper bodybuilding, push press, and EMOM
- Day 5: Glute build, hinge/posterior chain and machine intervals
- Day 6: Mixed-modal conditioning, trunk skill, pump, and glute finisher
- Day 7: Rest or active recovery

Every week keeps the same structure, but the exact lift variation changes so
movement patterns progress without feeling like the same workout on repeat.
Weeks 1-3 rebuild volume and technique. Week 4 is a pivot/deload-style change
up. Weeks 5-7 push load, density, and bodybuilding volume. Week 8 retests clean
reps, glute strength, and conditioning.
