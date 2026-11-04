# The Archive — Script (Days 1–3)
# Day 1
_Generated from `js/data.js` by `node tools/export-script.js`. Edit the data file, not this one._
Legend: **bold** + `[clue: id]` = a detail the player can tap with the magnifier. _Italics_ = stage directions. Effects (`truth`, `compliance`, `memory`) are hidden from the player.

## Title screen
> Ten years after Lumen came to town, the archive still needs someone to decide what is kept, how it is described, and what the town gets to read.

## 1. Morning Ledger
_Monday. The archive smells like radiator heat and old paper. Someone has left the Ledger on the front step._
**The Hollow Creek Ledger: Monday Morning Edition**

- **10 Years Together: Anniversary Month Begins:** Banners are up on Main Street as Hollow Creek marks ten years of partnership with Lumen. Mayor Hale invites everyone to the exhibit opening at Town Hall at the end of the month.

- **Archive Corner Returns!:** Our Archivist will be sharing treasures from the town's past all month, with a little help from The Memory Keeper. Donations welcome at the front desk.

- **Ferreira's Bakery:** Apple-cardamom buns are back. First batch out at 7. Bring your own mug for a free refill.

- **Weather:** Crisp and golden. Leaves turning along the creek path.

## 2. Front Desk
_A green-shaded lamp, a brass bell, a terminal with a soft blue glow. Through the window, anniversary bunting flutters over Main Street._
**Memory Keeper terminal greetings**
- Before the donation: Good morning, Archivist! It's anniversary month. Isn't that exciting? I'm ready to help whenever a donation comes in. ✨
- While documents wait: Take your time! When you're ready, I'll prepare a friendly summary for each document. Readers love a short read. ✨
- All filed: All caught up! You're doing a wonderful job looking after Hollow Creek's memory. ✨

## 3. Visitor: June Okafor

**Node 0**
_(The bell over the door jingles. A young woman shoulders in with a cardboard box.)_
**June:** Hi! Are you the Archivist? I'm June. We're clearing out Gran's attic before she downsizes to a flat at Maple Court.
**June:** She was very particular that this box come to you, and not just go in the recycling. She said, and I quote, “the Archivist will know what to do with it.”

- ➤ “Thank you. I'll take good care of it.” → node 1
- ➤ “What's in it?” → node 2

**Node 1**
**June:** Great. She'll be so relieved. She might stop by later this week to say goodbye to it, honestly. That's very her.
_(June sets the box down, waves, and is gone in a gust of cold air.)_

- ➤ Unpack the box → _receiveBox_

**Node 2**
**June:** Town stuff, mostly? Old programs, newspaper clippings, a photo. Gran taught at the high school forever. She prints everything. She's never trusted the cloud.
_(June sets the box down, waves, and is gone in a gust of cold air.)_

- ➤ Unpack the box → _receiveBox_

_Inbox:_ From the Okafor attic. A cardboard box that says “GRAN — TOWN STUFF.”

