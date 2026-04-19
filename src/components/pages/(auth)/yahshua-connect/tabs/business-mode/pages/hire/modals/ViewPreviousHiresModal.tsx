'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../../components/Modal';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';

import { useGetBusinessJobApplications } from '../hooks/useGetBusinessJobApplications';
import { T_BusinessJobApplication } from '@/types/business-mode';

interface ViewPreviousHiresModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId: number;
  currentBatchNumber: number;
}

// Helper to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const ViewPreviousHiresModal = ({
  isOpen,
  onClose,
  jobTitle,
  jobId,
  currentBatchNumber,
}: ViewPreviousHiresModalProps) => {
  const [selectedBatch, setSelectedBatch] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalRecords: 0,
  });

  // Fetch previous batch applications
  const { data: applicationsData, isLoading } = useGetBusinessJobApplications(
    jobId,
    {
      currentPage,
      pageSize,
      viewType: 'previous_batches',
      batchNumber: selectedBatch,
      status: 'accepted', // Only show accepted/hired applicants
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

  // Get accepted applicants
  const acceptedApplicants = applicationsData?.records || [];

  // Get unique batch numbers for filter (from current data)
  const batchNumbers = Array.from(
    new Set(acceptedApplicants.map(app => app.batch_number))
  ).sort((a, b) => b - a); // Sort descending (most recent first)

  const handleBatchChange = (value: string) => {
    const batchValue = value === 'all' ? undefined : Number(value);
    setSelectedBatch(batchValue);
    setCurrentPage(1); // Reset to first page when changing batch
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
      title={`Previous Hires - ${jobTitle}`}
      size="2xl"
    >
      <div className="space-y-4">
        {/* Summary Header */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Total Completed Batches: {currentBatchNumber > 1 ? currentBatchNumber - 1 : 0}
              </p>
              <p className="text-sm text-gray-600">
                Total Previous Hires: {pagination.totalRecords}
              </p>
            </div>
          </div>
        </div>

        {/* Batch Filter */}
        {!isLoading && batchNumbers.length > 1 && (
          <div className="flex items-center gap-3">
            <label htmlFor="batch-filter" className="text-sm font-medium text-gray-700">
              Filter by Batch:
            </label>
            <select
              id="batch-filter"
              value={selectedBatch ?? 'all'}
              onChange={(e) => handleBatchChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-savoy-blue focus:ring-savoy-blue"
            >
              <option value="all">All Batches</option>
              {batchNumbers.map((batchNum) => (
                <option key={batchNum} value={batchNum}>
                  Batch #{batchNum}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-8">
            <LoadingSpinner size="md" showText text="Loading previous hires..." />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && acceptedApplicants.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No previous hires found
          </div>
        )}

        {/* Previous Hires List */}
        {!isLoading && acceptedApplicants.length > 0 && (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {acceptedApplicants.map((app) => {
              const initials = getInitials(app.applicant_name || 'U');

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      {app.applicant_photo ? (
                        <img
                          src={app.applicant_photo}
                          alt={app.applicant_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-savoy-blue to-indigo-dye flex items-center justify-center text-white font-semibold">
                          {initials}
                        </div>
                      )}

                      {/* Applicant Info */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {app.applicant_name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            Batch #{app.batch_number}
                          </span>
                          {app.applicant_email && (
                            <span className="text-xs text-gray-500">
                              {app.applicant_email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Completed
                      </span>
                      {app.created_at && (
                        <span className="text-xs text-gray-500">
                          Hired: {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && acceptedApplicants.length > 0 && (
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={pageSizeChange}
            onPageChange={paginationChange}
          />
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewPreviousHiresModal;
