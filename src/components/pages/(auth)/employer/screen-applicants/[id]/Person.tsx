import { CalendarIcon, EllipsisVerticalIcon, EnvelopeIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import ArchiveButton from '../ArchiveButton';
import Image from 'next/image';
import { ContextTypes, PersonPropTypes as PropTypes } from '../types';
import CheckListIcon from '@/svg/CheckListIcon';
import { initialActionState } from '../lib/initialActionState';
import React, { useContext, useEffect, useRef, useState } from 'react';
import StateContext from '../contexts/StateContext';
import classNames from '@/helpers/classNames';
import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';
import { useParams } from 'next/navigation';

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
    whichModal: 'SEND_EMAIL',
    modalTitle: 'Send an Email to Applicant',

    name: 'Send Email',
    icon: <EnvelopeIcon className='w-4 h-4' />,
  },
  {
    id: 4,
    whichModal: 'SCHEDULE_INTERVIEW',
    modalTitle: 'Schedule Interview',
    name: 'Schedule Interview',
    icon: <CalendarIcon className='w-4 h-4' />,
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
  isStageDisabled = false 
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

  const isPassedFinalInterview = applicant.status === 'hired';
  
  // Find the stage note for the current stage the applicant is in
  const currentStageNote = applicant.stage_notes?.find(note => note.job_stage === stage.id);
  
  // Check if this is the first stage (order_by === 0)
  const isFirstStage = stage.orderBy === 0;
  
  // Check if applicant has any stage notes (indicating they've been through the process before)
  const hasAnyStageNotes = applicant.stage_notes && applicant.stage_notes.length > 0;
  
  // Determine if this is a restored applicant:
  // - They have stage notes from previous stages (been through the process)
  // - They're not in the first stage
  // - They don't have a stage note for the current stage yet
  const isRestoredApplicant = hasAnyStageNotes && !isFirstStage && !currentStageNote;
  
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

  const isButtonDisabled = applicant.status === 'rejected' || applicant.status === 'withdrawn';
  const isRejected = applicant.status === 'rejected';
  const isWithdrawn = applicant.status === 'withdrawn';

  const capitalizeFirstLetter = (text: any) => {
    return text.replace(/(?:^|\s)\S/, function (match: any) {
      return match.toUpperCase();
    });
  };

  return (
    <div
      className={classNames(
        'border-b border-b-[#ACB9CB] last:border-none flex items-center py-6 gap-2 relative rounded-lg',
        isButtonDisabled && !isPassedFinalInterview
          ? 'border-b border-b-blue-100 bg-blue-100 last:border-none flex items-center gap-2 relative rounded-xl mb-2'
          : '',
        isPassedFinalInterview
          ? 'border-b border-b-yellow-100 bg-yellow-100 last:border-none flex items-center gap-2 relative rounded-xl mb-2'
          : '',
        !canViewDetails || isStageDisabled
          ? 'opacity-60 cursor-not-allowed'
          : 'cursor-pointer hover:bg-gray-50'
      )}
    >
      <div className='w-8 h-8 overflow-hidden rounded-full ml-2'>
        <ApplicantAvatar applicant={applicant} size={32} />
      </div>
      <div className='flex-1'>
        <p className={`${isButtonDisabled ? 'text-gray-400' : 'text-indigo-dye'} font-semibold text-sm`}>
          {name}
          {!canViewDetails && (
            <span className="text-gray-400 text-xs ml-2">🔒</span>
          )}
          {isPassedFinalInterview && (
            <span>
              <br />
              {capitalizeFirstLetter(applicant.status)}
            </span>
          )}
          {isRejected && (
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
          )}
        </p>
        {canViewDetails && currentStageNote && (
          <div className='flex flex-col mt-1'>
            <div className='flex items-center'>
              <div className='w-2 h-2 bg-blue-500 rounded-full mr-1'></div>
              <span className='text-xs text-gray-500'>Restored from Archive</span>
            </div>
            <span className='text-xs text-gray-400 ml-3 mt-0.5'>
              {currentStageNote.created_at 
                ? new Date(currentStageNote.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })
                : 'Date not available'
              }
            </span>
          </div>
        )}
        {canViewDetails && !currentStageNote && isFirstStage && (
          <div className='flex flex-col mt-1'>
            <div className='flex items-center'>
              <div className='w-2 h-2 bg-green-500 rounded-full mr-1'></div>
              <span className='text-xs text-gray-500'>New Applicant</span>
            </div>
            <span className='text-xs text-gray-400 ml-3 mt-0.5'>
              {applicant.created_at 
                ? new Date(applicant.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })
                : 'Date not available'
              }
            </span>
          </div>
        )}
        {canViewDetails && !currentStageNote && !isFirstStage && isRestoredApplicant && (
          <div className='flex flex-col mt-1'>
            <div className='flex items-center'>
              <div className='w-2 h-2 bg-purple-500 rounded-full mr-1'></div>
              <span className='text-xs text-gray-500'>Moved to {stage.title}</span>
            </div>
            <span className='text-xs text-gray-400 ml-3 mt-0.5'>
              {applicant.updated_at 
                ? new Date(applicant.updated_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })
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
      
      {/* Archive Button - only show for rejected or withdrawn applicants and if user has permissions */}
      {(isRejected || isWithdrawn) && canInteract && (
        <div className='mr-2'>
          <ArchiveButton
            appliedJobId={applicant.applicationId}
            isArchived={false}
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
                return true;
              };

              if (!canPerformAction()) {
                return null; // Don't show action if user doesn't have permission
              }

              return (
                <React.Fragment key={id}>
                  {isPassedFinalInterview && name !== 'Checklist' && (
                    <li>
                      <button
                        onClick={() =>
                          setActionState({
                            ...initialActionState,
                            email: applicant.email,
                            applicantId: applicant.id,
                            stageId: stage.id,
                            modal: { whichModal, isOpen: true, title: modalTitle },
                          })
                        }
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
                          let lastElement = state[state.length - 1];
                          let isFinalStage = false;
                          if (lastElement.id == stage.id) {
                            isFinalStage = true;
                          }
                          setActionState({
                            ...initialActionState,
                            email: applicant.email,
                            applicantId: applicant.id,
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
    </div>
  );
}
