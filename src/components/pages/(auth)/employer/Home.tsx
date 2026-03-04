'use client';

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { SmartDashboardItem } from '@/components/SmartPermissions/SmartDashboardItem';
import FloatingProgress from '../../../FloatingProgress';
import FloatingSyncButton from '../../../FloatingSyncButton';

import AddPostLogo from '@/svg/AddPostLogo';
import ScreenApplicantsLogo from '@/svg/ScreenApplicantsLogo';
import OrientLogo from '@/svg/OrientLogo';
import ManageLogo from '@/svg/ManageLogo';
import EvaluationLogo from '@/svg/EvaluationLogo';
import PayrollLogo from '@/svg/PayrollLogo';
import EmployeeSeparationLogo from '@/svg/EmployeeSeparationLogo';
import DoleLogo from '@/svg/DoleLogo';
import SettingsLogo from '@/svg/SettingsLogo';
import EmployeeKitLogo from '@/svg/EmployeeKitLogo';
import AnalyticsLogo from '@/svg/AnalyticsLogo';
import AuditLogsIcon from '@/svg/AuidtLogsIcon';
import TalentSearchIcon from '@/svg/TalentSearchIcon';
import GoPremiumModal from './modals/SubsriptionModals/GoPremiumModal';
import InsufficientPermissionsModal from './modals/InsufficientPermissionsModal';

const Home = ({ loginType, hasActiveSubscription }: { loginType: string, hasActiveSubscription?: boolean }) => {
  const [isGoPremiumModalOpen, setIsGoPremiumModalOpen] = useState(false);
  const [isInsufficientPermissionsModalOpen, setIsInsufficientPermissionsModalOpen] = useState(false);
  const [intendedRedirectLink, setIntendedRedirectLink] = useState<string | null>(null);
  const [restrictedFeatureName, setRestrictedFeatureName] = useState<string>('');

  const handleGrayedOutClick = (link: string, reason: 'subscription' | 'permission', featureName?: string) => {
    setIntendedRedirectLink(link);
    
    if (reason === 'permission') {
      setRestrictedFeatureName(featureName || '');
      setIsInsufficientPermissionsModalOpen(true);
    } else if (reason === 'subscription') {
      setIsGoPremiumModalOpen(true);
    }
  };

  const handleGoPremiumModalClose = () => {
    setIsGoPremiumModalOpen(false);
    // Redirect to the intended page after modal is closed
    if (intendedRedirectLink) {
      window.location.href = intendedRedirectLink;
      setIntendedRedirectLink(null);
    }
  };

  const handlePermissionModalClose = () => {
    setIsInsufficientPermissionsModalOpen(false);
    setIntendedRedirectLink(null);
    setRestrictedFeatureName('');
  };

  const menus = [
    {
      icon: <AddPostLogo />,
      text: 'Post a Job',
      link: '/post-job',
      isAvailable: true,
      isGrayedOut: false,
      permissionId: 'post-job-page',
    },
    {
      icon: <TalentSearchIcon />,
      text: 'Talent Search',
      link: '/talent-search',
      isAvailable: true,
      permissionId: 'talent-search-page',
      isGrayedOut: !hasActiveSubscription,
    },
    {
      icon: <ScreenApplicantsLogo />,
      text: 'Screen Applicants',
      link: '/screen-applicants',
      isAvailable: true,
      isGrayedOut: false,
      permissionId: 'screen-applicant-page',
    },
    {
      icon: <OrientLogo />,
      text: 'Onboarding',
      link: '/orient',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
      permissionId: 'onboarding-page',
    },
    {
      icon: <ManageLogo />,
      text: 'Manage',
      link: '/manage',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
      permissionId: 'manage-page',
    },
    {
      icon: <EvaluationLogo />,
      text: 'Evaluation',
      link: '/evaluation',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
      permissionId: 'evaluation-page',
    },
    // {
    //   icon: <PayrollLogo />,
    //   text: 'Payroll',
    //   link: '/payroll',
    //   isAvailable: true,
    //   isGrayedOut: true,
    // },
    {
      icon: <EmployeeSeparationLogo />,
      text: 'Employee Separation',
      link: '/employee-separation',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
      permissionId: 'employee-separation-page',
    },
    // {
    //   icon: <EmployeeKitLogo />,
    //   text: 'Employee Kit',
    //   link: '/branding-kit',
    //   isAvailable: true,
    //   isGrayedOut: true,
    // },
    {
      icon: <DoleLogo />,
      text: 'DOLE',
      link: '/dole',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
      permissionId: 'dole-page',
    },
    {
      icon: <AnalyticsLogo />,
      text: 'Analytics',
      link: '/analytics',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
      permissionId: 'analytics-page',
    },
    {
      icon: <SettingsLogo />,
      text: 'Settings',
      link: '/settings',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
      permissionId: 'settings-page',
    },
    {
      icon: <AuditLogsIcon />,
      text: 'Audit Logs',
      link: '/audit-logs',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
      permissionId: 'audit-log-page',
    },
  ];

  return (
    <>
      {['yahshua-payroll', 'yg-payroll'].includes(loginType) && <FloatingSyncButton />}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
        <div className='p-2 md:p-8 lg:p-4 relative'>
          <h2 className='text-xl font-bold text-indigo-dye'>Dashboard</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 relative'>
            {menus.map((menu, index) => {
              return (
                <SmartDashboardItem 
                  key={index} 
                  menu={menu} 
                  onGrayedOutClick={handleGrayedOutClick}
                  hasActiveSubscription={hasActiveSubscription}
                />
              );
            })}
          </div>
        </div>
      </div>
      <GoPremiumModal isOpen={isGoPremiumModalOpen} setIsOpen={handleGoPremiumModalClose} />
      <InsufficientPermissionsModal 
        isOpen={isInsufficientPermissionsModalOpen} 
        setIsOpen={handlePermissionModalClose}
        featureName={restrictedFeatureName}
      />
    </>
  );
};

export default Home;