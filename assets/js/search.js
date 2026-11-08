import { $, esc, showToast } from './core/ui.js';
import { state } from './core/store.js';
import { switchPage } from './core/router.js';
import { selectStudioNote } from './pages/notes.js';

let searchResults = [];

export function handleGlobalSearch(query) {
  const box = $('search-results');
  const q = String(query || '').trim().toLowerCase();
  if (!q) { box.classList.add('hidden'); searchResults = []; return; }

  const res = [];
  const push = (icon, label, sub, fn) => res.push({ icon, label, sub, fn });

  state.studioNotes.forEach((n) => {
    if ((n.title + ' ' + n.body).toLowerCase().includes(q)) push('ph-note-pencil', n.title, 'Note • ' + n.category, () => { switchPage('notes'); selectStudioNote(n.id); });
  });
  state.todayTasks.forEach((t) => {
    if (t.title.toLowerCase().includes(q)) push('ph-check-square', t.title, 'Task • ' + t.progress + '%', () => switchPage('dashboard'));
  });
  state.kanbanCards.forEach((c) => {
    if ((c.title + ' ' + c.tag + ' ' + c.assignee).toLowerCase().includes(q)) push('ph-kanban', c.title, 'Workflow • ' + c.tag, () => switchPage('workflows'));
  });
  state.teamMembers.forEach((m) => {
    if ((m.name + ' ' + m.role).toLowerCase().includes(q)) push('ph-user', m.name, 'Team • ' + m.role, () => switchPage('team'));
  });
  state.events.forEach((ev) => {
    if ((ev.title + ' ' + ev.desc).toLowerCase().includes(q)) push('ph-calendar-blank', ev.title, 'Event • ' + ev.when, () => switchPage('calendar'));
  });
  state.integrations.forEach((a) => {
    if ((a.name + ' ' + a.desc).toLowerCase().includes(q)) push('ph-plugs', a.name, 'Integration', () => switchPage('integrations'));
  });

  searchResults = res.slice(0, 7);
  box.innerHTML = searchResults.length
    ? searchResults.map((r, i) => `
      <button onclick="runSearchResult(${i})" class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#efeffb] dark:hover:bg-slate-800 transition-colors text-left">
        <i class="ph ${r.icon} text-[#6558f5]"></i>
        <span class="flex-1 min-w-0">
          <span class="block text-[12px] font-bold text-[#181b2c] dark:text-white truncate">${esc(r.label)}</span>
          <span class="block text-[10px] text-slate-400 truncate">${esc(r.sub)}</span>
        </span>
      </button>`).join('')
    : `<p class="px-4 py-3 text-[11px] text-slate-400">No results for "${esc(query)}"</p>`;
  box.classList.remove('hidden');
}

export function runSearchResult(i) {
  const r = searchResults[i];
  if (!r) return;
  $('search-results').classList.add('hidden');
  $('global-search').value = '';
  searchResults = [];
  r.fn();
  showToast(`Opened "${r.label.slice(0, 30)}"`);
}

export function triggerCommandSearch() {
  if (searchResults.length) runSearchResult(0);
}
