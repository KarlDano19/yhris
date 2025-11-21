'use client';

import { useState, useEffect, useRef } from 'react';

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
import useGetApplicantProfile from '@/components/hooks/useGetApplicantProfile';
import JobSearchAutocomplete from '@/components/JobSearchAutocomplete';
import LocationSearchAutocomplete from '@/components/LocationSearchAutocomplete';

import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
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
  // Separate state for the actual search query (only updates on form submit)
  const [searchQuery, setSearchQuery] = useState<any>({
    job_title: '',
    location: '',
  });
  const [selectedJobId, setSelectedJobId] = useState<any>();
  const [jobsItems, setJobsItems] = useState<any>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const hasAutoSelectedRef = useRef(false);
  const previousDataJobsRef = useRef<string>('');
  const { data: applicantDetails, isLoading: isProfileLoading } = useGetApplicantProfile();
  const { 
    data: dataJobs, 
    isLoading: isGetJobsLoading, 
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalRecords
  } = useFindJobs(searchQuery);
  
  // Check if profile exists to show toggle button
  const hasProfile = !isProfileLoading && applicantDetails;

  // Reset selected job when search query changes (not filter changes)
  useEffect(() => {
    setSelectedJobId(null);
    setIsJobView(false);
    setJobModal(false);
    hasAutoSelectedRef.current = false; // Reset auto-select flag when search changes
    previousDataJobsRef.current = ''; // Reset data comparison when search changes
  }, [searchQuery.job_title, searchQuery.location]);

  useEffect(() => {
    // Create a stable string representation to compare actual content, not reference
    const dataJobsString = JSON.stringify(dataJobs?.map((job: any) => job?.id) || []);
    
    // Only update if the actual data content changed (not just the array reference)
    if (previousDataJobsRef.current !== dataJobsString) {
      previousDataJobsRef.current = dataJobsString;
      
      const hasValidData = Array.isArray(dataJobs) && dataJobs.length > 0;
      
      if (hasValidData) {
        setJob(true);
        setJobsItems(dataJobs);
        // Only auto-select first job if we haven't already auto-selected for this data set
        if (!hasAutoSelectedRef.current && dataJobs[0]?.id) {
          setSelectedJobId(dataJobs[0].id);
          setIsJobView(true);
          setJobModal(true);
          hasAutoSelectedRef.current = true; // Mark as auto-selected
        }
      } else if (!isGetJobsLoading) {
        // Only clear when not loading to avoid premature clearing
        setJobsItems([]);
        setJob(false);
        setIsJobView(false);
        setJobModal(false);
        hasAutoSelectedRef.current = false; // Reset when clearing
      }
    }
  }, [dataJobs, isGetJobsLoading]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

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
        <div className='relative'>
          {/* Sidebar Toggle Button - Only show when profile exists */}
          {hasProfile && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={classNames(
                'hidden lg:flex absolute top-8 z-20 items-center justify-center w-8 h-8 rounded-md bg-savoy-blue text-white shadow-lg hover:bg-indigo-600 transition-all duration-300',
                isSidebarCollapsed ? 'left-4' : 'left-[calc(33.333%-1rem)] -ml-4'
              )}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRightIcon className='h-5 w-5' strokeWidth={3} />
              ) : (
                <ChevronLeftIcon className='h-5 w-5' strokeWidth={3} />
              )}
            </button>
          )}
          <div className={classNames(
            'grid grid-cols-1 md:grid-cols-8 lg:grid-cols-6 gap-x-6 lg:px-4 py-8 transition-all duration-300',
            isSidebarCollapsed && 'lg:grid-cols-1'
          )}>
            <div className={classNames(
              'md:col-span-3 lg:col-span-2 transition-all duration-300 overflow-hidden',
              isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-h-0' : 'lg:w-auto lg:opacity-100'
            )}>
              <CardProfile />
              <CardRecentApp />
            </div>
            <div className={classNames(
              'bg-white border border-gray-300 h-auto rounded-md shadow pt-7 mt-8 md:mt-0 transition-all duration-300',
              isSidebarCollapsed ? 'md:col-span-8 lg:col-span-6 lg:ml-12' : 'md:col-span-5 lg:col-span-4'
            )}>
            <form
              className='px-5'
              onSubmit={(e) => {
                e.preventDefault();
                // Update search query to trigger fetch
                setSearchQuery({ ...itemsFilter });
              }}
            >
              <h4 className='text-lg md:text-2xl text-indigo-dye font-bold md:font-semibold'>
                Find a job that&#39;s right for you!
              </h4>
              <div className='lg:flex lg:justify-between mt-5'>
                <div className='w-full lg:w-[48%]'>
                  <JobSearchAutocomplete
                    value={itemsFilter.job_title}
                    onChange={(value) => setItemsFilter({ ...itemsFilter, job_title: value })}
                    placeholder='Enter job title, company, or keywords'
                    isLoading={false}
                    onSearch={async (searchValue?: string) => {
                      setShowAutocomplete(false);
                      // Update filter and trigger search by updating searchQuery
                      const searchFilter = searchValue ? { ...itemsFilter, job_title: searchValue } : itemsFilter;
                      setItemsFilter(searchFilter);
                      setSearchQuery(searchFilter);
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
                <div className='w-full lg:w-[48%] mt-3 lg:mt-0'>
                  <LocationSearchAutocomplete
                    value={itemsFilter.location}
                    onChange={(value) => setItemsFilter({ ...itemsFilter, location: value })}
                    placeholder='Town, City, Province, Country'
                    isLoading={false}
                    onSearch={async (searchValue?: string) => {
                      setShowAutocomplete(false);
                      // Update filter and trigger search by updating searchQuery
                      const searchFilter = searchValue ? { ...itemsFilter, location: searchValue } : itemsFilter;
                      setItemsFilter(searchFilter);
                      setSearchQuery(searchFilter);
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
                    Jobs available: {!isGetJobsLoading ? totalRecords || jobsItems.length : '0'}
                  </p>
                </div>
                <div className='border-t border-gray-300'></div>
                <div className='max-w-7xl mx-auto'>
                  <div className='lg:flex'>
                    <div className='lg:w-[36%] overflow-y-auto max-h-screen'>
                      <div className='px-2 py-2 grid md:grid-cols-2 lg:grid-cols-1 md:gap-x-4 lg:gap-x-4 gap-y-6'>
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
                                      <Link href={`/job-applicant-form/${job.id}`} onClick={(e) => e.stopPropagation()}>
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
                        {/* Load More Button */}
                        {hasNextPage && (
                          <div className="flex justify-center py-6">
                            <button
                              onClick={handleLoadMore}
                              disabled={isFetchingNextPage}
                              className="rounded-md bg-savoy-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isFetchingNextPage ? (
                                <span className="flex items-center">
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Loading...
                                </span>
                              ) : (
                                'Load More Jobs'
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='lg:border-l lg:border-gray-300 px-2 py-2 hidden lg:block lg:w-[64%]'>
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
