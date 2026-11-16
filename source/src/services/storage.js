/**
 * Storage service — the single seam between the UI and persistence.
 *
 * Phase 1 persists to localStorage. In a later phase the `store/*` hooks can be
 * pointed at an API client (PostgreSQL-backed) without touching any component:
 * components only ever talk to those hooks, and the hooks only talk to this module.
 *
 * Values are cached in memory so every component reading the same key stays in sync
 * (including across browser tabs through the `storage` event).
 */

const PREFIX = 'modulo.';

export const KEYS = {
  settings: 'settings',
  notes: 'notes',
  tasks: 'tasks',
  bookmarks: 'bookmarks',
  layout: 'dashboard.layout',
  recentTools: 'recentTools',
  notifications: 'notifications',
  timer: 'timer',
  stopwatch: 'stopwatch',
};

const cache = new Map();
const listeners = new Map();

function readRaw(key) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    // Corrupt JSON or storage unavailable — fall back to the default value.
    return undefined;
  }
}

function emit(key) {
  const set = listeners.get(key);
  if (set) set.forEach((fn) => fn());
}

export const storage = {
  get(key, fallback) {
    if (!cache.has(key)) {
      const value = readRaw(key);
      cache.set(key, value === undefined ? fallback : value);
    }
    return cache.get(key);
  },

  set(key, value) {
    cache.set(key, value);
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      // Quota exceeded or private mode: keep working in memory for this session.
      console.warn(`MODULO: could not persist "${key}"`, error);
    }
    emit(key);
  },

  remove(key) {
    cache.delete(key);
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
    emit(key);
  },

  subscribe(key, fn) {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(fn);
    return () => listeners.get(key)?.delete(fn);
  },

  /** Every MODULO key currently saved in the browser. */
  keys() {
    try {
      return Object.keys(window.localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .map((k) => k.slice(PREFIX.length));
    } catch {
      return [];
    }
  },

  /** Remove all MODULO data from this browser. */
  clearAll() {
    this.keys().forEach((key) => {
      try {
        window.localStorage.removeItem(PREFIX + key);
      } catch {
        /* ignore */
      }
    });
    cache.clear();
  },

  /** Plain-object snapshot used by the data export. */
  exportAll() {
    const out = {};
    this.keys().forEach((key) => {
      out[key] = readRaw(key);
    });
    return out;
  },
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (!event.key || !event.key.startsWith(PREFIX)) return;
    const key = event.key.slice(PREFIX.length);
    cache.delete(key);
    emit(key);
  });
}
