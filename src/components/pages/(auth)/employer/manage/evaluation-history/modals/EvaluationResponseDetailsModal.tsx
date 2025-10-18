import { Dispatch, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { XCircleIcon } from '@heroicons/react/24/solid';

type T_ModalData = {
  id: number;
  open: boolean;
};

interface EvaluationResponseDetailsModalProps {
  isOpen: T_ModalData | null;
  setIsOpen: Dispatch<T_ModalData | null>;
  selectedTemplate: any;
  templateResponseDetails: any;
  isLoadingTemplateDetails: boolean;
}

const EvaluationResponseDetailsModal = ({
  isOpen,
  setIsOpen,
  selectedTemplate,
  templateResponseDetails,
  isLoadingTemplateDetails,
}: EvaluationResponseDetailsModalProps) => {
  const cancelButtonRef = useRef(null);

  const customCloseModal = () => {
    setIsOpen(null);
  };

  if (!isOpen) return null;

  return (
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl'>
                <div className='flex bg-savoy-blue p-4 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>
                    Template Responses: {selectedTemplate?.evaluation_form}
                  </h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={customCloseModal} />
                </div>
                
                <div className='p-6'>
                  {isLoadingTemplateDetails ? (
                    <div className='flex justify-center py-8'>
                      <LoadingSpinner size="lg" color="yellow" />
                    </div>
                  ) : (
                    <div className='space-y-6'>
                      {/* Template Summary */}
                      <div className='bg-gray-50 rounded-lg p-6 border border-gray-200'>
                        <h4 className='text-lg font-semibold mb-4 text-gray-900'>Template Summary</h4>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div>
                            <p className='text-sm text-gray-600'>Template Name</p>
                            <p className='text-base font-medium text-gray-900'>{templateResponseDetails.template?.name}</p>
                          </div>
                          <div>
                            <p className='text-sm text-gray-600'>Total Responses</p>
                            <p className='text-base font-medium text-gray-900'>{templateResponseDetails.template?.total_responses}</p>
                          </div>
                          <div>
                            <p className='text-sm text-gray-600'>Evaluation Type</p>
                            <p className='text-base font-medium text-gray-900'>{templateResponseDetails.template?.evaluation_type}</p>
                          </div>
                        </div>
                      </div>

                      {/* Individual Evaluation Responses */}
                      <div className='space-y-4'>
                        <h4 className='text-lg font-semibold text-gray-900'>Individual Evaluation Responses</h4>
                        {templateResponseDetails.individual_responses?.map((evaluation: any, index: number) => (
                          <div key={index} className='border border-gray-200 rounded-lg overflow-hidden'>
                            <div className='bg-gray-100 px-6 py-4 border-b border-gray-200'>
                              <div className='flex justify-between items-start'>
                                <div>
                                  <h5 className='font-medium text-gray-900'>{evaluation.employee_name}</h5>
                                  <p className='text-sm text-gray-600'>
                                    {evaluation.date_of_evaluation ? 
                                      new Intl.DateTimeFormat('en-US').format(new Date(evaluation.date_of_evaluation)) : 
                                      'N/A'
                                    }
                                  </p>
                                </div>
                                <div className='text-right'>
                                  <p className='text-lg font-bold text-gray-900'>
                                    {evaluation.form_total_score || 0} / {evaluation.total_score || 0}
                                  </p>
                                  <p className='text-sm text-gray-600'>
                                    {Math.round(((evaluation.form_total_score || 0) / (evaluation.total_score || 1)) * 100)}%
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Detailed Responses */}
                            <div className='divide-y divide-gray-200'>
                              {evaluation.form_data?.map((section: any, sectionIdx: number) => (
                                <div key={sectionIdx} className='p-4'>
                                  <h6 className='font-medium text-gray-900 mb-3'>
                                    Section {sectionIdx + 1}: {section.section_title || 'Section ' + (sectionIdx + 1)}
                                  </h6>
                                  {section.section_description && (
                                    <p className='text-sm text-gray-600 mb-3'>{section.section_description}</p>
                                  )}
                                  
                                  <div className='space-y-3'>
                                    {section.criterion?.map((criterion: any, criterionIdx: number) => {
                                      const percentage = criterion.max_score > 0 ? 
                                        Math.round((criterion.score / criterion.max_score) * 100) : 0;
                                      const getScoreColor = (percentage: number) => {
                                        if (percentage >= 80) return 'text-green-600';
                                        if (percentage >= 60) return 'text-yellow-600';
                                        return 'text-red-600';
                                      };
                                      const getProgressBarColor = (percentage: number) => {
                                        if (percentage >= 80) return 'bg-green-500';
                                        if (percentage >= 60) return 'bg-yellow-500';
                                        return 'bg-red-500';
                                      };
                                      
                                      return (
                                        <div key={criterionIdx} className='bg-gray-50 p-3 rounded'>
                                          <div className='flex justify-between items-start mb-2'>
                                            <div className='flex-1'>
                                              <p className='text-sm font-medium text-gray-900'>
                                                {criterionIdx + 1}. {criterion.title}
                                              </p>
                                            </div>
                                            <div className='ml-4 text-right'>
                                              <p className={`text-sm font-bold ${getScoreColor(percentage)}`}>
                                                {criterion.score} / {criterion.max_score}
                                              </p>
                                              <p className='text-xs text-gray-500'>{percentage}%</p>
                                            </div>
                                          </div>
                                          
                                          {/* Progress Bar */}
                                          <div className='mb-2'>
                                            <div className='w-full bg-gray-200 rounded-full h-2'>
                                              <div
                                                className={`h-2 rounded-full transition-all ${getProgressBarColor(percentage)}`}
                                                style={{ width: `${percentage}%` }}
                                              />
                                            </div>
                                          </div>
                                          
                                          {/* Comment */}
                                          {criterion.comment && (
                                            <div className='mt-2'>
                                              <p className='text-xs font-semibold text-gray-700 mb-1'>Comment:</p>
                                              <p className='text-sm text-gray-600 bg-white p-2 rounded border border-gray-200'>
                                                {criterion.comment}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EvaluationResponseDetailsModal;