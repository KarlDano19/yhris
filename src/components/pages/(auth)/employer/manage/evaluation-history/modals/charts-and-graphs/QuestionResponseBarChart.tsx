import { useState, useEffect } from 'react';

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

import ColorPaletteModal from '@/components/pages/(auth)/employer/analytics/modals/ColorPaletteModal';

import { Squares2X2Icon } from '@heroicons/react/24/solid';

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
  maxScore?: number;
}

const QuestionResponseBarChart = ({ 
  employeeScores,
  questionText,
  maxScore
}: QuestionResponseBarChartProps) => {
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);

  // Default color palette
  const defaultColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  // Load saved colors on mount
  useEffect(() => {
    const savedColors = localStorage.getItem('questionResponseColorPalette');
    if (savedColors) {
      try {
        setCustomColors(JSON.parse(savedColors));
      } catch (error) {
        console.error('Error loading saved color palette:', error);
      }
    }
  }, []);

  // Handle color palette save
  const handleColorPaletteSave = (colors: string[]) => {
    setCustomColors(colors);
    localStorage.setItem('questionResponseColorPalette', JSON.stringify(colors));
  };

  // Helper function to prepare horizontal bar chart data
  const prepareHorizontalBarChartData = (scores: EmployeeScore[]) => {
    if (!scores || scores.length === 0) {
      return { labels: [], datasets: [] };
    }

    const colorsToUse = customColors.length > 0 ? customColors : defaultColors;

    return {
      labels: scores.map(emp => emp.name),
      datasets: [{
        label: 'Average Score',
        data: scores.map(emp => emp.averageScore),
        backgroundColor: scores.map((_, index) => colorsToUse[index % colorsToUse.length]),
        borderColor: scores.map((_, index) => colorsToUse[index % colorsToUse.length]),
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

  const colorsToUse = customColors.length > 0 ? customColors : defaultColors;

  return (
    <>
      <div className='space-y-3'>
        <div className='flex justify-end'>
          <button
            onClick={() => setIsColorModalOpen(true)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
            title="Customize colors"
          >
            <Squares2X2Icon className="w-4 h-4" />
            Colors
          </button>
        </div>
        <div className='h-72'>
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
      <div className='mt-3'>
        <h6 className='text-sm font-medium text-gray-900 mb-2'>Employee Score Details</h6>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Employee Name
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Average Score
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Evaluations
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  High Score
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Low Score
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {employeeScores.map((employee: EmployeeScore, empIndex: number) => {
                const highScore = employee.scores.length > 0 ? Math.max(...employee.scores) : 0;
                const lowScore = employee.scores.length > 0 ? Math.min(...employee.scores) : 0;
                
                return (
                  <tr key={empIndex} className='hover:bg-gray-50'>
                    <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center'>
                      {employee.name}
                    </td>
                    <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center'>
                      <span className={`font-medium ${
                        employee.averageScore >= 4 ? 'text-green-600' :
                        employee.averageScore >= 3 ? 'text-yellow-600' :
                        employee.averageScore >= 2 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {employee.averageScore.toFixed(1)}
                      </span>
                    </td>
                    <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                        {employee.scores.length} time{employee.scores.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className='px-4 py-2 whitespace-nowrap text-sm text-center'>
                      <span className='font-semibold text-green-700'>
                        {Math.round(highScore)}
                      </span>
                    </td>
                    <td className='px-4 py-2 whitespace-nowrap text-sm text-center'>
                      <span className='font-semibold text-red-700'>
                        {Math.round(lowScore)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Color Palette Modal */}
    <ColorPaletteModal
      isOpen={isColorModalOpen}
      onClose={() => setIsColorModalOpen(false)}
      onSave={handleColorPaletteSave}
      currentColors={chartData.labels.map((_, index) => colorsToUse[index % colorsToUse.length])}
      departmentNames={employeeScores.map(emp => emp.name)}
    />
  </>
  );
};

export default QuestionResponseBarChart;

