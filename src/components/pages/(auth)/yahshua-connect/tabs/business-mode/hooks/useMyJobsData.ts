import { getAllJobs, type Job } from './useJobsData';

export interface ActiveJob {
  id: number;
  title: string;
  clientName: string;
  clientInitials: string;
  location: string;
  time: string;
  priceRange: string;
  status: string;
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

export const useMyJobsData = () => {
  // Get all jobs and filter to show ONLY accepted/scheduled jobs
  const allJobs = getAllJobs();
  
  // Filter jobs that are 'accepted' or 'scheduled'
  const acceptedJobs = allJobs.filter(
    (job) => job.status === 'accepted' || job.status === 'scheduled'
  );
  
  // Transform to ActiveJob format for My Jobs page
  const activeJobs: ActiveJob[] = acceptedJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    clientInitials: job.clientInitials || job.clientName.substring(0, 2).toUpperCase(),
    location: job.location,
    time: job.time,
    priceRange: job.priceRange,
    status: job.status || 'accepted',
    urgent: job.urgent,
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
    activeJobs,
    reviews,
  };
};

