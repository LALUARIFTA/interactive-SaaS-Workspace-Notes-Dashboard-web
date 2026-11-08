import { $, esc, showToast } from '../core/ui.js';
import { state, saveState } from '../core/store.js';
import { renderAnalytics } from './analytics.js';

export function renderStudioNotes() {
  const list = $('studio-notes-list');
  if (!list) return;
  list.innerHTML = state.studioNotes.map((n) => `
    <div onclick="selectStudioNote(${n.id})" class="bg-white dark:bg-[#1b1e30] rounded-[22px] p-4 shadow-card cursor-pointer border transition-all relative group ${
      n.id === state.activeNoteId ? 'border-[#6558f5]' : 'border-transparent hover:border-[#6558f5]'
    }">
      <div class="flex items-center justify-between text-[10px] font-bold">
        <span class="text-[#6558f5] bg-[#efeffb] dark:bg-slate-800 px-2.5 py-0.5 rounded-full">${esc(n.category)}</span>
        <span class="text-slate-400">${esc(n.updated)}</span>
      </div>
      <h4 class="text-xs font-bold text-[#181b2c] dark:text-white mt-2 pr-6">${esc(n.title)}</h4>
      <p class="text-[11px] text-slate-400 mt-1 line-clamp-2">${esc(n.body)}</p>
      <button onclick="event.stopPropagation(); deleteStudioNote(${n.id})" title="Delete note" class="absolute top-3 right-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><i class="ph ph-trash text-xs"></i></button>
    </div>`).join('') || `<p class="text-xs text-slate-400 font-medium text-center py-6">No notes yet.</p>`;
  renderNoteEditor();
}

export function renderNoteEditor() {
  const n = state.studioNotes.find((x) => x.id === state.activeNoteId);
  if ($('active-note-category')) $('active-note-category').textContent = n ? n.category : 'New note';
  if ($('active-note-title')) $('active-note-title').value = n ? n.title : '';
  if ($('active-note-body')) $('active-note-body').value = n ? n.body : '';
  const ind = $('note-sync-indicator');
  if (ind) {
    ind.className = 'flex items-center gap-1 text-[#68cfa3] font-semibold';
    ind.innerHTML = '<i class="ph-fill ph-cloud-check"></i> Synced just now';
  }
}

export function selectStudioNote(id) {
  state.activeNoteId = id;
  saveState();
  renderStudioNotes();
  const n = state.studioNotes.find((x) => x.id === id);
  if (n) showToast(`Loaded note: "${n.title}"`);
}

export function markNoteUnsaved() {
  const ind = $('note-sync-indicator');
  if (ind) {
    ind.className = 'flex items-center gap-1 text-amber-500 font-semibold';
    ind.innerHTML = '<i class="ph-fill ph-dots-three-circle"></i> Editing...';
  }
}

export function saveCurrentStudioNote() {
  const title = $('active-note-title').value.trim() || 'Untitled Note';
  const body = $('active-note-body').value;
  let n = state.studioNotes.find((x) => x.id === state.activeNoteId);
  if (n) {
    n.title = title; n.body = body; n.updated = 'Just now';
  } else {
    n = { id: Date.now(), title, category: 'Workspace Note', updated: 'Just now', body };
    state.studioNotes.unshift(n);
    state.activeNoteId = n.id;
  }
  saveState();
  renderStudioNotes();
  showToast('Note saved & synced across devices!');
}

export function createNewStudioNote() {
  state.activeNoteId = null;
  saveState();
  renderStudioNotes();
  $('active-note-title').focus();
  showToast('Ready for your new note');
}

export function deleteStudioNote(id) {
  state.studioNotes = state.studioNotes.filter((n) => n.id !== id);
  if (state.activeNoteId === id) state.activeNoteId = state.studioNotes[0] ? state.studioNotes[0].id : null;
  saveState();
  renderStudioNotes();
  renderAnalytics();
  showToast('Note deleted');
}
