'use client';

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

import MenuItem from '../MenuItem';
import FloatingProgress from '../../../FloatingProgress';

import { XMarkIcon } from '@heroicons/react/20/solid';
import AddPostLogo from '@/svg/AddPostLogo';
import ScreenApplicantsLogo from '@/svg/ScreenApplicantsLogo';
import OrientLogo from '@/svg/OrientLogo';
import ManageLogo from '@/svg/ManageLogo';
import TrainLogo from '@/svg/TrainLogo';
import PayrollLogo from '@/svg/PayrollLogo';
import EmployeeSeparationLogo from '@/svg/EmployeeSeparationLogo';
import DoleLogo from '@/svg/DoleLogo';
import SettingsLogo from '@/svg/SettingsLogo';
import EmployeeKitLogo from '@/svg/EmployeeKitLogo';
import SyncingIcon from '@/svg/SyncingIcon';
import ExitIcon from '@/svg/ExitIcon';

const Home = () => {
  const queryClient = useQueryClient();
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };

  const menus = [
    {
      icon: <AddPostLogo />,
      text: 'Post a Job',
      link: '/post-job',
      isAvailable: true,
    },
    {
      icon: <ScreenApplicantsLogo />,
      text: 'Screen Applicants',
      link: '/screen-applicants',
      isAvailable: true,
    },
    {
      icon: <OrientLogo />,
      text: 'Orient',
      link: '/orient',
      isAvailable: true,
    },
    {
      icon: <ManageLogo />,
      text: 'Manage',
      link: '/manage',
      isAvailable: true,
    },
    {
      icon: <TrainLogo />,
      text: 'Train',
      link: '/train',
      isAvailable: true,
    },
    {
      icon: <PayrollLogo />,
      text: 'Payroll',
      link: '/payroll',
      isAvailable: false,
    },
    {
      icon: <EmployeeSeparationLogo />,
      text: 'Employee Separation',
      link: '/employee-separation',
      isAvailable: true,
    },
    {
      icon: <EmployeeKitLogo />,
      text: 'Employee Kit',
      link: '/branding-kit',
      isAvailable: false,
    },
    {
      icon: <DoleLogo />,
      text: 'DOLE',
      link: '/dole',
      isAvailable: true,
    },
    {
      icon: <SettingsLogo />,
      text: 'Settings',
      link: '/settings',
      isAvailable: cachedRigths?.state?.data?.settings_access,
    },
  ];

  return (
    <>
      {/* <FloatingProgress /> */}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
        <div className='p-2 md:p-8 lg:p-4 relative'>
          <h2 className='text-xl font-bold text-indigo-dye'>Dashboard</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 relative'>
            {menus.map((menu, index) => {
              return <MenuItem key={index} menu={menu} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
