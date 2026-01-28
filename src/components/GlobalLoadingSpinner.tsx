 'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useIsFetching } from '@tanstack/react-query';
import LoadingSpinner from './LoadingSpinner';

const GlobalLoadingSpinner = () => {
  const pathname = usePathname();
  const isFetching = useIsFetching();
  const [visible, setVisible] = useState(false);

  // Show on anchor click (captures before client navigation) and on popstate
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        const target = e.target as Element | null;
        if (!target) return;
        const anchor = target.closest('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        const targetAttr = anchor.getAttribute('target');
        if (!href || targetAttr === '_blank') return;
        // ignore hash-only links and javascript:
        if (href.startsWith('#') || href.startsWith('javascript:')) return;
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return;
        if (url.pathname !== location.pathname) {
          setVisible(true);
        }
      } catch {
        // ignore malformed urls
      }
    };

    const onPop = () => setVisible(true);

    window.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  // Sync with react-query fetching state and hide with small delay
  useEffect(() => {
    if (isFetching > 0) {
      setVisible(true);
      return;
    }
    // if pathname changed and nothing is fetching, hide after short delay
    const t = setTimeout(() => setVisible(false), 120);
    return () => clearTimeout(t);
  }, [isFetching, pathname]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative pointer-events-auto">
        <LoadingSpinner size="lg" color="yellow" showText text="Loading..." />
      </div>
    </div>
  );
};

export default GlobalLoadingSpinner;

