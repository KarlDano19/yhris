// Utility functions for exit reasons calculations

export interface ExitReasonData {
  reason: string;
  count: number;
}

export interface ExitReasonsResult {
  exitReasonsData: ExitReasonData[];
  uniquePositions: string[];
  titleText: string;
}

export const calculateExitReasonsData = (
  separationData?: any,
  selectedPositionFilter: string = 'All Positions'
): ExitReasonsResult => {
  if (!separationData || !Array.isArray(separationData)) {
    return {
      exitReasonsData: [],
      uniquePositions: [],
      titleText: 'No data available'
    };
  }

  // Filter by position if selected
  let filteredData = separationData;
  if (selectedPositionFilter !== 'All Positions') {
    filteredData = separationData.filter((separation: any) => 
      separation.position === selectedPositionFilter
    );
  }

  // Count separations by reason
  const reasonCounts: { [key: string]: number } = {};

  filteredData.forEach((separation: any) => {
    const reason = separation.reason_of_leaving || 'Unknown';
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });

  // Convert to array format
  const exitReasonsData = Object.entries(reasonCounts)
    .map(([reason, count]) => ({
      reason,
      count
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // Get unique positions from separation data
  const positions = new Set<string>();
  separationData.forEach((separation: any) => {
    if (separation.position) {
      positions.add(separation.position);
    }
  });
  
  const uniquePositions = Array.from(positions).sort();

  // Get the title text for exit reasons
  const titleText = separationData.length > 0 
    ? (selectedPositionFilter !== 'All Positions' ? selectedPositionFilter : '')
    : 'No data available';

  return {
    exitReasonsData,
    uniquePositions,
    titleText
  };
};
