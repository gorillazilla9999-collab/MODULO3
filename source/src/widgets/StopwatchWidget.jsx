import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { KEYS } from '../services/storage.js';
import { formatStopwatch } from '../lib/format.js';
import { Button } from '../components/ui/Button.jsx';

const DEFAULT_STOPWATCH = { elapsed: 0, startedAt: null, running: false };

/** Stopwatch. Stores timestamps, so it survives refreshes and navigation while running. */
export default function StopwatchWidget() {
  const [stored, setStored] = useLocalStorage(KEYS.stopwatch, DEFAULT_STOPWATCH);
  const [now, setNow] = useState(() => Date.now());

  const sw = { ...DEFAULT_STOPWATCH, ...(stored && typeof stored === 'object' ? stored : {}) };

  useEffect(() => {
    if (!sw.running) return undefined;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 50);
    return () => window.clearInterval(id);
  }, [sw.running]);

  const total = sw.elapsed + (sw.running ? Math.max(0, now - sw.startedAt) : 0);
  const { main, fraction } = formatStopwatch(total);

  const start = () => setStored({ ...sw, running: true, startedAt: Date.now() });
  const pause = () => setStored({ elapsed: total, startedAt: null, running: false });
  const reset = () => setStored(DEFAULT_STOPWATCH);

  return (
    <div className="stopwatch">
      <p className="stopwatch-readout tabular" role="timer" aria-live="off">
        <span>{main}</span>
        <span className="stopwatch-fraction">.{fraction}</span>
      </p>
      <p className="stopwatch-state">{sw.running ? 'Running' : total > 0 ? 'Paused' : 'Ready'}</p>
      <div className="stopwatch-actions">
        {sw.running ? (
          <Button variant="primary" icon={Pause} onClick={pause}>
            Pause
          </Button>
        ) : (
          <Button variant="primary" icon={Play} onClick={start}>
            {total > 0 ? 'Resume' : 'Start'}
          </Button>
        )}
        <Button icon={RotateCcw} onClick={reset} disabled={total === 0 && !sw.running}>
          Reset
        </Button>
      </div>
    </div>
  );
}
