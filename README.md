# The Archive

A cozy, mobile-friendly archival simulator set in Hollow Creek. As the town's archivist, you decide which documents to keep, how to describe them, and whether the town reads the original or the friendly summary written by Lumen's AI, **The Memory Keeper**.

See [DESIGN.md](DESIGN.md) for the full MVP design.

## Play

No build step. Serve the folder and open it in a (phone) browser:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000. Add `?debug=1` to see the hidden Truth / Compliance / Town Memory variables.

Progress saves automatically to `localStorage`.

## Status

- ✅ Day 1 prototype: Front Desk and Stacks, 3 documents, 2 visitors, notebook discrepancies, and a generated Day 2 newsletter
- ⏳ Day 2 (Basement Records), Day 3 (Server Room), endings

## Structure

```
index.html      page shell
css/style.css   cozy paper styling, mobile-first, light/dark
js/data.js      all story content (documents, descriptions, ledger lines, discrepancies)
js/game.js      engine: scenes, rooms, document workflow, dialogs, save/load
```
