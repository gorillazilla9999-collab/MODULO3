export const IS_MAC =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);

export const MOD_KEY = IS_MAC ? '⌘' : 'Ctrl';

export function Kbd({ children }) {
  return <kbd className="kbd">{children}</kbd>;
}
