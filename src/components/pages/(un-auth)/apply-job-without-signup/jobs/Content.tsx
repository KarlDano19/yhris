'use client';

import { useEffect, useState, useRef, useMemo } from 'react';

import Image from 'next/image';

import JobDetails from './JobDetails';
import JobDetailsModal from './modals/JobDetailsModal';
import useFindJobs, { useGetJobAutocomplete } from './hooks/useFindJobs';
import JobSearchAutocomplete from './components/JobSearchAutocomplete';
import LocationSearchAutocomplete from './components/LocationSearchAutocomplete';
import JobCard from './components/JobCard';

import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import jobIllustration from '@/assets/find-job-illustration.svg';

import classNames from '@/helpers/classNames';

const Content = () => {
  const [hasJob, setJob] = useState(false);
  const [isJobView, setIsJobView] = useState(false);
  const [isJobModal, setJobModal] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  // Pending filter (user input state)
  const [pendingFilter, setPendingFilter] = useState<any>({
    job_title: '',
    location: '',
    locations: [],
  });
  // Applied filter (actual search query that triggers API calls)
  const [appliedFilter, setAppliedFilter] = useState<any>({
    job_title: '',
    location: '',
    locations: [],
  });
  // Debounced search states
  const [debouncedJobTitle, setDebouncedJobTitle] = useState<string>('');
  const [debouncedLocation, setDebouncedLocation] = useState<string>('');
  const [isDebouncingJobTitle, setIsDebouncingJobTitle] = useState<boolean>(false);
  const [isDebouncingLocation, setIsDebouncingLocation] = useState<boolean>(false);
  // Autocomplete states
  const [showJobTitleAutocomplete, setShowJobTitleAutocomplete] = useState(false);
  const [showLocationAutocomplete, setShowLocationAutocomplete] = useState(false);
  const [shouldShowJobTitleAutocomplete, setShouldShowJobTitleAutocomplete] = useState(false);
  const [shouldShowLocationAutocomplete, setShouldShowLocationAutocomplete] = useState(false);
  const [selectedJobTitleIndex, setSelectedJobTitleIndex] = useState(-1);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);
  const [jobTitleAutocompleteLimit, setJobTitleAutocompleteLimit] = useState(20);
  const [locationAutocompleteLimit, setLocationAutocompleteLimit] = useState(20);
  const [isSearching, setIsSearching] = useState(false);
  // Track focus state to control when autocomplete API calls are made
  const [isJobTitleFocused, setIsJobTitleFocused] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  
  const [selectedJobId, setSelectedJobId] = useState<any>();
  const [jobsItems, setJobsItems] = useState<any>([]);
  const previousDataJobsRef = useRef<string>('');
  // Track how many jobs to display (20 per batch, fetches 200 per page)
  const [displayCount, setDisplayCount] = useState<number>(20);
  
  // Separate state for the actual search query (only updates on form submit)
  const [searchQuery, setSearchQuery] = useState<any>({
    job_title: '',
    location: [],
  });
  
  const { 
    data: dataJobs, 
    isLoading: isGetJobsLoading, 
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalRecords
  } = useFindJobs(searchQuery);
  
  // Memoize search parameters for job title autocomplete - only when focused
  const jobTitleSearchParams = useMemo(() => {
    if (!isJobTitleFocused) return null;
    if (shouldShowJobTitleAutocomplete && debouncedJobTitle && debouncedJobTitle.length >= 2) {
      return {
        search_type: 'job_title' as const,
        search: debouncedJobTitle,
        current_page: 1,
      };
    }
    return {
      search_type: 'job_title' as const,
      search: '',
      current_page: 1,
    };
  }, [debouncedJobTitle, shouldShowJobTitleAutocomplete, isJobTitleFocused]);
  
  // Memoize search parameters for location autocomplete - only when focused
  const locationSearchParams = useMemo(() => {
    if (!isLocationFocused) return null;
    if (shouldShowLocationAutocomplete && debouncedLocation && debouncedLocation.length >= 2) {
      return {
        search_type: 'location' as const,
        search: debouncedLocation,
        current_page: 1,
      };
    }
    return {
      search_type: 'location' as const,
      search: '',
      current_page: 1,
    };
  }, [debouncedLocation, shouldShowLocationAutocomplete, isLocationFocused]);
  
  const { 
    data: jobTitleAutocompleteResults, 
    isLoading: isJobTitleAutocompleteLoading 
  } = useGetJobAutocomplete(
    jobTitleSearchParams ? {
      ...jobTitleSearchParams,
      view_type: 'jobs_select'
    } : null
  );
  
  const { 
    data: locationAutocompleteResults, 
    isLoading: isLocationAutocompleteLoading 
  } = useGetJobAutocomplete(
    locationSearchParams ? {
      ...locationSearchParams,
      view_type: 'location_select'
    } : null
  );

  // Debounce job title search
  useEffect(() => {
    if (pendingFilter.job_title && pendingFilter.job_title.length >= 2) {
      setIsDebouncingJobTitle(true);
    } else {
      setIsDebouncingJobTitle(false);
    }

    const timer = setTimeout(() => {
      setDebouncedJobTitle(pendingFilter.job_title);
      setIsDebouncingJobTitle(false);
    }, 2000); // 2 seconds delay

    return () => {
      clearTimeout(timer);
    };
  }, [pendingFilter.job_title]);

  // Debounce location search
  useEffect(() => {
    if (pendingFilter.location && pendingFilter.location.length >= 2) {
      setIsDebouncingLocation(true);
    } else {
      setIsDebouncingLocation(false);
    }

    const timer = setTimeout(() => {
      setDebouncedLocation(pendingFilter.location);
      setIsDebouncingLocation(false);
    }, 2000); // 2 seconds delay

    return () => {
      clearTimeout(timer);
    };
  }, [pendingFilter.location]);

  // Reset selected job when search query changes (not filter changes)
  useEffect(() => {
    setSelectedJobId(null);
    setIsJobView(false);
    setJobModal(false);
    // Reset the ref when search query changes so new data is processed
    previousDataJobsRef.current = '';
    // Reset display count to 20 when search changes
    setDisplayCount(20);
  }, [
    searchQuery.job_title,
    Array.isArray(searchQuery.location)
      ? searchQuery.location.join('|')
      : searchQuery.location,
  ]);
  
  
  // Handle search submission
  const handleSearch = () => {
    const normalizedLocations = pendingFilter.locations.length
      ? pendingFilter.locations
      : pendingFilter.location
        ? [pendingFilter.location]
        : [];
    setIsSearching(true);
    setSearchQuery({
      job_title: pendingFilter.job_title,
      location: normalizedLocations,
    });
    setAppliedFilter({
      job_title: pendingFilter.job_title,
      location: normalizedLocations,
      locations: normalizedLocations,
    });
    setShowJobTitleAutocomplete(false);
    setShowLocationAutocomplete(false);
    setShouldShowJobTitleAutocomplete(false);
    setShouldShowLocationAutocomplete(false);
    setSelectedJobTitleIndex(-1);
    setSelectedLocationIndex(-1);
  };
  
  useEffect(() => {
    if (!isGetJobsLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetJobsLoading, isSearching]);

  useEffect(() => {
    // Create a stable string representation of dataJobs to compare
    const dataJobsString = JSON.stringify(dataJobs?.map((job: any) => job.id) || []);
    
    // Only update if dataJobs actually changed (by comparing job IDs)
    if (previousDataJobsRef.current !== dataJobsString) {
      previousDataJobsRef.current = dataJobsString;
      
      if (dataJobs && dataJobs.length !== 0) {
        setJob(true);
        setJobsItems(dataJobs);
        // Only auto-select first job if no job is currently selected
        if (!selectedJobId && dataJobs[0]) {
          setSelectedJobId(dataJobs[0].id);
          setIsJobView(true);
          setJobModal(true);
        }
      } else {
        setJob(false);
        setJobsItems([]);
        setIsJobView(false);
        setJobModal(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataJobs]);

  const handleLoadMore = () => {
    // Check if there are more jobs in the current fetched batch
    const jobsInCurrentBatch = jobsItems.length;
    const nextDisplayCount = displayCount + 20;
    
    // If we can show more from current batch (haven't shown all 200 from current page)
    if (nextDisplayCount <= jobsInCurrentBatch) {
      // Show next 20 jobs from current batch (client-side pagination)
      setDisplayCount(nextDisplayCount);
    } else if (hasNextPage && !isFetchingNextPage) {
      // We've shown all jobs from current batch, fetch next page (next 200 jobs)
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

  return (
    <>
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`}>
        <div className='px-4 pt-[85px]'>
          <h4 className='text-lg md:text-2xl text-indigo-dye font-bold md:font-semibold'>
            Find a job that&#39;s right for you!
          </h4>
          <div className='h-auto pt-2 mt-0'>
            <form
              className=''
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div className='lg:flex lg:px-4 lg:justify-between md:mt-4'>
                {/* Job Title Search */}
                <JobSearchAutocomplete
                  value={pendingFilter.job_title}
                  onChange={(value) => setPendingFilter({ ...pendingFilter, job_title: value })}
                  debouncedValue={debouncedJobTitle}
                  isDebouncing={isDebouncingJobTitle}
                  autocompleteResults={jobTitleAutocompleteResults}
                  isLoading={isJobTitleAutocompleteLoading}
                  showAutocomplete={showJobTitleAutocomplete && shouldShowJobTitleAutocomplete}
                  selectedIndex={selectedJobTitleIndex}
                  limit={jobTitleAutocompleteLimit}
                  onSelectedIndexChange={setSelectedJobTitleIndex}
                  onLimitChange={setJobTitleAutocompleteLimit}
                  onShowAutocompleteChange={(show) => {
                    setShowJobTitleAutocomplete(show);
                    setShouldShowJobTitleAutocomplete(show);
                  }}
                  onResetLimit={() => setJobTitleAutocompleteLimit(20)}
                  onSearchSubmit={handleSearch}
                  onFocus={() => setIsJobTitleFocused(true)}
                  onBlur={() => setIsJobTitleFocused(false)}
                />
                
                {/* Location Search */}
                <LocationSearchAutocomplete
                  value={pendingFilter.location}
                  onChange={(value) => setPendingFilter({ ...pendingFilter, location: value })}
                  debouncedValue={debouncedLocation}
                  isDebouncing={isDebouncingLocation}
                  autocompleteResults={locationAutocompleteResults}
                  isLoading={isLocationAutocompleteLoading}
                  showAutocomplete={showLocationAutocomplete && shouldShowLocationAutocomplete}
                  selectedIndex={selectedLocationIndex}
                  limit={locationAutocompleteLimit}
                  onSelectedIndexChange={setSelectedLocationIndex}
                  onLimitChange={setLocationAutocompleteLimit}
                  onShowAutocompleteChange={(show) => {
                    setShowLocationAutocomplete(show);
                    setShouldShowLocationAutocomplete(show);
                  }}
                  onResetLimit={() => setLocationAutocompleteLimit(20)}
                  onSearchSubmit={handleSearch}
                  onFocus={() => setIsLocationFocused(true)}
                  onBlur={() => setIsLocationFocused(false)}
                  selectedValues={pendingFilter.locations}
                  onSelectedValuesChange={(values) =>
                    setPendingFilter((prev: any) => ({ ...prev, locations: values }))
                  }
                />
                
                <div className='flex justify-center lg:block mt-5 lg:mt-0'>
                  <button
                    type='submit'
                    className='inline-flex items-center justify-center gap-2 rounded-md bg-savoy-blue px-24 lg:px-11 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    <MagnifyingGlassIcon className='w-5 h-5' />
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
              Jobs available: {!isGetJobsLoading ? totalRecords || jobsItems.length : '0'}
            </p>
          </div>
          <div className='border-t border-gray-300'></div>
          <div className='max-w-7xl px-4 sm:px-6 mx-auto'>
            <div className='px-4 lg:px-5'>
              <div className='lg:flex lg:items-start'>
                <div className='hide-scrollbar lg:border-r lg:border-gray-300 lg:w-[36%] lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto'>
                  <div className='lg:pl-5 lg:pr-10 py-8 lg:py-10 grid md:grid-cols-2 lg:grid-cols-1 md:gap-x-4 lg:gap-x-4 gap-y-6'>
                    <>
                      {!isGetJobsLoading
                        ? jobsItems.slice(0, displayCount).map((job: any) => (
                            <JobCard
                              key={job.id}
                              job={job}
                              isSelected={selectedJobId === job.id}
                              isJobView={isJobView}
                              isJobModalOpen={isJobModalOpen}
                              onJobClick={openJobDetails}
                              onCloseDetails={closeJobDetails}
                            />
                          ))
                        : 'Loading jobs...'}
                    </>
                    {/* Load More Button */}
                    {(displayCount < jobsItems.length || hasNextPage) && (
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
                <div className='hide-scrollbar lg:pl-10 lg:pr-5 py-10 lg:w-[64%] lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto hidden lg:block'>
                  <div
                    className={classNames(
                      'card border border-savoy-blue rounded-md',
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