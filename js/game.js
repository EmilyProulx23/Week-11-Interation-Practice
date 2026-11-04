// The Archive — Day 1 prototype engine.
(function () {
  "use strict";

  const D = window.GAME_DATA;
  const SAVE_KEY = "the-archive-save-v1";
  const DEBUG = /[?&]debug=1/.test(location.search);
  const DOC_ORDER = ["fair", "letter", "photo"];

  const $app = document.getElementById("app");
  const $modal = document.getElementById("modal");
  const $toast = document.getElementById("toast");

  // ---------- state ----------
  function freshState() {
    const docs = {};
    DOC_ORDER.forEach((id) => (docs[id] = { status: "unreceived", step: "examine", desc: null, circ: null }));
    return {
      v: 1, scene: "title", day: 1, room: "desk", time: D.dayStart,
      stats: { truth: 0, compliance: 0, memory: 0 },
      flags: {}, docs, clues: [], seen: [], summaries: [], notes: [],
      theo: null, digest: 0
    };
  }

  let S = freshState();
  const ui = { magnify: false, stacksView: "archivist", modal: null };

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ }
  }
  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      return s && s.v === 1 ? s : null;
    } catch (e) { return null; }
  }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

  // ---------- helpers ----------
  const has = (arr, x) => arr.indexOf(x) !== -1;
  const req = (r) => (r == null ? [] : Array.isArray(r) ? r : [r]);

  function fx(effects) {
    if (!effects) return;
    for (const k in effects) S.stats[k] = (S.stats[k] || 0) + effects[k];
  }
  function spend(min) { S.time = Math.min(D.dayEnd, S.time + min); }
  function clock(t) {
    const h = Math.floor(t / 60), m = t % 60;
    const h12 = ((h + 11) % 12) + 1;
    return h12 + ":" + String(m).padStart(2, "0") + (h < 12 ? " am" : " pm");
  }
  function toast(msg) {
    $toast.textContent = msg;
    $toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => $toast.classList.remove("show"), 2600);
  }

  function renderOriginal(id, interactive) {
    const doc = D.docs[id];
    return doc.original.map((block) =>
      block.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (m, clue, text) => {
        if (!interactive) return text;
        const found = has(S.clues, clue) ? " found" : "";
        return `<span class="hot${found}" data-act="clue" data-arg="${clue}" data-doc="${id}">${text}</span>`;
      })
    ).join("");
  }

  function addClue(docId, clue) {
    if (has(S.clues, clue)) return;
    S.clues.push(clue);
    fx({ truth: 1 });
    toast("🔍 Noted: " + D.docs[docId].clues[clue]);
    checkDiscrepancies();
  }
  function markSeen(id) { if (!has(S.seen, id)) { S.seen.push(id); checkDiscrepancies(); } }
  function markSummary(id) { if (!has(S.summaries, id)) { S.summaries.push(id); checkDiscrepancies(); } }

  function checkDiscrepancies() {
    D.discrepancies.forEach((d) => {
      if (has(S.notes, d.id)) return;
      const n = d.needs;
      const ok = (n.clues || []).every((c) => has(S.clues, c)) &&
                 (n.seen || []).every((c) => has(S.seen, c)) &&
                 (n.summaries || []).every((c) => has(S.summaries, c));
      if (ok) {
        S.notes.push(d.id);
        fx({ truth: 1 });
        setTimeout(() => toast("📓 Something doesn't line up. New note in your notebook."), 900);
      }
    });
  }

  const inbox = () => DOC_ORDER.filter((id) => S.docs[id].status === "inbox");
  const filed = () => DOC_ORDER.filter((id) => S.docs[id].status === "kept" || S.docs[id].status === "discarded");
  const publicDocs = () => DOC_ORDER.filter((id) => S.docs[id].status === "kept");
  const descOf = (id) => D.docs[id].descriptions.find((d) => d.id === S.docs[id].desc);

  // ---------- rendering: scenes ----------
  function render() {
    if (S.scene !== "title") save(); // never overwrite a saved game from the title screen
    const fn = SCENES[S.scene] || SCENES.title;
    $app.innerHTML = fn();
    $app.scrollTop = 0;
    renderModal();
  }

  function hud() {
    const dbg = DEBUG
      ? `<div class="debug">Truth ${S.stats.truth} · Compliance ${S.stats.compliance} · Town Memory ${S.stats.memory}</div>`
      : "";
    return `<header class="hud">
      <div><b>Day ${S.day}</b> · ${clock(S.time)}</div>
      <button class="icon-btn" data-act="notebook" aria-label="Notebook">📓<span class="badge ${S.notes.length ? "" : "hidden"}">${S.notes.length}</span></button>
    </header>${dbg}`;
  }

  function roomBar() {
    const rooms = [
      ["desk", "🛎️", "Front Desk"],
      ["stacks", "📚", "The Stacks"],
      ["basement", "🔒", "Basement"],
      ["server", "🔒", "Server Room"]
    ];
    return `<nav class="roombar">${rooms.map(([id, ic, name]) =>
      `<button class="room-btn ${S.room === id ? "active" : ""} ${id === "basement" || id === "server" ? "locked" : ""}" data-act="room" data-arg="${id}">
        <span class="ri">${ic}</span><span class="rn">${name}</span></button>`).join("")}</nav>`;
  }

  function ledger(edition, stories) {
    return `<article class="ledger paper">
      <div class="masthead"><div class="mast-title">The Hollow Creek Ledger</div>
      <div class="mast-sub">${edition} · Est. 1898</div></div>
      ${stories.map((s) => `<section class="story ${s.ad ? "ad" : ""} ${s.small ? "small-story" : ""} ${s.archive ? "archive-story" : ""}">
        ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ""}
        <h4>${s.head}</h4><p>${s.body}</p></section>`).join("")}
      <footer class="ledger-foot">Curated with care by The Memory Keeper ✨ · A Lumen Community Service</footer>
    </article>`;
  }

  function buildLedgerDay2() {
    const stories = [{
      head: "Exhibit Plans Take Shape",
      body: "Mayor Hale previewed the anniversary exhibit at Town Hall: “It's a celebration of how this town came together.” Lumen will provide display screens and refreshments."
    }];
    DOC_ORDER.forEach((id) => {
      const st = S.docs[id], doc = D.docs[id];
      if (st.status === "kept") {
        stories.push({ kicker: "Archive Corner", head: descOf(id).label, body: doc.ledger[st.circ], archive: true });
      } else if (st.status === "discarded") {
        stories.push({ kicker: "From the Memory Keeper's Index", head: doc.title, body: doc.ledger.discarded, archive: true });
      }
    });
    const theoTopic = D.visitors.theo.ledgerTopic[S.theo || "none"];
    stories.push({ head: "Student Project Spotlight", body: `Hollow Creek High junior Theo Lin is researching ${theoTopic} for the “Then and Now” anniversary showcase.` });
    stories.push({ head: "Ferreira's Bakery", body: "Anniversary special: “Ten Years” honey cake, by the slice or whole.", ad: true });
    stories.push({ head: "Weather", body: "Fog on the creek in the morning, clearing by noon.", small: true });
    return ledger("Tuesday Morning Edition", stories);
  }

  const SCENES = {
    title() {
      const saved = loadSave();
      const canContinue = saved && saved.scene !== "title";
      return `<div class="title-screen">
        <div class="title-lamp">🕯️</div>
        <h1>The Archive</h1>
        <p class="subtitle">Hollow Creek Public Records</p>
        <p class="blurb">${D.text.titleBlurb}</p>
        ${canContinue ? `<button class="btn primary" data-act="continue">Continue</button>` : ""}
        <button class="btn ${canContinue ? "" : "primary"}" data-act="newgame">${canContinue ? "Start over" : "Begin"}</button>
        <p class="fineprint">A prototype · Day 1 of 3</p>
      </div>`;
    },

    ledger1() {
      return `<div class="scene-pad">
        <p class="scene-intro">${D.text.ledger1Intro}</p>
        ${ledger(D.ledgerDay1.edition, D.ledgerDay1.stories)}
        <button class="btn primary wide" data-act="startday">Unlock the front door</button>
      </div>`;
    },

    room() { return hud() + `<main class="room">${S.room === "stacks" ? stacks() : desk()}</main>` + roomBar(); },

    evening() {
      const kept = DOC_ORDER.filter((id) => S.docs[id].status === "kept").length;
      const disc = DOC_ORDER.filter((id) => S.docs[id].status === "discarded").length;
      return `<div class="scene-pad">
        <div class="evening paper">
          <p class="scene-intro">${D.text.eveningIntro}</p>
          <p>Today you filed <b>${kept}</b> record${kept === 1 ? "" : "s"}${disc ? ` and let <b>${disc}</b> go` : ""}. Your notebook holds <b>${S.clues.length}</b> observation${S.clues.length === 1 ? "" : "s"}${S.notes.length ? ` and <b>${S.notes.length}</b> thing${S.notes.length === 1 ? "" : "s"} that don't quite line up` : ""}.</p>
          <div class="mk-bubble"><span class="mk-name">The Memory Keeper</span>
          ${S.digest ? D.text.mk.eveningDigest.replace("{n}", S.digest).replace("{stories}", S.digest === 1 ? "story is" : "stories are")
                     : D.text.mk.eveningNone}</div>
        </div>
        <button class="btn primary wide" data-act="sleep">Go home for the night</button>
      </div>`;
    },

    ledger2() {
      return `<div class="scene-pad">
        <p class="scene-intro">${D.text.ledger2Intro}</p>
        ${buildLedgerDay2()}
        <button class="btn primary wide" data-act="end">Continue</button>
      </div>`;
    },

    end() {
      return `<div class="scene-pad"><div class="paper end-card">
        <h2>End of the Day 1 prototype</h2>
        <p>${D.text.endBody}</p>
        <p class="small">Day 2 (Basement Records) and Day 3 (Server Room) are not built yet.</p>
        ${DEBUG ? `<div class="debug">Truth ${S.stats.truth} · Compliance ${S.stats.compliance} · Town Memory ${S.stats.memory} · Theo: ${S.theo}</div>` : ""}
        <button class="btn" data-act="notebook">Open notebook</button>
        <button class="btn primary" data-act="newgame">Play Day 1 again</button>
      </div></div>`;
    }
  };

  function desk() {
    const n = inbox().length;
    const allFiled = filed().length === DOC_ORDER.length;
    const theoWaiting = allFiled && !S.flags.theoDone;
    const canClose = allFiled && S.flags.theoDone;
    return `<h2 class="room-title">Front Desk</h2>
      <p class="room-flavor">${D.text.deskFlavor}</p>
      <div class="desk-grid">
        <button class="desk-item ${n ? "glow" : ""}" data-act="inbox">
          <span class="di-icon">📥</span><span class="di-name">Inbox tray</span>
          <span class="di-sub">${S.flags.juneDone ? (n ? `${n} document${n === 1 ? "" : "s"} waiting` : "Empty") : "Empty"}</span></button>
        <button class="desk-item mk" data-act="terminal">
          <span class="di-icon">🖥️</span><span class="di-name">The Memory Keeper</span>
          <span class="di-sub">Digest: ${S.digest} / 3</span></button>
        <button class="desk-item ${theoWaiting ? "glow" : ""}" data-act="bell">
          <span class="di-icon">🛎️</span><span class="di-name">Visitor bell</span>
          <span class="di-sub">${theoWaiting ? "Someone's waiting!" : "Quiet"}</span></button>
        <button class="desk-item" data-act="close" ${canClose ? "" : "disabled"}>
          <span class="di-icon">🗝️</span><span class="di-name">Close up</span>
          <span class="di-sub">${canClose ? "End the day" : "Work to do"}</span></button>
      </div>`;
  }

  function stacks() {
    const pub = ui.stacksView === "public";
    const shelvedItems = Object.keys(D.shelved).map((id) => {
      const it = D.shelved[id];
      return `<button class="shelf-item" data-act="shelved" data-arg="${id}">
        <span class="si-icon">${it.icon}</span><span class="si-title">${it.title}</span><span class="si-date">${it.date}</span></button>`;
    });
    const fileItems = (pub ? publicDocs() : filed()).map((id) => {
      const doc = D.docs[id], st = S.docs[id];
      const label = st.status === "kept" ? descOf(id).label : doc.title;
      const tag = st.status === "discarded" ? "Discarded · index only" :
        pub ? (st.circ === "original" ? "Hand-catalogued" : "Summary") : D.circulation[st.circ].access;
      return `<button class="shelf-item new ${st.status}" data-act="filed" data-arg="${id}">
        <span class="si-icon">${doc.icon}</span><span class="si-title">${label}</span><span class="si-date">${tag}</span></button>`;
    });
    return `<h2 class="room-title">The Stacks</h2>
      <p class="room-flavor">${D.text.stacksFlavor} ${pub ? D.text.stacksPublic : D.text.stacksArchivist}</p>
      <div class="toggle" role="group" aria-label="View">
        <button class="${pub ? "" : "on"}" data-act="view" data-arg="archivist">Archivist view</button>
        <button class="${pub ? "on" : ""}" data-act="view" data-arg="public">Public view</button>
      </div>
      <h3 class="shelf-label">Newly filed</h3>
      <div class="shelf">${fileItems.length ? fileItems.join("") : `<p class="empty">Nothing filed yet.</p>`}</div>
      <h3 class="shelf-label">Spring 2016 shelf</h3>
      <div class="shelf">${shelvedItems.join("")}</div>
      <button class="cat" data-act="cat">🐈 <span>Pocket is asleep on the reading table.</span></button>`;
  }

  // ---------- modals ----------
  function openModal(m) { ui.modal = m; renderModal(); }
  function closeModal() { ui.modal = null; ui.magnify = false; renderModal(); }

  function renderModal() {
    const m = ui.modal;
    if (!m) { $modal.className = ""; $modal.innerHTML = ""; return; }
    let body = "";
    if (m.type === "doc") body = docModal(m.id);
    else if (m.type === "inbox") body = inboxModal();
    else if (m.type === "dialog") body = dialogModal(m);
    else if (m.type === "notebook") body = notebookModal();
    else if (m.type === "terminal") body = terminalModal();
    else if (m.type === "shelved") body = shelvedModal(m.id);
    else if (m.type === "filed") body = filedModal(m.id);
    $modal.className = "open";
    $modal.innerHTML = `<div class="sheet ${m.type}">
      <button class="close-x" data-act="closemodal" aria-label="Close">✕</button>${body}</div>`;
  }

  function inboxModal() {
    const ids = inbox();
    return `<h2>Inbox tray</h2>
      <p class="muted">${D.text.inboxFlavor}</p>
      <div class="list">${ids.map((id) => {
        const d = D.docs[id];
        return `<button class="list-item" data-act="opendoc" data-arg="${id}">
          <span class="li-icon">${d.icon}</span><span><b>${d.title}</b><br><span class="muted">${d.kind} · ${d.date}</span></span></button>`;
      }).join("") || `<p class="empty">The tray is empty.</p>`}</div>`;
  }

  function docHeader(id) {
    const d = D.docs[id];
    return `<div class="doc-head"><span class="li-icon">${d.icon}</span><div><h2>${d.title}</h2>
      <p class="muted">${d.kind} · ${d.date}</p></div></div>`;
  }

  function docPaper(id) {
    return `<div class="doc paper ${D.docs[id].paper} ${ui.magnify ? "magnify" : ""}">${renderOriginal(id, true)}</div>`;
  }

  function magnifierBtn() {
    return `<button class="btn small ${ui.magnify ? "on" : ""}" data-act="magnify">🔍 Magnifier ${ui.magnify ? "on" : "off"}</button>`;
  }

  function docModal(id) {
    const st = S.docs[id], d = D.docs[id];
    const steps = ["examine", "describe", "circulate"];
    const stepper = `<ol class="stepper">${steps.map((s, i) =>
      `<li class="${s === st.step ? "now" : steps.indexOf(st.step) > i ? "done" : ""}">${["Examine", "Describe", "Circulate"][i]}</li>`).join("")}</ol>`;

    if (st.step === "examine") {
      const found = Object.keys(d.clues).filter((c) => has(S.clues, c)).length;
      return docHeader(id) + stepper +
        `<div class="tool-row">${magnifierBtn()}<span class="muted small">Details noted: ${found}</span></div>
        ${docPaper(id)}
        <p class="hint">${ui.magnify ? "Tap anything that seems worth noting." : "Turn on the magnifier to look closer."}</p>
        <div class="choice-row">
          <button class="btn" data-act="discard" data-arg="${id}">Discard</button>
          <button class="btn primary" data-act="keep" data-arg="${id}">Keep in collection</button>
        </div>`;
    }

    if (st.step === "describe") {
      return docHeader(id) + stepper +
        `<p class="prompt">How should the catalogue describe it? This becomes its public headline.</p>
        <div class="list">${d.descriptions.map((o) => {
          const locked = req(o.requires).length && !req(o.requires).some((c) => has(S.clues, c));
          return `<button class="desc-card ${locked ? "locked" : ""}" data-act="describe" data-arg="${o.id}" data-doc="${id}" ${locked ? "disabled" : ""}>
            ${o.suggested ? `<span class="suggested">✨ Suggested by the Memory Keeper</span>` : ""}
            <span class="dc-label">${locked ? "🔒 Look closer at the document" : "“" + o.label + "”"}</span>
            <span class="dc-note">${locked ? "You haven't noticed what this description would rely on." : o.note}</span></button>`;
        }).join("")}</div>
        <details class="peek"><summary>Look at the document again</summary>
          <div class="tool-row">${magnifierBtn()}</div>${docPaper(id)}</details>`;
    }

    // circulate
    return docHeader(id) + stepper +
      `<div class="headline-preview"><span class="muted small">Your description</span><br>“${descOf(id).label}”</div>
      <div class="mk-bubble"><span class="mk-name">The Memory Keeper · summary</span>${d.summary}
        <span class="mk-aside">${d.mkNote}</span></div>
      <details class="peek"><summary>Compare with the original</summary>
        <div class="tool-row">${magnifierBtn()}</div>${docPaper(id)}</details>
      <p class="prompt">Which version should circulate?</p>
      <div class="list">${Object.keys(D.circulation).map((k) => {
        const c = D.circulation[k];
        return `<button class="desc-card" data-act="circulate" data-arg="${k}" data-doc="${id}">
          <span class="dc-label">${c.label}</span>
          <span class="dc-note">${c.blurb}</span></button>`;
      }).join("")}</div>`;
  }

  function dialogModal(m) {
    const node = m.nodes[m.at];
    return `<div class="dialog">
      <div class="speaker"><span class="portrait">${m.portrait}</span><b>${m.speaker}</b></div>
      ${node.quote ? `<blockquote class="quote">${node.quote}</blockquote>` : ""}
      ${node.lines.map((l) => `<p class="${l.startsWith("(") ? "stage" : "line"}">${l}</p>`).join("")}
      <div class="list">${node.choices.map((c, i) =>
        `<button class="btn ${i === 0 ? "primary" : ""} wide" data-act="dchoice" data-arg="${i}">${c.label}</button>`).join("")}</div>
    </div>`;
  }

  function notebookModal() {
    const clueTexts = [];
    DOC_ORDER.forEach((id) => {
      Object.keys(D.docs[id].clues).forEach((c) => { if (has(S.clues, c)) clueTexts.push(D.docs[id].clues[c]); });
    });
    const notes = D.discrepancies.filter((d) => has(S.notes, d.id));
    return `<h2>📓 Notebook</h2>
      <h3 class="nb-h">Doesn't line up</h3>
      ${notes.length ? notes.map((n) => `<p class="nb-note">${n.text}</p>`).join("") : `<p class="empty">Nothing yet.</p>`}
      <h3 class="nb-h">Observations</h3>
      ${clueTexts.length ? `<ul class="nb-list">${clueTexts.map((t) => `<li>${t}</li>`).join("")}</ul>` : `<p class="empty">Use the magnifier on documents to note details.</p>`}`;
  }

  function terminalModal() {
    const idx = filed().map((id) => `<li><b>${D.docs[id].title}</b>: ${D.docs[id].summary}</li>`).join("");
    const greet = !S.flags.juneDone ? D.text.mk.greetMorning : inbox().length ? D.text.mk.greetWorking : D.text.mk.greetDone;
    return `<div class="terminal-screen">
      <div class="term-head">LUMEN · THE MEMORY KEEPER</div>
      <div class="mk-bubble"><span class="mk-name">The Memory Keeper</span>${greet}</div>
      <div class="digest"><span>Anniversary digest</span><div class="bar"><i style="width:${Math.min(100, (S.digest / 3) * 100)}%"></i></div><span>${S.digest} / 3</span></div>
      <h3 class="nb-h">My index</h3>
      ${idx ? `<ul class="nb-list">${idx}</ul>` : `<p class="empty">Nothing indexed yet today.</p>`}
    </div>`;
  }

  function shelvedModal(id) {
    const it = D.shelved[id];
    return `<div class="doc-head"><span class="li-icon">${it.icon}</span><div><h2>${it.title}</h2><p class="muted">${it.date}</p></div></div>
      <div class="doc paper">${it.body.join("")}</div>
      ${it.ask ? `<button class="btn wide" data-act="askcourier">Ask the Memory Keeper about the missing issues</button>
        <div id="ask-out"></div>` : ""}`;
  }

  function filedModal(id) {
    const st = S.docs[id], d = D.docs[id];
    const pub = ui.stacksView === "public";
    if (st.status === "discarded") {
      return docHeader(id) + `<p class="muted">You discarded the original.</p>
        <div class="mk-bubble"><span class="mk-name">The Memory Keeper's index</span>${d.summary}</div>`;
    }
    const desc = descOf(id).label;
    if (pub) {
      const showSummary = st.circ !== "original";
      const showOriginal = st.circ !== "summary";
      return `<h2>“${desc}”</h2><p class="muted">${d.date} · Public catalogue</p>
        ${showSummary ? `<div class="mk-bubble"><span class="mk-name">Summary by The Memory Keeper</span>${d.summary}</div>` : ""}
        ${showOriginal ? `<div class="doc paper ${d.paper}">${renderOriginal(id, false)}</div>`
                       : `<p class="access">Original: closed storage. Ask at the front desk.</p>`}`;
    }
    return docHeader(id) + `
      <dl class="meta"><dt>Description</dt><dd>“${desc}”</dd>
      <dt>Circulating</dt><dd>${D.circulation[st.circ].label}</dd>
      <dt>Original</dt><dd>${D.circulation[st.circ].access}</dd></dl>
      <div class="mk-bubble"><span class="mk-name">Memory Keeper summary</span>${d.summary}</div>
      <div class="tool-row">${magnifierBtn()}</div>${docPaper(id)}`;
  }

  // ---------- dialogs ----------
  function dialog(speaker, portrait, nodes) { openModal({ type: "dialog", speaker, portrait, nodes, at: 0 }); }

  function juneDialog() {
    const v = D.visitors.june;
    dialog(v.name, v.portrait, v.nodes.map((n) => ({
      lines: n.lines,
      choices: n.choices.map((c) => (c.action ? { label: c.label, fn: DIALOG_FNS[c.action] } : c))
    })));
  }
  function receiveBox() {
    S.flags.juneDone = true;
    spend(D.costs.visitor);
    DOC_ORDER.forEach((id) => (S.docs[id].status = "inbox"));
    closeModal(); render();
    toast("📥 3 documents added to the inbox.");
  }

  function theoDialog() {
    const v = D.visitors.theo;
    const nodes = [{
      lines: v.intro,
      choices: publicDocs().map((id) => ({ label: `${v.handPrefix} “${descOf(id).label}”`, fn: () => theoReads(id) }))
        .concat([{ label: v.askMK, fn: () => theoReads("mk") },
                 { label: v.nothing, fn: () => theoReads(null) }])
    }];
    dialog(v.name, v.portrait, nodes);
  }

  function publicText(id) {
    const st = S.docs[id], d = D.docs[id];
    if (st.circ === "original") return `<b>“${descOf(id).label}”</b><br>${renderOriginal(id, false)}`;
    let t = `<b>“${descOf(id).label}”</b><br>${d.summary}`;
    if (st.circ === "both") t += `<br><span class="muted small">${D.visitors.theo.fetchesOriginal}</span>`;
    return t;
  }

  function theoReads(id) {
    const m = ui.modal;
    if (id && D.docs[id] && !D.docs[id].theo) {
      m.nodes.push({ quote: publicText(id), lines: [D.visitors.theo.tooEarly], choices: m.nodes[0].choices });
      m.at = m.nodes.length - 1; renderModal(); return;
    }
    let belief, quote;
    if (id === "mk") {
      belief = "consultation";
      quote = `<b>The Memory Keeper:</b> ${D.visitors.theo.mkAnswer}`;
    } else if (id === null) {
      belief = "none";
    } else {
      const st = S.docs[id];
      const scale = ["consultation", "unsure", "protest"];
      let i = st.circ === "summary" ? 0 : st.circ === "both" ? 1 : 2;
      const fr = descOf(id).framing;
      if (fr === "conflict") i = Math.min(2, i + 1);
      if (fr === "consensus") i = Math.max(0, i - 1);
      belief = scale[i];
      quote = publicText(id);
    }
    S.theo = belief;
    const v = D.visitors.theo;
    const react = v.reactions[belief], eff = v.effects[belief];
    m.nodes.push({ quote, lines: react.concat([v.thanks]), choices: [{ label: v.goodbye, fn: () => {
      fx(eff); S.flags.theoDone = true; spend(D.costs.visitor); closeModal(); render();
      toast(v.exitToast);
    } }] });
    m.at = m.nodes.length - 1; renderModal();
  }

  const DIALOG_FNS = { receiveBox };

  // ---------- actions ----------
  const ACTIONS = {
    newgame() { clearSave(); S = freshState(); S.scene = "ledger1"; ui.modal = null; render(); },
    continue() { const s = loadSave(); if (s) S = s; render(); },
    startday() { S.scene = "room"; S.room = "desk"; render(); if (!S.flags.juneDone) setTimeout(juneDialog, 350); },
    room(id) {
      if (id === "basement") return toast(D.text.basementLocked);
      if (id === "server") return toast(D.text.serverLocked);
      S.room = id; render();
    },
    notebook() { openModal({ type: "notebook" }); },
    terminal() { openModal({ type: "terminal" }); },
    inbox() {
      if (!S.flags.juneDone) return juneDialog();
      openModal({ type: "inbox" });
    },
    opendoc(id) { ui.magnify = false; openModal({ type: "doc", id }); },
    magnify() {
      ui.magnify = !ui.magnify;
      const opened = Array.from($modal.querySelectorAll("details[open]")).length;
      renderModal();
      if (opened) $modal.querySelectorAll("details").forEach((d) => (d.open = true));
    },
    clue(clue, el) {
      if (!ui.magnify) return toast("Turn on the magnifier to look closer.");
      addClue(el.dataset.doc, clue);
      el.classList.add("found");
      const counter = $modal.querySelector(".tool-row .muted");
      if (counter && S.docs[el.dataset.doc] && S.docs[el.dataset.doc].step === "examine") {
        counter.textContent = "Details noted: " + Object.keys(D.docs[el.dataset.doc].clues).filter((c) => has(S.clues, c)).length;
      }
      save();
      if (S.scene === "room") { const hudEl = $app.querySelector(".hud"); if (hudEl) { const b = hudEl.querySelector(".badge"); b.textContent = S.notes.length; b.classList.toggle("hidden", !S.notes.length); } }
    },
    keep(id) { S.docs[id].step = "describe"; ui.magnify = false; renderModal(); save(); },
    discard(id) {
      const d = D.docs[id];
      dialog("The Memory Keeper", "🖥️", [{
        lines: D.text.mk.discard,
        choices: [{ label: "Discard the original", fn: () => {
          S.docs[id].status = "discarded";
          fx({ compliance: 1, truth: -1 - Math.round(d.summaryLoss / 2) });
          spend(D.costs.discard); markSummary(id); closeModal(); render();
          toast(d.icon + " " + d.title + " discarded.");
        } }, { label: "Actually, wait", fn: () => openModal({ type: "doc", id }) }]
      }]);
    },
    describe(descId, el) {
      const id = el.dataset.doc, st = S.docs[id];
      st.desc = descId; st.step = "circulate";
      const o = descOf(id);
      fx(o.effects); spend(D.costs.describe); markSummary(id);
      ui.magnify = false; renderModal(); save();
    },
    circulate(k, el) {
      const id = el.dataset.doc, st = S.docs[id], d = D.docs[id];
      st.circ = k; st.status = "kept";
      fx(D.circulation[k].effects);
      if (k === "summary") fx({ truth: -d.summaryLoss });
      if (k !== "original") S.digest++;
      spend(D.costs.circulate[k]);
      closeModal(); render();
      toast(d.icon + " Filed: “" + descOf(id).label + "”");
      if (filed().length === DOC_ORDER.length && !S.flags.theoDone) setTimeout(() => toast("🛎️ The bell rings at the front desk."), 2800);
    },
    bell() {
      if (filed().length === DOC_ORDER.length && !S.flags.theoDone) return theoDialog();
      toast(S.flags.theoDone ? "The bell is quiet." : "No one's here. You give the bell a tiny ring anyway.");
    },
    close() { S.scene = "evening"; render(); },
    sleep() { S.scene = "ledger2"; render(); },
    end() { S.scene = "end"; render(); },
    view(v) { ui.stacksView = v; render(); },
    shelved(id) { markSeen(id); save(); openModal({ type: "shelved", id }); },
    filed(id) { ui.magnify = false; openModal({ type: "filed", id }); },
    askcourier() {
      const out = $modal.querySelector("#ask-out");
      out.innerHTML = `<div class="mk-bubble"><span class="mk-name">The Memory Keeper</span>${D.shelved.courier.ask}</div>`;
    },
    cat() { toast(D.text.catLines[Math.floor(Math.random() * D.text.catLines.length)]); },
    closemodal() { closeModal(); if (S.scene === "room") render(); },
    dchoice(i) {
      const m = ui.modal, c = m.nodes[m.at].choices[+i];
      if (c.fn) c.fn(); else { m.at = c.next; renderModal(); }
    }
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || el.disabled) return;
    const fn = ACTIONS[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el.dataset.arg, el); }
  });
  $modal.addEventListener("click", (e) => { if (e.target === $modal) ACTIONS.closemodal(); });

  render();
})();
