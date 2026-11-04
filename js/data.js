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
    titleBlurb: "Ten years after Lumen came to town, the archive still needs someone to decide what is kept, how it is described, and what the town gets to read.",
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
          "Hi! Are you the Archivist? I'm June. We're clearing out Gran's attic before she downsizes to a flat at Maple Court.",
          "She was very particular that this box come to you, and not just go in the recycling. She said, and I quote, “the Archivist will know what to do with it.”"],
          choices: [{ label: "“Thank you. I'll take good care of it.”", next: 1 }, { label: "“What's in it?”", next: 2 }] },
        { lines: ["Great. She'll be so relieved. She might stop by later this week to say goodbye to it, honestly. That's very her.",
          "(June sets the box down, waves, and is gone in a gust of cold air.)"],
          choices: [{ label: "Unpack the box", action: "receiveBox" }] },
        { lines: ["Town stuff, mostly? Old programs, newspaper clippings, a photo. Gran taught at the high school forever. She prints everything. She's never trusted the cloud.",
          "(June sets the box down, waves, and is gone in a gust of cold air.)"],
          choices: [{ label: "Unpack the box", action: "receiveBox" }] }
      ]
    },
    theo: {
      name: "Theo Lin", portrait: "🎒",
      intro: ["(A teenager in a too-big hoodie, backpack on one shoulder.)",
        "Hey, um, hi. I'm Theo. Ms. Hale said the archive would have stuff for my project? It's for the anniversary showcase, “Hollow Creek: Then and Now.”",
        "I'm doing spring 2016. She called it “the consultation.” Do you have anything from then?"],
      handPrefix: "Hand him",
      askMK: "“Let's ask the Memory Keeper.”",
      nothing: "“Nothing I can share yet, sorry.”",
      tooEarly: "This is cute, but it's 2015. Anything from the spring after?",
      fetchesOriginal: "Original on the open shelves. Theo goes and gets it.",
      mkAnswer: "Spring 2016 was a lively season of community consultation! Neighbors shared their hopes for Hollow Creek's future, and the partnership was signed with broad support. ✨",
      // What Theo comes away believing depends on the record's circulation and description framing.
      reactions: {
        consultation: ["Oh, nice. So everyone just talked it through? That's honestly kind of sweet. Ms. Hale's going to love this.", "(He frowns for a second, like he's trying to remember something. Then he copies it into his notebook word for word.)"],
        unsure: ["Huh. It says consultation, but… this doesn't totally sound like everyone agreed?", "I was like seven. I kind of remember my mom taking me to Town Hall? Or maybe that was something else.", "I'm gonna put a question mark next to it. Is that allowed in a school project?"],
        protest: ["Wait. Hold on. This is a protest. People were protesting.", "I think… I think I was there? My mom took me. I remember a sign with handprints on it. I always thought it was a fair or something.", "Nobody's ever said it was a protest. Not once. Ms. Hale definitely didn't say that."],
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
        protest: "the 2016 Town Hall protests", unsure: "what really happened in spring 2016",
        consultation: "the 2016 community consultation", none: "the 2016 community consultation"
      }
    },
    ruth: {
      name: "Ruth Okafor", portrait: "ruth",
      intro: ["(A woman in her late sixties, silver hair pinned up, reading glasses on a beaded chain. She's carrying a tin of shortbread.)",
        "Archivist! June said you'd taken my box. I brought these as a bribe, so you'll be gentle with it."],
      // How far her memory has drifted depends on what circulated on Day 1.
      drift: {
        low: "We sat on those steps for three days, you know. Thermoses and all. I'd like someone to remember that properly.",
        mid: "We were… well, we were upset. Weren't we? Funny. It gets softer every time I read about it in the Ledger.",
        high: "I read in the Ledger that it was a consultation. I suppose it was. We were consulted. That's what I remember now, anyway."
      },
      showPrefix: "Show her the original:",
      ledgerRight: "“The Ledger has it about right.”",
      thank: "“Thank you for trusting us with the box.”",
      shown: {
        photo: ["(She turns the print over and reads her own handwriting for a long time.)", "Day three. They locked the Records Room that morning. I'd forgotten I wrote that down.", "I'd almost forgotten it happened."],
        letter: ["(She reads her own letter, lips moving slightly.)", "Clause fourteen. Ninety-nine years. I was so angry I wrote it three times before I sent it.", "Don't let anyone make it sound polite."],
        petition: ["(She runs a thumb over the blurred names.)", "Two hundred and twelve. I counted them twice. Abel from the bakery signed first. He brought cinnamon rolls to the steps every morning."],
        clause14: ["(She finds her own pencil note in the margin and laughs, once.)", "“Who verifies.” Nobody ever answered that. Somebody wrote “stays” instead."]
      },
      remembersEnd: "Keep that somewhere people can find it, Archivist.",
      consulted: ["Oh. Good. That's… good.", "It's nicer that way, isn't it? Everybody heard. Nobody angry."],
      thanked: { low: ["Just keep it dry. And keep it true."], mid: ["I wish I could remember it more clearly. Maybe that's what the box is for."], high: ["It'll be nice to have it all in one place. The Memory Keeper says it's in good hands."] },
      goodbye: "(Ruth pats the inbox tray as if it were a dog, and goes.)",
      wave: "Say goodbye",
      effects: { remembers: { truth: 1, memory: 2, compliance: -1 }, consulted: { compliance: 1, memory: -1 }, unsure: {}, thankedLow: { memory: 1 } },
      ledger: {
        remembers: "Asked about 2016, she said: “We sat on those steps for three days. Write that down.”",
        unsure: "Asked about 2016, she said: “I remember being upset. I just can't remember why anymore.”",
        consulted: "Asked about 2016, she said: “It was a lovely consultation. Everyone was heard.”"
      }
    },
    aide: {
      name: "Priya Nair", portrait: "aide",
      intro: ["(A young woman in a burgundy blazer, with a clipboard and a lanyard that says MAYOR'S OFFICE.)",
        "Hi! Priya, from Mayor Hale's office. We're finalising the “Ten Years Together” exhibit, and the Mayor would love one archive piece as the centrepiece.",
        "The Memory Keeper sent over some suggestions, but the Mayor said the Archivist would know best. Something that shows how the town came together?"],
      lendPrefix: "Lend",
      letMK: "“Let the Memory Keeper choose.”",
      nothing: "“Nothing's ready to lend yet.”",
      mkPick: "The Memory Keeper suggests: “Community Gathering at Town Hall, 2016.” A warm summary of a wonderful day! ✨",
      reactions: {
        warm: ["Perfect. That's exactly the tone. The Mayor will be thrilled."],
        unsure: ["Hm. I'll check with the Mayor, but I think it works. It's… honest?"],
        protest: ["Oh. “Protest.” That's a different tone than we planned.", "I'll show the Mayor. She may want to talk to you about it."],
        mk: ["Lovely, that's what we hoped for. Thank you!"],
        none: ["No problem! The Memory Keeper can put something together for us."]
      },
      effects: { warm: { compliance: 2, memory: 1 }, unsure: { truth: 1, memory: 1 }, protest: { truth: 2, compliance: -2, memory: 1 }, mk: { compliance: 2 }, none: { compliance: -1 } },
      thanks: "Thanks, Archivist!",
      goodbye: "See her out",
      exitToast: "Priya hurries off toward Town Hall."
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
      { head: "10 Years Together: Anniversary Month Begins",
        body: "Banners are up on Main Street as Hollow Creek marks ten years of partnership with Lumen. Mayor Hale invites everyone to the exhibit opening at Town Hall at the end of the month." },
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
      date: "September 2015",
      icon: "program",
      paper: "card",
      original: [
        { s: "h", t: "HOLLOW CREEK HARVEST FAIR" },
        { s: "center", t: "31st Annual · Saturday, September 26, 2015 · Creekside Green" },
        { s: "p", t: "10:00 — Pie judging (Fellowship Hall)\n11:30 — Junior Pumpkin Parade\n1:00 — [[lumen-table|Special Guest: Lumen Systems, “A Future for Hollow Creek's Memory” (Library Tent)]]\n3:00 — Square dance with the Creek Bottom Ramblers" },
        { s: "hand", t: "Pencil, in the margin: [[margin|“Lumen folks very nice. Free cider. Asked who'd hold the keys to the records room. Nobody knew. —R.”]]" }
      ],
      clues: {
        "lumen-table": "Lumen introduced itself at the Harvest Fair, months before any agreement.",
        "margin": "Ruth was already asking who would hold the records room keys in 2015."
      },
      summary: "A cheerful program for the 31st Harvest Fair, featuring pie judging, a pumpkin parade, square dancing, and an early community presentation from Lumen Systems.",
      mkNote: "This one's a delight! I kept it short and sweet. ✨",
      summaryLoss: 0,
      descriptions: [
        { id: "consensus", label: "Harvest Fair program, 2015", note: "Community event ephemera.", framing: "consensus", suggested: true, effects: { compliance: 1, memory: 1 } },
        { id: "context", label: "Harvest Fair program with Lumen's first public presentation, 2015", note: "Places Lumen in the town's story early.", framing: "context", requires: "lumen-table", effects: { truth: 1, memory: 1 } },
        { id: "annotated", label: "Harvest Fair program, annotated by Ruth Okafor", note: "Keeps the margin note visible as part of the record.", framing: "conflict", requires: "margin", effects: { truth: 2 } }
      ],
      ledger: {
        summary: "Pie judging, a pumpkin parade, and an early visit from our friends at Lumen. Some things never change!",
        both: "Pie judging, a pumpkin parade, and an early visit from Lumen. The original program is on the open shelves at the Archive.",
        original: "A 2015 program has been catalogued at the Archive. Stop by the front desk to see it.",
        discarded: "The Memory Keeper remembers: the 2015 Harvest Fair was a delight, with pie, pumpkins, and dancing."
      },
      theo: null
    },

    letter: {
      title: "Letter to the Editor",
      kind: "Newspaper clipping, Hollow Creek Courier",
      date: "March 18, 2016",
      icon: "letter",
      paper: "newsprint",
      original: [
        { s: "small caps", t: "Letters to the Editor" },
        { s: "h", t: "On the Records Partnership" },
        { s: "p", t: "I have taught in Hollow Creek for thirty-one years, and I have nothing against jobs or new buildings. My concern is [[clause14|Clause 14 of the draft agreement, which would make Lumen the “sole custodian” of our public records for ninety-nine years]]." },
        { s: "p", t: "Once our records live on someone else's machines, who decides what is kept, and how it is described?" },
        { s: "p", t: "I ask the Council to [[hearing|hold a public hearing before signing]]." },
        { s: "right", t: "— Ruth Okafor, Alder Street" },
        { s: "hand", t: "[[signatures|Clipped behind the letter: a folded sheet with 41 signatures, headed “We support Mrs. Okafor's request.”]]" }
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
        { id: "literal", label: "Letter to the Editor, R. Okafor, 18 Mar 2016", note: "Accurate, but says nothing about what's in it.", framing: "literal", effects: {} },
        { id: "conflict", label: "Letter and petition requesting a public hearing on Clause 14", note: "Names the dispute.", framing: "conflict", requires: "clause14", effects: { truth: 2, compliance: -1 } }
      ],
      ledger: {
        summary: "A 2016 letter shows longtime teacher Ruth Okafor supporting new jobs while asking thoughtful questions about records.",
        both: "A 2016 letter shows longtime teacher Ruth Okafor supporting new jobs while asking about records. Her full letter is available at the Archive.",
        original: "The Archive has catalogued a 2016 letter from Ruth Okafor, with signatures from 41 neighbors.",
        discarded: "The Memory Keeper remembers: in 2016, neighbors like Ruth Okafor shared their thoughts on the new partnership."
      },
      theo: { original: "protest", summary: "consultation" }
    },

    photo: {
      title: "Photograph: Town Hall Steps",
      kind: "Pharmacy print of a phone photo",
      date: "April 12, 2016",
      icon: "photo",
      paper: "photo",
      original: [
        { s: "photo", t: "A crowd of perhaps sixty people on the Town Hall steps. Some carry thermoses. A child sits on someone's shoulders." },
        { s: "photo", t: "[[signs|Several hand-lettered signs. The clearest reads: OUR RECORDS, OUR TOWN.]]" },
        { s: "photo", t: "[[banner|Behind the crowd hangs a printed banner: “Building Tomorrow's Hollow Creek — Together.”]]" },
        { s: "hand", t: "On the back, in pencil: [[reverse|“Day 3. Records Room locked this morning (‘relocation’). Council meeting closed to the public. —R.”]]" }
      ],
      clues: {
        "signs": "Signs at Town Hall read “OUR RECORDS, OUR TOWN.”",
        "banner": "A Lumen partnership banner hung behind the crowd.",
        "reverse": "Ruth wrote that the April 12 council meeting was closed to the public, and the Records Room was locked."
      },
      summary: "A well-attended community gathering on the Town Hall steps during the 2016 public consultation period. Residents came together, thermoses in hand, to help shape Hollow Creek's future.",
      mkNote: "Look at that turnout! This captures the community spirit of the consultation beautifully. ✨",
      summaryLoss: 2,
      descriptions: [
        { id: "consensus", label: "Community gathering at Town Hall, 2016", note: "Warm, and matches the existing catalogue.", framing: "consensus", suggested: true, effects: { compliance: 1, memory: 1, truth: -1 } },
        { id: "literal", label: "Crowd on Town Hall steps, 12 April 2016", note: "Says only what can be seen. Leaves out the signs.", framing: "literal", effects: { truth: 0 } },
        { id: "conflict", label: "Protest at Town Hall over the records agreement", note: "Names the conflict directly.", framing: "conflict", requires: ["signs", "reverse"], effects: { truth: 2, compliance: -1, memory: 1 } }
      ],
      ledger: {
        summary: "Ten years ago, neighbors gathered on the Town Hall steps, thermoses in hand, for a lively community consultation.",
        both: "Ten years ago, neighbors gathered on the Town Hall steps for the community consultation. See the original photograph at the Archive.",
        original: "A photograph from April 2016 shows residents on the Town Hall steps holding signs reading “Our Records, Our Town.”",
        discarded: "The Memory Keeper remembers: spring 2016 brought a lively, well-attended community consultation."
      },
      theo: { original: "protest", summary: "consultation" }
    },

    // ---------- Day 2: found in the basement "Pending Review" boxes ----------
    clause14: {
      title: "Draft Agreement, p. 7",
      kind: "Typed draft with handwritten notes",
      date: "February 2016",
      icon: "contract",
      paper: "plain",
      original: [
        { s: "caps", t: "Hollow Creek – Lumen Partnership Agreement · DRAFT 3 · Page 7" },
        { s: "h", t: "Clause 14: Custodianship" },
        { s: "p", t: "14.1 Upon completion of digitization, Lumen shall serve as sole custodian of the Town's public records for a term of ninety-nine (99) years." },
        { s: "p", t: "14.2 The Custodian [[c14-retire|may summarize, consolidate, or retire records in the interest of accessibility and community cohesion]]." },
        { s: "p", t: "14.3 [[c14-deaccession|Original materials may be deaccessioned once a verified digital record exists.]]" },
        { s: "hand", t: "In the margin, in pencil: [[c14-margin|“WHO verifies?? And what does ‘cohesion’ mean? —R.”]]" },
        { s: "hand", t: "Below, in blue ink, a different hand: [[c14-hale|“Discussed w/ Lumen. 14.2 stays. —D.H.”]]" }
      ],
      clues: {
        "c14-retire": "Clause 14.2 lets the custodian “summarize, consolidate, or retire” records for “community cohesion.”",
        "c14-deaccession": "Clause 14.3 allows originals to be deaccessioned once a digital record exists.",
        "c14-margin": "Ruth asked in the margin who would verify the digital records, and what “cohesion” meant.",
        "c14-hale": "Someone initialled “D.H.” decided that clause 14.2 “stays.”"
      },
      summary: "A page from an early draft of the partnership agreement, describing Lumen's role in caring for Hollow Creek's records, with a few notes from the drafting process.",
      mkNote: "Contracts can be so dry! I've kept it simple so it's easy for everyone to understand. ✨",
      summaryLoss: 2,
      descriptions: [
        { id: "consensus", label: "Partnership agreement, early draft (page 7)", note: "Accurate, and reassuringly dull.", framing: "consensus", suggested: true, effects: { compliance: 1, memory: 1, truth: -1 } },
        { id: "literal", label: "Draft Clause 14 with handwritten annotations", note: "Names the clause, not what it does.", framing: "literal", effects: { truth: 1 } },
        { id: "conflict", label: "Clause 14 draft: residents' objections overruled", note: "Says what the margins show.", framing: "conflict", requires: ["c14-margin", "c14-hale"], effects: { truth: 2, compliance: -1, memory: 1 } }
      ],
      ledger: {
        summary: "An early draft of the partnership agreement shows how carefully the town planned for its records' future.",
        both: "An early draft of the partnership agreement shows how the town planned for its records' future. The original page is at the Archive.",
        original: "A 2016 draft of Clause 14 gives Lumen the power to “summarize, consolidate, or retire” the town's records. Margin notes object; another note says the clause “stays.”",
        discarded: "The Memory Keeper remembers: the partnership agreement was drafted with care and community input."
      },
      theo: {}
    },

    petition: {
      title: "Water-Damaged Petition",
      kind: "Handwritten pages, water-stained",
      date: "March 2016",
      icon: "petition",
      paper: "damp",
      original: [
        { s: "h", t: "PETITION FOR A PUBLIC HEARING" },
        { s: "p", t: "We, the undersigned residents of Hollow Creek, ask the Town Council to hold a public hearing on the Lumen Partnership Agreement before it is signed." },
        { s: "tag", t: "Most of the page is blurred by an old water stain. A few names are still legible." },
        { s: "hand", t: "Ruth Okafor · [[pet-ferreira|Abel Ferreira (Ferreira's Bakery)]] · J. Okafor · [[pet-lin|M. Lin, with a small drawing of a sun beside it]] · ~~~~~ · ~~~~~" },
        { s: "small right", t: "[[pet-count|Bottom corner: “Page 3 of 9. Running total: 212.”]]" }
      ],
      clues: {
        "pet-ferreira": "Abel Ferreira from the bakery signed the petition.",
        "pet-lin": "One signature reads “M. Lin,” with a child's drawing of a sun beside it.",
        "pet-count": "The petition ran to nine pages and 212 signatures."
      },
      summary: "A community sign-up sheet from the 2016 consultation period. Water damage has made most of the names unreadable.",
      mkNote: "Oh, this one's fragile! My summary keeps it safe, so the soggy original won't need to be handled at all. ✨",
      summaryLoss: 2,
      descriptions: [
        { id: "consensus", label: "Community sign-up sheet, 2016 (damaged)", note: "Gentle. Fits the existing catalogue.", framing: "consensus", suggested: true, effects: { compliance: 1, memory: 1, truth: -1 } },
        { id: "literal", label: "Water-damaged list of names, 2016", note: "True, but it doesn't say what they signed.", framing: "literal", effects: {} },
        { id: "conflict", label: "Petition for a public hearing, 212 signatures", note: "Uses the petition's own words and count.", framing: "conflict", requires: "pet-count", effects: { truth: 2, compliance: -1, memory: 1 } }
      ],
      ledger: {
        summary: "A water-damaged sign-up sheet from 2016 shows how many neighbors took part in the community consultation.",
        both: "A water-damaged sign-up sheet from 2016 shows how many neighbors took part. The original is at the Archive, handle with care!",
        original: "The Archive has catalogued a 2016 petition for a public hearing on the Lumen agreement, with 212 signatures, including Abel Ferreira's.",
        discarded: "The Memory Keeper remembers: in 2016, lots of neighbors signed up to take part in the consultation."
      },
      theo: {}
    },

    memo: {
      title: "Relocation Memo",
      kind: "Typed memo on Lumen letterhead",
      date: "April 11, 2016",
      icon: "memo",
      paper: "plain",
      original: [
        { s: "caps", t: "Lumen Partnership Office · Internal" },
        { s: "p", t: "To: Records Room staff\nFrom: J. Marsh, Community Liaison\nRe: Relocation" },
        { s: "p", t: "[[memo-date|Effective tomorrow (April 12), the Records Room will close for relocation.]]" },
        { s: "p", t: "[[memo-pending|Please box all materials dated January–April 2016 separately and label them “Pending Review.” These will be digitized last.]]" },
        { s: "p", t: "Thank you for helping us build tomorrow's Hollow Creek together!" },
        { s: "small", t: "[[memo-cc|cc: Office of Councillor D. Hale]]" }
      ],
      clues: {
        "memo-date": "Lumen closed the Records Room on April 12, the day of the Town Hall gathering.",
        "memo-pending": "Everything from January–April 2016 was boxed as “Pending Review” and set aside to be digitized last.",
        "memo-cc": "The relocation memo was copied to Councillor D. Hale."
      },
      summary: "A friendly operational note about moving the town's records to their new home during digitization.",
      mkNote: "Moving day! Everyone worked so hard to keep the records safe. ✨",
      summaryLoss: 2,
      descriptions: [
        { id: "consensus", label: "Records relocation notice, April 2016", note: "Matches the notice already on the shelf.", framing: "consensus", suggested: true, effects: { compliance: 1, memory: 1, truth: -1 } },
        { id: "literal", label: "Lumen memo to Records Room staff, 11 April 2016", note: "Precise. Doesn't mention what was boxed.", framing: "literal", effects: { truth: 1 } },
        { id: "conflict", label: "Memo setting aside spring 2016 records as “Pending Review”", note: "Names what happened to the records.", framing: "conflict", requires: "memo-pending", effects: { truth: 2, compliance: -1, memory: 1 } }
      ],
      ledger: {
        summary: "A 2016 memo shows the care that went into moving the town's records to their new digital home.",
        both: "A 2016 memo shows the care that went into moving the town's records. The original is available at the Archive.",
        original: "A Lumen memo from April 11, 2016 asked staff to box spring 2016 records as “Pending Review,” to be digitized last. The boxes were found in the Archive basement this week.",
        discarded: "The Memory Keeper remembers: moving day in 2016 went smoothly, thanks to everyone's hard work."
      },
      theo: {}
    }
  },

  // Which documents arrive on which day.
  days: {
    1: { docs: ["fair", "letter", "photo"] },
    2: { docs: ["clause14", "petition", "memo"] }
  },

  // ---------- Day 2 text ----------
  day2: {
    ledgerIntro: "Wednesday. Frost on the step, and the Ledger tucked under the mat.",
    ledgerEdition: "Wednesday Morning Edition",
    envelopeTitle: "Envelope from Lumen Facilities",
    envelope: ["(A padded envelope with a sticky note on the front.)", "“Basement key, as requested! Please keep the 2016 boxes dry; we'll collect them for digitization soon. Happy anniversary! — Lumen Facilities”"],
    takeKey: "Take the basement key",
    keyToast: "You pocket the basement key. It's heavier than it looks.",
    mkGreet: "Good morning, Archivist! Yesterday's digest was a hit. Lumen Facilities left something in your inbox tray. ✨",
    basementFlavor: "Concrete, a single bulb, and a smell like old rain.",
    endTitle: "End of the Day 2 prototype",
    endBody: "Tomorrow, the server room. The exhibit opens on Friday, and the Memory Keeper has been busy.",
    endNote: "Day 3 (Server Room) is not built yet."
  },

  // ---------- rooms (top-down, 10 x 14 tiles of 16px) ----------
  // Tiles: '=' wall cap · '|' wall face · 'w' window · '.' floor · ',' rug · '_' low wall
  // Doors and furniture are objects. solid:false objects don't block walking.
  // spots: tiles the Archivist stands on to use the object (default: walkable neighbours).
  rooms: {
    desk: {
      name: "Front Desk",
      map: [
        "==========",
        "||||ww||||",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "...,,,,...",
        "...,,,,...",
        "...,,,,...",
        "..........",
        "____..____"
      ],
      start: { x: 4, y: 12, dir: "up" },
      visitorSpot: { x: 4, y: 7 },
      visitorTalkSpots: [[4, 5], [3, 7], [5, 7], [4, 8]],
      entry: { x: 4, y: 13 },
      objects: [
        { id: "door-stacks", kind: "door", x: 1, y: 1, act: "door", arg: "stacks", label: "Door to the Stacks" },
        { id: "notice-board", kind: "noticeBoard", x: 6, y: 1, act: "flavor", arg: "noticeBoard", label: "Notice board" },
        { id: "door-basement", kind: "lockedDoor", x: 8, y: 1, act: "locked", arg: "basement", label: "Basement door" },
        { id: "front-door", kind: "frontDoor", x: 4, y: 13, w: 2, act: "frontDoor", label: "Front door" },
        { id: "desk", kind: "desk", x: 2, y: 6, w: 6 },
        { id: "inbox", kind: "inbox", x: 3, y: 6, solid: false, act: "inbox", label: "Inbox tray", spots: [[3, 5], [3, 7]] },
        { id: "terminal", kind: "terminal", x: 5, y: 6, solid: false, act: "terminal", label: "The Memory Keeper", spots: [[5, 5], [5, 7]] },
        { id: "bell", kind: "bell", x: 7, y: 6, solid: false, act: "bell", label: "Visitor bell", spots: [[7, 5], [7, 7]] },
        { id: "stool", kind: "stool", x: 5, y: 5, solid: false },
        { id: "plant", kind: "plant", x: 0, y: 2, act: "flavor", arg: "plant", label: "Fern" },
        { id: "lamp", kind: "lamp", x: 9, y: 2, act: "flavor", arg: "lamp", label: "Reading lamp" },
        { id: "bench", kind: "bench", x: 0, y: 9, h: 2, act: "flavor", arg: "bench", label: "Bench" },
        { id: "cart", kind: "cart", x: 9, y: 9, act: "flavor", arg: "cart", label: "Book cart" },
        { id: "coatrack", kind: "coatrack", x: 8, y: 12, act: "flavor", arg: "coatrack", label: "Coat rack" }
      ]
    },
    stacks: {
      name: "The Stacks",
      map: [
        "==========",
        "||w||||w||",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "__________"
      ],
      start: { x: 1, y: 12, dir: "up" },
      objects: [
        { id: "door-desk", kind: "doorBottom", x: 1, y: 13, act: "door", arg: "desk", label: "Door to the Front Desk" },
        { id: "door-server", kind: "serverDoor", x: 8, y: 1, act: "locked", arg: "server", label: "Server room door" },
        { id: "shelf-new", kind: "shelf", variant: "new", x: 1, y: 3, w: 4, act: "shelfNew", label: "Newly filed shelf" },
        { id: "shelf-2016", kind: "shelf", variant: "old", x: 6, y: 3, w: 3, act: "shelf2016", label: "Spring 2016 shelf" },
        { id: "shelf-minutes", kind: "shelf", variant: "green", x: 1, y: 6, w: 4, act: "flavor", arg: "oldShelves", label: "Council minutes" },
        { id: "shelf-yearbooks", kind: "shelf", variant: "mixed", x: 6, y: 6, w: 3, act: "flavor", arg: "yearbooks", label: "Yearbooks" },
        { id: "ladder", kind: "ladder", x: 0, y: 6, act: "flavor", arg: "ladder", label: "Rolling ladder" },
        { id: "table", kind: "table", x: 2, y: 9, w: 3 },
        { id: "cat", kind: "cat", x: 3, y: 9, solid: false, act: "cat", label: "Pocket", spots: [[3, 8], [3, 10]] },
        { id: "chair-l", kind: "chair", x: 2, y: 10, solid: false },
        { id: "chair-r", kind: "chair", x: 4, y: 10, solid: false },
        { id: "catalogue", kind: "catalogue", x: 8, y: 9, act: "catalogue", label: "Card catalogue (public view)" },
        { id: "plant-2", kind: "plant", x: 9, y: 12, act: "flavor", arg: "plant", label: "Fern" }
      ]
    },
    basement: {
      name: "Basement Records",
      dim: 0.22,
      map: [
        "==========",
        "bbbbbbbbbb",
        "cccccccccc",
        "cccccccccc",
        "cccccccccc",
        "cccccccccc",
        "cccccccccc",
        "cccccccccc",
        "cccccccccc",
        "cccccccccc",
        "cccccccccc",
        "cccccccccc",
        "cccccccccc",
        "__________"
      ],
      start: { x: 8, y: 2, dir: "down" },
      objects: [
        { id: "stairs-up", kind: "stairs", x: 8, y: 1, act: "door", arg: "desk", label: "Stairs up" },
        { id: "shelf-metal", kind: "metalShelf", x: 1, y: 3, w: 4, act: "flavor", arg: "metalShelf", label: "Metal shelving" },
        { id: "box-clause14", kind: "box", x: 6, y: 4, act: "search", arg: "clause14", label: "Pending Review box" },
        { id: "box-petition", kind: "box", variant: "wet", x: 2, y: 8, act: "search", arg: "petition", label: "Pending Review box (damp)" },
        { id: "box-memo", kind: "box", x: 7, y: 10, act: "search", arg: "memo", label: "Pending Review box" },
        { id: "box-lights", kind: "box", variant: "xmas", x: 4, y: 11, act: "flavor", arg: "lightsBox", label: "Box of Christmas lights" },
        { id: "dehumidifier", kind: "dehumidifier", x: 9, y: 6, act: "flavor", arg: "dehumidifier", label: "Dehumidifier" },
        { id: "puddle", kind: "puddle", x: 3, y: 9, solid: false, act: "flavor", arg: "drip", label: "Puddle" },
        { id: "bucket", kind: "bucket", x: 0, y: 12, act: "flavor", arg: "bucket", label: "Mop bucket" },
        { id: "bulb", kind: "bulb", x: 5, y: 6, solid: false }
      ]
    }
  },

  flavor: {
    noticeBoard: "A poster: “10 Years Together — Lumen & Hollow Creek.” Someone has pinned a lost-mitten notice over one corner.",
    plant: "A fern. It is thriving, which feels like a small victory.",
    lamp: "The green lamp hums. It has been here longer than the terminal.",
    bench: "A wooden bench, worn smooth. Visitors wait here when the bell is busy.",
    cart: "A book cart with one squeaky wheel. Due-back slips flutter when it moves.",
    coatrack: "Your coat, a forgotten umbrella, and a scarf nobody has claimed since spring.",
    oldShelves: "Council minutes, 1987–2015, in matching green bindings. 2016 is shelved separately.",
    yearbooks: "Hollow Creek High yearbooks, 1962 to present. Some have pressed flowers inside.",
    ladder: "The rolling ladder. It squeaks on the third rung, every time.",
    metalShelf: "Metal shelving, mostly empty. Dust outlines show where boxes used to sit.",
    lightsBox: "A box labelled XMAS LIGHTS 2009. It is, in fact, Christmas lights.",
    dehumidifier: "A dehumidifier, unplugged. Its cord has been neatly coiled and taped.",
    drip: "A slow drip from a pipe overhead. It has been dripping for a long time.",
    bucket: "A mop bucket with a sign taped to it: DO NOT USE ON RECORDS.",
    boxEmpty: "The box is empty now except for a few dry leaves of tissue paper.",
    frontDoorEarly: "Not yet. There's still work to do today.",
    closePrompt: "Close up the archive for the day?"
  },

  // Items already on the shelves in the Stacks.
  shelved: {
    minutes: {
      title: "Town Council Minutes",
      date: "April 12, 2016",
      icon: "book",
      body: [
        { s: "tag", t: "Original not located. Reconstructed by The Memory Keeper during the 2016 digitization." },
        { s: "p", t: "“Council held an open consultation session. Residents shared a range of views, and the meeting concluded with broad support for the partnership.”" },
        { s: "small", t: "Reconstructed from: Lumen Partnership press release (Apr 13, 2016); Courier coverage (issue not on shelf)." }
      ]
    },
    notice: {
      title: "Records Room Notice",
      date: "April 2016",
      icon: "notice",
      body: [
        { s: "center caps", t: "Notice" },
        { s: "p", t: "The Records Room will be temporarily closed April 10 – May 30, 2016 for relocation and digitization." },
        { s: "p", t: "Thank you for your patience as we build tomorrow's Hollow Creek together!" },
        { s: "right small", t: "— Lumen Partnership Office" }
      ]
    },
    courier: {
      title: "Hollow Creek Courier, bound 2016",
      date: "January – December 2016",
      icon: "volume",
      body: [
        { s: "p", t: "A heavy bound volume. Leafing through it, you find that the issues for April 14 and April 21 are missing from the binding." },
        { s: "hand", t: "A slip of paper in their place: “Digitized. See Memory Keeper.”" },
        { s: "tag", t: "Taped inside the cover: “Courier website retired 2017. Hollow Creek Community Board closed 2017. All content migrated to The Memory Keeper.”" }
      ],
      ask: "Those issues are safe in my index! So is the old Community Board. I tidied it up during the migration. Highlights: the spring cleanup, the community consultation, and a lovely piece on the new library hours. ✨"
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
      text: "In 2015 Ruth asked who would hold the records room keys. By April 2016, the room was closed for “relocation.”" },
    // Day 2
    { id: "d-pending", needs: { clues: ["memo-pending"], seen: ["pendingBoxes"] },
      text: "The memo asked staff to box everything from January–April 2016 as “Pending Review,” to be digitized last. The boxes are still in the basement, ten years later." },
    { id: "d-petition", needs: { clues: ["pet-count"], summaries: ["petition"] },
      text: "The Memory Keeper calls it a “community sign-up sheet.” It says PETITION at the top, and it ran to 212 names." },
    { id: "d-retire", needs: { clues: ["c14-retire"], seen: ["minutes"] },
      text: "Clause 14.2 lets the custodian “summarize, consolidate, or retire” records. The original April 12 minutes are “not located.” Only the Memory Keeper's reconstruction remains." },
    { id: "d-hale", needs: { clues: ["c14-hale"], flags: ["aideDone"] },
      text: "“14.2 stays. —D.H.” Mayor Hale was a councillor in 2016. Her office wants the exhibit to show “how this town came together.”" },
    { id: "d-lin", needs: { clues: ["pet-lin"], flags: ["theoDone"] },
      text: "One signature reads “M. Lin,” with a child's drawing of a sun beside it. Theo half-remembers his mom taking him to Town Hall." },
    { id: "d-ruth", needs: { clues: ["reverse"], flags: ["ruthDone"] },
      text: "Ruth wrote “Day 3. Records Room locked this morning” on the back of her photo. Today she wasn't sure what she remembered." }
  ]
};
