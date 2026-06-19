'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useResetOnboarding from '@/components/hooks/useResetOnboarding';
import useGetUserDetails from '@/components/hooks/useGetUserDetails';
import useGetTourProgress from '@/components/hooks/useGetTourProgress';
import useUpdateTourProgress from '@/components/hooks/useUpdateTourProgress';

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
import QuickAccessPanel from './quick-access/QuickAccessPanel';
import { useTour } from '@/components/tour/useTour';
import { TOUR_SEGMENTS, TourSegmentConfig } from '@/components/tour/dashboardTourSteps';

const PAYROLL_LOGIN_TYPES = ['yahshua-payroll', 'yg-payroll'];

const Home = ({ loginType, hasActiveSubscription }: { loginType: string, hasActiveSubscription?: boolean }) => {
  const router = useRouter();
  const { mutate: resetOnboarding, isLoading: isResetting } = useResetOnboarding();
  const { data: usersData, isLoading: isUsersLoading } = useGetUserDetails() as { data: any; isLoading: boolean };
  const isOnboardingEnabled = isUsersLoading ? false : (usersData?.is_onboarding_enabled ?? true);
  const isDeveloper = usersData?.is_developer === true;

  const { startTour, isRunning } = useTour();
  const { data: tourProgress, isLoading: isTourProgressLoading } = useGetTourProgress();
  const { mutate: updateTourProgress } = useUpdateTourProgress();

  const isPayrollUser = PAYROLL_LOGIN_TYPES.includes(loginType);

  // Ordered list of segments that are not yet completed
  const pendingSegments = useMemo<TourSegmentConfig[]>(() => {
    if (!tourProgress) return [];
    return TOUR_SEGMENTS.filter(s => {
      if (s.requiresPayroll && !isPayrollUser) return false;
      return !(tourProgress as any)[`is_${s.key}_tour_done`];
    });
  }, [tourProgress, isPayrollUser]);

  const [isGoPremiumModalOpen, setIsGoPremiumModalOpen] = useState(false);
  const [isInsufficientPermissionsModalOpen, setIsInsufficientPermissionsModalOpen] = useState(false);
  const [intendedRedirectLink, setIntendedRedirectLink] = useState<string | null>(null);
  const [restrictedFeatureName, setRestrictedFeatureName] = useState<string>('');

  const startSegmentTour = useCallback((index: number, segments: TourSegmentConfig[]) => {
    const segment = segments[index];
    if (!segment) return;

    startTour(segment.steps, {
      segmentKey: segment.key,
      onComplete: () => {
        updateTourProgress({ [`is_${segment.key}_tour_done`]: true } as any);
        // For non-cross-page segments, immediately start the next pending one.
        // For cross-page (manage), the settings tour auto-starts when the user
        // returns to the dashboard and tourProgress refetches.
        if (!segment.crossPage) {
          startSegmentTour(index + 1, segments);
        }
      },
      onSkip: () => {
        startSegmentTour(index + 1, segments);
      },
    });
  }, [startTour, updateTourProgress]);

  // Auto-start the first pending segment once data is ready
  useEffect(() => {
    if (isUsersLoading || isTourProgressLoading) return;
    if (isRunning) return;
    if (pendingSegments.length === 0) return;
    const id = setTimeout(() => startSegmentTour(0, pendingSegments), 600);
    return () => clearTimeout(id);
  }, [isUsersLoading, isTourProgressLoading, pendingSegments.length]);

  const handleReset = () => {
    resetOnboarding(undefined, {
      onSuccess: () => router.push('/setup-employer-profile/onboarding-checklist'),
    });
  };

  const handleRestartTour = () => {
    updateTourProgress(
      {
        is_header_tour_done:   false,
        is_sync_tour_done:     false,
        is_manage_tour_done:   false,
        is_settings_tour_done: false,
      },
      {
        onSuccess: () => {
          // pendingSegments will update after the query invalidates;
          // the auto-start effect fires again automatically.
        },
      }
    );
  };

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
      tourId: 'tour-post-job',
    },
    {
      icon: <TalentSearchIcon />,
      text: 'Talent Search',
      link: '/talent-search',
      isAvailable: true,
      permissionId: 'talent-search-page',
      isGrayedOut: !hasActiveSubscription,
      tourId: 'tour-talent-search',
    },
    {
      icon: <ScreenApplicantsLogo />,
      text: 'Screen Applicants',
      link: '/screen-applicants',
      isAvailable: true,
      isGrayedOut: false,
      permissionId: 'screen-applicant-page',
      tourId: 'tour-screen-applicants',
    },
    {
      icon: <OrientLogo />,
      text: 'Onboarding',
      link: '/onboarding',
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
      tourId: 'tour-manage',
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
      tourId: 'tour-analytics',
    },
    {
      icon: <SettingsLogo />,
      text: 'Settings',
      link: '/settings',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
      permissionId: 'settings-page',
      tourId: 'tour-settings',
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
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative'>
        <div className='p-2 md:p-8 lg:p-4 relative'>
          <div className='flex items-center gap-3 flex-wrap'>
            <h2 className='text-xl font-bold text-indigo-dye'>Dashboard</h2>

            {/* Tour help button — always visible so users can restart anytime */}
            {!isRunning && (
              <button
                onClick={handleRestartTour}
                className='flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors'
                title='Take a guided tour of the dashboard'
              >
                <span>?</span>
                <span>Take a tour</span>
              </button>
            )}

            {isDeveloper && isOnboardingEnabled && (
              <button
                onClick={handleReset}
                disabled={isResetting}
                className='text-xs px-2 py-1 rounded border border-red-400 text-red-500 hover:bg-red-50 disabled:opacity-50'
              >
                {isResetting ? 'Resetting...' : 'Reset Onboarding (TESTING)'}
              </button>
            )}
          </div>
          {/* Single responsive grid: mobile stacks QA on top; desktop places QA in col 5. */}
          <div className='grid md:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_1.4fr] gap-6 mt-6'>
            <div className='col-span-1 md:col-span-2 lg:col-span-1 lg:col-start-5 lg:row-start-1 lg:row-span-3 self-start order-first lg:order-none'>
              <QuickAccessPanel
                hasActiveSubscription={hasActiveSubscription}
                onGrayedOutClick={handleGrayedOutClick}
              />
            </div>
            {menus.map((menu, index) => (
              <SmartDashboardItem
                key={index}
                menu={menu}
                onGrayedOutClick={handleGrayedOutClick}
                hasActiveSubscription={hasActiveSubscription}
              />
            ))}
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