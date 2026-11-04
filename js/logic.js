// The Archive — game rules and state. No rendering here.
(function () {
  "use strict";

  const D = window.GAME_DATA;
  const SAVE_KEY = "the-archive-pixel-save-v1";
  const DOC_ORDER = ["fair", "letter", "photo"];
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
      theo: null, digest: 0
    };
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
        return s && s.v === 2 ? s : null;
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

    // ---------- helpers ----------
    has: (arr, x) => arr.indexOf(x) !== -1,
    req: (r) => (r == null ? [] : Array.isArray(r) ? r : [r]),
    fx(effects) { for (const k in effects || {}) L.S.stats[k] = (L.S.stats[k] || 0) + effects[k]; },
    spend(min) { L.S.time = Math.min(D.dayEnd, L.S.time + min); },
    clock(t) {
      const h = Math.floor(t / 60), m = t % 60;
      return ((h + 11) % 12) + 1 + ":" + String(m).padStart(2, "0") + (h < 12 ? " am" : " pm");
    },

    inbox: () => DOC_ORDER.filter((id) => L.S.docs[id].status === "inbox"),
    filed: () => DOC_ORDER.filter((id) => ["kept", "discarded"].indexOf(L.S.docs[id].status) !== -1),
    publicDocs: () => DOC_ORDER.filter((id) => L.S.docs[id].status === "kept"),
    descOf: (id) => D.docs[id].descriptions.find((d) => d.id === L.S.docs[id].desc),
    allFiled: () => L.filed().length === DOC_ORDER.length,
    theoWaiting: () => L.allFiled() && !L.S.flags.theoDone,
    canClose: () => L.allFiled() && !!L.S.flags.theoDone,
    isDescLocked(o) { const r = L.req(o.requires); return r.length > 0 && !r.some((c) => L.has(L.S.clues, c)); },
    cluesFound: (id) => Object.keys(D.docs[id].clues).filter((c) => L.has(L.S.clues, c)).length,

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
                   (n.summaries || []).every((c) => L.has(L.S.summaries, c));
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
      DOC_ORDER.forEach((id) => (L.S.docs[id].status = "inbox"));
      L.save();
      L.toast("3 documents added to the inbox tray.");
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
    afterFiling() {
      if (L.theoWaiting()) setTimeout(() => L.emit("theoArrives"), 1600);
    },

    // What Theo reads and comes to believe. Returns { belief, quote: blocks }.
    theoRead(id) {
      const v = D.visitors.theo;
      if (id === "mk") return { belief: "consultation", quote: [{ s: "mk", t: "The Memory Keeper: " + v.mkAnswer }] };
      if (id === null) return { belief: "none", quote: null };
      const st = L.S.docs[id], d = D.docs[id];
      const scale = ["consultation", "unsure", "protest"];
      let i = st.circ === "summary" ? 0 : st.circ === "both" ? 1 : 2;
      const fr = L.descOf(id).framing;
      if (fr === "conflict") i = Math.min(2, i + 1);
      if (fr === "consensus") i = Math.max(0, i - 1);
      return { belief: d.theo ? scale[i] : null, quote: L.publicBlocks(id, true) };
    },
    finishTheo(belief) {
      L.S.theo = belief;
      L.fx(D.visitors.theo.effects[belief]);
      L.S.flags.theoDone = true;
      L.spend(D.costs.visitor);
      L.save();
    },

    // What any visitor sees for a record (public catalogue).
    publicBlocks(id, forTheo) {
      const st = L.S.docs[id], d = D.docs[id];
      const head = { s: "h", t: "“" + L.descOf(id).label + "”" };
      if (st.circ === "original") return [head].concat(d.original);
      const out = [head, { s: "mk", t: d.summary }];
      if (st.circ === "both") {
        if (forTheo) out.push({ s: "small", t: D.visitors.theo.fetchesOriginal });
        else out.push({ s: "small", t: "Original on the open shelves:" });
        return out.concat(forTheo ? [] : d.original);
      }
      out.push({ s: "tag", t: "Original: closed storage. Ask at the front desk." });
      return out;
    },

    ledgerDay2() {
      const stories = [{
        head: "Exhibit Plans Take Shape",
        body: "Mayor Hale previewed the anniversary exhibit at Town Hall: “It's a celebration of how this town came together.” Lumen will provide display screens and refreshments."
      }];
      DOC_ORDER.forEach((id) => {
        const st = L.S.docs[id], doc = D.docs[id];
        if (st.status === "kept") stories.push({ kicker: "Archive Corner", head: L.descOf(id).label, body: doc.ledger[st.circ], archive: true });
        else if (st.status === "discarded") stories.push({ kicker: "From the Memory Keeper's Index", head: doc.title, body: doc.ledger.discarded, archive: true });
      });
      stories.push({ head: "Student Project Spotlight", body: `Hollow Creek High junior Theo Lin is researching ${D.visitors.theo.ledgerTopic[L.S.theo || "none"]} for the “Then and Now” anniversary showcase.` });
      stories.push({ head: "Ferreira's Bakery", body: "Anniversary special: “Ten Years” honey cake, by the slice or whole.", ad: true });
      stories.push({ head: "Weather", body: "Fog on the creek in the morning, clearing by noon.", small: true });
      return stories;
    },

    objective() {
      const f = L.S.flags, n = L.inbox().length;
      if (!f.juneDone) return "Someone is coming up the front steps…";
      if (n) return `Sort June's donation at the inbox tray (${n} left).`;
      if (L.theoWaiting()) return "A visitor is waiting at the front desk.";
      if (L.canClose()) return "Close up for the day at the front door.";
      return "";
    }
  };

  window.Logic = L;
})();
