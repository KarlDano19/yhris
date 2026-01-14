'use client';

import React, { useEffect, useState, Fragment } from 'react';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

import { Menu, Popover, Transition } from '@headlessui/react';
import {getCookie, deleteCookie } from 'cookies-next';
import toast from 'react-hot-toast';

import { TOKEN_EXPIRATION_WARNING_SECONDS } from '@/lib/session';
import CustomToast from '@/components/CustomToast';
import classNames from '@/helpers/classNames';
import FloatingHelpButton from '@/components/FloatingHelpButton';
import useGetEmployerProfile from '../../../hooks/useGetEmployerProfile';
import useLogout from '../../../hooks/useLogout';
import useRefreshToken from '@/components/hooks/useRefreshToken';
import Timer from '../../../Timer';
import SessionExpirationModal from '@/components/SessionExpirationModal';
import useGetUserDetails from '@/components/hooks/useGetUserDetails';
import useGetNotification from '@/components/hooks/useGetNotification';
import useMarkNotificationRead from '@/components/hooks/useMarkNotificationRead';
import useGetEmployerApplicantChatsList from '@/components/hooks/chat/employer/useGetEmployerApplicantChatsList';
import MessagesModal from '@/components/common/chat/MessagesModal';
import ChatModal from '@/components/common/chat/ChatModal';

import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import MainLogo from '@/svg/MainLogo';
import ChatIcon from '@/svg/ChatIcon';

interface ErrorDetail {
  detail: string;
}

interface MainHeaderProps {
  hasProfile: boolean;
  hasActiveSubscription: boolean;
  firstRoute: string;
  initialTokenExpiresAt?: number;
}

