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
          <div role='status' className='text-center'>
            <svg
              aria-hidden='true'
              className='inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
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
