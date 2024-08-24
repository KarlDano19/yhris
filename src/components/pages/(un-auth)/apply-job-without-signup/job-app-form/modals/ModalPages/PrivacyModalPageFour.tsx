import { Dispatch, useEffect, useRef, useState } from 'react';

import Select from 'react-select';
import { Dialog, Transition } from '@headlessui/react';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

export default function PrivacyModaPagelFour({
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
      <div className='h-[450px] overflow-auto pr-2' ref={scrollContainerRef}>
        <div>
          <div className='my-3 text-left sm:mt-3'>
            <div className='mt-2'>
              <ul>
                <li className='text-base font-semibold mb-3 mt-6'>VIII. Storage and Retention</li>
                <div className='space-y-3'>
                  <p className='text-sm'>
                    We store files containing personal information in our laptops and computers, which are kept in a secure environment. We also store your personal information with cloud-based third-party data storage providers. We shall ensure that proper measures are adopted to protect your information.
                  </p>
                  <p className='text-sm'>
                    We maintain personal information in our systems only for as long as necessary to fulfill the purposes for which it was collected, for the establishment, exercise, or defense of legal claims, for legitimate business purposes, or as provided by applicable laws.
                  </p>                 
                </div>
                <li className='text-base font-semibold mb-3 mt-6'>IX. Disposal</li>
                <div className='space-y-3'>
                  <p className='text-sm'>
                    Physical records shall be disposed of through shredding, while digital files shall be anonymized. In all instances, our manner of disposal shall ensure that the personal information shall no longer be retrieved, processed, or accessed by unauthorized persons.
                  </p>
                </div>
              </ul>
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
