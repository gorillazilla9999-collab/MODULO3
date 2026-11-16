import { useMemo, useState } from 'react';
import { CopyButton } from '../components/ui/CopyButton.jsx';

const words = (text) =>
  text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

const capital = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

export const MODES = [
  { id: 'upper', label: 'UPPERCASE', run: (t) => t.toUpperCase() },
  { id: 'lower', label: 'lowercase', run: (t) => t.toLowerCase() },
  {
    id: 'title',
    label: 'Title Case',
    run: (t) => t.toLowerCase().replace(/(^|[\s\-_("“])(\p{L})/gu, (_, lead, ch) => lead + ch.toUpperCase()),
  },
  {
    id: 'sentence',
    label: 'Sentence case',
    run: (t) => t.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, lead, ch) => lead + ch.toUpperCase()),
  },
  {
    id: 'camel',
    label: 'camelCase',
    run: (t) => words(t).map((w, i) => (i === 0 ? w.toLowerCase() : capital(w))).join(''),
  },
  { id: 'snake', label: 'snake_case', run: (t) => words(t).map((w) => w.toLowerCase()).join('_') },
  { id: 'kebab', label: 'kebab-case', run: (t) => words(t).map((w) => w.toLowerCase()).join('-') },
];

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [modeId, setModeId] = useState('title');

  const output = useMemo(() => MODES.find((m) => m.id === modeId).run(text), [text, modeId]);

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">Your text</span>
        <textarea
          className="textarea"
          rows={5}
          value={text}
          placeholder="Type or paste text to convert."
          onChange={(e) => setText(e.target.value)}
        />
      </label>

      <div className="chip-row" role="radiogroup" aria-label="Case style">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={mode.id === modeId}
            className={`chip ${mode.id === modeId ? 'is-active' : ''}`}
            onClick={() => setModeId(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <label className="field">
        <span className="field-label">Result</span>
        <textarea className="textarea" rows={5} value={output} readOnly placeholder="Converted text appears here." />
      </label>
      <div className="row">
        <CopyButton text={output} label="Copy result" size="md" />
      </div>
    </div>
  );
}
