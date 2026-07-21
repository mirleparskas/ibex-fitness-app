const HYBRID_PLAN_KEY = "ibex-hybrid-v4";
const LEGACY_PLAN_KEY = "ibex-athletic-v3";
const PLAN_KEY = isHybridBlockActive() ? HYBRID_PLAN_KEY : LEGACY_PLAN_KEY;
const PREVIOUS_PLAN_KEYS = [LEGACY_PLAN_KEY, "cardio-first-glute-recomp-v2", "cardio-first-glute-recomp-v1"];
const state = {
  week: readInitialWeek(),
  expanded: false,
  search: "",
  openDays: new Set(),
  screen: localStorage.getItem("fit.ui.screen") || "today"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const progressSync = {
  endpoint: "/api/progress",
  supported: window.location.protocol !== "file:",
  applying: false,
  timer: null,
  status: "Progress sync: local only"
};

const storageSetItem = Storage.prototype.setItem;
const storageRemoveItem = Storage.prototype.removeItem;

function readInitialWeek() {
  const current = localStorage.getItem(`fit.week.${PLAN_KEY}`);
  if (current !== null) return Number(current) || 0;
  if (PLAN_KEY === HYBRID_PLAN_KEY) {
    const elapsed = Math.floor((startOfLocalDay(new Date()) - startOfLocalDay(new Date(`${HYBRID_START_DATE}T00:00:00`))) / 604800000);
    if (elapsed >= 0) return Math.min(7, elapsed);
  }
  const previous = PREVIOUS_PLAN_KEYS
    .map((key) => localStorage.getItem(`fit.week.${key}`))
    .find((value) => value !== null);
  return Number(previous) || 0;
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isHybridBlockActive() {
  if (localStorage.getItem("fit.hybrid.start-now") === "1") return true;
  return startOfLocalDay(new Date()) >= startOfLocalDay(new Date(`${typeof HYBRID_START_DATE === "string" ? HYBRID_START_DATE : "2026-07-27"}T00:00:00`));
}

Storage.prototype.setItem = function patchedSetItem(key, value) {
  storageSetItem.call(this, key, value);
  if (this === localStorage && String(key).startsWith("fit.")) scheduleProgressSync();
};

Storage.prototype.removeItem = function patchedRemoveItem(key) {
  storageRemoveItem.call(this, key);
  if (this === localStorage && String(key).startsWith("fit.")) scheduleProgressSync();
};

function setSyncStatus(message) {
  progressSync.status = message;
  const status = $("#syncStatus");
  if (status) status.textContent = message;
}

function scheduleProgressSync() {
  if (!progressSync.supported || progressSync.applying) return;
  window.clearTimeout(progressSync.timer);
  progressSync.timer = window.setTimeout(saveServerProgress, 400);
}

async function loadServerProgress() {
  if (!progressSync.supported) return;
  try {
    setSyncStatus("Progress sync: checking...");
    const response = await fetch(progressSync.endpoint, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const serverProgress = await response.json();
    const serverEntries = serverProgress.entries && typeof serverProgress.entries === "object" ? serverProgress.entries : {};
    const localEntries = getProgressBackup();
    const mergedEntries = { ...serverEntries, ...localEntries };

    progressSync.applying = true;
    Object.entries(mergedEntries).forEach(([key, value]) => {
      if (key.startsWith("fit.")) storageSetItem.call(localStorage, key, String(value));
    });
    progressSync.applying = false;

    state.week = Number(localStorage.getItem(`fit.week.${PLAN_KEY}`) || 0);
    await saveServerProgress();
    setSyncStatus(`Progress sync: saved ${Object.keys(mergedEntries).length} items`);
  } catch (error) {
    progressSync.applying = false;
    setSyncStatus("Progress sync: local only");
  }
}

async function saveServerProgress() {
  if (!progressSync.supported || progressSync.applying) return;
  try {
    const entries = getProgressBackup();
    const response = await fetch(progressSync.endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    setSyncStatus(`Progress sync: saved ${Object.keys(entries).length} items`);
  } catch (error) {
    setSyncStatus("Progress sync: local only");
  }
}

function getWeekBlock(weekIndex) {
  if (weekIndex < 2) return 0;
  if (weekIndex < 4) return 1;
  if (weekIndex < 7) return 2;
  return 3;
}

function pick(items, weekIndex) {
  return items[weekIndex] || items[weekIndex % items.length];
}

function buildWeek(weekIndex) {
  return getEditableWeek(weekIndex);
}

function buildDefaultWeek(weekIndex) {
  if (PLAN_KEY === HYBRID_PLAN_KEY && typeof buildHybridWeek === "function") return buildHybridWeek(weekIndex);
  if (typeof buildAthleticWeek === "function") return buildAthleticWeek(weekIndex);
  const p = PROGRAM.progressions;
  const c = PROGRAM.cardio;
  const weeklyNote = PROGRAM.weeklyNotes[weekIndex];

  return [
    {
      id: "mon-lower",
      type: "g",
      tag: "M",
      title: "EMOM + Lower Strength + Glutes",
      focus: "Cardio first, then moderate lower strength and glute volume",
      segments: [
        cardioSeg("1", "Cardio First", c.mondayEmom, "cardio"),
        textSeg("WU", "Warm-up Before Lifting", PROGRAM.warmups.lower, "warmup"),
        liftSeg("2", "Main Lift", "Front squat", p.frontSquat[weekIndex], null, "Keep this around 7/10 effort after the EMOM. No maxes or grinding.", "front-squat"),
        listSeg("3", "Then", ["3x8 Bulgarian split squat/leg"], "split-squat"),
        listSeg("4", "Glute Accessories", ["4x8-10 hip thrust", "3x10-12 hamstring curl", "3x12-15 cable kickbacks/leg", "2x20 abductors"], "glute-accessories"),
        textSeg("NOTE", "Week Note", weeklyNote, "week-note")
      ]
    },
    {
      id: "tue-push",
      type: "c",
      tag: "T",
      title: "Zone 2 + Upper Push",
      focus: "Steady cardio first, then heavier upper push, shoulders, and triceps",
      segments: [
        cardioSeg("1", "Cardio First", c.tuesdayZone2, "cardio"),
        textSeg("WU", "Warm-up Before Lifting", PROGRAM.warmups.upper, "warmup"),
        liftSeg("2", "Main Lift", "Push press", p.pushPress[weekIndex], null, "Zone 2 should not drain this lift. Keep reps crisp and powerful.", "push-press"),
        listSeg("3", "Then", ["3x8-10 DB bench press"], "db-bench"),
        listSeg("4", "Shoulders / Chest / Triceps", ["3x8-10 seated DB shoulder press", "4x12-20 lateral raises", "3x10-15 cable fly or push-ups", "3x12-15 triceps rope pressdown", "2x12-15 overhead triceps extension"], "push-accessories"),
        textSeg("NOTE", "Week Note", weeklyNote, "week-note")
      ]
    },
    {
      id: "wed-recovery",
      type: "r",
      tag: "W",
      title: "Zone 2 + Mobility",
      focus: "Cardio-only day unless you want light mobility or core",
      segments: [
        cardioSeg("1", "Cardio First", c.thursdayZone2, "cardio"),
        textSeg("2", "Optional Mobility / Core", "10-15 min easy mobility, dead bugs, side planks, hips, T-spine, and calves.", "mobility"),
        textSeg("NOTE", "Week Note", weeklyNote, "week-note")
      ]
    },
    {
      id: "thu-oly-pull",
      type: "c",
      tag: "Th",
      title: "Olympic Technique + Upper Pull",
      focus: "Power clean progression, back, biceps, and controlled conditioning",
      segments: [
        cardioSeg("1", "Cardio First", c.tuesdayZone2, "cardio"),
        textSeg("WU", "Warm-up Before Lifting", PROGRAM.warmups.olympic, "warmup"),
        liftSeg("2", "Olympic Lift", "Power clean technique", p.powerClean[weekIndex], null, "Keep this progressive and technical: log weight and reps, no misses.", "power-clean"),
        listSeg("3", "Then", ["3x3 clean pull", "5x5-8 pull-ups, assisted pull-ups, or lat pulldown"], "pull-main"),
        listSeg("4", "Back / Biceps", ["3x10 single-arm DB row/side", "3x10-12 seated cable row", "3x12-15 straight-arm pulldown", "3x15-20 face pulls", "3x10-12 DB curls", "2x12-15 hammer curls"], "pull-accessories"),
        textSeg("NOTE", "Week Note", weeklyNote, "week-note")
      ]
    },
    {
      id: "fri-posterior",
      type: "g",
      tag: "F",
      title: "AMRAP + Posterior Chain + Glutes",
      focus: "Quality AMRAP first, then controlled posterior chain and glute work",
      segments: [
        cardioSeg("1", "Cardio First", c.fridayAmrap, "cardio"),
        textSeg("WU", "Warm-up Before Lifting", PROGRAM.warmups.lower, "warmup"),
        liftSeg("2", "Main Lift", "Romanian deadlift", p.rdl[weekIndex], null, "Controlled reps only after the AMRAP. No sloppy hinge reps.", "rdl"),
        listSeg("3", "Then", ["4x8-10 hip thrust"], "hip-thrust"),
        listSeg("4", "Glutes / Hamstrings", ["3x10-12 hamstring curl", "3x12-15 cable pull-through", "3x15 glute med kickbacks/side", "3x20 abductors", "3x12-15 standing calf raises"], "posterior-accessories"),
        textSeg("NOTE", "Week Note", weeklyNote, "week-note")
      ]
    },
    {
      id: "sat-pump",
      type: "c",
      tag: "Sa",
      title: "Optional Zone 2 + Full-Body Pump",
      focus: "Fifth lifting day if recovery is good; otherwise cardio only",
      segments: [
        cardioSeg("1", "Cardio First", c.saturdayZone2, "cardio"),
        textSeg("WU", "Warm-up Before Lifting", PROGRAM.warmups.fullBody, "warmup"),
        liftSeg("2", "Main Lift", "Incline DB press or bench press", p.inclinePress[weekIndex], null, "Optional pump day. Skip the lift if four weight days is enough this week.", "incline-press"),
        listSeg("3", "Then", ["3x10 goblet squat or tempo squat"], "squat-pump"),
        listSeg("4", "Full-Body Pump", ["3x12 walking lunges/leg", "3x10-12 lat pulldown", "4x15-20 lateral raises", "3x15 cable kickbacks/leg", "3x12 biceps curls", "3x12 triceps pressdowns"], "full-pump"),
        textSeg("NOTE", "Week Note", weeklyNote, "week-note")
      ]
    },
    {
      id: "sun-recovery",
      type: "r",
      tag: "Su",
      title: "Recovery Cardio Only",
      focus: "Easy cardio, optional mobility and core, no lift",
      segments: [
        cardioSeg("1", "Cardio", c.sundayRecovery, "cardio"),
        textSeg("2", "Optional Mobility / Core", "10-15 min: couch stretch 1-2 min/side, pigeon stretch 1-2 min/side, thoracic rotations 10/side, dead bugs 3x10/side, side plank 2x30s/side.", "mobility"),
        textSeg("NOTE", "Week Note", weeklyNote, "week-note")
      ]
    }
  ];
}

function textSeg(num, name, text, id = null) {
  return { kind: "text", id: id || slug(`${num}-${name}`), num, name, text };
}

function liftSeg(num, name, movement, prescription, superset, goal, id = null) {
  return { kind: "lift", id: id || slug(`${num}-${name}-${movement}`), num, name, movement, prescription, superset, goal };
}

function listSeg(num, name, items, id = null) {
  return { kind: "list", id: id || slug(`${num}-${name}`), num, name, items };
}

function metconSeg(num, name, metcon, id = null) {
  return { kind: "metcon", id: id || slug(`${num}-${name}`), num, name, metcon };
}

function cardioSeg(num, name, cardio, id = null) {
  return { kind: "cardio", id: id || slug(`${num}-${name}`), num, name, cardio };
}

function customPlanKey(weekIndex = state.week) {
  return `fit.plan.${PLAN_KEY}.w${weekIndex}`;
}

function normalizeDay(day, index = 0) {
  return {
    id: day.id || `custom-${Date.now()}-${index}`,
    type: day.type || "c",
    tag: day.tag || `D${index + 1}`,
    title: day.title || "Custom Day",
    focus: day.focus || "Build this day from cardio, lifts, and accessories.",
    duration: Number.isFinite(Number(day.duration)) ? Number(day.duration) : 60,
    targets: Array.isArray(day.targets) ? day.targets : [],
    targetsOverride: Array.isArray(day.targetsOverride) ? day.targetsOverride : null,
    segments: Array.isArray(day.segments) ? day.segments.map((segment, segIndex) => normalizeSegment(segment, segIndex)) : []
  };
}

function normalizeSegment(segment, index = 0) {
  const kind = segment.kind || "text";
  const base = {
    kind,
    id: segment.id || `seg-${Date.now()}-${index}`,
    num: segment.num || String(index + 1),
    name: segment.name || labelForSegmentKind(kind),
    targets: Array.isArray(segment.targets) ? segment.targets : []
  };
  if (kind === "cardio") {
    return {
      ...base,
      cardio: {
        format: segment.cardio?.format || "30-45 min cardio",
        target: segment.cardio?.target || "Cardio target: 30-45 minutes",
        moves: Array.isArray(segment.cardio?.moves) ? segment.cardio.moves : ["Add cardio details"],
        options: Array.isArray(segment.cardio?.options) ? segment.cardio.options : [],
        goal: segment.cardio?.goal || "Keep the effort matched to the day."
      }
    };
  }
  if (kind === "metcon") {
    return {
      ...base,
      intensityAware: Boolean(segment.intensityAware),
      defaultMode: segment.defaultMode || "controlled",
      optional: Boolean(segment.optional),
      metcon: {
        format: segment.metcon?.format || "12 min AMRAP",
        moves: Array.isArray(segment.metcon?.moves) ? segment.metcon.moves : ["Add workout movements"],
        tiers: segment.metcon?.tiers && typeof segment.metcon.tiers === "object" ? segment.metcon.tiers : { L1: "Scaled", L2: "As written", L3: "Advanced" },
        cap: segment.metcon?.cap || "12 minutes",
        goal: segment.metcon?.goal || "Move with purpose and sustainable technique."
      }
    };
  }
  if (kind === "class") return { ...base, text: segment.text || "Log the class demands after attending." };
  if (kind === "choice") return base;
  if (kind === "lift") {
    return {
      ...base,
      movement: segment.movement || "New lift",
      prescription: segment.prescription || "3x8-10",
      superset: Array.isArray(segment.superset) ? segment.superset : null,
      goal: segment.goal || "Use clean reps and log weight/reps."
    };
  }
  if (kind === "list") {
    return {
      ...base,
      items: Array.isArray(segment.items) ? segment.items : ["3x10 new exercise"]
    };
  }
  return {
    ...base,
    text: segment.text || "Add notes here."
  };
}

function getEditableWeek(weekIndex) {
  const saved = readJson(customPlanKey(weekIndex), null);
  if (Array.isArray(saved)) return migrateSavedWeek(saved, weekIndex).map(normalizeDay);
  return buildDefaultWeek(weekIndex).map(normalizeDay);
}

function migrateSavedWeek(saved, weekIndex) {
  const versionKey = `fit.template.version.${PLAN_KEY}.w${weekIndex}`;
  const activeVersion = PLAN_KEY === HYBRID_PLAN_KEY ? HYBRID_TEMPLATE_VERSION : (typeof ATHLETIC_TEMPLATE_VERSION === "number" ? ATHLETIC_TEMPLATE_VERSION : 1);
  if (Number(localStorage.getItem(versionKey) || 0) >= activeVersion) return saved;
  const defaults = buildDefaultWeek(weekIndex);
  const migrated = saved.map((day) => {
    const template = defaults.find((candidate) => candidate.id === day.id);
    if (!template) return day;
    const segments = Array.isArray(day.segments) ? [...day.segments] : [];
    const templateById = Object.fromEntries(template.segments.map((segment) => [segment.id, segment]));
    if (PLAN_KEY === HYBRID_PLAN_KEY) {
      const templateIds = new Set(template.segments.map((segment) => segment.id));
      const customSegments = segments.filter((segment) => !templateIds.has(segment.id));
      return { ...day, title: template.title, focus: template.focus, duration: template.duration, targets: template.targets, segments: [...template.segments, ...customSegments] };
    }
    if (day.id === "lower-power") {
      if (!segments.some((segment) => segment.id === "power-emom")) segments.splice(1, 0, templateById["power-emom"]);
      ["power-clean", "box-jump"].forEach((id) => {
        const index = segments.findIndex((segment) => segment.id === id);
        if (index >= 0) segments[index] = { ...segments[index], name: templateById[id].name, prescription: templateById[id].prescription };
      });
    }
    if (day.id === "upper-class" || day.id === "short-glute-class") {
      const index = segments.findIndex((segment) => segment.id === "class");
      if (index >= 0) segments[index] = templateById.class;
    }
    if (day.id === "full-athletic") {
      const oldIndex = segments.findIndex((segment) => segment.id === "optional-conditioning");
      const newIndex = segments.findIndex((segment) => segment.id === "crossfit-wod");
      if (newIndex < 0 && oldIndex >= 0) segments.splice(oldIndex, 1, templateById["crossfit-wod"]);
      if (newIndex < 0 && oldIndex < 0) segments.push(templateById["crossfit-wod"]);
    }
    return { ...day, segments };
  });
  storageSetItem.call(localStorage, versionKey, String(activeVersion));
  storageSetItem.call(localStorage, customPlanKey(weekIndex), JSON.stringify(migrated));
  scheduleProgressSync();
  return migrated;
}

function saveEditableWeek(days, weekIndex = state.week) {
  writeJson(customPlanKey(weekIndex), days.map(normalizeDay));
}

function ensureEditableWeek() {
  const days = getEditableWeek(state.week);
  saveEditableWeek(days);
  return days;
}

function resetEditableWeek() {
  localStorage.removeItem(customPlanKey());
  state.openDays.clear();
  render();
}

function labelForSegmentKind(kind) {
  if (kind === "cardio") return "Cardio";
  if (kind === "lift") return "Lift";
  if (kind === "list") return "Exercises";
  if (kind === "metcon") return "CrossFit-Style WOD";
  if (kind === "class") return "Group Class";
  return "Notes";
}

function render() {
  localStorage.setItem(`fit.week.${PLAN_KEY}`, String(state.week));
  renderTabs();
  renderBanner();
  renderTargetDashboard();
  renderDays();
  renderToday();
  renderProgressScreen();
  renderLibrary();
  renderSettings();
  showScreen(state.screen);
  applySearch();
}

function renderTabs() {
  const tabs = $("#weekTabs");
  tabs.innerHTML = "";

  for (let i = 0; i < 8; i += 1) {
    const button = document.createElement("button");
    const test = i === 7;
    button.className = `week-tab${i === state.week ? " active" : ""}${test ? " test" : ""}`;
    button.type = "button";
    button.innerHTML = `<small>${test ? "Deload" : "Week"}</small><b>${i + 1}</b>`;
    button.addEventListener("click", () => {
      state.week = i;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    tabs.appendChild(button);
  }
}

function renderBanner() {
  const block = PROGRAM.blocks[getWeekBlock(state.week)];
  $("#blockBanner").innerHTML = `
    <div>
      <h2>${escapeHtml(block.name)}</h2>
      <p>${escapeHtml(block.summary)}</p>
    </div>
    <span>${escapeHtml(block.weeks)}</span>
  `;
}

function renderDays() {
  captureOpenDays();
  const list = $("#dayList");
  list.innerHTML = "";
  const days = buildWeek(state.week);
  list.appendChild(renderPlanEditorBar(days.length));
  days.forEach((day, dayIndex) => {
    const key = `w${state.week}.${PLAN_KEY}.${day.id || `d${dayIndex}`}`;
    const isOpen = state.expanded || state.openDays.has(key);
    const card = document.createElement("article");
    card.className = `day${isOpen ? " open" : ""}`;
    card.dataset.dayKey = key;
    card.dataset.search = JSON.stringify(day).toLowerCase();
    card.innerHTML = `
      <div class="day-head" role="button" tabindex="0">
        <div class="tag ${day.type}">${escapeHtml(day.tag)}</div>
        <div>
          <div class="day-type">Session ${dayIndex + 1} · ${labelForType(day.type)} · ${day.duration || 0} min</div>
          <div class="day-title">${escapeHtml(day.title)}</div>
          <div class="day-focus">${escapeHtml(day.focus)}</div>
          <div class="day-targets">${targetsForDay(day).slice(0, 7).map((target) => `<span>${escapeHtml(WEEKLY_TARGETS[target]?.label || target)}</span>`).join("")}</div>
        </div>
        <div class="day-edit-actions">
          <button class="edit-day" type="button" data-day-index="${dayIndex}">Edit workout</button>
          <button class="move-day" type="button" data-day-index="${dayIndex}" data-direction="-1" ${dayIndex === 0 ? "disabled" : ""}>Up</button>
          <button class="move-day" type="button" data-day-index="${dayIndex}" data-direction="1" ${dayIndex === days.length - 1 ? "disabled" : ""}>Down</button>
          <button class="delete-day" type="button" data-day-index="${dayIndex}">Delete</button>
        </div>
        <label class="done" title="Mark complete">
          <input type="checkbox" data-done="${key}" ${localStorage.getItem(`fit.done.${key}`) === "1" ? "checked" : ""}>
          Done
        </label>
        <div class="chev">v</div>
      </div>
      <div class="day-body">
        ${day.segments.map((segment, segIndex) => renderSegment(segment, `${key}.${segment.id || `s${segIndex}`}`, dayIndex, segIndex, day.segments.length)).join("")}
        ${renderSegmentAddControls(dayIndex)}
        ${renderExtraExercises(key, dayIndex)}
        <textarea class="notes" data-note="${key}" placeholder="Session notes...">${escapeHtml(localStorage.getItem(`fit.note.${key}`) || "")}</textarea>
      </div>
    `;

    $(".day-head", card).addEventListener("click", (event) => {
      if (event.target.closest("input, button, select, textarea")) return;
      toggleDay(card, key);
    });
    $(".day-head", card).addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleDay(card, key);
      }
    });
    list.appendChild(card);
  });

  bindPlanEditingControls();

  $$("[data-done]").forEach((box) => {
    box.addEventListener("change", () => {
      localStorage.setItem(`fit.done.${box.dataset.done}`, box.checked ? "1" : "0");
      renderTargetDashboard();
      updateWodRecommendationPanels();
    });
  });

  $$("[data-note]").forEach((note) => {
    note.addEventListener("input", () => {
      localStorage.setItem(`fit.note.${note.dataset.note}`, note.value);
    });
  });

  $$(".tier").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.setItem(`fit.tier.${button.dataset.key}`, button.dataset.tier);
      captureOpenDays();
      renderDays();
      applySearch();
    });
  });

  $$(".set-input").forEach((input) => {
    input.addEventListener("input", () => {
      const current = normalizeTrackEntry(readJson(`fit.track.${input.dataset.track}`, {}));
      const setIndex = Number(input.dataset.setIndex);
      current.sets[setIndex] = current.sets[setIndex] || blankSet();
      current.sets[setIndex][input.dataset.field] = input.value;
      current.movementId = input.dataset.movementId;
      current.movement = input.dataset.movement;
      current.week = state.week;
      current.updatedAt = new Date().toISOString();
      writeJson(`fit.track.${input.dataset.track}`, current);
      updateLastTimePanels();
    });
  });

  $$(".metcon-input").forEach((input) => {
    input.addEventListener("input", () => {
      const current = normalizeMetconEntry(readJson(`fit.metcon.${input.dataset.key}`, {}));
      if (input.dataset.field === "rounds" || input.dataset.field === "reps" || input.dataset.field === "time" || input.dataset.field === "notes") {
        current[input.dataset.field] = input.value;
      }
      if (input.dataset.field === "load") {
        current.loads[input.dataset.movementId] = {
          movement: input.dataset.movement,
          load: input.value
        };
      }
      current.updatedAt = new Date().toISOString();
      writeJson(`fit.metcon.${input.dataset.key}`, current);
    });
  });

  $$(".class-input").forEach((input) => {
    input.addEventListener("input", () => {
      const current = readClassEntry(input.dataset.key);
      current[input.dataset.field] = input.type === "checkbox" ? input.checked : input.value;
      current.updatedAt = new Date().toISOString();
      writeJson(`fit.class.${input.dataset.key}`, current);
    });
    input.addEventListener("change", () => {
      const current = readClassEntry(input.dataset.key);
      current[input.dataset.field] = input.type === "checkbox" ? input.checked : input.value;
      current.updatedAt = new Date().toISOString();
      writeJson(`fit.class.${input.dataset.key}`, current);
      renderTargetDashboard();
      updateWodRecommendationPanels();
    });
  });

  $$(".wod-mode").forEach((select) => {
    select.addEventListener("change", () => {
      localStorage.setItem(`fit.wodmode.${select.dataset.key}`, select.value);
      renderTargetDashboard();
      updateWodRecommendationPanels();
    });
  });

  $$(".condition-choice").forEach((select) => {
    select.addEventListener("change", () => {
      localStorage.setItem(`fit.conditionchoice.${select.dataset.dayKey}`, select.value);
      renderTargetDashboard();
      applyConditionChoices();
    });
  });

  applyConditionChoices();

  $$(".extra-name").forEach((input) => {
    input.addEventListener("input", () => {
      const extras = readExtras(input.dataset.dayKey);
      const item = extras[Number(input.dataset.extraIndex)];
      if (!item) return;
      item.name = input.value;
      writeExtras(input.dataset.dayKey, extras);
    });
    input.addEventListener("change", () => {
      if (isProhibitedMovement(input.value)) {
        alert("Snatches and handstand push-ups are excluded from this program. Choose a clean, jerk, press, row, or other purpose-matched movement.");
        const extras = readExtras(input.dataset.dayKey);
        const item = extras[Number(input.dataset.extraIndex)];
        if (item) item.name = "";
        writeExtras(input.dataset.dayKey, extras);
        input.value = "";
      }
      captureOpenDays();
      renderDays();
      applySearch();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      input.blur();
    });
  });

  $$(".add-extra").forEach((button) => {
    button.addEventListener("click", () => {
      const extras = readExtras(button.dataset.dayKey);
      extras.push({ name: "" });
      writeExtras(button.dataset.dayKey, extras);
      captureOpenDays();
      renderDays();
      applySearch();
    });
  });

  $$(".remove-extra").forEach((button) => {
    button.addEventListener("click", () => {
      const extras = readExtras(button.dataset.dayKey);
      extras.splice(Number(button.dataset.extraIndex), 1);
      writeExtras(button.dataset.dayKey, extras);
      captureOpenDays();
      renderDays();
      applySearch();
    });
  });

  $$(".add-set").forEach((button) => {
    button.addEventListener("click", () => {
      const current = normalizeTrackEntry(readJson(`fit.track.${button.dataset.track}`, {}));
      current.sets.push(blankSet());
      current.movementId = button.dataset.movementId;
      current.movement = button.dataset.movement;
      current.week = state.week;
      current.updatedAt = new Date().toISOString();
      writeJson(`fit.track.${button.dataset.track}`, current);
      captureOpenDays();
      renderDays();
      applySearch();
    });
  });

  $$(".delete-set").forEach((button) => {
    button.addEventListener("click", () => {
      const current = normalizeTrackEntry(readJson(`fit.track.${button.dataset.track}`, {}));
      current.sets.splice(Number(button.dataset.setIndex), 1);
      if (!current.sets.length) current.sets.push(blankSet());
      current.updatedAt = new Date().toISOString();
      writeJson(`fit.track.${button.dataset.track}`, current);
      captureOpenDays();
      renderDays();
      applySearch();
    });
  });

  $$(".hide-exercise").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.setItem(`fit.hidden.${button.dataset.track}`, "1");
      captureOpenDays();
      renderDays();
      applySearch();
    });
  });

  $$(".restore-exercise").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem(`fit.hidden.${button.dataset.track}`);
      captureOpenDays();
      renderDays();
      applySearch();
    });
  });

  $$(".complex-input").forEach((input) => {
    input.addEventListener("input", () => {
      const current = normalizeComplexEntry(readJson(`fit.complex.${input.dataset.track}`, {}), input.dataset.parts);
      const partIndex = Number(input.dataset.partIndex);
      current.parts[partIndex] = current.parts[partIndex] || { name: input.dataset.partName, reps: "", notes: "" };
      current.parts[partIndex].name = input.dataset.partName;
      current.parts[partIndex][input.dataset.field] = input.value;
      current.updatedAt = new Date().toISOString();
      writeJson(`fit.complex.${input.dataset.track}`, current);
    });
  });

  $$(".swap-select").forEach((select) => {
    select.addEventListener("change", () => {
      const value = select.value;
      const blockSwap = select.closest(".movement-tools").querySelector(".block-swap");
      const scopeKey = blockSwap.checked ? blockSwap.dataset.blockKey : select.dataset.instanceKey;
      if (value) {
        localStorage.setItem(scopeKey, value);
      } else {
        localStorage.removeItem(scopeKey);
      }
      captureOpenDays();
      renderDays();
      applySearch();
    });
  });

  $$(".block-swap").forEach((box) => {
    box.addEventListener("change", () => {
      const select = box.closest(".movement-tools").querySelector(".swap-select");
      if (!select.value) return;
      if (box.checked) {
        localStorage.removeItem(select.dataset.instanceKey);
        localStorage.setItem(box.dataset.blockKey, select.value);
      } else {
        localStorage.removeItem(box.dataset.blockKey);
        localStorage.setItem(select.dataset.instanceKey, select.value);
      }
      captureOpenDays();
      renderDays();
      applySearch();
    });
  });

  updateLastTimePanels();
}

