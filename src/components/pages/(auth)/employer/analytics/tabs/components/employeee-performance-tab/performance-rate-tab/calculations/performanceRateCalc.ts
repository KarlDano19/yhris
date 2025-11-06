// Utility functions for performance rate calculations

export interface DepartmentPerformanceData {
  name: string;
  score: number;
  color: string;
  count: number;
  highestId: number;
}

export interface PerformanceRateData {
  departmentPerformanceData: DepartmentPerformanceData[];
  totalDepartments: number;
}

export const calculateDepartmentPerformance = (
  evaluationData?: any,
  showAllDepartments: boolean = false,
  customColors: string[] = []
): PerformanceRateData => {
  if (!evaluationData) {
    return {
      departmentPerformanceData: [],
      totalDepartments: 0
    };
  }

  // Handle both paginated structure (records) and flat array structure
  const dataArray = evaluationData.records || evaluationData;
  if (!dataArray || dataArray.length === 0) {
    return {
      departmentPerformanceData: [],
      totalDepartments: 0
    };
  }

  // Sort data by ID in descending order to get the latest evaluations first
  const sortedDataArray = [...dataArray].sort((a: any, b: any) => {
    const idA = parseInt(a.id) || 0;
    const idB = parseInt(b.id) || 0;
    return idB - idA;
  });

  // Take only the first 10 latest evaluations if not showing all
  const limitedDataArray = showAllDepartments ? sortedDataArray : sortedDataArray.slice(0, 10);

  // Group evaluations by department
  const departmentGroups: { [key: string]: any[] } = {};
  
  limitedDataArray.forEach((item: any) => {
    const department = item.department || 'Unknown';
    if (!departmentGroups[department]) {
      departmentGroups[department] = [];
    }
    departmentGroups[department].push(item);
  });

  // Generate default colors dynamically (unlimited)
  const generateDistinctColors = (count: number) => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
      '#14B8A6', '#F43F5E', '#8B5A2B', '#9CA3AF', '#64748B',
      '#A855F7', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
    ];
    
    if (count <= colors.length) {
      return colors.slice(0, count);
    }
    
    // Generate additional colors if needed
    const additionalColors = [];
    for (let i = colors.length; i < count; i++) {
      const hue = (i * 137.508) % 360; // Golden angle approximation
      additionalColors.push(`hsl(${hue}, 70%, 60%)`);
    }
    
    return [...colors, ...additionalColors];
  };

  const defaultColors = generateDistinctColors(20);

  // Use custom colors or generate consistent colors based on department name
  const getColorForDepartment = (departmentName: string, index: number) => {
    // First, try to get saved department-specific color mapping
    const savedMapping = localStorage.getItem('departmentColorMapping');
    if (savedMapping) {
      try {
        const departmentColorMap = JSON.parse(savedMapping);
        if (departmentColorMap[departmentName]) {
          return departmentColorMap[departmentName];
        }
      } catch (error) {
        console.error('Error loading department color mapping:', error);
      }
    }
    
    // If no saved mapping, use custom colors by index
    if (customColors.length > 0 && customColors[index]) {
      return customColors[index];
    }
    
    // Otherwise, use default colors or generate consistent colors
    if (defaultColors[index]) {
      return defaultColors[index];
    }
    
    // Fallback to unlimited color generation
    const generatedColors = generateDistinctColors(Math.max(index + 1, 20));
    return generatedColors[index];
  };

  // Calculate performance rate for each department
  const departmentPerformanceData = Object.entries(departmentGroups).map(([department, evaluations], index) => {
    // Calculate average percentage score for this department
    const totalPercentage = evaluations.reduce((sum: number, evaluation: any) => {
      const formScore = parseFloat(evaluation.form_total_score) || parseFloat(evaluation.score) || 0;
      const maxScore = parseFloat(evaluation.max_total_score) || 100;
      const percentage = maxScore > 0 ? (formScore / maxScore) * 100 : 0;
      return sum + percentage;
    }, 0);
    
    const averageScore = evaluations.length > 0 ? totalPercentage / evaluations.length : 0;
    
    // Get the highest ID from evaluations in this department
    const highestId = Math.max(...evaluations.map((evaluation: any) => parseInt(evaluation.id) || 0));
    
    return {
      name: department,
      score: Math.round(averageScore * 100) / 100,
      color: getColorForDepartment(department, index),
      count: evaluations.length,
      highestId: highestId
    };
  });

  // Sort by highest ID in descending order for display order
  const sortedDepartmentData = departmentPerformanceData.sort((a, b) => b.highestId - a.highestId);

  // Calculate total number of departments (before filtering)
  const allDepartmentGroups: { [key: string]: any[] } = {};
  dataArray.forEach((item: any) => {
    const department = item.department || 'Unknown';
    if (!allDepartmentGroups[department]) {
      allDepartmentGroups[department] = [];
    }
    allDepartmentGroups[department].push(item);
  });
  
  const totalDepartments = Object.keys(allDepartmentGroups).length;

  return {
    departmentPerformanceData: sortedDepartmentData,
    totalDepartments
  };
};
