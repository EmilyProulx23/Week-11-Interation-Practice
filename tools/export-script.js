// Exports all Day 1 writing from js/data.js into a readable script for review.
// Usage: node tools/export-script.js   → writes docs/script.md
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "js/data.js"), "utf8"), sandbox);
const D = sandbox.window.GAME_DATA;

// Markup blocks ({ s: styles, t: text }) → Markdown. Hotspots become **bold** with a [clue] tag.
const hot = (t) => t.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "**$2** `[clue: $1]`").replace(/\n/g, "  \n");
const md = (b) => {
  const s = " " + b.s + " ", t = hot(b.t);
  if (s.includes(" h ")) return "### " + t;
  if (s.includes(" hand ")) return "_✍️ " + t + "_";
  if (s.includes(" photo ")) return "📷 _" + t + "_";
  if (s.includes(" tag ")) return "🏷️ `" + b.t + "`";
  if (s.includes(" caps ")) return t.toUpperCase();
  return t;
};
const quote = (s) => s.split("\n").map((l) => "> " + l).join("\n");
const line = (who, l) => l.startsWith("(") ? `_${l}_` : `**${who}:** ${l}`;
const fxStr = (e) => Object.keys(e || {}).map((k) => `${k} ${e[k] > 0 ? "+" : ""}${e[k]}`).join(", ") || "none";

const out = [];
const P = (...s) => out.push(...s, "");
const ICON = { program: "🍎", letter: "✉️", photo: "📷", book: "📒", notice: "📌", volume: "📚", contract: "📜", petition: "📝", memo: "🗒️" };

P("# The Archive — Script (Days 1–2)", "# Day 1",
  "_Generated from `js/data.js` by `node tools/export-script.js`. Edit the data file, not this one._",
  "Legend: **bold** + `[clue: id]` = a detail the player can tap with the magnifier. _Italics_ = stage directions. Effects (`truth`, `compliance`, `memory`) are hidden from the player.");

P("## Title screen", quote(D.text.titleBlurb));

P("## 1. Morning Ledger", `_${D.text.ledger1Intro}_`, `**The Hollow Creek Ledger: ${D.ledgerDay1.edition}**`);
D.ledgerDay1.stories.forEach((s) => P(`- **${s.head}:** ${s.body}`));

P("## 2. Front Desk", `_${D.text.deskFlavor}_`, "**Memory Keeper terminal greetings**",
  `- Before the donation: ${D.text.mk.greetMorning}`,
  `- While documents wait: ${D.text.mk.greetWorking}`,
  `- All filed: ${D.text.mk.greetDone}`);

const june = D.visitors.june;
P(`## 3. Visitor: ${june.name}`);
june.nodes.forEach((n, i) => {
  P(`**Node ${i}**`, ...n.lines.map((l) => line("June", l)));
  P(...n.choices.map((c) => `- ➤ ${c.label}${c.next != null ? ` → node ${c.next}` : ""}${c.action ? ` → _${c.action}_` : ""}`));
});
P(`_Inbox:_ ${D.text.inboxFlavor}`);

P("## 4. Documents",
  "Each document: **Examine** (magnifier) → **Keep / Discard** → **Describe** (pick 1 of 3) → read the Memory Keeper summary → **Circulate**.",
  "**Discard dialogue (Memory Keeper):**", ...D.text.mk.discard.map((l) => quote(l)),
  "**Circulation options (shared by all documents):**",
  ...Object.keys(D.circulation).map((k) => `- **${D.circulation[k].label}:** ${D.circulation[k].blurb} _(effects: ${fxStr(D.circulation[k].effects)}; summary-only also costs truth equal to the document's summary loss)_`));

function docSection(id, i, n) {
  const d = D.docs[id];
  P(`### ${n}.${i + 1} ${ICON[d.icon] || ""} ${d.title}`, `_${d.kind} · ${d.date}_`, "**Original**", quote(d.original.map(md).join("\n\n")));
  P("**Clues (notebook text)**", ...Object.keys(d.clues).map((c) => `- \`${c}\`: ${d.clues[c]}`));
  P(`**Memory Keeper summary** _(summary loss: ${d.summaryLoss})_`, quote(d.summary), "", `_Memory Keeper aside:_ ${d.mkNote}`);
  P("**Descriptions**", ...d.descriptions.map((o) =>
    `- ${o.suggested ? "✨ " : ""}“${o.label}” _(${o.framing}${o.requires ? `; unlocks with ${[].concat(o.requires).join(" or ")}` : ""}; effects: ${fxStr(o.effects)})_: ${o.note}`));
  P("**Day 2 Ledger line, by circulation**", ...Object.keys(d.ledger).map((k) => `- _${k}:_ ${d.ledger[k]}`));
}
D.days[1].docs.forEach((id, i) => docSection(id, i, 4));

P("## 5. The Stacks", `_${D.text.stacksFlavor}_`,
  `- Archivist view: _${D.text.stacksArchivist}_`, `- Public view: _${D.text.stacksPublic}_`,
  `- Pocket the cat: ${D.text.catLines.map((l) => `“${l}”`).join(" / ")}`,
  `- Basement door: ${D.text.basementLocked}`, `- Server room door: ${D.text.serverLocked}`);
Object.keys(D.shelved).forEach((id) => {
  const it = D.shelved[id];
  P(`### ${ICON[it.icon] || ""} ${it.title} (${it.date})`, quote(it.body.map(md).join("\n\n")));
  if (it.ask) P(`_Ask the Memory Keeper:_ ${it.ask}`);
});

