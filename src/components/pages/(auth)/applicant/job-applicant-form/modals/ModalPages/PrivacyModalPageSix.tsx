import { Dispatch, useEffect, useRef, useState } from 'react';

import Select from 'react-select';
import { Dialog, Transition } from '@headlessui/react';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';
import classNames from '@/helpers/classNames';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

export default function PrivacyModaPagelSix({
  setPageNumber,
  handleNext
}: {
  handleNext: () => void;
  setPageNumber: Dispatch<number>;
}) {
  
  const [atBottom, setAtBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
  

  return (
    <>
      <div className='h-[450px] overflow-auto px-6' ref={scrollContainerRef}>
        <div>
          <div className='my-3 text-left sm:mt-3 px-6'>
            <div className='mt-2'>
              <ul>
                <li className='text-base font-semibold mb-3 mt-6'>XI. Changes to the Privacy Notice</li>
                <p className='text-sm'>
                    YAHSHUA-ABBA reserves the right to update or revise this privacy notice at any time to align with evolving policies and legal requirements. Whenever such changes occur, we will diligently inform you by posting the new privacy notice on our website for your information and reference.
                </p>
                <li className='text-base font-semibold mb-3 mt-6'>XII. Feedback on our Privacy Notice</li>
                <p className='text-sm mb-4'>
                    Should you have suggestions or comments regarding our privacy statement and notice or for any issues concerning YAHSHUA-ABBAs data privacy practices, you may reach us through:
                </p>
              </ul>
                <p className='text-sm font-semibold'>Data Protection Officer (DPO)</p>
                <p className='text-sm'>YAHSHUA Outsourcing Worldwide, Inc.</p>
                <p className='text-sm'>The ABBA Initiative, OPC.</p>
                <p className='text-sm'>Unit #12 2F E-Max Building</p>
                <p className='text-sm'>Masterson Avenue, Upper Balulang</p>
                <p className='text-sm'>Cagayan de Oro City, Philippines 9000</p>
                <p className='text-sm'>Email: dpo@yahshuagroup.com</p>
                <p className='text-sm ml-11'> dpo@abba.works</p>
                <p className='text-sm mt-16'>Date last updated: 31 October 2023</p>
            </div>
          </div>
        </div>
      </div>
      <div className={classNames(
        'text-center py-3 bg-[#ACB9CB]',
        !atBottom ? 'bg-[#EBF3FF]' : 'bg-[#EBF3FF]'
        )}
      >
        <button
          type='button'
          disabled={!atBottom}
          className={classNames(
            'inline-flex w-1/2 justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2', 
            !atBottom ? 'bg-[#EBF3FF] border=[#ACB9CB] border text-[#ACB9CB]' : 'bg-savoy-blue hover:bg-indigo-500 focus-visible:outline-indigo-600 text-white')}
          onClick={handleNext}
        >
          {!atBottom ? (
            'Scroll to agree'
          ) : (
            'I agree'
          )}
        </button>
      </div>
      {!atBottom && (
        <div className='text-center font-semibold text-base bg-[#B8C7F0] py-3 text-[#2C3F58]'>
          Please scroll down to Agree
        </div>
      )}
    </>
  );
}
