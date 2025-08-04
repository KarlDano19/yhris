'use client';

import React, { useMemo } from 'react';
import Card from '../../../Card';

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
  // Calculate new hires from applicant data
  const calculateNewHires = useMemo(() => {
    if (!appliedApplicantsData || !Array.isArray(appliedApplicantsData) || appliedApplicantsData.length === 0) {
      return {
        newHires: 0,
        trend: 'No data available'
      };
    }

    // Count applicants who were hired (assuming hired status is tracked)
    // This is a placeholder calculation - in a real system, you'd check actual hiring status
    const newHires = Math.round(appliedApplicantsData.length * 0.15); // Simulate 15% hire rate
    
    // Calculate trend (simulated comparison with previous quarter)
    const currentDate = new Date();
    const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);
    const currentYear = currentDate.getFullYear();
    
    // Calculate previous quarter
    let previousQuarter = currentQuarter - 1;
    let previousYear = currentYear;
    if (previousQuarter === 0) {
      previousQuarter = 4;
      previousYear = currentYear - 1;
    }
    
    const previousQuarterHires = Math.round(newHires * 0.75); // Simulate 33% increase
    const increase = newHires - previousQuarterHires;
    const increasePercentage = previousQuarterHires > 0 ? (increase / previousQuarterHires) * 100 : 0;

    return {
      newHires,
      trend: `Increased by +${increase} from last Q${previousQuarter} of ${previousYear} (${increasePercentage.toFixed(0)}%)`
    };
  }, [appliedApplicantsData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">New Hires</h3>
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-2xl"></div>
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
        value={calculateNewHires.newHires.toString()}
        trend={calculateNewHires.trend}
        isPositive={true} // Always positive as it's a count
      />
    </div>
  );
};

export default NewHiresCard; 