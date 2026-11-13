'use strict';

// Storage

const STORAGE_KEY = 'notes-app.notes';

function isValidNote(note) {
  return (
    note !== null &&
    typeof note === 'object' &&
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.text === 'string' &&
    Number.isFinite(note.updatedAt)
  );
}

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];

    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      console.warn('Stored notes are not a list; starting empty.');
      return [];
    }

    const valid = data.filter(isValidNote);
    if (valid.length !== data.length) {
      console.warn(`Ignored ${data.length - valid.length} invalid stored note(s).`);
    }
    return valid;
  } catch (err) {
    console.warn('Could not read notes; starting empty.', err);
    return [];
  }
}

// Returns true if the notes were written to storage.
function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (err) {
    console.warn('Could not save notes.', err);
    return false;
  }
}

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

let notes = loadNotes();

// Rendering

const notesEl = document.getElementById('notes');

function createCard(note) {
  const card = document.createElement('li');
  card.className = 'note-card';

  const title = document.createElement('h2');
  title.className = 'note-card__title';
  if (note.title.trim() === '') {
    title.textContent = 'Untitled';
    title.classList.add('note-card__title--untitled');
  } else {
    title.textContent = note.title;
  }
  card.append(title);

  if (note.text.trim() !== '') {
    const text = document.createElement('p');
    text.className = 'note-card__text';
    text.textContent = note.text;
    card.append(text);
  }

  return card;
}

function render() {
  notesEl.replaceChildren();

  if (notes.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No notes yet. Create your first note with "New note".';
    notesEl.append(empty);
    return;
  }

  const grid = document.createElement('ul');
  grid.className = 'note-grid';
  const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  for (const note of sorted) {
    grid.append(createCard(note));
  }
  notesEl.append(grid);
}

// Editor overlay

const newNoteBtn = document.getElementById('new-note-btn');
const editor = document.getElementById('editor');
const editorCloseBtn = document.getElementById('editor-close');
const editorSaveBtn = document.getElementById('editor-save');
const editorStatus = document.getElementById('editor-status');
const titleInput = document.getElementById('note-title');
const textArea = document.getElementById('note-text');

const AUTOSAVE_DELAY = 500;

// Id of the note being edited; null until the first save creates it.
let currentId = null;
let saveTimer = null;
// True when the last write to storage failed, so an unchanged save retries it.
let writeFailed = false;

function setStatus(text) {
  editorStatus.textContent = text;
}

function cancelPendingSave() {
  clearTimeout(saveTimer);
  saveTimer = null;
}

function editorIsEmpty() {
  return titleInput.value.trim() === '' && textArea.value.trim() === '';
}

function clearEditor() {
  titleInput.value = '';
  textArea.value = '';
}

// The single save path for autosave, the Save button and closing.
// Creates the note on first save, then updates the same note by id.
function saveEditor() {
  cancelPendingSave();

  // Nothing to save. An emptied saved note keeps its last content in storage
  // and is removed when the editor closes.
  if (editorIsEmpty()) {
    setStatus('');
    return;
  }

  const title = titleInput.value;
  const text = textArea.value;
  const note = notes.find((n) => n.id === currentId);

  if (!note) {
    currentId = createId();
    notes.push({ id: currentId, title, text, updatedAt: Date.now() });
  } else if (note.title !== title || note.text !== text) {
    note.title = title;
    note.text = text;
    note.updatedAt = Date.now();
  } else if (!writeFailed) {
    // Unchanged and already stored: keep "last edited" as it is.
    setStatus('Saved');
    return;
  }

  writeFailed = !saveNotes();
  setStatus(writeFailed ? "Couldn't save" : 'Saved');
}

function scheduleSave() {
  setStatus('Saving…');
  cancelPendingSave();
  saveTimer = setTimeout(saveEditor, AUTOSAVE_DELAY);
}

function openEditor() {
  currentId = null;
  writeFailed = false;
  cancelPendingSave();
  setStatus('');
  clearEditor();
  editor.showModal();
  titleInput.focus();
}

function closeEditor() {
  editor.close();
}

// Fires for every way of closing: Close button, Esc, backdrop click.
editor.addEventListener('close', () => {
  saveEditor();

  // A saved note that was emptied is discarded silently.
  if (currentId !== null && editorIsEmpty()) {
    notes = notes.filter((n) => n.id !== currentId);
    saveNotes();
  }

  render();

  currentId = null;
  clearEditor();
  setStatus('');
  newNoteBtn.focus();
});

newNoteBtn.addEventListener('click', openEditor);
editorCloseBtn.addEventListener('click', closeEditor);
editorSaveBtn.addEventListener('click', saveEditor);

titleInput.addEventListener('input', scheduleSave);
textArea.addEventListener('input', scheduleSave);

// Don't lose the last keystrokes if the page is reloaded or closed mid-edit.
window.addEventListener('pagehide', () => {
  if (editor.open) saveEditor();
});

// Backdrop click: the panel fills the dialog box, so a click whose target is
// the dialog itself came from the backdrop. Require the press to start there
// too, so dragging a text selection out of the panel doesn't close it.
let pressStartedOnBackdrop = false;

editor.addEventListener('pointerdown', (e) => {
  pressStartedOnBackdrop = e.target === editor;
});

editor.addEventListener('click', (e) => {
  if (e.target === editor && pressStartedOnBackdrop) {
    closeEditor();
  }
  pressStartedOnBackdrop = false;
});

titleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault();
    textArea.focus();
  }
});

render();
