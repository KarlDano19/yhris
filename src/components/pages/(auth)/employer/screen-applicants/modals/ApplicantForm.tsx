import { useEffect, useState, useContext, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import classNames from '@/helpers/classNames';
import useGetApplicantDetails from '../hooks/useGetApplicantDetails';
import useGenerateApplicantSummary from '../hooks/useGenerateApplicantSummary';
import StateContext from '../contexts/StateContext';

import { EnvelopeIcon, PhoneIcon, MapPinIcon, StarIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { initialActionState } from '../lib/initialActionState';
import { ApplicantType, ContextTypes } from '../types';

type PropTypes = {
  title: string;
};
export default function ApplicantForm({ title }: PropTypes) {
  const cancelButtonRef = useRef(null);
  const [currentTab, setCurrentTab] = useState<Number>(1);
  const [viewCV, setViewCV] = useState<boolean>(false);
  const [applicantProfile, setApplicantProfile] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { state, actionState, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { mutate: generateSummary, isLoading: isGeneratingMutation } = useGenerateApplicantSummary();
  let applicant: ApplicantType | undefined;
  state.forEach((stage) => {
    if (stage.id === actionState.stageId) {
      applicant = stage.applicants.find((applicant) => applicant.id === actionState.applicantId);
    }
  });
  const { data, isLoading, error, isError } = useGetApplicantDetails(applicant?.applicationId);

  useEffect(() => {
    if (data && !isLoading) {
      setApplicantProfile(data);
      setIsOpen(true);
    } else if (error && isError) {
      toast.custom(() => <CustomToast message={error as string} type='error' />, {
        duration: 7000,
      });
    }
  }, [data, error]);

  const handleClose = () => {
    setViewCV(false);
    setIsOpen(false);
    setTimeout(() => setActionState(initialActionState), 400);
  };

  const handleGenerateSummary = () => {
    if (!applicantProfile?.id) {
      toast.custom(() => <CustomToast message="Unable to identify applicant" type="error" />, {
        duration: 4000,
      });
      return;
    }

    setIsGeneratingSummary(true);

    generateSummary({ 
      applicantId: applicantProfile.id, 
      options: { force_regenerate: true } 
    }, {
      onSuccess: (response) => {
        setIsGeneratingSummary(false);
        
        // Update the applicant profile with the new summary
        setApplicantProfile((prev: any) => ({
          ...prev,
          resume_summary: response.summary
        }));

        const message = response.was_cached 
          ? 'Resume summary already exists!' 
          : 'Resume summary generated successfully with Claude AI!';
          
        toast.custom(() => <CustomToast message={message} type="success" />, {
          duration: 4000,
        });
      },
      onError: (error: any) => {
        setIsGeneratingSummary(false);
        
        const errorMessage = error?.message || 'Failed to generate summary. Please try again.';
        toast.custom(() => <CustomToast message={errorMessage} type="error" />, {
          duration: 6000,
        });
      }
    });
  };

  const renderProfileTab = () => {
    return (
      <>
        <div className='flex mt-8'>
          <div className='mr-8'>
            <div
              className='bg-gray-300 h-48 w-36 rounded-md mx-auto lg:mx-0 flex items-center justify-center'
              style={{
                backgroundImage: `url(${applicantProfile.photo_url})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
          </div>
          <div className=''>
            <p className='text-[1.5rem]'>{applicantProfile.name}</p>
            <div className='my-3 flex'>
              <EnvelopeIcon className='h-6 w-6 text-blue-700 mr-3' />
              <span className='text-[1rem]'>{applicantProfile.email}</span>
            </div>
            <div className='my-3 flex'>
              <PhoneIcon className='h-6 w-6 text-blue-700 mr-3' />
              <span className='text-[1rem]'>{applicantProfile.mobile}</span>
            </div>
            <div className='my-3 flex'>
              <MapPinIcon className='h-6 w-6 text-blue-700 mr-3' />
              <span className='text-[1rem]'>{applicantProfile.address}</span>
            </div>
          </div>
        </div>
        {applicant?.stage_notes && applicant.stage_notes.length > 0 && (
          <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
            <h4 className='font-semibold text-gray-700 mb-3'>Stage Notes</h4>
            <div className='max-h-80 overflow-y-auto space-y-4 pr-2'>
              {applicant.stage_notes.map((stageNote, index) => (
                <div key={index} className='border-l-4 border-blue-400 pl-4'>
                  <div className='mb-2'>
                    <h5 className='font-medium text-gray-800'>{applicant?.job_stages_title || 'Current Stage'}</h5>
                  </div>
                  <p className='text-gray-600 text-sm whitespace-pre-wrap'>{stageNote.notes}</p>
                  
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='mt-4'>
          <button
            type='button'
            className='px-4 py-2 rounded-md text-[#355FD0] border-[1px] border-[#355FD0] disabled:opacity-50'
            onClick={() => setViewCV(true)}
            disabled={!!!applicantProfile.cv_url}
            title={!!!applicantProfile.cv_url ? 'No CV/Resume Attached' : ''}
          >
            {!!!applicantProfile.cv_url ? 'No CV/Resume Attached' : 'View Attached CV/Resume'}
          </button>
        </div>
      </>
    );
  };

  const renderJobExpTab = () => {
    return (
      <>
        {applicantProfile.work_experience.map((exp: any) => {
          return (
            <div key={exp.id} className='flex mt-8 overflow-y-auto'>
              <div className='mr-3'>
                <StarIcon className='h-6 w-6 text-blue-700' />
              </div>
              <div>
                <p className='font-semibold'>{exp.position}</p>
                <p>
                  {new Date(exp.dateFrom).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} -{' '}
                  {exp.dateTo ? new Date(exp.dateTo).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}
                </p>
                <p>{exp.companyOrg}</p>
                <p className='font-semibold mt-4'>Description/Responsibilities:</p>
                <div className='pl-2' dangerouslySetInnerHTML={{ __html: exp.responsibilities }} />
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const renderAnswersTab = () => {
    return (
      <>
        {applicantProfile.screening_answers && applicantProfile.screening_answers !== null && applicantProfile.screening_answers.length > 0 ? (
          <div className='mt-6 space-y-6'>
            {applicantProfile.screening_answers.map((item: any, index: number) => (
              <div key={index} className='bg-white p-4 rounded-md shadow-sm border border-gray-200'>
                <div className='flex items-start'>
                  <div className='mr-3'>
                    <QuestionMarkCircleIcon className='h-6 w-6 text-blue-700' />
                  </div>
                  <div>
                    <p className='font-semibold'>{item.question}</p>
                    <p className='mt-2 text-gray-700'>{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='mt-8 text-center'>
            <p className='text-gray-500'>No screening questions were answered by this applicant.</p>
          </div>
        )}
      </>
    );
  };

  const renderSummaryTab = () => {
    const hasSummary = applicantProfile.resume_summary && applicantProfile.resume_summary.trim() !== '';
    
    return (
      <>
        {hasSummary ? (
          <div className='mt-6'>
            <div className='bg-blue-50 rounded-lg p-6 border border-blue-200'>
              <div className='flex items-start'>
                <div className='mr-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className='flex-1'>
                  <h4 className='font-semibold text-blue-900 mb-3 flex items-center justify-between'>
                    <span className='flex items-center'>
                      AI-Generated Resume Summary
                    </span>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary || isGeneratingMutation}
                      className='ml-4 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      title="Regenerate summary with Claude AI"
                    >
                      {isGeneratingSummary || isGeneratingMutation ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          Updating...
                        </div>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Regenerate
                        </>
                      )}
                    </button>
                  </h4>
                  <div className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                    {applicantProfile.resume_summary}
                  </div>
                  
                  {/* Optional: Show last updated timestamp if available */}
                  {applicantProfile.summary_updated_at && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-blue-600">
                        Last updated: {new Date(applicantProfile.summary_updated_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='mt-8 text-center'>
            <div className='bg-gray-50 rounded-lg p-8 border border-gray-200'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 className='text-gray-600 font-medium mb-4'>No Resume Summary Available</h4>
              <p className='text-gray-500 text-sm mb-6'>
                Generate an AI-powered summary from the uploaded resume using Claude AI to quickly understand this candidate&apos;s background and qualifications.
              </p>
              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary || isGeneratingMutation}
                className='inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isGeneratingSummary || isGeneratingMutation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Summary with Claude AI
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderResumeView = () => {
    return (
      <>
        <iframe className='w-full h-[43rem]' src={`${applicantProfile.cv_url}#toolbar=0`}></iframe>
      </>
    );
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-30' initialFocus={cancelButtonRef} onClose={handleClose}>
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
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel
                className={classNames(
                  'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full',
                  viewCV ? 'max-w-4xl' : 'max-w-xl'
                )}
              >
                <div className='flex bg-savoy-blue p-2 items-center gap-4'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>{title}</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer self-start' onClick={handleClose} />
                </div>
                <div className={classNames('m-7', viewCV ? 'h-[43rem]' : 'h-auto')}>
                  {!viewCV && (
                    <div className='w-full grid grid-cols-4'>
                      <div className='mr-2'>
                        <button
                          className={classNames(
                            'px-4 py-2 font-bold rounded-md w-full',
                            currentTab == 1 ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                          )}
                          onClick={() => setCurrentTab(1)}
                        >
                          Profile
                        </button>
                      </div>
                      <div className='mx-2'>
                        <button
                          className={classNames(
                            'px-4 py-2 font-bold rounded-md w-full',
                            currentTab == 2 ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                          )}
                          onClick={() => setCurrentTab(2)}
                        >
                          Job Experience
                        </button>
                      </div>
                      <div className='mx-2'>
                        <button
                          className={classNames(
                            'px-4 py-2 font-bold rounded-md w-full',
                            currentTab == 3 ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                          )}
                          onClick={() => setCurrentTab(3)}
                        >
                          Summary
                        </button>
                      </div>
                      <div className='ml-2'>
                        <button
                          className={classNames(
                            'px-4 py-2 font-bold rounded-md w-full',
                            currentTab == 4 ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                          )}
                          onClick={() => setCurrentTab(4)}
                        >
                          Answers
                        </button>
                      </div>
                    </div>
                  )}
                  {!viewCV && currentTab == 1 && renderProfileTab()}
                  {!viewCV && currentTab == 2 && (
                    <div className='h-[28rem] overflow-y-auto'>{renderJobExpTab()}</div>
                  )}
                  {!viewCV && currentTab == 3 && (
                    <div className='h-[28rem] overflow-y-auto'>{renderSummaryTab()}</div>
                  )}
                  {!viewCV && currentTab == 4 && (
                    <div className='h-[28rem] overflow-y-auto'>{renderAnswersTab()}</div>
                  )}
                  {viewCV && renderResumeView()}
                </div>
                {!viewCV && (
                  <div className='flex items-center gap-4 text-[15px] font-bold justify-end flex-wrap p-4 border-t-[1px] border-[#355FD0]'>
                    <button
                      onClick={handleClose}
                      type='button'
                      className='border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]'
                    >
                      Close
                    </button>
                  </div>
                )}
                {viewCV && (
                  <div className='flex items-center gap-4 text-[15px] font-bold justify-start flex-wrap p-4 border-t-[1px] border-[#355FD0]'>
                    <button
                      onClick={() => setViewCV(false)}
                      type='button'
                      className='border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]'
                    >
                      Go Back to Applicant Information
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
