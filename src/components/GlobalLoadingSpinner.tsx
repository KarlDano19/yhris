'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useIsFetching } from '@tanstack/react-query';
import LoadingSpinner from './LoadingSpinner';
import YahshuaLoadingLogo from './YahshuaLoadingLogo';

const GlobalLoadingSpinner = () => {
  const pathname = usePathname();
  const isFetching = useIsFetching();
  const [visible, setVisible] = useState(false);
  const lastNavClickRef = useRef<number | null>(null);
  const prevPathRef = useRef<string | null>(null);
  const isPopstateRef = useRef(false);
  const suppressNextSpinnerRef = useRef(false);
  const visitedPathsRef = useRef<Set<string>>(new Set());

  // Track visited paths so we can skip the spinner on back-navigation
  useEffect(() => {
    visitedPathsRef.current.add(pathname);
  }, [pathname]);

  // Show on anchor click (captures before client navigation)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        const target = e.target as Element | null;
        if (!target) return;
        const anchor = target.closest('a');
        if (!anchor) return;
        // Don't trigger spinner for disabled/blocked navigation items (permission or subscription denied)
        if (anchor.getAttribute('aria-disabled') === 'true') return;
        const href = anchor.getAttribute('href');
        const targetAttr = anchor.getAttribute('target');
        if (!href || targetAttr === '_blank') return;
        // ignore hash-only links and javascript:
        if (href.startsWith('#') || href.startsWith('javascript:')) return;
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return;
        if (url.pathname !== location.pathname) {
          if (visitedPathsRef.current.has(url.pathname)) {
            // Destination already visited — it's cached, suppress spinner
            suppressNextSpinnerRef.current = true;
          } else {
            setVisible(true);
            lastNavClickRef.current = Date.now();
          }
        }
      } catch {
        // ignore malformed urls
      }
    };
    window.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('click', onClick, true);
    };
  }, []);

  // Suppress spinner for browser back/forward navigation (popstate)
  useEffect(() => {
    const onPopstate = () => {
      isPopstateRef.current = true;
    };
    window.addEventListener('popstate', onPopstate);
    return () => window.removeEventListener('popstate', onPopstate);
  }, []);

  // Sync with react-query fetching state and hide with small delay
  useEffect(() => {
    const now = Date.now();
    const pathnameChanged = prevPathRef.current !== null && prevPathRef.current !== pathname;

    // Skip spinner for browser back/forward or in-app back-links to cached pages
    if ((isPopstateRef.current || suppressNextSpinnerRef.current) && pathnameChanged) {
      isPopstateRef.current = false;
      suppressNextSpinnerRef.current = false;
      prevPathRef.current = pathname;
      setVisible(false);
      return;
    }

    if (isFetching > 0) {
      // Only show spinner for fetches triggered by navigation clicks or when pathname changed.
      const recentNavClick = lastNavClickRef.current && now - lastNavClickRef.current < 2000;
      if (recentNavClick || pathnameChanged) {
        setVisible(true);
        return;
      }
      // otherwise don't show spinner for background/modal fetches
      return;
    }
    // update previous path for next effect run
    prevPathRef.current = pathname;
    // if pathname changed and nothing is fetching, hide after short delay
    const t = setTimeout(() => setVisible(false), 120);
    return () => clearTimeout(t);
  }, [isFetching, pathname]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative pointer-events-auto">
        {/* Yahshua logo loading animation */}
        <div className="flex flex-col items-center justify-center">
          <YahshuaLoadingLogo size={96} durationMs={1000} />
          <div className="mt-3 text-xl text-yellow-100 font-semibold">Loading...</div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingSpinner;
