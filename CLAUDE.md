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

- **Grid:** notes shown as a card grid, sorted by last edited first. "Last edited" updates only when title or text actually changes. The grid re-sorts when the editor closes, not while typing.
- **Editor:** clicking a card or "New note" opens the editor as an overlay.
  - Desktop: Esc or clicking outside closes it.
  - At 375 px: overlay is full screen with a clear Close button.
- **Saving:** autosave while typing (short debounce). The Save button saves immediately and keeps the editor open. One small status text ("Saving…" / "Saved") shows for both.
- **Empty notes:** a note with empty title and empty text (whitespace counts as empty) is not created, or is discarded. A saved note whose title and text are both emptied is discarded silently when the editor closes. While the editor is open, autosave does not write an emptied note, so storage keeps its last content; the note is removed when the editor closes.
- **Untitled:** a note with text but no title shows as "Untitled".
- **Title field:** Enter moves focus to the text field.
- **Delete:** only in the editor overlay. It asks for confirmation inside the app (never the browser's `confirm()`); discarding an emptied note needs no confirmation.
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
