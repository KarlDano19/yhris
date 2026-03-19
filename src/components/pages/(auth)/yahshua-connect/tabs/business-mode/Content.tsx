'use client';

import { useState, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import BusinessJobCard from './pages/find-work/components/BusinessJobCard';
import FilterRequestsModal from './modals/FilterRequestsModal';
import JobAcceptedModal from './pages/find-work/modals/JobAcceptedModal';
import ConfirmAcceptJobModal from './pages/find-work/modals/ConfirmAcceptJobModal';
import ChatMessagesModal from '@/components/common/chat/ChatMessagesModal';
import BusinessJobDetailsModal from './pages/find-work/modals/BusinessJobDetailsModal';
import CustomToast from '@/components/CustomToast';
import useGetDashboardOverview from './hooks/useGetDashboardOverview';
import useFindBusinessJobs from './pages/find-work/hooks/useFindBusinessJobs';
import useApplyToBusinessJob from './pages/find-work/hooks/useApplyToBusinessJob';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatDateToLocal } from '@/helpers/date';

import { FunnelIcon } from '@heroicons/react/24/outline';
import useBusinessModeFilters from '../../hooks/useBusinessModeFilters';

import formatPrice from '@/helpers/currencyFormat';
import { calculateDistanceKm } from '@/helpers/distance';

