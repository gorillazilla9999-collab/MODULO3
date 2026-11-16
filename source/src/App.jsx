import { useEffect, useState } from 'react';
import { RouterProvider, useRouter } from './app/router.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { NotificationsProvider } from './context/NotificationsContext.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { CommandPalette } from './components/search/CommandPalette.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { TOOLS, toolPath } from './config/tools.js';
import { useRecentTools } from './store/useRecentTools.js';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import ToolsPage from './pages/ToolsPage.jsx';
import ToolPage from './pages/ToolPage.jsx';
import NotesPage from './pages/NotesPage.jsx';
import BookmarksPage from './pages/BookmarksPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function Routes() {
  const { path } = useRouter();

  if (path === '/') return <DashboardPage />;
  if (path === '/tools') return <ToolsPage />;
  if (path === '/bookmarks') return <BookmarksPage />;
  if (path === '/settings') return <SettingsPage />;

  const tool = path.match(/^\/tools\/([^/]+)$/);
  if (tool) return <ToolPage id={decodeURIComponent(tool[1])} />;

  const notes = path.match(/^\/notes(?:\/([^/]+))?$/);
  if (notes) return <NotesPage noteId={notes[1] ? decodeURIComponent(notes[1]) : null} />;

  return <NotFoundPage />;
}

function AppContent() {
  const { path } = useRouter();
  const { visit } = useRecentTools();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Ctrl+K / Cmd+K toggles the command palette from anywhere.
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Remember tools as "recently used" whichever way they were opened (page, palette, search, back button).
  useEffect(() => {
    const tool = TOOLS.find((t) => t.status === 'ready' && toolPath(t) === path);
    if (tool) visit(tool.id);
  }, [path, visit]);

  return (
    <>
      <AppShell onOpenPalette={() => setPaletteOpen(true)}>
        <ErrorBoundary key={path} title="This page stopped working">
          <Routes />
        </ErrorBoundary>
      </AppShell>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <NotificationsProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </NotificationsProvider>
    </SettingsProvider>
  );
}
