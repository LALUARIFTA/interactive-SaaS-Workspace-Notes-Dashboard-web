import { $, esc, showToast } from '../core/ui.js';
import { state, saveState } from '../core/store.js';
import { renderAnalytics } from './analytics.js';
import { renderNotificationsFeed } from './notifications.js';

// --- USER ---
export function renderUser() {
  $('hero-username').textContent = state.user.name;
}

// --- DASHBOARD NOTIFICATIONS ---
export function renderDashboardNotifications() {
  const container = $('dashboard-notif-list');
  if (!container) return;
  const items = state.notifications.filter((n) => n.kind === 'event' || n.kind === 'message');
  container.innerHTML = items.length
    ? items.map((n) => (n.kind === 'event' ? notifEventCard(n) : notifMessageCard(n))).join('')
    : notifEmptyState();
}

function notifEventCard(n) {
  return `
    <div class="relative flex items-center">
      <div class="w-full bg-[#efeffb] dark:bg-slate-800/90 rounded-[22px] py-5 pr-4 pl-6 flex flex-col items-end justify-center gap-3 h-[106px]">
        <button onclick="removeNotification('${n.id}')" class="text-[#181b2c] dark:text-slate-200 hover:text-rose-500 transition-colors" title="Delete event">
          <i class="ph-fill ph-trash text-[15px]"></i>
        </button>
        <button onclick="openEditEventModal('${n.id}')" class="text-[#181b2c] dark:text-slate-200 hover:text-[#6558f5] transition-colors" title="Edit event">
          <i class="ph-fill ph-pencil-simple-line text-[15px]"></i>
        </button>
      </div>
      <div class="absolute -left-2 sm:-left-5 right-11 bg-white dark:bg-[#23273e] rounded-[22px] p-4 sm:px-5 shadow-pop border border-slate-100/80 dark:border-slate-700/60 transition-transform duration-300 hover:-translate-x-1">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="text-[13.5px] font-bold text-[#181b2c] dark:text-white">${esc(n.title)}</span>
            <span class="w-1.5 h-1.5 rounded-full bg-[#68cfa3]"></span>
          </div>
          <button onclick="showToast('Event options opened')" class="text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <i class="ph-bold ph-dots-three text-base"></i>
          </button>
        </div>
        <p class="text-[11px] text-slate-400 font-medium mt-0.5">${esc(n.subtitle)} &nbsp;|&nbsp; ${esc(n.duration)}</p>
        <div class="flex items-center gap-4 mt-3 text-[10.5px] font-bold text-[#181b2c] dark:text-slate-200">
          <span class="flex items-center gap-1.5"><i class="ph ph-calendar-blank text-slate-400 text-xs"></i><span>${esc(n.date)}</span></span>
          <span class="flex items-center gap-1.5"><i class="ph ph-clock text-slate-400 text-xs"></i><span>${esc(n.time)}</span></span>
        </div>
      </div>
    </div>`;
}

function notifMessageCard(n) {
  return `
    <div onclick="openQuickReplyModal('notif','${n.id}')" class="bg-white dark:bg-[#23273e] rounded-[22px] p-4 sm:px-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100/60 dark:border-slate-800">
      <div class="flex items-center justify-between">
        <h4 class="text-[13.5px] font-bold text-[#181b2c] dark:text-white">${esc(n.title)} &nbsp;|&nbsp; ${esc(n.tag)}</h4>
        <i class="ph-bold ph-dots-three text-slate-400"></i>
      </div>
      <p class="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-1">
        <i class="ph ph-envelope-simple text-xs"></i>
        <span>Message from ${esc(n.from)}</span>
      </p>
      <div class="mt-3 bg-[#efeffb] dark:bg-slate-800 rounded-xl px-3.5 py-2 text-[10.5px] text-slate-400 dark:text-slate-300 truncate font-medium">${esc(n.preview)}</div>
    </div>`;
}

function notifEmptyState() {
  return `
    <div class="py-10 text-center">
      <div class="w-10 h-10 rounded-full bg-[#e6f7f0] text-[#68cfa3] flex items-center justify-center mx-auto mb-2">
        <i class="ph-bold ph-check text-lg"></i>
      </div>
      <p class="text-xs font-bold text-[#181b2c] dark:text-white">All caught up!</p>
      <button onclick="restoreDashboardNotifications()" class="text-[11px] text-[#6558f5] font-semibold mt-1 hover:underline">Restore sample notifications</button>
    </div>`;
}

