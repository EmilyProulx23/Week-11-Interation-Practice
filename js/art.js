// The Archive — all pixel art, drawn in code. 1 unit = 1 pixel at native resolution.
(function () {
  "use strict";
  const T = 16;

  const C = {
    ink: "#2b1d16", woodD: "#5e3a22", wood: "#8a5a3a", woodL: "#b07a4f", woodH: "#c99466",
    floorA: "#c08a58", floorB: "#b47f4f", floorLine: "#9c6a3f",
    wall: "#e9d7b4", wallS: "#d6c09a", trim: "#7a4e30", cap: "#4a2f1f", capL: "#6b4530",
    paper: "#fbf4e2", paperS: "#e3d3b0", cream: "#f3e6c8",
    rust: "#a8572f", rug: "#8c3f2a", rugL: "#c76b3f", rugB: "#e0a15a",
    amber: "#f2c14e", glow: "#ffe9a8", brass: "#d4a33c", brassD: "#9c7224",
    teal: "#3f7f7a", tealL: "#7cc4bc", tealD: "#255450",
    blue: "#3e5a8a", navy: "#2a3c5e", green: "#5c7a3a", greenD: "#3e5426", greenL: "#86a356",
    red: "#b5443a", plum: "#6b3e5e", grey: "#8b8378", greyL: "#c2bbb0", greyD: "#5a544c",
    white: "#fffaf0", sky: "#a9d3e8", skyD: "#7fb3cf", cork: "#b98a55"
  };

  const r = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const hash = (x, y, s) => { let n = (x * 374761393 + y * 668265263 + (s || 0) * 982451653) | 0; n = (n ^ (n >>> 13)) * 1274126177; return ((n ^ (n >>> 16)) >>> 0) / 4294967295; };
  const canvas = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };

  // ---------- characters (role letters → per-character palette) ----------
  const FACE_GLASSES = "...hskksskksh...", FACE_EYES = "...hssksskssh...";
  const SIDE_GLASSES = "....hhhhsskks...", SIDE_EYES = "....hhhhsssks...";
  const BODY = {
    down: ["......hhhh......", "....hhhhhhhh....", "...hhhhhhhhhh...", "...hhsssssshh...", "...hssssssssh...", "FACE",
           "...hssssssssh...", "....hssssssh....", "....uuzzzzuu....", "...uuuzzzzuuu...", "..uuuuzzzzuuuu..", "..suuuuUUuuuus..", "...uuuuUUuuuu..."],
    up:   ["......hhhh......", "....hhhhhhhh....", "...hhhhhhhhhh...", "...hhhhhhhhhh...", "...hhhhhhhhhh...", "...hhhhhhhhhh...",
           "...hhhhhhhhhh...", "....hhhhhhhh....", "....uuuuuuuu....", "...uuuuuuuuuu...", "..uuuuuuuuuuuu..", "..suuuuuuuuuus..", "...uuuuUUuuuu..."],
    side: ["......hhhh......", ".....hhhhhhh....", "....hhhhhhhhh...", "....hhhhhssss...", "....hhhhsssss...", "SIDE",
           "....hhhhsssss...", ".....hhhssss....", ".....uuzzuu.....", "....uuuuzuuu....", "....uuuuuuuu....", "....uuusuuuu....", "....uuuuuuuu...."]
  };
  const LEGS = {
    front: [["....nnnnnnnn....", "....nnn..nnn....", "....kkk..kkk...."],
            ["....nnnnnnnn....", "....nnn...nn....", "....kkk........."],
            ["....nnnnnnnn....", "....nn...nnn....", ".........kkk...."]],
    side:  [[".....nnnnnn.....", "......nnnn......", "......kkkk......"],
            [".....nnnnnn.....", ".....nn..nn.....", "....kk....kk...."],
            [".....nnnnnn.....", "......nnnn......", "......kkkk......"]]
  };
  const PEOPLE = {
    archivist: { glasses: true, pal: { h: "#4a3426", s: "#d9a27a", u: "#c9963a", U: "#9a6e26", z: "#f3e6c8", n: "#4a3b4f", k: C.ink } },
    june:      { glasses: false, pal: { h: "#1e1a1a", s: "#8d5a3b", u: "#4f6b4a", U: "#3a5038", z: "#b5443a", n: "#3a3340", k: C.ink } },
    theo:      { glasses: false, pal: { h: "#6b4a2e", s: "#e8c09a", u: "#5b6d8f", U: "#3f4d68", z: "#3f4d68", n: "#3e5a8a", k: C.ink } }
  };

  function gridToCanvas(rows, pal, outline) {
    const h = rows.length, w = rows[0].length, c = canvas(w + 2, h + 2), x = c.getContext("2d");
    rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== "." && pal[ch]) r(x, i + 1, j + 1, 1, 1, pal[ch]); }));
    if (outline) {
      const d = x.getImageData(0, 0, c.width, c.height), a = (i, j) => (i < 0 || j < 0 || i >= c.width || j >= c.height) ? 0 : d.data[(j * c.width + i) * 4 + 3];
      x.fillStyle = outline;
      for (let j = 0; j < c.height; j++) for (let i = 0; i < c.width; i++)
        if (!a(i, j) && (a(i - 1, j) || a(i + 1, j) || a(i, j - 1) || a(i, j + 1))) x.fillRect(i, j, 1, 1);
    }
    return c;
  }
  function mirror(src) { const c = canvas(src.width, src.height), x = c.getContext("2d"); x.translate(src.width, 0); x.scale(-1, 1); x.drawImage(src, 0, 0); return c; }

  const cache = {};
  function person(name, dir, frame) {
    const key = name + dir + frame;
    if (cache[key]) return cache[key];
    const p = PEOPLE[name];
    const base = dir === "up" ? "up" : dir === "down" ? "down" : "side";
    const rows = BODY[base].map((row) => row === "FACE" ? (p.glasses ? FACE_GLASSES : FACE_EYES) : row === "SIDE" ? (p.glasses ? SIDE_GLASSES : SIDE_EYES) : row);
    const legs = LEGS[base === "side" ? "side" : "front"][frame];
    let c = gridToCanvas(rows.concat(legs), p.pal, "rgba(43,29,22,.85)");
    if (dir === "left") c = mirror(c);
    return (cache[key] = c);
  }

  const CAT = ["..o..o........", "..oooo........", ".oooooooooo...", ".ookoooOoOoo..", "oooooOoooOoooo", "oooooooooooooo", ".ooooooooooooO", "..wwoooooooOO."];
  const catSprite = () => cache.cat || (cache.cat = gridToCanvas(CAT, { o: "#c98b4a", O: "#8a5a2e", k: C.ink, w: C.cream }, "rgba(43,29,22,.85)"));

  // ---------- tiles ----------
  function tile(c, ch, col, row, map) {
    const x = col * T, y = row * T;
    if (ch === "." || ch === ",") {
      r(c, x, y, T, T, (row % 2) ? C.floorA : C.floorB);
      for (let k = 0; k < 4; k++) r(c, x, y + k * 4 + 3, T, 1, C.floorLine);
      for (let k = 0; k < 4; k++) { const sx = Math.floor(hash(col, row * 4 + k) * 14) + 1; r(c, x + sx, y + k * 4, 1, 3, C.floorLine); }
      if (ch === ",") {
        const isRug = (i, j) => map[j] && map[j][i] === ",";
        r(c, x, y, T, T, C.rugL);
        for (let i = 0; i < T; i += 4) for (let j = 0; j < T; j += 4) if (((i + j) / 4) % 2 === 0) r(c, x + i + 1, y + j + 1, 2, 2, C.rugB);
        if (!isRug(col, row - 1)) r(c, x, y, T, 2, C.rug);
        if (!isRug(col, row + 1)) r(c, x, y + T - 2, T, 2, C.rug);
        if (!isRug(col - 1, row)) r(c, x, y, 2, T, C.rug);
        if (!isRug(col + 1, row)) r(c, x + T - 2, y, 2, T, C.rug);
      }
    } else if (ch === "=") {
      r(c, x, y, T, T, C.cap); r(c, x, y + T - 3, T, 3, C.capL);
    } else if (ch === "|" || ch === "w") {
      r(c, x, y, T, T, C.wall);
      for (let i = 2; i < T; i += 5) r(c, x + i, y, 1, 10, C.wallS);
      r(c, x, y + 10, T, 6, C.trim); r(c, x, y + 10, T, 1, C.woodH); r(c, x, y + 15, T, 1, C.woodD);
      if (ch === "w") {
        r(c, x + 2, y + 1, 12, 9, C.woodD); r(c, x + 3, y + 2, 10, 7, C.sky); r(c, x + 3, y + 6, 10, 3, C.skyD);
        r(c, x + 7, y + 2, 2, 7, C.woodD);
        // anniversary bunting
        for (let i = 0; i < 5; i++) r(c, x + 3 + i * 2, y + 3 + (i % 2), 1, 2, [C.red, C.amber, C.teal][i % 3]);
      }
    } else if (ch === "_") {
      r(c, x, y, T, T, C.cap); r(c, x, y, T, 3, C.capL);
    }
  }

  // ---------- objects ----------
  function books(c, x, y, w, h, seed, palette) {
    let i = 0;
    while (i < w - 1) {
      const bw = 2 + Math.floor(hash(seed, i) * 2), bh = h - Math.floor(hash(i, seed) * 3);
      if (i + bw > w) break;
      const col = palette[Math.floor(hash(i * 7, seed) * palette.length)];
      r(c, x + i, y + (h - bh), bw, bh, col); r(c, x + i, y + (h - bh), bw, 1, "rgba(255,255,255,.25)");
      i += bw;
    }
  }

  function drawObject(c, o, st) {
    const x = o.x * T, y = o.y * T, w = (o.w || 1) * T, h = (o.h || 1) * T, t = st.t;
    switch (o.kind) {
      case "door": case "lockedDoor": case "serverDoor": {
        const metal = o.kind === "serverDoor";
        r(c, x + 1, y - 3, 14, 19, C.ink);
        r(c, x + 2, y - 2, 12, 18, metal ? C.greyL : o.kind === "lockedDoor" ? C.woodD : C.wood);
        r(c, x + 3, y, 4, 6, metal ? C.grey : C.woodD); r(c, x + 9, y, 4, 6, metal ? C.grey : C.woodD);
        if (metal) {
          r(c, x + 10, y + 8, 3, 4, C.ink); r(c, x + 11, y + 9, 1, 1, Math.floor(t * 2) % 2 ? C.red : C.greenL);
          r(c, x + 4, y + 8, 3, 3, C.teal); r(c, x + 5, y + 9, 1, 1, C.tealL);
        } else {
          r(c, x + 11, y + 9, 2, 2, C.brass);
          if (o.kind === "lockedDoor") { r(c, x + 6, y + 8, 4, 4, C.brass); r(c, x + 7, y + 6, 2, 2, C.brassD); r(c, x + 7, y + 10, 2, 1, C.ink); }
        }
        break;
      }
      case "doorBottom": {
        r(c, x + 1, y, 14, T, C.ink); r(c, x + 2, y, 12, 14, C.wood); r(c, x + 2, y, 12, 2, C.woodH); r(c, x + 11, y + 6, 2, 2, C.brass);
        r(c, x + 2, y - 4, 12, 4, C.rust); r(c, x + 3, y - 3, 10, 2, C.rugB);
        break;
      }
      case "frontDoor": {
        r(c, x, y, w, T, C.ink);
        for (let k = 0; k < 2; k++) { const dx = x + k * T; r(c, dx + 1, y + 1, 14, 15, C.wood); r(c, dx + 3, y + 2, 10, 7, C.skyD); r(c, dx + 3, y + 2, 10, 2, C.sky); }
        r(c, x + T - 2, y + 9, 1, 3, C.brass); r(c, x + T + 1, y + 9, 1, 3, C.brass);
        r(c, x + 2, y - 5, w - 4, 4, C.green); r(c, x + 3, y - 4, w - 6, 2, C.greenL);
        if (st.glowFront) glowRect(c, x, y, w, T, t);
        break;
      }
      case "noticeBoard": {
        r(c, x + 1, y + 1, 14, 9, C.woodD); r(c, x + 2, y + 2, 12, 7, C.cork);
        r(c, x + 3, y + 3, 4, 5, C.paper); r(c, x + 8, y + 3, 5, 3, C.amber); r(c, x + 9, y + 6, 3, 2, C.tealL);
        r(c, x + 4, y + 3, 1, 1, C.red); r(c, x + 10, y + 3, 1, 1, C.red);
        break;
      }
      case "desk": {
        r(c, x, y - 2, w, h + 2, C.ink);
        r(c, x + 1, y - 1, w - 2, 9, C.woodL); r(c, x + 1, y - 1, w - 2, 1, C.woodH);
        r(c, x + 1, y + 8, w - 2, 7, C.wood);
        for (let i = 1; i < w / T; i++) r(c, x + i * T, y + 9, 1, 6, C.woodD);
        r(c, x + 1, y + 14, w - 2, 1, C.woodD);
        break;
      }
      case "inbox": {
        r(c, x + 2, y + 1, 12, 6, C.ink); r(c, x + 3, y + 2, 10, 4, C.greyL);
        if (st.inbox > 0) for (let k = 0; k < Math.min(3, st.inbox); k++) { r(c, x + 3 + k, y - k * 2, 9, 3, k % 2 ? C.paperS : C.paper); r(c, x + 4 + k, y + 1 - k * 2, 5, 1, C.greyL); }
        if (st.glowInbox) sparkle(c, x + 13, y - 6, t);
        break;
      }
      case "terminal": {
        r(c, x + 2, y - 8, 12, 12, C.ink); r(c, x + 3, y - 7, 10, 10, C.cream);
        r(c, x + 4, y - 6, 8, 7, C.tealD);
        r(c, x + 5, y - 5, 5, 1, C.tealL); r(c, x + 5, y - 3, 4, 1, C.teal);
        if (Math.floor(t * 2) % 2) r(c, x + 10, y - 3, 1, 1, C.tealL);
        r(c, x + 6, y + 4, 4, 2, C.greyD); r(c, x + 3, y + 5, 10, 2, C.greyL);
        break;
      }
      case "bell": {
        const wob = st.bellRinging ? Math.round(Math.sin(t * 30)) : 0;
        r(c, x + 5 + wob, y - 1, 6, 4, C.brass); r(c, x + 4 + wob, y + 3, 8, 2, C.brassD); r(c, x + 7 + wob, y - 3, 2, 2, C.brassD);
        r(c, x + 6 + wob, y, 2, 1, C.glow);
        if (st.bellRinging) { r(c, x + 1, y - 2, 1, 2, C.ink); r(c, x + 14, y - 2, 1, 2, C.ink); }
        break;
      }
      case "stool": r(c, x + 4, y + 6, 8, 5, C.ink); r(c, x + 5, y + 6, 6, 3, C.woodL); r(c, x + 5, y + 9, 1, 3, C.woodD); r(c, x + 10, y + 9, 1, 3, C.woodD); break;
      case "plant": {
        r(c, x + 4, y + 8, 8, 7, C.ink); r(c, x + 5, y + 9, 6, 5, C.rust);
        const leaf = [[2, 2], [5, -2], [9, -3], [12, 1], [7, 3], [3, 5], [11, 5]];
        leaf.forEach(([lx, ly], i) => { r(c, x + lx, y + ly, 3, 5, i % 2 ? C.green : C.greenL); });
        r(c, x + 7, y + 4, 2, 5, C.greenD);
        break;
      }
      case "lamp": {
        r(c, x + 7, y - 2, 2, 16, C.greyD); r(c, x + 4, y + 13, 8, 2, C.ink);
        r(c, x + 3, y - 7, 10, 6, C.ink); r(c, x + 4, y - 6, 8, 4, C.greenD); r(c, x + 4, y - 3, 8, 1, C.amber);
        break;
      }
      case "bench": r(c, x + 2, y + 1, 12, h - 2, C.ink); r(c, x + 3, y + 2, 10, h - 4, C.woodL); for (let k = y + 5; k < y + h - 2; k += 5) r(c, x + 3, k, 10, 1, C.wood); break;
      case "cart": {
        r(c, x + 1, y + 2, 14, 11, C.ink); r(c, x + 2, y + 3, 12, 9, C.wood); r(c, x + 2, y + 7, 12, 1, C.woodD);
        books(c, x + 2, y - 1, 12, 4, 3, [C.blue, C.red, C.green, C.plum, C.amber]);
        books(c, x + 2, y + 4, 12, 3, 9, [C.navy, C.rust, C.teal]);
        r(c, x + 3, y + 13, 2, 2, C.ink); r(c, x + 11, y + 13, 2, 2, C.ink);
        break;
      }
      case "coatrack": {
        r(c, x + 7, y - 6, 2, 20, C.woodD); r(c, x + 4, y + 13, 8, 2, C.ink);
        r(c, x + 3, y - 4, 5, 9, C.plum); r(c, x + 9, y - 3, 4, 7, C.red); r(c, x + 9, y + 4, 4, 1, C.amber);
        break;
      }
      case "shelf": {
        const top = y - 10;
        r(c, x, top, w, h + 10, C.ink); r(c, x + 1, top + 1, w - 2, h + 8, C.woodD);
        const pal = { new: [C.paper, C.paperS, C.cream], old: [C.blue, C.red, C.navy, C.plum, C.green], green: [C.green, C.greenD, C.greenL], mixed: [C.blue, C.red, C.amber, C.teal, C.plum, C.navy] }[o.variant];
        for (let k = 0; k < 3; k++) {
          const sy = top + 2 + k * 8;
          r(c, x + 1, sy + 6, w - 2, 2, C.wood);
          if (o.variant === "new") {
            const n = st.newCount || 0;
            for (let b = 0; b < (k === 1 ? n : 0); b++) { r(c, x + 4 + b * 10, sy, 7, 6, C.paper); r(c, x + 4 + b * 10, sy, 7, 1, C.rust); }
          } else books(c, x + 2, sy, w - 4, 6, o.x * 31 + k * 7 + o.y, pal);
        }
        if (o.variant === "new" || o.variant === "old") { r(c, x + w / 2 - 6, y + 4, 12, 4, C.brass); r(c, x + w / 2 - 5, y + 5, 10, 2, C.paper); }
        if (st.glowShelf && o.variant === "new") sparkle(c, x + w - 4, top - 4, t);
        break;
      }
      case "ladder": {
        r(c, x + 3, y - 12, 2, 28, C.woodD); r(c, x + 11, y - 12, 2, 28, C.woodD);
        for (let k = -10; k < 16; k += 5) r(c, x + 3, y + k, 10, 2, C.woodL);
        break;
      }
      case "table": {
        r(c, x, y - 2, w, h + 2, C.ink); r(c, x + 1, y - 1, w - 2, 10, C.woodL); r(c, x + 1, y + 9, w - 2, 5, C.wood);
        r(c, x + 4, y + 1, 8, 6, C.paper); r(c, x + 5, y + 2, 6, 1, C.greyL); r(c, x + 5, y + 4, 5, 1, C.greyL);
        // banker's lamp
        r(c, x + w - 10, y - 5, 7, 3, C.greenD); r(c, x + w - 7, y - 2, 1, 4, C.brass); r(c, x + w - 9, y + 2, 5, 1, C.brass);
        break;
      }
      case "cat": {
        const s = catSprite(); c.drawImage(s, x + 1, y - 7);
        const zt = (t * 0.8) % 1;
        if (zt < 0.8) { c.globalAlpha = 1 - zt; r(c, x + 13 + zt * 4, y - 9 - zt * 8, 3, 1, C.white); r(c, x + 14 + zt * 4, y - 8 - zt * 8, 1, 1, C.white); r(c, x + 13 + zt * 4, y - 7 - zt * 8, 3, 1, C.white); c.globalAlpha = 1; }
        break;
      }
      case "chair": r(c, x + 4, y + 2, 8, 8, C.ink); r(c, x + 5, y + 3, 6, 6, C.wood); r(c, x + 5, y + 3, 6, 1, C.woodH); break;
      case "catalogue": {
        r(c, x + 1, y - 8, 14, 23, C.ink); r(c, x + 2, y - 7, 12, 21, C.wood);
        for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) { r(c, x + 3 + i * 6, y - 6 + j * 5, 5, 4, C.woodL); r(c, x + 5 + i * 6, y - 4 + j * 5, 1, 1, C.brass); }
        break;
      }
    }
  }

  function sparkle(c, x, y, t) {
    const b = Math.floor(t * 3) % 2;
    r(c, x, y + 1 - b, 1, 3 + b * 2, C.glow); r(c, x - 1 - b, y + 2, 3 + b * 2, 1, C.glow); r(c, x, y + 2, 1, 1, C.white);
  }
  function glowRect(c, x, y, w, h, t) {
    c.globalAlpha = 0.35 + 0.25 * Math.sin(t * 4); r(c, x - 1, y - 1, w + 2, 1, C.glow); r(c, x - 1, y + h, w + 2, 1, C.glow); c.globalAlpha = 1;
  }
  function bubble(c, x, y, t) {
    const by = y - 6 + Math.round(Math.sin(t * 5));
    r(c, x, by, 9, 9, C.ink); r(c, x + 1, by + 1, 7, 7, C.white); r(c, x + 3, by + 9, 2, 2, C.ink);
    r(c, x + 4, by + 2, 1, 3, C.rust); r(c, x + 4, by + 6, 1, 1, C.rust);
  }

  // ---------- light ----------
  function light(c, room, st) {
    c.save(); c.globalCompositeOperation = "lighter";
    const glow = (x, y, rad, a) => { const g = c.createRadialGradient(x, y, 1, x, y, rad); g.addColorStop(0, `rgba(255,200,110,${a})`); g.addColorStop(1, "rgba(255,200,110,0)"); c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2); };
    room.objects.forEach((o) => {
      if (o.kind === "lamp" && st.lampsOn > 0) glow(o.x * T + 8, o.y * T - 4, 34, 0.22);
      if (o.kind === "table" && st.lampsOn > 1) glow(o.x * T + (o.w || 1) * T - 7, o.y * T - 2, 26, 0.2);
      if (o.kind === "terminal" && st.lampsOn > 0) { c.fillStyle = "rgba(124,196,188,.10)"; c.fillRect(o.x * T - 6, o.y * T - 12, 28, 24); }
    });
    c.restore();
    room.map.forEach((row, j) => [...row].forEach((ch, i) => {
      if (ch === "w") { c.fillStyle = `rgba(255,240,200,${0.10 * st.daylight})`; c.beginPath(); c.moveTo(i * T + 2, (j + 1) * T); c.lineTo(i * T + 14, (j + 1) * T); c.lineTo(i * T + 20, (j + 4) * T); c.lineTo(i * T - 4, (j + 4) * T); c.fill(); }
    }));
  }

  // ---------- UI icons (16x16) ----------
  function icon(name) {
    if (cache["i" + name]) return cache["i" + name];
    const cv = canvas(16, 16), c = cv.getContext("2d");
    const paper = (x, y, w, h) => { r(c, x - 1, y - 1, w + 2, h + 2, C.ink); r(c, x, y, w, h, C.paper); };
    switch (name) {
      case "program": paper(3, 2, 10, 12); r(c, 4, 3, 8, 2, C.rust); r(c, 5, 6, 6, 1, C.greyL); r(c, 5, 8, 6, 1, C.greyL); r(c, 5, 10, 4, 1, C.greyL); r(c, 10, 11, 2, 2, C.red); break;
      case "letter": paper(2, 4, 12, 9); r(c, 2, 4, 6, 1, C.greyL); r(c, 8, 4, 6, 1, C.greyL); for (let i = 0; i < 5; i++) { r(c, 2 + i, 5 + i, 1, 1, C.greyL); r(c, 13 - i, 5 + i, 1, 1, C.greyL); } break;
      case "photo": r(c, 2, 3, 12, 11, C.ink); r(c, 3, 4, 10, 9, C.white); r(c, 4, 5, 8, 6, C.greyD); r(c, 5, 8, 2, 3, C.greyL); r(c, 8, 7, 2, 4, C.greyL); r(c, 9, 5, 2, 2, C.paperS); break;
      case "book": r(c, 3, 2, 10, 12, C.ink); r(c, 4, 3, 8, 10, C.greenD); r(c, 5, 5, 6, 2, C.brass); r(c, 4, 12, 8, 1, C.paper); break;
      case "notice": paper(3, 4, 10, 10); r(c, 7, 2, 2, 3, C.red); r(c, 5, 7, 6, 1, C.greyL); r(c, 5, 9, 6, 1, C.greyL); r(c, 5, 11, 4, 1, C.greyL); break;
      case "volume": r(c, 1, 3, 14, 11, C.ink); r(c, 2, 4, 6, 9, C.navy); r(c, 8, 4, 6, 9, C.navy); r(c, 7, 4, 2, 9, C.woodD); r(c, 3, 6, 4, 1, C.brass); r(c, 9, 6, 4, 1, C.brass); break;
      case "notebook": r(c, 3, 2, 10, 12, C.ink); r(c, 4, 3, 8, 10, C.rust); r(c, 4, 3, 2, 10, C.woodD); r(c, 7, 6, 4, 1, C.paper); r(c, 7, 8, 4, 1, C.paper); break;
      case "magnifier": r(c, 3, 2, 8, 8, C.ink); r(c, 4, 3, 6, 6, C.sky); r(c, 5, 4, 2, 2, C.white); r(c, 9, 9, 2, 2, C.ink); r(c, 10, 10, 3, 3, C.woodD); r(c, 12, 12, 2, 2, C.woodD); break;
      case "lock": r(c, 4, 7, 8, 7, C.ink); r(c, 5, 8, 6, 5, C.brass); r(c, 5, 3, 6, 5, C.ink); r(c, 6, 4, 4, 4, "rgba(0,0,0,0)"); c.clearRect(6, 4, 4, 3); r(c, 7, 10, 2, 2, C.ink); break;
      case "check": r(c, 3, 8, 2, 2, C.rust); r(c, 5, 10, 2, 2, C.rust); r(c, 7, 8, 2, 2, C.rust); r(c, 9, 6, 2, 2, C.rust); r(c, 11, 4, 2, 2, C.rust); break;
      case "sparkle": r(c, 7, 2, 2, 12, C.tealL); r(c, 2, 7, 12, 2, C.tealL); r(c, 5, 5, 6, 6, C.tealL); r(c, 7, 7, 2, 2, C.white); break;
      case "mk": r(c, 2, 2, 12, 10, C.ink); r(c, 3, 3, 10, 8, C.tealD); r(c, 4, 5, 6, 1, C.tealL); r(c, 4, 7, 4, 1, C.teal); r(c, 6, 12, 4, 2, C.greyD); r(c, 4, 13, 8, 1, C.greyL); break;
      case "cat": c.drawImage(catSprite(), 0, 3); break;
    }
    return (cache["i" + name] = cv);
  }

  window.Art = { T, C, person, tile, drawObject, light, bubble, sparkle, icon, hash };
})();
