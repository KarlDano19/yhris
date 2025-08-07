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

import useGetDepartmentItems from '@/components/hooks/useGetDepartmentItems';
import PerformanceTrendFilterModal from '../../../../modals/PerformanceTrendFilterModal';

import FilterLogo from '@/svg/FilterLogo';
import AverageLegendIcon from '@/svg/AverageLegendIcon';

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
  showAllDepartments?: boolean;
}

const PerformanceTrend: React.FC<PerformanceTrendProps> = ({ evaluationData, dateFilter, showAllDepartments = false }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [chartKey, setChartKey] = useState(0);
  const [userManuallySelected, setUserManuallySelected] = useState(false);
  const { data: departmentItems } = useGetDepartmentItems();

  // Set default selected department to "All Departments" by default
  useEffect(() => {
    const dataArray = evaluationData?.records || evaluationData;
    if (dataArray && dataArray.length > 0) {
      // Only update if user hasn't manually selected a department
      if (!userManuallySelected) {
        setSelectedDepartment('All Departments');
        setUserManuallySelected(false); // Reset for next auto-selection
      }
    }
  }, [evaluationData, selectedDepartment]);

  // Calculate Performance Trend using real data
  const performanceTrendData = useMemo(() => {
    if (!evaluationData) return [];

    // Handle both paginated structure (records) and flat array structure
    const dataArray = evaluationData.records || evaluationData;
    if (!dataArray || dataArray.length === 0) return [];

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
            // Monthly Performance Rate = Sum of Scores in Month of the Department / Specific Employees Evaluated in a Department in a Month
            const totalScore = departmentMonthEvaluations.reduce((sum: number, item: any) => {
              return sum + (parseFloat(item.score) || 0);
            }, 0);

            const averageScore = totalScore / departmentMonthEvaluations.length;

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
      
      return rangeMonths;
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

          // Monthly Performance Rate = Sum of Scores in Month of the Department / Specific Employees Evaluated in a Department in a Month
          const totalScore = departmentMonthEvaluations.reduce((sum: number, item: any) => {
            return sum + (parseFloat(item.score) || 0);
          }, 0);

          const averageScore = totalScore / departmentMonthEvaluations.length;

          return {
            month: month.name,
            score: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
            count: departmentMonthEvaluations.length
          };
        }
      });

      // Filter out months with no data (score = 0)
      return monthlyData.filter(item => item.score > 0);
    }
  }, [evaluationData, selectedDepartment, dateFilter]);

  // Get the months with data for display
  const displayData = performanceTrendData;

  const data = {
    labels: displayData.map(item => {
      // Use abbreviated month names when showAllDepartments is false
      if (!showAllDepartments) {
        return item.month.substring(0, 3);
      }
      return item.month;
    }),
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
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#8B5CF6',
        borderWidth: 1,
        callbacks: {
          title: (context: any) => {
            return context[0].label;
          },
          label: (context: any) => {
            const index = context.dataIndex;
            const score = context.parsed.y;
            const monthData = displayData[index];
            return [
              `Score: ${score}%`,
              `Employees: ${monthData.count}`
            ];
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        min: 0,
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
          stepSize: 20,
          callback: function(value: any) {
            return value;
          }
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
    setUserManuallySelected(true); // Mark that user has manually selected
  };

  // Calculate dynamic height to match PerformanceRate chart
  const getChartHeight = () => {
    const baseHeight = 400;
    const minHeight = 300;
    const maxHeight = 600;
    
    // Use the same logic as PerformanceRate for consistency
    if (displayData.length <= 8) {
      return baseHeight;
    } else if (displayData.length <= 15) {
      return Math.min(baseHeight + (displayData.length - 8) * 20, maxHeight);
    } else {
      return maxHeight;
    }
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
            {selectedDepartment !== 'All Departments' ? `${selectedDepartment} Performance Trend` : 'All Departments Performance Trend'} {dateFilter?.from && dateFilter?.to ? `(${new Date(dateFilter.from).toLocaleDateString('en-US', { month: 'short' })} - ${new Date(dateFilter.to).toLocaleDateString('en-US', { month: 'long' })} ${new Date(dateFilter.from).getFullYear()})` : `(${displayData.length > 0 ? `${displayData[0]?.month} - ${displayData[displayData.length - 1]?.month} ${new Date().getFullYear()}` : 'No Data'})`}
          </h3>
          <div className="w-10 flex-shrink-0"></div>
        </div>
        
        <div style={{ height: `${getChartHeight()}px` }} className="transition-all duration-300 ease-in-out">
          {displayData.length > 0 ? (
            <div className="w-full h-full">
              <Line key={chartKey} data={data} options={options} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-lg font-semibold mb-2">No Data Available</div>
                <div className="text-sm">No {selectedDepartment !== 'All Departments' ? selectedDepartment : 'department'} evaluations found for the current year</div>
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

      <PerformanceTrendFilterModal
        isOpen={isFilterModalOpen}
        setIsOpen={setIsFilterModalOpen}
        onDepartmentSelect={handleDepartmentSelect}
        departmentItems={departmentItems}
        currentSelectedDepartment={selectedDepartment}
      />
    </>
  );
};

export default PerformanceTrend; 