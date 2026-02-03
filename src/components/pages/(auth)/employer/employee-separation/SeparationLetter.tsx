import { Dispatch, Fragment, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Tooltip } from 'react-tooltip';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import classNames from '@/helpers/classNames';
import AttachmentViewModal from './modals/AttachmentViewModal';
import CreateSeparationLetterModal from './modals/CreateSeparationLetterModal';
import AttachmentListModal from './modals/AttachmentListModal';

import ClipIcon from '@/svg/ClipIcon';

import { T_LetterModal } from '@/types/globals';

const items = [
  { name: 'Letter of Acceptance', type: 'Acceptance' },
  { name: 'Letter of Separation', type: 'Separation' },
];

interface LetterAttachment {
  id?: number;
  attachment: string;
  attachment_name: string;
  created_at?: string;
}

export default function SeparationLetter({
  id,
  isLetterSent,
  isLetterReceived,
  letterReceivedDate,
  letterAttachment,
  letterAttachments = [],
  setIsLetterModalOpen,
  setReceived,
  isLoading,
  refetch,
  employerName,
  effectiveDate,
  menuKey,
}: {
  id: number;
  isLetterSent: boolean;
  isLetterReceived: boolean;
  letterReceivedDate?: string;
  letterAttachment?: string | null;
  letterAttachments?: LetterAttachment[];
  setIsLetterModalOpen: Dispatch<T_LetterModal>;
  setReceived: any;
  isLoading: boolean;
  refetch: () => void;
  employerName?: string;
  effectiveDate?: string;
  menuKey?: number;
}) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateLetterModalOpen, setIsCreateLetterModalOpen] = useState(false);
  const [isAttachmentListModalOpen, setIsAttachmentListModalOpen] = useState(false);
  const [selectedLetterType, setSelectedLetterType] = useState<'Acceptance' | 'Separation'>('Acceptance');
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Determine which attachments to display (prefer new format, fallback to old)
  const attachmentsToDisplay: LetterAttachment[] =
    letterAttachments && letterAttachments.length > 0
      ? letterAttachments
      : letterAttachment
        ? [{ attachment: letterAttachment, attachment_name: 'Letter Document' }]
        : [];

  const hasAttachment = attachmentsToDisplay.length > 0;

  // Calculate dropdown position synchronously based on button position
  const getDropdownPosition = () => {
    const button = menuButtonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      return {
        top: rect.bottom + 4,
        left: rect.left, // Align to left edge of button
      };
    }
    return { top: -9999, left: -9999 }; // Off-screen if button not found
  };

  const handleSendClick = async () => {
    // Check if there's an attachment (PDF already generated)
    if (hasAttachment) {
      // Open the existing separation email modal with the PDF
      setIsLetterModalOpen({
        type: selectedLetterType,
        id,
      });
    } else {
      // If no attachment, open create letter modal to generate PDF first
      setIsCreateLetterModalOpen(true);
    }
  };
 
  // Determine send button disabled state and title
  const sendDisabled = isLoading || isLetterReceived;
  const sendTitle = isLetterReceived
    ? 'Letter already received'
    : (letterAttachment
        ? (isLetterSent ? 'Resend Letter' : 'Send Letter')
        : 'Click to Generate & Send Letter');

  return (
    <>
    <div className='flex flex-col'>
      <div className='inline-flex'>
        <Menu as='div' key={menuKey} className='relative inline-block text-left'>
          {({ open }) => {
            const position = open ? getDropdownPosition() : { top: -9999, left: -9999 };
            return (
              <>
                <SmartButton
                  id="create-separation-btn"
                  className='w-full relative inline-flex items-center shadow-sm rounded-md bg-green-500 pl-14 pr-4 py-2 text-white enabled:hover:bg-green-600 focus:z-10 disabled:opacity-80'
                  disabled={isLetterSent}
                >
                  <Menu.Button
                    ref={menuButtonRef}
                    className='w-full h-full'
                  >
                    <span className='sr-only'>Open options</span>
                    <div className='flex gap-4'>
                      <span className='flex-1'>Create</span>
                      <ChevronDownIcon
                        className='flex-none h-5 w-5'
                        aria-hidden='true'
                      />
                    </div>
                  </Menu.Button>
                </SmartButton>
                {typeof document !== 'undefined' && createPortal(
                  <Transition
                    as={Fragment}
                    show={open}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items
                      static
                      className='fixed z-[9999] w-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                      style={{
                        top: position.top,
                        left: position.left,
                      }}
                    >
                      <div className='py-1'>
                        {items.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <span
                                className={classNames(
                                  active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                  'block px-4 py-2 text-sm cursor-pointer whitespace-nowrap'
                                )}
                                onClick={() => {
                                  setSelectedLetterType(item.type as 'Acceptance' | 'Separation');
                                  setIsCreateLetterModalOpen(true);
                                }}
                              >
                                {item.name}
                              </span>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>,
                  document.body
                )}
              </>
            );
          }}
        </Menu>
      </div>
      <div className='flex gap-2 mt-2'>
        <div>
          <button
            className={classNames(
              hasAttachment
                ? 'bg-red-500 border-[1px] border-red-500 text-white'
                : 'bg-transparent border-[1.5px] border-red-400 text-red-400',
              'items-center rounded-md px-2 py-1 focus:z-10 w-24 disabled:opacity-50'
            )}
            disabled={sendDisabled}
            onClick={handleSendClick}
            title={sendTitle}
          >
            {isLetterSent ? 'Resend' : 'Send'}
          </button>
        </div>
        <div className='flex flex-col'>
          <div>
            <button
              className={classNames(
                isLetterReceived
                  ? 'bg-savoy-blue text-white'
                  : 'bg-blue-100 text-blue-400',
                'items-center rounded-md px-2 py-1 focus:z-10 w-24 disabled:opacity-75'
              )}
              disabled={!isLetterSent || isLetterReceived || isLoading}
              onClick={() => setReceived(id, 'letters')}
              data-tooltip-id='letter-received-tooltip'
              data-tooltip-content={!isLetterSent ? 'Letter must be sent first' : isLetterReceived ? 'Letter already received' : 'Mark letter as received'}
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
              {!isLoading && (isLetterReceived ? 'Received' : 'Receive')}
            </button>
          </div>
          {isLetterReceived ? (
            <div className='flex gap-1 items-center mt-2 justify-center'>
              <div className='flex items-center gap-1'>
                <div
                  className='cursor-pointer'
                  data-tooltip-id='letter-attachment-tooltip'
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
              <p className='ml-2 text-xs'>{letterReceivedDate}</p>
            </div>
          ) : null}
        </div>
      </div>
      <Tooltip id='letter-received-tooltip' />
      <Tooltip id='letter-attachment-tooltip' />
    </div>
    
    {/* Create Separation Letter Modal */}
    {isCreateLetterModalOpen && (
      <CreateSeparationLetterModal
        isOpen={isCreateLetterModalOpen}
        setIsOpen={setIsCreateLetterModalOpen}
        separationId={id}
        letterType={selectedLetterType}
        refetch={refetch}
        employerName={employerName}
        effectiveDate={effectiveDate}
        onSuccess={(data) => {
          // Automatically open send modal after PDF generation
          setIsLetterModalOpen({
            type: selectedLetterType,
            id,
          });
        }}
      />
    )}
    
    {/* View Attachment Modal */}
    {isViewModalOpen && (
      <AttachmentViewModal
        isOpen={isViewModalOpen}
        setIsOpen={setIsViewModalOpen}
        attachmentUrl={letterAttachment}
        title="Letter Attachment"
      />
    )}

    {/* Attachment List Modal */}
    {isAttachmentListModalOpen && (
      <AttachmentListModal
        isOpen={isAttachmentListModalOpen}
        setIsOpen={setIsAttachmentListModalOpen}
        attachments={attachmentsToDisplay}
        title="Letter Attachments"
      />
    )}
    </>
  );
}
