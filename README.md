# The Archive

A cozy, mobile-friendly top-down pixel game set in Hollow Creek. As the town's archivist, you decide which documents to keep, how to describe them, and whether the town reads the original or the friendly summary written by Lumen's AI, **The Memory Keeper**.

See [DESIGN.md](DESIGN.md) for the full MVP design.

## Play

No build step. Serve the folder and open it in a (phone) browser:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000. Tap to walk and tap things to use them (arrow keys/WASD + Enter on desktop). Add `?debug=1` to see the hidden Truth / Compliance / Town Memory variables.

Progress saves automatically to `localStorage`. There is no time limit.

## Writing

All story text lives in `js/data.js`. To review it as a readable script, regenerate it with the command below, which writes [docs/script.md](docs/script.md):

```bash
node tools/export-script.js
```

## Publishing (GitHub Pages)

In **Settings → Pages**, under **Build and deployment**, set **Source** to *Deploy from a branch*, then pick the branch and `/ (root)`. The game uses relative paths, so it works under the Pages subpath.

## Status

- ✅ Day 1: walkable Front Desk and Stacks, 3 documents, June and Theo, notebook discrepancies, generated Day 2 newsletter
- ✅ Day 2: basement key, Basement Records with "Pending Review" boxes, 3 documents, Ruth and Priya, generated Day 3 newsletter
- ✅ Day 3: the Server Room, original minutes and revision log, Theo's poster, the exhibit plaque, Friday Ledger and four endings

## Structure

```
index.html      canvas page shell
css/style.css   full-screen canvas + bundled pixel fonts
assets/fonts/   VT323 and Pixelify Sans (SIL Open Font License)
js/data.js      all story content and room layouts
js/art.js       pixel art drawn in code (sprites, tiles, icons)
js/logic.js     rules and state (no drawing)
js/world.js     rooms, tap-to-walk pathfinding, visitors
js/ui.js        in-canvas panels, text, scrolling
js/main.js      scenes, screens, input, game loop
tools/          export-script.js (writing → docs/script.md)
```
