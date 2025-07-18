import { Dispatch, Fragment, useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useUpdateApplicantOrient from '../hooks/useUpdateApplicantOrient';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { HandRaisedIcon } from '@heroicons/react/24/outline';

export default function OrientOptionModal({
  selectedOrientId,
  orientItems,
  setOrientItems,
  isOpen,
  setIsOpen,
  setIsNewHireOrientedOpen,
}: {
  selectedOrientId: string;
  orientItems: any;
  setOrientItems: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  setIsNewHireOrientedOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl'>
                  <div className='flex bg-white p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Send Contract</h3>
                    <XCircleIcon className='w-8 h-8 text-stone-300 cursor-pointer' onClick={() => setIsOpen(false)} />
                  </div>
                  <div className='text-center mb-9'>
                    <p className='text-[1.4rem] mb-8 font-semibold'>How do you want to do your orientation?</p>
                    <div className='flex justify-center'>
                    <button
                      className='flex flex-col items-center shadow-md border-[1px] border-savoy-blue rounded-[20px] py-5 mx-4 w-[150px] disabled:opacity-50'
                      disabled={true}
                    >
                      <img className='w-11 h-12 m-2 cursor-pointer' src={`/assets/dolo.png`} />
                      <span className='text-[12px] font-semibold'>YAHSHUA DOLO<br/>Training App</span>
                    </button>
                    <button
                      className='flex flex-col items-center shadow-md border-[1px] border-savoy-blue rounded-[20px] py-5 mx-4 w-[150px] disabled:opacity-50'
                      disabled={true}
                    >
                      <EllipsisHorizontalIcon className='w-14 h-14 text-savoy-blue cursor-pointer' />
                      <span className='text-[12px] font-semibold'>Other<br/>Platforms</span>
                    </button>
                    <button
                      className='flex flex-col items-center shadow-md border-[1px] border-savoy-blue rounded-[20px] py-5 mx-4 w-[150px]'
                      onClick={() => {
                        setIsNewHireOrientedOpen(true);
                        setIsOpen(false);
                      }}
                    >
                      <HandRaisedIcon className='w-11 h-11 m-2 text-savoy-blue cursor-pointer' />
                      <span className='text-[12px] font-semibold'>Manual<br/>Orientation</span>
                    </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
