import posthog from 'posthog-js';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export type EventParams = Record<string, string | number | boolean | undefined>;

// Sends one custom event to GA4 and PostHog. Never throws, never blocks the page.
// No personal data: do not pass emails, names or company names.
export const trackEvent = (name: string, params: EventParams = {}) => {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  } catch {
    // analytics must never break the page
  }
  try {
    if (posthog.__loaded) posthog.capture(name, params);
  } catch {
    // analytics must never break the page
  }
};
