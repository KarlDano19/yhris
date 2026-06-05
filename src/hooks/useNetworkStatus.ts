'use client';

import { useEffect, useState } from 'react';

const PING_URL = 'https://www.google.com/favicon.ico';

async function checkConnectivity(): Promise<boolean> {
  try {
    await fetch(PING_URL, { method: 'HEAD', cache: 'no-store', mode: 'no-cors' });
    return true;
  } catch {
    return false;
  }
}

function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Check connectivity when the user switches back to this tab
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const online = await checkConnectivity();
        setIsOnline(online);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isOnline;
}

export default useNetworkStatus;
