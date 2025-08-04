'use client';

import React, { useState, useMemo } from 'react';

import { Tooltip } from 'react-tooltip';

import DemographicBreakdownFilterModal from '../../modals/DemographicBreakdownFilterModal';

import FilterLogo from '@/svg/FilterLogo';
import { getRegionGroup, advertiseOptions } from '../../../../utils/advertiseOptions';


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

  // Calculate demographic data from applicants
  const demographicData = useMemo(() => {
    if (!appliedApplicantsData || !Array.isArray(appliedApplicantsData)) {
      return [];
    }

    // Use applicants data passed from parent
    const filteredApplicants = appliedApplicantsData;

    const totalApplicants = filteredApplicants.length;
    if (totalApplicants === 0) return [];

    // Calculate gender distribution
    const genderCounts = filteredApplicants.reduce((acc: any, applicant: any) => {
      const gender = applicant.applicant?.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    const femaleCount = genderCounts['Female'] || 0;
    const maleCount = genderCounts['Male'] || 0;
    const femalePercentage = totalApplicants > 0 ? ((femaleCount / totalApplicants) * 100).toFixed(0) : '0';
    const malePercentage = totalApplicants > 0 ? ((maleCount / totalApplicants) * 100).toFixed(0) : '0';

    // Calculate most common regions
    const regionGroupCounts: { [key: string]: number } = {};
    
    if (selectedJobFilter === 'All Jobs') {
      // For "All Jobs", consider both job posting regions and applicant addresses
      if (jobPostData?.records && Array.isArray(jobPostData.records)) {
        jobPostData.records.forEach((job: any) => {
          // Check advertise_to field (single region)
          if (job.advertise_to && validRegions.includes(job.advertise_to)) {
            const regionGroup = getRegionGroup(job.advertise_to);
            if (regionGroup) {
              regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
            }
          }
          // Also check advertise_options field (multiple regions) if it exists
          if (job.advertise_options && Array.isArray(job.advertise_options)) {
            job.advertise_options.forEach((region: string) => {
              if (validRegions.includes(region)) {
                const regionGroup = getRegionGroup(region);
                if (regionGroup) {
                  regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
                }
              }
            });
          }
        });
      }
    } else {
      // For specific jobs, use the job data from applicant records
      filteredApplicants.forEach((applicant: any) => {
        if (applicant.job_posting) {
          // Check advertise_to field (single region)
          if (applicant.job_posting.advertise_to && validRegions.includes(applicant.job_posting.advertise_to)) {
            const regionGroup = getRegionGroup(applicant.job_posting.advertise_to);
            if (regionGroup) {
              regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
            }
          }
          // Also check advertise_options field (multiple regions) if it exists
          if (applicant.job_posting.advertise_options && Array.isArray(applicant.job_posting.advertise_options)) {
            applicant.job_posting.advertise_options.forEach((region: string) => {
              if (validRegions.includes(region)) {
                const regionGroup = getRegionGroup(region);
                if (regionGroup) {
                  regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
                }
              }
            });
          }
        }
      });
    }
    
    // Always consider applicant addresses for region analysis
    filteredApplicants.forEach((applicant: any) => {
      // Handle different data structures - check both possible paths
      let address = '';
      
      // Try different possible paths for address
      if (applicant.applicant?.address) {
        address = applicant.applicant.address;
      } else if (applicant.address) {
        address = applicant.address;
      } else if (applicant.applicant_application_form?.address) {
        address = applicant.applicant_application_form.address;
      }
      
      if (address) {
        // Try to match address with valid regions
        const matchedRegion = validRegions.find(region => 
          address.toLowerCase().includes(region.toLowerCase())
        );
        if (matchedRegion) {
          const regionGroup = getRegionGroup(matchedRegion);
          if (regionGroup) {
            regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
          }
        }
      }
    });

    // Get top 3 most common region groups and sort by advertiseOptions order
    const sortedRegionGroups = Object.entries(regionGroupCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([regionGroup]) => regionGroup);

    // Sort regions by their order in advertiseOptions
    const sortedByAdvertiseOrder = sortedRegionGroups.sort((a, b) => {
      const aIndex = advertiseOptions.findIndex(option => option.label === a);
      const bIndex = advertiseOptions.findIndex(option => option.label === b);
      return aIndex - bIndex;
    });

    const mostCommonRegions = sortedByAdvertiseOrder.length > 0 ? sortedByAdvertiseOrder.map(region => region.replace(/^- | -$/g, '')) : ['N/A'];

    // Calculate age distribution using age field from applicants
    const ageGroups = filteredApplicants.reduce((acc: any, applicant: any) => {
      // First try to use the age field directly
      let age = applicant.applicant?.age;
      
      // If age is not available, calculate from birth_date
      if (!age && applicant.applicant?.birth_date) {
        age = new Date().getFullYear() - new Date(applicant.applicant.birth_date).getFullYear();
      }
      
      if (age && age > 0) {
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
      />
      <Tooltip id="demographic-filter-tooltip" />
    </>
  );
};

export default DemographicBreakdown;
