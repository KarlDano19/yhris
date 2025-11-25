import React, { useState, useMemo } from 'react';

import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
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
  applicantStatusOptions?: string[];
  selectedStatusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

const DemographicBreakdown: React.FC<DemographicBreakdownProps> = ({ 
  appliedApplicantsData, 
  jobPostData,
  validRegions = [],
  isLoading = false, 
  error = null,
  selectedJobFilter = 'All Jobs',
  onJobFilterChange,
  applicantStatusOptions,
  selectedStatusFilter = 'All Statuses',
  onStatusFilterChange
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
    if (filters.selectedJob !== undefined && onJobFilterChange) {
      onJobFilterChange(filters.selectedJob);
    }

    if (filters.selectedStatus !== undefined && onStatusFilterChange) {
      onStatusFilterChange(filters.selectedStatus);
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
          <LoadingSpinner size="lg" color="yellow" />
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
        applicantStatusOptions={applicantStatusOptions}
        currentSelectedStatus={selectedStatusFilter}
      />
      <Tooltip id="demographic-filter-tooltip" />
    </>
  );
};

export default DemographicBreakdown;