'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import useGetApplicationByUser from '@/components/pages/(auth)/applicant/application-tracker/hooks/useGetApplicationByUser';
import useGetHighMatchJobs from '../../hooks/useGetHighMatchJobs';
import useGetSavedJobs from '../../hooks/useGetSavedJobs';
import JobCard from './components/JobCard';
import JobDetailsModal from './modals/JobDetailsModal';

import { BriefcaseIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';

import formatPrice from '@/helpers/currencyFormat';

interface ContentProps {
  averageRating?: number | null;
}

const Content = ({ averageRating }: ContentProps) => {
  const router = useRouter();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Fetch applications data
  const { data: applicationsData, isLoading: isApplicationsLoading } = useGetApplicationByUser({});

  // Fetch matched jobs (only jobs with matching skills, sorted by match)
  const { data: highMatchJobsData, isLoading: isHighMatchJobsLoading } = useGetHighMatchJobs({
    limit: 10, // Show top 10 jobs with matching skills
  });

  // Fetch saved jobs to check which jobs are saved
  const { data: savedJobsData } = useGetSavedJobs();

  // Calculate counts - handle response structure (might be wrapped in 'data' field or array directly)
  const applicationsCount = useMemo(() => {
    if (!applicationsData) return 0;
    
    // Handle wrapped response structure
    const applications = applicationsData.data || applicationsData;
    
    if (!Array.isArray(applications)) return 0;
    return applications.length;
  }, [applicationsData]);

  // Trainings in progress count (placeholder - TODO: implement when API is available)
  const trainingsInProgressCount = 1;

  // Rating from applicant profile (passed from PersonalModeLayout)
  const rating = averageRating !== null && averageRating !== undefined ? averageRating : null;

  // Create a Set of saved job IDs for quick lookup
  const savedJobIds = useMemo(() => {
    if (!savedJobsData || !Array.isArray(savedJobsData)) return new Set<number>();
    return new Set(
      savedJobsData
        .map((savedJob: any) => {
          return savedJob.job_posting?.id || savedJob.job_posting_id || savedJob.job_posting;
        })
        .filter((id: any) => id != null && id !== undefined)
    );
  }, [savedJobsData]);

  // Create a Set of applied job IDs
  const appliedJobIds = useMemo(() => {
    if (!applicationsData || !Array.isArray(applicationsData)) return new Set<number>();
    return new Set(
      applicationsData
        .map((app: any) => app.job_posting?.id || app.job_posting_id)
        .filter((id: any) => id != null && id !== undefined)
    );
  }, [applicationsData]);

  // Transform high match jobs data to JobCard format
  const jobsMatched = useMemo(() => {
    if (!highMatchJobsData || !Array.isArray(highMatchJobsData) || highMatchJobsData.length === 0) {
      return [];
    }

    return highMatchJobsData.map((job: any) => {
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
        saved: savedJobIds.has(job.id),
        match: job.match_percentage || 0,
        applied: appliedJobIds.has(job.id),
      };
    });
  }, [highMatchJobsData, savedJobIds, appliedJobIds]);

  const recommendedTraining = {
    title: 'Mastering Design System',
    duration: '3 hrs',
    level: 'Intermediate',
    price: 'FREE',
  };

  const handleJobCardClick = (jobId: number) => {
    // Toggle: if same job is clicked, close it; otherwise, open the new one
    setSelectedJobId(selectedJobId === jobId ? null : jobId);
  };

  const handleCloseJobDetails = () => {
    setSelectedJobId(null);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Applications Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <BriefcaseIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {isApplicationsLoading ? '...' : applicationsCount}
              </p>
              <p className="text-sm text-gray-600">Applications</p>
            </div>
          </div>
        </div>

        {/* Trainings In Progress Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Coming Soon</p>
            </div>
          </div>
        </div>
        {/* 
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{trainingsInProgressCount}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </div>
        */}

        {/* Rating Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {rating !== null && rating !== undefined ? rating : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Matched */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Jobs Matched</h2>
          <p className="text-sm text-gray-600">Jobs that match with you!</p>
        </div>

        {isHighMatchJobsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading matched jobs...</div>
          </div>
        ) : jobsMatched.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">No high match jobs found at the moment.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {jobsMatched.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                isSelected={selectedJobId === job.id}
                onCardClick={() => handleJobCardClick(job.id)}
                onApply={() => router.push(`/personal-mode/job-applicant-form/${job.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recommended Training */}
      {/* <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-1">Recommended Training(s)</h3>
            <p className="text-sm text-gray-600">Start training to fill in knowledge & skill gaps.</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{recommendedTraining.title}</h4>
                <p className="text-xs text-gray-600 mb-2">
                  {recommendedTraining.duration} | {recommendedTraining.level}
                </p>
                <div className="inline-block">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {recommendedTraining.price}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {}}
              className="w-full bg-savoy-blue text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              Start Course
            </button>
          </div>
        </div>
      </div> */}

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={selectedJobId !== null}
        onClose={handleCloseJobDetails}
        jobId={selectedJobId}
      />
    </div>
  );
};

export default Content;
