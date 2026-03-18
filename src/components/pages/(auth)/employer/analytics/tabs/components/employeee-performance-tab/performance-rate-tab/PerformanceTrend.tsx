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
  dateFilter?: {
    from: string;
    to: string;
  };
  showAllDepartments?: boolean;
  precomputedTrend?: Array<{ month: string; year: number; score: number; count: number }>;
  externalSelectedDepartment?: string;
  onDepartmentChange?: (dept: string) => void;
}

const PerformanceTrend: React.FC<PerformanceTrendProps> = ({
  dateFilter,
  showAllDepartments = false,
  precomputedTrend,
  externalSelectedDepartment,
  onDepartmentChange,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [internalSelectedDepartment, setInternalSelectedDepartment] = useState('All Departments');
  const [chartKey, setChartKey] = useState(0);
  const [userManuallySelected, setUserManuallySelected] = useState(false);
  const { data: departmentItems } = useGetDepartmentItems();

  const selectedDepartment = externalSelectedDepartment !== undefined ? externalSelectedDepartment : internalSelectedDepartment;

  const { displayData } = useMemo(() => {
    if (precomputedTrend) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const data = precomputedTrend.map(item => ({
        month: typeof item.month === 'number' ? monthNames[item.month - 1] || String(item.month) : item.month,
        score: item.score,
        count: item.count,
      }));
      return { displayData: data };
    }
    return { displayData: [] };
  }, [precomputedTrend]);

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
        afterFit: function(axis: any) {
          axis.paddingTop = 20;
        }
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

  const getDateRangeLabel = () => {
    if (dateFilter?.from && dateFilter?.to) {
      const from = new Date(dateFilter.from);
      const to = new Date(dateFilter.to);
      const fromMonth = from.toLocaleDateString('en-US', { month: 'long' });
      const toMonth = to.toLocaleDateString('en-US', { month: 'long' });
      const fromYear = from.getFullYear();
      const toYear = to.getFullYear();
      if (fromMonth === toMonth && fromYear === toYear) return `${fromMonth} ${fromYear}`;
      if (fromYear === toYear) return `${fromMonth} - ${toMonth} ${fromYear}`;
      return `${fromMonth} ${fromYear} - ${toMonth} ${toYear}`;
    }
    if (displayData.length === 0) return 'No Data';
    const first = displayData[0];
    const last = displayData[displayData.length - 1];
    const firstYear = precomputedTrend?.[0]?.year ?? new Date().getFullYear();
    const lastYear = precomputedTrend?.[precomputedTrend.length - 1]?.year ?? firstYear;
    if (displayData.length === 1 || first.month === last.month) return `${first.month} ${firstYear}`;
    if (firstYear !== lastYear) return `${first.month} ${firstYear} - ${last.month} ${lastYear}`;
    return `${first.month} - ${last.month} ${firstYear}`;
  };

  const handleDepartmentSelect = (department: string) => {
    setInternalSelectedDepartment(department);
    setUserManuallySelected(true);
    onDepartmentChange?.(department);
  };

  // Calculate dynamic height to match PerformanceRate chart
  const getChartHeight = () => {
    const baseHeight = 475;
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
            {selectedDepartment !== 'All Departments'
              ? `${selectedDepartment} Performance Trend`
              : 'All Departments Performance Trend'
            } ({getDateRangeLabel()})
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
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        {displayData.length > 0 && (
          <div className="flex justify-center mt-2">
            <div className="flex items-center space-x-2">
              <AverageLegendIcon />
              <span className="text-lg text-gray-600">Average Score</span>
            </div>
          </div>
        )}
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