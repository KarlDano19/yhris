'use client';

import React from 'react';

import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

import { T_DocumentsModal } from '@/types/globals';
import { formatDateToLocal } from '@/helpers/date';
import AttachmentCard from '../../components/AttachmentCard';
import StageTaskChecklist from '../../components/StageTaskChecklist';

type Props = {
  separation: any;
  onOpenDocumentsModal: (modal: T_DocumentsModal) => void;
  onMarkReceived: (id: string, type: string) => void;
  isLoading: boolean;
  onTasksChange?: (hasAny: boolean, allComplete: boolean) => void;
};

const ClearanceStage = ({ separation, onOpenDocumentsModal, onMarkReceived, isLoading, onTasksChange }: Props) => {
  const docsSent = !!separation.is_documents_sent;
  const docsReceived = !!separation.is_documents_received;

  return (
    <div className='space-y-5'>
      {/* Documents Section */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm font-semibold text-gray-900'>Sign Documents</h3>
          <div className='flex items-center gap-2'>
            {docsSent && !docsReceived && (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700'>Sent</span>
            )}
            {docsReceived && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                <CheckCircleIcon className='h-3.5 w-3.5' />
                Received
              </span>
            )}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <button
            onClick={() => onOpenDocumentsModal({ isOpen: true, id: separation.id })}
            data-tooltip-id='clearance-tooltip'
            data-tooltip-content={docsReceived ? 'Documents already received' : undefined}
            data-tooltip-place='top'
            className='flex-1 flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-dye rounded-lg hover:bg-opacity-90 transition-colors'
          >
            <EnvelopeIcon className='h-4 w-4' />
            {docsSent ? 'Resend Documents' : 'Send Documents'}
          </button>
          {!docsReceived && (
            <button
              onClick={() => onMarkReceived(String(separation.id), 'sign documents')}
              disabled={isLoading || !docsSent}
              data-tooltip-id='clearance-tooltip'
              data-tooltip-content={!docsSent ? 'Send documents first' : undefined}
              data-tooltip-place='top'
              className='flex-1 flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
              ) : (
                <CheckCircleIcon className='h-4 w-4' />
              )}
              Mark as Received
            </button>
          )}
        </div>

        {docsReceived && separation.documents_received_date && (
          <p className='text-sm text-gray-600 mt-3'>
            Received on <span className='font-medium'>{formatDateToLocal(separation.documents_received_date)}</span>
          </p>
        )}

        <AttachmentCard attachments={separation.document_attachments || []} label="Document Attachments" />
        <Tooltip id='clearance-tooltip' />
      </div>

      <StageTaskChecklist separationId={separation.id} stage="clearance" title="Clearance Tasks" onTasksChange={onTasksChange} />
    </div>
  );
};

export default ClearanceStage;
