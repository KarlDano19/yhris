'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useResetOnboarding from '@/components/hooks/useResetOnboarding';
import useGetUserDetails from '@/components/hooks/useGetUserDetails';
import useUpdateTourProgress from '@/components/hooks/useUpdateTourProgress';
import useGetTourProgress from '@/components/hooks/useGetTourProgress';

import { SmartDashboardItem } from '@/components/SmartPermissions/SmartDashboardItem';
import FloatingSyncButton from '../../../FloatingSyncButton';
import { TOUR_SEGMENTS, TourSegmentConfig, getManageSteps } from '@/components/tour/dashboardTourSteps';

import AddPostLogo from '@/svg/AddPostLogo';
import ScreenApplicantsLogo from '@/svg/ScreenApplicantsLogo';
import OrientLogo from '@/svg/OrientLogo';
import ManageLogo from '@/svg/ManageLogo';
import EvaluationLogo from '@/svg/EvaluationLogo';
import EmployeeSeparationLogo from '@/svg/EmployeeSeparationLogo';
import DoleLogo from '@/svg/DoleLogo';
import SettingsLogo from '@/svg/SettingsLogo';
import AnalyticsLogo from '@/svg/AnalyticsLogo';
import AuditLogsIcon from '@/svg/AuidtLogsIcon';
import TalentSearchIcon from '@/svg/TalentSearchIcon';
import GoPremiumModal from './modals/SubsriptionModals/GoPremiumModal';
import InsufficientPermissionsModal from './modals/InsufficientPermissionsModal';
import QuickAccessPanel from './quick-access/QuickAccessPanel';
import TourCompletionModal from './modals/TourCompletionModal';
import { useTour } from '@/components/tour/useTour';
import { tourIsNavigating } from '@/components/tour/TourProvider';

const PAYROLL_LOGIN_TYPES = ['yahshua-payroll', 'yg-payroll'];

