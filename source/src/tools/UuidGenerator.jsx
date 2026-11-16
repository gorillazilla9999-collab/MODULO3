import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { CopyButton } from '../components/ui/CopyButton.jsx';

export function uuidv4() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [ids, setIds] = useState([]);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    setIds(Array.from({ length: count }, uuidv4));
  }, [count, nonce]);

  const shown = ids.map((id) => (uppercase ? id.toUpperCase() : id));

  return (
    <div className="stack">
      <div className="row">
        <label className="field field-inline">
          <span className="field-label">How many</span>
          <input
            className="input tabular"
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1)))}
          />
        </label>
        <label className="check">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
          <span>Uppercase</span>
        </label>
      </div>

      <ul className="output-list">
        {shown.map((id, index) => (
          <li key={`${id}-${index}`}>
            <code>{id}</code>
          </li>
        ))}
      </ul>

      <div className="row">
        <Button variant="primary" icon={RefreshCw} onClick={() => setNonce((n) => n + 1)}>
          Generate new
        </Button>
        <CopyButton text={shown.join('\n')} label={count > 1 ? 'Copy all' : 'Copy'} size="md" />
      </div>
    </div>
  );
}
