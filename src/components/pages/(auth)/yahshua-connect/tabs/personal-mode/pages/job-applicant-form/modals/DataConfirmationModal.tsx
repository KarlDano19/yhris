import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { DocumentTextIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

interface DataConfirmationModalProps {
  open: boolean;
  onClose: (isConfirmed: boolean) => void;
}

const PRIVACY_STATEMENT_URL = '/privacy-notice';

const DataConfirmationModal = ({ open, onClose }: DataConfirmationModalProps) => {
  const [hasViewed, setHasViewed] = useState(false);

  const handleClose = () => {
    onClose(true);
  };

  const handleCancel = () => {
    setHasViewed(false);
    onClose(false);
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md'>
                {/* Header */}
                <div className='flex items-start p-2 px-6 mb-4'>
                  <h3 className='flex-1 text-[#2C3F58] text-xl font-semibold text-center pr-4'>
                    YAHSHUA-ABBA Privacy Statement for Web App
                  </h3>
                  <XCircleIcon
                    className='w-[19px] h-[19px] text-[#ACB9CB] cursor-pointer mt-1 flex-shrink-0'
                    onClick={handleCancel}
                  />
                </div>

                {/* Body */}
                <div className='px-6 pb-6 space-y-4'>
                  <p className='text-sm text-gray-600 text-center'>
                    Please review the YAHSHUA-ABBA Privacy Statement before submitting your
                    application.
                  </p>

                  {/* Clickable file link */}
                  <a
                    href={PRIVACY_STATEMENT_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={() => setHasViewed(true)}
                    className='flex items-center gap-3 rounded-lg border border-savoy-blue bg-[#EBF3FF] px-4 py-3.5 hover:bg-blue-100 transition-colors group'
                  >
                    <DocumentTextIcon className='h-8 w-8 text-savoy-blue flex-shrink-0' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-savoy-blue truncate'>
                        YAHSHUA-ABBA Privacy Statement for Web App
                      </p>
                      <p className='text-xs text-gray-500 mt-0.5'>Click to view privacy notice</p>
                    </div>
                    <ArrowTopRightOnSquareIcon className='h-5 w-5 text-savoy-blue flex-shrink-0 group-hover:scale-110 transition-transform' />
                  </a>

                  <p className='text-xs text-gray-500 text-center'>
                    By clicking <strong>I Agree</strong>, you confirm that you have read and
                    understood the YAHSHUA-ABBA Privacy Statement and consent to the processing
                    of your personal data for the purposes described therein.
                  </p>
                </div>

                {/* Footer */}
                <div className='bg-[#EBF3FF] py-4 flex justify-center'>
                  <span
                    data-tooltip-id='agree-btn-tooltip'
                    data-tooltip-content={!hasViewed ? 'Please click the privacy notice link above first' : undefined}
                    data-tooltip-place='top'
                    className='w-1/2'
                  >
                    <button
                      type='button'
                      onClick={handleClose}
                      disabled={!hasViewed}
                      className='inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed bg-savoy-blue hover:bg-indigo-500'
                    >
                      I Agree
                    </button>
                  </span>
                  <Tooltip id='agree-btn-tooltip' />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DataConfirmationModal;
