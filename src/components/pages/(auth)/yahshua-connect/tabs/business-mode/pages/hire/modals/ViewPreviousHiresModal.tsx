'use client';

import { useState } from 'react';
import Modal from '../../../../../components/Modal';
import { T_BusinessJobApplication } from '@/types/business-mode';

interface ViewPreviousHiresModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  previousBatchApplicants: T_BusinessJobApplication[];
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
  previousBatchApplicants,
  currentBatchNumber,
}: ViewPreviousHiresModalProps) => {
  const [selectedBatch, setSelectedBatch] = useState<number | 'all'>('all');

  // Get unique batch numbers
  const batchNumbers = Array.from(
    new Set(previousBatchApplicants.map(app => app.batch_number))
  ).sort((a, b) => b - a); // Sort descending (most recent first)

  // Filter applicants by selected batch
  const filteredApplicants = selectedBatch === 'all'
    ? previousBatchApplicants
    : previousBatchApplicants.filter(app => app.batch_number === selectedBatch);

  // Only show accepted applicants
  const acceptedApplicants = filteredApplicants.filter(app => app.status === 'accepted');

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
                Total Completed Batches: {currentBatchNumber - 1}
              </p>
              <p className="text-sm text-gray-600">
                Total Previous Hires: {previousBatchApplicants.filter(app => app.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>

        {/* Batch Filter */}
        {batchNumbers.length > 1 && (
          <div className="flex items-center gap-3">
            <label htmlFor="batch-filter" className="text-sm font-medium text-gray-700">
              Filter by Batch:
            </label>
            <select
              id="batch-filter"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value === 'all' ? 'all' : Number(e.target.value))}
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

        {/* Previous Hires List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {acceptedApplicants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No previous hires found
            </div>
          ) : (
            acceptedApplicants.map((app) => {
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

                  {/* Additional Info if available */}
                  {(app.cover_letter || app.proposal) && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {app.cover_letter || app.proposal}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

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
