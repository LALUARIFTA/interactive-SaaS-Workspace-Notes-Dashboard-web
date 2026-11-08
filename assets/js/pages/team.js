import { $, esc, showToast } from '../core/ui.js';
import { state, saveState } from '../core/store.js';
import { renderAnalytics } from './analytics.js';

export function renderTeamDirectory() {
  const grid = $('team-directory-grid');
  if (!grid) return;
  grid.innerHTML = state.teamMembers.map((m, i) => `
    <div class="widget-card bg-white dark:bg-[#1b1e30] rounded-[24px] p-5 shadow-card flex items-center justify-between">
      <div class="flex items-center gap-3.5">
        <img src="${m.avatar}" onerror="this.src='https://placehold.co/60x60/6558f5/fff?text=U'" class="w-12 h-12 rounded-2xl object-cover" alt="${esc(m.name)}"/>
        <div>
          <h4 class="text-sm font-bold text-[#181b2c] dark:text-white">${esc(m.name)}</h4>
          <p class="text-[11px] text-slate-400 font-medium">${esc(m.role)}</p>
          <div class="flex items-center gap-2 mt-1.5">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e6f7f0] text-[#68cfa3]">${esc(m.status)}</span>
            <span class="text-[10px] text-slate-400 font-semibold">${esc(m.tasks)}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="openQuickReplyModal('member',${i})" class="w-9 h-9 rounded-full bg-[#efeffb] dark:bg-slate-800 text-[#6558f5] flex items-center justify-center hover:bg-[#6558f5] hover:text-white transition-colors"><i class="ph-bold ph-paper-plane-tilt text-sm"></i></button>
        <button onclick="removeTeamMember(${i})" title="Remove member" class="w-9 h-9 rounded-full bg-[#fce8ec] dark:bg-slate-800 text-[#e0536c] flex items-center justify-center hover:bg-[#e0536c] hover:text-white transition-colors"><i class="ph-bold ph-trash text-sm"></i></button>
      </div>
    </div>`).join('');
}

export function removeTeamMember(i) {
  const m = state.teamMembers.splice(i, 1)[0];
  saveState();
  renderTeamDirectory();
  renderAnalytics();
  showToast(`${m.name} removed from directory`);
}
