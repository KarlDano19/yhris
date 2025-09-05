import React, { useState, useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import ExitReasonsFilterModal from '../../../../modals/ExitReasonsFilterModal';

import { calculateExitReasonsData } from './calculations/exitReasons';

import FilterLogo from '@/svg/FilterLogo';

interface ExitReasonsProps {
  separationData?: any;
  isLoading?: boolean;
  error?: any;
}

const ExitReasons: React.FC<ExitReasonsProps> = ({
  separationData,
  isLoading = false,
  error = null
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('All Positions');

  // Calculate exit reasons data using shared utility
  const { exitReasonsData, uniquePositions, titleText } = useMemo(() => {
    return calculateExitReasonsData(separationData, selectedPositionFilter);
  }, [separationData, selectedPositionFilter]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exit Reasons</h3>
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner size="lg" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exit Reasons</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-500">Error loading exit reasons data</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {titleText ? `Exit Reasons for ${titleText}` : 'Exit Reasons'}
          </h3>
          <button
            className="p-2 hover:bg-gray-100 rounded border-2 border-[#ACB9CB] flex-shrink-0"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FilterLogo className="w-5 h-5" />
          </button>
        </div>

        {exitReasonsData.length > 0 ? (
          <>
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#ACB9CB]">
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Exit Reason</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {exitReasonsData.map((item, index) => (
                    <tr key={index} className="border-b border-[#CCD8EA]">
                      <td className="text-center py-3 px-2 text-gray-900 font-medium">{item.reason}</td>
                      <td className="text-center py-3 px-2 text-gray-700">{item.count}</td>
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
          </>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">No exit reasons data available</div>
              <div className="text-gray-500 text-sm">Separation records will appear here when available</div>
            </div>
          </div>
        )}
      </div>

      <ExitReasonsFilterModal
        isOpen={isFilterModalOpen}
        setIsOpen={setIsFilterModalOpen}
        onFilterApply={(filters) => {
          if (filters.selectedPosition) {
            setSelectedPositionFilter(filters.selectedPosition);
          }
        }}
        positionItems={uniquePositions}
        currentSelectedPosition={selectedPositionFilter}
      />
    </>
  );
};

export default ExitReasons;
