'use client';
import React from 'react';
import Image from 'next/image';
import { Fragment } from 'react';
import { Menu, Popover, Transition } from '@headlessui/react';
import classNames from '@/helpers/classNames';
import {
  ArrowTrendingUpIcon,
  Bars3Icon,
  BellIcon,
  FireIcon,
  HomeIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainLogo from '@/svg/MainLogo';
import AccountLogo from '@/svg/AccountLogo';
import useGetProfile from './hooks/useGetProfile';
import dynamic from 'next/dynamic';
const user = {
  name: 'Chelsea Hagon',
  email: 'chelsea.hagon@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'Popular', href: '#', icon: FireIcon, current: false },
  { name: 'Communities', href: '#', icon: UserGroupIcon, current: false },
  { name: 'Trending', href: '#', icon: ArrowTrendingUpIcon, current: false },
];
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];
const Timer = dynamic(() => import('./Timer'), {
  ssr: false,
});
const MainHeader = () => {
  const pathname = usePathname();
  const showHeader = ['/login', '/register'].includes(pathname) ? false : true;
  const { data } = useGetProfile();
  return (
    <Popover
      as='header'
      className={({ open }) =>
        classNames(
          open ? 'fixed inset-0 z-40 overflow-y-auto' : '',
          'bg-white shadow-sm lg:static lg:overflow-y-visible'
        )
      }
    >
      {({ open }) => (
        <>
          {showHeader && (
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12 p-2 md:p-8 lg:p-4'>
                <div className='flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-8'>
                  <div className='flex flex-shrink-0 items-center'>
                    <Link href='/'>
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
                        {data ? (
                          <Image
                            className='rounded-full mx-auto'
                            width='29'
                            height='29'
                            src={`${process.env.hostName}${data.logo}`}
                            alt='profile logo'
                          />
                        ) : (
                          <AccountLogo />
                        )}
                        <div className=''>
                          <h3 className='text-sm font-bold'>
                            {data ? data.name : ''}
                          </h3>
                          <p className='text-xs w-32'>
                            <Timer />
                          </p>
                        </div>
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
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                {item.name}
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
          )}

          <Popover.Panel as='nav' className='lg:hidden' aria-label='Global'>
            <div className='mx-auto max-w-3xl space-y-1 px-2 pb-3 pt-2 sm:px-4'>
              {userNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    'block rounded-md py-2 px-3 text-base font-medium hover:bg-gray-50'
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default MainHeader;
