import { useState } from 'react';

import { Tooltip } from 'react-tooltip';

import { ClockIcon, CurrencyDollarIcon, UserGroupIcon, CheckCircleIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import MoreIconWithBorder from '@/svg/MoreIconWithBorder';
import BusinessJobReviewsModal from '../../find-work/modals/BusinessJobReviewsModal';

import { formatDateToLocal } from '@/helpers/date';

import { T_BusinessJob, T_HireInfo } from '@/types/business-mode';

interface BusinessJobPostingCardProps {
  job: T_BusinessJob;
  hiredApplicants: T_HireInfo[];
  previousHiresCount: number;
  isHired: boolean;
  applicantsCount: number;
  isMoreMenuOpen: boolean;
  menuRef: (el: HTMLDivElement | null) => void;
  onMoreMenuClick: () => void;
  onViewApplicants: () => void;
  onViewHistory: () => void;
  onViewTimeLogs: (applicationId: number) => void;
  onViewDailyProgress: (applicationId: number) => void;
  onSubmitPaymentProof: (applicationId: number) => void;
  onReviewApplicant: (applicationId: number) => void;
  onChatWithApplicant: (applicantId: number, applicantName: string, applicantPhoto: string | null, applicantInitials: string) => void;
  onEditJob: () => void;
  onDeleteJob: () => void;
  onDuplicateJob: () => void;
  onToggleStatus: () => void;
  shouldDisableEditDelete: boolean;
  isUpdateLoading: boolean;
  isDeleteLoading: boolean;
  isDuplicateLoading: boolean;
}

// Helper to format time from API (HH:MM) to display format (8:00 AM)
const formatTimeForDisplay = (timeFrom: string | null, timeTo: string | null): string => {
  const format12Hour = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (timeFrom && timeTo) {
    return `${format12Hour(timeFrom)} - ${format12Hour(timeTo)}`;
  } else if (timeFrom) {
    return format12Hour(timeFrom);
  }
  return '';
};

// Helper to format price range from API
const formatPriceRange = (job: T_BusinessJob): string => {
  if (job.budget_type === 'hourly_rate' && job.hourly_rate) {
    return `₱${job.hourly_rate.toLocaleString()}/hr`;
  }
  if (job.min_amount && job.max_amount && job.min_amount !== job.max_amount) {
    return `₱${job.min_amount.toLocaleString()} - ₱${job.max_amount.toLocaleString()}`;
  }
  if (job.min_amount) {
    return `₱${job.min_amount.toLocaleString()}`;
  }
  if (job.max_amount) {
    return `₱${job.max_amount.toLocaleString()}`;
  }
  return '';
};

const BusinessJobPostingCard = ({
  job,
  hiredApplicants,
  previousHiresCount,
  isHired,
  applicantsCount,
  isMoreMenuOpen,
  menuRef,
  onMoreMenuClick,
  onViewApplicants,
  onViewHistory,
  onViewTimeLogs,
  onViewDailyProgress,
  onSubmitPaymentProof,
  onReviewApplicant,
  onChatWithApplicant,
  onEditJob,
  onDeleteJob,
  onDuplicateJob,
  onToggleStatus,
  shouldDisableEditDelete,
  isUpdateLoading,
  isDeleteLoading,
  isDuplicateLoading,
}: BusinessJobPostingCardProps) => {
  // Check if any hired applicant has actually started work
  const hasStartedWork = hiredApplicants.some(hire => hire.workStatus === 'started');
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  return (
    <div
      id={`job-${job.id}`}
      className={`bg-white rounded-xl p-5 hover:shadow-md transition-shadow ${
        job.is_active ? 'border border-gray-200' : 'border-2 border-red-300'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-bold ${job.is_active ? 'text-gray-900' : 'text-red-500'}`}>
              {job.job_title}
            </h3>
            {job.average_rating && job.reviews_count > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReviewsModalOpen(true);
                }}
                className="flex items-center gap-0.5 transition-opacity hover:opacity-80 cursor-pointer"
                data-tooltip-id="job-rating-tooltip"
                data-tooltip-content="Click to view reviews from past applicants"
              >
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-700">
                  {job.average_rating}
                </span>
                <span className="text-xs text-blue-600">
                  ({job.reviews_count} {job.reviews_count === 1 ? 'review' : 'reviews'})
                </span>
              </button>
            )}
          </div>
          <p className={`text-sm ${job.is_active ? 'text-gray-600' : 'text-red-400'}`}>
            <span className="font-semibold text-savoy-blue">Category:</span> {job.category}
          </p>
          <p className={`text-sm mb-3 ${job.is_active ? 'text-gray-600' : 'text-red-400'}`}>
            {job.location}
          </p>
          <p className={`text-sm mb-4 ${job.is_active ? 'text-gray-700' : 'text-red-400'}`}>
            {job.description}
          </p>
        </div>
        {!job.is_active ? (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
            Inactive
          </span>
        ) : hasStartedWork ? (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            In Progress
          </span>
        ) : isHired ? (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            Hired
          </span>
        ) : job.status === 'active' ? (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Active
          </span>
        ) : null}
      </div>

      {/* Job Details */}
      <div className={`flex flex-wrap items-center gap-4 mb-4 text-sm ${job.is_active ? 'text-gray-600' : 'text-red-400'}`}>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          <span>
            {formatDateToLocal(job.contract_start_date, true)}
            {job.contract_end_date && ` - ${formatDateToLocal(job.contract_end_date, true)}`}
            {job.time_from && `, ${formatTimeForDisplay(job.time_from, job.time_to)}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CurrencyDollarIcon className="h-4 w-4" />
          <span className={`font-semibold ${job.is_active ? 'text-green-600' : 'text-red-500'}`}>
            {formatPriceRange(job)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-4 w-4" />
          <span>
            {applicantsCount} applicant{applicantsCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Hired Applicants Section */}
      {isHired && hiredApplicants.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Hired Applicants ({hiredApplicants.length})
          </p>

          <div className={`space-y-3 ${hiredApplicants.length > 3 ? 'max-h-[400px] overflow-y-auto pr-2' : ''}`}>
            {hiredApplicants.map((hire) => (
              <div
                key={hire.applicationId}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-savoy-blue">
                    {hire.applicantName}
                  </p>

                  {/* Message Button */}
                  <button
                    onClick={() => onChatWithApplicant(hire.applicantId, hire.applicantName, hire.applicantPhoto, hire.applicantInitials)}
                    className="px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors text-sm"
                  >
                    Message
                  </button>
                </div>

                {/* View Time Logs & Daily Progress */}
                {job.contract_end_date && hire.workStatus !== 'not_started' && (
                  <div className="flex flex-wrap gap-3 mb-2">
                    {job.budget_type === 'hourly_rate' && (
                      <button
                        onClick={() => onViewTimeLogs(hire.applicationId)}
                        className="text-sm text-savoy-blue hover:text-savoy-blue/80 font-medium underline flex items-center gap-1"
                      >
                        <ClockIcon className="h-4 w-4" />
                        View Time Logs
                      </button>
                    )}

                    {(job.budget_type === 'fixed_rate' || (job.budget_type === 'hourly_rate' && job.is_daily_progress_required)) && (
                      <button
                        onClick={() => onViewDailyProgress(hire.applicationId)}
                        className="text-sm text-savoy-blue hover:text-savoy-blue/80 font-medium underline flex items-center gap-1"
                      >
                        <DocumentTextIcon className="h-4 w-4" />
                        View Daily Progress
                      </button>
                    )}
                  </div>
                )}

                {/* Payment & Review Status/Actions */}
                {hire.paymentStatus === 'paid' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      Payment completed <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    </p>
                    {!hire.hasClientReviewed && (
                      <button
                        onClick={() => onReviewApplicant(hire.applicationId)}
                        className="text-sm text-savoy-blue hover:text-savoy-blue/80 font-medium underline"
                      >
                        Review Applicant
                      </button>
                    )}
                    {hire.hasClientReviewed && (
                      <p className="text-sm text-green-700 flex items-center gap-1">
                        Review completed <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      </p>
                    )}
                  </div>
                ) : hire.workStatus === 'completed' ? (
                  <button
                    onClick={() => onSubmitPaymentProof(hire.applicationId)}
                    className="text-sm text-savoy-blue hover:text-savoy-blue/80 font-medium underline"
                  >
                    Submit Payment Proof
                  </button>
                ) : (
                  <p className="text-sm text-gray-600">
                    Work status: {hire.workStatus === 'started' ? 'In Progress' : 'Not Started'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onViewApplicants}
            className="px-4 py-2 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            View Applicants ({applicantsCount})
          </button>

          {previousHiresCount > 0 && (
            <button
              onClick={onViewHistory}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ClockIcon className="h-4 w-4" />
              History ({previousHiresCount})
            </button>
          )}
        </div>

        {/* More Menu Dropdown */}
        <div className="relative more-menu-container" ref={menuRef}>
          <button
            onClick={onMoreMenuClick}
            className="flex items-center"
            data-tooltip-id="more-options-tooltip"
            data-tooltip-content="More Options"
          >
            <MoreIconWithBorder />
          </button>

          {isMoreMenuOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50" style={{ minWidth: '160px' }}>
              <ul className="py-1 text-left">
                <li>
                  <button
                    onClick={onEditJob}
                    disabled={isUpdateLoading || shouldDisableEditDelete}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={shouldDisableEditDelete ? 'Cannot edit while applicant is working. Complete the job and review first.' : ''}
                  >
                    Edit Job
                  </button>
                </li>
                <li>
                  <button
                    onClick={onDeleteJob}
                    disabled={isDeleteLoading || shouldDisableEditDelete}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={shouldDisableEditDelete ? 'Cannot delete while applicant is working. Complete the job and review first.' : ''}
                  >
                    Delete Job
                  </button>
                </li>
                <li>
                  <button
                    onClick={onDuplicateJob}
                    disabled={isDuplicateLoading}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Duplicate Job
                  </button>
                </li>
                <li>
                  <button
                    onClick={onToggleStatus}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <span className={!job.is_active ? 'text-green-600' : 'text-red-500'}>
                      {job.is_active ? 'Set as Inactive' : 'Set as Active'}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Business Job Reviews Modal */}
      <BusinessJobReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        jobId={job.id}
      />

      {/* Tooltip */}
      <Tooltip id="job-rating-tooltip" />
    </div>
  );
};

export default BusinessJobPostingCard;
