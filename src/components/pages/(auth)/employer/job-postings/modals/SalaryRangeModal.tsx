import { Dispatch, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import Warning from '@/svg/Warning';

export default function SalaryRangeModal({
  setPageNumber,
  isOpen,
  setIsOpen,
  setIsRangeBenefitsAdded,
  setUserDeclinedSalary,
  onSubmit,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  setPageNumber: Dispatch<number>;
  setIsRangeBenefitsAdded: Dispatch<boolean>;
  setUserDeclinedSalary?: Dispatch<boolean>;
  onSubmit: () => void;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-20'
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
      >
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-5 space-y-5'>
                <div className='flex justify-center'>
                  <Warning />
                </div>
                <p className='text-xl font-bold text-gray-900 text-center'>
                  Would you like to indicate the possible salary (the range or
                  the starting amount ) and benefits?
                </p>
                <p className='text-xl font-bold text-gray-900 text-center'>
                  <span>Fun Fact 👇:</span>
                  <br />
                  <span className='text-green-500'>
                    Adding Salary Range and Benefits help attract the right
                    candidates to your company.
                  </span>
                </p>
                <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between'>
                  <button
                    id='salaryRangeYesBtn'
                    type='button'
                    className='text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all'
                    onClick={() => {
                      setIsRangeBenefitsAdded(true);
                      setUserDeclinedSalary?.(false); // Reset declined flag when user chooses to add
                      setIsOpen(false);
                      onSubmit();
                      setPageNumber(3);
                    }}
                  >
                    YES, ADD THEM.
                  </button>
                  <button
                    id='salaryRangeNoBtn'
                    type='button'
                    className='text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
                    onClick={() => {
                      setIsRangeBenefitsAdded(false);
                      setUserDeclinedSalary?.(true); // Mark that user explicitly declined
                      setIsOpen(false);
                      onSubmit();
                      setPageNumber(4);
                    }}
                  >
                    NO DON&#39;T ADD THEM.
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
