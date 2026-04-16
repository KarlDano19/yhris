import { useState, useEffect } from 'react';

import Modal from '../components/Modal';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import useGetMyReviews from '../hooks/useGetMyReviews';

import { formatDateToLocal } from '@/helpers/date';
import { T_Review } from '@/types/personal-mode';

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface MyReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId?: number; // Optional: if provided, fetch reviews for that applicant; otherwise fetch for authenticated user
}

const MyReviewsModal = ({ isOpen, onClose, applicantId }: MyReviewsModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalRecords: 0,
  });
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

  const { data: reviewsData, isLoading } = useGetMyReviews(
    applicantId,
    { currentPage, pageSize },
    isOpen
  );

  const [reviews, setReviews] = useState<T_Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [applicantName, setApplicantName] = useState<string>('');

  useEffect(() => {
    if (!reviewsData) {
      setReviews([]);
      setAverageRating(null);
      setReviewsCount(0);
      setApplicantName('');
      setPagination({ totalPages: 1, totalRecords: 0 });
      return;
    }

    // Update with new paginated response structure
    setReviews(reviewsData.records || []);
    setAverageRating(reviewsData.average_rating || null);
    setReviewsCount(reviewsData.reviews_count || 0);
    setApplicantName(reviewsData.applicant_name || '');
    setPagination({
      totalPages: reviewsData.total_pages || 1,
      totalRecords: reviewsData.total_records || 0,
    });
  }, [reviewsData]);

  const toggleReview = (reviewId: number) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIcon key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          ) : (
            <StarOutlineIcon key={star} className="h-4 w-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
    setExpandedReviews(new Set()); // Reset expanded reviews when page changes
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
    setExpandedReviews(new Set());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reviews"
      size="2xl"
    >
      {isLoading ? (
        <div className="py-8">
          <LoadingSpinner size="md" showText text="Loading reviews..." />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <StarOutlineIcon className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">No reviews yet</p>
          <p className="text-sm text-gray-400 text-center mt-1">
            {applicantName ? `${applicantName} hasn't received any reviews yet` : 'You haven\'t received any reviews yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Section */}
          {averageRating !== null && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {applicantName ? `${applicantName}'s Rating` : 'Your Rating'}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                      <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-600">({reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'})</span>
                  </div>
                </div>
                {renderStars(Math.round(averageRating))}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {reviews.map((review) => {
              const isExpanded = expandedReviews.has(review.id);
              // Check if comment exists and is not empty - handle various cases
              const commentValue = review.comment || (review as any).review_text || null;
              const hasComment = commentValue !== null &&
                                 commentValue !== undefined &&
                                 String(commentValue).trim().length > 0;
              const displayComment = hasComment ? String(commentValue).trim() : null;

              return (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleReview(review.id)}
                >
                  <div className="flex items-start justify-between p-4">
                    {/* Left side: Job Title, Job Category, Review Date */}
                    <div className="flex-1 min-w-0">
                      {review.job_title && (
                        <h4 className="font-semibold text-gray-900 mb-1">{review.job_title}</h4>
                      )}
                      {review.job_category && (
                        <p className="text-sm text-gray-600 mb-2">{review.job_category}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatDateToLocal(review.created_at, true)}
                      </p>
                      {!isExpanded && (
                        <p className="text-xs text-blue-600 mt-2 italic">Click to {hasComment ? 'view review text' : 'view details'}</p>
                      )}
                    </div>

                    {/* Right side: Star Rating */}
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <div>
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>

                  {/* Review Text Dropdown */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-3 border-t border-gray-200 bg-gray-50">
                      {hasComment && displayComment ? (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{displayComment}</p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No comments added</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {!isLoading && reviews.length > 0 && (
            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageSizeChange={pageSizeChange}
              onPageChange={paginationChange}
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default MyReviewsModal;

