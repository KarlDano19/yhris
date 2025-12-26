'use client';

import { Fragment, useEffect, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import WarningRed from '@/svg/WarningRed';

interface SessionExpirationModalProps {
  isOpen: boolean;
  onRenew: () => void;
  onLogout: () => void;
  timeRemaining: number; // seconds remaining
  isRefreshing?: boolean;
  isLoggingOut?: boolean;
}

export default function SessionExpirationModal({
  isOpen,
  onRenew,
  onLogout,
  timeRemaining,
  isRefreshing = false,
  isLoggingOut = false,
}: SessionExpirationModalProps) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    setMinutes(mins);
    setSeconds(secs);
  }, [timeRemaining]);

  // Format time as MM:SS
  const formatTime = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-[60]' initialFocus={cancelButtonRef} onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-[60] overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all my-4 w-full max-w-full mx-2 md:my-8 md:w-[500px]'>
                <div className='flex justify-center py-6 md:py-8 px-2'>
                  <WarningRed />
                </div>
                <div className='px-4 md:px-20 text-center'>
                  <p className='text-lg md:text-xl text-gray-600 font-bold'>
                    Your session will expire in{' '}
                    <span className='font-mono font-semibold text-red-500'>
                      {formatTime(minutes, seconds)}
                    </span>
                    .
                  </p>
                  <p className='text-sm md:text-base text-gray-500 mt-2'>
                    Would you like to renew your session or logout?
                  </p>
                </div>
                <div className='flex flex-row justify-center w-full gap-2 md:gap-4 px-4 pt-8 md:pt-10 pb-5 md:pb-7'>
                  <button
                    type='button'
                    className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-blue-600 px-4 md:px-12 py-1.5 text-sm bg-white leading-5 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={onLogout}
                    ref={cancelButtonRef}
                    disabled={isRefreshing || isLoggingOut}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-transparent px-4 md:px-12 py-1.5 text-sm bg-blue-600 leading-5 font-bold text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={onRenew}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? 'Renewing...' : 'Renew Session'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

