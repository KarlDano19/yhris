'use client';

import { usePathname } from 'next/navigation';

import AdminHeader from '@/components/pages/(auth)/admin/AdminHeader';
import MainHeader from '@/components/pages/(auth)/employer/MainHeader';
import UnauthorizedHeader from '@/components/pages/(un-auth)/UnauthorizedHeader';
import AuthorizedHeader from '@/components/pages/(auth)/applicant/AuthorizedHeader';

function Header({ type }: { type: string }) {
  const pathname = usePathname();
  const listPathname = pathname.split('/');
  const slicePaths = listPathname.slice(1);
  const firstRoute = slicePaths[0];

  const unAuthRoutes: any = ['', 'jobs', 'job-app-form', 'pricing'];
  const adminRoutes: any = ['admin'];
  const employerRoutes: any = [
    'manage-subscriptions',
    'checkout',
    'sso',
    'dashboard',
    'post-job',
    'screen-applicants',
    'orient',
    'manage',
    'employee-separation',
    'setup-employer-profile',
    'admin',
  ];
  const applicantRoutes: any = [
    'application-tracker',
    'apply-for-a-job',
    'edit-profile',
    'notification',
    'setup-applicant-profile',
  ];

  return (
    <>
      {unAuthRoutes.includes(firstRoute) && <UnauthorizedHeader />}
      {type === 'admin' && adminRoutes.includes(firstRoute) && <AdminHeader />}
      {type === 'employer' && employerRoutes.includes(firstRoute) && <MainHeader />}
      {type === 'applicant' && applicantRoutes.includes(firstRoute) && <AuthorizedHeader />}
    </>
  );
}

export default Header;
