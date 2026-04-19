import { useState, useEffect } from 'react';

import Modal from '../../../../../components/Modal';

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ReviewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  employerName: string;
  isSubmitting?: boolean;
  onSubmit: (data: { rating: number; comment?: string }) => void;
}

const ReviewJobModal = ({
  isOpen,
  onClose,
  jobTitle,
  employerName,
  isSubmitting = false,
  onSubmit,
}: ReviewJobModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    onSubmit({
      rating,
      comment: comment.trim() || undefined,
    });
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setHoverRating(0);
      setComment('');
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Review Job"
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
      {/* Job Information */}
      <div className="mb-6">
        <p className="text-base font-bold text-gray-900 mb-1">{jobTitle}</p>
        <p className="text-sm text-gray-600">Employer: {employerName}</p>
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
                <StarIcon className="h-8 w-8 text-yellow-400" />
              ) : (
                <StarOutlineIcon className="h-8 w-8 text-gray-300" />
              )}
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-700">
              {rating}.0 out of 5
            </span>
          )}
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comment (Optional)
        </label>
        <textarea
          id="review-comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience working on this job..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-savoy-blue focus:ring-savoy-blue resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
      </div>

      {/* Helper Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          Your review helps other professionals make informed decisions about similar opportunities.
        </p>
      </div>
    </Modal>
  );
};

export default ReviewJobModal;
