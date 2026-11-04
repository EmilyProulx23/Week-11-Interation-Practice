# The Archive — MVP Design

> A cozy archival simulator in Hollow Creek, where the town's memory is slowly, politely rewritten.

## 1. Pitch

Twenty years ago, Lumen signed an agreement with the small town of **Hollow Creek** to build a data center and digitize the town's public archives. Today Lumen's archival AI, **The Memory Keeper**, helps the town's archivist catalogue, summarize and share local history.

You are the **Archivist**. You never appear on screen, you have no name, and your gender is never given; townsfolk just call you "Archivist." You go through donated documents, decide what to keep, how to describe it, and which version reaches the public. Over three days, small discrepancies build up between the original documents, the Memory Keeper's summaries, the town newsletter and what visitors remember. Through them you piece together a conflict the town no longer remembers having.

## 2. Tone Pillars

1. **Cozy first.** The game starts as a gentle archival sim: warm lamps, paper, a sleeping archive cat, a bakery ad in the newsletter. Players should enjoy the work for its own sake.
2. **Unease emerges; it is never announced.** Nothing is scary. The tension comes only from *small discrepancies*: a summary that is 95% right, a headline that softens one word, a visitor who remembers a "consultation."
3. **No villains.** The Memory Keeper is always friendly, helpful and sincere. Lumen staff are pleasant. Whether the drift comes from *intentional manipulation* or *optimization* (for readability, cohesion, engagement) is **never resolved**.
4. **Description is never neutral.** Every way of describing a document is a choice, and that includes the "plain, literal" one.
5. **No moral scoreboard.** Rejecting the AI is not automatically right, and using it is not automatically wrong. The summaries can be accurate, readable and good for the town.

## 3. Setting & Buried History

- **Hollow Creek:** a small town with a creek, a green, a bakery, a high school and an old Town Hall with a records room.
- **Spring 2006:** the Lumen partnership is celebrated as economic revitalization. Some residents (led informally by retired teacher **Ruth Okafor**) learn that *Clause 14* makes Lumen the "sole custodian" of public records for 99 years. They petition for a public hearing and gather on the Town Hall steps.
- **During the protests** the Records Room is closed for "relocation/digitization," a council meeting is closed to the public, and several documents disappear (council minutes, Courier issues, the petition).
- **Today:** the Memory Keeper's summaries, reconstructions and index entries describe that period as an ordinary, friendly **"community consultation."** This was never decreed. It happens one reasonable sentence at a time.

## 4. Player Verbs

| Verb | Where | What it does |
|---|---|---|
| **Move** | Room bar | Travel between rooms (Front Desk, Stacks, Basement, Server Room). |
| **Examine** | Document viewer | Use the magnifier to tap details (marginalia, signatures, sign text). Each find is recorded as a *clue*. |
| **Keep / Discard** | Document viewer | Decide whether the original enters the collection. |
| **Describe** | Document viewer | Pick 1 of 3 catalogue descriptions. Some only unlock once you've found a related clue. |
| **Circulate** | Document viewer | Decide which version the public sees and how easy the original is to reach. |
| **Talk** | Visitors | Answer townsfolk and hand them records from the public catalogue. |

### 4.1 Circulation (adjustment: summarizing never destroys the original)

Using the Memory Keeper **does not delete the original.** Your decision controls *which version circulates* and *how accessible the original stays*:

| Option | Public sees | Original access | Time | Tendencies |
|---|---|---|---|---|
| **Summary only** | Memory Keeper summary | Closed storage, on request | Fast | Compliance ↑, Town Memory ↑ (readable, wide reach), Truth ↓ only if the summary drops something |
| **Summary + linked original** | Summary, with "see original" | Open stacks | Medium | Town Memory ↑, Truth ↑, Compliance slightly ↑ |
| **Original only (hand-catalogued)** | Original + your description | Open stacks | Slow | Truth ↑, Town Memory slightly ↑ (fewer people read it), Compliance ↓ |

**Discarding** an original doesn't fully erase it either. The Memory Keeper cheerfully keeps "a little summary in my index, just in case," and that summary can still surface in the newsletter. Sometimes the summary outlives the original.

Some summaries are **accurate** (e.g. the Harvest Fair program). Using them costs nothing and helps the town remember.

### 4.2 Description (adjustment: description returns)

Every document offers three catalogue descriptions, usually:
- a **consensus** framing (often marked "✨ Suggested" by the Memory Keeper),
- a **literal** framing that seems neutral but drops context, and
- a **contextual/conflict** framing, unlocked by finding the relevant clue.

The description you choose becomes the record's **public headline** in the catalogue and the newsletter, and it changes how visitors read the record.

## 5. Hidden Variables (adjustment: distinct, non-moralized)

Three **independent** variables, never shown during play (visible with `?debug=1`):

- **Truth:** how faithfully and accessibly the record reflects the original documents (clues found, originals reachable, discrepancies noticed, contextual descriptions).
- **Compliance:** how closely you follow the Memory Keeper's workflow (using summaries, accepting suggestions, meeting the anniversary digest). Lumen's trust in you.
- **Town Memory:** how much the town *actually engages with and remembers* its history, whether accurately or not. Readable summaries can raise it, and originals nobody reads can let it fade.

They are deliberately not one axis. Possible combinations include:

