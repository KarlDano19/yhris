import { ReactNode } from 'react';
import FloatingHelpButton from "@/components/FloatingHelpButton";

export const metadata = {
  title: "YAHSHUA SIS - Student Information System",
  description: "YAHSHUA Student Information System",
};

export default function YahshuaSISLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-white border-gray-100 border-t">
        {children}
      </div>
      <FloatingHelpButton />
    </>
  );
}
