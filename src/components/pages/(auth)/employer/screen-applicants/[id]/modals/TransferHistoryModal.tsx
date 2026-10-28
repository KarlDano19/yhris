'use client';

import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { ArrowRightIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

import useGetTransferHistory from '../../hooks/applicant/useGetTransferHistory';

interface TransferHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedJobId: number;
  applicantName?: string;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const TransferHistoryModal = ({ isOpen, onClose, appliedJobId, applicantName }: TransferHistoryModalProps) => {
  const { data: transfers, isLoading, isError } = useGetTransferHistory(appliedJobId, isOpen);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </TransitionChild>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <DialogPanel className='relative transform rounded-lg bg-white shadow-xl transition-all w-full max-w-2xl flex flex-col'>
                {/* Header */}
                <div className='flex bg-savoy-blue p-2 items-center gap-4 flex-shrink-0 rounded-t-lg'>
                  <ArrowsRightLeftIcon className='w-5 h-5 text-white ml-2 flex-shrink-0' />
                  <DialogTitle as='h3' className='flex-1 text-white font-semibold'>
                    Transfer History
                  </DialogTitle>
                  <button type='button' onClick={onClose} className='text-white hover:opacity-80 flex-shrink-0'>
                    <XCircleIcon className='w-8 h-8' />
                  </button>
                </div>

                {/* Body */}
                <div className='px-6 py-4 max-h-[70vh] overflow-y-auto'>
                  {applicantName && (
                    <p className='text-sm text-gray-500 mb-4'>
                      Folder movements for <span className='font-semibold text-gray-700'>{applicantName}</span>
                    </p>
                  )}

                  {isLoading && (
                    <div className='py-10 text-center text-sm text-gray-500'>Loading transfer history...</div>
                  )}

                  {!isLoading && isError && (
                    <div className='py-10 text-center text-sm text-gray-500'>Unable to load transfer history.</div>
                  )}

                  {!isLoading && !isError && (!transfers || transfers.length === 0) && (
                    <div className='py-10 text-center text-sm text-gray-500'>
                      This applicant has not been transferred between job postings.
                    </div>
                  )}

                  {!isLoading && !isError && transfers && transfers.length > 0 && (
                    <ol className='relative border-l border-gray-200 ml-2'>
                      {transfers.map((transfer) => (
                        <li key={transfer.id} className='mb-6 ml-6'>
                          <span className='absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white'>
                            <ArrowsRightLeftIcon className='w-3 h-3 text-blue-600' />
                          </span>
                          <div className='flex flex-wrap items-center gap-2 text-sm font-medium text-gray-800'>
                            <span>{transfer.from_job_posting_title || 'Previous posting'}</span>
                            {transfer.from_stage_title && (
                              <span className='text-xs text-gray-400'>({transfer.from_stage_title})</span>
                            )}
                            <ArrowRightIcon className='w-4 h-4 text-gray-400' />
                            <span>{transfer.to_job_posting_title || 'New posting'}</span>
                            {transfer.to_stage_title && (
                              <span className='text-xs text-gray-400'>({transfer.to_stage_title})</span>
                            )}
                          </div>
                          <div className='mt-1 text-xs text-gray-500'>
                            {formatDate(transfer.created_at)}
                            {transfer.transferred_by_name ? ` · by ${transfer.transferred_by_name}` : ''}
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                {/* Footer */}
                <div className='flex items-center justify-end px-6 py-3 border-t border-gray-100 flex-shrink-0'>
                  <button
                    type='button'
                    onClick={onClose}
                    className='border border-gray-300 rounded-lg py-2 px-5 text-sm text-gray-700 hover:bg-gray-50 font-medium'
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransferHistoryModal;