export function removeNotification(id) {
  state.notifications = state.notifications.filter((n) => n.id !== id);
  saveState();
  renderDashboardNotifications();
  showToast('Notification removed');
}

export function restoreDashboardNotifications() {
  state.notifications = seedState().notifications;
  saveState();
  renderDashboardNotifications();
  renderNotificationsFeed();
  showToast('Sample notifications restored');
}

export function clearDashboardNotifications() {
  state.notifications = state.notifications.filter((n) => n.kind === 'feed');
  saveState();
  renderDashboardNotifications();
  showToast('Notifications cleared');
}

// --- ASSIGNMENTS ---
export function renderAssignmentCard() {
  const container = $('assignments-container');
  if (!container) return;
  const a = state.assignments[state.assignmentIndex];
  if (!a) {
    container.innerHTML = `<div class="py-8 text-center"><p class="text-xs text-slate-400 font-medium">No assignments yet — add one below.</p></div>`;
    return;
  }
  container.innerHTML = `
    <div class="bg-white dark:bg-[#23273e] rounded-[22px] p-4 sm:p-5 shadow-sm border border-slate-100/70 dark:border-slate-800 transition-all hover:shadow-md">
      <div class="flex items-center justify-between text-[11px] font-semibold">
        <div class="flex items-center gap-2.5">
          <span class="text-[#6558f5]">${esc(a.tag1)}</span>
          <span class="text-[#181b2c] dark:text-slate-300">${esc(a.tag2)}</span>
        </div>
        <div class="flex items-center gap-1">
          <button onclick="deleteAssignment(${state.assignmentIndex})" title="Delete assignment" class="text-slate-300 hover:text-rose-500 transition-colors"><i class="ph-bold ph-trash text-sm"></i></button>
          <button onclick="cycleAssignmentItem()" title="Next assignment" class="text-slate-400 hover:text-[#6558f5]"><i class="ph-bold ph-dots-three text-base"></i></button>
        </div>
      </div>
      <div class="flex items-start justify-between gap-3 mt-2.5">
        <h4 class="text-[14px] font-bold text-[#181b2c] dark:text-white leading-snug">${esc(a.title)}</h4>
        <span class="shrink-0 bg-[#fce8ec] dark:bg-rose-950/70 text-[#d9536f] text-[10.5px] font-bold px-3 py-1 rounded-full">${esc(a.priority)}</span>
      </div>
      <div class="flex items-center justify-between mt-4 pt-1">
        <span class="bg-[#68cfa3] text-white text-[10.5px] font-semibold px-3.5 py-1.5 rounded-full shadow-sm">${esc(a.pill)}</span>
        <div class="flex items-center gap-2">
          <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">${esc(a.author)}</span>
          <img src="${a.avatar}" onerror="this.src='https://placehold.co/60x60/6558f5/ffffff?text=U'" alt="${esc(a.author)}" class="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-700"/>
        </div>
      </div>
    </div>`;
}

export function cycleAssignmentItem() {
  if (!state.assignments.length) return;
  state.assignmentIndex = (state.assignmentIndex + 1) % state.assignments.length;
  saveState();
  renderAssignmentCard();
  showToast(`Viewing assignment by ${state.assignments[state.assignmentIndex].author}`);
}

export function deleteAssignment(idx) {
  const a = state.assignments[idx];
  state.assignments.splice(idx, 1);
  if (state.assignmentIndex >= state.assignments.length) state.assignmentIndex = 0;
  saveState();
  renderAssignmentCard();
  if (a) showToast(`Assignment "${a.title.slice(0, 24)}..." deleted`);
}

