// Utility functions for monthly issue volume calculations

export interface MonthlyVolumeData {
  labels: string[];
  data: number[];
}

export const calculateMonthlyVolume = (
  employeeIssueData?: any[] | {
    records?: any[];
  },
  dateFilter?: {
    from: string;
    to: string;
  }
): MonthlyVolumeData => {
  // Handle both paginated structure (records) and flat array structure
  const dataArray = Array.isArray(employeeIssueData) ? employeeIssueData : employeeIssueData?.records;
  
  if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
    return {
      labels: [],
      data: []
    };
  }

  const months = [
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 },
  ];

  // Filter issues based on date range or current year
  const filteredIssues = dataArray.filter((issue: any) => {
    if (!issue.incident_date) return false;
    
    const issueDate = new Date(issue.incident_date);
    
    if (dateFilter?.from && dateFilter?.to) {
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      return issueDate >= fromDate && issueDate <= toDate;
    } else {
      // Fallback to current year if no date range is selected
      const currentYear = new Date().getFullYear();
      return issueDate.getFullYear() === currentYear;
    }
  });

  // If date range is selected, show all months in the range
  if (dateFilter?.from && dateFilter?.to) {
    const fromDate = new Date(dateFilter.from);
    const toDate = new Date(dateFilter.to);
    const fromMonth = fromDate.getMonth();
    const toMonth = toDate.getMonth();
    const fromYear = fromDate.getFullYear();
    const toYear = toDate.getFullYear();
    
    // Create array of months in the selected range
    const rangeMonths = [];
    let currentDate = new Date(fromYear, fromMonth, 1);
    const endDate = new Date(toYear, toMonth + 1, 0); // Last day of toMonth
    
    while (currentDate <= endDate) {
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
      const monthValue = currentDate.getMonth();
      
      // Count issues for this month
      const monthIssues = filteredIssues.filter((issue: any) => {
        const issueDate = new Date(issue.incident_date);
        return issueDate.getMonth() === monthValue && 
               issueDate.getFullYear() === currentDate.getFullYear();
      });
      
      rangeMonths.push({
        month: monthName,
        count: monthIssues.length
      });
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return {
      labels: rangeMonths.map(item => item.month),
      data: rangeMonths.map(item => item.count)
    };
  } else {
    // For current year, only show months with data
    const monthlyData = months.map(month => {
      const monthIssues = filteredIssues.filter((issue: any) => {
        const issueDate = new Date(issue.incident_date);
        return issueDate.getMonth() === month.value;
      });

      return {
        month: month.name,
        count: monthIssues.length
      };
    });

    // Filter out months with no data (count = 0)
    const monthsWithData = monthlyData.filter(item => item.count > 0);
    
    return {
      labels: monthsWithData.map(item => item.month),
      data: monthsWithData.map(item => item.count)
    };
  }
}; 