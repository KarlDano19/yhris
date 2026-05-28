import { ChangeEvent, ChangeEventHandler, FormEventHandler, Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';
import { CheckBadgeIcon, ForwardIcon, ExclamationTriangleIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

import UnsavedChangesModal from '@/components/UnsavedChangesModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import ModalLayout from '../../../../../../ModalLayout';
import ModalFooterLayout from '../../layouts/ModalFooterLayout';
import StateContext from '../../contexts/StateContext';
import titleCase from '@/helpers/titleCase';
import { formatDateToLocal } from '@/helpers/date';
import ScreenApplicantGoPremiumModal from '../../../job-postings/modals/ScreenApplicantGoPremiumModal';
import useGetStageRequirements from '../../hooks/stage/useGetStageRequirements';
import useUpdateStageRequirements from '../../hooks/stage/useUpdateStageRequirements';
import useGetStageNotes from '../../hooks/stage/useGetStageNotes';
import useUpdateStageNotes from '../../hooks/stage/useUpdateStageNotes';
import CustomToast from '@/components/CustomToast';
import SignatureModal from './checklist/SignatureModal';
import RejectConfirmationModal from './checklist/RejectConfirmationModal';
import PoolingConfirmationModal from './checklist/PoolingConfirmationModal';

import { initialActionState } from '../../lib/initialActionState';
import { ApplicantType, ContextTypes, ChecklistPropTypes as PropTypes, StageApprovalType, StageType } from '../../types';
import useApproveStage from '../../hooks/checklist/useApproveStage';
import useGetUserDetails from '@/components/hooks/useGetUserDetails';

type DataTypes = {
  checklists: string[];
  status: string;
  stage_notes: {
    notes: string;
  };
  id: any;
  applicant_name?: string;
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
    id: 'passed',
    value: 'passed',
    title: 'Passed',
  },
  {
    id: 'rejected',
    value: 'rejected',
    title: 'Rejected',
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
  onJobCapacityNeeded,
}: PropTypes & { hasActiveSubscription?: boolean; jobPostingDetails?: any; onJobCapacityNeeded?: (pendingData: any) => void }) {
  const { state, actionState, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { getValues, setValue, register, watch } = useForm();
  const isConfirmingRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<(() => void) | null>(null);

  const [isGoPremiumModalOpen, setIsGoPremiumModalOpen] = useState(false);
  const [isRejectConfirmationOpen, setIsRejectConfirmationOpen] = useState(false);
  const [isPoolingConfirmationOpen, setIsPoolingConfirmationOpen] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<DataTypes | null>(null);
  // Inline approval form state
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [isSkipMode, setIsSkipMode] = useState(false);
  const [inlineSigUrl, setInlineSigUrl] = useState('');
  const [inlineUploadedSig, setInlineUploadedSig] = useState<string | null>(null);
  const [inlineRemarks, setInlineRemarks] = useState('');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  // Locally staged approval — shown immediately, sent to server on Save Changes
  const [pendingApproval, setPendingApproval] = useState<Partial<StageApprovalType> | null>(null);
  // Edit mode — allows re-submitting an already-saved stage approval
    const [isEditMode, setIsEditMode] = useState(false);
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
  const { data: fetchedStageRequirementsData } = useGetStageRequirements(
    applicant?.applicationId || 0,
    activeTab || 0,
    isOpen && !!applicant?.applicationId && activeTab !== actionState.stageId && activeTab !== null
  );

  // Hook to get stage notes
  const { data: fetchedStageNotesData } = useGetStageNotes(
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

  // Hook to approve/skip a stage
  const approveStage = useApproveStage(applicant?.applicationId || 0);

  // Current logged-in user details (for pending approval display)
  const { data: currentUserData } = useGetUserDetails() as { data: any };

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
    setPendingApproval(null);
    setShowInlineForm(false);
    setIsEditMode(false);
    resetInlineForm();
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

  // Get approval record for the current stage — local pending takes priority over server data
  const getCurrentStageApproval = (): StageApprovalType | null => {
    const serverApproval = applicant?.stage_approvals?.find((a) => a.job_stage === actionState.stageId) || null;
    if (pendingApproval && pendingApproval.job_stage === actionState.stageId) {
      return { ...serverApproval, ...pendingApproval } as StageApprovalType;
    }
    return serverApproval;
  };

  // Get approval record for any stage by id
  const getStageApproval = (stageId: number): StageApprovalType | null => {
    return applicant?.stage_approvals?.find((a) => a.job_stage === stageId) || null;
  };

  // Show the approval form locally — no API call until Save Changes
  const handleApproveToggle = () => {
    setShowInlineForm(true);
  };

  // Store approval details locally — API fires on Save Changes
  const handleInlineApproveSubmit = () => {
    const signature = inlineSigUrl || inlineUploadedSig;
    if (!signature) {
      toast.custom(() => <CustomToast message='Signature is required.' type='error' />, { duration: 4000 });
      return;
    }
    setPendingApproval({
      is_approved: true,
      is_skipped: isSkipMode,
      signature,
      approval_remarks: inlineRemarks.trim() || null,
      approval_date: new Date().toISOString(),
      job_stage: actionState.stageId!,
      approved_by_name: currentUserData?.name || null,
    });
    setShowInlineForm(false);
    setIsEditMode(false);
    resetInlineForm();
  };

  const resetInlineForm = () => {
    setInlineSigUrl('');
    setInlineUploadedSig(null);
    setInlineRemarks('');
    setIsSkipMode(false);
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

  // Collapse skip/approve forms when status changes away from "passed"
  useEffect(() => {
    if (currentStatus !== 'passed') {
      setShowInlineForm(false);
      setIsEditMode(false);
      resetInlineForm();
    }
  }, [currentStatus]);

  // Pre-fill inline form from existing approval data whenever edit mode is entered
  useEffect(() => {
    if (isEditMode) {
      const approval = getCurrentStageApproval();
      if (approval) {
        setInlineSigUrl(approval.signature || '');
        setInlineRemarks(approval.approval_remarks || '');
      }
    }
  }, [isEditMode]);

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
    // Skip unsaved changes check if a confirmation dialog was recently closed.
    // Do NOT reset the ref here — the timeout in handleCancelConfirmation resets it
    // after Headless UI finishes all transition-related events.
    if (isConfirmingRef.current) {
      return;
    }
    handleModalClose(() => {
      resetFormData();
      setIsOpen(false);
      setTimeout(() => setActionState(initialActionState), 400);
    });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    handleSubmitAsync();
  };

  const handleSubmitAsync = async () => {
    const data: DataTypes = {} as DataTypes;
    data.checklists = checks;
    data.status = getValues('status') || applicant?.status;
    data.stage_notes = {
      notes: currentStageNotes,
    };
    data.id = applicant?.applicationId;
    data.applicant_name = applicant?.name || '';

    // Intercept rejected/pooling statuses for confirmation
    if (data.status === 'rejected') {
      setPendingSubmitData(data);
      setIsRejectConfirmationOpen(true);
      return;
    }
    if (data.status === 'pooling') {
      setPendingSubmitData(data);
      setIsPoolingConfirmationOpen(true);
      return;
    }

    // Block save without a completed stage approval only when passing
    const stageApproval = getCurrentStageApproval();
    if (data.status === 'passed' && !stageApproval?.signature && !stageApproval?.is_skipped) {
      return;
    }

    // Fire pending approval API now (deferred from Submit Approval button)
    if (pendingApproval?.signature) {
      const wasSkipped = pendingApproval.is_skipped || false;

      // Save checklist before approving — on skip the backend advances the stage immediately,
      // so this must run first while the current stage is still active.
      if (wasSkipped && applicant?.applicationId && requirements.length > 0) {
        try {
          const requirementStatuses: Record<string, boolean> = {};
          requirements.forEach((req) => {
            requirementStatuses[req] = checks.includes(req);
          });
          await updateStageRequirementsMutation.mutateAsync({
            appliedJobId: applicant.applicationId,
            requirementStatuses,
          });
        } catch {
          // Non-blocking
        }
      }

      try {
        await approveStage.mutateAsync({
          stage_id: pendingApproval.job_stage as number,
          signature: pendingApproval.signature,
          approval_remarks: pendingApproval.approval_remarks || null,
          approval_date: pendingApproval.approval_date || null,
          is_skipped: wasSkipped,
        });
      } catch (err: any) {
        toast.custom(() => <CustomToast message={err.message || 'Failed to save stage approval.'} type='error' />, { duration: 4000 });
        return;
      }

      // Skip: backend already advanced the stage — just close and refetch, do NOT call handleFormSubmit
      if (wasSkipped) {
        if (currentStageNotes.trim() && applicant?.applicationId) {
          try {
            await updateStageNotesMutation.mutateAsync({
              appliedJobId: applicant.applicationId,
              stageId: actionState.stageId,
              notes: currentStageNotes,
            });
          } catch {
            // Notes save failure is non-blocking
          }
        }
        toast.custom(() => <CustomToast message='Stage skipped successfully.' type='success' />, { duration: 4000 });
        setIsOpen(false);
        setTimeout(() => {
          setPendingApproval(null);
          resetFormData();
          setActionState(initialActionState);
        }, 400);
        return;
      }
    }

    // Check if applicant is being marked as "Hired" (passed status in final stage)
    const isBeingHired = data.status === 'passed' && actionState.isFinalStage;

    // Check if job posting is fully staffed (lift to Content.tsx for modal handling)
    if (isBeingHired && jobPostingDetails?.hired_count >= jobPostingDetails?.required_slot) {
      setIsOpen(false);
      setTimeout(() => {
        setPendingApproval(null);
        resetFormData();
        if (onJobCapacityNeeded) onJobCapacityNeeded(data);
      }, 400);
      return;
    }

    setIsOpen(false);

    if (isBeingHired && !hasActiveSubscription) {
      setTimeout(() => {
        setPendingApproval(null);
        resetFormData();
      }, 400);
      setIsGoPremiumModalOpen(true);
    } else {
      setTimeout(() => {
        setPendingApproval(null);
        resetFormData();
        handleFormSubmit(data);
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
    }, 400);
  };

  const handleConfirmReject = () => {
    setIsRejectConfirmationOpen(false);
    if (!pendingSubmitData) return;
    isConfirmingRef.current = true;
    const submitData = pendingSubmitData;
    setPendingSubmitData(null);
    setIsOpen(false);
    setTimeout(() => {
      setPendingApproval(null);
      resetFormData();
      handleFormSubmit(submitData);
    }, 400);
  };

  const handleConfirmPooling = () => {
    setIsPoolingConfirmationOpen(false);
    if (!pendingSubmitData) return;
    isConfirmingRef.current = true;
    const submitData = pendingSubmitData;
    setPendingSubmitData(null);
    setIsOpen(false);
    setTimeout(() => {
      setPendingApproval(null);
      resetFormData();
      handleFormSubmit(submitData);
    }, 400);
  };

  const handleCancelConfirmation = () => {
    // Block any spurious handleClose calls on ModalLayout while the
    // confirmation dialog's leave transition is running.
    isConfirmingRef.current = true;
    setIsRejectConfirmationOpen(false);
    setIsPoolingConfirmationOpen(false);
    setPendingSubmitData(null);
    setValue('status', applicant?.status || '');
    // Reset after Headless UI finishes all transition-related events (300ms + buffer)
    setTimeout(() => {
      isConfirmingRef.current = false;
    }, 500);
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
                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>Stage Tasks</p>
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
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
            <div className='grid gap-4'>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Status</p>
              <div className='grid gap-2'>
                {statuses.map((status, index) => {
                  const { title, id } = status;
                  const disabled = id === 'passed' && isDisabled;
                  const isSelected = !disabled && getValues('status') === id;
                  return (
                    <Fragment key={id}>
                      {index === 3 && (
                        <div className='flex items-center gap-3 my-1'>
                          <hr className='flex-1 border-gray-200' />
                        </div>
                      )}
                      <label
                        htmlFor={id}
                        className={`flex items-center border rounded-lg px-4 py-3 transition-colors ${
                          disabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
                        } ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          onChange={(e) => setValue('status', e.target.id)}
                          defaultChecked={applicant?.status === id}
                          checked={disabled ? false : getValues('status') === id ? true : undefined}
                          disabled={disabled}
                          id={id}
                          type='radio'
                          name='status'
                          className='w-4 h-4 text-blue-600'
                        />
                        <span className={`flex-1 ml-3 text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                          {title === 'Passed' ? (actionState.isFinalStage ? 'Hired' : title) : title}
                        </span>
                        {id === 'rejected' && (
                          <ExclamationTriangleIcon className='w-5 h-5 text-red-500' />
                        )}
                        {id === 'pooling' && (
                          <ArchiveBoxIcon className='w-5 h-5 text-blue-500' />
                        )}
                      </label>
                    </Fragment>
                  );
                })}
              </div>
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
                          {/* Approval Block — only shown when "Passed" is selected */}
                          {currentStatus === 'passed' && (() => {
                            const approval = getCurrentStageApproval();

                            // State 3: fully approved (has signature) → read-only (unless redo mode active)
                            if (approval?.signature && !isEditMode) {
                              return (
                                <div className='mt-5 rounded-lg border border-gray-200 bg-white p-5 text-sm space-y-4'>
                                  <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider'>
                                      <CheckBadgeIcon className='w-4 h-4' />
                                      Stage Approval
                                      {approval.is_skipped && (
                                        <span className='ml-2 bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium'>SKIPPED</span>
                                      )}
                                    </div>
                                    {currentStage?.permissions?.can_update && (
                                      <button
                                        type='button'
                                        onClick={() => {
                                          setPendingApproval(null);
                                          setIsSkipMode(false);
                                          setShowInlineForm(true);
                                          setIsEditMode(true);
                                        }}
                                        className='text-xs text-gray-400 hover:text-indigo-600 underline'
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </div>
                                  <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                      <p className='text-xs text-gray-400 uppercase tracking-wide mb-2'>Approver Name</p>
                                      <div className='border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-3'>
                                        {approval.approved_by_photo ? (
                                          <img src={approval.approved_by_photo} alt={approval.approved_by_name || ''} className='w-8 h-8 rounded-full object-cover flex-shrink-0' />
                                        ) : (
                                          <div className='w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0'>
                                            {approval.approved_by_name?.[0]?.toUpperCase() || '?'}
                                          </div>
                                        )}
                                        <div>
                                          <p className='font-semibold text-gray-800 text-sm leading-tight'>{approval.approved_by_name || '—'}</p>
                                          <p className='text-xs text-gray-400'>Stage Approver</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <p className='text-xs text-gray-400 uppercase tracking-wide mb-2'>Signature</p>
                                      <div className='border border-gray-200 rounded-lg p-2 bg-white min-h-[56px] flex items-center'>
                                        <img src={approval.signature} alt='Signature' className='w-1/2 h-10 object-contain mx-auto block' />
                                      </div>
                                      <p className='text-xs text-green-600 font-semibold mt-1'>Digital Signature Verified</p>
                                    </div>
                                  </div>
                                  <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                      <p className='text-xs text-gray-400 uppercase tracking-wide mb-2'>Approval Remarks</p>
                                      <div className='border border-gray-200 rounded-lg px-3 py-2 min-h-[60px] bg-gray-50'>
                                        <p className='text-gray-700 text-sm whitespace-pre-wrap'>
                                          {approval.approval_remarks || <span className='italic text-gray-400'>No remarks</span>}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className='text-xs text-gray-400 uppercase tracking-wide mb-2'>Signature Date</p>
                                      <div className='border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'>
                                        <p className='text-gray-700 text-sm'>
                                          {approval.approval_date
                                            ? new Date(approval.approval_date).toLocaleDateString()
                                            : <span className='italic text-gray-400'>—</span>}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // State 2: toggled ON but no signature yet → read-only approver + expand button
                            // Also enters this state when showInlineForm=true (local-first: no server toggle needed)
                            if (approval?.is_approved || showInlineForm) {
                              const activeSig = inlineSigUrl || inlineUploadedSig;
                              const isSkip = isSkipMode || approval?.is_skipped;
                              return (
                                <div className={`mt-5 rounded-lg border p-5 text-sm space-y-4 bg-white ${isSkip ? 'border-amber-200' : 'border-indigo-100'}`}>
                                  <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${isSkip ? 'text-amber-600' : 'text-indigo-600'}`}>
                                    {isSkip ? <ForwardIcon className='w-4 h-4' /> : <CheckBadgeIcon className='w-4 h-4' />}
                                    {isSkip ? 'Skip Stage' : 'Stage Approval'}
                                  </div>
                                  {/* Expand button or editable form */}
                                  <>
                                      {/* Signature row */}
                                      <div>
                                        <p className='text-xs text-gray-500 uppercase tracking-wide mb-2'>
                                          Signature <span className='text-red-500'>*</span>
                                        </p>
                                        <div className='flex items-start gap-4'>
                                          <div className='flex-1'>
                                            <button
                                              type='button'
                                              onClick={() => setIsSignatureModalOpen(true)}
                                              className={`block w-full font-bold rounded-md border border-savoy-blue py-1.5 px-3 shadow-sm ring-1 ring-inset text-sm ${
                                                inlineSigUrl ? 'bg-savoy-blue text-white' : 'text-savoy-blue'
                                              }`}
                                            >
                                              Draw
                                            </button>
                                          </div>
                                          <p className='text-sm text-gray-400 mt-1'>or</p>
                                          <div className='flex-1'>
                                            <input
                                              type='file'
                                              accept='image/*'
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                  setInlineUploadedSig(ev.target?.result as string);
                                                  setInlineSigUrl('');
                                                };
                                                reader.readAsDataURL(file);
                                              }}
                                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-savoy-blue/10 file:text-savoy-blue hover:file:bg-savoy-blue/20'
                                            />
                                          </div>
                                        </div>
                                        {activeSig && (
                                          <div className='mt-2'>
                                            <img src={activeSig} alt='Signature preview' className='w-1/2 h-16 border border-gray-200 rounded object-contain mx-auto block' />
                                            <button
                                              type='button'
                                              className='text-xs underline text-savoy-blue mt-1'
                                              onClick={() => { setInlineSigUrl(''); setInlineUploadedSig(null); }}
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      {/* Remarks + Date row */}
                                      <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                          <p className='text-xs text-gray-500 uppercase tracking-wide mb-2'>
                                            Approval Remarks <span className='normal-case text-gray-400'>(optional)</span>
                                          </p>
                                          <textarea
                                            value={inlineRemarks}
                                            onChange={(e) => setInlineRemarks(e.target.value)}
                                            placeholder='Add remarks...'
                                            rows={3}
                                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 resize-none'
                                          />
                                        </div>
                                        <div>
                                          <p className='text-xs text-gray-500 uppercase tracking-wide mb-2'>Signature Date</p>
                                          <div className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 bg-gray-50 sm:text-sm sm:leading-6'>
                                            {new Date().toLocaleDateString()}
                                          </div>
                                        </div>
                                      </div>
                                      {/* Submit + Cancel */}
                                      <div className='flex justify-end gap-2'>
                                        <button
                                          type='button'
                                          onClick={() => { setShowInlineForm(false); setInlineSigUrl(''); setInlineUploadedSig(null); setInlineRemarks(''); setIsEditMode(false); }}
                                          className='border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium text-sm rounded-md px-4 py-2'
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type='button'
                                          onClick={handleInlineApproveSubmit}
                                          disabled={approveStage.isLoading}
                                          className='inline-flex items-center gap-2 bg-savoy-blue hover:opacity-90 text-white font-semibold text-sm rounded-md px-5 py-2 disabled:opacity-60'
                                        >
                                          <CheckBadgeIcon className='w-4 h-4' />
                                          {approveStage.isLoading ? 'Saving...' : 'Submit Approval'}
                                        </button>
                                      </div>
                                  </>
                                </div>
                              );
                            }

                            // State 1: no approval record → Skip Stage / Approve Stage buttons
                            if (currentStage?.permissions?.can_update) {
                              return (
                                <div className='mt-5 rounded-lg border border-gray-100 bg-gray-50 py-6 px-6'>
                                  <div className='flex items-center justify-center gap-4'>
                                    {!actionState.isFinalStage && (
                                      <>
                                        <button
                                          type='button'
                                          onClick={() => { setIsSkipMode(true); setShowInlineForm(true); }}
                                          disabled={approveStage.isLoading}
                                          className='flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-widest text-sm rounded-lg px-6 py-3 shadow-sm disabled:opacity-60'
                                        >
                                          <ForwardIcon className='w-5 h-5' />
                                          Skip Stage
                                        </button>
                                        <span className='text-sm text-gray-400 font-medium'>or</span>
                                      </>
                                    )}
                                    <button
                                      type='button'
                                      onClick={() => { setIsSkipMode(false); setShowInlineForm(true); }}
                                      disabled={approveStage.isLoading}
                                      className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-sm rounded-lg px-6 py-3 shadow-sm disabled:opacity-60'
                                    >
                                      <CheckBadgeIcon className='w-5 h-5' />
                                      Approve Stage
                                    </button>
                                  </div>
                                  <p className='text-xs text-gray-400 uppercase tracking-widest font-medium text-center mt-3'>
                                    Select an action to document this stage
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })()}


                        </div>
                      ) : (
                        // Previous stages - read-only
                        <div className='space-y-4'>
                          {/* Stage notes */}
                          {(() => {
                            const stageNote = getStageNote(activeTab);
                            if (!stageNote || !stageNote.notes || stageNote.notes.trim() === '') return null;
                            return (
                              <div className='p-3 border border-gray-300 rounded-lg bg-gray-50'>
                                <p className='text-gray-600 text-sm whitespace-pre-wrap'>{stageNote.notes}</p>
                                {stageNote.created_at && (
                                  <p className='text-xs text-gray-400 mt-2'>
                                    Added: {formatDateToLocal(stageNote.created_at)}
                                  </p>
                                )}
                              </div>
                            );
                          })()}

                          {/* Approval block for previous stage */}
                          {(() => {
                            const approval = getStageApproval(activeTab);
                            if (!approval) return null;
                            return (
                              <div className='rounded-lg border border-gray-200 bg-white p-5 text-sm space-y-4'>
                                <div className='flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider'>
                                  <CheckBadgeIcon className='w-4 h-4' />
                                  Stage Approval
                                  {approval.is_skipped && (
                                    <span className='ml-2 bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium'>SKIPPED</span>
                                  )}
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                  <div>
                                    <p className='text-xs text-gray-400 uppercase tracking-wide mb-2'>Approver Name</p>
                                    <div className='border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-3'>
                                      {approval.approved_by_photo ? (
                                        <img src={approval.approved_by_photo} alt={approval.approved_by_name || ''} className='w-8 h-8 rounded-full object-cover flex-shrink-0' />
                                      ) : (
                                        <div className='w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0'>
                                          {approval.approved_by_name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                      )}
                                      <div>
                                        <p className='font-semibold text-gray-800 text-sm leading-tight'>
                                          {approval.approved_by_name || '—'}
                                        </p>
                                        <p className='text-xs text-gray-400'>Stage Approver</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className='text-xs text-gray-400 uppercase tracking-wide mb-2'>Signature</p>
                                    <div className='border border-gray-200 rounded-lg p-2 bg-white min-h-[56px] flex items-center'>
                                      {approval.signature ? (
                                        <img src={approval.signature} alt='Signature' className='w-1/2 h-10 object-contain mx-auto block' />
                                      ) : (
                                        <span className='text-xs text-gray-400 italic'>No signature</span>
                                      )}
                                    </div>
                                    <p className='text-xs text-green-600 font-semibold mt-1'>Digital Signature Verified</p>
                                  </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                  <div>
                                    <p className='text-xs text-gray-400 uppercase tracking-wide mb-2'>Approval Remarks</p>
                                    <div className='border border-gray-200 rounded-lg px-3 py-2 min-h-[60px] bg-gray-50'>
                                      <p className='text-gray-700 text-sm whitespace-pre-wrap'>
                                        {approval.approval_remarks || <span className='italic text-gray-400'>No remarks</span>}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className='text-xs text-gray-400 uppercase tracking-wide mb-2'>Signature Date</p>
                                    <div className='border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'>
                                      <p className='text-gray-700 text-sm'>
                                        {approval.approval_date
                                          ? new Date(approval.approval_date).toLocaleDateString()
                                          : <span className='italic text-gray-400'>—</span>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
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
            {(() => {
              const isPassed = currentStatus === 'passed';
              const serverHasApproval = !!applicant?.stage_approvals?.find((a) => a.job_stage === actionState.stageId)?.signature;
              // Disabled when passed + no approval: no local pending AND (no server approval OR redo mode active without new submission)
              const isSaveDisabled = isPassed && !pendingApproval && (!serverHasApproval || isEditMode);
              return (
                <>
                  <span
                    data-tooltip-id="checklist-save-tooltip"
                    data-tooltip-content={isSaveDisabled ? 'Please complete stage approval before saving.' : undefined}
                  >
                    <button
                      type='submit'
                      disabled={approveStage.isLoading || updateStageNotesMutation.isLoading || isSaveDisabled}
                      className='rounded-lg py-2 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2'
                    >
                      {(approveStage.isLoading || updateStageNotesMutation.isLoading) && (
                        <LoadingSpinner size='sm' color='blue' />
                      )}
                      {approveStage.isLoading || updateStageNotesMutation.isLoading ? null : 'Save Changes'}
                    </button>
                  </span>
                  <Tooltip id="checklist-save-tooltip" />
                </>
              );
            })()}
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

      {/* Reject Confirmation Dialog */}
      {isRejectConfirmationOpen && (
        <RejectConfirmationModal
          isOpen={isRejectConfirmationOpen}
          onCancel={handleCancelConfirmation}
          onConfirm={handleConfirmReject}
        />
      )}

      {/* Pooling Confirmation Dialog */}
      {isPoolingConfirmationOpen && (
        <PoolingConfirmationModal
          isOpen={isPoolingConfirmationOpen}
          onCancel={handleCancelConfirmation}
          onConfirm={handleConfirmPooling}
        />
      )}


      {/* Inline signature draw modal */}
      {isSignatureModalOpen && (
        <SignatureModal
          isOpen={isSignatureModalOpen}
          setIsOpen={setIsSignatureModalOpen}
          setSignatureUrl={setInlineSigUrl}
        />
      )}

      </ModalLayout>

      {!hasActiveSubscription && (
        <ScreenApplicantGoPremiumModal isOpen={isGoPremiumModalOpen} setIsOpen={handlePremiumModalClose} />
      )}
    </>
  );
}
