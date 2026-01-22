 'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import ChatModal from '@/components/common/chat/ChatModal';
import useGetMyAppliedJobs from './hooks/useGetMyAppliedJobs';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatDateToLocal } from '@/helpers/date';

// Import new hooks
import { useStartJob } from './hooks/useStartJob';
import { useSubmitDailyProgress } from './hooks/useSubmitDailyProgress';
import { useUploadProofOfCompletion } from './hooks/useUploadProofOfCompletion';
import { useClockIn } from './hooks/useClockIn';
import { useClockOut } from './hooks/useClockOut';
import { useSubmitJobReview } from './hooks/useSubmitJobReview';

// Import new modals
import StartJobModal from './modals/StartJobModal';
import SubmitDailyProgressModal from './modals/SubmitDailyProgressModal';
import ViewDailyProgressModal from './modals/ViewDailyProgressModal';
import UploadProofModal from './modals/UploadProofModal';
import ClockInModal from './modals/ClockInModal';
import ClockOutModal from './modals/ClockOutModal';
import ReviewJobModal from './modals/ReviewJobModal';

import {
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

import { T_ActiveJob } from '@/types/business-mode';

const Content = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedJobForMessage, setSelectedJobForMessage] = useState<{
    id: number;
    clientId: number;
    clientName: string;
    clientInitials: string;
    clientPhoto: string | null;
    title: string;
  } | null>(null);

  // New state for daily progress modals
  const [isStartJobModalOpen, setIsStartJobModalOpen] = useState(false);
  const [isSubmitProgressModalOpen, setIsSubmitProgressModalOpen] = useState(false);
  const [isViewProgressModalOpen, setIsViewProgressModalOpen] = useState(false);
  const [isUploadProofModalOpen, setIsUploadProofModalOpen] = useState(false);
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);
  const [isClockOutModalOpen, setIsClockOutModalOpen] = useState(false);
  const [isReviewJobModalOpen, setIsReviewJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<T_ActiveJob | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Hooks for job actions
  const { mutate: startJob, isLoading: isStartingJob } = useStartJob();
  const { mutate: submitProgress, isLoading: isSubmittingProgress } = useSubmitDailyProgress();
  const { mutate: uploadProof, isLoading: isUploadingProof } = useUploadProofOfCompletion();
  const { mutate: clockIn, isLoading: isClockingIn } = useClockIn();
  const { mutate: clockOut, isLoading: isClockingOut } = useClockOut();
  const { mutate: submitReview, isLoading: isSubmittingReview } = useSubmitJobReview();

  // Fetch my applied jobs where I've been accepted (hired)
  // Note: Remove application_status filter to show all applied jobs for now
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalRecords
  } = useGetMyAppliedJobs({});

  // Transform API data to ActiveJob format
  const activeJobs: T_ActiveJob[] = useMemo(() => {
    if (!data?.records) return [];

    return data.records.map((job: any) => {
      // Format time
      let timeStr = '';
      if (job.date) {
        const date = new Date(job.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
        
        if (job.time_from && job.time_to) {
          timeStr = `${formattedDate}, ${job.time_from} - ${job.time_to}`;
        } else {
          timeStr = formattedDate;
        }
      }

      // Format price range
      let priceRange = '';
      if (job.budget_type === 'fixed_rate') {
        if (job.min_amount && job.max_amount) {
          priceRange = `₱${job.min_amount.toLocaleString()} - ₱${job.max_amount.toLocaleString()}`;
        } else if (job.min_amount) {
          priceRange = `₱${job.min_amount.toLocaleString()}`;
        }
      } else if (job.budget_type === 'hourly_rate' && job.hourly_rate) {
        priceRange = `₱${job.hourly_rate.toLocaleString()}/hr`;
      }

      // Get initials from client name
      const getInitials = (name: string) => {
        if (!name) return 'NA';
        return name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
      };

      return {
        id: job.id,
        applicationId: job.application_id,
        title: job.job_title,
        clientName: job.created_by_name || 'Unknown',
        clientInitials: getInitials(job.created_by_name || 'NA'),
        clientPhoto: job.created_by_photo || null,
        clientId: job.created_by,
        location: job.location || 'Location not specified',
        time: timeStr,
        priceRange: priceRange || 'Budget not specified',
        status: job.application_status,
        workStatus: job.application_work_status || 'not_started',
        paymentStatus: job.application_payment_status || 'pending',
        urgent: job.is_urgent || false,
        // Contractual job fields
        contractStartDate: job.contract_start_date || '',
        contractEndDate: job.contract_end_date || null,
        isContractual: job.is_contractual_job || false,
        isProofFileRequired: job.is_proof_file_required ?? true,
        totalContractDays: job.total_contract_days || 1,
        submittedProgressCount: job.submitted_progress_count || 0,
        approvedProgressCount: job.approved_progress_count || 0,
        isAllProgressSubmitted: job.is_all_progress_submitted || false,
        dailyProgresses: job.daily_progresses || [],
        budgetType: job.budget_type || 'fixed_rate',
        // Hourly rate specific fields
        isDailyProgressRequired: job.is_daily_progress_required || false,
        isStrictSchedule: job.is_strict_schedule || false,
        todayTimeRecord: job.today_time_record || null,
        totalTimeRecordsCount: job.total_time_records_count || 0,
        totalHoursWorked: job.total_hours_worked || 0,
        timeRecords: job.time_records || [],
        hourlyRate: job.hourly_rate || null,
        timeFrom: job.time_from || null,
        timeTo: job.time_to || null,
        // minutes allowed before/after scheduled times
        clockInMinutesBefore: job.clock_in_minutes_before ?? 60,
        clockOutMinutesAfter: job.clock_out_minutes_after ?? 60,
        // can start job flag (from backend)
        canStartJob: job.can_start_job ?? false,
        // Review tracking
        hasApplicantReviewed: job.has_applicant_reviewed ?? false,
      };
    });
  }, [data]);

  // Handle navigation from notifications (query params) - open appropriate modals
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    try {
      const jobIdParam = searchParams?.get?.('job_id');
      const applicationIdParam = searchParams?.get?.('application_id');
      const openParam = searchParams?.get?.('open'); // e.g., 'application', 'submit_progress', 'upload_proof', 'start_job', 'clock_in', 'clock_out', 'chat'

      if (jobIdParam) {
        const parsedJobId = Number(jobIdParam);
        if (!Number.isNaN(parsedJobId)) {
          const parentJob = activeJobs.find((j) => j.id === parsedJobId);
          if (parentJob) {
            setSelectedJob(parentJob);
            // scroll & highlight
            setTimeout(() => {
              try {
                const el = document.getElementById(`job-${parentJob.id}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              } catch (err) {}
            }, 200);
            // open modal per openParam
            switch (openParam) {
              case 'submit_progress':
                setIsSubmitProgressModalOpen(true);
                break;
              case 'view_progress':
              case 'application':
                setIsViewProgressModalOpen(true);
                break;
              case 'upload_proof':
                setIsUploadProofModalOpen(true);
                break;
              case 'start_job':
                setIsStartJobModalOpen(true);
                break;
              case 'clock_in':
                setIsClockInModalOpen(true);
                break;
              case 'clock_out':
                setIsClockOutModalOpen(true);
                break;
              case 'chat':
                setSelectedJobForMessage({
                  id: parentJob.id,
                  clientId: parentJob.clientId,
                  clientName: parentJob.clientName,
                  clientInitials: parentJob.clientInitials,
                  clientPhoto: parentJob.clientPhoto,
                  title: parentJob.title,
                });
                setIsChatModalOpen(true);
                break;
              default:
                // if applicationId present but no explicit openParam, open view progress
                if (applicationIdParam) {
                  setIsViewProgressModalOpen(false);
                }
            }
            router.replace('/business-mode/my-jobs');
          }
        }
      } else if (applicationIdParam) {
        const parsedApplicationId = Number(applicationIdParam);
        if (!Number.isNaN(parsedApplicationId)) {
          // Try to locate parent job by applicationId
          const parentJob = activeJobs.find((j) => j.applicationId === parsedApplicationId || j.dailyProgresses?.some((p:any) => Number(p.id) === parsedApplicationId));
          if (parentJob) {
            setSelectedJob(parentJob);
            setTimeout(() => {
              try {
                const el = document.getElementById(`job-${parentJob.id}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.classList.add('ring-4', 'ring-yellow-300', 'ring-opacity-60');
                  setTimeout(() => {
                    el.classList.remove('ring-4', 'ring-yellow-300', 'ring-opacity-60');
                  }, 3000);
                }
              } catch (err) {}
            }, 200);
          }
          router.replace('/business-mode/my-jobs');
        }
      }
    } catch (e) {
      // ignore parsing errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString(), activeJobs]);

  // Helper: parse "HH:MM" into a Date on the given baseDate
  const parseTimeToDate = (timeStr: string | null, baseDate: Date): Date | null => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    if (parts.length < 2) return null;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const d = new Date(baseDate);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  // Frontend validation for clock in: returns { allowed: boolean, message?: string }
  const validateClockIn = (job: T_ActiveJob) => {
    if (!job.timeFrom) return { allowed: true };
    const now = new Date();
    const scheduledStart = parseTimeToDate(job.timeFrom, now);
    if (!scheduledStart) return { allowed: true };
    // If scheduled start is earlier than now but timeTo indicates overnight, handle next-day comparison
    const minutesBefore = job.clockInMinutesBefore ?? 60;
    const earliest = scheduledStart.getTime() - minutesBefore * 60000;
    if (now.getTime() < earliest) {
      const allowedAt = new Date(earliest);
      return {
        allowed: false,
        message: `Too early to clock in. You can clock in starting at ${allowedAt.toLocaleTimeString()}.`
      };
    }
    return { allowed: true };
  };

  // Frontend validation for clock out
  const validateClockOut = (job: T_ActiveJob) => {
    if (!job.timeTo) return { allowed: true };
    const now = new Date();
    const scheduledEnd = parseTimeToDate(job.timeTo, now);
    if (!scheduledEnd) return { allowed: true };
    const minutesAfter = job.clockOutMinutesAfter ?? 60;
    const latest = scheduledEnd.getTime() + minutesAfter * 60000;
    if (now.getTime() > latest) {
      const endedAt = new Date(latest);
      return {
        allowed: false,
        message: `Too late to clock out. The clock out window ended at ${endedAt.toLocaleTimeString()}.`
      };
    }
    return { allowed: true };
  };

  const handleMessageJob = (job: T_ActiveJob) => {
    setSelectedJobForMessage({
      id: job.id,
      clientId: job.clientId,
      clientName: job.clientName,
      clientInitials: job.clientInitials,
      clientPhoto: job.clientPhoto,
      title: job.title,
    });
    setIsChatModalOpen(true);
  };

  const handleStartJobClick = (job: T_ActiveJob) => {
    setSelectedJob(job);
    setIsStartJobModalOpen(true);
  };

  const handleStartJobConfirm = () => {
    if (!selectedJob) return;

    startJob(
      { applicationId: selectedJob.applicationId },
      {
        onSuccess: () => {
          toast.custom(
            <CustomToast message="Job started successfully!" type="success" />
          );
          setIsStartJobModalOpen(false);
          setSelectedJob(null);
        },
        onError: (error: any) => {
          toast.custom(
            <CustomToast
              message={error.message || 'Failed to start job'}
              type="error"
            />
          );
        },
      }
    );
  };

  const handleSubmitProgressClick = (job: T_ActiveJob) => {
    setSelectedJob(job);
    setIsSubmitProgressModalOpen(true);
  };

  const handleSubmitProgressConfirm = (data: {
    progress_date: string;
    proof_file?: File;
    notes: string;
    hours_worked?: number;
  }) => {
    if (!selectedJob) return;

    submitProgress(
      { applicationId: selectedJob.applicationId, ...data },
      {
        onSuccess: () => {
          toast.custom(
            <CustomToast
              message="Daily progress submitted successfully!"
              type="success"
            />
          );
          setIsSubmitProgressModalOpen(false);
        },
        onError: (error: any) => {
          toast.custom(
            <CustomToast
              message={error.message || 'Failed to submit progress'}
              type="error"
            />
          );
        },
      }
    );
  };

  const handleViewProgressClick = (job: T_ActiveJob) => {
    setSelectedJob(job);
    setIsViewProgressModalOpen(true);
  };

  const handleUploadProofClick = (job: T_ActiveJob) => {
    setSelectedJob(job);
    setIsUploadProofModalOpen(true);
  };

  const handleUploadProofConfirm = (file: File) => {
    if (!selectedJob) return;

    uploadProof(
      { applicationId: selectedJob.applicationId, proof_of_completion: file },
      {
        onSuccess: () => {
          toast.custom(
            <CustomToast
              message="Proof of completion uploaded successfully! Job marked as completed."
              type="success"
            />
          );
          setIsUploadProofModalOpen(false);
          setSelectedJob(null);
        },
        onError: (error: any) => {
          toast.custom(
            <CustomToast
              message={error.message || 'Failed to upload proof'}
              type="error"
            />
          );
        },
      }
    );
  };

  // Review job handler
  const handleReviewJobClick = (job: T_ActiveJob) => {
    setSelectedJob(job);
    setIsReviewJobModalOpen(true);
  };

  const handleReviewJobConfirm = (data: { rating: number; comment?: string }) => {
    if (!selectedJob) return;

    submitReview(
      {
        business_job_application: selectedJob.applicationId,
        rating: data.rating,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          toast.custom(
            <CustomToast
              message="Review submitted successfully! Thank you for your feedback."
              type="success"
            />
          );
          setIsReviewJobModalOpen(false);
          setSelectedJob(null);
        },
        onError: (error: any) => {
          toast.custom(
            <CustomToast
              message={error.message || 'Failed to submit review'}
              type="error"
            />
          );
        },
      }
    );
  };

  // Clock In/Out handlers for hourly rate jobs
  const handleClockInClick = (job: T_ActiveJob) => {
    setSelectedJob(job);
    setIsClockInModalOpen(true);
  };

  const handleClockInConfirm = () => {
    if (!selectedJob) return;
    // Client-side validation before sending request
    const check = validateClockIn(selectedJob);
    if (!check.allowed) {
      toast.custom(() => <CustomToast message={check.message || 'Too early to clock in'} type="error" />, { duration: 5000 });
      return;
    }

    clockIn(
      { applicationId: selectedJob.applicationId },
      {
        onSuccess: (response) => {
          toast.custom(
            <CustomToast message={response.message || "Clocked in successfully!"} type="success" />
          );
          setIsClockInModalOpen(false);
          setSelectedJob(null);
        },
        onError: (error: any) => {
          toast.custom(
            <CustomToast
              message={error.message || 'Failed to clock in'}
              type="error"
            />
          );
        },
      }
    );
  };

  const handleClockOutClick = (job: T_ActiveJob) => {
    setSelectedJob(job);
    setIsClockOutModalOpen(true);
  };

  const handleClockOutConfirm = () => {
    if (!selectedJob) return;
    // Client-side validation before sending request
    const check = validateClockOut(selectedJob);
    if (!check.allowed) {
      toast.custom(() => <CustomToast message={check.message || 'Too late to clock out'} type="error" />, { duration: 5000 });
      return;
    }

    clockOut(
      { applicationId: selectedJob.applicationId },
      {
        onSuccess: (response) => {
          toast.custom(
            <CustomToast message={response.message || "Clocked out successfully!"} type="success" />
          );
          setIsClockOutModalOpen(false);

          // If daily progress is required, open the progress modal
          if (response.is_daily_progress_required) {
            setIsSubmitProgressModalOpen(true);
          } else {
            setSelectedJob(null);
          }
        },
        onError: (error: any) => {
          toast.custom(
            <CustomToast
              message={error.message || 'Failed to clock out'}
              type="error"
            />
          );
        },
      }
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than 300px
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-6">
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-50 bg-savoy-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUpIcon className="h-5 w-5" strokeWidth={2.5} />
        </button>
      )}

      {/* My Jobs Header */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">My Jobs</h2>
          <p className="text-sm text-gray-600">Manage your job applications and active jobs</p>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner size="lg" showText text="Loading your jobs..." className="py-12" />}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-800">Failed to load jobs. Please try again later.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && activeJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No job applications found</p>
            <p className="text-gray-400 text-sm mt-1">Apply to jobs in the Find Work section</p>
          </div>
        )}

        {/* Active Jobs List */}
        <div className="space-y-4">
          {!isLoading && !isError && activeJobs.map((job) => (
            <div
              key={job.id}
              id={`job-${job.id}`}
              className={`bg-white border-2 rounded-xl p-5 hover:shadow-md transition-all ${
                job.urgent ? 'border-red-500' : 'border-gray-200'
              } ${selectedJob?.id === job.id ? 'ring-4 ring-yellow-300 ring-opacity-60' : ''}`}
            >
              {/* Header with Status Badges */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    {job.urgent && (
                      <span className="inline-block px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
                {job.status === 'pending' ? (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                    Pending Approval
                  </span>
                ) : job.workStatus === 'started' ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    In Progress
                  </span>
                ) : job.workStatus === 'completed' ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    Completed
                  </span>
                ) : job.status === 'accepted' ? (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                    Scheduled
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                    {job.status}
                  </span>
                )}
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3 mb-4">
                {job.clientPhoto ? (
                  <img
                    src={job.clientPhoto}
                    alt={job.clientName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold">
                    {job.clientInitials}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.clientName}</p>
                </div>
              </div>

              {/* Job Details */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-savoy-blue" />
                  <span>
                    {formatDateToLocal(job.contractStartDate, true)}
                    {job.contractEndDate && ` - ${formatDateToLocal(job.contractEndDate, true)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-savoy-blue" />
                  <span className="font-semibold text-green-600">{job.priceRange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-savoy-blue" />
                  <span>{job.location}</span>
                </div>
                {job.isContractual && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-purple-500" />
                    <span className="text-purple-700 font-medium">
                      {job.totalContractDays} days contract
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Indicator for Contractual Jobs */}
              {job.isContractual &&
               (job.workStatus === 'started' || job.workStatus === 'completed') && (() => {
                // For hourly rate jobs where daily progress is not required,
                // count clocked-out days as progress
                const effectiveProgressCount = (!job.isDailyProgressRequired && job.budgetType === 'hourly_rate')
                  ? job.timeRecords.filter((r) => r.status === 'clocked_out').length
                  : job.submittedProgressCount;

                return (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Daily Progress</span>
                    <span className="text-sm font-semibold text-blue-700">
                      {effectiveProgressCount}/{job.totalContractDays} days
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(effectiveProgressCount / job.totalContractDays) * 100}%`,
                      }}
                    />
                  </div>
                  {effectiveProgressCount >= job.totalContractDays && (
                    <div className="flex items-center gap-1 mt-2 text-green-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="text-xs font-medium">All progress completed!</span>
                    </div>
                  )}
                </div>
                );
              })()}

              {/* Time Tracking for Hourly Rate Jobs */}
              {job.budgetType === 'hourly_rate' &&
               job.status === 'accepted' &&
               job.workStatus === 'started' && (
                <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Time Tracking</span>
                    {job.todayTimeRecord ? (
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        job.todayTimeRecord.status === 'clocked_in'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {job.todayTimeRecord.status === 'clocked_in' ? 'Clocked In' : 'Clocked Out'}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500">Not clocked in today</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Total Days</p>
                      <p className="text-sm font-semibold text-purple-700">{job.totalTimeRecordsCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hours Worked</p>
                      <p className="text-sm font-semibold text-purple-700">{job.totalHoursWorked.toFixed(1)}h</p>
                    </div>
                  </div>
                  {job.isStrictSchedule && (
                    <p className="text-xs text-purple-600 mt-2">
                      Strict schedule: {job.timeFrom} - {job.timeTo}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Status Banner */}
              {/* Only show payment banner for non-contractual jobs OR contractual jobs with all progress submitted */}
              {job.workStatus === 'completed' && 
               job.paymentStatus === 'pending' && 
               (!job.isContractual || job.isAllProgressSubmitted) && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">Waiting for client payment</p>
                </div>
              )}

              {/* Contractual job marked as complete but progress not all submitted - only show warning if progress is required */}
              {job.isContractual &&
               job.isProofFileRequired &&
               job.workStatus === 'completed' &&
               job.submittedProgressCount < job.totalContractDays && (
                <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <p className="text-sm text-orange-800">
                    Contract incomplete: {job.submittedProgressCount}/{job.totalContractDays} days submitted.
                    Please submit remaining daily progress.
                  </p>
                </div>
              )}

              {job.workStatus === 'completed' && job.paymentStatus === 'paid' && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-800">Payment received - Job completed!</p>
                  </div>

                  {!job.hasApplicantReviewed && (
                    <button
                      onClick={() => handleReviewJobClick(job)}
                      className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <StarIcon className="h-5 w-5" />
                      Review Job
                    </button>
                  )}

                  {job.hasApplicantReviewed && (
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircleIcon className="h-5 w-5" />
                      <p className="text-sm font-medium">Review completed ✓</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleMessageJob(job)}
                    className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    Message Client
                  </button>

                  {/* Pending Status */}
                  {job.status === 'pending' && (
                    <button className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed">
                      Awaiting Client Response
                    </button>
                  )}

                  {/* Completed Status - Only for truly completed jobs */}
                  {job.status === 'accepted' && 
                   job.workStatus === 'completed' && 
                   (!job.isContractual || job.isAllProgressSubmitted) && (
                    <button className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed">
                      {job.paymentStatus === 'paid' ? 'Completed' : 'Awaiting Payment'}
                    </button>
                  )}

                  {/* Not Started - Show Start Button (only if canStartJob is true) */}
                  {job.status === 'accepted' && job.workStatus === 'not_started' && job.canStartJob && (
                    <button
                      onClick={() => handleStartJobClick(job)}
                      disabled={isStartingJob}
                      className="flex-1 px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isStartingJob ? 'Starting...' : 'Start Job'}
                    </button>
                  )}

                  {/* Not Started - Show Disabled Button with Contract Start Date (when contract start date doesn't match today) */}
                  {job.status === 'accepted' && job.workStatus === 'not_started' && !job.canStartJob && (() => {
                    const formattedDate = formatDateToLocal(job.contractStartDate, true);
                    return (
                      <button
                        disabled
                        className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
                        title={`You can start this job on ${formattedDate}`}
                      >
                        Start on {formattedDate}
                      </button>
                    );
                  })()}

                  {/* Started - Single Day Fixed Rate Job */}
                  {job.status === 'accepted' &&
                    job.workStatus === 'started' &&
                    !job.isContractual &&
                    job.budgetType === 'fixed_rate' && (
                      <button
                        onClick={() => handleUploadProofClick(job)}
                        disabled={isUploadingProof}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isUploadingProof ? 'Uploading...' : 'Upload Proof'}
                      </button>
                    )}

                  {/* Started - Hourly Rate Job - Clock In/Out */}
                  {job.status === 'accepted' &&
                    job.workStatus === 'started' &&
                    job.budgetType === 'hourly_rate' && (
                      <>
                        {/* No time record today - show Clock In button */}
                        {!job.todayTimeRecord && (
                          <button
                            onClick={() => handleClockInClick(job)}
                            disabled={isClockingIn}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <ClockIcon className="h-5 w-5" />
                            {isClockingIn ? 'Clocking In...' : 'Clock In'}
                          </button>
                        )}

                        {/* Clocked in - show Clock Out button */}
                        {job.todayTimeRecord?.status === 'clocked_in' && (
                          <button
                            onClick={() => handleClockOutClick(job)}
                            disabled={isClockingOut}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <ClockIcon className="h-5 w-5" />
                            {isClockingOut ? 'Clocking Out...' : 'Clock Out'}
                          </button>
                        )}

                        {/* Clocked out for today */}
                        {job.todayTimeRecord?.status === 'clocked_out' && (
                          <button
                            disabled
                            className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                            Clocked Out Today
                          </button>
                        )}
                      </>
                    )}

                  {/* Started - Contractual Job */}
                  {job.status === 'accepted' &&
                    job.isContractual &&
                    (job.workStatus === 'started' ||
                     (job.workStatus === 'completed' && job.submittedProgressCount < job.totalContractDays)) &&
                    // For hourly rate jobs, only show when clocked out
                    (job.budgetType !== 'hourly_rate' || job.todayTimeRecord?.status === 'clocked_out') && (() => {
                      // Check if today's progress is already submitted
                      const today = new Date().toISOString().split('T')[0];
                      const todayProgressSubmitted = job.dailyProgresses.some(
                        (p) => p.progress_date === today
                      );
                      // Check if today is within contract period
                      const todayDate = new Date();
                      const contractStart = new Date(job.contractStartDate);
                      const contractEnd = job.contractEndDate ? new Date(job.contractEndDate) : null;
                      const todayWithinContract = todayDate >= contractStart && (!contractEnd || todayDate <= contractEnd);

                      // ORIGINAL CODE WITH RESTRICTIONS (COMMENTED OUT FOR TESTING)
                      // const isButtonDisabled = isSubmittingProgress ||
                      //   job.submittedProgressCount >= job.totalContractDays ||
                      //   todayProgressSubmitted ||
                      //   !todayWithinContract;

                      // TESTING CODE (NO DATE/DUPLICATE RESTRICTIONS)
                      const isButtonDisabled = isSubmittingProgress ||
                        job.submittedProgressCount >= job.totalContractDays;

                      // Determine button text
                      // Only hourly rate jobs can have optional daily progress
                      // Fixed rate jobs always require daily progress
                      const isOptional = job.budgetType === 'hourly_rate' && !job.isDailyProgressRequired;
                      let buttonText = isOptional ? 'Submit Daily Progress (Optional)' : 'Submit Daily Progress';
                      if (job.submittedProgressCount >= job.totalContractDays) {
                        buttonText = 'All Progress Submitted';
                      }
                      // ORIGINAL BUTTON TEXT CONDITIONS (COMMENTED OUT FOR TESTING)
                      // else if (todayProgressSubmitted) {
                      //   buttonText = 'Today\'s Progress Submitted';
                      // } else if (!todayWithinContract) {
                      //   buttonText = 'Outside Contract Period';
                      // }

                      return (
                        <button
                          onClick={() => handleSubmitProgressClick(job)}
                          disabled={isButtonDisabled}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <DocumentTextIcon className="h-5 w-5" />
                          {buttonText}
                        </button>
                      );
                    })()}
                </div>

                {/* View Progress Button for Contractual Jobs */}
                {job.status === 'accepted' &&
                  job.isContractual &&
                  (job.workStatus === 'started' || job.workStatus === 'completed') &&
                  job.submittedProgressCount > 0 && (
                    <button
                      onClick={() => handleViewProgressClick(job)}
                      className="w-full px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                      View Progress History ({job.submittedProgressCount}{' '}
                      {job.submittedProgressCount === 1 ? 'entry' : 'entries'})
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {!isLoading && hasNextPage && (
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
            Showing {activeJobs.length} of {totalRecords} jobs
          </div>
        )}
      </div>

      {/* Page-specific Modals */}
      {/* Chat Modal */}
      {selectedJobForMessage && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedJobForMessage(null);
          }}
          recipientId={selectedJobForMessage.clientId}
          recipientName={selectedJobForMessage.clientName}
          recipientInitials={selectedJobForMessage.clientInitials}
          recipientPhoto={selectedJobForMessage.clientPhoto}
          jobId={selectedJobForMessage.id}
          jobTitle={selectedJobForMessage.title}
        />
      )}

      {/* Start Job Modal */}
      {selectedJob && (
        <StartJobModal
          isOpen={isStartJobModalOpen}
          onClose={() => {
            setIsStartJobModalOpen(false);
            setSelectedJob(null);
          }}
          jobTitle={selectedJob.title}
          clientName={selectedJob.clientName}
          contractStartDate={selectedJob.contractStartDate}
          contractEndDate={selectedJob.contractEndDate}
          isContractual={selectedJob.isContractual}
          onConfirm={handleStartJobConfirm}
        />
      )}

      {/* Submit Daily Progress Modal */}
      {selectedJob && (
        <SubmitDailyProgressModal
          isOpen={isSubmitProgressModalOpen}
          onClose={() => {
            setIsSubmitProgressModalOpen(false);
            setSelectedJob(null);
            }}
          jobTitle={selectedJob.title}
          contractStartDate={selectedJob.contractStartDate}
          contractEndDate={selectedJob.contractEndDate || ''}
          budgetType={selectedJob.budgetType}
          isProofFileRequired={selectedJob.isProofFileRequired}
          dailyProgresses={selectedJob.dailyProgresses}
          onSubmit={handleSubmitProgressConfirm}
        />
      )}

      {/* View Daily Progress Modal */}
      {selectedJob && (
        <ViewDailyProgressModal
          isOpen={isViewProgressModalOpen}
          onClose={() => {
            setIsViewProgressModalOpen(false);
            setSelectedJob(null);
          }}
          jobTitle={selectedJob.title}
          dailyProgresses={selectedJob.dailyProgresses}
          isClient={false}
          onReview={undefined}
        />
      )}

      {/* Upload Proof Modal */}
      {selectedJob && (
        <UploadProofModal
          isOpen={isUploadProofModalOpen}
          onClose={() => {
            setIsUploadProofModalOpen(false);
            setSelectedJob(null);
          }}
          jobTitle={selectedJob.title}
          clientName={selectedJob.clientName}
          onSubmit={handleUploadProofConfirm}
        />
      )}

      {/* Clock In Modal */}
      {selectedJob && (
        <ClockInModal
          isOpen={isClockInModalOpen}
          onClose={() => {
            setIsClockInModalOpen(false);
            setSelectedJob(null);
          }}
          onConfirm={handleClockInConfirm}
          isLoading={isClockingIn}
          jobTitle={selectedJob.title}
          timeFrom={selectedJob.timeFrom}
          timeTo={selectedJob.timeTo}
          isStrictSchedule={selectedJob.isStrictSchedule}
        />
      )}

      {/* Clock Out Modal */}
      {selectedJob && (
        <ClockOutModal
          isOpen={isClockOutModalOpen}
          onClose={() => {
            setIsClockOutModalOpen(false);
            setSelectedJob(null);
          }}
          onConfirm={handleClockOutConfirm}
          isLoading={isClockingOut}
          jobTitle={selectedJob.title}
          timeRecord={selectedJob.todayTimeRecord}
          isStrictSchedule={selectedJob.isStrictSchedule}
          timeTo={selectedJob.timeTo}
        />
      )}

      {/* Review Job Modal */}
      {selectedJob && (
        <ReviewJobModal
          isOpen={isReviewJobModalOpen}
          onClose={() => {
            setIsReviewJobModalOpen(false);
            setSelectedJob(null);
          }}
          onSubmit={handleReviewJobConfirm}
          isSubmitting={isSubmittingReview}
          jobTitle={selectedJob.title}
          employerName={selectedJob.clientName}
        />
      )}
    </div>
  );
};

export default Content;