function toggleDay(card, key) {
  const isOpen = card.classList.toggle("open");
  if (isOpen) {
    state.openDays.add(key);
  } else {
    state.openDays.delete(key);
  }
}

function bindPlanEditingControls() {
  $$(".edit-day").forEach((button) => {
    button.addEventListener("click", () => {
      const days = ensureEditableWeek();
      const day = days[Number(button.dataset.dayIndex)];
      if (!day) return;
      const title = prompt("Workout name?", day.title);
      if (!title) return;
      const duration = prompt("Estimated duration in minutes?", String(day.duration || 60));
      const focus = prompt("Workout purpose or notes?", day.focus) || day.focus;
      const targetText = prompt(`Weekly targets covered? Separate with commas.\nAvailable: ${Object.keys(WEEKLY_TARGETS).join(", ")}`, targetsForDay(day).join(", "));
      day.title = title;
      day.focus = focus;
      day.duration = Math.max(0, Number(duration) || 0);
      if (targetText !== null) day.targetsOverride = splitPromptList(targetText).filter((key) => WEEKLY_TARGETS[key]);
      saveEditableWeek(days);
      render();
    });
  });

  $("#addDayBtn")?.addEventListener("click", () => {
    const days = ensureEditableWeek();
    const title = prompt("Day title?", "Custom Workout Day");
    if (!title) return;
    const focus = prompt("Day focus?", "Build this day with cardio, lifts, and accessories.") || "Build this day with cardio, lifts, and accessories.";
    days.push(normalizeDay({
      id: `custom-day-${Date.now()}`,
      type: "c",
      tag: `D${days.length + 1}`,
      title,
      focus,
      segments: []
    }, days.length));
    saveEditableWeek(days);
    render();
  });

  $("#resetWeekBtn")?.addEventListener("click", () => {
    if (confirm("Reset this week's layout back to the default plan? Your logged sets stay saved, but custom day structure is removed.")) resetEditableWeek();
  });

  $$(".move-day").forEach((button) => {
    button.addEventListener("click", () => {
      const days = ensureEditableWeek();
      const from = Number(button.dataset.dayIndex);
      const to = from + Number(button.dataset.direction);
      if (to < 0 || to >= days.length) return;
      [days[from], days[to]] = [days[to], days[from]];
      saveEditableWeek(days);
      render();
    });
  });

  $$(".delete-day").forEach((button) => {
    button.addEventListener("click", () => {
      const days = ensureEditableWeek();
      const index = Number(button.dataset.dayIndex);
      if (!confirm(`Delete ${days[index]?.title || "this day"} from this week layout? Logged data is not deleted.`)) return;
      days.splice(index, 1);
      saveEditableWeek(days);
      render();
    });
  });

  $$(".add-segment").forEach((button) => {
    button.addEventListener("click", () => {
      const days = ensureEditableWeek();
      const day = days[Number(button.dataset.dayIndex)];
      if (!day) return;
      const segment = promptForSegment(button.dataset.kind, day.segments.length);
      if (!segment) return;
      day.segments.push(segment);
      saveEditableWeek(days);
      render();
    });
  });

  $$(".move-segment").forEach((button) => {
    button.addEventListener("click", () => {
      const days = ensureEditableWeek();
      const day = days[Number(button.dataset.dayIndex)];
      if (!day) return;
      const from = Number(button.dataset.segIndex);
      const to = from + Number(button.dataset.direction);
      if (to < 0 || to >= day.segments.length) return;
      [day.segments[from], day.segments[to]] = [day.segments[to], day.segments[from]];
      saveEditableWeek(days);
      render();
    });
  });

  $$(".delete-segment").forEach((button) => {
    button.addEventListener("click", () => {
      const days = ensureEditableWeek();
      const day = days[Number(button.dataset.dayIndex)];
      if (!day) return;
      const index = Number(button.dataset.segIndex);
      if (!confirm(`Delete ${day.segments[index]?.name || "this section"}? Logged data is not deleted.`)) return;
      day.segments.splice(index, 1);
      saveEditableWeek(days);
      render();
    });
  });
}

