'use strict';

// In-memory placeholder; storage comes in a later feature.
const notes = [];

const notesEl = document.getElementById('notes');

function render() {
  notesEl.replaceChildren();

  if (notes.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No notes yet. Create your first note with "New note".';
    notesEl.append(empty);
  }
}

// Editor overlay (no saving yet: closing discards the input)

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

// Fires for every way of closing: Close button, Esc, backdrop click.
editor.addEventListener('close', () => {
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
