import { Dispatch, useEffect, useRef, useState } from 'react';

import Select from 'react-select';
import { Dialog, Transition } from '@headlessui/react';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';

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
      <div className='h-[400px] overflow-auto' ref={scrollContainerRef}>
        <div>
          <div className='mt-3 text-left sm:mt-3'>
            <div className='mt-2'>
              <ul>
                <li>XI. Changes to the Privacy Notice</li>
                <p className='text-indigo-dye font-bold'>
                    YAHSHUA-ABBA reserves the right to update or revise this privacy notice at any time to align with evolving policies and legal requirements. Whenever such changes occur, we will diligently inform you by posting the new privacy notice on our website for your information and reference.
                </p>
                <li>XII. Feedback on our Privacy Notice</li>
                <p className='text-indigo-dye font-bold'>
                    Should you have suggestions or comments regarding our privacy statement and notice or for any issues concerning YAHSHUA-ABBAs data privacy practices, you may reach us through:
                </p>
              </ul>
                <p>Data Protection Officer (DPO)</p>
                <p>YAHSHUA Outsourcing Worldwide, Inc.</p>
                <p>The ABBA Initiative, OPC.</p>
                <p>Unit #12 2F E-Max Building</p>
                <p>Masterson Avenue, Upper Balulang</p>
                <p>Cagayan de Oro City, Philippines 9000</p>
                <p>Email: dpo@yahshuagroup.com</p>
                <p> dpo@abba.works</p>
            </div>
          </div>
        </div>
      </div>
      {!atBottom && (
        <div className='mt-5 sm:mt-6 text-center text-red-500'>
          Scroll down to the bottom to enable the button.
        </div>
      )}
      {atBottom && (
        <div className='mt-5 sm:mt-6'>
          <button
            type='button'
            className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
