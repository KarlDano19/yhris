 'use client';

import Modal from '../../../../../components/Modal';

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface ApplicantData {
  id: number;
  name: string;
  initials: string;
  rating: number;
  reviewsCount: number;
}

interface JobDetails {
  title: string;
  scheduledDate: string;
  scheduledTime: string;
  priceRange: string;
}

interface ConfirmHireModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantData;
  jobDetails: JobDetails;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ConfirmHireModal = ({
  isOpen,
  onClose,
  applicant,
  jobDetails,
  onConfirm,
  isLoading = false,
}: ConfirmHireModalProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return starValue <= rating ? (
        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarIconOutline key={i} className="h-4 w-4 text-gray-300" />
      );
    });
  };

  const footerContent = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isLoading}
        className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        )}
        {isLoading ? 'Hiring...' : 'Confirm Hire'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Hire"
      size="lg"
      footerContent={footerContent}
    >
      <div className="space-y-6">
        {/* Candidate Information */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-savoy-blue flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {applicant.initials}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {applicant.name}
            </h3>
            <div className="flex items-center gap-1">
              {renderStars(applicant.rating)}
              <span className="text-sm text-gray-600 ml-1">
                {applicant.rating} ({applicant.reviewsCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Job Details
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-900">
                {jobDetails.title}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {jobDetails.scheduledDate} • {jobDetails.scheduledTime}
            </div>
            <div className="text-sm font-semibold text-green-600">
              {jobDetails.priceRange}
            </div>
          </div>
        </div>

        {/* Confirmation Prompt */}
        <div>
          <p className="text-sm text-gray-700">
            Are you sure you want to hire {applicant.name} for this job?
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmHireModal;

