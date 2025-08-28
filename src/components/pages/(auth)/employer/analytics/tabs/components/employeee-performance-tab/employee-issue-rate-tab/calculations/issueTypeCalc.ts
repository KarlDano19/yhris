// Utility functions for issue type distribution calculations

export interface IssueTypeData {
  labels: string[];
  data: number[];
  totalIssues: number;
  percentages: string[];
  colors: string[];
  totalIssueTypes: number;
}

export const calculateIssueTypeDistribution = (
  employeeIssueData?: any[] | {
    records?: any[];
  },
  customColors: string[] = [],
  showAllIssueTypes: boolean = false
): IssueTypeData => {
  // Handle both paginated structure (records) and flat array structure
  const dataArray = Array.isArray(employeeIssueData) ? employeeIssueData : employeeIssueData?.records;
  
  if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
    return {
      labels: ['No Data'],
      data: [1],
      totalIssues: 0,
      percentages: ['100'],
      colors: ['#9CA3AF'],
      totalIssueTypes: 0
    };
  }

  // Count issues by type
  const issueTypeCounts: { [key: string]: number } = {};
  let totalIssues = 0;

  dataArray.forEach((issue: any) => {
    const issueType = issue.issue_type || 'Unspecified';
    issueTypeCounts[issueType] = (issueTypeCounts[issueType] || 0) + 1;
    totalIssues++;
  });

  // Convert to arrays for chart
  const allLabels = Object.keys(issueTypeCounts);
  const allData = Object.values(issueTypeCounts);
  
  // Limit to top 10 issue types if not showing all
  const limitedLabels = showAllIssueTypes ? allLabels : allLabels.slice(0, 10);
  const limitedData = showAllIssueTypes ? allData : allData.slice(0, 10);
  
  // Calculate percentages based on limited data
  const limitedTotalIssues = limitedData.reduce((sum, count) => sum + count, 0);
  const percentages = limitedData.map(count => ((count / limitedTotalIssues) * 100).toFixed(1));

  // Generate default colors dynamically (unlimited)
  const generateDistinctColors = (count: number) => {
    const colors = [
      '#8B5CF6', '#F97316', '#3B82F6', '#EF4444', '#06B6D4',
      '#10B981', '#F59E0B', '#8B5A2B', '#9CA3AF', '#EC4899',
      '#6366F1', '#14B8A6', '#F43F5E', '#64748B', '#A855F7',
      '#84CC16', '#06B6D4', '#F97316', '#EC4899', '#8B5CF6'
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

  // Use custom colors or generate consistent colors based on issue type name
  const getColorForIssueType = (issueTypeName: string, index: number) => {
    // First, try to get saved issue type-specific color mapping
    const savedMapping = localStorage.getItem('issueTypeColorMapping');
    if (savedMapping) {
      try {
        const issueTypeColorMap = JSON.parse(savedMapping);
        if (issueTypeColorMap[issueTypeName]) {
          return issueTypeColorMap[issueTypeName];
        }
      } catch (error) {
        console.error('Error loading issue type color mapping:', error);
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

  // Generate colors for each issue type
  const colors = limitedLabels.map((label: string, index: number) => getColorForIssueType(label, index));

  return {
    labels: limitedLabels,
    data: limitedData,
    totalIssues: limitedTotalIssues,
    percentages,
    colors,
    totalIssueTypes: allLabels.length
  };
}; 