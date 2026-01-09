import { useState, useEffect } from 'react';

import Modal from '../../../../../components/Modal';

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ReviewApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  jobTitle: string;
  isSubmitting?: boolean;
  onSubmit: (data: { rating: number; review_text?: string }) => void;
}

const ReviewApplicantModal = ({
  isOpen,
  onClose,
  applicantName,
  jobTitle,
  isSubmitting = false,
  onSubmit,
}: ReviewApplicantModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    onSubmit({
      rating,
      review_text: reviewText.trim() || undefined,
    });
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setReviewText('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setHoverRating(0);
      setReviewText('');
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Review Applicant"
      size="md"
      footerContent={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      }
    >
      {/* Applicant Information */}
      <div className="mb-6">
        <p className="text-base font-bold text-gray-900 mb-1">{applicantName}</p>
        <p className="text-sm text-gray-600">Job: {jobTitle}</p>
      </div>

      {/* Rating Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              {star <= (hoverRating || rating) ? (
                <StarIcon className="h-10 w-10 text-yellow-400" />
              ) : (
                <StarOutlineIcon className="h-10 w-10 text-gray-300" />
              )}
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-700">
              {rating} {rating === 1 ? 'star' : 'stars'}
            </span>
          )}
        </div>
      </div>

      {/* Review Text Section */}
      <div className="mb-6">
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
          Review <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience working with this applicant..."
          rows={4}
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy-blue resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          {reviewText.length}/500 characters
        </p>
      </div>
    </Modal>
  );
};

export default ReviewApplicantModal;
