import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { CopyButton } from '../components/ui/CopyButton.jsx';
import { Switch } from '../components/ui/Switch.jsx';

const SETS = {
  lower: 'abcdefghijkmnopqrstuvwxyz',
  upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  digits: '23456789',
  symbols: '!@#$%^&*()-_=+[]{}?',
};

/** Uniform random integer in [0, max) using rejection sampling (no modulo bias). */
function randomInt(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);
  return buffer[0] % max;
}

export function generatePassword({ length, lower, upper, digits, symbols }) {
  const enabled = Object.entries({ lower, upper, digits, symbols })
    .filter(([, on]) => on)
    .map(([key]) => SETS[key]);
  if (enabled.length === 0) return '';

  const pool = enabled.join('');
  // Guarantee at least one character from every enabled set, then fill the rest.
  const chars = enabled.map((set) => set[randomInt(set.length)]);
  while (chars.length < length) chars.push(pool[randomInt(pool.length)]);
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function strength(options) {
  const size = Object.entries(SETS).reduce((sum, [key, set]) => sum + (options[key] ? set.length : 0), 0);
  if (size === 0) return { label: 'Choose at least one character type', level: 0 };
  const bits = options.length * Math.log2(size);
  if (bits < 50) return { label: 'Weak', level: 1 };
  if (bits < 75) return { label: 'Fair', level: 2 };
  if (bits < 100) return { label: 'Strong', level: 3 };
  return { label: 'Excellent', level: 4 };
}

export default function PasswordGenerator() {
  const [options, setOptions] = useState({ length: 20, lower: true, upper: true, digits: true, symbols: true });
  const [password, setPassword] = useState('');
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    setPassword(generatePassword(options));
  }, [options, nonce]);

  const set = (patch) => setOptions((current) => ({ ...current, ...patch }));
  const rating = strength(options);

  // Keep at least one character type on.
  const toggle = (key) => (value) => {
    const next = { ...options, [key]: value };
    if (!next.lower && !next.upper && !next.digits && !next.symbols) return;
    setOptions(next);
  };

  return (
    <div className="stack">
      <div className="output-box">
        <code className="output-text" aria-live="polite">
          {password || '—'}
        </code>
      </div>

      <div className="meter" aria-label={`Strength: ${rating.label}`}>
        {[1, 2, 3, 4].map((level) => (
          <span key={level} className={`meter-seg ${rating.level >= level ? `is-on level-${rating.level}` : ''}`} />
        ))}
        <span className="meter-label">{rating.label}</span>
      </div>

      <div className="row">
        <Button variant="primary" icon={RefreshCw} onClick={() => setNonce((n) => n + 1)}>
          Generate new
        </Button>
        <CopyButton text={password} label="Copy password" size="md" />
      </div>

      <label className="field">
        <span className="field-label">
          Length <strong className="tabular">{options.length}</strong>
        </span>
        <input
          type="range"
          className="range"
          min="8"
          max="64"
          value={options.length}
          onChange={(e) => set({ length: Number(e.target.value) })}
        />
      </label>

      <div className="switch-list">
        <Switch id="pw-lower" label="Lowercase letters" checked={options.lower} onChange={toggle('lower')} />
        <Switch id="pw-upper" label="Uppercase letters" checked={options.upper} onChange={toggle('upper')} />
        <Switch id="pw-digits" label="Numbers" checked={options.digits} onChange={toggle('digits')} />
        <Switch id="pw-symbols" label="Symbols" checked={options.symbols} onChange={toggle('symbols')} />
      </div>
      <p className="tool-note">Passwords are generated in your browser and never leave your device. Look-alike characters (0, O, 1, l, I) are left out.</p>
    </div>
  );
}
