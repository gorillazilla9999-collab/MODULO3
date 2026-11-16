import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { KEYS } from '../services/storage.js';
import { DEFAULT_LAYOUT, WIDGET_BY_TYPE } from '../config/widgets.js';

/** Keeps only known, unique widget types so old or corrupt saved layouts can't break the page. */
function sanitize(raw) {
  if (!Array.isArray(raw)) return DEFAULT_LAYOUT;
  const seen = new Set();
  return raw.filter((type) => WIDGET_BY_TYPE[type] && !seen.has(type) && seen.add(type));
}

/** Dashboard layout: an ordered list of widget types, persisted locally. */
export function useDashboardLayout() {
  const [raw, setRaw] = useLocalStorage(KEYS.layout, DEFAULT_LAYOUT);
  const layout = useMemo(() => sanitize(raw), [raw]);

  const add = useCallback(
    (type) =>
      setRaw((current) => {
        const list = sanitize(current);
        return list.includes(type) || !WIDGET_BY_TYPE[type] ? list : [...list, type];
      }),
    [setRaw],
  );

  const remove = useCallback((type) => setRaw((current) => sanitize(current).filter((t) => t !== type)), [setRaw]);

  /** Move `fromType` into the slot currently held by `toType` (drag and drop). */
  const reorder = useCallback(
    (fromType, toType) =>
      setRaw((current) => {
        const list = [...sanitize(current)];
        const from = list.indexOf(fromType);
        const to = list.indexOf(toType);
        if (from < 0 || to < 0 || from === to) return list;
        list.splice(to, 0, list.splice(from, 1)[0]);
        return list;
      }),
    [setRaw],
  );

  /** Move one widget earlier (-1) or later (+1) — the keyboard and touch alternative to dragging. */
  const nudge = useCallback(
    (type, delta) =>
      setRaw((current) => {
        const list = [...sanitize(current)];
        const from = list.indexOf(type);
        const to = from + delta;
        if (from < 0 || to < 0 || to >= list.length) return list;
        list.splice(to, 0, list.splice(from, 1)[0]);
        return list;
      }),
    [setRaw],
  );

  const reset = useCallback(() => setRaw([...DEFAULT_LAYOUT]), [setRaw]);

  return { layout, add, remove, reorder, nudge, reset };
}
