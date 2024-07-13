'use client';

import { useState, useEffect } from 'react';

import { useParams } from 'next/navigation';

import formatPrice from '@/helpers/currencyFormat';
import useGetJobDetails from './hooks/useGetJobDetails';

import { CheckCircleIcon, BriefcaseIcon, ClockIcon, BanknotesIcon } from '@heroicons/react/24/outline';
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

  return (
    <>
      {!!Object.keys(jobDetailData).length && (
        <div className='py-4 mx-4 md:py-12'>
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
                  <div className='text-sm text-indigo-dye mt-4 lg:w-60 text-justify'>
                    <p className='text-[1rem] font-semibold mb-1'>Role:</p>
                    {!isLoading ? renderRoleDescription(jobDetailData?.job_description) : 'Loading role description...'}
                  </div>
                </div>
              </div>
              <div className='col-span-1 px-1 rounded-md h-[10rem] w-[10rem] hidden sm:flex justify-center'>
                <div className='bg-gray-300 w-full h-full rounded-md'
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
                {/* qualifications */}
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium'>
                  <CheckCircleIcon className='h-5 w-5 mr-1' />
                  Qualifications
                </h6>
                <div className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                  {!isLoading
                    ? renderQualificationsDescription(jobDetailData?.qualifications)
                    : 'Loading qualifications...'}
                </div>
                {/* job type */}
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                  <BriefcaseIcon className='h-5 w-5 mr-1' />
                  Job Type
                </h6>
                <p className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                  {!isLoading ? jobDetailData?.job_type : 'Loading job type...'}
                </p>
                {/* schedule */}
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                  <ClockIcon className='h-5 w-5 mr-1' />
                  Schedule
                </h6>
                <p className='text-[13px] text-indigo-dye mt-1 ml-3 sm:ml-6'>
                  {!isLoading ? jobDetailData?.job_schedule : 'Loading schedule...'}
                </p>
                {/* salary range */}
                {jobDetailData.rate && (
                  <>
                    <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
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
                {jobDetailData.offered_benefits && (
                  <>
                    <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                      <BenefitsIcon className='h-4 w-4 mt-1 ml-0.5 mr-1.5' />
                      Benefits
                    </h6>
                    <ul className='text-[13px] text-indigo-dye mt-1 ml-6'>
                      {!isLoading ? jobDetailData.offered_benefits : 'Loading benefits...'}
                    </ul>
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
    </>
  );
};

export default Content;
