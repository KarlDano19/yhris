import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import useResendEmailVerification from '@/components/pages/(all-layout)/login/hooks/useResendEmailVerification';

import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

type EmailVerificationModalProps = {
  email: string;
  isOpen: boolean;
  onClose: () => void;
};

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ email, isOpen, onClose }) => {
  const [isLinkSent, setIsLinkSent] = useState(false);
  const { mutate } = useResendEmailVerification();

  const handleSendLinkAgain = () => {
    const payloads = {
      email: email,
    };
    const callbackReq = {
      onSuccess: (data: any) => {
        setIsLinkSent(true);
        toast.custom(() => <CustomToast message={data} type='success' />, {
          duration: 4000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 4000,
        });
      },
    };
    mutate(payloads, callbackReq);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto flex items-center justify-center'
        onClose={onClose}
      >
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

        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
            <div className='sm:flex sm:items-start'>
              <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                <ExclamationTriangleIcon className='h-6 w-6 text-red-600' aria-hidden='true' />
              </div>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                <Dialog.Title as='h3' className='text-lg leading-6 font-medium text-gray-900'>
                  Email Verification
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>The email has already been sent. Please check and confirm.</p>
                </div>
              </div>
            </div>

            <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
              <button
                type='button'
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                  isLinkSent ? 'cursor-not-allowed opacity-50' : ''
                }`}
                onClick={handleSendLinkAgain}
                disabled={isLinkSent}
              >
                {isLinkSent ? 'Link Sent' : 'Send Link Again'}
              </button>
              <button
                type='button'
                className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default EmailVerificationModal;
