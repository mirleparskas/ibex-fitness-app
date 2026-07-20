const PROGRAM = {
  name: "Ibex Athletic Training",
  blocks: [
    {
      name: "Foundation",
      weeks: "Weeks 1-2",
      summary: "Establish baseline performance with conservative loading, moderate volume, and about three repetitions in reserve."
    },
    {
      name: "Loading",
      weeks: "Weeks 3-4",
      summary: "Add repetitions or small load increases while maintaining movement quality at roughly two repetitions in reserve."
    },
    {
      name: "Progression",
      weeks: "Weeks 5-7",
      summary: "Complete the heaviest productive work of the block at one to two repetitions in reserve without fatiguing technical lifts."
    },
    {
      name: "Deload",
      weeks: "Week 8",
      summary: "Reduce sets by 40-50%, lower conditioning intensity and jump/sprint volume, and preserve technique before reviewing the block."
    }
  ],
  rules: {
    hardFirst: "On EMOM, chipper, and AMRAP days, lift moderate: good form only, no testing maxes, no grinding reps.",
    zone2First: "On Zone 2 days, lift more normally because the cardio should stay steady and controlled."
  },
  warmups: {
    lower: "5 min easy machine. Then 2 rounds: 10 glute bridges, 10 air squats, 8 Cossack squats/side, 10 banded lateral walks/side.",
    upper: "5 min easy machine. Then 2 rounds: 10 band pull-aparts, 8 push-ups or incline push-ups, 10 ring rows, 8 scap pull-ups.",
    olympic: "3 min easy row. Then 2 rounds: 5 inchworms, 10 PVC pass-throughs, 8 empty-bar RDLs, 5 tall cleans, 5 front squats.",
    recovery: "Start easy for 5 minutes, then stay conversational. Mobility is optional after cardio."
  },
  progressions: {
    frontSquat: ["4x4 @ RPE 6-7", "4x5 @ RPE 7", "4x6 @ RPE 7", "3x5 lighter change-up", "5x4 @ RPE 7-8", "4x5 heavier than Week 2", "4x6 heavier than Week 3", "Build to smooth 6RM, no grind"],
    pushPress: ["5x3 @ RPE 7", "5x4 @ RPE 7", "5x5 @ RPE 7-8", "4x4 lighter change-up", "6x3 @ RPE 8", "5x4 heavier than Week 2", "5x5 heavier than Week 3", "Build to smooth 5RM"],
    powerClean: ["Every 90s x 8: 2 reps light-moderate", "Every 90s x 9: 2 reps", "Every 2:00 x 8: 1 clean pull + 1 power clean", "EMOM 10: 1 tall clean + 1 hang power clean, light", "Every 90s x 10: 2 reps", "Every 2:00 x 9: 1 clean pull + 1 power clean", "Every 2:00 x 8: 2 power cleans, crisp", "Build to a clean technical triple"],
    pull: ["5x5 assisted pull-up or lat pulldown", "5x6 pull-up/assisted or 5x8 pulldown", "5x7 pull-up/assisted or 5x10 pulldown", "4x6 lighter change-up", "6x5 harder variation", "5x6-8", "5x8 or heavier pulldown", "Best clean set of 5-8"],
    rdl: ["4x6 @ RPE 6-7", "4x7 @ RPE 7", "4x8 @ RPE 7", "3x8 lighter change-up", "5x6 @ RPE 8", "4x7 heavier than Week 2", "4x8 heavier than Week 3", "Build to smooth 8RM"],
    inclinePress: ["4x6 @ RPE 7", "4x7 @ RPE 7", "4x8 @ RPE 7-8", "3x8 lighter change-up", "5x6 @ RPE 8", "4x7 heavier than Week 2", "4x8 heavier than Week 3", "Build to smooth 8RM"]
  },
  weeklyNotes: [
    "Start conservative. Learn the flow and leave 2-3 reps in reserve on lifts after hard conditioning.",
    "Add one rep per set or a small load jump where movement quality stayed clean.",
    "Make this the hardest week of Block 1, but keep hard-cardio-day lifts moderate.",
    "Change-up week: reduce load 10-15%, move well, and finish feeling recovered.",
    "Start Block 2 slightly heavier than Week 2, not heavier than your best-ever numbers.",
    "Build density: shorter rests on accessories or a small load increase on main lifts.",
    "Peak the block with strong repeatable efforts, still no ugly reps after cardio.",
    "Retest cleanly. Record scores, loads, and what felt best for the next cycle."
  ],
  cardio: {
    mondayEmom: {
      format: "20 min EMOM",
      target: "Cardio target: 20 minutes",
      moves: ["Min 1: 12/10 cal bike", "Min 2: 10 box jumps", "Min 3: 12 DB walking lunges", "Min 4: 10 toes-to-bar or hanging knee raises", "Repeat 5 rounds"],
      options: ["Step-ups instead of box jumps", "Hanging knee raises instead of T2B", "Row calories instead of bike", "Bodyweight lunges if legs are smoked"],
      goal: "Cardio first. Then lower strength stays moderate, about 7/10 effort."
    },
    tuesdayZone2: {
      format: "30-45 min Zone 2",
      target: "Cardio target: 30-45 minutes",
      moves: ["Pick one machine or steady option", "Keep breathing controlled", "You should be able to speak in short sentences"],
      options: ["Incline walk", "Bike", "StairMaster", "Easy row"],
      goal: "Steady cardio first. Upper push can still be lifted normally."
    },
    wednesdayChipper: {
      format: "25-30 min chipper, controlled pace",
      target: "Cardio target: 25-30 minutes",
      moves: ["50 wall balls", "40 sit-ups", "30 box step-overs", "25 cal row", "20 alternating DB clean and jerks", "15 burpees", "25 cal bike", "30 kettlebell swings", "40 walking lunges", "50 double unders or 100 single unders"],
      options: ["Goblet squats instead of wall balls", "DB step-overs instead of box step-overs", "KB swings instead of DB clean and jerks", "Single unders instead of double unders"],
      goal: "This is the cardio for the day. Olympic lifting after stays light and technical."
    },
    thursdayZone2: {
      format: "30-45 min Zone 2",
      target: "Cardio target: 30-45 minutes",
      moves: ["Pick one steady option", "Stay easy enough to recover", "No hard intervals today"],
      options: ["Easy run", "Incline walk", "Bike", "StairMaster", "Row"],
      goal: "Steady cardio first. Upper pull can be lifted heavier than hard-conditioning days."
    },
    fridayAmrap: {
      format: "22 min AMRAP",
      target: "Cardio target: 22 minutes",
      moves: ["10 cal bike", "10 kettlebell swings", "10 step-ups each leg", "10 ball slams", "10 V-ups or dead bugs"],
      options: ["KB deadlifts instead of swings", "Box step-overs instead of step-ups", "Dead bugs instead of V-ups", "Row instead of bike"],
      goal: "As many quality rounds as possible. Posterior lifting after stays controlled."
    },
    saturdayZone2: {
      format: "30-45 min machine cardio",
      target: "Cardio target: 30-45 minutes",
      moves: ["Pick one machine", "Mostly Zone 2", "No sprint finish needed"],
      options: ["StairMaster", "Incline treadmill", "Bike", "Rower", "Elliptical"],
      goal: "Cardio first, then full-body pump work."
    },
    sundayRecovery: {
      format: "30-45 min easy recovery cardio",
      target: "Cardio target: 30-45 minutes",
      moves: ["Keep it easy", "Stay conversational", "Stop before it feels like training"],
      options: ["Walk outside", "Incline treadmill walk", "Easy bike", "Easy swim", "Light elliptical"],
      goal: "Recovery only. No lift."
    }
  }
};
