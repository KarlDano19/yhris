import { useState, useEffect } from 'react';

import formatPrice from '@/helpers/currencyFormat';
import useGetJobDetails from './hooks/useGetJobDetails';

import { CheckCircleIcon, BriefcaseIcon, ClockIcon, BanknotesIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import BenefitsIcon from '@/svg/BenefitsIcon';
import FileCaseIcon from '@/svg/FileCaseIcon';

import * as DOMPurify from 'dompurify';
import JobDetailsLocation from '@/svg/JobDetailLocation';
import 'react-quill/dist/quill.snow.css';

interface JobDetailsProp {
  jobId: any;
}

const JobDetails = ({ jobId }: JobDetailsProp) => {
  const { data, isLoading } = useGetJobDetails(jobId);
  const [jobDetailData, setJobDetailData] = useState<any>({});

  useEffect(() => {
    if (data) {
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
      <div className='grid grid-cols-4 px-4 mt-5'>
        <div className='col-span-3 lg:col-span-2 flex'>
          <span className='mt-1 ml-1'>
            <FileCaseIcon className='h-6 w-6' />
          </span>
          <div className='ml-6'>
            <h5 className='text-xl font-semibold text-indigo-dye'>
              {!isLoading ? jobDetailData?.job_title : 'Loading job title...'}
            </h5>
            <h6 className='text-indigo-dye text-sm'> 
              for a {!isLoading ? jobDetailData?.industry : 'Loading indsutry...'} Company
            </h6>
            <h6 className='text-indigo-dye text-sm'> {!isLoading ? jobDetailData?.location : 'Loading location...'}</h6>
          </div>
        </div>
        <div className='col-span-1 lg:col-span-2 px-1'>
          <div
            className='lg:w-40 lg:mx-auto bg-gray-300 h-[150px] rounded-md hidden lg:block'
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
          <h6 className='text-[15px] flex items-center text-savoy-blue font-medium'>
            <JobDetailsLocation className='h-3.5 w-3.5 mb-2 mr-1.5 ml-1' />
            Location
          </h6>
          <p className='text-[13px] text-indigo-dye mt-1 list-disc ml-6 mb-2'>
            {!isLoading ? jobDetailData.advertise_to : 'Loading location...'}
          </p>
          
          {/* Role section - only show if is_show_roles is true */}
          {!isLoading && jobDetailData?.is_show_roles && jobDetailData?.job_description && (
            <>
              <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                <ClipboardDocumentIcon className='h-5 w-5 mr-1' />
                Role
              </h6>
              <div className='text-[13px] text-indigo-dye mt-1 ml-6'>
                {renderRoleDescription(jobDetailData?.job_description)}
              </div>
            </>
          )}
          
          {/* qualifications */}
          <h6 className='text-[15px] flex items-center text-savoy-blue font-medium'>
            <CheckCircleIcon className='h-5 w-5 mr-1' />
            Qualifications
          </h6>
          <div className='text-[13px] text-indigo-dye mt-1 ml-6'>
            {!isLoading
              ? renderQualificationsDescription(jobDetailData?.qualifications)
              : 'Loading qualifications...'}
          </div>
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
          {jobDetailData?.is_show_salary && (
            <>
              <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                <BanknotesIcon className='h-5 w-5 mr-1' />
                Salary Range
              </h6>
              <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
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
            </>
          )}
          {/* benefits */}
          {jobDetailData?.is_show_benefits && jobDetailData.offered_benefits && (
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
          
          {/* notes/remarks - only show if is_show_remarks is true */}
          {!isLoading && jobDetailData?.is_show_remarks && jobDetailData.job_remark && (
            <>
              <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                <ClipboardDocumentIcon className='h-5 w-5 mr-1' />
                Notes/Remarks
              </h6>
              <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                {renderNotesRemarks(jobDetailData?.job_remark)}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default JobDetails;
