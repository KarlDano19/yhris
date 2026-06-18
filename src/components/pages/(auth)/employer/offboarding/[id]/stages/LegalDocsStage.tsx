'use client';

import React from 'react';

import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

import { formatDateToLocal } from '@/helpers/date';
import AttachmentCard from '../../components/AttachmentCard';
import StageTaskChecklist from '../../components/StageTaskChecklist';

type Props = {
  separation: any;
  onTasksChange?: (hasAny: boolean, allComplete: boolean) => void;
  onOpenLegalDocsEmail?: (modal: { id: number }) => void;
  onMarkReceived: (id: string, type: string) => void;
  isLoading: boolean;
};

const LegalDocsStage = ({ separation, onTasksChange, onOpenLegalDocsEmail, onMarkReceived, isLoading }: Props) => {
  const docsSent = !!separation.is_legal_docs_sent;
  const docsReceived = !!separation.is_legal_docs_received;

  return (
    <div className='space-y-5'>
      {/* Legal Documents card */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm font-semibold text-gray-900'>Legal Documents</h3>
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
          {onOpenLegalDocsEmail && (
            <button
              onClick={() => onOpenLegalDocsEmail({ id: separation.id })}
              data-tooltip-id='legal-docs-tooltip'
              data-tooltip-content={docsReceived ? 'Legal docs already received' : undefined}
              data-tooltip-place='top'
              className='flex-1 flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-dye rounded-lg hover:bg-opacity-90 transition-colors'
            >
              <EnvelopeIcon className='h-4 w-4' />
              {docsSent ? 'Resend Legal Docs' : 'Send Files to Employee'}
            </button>
          )}
          {!docsReceived && (
            <button
              onClick={() => onMarkReceived(String(separation.id), 'legal docs')}
              disabled={isLoading}
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

        {docsReceived && separation.legal_docs_received_date && (
          <p className='text-sm text-gray-600 mt-3'>
            Received on <span className='font-medium'>{formatDateToLocal(separation.legal_docs_received_date)}</span>
          </p>
        )}

        <AttachmentCard attachments={separation.legal_docs_attachments || []} label="Sent Attachments" />
        <Tooltip id='legal-docs-tooltip' />
      </div>

      <StageTaskChecklist separationId={separation.id} stage="legal-docs" title="Legal Docs Tasks" onTasksChange={onTasksChange} />
    </div>
  );
};

export default LegalDocsStage;
