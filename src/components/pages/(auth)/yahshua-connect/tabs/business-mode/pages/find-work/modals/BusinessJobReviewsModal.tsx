'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';

import Modal from '@/components/pages/(auth)/yahshua-connect/components/Modal';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import useGetBusinessJobReviews from '../hooks/useGetBusinessJobReviews';

import { formatDateToLocal } from '@/helpers/date';
import { T_BusinessJobReview } from '@/types/business-mode';

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface BusinessJobReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number | null;
}

const BusinessJobReviewsModal = ({ isOpen, onClose, jobId }: BusinessJobReviewsModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalRecords: 0,
  });
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

  const { data: reviewsData, isLoading } = useGetBusinessJobReviews(
    jobId,
    { currentPage, pageSize },
    isOpen
  );

  const [reviews, setReviews] = useState<T_BusinessJobReview[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [jobTitle, setJobTitle] = useState<string>('');

  useEffect(() => {
    if (!reviewsData) {
      setReviews([]);
      setAverageRating(null);
      setReviewsCount(0);
      setJobTitle('');
      setPagination({ totalPages: 1, totalRecords: 0 });
      return;
    }

    // Update with new paginated response structure
    setReviews(reviewsData.records || []);
    setAverageRating(reviewsData.average_rating || null);
    setReviewsCount(reviewsData.reviews_count || 0);
    setJobTitle(reviewsData.job_title || '');
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

  // Generate initials from applicant name
  const getInitials = (name: string) => {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
      title={`Job Reviews${jobTitle ? `: ${jobTitle}` : ''}`}
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
            This job hasn't received any reviews from applicants yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Section */}
          {averageRating !== null && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Job Rating</p>
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
              const hasComment = review.comment !== null &&
                                 review.comment !== undefined &&
                                 String(review.comment).trim().length > 0;
              const displayComment = hasComment ? String(review.comment).trim() : null;

              return (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleReview(review.id)}
                >
                  <div className="flex items-start justify-between p-4">
                    {/* Left side: Applicant Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Applicant Photo/Initial */}
                      {review.applicant_photo && review.applicant_photo !== '/assets/no-user.png' ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={review.applicant_photo}
                            alt={review.applicant_name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {getInitials(review.applicant_name)}
                        </div>
                      )}

                      {/* Applicant Name and Date */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">{review.applicant_name}</h4>
                        <p className="text-xs text-gray-500">
                          {formatDateToLocal(review.created_at, true)}
                        </p>
                        {!isExpanded && (
                          <p className="text-xs text-blue-600 mt-2 italic">Click to {hasComment ? 'view review text' : 'view details'}</p>
                        )}
                      </div>
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

export default BusinessJobReviewsModal;
