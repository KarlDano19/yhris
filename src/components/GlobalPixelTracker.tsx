'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
  }
}

const DEMO_EVENT = 'book_demo_click';

// Mounted once in root layout: attaches a single global click listener that
// reports every Calendly (demo booking) link click to Meta, GA4, and PostHog.
// Counts clicks, not confirmed bookings: Calendly opens in a new tab.
const GlobalPixelTracker = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Middle-clicks arrive as auxclick; ignore right-clicks
      if (e.type === 'auxclick' && e.button !== 1) return;

      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor?.href?.includes('calendly.com')) return;

      if (window.fbq) {
        window.fbq('track', 'Schedule');
      }

      let utmCampaign: string | undefined;
      try {
        utmCampaign = new URL(anchor.href).searchParams.get('utm_campaign') ?? undefined;
      } catch {
        utmCampaign = undefined;
      }

      const params = {
        link_url: anchor.href.split('?')[0],
        cta_text: (anchor.textContent || '').trim().slice(0, 100),
        page_path: window.location.pathname,
        utm_campaign: utmCampaign,
      };

      if (typeof window.gtag === 'function') {
        window.gtag('event', DEMO_EVENT, params);
      }

      if (posthog.__loaded) {
        posthog.capture(DEMO_EVENT, params);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('auxclick', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('auxclick', handleClick);
    };
  }, []);

  return null;
};

export default GlobalPixelTracker;
