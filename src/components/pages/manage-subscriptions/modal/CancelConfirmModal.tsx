import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import updateSession from '@/helpers/updateSession';
import useCancelTransaction from '../hooks/useCancelTransaction';

type CancelConfirmModalProps = {
  referenceId: string;
  refetch: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({ referenceId, refetch, isOpen, onClose }) => {
  const { mutate, isLoading } = useCancelTransaction();

  const handleConfirm = () => {
    const callbackReq = {
      onSuccess: async () => {
        await updateSession({ hasPendingTransaction: false });
        refetch();
        onClose();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 4000,
        });
      },
    };
    mutate(referenceId, callbackReq);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='fixed inset-0 z-50 overflow-y-auto' onClose={onClose}>
        <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-30' />
          </Transition.Child>

          <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
              <div>
                {/* Modal content goes here */}
                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                  Cancel Confirmation
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Are you sure you want to cancel?</p>
                </div>
              </div>

              <div className='mt-4'>
                <button
                  type='button'
                  className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? 'Confirming...' : 'Confirm'}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CancelConfirmModal;
