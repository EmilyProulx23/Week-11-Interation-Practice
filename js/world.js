// The Archive — top-down world: rooms, walking, pathfinding, NPCs, drawing.
(function () {
  "use strict";
  const T = Art.T, COLS = 10, ROWS = 14;
  const SPEED = 64; // px per second
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  // How far each kind of object visually extends above its footprint (for tapping).
  const OVERHANG = { rack: 12, cabinet: 10, console: 12, aircon: 6, serverExit: 4, stairs: 3, box: 4, metalShelf: 10, dehumidifier: 5, bucket: 7, shelf: 10, catalogue: 8, terminal: 8, lamp: 8, plant: 4, coatrack: 6, ladder: 12, cat: 7, door: 3, lockedDoor: 3, serverDoor: 3, inbox: 6, bell: 3 };
  const ZOFF = { bulb: 20, puddle: -1, inbox: 0.2, terminal: 0.2, bell: 0.2, cat: 0.2, stool: -1, chair: -1 };

  const W = {
    COLS, ROWS, room: null, roomId: null,
    player: { x: 0, y: 0, dir: "down", path: [], frame: 0, anim: 0, target: null },
    npcs: [],
    fade: 0, fading: null,
    onInteract: () => {}, onRoomChange: () => {},
    bg: {}
  };

  W.load = function (roomId, tx, ty, dir) {
    W.roomId = roomId; W.room = Logic.D.rooms[roomId];
    W.player.x = tx * T; W.player.y = ty * T; W.player.dir = dir || "down"; W.player.path = []; W.player.target = null;
    W.npcs = W.npcs.filter((n) => n.room === roomId);
    if (!W.bg[roomId]) W.bg[roomId] = bakeRoom(W.room);
  };

  function bakeRoom(room) {
    const c = document.createElement("canvas"); c.width = COLS * T; c.height = ROWS * T;
    const x = c.getContext("2d");
    room.map.forEach((row, j) => [...row].forEach((ch, i) => Art.tile(x, ch, i, j, room.map)));
    return c;
  }

  const tileOf = (px) => Math.round(px / T);
  W.playerTile = () => ({ x: tileOf(W.player.x), y: tileOf(W.player.y) });

  function footprint(o) { const out = []; for (let i = 0; i < (o.w || 1); i++) for (let j = 0; j < (o.h || 1); j++) out.push([o.x + i, o.y + j]); return out; }

  W.walkable = function (x, y, ignoreNpcs) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
    const ch = W.room.map[y][x];
    if (".,cs".indexOf(ch) === -1) return false;
    for (const o of W.room.objects) if (o.solid !== false && footprint(o).some(([a, b]) => a === x && b === y)) return false;
    if (!ignoreNpcs) for (const n of W.npcs) if (tileOf(n.x) === x && tileOf(n.y) === y) return false;
    return true;
  };

  // Breadth-first search (uniform cost grid) to the nearest of several goal tiles.
  W.findPath = function (from, goals) {
    const key = (x, y) => y * COLS + x, goalSet = new Set(goals.map(([x, y]) => key(x, y)));
    const prev = new Map([[key(from.x, from.y), null]]), q = [[from.x, from.y]];
    while (q.length) {
      const [x, y] = q.shift();
      if (goalSet.has(key(x, y))) {
        const path = []; let k = key(x, y);
        while (k !== key(from.x, from.y)) { path.unshift([k % COLS, Math.floor(k / COLS)]); k = prev.get(k); }
        return path;
      }
      for (const d of Object.values(DIRS)) {
        const nx = x + d[0], ny = y + d[1], nk = key(nx, ny);
        if (!prev.has(nk) && W.walkable(nx, ny)) { prev.set(nk, key(x, y)); q.push([nx, ny]); }
      }
    }
    return null;
  };

  function spotsFor(o) {
    if (o.spots) return o.spots;
    const out = [];
    footprint(o).forEach(([x, y]) => Object.values(DIRS).forEach(([dx, dy]) => out.push([x + dx, y + dy])));
    return out.filter(([x, y]) => W.walkable(x, y));
  }
  function faceToward(o) {
    const p = W.playerTile(), cx = o.x + ((o.w || 1) - 1) / 2, cy = o.y + ((o.h || 1) - 1) / 2;
    const dx = cx - p.x, dy = cy - p.y;
    W.player.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
  }

  W.goTo = function (target) { // target: object, npc, or [x, y]
    const from = W.playerTile();
    let goals, onArrive = null;
    if (Array.isArray(target)) goals = [target];
    else if (target.npc) {
      goals = (W.room.visitorTalkSpots || []).concat(Object.values(DIRS).map(([dx, dy]) => [tileOf(target.x) + dx, tileOf(target.y) + dy]));
      onArrive = () => { faceToward({ x: tileOf(target.x), y: tileOf(target.y) }); W.onInteract({ npc: target.name }); };
    } else {
      goals = spotsFor(target);
      onArrive = () => { faceToward(target); W.onInteract(target); };
    }
    const already = goals.some(([x, y]) => x === from.x && y === from.y);
    if (already) { W.player.path = []; if (onArrive) onArrive(); return true; }
    const path = W.findPath(from, goals);
    if (!path) return false;
    W.player.path = path; W.player.target = onArrive;
    return true;
  };

  W.objectAtPx = function (px, py) {
    const hits = [];
    W.npcs.forEach((n) => { if (px >= n.x && px < n.x + T && py >= n.y - 4 && py < n.y + T) hits.push({ npc: true, name: n.name, x: n.x, y: n.y, z: n.y + 100 }); });
    W.room.objects.forEach((o) => {
      if (!o.act) return;
      const x = o.x * T, y = o.y * T - (OVERHANG[o.kind] || 0), w = (o.w || 1) * T, h = (o.h || 1) * T + (OVERHANG[o.kind] || 0);
      if (px >= x && px < x + w && py >= y && py < y + h) hits.push(Object.assign({ z: o.y + (ZOFF[o.kind] || 0) }, o));
    });
    hits.sort((a, b) => b.z - a.z);
    return hits[0] || null;
  };

  W.tap = function (px, py) {
    if (W.fading) return;
    const hit = W.objectAtPx(px, py);
    if (hit) { if (hit.npc) W.goTo(W.npcs.find((n) => n.name === hit.name)); else W.goTo(W.room.objects.find((o) => o.id === hit.id)); return; }
    const tx = Math.floor(px / T), ty = Math.floor(py / T);
    if (W.walkable(tx, ty)) W.goTo([tx, ty]);
  };

  W.keyStep = function (dir) {
    if (W.fading || W.player.path.length) return;
    W.player.dir = dir;
    const p = W.playerTile(), [dx, dy] = DIRS[dir];
    if (W.walkable(p.x + dx, p.y + dy)) W.player.path = [[p.x + dx, p.y + dy]];
  };
  W.keyInteract = function () {
    const p = W.playerTile(), [dx, dy] = DIRS[W.player.dir], fx = p.x + dx, fy = p.y + dy;
    const npc = W.npcs.find((n) => tileOf(n.x) === fx && tileOf(n.y) === fy) ||
                (W.room.visitorTalkSpots && W.room.visitorTalkSpots.some(([a, b]) => a === p.x && b === p.y) && W.npcs[0]);
    if (npc) return W.onInteract({ npc: npc.name });
    const o = W.room.objects.find((ob) => ob.act && footprint(ob).some(([a, b]) => a === fx && b === fy));
    if (o) W.onInteract(o);
  };

  // ---------- NPCs ----------
  W.spawnNpc = function (name, onArrive) {
    const r = W.room, e = r.entry, s = r.visitorSpot;
    const n = { npc: true, name, room: W.roomId, x: e.x * T, y: e.y * T, dir: "up", path: [], frame: 0, anim: 0, bubble: false, onArrive };
    W.npcs.push(n);
    // NPCs walk through the doorway even though it isn't normally walkable.
    const path = [[e.x, e.y - 1]];
    let cur = { x: e.x, y: e.y - 1 };
    const rest = W.findPathFor(cur, [[s.x, s.y]], n) || [];
    n.path = path.concat(rest);
    return n;
  };
  W.placeNpc = function (name) {
    const s = W.room.visitorSpot;
    const n = { npc: true, name, room: W.roomId, x: s.x * T, y: s.y * T, dir: "up", path: [], frame: 0, anim: 0, bubble: true };
    W.npcs.push(n); return n;
  };
  W.npcLeave = function (name) {
    const n = W.npcs.find((m) => m.name === name); if (!n) return;
    const e = W.room.entry;
    n.bubble = false;
    n.path = (W.findPathFor({ x: tileOf(n.x), y: tileOf(n.y) }, [[e.x, e.y - 1]], n) || []).concat([[e.x, e.y]]);
    n.onArrive = () => { W.npcs = W.npcs.filter((m) => m !== n); };
  };
  W.findPathFor = function (from, goals, npc) {
    const saved = W.npcs; W.npcs = W.npcs.filter((m) => m !== npc);
    const p = W.findPath(from, goals);
    W.npcs = saved; return p;
  };

  // ---------- update ----------
  function stepMover(m, dt) {
    if (!m.path.length) { m.frame = 0; return false; }
    const [tx, ty] = m.path[0], gx = tx * T, gy = ty * T;
    const dx = gx - m.x, dy = gy - m.y, dist = Math.hypot(dx, dy), step = SPEED * dt;
    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) m.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
    if (dist <= step) { m.x = gx; m.y = gy; m.path.shift(); } else { m.x += (dx / dist) * step; m.y += (dy / dist) * step; }
    m.anim += dt; m.frame = 1 + (Math.floor(m.anim / 0.15) % 2);
    if (!m.path.length) { m.frame = 0; return true; }
    return false;
  }

  W.update = function (dt) {
    if (W.fading) {
      W.fade += dt * 5 * W.fading.dir;
      if (W.fading.dir > 0 && W.fade >= 1) { W.fade = 1; W.fading.mid(); W.fading.dir = -1; }
      else if (W.fading.dir < 0 && W.fade <= 0) { W.fade = 0; W.fading = null; }
      return;
    }
    const p = W.player;
    // If the next tile became blocked (an NPC walked into it), stop.
    if (p.path.length && Math.abs(p.x - Math.round(p.x / T) * T) < 0.01 && Math.abs(p.y - Math.round(p.y / T) * T) < 0.01) {
      const [nx, ny] = p.path[0];
      if (!W.walkable(nx, ny)) { p.path = []; p.target = null; }
    }
    if (stepMover(p, dt) && p.target) { const fn = p.target; p.target = null; fn(); }
    W.npcs.slice().forEach((n) => { if (stepMover(n, dt)) { if (n.path.length === 0) n.dir = "up"; if (n.onArrive) { const fn = n.onArrive; n.onArrive = null; fn(n); } } });
  };

  W.changeRoom = function (roomId, tx, ty, dir) {
    W.fading = { dir: 1, mid: () => { W.load(roomId, tx, ty, dir); W.onRoomChange(roomId); } };
  };

  // ---------- render (into the native-resolution world canvas) ----------
  W.render = function (c, t, st) {
    c.drawImage(W.bg[W.roomId], 0, 0);
    const items = [];
    W.room.objects.forEach((o, i) => items.push({ z: (o.y + (o.h || 1)) * T + (ZOFF[o.kind] || 0) * T + i * 0.001, draw: () => Art.drawObject(c, o, st) }));
    const drawMover = (m, name) => {
      const spr = Art.person(name, m.dir, m.frame);
      c.drawImage(spr, Math.round(m.x) - 1, Math.round(m.y) - 4);
      if (m.bubble) Art.bubble(c, Math.round(m.x) + 4, Math.round(m.y) - 10, t);
    };
    items.push({ z: W.player.y + T + 0.5, draw: () => drawMover(W.player, "archivist") });
    W.npcs.forEach((n) => items.push({ z: n.y + T + 0.5, draw: () => drawMover(n, n.name) }));
    items.sort((a, b) => a.z - b.z).forEach((it) => it.draw());
    if (W.room.dim) { c.fillStyle = `rgba(20,14,24,${W.room.dim})`; c.fillRect(0, 0, COLS * T, ROWS * T); }
    Art.light(c, W.room, st);
    if (st.dark) { c.fillStyle = `rgba(20,12,30,${st.dark})`; c.fillRect(0, 0, COLS * T, ROWS * T); }
    if (W.fade > 0) { c.fillStyle = `rgba(26,18,14,${W.fade})`; c.fillRect(0, 0, COLS * T, ROWS * T); }
  };

  W.objRect = function (id) {
    const o = W.room.objects.find((ob) => ob.id === id);
    if (o) return { x: o.x * T, y: o.y * T, w: (o.w || 1) * T, h: (o.h || 1) * T };
    const n = W.npcs.find((m) => m.name === id);
    return n ? { x: n.x, y: n.y, w: T, h: T } : null;
  };

  window.World = W;
})();
