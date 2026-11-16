import { Bookmark, StickyNote } from 'lucide-react';
import { PAGES } from '../config/navigation.js';
import { READY_TOOLS, toolPath } from '../config/tools.js';
import { noteLabel } from '../store/useNotes.js';
import { hostnameOf } from './url.js';

export const GROUP_LABELS = { page: 'Pages', tool: 'Tools', note: 'Notes', bookmark: 'Bookmarks' };
const GROUP_ORDER = ['page', 'tool', 'note', 'bookmark'];
const PER_DATA_GROUP = 5;

/** Pages and implemented tools — the entries the command palette can open. */
const COMMANDS = [
  ...PAGES.map((p) => ({
    id: `page:${p.id}`,
    type: 'page',
    label: p.label,
    hint: p.description,
    icon: p.icon,
    to: p.to,
    keywords: p.keywords,
  })),
  ...READY_TOOLS.map((t) => ({
    id: `tool:${t.id}`,
    type: 'tool',
    label: t.name,
    hint: t.category,
    icon: t.icon,
    to: toolPath(t),
    keywords: `${t.keywords || ''} ${t.description}`,
  })),
];

function score(query, entry) {
  const label = entry.label.toLowerCase();
  if (label === query) return 100;
  if (label.startsWith(query)) return 80;
  if (label.split(/\s+/).some((word) => word.startsWith(query))) return 60;
  if (label.includes(query)) return 40;
  if ((entry.keywords || '').toLowerCase().includes(query)) return 20;
  return 0;
}

/**
 * scope 'commands' → pages + tools (command palette; all of them when the query is empty).
 * scope 'all'      → also notes and bookmarks (top-bar search; nothing when the query is empty).
 */
export function searchEntries(query, { scope = 'commands', notes = [], bookmarks = [] } = {}) {
  const q = query.trim().toLowerCase();
  let entries = [...COMMANDS];

  if (scope === 'all') {
    entries = entries.concat(
      notes.map((n) => ({
        id: `note:${n.id}`,
        type: 'note',
        label: noteLabel(n),
        hint: n.body.trim().replace(/\s+/g, ' ').slice(0, 60) || 'Note',
        icon: StickyNote,
        to: `/notes/${n.id}`,
        keywords: `${n.title} ${n.body}`,
      })),
      bookmarks.map((b) => ({
        id: `bookmark:${b.id}`,
        type: 'bookmark',
        label: b.title,
        hint: hostnameOf(b.url),
        icon: Bookmark,
        href: b.url,
        keywords: b.url,
      })),
    );
  }

  if (!q) return scope === 'all' ? [] : entries;

  const ranked = entries
    .map((entry) => ({ entry, s: score(q, entry) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => GROUP_ORDER.indexOf(a.entry.type) - GROUP_ORDER.indexOf(b.entry.type) || b.s - a.s)
    .map((x) => x.entry);

  const counts = {};
  return ranked.filter((entry) => {
    if (entry.type === 'note' || entry.type === 'bookmark') {
      counts[entry.type] = (counts[entry.type] || 0) + 1;
      return counts[entry.type] <= PER_DATA_GROUP;
    }
    return true;
  });
}

/** Splits a flat, ordered list into labelled groups while keeping each entry's flat index. */
export function groupEntries(entries) {
  const groups = [];
  entries.forEach((entry, index) => {
    let group = groups[groups.length - 1];
    if (!group || group.type !== entry.type) {
      group = { type: entry.type, label: GROUP_LABELS[entry.type], items: [] };
      groups.push(group);
    }
    group.items.push({ entry, index });
  });
  return groups;
}

export function openEntry(entry, navigate) {
  if (entry.href) {
    window.open(entry.href, '_blank', 'noopener,noreferrer');
  } else {
    navigate(entry.to);
  }
}
