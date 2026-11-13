'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { syncChartTheme } from '@/helpers/chartTheme';
import { syncThemeClass, THEME_CHANGE_EVENT, THEME_STORAGE_KEY } from '@/helpers/theme';

// Keeps the `dark` class on <html> in step with the saved theme. Mounted once in
// the root layout so every page gets dark mode without any per-page wiring.
const ThemeController = () => {
  const pathname = usePathname();

  useEffect(() => {
    syncChartTheme(syncThemeClass(pathname));
  }, [pathname]);

  useEffect(() => {
    const sync = () => syncChartTheme(syncThemeClass());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) sync();
    };
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    // "System" follows OS changes live, and other open tabs follow a change made here.
    media.addEventListener('change', sync);
    window.addEventListener('storage', handleStorage);
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => {
      media.removeEventListener('change', sync);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(THEME_CHANGE_EVENT, sync);
    };
  }, []);

  return null;
};

export default ThemeController;
