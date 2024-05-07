'use client';

import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';

import Link from 'next/link';

import AddPostLogo from '@/svg/AddPostLogo';
import ScreenApplicantsLogo from '@/svg/ScreenApplicantsLogo';
import OrientLogo from '@/svg/OrientLogo';
import ManageLogo from '@/svg/ManageLogo';
import TrainLogo from '@/svg/TrainLogo';
import PayrollLogo from '@/svg/PayrollLogo';
import EmployeeSeparationLogo from '@/svg/EmployeeSeparationLogo';
import GetHelpLogo from '@/svg/GetHelpLogo';
import SettingsLogo from '@/svg/SettingsLogo';
import EmployeeKitLogo from '@/svg/EmployeeKitLogo';
import SyncingIcon from '@/svg/SyncingIcon';
import ExitIcon from '@/svg/ExitIcon';
import { XMarkIcon } from '@heroicons/react/20/solid';
import FloatingEmployeeProgress from './pages/FloatingEmployeeProgress';

const menus = [
  {
    icon: <AddPostLogo />,
    text: 'Post a Job',
    link: '/post-job',
    isAvailable: true,
    isDisabled: false,
  },
  {
    icon: <ScreenApplicantsLogo />,
    text: 'Screen Applicants',
    link: '/screen-applicants',
    isAvailable: true,
    isDisabled: false,
  },
  {
    icon: <OrientLogo />,
    text: 'Orient',
    link: '/orient',
    isAvailable: true,
    isDisabled: false,
  },
  {
    icon: <ManageLogo />,
    text: 'Manage',
    link: '/manage',
    isAvailable: true,
    isDisabled: false,
  },
  {
    icon: <TrainLogo />,
    text: 'Train',
    link: '/train',
    isAvailable: true,
    isDisabled: false,
  },
  {
    icon: <PayrollLogo />,
    text: 'Payroll',
    link: '/payroll',
    isAvailable: false,
    isDisabled: true,
  },
  {
    icon: <EmployeeSeparationLogo />,
    text: 'Employee Separation',
    link: '/employee-separation',
    isAvailable: true,
    isDisabled: false,
  },
  {
    icon: <EmployeeKitLogo />,
    text: 'Employee Kit',
    link: '/branding-kit',
    isAvailable: false,
    isDisabled: true,
  },
  {
    icon: <GetHelpLogo />,
    text: 'Get Help',
    link: '/get-help',
    isAvailable: false,
    isDisabled: true,
  },
  {
    icon: <SettingsLogo />,
    text: 'Settings',
    link: '/settings',
    isAvailable: false,
    isDisabled: true,
  },
];

const Home = () => {
  return (
    <>
      {/* <FloatingEmployeeProgress /> */}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
        <div className='p-2 md:p-8 lg:p-4 relative'>
          <h2 className='text-xl font-bold text-indigo-dye'>Dashboard</h2>
          <div className='grid grid-cols-5 gap-6 mt-6 relative'>
            {menus.map((menu, index) => {
              return (
                <div key={index} className='h-48 bg-white shadow rounded-lg hover:shadow-md focus:shadow-none'>
                  {menu.isAvailable && (
                    <Link
                      href={menu.link}
                      aria-disabled={true}
                      className='flex flex-col gap-2 items-center justify-center px-4 py-8 mt-2 focus:opacity-80'
                    >
                      {menu.icon}
                      <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
                    </Link>
                  )}
                  {!menu.isAvailable && (
                    <>
                      <div
                        data-tooltip-id='dashboard-item-tooltip'
                        data-tooltip-content='Coming soon.'
                        data-tooltip-place='bottom'
                        aria-disabled={true}
                        className='flex flex-col gap-2 items-center justify-center px-4 py-8 opacity-50'
                      >
                        {menu.icon}
                        <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
                      </div>
                      <Tooltip id='dashboard-item-tooltip' />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