// --- CALENDAR WIDGET ---
export function renderCalendarStrip() {
  const container = $('calendar-days-strip');
  if (!container) return;
  container.innerHTML = state.calendarDays.map((day) => {
    const isSelected = day.num === state.selectedDay;
    return `
      <button onclick="selectCalendarDay(${day.num})" class="flex flex-col items-center py-1.5 rounded-xl transition-all group">
        <span class="text-[10px] font-medium ${isSelected ? 'text-[#6558f5] font-bold' : 'text-slate-400'}">${esc(day.name)}</span>
        <span class="mt-1.5 w-7 h-7 rounded-full flex items-center justify-center text-[11.5px] font-bold transition-all ${
          isSelected ? 'bg-[#6558f5] text-white shadow-md scale-105' : 'text-[#181b2c] dark:text-slate-200 group-hover:bg-[#efeffb] dark:group-hover:bg-slate-800'
        }">${day.num}</span>
        <span class="w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-[#6558f5]' : 'bg-transparent'}"></span>
      </button>`;
  }).join('');
}

export function renderCalendarSlots() {
  const container = $('calendar-slots-container');
  const d = state.calendarDays.find((x) => x.num === state.selectedDay);
  if (!container || !d) return;
  const slots = [
    { icon: 'ph-users', range: d.slot1Time, title: d.slot1Title, tag: d.slot1Tag, dot: '#68cfa3', sub: '12:00 - 12:30' },
    { icon: 'ph-briefcase', range: d.slot2Time, title: d.slot2Title, tag: d.slot2Tag, dot: '#e0536c', sub: '12:30 - 01:30 PM' }
  ];
  container.innerHTML = slots.map((s) => `
    <div>
      <div class="flex items-center gap-2 mb-2">
        <span class="text-[11px] font-bold text-[#181b2c] dark:text-slate-200 shrink-0">${esc(s.range)}</span>
        <div class="w-full border-b border-dashed border-slate-300 dark:border-slate-700"></div>
      </div>
      <div onclick="switchPage('calendar')" class="bg-white dark:bg-[#23273e] rounded-2xl p-3 flex items-center justify-between shadow-sm hover:shadow cursor-pointer transition-all">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#efeffb] dark:bg-slate-800 text-[#181b2c] dark:text-white flex items-center justify-center"><i class="ph ${s.icon} text-base"></i></div>
          <div>
            <h4 class="text-[12.5px] font-bold text-[#181b2c] dark:text-white">${esc(s.title)}</h4>
            <p class="text-[10.5px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span>${s.sub}</span>
              <span class="w-1.5 h-1.5 rounded-full" style="background:${s.dot}"></span>
              <span>${esc(s.tag)}</span>
            </p>
          </div>
        </div>
        <i class="ph-bold ph-dots-three-vertical text-slate-400"></i>
      </div>
    </div>`).join('');
}

export function selectCalendarDay(dayNum) {
  state.selectedDay = dayNum;
  saveState();
  renderCalendarStrip();
  renderCalendarSlots();
}

export function shiftCalendarWeek(dir) {
  const idx = state.calendarDays.findIndex((d) => d.num === state.selectedDay);
  const nextIdx = (idx + dir + state.calendarDays.length) % state.calendarDays.length;
  selectCalendarDay(state.calendarDays[nextIdx].num);
}

