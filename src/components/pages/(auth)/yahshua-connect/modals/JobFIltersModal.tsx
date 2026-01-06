import { useState, useEffect, useMemo } from 'react';

import Modal from '../components/Modal';
import { useGetJobAutocomplete } from '../tabs/personal-mode/pages/jobs/hooks/useFindJobs';
import JobSearchAutocomplete from '../components/JobSearchAutocomplete';
import LocationSearchAutocomplete from '../components/LocationSearchAutocomplete';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface JobFilters {
  job_title?: string;
  location?: string[];
}

interface JobFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: JobFilters;
  onApplyFilters: (filters: JobFilters) => void;
}

const JobFiltersModal = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}: JobFiltersModalProps) => {
  // Pending filter (user input state)
  const [pendingFilter, setPendingFilter] = useState<JobFilters>({
    job_title: filters.job_title || '',
    location: filters.location || [],
  });

  // Local state for location input
  const [locationInput, setLocationInput] = useState<string>('');

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

  // Track focus state to control when autocomplete API calls are made
  const [isJobTitleFocused, setIsJobTitleFocused] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  // Reset pending filter when modal opens or filters prop changes
  useEffect(() => {
    if (isOpen) {
      setPendingFilter({
        job_title: filters.job_title || '',
        location: filters.location || [],
      });
      setLocationInput('');
    }
  }, [isOpen, filters]);

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

  const jobTitleAutocompleteQuery = useGetJobAutocomplete(
    jobTitleSearchParams
      ? {
          ...jobTitleSearchParams,
          view_type: 'jobs_select',
        }
      : null
  );

  const locationAutocompleteQuery = useGetJobAutocomplete(
    locationSearchParams
      ? {
          ...locationSearchParams,
          view_type: 'location_select',
        }
      : null
  );

  const jobTitleAutocompleteResults = jobTitleAutocompleteQuery?.data;
  const isJobTitleAutocompleteLoading = jobTitleAutocompleteQuery?.isLoading || false;
  const locationAutocompleteResults = locationAutocompleteQuery?.data;
  const isLocationAutocompleteLoading = locationAutocompleteQuery?.isLoading || false;

  // Debounce job title search
  useEffect(() => {
    if (pendingFilter.job_title && pendingFilter.job_title.length >= 2) {
      setIsDebouncingJobTitle(true);
    } else {
      setIsDebouncingJobTitle(false);
    }

    const timer = setTimeout(() => {
      setDebouncedJobTitle(pendingFilter.job_title || '');
      setIsDebouncingJobTitle(false);
    }, 2000); // 2 seconds delay

    return () => {
      clearTimeout(timer);
    };
  }, [pendingFilter.job_title]);

  // Debounce location search
  useEffect(() => {
    if (locationInput && locationInput.length >= 2) {
      setIsDebouncingLocation(true);
    } else {
      setIsDebouncingLocation(false);
    }

    const timer = setTimeout(() => {
      setDebouncedLocation(locationInput);
      setIsDebouncingLocation(false);
    }, 2000); // 2 seconds delay

    return () => {
      clearTimeout(timer);
    };
  }, [locationInput]);

  const handleSearch = () => {
    onApplyFilters(pendingFilter);
    onClose();
  };

  const handleClear = () => {
    setPendingFilter({
      job_title: '',
      location: [],
    });
    setLocationInput('');
    onApplyFilters({
      job_title: '',
      location: [],
    });
  };

  const footerContent = (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={handleClear}
        className="px-6 py-2.5 text-gray-700 font-medium hover:text-gray-900 transition-colors"
      >
        Clear All
      </button>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 border-2 border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSearch}
          className="px-6 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors flex items-center gap-2"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Jobs"
      size="2xl"
      footerContent={footerContent}
    >
      <div className="space-y-4">
        {/* Job Title Search */}
        <div className="[&>div]:!w-full [&_div.flex.items-center]:!justify-between [&_div.flex.items-center]:!gap-3">
          <JobSearchAutocomplete
            value={pendingFilter.job_title || ''}
            onChange={(value) =>
              setPendingFilter({ ...pendingFilter, job_title: value })
            }
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
            label="Job Title"
            placeholder="Enter job title, company, or keywords"
            inputClassName="flex-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-sm"
          />
        </div>

        {/* Location Search */}
        <div className="[&>div]:!w-full [&>div]:!mt-0 [&_div.flex.items-center]:!gap-3">
          <LocationSearchAutocomplete
            value={locationInput}
            onChange={(value) => setLocationInput(value)}
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
            selectedValues={pendingFilter.location || []}
            onSelectedValuesChange={(values) =>
              setPendingFilter((prev) => ({ ...prev, location: values }))
            }
            label="Location"
            placeholder="Enter locations, country"
            inputClassName="flex-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-sm"
          />
        </div>
      </div>
    </Modal>
  );
};

export default JobFiltersModal;

