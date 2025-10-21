import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface EmployeeEvaluationData {
  name: string;
  department: string;
  evaluation_count: number;
  total_score: number;
  average_score: number;
}

interface FrequentlyEvaluatedPieChartProps {
  frequentlyEvaluatedEmployees: EmployeeEvaluationData[];
}

const FrequentlyEvaluatedPieChart = ({ 
  frequentlyEvaluatedEmployees 
}: FrequentlyEvaluatedPieChartProps) => {
  // Helper function to prepare pie chart data for frequently evaluated employees
  const prepareFrequentlyEvaluatedData = () => {
    if (!frequentlyEvaluatedEmployees || frequentlyEvaluatedEmployees.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Take top 10 most frequently evaluated employees
    const topEmployees = frequentlyEvaluatedEmployees.slice(0, 10);

    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];

    return {
      labels: topEmployees.map((emp: EmployeeEvaluationData) => emp.name),
      datasets: [{
        data: topEmployees.map((emp: EmployeeEvaluationData) => emp.evaluation_count),
        backgroundColor: colors.slice(0, topEmployees.length),
        borderColor: colors.slice(0, topEmployees.length),
        borderWidth: 1,
      }]
    };
  };

  const chartData = prepareFrequentlyEvaluatedData();

  if (chartData.labels.length === 0) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-gray-500'>No evaluation data available</p>
      </div>
    );
  }

  return (
    <Pie 
      data={chartData} 
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right' as const,
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#3B82F6',
            borderWidth: 1,
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value} evaluation${value !== 1 ? 's' : ''}`;
              }
            }
          }
        }
      }} 
    />
  );
};

export default FrequentlyEvaluatedPieChart;

