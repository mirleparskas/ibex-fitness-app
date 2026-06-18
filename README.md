# Cardio-First Glute Recomp App

Open `index.html` directly in a browser, or run a simple local server from this folder.

## Edit Workouts

Most changes happen in `workouts.js`.

- Strength progressions: edit `PROGRAM.progressions`.
- Cardio formats: edit `PROGRAM.cardio`.
- Weekly rules, warm-ups, and block notes: edit `PROGRAM.rules`, `PROGRAM.warmups`, and `PROGRAM.blocks`.
- Day structure and layout behavior: edit `app.js`.
- Colors, spacing, and responsive design: edit `app.css`.

The app saves completed workouts, cardio scores, lifting logs, and notes in browser `localStorage`.
Use the Reset Progress button to clear saved local data.

## Plan Structure

- Monday: EMOM + lower strength + glutes
- Tuesday: Zone 2 + upper push + shoulders/triceps
- Wednesday: Chipper + Olympic lift technique + posterior accessories
- Thursday: Zone 2 + upper pull + back/biceps
- Friday: AMRAP + posterior chain + glutes/hams
- Saturday: Zone 2 + full-body pump
- Sunday: Recovery cardio only

Every day starts with cardio. On Zone 2 days, lifting can be heavier because the
cardio is controlled. On EMOM, AMRAP, and chipper days, lifting stays moderate:
good form only, no testing maxes, and no grinding reps.

Weeks 1-3 rebuild volume and technique. Week 4 changes the stimulus and lowers
load. Weeks 5-7 build load, reps, or density. Week 8 retests repeatable effort.
