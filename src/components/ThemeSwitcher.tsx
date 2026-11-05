'use client';

import { useEffect, useState } from 'react';

import classNames from '@/helpers/classNames';
import { applyTheme, getStoredTheme, T_ThemeMode, THEME_CHANGE_EVENT } from '@/helpers/theme';

import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const THEME_OPTIONS: { mode: T_ThemeMode; label: string; Icon: typeof SunIcon }[] = [
  { mode: 'light', label: 'Light', Icon: SunIcon },
  { mode: 'dark', label: 'Dark', Icon: MoonIcon },
  { mode: 'system', label: 'System', Icon: ComputerDesktopIcon },
];

const DARK_QUERY = '(prefers-color-scheme: dark)';

// Light / Dark / System picker for header user menus.
// Desktop: iOS-style segmented control with all three modes.
// Mobile: a single iOS-style Dark Mode switch (light or dark only).
const ThemeSwitcher = ({ className = '' }: { className?: string }) => {
  const [themeMode, setThemeMode] = useState<T_ThemeMode>('light');
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const syncMode = () => {
      setThemeMode(getStoredTheme());
      setPrefersDark(media.matches);
    };
    syncMode();
    window.addEventListener(THEME_CHANGE_EVENT, syncMode);
    window.addEventListener('storage', syncMode);
    media.addEventListener('change', syncMode);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncMode);
      window.removeEventListener('storage', syncMode);
      media.removeEventListener('change', syncMode);
    };
  }, []);

  const activeIndex = THEME_OPTIONS.findIndex(({ mode }) => mode === themeMode);
  const isDark = themeMode === 'dark' || (themeMode === 'system' && prefersDark);

  // Keep the surrounding menu open so the change can be seen.
  const selectMode = (event: React.MouseEvent, mode: T_ThemeMode) => {
    event.stopPropagation();
    applyTheme(mode);
  };

  return (
    <div className={classNames('px-3 py-2', className)}>
      {/* Mobile: Dark Mode switch */}
      <div className='flex items-center justify-between sm:hidden'>
        <span className='text-base font-medium text-gray-900'>Dark Mode</span>
        <button
          type='button'
          role='switch'
          aria-checked={isDark}
          aria-label='Dark Mode'
          onClick={(event) => selectMode(event, isDark ? 'light' : 'dark')}
          className={classNames(
            'relative inline-flex h-[31px] w-[51px] flex-shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-savoy-blue',
            isDark ? 'bg-green-500' : 'bg-gray-200'
          )}
        >
          {/* data-theme keeps the knob white in dark mode */}
          <span
            data-theme='light'
            aria-hidden='true'
            className={classNames(
              'h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-200',
              isDark ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
      </div>

      {/* Desktop: Light / Dark / System segmented control */}
      <div className='hidden sm:block'>
        <p className='mb-1.5 text-[10px] uppercase tracking-wide text-gray-400'>Theme</p>
        <div role='radiogroup' aria-label='Theme' className='relative grid grid-cols-3 rounded-lg bg-gray-200 p-0.5'>
          <span
            aria-hidden='true'
            className='absolute inset-y-0.5 left-0.5 w-[calc((100%-0.25rem)/3)] rounded-md bg-white shadow transition-transform duration-200 ease-out'
            style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }}
          />
          {THEME_OPTIONS.map(({ mode, label, Icon }) => {
            const isActive = themeMode === mode;
            return (
              <button
                key={mode}
                type='button'
                role='radio'
                aria-checked={isActive}
                onClick={(event) => selectMode(event, mode)}
                className={classNames(
                  'relative z-10 flex items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-savoy-blue',
                  isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <Icon className='h-4 w-4' aria-hidden='true' />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
