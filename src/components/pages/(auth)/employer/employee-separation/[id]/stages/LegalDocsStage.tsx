'use client';

import React from 'react';

import { EnvelopeIcon } from '@heroicons/react/24/outline';

import StageTaskChecklist from '../../components/StageTaskChecklist';

type Props = {
  separation: any;
  onTasksChange?: (hasAny: boolean, allComplete: boolean) => void;
  onOpenLegalDocsEmail?: (modal: { id: number }) => void;
};

const LegalDocsStage = ({ separation, onTasksChange, onOpenLegalDocsEmail }: Props) => {
  return (
    <div className='space-y-5'>
      <StageTaskChecklist separationId={separation.id} stage="legal-docs" title="Legal Docs Tasks" onTasksChange={onTasksChange} />

      {onOpenLegalDocsEmail && (
        <div className='flex justify-end'>
          <button
            onClick={() => onOpenLegalDocsEmail({ id: separation.id })}
            className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors'
          >
            <EnvelopeIcon className='h-4 w-4' />
            Send Files to Employee
          </button>
        </div>
      )}
    </div>
  );
};

export default LegalDocsStage;
