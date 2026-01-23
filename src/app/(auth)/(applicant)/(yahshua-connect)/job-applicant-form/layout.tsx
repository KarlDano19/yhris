import { ReactNode } from 'react';

export default function JobApplicantFormLayout({ children }: { children: ReactNode }) {
  // This layout bypasses the YahshuaConnectLayout wrapper
  // by returning children directly
  return <>{children}</>;
}

