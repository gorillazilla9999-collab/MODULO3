import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useNotifications } from '../context/NotificationsContext.jsx';
import { KEYS } from '../services/storage.js';
import { formatClock } from '../lib/format.js';
import { chime } from '../lib/audio.js';
import { Button } from '../components/ui/Button.jsx';

const DEFAULT_TIMER = { duration: 5 * 60_000, remaining: 5 * 60_000, endAt: null, status: 'idle' };
const PRESETS = [1, 5, 10, 25];
const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function describe(ms) {
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  if (m && s) return `${m} min ${s} sec`;
  if (m) return `${m} min`;
  return `${s} sec`;
}

/**
 * Countdown timer. State lives in localStorage as timestamps (not a ticking counter),
 * so it keeps counting correctly through refreshes and page changes.
 */
export default function TimerWidget() {
  const [stored, setStored] = useLocalStorage(KEYS.timer, DEFAULT_TIMER);
  const { notify } = useNotifications();
  const [now, setNow] = useState(() => Date.now());
  const firedFor = useRef(null);

  const timer = { ...DEFAULT_TIMER, ...(stored && typeof stored === 'object' ? stored : {}) };
  const running = timer.status === 'running';
  const remaining = running ? Math.max(0, timer.endAt - now) : timer.remaining;
  const locked = running || timer.status === 'paused';

  useEffect(() => {
    if (!running) return undefined;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running || now < timer.endAt || firedFor.current === timer.endAt) return;
    firedFor.current = timer.endAt;
    setStored((t) => ({ ...t, status: 'done', remaining: 0, endAt: null }));
    notify({ title: 'Timer finished', body: `Your ${describe(timer.duration)} timer is up.` });
    chime();
  }, [now, running, timer.endAt, timer.duration, setStored, notify]);

  const minutes = Math.floor(timer.duration / 60_000);
  const seconds = Math.floor((timer.duration % 60_000) / 1000);

  const setDuration = (ms) => setStored({ ...DEFAULT_TIMER, duration: ms, remaining: ms, status: 'idle' });

  const onFieldChange = (field, raw) => {
    const value = Math.max(0, parseInt(raw, 10) || 0);
    const m = field === 'minutes' ? Math.min(value, 999) : minutes;
    const s = field === 'seconds' ? Math.min(value, 59) : seconds;
    setDuration((m * 60 + s) * 1000);
  };

  const start = () => {
    const base = timer.status === 'paused' ? timer.remaining : timer.duration;
    if (base <= 0) return;
    setNow(Date.now());
    setStored({ ...timer, status: 'running', endAt: Date.now() + base, remaining: base });
  };

  const pause = () => setStored({ ...timer, status: 'paused', remaining: Math.max(0, timer.endAt - Date.now()), endAt: null });
  const reset = () => setStored({ ...timer, status: 'idle', remaining: timer.duration, endAt: null });

  const progress = timer.duration > 0 ? remaining / timer.duration : 0;
  const done = timer.status === 'done';

  return (
    <div className="timer">
      <div className={`timer-ring ${done ? 'is-done' : ''}`}>
        <svg viewBox="0 0 120 120" className="timer-ring-svg" aria-hidden="true">
          <circle cx="60" cy="60" r={RADIUS} className="timer-ring-track" />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            className="timer-ring-bar"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <div className="timer-readout">
          <span className="timer-time tabular" role="timer" aria-live="off">
            {formatClock(remaining)}
          </span>
          <span className="timer-state">
            {done ? 'Time’s up' : running ? 'Running' : timer.status === 'paused' ? 'Paused' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="timer-controls">
        <div className="timer-fields">
          <label className="timer-field">
            <input
              className="input tabular"
              type="number"
              min="0"
              max="999"
              inputMode="numeric"
              value={minutes}
              disabled={locked}
              onChange={(e) => onFieldChange('minutes', e.target.value)}
            />
            <span>min</span>
          </label>
          <label className="timer-field">
            <input
              className="input tabular"
              type="number"
              min="0"
              max="59"
              inputMode="numeric"
              value={seconds}
              disabled={locked}
              onChange={(e) => onFieldChange('seconds', e.target.value)}
            />
            <span>sec</span>
          </label>
        </div>

        <div className="timer-presets" role="group" aria-label="Timer presets">
          {PRESETS.map((m) => (
            <button
              key={m}
              type="button"
              className={`chip ${!locked && timer.duration === m * 60_000 ? 'is-active' : ''}`}
              disabled={locked}
              onClick={() => setDuration(m * 60_000)}
            >
              {m} min
            </button>
          ))}
        </div>

        <div className="timer-actions">
          {running ? (
            <Button variant="primary" icon={Pause} onClick={pause}>
              Pause
            </Button>
          ) : (
            <Button variant="primary" icon={Play} onClick={start} disabled={timer.duration <= 0}>
              {timer.status === 'paused' ? 'Resume' : done ? 'Restart' : 'Start'}
            </Button>
          )}
          <Button icon={RotateCcw} onClick={reset} disabled={timer.status === 'idle'}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
