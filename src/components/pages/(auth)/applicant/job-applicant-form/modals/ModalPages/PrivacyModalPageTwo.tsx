import { Dispatch, useEffect, useRef, useState } from 'react';

import Select from 'react-select';
import { Dialog, Transition } from '@headlessui/react';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';
import classNames from '@/helpers/classNames';

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
      <div className='h-[450px] overflow-auto px-6' ref={scrollContainerRef}>
        <div>
          <div className='my-3 text-left sm:mt-3 px-6'>
            <div className='mt-2'>
              <ul>
                <li className='text-base font-semibold mb-3 mt-6'>II. Web App Privacy Notice</li>
                <p className='text-sm'>
                    This Privacy Notice is for the YAHSHUA-ABBA website. These functionalities enable YAHSHUA-ABBA to collect and process your personal information.
                </p>
                <li className='text-base font-semibold mb-3 mt-6'>III. Personal Information Collected and Manner of Collection</li>
                <div className='space-y-3'>
                  <p className='text-sm'>
                      We collect the following personal information from you when you book a call or inquire about YAHSHUA-ABBA’s products and services:
                  </p>
                  <ul className='list-disc pl-5 text-sm'>
                      <li>Name</li>
                      <li>Company Name</li>
                      <li>Email Address</li>
                      <li>Phone Number</li>
                  </ul>
                  <p className='text-sm'>
                      Moreover, we may collect other personal information that is relevant and necessary for delivering our products or services, as specified in our Terms of Service (ToS) or other client-specific agreements.
                  </p>
                </div>
                <li className='text-base font-semibold mb-3 mt-6'>IV. Basis, Use, and Purpose for Processing of Personal Information</li>
                <div className='space-y-3'>
                  <p className='text-sm'>
                      While your consent may be solicited to process your personal information, we may also process personal information without your consent, such as when processing is allowed under Section 12 or Section 13 of the DPA.
                  </p>
                  <p className='text-sm'>
                      In these instances, your personal information is utilized for the following purposes:
                  </p>
                  <ul className='list-disc pl-5 text-sm'>
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
                  <p className='text-sm'>
                      Moreover, we may collect other personal information that is relevant and necessary for delivering our products or services, as specified in our Terms of Service (ToS) or other client-specific agreements.
                  </p>     
                </div>
                <li className='text-base font-semibold mb-3 mt-6'>V. Methods utilized for automated access</li>
                  <div className='space-y-3'>
                    <p className='text-sm'>
                        When you use our websites and engage with them electronically, we use cookies to analyze user engagement, enhance the functionality of our websites, and record your preferences with your explicit consent. Data generated are not shared with any other party.
                    </p>
                    <p className='text-sm'>
                        Moreover, we may collect other personal information that is relevant and necessary for delivering our products or services, as specified in our Terms of Service (ToS) or other client-specific agreements.
                    </p>
                  </div>
              </ul>
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
