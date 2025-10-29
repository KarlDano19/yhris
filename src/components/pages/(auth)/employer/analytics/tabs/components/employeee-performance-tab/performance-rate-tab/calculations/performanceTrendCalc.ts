// Utility functions for performance trend calculations

export interface PerformanceTrendItem {
  month: string;
  score: number;
  count: number;
}

export interface PerformanceTrendData {
  trendData: PerformanceTrendItem[];
  displayData: PerformanceTrendItem[];
}

export const calculatePerformanceTrend = (
  evaluationData?: any,
  dateFilter?: {
    from: string;
    to: string;
  },
  selectedDepartment: string = 'All Departments'
): PerformanceTrendData => {
  if (!evaluationData) {
    return {
      trendData: [],
      displayData: []
    };
  }

  // Handle both paginated structure (records) and flat array structure
  const dataArray = evaluationData.records || evaluationData;
  if (!dataArray || dataArray.length === 0) {
    return {
      trendData: [],
      displayData: []
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

  // Filter evaluations based on date range or current year
  const allEvaluations = dataArray.filter((item: any) => {
    const evaluationDate = new Date(item.date_of_evaluation);
    
    if (dateFilter?.from && dateFilter?.to) {
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      return evaluationDate >= fromDate && evaluationDate <= toDate;
    } else {
      // Fallback to current year if no date range is selected
      const currentYear = new Date().getFullYear();
      return evaluationDate.getFullYear() === currentYear;
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
      const currentYear = currentDate.getFullYear();
      
      if (selectedDepartment === 'All Departments') {
        // Calculate average across ALL departments for this month
        const monthEvaluations = allEvaluations.filter((item: any) => {
          const evaluationDate = new Date(item.date_of_evaluation);
          return evaluationDate.getMonth() === monthValue && 
                 evaluationDate.getFullYear() === currentYear;
        });

        if (monthEvaluations.length === 0) {
          rangeMonths.push({
            month: monthName,
            score: 0,
            count: 0
          });
        } else {
          // Monthly Performance Rate = Average Percentage Score in Month
          const totalPercentage = monthEvaluations.reduce((sum: number, item: any) => {
            const formScore = parseFloat(item.form_total_score) || parseFloat(item.score) || 0;
            const maxScore = parseFloat(item.max_total_score) || 100;
            const percentage = maxScore > 0 ? (formScore / maxScore) * 100 : 0;
            return sum + percentage;
          }, 0);

          const averageScore = totalPercentage / monthEvaluations.length;

          rangeMonths.push({
            month: monthName,
            score: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
            count: monthEvaluations.length
          });
        }
      } else {
        // Calculate for specific department
        const departmentMonthEvaluations = allEvaluations.filter((item: any) => {
          const evaluationDate = new Date(item.date_of_evaluation);
          return evaluationDate.getMonth() === monthValue && 
                 evaluationDate.getFullYear() === currentYear &&
                 item.department === selectedDepartment;
        });

        if (departmentMonthEvaluations.length === 0) {
          rangeMonths.push({
            month: monthName,
            score: 0,
            count: 0
          });
        } else {
          // Monthly Performance Rate = Average Percentage Score for Department in Month
          const totalPercentage = departmentMonthEvaluations.reduce((sum: number, item: any) => {
            const formScore = parseFloat(item.form_total_score) || parseFloat(item.score) || 0;
            const maxScore = parseFloat(item.max_total_score) || 100;
            const percentage = maxScore > 0 ? (formScore / maxScore) * 100 : 0;
            return sum + percentage;
          }, 0);

          const averageScore = totalPercentage / departmentMonthEvaluations.length;

          rangeMonths.push({
            month: monthName,
            score: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
            count: departmentMonthEvaluations.length
          });
        }
      }
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return {
      trendData: rangeMonths,
      displayData: rangeMonths
    };
  } else {
    // For current year, only show months with data
    const monthlyData = months.map(month => {
      if (selectedDepartment === 'All Departments') {
        // Calculate average across ALL departments for this month
        const monthEvaluations = allEvaluations.filter((item: any) => {
          const evaluationDate = new Date(item.date_of_evaluation);
          return evaluationDate.getMonth() === month.value;
        });

        if (monthEvaluations.length === 0) {
          return { month: month.name, score: 0, count: 0 };
        }

        // Monthly Performance Rate = Average Percentage Score in Month
        const totalPercentage = monthEvaluations.reduce((sum: number, item: any) => {
          const formScore = parseFloat(item.form_total_score) || parseFloat(item.score) || 0;
          const maxScore = parseFloat(item.max_total_score) || 100;
          const percentage = maxScore > 0 ? (formScore / maxScore) * 100 : 0;
          return sum + percentage;
        }, 0);

        const averageScore = totalPercentage / monthEvaluations.length;

        return {
          month: month.name,
          score: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
          count: monthEvaluations.length
        };
      } else {
        // Calculate for specific department
        const departmentMonthEvaluations = allEvaluations.filter((item: any) => {
          const evaluationDate = new Date(item.date_of_evaluation);
          return evaluationDate.getMonth() === month.value && 
                 item.department === selectedDepartment;
        });

        if (departmentMonthEvaluations.length === 0) {
          return { month: month.name, score: 0, count: 0 };
        }

        // Monthly Performance Rate = Average Percentage Score for Department in Month
        const totalPercentage = departmentMonthEvaluations.reduce((sum: number, item: any) => {
          const formScore = parseFloat(item.form_total_score) || parseFloat(item.score) || 0;
          const maxScore = parseFloat(item.max_total_score) || 100;
          const percentage = maxScore > 0 ? (formScore / maxScore) * 100 : 0;
          return sum + percentage;
        }, 0);

        const averageScore = totalPercentage / departmentMonthEvaluations.length;

        return {
          month: month.name,
          score: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
          count: departmentMonthEvaluations.length
        };
      }
    });

    // Filter out months with no data (score = 0)
    const filteredData = monthlyData.filter(item => item.score > 0);

    return {
      trendData: monthlyData,
      displayData: filteredData
    };
  }
};
