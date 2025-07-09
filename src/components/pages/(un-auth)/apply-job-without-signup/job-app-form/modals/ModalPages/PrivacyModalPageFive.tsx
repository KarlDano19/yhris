import { Dispatch, useEffect, useRef, useState } from 'react';

import Select from 'react-select';
import { Dialog, Transition } from '@headlessui/react';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';
import classNames from '@/helpers/classNames';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

export default function PrivacyModaPagelFive({
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
                <li className='text-base font-semibold mb-3 mt-6'>X. Rights of a Data Subject</li>
                <div className='space-y-3'>
                  <p className='text-sm'>
                    Under the DPA, you have the right to be informed regarding processing the personal information we
                    hold about you.
                  </p>
                  <p className='text-sm'>Further, you may be entitled to request:</p>
                  <ul className='list-decimal pl-5 text-sm'>
                    <li>
                      Access to personal information we process about you. It is your right to obtain confirmation on
                      whether or not data relating to you are being processed;
                    </li>
                    <li>
                      Rectification of your personal information. This is your right to have your personal information
                      corrected if it is inaccurate or incomplete;
                    </li>
                    <li>Erasure or blocking of your personal information whenever warranted;</li>
                    <li>
                      The right to object if the personal information processing involved is based on consent or on
                      legitimate interest;
                    </li>
                    <li>
                      The right to data portability through which you may obtain and electronically move, copy, or
                      transfer your data securely for further use
                    </li>
                  </ul>
                  <p className='text-sm'>
                    Once you have registered as our customer/client, you may access your account details and request
                    correction of your personal information by sending us an email through this email address:
                    <span className='font-semibold'>dpo@yahshuagroup.com / dpo@abba.works</span>.
                  </p>
                  <p className='text-sm'>
                    You may claim compensation if you believe you suffered damages due to inaccurate, incomplete,
                    outdated, false, unlawfully obtained, or unauthorized use of personal information or for violating
                    your rights and freedoms as a data subject.
                  </p>
                  <p className='text-sm'>
                    Should you think that your personal information has been misused, maliciously disclosed, or
                    improperly disposed of or that your data privacy rights have been violated, you have a right to file
                    a complaint with the NPC.
                  </p>
                  <p className='text-sm'>
                    Our channels are open for any concerns you would like to bring to our attention. You may email us at
                    dpo@yahshuagroup.com / dpo@abba.works to lodge a complaint. We will ensure that your complaint is
                    addressed and that it will remain confidential especially where the subject matter of the complaint
                    is sensitive.
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
