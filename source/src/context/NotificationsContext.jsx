import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { KEYS, storage } from '../services/storage.js';
import { createId } from '../lib/id.js';

const MAX_NOTIFICATIONS = 30;

const WELCOME = [
  {
    id: 'welcome',
    title: 'Welcome to MODULO',
    body: 'Your workspace is ready. Press Ctrl+K (⌘K on Mac) to jump to any page or tool.',
    createdAt: Date.now(),
    read: false,
  },
];

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [raw, setRaw] = useLocalStorage(KEYS.notifications, WELCOME);
  const notifications = useMemo(() => (Array.isArray(raw) ? raw : []), [raw]);

  // Save the welcome message on first run so its timestamp stays stable.
  useEffect(() => {
    if (!storage.keys().includes(KEYS.notifications)) storage.set(KEYS.notifications, WELCOME);
  }, []);

  const notify = useCallback(
    ({ title, body = '' }) => {
      const item = { id: createId(), title, body, createdAt: Date.now(), read: false };
      setRaw((current) => [item, ...(Array.isArray(current) ? current : [])].slice(0, MAX_NOTIFICATIONS));
    },
    [setRaw],
  );

  const markAllRead = useCallback(
    () => setRaw((current) => (Array.isArray(current) ? current : []).map((n) => ({ ...n, read: true }))),
    [setRaw],
  );

  const remove = useCallback(
    (id) => setRaw((current) => (Array.isArray(current) ? current : []).filter((n) => n.id !== id)),
    [setRaw],
  );

  const clear = useCallback(() => setRaw([]), [setRaw]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      notify,
      markAllRead,
      remove,
      clear,
    }),
    [notifications, notify, markAllRead, remove, clear],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return ctx;
}