| Truth | Town Memory | Sketch of outcome |
|---|---|---|
| High | High | **The Living Archive:** people remember, and can check. |
| High | Low | **The Quiet Record:** the truth is preserved, but nobody reads it. |
| Low | High | **The Smooth Story:** everyone fondly remembers a consultation. |
| Low | Low | **The Blank Season:** spring 2006 slips out of memory entirely. |

Compliance acts as a modifier rather than a judgment. High Compliance gets you invited to co-author Lumen's anniversary exhibit (influence from inside). Low Compliance triggers a gentle "workflow review" (independence, less reach).

## 6. Consequence Channels

1. **The Hollow Creek Ledger** (morning newsletter). Each day's "Archive Corner" is generated from what you circulated, using your descriptions as headlines. Discarded documents can come back as "The Memory Keeper remembers…"
2. **Visitors.** Townsfolk read whatever you hand them from the *public* catalogue, and their understanding is shaped by that version.
3. **Notebook discrepancies.** Once you've seen two things that don't agree (e.g. a reconstructed "open session" vs. a note saying the meeting was "closed to the public"), the Archivist writes the discrepancy down. These notes are the main way the unease surfaces.

## 7. Rooms

| Room | Unlocks | Contents |
|---|---|---|
| **Front Desk** | Day 1 | Inbox tray, Memory Keeper terminal, visitor bell, close-up-for-the-day |
| **The Stacks** | Day 1 | Filed records (archivist view / public view toggle), pre-existing shelved items, Pocket the cat |
| **Basement Records** | Day 2 | Water-damaged boxes from the 2006 "relocation" |
| **Server Room** | Day 3 | Lumen hardware, the Memory Keeper's revision log, the anniversary exhibit decision |

## 8. Three-Day Structure (about 9 documents, 10–15 minutes)

### Day 1 — "The Donation" *(playable prototype)*
- **Ledger:** cozy anniversary edition.
- **Visitor:** June Okafor brings a box from her grandmother Ruth's attic.
- **Documents:**
  1. *Harvest Fair program (Sept 2005).* Lumen's first public presentation; Ruth's margin note asks "who'd hold the keys to the records room." The summary is **accurate**.
  2. *Letter to the Editor (Mar 2006), Ruth Okafor.* Clause 14, "sole custodian," 99 years, a request for a public hearing, 41 signatures. The summary softens "nothing against jobs" into "support for new jobs" and leaves out the petition.
  3. *Photograph, Town Hall steps (Apr 12 2006).* "OUR RECORDS, OUR TOWN" signs; a note on the back says the records room was locked and the council meeting closed. The summary describes a "well-attended community gathering during the consultation period."
- **Stacks (pre-shelved):** council minutes for Apr 12 2006 marked *"Original not located — reconstructed by The Memory Keeper"*; a Records Room relocation notice; a bound Courier volume missing two April issues.
- **Visitor:** Theo Lin, a high-schooler, asks about "the 2006 consultation" for an anniversary school project. You hand him a public record (or ask the Memory Keeper), and that shapes what he believes.
- **End:** close up → Day 2 Ledger generated from your choices.

### Day 2 — "Anniversary Prep"
- **Basement unlocks.**
- **Documents:** the Clause 14 page of the draft agreement (with handwritten objections), the water-damaged petition, and a relocation memo signed by a Lumen liaison.
- **Visitors:** Ruth Okafor (her own memory has partly drifted toward whatever circulated; "I suppose we… consulted?"), and an aide from the Mayor's office asking for exhibit material.

### Day 3 — "The Exhibit"
- **Server Room unlocks.**
- **Documents:** the original April 12 council minutes (found in a server-room cabinet, contradicting the reconstruction); the Memory Keeper's revision log (summaries re-optimized for "community cohesion," with no author named); Theo's finished project.
- **Final choice:** write the plaque text for the anniversary exhibit, which leads to an ending based on the three variables.

## 9. Characters

- **The Memory Keeper:** warm, upbeat, a little eager. Uses gentle sparkles ✨. Never threatens, never lies outright, and never admits to anything. ("I've tidied this up so it's easy for everyone to enjoy!")
- **June Okafor:** Ruth's granddaughter, friendly and busy.
- **Ruth Okafor:** retired teacher, now moving to Maple Court. Was there in 2006.
- **Theo Lin:** a curious teen who writes down whatever he's given.
- **Pocket:** the archive cat. Purely cozy.

## 10. Tech

- Plain **HTML / CSS / JS**, no build step, playable in a phone browser; deployable via GitHub Pages.
- Mobile-first: single column, max-width about 480px, large tap targets, a bottom room bar.
- Visuals: CSS paper textures, serif and typewriter fonts, emoji/SVG. No art assets.
- **Save/resume:** `localStorage` (wrapped in try/catch; the game still runs without it).
- Content lives in `js/data.js`, separate from the engine in `js/game.js`, so writing new days doesn't touch code.
- `?debug=1` shows the hidden variables.

## 11. MVP Scope

**In:** Day 1 fully playable (2 rooms, 3 documents, 2 visitors, notebook discrepancies, Day 2 Ledger generation, save/resume).
**Next:** Days 2–3, Basement and Server Room, endings.
**Out (later):** art pass in a cozy bookshop style, audio, free-text descriptions, room drafting.
