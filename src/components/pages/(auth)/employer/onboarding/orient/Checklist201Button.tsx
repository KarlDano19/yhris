import { Dispatch } from 'react';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export default function Checklist201Button({
  completed,
  total,
  setIsChecklistModalOpen,
}: {
  completed: number;
  total: number;
  setIsChecklistModalOpen: Dispatch<boolean>;
}) {
  return (
    <div className='flex flex-col items-center gap-1.5'>
      <SmartButton
        id='allow-onboarding-btn'
        className='relative inline-flex items-center gap-1.5 rounded-md px-4 py-2 border-[1px] border-savoy-blue text-savoy-blue focus:z-10 disabled:opacity-80'
        onClick={() => setIsChecklistModalOpen(true)}
      >
        <ClipboardDocumentCheckIcon className='w-4 h-4' />
        View Checklist
      </SmartButton>
      <span className='text-xs text-gray-500'>{completed}/{total} completed</span>
    </div>
  );
}
