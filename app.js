const PLAN_KEY = "glute-recomp-v4";

const state = {
  week: Number(localStorage.getItem(`fit.week.${PLAN_KEY}`) || 0),
  expanded: false,
  search: "",
  openDays: new Set()
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
  if (weekIndex < 3) return 0;
  if (weekIndex === 3) return 1;
  if (weekIndex < 7) return 2;
  return 3;
}

function pick(items, weekIndex) {
  return items[weekIndex] || items[weekIndex % items.length];
}

function pickDailyCardio(weekIndex, dayIndex) {
  const options = PROGRAM.cardio?.daily || [];
  return options.length ? options[dayIndex % options.length] : null;
}

function buildWeek(weekIndex) {
  const p = PROGRAM.progressions;
  const a = PROGRAM.accessories;
  const v = PROGRAM.weekVariations;
  const thrust = pick(v.thrust, weekIndex);
  const squat = pick(v.squat, weekIndex);
  const hinge = pick(v.hinge, weekIndex);
  const upper = pick(v.upper, weekIndex);
  const pump = pick(v.pump, weekIndex);
  const trunk = pick(v.trunk, weekIndex);

  return [
    {
      type: "g",
      tag: "G1",
      title: "Glute Build - Hip Thrust Strength",
      focus: "Glute priority lifting first, with weekly thrust variations and low-impact cardio",
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.glute),
        liftSeg("1", "Primary Glute Strength", thrust.movement, p.hipThrust[weekIndex], a.upperPull, "Add load or reps only when every rep locks out cleanly with a hard one-second squeeze."),
        listSeg("2", "Glute Builder", thrust.builder),
        listSeg("3", "Core", a.coreA),
        cardioSeg("4", "Cardio After Lifting", pickDailyCardio(weekIndex, 0))
      ]
    },
    {
      type: "c",
      tag: "F1",
      title: "CrossFit Strength - Cleans + Gymnastics",
      focus: "Clean skill, T2B practice, upper-body balance, and hard conditioning",
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.crossfit),
        liftSeg("1", "Clean Progression", "Power clean", p.clean[weekIndex], null, "Technique first: fast elbows, quiet feet, and no missed reps while rebuilding."),
        listSeg("2", "Gymnastics + Pull", ["4 sets: 5-10 toes-to-bar or hanging knee raises", "3x8-10 strict pull-up, assisted pull-up, or lat pulldown", "3x10-12 chest-supported row"]),
        cardioSeg("3", "Clean / T2B Conditioning", pickDailyCardio(weekIndex, 1))
      ]
    },
    {
      type: "g",
      tag: "G2",
      title: "Glute Build - Squat + Shape",
      focus: "Squat or lunge pattern for glutes, quads, and lower-body shape",
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.glute),
        liftSeg("1", "Primary Lower Lift", squat.movement, p.squatPattern[weekIndex], ["Superset with the main lift", "3x10-12 face pulls", "3x12 standing calf raises"], "Use the weekly variation that lets you load legs hard while keeping depth and control."),
        listSeg("2", "Glute / Quad Hypertrophy", squat.builder),
        listSeg("3", "Pump Finish", ["2 rounds, rest 60s between rounds", "20 banded lateral walks/side", "15 seated hip abductions"]),
        cardioSeg("4", "Incline / Stair Cardio", pickDailyCardio(weekIndex, 2))
      ]
    },
    {
      type: "c",
      tag: "F2",
      title: "Upper Bodybuilding + Push Press",
      focus: "Shoulders, back, chest, arms, and CrossFit-style pressing stamina",
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.fullBody),
        liftSeg("1", "Primary Upper Lift", upper.movement, p.bench[weekIndex], null, "Stop 1-2 reps before form breaks. Strong presses build shape without needing maximal barbell work."),
        liftSeg("2", "Push Press Progression", "Push press", p.pushPress[weekIndex], null, "Drive with the legs, finish tall, and keep reps crisp."),
        listSeg("3", "Upper Hypertrophy", upper.builder),
        cardioSeg("4", "Push Press EMOM", pickDailyCardio(weekIndex, 3))
      ]
    },
    {
      type: "g",
      tag: "G3",
      title: "Glute Build - Posterior Chain",
      focus: "Hamstrings, glutes, back line, and controlled low-impact cardio",
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.glute),
        liftSeg("1", "Primary Hinge", hinge.movement, p.rdl[weekIndex], a.overhead, "Own the lowering phase and feel hamstrings stretch. Do not chase load at the expense of position."),
        listSeg("2", "Glute / Hamstring Volume", hinge.builder),
        listSeg("3", "Core", a.coreB),
        cardioSeg("4", "Machine Cardio", pickDailyCardio(weekIndex, 4))
      ]
    },
    {
      type: "c",
      tag: "F3",
      title: "Mixed Modal Conditioning + Pump",
      focus: "Different CrossFit-style conditioning, arms/shoulders, trunk, and a small glute finisher",
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.fullBody),
        listSeg("1", "Bodybuilding Pump", pump),
        listSeg("2", "Trunk Skill", trunk),
        listSeg("3", "Glute Finisher", ["2 rounds", "15 cable kickbacks/side", "20 banded lateral walks/side"]),
        cardioSeg("4", "HIIT / Mixed Modal", pickDailyCardio(weekIndex, 5))
      ]
    },
    {
      type: "r",
      tag: "R",
      title: "Rest / Active Recovery",
      focus: "30-45 min easy cardio - mobility - recovery",
      segments: [
        cardioSeg("1", "Daily Cardio", pickDailyCardio(weekIndex, 6)),
        textSeg("2", "Recovery", "Add 10-15 min hips, ankles, and T-spine mobility. Eat enough protein and sleep.")
      ]
    }
  ];
}

