'use client';

import React, { useState, useMemo } from 'react';
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

interface ITPerformanceTrendProps {
  evaluationData?: any;
}

const ITPerformanceTrend: React.FC<ITPerformanceTrendProps> = ({ evaluationData }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('IT');
  const { data: departmentItems } = useGetDepartmentItems();

  // Calculate IT Performance Trend using real data
  const itTrendData = useMemo(() => {
    if (!evaluationData?.records) return [];

    const currentYear = new Date().getFullYear();
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

    // Filter selected department evaluations for current year
    const departmentEvaluations = evaluationData.records.filter((item: any) => {
      const evaluationDate = new Date(item.date_of_evaluation);
      const isCurrentYear = evaluationDate.getFullYear() === currentYear;
      const isSelectedDepartment = item.department === selectedDepartment;
      return isCurrentYear && isSelectedDepartment;
    });

    // Group evaluations by month
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
  }, [evaluationData, selectedDepartment]);

  // Get the last 3 months with data for display
  const displayData = itTrendData.slice(-3);

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
        <div className="flex justify-between items-center mb-4">
          <button 
            className="p-2 hover:bg-gray-100 rounded border-2 border-[#ACB9CB]"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FilterLogo className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedDepartment} Performance Trend ({displayData.length > 0 ? `${displayData[0]?.month} - ${displayData[displayData.length - 1]?.month} ${new Date().getFullYear()}` : 'No Data'})
          </h3>
          <div className="w-10"></div>
        </div>
        
        <div className="h-96">
          {displayData.length > 0 ? (
            <Line data={data} options={options} />
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
        <div className="flex justify-center mt-4">
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

export default ITPerformanceTrend; 