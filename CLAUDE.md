# Notes App

A minimal notes app (like Google Keep): create, edit, search and delete notes in the browser.

## Stack

- Plain HTML, CSS, JavaScript: `index.html`, `style.css`, `app.js`
- Data stored in `localStorage`
- No framework, no build step, no backend
- Hosted on GitHub Pages

## Run

Open `index.html` in a browser.

## Product decisions

- **Grid:** notes shown as a card grid, sorted by last edited first.
- **Editor:** clicking a card or "New note" opens the editor as an overlay.
  - Desktop: Esc or clicking outside closes it.
  - At 375 px: overlay is full screen with a clear Close button.
- **Saving:** autosave while typing (short debounce), plus a Save button that saves immediately and briefly shows "Saved".
- **Empty notes:** a note with empty title and empty text (whitespace counts as empty) is not created, or is discarded.
- **Untitled:** a note with text but no title shows as "Untitled".
- **Title field:** Enter moves focus to the text field.
- **Delete:** asks for confirmation inside the app — never use the browser's `confirm()`.
- **Empty state:** show a readable message when there are no notes.
- **Layout:** must work at 1280 px and 375 px with nothing overflowing; buttons look like buttons; good contrast.

### Stretch / later

- Live search over title and text (stretch).
- Maybe later: note counter, saved light/dark theme toggle.

## Rules

- Don't add libraries without asking first.
- Keep everything in the three files (`index.html`, `style.css`, `app.js`).
- Never store passwords, keys, tokens or personal data in `localStorage`.
- Ask before making assumptions.
- One feature per branch.
- Never commit directly to `main` after the baseline commit.
