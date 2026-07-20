const WEEKLY_TARGETS = {
  glute: { label: "Glute sessions", min: 3, max: 3 },
  upper: { label: "Upper-body sessions", min: 2, max: 3 },
  olympic: { label: "Olympic-lifting exposures", min: 2, max: 3 },
  jump: { label: "Jump exposures", min: 2, max: 4 },
  sprint: { label: "Sprint exposures", min: 1, max: 1 },
  core: { label: "Core exposures", min: 3, max: 5 },
  intentionalCore: { label: "Intentional core sessions", min: 2, max: 4 },
  anaerobic: { label: "Hard anaerobic days", min: 2, max: 3 },
  zone2: { label: "Zone 2 sessions", min: 1, max: 3 },
  carry: { label: "Carry exposures", min: 2, max: 3 },
  rest: { label: "Rest days", min: 1, max: 2 },
  squat: { label: "Squat-pattern exposures", min: 2, max: 4 },
  hinge: { label: "Hinge-pattern exposures", min: 2, max: 4 },
  unilateral: { label: "Unilateral lower body", min: 2, max: 5 },
  back: { label: "Back sessions", min: 2, max: 4 },
  shoulders: { label: "Shoulder sessions", min: 2, max: 4 },
  hamstrings: { label: "Hamstring sessions", min: 2, max: 4 },
  arms: { label: "Arm sessions", min: 1, max: 3 },
  explosiveUpper: { label: "Explosive upper-body", min: 1, max: 3 }
  ,physio: { label: "Physio sessions", min: 2, max: 3 }
};

const ATHLETIC_TEMPLATE_VERSION = 4;
const PROHIBITED_MOVEMENT_PATTERNS = [
  /\bsnatches?\b/i,
  /\b(?:power|squat|hang|muscle|tall) snatch\b/i,
  /\bdumbbell snatch\b/i,
  /\bdb snatch\b/i,
  /\bhandstand push-?ups?\b/i,
  /\bhspu\b/i
];

const DAY6_WODS = [
  { format: "15 min EMOM", moves: ["Min 1: 10/8 cal row", "Min 2: 8 alternating DB hang power cleans", "Min 3: 8 box step-overs"], cap: "15 minutes", tiers: { L1: "8/6 cal, 6 light DB cleans, 6 low step-overs", L2: "As written; finish each minute with 15-25 sec rest", L3: "12/10 cal, 10 DB cleans, 10 step-overs" }, goal: "Repeatable rounds with clean positions; no missed reps." },
  { format: "12 min AMRAP", moves: ["8 DB thrusters", "8 pull-ups or lat pulldowns", "10 cal bike"], cap: "12 minutes", tiers: { L1: "6 light thrusters, 8 pulldowns, 8 cal", L2: "As written", L3: "10 thrusters, 10 pull-ups, 12 cal" }, goal: "Smooth transitions and sustainable sets." },
  { format: "5 rounds for quality", moves: ["250 m row", "10 kettlebell swings", "8 burpee box step-overs"], cap: "18-minute cap", tiers: { L1: "200 m, 8 light swings, 6 burpee step-overs", L2: "As written", L3: "300 m, 12 swings, 10 burpee step-overs" }, goal: "Protect calves and hamstrings: step over the box and keep the hinge crisp." },
  { format: "18 min EMOM", moves: ["Min 1: 10/8 cal SkiErg", "Min 2: 8-12 push-ups", "Min 3: 30 m farmer carry"], cap: "18 minutes, controlled", tiers: { L1: "8/6 cal, incline push-ups, light carry", L2: "As written", L3: "12/10 cal, 15 push-ups, heavy carry" }, goal: "A controlled mixed-modal week, not a test." },
  { format: "4 rounds for time", moves: ["12 wall balls", "10 alternating DB clean and jerks", "12 toes-to-bar or supported knee raises"], cap: "20-minute cap", tiers: { L1: "10 goblet squats, 8 light DB clean and jerks, 10 knee raises", L2: "As written", L3: "15 wall balls, 12 DB clean and jerks, 15 toes-to-bar" }, goal: "Choose the core option that preserves pelvic control." },
  { format: "Every 4 min x 5", moves: ["12/10 cal bike", "10 front-rack reverse lunges", "8 pull-ups or lat pulldowns", "Rest in time remaining"], cap: "20 minutes", tiers: { L1: "10/8 cal, 8 light lunges, 8 pulldowns", L2: "As written", L3: "15/12 cal, 12 lunges, 10 pull-ups" }, goal: "Work quickly, then recover; reverse lunges reduce extra locomotion volume." },
  { format: "16 min AMRAP", moves: ["250 m row", "6 power cleans", "10 box jump-overs or step-overs"], cap: "16 minutes", tiers: { L1: "200 m, 6 light hang power cleans, 8 step-overs", L2: "As written; step over if lower legs are tired", L3: "300 m, 8 power cleans, 12 jump-overs" }, goal: "Use rowing by default; running is optional only when lower legs feel good." },
  { format: "12 min easy EMOM", moves: ["Min 1: 8/6 cal bike", "Min 2: 8 light DB deadlifts", "Min 3: 8 controlled sit-ups"], cap: "12 minutes, deload", tiers: { L1: "6/5 cal and 6 reps", L2: "As written at RPE 5-6", L3: "No Rx+ on deload week" }, goal: "Move well and finish fresher than you started." }
];

