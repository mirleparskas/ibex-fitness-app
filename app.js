const state = {
  week: Number(localStorage.getItem("fit.week") || 0),
  expanded: false,
  search: ""
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
  const list = $("#dayList");
  list.innerHTML = "";
  buildWeek(state.week).forEach((day, dayIndex) => {
    const key = `w${state.week}.d${dayIndex}`;
    const card = document.createElement("article");
    card.className = `day${state.expanded ? " open" : ""}`;
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
        ${day.segments.map((segment, segIndex) => renderSegment(segment, `${key}.s${segIndex}`)).join("")}
        <textarea class="notes" data-note="${key}" placeholder="Session notes...">${escapeHtml(localStorage.getItem(`fit.note.${key}`) || "")}</textarea>
      </div>
    `;

    $(".day-head", card).addEventListener("click", (event) => {
      if (event.target.matches("input")) return;
      card.classList.toggle("open");
    });
    $(".day-head", card).addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.classList.toggle("open");
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
      renderDays();
      applySearch();
    });
  });
}

function renderSegment(segment, key) {
  let body = "";

  if (segment.kind === "text") {
    body = `<p class="plain">${escapeHtml(segment.text)}</p>`;
  }

  if (segment.kind === "lift") {
    body = `
      <div class="rx-line">${escapeHtml(segment.prescription)}</div>
      <p class="plain">${escapeHtml(segment.movement)}</p>
      ${segment.superset ? `<div class="superset">${segment.superset.map((item) => `<p class="plain">${escapeHtml(item)}</p>`).join("")}</div>` : ""}
      <div class="goal"><b>Goal</b><span>${escapeHtml(segment.goal)}</span></div>
    `;
  }

  if (segment.kind === "list") {
    body = `<ul class="movement-list">${segment.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  if (segment.kind === "metcon") {
    const selected = localStorage.getItem(`fit.tier.${key}`) || "L2";
    const mc = segment.metcon;
    body = `
      <div class="metcon">
        <div class="metcon-title">${escapeHtml(mc.format)}</div>
        <ul class="movement-list">${mc.moves.map((move) => `<li>${escapeHtml(move)}</li>`).join("")}</ul>
        <div class="tiers">
          ${["L1", "L2", "L3"].map((tier) => `<button class="tier ${tier === selected ? "active" : ""}" type="button" data-key="${key}" data-tier="${tier}">${tier} ${tier === "L1" ? "Scaled" : tier === "L2" ? "Rx" : "Rx+"}</button>`).join("")}
        </div>
        <p class="loads"><b>${selected}:</b> ${escapeHtml(mc.tiers[selected])}</p>
        <span class="cap">${escapeHtml(mc.cap)}</span>
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

$("#expandBtn").addEventListener("click", () => {
  state.expanded = !state.expanded;
  $("#expandBtn").textContent = state.expanded ? "Collapse all" : "Expand all";
  $$(".day").forEach((day) => day.classList.toggle("open", state.expanded));
});

$("#resetBtn").addEventListener("click", () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith("fit."))
    .forEach((key) => localStorage.removeItem(key));
  state.week = 0;
  state.expanded = false;
  state.search = "";
  $("#searchInput").value = "";
  $("#expandBtn").textContent = "Expand all";
  render();
});

$("#searchInput").addEventListener("input", (event) => {
  state.search = event.target.value;
  applySearch();
});

render();
