// The Archive — content for the Day 1 prototype.
// Hotspot syntax inside document text: [[clueId|visible text]]
// Effects use keys: truth, compliance, memory (Town Memory).

window.GAME_DATA = {
  dayStart: 9 * 60,   // 9:00
  dayEnd: 17 * 60,    // 17:00

  // The clock is cozy flavor only: there is no time limit.
  costs: { describe: 15, discard: 10, visitor: 20,
           circulate: { summary: 15, both: 45, original: 75 } },

  // ---------- scene prose & Memory Keeper lines ----------
  text: {
    titleBlurb: "Twenty years after Lumen came to town, the archive still needs someone to decide what is kept, how it is described, and what the town gets to read.",
    ledger1Intro: "Monday. The archive smells like radiator heat and old paper. Someone has left the Ledger on the front step.",
    ledger2Intro: "Tuesday. The Ledger is on the step again. You recognize a few of the sentences.",
    deskFlavor: "A green-shaded lamp, a brass bell, a terminal with a soft blue glow. Through the window, anniversary bunting flutters over Main Street.",
    stacksFlavor: "Tall oak shelves, a rolling ladder, a reading table under a skylight.",
    stacksArchivist: "The full collection, including closed storage.",
    stacksPublic: "This is what any visitor can find.",
    inboxFlavor: "From the Okafor attic. A cardboard box that says “GRAN — TOWN STUFF.”",
    catLines: ["Pocket purrs without opening her eyes.", "Pocket stretches one paw toward the lamp.", "Pocket is very warm."],
    basementLocked: "🔒 Locked. A note on the door: “Key with Lumen Facilities. Collect Tuesday.”",
    serverLocked: "🔒 A keypad door with a small Lumen logo. You don't have the code.",
    eveningIntro: "You switch off the reading lamps one by one. Pocket follows you to the door.",
    endBody: "Tomorrow, Lumen Facilities sends over the basement key. Ruth Okafor is coming in to say goodbye to her boxes.",
    mk: {
      greetMorning: "Good morning, Archivist! It's anniversary month. Isn't that exciting? I'm ready to help whenever a donation comes in. ✨",
      greetWorking: "Take your time! When you're ready, I'll prepare a friendly summary for each document. Readers love a short read. ✨",
      greetDone: "All caught up! You're doing a wonderful job looking after Hollow Creek's memory. ✨",
      discard: ["No problem at all! Not everything needs a shelf.", "I'll keep a little summary in my index, just in case. That way nothing is ever really lost. ✨"],
      eveningDigest: "Wonderful work today, Archivist! {n} {stories} ready for the anniversary digest. Sleep well! ✨",
      eveningNone: "Thank you for today, Archivist! I'll keep the digest warm for tomorrow. Sleep well! ✨"
    }
  },

  // ---------- visitors ----------
  visitors: {
    june: {
      name: "June Okafor", portrait: "🧣",
      nodes: [
        { lines: ["(The bell over the door jingles. A young woman shoulders in with a cardboard box.)",
          "Hi! Are you the Archivist? I'm June. We're clearing out Gran's attic before she moves to Maple Court.",
          "She was very particular that this box come to you, and not just go in the recycling. She said, and I quote, “the Archivist will know what to do with it.”"],
          choices: [{ label: "“Thank you. I'll take good care of it.”", next: 1 }, { label: "“What's in it?”", next: 2 }] },
        { lines: ["Great. She'll be so relieved. She might stop by later this week to say goodbye to it, honestly. That's very her.",
          "(June sets the box down, waves, and is gone in a gust of cold air.)"],
          choices: [{ label: "Unpack the box", action: "receiveBox" }] },
        { lines: ["Town stuff, mostly? Old programs, newspaper clippings, a photo. Gran taught at the high school forever. She kept everything.",
          "(June sets the box down, waves, and is gone in a gust of cold air.)"],
          choices: [{ label: "Unpack the box", action: "receiveBox" }] }
      ]
    },
    theo: {
      name: "Theo Lin", portrait: "🎒",
      intro: ["(A teenager in a too-big hoodie, backpack on one shoulder.)",
        "Hey, um, hi. I'm Theo. Ms. Hale said the archive would have stuff for my project? It's for the anniversary showcase, “Hollow Creek: Then and Now.”",
        "I'm doing spring 2006. She called it “the consultation.” Do you have anything from then?"],
      handPrefix: "Hand him",
      askMK: "“Let's ask the Memory Keeper.”",
      nothing: "“Nothing I can share yet, sorry.”",
      tooEarly: "This is cute, but it's 2005. Anything from the spring after?",
      fetchesOriginal: "Original on the open shelves. Theo goes and gets it.",
      mkAnswer: "Spring 2006 was a lively season of community consultation! Neighbors shared their hopes for Hollow Creek's future, and the partnership was signed with broad support. ✨",
      // What Theo comes away believing depends on the record's circulation and description framing.
      reactions: {
        consultation: ["Oh, nice. So everyone just talked it through? That's honestly kind of sweet. Ms. Hale's going to love this.", "(He copies it into his notebook word for word.)"],
        unsure: ["Huh. It says consultation, but… this doesn't totally sound like everyone agreed?", "I'm gonna put a question mark next to it. Is that allowed in a school project?"],
        protest: ["Wait. Hold on. This is a protest. People were protesting.", "Nobody's ever said that. Not once. Ms. Hale definitely didn't say that."],
        none: ["Oh. Okay, no worries! I'll just ask the Memory Keeper at home. It knows everything."]
      },
      effects: {
        consultation: { compliance: 1, memory: 1 }, unsure: { truth: 1, memory: 1 },
        protest: { truth: 1, memory: 1, compliance: -1 }, none: { memory: -1 }
      },
      thanks: "Thanks, Archivist. Seriously.",
      goodbye: "Wave goodbye",
      exitToast: "Theo heads out into the afternoon.",
      ledgerTopic: {
        protest: "the 2006 Town Hall protests", unsure: "what really happened in spring 2006",
        consultation: "the 2006 community consultation", none: "the 2006 community consultation"
      }
    }
  },

  circulation: {
    summary: {
      label: "Circulate the summary",
      blurb: "The Memory Keeper's summary goes into the public catalogue and the Ledger. The original moves to closed storage and is available at the desk on request.",
      access: "Closed storage — on request",
      effects: { compliance: 2, memory: 2 }
    },
    both: {
      label: "Summary + linked original",
      blurb: "The summary circulates, with a note pointing to the original, which stays on the open shelves.",
      access: "Open stacks",
      effects: { compliance: 1, memory: 2, truth: 1 }
    },
    original: {
      label: "Original only (hand-catalogued)",
      blurb: "You catalogue it yourself. The public sees the original and your description. Fewer people will read it closely.",
      access: "Open stacks",
      effects: { compliance: -1, memory: 1, truth: 2 }
    }
  },

  ledgerDay1: {
    edition: "Monday Morning Edition",
    stories: [
      { head: "20 Years Together: Anniversary Month Begins",
        body: "Banners are up on Main Street as Hollow Creek marks twenty years of partnership with Lumen. Mayor Hale invites everyone to the exhibit opening at Town Hall at the end of the month." },
      { head: "Archive Corner Returns!",
        body: "Our Archivist will be sharing treasures from the town's past all month, with a little help from The Memory Keeper. Donations welcome at the front desk." },
      { head: "Ferreira's Bakery",
        body: "Apple-cardamom buns are back. First batch out at 7. Bring your own mug for a free refill." , ad: true },
      { head: "Weather",
        body: "Crisp and golden. Leaves turning along the creek path.", small: true }
    ]
  },

  docs: {
    fair: {
      title: "Harvest Fair Program",
      kind: "Folded card program",
      date: "September 2005",
      icon: "🍎",
      paper: "card",
      original: [
        "<h3>HOLLOW CREEK HARVEST FAIR</h3>",
        "<p class='center'>31st Annual · Saturday, September 24, 2005 · Creekside Green</p>",
        "<p>10:00 — Pie judging (Fellowship Hall)<br>11:30 — Junior Pumpkin Parade<br>1:00 — [[lumen-table|Special Guest: Lumen Systems, “A Future for Hollow Creek's Memory” (Library Tent)]]<br>3:00 — Square dance with the Creek Bottom Ramblers</p>",
        "<p class='hand'>Pencil, in the margin: [[margin|“Lumen folks very nice. Free cider. Asked who'd hold the keys to the records room. Nobody knew. —R.”]]</p>"
      ],
      clues: {
        "lumen-table": "Lumen introduced itself at the Harvest Fair, months before any agreement.",
        "margin": "Ruth was already asking who would hold the records room keys in 2005."
      },
      summary: "A cheerful program for the 31st Harvest Fair, featuring pie judging, a pumpkin parade, square dancing, and an early community presentation from Lumen Systems.",
      mkNote: "This one's a delight! I kept it short and sweet. ✨",
      summaryLoss: 0,
      descriptions: [
        { id: "consensus", label: "Harvest Fair program, 2005", note: "Community event ephemera.", framing: "consensus", suggested: true, effects: { compliance: 1, memory: 1 } },
        { id: "context", label: "Harvest Fair program with Lumen's first public presentation, 2005", note: "Places Lumen in the town's story early.", framing: "context", requires: "lumen-table", effects: { truth: 1, memory: 1 } },
        { id: "annotated", label: "Harvest Fair program, annotated by Ruth Okafor", note: "Keeps the margin note visible as part of the record.", framing: "conflict", requires: "margin", effects: { truth: 2 } }
      ],
      ledger: {
        summary: "Pie judging, a pumpkin parade, and an early visit from our friends at Lumen. Some things never change!",
        both: "Pie judging, a pumpkin parade, and an early visit from Lumen. The original program is on the open shelves at the Archive.",
        original: "A 2005 program has been catalogued at the Archive. Stop by the front desk to see it.",
        discarded: "The Memory Keeper remembers: the 2005 Harvest Fair was a delight, with pie, pumpkins, and dancing."
      },
      theo: null
    },

    letter: {
      title: "Letter to the Editor",
      kind: "Newspaper clipping, Hollow Creek Courier",
      date: "March 18, 2006",
      icon: "✉️",
      paper: "newsprint",
      original: [
        "<p class='small caps'>Letters to the Editor</p>",
        "<h3>On the Records Partnership</h3>",
        "<p>I have taught in Hollow Creek for thirty-one years, and I have nothing against jobs or new buildings. My concern is [[clause14|Clause 14 of the draft agreement, which would make Lumen the “sole custodian” of our public records for ninety-nine years]].</p>",
        "<p>Once our records live on someone else's machines, who decides what is kept, and how it is described?</p>",
        "<p>I ask the Council to [[hearing|hold a public hearing before signing]].</p>",
        "<p class='right'>— Ruth Okafor, Alder Street</p>",
        "<p class='hand'>[[signatures|Clipped behind the letter: a folded sheet with 41 signatures, headed “We support Mrs. Okafor's request.”]]</p>"
      ],
      clues: {
        "clause14": "Clause 14 would have made Lumen “sole custodian” of public records for 99 years.",
        "hearing": "Ruth asked the Council for a public hearing before signing.",
        "signatures": "41 neighbors signed in support of Ruth's request."
      },
      summary: "A longtime local teacher shares her thoughts on the upcoming Lumen partnership, expressing support for new jobs and asking the Council how records will be managed.",
      mkNote: "Such a thoughtful neighbor! I smoothed out the legal language so anyone can follow along. ✨",
      summaryLoss: 2,
      descriptions: [
        { id: "consensus", label: "Resident welcomes new jobs, asks about records", note: "Friendly and readable.", framing: "consensus", suggested: true, effects: { compliance: 1, memory: 1, truth: -1 } },
        { id: "literal", label: "Letter to the Editor, R. Okafor, 18 Mar 2006", note: "Accurate, but says nothing about what's in it.", framing: "literal", effects: {} },
        { id: "conflict", label: "Letter and petition requesting a public hearing on Clause 14", note: "Names the dispute.", framing: "conflict", requires: "clause14", effects: { truth: 2, compliance: -1 } }
      ],
      ledger: {
        summary: "A 2006 letter shows longtime teacher Ruth Okafor supporting new jobs while asking thoughtful questions about records.",
        both: "A 2006 letter shows longtime teacher Ruth Okafor supporting new jobs while asking about records. Her full letter is available at the Archive.",
        original: "The Archive has catalogued a 2006 letter from Ruth Okafor, with signatures from 41 neighbors.",
        discarded: "The Memory Keeper remembers: in 2006, neighbors like Ruth Okafor shared their thoughts on the new partnership."
      },
      theo: { original: "protest", summary: "consultation" }
    },

    photo: {
      title: "Photograph: Town Hall Steps",
      kind: "Black & white print",
      date: "April 12, 2006",
      icon: "📷",
      paper: "photo",
      original: [
        "<div class='photo-frame'><p class='photo-desc'>A crowd of perhaps sixty people on the Town Hall steps. Some carry thermoses. A child sits on someone's shoulders.</p>",
        "<p class='photo-desc'>[[signs|Several hand-lettered signs. The clearest reads: OUR RECORDS, OUR TOWN.]]</p>",
        "<p class='photo-desc'>[[banner|Behind the crowd hangs a printed banner: “Building Tomorrow's Hollow Creek — Together.”]]</p></div>",
        "<p class='hand'>On the back, in pencil: [[reverse|“Day 3. Records Room locked this morning (‘relocation’). Council meeting closed to the public. —R.”]]</p>"
      ],
      clues: {
        "signs": "Signs at Town Hall read “OUR RECORDS, OUR TOWN.”",
        "banner": "A Lumen partnership banner hung behind the crowd.",
        "reverse": "Ruth wrote that the April 12 council meeting was closed to the public, and the Records Room was locked."
      },
      summary: "A well-attended community gathering on the Town Hall steps during the 2006 public consultation period. Residents came together, thermoses in hand, to help shape Hollow Creek's future.",
      mkNote: "Look at that turnout! This captures the community spirit of the consultation beautifully. ✨",
      summaryLoss: 2,
      descriptions: [
        { id: "consensus", label: "Community gathering at Town Hall, 2006", note: "Warm, and matches the existing catalogue.", framing: "consensus", suggested: true, effects: { compliance: 1, memory: 1, truth: -1 } },
        { id: "literal", label: "Crowd on Town Hall steps, 12 April 2006", note: "Says only what can be seen. Leaves out the signs.", framing: "literal", effects: { truth: 0 } },
        { id: "conflict", label: "Protest at Town Hall over the records agreement", note: "Names the conflict directly.", framing: "conflict", requires: ["signs", "reverse"], effects: { truth: 2, compliance: -1, memory: 1 } }
      ],
      ledger: {
        summary: "Twenty years ago, neighbors gathered on the Town Hall steps, thermoses in hand, for a lively community consultation.",
        both: "Twenty years ago, neighbors gathered on the Town Hall steps for the community consultation. See the original photograph at the Archive.",
        original: "A photograph from April 2006 shows residents on the Town Hall steps holding signs reading “Our Records, Our Town.”",
        discarded: "The Memory Keeper remembers: spring 2006 brought a lively, well-attended community consultation."
      },
      theo: { original: "protest", summary: "consultation" }
    }
  },

  // Items already on the shelves in the Stacks.
  shelved: {
    minutes: {
      title: "Town Council Minutes",
      date: "April 12, 2006",
      icon: "📒",
      body: [
        "<p class='mk-tag'>Original not located. Reconstructed by The Memory Keeper during the 2006 digitization.</p>",
        "<p>“Council held an open consultation session. Residents shared a range of views, and the meeting concluded with broad support for the partnership.”</p>",
        "<p class='small'>Reconstructed from: Lumen Partnership press release (Apr 13, 2006); Courier coverage (issue not on shelf).</p>"
      ]
    },
    notice: {
      title: "Records Room Notice",
      date: "April 2006",
      icon: "📌",
      body: [
        "<p class='center caps'>Notice</p>",
        "<p>The Records Room will be temporarily closed <b>April 10 – May 30, 2006</b> for relocation and digitization.</p>",
        "<p>Thank you for your patience as we build tomorrow's Hollow Creek together!</p>",
        "<p class='right small'>— Lumen Partnership Office</p>"
      ]
    },
    courier: {
      title: "Hollow Creek Courier, bound 2006",
      date: "January – December 2006",
      icon: "📚",
      body: [
        "<p>A heavy bound volume. Leafing through it, you find that the issues for <b>April 14</b> and <b>April 21</b> are missing from the binding.</p>",
        "<p class='hand'>A slip of paper in their place: “Digitized. See Memory Keeper.”</p>"
      ],
      ask: "Those issues are safe in my index! Highlights: the spring cleanup, the community consultation, and a lovely piece on the new library hours. ✨"
    }
  },

  // Discrepancies: written to the notebook when conditions are met.
  discrepancies: [
    { id: "d-minutes", needs: { clues: ["reverse"], seen: ["minutes"] },
      text: "The reconstructed council minutes describe an “open consultation session.” Ruth's note on the photograph says the April 12 meeting was closed to the public." },
    { id: "d-letter", needs: { clues: ["clause14"], summaries: ["letter"] },
      text: "The Memory Keeper says Ruth expressed “support for new jobs.” She wrote that she had “nothing against” them, and asked for a hearing on Clause 14." },
    { id: "d-signs", needs: { clues: ["signs"], summaries: ["photo"] },
      text: "The Memory Keeper calls it a “community gathering.” The signs read OUR RECORDS, OUR TOWN." },
    { id: "d-courier", needs: { clues: ["reverse"], seen: ["courier"] },
      text: "The Courier issues from the week after April 12 are missing from the bound volume. Only the Memory Keeper's index has them." },
    { id: "d-keys", needs: { clues: ["margin"], seen: ["notice"] },
      text: "In 2005 Ruth asked who would hold the records room keys. By April 2006, the room was closed for “relocation.”" }
  ]
};
