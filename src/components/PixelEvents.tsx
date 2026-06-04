'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

interface PixelEventsProps {
  viewContent?: {
    content_name: string;
    content_category: string;
  };
}

const PixelEvents = ({ viewContent }: PixelEventsProps) => {
  // Track ViewContent on page load if prop is provided
  useEffect(() => {
    if (viewContent && window.fbq) {
      window.fbq('track', 'ViewContent', viewContent);
    }
  }, []);

  // Track Schedule on any Calendly link click — covers all CTAs globally
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

export default PixelEvents;
