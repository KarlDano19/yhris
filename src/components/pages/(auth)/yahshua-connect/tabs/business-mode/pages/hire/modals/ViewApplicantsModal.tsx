import { useState, useEffect } from 'react';

import Modal from '../../../../../components/Modal';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

import { useGetBusinessJobApplications } from '../hooks/useGetBusinessJobApplications';
import { formatDateToLocal } from '@/helpers/date';
import { T_ApplicantData, T_BusinessJobApplication } from '@/types/business-mode';

interface ViewApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId: number;
  currentBatchNumber: number;
  onViewProfile?: (applicantId: number) => void;
  onHire?: (applicantId: number) => void;
  onReject?: (applicantId: number) => void;
  onViewDailyProgress?: (applicantId: number) => void;
}

// Helper to get initials from name
const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// Transform API application to frontend Applicant type
const transformApplicationToApplicant = (application: T_BusinessJobApplication): T_ApplicantData => ({
  id: application.id,
  applicantId: application.applicant,
  name: application.applicant_name || 'Unknown',
  initials: getInitials(application.applicant_name || ''),
  rating: application.applicant_average_rating || 0,
  reviewsCount: application.applicant_reviews_count || 0,
  description: '', // Will be filled from skills or work experience
  services: application.applicant_skills || [],
  appliedDate: application.created_at ? formatDateToLocal(application.created_at, true) : '',
  status: application.status,
  email: application.applicant_email || '',
  phone: application.applicant_mobile || '',
  photo: application.applicant_photo || null,
});

const ViewApplicantsModal = ({
  isOpen,
  onClose,
  jobTitle,
  jobId,
  currentBatchNumber,
  onViewProfile,
  onHire,
  onReject,
  onViewDailyProgress,
}: ViewApplicantsModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalRecords: 0,
  });

  // Fetch applications for current batch
  const { data: applicationsData, isLoading } = useGetBusinessJobApplications(
    jobId,
    {
      currentPage,
      pageSize,
      viewType: 'current_batch',
    },
    isOpen // Only fetch when modal is open
  );

  // Update pagination when data changes
  useEffect(() => {
    if (applicationsData) {
      setPagination({
        totalPages: applicationsData.total_pages,
        totalRecords: applicationsData.total_records,
      });
    }
  }, [applicationsData]);

  // Transform applications to applicants
  const applicants = applicationsData?.records
    ? applicationsData.records.map(transformApplicationToApplicant)
    : [];

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

  const handleViewProfile = (applicantId: number) => {
    if (onViewProfile) {
      onViewProfile(applicantId);
    }
  };

  const handleHire = (applicantId: number) => {
    if (onHire) {
      onHire(applicantId);
    }
  };

  const handleReject = (applicantId: number) => {
    if (onReject) {
      onReject(applicantId);
    }
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1); // Reset to first page when changing page size
    setPageSize(value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Applicants for '${jobTitle}'`}
      size="2xl"
    >
      <div className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="py-8">
            <LoadingSpinner size="md" showText text="Loading applicants..." />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && applicants.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No applicants yet.
          </div>
        )}

        {/* Applicants List */}
        {!isLoading && applicants.length > 0 && (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {applicants.map((applicant) => (
              <div
                key={applicant.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    {applicant.photo ? (
                      <img
                        src={applicant.photo}
                        alt={applicant.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {applicant.initials}
                      </div>
                    )}

                    {/* Applicant Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {applicant.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {renderStars(applicant.rating)}
                          <span className="text-sm text-gray-600 ml-1">
                            {applicant.rating} ({applicant.reviewsCount} reviews)
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {applicant.description}
                      </p>

                      {/* Services Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {applicant.services.slice(0, 4).map((service: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        {applicant.services.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            +{applicant.services.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Applied Date */}
                  <div className="text-sm text-gray-500">
                    {applicant.appliedDate}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewProfile(applicant.id)}
                    className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue bg-white rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
                  >
                    View Full Profile
                  </button>
                  {applicant.status === 'accepted' ? (
                    <div className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-center">
                      Hired
                    </div>
                  ) : applicant.status === 'rejected' ? (
                    <div className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium text-center">
                      Rejected
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReject(applicant.id)}
                        className="flex-1 px-4 py-2 border border-red-500 text-red-600 bg-white rounded-lg font-medium hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleHire(applicant.id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Hire
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && applicants.length > 0 && (
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={pageSizeChange}
            onPageChange={paginationChange}
          />
        )}
      </div>
    </Modal>
  );
};

export default ViewApplicantsModal;