const Home = ({ loginType, hasActiveSubscription }: { loginType: string, hasActiveSubscription?: boolean }) => {
  const router = useRouter();
  const { mutate: resetOnboarding, isLoading: isResetting } = useResetOnboarding();
  const { data: usersData, isLoading: isUsersLoading } = useGetUserDetails() as { data: any; isLoading: boolean };
  const isOnboardingEnabled = isUsersLoading ? false : (usersData?.is_onboarding_enabled ?? true);
  const isDeveloper = usersData?.is_developer === true;

  const { isRunning, isNavigating, startTour } = useTour();
  const { mutate: updateTourProgress } = useUpdateTourProgress();
  const { data: tourProgress, isLoading: isTourProgressLoading } = useGetTourProgress();

  const [isTourCompletionModalOpen, setIsTourCompletionModalOpen] = useState(false);
  const [isGoPremiumModalOpen, setIsGoPremiumModalOpen] = useState(false);
  const [isInsufficientPermissionsModalOpen, setIsInsufficientPermissionsModalOpen] = useState(false);
  const [intendedRedirectLink, setIntendedRedirectLink] = useState<string | null>(null);
  const [restrictedFeatureName, setRestrictedFeatureName] = useState<string>('');

  const isPayrollUser = PAYROLL_LOGIN_TYPES.includes(usersData?.login_type ?? '');

  const [snoozedKeys, setSnoozedKeys] = useState<Set<string>>(new Set());

  const snoozeSegment = useCallback((key: string) => {
    setSnoozedKeys(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  // If a synced YP user has a stale 'manage' pending state in localStorage that was
  // saved with the non-YP steps (MANAGE_STEPS_WITH_EMPLOYEE_CREATION), clear it so
  // TourProvider's auto-resume doesn't replay the wrong flow. This runs before the
  // 600ms auto-resume timer fires (React parent effects run before child effects).
  useEffect(() => {
    if (isTourProgressLoading || !tourProgress) return;
    const isSyncDone = Boolean((tourProgress as any).is_sync_tour_done);
    if (!isSyncDone) return;
    try {
      const raw = localStorage.getItem('hris_tour_pending_state');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.segmentKey === 'manage') {
        localStorage.removeItem('hris_tour_pending_state');
      }
    } catch { /* ignore */ }
  }, [isTourProgressLoading, tourProgress]);

  const pendingSegments = useMemo<TourSegmentConfig[]>(() => {
    if (!tourProgress) return [];
    const isSyncDone = Boolean((tourProgress as any).is_sync_tour_done);
    return TOUR_SEGMENTS
      .filter(s => {
        if (s.requiresPayroll && !isPayrollUser) return false;
        if (snoozedKeys.has(s.key)) return false;
        return !(tourProgress as any)[`is_${s.key}_tour_done`];
      })
      .map(s => {
        if (s.key === 'manage') {
          return { ...s, steps: getManageSteps(isSyncDone) };
        }
        return s;
      });
  }, [tourProgress, isPayrollUser, snoozedKeys]);

  const startSegmentTour = useCallback((index: number, segments: TourSegmentConfig[], completedCount = 0) => {
    const segment = segments[index];
    if (!segment) {
      if (completedCount === segments.length) setIsTourCompletionModalOpen(true);
      return;
    }
    startTour(segment.steps, {
      segmentKey: segment.key,
      onComplete: () => {
        if (!segment.crossPage) startSegmentTour(index + 1, segments, completedCount + 1);
      },
      onSkip: () => {
        snoozeSegment(segment.key);
        startSegmentTour(index + 1, segments, completedCount);
      },
    });
  }, [startTour, snoozeSegment]);

  const pendingSegmentsRef = useRef(pendingSegments);
  pendingSegmentsRef.current = pendingSegments;

  const autoStartedRef = useRef(false);

  useEffect(() => {
    const handler = () => { autoStartedRef.current = false; };
    window.addEventListener('tour-abandoned', handler);
    return () => window.removeEventListener('tour-abandoned', handler);
  }, []);

  useEffect(() => {
    if (isUsersLoading || isTourProgressLoading) return;
    if (isRunning || isNavigating || tourIsNavigating) return;
    if (pendingSegments.length === 0) return;
    if (autoStartedRef.current) return;

    autoStartedRef.current = true;
    setTimeout(() => {
      if (pendingSegmentsRef.current.length > 0) {
        startSegmentTour(0, pendingSegmentsRef.current);
      }
    }, 600);
  }, [isUsersLoading, isTourProgressLoading, pendingSegments.length, isRunning, isNavigating]);

  useEffect(() => {
    if (isUsersLoading || isTourProgressLoading) return;
    const flag = localStorage.getItem('hris_show_tour_completion');
    if (!flag) return;
    localStorage.removeItem('hris_show_tour_completion');
    if (pendingSegments.length === 0 && !isRunning) {
      setIsTourCompletionModalOpen(true);
    }
  }, [isUsersLoading, isTourProgressLoading, pendingSegments.length, isRunning]);

  const handleReset = () => {
    resetOnboarding(undefined, {
      onSuccess: () => router.push('/setup-employer-profile/onboarding-checklist'),
    });
  };

  const handleRestartTour = () => {
    autoStartedRef.current = false;
    updateTourProgress(
      {
        is_header_tour_done:   false,
        is_sync_tour_done:     false,
        is_manage_tour_done:   false,
        is_settings_tour_done: false,
      },
      {
        onSuccess: () => {},
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
      text: 'Job Posting',
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
      text: 'Offboarding',
      link: '/offboarding',
      isAvailable: true,
      isGrayedOut: !hasActiveSubscription,
      permissionId: 'offboarding-page',
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
      <TourCompletionModal
        isOpen={isTourCompletionModalOpen}
        onClose={() => setIsTourCompletionModalOpen(false)}
      />
    </>
  );
};

export default Home;