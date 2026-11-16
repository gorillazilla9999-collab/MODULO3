import { Menu } from 'lucide-react';
import { Link } from '../../app/router.jsx';
import { IconButton } from '../ui/Button.jsx';
import { Kbd, MOD_KEY } from '../ui/Kbd.jsx';
import { UniversalSearch } from '../search/UniversalSearch.jsx';
import { NotificationsMenu } from './NotificationsMenu.jsx';
import { useNow } from '../../hooks/useNow.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { formatDateShort, initialsFor } from '../../lib/format.js';

export function Topbar({ onOpenMenu, onOpenPalette }) {
  const now = useNow(30_000);
  const { settings } = useSettings();
  const name = settings.displayName.trim();

  return (
    <header className="topbar">
      <IconButton className="topbar-menu" icon={Menu} label="Open menu" onClick={onOpenMenu} size={18} />

      <UniversalSearch />

      <div className="topbar-right">
        <time className="topbar-date" dateTime={now.toISOString()}>
          {formatDateShort(now)}
        </time>

        <button type="button" className="palette-trigger" onClick={onOpenPalette} aria-label="Open command palette">
          <Kbd>{MOD_KEY}</Kbd>
          <Kbd>K</Kbd>
        </button>

        <NotificationsMenu />

        <Link to="/settings" className="profile" aria-label="Profile and settings">
          <span className="avatar" aria-hidden="true">
            {initialsFor(name)}
          </span>
          <span className="profile-text">
            <span className="profile-name truncate">{name || 'Your workspace'}</span>
            <span className="profile-sub">Local profile</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
