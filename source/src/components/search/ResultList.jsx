import { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { groupEntries } from '../../lib/search.js';

/**
 * Grouped, keyboard-friendly result list shared by the command palette and the top-bar search.
 * Selection is controlled by the parent via `activeIndex` (a flat index across all groups).
 */
export function ResultList({ entries, activeIndex, onSelect, onHover, listId }) {
  const groups = groupEntries(entries);

  useEffect(() => {
    document.getElementById(`${listId}-opt-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, listId]);

  return (
    <div className="results" role="listbox" id={listId}>
      {groups.map((group) => (
        <div key={group.type} role="group" aria-label={group.label}>
          <p className="results-group">{group.label}</p>
          {group.items.map(({ entry, index }) => {
            const Icon = entry.icon;
            const active = index === activeIndex;
            return (
              <button
                key={entry.id}
                id={`${listId}-opt-${index}`}
                type="button"
                role="option"
                aria-selected={active}
                tabIndex={-1}
                className={`result ${active ? 'is-active' : ''}`}
                onMouseMove={() => !active && onHover(index)}
                onClick={() => onSelect(entry)}
              >
                <span className="result-icon">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="result-text">
                  <span className="result-label truncate">{entry.label}</span>
                  <span className="result-hint truncate">{entry.hint}</span>
                </span>
                {entry.href && <ExternalLink size={14} className="result-external" aria-label="Opens in a new tab" />}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
