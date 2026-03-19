import { Fragment, useState, useEffect } from 'react';

import Link from 'next/link';

import { formatDateToLocal } from '@/helpers/date';

import { Dialog, Transition } from '@headlessui/react';
import useGetYahshuaConnectJobDetails from '../pages/jobs/hooks/useGetJobDetails';
import ChatMessagesModal from '@/components/common/chat/ChatMessagesModal';

import { XMarkIcon, CheckCircleIcon, BriefcaseIcon, ClockIcon, BanknotesIcon, ClipboardDocumentIcon, HomeIcon, StarIcon, CheckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import JobDetailsLocation from '@/svg/JobDetailLocation';
import BenefitsIcon from '@/svg/BenefitsIcon';
import FileCaseIcon from '@/svg/FileCaseIcon';

import formatPrice from '@/helpers/currencyFormat';
import 'react-quill/dist/quill.snow.css';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number | null;
}

const JobDetailsModal = ({ isOpen, onClose, jobId }: JobDetailsModalProps) => {
  const { data, isLoading } = useGetYahshuaConnectJobDetails(jobId);
  const [jobDetailData, setJobDetailData] = useState<any>({});
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    if (data) {
      setJobDetailData(data);
    }
  }, [data]);

  // Helper function to get employer initials
  const getEmployerInitials = (name: string) => {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderRoleDescription = (jobDescription: any) => {
    const markup = { __html: jobDescription };
    return <span className='ql-editor !p-0' dangerouslySetInnerHTML={markup}></span>;
  };

  const renderQualificationsDescription = (qualifications: any) => {
    const markup = { __html: qualifications };
    return <span className='ql-editor !p-0' dangerouslySetInnerHTML={markup}></span>;
  };
  
  const renderNotesRemarks = (notesRemarks: any) => {
    const markup = { __html: notesRemarks };
    return <span className='ql-editor !p-0' dangerouslySetInnerHTML={markup}></span>;
  };

  const getMatchColor = (matchValue?: number) => {
    if (!matchValue) return 'bg-gray-200';
    if (matchValue === 100) return 'bg-green-500';
    return 'bg-yellow-400';
  };

  const getReapplyDateStr = () => {
    const status = jobDetailData?.applied_job_status;
    const updatedAt = jobDetailData?.applied_job_updated_at;
    if (status === 'rejected' && updatedAt) {
      try {
        const updatedDate = new Date(updatedAt);
        const expiresAt = new Date(updatedDate.getTime() + 15 * 24 * 60 * 60 * 1000);
        const now = new Date();
        if (now.getTime() <= expiresAt.getTime()) {
          return formatDateToLocal(expiresAt.toISOString(), true);
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  if (!jobId) return null;

  return (
    <Transition show={isOpen} as={Fragment} appear={true}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Slide-in panel from right */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen sm:w-[85vw] md:w-[50vw]">
                  <div className="flex h-screen flex-col overflow-hidden bg-white shadow-2xl">
                  {/* Header with Apply Now button or Applied badge and Close button */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      {jobDetailData?.applied ? (
                        <>
                          {/* Single badge: Applied -> Hired or Rejected (rejected shows for 15 days) */}
                          {(() => {
                            const status = jobDetailData?.applied_job_status;
                            const updatedAt = jobDetailData?.applied_job_updated_at;
                            // compute rejection expiry: 15 days from updatedAt
                            if (status === 'rejected' && updatedAt) {
                              try {
                                const updatedDate = new Date(updatedAt);
                                const expiresAt = new Date(updatedDate.getTime() + 15 * 24 * 60 * 60 * 1000);
                                const now = new Date();
                                if (now.getTime() <= expiresAt.getTime()) {
                                  return (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg">
                                      <span className="text-sm font-medium">Rejected</span>
                                    </div>
                                  );
                                }
                                // If rejection expired, fallthrough to show Applied
                              } catch (e) {
                                // parsing error -> show Applied
                              }
                            }

                            if (status === 'hired') {
                              return (
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-200 text-green-700 rounded-lg">
                                  <CheckIcon className="h-5 w-5 " />
                                  <span className="text-sm font-medium">Hired</span>
                                </div>
                              );
                            }

                            // default: Applied
                            return (
                              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                                <CheckIcon className="h-5 w-5" />
                                <span className="text-sm font-medium">Applied</span>
                              </div>
                            );
                          })()}
                          {jobDetailData?.applied_job_id && (
                            <>
                              <button
                                onClick={() => setShowChatModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                              >
                                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                                <span>Message Employer</span>
                              </button>
                              {(() => {
                                const reapplyDate = getReapplyDateStr();
                                if (reapplyDate) {
                                  return <p className="text-xs text-gray-500 ml-3">Can re-apply after {reapplyDate}</p>;
                                }
                                return null;
                              })()}
                            </>
                          )}
                        </>
                      ) : (
                        <Link
                          href={`/job-applicant-form/${jobId}`}
                          className="px-6 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                        >
                          Apply Now
                        </Link>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Job Details Content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6">
                      {/* Job Header */}
                      <div className='flex flex-col md:flex-row gap-4 mb-4'>
                        <div className='flex-1'>
                          <div className='flex items-start gap-3'>
                            <span className='mt-1 flex-shrink-0'>
                              <FileCaseIcon className='h-5 w-5 md:h-6 md:w-6' />
                            </span>
                            <div className='flex-1 min-w-0'>
                              <h5 className='text-lg md:text-xl font-semibold text-indigo-dye break-words'>
                                {!isLoading ? jobDetailData?.job_title : 'Loading job title...'}
                              </h5>
                              <h6 className='text-indigo-dye text-xs md:text-sm mt-1 break-words'> 
                                for a {!isLoading ? jobDetailData?.industry : 'Loading industry...'} Company
                              </h6>
                              <h6 className='text-indigo-dye text-xs md:text-sm mt-1 break-words'> 
                                {!isLoading ? jobDetailData?.address : 'Loading location...'}
                              </h6>
                            </div>
                          </div>
                        </div>
                        {jobDetailData.company_logo && (
                          <div className='flex-shrink-0'>
                            <div
                              className='w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded-md'
                              style={{
                                backgroundImage: `url(${jobDetailData.company_logo})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {/* Match Percentage - Only show if available */}
                      {jobDetailData?.match_percentage !== undefined && jobDetailData?.match_percentage !== null && (
                        <div className='border-t border-gray-300 my-4 pt-4'>
                          <h5 className='text-lg md:text-xl font-semibold text-indigo-dye mb-3'>Skill Match</h5>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getMatchColor(jobDetailData.match_percentage)}`}
                                style={{ width: `${jobDetailData.match_percentage}%` }}
                              />
                            </div>
                            <span className="text-sm md:text-base font-semibold text-gray-700 whitespace-nowrap">{jobDetailData.match_percentage}%</span>
                          </div>
                        </div>
                      )}
                      
                      <div className='border-t border-gray-300 my-4 pt-4'>
                        <h5 className='text-lg md:text-xl font-semibold text-indigo-dye mb-3'>Job Details</h5>
                        <div className='details mt-2 space-y-3'>
                          {/* Role section - only show if is_show_roles is true */}
                          {!isLoading && jobDetailData?.is_show_roles && jobDetailData?.job_description && (
                            <div>
                              <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                                <ClipboardDocumentIcon className='h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0' />
                                Role
                              </h6>
                              <div className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]'>
                                {renderRoleDescription(jobDetailData?.job_description)}
                              </div>
                            </div>
                          )}
                          <div>
                            <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                              <JobDetailsLocation className='h-3.5 w-3.5 md:h-4 md:w-4 mr-2 flex-shrink-0' />
                              Location
                            </h6>
                            <p className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] break-words'>
                              {!isLoading ? jobDetailData.advertise_to : 'Loading location...'}
                            </p>
                          </div>
                          
                          {/* skills */}
                          {jobDetailData?.skills && (
                            <div>
                              <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                                <StarIcon className='h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0' />
                                Skills
                              </h6>
                              <p className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] break-words'>
                                {!isLoading ? (Array.isArray(jobDetailData.skills) ? jobDetailData.skills.join(', ') : jobDetailData.skills) : 'Loading skills...'}
                              </p>
                            </div>
                          )}

                          {/* qualifications */}
                          <div>
                            <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                              <CheckCircleIcon className='h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0' />
                              Qualifications
                            </h6>
                            <div className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]'>
                              {!isLoading
                                ? renderQualificationsDescription(jobDetailData?.qualifications)
                                : 'Loading qualifications...'}
                            </div>
                          </div>
                          {/* job type */}
                          <div>
                            <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                              <BriefcaseIcon className='h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0' />
                              Job Type
                            </h6>
                            <p className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]'>
                              {!isLoading ? jobDetailData?.job_type : 'Loading job type...'}
                            </p>
                          </div>
                          {/* work setup */}
                          {jobDetailData?.work_setup && (
                            <div>
                              <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                                <HomeIcon className='h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0' />
                                Work Setup
                              </h6>
                              <p className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]'>
                                {!isLoading ? jobDetailData?.work_setup : 'Loading work setup...'}
                              </p>
                            </div>
                          )}
                          {/* schedule */}
                          <div>
                            <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                              <ClockIcon className='h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0' />
                              Schedule
                            </h6>
                            <p className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]'>
                              {!isLoading ? jobDetailData?.job_schedule : 'Loading schedule...'}
                            </p>
                          </div>
                          {/* salary range */}
                          {jobDetailData?.is_show_salary && (
                            <div>
                              <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                                <BanknotesIcon className='h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0' />
                                Salary Range
                              </h6>
                              <p className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] break-words'>
                                {!isLoading && jobDetailData?.salary_range_type == 'Range' && (
                                  <>
                                    PHP {formatPrice(jobDetailData?.minimum_amount)} - {formatPrice(jobDetailData?.maximum_amount)}
                                  </>
                                )}
                                {!isLoading && jobDetailData?.salary_range_type != 'Range' && (
                                  <>PHP {formatPrice(jobDetailData?.exact_amount)}</>
                                )}
                                &nbsp;/ {jobDetailData.rate}
                              </p>
                            </div>
                          )}
                          {/* benefits */}
                          {jobDetailData?.is_show_benefits && jobDetailData.offered_benefits && (
                            <div>
                              <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                                <BenefitsIcon className='h-3.5 w-3.5 md:h-4 md:w-4 mr-2 flex-shrink-0' />
                                Benefits
                              </h6>
                              <ul className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]'>
                                {!isLoading ? jobDetailData.offered_benefits : 'Loading benefits...'}
                              </ul>
                            </div>
                          )}
                          
                          {/* notes/remarks - only show if is_show_remarks is true */}
                          {!isLoading && jobDetailData?.is_show_remarks && jobDetailData.job_remark && (
                            <div>
                              <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                                <ClipboardDocumentIcon className='h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0' />
                                Notes/Remarks
                              </h6>
                              <p className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]'>
                                {renderNotesRemarks(jobDetailData?.job_remark)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      {!isLoading && jobDetailData?.uploaded_job_description && jobDetailData?.uploaded_job_description.length > 0 && (
                        <div className='border-t border-gray-300 my-4 pt-4'>
                          <h5 className='text-lg md:text-xl font-semibold text-indigo-dye mb-3'>Job Description File</h5>
                          <div className='details mt-2'>
                            <h6 className='text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1'>
                              <ClipboardDocumentIcon className='h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0' />
                              Job Description Document
                            </h6>
                            <div className='text-xs md:text-[13px] text-indigo-dye mt-1 ml-6'>
                              <a 
                                href={jobDetailData?.uploaded_job_description} 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='text-savoy-blue underline hover:text-blue-700 flex items-center'
                              >
                                <ClipboardDocumentIcon className='h-3.5 w-3.5 md:h-4 md:w-4 mr-1' />
                                View Job Description PDF
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            </div>
          </div>
        </div>
      
      {/* Employer Chat Modal */}
      {jobDetailData?.applied_job_id && (
        <ChatMessagesModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          chatType="employer-applicant"
          appliedJobId={jobDetailData.applied_job_id}
          subtitle={jobDetailData.job_title || 'Job'}
          personName={jobDetailData.employer_name || 'Employer'}
          personPhoto={jobDetailData.company_logo}
          personInitials={getEmployerInitials(jobDetailData.employer_name || '')}
        />
      )}
      </Dialog>
    </Transition>
  );
};

export default JobDetailsModal;

