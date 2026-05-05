'use client';

import React from 'react';

import { DocumentCheckIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';
import StageTaskChecklist from '../../components/StageTaskChecklist';

import { T_QuitclaimModal } from '@/types/globals';
import { formatDateToLocal } from '@/helpers/date';
import AttachmentCard from '../../components/AttachmentCard';

type Props = {
  separation: any;
  onOpenQuitclaimModal: (modal: T_QuitclaimModal) => void;
  onMarkReceived: (id: string, type: string) => void;
  isLoading: boolean;
  onTasksChange?: (hasAny: boolean, allComplete: boolean) => void;
};

const LegalDocsStage = ({ separation, onOpenQuitclaimModal, onMarkReceived, isLoading, onTasksChange }: Props) => {
  const quitclaimSigned = !!separation.is_quit_claim_signed;
  const quitclaimReceived = !!separation.is_quit_claim_received;

  return (
    <div className='space-y-5'>
      {/* Quitclaim Section */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm font-semibold text-gray-900'>Quitclaim / General Release</h3>
          <div className='flex items-center gap-2'>
            {quitclaimSigned && !quitclaimReceived && (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700'>Sent</span>
            )}
            {quitclaimReceived && (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                <CheckCircleIcon className='h-3.5 w-3.5' />
                Signed & Received
              </span>
            )}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <button
            onClick={() => onOpenQuitclaimModal({ isOpen: true, id: separation.id })}
            disabled={quitclaimReceived}
            data-tooltip-id='legaldocs-tooltip'
            data-tooltip-content={quitclaimReceived ? 'Quitclaim already received' : undefined}
            data-tooltip-place='top'
            className='flex-1 flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-dye rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
          >
            <EnvelopeIcon className='h-4 w-4' />
            {quitclaimSigned ? 'Resend Quitclaim' : 'Send for Signature'}
          </button>
          {!quitclaimReceived && (
            <button
              onClick={() => onMarkReceived(String(separation.id), 'quit claim')}
              disabled={isLoading || !quitclaimSigned}
              data-tooltip-id='legaldocs-tooltip'
              data-tooltip-content={!quitclaimSigned ? 'Send for signature first' : undefined}
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

        {quitclaimReceived && separation.quit_claim_received_date && (
          <p className='text-sm text-gray-600 mt-3'>
            Received on <span className='font-medium'>{formatDateToLocal(separation.quit_claim_received_date)}</span>
          </p>
        )}

        <AttachmentCard attachments={separation.quitclaim_attachments || []} label="Quitclaim Attachments" />
        <Tooltip id='legaldocs-tooltip' />
      </div>

      <StageTaskChecklist separationId={separation.id} stage="legal-docs" title="Legal Docs Tasks" onTasksChange={onTasksChange} />
    </div>
  );
};

export default LegalDocsStage;
