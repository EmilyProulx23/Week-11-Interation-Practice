// The Archive — boot, scenes, screens, HUD, input and game loop.
(function () {
  "use strict";
  const L = Logic, D = L.D, S = () => L.S, T = Art.T;
  const DEBUG = /[?&]debug=1/.test(location.search);
  const cv = document.getElementById("game"), ctx = cv.getContext("2d");
  const world = document.createElement("canvas"); world.width = World.COLS * T; world.height = World.ROWS * T;
  const wctx = world.getContext("2d");
  const HUD_H = 56;

  let W = 0, H = 0, dpr = 1, view = { x: 0, y: 0, w: 0, h: 0, s: 1 };
  let time = 0, last = 0, held = null, saveTimer = 0, hintTimer = 0;
  const fx = { bellUntil: 0, evening: 0 };

  L.on((type, p) => {
    if (type === "toast") UI.toast(p);
    if (type === "visitorDue") checkVisitor(true);
  });

  // ---------- layout ----------
  function resize() {
    dpr = window.devicePixelRatio || 1; W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + "px"; cv.style.height = H + "px";
    const availW = W * dpr, availH = (H - HUD_H - 70) * dpr;
    const s = Math.max(1, Math.floor(Math.min(availW / world.width, availH / world.height)));
    const wd = world.width * s, hd = world.height * s;
    view = { s, xd: Math.round((cv.width - wd) / 2), yd: Math.round(HUD_H * dpr), wd, hd };
    view.x = view.xd / dpr; view.y = view.yd / dpr; view.w = wd / dpr; view.h = hd / dpr;
  }
  window.addEventListener("resize", resize);

  // ---------- helpers ----------
  const icon = (n) => Art.icon(n);
  const docIcon = (id) => icon((D.docs[id] || D.shelved[id]).icon);
  const portrait = (name) => Art.person(name, "down", 0);
  function setScene(sc) { S().scene = sc; UI.clear(); L.save(); openSceneScreen(); }

  // ---------- full-screen scenes ----------
  function titleArt(c, x, y, w) {
    const small = document.createElement("canvas"); small.width = 96; small.height = 40;
    const sc = small.getContext("2d");
    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) Art.tile(sc, ".", i, j, ["......", "......", "......"]);
    sc.drawImage(Art.person("archivist", "down", 0), 39, 2);
    Art.drawObject(sc, { kind: "desk", x: 1, y: 1, w: 4 }, { t: time });
    Art.drawObject(sc, { kind: "terminal", x: 3, y: 1 }, { t: time });
    Art.drawObject(sc, { kind: "inbox", x: 1, y: 1 }, { t: time, inbox: 2 });
    Art.drawObject(sc, { kind: "lamp", x: 5, y: 1 }, { t: time });
    Art.drawObject(sc, { kind: "cat", x: 2, y: 1 }, { t: time });
    const k = Math.max(2, Math.floor(Math.min(w, 400) / 96));
    UI.sprite(c, small, x + (w - 96 * k) / 2, y, k);
  }

  function openSceneScreen() {
    const sc = S().scene;
    if (sc === "title") UI.open({ id: "title", kind: "full", bg: "#2a201a", build: () => {
      const cont = L.hasSave();
      return [{ t: "space", h: Math.max(20, H * 0.08) },
        { t: "custom", h: 40 * Math.max(2, Math.floor(Math.min(W - 40, 400) / 96)), draw: titleArt },
        { t: "text", text: "The Archive", size: 46, head: true, bold: true, align: "center", color: UI.K.paper, line: 52 },
        { t: "text", text: "Hollow Creek Public Records", size: 18, align: "center", color: "#c9b48f", upper: true },
        { t: "space", h: 6 },
        { t: "text", text: D.text.titleBlurb, align: "center", color: "#e8dcc4" },
        { t: "space", h: 10 },
        cont && { t: "btn", label: "Continue", primary: true, onTap: () => { L.continueGame(); startScene(); } },
        { t: "btn", label: cont ? "Start over" : "Begin", primary: !cont, onTap: () => { L.newGame(); startScene(); } },
        { t: "text", text: "Three days in the archive · Tap to walk, tap things to use them.", size: 18, align: "center", color: "#a8957a" }];
    } });
    if (/^ledger[123]$/.test(sc)) {
      const n = +sc.slice(6);
      const cfg = {
        1: { intro: D.text.ledger1Intro, stories: () => D.ledgerDay1.stories, edition: D.ledgerDay1.edition, label: "Unlock the front door", go: () => beginDay(1) },
        2: { intro: D.text.ledger2Intro, stories: L.ledgerDay2, edition: "Tuesday Morning Edition", label: "Unlock the front door", go: () => beginDay(2) },
        3: { intro: D.day2.ledgerIntro, stories: L.ledgerDay3, edition: D.day2.ledgerEdition, label: "Unlock the front door", go: () => beginDay(3) }
      }[n];
      UI.open({ id: sc, kind: "full", bg: "#2a201a", build: () => [
        { t: "space", h: 16 },
        { t: "text", text: cfg.intro, color: "#e8dcc4", align: "center" },
        { t: "panel", els: ledgerEls(cfg.stories(), cfg.edition) },
        { t: "btn", label: cfg.label, primary: true, onTap: cfg.go },
        { t: "space", h: 20 }] });
    }
    if (sc === "end") { S().scene = S().day >= 3 ? "finale" : "ledger3"; return openSceneScreen(); } // older saves
    if (sc === "finale") {
      const e = L.ending();
      UI.open({ id: "finale", kind: "full", bg: "#2a201a", build: () => [
        { t: "space", h: 16 },
        { t: "text", text: D.day3.finaleIntro, color: "#e8dcc4", align: "center" },
        { t: "panel", els: ledgerEls(L.ledgerFriday(), D.day3.finaleEdition) },
        { t: "space", h: 6 },
        { t: "panel", els: [
          { t: "text", text: "Ending", size: 17, color: UI.K.rust, align: "center", upper: true, gap: 2 },
          { t: "head", text: e.title, align: "center", size: 26 },
          { t: "custom", h: 64, draw: (c, x, y, w) => { UI.sprite(c, Art.person("archivist", "down", 0), x + w / 2 - 54, y, 3); UI.sprite(c, Art.icon("cat"), x + w / 2 + 6, y + 18, 3); } }]
          .concat(e.text.map((t) => ({ t: "text", text: t })))
          .concat(e.theoMom ? [{ t: "note", text: e.theoMom }] : [])
          .concat([{ t: "bubble", text: e.epilogue },
            DEBUG && { t: "text", text: `Truth ${S().stats.truth} · Compliance ${S().stats.compliance} · Town Memory ${S().stats.memory} · Theo: ${S().theo} · Ruth: ${S().ruth} · Exhibit: ${S().exhibit && S().exhibit.tone} · Plaque: ${S().plaque}`, size: 18, color: UI.K.teal, align: "center" },
            { t: "btn", label: "Open notebook", icon: icon("notebook"), onTap: openNotebook },
            { t: "btn", label: "Play again from Day 1", primary: true, onTap: () => { L.newGame(); startScene(); } }]) },
        { t: "space", h: 20 }] });
    }
  }

  function ledgerEls(stories, edition) {
    return [{ t: "masthead", title: "The Hollow Creek Ledger", sub: edition + " · Est. 1898" }]
      .concat(stories.map((s) => Object.assign({ t: "story" }, s)))
      .concat([{ t: "text", text: "Curated with care by The Memory Keeper · A Lumen Community Service", size: 17, color: UI.K.teal, align: "center" }]);
  }

  function startScene() {
    UI.clear();
    if (S().scene === "world" || S().scene === "evening") enterWorld(); else openSceneScreen();
  }

  function beginDay(n) { L.beginDay(n); UI.clear(); enterWorld(); }

  // ---------- world ----------
  function enterWorld() {
    const p = S().pos;
    World.npcs = [];
    World.load(p.room, p.x, p.y, p.dir);
    if (S().scene === "evening") { fx.evening = 0; openEvening(); return; }
    checkVisitor(false);
  }

  // Bring whoever is due to the front desk. walkIn: arrive through the door (bell) vs. already waiting.
  function checkVisitor(walkIn) {
    const who = L.visitorDue();
    if (!who) return;
    if (World.roomId !== "desk") { if (walkIn) { UI.toast("The bell rings upstairs at the front desk."); } return; }
    if (World.npcs.some((n) => n.name === who)) return;
    if (who === "june") return void setTimeout(() => {
      if (World.roomId !== "desk" || World.npcs.some((n) => n.name === "june") || S().flags.juneDone) return;
      World.spawnNpc("june", (n) => { n.bubble = true; if (!UI.top()) juneDialog(); });
    }, 900);
    if (!walkIn) { World.placeNpc(who); return; }
    fx.bellUntil = time + 1.4;
    UI.toast("The bell rings at the front desk.");
    World.spawnNpc(who, (n) => { n.bubble = true; });
  }
  function talkTo(who) {
    if (who === "june") return S().flags.juneDone ? null : juneDialog();
    if (L.visitorDue() !== who) return;
    if (S().day === 3) return ({ theo: theo3Dialog, aide: plaqueDialog })[who]();
    ({ theo: theoDialog, ruth: ruthDialog, aide: aideDialog })[who]();
  }

  World.onRoomChange = (id) => { S().pos.room = id; savePos(true); if (id === "desk") checkVisitor(true); };
  World.onInteract = (o) => {
    if (o.npc) return talkTo(o.npc);
    const tx = { desk: World.roomId === "basement" ? { x: 8, y: 2, dir: "down" } : { x: 1, y: 2, dir: "down" }, stacks: World.roomId === "server" ? { x: 8, y: 2, dir: "down" } : D.rooms.stacks.start, basement: D.rooms.basement.start, server: D.rooms.server.start };
    switch (o.act) {
      case "door": { const d = tx[o.arg]; World.changeRoom(o.arg, d.x, d.y, d.dir); break; }
      case "locked":
        if (o.arg === "basement" && S().flags.keyTaken) { const d = tx.basement; World.changeRoom("basement", d.x, d.y, d.dir); }
        else if (o.arg === "server" && S().flags.serverOpen) { const d = tx.server; World.changeRoom("server", d.x, d.y, d.dir); }
        else UI.toast(o.arg === "basement" ? D.text.basementLocked : D.text.serverLocked);
        break;
      case "search": if (!L.findDoc(o.arg)) UI.toast(D.flavor[{ cabinet: "cabinetEmpty", console: "consoleDone" }[o.kind] || "boxEmpty"]); break;
      case "flavor": UI.toast(D.flavor[o.arg]); break;
      case "cat": UI.toast(D.text.catLines[Math.floor(Math.random() * D.text.catLines.length)]); break;
      case "inbox":
        if (S().day === 2 && !S().flags.keyTaken) envelopeDialog();
        else if (!S().flags.juneDone) UI.toast("The tray is empty.");
        else openInbox();
        break;
      case "terminal": openTerminal(); if (S().day === 3) L.openServer(); break;
      case "bell": { const who = L.visitorDue(); if (who && who !== "june" && World.npcs.some((n) => n.name === who && !n.path.length)) talkTo(who); else { fx.bellUntil = time + 0.6; UI.toast("No one's here. You give the bell a tiny ring anyway."); } break; }
      case "frontDoor": if (L.canClose()) closeUpDialog(); else UI.toast(D.flavor.frontDoorEarly); break;
      case "shelfNew": openShelfNew(); break;
      case "shelf2016": openShelf2016(); break;
      case "catalogue": openCatalogue(); break;
    }
  };

  function savePos(force) {
    const t = World.playerTile(), p = S().pos;
    if (force || p.x !== t.x || p.y !== t.y || p.dir !== World.player.dir) { p.room = World.roomId; p.x = t.x; p.y = t.y; p.dir = World.player.dir; L.save(); }
  }

  // ---------- dialogs ----------
  function dialog(id, title, portraitImg, nodes, opts) {
    const s = { id, kind: "dialog", title, portrait: portraitImg, nodes, at: 0, closable: false };
    s.build = () => {
      const n = s.nodes[s.at];
      return [n.quote && { t: "quote", blocks: n.quote }]
        .concat(n.lines.map((l) => ({ t: "line", text: l })))
        .concat(n.choices.map((ch, i) => ({ t: "card", label: ch.label, tag: ch.tag, hitLabel: (ch.tag ? ch.tag + ": " : "") + ch.label, note: ch.note, disabled: ch.disabled, icon: ch.disabled ? icon("lock") : null, selected: i === 0 && !ch.disabled, onTap: () => {
          if (ch.fn) ch.fn(s); else { s.at = ch.next; s.scroll = 0; }
        } })));
    };
    UI.open(s);
    return s;
  }

  function juneDialog() {
    if (UI.top() && UI.top().id === "june") return;
    const v = D.visitors.june;
    dialog("june", v.name, portrait("june"), v.nodes.map((n) => ({
      lines: n.lines,
      choices: n.choices.map((c) => c.action ? { label: c.label, fn: () => { UI.close(); L.receiveBox(); World.npcLeave("june"); } } : c)
    })));
  }

  function theoDialog() {
    const v = D.visitors.theo;
    const choices = L.publicDocs().map((id) => ({ label: `${v.handPrefix} “${L.descOf(id).label}”`, fn: (s) => theoReads(s, id) }))
      .concat([{ label: v.askMK, fn: (s) => theoReads(s, "mk") }, { label: v.nothing, fn: (s) => theoReads(s, null) }]);
    dialog("theo", v.name, portrait("theo"), [{ lines: v.intro, choices }]);
  }
  function theoReads(s, id) {
    const v = D.visitors.theo, r = L.theoRead(id);
    if (r.belief === null) { s.nodes.push({ quote: r.quote, lines: [v.tooEarly], choices: s.nodes[0].choices }); s.at = s.nodes.length - 1; s.scroll = 0; return; }
    s.nodes.push({ quote: r.quote, lines: v.reactions[r.belief].concat([v.thanks]), choices: [{ label: v.goodbye, fn: () => {
      L.finishTheo(r.belief); UI.close(); World.npcLeave("theo"); UI.toast(v.exitToast);
    } }] });
    s.at = s.nodes.length - 1; s.scroll = 0;
  }

  function envelopeDialog() {
    dialog("envelope", D.day2.envelopeTitle, Art.icon("key"), [{ lines: D.day2.envelope, choices: [
      { label: D.day2.takeKey, fn: () => { UI.close(); L.takeKey(); } }] }]);
  }

  function ruthDialog() {
    const v = D.visitors.ruth, drift = L.ruthDrift();
    const shown = (id) => (s) => {
      s.nodes.push({ quote: L.original(id), lines: v.shown[id].concat([v.remembersEnd]), choices: [{ label: v.wave, fn: () => endRuth("remembers") }] });
      s.at = s.nodes.length - 1; s.scroll = 0;
    };
    const choices = L.ruthCanShow().map((id) => ({ label: `${v.showPrefix} “${L.descOf(id).label}”`, fn: shown(id) }))
      .concat([
        { label: v.ledgerRight, fn: (s) => { s.nodes.push({ lines: v.consulted, choices: [{ label: v.wave, fn: () => endRuth("consulted") }] }); s.at = s.nodes.length - 1; s.scroll = 0; } },
        { label: v.thank, fn: (s) => {
          const belief = { low: "remembers", mid: "unsure", high: "consulted" }[drift];
          s.nodes.push({ lines: v.thanked[drift], choices: [{ label: v.wave, fn: () => endRuth(belief, drift === "low" ? "thankedLow" : "unsure") }] }); s.at = s.nodes.length - 1; s.scroll = 0;
        } }]);
    dialog("ruth", v.name, portrait("ruth"), [{ lines: v.intro.concat([v.drift[drift]]), choices }]);
  }
  function endRuth(belief, effKey) {
    L.finishRuth(belief, effKey); UI.close(); World.npcLeave("ruth"); UI.toast(D.visitors.ruth.goodbye);
    setTimeout(() => checkVisitor(true), 2500);
  }

  function aideDialog() {
    const v = D.visitors.aide;
    const pick = (id) => (s) => {
      const tone = L.exhibitTone(id);
      const quote = id === "mk" ? [{ s: "mk", t: v.mkPick }] : id ? L.publicBlocks(id, true) : null;
      s.nodes.push({ quote, lines: v.reactions[tone].concat([v.thanks]), choices: [{ label: v.goodbye, fn: () => {
        L.finishAide(id); UI.close(); World.npcLeave("aide"); UI.toast(v.exitToast);
      } }] });
      s.at = s.nodes.length - 1; s.scroll = 0;
    };
    const choices = L.publicDocs().map((id) => ({ label: `${v.lendPrefix} “${L.descOf(id).label}”`, fn: pick(id) }))
      .concat([{ label: v.letMK, fn: pick("mk") }, { label: v.nothing, fn: pick(null) }]);
    dialog("aide", v.name, portrait("aide"), [{ lines: v.intro, choices }]);
  }

  function theo3Dialog() {
    const v = D.visitors.theo3;
    const push = (s, node) => { s.nodes.push(node); s.at = s.nodes.length - 1; s.scroll = 0; };
    const receive = () => { UI.close(); L.receiveProject(); World.npcLeave("theo"); UI.toast(v.exitToast); };
    const choices = [{ label: v.accept, fn: (s) => push(s, { quote: L.original("project"), lines: ["(He unrolls it on the desk and immediately looks embarrassed.)"], choices: [{ label: v.bye, fn: receive }] }) }];
    if (L.has(S().clues, "pet-lin")) choices.push({ label: v.askMom, fn: (s) => { L.askTheoMom(); push(s, { lines: v.mom, choices: [{ label: v.accept, fn: receive }] }); } });
    dialog("theo3", v.name, portrait("theo"), [{ lines: v.intro.concat([v.byBelief[S().theo || "none"]]), choices }]);
  }

  function plaqueDialog() {
    const v = D.visitors.plaque;
    const choices = v.options.map((o) => {
      const locked = L.plaqueLocked(o);
      return locked ? { label: "Look closer at the evidence first", tag: o.tag, note: v.locked, disabled: true }
        : { label: "“" + o.text + "”", tag: o.tag, fn: (s) => {
          s.nodes.push({ lines: o.reaction, choices: [{ label: v.bye, fn: () => { L.finishPlaque(o.id); UI.close(); World.npcLeave("aide"); UI.toast(v.exitToast); } }] });
          s.at = s.nodes.length - 1; s.scroll = 0;
        } };
    });
    dialog("plaque", v.name, portrait("aide"), [{ lines: v.intro, choices }]);
  }

  function closeUpDialog() {
    dialog("closeup", "Front door", Art.icon("notebook"), [{ lines: [D.flavor.closePrompt], choices: [
      { label: "Switch off the lamps and lock up", fn: () => { UI.close(); S().scene = "evening"; savePos(true); fx.evening = 0; openEvening(); } },
      { label: "Not yet", fn: () => UI.close() }] }]);
  }

  function openEvening() {
    const today = L.dayDocs(), kept = today.filter((id) => S().docs[id].status === "kept").length, disc = today.filter((id) => S().docs[id].status === "discarded").length;
    const st = S();
    const summary = `Today you filed ${kept} record${kept === 1 ? "" : "s"}${disc ? ` and let ${disc} go` : ""}. Your notebook holds ${st.clues.length} observation${st.clues.length === 1 ? "" : "s"}${st.notes.length ? ` and ${st.notes.length} thing${st.notes.length === 1 ? "" : "s"} that don't quite line up` : ""}.`;
    const mk = st.digest ? D.text.mk.eveningDigest.replace("{n}", st.digest).replace("{stories}", st.digest === 1 ? "story is" : "stories are") : D.text.mk.eveningNone;
    setTimeout(() => {
      const s = { id: "evening", kind: "dialog", title: "Evening", portrait: Art.icon("cat"), closable: false };
      s.build = () => [{ t: "line", text: "(" + D.text.eveningIntro + ")" }, { t: "text", text: summary }, { t: "bubble", text: mk },
        { t: "btn", label: "Go home for the night", primary: true, onTap: () => setScene(S().day >= 3 ? "finale" : "ledger" + (S().day + 1)) }];
      UI.open(s);
    }, 1800);
  }

  // ---------- panels ----------
  function panel(id, title, sub, iconImg, build, footer) { const s = { id, kind: "panel", title, sub, icon: iconImg, build, footer }; UI.open(s); return s; }

  function openInbox() {
    panel("inbox", "Inbox tray", ["", D.text.inboxFlavor, "Brought up from the basement boxes.", "From the Server Room, and from Theo."][S().day], null, () => {
      const ids = L.inbox();
      return ids.length ? ids.map((id) => ({ t: "card", icon: docIcon(id), label: D.docs[id].title, note: `${D.docs[id].kind} · ${D.docs[id].date}`, onTap: () => openDoc(id) }))
        : [{ t: "text", text: "The tray is empty.", color: UI.K.soft }];
    });
  }

  function hotFor(id, s) {
    return { magnify: s.magnify, found: (c) => L.has(S().clues, c), onTap: (c) => {
      if (!s.magnify) return UI.toast("Turn on the magnifier to look closer.");
      if (!L.addClue(id, c)) UI.toast("Already in your notebook: " + D.docs[id].clues[c]);
    } };
  }
  function docEl(id, s, hot) { return { t: "doc", blocks: L.original(id), hot: hot ? hotFor(id, s) : null, card: D.docs[id].paper === "card" }; }
  function magnifierBtn(s) { return { t: "btn", label: "Magnifier " + (s.magnify ? "on" : "off"), icon: icon("magnifier"), on: s.magnify, h: 46, onTap: () => { s.magnify = !s.magnify; } }; }

  function openDoc(id) {
    const d = D.docs[id];
    const s = panel("doc:" + id, d.title, `${d.kind} · ${d.date}`, docIcon(id), null, null);
    s.magnify = false; s.peek = false;
    s.onClose = () => {};
    s.build = () => {
      const st = S().docs[id];
      if (st.status !== "inbox") return [];
      const step = ["examine", "describe", "circulate"].indexOf(st.step);
      const stepper = { t: "stepper", steps: ["Examine", "Describe", "Circulate"], current: step };
      if (st.step === "examine") return [stepper, magnifierBtn(s),
        { t: "text", text: `Details noted: ${L.cluesFound(id)}`, size: 19, color: UI.K.soft, align: "right", gap: 4 },
        docEl(id, s, true),
        { t: "text", text: s.magnify ? "Tap anything that seems worth noting." : "Turn on the magnifier to look closer.", size: 19, color: UI.K.soft, align: "center" }];
      if (st.step === "describe") return [stepper,
        { t: "text", text: "How should the catalogue describe it? This becomes its public headline.", head: true, size: 18, line: 22 }]
        .concat(d.descriptions.map((o) => {
          const locked = L.isDescLocked(o);
          return locked ? { t: "card", disabled: true, icon: icon("lock"), label: "Look closer at the document", note: "You haven't noticed what this description would rely on." }
            : { t: "card", tag: o.suggested ? "Suggested by the Memory Keeper" : null, hitLabel: (o.suggested ? "Suggested by the Memory Keeper: " : "") + "“" + o.label + "”", label: "“" + o.label + "”", note: o.note, onTap: () => { L.describe(id, o.id); s.scroll = 0; s.peek = false; } };
        }))
        .concat([{ t: "toggle", label: "Look at the document again", open: s.peek, onTap: () => { s.peek = !s.peek; } }])
        .concat(s.peek ? [magnifierBtn(s), docEl(id, s, true)] : []);
      // circulate
      return [stepper,
        { t: "panel", fill: UI.K.paper, pad: 12, els: [{ t: "text", text: "Your description", size: 18, color: UI.K.soft, gap: 2 }, { t: "text", text: "“" + L.descOf(id).label + "”", head: true, size: 19, line: 23 }] },
        { t: "bubble", name: "The Memory Keeper · summary", text: d.summary, aside: d.mkNote },
        { t: "toggle", label: "Compare with the original", open: s.peek, onTap: () => { s.peek = !s.peek; } }]
        .concat(s.peek ? [magnifierBtn(s), docEl(id, s, true)] : [])
        .concat([{ t: "text", text: "Which version should circulate?", head: true, size: 18 }])
        .concat(Object.keys(D.circulation).map((k) => ({ t: "card", label: D.circulation[k].label, note: D.circulation[k].blurb, onTap: () => { L.circulate(id, k); closeTo("inbox"); } })));
    };
    s.footer = () => {
      const st = S().docs[id];
      if (st.status !== "inbox" || st.step !== "examine") return null;
      return { t: "row", items: [{ label: "Discard", onTap: () => discardDialog(id) }, { label: "Keep", primary: true, onTap: () => { L.keep(id); s.scroll = 0; s.magnify = false; } }] };
    };
  }

  function closeTo(id) { while (UI.top() && UI.top().id !== id) UI.stack.pop(); if (UI.top() && UI.top().id === "inbox" && !L.inbox().length) UI.stack.pop(); }

  function discardDialog(id) {
    dialog("discard", "The Memory Keeper", Art.icon("mk"), [{ lines: D.text.mk.discard, choices: [
      { label: "Discard the original", fn: () => { UI.close(); L.discard(id); closeTo("inbox"); } },
      { label: "Actually, wait", fn: () => UI.close() }] }]);
  }

  function openTerminal() {
    // The greeting is fixed when the terminal opens (opening it on Day 3 also unlocks the Server Room).
    const greet = S().day === 1 && !S().flags.juneDone ? D.text.mk.greetMorning : S().day === 2 && !S().flags.keyTaken ? D.day2.mkGreet : S().day === 3 && !S().flags.serverOpen ? D.day3.mkGreet : L.inbox().length ? D.text.mk.greetWorking : D.text.mk.greetDone;
    panel("terminal", "The Memory Keeper", "Lumen · Hollow Creek Archive Assistant", icon("mk"), () => {
      const idx = L.filed();
      return [{ t: "bubble", text: greet }, { t: "bar", label: "Anniversary digest", value: S().digest, max: 3 },
        { t: "head", text: "My index", size: 18 }]
        .concat(idx.length ? idx.map((id) => ({ t: "note", text: D.docs[id].title + ": " + D.docs[id].summary })) : [{ t: "text", text: "Nothing indexed yet today.", color: UI.K.soft }]);
    });
  }

  function openNotebook() {
    panel("notebook", "Notebook", "Things you've noticed", icon("notebook"), () => {
      const notes = D.discrepancies.filter((d) => L.has(S().notes, d.id));
      const obs = [];
      L.DOC_ORDER.forEach((id) => Object.keys(D.docs[id].clues).forEach((c) => { if (L.has(S().clues, c)) obs.push(D.docs[id].clues[c]); }));
      return [{ t: "head", text: "Doesn't line up", size: 18 }]
        .concat(notes.length ? notes.map((n) => ({ t: "note", text: n.text })) : [{ t: "text", text: "Nothing yet.", color: UI.K.soft }])
        .concat([{ t: "head", text: "Observations", size: 18 }])
        .concat(obs.length ? obs.map((o) => ({ t: "text", text: "· " + o })) : [{ t: "text", text: "Use the magnifier on documents to note details.", color: UI.K.soft }]);
    });
  }

  function openShelfNew() {
    panel("shelfNew", "Newly filed", "The full collection, including closed storage.", null, () => {
      const ids = L.filed();
      return ids.length ? ids.map((id) => {
        const st = S().docs[id];
        return { t: "card", icon: docIcon(id), label: st.status === "kept" ? L.descOf(id).label : D.docs[id].title,
          note: st.status === "discarded" ? "Discarded · Memory Keeper index only" : D.circulation[st.circ].access, onTap: () => openFiled(id) };
      }) : [{ t: "text", text: "Nothing filed yet. Documents you keep at the front desk will appear here.", color: UI.K.soft }];
    });
  }
  function openFiled(id) {
    const d = D.docs[id], st = S().docs[id];
    const s = panel("filed:" + id, st.status === "kept" ? L.descOf(id).label : d.title, `${d.kind} · ${d.date}`, docIcon(id), null);
    s.magnify = false;
    s.build = () => st.status === "discarded"
      ? [{ t: "text", text: "You discarded the original.", color: UI.K.soft }, { t: "bubble", name: "The Memory Keeper's index", text: d.summary }]
      : [{ t: "text", text: `Circulating: ${D.circulation[st.circ].label}`, size: 19, gap: 2 }, { t: "text", text: `Original: ${D.circulation[st.circ].access}`, size: 19 },
        { t: "bubble", name: "Memory Keeper summary", text: d.summary }, magnifierBtn(s), docEl(id, s, true)];
  }

  function openShelf2016() {
    panel("shelf2016", "Spring 2016 shelf", "Already in the collection.", null, () => Object.keys(D.shelved).map((id) => {
      const it = D.shelved[id];
      return { t: "card", icon: docIcon(id), label: it.title, note: it.date, onTap: () => openShelved(id) };
    }));
  }
  function openShelved(id) {
    const it = D.shelved[id];
    L.markSeen(id);
    const s = panel("shelved:" + id, it.title, it.date, docIcon(id), null);
    s.asked = false;
    s.build = () => [{ t: "doc", blocks: it.body }]
      .concat(it.ask ? (s.asked ? [{ t: "bubble", text: it.ask }] : [{ t: "btn", label: "Ask the Memory Keeper", icon: icon("mk"), onTap: () => { s.asked = true; } }]) : []);
  }

  function openCatalogue() {
    panel("catalogue", "Card catalogue", "What any visitor can find.", null, () => {
      const pub = L.publicDocs(), disc = L.DOC_ORDER.filter((id) => S().docs[id].status === "discarded").length;
      const tag = (id) => ({ summary: "Summary", both: "Summary + original", original: "Hand-catalogued" })[S().docs[id].circ];
      return [{ t: "head", text: "Newly catalogued", size: 18 }]
        .concat(pub.length ? pub.map((id) => ({ t: "card", icon: docIcon(id), label: L.descOf(id).label, note: tag(id), onTap: () => openPublic(id) })) : [{ t: "text", text: "Nothing new yet.", color: UI.K.soft }])
        .concat(disc ? [{ t: "text", text: `${disc} donated item${disc === 1 ? " is" : "s are"} not in the catalogue. (The Memory Keeper's index still lists ${disc === 1 ? "it" : "them"}.)`, size: 19, color: UI.K.teal }] : [])
        .concat([{ t: "head", text: "Spring 2016", size: 18 }])
        .concat(Object.keys(D.shelved).map((id) => ({ t: "card", icon: docIcon(id), label: D.shelved[id].title, note: D.shelved[id].date, onTap: () => openShelved(id) })));
    });
  }
  function openPublic(id) {
    panel("public:" + id, "Public catalogue", D.docs[id].date, docIcon(id), () => [{ t: "doc", blocks: L.publicBlocks(id, false) }]);
  }

  // ---------- HUD ----------
  function drawHud(c) {
    c.fillStyle = "#2a201a"; c.fillRect(0, 0, W, HUD_H);
    c.fillStyle = "#4a2f1f"; c.fillRect(0, HUD_H - 3, W, 3);
    const room = World.room ? World.room.name : "";
    UI.text(c, room, 14, 8, W - 120, { font: UI.font(19, true, true), color: UI.K.paper, line: 20 }, true);
    UI.text(c, `Day ${S().day} · ${L.clock(S().time)}`, 14, 29, W - 120, { font: UI.font(20), color: "#c9b48f", line: 20 }, true);
    // notebook button
    const bx = W - 56, by = 6;
    UI.frame(c, bx, by, 46, 44, UI.K.paper, UI.K.ink, false);
    UI.sprite(c, icon("notebook"), bx + 7, by + 6, 2);
    if (S().notes.length) { UI.frame(c, bx + 28, by - 4, 22, 20, UI.K.rust, UI.K.ink, false); UI.text(c, String(S().notes.length), bx + 28, by - 3, 22, { font: UI.font(18, true, true), color: UI.K.paper, align: "center", line: 18 }, true); }
    UI.hit(bx, by, 46, 44, openNotebook, "notebook");
    if (DEBUG) UI.text(c, `T${S().stats.truth} C${S().stats.compliance} M${S().stats.memory}`, W - 170, 32, 110, { font: UI.font(16), color: "#7cc4bc", line: 16 }, true);
  }

  function drawObjective(c) {
    const obj = L.objective(), hint = hintTimer < 12 && !S().flags.juneDone ? "Tap anywhere to walk. Tap things to use them." : "";
    if (!obj && !hint) return;
    const below = view.y + view.h + 8, w = Math.min(W - 16, 480), x = (W - w) / 2;
    const msg = [obj, hint].filter(Boolean).join("  ");
    const h = UI.text(c, msg, 0, 0, w - 24, { font: UI.font(20), line: 21 }, false) + 18;
    const y = below + h <= H - 4 ? below : view.y + view.h - h - 6;
    UI.frame(c, x, y, w, h, "rgba(251,244,226,.95)", UI.K.ink, false);
    UI.text(c, msg, x + 12, y + 9, w - 24, { font: UI.font(20), line: 21 }, true);
  }

  // ---------- loop ----------
  function frame(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts; time += dt;
    UI.hits = [];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#1c1511"; ctx.fillRect(0, 0, cv.width, cv.height);
    const sc = S().scene;
    if (sc === "world" || sc === "evening") {
      if (held && !UI.top() && sc === "world") World.keyStep(held);
      World.update(dt);
      if (sc === "evening") fx.evening += dt;
      saveTimer += dt; hintTimer += dt;
      if (saveTimer > 1 && !World.player.path.length && sc === "world") { saveTimer = 0; savePos(false); }
      const st = {
        t: time, inbox: L.inbox().length, glowInbox: L.inbox().length > 0 || (S().day === 2 && !S().flags.keyTaken), glowFront: L.canClose() && sc === "world",
        bellRinging: time < fx.bellUntil, newCount: Math.min(4, L.filed().length), glowShelf: false,
        basementOpen: !!S().flags.keyTaken, serverOpen: !!S().flags.serverOpen, glowServer: S().day === 3 && !!S().flags.serverOpen, found: L.foundToday(), glowBoxes: S().day === 2 && !!S().flags.keyTaken,
        lampsOn: sc === "evening" ? (fx.evening < 0.6 ? 2 : fx.evening < 1.2 ? 1 : 0) : 2,
        daylight: sc === "evening" ? 0 : 1,
        dark: sc === "evening" ? Math.min(0.55, fx.evening * 0.35) : 0
      };
      World.render(wctx, time, st);
      ctx.drawImage(world, view.xd, view.yd, view.wd, view.hd);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawHud(ctx);
      if (sc === "world") drawObjective(ctx);
    } else ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    UI.draw(ctx, W, H, time);
    const top = UI.top(), inPanel = top && top.kind === "panel";
    UI.drawToasts(ctx, W, (sc === "world" || sc === "evening") ? HUD_H + 6 : 8, dt, inPanel ? H - (top.footer && top.footer() ? 96 : 24) : 0);
    requestAnimationFrame(frame);
  }

  // ---------- input ----------
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); UI.down(...pos(e)); });
  cv.addEventListener("pointermove", (e) => UI.move(...pos(e)));
  cv.addEventListener("pointerup", (e) => {
    const [x, y] = pos(e), p = UI.pointer;
    if (!p) return;
    UI.pointer = null;
    if (p.moved) return;
    if (UI.tapAt(x, y)) return;
    if (!UI.top() && S().scene === "world" && x >= view.x && x < view.x + view.w && y >= view.y && y < view.y + view.h) {
      World.tap((x - view.x) * dpr / view.s, (y - view.y) * dpr / view.s);
    }
  });
  cv.addEventListener("wheel", (e) => { if (UI.top()) { e.preventDefault(); UI.wheel(...pos(e), e.deltaY); } }, { passive: false });
  const KEYS = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
  window.addEventListener("keydown", (e) => {
    const top = UI.top();
    if (top) {
      if (e.key === "Escape" && top.closable !== false && top.kind !== "full") UI.close();
      if (e.key === "ArrowDown") UI.wheel(0, 0, 60); if (e.key === "ArrowUp") UI.wheel(0, 0, -60);
      return;
    }
    if (S().scene !== "world") return;
    if (KEYS[e.key]) { held = KEYS[e.key]; e.preventDefault(); }
    if (e.key === "Enter" || e.key === " ") { World.keyInteract(); e.preventDefault(); }
    if (e.key === "n") openNotebook();
  });
  window.addEventListener("keyup", (e) => { if (KEYS[e.key] === held) held = null; });

  // ---------- debug hooks (used by automated playtests) ----------
  if (DEBUG) window.__archive = {
    state: () => L.S, scene: () => L.S.scene, screen: () => (UI.top() ? UI.top().id : null), room: () => World.roomId,
    hits: () => UI.hits.map((h) => ({ label: h.label, x: h.x + h.w / 2, y: h.y + h.h / 2 })),
    objCenter: (id) => { const r = World.objRect(id); return r && { x: view.x + (r.x + r.w / 2) * view.s / dpr, y: view.y + (r.y + r.h / 2) * view.s / dpr }; },
    player: () => World.playerTile(), moving: () => World.player.path.length > 0 || !!World.fading,
    npcs: () => World.npcs.map((n) => ({ name: n.name, moving: n.path.length > 0, bubble: n.bubble })),
    scroll: (dy) => UI.wheel(0, 0, dy)
  };

  // ---------- boot ----------
  resize();
  Promise.race([
    Promise.all([document.fonts.load('20px "VT323"'), document.fonts.load('20px "Pixelify Sans"')]),
    new Promise((res) => setTimeout(res, 2500))
  ]).then(() => { openSceneScreen(); requestAnimationFrame(frame); });
})();
