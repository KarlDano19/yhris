import { useEffect, useState, useContext, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import EAFModal from './EAFModal';
import classNames from '@/helpers/classNames';
import { formatDateToLocal, formatDateTimeSeparate } from '@/helpers/date';
import useGetApplicantDetails from '../../hooks/applicant/useGetApplicantDetails';
import useGenerateApplicantSummary from '../../hooks/applicant/useGenerateApplicantSummary';
import useDownloadScreeningAnswersPDF from '../../hooks/applicant/useDownloadScreeningAnswersPDF';
import useUpdateApplicantContactInfo from '../../hooks/applicant/useUpdateApplicantContactInfo';
import useGetEAF from '../../hooks/eaf/useGetEAF';
import StateContext from '../../contexts/StateContext';

import { EnvelopeIcon, PhoneIcon, MapPinIcon, StarIcon, QuestionMarkCircleIcon, CalendarIcon, CheckCircleIcon, ArrowRightIcon, DocumentTextIcon, PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { initialActionState } from '../../lib/initialActionState';
import { ApplicantType, ContextTypes } from '../../types';
import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';

type PropTypes = {
  title: string;
  JobTitle?: string;
  screeningQuestions?: any[];
  jobPostingDetails?: any;
};
export default function ApplicantForm({ title, JobTitle, screeningQuestions = [], jobPostingDetails }: PropTypes) {
  const cancelButtonRef = useRef(null);
  const [currentTab, setCurrentTab] = useState<Number>(1);
  const [viewCV, setViewCV] = useState<boolean>(false);
  const [showDocxDownloadModal, setShowDocxDownloadModal] = useState<boolean>(false);
  const [showEAFModal, setShowEAFModal] = useState(false);
  const [applicantProfile, setApplicantProfile] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { state, actionState, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { mutate: generateSummary, isLoading: isGeneratingMutation } = useGenerateApplicantSummary();
  const { mutate: downloadPDF, isLoading: isDownloadingPDF } = useDownloadScreeningAnswersPDF();
  const { mutate: updateContactInfo, isLoading: isUpdatingContact } = useUpdateApplicantContactInfo();
  const [editingContactField, setEditingContactField] = useState<'email' | 'mobile' | 'address' | null>(null);
  const [contactInputValue, setContactInputValue] = useState('');
  let applicant: ApplicantType | undefined;
  state.forEach((stage) => {
    if (stage.id === actionState.stageId) {
      applicant = stage.applicants.find((applicant) => applicant.id === actionState.applicantId);
    }
  });
  const { data, isLoading, error, isError } = useGetApplicantDetails(applicant?.applicationId);
  const isHired = applicant?.status === 'hired';
  const { data: eafData, isError: eafNotFound } = useGetEAF(applicant?.applicationId as number, isHired);

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
    setShowDocxDownloadModal(false);
    setIsOpen(false);
    setTimeout(() => setActionState(initialActionState), 400);
  };

  const handleGenerateSummary = () => {
    // Use the applicant.id from the state, which is the correct applicant_form_id
    if (!applicant?.id) {
      toast.custom(() => <CustomToast message='Unable to identify applicant' type='error' />, {
        duration: 4000,
      });
      return;
    }

    setIsGeneratingSummary(true);

    generateSummary(
      {
        applicantId: applicant.id, // Use applicant.id (applicant_form_id) instead of applicantProfile.id
        options: { force_regenerate: true },
      },
      {
        onSuccess: (response) => {
          setIsGeneratingSummary(false);

          // Update the applicant profile with the new summary
          setApplicantProfile((prev: any) => ({
            ...prev,
            resume_summary: response.summary,
          }));

          const message = response.was_cached
            ? 'Resume summary already exists!'
            : 'Resume summary generated successfully with Claude AI!';

          toast.custom(() => <CustomToast message={message} type='success' />, {
            duration: 4000,
          });
        },
        onError: (error: any) => {
          setIsGeneratingSummary(false);

          const errorMessage = error?.message || 'Failed to generate summary. Please try again.';
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, {
            duration: 6000,
          });
        },
      }
    );
  };

  const handleDownloadPDF = () => {
    if (!applicant?.applicationId) {
      toast.custom(() => <CustomToast message='Unable to identify application' type='error' />, {
        duration: 4000,
      });
      return;
    }

    downloadPDF({
      appliedJobId: applicant.applicationId,
      jobTitle: JobTitle,
      applicantName: applicant.name || 'Unknown'
    });
  };
  
  const ApplicantAvatar = ({ applicant, size = 40 }: { applicant: any; size?: number }) => {
    const [imageError, setImageError] = useState(false);

    const hasValidImage = applicant.photo_url && applicant.photo_url.trim() !== '' && !imageError;

    if (!hasValidImage) {
      return (
        <PlaceholderAvatar
          width={size}
          height={size}
          firstName={applicant.name?.split(' ')[0] || ''}
          lastName={applicant.name?.split(' ')[1] || ''}
          className='flex-shrink-0'
        />
      );
    }

    return (
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
    );
  };

  const isCvDocx = () => {
    if (!applicantProfile.cv_url) return false;
    const url = applicantProfile.cv_url.toLowerCase();
    return url.includes('.docx') || url.includes('.doc');
  };

  const handleContactSave = (field: 'email' | 'mobile' | 'address') => {
    if (!contactInputValue.trim() || !applicant?.applicationId) return;
    updateContactInfo(
      { appliedJobId: applicant.applicationId, [field]: contactInputValue.trim() },
      {
        onSuccess: () => {
          setApplicantProfile((prev: any) => ({ ...prev, [field]: contactInputValue.trim() }));
          setEditingContactField(null);
          setContactInputValue('');
          toast.custom(<CustomToast type='success' message='Contact info updated.' />);
        },
        onError: (err: any) => {
          toast.custom(<CustomToast type='error' message={err?.message || 'Failed to update.'} />);
        },
      }
    );
  };

  const renderProfileTab = () => {
    return (
      <>
        <div className='flex flex-col md:flex-row mt-8'>
          <div className='mr-0 md:mr-8 mb-4 md:mb-0 flex justify-center md:justify-start'>
            <ApplicantAvatar applicant={applicantProfile} size={200} /> {/* Applicant Avatar */}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-[1.5rem] text-center md:text-left'>{applicantProfile.name}</p>
            <div className='my-3 flex items-center justify-between'>
              <div className='flex items-start flex-1 min-w-0'>
                <EnvelopeIcon className='h-6 w-6 text-blue-700 mr-3 flex-shrink-0 mt-0.5' />
                {editingContactField === 'email' ? (
                  <div className='flex items-center gap-2 flex-1'>
                    <input
                      type='email'
                      className='border border-gray-300 rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500'
                      placeholder='Enter email'
                      value={contactInputValue}
                      onChange={(e) => setContactInputValue(e.target.value)}
                      autoFocus
                    />
                    <button
                      className='text-sm text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded disabled:opacity-50'
                      onClick={() => handleContactSave('email')}
                      disabled={isUpdatingContact}
                    >Save</button>
                    <button
                      className='text-sm text-gray-500 hover:text-gray-700'
                      onClick={() => { setEditingContactField(null); setContactInputValue(''); }}
                    >Cancel</button>
                  </div>
                ) : applicantProfile.email ? (
                  <>
                    <span
                      className='text-[1rem] max-w-full md:max-w-48 overflow-hidden text-ellipsis whitespace-nowrap cursor-help'
                      title={applicantProfile.email}
                    >
                      {applicantProfile.email}
                    </span>
                    <button
                      className='ml-2 text-gray-400 hover:text-blue-600 flex-shrink-0'
                      onClick={() => { setEditingContactField('email'); setContactInputValue(applicantProfile.email); }}
                    >
                      <PencilIcon className='h-4 w-4' />
                    </button>
                  </>
                ) : (
                  <button
                    className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'
                    onClick={() => { setEditingContactField('email'); setContactInputValue(''); }}
                  >
                    <PlusIcon className='h-4 w-4' /> Add email
                  </button>
                )}
              </div>
            </div>
            <div className='my-3 flex items-center justify-between'>
              <div className='flex items-start flex-1 min-w-0'>
                <PhoneIcon className='h-6 w-6 text-blue-700 mr-3 flex-shrink-0 mt-0.5' />
                {editingContactField === 'mobile' ? (
                  <div className='flex items-center gap-2 flex-1'>
                    <input
                      type='text'
                      className='border border-gray-300 rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500'
                      placeholder='Enter mobile number'
                      value={contactInputValue}
                      onChange={(e) => setContactInputValue(e.target.value)}
                      autoFocus
                    />
                    <button
                      className='text-sm text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded disabled:opacity-50'
                      onClick={() => handleContactSave('mobile')}
                      disabled={isUpdatingContact}
                    >Save</button>
                    <button
                      className='text-sm text-gray-500 hover:text-gray-700'
                      onClick={() => { setEditingContactField(null); setContactInputValue(''); }}
                    >Cancel</button>
                  </div>
                ) : applicantProfile.mobile ? (
                  <>
                    <span className='text-[1rem] break-all overflow-hidden'>{applicantProfile.mobile}</span>
                    <button
                      className='ml-2 text-gray-400 hover:text-blue-600 flex-shrink-0'
                      onClick={() => { setEditingContactField('mobile'); setContactInputValue(applicantProfile.mobile); }}
                    >
                      <PencilIcon className='h-4 w-4' />
                    </button>
                  </>
                ) : (
                  <button
                    className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'
                    onClick={() => { setEditingContactField('mobile'); setContactInputValue(''); }}
                  >
                    <PlusIcon className='h-4 w-4' /> Add mobile
                  </button>
                )}
              </div>
            </div>
            <div className='my-3 flex items-center justify-between'>
              <div className='flex items-start flex-1 min-w-0'>
                <MapPinIcon className='h-6 w-6 text-blue-700 mr-3 flex-shrink-0 mt-0.5' />
                {editingContactField === 'address' ? (
                  <div className='flex items-center gap-2 flex-1'>
                    <input
                      type='text'
                      className='border border-gray-300 rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500'
                      placeholder='Enter address'
                      value={contactInputValue}
                      onChange={(e) => setContactInputValue(e.target.value)}
                      autoFocus
                    />
                    <button
                      className='text-sm text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded disabled:opacity-50'
                      onClick={() => handleContactSave('address')}
                      disabled={isUpdatingContact}
                    >Save</button>
                    <button
                      className='text-sm text-gray-500 hover:text-gray-700'
                      onClick={() => { setEditingContactField(null); setContactInputValue(''); }}
                    >Cancel</button>
                  </div>
                ) : applicantProfile.address ? (
                  <>
                    <span
                      className='text-[1rem] max-w-full md:max-w-48 overflow-hidden text-ellipsis whitespace-nowrap cursor-help'
                      title={applicantProfile.address}
                    >
                      {applicantProfile.address}
                    </span>
                    <button
                      className='ml-2 text-gray-400 hover:text-blue-600 flex-shrink-0'
                      onClick={() => { setEditingContactField('address'); setContactInputValue(applicantProfile.address); }}
                    >
                      <PencilIcon className='h-4 w-4' />
                    </button>
                  </>
                ) : (
                  <button
                    className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'
                    onClick={() => { setEditingContactField('address'); setContactInputValue(''); }}
                  >
                    <PlusIcon className='h-4 w-4' /> Add location
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='mt-6'>
          <h4 className='text-xl font-semibold text-indigo-dye mb-4'>Application Timeline</h4>
          <div className='max-h-80 overflow-y-auto space-y-4 pr-2'>
            {/* Always show "Applied on" entry first */}
            <div className='relative bg-white border-l-4 border-blue-500 pl-6 pr-4 py-4 rounded-r-lg shadow-sm hover:shadow-md transition-shadow'>
              <div className='flex items-start'>
                <div className='flex-shrink-0 text-blue-600 mr-3 mt-1'>
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between mb-1'>
                    <h5 className='font-semibold text-gray-900 text-base flex-1'>Date Applied:</h5>
                    {applicant?.created_at && (
                      <span className='text-sm text-gray-500 ml-4 flex-shrink-0'>
                        {formatDateToLocal(applicant.created_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Then show all stage notes */}
            {applicant?.stage_notes && applicant.stage_notes.length > 0 && applicant.stage_notes.map((stageNote, index) => {
              const isLastStage = index === (applicant?.stage_notes?.length || 0) - 1;
              const isHired = applicant?.status === 'hired';
              
              // Define colors and icons for different stages
              let borderColor = 'border-purple-500';
              let iconColor = 'text-purple-600';
              let iconComponent = <ArrowRightIcon className="w-5 h-5" />;
              let stageTitle = `Passed: ${stageNote.stage_title || 'Next Stage'}`;
              
              if (isLastStage && isHired) {
                borderColor = 'border-green-500';
                iconColor = 'text-green-600';
                iconComponent = <CheckCircleIcon className="w-5 h-5" />;
                stageTitle = 'Hired';
              }
              
              return (
                <div key={index} className={`relative bg-white border-l-4 ${borderColor} pl-6 pr-4 py-4 rounded-r-lg shadow-sm hover:shadow-md transition-shadow`}>
                  <div className='flex items-start'>
                    <div className={`flex-shrink-0 ${iconColor} mr-3 mt-1`}>
                      {iconComponent}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between mb-1'>
                        <h5 className='font-semibold text-gray-900 text-base flex-1'>{stageTitle}</h5>
                        {stageNote.created_at && (
                          <span className='text-sm text-gray-500 ml-4 flex-shrink-0'>
                            {formatDateToLocal(stageNote.created_at)}
                          </span>
                        )}
                      </div>
                      {stageNote.notes && (
                        <div className='mt-2 p-3 bg-gray-50 rounded-md mr-0'>
                          <p className='text-sm text-gray-700 whitespace-pre-wrap'><span className='font-semibold'>Stage Notes:</span> {stageNote.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className='mt-4'>
          <button
            type='button'
            className='px-4 py-2 rounded-md text-[#355FD0] border-[1px] border-[#355FD0] disabled:opacity-50'
            onClick={() => {
              if (isCvDocx()) {
                setShowDocxDownloadModal(true);
              } else {
                setViewCV(true);
              }
            }}
            disabled={!applicantProfile.cv_url}
            title={!applicantProfile.cv_url ? 'No CV/Resume Attached' : ''}
          >
            {!applicantProfile.cv_url ? 'No CV/Resume Attached' : 'View Attached CV/Resume'}
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
                  {exp.dateTo
                    ? new Date(exp.dateTo).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : 'Present'}
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
        {applicantProfile.screening_answers &&
        applicantProfile.screening_answers !== null &&
        applicantProfile.screening_answers.length > 0 ? (
          <div className='mt-6 space-y-6'>
            {applicantProfile.screening_answers.map((item: any, index: number) => {
              // Find the corresponding screening question to check if it's must-have
              const screeningQuestion = screeningQuestions.find((q: any) => q.question === item.question);
              const isMustHave = screeningQuestion?.mustHave === true;
              
              return (
                <div key={index} className='bg-white p-4 rounded-md shadow-sm border border-gray-200'>
                  <div className='flex items-start'>
                    <div className='mr-3'>
                      <QuestionMarkCircleIcon className='h-6 w-6 text-blue-700' />
                    </div>
                    <div className='flex-1'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                        <p className='font-semibold flex-1'>{item.question}</p>
                        {isMustHave && (
                          <span className='bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap self-start sm:self-center'>
                            Must-Have
                          </span>
                        )}
                      </div>
                      <p className='mt-2 text-gray-700'>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='mt-8 text-center'>
            <p className='text-gray-500'>No screening questions were answered by this applicant.</p>
          </div>
        )}
        <div className='mt-4'>
          <button
            type='button'
            className='px-4 py-2 rounded-md text-[#355FD0] border-[1px] border-[#355FD0] disabled:opacity-50 disabled:cursor-not-allowed mr-3'
            onClick={handleDownloadPDF}
            disabled={applicantProfile.screening_answers.length === 0 || isDownloadingPDF}
            title={applicantProfile.screening_answers.length === 0 ? 'No Screening Answers' : ''}
          >
            {isDownloadingPDF ? (
              <div className='flex items-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-[#355FD0] mr-2'></div>
                Downloading PDF...
              </div>
            ) : applicantProfile.screening_answers.length === 0 ? (
              'No Screening Answers'
            ) : (
              'Download Screening Answers as PDF'
            )}
          </button>
        </div>
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
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-blue-700 mt-1'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <h4 className='font-semibold text-blue-900 mb-3 flex items-center justify-between'>
                    <span className='flex items-center'>AI-Generated Resume Summary</span>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary || isGeneratingMutation}
                      className='ml-4 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      title='Regenerate summary with Claude AI'
                    >
                      {isGeneratingSummary || isGeneratingMutation ? (
                        <div className='flex items-center'>
                          <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1'></div>
                          Updating...
                        </div>
                      ) : (
                        <>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-3 w-3 mr-1 inline'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                            />
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
                    <div className='mt-3 pt-3 border-t border-blue-200'>
                      <p className='text-xs text-blue-600'>
                        Last updated: {formatDateTimeSeparate(applicantProfile.summary_updated_at).formattedDate} {formatDateTimeSeparate(applicantProfile.summary_updated_at).formattedTime}
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
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-12 w-12 text-gray-400 mx-auto mb-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              <h4 className='text-gray-600 font-medium mb-4'>No Resume Summary Available</h4>
              {applicantProfile.cv_url ? (
                <p className='text-gray-500 text-sm mb-6'>
                  Generate an AI-powered summary from the uploaded resume to quickly understand this candidate&apos;s
                  background and qualifications.
                </p>
              ) : (
                <p className='text-gray-500 text-sm mb-6'>No resume uploaded for this candidate.</p>
              )}
              {applicantProfile.cv_url && (
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary || isGeneratingMutation}
                  className='inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  {isGeneratingSummary || isGeneratingMutation ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 mr-2'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 10V3L4 14h7v7l9-11h-7z'
                        />
                      </svg>
                      Generate Summary with AI
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const getVideoEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    try {
      // YouTube URL patterns
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const youtubeMatch = url.match(youtubeRegex);
      if (youtubeMatch && youtubeMatch[1]) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }

      // Loom URL patterns
      const loomRegex = /loom\.com\/share\/([a-zA-Z0-9]+)/;
      const loomMatch = url.match(loomRegex);
      if (loomMatch && loomMatch[1]) {
        return `https://www.loom.com/embed/${loomMatch[1]}`;
      }

      return null;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };

  const renderVideoIntroTab = () => {
    const videoUrl = applicantProfile.video_intro_url;
    const embedUrl = getVideoEmbedUrl(videoUrl);

    if (!videoUrl || !embedUrl) {
      return (
        <div className='mt-8 text-center'>
          <div className='bg-gray-50 rounded-lg p-8 border border-gray-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 text-gray-400 mx-auto mb-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
              />
            </svg>
            <h4 className='text-gray-600 font-medium mb-2'>No Video Introduction</h4>
            <p className='text-gray-500 text-sm'>
              {!videoUrl
                ? 'This applicant did not submit a video introduction.'
                : 'Unable to play video. The URL format may not be supported.'}
            </p>
            {videoUrl && !embedUrl && (
              <div className='mt-4'>
                <a
                  href={videoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline text-sm'
                >
                  View original link
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className='mt-6'>
        <div className='bg-gray-900 rounded-lg overflow-hidden'>
          <div className='relative' style={{ paddingTop: '56.25%' }}>
            <iframe
              className='absolute top-0 left-0 w-full h-full'
              src={embedUrl}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              title='Video Introduction'
            />
          </div>
        </div>
        <div className='mt-4 text-sm text-gray-600'>
          <a
            href={videoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            Open video in new tab
          </a>
        </div>
      </div>
    );
  };

  const renderResumeView = () => {
    return (
      <>
        <iframe className='w-full h-[43rem]' src={`${applicantProfile.cv_url}#toolbar=0`}></iframe>
      </>
    );
  };

  const handleDocxDownload = () => {
    window.open(applicantProfile.cv_url, '_blank');
    setShowDocxDownloadModal(false);
  };

  const renderDocxDownloadModal = () => {
    return (
      <Transition.Root show={showDocxDownloadModal} as={Fragment}>
        <Dialog as='div' className='relative z-40' onClose={() => setShowDocxDownloadModal(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100'
            leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>
          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300' enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200' leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md'>
                  <div className='flex bg-savoy-blue p-2 items-center gap-4'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Download CV/Resume</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setShowDocxDownloadModal(false)} />
                  </div>
                  <div className='p-6 text-center space-y-4'>
                    <p className='text-gray-600'>
                      This CV/Resume is in DOCX format and cannot be previewed in the browser. Click the button below to download it.
                    </p>
                    <button
                      type='button'
                      className='inline-block px-6 py-2 rounded-md text-white bg-[#355FD0] hover:bg-blue-700'
                      onClick={handleDocxDownload}
                    >
                      Download CV/Resume
                    </button>
                  </div>
                  <div className='flex justify-end p-4 border-t border-[#355FD0]'>
                    <button
                      type='button'
                      className='border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]'
                      onClick={() => setShowDocxDownloadModal(false)}
                    >
                      Close
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

  return (
    <>
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
                  viewCV ? 'max-w-4xl' : 'max-w-3xl'
                )}
              >
                <div className='flex bg-savoy-blue p-2 items-center gap-4'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>{title}</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer self-start' onClick={handleClose} />
                </div>
                <div className={classNames('m-7', viewCV ? 'h-[43rem]' : 'h-auto')}>
                  {!viewCV && (
                    <div className='w-full overflow-x-auto md:overflow-x-visible justify-center md:justify-stretch'>
                      <div className={classNames(
                        'flex md:grid gap-2 md:gap-0 min-w-max md:min-w-0 justify-center md:justify-stretch',
                        jobPostingDetails?.is_video_intro_enabled ? 'md:grid-cols-5' : 'md:grid-cols-4'
                      )}>
                        <div className='mr-2 md:mr-2 flex-shrink-0'>
                          <button
                            className={classNames(
                              'px-4 py-2 font-bold rounded-md w-full whitespace-nowrap',
                              currentTab == 1 ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                            )}
                            onClick={() => setCurrentTab(1)}
                          >
                            Profile
                          </button>
                        </div>
                        <div className='mx-2 md:mx-2 flex-shrink-0'>
                          <button
                            className={classNames(
                              'px-4 py-2 font-bold rounded-md whitespace-nowrap md:text-base w-full',
                              currentTab == 2 ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                            )}
                            onClick={() => setCurrentTab(2)}
                          >
                          Job Experience
                          </button>
                        </div>
                        <div className='mx-2 md:mx-2 flex-shrink-0'>
                          <button
                            className={classNames(
                              'px-4 py-2 font-bold rounded-md w-full whitespace-nowrap',
                              currentTab == 3 ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                            )}
                            onClick={() => setCurrentTab(3)}
                          >
                            Summary
                          </button>
                        </div>
                        <div className='mx-2 md:mx-2 flex-shrink-0'>
                          <button
                            className={classNames(
                              'px-4 py-2 font-bold rounded-md w-full whitespace-nowrap',
                              currentTab == 4 ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                            )}
                            onClick={() => setCurrentTab(4)}
                          >
                            Answers
                          </button>
                        </div>
                        {jobPostingDetails?.is_video_intro_enabled && (
                          <div className='ml-2 md:ml-2 flex-shrink-0'>
                            <button
                              className={classNames(
                                'px-4 py-2 font-bold rounded-md w-full whitespace-nowrap',
                                currentTab == 5 ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                              )}
                              onClick={() => setCurrentTab(5)}
                            >
                              Video Intro
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {!viewCV && currentTab == 1 && renderProfileTab()}
                  {!viewCV && currentTab == 2 && <div className='h-[28rem] overflow-y-auto'>{renderJobExpTab()}</div>}
                  {!viewCV && currentTab == 3 && <div className='h-[28rem] overflow-y-auto'>{renderSummaryTab()}</div>}
                  {!viewCV && currentTab == 4 && <div className='h-[28rem] overflow-y-auto'>{renderAnswersTab()}</div>}
                  {!viewCV && currentTab == 5 && jobPostingDetails?.is_video_intro_enabled && <div className='h-[28rem] overflow-y-auto'>{renderVideoIntroTab()}</div>}
                  {viewCV && renderResumeView()}
                </div>
                {!viewCV && (
                  <div className='flex items-center gap-4 text-[15px] font-bold justify-end flex-wrap p-4 border-t-[1px] border-[#355FD0]'>
                    {isHired && !eafNotFound && eafData?.pdf_url && (
                      <button
                        type='button'
                        onClick={() => setShowEAFModal(true)}
                        className='flex items-center gap-2 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg py-2 px-4 text-sm font-medium'
                      >
                        <DocumentTextIcon className='w-4 h-4' />
                        View EAF
                      </button>
                    )}
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
        
        {showEAFModal && applicant && (
          <EAFModal
            isOpen={showEAFModal}
            onClose={() => setShowEAFModal(false)}
            appliedJobId={applicant.applicationId}
            applicantName={applicant.name}
            applicantEmail={applicant.email || undefined}
            positionTitle={JobTitle}
          />
        )}
      </Dialog>
    </Transition.Root>
    {renderDocxDownloadModal()}
    </>
  );
}
