'use client';

import React, { useMemo } from 'react';

import Card from '../../Card';

interface AverageTenureCardProps {
  employeeData?: any[];
  separationData?: any[];
  isLoading?: boolean;
  error?: any;
}

const AverageTenureCard: React.FC<AverageTenureCardProps> = ({
  employeeData,
  separationData,
  isLoading = false,
  error = null
}) => {
  // Calculate average tenure with trend analysis
  const calculateAverageTenure = useMemo(() => {
    if (!employeeData || !Array.isArray(employeeData) || employeeData.length === 0) {
      return {
        averageTenure: 0,
        totalEmployees: 0,
        totalTenure: 0,
        trend: 'No data available',
        isPositive: true
      };
    }

    const currentDate = new Date();
    let totalTenure = 0;
    let validEmployees = 0;

    employeeData.forEach((employee: any) => {
      // Get start date from employee data
      const startDate = new Date(employee.start_date || employee.created_at || employee.hire_date);
      
      // Check if employee has left (has separation date)
      const separationRecord = Array.isArray(separationData) ? separationData.find((separation: any) => 
        separation.employee_id === employee.id || separation.employee_name === `${employee.firstname} ${employee.lastname}`
      ) : undefined;
      
      let endDate = currentDate; // Default to current date (still employed)
      if (separationRecord) {
        // Employee has left, use separation date
        endDate = new Date(separationRecord.separation_date || separationRecord.created_at);
      }

      // Calculate tenure in years
      const tenureInYears = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      
      // Only include valid tenures (positive values)
      if (tenureInYears >= 0) {
        totalTenure += tenureInYears;
        validEmployees++;
      }
    });

    const averageTenure = validEmployees > 0 ? totalTenure / validEmployees : 0;

    // For trend analysis, we'll use a simplified approach
    // In a real system, you'd compare with historical data
    // For now, we'll show "No significant change" as per the sample UI
    const trend = 'No significant change';
    const isPositive = averageTenure > 2; // Positive if average tenure is above 2 years

    return {
      averageTenure: Math.round(averageTenure * 10) / 10, // Round to 1 decimal place
      totalEmployees: validEmployees,
      totalTenure: Math.round(totalTenure * 10) / 10,
      trend: trend,
      isPositive: isPositive
    };
  }, [employeeData, separationData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Average Tenure (Years)</h3>
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
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Average Tenure (Years)</h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load tenure data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-5 pr-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Average Tenure (Years)</h3>
      <Card
        value={`${calculateAverageTenure.averageTenure}`}
        trend={calculateAverageTenure.trend}
        isPositive={calculateAverageTenure.isPositive}
      />
    </div>
  );
};

export default AverageTenureCard;
