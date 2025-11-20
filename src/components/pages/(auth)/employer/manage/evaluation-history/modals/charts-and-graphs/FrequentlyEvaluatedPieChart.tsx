import { useState, useEffect, useMemo } from 'react';

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

  // Memoize top employees to avoid recalculating on every render
  const topEmployees = useMemo(() => {
    if (!frequentlyEvaluatedEmployees || frequentlyEvaluatedEmployees.length === 0) {
      return [];
    }
    // Take top 10 most frequently evaluated employees
    return frequentlyEvaluatedEmployees.slice(0, 10);
  }, [frequentlyEvaluatedEmployees]);

  // Memoize colors to avoid recalculating
  const colorsToUse = useMemo(() => {
    return customColors.length > 0 ? customColors : defaultColors;
  }, [customColors]);

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    if (topEmployees.length === 0) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: topEmployees.map((emp: EmployeeEvaluationData) => emp.name),
      datasets: [{
        data: topEmployees.map((emp: EmployeeEvaluationData) => emp.evaluation_count),
        backgroundColor: colorsToUse.slice(0, topEmployees.length),
        borderColor: colorsToUse.slice(0, topEmployees.length),
        borderWidth: 1,
      }]
    };
  }, [topEmployees, colorsToUse]);

  if (chartData.labels.length === 0) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-gray-500'>No evaluation data available</p>
      </div>
    );
  }

  // Memoize chart options to prevent re-renders
  const chartOptions = useMemo(() => ({
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
  }), []);

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
            options={chartOptions}
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

