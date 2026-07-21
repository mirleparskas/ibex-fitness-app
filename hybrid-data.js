const HYBRID_START_DATE = "2026-07-21";
const HYBRID_TEMPLATE_VERSION = 3;

Object.assign(WEEKLY_TARGETS, {
  lower: { label: "Lower sessions", min: 2, max: 2 },
  upperSplit: { label: "Upper sessions", min: 2, max: 2 },
  fullBody: { label: "Full-body sessions", min: 2, max: 2 },
  metcon: { label: "Required finishers", min: 4, max: 4 },
  gymnastics: { label: "Strict gymnastics", min: 2, max: 3 },
  glute: { label: "Glute sessions", min: 2, max: 3 },
  anaerobic: { label: "Hard exposures", min: 2, max: 3 }
});

const HYBRID_FINISHERS = {
  lowerA: [
    ["10 min EMOM", ["Min 1: 10/8 cal bike", "Min 2: 8 goblet squats"], "RPE 6-7"],
    ["12 min AMRAP", ["10 cal row", "8 box step-overs", "10 sit-ups"], "Smooth and controlled"],
    ["Every 3 min x 4", ["12/10 cal bike", "10 wall balls", "Rest"], "Repeatable rounds"],
    ["10 min EMOM", ["8 kettlebell deadlifts", "8 low box step-overs"], "Recovery emphasis"],
    ["12 min AMRAP", ["10 cal row", "10 goblet squats", "30 m farmer carry"], "RPE 7 cap"],
    ["Every 4 min x 3", ["12/10 cal bike", "10 front-rack reverse lunges", "Rest"], "Quality work"],
    ["12 min EMOM", ["10 wall balls", "8 burpee step-overs"], "No sprinting"],
    ["8 min easy EMOM", ["8/6 cal bike", "6 air squats"], "Deload"]
  ],
  upperA: [
    ["10 min AMRAP", ["8 DB bench press", "10 ring rows", "8 cal bike"], "Hard, clean sets"],
    ["12 min AMRAP", ["8 push-ups", "8 pull-ups or pulldowns", "10 cal row"], "Sustainable intensity"],
    ["5 rounds for time", ["10 DB floor press", "10 chest-supported rows", "10 cal bike"], "14-minute cap"],
    ["10 min EMOM", ["8 incline push-ups", "10 ring rows"], "Controlled week"],
    ["12 min AMRAP", ["8 DB push press", "8 strict pull-ups or pulldowns", "10 cal SkiErg"], "Hard"],
    ["Every 3 min x 4", ["10 burpees", "10 DB rows", "Rest"], "Repeatable"],
    ["10 min AMRAP", ["6 DB thrusters", "8 pull-ups", "10 cal bike"], "Hard but unbroken"],
    ["8 min easy AMRAP", ["6 push-ups", "8 ring rows", "8 cal row"], "Deload"]
  ],
  lowerB: [
    ["10 min EMOM", ["8 kettlebell swings", "8 reverse lunges"], "RPE 6-7"],
    ["12 min AMRAP", ["10 cal bike", "8 DB RDLs", "8 step-ups"], "Controlled"],
    ["Every 3 min x 4", ["10 cal row", "10 light front squats", "Rest"], "No grinding"],
    ["10 min EMOM", ["8 glute bridges", "8 low step-ups"], "Recovery emphasis"],
    ["12 min AMRAP", ["10 cal bike", "10 kettlebell swings", "8 reverse lunges"], "RPE 7"],
    ["Every 4 min x 3", ["12 cal row", "10 light DB deadlifts", "Rest"], "Quality"],
    ["10 min AMRAP", ["8 power cleans", "10 box step-overs"], "Controlled cycling"],
    ["8 min easy EMOM", ["8 cal bike", "6 light hinges"], "Deload"]
  ],
  upperB: [
    ["10 min AMRAP", ["8 DB push press", "8 pull-ups or pulldowns", "10 cal row"], "Hard"],
    ["12 min AMRAP", ["10 push-ups", "10 ring rows", "12 cal bike"], "Hard"],
    ["5 rounds for time", ["8 strict presses", "10 pulldowns", "10 cal SkiErg"], "15-minute cap"],
    ["10 min EMOM", ["8 pike push-ups", "8 ring rows"], "Controlled week"],
    ["12 min AMRAP", ["8 push press", "8 strict pull-ups", "10 burpees"], "Hard"],
    ["Every 3 min x 4", ["10 cal SkiErg", "8 dips or close-grip push-ups", "Rest"], "Repeatable"],
    ["10 min AMRAP", ["8 DB thrusters", "8 pull-ups", "10 cal row"], "Hard"],
    ["8 min easy AMRAP", ["6 light presses", "8 ring rows", "8 cal bike"], "Deload"]
  ],
  full: [
    ["12 min easy AMRAP", ["8 cal row", "8 goblet squats", "8 push-ups", "30 m carry"], "Optional RPE 6-7"],
    ["10 min EMOM", ["Min 1: 8 DB deadlifts", "Min 2: 8 ring rows", "Min 3: 8 cal bike"], "Optional"],
    ["12 min AMRAP", ["10 step-ups", "8 DB bench press", "10 cal row"], "Smooth pace"],
    ["8 min easy EMOM", ["Carry", "Push-ups", "Bike", "Rest"], "Recovery emphasis"],
    ["12 min AMRAP", ["8 goblet squats", "8 DB rows", "10 cal bike"], "RPE 7 cap"],
    ["Every 3 min x 4", ["10 cal row", "8 DB push press", "30 m carry", "Rest"], "Repeatable"],
    ["10 min AMRAP", ["8 step-ups", "8 push-ups", "8 ring rows"], "Optional quality"],
    ["6 min easy movement", ["Bike", "Carry", "Mobility"], "Deload or skip"]
  ]
};

