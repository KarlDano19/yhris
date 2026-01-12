import Link from 'next/link';

import JobDetails from './JobDetails';

import { XMarkIcon } from '@heroicons/react/24/outline';
import FileCaseIcon from '@/svg/FileCaseIcon';
import classNames from '@/helpers/classNames';

interface JobCardProps {
  job: {
    id: any;
    title: string;
    company: string;
    country: string;
    isNew?: boolean;
    is_urgent?: boolean;
    urgent?: boolean;
  };
  isSelected: boolean;
  isJobView: boolean;
  isJobModalOpen: boolean;
  onJobClick: (jobId: any) => void;
  onCloseDetails: () => void;
}

const JobCard = ({
  job,
  isSelected,
  isJobView,
  isJobModalOpen,
  onJobClick,
  onCloseDetails,
}: JobCardProps) => {
  return (
    <div>
      <div
        className={classNames(
          'card border rounded-md p-4 cursor-pointer',
          isJobView && isSelected ? 'border-savoy-blue' : 'border-gray-300'
        )}
        onClick={() => onJobClick(job.id)}
      >
        <div className='flex items-center gap-2 mb-1'>
          {job.isNew && <span className='text-xs text-red-500 font-medium'>NEW</span>}
          {(job.is_urgent || job.urgent) && (
            <span className='text-xs text-orange-600 font-medium bg-orange-100 px-2 py-0.5 rounded'>
              URGENT
            </span>
          )}
        </div>
        <div className='flex flex-col'>
          <span className='mt-1 ml-1'>
            <FileCaseIcon className='h-6 w-6' />
          </span>
          <div className='ml-0 mt-2'>
            <h5 className='text-lg lg:text-xl font-semibold text-indigo-dye'>{job.title}</h5>
            <h6 className='text-indigo-dye text-sm font-medium mt-1'>{job.company}</h6>
            <h6 className='text-indigo-dye text-sm'>{job.country}</h6>
            <Link href={`/job-app-form/${job.id}`} onClick={(e) => e.stopPropagation()}>
              <button className='rounded-md bg-savoy-blue mt-5 mb-4 md:mb-0 lg:mb-4 w-full py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                Apply Now!
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile Job Details Preview */}
      {isJobView && isSelected && (
        <div className='lg:border-l lg:border-gray-300 xl:pl-10 xl:pr-5 py-3 lg:w-[64%] lg:hidden block'>
          <div
            className={classNames(
              'card border border-savoy-blue rounded-md sticky top-10',
              isJobModalOpen ? '' : 'hidden'
            )}
          >
            <div className='flex justify-end px-3 mt-2'>
              <button onClick={onCloseDetails}>
                <XMarkIcon className='h-5 w-5 text-indigo-dye' />
              </button>
            </div>
            <JobDetails jobId={job.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;

