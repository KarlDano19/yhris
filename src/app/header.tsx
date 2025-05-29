'use client';

import { usePathname } from 'next/navigation';

import AdminHeader from '@/components/pages/(auth)/admin/AdminHeader';
import MainHeader from '@/components/pages/(auth)/employer/MainHeader';
import UnauthorizedHeader from '@/components/pages/(un-auth)/UnauthorizedHeader';
import AuthorizedHeader from '@/components/pages/(auth)/applicant/AuthorizedHeader';

function Header({ type, hasProfile }: { type: string; hasProfile: boolean }) {
  const pathname = usePathname();
  const listPathname = pathname.split('/');
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
    'orient',
    'manage',
    'employee-separation',
    'employer-profile',
    'setup-employer-profile',
    'admin',
    'train',
    'settings',
    'dole',
    'audit-logs',
    'directives',
  ];
  const applicantRoutes: string[] = [
    'application-tracker',
    'apply-for-a-job',
    'edit-profile',
    'notification',
    'setup-applicant-profile',
    'job-applicant-form',
    'directives',
  ];
  const noHeaderRoutes: string[] = ['generate-report'];

  return (
    <>
      {!noHeaderRoutes.includes(lastRoute) && (
        <>
          {unAuthRoutes.includes(firstRoute) && <UnauthorizedHeader />}
          {type === 'admin' && adminRoutes.includes(firstRoute) && <AdminHeader />}
          {type === 'employer' && employerRoutes.includes(firstRoute) && <MainHeader />}
          {type === 'applicant' && applicantRoutes.includes(firstRoute) && <AuthorizedHeader hasProfile={hasProfile} />}
        </>
      )}
    </>
  );
}

export default Header;
