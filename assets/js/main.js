import { $, closeModal, showToast } from './core/ui.js';
import { state, saveState, resetState } from './core/store.js';
import { switchPage, applyPage, applyTheme, setTheme } from './core/router.js';

import {
  renderUser, renderDashboardNotifications, renderAssignmentCard, renderCalendarStrip,
  renderCalendarSlots, renderTodayTasks, renderTypographyRing, renderBoardMeeting,
  removeNotification, restoreDashboardNotifications, clearDashboardNotifications,
  cycleAssignmentItem, deleteAssignment, selectCalendarDay, shiftCalendarWeek,
  advanceTaskProgress, deleteTask, incrementTypographyCheck, acceptBoardInvite
} from './pages/dashboard.js';
import { renderKanbanBoard, advanceKanbanCard, deleteKanbanCard, filterKanban } from './pages/workflows.js';
import { renderIntegrations, toggleIntegration } from './pages/integrations.js';
import { renderStudioNotes, selectStudioNote, markNoteUnsaved, saveCurrentStudioNote, createNewStudioNote, deleteStudioNote } from './pages/notes.js';
import { renderAnalytics } from './pages/analytics.js';
import { renderCalendarPage } from './pages/calendar.js';
import { renderNotificationsFeed, markAllNotificationsRead, renderInbox, sendInboxMessage } from './pages/notifications.js';
import { renderTeamDirectory, removeTeamMember } from './pages/team.js';
import {
  openQuickCreateModal, submitQuickCreate, openQuickReplyModal, sendQuickReply,
  openNewEventModal, addCalendarEvent, openEditEventModal, saveUpcomingEvent,
  rescheduleBoardMeeting, saveBoardReschedule, openInviteModal, submitInvite,
  openPremiumModal, openSettingsModal, saveSettings
} from './modals.js';
import { handleGlobalSearch, runSearchResult, triggerCommandSearch } from './search.js';

// --- GLOBAL ACTIONS ---
export function triggerCloudSync() {
  const icon = $('sync-sidebar-icon');
  if (icon) {
    icon.classList.add('rotate-180');
    setTimeout(() => icon.classList.remove('rotate-180'), 600);
  }
  showToast('All notes & boards synced to Cloud!');
}

export function exportWorkspaceData() {
  const csvRows = [
    ['Category', 'Title', 'Owner', 'Progress / Status', 'Date'],
    ...state.todayTasks.map((t) => ['Today Task', t.title, state.user.name, `${t.progress}%`, t.date]),
    ...state.assignments.map((a) => ['Assignment', a.title, a.author, a.priority, 'May 2021']),
    ...state.kanbanCards.map((c) => ['Workflow Card', c.title, c.assignee, c.status, 'May 2021']),
    ...state.studioNotes.map((n) => ['Note', n.title, n.category, '', 'May 2021'])
  ];
  const csvString = csvRows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.user.name.replace(/\s+/g, '_')}_Workspace_Export.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Workspace data exported (.xls / .csv)!');
}

export function copyShareLink() {
  const dummy = document.createElement('textarea');
  dummy.value = window.location.href;
  document.body.appendChild(dummy);
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
  showToast('Workspace share link copied to clipboard!');
}

export function resetWorkspaceData() {
  resetState();
  saveState();
  renderAll();
  applyTheme(state.theme);
  applyPage();
  showToast('Template data reset to defaults');
}

export function renderAll() {
  renderUser();
  renderDashboardNotifications();
  renderAssignmentCard();
  renderCalendarStrip();
  renderCalendarSlots();
  renderTodayTasks();
  renderTypographyRing();
  renderKanbanBoard();
  renderIntegrations();
  renderStudioNotes();
  renderTeamDirectory();
  renderAnalytics();
  renderCalendarPage();
  renderNotificationsFeed();
  renderInbox();
  renderBoardMeeting();
}

// --- WINDOW BRIDGE (inline onclick handlers resolve against window) ---
Object.assign(window, {
  switchPage, setTheme, applyTheme, applyPage,
  closeModal, showToast,
  triggerCloudSync, exportWorkspaceData, copyShareLink, resetWorkspaceData,
  openQuickCreateModal, submitQuickCreate,
  openQuickReplyModal, sendQuickReply,
  openNewEventModal, addCalendarEvent, openEditEventModal, saveUpcomingEvent,
  rescheduleBoardMeeting, saveBoardReschedule,
  state,
  switchPage, setTheme, applyTheme, applyPage,
  handleGlobalSearch, runSearchResult, triggerCommandSearch,
  removeNotification, restoreDashboardNotifications, clearDashboardNotifications,
  cycleAssignmentItem, deleteAssignment,
  selectCalendarDay, shiftCalendarWeek,
  advanceTaskProgress, deleteTask, incrementTypographyCheck, acceptBoardInvite,
  advanceKanbanCard, deleteKanbanCard, filterKanban,
  toggleIntegration,
  selectStudioNote, markNoteUnsaved, saveCurrentStudioNote, createNewStudioNote, deleteStudioNote,
  markAllNotificationsRead, sendInboxMessage,
  removeTeamMember
});

window.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme || 'light');
  renderAll();
  applyPage();

  document.addEventListener('click', (e) => {
    const wrap = $('search-wrap');
    const box = $('search-results');
    if (wrap && box && !box.classList.contains('hidden') && !wrap.contains(e.target)) box.classList.add('hidden');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});

window.addEventListener('hashchange', applyPage);
