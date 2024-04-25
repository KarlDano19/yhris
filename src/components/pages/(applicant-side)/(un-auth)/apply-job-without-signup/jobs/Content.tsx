'use client';


import Image from 'next/image';
import Link from 'next/link';

import JobDetails from './JobDetails';
import JobDetailsModal from './modals/JobDetailsModal';
import useFindJobs from './hooks/useFindJobs';

import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import jobIllustration from '@/assets/find-job-illustration.svg';
import FileCaseIcon from '@/svg/FileCaseIcon';



const Content = () => {
  const [hasJob, setJob] = useState(false);
  const [isJobView, setIsJobView] = useState(false);
  const [isJobModal, setJobModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<any>();
  const [jobsItems, setJobsItems] = useState<any>([]);

  const { data: dataJobs, isLoading: isGetJobsLoading } = useFindJobs('', '');

  useEffect(() => {
    if (dataJobs && dataJobs.length !== 0) {
      setJob(true);
      setJobsItems(dataJobs);
      setSelectedJobId(dataJobs[0].id);
      setIsJobView(true);
      setJobModal(true);
    }
  }, [dataJobs]);

  const openJobDetails = (jobId: any) => {
    setSelectedJobId(jobId);
    setIsJobView(true);
    // setJobModal(true);
  };

  const closeJobDetails = () => {
    setIsJobView(false);
  };

  const closeJobModal = () => {
    setJobModal(false);
  };

  return (
    <>
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}
      >
        <div className='px-4 pt-8'>
          <h4 className='text-lg md:text-2xl text-indigo-dye font-bold md:font-semibold'>
            Find a job that&#39;s right for you!
          </h4>
          <div className='h-auto pt-7 mt-0'>
            <form
              className=''
              onSubmit={(e) => {
                e.preventDefault();
                setJob(true);
              }}
            >
              <div className='lg:flex lg:px-4 lg:justify-between md:mt-4'>
                <div className='flex items-center justify-around rounded-md p-3 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-black w-full lg:w-[39%]'>
                  <label
                    htmlFor='what'
                    className='font-semibold text-indigo-dye text-sm'
                  >
                    What
                  </label>
                  <input
                    type='text'
                    name='what'
                    id='what'
                    className='bg-gray-100 w-56 mx-3 md:px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-xs leading-[23px]'
                    placeholder='Enter job title, company, or keywords'
                    required
                  />
                  <MagnifyingGlassIcon className='w-5 h-5 text-gray-400' />
                </div>
                <div className='flex items-center justify-around rounded-md p-3 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-black w-full lg:w-[39%] mt-3 lg:mt-0'>
                  <label
                    htmlFor='where'
                    className='font-semibold text-indigo-dye text-sm'
                  >
                    Where
                  </label>
                  <input
                    type='text'
                    name='where'
                    id='where'
                    className='bg-gray-100 w-56 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-xs leading-[23px] ml-3 md:ml-0'
                    placeholder='Town, City, Province, Country'
                    required
                  />
                  <MapPinIcon className='w-5 h-5 text-gray-400' />
                </div>
                <div className='flex justify-center lg:block mt-5 lg:mt-0'>
                  <button
                    type='submit'
                    className='rounded-md bg-savoy-blue px-24 lg:px-11 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    Find Jobs
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {hasJob ? (
        <div className='mt-4'>
          <div className='max-w-7xl px-4 sm:px-6 mx-auto'>
            <p className='text-[#6F829B] text-center lg:text-left text-sm pb-5 px-5 lg:px-10'>
              Jobs available: {!isGetJobsLoading ? jobsItems.length : '0'}
            </p>
          </div>
          <div className='border-t border-gray-300'></div>
          <div className='max-w-7xl px-4 sm:px-6 mx-auto'>
            <div className='px-4 lg:px-5'>
              <div className='lg:flex'>
                <div className='lg:w-[36%]'>
                  <div className='lg:pl-5 lg:pr-10 py-8 lg:py-10 grid md:grid-cols-2 lg:grid-cols-1 md:gap-x-4 lg:gap-x-0 gap-y-6'>
                    {!isGetJobsLoading
                      ? jobsItems.map((job: any) => (
                          <div
                            key={job.id}
                            className={`${
                              isJobView && selectedJobId === job.id
                                ? 'border-savoy-blue'
                                : 'border-gray-300'
                            } card border rounded-md p-4 cursor-pointer`}
                            onClick={() => openJobDetails(job.id)}
                          >
                            <span className='text-xs text-red-500'>
                              {job.isNew ? 'NEW' : ''}
                            </span>
                            <div className='flex md:flex-col lg:flex-row mt-2'>
                              <span className='mt-1 ml-1'>
                                <FileCaseIcon className='h-6 w-6' />
                              </span>
                              <div className='ml-6 md:ml-0 lg:ml-6 mt-0 md:mt-2 lg:mt-0'>
                                <h5 className='text-lg lg:text-xl font-semibold text-indigo-dye'>
                                  {job.title}
                                </h5>
                                <h6 className='text-indigo-dye text-sm font-medium mt-1'>
                                  {job.company}
                                </h6>
                                <h6 className='text-indigo-dye text-sm'>
                                  {job.location}
                                </h6>
                                <Link href={`/jobs/${job.id}`}>
                                  <button className='rounded-md bg-savoy-blue mt-5 mb-4 md:mb-0 lg:mb-4 w-full py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                    Apply Now!
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))
                      : 'Loading jobs...'}
                  </div>
                </div>
                <div className='lg:border-l lg:border-gray-300 pl-10 pr-5 py-10 lg:w-[64%] hidden lg:block'>
                  <div
                    className={`${
                      isJobView ? '' : 'hidden'
                    } card border border-gray-300 rounded-md`}
                  >
                    <div className='flex justify-end px-3 mt-2'>
                      <button onClick={closeJobDetails}>
                        <XMarkIcon className='h-5 w-5 text-indigo-dye' />
                      </button>
                    </div>
                    <JobDetails jobId={selectedJobId} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='w-auto h-[220px] md:w-[600px] md:h-[400px] relative block mx-auto mt-8'>
          <Image src={jobIllustration} fill alt='Find job illustration' />
        </div>
      )}
      {/* <JobDetailsModal
        open={isJobModal}
        onClose={closeJobModal}
        jobId={selectedJobId}
      /> */}
    </>
  );
};

export default Content;
