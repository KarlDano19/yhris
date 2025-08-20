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
import { calculatePerformanceTrend } from './calculations/performanceTrendCalc';

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

  // Calculate Performance Trend using shared utility
  const { displayData } = useMemo(() => {
    return calculatePerformanceTrend(evaluationData, dateFilter, selectedDepartment);
  }, [evaluationData, selectedDepartment, dateFilter]);

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