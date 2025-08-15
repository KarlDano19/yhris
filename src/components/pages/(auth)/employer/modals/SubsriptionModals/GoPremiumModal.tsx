import { Dispatch, Fragment, useRef } from 'react';

import Link from 'next/link';

import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/solid';

function GoPremiumModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: Dispatch<boolean> }) {
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
                  <img src='/assets/nerd-face.png' alt='diamond' className='w-28 h-28 mr-8 ml-2' />
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 text-left'>
                      Looks like you’ve tapped on one of our premium modules.
                    </h3>
                    <p className='text-gray-600 text-left mt-4'>
                      Unlock this (and a whole lot more) by{' '}
                      <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#FA7417] to-[#FABE23]'>
                        upgrading to YAHSHUA HRIS Premium
                      </span>{' '}
                      — so you can automate workflows, access advanced tools, and make HR easier than ever.
                    </p>
                    <div className='flex justify-between gap-2 mt-8'>
                      <Link
                        href='/landing-page/pricing'
                        target='_blank'
                        className='bg-gradient-to-r from-[#FA7417] to-[#FABE23] text-white px-8 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#FABE23] hover:to-[#FA7417]'
                      >
                        Go Premium!
                      </Link>
                      <Link
                        href='/features'
                        target='_blank'
                        className='border-2 border-blue-600 text-blue-600 px-8 py-2 rounded-md hover:bg-blue-600 hover:text-white'
                      >
                        Learn More
                      </Link>
                      <button
                        className=' text-gray-600 underline py-2 mr-8'
                        onClick={() => {
                          customCloseModal();
                        }}
                      >
                        Maybe Later
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

export default GoPremiumModal;
