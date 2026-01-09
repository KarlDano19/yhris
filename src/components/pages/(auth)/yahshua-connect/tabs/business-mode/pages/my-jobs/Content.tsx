'use client';

import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import ChatModal from '../../../../modals/ChatModal';
import useGetMyAppliedJobs from './hooks/useGetMyAppliedJobs';

// Import new hooks
import { useStartJob } from '../hire/hooks/useStartJob';
import { useSubmitDailyProgress } from '../hire/hooks/useSubmitDailyProgress';
import { useUploadProofOfCompletion } from '../hire/hooks/useUploadProofOfCompletion';

// Import new modals
import StartJobModal from '../hire/modals/StartJobModal';
import SubmitDailyProgressModal from '../hire/modals/SubmitDailyProgressModal';
import ViewDailyProgressModal from '../hire/modals/ViewDailyProgressModal';
import UploadProofModal from '../hire/modals/UploadProofModal';

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

interface ActiveJob {
  id: number;
  applicationId: number;
  title: string;
  clientName: string;
  clientInitials: string;
  clientPhoto: string | null;
  clientId: number;
  location: string;
  time: string;
  priceRange: string;
  status: string;
  workStatus: string;
  paymentStatus: string;
  urgent: boolean;
  // Contractual job fields
  contractStartDate: string;
  contractEndDate: string | null;
  isContractual: boolean;
  totalContractDays: number;
  submittedProgressCount: number;
  approvedProgressCount: number;
  isAllProgressSubmitted: boolean;
  dailyProgresses: any[];
  budgetType: 'fixed_rate' | 'hourly_rate';
}

const Content = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedJobForMessage, setSelectedJobForMessage] = useState<{
    id: number;
    clientId: number;
    clientName: string;
    clientInitials: string;
    title: string;
  } | null>(null);

  // New state for daily progress modals
  const [isStartJobModalOpen, setIsStartJobModalOpen] = useState(false);
  const [isSubmitProgressModalOpen, setIsSubmitProgressModalOpen] = useState(false);
  const [isViewProgressModalOpen, setIsViewProgressModalOpen] = useState(false);
  const [isUploadProofModalOpen, setIsUploadProofModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ActiveJob | null>(null);

  // Hooks for job actions
  const { mutate: startJob, isLoading: isStartingJob } = useStartJob();
  const { mutate: submitProgress, isLoading: isSubmittingProgress } = useSubmitDailyProgress();
  const { mutate: uploadProof, isLoading: isUploadingProof } = useUploadProofOfCompletion();

  // Fetch my applied jobs where I've been accepted (hired)
  // Note: Remove application_status filter to show all applied jobs for now
  const { data, isLoading, isError } = useGetMyAppliedJobs({
    page_size: 50,
  });

  // Transform API data to ActiveJob format
  const activeJobs: ActiveJob[] = useMemo(() => {
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
        totalContractDays: job.total_contract_days || 1,
        submittedProgressCount: job.submitted_progress_count || 0,
        approvedProgressCount: job.approved_progress_count || 0,
        isAllProgressSubmitted: job.is_all_progress_submitted || false,
        dailyProgresses: job.daily_progresses || [],
        budgetType: job.budget_type || 'fixed_rate',
      };
    });
  }, [data]);

  const handleMessageJob = (job: ActiveJob) => {
    setSelectedJobForMessage({
      id: job.id,
      clientId: job.clientId,
      clientName: job.clientName,
      clientInitials: job.clientInitials,
      title: job.title,
    });
    setIsChatModalOpen(true);
  };

  const handleStartJobClick = (job: ActiveJob) => {
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

  const handleSubmitProgressClick = (job: ActiveJob) => {
    setSelectedJob(job);
    setIsSubmitProgressModalOpen(true);
  };

  const handleSubmitProgressConfirm = (data: {
    progress_date: string;
    proof_file: File;
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

  const handleViewProgressClick = (job: ActiveJob) => {
    setSelectedJob(job);
    setIsViewProgressModalOpen(true);
  };

  const handleUploadProofClick = (job: ActiveJob) => {
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


  return (
    <div className="space-y-6">
      {/* My Jobs Header */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">My Jobs</h2>
          <p className="text-sm text-gray-600">Manage your job applications and active jobs</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-savoy-blue"></div>
          </div>
        )}

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
               (job.workStatus === 'started' || 
                (job.workStatus === 'completed' && !job.isAllProgressSubmitted)) && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Daily Progress</span>
                    <span className="text-sm font-semibold text-blue-700">
                      {job.submittedProgressCount}/{job.totalContractDays} days
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(job.submittedProgressCount / job.totalContractDays) * 100}%`,
                      }}
                    />
                  </div>
                  {job.isAllProgressSubmitted && (
                    <div className="flex items-center gap-1 mt-2 text-green-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="text-xs font-medium">All progress submitted!</span>
                    </div>
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

              {/* Contractual job marked as complete but progress not all submitted - should not happen but handle gracefully */}
              {job.isContractual && 
               job.workStatus === 'completed' && 
               !job.isAllProgressSubmitted && (
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

                  {/* Started - Single Day Job */}
                  {job.status === 'accepted' &&
                    job.workStatus === 'started' &&
                    !job.isContractual && (
                      <button
                        onClick={() => handleUploadProofClick(job)}
                        disabled={isUploadingProof}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isUploadingProof ? 'Uploading...' : 'Upload Proof'}
                      </button>
                    )}

                  {/* Started - Contractual Job (or completed but progress not all submitted) */}
                  {job.status === 'accepted' &&
                    job.isContractual &&
                    (job.workStatus === 'started' || 
                     (job.workStatus === 'completed' && !job.isAllProgressSubmitted)) && (
                      <button
                        onClick={() => handleSubmitProgressClick(job)}
                        disabled={isSubmittingProgress || job.isAllProgressSubmitted}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <DocumentTextIcon className="h-5 w-5" />
                        {job.isAllProgressSubmitted
                          ? 'All Progress Submitted'
                          : 'Submit Daily Progress'}
                      </button>
                    )}
                </div>

                {/* View Progress Button for Contractual Jobs */}
                {job.status === 'accepted' &&
                  job.isContractual &&
                  (job.workStatus === 'started' || 
                   (job.workStatus === 'completed' && !job.isAllProgressSubmitted)) &&
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
    </div>
  );
};

export default Content;
