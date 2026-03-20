'use client';

import { useRouter } from 'next/navigation';

import EmployerDetail from '@/components/pages/(auth)/admin/employer-onboarding/onboarding-tracker/modal/EmployerDetailModal';

const EmployerOnboardingDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  return (
    <EmployerDetail
      recordId={params.id}
      onBack={() => router.push('/admin/employer-onboarding/onboarding-tracker')}
    />
  );
};

export default EmployerOnboardingDetailPage;
