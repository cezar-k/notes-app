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

function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.warn('Could not save notes.', err);
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
const titleInput = document.getElementById('note-title');
const textArea = document.getElementById('note-text');

function clearEditor() {
  titleInput.value = '';
  textArea.value = '';
}

function openEditor() {
  clearEditor();
  editor.showModal();
  titleInput.focus();
}

function closeEditor() {
  editor.close();
}

// Adds the editor content as a new note, unless title and text are both empty.
function addNoteFromEditor() {
  const title = titleInput.value;
  const text = textArea.value;
  if (title.trim() === '' && text.trim() === '') return;

  notes.push({ id: createId(), title, text, updatedAt: Date.now() });
  saveNotes();
  render();
}

// Fires for every way of closing: Close button, Esc, backdrop click.
// Save first, then clear the fields.
editor.addEventListener('close', () => {
  addNoteFromEditor();
  clearEditor();
  newNoteBtn.focus();
});

newNoteBtn.addEventListener('click', openEditor);
editorCloseBtn.addEventListener('click', closeEditor);

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
