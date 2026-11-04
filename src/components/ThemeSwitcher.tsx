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

// Light / Dark / System picker for header user menus.
const ThemeSwitcher = ({ className = '' }: { className?: string }) => {
  const [themeMode, setThemeMode] = useState<T_ThemeMode>('light');

  useEffect(() => {
    const syncMode = () => setThemeMode(getStoredTheme());
    syncMode();
    window.addEventListener(THEME_CHANGE_EVENT, syncMode);
    window.addEventListener('storage', syncMode);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncMode);
      window.removeEventListener('storage', syncMode);
    };
  }, []);

  return (
    <div className={classNames('px-3 py-2', className)}>
      <p className='mb-1.5 text-[10px] uppercase tracking-wide text-gray-400'>Theme</p>
      <div role='radiogroup' aria-label='Theme' className='grid grid-cols-3 gap-1 rounded-md bg-gray-100 p-1'>
        {THEME_OPTIONS.map(({ mode, label, Icon }) => {
          const isActive = themeMode === mode;
          return (
            <button
              key={mode}
              type='button'
              role='radio'
              aria-checked={isActive}
              onClick={(event) => {
                // Keep the surrounding menu open so the change can be seen.
                event.stopPropagation();
                applyTheme(mode);
              }}
              className={classNames(
                'flex items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-savoy-blue',
                isActive ? 'bg-white text-savoy-blue shadow-sm' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Icon className='h-4 w-4' aria-hidden='true' />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
