const PROGRAM = {
  name: "Glute Recomp Build",
  blocks: [
    {
      name: "Block 1 - Rebuild",
      weeks: "Weeks 1-4",
      summary: "Rebuild after time off with lift-first sessions, glute-focused hypertrophy, full-body muscle work, and controlled conditioning."
    },
    {
      name: "Block 2 - Grow",
      weeks: "Weeks 5-8",
      summary: "Push progressive overload, add glute volume, and keep conditioning hard without flattening lower-body recovery."
    }
  ],
  warmups: {
    glute: "5 min easy bike or incline walk. Then 2 rounds: 12 banded glute bridges, 10 bodyweight RDLs, 10 Cossack squats, 12 lateral band walks/side.",
    fullBody: "5 min easy machine. Then 2 rounds: 8 inchworms, 10 air squats, 10 ring rows, 10 glute bridges, 8 push-ups or incline push-ups.",
    crossfit: "3 min row or bike build. Then 2 rounds: 5 inchworms, 10 PVC pass-throughs, 10 air squats, 10 ring rows, 5 wall-walk holds."
  },
  progressions: {
    hipThrust: ["3x10 @ RPE 6-7", "4x10 @ RPE 7", "4x8 @ RPE 7-8", "3x10 easy deload", "4x8 @ RPE 8", "5x6 @ RPE 8", "4x8 + 1 backoff set", "Build to smooth 6RM"],
    squatPattern: ["3x10 @ RPE 6-7", "4x10 @ RPE 7", "4x8 @ RPE 7-8", "3x10 easy deload", "4x8 @ RPE 8", "5x6 @ RPE 8", "4x8 + 1 backoff set", "Build to smooth 8RM"],
    backSquat: ["3x8 @ RPE 6-7", "4x8 @ RPE 7", "4x6 @ RPE 7-8", "3x8 easy deload", "4x6 @ RPE 8", "5x5 @ RPE 8", "4x6 + 1 backoff set", "Build to smooth 5RM"],
    rdl: ["3x10 @ RPE 6-7", "4x10 @ RPE 7", "4x8 @ RPE 7-8", "3x10 easy deload", "4x8 @ RPE 8", "4x6 @ RPE 8", "4x8 + 1 backoff set", "Build to smooth 6RM"],
    bench: ["3x10 @ RPE 6-7", "4x10 @ RPE 7", "4x8 @ RPE 7-8", "3x10 easy deload", "4x8 @ RPE 8", "5x6 @ RPE 8", "4x8 + 1 backoff set", "Build to smooth 6RM"],
    trapBar: ["3x8 @ RPE 6-7", "4x8 @ RPE 7", "4x6 @ RPE 7-8", "3x8 easy deload", "4x6 @ RPE 8", "5x5 @ RPE 8", "4x6 + 1 backoff set", "Build to smooth 5RM"],
    pushPress: ["3x10 @ RPE 6-7", "4x8 @ RPE 7", "4x8 @ RPE 7-8", "3x10 easy deload", "4x6 @ RPE 8", "5x5 @ RPE 8", "4x6 + 1 backoff set", "Build to smooth 5RM"]
  },
  accessories: {
    upperPull: ["Superset with the main lift", "4x8-10 lat pulldown or assisted pull-up", "3x10-12 DB shoulder press"],
    upperPush: ["Superset with the main lift", "4x8-10 DB bench or floor press", "3x10-12 chest-supported row"],
    overhead: ["Superset with the main lift", "3x10-12 single-arm DB row/side", "2x12-15 rear delt fly"],
    gluteA: ["2 focused rounds, rest 60s between rounds", "12/12 B-stance hip thrust", "15 cable or banded kickbacks/side"],
    gluteB: ["2 focused rounds, rest 60s between rounds", "10/10 Bulgarian split squat", "15 seated hip abduction"],
    gluteC: ["2 focused rounds, rest 60s between rounds", "12/12 knee-high step-ups", "15 back extensions with squeeze"],
    coreA: ["3 sets: 20s hollow hold", "10 V-ups"],
    coreB: ["3 sets: 10 dead bugs/side", "12 Pallof presses/side"],
    arms: ["3x10 incline DB press", "3x10 chest-supported row"],
    pump: ["2 rounds, rest 60s between rounds", "15 goblet squats", "15 KB RDLs"],
    engine: ["18-22 min Zone 2 row, bike, ski, or run", "Nasal-breathing pace", "Keep it conversational"]
  },
  cardio: {
    daily: [
      {
        format: "Machine / run Zone 2 - 30-45 min",
        moves: ["Choose one machine or run outside/treadmill", "Stay conversational the whole time", "Optional: finish with 4 x 20s relaxed pickups"],
        options: ["Run", "StairMaster steady climb", "Bike Zone 2", "Row Zone 2", "Ski erg easy", "Elliptical", "Incline treadmill walk"],
        goal: "Build the aerobic base without taking away from the glute lifting."
      },
      {
        format: "DB EMOM 32-40",
        moves: ["Min 1: 10 DB thrusters", "Min 2: 12/10 cal bike or row", "Min 3: 12 DB RDLs", "Min 4: 10 burpees or up-downs", "Repeat 8-10 rounds"],
        options: ["Bike instead of row", "Step-ups instead of burpees", "Goblet squats instead of thrusters", "Bodyweight only if legs are smoked"],
        goal: "CrossFit-style sweat without Olympic lifts. Finish each minute with about 10-20 seconds to breathe."
      },
      {
        format: "StairMaster / incline day - 30-45 min",
        moves: ["Hold a level you can sustain without leaning on the rails", "Every 5:00 add 30s strong climb", "Keep the final 10 minutes smooth, not frantic"],
        options: ["StairMaster", "Incline treadmill walk", "Elliptical hill mode", "Bike climb ride", "Row steady"],
        goal: "Glute-friendly conditioning with steady breathing and no leg burnout."
      },
      {
        format: "Bodyweight HIIT AMRAP 30-36",
        moves: ["AMRAP 6:00: 12 air squats, 10 push-ups, 8 V-ups", "Rest 1:00", "AMRAP 6:00: 10 reverse lunges/side, 8 burpees, 20 mountain climbers", "Repeat both blocks 2-3 times"],
        options: ["Incline push-ups", "Step-back burpees", "Sit-ups instead of V-ups", "No-jump lunges"],
        goal: "Keep moving and get sweaty while sparing joints and keeping reps clean."
      },
      {
        format: "Weighted HIIT intervals 32-40",
        moves: ["4 rounds: 4:00 work / 1:00 rest", "12 KB swings", "10 DB bench press or push-ups", "12 box step-overs", "Max cal bike/row in remaining time"],
        options: ["KB deadlifts instead of swings", "Step-ups instead of box step-overs", "Ski erg instead of bike/row", "Light DBs for all movements"],
        goal: "Use weights, but keep it conditioning. You should be able to repeat your score each round."
      },
      {
        format: "CrossFit-style mixed modal 35-40",
        moves: ["5 rounds, smooth hard pace", "400 m run or 500 m row", "15 wall balls or goblet squats", "12 ring rows or lat pulldowns", "9 DB push press"],
        options: ["Bike 25/20 cal instead of run", "Ski 20/16 cal instead of run", "Step-ups instead of wall balls", "Push-ups instead of DB push press"],
        goal: "Full-body conditioning without snatches or clean and jerks. Scale so round 5 looks like round 2."
      },
      {
        format: "Recovery machine / walk - 30-45 min",
        moves: ["Pick the easiest machine or walk", "Nasal breathing as much as possible", "Add 10 min mobility after if hips or calves feel tight"],
        options: ["Easy bike", "Easy row", "Elliptical", "Incline walk", "Light swim", "Mobility walk", "Easy StairMaster"],
        goal: "Get the daily cardio done while still treating the day as recovery."
      }
    ]
  }
};
