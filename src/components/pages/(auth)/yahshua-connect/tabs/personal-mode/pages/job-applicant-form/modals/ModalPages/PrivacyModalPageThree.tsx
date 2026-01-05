import { Dispatch, useEffect, useRef, useState } from 'react';

import Select from 'react-select';
import { Dialog, Transition } from '@headlessui/react';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';
import classNames from '@/helpers/classNames';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

export default function PrivacyModaPagelThree({
  setPageNumber,
  handleNext,
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
      setAtBottom(isAtBottom);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
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
                <li className='text-base font-semibold mb-3 mt-6'>VI. Disclosure of Personal Information</li>
                <div className='space-y-3'>
                  <p className='text-sm'>
                    Personal information processed by YAHSHUA-ABBA is not shared with any other party unless such
                    disclosure is allowed under Section 12 or 13 of the DPA.
                  </p>
                  <p className='text-sm'>
                  We share your personal information with our subsidiaries, affiliates, partners, and third-party service providers when it is essential to deliver our products and services or meet legal requirements. Moreover, we disclose only the minimum required personal information to third parties with whom we have established non-disclosure or data-sharing agreements.
                  </p>
                </div>
                <li className='text-base font-semibold mb-3 mt-6'>VII. Risks Involved</li>
                <div className='space-y-3'>
                  <p className='text-sm'>
                    Risk refers to the potential of an incident to result in harm or danger to a data subject or
                    organization. Risks may lead to the unauthorized collection, use, disclosure, or access to personal
                    information. It includes risks involving the confidentiality, integrity, and availability of
                    personal information or the risk that processing will violate the general data privacy principles
                    and the rights of data subjects. YAHSHUA-ABBA ensures that adequate physical, technical, and
                    organizational security measures are n place to protect personal information&apos;s
                    confidentiality, integrity, and availability. However, this does not guarantee absolute protection
                    against certain risks involving the processing of personal information, such as when systems are
                    exposed to targeted cyberattacks, malware, ransomware, and computer viruses or when manual records
                    are accessed without authority.
                  </p>
                  <p className='text-sm'>
                    However, adequate policies are in place to ensure appropriate security incident management in line
                    with existing data privacy laws, rules, regulations, and issuances.
                  </p>
                </div>
                <li className='text-base font-semibold mb-3 mt-6'>VIII. Storage and Retention</li>
                <div className='space-y-3'>
                  <p className='text-sm'>
                    We store files containing personal information in our laptops and computers, which are kept in a
                    secure environment. We also store your personal information with cloud-based third-party data
                    storage providers. We shall ensure that proper measures are adopted to protect your information.
                  </p>
                  <p className='text-sm'>
                    We maintain personal information in our systems only for as long as necessary to fulfill the
                    purposes for which it was collected, for the establishment, exercise, or defense of legal claims,
                    for legitimate business purposes, or as provided by applicable laws.
                  </p>
                </div>
                <li className='text-base font-semibold mb-3 mt-6'>IX. Disposal</li>
                <div className='space-y-3'>
                  <p className='text-sm'>
                    Physical records shall be disposed of through shredding, while digital files shall be anonymized. In
                    all instances, our manner of disposal shall ensure that the personal information shall no longer be
                    retrieved, processed, or accessed by unauthorized persons.
                  </p>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={classNames('text-center py-3 bg-[#ACB9CB]', !atBottom ? 'bg-[#EBF3FF]' : 'bg-[#EBF3FF]')}>
        <button
          type='button'
          disabled={!atBottom}
          className={classNames(
            'inline-flex w-1/2 justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
            !atBottom
              ? 'bg-[#EBF3FF] border=[#ACB9CB] border text-[#ACB9CB]'
              : 'bg-savoy-blue hover:bg-indigo-500 focus-visible:outline-indigo-600 text-white'
          )}
          onClick={handleNext}
        >
          {!atBottom ? 'Scroll to agree' : 'I agree'}
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
