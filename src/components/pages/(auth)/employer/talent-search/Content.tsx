'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import useGetApplicantItemsList, { buildSearchQuery } from './hook/useGetApplicantItems';
import CustomToast from '@/components/CustomToast';
import useTagSearch from '@/components/hooks/useTagSearch';
import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';
import ImageBackground from '@/assets/talent-search/Talent-Search-Background.png';
import ImageBackground3 from '@/assets/talent-search/Talent_Search_Image_3.png';
import ImageBackground4 from '@/assets/talent-search/Talent_Search_Image_4.png';
import ImageBackground5 from '@/assets/talent-search/Talent_Search_Man_1.png';

import useGetApplicantFavorites from './hook/favorites/useGetApplicantFavorites';
import useAddApplicantFavorite from './hook/favorites/useAddApplicantFavorite';
import useRemoveApplicantFavorite from './hook/favorites/useRemoveApplicantFavorite';
import useSeedApplicants from './hook/useSeedApplicants';
import useUnseedApplicants from './hook/useUnseedApplicants';
import SeederButton from '@/components/SeederButton';
import ApplicantProfileModal from './modal/ApplicantProfileModal';
import CompareApplicantsModal from './modal/CompareApplicantsModal';
import FilterModal from './modal/FilterModal';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import StarIcon from '@heroicons/react/24/outline/StarIcon';
import StarFilledIcon from '@heroicons/react/24/solid/StarIcon';
import BookmarkIcon from '@heroicons/react/24/outline/BookmarkIcon';
import BookmarkFilledIcon from '@heroicons/react/24/solid/BookmarkIcon';

type T_ModalData = {
  id: number;
  open: boolean;
};

type T_CompareModalData = {
  applicantIds: number[];
  open: boolean;
};

// Local storage keys
const STORAGE_KEYS = {
  SEARCH_FILTERS: 'talent-search-filters',
  SEARCH_TAGS: 'talent-search-tags',
  STARRED_TAGS: 'talent-search-starred-tags',
  SEARCH_INPUT: 'talent-search-input',
  HAS_SEARCHED: 'talent-search-has-searched',
};

