'use client';

import React from 'react';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

import ClipIcon from '@/svg/ClipIcon';

type Attachment = {
  id?: number;
  attachment: string;
  attachment_name?: string;
  created_at?: string;
};

type Props = {
  attachments: Attachment[];
  label?: string;
};

const AttachmentCard = ({ attachments, label }: Props) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className='mt-3'>
      {label && <p className='text-xs font-medium text-gray-500 mb-2'>{label}</p>}
      <div className='flex flex-col gap-2'>
        {attachments.map((att, idx) => (
          <div key={att.id ?? idx} className='flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200'>
            <ClipIcon hasFile={true} />
            <span className='text-sm text-gray-700 flex-1 truncate'>{att.attachment_name || `Attachment ${idx + 1}`}</span>
            <button
              onClick={() => window.open(att.attachment, '_blank')}
              className='flex-shrink-0 text-indigo-600 hover:text-indigo-800'
              data-tooltip-id='open-attachment-tooltip'
              data-tooltip-content='Open attachment'
              data-tooltip-place='bottom'
            >
              <ArrowTopRightOnSquareIcon className='h-5 w-5' />
            </button>
          </div>
        ))}
      </div>
      <Tooltip id='open-attachment-tooltip' />
    </div>
  );
};

export default AttachmentCard;
