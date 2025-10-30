import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EmployeeScore {
  name: string;
  scores: number[];
  averageScore: number;
}

interface QuestionResponseBarChartProps {
  employeeScores: EmployeeScore[];
  questionText?: string;
}

const QuestionResponseBarChart = ({ 
  employeeScores,
  questionText 
}: QuestionResponseBarChartProps) => {
  // Helper function to prepare horizontal bar chart data
  const prepareHorizontalBarChartData = (scores: EmployeeScore[]) => {
    if (!scores || scores.length === 0) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: scores.map(emp => emp.name),
      datasets: [{
        label: 'Average Score',
        data: scores.map(emp => emp.averageScore),
        backgroundColor: scores.map((_, index) => {
          const colors = [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
            '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
          ];
          return colors[index % colors.length];
        }),
        borderColor: scores.map((_, index) => {
          const colors = [
            '#2563EB', '#DC2626', '#059669', '#D97706', '#7C3AED',
            '#DB2777', '#0891B2', '#65A30D', '#EA580C', '#4F46E5'
          ];
          return colors[index % colors.length];
        }),
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 20,
        maxBarThickness: 25,
      }]
    };
  };

  const chartData = prepareHorizontalBarChartData(employeeScores);

  if (chartData.labels.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-sm text-gray-500 italic'>
          No scored responses available for this question
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='h-80'>
        <Bar 
          data={chartData} 
          options={{
            indexAxis: 'y' as const,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#3B82F6',
                borderWidth: 1,
                callbacks: {
                  label: (context: any) => {
                    const employeeName = context.label || '';
                    const score = context.parsed.x || 0;
                    const employeeData = employeeScores.find((emp: EmployeeScore) => emp.name === employeeName);
                    const evaluationCount = employeeData ? employeeData.scores.length : 0;
                    return `${employeeName}: ${score.toFixed(1)} (${evaluationCount} evaluation${evaluationCount !== 1 ? 's' : ''})`;
                  }
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Average Score'
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Employee Name'
                },
                grid: {
                  display: false
                },
                ticks: {
                  autoSkip: false
                }
              }
            }
          }} 
        />
      </div>
      
      {/* Employee Score Details Table */}
      <div className='mt-4'>
        <h6 className='text-sm font-medium text-gray-900 mb-3'>Employee Score Details</h6>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Employee Name
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Average Score
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Evaluations
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Individual Scores
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {employeeScores.map((employee: EmployeeScore, empIndex: number) => (
                <tr key={empIndex} className='hover:bg-gray-50'>
                  <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {employee.name}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                    <span className={`font-medium ${
                      employee.averageScore >= 4 ? 'text-green-600' :
                      employee.averageScore >= 3 ? 'text-yellow-600' :
                      employee.averageScore >= 2 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {employee.averageScore.toFixed(1)}
                    </span>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                      {employee.scores.length} time{employee.scores.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                    <span className='text-xs'>
                      {employee.scores.map((score: number) => Math.round(score)).join(', ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionResponseBarChart;

