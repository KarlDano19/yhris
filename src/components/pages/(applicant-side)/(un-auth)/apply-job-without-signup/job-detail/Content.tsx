'use client';

import { useState, useEffect } from 'react';

import { useParams } from 'next/navigation';

import formatPrice from '@/helpers/currencyFormat';
import useGetJobDetails from './hooks/useGetJobDetails';

import { CheckCircleIcon, BriefcaseIcon, ClockIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import BenefitsIcon from '@/svg/BenefitsIcon';
import FileCaseIcon from '@/svg/FileCaseIcon';

import * as DOMPurify from 'dompurify';

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
    const markup = { __html: DOMPurify.sanitize(jobDescription) };
    return <span dangerouslySetInnerHTML={markup}></span>;
  };

  const renderQualificationsDescription = (qualifications: any) => {
    const markup = { __html: DOMPurify.sanitize(qualifications) };
    return <span dangerouslySetInnerHTML={markup}></span>;
  };

  return (
    <>
      {!!Object.keys(jobDetailData).length && (
        <div className='py-12'>
          <div className='w-[600px] mx-auto border border-gray-950 rounded-[20px] p-8'>
            <div className='grid grid-cols-4 px-4 mt-5'>
              <div className='col-span-3 lg:col-span-2 flex'>
                <span className='mt-1 ml-1'>
                  <FileCaseIcon className='h-6 w-6' />
                </span>
                <div className='ml-6'>
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
                  <p className='text-sm text-indigo-dye mt-4 lg:w-60'>
                    Role:{' '}
                    {!isLoading ? renderRoleDescription(jobDetailData?.job_description) : 'Loading role description...'}
                  </p>
                </div>
              </div>
              <div className='col-span-1 lg:col-span-2 px-1'>
                <div
                  className='image-container lg:w-40 bg-gray-300 h-[150px] rounded-md float-right'
                  style={{
                    backgroundImage: `url(${jobDetailData.company_logo})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              </div>
            </div>
            <div className='border-t border-gray-300 my-5 p-4'>
              <h5 className='text-xl font-semibold text-indigo-dye'>Job Details</h5>
              <div className='details mx-5 mt-2'>
                {/* qualifications */}
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium'>
                  <CheckCircleIcon className='h-5 w-5 mr-1' />
                  Qualifications
                </h6>
                <ul className='text-[13px] text-indigo-dye mt-1 list-disc ml-6'>
                  {!isLoading
                    ? renderQualificationsDescription(jobDetailData?.qualifications)
                    : 'Loading qualifications...'}
                </ul>
                {/* job type */}
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                  <BriefcaseIcon className='h-5 w-5 mr-1' />
                  Job Type
                </h6>
                <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                  {!isLoading ? jobDetailData?.job_type : 'Loading job type...'}
                </p>
                {/* schedule */}
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                  <ClockIcon className='h-5 w-5 mr-1' />
                  Schedule
                </h6>
                <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                  {!isLoading ? jobDetailData?.job_schedule : 'Loading schedule...'}
                </p>
                {/* salary range */}
                {jobDetailData.rate && (
                  <>
                    <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                      <BanknotesIcon className='h-5 w-5 mr-1' />
                      Salary Range
                    </h6>
                    <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
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
                {jobDetailData.offered_benefits && (
                  <>
                    <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                      <BenefitsIcon className='h-4 w-4 mt-1 ml-0.5 mr-1.5' />
                      Benefits
                    </h6>
                    <ul className='text-[13px] text-indigo-dye mt-1 list-disc ml-6'>
                      {!isLoading ? jobDetailData.offered_benefits : 'Loading benefits...'}
                    </ul>
                  </>
                )}
              </div>
              <div className='mt-8 w-full text-center'>
                <button
                  className='px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700'
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
    </>
  );
};

export default Content;
