import React, { Dispatch, useState } from 'react';

import { Tooltip } from 'react-tooltip';

import classNames from '@/helpers/classNames';
import { T_LastPayModal } from '@/types/globals';

import ClipIcon from '@/svg/ClipIcon';
import AttachmentViewModal from './modals/AttachmentViewModal';

const LastPay = ({
  id,
  isLastPayReleased,
  setIsLastPayModalOpen,
  quitclaimReceivedDate,
  lastPayAttachment,
  isDocumentsReceived,
}: {
  id: number;
  isLastPayReleased: boolean;
  quitclaimReceivedDate?: string;
  lastPayAttachment?: string | null;
  setIsLastPayModalOpen: Dispatch<T_LastPayModal>;
  isDocumentsReceived: boolean;
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Disabled if documents haven't been received yet
  const isDisabled = !isDocumentsReceived || isLastPayReleased;
  
  return (
    <>
      <button
        className={classNames(
          isLastPayReleased
            ? 'bg-red-500 border-[1px] border-red-500 text-white'
            : 'border-[1px] border-red-500 text-red-500',
          'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10 disabled:opacity-75'
        )}
        disabled={isDisabled}
        data-tooltip-id='last-pay-tooltip'
        data-tooltip-content={!isDocumentsReceived ? 'Documents must be sent first' : ''}
        data-tooltip-place='bottom'
        onClick={() =>
          !isDisabled &&
          setIsLastPayModalOpen({
            isOpen: true,
            id,
          })
        }
      >
        {isLastPayReleased ? 'Released' : 'Release'}{' '}
      </button>
      {isLastPayReleased ? (
        <div>
          <div className='flex gap-1 items-center justify-center mt-2'>
            <div
              className={lastPayAttachment ? 'cursor-pointer' : ''}
              data-tooltip-id='last-pay-attachment-tooltip'
              data-tooltip-content={lastPayAttachment ? 'Click to view attachment' : 'No attachment'}
              data-tooltip-place='bottom'
              onClick={() => {
                if (lastPayAttachment) {
                  setIsViewModalOpen(true);
                }
              }}
            >
              <ClipIcon hasFile={!!lastPayAttachment} />
            </div>
            <p className='ml-2 text-xs'>{quitclaimReceivedDate}</p>
          </div>
        </div>
      ): null}
      
      <Tooltip id='last-pay-tooltip' />
      <Tooltip id='last-pay-attachment-tooltip' />
      
      {isViewModalOpen && (
        <AttachmentViewModal
          isOpen={isViewModalOpen}
          setIsOpen={setIsViewModalOpen}
          attachmentUrl={lastPayAttachment}
          title="Last Pay Attachment"
        />
      )}
    </>
  );
};

export default LastPay;
