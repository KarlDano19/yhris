import { Dispatch, useEffect, useRef, useState } from 'react';

import Select from 'react-select';
import { Dialog, Transition } from '@headlessui/react';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

export default function PrivacyModaPagelTwo({
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
                <li>II. Web App Privacy Notice</li>
                <p className='text-indigo-dye font-bold'>
                    This Privacy Notice is for the YAHSHUA-ABBA website. These functionalities enable YAHSHUA-ABBA to collect and process your personal information.
                </p>
                <li>III. Personal Information Collected and Manner of Collection</li>
                <p className='text-indigo-dye font-bold'>
                    We collect the following personal information from you when you book a call or inquire about YAHSHUA-ABBA’s products and services:
                </p>
                <ul>
                    <li>Name</li>
                    <li>Company Name</li>
                    <li>Email Address</li>
                    <li>Phone Number</li>
                </ul>
                <p className='text-indigo-dye font-bold'>
                    Moreover, we may collect other personal information that is relevant and necessary for delivering our products or services, as specified in our Terms of Service (ToS) or other client-specific agreements.
                </p>
                <li>IV. Basis, Use, and Purpose for Processing of Personal Information</li>
                <p className='text-indigo-dye font-bold'>
                    While your consent may be solicited to process your personal information, we may also process personal information without your consent, such as when processing is allowed under Section 12 or Section 13 of the DPA.
                </p>
                <p className='text-indigo-dye font-bold'>
                    
                    In these instances, your personal information is utilized for the following purposes:
                </p>
                <ul>
                    <li>Provide subscribed products and services, along with customer support.</li>
                    <li>Collect your feedback on our offerings.</li>
                    <li>Improve product and service quality based on your feedback and usage.</li>
                    <li>Innovate and develop new products and services to better suit your needs.</li>
                    <li>Personalize your customer experience and deliver tailored content.</li>
                    <li>Market and promote our products and services to you.</li>
                    <li>Share relevant service information and advisories.</li>
                    <li>Ensure compliance with public order, safety and security, and legal requirements.</li>
                    <li>Fulfill legal obligations, including responding to court orders.</li>
                    <li>Address data subjects privacy rights requests promptly.</li>
                </ul>
                <p className='text-indigo-dye font-bold'>
                    Moreover, we may collect other personal information that is relevant and necessary for delivering our products or services, as specified in our Terms of Service (ToS) or other client-specific agreements.
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
