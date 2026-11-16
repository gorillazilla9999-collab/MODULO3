import { Database, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Link } from '../../app/router.jsx';
import { Logo } from '../ui/Logo.jsx';
import { IconButton } from '../ui/Button.jsx';
import { PRIMARY_PAGES, SETTINGS_PAGE } from '../../config/navigation.js';
import { getTool, toolPath } from '../../config/tools.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useRecentTools } from '../../store/useRecentTools.js';

function NavItem({ page }) {
  const Icon = page.icon;
  return (
    <Link to={page.to} className="nav-item" activeClassName="is-active" data-tooltip={page.label}>
      <Icon size={18} aria-hidden="true" />
      <span className="nav-label">{page.label}</span>
    </Link>
  );
}

export function Sidebar({ mobileOpen, onClose }) {
  const { settings, update } = useSettings();
  const { recent } = useRecentTools();
  const collapsed = settings.sidebarCollapsed;

  const recentTools = recent
    .map(getTool)
    .filter((tool) => tool && tool.status === 'ready')
    .slice(0, 4);

  return (
    <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`} aria-label="Sidebar">
      <div className="sidebar-head">
        <Link to="/" className="sidebar-brand" aria-label="MODULO — go to Home">
          <Logo />
        </Link>
        <IconButton className="sidebar-close" icon={X} label="Close menu" onClick={onClose} />
      </div>

      <nav className="nav" aria-label="Main">
        {PRIMARY_PAGES.map((page) => (
          <NavItem key={page.id} page={page} />
        ))}
      </nav>

      {settings.sidebarRecents && recentTools.length > 0 && (
        <div className="nav-recents">
          <p className="nav-heading">Recent tools</p>
          {recentTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} to={toolPath(tool)} className="nav-sub" activeClassName="is-active">
                <Icon size={14} aria-hidden="true" />
                <span className="truncate">{tool.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      <div className="sidebar-foot">
        <NavItem page={SETTINGS_PAGE} />
        <button
          type="button"
          className="nav-item nav-collapse"
          data-tooltip={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-pressed={collapsed}
          onClick={() => update({ sidebarCollapsed: !collapsed })}
        >
          {collapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
          <span className="nav-label">Collapse</span>
        </button>
        <p className="sidebar-note">
          <Database size={12} aria-hidden="true" />
          <span>Saved on this device</span>
        </p>
      </div>
    </aside>
  );
}
