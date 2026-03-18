import { Suspense } from 'react';

import AcceptanceMemoView from '@/components/pages/(auth)/employer/onboarding-checklist/acceptance-memo/AcceptanceMemoView';

export const metadata = {
  title: 'Acceptance Memo - Yahshua HRIS',
};

const AcceptanceMemoPage = () => {
  return (
    <Suspense>
      <AcceptanceMemoView />
    </Suspense>
  );
};

export default AcceptanceMemoPage;
