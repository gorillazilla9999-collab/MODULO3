import { useNow } from '../hooks/useNow.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { formatDateLong, formatTime } from '../lib/format.js';

export default function ClockWidget() {
  const now = useNow(1000);
  const { settings } = useSettings();
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const secondsIntoDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const dayPercent = Math.round((secondsIntoDay / 86400) * 100);

  return (
    <div className="clock">
      <time className="clock-time tabular" dateTime={now.toISOString()}>
        {formatTime(now, { use24h: settings.use24h, seconds: true })}
      </time>
      <p className="clock-date">{formatDateLong(now)}</p>
      <p className="clock-zone">{zone.replace(/_/g, ' ')}</p>

      <div className="clock-progress" role="img" aria-label={`${dayPercent}% of the day has passed`}>
        <div className="clock-progress-track">
          <div className="clock-progress-bar" style={{ width: `${dayPercent}%` }} />
        </div>
        <span className="clock-progress-label">{dayPercent}% of today</span>
      </div>
    </div>
  );
}
