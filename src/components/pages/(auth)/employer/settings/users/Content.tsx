'use client';

import React from 'react';

import Link from 'next/link';

import MenuItem from '../../../MenuItem';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import UserLogo from '@/svg/UserIcon';
import AccountsIcon from '@/svg/AccountsIcon';

const menus = [
  {
    icon: <AccountsIcon />,
    text: 'Accounts',
    link: '/settings/users/accounts',
    isAvailable: true,
  },
  {
    icon: <UserLogo />,
    text: 'User Rights Mapping',
    link: '/settings/users/user-rights',
    isAvailable: false,
  },
];

const Content = () => {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Settings</h4>
        </Link>
      </div>
      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>Users</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6'>
          {menus.map((menu, index) => {
            return <MenuItem key={index} menu={menu} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Content;