const LONG_CONDITIONING = [
  ["30 min aerobic EMOM", ["Min 1: 10/8 cal bike", "Min 2: 30 m farmer carry", "Min 3: 10 ring rows", "Min 4: 10 step-ups", "Min 5: easy recovery"], "Conversational effort"],
  ["35 min controlled AMRAP", ["500 m row", "20 m sled push", "12 push-ups", "16 step-ups", "40 m suitcase carry"], "RPE 6"],
  ["40 min machine rotation", ["10 min bike", "10 min row", "10 min incline walk", "10 min SkiErg"], "Zone 2"],
  ["25 min easy EMOM", ["Bike", "Carry", "Ring row", "Mobility", "Rest"], "Recovery week"],
  ["30 min aerobic AMRAP", ["12 cal row", "10 med-ball slams", "12 step-ups", "30 m farmer carry"], "No redlining"],
  ["Every 5 min x 7", ["12 cal bike", "200 m row", "8 push-ups", "Rest"], "Repeatable pace"],
  ["35 min long EMOM", ["SkiErg", "Sled push", "Ring rows", "Goblet carry", "Easy bike"], "RPE 6-7"],
  ["25 min Zone 2", ["Choose one easy machine", "Remain conversational"], "Deload"]
];

const HYBRID_ACCESSORIES = {
  lowerA: [
    ["3x8-12 Bulgarian split squat/side","3x12-20 cable hip abduction","3x8-12 Pallof press/side"],
    ["3x8-12 heel-elevated split squat/side","3x15-25 seated hip abduction","3x8-12 dead bug/side"],
    ["3x8-12 high step-up/side","3x12-20 cable kickback/side","3x30-45s side plank/side"],
    ["3x8-12 front-foot-elevated split squat/side","3x12-20 banded lateral walk/side","3x8 plank drag/side"],
    ["3x8-12 Bulgarian split squat/side","3x15-25 hip abduction machine","3x10 Pallof press/side"],
    ["3x10 walking lunge/side","3x12-20 standing cable abduction/side","3x10 dead bug/side"],
    ["3x8-12 deficit split squat/side","3x12-20 cable kickback/side","3x30-45s side plank/side"],
    ["2x8 easy split squat/side","2x15 light hip abduction","2x8 dead bug/side"]
  ],
  upperA: [
    ["3x8-12 incline DB press","3x12-20 rear-delt fly","3x12-20 lateral raise","3x10-15 DB curl + rope pressdown"],
    ["3x10-15 cable fly","3x12-20 face pull","3x12-20 cable lateral raise","3x10-15 incline curl + overhead triceps extension"],
    ["3x8-12 machine chest press","3x12-20 reverse pec deck","3x12-20 leaning lateral raise","3x10-15 hammer curl + close-grip push-up"],
    ["3x10-15 deficit push-up","3x12-20 band pull-apart","3x12-20 DB lateral raise","3x10-15 cable curl + single-arm pressdown"],
    ["3x8-12 incline DB press","3x12-20 rear-delt cable fly","3x12-20 machine lateral raise","3x10-15 preacher curl + rope pressdown"],
    ["3x10-15 cable fly","3x12-20 face pull","3x12-20 lateral raise mechanical drop set","3x10-15 Bayesian curl + cross-body extension"],
    ["3x8-12 machine chest press","3x12-20 reverse pec deck","3x12-20 cable lateral raise","3x10-15 hammer curl + overhead extension"],
    ["2x10 light incline DB press","2x15 rear delts","2x15 lateral raises","2x12 easy curls + pressdowns"]
  ],
  lowerB: [
    ["3x10-15 lying hamstring curl","3x12-20 cable kickback/side","3x8-12 anti-rotation press/side"],
    ["3x10-15 seated hamstring curl","3x12-20 glute-biased cable pull-through","3x30-45s suitcase hold/side"],
    ["3x8-12 Nordic curl progression","3x15-25 hip abduction","3x8-12 bird-dog row/side"],
    ["3x10-15 slider leg curl","3x12-20 frog pump","3x8-12 cable chop/side"],
    ["3x10-15 lying hamstring curl","3x12-20 cable kickback/side","3x10 anti-rotation press/side"],
    ["3x10-15 seated hamstring curl","3x12-20 glute-biased back extension","3x30-45s suitcase hold/side"],
    ["3x8-12 assisted Nordic curl","3x15-25 hip abduction","3x10 bird-dog/side"],
    ["2x10 easy hamstring curl","2x15 light kickback","2x8 cable chop/side"]
  ],
  upperB: [
    ["3x8-12 seated DB shoulder press","3x10-15 cable row","3x12-20 lateral raise","3x10-15 curl + overhead triceps extension"],
    ["3x8-12 landmine press/side","3x10-15 single-arm DB row/side","3x12-20 rear-delt row","3x10-15 hammer curl + pressdown"],
    ["3x8-12 Arnold press","3x10-15 machine row","3x12-20 cable lateral raise","3x10-15 preacher curl + skull crusher"],
    ["3x10-15 half-kneeling DB press/side","3x10-15 seated cable row","3x12-20 face pull","3x10-15 cable curl + close-grip push-up"],
    ["3x8-12 seated DB shoulder press","3x10-15 chest-supported DB row","3x12-20 lateral raise","3x10-15 incline curl + overhead extension"],
    ["3x8-12 landmine press/side","3x10-15 Meadows row/side","3x12-20 reverse fly","3x10-15 hammer curl + rope pressdown"],
    ["3x8-12 Arnold press","3x10-15 machine high row","3x12-20 cable lateral raise","3x10-15 preacher curl + cross-body extension"],
    ["2x10 light DB press","2x12 easy row","2x15 lateral raises","2x12 curls + pressdowns"]
  ],
  full: [
    ["3x10-15 glute bridge","2-3x12-20 lateral + rear delts","2-3x10-15 biceps + triceps"],
    ["3x12-20 cable pull-through","2-3x12-20 cable lateral + face pull","2-3x10-15 hammer curl + rope pressdown"],
    ["3x10-15 KAS glute bridge","2-3x12-20 reverse pec deck + lateral raise","2-3x10-15 incline curl + overhead extension"],
    ["3x15-25 frog pump","2-3x12-20 band pull-apart + leaning lateral raise","2-3x10-15 cable curl + close-grip push-up"],
    ["3x10-15 hip thrust machine","2-3x12-20 rear-delt cable fly + lateral raise","2-3x10-15 preacher curl + pressdown"],
    ["3x12-20 glute-biased back extension","2-3x12-20 face pull + machine lateral raise","2-3x10-15 hammer curl + overhead extension"],
    ["3x10-15 KAS glute bridge","2-3x12-20 reverse pec deck + cable lateral raise","2-3x10-15 Bayesian curl + rope pressdown"],
    ["2x12 light glute bridge","2x15 rear + lateral delts","2x12 easy curls + pressdowns"]
  ],
  carryCore: [
    ["3x30 m farmer carry","3x8-12 cable chop/side"], ["3x30 m suitcase carry/side","3x8-12 dead bug/side"],
    ["3x30 m front-rack carry","3x30-45s side plank/side"], ["3x30 m sled drag","3x8-12 Pallof press/side"],
    ["3x40 m farmer carry","3x8-12 cable lift/side"], ["3x30 m suitcase carry/side","3x8-12 bird-dog row/side"],
    ["3x30 m mixed carry","3x8-12 rotational med-ball throw/side"], ["2x20 m light carry","2x8 dead bug/side"]
  ]
};