const MainHeader = ({ hasProfile, hasActiveSubscription, firstRoute, initialTokenExpiresAt }: MainHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>({});
  const [userDetails, setUserDetails] = useState<any>({});
  const [isExpiring, setIsExpiring] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    data,
    isLoading: isProfileLoading,
    error,
  } = useGetEmployerProfile() as { data: any; isLoading: boolean; error: ErrorDetail | null };
  const { data: usersData, isLoading: isUsersLoading } = useGetUserDetails() as { data: any; isLoading: boolean };
  const { mutate } = useLogout();
  const { data: notificationsData, isLoading: isNotificationsLoading } = useGetNotification({ page_size: 10 });
  const { mutate: markAsRead } = useMarkNotificationRead();
  const [notifications, setNotifications] = useState<any[]>([]);
  const { mutate: refreshToken } = useRefreshToken();

  // Chat state
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{
    appliedJobId: number;
    jobTitle: string;
    applicantName: string;
    applicantPhoto?: string | null;
    applicantInitials: string;
  } | null>(null);

  // Fetch chats to get unread count
  const { data: chatsData } = useGetEmployerApplicantChatsList(undefined, true);
  const totalUnreadCount = chatsData?.records?.reduce((sum: number, chat: { unread_count?: number }) => sum + (chat.unread_count || 0), 0) || 0;

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

  const userNavigation = [
    { name: 'My Profile', href: '/employer-profile', onClick: void 0, isDisabled: !hasProfile },
    { name: 'Subscriptions', href: '/manage-subscriptions#active-plans', onClick: void 0, isDisabled: !hasProfile || firstRoute === 'employer-profile' },
    {
      name: 'Sign out',
      href: '',
      onClick: () => logout(false),
      isDisabled: false,
    },
  ];

  useEffect(() => {
    if (notificationsData?.pages) {
      // Updated: access .records directly (no .data wrapper)
      const flattenedNotifications = notificationsData.pages.flatMap(
        (page: any) => page?.records || []
      );
      setNotifications(flattenedNotifications);
    }
  }, [notificationsData]);

  useEffect(() => {
    if (data) {
      setProfile(data);
    }
    if (error && error.detail.includes('Invalid token')) {
      logout(true);
    }
  }, [data, error]);

  useEffect(() => {
    const token = getCookie('token');
    if (!token) {
      logout(true);
    }
  }, []);

  useEffect(() => {
    if (usersData) {
      setUserDetails(usersData);
    }
  }, [usersData]);

  // Initialize token expiration from prop
  useEffect(() => {
    if (initialTokenExpiresAt && !tokenExpiresAt) {
      setTokenExpiresAt(initialTokenExpiresAt);
    }
  }, [initialTokenExpiresAt]);

  // Check token expiration every second
  useEffect(() => {
    if (!tokenExpiresAt) return;
    if (isRefreshing) return;

    const checkExpiration = () => {
      if (isRefreshing) return;
      
      const now = Date.now();
      const expiresAt = tokenExpiresAt;
      const remaining = Math.floor((expiresAt - now) / 1000);

      if (remaining <= 0) {
        if (!isRefreshing) {
          setIsExpiring(false);
          setTokenExpiresAt(undefined); // Clear expiration to stop checking
          // Timer reached 0 - session token has expired, logout immediately
          logout(true);
        }
        return;
      }

      // Show warning before expiration (30 seconds for 3-hour tokens)
      if (remaining <= TOKEN_EXPIRATION_WARNING_SECONDS) {
        setIsExpiring(true);
        setTimeRemaining(remaining);
      } else {
        setIsExpiring(false);
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [tokenExpiresAt, router, isRefreshing, isExpiring, deleteCookie, mutate]);

  const handleRenewSession = () => {
    setIsRefreshing(true);
    setIsExpiring(false);
    
    refreshToken(undefined, {
      onSuccess: (data: any) => {
        if (data?.expires_at) {
          setTokenExpiresAt(data.expires_at);
        }
        // Refresh the browser to update all session data
        window.location.reload();
      },
      onError: (error: any) => {
        // Refresh failed, redirect to login
        router.push('/login');
      },
      onSettled: () => {
        setIsRefreshing(false);
      },
    });
  };

  const handleLogoutFromModal = () => {
    setIsLoggingOut(true);
    mutate(void 0, {
      onSuccess: () => {
        // Clear token cookie on client side as well (backup)
        deleteCookie('token');
        router.push('/login');
      },
      onError: (err: any) => {
        // Clear token cookie even on error
        deleteCookie('token');
        router.push('/login');
      },
      onSettled: () => {
        setIsLoggingOut(false);
      },
    });
  };

  const MenuItems = ({ item }: any) => {
    return (
      <>
        {item.href && (
          <Menu.Item>
            {({ active }) => (
              <Link
                href={item.isDisabled ? '#' : item.href}
                className={classNames(
                  'block rounded-md py-2 px-3 text-base font-medium',
                  item.isDisabled ? 'opacity-50 hover:bg-transparent cursor-default' : 'hover:bg-gray-50',
                  active ? 'bg-gray-100' : ''
                )}
              >
                {item.name}
              </Link>
            )}
          </Menu.Item>
        )}
        {!item.href && (
          <Menu.Item>
            {({ active }) => (
              <div onClick={item.onClick}>
                <div
                  className={classNames(
                    'block rounded-md py-2 px-3 text-base font-medium',
                    item.isDisabled ? 'opacity-50 hover:bg-transparent' : 'hover:bg-gray-50',
                    active ? 'bg-gray-100' : ''
                  )}
                >
                  {item.name}
                </div>
              </div>
            )}
          </Menu.Item>
        )}
      </>
    );
  };

  const handleSelectMessage = (chat: {
    appliedJobId: number;
    jobTitle: string;
    applicantName: string;
    applicantPhoto?: string | null;
    applicantInitials: string;
  }) => {
    setSelectedChat(chat);
    setShowChatModal(true);
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const NotificationItem = ({ notification, onMarkAsRead }: { notification: any; onMarkAsRead: (id: number) => void }) => {
    const handleClick = () => {
      if (!notification.is_read) {
        onMarkAsRead(notification.id);
      }
    };

    return (
      <Menu.Item>
        {({ active }) => (
          <Link
            href={notification.url_path || '#'}
            onClick={handleClick}
            className={classNames(
              'block px-4 py-3 border-b border-gray-100 last:border-b-0',
              active ? 'bg-gray-50' : '',
              !notification.is_read ? 'bg-blue-50' : ''
            )}
          >
            <div className='flex items-start gap-2'>
              {!notification.is_read && (
                <span className='mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0' />
              )}
              <div className='flex-1 min-w-0'>
                <p className={classNames(
                  'text-sm truncate',
                  !notification.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                )}>
                  {notification.title || notification.subject || 'Notification'}
                </p>
                <p className='text-xs text-gray-500 truncate mt-0.5'>
                  {notification.message || notification.body || notification.description || ''}
                </p>
                <p className='text-xs text-gray-400 mt-1'>
                  {formatTimeAgo(notification.created_at || notification.timestamp)}
                </p>
              </div>
            </div>
          </Link>
        )}
      </Menu.Item>
    );
  };

  const NotificationDropdown = () => {
    const unreadCount = notifications.filter((n: any) => !n.is_read).length;

    return (
      <Menu as='div' className='relative'>
        <Menu.Button className='relative flex gap-2 items-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 p-2'>
          <span className='sr-only'>Open notification menu</span>
          <BellIcon className='block h-6 w-6 text-blue-800' aria-hidden='true' />
          {unreadCount > 0 && (
            <span className='absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Menu.Button>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 z-[1000] mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden'>
            <div className='px-4 py-3 border-b border-gray-200 flex items-center justify-between'>
              <h3 className='text-sm font-semibold text-gray-900'>Notifications</h3>
              <Link href='/notifications' className='text-xs text-blue-600 hover:text-blue-800'>
                View All
              </Link>
            </div>
            <div className='max-h-80 overflow-y-auto'>
              {isNotificationsLoading ? (
                <div className='px-4 py-6 text-center'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto'></div>
                  <p className='text-sm text-gray-500 mt-2'>Loading...</p>
                </div>
              ) : notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification: any, index: number) => (
                  <NotificationItem key={notification.id || index} notification={notification} onMarkAsRead={markAsRead} />
                ))
              ) : (
                <div className='px-4 py-6 text-center'>
                  <BellIcon className='h-8 w-8 text-gray-300 mx-auto' />
                  <p className='text-sm text-gray-500 mt-2'>No notifications yet</p>
                </div>
              )}
            </div>
            {notifications.length > 5 && (
              <div className='px-4 py-3 border-t border-gray-200 text-center'>
                <Link href='/notifications' className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
                  See all {notifications.length} notifications
                </Link>
              </div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    );
  };

  const PopOverItems = ({ item }: any) => {
    return (
      <>
        {item.href && (
          <Link href={item.href}>
            <div
              className={classNames(
                'block rounded-md py-2 px-3 text-base font-medium',
                item.isDisabled ? 'opacity-50 hover:bg-transparent' : 'hover:bg-gray-50'
              )}
            >
              {item.name}
            </div>
          </Link>
        )}
        {!item.href && (
          <div onClick={item.onClick}>
            <div
              className={classNames(
                'block rounded-md py-2 px-3 text-base font-medium',
                item.isDisabled ? 'opacity-50 hover:bg-transparent' : 'hover:bg-gray-50'
              )}
            >
              {item.name}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Popover
        as='header'
        className={({ open }) =>
          classNames(open ? 'fixed inset-0 z-40 overflow-y-auto' : '', 'bg-white shadow-md relative')
        }
      >
        {({ open }) => (
          <>
            <div className='mx-auto max-w-7xl px-4 py-[0.4rem] sm:px-6 lg:px-8'>
              <div className='relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12 p-2 md:p-8 lg:p-4'>
                <div className='flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-8'>
                  <div className='flex flex-shrink-0 items-center'>
                    <Link 
                      href='/dashboard' 
                      className={firstRoute === 'employer-profile' ? 'pointer-events-none' : ''}
                    >
                      <MainLogo />
                    </Link>
                  </div>
                  <div className={classNames('flex items-center gap-2 ml-4', !hasActiveSubscription ? '' : 'hidden')}>
                    <Link href='/landing-page/pricing' className='bg-blue-300 text-[#355FD0] px-8 py-2 rounded-md'>
                      <p className='text-sm font-bold'>Upgrade Now!</p>
                    </Link>
                  </div>
                </div>
                <div className='flex items-center md:absolute md:inset-y-0 md:right-0 lg:hidden gap-2'>
                  {/* Mobile Messages Button */}
                  <button
                    onClick={() => setShowMessagesModal(true)}
                    className="relative flex gap-2 items-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 p-2"
                  >
                    <span className="sr-only">Open messages</span>
                    <ChatIcon />
                    {totalUnreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                        {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                      </span>
                    )}
                  </button>
                  {/* Mobile Notifications */}
                  <NotificationDropdown />
                  {/* Mobile menu button */}
                  <Popover.Button className='-mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500'>
                    <span className='sr-only'>Open menu</span>
                    {open ? (
                      <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                    ) : (
                      <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                    )}
                  </Popover.Button>
                </div>
                <div className='hidden lg:flex lg:items-center lg:justify-end xl:col-span-4 gap-2'>
                  {/* Messages Button */}
                  <button
                    onClick={() => setShowMessagesModal(true)}
                    className="relative flex gap-2 items-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 p-2"
                  >
                    <span className="sr-only">Open messages</span>
                    <ChatIcon />
                    {totalUnreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                        {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                      </span>
                    )}
                  </button>
                  {/* Notifications */}
                  <NotificationDropdown />
                  {/* Profile dropdown */}
                  <Menu as='div' className='relative ml-5 flex-shrink-0'>
                    <div>
                      <Menu.Button className='flex gap-2 items-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'>
                        <span className='sr-only'>Open user menu</span>
                        {!isProfileLoading && profile ? (
                          profile.logo ? (
                            <img
                              className='rounded-full mx-auto w-[29px] h-[29px]'
                              src={`${profile.logo}`}
                              alt='profile logo'
                            />
                          ) : (
                            <img src={`/assets/no-photo.png`} alt='no-photo' />
                          )
                        ) : (
                          <img src={`/assets/no-photo.png`} alt='no-photo' />
                        )}
                        {!isProfileLoading && (
                          <div className=''>
                            <h3 className='text-sm font-bold'>{profile ? profile.name : '...'}</h3>
                            <p className='text-left text-xs min-w-[140px] max-w-[160px]'>
                              <Timer />
                            </p>
                          </div>
                        )}
                        {isProfileLoading && (
                          <div role='status' className='max-w-sm animate-pulse'>
                            <div className='h-3 bg-gray-200 rounded-full w-32 mt-1 mb-2'></div>
                            <div className='h-3 bg-gray-200 rounded-full w-32'></div>
                          </div>
                        )}
                        <ChevronDownIcon className='h-5 w-5' />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'
                    >
                      <Menu.Items className='absolute right-0 z-[1000] mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        {userNavigation.map((item: any, index: any) => (
                          <MenuItems key={index} item={item} />
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Popover.Panel as='nav' className='lg:hidden' aria-label='Global'>
              <div className='mx-auto max-w-3xl space-y-1 px-2 pb-3 pt-2 sm:px-4'>
                {userNavigation.map((item: any, index: any) => (
                  <PopOverItems key={index} item={item} />
                ))}
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
      <FloatingHelpButton companyName={profile.name} />
      {!hasActiveSubscription && !['manage-subscriptions', 'setup-employer-profile', 'checkout'].includes(firstRoute)}

      {/* Chat Modals */}
      <MessagesModal
        isOpen={showMessagesModal}
        onClose={() => setShowMessagesModal(false)}
        role="employer"
        onSelectEmployerMessage={handleSelectMessage}
      />

      {selectedChat && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setSelectedChat(null);
          }}
          onBack={() => {
            setShowChatModal(false);
            setSelectedChat(null);
            setShowMessagesModal(true);
          }}
          chatType="employer-applicant"
          appliedJobId={selectedChat.appliedJobId}
          subtitle={selectedChat.jobTitle}
          personName={selectedChat.applicantName}
          personPhoto={selectedChat.applicantPhoto}
          personInitials={selectedChat.applicantInitials}
        />
      )}

      <SessionExpirationModal
        isOpen={isExpiring}
        onRenew={handleRenewSession}
        onLogout={handleLogoutFromModal}
        timeRemaining={timeRemaining}
        isRefreshing={isRefreshing}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
};

export default MainHeader;
