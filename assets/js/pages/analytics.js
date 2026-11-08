import { $, esc } from '../core/ui.js';
import { state, saveState } from '../core/store.js';

export function renderAnalytics() {
  const notes = state.studioNotes.length;
  const tasks = state.todayTasks;
  const avg = tasks.length ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length) : 0;
  const totalMin = Math.round(state.weeklyHours.reduce((s, w) => s + w.hours, 0) * 60);
  const focus = `${Math.floor(totalMin / 60)}h ${String(totalMin % 60).padStart(2, '0')}m`;
  const online = state.teamMembers.filter((m) => m.status === 'Online').length;

  if ($('kpi-notes')) $('kpi-notes').textContent = notes;
  if ($('kpi-notes-pill')) $('kpi-notes-pill').textContent = `${state.kanbanCards.length} cards tracked`;
  if ($('kpi-completion')) $('kpi-completion').textContent = avg + '%';
  if ($('kpi-completion-pill')) $('kpi-completion-pill').textContent = `${tasks.filter((t) => t.progress === 100).length}/${tasks.length} done`;
  if ($('kpi-focus')) $('kpi-focus').textContent = focus;
  const onTrack = totalMin >= 30 * 60;
  const focusPill = $('kpi-focus-pill');
  if (focusPill) {
    focusPill.textContent = onTrack ? 'On Track' : 'Catch up';
    focusPill.className = 'text-xs font-bold px-2.5 py-1 rounded-full ' + (onTrack ? 'text-[#68cfa3] bg-[#e6f7f0] dark:bg-slate-800' : 'text-[#e0536c] bg-[#fce8ec] dark:bg-slate-800');
  }
  if ($('kpi-collab')) $('kpi-collab').textContent = state.teamMembers.length + ' Members';
  if ($('kpi-collab-pill')) $('kpi-collab-pill').textContent = `${online} online now`;

  renderWeeklyChart();
  renderDeptBars();
  renderMarketingRing();
}

export function renderWeeklyChart() {
  const container = $('weekly-chart');
  if (!container) return;
  const max = Math.max(...state.weeklyHours.map((w) => w.hours), 1);
  const todayIdx = state.weeklyHours.reduce((m, w, i) => (w.hours > state.weeklyHours[m].hours ? i : m), 0);
  container.innerHTML = state.weeklyHours.map((w, i) => {
    const isToday = i === todayIdx;
    const bg = isToday
      ? 'bg-[#6558f5] rounded-t-xl shadow-md'
      : (w.hours <= 2.5 ? 'bg-[#68cfa3] rounded-t-xl' : 'bg-[#efeffb] dark:bg-slate-800 rounded-t-xl hover:bg-[#6558f5] transition-all');
    return `
      <div class="flex flex-col items-center gap-2 h-full justify-end">
        <div class="w-full max-w-[38px] ${bg}" style="height:${Math.max(8, Math.round((w.hours / max) * 95))}%" title="${w.hours} hrs"></div>
        <span class="text-[11px] font-bold ${isToday ? 'text-[#6558f5] font-extrabold' : 'text-slate-400'}">${esc(w.label || w.day)}</span>
      </div>`;
  }).join('');
}

export function renderDeptBars() {
  const container = $('dept-bars');
  if (!container) return;
  const depts = [
    { label: 'Data Research & Marketing', match: ['Marketing', 'Data Research'], color: '#68cfa3' },
    { label: 'Motion Design & Packaging', match: ['Motion design', 'Package design'], color: '#6558f5' },
    { label: 'UX/UI Design & Typography', match: ['UX/UI design'], color: '#e0536c' }
  ];
  const rows = depts.map((d) => {
    const cards = state.kanbanCards.filter((c) => d.match.includes(c.tag));
    const rate = cards.length ? Math.round((cards.filter((c) => c.status === 'done').length / cards.length) * 100) : null;
    return { ...d, rate };
  }).filter((r) => r.rate !== null);
  container.innerHTML = rows.length
    ? rows.map((r) => `
      <div>
        <div class="flex justify-between text-xs font-bold mb-1.5">
          <span class="text-[#181b2c] dark:text-white">${esc(r.label)}</span>
          <span style="color:${r.color}">${r.rate}%</span>
        </div>
        <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full rounded-full" style="width:${r.rate}%; background:${r.color}"></div>
        </div>
      </div>`).join('')
    : `<p class="text-[11px] text-slate-400">Add workflow cards to see department completion.</p>`;
}

export function renderMarketingRing() {
  const cards = state.kanbanCards.filter((c) => c.tag === 'Marketing');
  const done = cards.filter((c) => c.status === 'done').length;
  const rate = cards.length ? Math.round((done / cards.length) * 100) : 0;
  const C = 150.8;
  const circle = $('ring-marketing');
  if (circle) circle.style.strokeDashoffset = C - (rate / 100) * C;
  if ($('ring-marketing-text')) $('ring-marketing-text').textContent = rate + '%';
  if ($('marketing-marked')) $('marketing-marked').innerHTML = `You marked <span class="font-bold text-slate-500 dark:text-slate-300">${done}/${cards.length || 0}</span>`;
  if ($('marketing-left')) $('marketing-left').textContent = cards.length
    ? (done === cards.length ? 'All assignments are done!' : `${cards.length - done} assignment(s) in progress`)
    : 'No marketing cards yet';
}
