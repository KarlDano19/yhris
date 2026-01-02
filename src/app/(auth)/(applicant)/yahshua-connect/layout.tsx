import { ReactNode } from 'react';
import FloatingHelpButton from "@/components/FloatingHelpButton";

export const metadata = {
  title: "YAHSHUA CONNECT - Connect with Yahshua",
  description: "YAHSHUA Student Information System",
};

export default function YahshuaConnectLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-white border-gray-100 border-t">
        {children}
      </div>
      <FloatingHelpButton />
    </>
  );
}
