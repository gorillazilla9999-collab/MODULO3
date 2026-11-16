import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { KEYS } from '../services/storage.js';
import { createId } from '../lib/id.js';

/**
 * Notes data layer. Components use this hook only — in a later phase its
 * internals can call the API instead of localStorage.
 *
 * Note shape: { id, title, body, createdAt, updatedAt }
 */

const EMPTY = [];
const asArray = (value) => (Array.isArray(value) ? value : []);

export function noteLabel(note) {
  if (note.title.trim()) return note.title.trim();
  const firstLine = note.body.trim().split('\n')[0];
  return firstLine || 'Untitled note';
}

export function useNotes() {
  const [raw, setRaw] = useLocalStorage(KEYS.notes, EMPTY);

  const notes = useMemo(
    () => (Array.isArray(raw) ? [...raw].sort((a, b) => b.updatedAt - a.updatedAt) : EMPTY),
    [raw],
  );

  const create = useCallback(
    ({ title = '', body = '' } = {}) => {
      const now = Date.now();
      const note = { id: createId(), title, body, createdAt: now, updatedAt: now };
      setRaw((current) => [note, ...asArray(current)]);
      return note;
    },
    [setRaw],
  );

  const update = useCallback(
    (id, patch) =>
      setRaw((current) =>
        asArray(current).map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)),
      ),
    [setRaw],
  );

  const remove = useCallback(
    (id) => setRaw((current) => asArray(current).filter((n) => n.id !== id)),
    [setRaw],
  );

  return { notes, create, update, remove };
}
