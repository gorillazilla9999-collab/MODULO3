import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { KEYS } from '../services/storage.js';
import { createId } from '../lib/id.js';

/** Tasks data layer. Task shape: { id, text, done, createdAt } */

const EMPTY = [];
const asArray = (value) => (Array.isArray(value) ? value : []);

export function useTasks() {
  const [raw, setRaw] = useLocalStorage(KEYS.tasks, EMPTY);
  const tasks = useMemo(() => asArray(raw), [raw]);

  const add = useCallback(
    (text) => {
      const clean = text.trim();
      if (!clean) return false;
      setRaw((current) => [...asArray(current), { id: createId(), text: clean, done: false, createdAt: Date.now() }]);
      return true;
    },
    [setRaw],
  );

  const toggle = useCallback(
    (id) => setRaw((current) => asArray(current).map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    [setRaw],
  );

  const remove = useCallback(
    (id) => setRaw((current) => asArray(current).filter((t) => t.id !== id)),
    [setRaw],
  );

  const clearCompleted = useCallback(
    () => setRaw((current) => asArray(current).filter((t) => !t.done)),
    [setRaw],
  );

  return { tasks, add, toggle, remove, clearCompleted };
}