P("## 6. Notebook: “Doesn't line up”", "_Written automatically when the player has seen both sides._",
  ...D.discrepancies.map((d) => {
    const n = d.needs;
    const need = [].concat((n.clues || []).map((c) => "clue " + c), (n.seen || []).map((c) => "read " + c), (n.summaries || []).map((c) => "summary of " + c)).join(" + ");
    return `- _(${need})_ ${d.text}`;
  }));

const theo = D.visitors.theo;
P(`## 7. Visitor: ${theo.name}`, "_Arrives once all three documents are filed._", ...theo.intro.map((l) => line("Theo", l)),
  `- ➤ ${theo.handPrefix} “<description of any public record>”`, `- ➤ ${theo.askMK}`, `- ➤ ${theo.nothing}`,
  `**If handed the Harvest Fair program:** ${theo.tooEarly}`,
  `**If the player asks the Memory Keeper:** ${theo.mkAnswer}`,
  `**If the record circulates as both, he notes:** _${theo.fetchesOriginal}_`,
  "**Belief rule:** summary → consultation, summary+original → unsure, original → protest; a conflict description shifts one step toward protest, a consensus one shifts one step toward consultation.");
Object.keys(theo.reactions).forEach((b) => P(`**Believes “${b}”** _(effects: ${fxStr(theo.effects[b])})_`, ...theo.reactions[b].map((l) => line("Theo", l))));
P(line("Theo", theo.thanks), `- ➤ ${theo.goodbye}`);

P("## 8. Evening", `_${D.text.eveningIntro}_`, `**Memory Keeper:** ${D.text.mk.eveningDigest} / ${D.text.mk.eveningNone}`);
P("## 9. Day 2 Ledger (generated)", `_${D.text.ledger2Intro}_`,
  "Built from: a fixed lead story (exhibit plans), one Archive Corner item per document (headline = the player's description; body = the Ledger line for its circulation, above), and a Student Project Spotlight:",
  ...Object.keys(theo.ledgerTopic).map((b) => `- _${b}:_ “Theo Lin is researching ${theo.ledgerTopic[b]}…”`));
P("## 10. End of Day 1", D.text.endBody);

// ---------------- Day 2 ----------------
P("# Day 2", "## 11. Morning", "_The Day 2 Ledger is generated from Day 1 (see section 9)._",
  "**Memory Keeper greeting:** " + D.day2.mkGreet,
  `**${D.day2.envelopeTitle}**`, ...D.day2.envelope.map((l) => quote(l)), `- ➤ ${D.day2.takeKey}`, `_Toast:_ ${D.day2.keyToast}`);
P("## 12. Basement Records", `_${D.day2.basementFlavor}_`, "Three “Pending Review” boxes hold the day's documents. Tapping a box finds its document and sends it to the inbox.",
  ...["metalShelf", "lightsBox", "dehumidifier", "drip", "bucket", "boxEmpty"].map((k) => `- _${k}:_ ${D.flavor[k]}`));
P("## 13. Documents");
D.days[2].docs.forEach((id, i) => docSection(id, i, 13));
const ruth = D.visitors.ruth;
P(`## 14. Visitor: ${ruth.name}`, "_Arrives after two of the day's documents are filed._", ...ruth.intro.map((l) => line("Ruth", l)),
  "**Then one line, depending on how much of the Day 1 letter and photo circulated softly (summary, consensus description, or discarded):**",
  ...Object.keys(ruth.drift).map((k) => `- _${k} drift:_ ${ruth.drift[k]}`),
  `- ➤ ${ruth.showPrefix} “<any kept: photo, letter, petition, Clause 14>”`, `- ➤ ${ruth.ledgerRight}`, `- ➤ ${ruth.thank}`);
Object.keys(ruth.shown).forEach((id) => P(`**Shown the ${D.docs[id].title}:**`, ...ruth.shown[id].map((l) => line("Ruth", l)), line("Ruth", ruth.remembersEnd)));
P("**“The Ledger has it about right”:**", ...ruth.consulted.map((l) => line("Ruth", l)));
Object.keys(ruth.thanked).forEach((k) => P(`**Thanked (${k} drift):**`, ...ruth.thanked[k].map((l) => line("Ruth", l))));
P(`_${ruth.goodbye}_`, "**Effects:** " + Object.keys(ruth.effects).map((k) => `${k}: ${fxStr(ruth.effects[k])}`).join(" · "));
const aide = D.visitors.aide;
P(`## 15. Visitor: ${aide.name}`, "_Arrives after all of the day's documents are filed and Ruth has left._", ...aide.intro.map((l) => line("Priya", l)),
  `- ➤ ${aide.lendPrefix} “<any public record>”`, `- ➤ ${aide.letMK}`, `- ➤ ${aide.nothing}`, `**Memory Keeper's pick:** ${aide.mkPick}`,
  "**Tone rule:** same as Theo's belief rule. A record that reads as a consultation (or isn't about 2016) is “warm.”");
Object.keys(aide.reactions).forEach((k) => P(`**${k}** _(effects: ${fxStr(aide.effects[k])})_`, ...aide.reactions[k].map((l) => line("Priya", l))));
P(line("Priya", aide.thanks), `_Toast:_ ${aide.exitToast}`);
P("## 16. Day 3 Ledger (generated)", `_${D.day2.ledgerIntro}_`,
  "Lead story depends on the exhibit choice (warm / unsure / protest / Memory Keeper's pick / nothing). Then an Archive Corner item per Day 2 document, and “Goodbye, Alder Street” quoting Ruth:",
  ...Object.keys(ruth.ledger).map((k) => `- _${k}:_ ${ruth.ledger[k]}`));
P("## 17. End of Day 2 prototype", D.day2.endBody);

fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/script.md"), out.join("\n"));
console.log("Wrote docs/script.md");
