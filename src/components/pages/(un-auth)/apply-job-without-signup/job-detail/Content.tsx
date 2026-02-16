'use client';

import { useState, useEffect } from 'react';

import { useParams } from 'next/navigation';

import formatPrice from '@/helpers/currencyFormat';
import useGetJobDetails from './hooks/useGetJobDetails';

import {
  CheckCircleIcon,
  BriefcaseIcon,
  ClockIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import BenefitsIcon from '@/svg/BenefitsIcon';
import FileCaseIcon from '@/svg/FileCaseIcon';

import 'react-quill/dist/quill.snow.css';

const Content = () => {
  const params = useParams();
  const { data, isLoading } = useGetJobDetails(Number(params.id));
  const [jobDetailData, setJobDetailData] = useState<any>({});

  useEffect(() => {
    if (data && Object.keys(data).length) {
      setJobDetailData(data);
    }
  }, [data]);

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
    <>
      {!!Object.keys(jobDetailData).length && (
        <div className='pt-[90px] pb-4 mx-4 md:pb-12'>
          <div className='md:w-[40em] mx-auto border border-gray-200 shadow-md rounded-[20px] py-2 px-3 sm:px-8 md:py-8 md:px-10'>
            <div className='grid sm:grid-cols-3 md:px-4 mt-5'>
              <div className='col-span-2 flex'>
                <div className='p-1'>
                  <FileCaseIcon className='h-6 w-6' />
                </div>
                <div className='pl-3 md:pl-6 pr-12 sm:pr-1'>
                  <h5 className='text-xl font-semibold text-indigo-dye'>
                    {!isLoading ? jobDetailData?.job_title : 'Loading job title...'}
                  </h5>
                  <h6 className='text-indigo-dye text-sm font-medium mt-1'>
                    {!isLoading ? jobDetailData?.company : 'Loading company name...'}
                  </h6>
                  <h6 className='text-indigo-dye text-sm'>
                    {' '}
                    {!isLoading ? jobDetailData?.location : 'Loading location...'}
                  </h6>
                </div>
              </div>
              <div className='col-span-1 px-1 rounded-md h-[10rem] w-[10rem] hidden sm:flex justify-center'>
                <div
                  className='bg-gray-300 w-full h-full rounded-md'
                  style={{
                    backgroundImage: `url(${jobDetailData.company_logo})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              </div>
            </div>
            <div className='border-t border-gray-300 my-5 pt-4 sm:pt-4 sm:px-4'>
              <h5 className='text-xl font-semibold text-indigo-dye'>Job Details</h5>
              <div className='details mx-2 sm:mx-5 mt-2'>
                {/* Role */}
                {jobDetailData?.is_show_roles && jobDetailData?.job_description && (
                  <>
                    <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                      <ClipboardDocumentIcon className='h-5 w-5 mr-1' />
                      Role:
                    </h6>
                    <div className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                      {!isLoading ? renderRoleDescription(jobDetailData?.job_description) : 'Loading role description...'}
                    </div>
                  </>
                )}
                
                {/* qualifications */}
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                  <CheckCircleIcon className='h-5 w-5 mr-1' />
                  Qualifications
                </h6>
                <div className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                  {!isLoading
                    ? renderQualificationsDescription(jobDetailData?.qualifications)
                    : 'Loading qualifications...'}
                </div>
                {/* job type */}
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                  <BriefcaseIcon className='h-5 w-5 mr-1' />
                  Job Type
                </h6>
                <p className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                  {!isLoading ? jobDetailData?.job_type : 'Loading job type...'}
                </p>
                {/* work setup */}
                {jobDetailData?.work_setup && (
                  <>
                    <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                      <HomeIcon className='h-5 w-5 mr-1' />
                      Work Setup
                    </h6>
                    <p className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                      {!isLoading ? jobDetailData?.work_setup : 'Loading work setup...'}
                    </p>
                  </>
                )}
                {/* schedule */}
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                  <ClockIcon className='h-5 w-5 mr-1' />
                  Schedule
                </h6>
                <p className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                  {!isLoading ? jobDetailData?.job_schedule : 'Loading schedule...'}
                </p>
                {/* salary range */}
                {jobDetailData?.is_show_salary && (
                  <>
                    <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                      <BanknotesIcon className='h-5 w-5 mr-1' />
                      Salary Range
                    </h6>
                    <p className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                      {!isLoading && jobDetailData?.salary_range_type == 'Range' && (
                        <>
                          PHP {formatPrice(jobDetailData?.minimum_amount)} -{' '}
                          {formatPrice(jobDetailData?.maximum_amount)}
                        </>
                      )}
                      {!isLoading && jobDetailData?.salary_range_type != 'Range' && (
                        <>PHP {formatPrice(jobDetailData?.exact_amount)}</>
                      )}
                    </p>
                  </>
                )}
                {/* benefits */}
                {jobDetailData?.is_show_benefits && jobDetailData.offered_benefits && (
                  <>
                    <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                      <BenefitsIcon className='h-4 w-4 mt-1 ml-0.5 mr-1.5' />
                      Benefits
                    </h6>
                    <ul className='text-[13px] text-indigo-dye mt-1 ml-6'>
                      {!isLoading ? jobDetailData.offered_benefits : 'Loading benefits...'}
                    </ul>
                  </>
                )}
                
                {/* notes/remarks - only show if is_show_remarks is true */}
                {jobDetailData?.is_show_remarks && jobDetailData.job_remark && (
                  <>
                    <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                      <ClipboardDocumentIcon className='h-5 w-5 mr-1' />
                      Notes/Remarks
                    </h6>
                    <p className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                      {!isLoading ? renderNotesRemarks(jobDetailData?.job_remark) : 'Loading remarks...'}
                    </p>
                  </>
                )}
              </div>
              <div className='mt-8 w-full text-center'>
                <button
                  className='rounded-md bg-savoy-blue mt-5 mb-4 md:mb-0 lg:mb-4 w-1/3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  onClick={() => {
                    location.href = `/job-app-form/${params.id}`;
                  }}
                >
                  Apply Now!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {(!!!Object.keys(jobDetailData).length && !isLoading) && (
        <div className='pt-[85px] pb-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto lg:mt-32'>
            <div className='px-4 py-5 sm:p-6'>
              <div className='flex items-center justify-center'>
                <ExclamationTriangleIcon className='h-20 w-20 text-yellow-400' aria-hidden='true' />
              </div>
              <div className='mt-3 text-center sm:mt-5'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>Job Not Available</h3>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>
                    We're sorry, but the job you're looking for is no longer available or doesn't exist.
                  </p>
                </div>
              </div>
              <div className='mt-5 sm:mt-6 text-center'>
                <button
                  type='button'
                  className='inline-flex justify-center w-6/12 rounded-md border border-transparent shadow-sm px-4 py-2 bg-savoy-blue text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
                  onClick={() => {
                    window.location.href = '/jobs';
                  }}
                >
                  View All Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Content;
