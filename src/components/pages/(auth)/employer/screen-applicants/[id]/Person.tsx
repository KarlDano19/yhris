import React, { useContext, useEffect, useRef, useState } from 'react';

import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';

import useSoftDeleteApplication from '../hooks/applicant/useSoftDeleteApplication';

import StateContext from '../contexts/StateContext';
import { initialActionState } from '../lib/initialActionState';

import { ContextTypes, PersonPropTypes as PropTypes } from '../types';

import classNames from '@/helpers/classNames';
import { formatDateToLocal } from '@/helpers/date';
import ChatMessagesModal from '@/components/common/chat/ChatMessagesModal';

import { ArrowRightStartOnRectangleIcon, CalendarIcon, ChatBubbleLeftRightIcon, EllipsisVerticalIcon, EnvelopeIcon, IdentificationIcon, TrashIcon } from '@heroicons/react/24/outline';

import CheckListIcon from '@/svg/CheckListIcon';

const menuList = [
  {
    id: 1,
    whichModal: 'APPLICANT_FORM',
    modalTitle: 'Applicant Information',
    name: 'View Information',
    icon: <IdentificationIcon className='w-4 h-4' />,
  },
  {
    id: 2,
    whichModal: 'CHECKLIST',
    modalTitle: 'Checklist',
    name: 'Checklist',
    icon: <CheckListIcon className='w-4 h-4' />,
  },
  {
    id: 3,
    whichModal: 'MESSAGE_APPLICANT',
    modalTitle: 'Message Applicant',
    name: 'Message Applicant',
    icon: <ChatBubbleLeftRightIcon className='w-4 h-4' />,
  },
  {
    id: 4,
    whichModal: 'SEND_EMAIL',
    modalTitle: 'Send an Email to Applicant',
    name: 'Send Email',
    icon: <EnvelopeIcon className='w-4 h-4' />,
  },
  {
    id: 5,
    whichModal: 'SCHEDULE_INTERVIEW',
    modalTitle: 'Schedule Interview',
    name: 'Schedule Interview',
    icon: <CalendarIcon className='w-4 h-4' />,
  },
  {
    id: 6,
    whichModal: 'MOVE_TO_JOB',
    modalTitle: 'Transfer Applicant to Another Job',
    name: 'Move to Another Job',
    icon: <ArrowRightStartOnRectangleIcon className='w-4 h-4' />,
  },
];

// Helper component to display applicant avatar with fallback
const ApplicantAvatar = ({ applicant, size = 32 }: { applicant: any; size?: number }) => {
  const [imageError, setImageError] = useState(false);

  const hasValidImage =
    applicant.image &&
    typeof applicant.image === 'string' &&
    applicant.image.trim() !== '' &&
    applicant.image !== 'null' &&
    !applicant.image.includes('no-photo.png') &&
    !imageError;

  if (!hasValidImage) {
    return (
      <PlaceholderAvatar
        width={size}
        height={size}
        firstName={applicant.name?.split(' ')[0] || ''}
        lastName={applicant.name?.split(' ')[1] || ''}
        className='flex-shrink-0'
      />
    );
  }

  return (
    <img
      src={applicant.image}
      alt={applicant.name || 'Applicant'}
      width={size}
      height={size}
      className='w-full h-full rounded-full object-cover flex-shrink-0'
      onError={() => setImageError(true)}
    />
  );
};