function targetsForDay(day) {
  if (Array.isArray(day.targetsOverride)) return day.targetsOverride;
  const segmentTargets = (day.segments || []).flatMap((segment) => segment.targets || []);
  const structural = day.type === "r" ? ["rest"] : [];
  return Array.from(new Set([...(day.targets || []), ...segmentTargets, ...structural]));
}

function targetCounts(days) {
  const planned = {};
  const completed = {};
  Object.keys(WEEKLY_TARGETS).forEach((key) => { planned[key] = 0; completed[key] = 0; });
  days.forEach((day, dayIndex) => {
    const dayKey = `w${state.week}.${PLAN_KEY}.${day.id || `d${dayIndex}`}`;
    let targets = targetsForDay(day);
    if (day.id === "hybrid-conditioning") {
      const choice = localStorage.getItem(`fit.conditionchoice.${dayKey}`) || "zone2";
      const longKey = `${dayKey}.long-conditioning`;
      const longMode = localStorage.getItem(`fit.wodmode.${longKey}`) || "aerobic";
      if (choice === "long" && longMode !== "aerobic") targets = targets.filter((target) => target !== "zone2");
    }
    const isDone = localStorage.getItem(`fit.done.${dayKey}`) === "1";
    targets.forEach((target) => {
      planned[target] = (planned[target] || 0) + 1;
      if (isDone) completed[target] = (completed[target] || 0) + 1;
    });
  });
  completed.anaerobic = currentHardExposureCount(days);
  planned.anaerobic = Math.max(WEEKLY_TARGETS.anaerobic.min, completed.anaerobic);
  return { planned, completed };
}

