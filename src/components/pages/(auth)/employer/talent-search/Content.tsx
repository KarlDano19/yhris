'use client';

import React from 'react';

import Link from 'next/link';

import MenuItem from '../../MenuItem';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import UserLogo from '@/svg/UserIcon';
import GeneralSettingsLogo from '@/svg/GeneralSettingIcon';

const menus = [
  {
    icon: <GeneralSettingsLogo />,
    text: 'General Settings',
    link: '/settings/general-settings',
    isAvailable: true,
  },
  {
    icon: <UserLogo />,
    text: 'Users',
    link: '/settings/users',
    isAvailable: true,
  },
];

const Content = () => {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200 text-xl font-bold text-indigo-dye'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Talent Search</h4>
        </Link>
      </div>
      <div className='px-2 md:px-8 lg:px-4'>
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
