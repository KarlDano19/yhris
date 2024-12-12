import React, { Dispatch } from 'react';

import { T_InvestigationModal, T_InvestigationReportDetailsModal } from '@/types/globals';
import classNames from '@/helpers/classNames';

import ClipIcon from '@/svg/ClipIcon';

const Investigation = ({
  id,
  isInvestigated,
  investigatedDate,
  setIsInvestigateModalOpen,
  setInvestigationReportDetailsModalOpen,
}: {
  id: number;
  isInvestigated: boolean;
  investigatedDate: string;
  setIsInvestigateModalOpen: Dispatch<T_InvestigationModal>;
  setInvestigationReportDetailsModalOpen: Dispatch<T_InvestigationReportDetailsModal>;
}) => {
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
          disabled={isInvestigated}
          onClick={(e) => {
            e.stopPropagation();
            if (!isInvestigated) {
              setIsInvestigateModalOpen({
                isOpen: true,
                id,
              });
            }
          }}
        >
          {isInvestigated ? 'Investigated' : 'Investigate'}
        </button>
      </div>
      {isInvestigated ? (
        <div>
          <div className='flex gap-1 items-center justify-center'>
            <div
              className='cursor-pointer'
              onClick={() =>
                setInvestigationReportDetailsModalOpen({
                  isOpen: true,
                  id,
                })
              }
            >
              <ClipIcon />
            </div>
            <p className='text-xs ml-1'>{investigatedDate}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Investigation;
