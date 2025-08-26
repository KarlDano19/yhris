import React, { useState, useMemo } from 'react';

import { Tooltip } from 'react-tooltip';

import DemographicBreakdownFilterModal from '../../../../modals/DemographicBreakdownFilterModal';

import { calculateDemographicBreakdown } from './calculations/demographicBreakdownCalc';

import FilterLogo from '@/svg/FilterLogo';


interface DemographicBreakdownProps {
  appliedApplicantsData?: any[];
  jobPostData?: any;
  validRegions?: string[];
  isLoading?: boolean;
  error?: any;
  selectedJobFilter?: string;
  onJobFilterChange?: (jobFilter: string) => void;
}

const DemographicBreakdown: React.FC<DemographicBreakdownProps> = ({ 
  appliedApplicantsData, 
  jobPostData,
  validRegions = [],
  isLoading = false, 
  error = null,
  selectedJobFilter = 'All Jobs',
  onJobFilterChange
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Calculate demographic data using shared utility
  const demographicData = useMemo(() => {
    const breakdownData = calculateDemographicBreakdown(
      appliedApplicantsData, 
      jobPostData, 
      validRegions, 
      selectedJobFilter
    );
    
    return [
      {
        demographic: 'Female Applicants',
        details: breakdownData.femalePercentage
      },
      {
        demographic: 'Male Applicants',
        details: breakdownData.malePercentage
      },
      {
        demographic: 'Most Common Regions',
        details: breakdownData.mostCommonRegion
      },
      {
        demographic: 'Most Common Age Group',
        details: breakdownData.mostCommonAgeGroup
      }
    ];
  }, [appliedApplicantsData, jobPostData, validRegions, selectedJobFilter]);

  const handleFilterApply = (filters: any) => {
    if (filters.selectedJob && onJobFilterChange) {
      onJobFilterChange(filters.selectedJob);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Demographic Breakdown</h3>
          <button 
            className="p-2 hover:bg-gray-100 rounded border-2 border-[#ACB9CB] flex-shrink-0 cursor-not-allowed opacity-50"
            data-tooltip-id="demographic-filter-tooltip"
            data-tooltip-content="Filter functionality coming soon"
            data-tooltip-place="bottom"
            disabled
          >
            <FilterLogo className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-center py-4">
          <div role='status' className='text-center'>
            <svg
              aria-hidden='true'
              className='inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Demographic Breakdown</h3>
          <button 
            className="p-2 hover:bg-gray-100 rounded border-2 border-[#ACB9CB] flex-shrink-0 cursor-not-allowed opacity-50"
            data-tooltip-id="demographic-filter-tooltip"
            data-tooltip-content="Filter functionality coming soon"
            data-tooltip-place="bottom"
            disabled
          >
            <FilterLogo className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error loading demographic data</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedJobFilter !== 'All Jobs' ? `Demographic Breakdown for ${selectedJobFilter}` : 'Demographic Breakdown'}
          </h3>
          <button 
            className="p-2 hover:bg-gray-100 rounded border-2 border-[#ACB9CB] flex-shrink-0"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FilterLogo className="w-5 h-5" />
          </button>
        </div>
        
        {demographicData && demographicData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#ACB9CB]">
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Demographic</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {demographicData.map((item, index) => (
                  <tr key={index} className="border-b border-[#CCD8EA]">
                    <td className="text-center py-5 px-2 text-gray-900 font-medium">{item.demographic}</td>
                    <td className="text-center py-5 px-2 text-gray-700">{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-gray-500">
              <div className="text-lg font-semibold mb-2">No Data Available</div>
              <div className="text-sm">No demographic data found for the selected criteria</div>
            </div>
          </div>
        )}
      </div>

      <DemographicBreakdownFilterModal
        isOpen={isFilterModalOpen}
        setIsOpen={setIsFilterModalOpen}
        onFilterApply={handleFilterApply}
        jobItems={jobPostData?.records || []}
        currentSelectedJob={selectedJobFilter}
      />
      <Tooltip id="demographic-filter-tooltip" />
    </>
  );
};

export default DemographicBreakdown;