// --- TODAY TASKS ---
export function renderTodayTasks() {
  const container = $('today-tasks-list');
  if (!container) return;
  container.innerHTML = state.todayTasks.map((t) => `
    <div onclick="advanceTaskProgress(${t.id})" title="Click to update task progress"
      class="cursor-pointer rounded-[20px] px-4 py-3.5 transition-all duration-200 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 ${
        t.elevated ? 'bg-white dark:bg-[#23273e] shadow-md border border-slate-100/80 dark:border-slate-700/60' : 'hover:bg-white/70 dark:hover:bg-[#23273e]/60'
      }">
      <div class="min-w-[135px]">
        <h4 class="text-[12.5px] font-bold text-[#181b2c] dark:text-white">${esc(t.title)}</h4>
        <p class="text-[10px] text-slate-400 font-medium mt-0.5">${esc(t.date)}</p>
      </div>
      <div class="min-w-[72px]">
        <span class="text-[9.5px] text-slate-400 block font-medium">Duration</span>
        <span class="text-[11px] font-bold text-[#181b2c] dark:text-slate-200">${esc(t.duration)}</span>
      </div>
      <div class="flex items-center gap-2 min-w-[95px] flex-1 max-w-[125px]">
        <span class="text-[10.5px] font-extrabold text-[#181b2c] dark:text-white w-7 text-right">${t.progress}%</span>
        <div class="flex-1 h-[3.5px] bg-[#e6e5f8] dark:bg-slate-700 rounded-full overflow-hidden">
          <div class="h-full bg-[#6558f5] rounded-full transition-all duration-500" style="width: ${t.progress}%"></div>
        </div>
      </div>
      <div class="flex items-center gap-2 text-[10.5px] font-bold text-[#181b2c] dark:text-slate-300 shrink-0">
        <span class="flex items-center gap-1"><i class="ph ph-paperclip text-slate-400 text-xs"></i><span>${t.attachments}</span></span>
        <span class="text-slate-300">•</span>
        <span class="flex items-center gap-1"><i class="ph ${t.metaIcon === 'chat' ? 'ph-chat-circle' : 'ph-calendar-blank'} text-slate-400 text-xs"></i><span>${esc(t.metaText)}</span></span>
        <button onclick="event.stopPropagation(); deleteTask(${t.id})" title="Delete task" class="ml-1 text-slate-300 hover:text-rose-500 transition-colors"><i class="ph ph-trash text-xs"></i></button>
      </div>
    </div>`).join('') || `<p class="text-xs text-slate-400 font-medium text-center py-6">No tasks yet — add one from the Edit button.</p>`;
}

export function advanceTaskProgress(taskId) {
  state.todayTasks.forEach((t) => {
    t.elevated = (t.id === taskId);
    if (t.id === taskId) {
      t.progress = t.progress >= 100 ? 25 : Math.min(100, t.progress + 20);
      showToast(`"${t.title}" updated to ${t.progress}%`);
    }
  });
  saveState();
  renderTodayTasks();
  renderAnalytics();
}

export function deleteTask(taskId) {
  const t = state.todayTasks.find((x) => x.id === taskId);
  state.todayTasks = state.todayTasks.filter((x) => x.id !== taskId);
  if (!state.todayTasks.some((x) => x.elevated) && state.todayTasks.length) state.todayTasks[0].elevated = true;
  saveState();
  renderTodayTasks();
  renderAnalytics();
}

// --- RING GAUGES ---
export function renderTypographyRing() {
  const pctMap = { 3: 65, 4: 85, 5: 100 };
  const pct = pctMap[state.typographyChecks] || 65;
  const C = 150.8;
  const circle = $('ring-typography');
  if (circle) circle.style.strokeDashoffset = C - (pct / 100) * C;
  if ($('ring-typography-text')) $('ring-typography-text').textContent = pct + '%';
  if ($('typo-marked-text')) $('typo-marked-text').innerHTML = `You marked <span class="font-bold text-slate-500 dark:text-slate-300">${state.typographyChecks}/5</span>`;
  const remaining = 5 - state.typographyChecks;
  if ($('typo-left-text')) $('typo-left-text').textContent = remaining === 0 ? 'All assignments done!' : `${remaining} assignment${remaining > 1 ? 's' : ''} left`;
}

export function incrementTypographyCheck() {
  state.typographyChecks = state.typographyChecks >= 5 ? 3 : state.typographyChecks + 1;
  saveState();
  renderTypographyRing();
  showToast(`Typography progress updated: ${state.typographyChecks}/5`);
}

// --- BOARD MEETING ---
export function renderBoardMeeting() {
  const timeEl = $('board-meeting-time');
  if (timeEl) timeEl.textContent = state.boardMeeting.time;
  const btn = $('btn-accept-invite');
  if (!btn) return;
  if (state.boardMeeting.accepted) {
    btn.textContent = '✓ Accepted';
    btn.className = 'bg-[#68cfa3] text-white text-[11px] font-bold px-4 py-2.5 rounded-full shadow-sm transition-all';
  } else {
    btn.textContent = 'Accept invite';
    btn.className = 'bg-[#6c60f6] hover:bg-[#584be6] text-white text-[11px] font-bold px-4 py-2.5 rounded-full shadow-sm transition-all active:scale-95';
  }
}

export function acceptBoardInvite() {
  state.boardMeeting.accepted = true;
  saveState();
  renderBoardMeeting();
  showToast('Invite accepted! Added Room 159 meeting to your calendar.');
}
