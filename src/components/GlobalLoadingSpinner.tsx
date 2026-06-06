'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useIsFetching } from '@tanstack/react-query';
import YahshuaLoadingLogo from './YahshuaLoadingLogo';
import useNetworkStatus from '@/hooks/useNetworkStatus';

// ─── Module-level singleton patch ────────────────────────────────────────────
// Applied once at module load. Never inside component lifecycle.
// Components add/remove callbacks; the patch itself is permanent for the session.
// This eliminates recursive wrapper chains and cleanup-order races.

const PATCHED = Symbol('yahshua_nav_spinner_patched');
const NAV_START_EVENT = 'yahshua:navigation-start';
const RECENT_NAV_WINDOW_MS = 2000;
const HIDE_DELAY_MS = 120;

type NavHandler = (url: string | URL | null | undefined) => void;
const navHandlers = new Set<NavHandler>();

const toPathname = (url: string | URL | null | undefined): string | null => {
  if (!url) return null;
  try {
    return new URL(String(url), location.href).pathname;
  } catch {
    return null;
  }
};

if (typeof window !== 'undefined' && !(history.pushState as any)[PATCHED]) {
  const origPush = history.pushState.bind(history);
  const origReplace = history.replaceState.bind(history);

  const patchedPush = function (state: unknown, unused: string, url?: string | URL | null) {
    navHandlers.forEach(h => h(url));
    return origPush(state as any, unused, url);
  };
  (patchedPush as any)[PATCHED] = true;

  const patchedReplace = function (state: unknown, unused: string, url?: string | URL | null) {
    navHandlers.forEach(h => h(url));
    return origReplace(state as any, unused, url);
  };
  (patchedReplace as any)[PATCHED] = true;

  history.pushState = patchedPush as typeof history.pushState;
  history.replaceState = patchedReplace as typeof history.replaceState;
}
// ─────────────────────────────────────────────────────────────────────────────

const GlobalLoadingSpinner = () => {
  const pathname = usePathname();
  const isFetching = useIsFetching() > 0;
  const isOnline = useNetworkStatus();
  const [visible, setVisible] = useState(false);

  const lastNavClickRef = useRef<number | null>(null);
  const prevPathRef = useRef<string | null>(null);
  const suppressNextNavRef = useRef(false);
  const prevSettledPathnameRef = useRef<string | null>(null);

  const hideSpinner = () => {
    setVisible(false);
    lastNavClickRef.current = null;
  };

  const startSpinner = () => {
    suppressNextNavRef.current = false;
    setVisible(true);
    lastNavClickRef.current = Date.now();
  };

  const shouldSuppressForPath = (pathnameToCheck: string) => {
    return pathnameToCheck === prevSettledPathnameRef.current;
  };

  const handleUpcomingNavigation = (pathnameToCheck: string) => {
    if (pathnameToCheck === location.pathname) return;

    if (suppressNextNavRef.current) {
      // Consumed — next navigation may show spinner normally.
      suppressNextNavRef.current = false;
      return;
    }

    if (shouldSuppressForPath(pathnameToCheck)) {
      suppressNextNavRef.current = true;
      hideSpinner();
      return;
    }

    startSpinner();
  };

  // Register with module-level singleton — no history patching here
  useEffect(() => {
    const handler: NavHandler = (url) => {
      const pathnameToCheck = toPathname(url);
      if (!pathnameToCheck) return;
      handleUpcomingNavigation(pathnameToCheck);
    };
    navHandlers.add(handler);
    return () => { navHandlers.delete(handler); };
  }, []);

  // Show on anchor click (captures before client navigation)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        const target = e.target as Element | null;
        if (!target) return;
        const anchor = target.closest('a');
        if (!anchor) return;
        if (anchor.getAttribute('aria-disabled') === 'true') return;
        if (anchor.hasAttribute('download')) return;
        const href = anchor.getAttribute('href');
        const targetAttr = anchor.getAttribute('target');
        if (!href || targetAttr === '_blank') return;
        if (href.startsWith('#') || href.startsWith('javascript:')) return;
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return;
        handleUpcomingNavigation(url.pathname);
      } catch {
        // ignore malformed urls
      }
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, []);

  // Show when components trigger programmatic navigation event
  useEffect(() => {
    const onNavigationStart = (e: Event) => {
      const event = e as CustomEvent<{ url?: string }>;
      const pathnameToCheck = toPathname(event.detail?.url);

      if (pathnameToCheck) {
        handleUpcomingNavigation(pathnameToCheck);
        return;
      }

      startSpinner();
    };

    window.addEventListener(NAV_START_EVENT, onNavigationStart as EventListener);
    return () => {
      window.removeEventListener(NAV_START_EVENT, onNavigationStart as EventListener);
    };
  }, []);

  // Suppress spinner for browser back/forward navigation (popstate)
  useEffect(() => {
    const onPopstate = () => {
      suppressNextNavRef.current = true;
      hideSpinner();
    };
    window.addEventListener('popstate', onPopstate);
    return () => {
      window.removeEventListener('popstate', onPopstate);
    };
  }, []);

  // Sync with react-query fetching state and hide with small delay
  useEffect(() => {
    const now = Date.now();
    const pathnameChanged = prevPathRef.current !== null && prevPathRef.current !== pathname;

    if (suppressNextNavRef.current) {
      if (pathnameChanged) {
        suppressNextNavRef.current = false;
        prevPathRef.current = pathname;
      }
      setVisible(false);
      return;
    }

    if (isFetching) {
      const recentNavClick = lastNavClickRef.current !== null && now - lastNavClickRef.current < RECENT_NAV_WINDOW_MS;
      if (recentNavClick || pathnameChanged) {
        setVisible(true);
        return;
      }
      return;
    }

    if (pathnameChanged) {
      prevSettledPathnameRef.current = prevPathRef.current;
    }
    prevPathRef.current = pathname;
    const t = setTimeout(() => setVisible(false), HIDE_DELAY_MS);
    return () => clearTimeout(t);
  }, [isFetching, pathname]);

  if (!visible || !isOnline) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative pointer-events-auto">
        <div className="flex flex-col items-center justify-center">
          <YahshuaLoadingLogo size={96} durationMs={1000} />
          <div className="mt-3 text-xl text-yellow-100 font-semibold">Loading...</div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingSpinner;
