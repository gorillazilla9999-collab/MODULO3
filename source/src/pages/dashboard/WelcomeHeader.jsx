import { useNow } from '../../hooks/useNow.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { formatDateLong, formatTime, greetingFor } from '../../lib/format.js';

export function WelcomeHeader() {
  const now = useNow(1000);
  const { settings } = useSettings();
  const name = settings.displayName.trim();

  return (
    <header className="welcome">
      <h1 className="welcome-title">
        {greetingFor(now)}
        {name ? `, ${name}` : ''}
      </h1>
      <p className="welcome-meta">
        <span>{formatDateLong(now)}</span>
        <time className="welcome-time tabular" dateTime={now.toISOString()}>
          {formatTime(now, { use24h: settings.use24h, seconds: true })}
        </time>
      </p>
    </header>
  );
}
