'use client';

import { useState, useRef, useEffect } from 'react';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import FilterIcon from '@/svg/FilterIcon';

type FilterProps = {
  onFilterChange: (filters: FilterOptions) => void;
};

export type FilterOptions = {
  rating: string[];
  status: string[];
};

export default function Filter({ onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    rating: ['Good Fit', 'Not Fit'],
    status: ['Ongoing', 'Passed', 'Hired'],
  });
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => 
      filterRef.current?.contains(e.target as Node) || setIsOpen(false);
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleRatingChange = (rating: string) => {
    let newRating;
    if (filters.rating.includes(rating)) {
      // Don't allow unchecking if this is the only option selected
      if (filters.rating.length === 1) {
        return;
      }
      newRating = filters.rating.filter((r) => r !== rating);
    } else {
      newRating = [...filters.rating, rating];
    }
    
    const updatedFilters = { ...filters, rating: newRating };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleStatusChange = (status: string) => {
    let newStatus;
    if (filters.status.includes(status)) {
      // Don't allow unchecking if this is the only option selected
      if (filters.status.length === 1) {
        return;
      }
      newStatus = filters.status.filter((s) => s !== status);
    } else {
      newStatus = [...filters.status, status];
    }
    
    const updatedFilters = { ...filters, status: newStatus };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="relative" ref={filterRef}>
      <SmartButton
        id="use-filter-screen-applicants-btn"
        onClick={toggleFilter}
        className="rounded-lg border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 p-2 flex items-center justify-center h-12 w-12 transition-colors"
      >
        <FilterIcon />
      </SmartButton>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white shadow-md rounded-md p-4 z-30 w-64 border border-gray-300">
          <div className="mb-4">
            <h3 className="font-semibold text-indigo-dye mb-2">Rating</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={filters.rating.includes('Good Fit')}
                  onChange={() => handleRatingChange('Good Fit')}
                />
                <span className="text-sm text-gray-800">Good Fit</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={filters.rating.includes('Not Fit')}
                  onChange={() => handleRatingChange('Not Fit')}
                />
                <span className="text-sm text-gray-800">Not Fit</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-indigo-dye mb-2">Application Status</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={filters.status.includes('Ongoing')}
                  onChange={() => handleStatusChange('Ongoing')}
                />
                <span className="text-sm text-gray-800">Ongoing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={filters.status.includes('Passed')}
                  onChange={() => handleStatusChange('Passed')}
                />
                <span className="text-sm text-gray-800">Passed</span>
              </label>
              {/* <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={filters.status.includes('Withdrawn')}
                  onChange={() => handleStatusChange('Withdrawn')}
                />
                <span className="text-sm text-gray-800">Withdrawn</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={filters.status.includes('Rejected')}
                  onChange={() => handleStatusChange('Rejected')}
                />
                <span className="text-sm text-gray-800">Rejected</span>
              </label> */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={filters.status.includes('Hired')}
                  onChange={() => handleStatusChange('Hired')}
                />
                <span className="text-sm text-gray-800">Hired</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
