import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetEvaluationHistoryDetails from '../hooks/useGetEvaluationHistoryDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';

type T_ModalData = {
  id: number;
  open: boolean;
};

function EvaluationDetailsModal({
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const {
    data: evaluationHistoryData,
    refetch: refetchEvaluationHistory,
    remove: removeEvaluationHistory,
  } = useGetEvaluationHistoryDetails(isOpen.id);
  const [evaluationHistoryDetails, setEvaluationHistoryDetails] = useState<any>(
    {}
  );
  const [evaluationCriterionIndex, setEvaluationCriterionIndex] = useState(0);
  const [evaluationForm, setEvaluationForm] = useState<any[]>([]);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);

  const convertToRoman = (num: number): string => {
    // Define Roman numerals and their corresponding values
    const romanNumerals: { [key: string]: number } = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };

    let romanNumber = '';

    // Iterate through numerals in descending order
    for (const key in romanNumerals) {
      while (num >= romanNumerals[key]) {
        romanNumber += key;
        num -= romanNumerals[key];
      }
    }

    return romanNumber;
  };

  useEffect(() => {
    if (evaluationHistoryData) {
      setEvaluationHistoryDetails(evaluationHistoryData);
    }
  }, [evaluationHistoryData]);

  useEffect(() => {
    if (isOpen.id) {
      refetchEvaluationHistory();
    }
  }, [isOpen.id]);

  useEffect(() => {
    if (evaluationHistoryDetails && evaluationHistoryDetails.form_data) {
      setEvaluationForm(evaluationHistoryDetails.form_data);
    }
  }, [evaluationHistoryDetails]);

  const customCloseModal = () => {
    removeEvaluationHistory();
    setIsOpen(null);
  };

  const handleNext = () => {
    if (currentFormIndex < evaluationForm.length - 1) {
      setCurrentFormIndex(currentFormIndex + 1);
    } else {
      customCloseModal();
    }
  };

  return (
    <div>
      <Transition.Root show={isOpen.open} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={customCloseModal}
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
                <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>
                      Create Work Accident/Illness Report
                    </h3>
                    <XCircleIcon
                      className='w-8 h-8 text-white cursor-pointer'
                      onClick={customCloseModal}
                    />
                  </div>
                  <div>
                    {evaluationForm.length > 0 && (
                      <>
                        <div className='border-2 rounded-lg mx-4 mt-4 mb-12'>
                          {evaluationForm[currentFormIndex].section_title && (
                            <div className='p-6 border-b-2'>
                              <p className='text-[1.2rem] font-semibold'>
                                {convertToRoman(evaluationCriterionIndex + 1)}.{' '}
                                {evaluationForm[currentFormIndex].section_title}
                              </p>
                              <p>
                                {
                                  evaluationForm[currentFormIndex]
                                    .section_description
                                }
                              </p>
                            </div>
                          )}
                          {evaluationForm[currentFormIndex].criterion.map(
                            (criterionItem: any, index: number) => (
                              <div
                                key={index}
                                className='px-[1.55rem] py-4 border-b-2'
                              >
                                <div className='flex justify-between mb-2'>
                                  <div>
                                    {index + 1}. {criterionItem.title}
                                  </div>
                                  <div>
                                    <p className='text-base font-semibold'>
                                      Score:
                                    </p>
                                    {criterionItem.score}
                                    <span className='text-base'>
                                      {' '}
                                      / {criterionItem.max_score}
                                    </span>
                                  </div>
                                </div>
                                <div className='flex justify-between mb-2'>
                                  <div>
                                    <p className='text-base font-semibold'>
                                      Comment:
                                    </p>
                                    {criterionItem.comment}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                        <div className='py-4 px-4 flex justify-between'>
                          {currentFormIndex > 0 && (
                            <button
                              className='bg-savoy-blue text-white px-4 py-2 rounded-md'
                              onClick={() =>
                                setCurrentFormIndex(currentFormIndex - 1)
                              }
                            >
                              Back
                            </button>
                          )}
                          <div className='flex-1' />
                          {currentFormIndex < evaluationForm.length - 1 ? (
                            <button
                              onClick={handleNext}
                              className='bg-savoy-blue text-white px-4 py-2 rounded-md'
                            >
                              Next
                            </button>
                          ) : (
                            <div className='flex-1' />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default EvaluationDetailsModal;
