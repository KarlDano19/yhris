import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';
import { calculateNewHires } from './calculations/newHiresCalc';

interface NewHiresCardProps {
  appliedApplicantsData?: any[];
  isLoading?: boolean;
  error?: any;
}

const NewHiresCard: React.FC<NewHiresCardProps> = ({
  appliedApplicantsData,
  isLoading = false,
  error = null
}) => {
  // Calculate new hires using shared utility
  const newHiresData = useMemo(() => {
    return calculateNewHires(appliedApplicantsData);
  }, [appliedApplicantsData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">New Hires</h3>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner size="md" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">New Hires</h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load applicant data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-2 pr-2">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">New Hires</h3>
      <Card
        value={newHiresData.newHires.toString()}
        trend={newHiresData.trend}
        isPositive={newHiresData.isPositive}
      />
    </div>
  );
};

export default NewHiresCard; 