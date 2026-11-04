// The Archive — in-canvas UI kit. Coordinates are CSS pixels (the context is pre-scaled by devicePixelRatio).
(function () {
  "use strict";
  const C = Art.C;
  const BODY = "VT323", HEAD = "Pixelify Sans";
  const K = {
    page: "#efe2c6", panel: "#f6ecd6", paper: "#fbf4e2", ink: C.ink, soft: "#6e5d50", rust: C.rust, rustSoft: "#f0d9c4",
    teal: C.teal, tealBg: "#dcece8", hand: "#3b4f8a", photo: "#3b3631", photoInk: "#ece4d6", locked: "#e6dac2"
  };

  const U = {
    K, stack: [], hits: [], toasts: [], pointer: null, viewports: [],
    size: 22, line: 23,
    onToastTap: null
  };

  const clean = (s) => String(s).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, "").replace(/\s{2,}/g, " ").trim();
  U.clean = clean;
  const font = (size, head, bold) => `${bold ? "700 " : ""}${size}px "${head ? HEAD : BODY}", monospace`;
  U.font = font;

  // ---------- drawing primitives ----------
  function frame(c, x, y, w, h, fill, border, shadow) {
    x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
    const b = 3;
    if (shadow) { c.fillStyle = "rgba(43,29,22,.25)"; c.fillRect(x + b, y + h, w - b, b); c.fillRect(x + w, y + b, b, h - b); }
    c.fillStyle = fill; c.fillRect(x + b, y + b, w - 2 * b, h - 2 * b);
    c.fillStyle = border || K.ink;
    c.fillRect(x + b, y, w - 2 * b, b); c.fillRect(x + b, y + h - b, w - 2 * b, b);
    c.fillRect(x, y + b, b, h - 2 * b); c.fillRect(x + w - b, y + b, b, h - 2 * b);
    c.fillStyle = "rgba(255,255,255,.35)"; c.fillRect(x + b, y + b, w - 2 * b, 2);
  }
  U.frame = frame;

  function sprite(c, img, x, y, scale) {
    c.imageSmoothingEnabled = false;
    c.drawImage(img, Math.round(x), Math.round(y), img.width * scale, img.height * scale);
  }
  U.sprite = sprite;

  // ---------- text ----------
  const widthCache = new Map();
  function measure(c, f, s) { const k = f + "|" + s; let w = widthCache.get(k); if (w == null) { c.font = f; w = c.measureText(s).width; widthCache.set(k, w); } return w; }

  // Split text with [[clue|text]] markup into words carrying their clue id.
  function tokens(text) {
    const out = [];
    clean(text).split(/(\[\[[^\]]+\]\])/).forEach((part) => {
      const m = part.match(/^\[\[([^|\]]+)\|([^\]]+)\]\]$/);
      const clue = m ? m[1] : null, body = m ? m[2] : part;
      body.split(/(\n)/).forEach((seg) => {
        if (seg === "\n") out.push({ br: true });
        else seg.split(/ +/).forEach((w, i, arr) => { if (w) out.push({ w, clue, space: i > 0 || /^ /.test(seg) }); });
      });
    });
    return out;
  }
  function wrap(c, text, f, maxW) {
    const sp = measure(c, f, " "), lines = [[]]; let lw = 0;
    tokens(text).forEach((tk) => {
      if (tk.br) { lines.push([]); lw = 0; return; }
      const ww = measure(c, f, tk.w), cur = lines[lines.length - 1];
      const add = (cur.length ? sp : 0) + ww;
      if (cur.length && lw + add > maxW) { lines.push([Object.assign({ ww }, tk)]); lw = ww; }
      else { cur.push(Object.assign({ ww }, tk)); lw += add; }
    });
    return lines.map((ln) => ({ words: ln, w: ln.reduce((a, t, i) => a + t.ww + (i ? sp : 0), 0), sp }));
  }

  // Draw wrapped text. opts: {font, color, align, line, hot:{docId, magnify, found:fn, onTap:fn}, upper}
  function text(c, s, x, y, w, opts, draw) {
    opts = opts || {};
    const f = opts.font || font(U.size), lh = opts.line || U.line;
    const lines = wrap(c, opts.upper ? String(s).toUpperCase() : s, f, w);
    if (draw) {
      c.font = f; c.textBaseline = "top";
      lines.forEach((ln, i) => {
        let lx = opts.align === "center" ? x + (w - ln.w) / 2 : opts.align === "right" ? x + w - ln.w : x;
        const ly = y + i * lh;
        ln.words.forEach((tk, j) => {
          if (j) lx += ln.sp;
          if (tk.clue && opts.hot) {
            const found = opts.hot.found(tk.clue);
            if (opts.hot.magnify || found) {
              c.fillStyle = found ? "rgba(168,87,47,.20)" : "rgba(242,193,78,.45)";
              c.fillRect(lx - 1, ly + 1, tk.ww + 2 + (j < ln.words.length - 1 && ln.words[j + 1].clue === tk.clue ? ln.sp : 0), lh - 2);
            }
            if (found) { c.fillStyle = K.rust; c.fillRect(lx, ly + lh - 3, tk.ww + (j < ln.words.length - 1 && ln.words[j + 1].clue === tk.clue ? ln.sp : 0), 2); }
            U.hit(lx - 2, ly, tk.ww + 4, lh, () => opts.hot.onTap(tk.clue), "clue:" + tk.clue);
          }
          c.fillStyle = opts.color || K.ink;
          c.fillText(tk.w, lx, ly + 1);
          lx += tk.ww;
        });
      });
    }
    return lines.length * lh;
  }
  U.text = text;

  // ---------- hits ----------
  U.clip = null;
  U.hit = function (x, y, w, h, fn, label) {
    let r = { x, y, w, h };
    if (U.clip) {
      const k = U.clip, x1 = Math.max(x, k.x), y1 = Math.max(y, k.y), x2 = Math.min(x + w, k.x + k.w), y2 = Math.min(y + h, k.y + k.h);
      if (x2 <= x1 || y2 <= y1) return;
      r = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
    }
    U.hits.push(Object.assign(r, { fn, label: label ? clean(label) : "" }));
  };

  // ---------- document paper ----------
  const STYLE = {
    h: { head: true, size: 20, bold: true, align: "center" },
    center: { align: "center" }, right: { align: "right" },
    hand: { color: K.hand }, small: { size: 19, color: K.soft }, caps: { upper: true, color: K.soft, size: 19 },
    photo: { color: K.photoInk }, tag: { color: K.teal, size: 19 }, mk: { color: K.ink }
  };
  function blockStyle(s) {
    const o = { size: U.size, color: K.ink, align: "left" };
    String(s).split(" ").forEach((k) => Object.assign(o, STYLE[k] || {}));
    return o;
  }
  function paperBlocks(c, blocks, x, y, w, hot, draw) {
    let cy = y, i = 0;
    while (i < blocks.length) {
      const b = blocks[i], st = blockStyle(b.s), kinds = String(b.s).split(" ");
      const tOpts = { font: font(st.size, st.head, st.bold), color: st.color, align: st.align, upper: st.upper, line: Math.round(st.size * 1.05), hot };
      if (kinds.indexOf("photo") !== -1) {
        let j = i, inner = 10; const group = [];
        while (j < blocks.length && String(blocks[j].s).indexOf("photo") !== -1) group.push(blocks[j++]);
        let hgt = inner; group.forEach((g) => (hgt += text(c, g.t, 0, 0, w - 2 * inner - 8, tOpts, false) + 8));
        if (draw) { c.fillStyle = K.paper; c.fillRect(x, cy, w, hgt + 8); c.fillStyle = K.photo; c.fillRect(x + 4, cy + 4, w - 8, hgt); }
        let gy = cy + 4 + inner;
        group.forEach((g) => (gy += text(c, g.t, x + 4 + inner, gy, w - 2 * inner - 8, tOpts, draw) + 8));
        cy += hgt + 8 + 10; i = j; continue;
      }
      if (kinds.indexOf("tag") !== -1 || kinds.indexOf("mk") !== -1) {
        const pad = 8, hgt = text(c, b.t, 0, 0, w - 2 * pad, tOpts, false) + 2 * pad;
        if (draw) {
          if (kinds.indexOf("mk") !== -1) { c.fillStyle = K.tealBg; c.fillRect(x, cy, w, hgt); c.fillStyle = K.teal; c.fillRect(x, cy, 3, hgt); }
          else { c.strokeStyle = K.teal; c.setLineDash([4, 3]); c.lineWidth = 2; c.strokeRect(x + 1, cy + 1, w - 2, hgt - 2); c.setLineDash([]); }
        }
        text(c, b.t, x + pad, cy + pad, w - 2 * pad, tOpts, draw);
        cy += hgt + 10; i++; continue;
      }
      cy += text(c, b.t, x, cy, w, tOpts, draw) + 10; i++;
    }
    return cy - y - 10;
  }

  // ---------- elements ----------
  // Each returns its height; draws when draw === true.
  function el(c, e, x, y, w, draw) {
    switch (e.t) {
      case "space": return e.h || 10;
      case "text": return text(c, e.text, x, y, w, { font: font(e.size || U.size, e.head, e.bold), color: e.color || K.ink, align: e.align, upper: e.upper, line: e.line }, draw);
      case "head": return text(c, e.text, x, y, w, { font: font(e.size || 21, true, true), color: e.color || K.ink, align: e.align, line: (e.size || 21) + 4 }, draw);
      case "rule": if (draw) { c.fillStyle = K.ink; c.fillRect(x, y + 4, w, e.double ? 2 : 1); if (e.double) c.fillRect(x, y + 8, w, 2); } return 12;
      case "doc": {
        const pad = 14, inner = paperBlocks(c, e.blocks, 0, 0, w - 2 * pad, null, false), h = inner + 2 * pad;
        if (draw) {
          frame(c, x, y, w, h, e.dark ? K.photo : K.paper, e.border || K.ink, true);
          c.fillStyle = "rgba(120,90,50,.06)"; for (let ly = y + 6; ly < y + h - 4; ly += 23) c.fillRect(x + 4, ly, w - 8, 1);
          if (e.card) { c.fillStyle = K.rust; c.fillRect(x + 6, y + 6, w - 12, 2); c.fillRect(x + 6, y + h - 8, w - 12, 2); }
        }
        paperBlocks(c, e.blocks, x + pad, y + pad, w - 2 * pad, e.hot || null, draw);
        return h;
      }
      case "bubble": {
        const pad = 12, nameH = 20, iconW = 0;
        const th = text(c, e.text, 0, 0, w - 2 * pad, {}, false), ah = e.aside ? text(c, e.aside, 0, 0, w - 2 * pad, { color: K.teal }, false) + 8 : 0;
        const h = nameH + th + ah + 2 * pad;
        if (draw) {
          frame(c, x, y, w, h, K.tealBg, K.teal, false);
          sprite(c, Art.icon("sparkle"), x + w - 26, y + 8, 1);
          text(c, (e.name || "The Memory Keeper").toUpperCase(), x + pad, y + pad - 2, w - 2 * pad - 20, { font: font(15, true, true), color: K.teal, line: 18 }, true);
          text(c, e.text, x + pad, y + pad + nameH, w - 2 * pad, {}, true);
          if (e.aside) text(c, e.aside, x + pad, y + pad + nameH + th + 8, w - 2 * pad, { color: K.teal }, true);
        }
        return h;
      }
      case "line": {
        const stage = /^\(/.test(e.text);
        if (stage) return text(c, e.text, x + 4, y, w - 8, { color: K.soft }, draw) + 2;
        const pad = 10, th = text(c, e.text, 0, 0, w - 2 * pad, {}, false), h = th + 2 * pad;
        if (draw) { frame(c, x, y, w, h, K.paper, K.ink, false); text(c, e.text, x + pad, y + pad, w - 2 * pad, {}, true); }
        return h;
      }
      case "quote": {
        const pad = 10, ih = paperBlocks(c, e.blocks, 0, 0, w - 2 * pad - 4, null, false), h = ih + 2 * pad;
        if (draw) { c.fillStyle = "#efe3c9"; c.fillRect(x, y, w, h); c.fillStyle = K.soft; c.fillRect(x, y, 4, h); }
        paperBlocks(c, e.blocks, x + pad + 4, y + pad, w - 2 * pad - 4, null, draw);
        return h;
      }
      case "note": {
        const pad = 10, th = text(c, e.text, 0, 0, w - 2 * pad - 4, { color: K.hand }, false), h = th + 2 * pad;
        if (draw) { c.fillStyle = K.paper; c.fillRect(x, y, w, h); c.fillStyle = K.rust; c.fillRect(x, y, 4, h); text(c, e.text, x + pad + 4, y + pad, w - 2 * pad - 4, { color: K.hand }, true); }
        return h;
      }
      case "card": {
        const pad = 12, iconW = e.icon ? 40 : 0, tw = w - 2 * pad - iconW;
        const tagH = e.tag ? 20 : 0;
        const lh = text(c, e.label, 0, 0, tw, { font: font(U.size, false), line: U.line }, false);
        const nh = e.note ? text(c, e.note, 0, 0, tw, { font: font(19), color: K.soft, line: 20 }, false) + 4 : 0;
        const xh = e.extra ? 22 : 0;
        const h = Math.max(pad * 2 + tagH + lh + nh + xh, e.icon ? 56 : 0);
        if (draw) {
          const pressed = U.pointer && !U.pointer.moved && U.pointer.x >= x && U.pointer.x < x + w && U.pointer.y >= y && U.pointer.y < y + h && !e.disabled;
          frame(c, x, y + (pressed ? 2 : 0), w, h, e.disabled ? K.locked : e.selected ? K.rustSoft : K.paper, e.disabled ? K.soft : K.ink, !pressed);
          if (e.icon) sprite(c, e.icon, x + pad, y + (h - 32) / 2, 2);
          let cy = y + pad + (pressed ? 2 : 0);
          if (e.tag) { text(c, e.tag, x + pad + iconW, cy, tw, { font: font(16, true), color: e.tagColor || K.teal, line: 18 }, true); cy += tagH; }
          text(c, e.label, x + pad + iconW, cy, tw, { font: font(U.size), color: e.disabled ? K.soft : K.ink, line: U.line }, true); cy += lh;
          if (e.note) { text(c, e.note, x + pad + iconW, cy + 4, tw, { font: font(19), color: K.soft, line: 20 }, true); cy += nh; }
          if (e.extra) text(c, e.extra, x + pad + iconW, cy + 2, tw, { font: font(18), color: K.rust, line: 20 }, true);
          if (!e.disabled && e.onTap) U.hit(x, y, w, h, e.onTap, e.hitLabel || e.label);
        }
        return h;
      }
      case "btn": return button(c, e, x, y, w, draw);
      case "custom": if (draw) e.draw(c, x, y, w); return e.h;
      case "panel": {
        const pad = e.pad || 16, ih = column(c, e.els, 0, 0, w - 2 * pad, false), h = ih + 2 * pad;
        if (draw) frame(c, x, y, w, h, e.fill || K.paper, K.ink, true);
        column(c, e.els, x + pad, y + pad, w - 2 * pad, draw);
        return h;
      }
      case "row": {
        const gap = 10, n = e.items.length, bw = (w - gap * (n - 1)) / n;
        let h = 0; e.items.forEach((b, i) => (h = Math.max(h, button(c, b, x + i * (bw + gap), y, bw, draw))));
        return h;
      }
      case "toggle": {
        const h = 40;
        if (draw) {
          c.font = font(20, true); c.fillStyle = K.rust; c.textBaseline = "middle";
          c.fillText((e.open ? "− " : "+ ") + clean(e.label), x + 2, y + h / 2);
          U.hit(x, y, w, h, e.onTap, e.label);
        }
        return h;
      }
      case "bar": {
        const h = 26;
        if (draw) {
          c.font = font(19); c.fillStyle = K.ink; c.textBaseline = "middle";
          c.fillText(clean(e.label), x, y + h / 2); const lw = measure(c, font(19), clean(e.label)) + 10, vw = 50;
          frame(c, x + lw, y + 6, w - lw - vw, 14, K.paper, K.ink, false);
          c.fillStyle = K.teal; c.fillRect(x + lw + 3, y + 9, Math.max(0, (w - lw - vw - 6) * Math.min(1, e.value / e.max)), 8);
          c.fillStyle = K.ink; c.textAlign = "right"; c.fillText(e.value + " / " + e.max, x + w, y + h / 2); c.textAlign = "left";
        }
        return h;
      }
      case "stepper": {
        const n = e.steps.length, gap = 6, sw = (w - gap * (n - 1)) / n, h = 30;
        if (draw) e.steps.forEach((s, i) => {
          const sx = x + i * (sw + gap), state = i === e.current ? "now" : i < e.current ? "done" : "todo";
          c.fillStyle = state === "now" ? K.rust : state === "done" ? K.rustSoft : "#e8dcc2"; c.fillRect(sx, y, sw, h);
          c.font = font(16, true); c.fillStyle = state === "now" ? K.paper : state === "done" ? K.ink : K.soft; c.textAlign = "center"; c.textBaseline = "middle";
          c.fillText(s, sx + sw / 2, y + h / 2 + 1); c.textAlign = "left";
        });
        return h;
      }
      case "masthead": {
        let h = text(c, e.title, x, y, w, { font: font(28, true, true), align: "center", line: 32 }, draw);
        h += text(c, e.sub, x, y + h + 2, w, { font: font(17), color: K.soft, align: "center", upper: true, line: 20 }, draw) + 4;
        if (draw) { c.fillStyle = K.ink; c.fillRect(x, y + h + 2, w, 2); c.fillRect(x, y + h + 6, w, 2); }
        return h + 12;
      }
      case "story": {
        const pad = e.ad ? 10 : 0, ix = x + pad + (e.archive ? 10 : 0), iw = w - 2 * pad - (e.archive ? 10 : 0);
        let h = pad;
        const kick = e.kicker ? text(c, e.kicker, ix, y + h, iw, { font: font(16, true), color: K.rust, upper: true, line: 18 }, draw) + 2 : 0; h += kick;
        h += text(c, e.head, ix, y + h, iw, { font: font(e.small ? 17 : 20, true, true), line: e.small ? 20 : 24, align: e.ad ? "center" : "left" }, draw) + 4;
        h += text(c, e.body, ix, y + h, iw, { font: font(e.small ? 19 : 21), line: e.small ? 20 : 22, align: e.ad ? "center" : "left" }, draw) + pad;
        if (draw) {
          if (e.ad) { c.strokeStyle = K.soft; c.setLineDash([4, 3]); c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); c.setLineDash([]); }
          if (e.archive) { c.fillStyle = K.rust; c.fillRect(x, y, 3, h); }
          c.fillStyle = "#d6c5a8"; c.fillRect(x, y + h + 6, w, 1);
        }
        return h + 12;
      }
    }
    return 0;
  }
  U.el = el;

  function button(c, e, x, y, w, draw) {
    const h = e.h || 50;
    if (draw) {
      const pressed = U.pointer && !U.pointer.moved && U.pointer.x >= x && U.pointer.x < x + w && U.pointer.y >= y && U.pointer.y < y + h && !e.disabled;
      const fill = e.disabled ? K.locked : e.primary ? K.rust : e.on ? K.rustSoft : K.paper;
      frame(c, x, y + (pressed ? 2 : 0), w, h, fill, e.disabled ? K.soft : K.ink, !pressed);
      let tx = x + w / 2;
      if (e.icon) { sprite(c, e.icon, x + 12, y + (h - 32) / 2 + (pressed ? 2 : 0), 2); tx += 16; }
      c.font = font(19, true, true); c.fillStyle = e.disabled ? K.soft : e.primary ? K.paper : K.ink;
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(clean(e.label), tx, y + h / 2 + 1 + (pressed ? 2 : 0)); c.textAlign = "left";
      if (!e.disabled && e.onTap) U.hit(x, y, w, h, e.onTap, e.label);
    }
    return h;
  }

  function column(c, els, x, y, w, draw) {
    let h = 0;
    els.forEach((e, i) => { if (!e) return; h += el(c, e, x, y + h, w, draw); h += e.gap != null ? e.gap : 10; });
    return Math.max(0, h - 10);
  }
  U.column = column;

  // ---------- screens ----------
  U.open = (s) => { s.scroll = s.scroll || 0; U.stack.push(s); };
  U.replace = (s) => { U.stack.pop(); U.open(s); };
  U.close = () => { const s = U.stack.pop(); if (s && s.onClose) s.onClose(); };
  U.clear = () => { U.stack = []; };
  U.top = () => U.stack[U.stack.length - 1];

  function scrollArea(c, s, x, y, w, h, els, padX) {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    U.clip = { x, y, w, h };
    const contentH = column(c, els, x + padX, y - s.scroll + 12, w - 2 * padX, true) + 24;
    U.clip = null; c.restore();
    s.maxScroll = Math.max(0, contentH - h);
    s.scroll = Math.max(0, Math.min(s.scroll, s.maxScroll));
    U.viewports.push({ x, y, w, h, s });
    if (s.maxScroll > 0) {
      const th = Math.max(30, h * h / contentH), ty = y + (h - th) * (s.scroll / s.maxScroll);
      c.fillStyle = "rgba(43,29,22,.15)"; c.fillRect(x + w - 6, y + 2, 4, h - 4);
      c.fillStyle = K.rust; c.fillRect(x + w - 6, ty, 4, th);
      if (s.scroll < s.maxScroll - 2) { const g = c.createLinearGradient(0, y + h - 24, 0, y + h); g.addColorStop(0, "rgba(246,236,214,0)"); g.addColorStop(1, "rgba(246,236,214,.95)"); c.fillStyle = g; c.fillRect(x, y + h - 24, w - 8, 24); }
    }
  }

  function closeBtn(c, x, y, s) {
    frame(c, x, y, 44, 44, K.paper, K.ink, false);
    c.fillStyle = K.ink; for (let i = 0; i < 14; i++) { c.fillRect(x + 15 + i, y + 15 + i, 3, 3); c.fillRect(x + 28 - i, y + 15 + i, 3, 3); }
    U.hit(x, y, 44, 44, () => U.close(), "close");
  }

  U.draw = function (c, W, H, t) {
    U.viewports = [];
    const s = U.top(); if (!s) return;
    if (s.kind !== "full") { c.fillStyle = s.kind === "dialog" ? "rgba(26,18,14,.25)" : "rgba(26,18,14,.55)"; c.fillRect(0, 0, W, H); }
    const els = s.build();
    if (s.kind === "full") {
      c.fillStyle = s.bg || "#2a201a"; c.fillRect(0, 0, W, H);
      const cw = Math.min(W - 24, 470), cx = (W - cw) / 2;
      scrollArea(c, s, cx - 8, 0, cw + 16, H, els, 8);
    } else if (s.kind === "dialog") {
      const pw = Math.min(W - 16, 480), px = (W - pw) / 2, headH = 64;
      const contentH = column(c, els, 0, 0, pw - 36, false) + 30;
      const ph = Math.min(headH + contentH, Math.round(H * 0.68)), py = H - ph - 8;
      frame(c, px, py, pw, ph, K.panel, K.ink, true);
      if (s.portrait) { frame(c, px + 12, py - 26, 76, 76, K.paper, K.ink, false); sprite(c, s.portrait, px + 18, py - 23, 4); }
      c.font = font(22, true, true); c.fillStyle = K.ink; c.textBaseline = "middle"; c.fillText(clean(s.title), px + (s.portrait ? 100 : 16), py + 26);
      scrollArea(c, s, px + 6, py + headH - 10, pw - 12, ph - headH + 4, els, 12);
    } else {
      const m = W < 420 ? 6 : 12, pw = Math.min(W - 2 * m, 520), px = (W - pw) / 2, py = m, ph = H - 2 * m;
      frame(c, px, py, pw, ph, K.panel, K.ink, true);
      let hy = py + 12, hx = px + 14;
      if (s.icon) { sprite(c, s.icon, hx, hy + 2, 2); hx += 42; }
      const tw = px + pw - 60 - hx;
      let th = text(c, s.title, hx, hy, tw, { font: font(22, true, true), line: 25 }, true);
      if (s.sub) th += text(c, s.sub, hx, hy + th + 2, tw, { font: font(18), color: K.soft, line: 19 }, true) + 2;
      const headH = Math.max(th + 24, 60);
      if (s.closable !== false) closeBtn(c, px + pw - 54, py + 10, s);
      const foot = s.footer ? s.footer() : null, footH = foot ? 72 : 0;
      c.fillStyle = "#d6c5a8"; c.fillRect(px + 8, py + headH - 2, pw - 16, 2);
      scrollArea(c, s, px + 6, py + headH, pw - 12, ph - headH - footH - 6, els, 10);
      if (foot) { c.fillStyle = "#d6c5a8"; c.fillRect(px + 8, py + ph - footH - 4, pw - 16, 2); column(c, [foot], px + 16, py + ph - footH + 8, pw - 32, true); }
    }
  };

  // ---------- toasts ----------
  U.toast = function (msg) { U.toasts.push({ msg: clean(msg), t: 0 }); if (U.toasts.length > 2) U.toasts.shift(); };
  // In panels, show only the newest toast, at the bottom (above footer buttons) so headers stay visible.
  U.drawToasts = function (c, W, top, dt, bottomY) {
    let y = top;
    const list = bottomY ? U.toasts.slice(-1) : U.toasts;
    if (bottomY) U.toasts.slice(0, -1).forEach((ts) => (ts.t = Math.max(ts.t, 3.4)));
    list.forEach((ts) => {
      ts.t += dt;
      const a = ts.t < 0.2 ? ts.t / 0.2 : ts.t > 3.4 ? Math.max(0, 1 - (ts.t - 3.4) / 0.4) : 1;
      const w = Math.min(W - 24, 460), x = (W - w) / 2, pad = 10;
      const h = text(c, ts.msg, 0, 0, w - 2 * pad, { font: font(20), line: 21 }, false) + 2 * pad;
      if (bottomY) y = bottomY - h;
      c.globalAlpha = a;
      frame(c, x, y, w, h, K.ink, "#120c09", true);
      text(c, ts.msg, x + pad, y + pad, w - 2 * pad, { font: font(20), color: K.paper, line: 21 }, true);
      c.globalAlpha = 1;
      y += h + 6;
    });
    U.toasts = U.toasts.filter((ts) => ts.t < 3.8);
  };

  // ---------- input ----------
  U.down = function (x, y) {
    const vp = U.viewports.slice().reverse().find((v) => x >= v.x && x < v.x + v.w && y >= v.y && y < v.y + v.h);
    U.pointer = { x, y, x0: x, y0: y, moved: false, vp, start: vp ? vp.s.scroll : 0 };
  };
  U.move = function (x, y) {
    const p = U.pointer; if (!p) return;
    p.x = x; p.y = y;
    if (Math.hypot(x - p.x0, y - p.y0) > 8) p.moved = true;
    if (p.moved && p.vp) p.vp.s.scroll = Math.max(0, Math.min(p.vp.s.maxScroll || 0, p.start - (y - p.y0)));
  };
  U.up = function (x, y) {
    const p = U.pointer; U.pointer = null;
    if (!p || p.moved) return;
    U.tapAt(x, y);
  };
  U.tapAt = function (x, y) {
    for (let i = U.hits.length - 1; i >= 0; i--) { const h = U.hits[i]; if (x >= h.x && x < h.x + h.w && y >= h.y && y < h.y + h.h) { h.fn(); return true; } }
    return false;
  };
  U.wheel = function (x, y, dy) {
    const vp = U.viewports.slice().reverse().find((v) => x >= v.x && x < v.x + v.w && y >= v.y && y < v.y + v.h) || U.viewports[U.viewports.length - 1];
    if (vp) vp.s.scroll = Math.max(0, Math.min(vp.s.maxScroll || 0, vp.s.scroll + dy));
  };

  window.UI = U;
})();
