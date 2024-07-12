import { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import Confetti from '@/svg/Confetti';
import Link from 'next/link';
import PrivacyModaPagelOne from './ModalPages/PrivacyModaPagelOne';
import PrivacyModaPagelTwo from './ModalPages/PrivacyModalPageTwo';
import PrivacyModaPagelThree from './ModalPages/PrivacyModalPageThree';
import PrivacyModaPagelFour from './ModalPages/PrivacyModalPageFour';
import PrivacyModaPagelFive from './ModalPages/PrivacyModalPageFive';
import PrivacyModaPagelSix from './ModalPages/PrivacyModalPageSix';

interface DataConfirmationModalProps {
  open: boolean;
  onClose: () => void;
}

const ProgressBar = ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => {
  const percentage = Math.round((currentPage / totalPages) * 100); // Round off to the nearest whole number

  return (
    <div className="w-full bg-gray-200 rounded-lg">
      <div className="h-4 bg-gray-200 rounded-lg relative">
        <div
          className="absolute inset-0 bg-green-500 rounded-lg"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-black font-bold">
          {percentage}%
        </div>
      </div>
    </div>
  );
};

const DataConfirmationModal = ({ open, onClose }: DataConfirmationModalProps) => {
  const [atBottom, setAtBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollHeight, scrollTop, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // Adjusting the logic to correctly detect the bottom with a small buffer
      console.log('scrollHeight:', scrollHeight);
      console.log('scrollTop:', scrollTop);
      console.log('clientHeight:', clientHeight);
      console.log('isAtBottom:', isAtBottom);
      setAtBottom(isAtBottom);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      console.log('Attaching scroll event listener');
      container.addEventListener('scroll', handleScroll);
      return () => {
        console.log('Removing scroll event listener');
        container.removeEventListener('scroll', handleScroll);
      };
    } else {
      console.log('Scroll container is not available');
    }
  }, []);

  useEffect(() => {
    // Check the scroll position initially
    handleScroll();
  }, [open]);

  const firstPageAgree = () => {
    setPageNumber(2)
  }
  const secondPageAgree = () => {
    setPageNumber(3)
  }
  const ThirdPageAgree = () => {
    setPageNumber(4)
  }
  const FourthPageAgree = () => {
    setPageNumber(5)
  }
  const FifthPageAgree = () => {
    setPageNumber(6)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className={`relative z-10`} onClose={onClose}>
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
                <Dialog.Title as='h3' className='text-2xl font-semibold text-red-500'>
                  YAHSHUA-ABBA Privacy Statement for Web App! 2
                </Dialog.Title>
                <ProgressBar currentPage={pageNumber} totalPages={6} />
                <div style={{ display: pageNumber == 1 ? 'block' : 'none' }}>
                  <PrivacyModaPagelOne 
                    setPageNumber={setPageNumber}
                    handleNext={firstPageAgree}
                  />
                </div>
                <div style={{ display: pageNumber == 2 ? 'block' : 'none' }}>
                  <PrivacyModaPagelTwo 
                    setPageNumber={setPageNumber}
                    handleNext={secondPageAgree}
                  />
                </div>
                <div style={{ display: pageNumber == 3 ? 'block' : 'none' }}>
                  <PrivacyModaPagelThree 
                    setPageNumber={setPageNumber}
                    handleNext={ThirdPageAgree}
                  />
                </div>
                <div style={{ display: pageNumber == 4 ? 'block' : 'none' }}>
                  <PrivacyModaPagelFour 
                    setPageNumber={setPageNumber}
                    handleNext={FourthPageAgree}
                  />
                </div>
                <div style={{ display: pageNumber == 5 ? 'block' : 'none' }}>
                  <PrivacyModaPagelFive 
                    setPageNumber={setPageNumber}
                    handleNext={FifthPageAgree}
                  />
                </div>
                <div style={{ display: pageNumber == 6 ? 'block' : 'none' }}>
                  <PrivacyModaPagelSix 
                    setPageNumber={setPageNumber}
                    handleNext={onClose}
                  />
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
