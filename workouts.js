const PROGRAM = {
  name: "Glute Recomp Build",
  blocks: [
    {
      name: "Block 1 - Rebuild Base",
      weeks: "Weeks 1-3",
      summary: "Rebuild volume and skill with moderate loads, different daily movement patterns, and repeatable conditioning."
    },
    {
      name: "Week 4 - Pivot",
      weeks: "Week 4",
      summary: "Change the stimulus, lower joint stress, keep intensity controlled, and use benchmarks instead of grinding."
    },
    {
      name: "Block 2 - Build",
      weeks: "Weeks 5-7",
      summary: "Push heavier glute work, stronger Olympic-lift skill, harder gymnastics, and more deliberate bodybuilding volume."
    },
    {
      name: "Week 8 - Test + Reset",
      weeks: "Week 8",
      summary: "Retest clean reps, glute strength, conditioning, and weekly consistency without turning every lift into a max."
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
    clean: ["EMOM 8: 2 hang power cleans @ easy technique load", "E2MOM x 6: 2 power cleans @ RPE 7", "Every 2:00 x 7: 1 clean pull + 1 power clean @ RPE 7-8", "EMOM 10: 1 tall clean + 1 hang power clean, light and fast", "E2MOM x 7: 2 power cleans @ RPE 8", "Every 2:00 x 8: 1 clean pull + 1 power clean, heavier than Week 3", "E2MOM x 8: 1 power clean + 1 front squat @ RPE 8", "Build to a crisp heavy triple power clean"],
    pushPress: ["3x10 @ RPE 6-7", "4x8 @ RPE 7", "4x8 @ RPE 7-8", "3x10 easy deload", "4x6 @ RPE 8", "5x5 @ RPE 8", "4x6 + 1 backoff set", "Build to smooth 5RM"]
  },
  accessories: {
    upperPull: ["Superset with the main lift", "3x12-15 rear delt fly", "3x10-12 cable curl"],
    upperPush: ["Superset with the main lift", "4x8-10 DB bench or floor press", "3x10-12 chest-supported row"],
    overhead: ["Superset with the main lift", "3x12 straight-arm pulldown", "3x12 standing calf raises"],
    gluteA: ["2 focused rounds, rest 60s between rounds", "12/12 B-stance hip thrust", "15 cable or banded kickbacks/side"],
    gluteB: ["2 focused rounds, rest 60s between rounds", "10/10 Bulgarian split squat", "15 seated hip abduction"],
    gluteC: ["2 focused rounds, rest 60s between rounds", "12/12 knee-high step-ups", "15 back extensions with squeeze"],
    coreA: ["3 sets: 20s hollow hold", "10 V-ups"],
    coreB: ["3 sets: 10 dead bugs/side", "12 Pallof presses/side"],
    arms: ["3x10 incline DB press", "3x10 chest-supported row"],
    pump: ["2 rounds, rest 60s between rounds", "15 goblet squats", "15 KB RDLs"],
    engine: ["18-22 min Zone 2 row, bike, ski, or run", "Nasal-breathing pace", "Keep it conversational"]
  },
  weekVariations: {
    thrust: [
      { movement: "Barbell hip thrust", builder: ["3x10-12 Bulgarian split squat/side", "3x12 cable kickback/side", "2x20 seated hip abduction"] },
      { movement: "Smith machine hip thrust", builder: ["3x10 leg press, feet high", "3x10-12 walking lunge/side", "2x20 banded abduction"] },
      { movement: "Single-leg hip thrust", builder: ["4x8 deficit reverse lunge/side", "3x12 cable pull-through", "2x15 cable abduction/side"] },
      { movement: "KAS glute bridge", builder: ["2x15 goblet squat", "2x15 cable kickback/side", "2x25 frog pumps"] },
      { movement: "B-stance hip thrust", builder: ["3x8-10 Bulgarian split squat/side", "3x10-12 hack squat or leg press", "3x15 seated hip abduction"] },
      { movement: "Hip thrust machine", builder: ["4x10 reverse lunge/side", "3x12 cable kickback/side", "2x20 abduction dropset"] },
      { movement: "Smith machine hip thrust", builder: ["3x8 heavy step-up/side", "3x10 B-stance RDL/side", "2x20 banded abduction"] },
      { movement: "Barbell hip thrust", builder: ["2x12 easy split squat/side", "2x15 cable kickback/side", "1x50 banded abduction"] }
    ],
    squat: [
      { movement: "Back squat", builder: ["3x10 DB Romanian deadlift", "3x10 reverse lunge/side", "2x15 leg extension"] },
      { movement: "Front squat", builder: ["3x12 hip thrust machine", "3x10 step-up/side", "2x15 hamstring curl"] },
      { movement: "Leg press", builder: ["3x8-10 walking lunge/side", "3x12 DB RDL", "2x20 seated hip abduction"] },
      { movement: "Goblet squat", builder: ["2x15 single-leg glute bridge/side", "2x12 lateral lunge/side", "2x15 hamstring curl"] },
      { movement: "Back squat", builder: ["4x8 Romanian deadlift", "3x10 Bulgarian split squat/side", "2x15 leg extension"] },
      { movement: "Hack squat or belt squat", builder: ["3x10 hip thrust machine", "3x12 walking lunge/side", "2x20 cable abduction"] },
      { movement: "Front squat", builder: ["4x8 leg press", "3x10 reverse lunge/side", "3x12 hamstring curl"] },
      { movement: "Leg press", builder: ["2x12 DB RDL", "2x12 split squat/side", "1x30 seated hip abduction"] }
    ],
    hinge: [
      { movement: "Romanian deadlift", builder: ["3x12 cable pull-through", "3x12 back extension with glute squeeze", "2x15 hamstring curl"] },
      { movement: "Trap-bar deadlift", builder: ["3x10 single-leg RDL/side", "3x12 hip thrust machine", "2x15 back extension"] },
      { movement: "DB Romanian deadlift", builder: ["3x12 cable pull-through", "3x10 step-up/side", "2x20 hamstring curl"] },
      { movement: "Back extension", builder: ["2x15 light DB RDL", "2x12 cable pull-through", "2x10 bird-dog/side"] },
      { movement: "Romanian deadlift", builder: ["4x10 hip thrust machine", "3x12 back extension", "3x12 hamstring curl"] },
      { movement: "Trap-bar deadlift", builder: ["3x8 B-stance RDL/side", "3x12 cable pull-through", "2x20 hamstring curl"] },
      { movement: "Barbell Romanian deadlift", builder: ["3x10 single-leg hip thrust/side", "3x12 back extension", "2x15 cable kickback/side"] },
      { movement: "Romanian deadlift", builder: ["2x12 cable pull-through", "2x15 hamstring curl", "2x15 Pallof press/side"] }
    ],
    upper: [
      { movement: "DB bench press", builder: ["3x10 seated machine row", "3x12 machine shoulder press", "2x15 lateral raise"] },
      { movement: "Incline DB press", builder: ["4x8 lat pulldown", "3x10 landmine press/side", "2x15 rear delt fly"] },
      { movement: "Bench press", builder: ["3x10 seated cable row", "3x12 Arnold press", "2x12 triceps pushdown"] },
      { movement: "Push-up or DB floor press", builder: ["2x12 ring row", "2x12 light shoulder press", "2x15 band pull-apart"] },
      { movement: "Landmine press", builder: ["4x8 chest-supported row", "3x10 incline DB press", "3x12 lateral raise"] },
      { movement: "Incline DB press", builder: ["4x10 lat pulldown", "3x10 seated cable row", "2x15 rear delt fly"] },
      { movement: "Bench press", builder: ["4x8 single-arm DB row/side", "3x10 Arnold press", "2x12 triceps pushdown"] },
      { movement: "DB floor press", builder: ["2x12 cable row", "2x15 lateral raise", "2x12 hammer curl"] }
    ],
    pump: [
      ["3x12 cable row", "3x12 machine chest press", "3x15 lateral raises", "3x12 hammer curls"],
      ["3x10 seated row", "3x10 incline push-ups or machine chest press", "3x15 rear delt fly", "3x12 rope triceps pushdown"],
      ["3x12 lat pulldown", "3x12 Arnold press", "3x15 cable curls", "3x12 face pulls"],
      ["2x15 ring rows", "2x15 cable fly", "2x20 band pull-aparts", "2x15 light curls"],
      ["4x10 cable row", "3x12 cable fly or pec deck", "3x15 lateral raise", "3x12 triceps pushdown"],
      ["3x12 chest-supported row", "3x10 machine chest press", "3x15 rear delt fly", "3x12 hammer curls"],
      ["4x8 lat pulldown", "3x12 push-ups", "3x12 Arnold press", "2x15 cable curls"],
      ["2x12 seated row", "2x12 DB bench press", "2x15 lateral raise", "2x12 rope pressdown"]
    ],
    trunk: [
      ["4 sets: 12 weighted sit-ups", "3x30-45s farmer carry"],
      ["4 sets: 8-12 V-ups", "3x12 Pallof press/side"],
      ["EMOM 8: 10 hollow rocks", "3x30s side plank/side"],
      ["3 rounds: 10 dead bugs/side + 30s hollow hold", "2 easy farmer carries"],
      ["5 sets: 12 GHD sit-ups or abmat sit-ups", "3x40 m suitcase carry/side"],
      ["4 sets: 10 hanging knee raises", "3x12 cable chops/side"],
      ["EMOM 10: 12 V-ups", "3x30-45s farmer carry"],
      ["Retest: 2:00 max clean sit-ups", "2x12 dead bugs/side"]
    ]
  },
  cardio: {
    daily: [
      {
        format: "Day 1 machine / run Zone 2 - 30-45 min",
        moves: ["Choose one machine or run outside/treadmill", "Stay conversational the whole time", "Optional: finish with 4 x 20s relaxed pickups"],
        options: ["Run", "StairMaster steady climb", "Bike Zone 2", "Row Zone 2", "Ski erg easy", "Elliptical", "Incline treadmill walk"],
        goal: "Build the aerobic base without taking away from the glute lifting."
      },
      {
        format: "Day 2 clean + gymnastics conditioning - 30-40 min",
        moves: ["Every 5:00 x 6-8 rounds", "300 m row or 15/12 cal bike", "8 front rack reverse lunges", "10 burpees or up-downs", "Rest the remaining time"],
        options: ["Goblet reverse lunges", "Front squats instead of lunges", "Box jump-overs instead of burpees", "Ski erg instead of row", "Bike instead of row"],
        goal: "Keep the CrossFit feel after clean skill without repeating power cleans immediately."
      },
      {
        format: "Day 3 StairMaster / incline - 30-45 min",
        moves: ["Hold a level you can sustain without leaning on the rails", "Every 5:00 add 30s strong climb", "Keep the final 10 minutes smooth, not frantic"],
        options: ["StairMaster", "Incline treadmill walk", "Elliptical hill mode", "Bike climb ride", "Row steady"],
        goal: "Glute-friendly conditioning with steady breathing and no leg burnout."
      },
      {
        format: "Day 4 upper engine EMOM - 32-40 min",
        moves: ["EMOM 32-40", "Min 1: 12 wall balls or goblet squats", "Min 2: 12/10 cal bike or ski", "Min 3: 10 box step-overs", "Min 4: 10 ring rows"],
        options: ["Air squats instead of wall balls", "Step-ups instead of box step-overs", "Lat pulldown instead of ring rows", "Row instead of bike"],
        goal: "Condition hard after push press without repeating the same press pattern."
      },
      {
        format: "Day 5 machine intervals - 30-45 min",
        moves: ["5 min easy", "10 rounds: 1:00 hard / 1:00 easy", "10-20 min easy Zone 2 to finish"],
        options: ["Bike", "Row", "Ski erg", "Elliptical", "Incline treadmill", "StairMaster"],
        goal: "A machine day that builds the engine without adding more loaded leg volume."
      },
      {
        format: "Day 6 mixed modal - 35-40 min",
        moves: ["5 rounds, smooth hard pace", "400 m run or 500 m row", "15 KB swings", "20 sit-ups", "10 burpees or up-downs"],
        options: ["Bike 25/20 cal instead of run", "Ski 20/16 cal instead of run", "KB deadlift instead of swing", "Step-back burpees"],
        goal: "Full-body conditioning with CrossFit flavor while keeping the loading manageable."
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
