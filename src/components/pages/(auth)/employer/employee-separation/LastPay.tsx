import React, { Dispatch, useState } from 'react';

import { Tooltip } from 'react-tooltip';

import { T_LastPayModal } from '@/types/globals';
import classNames from '@/helpers/classNames';
import AttachmentViewModal from './modals/AttachmentViewModal';
import AttachmentListModal from './modals/AttachmentListModal';

import ClipIcon from '@/svg/ClipIcon';

interface LastPayAttachment {
  id?: number;
  attachment: string;
  attachment_name: string;
  created_at?: string;
}

const LastPay = ({
  id,
  isLastPayReleased,
  setIsLastPayModalOpen,
  quitclaimReceivedDate,
  lastPayAttachment,
  lastPayAttachments = [],
  isDocumentsReceived,
}: {
  id: number;
  isLastPayReleased: boolean;
  quitclaimReceivedDate?: string;
  lastPayAttachment?: string | null;
  lastPayAttachments?: LastPayAttachment[];
  setIsLastPayModalOpen: Dispatch<T_LastPayModal>;
  isDocumentsReceived: boolean;
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAttachmentListModalOpen, setIsAttachmentListModalOpen] = useState(false);

  // Determine which attachments to display (prefer new format, fallback to old)
  const attachmentsToDisplay: LastPayAttachment[] =
    lastPayAttachments && lastPayAttachments.length > 0
      ? lastPayAttachments
      : lastPayAttachment
        ? [{ attachment: lastPayAttachment, attachment_name: 'Last Pay Document' }]
        : [];

  const hasAttachment = attachmentsToDisplay.length > 0;

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
        data-tooltip-content={!isDocumentsReceived ? 'Documents must be received first' : ''}
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
            <div className='flex items-center gap-1'>
              <div
                className='cursor-pointer'
                data-tooltip-id='last-pay-attachment-tooltip'
                data-tooltip-content={
                  attachmentsToDisplay.length === 1
                    ? attachmentsToDisplay[0].attachment_name
                    : `${attachmentsToDisplay.length} attachments - Click to view list`
                }
                data-tooltip-place='bottom'
                onClick={() => {
                  if (attachmentsToDisplay.length === 1) {
                    // Single attachment - open directly
                    window.open(attachmentsToDisplay[0].attachment, '_blank');
                  } else {
                    // Multiple attachments - open modal
                    setIsAttachmentListModalOpen(true);
                  }
                }}
              >
                <ClipIcon hasFile={true} />
              </div>
              {attachmentsToDisplay.length > 1 && (
                <span className='text-xs text-gray-500 ml-1'>
                  ({attachmentsToDisplay.length})
                </span>
              )}
            </div>
            <p className='ml-2 text-xs'>{quitclaimReceivedDate}</p>
          </div>
        </div>
      ): null}

      <Tooltip id='last-pay-attachment-tooltip' style={{ zIndex: 9999 }} />
      
      <Tooltip id='last-pay-tooltip' style={{ zIndex: 9999 }} />
      <Tooltip id='last-pay-attachment-tooltip' style={{ zIndex: 9999 }} />
      
      {isViewModalOpen && (
        <AttachmentViewModal
          isOpen={isViewModalOpen}
          setIsOpen={setIsViewModalOpen}
          attachmentUrl={lastPayAttachment}
          title="Last Pay Attachment"
        />
      )}

      {isAttachmentListModalOpen && (
        <AttachmentListModal
          isOpen={isAttachmentListModalOpen}
          setIsOpen={setIsAttachmentListModalOpen}
          attachments={attachmentsToDisplay}
          title="Last Pay Attachments"
        />
      )}
    </>
  );
};

export default LastPay;
