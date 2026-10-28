'use client';

import { useEffect, useRef } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import { WifiIcon, XMarkIcon } from '@heroicons/react/24/outline';

const OFFLINE_TOAST_ID = 'network-offline';

function OfflineToast() {
  return (
    <div className='pointer-events-auto w-full max-w-sm overflow-hidden rounded-sm bg-orange-500 shadow-lg ring-1 ring-black ring-opacity-5'>
      <div className='px-4 py-3'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <WifiIcon className='h-5 w-5 text-white' aria-hidden='true' />
          </div>
          <div className='ml-3 w-0 flex-1'>
            <p className='mt-1 text-sm text-white'>
              You&apos;re offline. Check your internet connection.
            </p>
          </div>
          <div className='ml-4 flex flex-shrink-0'>
            <button
              type='button'
              className='inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white'
              onClick={() => toast.dismiss(OFFLINE_TOAST_ID)}
            >
              <span className='sr-only'>Close</span>
              <XMarkIcon className='h-7 w-7 text-white' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
      {/* Static bar — no timer, stays until dismissed */}
      <div className='h-1 bg-black bg-opacity-30'>
        <div className='h-full w-full bg-orange-200' />
      </div>
    </div>
  );
}

function NetworkStatusWatcher() {
  const isOnline = useNetworkStatus();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      // On first render, only show toast if already offline
      if (!isOnline) {
        toast.custom(<OfflineToast />, {
          id: OFFLINE_TOAST_ID,
          duration: Infinity,
        });
      }
      return;
    }

    if (!isOnline) {
      toast.custom(<OfflineToast />, {
        id: OFFLINE_TOAST_ID,
        duration: Infinity,
      });
    } else {
      toast.dismiss(OFFLINE_TOAST_ID);
      toast.custom(
        <CustomToast message="You're back online." type='success' duration={3000} />,
        { duration: 3000 }
      );
    }
  }, [isOnline]);

  return null;
}

export default NetworkStatusWatcher;
