import { $, openModal, closeModal, esc, showToast } from './core/ui.js';
import { state, saveState } from './core/store.js';
import { renderAssignmentCard, renderTodayTasks, renderDashboardNotifications, renderBoardMeeting } from './pages/dashboard.js';
import { renderKanbanBoard } from './pages/workflows.js';
import { renderAnalytics } from './pages/analytics.js';
import { renderCalendarPage } from './pages/calendar.js';
import { renderTeamDirectory } from './pages/team.js';

// --- QUICK CREATE ---
export function openQuickCreateModal(type) {
  const titles = {
    assignment: 'Add New Assignment',
    task: 'Add Today Task',
    note: 'Quick Create Note',
    kanban: 'Add Workflow Card'
  };
  openModal(titles[type] || 'Create New Item', `
    <form onsubmit="submitQuickCreate(event, '${type}')" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-500 block mb-1">Title</label>
        <input id="qc-title" required type="text" placeholder="e.g., Finalize Q2 Design System" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white focus:outline-none"/>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-500 block mb-1">Category Tag</label>
          <select id="qc-tag" class="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white">
            <option value="Motion design">Motion design</option>
            <option value="UX/UI design">UX/UI design</option>
            <option value="Marketing">Marketing</option>
            <option value="Package design">Package design</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500 block mb-1">Priority</label>
          <select id="qc-priority" class="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>
      <button type="submit" class="w-full py-3 bg-[#6558f5] hover:bg-[#5446e6] text-white rounded-full text-xs font-bold shadow-md">Create & Sync to Workspace</button>
    </form>`);
}

export function submitQuickCreate(e, type) {
  e.preventDefault();
  const title = $('qc-title').value.trim();
  const tag = $('qc-tag').value;
  const priority = $('qc-priority').value;
  if (!title) return;

  if (type === 'assignment') {
    state.assignments.unshift({
      tag1: tag, tag2: 'New', title, priority, pill: tag,
      author: state.user.name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'
    });
    state.assignmentIndex = 0;
    saveState();
    renderAssignmentCard();
  } else if (type === 'kanban') {
    state.kanbanCards.unshift({ id: Date.now(), title, tag, status: 'todo', priority, assignee: state.user.name });
    saveState();
    renderKanbanBoard();
    renderAnalytics();
  } else {
    state.todayTasks.unshift({ id: Date.now(), title, date: 'Just now', duration: '01 h 15 m', progress: 30, attachments: 2, metaIcon: 'chat', metaText: '4', elevated: true });
    state.todayTasks.forEach((t, i) => { t.elevated = i === 0; });
    saveState();
    renderTodayTasks();
    renderAnalytics();
  }

  closeModal();
  showToast(`Created "${title}"!`);
}

// --- QUICK REPLY ---
export function openQuickReplyModal(kind, ref) {
  let person = '';
  let preview = '';
  let topic = 'Team Collaboration';
  if (kind === 'notif') {
    const n = state.notifications.find((x) => x.id === ref);
    if (!n) return;
    person = n.from; preview = n.preview || ''; topic = n.tag || 'General';
  } else {
    const m = state.teamMembers[ref];
    if (!m) return;
    person = m.name;
  }
  openModal(`Message • ${esc(person)}`, `
    <div class="space-y-4">
      ${preview ? `<div class="bg-[#efeffb] dark:bg-slate-800 p-3.5 rounded-2xl text-xs text-slate-600 dark:text-slate-300">"${esc(preview)}"</div>` : ''}
      <textarea id="quick-reply-text" rows="3" placeholder="Type your reply to ${esc(person)}..." class="w-full p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-[#181b2c] dark:text-white focus:outline-none"></textarea>
      <button onclick="sendQuickReply('${kind}','${ref}')" class="w-full py-2.5 bg-[#6558f5] text-white rounded-full text-xs font-bold">Send Reply</button>
    </div>`);
}

