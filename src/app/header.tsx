'use client';

import { usePathname } from 'next/navigation';

import AdminHeader from '@/components/pages/(auth)/admin/AdminHeader';
import MainHeader from '@/components/pages/(auth)/employer/MainHeader';
import UnauthorizedHeader from '@/components/pages/(un-auth)/UnauthorizedHeader';
import AuthorizedHeader from '@/components/pages/(auth)/applicant/AuthorizedHeader';
import Navigation from '@/components/pages/(un-auth)/landing-page/Navigation';

interface HeaderProps {
  type: string;
  hasProfile: boolean;
  hasActiveSubscription: boolean;
  tokenExpiresAt?: number;
}

function Header({ type, hasProfile, hasActiveSubscription, tokenExpiresAt }: HeaderProps) {
  const pathname = usePathname();
  const listPathname = pathname?.split('/') || [];
  const slicePaths = listPathname.slice(1);
  const firstRoute = slicePaths[0];
  const lastRoute = slicePaths[slicePaths.length - 1];

  const unAuthRoutes: string[] = ['', 'jobs', 'job-app-form', 'pricing'];
  const adminRoutes: string[] = ['admin'];
  const employerRoutes: string[] = [
    'manage-subscriptions',
    'checkout',
    'dashboard',
    'post-job',
    'screen-applicants',
    'screening-question-guideline',
    'orient',
    'manage',
    'employee-separation',
    'employer-profile',
    'setup-employer-profile',
    'admin',
    'evaluation',
    'settings',
    'dole',
    'analytics',
    'audit-logs',
    'talent-search',
    'notifications',
  ];
  const applicantRoutes: string[] = [
    'application-tracker',
    'apply-for-a-job',
    'edit-profile',
    'notification',
    'setup-applicant-profile',
    'job-applicant-form',
  ];
  const noHeaderRoutes: string[] = ['generate-report', 'directives', 'landing-page'];

  return (
    <>
      {!noHeaderRoutes.includes(lastRoute) && (
        <>
          {unAuthRoutes.includes(firstRoute) && <Navigation />}
          {type === 'admin' && adminRoutes.includes(firstRoute) && <AdminHeader />}
          {type === 'employer' && employerRoutes.includes(firstRoute) && (
            <MainHeader
              hasProfile={hasProfile}
              hasActiveSubscription={hasActiveSubscription}
              firstRoute={firstRoute}
              initialTokenExpiresAt={tokenExpiresAt}
            />
          )}
          {type === 'applicant' && applicantRoutes.includes(firstRoute) && (
            <AuthorizedHeader
              hasProfile={hasProfile}
              initialTokenExpiresAt={tokenExpiresAt}
            />
          )}
        </>
      )}
    </>
  );
}

export default Header;
