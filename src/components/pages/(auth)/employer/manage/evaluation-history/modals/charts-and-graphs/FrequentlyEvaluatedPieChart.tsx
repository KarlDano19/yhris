import { useState, useEffect } from 'react';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

import ColorPaletteModal from '@/components/pages/(auth)/employer/analytics/modals/ColorPaletteModal';

import { Squares2X2Icon } from '@heroicons/react/24/solid';

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
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);

  // Default color palette
  const defaultColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  // Load saved colors on mount
  useEffect(() => {
    const savedColors = localStorage.getItem('frequentlyEvaluatedPieChartColorPalette');
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
    localStorage.setItem('frequentlyEvaluatedPieChartColorPalette', JSON.stringify(colors));
  };

  // Helper function to prepare pie chart data for frequently evaluated employees
  const prepareFrequentlyEvaluatedData = () => {
    if (!frequentlyEvaluatedEmployees || frequentlyEvaluatedEmployees.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Take top 10 most frequently evaluated employees
    const topEmployees = frequentlyEvaluatedEmployees.slice(0, 10);

    const colorsToUse = customColors.length > 0 ? customColors : defaultColors;

    return {
      labels: topEmployees.map((emp: EmployeeEvaluationData) => emp.name),
      datasets: [{
        data: topEmployees.map((emp: EmployeeEvaluationData) => emp.evaluation_count),
        backgroundColor: colorsToUse.slice(0, topEmployees.length),
        borderColor: colorsToUse.slice(0, topEmployees.length),
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

  const colorsToUse = customColors.length > 0 ? customColors : defaultColors;

  return (
    <>
      <div className='flex flex-col h-full'>
        <div className='flex justify-end mb-2'>
          <button
            onClick={() => setIsColorModalOpen(true)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
            title="Customize colors"
          >
            <Squares2X2Icon className="w-4 h-4" />
            Colors
          </button>
        </div>
        <div className='flex-1 min-h-0'>
          <Pie 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right' as const,
                  align: 'center' as const,
                  labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                      size: 11
                    },
                    boxWidth: 12,
                    boxHeight: 12,
                  },
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: '#3B82F6',
                  borderWidth: 1,
                  padding: 12,
                  callbacks: {
                    label: (context: any) => {
                      const label = context.label || '';
                      const value = context.parsed || 0;
                      return `${label}: ${value} evaluation${value !== 1 ? 's' : ''}`;
                    }
                  }
                }
              },
              layout: {
                padding: {
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10
                }
              }
            }} 
          />
        </div>
      </div>

      {/* Color Palette Modal */}
      <ColorPaletteModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSave={handleColorPaletteSave}
        currentColors={chartData.labels.map((_, index) => colorsToUse[index % colorsToUse.length])}
        departmentNames={chartData.labels as string[]}
      />
    </>
  );
};

export default FrequentlyEvaluatedPieChart;

