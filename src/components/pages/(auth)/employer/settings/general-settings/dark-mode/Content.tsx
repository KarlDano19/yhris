 'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const DarkModeContent = ({ hasActiveSubscription }: { hasActiveSubscription?: boolean }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<'dark' | 'light' | 'system' | null>(null);

  useEffect(() => {
    try {
      // Read saved preference and apply only if user previously selected a theme.
      // Do NOT automatically change theme on page load based on OS preference or opening this page.
      const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
      if (saved === 'dark') {
        setSelectedMode('dark');
        setIsDark(true);
        document.documentElement.classList.add('dark');
      } else if (saved === 'light') {
        setSelectedMode('light');
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      } else if (saved === 'system') {
        setSelectedMode('system');
        // will be handled by system listener effect below
      } else {
        // No saved preference: reflect current document state but do not change it.
        const currentlyDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
        setSelectedMode(null);
        setIsDark(!!currentlyDark);
      }
    } catch (e) {
      // ignore in SSR or restricted environments
    }
  }, []);

  // If user selected "system", listen to OS theme changes and apply accordingly
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedMode !== 'system') return;
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (!mq) return;

    const apply = (ev: any) => {
      const dark = ev && typeof ev.matches === 'boolean' ? ev.matches : mq.matches;
      setIsDark(dark);
      if (dark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };

    apply(null);
    // add listener
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else if (mq.addListener) mq.addListener(apply);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', apply);
      else if (mq.removeListener) mq.removeListener(apply);
    };
  }, [selectedMode]);

  const enableDark = () => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    setSelectedMode('dark');
    setIsDark(true);
  };

  const enableLight = () => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    setSelectedMode('light');
    setIsDark(false);
  };

  const toggle = () => {
    if (isDark) enableLight();
    else enableDark();
  };

  const enableSystem = () => {
    localStorage.setItem('theme', 'system');
    setSelectedMode('system');
    // effect will apply the current system preference
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="flex p-4">
        <Link href="/settings/general-settings" className="flex-none flex gap-3 items-center hover:bg-gray-200">
          <ArrowLeftIcon className="h-5 w-5" />
          <h4>General Settings</h4>
        </Link>
      </div>

      <div className="px-2 md:px-8 lg:px-4">
        <h2 className="text-xl font-bold text-indigo-dye">Dark Mode</h2>
        <p className="mt-2 text-sm text-gray-600">Toggle the global dark/light theme for the application.</p>

        <div className="mt-6 flex gap-4 items-center">
          <button
            onClick={enableLight}
            className={`px-4 py-2 rounded border ${selectedMode === 'light' ? 'bg-indigo-dye text-white' : 'bg-white text-indigo-dye'}`}
          >
            Light Mode
          </button>

          <button
            onClick={enableDark}
            className={`px-4 py-2 rounded border ${selectedMode === 'dark' ? 'bg-indigo-dye text-white' : 'bg-white text-indigo-dye'}`}
          >
            Dark Mode
          </button>

          <button
            onClick={enableSystem}
            className={`px-4 py-2 rounded border ${selectedMode === 'system' ? 'bg-indigo-dye text-white' : 'bg-white text-indigo-dye'}`}
          >
            System Mode
          </button>

          <div className="ml-4">
            Current: <strong>{isDark ? 'Dark' : 'Light'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkModeContent;

