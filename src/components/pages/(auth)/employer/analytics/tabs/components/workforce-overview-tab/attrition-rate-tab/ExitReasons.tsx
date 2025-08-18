import React, { useState, useMemo } from 'react';

import ExitReasonsFilterModal from '../../../../modals/ExitReasonsFilterModal';

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

  // Calculate exit reasons data from separation data
  const exitReasonsData = useMemo(() => {
    if (!separationData || !Array.isArray(separationData)) {
      return [];
    }

    // Filter by position if selected
    let filteredData = separationData;
    if (selectedPositionFilter !== 'All Positions') {
      filteredData = separationData.filter((separation: any) => 
        separation.position === selectedPositionFilter
      );
    }

    // Count separations by reason
    const reasonCounts: { [key: string]: number } = {};

    filteredData.forEach((separation: any) => {
      const reason = separation.reason_of_leaving || 'Unknown';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });

    // Convert to array format
    return Object.entries(reasonCounts)
      .map(([reason, count]) => ({
        reason,
        count
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [separationData, selectedPositionFilter]);

  // Get unique positions from separation data
  const uniquePositions = useMemo(() => {
    if (!separationData || !Array.isArray(separationData)) {
      return [];
    }

    const positions = new Set<string>();
    separationData.forEach((separation: any) => {
      if (separation.position) {
        positions.add(separation.position);
      }
    });
    
    return Array.from(positions).sort();
  }, [separationData]);

  // Get the title text for exit reasons
  const titleText = useMemo(() => {
    if (!separationData || !Array.isArray(separationData) || separationData.length === 0) {
      return 'No data available';
    }
    return selectedPositionFilter !== 'All Positions' ? selectedPositionFilter : '';
  }, [separationData, selectedPositionFilter]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exit Reasons</h3>
        <div className="flex items-center justify-center h-32">
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
