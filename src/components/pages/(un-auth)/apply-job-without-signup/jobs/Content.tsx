'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import JobDetails from './JobDetails';
import JobDetailsModal from './modals/JobDetailsModal';
import useFindJobs from './hooks/useFindJobs';
import JobSearchAutocomplete from '@/components/JobSearchAutocomplete';
import LocationSearchAutocomplete from '@/components/LocationSearchAutocomplete';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import jobIllustration from '@/assets/find-job-illustration.svg';
import FileCaseIcon from '@/svg/FileCaseIcon';
import classNames from '@/helpers/classNames';

const Content = () => {
  const [hasJob, setJob] = useState(false);
  const [isJobView, setIsJobView] = useState(false);
  const [isJobModal, setJobModal] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [itemsFilter, setItemsFilter] = useState<any>({
    job_title: '',
    location: '',
  });
  const [selectedJobId, setSelectedJobId] = useState<any>();
  const [jobsItems, setJobsItems] = useState<any>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const { data: dataJobs, isLoading: isGetJobsLoading, refetch, searchWithFilter } = useFindJobs(itemsFilter);

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

  return (
    <>
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`}>
        <div className='px-4 pt-24'>
          <h4 className='text-lg md:text-2xl text-indigo-dye font-bold md:font-semibold'>
            Find a job that&#39;s right for you!
          </h4>
          <div className='h-auto pt-7 mt-0'>
            <form
              className=''
              onSubmit={(e) => {
                e.preventDefault();
                refetch();
              }}
            >
              <div className='lg:flex lg:px-4 lg:justify-between md:mt-4'>
                <div className='w-full lg:w-[39%]'>
                  <JobSearchAutocomplete
                    value={itemsFilter.job_title}
                    onChange={(value) => setItemsFilter({ ...itemsFilter, job_title: value })}
                    placeholder='Enter job title, company, or keywords'
                    isLoading={false}
                    onSearch={async (searchValue?: string) => {
                      setShowAutocomplete(false);
                      try {
                        // Use the searchValue if provided (from suggestion click), otherwise use current filter
                        const searchFilter = searchValue ? { ...itemsFilter, job_title: searchValue } : itemsFilter;
                        const results = await searchWithFilter(searchFilter);
                        // Update the jobs list with search results
                        if (results && results.length !== 0) {
                          setJob(true);
                          setJobsItems(results);
                          setSelectedJobId(results[0].id);
                          setIsJobView(true);
                          setJobModal(true);
                        } else {
                          setJobsItems([]);
                          setIsJobView(false);
                          setJobModal(false);
                        }
                      } catch (error) {
                        console.error('Search error:', error);
                      }
                    }}
                    onShowAutocomplete={() => setShowAutocomplete(true)}
                    suggestions={showAutocomplete ? (() => {
                      if (!dataJobs || dataJobs.length === 0) return [];
                      
                      const suggestions = new Set();
                      
                      // Add job titles only
                      dataJobs.forEach((job: any) => {
                        if (job.title) suggestions.add(job.title);
                      });
                      
                      // Add job types
                      dataJobs.forEach((job: any) => {
                        if (job.job_type) suggestions.add(job.job_type);
                      });
                      
                      // Add work setup
                      dataJobs.forEach((job: any) => {
                        if (job.work_setup) suggestions.add(job.work_setup);
                      });
                      
                      // Add schedule if available
                      dataJobs.forEach((job: any) => {
                        if (job.schedule) suggestions.add(job.schedule);
                      });
                      
                      return Array.from(suggestions).filter((suggestion): suggestion is string => typeof suggestion === 'string');
                    })() : []}
                  />
                </div>
                <div className='w-full lg:w-[39%] mt-3 lg:mt-0'>
                  <LocationSearchAutocomplete
                    value={itemsFilter.location}
                    onChange={(value) => setItemsFilter({ ...itemsFilter, location: value })}
                    placeholder='Town, City, Province, Country'
                    isLoading={false}
                    onSearch={async (searchValue?: string) => {
                      setShowAutocomplete(false);
                      try {
                        // Use the searchValue if provided (from suggestion click), otherwise use current filter
                        const searchFilter = searchValue ? { ...itemsFilter, location: searchValue } : itemsFilter;
                        const results = await searchWithFilter(searchFilter);
                        // Update the jobs list with search results
                        if (results && results.length !== 0) {
                          setJob(true);
                          setJobsItems(results);
                          setSelectedJobId(results[0].id);
                          setIsJobView(true);
                          setJobModal(true);
                        } else {
                          setJobsItems([]);
                          setIsJobView(false);
                          setJobModal(false);
                        }
                      } catch (error) {
                        console.error('Search error:', error);
                      }
                    }}
                    onShowAutocomplete={() => setShowAutocomplete(true)}
                    suggestions={showAutocomplete ? (() => {
                      if (!dataJobs || dataJobs.length === 0) return [];
                      
                      const suggestions = new Set();
                      
                      // Add job locations (general location)
                      dataJobs.forEach((job: any) => {
                        if (job.location) suggestions.add(job.location);
                      });
                      
                      // Add specific advertise_to locations for more granular search
                      dataJobs.forEach((job: any) => {
                        if (job.advertise_to) suggestions.add(job.advertise_to);
                      });
                      
                      // Add common Philippine cities and provinces for better coverage
                      const commonLocations = [
                        'Metro Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong', 'San Juan', 'Marikina',
                        'Cebu City', 'Davao City', 'Iloilo City', 'Bacolod', 'Cagayan de Oro', 'Zamboanga City',
                        'Baguio', 'Dagupan', 'Angeles City', 'Olongapo', 'Batangas City', 'Lucena', 'Naga',
                        'Legazpi', 'Puerto Princesa', 'Iloilo', 'Roxas City', 'Kalibo', 'Boracay',
                        'Tacloban', 'Ormoc', 'Calbayog', 'Catbalogan', 'Dumaguete', 'Tagbilaran',
                        'Butuan', 'Surigao', 'Tandag', 'Cotabato', 'General Santos', 'Koronadal',
                        'Dipolog', 'Pagadian', 'Ozamiz', 'Iligan', 'Valencia', 'Malaybalay',
                        'Kidapawan', 'Isulan', 'Tacurong', 'Sultan Kudarat', 'South Cotabato',
                        'North Cotabato', 'Maguindanao', 'Lanao del Sur', 'Lanao del Norte',
                        'Misamis Oriental', 'Misamis Occidental', 'Zamboanga del Norte',
                        'Zamboanga del Sur', 'Zamboanga Sibugay', 'Basilan', 'Sulu', 'Tawi-Tawi'
                      ];
                      
                      commonLocations.forEach(location => suggestions.add(location));
                      
                      return Array.from(suggestions).filter((suggestion): suggestion is string => typeof suggestion === 'string');
                    })() : []}
                  />
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
                <div className='lg:w-[36%] overflow-y-auto max-h-screen'>
                  <div className='lg:pl-5 lg:pr-10 py-8 lg:py-10 grid md:grid-cols-2 lg:grid-cols-1 md:gap-x-4 lg:gap-x-4 gap-y-6'>
                    <>
                      {!isGetJobsLoading
                        ? jobsItems.map((job: any) => (
                            <>
                              <div
                                key={job.id}
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
                                    <h5 className='text-lg lg:text-xl font-semibold text-indigo-dye'>{job.title}</h5>
                                    <h6 className='text-indigo-dye text-sm font-medium mt-1'>{job.company}</h6>
                                    <h6 className='text-indigo-dye text-sm'>{job.location}</h6>
                                    <Link href={`/job-app-form/${job.id}`}>
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
                            </>
                          ))
                        : 'Loading jobs...'}
                    </>
                  </div>
                </div>
                <div className='lg:border-l lg:border-gray-300 lg:pl-10 lg:pr-5 py-10 lg:w-[64%] hidden lg:block'>
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
        </div>
      ) : (
        <div className='w-auto h-[220px] md:w-[600px] md:h-[400px] relative block mx-auto mt-8'>
          <Image src={jobIllustration} fill alt='Find job illustration' />
        </div>
      )}
    </>
  );
};

export default Content;