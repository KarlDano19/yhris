'use client';

import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import ChatModal from '@/components/common/chat/ChatModal';
import useGetMyAppliedJobs from './hooks/useGetMyAppliedJobs';
import LoadingSpinner from '@/components/LoadingSpinner';

// Import new hooks
import { useStartJob } from './hooks/useStartJob';
import { useSubmitDailyProgress } from './hooks/useSubmitDailyProgress';
import { useUploadProofOfCompletion } from './hooks/useUploadProofOfCompletion';
import { useClockIn } from './hooks/useClockIn';
import { useClockOut } from './hooks/useClockOut';

// Import new modals
import StartJobModal from './modals/StartJobModal';
import SubmitDailyProgressModal from './modals/SubmitDailyProgressModal';
import ViewDailyProgressModal from './modals/ViewDailyProgressModal';
import UploadProofModal from './modals/UploadProofModal';
import ClockInModal from './modals/ClockInModal';
import ClockOutModal from './modals/ClockOutModal';

import { 
  CurrencyDollarIcon, 
  ChatBubbleLeftRightIcon, 
  CalendarIcon, 
  MapPinIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon
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
  const [selectedJob, setSelectedJob] = useState<T_ActiveJob | null>(null);

  // Hooks for job actions
  const { mutate: startJob, isLoading: isStartingJob } = useStartJob();
  const { mutate: submitProgress, isLoading: isSubmittingProgress } = useSubmitDailyProgress();
  const { mutate: uploadProof, isLoading: isUploadingProof } = useUploadProofOfCompletion();
  const { mutate: clockIn, isLoading: isClockingIn } = useClockIn();
  const { mutate: clockOut, isLoading: isClockingOut } = useClockOut();

  // Fetch my applied jobs where I've been accepted (hired)
  // Note: Remove application_status filter to show all applied jobs for now
  const { data, isLoading, isError } = useGetMyAppliedJobs({
    page_size: 50,
  });

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
      };
    });
  }, [data]);

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


  return (
    <div className="space-y-6">
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
              className={`bg-white border-2 rounded-xl p-5 hover:shadow-md transition-all ${
                job.urgent ? 'border-red-500' : 'border-gray-200'
              }`}
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
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span>{job.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold text-green-600">{job.priceRange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-gray-500" />
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
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">Payment received - Job completed!</p>
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

                  {/* Not Started - Show Start Button */}
                  {job.status === 'accepted' && job.workStatus === 'not_started' && (
                    <button
                      onClick={() => handleStartJobClick(job)}
                      disabled={isStartingJob}
                      className="flex-1 px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isStartingJob ? 'Starting...' : 'Start Job'}
                    </button>
                  )}

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
                      // Disable button if all progress submitted, today's progress submitted, or today is outside contract
                      const isButtonDisabled = isSubmittingProgress ||
                        job.submittedProgressCount >= job.totalContractDays ||
                        todayProgressSubmitted ||
                        !todayWithinContract;

                      // Determine button text
                      // Only hourly rate jobs can have optional daily progress
                      // Fixed rate jobs always require daily progress
                      const isOptional = job.budgetType === 'hourly_rate' && !job.isDailyProgressRequired;
                      let buttonText = isOptional ? 'Submit Daily Progress (Optional)' : 'Submit Daily Progress';
                      if (job.submittedProgressCount >= job.totalContractDays) {
                        buttonText = 'All Progress Submitted';
                      } else if (todayProgressSubmitted) {
                        buttonText = 'Today\'s Progress Submitted';
                      } else if (!todayWithinContract) {
                        buttonText = 'Outside Contract Period';
                      }

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
    </div>
  );
};

export default Content;
