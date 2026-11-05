export type T_ThemeMode = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'theme';
export const THEME_CHANGE_EVENT = 'hris-themechange';

// First URL segment of public pages. These keep their light design even when
// the user's theme is dark ('' is the home page). Signed-in routes are dark-capable
// by default, so a new feature route needs no entry here.
export const LIGHT_ONLY_ROUTES: string[] = [
  '',
  // Landing pages
  'about', 'blog', 'docs', 'faqs', 'features', 'greatday-hr-alternative', 'how-we-compare',
  'hr-cost-calculator', 'landing-page', 'payroll-integration', 'pricing', 'privacy-notice',
  'privacy-policy', 'sprout-alternative', 'terms-of-service', 'use-cases', 'vs-greatday',
  'vs-sprout', 'yahshua-payroll',
  // Public job applications and forms
  'jobs', 'job-app-form', 'employee-issue-decision', 'employee-issue-response',
  'evaluation-form', 'form-response',
  // Callbacks and public links
  'dragonpay-callback', 'sso', 'directives', 'kickoff', 'offboarding-public', 'verify', 'waiting-list',
  // Sign-in pages
  'change-password', 'forgot-password', 'login', 'register', 'yg-login',
];

export const isLightOnlyPath = (pathname: string) => {
  const firstSegment = pathname.split('/')[1] || '';
  return LIGHT_ONLY_ROUTES.includes(firstSegment);
};

export const getStoredTheme = (): T_ThemeMode => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' || stored === 'system' ? stored : 'light';
  } catch {
    return 'light';
  }
};

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

// Puts the `dark` class on <html> when the stored theme resolves to dark and the
// page allows it. Every color in the app is a CSS variable keyed off that class.
export const syncThemeClass = (pathname: string = window.location.pathname) => {
  const mode = getStoredTheme();
  const wantsDark = mode === 'dark' || (mode === 'system' && prefersDark());
  const isDark = wantsDark && !isLightOnlyPath(pathname);
  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
  root.style.colorScheme = isDark ? 'dark' : 'light';
  return isDark;
};

export const applyTheme = (mode: T_ThemeMode) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Storage blocked: the choice still applies to this page view.
  }
  syncThemeClass();
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: mode }));
};

// Inline <head> script: applies the theme before first paint so dark users never
// see a white flash. Mirrors syncThemeClass, which takes over after hydration.
export const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem('${THEME_STORAGE_KEY}');var s=location.pathname.split('/')[1]||'';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d&&${JSON.stringify(LIGHT_ONLY_ROUTES)}.indexOf(s)<0){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark'}}catch(e){}})();`;
