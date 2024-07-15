'use client';

import React from 'react';

import Link from 'next/link';

import MenuItem from '../../../MenuItem';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import EnvelopeIcon from '@/svg/EnvelopeIcon';
import EmployeeIdLogo from '@/svg/EmployeeIdLogo';
import HiringLogo from '@/svg/HiringLogo';
import ThirdPartyPlaformLogo from '@/svg/ThirdPartyPlaformLogo';

const menus = [
  {
    icon: <HiringLogo />,
    text: 'Hiring',
    link: '/settings/general-settings/',
    isAvailable: false,
  },
  {
    icon: <EmployeeIdLogo />,
    text: 'Employees',
    link: '/settings/general-settings/',
    isAvailable: false,
  },
  {
    icon: <EnvelopeIcon />,
    text: 'Email Template',
    link: '/settings/general-settings/email-template',
    isAvailable: true,
  },
  {
    icon: <ThirdPartyPlaformLogo />,
    text: 'Third Party Platform',
    link: '/settings/general-settings/third-party-platform',
    isAvailable: true,
  },
];

const Content = () => {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <Link href='/settings' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Settings</h4>
        </Link>
      </div>
      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>General Settings</h2>
        <div className='grid grid-cols-5 gap-6 mt-6'>
          {menus.map((menu, index) => {
            return <MenuItem key={index} menu={menu} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Content;
