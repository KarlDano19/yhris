import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/solid';

import PrivacyModaPagelOne from './ModalPages/PrivacyModaPagelOne';
import PrivacyModalPageTwo from './ModalPages/PrivacyModalPageTwo';
import PrivacyModalPageThree from './ModalPages/PrivacyModalPageThree';
import PrivacyModalPageFive from './ModalPages/PrivacyModalPageFive';
import PrivacyModalPageSix from './ModalPages/PrivacyModalPageSix';

interface DataConfirmationModalProps {
  open: boolean;
  onClose: (isConfirmed: boolean) => void;
}

const ProgressBar = ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => {
  const percentage = Math.round((currentPage / totalPages) * 100);

  return (
    <div className='w-full bg-gray-200 rounded-lg'>
      <div className='h-4 bg-gray-200 rounded-lg relative'>
        <div
          className='absolute inset-0 bg-green-500 rounded-lg'
          style={{ width: `${percentage}%` }}
        />
        <div className='absolute text-xs inset-0 flex items-center justify-center text-black font-bold'>
          {percentage}%
        </div>
      </div>
    </div>
  );
};

const DataConfirmationModal = ({ open, onClose }: DataConfirmationModalProps) => {
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (open) {
      setPageNumber(1);
    }
  }, [open]);

  const handleClose = () => {
    onClose(true);
  };

  const handleCancel = () => {
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
                <div className='mb-4'>
                  <div className='flex p-2'>
                    <h3 className='flex-1 text-[#2C3F58] text-xl px-4 mb-4 font-semibold text-center'>
                      YAHSHUA-ABBA Privacy Statement for Web App
                    </h3>
                    <XCircleIcon
                      className='w-[19px] h-[19px] text-[#ACB9CB] cursor-pointer mt-1'
                      onClick={handleCancel}
                    />
                  </div>
                  <div className='px-6'>
                    <ProgressBar currentPage={pageNumber} totalPages={5} />
                  </div>
                </div>
                <div style={{ display: pageNumber === 1 ? 'block' : 'none' }}>
                  <PrivacyModaPagelOne setPageNumber={setPageNumber} handleNext={() => setPageNumber(2)} />
                </div>
                <div style={{ display: pageNumber === 2 ? 'block' : 'none' }}>
                  <PrivacyModalPageTwo setPageNumber={setPageNumber} handleNext={() => setPageNumber(3)} />
                </div>
                <div style={{ display: pageNumber === 3 ? 'block' : 'none' }}>
                  <PrivacyModalPageThree setPageNumber={setPageNumber} handleNext={() => setPageNumber(4)} />
                </div>
                <div style={{ display: pageNumber === 4 ? 'block' : 'none' }}>
                  <PrivacyModalPageFive setPageNumber={setPageNumber} handleNext={() => setPageNumber(5)} />
                </div>
                <div style={{ display: pageNumber === 5 ? 'block' : 'none' }}>
                  <PrivacyModalPageSix setPageNumber={setPageNumber} handleNext={handleClose} />
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
