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
};

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
  return [
    day("lower-power", "D1", "Lower Power + Glute Strength", "Clean, jump, squat, and heavy hip extension without hard conditioning.", 70, ["glute","olympic","jump","squat","unilateral","hamstrings","intentionalCore","core"], [
      txt("WU","General Warm-up","5-8 min easy machine, dynamic hips and ankles, glute activation.","warmup"),
      lift("1","Olympic Lift","Power clean",rx("6x2"),"power-clean",["olympic"]), lift("2","Jump","Box jump",rx("4x3"),"box-jump",["jump"]),
      lift("3","Main Lift","Front squat",rx("4x5-6"),"front-squat",["squat"]), lift("4","Glute Strength","Barbell hip thrust",rx("4x6-8"),"hip-thrust",["glute"]),
      list("5","Unilateral + Hamstrings",["3x8 Bulgarian split squat/side","3x10-12 hamstring curl","2x15 cable hip abduction"],"lower-accessories",["unilateral","hamstrings","glute"]),
      list("6","Intentional Core",["3x8 dead bug/side","3x30s side plank/side"],"core",["intentionalCore","core"]), txt("R","Mobility","5 min hips, calves, and T-spine.","mobility")
    ],"g"),
    day("upper-class", "D2", "Short Upper Strength + Class", "Athletic upper-body work followed by a group class when scheduled.", 45, ["upper","back","shoulders","arms","explosiveUpper","anaerobic"], [
      txt("WU","Shoulder Preparation","Band pull-aparts, scap push-ups, face pulls, and light pressing.","warmup"),
      lift("1","Explosive Upper","Medicine-ball chest throw",rx("4x4"),"medball",["explosiveUpper"]),
      list("2","Upper Strength",["3x6-10 DB bench press","3x6-10 pull-up or lat pulldown","3x8-12 chest-supported row","3x8-10 DB shoulder press"],"upper-main",["upper","back","shoulders"]),
      list("3","Delts + Arms",["3x12-20 lateral raise","2x10-15 biceps curl","2x10-15 triceps pressdown"],"arms",["shoulders","arms"]),
      txt("C","Group Class","Log the class intensity and demands. Count as anaerobic only when intensity is hard.","class",["anaerobic"])
    ]),
    day("sprint-glute", "D3", "Glute + Sprint Speed", "High-quality acceleration before posterior-chain and unilateral work.", 70, ["glute","sprint","jump","anaerobic","hinge","unilateral","hamstrings","intentionalCore","core"], [
      txt("WU","Sprint Preparation","8-12 min: ankles, A-march, A-skip, dribbles, buildups.","sprint-warmup"),
      lift("1","Elastic Primer","Pogo jumps or bounds",rx("3x10 contacts"),"pogo",["jump"]), lift("2","Speed","Acceleration sprint",rx("6x15-25 m, full recovery"),"sprint",["sprint","anaerobic"]),
      lift("3","Main Hinge","Romanian deadlift",rx("4x6-8"),"rdl",["hinge","hamstrings","glute"]),
      list("4","Single-Leg Strength",["3x8 step-up/side","3x10 walking or reverse lunge/side"],"unilateral",["unilateral","glute"]),
      list("5","Glutes + Calves",["3x12-15 cable kickback/side","3x15-25 hip abduction","3x10-15 calf raise"],"glute-accessories",["glute"]),
      list("6","Anti-Rotation Core",["3x10 Pallof press/side","2x30-45s suitcase hold/side"],"core",["intentionalCore","core"])
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
      list("5","Dynamic Core",["3x10 hanging knee raise","3x8 bird-dog row/side"],"core",["core"]), txt("C","Group Class","Log actual class demands; hard classes count toward anaerobic load.","class",["anaerobic"])
    ],"g"),
    day("full-athletic", "D6", "Full-Body Athletic", "Flexible athletic session; condition only when the hard-day budget allows.", 65, ["jump","olympic","squat","hinge","unilateral","upper","back","carry","core"], [
      lift("1","Jump","Broad jump",rx("4x3"),"broad-jump",["jump"]), lift("2","Olympic Derivative","Clean pull",rx("4x3"),"clean-pull",["olympic","hinge"]),
      list("3","Full-Body Strength",["3x6-8 goblet squat or front squat","3x6-10 upper-body compound","3x6-10 row or pull-up","3x8 single-leg RDL/side"],"full-strength",["squat","upper","back","hinge","unilateral"]),
      lift("4","Loaded Locomotion","Suitcase carry",rx("3x30 m/side"),"carry",["carry","core"]),
      list("5","Rotational Core",["3x8 cable chop/side","3x6 medicine-ball rotational throw/side"],"rotational-core",["core","explosiveUpper"]),
      txt("6","Optional Conditioning","8-12 min mixed-modal only if fewer than 3 hard anaerobic days are planned or completed.","optional-conditioning")
    ]),
    day("recovery", "D7", "Rest or Recovery", "Complete rest is the default. Walking, mobility, or very easy cardio are optional.", 0, ["rest"], [
      txt("R","Recovery Options","Complete rest, an easy walk, 10-20 min mobility, or easy recovery cardio. Stop before it feels like training.","recovery",["rest"])
    ],"r")
  ];
}