export default function Person({
  applicant,
  isOpenMenu,
  setOpenMenuId,
  stage,
  permissions = { can_view: true, can_move: true, can_update: true, is_visible: true },
  isStageDisabled = false,
}: PropTypes & {
  permissions?: {
    can_view: boolean;
    can_move: boolean;
    can_update: boolean;
    is_visible: boolean;
  };
  isStageDisabled?: boolean;
}) {
  const { state, actionState, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const menuRef = useRef<HTMLDivElement>(null);
  const { photo_url, name, id } = applicant;
  const params = useParams();

  // Chat modal state
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: softDelete, isLoading: isSoftDeleting } = useSoftDeleteApplication();
  const [deleteModal, setDeleteModal] = useState<DeleteModalData | null>(null);

  // Check if applicant is hired - check both 'hired' and 'passed' in final stage
  const isPassedFinalInterview = applicant.status === 'hired';

  // Determine if this applicant card should be interactive
  const canInteract = permissions.can_update && !isStageDisabled;
  const canViewDetails = permissions.can_view && !isStageDisabled;

  // Handle clicks outside the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }

    if (isOpenMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenMenu, setOpenMenuId]);

  const handleOpenMenu = () => {
    if (!canInteract) {
      return; // Don't open menu if user can't interact
    }
    // Close if already open, otherwise open this one and close others
    setOpenMenuId(isOpenMenu ? null : applicant.id);
  };

  const handleDelete = () => {
    setOpenMenuId(null);
    setDeleteModal({ open: true, applicationId: applicant.applicationId });
  };

  const handleConfirmDelete = () => {
    if (!deleteModal) return;
    softDelete(deleteModal.applicationId, {
      onSuccess: () => {
        setDeleteModal(null);
        queryClient.invalidateQueries(['appliedApplicantsCache']);
        queryClient.invalidateQueries(['deletedApplicants']);
      },
      onError: (err: any) => {
        setDeleteModal(null);
        alert(`Error: ${err.message || 'Failed to delete application'}`);
      },
    });
  };

  const isButtonDisabled = applicant.status === 'rejected' || applicant.status === 'withdrawn';
  const isPooling = applicant.status === 'pooling';

  // Helper function to check if a date is within the timer window (12 hours = 720 minutes)
  const isWithinTimerWindow = (dateString: string | undefined) => {
    if (!dateString) return false;
    const dateCreated = new Date(dateString);
    const now = new Date();
    const timeDifference = now.getTime() - dateCreated.getTime();
    const minutesDifference = timeDifference / (1000 * 60);
    return Math.abs(minutesDifference) <= 720; // 12 hours
  };

  // Check if applicant was recently created (within 12 hours) - only for NEW label
  const isRecentlyCreated = isWithinTimerWindow(applicant.created_at);

  // Check if applicant meets all must-have answers (screeningFit === 'good')
  const meetsMustHaveAnswers = applicant.screeningFit === 'good';
  // Check if applicant doesn't meet must-have answers (screeningFit === 'bad')
  const doesNotMeetMustHaveAnswers = applicant.screeningFit === 'bad';

  // Determine background color with priority:
  // 1. Hired applicants - Yellow background (highest priority)
  // 2. Applicants who meet must-have answers - Green background
  // 3. Applicants who don't meet must-have answers - Red background
  // 4. All others - White background (default)
  let backgroundColorClass = 'bg-white';
  if (isPassedFinalInterview) {
    backgroundColorClass = 'bg-yellow-100';
  } else if (meetsMustHaveAnswers) {
    backgroundColorClass = 'bg-green-100';
  } else if (doesNotMeetMustHaveAnswers) {
    backgroundColorClass = 'bg-red-100';
  }

  // If applicant is pooled, always show green background regardless of screening fit
  if (isPooling) {
    backgroundColorClass = 'bg-green-100';
  }

  return (
    <div
      className={classNames(
        'border-b border-b-[#ACB9CB] last:border-none flex items-center py-6 gap-2 relative rounded-lg mb-2',
        backgroundColorClass,
        !isPassedFinalInterview
          ? (meetsMustHaveAnswers
              ? 'hover:bg-green-200'
              : doesNotMeetMustHaveAnswers
                ? 'hover:bg-red-200'
                : 'hover:bg-gray-100')
          : '',
        !canViewDetails || isStageDisabled
          ? 'opacity-60 cursor-not-allowed'
          : ''
      )}
    >
      {/* NEW label - positioned absolutely in upper right corner */}
      {isRecentlyCreated && (
        <span className='absolute top-2 right-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap z-0'>
          NEW
        </span>
      )}

      {/* HIRED label - positioned absolutely in upper right corner */}
      {isPassedFinalInterview && (
        <span className={`absolute top-2 right-3 bg-yellow-200 text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap z-0 ${isButtonDisabled ? 'text-gray-400' : 'text-indigo-dye'}`}>
          HIRED
        </span>
      )}

      <div className='w-8 h-8 overflow-hidden rounded-full ml-2'>
        <ApplicantAvatar applicant={applicant} size={32} />
      </div>
      <div className='flex-1 pt-2'>
        <div className='flex items-center gap-2'>
          <p className={`${isButtonDisabled ? 'text-gray-400' : 'text-indigo-dye'} font-semibold text-sm flex-1`}>
            {name}
            {!canViewDetails && (
              <span className="text-gray-400 text-xs ml-2">🔒</span>
            )}
            {/* {isRejected && (
              <span>
                <br />
                {capitalizeFirstLetter(applicant.status)}
              </span>
            )}
            {isWithdrawn && (
              <span>
                <br />
                {capitalizeFirstLetter(applicant.status)}
              </span>
            )} */}
          </p>
        </div>
        {canViewDetails && (
          <div className='flex flex-col mt-1'>
            <span className='text-xs text-gray-400'>
              {applicant.created_at
                ? formatDateToLocal(applicant.created_at)
                : 'Date not available'
              }
            </span>
          </div>
        )}
        {!canViewDetails && (
          <div className='flex items-center mt-1'>
            <span className='text-xs text-gray-400'>Access restricted</span>
          </div>
        )}
      </div>

      {/* Archive Button - show for rejected, withdrawn, or pooling applicants and if user has permissions */}
      {(isRejected || isWithdrawn || isPooling) && canInteract && (
        <div className='mr-2'>
          <ArchiveButton
            appliedJobId={applicant.applicationId}
            isArchived={isArchived}
            status={applicant.status || 'rejected'}
            onSuccess={() => {
              // Refresh will be handled by parent
            }}
            applicantName={name || 'Applicant'}
            jobPostingId={params.id as string}
          />
        </div>
      )}

      {/* Menu button - only show if user can interact */}
      <button
        onClick={handleOpenMenu}
        type='button'
        className={`${canInteract ? 'text-indigo-dye hover:text-indigo-800' : 'text-gray-300 cursor-not-allowed'}`}
        disabled={!canInteract}
        data-testid="elipsis-btn"
        title={!canInteract ? 'No permission to manage this applicant' : 'Applicant actions'}
      >
        <EllipsisVerticalIcon className='w-7 h-7' />
      </button>

      {/* Menu dropdown - only show if user can interact */}
      {isOpenMenu && canInteract && (
        <div ref={menuRef}>
          <ul className='absolute right-0 top-16 p-2 bg-white z-10 grid gap-2 rounded-2xl text-indigo-dye shadow-md min-w-48'>
            {menuList.map((list) => {
              const { id, icon, name, whichModal, modalTitle } = list;

              // Check if user has permission for specific actions
              const canPerformAction = () => {
                if (whichModal === 'APPLICANT_FORM') return permissions.can_view;
                if (whichModal === 'CHECKLIST') return permissions.can_update;
                if (whichModal === 'SEND_EMAIL') return permissions.can_update;
                if (whichModal === 'SCHEDULE_INTERVIEW') return permissions.can_update;
                if (whichModal === 'MESSAGE_APPLICANT') return permissions.can_update && applicant.has_account === true;
                if (whichModal === 'MOVE_TO_JOB') return permissions.can_update;
                return true;
              };

              if (!canPerformAction()) {
                return null; // Don't show action if user doesn't have permission
              }

              // Handle menu click for MESSAGE_APPLICANT
              const handleMenuClick = () => {
                if (whichModal === 'MESSAGE_APPLICANT') {
                  setIsChatModalOpen(true);
                  setOpenMenuId(null); // Close the menu
                  return;
                }
              };

              return (
                <React.Fragment key={id}>
                  {isPassedFinalInterview && name !== 'Checklist' && whichModal !== 'MOVE_TO_JOB' && (
                    <li>
                      <button
                        onClick={() => {
                          if (whichModal === 'MESSAGE_APPLICANT') {
                            handleMenuClick();
                            return;
                          }
                          setActionState({
                            ...initialActionState,
                            email: applicant.email,
                            applicantId: whichModal === 'MOVE_TO_JOB' ? applicant.applicationId : applicant.id,
                            stageId: stage.id,
                            modal: { whichModal, isOpen: true, title: modalTitle },
                          });
                        }}
                        className='flex items-center gap-3 w-full hover:bg-gray-100 p-1 rounded'
                      >
                        <span>{icon}</span>
                        <p>{name}</p>
                      </button>
                    </li>
                  )}
                  {!isPassedFinalInterview && (
                    <li>
                      <button
                        onClick={() => {
                          if (whichModal === 'MESSAGE_APPLICANT') {
                            handleMenuClick();
                            return;
                          }
                          let lastElement = state[state.length - 1];
                          let isFinalStage = false;
                          if (lastElement.id == stage.id) {
                            isFinalStage = true;
                          }
                          setActionState({
                            ...initialActionState,
                            email: applicant.email,
                            applicantId: whichModal === 'MOVE_TO_JOB' ? applicant.applicationId : applicant.id,
                            stageId: stage.id,
                            modal: { whichModal, isOpen: true, title: modalTitle },
                            isFinalStage: isFinalStage,
                          });
                        }}
                        className='flex items-center gap-3 w-full hover:bg-gray-100 p-1 rounded'
                      >
                        <span>{icon}</span>
                        <p>{name}</p>
                      </button>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
            {permissions.can_update && (
              <>
                <li className='border-t border-gray-100 mt-1 pt-1'>
                  <button
                    onClick={handleDelete}
                    disabled={isSoftDeleting}
                    className='flex items-center gap-3 w-full hover:bg-red-50 text-red-600 p-1 rounded disabled:opacity-50'
                  >
                    <span><TrashIcon className='w-4 h-4' /></span>
                    <p>Delete</p>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Restricted access overlay for completely disabled applicants */}
      {!canViewDetails && !canInteract && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-30 rounded-lg flex items-center justify-center">
          <div className="text-gray-500 text-xs font-medium">
            🔒 Restricted
          </div>
        </div>
      )}

      {/* Chat Modal */}
      <ChatMessagesModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        chatType="employer-applicant"
        appliedJobId={applicant.applicationId}
        jobPostingId={Number(params.id)}
        personName={applicant.name || 'Applicant'}
        personInitials={
          applicant.name
            ? applicant.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()
            : 'NA'
        }
        personPhoto={applicant.image || null}
      />

      {deleteModal && (
        <DeleteModal
          isOpen={deleteModal}
          setIsOpen={setDeleteModal}
          onConfirm={handleConfirmDelete}
          isLoading={isSoftDeleting}
          customText={`the application for ${name}`}
        />
      )}
    </div>
  );
}
