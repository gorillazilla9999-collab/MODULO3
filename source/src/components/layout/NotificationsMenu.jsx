import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext.jsx';
import { useClickOutside } from '../../hooks/useClickOutside.js';
import { formatRelative } from '../../lib/format.js';
import { EmptyState } from '../ui/EmptyState.jsx';

export function NotificationsMenu() {
  const { notifications, unreadCount, markAllRead, remove, clear } = useNotifications();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(wrapRef, close, open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="popover-wrap" ref={wrapRef}>
      <button
        type="button"
        className="icon-btn topbar-icon"
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && <span className="notif-dot" aria-hidden="true" />}
      </button>

      {open && (
        <div className="popover notif" role="dialog" aria-label="Notifications">
          <div className="popover-head">
            <h2 className="popover-title">Notifications</h2>
            <div className="popover-actions">
              <button type="button" className="link-btn" onClick={markAllRead} disabled={unreadCount === 0}>
                Mark all read
              </button>
              <button type="button" className="link-btn" onClick={clear} disabled={notifications.length === 0}>
                Clear all
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <EmptyState compact icon={BellOff} title="You’re all caught up" description="Timer alerts and updates will appear here." />
          ) : (
            <ul className="notif-list">
              {notifications.map((n) => (
                <li key={n.id} className={`notif-item ${n.read ? '' : 'is-unread'}`}>
                  <div className="notif-text">
                    <p className="notif-title">{n.title}</p>
                    {n.body && <p className="notif-body">{n.body}</p>}
                    <p className="notif-time">{formatRelative(n.createdAt)}</p>
                  </div>
                  <button type="button" className="icon-btn" aria-label={`Dismiss: ${n.title}`} onClick={() => remove(n.id)}>
                    <X size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