function hybridAccessories(group, week) {
  return HYBRID_ACCESSORIES[group][week];
}

function hybridRx(week, base) {
  return [
    `${base} · 3 RIR baseline`, `${base} · add 1 rep where clean`, `${base} · 2 RIR, add small load`, `${base} · consolidate quality`,
    `${base} · 1-2 RIR`, `${base} · progress load or reps`, `${base} · strongest productive week`, `${base} · deload, reduce sets 40-50%`
  ][week];
}

const CLEAN_PROGRESSION = {
  technique: [
    "Power clean - 5x3 @ 60% clean training max",
    "Power clean - 5x3 @ 65% clean training max",
    "Power clean - 6x2 @ 70% clean training max",
    "Power clean - 4x2 @ 60-65% (recovery week)",
    "Power clean - 5x2 @ 72-75% clean training max",
    "Power clean - 6x1 @ 77-80% clean training max",
    "Power clean - 5-6x1 @ 80-85%; stop before a miss",
    "Power clean - 4x2 @ 55-60% (deload)"
  ],
  integration: [
    "Clean + front squat + power jerk - 4 sets of 1+1+1 @ 60%",
    "Hang clean + power jerk - 5 sets of 2+1 @ 65%",
    "Clean + power jerk - 5 sets of 1+1 @ 70%",
    "Clean + power jerk - 4 sets of 1+1 @ 60-65% (recovery week)",
    "Clean + front squat + power jerk - 5 sets of 1+1+1 @ 72-75%",
    "Clean + power jerk - 6x1 @ 77-82%",
    "Clean + power jerk - 5-7 technical singles @ 80-88%; no misses",
    "Clean + power jerk - 4x1 @ 60-65% (deload)"
  ]
};