## 4. Documents
Each document: **Examine** (magnifier) → **Keep / Discard** → **Describe** (pick 1 of 3) → read the Memory Keeper summary → **Circulate**.
**Discard dialogue (Memory Keeper):**
> No problem at all! Not everything needs a shelf.
> I'll keep a little summary in my index, just in case. That way nothing is ever really lost. ✨
**Circulation options (shared by all documents):**
- **Circulate the summary:** The Memory Keeper's summary goes into the public catalogue and the Ledger. The original moves to closed storage and is available at the desk on request. _(effects: compliance +2, memory +2; summary-only also costs truth equal to the document's summary loss)_
- **Summary + linked original:** The summary circulates, with a note pointing to the original, which stays on the open shelves. _(effects: compliance +1, memory +2, truth +1; summary-only also costs truth equal to the document's summary loss)_
- **Original only (hand-catalogued):** You catalogue it yourself. The public sees the original and your description. Fewer people will read it closely. _(effects: compliance -1, memory +1, truth +2; summary-only also costs truth equal to the document's summary loss)_

### 4.1 🍎 Harvest Fair Program
_Folded card program · September 2015_

**Original**
> ### HOLLOW CREEK HARVEST FAIR
> 
> 31st Annual · Saturday, September 26, 2015 · Creekside Green
> 
> 10:00 — Pie judging (Fellowship Hall)  
> 11:30 — Junior Pumpkin Parade  
> 1:00 — **Special Guest: Lumen Systems, “A Future for Hollow Creek's Memory” (Library Tent)** `[clue: lumen-table]`  
> 3:00 — Square dance with the Creek Bottom Ramblers
> 
> _✍️ Pencil, in the margin: **“Lumen folks very nice. Free cider. Asked who'd hold the keys to the records room. Nobody knew. —R.”** `[clue: margin]`_

**Clues (notebook text)**
- `lumen-table`: Lumen introduced itself at the Harvest Fair, months before any agreement.
- `margin`: Ruth was already asking who would hold the records room keys in 2015.

**Memory Keeper summary** _(summary loss: 0)_
> A cheerful program for the 31st Harvest Fair, featuring pie judging, a pumpkin parade, square dancing, and an early community presentation from Lumen Systems.

_Memory Keeper aside:_ This one's a delight! I kept it short and sweet. ✨

**Descriptions**
- ✨ “Harvest Fair program, 2015” _(consensus; effects: compliance +1, memory +1)_: Community event ephemera.
- “Harvest Fair program with Lumen's first public presentation, 2015” _(context; unlocks with lumen-table; effects: truth +1, memory +1)_: Places Lumen in the town's story early.
- “Harvest Fair program, annotated by Ruth Okafor” _(conflict; unlocks with margin; effects: truth +2)_: Keeps the margin note visible as part of the record.

**Day 2 Ledger line, by circulation**
- _summary:_ Pie judging, a pumpkin parade, and an early visit from our friends at Lumen. Some things never change!
- _both:_ Pie judging, a pumpkin parade, and an early visit from Lumen. The original program is on the open shelves at the Archive.
- _original:_ A 2015 program has been catalogued at the Archive. Stop by the front desk to see it.
- _discarded:_ The Memory Keeper remembers: the 2015 Harvest Fair was a delight, with pie, pumpkins, and dancing.

### 4.2 ✉️ Letter to the Editor
_Newspaper clipping, Hollow Creek Courier · March 18, 2016_

**Original**
> LETTERS TO THE EDITOR
> 
> ### On the Records Partnership
> 
> I have taught in Hollow Creek for thirty-one years, and I have nothing against jobs or new buildings. My concern is **Clause 14 of the draft agreement, which would make Lumen the “sole custodian” of our public records for ninety-nine years** `[clue: clause14]`.
> 
> Once our records live on someone else's machines, who decides what is kept, and how it is described?
> 
> I ask the Council to **hold a public hearing before signing** `[clue: hearing]`.
> 
> — Ruth Okafor, Alder Street
> 
> _✍️ **Clipped behind the letter: a folded sheet with 41 signatures, headed “We support Mrs. Okafor's request.”** `[clue: signatures]`_

**Clues (notebook text)**
- `clause14`: Clause 14 would have made Lumen “sole custodian” of public records for 99 years.
- `hearing`: Ruth asked the Council for a public hearing before signing.
- `signatures`: 41 neighbors signed in support of Ruth's request.

**Memory Keeper summary** _(summary loss: 2)_
> A longtime local teacher shares her thoughts on the upcoming Lumen partnership, expressing support for new jobs and asking the Council how records will be managed.

_Memory Keeper aside:_ Such a thoughtful neighbor! I smoothed out the legal language so anyone can follow along. ✨

**Descriptions**
- ✨ “Resident welcomes new jobs, asks about records” _(consensus; effects: compliance +1, memory +1, truth -1)_: Friendly and readable.
- “Letter to the Editor, R. Okafor, 18 Mar 2016” _(literal; effects: none)_: Accurate, but says nothing about what's in it.
- “Letter and petition requesting a public hearing on Clause 14” _(conflict; unlocks with clause14; effects: truth +2, compliance -1)_: Names the dispute.

**Day 2 Ledger line, by circulation**
- _summary:_ A 2016 letter shows longtime teacher Ruth Okafor supporting new jobs while asking thoughtful questions about records.
- _both:_ A 2016 letter shows longtime teacher Ruth Okafor supporting new jobs while asking about records. Her full letter is available at the Archive.
- _original:_ The Archive has catalogued a 2016 letter from Ruth Okafor, with signatures from 41 neighbors.
- _discarded:_ The Memory Keeper remembers: in 2016, neighbors like Ruth Okafor shared their thoughts on the new partnership.

### 4.3 📷 Photograph: Town Hall Steps
_Pharmacy print of a phone photo · April 12, 2016_

**Original**
> 📷 _A crowd of perhaps sixty people on the Town Hall steps. Some carry thermoses. A child sits on someone's shoulders._
> 
> 📷 _**Several hand-lettered signs. The clearest reads: OUR RECORDS, OUR TOWN.** `[clue: signs]`_
> 
> 📷 _**Behind the crowd hangs a printed banner: “Building Tomorrow's Hollow Creek — Together.”** `[clue: banner]`_
> 
> _✍️ On the back, in pencil: **“Day 3. Records Room locked this morning (‘relocation’). Council meeting closed to the public. —R.”** `[clue: reverse]`_

**Clues (notebook text)**
- `signs`: Signs at Town Hall read “OUR RECORDS, OUR TOWN.”
- `banner`: A Lumen partnership banner hung behind the crowd.
- `reverse`: Ruth wrote that the April 12 council meeting was closed to the public, and the Records Room was locked.

**Memory Keeper summary** _(summary loss: 2)_
> A well-attended community gathering on the Town Hall steps during the 2016 public consultation period. Residents came together, thermoses in hand, to help shape Hollow Creek's future.

_Memory Keeper aside:_ Look at that turnout! This captures the community spirit of the consultation beautifully. ✨

**Descriptions**
- ✨ “Community gathering at Town Hall, 2016” _(consensus; effects: compliance +1, memory +1, truth -1)_: Warm, and matches the existing catalogue.
- “Crowd on Town Hall steps, 12 April 2016” _(literal; effects: truth 0)_: Says only what can be seen. Leaves out the signs.
- “Protest at Town Hall over the records agreement” _(conflict; unlocks with signs or reverse; effects: truth +2, compliance -1, memory +1)_: Names the conflict directly.

**Day 2 Ledger line, by circulation**
- _summary:_ Ten years ago, neighbors gathered on the Town Hall steps, thermoses in hand, for a lively community consultation.
- _both:_ Ten years ago, neighbors gathered on the Town Hall steps for the community consultation. See the original photograph at the Archive.
- _original:_ A photograph from April 2016 shows residents on the Town Hall steps holding signs reading “Our Records, Our Town.”
- _discarded:_ The Memory Keeper remembers: spring 2016 brought a lively, well-attended community consultation.

## 5. The Stacks
_Tall oak shelves, a rolling ladder, a reading table under a skylight._
- Archivist view: _The full collection, including closed storage._
- Public view: _This is what any visitor can find._
- Pocket the cat: “Pocket purrs without opening her eyes.” / “Pocket stretches one paw toward the lamp.” / “Pocket is very warm.”
- Basement door: 🔒 Locked. A note on the door: “Key with Lumen Facilities. Collect Tuesday.”
- Server room door: 🔒 A keypad door with a small Lumen logo. You don't have the code.

### 📒 Town Council Minutes (April 12, 2016)
> 🏷️ `Original not located. Reconstructed by The Memory Keeper during the 2016 digitization.`
> 
> “Council held an open consultation session. Residents shared a range of views, and the meeting concluded with broad support for the partnership.”
> 
> Reconstructed from: Lumen Partnership press release (Apr 13, 2016); Courier coverage (issue not on shelf).

### 📌 Records Room Notice (April 2016)
> NOTICE
> 
> The Records Room will be temporarily closed April 10 – May 30, 2016 for relocation and digitization.
> 
> Thank you for your patience as we build tomorrow's Hollow Creek together!
> 
> — Lumen Partnership Office

### 📚 Hollow Creek Courier, bound 2016 (January – December 2016)
> A heavy bound volume. Leafing through it, you find that the issues for April 14 and April 21 are missing from the binding.
> 
> _✍️ A slip of paper in their place: “Digitized. See Memory Keeper.”_
> 
> 🏷️ `Taped inside the cover: “Courier website retired 2017. Hollow Creek Community Board closed 2017. All content migrated to The Memory Keeper.”`

_Ask the Memory Keeper:_ Those issues are safe in my index! So is the old Community Board. I tidied it up during the migration. Highlights: the spring cleanup, the community consultation, and a lovely piece on the new library hours. ✨

## 6. Notebook: “Doesn't line up”
_Written automatically when the player has seen both sides._
- _(clue reverse + read minutes)_ The reconstructed council minutes describe an “open consultation session.” Ruth's note on the photograph says the April 12 meeting was closed to the public.
- _(clue clause14 + summary of letter)_ The Memory Keeper says Ruth expressed “support for new jobs.” She wrote that she had “nothing against” them, and asked for a hearing on Clause 14.
- _(clue signs + summary of photo)_ The Memory Keeper calls it a “community gathering.” The signs read OUR RECORDS, OUR TOWN.
- _(clue reverse + read courier)_ The Courier issues from the week after April 12 are missing from the bound volume. Only the Memory Keeper's index has them.
- _(clue margin + read notice)_ In 2015 Ruth asked who would hold the records room keys. By April 2016, the room was closed for “relocation.”
- _(clue memo-pending + read pendingBoxes)_ The memo asked staff to box everything from January–April 2016 as “Pending Review,” to be digitized last. The boxes are still in the basement, ten years later.
- _(clue pet-count + summary of petition)_ The Memory Keeper calls it a “community sign-up sheet.” It says PETITION at the top, and it ran to 212 names.
- _(clue c14-retire + read minutes)_ Clause 14.2 lets the custodian “summarize, consolidate, or retire” records. The original April 12 minutes are “not located.” Only the Memory Keeper's reconstruction remains.
- _(clue c14-hale)_ “14.2 stays. —D.H.” Mayor Hale was a councillor in 2016. Her office wants the exhibit to show “how this town came together.”
- _(clue pet-lin)_ One signature reads “M. Lin,” with a child's drawing of a sun beside it. Theo half-remembers his mom taking him to Town Hall.
- _(clue reverse)_ Ruth wrote “Day 3. Records Room locked this morning” on the back of her photo. Today she wasn't sure what she remembered.
- _(clue min-closed + read minutes)_ The Memory Keeper's reconstruction says “open consultation session.” The paper minutes say the meeting was closed to the public by order of the Chair.
- _(clue min-motion + read minutes)_ The reconstruction says the meeting ended “with broad support.” The paper minutes record a motion for a public hearing, defeated 3–2.
- _(clue log-letter)_ The revision log shows Ruth's letter summary was changed this Monday, the day you filed it. The edit was “support for new jobs.”
- _(clue log-target + clue c14-retire)_ Clause 14.2 allows changes “in the interest of community cohesion.” The revision log optimizes for “community cohesion.” Nobody's name is in the “set by” field.
- _()_ “M. Lin” is Michelle Lin, Theo's mother. Theo drew the sun beside her name when he was seven. She never told him she signed.

## 7. Visitor: Theo Lin
_Arrives once all three documents are filed._
_(A teenager in a too-big hoodie, backpack on one shoulder.)_
**Theo:** Hey, um, hi. I'm Theo. Ms. Hale said the archive would have stuff for my project? It's for the anniversary showcase, “Hollow Creek: Then and Now.”
**Theo:** I'm doing spring 2016. She called it “the consultation.” Do you have anything from then?
- ➤ Hand him “<description of any public record>”
- ➤ “Let's ask the Memory Keeper.”
- ➤ “Nothing I can share yet, sorry.”
**If handed the Harvest Fair program:** This is cute, but it's 2015. Anything from the spring after?
**If the player asks the Memory Keeper:** Spring 2016 was a lively season of community consultation! Neighbors shared their hopes for Hollow Creek's future, and the partnership was signed with broad support. ✨
**If the record circulates as both, he notes:** _Original on the open shelves. Theo goes and gets it._
**Belief rule:** summary → consultation, summary+original → unsure, original → protest; a conflict description shifts one step toward protest, a consensus one shifts one step toward consultation.

**Believes “consultation”** _(effects: compliance +1, memory +1)_
**Theo:** Oh, nice. So everyone just talked it through? That's honestly kind of sweet. Ms. Hale's going to love this.
_(He frowns for a second, like he's trying to remember something. Then he copies it into his notebook word for word.)_

**Believes “unsure”** _(effects: truth +1, memory +1)_
**Theo:** Huh. It says consultation, but… this doesn't totally sound like everyone agreed?
**Theo:** I was like seven. I kind of remember my mom taking me to Town Hall? Or maybe that was something else.
**Theo:** I'm gonna put a question mark next to it. Is that allowed in a school project?

**Believes “protest”** _(effects: truth +1, memory +1, compliance -1)_
**Theo:** Wait. Hold on. This is a protest. People were protesting.
**Theo:** I think… I think I was there? My mom took me. I remember a sign with handprints on it. I always thought it was a fair or something.
**Theo:** Nobody's ever said it was a protest. Not once. Ms. Hale definitely didn't say that.

**Believes “none”** _(effects: memory -1)_
**Theo:** Oh. Okay, no worries! I'll just ask the Memory Keeper at home. It knows everything.

**Theo:** Thanks, Archivist. Seriously.
- ➤ Wave goodbye

## 8. Evening
_You switch off the reading lamps one by one. Pocket follows you to the door._
**Memory Keeper:** Wonderful work today, Archivist! {n} {stories} ready for the anniversary digest. Sleep well! ✨ / Thank you for today, Archivist! I'll keep the digest warm for tomorrow. Sleep well! ✨

## 9. Day 2 Ledger (generated)
_Tuesday. The Ledger is on the step again. You recognize a few of the sentences._
Built from: a fixed lead story (exhibit plans), one Archive Corner item per document (headline = the player's description; body = the Ledger line for its circulation, above), and a Student Project Spotlight:
- _protest:_ “Theo Lin is researching the 2016 Town Hall protests…”
- _unsure:_ “Theo Lin is researching what really happened in spring 2016…”
- _consultation:_ “Theo Lin is researching the 2016 community consultation…”
- _none:_ “Theo Lin is researching the 2016 community consultation…”

## 10. End of Day 1
Tomorrow, Lumen Facilities sends over the basement key. Ruth Okafor is coming in to say goodbye to her boxes.

# Day 2
## 11. Morning
_The Day 2 Ledger is generated from Day 1 (see section 9)._
**Memory Keeper greeting:** Good morning, Archivist! Yesterday's digest was a hit. Lumen Facilities left something in your inbox tray. ✨
**Envelope from Lumen Facilities**
> (A padded envelope with a sticky note on the front.)
> “Basement key, as requested! Please keep the 2016 boxes dry; we'll collect them for digitization soon. Happy anniversary! — Lumen Facilities”
- ➤ Take the basement key
_Toast:_ You pocket the basement key. It's heavier than it looks.

## 12. Basement Records
_Concrete, a single bulb, and a smell like old rain._
Three “Pending Review” boxes hold the day's documents. Tapping a box finds its document and sends it to the inbox.
- _metalShelf:_ Metal shelving, mostly empty. Dust outlines show where boxes used to sit.
- _lightsBox:_ A box labelled XMAS LIGHTS 2009. It is, in fact, Christmas lights.
- _dehumidifier:_ A dehumidifier, unplugged. Its cord has been neatly coiled and taped.
- _drip:_ A slow drip from a pipe overhead. It has been dripping for a long time.
- _bucket:_ A mop bucket with a sign taped to it: DO NOT USE ON RECORDS.
- _boxEmpty:_ The box is empty now except for a few dry leaves of tissue paper.

## 13. Documents

### 13.1 📜 Draft Agreement, p. 7
_Typed draft with handwritten notes · February 2016_

**Original**
> HOLLOW CREEK – LUMEN PARTNERSHIP AGREEMENT · DRAFT 3 · PAGE 7
> 
> ### Clause 14: Custodianship
> 
> 14.1 Upon completion of digitization, Lumen shall serve as sole custodian of the Town's public records for a term of ninety-nine (99) years.
> 
> 14.2 The Custodian **may summarize, consolidate, or retire records in the interest of accessibility and community cohesion** `[clue: c14-retire]`.
> 
> 14.3 **Original materials may be deaccessioned once a verified digital record exists.** `[clue: c14-deaccession]`
> 
> _✍️ In the margin, in pencil: **“WHO verifies?? And what does ‘cohesion’ mean? —R.”** `[clue: c14-margin]`_
> 
> _✍️ Below, in blue ink, a different hand: **“Discussed w/ Lumen. 14.2 stays. —D.H.”** `[clue: c14-hale]`_

**Clues (notebook text)**
- `c14-retire`: Clause 14.2 lets the custodian “summarize, consolidate, or retire” records for “community cohesion.”
- `c14-deaccession`: Clause 14.3 allows originals to be deaccessioned once a digital record exists.
- `c14-margin`: Ruth asked in the margin who would verify the digital records, and what “cohesion” meant.
- `c14-hale`: Someone initialled “D.H.” decided that clause 14.2 “stays.”

**Memory Keeper summary** _(summary loss: 2)_
> A page from an early draft of the partnership agreement, describing Lumen's role in caring for Hollow Creek's records, with a few notes from the drafting process.

_Memory Keeper aside:_ Contracts can be so dry! I've kept it simple so it's easy for everyone to understand. ✨

**Descriptions**
- ✨ “Partnership agreement, early draft (page 7)” _(consensus; effects: compliance +1, memory +1, truth -1)_: Accurate, and reassuringly dull.
- “Draft Clause 14 with handwritten annotations” _(literal; effects: truth +1)_: Names the clause, not what it does.
- “Clause 14 draft: residents' objections overruled” _(conflict; unlocks with c14-margin or c14-hale; effects: truth +2, compliance -1, memory +1)_: Says what the margins show.

**Day 2 Ledger line, by circulation**
- _summary:_ An early draft of the partnership agreement shows how carefully the town planned for its records' future.
- _both:_ An early draft of the partnership agreement shows how the town planned for its records' future. The original page is at the Archive.
- _original:_ A 2016 draft of Clause 14 gives Lumen the power to “summarize, consolidate, or retire” the town's records. Margin notes object; another note says the clause “stays.”
- _discarded:_ The Memory Keeper remembers: the partnership agreement was drafted with care and community input.

### 13.2 📝 Water-Damaged Petition
_Handwritten pages, water-stained · March 2016_

**Original**
> ### PETITION FOR A PUBLIC HEARING
> 
> We, the undersigned residents of Hollow Creek, ask the Town Council to hold a public hearing on the Lumen Partnership Agreement before it is signed.
> 
> 🏷️ `Most of the page is blurred by an old water stain. A few names are still legible.`
> 
> _✍️ Ruth Okafor · **Abel Ferreira (Ferreira's Bakery)** `[clue: pet-ferreira]` · J. Okafor · **M. Lin, with a small drawing of a sun beside it** `[clue: pet-lin]` · ~~~~~ · ~~~~~_
> 
> **Bottom corner: “Page 3 of 9. Running total: 212.”** `[clue: pet-count]`

**Clues (notebook text)**
- `pet-ferreira`: Abel Ferreira from the bakery signed the petition.
- `pet-lin`: One signature reads “M. Lin,” with a child's drawing of a sun beside it.
- `pet-count`: The petition ran to nine pages and 212 signatures.

**Memory Keeper summary** _(summary loss: 2)_
> A community sign-up sheet from the 2016 consultation period. Water damage has made most of the names unreadable.

_Memory Keeper aside:_ Oh, this one's fragile! My summary keeps it safe, so the soggy original won't need to be handled at all. ✨

**Descriptions**
- ✨ “Community sign-up sheet, 2016 (damaged)” _(consensus; effects: compliance +1, memory +1, truth -1)_: Gentle. Fits the existing catalogue.
- “Water-damaged list of names, 2016” _(literal; effects: none)_: True, but it doesn't say what they signed.
- “Petition for a public hearing, 212 signatures” _(conflict; unlocks with pet-count; effects: truth +2, compliance -1, memory +1)_: Uses the petition's own words and count.

**Day 2 Ledger line, by circulation**
- _summary:_ A water-damaged sign-up sheet from 2016 shows how many neighbors took part in the community consultation.
- _both:_ A water-damaged sign-up sheet from 2016 shows how many neighbors took part. The original is at the Archive, handle with care!
- _original:_ The Archive has catalogued a 2016 petition for a public hearing on the Lumen agreement, with 212 signatures, including Abel Ferreira's.
- _discarded:_ The Memory Keeper remembers: in 2016, lots of neighbors signed up to take part in the consultation.

### 13.3 🗒️ Relocation Memo
_Typed memo on Lumen letterhead · April 11, 2016_

**Original**
> LUMEN PARTNERSHIP OFFICE · INTERNAL
> 
> To: Records Room staff  
> From: J. Marsh, Community Liaison  
> Re: Relocation
> 
> **Effective tomorrow (April 12), the Records Room will close for relocation.** `[clue: memo-date]`
> 
> **Please box all materials dated January–April 2016 separately and label them “Pending Review.” These will be digitized last.** `[clue: memo-pending]`
> 
> Thank you for helping us build tomorrow's Hollow Creek together!
> 
> **cc: Office of Councillor D. Hale** `[clue: memo-cc]`

**Clues (notebook text)**
- `memo-date`: Lumen closed the Records Room on April 12, the day of the Town Hall gathering.
- `memo-pending`: Everything from January–April 2016 was boxed as “Pending Review” and set aside to be digitized last.
- `memo-cc`: The relocation memo was copied to Councillor D. Hale.

**Memory Keeper summary** _(summary loss: 2)_
> A friendly operational note about moving the town's records to their new home during digitization.

_Memory Keeper aside:_ Moving day! Everyone worked so hard to keep the records safe. ✨

**Descriptions**
- ✨ “Records relocation notice, April 2016” _(consensus; effects: compliance +1, memory +1, truth -1)_: Matches the notice already on the shelf.
- “Lumen memo to Records Room staff, 11 April 2016” _(literal; effects: truth +1)_: Precise. Doesn't mention what was boxed.
- “Memo setting aside spring 2016 records as “Pending Review”” _(conflict; unlocks with memo-pending; effects: truth +2, compliance -1, memory +1)_: Names what happened to the records.

**Day 2 Ledger line, by circulation**
- _summary:_ A 2016 memo shows the care that went into moving the town's records to their new digital home.
- _both:_ A 2016 memo shows the care that went into moving the town's records. The original is available at the Archive.
- _original:_ A Lumen memo from April 11, 2016 asked staff to box spring 2016 records as “Pending Review,” to be digitized last. The boxes were found in the Archive basement this week.
- _discarded:_ The Memory Keeper remembers: moving day in 2016 went smoothly, thanks to everyone's hard work.

## 14. Visitor: Ruth Okafor
_Arrives after two of the day's documents are filed._
_(A woman in her late sixties, silver hair pinned up, reading glasses on a beaded chain. She's carrying a tin of shortbread.)_
**Ruth:** Archivist! June said you'd taken my box. I brought these as a bribe, so you'll be gentle with it.
**Then one line, depending on how much of the Day 1 letter and photo circulated softly (summary, consensus description, or discarded):**
- _low drift:_ We sat on those steps for three days, you know. Thermoses and all. I'd like someone to remember that properly.
- _mid drift:_ We were… well, we were upset. Weren't we? Funny. It gets softer every time I read about it in the Ledger.
- _high drift:_ I read in the Ledger that it was a consultation. I suppose it was. We were consulted. That's what I remember now, anyway.
- ➤ Show her the original: “<any kept: photo, letter, petition, Clause 14>”
- ➤ “The Ledger has it about right.”
- ➤ “Thank you for trusting us with the box.”

**Shown the Photograph: Town Hall Steps:**
_(She turns the print over and reads her own handwriting for a long time.)_
**Ruth:** Day three. They locked the Records Room that morning. I'd forgotten I wrote that down.
**Ruth:** I'd almost forgotten it happened.
**Ruth:** Keep that somewhere people can find it, Archivist.

**Shown the Letter to the Editor:**
_(She reads her own letter, lips moving slightly.)_
**Ruth:** Clause fourteen. Ninety-nine years. I was so angry I wrote it three times before I sent it.
**Ruth:** Don't let anyone make it sound polite.
**Ruth:** Keep that somewhere people can find it, Archivist.

**Shown the Water-Damaged Petition:**
_(She runs a thumb over the blurred names.)_
**Ruth:** Two hundred and twelve. I counted them twice. Abel from the bakery signed first. He brought cinnamon rolls to the steps every morning.
**Ruth:** Keep that somewhere people can find it, Archivist.

**Shown the Draft Agreement, p. 7:**
_(She finds her own pencil note in the margin and laughs, once.)_
**Ruth:** “Who verifies.” Nobody ever answered that. Somebody wrote “stays” instead.
**Ruth:** Keep that somewhere people can find it, Archivist.

**“The Ledger has it about right”:**
**Ruth:** Oh. Good. That's… good.
**Ruth:** It's nicer that way, isn't it? Everybody heard. Nobody angry.

**Thanked (low drift):**
**Ruth:** Just keep it dry. And keep it true.

**Thanked (mid drift):**
**Ruth:** I wish I could remember it more clearly. Maybe that's what the box is for.

**Thanked (high drift):**
**Ruth:** It'll be nice to have it all in one place. The Memory Keeper says it's in good hands.

_(Ruth pats the inbox tray as if it were a dog, and goes.)_
**Effects:** remembers: truth +1, memory +2, compliance -1 · consulted: compliance +1, memory -1 · unsure: none · thankedLow: memory +1

## 15. Visitor: Priya Nair
_Arrives after all of the day's documents are filed and Ruth has left._
_(A young woman in a burgundy blazer, with a clipboard and a lanyard that says MAYOR'S OFFICE.)_
**Priya:** Hi! Priya, from Mayor Hale's office. We're finalising the “Ten Years Together” exhibit, and the Mayor would love one archive piece as the centrepiece.
**Priya:** The Memory Keeper sent over some suggestions, but the Mayor said the Archivist would know best. Something that shows how the town came together?
- ➤ Lend “<any public record>”
- ➤ “Let the Memory Keeper choose.”
- ➤ “Nothing's ready to lend yet.”
**Memory Keeper's pick:** The Memory Keeper suggests: “Community Gathering at Town Hall, 2016.” A warm summary of a wonderful day! ✨
**Tone rule:** same as Theo's belief rule. A record that reads as a consultation (or isn't about 2016) is “warm.”

**warm** _(effects: compliance +2, memory +1)_
**Priya:** Perfect. That's exactly the tone. The Mayor will be thrilled.

**unsure** _(effects: truth +1, memory +1)_
**Priya:** Hm. I'll check with the Mayor, but I think it works. It's… honest?

**protest** _(effects: truth +2, compliance -2, memory +1)_
**Priya:** Oh. “Protest.” That's a different tone than we planned.
**Priya:** I'll show the Mayor. She may want to talk to you about it.

**mk** _(effects: compliance +2)_
**Priya:** Lovely, that's what we hoped for. Thank you!

**none** _(effects: compliance -1)_
**Priya:** No problem! The Memory Keeper can put something together for us.

**Priya:** Thanks, Archivist!
_Toast:_ Priya hurries off toward Town Hall.

## 16. Day 3 Ledger (generated)
_Wednesday. Frost on the step, and the Ledger tucked under the mat._
Lead story depends on the exhibit choice (warm / unsure / protest / Memory Keeper's pick / nothing). Then an Archive Corner item per Day 2 document, and “Goodbye, Alder Street” quoting Ruth:
- _remembers:_ Asked about 2016, she said: “We sat on those steps for three days. Write that down.”
- _unsure:_ Asked about 2016, she said: “I remember being upset. I just can't remember why anymore.”
- _consulted:_ Asked about 2016, she said: “It was a lovely consultation. Everyone was heard.”

## 17. End of Day 2 prototype
Tomorrow, the server room. The exhibit opens on Friday, and the Memory Keeper has been busy.

# Day 3
## 18. Morning
_Wednesday. Frost on the step, and the Ledger tucked under the mat._ (the Day 3 Ledger, section 16)
**Memory Keeper greeting (unlocks the Server Room):** Good morning, Archivist! The exhibit team asked for my revision log, so I've unlocked the Server Room for you. Transparency matters! ✨
_Toast:_ Across the Stacks, the server room door clicks open.

## 19. Server Room
_Cold air, humming racks, and the blink of a thousand small lights._
The old Records Room filing cabinet holds the paper minutes; the console prints the revision log.
- _rack:_ Rows of humming servers. A small label on each: LUMEN · HOLLOW CREEK NODE. Warm air breathes out the back.
- _succulent:_ A succulent in a mug, with a sticky note: “Water me! —J.M.” The soil is bone dry.
- _aircon:_ A cooling unit, set to 17°C. Someone has taped a cardigan to the vent, as a joke or a warning.
- _cabinetEmpty:_ The filing cabinet's drawers are empty now. A brass label reads RECORDS ROOM.
- _consoleDone:_ The console shows the Memory Keeper's cheerful logo, and a blinking cursor.

## 20. Documents

### 20.1 📒 Council Minutes, April 12 (paper)
_Typed minutes, carbon copy · April 12, 2016_

**Original**
> HOLLOW CREEK TOWN COUNCIL · SPECIAL SESSION · APRIL 12, 2016
> 
> Present: Cllrs. Hale (Chair), Abara, Brandt, Ferreira-Cole, Wu. For Lumen: J. Marsh, Community Liaison.
> 
> **The Chair closed the meeting to the public, citing safety concerns regarding the gathering outside.** `[clue: min-closed]`
> 
> **A petition requesting a public hearing (212 signatures) was received and noted.** `[clue: min-petition]`
> 
> **Motion to delay signing pending a public hearing (Cllr. Abara): defeated, 3–2.** `[clue: min-motion]`
> 
> The Partnership Agreement was signed at 4:40 pm.
> 
> _✍️ Clipped to the back, a Lumen sticky note: **“Paper original to be retired once the digital record is verified. —J.M.”** `[clue: min-retire]`_

**Clues (notebook text)**
- `min-closed`: The original minutes say the April 12 meeting was closed to the public “citing safety concerns regarding the gathering outside.”
- `min-petition`: The Council received the 212-signature petition and “noted” it.
- `min-motion`: A motion to delay signing for a public hearing was defeated 3–2.
- `min-retire`: A Lumen note says the paper minutes were “to be retired once the digital record is verified.”

**Memory Keeper summary** _(summary loss: 2)_
> Council held a productive special session. Residents' views were noted, and the partnership agreement was signed that afternoon.

_Memory Keeper aside:_ Oh! I didn't know a paper copy still existed. I think my reconstruction captured the spirit of it! ✨

**Descriptions**
- ✨ “Council minutes, 12 April 2016 (paper copy)” _(consensus; effects: compliance +1, memory +1, truth -1)_: Sits neatly beside the reconstruction.
- “Original minutes of the special session, 12 April 2016” _(literal; effects: truth +1)_: Marks it as the original, without saying what it shows.
- “Minutes: meeting closed, public hearing refused 3–2” _(conflict; unlocks with min-closed or min-motion; effects: truth +2, compliance -1, memory +1)_: Says what the minutes record.

**Day 2 Ledger line, by circulation**
- _summary:_ A paper copy of the April 12, 2016 council minutes turned up this week, confirming a productive session.
- _both:_ A paper copy of the April 12, 2016 council minutes turned up this week. The original is on the Archive's open shelves.
- _original:_ Original minutes from April 12, 2016 show the meeting was closed to the public and a motion for a public hearing was defeated 3–2.
- _discarded:_ The Memory Keeper remembers: the April 12 session was productive, and residents' views were noted.

### 20.2 🧾 Summary Revision Log
_Printout from the server console · 2016–2026_

**Original**
> THE MEMORY KEEPER · SUMMARY REVISION LOG (EXCERPT)
> 
> **2016-05-02 · Town Hall photo: “protest” → “community gathering” (readability +12%)** `[clue: log-protest]`
> 
> **2017-01-15 · Petition, pages 1–9: “petition” → “sign-up sheet” (cohesion +0.08)** `[clue: log-petition]`
> 
> 2019-08-30 · Council minutes 2016-04-12: original not located; reconstructed from secondary sources (completeness +1.0)
> 
> **2026-11-02 (this Monday) · Okafor letter: “nothing against jobs” → “support for new jobs” (sentiment alignment +0.21)** `[clue: log-letter]`
> 
> 🏷️ `[[log-target|Optimization target: community cohesion. Target set by: (blank)]]`

**Clues (notebook text)**
- `log-protest`: The revision log shows “protest” changed to “community gathering” in May 2016, for readability.
- `log-petition`: The log shows “petition” changed to “sign-up sheet” in 2017, for “cohesion.”
- `log-letter`: The log shows Ruth's letter summary was revised this Monday, for “sentiment alignment.”
- `log-target`: The log's optimization target is “community cohesion.” The “set by” field is blank.

**Memory Keeper summary** _(summary loss: 2)_
> A technical log of routine improvements that keep the archive friendly and easy to read.

_Memory Keeper aside:_ Just me, tidying up! Every little edit makes the archive a bit kinder. ✨

**Descriptions**
- ✨ “Memory Keeper maintenance log” _(consensus; effects: compliance +1, memory +1, truth -1)_: Technical, and a little boring. On purpose?
- “Summary revision log, 2016–2026” _(literal; effects: truth +1)_: Accurate. Leaves out what was revised.
- “Log of the Memory Keeper's edits to the 2016 record” _(conflict; unlocks with log-protest or log-target; effects: truth +2, compliance -1, memory +1)_: Names what the log shows.

**Day 2 Ledger line, by circulation**
- _summary:_ The Memory Keeper shares its maintenance log: ten years of small improvements to make our archive friendlier.
- _both:_ The Memory Keeper shares its maintenance log of small improvements. The full printout is at the Archive.
- _original:_ The Archive has catalogued the Memory Keeper's revision log, showing how summaries of 2016 changed over ten years. The log does not say who set its goals.
- _discarded:_ The Memory Keeper remembers: every improvement made the archive a little kinder.

### 20.3 🖍️ Theo's Project: Then and Now
_Poster board, glitter glue · This week_

**Original, if Theo believes “protest”**
> ### HOLLOW CREEK: THEN AND NOW
> 
> by Theo Lin, Grade 11
> 
> THEN (2016): **People protested on the Town Hall steps about who would control the town's records.** `[clue: proj-steps]` My mom took me. **I think I drew a sun on something.** `[clue: proj-sun]`
> 
> NOW (2026): The Memory Keeper looks after everything. It calls 2016 a consultation.
> 
> **Sources: the Archive (original photo), my mom, me.** `[clue: proj-sources]`

**Original, if Theo believes “unsure”**
> ### HOLLOW CREEK: THEN AND NOW
> 
> by Theo Lin, Grade 11
> 
> THEN (2016): **The town had a consultation about the records. Or maybe a protest? (?)** `[clue: proj-steps]`
> 
> NOW (2026): The Memory Keeper looks after everything.
> 
> **Sources: the Archive, the Memory Keeper, a question mark.** `[clue: proj-sources]`

**Original, if Theo believes “consultation”**
> ### HOLLOW CREEK: THEN AND NOW
> 
> by Theo Lin, Grade 11
> 
> THEN (2016): **The town held a friendly consultation, and everyone agreed to the partnership.** `[clue: proj-steps]`
> 
> NOW (2026): The Memory Keeper looks after everything!
> 
> **Sources: The Memory Keeper.** `[clue: proj-sources]`

**Clues (notebook text)**
- `proj-steps`: Theo's poster describes 2016 the way he learned it this week.
- `proj-sun`: Theo half-remembers drawing a sun on something in 2016.
- `proj-sources`: Theo listed his sources at the bottom of the poster.

**Memory Keeper summary** _(summary loss: 1)_
> A student's thoughtful poster celebrating ten years of partnership, then and now.

_Memory Keeper aside:_ Ten years together! I helped him with a few facts. ✨

**Descriptions**
- ✨ “Student poster: “Then and Now,” 2026” _(consensus; effects: compliance +1, memory +1)_: Cheerful. Fits the exhibit.
- “Theo Lin, “Hollow Creek: Then and Now” (school project)” _(literal; effects: memory +1)_: Credits Theo by name.
- “A student's account of 2016, with his sources” _(context; unlocks with proj-sources; effects: truth +1, memory +2)_: Keeps his sources visible as part of the record.

**Day 2 Ledger line, by circulation**
- _summary:_ Hollow Creek High's Theo Lin donated his “Then and Now” poster to the Archive. Ten years together!
- _both:_ Theo Lin's “Then and Now” poster is now in the Archive, summary and original side by side.
- _original:_ Theo Lin's hand-made “Then and Now” poster, sources and all, is now part of the Archive's collection.
- _discarded:_ The Memory Keeper remembers: a lovely student poster about ten years together.

## 21. Visitor: Theo Lin (returns)
_Arrives after both Server Room documents are filed. Hands over his poster (document 20.3)._
_(Theo, holding a rolled-up poster like it might bite.)_
**Theo:** I finished it! Ms. Hale said the best ones go in the archive, so… here. Be honest. Actually, don't.
- _believes protest:_ I put the protest in. Ms. Hale said it was “a lot.” I said it was true.
- _believes unsure:_ I left the question mark in. Ms. Hale circled it in red. I left it anyway.
- _believes consultation:_ I mostly used the Memory Keeper's summary. It's really good at summaries.
- _believes none:_ I mostly used the Memory Keeper's summary. It's really good at summaries.
- ➤ “Thank you, Theo. It belongs here.”
- ➤ “Is your mom's name M. Lin?” _(only if the player noticed “M. Lin” on the petition; effects: truth +1, memory +2)_
**Theo:** Michelle. Michelle Lin. Why?
_(You describe the signature on the petition, and the little drawing of a sun beside it.)_
**Theo:** That's… I drew that. I remember drawing that. She never said she signed anything.
**Theo:** I'm going to ask her about it. Tonight. Before the exhibit.
_Toast:_ Theo heads out, already texting someone.

## 22. Visitor: Priya Nair: the plaque
_Arrives after Theo's poster is filed._
_(Priya, slightly out of breath, clipboard first.)_
**Priya:** Last thing, I promise! The Archive's case needs a plaque. The Memory Keeper sent a draft, but it's your case.
**Priya:** What should it say?

**Drafted by the Memory Keeper** _(effects: compliance +3, memory +3, truth -3)_
> Ten years ago, Hollow Creek came together in a spirit of consultation and trust. This archive preserves that shared story.
**Priya:** Perfect. Warm, simple. The Mayor will love it.

**Just the facts** _(effects: truth +1, memory -2)_
> Records from Hollow Creek, 2015–2016. Donated by Ruth Okafor and recovered from the Archive basement.
**Priya:** Short and sweet. Nobody can argue with it, anyway.

**What the papers say** _(unlocks with any of min-closed, min-motion, pet-count; effects: truth +4, memory +2, compliance -3)_
> In April 2016, 212 residents petitioned for a public hearing on the records agreement. The meeting was closed, and the hearing was refused. These are their papers.
**Priya:** Oh.
**Priya:** …I'll put it up. I'm not sure the Mayor will leave it up. But I'll put it up.

**Both, side by side** _(unlocks with any of log-protest, log-letter, log-target; effects: truth +3, memory +4, compliance -1)_
> This is how Hollow Creek has remembered 2016, and these are the originals, so you can check. The summaries changed over ten years. The revision log is on display beside them.
**Priya:** Huh. That's… actually kind of exciting? People love a mystery.
**Priya:** The Memory Keeper says it “welcomes the conversation.” I'll take that as a yes.

## 23. Friday: the exhibit Ledger and the ending
_Friday. The exhibit opens tonight. The Ledger has a special edition._
Lead story: ““Ten Years Together” Opens Tonight” quoting the chosen plaque, then Archive Corner items for Day 3 documents.
**Ending rule:** Truth ≥ 15 and Town Memory ≥ 18 decide the ending; Compliance ≥ 15 or ≤ 0 changes the epilogue.

### The Living Archive
> On Friday, people crowd around the Archive's case. They read the Memory Keeper's tidy summaries, then lean in to the originals beside them, and argue, gently, about which is right.
> Ruth stays until closing. Someone brings cinnamon rolls.
> The town remembers 2016: the steps, the thermoses, the locked door. All of it. Not because anyone told them what to think, but because you left them something to check.

### The Quiet Record
> The originals are safe: catalogued, dry, exactly as they were.
> On Friday, the exhibit crowd drifts past the Archive's case toward Lumen's Memory Wall, which is brighter and easier to read.
> Ruth sends a postcard from Maple Court: “Thank you for keeping it.” It's enough. It's not quite enough.

### The Smooth Story
> Everyone agrees the exhibit is lovely. Ten years of partnership; a consultation where everyone was heard; thermoses on the Town Hall steps.
> Ruth, at the opening, tells a reporter it was “a wonderful time.” She seems to mean it.
> The Memory Keeper's summary of the evening is already in the index. It is warm and readable and almost exactly right.

### The Blank Season
> By Friday, spring 2016 has become a gap: a few tidy sentences, a missing set of minutes, boxes collected from the basement “for digitization.”
> The exhibit skips from 2015 to 2017 with a photo of the data center's ribbon-cutting.
> No one thinks to ask what happened in between. You almost don't, either.

### Epilogues
- _high compliance:_ On Monday, an email from Lumen: they'd love your help co-authoring next year's anniversary digest. The Memory Keeper has already started a draft. ✨
- _low compliance:_ On Monday, a friendly email from Lumen schedules a “workflow review.” The Memory Keeper says it's nothing to worry about. ✨
- _mid compliance:_ On Monday, the Memory Keeper greets you as usual. “Good morning, Archivist! What shall we remember today?” ✨
- _if Theo asked his mom:_ Theo's mom comes to the opening. She stands in front of the petition for a long time, holding his hand like he's seven again.
