import { $, esc, showToast } from '../core/ui.js';
import { state, saveState } from '../core/store.js';

export function renderNotificationsFeed() {
  const feed = $('notifications-feed');
  if (!feed) return;
  const items = state.notifications.filter((n) => n.kind === 'feed');
  feed.innerHTML = items.length
    ? items.map((n) => `
      <div class="bg-white dark:bg-[#1b1e30] rounded-2xl p-4 shadow-card border-l-4 ${n.read ? 'opacity-60' : ''}" style="border-left-color:${n.color}">
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-[#181b2c] dark:text-white">${esc(n.author)} • ${esc(n.topic)}</span>
          <span class="text-[10px] text-slate-400">${esc(n.when)}</span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-300 mt-1">${esc(n.text)}</p>
      </div>`).join('')
    : `<div class="bg-white dark:bg-[#1b1e30] rounded-2xl p-6 text-center text-xs text-slate-400 shadow-card">No notifications — all caught up.</div>`;
  const dot = $('sidebar-notif-dot');
  if (dot) dot.style.opacity = items.some((n) => !n.read) ? '1' : '0';
}

export function markAllNotificationsRead() {
  state.notifications.forEach((n) => { n.read = true; });
  saveState();
  renderNotificationsFeed();
  showToast('All messages marked as read');
}

export function renderInbox() {
  const box = $('inbox-chat-messages');
  if (!box) return;
  box.innerHTML = state.inbox.map((m) => `
    <div class="${m.self ? 'bg-[#6558f5] text-white rounded-2xl p-3.5 max-w-md ml-auto text-xs' : 'bg-[#f7f7fb] dark:bg-slate-800 rounded-2xl p-3.5 max-w-md text-xs text-slate-600 dark:text-slate-200'}">
      <span class="font-bold block ${m.self ? 'opacity-80' : 'text-[#181b2c] dark:text-white'} mb-0.5">${esc(m.from)}${m.self ? ' (You)' : ''}</span>${esc(m.text)}
    </div>`).join('');
  box.scrollTop = box.scrollHeight;
}

export function sendInboxMessage(e) {
  e.preventDefault();
  const input = $('inbox-reply-input');
  if (!input || !input.value.trim()) return;
  state.inbox.push({ id: Date.now(), from: state.user.name, self: true, text: input.value.trim() });
  saveState();
  renderInbox();
  input.value = '';
  showToast('Message delivered to Ken Smith');
}
