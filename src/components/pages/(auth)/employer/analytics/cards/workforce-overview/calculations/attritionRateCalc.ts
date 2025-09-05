// Utility functions for attrition rate calculations

export interface AttritionRateData {
  attritionRate: number;
  totalLeavers: number;
  averageHeadcount: number;
  currentHeadcount: number;
  period: string;
  trend: string;
  isPositive: boolean;
}

export const calculateAttritionRate = (
  separationData?: any[],
  employeeData?: any[]
): AttritionRateData => {
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
    const separationDate = new Date(separation.date_of_separation || separation.separation_date || separation.created_at);
    return separationDate >= quarterStartDate && separationDate <= quarterEndDate;
  }).length;

  // Count leavers in the previous quarter period
  const previousPeriodLeavers = separationData.filter((separation: any) => {
    const separationDate = new Date(separation.date_of_separation || separation.separation_date || separation.created_at);
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
};
