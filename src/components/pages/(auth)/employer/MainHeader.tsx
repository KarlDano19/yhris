'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { getCookie, deleteCookie } from 'cookies-next';
import toast from 'react-hot-toast';

import { Menu, Popover, Transition } from '@headlessui/react';
import classNames from '@/helpers/classNames';
import useGetEmployerProfile from '../../../hooks/useGetEmployerProfile';
import CustomToast from '@/components/CustomToast';
import useLogout from '../../../hooks/useLogout';
import Timer from '../../../Timer';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import MainLogo from '@/svg/MainLogo';

interface ErrorDetail {
  detail: string;
}

const MainHeader = () => {
  const { mutate } = useLogout();
  const [profile, setProfile] = useState<any>({});

  const {
    data,
    isLoading: isProfileLoading,
    error,
  } = useGetEmployerProfile() as { data: any; isLoading: boolean; error: ErrorDetail | null };

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
    { name: 'My Profile', href: '/employer-profile', onClick: void 0, isDisabled: false },
    { name: 'Subscriptions', href: '/manage-subscriptions#active-plans', onClick: void 0, isDisabled: false },
    {
      name: 'Sign out',
      href: '',
      onClick: () => logout(false),
      isDisabled: false,
    },
  ];

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

  const MenuItems = ({ item }: any) => {
    return (
      <>
        {item.href && (
          <Menu.Item>
            {({ active }) => (
              <Link href={item.href}>
                <div
                  className={classNames(
                    'block rounded-md py-2 px-3 text-base font-medium',
                    item.isDisabled ? 'opacity-50 hover:bg-transparent' : 'hover:bg-gray-50',
                    active ? 'bg-gray-100' : ''
                  )}
                >
                  {item.name}
                </div>
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
    </>
  );
};

export default MainHeader;
