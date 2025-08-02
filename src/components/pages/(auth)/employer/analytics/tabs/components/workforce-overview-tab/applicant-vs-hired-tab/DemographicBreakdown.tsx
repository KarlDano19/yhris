'use client';

import React, { useState } from 'react';

import FilterLogo from '@/svg/FilterLogo';
import DemographicBreakdownFilterModal from '../../modals/DemographicBreakdownFilterModal';

const DemographicBreakdown = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Dummy data for demographic breakdown
  const demographicData = [
    {
      demographic: 'Female Applicants',
      details: '59%'
    },
    {
      demographic: 'Male Applicants',
      details: '41%'
    },
    {
      demographic: 'Most Common Regions',
      details: 'NCR, Region X'
    },
    {
      demographic: 'Average Age',
      details: '27-32'
    }
  ];

  const handleFilterApply = (filters: any) => {
    // Placeholder for filter application logic
    console.log('Applied filters:', filters);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Demographic Breakdown for Finance Officer</h3>
          <button 
            className="p-2 hover:bg-gray-100 rounded border-2 border-[#ACB9CB] flex-shrink-0"
            onClick={() => setIsFilterModalOpen(true)}
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
    </>
  );
};

export default DemographicBreakdown;
