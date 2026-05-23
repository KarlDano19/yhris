'use client';

import { Fragment } from 'react';

import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';

interface DPANoticeModalProps {
  open: boolean;
  onAgree: () => void;
  companyName?: string;
}

const DPANoticeModal = ({ open, onAgree, companyName }: DPANoticeModalProps) => {
  const router = useRouter();

  const handleDisagree = () => {
    router.push('/jobs');
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-[10000]' onClose={() => void 0}>
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
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg'>
                {/* Header */}
                <div className='bg-savoy-blue px-6 py-4'>
                  <h3 className='text-white font-semibold text-base text-center'>
                    DATA PROCESSING CONSENT STATEMENT
                  </h3>
                </div>

                {/* Body */}
                <div className='px-6 py-6 space-y-4'>
                  <p className='text-sm text-gray-700 font-medium'>
                    Before you proceed any further, please read the following:
                  </p>

                  <div className='bg-[#EBF3FF] rounded-lg p-4 space-y-3'>
                    <p className='text-sm text-[#2C3F58]'>
                      I hereby voluntarily give my consent to{' '}
                      <strong>{companyName || 'the company'}</strong> to collect, process, store,
                      and use my personal data, including the information and
                      responses I provide in this form, for application
                      processing, assessment, and other legitimate business
                      purposes, in accordance with the{' '}
                      <strong>Data Privacy Act of 2012</strong>.
                    </p>

                    <p className='text-sm text-[#2C3F58]'>
                      I understand that my personal data will be handled with
                      strict confidentiality and will only be accessed by
                      authorized personnel for the stated purposes.
                    </p>

                    <p className='text-sm text-[#2C3F58]'>
                      By proceeding, I confirm that I have read, understood, and
                      agree to the processing of my personal data as stated
                      above.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className='flex flex-col sm:flex-row gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200'>
                  <button
                    type='button'
                    onClick={onAgree}
                    className='flex-1 inline-flex justify-center items-center rounded-md bg-savoy-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-savoy-blue'
                  >
                    I Agree & Continue
                  </button>
                  <button
                    type='button'
                    onClick={handleDisagree}
                    className='flex-1 inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50'
                  >
                    I Disagree — Go Back
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

export default DPANoticeModal;
