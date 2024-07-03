import {Dispatch, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import SuccessImage from '@/svg/SuccessImage';

export default function ConfirmEditEmployerProfileModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(false)}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[500px]'>
                <div className='flex justify-center py-8 px-2'>
                  <SuccessImage />
                </div>
                <div className='text-xl text-center space-y-4'>
                    <h1 className='font-bold text-3xl text-[#4CAF50]'>Awesome!</h1>
                    <p className='text-lg text-black font-bold whitespace-nowrap'>
                        Profile successfuly saved!
                    </p>
                </div>
                <div className='w-full px-8 space-x-8 pt-10 pb-7 whitespace-nowrap'>
                  <span className='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                    <button
                      type='button'
                      className='inline-flex justify-center drop-shadow-xl w-full rounded-lg border border-blue-600 px-20 py-3 bg-blue-600 text-lg leading-6 font-bold text-white shadow-sm hover:text-white focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                      onClick={() => {
                        setIsOpen(false);
                        window.location.href = '/dashboard';
                      }}
                    >
                      Continue
                    </button>
                  </span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