export function sendQuickReply(kind, ref) {
  let person = 'colleague';
  if (kind === 'notif') {
    const n = state.notifications.find((x) => x.id === ref);
    if (n) person = n.from;
  } else if (state.teamMembers[ref]) {
    person = state.teamMembers[ref].name;
  }
  closeModal();
  showToast(`Reply sent to ${person}!`);
}

// --- EVENT MODALS ---
export function openNewEventModal() {
  openModal('Schedule New Event', `
    <form onsubmit="addCalendarEvent(event)" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-500 block mb-1">Title</label>
        <input id="ev-title" required type="text" placeholder="e.g., Design review" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white focus:outline-none"/>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-500 block mb-1">When</label>
          <input id="ev-when" type="text" value="Fri, 18 May • 10:00 AM" class="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white"/>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500 block mb-1">Color</label>
          <select id="ev-color" class="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white">
            <option value="#68cfa3">Mint</option>
            <option value="#6558f5">Purple</option>
            <option value="#e0536c">Coral</option>
          </select>
        </div>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-500 block mb-1">Description</label>
        <input id="ev-desc" type="text" placeholder="Short detail" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white"/>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-500 block mb-1">Location / Lead</label>
        <input id="ev-meta" type="text" placeholder="Room or lead name" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white"/>
      </div>
      <button type="submit" class="w-full py-3 bg-[#6558f5] hover:bg-[#5446e6] text-white rounded-full text-xs font-bold shadow-md">Add event</button>
    </form>`);
}

export function addCalendarEvent(e) {
  e.preventDefault();
  const ev = {
    id: 'e' + Date.now(),
    color: $('ev-color').value,
    when: $('ev-when').value.trim() || 'TBD',
    title: $('ev-title').value.trim(),
    desc: $('ev-desc').value.trim() || '—',
    meta: $('ev-meta').value.trim() || '—',
    action: 'join'
  };
  if (!ev.title) return;
  state.events.unshift(ev);
  saveState();
  renderCalendarPage();
  closeModal();
  showToast(`Event "${ev.title}" added to schedule`);
}

export function openEditEventModal(id) {
  const n = state.notifications.find((x) => x.id === id);
  if (!n) return;
  window.__editNotifId = id;
  openModal('Edit Upcoming Event', `
    <form onsubmit="saveUpcomingEvent(event)" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-500 block mb-1">Subtitle</label>
        <input id="ev-sub" type="text" value="${esc(n.subtitle)}" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white"/>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-500 block mb-1">Duration</label>
        <input id="ev-dur" type="text" value="${esc(n.duration)}" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white"/>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-500 block mb-1">Date</label>
          <input id="ev-date" type="text" value="${esc(n.date)}" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white"/>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500 block mb-1">Time Slot</label>
          <input id="ev-time" type="text" value="${esc(n.time)}" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white"/>
        </div>
      </div>
      <button type="submit" class="w-full py-2.5 bg-[#6558f5] text-white rounded-full text-xs font-bold">Save Changes</button>
    </form>`);
}

export function saveUpcomingEvent(e) {
  e.preventDefault();
  const n = state.notifications.find((x) => x.id === window.__editNotifId);
  if (n) {
    n.subtitle = $('ev-sub').value.trim() || n.subtitle;
    n.duration = $('ev-dur').value.trim() || n.duration;
    n.date = $('ev-date').value.trim() || n.date;
    n.time = $('ev-time').value.trim() || n.time;
    saveState();
    renderDashboardNotifications();
  }
  closeModal();
  showToast('Upcoming event updated!');
}

// --- BOARD MEETING ---
export function rescheduleBoardMeeting() {
  openModal('Reschedule Board Meeting', `
    <form onsubmit="saveBoardReschedule(event)" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-500 block mb-1">New Date & Time</label>
        <input id="resched-input" type="text" value="${esc(state.boardMeeting.time)}" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white focus:outline-none"/>
      </div>
      <button type="submit" class="w-full py-2.5 bg-[#6558f5] text-white rounded-full text-xs font-bold">Update Meeting Time</button>
    </form>`);
}

