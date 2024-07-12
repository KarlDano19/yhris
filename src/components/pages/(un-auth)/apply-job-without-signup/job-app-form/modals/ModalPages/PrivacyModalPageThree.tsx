import { Dispatch, useEffect, useRef, useState } from 'react';

import Select from 'react-select';
import { Dialog, Transition } from '@headlessui/react';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

export default function PrivacyModaPagelThree({
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
                <li>V. Methods utilized for automated access</li>
                <p className='text-indigo-dye font-bold'>
                    When you use our websites and engage with them electronically, we use cookies to analyze user engagement, enhance the functionality of our websites, and record your preferences with your explicit consent. Data generated are not shared with any other party.
                </p>
                <p className='text-indigo-dye font-bold'>
                    Moreover, we may collect other personal information that is relevant and necessary for delivering our products or services, as specified in our Terms of Service (ToS) or other client-specific agreements.
                </p>
                <li>VI. Disclosure of Personal Information</li>
                <p className='text-indigo-dye font-bold'>
                    Personal information processed by YAHSHUA-ABBA is not shared with any other party unless such disclosure is allowed under Section 12 or 13 of the DPA.
                </p>
                <p className='text-indigo-dye font-bold'>
                    We share your personal information with our subsidiaries, affiliates, partners, and third-party service providers when it is essential to deliver our products and services or meet legal requirements. Moreover, we disclose only the minimum required
                    personal information to third parties with whom we have established non-disclosure or data-sharing agreements
                </p>
                <li>VII. Risks Involved</li>
                <p className='text-indigo-dye font-bold'>
                    Risk refers to the potential of an incident to result in harm or danger to a data subject or organization. Risks may lead to the unauthorized collection, use, disclosure, or access to personal information. It includes risks involving the confidentiality, integrity, and availability of personal information or the risk that processing will violate the general data privacy principles and the rights of data subjects. YAHSHUA-ABBA ensures that adequate physical, technical, and organizational security measures are in place to protect personal informations confidentiality, integrity, and availability. However, this does not guarantee absolute protection against certain risks involving the processing of personal information, such as when systems are exposed to targeted cyberattacks, malware, ransomware, and computer viruses or when manual records are accessed without authority. However, adequate policies are in place to ensure appropriate security incident management in line with existing data privacy laws, rules, regulations, and issuances.
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
