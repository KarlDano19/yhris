'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ArrowPathIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

import useGetEAF from '../../hooks/eaf/useGetEAF';
import useRegenerateEAF from '../../hooks/eaf/useRegenerateEAF';

const COOLDOWN_SECONDS = 30;

interface EAFModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedJobId: number;
  applicantName?: string;
  applicantEmail?: string;
  positionTitle?: string;
}

export default function EAFModal({
  isOpen,
  onClose,
  appliedJobId,
}: EAFModalProps) {
  const { data: eafData, isLoading, isError } = useGetEAF(appliedJobId, isOpen);
  const regenerate = useRegenerateEAF(appliedJobId);

  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleRegenerate = () => {
    if (cooldown > 0 || regenerate.isLoading) return;
    regenerate.mutate(undefined, {
      onSuccess: startCooldown,
    });
  };

  const isRegenerateDisabled = cooldown > 0 || regenerate.isLoading;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
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

        <div className='fixed inset-0 z-10 overflow-hidden'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform rounded-lg bg-white shadow-xl transition-all w-full max-w-5xl flex flex-col' style={{ height: '90vh' }}>
                {/* Header */}
                <div className='flex bg-savoy-blue p-2 items-center gap-4 flex-shrink-0 rounded-t-lg'>
                  <DocumentTextIcon className='w-5 h-5 text-white ml-2 flex-shrink-0' />
                  <Dialog.Title as='h3' className='flex-1 text-white font-semibold'>
                    Employment Approval Form
                  </Dialog.Title>
                  {eafData?.document_number && (
                    <span className='text-xs text-blue-200 font-mono'>
                      {eafData.document_number}
                    </span>
                  )}
                  <button type='button' onClick={onClose} className='text-white hover:opacity-80 flex-shrink-0 self-start'>
                    <XCircleIcon className='w-8 h-8' />
                  </button>
                </div>

                {/* Body — fills remaining height */}
                <div className='flex-1 overflow-hidden px-6 py-4'>
                  {isLoading && (
                    <div className='flex items-center justify-center h-full text-sm text-gray-500'>
                      Loading EAF...
                    </div>
                  )}

                  {!isLoading && isError && (
                    <div className='flex flex-col items-center justify-center h-full text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200'>
                      <DocumentTextIcon className='w-10 h-10 text-gray-300 mb-2' />
                      <p className='font-medium text-gray-600'>EAF not available</p>
                      <p className='text-xs mt-1 text-center max-w-xs'>This applicant was processed before the EAF feature was introduced.</p>
                    </div>
                  )}

                  {!isLoading && !isError && !eafData?.pdf_url && (
                    <div className='flex flex-col items-center justify-center h-full text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200'>
                      <DocumentTextIcon className='w-10 h-10 text-gray-300 mb-2' />
                      <p className='font-medium text-gray-600'>No EAF generated yet</p>
                      <p className='text-xs mt-1'>Complete the final stage approval to generate the EAF.</p>
                    </div>
                  )}

                  {!isLoading && eafData?.pdf_url && (
                    <iframe
                      src={eafData.pdf_url}
                      title='Employment Approval Form'
                      className='w-full h-full border-0 rounded-lg'
                    />
                  )}
                </div>

                {/* Footer */}
                <div className='flex items-center justify-between px-6 py-3 border-t border-gray-100 flex-shrink-0'>
                  <button
                    type='button'
                    onClick={handleRegenerate}
                    disabled={isRegenerateDisabled}
                    title={cooldown > 0 ? `Available in ${cooldown}s` : 'Regenerate PDF'}
                    className='flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    <ArrowPathIcon className={`w-4 h-4 ${regenerate.isLoading ? 'animate-spin' : ''}`} />
                    {regenerate.isLoading
                      ? 'Regenerating...'
                      : cooldown > 0
                        ? `Regenerate (${cooldown}s)`
                        : 'Regenerate PDF'}
                  </button>
                  <button
                    type='button'
                    onClick={onClose}
                    className='border border-gray-300 rounded-lg py-2 px-5 text-sm text-gray-700 hover:bg-gray-50 font-medium'
                  >
                    Close
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
