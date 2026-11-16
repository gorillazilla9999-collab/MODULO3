import { useMemo, useState } from 'react';
import { Bookmark, ExternalLink, Plus, SearchX, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader.jsx';
import { Button, IconButton } from '../components/ui/Button.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useBookmarks } from '../store/useBookmarks.js';
import { hostnameOf } from '../lib/url.js';

export default function BookmarksPage() {
  const { bookmarks, add, remove } = useBookmarks();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return bookmarks;
    return bookmarks.filter((b) => `${b.title} ${b.url}`.toLowerCase().includes(q));
  }, [bookmarks, filter]);

  const onSubmit = (event) => {
    event.preventDefault();
    const result = add({ title, url });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setUrl('');
    setTitle('');
    setError('');
  };

  return (
    <div className="page">
      <PageHeader title="Bookmarks" description="Websites you want one click away. Saved on this device." />

      <form className="card bookmark-form" onSubmit={onSubmit} noValidate>
        <label className="field bookmark-field-url">
          <span className="field-label">Website address</span>
          <input
            className="input"
            value={url}
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="example.com"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'bookmark-error' : undefined}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
          />
        </label>
        <label className="field bookmark-field-title">
          <span className="field-label">Title (optional)</span>
          <input className="input" value={title} maxLength={80} placeholder="Defaults to the site name" onChange={(e) => setTitle(e.target.value)} />
        </label>
        <Button type="submit" variant="primary" icon={Plus} disabled={!url.trim()}>
          Add bookmark
        </Button>
        {error && (
          <p className="field-error bookmark-error" id="bookmark-error" role="alert">
            {error}
          </p>
        )}
      </form>

      {bookmarks.length === 0 ? (
        <div className="card">
          <EmptyState icon={Bookmark} title="No bookmarks yet" description="Add a website above and it will appear here." />
        </div>
      ) : (
        <>
          <div className="toolbar">
            <p className="muted">
              {bookmarks.length} saved {bookmarks.length === 1 ? 'website' : 'websites'}
            </p>
            <input
              className="input toolbar-search"
              type="search"
              placeholder="Filter bookmarks…"
              aria-label="Filter bookmarks"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {visible.length === 0 ? (
            <div className="card">
              <EmptyState icon={SearchX} title="No matching bookmarks" description={`Nothing found for “${filter.trim()}”.`} />
            </div>
          ) : (
            <ul className="bookmark-grid">
              {visible.map((bookmark) => (
                <li key={bookmark.id} className="bookmark">
                  <a className="bookmark-link" href={bookmark.url} target="_blank" rel="noopener noreferrer">
                    <span className="bookmark-tile" aria-hidden="true">
                      {bookmark.title.charAt(0).toUpperCase()}
                    </span>
                    <span className="bookmark-text">
                      <span className="bookmark-title truncate">{bookmark.title}</span>
                      <span className="bookmark-host truncate">{hostnameOf(bookmark.url)}</span>
                    </span>
                    <ExternalLink size={14} className="bookmark-open" aria-label="Opens in a new tab" />
                  </a>
                  <IconButton icon={Trash2} label={`Delete bookmark: ${bookmark.title}`} className="is-danger" onClick={() => remove(bookmark.id)} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
