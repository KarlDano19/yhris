'use client';

import React, { useRef, useState, useEffect } from 'react';

import { DocumentTextIcon, EnvelopeIcon, CheckCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

import { T_LetterModal } from '@/types/globals';
import { formatDateToLocal } from '@/helpers/date';
import AttachmentCard from '../../components/AttachmentCard';

type Props = {
  separation: any;
  onOpenLetterModal: (modal: T_LetterModal) => void;
  onOpenSendLetterModal: (modal: T_LetterModal) => void;
  onMarkReceived: (id: string, type: string) => void;
  isLoading: boolean;
};

const InitiationStage = ({ separation, onOpenLetterModal, onOpenSendLetterModal, onMarkReceived, isLoading }: Props) => {
  const hasLetter = !!separation.letter_attachment || (separation.letter_attachments?.length > 0);
  const letterSent = !!separation.is_letter_sent;
  const letterReceived = !!separation.is_letter_received;
  const [isGenerateDropdownOpen, setIsGenerateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsGenerateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='space-y-5'>
      {/* Resignation Details */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
        <h3 className='text-sm font-semibold text-gray-900 mb-4'>Resignation Details</h3>
        <dl className='grid grid-cols-2 gap-x-6 gap-y-3'>
          <div>
            <dt className='text-xs text-gray-400 uppercase tracking-wide'>Date of Separation</dt>
            <dd className='text-sm font-medium text-gray-800 mt-0.5'>{formatDateToLocal(separation.date_of_separation)}</dd>
          </div>
          <div>
            <dt className='text-xs text-gray-400 uppercase tracking-wide'>Reason for Leaving</dt>
            <dd className='text-sm font-medium text-gray-800 mt-0.5'>{separation.reason_of_leaving || '—'}</dd>
          </div>
          <div>
            <dt className='text-xs text-gray-400 uppercase tracking-wide'>Position</dt>
            <dd className='text-sm font-medium text-gray-800 mt-0.5'>{separation.position || '—'}</dd>
          </div>
          <div>
            <dt className='text-xs text-gray-400 uppercase tracking-wide'>Department</dt>
            <dd className='text-sm font-medium text-gray-800 mt-0.5'>{separation.department || '—'}</dd>
          </div>
          {separation.effective_date && (
            <div>
              <dt className='text-xs text-gray-400 uppercase tracking-wide'>Last Working Day</dt>
              <dd className='text-sm font-medium text-gray-800 mt-0.5'>{formatDateToLocal(separation.effective_date)}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Letter Section */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm font-semibold text-gray-900'>Letter of Documentation</h3>
          {letterReceived ? (
            <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'>
              <CheckCircleIcon className='h-3.5 w-3.5' />
              Received
            </span>
          ) : letterSent ? (
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700'>
              Sent
            </span>
          ) : null}
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          {/* Generate Letter dropdown */}
          <div className='flex-1 relative' ref={dropdownRef}>
            <button
              onClick={() => setIsGenerateDropdownOpen((prev) => !prev)}
              disabled={letterReceived}
              data-tooltip-id='initiation-tooltip'
              data-tooltip-content={letterReceived ? 'Letter already received' : undefined}
              data-tooltip-place='top'
              className='w-full flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
            >
              <DocumentTextIcon className='h-4 w-4' />
              {hasLetter ? 'Regenerate Letter' : 'Generate Letter'}
              <ChevronDownIcon className={`h-4 w-4 ml-auto transition-transform ${isGenerateDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isGenerateDropdownOpen && (
              <div className='absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden'>
                <button
                  onClick={() => { onOpenLetterModal({ id: separation.id, type: 'Acceptance' }); setIsGenerateDropdownOpen(false); }}
                  className='w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  Letter of Acceptance
                </button>
                <button
                  onClick={() => { onOpenLetterModal({ id: separation.id, type: 'Separation' }); setIsGenerateDropdownOpen(false); }}
                  className='w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  Letter of Separation
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => onOpenSendLetterModal({ id: separation.id, type: 'Acceptance' })}
            disabled={!hasLetter || letterReceived}
            data-tooltip-id='initiation-tooltip'
            data-tooltip-content={letterReceived ? 'Letter already received' : !hasLetter ? 'Generate a letter first' : undefined}
            data-tooltip-place='top'
            className='flex-1 flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-dye rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
          >
            <EnvelopeIcon className='h-4 w-4' />
            {letterSent ? 'Resend Letter' : 'Send Letter'}
          </button>
        </div>

        {!hasLetter && (
          <p className='text-xs text-gray-400 mt-3 text-center'>Generate a letter first before sending.</p>
        )}

        {!letterReceived && (
          <button
            onClick={() => onMarkReceived(String(separation.id), 'letters')}
            disabled={isLoading || !hasLetter || !letterSent}
            data-tooltip-id='initiation-tooltip'
            data-tooltip-content={!hasLetter ? 'Generate a letter first' : !letterSent ? 'Send the letter first' : undefined}
            data-tooltip-place='top'
            className='mt-3 w-full flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
            ) : (
              <CheckCircleIcon className='h-4 w-4' />
            )}
            Mark Letter as Received
          </button>
        )}

        {letterReceived && (
          <p className='text-sm text-green-700 font-medium mt-3 flex items-center gap-1'>
            <CheckCircleIcon className='h-4 w-4' />
            Letter received{separation.letter_received_date ? ` on ${formatDateToLocal(separation.letter_received_date)}` : ''}
          </p>
        )}

        <AttachmentCard attachments={separation.letter_attachments || []} label="Attached Letters" />
      </div>

      <Tooltip id='initiation-tooltip' />
    </div>
  );
};

export default InitiationStage;
