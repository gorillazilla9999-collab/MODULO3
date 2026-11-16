import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from '../../app/router.jsx';
import { useNotes } from '../../store/useNotes.js';
import { useBookmarks } from '../../store/useBookmarks.js';
import { useClickOutside } from '../../hooks/useClickOutside.js';
import { openEntry, searchEntries } from '../../lib/search.js';
import { ResultList } from './ResultList.jsx';

/** Top-bar search across pages, tools, notes and bookmarks. */
export function UniversalSearch() {
  const { navigate } = useRouter();
  const { notes } = useNotes();
  const { bookmarks } = useBookmarks();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();

  const results = useMemo(
    () => searchEntries(query, { scope: 'all', notes, bookmarks }),
    [query, notes, bookmarks],
  );
  const showPanel = open && query.trim().length > 0;

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(wrapRef, close, open);

  const choose = (entry) => {
    openEntry(entry, navigate);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === 'Enter' && showPanel && results[active]) {
      event.preventDefault();
      choose(results[active]);
    } else if (event.key === 'Escape') {
      if (query) setQuery('');
      else inputRef.current?.blur();
      setOpen(false);
    }
  };

  return (
    <div className="search" ref={wrapRef}>
      <Search size={16} className="search-icon" aria-hidden="true" />
      <input
        ref={inputRef}
        className="search-input"
        type="search"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-activedescendant={showPanel && results.length ? `${listId}-opt-${active}` : undefined}
        aria-label="Search pages, tools, notes and bookmarks"
        placeholder="Search pages, tools, notes…"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {showPanel && (
        <div className="popover search-panel">
          {results.length === 0 ? (
            <p className="results-empty">No results for “{query.trim()}”.</p>
          ) : (
            <ResultList entries={results} activeIndex={active} onSelect={choose} onHover={setActive} listId={listId} />
          )}
        </div>
      )}
    </div>
  );
}