function textSeg(num, name, text) {
  return { kind: "text", num, name, text };
}

function liftSeg(num, name, movement, prescription, superset, goal) {
  return { kind: "lift", num, name, movement, prescription, superset, goal };
}

function listSeg(num, name, items) {
  return { kind: "list", num, name, items };
}

function metconSeg(num, name, metcon) {
  return { kind: "metcon", num, name, metcon };
}

function cardioSeg(num, name, cardio) {
  return { kind: "cardio", num, name, cardio };
}

function render() {
  localStorage.setItem(`fit.week.${PLAN_KEY}`, String(state.week));
  renderTabs();
  renderBanner();
  renderDays();
  applySearch();
}

function renderTabs() {
  const tabs = $("#weekTabs");
  tabs.innerHTML = "";

  for (let i = 0; i < 8; i += 1) {
    const button = document.createElement("button");
    const test = i === 3 || i === 7;
    button.className = `week-tab${i === state.week ? " active" : ""}${test ? " test" : ""}`;
    button.type = "button";
    button.innerHTML = `<small>${test ? "Test" : "Week"}</small><b>${i + 1}</b>`;
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
  buildWeek(state.week).forEach((day, dayIndex) => {
    const key = `w${state.week}.${PLAN_KEY}.d${dayIndex}`;
    const isOpen = state.expanded || state.openDays.has(key);
    const card = document.createElement("article");
    card.className = `day${isOpen ? " open" : ""}`;
    card.dataset.dayKey = key;
    card.dataset.search = JSON.stringify(day).toLowerCase();
    card.innerHTML = `
      <div class="day-head" role="button" tabindex="0">
        <div class="tag ${day.type}">${escapeHtml(day.tag)}</div>
        <div>
          <div class="day-type">Day ${dayIndex + 1} - ${labelForType(day.type)}</div>
          <div class="day-title">${escapeHtml(day.title)}</div>
          <div class="day-focus">${escapeHtml(day.focus)}</div>
        </div>
        <label class="done" title="Mark complete">
          <input type="checkbox" data-done="${key}" ${localStorage.getItem(`fit.done.${key}`) === "1" ? "checked" : ""}>
          Done
        </label>
        <div class="chev">v</div>
      </div>
      <div class="day-body">
        ${day.segments.map((segment, segIndex) => renderSegment(segment, `${key}.s${segIndex}`, dayIndex, segIndex)).join("")}
        ${renderExtraExercises(key, dayIndex)}
        <textarea class="notes" data-note="${key}" placeholder="Session notes...">${escapeHtml(localStorage.getItem(`fit.note.${key}`) || "")}</textarea>
      </div>
    `;

    $(".day-head", card).addEventListener("click", (event) => {
      if (event.target.matches("input")) return;
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

  $$("[data-done]").forEach((box) => {
    box.addEventListener("change", () => {
      localStorage.setItem(`fit.done.${box.dataset.done}`, box.checked ? "1" : "0");
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

  $$(".extra-name").forEach((input) => {
    input.addEventListener("input", () => {
      const extras = readExtras(input.dataset.dayKey);
      const item = extras[Number(input.dataset.extraIndex)];
      if (!item) return;
      item.name = input.value;
      writeExtras(input.dataset.dayKey, extras);
    });
    input.addEventListener("change", () => {
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

function captureOpenDays() {
  $$(".day.open").forEach((day) => {
    if (day.dataset.dayKey) state.openDays.add(day.dataset.dayKey);
  });
}

function renderSegment(segment, key, dayIndex, segIndex) {
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

  if (segment.kind === "metcon") {
    const selected = localStorage.getItem(`fit.tier.${key}`) || "L2";
    const mc = segment.metcon;
    body = `
      <div class="metcon">
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
        <span class="cap">Daily target: 30-45 minutes</span>
        ${renderCardioTracking(key)}
        <div class="goal"><b>Goal</b><span>${escapeHtml(cardio.goal)}</span></div>
      </div>
    `;
  }

  return `
    <section class="seg">
      <div class="seg-h">
        <span class="seg-num">${escapeHtml(segment.num)}</span>
        <span class="seg-name">${escapeHtml(segment.name)}</span>
      </div>
      ${body}
    </section>
  `;
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
  const firstValue = mode === "time" ? set.duration || set.weight || "" : set.weight || "";
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
  if (/snatch|clean|jerk|overhead squat/.test(text)) return "olympic";
  if (/hip thrust|glute|bridge|kickback|abduction|frog|reverse hyper/.test(text)) return "glute";
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
  return [original, ...options].filter((item, index, list) => item && list.indexOf(item) === index);
}

function labelForCategory(category) {
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
    .filter((entry) => entry.week < currentWeek)
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

async function initApp() {
  await loadServerProgress();
  render();
  setSyncStatus(progressSync.status);
}

initApp();
