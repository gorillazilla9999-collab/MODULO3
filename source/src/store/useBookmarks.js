import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { KEYS } from '../services/storage.js';
import { createId } from '../lib/id.js';
import { hostnameOf, normalizeUrl } from '../lib/url.js';

/** Bookmarks data layer. Bookmark shape: { id, title, url, createdAt } */

const EMPTY = [];
const asArray = (value) => (Array.isArray(value) ? value : []);

export function useBookmarks() {
  const [raw, setRaw] = useLocalStorage(KEYS.bookmarks, EMPTY);
  const bookmarks = useMemo(() => asArray(raw), [raw]);

  /** Returns `{ ok: true }` or `{ ok: false, error }` so forms can show a precise message. */
  const add = useCallback(
    ({ title, url }) => {
      const href = normalizeUrl(url);
      if (!href) {
        return { ok: false, error: 'Enter a valid web address, like example.com or https://example.com.' };
      }
      if (bookmarks.some((b) => b.url === href)) {
        return { ok: false, error: 'That website is already in your bookmarks.' };
      }
      const bookmark = {
        id: createId(),
        title: title.trim() || hostnameOf(href),
        url: href,
        createdAt: Date.now(),
      };
      setRaw((current) => [bookmark, ...asArray(current)]);
      return { ok: true };
    },
    [bookmarks, setRaw],
  );

  const remove = useCallback(
    (id) => setRaw((current) => asArray(current).filter((b) => b.id !== id)),
    [setRaw],
  );

  return { bookmarks, add, remove };
}
