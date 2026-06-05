'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

interface PixelEventsProps {
  viewContent: {
    content_name: string;
    content_category: string;
  };
}

// Mount on individual pages to fire ViewContent on page load.
// Schedule tracking is handled globally by GlobalPixelTracker in layout.tsx.
const PixelEvents = ({ viewContent }: PixelEventsProps) => {
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'ViewContent', viewContent);
    }
  }, []);

  return null;
};

export default PixelEvents;
