import { $, esc, showToast } from '../core/ui.js';
import { state, saveState } from '../core/store.js';

export function renderIntegrations() {
  const grid = $('integrations-grid');
  if (!grid) return;
  const connectedCount = state.integrations.filter((i) => i.connected).length;
  if ($('connected-apps-count')) $('connected-apps-count').textContent = `${connectedCount} Connected`;
  grid.innerHTML = state.integrations.map((app, idx) => `
    <div class="widget-card bg-white dark:bg-[#1b1e30] rounded-[24px] p-5 shadow-card flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-xl shadow-sm" style="background:${app.color}"><i class="ph-fill ${app.icon}"></i></div>
          <span class="text-[10px] font-bold px-2.5 py-1 rounded-full ${app.connected ? 'bg-[#e6f7f0] text-[#68cfa3]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}">${app.connected ? 'Connected' : 'Available'}</span>
        </div>
        <h3 class="text-sm font-bold text-[#181b2c] dark:text-white mt-4">${esc(app.name)}</h3>
        <p class="text-[11.5px] text-slate-400 mt-1 leading-relaxed">${esc(app.desc)}</p>
      </div>
      <button onclick="toggleIntegration(${idx})" class="mt-5 w-full py-2 rounded-full text-xs font-bold transition-all ${
        app.connected ? 'bg-[#efeffb] dark:bg-slate-800 text-[#181b2c] dark:text-white hover:bg-rose-50 hover:text-rose-600' : 'bg-[#6558f5] text-white hover:bg-[#5244e0]'
      }">${app.connected ? 'Configure / Disconnect' : 'Connect App'}</button>
    </div>`).join('');
}

export function toggleIntegration(idx) {
  const app = state.integrations[idx];
  app.connected = !app.connected;
  saveState();
  renderIntegrations();
  showToast(`${app.name} ${app.connected ? 'connected to workspace!' : 'disconnected.'}`);
}
