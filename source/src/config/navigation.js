import { Bookmark, House, Settings, StickyNote, Wrench } from 'lucide-react';

/** Top-level pages. Drives the sidebar, command palette and universal search. */
export const PAGES = [
  { id: 'home', label: 'Home', to: '/', icon: House, description: 'Your dashboard', keywords: 'dashboard workspace widgets' },
  { id: 'tools', label: 'Tools', to: '/tools', icon: Wrench, description: 'Browse every tool', keywords: 'library utilities' },
  { id: 'notes', label: 'Notes', to: '/notes', icon: StickyNote, description: 'Write and search notes', keywords: 'write memo' },
  { id: 'bookmarks', label: 'Bookmarks', to: '/bookmarks', icon: Bookmark, description: 'Saved websites', keywords: 'links urls favourites' },
  { id: 'settings', label: 'Settings', to: '/settings', icon: Settings, description: 'Appearance and data', keywords: 'preferences accent theme reset' },
];

export const PRIMARY_PAGES = PAGES.filter((p) => p.id !== 'settings');
export const SETTINGS_PAGE = PAGES.find((p) => p.id === 'settings');
