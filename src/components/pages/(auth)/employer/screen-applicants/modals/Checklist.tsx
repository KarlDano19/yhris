import { ChangeEvent, ChangeEventHandler, FormEventHandler, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import ModalLayout from './ModalLayout';
import ModalFooterLayout from '../layouts/ModalFooterLayout';
import StateContext from '../contexts/StateContext';
import titleCase from '@/helpers/titleCase';
import ScreenApplicantGoPremiumModal from '../../modals/SubsriptionModals/ScreenApplicantGoPremiumModal';

import { initialActionState } from '../lib/initialActionState';
import { ApplicantType, ContextTypes, ChecklistPropTypes as PropTypes, StageType } from '../types';

type DataTypes = {
  checklists: string[];
  status: string;
  stage_notes: {
    notes: string;
  };
  id: any;
  feedback?: string;
};

const statuses = [
  {
    id: 'ongoing',
    value: 'ongoing',
    title: 'Ongoing',
  },
  {
    id: 'withdrawn',
    value: 'withdrawn',
    title: 'Withdrawn',
  },
  {
    id: 'rejected',
    value: 'rejected',
    title: 'Rejected',
  },
  {
    id: 'passed',
    value: 'passed',
    title: 'Passed',
  },
];

export default function Checklist({
  title,
  requirements,
  handleFormSubmit,
  hasActiveSubscription,
}: PropTypes & { hasActiveSubscription?: boolean }) {
  const { state, actionState, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { getValues, setValue, register, watch } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const [isGoPremiumModalOpen, setIsGoPremiumModalOpen] = useState(false);
  let applicant: ApplicantType | undefined;
  state.forEach((stage) => {
    if (stage.id === actionState.stageId) {
      applicant = stage.applicants.find((applicant) => applicant.id === actionState.applicantId);
    }
  });

  const [checks, setChecks] = useState<string[]>([]);
  const [currentStageNotes, setCurrentStageNotes] = useState<string>(''); // Notes for the current stage (editable)

  // Get all stages for tabs
  const allStages = state
    .map((stage: StageType) => ({
      id: stage.id,
      title: stage.title,
      orderBy: stage.orderBy,
    }))
    .sort((a, b) => a.orderBy - b.orderBy);

  const currentStatus = watch('status');

  // Set the initial status based on the applicant's screening fit
  useEffect(() => {
    if (applicant) {
      // Only set status if the applicant doesn't already have a status
      // This prevents overriding manual status changes
      if (!applicant.status) {
        // If the applicant is not fit, suggest "rejected" but don't force it
        if (applicant.screeningFit === 'bad') {
          setValue('status', 'rejected');
        }
      } else {
        // Use their current status
        setValue('status', applicant.status);
      }
    }
  }, [applicant, setValue]);

  useEffect(() => {
    // determining if all checklists are checked in the form
    if (requirements.length) {
      setIsDisabled(requirements.length !== checks.filter((check) => requirements.includes(check)).length);
    } else {
      setIsDisabled(true);
    }
  }, [checks.length, requirements.length]);

  useEffect(() => {
    setIsOpen(true);
    // Set active tab to current stage
    setActiveTab(actionState.stageId);

    // Load existing stage notes for the current stage only
    if (applicant?.stage_notes && applicant.stage_notes.length > 0) {
      const currentStageNote = applicant.stage_notes.find((note) => note.job_stage === actionState.stageId);
      if (currentStageNote) {
        setCurrentStageNotes(currentStageNote.notes);
      } else {
        setCurrentStageNotes('');
      }
    } else {
      setCurrentStageNotes('');
    }
  }, [applicant?.stage_notes, actionState.stageId]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setActionState(initialActionState), 400);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data: DataTypes = {} as DataTypes;
    data.checklists = checks;
    data.status = getValues('status') || applicant?.status;
    data.stage_notes = {
      notes: currentStageNotes, // Always save the current stage notes
    };
    data.id = applicant?.applicationId;

    // Check if applicant is being marked as "Hired" (passed status in final stage)
    const isBeingHired = data.status === 'passed' && actionState.isFinalStage;

    setIsOpen(false);

    if (isBeingHired && !hasActiveSubscription) {
      // Show the premium modal first only if user doesn't have active subscription
      setIsGoPremiumModalOpen(true);
    } else {
      // Proceed with normal form submission
      setTimeout(() => handleFormSubmit(data), 400);
    }
  };

  const handlePremiumModalClose = () => {
    setIsGoPremiumModalOpen(false);
    // After modal is closed, proceed with the form submission
    const data: DataTypes = {} as DataTypes;
    data.checklists = checks;
    data.status = getValues('status') || applicant?.status;
    data.id = applicant?.applicationId;
    setTimeout(() => handleFormSubmit(data), 400);
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setChecks((prev) => [...prev, e.target.id]);
    } else {
      const newChecks = checks.filter((item) => item !== e.target.id);
      setChecks(newChecks);
    }
  };

  const handleTabClick = (stageId: number) => {
    setActiveTab(stageId);
    // Don't change currentStageNotes when switching tabs - only for viewing
  };

  const getStageNote = (stageId: number) => {
    if (applicant?.stage_notes && applicant.stage_notes.length > 0) {
      return applicant.stage_notes.find((note) => note.job_stage === stageId);
    }
    return null;
  };

  return (
    <>
      <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
        <form onSubmit={onSubmit}>
          <div className='p-8'>
            {requirements?.length > 0 && (
              <div className='grid gap-4 mb-8'>
                {requirements.map((requirement, index) => {
                  return (
                    <div key={index} className='flex items-center gap-4 text-indigo-dye text-[15px]'>
                      <input
                        checked={checks.some((check) => check === requirement)}
                        onChange={handleCheckbox}
                        id={requirement}
                        type='checkbox'
                        className='w-5 h-5'
                      />
                      <label htmlFor={requirement}>{titleCase(requirement)}</label>
                    </div>
                  );
                })}
              </div>
            )}
            <div className='grid gap-4'>
              <p className='font-medium'>Status</p>
              {statuses.map((status) => {
                const { title, id } = status;
                const disabled = id === 'passed' && isDisabled;
                return (
                  <div
                    key={id}
                    className={`${disabled && 'opacity-75'} flex items-center gap-4 text-indigo-dye text-[15px]`}
                  >
                    <input
                      onChange={(e) => setValue('status', e.target.id)}
                      defaultChecked={applicant?.status === id}
                      checked={disabled ? false : getValues('status') === id ? true : undefined}
                      disabled={disabled}
                      id={id}
                      type='radio'
                      name='status'
                      className='w-5 h-5'
                    />
                    <label htmlFor={id}>
                      {title == 'Passed' ? (actionState.isFinalStage ? 'Hired' : title) : title}
                    </label>
                  </div>
                );
              })}
              {/* Stage Notes Tabs */}
              <div className='grid gap-4 mb-8'>
                <p className='font-medium'>Stage Notes</p>

                {/* Tabs */}
                <div className='flex border-b border-gray-200'>
                  {allStages.map((stage) => {
                    const stageNote = getStageNote(stage.id);
                    const isActive = activeTab === stage.id;
                    const hasNotes = stageNote && stageNote.notes.trim() !== '';

                    return (
                      <button
                        key={stage.id}
                        type='button'
                        onClick={() => handleTabClick(stage.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                          isActive
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className='flex items-center gap-2'>
                          <span>{stage.title}</span>
                          {hasNotes && <div className='w-2 h-2 bg-blue-500 rounded-full'></div>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className='mt-4'>
                  {activeTab && (
                    <div>
                      {activeTab === actionState.stageId ? (
                        // Current stage - editable
                        <textarea
                          value={currentStageNotes}
                          onChange={(e) => setCurrentStageNotes(e.target.value)}
                          placeholder='Add your notes for this specific stage...'
                          className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                          rows={4}
                        />
                      ) : (
                        // Previous stages - read-only
                        <div className='p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px]'>
                          {(() => {
                            const stageNote = getStageNote(activeTab);
                            if (stageNote && stageNote.notes.trim() !== '') {
                              return (
                                <div>
                                  <p className='text-gray-600 text-sm whitespace-pre-wrap'>{stageNote.notes}</p>
                                  {stageNote.created_at && (
                                    <p className='text-xs text-gray-400 mt-2'>
                                      Added: {new Date(stageNote.created_at).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              );
                            } else {
                              return <p className='text-gray-400 text-sm italic'>No notes available for this stage.</p>;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr />
          <ModalFooterLayout>
            <button
              onClick={handleClose}
              type='button'
              className='border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]'
            >
              Close
            </button>
            <button type='submit' className='rounded-lg py-2 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd]'>
              Update
            </button>
          </ModalFooterLayout>
        </form>
      </ModalLayout>
      {!hasActiveSubscription && (
        <ScreenApplicantGoPremiumModal isOpen={isGoPremiumModalOpen} setIsOpen={handlePremiumModalClose} />
      )}
    </>
  );
}
