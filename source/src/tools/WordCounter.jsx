import { useMemo, useState } from 'react';

export function analyse(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).filter((s) => s.trim()).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  return {
    words,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    sentences,
    paragraphs,
    readingMinutes: words / 200,
  };
}

function readingTime(minutes) {
  if (minutes === 0) return '0 sec';
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`;
  return `${Math.round(minutes)} min`;
}

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => analyse(text), [text]);

  const items = [
    ['Words', stats.words],
    ['Characters', stats.characters],
    ['No spaces', stats.charactersNoSpaces],
    ['Sentences', stats.sentences],
    ['Paragraphs', stats.paragraphs],
    ['Reading time', readingTime(stats.readingMinutes)],
  ];

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">Your text</span>
        <textarea
          className="textarea textarea-lg"
          rows={9}
          value={text}
          placeholder="Type or paste text to count it."
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <dl className="stat-grid">
        {items.map(([label, value]) => (
          <div key={label} className="stat">
            <dt>{label}</dt>
            <dd className="tabular">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
