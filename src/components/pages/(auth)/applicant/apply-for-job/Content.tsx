'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import classNames from '@/helpers/classNames';
import SuccessPopAlert from '@/components/SuccessPopAlert';
import CardProfile from './CardProfile';
import CardRecentApp from './CardRecentApp';
import JobDetails from './JobDetails';
import JobDetailsModal from './modals/JobDetailsModal';
import SavedModal from '../edit-profile/modals/SavedModal';
import ConfirmModal from './modals/ConfirmModal';
import useFindJobs from './hooks/useFindJobs';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/solid';
import FileCaseIcon from '@/svg/FileCaseIcon';
import jobIllustration from '@/assets/find-job-illustration.svg';

const Content = () => {
  const [hasJob, setJob] = useState(false);
  const [isJobView, setIsJobView] = useState(false);
  const [isJobModal, setJobModal] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModal] = useState(false);
  const [openSuccessAlert, setSuccessAlert] = useState(false);
  const [openSavedModal, setSavedModal] = useState(false);
  const [itemsFilter, setItemsFilter] = useState<any>({
    job_title: '',
    location: '',
  });
  const [selectedJobId, setSelectedJobId] = useState<any>();
  const [jobsItems, setJobsItems] = useState<any>([]);
  const { data: dataJobs, isLoading: isGetJobsLoading, refetch } = useFindJobs(itemsFilter);

  useEffect(() => {
    if (dataJobs && dataJobs.length !== 0) {
      setJob(true);
      setJobsItems(dataJobs);
      setSelectedJobId(dataJobs[0].id);
      setIsJobView(true);
      setJobModal(true);
    } else {
      setJobsItems([]);
      setIsJobView(false);
      setJobModal(false);
    }
  }, [dataJobs]);

  const openJobDetails = (jobId: any) => {
    setSelectedJobId(jobId);
    setIsJobView(true);
    setIsJobModalOpen(true);
    // setJobModal(true);
  };

  const closeJobDetails = () => {
    setIsJobView(false);
    setJobModal(false);
    setIsJobModalOpen(false);
  };

  useEffect(() => {
    const showSuccessAlert = sessionStorage.getItem('showSuccessOnLoad');
    const showSavedModal = sessionStorage.getItem('showSavedModal');

    if (showSuccessAlert) {
      setSuccessAlert(true);
      sessionStorage.removeItem('showSuccessOnLoad');
    } else if (showSavedModal) {
      setSavedModal(true);
      sessionStorage.removeItem('showSavedModal');
    }
  }, []);

  return (
    <>
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}>
        <div className='grid grid-cols-1 md:grid-cols-8 lg:grid-cols-6 gap-x-6 lg:px-4 py-8'>
          <div className='md:col-span-3 lg:col-span-2'>
            <CardProfile />
            <CardRecentApp />
          </div>
          <div className='md:col-span-5 lg:col-span-4 bg-white border border-gray-300 h-auto rounded-md shadow pt-7 mt-8 md:mt-0'>
            <form
              className='px-5'
              onSubmit={(e) => {
                e.preventDefault();
                refetch();
              }}
            >
              <h4 className='text-lg md:text-2xl text-indigo-dye font-bold md:font-semibold'>
                Find a job that&#39;s right for you!
              </h4>
              <div className='lg:flex lg:justify-between mt-5'>
                <div className='flex justify-around rounded-md p-3 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-black w-full lg:w-[48%]'>
                  <label htmlFor='what' className='font-semibold text-indigo-dye text-sm'>
                    What
                  </label>
                  <input
                    type='text'
                    name='what'
                    id='what'
                    className=' w-56 mx-3 md:px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-xs leading-[22px]'
                    placeholder='Enter job title, company, or keywords'
                    onChange={(e) => setItemsFilter({ ...itemsFilter, job_title: e.target.value })}
                  />
                  <MagnifyingGlassIcon className='w-5 h-5 text-gray-400' />
                </div>
                <div className='flex justify-around rounded-md p-3 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-black w-full lg:w-[48%] mt-3 lg:mt-0'>
                  <label htmlFor='where' className='font-semibold text-indigo-dye text-sm'>
                    Where
                  </label>
                  <input
                    type='text'
                    name='where'
                    id='where'
                    className=' w-56 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-xs leading-[22px] ml-3 md:ml-0'
                    placeholder='Town, City, Province, Country'
                    onChange={(e) => setItemsFilter({ ...itemsFilter, location: e.target.value })}
                  />
                  <MapPinIcon className='w-5 h-5 text-gray-400' />
                </div>
              </div>
              <div className='flex justify-center mt-4 lg:mt-6'>
                <button
                  type='submit'
                  className='rounded-md bg-savoy-blue px-24 lg:px-32 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Find Jobs
                </button>
              </div>
            </form>
            {hasJob ? (
              <div className='mt-4'>
                <div className='max-w-7xl mx-auto'>
                  <p className='text-[#6F829B] text-center lg:text-left text-sm pb-5 px-5 lg:px-10'>
                    Jobs available: {!isGetJobsLoading ? jobsItems.length : '0'}
                  </p>
                </div>
                <div className='border-t border-gray-300'></div>
                <div className='max-w-7xl mx-auto'>
                  <div className='lg:flex'>
                    <div className='lg:w-[36%]'>
                      <div className='px-2 py-2 grid md:grid-cols-2 lg:grid-cols-1 md:gap-x-4 lg:gap-x-4 gap-y-6'>
                        <>
                          {!isGetJobsLoading
                            ? jobsItems.map((job: any) => (
                                <div key={job.id}>
                                  <div
                                    className={classNames(
                                      'card border rounded-md p-4 cursor-pointer',
                                      isJobView && selectedJobId === job.id ? 'border-savoy-blue' : 'border-gray-300'
                                    )}
                                    onClick={() => openJobDetails(job.id)}
                                  >
                                    <span className='text-xs text-red-500'>{job.isNew ? 'NEW' : ''}</span>
                                    <div className='flex flex-col'>
                                      <span className='mt-1 ml-1'>
                                        <FileCaseIcon className='h-6 w-6' />
                                      </span>
                                      <div className='ml-0 mt-2'>
                                        <h5 className='text-lg lg:text-xl font-semibold text-indigo-dye'>
                                          {job.title}
                                        </h5>
                                        <h6 className='text-indigo-dye text-sm font-medium mt-1'>{job.company}</h6>
                                        <h6 className='text-indigo-dye text-sm'>{job.location}</h6>
                                        <Link href={`/job-applicant-form/${job.id}`}>
                                          <button className='rounded-md bg-savoy-blue mt-5 mb-4 md:mb-0 lg:mb-4 w-full py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                            Apply Now!
                                          </button>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                  {isJobView && selectedJobId === job.id && (
                                    <div className='lg:border-l lg:border-gray-300 xl:pl-10 xl:pr-5 py-3 lg:w-[64%] lg:hidden block'>
                                      <div
                                        className={classNames(
                                          'card border border-savoy-blue rounded-md sticky top-10',
                                          isJobModalOpen ? '' : 'hidden'
                                        )}
                                      >
                                        <div className='flex justify-end px-3 mt-2'>
                                          <button onClick={closeJobDetails}>
                                            <XMarkIcon className='h-5 w-5 text-indigo-dye' />
                                          </button>
                                        </div>
                                        <JobDetails jobId={selectedJobId} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))
                            : 'Loading jobs...'}
                        </>
                      </div>
                    </div>
                    <div className='lg:border-l lg:border-gray-300 px-2 py-2 hidden lg:block'>
                      <div
                        className={classNames(
                          'card border border-savoy-blue rounded-md sticky top-10',
                          isJobView ? '' : 'hidden'
                        )}
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
            ) : (
              <div className='w-auto h-[220px] md:w-[600px] md:h-[400px] relative block mx-auto mt-8'>
                <Image src={jobIllustration} fill alt='Find job illustration' />
              </div>
            )}
          </div>
        </div>
        {/* <JobDetailsModal open={isJobModal} onClose={closeJobModal} jobId={selectedJobId} />
        <ConfirmModal open={confirmModalOpen} onClose={() => setConfirmModal(false)} /> */}
      </div>
      <SuccessPopAlert
        message='Successfully set-up profile.'
        open={openSuccessAlert}
        onClose={() => setSuccessAlert(false)}
      />
      <SavedModal open={openSavedModal} onClose={() => setSavedModal(false)} />
    </>
  );
};

export default Content;
