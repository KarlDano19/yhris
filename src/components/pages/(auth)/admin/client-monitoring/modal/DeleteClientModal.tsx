'use client';

import { Fragment, useRef } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useDeleteClient from '../hooks/useDeleteClient';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employer: { id: number; name: string } | null;
  refetch: () => void;
};

export default function DeleteClientModal({ isOpen, onClose, employer, refetch }: Props) {
  const cancelButtonRef = useRef(null);
  const { mutate: deleteClient, isLoading } = useDeleteClient();

  const handleDelete = () => {
    if (!employer) return;
    deleteClient(employer.id, {
      onSuccess: (res: any) => {
        toast.custom(
          () => <CustomToast message={res?.message || 'Company and all associated data deleted successfully.'} type='success' />,
          { duration: 4000 }
        );
        onClose();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(
          () => <CustomToast message={err?.message || 'Something went wrong.'} type='error' />,
          { duration: 4000 }
        );
      },
    });
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={onClose}>
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
              <DialogPanel className='relative w-full max-w-md transform overflow-hidden rounded-md bg-white shadow-xl transition-all'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Delete Company</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={onClose} />
                </div>

                <div className='px-4 pt-5 pb-4'>
                  <p className='text-sm text-gray-600'>
                    Are you sure you want to delete{' '}
                    <span className='font-semibold text-gray-900'>{employer?.name}</span>?
                  </p>
                  <p className='mt-2 text-sm text-red-600'>
                    This will permanently delete the company and <span className='font-semibold'>all associated data</span> — including all users, employees, job postings, transactions, and more. This action cannot be undone.
                  </p>
                </div>

                <hr />

                <div className='mt-4 sm:flex sm:flex-row-reverse px-4 pb-4'>
                  <button
                    type='button'
                    disabled={isLoading}
                    onClick={handleDelete}
                    className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto disabled:opacity-50'
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    type='button'
                    ref={cancelButtonRef}
                    disabled={isLoading}
                    onClick={onClose}
                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50'
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
