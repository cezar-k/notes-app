'use strict';

// In-memory placeholder; storage comes in a later feature.
const notes = [];

const notesEl = document.getElementById('notes');

function render() {
  notesEl.replaceChildren();

  if (notes.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No notes yet. Click "New note" to create one.';
    notesEl.append(empty);
  }
}

render();
