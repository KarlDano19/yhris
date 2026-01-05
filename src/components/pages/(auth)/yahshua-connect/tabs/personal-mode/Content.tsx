'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BriefcaseIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import useGetApplicationByUser from '@/components/pages/(auth)/applicant/application-tracker/hooks/useGetApplicationByUser';
import useGetHighMatchJobs from '../../hooks/useGetHighMatchJobs';
import useGetSavedJobs from '../../hooks/useGetSavedJobs';
import formatPrice from '@/helpers/currencyFormat';
import JobCard from './pages/jobs/components/JobCard';
import JobDetails from './pages/jobs/components/JobDetails';
import AlmostThereJobCard from './components/cards/AlmostThereJobCard';
import TrainingCard from './components/cards/TrainingCard';

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

  const almostThereJob = {
    title: 'Senior UX/UI Designer',
    company: 'The ABBA Initiative, OPC',
    matchPercentage: 85,
    missingSkills: ['Design System', 'UX Psychology'],
    logo: 'A',
  };

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
              <div key={job.id}>
                <JobCard
                  {...job}
                  isSelected={selectedJobId === job.id}
                  onCardClick={() => handleJobCardClick(job.id)}
                  onApply={() => router.push(`/personal-mode/job-applicant-form/${job.id}`)}
                />
                {/* Show job details below the card when selected */}
                {selectedJobId === job.id && (
                  <JobDetails 
                    jobId={job.id} 
                    onClose={handleCloseJobDetails}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Single Column Layout for Almost-There Jobs and Recommended Training */}
      {/* <div className="space-y-6">
        <AlmostThereJobCard {...almostThereJob} />
        <TrainingCard {...recommendedTraining} />
      </div> */}
    </div>
  );
};

export default Content;
