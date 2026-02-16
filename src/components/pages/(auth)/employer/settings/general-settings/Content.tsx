'use client';

import React from 'react';

import Link from 'next/link';

import MenuItem from '../../../MenuItem';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import EnvelopeIcon from '@/svg/EnvelopeIcon';
import EmployeeIdLogo from '@/svg/EmployeeIdLogo';
import HiringLogo from '@/svg/HiringLogo';
import ThirdPartyPlaformLogo from '@/svg/ThirdPartyPlaformLogo';
import EmployeeMovementIcon from '@/svg/EmployeeMovementIcon';

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
    link: '/settings/general-settings/employees',
    isAvailable: true,
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
  {
    icon: <EmployeeMovementIcon />,
    text: 'Employee Movement Settings',
    link: '/settings/general-settings/employee-movement',
    isAvailable: true,
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3v2" stroke="#355FD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 19v2" stroke="#355FD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.22 4.22l1.42 1.42" stroke="#355FD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.36 18.36l1.42 1.42" stroke="#355FD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 12h2" stroke="#355FD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12h2" stroke="#355FD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.22 19.78l1.42-1.42" stroke="#355FD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.36 5.64l1.42-1.42" stroke="#355FD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="4" stroke="#355FD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    text: 'Dark Mode',
    link: '/settings/general-settings/dark-mode',
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