const Content = () => {
  const [searchInput, setSearchInput] = useState('');
  const [starredTags, setStarredTags] = useState<Set<string>>(new Set());
  const [isApplicantProfileModalOpen, setIsApplicantProfileModalOpen] = useState<T_ModalData | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<T_CompareModalData | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<Set<number>>(new Set());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    location: string[];
    gender: string;
    salary: string;
  }>({
    search: '',
    location: [],
    gender: '',
    salary: '',
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Helper function to get the most recent work experience
  const getMostRecentWorkExperience = (workExperiences: any[]) => {
    if (!workExperiences || workExperiences.length === 0) {
      return null;
    }

    return workExperiences.reduce((mostRecent, current) => {
      // Check if current experience is ongoing (Present)
      const currentIsPresent =
        current.dateTo === 'Present' || current.dateTo === 'present' || current.dateTo === '' || !current.dateTo;

      const mostRecentIsPresent =
        mostRecent.dateTo === 'Present' ||
        mostRecent.dateTo === 'present' ||
        mostRecent.dateTo === '' ||
        !mostRecent.dateTo;

      // If current is present and mostRecent is not, current is more recent
      if (currentIsPresent && !mostRecentIsPresent) {
        return current;
      }

      // If mostRecent is present and current is not, mostRecent is more recent
      if (mostRecentIsPresent && !currentIsPresent) {
        return mostRecent;
      }

      // If both are present, compare start dates (more recent start date wins)
      if (currentIsPresent && mostRecentIsPresent) {
        const currentStartDate = new Date(current.dateFrom);
        const mostRecentStartDate = new Date(mostRecent.dateFrom);
        return currentStartDate > mostRecentStartDate ? current : mostRecent;
      }

      // If neither is present, compare end dates
      const currentEndDate = new Date(current.dateTo);
      const mostRecentEndDate = new Date(mostRecent.dateTo);

      return currentEndDate > mostRecentEndDate ? current : mostRecent;
    });
  };

  // Helper component to display applicant avatar with fallback
  const ApplicantAvatar = ({ applicant, size = 100 }: { applicant: any; size?: number }) => {
    const [imageError, setImageError] = useState(false);

    if (!applicant.photo || imageError) {
      return (
        <PlaceholderAvatar
          width={size}
          height={size}
          firstName={applicant.firstname}
          lastName={applicant.lastname}
          className='flex-shrink-0'
        />
      );
    }

    return (
      <Image
        src={applicant.photo}
        alt={`${applicant.firstname} ${applicant.lastname}`}
        width={size}
        height={size}
        className='rounded-xl object-cover flex-shrink-0'
        onError={() => setImageError(true)}
      />
    );
  };

  const {
    tagsSearch,
    setTagsSearch,
    handleKeyDown: originalHandleKeyDown,
    handleRemoveTag: removeTagFromHook,
  } = useTagSearch(searchInput, setSearchInput, []);

  // Use the hook to fetch applicants with infinite scrolling
  const {
    data: applicants,
    totalRecords,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useGetApplicantItemsList(filters);

  // FAVORITES HOOKS
  const { data: favoriteApplicants, refetch: refetchFavorites } = useGetApplicantFavorites();
  const addFavoriteMutation = useAddApplicantFavorite();
  const removeFavoriteMutation = useRemoveApplicantFavorite();
  const seedApplicantsMutation = useSeedApplicants();
  const unseedApplicantsMutation = useUnseedApplicants();

  // Load saved state from localStorage on component mount
  useEffect(() => {
    try {
      let shouldShowResults = false;

      // Load filters
      const savedFilters = localStorage.getItem(STORAGE_KEYS.SEARCH_FILTERS);
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
        // Check if there are any active filters
        if (parsedFilters.search || parsedFilters.location.length > 0 || parsedFilters.gender || parsedFilters.salary) {
          shouldShowResults = true;
        }
      }

      // Load tags
      const savedTags = localStorage.getItem(STORAGE_KEYS.SEARCH_TAGS);
      if (savedTags) {
        const parsedTags = JSON.parse(savedTags);
        setTagsSearch(parsedTags);
        if (parsedTags.length > 0) {
          shouldShowResults = true;
        }
      }

      // Load starred tags
      const savedStarredTags = localStorage.getItem(STORAGE_KEYS.STARRED_TAGS);
      if (savedStarredTags) {
        const parsedStarredTags = JSON.parse(savedStarredTags);
        setStarredTags(new Set(parsedStarredTags));
        if (parsedStarredTags.length > 0) {
          shouldShowResults = true;
        }
      }

      // Load search input
      const savedSearchInput = localStorage.getItem(STORAGE_KEYS.SEARCH_INPUT);
      if (savedSearchInput) {
        setSearchInput(savedSearchInput);
      }

      // Load hasSearched state or set it based on whether there are active filters
      const savedHasSearched = localStorage.getItem(STORAGE_KEYS.HAS_SEARCHED);
      if (savedHasSearched) {
        const parsedHasSearched = JSON.parse(savedHasSearched);
        setHasSearched(parsedHasSearched || shouldShowResults);
      } else if (shouldShowResults) {
        // If no saved hasSearched state but we have filters, show results
        setHasSearched(true);
      }
    } catch (error) {
      console.error('Error loading saved search state:', error);
    }
  }, [setTagsSearch]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_FILTERS, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  }, [filters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_TAGS, JSON.stringify(tagsSearch));
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  }, [tagsSearch]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STARRED_TAGS, JSON.stringify(Array.from(starredTags)));
    } catch (error) {
      console.error('Error saving starred tags:', error);
    }
  }, [starredTags]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_INPUT, searchInput);
    } catch (error) {
      console.error('Error saving search input:', error);
    }
  }, [searchInput]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_SEARCHED, JSON.stringify(hasSearched));
    } catch (error) {
      console.error('Error saving hasSearched state:', error);
    }
  }, [hasSearched]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than 300px
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Clear saved state function
  const clearSavedState = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SEARCH_FILTERS);
      localStorage.removeItem(STORAGE_KEYS.SEARCH_TAGS);
      localStorage.removeItem(STORAGE_KEYS.STARRED_TAGS);
      localStorage.removeItem(STORAGE_KEYS.SEARCH_INPUT);
      localStorage.removeItem(STORAGE_KEYS.HAS_SEARCHED);
    } catch (error) {
      console.error('Error clearing saved state:', error);
    }
  };

  const isApplicantFavorited = (applicantId: number) =>
    favoriteApplicants?.some((fav: any) => fav.applicant?.id === applicantId);

  const handleToggleStar = (tag: string) => {
    const newStarredTags = new Set(starredTags);
    if (newStarredTags.has(tag)) {
      newStarredTags.delete(tag);
    } else {
      newStarredTags.add(tag);
    }
    setStarredTags(newStarredTags);

    // Update search query after toggling star
    const searchQuery = buildSearchQuery(tagsSearch, newStarredTags);
    const newFilters = {
      ...filters,
      search: searchQuery,
    };

    setFilters(newFilters);

    // Reset hasSearched if all filters are cleared
    if (!searchQuery && newFilters.location.length === 0 && !newFilters.gender && !newFilters.salary) {
      setHasSearched(false);
    }
  };

  const handleSearch = () => {
    // Mark that search has been performed
    setHasSearched(true);

    // Add current input as a tag if it's not empty
    let updatedTags = tagsSearch;
    if (searchInput.trim() && !tagsSearch.includes(searchInput.trim())) {
      updatedTags = [...tagsSearch, searchInput.trim()];
      setTagsSearch(updatedTags);
      setSearchInput('');
    }

    // Build search query from all tags (including the new one if added)
    const searchQuery = buildSearchQuery(updatedTags, starredTags);

    // Update filters with new search query while preserving other filters
    setFilters((prev) => ({
      ...prev,
      search: searchQuery,
    }));
  };

  const handleRemoveTag = (tag: string) => {
    // Remove from starred tags if it was starred
    const newStarredTags = new Set(starredTags);
    newStarredTags.delete(tag);
    setStarredTags(newStarredTags);

    // Remove from tags
    const newTags = tagsSearch.filter((t) => t !== tag);
    setTagsSearch(newTags);

    // Update search query after removing tag
    const searchQuery = buildSearchQuery(newTags, newStarredTags);
    const newFilters = {
      ...filters,
      search: searchQuery,
    };

    setFilters(newFilters);

    // Reset hasSearched if all filters are cleared
    if (!searchQuery && newFilters.location.length === 0 && !newFilters.gender && !newFilters.salary) {
      setHasSearched(false);
    }
  };

  // Custom key handler for search input
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Enter key triggers search
      event.preventDefault();
      handleSearch();
    } else if (event.key === 'Tab' || event.key === ',') {
      // Tab and comma add chips
      event.preventDefault();
      const newTagSearch = searchInput.trim();
      if (
        newTagSearch !== '' &&
        !tagsSearch.some((tagSearch) => tagSearch.toLowerCase() === newTagSearch.toLowerCase())
      ) {
        setTagsSearch([...tagsSearch, newTagSearch]);
        setSearchInput('');
      }
    }
  };

  const handleSelectApplicant = (applicantId: number) => {
    const newSelected = new Set(selectedApplicants);
    if (newSelected.has(applicantId)) {
      newSelected.delete(applicantId);
    } else {
      newSelected.add(applicantId);
    }
    setSelectedApplicants(newSelected);
  };

  const handleCompareSelected = () => {
    const selectedArray = Array.from(selectedApplicants);
    if (selectedArray.length >= 2) {
      setIsCompareModalOpen({
        applicantIds: selectedArray,
        open: true,
      });
    }
  };

  const clearSelection = () => {
    setSelectedApplicants(new Set());
  };

  const handleFilterUpdate = (filterData: { location: string[]; gender: string; salary: string }) => {
    // Mark that search has been performed (when filters are applied)
    setHasSearched(true);

    // Build search query from current tags if any exist
    const searchQuery = buildSearchQuery(tagsSearch, starredTags);

    // Update filters once with all the data
    setFilters({
      location: filterData.location,
      gender: filterData.gender,
      salary: filterData.salary,
      search: searchQuery, // Keep existing search query
    });

    setIsFilterModalOpen(false);
  };

  const handleToggleBookmark = (applicantId: number) => {
    // Hide the specific tooltip for this bookmark
    const tooltipElement = document.querySelector(`[data-tooltip-id="bookmark-tooltip-${applicantId}"]`);
    if (tooltipElement) {
      // Trigger mouseleave to hide the tooltip
      tooltipElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    }

    if (isApplicantFavorited(applicantId)) {
      removeFavoriteMutation.mutate(applicantId, {
        onSuccess: () => {
          refetchFavorites();
          toast.custom((t) => <CustomToast message='Removed from favorites.' type='error' />, { duration: 4000 });
        },
        onError: (error: any) => {
          toast.custom(
            (t) => <CustomToast message={error?.toString() || 'Failed to remove favorite.'} type='error' />,
            { duration: 4000 }
          );
        },
      });
    } else {
      addFavoriteMutation.mutate(applicantId, {
        onSuccess: () => {
          refetchFavorites();
          toast.custom((t) => <CustomToast message='Added to favorites.' type='success' />, { duration: 4000 });
        },
        onError: (error: any) => {
          toast.custom((t) => <CustomToast message={error?.toString() || 'Failed to add favorite.'} type='error' />, {
            duration: 4000,
          });
        },
      });
    }
  };

  const handleSeedApplicants = async (count: number) => {
    try {
      const result = await seedApplicantsMutation.mutateAsync({ count });
      toast.custom(() => <CustomToast message={result.message} type="success" />, { duration: 3000 });
      refetch();
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to seed applicants';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
  };

  const handleUnseedApplicants = async () => {
    try {
      const result = await unseedApplicantsMutation.mutateAsync();
      toast.custom(() => <CustomToast message={result.message} type='success' />, { duration: 3000 });
      refetch();
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to unseed applicants';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
  };

  return (
    <div className='relative'>
      {/* Background Image covering the whole page */}
      <Image
        src={ImageBackground}
        alt='Talent Search'
        fill
        style={{
          objectFit: 'cover',
          zIndex: -2,
        }}
      />
      <div className='fixed bottom-2 sm:bottom-4 left-2 sm:left-4'>
        <Image
          src={ImageBackground4}
          alt='Talent Search'
          width={200}
          height={150}
          className='w-24 h-18 sm:w-48 sm:h-36 md:w-52 md:h-40'
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
      <div className='fixed bottom-2 sm:bottom-4 right-2 sm:right-4'>
        <Image
          src={ImageBackground3}
          alt='Talent Search'
          width={200}
          height={150}
          className='w-24 h-18 sm:w-48 sm:h-36 md:w-52 md:h-40'
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
      <div
        className='fixed bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 overflow-hidden'
        style={{ width: 'clamp(150px, 40vw, 300px)', height: 'clamp(100px, 25vw, 200px)' }}
      >
        <Image
          src={ImageBackground5}
          alt='Talent Search'
          width={300}
          height={400}
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
            transform: 'translateY(0%)',
          }}
        />
      </div>

      <div className='relative z-10'>
        {/* Scroll to Top Button */}
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className='fixed bottom-24 right-8 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            aria-label='Scroll to top'
            title='Scroll to top'
          >
            <ArrowUpIcon className='h-5 w-5' strokeWidth={2.5} />
          </button>
        )}

        {/* Floating Action Buttons */}
        <div className='fixed bottom-1 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden'>
          <div className='flex'>
            <button
              onClick={() => setShowFavoritesPanel((prev) => !prev)}
              className='px-4 py-2 flex items-center gap-2 transition-all hover:bg-gray-50'
            >
              <BookmarkFilledIcon className='h-5 w-5 text-blue-600' />
              <span className='hidden sm:inline text-gray-700 font-medium'>Saved Profiles</span>
            </button>
            <div className='w-px bg-gray-300'></div>
            <Link href='/talent-search/email-history'>
              <button className='px-4 py-2 flex items-center gap-2 transition-all hover:bg-gray-50'>
                <svg className='h-5 w-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                <span className='hidden sm:inline text-gray-700 font-medium'>Email History</span>
              </button>
            </Link>
          </div>
        </div>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex p-4'>
            <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
              <ArrowLeftIcon className='h-5 w-5' />
              <h4>Dashboard</h4>
            </Link>
          </div>
          <div className='px-2 md:px-8 lg:px-4'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6'>
              <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 w-full'>
                <h2 className='text-center w-full col-span-full text-lg sm:text-xl md:text-2xl font-semibold text-slate-800'>
                  Find the Right Talent for Your Team
                </h2>
              </div>
              <div className='self-start md:self-center'>
                <SeederButton
                  onSeed={handleSeedApplicants}
                  onUnseed={handleUnseedApplicants}
                  isLoading={seedApplicantsMutation.isLoading}
                  isUnseeding={unseedApplicantsMutation.isLoading}
                  maxCount={1000}
                  defaultCount={5}
                />
              </div>
            </div>

            <div className='flex justify-center mt-4'>
              <div className='flex gap-2 w-full'>
                <div className='flex-none w-full'>
                  <div className='relative flex items-center'>
                    <input
                      type='text'
                      name='search'
                      id='search'
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className='block w-full rounded-2xl border-0 py-3 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                      placeholder='Search for skills, roles, or keywords... (Press Enter to search, Tab to add chips) (e.g., +skills:Python education:Computer Science)'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Display */}
            {tagsSearch.length > 0 && (
              <div className='flex justify-center mt-4'>
                <div className='flex flex-wrap gap-2 max-w-2xl'>
                  {tagsSearch.map((tag, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleToggleStar(tag)}
                        className='hover:scale-110 transition-transform'
                        title={starredTags.has(tag) ? 'Remove from required terms' : 'Add to required terms'}
                      >
                        {starredTags.has(tag) ? (
                          <StarFilledIcon className='h-4 w-4 text-yellow-500' />
                        ) : (
                          <StarIcon className='h-4 w-4 text-gray-400 hover:text-yellow-500' />
                        )}
                      </button>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className='text-blue-600 hover:text-blue-800 font-bold text-lg leading-none'
                        title='Remove tag'
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='flex justify-center mt-6 gap-2'>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className='bg-blue-600 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className={`rounded-md py-2 px-5 text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50 ${
                  filters.location.length > 0 || filters.gender || filters.salary
                    ? 'bg-blue-100 border border-blue-600 text-blue-700'
                    : 'bg-white border border-blue-600 text-blue-600'
                }`}
              >
                Filter
                {(filters.location.length > 0 || filters.gender || filters.salary) && (
                  <span className='ml-1 bg-blue-600 text-white rounded-full px-1.5 py-0.5 text-xs'>
                    {(filters.location.length > 0 ? 1 : 0) + (filters.gender ? 1 : 0) + (filters.salary ? 1 : 0)}
                  </span>
                )}
              </button>
              {/* Clear saved state button */}
              {(filters.search || tagsSearch.length > 0 || starredTags.size > 0) && (
                <button
                  onClick={() => {
                    setFilters({ search: '', location: [], gender: '', salary: '' });
                    setTagsSearch([]);
                    setStarredTags(new Set());
                    setSearchInput('');
                    setHasSearched(false);
                    clearSavedState();
                  }}
                  className='bg-white rounded-md border border-red-600 py-2 px-5 text-red-600 text-sm font-semibold shadow hover:shadow-md focus:shadow-none'
                  title='Clear all search data'
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {(filters.location.length > 0 || filters.gender || filters.salary) && (
              <div className='flex justify-center mt-4'>
                <div className='flex flex-wrap gap-2 max-w-2xl'>
                  {filters.location.map((location, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm'
                    >
                      <span>📍 {location}</span>
                      <button
                        onClick={() => {
                          const newLocations = filters.location.filter((_, i) => i !== index);
                          setFilters((prev) => ({ ...prev, location: newLocations }));
                        }}
                        className='text-green-600 hover:text-green-800 font-bold text-lg leading-none'
                        title='Remove location filter'
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {filters.gender && (
                    <div className='flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'>
                      <span>👤 {filters.gender}</span>
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, gender: '' }))}
                        className='text-purple-600 hover:text-purple-800 font-bold text-lg leading-none'
                        title='Remove gender filter'
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {filters.salary && (
                    <div className='flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm'>
                      <span>💰 {filters.salary}</span>
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, salary: '' }))}
                        className='text-orange-600 hover:text-orange-800 font-bold text-lg leading-none'
                        title='Remove salary filter'
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Favorites Panel */}
            {showFavoritesPanel && (
              <div className='mb-8'>
                <div className='bg-white rounded-lg shadow-md p-6 border-2 border-gray-300 relative mt-8'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold text-blue-700 flex items-center gap-2'>
                      <BookmarkFilledIcon className='h-5 w-5 text-blue-600' /> Favorites
                    </h3>
                    <button
                      onClick={() => setShowFavoritesPanel(false)}
                      className='text-gray-400 hover:text-gray-700 text-xl font-bold'
                      title='Close'
                    >
                      ×
                    </button>
                  </div>
                  {favoriteApplicants && Array.isArray(favoriteApplicants) && favoriteApplicants.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {favoriteApplicants.map((fav: any) => {
                        const applicant = fav.applicant;
                        if (!applicant) return null;

                        // Get the most recent work experience for this applicant
                        const mostRecentExperience = getMostRecentWorkExperience(applicant.work_experience);

                        return (
                          <div
                            key={applicant.id}
                            className='border rounded-lg p-4 hover:shadow-md transition-shadow relative'
                          >
                            {/* Remove from favorites button */}
                            <div>
                              <button
                                onClick={() => handleToggleBookmark(applicant.id)}
                                className='absolute top-3 left-3 p-1 hover:bg-gray-100 rounded-full transition-colors z-10'
                                data-tooltip-id={`bookmark-tooltip-favorites-${applicant.id}`}
                                data-tooltip-place='right'
                              >
                                <BookmarkFilledIcon className='h-5 w-5 text-blue-600' />
                              </button>
                              <Tooltip
                                id={`bookmark-tooltip-favorites-${applicant.id}`}
                                opacity={1}
                                style={{ fontSize: '10px' }}
                              >
                                <div>
                                  <h2 className='text-[12px] font-medium'>
                                    {isApplicantFavorited(applicant.id) ? 'Remove from favorites' : 'Add to favorites'}
                                  </h2>
                                </div>
                              </Tooltip>
                            </div>
                            <div className='flex flex-col h-full'>
                              <div className='flex-1'>
                                <div className='flex gap-6'>
                                  <ApplicantAvatar applicant={applicant} size={120} />
                                  <div className='flex flex-col'>
                                    <h4 className='font-semibold text-lg mb-1'>
                                      {applicant.firstname} {applicant.lastname}
                                    </h4>
                                    <h1 className='text-sm text-gray-500 mb-1'>{applicant.gender}</h1>
                                    <h1 className='text-sm mb-1'>
                                      {mostRecentExperience ? mostRecentExperience.position : 'No experience'}
                                    </h1>
                                    {mostRecentExperience && (
                                      <h1 className='text-sm mb-1'>
                                        {new Date(mostRecentExperience.dateFrom).toLocaleDateString('en-US', {
                                          month: 'short',
                                          year: 'numeric',
                                        })}{' '}
                                        -{' '}
                                        {mostRecentExperience.dateTo === 'Present' ||
                                        mostRecentExperience.dateTo === 'present' ||
                                        mostRecentExperience.dateTo === '' ||
                                        !mostRecentExperience.dateTo
                                          ? 'Present'
                                          : new Date(mostRecentExperience.dateTo).toLocaleDateString('en-US', {
                                              month: 'short',
                                              year: 'numeric',
                                            })}
                                      </h1>
                                    )}
                                  </div>
                                </div>
                                {applicant.skills && (
                                  <div className='text-sm mb-1 mt-4'>
                                    <div className='font-bold '>Skills</div>
                                    <div>
                                      {Array.isArray(applicant.skills) ? applicant.skills.join(', ') : applicant.skills}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className='mt-auto'>
                                <div className='flex gap-2'>
                                  <button
                                    onClick={() => setIsApplicantProfileModalOpen({ id: applicant.id, open: true })}
                                    className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors'
                                  >
                                    View Profile
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className='text-center py-8'>
                      <p className='text-gray-600'>No favorites yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className='mt-8 mb-10'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                {!hasSearched ? (
                  <div className='text-center py-12'>
                    <p className='text-lg font-semibold text-slate-800'>Ready to find top talent?</p>
                    <p className='text-gray-600 mt-2 max-w-xl mx-auto'>
                      Click the{' '}
                      <span
                        role='button'
                        tabIndex={0}
                        className='font-semibold text-blue-600 hover:underline cursor-pointer'
                        onClick={handleSearch}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleSearch();
                          }
                        }}
                      >
                        Search
                      </span>{' '}
                      button to load available applicants.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4'>
                      <div>
                        <h3 className='text-lg font-semibold'>
                          {filters.search || filters.location.length > 0 || filters.gender || filters.salary
                            ? filters.search
                              ? 'Search Results'
                              : 'Filtered Results'
                            : 'All Available Profiles'}
                        </h3>
                        <p className='text-sm text-gray-500'>
                          {totalRecords > 0
                            ? `${totalRecords} profile${totalRecords === 1 ? '' : 's'} found`
                            : 'No profiles yet'}
                        </p>
                      </div>
                      {selectedApplicants.size > 0 && (
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-gray-600'>{selectedApplicants.size} selected</span>
                          {selectedApplicants.size >= 2 && (
                            <button
                              onClick={handleCompareSelected}
                              className='bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-semibold transition-colors'
                            >
                              Compare Selected ({selectedApplicants.size})
                            </button>
                          )}
                          <button
                            onClick={clearSelection}
                            className='text-gray-500 hover:text-gray-700 text-sm underline'
                          >
                            Clear Selection
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Instructions */}
                    {selectedApplicants.size === 0 && (
                      <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                        <p className='text-sm text-blue-800'>
                          💡 <strong>Tip:</strong> Click the &ldquo;Compare&rdquo; button next to &ldquo;View
                          Profile&rdquo; to select up to 5 profiles for comparison.
                        </p>
                      </div>
                    )}

                    {isLoading && (
                      <div className='text-center py-4'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                        <p className='mt-2 text-gray-600'>Searching for talent...</p>
                      </div>
                    )}

                    {applicants && applicants.length > 0 ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {applicants.map((applicant: any) => {
                          // Get the most recent work experience for this applicant
                          const mostRecentExperience = getMostRecentWorkExperience(applicant.work_experience);

                          return (
                            <div
                              key={applicant.id}
                              className={`border rounded-lg p-4 hover:shadow-md transition-shadow relative ${
                                selectedApplicants.has(applicant.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                              }`}
                            >
                              {/* Bookmark Icon - Top Left Corner */}
                              <div>
                                <button
                                  onClick={() => handleToggleBookmark(applicant.id)}
                                  className='absolute top-3 left-3 p-1 hover:bg-gray-100 rounded-full transition-colors z-10'
                                  data-tooltip-id={`bookmark-tooltip-${applicant.id}`}
                                  data-tooltip-place='right'
                                >
                                  {isApplicantFavorited(applicant.id) ? (
                                    <BookmarkFilledIcon className='h-5 w-5 text-blue-600' />
                                  ) : (
                                    <BookmarkIcon className='h-5 w-5 text-gray-400 hover:text-blue-600' />
                                  )}
                                </button>
                                <Tooltip
                                  id={`bookmark-tooltip-${applicant.id}`}
                                  opacity={1}
                                  style={{ fontSize: '10px' }}
                                >
                                  <div>
                                    <h2 className='text-[12px] font-medium'>
                                      {isApplicantFavorited(applicant.id)
                                        ? 'Remove from favorites'
                                        : 'Add to favorites'}
                                    </h2>
                                  </div>
                                </Tooltip>
                              </div>

                              <div className='flex flex-col h-full'>
                                <div className='flex-1'>
                                  <div className='flex gap-6'>
                                    <ApplicantAvatar applicant={applicant} size={120} />
                                    <div className='flex flex-col'>
                                      <h4 className='font-semibold text-lg mb-1'>
                                        {applicant.firstname} {applicant.lastname}
                                      </h4>
                                      <h1 className='text-sm text-gray-500 mb-1'>{applicant.gender}</h1>
                                      <h1 className='text-sm mb-1'>
                                        {mostRecentExperience ? mostRecentExperience.position : 'No experience'}
                                      </h1>
                                      {mostRecentExperience && (
                                        <h1 className='text-sm mb-1'>
                                          {new Date(mostRecentExperience.dateFrom).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric',
                                          })}{' '}
                                          -{' '}
                                          {mostRecentExperience.dateTo === 'Present' ||
                                          mostRecentExperience.dateTo === 'present' ||
                                          mostRecentExperience.dateTo === '' ||
                                          !mostRecentExperience.dateTo
                                            ? 'Present'
                                            : new Date(mostRecentExperience.dateTo).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric',
                                              })}
                                        </h1>
                                      )}
                                    </div>
                                  </div>
                                  {applicant.skills && (
                                    <div className='text-sm mb-1 mt-4'>
                                      <div className='font-bold '>Skills</div>
                                      <div>
                                        {Array.isArray(applicant.skills)
                                          ? applicant.skills.join(', ')
                                          : applicant.skills}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className='mt-auto'>
                                  <div className='flex gap-2'>
                                    <button
                                      onClick={() => setIsApplicantProfileModalOpen({ id: applicant.id, open: true })}
                                      className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors'
                                    >
                                      View Profile
                                    </button>
                                    <button
                                      onClick={() => handleSelectApplicant(applicant.id)}
                                      className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                        selectedApplicants.has(applicant.id)
                                          ? 'bg-white rounded-md border border-red-600 py-2 px-5 text-red-600 text-sm font-semibold shadow hover:shadow-md focus:shadow-none'
                                          : 'text-blue-600 hover:bg-blue-50 border border-blue-600'
                                      }`}
                                    >
                                      {selectedApplicants.has(applicant.id) ? 'Remove' : 'Compare'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      !isLoading && (
                        <div className='text-center py-8'>
                          <p className='text-gray-600'>
                            {filters.search
                              ? 'No profiles found matching your search criteria.'
                              : 'No profiles found matching your filter criteria.'}
                          </p>
                        </div>
                      )
                    )}

                    {hasNextPage && (
                      <div className='flex justify-center mt-6'>
                        <button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className='bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                          {isFetchingNextPage && (
                            <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></span>
                          )}
                          {isFetchingNextPage ? 'Loading more' : 'Load More Profiles'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {isApplicantProfileModalOpen && (
          <ApplicantProfileModal
            isOpen={isApplicantProfileModalOpen}
            setIsOpen={setIsApplicantProfileModalOpen}
            refetch={refetch}
          />
        )}
        {isCompareModalOpen && (
          <CompareApplicantsModal isOpen={isCompareModalOpen} setIsOpen={setIsCompareModalOpen} refetch={refetch} />
        )}
        {isFilterModalOpen && (
          <FilterModal
            isOpen={isFilterModalOpen}
            setIsOpen={setIsFilterModalOpen}
            refetch={refetch}
            onFilterUpdate={handleFilterUpdate}
            currentFilters={{
              location: filters.location,
              gender: filters.gender,
              salary: filters.salary,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Content;
