import React, { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';
import { formatDateToLocal } from '@/helpers/date';
import ModalLayout from '../../../../../ModalLayout';
import ArchiveButton from '../ArchiveButton';
import RestoreApplicationModal from './RestoreApplicationModal';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import useBatchUnarchiveApplications from '../hooks/useBatchUnarchiveApplications';
import useSoftDeleteApplication from '../hooks/useSoftDeleteApplication';
import useRestoreDeletedApplication from '../hooks/useRestoreDeletedApplication';
import useGetDeletedApplicants from '../hooks/useGetDeletedApplicants';
import usePurgeApplication from '../hooks/usePurgeApplication';

import { ArchiveBoxIcon, MagnifyingGlassIcon, TrashIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

interface ArchivedApplicantsModalProps {
  isOpen: boolean;
  handleClose: () => void;
  jobPostingId: string;
  archivedApplicants?: any[];
  onUnarchive?: () => void;
  onRefresh?: () => void; // Add this new prop
}

const ApplicantAvatar = ({ applicant, size = 40 }: { applicant: any; size?: number }) => {
  const [imageError, setImageError] = useState(false);

  const hasValidImage = applicant.applicant?.photo_url &&
    applicant.applicant.photo_url.trim() !== '' &&
    !imageError;

  if (!hasValidImage) {
    return (
      <PlaceholderAvatar
        width={size}
        height={size}
        firstName={applicant.applicant?.firstname || ''}
        lastName={applicant.applicant?.lastname || ''}
        className='flex-shrink-0'
      />
    );
  }

  return (
    <img
      src={applicant.applicant.photo_url}
      alt={`${applicant.applicant?.firstname} ${applicant.applicant?.lastname}` || 'Applicant'}
      width={size}
      height={size}
      className='w-full h-full rounded-full object-cover flex-shrink-0'
      onError={() => setImageError(true)}
    />
  );
};

const ArchivedApplicantsModal: React.FC<ArchivedApplicantsModalProps> = ({
  isOpen,
  handleClose,
  jobPostingId,
  archivedApplicants = [],
  onUnarchive,
  onRefresh
}) => {

  const [activeTab, setActiveTab] = useState<'rejected' | 'withdrawn' | 'pooling' | 'deleted'>('rejected');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: unarchiveBatch, isLoading: isUnarchiving } = useBatchUnarchiveApplications();
  const { mutate: softDelete, isLoading: isSoftDeleting } = useSoftDeleteApplication();
  const { mutate: restoreDeleted, isLoading: isRestoringDeleted } = useRestoreDeletedApplication();
  const { data: deletedData, refetch: refetchDeleted } = useGetDeletedApplicants(jobPostingId);
  const deletedApplicants: any[] = (deletedData as any[]) || [];
  const { mutate: purgeApplication, isLoading: isPurging } = usePurgeApplication();
  const [purgeModal, setPurgeModal] = useState<DeleteModalData | null>(null);

  // Add refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add refresh handler that fetches fresh archived data
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Call the parent's refetch function to get fresh archived applicants data
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  // Separate applications by status
  const rejectedApplicants = archivedApplicants?.filter((applicant: any) => applicant.status === 'rejected') || [];
  const withdrawnApplicants = archivedApplicants?.filter((applicant: any) => applicant.status === 'withdrawn') || [];
  const poolingApplicants = archivedApplicants?.filter((applicant: any) => applicant.status === 'pooling') || [];

  const searchFilter = (applicant: any) =>
    `${applicant.applicant?.firstname || ''} ${applicant.applicant?.lastname || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    applicant.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase());

  // Filter applications based on search term
  const filteredRejectedApplicants = rejectedApplicants.filter(searchFilter);
  const filteredWithdrawnApplicants = withdrawnApplicants.filter(searchFilter);
  const filteredPoolingApplicants = poolingApplicants.filter(searchFilter);
  const filteredDeletedApplicants = deletedApplicants.filter(searchFilter);


  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleUnarchive = useCallback(() => {
    // Call the parent callback to refresh the main applicants list
    if (onUnarchive) {
      onUnarchive();
    }

    // Clear selection after successful unarchive
    setSelectedApplicants([]);
  }, [onUnarchive]);

  const handleSelectApplicant = (applicantId: number) => {
    setSelectedApplicants(prev => {
      if (prev.includes(applicantId)) {
        return prev.filter(id => id !== applicantId);
      } else {
        return [...prev, applicantId];
      }
    });
  };

  const handleSelectAll = (applicants: any[]) => {
    if (applicants.length > 0) {
      if (selectedApplicants.length === applicants.length) {
        // If all are selected, unselect all
        setSelectedApplicants([]);
      } else {
        // Otherwise, select all
        setSelectedApplicants(applicants.map(app => app.id));
      }
    }
  };

  const handleBatchRestore = useCallback((fallbackStageId: number) => {
    if (!selectedApplicants.length) {
      return;
    }

    const callBackReq = {
      onSuccess: (data: any) => {
        setShowRestoreModal(false);
        handleUnarchive();
      },
      onError: (err: any) => {
        alert(`Error: ${err.message || 'Operation failed'}`);
      },
      onProgress: (processed: number) => {
        // Progress tracking
      }
    };

    unarchiveBatch({ appliedJobIds: selectedApplicants, fallbackStageId, progressCallback: callBackReq.onProgress }, callBackReq);
  }, [selectedApplicants, unarchiveBatch, handleUnarchive]);

  const handleSoftDelete = useCallback((appliedJobId: number) => {
    softDelete(appliedJobId, {
      onSuccess: () => {
        if (onRefresh) onRefresh();
        refetchDeleted();
      },
      onError: (err: any) => {
        alert(`Error: ${err.message || 'Failed to delete application'}`);
      },
    });
  }, [softDelete, onRefresh, refetchDeleted]);

  const handleRestoreDeleted = useCallback((appliedJobId: number) => {
    restoreDeleted(appliedJobId, {
      onSuccess: () => {
        refetchDeleted();
        if (onRefresh) onRefresh();
        queryClient.invalidateQueries(['appliedApplicantsCache']);
      },
      onError: (err: any) => {
        alert(`Error: ${err.message || 'Failed to restore application'}`);
      },
    });
  }, [restoreDeleted, refetchDeleted, onRefresh, queryClient]);

  const handlePurge = useCallback((applicant: any) => {
    setPurgeModal({ open: true, applicationId: applicant.id });
  }, []);

  const handleConfirmPurge = useCallback(() => {
    if (!purgeModal) return;
    purgeApplication(purgeModal.applicationId, {
      onSuccess: () => {
        setPurgeModal(null);
        refetchDeleted();
      },
      onError: (err: any) => {
        setPurgeModal(null);
        alert(`Error: ${err.message || 'Failed to permanently delete'}`);
      },
    });
  }, [purgeModal, purgeApplication, refetchDeleted]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const currentApplicants =
    activeTab === 'rejected'
      ? filteredRejectedApplicants
      : activeTab === 'withdrawn'
      ? filteredWithdrawnApplicants
      : activeTab === 'pooling'
      ? filteredPoolingApplicants
      : filteredDeletedApplicants;
  const allSelected = currentApplicants.length > 0 && selectedApplicants.length === currentApplicants.length;


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-yellow-100 text-yellow-800';
      case 'pooling':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderApplicantCard = (applicant: any) => (
    <div
      key={applicant.id}
      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedApplicants.includes(applicant.id)}
              onChange={() => handleSelectApplicant(applicant.id)}
              className="h-4 w-4 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <ApplicantAvatar applicant={applicant} size={40} />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {applicant.applicant?.firstname} {applicant.applicant?.lastname}
            </h3>
            <p className="text-sm text-gray-500">
              {applicant.applicant?.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
              </span>
              <span className="text-xs text-gray-400">
                {applicant.job_stages_title || 'Archived'} • {formatDateToLocal(applicant.updated_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSoftDelete(applicant.id)}
            disabled={isSoftDeleting}
            title="Delete application"
            className="inline-flex items-center p-1.5 border border-red-200 text-red-500 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          <ArchiveButton
            appliedJobId={applicant.id}
            isArchived={true}
            status={applicant.status}
            onSuccess={() => {
              handleUnarchive();
            }}
            applicantName={`${applicant.applicant?.firstname} ${applicant.applicant?.lastname}`}
            jobPostingId={jobPostingId}
          />
        </div>
      </div>
    </div>
  );

  const renderDeletedApplicantCard = (applicant: any) => (
    <div
      key={applicant.id}
      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <ApplicantAvatar applicant={applicant} size={40} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {applicant.applicant?.firstname} {applicant.applicant?.lastname}
            </h3>
            <p className="text-sm text-gray-500">
              {applicant.applicant?.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
              </span>
              <span className="text-xs text-gray-400">
                {applicant.job_stages_title || 'Archived'} • {formatDateToLocal(applicant.updated_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePurge(applicant)}
            disabled={isPurging}
            title="Permanently delete"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 text-sm rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={() => handleRestoreDeleted(applicant.id)}
            disabled={isRestoringDeleted}
            title="Restore application"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-sm rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-colors"
          >
            <ArrowUturnLeftIcon className="w-4 h-4" />
            Restore
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ModalLayout title="Archived Applications" isOpen={isOpen} handleClose={handleClose}>
        <div className="flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4 text-gray-600">
              <ArchiveBoxIcon className="w-5 h-5" />
              <span className="text-sm">Applications that have been archived</span>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
              <button
                onClick={() => {
                  setActiveTab('rejected');
                  setSearchTerm('');
                  setSelectedApplicants([]);
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'rejected'
                    ? 'bg-white text-red-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Rejected ({rejectedApplicants.length})
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('withdrawn');
                  setSearchTerm('');
                  setSelectedApplicants([]);
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'withdrawn'
                    ? 'bg-white text-yellow-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Withdrawn ({withdrawnApplicants.length})
                </div>
              </button>
              {/* Pooling Tab */}
              <button
                onClick={() => {
                  setActiveTab('pooling');
                  setSearchTerm('');
                  setSelectedApplicants([]);
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'pooling'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Pooling ({poolingApplicants.length})
                </div>
              </button>
              {/* Deleted Tab */}
              <button
                onClick={() => {
                  setActiveTab('deleted');
                  setSearchTerm('');
                  setSelectedApplicants([]);
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'deleted'
                    ? 'bg-white text-red-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrashIcon className="w-3.5 h-3.5 text-gray-500" />
                  Deleted ({deletedApplicants.length})
                </div>
              </button>
            </div>


            {/* Search Bar and Actions */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab} applications...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Search is handled by the filter logic automatically
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Add refresh button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isRefreshing ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </button>

              {selectedApplicants.length > 0 && activeTab !== 'deleted' && (
                <button
                  onClick={() => setShowRestoreModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isUnarchiving}
                >
                  {isUnarchiving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Restore Selected (${selectedApplicants.length})`
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-6">
                {activeTab === 'rejected' && (
                  <>
                    {filteredRejectedApplicants.length > 0 && (
                      <div className="mb-3 flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => handleSelectAll(filteredRejectedApplicants)}
                            className="h-4 w-4 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {allSelected ? 'Deselect All' : 'Select All'}
                          </span>
                        </label>
                      </div>
                    )}

                    {filteredRejectedApplicants.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ArchiveBoxIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        {searchTerm ? (
                          <p>No rejected applications found matching &quot;{searchTerm}&quot;</p>
                        ) : rejectedApplicants.length === 0 ? (
                          <p>No rejected applications found</p>
                        ) : (
                          <p>No applications match your search</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredRejectedApplicants.map(renderApplicantCard)}
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'withdrawn' && (
                  <>
                    {filteredWithdrawnApplicants.length > 0 && (
                      <div className="mb-3 flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => handleSelectAll(filteredWithdrawnApplicants)}
                            className="h-4 w-4 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {allSelected ? 'Deselect All' : 'Select All'}
                          </span>
                        </label>
                      </div>
                    )}

                    {filteredWithdrawnApplicants.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ArchiveBoxIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        {searchTerm ? (
                          <p>No withdrawn applications found matching &quot;{searchTerm}&quot;</p>
                        ) : withdrawnApplicants.length === 0 ? (
                          <p>No withdrawn applications found</p>
                        ) : (
                          <p>No applications match your search</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredWithdrawnApplicants.map(renderApplicantCard)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'pooling' && (
                  <>
                    {filteredPoolingApplicants.length > 0 && (
                      <div className="mb-3 flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => handleSelectAll(filteredPoolingApplicants)}
                            className="h-4 w-4 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {allSelected ? 'Deselect All' : 'Select All'}
                          </span>
                        </label>
                      </div>
                    )}

                    {filteredPoolingApplicants.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ArchiveBoxIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        {searchTerm ? (
                          <p>No pooling applications found matching &quot;{searchTerm}&quot;</p>
                        ) : poolingApplicants.length === 0 ? (
                          <p>No pooling applications found</p>
                        ) : (
                          <p>No applications match your search</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredPoolingApplicants.map(renderApplicantCard)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'deleted' && (
                  <>
                    {filteredDeletedApplicants.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <TrashIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        {searchTerm ? (
                          <p>No deleted applications found matching &quot;{searchTerm}&quot;</p>
                        ) : (
                          <p>No deleted applications found</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredDeletedApplicants.map(renderDeletedApplicantCard)}
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
        </div>

        {/* Restore Multiple Applications Modal */}
      {showRestoreModal && (
        <RestoreApplicationModal
          isOpen={showRestoreModal}
          onClose={() => setShowRestoreModal(false)}
          onConfirm={handleBatchRestore}
          applicantName={`${selectedApplicants.length} application${selectedApplicants.length > 1 ? 's' : ''}`}
          jobPostingId={jobPostingId}
          isMultiple={true}
          selectedApplicantIds={selectedApplicants}
          onSuccess={handleUnarchive}
        />
      )}

      {purgeModal && (
        <DeleteModal
          isOpen={purgeModal}
          setIsOpen={setPurgeModal}
          onConfirm={handleConfirmPurge}
          isLoading={isPurging}
          customText="this application permanently"
        />
      )}
      </ModalLayout>
    </>
  );
};

export default ArchivedApplicantsModal;
