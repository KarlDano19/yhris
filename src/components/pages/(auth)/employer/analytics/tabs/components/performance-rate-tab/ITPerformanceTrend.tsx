'use client';

import React, { useState } from 'react';
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

const ITPerformanceTrend: React.FC = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const itTrendData = [
    { month: 'January', score: 70 },
    { month: 'February', score: 72 },
    { month: 'March', score: 74 },
  ];

  const data = {
    labels: itTrendData.map(item => item.month),
    datasets: [
      {
        label: 'Average Score',
        data: itTrendData.map(item => item.score),
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
    // Here you can add logic to filter the chart data based on the selected department
    console.log('Selected department:', department);
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
          <h3 className="text-lg font-semibold text-gray-900">IT Performance Trend (Jan - Mar 2025)</h3>
          <div className="w-10"></div>
        </div>
        
        <div className="h-96">
          <Line data={data} options={options} />
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
      />
    </>
  );
};

export default ITPerformanceTrend; 