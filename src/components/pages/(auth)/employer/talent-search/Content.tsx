'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import toast from 'react-hot-toast';

import useGetApplicantItemsList, { buildSearchQuery } from './hook/useGetApplicantItems';
import CustomToast from '@/components/CustomToast';
import useTagSearch from '@/components/hooks/useTagSearch';
import ImageBackground from '@/assets/talent-search-bg.png';
import useGetApplicantFavorites from './hook/favorites/useGetApplicantFavorites';
import useAddApplicantFavorite from './hook/favorites/useAddApplicantFavorite';
import useRemoveApplicantFavorite from './hook/favorites/useRemoveApplicantFavorite';
import ApplicantProfileModal from './modal/ApplicantProfileModal';
import CompareApplicantsModal from './modal/CompareApplicantsModal';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import StarIcon from '@heroicons/react/24/outline/StarIcon';
import StarFilledIcon from '@heroicons/react/24/solid/StarIcon';
import BookmarkIcon from '@heroicons/react/24/outline/BookmarkIcon';
import BookmarkFilledIcon from '@heroicons/react/24/solid/BookmarkIcon';
import FilterModal from './modal/FilterModal';

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
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false);

  const {
    tagsSearch,
    setTagsSearch,
    handleKeyDown,
    handleRemoveTag: removeTagFromHook,
  } = useTagSearch(searchInput, setSearchInput, []);

  // Use the hook to fetch applicants
  const { data: applicantsData, isLoading, error, refetch } = useGetApplicantItemsList(filters);

  // FAVORITES HOOKS
  const { data: favoriteApplicants, refetch: refetchFavorites } = useGetApplicantFavorites();
  const addFavoriteMutation = useAddApplicantFavorite();
  const removeFavoriteMutation = useRemoveApplicantFavorite();

  // Load saved state from localStorage on component mount
  useEffect(() => {
    try {
      // Load filters
      const savedFilters = localStorage.getItem(STORAGE_KEYS.SEARCH_FILTERS);
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
      }

      // Load tags
      const savedTags = localStorage.getItem(STORAGE_KEYS.SEARCH_TAGS);
      if (savedTags) {
        const parsedTags = JSON.parse(savedTags);
        setTagsSearch(parsedTags);
      }

      // Load starred tags
      const savedStarredTags = localStorage.getItem(STORAGE_KEYS.STARRED_TAGS);
      if (savedStarredTags) {
        const parsedStarredTags = JSON.parse(savedStarredTags);
        setStarredTags(new Set(parsedStarredTags));
      }

      // Load search input
      const savedSearchInput = localStorage.getItem(STORAGE_KEYS.SEARCH_INPUT);
      if (savedSearchInput) {
        setSearchInput(savedSearchInput);
      }
    } catch (error) {
      console.error('Error loading saved search state:', error);
    }
  }, []);

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

  // Clear saved state function
  const clearSavedState = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SEARCH_FILTERS);
      localStorage.removeItem(STORAGE_KEYS.SEARCH_TAGS);
      localStorage.removeItem(STORAGE_KEYS.STARRED_TAGS);
      localStorage.removeItem(STORAGE_KEYS.SEARCH_INPUT);
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
  };

  const handleSearch = () => {
    // Add current input as a tag if it's not empty
    if (searchInput.trim() && !tagsSearch.includes(searchInput.trim())) {
      setTagsSearch([...tagsSearch, searchInput.trim()]);
      setSearchInput('');
    }

    // Build search query from all tags
    const searchQuery = buildSearchQuery(tagsSearch, starredTags);

    // Update filters with new search query
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
    setFilters((prev) => ({
      ...prev,
      location: filterData.location,
      gender: filterData.gender,
      salary: filterData.salary,
    }));
    setIsFilterModalOpen(false);
    
    // Automatically trigger search when filters are applied
    // Build search query from current tags if any exist
    const searchQuery = buildSearchQuery(tagsSearch, starredTags);
    setFilters((prev) => ({
      ...prev,
      location: filterData.location,
      gender: filterData.gender,
      salary: filterData.salary,
      search: searchQuery, // Keep existing search query
    }));
  };

  const handleToggleBookmark = (applicantId: number) => {
    if (isApplicantFavorited(applicantId)) {
      removeFavoriteMutation.mutate(applicantId, {
        onSuccess: () => {
          refetchFavorites();
          toast.custom((t) => <CustomToast message='Removed from favorites!' type='error' />, { duration: 4000 });
        },
        onError: (error: any) => {
          toast.custom((t) => <CustomToast message={error?.toString() || 'Failed to remove favorite.'} type='error' />, { duration: 4000 });
        },
      });
    } else {
      addFavoriteMutation.mutate(applicantId, {
        onSuccess: () => {
          refetchFavorites();
          toast.custom((t) => <CustomToast message='Added to favorites!' type='success' />, { duration: 4000 });
        },
        onError: (error: any) => {
          toast.custom((t) => <CustomToast message={error?.toString() || 'Failed to add favorite.'} type='error' />, { duration: 4000 });
        },
      });
    }
  };

  return (
    <div>
      {/* Floating Action Buttons */}
      <div className='fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden'>
        <div className='flex'>
          <button
            onClick={() => setShowFavoritesPanel((prev) => !prev)}
            className='px-4 py-3 flex items-center gap-2 transition-all hover:bg-gray-50'
          >
            <BookmarkFilledIcon className='h-5 w-5 text-blue-600' />
            <span className='hidden sm:inline text-gray-700 font-medium'>Saved Profiles</span>
          </button>
          <div className='w-px bg-gray-300'></div>
          <Link href='/talent-search/email-history'>
            <button className='px-4 py-3 flex items-center gap-2 transition-all hover:bg-gray-50'>
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
          <Image
            src={ImageBackground}
            alt='Talent Search'
            fill
            style={{
              objectFit: 'cover',
              zIndex: -1,
            }}
          />
          <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6'>
            <h2 className='text-center w-full col-span-full text-lg sm:text-xl md:text-2xl font-semibold text-slate-800'>
              Find the Right Talent for Your Team
            </h2>
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
                    placeholder='Search for skills, roles, or keywords... (e.g., +skills:Python education:Computer Science)'
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
                (filters.location.length > 0 || filters.gender || filters.salary)
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
                  clearSavedState();
                }}
                className='bg-gray-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none'
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
                        setFilters(prev => ({ ...prev, location: newLocations }));
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
                      onClick={() => setFilters(prev => ({ ...prev, gender: '' }))}
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
                      onClick={() => setFilters(prev => ({ ...prev, salary: '' }))}
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
                      return (
                        <div
                          key={applicant.id}
                          className='border rounded-lg p-4 hover:shadow-md transition-shadow relative'
                        >
                          {/* Remove from favorites button */}
                          <button
                            onClick={() => handleToggleBookmark(applicant.id)}
                            className='absolute top-3 left-3 p-1 hover:bg-gray-100 rounded-full transition-colors z-10'
                            title='Remove from bookmarks'
                          >
                            <BookmarkFilledIcon className='h-5 w-5 text-blue-600' />
                          </button>
                          <div className='flex flex-col h-full'>
                            <div className='flex-1'>
                              <div className='flex justify-between'>
                                <Image src={applicant.photo} alt={applicant.firstname} width={100} height={100} />
                                <div className='flex flex-col'>
                                  <h4 className='font-semibold text-lg mb-1'>
                                    {applicant.firstname} {applicant.lastname}
                                  </h4>
                                  <h1 className='text-sm text-gray-500 mb-1'>{applicant.gender}</h1>
                                  <h1 className='text-sm mb-1'>
                                    {applicant.work_experience && applicant.work_experience.length > 0
                                      ? applicant.work_experience[0].position
                                      : 'No experience'}
                                  </h1>
                                  {applicant.work_experience && applicant.work_experience.length > 0 && (
                                    <h1 className='text-sm mb-1'>
                                      {new Date(applicant.work_experience[0].dateFrom).toLocaleDateString('en-US', {
                                        month: 'short',
                                        year: 'numeric',
                                      })}{' '}
                                      -{' '}
                                      {new Date(applicant.work_experience[0].dateTo).toLocaleDateString('en-US', {
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
          {(filters.search || filters.location.length > 0 || filters.gender || filters.salary) && (
            <>
              {/* Search Results Panel (existing code) */}
              <div className='mt-8'>
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold'>
                      {filters.search ? 'Search Results' : 'Filtered Results'}
                    </h3>
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

                  {applicantsData && Array.isArray(applicantsData) && applicantsData.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {applicantsData.map((applicant: any) => (
                        <div
                          key={applicant.id}
                          className={`border rounded-lg p-4 hover:shadow-md transition-shadow relative ${
                            selectedApplicants.has(applicant.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                          }`}
                        >
                          {/* Bookmark Icon - Top Left Corner */}
                          <button
                            onClick={() => handleToggleBookmark(applicant.id)}
                            className='absolute top-3 left-3 p-1 hover:bg-gray-100 rounded-full transition-colors z-10'
                            title={isApplicantFavorited(applicant.id) ? 'Remove from bookmarks' : 'Add to bookmarks'}
                          >
                            {isApplicantFavorited(applicant.id) ? (
                              <BookmarkFilledIcon className='h-5 w-5 text-blue-600' />
                            ) : (
                              <BookmarkIcon className='h-5 w-5 text-gray-400 hover:text-blue-600' />
                            )}
                          </button>

                          <div className='flex flex-col h-full'>
                            <div className='flex-1'>
                              <div className='flex justify-between'>
                                <Image src={applicant.photo} alt={applicant.firstname} width={100} height={100} />
                                <div className='flex flex-col'>
                                  <h4 className='font-semibold text-lg mb-1'>
                                    {applicant.firstname} {applicant.lastname}
                                  </h4>
                                  <h1 className='text-sm text-gray-500 mb-1'>{applicant.gender}</h1>
                                  <h1 className='text-sm mb-1'>
                                    {applicant.work_experience && applicant.work_experience.length > 0
                                      ? applicant.work_experience[0].position
                                      : 'No experience'}
                                  </h1>
                                  {applicant.work_experience && applicant.work_experience.length > 0 && (
                                    <h1 className='text-sm mb-1'>
                                      {new Date(applicant.work_experience[0].dateFrom).toLocaleDateString('en-US', {
                                        month: 'short',
                                        year: 'numeric',
                                      })}{' '}
                                      -{' '}
                                      {applicant.work_experience[0].dateTo === 'Present' ||
                                      applicant.work_experience[0].dateTo === 'present' ||
                                      applicant.work_experience[0].dateTo === ''
                                        ? 'Present'
                                        : new Date(applicant.work_experience[0].dateTo).toLocaleDateString('en-US', {
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
                                <button
                                  onClick={() => handleSelectApplicant(applicant.id)}
                                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                    selectedApplicants.has(applicant.id)
                                      ? 'bg-red-600 text-white hover:bg-red-700'
                                      : 'text-blue-600 hover:bg-blue-50 border border-blue-600'
                                  }`}
                                >
                                  {selectedApplicants.has(applicant.id) ? 'Remove' : 'Compare'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                                         !isLoading && (
                       <div className='text-center py-8'>
                         <p className='text-gray-600'>
                           {filters.search 
                             ? 'No profiles found matching your search criteria.' 
                             : 'No profiles found matching your filter criteria.'
                           }
                         </p>
                       </div>
                     )
                  )}
                </div>
              </div>
            </>
          )}
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
  );
};

export default Content;
