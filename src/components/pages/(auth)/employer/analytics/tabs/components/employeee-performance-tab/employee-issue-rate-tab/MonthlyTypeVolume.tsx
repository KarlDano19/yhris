import React from 'react';

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

import LoadingSpinner from '@/components/LoadingSpinner';
import { calculateMonthlyVolume } from './calculations/monthlyTypeVolumeCalc';
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

interface EmployeeIssueData {
  incident_date: string;
  issue_type?: string;
}

interface MonthlyTypeVolumeProps {
  employeeIssueData?: EmployeeIssueData[] | {
    records?: EmployeeIssueData[];
  };
  dateFilter?: {
    from: string;
    to: string;
  };
  isLoading?: boolean;
  error?: any;
  showAllIssueTypes?: boolean;
}

const MonthlyTypeVolume: React.FC<MonthlyTypeVolumeProps> = ({ employeeIssueData, dateFilter, isLoading = false, error = null, showAllIssueTypes = false }) => {
  // Calculate monthly issue volume using shared utility
  const { labels, data: monthlyData } = calculateMonthlyVolume(employeeIssueData, dateFilter);
  const maxValue = Math.max(...monthlyData, 1); // Ensure at least 1 for proper scaling

  // Calculate dynamic height to match IssueType chart
  const getChartHeight = () => {
    const baseHeight = 500;
    const minHeight = 300;
    const maxHeight = 600;
    
    // Use the same logic as IssueType for consistency
    if (monthlyData.length <= 8) {
      return baseHeight;
    } else if (monthlyData.length <= 15) {
      return Math.min(baseHeight + (monthlyData.length - 8) * 20, maxHeight);
    } else {
      return maxHeight;
    }
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Issue Volume',
        data: monthlyData,
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
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#8B5CF6',
        borderWidth: 1,
        callbacks: {
          title: (context: any) => {
            return `${context[0].label} ${new Date().getFullYear()}`;
          },
          label: (context: any) => {
            return `Issues: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.ceil(maxValue * 1.2), // Add 20% padding
        ticks: {
          stepSize: Math.max(1, Math.ceil(maxValue / 5)),
          color: '#6b7280',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            // Only show values that are multiples of the step size
            const stepSize = Math.max(1, Math.ceil(maxValue / 5));
            return value % stepSize === 0 ? value : '';
          }
        },
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
          borderDash: [3, 3],
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

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Issue Volume</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Issue Volume</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading monthly issue volume data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Monthly Issue Volume {dateFilter?.from && dateFilter?.to ? `(${new Date(dateFilter.from).toLocaleDateString('en-US', { month: 'short' })} - ${new Date(dateFilter.to).toLocaleDateString('en-US', { month: 'long' })} ${new Date(dateFilter.from).getFullYear()})` : `(${labels.length > 0 ? `${labels[0]} - ${labels[labels.length - 1]} ${new Date().getFullYear()}` : 'No Data'})`}
        </h3>
      </div>
      
      <div style={{ height: `${getChartHeight()}px` }}>
        {monthlyData.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-lg font-semibold mb-2">No Data Available</div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {monthlyData.length > 0 && (
        <div className="flex justify-center mt-2">
          <div className="flex items-center space-x-2">
            <AverageLegendIcon />
            <span className="text-lg text-gray-600">Monthly Issue Volume</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyTypeVolume;
