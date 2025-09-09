'use client';

import React, { useReducer, useRef, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import { useParams } from 'next/navigation';
import Link from 'next/link';

import { INITIAL_STATE, stageReducer } from '../reducers/stageReducer';
import { initialActionState } from '../lib/initialActionState';
import { ModalTypes, StageType } from '../types';
import actionTypes from '../lib/actionTypes';

import CustomToast from '@/components/CustomToast';
import AddApplicantModal from '../modals/AddApplicantModal';
import StageRequirements from '../modals/StageRequirements';
import Checklist from '../modals/Checklist';
import ScheduleInterview from '../modals/ScheduleInterview';
import SendEmail from '../modals/SendEmail';
import Confirmation from '../modals/Confirmation';
import Success from '../modals/Success';
import ApplicantForm from '../modals/ApplicantForm';
import ArchivedApplicantsModal from '../modals/ArchivedApplicantsModal';
import StateContext from '../contexts/StateContext';
import AddStageBtn from './AddStageBtn';
import Filter, { FilterOptions } from './Filter';
import DragAndDrop from './DragAndDrop';
import useGetAppliedApplicants from '../hooks/useGetAppliedApplicants';
import useGetJobPostDetails from '../hooks/useGetJobPostDetails';
import useUpdateStage from '../hooks/useUpdateStage';
import useSendEmail from '../hooks/useSendEmail';
import useUpdateStatus from '../hooks/useUpdateStatus';
import useSendInterviewSchedule from '../hooks/useSendInterviewSchedule';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import ArchiveIcon from '@/svg/ArchiveIcon';

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
  const {
    data: dataJobPostDetails,
    isLoading: isGetJobPostDetailsLoading,
    refetch: jobPostDetailsRefetch,
  } = useGetJobPostDetails(params.id);
  const { data: dataAppliedApplicants, refetch: appliedApplicantRefetch } = useGetAppliedApplicants(params.id, false);
  const { data: dataArchivedApplicants, refetch: archivedApplicantRefetch } = useGetAppliedApplicants(params.id, true);
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
  const [filters, setFilters] = useState<FilterOptions>({
    rating: ['Good Fit', 'Not Fit'],
    status: ['Ongoing', 'Passed'],
  });


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

      // Only check if mustHave questions match their ideal answers
      let isGoodFit = true;

      if (!answers.length) {
        // If no answers (empty due to previous data), treat as good fit
        isGoodFit = true;
      } else {
        // Process each answer and check if it matches the ideal answer for mustHave questions
        // Only check questions that should be shown to candidates
        answers.forEach((answer: { question: string; answer: string | string[] }) => {
          const question = screeningQuestions.find((q) => q.question === answer.question);
          if (question && question.mustHave && question.showToCandidates !== false) {
            const responseType = question.responseType || 'Yes / No';
            let isMatch = false;

            if (responseType === 'Text') {
              // For text questions, just check if they provided an answer
              isMatch = String(answer.answer).trim() !== '';
            } else if (responseType === 'Multiple Choice') {
              // For multiple choice, check if any of the applicant's answers match any ideal answers
              const idealAnswers = Array.isArray(question.idealAnswer) ? question.idealAnswer : [question.idealAnswer];
              const applicantAnswers = Array.isArray(answer.answer) ? answer.answer : [answer.answer];

              isMatch = Boolean(
                idealAnswers.some((ideal: any) =>
                  applicantAnswers.some((app: any) => app.toLowerCase() === ideal.toLowerCase())
                )
              );
            } else {
              // Default case: Yes/No or other types
              const idealAnswer = Array.isArray(question.idealAnswer) ? question.idealAnswer[0] : question.idealAnswer;
              const applicantAnswer = Array.isArray(answer.answer) ? answer.answer[0] : answer.answer;
              isMatch = applicantAnswer.toLowerCase() === idealAnswer.toLowerCase();
            }

            // If it's a must-have and doesn't match, applicant is not a good fit
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
    });
  };

  useEffect(() => {
    if (dataJobPostDetails) {
      dispatch({ type: CLEAR_STAGE });
      let jobStages: any = [];
      dataJobPostDetails.job_stages.forEach((item: any) => {
        let newData = {
          id: item.id,
          title: item.title,
          isNewStage: false,
          requirements: item.stage_requirements,
          applicants: [],
          orderBy: item.order_by,
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
          image: `${item.applicant.photo}`,
          name: item.applicant.name,
          checklists: [],
          status: item.status,
          stagePosition: item.job_stages,
          stage_notes: item.stage_notes || [],
          screeningFit: item.screeningFit,
          screeningAnswers: item.screeningAnswers || [],
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
            toast.custom(() => <CustomToast message='Successfully updated the checklist.' type='success' />, {
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
        />
      ),
      dispatch: {
        type: CHECKLIST,
        payload: { actionState, setActionState },
      },
    },
    SEND_EMAIL: {
      component: <SendEmail title={title} handleFormSubmit={handleFormSubmit} />,
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
    SUCCESS: {
      component: <Success title={title} />,
    },
    CONFIRMATION: {
      component: <Confirmation onStageDeleted={() => {
        jobPostDetailsRefetch();
        appliedApplicantRefetch();
        archivedApplicantRefetch();
      }} />,
    },
    APPLICANT_FORM: {
      component: <ApplicantForm title={title} />,
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

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <>
      {!isGetJobPostDetailsLoading && (
        <StateContext.Provider value={{ state, dispatch, actionState, setActionState }}>
          <div className='min-h-screen'>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-smooth`}>
              <div className='flex px-4 pt-4 pb-2'>
                <Link href='/screen-applicants' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
                  <ArrowLeftIcon className='h-5 w-5' />
                  <h4>Screen Applicants</h4>
                </Link>
              </div>
              <div className='p-2 md:px-8 lg:px-4'>
                <h2 className='text-xl font-bold text-indigo-dye'>
                  Screen Applicants / {dataJobPostDetails?.job_title || ''} Applications
                </h2>
                {whichModal && modals[whichModal].component}

                <div className='flex justify-end items-center gap-4 my-6'>
                  <div className='flex-1 flex justify-start lg:justify-between gap-2'>
                    <button
                      onClick={() => setIsAddApplicantModalOpen(true)}
                      className='rounded-lg bg-[#65c979] hover:bg-[#5cb86f] text-white py-2 px-6 font-bold text-[15px] my-6'
                    >
                      ADD APPLICANT
                    </button>
                    
                    <AddStageBtn handleAddStage={handleAddStage} />
                  </div>
                  <button
                    onClick={() => {
                      setIsArchivedApplicantsModalOpen(true);
                    }}
                    className="rounded-lg py-2 px-6 font-bold text-[15px] my-6 flex items-center gap-2 transition-colors bg-gray-600 hover:bg-gray-700 text-white"
                    >
                    <ArchiveIcon />
                      ARCHIVED
                    </button>
                  <Filter onFilterChange={handleFilterChange} />
                </div>

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
      />
    </>
  );
}