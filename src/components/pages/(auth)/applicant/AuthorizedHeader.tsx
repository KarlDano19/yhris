'use client';

import { useEffect, useState } from 'react';

import { Popover } from '@headlessui/react';

import { usePathname, useRouter } from 'next/navigation';
import {getCookie, deleteCookie } from 'cookies-next';
import Link from 'next/link';

import toast from 'react-hot-toast';

import classNames from '@/helpers/classNames';
import CustomToast from '@/components/CustomToast';
import useLogout from '@/components/hooks/useLogout';
import useRefreshToken from '@/components/hooks/useRefreshToken';
import useGetApplicantProfile from '@/components/hooks/useGetApplicantProfile';
import SessionExpirationModal from '@/components/SessionExpirationModal';
import { TOKEN_EXPIRATION_WARNING_SECONDS } from '@/lib/session';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import CaseSearchIcon from '@/svg/CaseSearchIcon';
import HomeIcon from '@/svg/HomeIcon';
import MainLogo from '@/svg/MainLogo';
import BellIcon from '@/svg/BellIcon';
import ExitIcon from '@/svg/ExitIcon';

interface ErrorDetail {
  detail: string;
}

const AuthorizedHeader = ({ hasProfile, initialTokenExpiresAt }: { hasProfile: boolean; initialTokenExpiresAt?: number }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [isExpiring, setIsExpiring] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    data,
    isLoading: isProfileLoading,
    error,
  } = useGetApplicantProfile() as { data: any; isLoading: boolean; error: ErrorDetail | null };
  const { mutate } = useLogout();
  const { mutate: refreshToken } = useRefreshToken();

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

  useEffect(() => {
    if (error && error.detail === 'string' && error.detail.includes('Invalid token')) {
      logout(true);
    }
  }, [error]);

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

      // Show warning before expiration (5 minutes for 3-hour tokens)
      if (remaining <= TOKEN_EXPIRATION_WARNING_SECONDS) {
        if (!isExpiring) {
          // Dispatch event for draft auto-save before showing modal
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
            <div className={`mx-auto max-w-screen-2xl px-4 py-[0.6rem] sm:px-6 lg:px-8 `}>
              <div className='flex justify-between lg:gap-8 p-2 lg:p-4'>
                <div className='flex lg:static'>
                  <div className='flex flex-shrink-0 items-center'>
                    <MainLogo />
                  </div>
                </div>
                <div className='flex items-center lg:hidden'>
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
                <div className='hidden lg:flex lg:items-center lg:justify-end lg:space-x-10'>
                  <Link
                    href='/apply-for-a-job'
                    className={classNames(
                      'flex items-center font-semibold',
                      pathName === '/apply-for-a-job'
                        ? 'text-savoy-blue'
                        : hasProfile
                        ? 'text-indigo-dye'
                        : 'text-gray-300 pointer-events-none'
                    )}
                  >
                    <HomeIcon
                      className={classNames(
                        'h-5 w-5 mt-1 mr-2.5',
                        pathName === '/apply-for-a-job'
                          ? 'fill-savoy-blue'
                          : hasProfile
                          ? 'fill-indigo-dye'
                          : 'fill-gray-300'
                      )}
                    />
                    Home
                  </Link>
                  <Link
                    href='/application-tracker'
                    className={classNames(
                      'flex items-center font-semibold',
                      pathName === '/application-tracker'
                        ? 'text-savoy-blue'
                        : hasProfile
                        ? 'text-indigo-dye'
                        : 'text-gray-300 pointer-events-none'
                    )}
                  >
                    <CaseSearchIcon
                      className={classNames(
                        'h-5 w-5 mt-1.5 mr-2.5',
                        pathName === '/application-tracker'
                          ? 'fill-savoy-blue'
                          : hasProfile
                          ? 'fill-indigo-dye'
                          : 'fill-gray-300'
                      )}
                    />
                    Application Tracker
                  </Link>
                  <Link
                    href='/notification'
                    className={classNames(
                      'flex items-center font-semibold',
                      pathName === '/notification'
                        ? 'text-savoy-blue'
                        : hasProfile
                        ? 'text-indigo-dye'
                        : 'text-gray-300 pointer-events-none'
                    )}
                  >
                    <BellIcon
                      className={classNames(
                        'h-4 w-4 mr-2.5',
                        pathName === '/notification'
                          ? 'fill-savoy-blue'
                          : hasProfile
                          ? 'fill-indigo-dye'
                          : 'fill-gray-300'
                      )}
                    />
                    Notification
                  </Link>
                  <Link
                    href='#'
                    className='flex items-center text-indigo-dye font-semibold'
                    onClick={(event) => {
                      event.preventDefault();
                      logout(false);
                    }}
                  >
                    <ExitIcon className='h-4 w-4 mr-2.5 fill-indigo-dye' />
                    Sign Out
                  </Link>
                </div>
              </div>
            </div>
            <Popover.Panel as='nav' className='lg:hidden' aria-label='Global'>
              <div className='mx-auto max-w-3xl space-y-1 px-6 pb-3 pt-2 sm:px-14'>
                <div className='shadow rounded-md'>
                  <Link
                    href='/apply-for-a-job'
                    className={classNames(
                      'flex items-center font-semibold px-4 py-4',
                      pathName === '/apply-for-a-job'
                        ? 'text-savoy-blue bg-gray-50'
                        : hasProfile
                        ? 'text-indigo-dye'
                        : 'text-gray-300 pointer-events-none'
                    )}
                  >
                    <HomeIcon
                      className={classNames(
                        'h-5 w-5 mt-1 mr-2.5',
                        pathName === '/apply-for-a-job'
                          ? 'fill-savoy-blue'
                          : hasProfile
                          ? 'fill-indigo-dye'
                          : 'fill-gray-300'
                      )}
                    />
                    Home
                  </Link>
                  <Link
                    href='/application-tracker'
                    className={classNames(
                      'flex items-center font-semibold px-4 py-4',
                      pathName === '/application-tracker'
                        ? 'text-savoy-blue bg-gray-50'
                        : hasProfile
                        ? 'text-indigo-dye'
                        : 'text-gray-300 pointer-events-none'
                    )}
                  >
                    <CaseSearchIcon
                      className={classNames(
                        'h-5 w-5 mt-1.5 mr-2.5',
                        pathName === '/application-tracker'
                          ? 'fill-savoy-blue'
                          : hasProfile
                          ? 'fill-indigo-dye'
                          : 'fill-gray-300'
                      )}
                    />
                    Application Tracker
                  </Link>
                  <Link
                    href='/notification'
                    className={classNames(
                      'flex items-center font-semibold px-4 py-4',
                      pathName === '/notification'
                        ? 'text-savoy-blue bg-gray-50'
                        : hasProfile
                        ? 'text-indigo-dye'
                        : 'text-gray-300 pointer-events-none'
                    )}
                  >
                    <BellIcon
                      className={classNames(
                        'h-4 w-4 mr-2.5',
                        pathName === '/notification'
                          ? 'fill-savoy-blue'
                          : hasProfile
                          ? 'fill-indigo-dye'
                          : 'fill-gray-300'
                      )}
                    />
                    Notification
                  </Link>
                  <Link
                    href='#'
                    className='flex items-center text-indigo-dye font-semibold px-4 py-4'
                    onClick={(event) => {
                      event.preventDefault();
                      logout(false);
                    }}
                  >
                    <ExitIcon className='h-4 w-4 mr-2.5 fill-indigo-dye' />
                    Sign Out
                  </Link>
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
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

export default AuthorizedHeader;
