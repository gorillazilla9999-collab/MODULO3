import { useMemo, useState } from 'react';
import { ArrowLeft, FileText, Plus, Search, SearchX, StickyNote, Trash2 } from 'lucide-react';
import { Link, useRouter } from '../app/router.jsx';
import { PageHeader } from '../components/ui/PageHeader.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { noteLabel, useNotes } from '../store/useNotes.js';
import { formatRelative } from '../lib/format.js';

function NoteEditor({ note, onChange, onDelete }) {
  return (
    <div className="note-editor">
      <div className="note-editor-bar">
        <Link to="/notes" className="back-link note-back">
          <ArrowLeft size={14} aria-hidden="true" />
          All notes
        </Link>
        <span className="note-meta">
          Edited {formatRelative(note.updatedAt).toLowerCase()} · {note.body.length.toLocaleString()} characters
        </span>
        <Button variant="ghost" size="sm" icon={Trash2} onClick={onDelete}>
          Delete
        </Button>
      </div>
      <input
        className="note-title-input"
        value={note.title}
        placeholder="Title"
        aria-label="Note title"
        maxLength={120}
        autoFocus={!note.title && !note.body}
        onChange={(e) => onChange({ title: e.target.value })}
      />
      <textarea
        className="note-body-input"
        value={note.body}
        placeholder="Start writing…"
        aria-label="Note body"
        onChange={(e) => onChange({ body: e.target.value })}
      />
    </div>
  );
}

export default function NotesPage({ noteId }) {
  const { notes, create, update, remove } = useNotes();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => `${n.title}\n${n.body}`.toLowerCase().includes(q));
  }, [notes, query]);

  const selected = notes.find((n) => n.id === noteId) || null;

  const createNote = () => {
    // Reuse a blank note instead of piling up empty ones.
    const blank = notes.find((n) => !n.title.trim() && !n.body.trim());
    const note = blank || create();
    setQuery('');
    navigate(`/notes/${note.id}`);
  };

  const deleteSelected = () => {
    remove(selected.id);
    setConfirmDelete(false);
    navigate('/notes');
  };

  let editor;
  if (selected) {
    editor = <NoteEditor key={selected.id} note={selected} onChange={(patch) => update(selected.id, patch)} onDelete={() => setConfirmDelete(true)} />;
  } else if (noteId) {
    editor = (
      <EmptyState
        icon={FileText}
        title="That note no longer exists"
        description="It may have been deleted. Pick another note or start a new one."
        action={
          <Button variant="primary" icon={Plus} onClick={createNote}>
            New note
          </Button>
        }
      />
    );
  } else {
    editor = <EmptyState icon={FileText} title="Select a note" description="Choose a note from the list, or start a new one." />;
  }

  return (
    <div className="page page-fill">
      <PageHeader
        title="Notes"
        description="Everything you write is saved on this device."
        actions={
          <Button variant="primary" icon={Plus} onClick={createNote}>
            New note
          </Button>
        }
      />

      <div className={`notes-layout ${noteId ? 'has-selection' : ''}`}>
        <aside className="card notes-list-panel" aria-label="Notes list">
          <div className="notes-search">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder="Search notes…"
              aria-label="Search notes"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {notes.length === 0 ? (
            <EmptyState
              compact
              icon={StickyNote}
              title="No notes yet"
              description="Capture ideas, plans and snippets."
              action={
                <Button variant="primary" size="sm" icon={Plus} onClick={createNote}>
                  Create your first note
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState compact icon={SearchX} title="No matching notes" description={`Nothing found for “${query.trim()}”.`} />
          ) : (
            <ul className="notes-list">
              {filtered.map((note) => (
                <li key={note.id}>
                  <Link to={`/notes/${note.id}`} className="note-row" activeClassName="is-active">
                    <span className="note-row-title truncate">{noteLabel(note)}</span>
                    <span className="note-row-snippet truncate">
                      {note.title.trim() ? note.body.trim().replace(/\s+/g, ' ') || 'No additional text' : note.body.trim().split('\n').slice(1).join(' ') || 'No additional text'}
                    </span>
                    <span className="note-row-time">{formatRelative(note.updatedAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="card notes-editor-panel" aria-label="Note editor">
          {editor}
        </section>
      </div>

      <ConfirmDialog
        open={confirmDelete && Boolean(selected)}
        title="Delete this note?"
        message="This permanently removes the note from this device."
        confirmLabel="Delete note"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={deleteSelected}
      />
    </div>
  );
}
