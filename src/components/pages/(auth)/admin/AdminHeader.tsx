'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getCookie, deleteCookie } from 'cookies-next';
import toast from 'react-hot-toast';

import { Menu, Transition } from '@headlessui/react';
import classNames from '@/helpers/classNames';
import useGetAdminProfile from '@/components/hooks/useGetAdminProfile';
import CustomToast from '@/components/CustomToast';
import useLogout from '@/components/hooks/useLogout';
import useRefreshToken from '@/components/hooks/useRefreshToken';
import SessionExpirationModal from '@/components/SessionExpirationModal';
import { TOKEN_EXPIRATION_WARNING_SECONDS } from '@/lib/session';
import Timer from '@/components/Timer';

import { Bars3Icon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const AdminHeader = ({
  onToggleSidebar,
  isSidebarOpen,
  initialTokenExpiresAt,
}: {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  initialTokenExpiresAt?: number;
}) => {
  const router = useRouter();
  const { mutate } = useLogout();
  const { mutate: refreshToken } = useRefreshToken();
  const [profile, setProfile] = useState<any>({});
  const [isExpiring, setIsExpiring] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data, isLoading: isProfileLoading } = useGetAdminProfile();

  const logout = (isExpired: boolean) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        if (isExpired) {
          toast.custom(() => <CustomToast message={'Session is expired.'} type='error' />, { duration: 4000 });
        } else {
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        }
        deleteCookie('token');
        location.href = '/login';
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
        location.href = '/login';
      },
    };
    mutate(void 0, callbackReq);
  };

  const userNavigation = [
    { name: 'Settings', href: '', onClick: void 0, isDisabled: true },
    { name: 'Sign out', href: '', onClick: () => logout(false), isDisabled: false },
  ];

  useEffect(() => {
    if (data) {
      setProfile(data);
    }
  }, [data]);

  useEffect(() => {
    const token = getCookie('token');
    if (!token) {
      logout(true);
    }
  }, []);

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
      const remaining = Math.floor((tokenExpiresAt - now) / 1000);

      if (remaining <= 0) {
        if (!isRefreshing) {
          setIsExpiring(false);
          setTokenExpiresAt(undefined);
          logout(true);
        }
        return;
      }

      if (remaining <= TOKEN_EXPIRATION_WARNING_SECONDS) {
        if (!isExpiring) {
          window.dispatchEvent(new Event('session-expiring'));
        }
        setIsExpiring(true);
        setTimeRemaining(remaining);
      } else {
        setIsExpiring(false);
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [tokenExpiresAt, isRefreshing, isExpiring]);

  const handleRenewSession = () => {
    setIsRefreshing(true);
    setIsExpiring(false);

    refreshToken(undefined, {
      onSuccess: (data: any) => {
        if (data?.expires_at) {
          setTokenExpiresAt(data.expires_at);
        }
        window.location.reload();
      },
      onError: () => {
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
        deleteCookie('token');
        router.push('/login');
      },
      onError: () => {
        deleteCookie('token');
        router.push('/login');
      },
      onSettled: () => {
        setIsLoggingOut(false);
      },
    });
  };

  return (
    <>
    <header
      className={classNames(
        isSidebarOpen ? 'shadow-md' : 'border-b border-gray-200',
        'bg-white relative'
      )}
    >
      <div className='w-full pl-2 pr-4 sm:pr-6 lg:pr-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Left: sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            className='p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500'
            aria-label='Toggle sidebar'
          >
            <Bars3Icon className='h-6 w-6' />
          </button>

          {/* Right: profile dropdown — visible on all screen sizes */}
          <Menu as='div' className='relative flex-shrink-0'>
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
                <div>
                  <h3 className='text-sm font-bold text-left'>{profile ? profile.name : '...'}</h3>
                  <p className='text-left text-xs whitespace-nowrap'>
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
              <ChevronDownIcon className='h-5 w-5 text-gray-500' />
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
              <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                {userNavigation.map((item: any, index: any) => (
                  <Menu.Item key={index}>
                    {({ active }) =>
                      item.href ? (
                        <Link href={item.href}>
                          <div
                            className={classNames(
                              'block rounded-md py-2 px-3 text-base font-medium',
                              item.isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
                              active ? 'bg-gray-100' : ''
                            )}
                          >
                            {item.name}
                          </div>
                        </Link>
                      ) : (
                        <div
                          onClick={item.isDisabled ? undefined : item.onClick}
                          className={classNames(
                            'block rounded-md py-2 px-3 text-base font-medium cursor-pointer',
                            item.isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
                            active ? 'bg-gray-100' : ''
                          )}
                        >
                          {item.name}
                        </div>
                      )
                    }
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
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

export default AdminHeader;
