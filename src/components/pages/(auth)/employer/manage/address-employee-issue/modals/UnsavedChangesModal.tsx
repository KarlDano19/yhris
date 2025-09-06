import { Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import WarningRed from '@/svg/WarningRed';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  isSwitchingEmployee?: boolean;
  contentType?: string; // e.g., "email", "investigation", "form", etc.
}

export default function UnsavedChangesModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  isSwitchingEmployee = false,
  contentType = 'email'
}: UnsavedChangesModalProps) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' initialFocus={cancelButtonRef} onClose={onClose}>
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

        <div className='fixed inset-0 z-50 overflow-y-auto'>
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
                    You have <span className='text-red-500'>unsaved changes</span> in your {contentType}.
                  </p>
                  <p className='text-sm md:text-base text-gray-500 mt-2'>
                    {isSwitchingEmployee 
                      ? 'Are you sure you want to switch to another employee? Your current changes will be lost.'
                      : 'Are you sure you want to close this modal? Your current changes will be lost.'
                    }
                  </p>
                </div>
                <div className='flex flex-row justify-center w-full gap-3 md:gap-8 px-4 pt-8 md:pt-10 pb-5 md:pb-7'>
                  <button
                    type='button'
                    className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-blue-600 px-6 md:px-20 py-2 text-sm md:text-base bg-white leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150'
                    onClick={onClose}
                    ref={cancelButtonRef}
                    disabled={isLoading}
                  >
                    No
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-transparent px-6 md:px-20 py-2 text-sm md:text-base bg-blue-600 leading-6 font-bold text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150'
                    onClick={() => {
                      onConfirm();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (isSwitchingEmployee ? 'Switching...' : 'Closing...') : 'Yes'}
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
