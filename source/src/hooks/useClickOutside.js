import { useEffect } from 'react';

/** Calls `handler` when a pointer press happens outside `ref` (only while `active`). */
export function useClickOutside(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return undefined;
    const onPress = (event) => {
      if (ref.current && !ref.current.contains(event.target)) handler(event);
    };
    document.addEventListener('pointerdown', onPress);
    return () => document.removeEventListener('pointerdown', onPress);
  }, [ref, handler, active]);
}
