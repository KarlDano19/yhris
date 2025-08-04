'use client';

import React, { useState, useMemo } from 'react';

import { Tooltip } from 'react-tooltip';

import DemographicBreakdownFilterModal from '../../modals/DemographicBreakdownFilterModal';

import FilterLogo from '@/svg/FilterLogo';


interface DemographicBreakdownProps {
  appliedApplicantsData?: any[];
  isLoading?: boolean;
  error?: any;
}

const DemographicBreakdown: React.FC<DemographicBreakdownProps> = ({ 
  appliedApplicantsData, 
  isLoading = false, 
  error = null 
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Calculate demographic data from applicants
  const demographicData = useMemo(() => {
    if (!appliedApplicantsData || !Array.isArray(appliedApplicantsData)) {
      return [];
    }

    const totalApplicants = appliedApplicantsData.length;
    if (totalApplicants === 0) return [];

    // Calculate gender distribution
    const genderCounts = appliedApplicantsData.reduce((acc: any, applicant: any) => {
      const gender = applicant.applicant?.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    const femaleCount = genderCounts['Female'] || 0;
    const maleCount = genderCounts['Male'] || 0;
    const femalePercentage = totalApplicants > 0 ? ((femaleCount / totalApplicants) * 100).toFixed(0) : '0';
    const malePercentage = totalApplicants > 0 ? ((maleCount / totalApplicants) * 100).toFixed(0) : '0';

    // Calculate most common regions
    const regionCounts = appliedApplicantsData.reduce((acc: any, applicant: any) => {
      const region = applicant.applicant?.address?.split(',')[1]?.trim() || 'Unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {});

    const maxRegionCount = Math.max(...Object.values(regionCounts).map(count => count as number));
    const mostCommonRegions = Object.entries(regionCounts)
      .filter(([_, count]) => (count as number) === maxRegionCount)
      .map(([region]) => region)
      .filter(region => region !== 'Unknown')
      .slice(0, 3); // Limit to top 3 regions

    // Calculate age distribution
    const ageGroups = appliedApplicantsData.reduce((acc: any, applicant: any) => {
      const birthDate = applicant.applicant?.birth_date;
      if (birthDate) {
        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        let ageGroup;
        if (age >= 18 && age <= 25) ageGroup = '18-25';
        else if (age >= 26 && age <= 35) ageGroup = '26-35';
        else if (age >= 36 && age <= 45) ageGroup = '36-45';
        else if (age >= 46 && age <= 55) ageGroup = '46-55';
        else if (age >= 56) ageGroup = '56+';
        else ageGroup = 'Unknown';

        acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      }
      return acc;
    }, {});

    // Find the most common age group
    const maxAgeCount = Math.max(...Object.values(ageGroups).map(count => count as number));
    const mostCommonAgeGroup = Object.entries(ageGroups)
      .filter(([_, count]) => (count as number) === maxAgeCount)
      .map(([ageGroup]) => ageGroup)
      .filter(ageGroup => ageGroup !== 'Unknown')[0] || 'N/A';

    return [
      {
        demographic: 'Female Applicants',
        details: `${femalePercentage}%`
      },
      {
        demographic: 'Male Applicants',
        details: `${malePercentage}%`
      },
      {
        demographic: 'Most Common Regions',
        details: mostCommonRegions.length > 0 ? mostCommonRegions.join(', ') : 'N/A'
      },
      {
        demographic: 'Most Common Age Group',
        details: mostCommonAgeGroup
      }
    ];
  }, [appliedApplicantsData]);

  const handleFilterApply = (filters: any) => {
    // Placeholder for filter application logic
    console.log('Applied filters:', filters);
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
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading demographic data...</div>
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

  // No data state
  if (!demographicData || demographicData.length === 0) {
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
          <div className="text-gray-500">No demographic data available</div>
        </div>
      </div>
    );
  }

  return (
    <>
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
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Demographic</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Details</th>
              </tr>
            </thead>
            <tbody>
              {demographicData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-2 text-gray-900 font-medium">{item.demographic}</td>
                  <td className="py-3 px-2 text-gray-700">{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DemographicBreakdownFilterModal
        isOpen={isFilterModalOpen}
        setIsOpen={setIsFilterModalOpen}
        onFilterApply={handleFilterApply}
      />
      <Tooltip id="demographic-filter-tooltip" />
    </>
  );
};

export default DemographicBreakdown;
