'use client';

import React, { useState } from 'react';

import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import { formatDateToLocal } from '@/helpers/date';
import StageTaskChecklist from '../../components/StageTaskChecklist';
import useUpdateSeparationFields from '../hooks/useUpdateSeparationFields';

import { SeparationPhase } from '../../functions/separationPhase';

type Props = {
  separation: any;
  currentPhase: SeparationPhase;
  onTasksChange?: (hasAny: boolean, allComplete: boolean) => void;
  onSave?: () => void;
};

const RenderingStage = ({ separation, currentPhase, onTasksChange, onSave }: Props) => {
  const effectiveDate = separation.effective_date || separation.date_of_separation;
  const isEffectiveDateSet = !!separation.effective_date;
  const showDatePicker = !isEffectiveDateSet && currentPhase === 'Rendering';

  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const { mutate: updateFields, isLoading: isSaving } = useUpdateSeparationFields(String(separation.id));

  const daysRemaining = effectiveDate
    ? Math.max(0, Math.ceil((new Date(effectiveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleDateConfirm = () => {
    if (!pickedDate) return;
    const iso = pickedDate.toLocaleDateString('en-CA');
    updateFields(
      { effective_date: iso },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast type='success' message='Last Working Day saved.' />);
          onSave?.();
        },
        onError: () => {
          toast.custom(() => <CustomToast type='error' message='Failed to save Last Working Day.' />);
        },
      }
    );
  };

  return (
    <div className='space-y-5'>
      {/* Rendering Period Info */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
        <h3 className='text-sm font-semibold text-gray-900 mb-4'>Rendering Period</h3>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'>
            <CalendarDaysIcon className='h-5 w-5 text-gray-400 mt-0.5' />
            <div>
              <p className='text-xs text-gray-500'>Separation Date</p>
              <p className='text-sm font-semibold text-gray-800 mt-0.5'>{formatDateToLocal(separation.date_of_separation)}</p>
            </div>
          </div>

          <div className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg overflow-visible'>
            <CalendarDaysIcon className='h-5 w-5 text-gray-400 mt-0.5' />
            <div className='flex-1'>
              <p className='text-xs text-gray-500'>Last Working Day</p>
              {showDatePicker ? (
                <div className='mt-1 flex items-center gap-2' style={{ position: 'relative', zIndex: 50 }}>
                  <div className='relative flex-1'>
                    <CustomDatePicker
                      id='rendering-last-working-day'
                      selected={pickedDate}
                      pickerOnChange={(date: Date | null) => setPickedDate(date)}
                      inputOnChange={(date: Date | null) => setPickedDate(date)}
                      placeholder='Pick a date'
                      className='text-sm border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:border-indigo-400'
                    />
                  </div>
                  <button
                    onClick={handleDateConfirm}
                    disabled={!pickedDate || isSaving}
                    className='text-xs px-2.5 py-1.5 bg-savoy-blue text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'
                  >
                    {isSaving ? 'Saving…' : 'Set'}
                  </button>
                </div>
              ) : (
                <p className='text-sm font-semibold text-gray-800 mt-0.5'>{effectiveDate ? formatDateToLocal(effectiveDate) : '—'}</p>
              )}
            </div>
          </div>
        </div>

        {daysRemaining !== null && daysRemaining > 0 && (
          <div className='mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100'>
            <ClockIcon className='h-5 w-5 text-blue-500 flex-shrink-0' />
            <div>
              <p className='text-sm font-semibold text-blue-800'>{daysRemaining} days remaining</p>
              <p className='text-xs text-blue-600'>Until last working day</p>
            </div>
          </div>
        )}
      </div>

      <StageTaskChecklist separationId={separation.id} stage="rendering" title="Rendering Tasks" onTasksChange={onTasksChange} />
    </div>
  );
};

export default RenderingStage;