const ATHLETIC_EXERCISES = {
  "Power clean": { pattern: "Olympic pull", primary: ["glutes", "hamstrings", "upper back"], equipment: ["barbell"], categories: ["olympic"], quality: ["power"], fatigue: "medium", difficulty: "high", impact: "medium", stance: "bilateral" },
  "Hang power clean": { pattern: "Olympic pull", primary: ["glutes", "hamstrings", "upper back"], equipment: ["barbell"], categories: ["olympic"], quality: ["power"], fatigue: "medium", difficulty: "high", impact: "medium", stance: "bilateral" },
  "Box jump": { pattern: "jump", primary: ["glutes", "quads", "calves"], equipment: ["box"], categories: ["plyometric"], quality: ["vertical power"], fatigue: "low", difficulty: "medium", impact: "medium", stance: "bilateral" },
  "Countermovement jump": { pattern: "jump", primary: ["glutes", "quads", "calves"], equipment: ["none"], categories: ["plyometric"], quality: ["vertical power"], fatigue: "low", difficulty: "low", impact: "medium", stance: "bilateral" },
  "Acceleration sprint": { pattern: "sprint", primary: ["glutes", "hamstrings", "calves"], equipment: ["track"], categories: ["sprint", "conditioning"], quality: ["speed"], fatigue: "high", difficulty: "high", impact: "high", stance: "unilateral" },
  "Front squat": { pattern: "squat", primary: ["quads", "glutes"], equipment: ["barbell"], categories: ["strength"], quality: ["strength"], fatigue: "high", difficulty: "medium", impact: "medium", stance: "bilateral" },
  "Barbell hip thrust": { pattern: "horizontal hip extension", primary: ["glutes"], equipment: ["barbell", "bench"], categories: ["strength", "hypertrophy"], quality: ["strength"], fatigue: "medium", difficulty: "low", impact: "low", stance: "bilateral" },
  "Romanian deadlift": { pattern: "hinge", primary: ["hamstrings", "glutes"], equipment: ["barbell"], categories: ["strength", "hypertrophy"], quality: ["strength"], fatigue: "high", difficulty: "medium", impact: "low", stance: "bilateral" },
  "Bulgarian split squat": { pattern: "squat", primary: ["glutes", "quads"], equipment: ["dumbbells", "bench"], categories: ["strength", "hypertrophy"], quality: ["single-leg stability"], fatigue: "medium", difficulty: "medium", impact: "low", stance: "unilateral" },
  "Chest-supported row": { pattern: "horizontal pull", primary: ["back"], equipment: ["dumbbells", "bench"], categories: ["strength", "hypertrophy"], quality: ["strength"], fatigue: "low", difficulty: "low", impact: "low", stance: "bilateral" },
  "Farmer carry": { pattern: "loaded locomotion", primary: ["core", "grip", "upper back"], equipment: ["dumbbells"], categories: ["carry", "core"], quality: ["work capacity"], fatigue: "medium", difficulty: "low", impact: "low", stance: "locomotion" },
  "Suitcase carry": { pattern: "loaded locomotion", primary: ["core", "grip"], equipment: ["dumbbell"], categories: ["carry", "core"], quality: ["anti-lateral flexion"], fatigue: "low", difficulty: "low", impact: "low", stance: "unilateral" }
  ,"Seated leg curl": { pattern: "knee flexion", primary: ["hamstrings"], equipment: ["seated leg curl machine"], categories: ["physio", "hypertrophy"], quality: ["controlled strength"], fatigue: "low", difficulty: "low", impact: "low", stance: "bilateral", defaultSets: 3, defaultReps: "8-15", frequency: "2x/week" }
  ,"Standing leg curl": { pattern: "knee flexion", primary: ["hamstrings"], equipment: ["cable or standing leg curl machine"], categories: ["physio"], quality: ["single-leg control"], fatigue: "low", difficulty: "low", impact: "low", stance: "unilateral" }
  ,"Standing eccentric calf raise": { pattern: "plantar flexion", primary: ["calves"], equipment: ["standing calf raise machine"], categories: ["physio"], quality: ["eccentric control"], fatigue: "low", difficulty: "medium", impact: "low", stance: "unilateral eccentric" }
  ,"Single calf raise on machine": { pattern: "plantar flexion", primary: ["calves"], equipment: ["calf raise machine"], categories: ["physio"], quality: ["single-leg strength"], fatigue: "low", difficulty: "low", impact: "low", stance: "unilateral" }
  ,"Isometric 45-degree weighted back extension": { pattern: "hip extension isometric", primary: ["glutes", "hamstrings", "spinal erectors"], equipment: ["45-degree bench", "weight"], categories: ["physio", "core"], quality: ["isometric endurance"], fatigue: "medium", difficulty: "medium", impact: "low", stance: "bilateral" }
  ,"45-degree back extension": { pattern: "hinge", primary: ["glutes", "hamstrings", "spinal erectors"], equipment: ["45-degree bench"], categories: ["physio", "hypertrophy"], quality: ["hip control"], fatigue: "low", difficulty: "low", impact: "low", stance: "bilateral", defaultSets: 3, defaultReps: "10", frequency: "2x/week" }
  ,"Reverse curl with pelvic tilt": { pattern: "spinal flexion and pelvic control", primary: ["lower abdominals"], equipment: ["mat"], categories: ["physio", "core"], quality: ["pelvic control"], fatigue: "low", difficulty: "medium", impact: "low", stance: "bilateral" }
  ,"Supported hanging knee to chest": { pattern: "hip and trunk flexion", primary: ["abdominals"], equipment: ["captain's chair or back-supported station"], categories: ["physio", "core"], quality: ["trunk control"], fatigue: "low", difficulty: "medium", impact: "low", stance: "bilateral", video: "https://www.youtube.com/shorts/n0IyzC24Imk" }
  ,"Side-lying hip horizontal abduction": { pattern: "hip horizontal abduction", primary: ["glutes"], equipment: ["bench", "optional weight"], categories: ["physio", "hypertrophy"], quality: ["hip mobility", "glute control"], fatigue: "low", difficulty: "medium", impact: "low", stance: "unilateral" }
};

