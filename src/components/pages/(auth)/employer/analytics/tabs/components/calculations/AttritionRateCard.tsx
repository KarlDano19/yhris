'use client';

import React, { useMemo } from 'react';

import Card from '../../../Card';

interface AttritionRateCardProps {
  separationData?: {
    records?: any[];
  };
  employeeData?: {
    records?: any[];
  };
  isLoading?: boolean;
  error?: any;
}

const AttritionRateCard: React.FC<AttritionRateCardProps> = ({
  separationData,
  employeeData,
  isLoading = false,
  error = null
}) => {
  // Calculate attrition rate
  const calculateAttritionRate = useMemo(() => {
    if (!separationData?.records || !employeeData?.records) {
      return {
        attritionRate: 0,
        totalLeavers: 0,
        averageHeadcount: 0,
        currentHeadcount: 0,
        period: 'current period'
      };
    }

    // Count leavers in the current period (last 3 months as default)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const currentPeriodLeavers = separationData.records.filter((separation: any) => {
      const separationDate = new Date(separation.separation_date || separation.created_at);
      return separationDate >= threeMonthsAgo;
    }).length;

    // Calculate current headcount from employee data
    const currentHeadcount = employeeData.records.length;
    
    // Estimate starting headcount (current + leavers in the period)
    // This is a simplified approach - in a real system you'd track historical headcount
    const startingHeadcount = currentHeadcount + currentPeriodLeavers;
    const endingHeadcount = currentHeadcount;
    const averageHeadcount = (startingHeadcount + endingHeadcount) / 2;

    // Calculate attrition rate using the formula: (Leavers / Average Headcount) × 100
    const attritionRate = averageHeadcount > 0 ? (currentPeriodLeavers / averageHeadcount) * 100 : 0;

    // Determine the period name dynamically
    const currentDate = new Date();
    const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);
    const currentYear = currentDate.getFullYear();
    const period = `Q${currentQuarter} ${currentYear}`;

    return {
      attritionRate: Math.round(attritionRate * 10) / 10, // Round to 1 decimal place
      totalLeavers: currentPeriodLeavers,
      averageHeadcount: Math.round(averageHeadcount),
      currentHeadcount: currentHeadcount,
      period: period
    };
  }, [separationData, employeeData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Attrition Rate</h3>
        <div className="flex items-center justify-center h-16">
          <div role='status' className='text-center'>
            <svg
              aria-hidden='true'
              className='inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-yellow-400'
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
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Attrition Rate</h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load attrition data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-5 pr-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Attrition Rate</h3>
      <Card
        value={`${calculateAttritionRate.attritionRate}%`}
        trend={`${calculateAttritionRate.totalLeavers} leavers, ${calculateAttritionRate.currentHeadcount} current employees in ${calculateAttritionRate.period}`}
        isPositive={calculateAttritionRate.attritionRate < 5} // Positive if attrition rate is below 5%
      />
    </div>
  );
};

export default AttritionRateCard;
