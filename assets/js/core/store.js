import { seedState } from './seed.js';

// ponytail: single-file template persistence. Swap saveState/loadState
// for a fetch()-based API when a backend exists.
const STORE_KEY = 'noteflow.admin.v3';

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.user ? parsed : null;
  } catch (e) {
    return null;
  }
}

export let state = loadState() || seedState();

export function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    // storage full / private mode — keep running in-memory
  }
}

export function resetState() {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch (e) {
    // ignore
  }
  state = seedState();
}