function targetStatus(value, planned, target) {
  if (value > target.max || planned > target.max) return { label: "Exceeded", className: "exceeded" };
  if (value >= target.min) return { label: "Complete", className: "complete" };
  if (planned >= target.min) return { label: "On track", className: "on-track" };
  if (planned === 0) return { label: "Missing", className: "missing" };
  return { label: "At risk", className: "at-risk" };
}

function renderTargetDashboard() {
  const grid = $("#targetGrid");
  if (!grid || typeof WEEKLY_TARGETS === "undefined") return;
  const days = buildWeek(state.week);
  const counts = targetCounts(days);
  const priority = PLAN_KEY === HYBRID_PLAN_KEY
    ? ["lower","upperSplit","fullBody","metcon","glute","olympic","jump","sprint","gymnastics","physio","anaerobic","zone2","rest"]
    : ["glute","upper","olympic","jump","sprint","core","intentionalCore","physio","anaerobic","zone2","carry","rest"];
  grid.innerHTML = priority.map((key) => {
    const target = WEEKLY_TARGETS[key];
    const status = targetStatus(counts.completed[key], counts.planned[key], target);
    const goal = target.min === target.max ? String(target.min) : `${target.min}-${target.max}`;
    return `<article class="target-card ${status.className}">
      <div><span>${escapeHtml(target.label)}</span><b>${counts.completed[key]} of ${goal}</b></div>
      <small>${status.label} · ${counts.planned[key]} planned</small>
    </article>`;
  }).join("");
  const missing = priority.filter((key) => counts.planned[key] < WEEKLY_TARGETS[key].min);
  const excessive = priority.filter((key) => counts.planned[key] > WEEKLY_TARGETS[key].max);
  const summary = $("#targetSummary");
  if (summary) summary.textContent = `${priority.length - missing.length} of ${priority.length} objectives covered`;
  const advice = $("#targetAdvice");
  if (advice) {
    if (excessive.includes("anaerobic")) advice.textContent = "Anaerobic work is above the useful weekly range. Remove optional conditioning before adding more intensity.";
    else if (missing.length) advice.textContent = `Plan gap: ${missing.map((key) => WEEKLY_TARGETS[key].label).join(", ")}. Add or restore purpose-matched work; the week is not marked failed.`;
    else advice.textContent = "The current layout covers every priority target. Moving sessions changes recovery order, not target coverage.";
  }
}

function promptForSegment(kind, index) {
  const id = `custom-seg-${Date.now()}-${index}`;
  const num = String(index + 1);
  if (kind === "cardio") {
    const format = prompt("Cardio format?", "30-45 min Zone 2");
    if (!format) return null;
    const moves = prompt("Cardio details? Separate lines with commas.", "Incline walk, bike, StairMaster, or row") || "";
    const options = prompt("Options/swaps? Separate with commas.", "Incline walk, bike, StairMaster, row") || "";
    const goal = prompt("Cardio goal?", "Keep this matched to the day.") || "Keep this matched to the day.";
    const result = cardioSeg(num, "Cardio", {
      format,
      target: format.match(/\d/) ? `Cardio target: ${format}` : "Cardio target: custom",
      moves: splitPromptList(moves),
      options: splitPromptList(options),
      goal
    }, id);
    result.targets = askTargets(format.toLowerCase().includes("zone 2") ? ["zone2"] : ["anaerobic"]);
    return result;
  }
  if (kind === "lift") {
    const movement = prompt("Lift name?", "Back squat");
    if (!movement) return null;
    if (isProhibitedMovement(movement)) {
      alert("Snatches and handstand push-ups are excluded from this program.");
      return null;
    }
    const prescription = prompt("Sets/reps/progression?", "4x6 @ RPE 7") || "3x8-10";
    const goal = prompt("Lift goal?", "Log weight and reps. Keep clean form.") || "Log weight and reps. Keep clean form.";
    const result = liftSeg(num, "Lift", movement, prescription, null, goal, id);
    result.targets = askTargets([]);
    return result;
  }
  if (kind === "list") {
    const name = prompt("Section name?", "Accessories") || "Accessories";
    const items = prompt("Exercises? Separate with commas.", "3x10 exercise one, 3x12 exercise two");
    if (!items) return null;
    const result = listSeg(num, name, splitPromptList(items), id);
    result.targets = askTargets([]);
    return result;
  }
  const name = prompt("Note section name?", "Notes") || "Notes";
  const text = prompt("Notes?", "Add workout notes here.");
  if (!text) return null;
  return textSeg(num, name, text, id);
}

function askTargets(suggested = []) {
  const answer = prompt(`Which weekly targets does this preserve? Separate with commas.\nAvailable: ${Object.keys(WEEKLY_TARGETS).join(", ")}`, suggested.join(", "));
  if (answer === null) return suggested;
  return splitPromptList(answer).filter((key) => WEEKLY_TARGETS[key]);
}

