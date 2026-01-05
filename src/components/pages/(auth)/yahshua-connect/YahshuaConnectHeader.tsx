'use client';

import { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteCookie } from 'cookies-next';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useLogout from '@/components/hooks/useLogout';
import MessagesModal from './modals/MessagesModal';
import NotificationsModal from './modals/NotificationsModal';
import ChatModal from './modals/ChatModal';

import classNames from '@/helpers/classNames';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import YahshuaConnectLogo from '@/svg/YahshuaConnectLogo';
import NotificationsIcon from '@/svg/NotificationsIcon';
import ProfileDropdownIcon from '@/svg/ProfileDropdownIcon';
import ChatIcon from '@/svg/ChatIcon';
import ExitIcon from '@/svg/ExitIcon';

interface YahshuaConnectHeaderProps {
  disabled?: boolean;
}

const YahshuaConnectHeader = ({ disabled = false }: YahshuaConnectHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{ name: string; initials: string } | null>(null);
  const { mutate } = useLogout();
  
  // Determine active mode from pathname
  const activeMode = pathname?.includes('business-mode') ? 'business' : 'personal';
  
  const handleModeChange = (mode: 'personal' | 'business') => {
    if (disabled) return;
    const targetPath = mode === 'personal' 
      ? '/personal-mode' 
      : '/business-mode';
    router.push(targetPath);
  };

  const logout = (isExpired: boolean) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        if (isExpired) {
          toast.custom(() => <CustomToast message={'Session is expired.'} type='error' />, {
            duration: 4000,
          });
        } else {
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        }
        deleteCookie('token');
        location.href = '/login';
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err || 'Session is expired.'} type='error' />, {
          duration: 4000,
        });
        location.href = '/login';
      },
    };
    mutate(void 0, callbackReq);
  };

  // Dummy data for messages
  const messages = [
    {
      id: 1,
      senderName: 'Maria Santos',
      senderInitials: 'MS',
      preview: 'Thank you!',
      unreadCount: 2,
    },
    {
      id: 2,
      senderName: 'HR - ABBA Initiative',
      senderInitials: 'AI',
      preview: 'We reviewed...',
      unreadCount: 1,
    },
  ];

  // Dummy data for notifications
  const notifications = [
    {
      id: 1,
      type: 'job' as const,
      title: 'New job match!',
      description: 'Junior UX Designer matches 92%',
      timeAgo: '2 min ago',
    },
    {
      id: 2,
      type: 'booking' as const,
      title: 'Booking confirmed',
      description: 'Maria Santos confirmed',
      timeAgo: '1 hour ago',
    },
  ];

  const handleSelectMessage = (message: typeof messages[0]) => {
    setSelectedChat({
      name: message.senderName,
      initials: message.senderInitials,
    });
    setShowChatModal(true);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop and Tablet Layout */}
        <div className="hidden md:flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {disabled ? (
              <div className="cursor-not-allowed opacity-50">
                <YahshuaConnectLogo />
              </div>
            ) : (
              <Link href="/personal-mode">
                <YahshuaConnectLogo />
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={disabled}
                className={classNames(
                  "block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
                  disabled 
                    ? "bg-gray-100 cursor-not-allowed opacity-50" 
                    : "bg-gray-50 focus:bg-white"
                )}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className={classNames("flex items-center bg-gray-100 rounded-xl p-1", disabled && "opacity-50")}>
              <button
                onClick={() => handleModeChange('personal')}
                disabled={disabled}
                className={classNames(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeMode === 'personal'
                    ? 'bg-white text-indigo-dye shadow-sm'
                    : 'text-gray-600',
                  disabled && 'cursor-not-allowed'
                )}
              >
                Personal
              </button>
              <button
                onClick={() => handleModeChange('business')}
                disabled={disabled}
                className={classNames(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeMode === 'business'
                    ? 'bg-white text-indigo-dye shadow-sm'
                    : 'text-gray-600',
                  disabled && 'cursor-not-allowed'
                )}
              >
                Business
              </button>
            </div>

            {/* Messages Button */}
            <button
              onClick={() => !disabled && setShowMessagesModal(true)}
              disabled={disabled}
              className={classNames(
                "relative p-2.5 text-gray-600 rounded-xl transition-colors",
                disabled 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-gray-100"
              )}
            >
              <ChatIcon />
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5">
                2
              </span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => !disabled && setShowNotificationsModal(true)}
              disabled={disabled}
              className={classNames(
                "relative p-2.5 text-gray-600 rounded-xl transition-colors",
                disabled 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-gray-100"
              )}
            >
              <NotificationsIcon fill="#6B7280" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5">
                1
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => logout(false)}
              className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              title="Sign Out"
            >
              <ExitIcon className="h-5 w-5 fill-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top Row - Logo and Icons */}
          <div className="flex items-center justify-between h-14 gap-2">
            {/* Logo */}
            <div className="flex-shrink-0">
              {disabled ? (
                <div className="flex items-center gap-2 cursor-not-allowed opacity-50">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Y</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-dye">SIS</span>
                </div>
              ) : (
                <Link href="/personal-mode">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Y</span>
                    </div>
                    <span className="text-sm font-bold text-indigo-dye">SIS</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-1">
              {/* Messages */}
              <button
                onClick={() => !disabled && setShowMessagesModal(true)}
                disabled={disabled}
                className={classNames(
                  "relative p-2.5 text-gray-600 rounded-xl transition-colors",
                  disabled 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-gray-100"
                )}
              >
                <ChatIcon />
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                  2
                </span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => !disabled && setShowNotificationsModal(true)}
                disabled={disabled}
                className={classNames(
                  "relative p-2.5 text-gray-600 rounded-xl transition-colors",
                  disabled 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-gray-100"
                )}
              >
                <NotificationsIcon fill="#6B7280" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                  1
                </span>
              </button>

              {/* Profile */}
              <button 
                disabled={disabled}
                className={classNames(
                  "relative p-2 rounded-xl transition-colors",
                  disabled 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-gray-100"
                )}
              >
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

              {/* Logout Button */}
              <button
                onClick={() => logout(false)}
                className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                title="Sign Out"
              >
                <ExitIcon className="h-4 w-4 fill-gray-600" />
              </button>
            </div>
          </div>

          {/* Middle Row - Mode Toggle Buttons */}
          <div className="pb-2">
            <div className={classNames("flex items-center justify-center gap-2 bg-gray-100 rounded-xl p-1", disabled && "opacity-50")}>
              <button
                onClick={() => handleModeChange('personal')}
                disabled={disabled}
                className={classNames(
                  'flex-1 px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
                  activeMode === 'personal'
                    ? 'bg-white text-indigo-dye shadow-sm'
                    : 'text-gray-600',
                  disabled && 'cursor-not-allowed'
                )}
              >
                Personal
              </button>
              <button
                onClick={() => handleModeChange('business')}
                disabled={disabled}
                className={classNames(
                  'flex-1 px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
                  activeMode === 'business'
                    ? 'bg-white text-indigo-dye shadow-sm'
                    : 'text-gray-600',
                  disabled && 'cursor-not-allowed'
                )}
              >
                Business
              </button>
            </div>
          </div>

          {/* Bottom Row - Search Bar */}
          <div className="pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={disabled}
                className={classNames(
                  "block w-full pl-11 pr-4 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
                  disabled 
                    ? "bg-gray-100 cursor-not-allowed opacity-50" 
                    : "bg-gray-50 focus:bg-white"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MessagesModal
        isOpen={showMessagesModal}
        onClose={() => setShowMessagesModal(false)}
        messages={messages}
        onSelectMessage={handleSelectMessage}
      />

      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notifications}
      />

      {selectedChat && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setSelectedChat(null);
          }}
          recipientName={selectedChat.name}
          recipientInitials={selectedChat.initials}
        />
      )}
    </header>
  );
};

export default YahshuaConnectHeader;

