'use client';

import { JobStateProvider } from '@/components/pages/(auth)/yahshua-connect/tabs/business-mode/contexts/JobStateContext';

export default function BusinessModeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JobStateProvider>{children}</JobStateProvider>;
}

