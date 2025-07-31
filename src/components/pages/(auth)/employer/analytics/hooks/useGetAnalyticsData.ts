import { useQuery } from '@tanstack/react-query';

// Fake analytics data
const fakeAnalyticsData = {
  employeePerformance: {
    averageScore: 3.7,
    trainingCompletion: 75,
    improvementRate: 70,
    issueResolution: 75,
    trends: {
      averageScore: 1.7,
      trainingCompletion: 25,
      improvementRate: 30,
      issueResolution: 15
    }
  }
};

async function getAnalyticsData(filters: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return fake data - in real implementation, this would be the API response
  return fakeAnalyticsData;
}

function useGetAnalyticsData(filters: any) {
  const query = useQuery(
    ['analyticsDataCache'],
    () => getAnalyticsData(filters),
    { 
      enabled: true, 
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  return query;
}

export default useGetAnalyticsData; 