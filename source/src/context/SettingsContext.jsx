import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { KEYS } from '../services/storage.js';
import { hexToRgb, isHex } from '../lib/color.js';

export const ACCENTS = [
  { id: 'emerald', name: 'Emerald', value: '#65C995' },
  { id: 'teal', name: 'Teal', value: '#5CC2B6' },
  { id: 'sky', name: 'Sky', value: '#7BA9DD' },
  { id: 'violet', name: 'Violet', value: '#A592DB' },
  { id: 'amber', name: 'Amber', value: '#D4B06A' },
  { id: 'rose', name: 'Rose', value: '#D98BA0' },
];

export const DEFAULT_SETTINGS = {
  displayName: '',
  accent: ACCENTS[0].value,
  density: 'comfortable',
  reduceMotion: false,
  use24h: false,
  sidebarCollapsed: false,
  sidebarRecents: false,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [stored, setStored] = useLocalStorage(KEYS.settings, DEFAULT_SETTINGS);

  const settings = useMemo(() => {
    const merged = { ...DEFAULT_SETTINGS, ...(stored && typeof stored === 'object' ? stored : {}) };
    if (!isHex(merged.accent)) merged.accent = DEFAULT_SETTINGS.accent;
    if (merged.density !== 'compact') merged.density = 'comfortable';
    return merged;
  }, [stored]);

  const update = useCallback(
    (patch) => setStored((current) => ({ ...DEFAULT_SETTINGS, ...(current || {}), ...patch })),
    [setStored],
  );

  // Apply appearance preferences to the document.
  useEffect(() => {
    const root = document.documentElement;
    const { r, g, b } = hexToRgb(settings.accent);
    root.style.setProperty('--accent', settings.accent);
    root.style.setProperty('--accent-rgb', `${r} ${g} ${b}`);
    root.dataset.density = settings.density;
    root.dataset.reduceMotion = String(settings.reduceMotion);
  }, [settings.accent, settings.density, settings.reduceMotion]);

  const value = useMemo(() => ({ settings, update }), [settings, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
