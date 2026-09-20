# BHUMISETU — Local Setup

This is a single self-contained HTML file (`index.html`). No build step, no dependencies to install — it just needs to be served by any local web server (opening it directly with `file://` also mostly works, but a local server avoids browser restrictions).

## Option 1 — Python (already on most machines)
```bash
cd path/to/this/folder
python3 -m http.server 3000
```
Then open **http://localhost:3000**

## Option 2 — Node (no install needed, uses npx)
```bash
cd path/to/this/folder
npx serve -l 3000
```
Then open **http://localhost:3000**

## Option 3 — VS Code
Right-click `index.html` → "Open with Live Server" (if you have the Live Server extension).

## Notes
- All data in the app is demo/mock data, generated in-browser — there is no backend.
- Saved research, submissions, and collaboration requests are stored in your browser's `localStorage`, so they'll persist across reloads on the same browser/device but won't sync anywhere else.
- To merge this into your existing BHUMISETU codebase, treat `index.html` as reference markup/CSS/JS to port into your components — the whole app (routing, state, mock data) lives in the one file for easy portability.

