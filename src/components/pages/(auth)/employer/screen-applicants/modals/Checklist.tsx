import { ChangeEvent, ChangeEventHandler, FormEventHandler, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import UnsavedChangesModal from '@/components/UnsavedChangesModal';
import ModalLayout from '../../../../../ModalLayout';
import ModalFooterLayout from '../layouts/ModalFooterLayout';
import StateContext from '../contexts/StateContext';
import titleCase from '@/helpers/titleCase';
import { formatDateToLocal, formatDateTimeSeparate } from '@/helpers/date';
import ScreenApplicantGoPremiumModal from '../../job-postings/modals/ScreenApplicantGoPremiumModal';
import useGetStageRequirements from '../hooks/useGetStageRequirements';
import useUpdateStageRequirements from '../hooks/useUpdateStageRequirements';
import useGetStageNotes from '../hooks/useGetStageNotes';
import useUpdateStageNotes from '../hooks/useUpdateStageNotes';
import CustomToast from '@/components/CustomToast';
import JobCapacityModal from './JobCapacityModal';

import { initialActionState } from '../lib/initialActionState';
import { ApplicantType, ContextTypes, ChecklistPropTypes as PropTypes, StageType } from '../types';

type DataTypes = {
  checklists: string[];
  status: string;
  stage_notes: {
    notes: string;
  };
  id: any;
  feedback?: string;
};

const statuses = [
  {
    id: 'ongoing',
    value: 'ongoing',
    title: 'Ongoing',
  },
  {
    id: 'withdrawn',
    value: 'withdrawn',
    title: 'Withdrawn',
  },
  {
    id: 'rejected',
    value: 'rejected',
    title: 'Rejected',
  },
  {
    id: 'passed',
    value: 'passed',
    title: 'Passed',
  },
  {
    id: 'pooling',
    value: 'pooling',
    title: 'For Pooling',
  },
];

export default function Checklist({
  title,
  requirements,
  handleFormSubmit,
  hasActiveSubscription,
  jobPostingDetails,
}: PropTypes & { hasActiveSubscription?: boolean; jobPostingDetails?: any }) {
  const { state, actionState, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { getValues, setValue, register, watch } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<(() => void) | null>(null);

  const [isGoPremiumModalOpen, setIsGoPremiumModalOpen] = useState(false);
  const [isJobCapacityModalOpen, setIsJobCapacityModalOpen] = useState(false);
  const [pendingHireData, setPendingHireData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  let applicant: ApplicantType | undefined;
  state.forEach((stage) => {
    if (stage.id === actionState.stageId) {
      applicant = stage.applicants.find((applicant) => applicant.id === actionState.applicantId);
    }
  });

  const [checks, setChecks] = useState<string[]>([]);
  const [currentStageNotes, setCurrentStageNotes] = useState<string>(''); // Notes for the current stage (editable)
  const [stageRequirementsData, setStageRequirementsData] = useState<any>(null); // Store stage requirements data locally
  const [stageNotesData, setStageNotesData] = useState<any>(null); // Store stage notes data locally
  // Remove audit history state since it's not needed
  // const [auditHistoryData, setAuditHistoryData] = useState<any>(null);

  // Get current stage info
  const currentStage = state.find((stage: StageType) => stage.id === actionState.stageId);
  const currentStageOrder = currentStage?.orderBy || 0;

  // Get only previous stages (stages with orderBy less than current stage)
  const previousStages = state
    .filter((stage: StageType) => stage.orderBy < currentStageOrder)
    .map((stage: StageType) => ({
      id: stage.id,
      title: stage.title,
      orderBy: stage.orderBy,
    }))
    .sort((a, b) => a.orderBy - b.orderBy);

  // Include current stage in the tabs
  const allStages = [
    ...previousStages,
    {
      id: currentStage?.id || 0,
      title: currentStage?.title || '',
      orderBy: currentStageOrder,
    }
  ];

  const currentStatus = watch('status');

  // Hook to get stage requirements - only fetch when viewing previous stages
  const { data: fetchedStageRequirementsData, refetch: refetchStageRequirements } = useGetStageRequirements(
    applicant?.applicationId || 0,
    activeTab || 0,
    isOpen && !!applicant?.applicationId && activeTab !== actionState.stageId && activeTab !== null
  );

  // Hook to get stage notes
  const { data: fetchedStageNotesData, refetch: refetchStageNotes } = useGetStageNotes(
    applicant?.applicationId || 0,
    isOpen && !!applicant?.applicationId
  );

  // Remove audit history hook entirely since it's not needed
  // const { data: fetchedAuditHistoryData, refetch: refetchAuditHistory } = useGetApplicationAuditHistory(
  //   applicant?.applicationId || 0,
  //   isOpen && !!applicant?.applicationId
  // );

  // Hook to update stage requirements
  const updateStageRequirementsMutation = useUpdateStageRequirements();
  
  // Hook to update stage notes
  const updateStageNotesMutation = useUpdateStageNotes();

  // Update local state when fetched data changes
  useEffect(() => {
    if (fetchedStageRequirementsData) {
      setStageRequirementsData(fetchedStageRequirementsData);
    }
  }, [fetchedStageRequirementsData]);

  useEffect(() => {
    if (fetchedStageNotesData) {
      setStageNotesData(fetchedStageNotesData);
    }
  }, [fetchedStageNotesData]);

  // Remove audit history useEffect since it's not needed
  // useEffect(() => {
  //   if (fetchedAuditHistoryData) {
  //     setAuditHistoryData(fetchedAuditHistoryData);
  //   }
  // }, [fetchedAuditHistoryData]);

  // Function to check if there are unsaved changes
  const hasUnsavedChanges = () => {
    const formData = getValues();
    const originalStatus = applicant?.status;
    const originalStageNotes = getCurrentStageNote()?.notes || '';
    
    return (
      (formData.status && formData.status !== originalStatus) ||
      (currentStageNotes.trim() !== originalStageNotes.trim()) ||
      (checks.length > 0)
    );
  };

  // Function to handle confirmation modal close (cancel)
  const handleUnsavedChangesCancel = () => {
    setIsUnsavedChangesModalOpen(false);
    setPendingCloseAction(null);
  };

  // Function to handle confirmation modal confirm (proceed with close)
  const handleUnsavedChangesConfirm = () => {
    setIsUnsavedChangesModalOpen(false);
    const action = pendingCloseAction;
    setPendingCloseAction(null);
    
    // Execute the pending close action
    if (action) {
      action();
    }
  };

  // Function to reset all form data
  const resetFormData = () => {
    setValue('status', applicant?.status || '');
    setChecks([]);
    setCurrentStageNotes('');
    setActiveTab(actionState.stageId);
  };

  // Function to handle modal close with unsaved changes check
  const handleModalClose = (closeAction: () => void) => {
    if (hasUnsavedChanges()) {
      setPendingCloseAction(() => closeAction);
      setIsUnsavedChangesModalOpen(true);
    } else {
      closeAction();
    }
  };

  // Get current stage note from the new separated structure
  const getCurrentStageNote = () => {
    if (stageNotesData?.stage_notes) {
      return stageNotesData.stage_notes.find((note: any) => note.job_stage === actionState.stageId);
    }
    return null;
  };

  // Get stage note for a specific stage
  const getStageNote = (stageId: number) => {
    if (stageNotesData?.stage_notes) {
      return stageNotesData.stage_notes.find((note: any) => note.job_stage === stageId);
    }
    return null;
  };

  // Set the initial status based on the applicant's screening fit
  useEffect(() => {
    if (applicant) {
      // Only set status if the applicant doesn't already have a status
      // This prevents overriding manual status changes
      if (!applicant.status) {
        // If the applicant is not fit, suggest "rejected" but don't force it
        if (applicant.screeningFit === 'bad') {
          setValue('status', 'rejected');
        }
      } else {
        // Use their current status
        setValue('status', applicant.status);
      }
    }
  }, [applicant, setValue]);

  useEffect(() => {
    // Enable "Passed" status when at least one requirement is checked
    if (requirements.length) {
      const checkedRequirements = checks.filter((check) => requirements.includes(check));
      setIsDisabled(checkedRequirements.length === 0);
    } else {
      setIsDisabled(true);
    }
  }, [checks.length, requirements.length]);

  useEffect(() => {
    setIsOpen(true);
    // Set active tab to current stage
    setActiveTab(actionState.stageId);

    // Load existing stage notes for the current stage only
    const currentStageNote = getCurrentStageNote();
    if (currentStageNote) {
      setCurrentStageNotes(currentStageNote.notes || '');
    } else {
      setCurrentStageNotes('');
    }

    // Load inherited checklist data for the current stage
    loadInheritedChecklistData();
  }, [stageNotesData, actionState.stageId]);

  const handleClose = () => {
    handleModalClose(() => {
      resetFormData();
      setIsOpen(false);
      setTimeout(() => setActionState(initialActionState), 400);
    });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data: DataTypes = {} as DataTypes;
    data.checklists = checks;
    data.status = getValues('status') || applicant?.status;
    data.stage_notes = {
      notes: currentStageNotes,
    };
    data.id = applicant?.applicationId;

    // Check if applicant is being marked as "Hired" (passed status in final stage)
    const isBeingHired = data.status === 'passed' && actionState.isFinalStage;

    // Check if job posting is fully staffed (show job capacity modal)
    if (isBeingHired && jobPostingDetails?.hired_count >= jobPostingDetails?.required_slot) {
      setPendingHireData(data);
      setIsJobCapacityModalOpen(true);
      return;
    }

    // Reset form data before closing modal to prevent unsaved changes detection
    resetFormData();
    setIsOpen(false);

    if (isBeingHired && !hasActiveSubscription) {
      // Show the premium modal first only if user doesn't have active subscription
      setIsGoPremiumModalOpen(true);
    } else {
      // Proceed with normal form submission
      setTimeout(() => {
        handleFormSubmit(data);
        // Refetch data after successful submission - only refetch enabled hooks
        setTimeout(() => {
          refetchStageRequirements();
          refetchStageNotes();
          // Remove audit history refetch since it's not needed
        }, 1000);
      }, 400);
    }
  };

  const handlePremiumModalClose = () => {
    setIsGoPremiumModalOpen(false);
    // After modal is closed, proceed with the form submission
    const data: DataTypes = {} as DataTypes;
    data.checklists = checks;
    data.status = getValues('status') || applicant?.status;
    data.id = applicant?.applicationId;
    setTimeout(() => {
      handleFormSubmit(data);
      // Refetch data after successful submission - only refetch enabled hooks
      setTimeout(() => {
        refetchStageRequirements();
        refetchStageNotes();
        // Remove audit history refetch since it's not needed
      }, 1000);
    }, 400);
  };

  const handleSetInactive = () => {
    if (pendingHireData) {
      setIsLoading(true);

      // Just deactivate the job posting, don't hire the applicant
      const dataWithDeactivation = {
        ...pendingHireData,
        status: 'ongoing', // Keep applicant in ongoing status, don't hire
        deactivate_job_posting: true
      };

      setIsJobCapacityModalOpen(false);
      resetFormData();
      setIsOpen(false);

      setTimeout(() => {
        handleFormSubmit(dataWithDeactivation);
        setTimeout(() => {
          refetchStageRequirements();
          refetchStageNotes();
          setIsLoading(false);
        }, 1000);
      }, 400);
    }
  };

  const handleIncreaseLimit = () => {
    if (pendingHireData) {
      setIsLoading(true);

      // Hire the applicant and increase the required slot
      const dataWithSlotIncrease = {
        ...pendingHireData,
        new_required_slot: (jobPostingDetails?.required_slot || 0) + 1,
        deactivate_job_posting: false
      };

      setIsJobCapacityModalOpen(false);
      resetFormData();
      setIsOpen(false);

      setTimeout(() => {
        handleFormSubmit(dataWithSlotIncrease);
        setTimeout(() => {
          refetchStageRequirements();
          refetchStageNotes();
          setIsLoading(false);
        }, 1000);
      }, 400);
    }
  };

  const handleKeepActive = () => {
    // Close the modal without any changes
    setIsJobCapacityModalOpen(false);
    setPendingHireData(null);
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setChecks((prev) => [...prev, e.target.id]);
    } else {
      const newChecks = checks.filter((item) => item !== e.target.id);
      setChecks(newChecks);
    }
  };

  const handleTabClick = (stageId: number) => {
    setActiveTab(stageId);
    // Clear previous stage requirements data when switching tabs
    setStageRequirementsData(null);
  };

  // Check if current tab is a previous stage (not the current stage)
  const isPreviousStage = activeTab !== actionState.stageId;

  // Load inherited checklist data for the current stage
  const loadInheritedChecklistData = () => {
    if (stageNotesData?.stage_notes) {
      const currentStageNote = stageNotesData.stage_notes.find(
        (note: any) => note.job_stage === actionState.stageId
      );
      
      if (currentStageNote && currentStageNote.stage_requirements_checklist) {
        try {
          const checklistData = currentStageNote.stage_requirements_checklist;
          if (checklistData.checklist) {
            // Extract checked requirements from the inherited data
            const checkedRequirements = Object.entries(checklistData.checklist)
              .filter(([_, isChecked]) => isChecked)
              .map(([requirement, _]) => requirement);
            
            // Set the checked requirements in the form
            setChecks(checkedRequirements);
          }
        } catch (error) {
          console.error('Error loading inherited checklist data:', error);
        }
      }
    }
  };

  return (
    <>
      <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
        <form onSubmit={onSubmit}>
          <div className='p-8'>
            {requirements?.length > 0 && (
              <div className='grid gap-4 mb-8'>
                {requirements.map((requirement, index) => {
                  const isInherited = checks.includes(requirement);
                  return (
                    <div key={index} className='flex items-center gap-4 text-indigo-dye text-[15px]'>
                      <input
                        checked={checks.some((check) => check === requirement)}
                        onChange={handleCheckbox}
                        id={requirement}
                        type='checkbox'
                        className='w-5 h-5'
                      />
                      <label htmlFor={requirement} className="flex items-center gap-2">
                        {titleCase(requirement)}
                        {/* {isInherited && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Inherited
                          </span>
                        )} */}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
            <div className='grid gap-4'>
              <p className='font-medium'>Status</p>
              {statuses.map((status) => {
                const { title, id } = status;
                const disabled = id === 'passed' && isDisabled;
                return (
                  <div
                    key={id}
                    className={`${disabled && 'opacity-75'} flex items-center gap-4 text-indigo-dye text-[15px]`}
                  >
                    <input
                      onChange={(e) => setValue('status', e.target.id)}
                      defaultChecked={applicant?.status === id}
                      checked={disabled ? false : getValues('status') === id ? true : undefined}
                      disabled={disabled}
                      id={id}
                      type='radio'
                      name='status'
                      className='w-5 h-5'
                    />
                    <label htmlFor={id}>
                      {title == 'Passed' ? (actionState.isFinalStage ? 'Hired' : title) : title}
                    </label>
                  </div>
                );
              })}
              {/* Pooling info */}
              {getValues('status') === 'pooling' && (
                <p className="text-sm text-gray-600 mt-2">
                  Selecting <strong>For Pooling</strong> will move this applicant to the pooling list and archive the application. This action is audited.
                </p>
              )}
              {/* Stage Notes Tabs */}
              <div className='grid gap-4 mb-8 '>
                <p className='font-medium'>Stage Notes</p>

                {/* Tabs - Only show previous stages and current stage */}
                <div className='flex border-b border-gray-200'>
                  {allStages.map((stage) => {
                    const stageNote = getStageNote(stage.id);
                    const isActive = activeTab === stage.id;
                    const hasNotes = stageNote && stageNote.notes && stageNote.notes.trim() !== '';

                    return (
                      <button
                        key={stage.id}
                        type='button'
                        onClick={() => handleTabClick(stage.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                          isActive
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className='flex items-center gap-2'>
                          <span>{stage.title}</span>
                          {hasNotes && <div className='w-2 h-2 bg-blue-500 rounded-full'></div>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className='mt-4'>
                  {activeTab && (
                    <div>
                      {activeTab === actionState.stageId ? (
                        // Current stage - editable
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Interviewer Notes
                          </label>
                          <textarea
                            value={currentStageNotes}
                            onChange={(e) => setCurrentStageNotes(e.target.value)}
                            placeholder='Add your notes for this specific stage...'
                            className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                            rows={4}
                          />
                        </div>
                      ) : (
                        // Previous stages - read-only
                        <div className='p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px]'>
                          {(() => {
                            const stageNote = getStageNote(activeTab);
                            if (stageNote && stageNote.notes && stageNote.notes.trim() !== '') {
                              return (
                                <div>
                                  <p className='text-gray-600 text-sm whitespace-pre-wrap'>{stageNote.notes}</p>
                                  {stageNote.created_at && (
                                    <p className='text-xs text-gray-400 mt-2'>
                                      Added: {formatDateToLocal(stageNote.created_at)}
                                    </p>
                                  )}
                                </div>
                              );
                            } else {
                              return <p className='text-gray-400 text-sm italic'>No notes available for this stage.</p>;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Previous Stage Checklist Results - Only show for previous stages */}
                {isPreviousStage && stageRequirementsData && (
                  <div className='mt-6'>
                    <p className='font-medium mb-4'>Previous Stage Checklist Results</p>
                    
                    {/* Checked Requirements */}
                    {Object.entries(stageRequirementsData.requirement_statuses || {})
                      .filter(([_, isChecked]) => isChecked)
                      .length > 0 && (
                      <div className='mb-4'>
                        <div className='bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium mb-2 inline-block'>
                          Checked
                        </div>
                        <div className='bg-gray-50 border border-gray-200 rounded-md'>
                          {Object.entries(stageRequirementsData.requirement_statuses || {})
                            .filter(([_, isChecked]) => isChecked)
                            .map(([requirement, _], index, array) => (
                              <div key={requirement}>
                                <div className='px-3 py-2'>
                                  <span className='text-sm text-gray-800'>{titleCase(requirement)}</span>
                                </div>
                                {index < array.length - 1 && (
                                  <hr className='border-gray-200' />
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Unchecked Requirements */}
                    {Object.entries(stageRequirementsData.requirement_statuses || {})
                      .filter(([_, isChecked]) => !isChecked)
                      .length > 0 && (
                      <div>
                        <div className='bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium mb-2 inline-block'>
                          Unchecked
                        </div>
                        <div className='bg-gray-50 border border-gray-200 rounded-md'>
                          {Object.entries(stageRequirementsData.requirement_statuses || {})
                            .filter(([_, isChecked]) => !isChecked)
                            .map(([requirement, _], index, array) => (
                              <div key={requirement}>
                                <div className='px-3 py-2'>
                                  <span className='text-sm text-gray-800'>{titleCase(requirement)}</span>
                                </div>
                                {index < array.length - 1 && (
                                  <hr className='border-gray-200' />
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Remove the Completion Summary section entirely */}
                  </div>
                )}

                {/* Application History Section - HIDDEN */}
                {/* 
                {auditHistoryData?.audit_history && auditHistoryData.audit_history.length > 0 && (
                  <div className='mt-6'>
                    <p className='font-medium mb-4'>Application History</p>
                    <div className='bg-gray-50 border border-gray-200 rounded-md max-h-40 overflow-y-auto'>
                      {auditHistoryData.audit_history
                        .filter((audit: any) => 
                          // Hide archive and unarchive events from the checklist modal
                          audit.action !== 'archive' && 
                          audit.action !== 'unarchive' && 
                          audit.action !== 'batch_unarchive'
                        )
                        .map((audit: any, index: number) => (
                        <div key={audit.id} className='px-3 py-2 border-b border-gray-200 last:border-b-0'>
                          <div className='flex justify-between items-start'>
                            <div>
                              <p className='text-sm text-gray-800'>{audit.action} - {audit.model_name}</p>
                              <p className='text-xs text-gray-500'>{audit.user}</p>
                            </div>
                            <p className='text-xs text-gray-400'>
                              {formatDateTimeSeparate(audit.created_at).formattedDate} {formatDateTimeSeparate(audit.created_at).formattedTime}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                */}
              </div>
            </div>
          </div>
          <hr />
          <ModalFooterLayout>
            <button
              onClick={handleClose}
              type='button'
              className='border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]'
            >
              Close
            </button>
            <button type='submit' className='rounded-lg py-2 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd]'>
              Update
            </button>
          </ModalFooterLayout>
        </form>

        {/* Unsaved Changes Confirmation Modal */}
        {isUnsavedChangesModalOpen && (
          <UnsavedChangesModal
            isOpen={isUnsavedChangesModalOpen}
            onClose={handleUnsavedChangesCancel}
            onConfirm={handleUnsavedChangesConfirm}
            isLoading={false}
            isSwitchingEmployee={false}
            contentType="checklist"
          />
        )}

        {/* Job Capacity Modal - for fully staffed jobs */}
        {isJobCapacityModalOpen && (
          <JobCapacityModal
            isOpen={isJobCapacityModalOpen}
            setIsOpen={setIsJobCapacityModalOpen}
            jobTitle={jobPostingDetails?.job_title || 'this position'}
            hiredCount={jobPostingDetails?.hired_count || 0}
            requiredSlot={jobPostingDetails?.required_slot || 0}
            applicantName={applicant?.name || 'this applicant'}
            onSetInactive={handleSetInactive}
            onIncreaseLimit={handleIncreaseLimit}
            onKeepActive={handleKeepActive}
            isLoading={isLoading}
          />
        )}
        
      </ModalLayout>
      {!hasActiveSubscription && (
        <ScreenApplicantGoPremiumModal isOpen={isGoPremiumModalOpen} setIsOpen={handlePremiumModalClose} />
      )}
    </>
  );
}
