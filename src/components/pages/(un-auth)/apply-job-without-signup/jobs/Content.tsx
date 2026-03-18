'use client';

import { useEffect, useState, useMemo, useRef } from 'react';

import Image from 'next/image';
import { Tooltip } from 'react-tooltip';

import JobDetails from './JobDetails';
import useFindJobs, { useGetJobAutocomplete } from './hooks/useFindJobs';
import JobSearchAutocomplete from './components/JobSearchAutocomplete';
import LocationSearchAutocomplete from './components/LocationSearchAutocomplete';
import Tabs from './Tabs';
import classNames from '@/helpers/classNames';

import { dummyGigOpportunities, type GigOpportunity } from './hooks/GigOpportunity';
import { dummyTalents, type Talent } from './hooks/HireTalentDummy';

import { XMarkIcon, MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import jobIllustration from '@/assets/find-job-illustration.svg';

const Content = () => {
  // Initialize search section visibility
  const [isSearchSectionVisible, setIsSearchSectionVisible] = useState(true);
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

  // Tab state
  const [activeTab, setActiveTab] = useState<'company-jobs' | 'gig-opportunities' | 'hire-talent'>('company-jobs');

  // Separate state for the actual search query (only updates on form submit)
  const [searchQuery, setSearchQuery] = useState<any>({
    job_title: '',
    location: [],
    page_size: 10, // Page size for pagination
  });

  const {
    data: dataJobs,
    isLoading: isGetJobsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalRecords
  } = useFindJobs(activeTab === 'company-jobs' ? searchQuery : { job_title: '', location: [] });

  // Company Jobs State
  const [hasJob, setJob] = useState(false);
  const [isJobView, setIsJobView] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<any>();
  const [jobsItems, setJobsItems] = useState<any>([]);
  const previousDataJobsRef = useRef<string>('');
  const [displayCount, setDisplayCount] = useState<number>(20);

  // Gig Opportunities State
  const [hasGig, setHasGig] = useState(false);
  const [isGigView, setIsGigView] = useState(false);
  const [isGigModalOpen, setIsGigModalOpen] = useState(false);
  const [selectedGigId, setSelectedGigId] = useState<number | null>(null);
  const [displayCountGig, setDisplayCountGig] = useState<number>(20);
  const [isLoginModalOpenGig, setIsLoginModalOpenGig] = useState(false);

  // Hire Talent State
  const [hasTalent, setHasTalent] = useState(false);
  const [isTalentView, setIsTalentView] = useState(false);
  const [isTalentModalOpen, setIsTalentModalOpen] = useState(false);
  const [selectedTalentId, setSelectedTalentId] = useState<number | null>(null);
  const [displayCountTalent, setDisplayCountTalent] = useState<number>(20);
  const [isLoginModalOpenTalent, setIsLoginModalOpenTalent] = useState(false);
  const [loginModalAction, setLoginModalAction] = useState<'book' | 'message'>('book');

  // State to track counts
  const [gigOpportunitiesCount, setGigOpportunitiesCount] = useState(0);
  const [gigOpportunitiesFilteredCount, setGigOpportunitiesFilteredCount] = useState(0);
  const [hireTalentCount, setHireTalentCount] = useState(0);
  const [hireTalentFilteredCount, setHireTalentFilteredCount] = useState(0);

  // Filter state for each tab
  const [appliedFilters, setAppliedFilters] = useState<any>({
    'company-jobs': {
      jobType: 'All Types',
      workSetup: 'All Setups',
      salaryRange: 'Any Salary',
    },
    'gig-opportunities': {
      category: 'All Categories',
      budget: 'Any Budget',
      duration: 'Any Duration',
    },
    'hire-talent': {
      specialization: 'All Specializations',
      availability: 'Any Availability',
      hourlyRate: 'Any Rate',
    },
  });

  // Job modal state
  const [jobModal, setJobModal] = useState(false);

  // Apply filters to jobs (Company Jobs)
  const filteredJobs = useMemo(() => {
    if (!appliedFilters['company-jobs'] || !jobsItems || jobsItems.length === 0) {
      return jobsItems;
    }

    const filters = appliedFilters['company-jobs'];
    return jobsItems.filter((job: any) => {
      // Filter by job type
      if (filters.jobType !== 'All Types') {
        const jobTypeMap: Record<string, string> = {
          'Full Time': 'full-time',
          'Part Time': 'part-time',
          'Internship/OJT': 'internship',
          'Project-based': 'project-based',
        };
        const jobType = job.employment_type?.toLowerCase() || job.job_type?.toLowerCase() || '';
        const filterType = jobTypeMap[filters.jobType]?.toLowerCase() || '';
        if (jobType !== filterType && filterType !== '') {
          return false;
        }
      }

      // Filter by work setup
      if (filters.workSetup !== 'All Setups') {
        const workSetupMap: Record<string, string> = {
          'On-site': 'on-site',
          'Work from Home': 'remote',
          'Hybrid': 'hybrid',
        };
        const workSetup = job.work_setup?.toLowerCase() || job.setup_preference?.toLowerCase() || '';
        const filterSetup = workSetupMap[filters.workSetup]?.toLowerCase() || '';
        if (workSetup !== filterSetup && filterSetup !== '') {
          return false;
        }
      }

      // Filter by salary range
      if (filters.salaryRange !== 'Any Salary') {
        const salary = job.salary_range || job.expected_salary || job.min_salary || job.max_salary || 0;
        const salaryNum = typeof salary === 'string' ? parseFloat(salary.replace(/[^0-9.]/g, '')) : salary;

        if (filters.salaryRange === 'Below ₱15,000' && salaryNum >= 15000) return false;
        if (filters.salaryRange === '₱15,000 - ₱25,000' && (salaryNum < 15000 || salaryNum > 25000)) return false;
        if (filters.salaryRange === '₱25,000 - ₱35,000' && (salaryNum < 25000 || salaryNum > 35000)) return false;
        if (filters.salaryRange === '₱35,000 - ₱50,000' && (salaryNum < 35000 || salaryNum > 50000)) return false;
        if (filters.salaryRange === '₱50,000 - ₱75,000' && (salaryNum < 50000 || salaryNum > 75000)) return false;
        if (filters.salaryRange === '₱75,000 - ₱100,000' && (salaryNum < 75000 || salaryNum > 100000)) return false;
        if (filters.salaryRange === 'Above ₱100,000' && salaryNum <= 100000) return false;
      }

      return true;
    });
  }, [jobsItems, appliedFilters]);

  // Apply filters to gigs (Gig Opportunities)
  const filteredGigs = useMemo(() => {
    let filtered = [...dummyGigOpportunities];
    const filters = appliedFilters['gig-opportunities'];

    // Filter by category
    if (filters?.category && filters.category !== 'All Categories') {
      filtered = filtered.filter((gig) =>
        gig.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Filter by budget
    if (filters?.budget && filters.budget !== 'Any Budget') {
      filtered = filtered.filter((gig) => {
        const budgetMin = gig.budgetMin;
        const budgetMax = gig.budgetMax;

        if (filters.budget === 'Below ₱5,000') {
          return budgetMax < 5000;
        } else if (filters.budget === '₱5,000 - ₱10,000') {
          return budgetMin >= 5000 && budgetMax <= 10000;
        } else if (filters.budget === '₱10,000 - ₱25,000') {
          return budgetMin >= 10000 && budgetMax <= 25000;
        } else if (filters.budget === '₱25,000 - ₱50,000') {
          return budgetMin >= 25000 && budgetMax <= 50000;
        } else if (filters.budget === 'Above ₱50,000') {
          return budgetMin > 50000;
        }
        return true;
      });
    }

    // Filter by duration
    if (filters?.duration && filters.duration !== 'Any Duration') {
      filtered = filtered.filter((gig) => {
        const durationLower = gig.duration.toLowerCase();
        const filterLower = filters.duration.toLowerCase();

        if (filterLower.includes('less than 1 week')) {
          return durationLower.includes('day') || durationLower.includes('week');
        } else if (filterLower.includes('1-2 weeks')) {
          return durationLower.includes('1') && durationLower.includes('week');
        } else if (filterLower.includes('2-4 weeks')) {
          return durationLower.includes('2') || durationLower.includes('3') || durationLower.includes('4');
        } else if (filterLower.includes('1-3 months')) {
          return durationLower.includes('month');
        } else if (filterLower.includes('more than 3 months')) {
          return durationLower.includes('month');
        }
        return true;
      });
    }

    // Filter by search query
    if (searchQuery?.job_title) {
      const searchLower = searchQuery.job_title.toLowerCase();
      filtered = filtered.filter((gig) => {
        const titleMatch = gig.title.toLowerCase().includes(searchLower);
        const skillsMatch = gig.skills.some((skill) => skill.toLowerCase().includes(searchLower));
        return titleMatch || skillsMatch;
      });
    }

    return filtered;
  }, [appliedFilters, searchQuery]);

  // Apply filters to talents (Hire Talent)
  const filteredTalents = useMemo(() => {
    let filtered = [...dummyTalents];
    const filters = appliedFilters['hire-talent'];

    // Filter by specialization
    if (filters?.specialization && filters.specialization !== 'All Specializations') {
      filtered = filtered.filter((talent) => {
        const titleMatch = talent.title.toLowerCase().includes(filters.specialization.toLowerCase());
        const skillsMatch = talent.skills.some((skill) =>
          skill.toLowerCase().includes(filters.specialization.toLowerCase())
        );
        return titleMatch || skillsMatch;
      });
    }

    // Filter by availability
    if (filters?.availability && filters.availability !== 'Any Availability') {
      filtered = filtered.filter((talent) => {
        if (filters.availability === 'Available Now') {
          return talent.availability === 'Available Now';
        }
        return talent.availability?.includes(filters.availability) || false;
      });
    }

    // Filter by hourly rate
    if (filters?.hourlyRate && filters.hourlyRate !== 'Any Rate') {
      filtered = filtered.filter((talent) => {
        const minRate = talent.hourlyMin;
        const maxRate = talent.hourlyMax;

        if (filters.hourlyRate === 'Below ₱500/hour') {
          return maxRate < 500;
        } else if (filters.hourlyRate === '₱500 - ₱1,000/hour') {
          return minRate >= 500 && maxRate <= 1000;
        } else if (filters.hourlyRate === '₱1,000 - ₱2,000/hour') {
          return minRate >= 1000 && maxRate <= 2000;
        } else if (filters.hourlyRate === '₱2,000 - ₱5,000/hour') {
          return minRate >= 2000 && maxRate <= 5000;
        } else if (filters.hourlyRate === 'Above ₱5,000/hour') {
          return minRate > 5000;
        }
        return true;
      });
    }

    // Filter by location
    if (searchQuery?.location && searchQuery.location.length > 0) {
      filtered = filtered.filter((talent) => {
        return searchQuery.location?.some((loc: string) =>
          talent.location.toLowerCase().includes(loc.toLowerCase())
        );
      });
    }

    // Filter by search query
    if (searchQuery?.job_title) {
      const searchLower = searchQuery.job_title.toLowerCase();
      filtered = filtered.filter((talent) => {
        const titleMatch = talent.title.toLowerCase().includes(searchLower);
        const skillsMatch = talent.skills.some((skill) => skill.toLowerCase().includes(searchLower));
        return titleMatch || skillsMatch;
      });
    }

    return filtered;
  }, [appliedFilters, searchQuery]);

  // Calculate filtered count for company-jobs tab
  const filteredCount = useMemo(() => {
    if (activeTab !== 'company-jobs' || !filteredJobs || filteredJobs.length === 0) {
      return 0;
    }
    return filteredJobs.length;
  }, [filteredJobs, activeTab]);

  // Get current tab counts
  const getTotalCount = () => {
    if (activeTab === 'company-jobs') {
      return !isGetJobsLoading ? totalRecords || 0 : 0;
    } else if (activeTab === 'gig-opportunities') {
      return gigOpportunitiesCount;
    } else if (activeTab === 'hire-talent') {
      return hireTalentCount;
    }
    return 0;
  };

  const getFilteredCount = () => {
    if (activeTab === 'company-jobs') {
      return filteredCount;
    } else if (activeTab === 'gig-opportunities') {
      return gigOpportunitiesFilteredCount;
    } else if (activeTab === 'hire-talent') {
      return hireTalentFilteredCount;
    }
    return 0;
  };

  // Company Jobs Effects
  useEffect(() => {
    if (filteredJobs && filteredJobs.length > 0) {
      setJob(true);
      if (!selectedJobId && filteredJobs[0]) {
        setSelectedJobId(filteredJobs[0].id);
        setIsJobView(true);
      }
    } else if (jobsItems.length === 0) {
      setJob(false);
    }
  }, [filteredJobs, selectedJobId, jobsItems.length]);

  useEffect(() => {
    setSelectedJobId(null);
    setIsJobView(false);
    previousDataJobsRef.current = '';
    setDisplayCount(20);
  }, [
    searchQuery.job_title,
    Array.isArray(searchQuery.location)
      ? searchQuery.location.join('|')
      : searchQuery.location,
  ]);

  // Gig Opportunities Effects
  const totalGigsCount = dummyGigOpportunities.length;

  useEffect(() => {
    if (filteredGigs && filteredGigs.length > 0) {
      setHasGig(true);
      if (!selectedGigId && filteredGigs[0]) {
        setSelectedGigId(filteredGigs[0].id);
        setIsGigView(true);
      }
    } else {
      setHasGig(false);
    }

    setGigOpportunitiesCount(totalGigsCount);
    setGigOpportunitiesFilteredCount(filteredGigs.length);
  }, [filteredGigs, selectedGigId, totalGigsCount]);

  // Hire Talent Effects
  const totalTalentsCount = dummyTalents.length;

  useEffect(() => {
    if (filteredTalents && filteredTalents.length > 0) {
      setHasTalent(true);
      if (!selectedTalentId && filteredTalents[0]) {
        setSelectedTalentId(filteredTalents[0].id);
        setIsTalentView(true);
      }
    } else {
      setHasTalent(false);
    }

    setHireTalentCount(totalTalentsCount);
    setHireTalentFilteredCount(filteredTalents.length);
  }, [filteredTalents, selectedTalentId, totalTalentsCount]);

  useEffect(() => {
    if (activeTab === 'company-jobs' && hasJob) {
      setJob(true);
    } else if (activeTab === 'gig-opportunities' && hasGig) {
      setJob(true);
    } else if (activeTab === 'hire-talent' && hasTalent) {
      setJob(true);
    } else {
      setJob(false);
    }
  }, [activeTab, hasJob, hasGig, hasTalent]);

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
    }, 2000);

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
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [pendingFilter.location]);

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
      page_size: 10,
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
        }
      } else {
        setJob(false);
        setJobsItems([]);
        setIsJobView(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataJobs]);

  // Handle load more button click
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const openJobDetails = (jobId: any) => {
    setSelectedJobId(jobId);
    setIsJobView(true);
    setIsJobModalOpen(true);
  };

  const closeJobDetails = () => {
    setIsJobView(false);
    setIsJobModalOpen(false);
  };

  // Control navbar visibility based on search section state
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      if (isSearchSectionVisible) {
        navbar.style.transform = 'translateY(0)';
        navbar.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        navbar.style.opacity = '1';
        navbar.style.visibility = 'visible';
      } else {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        navbar.style.opacity = '0';
        navbar.style.visibility = 'hidden';
      }
    }
  }, [isSearchSectionVisible]);

  // Gig Opportunities Handlers
  const handleLoadMoreGigs = () => {
    const nextDisplayCount = displayCountGig + 20;
    if (nextDisplayCount <= filteredGigs.length) {
      setDisplayCountGig(nextDisplayCount);
    }
  };

  const openGigDetails = (gigId: number) => {
    setSelectedGigId(gigId);
    setIsGigView(true);
    setIsGigModalOpen(true);
  };

  const closeGigDetails = () => {
    setIsGigView(false);
    setIsGigModalOpen(false);
  };

  const handleSendProposal = () => {
    setIsLoginModalOpenGig(true);
  };

  // Hire Talent Handlers
  const handleLoadMoreTalents = () => {
    const nextDisplayCount = displayCountTalent + 20;
    if (nextDisplayCount <= filteredTalents.length) {
      setDisplayCountTalent(nextDisplayCount);
    }
  };

  const openTalentDetails = (talentId: number) => {
    setSelectedTalentId(talentId);
    setIsTalentView(true);
    setIsTalentModalOpen(true);
  };

  const closeTalentDetails = () => {
    setIsTalentView(false);
    setIsTalentModalOpen(false);
  };

  const handleBookNow = () => {
    setLoginModalAction('book');
    setIsLoginModalOpenTalent(true);
  };

  const selectedGig = filteredGigs.find((g) => g.id === selectedGigId);
  const selectedTalent = filteredTalents.find((t) => t.id === selectedTalentId);

  return (
    <>
      {/* Search Section - Collapsible */}
      <div
        className={classNames(
          'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out overflow-hidden',
          isSearchSectionVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
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

      {/* Toggle Search Visibility */}
      <div className='relative border-t border-gray-300'>
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
          <button
            onClick={() => setIsSearchSectionVisible(!isSearchSectionVisible)}
            className='flex items-center justify-center w-8 h-8 rounded-md bg-savoy-blue text-white shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-savoy-blue transition-all duration-300'
            data-tooltip-id='toggle-search-tooltip'
            data-tooltip-content={isSearchSectionVisible ? 'Hide top section' : 'Show top section'}
            data-tooltip-place='bottom'
            aria-label={isSearchSectionVisible ? 'Hide top section' : 'Show top section'}
          >
            {isSearchSectionVisible ? (
              <ChevronUpIcon className='h-5 w-5' strokeWidth={3} />
            ) : (
              <ChevronDownIcon className='h-5 w-5' strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation and Content */}
      <div className="mt-6">
        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          // Company Jobs Props
          hasJob={hasJob}
          isJobView={isJobView}
          isJobModalOpen={isJobModalOpen}
          selectedJobId={selectedJobId}
          filteredJobs={filteredJobs}
          displayCount={displayCount}
          isGetJobsLoading={isGetJobsLoading}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          openJobDetails={openJobDetails}
          closeJobDetails={closeJobDetails}
          handleLoadMoreJobs={handleLoadMore}
          // Gig Opportunities Props
          hasGig={hasGig}
          isGigView={isGigView}
          isGigModalOpen={isGigModalOpen}
          selectedGigId={selectedGigId}
          filteredGigs={filteredGigs}
          displayCountGig={displayCountGig}
          selectedGig={selectedGig}
          openGigDetails={openGigDetails}
          closeGigDetails={closeGigDetails}
          handleLoadMoreGigs={handleLoadMoreGigs}
          handleSendProposal={handleSendProposal}
          isLoginModalOpenGig={isLoginModalOpenGig}
          setIsLoginModalOpenGig={setIsLoginModalOpenGig}
          // Hire Talent Props
          hasTalent={hasTalent}
          isTalentView={isTalentView}
          isTalentModalOpen={isTalentModalOpen}
          selectedTalentId={selectedTalentId}
          filteredTalents={filteredTalents}
          displayCountTalent={displayCountTalent}
          selectedTalent={selectedTalent}
          openTalentDetails={openTalentDetails}
          closeTalentDetails={closeTalentDetails}
          handleLoadMoreTalents={handleLoadMoreTalents}
          handleBookNow={handleBookNow}
          isLoginModalOpenTalent={isLoginModalOpenTalent}
          setIsLoginModalOpenTalent={setIsLoginModalOpenTalent}
          loginModalAction={loginModalAction}
          // Filter Props
          filteredCount={getFilteredCount()}
          totalRecords={totalRecords}
          filters={appliedFilters[activeTab]}
          onFiltersChange={(filters: any) => {
            setAppliedFilters((prev: any) => ({
              ...prev,
              [activeTab]: filters
            }));
          }}
          onApplyFilters={(filters: any) => {
            setAppliedFilters((prev: any) => ({
              ...prev,
              [activeTab]: filters
            }));
          }}
        />
      </div>

      <Tooltip id='toggle-search-tooltip' />
    </>
  );
};

export default Content;
