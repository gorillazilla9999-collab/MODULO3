import { useEffect, useRef, useState } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { useRouter } from '../../app/router.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';

/** Responsive frame: sidebar (collapsible on desktop, drawer on mobile) + top bar + scrolling content. */
export function AppShell({ children, onOpenPalette }) {
  const { path } = useRouter();
  const { settings } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef(null);

  // Close the drawer and return to the top whenever the page changes.
  useEffect(() => {
    setMobileOpen(false);
    contentRef.current?.scrollTo({ top: 0 });
  }, [path]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && setMobileOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <div className={`app ${settings.sidebarCollapsed ? 'is-collapsed' : ''}`}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} aria-hidden="true" />}

      <div className="app-main">
        <Topbar onOpenMenu={() => setMobileOpen(true)} onOpenPalette={onOpenPalette} />
        <main className="app-content" ref={contentRef}>
          {children}
        </main>
      </div>
    </div>
  );
}
