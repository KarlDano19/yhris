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

export interface Review {
  id: number;
  reviewerName: string;
  reviewerInitials: string;
  role: string;
  quote: string;
  date: string;
  rating: number;
}

export const useFindWorkData = () => {
  // Get all jobs (both pending and accepted/scheduled) - same as Home
  const allJobs = getAllJobs();
  
  // Transform to JobRequest format for JobRequestCard component
  // Include status so JobRequestCard can show "Scheduled" badge for accepted jobs
  const jobRequests = allJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    clientInitials: job.clientInitials,
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

  const reviews: Review[] = [
    {
      id: 1,
      reviewerName: 'Maria Santos',
      reviewerInitials: 'MS',
      role: 'Client',
      quote: 'Excellent work!',
      date: 'Dec 2025',
      rating: 5,
    },
    {
      id: 2,
      reviewerName: 'Juan Cruz',
      reviewerInitials: 'JC',
      role: 'Client',
      quote: 'Great service!',
      date: 'Nov 2025',
      rating: 5,
    },
  ];

  return {
    jobRequests,
    reviews,
  };
};

