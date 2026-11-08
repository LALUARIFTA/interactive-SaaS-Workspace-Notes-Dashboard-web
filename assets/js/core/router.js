import { $ } from './ui.js';
import { state, saveState } from './store.js';

export const PAGES = ['dashboard', 'workflows', 'integrations', 'notes', 'analytics', 'calendar', 'team', 'notifications'];

export function switchPage(pageId) {
  const target = pageId === 'inbox' ? 'notifications' : pageId;
  if (!PAGES.includes(target)) return;
  if (location.hash !== '#/' + target) location.hash = '#/' + target;
  else applyPage();
}

export function applyPage() {
  let target = (location.hash || '').replace('#/', '');
  if (!PAGES.includes(target)) target = 'dashboard';

  PAGES.forEach((p) => {
    const el = $('page-' + p);
    if (el) el.classList.toggle('hidden', p !== target);
  });

  ['dashboard', 'workflows', 'integrations'].forEach((tab) => {
    const btn = $('topnav-' + tab);
    if (!btn) return;
    const indicator = btn.querySelector('.topnav-indicator');
    const active = tab === target;
    btn.classList.toggle('text-slate-500', !active);
    btn.classList.toggle('dark:text-slate-400', !active);
    btn.classList.toggle('font-medium', !active);
    btn.classList.toggle('text-[#181b2c]', active);
    btn.classList.toggle('dark:text-white', active);
    btn.classList.toggle('font-bold', active);
    if (indicator) {
      indicator.classList.toggle('opacity-0', !active);
      indicator.classList.toggle('scale-x-50', !active);
    }
  });

  document.querySelectorAll('.sidebar-btn[data-nav]').forEach((btn) => {
    const nav = btn.getAttribute('data-nav');
    const active = nav === target;
    btn.className = 'sidebar-btn group relative w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-200 ' +
      (active ? 'bg-white text-[#6558f5] shadow-md' : 'text-white/80 hover:text-white hover:bg-white/15');
  });
}

export function applyTheme(mode) {
  const htmlEl = document.documentElement;
  const btnLight = $('btn-theme-light');
  const btnDark = $('btn-theme-dark');

  if (mode === 'dark') {
    htmlEl.classList.add('dark');
    btnDark.className = 'flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6558f5] text-white shadow-sm transition-all duration-200';
    btnLight.className = 'flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-400 hover:text-white transition-all duration-200';
  } else {
    htmlEl.classList.remove('dark');
    btnLight.className = 'flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6558f5] text-white shadow-sm transition-all duration-200';
    btnDark.className = 'flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-600 hover:text-slate-900 transition-all duration-200';
  }
}

export function setTheme(mode) {
  state.theme = mode;
  applyTheme(mode);
  saveState();
}
