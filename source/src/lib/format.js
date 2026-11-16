/** Formatting helpers. Locale defaults to the browser's own. */

export function formatTime(date, { use24h = false, seconds = false } = {}) {
  return new Intl.DateTimeFormat(undefined, {
    hour: use24h ? '2-digit' : 'numeric',
    minute: '2-digit',
    ...(seconds ? { second: '2-digit' } : {}),
    hour12: !use24h,
  }).format(date);
}

export function formatDateLong(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatDateShort(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function formatRelative(timestamp, now = Date.now()) {
  const diff = Math.max(0, now - timestamp);
  const minute = 60_000;
  if (diff < minute) return 'Just now';
  if (diff < 60 * minute) return `${Math.floor(diff / minute)}m ago`;
  if (diff < 24 * 60 * minute) return `${Math.floor(diff / (60 * minute))}h ago`;
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' }).format(timestamp);
}

export function greetingFor(date) {
  const hour = date.getHours();
  if (hour < 5) return 'Still up';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function pad(n, size = 2) {
  return String(Math.floor(n)).padStart(size, '0');
}

/** 83_000 -> "01:23"; 3_700_000 -> "1:01:40" */
export function formatClock(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Stopwatch display with centiseconds: "01:23.45" or "1:01:23.45" */
export function formatStopwatch(ms) {
  const safe = Math.max(0, Math.floor(ms));
  const cs = Math.floor((safe % 1000) / 10);
  const totalSeconds = Math.floor(safe / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const base = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  return { main: base, fraction: pad(cs) };
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[i]}`;
}

export function initialsFor(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'M';
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}
