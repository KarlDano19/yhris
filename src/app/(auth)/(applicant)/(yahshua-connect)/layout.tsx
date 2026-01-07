import { ReactNode } from 'react';
import FloatingHelpButton from "@/components/FloatingHelpButton";
import YahshuaConnectLayout from '@/components/pages/(auth)/yahshua-connect/Layout';

export const metadata = {
  title: "YAHSHUA CONNECT - Connect with Yahshua",
  description: "YAHSHUA Student Information System",
};

export default function YahshuaConnectPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-white border-gray-100 border-t">
        <YahshuaConnectLayout>
          {children}
        </YahshuaConnectLayout>
      </div>
      <FloatingHelpButton />
    </>
  );
}
