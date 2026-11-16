import { useCallback, useSyncExternalStore } from 'react';
import { storage } from '../services/storage.js';

/**
 * Subscribe to a persisted value. `fallback` should be a module-level constant
 * (it is cached on first read, which keeps the snapshot referentially stable).
 */
export function useLocalStorage(key, fallback) {
  const subscribe = useCallback((callback) => storage.subscribe(key, callback), [key]);
  const value = useSyncExternalStore(subscribe, () => storage.get(key, fallback));

  const setValue = useCallback(
    (next) => {
      const current = storage.get(key, fallback);
      storage.set(key, typeof next === 'function' ? next(current) : next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, setValue];
}
