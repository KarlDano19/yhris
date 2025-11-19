import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
import InfoIcon from '@/svg/InfoIcon';
import useGetEvaluationTemplateDetails from '../hooks/useGetEvaluationTemplateDetails';

type T_ViewEvaluationTemplateModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedEvaluationTemplateId: number;
};

const infoRowClass = 'flex flex-col gap-1';
const infoLabelClass = 'text-xs uppercase tracking-wide text-gray-500';
const infoValueClass = 'text-base text-gray-900 font-semibold break-words';

export default function ViewEvaluationModal({
  isOpen,
  setIsOpen,
  selectedEvaluationTemplateId,
}: T_ViewEvaluationTemplateModalProps) {
  const cancelButtonRef = useRef(null);
  const infoIconRef = useRef<HTMLDivElement>(null);
  const [isBasicInfoExpanded, setIsBasicInfoExpanded] = useState(true);
  const [isScoresVisibilityExpanded, setIsScoresVisibilityExpanded] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    data: evaluationTemplateData,
    refetch: refetchEvaluationTemplate,
    isFetching,
    isLoading,
    remove: removeEvaluationTemplateCache,
  } = useGetEvaluationTemplateDetails(selectedEvaluationTemplateId);

  useEffect(() => {
    if (isOpen && selectedEvaluationTemplateId) {
      refetchEvaluationTemplate();
    }
  }, [isOpen, selectedEvaluationTemplateId, refetchEvaluationTemplate]);

  useEffect(() => {
    if (isOpen) {
      // Show tooltip automatically after modal opens
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 300);
      return () => {
        clearTimeout(timer);
        setShowTooltip(false);
      };
    }
  }, [isOpen]);

  const closeModal = () => {
    removeEvaluationTemplateCache();
    setIsOpen(false);
  };

  const renderInfoRow = (label: string, value: string | number | null | undefined) => (
    <div className={infoRowClass} key={label}>
      <span className={infoLabelClass}>{label}</span>
      <span className={infoValueClass}>{value ?? '—'}</span>
    </div>
  );

  const renderColoredYesNo = (value: boolean | undefined | null) => {
    const isYes = value === true;
    return (
      <span className={`font-semibold ${isYes ? 'text-green-600' : 'text-red-600'}`}>
        {isYes ? 'Yes' : 'No'}
      </span>
    );
  };

  const renderBooleanRow = (label: string, value: boolean | undefined | null) => (
    <div className={infoRowClass} key={label}>
      <span className={infoLabelClass}>{label}</span>
      <span className={infoValueClass}>{renderColoredYesNo(value)}</span>
    </div>
  );

  const renderCriteria = () => {
    if (!Array.isArray(evaluationTemplateData?.evaluation_criterion) || evaluationTemplateData.evaluation_criterion.length === 0) {
      return <p className='text-sm text-gray-500'>No evaluation criteria defined.</p>;
    }

    return evaluationTemplateData.evaluation_criterion.map((section: any, sectionIndex: number) => {
      const sectionTitle = section.title || section.section_title || `Section ${sectionIndex + 1}`;
      return (
        <div key={section.id || sectionTitle} className='rounded-lg border border-gray-200 p-4 space-y-3'>
          <div className='flex items-center justify-between'>
            <h4 className='text-base font-semibold text-gray-900'>{sectionTitle}</h4>
            {section.description && <p className='text-xs text-gray-500'>{section.description}</p>}
          </div>
          {Array.isArray(section.criterion) && section.criterion.length > 0 ? (
            <div className='space-y-2'>
              {section.criterion.map((criterion: any, criterionIndex: number) => (
                <div key={criterion.id || `${sectionTitle}-${criterionIndex}`} className='rounded-md bg-gray-50 p-3'>
                  <p className='text-sm font-semibold text-gray-900'>{criterion.title || `Criterion ${criterionIndex + 1}`}</p>
                  <p className='text-xs text-gray-500'>
                    Max Score: <span className='font-semibold text-gray-900'>{criterion.max_score ?? '—'}</span>
                  </p>
                  <p className='text-xs text-gray-500'>
                    Comment Required:{' '}
                    {renderColoredYesNo(!criterion.is_disable_comment)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-sm text-gray-500'>No criteria added for this section.</p>
          )}
        </div>
      );
    });
  };

  const isDataLoading = isFetching || isLoading || !evaluationTemplateData;

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={closeModal}>
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
                <Dialog.Panel className='relative w-full max-w-5xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>
                      View Evaluation Template
                    </h3>
                    <div 
                      ref={infoIconRef}
                      className='cursor-pointer mr-2'
                      data-tooltip-id='view-template-header-tooltip'
                      data-tooltip-content='To edit this template, you need to duplicate it first'
                      data-tooltip-place='bottom'
                    >
                      <InfoIcon fill='white' />
                    </div>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={closeModal} />
                  </div>

                  <div className='pt-10 px-10 pb-8 space-y-6'>
                    {isDataLoading ? (
                      <div className='flex justify-center items-center py-16'>
                        <LoadingSpinner size='lg' color='yellow' />
                      </div>
                    ) : (
                      <>
                        <section className='space-y-4 border border-gray-200 rounded-lg p-4'>
                          <button
                            onClick={() => setIsBasicInfoExpanded(!isBasicInfoExpanded)}
                            className='flex items-center gap-2 w-full text-left'
                          >
                            {isBasicInfoExpanded ? (
                              <ChevronDownIcon className='w-5 h-5 text-gray-500' />
                            ) : (
                              <ChevronRightIcon className='w-5 h-5 text-gray-500' />
                            )}
                            <h4 className='text-lg font-semibold text-gray-900'>Basic Information</h4>
                          </button>
                          {isBasicInfoExpanded && (
                            <div className='grid gap-4 md:grid-cols-2 pt-2'>
                              {renderInfoRow('Evaluation Name', evaluationTemplateData?.name)}
                              {renderInfoRow('Evaluation Type', evaluationTemplateData?.evaluation_type)}
                              {renderInfoRow('Frequency', evaluationTemplateData?.frequency)}
                              {renderInfoRow('Format', evaluationTemplateData?.evaluation_format)}
                              {renderInfoRow('Criteria View Type', evaluationTemplateData?.criteria_rating_view_type)}
                              {renderInfoRow('Rating Type', evaluationTemplateData?.rating_type)}
                            </div>
                          )}
                        </section>

                        <section className='space-y-4 border border-gray-200 rounded-lg p-4'>
                          <button
                            onClick={() => setIsScoresVisibilityExpanded(!isScoresVisibilityExpanded)}
                            className='flex items-center gap-2 w-full text-left'
                          >
                            {isScoresVisibilityExpanded ? (
                              <ChevronDownIcon className='w-5 h-5 text-gray-500' />
                            ) : (
                              <ChevronRightIcon className='w-5 h-5 text-gray-500' />
                            )}
                            <h4 className='text-lg font-semibold text-gray-900'>Scores & Visibility</h4>
                          </button>
                          {isScoresVisibilityExpanded && (
                            <div className='grid gap-4 md:grid-cols-2 pt-2'>
                              {renderInfoRow('Total Score', evaluationTemplateData?.total_score)}
                              {renderInfoRow('Passing Score', evaluationTemplateData?.passing_score)}
                              {renderBooleanRow('Show Remarks', evaluationTemplateData?.is_show_remarks)}
                              {renderBooleanRow('Show Criteria Comment', evaluationTemplateData?.is_show_criteria_comment)}
                            </div>
                          )}
                        </section>

                        {evaluationTemplateData?.description && (
                          <section className='space-y-2'>
                            <h4 className='text-lg font-semibold text-gray-900'>Description</h4>
                            <p className='text-sm text-gray-700 whitespace-pre-line'>{evaluationTemplateData.description}</p>
                          </section>
                        )}

                        <section className='space-y-4'>
                          <h4 className='text-lg font-semibold text-gray-900'>Evaluation Criteria</h4>
                          <div className='max-h-96 overflow-y-auto space-y-4 pr-2'>{renderCriteria()}</div>
                        </section>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <Tooltip 
                id='view-template-header-tooltip' 
                isOpen={showTooltip}
                setIsOpen={setShowTooltip}
              />
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      
    </>
  );
}

