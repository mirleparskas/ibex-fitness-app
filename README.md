# Ibex Athletic Training App

An editable eight-week athletic training block for glute development, upper-body
strength and hypertrophy, sprinting, jumping, Olympic-lifting skill, core work,
conditioning, and cardiovascular health.

The weekly dashboard separates completed exposures from planned coverage. Moving a
session preserves its targets; deleting purpose-matched work exposes the resulting
gap. The default plan uses Foundation (Weeks 1-2), Loading (Weeks 3-4), Progression
(Weeks 5-7), and Deload (Week 8) phases.

Open `index.html` directly in a browser, or run a simple local server from this folder.

## Edit Workouts

Most changes happen in `workouts.js`.

- Strength progressions: edit `PROGRAM.progressions`.
- Cardio formats: edit `PROGRAM.cardio`.
- Weekly rules, warm-ups, and block notes: edit `PROGRAM.rules`, `PROGRAM.warmups`, and `PROGRAM.blocks`.
- Day structure and layout behavior: edit `app.js`.
- Colors, spacing, and responsive design: edit `app.css`.
- In the app, use Week Layout controls to move/delete days, add days, and add cardio/lift/accessory/note sections.

The app saves completed workouts, cardio scores, lifting logs, and notes in browser `localStorage`.
Use the Reset Progress button to clear saved local data.

## Plan Structure

- Monday: EMOM + lower strength + glutes
- Tuesday: Zone 2 + upper push + shoulders/triceps
- Wednesday: Zone 2 recovery + optional mobility/core
- Thursday: Zone 2 + Olympic lift technique + upper pull/back/biceps
- Friday: AMRAP + posterior chain + glutes/hams
- Saturday: Zone 2 + optional full-body pump
- Sunday: Recovery cardio only

Every day starts with cardio. The default is 4 core lifting days plus an optional
fifth pump day. On Zone 2 days, lifting can be heavier because the cardio is
controlled. On EMOM and AMRAP days, lifting stays moderate: good form only, no
testing maxes, and no grinding reps.

Weeks 1-3 rebuild volume and technique. Week 4 changes the stimulus and lowers
load. Weeks 5-7 build load, reps, or density. Week 8 retests repeatable effort.
