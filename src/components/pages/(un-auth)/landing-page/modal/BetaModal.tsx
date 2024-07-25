import { Dispatch, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import MainLogo from '@/svg/MainLogo';
import YahshuaHRISLogo from '@/svg/YahshuaHRISLogo';

export default function BetaModal({
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='flex p-2 justify-end'>
                    <XCircleIcon className='w-[19px] h-[19px] text-[#ACB9CB] cursor-pointer mt-1' onClick={() => {setIsOpen(false)}} />
                </div>
                <div className='flex justify-center px-2'>
                  <YahshuaHRISLogo />
                </div>
                <div className='flex justify-center px-2 pt-4'>
                  <h2 className='text-xl font-bold text-center'>Welcome to YAHSHUA HRIS!</h2>
                </div>
                <div className='px-6 pt-3 pb-4'>
                  <h2 className='text-[18px] font-medium text-center'>
                    YAHSHUA HRIS is on <span className='font-bold'>BETA!</span> This means all 
                    information you provide in the Beta version will 
                    carry over to the official release.
                  </h2>
                </div>
                <div className='px-6 pt-3 pb-6'>
                  <h2 className='text-[15px] font-normal text-center'>
                    Rest assured, your data is safe with us. YAHSHUA HRIS, and 
                    all products of The ABBA Initiative, OPC are compliant to the 
                    Data Privacy Act of 2012. Plus, we are ISO 27001 certified and 
                    GDPR compliant with a SOC2 Type 2 attestation.
                  </h2>
                </div>
                <div className='mt-2 px-6 mb-3 flex gap-6 justify-center'>
                    <button
                      type='button'
                      className='inline-flex justify-center drop-shadow-xl rounded-md border border-transparent px-20 py-2 bg-blue-600 text-base leading-6 font-bold text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                      onClick={() => {setIsOpen(false)}}
                    >
                      Got it!
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