export function saveBoardReschedule(e) {
  e.preventDefault();
  const val = $('resched-input').value.trim();
  if (val) state.boardMeeting.time = val;
  saveState();
  renderBoardMeeting();
  closeModal();
  showToast(`Board meeting rescheduled to ${state.boardMeeting.time}`);
}

// --- TEAM INVITE ---
export function openInviteModal() {
  openModal('Invite Colleague', `
    <form onsubmit="submitInvite(event)" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-500 block mb-1">Full name</label>
        <input id="inv-name" required type="text" placeholder="e.g., Ana Putri" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white focus:outline-none"/>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-500 block mb-1">Role</label>
        <input id="inv-role" type="text" placeholder="e.g., Product Designer" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white focus:outline-none"/>
      </div>
      <button type="submit" class="w-full py-3 bg-[#6558f5] hover:bg-[#5446e6] text-white rounded-full text-xs font-bold shadow-md">Add to workspace</button>
    </form>`);
}

export function submitInvite(e) {
  e.preventDefault();
  const name = $('inv-name').value.trim();
  const role = $('inv-role').value.trim() || 'Team Member';
  if (!name) return;
  const initials = name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  state.teamMembers.push({ name, role, status: 'Online', tasks: '0 Active', avatar: `https://placehold.co/100x100/6558f5/ffffff?text=${initials}` });
  saveState();
  renderTeamDirectory();
  renderAnalytics();
  closeModal();
  showToast(`${name} added to workspace directory`);
}

// --- PREMIUM / SETTINGS ---
export function openPremiumModal() {
  openModal('Go Premium! — Workspace Pro', `
    <div class="text-center space-y-4">
      <div class="w-14 h-14 rounded-2xl bg-[#efeffb] text-[#6558f5] flex items-center justify-center mx-auto text-2xl"><i class="ph-fill ph-crown"></i></div>
      <p class="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">Unlock unlimited cloud note versions, automated Slack & Figma workflows, and full team analytics for ${esc(state.user.name)}'s Workspace.</p>
      <div class="bg-[#f7f7fb] dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div class="text-left">
          <span class="text-xs font-extrabold text-[#181b2c] dark:text-white block">Pro Team Plan</span>
          <span class="text-[11px] text-slate-400">Billed annually • Unlimited boards</span>
        </div>
        <span class="text-lg font-extrabold text-[#6558f5]">$12/mo</span>
      </div>
      <button onclick="closeModal(); showToast('Welcome to NoteFlow Pro! All features unlocked.')" class="w-full py-3 bg-[#181b2c] dark:bg-[#6558f5] text-white rounded-full text-xs font-bold">Activate 14-Day Free Trial</button>
    </div>`);
}

export function openSettingsModal() {
  openModal('Workspace Settings', `
    <div class="space-y-4 text-xs">
      <div>
        <label class="text-xs font-bold text-slate-500 block mb-1">Display name</label>
        <input id="settings-name" type="text" value="${esc(state.user.name)}" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#181b2c] dark:text-white focus:outline-none"/>
      </div>
      <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
        <span class="font-bold text-[#181b2c] dark:text-white">Real-time Cloud Sync</span>
        <input type="checkbox" checked disabled class="w-4 h-4 accent-[#6558f5]"/>
      </div>
      <button onclick="saveSettings()" class="w-full py-2.5 bg-[#6558f5] text-white rounded-full font-bold">Save Preferences</button>
      <button onclick="if(confirm('Reset all template data to defaults?')){ closeModal(); resetWorkspaceData(); }" class="w-full py-2.5 bg-[#fce8ec] dark:bg-slate-800 text-[#e0536c] rounded-full font-bold">Reset template data</button>
    </div>`);
}

export function saveSettings() {
  const name = $('settings-name').value.trim();
  if (name) {
    state.user.name = name;
    saveState();
    renderUser();
  }
  closeModal();
  showToast('Workspace preferences saved');
}
