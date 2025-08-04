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

    // Determine the period name
    const currentDate = new Date();
    const quarter = Math.ceil((currentDate.getMonth() + 1) / 3);
    const year = currentDate.getFullYear();
    const period = `Q${quarter} ${year}`;

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
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-2xl"></div>
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
