import React, { useMemo } from 'react';

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

interface PoliciesAcknowledgementTrendProps {
  acknowledgementData?: any;
  dateFilter?: {
    from: string;
    to: string;
  };
}

const PoliciesAcknowledgementTrend: React.FC<PoliciesAcknowledgementTrendProps> = ({ 
  acknowledgementData, 
  dateFilter 
}) => {
  // Calculate Policies Acknowledgement Trend using dummy data
  const acknowledgementTrendData = useMemo(() => {
    // Dummy data for visualization - upward trend from 70% to 80%
    return [
      { month: 'January', score: 70 },
      { month: 'February', score: 75 },
      { month: 'March', score: 80 }
    ];
  }, [acknowledgementData, dateFilter]);

  const data = {
    labels: acknowledgementTrendData.map(item => item.month),
    datasets: [
      {
        label: 'Acknowledgement Rate',
        data: acknowledgementTrendData.map(item => item.score),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.3)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'white',
        pointBorderColor: '#F59E0B',
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
        borderColor: '#F59E0B',
        borderWidth: 1,
        callbacks: {
          title: (context: any) => {
            return context[0].label;
          },
          label: (context: any) => {
            const score = context.parsed.y;
            return `Acknowledgement Rate: ${score}%`;
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

  return (
    <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 flex-shrink-0"></div>
        <h3 className="text-lg font-semibold text-gray-900 text-center flex-1 px-4">
          Policies Acknowledgement Trend (Jan - Mar 2025)
        </h3>
        <div className="w-10 flex-shrink-0"></div>
      </div>
      
      <div style={{ height: '300px' }} className="transition-all duration-300 ease-in-out">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default PoliciesAcknowledgementTrend;
