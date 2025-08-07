'use client';

import React, { useMemo } from 'react';

import Card from '../../Card';

interface AttritionRateCardProps {
  separationData?: any[];
  employeeData?: any[];
  isLoading?: boolean;
  error?: any;
}

const AttritionRateCard: React.FC<AttritionRateCardProps> = ({
  separationData,
  employeeData,
  isLoading = false,
  error = null
}) => {
  // Calculate attrition rate with trend comparison
  const calculateAttritionRate = useMemo(() => {
    if (!separationData || !employeeData || !Array.isArray(separationData) || !Array.isArray(employeeData)) {
      return {
        attritionRate: 0,
        totalLeavers: 0,
        averageHeadcount: 0,
        currentHeadcount: 0,
        period: 'current period',
        trend: 'No data available',
        isPositive: true
      };
    }

    // Determine the current quarter period
    const currentDate = new Date();
    const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);
    const currentYear = currentDate.getFullYear();
    
    // Calculate current quarter start and end dates
    const quarterStartMonth = (currentQuarter - 1) * 3;
    const quarterStartDate = new Date(currentYear, quarterStartMonth, 1);
    const quarterEndDate = new Date(currentYear, quarterStartMonth + 3, 0); // Last day of the quarter
    
    // Calculate previous quarter period
    let previousQuarter = currentQuarter - 1;
    let previousYear = currentYear;
    if (previousQuarter === 0) {
      previousQuarter = 4;
      previousYear = currentYear - 1;
    }
    
    const previousQuarterStartMonth = (previousQuarter - 1) * 3;
    const previousQuarterStartDate = new Date(previousYear, previousQuarterStartMonth, 1);
    const previousQuarterEndDate = new Date(previousYear, previousQuarterStartMonth + 3, 0);
    
    // Count leavers in the current quarter period
    const currentPeriodLeavers = separationData.filter((separation: any) => {
      const separationDate = new Date(separation.separation_date || separation.created_at);
      return separationDate >= quarterStartDate && separationDate <= quarterEndDate;
    }).length;

    // Count leavers in the previous quarter period
    const previousPeriodLeavers = separationData.filter((separation: any) => {
      const separationDate = new Date(separation.separation_date || separation.created_at);
      return separationDate >= previousQuarterStartDate && separationDate <= previousQuarterEndDate;
    }).length;

    // Calculate current headcount (ending headcount)
    const endingHeadcount = employeeData.length;
    
    // For starting headcount, we need to add back the leavers from this quarter
    const startingHeadcount = endingHeadcount + currentPeriodLeavers;
    
    // Calculate average headcount: (Starting + Ending) / 2
    const averageHeadcount = (startingHeadcount + endingHeadcount) / 2;

    // Calculate current attrition rate using the formula: (Leavers / Average Headcount) × 100
    const currentAttritionRate = averageHeadcount > 0 ? (currentPeriodLeavers / averageHeadcount) * 100 : 0;

    // Calculate previous quarter attrition rate (simplified - using same ending headcount)
    // In a real system, you'd track historical headcount
    const previousStartingHeadcount = endingHeadcount + previousPeriodLeavers;
    const previousAverageHeadcount = (previousStartingHeadcount + endingHeadcount) / 2;
    const previousAttritionRate = previousAverageHeadcount > 0 ? (previousPeriodLeavers / previousAverageHeadcount) * 100 : 0;

    // Calculate trend
    const changeAmount = currentAttritionRate - previousAttritionRate;
    const changePercentage = Math.abs(changeAmount);
    const isDecrease = changeAmount < 0;
    const isIncrease = changeAmount > 0;
    
    let trendText = '';
    if (previousAttritionRate === 0 && currentAttritionRate === 0) {
      trendText = 'No data available';
    } else if (previousAttritionRate === 0) {
      trendText = `New data in ${currentQuarter === 1 ? 'Q1' : currentQuarter === 2 ? 'Q2' : currentQuarter === 3 ? 'Q3' : 'Q4'} ${currentYear}`;
    } else {
      const direction = isDecrease ? 'Decreased' : isIncrease ? 'Increased' : 'No change';
      const sign = isDecrease ? '-' : isIncrease ? '+' : '';
      trendText = `${direction} by ${sign}${changePercentage.toFixed(1)}% from last Q${previousQuarter} of ${previousYear} (${previousAttritionRate.toFixed(1)}%)`;
    }

    const period = `Q${currentQuarter} ${currentYear}`;

    return {
      attritionRate: Math.round(currentAttritionRate * 10) / 10, // Round to 1 decimal place
      totalLeavers: currentPeriodLeavers,
      averageHeadcount: Math.round(averageHeadcount),
      currentHeadcount: endingHeadcount,
      period: period,
      trend: trendText,
      isPositive: currentAttritionRate < 5 // Positive if attrition rate is below 5%
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
        trend={calculateAttritionRate.trend}
        isPositive={calculateAttritionRate.isPositive}
      />
    </div>
  );
};

export default AttritionRateCard;
