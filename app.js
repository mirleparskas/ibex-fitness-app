const state = {
  week: Number(localStorage.getItem("fit.week") || 0),
  expanded: false,
  search: "",
  openDays: new Set()
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function getWeekBlock(weekIndex) {
  return weekIndex < 4 ? 0 : 1;
}

function pick(items, weekIndex) {
  return items[weekIndex] || items[weekIndex % items.length];
}

function buildWeek(weekIndex) {
  const p = PROGRAM.progressions;
  const a = PROGRAM.accessories;
  const m = PROGRAM.metcons;
  const deadliftPrimary = getWeekBlock(weekIndex) === 1;

  return [
    {
      type: "g",
      tag: "G1",
      title: "Glute Full-Body - Hip Hinge",
      focus: "Hip thrust primary - vertical pull",
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.glute),
        liftSeg("1", "Primary - Hip Thrust", "Barbell hip thrust", p.hipThrust[weekIndex], a.upperPull, weekIndex === 2 || weekIndex === 6 ? "Backoff set: stop 1-2 reps before form breaks." : "Full lockout, ribs down, one-second squeeze every rep."),
        listSeg("2", "Secondary Strength", ["3x10 Romanian deadlift", "3x12 walking lunges"]),
        listSeg("3", "Glute Hypertrophy", a.gluteA),
        listSeg("4", "Core Finisher", a.core)
      ]
    },
    {
      type: "c",
      tag: "C1",
      title: "Olympic - Snatch + Metcon",
      focus: `Snatch progression - ${pick(m.snatch, weekIndex).format}`,
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.crossfit),
        liftSeg("1", "Skill - Snatch", "Snatch complex", p.snatch[weekIndex], null, "Speed under the bar matters more than load."),
        metconSeg("2", "Metcon", pick(m.snatch, weekIndex)),
        listSeg("3", "Accessory", a.arms)
      ]
    },
    {
      type: "g",
      tag: "G2",
      title: "Glute Full-Body - Squat",
      focus: "Back squat primary - horizontal press",
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.glute),
        liftSeg("1", "Primary - Back Squat", "Back squat", p.backSquat[weekIndex], a.upperPush, weekIndex === 2 || weekIndex === 6 ? "Backoff AMRAP: brace hard and stop one rep shy of failure." : "Below parallel, knees out, brace before every rep."),
        listSeg("2", "Secondary Strength", ["3x10 hip thrusts", "3x12/12 reverse lunges"]),
        listSeg("3", "Glute Hypertrophy", a.gluteB),
        listSeg("4", "Pump Finisher", a.pump)
      ]
    },
    {
      type: "c",
      tag: "C2",
      title: "Olympic - Clean & Jerk + Metcon",
      focus: `Clean & jerk progression - ${pick(m.cleanJerk, weekIndex).format}`,
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.crossfit),
        liftSeg("1", "Skill - Clean & Jerk", "Clean & jerk complex", p.cleanJerk[weekIndex], null, "Fast elbows, strong front rack, no ugly jerks."),
        metconSeg("2", "Metcon", pick(m.cleanJerk, weekIndex)),
        listSeg("3", "Engine", a.engine)
      ]
    },
    {
      type: "g",
      tag: "G3",
      title: "Glute Full-Body - Pull",
      focus: `${deadliftPrimary ? "Deadlift" : "RDL"} primary - overhead press`,
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.glute),
        liftSeg("1", `Primary - ${deadliftPrimary ? "Deadlift" : "Romanian Deadlift"}`, deadliftPrimary ? "Conventional deadlift" : "Romanian deadlift", deadliftPrimary ? p.deadlift[weekIndex] : p.rdl[weekIndex], a.overhead, deadliftPrimary ? "Wedge in, push the floor away, reset any rep that drifts." : "Hips back, bar close, feel the hamstrings load."),
        listSeg("2", "Secondary Strength", ["4x12 barbell hip thrusts", "3x12 cable pull-throughs"]),
        listSeg("3", "Posterior Accessory", a.gluteC),
        listSeg("4", "Core Finisher", a.core)
      ]
    },
    {
      type: "c",
      tag: "C3",
      title: "Strength + Long Metcon",
      focus: `Push press - ${pick(m.long, weekIndex).format}`,
      segments: [
        textSeg("WU", "Warm-up", PROGRAM.warmups.crossfit),
        liftSeg("1", "Strength - Push Press", "Push press", p.pushPress[weekIndex], null, "Vertical dip-drive, finish tall, lock out before lowering."),
        metconSeg("2", "Metcon", pick(m.long, weekIndex)),
        listSeg("3", "Accessory", a.core)
      ]
    },
    {
      type: "r",
      tag: "R",
      title: "Rest / Active Recovery",
      focus: "Walk - mobility - easy Zone 2",
      segments: [
        textSeg("-", "Optional", "20-40 min easy walk or bike. Add 10-15 min hips, ankles, and T-spine mobility. Eat enough protein and sleep.")
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

function render() {
  localStorage.setItem("fit.week", String(state.week));
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
    const key = `w${state.week}.d${dayIndex}`;
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
  return /^(?:\d+\s+rounds?|rest|nasal|keep it|quality|move well|easy|smooth)/i.test(String(item).trim());
}

function renderMetconMove(rawMovement, segmentKey, dayIndex, segIndex, movementIndex) {
  const base = cleanMovementName(rawMovement);
  const category = categoryForMovement(base);
  const movementId = `${category}.${slug(base)}`;
  const instanceKey = `fit.swap.instance.w${state.week}.d${dayIndex}.s${segIndex}.m${movementIndex}`;
  const blockKey = `fit.swap.block.b${getWeekBlock(state.week)}.${movementId}`;
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
    const instanceKey = `fit.swap.instance.w${state.week}.d${dayIndex}.s${segIndex}.m${moveIndex}`;
    const blockKey = `fit.swap.block.b${getWeekBlock(state.week)}.${movementId}`;
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
  const instanceKey = `fit.swap.instance.w${state.week}.d${dayIndex}.s${segIndex}.m${movementIndex}`;
  const blockKey = `fit.swap.block.b${getWeekBlock(state.week)}.${movementId}`;
  const blockSwap = localStorage.getItem(blockKey);
  const instanceSwap = localStorage.getItem(instanceKey);
  const activeMovement = blockSwap || instanceSwap || base;
  const trackKey = `w${state.week}.d${dayIndex}.s${segIndex}.m${movementIndex}`;
  const saved = normalizeTrackEntry(readJson(`fit.track.${trackKey}`, {}));
  const options = optionsForCategory(category, base);
  const optionList = options.includes(activeMovement) ? options : [activeMovement, ...options];
  const descriptor = cleanDescriptor(rawMovement, base);
  const mode = trackingModeForMovement(category, rawMovement, prescription);
  const headings = mode === "time" ? ["Set", "Time / result", "Load", "Notes"] : ["Set", "Weight lb", "Reps", "Notes"];

  return `
    <div class="movement-card" data-movement-id="${escapeAttr(movementId)}">
      <div class="movement-main">
        <div>
          <p class="plain movement-name">${escapeHtml(activeMovement)}</p>
          ${descriptor ? `<p class="movement-prescription">${escapeHtml(descriptor)}</p>` : ""}
        </div>
        <span class="category-pill">${escapeHtml(labelForCategory(category))}</span>
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
  if (/bike|row|run|ski|burpee|box|double|single|cal|devil/.test(text)) return "conditioning";
  if (/press|push-up|bench|dip|hspu|thruster/.test(text)) return "press";
  if (/pull|row|curl|toes-to-bar|knee raise|muscle-up/.test(text)) return "pull";
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
      state.week = Number(localStorage.getItem("fit.week") || 0);
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

function readExtras(dayKey) {
  const extras = readJson(`fit.extra.${dayKey}`, []);
  return Array.isArray(extras) ? extras.map((item) => ({ name: item.name || "" })) : [];
}

function writeExtras(dayKey, extras) {
  writeJson(`fit.extra.${dayKey}`, extras);
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
  if (type === "c") return "CrossFit - Olympic";
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

render();
