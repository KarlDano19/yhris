import {Dispatch, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import SuccessImage from '@/svg/SuccessImage';
import { T_EmployerProfile } from '@/types/globals';

export default function ConfirmEditEmployerProfileModal({
  isOpen,
  setIsOpen,
  confirmSubmit,
  formData
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  confirmSubmit: () => void;
  formData: T_EmployerProfile | null;
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
                        Are you sure you want to save the changes?
                    </p>
                </div>
                <div className='flex flex-row justify-center w-full gap-3 md:gap-8 px-4 pt-8 md:pt-10 pb-5 md:pb-7'>
                  <button
                    type='button'
                    className='inline-flex justify-center w-full rounded-md border border-blue-600 px-6 md:px-20 py-2 text-sm md:text-base bg-white leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 transition ease-in-out duration-150'
                    onClick={() => setIsOpen(false)}
                    ref={cancelButtonRef}
                  >
                    No
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center w-full rounded-md border border-transparent px-6 md:px-20 py-2 text-sm md:text-base bg-blue-600 leading-6 font-bold text-white shadow-sm hover:bg-gray-500 focus:outline-none transition ease-in-out duration-150'
                    onClick={confirmSubmit}
                  >
                    Yes
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