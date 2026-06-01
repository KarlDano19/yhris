'use client';

import { BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';
import StageTaskChecklist from '../../components/StageTaskChecklist';

import { T_LastPayModal } from '@/types/globals';
import { formatDateToLocal } from '@/helpers/date';
import AttachmentCard from '../../components/AttachmentCard';

type Props = {
  separation: any;
  onOpenLastPayModal: (modal: T_LastPayModal) => void;
  onTasksChange?: (hasAny: boolean, allComplete: boolean) => void;
};

const FinalPayStage = ({ separation, onOpenLastPayModal, onTasksChange }: Props) => {
  const lastPayReleased = !!separation.is_last_pay_released;

  return (
    <div className='space-y-5'>
      {/* Final Pay Release */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm font-semibold text-gray-900'>Final Pay Release</h3>
          {lastPayReleased ? (
            <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'>
              <CheckCircleIcon className='h-3.5 w-3.5' />
              Released
            </span>
          ) : null}
        </div>

        <button
          onClick={() => onOpenLastPayModal({ isOpen: true, id: separation.id })}
          disabled={lastPayReleased}
          data-tooltip-id='finalpay-tooltip'
          data-tooltip-content={lastPayReleased ? 'Final pay already released' : undefined}
          data-tooltip-place='top'
          className='w-full flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-dye rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
        >
          <BanknotesIcon className='h-4 w-4' />
          {lastPayReleased ? 'Resend Final Pay' : 'Release Final Pay'}
        </button>

        {lastPayReleased && separation.updated_at && (
          <p className='text-sm text-gray-600 mt-3'>
            Released on <span className='font-medium'>{formatDateToLocal(separation.updated_at)}</span>
          </p>
        )}

        <AttachmentCard attachments={separation.last_pay_attachments || []} label="Final Pay Documents" />
        <Tooltip id='finalpay-tooltip' />
      </div>

      <StageTaskChecklist separationId={separation.id} stage="final-pay" title="Final Pay Tasks" onTasksChange={onTasksChange} />
    </div>
  );
};

export default FinalPayStage;
