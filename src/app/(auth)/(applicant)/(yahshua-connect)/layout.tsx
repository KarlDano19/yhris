'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import YahshuaConnectLayout from '@/components/pages/(auth)/yahshua-connect/Layout';

export default function YahshuaConnectPageLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isJobApplicantForm = pathname?.includes('/job-applicant-form');
  const isSetupApplicantProfile = pathname?.includes('/setup-applicant-profile');

  // If it's the job-applicant-form or setup-applicant-profile route, skip the YahshuaConnectLayout wrapper
  if (isJobApplicantForm || isSetupApplicantProfile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white border-gray-100 border-t">
      <YahshuaConnectLayout>
        {children}
      </YahshuaConnectLayout>
    </div>
  );
}
