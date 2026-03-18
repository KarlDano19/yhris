import React, { Dispatch, useState } from 'react';

import { Tooltip } from 'react-tooltip';

import { T_DocumentsModal } from '@/types/globals';
import classNames from '@/helpers/classNames';
import AttachmentViewModal from './modals/AttachmentViewModal';
import AttachmentListModal from './modals/AttachmentListModal';
import ConfirmModal from '@/components/ConfirmModal';

import ClipIcon from '@/svg/ClipIcon';

interface DocumentAttachment {
  id?: number;
  attachment: string;
  attachment_name: string;
  created_at?: string;
}

const SignDocuments = ({
  id,
  isDocumentsSent,
  isDocumentsReceived,
  documentReceivedDate,
  documentsAttachment,  // Backward compatibility: single attachment
  documentAttachments = [],  // Multiple attachments
  setIsDocumentModalOpen,
  setReceived,
  isLoading,
  isLetterReceived,
  isQuitclaimSigned,
  isQuitclaimReceived,
}: {
  id: number;
  isDocumentsSent: boolean;
  isDocumentsReceived: boolean;
  documentReceivedDate?: string;
  documentsAttachment?: string | null;  // Backward compatibility
  documentAttachments?: DocumentAttachment[];  // Multiple attachments
  setIsDocumentModalOpen: Dispatch<T_DocumentsModal>;
  setReceived: any;
  isLoading: boolean;
  isLetterReceived: boolean;
  isQuitclaimSigned: boolean;
  isQuitclaimReceived: boolean;
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAttachmentListModalOpen, setIsAttachmentListModalOpen] = useState(false);
  const [selectedAttachmentUrl, setSelectedAttachmentUrl] = useState<string | null>(null);
  const [isConfirmReceiveOpen, setIsConfirmReceiveOpen] = useState(false);

  // Disabled if already sent or if quit claim is in progress
  const isDisabled = isDocumentsSent || isQuitclaimSigned || isQuitclaimReceived;
  
  // Get attachments to display - prefer documentAttachments array, fallback to single documentsAttachment
  const attachmentsToDisplay: DocumentAttachment[] = documentAttachments && documentAttachments.length > 0
    ? documentAttachments
    : documentsAttachment
      ? [{ attachment: documentsAttachment, attachment_name: 'Document' }]
      : [];
  
  const hasAttachments = attachmentsToDisplay.length > 0;
  
  return (
    <>
    <div className='flex flex-col gap-2'>
      <div>
        <button
          className={classNames(
            isDocumentsSent
              ? 'bg-red-500 border-[1px] border-red-500 text-white'
              : 'border-[1px] border-red-500 text-red-500',
            'items-center rounded-md px-2 py-1 focus:z-10 w-24 disabled:opacity-75'
          )}
          disabled={isDisabled}
          data-tooltip-id='sign-documents-tooltip'
          data-tooltip-content={isQuitclaimSigned || isQuitclaimReceived ? 'Cannot send documents after quit claim' : isDocumentsSent ? 'Documents already sent' : 'Send documents'}
          data-tooltip-place='bottom'
          onClick={() =>
            setIsDocumentModalOpen({
              isOpen: true,
              id,
            })
          }
        >
          {isDocumentsSent ? 'Sent' : 'Send'}
        </button>
      </div>
      <div>
        <button
          className={classNames(
            isDocumentsReceived
              ? 'bg-savoy-blue text-white'
              : 'bg-blue-100 text-blue-400',
            'items-center rounded-md px-2 py-1 focus:z-10 w-24 disabled:opacity-75'
          )}
          disabled={isDocumentsReceived || isLoading || isQuitclaimSigned || isQuitclaimReceived}
          onClick={() => setIsConfirmReceiveOpen(true)}
          data-tooltip-id='sign-documents-received-tooltip'
          data-tooltip-content={isQuitclaimSigned || isQuitclaimReceived ? 'Cannot receive documents after quit claim' : isDocumentsReceived ? 'Documents already received' : 'Mark documents as received'}
          data-tooltip-place='bottom'
        >
          {isLoading && (
              <div role='status'>
              <svg
                  aria-hidden='true'
                  className='inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
              >
                  <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                  />
                  <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                  />
              </svg>
              <span className='sr-only'>Loading...</span>
              </div>
          )}
          {!isLoading && (isDocumentsReceived ? 'Received' : 'Receive')}
        </button>
      </div>
      {isDocumentsReceived ? (
        <div className='flex flex-col gap-1'>
          <div className='flex gap-1 items-center justify-center'>
            {hasAttachments ? (
              <div className='flex items-center gap-1'>
                <div
                  className='cursor-pointer'
                  data-tooltip-id='documents-attachment-tooltip'
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
            ) : (
              <ClipIcon hasFile={false} />
            )}
            <p className='ml-2 text-xs'>{documentReceivedDate}</p>
          </div>
        </div>
      ) : null}

      <Tooltip id='documents-attachment-tooltip' style={{ zIndex: 9999 }} />
      
      <Tooltip id='sign-documents-tooltip' style={{ zIndex: 9999 }} />
      <Tooltip id='sign-documents-received-tooltip' style={{ zIndex: 9999 }} />
    </div>
    
    {isViewModalOpen && selectedAttachmentUrl && (
      <AttachmentViewModal
        isOpen={isViewModalOpen}
        setIsOpen={setIsViewModalOpen}
        attachmentUrl={selectedAttachmentUrl}
        title="Sign Documents Attachment"
      />
    )}

    {isAttachmentListModalOpen && (
      <AttachmentListModal
        isOpen={isAttachmentListModalOpen}
        setIsOpen={setIsAttachmentListModalOpen}
        attachments={attachmentsToDisplay}
        title="Sign Documents Attachments"
      />
    )}

    <ConfirmModal
      isOpen={isConfirmReceiveOpen}
      setIsOpen={setIsConfirmReceiveOpen}
      message={"Do you want to mark the documents as received?"}
      confirmAction={() => {
        setIsConfirmReceiveOpen(false);
        setReceived(id, 'sign documents');
      }}
      isLoading={false}
    />
    </>
  );
};

export default SignDocuments;

