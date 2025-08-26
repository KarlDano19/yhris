import { Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import WarningRed from '@/svg/WarningRed';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDiscard: () => void;
  isLoading?: boolean;
  currentTab?: string;
}

export default function UnsavedChangesModal({
  isOpen,
  onClose,
  onSave,
  onDiscard,
  isLoading = false,
  currentTab = 'current tab'
}: UnsavedChangesModalProps) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-60' initialFocus={cancelButtonRef} onClose={onClose}>
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
                    You have unsaved changes in the <span className='text-red-500'>{currentTab}</span>
                  </p>
                  <p className='text-sm md:text-base text-gray-500 mt-2'>
                    Do you want to save your changes before leaving this page?
                  </p>
                </div>
                <div className='flex flex-row justify-center w-full gap-2 md:gap-4 px-4 pt-6 md:pt-8 pb-4 md:pb-6'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-blue-600 px-4 md:px-6 py-2 text-sm font-medium bg-white text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 transition ease-in-out duration-150'
                    onClick={onClose}
                    ref={cancelButtonRef}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent px-4 md:px-6 py-2 text-sm font-medium bg-red-600 text-white shadow-sm hover:bg-red-700 focus:outline-none transition ease-in-out duration-150'
                    onClick={onDiscard}
                    disabled={isLoading}
                  >
                    Discard Changes
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent px-4 md:px-6 py-2 text-sm font-medium bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:outline-none transition ease-in-out duration-150'
                    onClick={onSave}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <div role='status' className='flex items-center'>
                        <svg
                          aria-hidden='true'
                          className='inline w-4 h-4 mr-2 text-gray-200 animate-spin fill-blue-600'
                          viewBox='0 0 100 101'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                            fill='currentColor'
                          />
                          <path
                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                            fill='currentFill'
                          />
                        </svg>
                        <span className='sr-only'>Loading...</span>
                      </div>
                    )}
                    {!isLoading && 'Save Changes'}
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