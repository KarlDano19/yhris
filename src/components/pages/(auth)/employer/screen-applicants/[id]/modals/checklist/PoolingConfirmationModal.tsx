'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function PoolingConfirmationModal({ isOpen, onCancel, onConfirm }: Props) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onCancel}>
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
        <div className='fixed inset-0 z-10 overflow-y-auto'>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-6 pb-6 pt-6 shadow-xl transition-all sm:w-full sm:max-w-md'>
                <div className='flex flex-col items-center text-center'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 mb-4'>
                    <ArchiveBoxIcon className='h-8 w-8 text-blue-600' />
                  </div>
                  <Dialog.Title as='h3' className='text-lg font-semibold text-gray-900 mb-2'>
                    Move Applicant to Pool?
                  </Dialog.Title>
                  <p className='text-sm text-gray-600 mb-6'>
                    This will move the applicant to the talent pool for future openings. They will not continue in the current stage of the hiring process.
                  </p>
                  <div className='flex gap-3 w-full'>
                    <button
                      type='button'
                      onClick={onCancel}
                      className='flex-1 border border-gray-300 rounded-lg py-2 px-4 text-gray-700 hover:bg-gray-50 text-sm font-medium'
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={onConfirm}
                      className='flex-1 bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 text-sm font-medium'
                    >
                      Move to Pool
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
