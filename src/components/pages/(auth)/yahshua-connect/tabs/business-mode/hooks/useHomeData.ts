import { getAllJobs, type Job } from './useJobsData';

export interface JobRequest {
  id: number;
  title: string;
  clientName: string;
  clientLocation: string;
  distance: string;
  rating: number;
  hiresCount: number;
  description: string;
  time: string;
  priceRange: string;
  tags: string[];
  urgent: boolean;
}

export interface WeeklyData {
  day: string;
  amount: number;
}

export interface TrendingService {
  id: number;
  name: string;
  iconType: 'tools' | 'bolt' | 'sparkles';
  active: number;
  change: string;
  changeType: 'increase' | 'decrease';
}

export const useHomeData = () => {
  const thisMonthEarnings = 45230;

  const weeklyData: WeeklyData[] = [
    { day: 'W1', amount: 12500 },
    { day: 'W2', amount: 9800 },
    { day: 'W3', amount: 15200 },
    { day: 'W4', amount: 7700 },
  ];

  // Get all jobs (both pending and accepted/scheduled) - same as Find Work
  const allJobs = getAllJobs();
  
  // Transform to JobRequest format for JobRequestCard component
  // Include status so JobRequestCard can show "Scheduled" badge for accepted jobs
  const jobRequests = allJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    clientLocation: job.clientLocation,
    distance: job.distance || '',
    rating: job.rating,
    hiresCount: job.hiresCount || 0,
    description: job.description,
    time: job.time,
    priceRange: job.priceRange,
    tags: job.tags || [],
    urgent: job.urgent,
    status: job.status,
  }));

  const trendingServices: TrendingService[] = [
    {
      id: 1,
      name: 'Plumbing',
      iconType: 'tools',
      active: 34,
      change: '+12%',
      changeType: 'increase',
    },
    {
      id: 2,
      name: 'Electrical',
      iconType: 'bolt',
      active: 28,
      change: '+8%',
      changeType: 'increase',
    },
    {
      id: 3,
      name: 'Cleaning',
      iconType: 'sparkles',
      active: 45,
      change: '+15%',
      changeType: 'increase',
    },
  ];

  return {
    thisMonthEarnings,
    weeklyData,
    jobRequests,
    trendingServices,
  };
};

