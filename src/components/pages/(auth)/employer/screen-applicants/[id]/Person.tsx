import { CalendarIcon, EllipsisVerticalIcon, EnvelopeIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { ContextTypes, PersonPropTypes as PropTypes } from '../types';
import CheckListIcon from '@/svg/CheckListIcon';
import { initialActionState } from '../lib/initialActionState';
import React, { useContext, useEffect, useRef, useState } from 'react';
import StateContext from '../contexts/StateContext';
import classNames from '@/helpers/classNames';
import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';

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

  // Check if we have a valid image URL
  const hasValidImage = applicant.image && 
    typeof applicant.image === 'string' && 
    applicant.image.trim() !== '' && 
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

export default function Person({ applicant, isOpenMenu, setOpenMenuId, stage }: PropTypes) {
  const { state, actionState, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const menuRef = useRef<HTMLDivElement>(null);
  const { image, name, id } = applicant;

  const isPassedFinalInterview = applicant.status === 'hired';

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
        'border-b border-b-[#ACB9CB] last:border-none flex items-center py-6 gap-2 relative',
        isButtonDisabled && !isPassedFinalInterview
          ? 'border-b border-b-blue-100 bg-blue-100 last:border-none flex items-center gap-2 relative rounded-xl mb-2'
          : '',
        isPassedFinalInterview
          ? 'border-b border-b-yellow-100 bg-yellow-100 last:border-none flex items-center gap-2 relative rounded-xl mb-2'
          : ''
      )}
    >
      <div className='w-8 h-8 overflow-hidden rounded-full ml-2'>
        <ApplicantAvatar applicant={applicant} size={32} />
      </div>
      <div className='flex-1'>
        <p className={`${isButtonDisabled ? 'text-gray-400' : 'text-indigo-dye'} font-semibold text-sm`}>
          {name}
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
        {applicant.stage_notes && applicant.stage_notes.length > 0 && (
          <div className='flex items-center mt-1'>
            <div className='w-2 h-2 bg-blue-500 rounded-full mr-1'></div>
            <span className='text-xs text-gray-500'>Has stage notes</span>
          </div>
        )}
      </div>
      <button onClick={handleOpenMenu} type='button' className='ml-auto text-indigo-dye disabled:text-gray-400'>
        <EllipsisVerticalIcon className='w-7 h-7' />
      </button>

      {isOpenMenu && (
        <div ref={menuRef}>
          <ul className='absolute left-0 top-6 p-4 bg-white z-10 grid gap-2 rounded-2xl text-indigo-dye shadow-md'>
            {menuList.map((list) => {
              const { id, icon, name, whichModal, modalTitle } = list;
              return (
                <>
                  {isPassedFinalInterview && name !== 'Checklist' && (
                    <li key={id}>
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
                        className='flex items-center gap-3 w-full'
                      >
                        <span>{icon}</span>
                        <p>{name}</p>
                      </button>
                    </li>
                  )}
                  {!isPassedFinalInterview && (
                    <li key={id}>
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
                        className='flex items-center gap-3 w-full'
                      >
                        <span>{icon}</span>
                        <p>{name}</p>
                      </button>
                    </li>
                  )}
                </>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
