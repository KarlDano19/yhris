import { getAllJobs, type Job } from './useJobsData';
import { useJobState } from '../contexts/JobStateContext';

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
  const { acceptedJobIds } = useJobState();
  
  // Get all jobs and filter to show ONLY accepted/scheduled jobs
  const allJobs = getAllJobs();
  
  // Filter jobs that are hardcoded as 'accepted' or 'scheduled'
  const hardcodedAcceptedJobs = allJobs.filter(
    (job) => job.status === 'accepted' || job.status === 'scheduled'
  );
  
  // Filter jobs that are newly accepted via the JobStateContext
  const newlyAcceptedJobs = allJobs.filter(
    (job) => acceptedJobIds.has(job.id) && !hardcodedAcceptedJobs.some(h => h.id === job.id)
  );
  
  // Combine both sets of accepted jobs
  const combinedAcceptedJobs = [...hardcodedAcceptedJobs, ...newlyAcceptedJobs];
  
  // Transform to ActiveJob format for My Jobs page
  const activeJobs: ActiveJob[] = combinedAcceptedJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    clientInitials: job.clientInitials || job.clientName.substring(0, 2).toUpperCase(),
    location: job.location,
    time: job.time,
    priceRange: job.priceRange,
    status: job.status || 'accepted', // Default to 'accepted' for newly accepted jobs
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

