/** MODULO mark: a 2×2 module grid with one lit cell. */
export function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--elevated)" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="var(--border-strong)" />
      <rect x="7" y="7" width="8" height="8" rx="2" fill="var(--accent)" />
      <rect x="17" y="7" width="8" height="8" rx="2" fill="#2A332D" />
      <rect x="7" y="17" width="8" height="8" rx="2" fill="#2A332D" />
      <rect x="17" y="17" width="8" height="8" rx="2" fill="#3B4A41" />
    </svg>
  );
}

export function Logo({ collapsed = false }) {
  return (
    <span className="logo">
      <LogoMark />
      {!collapsed && <span className="logo-word">MODULO</span>}
    </span>
  );
}
