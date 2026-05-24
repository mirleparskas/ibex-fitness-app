const PROGRAM = {
  name: "Glute + Engine Split",
  blocks: [
    {
      name: "Block 1 - Accumulation",
      weeks: "Weeks 1-4",
      summary: "Build volume, positions, and repeatable pacing. Hip-thrust, squat, and RDL bias with snatch and clean technique."
    },
    {
      name: "Block 2 - Intensification",
      weeks: "Weeks 5-8",
      summary: "Heavier percentages, conventional deadlift focus, sharper metcons, and retest work in week 8."
    }
  ],
  warmups: {
    glute: "5 min bike or row easy. Then 2 rounds: 10 banded hip thrusts, 10 Cossack squats, 10 bird-dogs/side, 10 glute bridges with a 2-second squeeze.",
    crossfit: "3 min row or bike build. Then 2 rounds: 5 inchworms, 10 PVC pass-throughs, 10 air squats, 10 ring rows, 5 wall-walk holds."
  },
  progressions: {
    hipThrust: ["4x8 @ 65%", "4x6 @ 70%", "5x5 @ 72% + AMRAP @ 60%", "Build to 3RM", "4x6 @ 72%", "5x5 @ 77%", "4x4 @ 82% + AMRAP @ 65%", "Build to 3RM"],
    backSquat: ["4x6 @ 67%", "5x5 @ 72%", "5x4 @ 76% + AMRAP @ 65%", "Build to 3RM", "4x5 @ 73%", "5x4 @ 78%", "4x3 @ 83% + AMRAP @ 67%", "Build to 3RM"],
    rdl: ["4x8 @ 60%", "4x8 @ 65%", "4x6 @ 70%", "3x6 @ 65%", "4x8 @ 67%", "4x6 @ 72%", "4x6 @ 75%", "3x6 @ 68%"],
    deadlift: ["4x5 @ 70%", "5x4 @ 75%", "5x3 @ 80% + AMRAP @ 65%", "Build to 3RM", "4x4 @ 76%", "5x3 @ 81%", "4x3 @ 85% + AMRAP @ 68%", "Build to 3RM"],
    snatch: ["5 sets: muscle snatch + power snatch + OHS @ 55%", "5 sets: power snatch + snatch @ 62%", "4 sets: snatch + OHS @ 68%", "3x2 power snatch @ 60%", "5 sets: power snatch + snatch @ 65%", "4x2 squat snatch @ 72%", "3x2 squat snatch @ 78%", "Build to heavy single @ 85%"],
    cleanJerk: ["5 sets: power clean + front squat + push jerk @ 58%", "5 sets: clean + jerk @ 64%", "4 sets: clean + split jerk @ 70%", "3x2 power clean @ 60%", "5 sets: clean + jerk @ 67%", "4x2 clean + jerk @ 74%", "3x2 clean + jerk @ 80%", "Build to heavy single @ 85%"],
    pushPress: ["4x6 @ 65%", "5x5 @ 70%", "4x4 @ 75%", "3x4 @ 65%", "4x5 @ 72%", "4x4 @ 77%", "4x3 @ 82%", "3x3 @ 68%"]
  },
  accessories: {
    upperPull: ["Superset with the main lift", "4x8 weighted pull-up or lat pulldown", "3x10 DB shoulder press"],
    upperPush: ["Superset with the main lift", "4x8 barbell bench or floor press", "3x10 chest-supported row"],
    overhead: ["Superset with the main lift", "4x8 strict press", "3x10 single-arm DB row/side"],
    gluteA: ["3 rounds, resting 45-60s between rounds", "12/12 B-stance hip thrust", "15 cable or banded kickbacks/side", "20 frog pumps", "45s plank + 20 hollow rocks"],
    gluteB: ["3 rounds, resting 45-60s between rounds", "10/10 Bulgarian split squat", "15 seated band abductions", "12 single-leg RDL/side", "16 weighted hip bridge marches"],
    gluteC: ["3 rounds, resting 45-60s between rounds", "20 walking lunges", "15 back extensions with squeeze", "12/12 knee-high step-ups", "20 Copenhagen-style adductions/side"],
    core: ["3 sets: 15s hollow hold", "10 V-ups", "10 sit-ups", "20 weighted Russian twists"],
    arms: ["3x12 incline DB press", "3x12 chest-supported row", "3x15 DB curl + 3x15 triceps pushdown"],
    pump: ["3 rounds, rest 60s between rounds", "20 hip thrusts", "20 goblet squats", "20 KB RDLs", "20 banded kickbacks", "20 V-ups"],
    engine: ["18-22 min Zone 2 row, bike, ski, or run", "Nasal-breathing pace", "Keep it conversational"]
  },
  metcons: {
    snatch: [
      { format: "AMRAP 18:00", moves: ["15 cal row", "12 KB swings", "9 box jump-overs", "6 alternating DB snatches"], tiers: { L1: "KB 26 lb / DB 25 lb / 20 in box", L2: "KB 35 lb / DB 35 lb / 24 in box", L3: "KB 53 lb / DB 50 lb / 24 in box" }, cap: "18 min / score rounds + reps", goal: "Stay steady. Aim for 5-6 rounds without standing around." },
      { format: "5 rounds for time", moves: ["12 DB thrusters", "10 toes-to-bar", "30 double-unders"], tiers: { L1: "DB 15s / knee raises / 60 singles", L2: "DB 25s / T2B / DUs", L3: "DB 35s / T2B / DUs" }, cap: "15 min cap", goal: "Choose a thruster load you can keep unbroken for the first two rounds." },
      { format: "For time chipper", moves: ["50 wall balls", "40 cal bike", "30 burpees over bar", "20 power cleans", "10 chest-to-bar or bar muscle-ups"], tiers: { L1: "WB 10 lb / clean 65 lb / jumping pull-ups", L2: "WB 14 lb / clean 95 lb / C2B", L3: "WB 20 lb / clean 115 lb / bar muscle-ups" }, cap: "22 min cap", goal: "Break the cleans early into quick sets before grip forces you to." },
      { format: "Deload AMRAP 14:00", moves: ["12 cal bike", "10 DB bench press", "8 goblet squats", "6 burpees"], tiers: { L1: "DB 15s / goblet 26 lb", L2: "DB 25s / goblet 35 lb", L3: "DB 35s / goblet 53 lb" }, cap: "14 min / smooth pace", goal: "Move well and leave the gym feeling better than when you walked in." },
      { format: "Intervals: 4 x 3:00", moves: ["12 DB bench press", "9 back squats", "6 alternating DB snatches", "Max cal row in remaining time", "Rest 1:30 between rounds"], tiers: { L1: "DB 20s / squat 55 lb", L2: "DB 35s / squat 75 lb", L3: "DB 50s / squat 95 lb" }, cap: "18 min total / score cals", goal: "Match your first row score every round." },
      { format: "For time", moves: ["50 double-unders", "40 wall balls", "30 box jump-overs", "20 ground-to-overhead", "10 burpee pull-ups"], tiers: { L1: "100 singles / WB 10 lb / 55 lb / burpee to target", L2: "DUs / WB 14 lb / 75 lb / burpee pull-ups", L3: "DUs / WB 20 lb / 95 lb / burpee C2B" }, cap: "16 min cap", goal: "Keep the first three movements smooth so the barbell does not stall." },
      { format: "AMRAP 20:00", moves: ["40/30 cal bike", "20 KB swings", "20 push-ups", "20 barbell curls", "20 bodyweight lunges"], tiers: { L1: "KB 26 lb / empty bar curls", L2: "KB 35 lb / 45 lb curls", L3: "KB 53 lb / 65 lb curls" }, cap: "20 min / score rounds + reps", goal: "The lunges are active recovery. Keep moving on them." },
      { format: "Retest: 10 rounds for time", moves: ["6 alternating DB snatches", "8 push-ups", "10 air squats"], tiers: { L1: "DB 25 lb / incline push-ups", L2: "DB 35 lb / push-ups", L3: "DB 50 lb / deficit push-ups" }, cap: "14 min cap", goal: "Sprint without redlining. Round 8 should look like round 2." }
    ],
    cleanJerk: [
      { format: "E2MOM x 12", moves: ["1 round mini-DT", "9 deadlifts", "6 hang power cleans", "3 push jerks", "Max cal bike in remaining time"], tiers: { L1: "75/55 lb", L2: "95/65 lb", L3: "115/85 lb" }, cap: "24 min / score total cals", goal: "Finish the barbell in about 1:00 so the bike effort is real." },
      { format: "21-15-9 for time", moves: ["Cal row", "Front squats", "Pull-ups"], tiers: { L1: "Front squat 55 lb / ring rows", L2: "Front squat 85 lb / pull-ups", L3: "Front squat 95 lb / chest-to-bar" }, cap: "12 min cap", goal: "Squats should be unbroken from the floor." },
      { format: "AMRAP 22:00", moves: ["400 m run", "21 KB swings", "15 wall balls", "9 burpees"], tiers: { L1: "KB 26 lb / WB 10 lb", L2: "KB 35 lb / WB 14 lb", L3: "KB 53 lb / WB 20 lb" }, cap: "22 min / score rounds + reps", goal: "Run at a pace that lets you start swings immediately." },
      { format: "EMOM 15", moves: ["Min 1: 12 wall balls", "Min 2: 12 box jumps", "Min 3: 8 deadlifts", "Min 4: max pull-ups or ring rows", "Min 5: rest"], tiers: { L1: "WB 10 lb / DL 95 lb / ring rows", L2: "WB 14 lb / DL 135 lb / pull-ups", L3: "WB 20 lb / DL 185 lb / chest-to-bar" }, cap: "15 min / score pulling reps", goal: "Earn 10-15 seconds of rest before the pulling minute." },
      { format: "For time", moves: ["Buy-in: 60 wall balls", "4 rounds", "42 double-unders", "7 deadlifts"], tiers: { L1: "WB 10 lb / 84 singles / DL 95 lb", L2: "WB 14 lb / DUs / DL 155 lb", L3: "WB 20 lb / DUs / DL 205 lb" }, cap: "13 min cap", goal: "Wall balls should be done in 2-3 sets, then attack the rounds." },
      { format: "Hero twist: E2MOM x 14", moves: ["1 round DT", "12 deadlifts", "9 hang power cleans", "6 push jerks", "Max cal bike in remaining time"], tiers: { L1: "75/55 lb", L2: "115/75 lb", L3: "155/105 lb" }, cap: "14 min / score cals", goal: "Your DT round should stay under 1:10." },
      { format: "AMRAP 16:00", moves: ["10 power cleans", "12 toes-to-bar", "14/11 cal row"], tiers: { L1: "Clean 65 lb / knee raises", L2: "Clean 95 lb / T2B", L3: "Clean 135 lb / T2B" }, cap: "16 min / score rounds + reps", goal: "Singles are fine on cleans if they are fast and consistent." },
      { format: "Retest: 5 rounds for time", moves: ["10 front squats", "12 pull-ups", "14/11 cal row"], tiers: { L1: "FS 55 lb / ring rows", L2: "FS 85 lb / pull-ups", L3: "FS 115 lb / chest-to-bar" }, cap: "15 min cap", goal: "Open with a pace you can repeat through round five." }
    ],
    long: [
      { format: "For time", moves: ["1000 m row", "50 DB push press", "40 alternating DB lunges", "30 sit-ups", "20 devil presses"], tiers: { L1: "DB 15s", L2: "DB 25s", L3: "DB 35s" }, cap: "20 min cap", goal: "Negative-split the row, then use small DB sets with short breaks." },
      { format: "EMOM 20", moves: ["Min 1: 12/9 cal ski or row", "Min 2: 10 power snatches", "Min 3: 12 box step-overs", "Min 4: 8 strict HSPU or 12 push-ups", "Min 5: rest"], tiers: { L1: "Snatch 55 lb / push-ups", L2: "Snatch 75 lb / 6 HSPU", L3: "Snatch 95 lb / 8 HSPU" }, cap: "20 min / stay ahead of clock", goal: "Each working minute should leave 10-15 seconds of rest." },
      { format: "3 rounds for time + bike", moves: ["400 m run", "21 KB swings", "12 pull-ups", "Then 30 cal bike"], tiers: { L1: "KB 26 lb / ring rows", L2: "KB 35 lb / pull-ups", L3: "KB 53 lb / chest-to-bar" }, cap: "15 min cap", goal: "Push the runs and hang on to unbroken swings." },
      { format: "Deload: 30:00 easy grind", moves: ["500 m row", "30 walking lunges", "20 sit-ups", "10 strict presses"], tiers: { L1: "DB 10s or empty bar", L2: "DB 20s or 45 lb", L3: "DB 30s or 65 lb" }, cap: "30 min / quality only", goal: "Breathe through the nose as much as possible." },
      { format: "For time intervals", moves: ["4 rounds: 5 devil presses + 30 double-unders", "Rest 1:00", "4 rounds: 10 DB thrusters + 30 double-unders"], tiers: { L1: "DB 15s / 60 singles", L2: "DB 25s / DUs", L3: "DB 35s / DUs" }, cap: "15 min cap", goal: "Use the rest minute to bring your breathing down, then go again." },
      { format: "AMRAP 24:00", moves: ["600 m run", "30 box step-overs", "20 DB hang clean and jerks", "10 strict pull-ups"], tiers: { L1: "DB 15s / ring rows", L2: "DB 25s / pull-ups", L3: "DB 35s / strict pull-ups" }, cap: "24 min / score rounds + reps", goal: "This is the long piece. Stay patient until minute 16." },
      { format: "For time pyramid", moves: ["10-20-30-20-10", "Cal bike", "DB walking lunges", "Sit-ups"], tiers: { L1: "DB 10s", L2: "DB 25s", L3: "DB 35s" }, cap: "18 min cap", goal: "Do not sprint the first 10s. The middle 30 is the workout." },
      { format: "Retest: AMRAP 20:00", moves: ["20/15 cal row", "20 KB swings", "20 push-ups", "20 goblet squats"], tiers: { L1: "KB 26 lb / incline push-ups", L2: "KB 35 lb / push-ups", L3: "KB 53 lb / hand-release push-ups" }, cap: "20 min / score rounds + reps", goal: "Hold a repeatable round split from the first full round." }
    ]
  }
};
