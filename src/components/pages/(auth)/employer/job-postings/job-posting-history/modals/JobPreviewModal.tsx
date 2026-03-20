import { Dispatch, Fragment, useRef } from "react";

import { Dialog, Transition } from "@headlessui/react";

import { XCircleIcon, CheckCircleIcon, BriefcaseIcon, ClockIcon, BanknotesIcon, ClipboardDocumentIcon, HomeIcon, LinkIcon } from "@heroicons/react/24/outline";

import { T_JobPreviewModal } from "@/types/globals";
import { T_JobPostingTable } from "@/types/job_posting";
import formatPrice from '@/helpers/currencyFormat';
import BenefitsIcon from '@/svg/BenefitsIcon';
import FileCaseIcon from '@/svg/FileCaseIcon';
import JobDetailsLocation from '@/svg/JobDetailLocation';

import 'react-quill/dist/quill.snow.css';

export default function JobPreviewModal({
  isOpen,
  setIsOpen,
  id,
  jobPostHistoryItems,
}: {
  isOpen: T_JobPreviewModal | null;
  setIsOpen: Dispatch<T_JobPreviewModal | null>;
  id: number | null;
  jobPostHistoryItems: T_JobPostingTable[];
}) {
  const cancelButtonRef = useRef(null);

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

  return (
    <Transition.Root show={isOpen?.isOpen ? true : false} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setIsOpen({ id: isOpen?.id ? isOpen?.id : null, isOpen: false })}
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center rounded-t-lg">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Job {id} - Preview
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => setIsOpen({ id: isOpen?.id ? isOpen?.id : null, isOpen: false })}
                  />
                </div>
                {jobPostHistoryItems &&
                  jobPostHistoryItems.map((item: T_JobPostingTable, index: number) => {
                    if (item.id == id) {
                      return (
                        <div key={index} className="px-4 pb-6">
                          {/* Job Header */}
                          <div className='grid grid-cols-4 px-4 mt-5'>
                            <div className='col-span-3 lg:col-span-2 flex'>
                              <span className='mt-1 ml-1'>
                                <FileCaseIcon className='h-6 w-6' />
                              </span>
                              <div className='ml-6'>
                                <h5 className='text-xl font-semibold text-indigo-dye'>
                                  {item.job_title}
                                </h5>
                                <h6 className='text-indigo-dye text-sm'> 
                                  for a Technology Company
                                </h6>
                                <h6 className='text-indigo-dye text-sm'> 
                                  {item.advertise_to}
                                </h6>
                              </div>
                            </div>
                            <div className='col-span-1 lg:col-span-2 px-1'>
                              <div
                                className='lg:w-40 lg:mx-auto bg-gray-300 h-[150px] rounded-md hidden lg:block'
                                style={{
                                  backgroundImage: `url(${item.company_logo || '/assets/no-photo.png'})`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Job Details */}
                          <div className='border-t border-gray-300 my-5 p-4'>
                            <h5 className='text-xl font-semibold text-indigo-dye'>Job Details</h5>
                            <div className='details mx-5 mt-2'>
                              {/* Role section - only show if is_show_roles is true */}
                              {item.is_show_roles && item.job_description && (
                                <>
                                  <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                                    <ClipboardDocumentIcon className='h-5 w-5 mr-1' />
                                    Role
                                  </h6>
                                  <div className='text-[13px] text-indigo-dye mt-1 ml-6'>
                                    {renderRoleDescription(item.job_description)}
                                  </div>
                                </>
                              )}
                              
                              {/* Location */}
                              <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                                <JobDetailsLocation className='h-3.5 w-3.5 mb-2 mr-1.5 ml-1' />
                                Location
                              </h6>
                              <p className='text-[13px] text-indigo-dye mt-1 list-disc ml-6 mb-2'>
                                {item.advertise_to}
                              </p>
                              
                              {/* Qualifications */}
                              <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                                <CheckCircleIcon className='h-5 w-5 mr-1' />
                                Qualifications
                              </h6>
                              <div className='text-[13px] text-indigo-dye mt-1 ml-6'>
                                {item.qualifications ? renderQualificationsDescription(item.qualifications) : 'No qualifications specified'}
                              </div>
                              
                              {/* Job Type */}
                              <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                                <BriefcaseIcon className='h-5 w-5 mr-1' />
                                Job Type
                              </h6>
                              <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                                {item.job_type}
                              </p>
                              
                              {/* Work Setup */}
                              {item.work_setup && (
                                <>
                                  <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                                    <HomeIcon className='h-5 w-5 mr-1' />
                                    Work Setup
                                  </h6>
                                  <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                                    {item.work_setup}
                                  </p>
                                </>
                              )}
                              
                              {/* Schedule */}
                              <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                                <ClockIcon className='h-5 w-5 mr-1' />
                                Schedule
                              </h6>
                              <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                                {item.job_schedule}
                              </p>
                              
                              {/* Salary Range - only show if is_show_salary is true AND salary data exists */}
                              {item.is_show_salary && item.salary_range_type && (
                                (item.salary_range_type === 'Range'
                                  ? (Number(item.minimum_amount) > 0 || Number(item.maximum_amount) > 0)
                                  : Number(item.exact_amount) > 0
                                ) && item.rate
                              ) && (
                                <>
                                  <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                                    <BanknotesIcon className='h-5 w-5 mr-1' />
                                    Salary Range
                                  </h6>
                                  <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                                    {item.salary_range_type === 'Range' ? (
                                      <>
                                        PHP {formatPrice(Number(item.minimum_amount) || 0)} - {formatPrice(Number(item.maximum_amount) || 0)}
                                      </>
                                    ) : (
                                      <>PHP {formatPrice(Number(item.exact_amount) || 0)}</>
                                    )}
                                    &nbsp;/ {item.rate}
                                  </p>
                                </>
                              )}
                              
                              {/* Benefits - only show if is_show_benefits is true */}
                              {item.is_show_benefits && item.offered_benefits && (
                                <>
                                  <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                                    <BenefitsIcon className='h-4 w-4 mt-1 ml-0.5 mr-1.5' />
                                    Benefits
                                  </h6>
                                  <ul className='text-[13px] text-indigo-dye mt-1 ml-6'>
                                    {item.offered_benefits}
                                  </ul>
                                </>
                              )}
                              
                              {/* Notes/Remarks - only show if is_show_remarks is true */}
                              {item.is_show_remarks && item.job_remark && (
                                <>
                                  <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                                    <ClipboardDocumentIcon className='h-5 w-5 mr-1' />
                                    Notes/Remarks
                                  </h6>
                                  <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                                    {renderNotesRemarks(item.job_remark)}
                                  </p>
                                </>
                              )}

                              {/* Job URL */}
                              {item.job_url && (
                                <>
                                  <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                                    <LinkIcon className='h-5 w-5 mr-1' />
                                    Job URL
                                  </h6>
                                  <p className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                                    <a href={item.job_url} target='_blank' rel='noopener noreferrer' className='text-savoy-blue underline'>
                                      {item.job_url}
                                    </a>
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                <hr />
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                    onClick={() => setIsOpen({ id: isOpen?.id ? isOpen?.id : null, isOpen: false })}
                    ref={cancelButtonRef}
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
}
