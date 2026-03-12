'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useIsFetching } from '@tanstack/react-query';
import YahshuaLoadingLogo from './YahshuaLoadingLogo';

// Module-level symbol survives StrictMode double-invocation (module is loaded once per session).
const PATCHED = Symbol('yahshua_nav_spinner_patched');

type PatchableFunction = {
  (...args: Parameters<typeof history.pushState>): void;
  [PATCHED]?: true;
};

const GlobalLoadingSpinner = () => {
  const pathname = usePathname();
  const isFetching = useIsFetching();
  const [visible, setVisible] = useState(false);

  const lastNavClickRef = useRef<number | null>(null);
  const prevPathRef = useRef<string | null>(null);
  const suppressNextNavRef = useRef(false);
  const prevSettledPathnameRef = useRef<string | null>(null);
  const suppressResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Intercept programmatic navigation (router.push / router.replace)
  useEffect(() => {
    const handleProgrammaticNav = (url: string | URL | null | undefined) => {
      if (!url) return;
      try {
        const parsed = new URL(String(url), location.href);
        if (parsed.pathname === location.pathname) return;
        if (suppressNextNavRef.current) return;
        if (parsed.pathname === prevSettledPathnameRef.current) {
          suppressNextNavRef.current = true;
          lastNavClickRef.current = null;
          setVisible(false);
          return;
        }
        setVisible(true);
        lastNavClickRef.current = Date.now();
      } catch {
        // ignore malformed urls
      }
    };

    // Double-patch guard: only the first invocation applies the patch.
    // StrictMode's second invocation finds the symbol already set and skips.
    const iOwnThePatch = !(history.pushState as PatchableFunction)[PATCHED];

    if (iOwnThePatch) {
      const originalPushState = history.pushState.bind(history);
      const originalReplaceState = history.replaceState.bind(history);

      const patchedPush: PatchableFunction = function (state, unused, url) {
        handleProgrammaticNav(url);
        return originalPushState(state, unused, url);
      };
      patchedPush[PATCHED] = true;

      const patchedReplace: PatchableFunction = function (state, unused, url) {
        handleProgrammaticNav(url);
        return originalReplaceState(state, unused, url);
      };
      patchedReplace[PATCHED] = true;

      history.pushState = patchedPush as typeof history.pushState;
      history.replaceState = patchedReplace as typeof history.replaceState;

      return () => {
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
      };
    }

    // Non-owner path: refresh handler closure without re-patching.
    const savedPush = history.pushState;
    const savedReplace = history.replaceState;

    const wrappedPush: PatchableFunction = function (state, unused, url) {
      handleProgrammaticNav(url);
      return savedPush.call(history, state, unused, url);
    };
    wrappedPush[PATCHED] = true;

    const wrappedReplace: PatchableFunction = function (state, unused, url) {
      handleProgrammaticNav(url);
      return savedReplace.call(history, state, unused, url);
    };
    wrappedReplace[PATCHED] = true;

    history.pushState = wrappedPush as typeof history.pushState;
    history.replaceState = wrappedReplace as typeof history.replaceState;

    return () => {
      history.pushState = savedPush;
      history.replaceState = savedReplace;
    };
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
        if (url.pathname !== location.pathname) {
          suppressNextNavRef.current = false;
          if (url.pathname === prevSettledPathnameRef.current) {
            suppressNextNavRef.current = true;
            lastNavClickRef.current = null;
            setVisible(false);
            return;
          }
          setVisible(true);
          lastNavClickRef.current = Date.now();
        }
      } catch {
        // ignore malformed urls
      }
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, []);

  // Suppress spinner for browser back/forward navigation (popstate)
  useEffect(() => {
    const onPopstate = () => {
      suppressNextNavRef.current = true;
      lastNavClickRef.current = null;
      setVisible(false);
      if (suppressResetTimerRef.current) clearTimeout(suppressResetTimerRef.current);
      suppressResetTimerRef.current = setTimeout(() => {
        suppressNextNavRef.current = false;
        suppressResetTimerRef.current = null;
      }, 500);
    };
    window.addEventListener('popstate', onPopstate);
    return () => {
      window.removeEventListener('popstate', onPopstate);
      // Timer leak fix: clear pending timer so callback never fires on orphaned refs.
      if (suppressResetTimerRef.current) {
        clearTimeout(suppressResetTimerRef.current);
        suppressResetTimerRef.current = null;
      }
    };
  }, []);

  // Sync with react-query fetching state and hide with small delay
  useEffect(() => {
    const now = Date.now();
    const pathnameChanged = prevPathRef.current !== null && prevPathRef.current !== pathname;

    if (suppressNextNavRef.current) {
      if (pathnameChanged) {
        suppressNextNavRef.current = false;
        if (suppressResetTimerRef.current) {
          clearTimeout(suppressResetTimerRef.current);
          suppressResetTimerRef.current = null;
        }
        prevPathRef.current = pathname;
      }
      setVisible(false);
      return;
    }

    if (isFetching > 0) {
      const recentNavClick = lastNavClickRef.current !== null && now - lastNavClickRef.current < 2000;
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
    const t = setTimeout(() => setVisible(false), 120);
    return () => clearTimeout(t);
  }, [isFetching, pathname]);

  if (!visible) return null;

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