function splitPromptList(value) {
  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function captureOpenDays() {
  $$(".day.open").forEach((day) => {
    if (day.dataset.dayKey) state.openDays.add(day.dataset.dayKey);
  });
}

function renderPlanEditorBar(dayCount) {
  const bar = document.createElement("section");
  bar.className = "plan-editor-bar";
  bar.innerHTML = `
    <div>
      <h2>Week Layout</h2>
      <p>${dayCount} days. Move days, delete days, or add custom workout/cardio days for this week.</p>
    </div>
    <div class="plan-editor-actions">
      <button id="addDayBtn" type="button">Add day</button>
      <button id="resetWeekBtn" type="button">Reset week layout</button>
    </div>
  `;
  return bar;
}

function renderSegmentAddControls(dayIndex) {
  return `
    <section class="seg segment-add">
      <div class="seg-h">
        <span class="seg-num">+</span>
        <span class="seg-name">Build This Workout</span>
      </div>
      <div class="segment-add-actions">
        <button class="add-segment" type="button" data-day-index="${dayIndex}" data-kind="cardio">Add cardio</button>
        <button class="add-segment" type="button" data-day-index="${dayIndex}" data-kind="lift">Add lift</button>
        <button class="add-segment" type="button" data-day-index="${dayIndex}" data-kind="list">Add exercises</button>
        <button class="add-segment" type="button" data-day-index="${dayIndex}" data-kind="text">Add notes</button>
      </div>
    </section>
  `;
}

function renderSegmentEditControls(dayIndex, segIndex, segmentCount) {
  return `
    <div class="segment-edit-actions">
      <button class="move-segment" type="button" data-day-index="${dayIndex}" data-seg-index="${segIndex}" data-direction="-1" ${segIndex === 0 ? "disabled" : ""}>Up</button>
      <button class="move-segment" type="button" data-day-index="${dayIndex}" data-seg-index="${segIndex}" data-direction="1" ${segIndex === segmentCount - 1 ? "disabled" : ""}>Down</button>
      <button class="delete-segment" type="button" data-day-index="${dayIndex}" data-seg-index="${segIndex}">Delete</button>
    </div>
  `;
}

function renderSegment(segment, key, dayIndex, segIndex, segmentCount) {
  let body = "";

  if (segment.kind === "text") {
    body = `<p class="plain">${escapeHtml(segment.text)}</p>`;
  }

  if (segment.kind === "lift") {
    const movement = renderTrackedMovement(segment.movement, key, dayIndex, segIndex, 0, segment.prescription);
    body = `
      <div class="rx-line">${escapeHtml(segment.prescription)}</div>
      ${movement}
      ${renderComplexTracker(segment.movement, segment.prescription, key, dayIndex, segIndex)}
      ${segment.superset ? `<div class="superset">${segment.superset.map((item, itemIndex) => renderSupersetItem(item, key, dayIndex, segIndex, itemIndex)).join("")}</div>` : ""}
      <div class="goal"><b>Goal</b><span>${escapeHtml(segment.goal)}</span></div>
    `;
  }

  if (segment.kind === "list") {
    body = `<div class="tracked-list">${segment.items.map((item, itemIndex) => renderListItem(item, key, dayIndex, segIndex, itemIndex)).join("")}</div>`;
  }

  if (segment.kind === "class") body = renderClassLog(key, segment.text);
  if (segment.kind === "choice") {
    const dayKey = key.replace(/\.conditioning-choice$/, "");
    const selected = localStorage.getItem(`fit.conditionchoice.${dayKey}`) || "zone2";
    body = `<div class="conditioning-choice"><label><span>Today’s format</span><select class="condition-choice" data-day-key="${escapeAttr(dayKey)}"><option value="zone2" ${selected === "zone2" ? "selected" : ""}>Choice A · True Zone 2</option><option value="long" ${selected === "long" ? "selected" : ""}>Choice B · Long EMOM / AMRAP</option></select></label><p>Only the selected option is required today.</p></div>`;
  }

  if (segment.kind === "metcon") {
    const selected = localStorage.getItem(`fit.tier.${key}`) || "L2";
    const mc = segment.metcon;
    const intensityPanel = segment.intensityAware ? renderWodIntensityPanel(key, segment.defaultMode, segment.optional) : "";
    body = `
      <div class="metcon">
        ${intensityPanel}
        <div class="metcon-title">${escapeHtml(mc.format)}</div>
        <div class="metcon-block">${mc.moves.map((move, moveIndex) => renderMetconMove(move, key, dayIndex, segIndex, moveIndex)).join("")}</div>
        <div class="tiers">
          ${["L1", "L2", "L3"].map((tier) => `<button class="tier ${tier === selected ? "active" : ""}" type="button" data-key="${key}" data-tier="${tier}">${tier} ${tier === "L1" ? "Scaled" : tier === "L2" ? "Rx" : "Rx+"}</button>`).join("")}
        </div>
        <p class="loads"><b>${selected}:</b> ${escapeHtml(mc.tiers[selected])}</p>
        <span class="cap">${escapeHtml(mc.cap)}</span>
        ${renderMetconTracking(mc, key, dayIndex, segIndex)}
        <div class="goal"><b>Goal</b><span>${escapeHtml(mc.goal)}</span></div>
      </div>
    `;
  }

  if (segment.kind === "cardio" && segment.cardio) {
    const cardio = segment.cardio;
    body = `
      <div class="metcon cardio">
        <div class="metcon-title">${escapeHtml(cardio.format)}</div>
        <div class="metcon-block">
          ${cardio.moves.map((move) => `<p class="plain movement-name">${escapeHtml(move)}</p>`).join("")}
        </div>
        ${renderCardioOptions(cardio)}
        <span class="cap">${escapeHtml(cardio.target || "Daily target: 30-45 minutes")}</span>
        ${renderCardioTracking(key)}
        <div class="goal"><b>Goal</b><span>${escapeHtml(cardio.goal)}</span></div>
      </div>
    `;
  }

  return `
    <section class="seg segment-${escapeAttr(segment.id)}">
      <div class="seg-h">
        <span class="seg-num">${escapeHtml(segment.num)}</span>
        <span class="seg-name">${escapeHtml(segment.name)}</span>
        ${renderSegmentEditControls(dayIndex, segIndex, segmentCount)}
      </div>
      ${body}
    </section>
  `;
}

function readClassEntry(key) {
  const saved = readJson(`fit.class.${key}`, {});
  return {
    completed: Boolean(saved.completed),
    relationship: saved.relationship || "none",
    name: saved.name || "",
    duration: saved.duration || "",
    intensity: saved.intensity || "",
    anaerobic: saved.anaerobic || "",
    fatigue: saved.fatigue || "",
    notes: saved.notes || "",
    updatedAt: saved.updatedAt || ""
  };
}

function isHardClass(entry) {
  return Boolean(entry.completed) && Number(entry.intensity) >= 7 && Number(entry.anaerobic) >= 6;
}

function renderClassLog(key, description) {
  const saved = readClassEntry(key);
  return `<div class="class-log">
    <p class="plain">${escapeHtml(description)}</p>
    <label class="class-attended"><input class="class-input" type="checkbox" data-key="${escapeAttr(key)}" data-field="completed" ${saved.completed ? "checked" : ""}> Class attended</label>
    <div class="class-grid">
      <label><span>Use class as</span><select class="class-input" data-key="${escapeAttr(key)}" data-field="relationship"><option value="none" ${saved.relationship === "none" ? "selected" : ""}>Log only</option><option value="replaces_metcon" ${saved.relationship === "replaces_metcon" ? "selected" : ""}>Replace planned finisher</option><option value="additional" ${saved.relationship === "additional" ? "selected" : ""}>Additional work</option></select></label>
      <label><span>Class name</span><input class="class-input" data-key="${escapeAttr(key)}" data-field="name" value="${escapeAttr(saved.name)}" placeholder="CrossFit, conditioning…"></label>
      <label><span>Duration (min)</span><input class="class-input" type="number" min="0" max="180" data-key="${escapeAttr(key)}" data-field="duration" value="${escapeAttr(saved.duration)}"></label>
      <label><span>Overall intensity 1–10</span><input class="class-input" type="number" min="1" max="10" data-key="${escapeAttr(key)}" data-field="intensity" value="${escapeAttr(saved.intensity)}"></label>
      <label><span>Anaerobic demand 1–10</span><input class="class-input" type="number" min="1" max="10" data-key="${escapeAttr(key)}" data-field="anaerobic" value="${escapeAttr(saved.anaerobic)}"></label>
      <label><span>Overall fatigue 1–10</span><input class="class-input" type="number" min="1" max="10" data-key="${escapeAttr(key)}" data-field="fatigue" value="${escapeAttr(saved.fatigue)}"></label>
      <label><span>Exercises / notes</span><input class="class-input" data-key="${escapeAttr(key)}" data-field="notes" value="${escapeAttr(saved.notes)}" placeholder="Movements, scaling, soreness…"></label>
    </div>
    <p class="class-status ${isHardClass(saved) ? "hard" : "controlled"}">${saved.completed ? (isHardClass(saved) ? "Counts as one hard anaerobic exposure." : "Logged, but does not meet the hard-exposure threshold.") : "Not counted until attended."}</p>
  </div>`;
}

function currentHardExposureCount(days = buildWeek(state.week), excludeWod = false) {
  let count = 0;
  days.forEach((day, dayIndex) => {
    const dayKey = `w${state.week}.${PLAN_KEY}.${day.id || `d${dayIndex}`}`;
    if ((day.id === "sprint-glute" || day.id === "hybrid-lower-b") && localStorage.getItem(`fit.done.${dayKey}`) === "1") count += 1;
    (day.segments || []).filter((segment) => segment.kind === "class").forEach((segment) => {
      if (isHardClass(readClassEntry(`${dayKey}.${segment.id}`))) count += 1;
    });
    if (!excludeWod && localStorage.getItem(`fit.done.${dayKey}`) === "1" && !dayHasReplacementClass(day, dayKey)) {
      (day.segments || []).filter((segment) => segment.kind === "metcon" && !segment.optional).forEach((segment) => {
        const wodKey = `${dayKey}.${segment.id}`;
        if ((localStorage.getItem(`fit.wodmode.${wodKey}`) || segment.defaultMode || "controlled") === "hard") count += 1;
      });
    }
  });
  return count;
}

function dayHasReplacementClass(day, dayKey) {
  return (day.segments || []).filter((segment) => segment.kind === "class").some((segment) => {
    const entry = readClassEntry(`${dayKey}.${segment.id}`);
    return entry.completed && entry.relationship === "replaces_metcon";
  });
}

function recommendedWodMode(days = buildWeek(state.week)) {
  const hard = currentHardExposureCount(days, false);
  if (hard <= 1) return "hard";
  if (hard === 2) return "controlled";
  return "aerobic";
}

function renderWodIntensityPanel(key, defaultMode = "controlled", optional = false) {
  const budgetMode = recommendedWodMode();
  const recommended = budgetMode === "aerobic" ? "aerobic" : budgetMode === "controlled" && defaultMode === "hard" ? "controlled" : defaultMode;
  const selected = localStorage.getItem(`fit.wodmode.${key}`) || recommended;
  const copy = {
    hard: "Full WOD as written. This counts as a hard anaerobic exposure.",
    controlled: "Reduce time, rounds, or repetitions by about 20%; cap effort at RPE 7.",
    aerobic: "Use L1 movements, remove repetitive jumping, and cap effort at RPE 6. This does not count as hard."
  };
  return `<div class="wod-intensity" data-wod-panel="${escapeAttr(key)}" data-default-mode="${escapeAttr(defaultMode)}" data-optional="${optional ? "1" : "0"}">
    <div><b>Intensity budget</b><span>${currentHardExposureCount(buildWeek(state.week), true)} hard exposures completed before this WOD</span></div>
    <label><span>Workout version</span><select class="wod-mode" data-key="${escapeAttr(key)}">
      <option value="hard" ${selected === "hard" ? "selected" : ""}>Full / hard</option>
      <option value="controlled" ${selected === "controlled" ? "selected" : ""}>Controlled</option>
      <option value="aerobic" ${selected === "aerobic" ? "selected" : ""}>Technique / aerobic</option>
      ${optional ? `<option value="skipped" ${selected === "skipped" ? "selected" : ""}>Skip optional finisher</option>` : ""}
    </select></label>
    <p><strong>Recommended: ${recommended}.</strong> ${selected === "skipped" ? "Optional finisher skipped; required weekly targets are unaffected." : copy[selected]}</p>
  </div>`;
}

function updateWodRecommendationPanels() {
  $$('[data-wod-panel]').forEach((panel) => {
    const replacement = document.createElement("div");
    replacement.innerHTML = renderWodIntensityPanel(panel.dataset.wodPanel, panel.dataset.defaultMode || "controlled", panel.dataset.optional === "1");
    panel.replaceWith(replacement.firstElementChild);
  });
  $$(".wod-mode").forEach((select) => select.addEventListener("change", () => {
    localStorage.setItem(`fit.wodmode.${select.dataset.key}`, select.value);
    renderTargetDashboard();
    updateWodRecommendationPanels();
  }));
}

function applyConditionChoices() {
  $$(".day").forEach((card) => {
    if (!card.dataset.dayKey?.endsWith(".hybrid-conditioning")) return;
    const choice = localStorage.getItem(`fit.conditionchoice.${card.dataset.dayKey}`) || "zone2";
    $(".segment-zone2-choice", card)?.classList.toggle("choice-hidden", choice !== "zone2");
    $(".segment-long-conditioning", card)?.classList.toggle("choice-hidden", choice !== "long");
  });
}

function renderCardioOptions(cardio) {
  if (!Array.isArray(cardio.options) || !cardio.options.length) return "";
  return `
    <p class="loads cardio-options">
      <b>Options / swaps:</b> ${cardio.options.map(escapeHtml).join(" / ")}
    </p>
  `;
}

function renderCardioTracking(key) {
  const saved = normalizeMetconEntry(readJson(`fit.metcon.${key}`, {}));
  return `
    <div class="metcon-score">
      <div class="score-grid time-score">
        <label><span>Duration / distance</span><input class="metcon-input" placeholder="35 min, 3 mi, 250 floors..." value="${escapeAttr(saved.time)}" data-key="${escapeAttr(key)}" data-field="time"></label>
        <label><span>Cardio notes</span><input class="metcon-input" placeholder="Run, stairs, EMOM, pace, HR..." value="${escapeAttr(saved.notes)}" data-key="${escapeAttr(key)}" data-field="notes"></label>
      </div>
    </div>
  `;
}

function renderSupersetItem(item, segmentKey, dayIndex, segIndex, itemIndex) {
  if (/^superset/i.test(item)) {
    return `<p class="plain">${escapeHtml(item)}</p>`;
  }
  return renderTrackedMovement(item, segmentKey, dayIndex, segIndex, itemIndex + 20, item);
}

function renderListItem(item, segmentKey, dayIndex, segIndex, itemIndex) {
  if (isInstructionLine(item)) {
    return `<p class="plain instruction-line">${escapeHtml(item)}</p>`;
  }
  return renderTrackedMovement(item, segmentKey, dayIndex, segIndex, itemIndex, item);
}

function isInstructionLine(item) {
  return /^(?:\d+\s+(?:focused\s+)?rounds?|rest|nasal|keep it|quality|move well|easy|smooth)/i.test(String(item).trim());
}

function renderMetconMove(rawMovement, segmentKey, dayIndex, segIndex, movementIndex) {
  const base = cleanMovementName(rawMovement);
  const category = categoryForMovement(base);
  const movementId = `${category}.${slug(base)}`;
  const instanceKey = `fit.swap.instance.${PLAN_KEY}.w${state.week}.d${dayIndex}.s${segIndex}.m${movementIndex}`;
  const blockKey = `fit.swap.block.${PLAN_KEY}.b${getWeekBlock(state.week)}.${movementId}`;
  const blockSwap = localStorage.getItem(blockKey);
  const instanceSwap = localStorage.getItem(instanceKey);
  const activeMovement = blockSwap || instanceSwap || base;
  const options = optionsForCategory(category, base);
  const optionList = options.includes(activeMovement) ? options : [activeMovement, ...options];
  const descriptor = cleanDescriptor(rawMovement, base);

  return `
    <div class="metcon-move">
      <div>
        <p class="plain movement-name">${escapeHtml(activeMovement)}</p>
        ${descriptor ? `<p class="movement-prescription">${escapeHtml(descriptor)}</p>` : ""}
      </div>
      <div class="movement-tools compact-tools">
        <label>
          <span>Swap</span>
          <select class="swap-select" data-instance-key="${escapeAttr(instanceKey)}">
            <option value="">Original: ${escapeHtml(base)}</option>
            ${optionList.map((option) => `<option value="${escapeAttr(option)}" ${option === activeMovement && option !== base ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
          </select>
        </label>
        <label class="persist-choice">
          <input class="block-swap" type="checkbox" data-block-key="${escapeAttr(blockKey)}" ${blockSwap ? "checked" : ""}>
          Keep for block
        </label>
      </div>
    </div>
  `;
}

function renderMetconTracking(mc, key, dayIndex, segIndex) {
  const saved = normalizeMetconEntry(readJson(`fit.metcon.${key}`, {}));
  const isAmrap = /amrap/i.test(mc.format);
  const loadRows = mc.moves.map((move, moveIndex) => {
    const base = cleanMovementName(move);
    const category = categoryForMovement(base);
    const movementId = `${category}.${slug(base)}`;
    const instanceKey = `fit.swap.instance.${PLAN_KEY}.w${state.week}.d${dayIndex}.s${segIndex}.m${moveIndex}`;
    const blockKey = `fit.swap.block.${PLAN_KEY}.b${getWeekBlock(state.week)}.${movementId}`;
    const activeMovement = localStorage.getItem(blockKey) || localStorage.getItem(instanceKey) || base;
    const savedLoad = saved.loads[movementId]?.load || "";
    return `
      <label>
        <span>${escapeHtml(activeMovement)}</span>
        <input class="metcon-input" placeholder="Load / setup used" value="${escapeAttr(savedLoad)}" data-key="${escapeAttr(key)}" data-field="load" data-movement-id="${escapeAttr(movementId)}" data-movement="${escapeAttr(activeMovement)}">
      </label>
    `;
  }).join("");

  return `
    <div class="metcon-score">
      <div class="score-grid ${isAmrap ? "" : "time-score"}">
        ${isAmrap ? `
          <label><span>Rounds</span><input class="metcon-input" inputmode="numeric" placeholder="0" value="${escapeAttr(saved.rounds)}" data-key="${escapeAttr(key)}" data-field="rounds"></label>
          <label><span>Reps</span><input class="metcon-input" inputmode="numeric" placeholder="0" value="${escapeAttr(saved.reps)}" data-key="${escapeAttr(key)}" data-field="reps"></label>
        ` : `
          <label><span>Score / Time</span><input class="metcon-input" placeholder="12:34, cals, reps..." value="${escapeAttr(saved.time)}" data-key="${escapeAttr(key)}" data-field="time"></label>
        `}
        <label><span>Score notes</span><input class="metcon-input" placeholder="Tie-break, scale, split..." value="${escapeAttr(saved.notes)}" data-key="${escapeAttr(key)}" data-field="notes"></label>
      </div>
      <div class="metcon-loads">
        <div class="score-label">Weights / setups used</div>
        ${loadRows}
      </div>
    </div>
  `;
}

function renderTrackedMovement(rawMovement, segmentKey, dayIndex, segIndex, movementIndex, prescription) {
  const base = cleanMovementName(rawMovement);
  const category = categoryForMovement(base);
  const movementId = `${category}.${slug(base)}`;
  const instanceKey = `fit.swap.instance.${PLAN_KEY}.w${state.week}.d${dayIndex}.s${segIndex}.m${movementIndex}`;
  const blockKey = `fit.swap.block.${PLAN_KEY}.b${getWeekBlock(state.week)}.${movementId}`;
  const blockSwap = localStorage.getItem(blockKey);
  const instanceSwap = localStorage.getItem(instanceKey);
  const activeMovement = blockSwap || instanceSwap || base;
  const trackKey = `${segmentKey}.m${movementIndex}`;
  const saved = normalizeTrackEntry(readJson(`fit.track.${trackKey}`, {}));
  const options = optionsForCategory(category, base);
  const optionList = options.includes(activeMovement) ? options : [activeMovement, ...options];
  const descriptor = cleanDescriptor(rawMovement, base);
  const mode = trackingModeForMovement(category, rawMovement, prescription);
  const headings = mode === "time" ? ["Set", "Time / result", "Load", "Notes"] : ["Set", "Weight lb", "Reps", "Notes"];

  if (localStorage.getItem(`fit.hidden.${trackKey}`) === "1") {
    return `
      <div class="deleted-exercise">
        <span>${escapeHtml(activeMovement)} deleted from this workout.</span>
        <button class="restore-exercise" type="button" data-track="${escapeAttr(trackKey)}">Restore</button>
      </div>
    `;
  }

  return `
    <div class="movement-card" data-movement-id="${escapeAttr(movementId)}">
      <div class="movement-main">
        <div>
          <p class="plain movement-name">${escapeHtml(activeMovement)}</p>
          ${descriptor ? `<p class="movement-prescription">${escapeHtml(descriptor)}</p>` : ""}
        </div>
        <div class="movement-actions">
          <span class="category-pill">${escapeHtml(labelForCategory(category))}</span>
          <button class="hide-exercise" type="button" data-track="${escapeAttr(trackKey)}" aria-label="Delete ${escapeAttr(activeMovement)}">Delete</button>
        </div>
      </div>
      <div class="movement-tools">
        <label>
          <span>Swap</span>
          <select class="swap-select" data-instance-key="${escapeAttr(instanceKey)}">
            <option value="">Original: ${escapeHtml(base)}</option>
            ${optionList.map((option) => `<option value="${escapeAttr(option)}" ${option === activeMovement && option !== base ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
          </select>
        </label>
        <label class="persist-choice">
          <input class="block-swap" type="checkbox" data-block-key="${escapeAttr(blockKey)}" ${blockSwap ? "checked" : ""}>
          Keep for block
        </label>
      </div>
      <div class="set-tracker">
        <div class="set-head">
          ${headings.map((heading) => `<span>${escapeHtml(heading)}</span>`).join("")}
          <span></span>
        </div>
        ${saved.sets.map((set, setIndex) => renderSetRow(set, trackKey, movementId, activeMovement, setIndex, saved.sets.length, mode)).join("")}
        <button class="add-set" type="button" data-track="${escapeAttr(trackKey)}" data-movement-id="${escapeAttr(movementId)}" data-movement="${escapeAttr(activeMovement)}">Add set</button>
      </div>
      <p class="last-time" data-last-time="${escapeAttr(trackKey)}" data-movement-id="${escapeAttr(movementId)}"></p>
    </div>
  `;
}

function renderSetRow(set, trackKey, movementId, movement, setIndex, setCount, mode = "strength") {
  const firstField = mode === "time" ? "duration" : "weight";
  const secondField = mode === "time" ? "load" : "reps";
  const firstValue = mode === "time" ? set.duration || set.weight || "" : set.weight || set.duration || set.load || "";
  const secondValue = mode === "time" ? set.load || "" : set.reps || "";
  const firstPlaceholder = mode === "time" ? "30s, 1:00..." : "0";
  const secondPlaceholder = mode === "time" ? "Band, BW..." : "0";
  const firstMode = mode === "time" ? "text" : "decimal";
  const secondMode = mode === "time" ? "text" : "numeric";
  return `
    <div class="set-row">
      <div class="set-number">${setIndex + 1}</div>
      <input class="set-input" inputmode="${firstMode}" placeholder="${escapeAttr(firstPlaceholder)}" value="${escapeAttr(firstValue)}" data-track="${escapeAttr(trackKey)}" data-set-index="${setIndex}" data-field="${firstField}" data-movement-id="${escapeAttr(movementId)}" data-movement="${escapeAttr(movement)}" aria-label="Set ${setIndex + 1} ${mode === "time" ? "time or result" : "weight in pounds"}">
      <input class="set-input" inputmode="${secondMode}" placeholder="${escapeAttr(secondPlaceholder)}" value="${escapeAttr(secondValue)}" data-track="${escapeAttr(trackKey)}" data-set-index="${setIndex}" data-field="${secondField}" data-movement-id="${escapeAttr(movementId)}" data-movement="${escapeAttr(movement)}" aria-label="Set ${setIndex + 1} ${mode === "time" ? "load or setup" : "reps"}">
      <input class="set-input" placeholder="RPE, side..." value="${escapeAttr(set.notes || "")}" data-track="${escapeAttr(trackKey)}" data-set-index="${setIndex}" data-field="notes" data-movement-id="${escapeAttr(movementId)}" data-movement="${escapeAttr(movement)}" aria-label="Set ${setIndex + 1} notes">
      <button class="delete-set" type="button" data-track="${escapeAttr(trackKey)}" data-set-index="${setIndex}" ${setCount === 1 ? "disabled" : ""} aria-label="Delete set ${setIndex + 1}">x</button>
    </div>
  `;
}

function renderComplexTracker(rawMovement, prescription, segmentKey, dayIndex, segIndex) {
  const category = categoryForMovement(rawMovement);
  const parts = complexPartsFromPrescription(prescription);
  if (category !== "olympic" || parts.length < 2) return "";

  const trackKey = `${segmentKey}.complex`;
  const saved = normalizeComplexEntry(readJson(`fit.complex.${trackKey}`, {}), parts);
  const partsValue = parts.join("|");

  return `
    <div class="complex-tracker">
      <div class="score-label">Complex reps per set</div>
      ${parts.map((part, partIndex) => {
        const row = saved.parts[partIndex] || { name: part, reps: "", notes: "" };
        return `
          <div class="complex-row">
            <span>${escapeHtml(part)}</span>
            <input class="complex-input" inputmode="numeric" placeholder="Reps" value="${escapeAttr(row.reps || "")}" data-track="${escapeAttr(trackKey)}" data-parts="${escapeAttr(partsValue)}" data-part-index="${partIndex}" data-part-name="${escapeAttr(part)}" data-field="reps">
            <input class="complex-input" placeholder="Notes" value="${escapeAttr(row.notes || "")}" data-track="${escapeAttr(trackKey)}" data-parts="${escapeAttr(partsValue)}" data-part-index="${partIndex}" data-part-name="${escapeAttr(part)}" data-field="notes">
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderExtraExercises(dayKey, dayIndex) {
  const extras = readExtras(dayKey);
  return `
    <section class="seg extra-section">
      <div class="seg-h">
        <span class="seg-num">+</span>
        <span class="seg-name">Additional Exercises</span>
      </div>
      <div class="extra-list">
        ${extras.map((extra, extraIndex) => `
          <div class="extra-item">
            <div class="extra-editor">
              <input class="extra-name" placeholder="Exercise name" value="${escapeAttr(extra.name || "")}" data-day-key="${escapeAttr(dayKey)}" data-extra-index="${extraIndex}">
              <button class="remove-extra" type="button" data-day-key="${escapeAttr(dayKey)}" data-extra-index="${extraIndex}">Remove</button>
            </div>
            ${extra.name ? renderTrackedMovement(extra.name, `${dayKey}.extra`, dayIndex, 90, extraIndex, extra.name) : ""}
          </div>
        `).join("")}
      </div>
      <button class="add-extra" type="button" data-day-key="${escapeAttr(dayKey)}">Add exercise</button>
    </section>
  `;
}

function cleanMovementName(value) {
  return String(value)
    .replace(/^\d+\s*(?:sets?)?\s*[:x]\s*/i, "")
    .replace(/^\d+\s*[-/]\s*\d+\s*/, "")
    .replace(/^\d+\s*(rounds?:|min\s+\d+:)\s*/i, "")
    .replace(/^\d+\/\d+\s*/, "")
    .replace(/^\d+\s*(cal|m)\b\s*/i, "")
    .replace(/^\d+\s*(sec|seconds?)\b\s*/i, "")
    .replace(/^\d+s\s+/i, "")
    .replace(/^\d+\s*/, "")
    .replace(/\s*@.*$/i, "")
    .trim()
    .replace(/\s+/g, " ");
}

function cleanDescriptor(rawMovement, base) {
  const raw = String(rawMovement).trim();
  return raw === base ? "" : raw;
}

function categoryForMovement(movement) {
  const text = movement.toLowerCase();
  if (typeof ATHLETIC_EXERCISES !== "undefined") {
    const match = Object.entries(ATHLETIC_EXERCISES).find(([name]) => text.includes(name.toLowerCase()));
    if (match?.[1]?.categories?.includes("physio")) return "physio";
  }
  if (/snatch|clean|jerk|overhead squat/.test(text)) return "olympic";
  if (/hip thrust|glute|bridge|kickback|abduction|abductor|frog|reverse hyper/.test(text)) return "glute";
  if (/squat|lunge|step-up|wall ball|leg press/.test(text)) return "squat";
  if (/deadlift|rdl|hinge|pull-through|swing|hamstring|good morning|extension/.test(text)) return "hinge";
  if (/press|push-up|bench|dip|hspu|thruster|raise/.test(text)) return "press";
  if (/pull|row|curl|toes-to-bar|knee raise|muscle-up/.test(text)) return "pull";
  if (/bike|run|ski|stair|burpee|box|double|single|cal|devil|emom/.test(text)) return "conditioning";
  if (/plank|sit-up|v-up|hollow|russian|core|copenhagen|bird-dog/.test(text)) return "core";
  return "conditioning";
}

function optionsForCategory(category, original) {
  const database = typeof EXERCISE_OPTIONS === "undefined" ? {} : EXERCISE_OPTIONS;
  const options = database[category] || [];
  return [original, ...options].filter((item, index, list) => item && !isProhibitedMovement(item) && list.indexOf(item) === index);
}

function isProhibitedMovement(movement) {
  const patterns = typeof PROHIBITED_MOVEMENT_PATTERNS === "undefined" ? [] : PROHIBITED_MOVEMENT_PATTERNS;
  return patterns.some((pattern) => pattern.test(String(movement || "")));
}

function labelForCategory(category) {
  if (category === "physio") return "Physio";
  return {
    squat: "Squat",
    hinge: "Hinge",
    glute: "Glute",
    olympic: "Olympic",
    press: "Press",
    pull: "Pull",
    conditioning: "Metcon",
    core: "Core"
  }[category] || "Move";
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getProgressBackup() {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith("fit."))
    .sort()
    .reduce((backup, key) => {
      backup[key] = localStorage.getItem(key);
      return backup;
    }, {});
}

function exportProgressBackup() {
  const backup = {
    app: "ibex-fitness-app",
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: getProgressBackup()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ibex-fitness-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importProgressBackup(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const backup = JSON.parse(String(reader.result || ""));
      const entries = backup.entries && typeof backup.entries === "object" ? backup.entries : null;
      if (!entries) throw new Error("Missing backup entries.");
      const count = Object.keys(entries).filter((key) => key.startsWith("fit.")).length;
      if (!count) throw new Error("No Ibex Fitness progress was found in this file.");
      if (!confirm(`Import ${count} saved progress items from this backup? This will replace current saved progress in this browser.`)) return;
      Object.keys(localStorage)
        .filter((key) => key.startsWith("fit."))
        .forEach((key) => localStorage.removeItem(key));
      Object.entries(entries)
        .filter(([key]) => key.startsWith("fit."))
        .forEach(([key, value]) => localStorage.setItem(key, String(value)));
      state.week = Number(localStorage.getItem(`fit.week.${PLAN_KEY}`) || 0);
      state.expanded = false;
      state.search = "";
      state.openDays.clear();
      $("#searchInput").value = "";
      $("#expandBtn").textContent = "Expand all";
      render();
    } catch (error) {
      alert(`That backup could not be imported. ${error.message}`);
    }
  });
  reader.readAsText(file);
}

function blankSet() {
  return { weight: "", reps: "", duration: "", load: "", notes: "" };
}

function normalizeTrackEntry(entry) {
  const normalized = entry && typeof entry === "object" ? { ...entry } : {};
  if (Array.isArray(normalized.sets)) {
    normalized.sets = normalized.sets.length ? normalized.sets.map((set) => ({ ...blankSet(), ...set })) : [blankSet()];
    return normalized;
  }
  if (normalized.weight || normalized.reps || normalized.notes) {
    normalized.sets = [{ weight: normalized.weight || "", reps: normalized.reps || "", notes: normalized.notes || "" }];
    delete normalized.weight;
    delete normalized.reps;
    delete normalized.notes;
    return normalized;
  }
  normalized.sets = [blankSet()];
  return normalized;
}

function normalizeMetconEntry(entry) {
  const normalized = entry && typeof entry === "object" ? { ...entry } : {};
  return {
    rounds: normalized.rounds || "",
    reps: normalized.reps || "",
    time: normalized.time || "",
    notes: normalized.notes || "",
    loads: normalized.loads && typeof normalized.loads === "object" ? normalized.loads : {},
    updatedAt: normalized.updatedAt || ""
  };
}

function normalizeComplexEntry(entry, partSource) {
  const parts = Array.isArray(partSource) ? partSource : String(partSource || "").split("|").filter(Boolean);
  const normalized = entry && typeof entry === "object" ? { ...entry } : {};
  const savedParts = Array.isArray(normalized.parts) ? normalized.parts : [];
  return {
    parts: parts.map((name, index) => ({
      name,
      reps: savedParts[index]?.reps || "",
      notes: savedParts[index]?.notes || ""
    })),
    updatedAt: normalized.updatedAt || ""
  };
}

function readExtras(dayKey) {
  const extras = readJson(`fit.extra.${dayKey}`, []);
  return Array.isArray(extras) ? extras.map((item) => ({ name: item.name || "" })) : [];
}

function writeExtras(dayKey, extras) {
  writeJson(`fit.extra.${dayKey}`, extras);
}

function complexPartsFromPrescription(prescription) {
  const text = String(prescription || "");
  if (!text.includes("+")) return [];
  const withoutLoad = text.replace(/\s*@.*$/i, "");
  const afterColon = withoutLoad.includes(":") ? withoutLoad.split(":").slice(1).join(":") : withoutLoad;
  return afterColon
    .split("+")
    .map((part) => part.replace(/^\s*\d+\s*x\s*\d+\s*/i, "").replace(/^\s*\d+\s*(?:x|sets?:)?\s*/i, "").trim())
    .map((part) => part.replace(/\bOHS\b/i, "Overhead squat"))
    .filter(Boolean);
}

function trackingModeForMovement(category, rawMovement, prescription) {
  const text = `${rawMovement || ""} ${prescription || ""}`.toLowerCase();
  if (category === "olympic") return "strength";
  if (category === "core") return "time";
  if (/plank|hold|hollow|copenhagen|bird-dog|mobility|stretch/.test(text)) return "time";
  if (/\b\d+\s*(s|sec|seconds?|min|minutes?)\b/.test(text)) return "time";
  return "strength";
}

function findLastEntry(movementId, trackKey) {
  const currentWeek = Number(trackKey.match(/^w(\d+)/)?.[1] || state.week);
  return Object.keys(localStorage)
    .filter((key) => key.startsWith("fit.track."))
    .map((key) => ({ key, value: readJson(key, null) }))
    .filter((entry) => entry.value && entry.value.movementId === movementId)
    .filter((entry) => entry.key !== `fit.track.${trackKey}`)
    .map((entry) => ({
      ...entry,
      week: Number(entry.key.match(/fit\.track\.w(\d+)/)?.[1] || -1)
    }))
    .filter((entry) => !entry.key.includes(`.${PLAN_KEY}.`) || entry.week < currentWeek)
    .sort((a, b) => b.week - a.week || String(b.value.updatedAt || "").localeCompare(String(a.value.updatedAt || "")))[0];
}

function updateLastTimePanels() {
  $$("[data-last-time]").forEach((panel) => {
    const last = findLastEntry(panel.dataset.movementId, panel.dataset.lastTime);
    const entry = last ? normalizeTrackEntry(last.value) : null;
    const completedSets = entry ? entry.sets.filter((set) => set.weight || set.reps || set.duration || set.load || set.notes) : [];
    if (!last || !completedSets.length) {
      panel.textContent = "Last time: no previous entry";
      return;
    }
    const summary = completedSets
      .map((set, index) => {
        const parts = [];
        if (set.weight) parts.push(`${set.weight} lb`);
        if (set.reps) parts.push(`${set.reps} reps`);
        if (set.duration) parts.push(set.duration);
        if (set.load) parts.push(set.load);
        if (set.notes) parts.push(set.notes);
        return `S${index + 1} ${parts.join(" / ")}`;
      })
      .join("; ");
    panel.textContent = `Last time, week ${last.week + 1}: ${summary}`;
  });
}

function showScreen(screen) {
  const valid = ["today", "week", "progress", "library", "settings"];
  state.screen = valid.includes(screen) ? screen : "today";
  localStorage.setItem("fit.ui.screen", state.screen);
  $$(".app-screen").forEach((element) => element.classList.toggle("active", element.dataset.screen === state.screen));
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.screenTarget === state.screen));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function todayAssignment(days) {
  if (PLAN_KEY === HYBRID_PLAN_KEY) {
    const start = startOfLocalDay(new Date(`${HYBRID_START_DATE}T00:00:00`));
    const elapsedDays = Math.max(0, Math.floor((startOfLocalDay(new Date()) - start) / 86400000));
    return { index: elapsedDays % 7, day: days[elapsedDays % 7] || days[0] };
  }
  const index = days.findIndex((day, dayIndex) => localStorage.getItem(`fit.done.w${state.week}.${PLAN_KEY}.${day.id || `d${dayIndex}`}`) !== "1");
  return { index: index < 0 ? 0 : index, day: days[index < 0 ? 0 : index] };
}

function renderToday() {
  const root = $("#todayCard");
  if (!root) return;
  const days = buildWeek(state.week);
  const assignment = todayAssignment(days);
  const day = assignment.day;
  if (!day) return;
  const targets = targetsForDay(day);
  const dayKey = `w${state.week}.${PLAN_KEY}.${day.id}`;
  const done = localStorage.getItem(`fit.done.${dayKey}`) === "1";
  root.innerHTML = `<div class="today-date"><p class="kicker">${new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</p><span>Week ${state.week + 1}</span></div>
    <div class="today-main"><span class="today-tag">${escapeHtml(day.tag)}</span><div><h2>${escapeHtml(day.title)}</h2><p>${escapeHtml(day.focus)}</p></div></div>
    <div class="today-meta"><span>${day.duration || 0} min</span><span>${day.segments.length} sections</span><span>${done ? "Completed" : "Ready"}</span></div>
    <div class="day-targets">${targets.slice(0,8).map((target)=>`<span>${escapeHtml(WEEKLY_TARGETS[target]?.label || target)}</span>`).join("")}</div>
    <button class="today-start" type="button" data-today-day="${assignment.index}">${done ? "Review workout" : "Open workout"}</button>`;
  $("[data-today-day]", root)?.addEventListener("click", () => {
    state.openDays.add(dayKey);
    showScreen("week");
    const card = $(`[data-day-key="${dayKey}"]`);
    card?.classList.add("open");
    card?.scrollIntoView({ behavior:"smooth", block:"start" });
  });
}

function renderProgressScreen() {
  const root = $("#progressSummary");
  if (!root) return;
  const counts = targetCounts(buildWeek(state.week));
  const tracked = Object.keys(localStorage).filter((key)=>key.startsWith("fit.track.")).length;
  const completed = Object.keys(localStorage).filter((key)=>key.startsWith("fit.done.") && localStorage.getItem(key)==="1").length;
  root.innerHTML = `<div class="progress-hero"><div><b>${completed}</b><span>workouts completed</span></div><div><b>${tracked}</b><span>exercise logs</span></div><div><b>${counts.completed.metcon || 0}</b><span>finishers this week</span></div></div>
    <div class="progress-categories">${["Strength & load","Bodybuilding volume","Olympic technique","Strict gymnastics","Jumps & sprint","Conditioning","Physio"].map((label)=>`<article><h3>${label}</h3><p>Your saved sets, repetitions, loads and notes remain connected across blocks.</p></article>`).join("")}</div>`;
}

function renderLibrary(query = "") {
  const root = $("#libraryList");
  if (!root) return;
  const database = typeof EXERCISE_OPTIONS === "undefined" ? {} : EXERCISE_OPTIONS;
  const rows = Object.entries(database).flatMap(([category, exercises]) => exercises.map((name)=>({name,category})))
    .filter((row,index,list)=>list.findIndex((item)=>item.name===row.name)===index)
    .filter((row)=>!isProhibitedMovement(row.name))
    .filter((row)=>`${row.name} ${row.category}`.toLowerCase().includes(String(query).toLowerCase()));
  root.innerHTML = rows.slice(0,100).map((row)=>`<article><div><h3>${escapeHtml(row.name)}</h3><span>${escapeHtml(labelForCategory(row.category))}</span></div><button type="button" title="Use Replace inside a workout to select this movement">Available</button></article>`).join("");
}

function renderSettings() {
  const root = $("#blockStatus");
  if (!root) return;
  const active = PLAN_KEY === HYBRID_PLAN_KEY;
  root.innerHTML = `<h3>${active ? "Hybrid block active" : "Hybrid block scheduled"}</h3><p>${active ? `Week ${state.week + 1} of 8` : `Starts Monday, ${new Date(`${HYBRID_START_DATE}T00:00:00`).toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"})}. Your current week remains unchanged.`}</p><p class="fineprint">All data stays in this browser and remains included in JSON backups.</p>`;
}

function labelForType(type) {
  if (type === "g") return "Glute - Full Body";
  if (type === "c") return "Full Body - Conditioning";
  return "Recovery";
}

function applySearch() {
  const query = state.search.trim().toLowerCase();
  $$(".day").forEach((day) => {
    day.classList.toggle("hidden", Boolean(query) && !day.dataset.search.includes(query));
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

$("#expandBtn").addEventListener("click", () => {
  state.expanded = !state.expanded;
  if (!state.expanded) state.openDays.clear();
  $("#expandBtn").textContent = state.expanded ? "Collapse all" : "Expand all";
  $$(".day").forEach((day) => day.classList.toggle("open", state.expanded));
});

$("#exportBtn").addEventListener("click", exportProgressBackup);

$("#importBtn").addEventListener("click", () => {
  $("#importFile").click();
});

$("#importFile").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (file) importProgressBackup(file);
  event.target.value = "";
});

$("#resetBtn").addEventListener("click", () => {
  if (!confirm("Reset all saved progress in this browser? Export a backup first if you want to keep it.")) return;
  Object.keys(localStorage)
    .filter((key) => key.startsWith("fit."))
    .forEach((key) => localStorage.removeItem(key));
  state.week = 0;
  state.expanded = false;
  state.search = "";
  state.openDays.clear();
  $("#searchInput").value = "";
  $("#expandBtn").textContent = "Expand all";
  render();
});

$("#searchInput").addEventListener("input", (event) => {
  state.search = event.target.value;
  applySearch();
});

$$(".nav-item").forEach((button) => button.addEventListener("click", () => showScreen(button.dataset.screenTarget)));

$("#librarySearch")?.addEventListener("input", (event) => renderLibrary(event.target.value));
$("#settingsExportBtn")?.addEventListener("click", exportProgressBackup);
$("#settingsImportBtn")?.addEventListener("click", () => $("#importFile").click());
$("#settingsResetBtn")?.addEventListener("click", () => $("#resetBtn").click());

async function initApp() {
  await loadServerProgress();
  render();
  setSyncStatus(progressSync.status);
}

initApp();
