'use client';

import React from 'react';

import { Tooltip } from 'react-tooltip';

import ClipIcon from '@/svg/ClipIcon';
import UploadIcon from '@/svg/UploadIcon';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

type Attachment = {
  id?: number;
  attachment: string;
  attachment_name?: string;
  created_at?: string;
  is_signed?: boolean;
};

type Props = {
  attachments: Attachment[];
  label?: string;
  onUploadSignedCopy?: (attachmentId: number | undefined, idx: number) => void;
};

const AttachmentCard = ({ attachments, label, onUploadSignedCopy }: Props) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className='mt-3'>
      {label && <p className='text-sm font-medium text-gray-500 mb-2'>{label}</p>}
      <div className='flex flex-col gap-2'>
        {attachments.map((att, idx) => (
          <div
            key={att.id ?? idx}
            className={`flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border ${att.is_signed ? 'border-green-400' : 'border-gray-200'}`}
          >
            <ClipIcon hasFile={true} />
            <span className='text-base text-gray-700 flex-1 truncate'>{att.attachment_name || `Attachment ${idx + 1}`}</span>

            {att.is_signed && (
              <span className='flex-shrink-0 text-sm font-medium text-green-600 border border-green-500 rounded-full px-2 py-0.5'>
                Signed
              </span>
            )}

            {onUploadSignedCopy && !att.is_signed && (
              <>
                <button
                  onClick={() => onUploadSignedCopy(att.id, idx)}
                  className='flex-shrink-0 flex items-center gap-1 text-sm text-gray-500 hover:text-savoy-blue border border-gray-300 hover:border-savoy-blue rounded px-2 py-0.5 transition-colors'
                  data-tooltip-id={`upload-signed-tooltip-${att.id ?? idx}`}
                  data-tooltip-content='Upload signed copy'
                  data-tooltip-place='bottom'
                >
                  <UploadIcon />
                  Upload
                </button>
                <Tooltip id={`upload-signed-tooltip-${att.id ?? idx}`} />
              </>
            )}

            <button
              onClick={() => window.open(att.attachment, '_blank')}
              className='flex-shrink-0 text-indigo-600 hover:text-indigo-800'
              data-tooltip-id='open-attachment-tooltip'
              data-tooltip-content='Open attachment'
              data-tooltip-place='bottom'
            >
              <ArrowTopRightOnSquareIcon className='h-5 w-5 fill-indigo-600' />
            </button>
          </div>
        ))}
      </div>
      <Tooltip id='open-attachment-tooltip' />
    </div>
  );
};

export default AttachmentCard;
