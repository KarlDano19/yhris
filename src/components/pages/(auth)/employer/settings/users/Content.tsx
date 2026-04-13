'use client';

import React from 'react';

import MenuItem from '../../../MenuItem';
import BackButton from '@/components/BackButton';

import UserLogo from '@/svg/UserIcon';
import AccountsIcon from '@/svg/AccountsIcon';

const menus = [
  {
    icon: <AccountsIcon />,
    text: 'Accounts',
    link: '/settings/users/accounts',
    isAvailable: true,
  },
  // {
  //   icon: <UserLogo />,
  //   text: 'User Rights Mapping',
  //   link: '/settings/users/user-rights',
  //   isAvailable: true,
  // },
  {
    icon: <UserLogo />,
    text: 'Roles',
    link: '/settings/users/roles',
    isAvailable: true,
  },
];

const Content = () => {
  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <BackButton label="Settings" />
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