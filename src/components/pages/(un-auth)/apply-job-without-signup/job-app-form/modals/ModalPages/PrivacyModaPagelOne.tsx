import { Dispatch, useEffect, useRef, useState } from 'react';

import Select from 'react-select';
import { Dialog, Transition } from '@headlessui/react';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

export default function PrivacyModaPagelOne({
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
                <li>I. Privacy Policy</li>
                <p className='text-indigo-dye font-bold'>
                  We, at YAHSHUA Outsourcing Worldwide Inc. (YAHSHUA) and The ABBA Initiative, OPC (ABBA), YAHSHUA’s parent company, collectively referred to asYAHSHUA-ABBA, highly regard the privacy of our clients or customers, suppliers or vendors, business or industry partners, employees, interns, shareholders or investors, and by extension, the community we operate in.
                </p>
                <p className='text-indigo-dye font-bold'>
                  We are committed to fully protecting your personal data privacy in compliance with Republic Act No. 10173, otherwise known as the Data Privacy Act of 2012 (DPA), its Implementing Rules and Regulations (IRR), relevant issuances of the National Privacy Commission (NPC) and other related laws, rules, regulations, and issuances.
                </p>
                <p className='text-indigo-dye font-bold'>
                  We shall detail the manner in which we process your personal information and provide a separate privacy notice in an appropriate format and manner whenever we collect personal information through other channels (e.g., publicly accessible data processing online systems, mobile apps, logbook and CCTV in our office, or during events where participants personal information is gathered through attendance sheets, registration forms, or evaluation forms).
                </p>
                <p className='text-indigo-dye font-bold'>
                  In all instances, we assure you that processing your personal information will strictly follow the provisions of DPA, especially the general data privacy principles ofTransparency, Legitimate Purpose, and Proportionality.
                </p>
                <p className='text-indigo-dye font-bold'>
                  By continuing to use YAHSHUA-ABBA products and services and involvement in any YAHSHUA-ABBA activity, such as, but not limited to, systems subscription, sales & marketing events, and promotions, you signify that you have read, understood, and consented to the collection and processing of your personal information in accordance with this Privacy Policy.
                </p>
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
