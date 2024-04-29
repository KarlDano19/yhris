'use client';

import { Popover } from '@headlessui/react';

import { usePathname } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';

import toast from 'react-hot-toast';
import useLogout from '@/components/hooks/useLogout';
import classNames from '@/helpers/classNames';
import CustomToast from '@/components/CustomToast';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import CaseSearchIcon from '@/svg/CaseSearchIcon';
import HomeIcon from '@/svg/HomeIcon';
import MainLogo from '@/svg/MainLogo';
import BellIcon from '@/svg/BellIcon';
import ExitIcon from '@/svg/ExitIcon';

const AuthorizedHeader = () => {
  const pathName = usePathname();
  const { mutate, isLoading: isLogoutLoading } = useLogout();
  const logout = () => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        deleteCookie('token');
        deleteCookie('type');
        location.href = '/login';
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 4000,
        });
      },
    };
    mutate(void 0, callbackReq);
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
            <div className={`mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8 `}>
              <div className='flex justify-between lg:gap-8 p-2 md:p-8 lg:p-4'>
                <div className='flex lg:static'>
                  <div className='flex flex-shrink-0 items-center'>
                    <Link href='/apply-for-a-job'>
                      <MainLogo />
                    </Link>
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
                    className={`${
                      pathName === '/apply-for-a-job' || pathName === '/edit-profile'
                        ? 'text-savoy-blue'
                        : 'text-[#6F829B]'
                    } flex items-center font-semibold`}
                  >
                    <HomeIcon
                      className={`${
                        pathName === '/apply-for-a-job' || pathName === '/edit-profile'
                          ? 'fill-savoy-blue'
                          : 'fill-[#6F829B]'
                      } h-5 w-5 mt-1 mr-2.5`}
                    />
                    Home
                  </Link>
                  <Link
                    href='/application-tracker'
                    className={`${
                      pathName === '/application-tracker' ? 'text-savoy-blue' : 'text-[#6F829B]'
                    }  flex items-center font-semibold`}
                  >
                    <CaseSearchIcon
                      className={`${
                        pathName === '/application-tracker' ? 'fill-savoy-blue' : 'fill-[#6F829B]'
                      } h-5 w-5 mt-1.5 mr-2.5`}
                    />
                    Application Tracker
                  </Link>
                  <Link
                    href='/notification'
                    className={`${
                      pathName === '/notification' ? 'text-savoy-blue' : 'text-[#6F829B]'
                    } flex items-center font-semibold`}
                  >
                    <BellIcon
                      className={`${
                        pathName === '/notification' ? 'fill-savoy-blue' : 'fill-[#6F829B]'
                      } h-4 w-4 mr-2.5`}
                    />
                    Notification
                  </Link>
                  <Link
                    href='#'
                    className='flex items-center text-[#6F829B] font-semibold'
                    onClick={(event) => {
                      event.preventDefault();
                      logout();
                    }}
                  >
                    <ExitIcon className='h-4 w-4 mr-2.5 fill-[#6F829B]' />
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
                    className={`${
                      pathName === '/apply-for-a-job' ? 'text-savoy-blue bg-gray-50' : 'text-[#6F829B]'
                    } flex items-center font-semibold px-4 py-4`}
                  >
                    <HomeIcon
                      className={`${
                        pathName === '/apply-for-a-job' ? 'fill-savoy-blue' : 'fill-[#6F829B]'
                      } h-5 w-5 mt-1 mr-2.5`}
                    />
                    Home
                  </Link>
                  <Link
                    href='/application-tracker'
                    className={`${
                      pathName === '/application-tracker' ? 'text-savoy-blue bg-gray-50' : 'text-[#6F829B]'
                    }  flex items-center font-semibold px-4 py-4`}
                  >
                    <CaseSearchIcon
                      className={`${
                        pathName === '/application-tracker' ? 'fill-savoy-blue' : 'fill-[#6F829B]'
                      } h-5 w-5 mt-1.5 mr-2.5`}
                    />
                    Application Tracker
                  </Link>
                  <Link
                    href='/notification'
                    className={`${
                      pathName === '/notification' ? 'text-savoy-blue bg-gray-50' : 'text-[#6F829B]'
                    } flex items-center font-semibold px-4 py-4`}
                  >
                    <BellIcon
                      className={`${
                        pathName === '/notification' ? 'fill-savoy-blue' : 'fill-[#6F829B]'
                      } h-4 w-4 mr-2.5`}
                    />
                    Notification
                  </Link>
                  <Link
                    href='#'
                    className='flex items-center text-[#6F829B] font-semibold px-4 py-4'
                    onClick={(event) => {
                      event.preventDefault();
                      logout();
                    }}
                  >
                    <ExitIcon className='h-4 w-4 mr-2.5 fill-[#6F829B]' />
                    Sign Out
                  </Link>
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </>
  );
};

export default AuthorizedHeader;
