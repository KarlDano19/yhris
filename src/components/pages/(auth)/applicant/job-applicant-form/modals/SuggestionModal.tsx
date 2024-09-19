import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import Confetti from '@/svg/Confetti';
import Link from 'next/link';



interface SuggestionModalProps {
  open: boolean;
  onClose: () => void;
}

const SuggestionModal = ({ open, onClose }: SuggestionModalProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className={`relative z-10 `} onClose={onClose}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6'>
                <div>
                  <div className='mx-auto flex h-28 w-28 items-center justify-center rounded-full'>
                    <Confetti />
                  </div>
                  <div className='mt-3 text-center sm:mt-3'>
                    <Dialog.Title as='h3' className='text-2xl font-semibold text-red-500'>
                      Sorry!
                    </Dialog.Title>
                    <div className='mt-2'>
                      <p className='text-indigo-dye font-bold'>You have submitted a non-pdf file.</p>
                      <p className='text-indigo-dye font-bold'>Try converting your docs here.</p>
                      <p className='text-cyan-500 font-bold'>
                        <button type='button' onClick={() => {
                          window.open("https://www.ilovepdf.com/word_to_pdf");
                        }}>https://www.ilovepdf.com/word_to_pdf</button>
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6'>
                  <button
                    type='button'
                    className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    onClick={onClose}
                  >
                    GO BACK
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SuggestionModal;
