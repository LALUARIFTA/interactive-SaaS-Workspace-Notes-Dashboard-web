import { $, esc, showToast } from '../core/ui.js';
import { state, saveState } from '../core/store.js';
import { renderAnalytics } from './analytics.js';

export function renderKanbanBoard() {
  const grid = $('kanban-board-grid');
  if (!grid) return;
  const columns = [
    { key: 'todo', label: 'Backlog / To Do', dot: 'bg-slate-400' },
    { key: 'inprogress', label: 'In Progress', dot: 'bg-[#6558f5]' },
    { key: 'review', label: 'In Review', dot: 'bg-[#e0536c]' },
    { key: 'done', label: 'Completed', dot: 'bg-[#68cfa3]' }
  ];
  grid.innerHTML = columns.map((col) => {
    const cards = state.kanbanCards.filter((c) =>
      c.status === col.key && (state.kanbanFilter === 'all' || c.tag === state.kanbanFilter)
    );
    return `
      <div class="bg-white/70 dark:bg-[#1b1e30]/80 rounded-[24px] p-4 shadow-card flex flex-col justify-between min-h-[340px]">
        <div>
          <div class="flex items-center justify-between mb-3 px-1">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full ${col.dot}"></span>
              <h4 class="text-xs font-extrabold text-[#181b2c] dark:text-white">${esc(col.label)}</h4>
            </div>
            <span class="text-[11px] font-bold bg-[#efeffb] dark:bg-slate-800 text-[#6558f5] px-2 py-0.5 rounded-full">${cards.length}</span>
          </div>
          <div class="space-y-3">
            ${cards.map((c) => `
              <div class="bg-white dark:bg-[#23273e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                <div class="flex items-center justify-between text-[10px] font-bold">
                  <span class="text-[#6558f5]">${esc(c.tag)}</span>
                  <span class="px-2 py-0.5 rounded-full ${c.priority === 'High' ? 'bg-[#fce8ec] text-[#e0536c]' : 'bg-[#e6f7f0] text-[#68cfa3]'}">${esc(c.priority)}</span>
                </div>
                <h5 class="text-xs font-bold text-[#181b2c] dark:text-white mt-2 leading-snug">${esc(c.title)}</h5>
                <div class="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10.5px]">
                  <span class="text-slate-400 font-medium">${esc(c.assignee)}</span>
                  <div class="flex items-center gap-2">
                    <button onclick="deleteKanbanCard(${c.id})" class="text-slate-300 hover:text-rose-500 transition-colors"><i class="ph ph-trash text-xs"></i></button>
                    <button onclick="advanceKanbanCard(${c.id})" class="text-[#6558f5] font-bold hover:underline flex items-center gap-0.5">Move <i class="ph-bold ph-arrow-right text-[10px]"></i></button>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </div>
        <button onclick="openQuickCreateModal('kanban')" class="mt-3 w-full py-2 rounded-xl bg-[#efeffb] dark:bg-slate-800 text-[11px] font-bold text-[#6558f5] hover:bg-[#e2e0fa] transition-colors">+ Add card</button>
      </div>`;
  }).join('');
}

export function advanceKanbanCard(cardId) {
  const order = ['todo', 'inprogress', 'review', 'done'];
  const card = state.kanbanCards.find((c) => c.id === cardId);
  if (card) {
    card.status = order[(order.indexOf(card.status) + 1) % order.length];
    saveState();
    renderKanbanBoard();
    renderAnalytics();
    showToast(`Moved "${card.title.slice(0, 22)}..." to ${card.status.toUpperCase()}`);
  }
}

export function deleteKanbanCard(cardId) {
  const c = state.kanbanCards.find((x) => x.id === cardId);
  state.kanbanCards = state.kanbanCards.filter((x) => x.id !== cardId);
  saveState();
  renderKanbanBoard();
  renderAnalytics();
  if (c) showToast(`Card "${c.title.slice(0, 22)}..." deleted`);
}

export function filterKanban(tag) {
  state.kanbanFilter = tag;
  saveState();
  document.querySelectorAll('.kanban-filter-btn').forEach((btn) => {
    const active = btn.getAttribute('data-filter') === tag;
    btn.className = 'kanban-filter-btn px-3.5 py-1.5 rounded-full ' + (active ? 'bg-[#6558f5] text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-300');
  });
  renderKanbanBoard();
}
