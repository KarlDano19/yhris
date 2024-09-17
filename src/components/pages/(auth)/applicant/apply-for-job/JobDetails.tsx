import BenefitsIcon from '@/svg/BenefitsIcon';
import FileCaseIcon from '@/svg/FileCaseIcon';
import { CheckCircleIcon, BriefcaseIcon, ClockIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import useGetJobDetails from './hooks/useGetJobDetails';

interface JobDetailsProp {
  jobId: any;
}

const JobDetails = ({ jobId }: JobDetailsProp) => {
  const { data, isLoading } = useGetJobDetails(jobId);

  return (
    <>
      <div className='grid grid-cols-4 px-4 mt-5'>
        <div className='col-span-3 flex'>
          <span className='mt-1 ml-1'>
            <FileCaseIcon className='h-6 w-6' />
          </span>
          <div className='ml-6'>
            <h5 className='text-xl font-semibold text-indigo-dye'>
              {!isLoading ? data?.title : 'Loading job title...'}
            </h5>
            <h6 className='text-indigo-dye text-sm font-medium mt-1'>
              {!isLoading ? data?.company : 'Loading company name...'}
            </h6>
            <h6 className='text-indigo-dye text-sm'>{!isLoading ? data?.location : 'Loading location...'}</h6>
          </div>
        </div>
        <div className='col-span-1 px-1'>
          <div className='bg-gray-300 h-[72px] rounded-md'></div>
        </div>
      </div>
      <p className='text-sm text-indigo-dye px-[70px] mt-4'>
        Role:<br/>{!isLoading ? data?.role : 'Loading role description...'}
      </p>
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
              ? data?.jobDetails.qualifications.map((qualification: any) => (
                  <li key={qualification}>{qualification}</li>
                ))
              : 'Loading qualifications...'}
          </ul>
          {/* job type */}
          <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
            <BriefcaseIcon className='h-5 w-5 mr-1' />
            Job Type
          </h6>
          <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
            {!isLoading ? data?.jobDetails.jobType.join(', ') : 'Loading job type...'}
          </p>
          {/* schedule */}
          <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
            <ClockIcon className='h-5 w-5 mr-1' />
            Schedule
          </h6>
          <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
            {!isLoading ? data?.jobDetails.schedule.join(', ') : 'Loading schedule...'}
          </p>
          {/* salary range */}
          <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
            <BanknotesIcon className='h-5 w-5 mr-1' />
            Salary Range
          </h6>
          <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
            {!isLoading ? data?.jobDetails.currencyType + ' ' + data?.jobDetails.salaryFrom : '0'} -{' '}
            {!isLoading ? data?.jobDetails.currencyType + ' ' + data?.jobDetails.salaryTo : '0'}
          </p>
          {/* benefits */}
          <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
            <BenefitsIcon className='h-4 w-4 mt-1 ml-0.5 mr-1.5' />
            Benefits
          </h6>
          <ul className='text-[13px] text-indigo-dye mt-1 list-disc ml-6'>
            {!isLoading
              ? data?.jobDetails.benefits.map((benefit: any) => <li key={benefit}>{benefit}</li>)
              : 'Loading benefits...'}
          </ul>
        </div>
      </div>
    </>
  );
};

export default JobDetails;