function cleanProgression(kind, week) {
  return CLEAN_PROGRESSION[kind][week] + " · Use a conservative training max; reduce 5-10% if positions or speed break down.";
}

function hybridMetcon(id, name, source, week, targets = ["metcon"], options = {}) {
  const [format, moves, goal] = source[week];
  return { kind:"metcon", num:"WOD", name, id, targets, intensityAware:true, defaultMode:options.mode || "controlled", optional:Boolean(options.optional), metcon:{ format, moves, cap:goal, goal, tiers:{ L1:"Reduce repetitions 20-30% and use low-impact options", L2:"Complete as written at the intended effort", L3:"Increase pace only while movement quality stays high" } } };
}

function hybridClass(id = "class") {
  return { kind:"class", num:"+", name:"Optional Group Class", id, targets:[], text:"Log a class and choose whether it replaces the planned finisher or is additional." };
}

function buildHybridWeek(week) {
  const day = (id, tag, title, focus, targets, segments, type="c") => ({ id, tag, title, focus, duration:85, targets, type, segments });
  const text = (num,name,value,id,targets=[]) => ({kind:"text",num,name,text:value,id,targets});
  const lift = (num,name,movement,rx,id,targets=[]) => ({kind:"lift",num,name,movement,prescription:hybridRx(week,rx),id,targets,goal:"Progress only when the top of the range is completed with the target RIR and clean technique."});
  const cleanLift = (num,name,movement,kind,id) => ({kind:"lift",num,name,movement,prescription:cleanProgression(kind,week),id,targets:["olympic"],goal:"Make every repetition technically sound. Percentages are based on a conservative clean training max, not a daily maximum."});
  const list = (num,name,items,id,targets=[]) => ({kind:"list",num,name,items,id,targets});
  return [
    day("hybrid-lower-a","D1","Lower A · Squat + Glutes","Knee-dominant strength, glute growth, clean technique and vertical power.",["lower","glute","olympic","jump","squat","physio","core","metcon"],[
      text("WU","Preparation","8-10 min hips, ankles, glutes and clean positions.","warmup"), cleanLift("1","Clean Progression A · Speed + Turnover","Power clean","technique","power-clean"), lift("2","Jump","Box jump","4x3 quality","box-jump",["jump"]), lift("3","Main Strength","Front squat","4x5-8","front-squat",["squat"]), lift("4","Glute Strength","Barbell hip thrust","4x6-10","hip-thrust",["glute"]), list("5","Weekly Bodybuilding Rotation",hybridAccessories("lowerA",week),"lower-a-accessories",["glute","unilateral","core"]), list("P","Physio A",["3x8-15 seated leg curl","2-3 sets standing eccentric calf raise","2-3 sets reverse curl with pelvic tilt"],"physio-a",["physio"]), hybridMetcon("lower-a-wod","Controlled Finisher",HYBRID_FINISHERS.lowerA,week,["metcon"],{mode:"controlled"}), hybridClass()
    ],"g"),
    day("hybrid-upper-a","D2","Upper A · Horizontal Push/Pull","Chest and back strength, strict pushing skill, shoulders and arms.",["upperSplit","back","shoulders","arms","gymnastics","metcon"],[
      text("WU","Preparation","8 min shoulders, T-spine and scapular control.","warmup"), lift("1","Explosive Primer","Medicine-ball chest throw","4x4","medball"), lift("2","Main Push","Dumbbell bench press","4x5-8","bench"), lift("3","Main Pull","Chest-supported row","4x6-10","chest-row",["back"]), lift("4","Strict Gymnastics","Strict push-up or dip progression","4 quality sets","strict-push",["gymnastics"]), list("5","Weekly Bodybuilding Rotation",hybridAccessories("upperA",week),"upper-a-accessories",["shoulders","arms"]), hybridMetcon("upper-a-wod","Hard Finisher",HYBRID_FINISHERS.upperA,week,["metcon","anaerobic"],{mode:"hard"}), hybridClass()
    ]),
    day("hybrid-conditioning","D3","Full Body · Conditioning","Choose true Zone 2 or a longer mixed-modal aerobic workout.",["fullBody","zone2","carry","core"],[
      text("WU","Movement Preparation","10 min easy machine, mobility and movement rehearsal.","warmup"), {kind:"choice",num:"A/B",name:"Choose Conditioning Format",id:"conditioning-choice",targets:[]}, {kind:"cardio",num:"A",name:"Choice A · True Zone 2",id:"zone2-choice",targets:["zone2"],cardio:{format:"45-60 min Zone 2",target:"Conversational effort, approximately 5-6/10",moves:["Bike, row, incline walk, SkiErg, StairMaster or an easy combination"],options:["Change machines every 10-15 minutes"],goal:"Build aerobic capacity without adding a hard day."}}, hybridMetcon("long-conditioning","Choice B · Long EMOM / AMRAP",LONG_CONDITIONING,week,["fullBody"],{mode:"aerobic"}), list("C","Carry + Core",["3x30-40 m farmer or suitcase carry","3x8-12 controlled trunk exercise"],"conditioning-accessories",["carry","core"]), list("P","Optional Physio C",["2-3 sets standing leg curl","2-3 sets supported hanging knee to chest","2-3 sets isometric 45-degree weighted back extension"],"physio-c",[]), hybridClass()
    ]),
    day("hybrid-lower-b","D4","Lower B · Hinge + Unilateral","Posterior-chain strength, clean and jerk skill, horizontal power and speed.",["lower","glute","olympic","jump","sprint","hinge","physio","core","metcon"],[
      text("WU","Sprint + Lift Preparation","10 min sprint drills, posterior-chain activation and clean positions.","warmup"), cleanLift("1","Clean Progression B · Clean + Jerk","Clean and power jerk","integration","hang-clean-jerk"), lift("2","Jump","Broad jump","4x3 quality","broad-jump",["jump"]), lift("3","Speed","Acceleration sprint","6x15-25 m, full recovery","sprint",["sprint","anaerobic"]), lift("4","Main Hinge","Romanian deadlift","4x6-10","rdl",["hinge","glute"]), lift("5","Main Unilateral","Reverse lunge","3x6-10/side","reverse-lunge",["unilateral","glute"]), list("6","Weekly Bodybuilding Rotation",hybridAccessories("lowerB",week),"lower-b-accessories",["glute","hamstrings","core"]), list("P","Physio B",["3x10 45-degree back extension","2-3 sets single calf raise on machine","2-3 sets to fatigue side-lying hip horizontal abduction"],"physio-b",["physio"]), hybridMetcon("lower-b-wod","Controlled Finisher",HYBRID_FINISHERS.lowerB,week,["metcon"],{mode:"controlled"}), hybridClass()
    ],"g"),
    day("hybrid-upper-b","D5","Upper B · Vertical Push/Pull","Shoulder strength, strict pulling, upper-back development and arms.",["upperSplit","back","shoulders","arms","gymnastics","metcon"],[
      text("WU","Preparation","8 min shoulders, lats, T-spine and scapular control.","warmup"), lift("1","Main Push/Jerk","Push press + power jerk","5x3-6","press",["shoulders"]), lift("2","Strict Gymnastics","Strict pull-up progression","4 quality sets","strict-pull",["gymnastics","back"]), lift("3","Vertical Pull","Lat pulldown","3x8-12","pulldown",["back"]), list("4","Weekly Bodybuilding Rotation",hybridAccessories("upperB",week),"upper-b-accessories",["back","shoulders","arms"]), hybridMetcon("upper-b-wod","Hard Finisher",HYBRID_FINISHERS.upperB,week,["metcon","anaerobic"],{mode:"hard"}), hybridClass()
    ]),
    day("hybrid-full-strength","D6","Full Body · Strength + Bodybuilding","Moderate full-body volume for glutes, shoulders and balanced muscular development.",["fullBody","glute","upper","squat","hinge","carry","core"],[
      text("WU","Preparation","8-10 min full-body mobility and ramp-up sets.","warmup"), lift("1","Squat Pattern","Goblet squat","3x8-12","pump-squat",["squat"]), lift("2","Upper Push","Incline dumbbell press","3x8-12","pump-press",["upper"]), lift("3","Upper Pull","Chest-supported dumbbell row","3x8-12","pump-pull",["upper","back"]), lift("4","Single-Leg Hinge","Kickstand Romanian deadlift","3x8-10/side","single-hinge",["hinge","unilateral"]), list("5","Weekly Bodybuilding Rotation",hybridAccessories("full",week),"full-pump",["glute","shoulders","arms"]), list("6","Weekly Carry + Core Rotation",hybridAccessories("carryCore",week),"full-carry-core",["carry","core"]), hybridMetcon("full-optional-wod","Optional Finisher",HYBRID_FINISHERS.full,week,[],{mode:"controlled",optional:true}), hybridClass()
    ]),
    day("hybrid-recovery","D7","Recovery","Walk, restore mobility and prepare for the next week.",["rest"],[text("R","Recovery Options","Complete rest, easy walking, mobility or very easy recovery cardio.","recovery",["rest"])],"r")
  ];
}
