'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import classNames from '@/helpers/classNames';
import YahshuaSISLogo from '@/svg/YahshuaSISLogo';
import ChatIcon from '@/svg/ChatIcon';
import NotificationsIcon from '@/svg/NotificationsIcon';
import ProfileDropdownIcon from '@/svg/ProfileDropdownIcon';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const YahshuaSISHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Determine active mode from pathname
  const activeMode = pathname?.includes('business-mode') ? 'business' : 'personal';
  
  const handleModeChange = (mode: 'personal' | 'business') => {
    const targetPath = mode === 'personal' 
      ? '/yahshua-sis/personal-mode' 
      : '/yahshua-sis/business-mode';
    router.push(targetPath);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop and Tablet Layout */}
        <div className="hidden md:flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/yahshua-sis/personal-mode">
              <YahshuaSISLogo />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="What are you looking for today, Yuri?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Mode Toggle Buttons - Hidden on tablet, shown on desktop */}
          <div className="hidden lg:flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => handleModeChange('personal')}
              className={classNames(
                'px-6 py-2 rounded-full text-sm font-medium transition-all border-2',
                activeMode === 'personal'
                  ? 'bg-white text-indigo-dye shadow-sm border-[#FFC107]'
                  : 'text-gray-600 hover:text-gray-900 border-transparent'
              )}
            >
              Personal Mode
            </button>
            <button
              onClick={() => handleModeChange('business')}
              className={classNames(
                'px-6 py-2 rounded-full text-sm font-medium transition-all border-2',
                activeMode === 'business'
                  ? 'bg-white text-indigo-dye shadow-sm border-[#FFC107]'
                  : 'text-gray-600 hover:text-gray-900 border-transparent'
              )}
            >
              Business Mode
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Messages */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex flex-col items-center">
                <ChatIcon />
                <span className="text-xs text-gray-700 mt-0.5">Messages</span>
              </button>
              <span className="absolute top-4 right-3 min-w-[20px] h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5">
                2
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex flex-col items-center">
                <NotificationsIcon fill="#2C3F58" />
                <span className="text-xs text-gray-700 mt-0.5">Notifications</span>
              </button>
              <span className="absolute top-4 right-5 min-w-[20px] h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5">
                1
              </span>
            </div>

            {/* Profile */}
            <button className="relative flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                <img 
                  src="https://via.placeholder.com/40" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-0">
                <ProfileDropdownIcon fill="#2C3F58" />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top Row - Logo and Icons */}
          <div className="flex items-center justify-between h-14 gap-2">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/yahshua-sis/personal-mode">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Y</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-dye">SIS</span>
                </div>
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-1">
              {/* Messages */}
              <div className="relative">
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex flex-col items-center">
                  <ChatIcon />
                </button>
                <span className="absolute top-4 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                  2
                </span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex flex-col items-center">
                  <NotificationsIcon fill="#2C3F58" />
                </button>
                <span className="absolute top-4 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                  1
                </span>
              </div>

              {/* Profile */}
              <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src="https://via.placeholder.com/32" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0">
                  <ProfileDropdownIcon fill="#2C3F58" />
                </div>
              </button>
            </div>
          </div>

          {/* Middle Row - Mode Toggle Buttons */}
          <div className="pb-2">
            <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => handleModeChange('personal')}
                className={classNames(
                  'flex-1 px-4 py-1.5 rounded-full text-xs font-medium transition-all border-2',
                  activeMode === 'personal'
                    ? 'bg-white text-indigo-dye shadow-sm border-[#FFC107]'
                    : 'text-gray-600 border-transparent'
                )}
              >
                Personal Mode
              </button>
              <button
                onClick={() => handleModeChange('business')}
                className={classNames(
                  'flex-1 px-4 py-1.5 rounded-full text-xs font-medium transition-all border-2',
                  activeMode === 'business'
                    ? 'bg-white text-indigo-dye shadow-sm border-[#FFC107]'
                    : 'text-gray-600 border-transparent'
                )}
              >
                Business Mode
              </button>
            </div>
          </div>

          {/* Bottom Row - Search Bar */}
          <div className="pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default YahshuaSISHeader;

