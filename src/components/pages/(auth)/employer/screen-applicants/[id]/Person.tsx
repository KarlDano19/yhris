import { CalendarIcon, EllipsisVerticalIcon, EnvelopeIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { ContextTypes, PersonPropTypes as PropTypes } from '../types';
import CheckListIcon from '@/svg/CheckListIcon';
import { initialActionState } from '../lib/initialActionState';
import { useContext } from 'react';
import StateContext from '../contexts/StateContext';
import classNames from '@/helpers/classNames';

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

export default function Person({ applicant, isOpenMenu, setOpenMenuId, stage }: PropTypes) {
  const { state, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { image, name, id } = applicant;

  const handleOpenMenu = () => {
    if (isOpenMenu) {
      setOpenMenuId(null);
      return;
    }
    setOpenMenuId(id);
  };

  const isButtonDisabled = applicant.status === 'rejected' || applicant.status === 'withdrawn';
  const isPassedFinalInterview = applicant.status === 'hired';

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
        <img src={image} alt={name} width='50' height='50' className='w-full h-full object-cover' />
      </div>
      <p className={`${isButtonDisabled ? 'text-gray-400' : 'text-indigo-dye'} font-semibold text-sm`}>
        {name}
        {isPassedFinalInterview && (
          <span>
            <br />
            {capitalizeFirstLetter(applicant.status)}
          </span>
        )}
      </p>
      <button onClick={handleOpenMenu} type='button' className='ml-auto text-indigo-dye disabled:text-gray-400'>
        <EllipsisVerticalIcon className='w-7 h-7' />
      </button>

      {isOpenMenu && (
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
                        let lastElement = state[state.length - 1]
                        let isFinalStage = false;
                        if (lastElement.id == stage.id) {
                          isFinalStage = true;
                        }
                        setActionState({
                          ...initialActionState,
                          applicantId: applicant.id,
                          stageId: stage.id,
                          modal: { whichModal, isOpen: true, title: modalTitle },
                          isFinalStage: isFinalStage
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
      )}
    </div>
  );
}
