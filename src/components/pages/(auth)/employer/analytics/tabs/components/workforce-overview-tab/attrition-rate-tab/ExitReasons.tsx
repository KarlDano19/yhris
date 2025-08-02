'use client';

import React, { useState } from 'react';

import FilterLogo from '@/svg/FilterLogo';
import ExitReasonsFilterModal from '../../modals/ExitReasonsFilterModal';

const ExitReasons = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Dummy data for exit reasons
  const exitReasonsData = [
    {
      reason: 'Voluntary Resignation',
      count: 1
    },
    {
      reason: 'Absence Without Leave (AWOL)',
      count: 0
    },
    {
      reason: 'Layoff',
      count: 0
    },
    {
      reason: 'Termination',
      count: 0
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
          <h3 className="text-lg font-semibold text-gray-900">Exit Reasons for January 2025</h3>
          <button 
            className="p-2 hover:bg-gray-100 rounded border-2 border-[#ACB9CB] flex-shrink-0"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FilterLogo className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Exit Reason</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Count</th>
              </tr>
            </thead>
            <tbody>
              {exitReasonsData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-2 text-gray-900 font-medium">{item.reason}</td>
                  <td className="py-3 px-2 text-gray-700">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Guidelines Section */}
        <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-lg p-4">
          <h4 className="text-md font-semibold text-yellow-800 mb-3">Exit Reason Guidelines</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <span className="text-gray-800 font-medium w-48 flex-shrink-0"><span className="font-bold">Voluntary Resignation</span> (0-1 per month):</span>
              <span className="text-gray-700">This is usually normal, but more than 1 may suggest employees are unhappy or looking for better opportunities.</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-800 font-medium w-48 flex-shrink-0"><span className="font-bold">AWOL</span> (0 per month):</span>
              <span className="text-gray-700">This should not happen; even one case could point to deeper issues like poor onboarding or unmet expectations.</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-800 font-medium w-48 flex-shrink-0"><span className="font-bold">Layoff</span> (0 per month):</span>
              <span className="text-gray-700">Layoffs should be rare and usually signal changes in company structure or budget.</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-800 font-medium w-48 flex-shrink-0"><span className="font-bold">Termination</span> (0-1 per month):</span>
              <span className="text-gray-700">Some terminations are expected, but frequent cases may indicate hiring or training problems.</span>
            </div>
          </div>
        </div>
      </div>

      <ExitReasonsFilterModal
        isOpen={isFilterModalOpen}
        setIsOpen={setIsFilterModalOpen}
        onFilterApply={handleFilterApply}
      />
    </>
  );
};

export default ExitReasons;
