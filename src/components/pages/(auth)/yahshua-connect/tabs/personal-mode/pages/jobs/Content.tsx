'use client';

import { useState, useMemo, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import useFindJobs from './hooks/useFindJobs';
import JobFiltersModal from '../../modals/JobFIltersModal';
import JobCard from '../../components/JobCard';
import JobDetailsModal from '../../modals/JobDetailsModal';
import LoadingSpinner from '@/components/LoadingSpinner';

import { FunnelIcon } from '@heroicons/react/24/outline';

import formatPrice from '@/helpers/currencyFormat';


interface JobFilters {
  job_title?: string;
  location?: string[];
}

const Content = () => {
  const router = useRouter();
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState<number>(20);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [highlightedJobId, setHighlightedJobId] = useState<number | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const searchParams = useSearchParams();

  // Fetch jobs with filters and match percentage using applicant_personal view type
  const {
    data: jobsData,
    isLoading: isGetJobsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalRecords
  } = useFindJobs({
    ...filters,
    useApplicantPersonal: true, // Use applicant_personal view type for match percentage
  });

  // Get saved jobs data from cache
  const queryClient = useQueryClient();
  const cachedSavedJobs = queryClient
    .getQueryCache()
    .find(['savedJobsCache']) as {
    state: { data: any[] } | undefined;
  };
  const savedJobsData = cachedSavedJobs?.state?.data;
  
  // Create a Set of saved job IDs for quick lookup
  const savedJobIds = useMemo(() => {
    if (!savedJobsData || !Array.isArray(savedJobsData)) return new Set<number>();
    return new Set(
      savedJobsData
        .map((savedJob: any) => {
          // Handle both response formats: job_posting object or job_posting_id
          return savedJob.job_posting?.id || savedJob.job_posting_id || savedJob.job_posting;
        })
        .filter((id: any) => id != null && id !== undefined)
    );
  }, [savedJobsData]);


  // Transform API jobs data to JobCard format
  const transformedJobs = useMemo(() => {
    if (!jobsData || jobsData.length === 0) return [];

    return jobsData.slice(0, displayCount).map((job: any) => {
      // Get company initials for logo
      const getCompanyInitials = (companyName: string) => {
        if (!companyName) return '?';
        const words = companyName.trim().split(/\s+/);
        if (words.length >= 2) {
          return (words[0][0] + words[1][0]).toUpperCase();
        }
        return companyName.substring(0, 2).toUpperCase();
      };

      // Format salary
      const formatSalary = () => {
        if (!job.salary_range_type) return 'Salary not disclosed';
        
        if (job.salary_range_type === 'Range' && job.minimum_amount && job.maximum_amount) {
          return `₱ ${formatPrice(job.minimum_amount)} - ₱ ${formatPrice(job.maximum_amount)}`;
        } else if (job.exact_amount) {
          return `₱ ${formatPrice(job.exact_amount)}`;
        }
        return 'Salary not disclosed';
      };

      // Format job type
      const formatJobType = () => {
        if (!job.job_type) return 'Full-time';
        if (typeof job.job_type === 'string') {
          return job.job_type.split(',')[0].trim();
        }
        return 'Full-time';
      };

      // Get skills as tags
      const getTags = () => {
        if (!job.skills) return [];
        if (Array.isArray(job.skills)) {
          return job.skills.slice(0, 3); // Show max 3 skills
        }
        if (typeof job.skills === 'string') {
          try {
            const parsed = JSON.parse(job.skills);
            return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
          } catch {
            return job.skills.split(',').slice(0, 3).map((s: string) => s.trim());
          }
        }
        return [];
      };

      return {
        id: job.id,
        title: job.title || job.job_title || 'Untitled Job',
        company: job.company || 'Unknown Company',
        location: job.location || job.advertise_to || 'Location not specified',
        type: formatJobType(),
        salary: formatSalary(),
        tags: getTags(),
        logo: getCompanyInitials(job.company || '?'),
        logoUrl: job.company_logo || undefined,
        saved: savedJobIds.has(job.id), // Check if job is saved
        match: job.match_percentage || 0,
        applied: job.applied || false, // Applied status from backend
      };
    });
  }, [jobsData, displayCount, savedJobIds]);

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

  const handleJobCardClick = (jobId: number) => {
    // Toggle: if same job is clicked, close it; otherwise, open the new one
    setSelectedJobId(selectedJobId === jobId ? null : jobId);
  };

  // Open job details when URL contains job_id (used by notifications)
  useEffect(() => {
    try {
      const jobIdParam = searchParams?.get?.('job_id');
      if (!jobIdParam) return;
      const parsedJobId = Number(jobIdParam);
      if (Number.isNaN(parsedJobId)) return;

      setSelectedJobId(parsedJobId);
      setHighlightedJobId(parsedJobId);
      // scroll & highlight
      setTimeout(() => {
        try {
          const el = document.getElementById(`job-${parsedJobId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-yellow-300', 'ring-opacity-60');
            setTimeout(() => {
              el.classList.remove('ring-4', 'ring-yellow-300', 'ring-opacity-60');
            }, 3000);
          }
        } catch (err) {
          // ignore
        }
      }, 200);

      try {
        router.replace('/personal-mode/jobs');
      } catch (err) {}
    } catch (e) {
      // ignore
    }
  }, [searchParams?.toString(), router]);

  const handleCloseJobDetails = () => {
    setSelectedJobId(null);
  };


  return (
    <div className="space-y-6">
      {/* Browse Jobs Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Browse Jobs</h2>
          </div>
          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Jobs List - Single Column */}
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
                <JobCard
                  key={job.id}
                  {...job}
                  isSelected={selectedJobId === job.id}
                  isHighlighted={highlightedJobId === job.id}
                  onCardClick={() => handleJobCardClick(job.id)}
                  onApply={() => router.push(`/personal-mode/job-applicant-form/${job.id}`)}
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

      {/* Job Filters Modal */}
      {isFiltersModalOpen && (
        <JobFiltersModal
          isOpen={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
          filters={filters}
          onApplyFilters={(newFilters) => {
            setFilters(newFilters);
            setDisplayCount(20); // Reset display count when filters change
            setSelectedJobId(null); // Reset selected job when filters change
          }}
        />
      )}

      {/* Job Details Modal */}
      {selectedJobId !== null && (
        <JobDetailsModal
          isOpen={selectedJobId !== null}
          onClose={handleCloseJobDetails}
          jobId={selectedJobId}
        />
      )}
    </div>
  );
};

export default Content;