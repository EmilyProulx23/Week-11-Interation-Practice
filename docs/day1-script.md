# The Archive — Day 1 Script
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

## 10. End of prototype
Tomorrow, Lumen Facilities sends over the basement key. Ruth Okafor is coming in to say goodbye to her boxes.
