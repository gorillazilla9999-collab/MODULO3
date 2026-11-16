import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { KEYS } from '../services/storage.js';

const EMPTY = [];
const MAX_RECENT = 6;

/** Tracks the ids of recently opened tools, most recent first. */
export function useRecentTools() {
  const [raw, setRaw] = useLocalStorage(KEYS.recentTools, EMPTY);
  const recent = useMemo(() => (Array.isArray(raw) ? raw : EMPTY), [raw]);

  const visit = useCallback(
    (id) =>
      setRaw((current) => {
        const list = Array.isArray(current) ? current : [];
        if (list[0] === id) return list;
        return [id, ...list.filter((x) => x !== id)].slice(0, MAX_RECENT);
      }),
    [setRaw],
  );

  return { recent, visit };
}
