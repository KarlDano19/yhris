import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetEvaluationHistoryDetails from '../hooks/useGetEvaluationHistoryDetails';
import EvaluationDetails from './components/EvaluationDetails';
import classNames from '@/helpers/classNames';

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
  const [evaluationHistoryDetails, setEvaluationHistoryDetails] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'details' | 'responses'>('details');

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

  const customCloseModal = () => {
    removeEvaluationHistory();
    setActiveTab('details');
    setIsOpen(null);
  };

  const tabs = [
    { id: 'details', name: 'Evaluation Details' },
  ];

  return (
    <div>
      <Transition.Root show={isOpen.open} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={customCloseModal}>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Performance Evaluation: {evaluationHistoryDetails.employee_name}</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={customCloseModal} />
                  </div>
                  
                  {/* Tab Navigation */}
                  <div className='border-b border-gray-200 mt-4'>
                    <nav className='flex -mb-px px-4' aria-label='Tabs'>
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as 'details' | 'responses')}
                          className={classNames(
                            activeTab === tab.id
                              ? 'border-savoy-blue text-savoy-blue'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm'
                          )}
                        >
                          {tab.name}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className='mt-4'>
                    {activeTab === 'details' && (
                      <EvaluationDetails evaluationHistoryDetails={evaluationHistoryDetails} />
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