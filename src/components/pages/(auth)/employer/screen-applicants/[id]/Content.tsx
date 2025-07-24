'use client';

import React, { useReducer, useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { useParams } from 'next/navigation';
import Link from 'next/link';

import { INITIAL_STATE, stageReducer } from '../reducers/stageReducer';
import { initialActionState } from '../lib/initialActionState';
import { ModalTypes, StageType, ApplicantType } from '../types';
import actionTypes from '../lib/actionTypes';

import CustomToast from '@/components/CustomToast';
import StageRequirements from '../modals/StageRequirements';
import Checklist from '../modals/Checklist';
import ScheduleInterview from '../modals/ScheduleInterview';
import SendEmail from '../modals/SendEmail';
import Confirmation from '../modals/Confirmation';
import Success from '../modals/Success';
import ApplicantForm from '../modals/ApplicantForm';
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
import useGetApplicantDetails from '../hooks/useGetApplicantDetails';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import '../styles.css';

type ModalSelectedTypes = {
  component: React.ReactNode;
  dispatch?: {
    type: string;
    payload?: any;
  };
};

export default function Content() {
  const params = useParams();
  const { mutate: updateMutate } = useUpdateStage();
  const { mutate: updateStatusMutate } = useUpdateStatus();
  const { mutate: sendInterviewScheduleMutate, isLoading: isSendInterviewScheduleLoading } = useSendInterviewSchedule();
  const {
    data: dataJobPostDetails,
    isLoading: isGetJobPostDetailsLoading,
    refetch: jobPostDetailsRefetch,
  } = useGetJobPostDetails(params.id);
  const { data: dataAppliedApplicants, refetch: appliedApplicantRefetch } = useGetAppliedApplicants(params.id);
  const {
    CLEAR_STAGE,
    STAGE_REQUIREMENTS,
    CHECKLIST,
    SEND_EMAIL,
    SCHEDULE_INTERVIEW,
    ADD_STAGE,
    SET_ONBOARDING,
    SET_APPLICANT,
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
  const [filters, setFilters] = useState<FilterOptions>({
    rating: ['Good Fit', 'Not Fit'],
    status: ['Ongoing', 'Passed'],
  });
  
  // Get screening questions and ideal answers from the job posting
  const [screeningQuestions, setScreeningQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (dataJobPostDetails?.screening_questions) {
      setScreeningQuestions(dataJobPostDetails.screening_questions || []);
    }
  }, [dataJobPostDetails]);

  // Process applicants and evaluate their screening answers
  const processApplicants = (applicants: any[]) => {
    if (!screeningQuestions.length || !applicants?.length) return applicants;
    
    return applicants.map(applicant => {
      // Check if the applicant has already been processed
      if (applicant?.screeningFit) return applicant;
      
      // Get the applicant's screening answers
      const answers = applicant.applicant?.screening_answers || [];
      if (!answers.length) {
        // If no answers, treat as not a good fit by default
        return { ...applicant, screeningFit: 'bad' };
      }
      
      // Only check if mustHave questions match their ideal answers
      let isGoodFit = true;
      
      // Process each answer and check if it matches the ideal answer for mustHave questions
      answers.forEach((answer: { question: string; answer: string }) => {
        const question = screeningQuestions.find(q => q.question === answer.question);
        if (question && question.mustHave) {
          const isMatch = answer.answer.toLowerCase() === question.idealAnswer.toLowerCase();
          
          // If it's a must-have and doesn't match, applicant is not a good fit
          if (!isMatch) {
            isGoodFit = false;
          }
        }
      });
      
      // Check if any mustHave questions were not answered
      screeningQuestions.forEach(question => {
        if (question.mustHave) {
          const wasAnswered = answers.some(
            (answer: { question: string }) => answer.question === question.question
          );
          
          if (!wasAnswered) {
            isGoodFit = false;
          }
        }
      });
      
      return { 
        ...applicant, 
        screeningFit: isGoodFit ? 'good' : 'bad',
        screeningAnswers: answers
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
      const processedApplicants = processApplicants(dataAppliedApplicants);
      
      processedApplicants.forEach((item: any) => {
        let newData = {
          id: item.applicant.id,
          email: item.applicant.email,
          applicationId: item.id,
          image: `${item.applicant.photo}`,
          name: item.applicant.name,
          checklists: [],
          status: item.status,
          stagePosition: item.job_stages,
          screeningFit: item.screeningFit,
          screeningAnswers: item.screeningAnswers || []
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
            toast.custom(() => <CustomToast message="Successfully set-up stage requirements." type="success" />, { duration: 4000 });
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
            toast.custom(() => <CustomToast message="Successfully updated the checklist." type="success" />, { duration: 4000 });
            jobPostDetailsRefetch();
            appliedApplicantRefetch();
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
      component: <Checklist title={title} requirements={requirements} handleFormSubmit={handleFormSubmit} />,
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
      component: <Confirmation />,
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
                <h2 className='text-xl font-bold text-indigo-dye'>Screen Applicants / {dataJobPostDetails?.job_title || ''} Applications</h2>
                {whichModal && modals[whichModal].component}

                <div className='flex justify-end items-center gap-4 my-6'>
                  <Filter onFilterChange={handleFilterChange} />
                  <AddStageBtn handleAddStage={handleAddStage} />
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
    </>
  );
}
