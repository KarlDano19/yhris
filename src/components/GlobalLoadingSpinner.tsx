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
            lastNavClickRef.current = Date.now();
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

    // Sync with react-query fetching state and hide with small delay
    useEffect(() => {
      const now = Date.now();
      const pathnameChanged = prevPathRef.current !== null && prevPathRef.current !== pathname;

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
            <div className="mt-3 text-xl text-yellow-100 font-semibold loading-text" aria-label="Loading">
              <span className="wave" style={{ animationDelay: '0ms' }}>L</span>
              <span className="wave" style={{ animationDelay: '80ms' }}>o</span>
              <span className="wave" style={{ animationDelay: '160ms' }}>a</span>
              <span className="wave" style={{ animationDelay: '240ms' }}>d</span>
              <span className="wave" style={{ animationDelay: '320ms' }}>i</span>
              <span className="wave" style={{ animationDelay: '400ms' }}>n</span>
              <span className="wave" style={{ animationDelay: '480ms' }}>g</span>
              <span className="dot" style={{ animationDelay: '560ms' }}>.</span>
              <span className="dot" style={{ animationDelay: '640ms' }}>.</span>
              <span className="dot" style={{ animationDelay: '720ms' }}>.</span>
            </div>
          </div>
          <style jsx>{`
            /* Waving letters animation for "Loading..." */
            .loading-text {
              display: inline-flex;
              gap: 2px;
              letter-spacing: 0.5px;
            }

            .loading-text .wave {
              display: inline-block;
              transform-origin: center bottom;
              animation: wave 1200ms cubic-bezier(.2,.9,.2,1) infinite;
              will-change: transform, opacity;
            }

            .loading-text .dot {
              display: inline-block;
              margin-left: 2px;
              opacity: 0.6;
              animation: dotPulse 1200ms ease-in-out infinite;
            }

            @keyframes wave {
              0% { transform: translateY(0) rotate(0deg); opacity: 0.85; }
              30% { transform: translateY(-8px) rotate(-2deg); opacity: 1; }
              60% { transform: translateY(0) rotate(2deg); opacity: 0.95; }
              100% { transform: translateY(0) rotate(0deg); opacity: 0.85; }
            }

            @keyframes dotPulse {
              0% { transform: translateY(0); opacity: 0.45; }
              50% { transform: translateY(-6px); opacity: 1; }
              100% { transform: translateY(0); opacity: 0.45; }
            }
          `}</style>
        </div>
      </div>
    );
  };

  export default GlobalLoadingSpinner;

