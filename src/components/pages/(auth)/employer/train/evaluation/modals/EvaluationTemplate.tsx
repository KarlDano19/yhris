import React from 'react';
import { Dispatch, Fragment, useRef, useState } from 'react';

import useSaveApplicantProfile from '@/components/pages/(auth)/applicant/setup-applicant-profile/hooks/useSaveApplicantProfile';
import EvaluationFormTab from '../evaluation-form/Tab'
import EvalutaionTemplateTab from '../evaluation-template/Tab'

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon} from '@heroicons/react/24/solid';

export default function CreateEvaluationTabModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
  const [currentTab, setCurrentTab] = useState(1);
  const {mutate, isLoading} = useSaveApplicantProfile();

  const renderButtons=()=>(
    <div
            className={`${
              currentTab <= 1 ? "justify-end" : "justify-between"
            } md:flex mt-10 md:mt-12 mb-7`}
          >
            <button
              type="button"
              className={`${
                currentTab <= 1 ? "hidden" : ""
              } w-full mb-5 md:mb-0 md:w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              onClick={prevTab}
            >
              BACK
            </button>
            <button
              type="submit"
              className="w-full md:w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              // onClick={nextTab}
            >
              {currentTab < 4 ? "NEXT" : (
                isLoading ? (
                  <div
                    className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Submit"
                )
              )}
            </button>
          </div>
  )
  const prevTab = () => {
    if (currentTab > 1) {
      setCurrentTab(currentTab - 1);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setIsOpen}>
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

        <div className='fixed inset-0 z-20 overflow-y-auto'>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create Evaluation Template</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                <div className='px-4 pt-4 pb-6'>
                    {currentTab === 1 ? (
                        <>
                            <EvaluationFormTab />
                            {renderButtons()}
                        </>
                    ) : (
                        <>
                            <EvalutaionTemplateTab />
                            {renderButtons}
                        </>
                    )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
