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

// Internal calls to action we want to measure. One event name per destination so GA4 reports can group
// them by event name and by page (the page the click happened on). cta_location says where on the page.
const INTERNAL_CTA_EVENTS: { matches: (path: string) => boolean; event: string }[] = [
  { matches: (p) => p === '/register', event: 'start_free_click' },
  { matches: (p) => p === '/pricing', event: 'pricing_click' },
  { matches: (p) => p === '/features', event: 'features_click' },
  { matches: (p) => p === '/hr-cost-calculator', event: 'calculator_click' },
  { matches: (p) => p === '/how-we-compare' || p.startsWith('/vs-') || p.endsWith('-alternative'), event: 'comparison_click' },
  { matches: (p) => p.startsWith('/use-cases'), event: 'use_case_click' },
];

const ctaLocation = (anchor: HTMLAnchorElement): string => {
  if (anchor.closest('footer')) return 'footer';
  if (anchor.closest('header, nav')) return 'header';
  if (anchor.closest('article')) return 'article';
  return 'page';
};

const trackInternalCta = (anchor: HTMLAnchorElement) => {
  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return;
  }
  const bare = (h: string) => h.replace(/^www\./, '');
  if (bare(url.hostname) !== bare(window.location.hostname)) return;
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const hit = INTERNAL_CTA_EVENTS.find((x) => x.matches(path));
  if (!hit) return;
  const params = {
    link_url: path,
    cta_text: (anchor.textContent || '').trim().slice(0, 100),
    cta_location: ctaLocation(anchor),
    page_path: window.location.pathname,
  };
  if (typeof window.gtag === 'function') {
    window.gtag('event', hit.event, params);
  }
  if (posthog.__loaded) {
    posthog.capture(hit.event, params);
  }
};

// Mounted once in root layout: attaches a single global click listener that
// reports every Calendly (demo booking) link click to Meta, GA4, and PostHog, and reports clicks on key internal
// calls to action (start free, pricing, features, calculator, comparison, use cases) to GA4 and PostHog.
// Counts clicks, not confirmed bookings: Calendly opens in a new tab.
const GlobalPixelTracker = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Middle-clicks arrive as auxclick; ignore right-clicks
      if (e.type === 'auxclick' && e.button !== 1) return;

      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor?.href) return;
      if (!anchor.href.includes('calendly.com')) {
        trackInternalCta(anchor);
        return;
      }

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
