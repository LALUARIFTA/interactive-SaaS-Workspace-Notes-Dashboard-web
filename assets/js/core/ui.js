export const $ = (id) => document.getElementById(id);

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

export function openModal(title, htmlContent) {
  $('modal-title').textContent = title;
  $('modal-body').innerHTML = htmlContent;
  const backdrop = $('modal-backdrop');
  backdrop.classList.remove('hidden');
  backdrop.classList.add('flex');
}

export function closeModal() {
  const backdrop = $('modal-backdrop');
  backdrop.classList.add('hidden');
  backdrop.classList.remove('flex');
}

export function showToast(message) {
  const container = $('toast-container');
  const toast = document.createElement('div');
  toast.className = 'bg-[#181b2c] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-stagger-1 pointer-events-auto';
  toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#68cfa3]"></span><span>${esc(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}
