import { $, esc, showToast } from '../core/ui.js';
import { state, saveState } from '../core/store.js';

const ACTIONS = {
  join: { label: 'Join link', toast: 'Joined meeting room!' },
  notes: { label: 'View notes', toast: 'Meeting notes opened' },
  accept: { label: 'Accept Invite', toast: 'Invite accepted!' }
};

export function renderCalendarPage() {
  const grid = $('calendar-events-grid');
  if (!grid) return;
  grid.innerHTML = state.events.map((ev) => {
    const act = ACTIONS[ev.action] || { label: 'Open', toast: 'Opened' };
    return `
      <div class="bg-white dark:bg-[#1b1e30] rounded-[24px] p-5 shadow-card border-l-4" style="border-left-color:${ev.color}">
        <span class="text-[10px] font-extrabold uppercase" style="color:${ev.color}">${esc(ev.when)}</span>
        <h3 class="text-base font-bold text-[#181b2c] dark:text-white mt-1">${esc(ev.title)}</h3>
        <p class="text-xs text-slate-400 mt-1">${esc(ev.desc)}</p>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-[11px] font-semibold text-slate-500">${esc(ev.meta)}</span>
          <button onclick="showToast('${act.toast}')" class="text-xs font-bold text-[#6558f5] hover:underline">${act.label} →</button>
        </div>
      </div>`;
  }).join('') || `<p class="text-xs text-slate-400 font-medium text-center py-10 col-span-full">No scheduled events — add one.</p>`;
}
