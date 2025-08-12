'use client';

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import MenuItem from '../MenuItem';
import FloatingProgress from '../../../FloatingProgress';

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
import AuditLogsIcon from '@/svg/AuidtLogsIcon';
import GoPremiumModal from './modals/SubsriptionModals/GoPremiumModal';

const Home = ({ loginType, hasActiveSubscription }: { loginType: string, hasActiveSubscription?: boolean }) => {
  const [isGoPremiumModalOpen, setIsGoPremiumModalOpen] = useState(false);
  const [intendedRedirectLink, setIntendedRedirectLink] = useState<string | null>(null);

  const handleGrayedOutClick = (link: string) => {
    setIntendedRedirectLink(link);
    setIsGoPremiumModalOpen(true);
  };

  const handleModalClose = () => {
    setIsGoPremiumModalOpen(false);
    // Redirect to the intended page after modal is closed
    if (intendedRedirectLink) {
      window.location.href = intendedRedirectLink;
      setIntendedRedirectLink(null);
    }
  };

  const menus = [
    {
      icon: <AddPostLogo />,
      text: 'Post a Job',
      link: '/post-job',
      isAvailable: true,
      isGrayedOut: false,
    },
    {
      icon: <ScreenApplicantsLogo />,
      text: 'Screen Applicants',
      link: '/screen-applicants',
      isAvailable: true,
      isGrayedOut: false,
    },
    {
      icon: <OrientLogo />,
      text: 'Onboarding',
      link: '/orient',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
    },
    {
      icon: <ManageLogo />,
      text: 'Manage',
      link: '/manage',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
    },
    {
      icon: <TrainLogo />,
      text: 'Train',
      link: '/train',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
    },
    {
      icon: <PayrollLogo />,
      text: 'Payroll',
      link: '/payroll',
      isAvailable: true,
      isGrayedOut: true,
    },
    {
      icon: <EmployeeSeparationLogo />,
      text: 'Employee Separation',
      link: '/employee-separation',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
    },
    {
      icon: <EmployeeKitLogo />,
      text: 'Employee Kit',
      link: '/branding-kit',
      isAvailable: true,
      isGrayedOut: true,
    },
    {
      icon: <DoleLogo />,
      text: 'DOLE',
      link: '/dole',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
    },
    {
      icon: <SettingsLogo />,
      text: 'Settings',
      link: '/settings',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
    },
    {
      icon: <AuditLogsIcon />,
      text: 'Audit Logs',
      link: '/audit-logs',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
    },
  ];

  return (
    <>
      {loginType === 'yahshua-payroll' && <FloatingProgress />}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
        <div className='p-2 md:p-8 lg:p-4 relative'>
          <h2 className='text-xl font-bold text-indigo-dye'>Dashboard</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 relative'>
            {menus.map((menu, index) => {
              return (
                <MenuItem 
                  key={index} 
                  menu={menu} 
                  onGrayedOutClick={handleGrayedOutClick}
                />
              );
            })}
          </div>
        </div>
      </div>
      <GoPremiumModal isOpen={isGoPremiumModalOpen} setIsOpen={handleModalClose} />
    </>
  );
};

export default Home;