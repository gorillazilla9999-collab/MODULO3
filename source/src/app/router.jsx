import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Tiny hash router. Hash routing needs no server configuration, so the built app
 * works on GitHub Pages and any static host. Swap for React Router later if needed —
 * `Link`, `useRouter` and `navigate` are the only entry points components use.
 */

const RouterContext = createContext(null);

function readPath() {
  const hash = window.location.hash.replace(/^#/, '');
  const path = hash.split('?')[0];
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const onChange = () => setPath(readPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to) => {
    if (readPath() === to) {
      setPath(to);
      return;
    }
    window.location.hash = to;
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>');
  return ctx;
}

export function isActivePath(current, to) {
  if (to === '/') return current === '/';
  return current === to || current.startsWith(`${to}/`);
}

export function Link({ to, className = '', activeClassName = '', children, ...rest }) {
  const { path } = useRouter();
  const active = isActivePath(path, to);
  return (
    <a
      href={`#${to}`}
      className={[className, active ? activeClassName : ''].filter(Boolean).join(' ')}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
