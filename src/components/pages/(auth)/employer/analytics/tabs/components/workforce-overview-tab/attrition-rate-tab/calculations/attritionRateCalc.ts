// Utility functions for attrition rate calculations

export interface AttritionRateData {
  month: string;
  attritionRate: string;
  totalExits: number;
}

export interface AttritionRateResult {
  dateRange: string;
  attritionData: AttritionRateData[];
}

export const getAttritionRateColor = (rateString: string): string => {
  const rate = parseFloat(rateString.replace('%', ''));
  
  if (rate < 10) {
    return 'text-green-600 font-semibold';
  } else if (rate >= 11 && rate <= 15) {
    return 'text-blue-600 font-semibold';
  } else if (rate >= 16 && rate <= 20) {
    return 'text-orange-600 font-semibold';
  } else if (rate > 20) {
    return 'text-red-600 font-semibold';
  } else {
    return 'text-gray-600 font-semibold';
  }
};

export const calculateAttritionRateData = (
  separationData?: any,
  dateFilter?: {
    from: string;
    to: string;
  },
  totalEmployees: number = 143
): AttritionRateResult => {
  // Handle both paginated structure (records) and flat array structure
  const dataArray = separationData?.records || separationData;
  if (!dataArray || !Array.isArray(dataArray)) {
    return {
      dateRange: 'No data available',
      attritionData: []
    };
  }

  // Filter separations based on date range if provided
  let filteredSeparations = dataArray;
  if (dateFilter?.from && dateFilter?.to) {
    const fromDate = new Date(dateFilter.from);
    const toDate = new Date(dateFilter.to);
    
    filteredSeparations = dataArray.filter((separation: any) => {
      if (!separation.date_of_separation) return false;
      const separationDate = new Date(separation.date_of_separation);
      return separationDate >= fromDate && separationDate <= toDate;
    });
  }

  // Calculate date range for the title
  const dates = filteredSeparations
    .map((separation: any) => separation.date_of_separation)
    .filter(Boolean)
    .map((date: string) => new Date(date))
    .sort((a: Date, b: Date) => a.getTime() - b.getTime());

  let dateRange = 'No data available';
  if (dates.length > 0) {
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    if (firstDate.getFullYear() === lastDate.getFullYear() &&
      firstDate.getMonth() === lastDate.getMonth()) {
      dateRange = `${firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    } else {
      dateRange = `${firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} to ${lastDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
  }

  // Group separations by month
  const monthlySeparations: { [key: string]: number } = {};

  filteredSeparations.forEach((separation: any) => {
    if (separation.date_of_separation) {
      const date = new Date(separation.date_of_separation);
      const monthKey = date.toLocaleDateString('en-US', { month: 'long' });
      monthlySeparations[monthKey] = (monthlySeparations[monthKey] || 0) + 1;
    }
  });

  // Convert to array format and calculate attrition rates
  const attritionData = Object.entries(monthlySeparations)
    .map(([month, exits]) => {
      const attritionRate = ((exits / totalEmployees) * 100).toFixed(2);
      return {
        month,
        attritionRate: `${attritionRate}%`,
        totalExits: exits
      };
    })
    .sort((a, b) => {
      // Sort by month order (January to December)
      const monthOrder = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
      };
      
      const monthA = monthOrder[a.month as keyof typeof monthOrder] || 0;
      const monthB = monthOrder[b.month as keyof typeof monthOrder] || 0;
      
      return monthA - monthB;
    });

  return {
    dateRange,
    attritionData
  };
};
