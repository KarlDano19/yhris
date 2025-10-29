import React, { useState, Fragment, useRef, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetJobPostDetails from '../hooks/useGetJobPostDetails';
import useGetValidStagesForRestoration, { ValidStage } from '../hooks/useGetValidStagesForRestoration';
import useGetBatchValidStagesForRestoration from '../hooks/useGetBatchValidStagesForRestoration';
import useBatchUnarchiveApplications from '../hooks/useBatchUnarchiveApplications';

import classNames from '@/helpers/classNames';

import { XCircleIcon } from '@heroicons/react/24/solid';

interface RestoreApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (fallbackStageId: number) => void;
  applicantName: string;
  jobPostingId: string;
  isLoading?: boolean;
  isMultiple?: boolean;
  selectedApplicantIds?: number[];
  onSuccess?: () => void;
  appliedJobId?: number; // Add this prop to identify the specific applicant
}

const RestoreApplicationModal: React.FC<RestoreApplicationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicantName,
  jobPostingId,
  isLoading = false,
  isMultiple = false,
  selectedApplicantIds = [],
  onSuccess,
  appliedJobId
}) => {
  const { data: jobPostDetails, isLoading: isLoadingJobDetails } = useGetJobPostDetails(jobPostingId);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const cancelButtonRef = useRef(null);
  
  const { mutate: unarchiveBatch, isLoading: isUnarchiving } = useBatchUnarchiveApplications();

  // Get valid stages for restoration (only for single applicant)
  const { data: validStagesData, isLoading: isLoadingValidStages } = useGetValidStagesForRestoration(
    appliedJobId || 0,
    isOpen && !isMultiple && !!appliedJobId
  );

  // Get valid stages for batch restoration (only for multiple applicants)
  const { data: batchValidStagesData, isLoading: isLoadingBatchValidStages } = useGetBatchValidStagesForRestoration(
    selectedApplicantIds,
    isOpen && isMultiple && selectedApplicantIds.length >= 2
  );

  // For multiple applicants, use batch valid stages (stages ALL applicants have passed through)
  // For single applicant, use validated stages
  const availableStages = isMultiple 
    ? batchValidStagesData?.valid_stages || []
    : validStagesData?.valid_stages || [];

  // Determine the correct loading state based on single vs multiple
  const isLoadingStages = isMultiple ? isLoadingBatchValidStages : isLoadingValidStages;

  const handleClose = () => {
    setSelectedStageId(null);
    setRestoreInProgress(false);
    setProcessedCount(0);
    setTotalCount(0);
    onClose();
  };
  
  const handleConfirm = () => {
    if (selectedStageId) {
      if (isMultiple && selectedApplicantIds?.length) {
        setRestoreInProgress(true);
        setTotalCount(selectedApplicantIds.length);
        
        // Call the batch unarchive function
        unarchiveBatch({ 
          appliedJobIds: selectedApplicantIds, 
          fallbackStageId: selectedStageId,
          progressCallback: (processed: number) => {
            setProcessedCount(processed);
          }
        }, {
          onSuccess: (data: any) => {
            setRestoreInProgress(false);
            setSelectedStageId(null);
            if (onSuccess) {
              onSuccess();
            }
            handleClose();
          },
          onError: (err: any) => {
            console.error('Batch unarchive error:', err);
            alert(`Error: ${err.message || 'Operation failed'}`);
            setRestoreInProgress(false);
          }
        });
      } else {
        onConfirm(selectedStageId);
      }
    }
  };

  const getModalTitle = () => {
    if (isMultiple) {
      return "Restore Multiple Applications";
    }
    return "Restore Application";
  };

  const getStageReasonText = (reason: string) => {
    switch (reason) {
      case 'Archived stage':
        return 'Stage where applicant was archived';
      case 'Previously progressed through':
        return 'Applicant has progressed through this stage';
      default:
        return reason;
    }
  };

  const getStageReasonColor = (reason: string) => {
    switch (reason) {
      case 'Archived stage':
        return 'text-blue-600 bg-blue-100';
      case 'Previously progressed through':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Add this to the modal to show checklist inheritance info
  const getStageInheritanceInfo = (stage: any) => {
    if (stage.reason === 'Archived stage') {
      return 'Will inherit original checklist data';
    } else if (stage.reason === 'Previously progressed through') {
      return 'Will inherit existing checklist data';
    }
    return '';
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-xl">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex items-start">
                    
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {getModalTitle()}
                      </Dialog.Title>
                      <div className="mt-2">
                        {isMultiple ? (
                          <p className="text-sm text-gray-500">
                            You&apos;re about to restore <strong>{applicantName}</strong>. 
                            Please select a stage that all selected applicants have progressed through:
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            You&apos;re about to restore <strong>{applicantName}</strong>&apos;s application. 
                            Please select a fallback stage to place the applicant:
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Stage:
                        </label>
                        
                        {isLoadingStages ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Loading available stages...</span>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {availableStages.map((stage: any) => (
                              <label
                                key={stage.id}
                                className={classNames(
                                  'flex items-start p-3 border rounded-lg cursor-pointer transition-colors',
                                  selectedStageId === stage.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                )}
                              >
                                <input
                                  type="radio"
                                  name="stage"
                                  value={stage.id}
                                  checked={selectedStageId === stage.id}
                                  onChange={() => setSelectedStageId(stage.id)}
                                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-900">
                                      {stage.title}
                                    </div>
                                    {!isMultiple && stage.reason && (
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStageReasonColor(stage.reason)}`}>
                                        {stage.reason}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {!isMultiple && stage.reason ? (
                                      <>
                                        {getStageReasonText(stage.reason)}
                                        {getStageInheritanceInfo(stage) && (
                                          <div className="mt-1 text-blue-600 text-xs">
                                            {getStageInheritanceInfo(stage)}
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      `Order: ${stage.order_by + 1}`
                                    )}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                        
                        {availableStages.length === 0 && !isLoadingStages && (
                          <div className="text-center py-4 text-gray-500">
                            {isMultiple ? 'No common stages available. Selected applicants must have progressed through at least one stage together.' : 'No valid stages available for restoration'}
                          </div>
                        )}
                      </div>
                      
                      {restoreInProgress && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${Math.floor((processedCount / totalCount) * 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 text-center">
                            Restoring {processedCount} of {totalCount} applications...
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-4 text-sm text-gray-500">
                        <p>
                          <span className="font-medium text-gray-700">Note:</span> A detailed record of this restoration will be added to each applicant, including the original stage and the new stage if different.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-4 text-gray-400 hover:text-gray-600"
                      onClick={handleClose}
                    >
                      <XCircleIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    disabled={!selectedStageId || isLoading || restoreInProgress || availableStages.length === 0 || isLoadingStages}
                    className={classNames(
                      'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto',
                      (!selectedStageId || isLoading || restoreInProgress || availableStages.length === 0 || isLoadingStages)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    )}
                    onClick={handleConfirm}
                  >
                    {isLoading || restoreInProgress ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Restoring...
                      </span>
                    ) : (
                      `Restore ${isMultiple ? 'Applications' : 'Application'}`
                    )}
                  </button>
                  <button
                    type="button"
                    ref={cancelButtonRef}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleClose}
                    disabled={restoreInProgress}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default RestoreApplicationModal; 