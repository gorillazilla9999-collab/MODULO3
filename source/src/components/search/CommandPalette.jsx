import { useId, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Kbd } from '../ui/Kbd.jsx';
import { ResultList } from './ResultList.jsx';
import { openEntry, searchEntries } from '../../lib/search.js';
import { useRouter } from '../../app/router.jsx';

function PaletteBody({ onClose }) {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();

  const results = useMemo(() => searchEntries(query, { scope: 'commands' }), [query]);

  const choose = (entry) => {
    onClose();
    openEntry(entry, navigate);
  };

  const onKeyDown = (event) => {
    if (!results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(results.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(results[active]);
    }
  };

  return (
    <div className="palette">
      <div className="palette-input-row">
        <Search size={18} aria-hidden="true" />
        <input
          className="palette-input"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results.length ? `${listId}-opt-${active}` : undefined}
          aria-label="Search pages and tools"
          placeholder="Search pages and tools…"
          autoComplete="off"
          spellCheck={false}
          data-autofocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />
        <Kbd>Esc</Kbd>
      </div>

      <div className="palette-body">
        {results.length === 0 ? (
          <p className="results-empty">No pages or tools match “{query.trim()}”.</p>
        ) : (
          <ResultList entries={results} activeIndex={active} onSelect={choose} onHover={setActive} listId={listId} />
        )}
      </div>

      <div className="palette-foot" aria-hidden="true">
        <span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> Navigate
        </span>
        <span>
          <Kbd>↵</Kbd> Open
        </span>
        <span>
          <Kbd>Esc</Kbd> Close
        </span>
      </div>
    </div>
  );
}

export function CommandPalette({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} label="Command palette" variant="palette">
      <PaletteBody onClose={onClose} />
    </Modal>
  );
}
