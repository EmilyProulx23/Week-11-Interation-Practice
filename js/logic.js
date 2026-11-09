// The Archive — game rules and state. No rendering here.
(function () {
  "use strict";

  const D = window.GAME_DATA;
  const SAVE_KEY = "the-archive-pixel-save-v1";
  const DOC_ORDER = Object.keys(D.days).sort().reduce((a, d) => a.concat(D.days[d].docs), []);
  const listeners = [];

  function freshState() {
    const docs = {};
    DOC_ORDER.forEach((id) => (docs[id] = { status: "unreceived", step: "examine", desc: null, circ: null }));
    const start = D.rooms.desk.start;
    return {
      v: 2, scene: "title", day: 1, time: D.dayStart,
      pos: { room: "desk", x: start.x, y: start.y, dir: start.dir },
      stats: { truth: 0, compliance: 0, memory: 0 },
      flags: {}, docs, clues: [], seen: [], summaries: [], notes: [],
      theo: null, ruth: null, exhibit: null, plaque: null, climax: null, digest: 0
    };
  }
  // Older saves may be missing newer documents or fields.
  function migrate(s) {
    const f = freshState();
    DOC_ORDER.forEach((id) => { if (!s.docs[id]) s.docs[id] = f.docs[id]; });
    ["ruth", "exhibit", "plaque", "climax"].forEach((k) => { if (!(k in s)) s[k] = null; });
    return s;
  }

  const L = {
    D, DOC_ORDER,
    S: freshState(),

    on(fn) { listeners.push(fn); },
    emit(type, payload) { listeners.forEach((fn) => fn(type, payload)); },
    toast(msg) { L.emit("toast", msg); },

    // ---------- save / load ----------
    save() {
      if (L.S.scene === "title") return; // never overwrite a saved game from the title screen
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(L.S)); } catch (e) { /* storage unavailable */ }
    },
    loadSave() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const s = JSON.parse(raw);
        return s && s.v === 2 ? migrate(s) : null;
      } catch (e) { return null; }
    },
    hasSave() { const s = L.loadSave(); return !!(s && s.scene !== "title"); },
    newGame() {
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
      L.S = freshState();
      L.S.scene = "ledger1";
      L.save();
    },
    continueGame() { const s = L.loadSave(); if (s) L.S = s; },
    beginDay(n) {
      const start = D.rooms.desk.start;
      L.S.day = n; L.S.time = D.dayStart; L.S.scene = "world";
      L.S.pos = { room: "desk", x: start.x, y: start.y, dir: start.dir };
      L.save();
    },

    // ---------- helpers ----------
    has: (arr, x) => arr.indexOf(x) !== -1,
    req: (r) => (r == null ? [] : Array.isArray(r) ? r : [r]),
    fx(effects) { for (const k in effects || {}) L.S.stats[k] = (L.S.stats[k] || 0) + effects[k]; },
    spend(min) { L.S.time = Math.min(D.dayEnd, L.S.time + min); },
    clock(t) {
      const h = Math.floor(t / 60), m = t % 60;
      return ((h + 11) % 12) + 1 + ":" + String(m).padStart(2, "0") + (h < 12 ? " am" : " pm");
    },

    dayDocs: (day) => D.days[day || L.S.day].docs,
    // Most documents have one original; Theo's poster depends on what he came to believe.
    original(id) {
      const d = D.docs[id];
      if (d.original) return d.original;
      const b = L.S.theo === "protest" || L.S.theo === "unsure" ? L.S.theo : "consultation";
      return d.originalBy[b];
    },
    isFiled: (id) => ["kept", "discarded"].indexOf(L.S.docs[id].status) !== -1,
    inbox: () => DOC_ORDER.filter((id) => L.S.docs[id].status === "inbox"),
    filed: () => DOC_ORDER.filter(L.isFiled),
    filedToday: () => L.dayDocs().filter(L.isFiled),
    foundToday: () => L.dayDocs().filter((id) => L.S.docs[id].status !== "unreceived"),
    publicDocs: () => DOC_ORDER.filter((id) => L.S.docs[id].status === "kept"),
    descOf: (id) => D.docs[id].descriptions.find((d) => d.id === L.S.docs[id].desc),
    allFiled: () => L.filedToday().length === L.dayDocs().length,
    theoWaiting: () => L.S.day === 1 && L.allFiled() && !L.S.flags.theoDone,
    isDescLocked(o) { const r = L.req(o.requires); return r.length > 0 && !r.some((c) => L.has(L.S.clues, c)); },
    cluesFound: (id) => Object.keys(D.docs[id].clues).filter((c) => L.has(L.S.clues, c)).length,

    // Who should be at (or walking to) the front desk right now.
    visitorDue() {
      const f = L.S.flags;
      if (L.S.day === 1) {
        if (!f.juneDone) return "june";
        if (L.theoWaiting()) return "theo";
      } else if (L.S.day === 2) {
        if (L.filedToday().length >= 2 && !f.ruthDone) return "ruth";
        if (L.allFiled() && f.ruthDone && !f.aideDone) return "aide";
      } else if (L.S.day === 3) {
        const serverFiled = ["minutes2", "revlog"].every(L.isFiled);
        if (serverFiled && !f.theo3Done) return "theo";
        if (L.allFiled() && f.theo3Done && !f.plaqueDone) return "aide";
      }
      return null;
    },
    canClose() {
      if (!L.allFiled()) return false;
      const f = L.S.flags;
      return L.S.day === 1 ? !!f.theoDone : L.S.day === 2 ? !!(f.ruthDone && f.aideDone) : !!f.plaqueDone;
    },

    // ---------- clues & discrepancies ----------
    addClue(docId, clue) {
      if (L.has(L.S.clues, clue)) return false;
      L.S.clues.push(clue);
      L.fx({ truth: 1 });
      L.toast("Noted: " + D.docs[docId].clues[clue]);
      L.checkDiscrepancies();
      L.save();
      return true;
    },
    markSeen(id) { if (!L.has(L.S.seen, id)) { L.S.seen.push(id); L.checkDiscrepancies(); L.save(); } },
    markSummary(id) { if (!L.has(L.S.summaries, id)) { L.S.summaries.push(id); L.checkDiscrepancies(); } },
    checkDiscrepancies() {
      D.discrepancies.forEach((d) => {
        if (L.has(L.S.notes, d.id)) return;
        const n = d.needs;
        const ok = (n.clues || []).every((c) => L.has(L.S.clues, c)) &&
                   (n.seen || []).every((c) => L.has(L.S.seen, c)) &&
                   (n.summaries || []).every((c) => L.has(L.S.summaries, c)) &&
                   (n.flags || []).every((c) => !!L.S.flags[c]);
        if (ok) {
          L.S.notes.push(d.id);
          L.fx({ truth: 1 });
          setTimeout(() => L.toast("Something doesn't line up. New note in your notebook."), 1400);
          L.emit("note", d.id);
        }
      });
    },

    // ---------- the day's events ----------
    receiveBox() {
      L.S.flags.juneDone = true;
      L.spend(D.costs.visitor);
      L.dayDocs(1).forEach((id) => (L.S.docs[id].status = "inbox"));
      L.save();
      L.toast("3 documents added to the inbox tray.");
    },
    openServer() { if (!L.S.flags.serverOpen) { L.S.flags.serverOpen = true; L.save(); L.toast(D.day3.serverOpenToast); } },
    receiveProject() {
      L.S.flags.theo3Done = true;
      L.S.docs.project.status = "inbox";
      L.spend(D.costs.visitor);
      L.save();
      L.toast("Theo's poster is in the inbox tray.");
      L.afterFiling();
    },
    askTheoMom() { if (!L.S.flags.theoMom) { L.S.flags.theoMom = true; L.fx(D.visitors.theo3.momEffects); L.checkDiscrepancies(); L.save(); } },
    plaqueLocked(o) { const r = L.req(o.requires); return r.length > 0 && !r.some((c) => L.has(L.S.clues, c)); },
    finishPlaque(optId) {
      const o = D.visitors.plaque.options.find((x) => x.id === optId);
      L.S.plaque = optId;
      L.fx(o.effects);
      L.S.flags.plaqueDone = true;
      L.spend(D.costs.visitor);
      L.save();
    },
    // ---------- Friday: exhibit night ----------
    beginFriday() {
      const start = D.rooms.townhall.start;
      L.S.day = 4; L.S.time = 18 * 60 + 30; L.S.scene = "world";
      L.S.pos = { room: "townhall", x: start.x, y: start.y, dir: start.dir };
      L.save();
    },
    sawExhibit(which) { L.S.flags[which] = true; L.save(); },
    climaxDue: () => L.S.day === 4 && !!L.S.flags.sawCase && !!L.S.flags.sawWall && !L.S.climax,
    finishClimax(id) {
      const o = D.friday.climax.options.find((x) => x.id === id);
      L.S.climax = id;
      L.fx(o.effects);
      L.save();
      return o;
    },
    // How each spring-2016 record reads to the town tonight.
    townAccount() {
      const harmonised = L.S.climax === "harmonise";
      return D.friday.recapRecords.map((id) => {
        const st = L.S.docs[id], d = D.docs[id];
        if (st.status === "discarded") return { id, head: d.title, text: d.ledger.discarded, tag: "Memory Keeper's index only" };
        if (st.status !== "kept") return { id, head: d.title, text: "Never found.", tag: "Missing" };
        const head = L.descOf(id).label;
        if (harmonised) return { id, head, text: d.summary, tag: "Harmonised tonight" };
        if (st.circ === "summary") return { id, head, text: d.summary, tag: "Memory Keeper summary" };
        if (st.circ === "both") return { id, head, text: d.summary + " (The original is beside it.)", tag: "Summary + original" };
        return { id, head, text: d.ledger.original, tag: "Original" };
      });
    },

    // The ending: Truth × Town Memory, with a Compliance epilogue.
    ending() {
      const E = D.endings, t = E.thresholds, st = L.S.stats;
      const key = st.truth >= t.truth ? (st.memory >= t.memory ? "living" : "quiet") : (st.memory >= t.memory ? "smooth" : "blank");
      const epi = st.compliance >= t.complianceHigh ? "high" : st.compliance <= t.complianceLow ? "low" : "mid";
      const climax = L.S.climax ? D.friday.climax.endingLine[L.S.climax] : null;
      return { key, title: E[key].title, text: E[key].text, epilogue: E.epilogue[epi], theoMom: L.S.flags.theoMom ? E.theoMom : null, climax };
    },
    takeKey() { L.S.flags.keyTaken = true; L.save(); L.toast(D.day2.keyToast); },
    findDoc(id) {
      const st = L.S.docs[id];
      L.markSeen("pendingBoxes");
      if (st.status !== "unreceived") return false;
      st.status = "inbox";
      L.spend(10);
      L.save();
      const pool = L.S.day === 3 ? ["minutes2", "revlog"] : L.dayDocs();
      const left = pool.filter((d) => L.S.docs[d].status === "unreceived").length;
      const what = L.S.day === 3 ? "" : ` (${left} box${left === 1 ? "" : "es"} left to search.)`;
      L.toast(`You find the ${D.docs[id].title.toLowerCase()} and take it to the inbox tray.${left ? (what || ` (${left} more to find.)`) : ""}`);
      return true;
    },
    keep(id) { L.S.docs[id].step = "describe"; L.save(); },
    discard(id) {
      const d = D.docs[id];
      L.S.docs[id].status = "discarded";
      L.fx({ compliance: 1, truth: -1 - Math.round(d.summaryLoss / 2) });
      L.spend(D.costs.discard);
      L.markSummary(id);
      L.save();
      L.toast(d.title + " discarded.");
      L.afterFiling();
    },
    describe(id, descId) {
      const st = L.S.docs[id];
      st.desc = descId; st.step = "circulate";
      L.fx(L.descOf(id).effects);
      L.spend(D.costs.describe);
      L.markSummary(id);
      L.save();
    },
    circulate(id, k) {
      const st = L.S.docs[id], d = D.docs[id];
      st.circ = k; st.status = "kept";
      L.fx(D.circulation[k].effects);
      if (k === "summary") L.fx({ truth: -d.summaryLoss });
      if (k !== "original") L.S.digest++;
      L.spend(D.costs.circulate[k]);
      L.save();
      L.toast("Filed: “" + L.descOf(id).label + "”");
      L.afterFiling();
    },
    afterFiling() { if (L.visitorDue()) setTimeout(() => L.emit("visitorDue", L.visitorDue()), 1600); },

    // How a public record reads: consultation (soft) → unsure → protest (hard).
    tone(id) {
      const st = L.S.docs[id], d = D.docs[id];
      if (!d.theo) return null; // not about spring 2016
      const scale = ["consultation", "unsure", "protest"];
      let i = st.circ === "summary" ? 0 : st.circ === "both" ? 1 : 2;
      const fr = L.descOf(id).framing;
      if (fr === "conflict") i = Math.min(2, i + 1);
      if (fr === "consensus") i = Math.max(0, i - 1);
      return scale[i];
    },

    // Theo (Day 1). Returns { belief, quote: blocks }.
    theoRead(id) {
      const v = D.visitors.theo;
      if (id === "mk") return { belief: "consultation", quote: [{ s: "mk", t: "The Memory Keeper: " + v.mkAnswer }] };
      if (id === null) return { belief: "none", quote: null };
      return { belief: L.tone(id), quote: L.publicBlocks(id, true) };
    },
    finishTheo(belief) {
      L.S.theo = belief;
      L.fx(D.visitors.theo.effects[belief]);
      L.S.flags.theoDone = true;
      L.spend(D.costs.visitor);
      L.save();
    },

    // Ruth (Day 2): how far her memory has drifted toward what circulated on Day 1.
    ruthDrift() {
      const soft = ["letter", "photo"].filter((id) => {
        const st = L.S.docs[id];
        return st.status === "discarded" || st.status !== "kept" || L.tone(id) === "consultation";
      }).length;
      return ["low", "mid", "high"][soft];
    },
    ruthCanShow: () => ["photo", "letter", "petition", "clause14"].filter((id) => L.S.docs[id].status === "kept"),
    finishRuth(belief, effKey) {
      L.S.ruth = belief;
      L.fx(D.visitors.ruth.effects[effKey || belief]);
      L.S.flags.ruthDone = true;
      L.spend(D.costs.visitor);
      L.checkDiscrepancies();
      L.save();
    },

    // Priya (Day 2): the exhibit centrepiece.
    exhibitTone(id) {
      if (id === "mk") return "mk";
      if (id === null) return "none";
      const t = L.tone(id);
      return t === null || t === "consultation" ? "warm" : t;
    },
    finishAide(id) {
      const tone = L.exhibitTone(id);
      L.S.exhibit = { id, tone };
      L.fx(D.visitors.aide.effects[tone]);
      L.S.flags.aideDone = true;
      L.spend(D.costs.visitor);
      L.checkDiscrepancies();
      L.save();
      return tone;
    },

    // What any visitor sees for a record (public catalogue).
    publicBlocks(id, forTheo) {
      const st = L.S.docs[id], d = D.docs[id];
      const head = { s: "h", t: "“" + L.descOf(id).label + "”" };
      if (st.circ === "original") return [head].concat(L.original(id));
      const out = [head, { s: "mk", t: d.summary }];
      if (st.circ === "both") {
        if (forTheo) out.push({ s: "small", t: D.visitors.theo.fetchesOriginal });
        else out.push({ s: "small", t: "Original on the open shelves:" });
        return out.concat(forTheo ? [] : L.original(id));
      }
      out.push({ s: "tag", t: "Original: closed storage. Ask at the front desk." });
      return out;
    },

    archiveCorner(day) {
      const out = [];
      L.dayDocs(day).forEach((id) => {
        const st = L.S.docs[id], doc = D.docs[id];
        if (st.status === "kept") out.push({ kicker: "Archive Corner", head: L.descOf(id).label, body: doc.ledger[st.circ], archive: true });
        else if (st.status === "discarded") out.push({ kicker: "From the Memory Keeper's Index", head: doc.title, body: doc.ledger.discarded, archive: true });
      });
      return out;
    },

    ledgerDay2() {
      return [{
        head: "Exhibit Plans Take Shape",
        body: "Mayor Hale previewed the anniversary exhibit at Town Hall: “It's a celebration of how this town came together.” Lumen will provide display screens and refreshments."
      }].concat(L.archiveCorner(1)).concat([
        { head: "Student Project Spotlight", body: `Hollow Creek High junior Theo Lin is researching ${D.visitors.theo.ledgerTopic[L.S.theo || "none"]} for the “Then and Now” anniversary showcase.` },
        { head: "Ferreira's Bakery", body: "Anniversary special: “Ten Years” honey cake, by the slice or whole.", ad: true },
        { head: "Weather", body: "Fog on the creek in the morning, clearing by noon.", small: true }
      ]);
    },

    ledgerDay3() {
      const ex = L.S.exhibit || { id: null, tone: "none" };
      const label = ex.id && D.docs[ex.id] ? "“" + L.descOf(ex.id).label + "”" : "";
      const lead = {
        warm: { head: "Exhibit Centrepiece Chosen", body: `The Archive has lent ${label} to Friday's “Ten Years Together” exhibit. “It captures how we came together,” said Mayor Hale.` },
        unsure: { head: "Exhibit Takes Shape", body: `${label} will appear at Friday's opening, alongside Lumen's interactive Memory Wall.` },
        protest: { head: "Exhibit Plans Under Review", body: `Mayor Hale's office is “reviewing the tone” of the Archive's contribution, ${label}, ahead of Friday's opening.` },
        mk: { head: "Memory Wall to Anchor Exhibit", body: "The Memory Keeper has curated Friday's centrepiece: a warm look back at the 2016 community consultation." },
        none: { head: "Exhibit Still Seeking Centrepiece", body: "The Mayor's office says the Memory Keeper will “fill any gaps” before Friday's opening." }
      }[ex.tone];
      const ruthBelief = L.S.ruth || "unsure";
      return [lead].concat(L.archiveCorner(2)).concat([
        { head: "Goodbye, Alder Street", body: "Retired teacher Ruth Okafor moves to Maple Court this week. " + D.visitors.ruth.ledger[ruthBelief] },
        { head: "Ferreira's Bakery", body: "Abel says: cinnamon rolls, like the old days. You know the ones.", ad: true },
        { head: "Weather", body: "First frost. Wrap up warm.", small: true }
      ]);
    },

    ledgerFriday() {
      const o = D.visitors.plaque.options.find((x) => x.id === L.S.plaque) || D.visitors.plaque.options[0];
      return [{ head: D.day3.plaqueHead, body: D.day3.plaqueBody + "“" + o.text + "”" }]
        .concat(L.archiveCorner(3))
        .concat([
          { head: "Ferreira's Bakery", body: "Open late for the exhibit. Cinnamon rolls on the Town Hall steps, 6 pm, like the old days.", ad: true },
          { head: "Weather", body: "Clear and cold. Good night for a crowd.", small: true }
        ]);
    },

    objective() {
      const f = L.S.flags, n = L.inbox().length, who = L.visitorDue();
      if (L.S.day === 1) {
        if (!f.juneDone) return "Someone is coming up the front steps…";
        if (n) return `Sort June's donation at the inbox tray (${n} left).`;
        if (who === "theo") return "A visitor is waiting at the front desk.";
      } else if (L.S.day === 2) {
        if (!f.keyTaken) return "Lumen Facilities left something in the inbox tray.";
        const found = L.foundToday().length;
        if (who === "ruth") return "Ruth Okafor is waiting at the front desk.";
        if (who === "aide") return "Someone from the Mayor's office is at the front desk.";
        if (found < 3 && !n) return `Search the “Pending Review” boxes in the basement (${found} of 3 found).`;
        if (n) return `Sort the basement documents at the inbox tray (${n} waiting${found < 3 ? `, ${3 - found} still in the basement` : ""}).`;
      } else if (L.S.day === 3) {
        if (!f.serverOpen) return "Check in with the Memory Keeper at the terminal.";
        if (who === "theo") return "Theo is waiting at the front desk.";
        if (who === "aide") return "Priya is back for the plaque text.";
        const found = ["minutes2", "revlog"].filter((id) => L.S.docs[id].status !== "unreceived").length;
        if (found < 2 && !n) return `Look around the Server Room, through the Stacks (${found} of 2 found).`;
        if (n) return `Sort the documents at the inbox tray (${n} waiting${found < 2 ? `, ${2 - found} still in the Server Room` : ""}).`;
        if (L.canClose()) return "Close up. The exhibit opens tomorrow.";
      }
      if (L.S.day === 4) {
        if (!f.sawCase && !f.sawWall) return "Find the Archive's case and Lumen's Memory Wall. Talk to anyone you like.";
        if (!f.sawCase) return "Find the Archive's case.";
        if (!f.sawWall) return "Have a look at Lumen's Memory Wall.";
        if (!L.S.climax) return "The speeches are about to start…";
        return "";
      }
      if (L.canClose()) return "Close up for the day at the front door.";
      return "";
    }
  };

  window.Logic = L;
})();
