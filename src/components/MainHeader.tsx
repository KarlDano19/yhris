'use client';

import React, { useEffect, useState, Fragment } from 'react';

import { getCookie, deleteCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { Menu, Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import classNames from '@/helpers/classNames';
import MainLogo from '@/svg/MainLogo';
import useGetProfile from './hooks/useGetProfile';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import useLogout from './hooks/useLogout';
import Timer from './Timer';

const MainHeader = () => {
  const pathName = usePathname();
  const listPathname = pathName.split('/');
  const slicePaths = listPathname.slice(1);
  const firstRoute = slicePaths[0];
  const { mutate, isLoading: isLogoutLoading } = useLogout();
  const [profile, setProfile] = useState<any>({});
  const isAllowHeader = !![
    'manage-subscriptions',
    'checkout',
    'dashboard',
    'setup-employer-profile',
    'post-job',
    'screen-applicants',
    'orient',
    'manage',
    'employee-separation',
    'admin',
  ].includes(firstRoute);
  const { data, isLoading: isProfileLoading, error } = useGetProfile();

  const logout = () => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        deleteCookie('token');
        location.href = '/login';
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 4000,
        });
        location.href = '/login';
      },
    };
    mutate({}, callbackReq);
  };

  const userNavigation = [
    { name: 'My Profile', href: void 0, onClick: void 0, isDisabled: true },
    { name: 'Subscriptions', href: '/manage-subscriptions', onClick: void 0, isDisabled: false },
    { name: 'Settings', href: void 0, onClick: void 0, isDisabled: true },
    { name: 'Sign out', href: void 0, onClick: logout, isDisabled: false },
  ];

  useEffect(() => {
    if (data) {
      setProfile(data);
    }
  }, [data]);

  useEffect(() => {
    const token = getCookie('token');
    if (!token) {
      logout();
    }
  }, []);

  return (
    <>
      {isAllowHeader && (
        <Popover
          as='header'
          className={({ open }) =>
            classNames(open ? 'fixed inset-0 z-40 overflow-y-auto' : '', 'bg-white shadow-md relative')
          }
        >
          {({ open }) => (
            <>
              <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12 p-2 md:p-8 lg:p-4'>
                  <div className='flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-8'>
                    <div className='flex flex-shrink-0 items-center'>
                      <Link href='/dashboard'>
                        <MainLogo />
                      </Link>
                    </div>
                  </div>
                  <div className='flex items-center md:absolute md:inset-y-0 md:right-0 lg:hidden'>
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
                  <div className='hidden lg:flex lg:items-center lg:justify-end xl:col-span-4'>
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
                              <p className='text-left text-xs w-32'>
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
                        <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a key={item.name} href={item.href} onClick={item.onClick}>
                                  <div
                                    className={classNames(
                                      'block rounded-md py-2 px-3 text-base font-medium',
                                      item.isDisabled ? 'opacity-50 hover:bg-transparent' : 'hover:bg-gray-50',
                                      active ? 'bg-gray-100' : ''
                                    )}
                                  >
                                    {item.name}
                                  </div>
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>

              <Popover.Panel as='nav' className='lg:hidden' aria-label='Global'>
                <div className='mx-auto max-w-3xl space-y-1 px-2 pb-3 pt-2 sm:px-4'>
                  {userNavigation.map((item) => (
                    <a key={item.name} href={item.href} onClick={item.onClick}>
                      <div
                        className={classNames(
                          'block rounded-md py-2 px-3 text-base font-medium',
                          item.isDisabled ? 'opacity-50 hover:bg-transparent' : 'hover:bg-gray-50'
                        )}
                      >
                        {item.name}
                      </div>
                    </a>
                  ))}
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>
      )}
    </>
  );
};

export default MainHeader;
