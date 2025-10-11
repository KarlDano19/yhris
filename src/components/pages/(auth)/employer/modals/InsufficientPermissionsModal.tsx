import { Dispatch, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';

function InsufficientPermissionsModal({ 
  isOpen, 
  setIsOpen, 
  featureName 
}: { 
  isOpen: boolean; 
  setIsOpen: Dispatch<boolean>;
  featureName?: string;
}) {
  const cancelButtonRef = useRef(null);

  const customCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
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
              <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl'>
                <div className='flex justify-end px-4 pt-4'>
                  <XCircleIcon className='w-5 h-5 text-slate-400 cursor-pointer' onClick={() => customCloseModal()} />
                </div>
                <div className='flex justify-center items-center px-4 pb-4'>
                  <div className='flex items-center justify-center w-28 h-28 mr-8 ml-2 bg-red-100 rounded-full'>
                    <LockClosedIcon className='w-16 h-16 text-red-600' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 text-left'>
                      Access Restricted
                    </h3>
                    <p className='text-gray-600 text-left mt-4'>
                      You don't have the necessary permissions to access{' '}
                      <span className='font-semibold text-red-600'>
                        {featureName || 'this feature'}
                      </span>
                      . Please contact your administrator to request access to this module.
                    </p>
                    <div className='bg-amber-50 border border-amber-200 rounded-md p-3 mt-4'>
                      <div className='flex'>
                        <div className='flex-shrink-0'>
                          <svg className='h-5 w-5 text-amber-400' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                          </svg>
                        </div>
                        <div className='ml-3'>
                          <p className='text-sm text-amber-700'>
                            <strong>Note:</strong> Your account is active and properly subscribed. This is a role-based access restriction.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-start gap-2 mt-6'>
                      <button
                        className='bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700'
                        onClick={() => customCloseModal()}
                        ref={cancelButtonRef}
                      >
                        I Understand
                      </button>
                    </div>
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

export default InsufficientPermissionsModal;
