import { useState } from 'react';
import { NotebookPen, Pencil, Plus, Trash2, Check, X } from 'lucide-react';
import { useNotes } from '../store/useNotes.js';
import { Link } from '../app/router.jsx';
import { IconButton, Button } from '../components/ui/Button.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { MOD_KEY } from '../components/ui/Kbd.jsx';
import { formatRelative } from '../lib/format.js';

const VISIBLE = 4;

export default function QuickNotesWidget() {
  const { notes, create, update, remove } = useNotes();
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(null); // { id, text }

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    create({ body: text });
    setDraft('');
  };

  const saveEdit = () => {
    if (!editing) return;
    const text = editing.text.trim();
    if (text) update(editing.id, { body: text });
    setEditing(null);
  };

  const shown = notes.slice(0, VISIBLE);

  return (
    <div className="qn">
      <div className="qn-compose">
        <textarea
          className="textarea"
          rows={2}
          value={draft}
          placeholder="Jot something down…"
          aria-label="New quick note"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              addNote();
            }
          }}
        />
        <div className="qn-compose-row">
          <span className="qn-hint">{MOD_KEY}+Enter to save</span>
          <Button variant="primary" size="sm" icon={Plus} onClick={addNote} disabled={!draft.trim()}>
            Add note
          </Button>
        </div>
      </div>

      {shown.length === 0 ? (
        <EmptyState compact icon={NotebookPen} title="No notes yet" description="Write one above and it will show up here." />
      ) : (
        <ul className="qn-list">
          {shown.map((note) => {
            const isEditing = editing?.id === note.id;
            return (
              <li key={note.id} className="qn-item">
                {isEditing ? (
                  <div className="qn-edit">
                    <textarea
                      className="textarea"
                      rows={3}
                      autoFocus
                      value={editing.text}
                      aria-label="Edit note"
                      onChange={(e) => setEditing({ id: note.id, text: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') setEditing(null);
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') saveEdit();
                      }}
                    />
                    <div className="qn-item-actions is-visible">
                      <IconButton icon={Check} label="Save note" onClick={saveEdit} />
                      <IconButton icon={X} label="Cancel editing" onClick={() => setEditing(null)} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="qn-item-main">
                      {note.title.trim() && <p className="qn-item-title truncate">{note.title}</p>}
                      <p className="qn-item-text">{note.body || (note.title ? '' : 'Empty note')}</p>
                      <p className="qn-item-time">{formatRelative(note.updatedAt)}</p>
                    </div>
                    <div className="qn-item-actions">
                      <IconButton
                        icon={Pencil}
                        label="Edit note"
                        onClick={() => setEditing({ id: note.id, text: note.body })}
                      />
                      <IconButton icon={Trash2} label="Delete note" className="is-danger" onClick={() => remove(note.id)} />
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {notes.length > 0 && (
        <Link to="/notes" className="qn-footer">
          Open all notes ({notes.length})
        </Link>
      )}
    </div>
  );
}
