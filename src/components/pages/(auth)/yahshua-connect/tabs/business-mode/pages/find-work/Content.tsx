'use client';

import { useState, useMemo } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import BusinessJobCard from './components/BusinessJobCard';
import JobAcceptedModal from './modals/JobAcceptedModal';
import ChatModal from '../../../../modals/ChatModal';
import BusinessJobDetailsModal from './modals/BusinessJobDetailsModal';
import FilterRequestsModal from '../hire/modals/FilterRequestsModal';
import useFindBusinessJobs from './hooks/useFindBusinessJobs';
import useApplyToBusinessJob from './hooks/useApplyToBusinessJob';
import useGetApplicantProfile from '../../../../hooks/useGetApplicantProfile';
import LoadingSpinner from '@/components/LoadingSpinner';

import { FunnelIcon } from '@heroicons/react/24/outline';
import formatPrice from '@/helpers/currencyFormat';

interface BusinessJobFilters {
  category?: string;
  location?: string | string[];
  date_from?: string;
  date_to?: string;
  min_budget?: number;
  max_budget?: number;
  is_urgent?: boolean;
  status?: string;
  latitude?: number;
  longitude?: number;
}

const Content = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isJobAcceptedModalOpen, setIsJobAcceptedModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(20);
  const [filters, setFilters] = useState<BusinessJobFilters>({});

  // Get applicant profile for location coordinates (distance calculation)
  const { data: profileData } = useGetApplicantProfile();
  const applicantLatitude = profileData?.data?.latitude;
  const applicantLongitude = profileData?.data?.longitude;

  // Apply to business job mutation
  const applyToBusinessJobMutation = useApplyToBusinessJob();

  // Merge applicant location with filters for distance calculation
  const filtersWithLocation = useMemo(() => ({
    ...filters,
    ...(applicantLatitude && applicantLongitude ? {
      latitude: applicantLatitude,
      longitude: applicantLongitude,
    } : {}),
  }), [filters, applicantLatitude, applicantLongitude]);

  // Fetch business jobs with filters (including location for distance calculation)
  const {
    data: jobsData,
    isLoading: isGetJobsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalRecords
  } = useFindBusinessJobs(filtersWithLocation);

  // Transform API business jobs data to BusinessJobCard format
  const transformedJobs = useMemo(() => {
    if (!jobsData || jobsData.length === 0) return [];

    return jobsData.slice(0, displayCount).map((job: any) => {
      // Get client initials from created_by_name
      const getClientInitials = (clientName: string) => {
        if (!clientName) return '?';
        const words = clientName.trim().split(/\s+/);
        if (words.length >= 2) {
          return (words[0][0] + words[1][0]).toUpperCase();
        }
        return clientName.substring(0, 2).toUpperCase();
      };

      // Format price range
      const formatPriceRange = () => {
        if (job.budget_type === 'Range' && job.min_amount && job.max_amount) {
          return `₱ ${formatPrice(job.min_amount)} - ₱ ${formatPrice(job.max_amount)}`;
        } else if (job.hourly_rate) {
          return `₱ ${formatPrice(job.hourly_rate)}/hour`;
        } else if (job.min_amount) {
          return `₱ ${formatPrice(job.min_amount)}`;
        } else if (job.max_amount) {
          return `₱ ${formatPrice(job.max_amount)}`;
        }
        return 'Price not specified';
      };

      // Format date and time
      const formatTime = () => {
        if (!job.date) return 'Date not specified';
        
        const dateStr = job.date;
        const date = new Date(dateStr);
        const dateFormatted = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
        
        if (job.time_from && job.time_to) {
          return `${dateFormatted}, ${job.time_from} - ${job.time_to}`;
        } else if (job.time_from) {
          return `${dateFormatted}, ${job.time_from}`;
        }
        return dateFormatted;
      };

      // Format distance
      const formatDistance = () => {
        if (job.distance_km !== null && job.distance_km !== undefined) {
          return `${job.distance_km} km away`;
        }
        return '';
      };

      // Get category as tags
      const getTags = () => {
        const tags = [];
        if (job.category) {
          tags.push(job.category);
        }
        return tags;
      };

      // Determine status - check if user has applied
      const getStatus = () => {
        if (job.has_applied) {
          return 'accepted' as const; // Show as accepted to display Message button
        }
        return 'pending' as const;
      };

      return {
        id: job.id,
        title: job.job_title || 'Untitled Job',
        clientName: job.created_by_name || 'Unknown Client',
        clientId: job.created_by, // Include client ID
        clientInitials: getClientInitials(job.created_by_name || ''),
        clientPhoto: job.created_by_photo || null,
        clientLocation: job.location || 'Location not specified',
        distance: formatDistance(),
        rating: job.created_by_rating || 0,
        hiresCount: job.created_by_reviews_count || 0,
        description: job.description || 'No description provided',
        time: formatTime(),
        priceRange: formatPriceRange(),
        tags: getTags(),
        urgent: job.is_urgent || false,
        status: getStatus(),
        hasApplied: job.has_applied || false,
      };
    });
  }, [jobsData, displayCount]);

  const handleLoadMore = () => {
    // Check if there are more jobs in the current fetched batch
    const jobsInCurrentBatch = jobsData?.length || 0;
    const nextDisplayCount = displayCount + 20;
    
    // If there are more jobs to show from current batch
    if (displayCount < jobsInCurrentBatch) {
      // Show next 20 jobs (or remaining jobs if less than 20)
      setDisplayCount(Math.min(nextDisplayCount, jobsInCurrentBatch));
    } else if (hasNextPage && !isFetchingNextPage) {
      // We've shown all jobs from current batch, fetch next page (next 200 jobs)
      fetchNextPage().then(() => {
        // Update displayCount after new data is fetched
        setDisplayCount(nextDisplayCount);
      });
    }
  };

  const handleApplyFilters = (newFilters: {
    location?: string;
    skills?: string[];
    urgentOnly?: boolean;
    category?: string;
    min_budget?: number;
    max_budget?: number;
    date_from?: string;
    date_to?: string;
  }) => {
    const businessFilters: BusinessJobFilters = {};
    
    if (newFilters.location) {
      businessFilters.location = newFilters.location;
    }
    if (newFilters.category) {
      businessFilters.category = newFilters.category;
    }
    if (newFilters.urgentOnly) {
      businessFilters.is_urgent = true;
    }
    if (newFilters.min_budget !== undefined) {
      businessFilters.min_budget = newFilters.min_budget;
    }
    if (newFilters.max_budget !== undefined) {
      businessFilters.max_budget = newFilters.max_budget;
    }
    if (newFilters.date_from) {
      businessFilters.date_from = newFilters.date_from;
    }
    if (newFilters.date_to) {
      businessFilters.date_to = newFilters.date_to;
    }
    
    setFilters(businessFilters);
    setDisplayCount(20); // Reset display count when filters change
    setSelectedJobId(null); // Reset selected job when filters change
  };

  const handleAcceptJob = async (jobId: number) => {
    try {
      setSelectedJobId(jobId);
      
      // Check if already applied
      const job = jobsData?.find((j: any) => j.id === jobId);
      if (job?.has_applied) {
        // If already applied, just open the chat modal
        if (job?.created_by) {
          setSelectedClientId(job.created_by);
        }
        setIsChatModalOpen(true);
        setIsJobDetailsModalOpen(false); // Ensure details modal is closed
        return;
      }
      
      await applyToBusinessJobMutation.mutateAsync(jobId);

      // Get client ID from job data
      if (job?.created_by) {
        setSelectedClientId(job.created_by);
      }

      setIsJobAcceptedModalOpen(true);
      setIsJobDetailsModalOpen(false); // Close details modal after accepting job
      toast.custom(() => (
        <CustomToast message="Application submitted successfully!" type="success" />
      ), { duration: 2000 });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to submit application';
      
      // If already applied, open chat instead of showing error
      if (errorMessage.includes('already applied')) {
        const job = jobsData?.find((j: any) => j.id === jobId);
        if (job?.created_by) {
          setSelectedClientId(job.created_by);
        }
        setIsChatModalOpen(true);
        setIsJobDetailsModalOpen(false); // Ensure details modal is closed
        // Refetch jobs to update has_applied status
        // This will be handled by the query invalidation in the mutation
      } else {
        toast.custom(() => (
          <CustomToast message={errorMessage} type="error" />
        ), { duration: 3000 });
      }
    }
  };

  const handleMessage = (jobId: number) => {
    setSelectedJobId(jobId);
    // Get client ID from job data
    const job = jobsData?.find((j: any) => j.id === jobId);
    if (job?.created_by) {
      setSelectedClientId(job.created_by);
    }
    setIsChatModalOpen(true);
    setIsJobDetailsModalOpen(false); // Ensure details modal is closed
  };

  const handleViewDetails = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsJobDetailsModalOpen(true);
    setIsChatModalOpen(false); // Ensure chat modal is closed
  };

  const handleMessageClient = () => {
    setIsJobAcceptedModalOpen(false);
    setIsChatModalOpen(true);
    setIsJobDetailsModalOpen(false); // Ensure details modal is closed
  };


  const selectedJobFull = selectedJobId
    ? transformedJobs.find((job) => job.id === selectedJobId)
    : null;

  return (
    <div className="space-y-6">
      {/* Find Work Header */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Find Work</h2>
            <p className="text-sm text-gray-600">Browse available job requests near you</p>
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </button>
        </div>

        {/* Job Requests List */}
        {isGetJobsLoading ? (
          <LoadingSpinner size="lg" showText text="Loading jobs..." className="py-12" />
        ) : transformedJobs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">No jobs available at the moment.</div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {transformedJobs.map((job) => (
                <BusinessJobCard
                  key={job.id}
                  {...job}
                  onAcceptJob={handleAcceptJob}
                  onMessage={handleMessage}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
            {/* Load More Button */}
            {(displayCount < (totalRecords || 0) || displayCount < (jobsData?.length || 0) || hasNextPage) && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More Jobs'}
                </button>
              </div>
            )}
            {totalRecords > 0 && (
              <div className="text-sm text-gray-600 text-center mt-4">
                Showing {Math.min(displayCount, totalRecords)} of {totalRecords} jobs
              </div>
            )}
          </>
        )}
      </div>

      {/* Page-specific Modals */}
      <FilterRequestsModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Job Accepted Modal */}
      {selectedJobFull && selectedJobId && (
        <JobAcceptedModal
          isOpen={isJobAcceptedModalOpen}
          onClose={() => {
            setIsJobAcceptedModalOpen(false);
            setSelectedJobId(null);
          }}
          jobDetails={{
            title: selectedJobFull.title,
            clientName: selectedJobFull.clientName,
            time: selectedJobFull.time,
            priceRange: selectedJobFull.priceRange,
          }}
          onMessageClient={handleMessageClient}
        />
      )}

      {/* Business Job Details Modal */}
      {selectedJobId && (
        <BusinessJobDetailsModal
          isOpen={isJobDetailsModalOpen}
          onClose={() => {
            setIsJobDetailsModalOpen(false);
            setSelectedJobId(null);
          }}
          jobId={selectedJobId}
          onAcceptJob={handleAcceptJob}
        />
      )}

      {/* Chat Modal */}
      {selectedJobFull && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedJobId(null);
            setSelectedClientId(null);
          }}
          recipientId={selectedClientId || selectedJobFull.clientId}
          recipientName={selectedJobFull.clientName}
          recipientInitials={selectedJobFull.clientInitials || ''}
          recipientPhoto={selectedJobFull.clientPhoto || null}
          jobTitle={selectedJobFull.title}
          jobId={selectedJobId || undefined}
        />
      )}
    </div>
  );
};

export default Content;
