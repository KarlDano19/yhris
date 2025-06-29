import { Dispatch, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import updateSession from '@/helpers/updateSession';
import useCancelTransaction from '../hooks/useCancelTransaction';

import { XCircleIcon } from '@heroicons/react/24/solid';

type CancelConfirmModalProps = {
  referenceId: string;
  refetch: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean | null>;
};

const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({ referenceId, refetch, isOpen, setIsOpen }) => {
  const cancelButtonRef = useRef(null);
  const { mutate, isLoading } = useCancelTransaction();

  const handleConfirm = () => {
    const callbackReq = {
      onSuccess: async () => {
        await updateSession({ hasPendingTransaction: false, hasActiveSubscription: false });
        refetch();
        setIsOpen(null);
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
    <Transition.Root show={isOpen ? true : false} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(null)}>
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
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='flex bg-savoy-blue p-2 items-center text-left'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Confirmation</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(null)} />
                </div>
                <div className='text-center'>
                  <div>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-500'>Are you sure you want to cancel?</p>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <button
                      type='button'
                      className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                      onClick={() => setIsOpen(null)}
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CancelConfirmModal;
