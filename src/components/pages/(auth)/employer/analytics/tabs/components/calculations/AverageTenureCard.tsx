'use client';

import React, { useMemo } from 'react';
import Card from '../../../Card';

interface AverageTenureCardProps {
  employeeData?: {
    records?: any[];
  };
  separationData?: {
    records?: any[];
  };
  isLoading?: boolean;
  error?: any;
}

const AverageTenureCard: React.FC<AverageTenureCardProps> = ({
  employeeData,
  separationData,
  isLoading = false,
  error = null
}) => {
  // Calculate average tenure
  const calculateAverageTenure = useMemo(() => {
    if (!employeeData?.records || employeeData.records.length === 0) {
      return {
        averageTenure: 0,
        totalEmployees: 0,
        totalTenure: 0
      };
    }

    const currentDate = new Date();
    let totalTenure = 0;
    let validEmployees = 0;

    employeeData.records.forEach((employee: any) => {
      // Get start date from employee data
      const startDate = new Date(employee.start_date || employee.created_at || employee.hire_date);
      
      // Check if employee has left (has separation date)
      const separationRecord = separationData?.records?.find((separation: any) => 
        separation.employee_id === employee.id || separation.employee_name === `${employee.firstname} ${employee.lastname}`
      );
      
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

    return {
      averageTenure: Math.round(averageTenure * 10) / 10, // Round to 1 decimal place
      totalEmployees: validEmployees,
      totalTenure: Math.round(totalTenure * 10) / 10
    };
  }, [employeeData, separationData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Average Tenure (Years)</h3>
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-2xl"></div>
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
        trend={`${calculateAverageTenure.totalEmployees} employees, ${calculateAverageTenure.totalTenure} total years`}
        isPositive={calculateAverageTenure.averageTenure > 2} // Positive if average tenure is above 2 years
      />
    </div>
  );
};

export default AverageTenureCard;
