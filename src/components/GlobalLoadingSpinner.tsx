'use client';

import useNavigationSpinner from '@/hooks/useNavigationSpinner';
import YahshuaLoadingLogo from './YahshuaLoadingLogo';

const GlobalLoadingSpinner = () => {
  const { visible } = useNavigationSpinner();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative pointer-events-auto">
        <div className="flex flex-col items-center justify-center">
          <YahshuaLoadingLogo size={96} durationMs={1000} />
          <div className="mt-3 text-xl text-yellow-100 font-semibold">Loading...</div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingSpinner;
