'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

// Mounted once in root layout — attaches a single global click listener
// that fires fbq('track', 'Schedule') on any Calendly link click.
const GlobalPixelTracker = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor?.href?.includes('calendly.com') && window.fbq) {
        window.fbq('track', 'Schedule');
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
};

export default GlobalPixelTracker;