function athleticProgression(weekIndex, base) {
  const phases = [
    `${base} · 3 RIR · establish baseline`, `${base} · 3 RIR · repeat cleanly`,
    `${base} · 2 RIR · add reps or small load`, `${base} · 2 RIR · consolidate`,
    `${base} · 1-2 RIR · productive load`, `${base} · 1-2 RIR · progress`,
    `${base} · 1-2 RIR · strongest quality week`, `${base} · deload: reduce sets 40-50%`
  ];
  return phases[weekIndex];
}

function buildAthleticWeek(weekIndex) {
  const rx = (base) => athleticProgression(weekIndex, base);
  const day = (id, tag, title, focus, duration, targets, segments, type = "c") => ({ id, tag, title, focus, duration, targets, type, segments });
  const txt = (num, name, text, id, targets = []) => ({ kind: "text", num, name, text, id, targets });
  const lift = (num, name, movement, prescription, id, targets = [], goal = "Finish with the prescribed reps in reserve and clean technique.") => ({ kind: "lift", num, name, movement, prescription, id, targets, goal });
  const list = (num, name, items, id, targets = []) => ({ kind: "list", num, name, items, id, targets });
  const wod = DAY6_WODS[weekIndex];
  return [
    day("lower-power", "D1", "Lower Power + Glute Strength", "Clean, jump, squat, and heavy hip extension without hard conditioning.", 70, ["glute","olympic","jump","squat","unilateral","hamstrings","intentionalCore","core"], [
      txt("WU","General Warm-up","5-8 min easy machine, dynamic hips and ankles, glute activation.","warmup"),
      txt("E","Controlled Power EMOM",weekIndex === 7 ? "8-minute alternating EMOM. Odd minutes: power cleans. Even minutes: box jumps. Stay at RPE 6." : "12-minute alternating EMOM. Odd minutes: power cleans. Even minutes: box jumps. Stay at RPE 6-7; this is technical work, not a hard anaerobic exposure.","power-emom"),
      lift("1","Odd Minutes — Power Clean","Power clean",weekIndex === 7 ? "Every 2 min x 4: 2 light reps" : "EMOM 12 odd minutes: 2 technical reps","power-clean",["olympic"]), lift("2","Even Minutes — Box Jump","Box jump",weekIndex === 7 ? "Every 2 min x 4: 2 quality jumps" : "EMOM 12 even minutes: 3 quality jumps","box-jump",["jump"]),
      lift("3","Main Lift","Front squat",rx("4x5-6"),"front-squat",["squat"]), lift("4","Glute Strength","Barbell hip thrust",rx("4x6-8"),"hip-thrust",["glute"]),
      list("5","Unilateral + Hamstrings",["3x8 Bulgarian split squat/side","3x10-12 hamstring curl","2x15 cable hip abduction"],"lower-accessories",["unilateral","hamstrings","glute"]),
      list("6","Intentional Core",["3x8 dead bug/side","3x30s side plank/side"],"core",["intentionalCore","core"]), txt("R","Mobility","5 min hips, calves, and T-spine.","mobility")
      ,list("P","Physio A",["3x8-15 seated leg curl — neutral back; pull both heels down","2-3 sets standing eccentric calf raise — rise with both, lower slowly on one","2-3 sets reverse curl with anterior-to-posterior pelvic tilt, then leg raise"],"physio-a",["physio"])
    ],"g"),
    day("upper-class", "D2", "Short Upper Strength + Class", "Athletic upper-body work followed by a group class when scheduled.", 45, ["upper","back","shoulders","arms","explosiveUpper","anaerobic"], [
      txt("WU","Shoulder Preparation","Band pull-aparts, scap push-ups, face pulls, and light pressing.","warmup"),
      lift("1","Explosive Upper","Medicine-ball chest throw",rx("4x4"),"medball",["explosiveUpper"]),
      list("2","Upper Strength",["3x6-10 DB bench press","3x6-10 pull-up or lat pulldown","3x8-12 chest-supported row","3x8-10 DB shoulder press"],"upper-main",["upper","back","shoulders"]),
      list("3","Delts + Arms",["3x12-20 lateral raise","2x10-15 biceps curl","2x10-15 triceps pressdown"],"arms",["shoulders","arms"]),
      { kind:"class", num:"C", name:"Group Class", id:"class", targets:[], text:"Log the class when attended. It counts as hard only when intensity and anaerobic demand are high." }
    ]),
    day("sprint-glute", "D3", "Glute + Sprint Speed", "High-quality acceleration before posterior-chain and unilateral work.", 70, ["glute","sprint","jump","anaerobic","hinge","unilateral","hamstrings","intentionalCore","core"], [
      txt("WU","Sprint Preparation","8-12 min: ankles, A-march, A-skip, dribbles, buildups.","sprint-warmup"),
      lift("1","Elastic Primer","Pogo jumps or bounds",rx("3x10 contacts"),"pogo",["jump"]), lift("2","Speed","Acceleration sprint",rx("6x15-25 m, full recovery"),"sprint",["sprint","anaerobic"]),
      lift("3","Main Hinge","Romanian deadlift",rx("4x6-8"),"rdl",["hinge","hamstrings","glute"]),
      list("4","Single-Leg Strength",["3x8 step-up/side","3x10 walking or reverse lunge/side"],"unilateral",["unilateral","glute"]),
      list("5","Glutes + Calves",["3x12-15 cable kickback/side","3x15-25 hip abduction","3x10-15 calf raise"],"glute-accessories",["glute"]),
      list("6","Anti-Rotation Core",["3x10 Pallof press/side","2x30-45s suitcase hold/side"],"core",["intentionalCore","core"])
      ,list("P","Physio B",["2-3 sets standing leg curl — stand tall and brace","2-3 sets single calf raise on machine — full controlled range","3x10 45-degree back extension — hinge from hips with neutral spine","2-3 sets to fatigue side-lying hip horizontal abduction/side — top hip flexed 90°, raise toward ceiling"],"physio-b",["physio"])
    ],"g"),
    day("upper-zone2", "D4", "Upper Hypertrophy + Zone 2", "Build an athletic upper body, carry strength, and cardiovascular base.", 70, ["upper","back","shoulders","arms","explosiveUpper","carry","zone2","core"], [
      txt("WU","Shoulder Preparation","T-spine, band work, scapular control, and ramp-up sets.","warmup"),
      lift("1","Explosive Upper","Push press",rx("5x3"),"push-press",["explosiveUpper","shoulders"]),
      list("2","Upper Hypertrophy",["3x8-12 incline DB press","3x8-12 lat pulldown","3x8-12 cable or DB row","3x12-20 rear-delt fly","3x12-20 lateral raise","2x10-15 biceps curl","2x10-15 triceps extension"],"upper",["upper","back","shoulders","arms"]),
      lift("3","Loaded Carry","Farmer carry",rx("4x30-40 m"),"carry",["carry","core"]),
      { kind:"cardio", num:"4", name:"Zone 2", id:"zone2", targets:["zone2"], cardio:{ format:"25-45 min Zone 2", target:"Conversational, controlled aerobic work", moves:["Incline walk, bike, row, easy run, or StairMaster"], options:[], goal:"Build cardiovascular health without adding another hard day." } }
    ]),
    day("short-glute-class", "D5", "Short Glute Strength + Class", "Second clean exposure, vertical power, efficient glute work, and optional hard class.", 45, ["glute","olympic","jump","squat","unilateral","hamstrings","core","anaerobic"], [
      lift("1","Olympic Lift","Hang power clean",rx("6x2"),"hang-clean",["olympic"]), lift("2","Vertical Jump","Countermovement jump",rx("4x3"),"vertical-jump",["jump"]),
      lift("3","Glute Strength","Barbell hip thrust",rx("3x8-10"),"hip-thrust",["glute"]),
      list("4","Lower Accessories",["3x8 split squat/side","3x10-15 hamstring curl","2x15-25 glute isolation"],"accessories",["squat","unilateral","hamstrings","glute"]),
      list("5","Dynamic Core",["3x10 hanging knee raise","3x8 bird-dog row/side"],"core",["core"]), { kind:"class", num:"C", name:"Group Class", id:"class", targets:[], text:"Log actual class demands; qualifying hard classes count toward anaerobic load." }
      ,list("P","Physio C",["3x8-15 seated leg curl — knees unsupported at seat edge; neutral back","2-3 sets isometric 45-degree weighted back extension — hold torso aligned with thighs","2-3 sets supported hanging knee to chest — use back support; video in exercise library","2-3 sets to fatigue side-lying hip horizontal abduction/side; add weight as needed"],"physio-c",["physio"])
    ],"g"),
    day("full-athletic", "D6", "Full-Body Athletic", "Flexible athletic session; condition only when the hard-day budget allows.", 65, ["jump","olympic","squat","hinge","unilateral","upper","back","carry","core"], [
      lift("1","Jump","Broad jump",rx("4x3"),"broad-jump",["jump"]), lift("2","Olympic Derivative","Clean pull",rx("4x3"),"clean-pull",["olympic","hinge"]),
      list("3","Full-Body Strength",["3x6-8 goblet squat or front squat","3x6-10 upper-body compound","3x6-10 row or pull-up","3x8 single-leg RDL/side"],"full-strength",["squat","upper","back","hinge","unilateral"]),
      lift("4","Loaded Locomotion","Suitcase carry",rx("3x30 m/side"),"carry",["carry","core"]),
      list("5","Rotational Core",["3x8 cable chop/side","3x6 medicine-ball rotational throw/side"],"rotational-core",["core","explosiveUpper"]),
      { kind:"metcon", num:"6", name:"CrossFit-Style WOD", id:"crossfit-wod", targets:["anaerobic"], intensityAware:true, metcon:wod }
    ]),
    day("recovery", "D7", "Rest or Recovery", "Complete rest is the default. Walking, mobility, or very easy cardio are optional.", 0, ["rest"], [
      txt("R","Recovery Options","Complete rest, an easy walk, 10-20 min mobility, or easy recovery cardio. Stop before it feels like training.","recovery",["rest"])
    ],"r")
  ];
}
