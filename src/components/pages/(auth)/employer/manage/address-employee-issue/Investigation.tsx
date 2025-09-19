import React, { Dispatch } from 'react';

import { Tooltip } from 'react-tooltip';
import classNames from '@/helpers/classNames';

import { T_InvestigationModal, T_InvestigationReportDetailsModal } from '@/types/globals';

import ClipIcon from '@/svg/ClipIcon';

const Investigation = ({
  id,
  isInvestigated,
  investigatedDate,
  setIsInvestigateModalOpen,
  setInvestigationReportDetailsModalOpen,
  isResponded,
}: {
  id: number;
  isInvestigated: boolean;
  investigatedDate: string;
  setIsInvestigateModalOpen: Dispatch<T_InvestigationModal>;
  setInvestigationReportDetailsModalOpen: Dispatch<T_InvestigationReportDetailsModal>;
  isResponded?: boolean;
}) => {
  // Disable investigate button if employee has not responded (is_responded: false)
  const shouldDisableInvestigate = isResponded === false;
  
  return (
    <div className='flex flex-col gap-2'>
      <div>
        <button
          className={classNames(
            isInvestigated
              ? 'bg-red-500 border-[1px] border-red-500 text-white cursor-pointer'
              : 'border-[1px] border-red-500 text-red-500',
            'items-center rounded-md px-2 py-1 focus:z-10 disabled:opacity-75'
          )}
          disabled={isInvestigated || shouldDisableInvestigate}
          onClick={(e) => {
            e.stopPropagation();
            if (!isInvestigated && !shouldDisableInvestigate) {
              setIsInvestigateModalOpen({
                isOpen: true,
                id,
              });
            }
          }}
          title={shouldDisableInvestigate ? 'Employee has not responded yet' : ''}
        >
          {isInvestigated ? 'Investigated' : 'Investigate'}
        </button>
      </div>
      {isInvestigated && (
        <div className='flex gap-1 items-center justify-center'>
          <div
            className='cursor-pointer'
            data-tooltip-id='investigation-clip-tooltip'
            data-tooltip-content='Click to view investigation report'
            data-tooltip-place='bottom'
            onClick={() =>
              setInvestigationReportDetailsModalOpen({
                isOpen: true,
                id,
              })
            }
          >
            <ClipIcon hasFile={true} />
          </div>
          <p className='text-xs ml-1'>{investigatedDate}</p>
        </div>
      )}
      
      <Tooltip id='investigation-clip-tooltip' />
    </div>
  );
};

export default Investigation;
