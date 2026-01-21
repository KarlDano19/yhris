'use client';

import React, { useReducer, useRef, useState, useEffect, useCallback, Fragment, useMemo } from 'react';
import toast from 'react-hot-toast';

import { useParams } from 'next/navigation';
import Link from 'next/link';

import { INITIAL_STATE, stageReducer } from '../reducers/stageReducer';
import { initialActionState } from '../lib/initialActionState';
import { ModalTypes, StageType } from '../types';
import actionTypes from '../lib/actionTypes';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import AddApplicantModal from '../modals/AddApplicantModal';
import StageRequirements from '../modals/StageRequirements';
import Checklist from '../modals/Checklist';
import ScheduleInterview from '../modals/ScheduleInterview';
import SendEmailModal from '@/components/SendEmailModal';
import Confirmation from '../modals/Confirmation';
import ApplicantForm from '../modals/ApplicantForm';
import BatchResumeUpload from '../modals/BatchResumeUpload';
import ArchivedApplicantsModal from '../modals/ArchivedApplicantsModal';
import StageAssignment from '../modals/StageAssignment';
import NavigationModal from './modals/NavigationModal';
import StateContext from '../contexts/StateContext';
import AddStageBtn from './AddStageBtn';
import Filter, { FilterGroup, FilterValues } from '@/components/common/Filter';
import DragAndDrop from './DragAndDrop';
import useGetAppliedApplicants from '../hooks/useGetAppliedApplicants';
import useGetJobPostDetails from '../hooks/useGetJobPostDetails';
import { useFilterPersistence } from '@/components/hooks/useFilterPersistence';
import useUpdateStage from '../hooks/useUpdateStage';
import useSendEmail from '../hooks/useSendEmail';
import useUpdateStatus from '../hooks/useUpdateStatus';
import useSendInterviewSchedule from '../hooks/useSendInterviewSchedule';
import useSeedApplicants from '../hooks/useSeedApplicants';
import useUnseedApplicants from '../hooks/useUnseedApplicants';
import SeederButton from '@/components/SeederButton';

import { ArrowLeftIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';
import UploadIcon from '@/svg/UploadIcon';
import ArchiveIcon from '@/svg/ArchiveIcon';
import PlusIconGreen from '@/svg/PlusIconGreen';
import '../styles.css';

type ModalSelectedTypes = {
  component: React.ReactNode;
  dispatch?: {
    type: string;
    payload?: any;
  };
};

export default function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const params = useParams();
  const { mutate: updateMutate } = useUpdateStage();
  const { mutate: updateStatusMutate } = useUpdateStatus();
  const { mutate: sendInterviewScheduleMutate, isLoading: isSendInterviewScheduleLoading } = useSendInterviewSchedule();
  const seedApplicantsMutation = useSeedApplicants(params.id as string);
  const unseedApplicantsMutation = useUnseedApplicants(params.id as string);
  
  // Date range filter states - must be declared before hook calls
  // "pending" dates are what the user selects, "applied" dates are what's used in the query
  const [dateFrom, setDateFrom] = useState<any>('');  // Pending date from
  const [dateTo, setDateTo] = useState<any>('');      // Pending date to
  const [appliedDateFrom, setAppliedDateFrom] = useState<any>('');  // Applied date from
  const [appliedDateTo, setAppliedDateTo] = useState<any>('');      // Applied date to
  const [useDateFilter, setUseDateFilter] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Format date to YYYY-MM-DD for API
  const formatDateForAPI = useCallback((date: any) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);
  
  const {
    data: dataJobPostDetails,
    isLoading: isGetJobPostDetailsLoading,
    refetch: jobPostDetailsRefetch,
  } = useGetJobPostDetails(params.id);
  const recentOnly = !useDateFilter;

  const { data: dataAppliedApplicants, refetch: appliedApplicantRefetch, isFetching: isFetchingApplicants } = useGetAppliedApplicants(
    params.id,
    false,
    recentOnly,
    useDateFilter && appliedDateFrom ? formatDateForAPI(appliedDateFrom) : undefined,
    useDateFilter && appliedDateTo ? formatDateForAPI(appliedDateTo) : undefined
  );
  const { data: dataArchivedApplicants, refetch: archivedApplicantRefetch } = useGetAppliedApplicants(
    params.id,
    true,
    recentOnly,
    useDateFilter && appliedDateFrom ? formatDateForAPI(appliedDateFrom) : undefined,
    useDateFilter && appliedDateTo ? formatDateForAPI(appliedDateTo) : undefined
  );
  const {
    CLEAR_STAGE,
    STAGE_REQUIREMENTS,
    CHECKLIST,
    SEND_EMAIL,
    SCHEDULE_INTERVIEW,
    ADD_STAGE,
    SET_ONBOARDING,
    SET_APPLICANT,
    ARCHIVED_APPLICANTS,
  } = actionTypes;

  // Calculate count of archived applicants in the last 30 days
  const recentArchivedCount = useMemo(() => {
    if (!dataArchivedApplicants || !Array.isArray(dataArchivedApplicants)) return 0;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return dataArchivedApplicants.filter((applicant: any) => {
      // Only count if actually archived with rejected/withdrawn status
      const isArchivedStatus = applicant.status === 'rejected' || applicant.status === 'withdrawn';
      if (!isArchivedStatus) return false;
      
      // Check if archived within the last 30 days
      const archivedDate = new Date(applicant.updated_at || applicant.created_at);
      return archivedDate >= thirtyDaysAgo;
    }).length;
  }, [dataArchivedApplicants]);
  const [state, dispatch] = useReducer(stageReducer, INITIAL_STATE);
  const [actionState, setActionState] = useState(initialActionState);
  const { title, whichModal } = actionState.modal;
  const gridCols = { gridTemplateColumns: `repeat(${state?.length}, 300px)` };
  const containerRef = useRef<HTMLElement | null>(null);
  const requirements = state.find((item: StageType) => {
    return item.id === actionState.stageId;
  })?.requirements;
  const { mutate: emailMutate } = useSendEmail();
  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [isArchivedApplicantsModalOpen, setIsArchivedApplicantsModalOpen] = useState(false);
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);
  
  // Define filter groups for the Filter component
  const filterGroups: FilterGroup[] = [
    {
      id: 'status',
      title: 'Application Status',
      options: [
        { label: 'Ongoing', value: 'Ongoing' },
        { label: 'Hired', value: 'Hired' },
      ],
      multiSelect: true,
      allowEmpty: false,
    },
  ];

  const [filters, setFilters] = useFilterPersistence<FilterValues>(`screen-applicants-${params.id}`, {
    status: ['Ongoing', 'Hired'],
  });
  
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  
  // Get screening questions and ideal answers from the job posting
  const [screeningQuestions, setScreeningQuestions] = useState<any[]>([]);
  const [processedApplicants, setProcessedApplicants] = useState<any[]>([]);

  /**
   * Check if status update should trigger archived modal refresh
   */
  const shouldTriggerArchivedRefresh = useCallback((status: string) => {
    // Only trigger if status is rejected or withdrawn (archived statuses)
    return status === 'rejected' || status === 'withdrawn';
  }, []);

  /**
   * Check if status update should trigger navigation modal
   * Only show navigation modal when applicant is hired (passed) AND it's the final stage
   */
  const shouldTriggerNavigationModal = useCallback((status: string) => {
    // Only trigger if status is passed (hired) AND it's the final stage
    return status === 'passed' && actionState.isFinalStage;
  }, [actionState.isFinalStage]);

  useEffect(() => {
    if (dataJobPostDetails?.screening_questions && dataJobPostDetails.screening_questions !== null) {
      setScreeningQuestions(dataJobPostDetails.screening_questions || []);
    } else {
      setScreeningQuestions([]);
    }
  }, [dataJobPostDetails]);

  // Process applicants and evaluate their screening answers
  const processApplicants = (applicants: any[]) => {
    if (!screeningQuestions.length || !applicants?.length) return applicants;

    // Filter out rejected and withdrawn applicants from the main list
    const activeApplicants = applicants.filter((applicant) => 
      applicant.status !== 'rejected' && applicant.status !== 'withdrawn'
    );

    return activeApplicants.map((applicant) => {
      // Get the applicant's screening answers
      const answers =
        applicant.applicant?.screening_answers && applicant.applicant.screening_answers !== null
          ? applicant.applicant.screening_answers
          : [];

      // Check if ALL Yes/No and Multiple Choice questions match their ideal answers for "Not Fit" determination
      let isGoodFit = true;

      if (!answers.length) {
        // If no answers (empty due to previous data), treat as good fit
        isGoodFit = true;
      } else {
        // Process each answer and check if it matches the ideal answer for ALL Yes/No and Multiple Choice questions
        // Only check questions that should be shown to candidates
        answers.forEach((answer: { question: string; answer: string | string[] }) => {
          const question = screeningQuestions.find((q) => q.question === answer.question);
          if (question && question.showToCandidates !== false) {
            const responseType = question.responseType || 'Yes / No';
            let isMatch = false;

            // Only evaluate Yes/No and Multiple Choice for "Not Fit" determination
            if (responseType === 'Multiple Choice') {
              // For multiple choice, check if any of the applicant's answers match any ideal answers
              const idealAnswers = Array.isArray(question.idealAnswer) ? question.idealAnswer : [question.idealAnswer];
              const applicantAnswers = Array.isArray(answer.answer) ? answer.answer : [answer.answer];

              isMatch = Boolean(
                idealAnswers.some((ideal: any) =>
                  applicantAnswers.some((app: any) =>
                    app != null && ideal != null && String(app).toLowerCase() === String(ideal).toLowerCase()
                  )
                )
              );
            } else if (responseType === 'Yes / No') {
              // Yes/No questions - check if answer matches ideal answer
              const idealAnswer = Array.isArray(question.idealAnswer) ? question.idealAnswer[0] : question.idealAnswer;
              const applicantAnswer = Array.isArray(answer.answer) ? answer.answer[0] : answer.answer;
              if (applicantAnswer == null || idealAnswer == null) {
                isMatch = false;
              } else {
                isMatch = String(applicantAnswer).toLowerCase() === String(idealAnswer).toLowerCase();
              }
            } else {
              // For Text questions, don't affect "Not Fit" status - skip evaluation
              return;
            }

            // If this Yes/No or Multiple Choice question doesn't match ideal answer, mark as not fit
            if (!isMatch) {
              isGoodFit = false;
            }
          }
        });

        // Check if any mustHave questions were not answered
        // Only check questions that should be shown to candidates
        screeningQuestions
          .filter((question) => question.showToCandidates !== false)
          .forEach((question) => {
            if (question.mustHave) {
              const wasAnswered = answers.some((answer: { question: string }) => answer.question === question.question);

              if (!wasAnswered) {
                isGoodFit = false;
              }
            }
          });
      }

      const screeningFit = isGoodFit ? 'good' : 'bad';

      return {
        ...applicant,
        screeningFit,
        screeningAnswers: answers,
      };
    }).sort((a: any, b: any) => {
      // Helper function to check if applicant is a new applicant (first stage, no stage notes)
      const isNewApplicant = (applicant: any) => {
        // Check if this is likely a new applicant based on the same logic in Person.tsx
        // This is a simplified check - in a real scenario, you'd want to pass stage info
        return !applicant.stage_notes || applicant.stage_notes.length === 0;
      };
      
      const aIsNew = isNewApplicant(a);
      const bIsNew = isNewApplicant(b);
      
      // Prioritize new applicants first
      if (aIsNew && !bIsNew) return -1; // a comes first
      if (!aIsNew && bIsNew) return 1;  // b comes first
      
      // If both are new or both are not new, sort by date (newest first)
      const dateA = new Date(a.updated_at || a.created_at || new Date());
      const dateB = new Date(b.updated_at || b.created_at || new Date());
      
      return dateB.getTime() - dateA.getTime();
    });
  };

  useEffect(() => {
    if (dataJobPostDetails) {
      dispatch({ type: CLEAR_STAGE });
      let jobStages: any = [];
      dataJobPostDetails.job_stages?.forEach((item: any) => {
        let newData = {
          id: item.id,
          title: item.title,
          isNewStage: false,
          requirements: item.stage_requirements,
          applicants: [],
          orderBy: item.order_by,
          is_final_stage: item.is_final_stage || false, // Include is_final_stage from API
          permissions: item.permissions, // Make sure permissions are passed through
        };
        jobStages.push(newData);
      });
      dispatch({ type: SET_ONBOARDING, payload: { jobStages: jobStages } });
    }

    if (dataJobPostDetails && dataAppliedApplicants) {
      // Process the applicants to determine if they are good fits
      const processed = processApplicants(dataAppliedApplicants);
      setProcessedApplicants(processed);

      processed.forEach((item: any) => {
        let newData = {
          id: item.applicant.id,
          email: item.applicant.email,
          applicationId: item.id,
          image: item.applicant.photo_url || item.applicant.photo || null,
          name: item.applicant.name,
          checklists: [],
          status: item.status,
          stagePosition: item.job_stages,
          stage_notes: item.stage_notes || [],
          screeningFit: item.screeningFit,
          screeningAnswers: item.screeningAnswers || [],
          created_at: item.created_at,
          updated_at: item.updated_at,
          is_archived: item.is_archived || false,
        };
        dispatch({ type: SET_APPLICANT, payload: { applicant: newData } });
      });
    }
  }, [dataJobPostDetails, dataAppliedApplicants, screeningQuestions]);

  const handleFormSubmit = (data: any, isOpen?: any) => {
    if (whichModal) {
      const modalSelected: ModalSelectedTypes = modals[whichModal];
      if (!modalSelected.dispatch) return;

      modalSelected.dispatch.payload.formData = data;

      if (modalSelected.dispatch.type === 'STAGE_REQUIREMENTS') {
        const callbackReq = {
          onSuccess: () => {
            dispatch(modalSelected.dispatch);
            toast.custom(() => <CustomToast message='Successfully set-up stage requirements.' type='success' />, {
              duration: 4000,
            });
            // Reset actionState after successful submission to allow modal to be reopened
            setActionState(initialActionState);
          },
          onError: (err: any) => {
            toast.custom(() => <CustomToast message={err} type='error' />, {
              duration: 7000,
            });
          },
        };
        let postData = {
          stage_id: modalSelected.dispatch.payload.actionState.stageId,
          stage_requirements: data.join(','),
        };
        updateMutate(postData, callbackReq);
      }
      if (modalSelected.dispatch.type === 'CHECKLIST') {
        data['job_posting_id'] = params.id;
        const callbackReq = {
          onSuccess: () => {
            dispatch(modalSelected.dispatch);
            
            // Create dynamic success message based on the action performed
            let successMessage = 'Successfully updated the checklist.';
            
            if (data.status === 'hired') {
              successMessage = 'Successfully hired the applicant!';
            } else if (data.status === 'rejected') {
              successMessage = 'Successfully rejected the applicant.';
            } else if (data.status === 'withdrawn') {
              successMessage = 'Successfully marked applicant as withdrawn.';
            } else if (data.status === 'ongoing') {
              successMessage = 'Successfully updated applicant status.';
            } else if (data.status === 'passed') {
              successMessage = 'Successfully moved applicant to next stage.';
            }
            
            // Add additional context for special actions
            if (data.new_required_slot) {
              successMessage += ' Required slot increased.';
            }
            if (data.deactivate_job_posting) {
              successMessage += ' Job posting deactivated.';
            }
            
            toast.custom(() => <CustomToast message={successMessage} type='success' />, {
              duration: 4000,
            });
            jobPostDetailsRefetch();
            appliedApplicantRefetch();
            
            // ============================================================================
            // REFRESH ARCHIVED APPLICANTS ON STATUS UPDATE
            // ============================================================================
            if (shouldTriggerArchivedRefresh(data.status)) {
              archivedApplicantRefetch();
            }
            
            // ============================================================================
            // SHOW NAVIGATION MODAL ON SUCCESSFUL HIRING FROM FINAL STAGE
            // ============================================================================
            if (shouldTriggerNavigationModal(data.status)) {
              setIsNavigationModalOpen(true);
            }
            
            // Reset actionState after successful submission to allow modal to be reopened
            setActionState(initialActionState);
          },
          onError: (err: any) => {
            toast.custom(() => <CustomToast message={err} type='error' />, {
              duration: 7000,
            });
          },
        };
        updateStatusMutate(data, callbackReq);
      }
      if (modalSelected.dispatch.type === 'SEND_EMAIL') {
        const callbackReq = {
          onSuccess: () => {
            isOpen(false);
            dispatch(modalSelected.dispatch);
            toast.custom(() => <CustomToast message="You have successfully sent an email." type="success" />, {
              duration: 5000,
            });
            // Reset actionState after successful submission to allow modal to be reopened
            setActionState(initialActionState);
          },
          onError: (err: any) => {
            toast.custom(() => <CustomToast message={err} type='error' />, {
              duration: 7000,
            });
          },
        };
        emailMutate(data, callbackReq);
      }
      if (modalSelected.dispatch.type === 'SCHEDULE_INTERVIEW') {
        const callbackReq = {
          onSuccess: () => {
            isOpen(false);
            dispatch(modalSelected.dispatch);
            toast.custom(() => <CustomToast message="You have successfully sent interview request." type="success" />, {
              duration: 5000,
            });
            // Reset actionState after successful submission to allow modal to be reopened
            setActionState(initialActionState);
          },
          onError: (err: any) => {
            toast.custom(() => <CustomToast message={err} type='error' />, {
              duration: 7000,
            });
          },
        };
        sendInterviewScheduleMutate(data, callbackReq);
      }
    }
  };

  const modals: ModalTypes = {
    STAGE_REQUIREMENTS: {
      component: <StageRequirements title={title} requirements={requirements} handleFormSubmit={handleFormSubmit} />,
      dispatch: {
        type: STAGE_REQUIREMENTS,
        payload: { actionState, setActionState },
      },
    },
    CHECKLIST: {
      component: (
        <Checklist
          title={title}
          requirements={requirements}
          handleFormSubmit={handleFormSubmit}
          hasActiveSubscription={hasActiveSubscription}
          jobPostingDetails={dataJobPostDetails}
        />
      ),
      dispatch: {
        type: CHECKLIST,
        payload: { actionState, setActionState },
      },
    },
    SEND_EMAIL: {
      component: (
        <SendEmailModal
          title={title}
          isOpen={true}
          onClose={() => setActionState(initialActionState)}
          onSubmit={(data) => handleFormSubmit(data, () => setActionState(initialActionState))}
          defaultRecipients={actionState.email ? [actionState.email] : []}
          showDragDropAttachment={true}
          allowMultipleAttachments={true}
          submitButtonText="Send"
        />
      ),
      dispatch: {
        type: SEND_EMAIL,
        payload: { actionState, setActionState },
      },
    },
    SCHEDULE_INTERVIEW: {
      component: (
        <ScheduleInterview
          title={title}
          handleFormSubmit={handleFormSubmit}
          isSendInterviewScheduleLoading={isSendInterviewScheduleLoading}
        />
      ),
      dispatch: {
        type: SCHEDULE_INTERVIEW,
        payload: { actionState, setActionState },
      },
    },
    STAGE_ASSIGNMENT: {
      component: <StageAssignment title={title} handleFormSubmit={handleFormSubmit} />,
      dispatch: {
        type: 'STAGE_ASSIGNMENT',
        payload: { actionState, setActionState },
      },
    },
    CONFIRMATION: {
      component: <Confirmation onStageDeleted={() => {
        jobPostDetailsRefetch();
        appliedApplicantRefetch();
        archivedApplicantRefetch();
      }} />,
    },
    APPLICANT_FORM: {
      component: <ApplicantForm title={title} JobTitle={dataJobPostDetails?.job_title} screeningQuestions={screeningQuestions} />,
    },
  };

  const handleAddStage = () => {
    const { current: element } = containerRef;
    const hasPendingStage = state.some((stage: any) => stage.isNewStage);
    if (hasPendingStage) {
      toast.custom(() => <CustomToast message='Cannot add yet, you still have pending stage.' type='error' />, {
        duration: 7000,
      });
    } else {
      dispatch({
        type: ADD_STAGE,
        payload: { id: new Date().getTime(), addType: 'last' },
      });
      setTimeout(() => {
        if (element !== null) element.scrollLeft = element.scrollWidth;
      }, 10);
    }
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleBatchUploadSuccess = () => {
    // Refresh the applicants list after successful batch upload
    appliedApplicantRefetch();
    toast.custom(<CustomToast message="Batch upload completed successfully!" type="success" />);
  };

  const handleOpenBatchUpload = () => {
    setIsBatchUploadOpen(true);
  };

  const handleCloseBatchUpload = () => {
    setIsBatchUploadOpen(false);
  };

  const handleSeedApplicants = async (count: number) => {
    try {
      const result = await seedApplicantsMutation.mutateAsync({ count });
      toast.custom(() => <CustomToast message={result.message} type='success' />, { duration: 3000 });
      appliedApplicantRefetch();
      archivedApplicantRefetch();
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to seed applicants';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
  };

  const handleUnseedApplicants = async () => {
    try {
      const result = await unseedApplicantsMutation.mutateAsync();
      toast.custom(() => <CustomToast message={result.message} type='success' />, { duration: 3000 });
      appliedApplicantRefetch();
      archivedApplicantRefetch();
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to unseed applicants';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
  };

  // Handle date range changes - only update local state, don't trigger fetch
  const handleDateFromChange = (date: any) => {
    setDateFrom(date);
  };

  const handleDateToChange = (date: any) => {
    setDateTo(date);
  };

  // Handle search button click - apply the date filter
  const handleDateSearch = useCallback(() => {
    if (!dateFrom && !dateTo) {
      // If both dates are cleared, reset to default (recent only)
      setAppliedDateFrom('');
      setAppliedDateTo('');
      setUseDateFilter(false);
      return;
    }
    
    // Apply the pending dates
    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);
    setUseDateFilter(true);
    setIsSearching(true);
  }, [dateFrom, dateTo]);

  // Reset search state when fetching completes
  useEffect(() => {
    if (!isFetchingApplicants && isSearching) {
      setIsSearching(false);
    }
  }, [isFetchingApplicants, isSearching]);

  return (
    <>
      {!isGetJobPostDetailsLoading && (
        <StateContext.Provider value={{ state, dispatch, actionState, setActionState }}>
          <div className='min-h-screen mb-24 md:mb-0'>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-smooth`}>
              <div className='flex px-4 pt-4 pb-2'>
                <Link href='/screen-applicants' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
                  <ArrowLeftIcon className='h-5 w-5' />
                  <h4>Screen Applicants</h4>
                </Link>
              </div>
              <div className='p-2 md:px-8 lg:px-4'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                  <h2 className='text-xl font-bold text-indigo-dye'>
                    Screen Applicants / {dataJobPostDetails?.job_title || ''} Applications
                  </h2>
                  <div className='self-start md:self-center'>
                    <SeederButton
                      onSeed={handleSeedApplicants}
                      onUnseed={handleUnseedApplicants}
                      isLoading={seedApplicantsMutation.isLoading}
                      isUnseeding={unseedApplicantsMutation.isLoading}
                      maxCount={1000}
                      defaultCount={5}
                    />
                  </div>
                </div>
                {whichModal && modals[whichModal].component}

                {/* Desktop Layout */}
                <div className='hidden md:block my-6'>
                  {/* Combined Date Range Filter and Action Buttons Row */}
                  <div className='flex justify-between items-center gap-4'>
                    {/* Date Range Filter - Left Side */}
                    <div className='flex items-center gap-2'>
                      <div className='relative'>
                        <CustomDatePicker
                          id='from-datepicker'
                          placeholder={'mm/dd/yyyy'}
                          className={
                            'appearance-none block w-full rounded-md py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                          }
                          selected={dateFrom}
                          pickerOnChange={handleDateFromChange}
                          inputOnChange={handleDateFromChange}
                        />
                      </div>
                      <p className='text-gray-600'>to</p>
                      <div className='relative'>
                        <CustomDatePicker
                          id='to-datepicker'
                          placeholder={'mm/dd/yyyy'}
                          className={
                            'appearance-none block w-full rounded-md py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                          }
                          selected={dateTo}
                          pickerOnChange={handleDateToChange}
                          inputOnChange={handleDateToChange}
                          minDate={dateFrom}
                        />
                      </div>
                      {/* Search Button */}
                      <button
                        onClick={handleDateSearch}
                        disabled={isSearching || isFetchingApplicants}
                        className="rounded-lg bg-white hover:bg-gray-100 border-2 border-gray-300 disabled:bg-blue-400 disabled:cursor-not-allowed text-blue-700 py-1.5 px-3 flex items-center justify-center transition-colors"
                        title="Search by date range"
                      >
                        {isSearching || isFetchingApplicants ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <MagnifyingGlassIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Action Buttons - Right Side */}
                    <div className='flex items-center gap-4'>
                      <SmartButton
                        id="upload-resumes-btn"
                        onClick={handleOpenBatchUpload}
                        className={`rounded-lg bg-savoy-blue hover:bg-blue-700 text-white py-2 px-6 font-bold text-[16px] flex items-center gap-2 ${!hasActiveSubscription ? 'opacity-50 pointer-events-none' : ''}`}
                        disabled={!hasActiveSubscription}
                      >
                        <UploadIcon />
                        Upload Resumes
                      </SmartButton>

                      {/* <button
                        onClick={() => setIsAddApplicantModalOpen(true)}
                        className="rounded-lg bg-white hover:bg-gray-100 hover:border-[#4a9d5e] text-[#65C979] border-2 border-[#65C979] py-2 px-6 font-bold text-[16px] flex items-center gap-2 h-10 transition-colors"
                        title="Add Applicant"
                      >
                        <PlusIconGreen />
                      </button> */}

                      <div className='border-l-2 border-gray-300 h-10'></div>

                      <button
                        onClick={() => setIsArchivedApplicantsModalOpen(true)}
                        className="relative rounded-lg border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 py-1.5 px-2 flex items-center justify-center w-12 transition-colors"
                      >
                        <ArchiveIcon />
                        {recentArchivedCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                            {recentArchivedCount > 99 ? '99+' : recentArchivedCount}
                          </span>
                        )}
                      </button>

                      <Filter 
                        filterGroups={filterGroups}
                        defaultValues={filters}
                        resetValues={{ status: ['Ongoing', 'Hired'] }}
                        onFilterChange={handleFilterChange}
                        buttonId="use-filter-screen-applicants-btn"
                      />
                      
                      <AddStageBtn handleAddStage={handleAddStage} />
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className='md:hidden my-6'>
                  {/* Combined Date Range Filter and Action Buttons Row */}
                  <div className='flex flex-col gap-4'>
                    {/* Date Range Filter Row */}
                    <div className='flex justify-start items-center gap-2 flex-wrap'>
                      <div className='relative flex-1 min-w-[140px]'>
                        <CustomDatePicker
                          id='from-datepicker-mobile'
                          placeholder={'From Date'}
                          className='appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6'
                          selected={dateFrom}
                          pickerOnChange={(date: any) => {
                            setDateFrom(date);
                          }}
                          inputOnChange={(value: any) => {
                            setDateFrom(value);
                          }}
                        />
                      </div>
                      <p className='text-gray-600 text-sm'>to</p>
                      <div className='relative flex-1 min-w-[140px]'>
                        <CustomDatePicker
                          id='to-datepicker-mobile'
                          placeholder={'To Date'}
                          className='appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6'
                          selected={dateTo}
                          pickerOnChange={(date: any) => {
                            setDateTo(date);
                          }}
                          inputOnChange={(value: any) => {
                            setDateTo(value);
                          }}
                          minDate={dateFrom}
                        />
                      </div>
                      {/* Search Button - Mobile */}
                      <button
                        onClick={handleDateSearch}
                        disabled={isSearching || isFetchingApplicants}
                        className="rounded-lg bg-savoy-blue hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-1.5 px-3 flex items-center justify-center transition-colors"
                        title="Search by date range"
                      >
                        {isSearching || isFetchingApplicants ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <MagnifyingGlassIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Action Buttons Row */}
                    <div className='flex justify-end items-center gap-2'>
                      <SmartButton
                        id="upload-resumes-btn"
                        onClick={handleOpenBatchUpload}
                        className='rounded-lg bg-savoy-blue hover:bg-blue-700 text-white py-1.5 px-4 font-bold text-sm flex items-center gap-2'
                      >
                        <UploadIcon />
                        Upload
                      </SmartButton>

                      <Filter 
                        filterGroups={filterGroups}
                        defaultValues={filters}
                        onFilterChange={handleFilterChange}
                        buttonId="use-filter-screen-applicants-btn-mobile"
                      />

                      {/* Mobile Dropdown Menu */}
                      <Menu as="div" className="relative">
                        <Menu.Button className="rounded-lg bg-gray-600 hover:bg-gray-700 text-white py-1.5 px-2 flex items-center justify-center w-12">
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => setIsArchivedApplicantsModalOpen(true)}
                                    className={`${
                                      active ? 'bg-gray-50' : 'hover:bg-gray-50'
                                    } group flex items-center gap-3 w-full px-3 py-2 text-sm font-bold transition-colors`}
                                    style={{ color: '#6b7280' }}
                                  >
                                    <div className="relative">
                                      <ArchiveIcon />
                                      {recentArchivedCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                                          {recentArchivedCount > 99 ? '99+' : recentArchivedCount}
                                        </span>
                                      )}
                                    </div>
                                    Archived
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <SmartButton
                                    id="create-job-stage-btn"
                                    onClick={handleAddStage}
                                    className={`${
                                      active ? 'bg-green-50' : 'hover:bg-green-50'
                                    } group flex items-center gap-3 w-full px-4 py-2 text-sm font-bold transition-colors`}
                                  >
                                    <PlusIconGreen />
                                    <span className="ml-1">Add Stage</span>
                                  </SmartButton>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>

                <BatchResumeUpload
                  isOpen={isBatchUploadOpen}
                  onClose={handleCloseBatchUpload}
                  jobPostingId={parseInt(params.id as string)}
                  onSuccess={handleBatchUploadSuccess}
                />

                <DragAndDrop
                  containerRef={containerRef}
                  gridCols={gridCols}
                  jobPostDetailsRefetch={jobPostDetailsRefetch}
                  appliedApplicantRefetch={appliedApplicantRefetch}
                  filters={filters}
                />
              </div>
            </div>
          </div>
        </StateContext.Provider>
      )}
      <AddApplicantModal
        refetch={appliedApplicantRefetch}
        isOpen={isAddApplicantModalOpen}
        setIsOpen={setIsAddApplicantModalOpen}
        jobPostingId={params.id as string}
      />
      <ArchivedApplicantsModal
        isOpen={isArchivedApplicantsModalOpen}
        handleClose={() => setIsArchivedApplicantsModalOpen(false)}
        jobPostingId={params.id as string}
        archivedApplicants={dataArchivedApplicants}
        onUnarchive={() => {
          appliedApplicantRefetch();
          archivedApplicantRefetch();
          setIsArchivedApplicantsModalOpen(false);
        }}
        onRefresh={archivedApplicantRefetch}
      />
      <NavigationModal
        isOpen={isNavigationModalOpen}
        setIsOpen={setIsNavigationModalOpen}
        jobPostingId={params.id as string}
      />
    </>
  );
}