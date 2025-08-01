'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import FilterLogo from '@/svg/FilterLogo';
import AverageLegendIcon from '@/svg/AverageLegendIcon';
import FilterModal from '../modals/FilterModal';
import useGetDepartmentItems from '@/components/hooks/useGetDepartmentItems';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceTrendProps {
  evaluationData?: any;
  dateFilter?: {
    from: string;
    to: string;
  };
  currentPage?: number;
  pageSize?: number;
}

const PerformanceTrend: React.FC<PerformanceTrendProps> = ({ evaluationData, dateFilter, currentPage, pageSize }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [lastPage, setLastPage] = useState(currentPage);
  const [chartKey, setChartKey] = useState(0);
  const { data: departmentItems } = useGetDepartmentItems();

  // Set default selected department to the latest department with data
  useEffect(() => {
    if (evaluationData?.records && evaluationData.records.length > 0) {
      // Get all unique departments from evaluation data
      const departmentsWithData = Array.from(new Set(evaluationData.records.map((item: any) => item.department)));
      
      if (departmentsWithData.length > 0) {
        // Find the department with the most recent evaluation from current page data
        let latestDepartment: string = departmentsWithData[0] as string;
        let latestDate = new Date(0);
        
        evaluationData.records.forEach((item: any) => {
          if (item.date_of_evaluation) {
            const evaluationDate = new Date(item.date_of_evaluation);
            if (evaluationDate > latestDate) {
              latestDate = evaluationDate;
              latestDepartment = item.department as string;
            }
          }
        });
        
        // Only update if no department is currently selected OR if the page has changed
        if (!selectedDepartment || currentPage !== lastPage) {
          setSelectedDepartment(latestDepartment);
          setLastPage(currentPage);
        }
        
        // Force chart re-render when page size changes (layout change)
        if (pageSize) {
          setChartKey(prev => prev + 1);
        }
      }
    }
  }, [evaluationData, currentPage, lastPage, selectedDepartment]);

    // Handle layout changes when page size changes
  useEffect(() => {
    if (pageSize) {
      // Small delay to ensure layout has changed before re-rendering chart
      const timer = setTimeout(() => {
        setChartKey(prev => prev + 1);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [pageSize]);

  // Calculate Performance Trend using real data
  const performanceTrendData = useMemo(() => {
    if (!evaluationData?.records) return [];

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

    // Filter selected department evaluations based on date range or current year
    const departmentEvaluations = evaluationData.records.filter((item: any) => {
      const evaluationDate = new Date(item.date_of_evaluation);
      const isSelectedDepartment = item.department === selectedDepartment;
      
      if (dateFilter?.from && dateFilter?.to) {
        const fromDate = new Date(dateFilter.from);
        const toDate = new Date(dateFilter.to);
        const isInDateRange = evaluationDate >= fromDate && evaluationDate <= toDate;
        return isInDateRange && isSelectedDepartment;
      } else {
        // Fallback to current year if no date range is selected
        const currentYear = new Date().getFullYear();
        const isCurrentYear = evaluationDate.getFullYear() === currentYear;
        return isCurrentYear && isSelectedDepartment;
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
        
        // Get evaluations for this month
        const monthEvaluations = departmentEvaluations.filter((item: any) => {
          const evaluationDate = new Date(item.date_of_evaluation);
          return evaluationDate.getMonth() === monthValue && 
                 evaluationDate.getFullYear() === currentDate.getFullYear();
        });

        if (monthEvaluations.length === 0) {
          rangeMonths.push({
            month: monthName,
            score: 0,
            count: 0
          });
        } else {
          // Calculate monthly performance rate using the formula:
          // Monthly Performance Rate = Sum of Scores in Month / Number of Employees Evaluated in Month
          const totalScore = monthEvaluations.reduce((sum: number, item: any) => {
            return sum + (parseFloat(item.score) || 0);
          }, 0);

          const averageScore = totalScore / monthEvaluations.length;

          rangeMonths.push({
            month: monthName,
            score: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
            count: monthEvaluations.length
          });
        }
        
        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return rangeMonths;
    } else {
      // For current year, only show months with data
      const monthlyData = months.map(month => {
        const monthEvaluations = departmentEvaluations.filter((item: any) => {
          const evaluationDate = new Date(item.date_of_evaluation);
          return evaluationDate.getMonth() === month.value;
        });

        if (monthEvaluations.length === 0) {
          return { month: month.name, score: 0, count: 0 };
        }

        // Calculate monthly performance rate using the formula:
        // Monthly Performance Rate = Sum of Scores in Month / Number of Employees Evaluated in Month
        const totalScore = monthEvaluations.reduce((sum: number, item: any) => {
          return sum + (parseFloat(item.score) || 0);
        }, 0);

        const averageScore = totalScore / monthEvaluations.length;

        return {
          month: month.name,
          score: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
          count: monthEvaluations.length
        };
      });

      // Filter out months with no data (score = 0)
      return monthlyData.filter(item => item.score > 0);
    }
  }, [evaluationData, selectedDepartment, dateFilter]);

  // Get the months with data for display
  const displayData = performanceTrendData;

  const data = {
    labels: displayData.map(item => item.month),
    datasets: [
      {
        label: 'Average Score',
        data: displayData.map(item => item.score),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'white',
        pointBorderColor: '#8B5CF6',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
          borderDash: [3, 3],
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex justify-between items-start mb-4">
          <button 
            className="p-2 hover:bg-gray-100 rounded border-2 border-[#ACB9CB] flex-shrink-0 mt-1"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FilterLogo className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900 text-center flex-1 px-4">
            {selectedDepartment} Performance Trend {dateFilter?.from && dateFilter?.to ? `(${new Date(dateFilter.from).toLocaleDateString('en-US', { month: 'short' })} - ${new Date(dateFilter.to).toLocaleDateString('en-US', { month: 'long' })} ${new Date(dateFilter.from).getFullYear()})` : `(${displayData.length > 0 ? `${displayData[0]?.month} - ${displayData[displayData.length - 1]?.month} ${new Date().getFullYear()}` : 'No Data'})`}
          </h3>
          <div className="w-10 flex-shrink-0"></div>
        </div>
        
        <div className="h-96 transition-all duration-300 ease-in-out">
          {displayData.length > 0 ? (
            <div className="w-full h-full">
              <Line key={chartKey} data={data} options={options} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-lg font-semibold mb-2">No Data Available</div>
                <div className="text-sm">No {selectedDepartment} evaluations found for the current year</div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-2">
          <div className="flex items-center space-x-2">
            <AverageLegendIcon />
            <span className="text-lg text-gray-600">Average Score</span>
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        setIsOpen={setIsFilterModalOpen}
        onDepartmentSelect={handleDepartmentSelect}
        departmentItems={departmentItems}
      />
    </>
  );
};

export default PerformanceTrend; 