const Content = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { filters, applyFromModal } = useBusinessModeFilters();
  const [isConfirmAcceptModalOpen, setIsConfirmAcceptModalOpen] = useState(false);
  const [isJobAcceptedModalOpen, setIsJobAcceptedModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [pendingAcceptJobId, setPendingAcceptJobId] = useState<number | null>(null);

  // Fetch dashboard overview data from API
  const { data: dashboardData, isLoading } = useGetDashboardOverview();

  // Subscribe to applicant profile cache to get user name and location
  const { data: profileResponse } = useQuery<any>(['applicantProfileCache'], {
    enabled: false, // Don't fetch, just subscribe to existing cache
  });
  const profileData = profileResponse?.data || profileResponse;
  const userName = `${profileData?.firstname || ''} ${profileData?.lastname || ''}`.trim() || 'User';
  const applicantLatitude = profileData?.latitude;
  const applicantLongitude = profileData?.longitude;

  // Fetch business jobs from API (apply filters when provided)
  const { data: jobsData, isLoading: isJobsLoading } = useFindBusinessJobs(filters || {});

  // Mutation hook for applying to business jobs
  const applyToBusinessJobMutation = useApplyToBusinessJob();

  // Transform API business jobs data to BusinessJobCard format
  const transformedJobs = useMemo(() => {
    if (!jobsData || jobsData.length === 0) return [];

    return jobsData.map((job: any) => {
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
        // Use contract_start_date (backend field name) instead of date
        const dateField = job.contract_start_date || job.date;
        if (!dateField) return 'Date not specified';

        const dateFormatted = formatDateToLocal(dateField, true);

        if (job.time_from && job.time_to) {
          return `${dateFormatted}, ${job.time_from} - ${job.time_to}`;
        } else if (job.time_from) {
          return `${dateFormatted}, ${job.time_from}`;
        }
        return dateFormatted;
      };

      // Format distance (use computed distanceKm)
      const formatDistance = (dk: number | null) => {
        if (dk !== null && dk !== undefined) {
          return `${dk} km away`;
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
          return 'accepted' as const;
        }
        return 'pending' as const;
      };

      // compute distance using applicant profile coords when available
      const distanceKm = (applicantLatitude && applicantLongitude && job.latitude && job.longitude)
        ? Math.round(calculateDistanceKm(Number(applicantLatitude), Number(applicantLongitude), Number(job.latitude), Number(job.longitude)) * 10) / 10
        : null;

      return {
        id: job.id,
        title: job.job_title || 'Untitled Job',
        clientName: job.created_by_name || 'Unknown Client',
        clientId: job.created_by,
        clientInitials: getClientInitials(job.created_by_name || ''),
        clientPhoto: job.created_by_photo || null,
        clientLocation: job.location || 'Location not specified',
        distance: formatDistance(distanceKm),
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
  }, [jobsData]);

  // Limit to 4 jobs for home page preview
  const displayedJobs = transformedJobs.slice(0, 4);

  const handleApplyFilters = (payload: {
    location?: string;
    category?: string;
    skills?: string[];
    urgentOnly?: boolean;
  }) => {
    applyFromModal(payload);
    setIsFilterModalOpen(false);
  };

  const handleAcceptJob = (jobId: number) => {
    // Check if already applied
    const job = jobsData?.find((j: any) => j.id === jobId);
    if (job?.has_applied) {
      // If already applied, open chat modal instead
      setSelectedJobId(jobId);
      setIsChatModalOpen(true);
      toast.custom(() => <CustomToast message="You have already applied to this job. Opening chat..." type="info" />, {
        duration: 3000,
      });
      return;
    }

    // Show confirmation modal before accepting
    setPendingAcceptJobId(jobId);
    setIsConfirmAcceptModalOpen(true);
  };

  const handleConfirmAcceptJob = async () => {
    if (!pendingAcceptJobId) return;

    try {
      setSelectedJobId(pendingAcceptJobId);

      // Apply to the business job
      await applyToBusinessJobMutation.mutateAsync(pendingAcceptJobId);

      // Close confirmation modal and reset pending job
      setIsConfirmAcceptModalOpen(false);
      setPendingAcceptJobId(null);

      // Show success modal and toast
      setIsJobAcceptedModalOpen(true);
      setIsJobDetailsModalOpen(false);
      toast.custom(() => <CustomToast message="Application submitted successfully!" type="success" />, {
        duration: 5000,
      });
    } catch (error: any) {
      // Handle error
      const message = error?.message || 'Failed to apply to job. Please try again.';
      setIsConfirmAcceptModalOpen(false);
      setPendingAcceptJobId(null);
      toast.custom(() => <CustomToast message={message} type="error" />, {
        duration: 7000,
      });
    }
  };

  const handleMessage = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsChatModalOpen(true);
  };

  const handleViewDetails = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsJobDetailsModalOpen(true);
  };

  const handleMessageClient = () => {
    setIsJobAcceptedModalOpen(false);
    setIsChatModalOpen(true);
  };

  const selectedJobFull = selectedJobId
    ? transformedJobs.find((job) => job.id === selectedJobId)
    : null;

  // Format amount with K notation
  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      const kValue = amount / 1000;
      return `₱${kValue % 1 === 0 ? kValue.toFixed(0) : kValue.toFixed(1)}k`;
    }
    return `₱${amount.toLocaleString()}`;
  };

  // Extract data from API response
  const monthlyEarnings = useMemo(() => dashboardData?.monthly_earnings || 0, [dashboardData]);
  const jobsCompleted = useMemo(() => dashboardData?.jobs_completed || 0, [dashboardData]);
  const urgentRequestsCount = useMemo(() => dashboardData?.urgent_requests || 0, [dashboardData]);
  const rating = useMemo(() => dashboardData?.rating || 0, [dashboardData]);

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading ? (
        <LoadingSpinner size="lg" showText text="Loading dashboard..." className="py-12" />
      ) : (
        <>
          {/* Business Overview */}
      <div className="bg-gradient-to-br from-savoy-blue to-blue-600 rounded-lg shadow-lg p-6 text-white">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {userName.split(' ')[0]}! 👋
          </h2>
          <p className="text-blue-100 text-sm">
            Here's your business overview for today
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Monthly Earnings */}
          <div className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-4">
            <p className="text-2xl font-bold mb-1">{formatAmount(monthlyEarnings)}</p>
            <p className="text-blue-100 text-xs">Monthly Earnings</p>
          </div>

          {/* Jobs Completed */}
          <div className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-4">
            <p className="text-2xl font-bold mb-1">{jobsCompleted}</p>
            <p className="text-blue-100 text-xs">Jobs Completed</p>
          </div>

          {/* Urgent Requests */}
          <div className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-4">
            <p className="text-2xl font-bold mb-1">{urgentRequestsCount}</p>
            <p className="text-blue-100 text-xs">Urgent Jobs</p>
          </div>

          {/* Rating */}
          <div className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-4">
            <p className="text-2xl font-bold mb-1">{rating}</p>
            <p className="text-blue-100 text-xs">Your Rating</p>
          </div>
        </div>
      </div>

      {/* Nearby Job Requests */}
      <div className="bg-white rounded-lg shadow-sm  p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Nearby Business Jobs</h2>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </button>
        </div>

        {isJobsLoading ? (
          <LoadingSpinner size="lg" showText text="Loading nearby jobs..." className="py-12" />
        ) : displayedJobs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">No nearby business jobs available at the moment.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedJobs.map((job) => (
              <BusinessJobCard
                key={job.id}
                {...job}
                onAcceptJob={handleAcceptJob}
                onMessage={handleMessage}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
        </>
      )}

      {/* Earnings This Month */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Earnings This Month</h2>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.map((item, index) => {
            const maxAmount = Math.max(...weeklyData.map((d) => d.amount));
            const height = (item.amount / maxAmount) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative flex-1 w-full flex items-end">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                    title={`₱${item.amount.toLocaleString()}`}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Trending Services */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Trending Services</h2>
        <div className="space-y-4">
          {trendingServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  {service.iconType === 'tools' ? (
                    <ToolsIcon className="h-6 w-6" />
                  ) : service.iconType === 'bolt' ? (
                    <BoltIcon className="h-6 w-6 text-blue-600" />
                  ) : (
                    <SparklesIcon className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.active} active</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${service.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {service.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Page-specific Modals */}
      {isFilterModalOpen && (
        <FilterRequestsModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          initialUrgentOnly={!!filters?.is_urgent}
          showSkills={false}
        />
      )}

      {/* Confirm Accept Job Modal */}
      {pendingAcceptJobId && (() => {
        const pendingJob = transformedJobs.find((job) => job.id === pendingAcceptJobId);
        return pendingJob ? (
          <ConfirmAcceptJobModal
            isOpen={isConfirmAcceptModalOpen}
            onClose={() => {
              setIsConfirmAcceptModalOpen(false);
              setPendingAcceptJobId(null);
            }}
            onConfirm={handleConfirmAcceptJob}
            jobTitle={pendingJob.title}
            clientName={pendingJob.clientName}
            isLoading={applyToBusinessJobMutation.isLoading}
          />
        ) : null;
      })()}

      {/* Job Accepted Modal */}
      {isJobAcceptedModalOpen && selectedJobFull && (
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
      {isJobDetailsModalOpen && selectedJobId && (
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
      {isChatModalOpen && selectedJobFull && (
        <ChatMessagesModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedJobId(null);
          }}
          recipientId={selectedJobFull.clientId}
          recipientName={selectedJobFull.clientName}
          recipientInitials={selectedJobFull.clientInitials || ''}
          recipientPhoto={selectedJobFull.clientPhoto}
          jobId={selectedJobFull.id}
          jobTitle={selectedJobFull.title}
        />
      )}
    </div>
  );
};

export default Content;
