import React, { useState } from 'react';

import { ArchiveBoxIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import RestoreApplicationModal from './modals/RestoreApplicationModal';
import useArchiveApplication from './hooks/useArchiveApplication';
import useUnarchiveApplication from './hooks/useUnarchiveApplication';

import classNames from '@/helpers/classNames';

interface ArchiveButtonProps {
  appliedJobId: number;
  isArchived: boolean;
  status: string;
  onSuccess?: () => void;
  disabled?: boolean;
  applicantName?: string;
  jobPostingId?: string;
}

const ArchiveButton: React.FC<ArchiveButtonProps> = ({
  appliedJobId,
  isArchived,
  status,
  onSuccess,
  disabled = false,
  applicantName = 'Applicant',
  jobPostingId = ''
}) => {
  const { mutate: archive, isLoading: isArchiving } = useArchiveApplication();
  const { mutate: unarchive, isLoading: isUnarchiving } = useUnarchiveApplication();
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const handleArchive = () => {
    const callBackReq = {
      onSuccess: (data: any) => {
        if (onSuccess) {
          onSuccess();
        }
        // Dispatch a global event so parent containers can refresh applicant lists
        try {
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('applicant:archived', { detail: { appliedJobId, status } }));
          }
        } catch (err) {
          // ignore
        }
      },
      onError: (err: any) => {
        console.error('Archive error:', err);
        alert(`Error: ${err.message || 'Operation failed'}`);
      },
    };

    archive(appliedJobId, callBackReq);
  };

  const handleUnarchive = (fallbackStageId: number) => {
    const callBackReq = {
      onSuccess: (data: any) => {
        setShowRestoreModal(false);
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (err: any) => {
        console.error('Unarchive error:', err);
        alert(`Error: ${err.message || 'Operation failed'}`);
      },
    };

    unarchive({ appliedJobId, fallbackStageId }, callBackReq);
  };

  // Only show archive button for rejected, withdrawn, or pooling applications
  const allowedArchiveStatuses = ['rejected', 'withdrawn', 'pooling'];
  if (!isArchived && !allowedArchiveStatuses.includes(status)) {
    return null;
  }

  const isLoading = isArchiving || isUnarchiving;

  return (
    <>
      <SmartButton
        id="archive-applicant-btn"
        onClick={isArchived ? () => setShowRestoreModal(true) : handleArchive}
        disabled={disabled || isLoading}
        className={classNames(
          isArchived
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-500 hover:bg-gray-600 text-white',
          'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        title={
          isArchived
            ? 'Restore application'
            : status === 'pooling'
            ? 'Move to pool'
            : 'Archive application'
        }
      >
        {isArchived ? (
          <>
            <ArrowUturnLeftIcon className="w-3 h-3" />
            Restore
          </>
        ) : (
          <>
            <ArchiveBoxIcon className="w-3 h-3" />
            {status === 'pooling' ? 'Pool' : 'Archive'}
          </>
        )}
      </SmartButton>

      <RestoreApplicationModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onConfirm={handleUnarchive}
        applicantName={applicantName}
        jobPostingId={jobPostingId}
        isLoading={isUnarchiving}
        appliedJobId={appliedJobId} // Pass the appliedJobId here
      />
    </>
  );
};

export default ArchiveButton; 