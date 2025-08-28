// Utility functions for average tenure calculations

export interface AverageTenureData {
  averageTenure: number;
  totalEmployees: number;
  totalTenure: number;
  trend: string;
  isPositive: boolean;
}

export const calculateAverageTenure = (
  employeeData?: any[],
  separationData?: any[]
): AverageTenureData => {
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
    const startDate = new Date(employee.date_hired || employee.start_date || employee.created_at || employee.hire_date);
    
    // Check if employee has left (has separation date)
    const separationRecord = Array.isArray(separationData) ? separationData.find((separation: any) => 
      separation.employee_id === employee.id || separation.name === `${employee.firstname} ${employee.lastname}`
    ) : undefined;
    
    let endDate = currentDate; // Default to current date (still employed)
    if (separationRecord) {
      // Employee has left, use separation date
      endDate = new Date(separationRecord.date_of_separation || separationRecord.separation_date || separationRecord.created_at);
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

  // Trend analysis based on average tenure value
  let trend = '';
  let isPositive = true;
  
  if (averageTenure === 0) {
    trend = 'No data available';
    isPositive = true;
  } else if (averageTenure < 1) {
    trend = 'Low tenure - consider retention strategies';
    isPositive = false;
  } else if (averageTenure < 2) {
    trend = 'Below average tenure';
    isPositive = false;
  } else if (averageTenure < 3) {
    trend = 'Average tenure level';
    isPositive = true;
  } else if (averageTenure < 5) {
    trend = 'Good tenure retention';
    isPositive = true;
  } else {
    trend = 'Excellent tenure retention';
    isPositive = true;
  }

  return {
    averageTenure: Math.round(averageTenure * 10) / 10, // Round to 1 decimal place
    totalEmployees: validEmployees,
    totalTenure: Math.round(totalTenure * 10) / 10,
    trend: trend,
    isPositive: isPositive
  };
};
